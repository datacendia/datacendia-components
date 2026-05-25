# Healthcare Platform Demonstration: Sepsis Prediction SaMD Decision

## Scenario

Lakewood Health System (4 hospitals, 1,200 beds) evaluated whether to deploy SepsisSense, an internal ML model intended for ICU and ED use. Retrospective metrics looked strong: AUROC 0.91, sensitivity 87%, specificity 82%, with a projected 12-15% mortality reduction. The tool predicts sepsis 4-6 hours earlier than standard screening.

But there were significant deployment constraints: no prospective validation, degraded pediatric performance (AUROC 0.78), FDA SaMD implications, and unresolved 21 CFR Part 11 audit-trail requirements. This is a high-stakes decision where both delay and premature deployment carry clinical risk.

## Specific Insight the Council Found

The pivotal insight came from the Patient Safety Officer during cross-examination. The team challenged the common framing that "87% sensitivity is better than current manual screening at 68%, so deploy now." The officer modeled real-world degradation effects and showed that if retrospective performance drops 10% in practice and alert fatigue causes 30% of alerts to be ignored, effective sensitivity becomes:

**87% × 0.90 × 0.70 = 54.8% effective sensitivity.**

That reframing transformed the decision. A tool that looked superior in offline validation could perform worse than the current workflow once cognitive and operational realities were included.

The same dialogue quantified burden: in a 30-bed ICU at 6% prevalence, the model would produce roughly 6.7 alerts per 12-hour shift, about 5.1 of them false positives, consuming an estimated 51-61 minutes per shift in false-alert triage.

## What a Single AI Model Would Have Missed

A single-model answer can summarize regulatory obligations and benchmark metrics, but it often fails to pressure-test interaction effects between model quality and human workflow. In this case, the council dynamic forced a more difficult question: not "is the model promising?" but "does this deployment pattern improve outcomes now?"

The deliberation combined four perspectives that are usually split across meetings and documents:

- Clinical performance interpretation,
- Regulatory prerequisites (Class II SaMD path and FDA clearance needs),
- Patient safety behavior under alarm load,
- Data/infrastructure readiness (Part 11-grade logs and drift monitoring).

The result was not anti-AI. It was pro-validation: move quickly, but do not equate retrospective accuracy with clinical effectiveness.

## What This Means For You

If you're a CMIO, clinical informatics leader, or digital health founder, the takeaway is straightforward: **patient safety decisions should be made on effective sensitivity, not headline sensitivity**.

This demonstration also shows why governance quality is operational, not purely legal. The recommendation to delay broad deployment was tied to concrete next steps: prospective validation, audit-trail readiness, alert-management design, and explicit pediatric exclusions until subgroup evidence improves.

For organizations navigating FDA SaMD Pre-Submission and ONC HTI-1 accountability expectations, that integrated decision record matters. It provides a defensible path that protects patients today while accelerating a safer, faster path to deployment tomorrow.
