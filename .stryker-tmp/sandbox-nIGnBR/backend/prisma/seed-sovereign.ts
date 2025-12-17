/**
 * =============================================================================
 * SOVEREIGN TIER SEED DATA
 * Enterprise Platinum Standard - Production-Ready Demo Data
 * =============================================================================
 */
// @ts-nocheck


import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function randomDate(daysAgo: number = 30): Date {
  const now = new Date();
  return new Date(now.getTime() - Math.random() * daysAgo * 24 * 60 * 60 * 1000);
}

function futureDate(daysAhead: number = 90): Date {
  const now = new Date();
  return new Date(now.getTime() + Math.random() * daysAhead * 24 * 60 * 60 * 1000);
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateHash(content: string): string {
  return crypto.createHash('sha256').update(content).digest('hex');
}

// =============================================================================
// 1. CENDIA VOX - STAKEHOLDER SIGNALS & ASSEMBLIES
// =============================================================================

async function seedVox(organizationId: string) {
  console.log('📢 Seeding CendiaVox™ data...');
  
  const stakeholders = await prisma.vox_stakeholders.findMany({
    where: { organization_id: organizationId, is_active: true }
  });
  
  if (stakeholders.length === 0) {
    console.log('  ⚠️ No stakeholders found - run main seed first');
    return;
  }
  
  // Seed signals for each stakeholder
  const signalTemplates = [
    { type: 'EMPLOYEES', signals: [
      { signalType: 'SURVEY', source: 'Annual Employee Survey 2024', content: 'Overall satisfaction at 78%. Concerns about remote work policy changes.', sentiment: 'POSITIVE', score: 0.65 },
      { signalType: 'INTERNAL', source: 'Town Hall Feedback', content: 'Strong support for sustainability initiatives. Questions about AI automation impact on jobs.', sentiment: 'NEUTRAL', score: 0.5 },
      { signalType: 'FEEDBACK', source: 'HR Pulse Check', content: 'Burnout indicators rising in engineering teams. Request for better work-life balance.', sentiment: 'NEGATIVE', score: 0.35 },
      { signalType: 'SURVEY', source: 'DEI Survey Q4', content: 'Inclusion scores improved 12% YoY. Still gaps in leadership representation.', sentiment: 'POSITIVE', score: 0.72 },
    ]},
    { type: 'CUSTOMERS', signals: [
      { signalType: 'SOCIAL_MEDIA', source: 'Twitter/X Sentiment Analysis', content: 'Positive buzz around new product launch. Some concerns about pricing in emerging markets.', sentiment: 'POSITIVE', score: 0.68 },
      { signalType: 'SURVEY', source: 'NPS Survey Q4 2024', content: 'NPS score: 67 (up from 62). Detractors cite customer support response times.', sentiment: 'POSITIVE', score: 0.7 },
      { signalType: 'COMPLAINT', source: 'Customer Support Tickets', content: 'Spike in data privacy concerns following industry breaches. Customers requesting transparency reports.', sentiment: 'NEGATIVE', score: 0.3 },
      { signalType: 'FEEDBACK', source: 'Enterprise Client Advisory Board', content: 'Strong demand for on-premise deployment options. Security certifications highly valued.', sentiment: 'POSITIVE', score: 0.75 },
    ]},
    { type: 'COMMUNITY', signals: [
      { signalType: 'NEWS', source: 'Local News Monitoring', content: 'Community groups praise company job creation. Environmental groups monitoring water usage.', sentiment: 'NEUTRAL', score: 0.55 },
      { signalType: 'ESG_FEED', source: 'Community Impact Assessment', content: 'Local employment up 15% due to facility expansion. Traffic concerns being addressed.', sentiment: 'POSITIVE', score: 0.65 },
      { signalType: 'SOCIAL_MEDIA', source: 'NextDoor Monitoring', content: 'Residents concerned about noise from new data center construction.', sentiment: 'NEGATIVE', score: 0.4 },
    ]},
    { type: 'ENVIRONMENT', signals: [
      { signalType: 'ESG_FEED', source: 'Carbon Footprint Analysis', content: 'Scope 1 & 2 emissions down 23% vs baseline. Scope 3 remains challenge.', sentiment: 'POSITIVE', score: 0.72 },
      { signalType: 'REGULATORY', source: 'EPA Compliance Review', content: 'Full compliance with Clean Air Act. Water discharge within permitted levels.', sentiment: 'POSITIVE', score: 0.85 },
      { signalType: 'ESG_FEED', source: 'Biodiversity Impact Study', content: 'Reforestation initiative ahead of schedule. Pollinator habitat restoration successful.', sentiment: 'VERY_POSITIVE', score: 0.9 },
    ]},
    { type: 'FUTURE_GENERATIONS', signals: [
      { signalType: 'ESG_FEED', source: 'Long-term Resource Analysis', content: 'Current resource consumption rate sustainable for 50+ years with planned efficiency gains.', sentiment: 'POSITIVE', score: 0.7 },
      { signalType: 'ESG_FEED', source: 'Climate Scenario Modeling', content: '2050 pathway aligned with 1.5°C target under current initiatives.', sentiment: 'POSITIVE', score: 0.75 },
      { signalType: 'ESG_FEED', source: 'Technology Legacy Assessment', content: 'Technical debt in legacy systems poses knowledge transfer risk. Modernization needed.', sentiment: 'NEUTRAL', score: 0.5 },
    ]},
    { type: 'SHAREHOLDERS', signals: [
      { signalType: 'ESG_FEED', source: 'Investor Relations Feedback', content: 'ESG scores driving increased interest from sustainable funds. Strong Q4 guidance well received.', sentiment: 'VERY_POSITIVE', score: 0.88 },
      { signalType: 'NEWS', source: 'Analyst Reports', content: 'Mixed reactions to R&D investment increase. Long-term focused investors supportive.', sentiment: 'POSITIVE', score: 0.65 },
      { signalType: 'REGULATORY', source: 'SEC Filing Analysis', content: 'Governance disclosures rated highly. Executive compensation aligned with performance.', sentiment: 'POSITIVE', score: 0.75 },
    ]},
  ];
  
  let signalCount = 0;
  for (const template of signalTemplates) {
    const stakeholder = stakeholders.find(s => s.stakeholder_type === template.type);
    if (!stakeholder) continue;
    
    for (const signal of template.signals) {
      await prisma.vox_signals.create({
        data: {
          stakeholder_id: stakeholder.id,
          signal_type: signal.signalType as any,
          source: signal.source,
          content: signal.content,
          sentiment: signal.sentiment as any,
          sentiment_score: signal.score,
          urgency: signal.score < 0.4 ? 'HIGH' : 'NORMAL',
          topics: extractTopics(signal.content),
          processed_at: randomDate(14),
          created_at: randomDate(30),
        }
      });
      signalCount++;
    }
  }
  console.log(`  ✓ Created ${signalCount} stakeholder signals`);
  
  // Create sample decision for voting
  const decisionId = crypto.randomUUID();
  
  // Create votes for a sample decision
  const voteReasons = [
    { type: 'EMPLOYEES', vote: 'APPROVE_WITH_CONDITIONS', reason: 'Approve if job protection guarantees are included' },
    { type: 'CUSTOMERS', vote: 'APPROVE', reason: 'Will improve service quality and data security' },
    { type: 'COMMUNITY', vote: 'APPROVE_WITH_CONDITIONS', reason: 'Request community benefit agreement' },
    { type: 'ENVIRONMENT', vote: 'APPROVE', reason: 'Net positive environmental impact projected' },
    { type: 'FUTURE_GENERATIONS', vote: 'APPROVE', reason: 'Long-term sustainability improved' },
    { type: 'SHAREHOLDERS', vote: 'APPROVE', reason: 'Strong ROI projections support investment' },
  ];
  
  for (const voteData of voteReasons) {
    const stakeholder = stakeholders.find(s => s.stakeholder_type === voteData.type);
    if (!stakeholder) continue;
    
    await prisma.vox_votes.create({
      data: {
        organization_id: organizationId,
        decision_id: decisionId,
        stakeholder_id: stakeholder.id,
        vote_type: 'APPROVAL',
        vote_value: voteData.vote as any,
        reasoning: voteData.reason,
        ai_generated: stakeholder.representation_method === 'AI Proxy',
        veto_exercised: false,
        created_at: randomDate(7),
      }
    });
  }
  console.log(`  ✓ Created ${voteReasons.length} stakeholder votes`);
  
  // Create assembly record
  await prisma.vox_assemblies.create({
    data: {
      organization_id: organizationId,
      decision_id: decisionId,
      title: 'Cloud Infrastructure Modernization Investment',
      assembly_type: 'SCHEDULED',
      agenda: 'Review $50M cloud modernization investment proposal. Assess impact on all stakeholder groups including employment, environmental footprint, and long-term strategic value.',
      participants: stakeholders.map(s => s.id),
      deliberation_log: [
        { speaker: 'Employee Voice', statement: 'We need job protection guarantees for affected workers' },
        { speaker: 'Environmental Voice', statement: 'Cloud efficiency will reduce our carbon footprint by 30%' },
        { speaker: 'Future Generations Voice', statement: 'This investment aligns with our 2050 sustainability goals' },
      ],
      consensus_reached: true,
      final_verdict: 'APPROVE_WITH_CONDITIONS',
      dissenting_voices: [],
      conditions: [
        'Job protection for affected employees',
        'Community benefit agreement with local jurisdictions',
        'Carbon offset for increased energy consumption during transition'
      ],
      created_at: randomDate(5),
    }
  });
  console.log('  ✓ Created stakeholder assembly');
  
  // Create impacts for the decision
  const impacts = [
    { type: 'EMPLOYEES', impactType: 'EMPLOYMENT', title: 'Workforce Transition', description: '150 roles to be upskilled, 20 legacy positions to be transitioned', severity: 'MODERATE' },
    { type: 'CUSTOMERS', impactType: 'FINANCIAL', title: 'Service Improvement', description: '40% faster response times, 99.99% uptime SLA', severity: 'MINOR' },
    { type: 'ENVIRONMENT', impactType: 'ENVIRONMENTAL', title: 'Energy Efficiency', description: 'Net 30% reduction in carbon footprint through efficient cloud infrastructure', severity: 'MINOR' },
  ];
  
  for (const impact of impacts) {
    const stakeholder = stakeholders.find(s => s.stakeholder_type === impact.type);
    if (!stakeholder) continue;
    
    await prisma.vox_impacts.create({
      data: {
        organization_id: organizationId,
        decision_id: decisionId,
        stakeholder_id: stakeholder.id,
        impact_type: impact.impactType as any,
        title: impact.title,
        description: impact.description,
        severity: impact.severity as any,
        mitigation_options: ['Phased transition program', 'Retraining initiatives', 'Voluntary severance options'],
        created_at: randomDate(10),
      }
    });
  }
  console.log('  ✓ Created stakeholder impacts');
}

function extractTopics(content: string): string[] {
  const topics: string[] = [];
  const keywords = ['sustainability', 'privacy', 'security', 'employment', 'environment', 'governance', 'compliance', 'innovation', 'diversity', 'inclusion'];
  for (const keyword of keywords) {
    if (content.toLowerCase().includes(keyword)) {
      topics.push(keyword);
    }
  }
  if (topics.length === 0) topics.push('general');
  return topics;
}

// =============================================================================
// 2. CENDIA PANOPTICON - REGULATORY FRAMEWORKS & COMPLIANCE
// =============================================================================

async function seedPanopticon(organizationId: string) {
  console.log('🔍 Seeding CendiaPanopticon™ data...');
  
  const frameworks = [
    {
      code: 'GDPR',
      name: 'General Data Protection Regulation',
      jurisdiction: 'EU',
      version: '2016/679',
      effectiveDate: new Date('2018-05-25'),
      obligations: [
        { code: 'GDPR-5.1', title: 'Lawfulness of Processing', description: 'Personal data shall be processed lawfully, fairly and transparently', priority: 'CRITICAL' },
        { code: 'GDPR-6', title: 'Legal Basis', description: 'Processing must have a valid legal basis', priority: 'CRITICAL' },
        { code: 'GDPR-17', title: 'Right to Erasure', description: 'Data subjects have the right to request deletion of personal data', priority: 'HIGH' },
        { code: 'GDPR-25', title: 'Data Protection by Design', description: 'Implement appropriate technical measures in system design', priority: 'HIGH' },
        { code: 'GDPR-32', title: 'Security of Processing', description: 'Implement appropriate security measures', priority: 'CRITICAL' },
        { code: 'GDPR-33', title: 'Breach Notification', description: 'Notify supervisory authority within 72 hours of breach', priority: 'CRITICAL' },
      ]
    },
    {
      code: 'SOX',
      name: 'Sarbanes-Oxley Act',
      jurisdiction: 'US',
      version: '2002',
      effectiveDate: new Date('2002-07-30'),
      obligations: [
        { code: 'SOX-302', title: 'CEO/CFO Certification', description: 'Senior officers must certify accuracy of financial statements', priority: 'CRITICAL' },
        { code: 'SOX-404', title: 'Internal Control Assessment', description: 'Annual assessment of internal controls over financial reporting', priority: 'CRITICAL' },
        { code: 'SOX-802', title: 'Record Retention', description: 'Maintain audit records for minimum 7 years', priority: 'HIGH' },
        { code: 'SOX-906', title: 'Criminal Penalties', description: 'Criminal penalties for certifying false financial reports', priority: 'CRITICAL' },
      ]
    },
    {
      code: 'EU_AI_ACT',
      name: 'EU Artificial Intelligence Act',
      jurisdiction: 'EU',
      version: '2024/1689',
      effectiveDate: new Date('2024-08-01'),
      obligations: [
        { code: 'AI-6', title: 'Prohibited Practices', description: 'Ban on social scoring and real-time biometric identification in public', priority: 'CRITICAL' },
        { code: 'AI-9', title: 'High-Risk Classification', description: 'Assessment and classification of AI system risk levels', priority: 'HIGH' },
        { code: 'AI-13', title: 'Transparency', description: 'Clear information about AI system capabilities and limitations', priority: 'HIGH' },
        { code: 'AI-14', title: 'Human Oversight', description: 'Ensure effective human oversight of high-risk AI systems', priority: 'CRITICAL' },
        { code: 'AI-52', title: 'Disclosure of AI-Generated Content', description: 'Clearly label AI-generated or manipulated content', priority: 'MEDIUM' },
      ]
    },
    {
      code: 'DORA',
      name: 'Digital Operational Resilience Act',
      jurisdiction: 'EU',
      version: '2022/2554',
      effectiveDate: new Date('2025-01-17'),
      obligations: [
        { code: 'DORA-5', title: 'ICT Risk Management', description: 'Comprehensive ICT risk management framework', priority: 'CRITICAL' },
        { code: 'DORA-17', title: 'ICT Incident Management', description: 'Procedures for detecting, managing, and reporting ICT incidents', priority: 'CRITICAL' },
        { code: 'DORA-24', title: 'Resilience Testing', description: 'Regular threat-led penetration testing', priority: 'HIGH' },
        { code: 'DORA-28', title: 'Third-Party Risk', description: 'Management of ICT third-party service providers', priority: 'HIGH' },
      ]
    },
    {
      code: 'HIPAA',
      name: 'Health Insurance Portability and Accountability Act',
      jurisdiction: 'US',
      version: '1996',
      effectiveDate: new Date('1996-08-21'),
      obligations: [
        { code: 'HIPAA-164.502', title: 'Uses and Disclosures', description: 'Standards for uses and disclosures of PHI', priority: 'CRITICAL' },
        { code: 'HIPAA-164.312', title: 'Technical Safeguards', description: 'Technical safeguards for ePHI', priority: 'CRITICAL' },
        { code: 'HIPAA-164.308', title: 'Administrative Safeguards', description: 'Administrative safeguards for PHI', priority: 'HIGH' },
        { code: 'HIPAA-164.530', title: 'Training Requirements', description: 'Workforce training on policies and procedures', priority: 'HIGH' },
      ]
    },
    {
      code: 'NIST_CSF',
      name: 'NIST Cybersecurity Framework',
      jurisdiction: 'US',
      version: '2.0',
      effectiveDate: new Date('2024-02-26'),
      obligations: [
        { code: 'NIST-ID', title: 'Identify', description: 'Develop organizational understanding of cybersecurity risk', priority: 'HIGH' },
        { code: 'NIST-PR', title: 'Protect', description: 'Implement appropriate safeguards', priority: 'CRITICAL' },
        { code: 'NIST-DE', title: 'Detect', description: 'Implement activities to identify cybersecurity events', priority: 'CRITICAL' },
        { code: 'NIST-RS', title: 'Respond', description: 'Implement activities for incident response', priority: 'CRITICAL' },
        { code: 'NIST-RC', title: 'Recover', description: 'Implement activities for resilience and recovery', priority: 'HIGH' },
      ]
    },
  ];
  
  let regulationCount = 0;
  let obligationCount = 0;
  
  for (const fw of frameworks) {
    const regulation = await prisma.panopticon_regulations.create({
      data: {
        organization_id: organizationId,
        framework_code: fw.code,
        framework_name: fw.name,
        version: fw.version,
        jurisdiction: fw.jurisdiction,
        effective_date: fw.effectiveDate,
        status: 'ACTIVE',
        source_url: `https://regulations.example.com/${fw.code.toLowerCase()}`,
        raw_content: `Full regulatory text for ${fw.name} would be ingested here.`,
        parsed_content: { summary: `${fw.name} establishes key requirements for compliance.`, sections: [] },
        created_at: randomDate(90),
      }
    });
    regulationCount++;
    
    for (const obl of fw.obligations) {
      await prisma.panopticon_obligations.create({
        data: {
          regulation_id: regulation.id,
          obligation_code: obl.code,
          title: obl.title,
          description: obl.description,
          requirement_type: 'MANDATORY',
          priority: obl.priority as any,
          due_date: futureDate(180),
          automation_status: pickRandom(['FULLY_AUTOMATED', 'PARTIALLY_AUTOMATED', 'MANUAL']),
          created_at: randomDate(60),
        }
      });
      obligationCount++;
    }
  }
  console.log(`  ✓ Created ${regulationCount} regulatory frameworks with ${obligationCount} obligations`);
  
  // Get regulations and obligations for violations
  const regs = await prisma.panopticon_regulations.findMany({
    where: { organization_id: organizationId },
    include: { obligations: true }
  });
  
  // Create compliance violations
  const violationTemplates = [
    { framework: 'GDPR', obligationCode: 'GDPR-33', type: 'PROCESS_VIOLATION', severity: 'HIGH', title: 'Breach Notification Delay', description: 'Breach notification delayed by 12 hours beyond 72-hour window' },
    { framework: 'SOX', obligationCode: 'SOX-404', type: 'DOCUMENTATION_GAP', severity: 'MEDIUM', title: 'Incomplete Control Documentation', description: 'Internal control testing documentation incomplete for Q3' },
    { framework: 'NIST_CSF', obligationCode: 'NIST-DE', type: 'CONTROL_FAILURE', severity: 'HIGH', title: 'SIEM Alert Gap', description: 'SIEM alert correlation rules not updated for 90 days' },
  ];
  
  for (const violation of violationTemplates) {
    const reg = regs.find(r => r.framework_code === violation.framework);
    if (!reg) continue;
    const obl = reg.obligations.find(o => o.obligation_code === violation.obligationCode);
    
    await prisma.panopticon_violations.create({
      data: {
        organization_id: organizationId,
        regulation_id: reg.id,
        obligation_id: obl?.id,
        violation_type: violation.type as any,
        severity: violation.severity as any,
        title: violation.title,
        description: violation.description,
        evidence: { documents: ['Audit log excerpt', 'System timestamp records'] },
        status: pickRandom(['OPEN', 'INVESTIGATING', 'REMEDIATION']),
        detected_at: randomDate(14),
        created_at: randomDate(14),
      }
    });
  }
  console.log(`  ✓ Created ${violationTemplates.length} compliance violations`);
  
  // Create regulatory forecasts
  const forecasts = [
    { type: 'NEW_REGULATION', title: 'US Federal AI Safety Framework', probability: 0.75, impact: 80, description: 'Expected federal AI regulation mirroring EU AI Act', horizonDays: 365 },
    { type: 'AMENDMENT', title: 'GDPR Cross-Border Transfer Updates', probability: 0.85, impact: 60, description: 'New adequacy decisions expected for additional countries', horizonDays: 180 },
    { type: 'ENFORCEMENT_ACTION', title: 'Increased SEC Cybersecurity Enforcement', probability: 0.65, impact: 75, description: 'SEC signaling increased enforcement of cyber disclosure rules', horizonDays: 90 },
  ];
  
  for (const forecast of forecasts) {
    await prisma.panopticon_forecasts.create({
      data: {
        organization_id: organizationId,
        forecast_type: forecast.type as any,
        title: forecast.title,
        description: forecast.description,
        source: 'Regulatory intelligence analysis',
        probability: forecast.probability,
        impact_score: forecast.impact,
        horizon_days: forecast.horizonDays,
        affected_frameworks: ['GDPR', 'SOX', 'NIST_CSF'],
        recommended_actions: ['Gap assessment', 'Policy review', 'Stakeholder briefing'],
        confidence: 0.75,
        created_at: randomDate(30),
      }
    });
  }
  console.log(`  ✓ Created ${forecasts.length} regulatory forecasts`);
}

// =============================================================================
// 3. CENDIA AEGIS - THREAT INTELLIGENCE & DEFENSE
// =============================================================================

async function seedAegis(organizationId: string) {
  console.log('🛡️ Seeding CendiaAegis™ data...');
  
  const signals = [
    { type: 'CYBER', severity: 'HIGH', title: 'APT Campaign Detection', source: 'Threat Intel Feed', content: 'Increased APT activity targeting cloud infrastructure providers in financial sector', tags: ['APT', 'Cloud', 'Financial'] },
    { type: 'GEOPOLITICAL', severity: 'MEDIUM', title: 'Supply Chain Risk', source: 'Geopolitical Analysis', content: 'Trade tensions may impact semiconductor supply chain within 6 months', tags: ['Trade', 'Semiconductor', 'Supply Chain'] },
    { type: 'SUPPLY_CHAIN', severity: 'HIGH', title: 'Vendor Security Incident', source: 'Vendor Risk Monitor', content: 'Critical software vendor reported unauthorized access to build systems', tags: ['Vendor', 'Build System', 'Compromise'] },
    { type: 'SOCIAL', severity: 'MEDIUM', title: 'Insider Activity Detected', source: 'UEBA System', content: 'Anomalous data access patterns detected for 3 privileged users', tags: ['Insider', 'UEBA', 'Privileged'] },
    { type: 'INFRASTRUCTURE', severity: 'LOW', title: 'HVAC Efficiency Degradation', source: 'Facility Sensors', content: 'HVAC efficiency degradation may impact data center cooling capacity', tags: ['HVAC', 'Data Center', 'Infrastructure'] },
    { type: 'REGULATORY', severity: 'MEDIUM', title: 'New Disclosure Requirements', source: 'Regulatory Watch', content: 'New cybersecurity disclosure rules may require expedited incident reporting', tags: ['SEC', 'Disclosure', 'Compliance'] },
    { type: 'CYBER', severity: 'CRITICAL', title: 'Ransomware Group Targeting', source: 'Dark Web Monitor', content: 'Organization domain mentioned in ransomware group forum as potential target', tags: ['Ransomware', 'Dark Web', 'Targeting'] },
  ];
  
  const createdSignals = [];
  for (const signal of signals) {
    const created = await prisma.aegis_signals.create({
      data: {
        organization_id: organizationId,
        signal_type: signal.type as any,
        title: signal.title,
        source: signal.source,
        content: signal.content,
        severity: signal.severity as any,
        confidence: 0.65 + Math.random() * 0.3,
        tags: signal.tags,
        entities_mentioned: ['Datacendia', 'Cloud Provider X'],
        processed_at: randomDate(7),
        created_at: randomDate(14),
      }
    });
    createdSignals.push(created);
  }
  console.log(`  ✓ Created ${signals.length} threat signals`);
  
  // Create active threats
  const threats = [
    { signalIdx: 0, type: 'CYBER_ATTACK', title: 'APT-29 Campaign Targeting', description: 'Nation-state threat actor actively probing perimeter defenses', severity: 'HIGH', status: 'MONITORING', probability: 0.45, impact: 75 },
    { signalIdx: 2, type: 'SUPPLY_CHAIN_ATTACK', title: 'Critical Vendor Compromise', description: 'Key software vendor supply chain compromised - investigating exposure', severity: 'CRITICAL', status: 'ACTIVE', probability: 0.8, impact: 90 },
    { signalIdx: 6, type: 'CYBER_ATTACK', title: 'LockBit Targeting Intelligence', description: 'Dark web chatter indicates organization on target list', severity: 'CRITICAL', status: 'MONITORING', probability: 0.35, impact: 95 },
    { signalIdx: 3, type: 'INSIDER_THREAT', title: 'Privileged User Anomaly', description: 'Unusual data access by privileged accounts under investigation', severity: 'MEDIUM', status: 'ACTIVE', probability: 0.5, impact: 60 },
  ];
  
  const createdThreats = [];
  for (const threat of threats) {
    const created = await prisma.aegis_threats.create({
      data: {
        organization_id: organizationId,
        signal_id: createdSignals[threat.signalIdx].id,
        threat_type: threat.type as any,
        title: threat.title,
        description: threat.description,
        severity: threat.severity as any,
        status: threat.status as any,
        probability: threat.probability,
        impact_score: threat.impact,
        affected_assets: ['Cloud infrastructure', 'Customer data', 'Intellectual property'],
        attack_vectors: ['Phishing', 'Supply chain', 'Credential compromise'],
        indicators: ['Suspicious IPs', 'Malware hashes', 'TTPs'],
        first_seen_at: randomDate(30),
        last_seen_at: randomDate(3),
        created_at: randomDate(14),
      }
    });
    createdThreats.push(created);
  }
  console.log(`  ✓ Created ${threats.length} active threats`);
  
  // Create countermeasures
  const countermeasures = [
    { threatIdx: 0, type: 'PREVENTIVE', title: 'Enhanced Perimeter Monitoring', description: 'Deploy additional IDS rules targeting known APT-29 TTPs', cost: 50000 },
    { threatIdx: 0, type: 'DETECTIVE', title: 'Threat Hunting Campaign', description: 'Proactive hunting for APT-29 indicators across all systems', cost: 75000 },
    { threatIdx: 1, type: 'CORRECTIVE', title: 'Vendor Isolation', description: 'Isolate affected vendor systems pending investigation', cost: 25000 },
    { threatIdx: 1, type: 'RECOVERY', title: 'Clean Build Deployment', description: 'Deploy clean builds from verified sources', cost: 200000 },
    { threatIdx: 2, type: 'PREVENTIVE', title: 'Ransomware Defense Hardening', description: 'Enhanced backup verification and immutable storage', cost: 150000 },
    { threatIdx: 3, type: 'DETECTIVE', title: 'Enhanced UEBA Monitoring', description: 'Increase monitoring sensitivity for privileged accounts', cost: 30000 },
  ];
  
  for (const cm of countermeasures) {
    await prisma.aegis_countermeasures.create({
      data: {
        threat_id: createdThreats[cm.threatIdx].id,
        countermeasure_type: cm.type as any,
        title: cm.title,
        description: cm.description,
        status: pickRandom(['APPROVED', 'IN_PROGRESS', 'IMPLEMENTED', 'VERIFIED']),
        cost_estimate: cm.cost,
        effectiveness: 0.7 + Math.random() * 0.25,
        implementation: { steps: ['Assess', 'Plan', 'Deploy', 'Verify'] },
        created_at: randomDate(10),
      }
    });
  }
  console.log(`  ✓ Created ${countermeasures.length} countermeasures`);
  
  // Create scenarios
  for (const threat of createdThreats.slice(0, 2)) {
    await prisma.aegis_scenarios.create({
      data: {
        threat_id: threat.id,
        scenario_name: `${threat.title} - Worst Case`,
        description: `Full exploitation scenario with maximum impact`,
        trigger_conditions: { event: 'Successful breach', probability: 0.2 },
        cascade_effects: { systems: ['Core infrastructure', 'Customer data', 'Operations'] },
        affected_systems: ['Cloud', 'Database', 'API Gateway'],
        probability: 0.2,
        financial_impact: 10000000,
        operational_impact: 90,
        reputational_impact: 85,
        recovery_time_hours: 168,
        created_at: randomDate(7),
      }
    });
    
    await prisma.aegis_scenarios.create({
      data: {
        threat_id: threat.id,
        scenario_name: `${threat.title} - Contained`,
        description: `Threat detected and contained early with minimal impact`,
        trigger_conditions: { event: 'Early detection', probability: 0.6 },
        cascade_effects: { systems: ['Limited operational impact'] },
        affected_systems: ['Perimeter systems only'],
        probability: 0.6,
        financial_impact: 100000,
        operational_impact: 15,
        reputational_impact: 10,
        recovery_time_hours: 24,
        created_at: randomDate(7),
      }
    });
  }
  console.log('  ✓ Created threat scenarios');
  
  // Create briefings
  const briefings = [
    { type: 'DAILY_INTEL', title: 'Daily Threat Intelligence Briefing', classification: 'INTERNAL' },
    { type: 'THREAT_ALERT', title: 'CRITICAL: Supply Chain Compromise Alert', classification: 'CONFIDENTIAL' },
    { type: 'EXECUTIVE_SUMMARY', title: 'Weekly Security Posture Summary', classification: 'INTERNAL' },
    { type: 'INCIDENT_REPORT', title: 'Insider Threat Investigation Update', classification: 'CONFIDENTIAL' },
  ];
  
  for (const briefing of briefings) {
    await prisma.aegis_briefings.create({
      data: {
        organization_id: organizationId,
        threat_id: createdThreats[0].id,
        briefing_type: briefing.type as any,
        title: briefing.title,
        classification: briefing.classification as any,
        executive_summary: `Executive summary of ${briefing.title.toLowerCase()} with key findings and recommendations for leadership.`,
        detailed_analysis: `Detailed technical analysis including indicators of compromise, timeline of events, and technical recommendations for security teams.`,
        recommendations: ['Implement additional monitoring', 'Review access controls', 'Update incident response procedures'],
        recipients: ['CISO', 'Security Team', 'Executive Leadership'],
        created_at: randomDate(7),
      }
    });
  }
  console.log(`  ✓ Created ${briefings.length} threat briefings`);
}

// =============================================================================
// 4. CENDIA ETERNAL - KNOWLEDGE ARCHIVE & SUCCESSION
// =============================================================================

async function seedEternal(organizationId: string, userId: string) {
  console.log('📜 Seeding CendiaEternal™ data...');
  
  const artifacts = [
    { type: 'STRATEGIC_DECISION', title: 'Cloud-First Strategy Decision 2023', importance: 90, retention: 50, access: 'ORGANIZATION', content: 'Board-approved decision to migrate 100% of infrastructure to cloud by 2025. Key drivers: scalability, cost efficiency, and innovation velocity.' },
    { type: 'POLICY_DOCUMENT', title: 'Data Governance Framework', importance: 85, retention: 25, access: 'ORGANIZATION', content: 'Comprehensive data governance framework establishing data ownership, quality standards, and lifecycle management policies.' },
    { type: 'INTELLECTUAL_PROPERTY', title: 'Proprietary ML Model Architecture', importance: 95, retention: 100, access: 'LEADERSHIP', content: 'Core machine learning architecture powering decision intelligence platform. Includes model design, training methodology, and optimization techniques.' },
    { type: 'HISTORICAL_RECORD', title: 'Legacy System Integration Guide', importance: 70, retention: 25, access: 'ORGANIZATION', content: 'Comprehensive guide for integrating with legacy enterprise systems including protocols, data mappings, and transformation rules.' },
    { type: 'CRISIS_RESPONSE', title: 'Pandemic Response Playbook', importance: 85, retention: 50, access: 'ORGANIZATION', content: 'Lessons learned and procedures from 2020-2022 pandemic response including remote work policies, business continuity, and stakeholder communication.' },
    { type: 'FINANCIAL_RECORD', title: 'SOX Compliance Archive 2023', importance: 80, retention: 10, access: 'LEADERSHIP', content: 'Complete SOX compliance documentation for FY2023 including control testing, audit findings, and remediation actions.' },
    { type: 'CULTURAL_ARTIFACT', title: 'Company Values Evolution', importance: 75, retention: 100, access: 'PUBLIC', content: 'History and evolution of company core values since founding, documenting how values have adapted while maintaining core principles.' },
    { type: 'LEADERSHIP_WISDOM', title: 'Founder Strategic Insights', importance: 90, retention: 100, access: 'SUCCESSION', content: 'Collection of strategic insights, decision frameworks, and leadership principles from founding team for future leaders.' },
  ];
  
  const createdArtifacts = [];
  for (const artifact of artifacts) {
    const contentHash = generateHash(artifact.content);
    const created = await prisma.eternal_artifacts.create({
      data: {
        organization_id: organizationId,
        artifact_type: artifact.type as any,
        title: artifact.title,
        description: `${artifact.title} - archived for long-term preservation`,
        content: artifact.content,
        content_hash: contentHash,
        importance_score: artifact.importance,
        retention_years: artifact.retention,
        access_level: artifact.access as any,
        format_version: '1.0',
        original_format: 'MARKDOWN',
        metadata: { source: 'Datacendia Archive', version: '1.0' },
        tags: extractTopics(artifact.content),
        verification_status: 'VERIFIED',
        last_verified_at: randomDate(30),
        created_by: userId,
        created_at: randomDate(365),
      }
    });
    createdArtifacts.push(created);
  }
  console.log(`  ✓ Archived ${artifacts.length} eternal artifacts`);
  
  // Create validations
  for (const artifact of createdArtifacts.slice(0, 5)) {
    await prisma.eternal_validations.create({
      data: {
        artifact_id: artifact.id,
        validation_type: pickRandom(['SCHEDULED', 'MANUAL', 'TRIGGERED']),
        validator: userId,
        previous_hash: artifact.content_hash,
        current_hash: artifact.content_hash,
        integrity_check: true,
        drift_detected: false,
        validated_at: randomDate(7),
      }
    });
  }
  console.log('  ✓ Created artifact validations');
  
  // Create format migrations
  const migrations = [
    { type: 'FORMAT_UPGRADE', source: 'DOC', target: 'MARKDOWN', status: 'COMPLETED', count: 1523 },
    { type: 'ENCRYPTION_UPDATE', source: 'AES-128', target: 'AES-256', status: 'IN_PROGRESS', count: 892 },
    { type: 'PLATFORM_MIGRATION', source: 'On-Premise', target: 'Cloud Archive', status: 'PENDING', count: 3241 },
  ];
  
  for (const migration of migrations) {
    await prisma.eternal_migrations.create({
      data: {
        organization_id: organizationId,
        migration_type: migration.type as any,
        source_format: migration.source,
        target_format: migration.target,
        status: migration.status as any,
        artifacts_affected: migration.count,
        started_at: migration.status !== 'PENDING' ? randomDate(30) : null,
        completed_at: migration.status === 'COMPLETED' ? randomDate(7) : null,
        created_at: randomDate(60),
      }
    });
  }
  console.log(`  ✓ Created ${migrations.length} format migrations`);
  
  // Create succession plans
  const successors = [
    { type: 'INDIVIDUAL', name: 'Executive Succession Plan', contact: 'board@datacendia.com', verification: 'Board Resolution + Identity Verification' },
    { type: 'ORGANIZATION', name: 'Technology Knowledge Transfer', contact: 'cto-office@datacendia.com', verification: 'Role-based access verification' },
    { type: 'TRUST', name: 'IP Rights Succession Trust', contact: 'legal@datacendia.com', verification: 'Legal documentation + Multi-party authorization' },
    { type: 'FOUNDATION', name: 'Research Archive Foundation', contact: 'research@datacendia.com', verification: 'Foundation charter verification' },
  ];
  
  for (const successor of successors) {
    await prisma.eternal_succession.create({
      data: {
        organization_id: organizationId,
        successor_type: successor.type as any,
        successor_name: successor.name,
        successor_contact: successor.contact,
        verification_method: successor.verification,
        access_conditions: { trigger: 'Leadership change or dissolution', requirements: ['Board approval', 'Legal review'] },
        artifacts_scope: createdArtifacts.slice(0, 3).map(a => a.id),
        activated: false,
        created_at: randomDate(180),
      }
    });
  }
  console.log(`  ✓ Created ${successors.length} succession plans`);
}

// =============================================================================
// 5. CENDIA SYMBIONT - PARTNERSHIP ECOSYSTEM
// =============================================================================

async function seedSymbiont(organizationId: string) {
  console.log('🤝 Seeding CendiaSymbiont™ data...');
  
  const entities = [
    { type: 'CUSTOMER', name: 'Fortune 500 Financial Services', domain: 'Finance', size: 'ENTERPRISE', financialHealth: 92, reputation: 88 },
    { type: 'CUSTOMER', name: 'Global Healthcare Provider', domain: 'Healthcare', size: 'ENTERPRISE', financialHealth: 85, reputation: 82 },
    { type: 'CUSTOMER', name: 'Government Agency - Defense', domain: 'Government', size: 'CONGLOMERATE', financialHealth: 95, reputation: 90 },
    { type: 'PARTNER', name: 'Cloud Infrastructure Provider', domain: 'Technology', size: 'CONGLOMERATE', financialHealth: 95, reputation: 92 },
    { type: 'PARTNER', name: 'Systems Integration Firm', domain: 'Consulting', size: 'ENTERPRISE', financialHealth: 82, reputation: 78 },
    { type: 'VENDOR', name: 'AI Chip Manufacturer', domain: 'Hardware', size: 'ENTERPRISE', financialHealth: 78, reputation: 85 },
    { type: 'VENDOR', name: 'Security Software Vendor', domain: 'Security', size: 'MID_MARKET', financialHealth: 90, reputation: 88 },
    { type: 'INVESTOR', name: 'Growth Equity Fund', domain: 'Finance', size: 'ENTERPRISE', financialHealth: 95, reputation: 90 },
    { type: 'REGULATOR', name: 'Data Protection Authority', domain: 'Regulatory', size: 'ENTERPRISE', financialHealth: 100, reputation: 95 },
    { type: 'COMPETITOR', name: 'Enterprise AI Platform', domain: 'Technology', size: 'ENTERPRISE', financialHealth: 75, reputation: 70 },
  ];
  
  const createdEntities = [];
  for (const entity of entities) {
    const created = await prisma.symbiont_entities.create({
      data: {
        organization_id: organizationId,
        entity_type: entity.type as any,
        name: entity.name,
        description: `${entity.name} - Key ecosystem ${entity.type.toLowerCase()} in ${entity.domain} sector`,
        domain: entity.domain,
        size_category: entity.size as any,
        financial_health: entity.financialHealth,
        reputation_score: entity.reputation,
        data_sources: ['Public filings', 'News monitoring', 'Partner reports'],
        tags: [entity.domain, entity.type],
        last_analyzed_at: randomDate(7),
        created_at: randomDate(365),
      }
    });
    createdEntities.push(created);
  }
  console.log(`  ✓ Created ${entities.length} ecosystem entities`);
  
  // Create relationships
  const relationships = [
    { entity1: 0, entity2: 3, type: 'PARTNERSHIP', strength: 90, sentiment: 'VERY_POSITIVE' },
    { entity1: 0, entity2: 4, type: 'CUSTOMER', strength: 75, sentiment: 'POSITIVE' },
    { entity1: 1, entity2: 6, type: 'VENDOR', strength: 85, sentiment: 'POSITIVE' },
    { entity1: 2, entity2: 5, type: 'VENDOR', strength: 70, sentiment: 'NEUTRAL' },
    { entity1: 3, entity2: 5, type: 'PARTNERSHIP', strength: 80, sentiment: 'POSITIVE' },
  ];
  
  for (const rel of relationships) {
    await prisma.symbiont_relationships.create({
      data: {
        organization_id: organizationId,
        entity_id: createdEntities[rel.entity1].id,
        related_entity_id: createdEntities[rel.entity2].id,
        relationship_type: rel.type as any,
        strength: rel.strength,
        sentiment: rel.sentiment as any,
        interaction_history: [
          { date: randomDate(30).toISOString(), type: 'Meeting', outcome: 'Positive' },
          { date: randomDate(60).toISOString(), type: 'Contract Review', outcome: 'Completed' },
        ],
        health_score: rel.strength * 0.9 + Math.random() * 10,
        last_interaction: randomDate(7),
        created_at: randomDate(180),
      }
    });
  }
  console.log(`  ✓ Created ${relationships.length} entity relationships`);
  
  // Create opportunities
  const opportunities = [
    { entityIdx: 0, type: 'STRATEGIC_PARTNERSHIP', title: 'Enterprise License Expansion', value: 2000000, risk: 30, stage: 'NEGOTIATING' },
    { entityIdx: 1, type: 'LICENSING', title: 'Advanced Analytics Module', value: 500000, risk: 40, stage: 'PURSUING' },
    { entityIdx: 3, type: 'CO_DEVELOPMENT', title: 'Joint AI Solution', value: 5000000, risk: 55, stage: 'ANALYZING' },
    { entityIdx: 4, type: 'DISTRIBUTION', title: 'Government Sector Channel', value: 10000000, risk: 45, stage: 'QUALIFIED' },
    { entityIdx: 7, type: 'INVESTMENT', title: 'Series C Co-Investment', value: 50000000, risk: 35, stage: 'NEGOTIATING' },
  ];
  
  const createdOpportunities = [];
  for (const opp of opportunities) {
    const created = await prisma.symbiont_opportunities.create({
      data: {
        organization_id: organizationId,
        entity_id: createdEntities[opp.entityIdx].id,
        opportunity_type: opp.type as any,
        title: opp.title,
        description: `${opp.title} opportunity with ${createdEntities[opp.entityIdx].name}`,
        strategic_fit: 70 + Math.random() * 25,
        financial_potential: opp.value,
        risk_score: opp.risk,
        synergy_areas: ['Technology', 'Market Access', 'Revenue'],
        required_resources: ['Sales team', 'Technical support', 'Legal review'],
        timeline_months: 6 + Math.floor(Math.random() * 12),
        status: opp.stage as any,
        created_at: randomDate(30),
      }
    });
    createdOpportunities.push(created);
  }
  console.log(`  ✓ Created ${opportunities.length} partnership opportunities`);
  
  // Create simulations
  const simulations = [
    { title: 'Partner Churn Impact', type: 'PARTNERSHIP_MODEL', outcome: 'Losing top 3 partners would reduce revenue by 35%' },
    { title: 'Ecosystem Expansion', type: 'MARKET_ENTRY', outcome: '10 new strategic partners could increase TAM by $500M' },
    { title: 'Joint Venture Analysis', type: 'JV_STRUCTURE', outcome: '50/50 JV structure optimal for shared risk and governance' },
  ];
  
  for (let i = 0; i < simulations.length; i++) {
    const sim = simulations[i];
    const opp = createdOpportunities[i % createdOpportunities.length];
    
    await prisma.symbiont_simulations.create({
      data: {
        opportunity_id: opp.id,
        simulation_type: sim.type as any,
        scenario_name: sim.title,
        parameters: { scenario: sim.title, timeframe: '12 months', assumptions: ['Stable market', 'Current team capacity'] },
        projected_outcomes: { summary: sim.outcome, confidence: 0.8, metrics: { revenue_impact: '$5M+', risk_reduction: '15%' } },
        financial_model: { npv: 2500000, irr: 0.25, payback_months: 18 },
        risk_analysis: { identified_risks: ['Market volatility', 'Integration complexity'], mitigation: ['Phased approach', 'Clear governance'] },
        success_probability: 0.6 + Math.random() * 0.3,
        recommendation: `Proceed with ${sim.title} - ${sim.outcome}`,
        created_at: randomDate(14),
      }
    });
  }
  console.log(`  ✓ Created ${simulations.length} ecosystem simulations`);
}

// =============================================================================
// MAIN EXECUTION
// =============================================================================

async function main() {
  console.log('='.repeat(60));
  console.log('🏛️  SOVEREIGN TIER - ENTERPRISE PLATINUM SEED');
  console.log('='.repeat(60));
  
  try {
    // Get the demo organization
    const org = await prisma.organizations.findFirst({
      where: { slug: 'datacendia-demo' }
    });
    
    if (!org) {
      console.error('❌ Demo organization not found. Run main seed first.');
      process.exit(1);
    }
    
    // Get a user for artifact creation
    const user = await prisma.users.findFirst({
      where: { organization_id: org.id }
    });
    
    if (!user) {
      console.error('❌ No user found. Run main seed first.');
      process.exit(1);
    }
    
    console.log(`\n📍 Organization: ${org.name} (${org.id})`);
    console.log(`👤 User: ${user.email}\n`);
    
    // Seed each sovereign service
    await seedVox(org.id);
    console.log('');
    
    await seedPanopticon(org.id);
    console.log('');
    
    await seedAegis(org.id);
    console.log('');
    
    await seedEternal(org.id, user.id);
    console.log('');
    
    await seedSymbiont(org.id);
    console.log('');
    
    console.log('='.repeat(60));
    console.log('✅ SOVEREIGN TIER SEEDING COMPLETE');
    console.log('='.repeat(60));
    
  } catch (error) {
    console.error('❌ Seed failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();
