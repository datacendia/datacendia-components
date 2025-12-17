// @ts-nocheck
// =============================================================================
// CENDIA DISSENT™ — FRONTEND SERVICE
// The Right to Formally, Safely, Immutably Disagree
// =============================================================================
function stryNS_9fa48() {
  var g = typeof globalThis === 'object' && globalThis && globalThis.Math === Math && globalThis || new Function("return this")();
  var ns = g.__stryker__ || (g.__stryker__ = {});
  if (ns.activeMutant === undefined && g.process && g.process.env && g.process.env.__STRYKER_ACTIVE_MUTANT__) {
    ns.activeMutant = g.process.env.__STRYKER_ACTIVE_MUTANT__;
  }
  function retrieveNS() {
    return ns;
  }
  stryNS_9fa48 = retrieveNS;
  return retrieveNS();
}
stryNS_9fa48();
function stryCov_9fa48() {
  var ns = stryNS_9fa48();
  var cov = ns.mutantCoverage || (ns.mutantCoverage = {
    static: {},
    perTest: {}
  });
  function cover() {
    var c = cov.static;
    if (ns.currentTestId) {
      c = cov.perTest[ns.currentTestId] = cov.perTest[ns.currentTestId] || {};
    }
    var a = arguments;
    for (var i = 0; i < a.length; i++) {
      c[a[i]] = (c[a[i]] || 0) + 1;
    }
  }
  stryCov_9fa48 = cover;
  cover.apply(null, arguments);
}
function stryMutAct_9fa48(id) {
  var ns = stryNS_9fa48();
  function isActive(id) {
    if (ns.activeMutant === id) {
      if (ns.hitCount !== void 0 && ++ns.hitCount > ns.hitLimit) {
        throw new Error('Stryker: Hit count limit reached (' + ns.hitCount + ')');
      }
      return true;
    }
    return false;
  }
  stryMutAct_9fa48 = isActive;
  return isActive(id);
}
import { api } from '../lib/api';

// =============================================================================
// TYPES
// =============================================================================

export type DissentType = 'factual' | 'risk' | 'ethical' | 'process' | 'strategic' | 'resource' | 'other';
export type DissentSeverity = 'advisory' | 'formal_objection' | 'blocking';
export type DissentStatus = 'pending' | 'acknowledged' | 'accepted' | 'overruled' | 'clarification_requested' | 'escalated';
export type ResponseType = 'accept' | 'partial_accept' | 'acknowledge_proceed' | 'request_clarification' | 'escalate_together';
export interface Dissent {
  id: string;
  organizationId: string;
  decisionId: string;
  decisionTitle: string;
  decisionDate: Date;
  decisionOwner: string;
  dissentType: DissentType;
  severity: DissentSeverity;
  statement: string;
  supportingEvidence?: string[];
  isAnonymous: boolean;
  dissenterId: string;
  dissenterName: string;
  dissenterRole?: string;
  dissenterDepartment?: string;
  status: DissentStatus;
  responseDeadline: Date;
  response?: DissentResponse;
  outcomeVerified: boolean;
  dissenterWasRight?: boolean;
  outcomeVerifiedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  ledgerHash: string;
  ledgerTimestamp: Date;
}
export interface DissentResponse {
  id: string;
  dissentId: string;
  responderId: string;
  responderName: string;
  responderRole: string;
  responseType: ResponseType;
  reasoning: string;
  mitigatingActions?: string[];
  createdAt: Date;
  ledgerHash: string;
}
export interface DissenterProfile {
  userId: string;
  userName: string;
  isAnonymous: boolean;
  totalDissents: number;
  acknowledged: number;
  acceptedDissents: number;
  overruledDissents: number;
  dissentAccuracy: number;
  verifiedOutcomes: number;
  correctPredictions: number;
  isHighAccuracy: boolean;
  byType: Record<string, number>;
}
export interface OrganizationDissentMetrics {
  organizationId: string;
  totalDissents: number;
  activeDissents: number;
  responseRate: number;
  avgResponseTime: number;
  acceptanceRate: number;
  overallAccuracy: number;
  retaliationFlags: number;
  healthStatus: 'healthy' | 'warning' | 'critical';
  byDepartment: DepartmentDissentMetrics[];
  highAccuracyDissenters: DissenterProfile[];
  trend: Array<{
    date: string;
    count: number;
    accuracy: number;
  }>;
}
export interface DepartmentDissentMetrics {
  department: string;
  totalDissents: number;
  acceptedRate: number;
  accuracy: number;
  trend: 'up' | 'stable' | 'down';
}
export interface RetaliationFlag {
  id: string;
  dissentId: string;
  dissenterId: string;
  dissenterName: string;
  flagType: 'performance_review' | 'compensation' | 'role_change' | 'access_revocation' | 'meeting_exclusion' | 'communication_pattern';
  description: string;
  detectedAt: Date;
  status: 'new' | 'investigating' | 'confirmed' | 'false_positive' | 'resolved';
  assignedTo?: string;
  resolution?: string;
  resolvedAt?: Date;
  escalatedToBoard: boolean;
  escalatedAt?: Date;
}
export interface DissentConfig {
  responseDeadline: number;
  escalationPath: string[];
  anonymousAllowed: boolean;
  retaliationMonitoringDuration: number;
  highAccuracyThreshold: number;
  blockingDissentAllowed: boolean;
  minimumDissentsForAccuracy: number;
}
export interface FileDissentRequest {
  decisionId: string;
  decisionTitle: string;
  decisionOwner: string;
  dissentType: DissentType;
  severity: DissentSeverity;
  statement: string;
  supportingEvidence?: string[];
  isAnonymous: boolean;
  dissenterId: string;
  dissenterName: string;
  dissenterRole?: string;
  dissenterDepartment?: string;
}
export interface RespondToDissentRequest {
  responderId: string;
  responderName: string;
  responderRole: string;
  responseType: ResponseType;
  reasoning: string;
  mitigatingActions?: string[];
}

// =============================================================================
// SERVICE CLASS
// =============================================================================

class DissentService {
  private baseUrl = '/api/v1/dissent';

  /**
   * File a new dissent
   */
  async fileDissent(data: FileDissentRequest): Promise<Dissent> {
    const response = await api.post<Dissent>(this.baseUrl, data);
    if (stryMutAct_9fa48("67458") ? false : stryMutAct_9fa48("67457") ? true : stryMutAct_9fa48("67456") ? response.data : (stryCov_9fa48("67456", "67457", "67458"), !response.data)) throw new Error('Failed to file dissent');
    return response.data;
  }

  /**
   * Get all dissents
   */
  async getDissents(options: {
    status?: DissentStatus;
    userId?: string;
    decisionId?: string;
    limit?: number;
  } = {}): Promise<Dissent[]> {
    try {
      const params = new URLSearchParams();
      if (stryMutAct_9fa48("67463") ? false : stryMutAct_9fa48("67462") ? true : (stryCov_9fa48("67462", "67463"), options.status)) params.append('status', options.status);
      if (stryMutAct_9fa48("67466") ? false : stryMutAct_9fa48("67465") ? true : (stryCov_9fa48("67465", "67466"), options.userId)) params.append('userId', options.userId);
      if (stryMutAct_9fa48("67469") ? false : stryMutAct_9fa48("67468") ? true : (stryCov_9fa48("67468", "67469"), options.decisionId)) params.append('decisionId', options.decisionId);
      if (stryMutAct_9fa48("67472") ? false : stryMutAct_9fa48("67471") ? true : (stryCov_9fa48("67471", "67472"), options.limit)) params.append('limit', options.limit.toString());
      const response = await api.get<Dissent[]>(`${this.baseUrl}?${params.toString()}`);
      return stryMutAct_9fa48("67475") ? response.data && this.getMockDissents() : (stryCov_9fa48("67475"), response.data ?? this.getMockDissents());
    } catch (error) {
      console.error('[Dissent] Error fetching dissents:', error);
      return this.getMockDissents();
    }
  }

  /**
   * Get active dissents requiring response
   */
  async getActiveDissents(): Promise<Dissent[]> {
    try {
      const response = await api.get<Dissent[]>(`${this.baseUrl}/active`);
      return stryMutAct_9fa48("67481") ? response.data && this.getMockDissents().filter(d => d.status === 'pending') : (stryCov_9fa48("67481"), response.data ?? (stryMutAct_9fa48("67482") ? this.getMockDissents() : (stryCov_9fa48("67482"), this.getMockDissents().filter(stryMutAct_9fa48("67483") ? () => undefined : (stryCov_9fa48("67483"), d => stryMutAct_9fa48("67486") ? d.status !== 'pending' : stryMutAct_9fa48("67485") ? false : stryMutAct_9fa48("67484") ? true : (stryCov_9fa48("67484", "67485", "67486"), d.status === 'pending'))))));
    } catch (error) {
      console.error('[Dissent] Error fetching active dissents:', error);
      return stryMutAct_9fa48("67490") ? this.getMockDissents() : (stryCov_9fa48("67490"), this.getMockDissents().filter(stryMutAct_9fa48("67491") ? () => undefined : (stryCov_9fa48("67491"), d => stryMutAct_9fa48("67494") ? d.status !== 'pending' : stryMutAct_9fa48("67493") ? false : stryMutAct_9fa48("67492") ? true : (stryCov_9fa48("67492", "67493", "67494"), d.status === 'pending'))));
    }
  }

  /**
   * Get dissent by ID
   */
  async getDissentById(id: string): Promise<Dissent | null> {
    try {
      const response = await api.get<Dissent>(`${this.baseUrl}/${id}`);
      return stryMutAct_9fa48("67499") ? response.data && null : (stryCov_9fa48("67499"), response.data ?? null);
    } catch (error) {
      console.error('[Dissent] Error fetching dissent:', error);
      return null;
    }
  }

  /**
   * Respond to a dissent
   */
  async respondToDissent(id: string, data: RespondToDissentRequest): Promise<Dissent> {
    const response = await api.post<Dissent>(`${this.baseUrl}/${id}/respond`, data);
    if (stryMutAct_9fa48("67506") ? false : stryMutAct_9fa48("67505") ? true : stryMutAct_9fa48("67504") ? response.data : (stryCov_9fa48("67504", "67505", "67506"), !response.data)) throw new Error('Failed to respond to dissent');
    return response.data;
  }

  /**
   * Get dissenter profile
   */
  async getDissenterProfile(userId: string): Promise<DissenterProfile> {
    try {
      const response = await api.get<DissenterProfile>(`${this.baseUrl}/profile/${userId}`);
      return stryMutAct_9fa48("67511") ? response.data && this.getMockProfile() : (stryCov_9fa48("67511"), response.data ?? this.getMockProfile());
    } catch (error) {
      console.error('[Dissent] Error fetching profile:', error);
      return this.getMockProfile();
    }
  }

  /**
   * Get organization metrics
   */
  async getOrganizationMetrics(): Promise<OrganizationDissentMetrics> {
    try {
      const response = await api.get<OrganizationDissentMetrics>(`${this.baseUrl}/metrics/organization`);
      return stryMutAct_9fa48("67517") ? response.data && this.getMockMetrics() : (stryCov_9fa48("67517"), response.data ?? this.getMockMetrics());
    } catch (error) {
      console.error('[Dissent] Error fetching metrics:', error);
      return this.getMockMetrics();
    }
  }

  /**
   * Get retaliation flags
   */
  async getRetaliationFlags(): Promise<RetaliationFlag[]> {
    try {
      const response = await api.get<RetaliationFlag[]>(`${this.baseUrl}/retaliation-flags`);
      return stryMutAct_9fa48("67523") ? response.data && [] : (stryCov_9fa48("67523"), response.data ?? (stryMutAct_9fa48("67524") ? ["Stryker was here"] : (stryCov_9fa48("67524"), [])));
    } catch (error) {
      console.error('[Dissent] Error fetching retaliation flags:', error);
      return stryMutAct_9fa48("67527") ? ["Stryker was here"] : (stryCov_9fa48("67527"), []);
    }
  }

  /**
   * Report potential retaliation
   */
  async reportRetaliation(dissentId: string, flagType: RetaliationFlag['flagType'], description: string): Promise<RetaliationFlag> {
    const response = await api.post<RetaliationFlag>(`${this.baseUrl}/${dissentId}/report-retaliation`, stryMutAct_9fa48("67530") ? {} : (stryCov_9fa48("67530"), {
      flagType,
      description
    }));
    if (stryMutAct_9fa48("67533") ? false : stryMutAct_9fa48("67532") ? true : stryMutAct_9fa48("67531") ? response.data : (stryCov_9fa48("67531", "67532", "67533"), !response.data)) throw new Error('Failed to report retaliation');
    return response.data;
  }

  /**
   * Record outcome verification
   */
  async recordOutcomeVerification(id: string, wasRight: boolean, notes?: string): Promise<Dissent> {
    const response = await api.post<Dissent>(`${this.baseUrl}/${id}/verify-outcome`, stryMutAct_9fa48("67537") ? {} : (stryCov_9fa48("67537"), {
      wasRight,
      notes
    }));
    if (stryMutAct_9fa48("67540") ? false : stryMutAct_9fa48("67539") ? true : stryMutAct_9fa48("67538") ? response.data : (stryCov_9fa48("67538", "67539", "67540"), !response.data)) throw new Error('Failed to record outcome');
    return response.data;
  }

  /**
   * Check if there are blocking dissents for a decision
   */
  async checkDissentBlock(decisionId: string): Promise<{
    blocked: boolean;
    dissents: Dissent[];
  }> {
    try {
      const response = await api.get<{
        blocked: boolean;
        dissents: Dissent[];
      }>(`${this.baseUrl}/check-block/${decisionId}`);
      return stryMutAct_9fa48("67545") ? response.data && {
        blocked: false,
        dissents: []
      } : (stryCov_9fa48("67545"), response.data ?? (stryMutAct_9fa48("67546") ? {} : (stryCov_9fa48("67546"), {
        blocked: stryMutAct_9fa48("67547") ? true : (stryCov_9fa48("67547"), false),
        dissents: stryMutAct_9fa48("67548") ? ["Stryker was here"] : (stryCov_9fa48("67548"), [])
      })));
    } catch (error) {
      console.error('[Dissent] Error checking dissent block:', error);
      return stryMutAct_9fa48("67551") ? {} : (stryCov_9fa48("67551"), {
        blocked: stryMutAct_9fa48("67552") ? true : (stryCov_9fa48("67552"), false),
        dissents: stryMutAct_9fa48("67553") ? ["Stryker was here"] : (stryCov_9fa48("67553"), [])
      });
    }
  }

  /**
   * Get configuration
   */
  async getConfig(): Promise<DissentConfig> {
    try {
      const response = await api.get<DissentConfig>(`${this.baseUrl}/config`);
      return stryMutAct_9fa48("67557") ? response.data && this.getDefaultConfig() : (stryCov_9fa48("67557"), response.data ?? this.getDefaultConfig());
    } catch (error) {
      console.error('[Dissent] Error fetching config:', error);
      return this.getDefaultConfig();
    }
  }

  /**
   * Update configuration
   */
  async updateConfig(config: Partial<DissentConfig>): Promise<DissentConfig> {
    const response = await api.put<DissentConfig>(`${this.baseUrl}/config`, config);
    return stryMutAct_9fa48("67562") ? response.data && this.getDefaultConfig() : (stryCov_9fa48("67562"), response.data ?? this.getDefaultConfig());
  }

  /**
   * Initialize demo data
   */
  async initializeDemoData(): Promise<void> {
    await api.post(`${this.baseUrl}/init-demo`, {});
  }

  // ===========================================================================
  // MOCK DATA FOR DEMO
  // ===========================================================================

  private getMockDissents(): Dissent[] {
    return stryMutAct_9fa48("67566") ? [] : (stryCov_9fa48("67566"), [stryMutAct_9fa48("67567") ? {} : (stryCov_9fa48("67567"), {
      id: 'dissent-1',
      organizationId: 'demo-org',
      decisionId: 'dec-4821',
      decisionTitle: 'Q1 Product Roadmap Approval',
      decisionDate: new Date('2024-12-08'),
      decisionOwner: 'Product Council',
      dissentType: 'ethical',
      severity: 'formal_objection',
      statement: 'The timeline for Feature X is unrealistic and sets the team up for burnout. We committed to sustainable pace in our engineering values. This decision violates that commitment.',
      isAnonymous: stryMutAct_9fa48("67577") ? true : (stryCov_9fa48("67577"), false),
      dissenterId: 'user-sarah',
      dissenterName: 'Sarah Chen',
      dissenterRole: 'Engineering Lead',
      dissenterDepartment: 'Engineering',
      status: 'pending',
      responseDeadline: new Date(stryMutAct_9fa48("67583") ? Date.now() - 48 * 60 * 60 * 1000 : (stryCov_9fa48("67583"), Date.now() + (stryMutAct_9fa48("67584") ? 48 * 60 * 60 / 1000 : (stryCov_9fa48("67584"), (stryMutAct_9fa48("67585") ? 48 * 60 / 60 : (stryCov_9fa48("67585"), (stryMutAct_9fa48("67586") ? 48 / 60 : (stryCov_9fa48("67586"), 48 * 60)) * 60)) * 1000)))),
      outcomeVerified: stryMutAct_9fa48("67587") ? true : (stryCov_9fa48("67587"), false),
      createdAt: new Date('2024-12-08T14:32:00'),
      updatedAt: new Date('2024-12-08T14:32:00'),
      ledgerHash: 'abc123',
      ledgerTimestamp: new Date('2024-12-08T14:32:00')
    }), stryMutAct_9fa48("67592") ? {} : (stryCov_9fa48("67592"), {
      id: 'dissent-2',
      organizationId: 'demo-org',
      decisionId: 'dec-4750',
      decisionTitle: 'Vendor Selection - Cloud Infrastructure',
      decisionDate: new Date('2024-11-15'),
      decisionOwner: 'CTO',
      dissentType: 'risk',
      severity: 'formal_objection',
      statement: 'Concentrating 100% of cloud spend with a single vendor creates unacceptable lock-in risk.',
      isAnonymous: stryMutAct_9fa48("67602") ? true : (stryCov_9fa48("67602"), false),
      dissenterId: 'user-james',
      dissenterName: 'James Wilson',
      dissenterRole: 'CFO',
      dissenterDepartment: 'Finance',
      status: 'accepted',
      responseDeadline: new Date('2024-11-18'),
      response: stryMutAct_9fa48("67609") ? {} : (stryCov_9fa48("67609"), {
        id: 'resp-1',
        dissentId: 'dissent-2',
        responderId: 'user-cto',
        responderName: 'Michael Torres',
        responderRole: 'CTO',
        responseType: 'accept',
        reasoning: 'Valid concern. We will maintain 20% Azure presence.',
        createdAt: new Date('2024-11-17'),
        ledgerHash: 'def456'
      }),
      outcomeVerified: stryMutAct_9fa48("67619") ? false : (stryCov_9fa48("67619"), true),
      dissenterWasRight: stryMutAct_9fa48("67620") ? false : (stryCov_9fa48("67620"), true),
      createdAt: new Date('2024-11-15'),
      updatedAt: new Date('2024-11-17'),
      ledgerHash: 'ghi789',
      ledgerTimestamp: new Date('2024-11-15')
    }), stryMutAct_9fa48("67625") ? {} : (stryCov_9fa48("67625"), {
      id: 'dissent-3',
      organizationId: 'demo-org',
      decisionId: 'dec-4680',
      decisionTitle: 'Q3 Hiring Freeze',
      decisionDate: new Date('2024-09-01'),
      decisionOwner: 'Executive Team',
      dissentType: 'strategic',
      severity: 'formal_objection',
      statement: 'A complete freeze will set us back 6 months on critical projects.',
      isAnonymous: stryMutAct_9fa48("67635") ? true : (stryCov_9fa48("67635"), false),
      dissenterId: 'user-sarah',
      dissenterName: 'Sarah Chen',
      dissenterRole: 'Engineering Lead',
      dissenterDepartment: 'Engineering',
      status: 'overruled',
      responseDeadline: new Date('2024-09-04'),
      response: stryMutAct_9fa48("67642") ? {} : (stryCov_9fa48("67642"), {
        id: 'resp-2',
        dissentId: 'dissent-3',
        responderId: 'user-ceo',
        responderName: 'Alex Rivera',
        responderRole: 'CEO',
        responseType: 'acknowledge_proceed',
        reasoning: 'Cash preservation is critical. Freeze stands but will be reviewed monthly.',
        createdAt: new Date('2024-09-03'),
        ledgerHash: 'jkl012'
      }),
      outcomeVerified: stryMutAct_9fa48("67652") ? false : (stryCov_9fa48("67652"), true),
      dissenterWasRight: stryMutAct_9fa48("67653") ? false : (stryCov_9fa48("67653"), true),
      outcomeVerifiedAt: new Date('2024-12-01'),
      createdAt: new Date('2024-09-01'),
      updatedAt: new Date('2024-09-03'),
      ledgerHash: 'mno345',
      ledgerTimestamp: new Date('2024-09-01')
    })]);
  }
  private getMockProfile(): DissenterProfile {
    return stryMutAct_9fa48("67660") ? {} : (stryCov_9fa48("67660"), {
      userId: 'user-sarah',
      userName: 'Sarah Chen',
      isAnonymous: stryMutAct_9fa48("67663") ? true : (stryCov_9fa48("67663"), false),
      totalDissents: 7,
      acknowledged: 7,
      acceptedDissents: 3,
      overruledDissents: 4,
      dissentAccuracy: 71,
      verifiedOutcomes: 7,
      correctPredictions: 5,
      isHighAccuracy: stryMutAct_9fa48("67664") ? false : (stryCov_9fa48("67664"), true),
      byType: stryMutAct_9fa48("67665") ? {} : (stryCov_9fa48("67665"), {
        ethical: 2,
        risk: 2,
        strategic: 2,
        resource: 1
      })
    });
  }
  private getMockMetrics(): OrganizationDissentMetrics {
    return stryMutAct_9fa48("67667") ? {} : (stryCov_9fa48("67667"), {
      organizationId: 'demo-org',
      totalDissents: 55,
      activeDissents: 12,
      responseRate: 100,
      avgResponseTime: 36,
      acceptanceRate: 43,
      overallAccuracy: 67,
      retaliationFlags: 0,
      healthStatus: 'healthy',
      byDepartment: stryMutAct_9fa48("67670") ? [] : (stryCov_9fa48("67670"), [stryMutAct_9fa48("67671") ? {} : (stryCov_9fa48("67671"), {
        department: 'Engineering',
        totalDissents: 23,
        acceptedRate: 39,
        accuracy: 71,
        trend: 'up'
      }), stryMutAct_9fa48("67674") ? {} : (stryCov_9fa48("67674"), {
        department: 'Sales',
        totalDissents: 8,
        acceptedRate: 25,
        accuracy: 50,
        trend: 'stable'
      }), stryMutAct_9fa48("67677") ? {} : (stryCov_9fa48("67677"), {
        department: 'Finance',
        totalDissents: 12,
        acceptedRate: 58,
        accuracy: 83,
        trend: 'up'
      }), stryMutAct_9fa48("67680") ? {} : (stryCov_9fa48("67680"), {
        department: 'Marketing',
        totalDissents: 5,
        acceptedRate: 20,
        accuracy: 40,
        trend: 'down'
      }), stryMutAct_9fa48("67683") ? {} : (stryCov_9fa48("67683"), {
        department: 'Operations',
        totalDissents: 7,
        acceptedRate: 57,
        accuracy: 57,
        trend: 'stable'
      })]),
      highAccuracyDissenters: stryMutAct_9fa48("67686") ? [] : (stryCov_9fa48("67686"), [stryMutAct_9fa48("67687") ? {} : (stryCov_9fa48("67687"), {
        userId: 'user-sarah',
        userName: 'Sarah Chen',
        isAnonymous: stryMutAct_9fa48("67690") ? true : (stryCov_9fa48("67690"), false),
        totalDissents: 7,
        acknowledged: 7,
        acceptedDissents: 3,
        overruledDissents: 4,
        dissentAccuracy: 71,
        verifiedOutcomes: 7,
        correctPredictions: 5,
        isHighAccuracy: stryMutAct_9fa48("67691") ? false : (stryCov_9fa48("67691"), true),
        byType: {}
      }), stryMutAct_9fa48("67692") ? {} : (stryCov_9fa48("67692"), {
        userId: 'user-james',
        userName: 'James Wilson',
        isAnonymous: stryMutAct_9fa48("67695") ? true : (stryCov_9fa48("67695"), false),
        totalDissents: 5,
        acknowledged: 5,
        acceptedDissents: 4,
        overruledDissents: 1,
        dissentAccuracy: 80,
        verifiedOutcomes: 5,
        correctPredictions: 4,
        isHighAccuracy: stryMutAct_9fa48("67696") ? false : (stryCov_9fa48("67696"), true),
        byType: {}
      })]),
      trend: stryMutAct_9fa48("67697") ? [] : (stryCov_9fa48("67697"), [stryMutAct_9fa48("67698") ? {} : (stryCov_9fa48("67698"), {
        date: '2024-06',
        count: 6,
        accuracy: 55
      }), stryMutAct_9fa48("67700") ? {} : (stryCov_9fa48("67700"), {
        date: '2024-07',
        count: 8,
        accuracy: 58
      }), stryMutAct_9fa48("67702") ? {} : (stryCov_9fa48("67702"), {
        date: '2024-08',
        count: 7,
        accuracy: 62
      }), stryMutAct_9fa48("67704") ? {} : (stryCov_9fa48("67704"), {
        date: '2024-09',
        count: 10,
        accuracy: 65
      }), stryMutAct_9fa48("67706") ? {} : (stryCov_9fa48("67706"), {
        date: '2024-10',
        count: 9,
        accuracy: 64
      }), stryMutAct_9fa48("67708") ? {} : (stryCov_9fa48("67708"), {
        date: '2024-11',
        count: 8,
        accuracy: 68
      }), stryMutAct_9fa48("67710") ? {} : (stryCov_9fa48("67710"), {
        date: '2024-12',
        count: 7,
        accuracy: 67
      })])
    });
  }
  private getDefaultConfig(): DissentConfig {
    return stryMutAct_9fa48("67713") ? {} : (stryCov_9fa48("67713"), {
      responseDeadline: 72,
      escalationPath: stryMutAct_9fa48("67714") ? [] : (stryCov_9fa48("67714"), ['manager', 'vp', 'board']),
      anonymousAllowed: stryMutAct_9fa48("67718") ? false : (stryCov_9fa48("67718"), true),
      retaliationMonitoringDuration: 12,
      highAccuracyThreshold: 60,
      blockingDissentAllowed: stryMutAct_9fa48("67719") ? false : (stryCov_9fa48("67719"), true),
      minimumDissentsForAccuracy: 3
    });
  }
}

// =============================================================================
// EXPORT SINGLETON
// =============================================================================

export const dissentService = new DissentService();
export default dissentService;