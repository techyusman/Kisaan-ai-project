import test from "node:test";
import assert from "node:assert/strict";
import { cleanAssessmentText, demoAssessment, normalizeAssessment, validateImage, validateImageSignature } from "../lib/diagnosis.js";

test("rejects unsupported image types", () => {
  assert.match(validateImage(new File(["x"], "leaf.gif", { type: "image/gif" })), /Only JPG/);
});

test("uncertain assessments never expose a confidence-like score", () => {
  const result = normalizeAssessment({ status: "uncertain", visualMatch: 94 }, { requestId: "test" });
  assert.equal(result.visualMatch, null);
  assert.equal(result.status, "uncertain");
});

test("demo mode clearly identifies that no live model ran", () => {
  const result = demoAssessment({ requestId: "test" });
  assert.equal(result.mode, "demo");
  assert.equal(result.model, "no-live-model");
  assert.match(result.explanation, /No live vision provider/);
});

test("cleans mixed-language, merged, and ambiguous range output", () => {
  const cleaned = cleanAssessmentText("Leaves have 35 lobes and show stressbut 杂草 is nearby.");
  assert.equal(cleaned, "Leaves have 3 to 5 lobes and show stress but weed is nearby.");
});

test("rejects a file whose bytes do not match its claimed image type", () => {
  const fakePng = new Uint8Array([0x47, 0x49, 0x46, 0x38, 0, 0, 0, 0, 0, 0, 0, 0]);
  assert.match(validateImageSignature(fakePng, "image/png"), /do not match/);
});

test("accepts a PNG signature", () => {
  const png = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 0]);
  assert.equal(validateImageSignature(png, "image/png"), null);
});
