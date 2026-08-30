# Kisaan.ai — Pitch MVP

A responsive, interactive Next.js demonstration of a voice-first farming companion designed for growers across Pakistan.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`, then select **Try the demo**. The demo includes an AI crop-doctor flow, satellite field-health view, localized weather and risk alerts, crop planning, voice interaction states, offline-queue messaging, Urdu mode, and representative regional contexts for Sindh, Punjab, Khyber Pakhtunkhwa, Balochistan, and Gilgit-Baltistan.

## Pitch note

The crop-doctor journey now sends a real uploaded image through a validated server API. With Alibaba Cloud Model Studio configured it uses Qwen3-VL for live visual assessment; without credentials it returns an explicitly labelled safe demo response. Weather, satellite monitoring, authentication, and conversational speech remain representative prototype experiences rather than live services.

## Enable live crop assessment

1. Activate Alibaba Cloud Model Studio in Singapore and create an API key.
2. Copy `.env.example` to `.env.local`.
3. Add the API key and replace `YOUR_WORKSPACE_ID` in the workspace endpoint.
4. Restart the development server.

Never expose the API key through a `NEXT_PUBLIC_` variable or commit `.env.local`. The browser uploads to `POST /api/diagnose`; only the server communicates with Model Studio. Accepted formats are JPG, PNG, and WebP up to 5 MB.

The response deliberately calls its score a non-calibrated visual match, abstains when evidence is insufficient, avoids pesticide prescriptions, and records the provider, model, and request ID. This is decision support—not a laboratory diagnosis or a replacement for a local crop expert.

## Commands

- `npm run dev` — development server
- `npm run build` — verified production build
- `npm start` — serve the production build
- `npm test` — safety and validation tests
