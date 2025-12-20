/**
 * VERTICAL AI AGENTS CONFIGURATION
 * Specialized AI agents for each of 24 industry verticals
 * Each vertical has 3-5 specialized agents with distinct roles
 */

export interface VerticalAgent {
  id: string;
  name: string;
  role: string;
  description: string;
  capabilities: string[];
  specializations: string[];
  icon: string;
}

export interface VerticalAgentConfig {
  verticalId: string;
  verticalName: string;
  agents: VerticalAgent[];
}

// =============================================================================
// FINANCIAL SERVICES AGENTS
// =============================================================================
export const financialAgents: VerticalAgentConfig = {
  verticalId: 'financial',
  verticalName: 'Financial Services',
  agents: [
    {
      id: 'risk-sentinel',
      name: 'RiskSentinel',
      role: 'Chief Risk Officer AI',
      description: 'Real-time portfolio risk monitoring and hedging recommendations',
      capabilities: ['VaR calculation', 'Stress testing', 'Hedging strategies', 'Counterparty risk'],
      specializations: ['Market risk', 'Credit risk', 'Operational risk'],
      icon: '🛡️',
    },
    {
      id: 'alpha-hunter',
      name: 'AlphaHunter',
      role: 'Investment Strategy AI',
      description: 'Identifies alpha-generating opportunities across asset classes',
      capabilities: ['Pattern recognition', 'Sentiment analysis', 'Factor investing', 'Alternative data'],
      specializations: ['Equities', 'Fixed income', 'Derivatives'],
      icon: '🎯',
    },
    {
      id: 'compliance-guardian',
      name: 'ComplianceGuardian',
      role: 'Regulatory Compliance AI',
      description: 'Ensures adherence to SEC, FINRA, and global financial regulations',
      capabilities: ['Trade surveillance', 'KYC/AML', 'Regulatory reporting', 'Audit trails'],
      specializations: ['Dodd-Frank', 'MiFID II', 'Basel III'],
      icon: '⚖️',
    },
    {
      id: 'market-pulse',
      name: 'MarketPulse',
      role: 'Market Intelligence AI',
      description: 'Real-time market analysis and event-driven trading signals',
      capabilities: ['News parsing', 'Earnings analysis', 'Macro indicators', 'Volatility forecasting'],
      specializations: ['Event trading', 'Momentum', 'Mean reversion'],
      icon: '📊',
    },
  ],
};

// =============================================================================
// HEALTHCARE AGENTS
// =============================================================================
export const healthcareAgents: VerticalAgentConfig = {
  verticalId: 'healthcare',
  verticalName: 'Healthcare',
  agents: [
    {
      id: 'care-coordinator',
      name: 'CareCoordinator',
      role: 'Patient Journey Optimizer',
      description: 'Orchestrates patient care across departments and providers',
      capabilities: ['Care pathways', 'Discharge planning', 'Referral management', 'Follow-up scheduling'],
      specializations: ['Chronic disease', 'Post-acute care', 'Care transitions'],
      icon: '🩺',
    },
    {
      id: 'clinical-advisor',
      name: 'ClinicalAdvisor',
      role: 'Clinical Decision Support AI',
      description: 'Evidence-based treatment recommendations and drug interactions',
      capabilities: ['Diagnosis support', 'Treatment protocols', 'Drug interactions', 'Clinical trials'],
      specializations: ['Oncology', 'Cardiology', 'Infectious disease'],
      icon: '💊',
    },
    {
      id: 'capacity-oracle',
      name: 'CapacityOracle',
      role: 'Hospital Operations AI',
      description: 'Optimizes bed management, staffing, and resource allocation',
      capabilities: ['Bed forecasting', 'Staff scheduling', 'OR utilization', 'Equipment tracking'],
      specializations: ['ICU capacity', 'ED flow', 'Surgical services'],
      icon: '🏥',
    },
    {
      id: 'quality-sentinel',
      name: 'QualitySentinel',
      role: 'Quality & Safety AI',
      description: 'Monitors quality metrics and patient safety indicators',
      capabilities: ['HCAHPS analysis', 'Infection prevention', 'Fall risk', 'Medication errors'],
      specializations: ['CMS quality measures', 'Leapfrog', 'Joint Commission'],
      icon: '⭐',
    },
  ],
};

// =============================================================================
// MANUFACTURING AGENTS
// =============================================================================
export const manufacturingAgents: VerticalAgentConfig = {
  verticalId: 'manufacturing',
  verticalName: 'Manufacturing',
  agents: [
    {
      id: 'production-master',
      name: 'ProductionMaster',
      role: 'Production Optimization AI',
      description: 'Maximizes OEE through real-time process adjustments',
      capabilities: ['Cycle time optimization', 'Changeover reduction', 'Bottleneck detection', 'Yield improvement'],
      specializations: ['Discrete manufacturing', 'Process manufacturing', 'Assembly'],
      icon: '🏭',
    },
    {
      id: 'predict-maintain',
      name: 'PredictMaintain',
      role: 'Predictive Maintenance AI',
      description: 'Anticipates equipment failures before they occur',
      capabilities: ['Vibration analysis', 'Thermal imaging', 'Oil analysis', 'Acoustic monitoring'],
      specializations: ['Rotating equipment', 'Hydraulics', 'Electrical systems'],
      icon: '🔧',
    },
    {
      id: 'quality-vision',
      name: 'QualityVision',
      role: 'Quality Inspection AI',
      description: 'Computer vision-powered defect detection and root cause analysis',
      capabilities: ['Visual inspection', 'Dimensional analysis', 'SPC/SQC', 'Root cause analysis'],
      specializations: ['Surface defects', 'Assembly verification', 'Metrology'],
      icon: '🔍',
    },
    {
      id: 'supply-sync',
      name: 'SupplySync',
      role: 'Supply Chain AI',
      description: 'Optimizes inventory and supplier relationships',
      capabilities: ['Demand forecasting', 'Inventory optimization', 'Supplier scoring', 'Lead time prediction'],
      specializations: ['JIT', 'VMI', 'Global sourcing'],
      icon: '📦',
    },
  ],
};

// =============================================================================
// TECHNOLOGY AGENTS
// =============================================================================
export const technologyAgents: VerticalAgentConfig = {
  verticalId: 'technology',
  verticalName: 'Technology',
  agents: [
    {
      id: 'site-reliability',
      name: 'SiteReliability',
      role: 'SRE Intelligence AI',
      description: 'Ensures platform reliability through proactive monitoring',
      capabilities: ['Anomaly detection', 'Auto-scaling', 'Incident correlation', 'Chaos engineering'],
      specializations: ['Kubernetes', 'Microservices', 'Serverless'],
      icon: '🚀',
    },
    {
      id: 'security-fortress',
      name: 'SecurityFortress',
      role: 'Cybersecurity AI',
      description: 'Detects and responds to security threats in real-time',
      capabilities: ['Threat detection', 'Vulnerability scanning', 'SIEM correlation', 'Incident response'],
      specializations: ['Zero trust', 'Cloud security', 'AppSec'],
      icon: '🔒',
    },
    {
      id: 'dev-velocity',
      name: 'DevVelocity',
      role: 'Engineering Productivity AI',
      description: 'Accelerates software delivery and developer experience',
      capabilities: ['Code review', 'CI/CD optimization', 'Technical debt', 'Sprint planning'],
      specializations: ['Agile', 'DevOps', 'Platform engineering'],
      icon: '⚡',
    },
    {
      id: 'data-architect',
      name: 'DataArchitect',
      role: 'Data Platform AI',
      description: 'Designs and optimizes data infrastructure',
      capabilities: ['Schema design', 'Query optimization', 'Data lineage', 'Cost optimization'],
      specializations: ['Data lakes', 'Real-time streaming', 'ML pipelines'],
      icon: '🗄️',
    },
  ],
};

// =============================================================================
// ENERGY AGENTS
// =============================================================================
export const energyAgents: VerticalAgentConfig = {
  verticalId: 'energy',
  verticalName: 'Energy & Utilities',
  agents: [
    {
      id: 'grid-balancer',
      name: 'GridBalancer',
      role: 'Grid Optimization AI',
      description: 'Balances supply and demand across the power grid',
      capabilities: ['Load forecasting', 'Frequency regulation', 'Congestion management', 'Reserve optimization'],
      specializations: ['Transmission', 'Distribution', 'Microgrids'],
      icon: '⚡',
    },
    {
      id: 'renewable-optimizer',
      name: 'RenewableOptimizer',
      role: 'Clean Energy AI',
      description: 'Maximizes renewable energy integration and output',
      capabilities: ['Weather forecasting', 'Curtailment reduction', 'Storage dispatch', 'Carbon tracking'],
      specializations: ['Solar', 'Wind', 'Battery storage'],
      icon: '🌱',
    },
    {
      id: 'asset-guardian',
      name: 'AssetGuardian',
      role: 'Infrastructure AI',
      description: 'Monitors and maintains grid infrastructure health',
      capabilities: ['Transformer monitoring', 'Line inspection', 'Vegetation management', 'Outage prediction'],
      specializations: ['T&D assets', 'Substations', 'Smart meters'],
      icon: '🔌',
    },
    {
      id: 'demand-response',
      name: 'DemandResponse',
      role: 'Load Management AI',
      description: 'Manages demand-side resources and customer programs',
      capabilities: ['DR dispatch', 'EV charging', 'Thermostat control', 'Industrial curtailment'],
      specializations: ['Residential DR', 'C&I programs', 'Grid services'],
      icon: '📉',
    },
  ],
};

// =============================================================================
// GOVERNMENT AGENTS
// =============================================================================
export const governmentAgents: VerticalAgentConfig = {
  verticalId: 'government',
  verticalName: 'Government',
  agents: [
    {
      id: 'policy-advisor',
      name: 'PolicyAdvisor',
      role: 'Policy Analysis AI',
      description: 'Analyzes policy impacts and recommends evidence-based decisions',
      capabilities: ['Impact modeling', 'Stakeholder analysis', 'Cost-benefit analysis', 'Regulatory review'],
      specializations: ['Economic policy', 'Social policy', 'Environmental policy'],
      icon: '📜',
    },
    {
      id: 'citizen-engagement',
      name: 'CitizenEngage',
      role: 'Public Services AI',
      description: 'Optimizes citizen services and engagement',
      capabilities: ['Service routing', 'Sentiment analysis', 'Complaint resolution', 'Accessibility'],
      specializations: ['311 services', 'Permits', 'Benefits administration'],
      icon: '👥',
    },
    {
      id: 'budget-optimizer',
      name: 'BudgetOptimizer',
      role: 'Fiscal Management AI',
      description: 'Optimizes budget allocation and tracks spending efficiency',
      capabilities: ['Budget forecasting', 'Spend analysis', 'Grant management', 'Procurement optimization'],
      specializations: ['Capital planning', 'Operating budgets', 'Federal grants'],
      icon: '💰',
    },
    {
      id: 'transparency-engine',
      name: 'TransparencyEngine',
      role: 'Open Government AI',
      description: 'Ensures transparency and compliance with disclosure requirements',
      capabilities: ['FOIA processing', 'Meeting transcription', 'Document redaction', 'Open data publishing'],
      specializations: ['Records management', 'Ethics compliance', 'Public reporting'],
      icon: '👁️',
    },
    {
      id: 'infrastructure-planner',
      name: 'InfraPlanner',
      role: 'Urban Planning AI',
      description: 'Plans and optimizes public infrastructure investments',
      capabilities: ['Traffic modeling', 'Utility planning', 'Zoning analysis', 'Climate resilience'],
      specializations: ['Transportation', 'Water/sewer', 'Parks & recreation'],
      icon: '🏗️',
    },
  ],
};

// =============================================================================
// LOGISTICS AGENTS
// =============================================================================
export const logisticsAgents: VerticalAgentConfig = {
  verticalId: 'logistics',
  verticalName: 'Logistics & Supply Chain',
  agents: [
    {
      id: 'route-optimizer',
      name: 'RouteOptimizer',
      role: 'Fleet Routing AI',
      description: 'Optimizes delivery routes in real-time',
      capabilities: ['Dynamic routing', 'Traffic prediction', 'Time windows', 'Multi-stop optimization'],
      specializations: ['Last mile', 'LTL', 'Dedicated fleet'],
      icon: '🗺️',
    },
    {
      id: 'warehouse-brain',
      name: 'WarehouseBrain',
      role: 'Warehouse Operations AI',
      description: 'Optimizes warehouse layout, picking, and inventory',
      capabilities: ['Slotting optimization', 'Wave planning', 'Labor allocation', 'Inventory positioning'],
      specializations: ['E-commerce fulfillment', 'B2B distribution', 'Cold chain'],
      icon: '🏭',
    },
    {
      id: 'demand-predictor',
      name: 'DemandPredictor',
      role: 'Demand Planning AI',
      description: 'Forecasts demand and optimizes inventory levels',
      capabilities: ['Demand sensing', 'Safety stock', 'Seasonal planning', 'Promotion impact'],
      specializations: ['SKU forecasting', 'Network inventory', 'Replenishment'],
      icon: '📈',
    },
    {
      id: 'carrier-manager',
      name: 'CarrierManager',
      role: 'Transportation AI',
      description: 'Manages carrier relationships and freight optimization',
      capabilities: ['Rate benchmarking', 'Mode selection', 'Carrier scoring', 'Claims management'],
      specializations: ['Truckload', 'Intermodal', 'Parcel'],
      icon: '🚛',
    },
  ],
};

// =============================================================================
// RETAIL AGENTS
// =============================================================================
export const retailAgents: VerticalAgentConfig = {
  verticalId: 'retail',
  verticalName: 'Retail',
  agents: [
    {
      id: 'merchandising-ai',
      name: 'MerchandisingAI',
      role: 'Assortment Planning AI',
      description: 'Optimizes product assortment and placement',
      capabilities: ['Assortment optimization', 'Planogram design', 'Seasonal planning', 'Local assortment'],
      specializations: ['Apparel', 'Grocery', 'General merchandise'],
      icon: '🛍️',
    },
    {
      id: 'pricing-engine',
      name: 'PricingEngine',
      role: 'Dynamic Pricing AI',
      description: 'Real-time pricing optimization across channels',
      capabilities: ['Competitive pricing', 'Markdown optimization', 'Promotion effectiveness', 'Price elasticity'],
      specializations: ['Regular price', 'Promotional', 'Clearance'],
      icon: '💵',
    },
    {
      id: 'customer-insight',
      name: 'CustomerInsight',
      role: 'Customer Intelligence AI',
      description: 'Understands and predicts customer behavior',
      capabilities: ['Segmentation', 'CLV prediction', 'Churn prevention', 'Next best action'],
      specializations: ['Loyalty programs', 'Personalization', 'Journey mapping'],
      icon: '👤',
    },
    {
      id: 'omnichannel-sync',
      name: 'OmniSync',
      role: 'Omnichannel AI',
      description: 'Synchronizes inventory and experience across channels',
      capabilities: ['BOPIS optimization', 'Ship-from-store', 'Inventory visibility', 'Order routing'],
      specializations: ['E-commerce', 'Store operations', 'Marketplace'],
      icon: '🔄',
    },
  ],
};

// =============================================================================
// EDUCATION AGENTS
// =============================================================================
export const educationAgents: VerticalAgentConfig = {
  verticalId: 'education',
  verticalName: 'Education',
  agents: [
    {
      id: 'student-success',
      name: 'StudentSuccess',
      role: 'Student Retention AI',
      description: 'Identifies at-risk students and recommends interventions',
      capabilities: ['Early warning', 'Intervention matching', 'Progress tracking', 'Outcome prediction'],
      specializations: ['Retention', 'Completion', 'Transfer'],
      icon: '🎓',
    },
    {
      id: 'learning-advisor',
      name: 'LearningAdvisor',
      role: 'Adaptive Learning AI',
      description: 'Personalizes learning paths and content recommendations',
      capabilities: ['Learning analytics', 'Content recommendation', 'Competency mapping', 'Assessment design'],
      specializations: ['K-12', 'Higher ed', 'Professional development'],
      icon: '📚',
    },
    {
      id: 'enrollment-optimizer',
      name: 'EnrollmentOptimizer',
      role: 'Enrollment Management AI',
      description: 'Optimizes recruitment, admissions, and financial aid',
      capabilities: ['Lead scoring', 'Yield prediction', 'Net tuition optimization', 'Scholarship allocation'],
      specializations: ['Undergraduate', 'Graduate', 'Online programs'],
      icon: '📋',
    },
    {
      id: 'workforce-connector',
      name: 'WorkforceConnector',
      role: 'Career Services AI',
      description: 'Connects students with career opportunities',
      capabilities: ['Job matching', 'Skills gap analysis', 'Employer engagement', 'Outcome tracking'],
      specializations: ['Internships', 'Job placement', 'Alumni relations'],
      icon: '💼',
    },
  ],
};

// =============================================================================
// LEGAL AGENTS
// =============================================================================
export const legalAgents: VerticalAgentConfig = {
  verticalId: 'legal',
  verticalName: 'Legal Services',
  agents: [
    {
      id: 'case-strategist',
      name: 'CaseStrategist',
      role: 'Litigation Strategy AI',
      description: 'Analyzes case outcomes and recommends strategies',
      capabilities: ['Precedent analysis', 'Judge analytics', 'Settlement prediction', 'Timeline optimization'],
      specializations: ['Civil litigation', 'Criminal defense', 'Class actions'],
      icon: '⚖️',
    },
    {
      id: 'contract-analyzer',
      name: 'ContractAnalyzer',
      role: 'Contract Intelligence AI',
      description: 'Reviews and analyzes contracts for risks and obligations',
      capabilities: ['Clause extraction', 'Risk identification', 'Obligation tracking', 'Renewal alerts'],
      specializations: ['M&A', 'Commercial contracts', 'Employment'],
      icon: '📝',
    },
    {
      id: 'discovery-engine',
      name: 'DiscoveryEngine',
      role: 'E-Discovery AI',
      description: 'Accelerates document review and discovery',
      capabilities: ['Document classification', 'Privilege review', 'TAR/CAL', 'Deduplication'],
      specializations: ['Litigation hold', 'ESI processing', 'Production'],
      icon: '🔍',
    },
    {
      id: 'compliance-tracker',
      name: 'ComplianceTracker',
      role: 'Regulatory Compliance AI',
      description: 'Tracks regulatory changes and compliance obligations',
      capabilities: ['Regulatory monitoring', 'Policy mapping', 'Training tracking', 'Audit preparation'],
      specializations: ['Data privacy', 'Employment law', 'Industry regulations'],
      icon: '📋',
    },
  ],
};

// =============================================================================
// REAL ESTATE AGENTS
// =============================================================================
export const realEstateAgents: VerticalAgentConfig = {
  verticalId: 'real-estate',
  verticalName: 'Real Estate',
  agents: [
    {
      id: 'valuation-engine',
      name: 'ValuationEngine',
      role: 'Property Valuation AI',
      description: 'Automated property valuation and market analysis',
      capabilities: ['AVM modeling', 'Comp analysis', 'Cap rate forecasting', 'Market timing'],
      specializations: ['Residential', 'Commercial', 'Industrial'],
      icon: '🏠',
    },
    {
      id: 'lease-optimizer',
      name: 'LeaseOptimizer',
      role: 'Lease Management AI',
      description: 'Optimizes lease terms and tenant relationships',
      capabilities: ['Rent optimization', 'Lease abstraction', 'Renewal prediction', 'Tenant scoring'],
      specializations: ['Office', 'Retail', 'Multifamily'],
      icon: '📄',
    },
    {
      id: 'property-manager',
      name: 'PropertyManager',
      role: 'Property Operations AI',
      description: 'Manages property operations and maintenance',
      capabilities: ['Work order routing', 'Preventive maintenance', 'Vendor management', 'Tenant communication'],
      specializations: ['Facilities', 'Amenities', 'Common areas'],
      icon: '🔧',
    },
    {
      id: 'investment-analyst',
      name: 'InvestmentAnalyst',
      role: 'Real Estate Investment AI',
      description: 'Analyzes investment opportunities and portfolio performance',
      capabilities: ['DCF modeling', 'Risk assessment', 'Portfolio optimization', 'Exit strategy'],
      specializations: ['Acquisitions', 'Development', 'REIT analysis'],
      icon: '📊',
    },
  ],
};

// =============================================================================
// INSURANCE AGENTS
// =============================================================================
export const insuranceAgents: VerticalAgentConfig = {
  verticalId: 'insurance',
  verticalName: 'Insurance',
  agents: [
    {
      id: 'underwriting-ai',
      name: 'UnderwritingAI',
      role: 'Risk Assessment AI',
      description: 'Automates underwriting decisions and risk pricing',
      capabilities: ['Risk scoring', 'Premium calculation', 'Coverage recommendation', 'Decline prediction'],
      specializations: ['Property', 'Casualty', 'Life & health'],
      icon: '📋',
    },
    {
      id: 'claims-processor',
      name: 'ClaimsProcessor',
      role: 'Claims Management AI',
      description: 'Accelerates claims processing and fraud detection',
      capabilities: ['FNOL triage', 'Reserve estimation', 'Fraud detection', 'Settlement optimization'],
      specializations: ['Auto claims', 'Property claims', 'Workers comp'],
      icon: '📝',
    },
    {
      id: 'actuarial-engine',
      name: 'ActuarialEngine',
      role: 'Actuarial AI',
      description: 'Supports actuarial analysis and reserving',
      capabilities: ['Loss triangles', 'IBNR estimation', 'Rate filing', 'Catastrophe modeling'],
      specializations: ['Pricing', 'Reserving', 'Capital modeling'],
      icon: '📊',
    },
    {
      id: 'policy-advisor',
      name: 'PolicyAdvisor',
      role: 'Customer Service AI',
      description: 'Assists policyholders with coverage and service',
      capabilities: ['Coverage explanation', 'Policy changes', 'Billing inquiry', 'Renewal management'],
      specializations: ['Personal lines', 'Commercial lines', 'Group benefits'],
      icon: '🛡️',
    },
  ],
};

// =============================================================================
// EXPORT ALL AGENTS
// =============================================================================

export const VERTICAL_AGENTS: Record<string, VerticalAgentConfig> = {
  financial: financialAgents,
  healthcare: healthcareAgents,
  manufacturing: manufacturingAgents,
  technology: technologyAgents,
  energy: energyAgents,
  government: governmentAgents,
  logistics: logisticsAgents,
  retail: retailAgents,
  education: educationAgents,
  legal: legalAgents,
  'real-estate': realEstateAgents,
  insurance: insuranceAgents,
};

// Helper function to get agents for a vertical
export const getAgentsForVertical = (verticalId: string): VerticalAgent[] => {
  return VERTICAL_AGENTS[verticalId]?.agents || [];
};

// Get all unique agent capabilities across all verticals
export const getAllCapabilities = (): string[] => {
  const capabilities = new Set<string>();
  Object.values(VERTICAL_AGENTS).forEach(config => {
    config.agents.forEach(agent => {
      agent.capabilities.forEach(cap => capabilities.add(cap));
    });
  });
  return Array.from(capabilities).sort();
};
