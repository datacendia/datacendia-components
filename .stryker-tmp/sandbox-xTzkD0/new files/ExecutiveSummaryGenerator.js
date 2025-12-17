/**
 * Council Executive Summary Generator
 * 
 * Extracts key information from long deliberations and formats
 * for different audiences (executives, Slack, email, presentations)
 */
// @ts-nocheck


// ============================================================
// SUMMARY EXTRACTION ENGINE
// ============================================================

/**
 * Extract structured data from a deliberation output
 */
function extractDeliberationData(deliberationText, metadata = {}) {
  const data = {
    // Core decision
    decision: extractDecision(deliberationText),
    confidence: extractConfidence(deliberationText),
    riskScore: extractRiskScore(deliberationText),
    
    // Key points
    keyFindings: extractKeyFindings(deliberationText),
    risks: extractRisks(deliberationText),
    opportunities: extractOpportunities(deliberationText),
    
    // Actions
    actionItems: extractActionItems(deliberationText),
    nextSteps: extractNextSteps(deliberationText),
    
    // Dissent
    dissentingViews: extractDissentingViews(deliberationText),
    unresolvedQuestions: extractUnresolvedQuestions(deliberationText),
    
    // Metadata
    mode: metadata.mode || 'unknown',
    query: metadata.query || '',
    duration: metadata.duration || 'N/A',
    agentCount: countAgentsInvolved(deliberationText),
    wordCount: deliberationText.split(/\s+/).length,
    timestamp: metadata.timestamp || new Date().toISOString()
  };

  return data;
}

/**
 * Extract the main decision/recommendation
 */
function extractDecision(text) {
  const patterns = [
    /(?:DECISION|Decision|Recommendation)[:\s]+([^\n]+)/i,
    /(?:APPROVED|REJECTED|PROCEED|DEFER|CONDITIONAL)[^\n]*/i,
    /(?:The Council recommends?|We recommend)[:\s]*([^\n]+)/i,
    /(?:Final (?:decision|assessment|recommendation))[:\s]*([^\n]+)/i
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      return match[1] || match[0];
    }
  }

  // Fallback: look for decision-like statements
  const sentences = text.split(/[.!?]+/);
  for (const sentence of sentences) {
    if (/should|recommend|approve|reject|proceed|defer/i.test(sentence)) {
      return sentence.trim();
    }
  }

  return 'Decision not explicitly stated';
}

/**
 * Extract confidence level
 */
function extractConfidence(text) {
  const patterns = [
    /confidence[:\s]+(\d+)%?/i,
    /(\d+)%\s*confidence/i,
    /confidence level[:\s]+(high|medium|low)/i
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      const value = match[1];
      if (/\d+/.test(value)) {
        return { score: parseInt(value), level: getConfidenceLevel(parseInt(value)) };
      }
      return { score: null, level: value.toLowerCase() };
    }
  }

  return { score: null, level: 'not specified' };
}

function getConfidenceLevel(score) {
  if (score >= 80) return 'high';
  if (score >= 60) return 'medium';
  if (score >= 40) return 'low';
  return 'very low';
}

/**
 * Extract risk score
 */
function extractRiskScore(text) {
  const patterns = [
    /risk[:\s]+(\d+)\/10/i,
    /risk score[:\s]+(\d+)/i,
    /(\d+)\/10\s*risk/i
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      return parseInt(match[1]);
    }
  }

  return null;
}

/**
 * Extract key findings (bullet points or numbered items)
 */
function extractKeyFindings(text) {
  const findings = [];
  
  // Look for findings section
  const findingsSection = text.match(/(?:Key Findings?|Findings?|Key Points?)[:\s]*\n([\s\S]*?)(?=\n##|\n\*\*[A-Z]|\n###|$)/i);
  if (findingsSection) {
    const items = findingsSection[1].match(/(?:^|\n)\s*[-•*]\s*([^\n]+)/g);
    if (items) {
      findings.push(...items.map(i => i.replace(/^\s*[-•*]\s*/, '').trim()));
    }
  }

  // Also look for "finding:" patterns
  const findingPatterns = text.matchAll(/finding[:\s]+([^\n]+)/gi);
  for (const match of findingPatterns) {
    findings.push(match[1].trim());
  }

  return findings.slice(0, 5); // Top 5 findings
}

/**
 * Extract risks mentioned
 */
function extractRisks(text) {
  const risks = [];
  
  // Look for risk section
  const riskSection = text.match(/(?:Risks?|Risk Assessment|Red Flags?|Concerns?)[:\s]*\n([\s\S]*?)(?=\n##|\n\*\*[A-Z]|\n###|$)/i);
  if (riskSection) {
    const items = riskSection[1].match(/(?:^|\n)\s*[-•*🔴🟠🟡]\s*([^\n]+)/g);
    if (items) {
      risks.push(...items.map(i => i.replace(/^\s*[-•*🔴🟠🟡]\s*/, '').trim()));
    }
  }

  // Also look for explicit risk mentions
  const riskPatterns = text.matchAll(/(?:risk|concern|warning|red flag)[:\s]+([^\n]+)/gi);
  for (const match of riskPatterns) {
    risks.push(match[1].trim());
  }

  return [...new Set(risks)].slice(0, 5); // Dedupe, top 5
}

/**
 * Extract opportunities mentioned
 */
function extractOpportunities(text) {
  const opportunities = [];
  
  const patterns = [
    /opportunity[:\s]+([^\n]+)/gi,
    /potential[:\s]+([^\n]+)/gi,
    /upside[:\s]+([^\n]+)/gi
  ];

  for (const pattern of patterns) {
    const matches = text.matchAll(pattern);
    for (const match of matches) {
      opportunities.push(match[1].trim());
    }
  }

  return opportunities.slice(0, 3);
}

/**
 * Extract action items
 */
function extractActionItems(text) {
  const actions = [];
  
  // Look for action items section
  const actionSection = text.match(/(?:Action Items?|Next Steps?|Actions?|To.?Do)[:\s]*\n([\s\S]*?)(?=\n##|\n\*\*[A-Z]|\n###|$)/i);
  if (actionSection) {
    const items = actionSection[1].match(/(?:^|\n)\s*(?:\d+[.)]|\s*[-•*])\s*([^\n]+)/g);
    if (items) {
      actions.push(...items.map(i => {
        const cleaned = i.replace(/^\s*(?:\d+[.)]|\s*[-•*])\s*/, '').trim();
        // Try to extract owner
        const ownerMatch = cleaned.match(/^([A-Z]{2,}[^:]*)[:\s]+(.+)/);
        if (ownerMatch) {
          return { owner: ownerMatch[1].trim(), action: ownerMatch[2].trim() };
        }
        return { owner: 'TBD', action: cleaned };
      }));
    }
  }

  // Also look for table-based action items
  const tableRows = text.matchAll(/\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|/g);
  for (const row of tableRows) {
    if (/action|task|owner/i.test(row[0])) continue; // Skip header
    actions.push({ action: row[1].trim(), owner: row[2]?.trim() || 'TBD' });
  }

  return actions.slice(0, 7); // Top 7 actions
}

/**
 * Extract next steps
 */
function extractNextSteps(text) {
  const nextStepsSection = text.match(/(?:Next Steps?|Recommendations?|Moving Forward)[:\s]*\n([\s\S]*?)(?=\n##|\n\*\*[A-Z]|\n###|$)/i);
  if (nextStepsSection) {
    const items = nextStepsSection[1].match(/(?:^|\n)\s*(?:\d+[.)]|\s*[-•*])\s*([^\n]+)/g);
    if (items) {
      return items.map(i => i.replace(/^\s*(?:\d+[.)]|\s*[-•*])\s*/, '').trim()).slice(0, 5);
    }
  }
  return [];
}

/**
 * Extract dissenting views
 */
function extractDissentingViews(text) {
  const dissents = [];
  
  const patterns = [
    /(?:disagree|dissent|challenge|counter|however)[:\s]*([^\n]+)/gi,
    /([A-Z]+)\s+(?:challenges?|disagrees?)[:\s]*([^\n]+)/gi
  ];

  for (const pattern of patterns) {
    const matches = text.matchAll(pattern);
    for (const match of matches) {
      dissents.push(match[1]?.trim() || match[0].trim());
    }
  }

  return dissents.slice(0, 3);
}

/**
 * Extract unresolved questions
 */
function extractUnresolvedQuestions(text) {
  const questions = [];
  
  const patterns = [
    /(?:unresolved|open question|needs? (?:more|further)|unclear)[:\s]*([^\n]+)/gi,
    /(?:gap|missing|unknown)[:\s]*([^\n]+)/gi,
    /\?([^\n?]+\?)/g
  ];

  for (const pattern of patterns) {
    const matches = text.matchAll(pattern);
    for (const match of matches) {
      questions.push(match[1]?.trim() || match[0].trim());
    }
  }

  return questions.slice(0, 3);
}

/**
 * Count agents involved
 */
function countAgentsInvolved(text) {
  const agents = new Set();
  const agentPatterns = [
    /CFO/gi, /COO/gi, /CTO/gi, /CISO/gi, /CMO/gi,
    /CHRO/gi, /CDO/gi, /CRO/gi, /Chief/gi, /Risk/gi
  ];
  
  for (const pattern of agentPatterns) {
    if (pattern.test(text)) {
      agents.add(pattern.source.replace(/gi$/, ''));
    }
  }
  
  return agents.size;
}

// ============================================================
// SUMMARY FORMATTERS
// ============================================================

/**
 * Generate executive summary (full format)
 */
function generateExecutiveSummary(data) {
  const confidenceEmoji = data.confidence.level === 'high' ? '🟢' : 
                          data.confidence.level === 'medium' ? '🟡' : '🔴';
  
  const riskEmoji = data.riskScore <= 3 ? '🟢' : 
                    data.riskScore <= 6 ? '🟡' : '🔴';

  let summary = `# Executive Summary

## Decision
**${data.decision}**

## Key Metrics
| Metric | Value |
|--------|-------|
| Confidence | ${confidenceEmoji} ${data.confidence.score ? `${data.confidence.score}%` : data.confidence.level} |
| Risk Level | ${riskEmoji} ${data.riskScore ? `${data.riskScore}/10` : 'Not assessed'} |
| Deliberation Time | ${data.duration} |
| Agents Involved | ${data.agentCount} |

`;

  if (data.keyFindings.length > 0) {
    summary += `## Key Findings
${data.keyFindings.map(f => `- ${f}`).join('\n')}

`;
  }

  if (data.risks.length > 0) {
    summary += `## Risks
${data.risks.map(r => `- ⚠️ ${r}`).join('\n')}

`;
  }

  if (data.actionItems.length > 0) {
    summary += `## Action Items
| Action | Owner |
|--------|-------|
${data.actionItems.map(a => `| ${a.action} | ${a.owner} |`).join('\n')}

`;
  }

  if (data.dissentingViews.length > 0) {
    summary += `## Dissenting Views
${data.dissentingViews.map(d => `- 💬 ${d}`).join('\n')}

`;
  }

  if (data.unresolvedQuestions.length > 0) {
    summary += `## Open Questions
${data.unresolvedQuestions.map(q => `- ❓ ${q}`).join('\n')}

`;
  }

  summary += `---
*Generated from ${data.mode} mode deliberation (${data.wordCount} words)*
*${new Date(data.timestamp).toLocaleString()}*
`;

  return summary;
}

/**
 * Generate TL;DR (ultra-short format)
 */
function generateTLDR(data) {
  const confidence = data.confidence.score ? `${data.confidence.score}%` : data.confidence.level;
  const risk = data.riskScore ? `${data.riskScore}/10 risk` : '';
  
  let tldr = `**TL;DR:** ${data.decision}`;
  
  if (confidence || risk) {
    tldr += ` (${[confidence + ' confidence', risk].filter(Boolean).join(', ')})`;
  }

  if (data.actionItems.length > 0) {
    tldr += `\n\n**Next:** ${data.actionItems[0].action}`;
    if (data.actionItems[0].owner !== 'TBD') {
      tldr += ` (${data.actionItems[0].owner})`;
    }
  }

  return tldr;
}

/**
 * Generate Slack-formatted summary
 */
function generateSlackSummary(data) {
  const confidenceEmoji = data.confidence.level === 'high' ? ':large_green_circle:' : 
                          data.confidence.level === 'medium' ? ':large_yellow_circle:' : ':red_circle:';

  let slack = `*🏛️ Council Decision: ${data.mode.replace('-', ' ').toUpperCase()}*

>*${data.decision}*

*Metrics:* ${confidenceEmoji} ${data.confidence.score || data.confidence.level} confidence`;

  if (data.riskScore) {
    slack += ` | Risk: ${data.riskScore}/10`;
  }

  if (data.actionItems.length > 0) {
    slack += `\n\n*Action Items:*`;
    data.actionItems.slice(0, 3).forEach(a => {
      slack += `\n• ${a.action}${a.owner !== 'TBD' ? ` → _${a.owner}_` : ''}`;
    });
  }

  if (data.risks.length > 0) {
    slack += `\n\n*:warning: Key Risks:*`;
    data.risks.slice(0, 2).forEach(r => {
      slack += `\n• ${r}`;
    });
  }

  slack += `\n\n_${data.agentCount} agents • ${data.duration} • <link|View Full Deliberation>_`;

  return slack;
}

/**
 * Generate email-formatted summary
 */
function generateEmailSummary(data, recipientName = 'Team') {
  const subject = `Council Decision: ${data.decision.substring(0, 50)}...`;
  
  let body = `Hi ${recipientName},

The Council has completed its deliberation. Here's the summary:

DECISION: ${data.decision}

CONFIDENCE: ${data.confidence.score ? `${data.confidence.score}%` : data.confidence.level}
${data.riskScore ? `RISK LEVEL: ${data.riskScore}/10` : ''}

`;

  if (data.keyFindings.length > 0) {
    body += `KEY FINDINGS:
${data.keyFindings.map((f, i) => `${i + 1}. ${f}`).join('\n')}

`;
  }

  if (data.actionItems.length > 0) {
    body += `ACTION ITEMS:
${data.actionItems.map((a, i) => `${i + 1}. ${a.action} (Owner: ${a.owner})`).join('\n')}

`;
  }

  if (data.risks.length > 0) {
    body += `RISKS TO MONITOR:
${data.risks.map((r, i) => `${i + 1}. ${r}`).join('\n')}

`;
  }

  body += `---
This summary was generated from a ${data.duration} ${data.mode} mode deliberation.
${data.agentCount} agents participated, producing ${data.wordCount} words of analysis.

View the full deliberation for complete context and agent debates.

Best,
The Council
`;

  return { subject, body };
}

/**
 * Generate presentation bullet points
 */
function generatePresentationPoints(data) {
  const slides = [];

  // Slide 1: Decision
  slides.push({
    title: 'Council Decision',
    bullets: [
      data.decision,
      `Confidence: ${data.confidence.score ? `${data.confidence.score}%` : data.confidence.level}`,
      data.riskScore ? `Risk Level: ${data.riskScore}/10` : null
    ].filter(Boolean)
  });

  // Slide 2: Key Findings
  if (data.keyFindings.length > 0) {
    slides.push({
      title: 'Key Findings',
      bullets: data.keyFindings.slice(0, 4)
    });
  }

  // Slide 3: Risks
  if (data.risks.length > 0) {
    slides.push({
      title: 'Risks & Concerns',
      bullets: data.risks.slice(0, 4)
    });
  }

  // Slide 4: Action Items
  if (data.actionItems.length > 0) {
    slides.push({
      title: 'Action Items',
      bullets: data.actionItems.slice(0, 5).map(a => 
        `${a.action}${a.owner !== 'TBD' ? ` → ${a.owner}` : ''}`
      )
    });
  }

  // Slide 5: Open Questions
  if (data.unresolvedQuestions.length > 0 || data.dissentingViews.length > 0) {
    slides.push({
      title: 'Open Items',
      bullets: [
        ...data.unresolvedQuestions.slice(0, 2).map(q => `Question: ${q}`),
        ...data.dissentingViews.slice(0, 2).map(d => `Dissent: ${d}`)
      ]
    });
  }

  return slides;
}

/**
 * Generate JSON summary for API consumers
 */
function generateJSONSummary(data) {
  return {
    decision: data.decision,
    confidence: data.confidence,
    risk: data.riskScore,
    findings: data.keyFindings,
    risks: data.risks,
    actions: data.actionItems,
    dissent: data.dissentingViews,
    openQuestions: data.unresolvedQuestions,
    metadata: {
      mode: data.mode,
      query: data.query,
      duration: data.duration,
      agents: data.agentCount,
      words: data.wordCount,
      timestamp: data.timestamp
    }
  };
}

// ============================================================
// MAIN SUMMARY GENERATOR CLASS
// ============================================================

class ExecutiveSummaryGenerator {
  constructor() {
    this.lastDeliberation = null;
    this.lastSummaryData = null;
  }

  /**
   * Process a deliberation and generate summaries
   */
  process(deliberationText, metadata = {}) {
    this.lastDeliberation = deliberationText;
    this.lastSummaryData = extractDeliberationData(deliberationText, metadata);
    return this;
  }

  /**
   * Get full executive summary
   */
  getExecutiveSummary() {
    if (!this.lastSummaryData) throw new Error('No deliberation processed');
    return generateExecutiveSummary(this.lastSummaryData);
  }

  /**
   * Get TL;DR
   */
  getTLDR() {
    if (!this.lastSummaryData) throw new Error('No deliberation processed');
    return generateTLDR(this.lastSummaryData);
  }

  /**
   * Get Slack format
   */
  getSlackSummary() {
    if (!this.lastSummaryData) throw new Error('No deliberation processed');
    return generateSlackSummary(this.lastSummaryData);
  }

  /**
   * Get email format
   */
  getEmailSummary(recipientName) {
    if (!this.lastSummaryData) throw new Error('No deliberation processed');
    return generateEmailSummary(this.lastSummaryData, recipientName);
  }

  /**
   * Get presentation points
   */
  getPresentationPoints() {
    if (!this.lastSummaryData) throw new Error('No deliberation processed');
    return generatePresentationPoints(this.lastSummaryData);
  }

  /**
   * Get JSON format
   */
  getJSONSummary() {
    if (!this.lastSummaryData) throw new Error('No deliberation processed');
    return generateJSONSummary(this.lastSummaryData);
  }

  /**
   * Get raw extracted data
   */
  getData() {
    return this.lastSummaryData;
  }

  /**
   * Get all formats at once
   */
  getAllFormats() {
    return {
      executive: this.getExecutiveSummary(),
      tldr: this.getTLDR(),
      slack: this.getSlackSummary(),
      email: this.getEmailSummary(),
      presentation: this.getPresentationPoints(),
      json: this.getJSONSummary()
    };
  }
}

// ============================================================
// EXPORTS
// ============================================================

module.exports = {
  ExecutiveSummaryGenerator,
  extractDeliberationData,
  generateExecutiveSummary,
  generateTLDR,
  generateSlackSummary,
  generateEmailSummary,
  generatePresentationPoints,
  generateJSONSummary
};

// ============================================================
// DEMO / TEST
// ============================================================

if (require.main === module) {
  // Sample deliberation for testing
  const sampleDeliberation = `
## Agent Analysis

**CFO Agent (Finnley McTavish):**
Framework: GAAP Analysis
European market entry requires €2.5M initial investment. ROI projection: 18% in Year 1.
Risk Score: 6/10

The financial case is borderline. We need signed LOIs before committing.

**COO Agent (Liam Chen):**
Framework: Operations Assessment
Current capacity can support 30% expansion. Additional hiring needed: 5 FTEs.
Timeline concern: Q1 is aggressive given regulatory requirements.

**CISO Agent (Ramesh Patel):**
Framework: GDPR Compliance
GDPR compliance will require significant infrastructure changes.
Risk: Data residency requirements may delay launch by 60 days.

## Cross-Examination

CFO challenges COO: "The 5 FTE estimate seems low given the regulatory complexity."
COO responds: "We can leverage our UK team for initial setup, reducing headcount needs."
CISO counters: "UK post-Brexit doesn't satisfy EU data residency. We need EU-based infrastructure."

## Key Findings

- Market opportunity is real but timing is compressed
- Regulatory hurdles are significant but manageable
- Financial returns depend heavily on Q2 pipeline conversion
- Competitive window closes in 6 months

## Risks

- 🔴 GDPR infrastructure not ready for Q1 launch
- 🟠 Currency exposure with EUR commitments
- 🟡 Talent acquisition in EU market is competitive

## Synthesis

After reviewing all perspectives, the Chief Strategy Agent renders:

**DECISION:** Conditional Approval

Proceed with EU expansion planning, but gate the €2.5M investment on:
1. Signed LOIs totaling €500K by Feb 15
2. GDPR infrastructure assessment complete by Jan 31
3. At least 2 EU-based hires confirmed

**Confidence:** 72%
**Risk Score:** 6/10

## Action Items

1. CFO: Model cash flow scenarios with currency hedging by Friday
2. COO: Draft EU hiring plan, focus on Germany and Netherlands
3. CISO: Complete GDPR gap analysis, deliver infrastructure requirements
4. CRO: Prioritize EU pipeline deals, weekly updates to Council
5. Legal: Begin regulatory filing preparation

## Open Questions

- What is our fallback if Q1 LOI target is not met?
- Should we consider acquisition vs. organic entry?
`;

  const generator = new ExecutiveSummaryGenerator();
  generator.process(sampleDeliberation, {
    mode: 'war-room',
    query: 'Should we expand into the European market next quarter?',
    duration: '8.2 minutes'
  });

  console.log('='.repeat(60));
  console.log('EXECUTIVE SUMMARY');
  console.log('='.repeat(60));
  console.log(generator.getExecutiveSummary());

  console.log('\n' + '='.repeat(60));
  console.log('TL;DR');
  console.log('='.repeat(60));
  console.log(generator.getTLDR());

  console.log('\n' + '='.repeat(60));
  console.log('SLACK FORMAT');
  console.log('='.repeat(60));
  console.log(generator.getSlackSummary());

  console.log('\n' + '='.repeat(60));
  console.log('EMAIL FORMAT');
  console.log('='.repeat(60));
  const email = generator.getEmailSummary('Leadership Team');
  console.log('Subject:', email.subject);
  console.log('\n', email.body);

  console.log('\n' + '='.repeat(60));
  console.log('PRESENTATION POINTS');
  console.log('='.repeat(60));
  const slides = generator.getPresentationPoints();
  slides.forEach((slide, i) => {
    console.log(`\nSlide ${i + 1}: ${slide.title}`);
    slide.bullets.forEach(b => console.log(`  • ${b}`));
  });
}
