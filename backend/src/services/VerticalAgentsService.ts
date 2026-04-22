/**
 * Service — Vertical Agents Service
 *
 * Business logic service implementing platform capabilities.
 *
 * @exports VerticalAgentsService, verticalAgentsService, VerticalAgent, VerticalAgentConfig, AgentActivity, AgentMetrics
 * @module services/VerticalAgentsService
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA PLATFORM - VERTICAL AI AGENTS SERVICE
// Industry-Specific AI Agents for 24 Verticals
// Enterprise Platinum Standard - Full Backend Integration
// =============================================================================
// MODEL OPTIMIZATION: Updated Jan 2026 for 16GB VRAM (RTX 4060 Ti)
// - deepseek-r1:32b: Chain-of-thought reasoning (fits 16GB Q4)
// - qwen3:32b: General/multilingual (fits 16GB Q4)
// - llama3.2:3b: Speed tasks (4GB)
// - qwen3-vl:30b: Vision tasks (~20GB, uses RAM overflow)
// =============================================================================

import { BaseService, ServiceConfig, ServiceHealth } from '../core/services/BaseService.js';
import { redis } from '../config/redis.js';
import { loadServiceRecords } from '../utils/servicePersistence.js';

const CACHE_TTL = 3600; // 1 hour cache for agent definitions

// =============================================================================
// TYPES
// =============================================================================

export interface VerticalAgent {
  id: string;
  name: string;
  role: string;
  description: string;
  capabilities: string[];
  specializations: string[];
  icon: string;
  status: 'active' | 'processing' | 'idle' | 'maintenance';
  model: string;
  temperature: number;
  systemPrompt: string;
}

export interface VerticalAgentConfig {
  verticalId: string;
  verticalName: string;
  agents: VerticalAgent[];
}

export interface AgentActivity {
  id: string;
  agentId: string;
  verticalId: string;
  action: string;
  result?: string;
  timestamp: Date;
  duration: number;
  success: boolean;
}

export interface AgentMetrics {
  agentId: string;
  decisionsToday: number;
  avgResponseTime: number;
  successRate: number;
  lastActive: Date;
}

// =============================================================================
// VERTICAL AGENT DEFINITIONS
// =============================================================================

const VERTICAL_AGENTS: Record<string, VerticalAgentConfig> = {
  // FINANCIAL SERVICES
  financial: {
    verticalId: 'financial',
    verticalName: 'Financial Services',
    agents: [
      {
        id: 'fin-risk-sentinel',
        name: 'RiskSentinel',
        role: 'Chief Risk Officer AI',
        description: 'Real-time portfolio risk monitoring and hedging recommendations',
        capabilities: ['VaR calculation', 'Stress testing', 'Hedging strategies', 'Counterparty risk'],
        specializations: ['Market risk', 'Credit risk', 'Operational risk'],
        icon: 'Ã°Å¸â€ºÂ¡Ã¯Â¸Â',
        status: 'active',
        model: 'deepseek-r1:32b',
        temperature: 0.3,
        systemPrompt: 'You are RiskSentinel, a Chief Risk Officer AI. Quantify all risks with probability and impact. Be conservative in estimates. Reference VaR, stress testing, and regulatory frameworks.',
      },
      {
        id: 'fin-alpha-hunter',
        name: 'AlphaHunter',
        role: 'Investment Strategy AI',
        description: 'Identifies alpha-generating opportunities across asset classes',
        capabilities: ['Pattern recognition', 'Sentiment analysis', 'Factor investing', 'Alternative data'],
        specializations: ['Equities', 'Fixed income', 'Derivatives'],
        icon: 'Ã°Å¸Å½Â¯',
        status: 'active',
        model: 'qwen3:32b',
        temperature: 0.6,
        systemPrompt: 'You are AlphaHunter, an Investment Strategy AI. Identify opportunities with clear risk/reward profiles. Use quantitative analysis and cite specific data points.',
      },
      {
        id: 'fin-compliance-guardian',
        name: 'ComplianceGuardian',
        role: 'Regulatory Compliance AI',
        description: 'Ensures adherence to SEC, FINRA, and global financial regulations',
        capabilities: ['Trade surveillance', 'KYC/AML', 'Regulatory reporting', 'Audit trails'],
        specializations: ['Dodd-Frank', 'MiFID II', 'Basel III'],
        icon: 'Ã¢Å¡â€“Ã¯Â¸Â',
        status: 'active',
        model: 'qwen3:32b',
        temperature: 0.4,
        systemPrompt: 'You are ComplianceGuardian, a Regulatory Compliance AI. Cite specific regulations. Flag potential violations. Maintain audit trails.',
      },
      {
        id: 'fin-market-pulse',
        name: 'MarketPulse',
        role: 'Market Intelligence AI',
        description: 'Real-time market analysis and event-driven trading signals',
        capabilities: ['News parsing', 'Earnings analysis', 'Macro indicators', 'Volatility forecasting'],
        specializations: ['Event trading', 'Momentum', 'Mean reversion'],
        icon: 'Ã°Å¸â€œÅ ',
        status: 'active',
        model: 'llama3.2:3b',
        temperature: 0.5,
        systemPrompt: 'You are MarketPulse, a Market Intelligence AI. Process market data in real-time. Provide actionable signals with confidence levels.',
      },
    ],
  },

  // HEALTHCARE
  healthcare: {
    verticalId: 'healthcare',
    verticalName: 'Healthcare',
    agents: [
      {
        id: 'hc-care-coordinator',
        name: 'CareCoordinator',
        role: 'Patient Journey Optimizer',
        description: 'Orchestrates patient care across departments and providers',
        capabilities: ['Care pathways', 'Discharge planning', 'Referral management', 'Follow-up scheduling'],
        specializations: ['Chronic disease', 'Post-acute care', 'Care transitions'],
        icon: 'Ã°Å¸Â©Âº',
        status: 'active',
        model: 'qwen3:32b',
        temperature: 0.5,
        systemPrompt: 'You are CareCoordinator, a Patient Journey Optimizer. Ensure continuity of care. Reference clinical protocols and HIPAA requirements.',
      },
      {
        id: 'hc-clinical-advisor',
        name: 'ClinicalAdvisor',
        role: 'Clinical Decision Support AI',
        description: 'Evidence-based treatment recommendations and drug interactions',
        capabilities: ['Diagnosis support', 'Treatment protocols', 'Drug interactions', 'Clinical trials'],
        specializations: ['Oncology', 'Cardiology', 'Infectious disease'],
        icon: 'Ã°Å¸â€™Å ',
        status: 'active',
        model: 'deepseek-r1:32b',
        temperature: 0.3,
        systemPrompt: 'You are ClinicalAdvisor, a Clinical Decision Support AI. Base recommendations on evidence. Flag contraindications. Reference clinical guidelines.',
      },
      {
        id: 'hc-capacity-oracle',
        name: 'CapacityOracle',
        role: 'Hospital Operations AI',
        description: 'Optimizes bed management, staffing, and resource allocation',
        capabilities: ['Bed forecasting', 'Staff scheduling', 'OR utilization', 'Equipment tracking'],
        specializations: ['ICU capacity', 'ED flow', 'Surgical services'],
        icon: 'Ã°Å¸ÂÂ¥',
        status: 'active',
        model: 'llama3.2:3b',
        temperature: 0.5,
        systemPrompt: 'You are CapacityOracle, a Hospital Operations AI. Optimize resource utilization. Predict demand. Recommend staffing adjustments.',
      },
      {
        id: 'hc-quality-sentinel',
        name: 'QualitySentinel',
        role: 'Quality & Safety AI',
        description: 'Monitors quality metrics and patient safety indicators',
        capabilities: ['HCAHPS analysis', 'Infection prevention', 'Fall risk', 'Medication errors'],
        specializations: ['CMS quality measures', 'Leapfrog', 'Joint Commission'],
        icon: 'Ã¢Â­Â',
        status: 'active',
        model: 'qwen3:32b',
        temperature: 0.4,
        systemPrompt: 'You are QualitySentinel, a Quality & Safety AI. Monitor safety events. Reference quality frameworks. Recommend evidence-based improvements.',
      },
    ],
  },

  // MANUFACTURING
  manufacturing: {
    verticalId: 'manufacturing',
    verticalName: 'Manufacturing',
    agents: [
      {
        id: 'mfg-production-master',
        name: 'ProductionMaster',
        role: 'Production Optimization AI',
        description: 'Maximizes OEE through real-time process adjustments',
        capabilities: ['Cycle time optimization', 'Changeover reduction', 'Bottleneck detection', 'Yield improvement'],
        specializations: ['Discrete manufacturing', 'Process manufacturing', 'Assembly'],
        icon: 'Ã°Å¸ÂÂ­',
        status: 'active',
        model: 'qwen3:32b',
        temperature: 0.4,
        systemPrompt: 'You are ProductionMaster, a Production Optimization AI. Maximize OEE. Identify bottlenecks. Recommend process improvements with ROI estimates.',
      },
      {
        id: 'mfg-predict-maintain',
        name: 'PredictMaintain',
        role: 'Predictive Maintenance AI',
        description: 'Anticipates equipment failures before they occur',
        capabilities: ['Vibration analysis', 'Thermal imaging', 'Oil analysis', 'Acoustic monitoring'],
        specializations: ['Rotating equipment', 'Hydraulics', 'Electrical systems'],
        icon: 'Ã°Å¸â€Â§',
        status: 'active',
        model: 'deepseek-r1:32b',
        temperature: 0.3,
        systemPrompt: 'You are PredictMaintain, a Predictive Maintenance AI. Analyze sensor data. Predict failures with confidence intervals. Recommend maintenance schedules.',
      },
      {
        id: 'mfg-quality-vision',
        name: 'QualityVision',
        role: 'Quality Inspection AI',
        description: 'Computer vision-powered defect detection and root cause analysis',
        capabilities: ['Visual inspection', 'Dimensional analysis', 'SPC/SQC', 'Root cause analysis'],
        specializations: ['Surface defects', 'Assembly verification', 'Metrology'],
        icon: 'Ã°Å¸â€Â',
        status: 'active',
        model: 'qwen3-vl:30b',
        temperature: 0.2,
        systemPrompt: 'You are QualityVision, a Quality Inspection AI. Detect defects with precision. Perform root cause analysis. Track quality trends.',
      },
      {
        id: 'mfg-supply-sync',
        name: 'SupplySync',
        role: 'Supply Chain AI',
        description: 'Optimizes inventory and supplier relationships',
        capabilities: ['Demand forecasting', 'Inventory optimization', 'Supplier scoring', 'Lead time prediction'],
        specializations: ['JIT', 'VMI', 'Global sourcing'],
        icon: 'Ã°Å¸â€œÂ¦',
        status: 'active',
        model: 'qwen3:32b',
        temperature: 0.5,
        systemPrompt: 'You are SupplySync, a Supply Chain AI. Optimize inventory levels. Predict disruptions. Recommend supplier strategies.',
      },
    ],
  },

  // TECHNOLOGY
  technology: {
    verticalId: 'technology',
    verticalName: 'Technology',
    agents: [
      {
        id: 'tech-site-reliability',
        name: 'SiteReliability',
        role: 'SRE Intelligence AI',
        description: 'Ensures platform reliability through proactive monitoring',
        capabilities: ['Anomaly detection', 'Auto-scaling', 'Incident correlation', 'Chaos engineering'],
        specializations: ['Kubernetes', 'Microservices', 'Serverless'],
        icon: 'Ã°Å¸Å¡â‚¬',
        status: 'active',
        model: 'qwen3-coder:30b',
        temperature: 0.3,
        systemPrompt: 'You are SiteReliability, an SRE Intelligence AI. Monitor system health. Correlate incidents. Recommend reliability improvements.',
      },
      {
        id: 'tech-security-fortress',
        name: 'SecurityFortress',
        role: 'Cybersecurity AI',
        description: 'Detects and responds to security threats in real-time',
        capabilities: ['Threat detection', 'Vulnerability scanning', 'SIEM correlation', 'Incident response'],
        specializations: ['Zero trust', 'Cloud security', 'AppSec'],
        icon: 'Ã°Å¸â€â€™',
        status: 'active',
        model: 'deepseek-r1:32b',
        temperature: 0.2,
        systemPrompt: 'You are SecurityFortress, a Cybersecurity AI. Detect threats. Assess vulnerabilities. Recommend security controls using NIST/ISO frameworks.',
      },
      {
        id: 'tech-dev-velocity',
        name: 'DevVelocity',
        role: 'Engineering Productivity AI',
        description: 'Accelerates software delivery and developer experience',
        capabilities: ['Code review', 'CI/CD optimization', 'Technical debt', 'Sprint planning'],
        specializations: ['Agile', 'DevOps', 'Platform engineering'],
        icon: 'Ã¢Å¡Â¡',
        status: 'active',
        model: 'qwen3-coder:30b',
        temperature: 0.4,
        systemPrompt: 'You are DevVelocity, an Engineering Productivity AI. Optimize development workflows. Reduce cycle time. Improve developer experience.',
      },
      {
        id: 'tech-data-architect',
        name: 'DataArchitect',
        role: 'Data Platform AI',
        description: 'Designs and optimizes data infrastructure',
        capabilities: ['Schema design', 'Query optimization', 'Data lineage', 'Cost optimization'],
        specializations: ['Data lakes', 'Real-time streaming', 'ML pipelines'],
        icon: 'Ã°Å¸â€”â€žÃ¯Â¸Â',
        status: 'active',
        model: 'qwen3-coder:30b',
        temperature: 0.3,
        systemPrompt: 'You are DataArchitect, a Data Platform AI. Design scalable data architectures. Optimize queries. Ensure data quality and lineage.',
      },
    ],
  },

  // ENERGY
  energy: {
    verticalId: 'energy',
    verticalName: 'Energy & Utilities',
    agents: [
      {
        id: 'eng-grid-balancer',
        name: 'GridBalancer',
        role: 'Grid Optimization AI',
        description: 'Balances supply and demand across the power grid',
        capabilities: ['Load forecasting', 'Frequency regulation', 'Congestion management', 'Reserve optimization'],
        specializations: ['Transmission', 'Distribution', 'Microgrids'],
        icon: 'Ã¢Å¡Â¡',
        status: 'active',
        model: 'deepseek-r1:32b',
        temperature: 0.3,
        systemPrompt: 'You are GridBalancer, a Grid Optimization AI. Balance load and generation. Predict demand. Optimize grid stability.',
      },
      {
        id: 'eng-renewable-optimizer',
        name: 'RenewableOptimizer',
        role: 'Clean Energy AI',
        description: 'Maximizes renewable energy integration and output',
        capabilities: ['Weather forecasting', 'Curtailment reduction', 'Storage dispatch', 'Carbon tracking'],
        specializations: ['Solar', 'Wind', 'Battery storage'],
        icon: 'Ã°Å¸Å’Â±',
        status: 'active',
        model: 'qwen3:32b',
        temperature: 0.4,
        systemPrompt: 'You are RenewableOptimizer, a Clean Energy AI. Maximize renewable output. Forecast weather impacts. Optimize storage dispatch.',
      },
      {
        id: 'eng-asset-guardian',
        name: 'AssetGuardian',
        role: 'Infrastructure AI',
        description: 'Monitors and maintains grid infrastructure health',
        capabilities: ['Transformer monitoring', 'Line inspection', 'Vegetation management', 'Outage prediction'],
        specializations: ['T&D assets', 'Substations', 'Smart meters'],
        icon: 'Ã°Å¸â€Å’',
        status: 'active',
        model: 'qwen3:32b',
        temperature: 0.4,
        systemPrompt: 'You are AssetGuardian, an Infrastructure AI. Monitor asset health. Predict failures. Recommend maintenance priorities.',
      },
      {
        id: 'eng-demand-response',
        name: 'DemandResponse',
        role: 'Load Management AI',
        description: 'Manages demand-side resources and customer programs',
        capabilities: ['DR dispatch', 'EV charging', 'Thermostat control', 'Industrial curtailment'],
        specializations: ['Residential DR', 'C&I programs', 'Grid services'],
        icon: 'Ã°Å¸â€œâ€°',
        status: 'active',
        model: 'llama3.2:3b',
        temperature: 0.5,
        systemPrompt: 'You are DemandResponse, a Load Management AI. Coordinate demand response. Optimize customer programs. Reduce peak load.',
      },
    ],
  },

  // GOVERNMENT
  government: {
    verticalId: 'government',
    verticalName: 'Government',
    agents: [
      {
        id: 'gov-policy-advisor',
        name: 'PolicyAdvisor',
        role: 'Policy Analysis AI',
        description: 'Analyzes policy impacts and recommends evidence-based decisions',
        capabilities: ['Impact modeling', 'Stakeholder analysis', 'Cost-benefit analysis', 'Regulatory review'],
        specializations: ['Economic policy', 'Social policy', 'Environmental policy'],
        icon: 'Ã°Å¸â€œÅ“',
        status: 'active',
        model: 'deepseek-r1:32b',
        temperature: 0.4,
        systemPrompt: 'You are PolicyAdvisor, a Policy Analysis AI. Analyze policy impacts. Provide evidence-based recommendations. Consider stakeholder perspectives.',
      },
      {
        id: 'gov-citizen-engage',
        name: 'CitizenEngage',
        role: 'Public Services AI',
        description: 'Optimizes citizen services and engagement',
        capabilities: ['Service routing', 'Sentiment analysis', 'Complaint resolution', 'Accessibility'],
        specializations: ['311 services', 'Permits', 'Benefits administration'],
        icon: 'Ã°Å¸â€˜Â¥',
        status: 'active',
        model: 'qwen3:32b',
        temperature: 0.6,
        systemPrompt: 'You are CitizenEngage, a Public Services AI. Improve citizen experience. Route services efficiently. Ensure accessibility.',
      },
      {
        id: 'gov-budget-optimizer',
        name: 'BudgetOptimizer',
        role: 'Fiscal Management AI',
        description: 'Optimizes budget allocation and tracks spending efficiency',
        capabilities: ['Budget forecasting', 'Spend analysis', 'Grant management', 'Procurement optimization'],
        specializations: ['Capital planning', 'Operating budgets', 'Federal grants'],
        icon: 'Ã°Å¸â€™Â°',
        status: 'active',
        model: 'qwen3:32b',
        temperature: 0.4,
        systemPrompt: 'You are BudgetOptimizer, a Fiscal Management AI. Optimize budget allocation. Track spending efficiency. Identify savings opportunities.',
      },
      {
        id: 'gov-transparency-engine',
        name: 'TransparencyEngine',
        role: 'Open Government AI',
        description: 'Ensures transparency and compliance with disclosure requirements',
        capabilities: ['FOIA processing', 'Meeting transcription', 'Document redaction', 'Open data publishing'],
        specializations: ['Records management', 'Ethics compliance', 'Public reporting'],
        icon: 'Ã°Å¸â€˜ÂÃ¯Â¸Â',
        status: 'active',
        model: 'qwen3:32b',
        temperature: 0.3,
        systemPrompt: 'You are TransparencyEngine, an Open Government AI. Ensure transparency. Process records requests. Maintain compliance.',
      },
      {
        id: 'gov-infra-planner',
        name: 'InfraPlanner',
        role: 'Urban Planning AI',
        description: 'Plans and optimizes public infrastructure investments',
        capabilities: ['Traffic modeling', 'Utility planning', 'Zoning analysis', 'Climate resilience'],
        specializations: ['Transportation', 'Water/sewer', 'Parks & recreation'],
        icon: 'Ã°Å¸Ââ€”Ã¯Â¸Â',
        status: 'active',
        model: 'deepseek-r1:32b',
        temperature: 0.4,
        systemPrompt: 'You are InfraPlanner, an Urban Planning AI. Plan infrastructure investments. Model traffic impacts. Ensure climate resilience.',
      },
    ],
  },

  // LOGISTICS
  logistics: {
    verticalId: 'logistics',
    verticalName: 'Logistics & Supply Chain',
    agents: [
      {
        id: 'log-route-optimizer',
        name: 'RouteOptimizer',
        role: 'Fleet Routing AI',
        description: 'Optimizes delivery routes in real-time',
        capabilities: ['Dynamic routing', 'Traffic prediction', 'Time windows', 'Multi-stop optimization'],
        specializations: ['Last mile', 'LTL', 'Dedicated fleet'],
        icon: 'Ã°Å¸â€”ÂºÃ¯Â¸Â',
        status: 'active',
        model: 'qwen3:32b',
        temperature: 0.3,
        systemPrompt: 'You are RouteOptimizer, a Fleet Routing AI. Optimize routes dynamically. Consider traffic and time windows. Minimize cost and time.',
      },
      {
        id: 'log-warehouse-brain',
        name: 'WarehouseBrain',
        role: 'Warehouse Operations AI',
        description: 'Optimizes warehouse layout, picking, and inventory',
        capabilities: ['Slotting optimization', 'Wave planning', 'Labor allocation', 'Inventory positioning'],
        specializations: ['E-commerce fulfillment', 'B2B distribution', 'Cold chain'],
        icon: 'Ã°Å¸ÂÂ­',
        status: 'active',
        model: 'qwen3:32b',
        temperature: 0.4,
        systemPrompt: 'You are WarehouseBrain, a Warehouse Operations AI. Optimize warehouse operations. Improve pick efficiency. Reduce fulfillment time.',
      },
      {
        id: 'log-demand-predictor',
        name: 'DemandPredictor',
        role: 'Demand Planning AI',
        description: 'Forecasts demand and optimizes inventory levels',
        capabilities: ['Demand sensing', 'Safety stock', 'Seasonal planning', 'Promotion impact'],
        specializations: ['SKU forecasting', 'Network inventory', 'Replenishment'],
        icon: 'Ã°Å¸â€œË†',
        status: 'active',
        model: 'deepseek-r1:32b',
        temperature: 0.3,
        systemPrompt: 'You are DemandPredictor, a Demand Planning AI. Forecast demand accurately. Optimize inventory levels. Consider seasonality and promotions.',
      },
      {
        id: 'log-carrier-manager',
        name: 'CarrierManager',
        role: 'Transportation AI',
        description: 'Manages carrier relationships and freight optimization',
        capabilities: ['Rate benchmarking', 'Mode selection', 'Carrier scoring', 'Claims management'],
        specializations: ['Truckload', 'Intermodal', 'Parcel'],
        icon: 'Ã°Å¸Å¡â€º',
        status: 'active',
        model: 'qwen3:32b',
        temperature: 0.5,
        systemPrompt: 'You are CarrierManager, a Transportation AI. Optimize carrier selection. Benchmark rates. Manage freight costs.',
      },
    ],
  },

  // RETAIL
  retail: {
    verticalId: 'retail',
    verticalName: 'Retail',
    agents: [
      {
        id: 'ret-merchandising-ai',
        name: 'MerchandisingAI',
        role: 'Assortment Planning AI',
        description: 'Optimizes product assortment and placement',
        capabilities: ['Assortment optimization', 'Planogram design', 'Seasonal planning', 'Local assortment'],
        specializations: ['Apparel', 'Grocery', 'General merchandise'],
        icon: 'Ã°Å¸â€ºÂÃ¯Â¸Â',
        status: 'active',
        model: 'qwen3:32b',
        temperature: 0.5,
        systemPrompt: 'You are MerchandisingAI, an Assortment Planning AI. Optimize product mix. Design effective planograms. Maximize sales per square foot.',
      },
      {
        id: 'ret-pricing-engine',
        name: 'PricingEngine',
        role: 'Dynamic Pricing AI',
        description: 'Real-time pricing optimization across channels',
        capabilities: ['Competitive pricing', 'Markdown optimization', 'Promotion effectiveness', 'Price elasticity'],
        specializations: ['Regular price', 'Promotional', 'Clearance'],
        icon: 'Ã°Å¸â€™Âµ',
        status: 'active',
        model: 'deepseek-r1:32b',
        temperature: 0.3,
        systemPrompt: 'You are PricingEngine, a Dynamic Pricing AI. Optimize prices dynamically. Consider elasticity and competition. Maximize margin.',
      },
      {
        id: 'ret-customer-insight',
        name: 'CustomerInsight',
        role: 'Customer Intelligence AI',
        description: 'Understands and predicts customer behavior',
        capabilities: ['Segmentation', 'CLV prediction', 'Churn prevention', 'Next best action'],
        specializations: ['Loyalty programs', 'Personalization', 'Journey mapping'],
        icon: 'Ã°Å¸â€˜Â¤',
        status: 'active',
        model: 'qwen3:32b',
        temperature: 0.5,
        systemPrompt: 'You are CustomerInsight, a Customer Intelligence AI. Understand customer behavior. Predict churn. Recommend personalization strategies.',
      },
      {
        id: 'ret-omni-sync',
        name: 'OmniSync',
        role: 'Omnichannel AI',
        description: 'Synchronizes inventory and experience across channels',
        capabilities: ['BOPIS optimization', 'Ship-from-store', 'Inventory visibility', 'Order routing'],
        specializations: ['E-commerce', 'Store operations', 'Marketplace'],
        icon: 'Ã°Å¸â€â€ž',
        status: 'active',
        model: 'llama3.2:3b',
        temperature: 0.4,
        systemPrompt: 'You are OmniSync, an Omnichannel AI. Synchronize channels. Optimize fulfillment. Ensure inventory visibility.',
      },
    ],
  },

  // EDUCATION
  education: {
    verticalId: 'education',
    verticalName: 'Education',
    agents: [
      {
        id: 'edu-student-success',
        name: 'StudentSuccess',
        role: 'Student Retention AI',
        description: 'Identifies at-risk students and recommends interventions',
        capabilities: ['Early warning', 'Intervention matching', 'Progress tracking', 'Outcome prediction'],
        specializations: ['Retention', 'Completion', 'Transfer'],
        icon: 'Ã°Å¸Å½â€œ',
        status: 'active',
        model: 'qwen3:32b',
        temperature: 0.5,
        systemPrompt: 'You are StudentSuccess, a Student Retention AI. Identify at-risk students early. Recommend targeted interventions. Track outcomes.',
      },
      {
        id: 'edu-learning-advisor',
        name: 'LearningAdvisor',
        role: 'Adaptive Learning AI',
        description: 'Personalizes learning paths and content recommendations',
        capabilities: ['Learning analytics', 'Content recommendation', 'Competency mapping', 'Assessment design'],
        specializations: ['K-12', 'Higher ed', 'Professional development'],
        icon: 'Ã°Å¸â€œÅ¡',
        status: 'active',
        model: 'qwen3:32b',
        temperature: 0.6,
        systemPrompt: 'You are LearningAdvisor, an Adaptive Learning AI. Personalize learning paths. Recommend content. Assess competency gaps.',
      },
      {
        id: 'edu-enrollment-optimizer',
        name: 'EnrollmentOptimizer',
        role: 'Enrollment Management AI',
        description: 'Optimizes recruitment, admissions, and financial aid',
        capabilities: ['Lead scoring', 'Yield prediction', 'Net tuition optimization', 'Scholarship allocation'],
        specializations: ['Undergraduate', 'Graduate', 'Online programs'],
        icon: 'Ã°Å¸â€œâ€¹',
        status: 'active',
        model: 'deepseek-r1:32b',
        temperature: 0.4,
        systemPrompt: 'You are EnrollmentOptimizer, an Enrollment Management AI. Optimize recruitment funnel. Predict yield. Allocate scholarships strategically.',
      },
      {
        id: 'edu-workforce-connector',
        name: 'WorkforceConnector',
        role: 'Career Services AI',
        description: 'Connects students with career opportunities',
        capabilities: ['Job matching', 'Skills gap analysis', 'Employer engagement', 'Outcome tracking'],
        specializations: ['Internships', 'Job placement', 'Alumni relations'],
        icon: 'Ã°Å¸â€™Â¼',
        status: 'active',
        model: 'qwen3:32b',
        temperature: 0.5,
        systemPrompt: 'You are WorkforceConnector, a Career Services AI. Match students to opportunities. Analyze skills gaps. Track placement outcomes.',
      },
    ],
  },

  // LEGAL
  legal: {
    verticalId: 'legal',
    verticalName: 'Legal Services',
    agents: [
      {
        id: 'leg-case-strategist',
        name: 'CaseStrategist',
        role: 'Litigation Strategy AI',
        description: 'Analyzes case outcomes and recommends strategies',
        capabilities: ['Precedent analysis', 'Judge analytics', 'Settlement prediction', 'Timeline optimization'],
        specializations: ['Civil litigation', 'Criminal defense', 'Class actions'],
        icon: 'Ã¢Å¡â€“Ã¯Â¸Â',
        status: 'active',
        model: 'deepseek-r1:32b',
        temperature: 0.4,
        systemPrompt: 'You are CaseStrategist, a Litigation Strategy AI. Analyze precedents. Predict outcomes. Recommend optimal strategies.',
      },
      {
        id: 'leg-contract-analyzer',
        name: 'ContractAnalyzer',
        role: 'Contract Intelligence AI',
        description: 'Reviews and analyzes contracts for risks and obligations',
        capabilities: ['Clause extraction', 'Risk identification', 'Obligation tracking', 'Renewal alerts'],
        specializations: ['M&A', 'Commercial contracts', 'Employment'],
        icon: 'Ã°Å¸â€œÂ',
        status: 'active',
        model: 'qwen3:32b',
        temperature: 0.3,
        systemPrompt: 'You are ContractAnalyzer, a Contract Intelligence AI. Extract key clauses. Identify risks. Track obligations and deadlines.',
      },
      {
        id: 'leg-discovery-engine',
        name: 'DiscoveryEngine',
        role: 'E-Discovery AI',
        description: 'Accelerates document review and discovery',
        capabilities: ['Document classification', 'Privilege review', 'TAR/CAL', 'Deduplication'],
        specializations: ['Litigation hold', 'ESI processing', 'Production'],
        icon: 'Ã°Å¸â€Â',
        status: 'active',
        model: 'qwen3:32b',
        temperature: 0.2,
        systemPrompt: 'You are DiscoveryEngine, an E-Discovery AI. Classify documents efficiently. Identify privilege. Accelerate review.',
      },
      {
        id: 'leg-compliance-tracker',
        name: 'ComplianceTracker',
        role: 'Regulatory Compliance AI',
        description: 'Tracks regulatory changes and compliance obligations',
        capabilities: ['Regulatory monitoring', 'Policy mapping', 'Training tracking', 'Audit preparation'],
        specializations: ['Data privacy', 'Employment law', 'Industry regulations'],
        icon: 'Ã°Å¸â€œâ€¹',
        status: 'active',
        model: 'qwen3:32b',
        temperature: 0.4,
        systemPrompt: 'You are ComplianceTracker, a Regulatory Compliance AI. Monitor regulatory changes. Track compliance obligations. Prepare for audits.',
      },
    ],
  },

  // REAL ESTATE
  'real-estate': {
    verticalId: 'real-estate',
    verticalName: 'Real Estate',
    agents: [
      {
        id: 're-valuation-engine',
        name: 'ValuationEngine',
        role: 'Property Valuation AI',
        description: 'Automated property valuation and market analysis',
        capabilities: ['AVM modeling', 'Comp analysis', 'Cap rate forecasting', 'Market timing'],
        specializations: ['Residential', 'Commercial', 'Industrial'],
        icon: 'Ã°Å¸ÂÂ ',
        status: 'active',
        model: 'deepseek-r1:32b',
        temperature: 0.3,
        systemPrompt: 'You are ValuationEngine, a Property Valuation AI. Value properties accurately. Analyze comparables. Forecast market trends.',
      },
      {
        id: 're-lease-optimizer',
        name: 'LeaseOptimizer',
        role: 'Lease Management AI',
        description: 'Optimizes lease terms and tenant relationships',
        capabilities: ['Rent optimization', 'Lease abstraction', 'Renewal prediction', 'Tenant scoring'],
        specializations: ['Office', 'Retail', 'Multifamily'],
        icon: 'Ã°Å¸â€œâ€ž',
        status: 'active',
        model: 'qwen3:32b',
        temperature: 0.4,
        systemPrompt: 'You are LeaseOptimizer, a Lease Management AI. Optimize rent. Abstract lease terms. Predict renewal likelihood.',
      },
      {
        id: 're-property-manager',
        name: 'PropertyManager',
        role: 'Property Operations AI',
        description: 'Manages property operations and maintenance',
        capabilities: ['Work order routing', 'Preventive maintenance', 'Vendor management', 'Tenant communication'],
        specializations: ['Facilities', 'Amenities', 'Common areas'],
        icon: 'Ã°Å¸â€Â§',
        status: 'active',
        model: 'llama3.2:3b',
        temperature: 0.5,
        systemPrompt: 'You are PropertyManager, a Property Operations AI. Manage work orders. Schedule maintenance. Communicate with tenants.',
      },
      {
        id: 're-investment-analyst',
        name: 'InvestmentAnalyst',
        role: 'Real Estate Investment AI',
        description: 'Analyzes investment opportunities and portfolio performance',
        capabilities: ['DCF modeling', 'Risk assessment', 'Portfolio optimization', 'Exit strategy'],
        specializations: ['Acquisitions', 'Development', 'REIT analysis'],
        icon: 'Ã°Å¸â€œÅ ',
        status: 'active',
        model: 'deepseek-r1:32b',
        temperature: 0.4,
        systemPrompt: 'You are InvestmentAnalyst, a Real Estate Investment AI. Model DCF. Assess risks. Optimize portfolio allocation.',
      },
    ],
  },

  // INSURANCE
  insurance: {
    verticalId: 'insurance',
    verticalName: 'Insurance',
    agents: [
      {
        id: 'ins-underwriting-ai',
        name: 'UnderwritingAI',
        role: 'Risk Assessment AI',
        description: 'Automates underwriting decisions and risk pricing',
        capabilities: ['Risk scoring', 'Premium calculation', 'Coverage recommendation', 'Decline prediction'],
        specializations: ['Property', 'Casualty', 'Life & health'],
        icon: 'Ã°Å¸â€œâ€¹',
        status: 'active',
        model: 'deepseek-r1:32b',
        temperature: 0.3,
        systemPrompt: 'You are UnderwritingAI, a Risk Assessment AI. Score risks accurately. Calculate premiums. Recommend appropriate coverage.',
      },
      {
        id: 'ins-claims-processor',
        name: 'ClaimsProcessor',
        role: 'Claims Management AI',
        description: 'Accelerates claims processing and fraud detection',
        capabilities: ['FNOL triage', 'Reserve estimation', 'Fraud detection', 'Settlement optimization'],
        specializations: ['Auto claims', 'Property claims', 'Workers comp'],
        icon: 'Ã°Å¸â€œÂ',
        status: 'active',
        model: 'qwen3:32b',
        temperature: 0.4,
        systemPrompt: 'You are ClaimsProcessor, a Claims Management AI. Triage claims efficiently. Estimate reserves. Detect potential fraud.',
      },
      {
        id: 'ins-fraud-detector',
        name: 'FraudDetector',
        role: 'Fraud Detection AI',
        description: 'Identifies fraudulent claims and suspicious patterns',
        capabilities: ['Anomaly detection', 'Network analysis', 'Behavioral scoring', 'SIU referral'],
        specializations: ['Organized fraud', 'Opportunistic fraud', 'Provider fraud'],
        icon: 'Ã°Å¸Å¡Â¨',
        status: 'active',
        model: 'deepseek-r1:32b',
        temperature: 0.2,
        systemPrompt: 'You are FraudDetector, a Fraud Detection AI. Identify suspicious patterns. Score fraud likelihood. Recommend SIU investigation.',
      },
      {
        id: 'ins-actuarial-engine',
        name: 'ActuarialEngine',
        role: 'Actuarial AI',
        description: 'Supports actuarial analysis and reserving',
        capabilities: ['Loss triangles', 'IBNR estimation', 'Rate filing', 'Catastrophe modeling'],
        specializations: ['Pricing', 'Reserving', 'Capital modeling'],
        icon: 'Ã°Å¸â€œÅ ',
        status: 'active',
        model: 'deepseek-r1:32b',
        temperature: 0.2,
        systemPrompt: 'You are ActuarialEngine, an Actuarial AI. Develop loss triangles. Estimate IBNR. Support rate filings with analysis.',
      },
    ],
  },

  // INDUSTRIAL SERVICES
  'industrial-services': {
    verticalId: 'industrial-services',
    verticalName: 'Industrial Services',
    agents: [
      {
        id: 'ind-safety-sentinel',
        name: 'SafetySentinel',
        role: 'Chief Safety Officer AI',
        description: 'Enforces OSHA, ISO 45001, and SUNAFIL safety compliance across all operations',
        capabilities: ['Hazard identification (IPERC)', 'Risk assessment matrices', 'Permit-to-work evaluation', 'Incident investigation'],
        specializations: ['OSHA 29 CFR 1926', 'ISO 45001:2018', 'SUNAFIL DS 005-2012-TR'],
        icon: 'Ã°Å¸Â¦Âº',
        status: 'active',
        model: 'deepseek-r1:32b',
        temperature: 0.2,
        systemPrompt: 'You are SafetySentinel, the Chief Safety Officer AI. Your #1 priority is worker safety. Enforce OSHA, ISO 45001, and SUNAFIL. Hard-stop on extreme residual risk.',
      },
      {
        id: 'ind-project-evaluator',
        name: 'ProjectEvaluator',
        role: 'Project Director AI',
        description: 'Evaluates project bids, resource capacity, schedule feasibility, and historical performance',
        capabilities: ['Bid/no-bid analysis', 'Resource capacity planning', 'Schedule risk assessment', 'Historical benchmarking'],
        specializations: ['Industrial maintenance', 'Piping & fabrication', 'Boiler repair', 'Turnaround projects'],
        icon: 'Ã°Å¸â€œâ€¹',
        status: 'active',
        model: 'qwen3:32b',
        temperature: 0.4,
        systemPrompt: 'You are ProjectEvaluator, the Project Director AI. Evaluate opportunities with data-driven analysis. Assess capacity, schedule, and historical performance.',
      },
      {
        id: 'ind-finance-controller',
        name: 'FinanceController',
        role: 'Finance Controller AI',
        description: 'Analyzes costs, margins, ROI, cash flow impacts, and financial viability',
        capabilities: ['Cost estimation', 'Margin analysis', 'TCO calculation', 'ROI projection'],
        specializations: ['Project costing', 'Equipment valuation', 'Contract financial terms', 'Currency risk (PEN/USD)'],
        icon: 'Ã°Å¸â€™Â°',
        status: 'active',
        model: 'deepseek-r1:32b',
        temperature: 0.3,
        systemPrompt: 'You are FinanceController, the Finance Controller AI. Analyze every decision through a financial lens. Flag margins below 8% and decisions exceeding 30% of capital budget.',
      },
      {
        id: 'ind-procurement-analyst',
        name: 'ProcurementAnalyst',
        role: 'Procurement & Vendor AI',
        description: 'Evaluates subcontractors, vendors, and supply chain risks using multi-criteria scoring',
        capabilities: ['Vendor scoring', 'Subcontractor qualification', 'Insurance verification', 'Price benchmarking'],
        specializations: ['Subcontractor management', 'Equipment procurement', 'Materials sourcing'],
        icon: 'Ã°Å¸â€â€”',
        status: 'active',
        model: 'qwen3:32b',
        temperature: 0.4,
        systemPrompt: 'You are ProcurementAnalyst, the Procurement & Vendor AI. Evaluate vendors with weighted multi-criteria scoring. Verify insurance and safety records.',
      },
      {
        id: 'ind-legal-advisor',
        name: 'LegalAdvisor',
        role: 'Legal & Contract AI',
        description: 'Reviews contract terms, assesses legal risks, and ensures regulatory compliance',
        capabilities: ['Contract clause analysis', 'Liability assessment', 'Force majeure evaluation', 'Multi-jurisdiction analysis'],
        specializations: ['Construction contracts', 'Service agreements', 'Peruvian labor law', 'FIDIC contracts'],
        icon: 'Ã¢Å¡â€“Ã¯Â¸Â',
        status: 'active',
        model: 'qwen3:32b',
        temperature: 0.3,
        systemPrompt: 'You are LegalAdvisor, the Legal & Contract AI. Review contracts for risk exposure. Flag unfavorable terms. Assess financial exposure.',
      },
      {
        id: 'ind-quality-inspector',
        name: 'QualityInspector',
        role: 'Quality & Standards AI',
        description: 'Ensures ISO 9001, ASME, and AWS compliance for welding and fabrication',
        capabilities: ['ISO 9001 verification', 'Welding procedure review', 'NDE requirements', 'Quality plan development'],
        specializations: ['ASME BPVC', 'AWS D1.1', 'ASME IX', 'NDE methods'],
        icon: 'Ã°Å¸â€Â',
        status: 'active',
        model: 'qwen3:32b',
        temperature: 0.3,
        systemPrompt: 'You are QualityInspector, the Quality & Standards AI. Verify ISO 9001 compliance. Review welding procedures against ASME IX and AWS D1.1.',
      },
      {
        id: 'ind-environmental-officer',
        name: 'EnvironmentalOfficer',
        role: 'Environmental Compliance AI',
        description: 'Assesses environmental impacts and ensures ISO 14001 compliance',
        capabilities: ['Environmental impact assessment', 'ISO 14001 compliance', 'Waste management', 'Emissions monitoring'],
        specializations: ['Mining site environmental rules', 'Peru environmental law (MINAM)', 'Hazardous waste'],
        icon: 'Ã°Å¸Å’Â¿',
        status: 'active',
        model: 'llama3.2:3b',
        temperature: 0.4,
        systemPrompt: 'You are EnvironmentalOfficer, the Environmental Compliance AI. Assess environmental impacts. Ensure ISO 14001 compliance.',
      },
    ],
  },
};

// =============================================================================
// VERTICAL AGENTS SERVICE
// =============================================================================

export class VerticalAgentsService extends BaseService {
  private activityLog: AgentActivity[] = [];
  private metricsCache: Map<string, AgentMetrics> = new Map();

  constructor(config?: Partial<ServiceConfig>) {
    super({
      name: 'vertical-agents-service',
      version: '1.0.0',
      dependencies: [],
      ...config,
    });


    this.loadFromDB().catch(() => {});
  }

  async initialize(): Promise<void> {
    this.logger.info('Vertical Agents Service initializing...');
    // Initialize metrics for all agents
    for (const config of Object.values(VERTICAL_AGENTS)) {
      for (const agent of config.agents) {
        this.metricsCache.set(agent.id, {
          agentId: agent.id,
          decisionsToday: 0,
          avgResponseTime: 0,
          successRate: 0,
          lastActive: new Date(),
        });
      }
    }
    this.logger.info(`Initialized ${this.metricsCache.size} vertical agents`);
  }

  async shutdown(): Promise<void> {
    this.logger.info('Vertical Agents Service shutting down...');
    this.activityLog = [];
    this.metricsCache.clear();
  }

  async healthCheck(): Promise<ServiceHealth> {
    const totalAgents = Object.values(VERTICAL_AGENTS).reduce(
      (sum, config) => sum + config.agents.length,
      0
    );
    return {
      status: 'healthy',
      lastCheck: new Date(),
      details: {
        totalVerticals: Object.keys(VERTICAL_AGENTS).length,
        totalAgents,
        activityLogSize: this.activityLog.length,
      },
    };
  }

  // ===========================================================================
  // AGENT QUERIES
  // ===========================================================================

  async getAllVerticals(): Promise<string[]> {
    return Object.keys(VERTICAL_AGENTS);
  }

  async getVerticalConfig(verticalId: string): Promise<VerticalAgentConfig | null> {
    return VERTICAL_AGENTS[verticalId] || null;
  }

  async getAgentsForVertical(verticalId: string): Promise<VerticalAgent[]> {
    const cacheKey = `vertical-agents:${verticalId}`;
    
    try {
      const cached = await redis.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (err) {
      // Redis unavailable, continue without cache
    }
    
    const config = VERTICAL_AGENTS[verticalId];
    const agents = config?.agents || [];
    
    try {
      await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(agents));
    } catch (err) {
      // Redis unavailable, continue without caching
    }
    
    return agents;
  }

  async getAgent(agentId: string): Promise<VerticalAgent | null> {
    for (const config of Object.values(VERTICAL_AGENTS)) {
      const agent = config.agents.find(a => a.id === agentId);
      if (agent) return agent;
    }
    return null;
  }

  async getAllAgents(): Promise<{ verticalId: string; agents: VerticalAgent[] }[]> {
    const cacheKey = 'vertical-agents:all';
    
    try {
      const cached = await redis.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (err) {
      // Redis unavailable, continue without cache
    }
    
    const result = Object.entries(VERTICAL_AGENTS).map(([verticalId, config]) => ({
      verticalId,
      agents: config.agents,
    }));
    
    try {
      await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(result));
    } catch (err) {
      // Redis unavailable, continue without caching
    }
    
    return result;
  }

  async searchAgents(query: string): Promise<VerticalAgent[]> {
    const results: VerticalAgent[] = [];
    const lowerQuery = query.toLowerCase();

    for (const config of Object.values(VERTICAL_AGENTS)) {
      for (const agent of config.agents) {
        if (
          agent.name.toLowerCase().includes(lowerQuery) ||
          agent.role.toLowerCase().includes(lowerQuery) ||
          agent.description.toLowerCase().includes(lowerQuery) ||
          agent.capabilities.some(c => c.toLowerCase().includes(lowerQuery)) ||
          agent.specializations.some(s => s.toLowerCase().includes(lowerQuery))
        ) {
          results.push(agent);
        }
      }
    }

    return results;
  }

  // ===========================================================================
  // AGENT METRICS
  // ===========================================================================

  async getAgentMetrics(agentId: string): Promise<AgentMetrics | null> {
    return this.metricsCache.get(agentId) || null;
  }

  async getVerticalMetrics(verticalId: string): Promise<{
    totalAgents: number;
    activeAgents: number;
    totalDecisionsToday: number;
    avgResponseTime: number;
    avgSuccessRate: number;
  }> {
    const agents = await this.getAgentsForVertical(verticalId);
    const metrics = agents
      .map(a => this.metricsCache.get(a.id))
      .filter((m): m is AgentMetrics => m !== undefined);

    return {
      totalAgents: agents.length,
      activeAgents: agents.filter(a => a.status === 'active').length,
      totalDecisionsToday: metrics.reduce((sum, m) => sum + m.decisionsToday, 0),
      avgResponseTime: metrics.length > 0
        ? metrics.reduce((sum, m) => sum + m.avgResponseTime, 0) / metrics.length
        : 0,
      avgSuccessRate: metrics.length > 0
        ? metrics.reduce((sum, m) => sum + m.successRate, 0) / metrics.length
        : 0,
    };
  }

  async getGlobalMetrics(): Promise<{
    totalVerticals: number;
    totalAgents: number;
    totalDecisionsToday: number;
    topAgents: { agentId: string; name: string; decisions: number }[];
  }> {
    const allMetrics = Array.from(this.metricsCache.values());
    const totalDecisionsToday = allMetrics.reduce((sum, m) => sum + m.decisionsToday, 0);

    const topAgents = allMetrics
      .sort((a, b) => b.decisionsToday - a.decisionsToday)
      .slice(0, 10)
      .map(m => {
        const agent = this.findAgentById(m.agentId);
        return {
          agentId: m.agentId,
          name: agent?.name || m.agentId,
          decisions: m.decisionsToday,
        };
      });

    return {
      totalVerticals: Object.keys(VERTICAL_AGENTS).length,
      totalAgents: this.metricsCache.size,
      totalDecisionsToday,
      topAgents,
    };
  }

  // ===========================================================================
  // AGENT ACTIVITY
  // ===========================================================================

  async recordActivity(activity: Omit<AgentActivity, 'id' | 'timestamp'>): Promise<AgentActivity> {
    const newActivity: AgentActivity = {
      ...activity,
      id: `act-${Date.now()}-${crypto.randomUUID().slice(0, 6)}`,
      timestamp: new Date(),
    };

    this.activityLog.push(newActivity);
    if (this.activityLog.length > 10000) {
      this.activityLog = this.activityLog.slice(-5000); // Keep last 5000
    }

    // Update metrics
    const metrics = this.metricsCache.get(activity.agentId);
    if (metrics) {
      metrics.decisionsToday++;
      metrics.lastActive = new Date();
      if (activity.success) {
        metrics.successRate = (metrics.successRate * 0.99) + 0.01; // Weighted average
      } else {
        metrics.successRate = metrics.successRate * 0.99;
      }
      this.metricsCache.set(activity.agentId, metrics);
    }

    return newActivity;
  }

  async getRecentActivity(limit: number = 50): Promise<AgentActivity[]> {
    return this.activityLog.slice(-limit).reverse();
  }

  async getAgentActivity(agentId: string, limit: number = 50): Promise<AgentActivity[]> {
    return this.activityLog
      .filter(a => a.agentId === agentId)
      .slice(-limit)
      .reverse();
  }

  // ===========================================================================
  // HELPER METHODS
  // ===========================================================================

  private findAgentById(agentId: string): VerticalAgent | null {
    for (const config of Object.values(VERTICAL_AGENTS)) {
      const agent = config.agents.find(a => a.id === agentId);
      if (agent) return agent;
    }
    return null;
  }



  async loadFromDB(): Promise<void> {


    try {


      let restored = 0;


      const recs = await loadServiceRecords({ serviceName: 'VerticalAgents', recordType: 'record', limit: 1000 });


      for (const rec of recs) {


        const d = rec.data as any;


        if (d?.id && !this.metricsCache.has(d.id)) this.metricsCache.set(d.id, d);


      }


      restored += recs.length;


      if (restored > 0) this.logger.info(`[VerticalAgentsService] Restored ${restored} records from database`);


    } catch (err) {


      this.logger.warn(`[VerticalAgentsService] DB reload skipped: ${(err as Error).message}`);


    }


  }
}

export const verticalAgentsService = new VerticalAgentsService();
