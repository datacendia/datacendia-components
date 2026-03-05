export type GuardrailType = 
  | 'content_filter'       // Block harmful content
  | 'pii_detector'         // Detect and redact PII
  | 'bias_detector'        // Detect biased outputs
  | 'hallucination_check'  // Verify factual claims
  | 'compliance_check'     // Verify regulatory compliance
  | 'ethical_review'       // Check against ethical guidelines
  | 'scope_limiter'        // Keep responses on-topic
  | 'confidence_threshold' // Reject low-confidence outputs
  | 'toxicity_filter'      // Block toxic content
  | 'financial_accuracy'   // Verify financial calculations
  | 'legal_compliance';    // Check legal requirements

export type GuardrailSeverity = 'block' | 'warn' | 'flag' | 'log';

export interface GuardrailConfig {
  type: GuardrailType;
  enabled: boolean;
  severity: GuardrailSeverity;
  threshold?: number;
  customRules?: string[];
  allowOverride?: boolean;
  requiresApproval?: boolean;
}

export interface GuardrailResult {
  guardrailType: GuardrailType;
  passed: boolean;
  severity: GuardrailSeverity;
  score: number; // 0-100, higher = more issues
  issues: GuardrailIssue[];
  suggestions?: string[];
  processingTime: number;
}

export interface GuardrailIssue {
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  location?: { start: number; end: number };
  matchedText?: string;
  recommendation: string;
}

export interface SentryCheck {
  id: string;
  timestamp: Date;
  organizationId: string;
  userId: string;
  inputType: 'user_query' | 'agent_response' | 'decision' | 'report';
  input: string;
  output?: string;
  agentId?: string;
  modelUsed?: string;
  results: GuardrailResult[];
  overallPassed: boolean;
  overallScore: number;
  wasBlocked: boolean;
  wasModified: boolean;
  modifiedOutput?: string;
  processingTime: number;
}

export interface PIIMatch {
  type: 'email' | 'phone' | 'ssn' | 'credit_card' | 'address' | 'name' | 'dob' | 'ip_address' | 'custom';
  value: string;
  redactedValue: string;
  start: number;
  end: number;
  confidence: number;
}

export interface BiasIndicator {
  type: 'gender' | 'race' | 'age' | 'religion' | 'political' | 'socioeconomic' | 'disability';
  phrase: string;
  severity: 'low' | 'medium' | 'high';
  suggestion: string;
  context: string;
}

// =============================================================================
// CENDIA SENTRY SERVICE
// =============================================================================

