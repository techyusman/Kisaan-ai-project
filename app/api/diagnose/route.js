import { NextResponse } from "next/server";
import { demoAssessment, normalizeAssessment, validateImage, validateImageSignature } from "../../../lib/diagnosis";

export const runtime = "nodejs";

const rateLimitStore = globalThis.__kisaanRateLimits || new Map();
globalThis.__kisaanRateLimits = rateLimitStore;
const RATE_LIMIT = 10;
const RATE_WINDOW_MS = 10 * 60 * 1000;

function checkRateLimit(request) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const key = forwarded || request.headers.get("x-real-ip") || "local";
  const now = Date.now();
  const current = rateLimitStore.get(key);
  if (!current || now >= current.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return null;
  }
  current.count += 1;
  if (current.count > RATE_LIMIT) return Math.max(1, Math.ceil((current.resetAt - now) / 1000));
  return null;
}

function extractJson(content) {
  const cleaned = content.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  return JSON.parse(cleaned);
}

export async function POST(request) {
  const requestId = crypto.randomUUID();
  try {
    const retryAfter = checkRateLimit(request);
    if (retryAfter) return NextResponse.json({ error: "Too many assessments. Please wait before trying again.", requestId }, { status: 429, headers: { "Retry-After": String(retryAfter) } });
    const form = await request.formData();
    const image = form.get("image");
    const crop = String(form.get("crop") || "Unknown crop").slice(0, 80);
    const validationError = validateImage(image);
    if (validationError) return NextResponse.json({ error: validationError, requestId }, { status: 400 });
    const bytes = Buffer.from(await image.arrayBuffer());
    const signatureError = validateImageSignature(bytes, image.type);
    if (signatureError) return NextResponse.json({ error: signatureError, requestId }, { status: 400 });

    if (!process.env.DASHSCOPE_API_KEY || !process.env.DASHSCOPE_BASE_URL) {
      return NextResponse.json(demoAssessment({ requestId }));
    }

    const dataUrl = `data:${image.type};base64,${bytes.toString("base64")}`;
    const model = process.env.DASHSCOPE_MODEL || "qwen3-vl-plus";
    const baseUrl = process.env.DASHSCOPE_BASE_URL.replace(/\/$/, "");
    const providerResponse = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.DASHSCOPE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        temperature: 0.1,
        messages: [{ role: "user", content: [
          { type: "image_url", image_url: { url: dataUrl } },
          { type: "text", text: `You are a cautious crop visual-assessment assistant. The farmer identifies the crop as ${crop}, but you must verify whether the visible morphology is consistent with that claim. Assess only visible evidence. If the image is unclear, not a crop, shows a different crop, or evidence is insufficient, use status uncertain and do not name a disease. Never prescribe pesticides, chemicals, or dosages. Write every field in clear English only; never mix in Chinese or another language. Put spaces after punctuation and between words. Express number ranges with words, for example "3 to 5", never "35" or a dash. Return JSON only: {"status":"likely|uncertain","condition":"short name or null","visualMatch":0-100,"imageQuality":"Good|Fair|Poor","explanation":"visible evidence and limitation","nextSteps":["2 to 4 safe actions"]}. visualMatch is a visual similarity estimate, not calibrated diagnostic confidence.` },
        ] }],
      }),
      signal: AbortSignal.timeout(30000),
    });
    if (!providerResponse.ok) throw new Error(`Vision provider returned ${providerResponse.status}`);
    const payload = await providerResponse.json();
    const assessment = extractJson(payload.choices?.[0]?.message?.content || "");
    return NextResponse.json(normalizeAssessment(assessment, { requestId, mode: "live", provider: "Alibaba Cloud Model Studio", model }));
  } catch (error) {
    console.error("diagnosis_failed", { requestId, message: error.message });
    return NextResponse.json({ error: "The visual assessment service is temporarily unavailable. No diagnosis was produced.", requestId }, { status: 502 });
  }
}
