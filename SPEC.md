# Kisaan.ai — Software Requirements and Technical Specification

**Document status:** Draft baseline for review  
**Version:** 0.1  
**Date:** 24 August 2026  
**Source of truth:** `Kisaan-ai-project-brief.docx`  
**Project type:** Final Year Project (BS Computer Science)  
**Institution:** Sukkur IBA University, BBSIMS Campus, Dadu

## 1. Document purpose

This document translates the Kisaan.ai project brief into an implementable and testable product specification. It defines the product scope, users, functional requirements, system behavior, architecture, data, machine-learning workflows, quality attributes, validation plan, risks, and delivery criteria.

The repository contains no implementation at the time of writing. Consequently:

- statements explicitly present in the project brief are treated as **confirmed**;
- implementation details needed to make the brief actionable are marked **proposed**;
- decisions that require research, stakeholder input, agronomic validation, or field testing are marked **TBD**.

This distinction must be preserved as the project evolves. A proposed value is not an approved requirement until accepted by the team and supervisor.

## 2. Product overview

Kisaan.ai is a voice-first Android farming assistant for smallholder growers in Sindh, initially focused on Dadu district. A farmer interacts in Urdu or Sindhi, receives spoken answers, photographs unhealthy plants for disease assessment, registers field boundaries for satellite-based crop-health monitoring, receives weather and flood alerts, and requests crop recommendations based on local conditions.

The primary design constraint is accessibility: all core features must be usable without English literacy or typed input. The target environment includes low-end Android devices and intermittent or low-bandwidth connectivity. The mobile client therefore remains thin, while model inference, remote-sensing processing, and durable data storage run on server-side infrastructure.

### 2.1 Product vision

Enable growers who lack timely access to independent agronomic advice to make earlier and better-informed crop, disease, irrigation, and risk decisions through a simple spoken conversation.

### 2.2 Goals

1. Make every in-scope capability reachable by voice in Urdu and Sindhi.
2. Return every advisory answer as speech, with a minimal visual equivalent for accessibility and recovery.
3. Identify supported crop diseases from field photographs and communicate calibrated uncertainty.
4. Monitor registered plots using Sentinel-2 NDVI time series.
5. proactively notify farmers of relevant weather, heat, heavy-rain, and flood risks.
6. provide an initial crop recommendation using season, soil, water availability, and plot history.
7. evaluate the system with actual growers in Dadu district.
8. create a consent-based feedback loop in which reviewed farmer images improve later disease-model versions.

### 2.3 Non-goals for the FYP

The following are explicitly outside scope:

- pest identification beyond included disease classes;
- weed identification;
- market-price information or forecasting;
- purchase or sale of agricultural inputs;
- yield forecasting;
- hardware integrations, including soil sensors;
- fully autonomous diagnosis or pesticide prescription without uncertainty and safety messaging;
- iOS and desktop clients;
- nationwide crop and language coverage.

## 3. Stakeholders and responsibilities

| Stakeholder | Role / responsibility |
|---|---|
| Smallholder grower | Primary user; registers fields, asks questions, submits images, receives advice and alerts |
| Muhammad Yousif Khan | Project lead; architecture, backend, model training, and integration |
| Umaid Ali Lund | Android application and voice interface |
| Rizwan Lund | Remote-sensing pipeline, data collection, and evaluation |
| Ms. Asia Memon | Project supervisor and scope reviewer |
| Agronomic reviewer (TBD) | Validates disease labels, treatment guidance, alert rules, and crop recommendations |
| System administrator (proposed) | Maintains content, reviews failed jobs, manages model releases, and supports human-review workflow |

## 4. Users and operating context

### 4.1 Primary persona

A grower in or near Dadu managing approximately five to ten acres, using a low-end Android phone, possibly with limited reading ability, unreliable mobile data, and little direct access to an agronomist. The grower primarily speaks Sindhi or Urdu and needs brief, actionable answers.

### 4.2 Secondary personas

- an agronomist or trained reviewer who verifies uncertain disease submissions and advice;
- a project researcher who labels consented images and measures model quality;
- an administrator who monitors integrations, alerts, and processing failures.

### 4.3 Environmental constraints

- bright outdoor light, wind, machinery, and background speech can degrade capture quality;
- field images may be blurred, poorly framed, shadowed, or contain multiple leaves;
- connectivity can disappear during an upload or conversation;
- devices may have limited memory, storage, CPU, and battery;
- satellite observations may be unavailable during monsoon cloud cover;
- Sindhi speech technology and agricultural-domain corpora are limited.

## 5. Scope and release definition

### 5.1 Minimum FYP release

The FYP release is complete only when it demonstrates an integrated Android-to-backend workflow containing:

- Urdu and Sindhi speech input and spoken output;
- supported-intent detection and graceful handling of unsupported speech;
- disease classification for cotton, wheat, rice, and sugarcane;
- confidence-aware disease advice and low-confidence escalation;
- field-boundary registration;
- Sentinel-2 NDVI history for each registered field;
- weather, heat, heavy-rain, and flood alert delivery;
- a first crop-recommendation workflow;
- offline request queuing for operations that can safely be deferred;
- measurable evaluation of vision, speech, remote sensing, and farmer usability.

### 5.2 Delivery priority

| Priority | Capability |
|---|---|
| P0 | identity/onboarding, language selection, voice loop, disease photo flow, field registration, NDVI status, weather/flood alerts, crop recommendation, offline queue, consent and safety behavior |
| P1 | human review response, advisory history, notification preferences, administrative review tools, model/data monitoring |
| P2 | richer NDVI visualization, multiple seasonal comparisons, improved conversational context, advanced personalization |

## 6. Core user journeys

### 6.1 First-time onboarding

1. The app explains its purpose, limitations, required permissions, and privacy choices using speech and simple visuals.
2. The farmer selects Urdu or Sindhi; the selection can later be changed by voice or in settings.
3. The farmer registers or signs in using the approved identity method (**TBD**; proposed: verified phone number with a locally suitable fallback).
4. The app requests microphone access only before voice capture, camera access before diagnosis, location access before location-dependent services, and notification permission before alerts.
5. The farmer separately chooses whether submitted images may be retained for model improvement.
6. The app offers to register the first field but permits this step to be skipped.

### 6.2 Spoken request

1. The farmer presses and holds, taps, or uses another explicit control to begin recording (**wake-word listening is out of scope unless separately approved**).
2. The app clearly indicates recording state and permits cancellation.
3. Audio is transcribed in the selected language.
4. The transcript and language are used to identify a supported intent.
5. If confidence is insufficient, the system asks a short clarifying question or states that it did not understand.
6. The selected module produces a concise, localized answer.
7. The app speaks the answer and displays its text and any necessary visual result.

### 6.3 Disease assessment

1. The farmer asks to check a plant or opens the camera flow.
2. The app gives spoken capture guidance and checks basic image quality.
3. The farmer confirms the crop, or the system requests it when unknown.
4. The image is uploaded immediately or placed in the offline queue.
5. The backend validates, scans, stores as permitted, and runs the currently approved model.
6. The response includes crop, likely condition, confidence/uncertainty, safe next actions, warning signs, and model version.
7. A low-confidence, unsupported, or invalid result must not be presented as a diagnosis; the system requests another image or offers human review.
8. The farmer may later report the real outcome, subject to review, to improve the dataset.

### 6.4 Field registration and monitoring

1. The farmer names a field and traces its boundary on a map or walks/captures boundary points (**final UX TBD**).
2. The client previews the polygon and estimated area.
3. The backend validates geometry and stores the field.
4. A processing job obtains cloud-filtered Sentinel-2 observations through Google Earth Engine.
5. The system computes per-field NDVI statistics and quality metadata.
6. The farmer can ask whether the field is healthy and receive a current status, trend, observation date, and data-quality caveat.

### 6.5 Proactive alert

1. A scheduled process obtains forecasts and flood-risk information for each farmer/field location.
2. Rules determine whether an event is relevant, new, severe enough, and not a duplicate.
3. The backend creates a localized advisory and sends a mobile notification.
4. Opening the alert causes the app to speak it, subject to user audio preferences; background autoplay is not assumed.
5. The alert records delivery state and expiry.

### 6.6 Crop recommendation

1. The farmer requests planting advice and selects a field.
2. The system gathers season/date, location, soil type, available water, and recent usable NDVI history.
3. Missing high-impact inputs are requested through short spoken questions.
4. A transparent, agronomist-approved ruleset or interpretable model ranks supported crops.
5. The app speaks the recommendation, key reasons, assumptions, and major risks; it does not guarantee yield or profit.

## 7. Functional requirements

“Must” denotes an FYP release requirement. “Should” denotes a desired requirement that may be deferred only through an explicit scope decision.

### 7.1 Accounts, profile, and consent

- **FR-ACC-001:** The system must maintain a unique farmer profile.
- **FR-ACC-002:** The profile must store preferred language, locality/location as permitted, notification preferences, consent versions, and created/updated timestamps.
- **FR-ACC-003:** The system must support secure session renewal and sign-out.
- **FR-ACC-004:** The user must be able to revoke optional image-reuse consent without losing access to core functionality.
- **FR-ACC-005:** Consent for service processing and consent for ML reuse must be separate and auditable.
- **FR-ACC-006:** The user must be able to request account and associated personal-data deletion, subject to documented legal or research-retention obligations.

### 7.2 Language and voice conversation

- **FR-VOI-001:** All P0 functions must be discoverable and executable in Urdu and Sindhi without typed input.
- **FR-VOI-002:** Every advisory response must have localized spoken output.
- **FR-VOI-003:** The client must expose recording, processing, playback, error, and offline states without relying on text alone.
- **FR-VOI-004:** Every speech result must retain language, transcript, STT confidence when available, provider/model version, and latency for evaluation.
- **FR-VOI-005:** Intent routing must support at least disease assessment, field health, weather, flood risk, crop recommendation, field registration/help, language change, and repeat/cancel.
- **FR-VOI-006:** Low-confidence transcription or intent routing must trigger clarification instead of an unrelated advisory.
- **FR-VOI-007:** Users must be able to replay, pause, stop, and repeat spoken responses.
- **FR-VOI-008:** The app must fall back clearly when Sindhi recognition is unavailable; automatic fallback to Urdu must require user confirmation or an explicit configured preference.
- **FR-VOI-009:** The system must safely reject unsupported intents and direct the user to available capabilities.
- **FR-VOI-010:** Response wording must be concise, respectful, locally understandable, and reviewed by fluent speakers.

### 7.3 Disease image assessment

- **FR-DIS-001:** The classifier must cover approved disease/healthy classes for cotton, wheat, rice, and sugarcane. The exact class taxonomy is **TBD** and must be versioned before dataset collection.
- **FR-DIS-002:** The client must accept a camera image and should allow selection of an existing image.
- **FR-DIS-003:** The system must validate file type, size, decodability, and minimum image quality before inference.
- **FR-DIS-004:** The result must contain predicted condition, calibrated confidence, result category, model version, and localized advice.
- **FR-DIS-005:** The result category must distinguish at least `confident`, `uncertain`, `unsupported_crop`, `invalid_image`, and `service_unavailable`.
- **FR-DIS-006:** The operational confidence threshold must be selected from validation data, documented per model release, and never hard-coded only in the client.
- **FR-DIS-007:** Uncertain results must recommend recapture and/or human review rather than treatment based on the top class.
- **FR-DIS-008:** Treatment content must be approved by a qualified local agronomic reviewer and must include relevant safety/escalation language.
- **FR-DIS-009:** The system must preserve the original result and model version so a later model update does not rewrite historical advice.
- **FR-DIS-010:** Human-reviewed labels must be separated from self-reported outcomes and unverified predictions.

### 7.4 Fields and satellite monitoring

- **FR-FLD-001:** A farmer must be able to create, list, rename, update, and archive owned fields.
- **FR-FLD-002:** Each field must include a valid polygon in WGS 84 (`EPSG:4326`), location metadata, estimated area, and ownership.
- **FR-FLD-003:** The API must reject self-intersecting, empty, out-of-service-area, or implausibly large/small polygons using configurable limits.
- **FR-FLD-004:** Only authorized users may access a field or its observations.
- **FR-NDV-001:** The backend must obtain Sentinel-2 imagery through Google Earth Engine for each active field.
- **FR-NDV-002:** NDVI must be calculated as `(NIR - Red) / (NIR + Red)`, using Sentinel-2 B8 and B4 consistently.
- **FR-NDV-003:** Cloud and cloud-shadow pixels must be masked with a documented algorithm; every observation must retain usable-pixel coverage.
- **FR-NDV-004:** A field observation must retain acquisition date, computed date, mean/median NDVI as approved, dispersion or percentiles, usable coverage, source, and processing version.
- **FR-NDV-005:** The farmer-facing result must report observation age and whether cloud/coverage limitations reduce reliability.
- **FR-NDV-006:** A “healthy” or “stressed” interpretation must use a validated crop/season-aware baseline; raw universal NDVI cutoffs must not be described as a diagnosis.
- **FR-NDV-007:** Missing observations must not be silently interpolated. Any composite or gap-filled value must be labeled and retain provenance.
- **FR-NDV-008:** Processing must be idempotent so retries do not duplicate observations.

### 7.5 Weather and flood alerts

- **FR-ALT-001:** The system must use a documented forecast source and flood-risk source; provider selection is **TBD**.
- **FR-ALT-002:** Alert rules must cover heavy rain, extreme heat, flood risk, and irrigation-relevant forecast changes.
- **FR-ALT-003:** Thresholds must be configurable by event type and reviewed for Dadu rather than embedded in app code.
- **FR-ALT-004:** Alerts must contain event type, affected location/field, severity, expected start/end, issue time, source, recommended action, and uncertainty when available.
- **FR-ALT-005:** The system must suppress duplicate alerts while allowing material escalation updates.
- **FR-ALT-006:** Alerts must expire and must not be presented as current after expiry.
- **FR-ALT-007:** Users must be able to disable non-critical categories and choose language; emergency communication rules remain subject to local policy.
- **FR-ALT-008:** Failed push delivery must be recorded and retried using bounded backoff.

### 7.6 Crop recommendation

- **FR-REC-001:** Recommendations must use season, field/location, soil type, water availability, and recent NDVI history when reliable.
- **FR-REC-002:** Missing or stale data must be disclosed and must lower recommendation confidence.
- **FR-REC-003:** The output must provide ranked supported options, principal reasons, constraints, confidence/strength of evidence, and a disclaimer.
- **FR-REC-004:** Every output must record input snapshot, rule/model version, and generated recommendation for reproducibility.
- **FR-REC-005:** Recommendation logic and crop knowledge must be approved by an agronomic reviewer before farmer testing.
- **FR-REC-006:** The first version should favor an explainable rules or scoring system over an opaque predictive model unless sufficient representative outcome data exists.

### 7.7 Offline and synchronization behavior

- **FR-OFF-001:** The client must queue image uploads, feedback, and other safely deferrable requests when connectivity is unavailable.
- **FR-OFF-002:** Each queued operation must have a stable client-generated idempotency key.
- **FR-OFF-003:** The user must be told that a request is queued and must not hear a fabricated server result.
- **FR-OFF-004:** The queue must persist across application restarts and use bounded retries with exponential backoff.
- **FR-OFF-005:** Authentication expiry, permanent validation failure, and retryable network failure must be distinguishable.
- **FR-OFF-006:** Sensitive queued data must be encrypted using Android platform-provided secure storage mechanisms.
- **FR-OFF-007:** The user must be able to cancel a queued item before upload.

### 7.8 History, feedback, and administration

- **FR-HIS-001:** Farmers should be able to retrieve recent advisories, diagnoses, field statuses, and alerts.
- **FR-FBK-001:** A farmer may submit an outcome or request review for a disease assessment.
- **FR-FBK-002:** Only authorized reviewers may promote an image/outcome to a verified training label.
- **FR-FBK-003:** Dataset exports must include only consented eligible records and must record the export manifest/version.
- **FR-ADM-001:** An administrator should be able to review uncertain cases, failed jobs, integration health, model versions, and advisory content versions.
- **FR-ADM-002:** Privileged changes must be written to an immutable audit trail.

## 8. Decision and safety rules

1. The system is decision support, not a substitute for direct examination by a qualified expert.
2. A model probability is not automatically a clinically or agronomically meaningful confidence; confidence must be calibrated on representative held-out field data.
3. Low-confidence or out-of-distribution images produce an uncertainty response, never a definitive disease name and chemical action.
4. Advice must prioritize integrated pest/disease management and safe escalation. Specific chemical recommendations require local registration, dose, crop-stage, pre-harvest, protective-equipment, and resistance-management review.
5. Satellite status describes vegetation signals and possible stress; it does not determine a disease cause.
6. Forecast and flood alerts state source time and uncertainty and must not claim guaranteed outcomes.
7. Crop recommendations disclose missing inputs and must not promise yield, revenue, or profit.
8. Human-reviewed content and configurable thresholds must be versioned and auditable.

## 9. Proposed system architecture

The brief confirms a thin Android client, REST backend/model serving, server-side storage, CNN vision model, and Google Earth Engine/Sentinel-2 processing. The following decomposition is proposed and may initially be deployed as a modular monolith plus background workers.

```text
Android client
  ├─ voice capture/playback, camera, map, local encrypted queue
  └─ HTTPS REST API + push notification registration
                 │
API/backend
  ├─ authentication and authorization
  ├─ conversation/intent orchestration
  ├─ farmer, field, advisory and consent services
  ├─ disease inference service
  ├─ recommendation service
  └─ job scheduler/queue
       ├─ STT/TTS provider or hosted models
       ├─ Google Earth Engine / Sentinel-2 worker
       ├─ weather and flood data providers
       └─ notification provider
                 │
Persistence
  ├─ relational database with geospatial support
  ├─ private object storage for audio/images/model artifacts
  └─ metrics, structured logs and audit records
```

### 9.1 Architectural principles

- HTTPS API boundaries and short-lived authenticated sessions;
- asynchronous jobs for satellite processing, notifications, and slow inference;
- provider adapters to avoid coupling domain logic to one speech/weather service;
- server-controlled model, threshold, rule, and content versions;
- idempotency for mobile retries and scheduled processing;
- minimum collection and minimum retention of sensitive data;
- observable failure states, without exposing personal or media data in logs.

### 9.2 Technology decisions still required

The brief does not select an Android framework, backend language/framework, database, queue, hosting platform, notification service, speech engine, weather/flood provider, object store, or pretrained vision backbone. These choices must be recorded as Architecture Decision Records after feasibility prototypes. They must not be treated as already approved by this specification.

## 10. Proposed domain model

All identifiers should be non-sequential opaque UUIDs. All timestamps should be stored in UTC and rendered in the user's local timezone.

| Entity | Required information |
|---|---|
| `Farmer` | id, preferred language, status, locality/location precision, timestamps |
| `ConsentRecord` | farmer id, purpose, policy version, granted/revoked state and timestamps |
| `Device` | farmer id, push token reference, platform/app version, last seen |
| `Field` | owner id, name, WGS84 polygon, calculated area, soil type, water availability, status |
| `Season/CropCycle` | field id, crop, variety if known, sowing/expected harvest dates, status |
| `VoiceInteraction` | farmer id, language, transcript, STT/intent metadata, timestamps; audio reference only when consent/retention permits |
| `ImageSubmission` | farmer/field/crop, private object reference, quality result, consent eligibility, checksum, timestamps |
| `Diagnosis` | submission id, predicted class, calibrated confidence, category, model/threshold version, advisory version |
| `Review` | diagnosis id, reviewer, verified label/outcome, evidence/status, timestamps |
| `NdviObservation` | field id, acquisition window, statistics, usable-pixel ratio, source and processor version |
| `ForecastSnapshot` | provider, location/grid, issue/valid times, normalized measures, payload provenance |
| `Alert` | farmer/field, category, severity, validity window, localized message, source, deduplication key, delivery state |
| `Recommendation` | field id, input snapshot, ranked crops, explanations, confidence, rules/model/content version |
| `Advisory` | linked module result, language, text/audio reference, version, created time |
| `AuditEvent` | actor, action, resource, result, timestamp, correlation id |

### 10.1 Data integrity

- records referenced by historical advice must not be destructively overwritten;
- media checksum and metadata should support duplicate detection and dataset lineage;
- derived data must retain source and processor/model version;
- deletes should revoke access promptly, then remove data through a documented retention workflow;
- training, validation, and test splits must be isolated by farm/source where possible to prevent near-duplicate leakage.

## 11. Proposed REST API contract

Exact paths may change, but equivalent capabilities and semantics are required. JSON uses UTF-8. Media uploads should use multipart upload or signed object-upload URLs. Errors should follow a consistent structure containing `code`, localized-safe `message`, `correlation_id`, and optional field details.

| Method and path | Purpose |
|---|---|
| `POST /v1/auth/start`, `POST /v1/auth/verify` | Begin and verify sign-in (**mechanism TBD**) |
| `GET/PATCH /v1/me` | Read/update farmer profile and preferences |
| `GET/POST /v1/consents` | Record and inspect versioned consent |
| `POST /v1/voice/transcriptions` | Transcribe uploaded speech |
| `POST /v1/conversations/turns` | Route a transcript/intent and create an advisory |
| `POST /v1/speech` | Produce localized speech for approved text/content |
| `GET/POST /v1/fields` | List/create fields |
| `GET/PATCH/DELETE /v1/fields/{field_id}` | Read/update/archive owned field |
| `GET /v1/fields/{field_id}/ndvi` | Retrieve quality-qualified NDVI history/status |
| `POST /v1/diagnoses` | Submit image metadata/crop and request assessment |
| `GET /v1/diagnoses/{id}` | Poll asynchronous result or retrieve completed result |
| `POST /v1/diagnoses/{id}/reviews` | Request review or provide farmer outcome |
| `GET /v1/weather` | Retrieve current approved forecast summary for a location/field |
| `GET /v1/alerts` | Retrieve active/recent alerts |
| `POST /v1/devices` | Register or rotate a push-notification token |
| `POST /v1/recommendations` | Generate a versioned crop recommendation |
| `GET /v1/advisories` | Retrieve farmer advisory history |
| `DELETE /v1/me` | Initiate account/data deletion workflow |

### 11.1 API behavior

- mutating client requests must accept an idempotency key;
- asynchronous endpoints return `202 Accepted`, a job/resource id, and observable state;
- states should include `queued`, `processing`, `completed`, `failed_retryable`, `failed_permanent`, and `cancelled` where applicable;
- endpoints must enforce ownership at the server, never only in the client;
- rate and payload limits must be documented and surfaced with recoverable client messages;
- backward-incompatible changes require a new API version.

## 12. Machine-learning and data specification

### 12.1 Speech pipeline

The speech prototype must compare candidate multilingual or language-specific STT/TTS approaches on real Dadu-area voices and agricultural vocabulary. Evaluation sets must include both Urdu and Sindhi, multiple speakers, genders/ages where feasible, code-switching, phone microphones, and representative outdoor noise.

Required measurements:

- word error rate (WER) and character error rate (CER) by language;
- agricultural keyword/slot recall;
- intent accuracy and confusion matrix;
- failure rate and latency under target network conditions;
- TTS intelligibility and naturalness ratings from target users.

No numeric pass threshold is confirmed in the brief. Targets must be established after a baseline study and approved before final evaluation.

### 12.2 Disease classifier

The classifier will use transfer learning from a pretrained CNN-compatible vision backbone and be fine-tuned on approved classes. Field imagery is required because laboratory-background datasets alone are not representative.

Dataset requirements:

- versioned class taxonomy with healthy and unsupported/other handling;
- provenance, crop, label source, reviewer status, capture context, and consent for every image;
- local field images across lighting, growth stage, device type, background, severity, and viewpoint;
- deduplication before splitting;
- train/validation/test separation by farm, plant, burst, or source where feasible;
- class-imbalance analysis and documented augmentation;
- a never-trained-on final held-out field test set.

Evaluation must report per-class precision, recall, F1, confusion matrix, macro-F1, top-1 accuracy, calibration error/reliability, abstention coverage versus error, and representative-device end-to-end latency. Overall accuracy alone is insufficient.

Every promoted model requires a model card containing dataset version, taxonomy, splits, training configuration, evaluation results, limitations, confidence threshold, artifact checksum, approval, and rollback version.

### 12.3 NDVI pipeline

The remote-sensing pipeline must document Sentinel-2 collection/product choice, bands, scale, cloud/shadow mask, compositing window, zonal statistic, minimum usable coverage, scheduling, and gap behavior. It must be tested against known polygons and manually inspected samples.

The five-day Sentinel-2 revisit interval does not guarantee a usable five-day field observation. The interface must distinguish acquisition frequency from cloud-free data availability. Monsoon gap filling/compositing is a research decision and must be evaluated without hiding observation age.

### 12.4 Crop recommender

Until representative labeled outcomes exist, use an agronomist-reviewed scoring/rules approach. A candidate structure is eligibility constraints followed by weighted ranking across planting window, soil suitability, expected water demand versus availability, recent vegetation history, and known weather risks. All weights, rules, sources, and versions remain **TBD**.

### 12.5 Continuous improvement

Farmer images do not become valid labels automatically. The approved loop is:

`consented submission → outcome/review → label verification → quality checks → versioned dataset → offline training/evaluation → approval → controlled deployment → monitoring/rollback`.

There must be no automatic online learning from unverified farmer input.

## 13. Non-functional requirements

### 13.1 Accessibility and usability

- **NFR-USA-001:** No P0 workflow may require reading English or entering typed text.
- **NFR-USA-002:** Controls must use large touch targets, recognizable visuals, high contrast, and spoken state/error feedback.
- **NFR-USA-003:** Critical instructions must not rely on color alone.
- **NFR-USA-004:** The app must tolerate interruptions, repeated taps, cancelled recording, and resumed queued work.
- **NFR-USA-005:** Localization must include prompts, errors, permissions rationale, advice, alerts, and safety wording—not only labels.

### 13.2 Performance and connectivity

Numeric targets require baseline measurement and approval. Proposed initial targets under a stable mobile connection are:

- visible/tactile acknowledgement of user input within 100 ms;
- cached screen/content display within 2 seconds;
- ordinary voice turn completed within 5 seconds after upload at p95, excluding provider outage;
- disease assessment completed within 10 seconds at p95 after upload;
- API availability of 99% during the pilot period, excluding announced maintenance;
- queued requests synchronized without duplication when connectivity returns.

These values are **proposed**, not confirmed acceptance gates.

### 13.3 Reliability

- external-provider calls must use timeouts, bounded retry, and circuit-breaking/degraded states;
- job processing must be idempotent and support dead-letter inspection;
- database backups and restore tests must be documented before pilot use;
- model/rule/content releases must support rollback;
- stale cached advice must display its original timestamp and must not masquerade as a fresh response.

### 13.4 Security and privacy

- all network traffic must use current TLS;
- passwords, API keys, model credentials, and provider secrets must not be shipped in the app or committed to source control;
- access control must be enforced for every farmer-owned object and administrator action;
- sensitive data must be encrypted at rest using managed/platform facilities;
- media storage must be private and accessed with short-lived authorization;
- upload content must be type/size validated, safely decoded, and isolated from executable handling;
- logs and analytics must exclude raw audio, raw images, precise polygons, tokens, and unnecessary phone identifiers;
- precise field boundaries, location, voice, and images must be treated as sensitive personal data;
- retention periods for audio, raw images, diagnoses, field polygons, alerts, logs, and dataset copies are **TBD** and must be approved before collection;
- development/test environments must not use production farmer data unless explicitly governed;
- dependency, mobile, API, and authorization testing must occur before field deployment.

### 13.5 Maintainability and observability

- automated tests and static checks must run in continuous integration;
- configuration must be environment-specific and validated on startup;
- structured logs must use correlation ids across client request, API, job, and provider calls;
- metrics must include request/error/latency rates, queue age, provider failures, alert delivery, inference abstention, input drift, and NDVI job freshness;
- dashboards and actionable alerts must avoid farmer-identifiable dimensions;
- public interfaces, model releases, datasets, advisory content, and operational runbooks must be documented.

## 14. Error and degraded-mode behavior

| Condition | Required user-facing behavior |
|---|---|
| No network | State that the request is queued when safe; show/speak how to cancel; never invent a result |
| STT uncertain | Ask the user to repeat or confirm a short interpretation |
| Sindhi provider unavailable | Explain the limitation in Sindhi if possible and offer confirmed Urdu fallback |
| Image unusable | Give specific recapture guidance (focus, distance, lighting, one affected leaf) |
| Unsupported crop/class | State that the crop/condition is not covered and offer review/help |
| Disease confidence below threshold | State uncertainty; do not recommend class-specific treatment; request another image/review |
| Satellite data clouded/stale | Report the last usable date and low reliability; do not claim current health |
| Weather/flood source stale | Label information unavailable/stale and suppress newly generated definitive alerts |
| Notification delivery failure | Retain alert in app, retry appropriately, and record delivery failure |
| Recommendation inputs missing | Ask for essential data or return a clearly qualified result |
| Server error | Provide a localized retryable message and correlation id for support, without technical details |

## 15. Testing and evaluation plan

### 15.1 Software verification

- unit tests for domain rules, geometry, NDVI calculations, localization, confidence/abstention, deduplication, and recommendation scoring;
- API contract, authentication, authorization, idempotency, validation, and migration tests;
- Android tests for permissions, lifecycle, offline queue, restart/resume, accessibility, and language switching;
- integration tests with sandbox/fake speech, Earth Engine, weather/flood, storage, and notification adapters;
- end-to-end tests for each journey on a representative low-end Android device and throttled/lossy network;
- security tests for object ownership, ID enumeration, upload handling, token lifecycle, secret leakage, and excessive data exposure;
- backup restoration and model rollback exercises.

### 15.2 ML and remote-sensing evaluation

- frozen, versioned evaluation sets and reproducible scripts;
- metrics stratified by crop, disease, language, speaker/context, image conditions, and relevant demographic/device factors when ethical and feasible;
- confidence calibration and abstention evaluation, not only accuracy;
- NDVI comparisons against independently calculated reference samples and field observations where possible;
- documented errors, known limitations, and failure examples in the final report.

### 15.3 Farmer usability study

Testing must involve growers in Dadu district rather than classmates. The study protocol requires supervisor/ethics approval as applicable, informed consent in the participant's language, voluntary withdrawal, and safe handling of recordings and observations.

Measure at minimum:

- unassisted completion rate for each P0 task;
- time on task and number of retries/clarifications;
- speech comprehension and TTS intelligibility;
- whether users correctly understand uncertainty and alert urgency;
- usability rating using an orally administered suitable instrument;
- qualitative trust, usefulness, confusion, and desired changes;
- connectivity/device failures observed in realistic field conditions.

Participant count and pass thresholds are **TBD** and must be set before testing to avoid selecting success criteria after results are known.

## 16. FYP acceptance criteria

The release is accepted when all of the following are evidenced:

1. Each P0 journey works end to end on the target Android profile.
2. Urdu and Sindhi voice pipelines are demonstrated and evaluated on representative farm vocabulary; any limited Sindhi support is explicitly documented rather than silently redefined.
3. The approved four-crop disease taxonomy is implemented, tested on a held-out set, and supports calibrated abstention.
4. A low-confidence image demonstrably produces safe escalation rather than definitive treatment advice.
5. A valid field polygon produces a provenance-rich, quality-qualified NDVI history through Google Earth Engine.
6. Stale/cloud-obscured satellite data is clearly disclosed.
7. Weather, heat, heavy-rain, and flood alerts can be generated, localized, deduplicated, delivered, and expired.
8. The crop recommender records its inputs/version and explains its result and limitations.
9. Offline submissions survive app restart and synchronize exactly once after reconnection.
10. Authorization tests show one farmer cannot access another farmer's fields, images, advice, or alerts.
11. Consent, revocation, retention, and image-reuse behavior are documented and demonstrated.
12. Agronomic advice and thresholds have named reviewer approval.
13. Usability testing is completed with actual target growers under an approved protocol.
14. Evaluation results, limitations, deployment instructions, and a working demonstration are included in the final project evidence.

Quantitative thresholds for model performance, speech accuracy, task completion, latency, and study size remain approval gates to be established during baseline/prototype work.

## 17. Delivery phases and milestones

No calendar dates are supplied in the brief. The recommended dependency order is:

1. **Requirements and governance:** approve crop/disease taxonomy, languages, consent, retention, agronomic reviewer, target devices, and evaluation protocol.
2. **Feasibility prototypes:** benchmark Sindhi/Urdu STT/TTS, field-image classifier baseline, Earth Engine access/cloud masking, provider data availability, and Android offline queue.
3. **Platform foundation:** authentication, profiles, fields, storage, background jobs, API contracts, localization framework, monitoring, and CI.
4. **Vertical slices:** complete voice loop; disease workflow; field/NDVI workflow; alert workflow; recommendation workflow.
5. **Integration and hardening:** authorization, retry/idempotency, degraded modes, privacy controls, performance, and device/network testing.
6. **Field evaluation:** pilot with Dadu growers, analyze issues and metrics, fix critical usability/safety defects.
7. **Finalization:** freeze model/dataset/content versions, complete evidence, deployment/runbooks, demonstration, report, and limitations.

## 18. Risks and mitigations

| Risk | Impact | Planned mitigation |
|---|---|---|
| Insufficient Sindhi STT/TTS coverage | Core accessibility goal fails | benchmark early; collect consented domain audio; adapt multilingual model if feasible; provide explicit, user-confirmed Urdu fallback; document residual gap |
| Public disease images do not represent fields | Unsafe or inaccurate diagnoses | prioritize local data; split by source/farm; calibrate confidence; add quality/out-of-distribution checks; human-review fallback |
| Unapproved or unsafe treatment advice | Harm to crops, people, or environment | qualified local review, versioned content, conservative uncertainty behavior, safety guidance, audit trail |
| Monsoon cloud cover | Long gaps in NDVI | quality flags, composites evaluated against truth, optional alternative sources as future research, never conceal stale/gap-filled data |
| Weak agronomic data for recommender | Poor recommendations | start with transparent reviewed rules; disclose missing inputs; constrain crop list; avoid unsupported ML claims |
| No access to target farmers | Invalid usability conclusions | arrange grower-network/extension partnerships early; approve study and recruitment before feature freeze |
| Intermittent connectivity | abandoned or duplicated requests | encrypted durable queue, idempotency keys, resumable/optimized uploads, visible state |
| Third-party quota/outage/cost | unavailable core modules | adapter interfaces, caching within freshness rules, quotas/monitoring, degraded responses, provider contingency plan |
| Sensitive media/location exposure | privacy and safety harm | data minimization, separate consent, encryption, private storage, strict authorization, retention/deletion, redacted telemetry |
| FYP scope is too broad | incomplete integration | prioritize P0 vertical slices, prototype highest risks first, use modular monolith, formally record deferrals |
| Feedback labels are incorrect | model degrades | do not train on raw feedback; reviewer verification, provenance, dataset versioning, offline release gates |

## 19. Open decisions

These items must be resolved and recorded before the relevant module is considered production-ready:

1. Exact disease and healthy class taxonomy for each of the four crops.
2. Agronomic reviewer(s), advice sources, approval process, and chemical-safety policy.
3. Urdu and Sindhi scripts/dialects, code-switch behavior, STT/TTS engines, and acceptable accuracy targets.
4. Android minimum OS, device/RAM/storage profile, implementation framework, and app distribution method.
5. Authentication method suitable for target farmers and unreliable connectivity.
6. Backend stack, database/geospatial extension, job queue, object store, hosting, and budget.
7. Weather forecast provider, authoritative flood-risk source, geographic resolution, freshness, and alert thresholds.
8. Field-boundary capture UX, valid area limits, and supported service boundary.
9. Sentinel-2 product, cloud/shadow masking, compositing, minimum pixel coverage, NDVI baseline, and refresh schedule.
10. Soil-type source and how farmers express water availability in a reliable, understandable way.
11. Crop-recommendation crop list, rule sources, weights, confidence formulation, and evaluation method.
12. Low-confidence thresholds and human-review service level/workflow.
13. Retention and deletion periods for every sensitive data class.
14. Pilot participant count, ethics/consent protocol, metric targets, and final acceptance thresholds.
15. Supported offline operations and maximum queued media/storage usage.
16. Whether and how audio is retained for speech-model evaluation; default should be no retention beyond processing unless separately consented.
17. Administrator/reviewer interface scope and operational ownership after FYP completion.

## 20. Traceability to the original brief

| Brief commitment | Specification coverage |
|---|---|
| voice-first Urdu and Sindhi interface | Sections 2, 6.2, 7.2, 12.1, 13.1 |
| disease detection for cotton, wheat, rice, sugarcane | Sections 6.3, 7.3, 8, 12.2 |
| named condition, confidence, treatment, low-confidence review | Sections 6.3, 7.3, 8, 14 |
| registered field, Sentinel-2 through Earth Engine, NDVI history | Sections 6.4, 7.4, 12.3 |
| weather, flood, heat, and irrigation-relevant alerts | Sections 6.5, 7.5 |
| crop recommendation using season, NDVI, soil, and water | Sections 6.6, 7.6, 12.4 |
| thin Android client and server-side processing | Sections 2, 9 |
| offline queue for poor connectivity | Sections 7.7, 13.2, 14 |
| farmer images improve future models | Sections 7.8, 10.1, 12.5 |
| held-out classifier, speech, and grower usability evaluation | Sections 12, 15, 16 |
| explicit exclusions | Section 2.3 |
| four named high risks | Sections 12, 15.3, 18 |

## 21. Definition of done for any feature

A feature is done only when:

- its requirements and localized UX/error states are approved;
- implementation works across client, API, persistence, and background processing as applicable;
- unit, integration, authorization, offline/degraded-mode, and relevant end-to-end tests pass;
- metrics, logs, and operational failure handling exist without leaking sensitive data;
- accessibility is checked on a representative device;
- agronomic and language content is reviewed where applicable;
- documentation, configuration, migrations, and rollback behavior are complete;
- acceptance evidence is linked to the relevant requirement IDs;
- known limitations and deferred work are recorded.

## 22. Change control

Changes to scope, disease taxonomy, safety rules, data collection, consent, acceptance thresholds, external providers, or architecture must be documented in version control and reviewed by the project lead and supervisor. Agronomic changes additionally require the designated agronomic reviewer. Each release should identify its API version, app version, model versions, dataset versions, processing versions, advisory-content version, and unresolved limitations.
