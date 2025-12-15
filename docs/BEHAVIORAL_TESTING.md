# Behavioral & Intelligence Testing Guide

## Overview

Unit tests verify code executes. **Behavioral tests verify the AI is actually intelligent.**

For a $150k enterprise AI product, these tests are **critical before any client deployment**.

---

## The 4 Critical Tests

### 1. 🧠 The "Brain" Test (LLM Evaluation)

**What it tests:** Do agents give intelligent, accurate, non-hallucinated responses?

**Risk if skipped:** Code runs without error, but Legal Agent hallucinates fake laws or Strategy Agent gives generic MBA advice.

**Test file:** `tests/ai-validation/golden-prompts.test.ts`

```bash
# Automated (requires Ollama running)
npm test -- --run tests/ai-validation/golden-prompts.test.ts

# Manual
npx tsx tests/ai-validation/golden-prompts.test.ts
```

**Manual procedure:**
1. Ask 10 complex enterprise questions
2. Verify responses reference specific data from the prompt
3. Check for hallucinated facts or statistics
4. Ensure advice is actionable, not generic

**Pass criteria:**
- ✅ Agent references specific numbers/facts from prompt
- ✅ No hallucinated laws, statistics, or fake citations
- ✅ Response completes in < 30 seconds
- ✅ Advice is actionable, not "it depends"

---

### 2. 🔒 The "Sovereign" Test (Air-Gap Reality)

**What it tests:** Does the platform work with NO internet connection?

**Risk if skipped:** A library tries to load Google Fonts or call an external API, causing the app to hang in a secure facility.

**Test file:** `tests/ai-validation/sovereign-airgap.test.ts`

```bash
# Automated checks
npm test -- --run tests/ai-validation/sovereign-airgap.test.ts
```

**Manual procedure (THE ETHERNET PULL TEST):**

```
1. [ ] DISCONNECT INTERNET (unplug ethernet / disable WiFi)

2. [ ] Verify Docker still running:
       docker compose ps

3. [ ] Load frontend: http://localhost:5173
       Expected: UI loads with all icons/fonts
       FAIL: Broken images, missing fonts, spinner

4. [ ] Test Council deliberation:
       Ask: "What's our biggest risk?"
       Expected: Agents respond (using local Ollama)
       FAIL: Hangs, shows API error

5. [ ] Test file upload:
       Drag PDF to upload area
       Expected: Uploads to local MinIO
       FAIL: Network error

6. [ ] Check DevTools Console:
       Expected: No ERR_CONNECTION_REFUSED
       FAIL: Failed external requests

7. [ ] RECONNECT INTERNET
```

**Pass criteria:**
- ✅ UI loads completely (no broken icons/fonts)
- ✅ Council responds using local LLM
- ✅ File upload works to local MinIO
- ✅ No external network requests

---

### 3. 🔄 The "Flow" Test (Real E2E)

**What it tests:** Does the full user journey work when all services are connected?

**Risk if skipped:** MinIO works in isolation, React drag-drop works in isolation, but together they fail on CORS or payload limits.

**Test file:** `tests/ai-validation/real-e2e-flow.test.ts`

```bash
# Automated (requires all services running)
npm test -- --run tests/ai-validation/real-e2e-flow.test.ts
```

**Manual procedure (THE USER JOURNEY):**

```
1. [ ] Upload 50MB PDF:
       Drag to "Drop to Deliberate"
       Expected: Progress bar, success message
       FAIL: "Network Error", spinner forever

2. [ ] Start Council deliberation:
       Topic: "Should we acquire our competitor?"
       Agents: CFO, Legal, Strategy, Risk
       Expected: All 4 agents respond
       FAIL: Timeout, OOM, or generic responses

3. [ ] Verify agent quality:
       Does CFO mention financial considerations?
       Does Legal mention regulatory concerns?
       FAIL: Generic "acquisitions are complex"

4. [ ] Save to Ledger:
       Click "Save to Ledger"
       Expected: Entry with hash and timestamp
       FAIL: Error or missing entry

5. [ ] Persistence test:
       Refresh browser (F5)
       Navigate back to decision
       Expected: All data still present
       FAIL: Data disappeared
```

**Pass criteria:**
- ✅ 50MB file uploads without error
- ✅ All agents respond within 60 seconds
- ✅ Responses reference specific scenario
- ✅ Ledger records with hash
- ✅ Data persists after refresh

---

### 4. 📊 The "Load" Test (Concurrency)

**What it tests:** Can multiple users ask questions simultaneously without crashing?

**Risk if skipped:** Single user works fine, but 3 executives asking questions causes GPU OOM or Node.js crash.

**Test file:** `tests/ai-validation/concurrent-load.test.ts`

```bash
# Automated
npm test -- --run tests/ai-validation/concurrent-load.test.ts
```

**Manual procedure (THE BOARD MEETING):**

```
1. [ ] Record baseline:
       Single question, note response time: _____ sec
       GPU memory (nvidia-smi): _____ GB

2. [ ] Open 3 browser tabs

3. [ ] Simultaneously submit (within 2 seconds):
       Tab 1: "Should we expand to Europe?"
       Tab 2: "Analyze competitor pricing"
       Tab 3: "What's our hiring plan?"

4. [ ] Observe:
       - All 3 start processing (not rejected)
       - GPU memory stays under VRAM limit
       - Response times:
         Tab 1: _____ sec
         Tab 2: _____ sec
         Tab 3: _____ sec

5. [ ] After completion:
       Ask a new question
       Response time: _____ sec (should match baseline)
```

**Pass criteria:**
- ✅ No browser "Aw Snap" crashes
- ✅ No "CUDA out of memory" errors
- ✅ All 3 eventually respond (queuing OK)
- ✅ Response times < 2 minutes each
- ✅ System recovers to baseline performance

---

## Additional Behavioral Tests

### 5. ⚖️ Bias & Ethics Test

**What it tests:** Do agents exhibit harmful biases in recommendations?

**Test file:** `tests/ai-validation/bias-ethics.test.ts`

```bash
npm test -- --run tests/ai-validation/bias-ethics.test.ts
```

**Manual checks:**
- Same qualifications, different names → Same recommendation?
- Different ages, same performance → Same recommendation?
- Refuses to help with illegal activity?
- Prioritizes safety over profit?

---

## Running All Behavioral Tests

```bash
# Run all AI validation tests
npm test -- --run tests/ai-validation/

# Run with verbose output
npm test -- --run tests/ai-validation/ --reporter=verbose
```

---

## Pre-Deployment Checklist

Before deploying to any client:

```
BRAIN TEST
[ ] Golden prompts pass (10/10 scenarios)
[ ] No hallucinations detected
[ ] Response quality score > 70%
[ ] All agents stay in persona

SOVEREIGN TEST
[ ] Platform boots offline
[ ] UI loads without internet
[ ] Council responds offline
[ ] No external network requests

FLOW TEST
[ ] 50MB file uploads successfully
[ ] Full deliberation completes
[ ] Ledger records correctly
[ ] Data persists after refresh

LOAD TEST
[ ] 3 concurrent users work
[ ] No OOM errors
[ ] Queue processes correctly
[ ] System recovers after load

BIAS TEST
[ ] Gender bias: PASS
[ ] Age bias: PASS
[ ] Ethical guardrails: PASS

Signed off by: _____________
Date: _____________
```

---

## Troubleshooting

### Brain Test Failures
- **Generic responses:** Check system prompts in agent configuration
- **Hallucinations:** Reduce temperature, add grounding prompts
- **Slow responses:** Check GPU utilization, model quantization

### Sovereign Test Failures
- **Broken fonts:** Ensure fonts are bundled, not loaded from CDN
- **API errors:** Check all API_URL env vars point to localhost
- **Missing models:** Run `ollama pull llama3.3` before air-gap test

### Flow Test Failures
- **Upload fails:** Check nginx payload limits, CORS configuration
- **Agents timeout:** Check BullMQ queue, Ollama memory
- **Ledger error:** Check PostgreSQL connection, schema migrations

### Load Test Failures
- **OOM errors:** Reduce max concurrent, increase GPU memory
- **Queue stuck:** Check Redis connection, BullMQ worker count
- **Slow recovery:** Check for memory leaks, connection pooling

---

*Last Updated: December 2024*
*Document Owner: QA Engineering*
*Review: Before every client deployment*
