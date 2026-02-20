import pg from 'pg';
import crypto from 'crypto';
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://datacendia:datacendia_secure_2024@localhost:5433/datacendia',
});

async function main() {
  const client = await pool.connect();
  try {
    // Get org ID from existing deliberation
    const existingDel = await client.query(`SELECT organization_id FROM deliberations LIMIT 1`);
    const orgId = existingDel.rows[0]?.organization_id;
    if (!orgId) throw new Error('No organization found');

    // Get agent IDs from agents table
    const agentsResult = await client.query(`SELECT id, code, name, role FROM agents WHERE is_active = true`);
    const agents = agentsResult.rows;
    console.log(`Found ${agents.length} agents`);

    // Pick agents for this deliberation
    const selectedCodes = ['cfo', 'cto', 'ciso', 'clo', 'cro', 'analyst', 'redteam', 'chief'];
    const selectedAgents = selectedCodes.map(code => agents.find((a: any) => a.code === code)).filter(Boolean);
    console.log(`Selected ${selectedAgents.length} agents: ${selectedAgents.map((a: any) => a.code).join(', ')}`);

    const deliberationId = crypto.randomUUID();
    const now = new Date();
    const startedAt = new Date(now.getTime() - 3600000); // 1 hour ago
    const completedAt = new Date(now.getTime() - 1800000); // 30 min ago

    // Insert deliberation
    await client.query(`
      INSERT INTO deliberations (id, organization_id, question, config, context, mode, status, current_phase, progress, decision, confidence, started_at, completed_at, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
    `, [
      deliberationId,
      orgId,
      'Critical: Evaluate proposed $15M acquisition of CloudSecure Inc. for cybersecurity capabilities expansion',
      JSON.stringify({ agents: selectedCodes, rounds: 3 }),
      JSON.stringify({ background: 'CloudSecure is a Series B cybersecurity startup with 45 enterprise clients. Annual revenue $8M, growing 40% YoY. Key assets include patented zero-trust architecture and team of 12 PhD-level security researchers.' }),
      'STANDARD',
      'COMPLETED',
      'COMPLETED',
      100,
      JSON.stringify({
        approved: true,
        conditions: [
          'Complete technical due diligence on patent portfolio',
          'Retain key researchers with 3-year golden handcuffs',
          'Cap total consideration at $15M including earnout',
          'Require 90-day integration plan before close',
        ],
        confidence: 0.82,
        dissenting: ['CRO', 'Red Team'],
        rationale: 'Strategic acquisition that fills critical cybersecurity gap. Revenue multiple justified by growth rate and patent moat. Key risks around talent retention and integration complexity are manageable with proposed conditions.',
      }),
      0.82,
      startedAt,
      completedAt,
      startedAt,
    ]);
    console.log(`\nInserted deliberation: ${deliberationId}`);

    // Insert messages for each agent across 3 phases
    const phases = ['ANALYSIS', 'CROSS_EXAMINATION', 'SYNTHESIS'];
    let msgCount = 0;

    const agentAnalyses: Record<string, string[]> = {
      cfo: [
        '[CFO] Revenue multiple of 1.88x on $8M revenue is reasonable for a 40% growth SaaS company. Industry comps suggest 2-3x for similar cybersecurity firms. However, $15M cap should include earnout provisions tied to revenue retention. Recommend structuring as $10M upfront + $5M earnout over 24 months. Cash flow impact: manageable given current reserves of $45M. IRR projection: 18-22% over 5 years assuming integration targets met.',
        '[CFO] Responding to CRO concerns: The tail risk is real but quantifiable. If we lose 50% of CloudSecure clients post-acquisition (worst case), we still retain the IP and team at a $10M base price, which values the patent portfolio alone at ~$6M - below replacement cost. The earnout structure protects us from overpaying.',
        '[CFO] Final position: APPROVE with financial conditions. Structure: $10M closing + $5M earnout. Require audited financials for last 3 years. Escrow 15% for reps & warranties. Expected payback period: 28 months.',
      ],
      cto: [
        '[CTO] Technical assessment: CloudSecure\'s zero-trust architecture is genuinely differentiated. Their patent portfolio (7 granted, 3 pending) covers novel approaches to microsegmentation that we cannot replicate internally in under 18 months. The tech stack (Rust core, Kubernetes-native) is modern and maintainable. Integration complexity is moderate - their APIs are well-documented and REST-based. The PhD team is the real asset.',
        '[CTO] Addressing integration concerns: I estimate 6 months for Phase 1 integration (API gateway, SSO). Full platform merge: 12-18 months. Technical debt is minimal based on code review. The Rust codebase actually improves our security posture. Risk: their 12 PhDs are 80% of the technical moat.',
        '[CTO] Final position: STRONG APPROVE. The technology acquisition alone justifies the price. Our internal build estimate was $12M over 24 months with no guarantee of comparable patent protection. This is a buy-vs-build no-brainer.',
      ],
      ciso: [
        '[CISO] Security review of CloudSecure: Their own security posture is excellent - SOC 2 Type II certified, penetration tested quarterly, zero known breaches. Their zero-trust product has been independently audited by NCC Group. However, acquisition creates a temporary attack surface expansion during integration. Recommend 90-day security hardening plan post-close.',
        '[CISO] Responding to Red Team: Valid concerns on supply chain risk. Mitigations: (1) Isolated environment during integration, (2) Full credential rotation for all CloudSecure systems, (3) Third-party security assessment within 30 days of close. These are standard M&A security protocols.',
        '[CISO] Final position: APPROVE with security conditions. Require pre-close penetration test, isolated integration environment, and 90-day security hardening sprint. Risk is manageable with proper protocols.',
      ],
      clo: [
        '[CLO] Legal review: Patent portfolio is clean - no ongoing litigation, no known infringement claims. IP assignment agreements are properly executed for all employees. Key concern: 3 of the 12 researchers have non-compete agreements from prior employers expiring in 6-18 months. Recommend obtaining insurance against IP challenge. Employment agreements include standard assignment of inventions clauses.',
        '[CLO] Regulatory: No antitrust concerns at this deal size. CFIUS review unlikely but should be assessed given cybersecurity nature. Data processing agreements with CloudSecure clients need assignment consent - estimated 85% consent rate based on contract review.',
        '[CLO] Final position: APPROVE. Legal risks are standard for an acquisition of this size. Recommend reps & warranties insurance, 15% escrow, and material adverse change clause. Draft acquisition agreement ready in 2 weeks.',
      ],
      cro: [
        '[CRO] Risk assessment: ELEVATED RISK. Key concerns: (1) Client concentration - top 5 clients represent 62% of revenue, creating significant revenue cliff risk. (2) Talent retention - if key researchers leave, patent value diminishes rapidly. (3) Integration failure rate for tech acquisitions is 50-70% industry-wide. (4) Cybersecurity market is rapidly evolving - patents may depreciate faster than projected.',
        '[CRO] Stress test results: Under adverse scenario (30% client churn + 2 key departures), NPV turns negative at year 3. Under moderate scenario (15% churn, full retention), IRR drops to 12%. Tail risk: if a major zero-day is found in CloudSecure product post-acquisition, remediation cost estimated at $3-5M plus reputational damage.',
        '[CRO] Final position: CONDITIONAL APPROVE with reservations. The deal is justifiable but not without material risks. Require client retention guarantees, researcher retention packages, and comprehensive integration risk management plan. I formally note elevated risk profile.',
      ],
      analyst: [
        '[Strategic Analyst] Market analysis: Cybersecurity M&A activity in 2025-2026 shows median multiples of 5-8x revenue for high-growth targets. CloudSecure at 1.88x is significantly below market - either a genuine bargain or there are undisclosed concerns. Comparable transactions: CrowdStrike acquired Bionic ($350M, 8x revenue), Palo Alto acquired Talon ($625M, 6x revenue). Pattern: acquirers who retained target engineering teams saw 3x better outcomes.',
        '[Strategic Analyst] Data point on integration: Analysis of 47 cybersecurity acquisitions (2020-2025) shows success correlates strongly with: (a) buyer having dedicated M&A integration team (we have one), (b) earnout structure (proposed), (c) engineering team retention >80% at 24 months. Failure correlates with: rushed integration timelines and cultural misalignment.',
        '[Strategic Analyst] Final analysis: Data supports acquisition at proposed terms. The below-market multiple suggests strong negotiating position. Key risk metric to monitor: researcher retention at 6, 12, and 24 months.',
      ],
      redteam: [
        '[Red Team] Adversarial assessment: (1) What if CloudSecure is being shopped because insiders know about an undisclosed vulnerability? The below-market price is suspicious. (2) What if a competitor acquires us during integration when we\'re distracted? (3) What if the 3 researchers with expiring non-competes are poached by Google/Microsoft day one? (4) What if CloudSecure\'s top 3 clients are already in renewal negotiations and planning to churn?',
        '[Red Team] Worst case simulation: Competitor launches a comparable product at 50% of our price during our 12-month integration window. We lose both CloudSecure clients AND existing clients who see us as "distracted by acquisition." Total value destruction: $25-40M. Probability: 15-20%. This is not a tail risk - it\'s a realistic competitive scenario.',
        '[Red Team] Final position: CONDITIONAL APPROVE with strong reservations. The deal economics work in the base case, but the adversarial scenarios are realistic and costly. Non-negotiable requirements: (1) Pre-close client reference calls, (2) Full vulnerability disclosure by seller, (3) Researcher retention bonuses funded at close, not over time.',
      ],
      chief: [
        '[CEO - Chief Strategy Agent] Synthesis: This acquisition addresses a critical strategic gap in our cybersecurity capabilities. The price is attractive at 1.88x revenue vs 5-8x market comps. Strong support from CTO and CISO on technical merit. CFO confirms financial feasibility with proper structuring. CLO sees clean IP and manageable legal risk.',
        '[CEO] Addressing dissenting views: CRO and Red Team raise legitimate concerns about client concentration, talent retention, and competitive response. These are real risks but they are manageable with the conditions proposed. The alternative - building internally - costs more ($12M+), takes longer (24mo+), and provides no patent protection.',
        '[CEO] FINAL RECOMMENDATION: APPROVE WITH CONDITIONS. Unanimous on strategic value, 6 of 8 agents support. The two dissenting agents (CRO, Red Team) support conditionally with additional safeguards, which I incorporate. Total consideration capped at $15M ($10M + $5M earnout). Close within 60 days.',
      ],
    };

    for (const agent of selectedAgents) {
      const analyses = agentAnalyses[agent.code] || [];
      for (let phaseIdx = 0; phaseIdx < phases.length; phaseIdx++) {
        const phase = phases[phaseIdx];
        const content = analyses[phaseIdx] || `[${agent.name}] ${phase} phase analysis for CloudSecure acquisition.`;
        const confidence = 0.65 + Math.random() * 0.3; // 0.65-0.95
        const msgId = crypto.randomUUID();
        const msgTime = new Date(startedAt.getTime() + (phaseIdx * 20 * 60000) + (msgCount * 30000)); // Stagger messages

        await client.query(`
          INSERT INTO deliberation_messages (id, deliberation_id, agent_id, phase, content, target_agent_id, sources, confidence, created_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        `, [
          msgId,
          deliberationId,
          agent.id,
          phase,
          content,
          null,
          JSON.stringify([]),
          confidence,
          msgTime,
        ]);
        msgCount++;
      }
    }
    console.log(`Inserted ${msgCount} deliberation messages`);
    console.log(`\nDone! Deliberation ID: ${deliberationId}`);
    console.log('Both deliberations ready for Regulator\'s Receipt generation.');

  } catch (err: any) {
    console.error('Error:', err.message);
  } finally {
    client.release();
    await pool.end();
  }
}

main();
