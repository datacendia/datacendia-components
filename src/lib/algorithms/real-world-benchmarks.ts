// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// REAL-WORLD GOVERNANCE FAILURE BENCHMARKS
// =============================================================================
// Maps documented corporate governance failures to DCII primitive scores.
// Each case study uses publicly reported facts from regulatory filings,
// congressional testimony, court documents, and investigative journalism.
//
// For each case:
//   1. What actually happened (sourced facts)
//   2. Which DCII primitives were absent or failed
//   3. Simulated IISS score the organization would have had
//   4. Counterfactual: what Datacendia would have detected and when
//   5. Financial impact that could have been prevented
//
// Sources cited inline. All financial figures from public filings/settlements.
// =============================================================================

import { calculateIISS, type IISSResult } from './iiss-scoring';

// =============================================================================
// TYPES
// =============================================================================

export interface RealWorldBenchmark {
  id: string;
  company: string;
  incident: string;
  year: number;
  industry: string;

  // What happened — sourced facts
  summary: string;
  rootCauses: string[];
  sources: string[];

  // Financial impact
  financialImpact: {
    totalCost: number;           // USD
    fines: number;
    settlements: number;
    lostRevenue: number;
    marketCapLoss: number;
    otherCosts: number;
    casualties?: number;         // Human lives lost
    affectedPeople?: number;     // People impacted
  };

  // Timeline
  timeline: Array<{
    date: string;
    event: string;
    primitiveRelevance: string[];  // Which primitives would have caught this
  }>;

  // DCII Primitive Analysis — what was missing
  primitiveFailures: Array<{
    primitiveId: string;
    primitiveName: string;
    failureScore: number;          // 0-100: what the org effectively scored
    whatWasMissing: string;
    whatDatacendiaWouldDo: string;
    detectionWindow: string;       // How early Datacendia would have flagged it
  }>;

  // Simulated IISS score for this organization
  simulatedIISS: number;
  simulatedBand: string;

  // Counterfactual analysis
  counterfactual: {
    earliestDetection: string;     // When Datacendia would have first flagged
    preventableCost: number;       // USD that could have been prevented
    preventablePercentage: number; // % of total cost preventable
    keyInterventions: string[];    // Specific actions the system would trigger
  };
}

// =============================================================================
// CASE 1: BOEING 737 MAX (2018-2019)
// =============================================================================

const BOEING_737_MAX: RealWorldBenchmark = {
  id: 'boeing-737-max',
  company: 'Boeing',
  incident: '737 MAX MCAS Design & Oversight Failure',
  year: 2018,
  industry: 'Aerospace / Manufacturing',

  summary: 'Boeing\'s 737 MAX aircraft crashed twice (Lion Air Flight 610, Oct 2018; Ethiopian Airlines Flight 302, Mar 2019), killing 346 people. Root cause: the MCAS stall-prevention system relied on a single angle-of-attack sensor instead of two, violating redundancy protocols. Engineers raised internal concerns ("Would you put your family on a MAX simulator trained aircraft? I wouldn\'t.") but these were not escalated to the board. The board had no standing safety committee. Boeing did not disclose to the FAA that its own test pilot experienced a "catastrophic" 10-second MCAS failure in a 2012 simulator test. The company prioritized financial metrics and compressed timelines over engineering quality following the McDonnell Douglas merger.',

  rootCauses: [
    'Single AOA sensor for MCAS (violated redundancy protocols)',
    'Engineer concerns suppressed — no escalation path to board',
    'Board had no standing safety committee',
    'Boeing withheld catastrophic test results from FAA (2012 simulator failure)',
    'Cultural shift: financial performance prioritized over engineering quality',
    'HQ relocated from Seattle to Chicago — executives disconnected from engineers',
    'Engineers reported to business unit heads, not chief engineer',
    'Compressed timeline: "countdown clocks" in engineering review rooms',
    'Contractual commitment to avoid simulator training (Southwest Airlines)',
  ],

  sources: [
    'Harvard Law School Forum on Corporate Governance, "Boeing 737 MAX," June 2024',
    'U.S. House Transportation Committee Report, September 2020',
    'Delaware Chancery Court, In re Boeing Company Derivative Litigation, September 2021',
    'FAA Independent Expert Review Panel Report, 2024',
    'Boeing SEC Settlement, $200M, September 2022',
  ],

  financialImpact: {
    totalCost: 20_000_000_000,
    fines: 2_500_000_000,       // DOJ fraud settlement
    settlements: 8_525_000_000,  // $8.3B airlines + $225M shareholder + $200M SEC
    lostRevenue: 6_000_000_000,  // Estimated from 2-year grounding
    marketCapLoss: 60_000_000_000, // Peak-to-trough
    otherCosts: 2_975_000_000,   // Production restart + future cost increases
    casualties: 346,
  },

  timeline: [
    { date: '2012-06', event: 'Boeing test pilot experiences 10-second "catastrophic" MCAS failure in simulator — not reported to FAA', primitiveRelevance: ['P2', 'P3', 'P8'] },
    { date: '2015-06', event: 'Internal engineer messages: "This airplane is ridiculous"', primitiveRelevance: ['P2', 'P6'] },
    { date: '2016-03', event: 'Engineer writes "Would you put your family on a MAX simulator trained aircraft? I wouldn\'t"', primitiveRelevance: ['P2', 'P3', 'P6'] },
    { date: '2017-03', event: 'FAA certifies 737 MAX — MCAS reliance on single sensor not flagged', primitiveRelevance: ['P3', 'P5', 'P9'] },
    { date: '2018-10-29', event: 'Lion Air Flight 610 crashes — 189 dead. Faulty AOA sensor triggered MCAS 20+ times', primitiveRelevance: ['P1', 'P3', 'P5'] },
    { date: '2018-11', event: 'Boeing issues bulletin but does not ground fleet; CEO states "confident in the safety of the 737 MAX"', primitiveRelevance: ['P3', 'P6'] },
    { date: '2019-03-10', event: 'Ethiopian Airlines Flight 302 crashes — 157 dead. Same MCAS failure mode', primitiveRelevance: ['P1', 'P3', 'P5'] },
    { date: '2019-03-13', event: 'Global grounding of 737 MAX — ~400 aircraft, thousands of flights canceled', primitiveRelevance: ['P5', 'P9'] },
  ],

  primitiveFailures: [
    { primitiveId: 'P1', primitiveName: 'Discovery-Time Proof', failureScore: 15, whatWasMissing: 'No timestamped record of when Boeing leadership became aware of MCAS risks. The 2012 catastrophic test result was known internally but never surfaced.', whatDatacendiaWouldDo: 'RFC 3161 timestamp on the 2012 simulator test result creates irrefutable proof of when the risk was known. Hash-chained to leadership briefing events.', detectionWindow: '2012 — 6 years before first crash' },
    { primitiveId: 'P2', primitiveName: 'Deliberation Capture', failureScore: 10, whatWasMissing: 'Engineer concerns were expressed in private messages but never captured in formal decision records. No structured deliberation on the single-sensor design choice.', whatDatacendiaWouldDo: 'Multi-agent deliberation on MCAS design would have recorded all engineering positions, dissents, and confidence scores. The single-sensor decision would have required explicit approval with documented justification.', detectionWindow: '2013 — during MCAS design phase' },
    { primitiveId: 'P3', primitiveName: 'Override Accountability', failureScore: 5, whatWasMissing: 'Engineers reported to business unit heads, not chief engineer. Chief engineer was "unaware" of single-sensor design. No mechanism to track when engineering recommendations were overridden for financial/schedule reasons.', whatDatacendiaWouldDo: 'Every override of engineering safety recommendation automatically logged with justification, escalation to board-level safety committee, and non-suppressible audit trail.', detectionWindow: '2013 — when redundancy protocol was overridden' },
    { primitiveId: 'P4', primitiveName: 'Continuity Memory', failureScore: 30, whatWasMissing: 'Institutional knowledge of Boeing\'s safety-first engineering culture was lost after McDonnell Douglas merger. HQ relocation to Chicago severed executive-engineer communication.', whatDatacendiaWouldDo: 'Knowledge graph preserves institutional safety principles. CendiaSuccession captures tacit knowledge during leadership transitions. Precedent linking surfaces past safety decisions.', detectionWindow: '2001 — when cultural erosion began' },
    { primitiveId: 'P5', primitiveName: 'Drift Detection', failureScore: 10, whatWasMissing: 'No continuous monitoring of safety culture degradation. After Lion Air crash (Oct 2018), no formal drift analysis before Ethiopian Airlines crash (Mar 2019).', whatDatacendiaWouldDo: 'CUSUM + EWMA algorithms detect safety metric degradation. After Lion Air crash, drift detection would have triggered automatic fleet-wide risk reassessment within hours.', detectionWindow: '2018-10-29 — within hours of Lion Air crash' },
    { primitiveId: 'P6', primitiveName: 'Cognitive Bias Mitigation', failureScore: 5, whatWasMissing: 'Groupthink dominated. "Countdown clocks" in engineering rooms created pressure to conform. No adversarial challenge of the single-sensor design decision.', whatDatacendiaWouldDo: 'Adversarial agent automatically challenges design decisions where safety redundancy is reduced. Rubber-stamp detection flags unanimous approval without substantive debate. "Would you put your family on this?" dissent automatically preserved and escalated.', detectionWindow: '2013 — during design review' },
    { primitiveId: 'P9', primitiveName: 'Cross-Jurisdiction Compliance', failureScore: 20, whatWasMissing: 'FAA certification process was compromised — Boeing employees responsible for FAA documentation "basically lied to the regulators (unknowingly)." No cross-check between Boeing\'s internal findings and FAA submissions.', whatDatacendiaWouldDo: 'Cross-jurisdiction compliance engine detects gaps between internal risk assessments and regulatory submissions. Automatic conflict detection between internal test results and certification claims.', detectionWindow: '2012 — when test results diverged from certification claims' },
  ],

  simulatedIISS: 127,
  simulatedBand: 'critical',

  counterfactual: {
    earliestDetection: 'June 2012 — when the catastrophic simulator test result was generated, Discovery-Time Proof (P1) would have created an irrefutable timestamp. Override Accountability (P3) would have flagged that a "catastrophic" finding was not escalated to the board or reported to FAA.',
    preventableCost: 18_000_000_000,
    preventablePercentage: 90,
    keyInterventions: [
      'P1: Timestamped record of 2012 catastrophic test → proves Boeing knew',
      'P2: Structured deliberation on single-sensor design → engineering dissent formally captured',
      'P3: Override of redundancy protocol triggers mandatory board-level review',
      'P5: After Lion Air crash, automatic fleet-wide risk reassessment within hours — Ethiopian crash likely prevented',
      'P6: Adversarial agent challenges single-sensor decision — asks "what if the sensor fails?"',
      'P9: Automatic detection of gap between internal test results and FAA certification submissions',
    ],
  },
};

// =============================================================================
// CASE 2: WELLS FARGO FAKE ACCOUNTS (2002-2016)
// =============================================================================

const WELLS_FARGO: RealWorldBenchmark = {
  id: 'wells-fargo-accounts',
  company: 'Wells Fargo',
  incident: 'Unauthorized Account Opening Scandal',
  year: 2016,
  industry: 'Financial Services',

  summary: 'Over a 14-year period (2002-2016), Wells Fargo employees opened approximately 3.5 million unauthorized bank and credit card accounts, transferred customer funds without consent, created unauthorized insurance policies, and charged fees on accounts customers never requested. The fraud was driven by aggressive cross-selling targets ("Going for Gr-eight" — 8 products per customer) and a toxic sales culture where employees who didn\'t meet quotas were fired. Internal whistleblowers were retaliated against. The board\'s risk committee received reports about sales practice issues but did not take sufficient action.',

  rootCauses: [
    'Aggressive cross-selling quotas ("Going for Gr-eight" — 8 products per customer)',
    'Employees fired for not meeting unrealistic sales targets',
    'Internal whistleblowers retaliated against and terminated',
    'Board risk committee received reports but took insufficient action',
    'CEO John Stumpf dismissed concerns as "1% of employees" issue',
    'Incentive compensation tied to account opening, not customer benefit',
    'Compliance monitoring focused on individual transactions, not patterns',
    'Regional managers pressured branch staff with daily/hourly sales tracking',
  ],

  sources: [
    'U.S. Senate Banking Committee Hearing, September 2016',
    'CFPB Consent Order, September 2016',
    'OCC Consent Order, $1B fine, April 2018',
    'DOJ/SEC Settlement, $3B, February 2020',
    'Wells Fargo Board Independent Directors Report, April 2017',
  ],

  financialImpact: {
    totalCost: 7_250_000_000,
    fines: 4_100_000_000,       // CFPB $185M + OCC $1B + DOJ/SEC $3B
    settlements: 2_650_000_000,  // Customer remediation + class actions
    lostRevenue: 500_000_000,    // Customer attrition
    marketCapLoss: 30_000_000_000,
    otherCosts: 0,
    affectedPeople: 3_500_000,
  },

  timeline: [
    { date: '2002', event: 'Cross-selling strategy "Going for Gr-eight" begins — 8 products per customer target', primitiveRelevance: ['P5', 'P6'] },
    { date: '2005-2010', event: 'Internal ethics complaints about fake accounts begin — whistleblowers retaliated against', primitiveRelevance: ['P2', 'P3', 'P6'] },
    { date: '2013-12', event: 'Los Angeles Times publishes investigation of fake account practices', primitiveRelevance: ['P5', 'P8'] },
    { date: '2015', event: 'City of Los Angeles sues Wells Fargo over unauthorized accounts', primitiveRelevance: ['P9'] },
    { date: '2016-09-08', event: 'CFPB fines Wells Fargo $185M; 5,300 employees fired', primitiveRelevance: ['P3', 'P5'] },
    { date: '2016-09-20', event: 'CEO John Stumpf testifies before Senate — "I am accountable"', primitiveRelevance: ['P3'] },
    { date: '2016-10-12', event: 'CEO John Stumpf resigns', primitiveRelevance: ['P3', 'P4'] },
    { date: '2020-02', event: 'DOJ/SEC settlement: $3B for fraud charges', primitiveRelevance: ['P1', 'P9'] },
  ],

  primitiveFailures: [
    { primitiveId: 'P1', primitiveName: 'Discovery-Time Proof', failureScore: 20, whatWasMissing: 'No timestamped record of when leadership first learned about fake accounts. Board claimed ignorance despite internal reports dating to 2002.', whatDatacendiaWouldDo: 'Every internal complaint about sales practices timestamped with RFC 3161 and hash-chained. Creates irrefutable proof of when leadership had notice.', detectionWindow: '2002 — when first complaints were filed' },
    { primitiveId: 'P2', primitiveName: 'Deliberation Capture', failureScore: 15, whatWasMissing: 'Internal ethics complaints were filed but the deliberation and disposition of those complaints was not transparently recorded. Whistleblowers were silenced.', whatDatacendiaWouldDo: 'CendiaDissent service preserves all internal complaints immutably. Council deliberation on incentive compensation design would have recorded dissenting views about unrealistic targets.', detectionWindow: '2005 — when first whistleblower complaints were filed' },
    { primitiveId: 'P3', primitiveName: 'Override Accountability', failureScore: 10, whatWasMissing: 'Whistleblowers were retaliated against and fired. Management overrode compliance findings without accountability. CEO dismissed the issue as "1% of employees."', whatDatacendiaWouldDo: 'Non-suppressible override tracking. When compliance raised concerns and management chose to maintain sales targets, that override is permanently recorded with justification. Retaliation against whistleblowers automatically flagged.', detectionWindow: '2005 — when compliance concerns were overridden' },
    { primitiveId: 'P5', primitiveName: 'Drift Detection', failureScore: 10, whatWasMissing: 'No continuous monitoring of the correlation between aggressive sales targets and fraudulent account openings. The pattern grew for 14 years without systematic detection.', whatDatacendiaWouldDo: 'Drift detection algorithms (CUSUM/EWMA) monitoring account-opening-to-customer-request ratio. Statistical anomaly detection would have flagged the pattern within months, not years.', detectionWindow: '2003 — within 12 months of pattern emerging' },
    { primitiveId: 'P6', primitiveName: 'Cognitive Bias Mitigation', failureScore: 5, whatWasMissing: 'Groupthink and confirmation bias: leadership convinced itself that aggressive sales targets were achievable without fraud. Dissenting voices were punished rather than heard.', whatDatacendiaWouldDo: 'Adversarial challenge engine questions whether sales targets are achievable without fraudulent practices. Rubber-stamp detection flags when leadership unanimously approves targets despite employee complaints.', detectionWindow: '2002 — when unrealistic targets were first set' },
  ],

  simulatedIISS: 98,
  simulatedBand: 'critical',

  counterfactual: {
    earliestDetection: '2003 — Drift Detection (P5) would have flagged statistical anomalies in account-opening patterns within 12 months. Override Accountability (P3) would have captured the first compliance override.',
    preventableCost: 6_500_000_000,
    preventablePercentage: 90,
    keyInterventions: [
      'P5: CUSUM drift detection flags account-opening-to-customer-request ratio anomaly within 12 months',
      'P3: First compliance override permanently recorded — management cannot claim ignorance',
      'P2: Whistleblower complaints immutably captured with CendiaDissent',
      'P6: Adversarial agent challenges: "Can 8 products/customer be achieved without pressure tactics?"',
      'P1: Timestamped proof of when leadership knew — prevents "we didn\'t know" defense',
    ],
  },
};

// =============================================================================
// CASE 3: EQUIFAX DATA BREACH (2017)
// =============================================================================

const EQUIFAX: RealWorldBenchmark = {
  id: 'equifax-breach',
  company: 'Equifax',
  incident: 'Massive Data Breach — 147.9M Records',
  year: 2017,
  industry: 'Financial Services / Data',

  summary: 'Chinese military hackers exploited an unpatched Apache Struts vulnerability (CVE-2017-5638, disclosed March 2017) to breach Equifax\'s systems. The vulnerability was publicly known for 2 months before exploitation began in May 2017. Equifax failed to patch despite receiving notification. An expired SSL certificate on a network monitoring tool meant the breach went undetected for 76 days (May-July 2017). 147.9 million Americans\' personal data was stolen including Social Security numbers, birth dates, and addresses.',

  rootCauses: [
    'Known Apache Struts vulnerability (CVE-2017-5638) unpatched for 2+ months',
    'Expired SSL certificate on intrusion detection system — breach undetected for 76 days',
    'No centralized patch management process',
    'CISO reported to Chief Legal Officer, not CEO (organizational misalignment)',
    'Single point of failure in network monitoring',
    'IT governance gaps: 35 expired SSL certificates discovered during investigation',
  ],

  sources: [
    'U.S. GAO Report GAO-18-559, "Data Protection: Actions Taken by Equifax," August 2018',
    'U.S. House Oversight Committee Report, December 2018',
    'FTC Settlement, $700M, July 2019',
    'DOJ Indictment of 4 Chinese Military Hackers, February 2020',
  ],

  financialImpact: {
    totalCost: 1_700_000_000,
    fines: 700_000_000,         // FTC settlement
    settlements: 425_000_000,    // Consumer settlement fund
    lostRevenue: 200_000_000,
    marketCapLoss: 5_000_000_000,
    otherCosts: 375_000_000,     // Remediation, credit monitoring
    affectedPeople: 147_900_000,
  },

  timeline: [
    { date: '2017-03-07', event: 'Apache Struts vulnerability CVE-2017-5638 publicly disclosed', primitiveRelevance: ['P5'] },
    { date: '2017-03-09', event: 'Equifax IT notified of vulnerability — patch not applied', primitiveRelevance: ['P3', 'P5'] },
    { date: '2017-05-13', event: 'Hackers begin exploiting unpatched vulnerability', primitiveRelevance: ['P1', 'P5'] },
    { date: '2017-05-13', event: 'Breach goes undetected — expired SSL certificate on monitoring tool', primitiveRelevance: ['P5', 'P7'] },
    { date: '2017-07-29', event: 'Breach finally detected after SSL certificate renewed (76 days later)', primitiveRelevance: ['P1', 'P5'] },
    { date: '2017-09-07', event: 'Equifax publicly discloses breach', primitiveRelevance: ['P1', 'P8'] },
  ],

  primitiveFailures: [
    { primitiveId: 'P1', primitiveName: 'Discovery-Time Proof', failureScore: 20, whatWasMissing: 'No timestamped record of when the patch notification was received and acknowledged. No proof of the 76-day detection gap.', whatDatacendiaWouldDo: 'Vulnerability notification timestamped on receipt. Every day without patch action generates an escalating risk record. The 76-day gap would have been impossible — detection within hours.', detectionWindow: '2017-03-09 — day vulnerability notification received' },
    { primitiveId: 'P3', primitiveName: 'Override Accountability', failureScore: 15, whatWasMissing: 'IT was notified of the vulnerability but chose not to patch. This decision was not formally recorded or escalated.', whatDatacendiaWouldDo: 'Decision to defer patching a known critical vulnerability automatically recorded as a risk-acceptance override. Requires executive sign-off with justification. Auto-escalates if not patched within SLA.', detectionWindow: '2017-03-09 — when patch was deferred' },
    { primitiveId: 'P5', primitiveName: 'Drift Detection', failureScore: 5, whatWasMissing: 'Expired SSL certificate on intrusion detection = zero monitoring for 76 days. No drift detection on monitoring infrastructure itself.', whatDatacendiaWouldDo: 'Meta-monitoring: drift detection monitors the monitoring systems themselves. Expired certificate detected immediately. Patch SLA violation triggers automated escalation.', detectionWindow: '2017-03-10 — day after patch SLA missed' },
    { primitiveId: 'P7', primitiveName: 'Quantum-Resistant Integrity', failureScore: 10, whatWasMissing: '35 expired SSL certificates found during investigation. No crypto hygiene monitoring.', whatDatacendiaWouldDo: 'Certificate expiry monitoring with automated renewal alerts. Crypto hygiene dashboard tracks all certificates, keys, and their expiry dates.', detectionWindow: 'Continuous — certificates would never expire unnoticed' },
  ],

  simulatedIISS: 142,
  simulatedBand: 'critical',

  counterfactual: {
    earliestDetection: 'March 9, 2017 — the day Equifax IT was notified of the vulnerability. Drift Detection (P5) would have flagged the unpatched state within 24 hours. Override Accountability (P3) would have required formal sign-off to defer patching.',
    preventableCost: 1_500_000_000,
    preventablePercentage: 88,
    keyInterventions: [
      'P5: Patch SLA violation flagged within 24 hours of CVE disclosure notification',
      'P3: Decision to defer patching requires executive risk-acceptance with justification',
      'P5: Expired SSL certificate on monitoring tool detected by meta-monitoring',
      'P7: Certificate expiry dashboard prevents the 76-day blind spot entirely',
      'P1: Timestamped record proves exactly when organization had notice of vulnerability',
    ],
  },
};

// =============================================================================
// CASE 4: FTX COLLAPSE (2022)
// =============================================================================

const FTX_COLLAPSE: RealWorldBenchmark = {
  id: 'ftx-collapse',
  company: 'FTX / Alameda Research',
  incident: 'Cryptocurrency Exchange Collapse & Fraud',
  year: 2022,
  industry: 'Financial Services / Crypto',

  summary: 'FTX, once valued at $32 billion, collapsed in November 2022 after CoinDesk reported that Alameda Research (FTX\'s affiliated trading firm, also controlled by CEO Sam Bankman-Fried) held $14.6 billion in assets dominated by FTX\'s own FTT token. This triggered a bank run. Investigation revealed FTX had secretly transferred $8 billion in customer funds to Alameda. FTX had no board of directors, no CFO, no independent audit committee, and used QuickBooks for accounting. Bankman-Fried was convicted of 7 counts of fraud and sentenced to 25 years in prison.',

  rootCauses: [
    'No board of directors — single individual controlled all decisions',
    'No CFO — financial oversight nonexistent',
    'No independent audit committee',
    'Used QuickBooks for $32B exchange (consumer accounting software)',
    '$8B in customer funds secretly transferred to Alameda Research',
    'FTT token used as collateral — circular dependency',
    'No separation between exchange and trading firm',
    'Bahamas incorporation chosen to avoid U.S. regulatory oversight',
  ],

  sources: [
    'U.S. DOJ Indictment, United States v. Bankman-Fried, December 2022',
    'FTX Bankruptcy Filing, Chapter 11, November 2022',
    'John Ray III (CEO, post-bankruptcy): "Never in my career have I seen such a complete failure of corporate controls"',
    'CoinDesk Report on Alameda Balance Sheet, November 2, 2022',
    'SDNY Conviction, November 2023; Sentencing: 25 years, March 2024',
  ],

  financialImpact: {
    totalCost: 8_000_000_000,
    fines: 0,                    // Criminal case, not regulatory fine
    settlements: 0,
    lostRevenue: 0,
    marketCapLoss: 32_000_000_000, // Total valuation wiped
    otherCosts: 8_000_000_000,     // Customer losses
    affectedPeople: 1_000_000,
  },

  timeline: [
    { date: '2019', event: 'FTX founded with no board of directors, no CFO, no audit committee', primitiveRelevance: ['P2', 'P3', 'P9'] },
    { date: '2020-2022', event: 'Customer funds secretly transferred to Alameda Research — $8B total', primitiveRelevance: ['P1', 'P3', 'P5'] },
    { date: '2022-11-02', event: 'CoinDesk reports Alameda\'s balance sheet is mostly FTT tokens', primitiveRelevance: ['P5', 'P8'] },
    { date: '2022-11-06', event: 'Binance CEO announces selling FTT holdings — triggers bank run', primitiveRelevance: ['P5'] },
    { date: '2022-11-08', event: 'FTX halts withdrawals — $6B withdrawn in 72 hours', primitiveRelevance: ['P1', 'P5'] },
    { date: '2022-11-11', event: 'FTX files for Chapter 11 bankruptcy', primitiveRelevance: ['P1', 'P3'] },
  ],

  primitiveFailures: [
    { primitiveId: 'P1', primitiveName: 'Discovery-Time Proof', failureScore: 0, whatWasMissing: 'No timestamped, auditable record of any decision. QuickBooks for a $32B exchange. No proof of when fund transfers occurred.', whatDatacendiaWouldDo: 'Every fund movement cryptographically timestamped and hash-chained. Impossible to move $8B without creating irrefutable audit trail.', detectionWindow: '2020 — first unauthorized transfer' },
    { primitiveId: 'P2', primitiveName: 'Deliberation Capture', failureScore: 0, whatWasMissing: 'No board of directors. No formal decision-making process. Single individual made all decisions.', whatDatacendiaWouldDo: 'Council system requires multi-agent deliberation for all material decisions. No single individual can authorize fund transfers without documented multi-party approval.', detectionWindow: '2019 — at founding' },
    { primitiveId: 'P3', primitiveName: 'Override Accountability', failureScore: 0, whatWasMissing: 'No oversight mechanism whatsoever. CEO could move customer funds to affiliated trading firm with zero accountability.', whatDatacendiaWouldDo: 'Any transfer of customer funds triggers VetoService review. 6 veto agents evaluate the proposal. CISO, Legal, and Compliance agents would have blocked the transfer.', detectionWindow: '2020 — first unauthorized transfer blocked' },
    { primitiveId: 'P5', primitiveName: 'Drift Detection', failureScore: 0, whatWasMissing: 'No monitoring of customer fund balances vs. actual reserves. No continuous compliance monitoring.', whatDatacendiaWouldDo: 'Real-time drift detection on customer funds vs. reserves ratio. CUSUM algorithm detects systematic deviation within days. Automatic regulatory notification.', detectionWindow: '2020 — within days of first fund diversion' },
    { primitiveId: 'P9', primitiveName: 'Cross-Jurisdiction Compliance', failureScore: 0, whatWasMissing: 'Deliberately incorporated in Bahamas to avoid U.S. regulation. No cross-jurisdiction compliance analysis.', whatDatacendiaWouldDo: 'Jurisdiction engine flags regulatory gaps for entities operating across borders. Identifies that serving U.S. customers from Bahamas creates compliance obligations that are unmet.', detectionWindow: '2019 — at founding' },
  ],

  simulatedIISS: 12,
  simulatedBand: 'critical',

  counterfactual: {
    earliestDetection: '2019 — at founding, the absence of a board, CFO, and audit committee would have triggered Cognitive Bias Mitigation (P6) and Override Accountability (P3) alerts. The platform cannot function without multi-party governance.',
    preventableCost: 8_000_000_000,
    preventablePercentage: 100,
    keyInterventions: [
      'P2: Council system requires multi-agent deliberation — single-person control is impossible',
      'P3: Customer fund transfers blocked by VetoService without multi-party approval',
      'P5: Reserve ratio drift detected within days — $8B discrepancy impossible to hide',
      'P1: Every transaction cryptographically timestamped — full forensic trail',
      'P9: Cross-jurisdiction analysis flags Bahamas regulatory arbitrage',
    ],
  },
};

// =============================================================================
// CASE 5: SILICON VALLEY BANK COLLAPSE (2023)
// =============================================================================

const SVB_COLLAPSE: RealWorldBenchmark = {
  id: 'svb-collapse',
  company: 'Silicon Valley Bank',
  incident: 'Bank Run & FDIC Receivership',
  year: 2023,
  industry: 'Financial Services / Banking',

  summary: 'Silicon Valley Bank collapsed on March 10, 2023 — the second-largest bank failure in U.S. history. SVB invested heavily in long-duration U.S. Treasury bonds and mortgage-backed securities during the low-interest-rate environment. When the Federal Reserve raised interest rates aggressively in 2022-2023, these bonds lost significant value. SVB was forced to sell $21 billion in bonds at a $1.8 billion loss to meet depositor withdrawals. This triggered a bank run: $42 billion was withdrawn in a single day. The CRO position was vacant for 8 months. The bank\'s risk committee met only 2 times in the year before collapse.',

  rootCauses: [
    'Massive concentration in long-duration bonds without adequate interest rate hedging',
    'CRO (Chief Risk Officer) position vacant for 8 months (April-December 2022)',
    'Board risk committee met only 2 times in the critical year',
    'No hedging strategy for interest rate risk on bond portfolio',
    'Depositor concentration: 93% of deposits exceeded FDIC insurance limit',
    'Disclosure of $1.8B bond loss triggered panic — no stakeholder communication plan',
    'Management bonuses paid days before collapse',
  ],

  sources: [
    'Federal Reserve Board Review of the Federal Reserve\'s Supervision of Silicon Valley Bank, April 2023',
    'FDIC Report, "Overview of the Resolution of Silicon Valley Bank," April 2023',
    'U.S. Senate Banking Committee Hearings, March-May 2023',
    'Federal Reserve Vice Chair Barr Testimony, March 2023',
  ],

  financialImpact: {
    totalCost: 20_000_000_000,
    fines: 0,
    settlements: 0,
    lostRevenue: 0,
    marketCapLoss: 16_000_000_000,
    otherCosts: 20_000_000_000,  // FDIC cost to resolve + contagion
    affectedPeople: 40_000,       // SVB business customers
  },

  timeline: [
    { date: '2021', event: 'SVB invests heavily in long-duration bonds during low-rate environment', primitiveRelevance: ['P5', 'P6'] },
    { date: '2022-04', event: 'CRO departs — position remains vacant for 8 months', primitiveRelevance: ['P3', 'P4'] },
    { date: '2022-03', event: 'Federal Reserve begins aggressive rate hikes', primitiveRelevance: ['P5'] },
    { date: '2023-03-08', event: 'SVB announces $1.8B loss on bond sale and $2.25B capital raise', primitiveRelevance: ['P1', 'P5', 'P6'] },
    { date: '2023-03-09', event: 'Bank run: $42 billion withdrawn in one day', primitiveRelevance: ['P5'] },
    { date: '2023-03-10', event: 'FDIC places SVB into receivership', primitiveRelevance: ['P1', 'P3'] },
  ],

  primitiveFailures: [
    { primitiveId: 'P3', primitiveName: 'Override Accountability', failureScore: 15, whatWasMissing: 'CRO position vacant for 8 months during the most critical period. No mechanism to flag that a key risk oversight role was unfilled.', whatDatacendiaWouldDo: 'Governance gap detection automatically flags vacant C-level risk positions. Override accountability requires CRO sign-off on interest rate risk decisions — vacancy blocks risky decisions.', detectionWindow: '2022-04 — immediately when CRO departed' },
    { primitiveId: 'P4', primitiveName: 'Continuity Memory', failureScore: 20, whatWasMissing: 'When CRO departed, institutional knowledge of risk management strategies was lost. No succession plan for risk oversight.', whatDatacendiaWouldDo: 'CendiaSuccession captures tacit knowledge from departing risk officers. Knowledge graph maintains risk management frameworks independent of personnel.', detectionWindow: '2022-04 — CRO departure triggers knowledge capture' },
    { primitiveId: 'P5', primitiveName: 'Drift Detection', failureScore: 10, whatWasMissing: 'No continuous monitoring of interest rate risk exposure as rates changed. Bond portfolio duration risk grew unchecked for 18+ months.', whatDatacendiaWouldDo: 'Drift detection on portfolio duration, interest rate sensitivity, and depositor concentration. CUSUM algorithm flags when risk metrics exceed baseline thresholds.', detectionWindow: '2022-Q1 — when rate hike trajectory became clear' },
    { primitiveId: 'P6', primitiveName: 'Cognitive Bias Mitigation', failureScore: 15, whatWasMissing: 'Anchoring bias: management anchored to the assumption that low interest rates would persist. No adversarial challenge of the investment strategy.', whatDatacendiaWouldDo: 'Adversarial agent asks: "What happens to our bond portfolio if rates rise 300bps?" Ghost Board rehearsal simulates rate shock scenario. Pre-Mortem analysis identifies "rates rise faster than expected" as top failure mode.', detectionWindow: '2021 — when bond concentration strategy was decided' },
  ],

  simulatedIISS: 135,
  simulatedBand: 'critical',

  counterfactual: {
    earliestDetection: 'April 2022 — when the CRO departed, Override Accountability (P3) would have flagged the governance gap. Drift Detection (P5) would have been monitoring interest rate risk exposure since 2021.',
    preventableCost: 16_000_000_000,
    preventablePercentage: 80,
    keyInterventions: [
      'P3: CRO vacancy automatically blocks high-risk investment decisions until replacement hired',
      'P5: Portfolio duration drift detected months before crisis — automatic rebalancing trigger',
      'P6: PreMortem analysis: "What if rates rise 300bps?" identifies catastrophic exposure',
      'P4: CRO departure triggers knowledge capture — risk framework persists',
      'P5: Depositor concentration (93% uninsured) flagged as systemic risk',
    ],
  },
};

// =============================================================================
// CASE 6: CROWDSTRIKE GLOBAL OUTAGE (2024)
// =============================================================================

const CROWDSTRIKE: RealWorldBenchmark = {
  id: 'crowdstrike-outage',
  company: 'CrowdStrike',
  incident: 'Falcon Sensor Update Causes Global IT Outage',
  year: 2024,
  industry: 'Technology / Cybersecurity',

  summary: 'On July 19, 2024, a faulty CrowdStrike Falcon sensor configuration update caused approximately 8.5 million Windows devices worldwide to crash with Blue Screen of Death (BSOD) errors. The update, a "Channel File" (not a full software update), bypassed normal testing procedures. Airlines grounded flights, hospitals postponed surgeries, banks went offline, and emergency services were disrupted. The outage demonstrated the fragility of global IT infrastructure dependent on a single vendor\'s automatic updates. CrowdStrike\'s stock dropped 11% in a single day.',

  rootCauses: [
    'Channel File update bypassed standard testing/staging procedures',
    'Single faulty configuration file pushed to 8.5 million devices simultaneously',
    'No canary deployment — update went to all customers at once, not gradually',
    'Kernel-level access meant crash was unrecoverable without manual intervention',
    'No automated rollback mechanism for Channel File updates',
    'Excessive trust in automated testing pipeline (test gap for edge case)',
  ],

  sources: [
    'CrowdStrike Preliminary Post Incident Review, July 2024',
    'U.S. House Homeland Security Committee Hearing, September 2024',
    'Microsoft estimate: 8.5 million Windows devices affected',
    'Delta Air Lines losses: $500M (lawsuit filed against CrowdStrike)',
    'Industry-wide estimated losses: $5.4B (Parametrix Insurance)',
  ],

  financialImpact: {
    totalCost: 5_400_000_000,
    fines: 0,
    settlements: 500_000_000,    // Delta lawsuit (pending)
    lostRevenue: 0,
    marketCapLoss: 12_000_000_000,
    otherCosts: 4_900_000_000,   // Industry-wide recovery costs
    affectedPeople: 8_500_000,    // Devices affected
  },

  timeline: [
    { date: '2024-07-19 04:09 UTC', event: 'Faulty Channel File 291 pushed to all Falcon sensors globally', primitiveRelevance: ['P1', 'P5'] },
    { date: '2024-07-19 05:27 UTC', event: 'CrowdStrike identifies the issue and reverts the update (78 minutes later)', primitiveRelevance: ['P5'] },
    { date: '2024-07-19', event: '8.5 million Windows devices worldwide crash with BSOD — airlines, hospitals, banks affected', primitiveRelevance: ['P5', 'P6'] },
    { date: '2024-07-19', event: 'Devices require manual boot into Safe Mode and file deletion to recover', primitiveRelevance: ['P5'] },
  ],

  primitiveFailures: [
    { primitiveId: 'P1', primitiveName: 'Discovery-Time Proof', failureScore: 40, whatWasMissing: 'No timestamped decision record of who approved pushing the Channel File without staged rollout.', whatDatacendiaWouldDo: 'Every deployment decision timestamped and hash-chained. The decision to bypass canary deployment recorded with approval chain.', detectionWindow: '2024-07-19 — before deployment approved' },
    { primitiveId: 'P5', primitiveName: 'Drift Detection', failureScore: 20, whatWasMissing: 'No real-time monitoring of deployment impact. Took 78 minutes to detect the issue despite 8.5M devices crashing.', whatDatacendiaWouldDo: 'Canary deployment monitoring with automatic rollback. If >0.1% of devices report errors within first minute, deployment automatically halted. 78-minute detection gap reduced to <60 seconds.', detectionWindow: '2024-07-19 04:10 UTC — within 60 seconds of first crash' },
    { primitiveId: 'P6', primitiveName: 'Cognitive Bias Mitigation', failureScore: 30, whatWasMissing: 'Overconfidence in automated testing pipeline. No adversarial challenge: "What happens if this update crashes every device?"', whatDatacendiaWouldDo: 'Pre-Mortem analysis for kernel-level updates: "What is the worst-case scenario?" identifies global BSOD as top failure mode. Adversarial agent forces consideration of rollback mechanisms before deployment.', detectionWindow: 'Before deployment — during decision to push update' },
  ],

  simulatedIISS: 285,
  simulatedBand: 'vulnerable',

  counterfactual: {
    earliestDetection: 'Before deployment — Pre-Mortem analysis (P6) would have identified "global device crash" as the top failure mode for any kernel-level update pushed without canary deployment. Drift Detection (P5) would have caught the issue within 60 seconds instead of 78 minutes.',
    preventableCost: 4_500_000_000,
    preventablePercentage: 83,
    keyInterventions: [
      'P6: Pre-Mortem flags "global crash" as catastrophic failure mode for non-staged kernel update',
      'P5: Canary deployment with <60-second anomaly detection halts rollout after first ~1000 devices',
      'P3: Decision to bypass staged rollout requires executive sign-off with documented justification',
      'P1: Deployment approval chain cryptographically recorded for accountability',
    ],
  },
};

// =============================================================================
// AGGREGATE BENCHMARK FUNCTIONS
// =============================================================================

export const ALL_BENCHMARKS: RealWorldBenchmark[] = [
  BOEING_737_MAX,
  WELLS_FARGO,
  EQUIFAX,
  FTX_COLLAPSE,
  SVB_COLLAPSE,
  CROWDSTRIKE,
];

/**
 * Get the total financial impact across all benchmarked failures.
 */
export function getTotalBenchmarkImpact(): {
  totalCost: number;
  totalCasualties: number;
  totalAffected: number;
  avgPreventablePercentage: number;
  totalPreventableCost: number;
} {
  const totalCost = ALL_BENCHMARKS.reduce((s, b) => s + b.financialImpact.totalCost, 0);
  const totalCasualties = ALL_BENCHMARKS.reduce((s, b) => s + (b.financialImpact.casualties || 0), 0);
  const totalAffected = ALL_BENCHMARKS.reduce((s, b) => s + (b.financialImpact.affectedPeople || 0), 0);
  const avgPreventable = ALL_BENCHMARKS.reduce((s, b) => s + b.counterfactual.preventablePercentage, 0) / ALL_BENCHMARKS.length;
  const totalPreventable = ALL_BENCHMARKS.reduce((s, b) => s + b.counterfactual.preventableCost, 0);

  return { totalCost, totalCasualties, totalAffected, avgPreventablePercentage: Math.round(avgPreventable), totalPreventableCost: totalPreventable };
}

/**
 * Get the most frequently failed primitives across all benchmarks.
 * Returns primitives ranked by how often they appear in failure analyses.
 */
export function getMostCriticalPrimitives(): Array<{
  primitiveId: string;
  primitiveName: string;
  failureCount: number;
  avgFailureScore: number;
  caseStudies: string[];
}> {
  const primitiveMap = new Map<string, { name: string; scores: number[]; cases: string[] }>();

  for (const benchmark of ALL_BENCHMARKS) {
    for (const failure of benchmark.primitiveFailures) {
      const existing = primitiveMap.get(failure.primitiveId) || { name: failure.primitiveName, scores: [], cases: [] };
      existing.scores.push(failure.failureScore);
      existing.cases.push(benchmark.company);
      primitiveMap.set(failure.primitiveId, existing);
    }
  }

  return Array.from(primitiveMap.entries())
    .map(([id, data]) => ({
      primitiveId: id,
      primitiveName: data.name,
      failureCount: data.scores.length,
      avgFailureScore: Math.round(data.scores.reduce((s, v) => s + v, 0) / data.scores.length),
      caseStudies: data.cases,
    }))
    .sort((a, b) => b.failureCount - a.failureCount);
}

/**
 * Compare the current Datacendia IISS score against the failed organizations.
 */
export function compareAgainstBenchmarks(): Array<{
  company: string;
  theirScore: number;
  theirBand: string;
  datacendiaScore: number;
  datacentdiaBand: string;
  scoreDelta: number;
  costThatCouldHaveBeenPrevented: number;
}> {
  const currentIISS = calculateIISS();

  return ALL_BENCHMARKS.map(b => ({
    company: b.company,
    theirScore: b.simulatedIISS,
    theirBand: b.simulatedBand,
    datacendiaScore: currentIISS.overallScore,
    datacentdiaBand: currentIISS.band,
    scoreDelta: currentIISS.overallScore - b.simulatedIISS,
    costThatCouldHaveBeenPrevented: b.counterfactual.preventableCost,
  }));
}
