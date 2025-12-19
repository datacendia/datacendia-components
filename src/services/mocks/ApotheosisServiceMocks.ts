/**
 * Mock Data for Apotheosis Service
 * Provides fallback data when API is unavailable or for demo purposes
 * 
 * FALLBACK BEHAVIOR:
 * - Mock data is returned when API calls fail due to network errors, server errors, or timeouts
 * - Mock data is also returned when the API returns no data (null/undefined responses)
 * - This ensures the UI remains functional even when the backend is unavailable
 * - Mock data provides realistic sample values for demonstration and development
 */

import type {
  ApotheosisScore,
  ApotheosisRun,
  Escalation,
  PatternBan,
  UpskillAssignment,
  ApotheosisConfig,
} from '../ApotheosisService';

// =============================================================================
// TIME CONSTANTS
// =============================================================================

const FIFTEEN_MINUTES_MS = 15 * 60 * 1000;
const THREE_HOURS_MS = 3 * 60 * 60 * 1000;
const FORTY_EIGHT_HOURS_MS = 48 * 60 * 60 * 1000;
const SEVENTY_TWO_HOURS_MS = 72 * 60 * 60 * 1000;
const ONE_HUNDRED_TWENTY_HOURS_MS = 120 * 60 * 60 * 1000;

/**
 * Mock Apotheosis Score data
 * Represents a high-performing organization with good improvement trends
 */
export function getMockScore(): ApotheosisScore {
  return {
    overall: 94.7,
    components: {
      redTeamSurvivalRate: { value: 93, weight: 0.3 },
      weaknessClosureRate: { value: 97, weight: 0.25 },
      decisionSuccessRate: { value: 89, weight: 0.25 },
      humanReadiness: { value: 96, weight: 0.1 },
      patternHealth: { value: 98, weight: 0.1 },
    },
    trend: [
      { date: '2024-01', score: 78.2 },
      { date: '2024-03', score: 82.4 },
      { date: '2024-06', score: 88.1 },
      { date: '2024-09', score: 92.3 },
      { date: '2024-12', score: 94.7 },
    ],
    improvementPoints: 16.5,
    improvementPeriod: '11 months',
  };
}

/**
 * Mock Latest Run data
 * Represents a recently completed Apotheosis run with typical results
 */
export function getMockLatestRun(): ApotheosisRun {
  return {
    id: 'run-demo-1',
    organizationId: 'demo-org',
    startedAt: new Date(Date.now() - THREE_HOURS_MS), // 3 hours ago
    completedAt: new Date(Date.now() - FIFTEEN_MINUTES_MS), // 15 minutes ago
    status: 'completed',
    scenariosTested: 1247,
    scenariosSurvived: 1160,
    survivalRate: 93.0,
    criticalCount: 3,
    highCount: 12,
    mediumCount: 18,
    lowCount: 14,
    apotheosisScore: 94.7,
    previousScore: 92.3,
    scoreDelta: 2.4,
    shadowCouncilInstances: 12,
    computeHours: 847,
    duration: 167, // minutes
  };
}

/**
 * Mock Escalations data
 * Represents critical issues requiring human decision-making
 */
export function getMockEscalations(): Escalation[] {
  return [
    {
      id: 'esc-1',
      weaknessId: 'w1',
      title: 'Single point of failure in Finance',
      description:
        'Only CFO can approve wire transfers >$100K. CFO unavailable = business stops.',
      severity: 'critical',
      reason: 'Requires policy change',
      estimatedCostToFix: 0,
      riskIfNotFixed: 2300000,
      assignedTo: ['executive-team'],
      deadline: new Date(Date.now() + FORTY_EIGHT_HOURS_MS), // 48 hours from now
      status: 'pending',
    },
    {
      id: 'esc-2',
      weaknessId: 'w2',
      title: 'Vendor concentration risk',
      description:
        '73% of cloud spend with single vendor (AWS). Price increase or outage = major impact.',
      severity: 'high',
      reason: 'Budget impact exceeds threshold',
      estimatedCostToFix: 150000,
      riskIfNotFixed: 4100000,
      assignedTo: ['cto', 'cfo'],
      deadline: new Date(Date.now() + SEVENTY_TWO_HOURS_MS), // 72 hours from now
      status: 'pending',
    },
    {
      id: 'esc-3',
      weaknessId: 'w3',
      title: 'Knowledge concentration in Engineering',
      description:
        '3 engineers hold 80% of critical system knowledge. Departure = 6-12 month recovery.',
      severity: 'high',
      reason: 'Requires resource allocation',
      estimatedCostToFix: 45000,
      riskIfNotFixed: 1800000,
      assignedTo: ['vp-engineering'],
      deadline: new Date(Date.now() + ONE_HUNDRED_TWENTY_HOURS_MS), // 120 hours from now
      status: 'pending',
    },
  ];
}

/**
 * Mock Banned Patterns data
 * Represents decision patterns that have been identified as harmful and banned
 */
export function getMockBannedPatterns(): PatternBan[] {
  return [
    {
      id: 'pb-1',
      pattern: 'Skip process for urgent requests',
      description: 'Bypassing standard review for urgency claims',
      instances: [
        {
          decisionId: 'd1',
          decisionTitle: 'Rush vendor onboarding',
          date: new Date('2024-09-15'),
          outcome: 'failure',
          cost: 120000,
        },
        {
          decisionId: 'd2',
          decisionTitle: 'Skip QA for deadline',
          date: new Date('2024-06-10'),
          outcome: 'failure',
          cost: 45000,
        },
        {
          decisionId: 'd3',
          decisionTitle: 'Skip legal review',
          date: new Date('2024-03-22'),
          outcome: 'failure',
          cost: 75000,
        },
      ],
      failureRate: 100,
      totalCost: 240000,
      bannedAt: new Date('2024-09-20'),
      bannedBy: 'apotheosis',
      status: 'active',
      overrideRequires: 'CEO approval',
    },
    {
      id: 'pb-2',
      pattern: 'Approve vendor without references',
      description: 'Onboarding vendors without reference checks',
      instances: [
        {
          decisionId: 'd4',
          decisionTitle: 'New supplier approval',
          date: new Date('2024-06-01'),
          outcome: 'failure',
          cost: 85000,
        },
        {
          decisionId: 'd5',
          decisionTitle: 'Contractor engagement',
          date: new Date('2024-04-15'),
          outcome: 'failure',
          cost: 62000,
        },
      ],
      failureRate: 100,
      totalCost: 147000,
      bannedAt: new Date('2024-06-15'),
      bannedBy: 'apotheosis',
      status: 'active',
      overrideRequires: 'CFO approval',
    },
    {
      id: 'pb-3',
      pattern: 'Deploy Friday afternoon',
      description: 'Production deployments on Friday afternoons',
      instances: [
        {
          decisionId: 'd6',
          decisionTitle: 'Feature release',
          date: new Date('2024-03-08'),
          outcome: 'failure',
          cost: 35000,
        },
        {
          decisionId: 'd7',
          decisionTitle: 'Hotfix deployment',
          date: new Date('2024-02-16'),
          outcome: 'failure',
          cost: 28000,
        },
      ],
      failureRate: 83,
      totalCost: 63000,
      bannedAt: new Date('2024-03-15'),
      bannedBy: 'apotheosis',
      status: 'active',
      overrideRequires: 'CTO approval',
    },
  ];
}

/**
 * Mock Upskill Assignments data
 * Represents training assignments to address identified knowledge gaps
 */
export function getMockUpskillAssignments(): UpskillAssignment[] {
  return [
    {
      id: 'us-1',
      userId: 'user-1',
      userName: 'James Wilson',
      weaknessId: 'w1',
      gapIdentified: 'Vendor security assessment',
      trainingTopic: 'Vendor Security Fundamentals',
      trainingDuration: 45,
      deadline: new Date(Date.now() + SEVENTY_TWO_HOURS_MS), // 72 hours from now
      modules: [
        { title: 'Why vendor security matters', duration: 10, type: 'video' },
        { title: 'The breach that bankrupted...', duration: 15, type: 'reading' },
        { title: 'Security checklist for contracts', duration: 10, type: 'reading' },
        { title: 'Quiz + certification', duration: 10, type: 'quiz' },
      ],
      status: 'assigned',
      blockingActions: true,
    },
    {
      id: 'us-2',
      userId: 'user-2',
      userName: 'Sarah Chen',
      weaknessId: 'w2',
      gapIdentified: 'Financial red flags recognition',
      trainingTopic: 'Financial Risk Indicators',
      trainingDuration: 30,
      deadline: new Date(Date.now() + FORTY_EIGHT_HOURS_MS), // 48 hours from now
      modules: [
        { title: 'Common financial warning signs', duration: 10, type: 'video' },
        { title: 'Case studies', duration: 15, type: 'reading' },
        { title: 'Assessment', duration: 5, type: 'quiz' },
      ],
      status: 'in_progress',
      blockingActions: false,
    },
    {
      id: 'us-3',
      userId: 'user-3',
      userName: 'Mike Rodriguez',
      weaknessId: 'w3',
      gapIdentified: 'Data privacy (GDPR)',
      trainingTopic: 'GDPR Compliance Essentials',
      trainingDuration: 60,
      deadline: new Date(Date.now() + ONE_HUNDRED_TWENTY_HOURS_MS), // 120 hours from now
      modules: [
        { title: 'GDPR fundamentals', duration: 20, type: 'video' },
        { title: 'Data handling procedures', duration: 25, type: 'reading' },
        { title: 'Certification exam', duration: 15, type: 'quiz' },
      ],
      status: 'assigned',
      blockingActions: false,
    },
  ];
}

/**
 * Mock Default Configuration
 * Represents typical production configuration values
 */
export function getDefaultConfig(): ApotheosisConfig {
  return {
    runFrequency: 'nightly',
    runTime: '03:00',
    scenarioCount: 1000,
    autoPatchThreshold: 10000,
    escalationTimeout: 72,
    patternBanThreshold: 3,
    trainingDeadline: 72,
  };
}
