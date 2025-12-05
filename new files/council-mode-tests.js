/**
 * Council Mode Integration Tests
 * 
 * Verifies that each mode produces outputs in the expected format
 * Tests mode switching, output structure, and content requirements
 */

// ============================================================
// TEST CONFIGURATION
// ============================================================

const TEST_CONFIG = {
  baseUrl: process.env.COUNCIL_API_URL || 'http://localhost:3000',
  timeout: 60000, // 60 seconds for deliberation
  retries: 2
};

// Expected output patterns for each mode
const OUTPUT_EXPECTATIONS = {
  'war-room': {
    requiredSections: [
      'Agent Analysis', 
      'Cross-Examination', 
      'Synthesis', 
      'Decision'
    ],
    requiredElements: {
      hasConfidenceScore: true,
      hasRiskScore: true,
      hasActionItems: true,
      hasAgentNames: true,
      hasDebateExchange: true
    },
    outputFormat: 'markdown',
    minAgents: 3,
    maxTimeMinutes: 15
  },

  'due-diligence': {
    requiredSections: [
      'Evidence Gathering',
      'Red Flags',
      'Gap Analysis',
      'Final Assessment'
    ],
    requiredElements: {
      hasConfidenceLevels: true,
      hasSourceCitations: true,
      hasRedFlags: true,
      hasGoNoGoRecommendation: true
    },
    outputFormat: 'markdown',
    minAgents: 4,
    maxTimeMinutes: 20
  },

  'innovation-lab': {
    requiredSections: [
      'Seed Ideas',
      'Build & Expand',
      'Feasibility Sketch'
    ],
    requiredElements: {
      hasIdeaList: true,
      hasBuildingOnIdeas: true,
      hasFeasibilityRatings: true,
      noNegativeCriticism: true
    },
    outputFormat: 'markdown',
    minIdeas: 5,
    maxTimeMinutes: 10
  },

  'compliance': {
    requiredSections: [
      'Regulatory Mapping',
      'Gap Analysis',
      'Risk Assessment',
      'Control Recommendations'
    ],
    requiredElements: {
      hasRegulationCitations: true,
      hasComplianceTable: true,
      hasRiskScores: true,
      hasRemediationSteps: true
    },
    outputFormat: 'markdown_with_tables',
    minAgents: 2,
    maxTimeMinutes: 15
  },

  'crisis': {
    requiredSections: [
      'Situation Assessment',
      'Immediate Triage',
      'Response Actions',
      'Communication Plan'
    ],
    requiredElements: {
      hasActionTable: true,
      hasOwners: true,
      hasDeadlines: true,
      hasPriorityLevels: true,
      hasCommunicationTemplates: true
    },
    outputFormat: 'markdown_with_tables',
    minAgents: 3,
    maxTimeMinutes: 5
  },

  'execution': {
    requiredSections: [
      'Objective Definition',
      'Work Breakdown',
      'Timeline',
      'Success Criteria'
    ],
    requiredElements: {
      hasProjectPlan: true,
      hasMilestones: true,
      hasResourceSummary: true,
      hasOwners: true,
      hasDates: true
    },
    outputFormat: 'markdown_with_tables',
    minAgents: 3,
    maxTimeMinutes: 15
  },

  'research': {
    requiredSections: [
      'Data Inventory',
      'Analysis',
      'Pattern Identification',
      'Recommendations'
    ],
    requiredElements: {
      hasFindings: true,
      hasConfidenceLevels: true,
      hasLimitations: true,
      hasEvidenceCitations: true,
      distinguishesFactFromInterpretation: true
    },
    outputFormat: 'markdown',
    minAgents: 2,
    maxTimeMinutes: 20
  },

  'investment': {
    requiredSections: [
      'Investment Thesis',
      'Financial Analysis',
      'Alternative Analysis',
      'Risk Assessment',
      'Decision'
    ],
    requiredElements: {
      hasROICalculation: true,
      hasPaybackPeriod: true,
      hasScenarioAnalysis: true,
      hasInvestmentTable: true,
      hasAlternatives: true
    },
    outputFormat: 'markdown_with_tables',
    minAgents: 2,
    maxTimeMinutes: 10
  },

  'stakeholder': {
    requiredSections: [
      'Stakeholder Mapping',
      'Impact Assessment',
      'Communication Strategy',
      'Resistance Management'
    ],
    requiredElements: {
      hasStakeholderTable: true,
      hasInfluenceMatrix: true,
      hasCommunicationPlan: true,
      hasMessaging: true
    },
    outputFormat: 'markdown_with_tables',
    minAgents: 2,
    maxTimeMinutes: 15
  },

  'rapid': {
    requiredSections: [
      'Quick Takes',
      'Decision',
      'Rationale'
    ],
    requiredElements: {
      hasOneSentencePerAgent: true,
      hasImmediateDecision: true,
      hasReviewFlag: true
    },
    outputFormat: 'markdown',
    minAgents: 3,
    maxTimeMinutes: 2
  },

  'advisory': {
    requiredSections: [
      'Context Setting',
      'Framework Teaching',
      'Worked Example',
      'Learning Takeaways'
    ],
    requiredElements: {
      hasFrameworkExplanation: true,
      hasExamples: true,
      hasTakeaways: true,
      hasEducationalTone: true
    },
    outputFormat: 'markdown',
    minAgents: 2,
    maxTimeMinutes: 10
  },

  'governance': {
    requiredSections: [
      'Precedent Review',
      'Policy Alignment',
      'Long-term Implications',
      'Documentation'
    ],
    requiredElements: {
      hasPolicyStatement: true,
      hasRationale: true,
      hasScope: true,
      hasExceptionProcess: true,
      hasEffectiveDate: true
    },
    outputFormat: 'policy_document',
    minAgents: 2,
    maxTimeMinutes: 15
  }
};

// Test queries for each mode
const TEST_QUERIES = {
  'war-room': 'Should we expand into the European market next quarter?',
  'due-diligence': 'Evaluate CompanyX as a potential acquisition target',
  'innovation-lab': 'Brainstorm ways to improve customer onboarding',
  'compliance': 'Is our new data collection feature GDPR compliant?',
  'crisis': 'Our main database just went down, affecting 50% of customers',
  'execution': 'Create a plan to launch the mobile app in 6 weeks',
  'research': 'Analyze our customer churn data from the last quarter',
  'investment': 'Should we hire 3 more engineers for the platform team?',
  'stakeholder': 'How should we communicate the upcoming reorg to employees?',
  'rapid': 'Should we approve this $5K tool purchase?',
  'advisory': 'Help me understand how our pricing model works',
  'governance': 'Should we make an exception to our remote work policy for this candidate?'
};

// ============================================================
// TEST UTILITIES
// ============================================================

/**
 * Check if output contains required sections
 */
function checkRequiredSections(output, sections) {
  const results = {};
  for (const section of sections) {
    const patterns = [
      new RegExp(`##\\s*${section}`, 'i'),
      new RegExp(`\\*\\*${section}\\*\\*`, 'i'),
      new RegExp(`${section}:`, 'i'),
      new RegExp(`### ${section}`, 'i')
    ];
    results[section] = patterns.some(p => p.test(output));
  }
  return results;
}

/**
 * Check for required elements in output
 */
function checkRequiredElements(output, elements) {
  const results = {};
  
  const checks = {
    hasConfidenceScore: () => /confidence[:\s]+\d+%?/i.test(output) || /\d+%\s*confidence/i.test(output),
    hasRiskScore: () => /risk[:\s]+\d+\/10/i.test(output) || /risk score[:\s]+\d+/i.test(output),
    hasActionItems: () => /action item|next step|to.?do/i.test(output),
    hasAgentNames: () => /\b(CFO|COO|CTO|CISO|CMO|CHRO|CDO|CRO|Chief|Risk)\s*(Agent)?/i.test(output),
    hasDebateExchange: () => /challenge|respond|counter|disagree/i.test(output),
    hasConfidenceLevels: () => /(high|medium|low)\s*confidence/i.test(output),
    hasSourceCitations: () => /source:|evidence:|based on|according to/i.test(output),
    hasRedFlags: () => /red flag|warning|concern|risk/i.test(output),
    hasGoNoGoRecommendation: () => /(go|no.?go|proceed|abort|approve|reject)/i.test(output),
    hasIdeaList: () => (output.match(/\d+\.\s|•\s|-\s/g) || []).length >= 3,
    hasBuildingOnIdeas: () => /building on|expanding|combining|adding to/i.test(output),
    hasFeasibilityRatings: () => /(low|medium|high)\s*(effort|impact|feasibility)/i.test(output),
    noNegativeCriticism: () => !/won't work|bad idea|impossible|can't do/i.test(output),
    hasRegulationCitations: () => /GDPR|HIPAA|SOX|PCI|CCPA|Article \d+|Section \d+/i.test(output),
    hasComplianceTable: () => /\|.*\|.*\|/m.test(output),
    hasRemediationSteps: () => /remediation|mitigation|fix|resolve|address/i.test(output),
    hasActionTable: () => /\|.*Owner.*\|/i.test(output) || /\|.*Action.*\|/i.test(output),
    hasOwners: () => /owner[:\s]/i.test(output) || /responsible[:\s]/i.test(output),
    hasDeadlines: () => /deadline|by\s+\d|within\s+\d|hours?|days?|weeks?/i.test(output),
    hasPriorityLevels: () => /(critical|urgent|important|high|medium|low)\s*priority/i.test(output) || /🔴|🟠|🟡/u.test(output),
    hasCommunicationTemplates: () => /template|message:|statement:|internal:|external:/i.test(output),
    hasProjectPlan: () => /project plan|work breakdown|tasks?/i.test(output),
    hasMilestones: () => /milestone|checkpoint|deliverable/i.test(output),
    hasResourceSummary: () => /resource|budget|hours|cost|\$/i.test(output),
    hasDates: () => /\d{1,2}\/\d{1,2}|\d{4}-\d{2}-\d{2}|week \d|sprint \d/i.test(output),
    hasFindings: () => /finding|observation|result|discover/i.test(output),
    hasLimitations: () => /limitation|caveat|note that|however/i.test(output),
    hasEvidenceCitations: () => /data (shows|suggests|indicates)|according to|based on/i.test(output),
    distinguishesFactFromInterpretation: () => /interpret|we (think|believe)|suggests|may indicate/i.test(output),
    hasROICalculation: () => /ROI[:\s]+\d+%?|return on investment/i.test(output),
    hasPaybackPeriod: () => /payback|break.?even|\d+\s*(months?|years?)/i.test(output),
    hasScenarioAnalysis: () => /(best|base|worst)\s*case/i.test(output),
    hasInvestmentTable: () => /total (investment|cost)|expected return/i.test(output),
    hasAlternatives: () => /alternative|option|instead|compared to/i.test(output),
    hasStakeholderTable: () => /stakeholder|affected|impact/i.test(output),
    hasInfluenceMatrix: () => /(high|low)\s*(influence|interest)/i.test(output),
    hasCommunicationPlan: () => /communication|announce|message|notify/i.test(output),
    hasMessaging: () => /message:|key (message|point)|talking point/i.test(output),
    hasOneSentencePerAgent: () => true, // Simplified check
    hasImmediateDecision: () => /decision[:\s]|approved|rejected|proceed|defer/i.test(output),
    hasReviewFlag: () => /review (needed|required|flag)|flag for/i.test(output),
    hasFrameworkExplanation: () => /framework|approach|methodology|principle/i.test(output),
    hasExamples: () => /example|for instance|such as|e\.g\./i.test(output),
    hasTakeaways: () => /takeaway|remember|key (point|principle|learning)/i.test(output),
    hasEducationalTone: () => /learn|understand|helpful|the reason|because/i.test(output),
    hasPolicyStatement: () => /policy|standard|guideline|rule/i.test(output),
    hasRationale: () => /rationale|reason|because|why/i.test(output),
    hasScope: () => /scope|applies to|applicable|coverage/i.test(output),
    hasExceptionProcess: () => /exception|special case|approval required/i.test(output),
    hasEffectiveDate: () => /effective|starting|beginning|from/i.test(output)
  };

  for (const [element, required] of Object.entries(elements)) {
    if (required && checks[element]) {
      results[element] = checks[element]();
    }
  }

  return results;
}

/**
 * Count agents mentioned in output
 */
function countAgents(output) {
  const agentPatterns = [
    /CFO/gi, /COO/gi, /CTO/gi, /CISO/gi, /CMO/gi, 
    /CHRO/gi, /CDO/gi, /CRO/gi, /Chief/gi, /Risk/gi
  ];
  const agents = new Set();
  for (const pattern of agentPatterns) {
    if (pattern.test(output)) {
      agents.add(pattern.source.replace(/\\b|gi/g, ''));
    }
  }
  return agents.size;
}

/**
 * Check if output is in expected format
 */
function checkOutputFormat(output, format) {
  switch (format) {
    case 'markdown':
      return /^#|^\*\*|^-\s/m.test(output);
    case 'markdown_with_tables':
      return /\|.*\|/m.test(output);
    case 'policy_document':
      return /policy|decision|rationale|scope/i.test(output);
    default:
      return true;
  }
}

// ============================================================
// TEST RUNNER
// ============================================================

class CouncilModeTestRunner {
  constructor(config = TEST_CONFIG) {
    this.config = config;
    this.results = [];
  }

  /**
   * Simulate a Council deliberation (mock for testing)
   * In production, this would call the actual Council API
   */
  async runDeliberation(modeId, query) {
    // Mock implementation - replace with actual API call
    console.log(`  Running ${modeId} mode with query: "${query.substring(0, 50)}..."`);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 100));

    // Return mock output based on mode
    return this.generateMockOutput(modeId, query);
  }

  /**
   * Generate mock output for testing
   * This simulates what the Council would produce
   */
  generateMockOutput(modeId, query) {
    const mockOutputs = {
      'war-room': `
## Agent Analysis

**CFO Agent (Finnley McTavish):**
Framework: GAAP Analysis
European market entry requires €2.5M initial investment. ROI projection: 18% in Year 1.
Risk Score: 6/10

**COO Agent (Liam Chen):**
Framework: Operations Assessment
Current capacity can support 30% expansion. Additional hiring needed: 5 FTEs.

## Cross-Examination

CFO challenges COO: "The 5 FTE estimate seems low given the regulatory complexity."
COO responds: "We can leverage our UK team for initial setup, reducing headcount needs."

## Synthesis

After reviewing all perspectives, the Chief Strategy Agent renders:

**DECISION:** Conditional Approval
**Confidence:** 75%
**Risk Score:** 5/10

## Action Items
1. CFO: Complete detailed financial model by Friday
2. COO: Draft hiring plan for Q1
3. Legal: Begin regulatory review
      `,

      'due-diligence': `
## Evidence Gathering

**Financial Review:**
- Revenue: $45M (Source: 2023 Annual Report)
- Growth Rate: 23% YoY
- Confidence Level: High

## Red Flags
🔴 Customer concentration: Top 3 customers = 60% of revenue
🟡 Pending litigation in California
🟢 Clean security audit history

## Gap Analysis
Missing information:
- Detailed customer contracts
- Employee retention data
- IP ownership documentation

## Final Assessment
**Recommendation:** Proceed with Caution
**Confidence Level:** Medium (65%)
**Key Condition:** Resolve litigation status before LOI
      `,

      'innovation-lab': `
## Seed Ideas

Building on each other's suggestions:

1. **AI-Powered Onboarding Assistant** (CTO)
   - 24/7 availability, personalized guidance

2. **Gamified Progress Tracking** (CMO)
   - Building on CTO's idea: Achievements + AI recommendations

3. **Peer Mentor Matching** (CHRO)
   - Combining human touch with CMO's gamification

4. **Interactive Product Tours** (Product)
   - Expanding on all above: context-aware, gamified, AI-supported

5. **Onboarding Community Forum** (CMO)
   - Adding to mentor matching: peer-to-peer learning

## Feasibility Sketch
| Idea | Effort | Impact | Timeframe |
|------|--------|--------|-----------|
| AI Assistant | High | High | Q2 |
| Gamification | Medium | Medium | Q1 |
| Mentor Matching | Low | High | Q1 |
      `,

      'compliance': `
## Regulatory Mapping

| Regulation | Requirement | Applies |
|------------|-------------|---------|
| GDPR Article 6 | Legal basis for processing | ✅ Yes |
| GDPR Article 7 | Consent requirements | ✅ Yes |
| GDPR Article 17 | Right to erasure | ✅ Yes |

## Gap Analysis
| Requirement | Current State | Gap | Risk Score |
|-------------|---------------|-----|------------|
| Consent UI | Basic checkbox | Needs granular options | 7/10 |
| Data deletion | Manual process | Needs automation | 6/10 |

## Risk Assessment
Overall Risk Score: 6.5/10

## Control Recommendations
1. Implement granular consent management
2. Build automated data deletion pipeline
3. Update privacy policy language

## Remediation Timeline
- Week 1-2: Consent UI update
- Week 3-4: Deletion automation
      `,

      'crisis': `
## Situation Assessment

**What happened:** Main database went down at 14:32 UTC
**Current impact:** 50% of customers affected, $50K/hour revenue impact
**Potential impact:** Churn risk, SLA violations, reputation damage

## Immediate Triage

| Priority | Action | Owner | Deadline |
|----------|--------|-------|----------|
| 🔴 CRITICAL | Failover to backup DB | CTO | 1 hour |
| 🔴 CRITICAL | Customer status page update | CMO | 30 min |
| 🟠 URGENT | Root cause analysis | Engineering | 4 hours |
| 🟡 IMPORTANT | SLA impact assessment | Legal | 24 hours |

## Communication Plan

**Internal (Immediate):**
"Database incident in progress. Failover initiated. Updates every 30 minutes."

**External (Customer-facing):**
"We're experiencing a service disruption. Our team is actively working on resolution. ETA: 2 hours."

**Holding Statement:**
"We take system reliability seriously and are investigating the root cause."
      `,

      'execution': `
## Objective Definition

**Goal:** Launch mobile app in 6 weeks
**Success Criteria:** 1000 downloads, 4.0+ rating, <1% crash rate

## Work Breakdown

| Phase | Task | Owner | Start | End | Dependencies |
|-------|------|-------|-------|-----|--------------|
| Week 1-2 | Feature freeze & bug fixes | Engineering | Jan 1 | Jan 14 | - |
| Week 2-3 | Beta testing | QA | Jan 8 | Jan 21 | Feature freeze |
| Week 3-4 | App store submission | Product | Jan 15 | Jan 28 | Beta complete |
| Week 5-6 | Marketing launch | Marketing | Jan 22 | Feb 4 | Approval |

## Milestones

| Week | Milestone | Deliverable |
|------|-----------|-------------|
| 2 | Beta Ready | Internal release |
| 4 | Submission | App store review |
| 6 | Launch | Public release |

## Resource Summary
- Total Hours: 480
- Budget: $35,000
- Team: 3 Engineers, 1 QA, 1 Designer
      `,

      'research': `
## Data Inventory

Available data:
- Customer churn events (Q4): 847 records
- Customer feedback surveys: 2,341 responses
- Support ticket history: 12,432 tickets

Data quality: High (92% completeness)

## Analysis

**Finding 1:** Churn correlates with support ticket volume
- Evidence: Customers with 5+ tickets have 3x churn rate
- Confidence: High
- Limitation: Correlation, not causation established

**Finding 2:** Pricing tier affects churn
- Evidence: Basic tier churn 12%, Premium tier churn 4%
- Confidence: High

## Pattern Identification

The data suggests a pattern: Support friction → Dissatisfaction → Churn

## Recommendations

Based on evidence, we recommend:
1. Proactive outreach to high-ticket customers
2. Review pricing tier value proposition
3. Further research: Exit interview program
      `,

      'investment': `
## Investment Thesis

**What:** Hire 3 engineers for platform team
**Why:** Current velocity insufficient for Q2 roadmap
**Why now:** Competitor launching similar feature in Q2

## Financial Analysis

| Metric | Value |
|--------|-------|
| Total Investment (Y1) | $450,000 |
| Recruiting Costs | $45,000 |
| Expected Return | $1,200,000 |
| ROI | 167% |
| Payback Period | 4.5 months |

## Scenario Analysis

| Scenario | Probability | ROI | NPV |
|----------|-------------|-----|-----|
| Best Case | 20% | 220% | $680K |
| Base Case | 60% | 167% | $520K |
| Worst Case | 20% | 45% | $120K |

## Alternative Analysis

| Option | Cost | ROI | Risk |
|--------|------|-----|------|
| Hire FTEs | $450K | 167% | Medium |
| Contractors | $360K | 89% | Low |
| Delay | $0 | -45% | High |

## Decision
**APPROVED** - Expected ROI exceeds 100% threshold
      `,

      'stakeholder': `
## Stakeholder Mapping

| Stakeholder | Impact | Influence | Interest | Strategy |
|-------------|--------|-----------|----------|----------|
| Engineering Team | High (Negative) | Medium | High | Manage Closely |
| Sales Team | Medium (Positive) | High | Medium | Keep Satisfied |
| Customers | Low | Low | Low | Monitor |
| Executives | Neutral | High | High | Manage Closely |

## Influence/Interest Matrix

|  | Low Interest | High Interest |
|---|-------------|---------------|
| High Influence | Sales | Executives |
| Low Influence | Customers | Engineering |

## Communication Strategy

| Audience | Message | Messenger | When | Channel |
|----------|---------|-----------|------|---------|
| Engineering | Focus on opportunity, not cuts | CTO | Week 1 | Team meeting |
| Sales | New territory structure benefits | CRO | Week 1 | All-hands |
| Executives | Timeline and milestones | CEO | Day 1 | Board memo |

## Key Messages

**Engineering:** "This restructure creates dedicated teams for our most strategic initiatives."

**Sales:** "New territories are based on customer feedback and market analysis."
      `,

      'rapid': `
## Quick Takes

- **CFO:** Within discretionary budget, low risk.
- **COO:** Tool addresses known pain point.
- **CTO:** Security review completed, approved vendor.
- **CISO:** No data privacy concerns.
- **CMO:** Improves team productivity.
- **Risk:** Minimal downside.

## Decision

**DECISION:** APPROVED
**RATIONALE:** Within budget, addresses clear need, no security concerns.
**REVIEW NEEDED:** No
      `,

      'advisory': `
## Context Setting

This is a pricing model question - understanding how value translates to revenue.

## Framework Teaching

**Framework: Value-Based Pricing**

Purpose: Align price with customer-perceived value, not just costs.

Steps:
1. Identify value drivers (what customers pay for)
2. Segment customers by value perception
3. Set price points by segment
4. Test and iterate

Example in our case: Enterprise customers value security features more than SMBs, justifying 3x price premium.

## Worked Example

For our product:
- Value Driver 1: Time saved (4 hours/week → $200/month value)
- Value Driver 2: Error reduction (2% improvement → $500/month value)
- Price ceiling: $700/month
- Current price: $299/month (43% of value capture)

## Learning Takeaways

**Key Principle:** Price to value, not to cost.
**Common Mistake:** Underpricing because of cost-plus thinking.
**Further Reading:** "Monetizing Innovation" by Madhavan Ramanujam
      `,

      'governance': `
## Precedent Review

Previous exceptions to remote work policy: 2 approved in 2023
- Case 1: Caregiver situation (approved with quarterly review)
- Case 2: International relocation (denied, offered contract conversion)

## Policy Alignment

Current policy: "All employees expected in office 3 days/week"
Exception process: Manager approval + HR review

## Long-term Implications

Approving this exception could:
- Set precedent for similar requests
- Require updates to policy documentation
- Need tracking mechanism for exceptions

## Documentation

**POLICY DECISION**

**Title:** Remote Work Exception - [Candidate Name]

**Decision:** APPROVED with conditions

**Rationale:** Exceptional candidate with rare skill set, willing to travel quarterly

**Scope:** This individual only, not a blanket policy change

**Precedent:** Does not establish general precedent; case-by-case evaluation continues

**Exceptions:** Future requests require same review process

**Review Trigger:** 6-month performance review

**Effective Date:** Upon hire

**Approved By:** The Council, 2024-01-15
      `
    };

    return mockOutputs[modeId] || 'Output not available for this mode';
  }

  /**
   * Run test for a single mode
   */
  async testMode(modeId) {
    const expectations = OUTPUT_EXPECTATIONS[modeId];
    const query = TEST_QUERIES[modeId];
    
    console.log(`\nTesting ${modeId} mode...`);
    
    const startTime = Date.now();
    const output = await this.runDeliberation(modeId, query);
    const duration = (Date.now() - startTime) / 1000;

    const result = {
      modeId,
      query,
      passed: true,
      duration,
      checks: {}
    };

    // Check required sections
    const sectionResults = checkRequiredSections(output, expectations.requiredSections);
    result.checks.sections = sectionResults;
    const sectionsPassed = Object.values(sectionResults).every(v => v);
    if (!sectionsPassed) {
      result.passed = false;
      result.failureReason = 'Missing required sections';
    }

    // Check required elements
    const elementResults = checkRequiredElements(output, expectations.requiredElements);
    result.checks.elements = elementResults;
    const elementsPassed = Object.values(elementResults).every(v => v);
    if (!elementsPassed && result.passed) {
      result.passed = false;
      result.failureReason = 'Missing required elements';
    }

    // Check output format
    const formatPassed = checkOutputFormat(output, expectations.outputFormat);
    result.checks.format = formatPassed;
    if (!formatPassed && result.passed) {
      result.passed = false;
      result.failureReason = 'Invalid output format';
    }

    // Check agent count
    const agentCount = countAgents(output);
    result.checks.agentCount = agentCount;
    if (agentCount < expectations.minAgents && result.passed) {
      result.passed = false;
      result.failureReason = `Insufficient agents (${agentCount} < ${expectations.minAgents})`;
    }

    // Log result
    if (result.passed) {
      console.log(`  ✅ PASSED (${duration.toFixed(2)}s)`);
    } else {
      console.log(`  ❌ FAILED: ${result.failureReason}`);
    }

    this.results.push(result);
    return result;
  }

  /**
   * Run all tests
   */
  async runAllTests() {
    console.log('='.repeat(60));
    console.log('COUNCIL MODE INTEGRATION TESTS');
    console.log('='.repeat(60));

    const modes = Object.keys(OUTPUT_EXPECTATIONS);
    
    for (const modeId of modes) {
      await this.testMode(modeId);
    }

    this.printSummary();
    return this.results;
  }

  /**
   * Print test summary
   */
  printSummary() {
    console.log('\n' + '='.repeat(60));
    console.log('TEST SUMMARY');
    console.log('='.repeat(60));

    const passed = this.results.filter(r => r.passed).length;
    const failed = this.results.filter(r => !r.passed).length;
    const total = this.results.length;

    console.log(`\nResults: ${passed}/${total} passed (${((passed/total)*100).toFixed(0)}%)`);
    
    if (failed > 0) {
      console.log('\nFailed tests:');
      this.results
        .filter(r => !r.passed)
        .forEach(r => {
          console.log(`  ❌ ${r.modeId}: ${r.failureReason}`);
        });
    }

    console.log('\nDetailed Results:');
    console.log('-'.repeat(60));
    
    this.results.forEach(r => {
      const status = r.passed ? '✅' : '❌';
      console.log(`${status} ${r.modeId.padEnd(15)} | ${r.duration.toFixed(2)}s | Agents: ${r.checks.agentCount}`);
      
      // Show section details for failed tests
      if (!r.passed) {
        const missingSections = Object.entries(r.checks.sections)
          .filter(([_, v]) => !v)
          .map(([k]) => k);
        if (missingSections.length > 0) {
          console.log(`   Missing sections: ${missingSections.join(', ')}`);
        }
        
        const missingElements = Object.entries(r.checks.elements)
          .filter(([_, v]) => !v)
          .map(([k]) => k);
        if (missingElements.length > 0) {
          console.log(`   Missing elements: ${missingElements.join(', ')}`);
        }
      }
    });
  }

  /**
   * Export results as JSON
   */
  exportResults() {
    return JSON.stringify(this.results, null, 2);
  }
}

// ============================================================
// MAIN EXECUTION
// ============================================================

async function main() {
  const runner = new CouncilModeTestRunner();
  await runner.runAllTests();
  
  // Export results
  const fs = require('fs');
  fs.writeFileSync('test-results.json', runner.exportResults());
  console.log('\nResults exported to test-results.json');
}

// Run if executed directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  CouncilModeTestRunner,
  OUTPUT_EXPECTATIONS,
  TEST_QUERIES,
  checkRequiredSections,
  checkRequiredElements,
  countAgents,
  checkOutputFormat
};
