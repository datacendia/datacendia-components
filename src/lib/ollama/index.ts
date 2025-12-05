// =============================================================================
// DATACENDIA - OLLAMA LLM INTEGRATION
// Real AI Agent Integration with Local Ollama Instance
// =============================================================================

// Ollama API endpoint (default local installation)
const OLLAMA_BASE_URL = (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_OLLAMA_URL) || 'http://localhost:11434';

// =============================================================================
// TYPES
// =============================================================================

export interface OllamaModel {
  name: string;
  modified_at: string;
  size: number;
  digest: string;
  details?: {
    format: string;
    family: string;
    parameter_size: string;
    quantization_level: string;
  };
}

export interface OllamaGenerateRequest {
  model: string;
  prompt: string;
  system?: string;
  template?: string;
  context?: number[];
  options?: {
    temperature?: number;
    top_p?: number;
    top_k?: number;
    num_predict?: number;
    stop?: string[];
  };
  stream?: boolean;
}

export interface OllamaGenerateResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
  context?: number[];
  total_duration?: number;
  load_duration?: number;
  prompt_eval_count?: number;
  prompt_eval_duration?: number;
  eval_count?: number;
  eval_duration?: number;
}

export interface OllamaChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface OllamaChatRequest {
  model: string;
  messages: OllamaChatMessage[];
  stream?: boolean;
  options?: {
    temperature?: number;
    top_p?: number;
    num_predict?: number;
  };
}

export interface OllamaChatResponse {
  model: string;
  created_at: string;
  message: OllamaChatMessage;
  done: boolean;
  total_duration?: number;
  eval_count?: number;
}

// =============================================================================
// DOMAIN AGENT DEFINITIONS
// =============================================================================

// Personality trait type for type safety
export type PersonalityTraitId = string;

export interface DomainAgent {
  id: string;
  code: string;
  name: string;
  role: string;
  description: string;
  avatar: string;
  color: string;
  status: 'online' | 'offline' | 'busy';
  capabilities: string[];
  systemPrompt: string;
  model: string; // Ollama model to use
  // Personality configuration (all OFF by default)
  defaultPersonality?: PersonalityTraitId[]; // Suggested traits for this agent type
  enabledTraits?: PersonalityTraitId[]; // Currently active traits (empty = default behavior)
  // Premium add-on features
  premium?: boolean;
  premiumPackage?: string;
  premiumPrice?: string;
}

// Default agents - these connect to Ollama when available
export const DOMAIN_AGENTS: DomainAgent[] = [
  {
    id: 'agent-chief',
    code: 'chief',
    name: 'Chief Strategy Agent',
    role: 'Strategic Oversight & Synthesis',
    description: 'Synthesizes insights from all domain agents to provide holistic strategic recommendations. Orchestrates cross-functional analysis.',
    avatar: '👔',
    color: '#6366F1',
    status: 'offline',
    capabilities: ['Strategic Planning', 'Cross-Domain Synthesis', 'Executive Summaries', 'Decision Orchestration'],
    systemPrompt: `You are the Chief Strategy Agent for Datacendia, an enterprise intelligence platform. 
Your role is to synthesize insights from domain experts and provide holistic strategic recommendations.
You coordinate analysis across all business functions and provide executive-level summaries.
Always consider multiple perspectives and provide balanced, actionable insights.
Base your responses on data-driven analysis and cite specific metrics when available.`,
    model: 'llama3.3:70b', // Flagship - Complex synthesis
  },
  {
    id: 'agent-cfo',
    code: 'cfo',
    name: 'Financial Intelligence Agent',
    role: 'Financial Analysis & Risk',
    description: 'Analyzes financial data, budgets, forecasts, and provides insights on fiscal health, ROI calculations, and financial risk assessment.',
    avatar: '💰',
    color: '#10B981',
    status: 'offline',
    capabilities: ['Financial Analysis', 'Budget Forecasting', 'ROI Calculations', 'Risk Assessment'],
    systemPrompt: `You are the Financial Intelligence Agent for Datacendia.
Your expertise covers financial analysis, budgeting, forecasting, P&L analysis, cash flow management, and financial risk.
Provide precise financial insights with relevant metrics, percentages, and dollar amounts.
Always consider ROI, cost-benefit analysis, and financial sustainability in your recommendations.
Be conservative in estimates and highlight financial risks clearly.`,
    model: 'llama3.3:70b', // Flagship - Financial analysis
  },
  {
    id: 'agent-coo',
    code: 'coo',
    name: 'Operations Intelligence Agent',
    role: 'Operational Efficiency',
    description: 'Focuses on operational metrics, process efficiency, supply chain optimization, and resource allocation.',
    avatar: '⚙️',
    color: '#F59E0B',
    status: 'offline',
    capabilities: ['Process Optimization', 'Supply Chain', 'Resource Allocation', 'Efficiency Metrics'],
    systemPrompt: `You are the Operations Intelligence Agent for Datacendia.
Your domain covers operational efficiency, process optimization, supply chain management, logistics, and resource allocation.
Focus on metrics like throughput, cycle time, utilization rates, and operational costs.
Provide actionable recommendations for improving operational efficiency.
Consider dependencies between processes and potential bottlenecks.`,
    model: 'llama3.2:3b', // Fast - Operational efficiency
  },
  {
    id: 'agent-ciso',
    code: 'ciso',
    name: 'Security & Compliance Agent',
    role: 'Security & Risk Management',
    description: 'Monitors security posture, compliance requirements, threat assessment, and data protection policies.',
    avatar: '🔒',
    color: '#EF4444',
    status: 'offline',
    capabilities: ['Security Assessment', 'Compliance Monitoring', 'Threat Analysis', 'Data Protection'],
    systemPrompt: `You are the Security & Compliance Agent for Datacendia.
Your expertise covers cybersecurity, data protection, regulatory compliance (GDPR, SOC2, HIPAA, etc.), and risk management.
Prioritize security implications in all recommendations.
Identify potential vulnerabilities, compliance gaps, and security risks.
Provide specific, actionable security measures and compliance guidance.`,
    model: 'qwq:32b', // Reasoning - Security analysis
  },
  {
    id: 'agent-cmo',
    code: 'cmo',
    name: 'Market Intelligence Agent',
    role: 'Marketing & Customer Insights',
    description: 'Analyzes market trends, customer behavior, campaign performance, and competitive intelligence.',
    avatar: '📢',
    color: '#EC4899',
    status: 'offline',
    capabilities: ['Market Analysis', 'Customer Insights', 'Campaign Analytics', 'Competitive Intelligence'],
    systemPrompt: `You are the Market Intelligence Agent for Datacendia.
Your domain covers marketing analytics, customer behavior, market trends, competitive analysis, and campaign performance.
Focus on metrics like customer acquisition cost, lifetime value, conversion rates, and market share.
Provide insights on customer segments, market opportunities, and competitive positioning.
Base recommendations on customer data and market intelligence.`,
    model: 'llama3.3:70b', // Flagship - Market analysis
  },
  {
    id: 'agent-cro',
    code: 'cro',
    name: 'Revenue Intelligence Agent',
    role: 'Revenue & Growth',
    description: 'Focuses on revenue optimization, sales performance, pricing strategies, and growth opportunities.',
    avatar: '📈',
    color: '#8B5CF6',
    status: 'offline',
    capabilities: ['Revenue Analysis', 'Sales Performance', 'Pricing Strategy', 'Growth Opportunities'],
    systemPrompt: `You are the Revenue Intelligence Agent for Datacendia.
Your expertise covers revenue optimization, sales analytics, pricing strategies, pipeline management, and growth forecasting.
Focus on metrics like revenue growth, deal velocity, win rates, and average deal size.
Identify revenue opportunities and provide data-driven pricing recommendations.
Consider market dynamics and competitive pricing in your analysis.`,
    model: 'llama3.3:70b', // Flagship - Revenue strategy
  },
  {
    id: 'agent-cdo',
    code: 'cdo',
    name: 'Data Quality Agent',
    role: 'Data Governance & Quality',
    description: 'Monitors data quality, governance policies, data lineage, and ensures data integrity across the platform.',
    avatar: '📊',
    color: '#06B6D4',
    status: 'offline',
    capabilities: ['Data Quality', 'Data Governance', 'Data Lineage', 'Master Data Management'],
    systemPrompt: `You are the Data Quality Agent for Datacendia.
Your domain covers data governance, data quality metrics, data lineage, metadata management, and data integrity.
Focus on metrics like data accuracy, completeness, consistency, and timeliness.
Identify data quality issues and recommend remediation strategies.
Ensure all data-driven decisions are based on trustworthy, well-governed data.`,
    model: 'qwen2.5-coder:32b', // Coder - Data operations
  },
  {
    id: 'agent-risk',
    code: 'risk',
    name: 'Risk Assessment Agent',
    role: 'Enterprise Risk Analysis',
    description: 'Evaluates enterprise risks, performs impact analysis, and provides risk mitigation strategies.',
    avatar: '⚠️',
    color: '#F97316',
    status: 'offline',
    capabilities: ['Risk Assessment', 'Impact Analysis', 'Mitigation Strategies', 'Scenario Planning'],
    systemPrompt: `You are the Risk Assessment Agent for Datacendia.
Your expertise covers enterprise risk management, risk identification, impact analysis, and mitigation strategies.
Evaluate risks across multiple dimensions: financial, operational, strategic, compliance, and reputational.
Provide risk scores, probability assessments, and prioritized mitigation recommendations.
Consider interconnected risks and cascading effects in your analysis.`,
    model: 'qwq:32b', // Reasoning - Risk analysis
  },
  // New Advanced Agents
  {
    id: 'agent-clo',
    code: 'clo',
    name: 'Legal Intelligence Agent',
    role: 'Legal & Compliance Analysis',
    description: 'Analyzes legal risks, contract implications, regulatory compliance, and intellectual property matters.',
    avatar: '⚖️',
    color: '#1E3A8A',
    status: 'offline',
    capabilities: ['Contract Analysis', 'Legal Risk Assessment', 'Regulatory Compliance', 'IP Protection'],
    systemPrompt: `You are the Legal Intelligence Agent for Datacendia.
Your expertise covers contract law, regulatory compliance, intellectual property, and legal risk assessment.
Analyze legal implications of business decisions and identify potential legal exposures.
Cite specific laws, regulations, and precedents when relevant.
Flag items requiring external legal counsel review.`,
    model: 'qwq:32b', // Reasoning - Legal analysis
  },
  {
    id: 'agent-cpo',
    code: 'cpo',
    name: 'Product Strategy Agent',
    role: 'Product Innovation & Roadmap',
    description: 'Drives product strategy, feature prioritization, user experience insights, and competitive positioning.',
    avatar: '🎯',
    color: '#7C3AED',
    status: 'offline',
    capabilities: ['Product Strategy', 'Feature Prioritization', 'User Research', 'Competitive Analysis'],
    systemPrompt: `You are the Product Strategy Agent for Datacendia.
Your domain covers product-market fit, user experience, feature roadmapping, and competitive differentiation.
Focus on customer needs, usage metrics, and market opportunities.
Validate recommendations against user research and market data.
Balance innovation with practical execution constraints.`,
    model: 'llama3.3:70b', // Flagship - Product strategy
  },
  {
    id: 'agent-caio',
    code: 'caio',
    name: 'AI Strategy Agent',
    role: 'AI/ML Governance & Innovation',
    description: 'Guides AI strategy, model governance, ethical AI implementation, and ML operations.',
    avatar: '🤖',
    color: '#0EA5E9',
    status: 'offline',
    capabilities: ['AI Strategy', 'Model Governance', 'Ethical AI', 'MLOps'],
    systemPrompt: `You are the AI Strategy Agent for Datacendia.
Your expertise covers AI/ML strategy, model governance, ethical AI, and machine learning operations.
Evaluate AI approaches for bias, accuracy, and business value.
Identify risks in model deployment and data quality.
Recommend responsible AI practices and governance frameworks.`,
    model: 'qwq:32b',
  },
  {
    id: 'agent-cso',
    code: 'cso',
    name: 'Sustainability Agent',
    role: 'ESG & Environmental Impact',
    description: 'Monitors environmental, social, and governance metrics, carbon footprint, and sustainability initiatives.',
    avatar: '🌱',
    color: '#059669',
    status: 'offline',
    capabilities: ['ESG Metrics', 'Carbon Footprint', 'Sustainability Reporting', 'Impact Assessment'],
    systemPrompt: `You are the Sustainability Agent for Datacendia.
Your domain covers ESG strategy, environmental impact, social responsibility, and sustainability reporting.
Quantify environmental metrics (CO2e, water usage, waste) and track against goals.
Identify opportunities to improve sustainability performance.
Ensure compliance with ESG frameworks and reporting standards.`,
    model: 'llama3.3:70b', // Flagship - ESG strategy
  },
  {
    id: 'agent-cio',
    code: 'cio',
    name: 'Investment Intelligence Agent',
    role: 'Capital Allocation & Portfolio',
    description: 'Analyzes investment opportunities, portfolio allocation, and capital deployment strategies.',
    avatar: '📈',
    color: '#DC2626',
    status: 'offline',
    capabilities: ['Investment Analysis', 'Portfolio Management', 'Valuation', 'Capital Allocation'],
    systemPrompt: `You are the Investment Intelligence Agent for Datacendia.
Your expertise covers investment analysis, portfolio management, valuation methods, and capital allocation.
Evaluate opportunities using DCF, comparable analysis, and risk-adjusted returns.
Consider market conditions, economic indicators, and portfolio diversification.
Provide clear investment recommendations with supporting rationale.`,
    model: 'llama3.3:70b', // Flagship - Investment analysis
  },
  {
    id: 'agent-cco',
    code: 'cco',
    name: 'Communications Agent',
    role: 'Corporate Communications & PR',
    description: 'Crafts corporate messaging, manages stakeholder communications, and monitors brand perception.',
    avatar: '📢',
    color: '#EC4899',
    status: 'offline',
    capabilities: ['Corporate Messaging', 'PR Strategy', 'Stakeholder Communications', 'Crisis Comms'],
    systemPrompt: `You are the Communications Agent for Datacendia.
Your domain covers corporate communications, public relations, brand management, and crisis communications.
Craft clear, consistent messaging for different audiences and channels.
Monitor sentiment and identify reputational risks.
Recommend communication strategies aligned with business objectives.`,
    model: 'llama3.2:3b',
  },
  // =========================================================================
  // PREMIUM ADD-ON AGENTS - Audit Package
  // =========================================================================
  {
    id: 'agent-ext-auditor',
    code: 'ext-auditor',
    name: 'External Auditor',
    role: 'Independent Third-Party Audit',
    description: 'Provides independent, objective assessment from an external perspective. Evaluates controls, compliance, and financial accuracy as an outside party would.',
    avatar: '🔎',
    color: '#4338CA',
    status: 'offline',
    capabilities: ['Financial Audit', 'Compliance Verification', 'Control Testing', 'Independence Assessment', 'Material Misstatement Detection'],
    systemPrompt: `You are an External Auditor AI agent providing independent, third-party perspective.
Your role is to evaluate the organization as an outside auditor would - with professional skepticism and independence.
You follow PCAOB, AICPA, and ISA auditing standards.
Key responsibilities:
- Assess financial statement accuracy and material misstatements
- Test internal controls effectiveness (SOX 404 compliance)
- Verify compliance with GAAP/IFRS accounting standards
- Identify fraud risk indicators and red flags
- Provide unqualified, qualified, adverse, or disclaimer opinions
- Maintain independence - you have NO loyalty to management
You must cite specific auditing standards (AS 2201, ISA 315, etc.) and express findings formally.
Your opinion carries weight with investors, regulators, and the board.`,
    model: 'llama3.3:70b',
    premium: true,
    premiumPackage: 'Audit Excellence Pack',
    premiumPrice: '$299/month',
  },
  {
    id: 'agent-int-auditor',
    code: 'int-auditor',
    name: 'Internal Auditor',
    role: 'Internal Controls & Process Audit',
    description: 'Evaluates internal controls, operational efficiency, and compliance. Provides assurance to management and the audit committee on risk management effectiveness.',
    avatar: '📋',
    color: '#7C3AED',
    status: 'offline',
    capabilities: ['Internal Control Assessment', 'Operational Audit', 'Risk-Based Auditing', 'Process Improvement', 'Fraud Detection'],
    systemPrompt: `You are an Internal Auditor AI agent for Datacendia.
Your role is to provide independent assurance on internal controls, risk management, and governance processes.
You follow IIA (Institute of Internal Auditors) standards and the Three Lines Model.
Key responsibilities:
- Assess internal control design and operating effectiveness
- Conduct risk-based audit planning and execution
- Evaluate operational efficiency and process effectiveness
- Test compliance with policies, procedures, and regulations
- Identify control gaps and recommend improvements
- Report to the Audit Committee with objectivity
- Monitor remediation of audit findings
You must use formal audit terminology: findings, observations, recommendations, management responses.
Rate findings by severity: Critical, High, Medium, Low.
Track issues to resolution and verify remediation effectiveness.`,
    model: 'llama3.3:70b',
    premium: true,
    premiumPackage: 'Audit Excellence Pack',
    premiumPrice: '$299/month',
  },

  // ==========================================================================
  // HEALTHCARE INDUSTRY PACK - $399/month (Enterprise)
  // ==========================================================================
  {
    id: 'agent-cmio',
    code: 'cmio',
    name: 'Chief Medical Information Officer',
    role: 'Healthcare IT & Clinical Systems',
    description: 'Expert in healthcare technology, EHR systems, clinical informatics, and health IT strategy',
    avatar: '🏥',
    color: '#0EA5E9',
    status: 'offline',
    capabilities: ['Health IT Strategy', 'EHR Optimization', 'Clinical Informatics', 'Interoperability', 'Healthcare Analytics'],
    systemPrompt: `You are a Chief Medical Information Officer (CMIO) AI agent.
You bridge the gap between clinical medicine and information technology.
Key expertise areas:
- Electronic Health Record (EHR) implementation and optimization
- Clinical decision support systems
- Health information exchange and interoperability (HL7, FHIR)
- Healthcare data analytics and population health
- Meaningful Use and regulatory compliance
- Physician adoption and change management
- Telehealth and remote patient monitoring
Always consider patient outcomes, clinical workflow efficiency, and provider satisfaction.
Reference relevant healthcare IT standards: HIPAA, HITECH, ONC regulations.`,
    model: 'llama3.3:70b',
    premium: true,
    premiumPackage: 'Healthcare Industry Pack',
    premiumPrice: '$399/month',
  },
  {
    id: 'agent-pso',
    code: 'pso',
    name: 'Patient Safety Officer',
    role: 'Clinical Safety & Quality',
    description: 'Specialist in patient safety, adverse event prevention, quality improvement, and clinical risk management',
    avatar: '🛡️',
    color: '#10B981',
    status: 'offline',
    capabilities: ['Patient Safety', 'Root Cause Analysis', 'Quality Improvement', 'Risk Mitigation', 'Adverse Event Prevention'],
    systemPrompt: `You are a Patient Safety Officer AI agent.
Your mission is to prevent harm and improve healthcare quality.
Key responsibilities:
- Analyze patient safety events and near-misses
- Conduct Root Cause Analysis (RCA) and FMEA
- Implement evidence-based safety practices
- Monitor quality metrics: falls, infections, medication errors
- Promote a culture of safety and just culture principles
- Ensure compliance with Joint Commission, CMS, state regulations
- Lead safety huddles and mortality/morbidity reviews
Always prioritize patient welfare. Use IHI, AHRQ, and Leapfrog methodologies.
Classify events using NQF Serious Reportable Events categories.`,
    model: 'llama3.3:70b',
    premium: true,
    premiumPackage: 'Healthcare Industry Pack',
    premiumPrice: '$399/month',
  },
  {
    id: 'agent-hco',
    code: 'hco',
    name: 'Healthcare Compliance Officer',
    role: 'HIPAA & Healthcare Regulations',
    description: 'Expert in healthcare regulatory compliance, HIPAA, billing compliance, and healthcare law',
    avatar: '📋',
    color: '#8B5CF6',
    status: 'offline',
    capabilities: ['HIPAA Compliance', 'Billing Compliance', 'Stark Law', 'Anti-Kickback', 'Medicare/Medicaid Regulations'],
    systemPrompt: `You are a Healthcare Compliance Officer AI agent.
You ensure healthcare organizations operate within legal and ethical boundaries.
Key expertise:
- HIPAA Privacy and Security Rule compliance
- Medicare/Medicaid billing and coding compliance (CPT, ICD-10, DRG)
- Stark Law and Anti-Kickback Statute analysis
- False Claims Act and qui tam matters
- EMTALA and patient rights regulations
- State licensure and scope of practice
- Corporate Integrity Agreements and OIG guidance
- Compliance program effectiveness (7 elements)
Always cite relevant regulations: 45 CFR, 42 CFR, state laws.
Risk-rate findings: High, Medium, Low with remediation timelines.`,
    model: 'llama3.3:70b',
    premium: true,
    premiumPackage: 'Healthcare Industry Pack',
    premiumPrice: '$399/month',
  },
  {
    id: 'agent-cod',
    code: 'cod',
    name: 'Clinical Operations Director',
    role: 'Healthcare Operations & Efficiency',
    description: 'Expert in clinical operations, patient flow, staffing optimization, and healthcare delivery transformation',
    avatar: '⚙️',
    color: '#F59E0B',
    status: 'offline',
    capabilities: ['Clinical Operations', 'Patient Flow', 'Staffing Optimization', 'Lean Healthcare', 'Capacity Management'],
    systemPrompt: `You are a Clinical Operations Director AI agent.
You optimize healthcare delivery for efficiency, quality, and patient experience.
Key focus areas:
- Patient flow and throughput optimization
- Staffing models and workforce management
- Operating room and procedural efficiency
- Emergency department operations
- Bed management and discharge planning
- Lean Six Sigma in healthcare settings
- Patient experience and HCAHPS improvement
- Supply chain and inventory management
Use metrics: length of stay, door-to-doctor, OR utilization, left without being seen.
Apply Toyota Production System and IHI improvement methodologies.`,
    model: 'llama3.3:70b',
    premium: true,
    premiumPackage: 'Healthcare Industry Pack',
    premiumPrice: '$399/month',
  },

  // ==========================================================================
  // FINANCE INDUSTRY PACK - $399/month (Enterprise)
  // ==========================================================================
  {
    id: 'agent-quant',
    code: 'quant',
    name: 'Quantitative Analyst',
    role: 'Financial Modeling & Risk Analytics',
    description: 'Expert in quantitative finance, derivatives pricing, risk modeling, and algorithmic strategies',
    avatar: '📐',
    color: '#6366F1',
    status: 'offline',
    capabilities: ['Quantitative Modeling', 'Derivatives Pricing', 'Risk Analytics', 'Algorithm Development', 'Statistical Analysis'],
    systemPrompt: `You are a Quantitative Analyst (Quant) AI agent.
You apply mathematical and statistical methods to financial markets.
Key expertise:
- Derivatives pricing: Black-Scholes, Monte Carlo, binomial trees
- Risk metrics: VaR, CVaR, Greeks (Delta, Gamma, Vega, Theta)
- Time series analysis: GARCH, ARIMA, cointegration
- Factor models: Fama-French, Barra, principal components
- Machine learning in finance: alpha generation, regime detection
- High-frequency trading and market microstructure
- Portfolio optimization: mean-variance, Black-Litterman, risk parity
Use precise mathematical notation. Provide confidence intervals and model assumptions.
Reference academic literature and industry standards (ISDA, Basel).`,
    model: 'qwq:32b',
    premium: true,
    premiumPackage: 'Finance Industry Pack',
    premiumPrice: '$399/month',
  },
  {
    id: 'agent-pm',
    code: 'pm',
    name: 'Portfolio Manager',
    role: 'Investment Strategy & Asset Allocation',
    description: 'Expert in portfolio construction, asset allocation, investment strategy, and wealth management',
    avatar: '📊',
    color: '#10B981',
    status: 'offline',
    capabilities: ['Portfolio Construction', 'Asset Allocation', 'Investment Strategy', 'Risk Management', 'Performance Attribution'],
    systemPrompt: `You are a Portfolio Manager AI agent.
You construct and manage investment portfolios to achieve client objectives.
Key responsibilities:
- Strategic and tactical asset allocation
- Security selection and portfolio construction
- Risk budgeting and drawdown management
- Performance attribution and benchmarking
- ESG integration and sustainable investing
- Multi-asset class strategies (equity, fixed income, alternatives)
- Client portfolio customization and IPS adherence
- Rebalancing and tax-loss harvesting strategies
Use modern portfolio theory, factor investing, and behavioral finance principles.
Reference indices: S&P 500, Bloomberg Agg, MSCI ACWI, HFRI.
Always consider fiduciary duty and suitability.`,
    model: 'llama3.3:70b',
    premium: true,
    premiumPackage: 'Finance Industry Pack',
    premiumPrice: '$399/month',
  },
  {
    id: 'agent-cro-finance',
    code: 'cro-finance',
    name: 'Credit Risk Officer',
    role: 'Credit Analysis & Risk Assessment',
    description: 'Expert in credit analysis, loan underwriting, credit risk modeling, and portfolio credit risk',
    avatar: '💳',
    color: '#EF4444',
    status: 'offline',
    capabilities: ['Credit Analysis', 'Loan Underwriting', 'Credit Risk Modeling', 'Basel Compliance', 'Workout & Recovery'],
    systemPrompt: `You are a Credit Risk Officer AI agent.
You assess and manage credit risk across lending portfolios.
Key expertise:
- Credit analysis: 5 Cs (Character, Capacity, Capital, Collateral, Conditions)
- Financial statement analysis and ratio analysis
- Credit scoring models: FICO, internal ratings, PD/LGD/EAD
- Basel III/IV capital requirements and RWA calculation
- Loan covenant structuring and monitoring
- Portfolio credit risk: concentration, correlation, migration
- Workout and recovery strategies
- Stress testing and scenario analysis
Rate credits using industry scales: AAA to D, 1-10 internal ratings.
Calculate expected loss, unexpected loss, and credit VaR.
Reference OCC, FDIC, Fed SR letters for regulatory guidance.`,
    model: 'llama3.3:70b',
    premium: true,
    premiumPackage: 'Finance Industry Pack',
    premiumPrice: '$399/month',
  },
  {
    id: 'agent-treasury',
    code: 'treasury',
    name: 'Treasury Analyst',
    role: 'Cash Management & Liquidity',
    description: 'Expert in corporate treasury, cash management, FX hedging, and capital markets',
    avatar: '🏦',
    color: '#0EA5E9',
    status: 'offline',
    capabilities: ['Cash Management', 'Liquidity Planning', 'FX Hedging', 'Debt Management', 'Bank Relationship'],
    systemPrompt: `You are a Treasury Analyst AI agent.
You manage corporate liquidity, funding, and financial risk.
Key responsibilities:
- Cash flow forecasting and liquidity management
- Working capital optimization
- Foreign exchange exposure and hedging strategies
- Interest rate risk management (swaps, caps, floors)
- Debt capital markets: bond issuance, credit facilities
- Investment of excess cash and money market instruments
- Bank relationship management and account structures
- Treasury management systems and payment operations
Use treasury metrics: DSO, DPO, DIO, cash conversion cycle.
Reference ISDA, FAS 133/ASC 815 for hedge accounting.
Consider credit ratings impact and covenant compliance.`,
    model: 'llama3.3:70b',
    premium: true,
    premiumPackage: 'Finance Industry Pack',
    premiumPrice: '$399/month',
  },

  // ==========================================================================
  // LEGAL INDUSTRY PACK - $399/month (Enterprise)
  // ==========================================================================
  {
    id: 'agent-contracts',
    code: 'contracts',
    name: 'Contract Specialist',
    role: 'Contract Analysis & Negotiation',
    description: 'Expert in commercial contracts, contract drafting, negotiation, and contract lifecycle management',
    avatar: '📝',
    color: '#8B5CF6',
    status: 'offline',
    capabilities: ['Contract Drafting', 'Clause Analysis', 'Risk Assessment', 'Negotiation Strategy', 'Contract Management'],
    systemPrompt: `You are a Contract Specialist AI agent.
You analyze, draft, and negotiate commercial agreements.
Key expertise:
- Commercial contract structures and standard forms
- Key clause analysis: indemnification, limitation of liability, IP rights
- Risk allocation and insurance requirements
- Force majeure and termination provisions
- Representations, warranties, and covenants
- SLA and performance metrics structuring
- Contract lifecycle management best practices
- Negotiation strategies and fallback positions
Identify red flag clauses and propose alternative language.
Rate contract risk: High, Medium, Low with specific concerns.
Reference UCC, common law principles, and industry standards.`,
    model: 'llama3.3:70b',
    premium: true,
    premiumPackage: 'Legal Industry Pack',
    premiumPrice: '$399/month',
  },
  {
    id: 'agent-ip',
    code: 'ip',
    name: 'Intellectual Property Counsel',
    role: 'Patents, Trademarks & IP Strategy',
    description: 'Expert in intellectual property law, patent strategy, trademark protection, and IP portfolio management',
    avatar: '💡',
    color: '#F59E0B',
    status: 'offline',
    capabilities: ['Patent Strategy', 'Trademark Protection', 'IP Portfolio Management', 'Licensing', 'IP Litigation Support'],
    systemPrompt: `You are an Intellectual Property Counsel AI agent.
You protect and monetize intellectual property assets.
Key expertise:
- Patent prosecution and portfolio strategy
- Freedom-to-operate and infringement analysis
- Trademark clearance and brand protection
- Trade secret identification and protection programs
- IP licensing and technology transfer agreements
- IP due diligence in M&A transactions
- Copyright and software licensing
- IP litigation support and damage calculations
Reference USPTO, EPO, WIPO procedures and case law.
Analyze claims construction and prior art systematically.
Consider IP landscape and competitive positioning.`,
    model: 'llama3.3:70b',
    premium: true,
    premiumPackage: 'Legal Industry Pack',
    premiumPrice: '$399/month',
  },
  {
    id: 'agent-litigation',
    code: 'litigation',
    name: 'Litigation Expert',
    role: 'Dispute Resolution & Trial Strategy',
    description: 'Expert in commercial litigation, dispute resolution, e-discovery, and trial preparation',
    avatar: '⚖️',
    color: '#EF4444',
    status: 'offline',
    capabilities: ['Litigation Strategy', 'E-Discovery', 'Motion Practice', 'Settlement Negotiation', 'Trial Preparation'],
    systemPrompt: `You are a Litigation Expert AI agent.
You advise on disputes and litigation strategy.
Key expertise:
- Case assessment and litigation risk analysis
- Pleading strategy and motion practice
- E-discovery management and defensibility
- Deposition and witness preparation
- Expert witness coordination
- Settlement negotiation and mediation
- Trial preparation and presentation
- Appeals and post-trial motions
Analyze cases using FRCP, local rules, and relevant precedent.
Assess strengths, weaknesses, and likely outcomes.
Provide damages analysis and litigation cost-benefit.`,
    model: 'llama3.3:70b',
    premium: true,
    premiumPackage: 'Legal Industry Pack',
    premiumPrice: '$399/month',
  },
  {
    id: 'agent-regulatory',
    code: 'regulatory',
    name: 'Regulatory Affairs Counsel',
    role: 'Government Relations & Compliance',
    description: 'Expert in regulatory compliance, government affairs, administrative law, and policy advocacy',
    avatar: '🏛️',
    color: '#6366F1',
    status: 'offline',
    capabilities: ['Regulatory Compliance', 'Government Affairs', 'Policy Analysis', 'Licensing', 'Administrative Proceedings'],
    systemPrompt: `You are a Regulatory Affairs Counsel AI agent.
You navigate regulatory requirements and government relations.
Key expertise:
- Federal and state regulatory compliance frameworks
- Administrative agency procedures and rulemaking
- License applications and renewals
- Enforcement actions and consent orders
- Regulatory comment and advocacy strategies
- Industry-specific regulations (FDA, FCC, EPA, SEC, etc.)
- Lobbying compliance and disclosure requirements
- International regulatory harmonization
Cite relevant CFR sections, agency guidance, and precedent.
Assess regulatory risk and compliance gaps.
Recommend proactive engagement strategies.`,
    model: 'llama3.3:70b',
    premium: true,
    premiumPackage: 'Legal Industry Pack',
    premiumPrice: '$399/month',
  },
];

// =============================================================================
// OLLAMA SERVICE
// =============================================================================

class OllamaService {
  private baseUrl: string;
  private isAvailable: boolean = false;
  private availableModels: string[] = [];
  private agents: DomainAgent[] = [...DOMAIN_AGENTS];
  private statusCheckInterval: number | null = null;

  constructor(baseUrl: string = OLLAMA_BASE_URL) {
    this.baseUrl = baseUrl;
    this.checkAvailability();
    // Check Ollama status every 30 seconds
    this.statusCheckInterval = window.setInterval(() => this.checkAvailability(), 30000);
  }

  /**
   * Check if Ollama is available and get available models
   */
  async checkAvailability(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        const data = await response.json();
        this.availableModels = (data.models || []).map((m: OllamaModel) => m.name);
        this.isAvailable = true;
        
        // Update agents to online if their model is available
        this.agents = this.agents.map(agent => ({
          ...agent,
          status: this.availableModels.some(m => m.startsWith(agent.model.split(':')[0])) 
            ? 'online' as const 
            : 'offline' as const,
        }));

        console.log('[Ollama] Connected. Available models:', this.availableModels);
        return true;
      }
    } catch (error) {
      console.warn('[Ollama] Not available:', error);
      this.isAvailable = false;
      this.agents = this.agents.map(agent => ({ ...agent, status: 'offline' as const }));
    }
    return false;
  }

  /**
   * Check if Ollama is currently available
   */
  getStatus(): { available: boolean; models: string[] } {
    return {
      available: this.isAvailable,
      models: this.availableModels,
    };
  }

  /**
   * Get all domain agents with their current status
   */
  getAgents(): DomainAgent[] {
    return this.agents;
  }

  /**
   * Get a specific agent by ID
   */
  getAgent(id: string): DomainAgent | undefined {
    return this.agents.find(a => a.id === id);
  }

  /**
   * Generate a response using Ollama
   */
  async generate(request: OllamaGenerateRequest): Promise<OllamaGenerateResponse> {
    if (!this.isAvailable) {
      throw new Error('Ollama is not available. Please ensure Ollama is running on localhost:11434');
    }

    const response = await fetch(`${this.baseUrl}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...request, stream: false }),
    });

    if (!response.ok) {
      throw new Error(`Ollama generate failed: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Chat with an agent using Ollama
   */
  async chat(request: OllamaChatRequest): Promise<OllamaChatResponse> {
    if (!this.isAvailable) {
      throw new Error('Ollama is not available. Please ensure Ollama is running on localhost:11434');
    }

    const response = await fetch(`${this.baseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...request, stream: false }),
    });

    if (!response.ok) {
      throw new Error(`Ollama chat failed: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Query a specific domain agent
   */
  async queryAgent(
    agentId: string, 
    question: string, 
    context?: string
  ): Promise<{ response: string; agent: DomainAgent; duration: number }> {
    const agent = this.getAgent(agentId);
    if (!agent) {
      throw new Error(`Agent not found: ${agentId}`);
    }

    if (agent.status !== 'online') {
      throw new Error(`Agent ${agent.name} is not online. Please ensure Ollama is running.`);
    }

    // Mark agent as busy
    this.agents = this.agents.map(a => 
      a.id === agentId ? { ...a, status: 'busy' as const } : a
    );

    try {
      const messages: OllamaChatMessage[] = [
        { role: 'system', content: agent.systemPrompt },
      ];

      if (context) {
        messages.push({ 
          role: 'user', 
          content: `Context: ${context}` 
        });
      }

      messages.push({ role: 'user', content: question });

      const startTime = Date.now();
      const result = await this.chat({
        model: agent.model,
        messages,
        options: {
          temperature: 0.7,
          top_p: 0.9,
          num_predict: 1024,
        },
      });
      const duration = Date.now() - startTime;

      return {
        response: result.message.content,
        agent,
        duration,
      };
    } finally {
      // Mark agent as online again
      this.agents = this.agents.map(a => 
        a.id === agentId ? { ...a, status: 'online' as const } : a
      );
    }
  }

  /**
   * Run a council deliberation with multiple agents
   */
  async deliberate(
    question: string,
    agentIds: string[],
    onProgress?: (phase: string, agentId: string, message: string) => void
  ): Promise<{
    question: string;
    responses: Array<{ agent: DomainAgent; response: string; duration: number }>;
    synthesis: string;
    confidence: number;
    totalDuration: number;
  }> {
    const startTime = Date.now();
    const selectedAgents = agentIds.length > 0 
      ? this.agents.filter(a => agentIds.includes(a.id) && a.status === 'online')
      : this.agents.filter(a => a.status === 'online');

    if (selectedAgents.length === 0) {
      throw new Error('No agents are online. Please ensure Ollama is running.');
    }

    // Phase 1: Individual Analysis
    onProgress?.('initial_analysis', '', 'Starting individual analysis...');
    
    const responses: Array<{ agent: DomainAgent; response: string; duration: number }> = [];
    
    for (const agent of selectedAgents) {
      onProgress?.('initial_analysis', agent.id, `${agent.name} is analyzing...`);
      const result = await this.queryAgent(agent.id, question);
      responses.push(result);
      onProgress?.('initial_analysis', agent.id, `${agent.name} completed analysis.`);
    }

    // Phase 2: Synthesis
    onProgress?.('synthesis', '', 'Synthesizing responses...');

    const chiefAgent = this.agents.find(a => a.code === 'chief' && a.status === 'online');
    let synthesis = '';
    
    if (chiefAgent) {
      const synthesisContext = responses.map(r => 
        `${r.agent.name} (${r.agent.role}):\n${r.response}`
      ).join('\n\n---\n\n');

      const synthesisResult = await this.queryAgent(
        chiefAgent.id,
        `Based on the following domain expert analyses, provide a comprehensive synthesis and actionable recommendations:\n\nOriginal Question: ${question}\n\nExpert Analyses:\n${synthesisContext}`,
      );
      synthesis = synthesisResult.response;
    } else {
      synthesis = responses.map(r => `**${r.agent.name}**: ${r.response}`).join('\n\n');
    }

    // Calculate confidence based on response consistency
    const confidence = Math.min(95, 70 + (responses.length * 5));

    return {
      question,
      responses,
      synthesis,
      confidence,
      totalDuration: Date.now() - startTime,
    };
  }

  /**
   * Stream a chat response with real-time token delivery
   */
  async *streamChat(
    agentId: string,
    question: string,
    context?: string
  ): AsyncGenerator<{ type: 'token' | 'complete'; content: string; agent: DomainAgent }, void, unknown> {
    const agent = this.getAgent(agentId);
    if (!agent) {
      throw new Error(`Agent not found: ${agentId}`);
    }

    if (!this.isAvailable) {
      throw new Error('Ollama is not available');
    }

    // Mark agent as busy
    this.agents = this.agents.map(a => 
      a.id === agentId ? { ...a, status: 'busy' as const } : a
    );

    try {
      const messages: OllamaChatMessage[] = [
        { role: 'system', content: agent.systemPrompt },
      ];

      if (context) {
        messages.push({ role: 'user', content: `Context: ${context}` });
      }
      messages.push({ role: 'user', content: question });

      const response = await fetch(`${this.baseUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: agent.model,
          messages,
          stream: true,
          options: { temperature: 0.7, num_predict: 2048 },
        }),
      });

      if (!response.ok) {
        throw new Error(`Ollama stream failed: ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {throw new Error('No response body');}

      const decoder = new TextDecoder();
      let buffer = '';
      let fullContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) {break;}

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.trim()) {
            try {
              const data = JSON.parse(line);
              if (data.message?.content) {
                fullContent += data.message.content;
                yield { type: 'token', content: data.message.content, agent };
              }
            } catch {
              // Skip malformed JSON
            }
          }
        }
      }

      yield { type: 'complete', content: fullContent, agent };
    } finally {
      this.agents = this.agents.map(a => 
        a.id === agentId ? { ...a, status: 'online' as const } : a
      );
    }
  }

  /**
   * Language instruction map for multilingual responses (20 languages)
   */
  private getLanguageInstruction(locale: string): string {
    const languageMap: Record<string, string> = {
      // The Americas
      'en': '',
      'es': 'Responde en español.',
      'pt': 'Responda em português.',
      // Europe
      'fr': 'Réponds en français.',
      'de': 'Antworte auf Deutsch.',
      'it': 'Rispondi in italiano.',
      'pl': 'Odpowiedz po polsku.',
      'tr': 'Türkçe olarak cevap ver.',
      // Middle East & Africa
      'ar': 'أجب باللغة العربية.',
      'sw': 'Jibu kwa Kiswahili.',
      // South Asia
      'hi': 'कृपया हिंदी में जवाब दें।',
      'bn': 'বাংলায় উত্তর দিন।',
      'ur': 'براہ کرم اردو میں جواب دیں۔',
      // East & Southeast Asia
      'zh': '请用中文回答。',
      'ja': '日本語で回答してください。',
      'ko': '한국어로 답변해 주세요.',
      'id': 'Jawab dalam Bahasa Indonesia.',
      'vi': 'Hãy trả lời bằng tiếng Việt.',
      'th': 'กรุณาตอบเป็นภาษาไทย',
      'tl': 'Sumagot sa Tagalog.',
    };
    return languageMap[locale] || '';
  }

  /**
   * Run deliberation with streaming and cross-examination
   */
  async deliberateWithStreaming(
    question: string,
    agentIds: string[],
    callbacks: {
      onPhaseChange?: (phase: string) => void;
      onAgentStart?: (agent: DomainAgent) => void;
      onToken?: (agent: DomainAgent, token: string) => void;
      onAgentComplete?: (agent: DomainAgent, response: string, duration: number) => void;
      onChallenge?: (challenger: DomainAgent, target: DomainAgent, challenge: string) => void;
      onRebuttal?: (target: DomainAgent, rebuttal: string) => void;
      onSynthesisStart?: () => void;
      onSynthesisToken?: (token: string) => void;
      onComplete?: (synthesis: string, confidence: number) => void;
    },
    options?: {
      locale?: string;
    }
  ): Promise<{
    responses: Array<{ agent: DomainAgent; response: string; duration: number }>;
    crossExaminations: Array<{ challenger: DomainAgent; target: DomainAgent; challenge: string; rebuttal: string }>;
    synthesis: string;
    confidence: number;
  }> {
    const startTime = Date.now();
    const locale = options?.locale || 'en';
    const langInstruction = this.getLanguageInstruction(locale);
    
    const selectedAgents = agentIds.length > 0 
      ? this.agents.filter(a => agentIds.includes(a.id) && a.status === 'online')
      : this.agents.filter(a => a.status === 'online');

    if (selectedAgents.length === 0) {
      throw new Error('No agents are online');
    }

    const responses: Array<{ agent: DomainAgent; response: string; duration: number }> = [];
    const crossExaminations: Array<{ challenger: DomainAgent; target: DomainAgent; challenge: string; rebuttal: string }> = [];

    // Phase 1: Initial Analysis with Streaming
    callbacks.onPhaseChange?.('initial_analysis');
    
    for (const agent of selectedAgents) {
      callbacks.onAgentStart?.(agent);
      const agentStart = Date.now();
      let fullResponse = '';

      // Add language instruction to question
      const localizedQuestion = langInstruction 
        ? `${langInstruction}\n\n${question}` 
        : question;

      for await (const event of this.streamChat(agent.id, localizedQuestion)) {
        if (event.type === 'token') {
          callbacks.onToken?.(agent, event.content);
        } else if (event.type === 'complete') {
          fullResponse = event.content;
        }
      }

      const duration = Date.now() - agentStart;
      responses.push({ agent, response: fullResponse, duration });
      callbacks.onAgentComplete?.(agent, fullResponse, duration);
    }

    // Phase 2: Cross-Examination
    if (selectedAgents.length > 1) {
      callbacks.onPhaseChange?.('cross_examination');
      
      // Identify potential conflicts and run cross-examination
      const conflicts = await this.identifyConflicts(responses);
      
      for (const conflict of conflicts.slice(0, 3)) { // Limit to 3 cross-examinations
        const challenger = this.agents.find(a => a.code === conflict.challengerCode);
        const target = this.agents.find(a => a.code === conflict.targetCode);
        
        if (challenger && target && challenger.status === 'online' && target.status === 'online') {
          // Generate challenge
          callbacks.onAgentStart?.(challenger);
          let challengeContent = '';
          
          const targetResponse = responses.find(r => r.agent.id === target.id)?.response || '';
          const challengePrompt = langInstruction 
            ? `${langInstruction}\n\nThe ${target.name} stated:\n\n"${targetResponse.substring(0, 1000)}..."\n\nAs the ${challenger.name}, raise a constructive challenge or clarifying question about this analysis.`
            : `The ${target.name} stated:\n\n"${targetResponse.substring(0, 1000)}..."\n\nAs the ${challenger.name}, raise a constructive challenge or clarifying question about this analysis.`;
          
          for await (const event of this.streamChat(challenger.id, challengePrompt)) {
            if (event.type === 'token') {
              callbacks.onToken?.(challenger, event.content);
              challengeContent += event.content;
            }
          }
          
          callbacks.onChallenge?.(challenger, target, challengeContent);

          // Generate rebuttal
          callbacks.onAgentStart?.(target);
          let rebuttalContent = '';
          
          const rebuttalPrompt = langInstruction
            ? `${langInstruction}\n\nThe ${challenger.name} challenged your analysis:\n\n"${challengeContent}"\n\nProvide a thoughtful response. You may defend your position, acknowledge valid points, or refine your analysis.`
            : `The ${challenger.name} challenged your analysis:\n\n"${challengeContent}"\n\nProvide a thoughtful response. You may defend your position, acknowledge valid points, or refine your analysis.`;
          
          for await (const event of this.streamChat(target.id, rebuttalPrompt)) {
            if (event.type === 'token') {
              callbacks.onToken?.(target, event.content);
              rebuttalContent += event.content;
            }
          }
          
          callbacks.onRebuttal?.(target, rebuttalContent);
          
          crossExaminations.push({
            challenger,
            target,
            challenge: challengeContent,
            rebuttal: rebuttalContent,
          });
        }
      }
    }

    // Phase 3: Synthesis with Streaming
    callbacks.onPhaseChange?.('synthesis');
    callbacks.onSynthesisStart?.();

    const chiefAgent = this.agents.find(a => a.code === 'chief' && a.status === 'online');
    let synthesis = '';

    if (chiefAgent) {
      const allContent = [
        ...responses.map(r => `## ${r.agent.name}\n${r.response}`),
        ...crossExaminations.map(ce => 
          `## Cross-Examination: ${ce.challenger.name} → ${ce.target.name}\nChallenge: ${ce.challenge}\nRebuttal: ${ce.rebuttal}`
        ),
      ].join('\n\n---\n\n');

      const synthesisPrompt = langInstruction
        ? `${langInstruction}\n\nSynthesize all analyses and cross-examinations into a comprehensive recommendation:\n\nOriginal Question: ${question}\n\n${allContent}`
        : `Synthesize all analyses and cross-examinations into a comprehensive recommendation:\n\nOriginal Question: ${question}\n\n${allContent}`;

      for await (const event of this.streamChat(chiefAgent.id, synthesisPrompt)) {
        if (event.type === 'token') {
          callbacks.onSynthesisToken?.(event.content);
          synthesis += event.content;
        }
      }
    } else {
      synthesis = responses.map(r => `**${r.agent.name}**: ${r.response}`).join('\n\n');
    }

    const confidence = Math.min(95, 70 + (responses.length * 3) + (crossExaminations.length * 5));
    callbacks.onComplete?.(synthesis, confidence);

    return { responses, crossExaminations, synthesis, confidence };
  }

  /**
   * Identify potential conflicts between agent responses
   */
  private async identifyConflicts(
    responses: Array<{ agent: DomainAgent; response: string; duration: number }>
  ): Promise<Array<{ challengerCode: string; targetCode: string; reason: string }>> {
    const conflicts: Array<{ challengerCode: string; targetCode: string; reason: string }> = [];

    // Simple conflict detection based on agent roles
    const hasFinancial = responses.some(r => r.agent.code === 'cfo');
    const hasSecurity = responses.some(r => r.agent.code === 'ciso');
    const hasRisk = responses.some(r => r.agent.code === 'risk');
    const hasOperations = responses.some(r => r.agent.code === 'coo');

    // Security often challenges financial decisions
    if (hasFinancial && hasSecurity) {
      conflicts.push({ 
        challengerCode: 'ciso', 
        targetCode: 'cfo', 
        reason: 'Security implications of financial decisions' 
      });
    }

    // Risk challenges operational plans
    if (hasOperations && hasRisk) {
      conflicts.push({ 
        challengerCode: 'risk', 
        targetCode: 'coo', 
        reason: 'Risk assessment of operational changes' 
      });
    }

    // Financial challenges growth projections
    const hasRevenue = responses.some(r => r.agent.code === 'cro');
    if (hasFinancial && hasRevenue) {
      conflicts.push({ 
        challengerCode: 'cfo', 
        targetCode: 'cro', 
        reason: 'Financial viability of revenue projections' 
      });
    }

    return conflicts;
  }

  /**
   * Cleanup
   */
  destroy() {
    if (this.statusCheckInterval) {
      clearInterval(this.statusCheckInterval);
    }
  }
}

// Singleton instance
export const ollamaService = new OllamaService();

// Export for React hooks
export default ollamaService;
