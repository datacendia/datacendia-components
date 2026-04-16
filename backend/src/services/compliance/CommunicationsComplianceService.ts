/**
 * Service — Communications & Marketing Compliance
 *
 * Covers: CAN-SPAM Act, CASL (Canada), UK PECR, FCC TCPA.
 *
 * @module services/compliance/CommunicationsComplianceService
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.

import crypto from 'crypto';

export interface CommunicationsRegulation {
  code: string;
  name: string;
  jurisdiction: string;
  enforcementBody: string;
  category: 'email' | 'telephone' | 'electronic_marketing';
  maxPenalty: string;
  keyRequirements: string[];
  platformControls: { control: string; status: 'implemented' | 'partial' | 'roadmap'; evidence: string }[];
  complianceScore: number;
}

export interface MarketingComplianceCheck {
  id: string;
  channelType: 'email' | 'sms' | 'phone' | 'push';
  targetJurisdictions: string[];
  consentBasis: string;
  applicableRegulations: string[];
  violations: string[];
  compliant: boolean;
  recommendations: string[];
}

const COMMUNICATIONS_REGULATIONS: CommunicationsRegulation[] = [
  {
    code: 'CAN-SPAM', name: 'CAN-SPAM Act', jurisdiction: 'US',
    enforcementBody: 'FTC / DOJ / State AGs', category: 'email',
    maxPenalty: '$50,120 per email violation',
    keyRequirements: ['Accurate header information', 'Non-deceptive subject lines', 'Identify message as advertisement', 'Physical postal address', 'Opt-out mechanism (10 business days)', 'Honor opt-out requests', 'Monitor third-party compliance'],
    platformControls: [
      { control: 'Opt-out management', status: 'implemented', evidence: 'Email preference center with immediate opt-out processing' },
      { control: 'Header compliance', status: 'implemented', evidence: 'Email templates enforce accurate From/Reply-To headers' },
      { control: 'Physical address', status: 'implemented', evidence: 'Email templates include registered business address' },
      { control: 'Ad identification', status: 'implemented', evidence: 'Commercial email templates include advertisement disclosure' },
      { control: 'Opt-out processing (10-day)', status: 'implemented', evidence: 'Automated opt-out processing within 24 hours (exceeds 10-day requirement)' },
    ],
    complianceScore: 92,
  },
  {
    code: 'CASL', name: 'Canada Anti-Spam Legislation', jurisdiction: 'CA',
    enforcementBody: 'CRTC / Competition Bureau / Privacy Commissioner', category: 'email',
    maxPenalty: '$10M CAD per violation (corporations); $1M (individuals)',
    keyRequirements: ['Express consent (opt-in) for CEMs', 'Implied consent conditions and expiry', 'Sender identification', 'Unsubscribe mechanism (functional 60 days)', 'Record of consent', 'No altered transmission data', 'No installation of programs without consent'],
    platformControls: [
      { control: 'Express consent tracking', status: 'implemented', evidence: 'Consent management tracks express vs implied consent with timestamps' },
      { control: 'Consent expiry management', status: 'implemented', evidence: 'Implied consent auto-expires per CASL 2-year/6-month rules' },
      { control: 'Sender identification', status: 'implemented', evidence: 'Email templates include full sender identification per CASL' },
      { control: 'Unsubscribe (60-day compliance)', status: 'implemented', evidence: 'Automated unsubscribe within 24 hours' },
      { control: 'Consent records', status: 'implemented', evidence: 'Decision Ledger maintains consent records with timestamp, method, and scope' },
    ],
    complianceScore: 90,
  },
  {
    code: 'PECR', name: 'UK Privacy and Electronic Communications Regulations', jurisdiction: 'UK',
    enforcementBody: 'Information Commissioner\'s Office (ICO)', category: 'electronic_marketing',
    maxPenalty: '£500K per contravention; GDPR fines for personal data aspects',
    keyRequirements: ['Consent for marketing calls, emails, texts', 'Cookie consent', 'Do not call list (TPS/CTPS) checking', 'Calling line identification', 'Security of public electronic communications services', 'Traffic and location data rules'],
    platformControls: [
      { control: 'Cookie consent', status: 'implemented', evidence: 'GDPR cookie consent mechanism covers PECR' },
      { control: 'Marketing consent', status: 'implemented', evidence: 'Consent management with PECR-compliant opt-in' },
      { control: 'TPS/CTPS screening', status: 'implemented', evidence: 'Marketing compliance workflow includes TPS check before outbound calls' },
      { control: 'Traffic data rules', status: 'implemented', evidence: 'Data minimization controls for communications metadata' },
    ],
    complianceScore: 88,
  },
  {
    code: 'FCC-TCPA', name: 'FCC TCPA (Telephone Consumer Protection Act)', jurisdiction: 'US',
    enforcementBody: 'FCC / Private right of action', category: 'telephone',
    maxPenalty: '$500-$1,500 per call/text; class action liability',
    keyRequirements: ['Prior express written consent for autodialed/prerecorded marketing', 'National Do Not Call Registry compliance', 'Internal do-not-call list', 'Calling time restrictions (8am-9pm local)', 'Caller identification', 'One-click revocation of consent'],
    platformControls: [
      { control: 'Consent management (express written)', status: 'implemented', evidence: 'Consent engine captures express written consent with timestamp and scope' },
      { control: 'DNC registry compliance', status: 'implemented', evidence: 'Marketing workflow screens against National DNC Registry' },
      { control: 'Internal DNC list', status: 'implemented', evidence: 'Opt-out management maintains internal DNC list' },
      { control: 'Time restriction enforcement', status: 'implemented', evidence: 'Marketing automation respects 8am-9pm local time windows' },
      { control: 'One-click revocation', status: 'implemented', evidence: 'Consent revocation processed immediately upon receipt' },
    ],
    complianceScore: 89,
  },
];

class CommunicationsComplianceService {
  private regulations: CommunicationsRegulation[] = COMMUNICATIONS_REGULATIONS;

  getRegulations(): CommunicationsRegulation[] {
    return this.regulations;
  }

  getRegulation(code: string): CommunicationsRegulation | undefined {
    return this.regulations.find(r => r.code === code);
  }

  getDashboard(): {
    totalRegulations: number;
    averageScore: number;
    byCategory: Record<string, { count: number; avgScore: number }>;
    criticalGaps: { regulation: string; control: string; status: string }[];
  } {
    const avgScore = Math.round(this.regulations.reduce((s, r) => s + r.complianceScore, 0) / this.regulations.length);
    
    const byCategory: Record<string, { count: number; avgScore: number }> = {};
    for (const reg of this.regulations) {
      if (!byCategory[reg.category]) byCategory[reg.category] = { count: 0, avgScore: 0 };
      byCategory[reg.category].count++;
      byCategory[reg.category].avgScore += reg.complianceScore;
    }
    for (const cat of Object.keys(byCategory)) {
      byCategory[cat].avgScore = Math.round(byCategory[cat].avgScore / byCategory[cat].count);
    }

    const criticalGaps: { regulation: string; control: string; status: string }[] = [];
    for (const reg of this.regulations) {
      for (const ctrl of reg.platformControls) {
        if (ctrl.status !== 'implemented') {
          criticalGaps.push({ regulation: reg.code, control: ctrl.control, status: ctrl.status });
        }
      }
    }

    return { totalRegulations: this.regulations.length, averageScore: avgScore, byCategory, criticalGaps };
  }

  checkMarketingCompliance(params: {
    channelType: 'email' | 'sms' | 'phone' | 'push';
    targetJurisdictions: string[];
    hasExpressConsent: boolean;
    hasOptOutMechanism: boolean;
  }): MarketingComplianceCheck {
    const violations: string[] = [];
    const recommendations: string[] = [];
    const applicable: string[] = [];

    for (const jurisdiction of params.targetJurisdictions) {
      if (jurisdiction === 'US' || jurisdiction.startsWith('US-')) {
        applicable.push('CAN-SPAM');
        if (params.channelType === 'phone' || params.channelType === 'sms') {
          applicable.push('FCC-TCPA');
          if (!params.hasExpressConsent) violations.push('TCPA: Prior express written consent required for autodialed/prerecorded calls');
        }
        if (!params.hasOptOutMechanism) violations.push('CAN-SPAM: Opt-out mechanism required');
      }
      if (jurisdiction === 'CA') {
        applicable.push('CASL');
        if (!params.hasExpressConsent) violations.push('CASL: Express consent (opt-in) required for CEMs');
      }
      if (jurisdiction === 'UK') {
        applicable.push('PECR');
        if (!params.hasExpressConsent) violations.push('PECR: Consent required for electronic marketing');
      }
    }

    if (!params.hasExpressConsent) recommendations.push('Obtain express consent before sending marketing communications');
    if (!params.hasOptOutMechanism) recommendations.push('Implement one-click unsubscribe/opt-out mechanism');

    return {
      id: `mcc-${crypto.randomUUID()}`,
      channelType: params.channelType,
      targetJurisdictions: params.targetJurisdictions,
      consentBasis: params.hasExpressConsent ? 'express_consent' : 'none',
      applicableRegulations: [...new Set(applicable)],
      violations,
      compliant: violations.length === 0,
      recommendations,
    };
  }

  getReadinessReport(): {
    overallScore: number;
    regulationScores: { code: string; name: string; score: number }[];
    recommendations: string[];
  } {
    const scores = this.regulations.map(r => ({ code: r.code, name: r.name, score: r.complianceScore }));
    const overall = Math.round(scores.reduce((s, r) => s + r.score, 0) / scores.length);
    const recommendations = this.regulations
      .filter(r => r.complianceScore < 90)
      .map(r => `${r.code}: Score ${r.complianceScore}% — review ${r.category} controls`);
    return { overallScore: overall, regulationScores: scores, recommendations };
  }
}

export const communicationsComplianceService = new CommunicationsComplianceService();
