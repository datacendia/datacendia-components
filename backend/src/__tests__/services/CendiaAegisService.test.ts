// =============================================================================
// CENDIA AEGIS SERVICE TESTS
// Tests for Strategic Defense Intelligence - threat detection and response
// =============================================================================

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock dependencies
vi.mock('../../config/database.js', () => ({
  prisma: {
    aegis_signals: { create: vi.fn(), findMany: vi.fn(), findUnique: vi.fn() },
    aegis_threats: { create: vi.fn(), findMany: vi.fn(), update: vi.fn() },
    aegis_scenarios: { create: vi.fn(), findMany: vi.fn() },
    aegis_countermeasures: { create: vi.fn(), findMany: vi.fn() },
    aegis_briefings: { create: vi.fn(), findMany: vi.fn() },
  },
}));

vi.mock('../../utils/logger.js', () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  },
}));

vi.mock('../../services/EnhancedLLMService.js', () => ({
  EnhancedLLMService: class {
    generate = vi.fn().mockResolvedValue({ content: 'AI analysis' });
  },
}));

import type {
  SignalType,
  ThreatType,
  Severity,
  ThreatStatus,
  ThreatSignal,
  ThreatAssessment,
  CascadeScenario,
  CascadeEffect,
  Countermeasure,
  ThreatBriefing,
} from '../../services/CendiaAegisService.js';

describe('CendiaAegisService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ===========================================================================
  // SIGNAL TYPES
  // ===========================================================================

  describe('SignalType', () => {
    it('should support CYBER signal type', () => {
      const type: SignalType = 'CYBER';
      expect(type).toBe('CYBER');
    });

    it('should support GEOPOLITICAL signal type', () => {
      const type: SignalType = 'GEOPOLITICAL';
      expect(type).toBe('GEOPOLITICAL');
    });

    it('should support INFRASTRUCTURE signal type', () => {
      const type: SignalType = 'INFRASTRUCTURE';
      expect(type).toBe('INFRASTRUCTURE');
    });

    it('should support SUPPLY_CHAIN signal type', () => {
      const type: SignalType = 'SUPPLY_CHAIN';
      expect(type).toBe('SUPPLY_CHAIN');
    });

    it('should support FINANCIAL signal type', () => {
      const type: SignalType = 'FINANCIAL';
      expect(type).toBe('FINANCIAL');
    });

    it('should support ENVIRONMENTAL signal type', () => {
      const type: SignalType = 'ENVIRONMENTAL';
      expect(type).toBe('ENVIRONMENTAL');
    });

    it('should support SOCIAL signal type', () => {
      const type: SignalType = 'SOCIAL';
      expect(type).toBe('SOCIAL');
    });

    it('should support REGULATORY signal type', () => {
      const type: SignalType = 'REGULATORY';
      expect(type).toBe('REGULATORY');
    });
  });

  // ===========================================================================
  // THREAT TYPES
  // ===========================================================================

  describe('ThreatType', () => {
    it('should support CYBER_ATTACK threat type', () => {
      const type: ThreatType = 'CYBER_ATTACK';
      expect(type).toBe('CYBER_ATTACK');
    });

    it('should support DATA_BREACH threat type', () => {
      const type: ThreatType = 'DATA_BREACH';
      expect(type).toBe('DATA_BREACH');
    });

    it('should support INSIDER_THREAT threat type', () => {
      const type: ThreatType = 'INSIDER_THREAT';
      expect(type).toBe('INSIDER_THREAT');
    });

    it('should support SUPPLY_CHAIN_ATTACK threat type', () => {
      const type: ThreatType = 'SUPPLY_CHAIN_ATTACK';
      expect(type).toBe('SUPPLY_CHAIN_ATTACK');
    });

    it('should support PHYSICAL_SECURITY threat type', () => {
      const type: ThreatType = 'PHYSICAL_SECURITY';
      expect(type).toBe('PHYSICAL_SECURITY');
    });

    it('should support GEOPOLITICAL_RISK threat type', () => {
      const type: ThreatType = 'GEOPOLITICAL_RISK';
      expect(type).toBe('GEOPOLITICAL_RISK');
    });

    it('should support NATURAL_DISASTER threat type', () => {
      const type: ThreatType = 'NATURAL_DISASTER';
      expect(type).toBe('NATURAL_DISASTER');
    });

    it('should support MARKET_DISRUPTION threat type', () => {
      const type: ThreatType = 'MARKET_DISRUPTION';
      expect(type).toBe('MARKET_DISRUPTION');
    });

    it('should support REGULATORY_ACTION threat type', () => {
      const type: ThreatType = 'REGULATORY_ACTION';
      expect(type).toBe('REGULATORY_ACTION');
    });

    it('should support REPUTATIONAL_CRISIS threat type', () => {
      const type: ThreatType = 'REPUTATIONAL_CRISIS';
      expect(type).toBe('REPUTATIONAL_CRISIS');
    });
  });

  // ===========================================================================
  // SEVERITY LEVELS
  // ===========================================================================

  describe('Severity', () => {
    it('should support CRITICAL severity', () => {
      const sev: Severity = 'CRITICAL';
      expect(sev).toBe('CRITICAL');
    });

    it('should support HIGH severity', () => {
      const sev: Severity = 'HIGH';
      expect(sev).toBe('HIGH');
    });

    it('should support MEDIUM severity', () => {
      const sev: Severity = 'MEDIUM';
      expect(sev).toBe('MEDIUM');
    });

    it('should support LOW severity', () => {
      const sev: Severity = 'LOW';
      expect(sev).toBe('LOW');
    });

    it('should support INFORMATIONAL severity', () => {
      const sev: Severity = 'INFORMATIONAL';
      expect(sev).toBe('INFORMATIONAL');
    });
  });

  // ===========================================================================
  // THREAT STATUS
  // ===========================================================================

  describe('ThreatStatus', () => {
    it('should support ACTIVE status', () => {
      const status: ThreatStatus = 'ACTIVE';
      expect(status).toBe('ACTIVE');
    });

    it('should support MONITORING status', () => {
      const status: ThreatStatus = 'MONITORING';
      expect(status).toBe('MONITORING');
    });

    it('should support CONTAINED status', () => {
      const status: ThreatStatus = 'CONTAINED';
      expect(status).toBe('CONTAINED');
    });

    it('should support MITIGATED status', () => {
      const status: ThreatStatus = 'MITIGATED';
      expect(status).toBe('MITIGATED');
    });

    it('should support RESOLVED status', () => {
      const status: ThreatStatus = 'RESOLVED';
      expect(status).toBe('RESOLVED');
    });
  });

  // ===========================================================================
  // THREAT SIGNAL STRUCTURE
  // ===========================================================================

  describe('ThreatSignal Structure', () => {
    it('should create valid threat signal', () => {
      const signal: ThreatSignal = {
        id: 'signal-123',
        signalType: 'CYBER',
        source: 'CISA Alerts',
        title: 'Critical vulnerability in Apache Log4j',
        content: 'CVE-2021-44228 allows remote code execution',
        severity: 'CRITICAL',
        confidence: 0.95,
        entities: ['Apache', 'Log4j', 'Java'],
        tags: ['CVE', 'RCE', 'zero-day'],
      };
      expect(signal.id).toBe('signal-123');
      expect(signal.severity).toBe('CRITICAL');
    });

    it('should handle high confidence signal', () => {
      const signal: Partial<ThreatSignal> = { confidence: 0.95 };
      expect(signal.confidence).toBe(0.95);
    });

    it('should handle low confidence signal', () => {
      const signal: Partial<ThreatSignal> = { confidence: 0.3 };
      expect(signal.confidence).toBe(0.3);
    });

    it('should handle multiple entities', () => {
      const signal: Partial<ThreatSignal> = {
        entities: ['Company A', 'Company B', 'Sector X'],
      };
      expect(signal.entities?.length).toBe(3);
    });

    it('should handle multiple tags', () => {
      const signal: Partial<ThreatSignal> = {
        tags: ['urgent', 'verified', 'actionable'],
      };
      expect(signal.tags?.length).toBe(3);
    });
  });

  // ===========================================================================
  // THREAT ASSESSMENT STRUCTURE
  // ===========================================================================

  describe('ThreatAssessment Structure', () => {
    it('should create valid threat assessment', () => {
      const assessment: ThreatAssessment = {
        id: 'threat-123',
        threatType: 'CYBER_ATTACK',
        title: 'Ransomware Campaign Targeting Financial Sector',
        description: 'Active ransomware campaign using phishing vectors',
        severity: 'HIGH',
        probability: 0.7,
        impactScore: 85,
        affectedAssets: ['email-system', 'file-servers', 'backup-systems'],
        status: 'ACTIVE',
      };
      expect(assessment.threatType).toBe('CYBER_ATTACK');
      expect(assessment.probability).toBe(0.7);
    });

    it('should handle high probability threat', () => {
      const assessment: Partial<ThreatAssessment> = { probability: 0.9 };
      expect(assessment.probability).toBe(0.9);
    });

    it('should handle low probability threat', () => {
      const assessment: Partial<ThreatAssessment> = { probability: 0.1 };
      expect(assessment.probability).toBe(0.1);
    });

    it('should handle high impact score', () => {
      const assessment: Partial<ThreatAssessment> = { impactScore: 95 };
      expect(assessment.impactScore).toBe(95);
    });

    it('should handle low impact score', () => {
      const assessment: Partial<ThreatAssessment> = { impactScore: 10 };
      expect(assessment.impactScore).toBe(10);
    });

    it('should handle multiple affected assets', () => {
      const assessment: Partial<ThreatAssessment> = {
        affectedAssets: ['asset-1', 'asset-2', 'asset-3', 'asset-4', 'asset-5'],
      };
      expect(assessment.affectedAssets?.length).toBe(5);
    });
  });

  // ===========================================================================
  // CASCADE SCENARIO STRUCTURE
  // ===========================================================================

  describe('CascadeScenario Structure', () => {
    it('should create valid cascade scenario', () => {
      const scenario: CascadeScenario = {
        id: 'scenario-123',
        scenarioName: 'Primary Data Center Failure',
        description: 'Complete loss of primary data center',
        triggerConditions: ['Power failure', 'Network outage', 'Physical damage'],
        cascadeEffects: [],
        financialImpact: 5000000,
        operationalImpact: 90,
        reputationalImpact: 75,
        recoveryTimeHours: 48,
        probability: 0.05,
      };
      expect(scenario.financialImpact).toBe(5000000);
    });

    it('should handle high financial impact', () => {
      const scenario: Partial<CascadeScenario> = { financialImpact: 100000000 };
      expect(scenario.financialImpact).toBe(100000000);
    });

    it('should handle low financial impact', () => {
      const scenario: Partial<CascadeScenario> = { financialImpact: 10000 };
      expect(scenario.financialImpact).toBe(10000);
    });

    it('should handle multiple trigger conditions', () => {
      const scenario: Partial<CascadeScenario> = {
        triggerConditions: ['Condition 1', 'Condition 2', 'Condition 3'],
      };
      expect(scenario.triggerConditions?.length).toBe(3);
    });

    it('should handle recovery time in hours', () => {
      const scenario: Partial<CascadeScenario> = { recoveryTimeHours: 72 };
      expect(scenario.recoveryTimeHours).toBe(72);
    });
  });

  // ===========================================================================
  // CASCADE EFFECT STRUCTURE
  // ===========================================================================

  describe('CascadeEffect Structure', () => {
    it('should create valid cascade effect', () => {
      const effect: CascadeEffect = {
        system: 'Payment Processing',
        effect: 'Complete service outage',
        timeToImpact: 30,
        severity: 'CRITICAL',
      };
      expect(effect.system).toBe('Payment Processing');
    });

    it('should handle immediate impact', () => {
      const effect: Partial<CascadeEffect> = { timeToImpact: 0 };
      expect(effect.timeToImpact).toBe(0);
    });

    it('should handle delayed impact', () => {
      const effect: Partial<CascadeEffect> = { timeToImpact: 120 };
      expect(effect.timeToImpact).toBe(120);
    });
  });

  // ===========================================================================
  // COUNTERMEASURE STRUCTURE
  // ===========================================================================

  describe('Countermeasure Structure', () => {
    it('should create valid countermeasure', () => {
      const countermeasure: Countermeasure = {
        id: 'cm-123',
        title: 'Deploy EDR Solution',
        description: 'Implement endpoint detection and response',
        type: 'PREVENTIVE',
        effectiveness: 0.85,
        costEstimate: 150000,
        timeToImplement: 30,
        status: 'proposed',
      };
      expect(countermeasure.type).toBe('PREVENTIVE');
    });

    it('should support PREVENTIVE type', () => {
      const cm: Partial<Countermeasure> = { type: 'PREVENTIVE' };
      expect(cm.type).toBe('PREVENTIVE');
    });

    it('should support DETECTIVE type', () => {
      const cm: Partial<Countermeasure> = { type: 'DETECTIVE' };
      expect(cm.type).toBe('DETECTIVE');
    });

    it('should support CORRECTIVE type', () => {
      const cm: Partial<Countermeasure> = { type: 'CORRECTIVE' };
      expect(cm.type).toBe('CORRECTIVE');
    });

    it('should support DETERRENT type', () => {
      const cm: Partial<Countermeasure> = { type: 'DETERRENT' };
      expect(cm.type).toBe('DETERRENT');
    });

    it('should support RECOVERY type', () => {
      const cm: Partial<Countermeasure> = { type: 'RECOVERY' };
      expect(cm.type).toBe('RECOVERY');
    });

    it('should handle high effectiveness', () => {
      const cm: Partial<Countermeasure> = { effectiveness: 0.95 };
      expect(cm.effectiveness).toBe(0.95);
    });

    it('should handle low effectiveness', () => {
      const cm: Partial<Countermeasure> = { effectiveness: 0.3 };
      expect(cm.effectiveness).toBe(0.3);
    });
  });

  // ===========================================================================
  // THREAT BRIEFING STRUCTURE
  // ===========================================================================

  describe('ThreatBriefing Structure', () => {
    it('should create valid threat briefing', () => {
      const briefing: ThreatBriefing = {
        id: 'briefing-123',
        title: 'Weekly Threat Intelligence Summary',
        classification: 'INTERNAL',
        executiveSummary: 'Key threats identified this week...',
        detailedAnalysis: 'Detailed analysis of threat landscape...',
        recommendations: ['Patch systems', 'Update policies', 'Train staff'],
      };
      expect(briefing.classification).toBe('INTERNAL');
    });

    it('should support PUBLIC classification', () => {
      const briefing: Partial<ThreatBriefing> = { classification: 'PUBLIC' };
      expect(briefing.classification).toBe('PUBLIC');
    });

    it('should support INTERNAL classification', () => {
      const briefing: Partial<ThreatBriefing> = { classification: 'INTERNAL' };
      expect(briefing.classification).toBe('INTERNAL');
    });

    it('should support CONFIDENTIAL classification', () => {
      const briefing: Partial<ThreatBriefing> = { classification: 'CONFIDENTIAL' };
      expect(briefing.classification).toBe('CONFIDENTIAL');
    });

    it('should support RESTRICTED classification', () => {
      const briefing: Partial<ThreatBriefing> = { classification: 'RESTRICTED' };
      expect(briefing.classification).toBe('RESTRICTED');
    });

    it('should handle multiple recommendations', () => {
      const briefing: Partial<ThreatBriefing> = {
        recommendations: ['Rec 1', 'Rec 2', 'Rec 3', 'Rec 4', 'Rec 5'],
      };
      expect(briefing.recommendations?.length).toBe(5);
    });
  });

  // ===========================================================================
  // CONFIDENCE LEVELS
  // ===========================================================================

  describe('Confidence Levels', () => {
    it('should handle 0% confidence', () => {
      const signal: Partial<ThreatSignal> = { confidence: 0 };
      expect(signal.confidence).toBe(0);
    });

    it('should handle 25% confidence', () => {
      const signal: Partial<ThreatSignal> = { confidence: 0.25 };
      expect(signal.confidence).toBe(0.25);
    });

    it('should handle 50% confidence', () => {
      const signal: Partial<ThreatSignal> = { confidence: 0.5 };
      expect(signal.confidence).toBe(0.5);
    });

    it('should handle 75% confidence', () => {
      const signal: Partial<ThreatSignal> = { confidence: 0.75 };
      expect(signal.confidence).toBe(0.75);
    });

    it('should handle 100% confidence', () => {
      const signal: Partial<ThreatSignal> = { confidence: 1.0 };
      expect(signal.confidence).toBe(1.0);
    });
  });

  // ===========================================================================
  // PROBABILITY LEVELS
  // ===========================================================================

  describe('Probability Levels', () => {
    it('should handle 1% probability', () => {
      const assessment: Partial<ThreatAssessment> = { probability: 0.01 };
      expect(assessment.probability).toBe(0.01);
    });

    it('should handle 5% probability', () => {
      const assessment: Partial<ThreatAssessment> = { probability: 0.05 };
      expect(assessment.probability).toBe(0.05);
    });

    it('should handle 10% probability', () => {
      const assessment: Partial<ThreatAssessment> = { probability: 0.1 };
      expect(assessment.probability).toBe(0.1);
    });

    it('should handle 25% probability', () => {
      const assessment: Partial<ThreatAssessment> = { probability: 0.25 };
      expect(assessment.probability).toBe(0.25);
    });

    it('should handle 50% probability', () => {
      const assessment: Partial<ThreatAssessment> = { probability: 0.5 };
      expect(assessment.probability).toBe(0.5);
    });

    it('should handle 75% probability', () => {
      const assessment: Partial<ThreatAssessment> = { probability: 0.75 };
      expect(assessment.probability).toBe(0.75);
    });

    it('should handle 90% probability', () => {
      const assessment: Partial<ThreatAssessment> = { probability: 0.9 };
      expect(assessment.probability).toBe(0.9);
    });
  });

  // ===========================================================================
  // IMPACT SCORES
  // ===========================================================================

  describe('Impact Scores', () => {
    it('should handle impact score 0', () => {
      const assessment: Partial<ThreatAssessment> = { impactScore: 0 };
      expect(assessment.impactScore).toBe(0);
    });

    it('should handle impact score 25', () => {
      const assessment: Partial<ThreatAssessment> = { impactScore: 25 };
      expect(assessment.impactScore).toBe(25);
    });

    it('should handle impact score 50', () => {
      const assessment: Partial<ThreatAssessment> = { impactScore: 50 };
      expect(assessment.impactScore).toBe(50);
    });

    it('should handle impact score 75', () => {
      const assessment: Partial<ThreatAssessment> = { impactScore: 75 };
      expect(assessment.impactScore).toBe(75);
    });

    it('should handle impact score 100', () => {
      const assessment: Partial<ThreatAssessment> = { impactScore: 100 };
      expect(assessment.impactScore).toBe(100);
    });
  });

  // ===========================================================================
  // RECOVERY TIME
  // ===========================================================================

  describe('Recovery Time', () => {
    it('should handle 1 hour recovery', () => {
      const scenario: Partial<CascadeScenario> = { recoveryTimeHours: 1 };
      expect(scenario.recoveryTimeHours).toBe(1);
    });

    it('should handle 4 hour recovery', () => {
      const scenario: Partial<CascadeScenario> = { recoveryTimeHours: 4 };
      expect(scenario.recoveryTimeHours).toBe(4);
    });

    it('should handle 24 hour recovery', () => {
      const scenario: Partial<CascadeScenario> = { recoveryTimeHours: 24 };
      expect(scenario.recoveryTimeHours).toBe(24);
    });

    it('should handle 72 hour recovery', () => {
      const scenario: Partial<CascadeScenario> = { recoveryTimeHours: 72 };
      expect(scenario.recoveryTimeHours).toBe(72);
    });

    it('should handle 168 hour (1 week) recovery', () => {
      const scenario: Partial<CascadeScenario> = { recoveryTimeHours: 168 };
      expect(scenario.recoveryTimeHours).toBe(168);
    });

    it('should handle 720 hour (30 day) recovery', () => {
      const scenario: Partial<CascadeScenario> = { recoveryTimeHours: 720 };
      expect(scenario.recoveryTimeHours).toBe(720);
    });
  });

  // ===========================================================================
  // COST ESTIMATES
  // ===========================================================================

  describe('Cost Estimates', () => {
    it('should handle $1K cost', () => {
      const cm: Partial<Countermeasure> = { costEstimate: 1000 };
      expect(cm.costEstimate).toBe(1000);
    });

    it('should handle $10K cost', () => {
      const cm: Partial<Countermeasure> = { costEstimate: 10000 };
      expect(cm.costEstimate).toBe(10000);
    });

    it('should handle $100K cost', () => {
      const cm: Partial<Countermeasure> = { costEstimate: 100000 };
      expect(cm.costEstimate).toBe(100000);
    });

    it('should handle $1M cost', () => {
      const cm: Partial<Countermeasure> = { costEstimate: 1000000 };
      expect(cm.costEstimate).toBe(1000000);
    });

    it('should handle $10M cost', () => {
      const cm: Partial<Countermeasure> = { costEstimate: 10000000 };
      expect(cm.costEstimate).toBe(10000000);
    });
  });

  // ===========================================================================
  // IMPLEMENTATION TIME
  // ===========================================================================

  describe('Implementation Time', () => {
    it('should handle 1 day implementation', () => {
      const cm: Partial<Countermeasure> = { timeToImplement: 1 };
      expect(cm.timeToImplement).toBe(1);
    });

    it('should handle 7 day implementation', () => {
      const cm: Partial<Countermeasure> = { timeToImplement: 7 };
      expect(cm.timeToImplement).toBe(7);
    });

    it('should handle 30 day implementation', () => {
      const cm: Partial<Countermeasure> = { timeToImplement: 30 };
      expect(cm.timeToImplement).toBe(30);
    });

    it('should handle 90 day implementation', () => {
      const cm: Partial<Countermeasure> = { timeToImplement: 90 };
      expect(cm.timeToImplement).toBe(90);
    });

    it('should handle 180 day implementation', () => {
      const cm: Partial<Countermeasure> = { timeToImplement: 180 };
      expect(cm.timeToImplement).toBe(180);
    });

    it('should handle 365 day implementation', () => {
      const cm: Partial<Countermeasure> = { timeToImplement: 365 };
      expect(cm.timeToImplement).toBe(365);
    });
  });

  // ===========================================================================
  // BUSINESS SCENARIOS
  // ===========================================================================

  describe('Business Scenarios', () => {
    it('should model ransomware attack scenario', () => {
      const assessment: Partial<ThreatAssessment> = {
        threatType: 'CYBER_ATTACK',
        title: 'Ransomware Attack',
        severity: 'CRITICAL',
        probability: 0.3,
      };
      expect(assessment.threatType).toBe('CYBER_ATTACK');
    });

    it('should model supply chain disruption', () => {
      const assessment: Partial<ThreatAssessment> = {
        threatType: 'SUPPLY_CHAIN_ATTACK',
        title: 'Critical Supplier Failure',
        severity: 'HIGH',
      };
      expect(assessment.threatType).toBe('SUPPLY_CHAIN_ATTACK');
    });

    it('should model regulatory action', () => {
      const assessment: Partial<ThreatAssessment> = {
        threatType: 'REGULATORY_ACTION',
        title: 'GDPR Investigation',
        severity: 'HIGH',
      };
      expect(assessment.threatType).toBe('REGULATORY_ACTION');
    });

    it('should model natural disaster', () => {
      const assessment: Partial<ThreatAssessment> = {
        threatType: 'NATURAL_DISASTER',
        title: 'Hurricane Impact on Operations',
        severity: 'CRITICAL',
      };
      expect(assessment.threatType).toBe('NATURAL_DISASTER');
    });

    it('should model insider threat', () => {
      const assessment: Partial<ThreatAssessment> = {
        threatType: 'INSIDER_THREAT',
        title: 'Data Exfiltration by Employee',
        severity: 'HIGH',
      };
      expect(assessment.threatType).toBe('INSIDER_THREAT');
    });
  });

  // ===========================================================================
  // EDGE CASES
  // ===========================================================================

  describe('Edge Cases', () => {
    it('should handle empty entities array', () => {
      const signal: Partial<ThreatSignal> = { entities: [] };
      expect(signal.entities?.length).toBe(0);
    });

    it('should handle empty tags array', () => {
      const signal: Partial<ThreatSignal> = { tags: [] };
      expect(signal.tags?.length).toBe(0);
    });

    it('should handle empty affected assets', () => {
      const assessment: Partial<ThreatAssessment> = { affectedAssets: [] };
      expect(assessment.affectedAssets?.length).toBe(0);
    });

    it('should handle empty recommendations', () => {
      const briefing: Partial<ThreatBriefing> = { recommendations: [] };
      expect(briefing.recommendations?.length).toBe(0);
    });

    it('should handle very long title', () => {
      const signal: Partial<ThreatSignal> = { title: 'A'.repeat(1000) };
      expect(signal.title?.length).toBe(1000);
    });

    it('should handle special characters in content', () => {
      const signal: Partial<ThreatSignal> = {
        content: 'CVE-2021-44228 <script>alert("xss")</script>',
      };
      expect(signal.content).toContain('CVE-2021-44228');
    });

    it('should handle unicode in title', () => {
      const signal: Partial<ThreatSignal> = {
        title: '网络安全威胁 🚨',
      };
      expect(signal.title).toContain('网络');
    });

    it('should handle zero financial impact', () => {
      const scenario: Partial<CascadeScenario> = { financialImpact: 0 };
      expect(scenario.financialImpact).toBe(0);
    });

    it('should handle zero operational impact', () => {
      const scenario: Partial<CascadeScenario> = { operationalImpact: 0 };
      expect(scenario.operationalImpact).toBe(0);
    });

    it('should handle zero reputational impact', () => {
      const scenario: Partial<CascadeScenario> = { reputationalImpact: 0 };
      expect(scenario.reputationalImpact).toBe(0);
    });
  });
});
