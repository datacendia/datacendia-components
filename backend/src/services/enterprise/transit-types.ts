export interface TravelRisk {
  location: string;
  country: string;
  region: string;
  overallRisk: 'minimal' | 'low' | 'medium' | 'high' | 'extreme';
  riskScore: number; // 0-100
  categories: RiskCategory[];
  activeAlerts: TravelAlert[];
  restrictions: string[];
  recommendations: string[];
  lastUpdated: Date;
}

export interface RiskCategory {
  category: 'political' | 'crime' | 'terrorism' | 'health' | 'natural_disaster' | 'infrastructure' | 'civil_unrest';
  level: 'low' | 'medium' | 'high' | 'extreme';
  score: number;
  details: string;
  trend: 'improving' | 'stable' | 'deteriorating';
}

export interface TravelAlert {
  id: string;
  type: 'warning' | 'advisory' | 'emergency';
  title: string;
  description: string;
  locations: string[];
  effectiveDate: Date;
  expirationDate?: Date;
  source: string;
  actions: string[];
}

export interface TravelRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  vipLevel: 'standard' | 'executive' | 'c_suite' | 'board';
  destinations: TripDestination[];
  purpose: string;
  status: 'pending' | 'approved' | 'denied' | 'in_progress' | 'completed' | 'cancelled';
  riskAssessment?: TravelRiskAssessment;
  securityPlan?: SecurityPlan;
  emergencyContacts: EmergencyContact[];
  createdAt: Date;
  approvedBy?: string;
  approvedAt?: Date;
}

export interface TripDestination {
  location: string;
  country: string;
  arrivalDate: Date;
  departureDate: Date;
  accommodation?: string;
  localContact?: string;
  meetings: string[];
}

export interface TravelRiskAssessment {
  overallRisk: 'low' | 'medium' | 'high' | 'critical';
  score: number;
  factors: RiskFactor[];
  mitigations: string[];
  approvalRequired: 'standard' | 'manager' | 'security' | 'executive';
  recommendations: string[];
  generatedAt: Date;
}

export interface RiskFactor {
  factor: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
  mitigation: string;
}

export interface SecurityPlan {
  id: string;
  travelRequestId: string;
  level: 'standard' | 'enhanced' | 'executive' | 'high_risk';
  measures: SecurityMeasure[];
  groundTransport: TransportArrangement[];
  safeLocations: SafeLocation[];
  communicationProtocol: CommunicationProtocol;
  checkInSchedule: CheckIn[];
  extractionPlan?: ExtractionPlan;
  securityPersonnel?: SecurityPersonnel[];
  createdAt: Date;
}

export interface SecurityMeasure {
  measure: string;
  category: 'physical' | 'cyber' | 'communication' | 'transport' | 'accommodation';
  mandatory: boolean;
  instructions: string;
}

export interface TransportArrangement {
  type: 'commercial' | 'private' | 'secure_vehicle' | 'armored';
  provider: string;
  details: string;
  vetted: boolean;
}

export interface SafeLocation {
  name: string;
  type: 'embassy' | 'hotel' | 'corporate_office' | 'hospital' | 'safe_house';
  address: string;
  coordinates?: { lat: number; lng: number };
  contact: string;
  notes: string;
}

export interface CommunicationProtocol {
  primaryChannel: string;
  backupChannel: string;
  encryptionRequired: boolean;
  checkInFrequency: string;
  emergencyCode: string;
  silentAlarmCode: string;
}

export interface CheckIn {
  scheduledTime: Date;
  location: string;
  method: 'app' | 'call' | 'sms' | 'satellite';
  completed: boolean;
  completedAt?: Date;
  notes?: string;
}

export interface ExtractionPlan {
  id: string;
  triggerConditions: string[];
  primaryRoute: ExtractionRoute;
  alternativeRoutes: ExtractionRoute[];
  evacuationPoints: string[];
  medicalFacilities: string[];
  status: 'standby' | 'activated' | 'executing' | 'complete';
  activatedAt?: Date;
  activatedBy?: string;
}

export interface ExtractionRoute {
  method: 'ground' | 'air' | 'sea';
  provider: string;
  estimatedTime: number; // minutes
  cost: number;
  risks: string[];
  waypoints: string[];
}

export interface SecurityPersonnel {
  id: string;
  name: string;
  role: 'driver' | 'close_protection' | 'advance_team' | 'medical';
  credentials: string[];
  contact: string;
  assignedPeriod: { start: Date; end: Date };
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
  priority: number;
}

export interface IncidentReport {
  id: string;
  travelRequestId?: string;
  employeeId: string;
  type: 'medical' | 'security' | 'theft' | 'accident' | 'natural_disaster' | 'political' | 'other';
  severity: 'minor' | 'moderate' | 'serious' | 'critical';
  location: string;
  description: string;
  immediateActions: string[];
  status: 'reported' | 'responding' | 'resolved' | 'closed';
  timeline: IncidentEvent[];
  outcome?: string;
  lessonsLearned?: string[];
  reportedAt: Date;
  resolvedAt?: Date;
}

export interface IncidentEvent {
  timestamp: Date;
  action: string;
  actor: string;
  notes?: string;
}

export interface TravelPolicy {
  id: string;
  name: string;
  destinations: { country: string; maxRiskLevel: string }[];
  approvalMatrix: { riskLevel: string; approver: string }[];
  requiredTraining: string[];
  insuranceMinimum: number;
  blacklistedLocations: string[];
  lastUpdated: Date;
}

// =============================================================================
// SERVICE
// =============================================================================

