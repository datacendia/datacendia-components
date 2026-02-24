# SOP-029: EU AI Act Compliance

**Category:** Compliance
**Priority:** High
**Owner:** CAIO / Compliance Lead
**Last Verified:** 2026-02-22 (against `COMPLIANCE_DOCUMENTATION.md`, `COMPLETE_SERVICE_MATRIX.md`)

---

## 1. Purpose

Define procedures for maintaining compliance with the EU Artificial Intelligence Act across all AI-powered features of the Datacendia platform.

---

## 2. Risk Classification

### 2.1 Datacendia AI System Classification
| Feature | EU AI Act Risk Level | Justification |
|---------|---------------------|---------------|
| AI Council Deliberation | **High-Risk** | Assists organizational decision-making |
| CendiaCollapse™ Red-Team | **High-Risk** | Policy impact assessment |
| IISS Scoring | **High-Risk** | Institutional evaluation |
| CendiaAutopilot™ | **High-Risk** | Autonomous decision-making |
| Auto-Heal (Tech Team) | **Limited Risk** | Internal system maintenance |
| CendiaPersonaForge™ | **Limited Risk** | Custom AI persona creation |
| CendiaOmniTranslate™ | **Minimal Risk** | Translation service |

### 2.2 Prohibited Practices (Art. 5)
The platform does NOT engage in:
- ❌ Social scoring
- ❌ Real-time biometric identification
- ❌ Subliminal manipulation
- ❌ Exploitation of vulnerabilities

CendiaCollapse™ MINORITY_HARM_AGENT specifically tests for potential exploitation of vulnerable groups.

---

## 3. High-Risk AI Requirements

### 3.1 Risk Management System (Art. 9)
| Requirement | Platform Implementation |
|-------------|------------------------|
| Risk identification | CendiaCollapse™ 18 adversarial agents |
| Risk estimation | Trust Delta calculation |
| Risk evaluation | IISS scoring, Failure Envelopes |
| Risk mitigation | Mitigation suggestions, human override |
| Residual risk documentation | Override records (SOP-026) |

### 3.2 Data Governance (Art. 10)
| Requirement | Platform Implementation |
|-------------|------------------------|
| Training data quality | CDO agent data governance |
| Bias detection | CendiaEthics pillar, bias testing |
| Data representativeness | Demographic analysis in Collapse mode |
| Data documentation | CendiaLineage pillar provenance tracking |

### 3.3 Technical Documentation (Art. 11)
| Document | Location |
|----------|----------|
| System architecture | `docs/ARCHITECTURE_DIAGRAMS.md` |
| AI model inventory | `backend/src/config/aiModels.ts` |
| Decision-making logic | Council deliberation flow |
| Training methodology | Model cards (per Ollama model) |
| Performance metrics | Test reports, IISS scores |
| Risk assessment | Collapse Mode analyses |

### 3.4 Record-Keeping (Art. 12)
- CendiaLedger™ provides immutable records of all AI operations (see SOP-025)
- Automatic logging of: inputs, outputs, confidence scores, overrides
- 7-year retention for decision records
- RFC 3161 timestamps for temporal proof (see SOP-020)

### 3.5 Transparency (Art. 13)
| Requirement | Implementation |
|-------------|---------------|
| AI system identification | All AI outputs labeled as AI-generated |
| Capability disclosure | Agent descriptions include limitations |
| Confidence scores | Every recommendation includes confidence |
| Dissent disclosure | Minority opinions surfaced, not hidden |

### 3.6 Human Oversight (Art. 14)
| Requirement | Implementation |
|-------------|---------------|
| Human-in-the-loop | All decisions require human approval |
| Override capability | CendiaResponsibility™ (SOP-026) |
| Stop mechanism | CendiaVeto™ veto system |
| Non-overridable safeguards | FREE_SPEECH and MINORITY_HARM agents |

### 3.7 Accuracy, Robustness, Cybersecurity (Art. 15)
| Requirement | Implementation |
|-------------|---------------|
| Accuracy | 3,500+ tests, property-based fuzzing |
| Robustness | CendiaCollapse™ adversarial testing |
| Cybersecurity | CendiaDefenseStack™, SOP-008 |
| Reproducibility | Deterministic seeds, Merkle proofs |

---

## 4. Transparency Obligations (Limited-Risk Systems)

For limited-risk AI systems (Art. 52):
- Clearly identify content as AI-generated
- Label deepfakes (CendiaMediaAuth™)
- Disclose chatbot interactions as AI

---

## 5. Conformity Assessment Procedure

### 5.1 Internal Assessment (for High-Risk)
1. Complete risk management documentation
2. Verify data governance procedures
3. Compile technical documentation
4. Test accuracy and robustness
5. Verify human oversight mechanisms
6. Document transparency measures
7. Internal review and sign-off

### 5.2 Documentation Package
```bash
# Generate EU AI Act compliance package
curl -X POST http://localhost:3001/api/v1/compliance/eu-ai-act/package \
  -H "Authorization: Bearer <admin_token>" \
  -d '{"systems": ["council", "collapse", "iiss", "autopilot"]}'
```

---

## 6. Ongoing Obligations

| Activity | Frequency | Owner |
|----------|-----------|-------|
| Risk management review | Quarterly | CAIO |
| Bias testing | Monthly | CDO |
| Human oversight verification | Quarterly | Governance Lead |
| Technical documentation update | On change | Engineering Lead |
| Conformity re-assessment | Annually | Compliance Lead |
| Incident reporting to authority | Per incident | Compliance Lead |

---

## 7. Incident Reporting (Art. 62)

Serious incidents involving high-risk AI must be reported to the national AI authority:
1. Detect serious incident (harm, safety risk, fundamental rights impact)
2. Assess and document within **24 hours**
3. Report to competent authority
4. Implement corrective measures
5. Follow up with investigation results

---

## 8. Verified Against

- `COMPLIANCE_DOCUMENTATION.md`: EU AI Act framework listed in supported frameworks
- `COMPLETE_SERVICE_MATRIX.md`: 10 compliance frameworks including EU AI Act
- CendiaCollapse™: 18 adversarial agents, 7 failure domains (Art. 9 risk management)
- CendiaResponsibility™: Human override accountability (Art. 14)
- CendiaLedger™: Record-keeping (Art. 12)
- IISS: Risk evaluation (Art. 9)
- `DATACENDIA_REFUSAL_PRINCIPLES.md`: Prohibited practices avoidance

---

*Datacendia, LLC — Proprietary and Confidential*
