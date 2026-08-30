export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export const ACCEPTED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export function cleanAssessmentText(value) {
  return String(value || "")
    .normalize("NFKC")
    .replace(/杂草/gu, "weed")
    .replace(/[\u3400-\u4DBF\u4E00-\u9FFF]/gu, "")
    .replace(/\b([1-9])([1-9]) lobes\b/gi, "$1 to $2 lobes")
    .replace(/([a-z]{4,})(but|because|however)\b/gi, "$1 $2")
    .replace(/\s+([,.;:])/g, "$1")
    .replace(/\s{2,}/g, " ")
    .trim();
}

export function validateImage(file) {
  if (!file || typeof file.arrayBuffer !== "function") return "An image is required.";
  if (!ACCEPTED_IMAGE_TYPES.has(file.type)) return "Only JPG, PNG, and WebP images are supported.";
  if (file.size === 0) return "The image is empty.";
  if (file.size > MAX_IMAGE_BYTES) return "The image must be smaller than 5 MB.";
  return null;
}

export function validateImageSignature(bytes, declaredType) {
  if (!bytes || bytes.length < 12) return "The image file is incomplete.";
  const isJpeg = bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  const isPng = bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47;
  const isWebp = String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" && String.fromCharCode(...bytes.slice(8, 12)) === "WEBP";
  const matches = (declaredType === "image/jpeg" && isJpeg) || (declaredType === "image/png" && isPng) || (declaredType === "image/webp" && isWebp);
  return matches ? null : "The file contents do not match its image format.";
}

export function normalizeAssessment(value, metadata) {
  const uncertain = value.status !== "likely" || !value.condition;
  const steps = Array.isArray(value.nextSteps) ? value.nextSteps.filter(Boolean).slice(0, 4) : [];
  return {
    status: uncertain ? "uncertain" : "likely",
    condition: uncertain ? "Unable to identify safely" : cleanAssessmentText(value.condition).slice(0, 100),
    visualMatch: uncertain ? null : Math.max(0, Math.min(100, Number(value.visualMatch) || 0)),
    imageQuality: ["Good", "Fair", "Poor"].includes(value.imageQuality) ? value.imageQuality : "Fair",
    explanation: cleanAssessmentText(value.explanation || "The visible evidence is not sufficient for a safe assessment.").slice(0, 500),
    nextSteps: steps.length ? steps.map(step => cleanAssessmentText(step)) : ["Take clearer photos of both sides of the leaf.", "Ask a local crop expert before applying treatment."],
    ...metadata,
  };
}

export function demoAssessment(metadata) {
  return normalizeAssessment({
    status: "uncertain",
    imageQuality: "Fair",
    explanation: "No live vision provider is configured. This response proves the upload, validation, API, and safe fallback path without pretending that AI inference occurred.",
    nextSteps: ["Add a DashScope API key to enable live visual assessment.", "Inspect nearby plants and photograph both sides of an affected leaf.", "Consult a local crop expert before applying treatment."],
  }, { ...metadata, mode: "demo", provider: "Kisaan safe fallback", model: "no-live-model" });
}
