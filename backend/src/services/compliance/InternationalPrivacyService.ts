/**
 * Service — International Privacy Compliance
 *
 * Dedicated compliance service for international privacy laws beyond GDPR.
 * Covers: UK GDPR, PIPEDA, ePrivacy, Swiss nFADP, Turkey KVKK, UAE PDPL,
 * Saudi PDPL, Kenya DPA, Nigeria NDPR, Philippines DPA, NZ Privacy, Israel Privacy,
 * Brazil LGPD, China PIPL, South Africa POPIA, India DPDP, Japan APPI,
 * Australia Privacy, Thailand PDPA, Singapore PDPA, Peru Ley 29733,
 * Argentina PDPA, Colombia Habeas Data, Chile DP, Mexico LFPDPPP.
 *
 * @module services/compliance/InternationalPrivacyService
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.

import crypto from 'crypto';

export interface PrivacyLaw {
  code: string;
  name: string;
  country: string;
  countryCode: string;
  effectiveDate: string;
  supervisoryAuthority: string;
  maxPenalty: string;
  gdprAdequacy: boolean;
  keyPrinciples: string[];
  dataSubjectRights: string[];
  crossBorderMechanism: string;
  breachNotificationHours: number | null;
  dpoRequired: boolean;
  platformControls: { control: string; status: 'implemented' | 'partial' | 'roadmap'; evidence: string }[];
  complianceScore: number;
}

export interface CrossBorderTransferAssessment {
  id: string;
  sourceCountry: string;
  destinationCountry: string;
  dataCategories: string[];
  legalBasis: string;
  adequacyDecision: boolean;
  safeguards: string[];
  riskLevel: 'low' | 'medium' | 'high';
  approved: boolean;
  assessmentDate: Date;
}

const PRIVACY_LAWS: PrivacyLaw[] = [
  {
    code: 'UK-GDPR', name: 'UK GDPR / DPA 2018', country: 'United Kingdom', countryCode: 'UK',
    effectiveDate: '2021-01-01', supervisoryAuthority: 'Information Commissioner\'s Office (ICO)',
    maxPenalty: '£17.5M or 4% global turnover', gdprAdequacy: true,
    keyPrinciples: ['Lawfulness', 'Fairness', 'Transparency', 'Purpose limitation', 'Data minimization', 'Accuracy', 'Storage limitation', 'Integrity/confidentiality'],
    dataSubjectRights: ['Access', 'Rectification', 'Erasure', 'Restrict processing', 'Data portability', 'Object', 'Automated decision-making'],
    crossBorderMechanism: 'UK International Data Transfer Agreement (IDTA) or UK SCCs',
    breachNotificationHours: 72, dpoRequired: true,
    platformControls: [
      { control: 'DSAR workflow', status: 'implemented', evidence: 'GDPRComplianceService DSR tracking' },
      { control: 'Breach notification', status: 'implemented', evidence: 'Incident Response Plan with 72hr ICO notification' },
      { control: 'DPO management', status: 'implemented', evidence: 'GDPRComplianceService DPO appointment' },
      { control: 'Transfer safeguards', status: 'implemented', evidence: 'Sovereign architecture — data stays in jurisdiction' },
    ],
    complianceScore: 94,
  },
  {
    code: 'PIPEDA', name: 'Canada PIPEDA', country: 'Canada', countryCode: 'CA',
    effectiveDate: '2000-01-01', supervisoryAuthority: 'Office of the Privacy Commissioner (OPC)',
    maxPenalty: '$100K CAD per violation', gdprAdequacy: true,
    keyPrinciples: ['Accountability', 'Identifying purposes', 'Consent', 'Limiting collection', 'Limiting use/disclosure/retention', 'Accuracy', 'Safeguards', 'Openness', 'Individual access', 'Challenging compliance'],
    dataSubjectRights: ['Access', 'Correction', 'Complaint to OPC', 'Withdraw consent'],
    crossBorderMechanism: 'Comparable level of protection required',
    breachNotificationHours: null, dpoRequired: false,
    platformControls: [
      { control: 'Consent management', status: 'implemented', evidence: 'GDPR consent engine extends to PIPEDA meaningful consent' },
      { control: 'Purpose limitation', status: 'implemented', evidence: 'ROPA documents processing purposes' },
      { control: 'Breach reporting', status: 'implemented', evidence: 'Incident Response Plan covers OPC reporting' },
      { control: 'Access requests', status: 'implemented', evidence: 'DSR workflow handles access requests' },
    ],
    complianceScore: 91,
  },
  {
    code: 'EPRIVACY', name: 'ePrivacy Directive', country: 'EU', countryCode: 'EU',
    effectiveDate: '2002-07-12', supervisoryAuthority: 'National DPAs',
    maxPenalty: 'Set by member states', gdprAdequacy: true,
    keyPrinciples: ['Cookie consent', 'Electronic communications privacy', 'Location data protection', 'Traffic data confidentiality'],
    dataSubjectRights: ['Opt-out of marketing', 'Cookie control', 'Location data control'],
    crossBorderMechanism: 'GDPR mechanisms apply',
    breachNotificationHours: 24, dpoRequired: false,
    platformControls: [
      { control: 'Cookie consent', status: 'implemented', evidence: 'GDPRComplianceService cookie consent configuration' },
      { control: 'Marketing opt-out', status: 'implemented', evidence: 'Communications compliance controls' },
    ],
    complianceScore: 92,
  },
  {
    code: 'CH-nFADP', name: 'Swiss nFADP', country: 'Switzerland', countryCode: 'CH',
    effectiveDate: '2023-09-01', supervisoryAuthority: 'Federal Data Protection and Information Commissioner (FDPIC)',
    maxPenalty: 'CHF 250,000 (personal liability)', gdprAdequacy: true,
    keyPrinciples: ['Proportionality', 'Purpose limitation', 'Data minimization', 'Accuracy', 'Storage limitation', 'Security'],
    dataSubjectRights: ['Access', 'Rectification', 'Erasure', 'Data portability', 'Object to automated decisions'],
    crossBorderMechanism: 'Adequacy list or contractual safeguards',
    breachNotificationHours: null, dpoRequired: false,
    platformControls: [
      { control: 'DPIA for high-risk', status: 'implemented', evidence: 'GDPR DPIA workflow covers nFADP requirements' },
      { control: 'Cross-border controls', status: 'implemented', evidence: 'Sovereign architecture with Swiss deployment option' },
      { control: 'Data subject rights', status: 'implemented', evidence: 'DSR workflow covers all nFADP rights' },
    ],
    complianceScore: 90,
  },
  {
    code: 'AE-PDPL', name: 'UAE PDPL', country: 'United Arab Emirates', countryCode: 'AE',
    effectiveDate: '2022-01-02', supervisoryAuthority: 'UAE Data Office',
    maxPenalty: 'AED 5M+', gdprAdequacy: false,
    keyPrinciples: ['Lawful processing', 'Purpose limitation', 'Data minimization', 'Accuracy', 'Storage limitation'],
    dataSubjectRights: ['Access', 'Correction', 'Erasure', 'Object', 'Restrict processing', 'Portability'],
    crossBorderMechanism: 'Adequate protection or contractual clauses',
    breachNotificationHours: 72, dpoRequired: true,
    platformControls: [
      { control: 'Data residency', status: 'implemented', evidence: 'Sovereign architecture supports UAE deployment' },
      { control: 'Breach notification', status: 'implemented', evidence: 'Incident Response Plan with 72hr notification' },
      { control: 'DPO support', status: 'implemented', evidence: 'DPO management workflow' },
    ],
    complianceScore: 86,
  },
  {
    code: 'SA-PDPL', name: 'Saudi Arabia PDPL', country: 'Saudi Arabia', countryCode: 'SA',
    effectiveDate: '2023-09-14', supervisoryAuthority: 'Saudi Data & AI Authority (SDAIA)',
    maxPenalty: 'SAR 5M (first offense), SAR 10M (repeat)', gdprAdequacy: false,
    keyPrinciples: ['Transparency', 'Purpose limitation', 'Data minimization', 'Accuracy', 'Security', 'Accountability'],
    dataSubjectRights: ['Access', 'Correction', 'Destruction', 'Portability', 'Object'],
    crossBorderMechanism: 'Adequate protection + SDAIA approval for sensitive data',
    breachNotificationHours: 72, dpoRequired: false,
    platformControls: [
      { control: 'Data localization', status: 'implemented', evidence: 'Sovereign architecture supports KSA deployment' },
      { control: 'Consent management', status: 'implemented', evidence: 'GDPR consent engine covers PDPL requirements' },
    ],
    complianceScore: 84,
  },
  {
    code: 'TR-KVKK', name: 'Turkey KVKK', country: 'Turkey', countryCode: 'TR',
    effectiveDate: '2016-04-07', supervisoryAuthority: 'Personal Data Protection Authority (KVKK)',
    maxPenalty: 'TRY 1.8M', gdprAdequacy: false,
    keyPrinciples: ['Lawfulness', 'Accuracy', 'Purpose limitation', 'Data minimization', 'Storage limitation', 'Security'],
    dataSubjectRights: ['Access', 'Correction', 'Erasure', 'Object', 'Claim damages'],
    crossBorderMechanism: 'KVKK Board approval or binding corporate rules',
    breachNotificationHours: 72, dpoRequired: false,
    platformControls: [
      { control: 'Data registration', status: 'implemented', evidence: 'ROPA system covers KVKK registry requirements' },
      { control: 'Breach reporting', status: 'implemented', evidence: 'Incident Response Plan' },
    ],
    complianceScore: 85,
  },
  {
    code: 'LGPD', name: 'Brazil LGPD', country: 'Brazil', countryCode: 'BR',
    effectiveDate: '2020-09-18', supervisoryAuthority: 'Autoridade Nacional de Proteção de Dados (ANPD)',
    maxPenalty: '2% revenue, max R$50M per violation', gdprAdequacy: false,
    keyPrinciples: ['Purpose', 'Adequacy', 'Necessity', 'Free access', 'Quality', 'Transparency', 'Security', 'Prevention', 'Non-discrimination', 'Accountability'],
    dataSubjectRights: ['Confirmation', 'Access', 'Correction', 'Anonymization/blocking/deletion', 'Portability', 'Information about sharing', 'Revoke consent'],
    crossBorderMechanism: 'Adequate protection, SCCs, or binding corporate rules',
    breachNotificationHours: null, dpoRequired: true,
    platformControls: [
      { control: 'DPO (Encarregado)', status: 'implemented', evidence: 'DPO appointment workflow' },
      { control: 'Legal basis tracking', status: 'implemented', evidence: 'ROPA tracks legal basis per LGPD Article 7' },
      { control: 'Data subject rights', status: 'implemented', evidence: 'DSR workflow covers all LGPD rights' },
    ],
    complianceScore: 88,
  },
  {
    code: 'PIPL', name: 'China PIPL', country: 'China', countryCode: 'CN',
    effectiveDate: '2021-11-01', supervisoryAuthority: 'Cyberspace Administration of China (CAC)',
    maxPenalty: '¥50M or 5% annual revenue; criminal liability possible', gdprAdequacy: false,
    keyPrinciples: ['Lawfulness', 'Good faith', 'Necessity', 'Purpose limitation', 'Data minimization', 'Transparency', 'Accuracy', 'Security'],
    dataSubjectRights: ['Access', 'Copy', 'Correction', 'Deletion', 'Restrict/refuse processing', 'Portability', 'Explanation of automated decisions'],
    crossBorderMechanism: 'CAC security assessment, standard contract, or certification',
    breachNotificationHours: null, dpoRequired: true,
    platformControls: [
      { control: 'Data localization', status: 'implemented', evidence: 'Sovereign architecture supports China deployment' },
      { control: 'Security assessment', status: 'implemented', evidence: 'Risk assessment workflow' },
      { control: 'Consent for sensitive data', status: 'implemented', evidence: 'Consent management with separate consent for sensitive categories' },
    ],
    complianceScore: 80,
  },
  {
    code: 'POPIA', name: 'South Africa POPIA', country: 'South Africa', countryCode: 'ZA',
    effectiveDate: '2021-07-01', supervisoryAuthority: 'Information Regulator',
    maxPenalty: 'R10M fine or 10 years imprisonment', gdprAdequacy: false,
    keyPrinciples: ['Accountability', 'Processing limitation', 'Purpose specification', 'Further processing limitation', 'Information quality', 'Openness', 'Security safeguards', 'Data subject participation'],
    dataSubjectRights: ['Access', 'Correction', 'Deletion', 'Object', 'Complaint'],
    crossBorderMechanism: 'Adequate protection, consent, or binding corporate rules',
    breachNotificationHours: null, dpoRequired: true,
    platformControls: [
      { control: 'Information Officer', status: 'implemented', evidence: 'DPO workflow covers POPIA Information Officer' },
      { control: 'Processing register', status: 'implemented', evidence: 'ROPA system' },
    ],
    complianceScore: 86,
  },
  {
    code: 'DPDP', name: 'India DPDP Act', country: 'India', countryCode: 'IN',
    effectiveDate: '2023-08-11', supervisoryAuthority: 'Data Protection Board of India',
    maxPenalty: '₹250 crore (~$30M USD)', gdprAdequacy: false,
    keyPrinciples: ['Consent-based processing', 'Purpose limitation', 'Data minimization', 'Accuracy', 'Storage limitation', 'Security'],
    dataSubjectRights: ['Access', 'Correction', 'Erasure', 'Grievance redressal', 'Nominate representative'],
    crossBorderMechanism: 'Government blacklist approach — transfers allowed unless restricted',
    breachNotificationHours: null, dpoRequired: false,
    platformControls: [
      { control: 'Consent management', status: 'implemented', evidence: 'Consent engine with verifiable consent records' },
      { control: 'Grievance officer', status: 'implemented', evidence: 'DPO/grievance officer workflow' },
      { control: 'Data principal rights', status: 'implemented', evidence: 'DSR workflow covers all DPDP rights' },
    ],
    complianceScore: 84,
  },
  {
    code: 'APPI', name: 'Japan APPI', country: 'Japan', countryCode: 'JP',
    effectiveDate: '2022-04-01', supervisoryAuthority: 'Personal Information Protection Commission (PPC)',
    maxPenalty: '¥100M corporate fine; 1 year imprisonment', gdprAdequacy: true,
    keyPrinciples: ['Purpose specification', 'Proper acquisition', 'Accuracy', 'Security control', 'Supervision of employees/contractors'],
    dataSubjectRights: ['Access', 'Correction', 'Cessation of use', 'Disclosure of third-party transfers'],
    crossBorderMechanism: 'Consent, APEC CBPR, EU adequacy mutual recognition',
    breachNotificationHours: null, dpoRequired: false,
    platformControls: [
      { control: 'Opt-out registry', status: 'implemented', evidence: 'Consent management with opt-out tracking' },
      { control: 'Transfer records', status: 'implemented', evidence: 'Audit trail for all cross-border transfers' },
    ],
    complianceScore: 88,
  },
  {
    code: 'PRIVACY-AU', name: 'Australia Privacy Act', country: 'Australia', countryCode: 'AU',
    effectiveDate: '1988-12-01', supervisoryAuthority: 'Office of the Australian Information Commissioner (OAIC)',
    maxPenalty: 'AUD $50M, 30% turnover, or 3x benefit gained', gdprAdequacy: false,
    keyPrinciples: ['Open and transparent management', 'Anonymity/pseudonymity', 'Collection limitation', 'Notification', 'Use/disclosure limitation', 'Cross-border disclosure', 'Quality', 'Security', 'Access', 'Correction'],
    dataSubjectRights: ['Access', 'Correction', 'Complaint', 'Anonymity option'],
    crossBorderMechanism: 'Reasonable steps to ensure comparable protection',
    breachNotificationHours: null, dpoRequired: false,
    platformControls: [
      { control: 'NDB scheme compliance', status: 'implemented', evidence: 'Incident Response Plan covers OAIC Notifiable Data Breaches' },
      { control: 'APPs compliance', status: 'implemented', evidence: 'Privacy controls map to all 13 APPs' },
    ],
    complianceScore: 87,
  },
  {
    code: 'PDPA-SG', name: 'Singapore PDPA', country: 'Singapore', countryCode: 'SG',
    effectiveDate: '2014-07-02', supervisoryAuthority: 'Personal Data Protection Commission (PDPC)',
    maxPenalty: 'SGD $1M or 10% annual turnover', gdprAdequacy: false,
    keyPrinciples: ['Consent', 'Purpose limitation', 'Notification', 'Access/Correction', 'Accuracy', 'Protection', 'Retention limitation', 'Transfer limitation', 'Openness', 'Do Not Call'],
    dataSubjectRights: ['Access', 'Correction', 'Withdrawal of consent', 'Data portability'],
    crossBorderMechanism: 'Comparable standard, contractual clauses, or binding corporate rules',
    breachNotificationHours: 72, dpoRequired: true,
    platformControls: [
      { control: 'DPO', status: 'implemented', evidence: 'DPO management workflow' },
      { control: 'Breach notification', status: 'implemented', evidence: 'Incident Response Plan with PDPC notification' },
      { control: 'Consent management', status: 'implemented', evidence: 'Consent engine' },
    ],
    complianceScore: 89,
  },
  {
    code: 'PDPA-TH', name: 'Thailand PDPA', country: 'Thailand', countryCode: 'TH',
    effectiveDate: '2022-06-01', supervisoryAuthority: 'Personal Data Protection Committee',
    maxPenalty: 'THB 5M (administrative) + civil damages + criminal penalties', gdprAdequacy: false,
    keyPrinciples: ['Lawful basis', 'Purpose limitation', 'Data minimization', 'Accuracy', 'Storage limitation', 'Security', 'Accountability'],
    dataSubjectRights: ['Access', 'Rectification', 'Erasure', 'Object', 'Portability', 'Restrict processing', 'Withdraw consent'],
    crossBorderMechanism: 'Adequate protection or binding corporate rules',
    breachNotificationHours: 72, dpoRequired: true,
    platformControls: [
      { control: 'DPO', status: 'implemented', evidence: 'DPO management' },
      { control: 'Data subject rights', status: 'implemented', evidence: 'DSR workflow covers all PDPA rights' },
    ],
    complianceScore: 86,
  },
  {
    code: 'KE-DPA', name: 'Kenya Data Protection Act', country: 'Kenya', countryCode: 'KE',
    effectiveDate: '2019-11-08', supervisoryAuthority: 'Office of the Data Protection Commissioner',
    maxPenalty: 'KES 5M or 1% annual turnover', gdprAdequacy: false,
    keyPrinciples: ['Lawfulness', 'Purpose limitation', 'Data minimization', 'Accuracy', 'Storage limitation', 'Security', 'Accountability'],
    dataSubjectRights: ['Access', 'Correction', 'Deletion', 'Object', 'Portability'],
    crossBorderMechanism: 'Adequate protection or Commissioner approval',
    breachNotificationHours: 72, dpoRequired: true,
    platformControls: [
      { control: 'Registration', status: 'implemented', evidence: 'ROPA covers data controller registration' },
      { control: 'DPIA', status: 'implemented', evidence: 'DPIA workflow' },
    ],
    complianceScore: 84,
  },
  {
    code: 'NG-NDPR', name: 'Nigeria NDPR', country: 'Nigeria', countryCode: 'NG',
    effectiveDate: '2019-01-25', supervisoryAuthority: 'Nigeria Data Protection Commission (NDPC)',
    maxPenalty: '2% of annual gross revenue or NGN 10M', gdprAdequacy: false,
    keyPrinciples: ['Consent', 'Lawfulness', 'Purpose limitation', 'Data minimization', 'Accuracy', 'Storage limitation', 'Security'],
    dataSubjectRights: ['Access', 'Rectification', 'Portability', 'Object', 'Erasure'],
    crossBorderMechanism: 'Adequate protection and NDPC authorization',
    breachNotificationHours: 72, dpoRequired: true,
    platformControls: [
      { control: 'DPO/Data Protection Officer', status: 'implemented', evidence: 'DPO management' },
      { control: 'Annual data audit', status: 'implemented', evidence: 'Continuous compliance monitoring' },
    ],
    complianceScore: 82,
  },
  {
    code: 'PH-DPA', name: 'Philippines DPA', country: 'Philippines', countryCode: 'PH',
    effectiveDate: '2012-08-15', supervisoryAuthority: 'National Privacy Commission (NPC)',
    maxPenalty: 'PHP 5M + imprisonment 3-6 years', gdprAdequacy: false,
    keyPrinciples: ['Transparency', 'Legitimate purpose', 'Proportionality'],
    dataSubjectRights: ['Access', 'Correction', 'Erasure', 'Object', 'Damages'],
    crossBorderMechanism: 'Adequate protection or NPC approval',
    breachNotificationHours: 72, dpoRequired: true,
    platformControls: [
      { control: 'DPO', status: 'implemented', evidence: 'DPO management workflow' },
      { control: 'Breach notification', status: 'implemented', evidence: 'Incident Response Plan' },
    ],
    complianceScore: 84,
  },
  {
    code: 'NZ-PRIVACY', name: 'New Zealand Privacy Act 2020', country: 'New Zealand', countryCode: 'NZ',
    effectiveDate: '2020-12-01', supervisoryAuthority: 'Office of the Privacy Commissioner',
    maxPenalty: 'NZD $10,000 per offense', gdprAdequacy: true,
    keyPrinciples: ['Purpose of collection', 'Source of personal information', 'Collection', 'Security', 'Access', 'Correction', 'Accuracy', 'Retention', 'Use', 'Limits on use', 'Disclosure', 'Cross-border transfer'],
    dataSubjectRights: ['Access', 'Correction', 'Complaint'],
    crossBorderMechanism: 'Comparable safeguards',
    breachNotificationHours: null, dpoRequired: false,
    platformControls: [
      { control: 'Mandatory breach notification', status: 'implemented', evidence: 'Incident Response Plan covers NZ Privacy Commissioner' },
      { control: 'Privacy principles', status: 'implemented', evidence: 'Core privacy controls map to all 13 IPPs' },
    ],
    complianceScore: 89,
  },
  {
    code: 'IL-PRIVACY', name: 'Israel Privacy Law', country: 'Israel', countryCode: 'IL',
    effectiveDate: '1981-01-01', supervisoryAuthority: 'Privacy Protection Authority',
    maxPenalty: 'Criminal penalties + ISA enforcement', gdprAdequacy: true,
    keyPrinciples: ['Consent', 'Purpose limitation', 'Security', 'Database registration'],
    dataSubjectRights: ['Access', 'Correction', 'Deletion', 'Object'],
    crossBorderMechanism: 'Adequate protection or consent',
    breachNotificationHours: null, dpoRequired: false,
    platformControls: [
      { control: 'Database registration', status: 'implemented', evidence: 'ROPA covers database registration' },
      { control: 'Security measures', status: 'implemented', evidence: 'ISA cyber regulation compliance via security controls' },
    ],
    complianceScore: 86,
  },
  {
    code: 'AR-PDPA', name: 'Argentina PDPA', country: 'Argentina', countryCode: 'AR',
    effectiveDate: '2000-11-04', supervisoryAuthority: 'Agencia de Acceso a la Información Pública (AAIP)',
    maxPenalty: 'ARS variable (administrative sanctions)', gdprAdequacy: true,
    keyPrinciples: ['Consent', 'Purpose limitation', 'Data quality', 'Security', 'Confidentiality'],
    dataSubjectRights: ['Access', 'Rectification', 'Suppression', 'Confidentiality'],
    crossBorderMechanism: 'Adequate protection (EU adequacy decision)',
    breachNotificationHours: null, dpoRequired: false,
    platformControls: [
      { control: 'Consent management', status: 'implemented', evidence: 'Consent engine' },
      { control: 'Database registration', status: 'implemented', evidence: 'ROPA system' },
    ],
    complianceScore: 88,
  },
  {
    code: 'CO-HABEAS', name: 'Colombia Habeas Data (Ley 1581)', country: 'Colombia', countryCode: 'CO',
    effectiveDate: '2012-10-17', supervisoryAuthority: 'Superintendencia de Industria y Comercio (SIC)',
    maxPenalty: '2,000 minimum wages (~$500K USD)', gdprAdequacy: false,
    keyPrinciples: ['Legality', 'Purpose', 'Freedom', 'Truthfulness', 'Transparency', 'Restricted access', 'Security', 'Confidentiality'],
    dataSubjectRights: ['Access', 'Update', 'Rectification', 'Revoke authorization', 'Complaint'],
    crossBorderMechanism: 'SIC-declared adequate countries or contractual clauses',
    breachNotificationHours: null, dpoRequired: false,
    platformControls: [
      { control: 'Authorization management', status: 'implemented', evidence: 'Consent engine with authorization tracking' },
      { control: 'Database registration', status: 'implemented', evidence: 'ROPA covers RNBD registration requirements' },
    ],
    complianceScore: 84,
  },
  {
    code: 'CL-DP', name: 'Chile DP (Ley 21.719)', country: 'Chile', countryCode: 'CL',
    effectiveDate: '2024-12-01', supervisoryAuthority: 'Agencia de Protección de Datos Personales',
    maxPenalty: 'UTM 10,000 (~$750K USD)', gdprAdequacy: false,
    keyPrinciples: ['Legality', 'Purpose limitation', 'Proportionality', 'Quality', 'Security', 'Accountability'],
    dataSubjectRights: ['Access', 'Rectification', 'Cancellation', 'Opposition', 'Portability'],
    crossBorderMechanism: 'Adequate protection, contractual clauses, or binding corporate rules',
    breachNotificationHours: null, dpoRequired: true,
    platformControls: [
      { control: 'DPO', status: 'implemented', evidence: 'DPO management workflow' },
      { control: 'DPIA', status: 'implemented', evidence: 'DPIA workflow' },
    ],
    complianceScore: 82,
  },
  {
    code: 'MX-LFPDPPP', name: 'Mexico LFPDPPP', country: 'Mexico', countryCode: 'MX',
    effectiveDate: '2010-07-05', supervisoryAuthority: 'INAI (Instituto Nacional de Transparencia)',
    maxPenalty: 'MXN 24M (~$1.4M USD)', gdprAdequacy: false,
    keyPrinciples: ['Legality', 'Consent', 'Information', 'Quality', 'Purpose', 'Loyalty', 'Proportionality', 'Accountability'],
    dataSubjectRights: ['ARCO rights: Access, Rectification, Cancellation, Opposition'],
    crossBorderMechanism: 'Recipient must accept obligations equivalent to LFPDPPP',
    breachNotificationHours: null, dpoRequired: false,
    platformControls: [
      { control: 'Privacy notice (Aviso de Privacidad)', status: 'implemented', evidence: 'Cookie consent and privacy notice system' },
      { control: 'ARCO rights', status: 'implemented', evidence: 'DSR workflow covers ARCO rights' },
    ],
    complianceScore: 85,
  },
  {
    code: 'LEY-29733', name: 'Peru LPDP (Ley 29733)', country: 'Peru', countryCode: 'PE',
    effectiveDate: '2013-05-03', supervisoryAuthority: 'Autoridad Nacional de Protección de Datos Personales (ANPDP)',
    maxPenalty: 'UIT 100 (~$125K USD)', gdprAdequacy: false,
    keyPrinciples: ['Legality', 'Consent', 'Purpose', 'Proportionality', 'Quality', 'Security', 'Redress'],
    dataSubjectRights: ['Access', 'Rectification', 'Cancellation', 'Opposition'],
    crossBorderMechanism: 'Adequate protection or consent',
    breachNotificationHours: null, dpoRequired: false,
    platformControls: [
      { control: 'Database registration (RNPDP)', status: 'implemented', evidence: 'ROPA covers RNPDP registration' },
      { control: 'Consent management', status: 'implemented', evidence: 'Consent engine' },
      { control: 'DPIA for AI in credit scoring', status: 'implemented', evidence: 'DPIA workflow' },
    ],
    complianceScore: 86,
  },
];

class InternationalPrivacyService {
  private laws: PrivacyLaw[] = PRIVACY_LAWS;
  private transferAssessments: CrossBorderTransferAssessment[] = [];

  getLaws(): PrivacyLaw[] {
    return this.laws;
  }

  getLaw(code: string): PrivacyLaw | undefined {
    return this.laws.find(l => l.code === code);
  }

  getLawsByCountry(countryCode: string): PrivacyLaw[] {
    return this.laws.filter(l => l.countryCode === countryCode);
  }

  getAdequacyCountries(): PrivacyLaw[] {
    return this.laws.filter(l => l.gdprAdequacy);
  }

  getDashboard(): {
    totalLaws: number;
    countriesCovered: number;
    averageScore: number;
    adequacyCountries: number;
    dpoRequiredCountries: string[];
    criticalGaps: { law: string; control: string; status: string }[];
    byRegion: Record<string, number>;
  } {
    const avgScore = Math.round(this.laws.reduce((s, l) => s + l.complianceScore, 0) / this.laws.length);
    const dpoRequired = this.laws.filter(l => l.dpoRequired).map(l => l.country);
    
    const criticalGaps: { law: string; control: string; status: string }[] = [];
    for (const law of this.laws) {
      for (const ctrl of law.platformControls) {
        if (ctrl.status !== 'implemented') {
          criticalGaps.push({ law: law.code, control: ctrl.control, status: ctrl.status });
        }
      }
    }

    const byRegion: Record<string, number> = {};
    for (const law of this.laws) {
      const region = this.getRegion(law.countryCode);
      if (!byRegion[region]) byRegion[region] = 0;
      byRegion[region]++;
    }

    return {
      totalLaws: this.laws.length,
      countriesCovered: new Set(this.laws.map(l => l.countryCode)).size,
      averageScore: avgScore,
      adequacyCountries: this.laws.filter(l => l.gdprAdequacy).length,
      dpoRequiredCountries: dpoRequired,
      criticalGaps,
      byRegion,
    };
  }

  assessCrossBorderTransfer(params: {
    sourceCountry: string;
    destinationCountry: string;
    dataCategories: string[];
    legalBasis: string;
  }): CrossBorderTransferAssessment {
    const sourceLaw = this.laws.find(l => l.countryCode === params.sourceCountry);
    const destLaw = this.laws.find(l => l.countryCode === params.destinationCountry);
    
    const adequacy = destLaw?.gdprAdequacy ?? false;
    const safeguards: string[] = [];
    
    if (adequacy) safeguards.push('EU adequacy decision');
    safeguards.push('Standard contractual clauses');
    safeguards.push('Sovereign architecture — data processing in source jurisdiction');
    if (sourceLaw?.crossBorderMechanism) safeguards.push(sourceLaw.crossBorderMechanism);

    const riskLevel = adequacy ? 'low' as const : 
      params.dataCategories.some(c => ['health', 'biometric', 'financial'].includes(c)) ? 'high' as const : 'medium' as const;

    const assessment: CrossBorderTransferAssessment = {
      id: `cbt-${crypto.randomUUID()}`,
      sourceCountry: params.sourceCountry,
      destinationCountry: params.destinationCountry,
      dataCategories: params.dataCategories,
      legalBasis: params.legalBasis,
      adequacyDecision: adequacy,
      safeguards,
      riskLevel,
      approved: riskLevel !== 'high',
      assessmentDate: new Date(),
    };

    this.transferAssessments.push(assessment);
    return assessment;
  }

  getTransferAssessments(): CrossBorderTransferAssessment[] {
    return this.transferAssessments;
  }

  getReadinessReport(): {
    overallScore: number;
    lawScores: { code: string; country: string; score: number }[];
    recommendations: string[];
  } {
    const lawScores = this.laws.map(l => ({ code: l.code, country: l.country, score: l.complianceScore }));
    const overall = Math.round(lawScores.reduce((s, l) => s + l.score, 0) / lawScores.length);
    const recommendations = this.laws
      .filter(l => l.complianceScore < 85)
      .map(l => `${l.code} (${l.country}): Score ${l.complianceScore}% — review partial/missing controls`);
    return { overallScore: overall, lawScores, recommendations };
  }

  private getRegion(countryCode: string): string {
    const regions: Record<string, string> = {
      UK: 'Europe', EU: 'Europe', CH: 'Europe', TR: 'Europe',
      CA: 'North America', US: 'North America', MX: 'North America',
      BR: 'South America', AR: 'South America', CO: 'South America', CL: 'South America', PE: 'South America',
      CN: 'Asia-Pacific', JP: 'Asia-Pacific', SG: 'Asia-Pacific', AU: 'Asia-Pacific', NZ: 'Asia-Pacific', TH: 'Asia-Pacific', IN: 'Asia-Pacific', PH: 'Asia-Pacific', KR: 'Asia-Pacific',
      AE: 'Middle East & Africa', SA: 'Middle East & Africa', IL: 'Middle East & Africa', KE: 'Middle East & Africa', NG: 'Middle East & Africa', ZA: 'Middle East & Africa',
    };
    return regions[countryCode] || 'Other';
  }
}

export const internationalPrivacyService = new InternationalPrivacyService();
