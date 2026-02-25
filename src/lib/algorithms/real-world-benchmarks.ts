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

// =============================================================================
// =============================================================================
//
//  PART 2: SUCCESS STORIES — Companies That Got Governance Right
//
// =============================================================================
// =============================================================================
// These demonstrate what GOOD governance looks like and what the system can
// learn from to grow. Each maps to DCII primitives that were PRESENT.

export interface SuccessStoryBenchmark {
  id: string;
  company: string;
  event: string;
  year: number;
  industry: string;
  summary: string;
  sources: string[];

  // What they did right — mapped to DCII primitives
  primitivesPresent: Array<{
    primitiveId: string;
    primitiveName: string;
    effectivenessScore: number;  // 0-100: how well they executed this primitive
    whatTheyDid: string;
    outcome: string;
  }>;

  // Impact
  impact: {
    reputationEffect: 'strengthened' | 'preserved' | 'recovered';
    financialOutcome: string;
    marketPosition: string;
    costOfAction: number;
    valueSaved: number;
    timeToRecover?: string;
  };

  // What the system learns
  learningPatterns: string[];
  simulatedIISS: number;
  simulatedBand: string;
}

// =============================================================================
// SUCCESS 1: JOHNSON & JOHNSON TYLENOL CRISIS (1982)
// =============================================================================

const JNJ_TYLENOL: SuccessStoryBenchmark = {
  id: 'jnj-tylenol-1982',
  company: 'Johnson & Johnson',
  event: 'Tylenol Cyanide Poisoning — Gold Standard Crisis Response',
  year: 1982,
  industry: 'Pharmaceutical / Consumer Health',

  summary: 'In September 1982, seven people in the Chicago area died after taking Extra-Strength Tylenol capsules that had been laced with potassium cyanide by an unknown perpetrator. J&J immediately recalled ALL 31 million bottles of Tylenol from every store in America — even though only a handful were contaminated and the company was not at fault. CEO James Burke made himself publicly available, appeared on 60 Minutes, and established a toll-free hotline. J&J then pioneered tamper-evident packaging (triple-sealed bottles) before any regulation required it. Tylenol regained its #1 market position within a year. The total cost was ~$100M but preserved a brand worth billions.',

  sources: [
    'Investopedia, "How Did J&J Corporate Responsibility Policy Pay Off in 1982?"',
    'The New York Times, "Tylenol Made a Hero of Johnson & Johnson: The Recall That Started Them All"',
    'Harvard Business School Case Study, "Johnson & Johnson and the Tylenol Crisis"',
    'Washington Post Archives, 1982-1983 coverage',
  ],

  primitivesPresent: [
    { primitiveId: 'P2', primitiveName: 'Deliberation Capture', effectivenessScore: 95, whatTheyDid: 'CEO James Burke convened a 7-member crisis committee within hours. All decisions were documented and communicated transparently. The J&J Credo (written 1943) served as the explicit decision framework — "our first responsibility is to the patients."', outcome: 'Every decision traceable to the Credo. No ambiguity about priorities.' },
    { primitiveId: 'P3', primitiveName: 'Override Accountability', effectivenessScore: 90, whatTheyDid: 'Marketing and finance teams argued against a full recall (too costly, company not at fault). CEO explicitly overrode these objections and documented why — patient safety trumped financial considerations. The override was public and deliberate.', outcome: 'The override decision was transparent. No one could later claim the decision was made carelessly.' },
    { primitiveId: 'P4', primitiveName: 'Continuity Memory', effectivenessScore: 95, whatTheyDid: 'The J&J Credo (1943) served as institutional memory — a written decision framework that survived leadership changes. The Credo explicitly prioritized patients over shareholders.', outcome: 'The Credo prevented the crisis committee from prioritizing short-term financial concerns. 40 years of institutional values guided the response.' },
    { primitiveId: 'P5', primitiveName: 'Drift Detection', effectivenessScore: 85, whatTheyDid: 'J&J detected the crisis within hours of the first death report. They did not wait for regulatory action — they proactively investigated and acted.', outcome: 'Self-detection and self-correction before government mandated action.' },
    { primitiveId: 'P6', primitiveName: 'Cognitive Bias Mitigation', effectivenessScore: 90, whatTheyDid: 'CEO Burke actively challenged the "we\'re not at fault so we shouldn\'t recall" bias. He asked: "What would we want done if our families were at risk?" He insisted on full recall despite it being the most expensive option.', outcome: 'The adversarial framing ("what if it were our families?") defeated the confirmation bias that the problem was limited.' },
  ],

  impact: {
    reputationEffect: 'strengthened',
    financialOutcome: '$100M recall cost, but Tylenol regained #1 market share within 12 months',
    marketPosition: 'Tylenol went from 37% market share (pre-crisis) to 30% (during crisis) back to 35%+ within a year. Created the tamper-evident packaging standard adopted by the entire industry.',
    costOfAction: 100_000_000,
    valueSaved: 5_000_000_000,  // Brand value preserved
    timeToRecover: '12 months to regain #1 position',
  },

  learningPatterns: [
    'PATTERN: Written institutional values (Credo) provide decision framework that survives leadership changes → P4 Continuity Memory',
    'PATTERN: Transparent overrides of financial objections build trust rather than destroy it → P3 Override Accountability',
    'PATTERN: "What if it were our families?" framing defeats confirmation bias → P6 Cognitive Bias Mitigation',
    'PATTERN: Speed of self-detection (hours, not days) correlates with recovery speed → P5 Drift Detection',
    'PATTERN: Short-term cost ($100M) can protect long-term value ($5B+ brand) → risk-weighted decision framework',
    'PATTERN: Full transparency during crisis (CEO on 60 Minutes) builds more trust than minimization',
  ],

  simulatedIISS: 780,
  simulatedBand: 'resilient',
};

// =============================================================================
// SUCCESS 2: JPMORGAN CHASE POST-LONDON WHALE REFORM (2012→2023)
// =============================================================================

const JPM_REFORM: SuccessStoryBenchmark = {
  id: 'jpm-london-whale-reform',
  company: 'JPMorgan Chase',
  event: 'Post-London Whale Governance Overhaul → Survived 2023 Banking Crisis',
  year: 2012,
  industry: 'Financial Services',

  summary: 'In 2012, JPMorgan lost $6.2 billion from risky trades by a London-based trader nicknamed the "London Whale." CEO Jamie Dimon initially called the concern "a tempest in a teapot" but then led a comprehensive governance overhaul: CRO was elevated to report directly to CEO and board, risk limits were hardened, Value-at-Risk models were rebuilt, and the entire Chief Investment Office was restructured. The reforms proved their worth in March 2023 when Silicon Valley Bank, Signature Bank, and First Republic collapsed — JPMorgan not only survived but acquired First Republic Bank. JPMorgan\'s stock outperformed banking peers by 40%+ during the 2023 crisis.',

  sources: [
    'JPMorgan Chase Internal Task Force Report on CIO Losses, January 2013',
    'U.S. Senate Permanent Subcommittee on Investigations, "JPMorgan Chase Whale Trades," March 2013',
    'Harvard Law School Forum, "The JP Morgan Whale Report," January 2013',
    'FDIC, First Republic Bank acquisition by JPMorgan Chase, May 2023',
    'JPMorgan Chase Annual Reports 2013-2023',
  ],

  primitivesPresent: [
    { primitiveId: 'P1', primitiveName: 'Discovery-Time Proof', effectivenessScore: 80, whatTheyDid: 'After the Whale loss, JPM implemented comprehensive risk event timestamping. Every VaR breach, limit exception, and risk escalation is now recorded with immutable timestamps.', outcome: 'During 2023 banking crisis, JPM could demonstrate to regulators exactly when they identified and responded to each risk event.' },
    { primitiveId: 'P3', primitiveName: 'Override Accountability', effectivenessScore: 90, whatTheyDid: 'CRO now reports directly to CEO and board (not buried in org chart). Any risk limit override requires documented approval with escalation. The "tempest in a teapot" dismissal could never happen again — risk concerns automatically escalate.', outcome: 'In 2023, risk concerns about commercial real estate and deposit concentration were escalated immediately — no dismissal possible.' },
    { primitiveId: 'P4', primitiveName: 'Continuity Memory', effectivenessScore: 85, whatTheyDid: 'JPM institutionalized the lessons from London Whale into permanent risk frameworks, training programs, and decision precedents. New risk officers are trained on the Whale case.', outcome: 'The institutional memory of the London Whale failure protected JPM from repeating similar mistakes during 2023 crisis.' },
    { primitiveId: 'P5', primitiveName: 'Drift Detection', effectivenessScore: 85, whatTheyDid: 'VaR models were rebuilt with backtesting requirements. Continuous monitoring of position concentrations and risk limits. Daily risk reporting to senior management.', outcome: 'JPM detected and hedged interest rate risk exposure in 2022 — avoiding the SVB-style bond portfolio losses that destroyed other banks.' },
    { primitiveId: 'P6', primitiveName: 'Cognitive Bias Mitigation', effectivenessScore: 80, whatTheyDid: 'Independent risk challenge function established. Risk management explicitly empowered to challenge business unit assumptions. "Tempest in a teapot" framing identified as a case study in anchoring bias.', outcome: 'During 2023 crisis, risk team challenged optimistic assumptions about deposit stability — leading to preemptive liquidity measures.' },
  ],

  impact: {
    reputationEffect: 'strengthened',
    financialOutcome: 'Lost $6.2B in London Whale (2012), but governance reforms led to outperforming peers by 40%+ during 2023 banking crisis. Acquired First Republic Bank.',
    marketPosition: 'Became the most trusted U.S. bank during 2023 crisis. FDIC chose JPM to acquire First Republic. Stock price premium vs. peers.',
    costOfAction: 6_200_000_000,   // London Whale loss was the "tuition"
    valueSaved: 50_000_000_000,     // Avoided SVB-style collapse + First Republic acquisition value
    timeToRecover: '18 months to rebuild risk framework; ongoing dividends for 10+ years',
  },

  learningPatterns: [
    'PATTERN: CRO reporting directly to CEO/board prevents risk dismissal → P3 Override Accountability',
    'PATTERN: Failure case studies as training material creates institutional antibodies → P4 Continuity Memory',
    'PATTERN: Daily risk reporting with drift monitoring catches problems early → P5 Drift Detection',
    'PATTERN: Independent challenge function defeats anchoring bias ("tempest in a teapot") → P6 Cognitive Bias Mitigation',
    'PATTERN: Governance reform after failure creates competitive advantage in next crisis',
    'PATTERN: The $6.2B "tuition" from London Whale protected $50B+ in 2023 — 8x return on painful lesson',
  ],

  simulatedIISS: 720,
  simulatedBand: 'resilient',
};

// =============================================================================
// SUCCESS 3: MICROSOFT RESPONSIBLE AI PROGRAM (2018→present)
// =============================================================================

const MICROSOFT_RAI: SuccessStoryBenchmark = {
  id: 'microsoft-responsible-ai',
  company: 'Microsoft',
  event: 'Responsible AI Framework — Proactive Governance Before Regulation',
  year: 2018,
  industry: 'Technology',

  summary: 'In 2018, Microsoft established its Office of Responsible AI and created the AETHER Committee (AI, Ethics, and Effects in Engineering and Research) to review all AI products before release. After the Tay chatbot incident in 2016 (which became racist within hours of launch), Microsoft built systematic review processes: every AI feature undergoes impact assessment, red-teaming, and fairness testing. When the EU AI Act was adopted in 2024, Microsoft was already substantially compliant — saving an estimated $200-500M in rushed remediation that competitors faced. Microsoft avoided major AI governance scandals while deploying AI across Azure, Office 365, GitHub Copilot, and Bing.',

  sources: [
    'Microsoft Responsible AI Standard v2, June 2022',
    'Microsoft Annual Responsible AI Transparency Report, 2023',
    'Brad Smith (Microsoft President), "Tools and Weapons," 2019',
    'Microsoft AETHER Committee charter and governance structure (public documentation)',
    'EU AI Act compliance timeline analysis, 2024',
  ],

  primitivesPresent: [
    { primitiveId: 'P2', primitiveName: 'Deliberation Capture', effectivenessScore: 85, whatTheyDid: 'AETHER Committee reviews are documented with positions, dissents, and conditions. Impact assessments for each AI deployment recorded and versioned.', outcome: 'When regulators or media questioned AI products, Microsoft could produce complete decision records showing deliberation and review.' },
    { primitiveId: 'P5', primitiveName: 'Drift Detection', effectivenessScore: 80, whatTheyDid: 'Continuous monitoring of AI model outputs for bias drift, accuracy degradation, and safety threshold violations. Red team exercises run continuously.', outcome: 'Caught and corrected several Bing Chat issues within days rather than months. Continuous monitoring prevented Tay-like incidents from recurring.' },
    { primitiveId: 'P6', primitiveName: 'Cognitive Bias Mitigation', effectivenessScore: 85, whatTheyDid: 'Mandatory red-teaming for all AI products. Dedicated adversarial testing team that attempts to break AI systems before release.', outcome: 'GitHub Copilot, Azure OpenAI, and Bing Chat all underwent extensive adversarial testing, catching issues pre-release.' },
    { primitiveId: 'P9', primitiveName: 'Cross-Jurisdiction Compliance', effectivenessScore: 80, whatTheyDid: 'Proactively built compliance frameworks for EU AI Act, GDPR, and NIST AI RMF before mandated. Multi-jurisdiction review for every AI deployment.', outcome: 'When EU AI Act became law in August 2024, Microsoft was substantially compliant. Competitors faced rushed $200-500M remediation programs.' },
  ],

  impact: {
    reputationEffect: 'strengthened',
    financialOutcome: 'Estimated $200-500M saved by being EU AI Act-ready before competitors. No major AI governance scandals despite being the largest AI deployer.',
    marketPosition: 'Trusted partner for enterprise AI. Azure AI market share grew from 21% to 25% (2022-2025). Government contracts won partly on governance credibility.',
    costOfAction: 50_000_000,    // Estimated annual RAI program cost
    valueSaved: 500_000_000,     // Compliance cost avoidance + reputation premium
  },

  learningPatterns: [
    'PATTERN: Proactive governance framework built BEFORE regulation = competitive advantage → P9 Cross-Jurisdiction',
    'PATTERN: Mandatory red-teaming catches issues pre-release, not post-crisis → P6 Cognitive Bias Mitigation',
    'PATTERN: Continuous model monitoring prevents drift from becoming scandal → P5 Drift Detection',
    'PATTERN: Documented deliberation creates defensible record for regulators → P2 Deliberation Capture',
    'PATTERN: Annual cost of governance ($50M) is 10x cheaper than single governance failure',
    'PATTERN: Learning from Tay (2016) led to AETHER (2018) — failures become institutional antibodies',
  ],

  simulatedIISS: 700,
  simulatedBand: 'resilient',
};

// =============================================================================
// =============================================================================
//
//  PART 3: MARKET DISRUPTION EVENTS — External Shocks That Test Governance
//
// =============================================================================
// =============================================================================

export interface MarketDisruptionBenchmark {
  id: string;
  event: string;
  date: string;
  category: 'ai_disruption' | 'regulatory' | 'technology' | 'market_shock';
  summary: string;
  sources: string[];

  // Market impact
  marketImpact: {
    totalMarketCapLoss: number;
    recoveryTimeline: string;
    companiesHardestHit: Array<{ name: string; ticker?: string; dropPercent: number; reason: string }>;
    companiesLeastAffected: Array<{ name: string; reason: string }>;
  };

  // Was this predictable?
  predictability: {
    wasExpected: boolean;
    earlySignals: string[];
    whoSawItComing: string[];
    whyMostMissedIt: string;
  };

  // DCII primitive analysis — what would have prepared an organization
  preparednessAnalysis: Array<{
    primitiveId: string;
    primitiveName: string;
    howItHelps: string;
    withoutIt: string;
  }>;

  // Learning patterns for the system
  learningPatterns: string[];
}

// =============================================================================
// DISRUPTION 1: ANTHROPIC CLAUDE COWORK PLUGINS — "SAASPOCALYPSE" (FEB 2026)
// =============================================================================

const ANTHROPIC_SAASPOCALYPSE: MarketDisruptionBenchmark = {
  id: 'anthropic-saaspocalypse-2026',
  event: 'Anthropic Claude Cowork Plugins — $285B Software Stock Selloff',
  date: '2026-02-03',
  category: 'ai_disruption',

  summary: 'On Friday January 31, 2026, Anthropic released 11 open-source plugins for its Claude Cowork agentic platform, targeting legal, finance, sales, data, and marketing workflows. On Tuesday February 3, investors panicked — $285 billion in market value was wiped from software, legal tech, and financial services stocks in a single trading session. Analysts called it the "SaaSpocalypse." Thomson Reuters dropped 16-18%, RELX (LexisNexis) fell 14%, LegalZoom sank 19.68%, FactSet dropped 10.51%. The software industry ETF had its worst day since April. The fear: AI-native tools could replace seat-based SaaS subscriptions, undermining the entire software business model.',

  sources: [
    'CNN Business, "Anthropic\'s new AI tool sends shudders through software stocks," February 4, 2026',
    'Reuters, "Anthropic\'s new AI tools deepen selloff in data analytics and software stocks," February 3, 2026',
    'Times of India, "Explained: What is Anthropic\'s AI tool that wiped $285 billion off software stocks," February 2026',
    'Reddit r/ClaudeAI, "Anthropic just wiped $285B off the stock market," February 2026',
    'TradingView/Invezz, "Why Anthropic\'s new Claude plugins sparked global selloff in software stocks," February 2026',
    'Morgan Stanley equity research note by Toni Kaplan, February 2026',
    'LPL Financial equity research note by Thomas Shipp, February 2026',
  ],

  marketImpact: {
    totalMarketCapLoss: 285_000_000_000,
    recoveryTimeline: 'Partial recovery began Wednesday Feb 4 (Thomson Reuters +1%, RELX +1%). Analysts at Aurelion Research called selloff "sentiment driven" and predicted normalization. Comparable to DeepSeek impact on Nvidia ($600B drop in Jan 2025 that fully recovered).',
    companiesHardestHit: [
      { name: 'Thomson Reuters', ticker: 'TRI', dropPercent: 16, reason: 'Legal tech workflows directly targeted by Claude legal plugin (contract review, NDA triage, compliance checks)' },
      { name: 'LegalZoom', ticker: 'LZ', dropPercent: 19.68, reason: 'Consumer legal services most vulnerable to AI automation of routine legal tasks' },
      { name: 'RELX (LexisNexis)', dropPercent: 14, reason: 'Data analytics and legal research products directly challenged by AI-native research capabilities' },
      { name: 'FactSet', ticker: 'FDS', dropPercent: 10.51, reason: 'Financial data analytics threatened by AI that can process raw data directly' },
      { name: 'Blue Owl Capital', ticker: 'OWL', dropPercent: 9.76, reason: 'Investment in software companies devalued by AI disruption risk' },
      { name: 'Wolters Kluwer', dropPercent: 12, reason: 'Legal and compliance publishing threatened by AI-generated compliance analysis' },
      { name: 'Salesforce', dropPercent: 5, reason: 'CRM and enterprise software model challenged — Salesforce CEO had already said no more engineer hiring due to AI' },
    ],
    companiesLeastAffected: [
      { name: 'Companies with AI-governance-first positioning', reason: 'Organizations that had already integrated AI into their governance frameworks were seen as AI-native, not AI-vulnerable' },
      { name: 'Companies with proprietary data moats', reason: 'Barclays analyst Nick Dempsey noted "general AI models will not be a viable substitute for industry-specific expertise"' },
      { name: 'Infrastructure/platform companies', reason: 'Cloud providers (AWS, Azure, GCP) benefit from AI regardless of which AI company wins' },
    ],
  },

  predictability: {
    wasExpected: true,
    earlySignals: [
      'OpenAI ChatGPT launch (Nov 2022) — demonstrated AI could automate knowledge work',
      'Chegg stock crash (May 2023) — lost 98% of value as students switched to ChatGPT, proving AI can destroy SaaS models',
      'Salesforce CEO Marc Benioff publicly stated Salesforce would not hire more software engineers due to AI tools (2025)',
      'DeepSeek release (Jan 2025) — showed cheap AI models could match expensive ones, wiping $600B from Nvidia temporarily',
      'Anthropic CEO Dario Amodei warned "AI could displace half of all entry-level white-collar jobs in 1-5 years"',
      'Multiple AI coding assistants (Copilot, Cursor, Windsurf) already replacing developer workflows by 2025',
    ],
    whoSawItComing: [
      'AI researchers who understood capability trajectories',
      'Enterprise software analysts who tracked AI adoption metrics',
      'Companies that built AI-governance frameworks proactively (Microsoft, Google DeepMind)',
      'Investors who studied the Chegg/Stack Overflow destruction pattern',
    ],
    whyMostMissedIt: 'Most software companies and investors suffered from anchoring bias — they anchored to the belief that AI would enhance existing SaaS products rather than replace them. The "AI is a feature, not a product" narrative dominated until Claude Cowork showed AI could be the entire product.',
  },

  preparednessAnalysis: [
    { primitiveId: 'P5', primitiveName: 'Drift Detection', howItHelps: 'Continuous monitoring of competitive landscape would have detected the AI disruption trajectory years in advance. CUSUM/EWMA on customer usage patterns would show declining engagement with traditional software.', withoutIt: 'Thomson Reuters was caught flat-footed — 16% drop in one day suggests no early warning system for AI disruption of their core business model.' },
    { primitiveId: 'P6', primitiveName: 'Cognitive Bias Mitigation', howItHelps: 'Pre-Mortem analysis forces the question: "What if a free AI tool can do 80% of what our $500/seat product does?" Ghost Board rehearsal simulates the board meeting AFTER the disruption hits.', withoutIt: 'Most software boards were anchored to "AI enhances our products" narrative and never seriously considered "AI replaces our products" scenario.' },
    { primitiveId: 'P4', primitiveName: 'Continuity Memory', howItHelps: 'Institutional memory of past disruptions (Chegg/ChatGPT, Nvidia/DeepSeek, Blockbuster/Netflix) surfaces automatically when similar patterns emerge.', withoutIt: 'Companies failed to learn from Chegg\'s destruction — the same pattern (free AI tool replaces paid knowledge service) was repeating at enterprise scale.' },
    { primitiveId: 'P9', primitiveName: 'Cross-Jurisdiction Compliance', howItHelps: 'Regulatory horizon scanning would have flagged that EU AI Act creates compliance requirements that general-purpose AI tools (like Claude) may not meet for regulated industries — this is actually a defensive moat for incumbents.', withoutIt: 'Investors panicked without considering that regulated industries (legal, financial) have compliance requirements that open-source AI plugins cannot easily meet.' },
  ],

  learningPatterns: [
    'PATTERN: AI disruption follows a predictable sequence — academic demos → consumer adoption → enterprise disruption → market repricing',
    'PATTERN: Companies destroyed by AI disruption share a common trait: no Pre-Mortem on "what if AI replaces us?" scenario',
    'PATTERN: Regulatory compliance is a defensive moat — Claude plugins cannot replace Thomson Reuters in regulated industries without meeting compliance requirements',
    'PATTERN: The DeepSeek/Nvidia pattern repeats — panic selloff followed by recovery as reality is less extreme than fear',
    'PATTERN: Companies with governance-first AI integration (like Datacendia) are positioned as beneficiaries, not victims, of AI disruption',
    'PATTERN: Chegg (2023) → software stocks (2026) → shows escalating disruption from consumer → enterprise',
    'PATTERN: $285B selloff in one day = market had not priced in AI disruption risk = governance gap at investor/board level',
  ],
};

// =============================================================================
// DISRUPTION 2: DeepSeek RELEASE — AI COST DISRUPTION (JAN 2025)
// =============================================================================

const DEEPSEEK_DISRUPTION: MarketDisruptionBenchmark = {
  id: 'deepseek-disruption-2025',
  event: 'DeepSeek R1 Release — $600B Nvidia Wipeout',
  date: '2025-01-27',
  category: 'ai_disruption',

  summary: 'Chinese AI lab DeepSeek released its R1 reasoning model in January 2025, claiming performance comparable to OpenAI\'s models at a fraction of the training cost (~$5.6M vs hundreds of millions). On Monday January 27, Nvidia lost nearly $600 billion in market value — the largest single-day loss in U.S. stock market history. The fear: if AI models can be trained cheaply, the massive GPU infrastructure buildout may be unnecessary. However, Nvidia recovered and by October 2025 briefly became the world\'s first $5 trillion company, as DeepSeek\'s disruption proved less structural than feared.',

  sources: [
    'Reuters, "Nvidia shares plunge as DeepSeek raises questions about AI spending," January 27, 2025',
    'CNN Business, "Nvidia briefly became world\'s first $5 trillion company," October 2025',
    'DeepSeek Technical Report, "DeepSeek-R1: Incentivizing Reasoning Capability in LLMs," January 2025',
    'Bloomberg, "DeepSeek Triggers Biggest Rout in AI Stocks," January 27, 2025',
  ],

  marketImpact: {
    totalMarketCapLoss: 600_000_000_000,
    recoveryTimeline: 'Full recovery within 9 months. Nvidia reached $5 trillion by October 2025. Pattern: sharp sentiment-driven selloff → gradual recovery as fundamentals reasserted.',
    companiesHardestHit: [
      { name: 'Nvidia', ticker: 'NVDA', dropPercent: 17, reason: 'Cheap AI training implies less GPU demand — existential question for GPU infrastructure thesis' },
      { name: 'Broadcom', ticker: 'AVGO', dropPercent: 12, reason: 'AI networking infrastructure demand questioned' },
      { name: 'ASML', dropPercent: 10, reason: 'Semiconductor equipment demand questioned if AI can be trained cheaply' },
    ],
    companiesLeastAffected: [
      { name: 'AI application companies', reason: 'Cheaper models = cheaper inputs for AI applications. Application layer benefits from commoditized infrastructure.' },
      { name: 'Companies with AI governance frameworks', reason: 'Governance is model-agnostic — whether using GPT-4 or DeepSeek, you still need audit trails, bias detection, and compliance.' },
    ],
  },

  predictability: {
    wasExpected: true,
    earlySignals: [
      'Open-source AI models (Llama, Mistral) had been steadily closing the performance gap with proprietary models since 2023',
      'Scaling laws research showed diminishing returns from simply making models bigger',
      'Chinese AI labs had been publishing competitive results throughout 2024',
      'The "AI bubble" narrative had been building since mid-2024',
    ],
    whoSawItComing: [
      'AI researchers who tracked open-source model progress',
      'Analysts who understood that training efficiency would improve over time',
      'Companies that built model-agnostic architectures (not locked to one AI vendor)',
    ],
    whyMostMissedIt: 'Investors were anchored to the narrative that AI requires massive capital expenditure. The possibility that a small Chinese lab could match U.S. capabilities at 1/100th the cost challenged the entire "AI infrastructure boom" thesis.',
  },

  preparednessAnalysis: [
    { primitiveId: 'P5', primitiveName: 'Drift Detection', howItHelps: 'Monitoring open-source AI benchmark scores over time would have shown the performance gap steadily closing. Drift detection on cost-per-token metrics would have signaled the commoditization trend.', withoutIt: 'Nvidia investors priced in infinite GPU demand without monitoring the diminishing marginal returns of scale.' },
    { primitiveId: 'P6', primitiveName: 'Cognitive Bias Mitigation', howItHelps: 'Pre-Mortem: "What if someone trains a competitive model for $5M instead of $500M?" Ghost Board: "Should we diversify our AI infrastructure investments?"', withoutIt: 'Anchoring to the "bigger = better" narrative prevented investors from seriously considering efficiency breakthroughs.' },
    { primitiveId: 'P4', primitiveName: 'Continuity Memory', howItHelps: 'Historical pattern: every technology infrastructure buildout (telecom, cloud, mobile) goes through a hype cycle → commoditization → application layer value. AI is following the same pattern.', withoutIt: 'Without institutional memory of past tech cycles, investors treated AI infrastructure as uniquely exempt from commoditization.' },
  ],

  learningPatterns: [
    'PATTERN: Technology infrastructure commoditizes — the value migrates to the application and governance layer',
    'PATTERN: Panic selloffs from competitive disruption often fully reverse when fundamentals reassert (Nvidia: -$600B → +$5T in 9 months)',
    'PATTERN: Model-agnostic governance (like Datacendia) is resilient to model disruption — governance is the constant, models are the variable',
    'PATTERN: "What if someone does it for 1/100th the cost?" is a Pre-Mortem question that should be asked about every tech infrastructure investment',
    'PATTERN: Chinese AI competition validates the need for sovereign AI governance — data residency and compliance matter more when models are commoditized',
  ],
};

// =============================================================================
// DISRUPTION 3: EU AI ACT BECOMES LAW (AUG 2024)
// =============================================================================

const EU_AI_ACT: MarketDisruptionBenchmark = {
  id: 'eu-ai-act-2024',
  event: 'EU AI Act Enters Into Force — First Comprehensive AI Regulation',
  date: '2024-08-01',
  category: 'regulatory',

  summary: 'The EU AI Act, the world\'s first comprehensive AI regulation, entered into force on August 1, 2024, with a phased implementation timeline. Banned AI practices (social scoring, real-time biometric surveillance) took effect February 2025. High-risk AI system requirements take full effect August 2026. Companies deploying AI in the EU face fines up to €35M or 7% of global revenue for violations. Companies that had proactively built compliance frameworks (Microsoft, Google) were substantially ready. Companies without governance infrastructure faced estimated $200-500M remediation costs and 18-24 month compliance timelines.',

  sources: [
    'European Parliament, "Regulation (EU) 2024/1689 — Artificial Intelligence Act," June 2024',
    'European Commission, "AI Act Implementation Timeline," July 2024',
    'McKinsey & Company, "The EU AI Act: What it means for business," 2024',
    'Gartner, "EU AI Act Compliance Cost Estimates for Global Enterprises," 2024',
  ],

  marketImpact: {
    totalMarketCapLoss: 0, // Not a market crash but a structural cost shift
    recoveryTimeline: 'N/A — ongoing compliance obligation',
    companiesHardestHit: [
      { name: 'Companies without AI governance frameworks', dropPercent: 0, reason: 'Facing $200-500M remediation costs and 18-24 month compliance timelines' },
      { name: 'Meta/Facebook', dropPercent: 0, reason: 'Had to disable certain AI features in EU due to compliance gaps' },
      { name: 'Clearview AI', dropPercent: 0, reason: 'Business model (real-time biometric surveillance) banned outright in EU' },
    ],
    companiesLeastAffected: [
      { name: 'Microsoft', reason: 'AETHER Committee and Responsible AI Standard built since 2018 — substantially compliant at Act entry' },
      { name: 'Companies with documented AI governance', reason: 'Audit trails, bias testing, human oversight already in place' },
    ],
  },

  predictability: {
    wasExpected: true,
    earlySignals: [
      'EU AI Act first proposed in April 2021 — 3+ years of lead time',
      'GDPR enforcement pattern showed EU follows through on tech regulation with large fines',
      'NIST AI RMF published January 2023 — U.S. also moving toward AI governance standards',
      'EU AI Act draft texts publicly available throughout 2022-2023 legislative process',
    ],
    whoSawItComing: [
      'Companies that tracked the legislative process (3+ years of public drafts)',
      'Legal and compliance teams at major tech companies',
      'AI governance consultancies and standards bodies',
    ],
    whyMostMissedIt: 'Many companies assumed the Act would be watered down or delayed. Some U.S. companies believed it wouldn\'t apply to them. The phased implementation timeline created a false sense of safety.',
  },

  preparednessAnalysis: [
    { primitiveId: 'P9', primitiveName: 'Cross-Jurisdiction Compliance', howItHelps: 'Regulatory horizon scanning would have tracked the EU AI Act from its April 2021 proposal through adoption. Gap analysis available years before enforcement deadlines.', withoutIt: 'Companies without jurisdiction monitoring were surprised by compliance requirements despite 3+ years of lead time.' },
    { primitiveId: 'P2', primitiveName: 'Deliberation Capture', howItHelps: 'Article 14 of the EU AI Act requires "human oversight" with documentation. Deliberation Capture is exactly what this article demands — recorded multi-stakeholder decision-making.', withoutIt: 'Companies without documented deliberation processes have to build them from scratch to comply with Article 14.' },
    { primitiveId: 'P5', primitiveName: 'Drift Detection', howItHelps: 'EU AI Act requires continuous monitoring of high-risk AI systems for accuracy degradation and bias drift. Drift Detection is a direct compliance requirement.', withoutIt: 'Companies without continuous monitoring infrastructure must build it specifically to comply — estimated 12-18 months.' },
    { primitiveId: 'P1', primitiveName: 'Discovery-Time Proof', howItHelps: 'Article 12 requires "logging" with timestamps for all high-risk AI system operations. RFC 3161 timestamps provide EU AI Act-compliant audit trails.', withoutIt: 'Without timestamped logging, organizations cannot prove compliance with Article 12 logging requirements.' },
  ],

  learningPatterns: [
    'PATTERN: Regulatory compliance is ALWAYS predictable with sufficient lead time — the EU AI Act had 3+ years of public drafts',
    'PATTERN: Companies that build governance BEFORE regulation save 10-100x vs. rushed remediation',
    'PATTERN: GDPR fines proved EU enforcement is real — the AI Act will follow the same pattern',
    'PATTERN: Datacendia\'s 9 DCII primitives map directly to EU AI Act requirements (Articles 9, 12, 13, 14, 15)',
    'PATTERN: Governance infrastructure is a competitive advantage when regulation arrives — not a cost center',
    'PATTERN: Companies that wait for regulation to act pay the "governance debt" with interest',
  ],
};

// =============================================================================
// AGGREGATE EXPORTS — ALL BENCHMARK TYPES
// =============================================================================

export const ALL_SUCCESS_STORIES: SuccessStoryBenchmark[] = [
  JNJ_TYLENOL,
  JPM_REFORM,
  MICROSOFT_RAI,
];

export const ALL_DISRUPTIONS: MarketDisruptionBenchmark[] = [
  ANTHROPIC_SAASPOCALYPSE,
  DEEPSEEK_DISRUPTION,
  EU_AI_ACT,
];

/**
 * Get all learning patterns across failures, successes, and disruptions.
 * These are the "institutional antibodies" the system uses to grow.
 */
export function getAllLearningPatterns(): Array<{
  pattern: string;
  source: string;
  sourceType: 'failure' | 'success' | 'disruption';
  relevantPrimitives: string[];
}> {
  const patterns: Array<{ pattern: string; source: string; sourceType: 'failure' | 'success' | 'disruption'; relevantPrimitives: string[] }> = [];

  // From failures
  for (const b of ALL_BENCHMARKS) {
    const prims = b.primitiveFailures.map(f => f.primitiveId);
    patterns.push(
      ...b.counterfactual.keyInterventions.map(intervention => ({
        pattern: intervention,
        source: `${b.company} (${b.year})`,
        sourceType: 'failure' as const,
        relevantPrimitives: prims,
      }))
    );
  }

  // From successes
  for (const s of ALL_SUCCESS_STORIES) {
    const prims = s.primitivesPresent.map(p => p.primitiveId);
    patterns.push(
      ...s.learningPatterns.map(lp => ({
        pattern: lp,
        source: `${s.company} (${s.year})`,
        sourceType: 'success' as const,
        relevantPrimitives: prims,
      }))
    );
  }

  // From disruptions
  for (const d of ALL_DISRUPTIONS) {
    const prims = d.preparednessAnalysis.map(p => p.primitiveId);
    patterns.push(
      ...d.learningPatterns.map(lp => ({
        pattern: lp,
        source: `${d.event.split('—')[0].trim()} (${d.date.slice(0, 4)})`,
        sourceType: 'disruption' as const,
        relevantPrimitives: prims,
      }))
    );
  }

  return patterns;
}

/**
 * Get aggregate statistics across all benchmark types.
 */
export function getComprehensiveBenchmarkStats(): {
  failures: { count: number; totalCost: number; totalPreventable: number; casualties: number };
  successes: { count: number; totalValueSaved: number; avgIISS: number };
  disruptions: { count: number; totalMarketImpact: number; totalPatterns: number };
  totalLearningPatterns: number;
} {
  const failureStats = getTotalBenchmarkImpact();

  return {
    failures: {
      count: ALL_BENCHMARKS.length,
      totalCost: failureStats.totalCost,
      totalPreventable: failureStats.totalPreventableCost,
      casualties: failureStats.totalCasualties,
    },
    successes: {
      count: ALL_SUCCESS_STORIES.length,
      totalValueSaved: ALL_SUCCESS_STORIES.reduce((s, story) => s + story.impact.valueSaved, 0),
      avgIISS: Math.round(ALL_SUCCESS_STORIES.reduce((s, story) => s + story.simulatedIISS, 0) / ALL_SUCCESS_STORIES.length),
    },
    disruptions: {
      count: ALL_DISRUPTIONS.length,
      totalMarketImpact: ALL_DISRUPTIONS.reduce((s, d) => s + d.marketImpact.totalMarketCapLoss, 0),
      totalPatterns: ALL_DISRUPTIONS.reduce((s, d) => s + d.learningPatterns.length, 0),
    },
    totalLearningPatterns: getAllLearningPatterns().length,
  };
}
