/**
 * Council Mode Auto-Detection System
 * 
 * Analyzes user queries and suggests the optimal Council Mode
 * Uses keyword matching, pattern recognition, and intent classification
 */
// @ts-nocheck


// Mode detection configuration
const MODE_DETECTION_RULES = {
  'crisis': {
    priority: 1, // Highest priority - check first
    keywords: [
      'urgent', 'emergency', 'immediately', 'asap', 'crisis', 'incident',
      'breach', 'outage', 'down', 'hacked', 'attacked', 'leak', 'exposed',
      'lawsuit', 'sued', 'fired', 'quit', 'resigned', 'walkout',
      'pr disaster', 'viral', 'trending', 'breaking', 'just happened'
    ],
    patterns: [
      /what do we do about/i,
      /how do we respond to/i,
      /we just (found|discovered|learned)/i,
      /someone just/i,
      /right now/i,
      /in the last (hour|few hours|minutes)/i
    ],
    contextClues: ['time-sensitive', 'damage-control', 'immediate-action']
  },

  'compliance': {
    priority: 2,
    keywords: [
      'gdpr', 'hipaa', 'sox', 'pci', 'ccpa', 'ferpa', 'coppa',
      'regulation', 'regulatory', 'compliance', 'compliant', 'audit',
      'legal', 'lawsuit', 'liability', 'privacy', 'data protection',
      'security review', 'penetration test', 'vulnerability',
      'policy', 'policies', 'procedure', 'documentation'
    ],
    patterns: [
      /is this (legal|compliant|allowed)/i,
      /do we need to/i,
      /are we (required|obligated)/i,
      /what are the (rules|regulations|requirements)/i,
      /before the audit/i,
      /regulat(or|ory)/i
    ],
    contextClues: ['legal-risk', 'regulatory-exposure', 'documentation-required']
  },

  'due-diligence': {
    priority: 3,
    keywords: [
      'acquire', 'acquisition', 'merger', 'm&a', 'buy', 'purchase',
      'invest', 'investment', 'funding', 'series', 'valuation',
      'partner', 'partnership', 'vendor', 'supplier', 'contract',
      'evaluate', 'assessment', 'review', 'analyze', 'vet'
    ],
    patterns: [
      /should we (acquire|buy|invest|partner)/i,
      /what do we know about/i,
      /is .+ a good (investment|partner|vendor|choice)/i,
      /due diligence on/i,
      /evaluate .+ (for|as)/i,
      /red flags/i
    ],
    contextClues: ['high-stakes', 'external-party', 'commitment']
  },

  'investment': {
    priority: 4,
    keywords: [
      'budget', 'cost', 'spend', 'spending', 'expense', 'roi',
      'return', 'payback', 'profitable', 'profitability',
      'headcount', 'hire', 'hiring', 'ftes', 'contractors',
      'tool', 'software', 'subscription', 'license', 'purchase',
      'approve', 'approval', 'request', 'justify'
    ],
    patterns: [
      /should we (spend|invest|buy|hire|approve)/i,
      /how much (will|would|does|should)/i,
      /what('s| is) the (roi|return|cost|budget)/i,
      /can we afford/i,
      /is it worth/i,
      /justify (the|this) (cost|expense|investment)/i
    ],
    contextClues: ['financial-decision', 'resource-allocation', 'budget-impact']
  },

  'stakeholder': {
    priority: 5,
    keywords: [
      'reorg', 'reorganization', 'restructure', 'layoff', 'rif',
      'change management', 'transition', 'migration', 'rollout',
      'announce', 'announcement', 'communicate', 'communication',
      'team', 'morale', 'culture', 'employee', 'staff',
      'resistance', 'pushback', 'buy-in', 'adoption'
    ],
    patterns: [
      /how (do|should|will) (we|they|people) react/i,
      /who (will|would|should) be affected/i,
      /how to (announce|communicate|tell|inform)/i,
      /get (buy-in|support|approval) from/i,
      /change (management|initiative)/i
    ],
    contextClues: ['people-impact', 'organizational-change', 'communication-needed']
  },

  'execution': {
    priority: 6,
    keywords: [
      'plan', 'planning', 'project', 'timeline', 'schedule',
      'launch', 'ship', 'deliver', 'implement', 'implementation',
      'milestone', 'deadline', 'sprint', 'roadmap',
      'resources', 'dependencies', 'blockers', 'tasks'
    ],
    patterns: [
      /how (do|should|can) we (implement|execute|deliver|ship|launch)/i,
      /what('s| is) the (plan|timeline|schedule)/i,
      /when (can|will|should) we/i,
      /who (owns|is responsible|should)/i,
      /break (this|it) down/i,
      /step by step/i
    ],
    contextClues: ['action-planning', 'project-management', 'delivery']
  },

  'research': {
    priority: 7,
    keywords: [
      'data', 'analysis', 'analyze', 'research', 'study',
      'trend', 'trends', 'pattern', 'patterns', 'insight',
      'metrics', 'kpis', 'dashboard', 'report', 'reporting',
      'benchmark', 'compare', 'comparison', 'correlation'
    ],
    patterns: [
      /what (does|do) the (data|numbers|metrics) (show|say|tell)/i,
      /analyze (the|our|this)/i,
      /what('s| is| are) the (trend|pattern|insight)/i,
      /how (are|do) we (performing|compare|measure)/i,
      /based on (the |our )?(data|evidence|research)/i
    ],
    contextClues: ['data-driven', 'analysis-required', 'evidence-based']
  },

  'innovation-lab': {
    priority: 8,
    keywords: [
      'brainstorm', 'ideas', 'creative', 'innovate', 'innovation',
      'new', 'novel', 'different', 'alternative', 'possibilities',
      'experiment', 'prototype', 'pilot', 'test', 'try',
      'what if', 'imagine', 'vision', 'future'
    ],
    patterns: [
      /what (if|about|are some)/i,
      /how (might|could|can) we/i,
      /brainstorm/i,
      /ideas for/i,
      /think outside/i,
      /get creative/i,
      /explore (options|possibilities|alternatives)/i
    ],
    contextClues: ['ideation', 'creativity', 'exploration']
  },

  'governance': {
    priority: 9,
    keywords: [
      'policy', 'policies', 'standard', 'standards', 'procedure',
      'precedent', 'exception', 'rule', 'rules', 'guideline',
      'framework', 'governance', 'board', 'committee',
      'approve', 'approval', 'authorize', 'authorization'
    ],
    patterns: [
      /what('s| is) (the|our) policy/i,
      /should we (allow|permit|approve)/i,
      /set(ting)? a precedent/i,
      /make (an|this) exception/i,
      /establish (a|the) (rule|policy|standard)/i,
      /going forward/i
    ],
    contextClues: ['policy-setting', 'precedent-impact', 'standardization']
  },

  'advisory': {
    priority: 10,
    keywords: [
      'learn', 'understand', 'explain', 'teach', 'help me',
      'how does', 'what is', 'why do', 'best practice',
      'framework', 'approach', 'methodology', 'principle',
      'training', 'onboarding', 'new to', 'beginner'
    ],
    patterns: [
      /help me understand/i,
      /explain (how|why|what)/i,
      /teach me/i,
      /what('s| is) the (best|right|recommended) (way|approach|practice)/i,
      /how (do|does|should) .+ (work|function)/i,
      /i('m| am) new to/i
    ],
    contextClues: ['learning', 'educational', 'guidance-seeking']
  },

  'rapid': {
    priority: 11,
    keywords: [
      'quick', 'fast', 'simple', 'straightforward', 'easy',
      'yes or no', 'thumbs up', 'sanity check', 'gut check',
      'minor', 'small', 'trivial', 'low stakes'
    ],
    patterns: [
      /quick (question|thought|check)/i,
      /just (want|need) to (know|check|confirm)/i,
      /yes or no/i,
      /should (i|we) just/i,
      /is it (ok|okay|fine) (to|if)/i,
      /no big deal/i
    ],
    contextClues: ['low-stakes', 'quick-answer', 'simple-decision']
  },

  'war-room': {
    priority: 12, // Default fallback for strategic questions
    keywords: [
      'strategy', 'strategic', 'decision', 'decide', 'choice',
      'direction', 'priority', 'priorities', 'tradeoff', 'tradeoffs',
      'compete', 'competition', 'market', 'position', 'positioning',
      'growth', 'expansion', 'pivot', 'focus'
    ],
    patterns: [
      /should we/i,
      /what('s| is) (the|our) (strategy|approach|direction)/i,
      /how (do|should) we (compete|position|grow)/i,
      /what are (the|our) (options|priorities)/i,
      /make a decision/i,
      /pros and cons/i
    ],
    contextClues: ['strategic-decision', 'contested', 'multi-stakeholder']
  }
};

// Confidence thresholds
const CONFIDENCE_THRESHOLDS = {
  HIGH: 0.75,    // Auto-select this mode
  MEDIUM: 0.50,  // Suggest this mode
  LOW: 0.25      // Show as alternative
};

/**
 * Analyzes a query and returns mode recommendations
 * @param {string} query - The user's question
 * @returns {Object} - Detection results with recommendations
 */
function detectMode(query) {
  const normalizedQuery = query.toLowerCase().trim();
  const scores = {};
  const matchDetails = {};

  // Score each mode
  for (const [modeId, rules] of Object.entries(MODE_DETECTION_RULES)) {
    let score = 0;
    const matches = { keywords: [], patterns: [] };

    // Keyword matching (0.1 points per keyword, max 0.5)
    const keywordMatches = rules.keywords.filter(kw => 
      normalizedQuery.includes(kw.toLowerCase())
    );
    score += Math.min(keywordMatches.length * 0.1, 0.5);
    matches.keywords = keywordMatches;

    // Pattern matching (0.2 points per pattern, max 0.4)
    const patternMatches = rules.patterns.filter(pattern => 
      pattern.test(normalizedQuery)
    );
    score += Math.min(patternMatches.length * 0.2, 0.4);
    matches.patterns = patternMatches.map(p => p.toString());

    // Priority bonus (higher priority modes get small boost)
    score += (13 - rules.priority) * 0.01;

    scores[modeId] = Math.min(score, 1.0); // Cap at 1.0
    matchDetails[modeId] = matches;
  }

  // Sort by score
  const sortedModes = Object.entries(scores)
    .sort(([, a], [, b]) => b - a)
    .map(([modeId, score]) => ({
      modeId,
      score,
      confidence: getConfidenceLevel(score),
      matches: matchDetails[modeId]
    }));

  const topMode = sortedModes[0];
  const alternatives = sortedModes.slice(1, 4).filter(m => m.score >= CONFIDENCE_THRESHOLDS.LOW);

  return {
    query,
    recommended: {
      modeId: topMode.modeId,
      confidence: topMode.confidence,
      score: topMode.score,
      matches: topMode.matches
    },
    alternatives,
    allScores: scores,
    autoSelect: topMode.score >= CONFIDENCE_THRESHOLDS.HIGH,
    reasoning: generateReasoning(topMode, alternatives)
  };
}

/**
 * Gets confidence level from score
 */
function getConfidenceLevel(score) {
  if (score >= CONFIDENCE_THRESHOLDS.HIGH) return 'high';
  if (score >= CONFIDENCE_THRESHOLDS.MEDIUM) return 'medium';
  if (score >= CONFIDENCE_THRESHOLDS.LOW) return 'low';
  return 'uncertain';
}

/**
 * Generates human-readable reasoning for the recommendation
 */
function generateReasoning(topMode, alternatives) {
  const reasons = [];
  
  if (topMode.matches.keywords.length > 0) {
    reasons.push(`Detected keywords: "${topMode.matches.keywords.slice(0, 3).join('", "')}"`);
  }
  
  if (topMode.matches.patterns.length > 0) {
    reasons.push(`Matched ${topMode.matches.patterns.length} query pattern(s)`);
  }

  if (alternatives.length > 0 && alternatives[0].score > CONFIDENCE_THRESHOLDS.MEDIUM) {
    reasons.push(`Alternative: ${alternatives[0].modeId} (${Math.round(alternatives[0].score * 100)}% match)`);
  }

  return reasons.join('. ');
}

/**
 * Batch detection for multiple queries (useful for analytics)
 */
function detectModes(queries) {
  return queries.map(q => detectMode(q));
}

/**
 * Train detection rules with feedback
 * @param {string} query - The original query
 * @param {string} selectedMode - The mode the user actually chose
 * @param {string} recommendedMode - The mode that was recommended
 */
function recordFeedback(query, selectedMode, recommendedMode) {
  // In production, this would send to analytics backend
  return {
    query,
    selectedMode,
    recommendedMode,
    matched: selectedMode === recommendedMode,
    timestamp: new Date().toISOString()
  };
}

// ============================================================
// REACT COMPONENT: Mode Suggestion UI
// ============================================================

const ModeDetectionUI = `
import React, { useState, useEffect } from 'react';

const COUNCIL_MODES = {
  'war-room': { name: 'War Room', emoji: '⚔️', color: '#EF4444' },
  'due-diligence': { name: 'Due Diligence', emoji: '🔍', color: '#0F172A' },
  'innovation-lab': { name: 'Innovation Lab', emoji: '💡', color: '#10B981' },
  'compliance': { name: 'Compliance', emoji: '🛡️', color: '#F59E0B' },
  'crisis': { name: 'Crisis', emoji: '🚨', color: '#EF4444' },
  'execution': { name: 'Execution', emoji: '🎯', color: '#2563EB' },
  'research': { name: 'Research', emoji: '🔬', color: '#8B5CF6' },
  'investment': { name: 'Investment', emoji: '💰', color: '#10B981' },
  'stakeholder': { name: 'Stakeholder', emoji: '🤝', color: '#3B82F6' },
  'rapid': { name: 'Rapid', emoji: '⚡', color: '#F59E0B' },
  'advisory': { name: 'Advisory', emoji: '🎓', color: '#8B5CF6' },
  'governance': { name: 'Governance', emoji: '🏛️', color: '#0F172A' }
};

export function ModeSuggestion({ query, onModeSelect, currentMode }) {
  const [detection, setDetection] = useState(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (query && query.length > 10) {
      // Debounce detection
      const timer = setTimeout(() => {
        const result = detectMode(query);
        setDetection(result);
        setDismissed(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [query]);

  // Don't show if dismissed or no detection
  if (dismissed || !detection) return null;
  
  // Don't show if already on recommended mode
  if (detection.recommended.modeId === currentMode) return null;
  
  // Don't show if confidence is too low
  if (detection.recommended.confidence === 'uncertain') return null;

  const recommended = COUNCIL_MODES[detection.recommended.modeId];
  const isHighConfidence = detection.recommended.confidence === 'high';

  return (
    <div className={\`p-3 rounded-lg border \${isHighConfidence ? 'bg-blue-500/10 border-blue-500/50' : 'bg-slate-800 border-slate-700'}\`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{recommended.emoji}</span>
          <div>
            <p className="text-sm text-slate-300">
              {isHighConfidence ? 'Recommended:' : 'Consider:'} 
              <span className="font-semibold text-white ml-1">{recommended.name} Mode</span>
            </p>
            <p className="text-xs text-slate-500">{detection.reasoning}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onModeSelect(detection.recommended.modeId)}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
          >
            Use This Mode
          </button>
          <button
            onClick={() => setDismissed(true)}
            className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm rounded-lg transition-colors"
          >
            Dismiss
          </button>
        </div>
      </div>
      
      {detection.alternatives.length > 0 && (
        <div className="mt-2 pt-2 border-t border-slate-700">
          <p className="text-xs text-slate-500 mb-1">Alternatives:</p>
          <div className="flex gap-2">
            {detection.alternatives.map(alt => {
              const mode = COUNCIL_MODES[alt.modeId];
              return (
                <button
                  key={alt.modeId}
                  onClick={() => onModeSelect(alt.modeId)}
                  className="flex items-center gap-1 px-2 py-1 bg-slate-700/50 hover:bg-slate-700 rounded text-xs text-slate-400 hover:text-white transition-colors"
                >
                  <span>{mode.emoji}</span>
                  <span>{mode.name}</span>
                  <span className="text-slate-600">({Math.round(alt.score * 100)}%)</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
`;

// ============================================================
// TEST CASES
// ============================================================

const TEST_QUERIES = [
  // Crisis
  { query: "Our database was just breached, customer data may be exposed", expected: "crisis" },
  { query: "The CEO just resigned effective immediately", expected: "crisis" },
  { query: "We're trending on Twitter for the wrong reasons", expected: "crisis" },
  
  // Compliance
  { query: "Is our new feature GDPR compliant?", expected: "compliance" },
  { query: "We have an audit next month, are we ready?", expected: "compliance" },
  { query: "What are our data retention policies?", expected: "compliance" },
  
  // Due Diligence
  { query: "Should we acquire CompanyX?", expected: "due-diligence" },
  { query: "Is this vendor reliable? We're considering a 3-year contract", expected: "due-diligence" },
  { query: "What do we know about this potential investor?", expected: "due-diligence" },
  
  // Investment
  { query: "Should we hire 5 more engineers?", expected: "investment" },
  { query: "What's the ROI on upgrading our infrastructure?", expected: "investment" },
  { query: "Can we justify the cost of this new tool?", expected: "investment" },
  
  // Stakeholder
  { query: "How do we announce the reorg to the team?", expected: "stakeholder" },
  { query: "Who will be affected by this policy change?", expected: "stakeholder" },
  { query: "How do we get buy-in from the sales team?", expected: "stakeholder" },
  
  // Execution
  { query: "What's the plan to launch this feature?", expected: "execution" },
  { query: "How do we implement this in the next sprint?", expected: "execution" },
  { query: "Break down the migration into tasks", expected: "execution" },
  
  // Research
  { query: "What do our metrics say about user engagement?", expected: "research" },
  { query: "Analyze the trends in our sales data", expected: "research" },
  { query: "How do we compare to the competition?", expected: "research" },
  
  // Innovation
  { query: "Let's brainstorm new product ideas", expected: "innovation-lab" },
  { query: "What if we approached this completely differently?", expected: "innovation-lab" },
  { query: "What are some creative solutions to this problem?", expected: "innovation-lab" },
  
  // Governance
  { query: "Should we make an exception to our policy?", expected: "governance" },
  { query: "We need to establish a standard for this", expected: "governance" },
  { query: "This sets a precedent, how should we handle it?", expected: "governance" },
  
  // Advisory
  { query: "Help me understand how our pricing model works", expected: "advisory" },
  { query: "What's the best practice for code reviews?", expected: "advisory" },
  { query: "I'm new to this, can you explain the process?", expected: "advisory" },
  
  // Rapid
  { query: "Quick question: should we use blue or green?", expected: "rapid" },
  { query: "Is it okay to push this to prod?", expected: "rapid" },
  { query: "Sanity check: does this email sound right?", expected: "rapid" },
  
  // War Room (strategic)
  { query: "Should we expand into the European market?", expected: "war-room" },
  { query: "What's our strategy for the next quarter?", expected: "war-room" },
  { query: "How do we compete with the new market entrant?", expected: "war-room" }
];

/**
 * Run test suite
 */
function runTests() {
  console.log("=== Mode Detection Test Suite ===\n");
  
  let passed = 0;
  let failed = 0;
  
  for (const test of TEST_QUERIES) {
    const result = detectMode(test.query);
    const success = result.recommended.modeId === test.expected;
    
    if (success) {
      passed++;
      console.log(`✅ PASS: "${test.query.substring(0, 50)}..."`);
      console.log(`   Detected: ${result.recommended.modeId} (${Math.round(result.recommended.score * 100)}%)\n`);
    } else {
      failed++;
      console.log(`❌ FAIL: "${test.query.substring(0, 50)}..."`);
      console.log(`   Expected: ${test.expected}`);
      console.log(`   Got: ${result.recommended.modeId} (${Math.round(result.recommended.score * 100)}%)`);
      console.log(`   Reasoning: ${result.reasoning}\n`);
    }
  }
  
  console.log("=== Results ===");
  console.log(`Passed: ${passed}/${TEST_QUERIES.length}`);
  console.log(`Failed: ${failed}/${TEST_QUERIES.length}`);
  console.log(`Accuracy: ${Math.round(passed / TEST_QUERIES.length * 100)}%`);
  
  return { passed, failed, accuracy: passed / TEST_QUERIES.length };
}

// Export for use
module.exports = {
  detectMode,
  detectModes,
  recordFeedback,
  runTests,
  MODE_DETECTION_RULES,
  CONFIDENCE_THRESHOLDS,
  TEST_QUERIES,
  ModeDetectionUI
};

// Run tests if executed directly
if (require.main === module) {
  runTests();
}
