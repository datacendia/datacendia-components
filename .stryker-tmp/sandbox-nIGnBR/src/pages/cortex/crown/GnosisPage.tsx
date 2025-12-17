// @ts-nocheck
// =============================================================================
// CENDIA GNOSIS™ - Sovereign Education Engine
// "The Council decides tomorrow's strategy tonight. Gnosis teaches every human
//  how to execute it by morning."
// =============================================================================
function stryNS_9fa48() {
  var g = typeof globalThis === 'object' && globalThis && globalThis.Math === Math && globalThis || new Function("return this")();
  var ns = g.__stryker__ || (g.__stryker__ = {});
  if (ns.activeMutant === undefined && g.process && g.process.env && g.process.env.__STRYKER_ACTIVE_MUTANT__) {
    ns.activeMutant = g.process.env.__STRYKER_ACTIVE_MUTANT__;
  }
  function retrieveNS() {
    return ns;
  }
  stryNS_9fa48 = retrieveNS;
  return retrieveNS();
}
stryNS_9fa48();
function stryCov_9fa48() {
  var ns = stryNS_9fa48();
  var cov = ns.mutantCoverage || (ns.mutantCoverage = {
    static: {},
    perTest: {}
  });
  function cover() {
    var c = cov.static;
    if (ns.currentTestId) {
      c = cov.perTest[ns.currentTestId] = cov.perTest[ns.currentTestId] || {};
    }
    var a = arguments;
    for (var i = 0; i < a.length; i++) {
      c[a[i]] = (c[a[i]] || 0) + 1;
    }
  }
  stryCov_9fa48 = cover;
  cover.apply(null, arguments);
}
function stryMutAct_9fa48(id) {
  var ns = stryNS_9fa48();
  function isActive(id) {
    if (ns.activeMutant === id) {
      if (ns.hitCount !== void 0 && ++ns.hitCount > ns.hitLimit) {
        throw new Error('Stryker: Hit count limit reached (' + ns.hitCount + ')');
      }
      return true;
    }
    return false;
  }
  stryMutAct_9fa48 = isActive;
  return isActive(id);
}
import { useState, useEffect, useCallback } from 'react';
import { GraduationCap, BookOpen, Target, Users, TrendingUp, Award, ChevronRight, Play, CheckCircle, Clock, Brain, Zap, BarChart3, AlertCircle, Star, BookMarked, Layers, RefreshCw, Upload, FileText } from 'lucide-react';
import { gnosisApi } from '../../../lib/api';
import { sovereignApi, enterpriseApi } from '../../../lib/sovereignApi';
interface DashboardData {
  userProfile: {
    strengths: string[];
    gaps: string[];
    learningStyle: string;
    skillCount: number;
  };
  organizationMetrics: {
    totalLearners: number;
    activeLearners: number;
    avgCompletionRate: number;
    decisionReadiness: number;
  };
  recommendedPaths: string[];
  topPerformers: Array<{
    userId: string;
    name: string;
    score: number;
  }>;
  atRiskLearners: Array<{
    userId: string;
    name: string;
    reason: string;
  }>;
}
interface SkillProfile {
  userId: string;
  skills: Record<string, {
    name: string;
    level: number;
    trend: string;
    certifications: string[];
  }>;
  strengths: string[];
  gaps: string[];
  learningStyle: string;
  preferredPace: string;
}
interface DecisionReadiness {
  readinessScore: number;
  totalLearners: number;
  activeLearners: number;
  completedPaths: number;
  status: string;
  message: string;
}
interface LearningPath {
  id: string;
  title: string;
  description: string;
  progress: number;
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  modules: Array<{
    id: string;
    title: string;
    duration: string;
    completed: boolean;
    type: 'video' | 'quiz' | 'reading' | 'exercise';
  }>;
}

// Module content for readings, quizzes, and exercises
const MODULE_CONTENT: Record<string, {
  type: 'reading' | 'quiz' | 'exercise';
  title: string;
  content?: string;
  sections?: Array<{
    heading: string;
    text: string;
  }>;
  questions?: Array<{
    id: string;
    question: string;
    options: string[];
    correct: number;
  }>;
  steps?: Array<{
    step: number;
    instruction: string;
    hint?: string;
  }>;
}> = stryMutAct_9fa48("23577") ? {} : (stryCov_9fa48("23577"), {
  // AI Decision Making - Reading
  'm2': stryMutAct_9fa48("23578") ? {} : (stryCov_9fa48("23578"), {
    type: 'reading',
    title: 'Understanding Agent Recommendations',
    sections: stryMutAct_9fa48("23581") ? [] : (stryCov_9fa48("23581"), [stryMutAct_9fa48("23582") ? {} : (stryCov_9fa48("23582"), {
      heading: 'What Are AI Agents?',
      text: 'AI agents in CendiaCortex are specialized decision-support systems that analyze data, identify patterns, and provide recommendations. Each agent has a specific domain expertise—from financial analysis to risk assessment to market trends. Unlike simple algorithms, these agents learn from organizational context and adapt their recommendations based on outcomes.'
    }), stryMutAct_9fa48("23585") ? {} : (stryCov_9fa48("23585"), {
      heading: 'How Recommendations Are Generated',
      text: 'When you submit a decision query to the Council, multiple agents analyze the question from their unique perspectives. Each agent considers: historical data patterns, current market conditions, organizational constraints, and potential risks. The agents then vote on recommendations, with their votes weighted by their historical accuracy in similar decisions.'
    }), stryMutAct_9fa48("23588") ? {} : (stryCov_9fa48("23588"), {
      heading: 'Interpreting Agent Confidence',
      text: 'Every recommendation comes with a confidence score (0-100%). High confidence (>80%) indicates strong data support and agent consensus. Medium confidence (50-80%) suggests the decision has nuances requiring human judgment. Low confidence (<50%) means significant uncertainty—proceed with caution and gather more data.'
    }), stryMutAct_9fa48("23591") ? {} : (stryCov_9fa48("23591"), {
      heading: 'When to Override Agent Recommendations',
      text: 'AI agents excel at data-driven analysis but may miss: recent market shifts not yet in data, internal organizational dynamics, stakeholder politics, and ethical considerations. Always apply human judgment, especially for decisions with significant irreversible consequences.'
    })])
  }),
  // AI Decision Making - Quiz (Knowledge Check)
  'm4': stryMutAct_9fa48("23594") ? {} : (stryCov_9fa48("23594"), {
    type: 'quiz',
    title: 'Knowledge Check',
    questions: stryMutAct_9fa48("23597") ? [] : (stryCov_9fa48("23597"), [stryMutAct_9fa48("23598") ? {} : (stryCov_9fa48("23598"), {
      id: 'q1',
      question: 'What does an agent confidence score of 85% indicate?',
      options: stryMutAct_9fa48("23601") ? [] : (stryCov_9fa48("23601"), ['The agent is 85% certain the data is accurate', 'Strong data support and high agent consensus', 'The decision will succeed 85% of the time', 'Only 85% of agents participated in the vote']),
      correct: 1
    }), stryMutAct_9fa48("23606") ? {} : (stryCov_9fa48("23606"), {
      id: 'q2',
      question: 'When should you consider overriding an AI agent recommendation?',
      options: stryMutAct_9fa48("23609") ? [] : (stryCov_9fa48("23609"), ['Never - AI agents are always correct', 'When the confidence score is below 50%', 'When there are ethical considerations or recent market shifts not in the data', 'Only when multiple agents disagree']),
      correct: 2
    }), stryMutAct_9fa48("23614") ? {} : (stryCov_9fa48("23614"), {
      id: 'q3',
      question: 'How do agents weight their votes in the Council?',
      options: stryMutAct_9fa48("23617") ? [] : (stryCov_9fa48("23617"), ['All agents have equal voting weight', 'Based on their historical accuracy in similar decisions', 'Senior agents always have higher weight', 'Randomly assigned for each decision']),
      correct: 1
    })])
  }),
  // AI Decision Making - Exercise
  'm5': stryMutAct_9fa48("23622") ? {} : (stryCov_9fa48("23622"), {
    type: 'exercise',
    title: 'Building Your First Council Query',
    steps: stryMutAct_9fa48("23625") ? [] : (stryCov_9fa48("23625"), [stryMutAct_9fa48("23626") ? {} : (stryCov_9fa48("23626"), {
      step: 1,
      instruction: 'Navigate to the Council page from the main navigation.',
      hint: 'Look for the "Council" option in the left sidebar under Cortex.'
    }), stryMutAct_9fa48("23629") ? {} : (stryCov_9fa48("23629"), {
      step: 2,
      instruction: 'Click "New Deliberation" to start a new decision query.',
      hint: 'The button is in the top-right corner of the Council page.'
    }), stryMutAct_9fa48("23632") ? {} : (stryCov_9fa48("23632"), {
      step: 3,
      instruction: 'Frame your decision as a clear question. For example: "Should we expand into the European market in Q2?"',
      hint: 'Good queries are specific, time-bound, and actionable.'
    }), stryMutAct_9fa48("23635") ? {} : (stryCov_9fa48("23635"), {
      step: 4,
      instruction: 'Select the relevant agents for your decision (e.g., Market Analyst, Risk Assessor, Financial Advisor).',
      hint: 'Start with 3-5 agents most relevant to your decision domain.'
    }), stryMutAct_9fa48("23638") ? {} : (stryCov_9fa48("23638"), {
      step: 5,
      instruction: 'Set your decision timeline and urgency level.',
      hint: 'Urgent decisions get faster responses but may have lower confidence.'
    }), stryMutAct_9fa48("23641") ? {} : (stryCov_9fa48("23641"), {
      step: 6,
      instruction: 'Submit your query and observe the deliberation process.',
      hint: 'Watch the agents discuss and vote in real-time.'
    }), stryMutAct_9fa48("23644") ? {} : (stryCov_9fa48("23644"), {
      step: 7,
      instruction: 'Review the final recommendation and confidence score.',
      hint: 'Check which agents agreed/disagreed and why.'
    })])
  }),
  // AI Decision Making - Final Assessment
  'm7': stryMutAct_9fa48("23647") ? {} : (stryCov_9fa48("23647"), {
    type: 'quiz',
    title: 'Final Assessment',
    questions: stryMutAct_9fa48("23650") ? [] : (stryCov_9fa48("23650"), [stryMutAct_9fa48("23651") ? {} : (stryCov_9fa48("23651"), {
      id: 'q1',
      question: 'What is the primary benefit of multi-agent decision support?',
      options: stryMutAct_9fa48("23654") ? [] : (stryCov_9fa48("23654"), ['Faster decisions with less data', 'Multiple perspectives reduce blind spots and bias', 'Eliminates the need for human oversight', 'Guarantees correct decisions']),
      correct: 1
    }), stryMutAct_9fa48("23659") ? {} : (stryCov_9fa48("23659"), {
      id: 'q2',
      question: 'A decision has 45% confidence with significant agent disagreement. What should you do?',
      options: stryMutAct_9fa48("23662") ? [] : (stryCov_9fa48("23662"), ['Proceed with the majority recommendation', 'Reject the recommendation entirely', 'Gather more data and re-query, or apply strong human judgment', 'Wait for confidence to increase automatically']),
      correct: 2
    }), stryMutAct_9fa48("23667") ? {} : (stryCov_9fa48("23667"), {
      id: 'q3',
      question: 'Which factor do AI agents NOT typically consider well?',
      options: stryMutAct_9fa48("23670") ? [] : (stryCov_9fa48("23670"), ['Historical data patterns', 'Current market conditions', 'Internal organizational politics', 'Quantitative risk metrics']),
      correct: 2
    }), stryMutAct_9fa48("23675") ? {} : (stryCov_9fa48("23675"), {
      id: 'q4',
      question: 'How can you improve agent recommendation quality over time?',
      options: stryMutAct_9fa48("23678") ? [] : (stryCov_9fa48("23678"), ['Always accept recommendations without question', 'Provide outcome feedback after decisions are implemented', 'Use more agents for every decision', 'Ignore low-confidence recommendations']),
      correct: 1
    }), stryMutAct_9fa48("23683") ? {} : (stryCov_9fa48("23683"), {
      id: 'q5',
      question: 'What defines a well-framed Council query?',
      options: stryMutAct_9fa48("23686") ? [] : (stryCov_9fa48("23686"), ['As vague as possible to get broad recommendations', 'Specific, time-bound, and actionable', 'Only yes/no questions', 'Questions that have obvious answers']),
      correct: 1
    })])
  }),
  // Change Management - Reading (Stakeholder Analysis)
  'cm-m2': stryMutAct_9fa48("23691") ? {} : (stryCov_9fa48("23691"), {
    type: 'reading',
    title: 'Stakeholder Analysis',
    sections: stryMutAct_9fa48("23694") ? [] : (stryCov_9fa48("23694"), [stryMutAct_9fa48("23695") ? {} : (stryCov_9fa48("23695"), {
      heading: 'Identifying Key Stakeholders',
      text: 'Stakeholders are individuals or groups who can affect or be affected by organizational decisions. In AI-driven decision making, key stakeholders typically include: executive sponsors, department heads affected by decisions, IT/data teams, end-users of AI recommendations, and external partners or customers impacted by outcomes.'
    }), stryMutAct_9fa48("23698") ? {} : (stryCov_9fa48("23698"), {
      heading: 'Mapping Influence and Interest',
      text: 'Create a 2x2 matrix: High Influence/High Interest stakeholders need close management. High Influence/Low Interest stakeholders should be kept satisfied. Low Influence/High Interest stakeholders should be kept informed. Low Influence/Low Interest stakeholders need minimal monitoring.'
    }), stryMutAct_9fa48("23701") ? {} : (stryCov_9fa48("23701"), {
      heading: 'Addressing Stakeholder Concerns',
      text: 'Common concerns about AI decision support include: job displacement fears, trust in algorithmic recommendations, data privacy, and accountability for AI-influenced decisions. Address these proactively with clear communication, training, and governance frameworks.'
    })])
  }),
  // Change Management - Resistance Management Reading
  'cm-m5': stryMutAct_9fa48("23704") ? {} : (stryCov_9fa48("23704"), {
    type: 'reading',
    title: 'Resistance Management',
    sections: stryMutAct_9fa48("23707") ? [] : (stryCov_9fa48("23707"), [stryMutAct_9fa48("23708") ? {} : (stryCov_9fa48("23708"), {
      heading: 'Understanding Resistance',
      text: 'Resistance to AI-driven decision making is natural and often rational. People may resist due to: fear of the unknown, loss of autonomy, past negative experiences with technology, or genuine concerns about AI limitations. Acknowledge these concerns as valid rather than dismissing them.'
    }), stryMutAct_9fa48("23711") ? {} : (stryCov_9fa48("23711"), {
      heading: 'Strategies for Overcoming Resistance',
      text: 'Key strategies include: involving resistors in the implementation process, providing hands-on training and quick wins, creating feedback channels for concerns, celebrating early successes publicly, and ensuring leadership visibly uses and trusts the AI tools.'
    }), stryMutAct_9fa48("23714") ? {} : (stryCov_9fa48("23714"), {
      heading: 'Converting Skeptics to Champions',
      text: 'Focus on pragmatic skeptics who have valid concerns but are open to evidence. Give them pilot projects where AI support adds clear value. When they experience success, they become the most credible advocates for broader adoption.'
    })])
  }),
  // Change Management - Practical Exercise
  'cm-m6': stryMutAct_9fa48("23717") ? {} : (stryCov_9fa48("23717"), {
    type: 'exercise',
    title: 'Practical Exercise: Change Impact Assessment',
    steps: stryMutAct_9fa48("23720") ? [] : (stryCov_9fa48("23720"), [stryMutAct_9fa48("23721") ? {} : (stryCov_9fa48("23721"), {
      step: 1,
      instruction: 'Identify a recent or upcoming decision that could benefit from AI support.',
      hint: 'Choose something concrete like a hiring decision, budget allocation, or product feature prioritization.'
    }), stryMutAct_9fa48("23724") ? {} : (stryCov_9fa48("23724"), {
      step: 2,
      instruction: 'List all stakeholders who would be affected if AI recommendations were used for this decision.',
      hint: 'Include decision-makers, those who implement, and those affected by outcomes.'
    }), stryMutAct_9fa48("23727") ? {} : (stryCov_9fa48("23727"), {
      step: 3,
      instruction: 'For each stakeholder, rate their likely resistance (1-5) and their influence (1-5).',
      hint: 'High resistance + high influence = priority concern.'
    }), stryMutAct_9fa48("23730") ? {} : (stryCov_9fa48("23730"), {
      step: 4,
      instruction: 'Draft a one-paragraph message explaining the benefits of AI decision support for this specific use case.',
      hint: 'Focus on how it helps them, not just organizational benefits.'
    }), stryMutAct_9fa48("23733") ? {} : (stryCov_9fa48("23733"), {
      step: 5,
      instruction: 'Identify one quick win that could demonstrate value within 2 weeks.',
      hint: 'Quick wins should be visible, low-risk, and clearly attributable to AI support.'
    })])
  })
});

// Demo learning paths with real content
const LEARNING_PATHS: LearningPath[] = stryMutAct_9fa48("23736") ? [] : (stryCov_9fa48("23736"), [stryMutAct_9fa48("23737") ? {} : (stryCov_9fa48("23737"), {
  id: 'ai-decision-making',
  title: 'AI-Driven Decision Making',
  description: 'Learn how to leverage AI agents and data-driven insights to make better strategic decisions.',
  progress: 0,
  duration: '2h 30m',
  difficulty: 'intermediate',
  modules: stryMutAct_9fa48("23743") ? [] : (stryCov_9fa48("23743"), [stryMutAct_9fa48("23744") ? {} : (stryCov_9fa48("23744"), {
    id: 'm1',
    title: 'Introduction to AI Decision Support',
    duration: '15m',
    completed: stryMutAct_9fa48("23748") ? true : (stryCov_9fa48("23748"), false),
    type: 'video'
  }), stryMutAct_9fa48("23750") ? {} : (stryCov_9fa48("23750"), {
    id: 'm2',
    title: 'Understanding Agent Recommendations',
    duration: '20m',
    completed: stryMutAct_9fa48("23754") ? true : (stryCov_9fa48("23754"), false),
    type: 'reading'
  }), stryMutAct_9fa48("23756") ? {} : (stryCov_9fa48("23756"), {
    id: 'm3',
    title: 'Evaluating Confidence Scores',
    duration: '25m',
    completed: stryMutAct_9fa48("23760") ? true : (stryCov_9fa48("23760"), false),
    type: 'video'
  }), stryMutAct_9fa48("23762") ? {} : (stryCov_9fa48("23762"), {
    id: 'm4',
    title: 'Knowledge Check',
    duration: '10m',
    completed: stryMutAct_9fa48("23766") ? true : (stryCov_9fa48("23766"), false),
    type: 'quiz'
  }), stryMutAct_9fa48("23768") ? {} : (stryCov_9fa48("23768"), {
    id: 'm5',
    title: 'Building Your First Council Query',
    duration: '30m',
    completed: stryMutAct_9fa48("23772") ? true : (stryCov_9fa48("23772"), false),
    type: 'exercise'
  }), stryMutAct_9fa48("23774") ? {} : (stryCov_9fa48("23774"), {
    id: 'm6',
    title: 'Interpreting Multi-Agent Consensus',
    duration: '20m',
    completed: stryMutAct_9fa48("23778") ? true : (stryCov_9fa48("23778"), false),
    type: 'video'
  }), stryMutAct_9fa48("23780") ? {} : (stryCov_9fa48("23780"), {
    id: 'm7',
    title: 'Final Assessment',
    duration: '30m',
    completed: stryMutAct_9fa48("23784") ? true : (stryCov_9fa48("23784"), false),
    type: 'quiz'
  })])
}), stryMutAct_9fa48("23786") ? {} : (stryCov_9fa48("23786"), {
  id: 'change-management',
  title: 'Change Management Fundamentals',
  description: 'Master the principles of organizational change and stakeholder alignment.',
  progress: 45,
  duration: '1h 45m',
  difficulty: 'beginner',
  modules: stryMutAct_9fa48("23792") ? [] : (stryCov_9fa48("23792"), [stryMutAct_9fa48("23793") ? {} : (stryCov_9fa48("23793"), {
    id: 'm1',
    title: 'Why Change Management Matters',
    duration: '10m',
    completed: stryMutAct_9fa48("23797") ? false : (stryCov_9fa48("23797"), true),
    type: 'video'
  }), stryMutAct_9fa48("23799") ? {} : (stryCov_9fa48("23799"), {
    id: 'm2',
    title: 'Stakeholder Analysis',
    duration: '15m',
    completed: stryMutAct_9fa48("23803") ? false : (stryCov_9fa48("23803"), true),
    type: 'reading'
  }), stryMutAct_9fa48("23805") ? {} : (stryCov_9fa48("23805"), {
    id: 'm3',
    title: 'Progress Check',
    duration: '5m',
    completed: stryMutAct_9fa48("23809") ? false : (stryCov_9fa48("23809"), true),
    type: 'quiz'
  }), stryMutAct_9fa48("23811") ? {} : (stryCov_9fa48("23811"), {
    id: 'm4',
    title: 'Communication Strategies',
    duration: '20m',
    completed: stryMutAct_9fa48("23815") ? true : (stryCov_9fa48("23815"), false),
    type: 'video'
  }), stryMutAct_9fa48("23817") ? {} : (stryCov_9fa48("23817"), {
    id: 'm5',
    title: 'Resistance Management',
    duration: '25m',
    completed: stryMutAct_9fa48("23821") ? true : (stryCov_9fa48("23821"), false),
    type: 'reading'
  }), stryMutAct_9fa48("23823") ? {} : (stryCov_9fa48("23823"), {
    id: 'm6',
    title: 'Practical Exercise',
    duration: '20m',
    completed: stryMutAct_9fa48("23827") ? true : (stryCov_9fa48("23827"), false),
    type: 'exercise'
  }), stryMutAct_9fa48("23829") ? {} : (stryCov_9fa48("23829"), {
    id: 'm7',
    title: 'Final Assessment',
    duration: '10m',
    completed: stryMutAct_9fa48("23833") ? true : (stryCov_9fa48("23833"), false),
    type: 'quiz'
  })])
}), stryMutAct_9fa48("23835") ? {} : (stryCov_9fa48("23835"), {
  id: 'strategic-communication',
  title: 'Strategic Communication',
  description: 'Advanced techniques for executive-level communication and influence.',
  progress: 78,
  duration: '3h',
  difficulty: 'advanced',
  modules: stryMutAct_9fa48("23841") ? [] : (stryCov_9fa48("23841"), [stryMutAct_9fa48("23842") ? {} : (stryCov_9fa48("23842"), {
    id: 'm1',
    title: 'Executive Presence',
    duration: '25m',
    completed: stryMutAct_9fa48("23846") ? false : (stryCov_9fa48("23846"), true),
    type: 'video'
  }), stryMutAct_9fa48("23848") ? {} : (stryCov_9fa48("23848"), {
    id: 'm2',
    title: 'Crafting Board Presentations',
    duration: '30m',
    completed: stryMutAct_9fa48("23852") ? false : (stryCov_9fa48("23852"), true),
    type: 'reading'
  }), stryMutAct_9fa48("23854") ? {} : (stryCov_9fa48("23854"), {
    id: 'm3',
    title: 'Data Storytelling',
    duration: '35m',
    completed: stryMutAct_9fa48("23858") ? false : (stryCov_9fa48("23858"), true),
    type: 'video'
  }), stryMutAct_9fa48("23860") ? {} : (stryCov_9fa48("23860"), {
    id: 'm4',
    title: 'Mid-Course Assessment',
    duration: '15m',
    completed: stryMutAct_9fa48("23864") ? false : (stryCov_9fa48("23864"), true),
    type: 'quiz'
  }), stryMutAct_9fa48("23866") ? {} : (stryCov_9fa48("23866"), {
    id: 'm5',
    title: 'Crisis Communication',
    duration: '25m',
    completed: stryMutAct_9fa48("23870") ? false : (stryCov_9fa48("23870"), true),
    type: 'video'
  }), stryMutAct_9fa48("23872") ? {} : (stryCov_9fa48("23872"), {
    id: 'm6',
    title: 'Stakeholder Influence',
    duration: '30m',
    completed: stryMutAct_9fa48("23876") ? true : (stryCov_9fa48("23876"), false),
    type: 'reading'
  }), stryMutAct_9fa48("23878") ? {} : (stryCov_9fa48("23878"), {
    id: 'm7',
    title: 'Capstone Project',
    duration: '40m',
    completed: stryMutAct_9fa48("23882") ? true : (stryCov_9fa48("23882"), false),
    type: 'exercise'
  })])
})]);
const GnosisPage = () => {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [profile, setProfile] = useState<SkillProfile | null>(null);
  const [readiness, setReadiness] = useState<DecisionReadiness | null>(null);
  const [loading, setLoading] = useState(stryMutAct_9fa48("23885") ? false : (stryCov_9fa48("23885"), true));
  const [activeTab, setActiveTab] = useState<'overview' | 'skills' | 'paths' | 'analytics'>('overview');
  const [selectedPath, setSelectedPath] = useState<LearningPath | null>(null);
  const [currentModule, setCurrentModule] = useState<string | null>(null);
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>(LEARNING_PATHS);
  const [activeContent, setActiveContent] = useState<{
    moduleId: string;
    pathId: string;
  } | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(stryMutAct_9fa48("23887") ? true : (stryCov_9fa48("23887"), false));
  const [exerciseSteps, setExerciseSteps] = useState<Record<number, boolean>>({});
  const [readingProgress, setReadingProgress] = useState(0);
  const fetchData = useCallback(async () => {
    setLoading(stryMutAct_9fa48("23889") ? false : (stryCov_9fa48("23889"), true));
    try {
      const [dashboardRes, profileRes, readinessRes] = await Promise.all(stryMutAct_9fa48("23891") ? [] : (stryCov_9fa48("23891"), [gnosisApi.getDashboard(), gnosisApi.getProfile(), gnosisApi.getDecisionReadiness()]));
      if (stryMutAct_9fa48("23893") ? false : stryMutAct_9fa48("23892") ? true : (stryCov_9fa48("23892", "23893"), dashboardRes.success)) {
        setDashboard(dashboardRes.data as DashboardData);
      }
      if (stryMutAct_9fa48("23896") ? false : stryMutAct_9fa48("23895") ? true : (stryCov_9fa48("23895", "23896"), profileRes.success)) {
        setProfile(profileRes.data as SkillProfile);
      }
      if (stryMutAct_9fa48("23899") ? false : stryMutAct_9fa48("23898") ? true : (stryCov_9fa48("23898", "23899"), readinessRes.success)) {
        setReadiness(readinessRes.data as DecisionReadiness);
      }
    } catch (error) {
      console.error('Failed to fetch Gnosis data:', error);
    } finally {
      setLoading(stryMutAct_9fa48("23904") ? true : (stryCov_9fa48("23904"), false));
    }
  }, stryMutAct_9fa48("23905") ? ["Stryker was here"] : (stryCov_9fa48("23905"), []));
  useEffect(() => {
    fetchData();
  }, stryMutAct_9fa48("23907") ? [] : (stryCov_9fa48("23907"), [fetchData]));
  const getReadinessColor = (score: number) => {
    if (stryMutAct_9fa48("23912") ? score < 80 : stryMutAct_9fa48("23911") ? score > 80 : stryMutAct_9fa48("23910") ? false : stryMutAct_9fa48("23909") ? true : (stryCov_9fa48("23909", "23910", "23911", "23912"), score >= 80)) {
      return 'text-green-400';
    }
    if (stryMutAct_9fa48("23918") ? score < 50 : stryMutAct_9fa48("23917") ? score > 50 : stryMutAct_9fa48("23916") ? false : stryMutAct_9fa48("23915") ? true : (stryCov_9fa48("23915", "23916", "23917", "23918"), score >= 50)) {
      return 'text-amber-400';
    }
    return 'text-red-400';
  };
  const getSkillLevelLabel = (level: number) => {
    if (stryMutAct_9fa48("23926") ? level < 90 : stryMutAct_9fa48("23925") ? level > 90 : stryMutAct_9fa48("23924") ? false : stryMutAct_9fa48("23923") ? true : (stryCov_9fa48("23923", "23924", "23925", "23926"), level >= 90)) {
      return 'Expert';
    }
    if (stryMutAct_9fa48("23932") ? level < 70 : stryMutAct_9fa48("23931") ? level > 70 : stryMutAct_9fa48("23930") ? false : stryMutAct_9fa48("23929") ? true : (stryCov_9fa48("23929", "23930", "23931", "23932"), level >= 70)) {
      return 'Advanced';
    }
    if (stryMutAct_9fa48("23938") ? level < 50 : stryMutAct_9fa48("23937") ? level > 50 : stryMutAct_9fa48("23936") ? false : stryMutAct_9fa48("23935") ? true : (stryCov_9fa48("23935", "23936", "23937", "23938"), level >= 50)) {
      return 'Intermediate';
    }
    if (stryMutAct_9fa48("23944") ? level < 30 : stryMutAct_9fa48("23943") ? level > 30 : stryMutAct_9fa48("23942") ? false : stryMutAct_9fa48("23941") ? true : (stryCov_9fa48("23941", "23942", "23943", "23944"), level >= 30)) {
      return 'Beginner';
    }
    return 'Novice';
  };

  // RAG Document Upload Handler (Sovereign Stack Integration + Tika)
  const handleDocumentUpload = async (file: File) => {
    try {
      const documentId = `doc-${Date.now()}`;

      // Read file as base64 for Tika extraction
      const arrayBuffer = await file.arrayBuffer();
      const base64Content = btoa(new Uint8Array(arrayBuffer).reduce(stryMutAct_9fa48("23951") ? () => undefined : (stryCov_9fa48("23951"), (data, byte) => stryMutAct_9fa48("23952") ? data - String.fromCharCode(byte) : (stryCov_9fa48("23952"), data + String.fromCharCode(byte))), ''));

      // Use Apache Tika for intelligent text extraction (PDF, DOCX, PPTX, etc.)
      let extractedText = '';
      let metadata: any = {};
      const tikaResult = await enterpriseApi.extractDocument(base64Content, file.type, file.name, stryMutAct_9fa48("23955") ? true : (stryCov_9fa48("23955"), false) // useOCR - set true for scanned documents
      );
      if (stryMutAct_9fa48("23957") ? false : stryMutAct_9fa48("23956") ? true : (stryCov_9fa48("23956", "23957"), tikaResult)) {
        extractedText = tikaResult.text;
        metadata = tikaResult.metadata;
        console.log('[Gnosis] Tika extracted:', tikaResult.wordCount, 'words from', file.name);
      } else {
        // Fallback to raw text for plain text files
        extractedText = await file.text();
        console.log('[Gnosis] Using raw text extraction for:', file.name);
      }

      // Upload original file to MinIO
      await sovereignApi.storage.uploadDocument(file.name, base64Content, file.type, stryMutAct_9fa48("23963") ? {} : (stryCov_9fa48("23963"), {
        uploadedBy: 'gnosis',
        type: 'learning-material',
        ...metadata
      }));
      console.log('[Gnosis] Document uploaded to MinIO:', file.name);

      // Store extracted text embeddings in pgvector for RAG
      const chunks = await sovereignApi.vector.storeDocument(documentId, extractedText, stryMutAct_9fa48("23967") ? {} : (stryCov_9fa48("23967"), {
        fileName: file.name,
        type: 'learning-material',
        extractedBy: 'tika',
        wordCount: metadata.wordCount,
        ...metadata
      }));
      console.log('[Gnosis] Document indexed for RAG:', chunks, 'chunks');

      // Queue for additional processing if needed
      await sovereignApi.queue.queueDocumentProcessing(stryMutAct_9fa48("23972") ? {} : (stryCov_9fa48("23972"), {
        documentId,
        fileName: file.name,
        fileType: file.type,
        storageUrl: `minio://cendia-documents/${file.name}`,
        extractText: stryMutAct_9fa48("23974") ? true : (stryCov_9fa48("23974"), false),
        // Already extracted via Tika
        generateEmbeddings: stryMutAct_9fa48("23975") ? false : (stryCov_9fa48("23975"), true)
      }));
      return stryMutAct_9fa48("23976") ? {} : (stryCov_9fa48("23976"), {
        success: stryMutAct_9fa48("23977") ? false : (stryCov_9fa48("23977"), true),
        documentId,
        chunks,
        wordCount: metadata.wordCount
      });
    } catch (error) {
      console.error('[Gnosis] Document upload failed:', error);
      return stryMutAct_9fa48("23980") ? {} : (stryCov_9fa48("23980"), {
        success: stryMutAct_9fa48("23981") ? true : (stryCov_9fa48("23981"), false),
        error
      });
    }
  };

  // RAG Search Handler
  const searchKnowledgeBase = async (query: string) => {
    try {
      const results = await sovereignApi.vector.searchSimilar(query, 5, 0.7);
      console.log('[Gnosis] RAG search results:', results.length);
      return results;
    } catch (error) {
      console.error('[Gnosis] RAG search failed:', error);
      return stryMutAct_9fa48("23987") ? ["Stryker was here"] : (stryCov_9fa48("23987"), []);
    }
  };
  if (stryMutAct_9fa48("23989") ? false : stryMutAct_9fa48("23988") ? true : (stryCov_9fa48("23988", "23989"), loading)) {
    return <div className="flex items-center justify-center h-screen bg-neutral-950">
        <div className="text-center">
          <GraduationCap className="w-12 h-12 text-indigo-500 animate-pulse mx-auto mb-4" />
          <p className="text-neutral-400">Loading Learning Platform...</p>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-neutral-950 text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">CendiaGnosis™</h1>
              <p className="text-neutral-400">Sovereign Education Engine</p>
            </div>
          </div>
          
          <button onClick={fetchData} className="px-4 py-2 bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded-lg flex items-center gap-2 hover:bg-indigo-500/30 transition">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
        
        <p className="text-neutral-500 mt-2 max-w-2xl">
          The Council decides tomorrow's strategy tonight. Gnosis teaches every human how to execute it by morning.
        </p>

        {/* Sovereign Storage Integration */}
        <div className="mt-4 flex items-center gap-3">
          <a href="http://localhost:9001" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/20 border border-blue-500/30 rounded-lg hover:bg-blue-500/30 transition-colors">
            <span className="text-blue-400 text-xs font-medium">📦 MinIO Document Storage</span>
          </a>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-500/20 border border-purple-500/30 rounded-lg">
            <span className="text-purple-400 text-xs font-medium">🧠 pgvector RAG Search</span>
          </div>
          <a href="http://localhost:7700" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/20 border border-amber-500/30 rounded-lg hover:bg-amber-500/30 transition-colors">
            <span className="text-amber-400 text-xs font-medium">🔍 Meilisearch</span>
          </a>
        </div>
      </div>

      {/* Decision Readiness Banner */}
      <div className={`mb-8 p-6 rounded-xl border ${(stryMutAct_9fa48("23994") ? readiness?.status !== 'ready' : stryMutAct_9fa48("23993") ? false : stryMutAct_9fa48("23992") ? true : (stryCov_9fa48("23992", "23993", "23994"), (stryMutAct_9fa48("23995") ? readiness.status : (stryCov_9fa48("23995"), readiness?.status)) === 'ready')) ? 'bg-green-500/10 border-green-500/30' : (stryMutAct_9fa48("24000") ? readiness?.status !== 'partial' : stryMutAct_9fa48("23999") ? false : stryMutAct_9fa48("23998") ? true : (stryCov_9fa48("23998", "23999", "24000"), (stryMutAct_9fa48("24001") ? readiness.status : (stryCov_9fa48("24001"), readiness?.status)) === 'partial')) ? 'bg-amber-500/10 border-amber-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${(stryMutAct_9fa48("24008") ? readiness?.status !== 'ready' : stryMutAct_9fa48("24007") ? false : stryMutAct_9fa48("24006") ? true : (stryCov_9fa48("24006", "24007", "24008"), (stryMutAct_9fa48("24009") ? readiness.status : (stryCov_9fa48("24009"), readiness?.status)) === 'ready')) ? 'bg-green-500/20' : (stryMutAct_9fa48("24014") ? readiness?.status !== 'partial' : stryMutAct_9fa48("24013") ? false : stryMutAct_9fa48("24012") ? true : (stryCov_9fa48("24012", "24013", "24014"), (stryMutAct_9fa48("24015") ? readiness.status : (stryCov_9fa48("24015"), readiness?.status)) === 'partial')) ? 'bg-amber-500/20' : 'bg-red-500/20'}`}>
              <span className={`text-2xl font-bold ${getReadinessColor(stryMutAct_9fa48("24022") ? readiness?.readinessScore && 0 : stryMutAct_9fa48("24021") ? false : stryMutAct_9fa48("24020") ? true : (stryCov_9fa48("24020", "24021", "24022"), (stryMutAct_9fa48("24023") ? readiness.readinessScore : (stryCov_9fa48("24023"), readiness?.readinessScore)) || 0))}`}>
                {stryMutAct_9fa48("24026") ? readiness?.readinessScore?.toFixed(0) && 0 : stryMutAct_9fa48("24025") ? false : stryMutAct_9fa48("24024") ? true : (stryCov_9fa48("24024", "24025", "24026"), (stryMutAct_9fa48("24028") ? readiness.readinessScore?.toFixed(0) : stryMutAct_9fa48("24027") ? readiness?.readinessScore.toFixed(0) : (stryCov_9fa48("24027", "24028"), readiness?.readinessScore?.toFixed(0))) || 0)}%
              </span>
            </div>
            <div>
              <h2 className="text-xl font-semibold">Decision Readiness</h2>
              <p className={`text-sm ${(stryMutAct_9fa48("24032") ? readiness?.status !== 'ready' : stryMutAct_9fa48("24031") ? false : stryMutAct_9fa48("24030") ? true : (stryCov_9fa48("24030", "24031", "24032"), (stryMutAct_9fa48("24033") ? readiness.status : (stryCov_9fa48("24033"), readiness?.status)) === 'ready')) ? 'text-green-400' : (stryMutAct_9fa48("24038") ? readiness?.status !== 'partial' : stryMutAct_9fa48("24037") ? false : stryMutAct_9fa48("24036") ? true : (stryCov_9fa48("24036", "24037", "24038"), (stryMutAct_9fa48("24039") ? readiness.status : (stryCov_9fa48("24039"), readiness?.status)) === 'partial')) ? 'text-amber-400' : 'text-red-400'}`}>
                {stryMutAct_9fa48("24043") ? readiness.message : (stryCov_9fa48("24043"), readiness?.message)}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-8 text-sm">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{stryMutAct_9fa48("24046") ? readiness?.totalLearners && 0 : stryMutAct_9fa48("24045") ? false : stryMutAct_9fa48("24044") ? true : (stryCov_9fa48("24044", "24045", "24046"), (stryMutAct_9fa48("24047") ? readiness.totalLearners : (stryCov_9fa48("24047"), readiness?.totalLearners)) || 0)}</p>
              <p className="text-neutral-500">Total Learners</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-indigo-400">{stryMutAct_9fa48("24050") ? readiness?.activeLearners && 0 : stryMutAct_9fa48("24049") ? false : stryMutAct_9fa48("24048") ? true : (stryCov_9fa48("24048", "24049", "24050"), (stryMutAct_9fa48("24051") ? readiness.activeLearners : (stryCov_9fa48("24051"), readiness?.activeLearners)) || 0)}</p>
              <p className="text-neutral-500">Active Now</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-400">{stryMutAct_9fa48("24054") ? readiness?.completedPaths && 0 : stryMutAct_9fa48("24053") ? false : stryMutAct_9fa48("24052") ? true : (stryCov_9fa48("24052", "24053", "24054"), (stryMutAct_9fa48("24055") ? readiness.completedPaths : (stryCov_9fa48("24055"), readiness?.completedPaths)) || 0)}</p>
              <p className="text-neutral-500">Paths Completed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {(stryMutAct_9fa48("24056") ? [] : (stryCov_9fa48("24056"), [stryMutAct_9fa48("24057") ? {} : (stryCov_9fa48("24057"), {
        id: 'overview',
        label: 'Overview',
        icon: Layers
      }), stryMutAct_9fa48("24060") ? {} : (stryCov_9fa48("24060"), {
        id: 'skills',
        label: 'My Skills',
        icon: Brain
      }), stryMutAct_9fa48("24063") ? {} : (stryCov_9fa48("24063"), {
        id: 'paths',
        label: 'Learning Paths',
        icon: BookOpen
      }), stryMutAct_9fa48("24066") ? {} : (stryCov_9fa48("24066"), {
        id: 'analytics',
        label: 'Analytics',
        icon: BarChart3
      })])).map(stryMutAct_9fa48("24069") ? () => undefined : (stryCov_9fa48("24069"), ({
        id,
        label,
        icon: Icon
      }) => <button key={id} onClick={stryMutAct_9fa48("24070") ? () => undefined : (stryCov_9fa48("24070"), () => setActiveTab(id as typeof activeTab))} className={`px-4 py-2 rounded-lg flex items-center gap-2 transition ${(stryMutAct_9fa48("24074") ? activeTab !== id : stryMutAct_9fa48("24073") ? false : stryMutAct_9fa48("24072") ? true : (stryCov_9fa48("24072", "24073", "24074"), activeTab === id)) ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : 'bg-neutral-900 text-neutral-400 hover:bg-neutral-800'}`}>
            <Icon className="w-4 h-4" />
            {label}
          </button>))}
      </div>

      {stryMutAct_9fa48("24079") ? activeTab === 'overview' || <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Your Profile Summary */}
          <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500" />
              Your Profile
            </h2>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-neutral-500 mb-2">Learning Style</p>
                <p className="text-lg font-medium capitalize">{profile?.learningStyle || 'Visual'}</p>
              </div>
              
              <div>
                <p className="text-sm text-neutral-500 mb-2">Preferred Pace</p>
                <p className="text-lg font-medium capitalize">{profile?.preferredPace?.replace(/_/g, ' ') || 'Self-paced'}</p>
              </div>
              
              <div>
                <p className="text-sm text-neutral-500 mb-2">Skills Tracked</p>
                <p className="text-lg font-medium">{dashboard?.userProfile.skillCount || 0} skills</p>
              </div>
              
              <div className="pt-4 border-t border-neutral-800">
                <p className="text-sm text-neutral-500 mb-2">Strengths</p>
                <div className="flex flex-wrap gap-2">
                  {(profile?.strengths || []).slice(0, 5).map((strength, idx) => <span key={idx} className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-lg">
                      {strength}
                    </span>)}
                  {(profile?.strengths || []).length === 0 && <span className="text-neutral-500 text-sm">Complete assessments to identify strengths</span>}
                </div>
              </div>
              
              <div className="pt-4 border-t border-neutral-800">
                <p className="text-sm text-neutral-500 mb-2">Skills to Develop</p>
                <div className="flex flex-wrap gap-2">
                  {(profile?.gaps || []).slice(0, 5).map((gap, idx) => <span key={idx} className="px-2 py-1 bg-amber-500/20 text-amber-400 text-xs rounded-lg">
                      {gap}
                    </span>)}
                  {(profile?.gaps || []).length === 0 && <span className="text-neutral-500 text-sm">No skill gaps identified</span>}
                </div>
              </div>
            </div>
          </div>

          {/* Recommended Paths */}
          <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <BookMarked className="w-5 h-5 text-indigo-500" />
              Recommended for You
            </h2>
            
            <div className="space-y-3">
              {learningPaths.map(path => <div key={path.id} className="p-4 bg-neutral-800/50 rounded-lg hover:bg-neutral-800 transition cursor-pointer">
                  <div className="flex items-start justify-between mb-2">
                    <p className="font-medium">{path.title}</p>
                    <span className={`px-2 py-1 text-xs rounded capitalize ${path.difficulty === 'beginner' ? 'bg-green-500/20 text-green-400' : path.difficulty === 'intermediate' ? 'bg-amber-500/20 text-amber-400' : 'bg-purple-500/20 text-purple-400'}`}>
                      {path.difficulty}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3 text-sm text-neutral-500 mb-3">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {path.duration}
                    </span>
                    {path.progress > 0 && <span className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        {path.progress}% complete
                      </span>}
                  </div>
                  
                  <div className="h-1.5 bg-neutral-700 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full" style={{
                width: `${path.progress}%`
              }} />
                  </div>
                  
                  <button onClick={() => setSelectedPath(path)} className="mt-3 w-full py-2 bg-indigo-500/20 text-indigo-400 rounded-lg text-sm hover:bg-indigo-500/30 transition flex items-center justify-center gap-2">
                    {path.progress > 0 ? <>
                        <Play className="w-4 h-4" />
                        Continue Learning
                      </> : <>
                        <Play className="w-4 h-4" />
                        Start Path
                      </>}
                  </button>
                </div>)}
            </div>
          </div>

          {/* Organization Leaderboard */}
          <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              Top Performers
            </h2>
            
            <div className="space-y-3">
              {(dashboard?.topPerformers || []).length > 0 ? dashboard?.topPerformers.map((performer, idx) => <div key={performer.userId} className="flex items-center gap-3 p-3 bg-neutral-800/50 rounded-lg">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${idx === 0 ? 'bg-amber-500/20 text-amber-400' : idx === 1 ? 'bg-neutral-400/20 text-neutral-300' : idx === 2 ? 'bg-orange-500/20 text-orange-400' : 'bg-neutral-700 text-neutral-400'}`}>
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{performer.name}</p>
                    </div>
                    <span className="text-indigo-400 font-bold">{performer.score}%</span>
                  </div>) : (/* Demo leaderboard */
          [{
            name: 'Sarah Chen',
            score: 98
          }, {
            name: 'Marcus Johnson',
            score: 95
          }, {
            name: 'Emily Rodriguez',
            score: 92
          }, {
            name: 'David Kim',
            score: 89
          }, {
            name: 'Lisa Thompson',
            score: 87
          }].map((performer, idx) => <div key={idx} className="flex items-center gap-3 p-3 bg-neutral-800/50 rounded-lg">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${idx === 0 ? 'bg-amber-500/20 text-amber-400' : idx === 1 ? 'bg-neutral-400/20 text-neutral-300' : idx === 2 ? 'bg-orange-500/20 text-orange-400' : 'bg-neutral-700 text-neutral-400'}`}>
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{performer.name}</p>
                    </div>
                    <span className="text-indigo-400 font-bold">{performer.score}%</span>
                  </div>))}
            </div>
            
            {/* At Risk Learners */}
            {(dashboard?.atRiskLearners || []).length > 0 && <div className="mt-6 pt-4 border-t border-neutral-800">
                <h3 className="text-sm font-medium text-neutral-400 mb-3 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-500" />
                  Needs Attention
                </h3>
                
                <div className="space-y-2">
                  {dashboard?.atRiskLearners.slice(0, 3).map(learner => <div key={learner.userId} className="flex items-center justify-between p-2 bg-amber-500/10 rounded-lg">
                      <span className="text-sm">{learner.name}</span>
                      <span className="text-xs text-amber-400">{learner.reason}</span>
                    </div>)}
                </div>
              </div>}
          </div>
        </div> : stryMutAct_9fa48("24078") ? false : stryMutAct_9fa48("24077") ? true : (stryCov_9fa48("24077", "24078", "24079"), (stryMutAct_9fa48("24081") ? activeTab !== 'overview' : stryMutAct_9fa48("24080") ? true : (stryCov_9fa48("24080", "24081"), activeTab === 'overview')) && <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Your Profile Summary */}
          <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500" />
              Your Profile
            </h2>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-neutral-500 mb-2">Learning Style</p>
                <p className="text-lg font-medium capitalize">{stryMutAct_9fa48("24085") ? profile?.learningStyle && 'Visual' : stryMutAct_9fa48("24084") ? false : stryMutAct_9fa48("24083") ? true : (stryCov_9fa48("24083", "24084", "24085"), (stryMutAct_9fa48("24086") ? profile.learningStyle : (stryCov_9fa48("24086"), profile?.learningStyle)) || 'Visual')}</p>
              </div>
              
              <div>
                <p className="text-sm text-neutral-500 mb-2">Preferred Pace</p>
                <p className="text-lg font-medium capitalize">{stryMutAct_9fa48("24090") ? profile?.preferredPace?.replace(/_/g, ' ') && 'Self-paced' : stryMutAct_9fa48("24089") ? false : stryMutAct_9fa48("24088") ? true : (stryCov_9fa48("24088", "24089", "24090"), (stryMutAct_9fa48("24092") ? profile.preferredPace?.replace(/_/g, ' ') : stryMutAct_9fa48("24091") ? profile?.preferredPace.replace(/_/g, ' ') : (stryCov_9fa48("24091", "24092"), profile?.preferredPace?.replace(/_/g, ' '))) || 'Self-paced')}</p>
              </div>
              
              <div>
                <p className="text-sm text-neutral-500 mb-2">Skills Tracked</p>
                <p className="text-lg font-medium">{stryMutAct_9fa48("24097") ? dashboard?.userProfile.skillCount && 0 : stryMutAct_9fa48("24096") ? false : stryMutAct_9fa48("24095") ? true : (stryCov_9fa48("24095", "24096", "24097"), (stryMutAct_9fa48("24098") ? dashboard.userProfile.skillCount : (stryCov_9fa48("24098"), dashboard?.userProfile.skillCount)) || 0)} skills</p>
              </div>
              
              <div className="pt-4 border-t border-neutral-800">
                <p className="text-sm text-neutral-500 mb-2">Strengths</p>
                <div className="flex flex-wrap gap-2">
                  {stryMutAct_9fa48("24099") ? (profile?.strengths || []).map((strength, idx) => <span key={idx} className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-lg">
                      {strength}
                    </span>) : (stryCov_9fa48("24099"), (stryMutAct_9fa48("24102") ? profile?.strengths && [] : stryMutAct_9fa48("24101") ? false : stryMutAct_9fa48("24100") ? true : (stryCov_9fa48("24100", "24101", "24102"), (stryMutAct_9fa48("24103") ? profile.strengths : (stryCov_9fa48("24103"), profile?.strengths)) || (stryMutAct_9fa48("24104") ? ["Stryker was here"] : (stryCov_9fa48("24104"), [])))).slice(0, 5).map(stryMutAct_9fa48("24105") ? () => undefined : (stryCov_9fa48("24105"), (strength, idx) => <span key={idx} className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-lg">
                      {strength}
                    </span>)))}
                  {stryMutAct_9fa48("24108") ? (profile?.strengths || []).length === 0 || <span className="text-neutral-500 text-sm">Complete assessments to identify strengths</span> : stryMutAct_9fa48("24107") ? false : stryMutAct_9fa48("24106") ? true : (stryCov_9fa48("24106", "24107", "24108"), (stryMutAct_9fa48("24110") ? (profile?.strengths || []).length !== 0 : stryMutAct_9fa48("24109") ? true : (stryCov_9fa48("24109", "24110"), (stryMutAct_9fa48("24113") ? profile?.strengths && [] : stryMutAct_9fa48("24112") ? false : stryMutAct_9fa48("24111") ? true : (stryCov_9fa48("24111", "24112", "24113"), (stryMutAct_9fa48("24114") ? profile.strengths : (stryCov_9fa48("24114"), profile?.strengths)) || (stryMutAct_9fa48("24115") ? ["Stryker was here"] : (stryCov_9fa48("24115"), [])))).length === 0)) && <span className="text-neutral-500 text-sm">Complete assessments to identify strengths</span>)}
                </div>
              </div>
              
              <div className="pt-4 border-t border-neutral-800">
                <p className="text-sm text-neutral-500 mb-2">Skills to Develop</p>
                <div className="flex flex-wrap gap-2">
                  {stryMutAct_9fa48("24116") ? (profile?.gaps || []).map((gap, idx) => <span key={idx} className="px-2 py-1 bg-amber-500/20 text-amber-400 text-xs rounded-lg">
                      {gap}
                    </span>) : (stryCov_9fa48("24116"), (stryMutAct_9fa48("24119") ? profile?.gaps && [] : stryMutAct_9fa48("24118") ? false : stryMutAct_9fa48("24117") ? true : (stryCov_9fa48("24117", "24118", "24119"), (stryMutAct_9fa48("24120") ? profile.gaps : (stryCov_9fa48("24120"), profile?.gaps)) || (stryMutAct_9fa48("24121") ? ["Stryker was here"] : (stryCov_9fa48("24121"), [])))).slice(0, 5).map(stryMutAct_9fa48("24122") ? () => undefined : (stryCov_9fa48("24122"), (gap, idx) => <span key={idx} className="px-2 py-1 bg-amber-500/20 text-amber-400 text-xs rounded-lg">
                      {gap}
                    </span>)))}
                  {stryMutAct_9fa48("24125") ? (profile?.gaps || []).length === 0 || <span className="text-neutral-500 text-sm">No skill gaps identified</span> : stryMutAct_9fa48("24124") ? false : stryMutAct_9fa48("24123") ? true : (stryCov_9fa48("24123", "24124", "24125"), (stryMutAct_9fa48("24127") ? (profile?.gaps || []).length !== 0 : stryMutAct_9fa48("24126") ? true : (stryCov_9fa48("24126", "24127"), (stryMutAct_9fa48("24130") ? profile?.gaps && [] : stryMutAct_9fa48("24129") ? false : stryMutAct_9fa48("24128") ? true : (stryCov_9fa48("24128", "24129", "24130"), (stryMutAct_9fa48("24131") ? profile.gaps : (stryCov_9fa48("24131"), profile?.gaps)) || (stryMutAct_9fa48("24132") ? ["Stryker was here"] : (stryCov_9fa48("24132"), [])))).length === 0)) && <span className="text-neutral-500 text-sm">No skill gaps identified</span>)}
                </div>
              </div>
            </div>
          </div>

          {/* Recommended Paths */}
          <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <BookMarked className="w-5 h-5 text-indigo-500" />
              Recommended for You
            </h2>
            
            <div className="space-y-3">
              {learningPaths.map(stryMutAct_9fa48("24133") ? () => undefined : (stryCov_9fa48("24133"), path => <div key={path.id} className="p-4 bg-neutral-800/50 rounded-lg hover:bg-neutral-800 transition cursor-pointer">
                  <div className="flex items-start justify-between mb-2">
                    <p className="font-medium">{path.title}</p>
                    <span className={`px-2 py-1 text-xs rounded capitalize ${(stryMutAct_9fa48("24137") ? path.difficulty !== 'beginner' : stryMutAct_9fa48("24136") ? false : stryMutAct_9fa48("24135") ? true : (stryCov_9fa48("24135", "24136", "24137"), path.difficulty === 'beginner')) ? 'bg-green-500/20 text-green-400' : (stryMutAct_9fa48("24142") ? path.difficulty !== 'intermediate' : stryMutAct_9fa48("24141") ? false : stryMutAct_9fa48("24140") ? true : (stryCov_9fa48("24140", "24141", "24142"), path.difficulty === 'intermediate')) ? 'bg-amber-500/20 text-amber-400' : 'bg-purple-500/20 text-purple-400'}`}>
                      {path.difficulty}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3 text-sm text-neutral-500 mb-3">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {path.duration}
                    </span>
                    {stryMutAct_9fa48("24148") ? path.progress > 0 || <span className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        {path.progress}% complete
                      </span> : stryMutAct_9fa48("24147") ? false : stryMutAct_9fa48("24146") ? true : (stryCov_9fa48("24146", "24147", "24148"), (stryMutAct_9fa48("24151") ? path.progress <= 0 : stryMutAct_9fa48("24150") ? path.progress >= 0 : stryMutAct_9fa48("24149") ? true : (stryCov_9fa48("24149", "24150", "24151"), path.progress > 0)) && <span className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        {path.progress}% complete
                      </span>)}
                  </div>
                  
                  <div className="h-1.5 bg-neutral-700 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full" style={stryMutAct_9fa48("24152") ? {} : (stryCov_9fa48("24152"), {
                width: `${path.progress}%`
              })} />
                  </div>
                  
                  <button onClick={stryMutAct_9fa48("24154") ? () => undefined : (stryCov_9fa48("24154"), () => setSelectedPath(path))} className="mt-3 w-full py-2 bg-indigo-500/20 text-indigo-400 rounded-lg text-sm hover:bg-indigo-500/30 transition flex items-center justify-center gap-2">
                    {(stryMutAct_9fa48("24158") ? path.progress <= 0 : stryMutAct_9fa48("24157") ? path.progress >= 0 : stryMutAct_9fa48("24156") ? false : stryMutAct_9fa48("24155") ? true : (stryCov_9fa48("24155", "24156", "24157", "24158"), path.progress > 0)) ? <>
                        <Play className="w-4 h-4" />
                        Continue Learning
                      </> : <>
                        <Play className="w-4 h-4" />
                        Start Path
                      </>}
                  </button>
                </div>))}
            </div>
          </div>

          {/* Organization Leaderboard */}
          <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              Top Performers
            </h2>
            
            <div className="space-y-3">
              {(stryMutAct_9fa48("24162") ? (dashboard?.topPerformers || []).length <= 0 : stryMutAct_9fa48("24161") ? (dashboard?.topPerformers || []).length >= 0 : stryMutAct_9fa48("24160") ? false : stryMutAct_9fa48("24159") ? true : (stryCov_9fa48("24159", "24160", "24161", "24162"), (stryMutAct_9fa48("24165") ? dashboard?.topPerformers && [] : stryMutAct_9fa48("24164") ? false : stryMutAct_9fa48("24163") ? true : (stryCov_9fa48("24163", "24164", "24165"), (stryMutAct_9fa48("24166") ? dashboard.topPerformers : (stryCov_9fa48("24166"), dashboard?.topPerformers)) || (stryMutAct_9fa48("24167") ? ["Stryker was here"] : (stryCov_9fa48("24167"), [])))).length > 0)) ? stryMutAct_9fa48("24168") ? dashboard.topPerformers.map((performer, idx) => <div key={performer.userId} className="flex items-center gap-3 p-3 bg-neutral-800/50 rounded-lg">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${idx === 0 ? 'bg-amber-500/20 text-amber-400' : idx === 1 ? 'bg-neutral-400/20 text-neutral-300' : idx === 2 ? 'bg-orange-500/20 text-orange-400' : 'bg-neutral-700 text-neutral-400'}`}>
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{performer.name}</p>
                    </div>
                    <span className="text-indigo-400 font-bold">{performer.score}%</span>
                  </div>) : (stryCov_9fa48("24168"), dashboard?.topPerformers.map(stryMutAct_9fa48("24169") ? () => undefined : (stryCov_9fa48("24169"), (performer, idx) => <div key={performer.userId} className="flex items-center gap-3 p-3 bg-neutral-800/50 rounded-lg">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${(stryMutAct_9fa48("24173") ? idx !== 0 : stryMutAct_9fa48("24172") ? false : stryMutAct_9fa48("24171") ? true : (stryCov_9fa48("24171", "24172", "24173"), idx === 0)) ? 'bg-amber-500/20 text-amber-400' : (stryMutAct_9fa48("24177") ? idx !== 1 : stryMutAct_9fa48("24176") ? false : stryMutAct_9fa48("24175") ? true : (stryCov_9fa48("24175", "24176", "24177"), idx === 1)) ? 'bg-neutral-400/20 text-neutral-300' : (stryMutAct_9fa48("24181") ? idx !== 2 : stryMutAct_9fa48("24180") ? false : stryMutAct_9fa48("24179") ? true : (stryCov_9fa48("24179", "24180", "24181"), idx === 2)) ? 'bg-orange-500/20 text-orange-400' : 'bg-neutral-700 text-neutral-400'}`}>
                      {stryMutAct_9fa48("24184") ? idx - 1 : (stryCov_9fa48("24184"), idx + 1)}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{performer.name}</p>
                    </div>
                    <span className="text-indigo-400 font-bold">{performer.score}%</span>
                  </div>))) : (/* Demo leaderboard */
          (stryMutAct_9fa48("24185") ? [] : (stryCov_9fa48("24185"), [stryMutAct_9fa48("24186") ? {} : (stryCov_9fa48("24186"), {
            name: 'Sarah Chen',
            score: 98
          }), stryMutAct_9fa48("24188") ? {} : (stryCov_9fa48("24188"), {
            name: 'Marcus Johnson',
            score: 95
          }), stryMutAct_9fa48("24190") ? {} : (stryCov_9fa48("24190"), {
            name: 'Emily Rodriguez',
            score: 92
          }), stryMutAct_9fa48("24192") ? {} : (stryCov_9fa48("24192"), {
            name: 'David Kim',
            score: 89
          }), stryMutAct_9fa48("24194") ? {} : (stryCov_9fa48("24194"), {
            name: 'Lisa Thompson',
            score: 87
          })])).map(stryMutAct_9fa48("24196") ? () => undefined : (stryCov_9fa48("24196"), (performer, idx) => <div key={idx} className="flex items-center gap-3 p-3 bg-neutral-800/50 rounded-lg">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${(stryMutAct_9fa48("24200") ? idx !== 0 : stryMutAct_9fa48("24199") ? false : stryMutAct_9fa48("24198") ? true : (stryCov_9fa48("24198", "24199", "24200"), idx === 0)) ? 'bg-amber-500/20 text-amber-400' : (stryMutAct_9fa48("24204") ? idx !== 1 : stryMutAct_9fa48("24203") ? false : stryMutAct_9fa48("24202") ? true : (stryCov_9fa48("24202", "24203", "24204"), idx === 1)) ? 'bg-neutral-400/20 text-neutral-300' : (stryMutAct_9fa48("24208") ? idx !== 2 : stryMutAct_9fa48("24207") ? false : stryMutAct_9fa48("24206") ? true : (stryCov_9fa48("24206", "24207", "24208"), idx === 2)) ? 'bg-orange-500/20 text-orange-400' : 'bg-neutral-700 text-neutral-400'}`}>
                      {stryMutAct_9fa48("24211") ? idx - 1 : (stryCov_9fa48("24211"), idx + 1)}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{performer.name}</p>
                    </div>
                    <span className="text-indigo-400 font-bold">{performer.score}%</span>
                  </div>)))}
            </div>
            
            {/* At Risk Learners */}
            {stryMutAct_9fa48("24214") ? (dashboard?.atRiskLearners || []).length > 0 || <div className="mt-6 pt-4 border-t border-neutral-800">
                <h3 className="text-sm font-medium text-neutral-400 mb-3 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-500" />
                  Needs Attention
                </h3>
                
                <div className="space-y-2">
                  {dashboard?.atRiskLearners.slice(0, 3).map(learner => <div key={learner.userId} className="flex items-center justify-between p-2 bg-amber-500/10 rounded-lg">
                      <span className="text-sm">{learner.name}</span>
                      <span className="text-xs text-amber-400">{learner.reason}</span>
                    </div>)}
                </div>
              </div> : stryMutAct_9fa48("24213") ? false : stryMutAct_9fa48("24212") ? true : (stryCov_9fa48("24212", "24213", "24214"), (stryMutAct_9fa48("24217") ? (dashboard?.atRiskLearners || []).length <= 0 : stryMutAct_9fa48("24216") ? (dashboard?.atRiskLearners || []).length >= 0 : stryMutAct_9fa48("24215") ? true : (stryCov_9fa48("24215", "24216", "24217"), (stryMutAct_9fa48("24220") ? dashboard?.atRiskLearners && [] : stryMutAct_9fa48("24219") ? false : stryMutAct_9fa48("24218") ? true : (stryCov_9fa48("24218", "24219", "24220"), (stryMutAct_9fa48("24221") ? dashboard.atRiskLearners : (stryCov_9fa48("24221"), dashboard?.atRiskLearners)) || (stryMutAct_9fa48("24222") ? ["Stryker was here"] : (stryCov_9fa48("24222"), [])))).length > 0)) && <div className="mt-6 pt-4 border-t border-neutral-800">
                <h3 className="text-sm font-medium text-neutral-400 mb-3 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-500" />
                  Needs Attention
                </h3>
                
                <div className="space-y-2">
                  {stryMutAct_9fa48("24224") ? dashboard.atRiskLearners.slice(0, 3).map(learner => <div key={learner.userId} className="flex items-center justify-between p-2 bg-amber-500/10 rounded-lg">
                      <span className="text-sm">{learner.name}</span>
                      <span className="text-xs text-amber-400">{learner.reason}</span>
                    </div>) : stryMutAct_9fa48("24223") ? dashboard?.atRiskLearners.map(learner => <div key={learner.userId} className="flex items-center justify-between p-2 bg-amber-500/10 rounded-lg">
                      <span className="text-sm">{learner.name}</span>
                      <span className="text-xs text-amber-400">{learner.reason}</span>
                    </div>) : (stryCov_9fa48("24223", "24224"), dashboard?.atRiskLearners.slice(0, 3).map(stryMutAct_9fa48("24225") ? () => undefined : (stryCov_9fa48("24225"), learner => <div key={learner.userId} className="flex items-center justify-between p-2 bg-amber-500/10 rounded-lg">
                      <span className="text-sm">{learner.name}</span>
                      <span className="text-xs text-amber-400">{learner.reason}</span>
                    </div>)))}
                </div>
              </div>)}
          </div>
        </div>)}

      {stryMutAct_9fa48("24228") ? activeTab === 'skills' || <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-500" />
              Skill Levels
            </h2>
            
            <div className="space-y-4">
              {Object.entries(profile?.skills || {}).length > 0 ? Object.entries(profile?.skills || {}).map(([skillName, skill]) => <div key={skillName}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">{skill.name || skillName}</span>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded ${skill.level >= 70 ? 'bg-green-500/20 text-green-400' : skill.level >= 50 ? 'bg-amber-500/20 text-amber-400' : 'bg-red-500/20 text-red-400'}`}>
                          {getSkillLevelLabel(skill.level)}
                        </span>
                        <span className="text-neutral-400">{skill.level}%</span>
                      </div>
                    </div>
                    <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${skill.level >= 70 ? 'bg-green-500' : skill.level >= 50 ? 'bg-amber-500' : 'bg-red-500'}`} style={{
                width: `${skill.level}%`
              }} />
                    </div>
                  </div>) : (/* Demo skills */
          [{
            name: 'Strategic Planning',
            level: 85
          }, {
            name: 'Data Analysis',
            level: 72
          }, {
            name: 'Change Management',
            level: 65
          }, {
            name: 'AI Fundamentals',
            level: 58
          }, {
            name: 'Leadership',
            level: 78
          }, {
            name: 'Communication',
            level: 90
          }].map(skill => <div key={skill.name}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">{skill.name}</span>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded ${skill.level >= 70 ? 'bg-green-500/20 text-green-400' : skill.level >= 50 ? 'bg-amber-500/20 text-amber-400' : 'bg-red-500/20 text-red-400'}`}>
                          {getSkillLevelLabel(skill.level)}
                        </span>
                        <span className="text-neutral-400">{skill.level}%</span>
                      </div>
                    </div>
                    <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${skill.level >= 70 ? 'bg-green-500' : skill.level >= 50 ? 'bg-amber-500' : 'bg-red-500'}`} style={{
                width: `${skill.level}%`
              }} />
                    </div>
                  </div>))}
            </div>
          </div>

          <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-indigo-500" />
              Take a Skill Assessment
            </h2>
            
            <p className="text-neutral-400 text-sm mb-4">
              Assess your skills to get personalized learning recommendations and track your growth.
            </p>
            
            <div className="space-y-3">
              {['Leadership', 'Data Analysis', 'AI & Automation', 'Strategic Thinking', 'Communication'].map(skill => <button key={skill} className="w-full flex items-center justify-between p-4 bg-neutral-800/50 rounded-lg hover:bg-neutral-800 transition">
                  <span className="font-medium">{skill}</span>
                  <div className="flex items-center gap-2 text-indigo-400">
                    <span className="text-sm">Start Assessment</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </button>)}
            </div>
          </div>
        </div> : stryMutAct_9fa48("24227") ? false : stryMutAct_9fa48("24226") ? true : (stryCov_9fa48("24226", "24227", "24228"), (stryMutAct_9fa48("24230") ? activeTab !== 'skills' : stryMutAct_9fa48("24229") ? true : (stryCov_9fa48("24229", "24230"), activeTab === 'skills')) && <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-500" />
              Skill Levels
            </h2>
            
            <div className="space-y-4">
              {(stryMutAct_9fa48("24235") ? Object.entries(profile?.skills || {}).length <= 0 : stryMutAct_9fa48("24234") ? Object.entries(profile?.skills || {}).length >= 0 : stryMutAct_9fa48("24233") ? false : stryMutAct_9fa48("24232") ? true : (stryCov_9fa48("24232", "24233", "24234", "24235"), Object.entries(stryMutAct_9fa48("24238") ? profile?.skills && {} : stryMutAct_9fa48("24237") ? false : stryMutAct_9fa48("24236") ? true : (stryCov_9fa48("24236", "24237", "24238"), (stryMutAct_9fa48("24239") ? profile.skills : (stryCov_9fa48("24239"), profile?.skills)) || {})).length > 0)) ? Object.entries(stryMutAct_9fa48("24242") ? profile?.skills && {} : stryMutAct_9fa48("24241") ? false : stryMutAct_9fa48("24240") ? true : (stryCov_9fa48("24240", "24241", "24242"), (stryMutAct_9fa48("24243") ? profile.skills : (stryCov_9fa48("24243"), profile?.skills)) || {})).map(stryMutAct_9fa48("24244") ? () => undefined : (stryCov_9fa48("24244"), ([skillName, skill]) => <div key={skillName}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">{stryMutAct_9fa48("24247") ? skill.name && skillName : stryMutAct_9fa48("24246") ? false : stryMutAct_9fa48("24245") ? true : (stryCov_9fa48("24245", "24246", "24247"), skill.name || skillName)}</span>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded ${(stryMutAct_9fa48("24252") ? skill.level < 70 : stryMutAct_9fa48("24251") ? skill.level > 70 : stryMutAct_9fa48("24250") ? false : stryMutAct_9fa48("24249") ? true : (stryCov_9fa48("24249", "24250", "24251", "24252"), skill.level >= 70)) ? 'bg-green-500/20 text-green-400' : (stryMutAct_9fa48("24257") ? skill.level < 50 : stryMutAct_9fa48("24256") ? skill.level > 50 : stryMutAct_9fa48("24255") ? false : stryMutAct_9fa48("24254") ? true : (stryCov_9fa48("24254", "24255", "24256", "24257"), skill.level >= 50)) ? 'bg-amber-500/20 text-amber-400' : 'bg-red-500/20 text-red-400'}`}>
                          {getSkillLevelLabel(skill.level)}
                        </span>
                        <span className="text-neutral-400">{skill.level}%</span>
                      </div>
                    </div>
                    <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${(stryMutAct_9fa48("24264") ? skill.level < 70 : stryMutAct_9fa48("24263") ? skill.level > 70 : stryMutAct_9fa48("24262") ? false : stryMutAct_9fa48("24261") ? true : (stryCov_9fa48("24261", "24262", "24263", "24264"), skill.level >= 70)) ? 'bg-green-500' : (stryMutAct_9fa48("24269") ? skill.level < 50 : stryMutAct_9fa48("24268") ? skill.level > 50 : stryMutAct_9fa48("24267") ? false : stryMutAct_9fa48("24266") ? true : (stryCov_9fa48("24266", "24267", "24268", "24269"), skill.level >= 50)) ? 'bg-amber-500' : 'bg-red-500'}`} style={stryMutAct_9fa48("24272") ? {} : (stryCov_9fa48("24272"), {
                width: `${skill.level}%`
              })} />
                    </div>
                  </div>)) : (/* Demo skills */
          (stryMutAct_9fa48("24274") ? [] : (stryCov_9fa48("24274"), [stryMutAct_9fa48("24275") ? {} : (stryCov_9fa48("24275"), {
            name: 'Strategic Planning',
            level: 85
          }), stryMutAct_9fa48("24277") ? {} : (stryCov_9fa48("24277"), {
            name: 'Data Analysis',
            level: 72
          }), stryMutAct_9fa48("24279") ? {} : (stryCov_9fa48("24279"), {
            name: 'Change Management',
            level: 65
          }), stryMutAct_9fa48("24281") ? {} : (stryCov_9fa48("24281"), {
            name: 'AI Fundamentals',
            level: 58
          }), stryMutAct_9fa48("24283") ? {} : (stryCov_9fa48("24283"), {
            name: 'Leadership',
            level: 78
          }), stryMutAct_9fa48("24285") ? {} : (stryCov_9fa48("24285"), {
            name: 'Communication',
            level: 90
          })])).map(stryMutAct_9fa48("24287") ? () => undefined : (stryCov_9fa48("24287"), skill => <div key={skill.name}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">{skill.name}</span>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded ${(stryMutAct_9fa48("24292") ? skill.level < 70 : stryMutAct_9fa48("24291") ? skill.level > 70 : stryMutAct_9fa48("24290") ? false : stryMutAct_9fa48("24289") ? true : (stryCov_9fa48("24289", "24290", "24291", "24292"), skill.level >= 70)) ? 'bg-green-500/20 text-green-400' : (stryMutAct_9fa48("24297") ? skill.level < 50 : stryMutAct_9fa48("24296") ? skill.level > 50 : stryMutAct_9fa48("24295") ? false : stryMutAct_9fa48("24294") ? true : (stryCov_9fa48("24294", "24295", "24296", "24297"), skill.level >= 50)) ? 'bg-amber-500/20 text-amber-400' : 'bg-red-500/20 text-red-400'}`}>
                          {getSkillLevelLabel(skill.level)}
                        </span>
                        <span className="text-neutral-400">{skill.level}%</span>
                      </div>
                    </div>
                    <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${(stryMutAct_9fa48("24304") ? skill.level < 70 : stryMutAct_9fa48("24303") ? skill.level > 70 : stryMutAct_9fa48("24302") ? false : stryMutAct_9fa48("24301") ? true : (stryCov_9fa48("24301", "24302", "24303", "24304"), skill.level >= 70)) ? 'bg-green-500' : (stryMutAct_9fa48("24309") ? skill.level < 50 : stryMutAct_9fa48("24308") ? skill.level > 50 : stryMutAct_9fa48("24307") ? false : stryMutAct_9fa48("24306") ? true : (stryCov_9fa48("24306", "24307", "24308", "24309"), skill.level >= 50)) ? 'bg-amber-500' : 'bg-red-500'}`} style={stryMutAct_9fa48("24312") ? {} : (stryCov_9fa48("24312"), {
                width: `${skill.level}%`
              })} />
                    </div>
                  </div>)))}
            </div>
          </div>

          <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-indigo-500" />
              Take a Skill Assessment
            </h2>
            
            <p className="text-neutral-400 text-sm mb-4">
              Assess your skills to get personalized learning recommendations and track your growth.
            </p>
            
            <div className="space-y-3">
              {(stryMutAct_9fa48("24314") ? [] : (stryCov_9fa48("24314"), ['Leadership', 'Data Analysis', 'AI & Automation', 'Strategic Thinking', 'Communication'])).map(stryMutAct_9fa48("24320") ? () => undefined : (stryCov_9fa48("24320"), skill => <button key={skill} className="w-full flex items-center justify-between p-4 bg-neutral-800/50 rounded-lg hover:bg-neutral-800 transition">
                  <span className="font-medium">{skill}</span>
                  <div className="flex items-center gap-2 text-indigo-400">
                    <span className="text-sm">Start Assessment</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </button>))}
            </div>
          </div>
        </div>)}

      {stryMutAct_9fa48("24323") ? activeTab === 'paths' || <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Available Learning Paths</h2>
            <button className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Generate from Decision
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[{
          title: 'AI Council Operations',
          description: 'Understand how the AI Council makes decisions and your role in the process',
          modules: 8,
          duration: '4h 30m',
          difficulty: 'intermediate',
          enrolled: 234,
          rating: 4.8
        }, {
          title: 'Data-Driven Leadership',
          description: 'Lead with confidence using real-time analytics and AI insights',
          modules: 12,
          duration: '6h',
          difficulty: 'advanced',
          enrolled: 156,
          rating: 4.9
        }, {
          title: 'Change Management for AI Era',
          description: 'Navigate organizational transformation in an AI-first world',
          modules: 6,
          duration: '3h',
          difficulty: 'beginner',
          enrolled: 412,
          rating: 4.7
        }, {
          title: 'Ethics in Automated Decision Making',
          description: 'Ensure ethical AI practices and governance compliance',
          modules: 10,
          duration: '5h',
          difficulty: 'advanced',
          enrolled: 89,
          rating: 4.6
        }, {
          title: 'Strategic Communication',
          description: 'Communicate AI-driven decisions effectively across all levels',
          modules: 5,
          duration: '2h 30m',
          difficulty: 'intermediate',
          enrolled: 298,
          rating: 4.8
        }, {
          title: 'Risk Assessment Fundamentals',
          description: 'Identify and mitigate risks in automated processes',
          modules: 7,
          duration: '3h 45m',
          difficulty: 'intermediate',
          enrolled: 187,
          rating: 4.5
        }].map((path, idx) => <div key={idx} className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden hover:border-indigo-500/50 transition">
                <div className="h-2 bg-gradient-to-r from-indigo-500 to-purple-500" />
                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold">{path.title}</h3>
                    <span className={`px-2 py-1 text-xs rounded capitalize ${path.difficulty === 'beginner' ? 'bg-green-500/20 text-green-400' : path.difficulty === 'intermediate' ? 'bg-amber-500/20 text-amber-400' : 'bg-purple-500/20 text-purple-400'}`}>
                      {path.difficulty}
                    </span>
                  </div>
                  
                  <p className="text-sm text-neutral-400 mb-4">{path.description}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-neutral-500 mb-4">
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      {path.modules} modules
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {path.duration}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      <span className="text-sm text-amber-400">{path.rating}</span>
                    </div>
                    <span className="text-sm text-neutral-500">{path.enrolled} enrolled</span>
                  </div>
                  
                  <button className="w-full py-2 bg-indigo-500/20 text-indigo-400 rounded-lg hover:bg-indigo-500/30 transition flex items-center justify-center gap-2">
                    <Play className="w-4 h-4" />
                    Enroll Now
                  </button>
                </div>
              </div>)}
          </div>
        </div> : stryMutAct_9fa48("24322") ? false : stryMutAct_9fa48("24321") ? true : (stryCov_9fa48("24321", "24322", "24323"), (stryMutAct_9fa48("24325") ? activeTab !== 'paths' : stryMutAct_9fa48("24324") ? true : (stryCov_9fa48("24324", "24325"), activeTab === 'paths')) && <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Available Learning Paths</h2>
            <button className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Generate from Decision
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(stryMutAct_9fa48("24327") ? [] : (stryCov_9fa48("24327"), [stryMutAct_9fa48("24328") ? {} : (stryCov_9fa48("24328"), {
          title: 'AI Council Operations',
          description: 'Understand how the AI Council makes decisions and your role in the process',
          modules: 8,
          duration: '4h 30m',
          difficulty: 'intermediate',
          enrolled: 234,
          rating: 4.8
        }), stryMutAct_9fa48("24333") ? {} : (stryCov_9fa48("24333"), {
          title: 'Data-Driven Leadership',
          description: 'Lead with confidence using real-time analytics and AI insights',
          modules: 12,
          duration: '6h',
          difficulty: 'advanced',
          enrolled: 156,
          rating: 4.9
        }), stryMutAct_9fa48("24338") ? {} : (stryCov_9fa48("24338"), {
          title: 'Change Management for AI Era',
          description: 'Navigate organizational transformation in an AI-first world',
          modules: 6,
          duration: '3h',
          difficulty: 'beginner',
          enrolled: 412,
          rating: 4.7
        }), stryMutAct_9fa48("24343") ? {} : (stryCov_9fa48("24343"), {
          title: 'Ethics in Automated Decision Making',
          description: 'Ensure ethical AI practices and governance compliance',
          modules: 10,
          duration: '5h',
          difficulty: 'advanced',
          enrolled: 89,
          rating: 4.6
        }), stryMutAct_9fa48("24348") ? {} : (stryCov_9fa48("24348"), {
          title: 'Strategic Communication',
          description: 'Communicate AI-driven decisions effectively across all levels',
          modules: 5,
          duration: '2h 30m',
          difficulty: 'intermediate',
          enrolled: 298,
          rating: 4.8
        }), stryMutAct_9fa48("24353") ? {} : (stryCov_9fa48("24353"), {
          title: 'Risk Assessment Fundamentals',
          description: 'Identify and mitigate risks in automated processes',
          modules: 7,
          duration: '3h 45m',
          difficulty: 'intermediate',
          enrolled: 187,
          rating: 4.5
        })])).map(stryMutAct_9fa48("24358") ? () => undefined : (stryCov_9fa48("24358"), (path, idx) => <div key={idx} className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden hover:border-indigo-500/50 transition">
                <div className="h-2 bg-gradient-to-r from-indigo-500 to-purple-500" />
                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold">{path.title}</h3>
                    <span className={`px-2 py-1 text-xs rounded capitalize ${(stryMutAct_9fa48("24362") ? path.difficulty !== 'beginner' : stryMutAct_9fa48("24361") ? false : stryMutAct_9fa48("24360") ? true : (stryCov_9fa48("24360", "24361", "24362"), path.difficulty === 'beginner')) ? 'bg-green-500/20 text-green-400' : (stryMutAct_9fa48("24367") ? path.difficulty !== 'intermediate' : stryMutAct_9fa48("24366") ? false : stryMutAct_9fa48("24365") ? true : (stryCov_9fa48("24365", "24366", "24367"), path.difficulty === 'intermediate')) ? 'bg-amber-500/20 text-amber-400' : 'bg-purple-500/20 text-purple-400'}`}>
                      {path.difficulty}
                    </span>
                  </div>
                  
                  <p className="text-sm text-neutral-400 mb-4">{path.description}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-neutral-500 mb-4">
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      {path.modules} modules
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {path.duration}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      <span className="text-sm text-amber-400">{path.rating}</span>
                    </div>
                    <span className="text-sm text-neutral-500">{path.enrolled} enrolled</span>
                  </div>
                  
                  <button className="w-full py-2 bg-indigo-500/20 text-indigo-400 rounded-lg hover:bg-indigo-500/30 transition flex items-center justify-center gap-2">
                    <Play className="w-4 h-4" />
                    Enroll Now
                  </button>
                </div>
              </div>))}
          </div>
        </div>)}

      {stryMutAct_9fa48("24373") ? activeTab === 'analytics' || <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-500" />
              Organization Learning Metrics
            </h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-neutral-800/50 rounded-lg">
                <p className="text-sm text-neutral-500">Total Learners</p>
                <p className="text-2xl font-bold mt-1">{dashboard?.organizationMetrics.totalLearners || 0}</p>
              </div>
              <div className="p-4 bg-neutral-800/50 rounded-lg">
                <p className="text-sm text-neutral-500">Active Learners</p>
                <p className="text-2xl font-bold text-green-400 mt-1">{dashboard?.organizationMetrics.activeLearners || 0}</p>
              </div>
              <div className="p-4 bg-neutral-800/50 rounded-lg">
                <p className="text-sm text-neutral-500">Avg. Completion</p>
                <p className="text-2xl font-bold text-indigo-400 mt-1">
                  {(dashboard?.organizationMetrics.avgCompletionRate || 0).toFixed(1)}%
                </p>
              </div>
              <div className="p-4 bg-neutral-800/50 rounded-lg">
                <p className="text-sm text-neutral-500">Decision Readiness</p>
                <p className={`text-2xl font-bold mt-1 ${getReadinessColor(dashboard?.organizationMetrics.decisionReadiness || 0)}`}>
                  {(dashboard?.organizationMetrics.decisionReadiness || 0).toFixed(1)}%
                </p>
              </div>
            </div>
          </div>

          <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              Learning Trends
            </h2>
            
            <div className="h-64 flex items-center justify-center text-neutral-500">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Learning trend chart would be rendered here</p>
                <p className="text-sm">Showing skill growth over time</p>
              </div>
            </div>
          </div>
        </div> : stryMutAct_9fa48("24372") ? false : stryMutAct_9fa48("24371") ? true : (stryCov_9fa48("24371", "24372", "24373"), (stryMutAct_9fa48("24375") ? activeTab !== 'analytics' : stryMutAct_9fa48("24374") ? true : (stryCov_9fa48("24374", "24375"), activeTab === 'analytics')) && <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-500" />
              Organization Learning Metrics
            </h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-neutral-800/50 rounded-lg">
                <p className="text-sm text-neutral-500">Total Learners</p>
                <p className="text-2xl font-bold mt-1">{stryMutAct_9fa48("24379") ? dashboard?.organizationMetrics.totalLearners && 0 : stryMutAct_9fa48("24378") ? false : stryMutAct_9fa48("24377") ? true : (stryCov_9fa48("24377", "24378", "24379"), (stryMutAct_9fa48("24380") ? dashboard.organizationMetrics.totalLearners : (stryCov_9fa48("24380"), dashboard?.organizationMetrics.totalLearners)) || 0)}</p>
              </div>
              <div className="p-4 bg-neutral-800/50 rounded-lg">
                <p className="text-sm text-neutral-500">Active Learners</p>
                <p className="text-2xl font-bold text-green-400 mt-1">{stryMutAct_9fa48("24383") ? dashboard?.organizationMetrics.activeLearners && 0 : stryMutAct_9fa48("24382") ? false : stryMutAct_9fa48("24381") ? true : (stryCov_9fa48("24381", "24382", "24383"), (stryMutAct_9fa48("24384") ? dashboard.organizationMetrics.activeLearners : (stryCov_9fa48("24384"), dashboard?.organizationMetrics.activeLearners)) || 0)}</p>
              </div>
              <div className="p-4 bg-neutral-800/50 rounded-lg">
                <p className="text-sm text-neutral-500">Avg. Completion</p>
                <p className="text-2xl font-bold text-indigo-400 mt-1">
                  {(stryMutAct_9fa48("24387") ? dashboard?.organizationMetrics.avgCompletionRate && 0 : stryMutAct_9fa48("24386") ? false : stryMutAct_9fa48("24385") ? true : (stryCov_9fa48("24385", "24386", "24387"), (stryMutAct_9fa48("24388") ? dashboard.organizationMetrics.avgCompletionRate : (stryCov_9fa48("24388"), dashboard?.organizationMetrics.avgCompletionRate)) || 0)).toFixed(1)}%
                </p>
              </div>
              <div className="p-4 bg-neutral-800/50 rounded-lg">
                <p className="text-sm text-neutral-500">Decision Readiness</p>
                <p className={`text-2xl font-bold mt-1 ${getReadinessColor(stryMutAct_9fa48("24392") ? dashboard?.organizationMetrics.decisionReadiness && 0 : stryMutAct_9fa48("24391") ? false : stryMutAct_9fa48("24390") ? true : (stryCov_9fa48("24390", "24391", "24392"), (stryMutAct_9fa48("24393") ? dashboard.organizationMetrics.decisionReadiness : (stryCov_9fa48("24393"), dashboard?.organizationMetrics.decisionReadiness)) || 0))}`}>
                  {(stryMutAct_9fa48("24396") ? dashboard?.organizationMetrics.decisionReadiness && 0 : stryMutAct_9fa48("24395") ? false : stryMutAct_9fa48("24394") ? true : (stryCov_9fa48("24394", "24395", "24396"), (stryMutAct_9fa48("24397") ? dashboard.organizationMetrics.decisionReadiness : (stryCov_9fa48("24397"), dashboard?.organizationMetrics.decisionReadiness)) || 0)).toFixed(1)}%
                </p>
              </div>
            </div>
          </div>

          <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              Learning Trends
            </h2>
            
            <div className="h-64 flex items-center justify-center text-neutral-500">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Learning trend chart would be rendered here</p>
                <p className="text-sm">Showing skill growth over time</p>
              </div>
            </div>
          </div>
        </div>)}

      {/* Learning Path Modal */}
      {stryMutAct_9fa48("24400") ? selectedPath || <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-neutral-900 rounded-2xl border border-neutral-700 w-full max-w-4xl max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-neutral-800 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className={`px-3 py-1 text-xs rounded-full capitalize ${selectedPath.difficulty === 'beginner' ? 'bg-green-500/20 text-green-400' : selectedPath.difficulty === 'intermediate' ? 'bg-amber-500/20 text-amber-400' : 'bg-purple-500/20 text-purple-400'}`}>
                    {selectedPath.difficulty}
                  </span>
                  <span className="text-neutral-500 text-sm flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {selectedPath.duration}
                  </span>
                </div>
                <h2 className="text-2xl font-bold">{selectedPath.title}</h2>
                <p className="text-neutral-400 mt-1">{selectedPath.description}</p>
              </div>
              <button onClick={() => {
            setSelectedPath(null);
            setCurrentModule(null);
          }} className="p-2 hover:bg-neutral-800 rounded-lg transition">
                <ChevronRight className="w-6 h-6 rotate-45" />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="px-6 py-4 border-b border-neutral-800">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-neutral-400">Course Progress</span>
                <span className="text-indigo-400 font-medium">{selectedPath.progress}% Complete</span>
              </div>
              <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all" style={{
              width: `${selectedPath.progress}%`
            }} />
              </div>
            </div>

            {/* Modules List */}
            <div className="p-6 overflow-y-auto max-h-[50vh]">
              <h3 className="text-lg font-semibold mb-4">Course Modules</h3>
              <div className="space-y-3">
                {selectedPath.modules.map((module, idx) => <div key={module.id} className={`p-4 rounded-xl border transition cursor-pointer ${currentModule === module.id ? 'bg-indigo-500/20 border-indigo-500/50' : module.completed ? 'bg-green-500/10 border-green-500/30' : 'bg-neutral-800/50 border-neutral-700 hover:border-neutral-600'}`} onClick={() => setCurrentModule(module.id)}>
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${module.completed ? 'bg-green-500/20 text-green-400' : currentModule === module.id ? 'bg-indigo-500/20 text-indigo-400' : 'bg-neutral-700 text-neutral-400'}`}>
                        {module.completed ? <CheckCircle className="w-5 h-5" /> : <span>{idx + 1}</span>}
                      </div>
                      
                      <div className="flex-1">
                        <p className={`font-medium ${module.completed ? 'text-green-400' : ''}`}>
                          {module.title}
                        </p>
                        <div className="flex items-center gap-3 mt-1 text-sm text-neutral-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {module.duration}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-xs capitalize ${module.type === 'video' ? 'bg-blue-500/20 text-blue-400' : module.type === 'quiz' ? 'bg-purple-500/20 text-purple-400' : module.type === 'reading' ? 'bg-amber-500/20 text-amber-400' : 'bg-green-500/20 text-green-400'}`}>
                            {module.type}
                          </span>
                        </div>
                      </div>

                      {!module.completed && <button onClick={e => {
                  e.stopPropagation();
                  // For videos, just mark complete (user makes video content)
                  if (module.type === 'video') {
                    setLearningPaths(paths => paths.map(p => p.id === selectedPath.id ? {
                      ...p,
                      modules: p.modules.map(m => m.id === module.id ? {
                        ...m,
                        completed: true
                      } : m),
                      progress: Math.round(p.modules.filter(m => m.completed || m.id === module.id).length / p.modules.length * 100)
                    } : p));
                    setSelectedPath(prev => prev ? {
                      ...prev,
                      modules: prev.modules.map(m => m.id === module.id ? {
                        ...m,
                        completed: true
                      } : m),
                      progress: Math.round(prev.modules.filter(m => m.completed || m.id === module.id).length / prev.modules.length * 100)
                    } : null);
                  } else {
                    // Open content viewer for reading, quiz, exercise
                    setActiveContent({
                      moduleId: module.id,
                      pathId: selectedPath.id
                    });
                    setQuizAnswers({});
                    setQuizSubmitted(false);
                    setExerciseSteps({});
                    setReadingProgress(0);
                  }
                }} className="px-4 py-2 bg-indigo-500 text-white rounded-lg text-sm hover:bg-indigo-600 transition flex items-center gap-2">
                          <Play className="w-4 h-4" />
                          {module.type === 'video' ? 'Watch' : module.type === 'quiz' ? 'Take Quiz' : module.type === 'reading' ? 'Read' : 'Start'}
                        </button>}

                      {module.completed && <span className="text-green-400 text-sm flex items-center gap-1">
                          <CheckCircle className="w-4 h-4" />
                          Done
                        </span>}
                    </div>
                  </div>)}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-neutral-800 flex items-center justify-between">
              <div className="text-sm text-neutral-500">
                {selectedPath.modules.filter(m => m.completed).length} of {selectedPath.modules.length} modules completed
              </div>
              <div className="flex gap-3">
                <button onClick={() => {
              setSelectedPath(null);
              setCurrentModule(null);
            }} className="px-4 py-2 bg-neutral-800 text-neutral-300 rounded-lg hover:bg-neutral-700 transition">
                  Close
                </button>
                {selectedPath.progress < 100 && <button onClick={() => {
              const nextModule = selectedPath.modules.find(m => !m.completed);
              if (nextModule) {
                setCurrentModule(nextModule.id);
              }
            }} className="px-6 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition flex items-center gap-2">
                    <Play className="w-4 h-4" />
                    Continue Learning
                  </button>}
                {selectedPath.progress === 100 && <button className="px-6 py-2 bg-green-500 text-white rounded-lg flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    Get Certificate
                  </button>}
              </div>
            </div>
          </div>
        </div> : stryMutAct_9fa48("24399") ? false : stryMutAct_9fa48("24398") ? true : (stryCov_9fa48("24398", "24399", "24400"), selectedPath && <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-neutral-900 rounded-2xl border border-neutral-700 w-full max-w-4xl max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-neutral-800 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className={`px-3 py-1 text-xs rounded-full capitalize ${(stryMutAct_9fa48("24404") ? selectedPath.difficulty !== 'beginner' : stryMutAct_9fa48("24403") ? false : stryMutAct_9fa48("24402") ? true : (stryCov_9fa48("24402", "24403", "24404"), selectedPath.difficulty === 'beginner')) ? 'bg-green-500/20 text-green-400' : (stryMutAct_9fa48("24409") ? selectedPath.difficulty !== 'intermediate' : stryMutAct_9fa48("24408") ? false : stryMutAct_9fa48("24407") ? true : (stryCov_9fa48("24407", "24408", "24409"), selectedPath.difficulty === 'intermediate')) ? 'bg-amber-500/20 text-amber-400' : 'bg-purple-500/20 text-purple-400'}`}>
                    {selectedPath.difficulty}
                  </span>
                  <span className="text-neutral-500 text-sm flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {selectedPath.duration}
                  </span>
                </div>
                <h2 className="text-2xl font-bold">{selectedPath.title}</h2>
                <p className="text-neutral-400 mt-1">{selectedPath.description}</p>
              </div>
              <button onClick={() => {
            setSelectedPath(null);
            setCurrentModule(null);
          }} className="p-2 hover:bg-neutral-800 rounded-lg transition">
                <ChevronRight className="w-6 h-6 rotate-45" />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="px-6 py-4 border-b border-neutral-800">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-neutral-400">Course Progress</span>
                <span className="text-indigo-400 font-medium">{selectedPath.progress}% Complete</span>
              </div>
              <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all" style={stryMutAct_9fa48("24414") ? {} : (stryCov_9fa48("24414"), {
              width: `${selectedPath.progress}%`
            })} />
              </div>
            </div>

            {/* Modules List */}
            <div className="p-6 overflow-y-auto max-h-[50vh]">
              <h3 className="text-lg font-semibold mb-4">Course Modules</h3>
              <div className="space-y-3">
                {selectedPath.modules.map(stryMutAct_9fa48("24416") ? () => undefined : (stryCov_9fa48("24416"), (module, idx) => <div key={module.id} className={`p-4 rounded-xl border transition cursor-pointer ${(stryMutAct_9fa48("24420") ? currentModule !== module.id : stryMutAct_9fa48("24419") ? false : stryMutAct_9fa48("24418") ? true : (stryCov_9fa48("24418", "24419", "24420"), currentModule === module.id)) ? 'bg-indigo-500/20 border-indigo-500/50' : module.completed ? 'bg-green-500/10 border-green-500/30' : 'bg-neutral-800/50 border-neutral-700 hover:border-neutral-600'}`} onClick={stryMutAct_9fa48("24424") ? () => undefined : (stryCov_9fa48("24424"), () => setCurrentModule(module.id))}>
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${module.completed ? 'bg-green-500/20 text-green-400' : (stryMutAct_9fa48("24429") ? currentModule !== module.id : stryMutAct_9fa48("24428") ? false : stryMutAct_9fa48("24427") ? true : (stryCov_9fa48("24427", "24428", "24429"), currentModule === module.id)) ? 'bg-indigo-500/20 text-indigo-400' : 'bg-neutral-700 text-neutral-400'}`}>
                        {module.completed ? <CheckCircle className="w-5 h-5" /> : <span>{stryMutAct_9fa48("24432") ? idx - 1 : (stryCov_9fa48("24432"), idx + 1)}</span>}
                      </div>
                      
                      <div className="flex-1">
                        <p className={`font-medium ${module.completed ? 'text-green-400' : ''}`}>
                          {module.title}
                        </p>
                        <div className="flex items-center gap-3 mt-1 text-sm text-neutral-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {module.duration}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-xs capitalize ${(stryMutAct_9fa48("24439") ? module.type !== 'video' : stryMutAct_9fa48("24438") ? false : stryMutAct_9fa48("24437") ? true : (stryCov_9fa48("24437", "24438", "24439"), module.type === 'video')) ? 'bg-blue-500/20 text-blue-400' : (stryMutAct_9fa48("24444") ? module.type !== 'quiz' : stryMutAct_9fa48("24443") ? false : stryMutAct_9fa48("24442") ? true : (stryCov_9fa48("24442", "24443", "24444"), module.type === 'quiz')) ? 'bg-purple-500/20 text-purple-400' : (stryMutAct_9fa48("24449") ? module.type !== 'reading' : stryMutAct_9fa48("24448") ? false : stryMutAct_9fa48("24447") ? true : (stryCov_9fa48("24447", "24448", "24449"), module.type === 'reading')) ? 'bg-amber-500/20 text-amber-400' : 'bg-green-500/20 text-green-400'}`}>
                            {module.type}
                          </span>
                        </div>
                      </div>

                      {stryMutAct_9fa48("24455") ? !module.completed || <button onClick={e => {
                  e.stopPropagation();
                  // For videos, just mark complete (user makes video content)
                  if (module.type === 'video') {
                    setLearningPaths(paths => paths.map(p => p.id === selectedPath.id ? {
                      ...p,
                      modules: p.modules.map(m => m.id === module.id ? {
                        ...m,
                        completed: true
                      } : m),
                      progress: Math.round(p.modules.filter(m => m.completed || m.id === module.id).length / p.modules.length * 100)
                    } : p));
                    setSelectedPath(prev => prev ? {
                      ...prev,
                      modules: prev.modules.map(m => m.id === module.id ? {
                        ...m,
                        completed: true
                      } : m),
                      progress: Math.round(prev.modules.filter(m => m.completed || m.id === module.id).length / prev.modules.length * 100)
                    } : null);
                  } else {
                    // Open content viewer for reading, quiz, exercise
                    setActiveContent({
                      moduleId: module.id,
                      pathId: selectedPath.id
                    });
                    setQuizAnswers({});
                    setQuizSubmitted(false);
                    setExerciseSteps({});
                    setReadingProgress(0);
                  }
                }} className="px-4 py-2 bg-indigo-500 text-white rounded-lg text-sm hover:bg-indigo-600 transition flex items-center gap-2">
                          <Play className="w-4 h-4" />
                          {module.type === 'video' ? 'Watch' : module.type === 'quiz' ? 'Take Quiz' : module.type === 'reading' ? 'Read' : 'Start'}
                        </button> : stryMutAct_9fa48("24454") ? false : stryMutAct_9fa48("24453") ? true : (stryCov_9fa48("24453", "24454", "24455"), (stryMutAct_9fa48("24456") ? module.completed : (stryCov_9fa48("24456"), !module.completed)) && <button onClick={e => {
                  e.stopPropagation();
                  // For videos, just mark complete (user makes video content)
                  if (stryMutAct_9fa48("24460") ? module.type !== 'video' : stryMutAct_9fa48("24459") ? false : stryMutAct_9fa48("24458") ? true : (stryCov_9fa48("24458", "24459", "24460"), module.type === 'video')) {
                    setLearningPaths(stryMutAct_9fa48("24463") ? () => undefined : (stryCov_9fa48("24463"), paths => paths.map(stryMutAct_9fa48("24464") ? () => undefined : (stryCov_9fa48("24464"), p => (stryMutAct_9fa48("24467") ? p.id !== selectedPath.id : stryMutAct_9fa48("24466") ? false : stryMutAct_9fa48("24465") ? true : (stryCov_9fa48("24465", "24466", "24467"), p.id === selectedPath.id)) ? stryMutAct_9fa48("24468") ? {} : (stryCov_9fa48("24468"), {
                      ...p,
                      modules: p.modules.map(stryMutAct_9fa48("24469") ? () => undefined : (stryCov_9fa48("24469"), m => (stryMutAct_9fa48("24472") ? m.id !== module.id : stryMutAct_9fa48("24471") ? false : stryMutAct_9fa48("24470") ? true : (stryCov_9fa48("24470", "24471", "24472"), m.id === module.id)) ? stryMutAct_9fa48("24473") ? {} : (stryCov_9fa48("24473"), {
                        ...m,
                        completed: stryMutAct_9fa48("24474") ? false : (stryCov_9fa48("24474"), true)
                      }) : m)),
                      progress: Math.round(stryMutAct_9fa48("24475") ? p.modules.filter(m => m.completed || m.id === module.id).length / p.modules.length / 100 : (stryCov_9fa48("24475"), (stryMutAct_9fa48("24476") ? p.modules.filter(m => m.completed || m.id === module.id).length * p.modules.length : (stryCov_9fa48("24476"), (stryMutAct_9fa48("24477") ? p.modules.length : (stryCov_9fa48("24477"), p.modules.filter(stryMutAct_9fa48("24478") ? () => undefined : (stryCov_9fa48("24478"), m => stryMutAct_9fa48("24481") ? m.completed && m.id === module.id : stryMutAct_9fa48("24480") ? false : stryMutAct_9fa48("24479") ? true : (stryCov_9fa48("24479", "24480", "24481"), m.completed || (stryMutAct_9fa48("24483") ? m.id !== module.id : stryMutAct_9fa48("24482") ? false : (stryCov_9fa48("24482", "24483"), m.id === module.id))))).length)) / p.modules.length)) * 100))
                    }) : p))));
                    setSelectedPath(stryMutAct_9fa48("24484") ? () => undefined : (stryCov_9fa48("24484"), prev => prev ? stryMutAct_9fa48("24485") ? {} : (stryCov_9fa48("24485"), {
                      ...prev,
                      modules: prev.modules.map(stryMutAct_9fa48("24486") ? () => undefined : (stryCov_9fa48("24486"), m => (stryMutAct_9fa48("24489") ? m.id !== module.id : stryMutAct_9fa48("24488") ? false : stryMutAct_9fa48("24487") ? true : (stryCov_9fa48("24487", "24488", "24489"), m.id === module.id)) ? stryMutAct_9fa48("24490") ? {} : (stryCov_9fa48("24490"), {
                        ...m,
                        completed: stryMutAct_9fa48("24491") ? false : (stryCov_9fa48("24491"), true)
                      }) : m)),
                      progress: Math.round(stryMutAct_9fa48("24492") ? prev.modules.filter(m => m.completed || m.id === module.id).length / prev.modules.length / 100 : (stryCov_9fa48("24492"), (stryMutAct_9fa48("24493") ? prev.modules.filter(m => m.completed || m.id === module.id).length * prev.modules.length : (stryCov_9fa48("24493"), (stryMutAct_9fa48("24494") ? prev.modules.length : (stryCov_9fa48("24494"), prev.modules.filter(stryMutAct_9fa48("24495") ? () => undefined : (stryCov_9fa48("24495"), m => stryMutAct_9fa48("24498") ? m.completed && m.id === module.id : stryMutAct_9fa48("24497") ? false : stryMutAct_9fa48("24496") ? true : (stryCov_9fa48("24496", "24497", "24498"), m.completed || (stryMutAct_9fa48("24500") ? m.id !== module.id : stryMutAct_9fa48("24499") ? false : (stryCov_9fa48("24499", "24500"), m.id === module.id))))).length)) / prev.modules.length)) * 100))
                    }) : null));
                  } else {
                    // Open content viewer for reading, quiz, exercise
                    setActiveContent(stryMutAct_9fa48("24502") ? {} : (stryCov_9fa48("24502"), {
                      moduleId: module.id,
                      pathId: selectedPath.id
                    }));
                    setQuizAnswers({});
                    setQuizSubmitted(stryMutAct_9fa48("24503") ? true : (stryCov_9fa48("24503"), false));
                    setExerciseSteps({});
                    setReadingProgress(0);
                  }
                }} className="px-4 py-2 bg-indigo-500 text-white rounded-lg text-sm hover:bg-indigo-600 transition flex items-center gap-2">
                          <Play className="w-4 h-4" />
                          {(stryMutAct_9fa48("24506") ? module.type !== 'video' : stryMutAct_9fa48("24505") ? false : stryMutAct_9fa48("24504") ? true : (stryCov_9fa48("24504", "24505", "24506"), module.type === 'video')) ? 'Watch' : (stryMutAct_9fa48("24511") ? module.type !== 'quiz' : stryMutAct_9fa48("24510") ? false : stryMutAct_9fa48("24509") ? true : (stryCov_9fa48("24509", "24510", "24511"), module.type === 'quiz')) ? 'Take Quiz' : (stryMutAct_9fa48("24516") ? module.type !== 'reading' : stryMutAct_9fa48("24515") ? false : stryMutAct_9fa48("24514") ? true : (stryCov_9fa48("24514", "24515", "24516"), module.type === 'reading')) ? 'Read' : 'Start'}
                        </button>)}

                      {stryMutAct_9fa48("24522") ? module.completed || <span className="text-green-400 text-sm flex items-center gap-1">
                          <CheckCircle className="w-4 h-4" />
                          Done
                        </span> : stryMutAct_9fa48("24521") ? false : stryMutAct_9fa48("24520") ? true : (stryCov_9fa48("24520", "24521", "24522"), module.completed && <span className="text-green-400 text-sm flex items-center gap-1">
                          <CheckCircle className="w-4 h-4" />
                          Done
                        </span>)}
                    </div>
                  </div>))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-neutral-800 flex items-center justify-between">
              <div className="text-sm text-neutral-500">
                {stryMutAct_9fa48("24523") ? selectedPath.modules.length : (stryCov_9fa48("24523"), selectedPath.modules.filter(stryMutAct_9fa48("24524") ? () => undefined : (stryCov_9fa48("24524"), m => m.completed)).length)} of {selectedPath.modules.length} modules completed
              </div>
              <div className="flex gap-3">
                <button onClick={() => {
              setSelectedPath(null);
              setCurrentModule(null);
            }} className="px-4 py-2 bg-neutral-800 text-neutral-300 rounded-lg hover:bg-neutral-700 transition">
                  Close
                </button>
                {stryMutAct_9fa48("24528") ? selectedPath.progress < 100 || <button onClick={() => {
              const nextModule = selectedPath.modules.find(m => !m.completed);
              if (nextModule) {
                setCurrentModule(nextModule.id);
              }
            }} className="px-6 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition flex items-center gap-2">
                    <Play className="w-4 h-4" />
                    Continue Learning
                  </button> : stryMutAct_9fa48("24527") ? false : stryMutAct_9fa48("24526") ? true : (stryCov_9fa48("24526", "24527", "24528"), (stryMutAct_9fa48("24531") ? selectedPath.progress >= 100 : stryMutAct_9fa48("24530") ? selectedPath.progress <= 100 : stryMutAct_9fa48("24529") ? true : (stryCov_9fa48("24529", "24530", "24531"), selectedPath.progress < 100)) && <button onClick={() => {
              const nextModule = selectedPath.modules.find(stryMutAct_9fa48("24533") ? () => undefined : (stryCov_9fa48("24533"), m => stryMutAct_9fa48("24534") ? m.completed : (stryCov_9fa48("24534"), !m.completed)));
              if (stryMutAct_9fa48("24536") ? false : stryMutAct_9fa48("24535") ? true : (stryCov_9fa48("24535", "24536"), nextModule)) {
                setCurrentModule(nextModule.id);
              }
            }} className="px-6 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition flex items-center gap-2">
                    <Play className="w-4 h-4" />
                    Continue Learning
                  </button>)}
                {stryMutAct_9fa48("24540") ? selectedPath.progress === 100 || <button className="px-6 py-2 bg-green-500 text-white rounded-lg flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    Get Certificate
                  </button> : stryMutAct_9fa48("24539") ? false : stryMutAct_9fa48("24538") ? true : (stryCov_9fa48("24538", "24539", "24540"), (stryMutAct_9fa48("24542") ? selectedPath.progress !== 100 : stryMutAct_9fa48("24541") ? true : (stryCov_9fa48("24541", "24542"), selectedPath.progress === 100)) && <button className="px-6 py-2 bg-green-500 text-white rounded-lg flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    Get Certificate
                  </button>)}
              </div>
            </div>
          </div>
        </div>)}

      {/* Content Viewer Modal */}
      {stryMutAct_9fa48("24545") ? activeContent && MODULE_CONTENT[activeContent.moduleId] || <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-neutral-900 rounded-2xl border border-neutral-700 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Content Header */}
            <div className="p-6 border-b border-neutral-800 flex items-center justify-between">
              <div>
                <span className={`px-3 py-1 text-xs rounded-full mb-2 inline-block ${MODULE_CONTENT[activeContent.moduleId].type === 'reading' ? 'bg-amber-500/20 text-amber-400' : MODULE_CONTENT[activeContent.moduleId].type === 'quiz' ? 'bg-purple-500/20 text-purple-400' : 'bg-green-500/20 text-green-400'}`}>
                  {MODULE_CONTENT[activeContent.moduleId].type}
                </span>
                <h2 className="text-xl font-bold">{MODULE_CONTENT[activeContent.moduleId].title}</h2>
              </div>
              <button onClick={() => setActiveContent(null)} className="p-2 hover:bg-neutral-800 rounded-lg transition">
                <ChevronRight className="w-6 h-6 rotate-45" />
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Reading Content */}
              {MODULE_CONTENT[activeContent.moduleId].type === 'reading' && MODULE_CONTENT[activeContent.moduleId].sections && <div className="space-y-8">
                  {MODULE_CONTENT[activeContent.moduleId].sections!.map((section, idx) => <div key={idx} className={`transition-all ${idx <= readingProgress ? 'opacity-100' : 'opacity-50'}`}>
                      <h3 className="text-lg font-semibold text-indigo-400 mb-3 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center text-sm">
                          {idx + 1}
                        </span>
                        {section.heading}
                      </h3>
                      <p className="text-neutral-300 leading-relaxed">{section.text}</p>
                      {idx === readingProgress && idx < MODULE_CONTENT[activeContent.moduleId].sections!.length - 1 && <button onClick={() => setReadingProgress(prev => prev + 1)} className="mt-4 px-4 py-2 bg-indigo-500/20 text-indigo-400 rounded-lg text-sm hover:bg-indigo-500/30 transition">
                          Continue Reading →
                        </button>}
                    </div>)}
                </div>}

              {/* Quiz Content */}
              {MODULE_CONTENT[activeContent.moduleId].type === 'quiz' && MODULE_CONTENT[activeContent.moduleId].questions && <div className="space-y-8">
                  {MODULE_CONTENT[activeContent.moduleId].questions!.map((q, idx) => <div key={q.id} className="bg-neutral-800/50 rounded-xl p-6 border border-neutral-700">
                      <p className="font-medium mb-4 flex items-start gap-3">
                        <span className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center flex-shrink-0">
                          {idx + 1}
                        </span>
                        <span>{q.question}</span>
                      </p>
                      <div className="space-y-2 ml-11">
                        {q.options.map((option, optIdx) => <button key={optIdx} onClick={() => !quizSubmitted && setQuizAnswers(prev => ({
                  ...prev,
                  [q.id]: optIdx
                }))} disabled={quizSubmitted} className={`w-full text-left p-3 rounded-lg border transition ${quizSubmitted && optIdx === q.correct ? 'bg-green-500/20 border-green-500 text-green-400' : quizSubmitted && quizAnswers[q.id] === optIdx && optIdx !== q.correct ? 'bg-red-500/20 border-red-500 text-red-400' : quizAnswers[q.id] === optIdx ? 'bg-purple-500/20 border-purple-500 text-purple-400' : 'bg-neutral-800 border-neutral-700 hover:border-neutral-600'}`}>
                            <span className="flex items-center gap-3">
                              <span className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs ${quizAnswers[q.id] === optIdx ? 'border-current bg-current/20' : 'border-neutral-600'}`}>
                                {String.fromCharCode(65 + optIdx)}
                              </span>
                              {option}
                              {quizSubmitted && optIdx === q.correct && <CheckCircle className="w-5 h-5 text-green-400 ml-auto" />}
                            </span>
                          </button>)}
                      </div>
                    </div>)}
                  
                  {!quizSubmitted && <div className="text-center pt-4">
                      <p className="text-neutral-500 text-sm mb-4">
                        {Object.keys(quizAnswers).length} of {MODULE_CONTENT[activeContent.moduleId].questions!.length} questions answered
                      </p>
                    </div>}
                  
                  {quizSubmitted && <div className="bg-neutral-800/50 rounded-xl p-6 border border-neutral-700 text-center">
                      <Award className="w-12 h-12 mx-auto mb-3 text-amber-400" />
                      <p className="text-xl font-bold mb-2">
                        {MODULE_CONTENT[activeContent.moduleId].questions!.filter(q => quizAnswers[q.id] === q.correct).length} / {MODULE_CONTENT[activeContent.moduleId].questions!.length} Correct
                      </p>
                      <p className="text-neutral-400">
                        {MODULE_CONTENT[activeContent.moduleId].questions!.filter(q => quizAnswers[q.id] === q.correct).length === MODULE_CONTENT[activeContent.moduleId].questions!.length ? 'Perfect score! Excellent work!' : 'Review the correct answers above.'}
                      </p>
                    </div>}
                </div>}

              {/* Exercise Content */}
              {MODULE_CONTENT[activeContent.moduleId].type === 'exercise' && MODULE_CONTENT[activeContent.moduleId].steps && <div className="space-y-4">
                  <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-xl p-4 mb-6">
                    <p className="text-indigo-400 text-sm">
                      <strong>Instructions:</strong> Complete each step below. Check off each step as you finish to track your progress.
                    </p>
                  </div>
                  
                  {MODULE_CONTENT[activeContent.moduleId].steps!.map(step => <div key={step.step} className={`p-4 rounded-xl border transition ${exerciseSteps[step.step] ? 'bg-green-500/10 border-green-500/30' : 'bg-neutral-800/50 border-neutral-700'}`}>
                      <div className="flex items-start gap-4">
                        <button onClick={() => setExerciseSteps(prev => ({
                  ...prev,
                  [step.step]: !prev[step.step]
                }))} className={`w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition ${exerciseSteps[step.step] ? 'bg-green-500 border-green-500 text-white' : 'border-neutral-600 hover:border-green-500'}`}>
                          {exerciseSteps[step.step] ? <CheckCircle className="w-5 h-5" /> : step.step}
                        </button>
                        <div className="flex-1">
                          <p className={`font-medium ${exerciseSteps[step.step] ? 'text-green-400' : ''}`}>
                            {step.instruction}
                          </p>
                          {step.hint && <p className="text-sm text-neutral-500 mt-2 flex items-start gap-2">
                              <Zap className="w-4 h-4 flex-shrink-0 mt-0.5" />
                              <span><strong>Hint:</strong> {step.hint}</span>
                            </p>}
                        </div>
                      </div>
                    </div>)}
                  
                  <div className="mt-6 p-4 bg-neutral-800/50 rounded-xl text-center">
                    <p className="text-neutral-400 mb-2">
                      Progress: {Object.values(exerciseSteps).filter(Boolean).length} / {MODULE_CONTENT[activeContent.moduleId].steps!.length} steps completed
                    </p>
                    <div className="h-2 bg-neutral-700 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full transition-all" style={{
                  width: `${Object.values(exerciseSteps).filter(Boolean).length / MODULE_CONTENT[activeContent.moduleId].steps!.length * 100}%`
                }} />
                    </div>
                  </div>
                </div>}
            </div>

            {/* Content Footer */}
            <div className="p-6 border-t border-neutral-800 flex items-center justify-between">
              <button onClick={() => setActiveContent(null)} className="px-4 py-2 bg-neutral-800 text-neutral-300 rounded-lg hover:bg-neutral-700 transition">
                Back to Modules
              </button>
              
              {/* Complete Button - Reading */}
              {MODULE_CONTENT[activeContent.moduleId].type === 'reading' && readingProgress >= (MODULE_CONTENT[activeContent.moduleId].sections?.length || 1) - 1 && <button onClick={() => {
            // Mark module complete
            setLearningPaths(paths => paths.map(p => p.id === activeContent.pathId ? {
              ...p,
              modules: p.modules.map(m => m.id === activeContent.moduleId ? {
                ...m,
                completed: true
              } : m),
              progress: Math.round(p.modules.filter(m => m.completed || m.id === activeContent.moduleId).length / p.modules.length * 100)
            } : p));
            setSelectedPath(prev => prev ? {
              ...prev,
              modules: prev.modules.map(m => m.id === activeContent.moduleId ? {
                ...m,
                completed: true
              } : m),
              progress: Math.round(prev.modules.filter(m => m.completed || m.id === activeContent.moduleId).length / prev.modules.length * 100)
            } : null);
            setActiveContent(null);
          }} className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Mark Complete
                </button>}
              
              {/* Submit Button - Quiz */}
              {MODULE_CONTENT[activeContent.moduleId].type === 'quiz' && !quizSubmitted && <button onClick={() => setQuizSubmitted(true)} disabled={Object.keys(quizAnswers).length < (MODULE_CONTENT[activeContent.moduleId].questions?.length || 0)} className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                  Submit Quiz
                </button>}
              
              {/* Complete Button - Quiz (after submission) */}
              {MODULE_CONTENT[activeContent.moduleId].type === 'quiz' && quizSubmitted && <button onClick={() => {
            setLearningPaths(paths => paths.map(p => p.id === activeContent.pathId ? {
              ...p,
              modules: p.modules.map(m => m.id === activeContent.moduleId ? {
                ...m,
                completed: true
              } : m),
              progress: Math.round(p.modules.filter(m => m.completed || m.id === activeContent.moduleId).length / p.modules.length * 100)
            } : p));
            setSelectedPath(prev => prev ? {
              ...prev,
              modules: prev.modules.map(m => m.id === activeContent.moduleId ? {
                ...m,
                completed: true
              } : m),
              progress: Math.round(prev.modules.filter(m => m.completed || m.id === activeContent.moduleId).length / prev.modules.length * 100)
            } : null);
            setActiveContent(null);
          }} className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Complete Module
                </button>}
              
              {/* Complete Button - Exercise */}
              {MODULE_CONTENT[activeContent.moduleId].type === 'exercise' && Object.values(exerciseSteps).filter(Boolean).length === (MODULE_CONTENT[activeContent.moduleId].steps?.length || 0) && <button onClick={() => {
            setLearningPaths(paths => paths.map(p => p.id === activeContent.pathId ? {
              ...p,
              modules: p.modules.map(m => m.id === activeContent.moduleId ? {
                ...m,
                completed: true
              } : m),
              progress: Math.round(p.modules.filter(m => m.completed || m.id === activeContent.moduleId).length / p.modules.length * 100)
            } : p));
            setSelectedPath(prev => prev ? {
              ...prev,
              modules: prev.modules.map(m => m.id === activeContent.moduleId ? {
                ...m,
                completed: true
              } : m),
              progress: Math.round(prev.modules.filter(m => m.completed || m.id === activeContent.moduleId).length / prev.modules.length * 100)
            } : null);
            setActiveContent(null);
          }} className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Complete Exercise
                </button>}
            </div>
          </div>
        </div> : stryMutAct_9fa48("24544") ? false : stryMutAct_9fa48("24543") ? true : (stryCov_9fa48("24543", "24544", "24545"), (stryMutAct_9fa48("24547") ? activeContent || MODULE_CONTENT[activeContent.moduleId] : stryMutAct_9fa48("24546") ? true : (stryCov_9fa48("24546", "24547"), activeContent && MODULE_CONTENT[activeContent.moduleId])) && <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-neutral-900 rounded-2xl border border-neutral-700 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Content Header */}
            <div className="p-6 border-b border-neutral-800 flex items-center justify-between">
              <div>
                <span className={`px-3 py-1 text-xs rounded-full mb-2 inline-block ${(stryMutAct_9fa48("24551") ? MODULE_CONTENT[activeContent.moduleId].type !== 'reading' : stryMutAct_9fa48("24550") ? false : stryMutAct_9fa48("24549") ? true : (stryCov_9fa48("24549", "24550", "24551"), MODULE_CONTENT[activeContent.moduleId].type === 'reading')) ? 'bg-amber-500/20 text-amber-400' : (stryMutAct_9fa48("24556") ? MODULE_CONTENT[activeContent.moduleId].type !== 'quiz' : stryMutAct_9fa48("24555") ? false : stryMutAct_9fa48("24554") ? true : (stryCov_9fa48("24554", "24555", "24556"), MODULE_CONTENT[activeContent.moduleId].type === 'quiz')) ? 'bg-purple-500/20 text-purple-400' : 'bg-green-500/20 text-green-400'}`}>
                  {MODULE_CONTENT[activeContent.moduleId].type}
                </span>
                <h2 className="text-xl font-bold">{MODULE_CONTENT[activeContent.moduleId].title}</h2>
              </div>
              <button onClick={stryMutAct_9fa48("24560") ? () => undefined : (stryCov_9fa48("24560"), () => setActiveContent(null))} className="p-2 hover:bg-neutral-800 rounded-lg transition">
                <ChevronRight className="w-6 h-6 rotate-45" />
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Reading Content */}
              {stryMutAct_9fa48("24563") ? MODULE_CONTENT[activeContent.moduleId].type === 'reading' && MODULE_CONTENT[activeContent.moduleId].sections || <div className="space-y-8">
                  {MODULE_CONTENT[activeContent.moduleId].sections!.map((section, idx) => <div key={idx} className={`transition-all ${idx <= readingProgress ? 'opacity-100' : 'opacity-50'}`}>
                      <h3 className="text-lg font-semibold text-indigo-400 mb-3 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center text-sm">
                          {idx + 1}
                        </span>
                        {section.heading}
                      </h3>
                      <p className="text-neutral-300 leading-relaxed">{section.text}</p>
                      {idx === readingProgress && idx < MODULE_CONTENT[activeContent.moduleId].sections!.length - 1 && <button onClick={() => setReadingProgress(prev => prev + 1)} className="mt-4 px-4 py-2 bg-indigo-500/20 text-indigo-400 rounded-lg text-sm hover:bg-indigo-500/30 transition">
                          Continue Reading →
                        </button>}
                    </div>)}
                </div> : stryMutAct_9fa48("24562") ? false : stryMutAct_9fa48("24561") ? true : (stryCov_9fa48("24561", "24562", "24563"), (stryMutAct_9fa48("24565") ? MODULE_CONTENT[activeContent.moduleId].type === 'reading' || MODULE_CONTENT[activeContent.moduleId].sections : stryMutAct_9fa48("24564") ? true : (stryCov_9fa48("24564", "24565"), (stryMutAct_9fa48("24567") ? MODULE_CONTENT[activeContent.moduleId].type !== 'reading' : stryMutAct_9fa48("24566") ? true : (stryCov_9fa48("24566", "24567"), MODULE_CONTENT[activeContent.moduleId].type === 'reading')) && MODULE_CONTENT[activeContent.moduleId].sections)) && <div className="space-y-8">
                  {MODULE_CONTENT[activeContent.moduleId].sections!.map(stryMutAct_9fa48("24569") ? () => undefined : (stryCov_9fa48("24569"), (section, idx) => <div key={idx} className={`transition-all ${(stryMutAct_9fa48("24574") ? idx > readingProgress : stryMutAct_9fa48("24573") ? idx < readingProgress : stryMutAct_9fa48("24572") ? false : stryMutAct_9fa48("24571") ? true : (stryCov_9fa48("24571", "24572", "24573", "24574"), idx <= readingProgress)) ? 'opacity-100' : 'opacity-50'}`}>
                      <h3 className="text-lg font-semibold text-indigo-400 mb-3 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center text-sm">
                          {stryMutAct_9fa48("24577") ? idx - 1 : (stryCov_9fa48("24577"), idx + 1)}
                        </span>
                        {section.heading}
                      </h3>
                      <p className="text-neutral-300 leading-relaxed">{section.text}</p>
                      {stryMutAct_9fa48("24580") ? idx === readingProgress && idx < MODULE_CONTENT[activeContent.moduleId].sections!.length - 1 || <button onClick={() => setReadingProgress(prev => prev + 1)} className="mt-4 px-4 py-2 bg-indigo-500/20 text-indigo-400 rounded-lg text-sm hover:bg-indigo-500/30 transition">
                          Continue Reading →
                        </button> : stryMutAct_9fa48("24579") ? false : stryMutAct_9fa48("24578") ? true : (stryCov_9fa48("24578", "24579", "24580"), (stryMutAct_9fa48("24582") ? idx === readingProgress || idx < MODULE_CONTENT[activeContent.moduleId].sections!.length - 1 : stryMutAct_9fa48("24581") ? true : (stryCov_9fa48("24581", "24582"), (stryMutAct_9fa48("24584") ? idx !== readingProgress : stryMutAct_9fa48("24583") ? true : (stryCov_9fa48("24583", "24584"), idx === readingProgress)) && (stryMutAct_9fa48("24587") ? idx >= MODULE_CONTENT[activeContent.moduleId].sections!.length - 1 : stryMutAct_9fa48("24586") ? idx <= MODULE_CONTENT[activeContent.moduleId].sections!.length - 1 : stryMutAct_9fa48("24585") ? true : (stryCov_9fa48("24585", "24586", "24587"), idx < (stryMutAct_9fa48("24588") ? MODULE_CONTENT[activeContent.moduleId].sections!.length + 1 : (stryCov_9fa48("24588"), MODULE_CONTENT[activeContent.moduleId].sections!.length - 1)))))) && <button onClick={stryMutAct_9fa48("24589") ? () => undefined : (stryCov_9fa48("24589"), () => setReadingProgress(stryMutAct_9fa48("24590") ? () => undefined : (stryCov_9fa48("24590"), prev => stryMutAct_9fa48("24591") ? prev - 1 : (stryCov_9fa48("24591"), prev + 1))))} className="mt-4 px-4 py-2 bg-indigo-500/20 text-indigo-400 rounded-lg text-sm hover:bg-indigo-500/30 transition">
                          Continue Reading →
                        </button>)}
                    </div>))}
                </div>)}

              {/* Quiz Content */}
              {stryMutAct_9fa48("24594") ? MODULE_CONTENT[activeContent.moduleId].type === 'quiz' && MODULE_CONTENT[activeContent.moduleId].questions || <div className="space-y-8">
                  {MODULE_CONTENT[activeContent.moduleId].questions!.map((q, idx) => <div key={q.id} className="bg-neutral-800/50 rounded-xl p-6 border border-neutral-700">
                      <p className="font-medium mb-4 flex items-start gap-3">
                        <span className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center flex-shrink-0">
                          {idx + 1}
                        </span>
                        <span>{q.question}</span>
                      </p>
                      <div className="space-y-2 ml-11">
                        {q.options.map((option, optIdx) => <button key={optIdx} onClick={() => !quizSubmitted && setQuizAnswers(prev => ({
                  ...prev,
                  [q.id]: optIdx
                }))} disabled={quizSubmitted} className={`w-full text-left p-3 rounded-lg border transition ${quizSubmitted && optIdx === q.correct ? 'bg-green-500/20 border-green-500 text-green-400' : quizSubmitted && quizAnswers[q.id] === optIdx && optIdx !== q.correct ? 'bg-red-500/20 border-red-500 text-red-400' : quizAnswers[q.id] === optIdx ? 'bg-purple-500/20 border-purple-500 text-purple-400' : 'bg-neutral-800 border-neutral-700 hover:border-neutral-600'}`}>
                            <span className="flex items-center gap-3">
                              <span className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs ${quizAnswers[q.id] === optIdx ? 'border-current bg-current/20' : 'border-neutral-600'}`}>
                                {String.fromCharCode(65 + optIdx)}
                              </span>
                              {option}
                              {quizSubmitted && optIdx === q.correct && <CheckCircle className="w-5 h-5 text-green-400 ml-auto" />}
                            </span>
                          </button>)}
                      </div>
                    </div>)}
                  
                  {!quizSubmitted && <div className="text-center pt-4">
                      <p className="text-neutral-500 text-sm mb-4">
                        {Object.keys(quizAnswers).length} of {MODULE_CONTENT[activeContent.moduleId].questions!.length} questions answered
                      </p>
                    </div>}
                  
                  {quizSubmitted && <div className="bg-neutral-800/50 rounded-xl p-6 border border-neutral-700 text-center">
                      <Award className="w-12 h-12 mx-auto mb-3 text-amber-400" />
                      <p className="text-xl font-bold mb-2">
                        {MODULE_CONTENT[activeContent.moduleId].questions!.filter(q => quizAnswers[q.id] === q.correct).length} / {MODULE_CONTENT[activeContent.moduleId].questions!.length} Correct
                      </p>
                      <p className="text-neutral-400">
                        {MODULE_CONTENT[activeContent.moduleId].questions!.filter(q => quizAnswers[q.id] === q.correct).length === MODULE_CONTENT[activeContent.moduleId].questions!.length ? 'Perfect score! Excellent work!' : 'Review the correct answers above.'}
                      </p>
                    </div>}
                </div> : stryMutAct_9fa48("24593") ? false : stryMutAct_9fa48("24592") ? true : (stryCov_9fa48("24592", "24593", "24594"), (stryMutAct_9fa48("24596") ? MODULE_CONTENT[activeContent.moduleId].type === 'quiz' || MODULE_CONTENT[activeContent.moduleId].questions : stryMutAct_9fa48("24595") ? true : (stryCov_9fa48("24595", "24596"), (stryMutAct_9fa48("24598") ? MODULE_CONTENT[activeContent.moduleId].type !== 'quiz' : stryMutAct_9fa48("24597") ? true : (stryCov_9fa48("24597", "24598"), MODULE_CONTENT[activeContent.moduleId].type === 'quiz')) && MODULE_CONTENT[activeContent.moduleId].questions)) && <div className="space-y-8">
                  {MODULE_CONTENT[activeContent.moduleId].questions!.map(stryMutAct_9fa48("24600") ? () => undefined : (stryCov_9fa48("24600"), (q, idx) => <div key={q.id} className="bg-neutral-800/50 rounded-xl p-6 border border-neutral-700">
                      <p className="font-medium mb-4 flex items-start gap-3">
                        <span className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center flex-shrink-0">
                          {stryMutAct_9fa48("24601") ? idx - 1 : (stryCov_9fa48("24601"), idx + 1)}
                        </span>
                        <span>{q.question}</span>
                      </p>
                      <div className="space-y-2 ml-11">
                        {q.options.map(stryMutAct_9fa48("24602") ? () => undefined : (stryCov_9fa48("24602"), (option, optIdx) => <button key={optIdx} onClick={stryMutAct_9fa48("24603") ? () => undefined : (stryCov_9fa48("24603"), () => stryMutAct_9fa48("24606") ? !quizSubmitted || setQuizAnswers(prev => ({
                  ...prev,
                  [q.id]: optIdx
                })) : stryMutAct_9fa48("24605") ? false : stryMutAct_9fa48("24604") ? true : (stryCov_9fa48("24604", "24605", "24606"), (stryMutAct_9fa48("24607") ? quizSubmitted : (stryCov_9fa48("24607"), !quizSubmitted)) && setQuizAnswers(stryMutAct_9fa48("24608") ? () => undefined : (stryCov_9fa48("24608"), prev => stryMutAct_9fa48("24609") ? {} : (stryCov_9fa48("24609"), {
                  ...prev,
                  [q.id]: optIdx
                })))))} disabled={quizSubmitted} className={`w-full text-left p-3 rounded-lg border transition ${(stryMutAct_9fa48("24613") ? quizSubmitted || optIdx === q.correct : stryMutAct_9fa48("24612") ? false : stryMutAct_9fa48("24611") ? true : (stryCov_9fa48("24611", "24612", "24613"), quizSubmitted && (stryMutAct_9fa48("24615") ? optIdx !== q.correct : stryMutAct_9fa48("24614") ? true : (stryCov_9fa48("24614", "24615"), optIdx === q.correct)))) ? 'bg-green-500/20 border-green-500 text-green-400' : (stryMutAct_9fa48("24619") ? quizSubmitted && quizAnswers[q.id] === optIdx || optIdx !== q.correct : stryMutAct_9fa48("24618") ? false : stryMutAct_9fa48("24617") ? true : (stryCov_9fa48("24617", "24618", "24619"), (stryMutAct_9fa48("24621") ? quizSubmitted || quizAnswers[q.id] === optIdx : stryMutAct_9fa48("24620") ? true : (stryCov_9fa48("24620", "24621"), quizSubmitted && (stryMutAct_9fa48("24623") ? quizAnswers[q.id] !== optIdx : stryMutAct_9fa48("24622") ? true : (stryCov_9fa48("24622", "24623"), quizAnswers[q.id] === optIdx)))) && (stryMutAct_9fa48("24625") ? optIdx === q.correct : stryMutAct_9fa48("24624") ? true : (stryCov_9fa48("24624", "24625"), optIdx !== q.correct)))) ? 'bg-red-500/20 border-red-500 text-red-400' : (stryMutAct_9fa48("24629") ? quizAnswers[q.id] !== optIdx : stryMutAct_9fa48("24628") ? false : stryMutAct_9fa48("24627") ? true : (stryCov_9fa48("24627", "24628", "24629"), quizAnswers[q.id] === optIdx)) ? 'bg-purple-500/20 border-purple-500 text-purple-400' : 'bg-neutral-800 border-neutral-700 hover:border-neutral-600'}`}>
                            <span className="flex items-center gap-3">
                              <span className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs ${(stryMutAct_9fa48("24635") ? quizAnswers[q.id] !== optIdx : stryMutAct_9fa48("24634") ? false : stryMutAct_9fa48("24633") ? true : (stryCov_9fa48("24633", "24634", "24635"), quizAnswers[q.id] === optIdx)) ? 'border-current bg-current/20' : 'border-neutral-600'}`}>
                                {String.fromCharCode(stryMutAct_9fa48("24638") ? 65 - optIdx : (stryCov_9fa48("24638"), 65 + optIdx))}
                              </span>
                              {option}
                              {stryMutAct_9fa48("24641") ? quizSubmitted && optIdx === q.correct || <CheckCircle className="w-5 h-5 text-green-400 ml-auto" /> : stryMutAct_9fa48("24640") ? false : stryMutAct_9fa48("24639") ? true : (stryCov_9fa48("24639", "24640", "24641"), (stryMutAct_9fa48("24643") ? quizSubmitted || optIdx === q.correct : stryMutAct_9fa48("24642") ? true : (stryCov_9fa48("24642", "24643"), quizSubmitted && (stryMutAct_9fa48("24645") ? optIdx !== q.correct : stryMutAct_9fa48("24644") ? true : (stryCov_9fa48("24644", "24645"), optIdx === q.correct)))) && <CheckCircle className="w-5 h-5 text-green-400 ml-auto" />)}
                            </span>
                          </button>))}
                      </div>
                    </div>))}
                  
                  {stryMutAct_9fa48("24648") ? !quizSubmitted || <div className="text-center pt-4">
                      <p className="text-neutral-500 text-sm mb-4">
                        {Object.keys(quizAnswers).length} of {MODULE_CONTENT[activeContent.moduleId].questions!.length} questions answered
                      </p>
                    </div> : stryMutAct_9fa48("24647") ? false : stryMutAct_9fa48("24646") ? true : (stryCov_9fa48("24646", "24647", "24648"), (stryMutAct_9fa48("24649") ? quizSubmitted : (stryCov_9fa48("24649"), !quizSubmitted)) && <div className="text-center pt-4">
                      <p className="text-neutral-500 text-sm mb-4">
                        {Object.keys(quizAnswers).length} of {MODULE_CONTENT[activeContent.moduleId].questions!.length} questions answered
                      </p>
                    </div>)}
                  
                  {stryMutAct_9fa48("24652") ? quizSubmitted || <div className="bg-neutral-800/50 rounded-xl p-6 border border-neutral-700 text-center">
                      <Award className="w-12 h-12 mx-auto mb-3 text-amber-400" />
                      <p className="text-xl font-bold mb-2">
                        {MODULE_CONTENT[activeContent.moduleId].questions!.filter(q => quizAnswers[q.id] === q.correct).length} / {MODULE_CONTENT[activeContent.moduleId].questions!.length} Correct
                      </p>
                      <p className="text-neutral-400">
                        {MODULE_CONTENT[activeContent.moduleId].questions!.filter(q => quizAnswers[q.id] === q.correct).length === MODULE_CONTENT[activeContent.moduleId].questions!.length ? 'Perfect score! Excellent work!' : 'Review the correct answers above.'}
                      </p>
                    </div> : stryMutAct_9fa48("24651") ? false : stryMutAct_9fa48("24650") ? true : (stryCov_9fa48("24650", "24651", "24652"), quizSubmitted && <div className="bg-neutral-800/50 rounded-xl p-6 border border-neutral-700 text-center">
                      <Award className="w-12 h-12 mx-auto mb-3 text-amber-400" />
                      <p className="text-xl font-bold mb-2">
                        {stryMutAct_9fa48("24653") ? MODULE_CONTENT[activeContent.moduleId].questions!.length : (stryCov_9fa48("24653"), MODULE_CONTENT[activeContent.moduleId].questions!.filter(stryMutAct_9fa48("24654") ? () => undefined : (stryCov_9fa48("24654"), q => stryMutAct_9fa48("24657") ? quizAnswers[q.id] !== q.correct : stryMutAct_9fa48("24656") ? false : stryMutAct_9fa48("24655") ? true : (stryCov_9fa48("24655", "24656", "24657"), quizAnswers[q.id] === q.correct))).length)} / {MODULE_CONTENT[activeContent.moduleId].questions!.length} Correct
                      </p>
                      <p className="text-neutral-400">
                        {(stryMutAct_9fa48("24660") ? MODULE_CONTENT[activeContent.moduleId].questions!.filter(q => quizAnswers[q.id] === q.correct).length !== MODULE_CONTENT[activeContent.moduleId].questions!.length : stryMutAct_9fa48("24659") ? false : stryMutAct_9fa48("24658") ? true : (stryCov_9fa48("24658", "24659", "24660"), (stryMutAct_9fa48("24661") ? MODULE_CONTENT[activeContent.moduleId].questions!.length : (stryCov_9fa48("24661"), MODULE_CONTENT[activeContent.moduleId].questions!.filter(stryMutAct_9fa48("24662") ? () => undefined : (stryCov_9fa48("24662"), q => stryMutAct_9fa48("24665") ? quizAnswers[q.id] !== q.correct : stryMutAct_9fa48("24664") ? false : stryMutAct_9fa48("24663") ? true : (stryCov_9fa48("24663", "24664", "24665"), quizAnswers[q.id] === q.correct))).length)) === MODULE_CONTENT[activeContent.moduleId].questions!.length)) ? 'Perfect score! Excellent work!' : 'Review the correct answers above.'}
                      </p>
                    </div>)}
                </div>)}

              {/* Exercise Content */}
              {stryMutAct_9fa48("24670") ? MODULE_CONTENT[activeContent.moduleId].type === 'exercise' && MODULE_CONTENT[activeContent.moduleId].steps || <div className="space-y-4">
                  <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-xl p-4 mb-6">
                    <p className="text-indigo-400 text-sm">
                      <strong>Instructions:</strong> Complete each step below. Check off each step as you finish to track your progress.
                    </p>
                  </div>
                  
                  {MODULE_CONTENT[activeContent.moduleId].steps!.map(step => <div key={step.step} className={`p-4 rounded-xl border transition ${exerciseSteps[step.step] ? 'bg-green-500/10 border-green-500/30' : 'bg-neutral-800/50 border-neutral-700'}`}>
                      <div className="flex items-start gap-4">
                        <button onClick={() => setExerciseSteps(prev => ({
                  ...prev,
                  [step.step]: !prev[step.step]
                }))} className={`w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition ${exerciseSteps[step.step] ? 'bg-green-500 border-green-500 text-white' : 'border-neutral-600 hover:border-green-500'}`}>
                          {exerciseSteps[step.step] ? <CheckCircle className="w-5 h-5" /> : step.step}
                        </button>
                        <div className="flex-1">
                          <p className={`font-medium ${exerciseSteps[step.step] ? 'text-green-400' : ''}`}>
                            {step.instruction}
                          </p>
                          {step.hint && <p className="text-sm text-neutral-500 mt-2 flex items-start gap-2">
                              <Zap className="w-4 h-4 flex-shrink-0 mt-0.5" />
                              <span><strong>Hint:</strong> {step.hint}</span>
                            </p>}
                        </div>
                      </div>
                    </div>)}
                  
                  <div className="mt-6 p-4 bg-neutral-800/50 rounded-xl text-center">
                    <p className="text-neutral-400 mb-2">
                      Progress: {Object.values(exerciseSteps).filter(Boolean).length} / {MODULE_CONTENT[activeContent.moduleId].steps!.length} steps completed
                    </p>
                    <div className="h-2 bg-neutral-700 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full transition-all" style={{
                  width: `${Object.values(exerciseSteps).filter(Boolean).length / MODULE_CONTENT[activeContent.moduleId].steps!.length * 100}%`
                }} />
                    </div>
                  </div>
                </div> : stryMutAct_9fa48("24669") ? false : stryMutAct_9fa48("24668") ? true : (stryCov_9fa48("24668", "24669", "24670"), (stryMutAct_9fa48("24672") ? MODULE_CONTENT[activeContent.moduleId].type === 'exercise' || MODULE_CONTENT[activeContent.moduleId].steps : stryMutAct_9fa48("24671") ? true : (stryCov_9fa48("24671", "24672"), (stryMutAct_9fa48("24674") ? MODULE_CONTENT[activeContent.moduleId].type !== 'exercise' : stryMutAct_9fa48("24673") ? true : (stryCov_9fa48("24673", "24674"), MODULE_CONTENT[activeContent.moduleId].type === 'exercise')) && MODULE_CONTENT[activeContent.moduleId].steps)) && <div className="space-y-4">
                  <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-xl p-4 mb-6">
                    <p className="text-indigo-400 text-sm">
                      <strong>Instructions:</strong> Complete each step below. Check off each step as you finish to track your progress.
                    </p>
                  </div>
                  
                  {MODULE_CONTENT[activeContent.moduleId].steps!.map(stryMutAct_9fa48("24676") ? () => undefined : (stryCov_9fa48("24676"), step => <div key={step.step} className={`p-4 rounded-xl border transition ${exerciseSteps[step.step] ? 'bg-green-500/10 border-green-500/30' : 'bg-neutral-800/50 border-neutral-700'}`}>
                      <div className="flex items-start gap-4">
                        <button onClick={stryMutAct_9fa48("24680") ? () => undefined : (stryCov_9fa48("24680"), () => setExerciseSteps(stryMutAct_9fa48("24681") ? () => undefined : (stryCov_9fa48("24681"), prev => stryMutAct_9fa48("24682") ? {} : (stryCov_9fa48("24682"), {
                  ...prev,
                  [step.step]: stryMutAct_9fa48("24683") ? prev[step.step] : (stryCov_9fa48("24683"), !prev[step.step])
                }))))} className={`w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition ${exerciseSteps[step.step] ? 'bg-green-500 border-green-500 text-white' : 'border-neutral-600 hover:border-green-500'}`}>
                          {exerciseSteps[step.step] ? <CheckCircle className="w-5 h-5" /> : step.step}
                        </button>
                        <div className="flex-1">
                          <p className={`font-medium ${exerciseSteps[step.step] ? 'text-green-400' : ''}`}>
                            {step.instruction}
                          </p>
                          {stryMutAct_9fa48("24692") ? step.hint || <p className="text-sm text-neutral-500 mt-2 flex items-start gap-2">
                              <Zap className="w-4 h-4 flex-shrink-0 mt-0.5" />
                              <span><strong>Hint:</strong> {step.hint}</span>
                            </p> : stryMutAct_9fa48("24691") ? false : stryMutAct_9fa48("24690") ? true : (stryCov_9fa48("24690", "24691", "24692"), step.hint && <p className="text-sm text-neutral-500 mt-2 flex items-start gap-2">
                              <Zap className="w-4 h-4 flex-shrink-0 mt-0.5" />
                              <span><strong>Hint:</strong> {step.hint}</span>
                            </p>)}
                        </div>
                      </div>
                    </div>))}
                  
                  <div className="mt-6 p-4 bg-neutral-800/50 rounded-xl text-center">
                    <p className="text-neutral-400 mb-2">
                      Progress: {stryMutAct_9fa48("24693") ? Object.values(exerciseSteps).length : (stryCov_9fa48("24693"), Object.values(exerciseSteps).filter(Boolean).length)} / {MODULE_CONTENT[activeContent.moduleId].steps!.length} steps completed
                    </p>
                    <div className="h-2 bg-neutral-700 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full transition-all" style={stryMutAct_9fa48("24694") ? {} : (stryCov_9fa48("24694"), {
                  width: `${stryMutAct_9fa48("24696") ? Object.values(exerciseSteps).filter(Boolean).length / MODULE_CONTENT[activeContent.moduleId].steps!.length / 100 : (stryCov_9fa48("24696"), (stryMutAct_9fa48("24697") ? Object.values(exerciseSteps).filter(Boolean).length * MODULE_CONTENT[activeContent.moduleId].steps!.length : (stryCov_9fa48("24697"), (stryMutAct_9fa48("24698") ? Object.values(exerciseSteps).length : (stryCov_9fa48("24698"), Object.values(exerciseSteps).filter(Boolean).length)) / MODULE_CONTENT[activeContent.moduleId].steps!.length)) * 100)}%`
                })} />
                    </div>
                  </div>
                </div>)}
            </div>

            {/* Content Footer */}
            <div className="p-6 border-t border-neutral-800 flex items-center justify-between">
              <button onClick={stryMutAct_9fa48("24699") ? () => undefined : (stryCov_9fa48("24699"), () => setActiveContent(null))} className="px-4 py-2 bg-neutral-800 text-neutral-300 rounded-lg hover:bg-neutral-700 transition">
                Back to Modules
              </button>
              
              {/* Complete Button - Reading */}
              {stryMutAct_9fa48("24702") ? MODULE_CONTENT[activeContent.moduleId].type === 'reading' && readingProgress >= (MODULE_CONTENT[activeContent.moduleId].sections?.length || 1) - 1 || <button onClick={() => {
            // Mark module complete
            setLearningPaths(paths => paths.map(p => p.id === activeContent.pathId ? {
              ...p,
              modules: p.modules.map(m => m.id === activeContent.moduleId ? {
                ...m,
                completed: true
              } : m),
              progress: Math.round(p.modules.filter(m => m.completed || m.id === activeContent.moduleId).length / p.modules.length * 100)
            } : p));
            setSelectedPath(prev => prev ? {
              ...prev,
              modules: prev.modules.map(m => m.id === activeContent.moduleId ? {
                ...m,
                completed: true
              } : m),
              progress: Math.round(prev.modules.filter(m => m.completed || m.id === activeContent.moduleId).length / prev.modules.length * 100)
            } : null);
            setActiveContent(null);
          }} className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Mark Complete
                </button> : stryMutAct_9fa48("24701") ? false : stryMutAct_9fa48("24700") ? true : (stryCov_9fa48("24700", "24701", "24702"), (stryMutAct_9fa48("24704") ? MODULE_CONTENT[activeContent.moduleId].type === 'reading' || readingProgress >= (MODULE_CONTENT[activeContent.moduleId].sections?.length || 1) - 1 : stryMutAct_9fa48("24703") ? true : (stryCov_9fa48("24703", "24704"), (stryMutAct_9fa48("24706") ? MODULE_CONTENT[activeContent.moduleId].type !== 'reading' : stryMutAct_9fa48("24705") ? true : (stryCov_9fa48("24705", "24706"), MODULE_CONTENT[activeContent.moduleId].type === 'reading')) && (stryMutAct_9fa48("24710") ? readingProgress < (MODULE_CONTENT[activeContent.moduleId].sections?.length || 1) - 1 : stryMutAct_9fa48("24709") ? readingProgress > (MODULE_CONTENT[activeContent.moduleId].sections?.length || 1) - 1 : stryMutAct_9fa48("24708") ? true : (stryCov_9fa48("24708", "24709", "24710"), readingProgress >= (stryMutAct_9fa48("24711") ? (MODULE_CONTENT[activeContent.moduleId].sections?.length || 1) + 1 : (stryCov_9fa48("24711"), (stryMutAct_9fa48("24714") ? MODULE_CONTENT[activeContent.moduleId].sections?.length && 1 : stryMutAct_9fa48("24713") ? false : stryMutAct_9fa48("24712") ? true : (stryCov_9fa48("24712", "24713", "24714"), (stryMutAct_9fa48("24715") ? MODULE_CONTENT[activeContent.moduleId].sections.length : (stryCov_9fa48("24715"), MODULE_CONTENT[activeContent.moduleId].sections?.length)) || 1)) - 1)))))) && <button onClick={() => {
            // Mark module complete
            setLearningPaths(stryMutAct_9fa48("24717") ? () => undefined : (stryCov_9fa48("24717"), paths => paths.map(stryMutAct_9fa48("24718") ? () => undefined : (stryCov_9fa48("24718"), p => (stryMutAct_9fa48("24721") ? p.id !== activeContent.pathId : stryMutAct_9fa48("24720") ? false : stryMutAct_9fa48("24719") ? true : (stryCov_9fa48("24719", "24720", "24721"), p.id === activeContent.pathId)) ? stryMutAct_9fa48("24722") ? {} : (stryCov_9fa48("24722"), {
              ...p,
              modules: p.modules.map(stryMutAct_9fa48("24723") ? () => undefined : (stryCov_9fa48("24723"), m => (stryMutAct_9fa48("24726") ? m.id !== activeContent.moduleId : stryMutAct_9fa48("24725") ? false : stryMutAct_9fa48("24724") ? true : (stryCov_9fa48("24724", "24725", "24726"), m.id === activeContent.moduleId)) ? stryMutAct_9fa48("24727") ? {} : (stryCov_9fa48("24727"), {
                ...m,
                completed: stryMutAct_9fa48("24728") ? false : (stryCov_9fa48("24728"), true)
              }) : m)),
              progress: Math.round(stryMutAct_9fa48("24729") ? p.modules.filter(m => m.completed || m.id === activeContent.moduleId).length / p.modules.length / 100 : (stryCov_9fa48("24729"), (stryMutAct_9fa48("24730") ? p.modules.filter(m => m.completed || m.id === activeContent.moduleId).length * p.modules.length : (stryCov_9fa48("24730"), (stryMutAct_9fa48("24731") ? p.modules.length : (stryCov_9fa48("24731"), p.modules.filter(stryMutAct_9fa48("24732") ? () => undefined : (stryCov_9fa48("24732"), m => stryMutAct_9fa48("24735") ? m.completed && m.id === activeContent.moduleId : stryMutAct_9fa48("24734") ? false : stryMutAct_9fa48("24733") ? true : (stryCov_9fa48("24733", "24734", "24735"), m.completed || (stryMutAct_9fa48("24737") ? m.id !== activeContent.moduleId : stryMutAct_9fa48("24736") ? false : (stryCov_9fa48("24736", "24737"), m.id === activeContent.moduleId))))).length)) / p.modules.length)) * 100))
            }) : p))));
            setSelectedPath(stryMutAct_9fa48("24738") ? () => undefined : (stryCov_9fa48("24738"), prev => prev ? stryMutAct_9fa48("24739") ? {} : (stryCov_9fa48("24739"), {
              ...prev,
              modules: prev.modules.map(stryMutAct_9fa48("24740") ? () => undefined : (stryCov_9fa48("24740"), m => (stryMutAct_9fa48("24743") ? m.id !== activeContent.moduleId : stryMutAct_9fa48("24742") ? false : stryMutAct_9fa48("24741") ? true : (stryCov_9fa48("24741", "24742", "24743"), m.id === activeContent.moduleId)) ? stryMutAct_9fa48("24744") ? {} : (stryCov_9fa48("24744"), {
                ...m,
                completed: stryMutAct_9fa48("24745") ? false : (stryCov_9fa48("24745"), true)
              }) : m)),
              progress: Math.round(stryMutAct_9fa48("24746") ? prev.modules.filter(m => m.completed || m.id === activeContent.moduleId).length / prev.modules.length / 100 : (stryCov_9fa48("24746"), (stryMutAct_9fa48("24747") ? prev.modules.filter(m => m.completed || m.id === activeContent.moduleId).length * prev.modules.length : (stryCov_9fa48("24747"), (stryMutAct_9fa48("24748") ? prev.modules.length : (stryCov_9fa48("24748"), prev.modules.filter(stryMutAct_9fa48("24749") ? () => undefined : (stryCov_9fa48("24749"), m => stryMutAct_9fa48("24752") ? m.completed && m.id === activeContent.moduleId : stryMutAct_9fa48("24751") ? false : stryMutAct_9fa48("24750") ? true : (stryCov_9fa48("24750", "24751", "24752"), m.completed || (stryMutAct_9fa48("24754") ? m.id !== activeContent.moduleId : stryMutAct_9fa48("24753") ? false : (stryCov_9fa48("24753", "24754"), m.id === activeContent.moduleId))))).length)) / prev.modules.length)) * 100))
            }) : null));
            setActiveContent(null);
          }} className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Mark Complete
                </button>)}
              
              {/* Submit Button - Quiz */}
              {stryMutAct_9fa48("24757") ? MODULE_CONTENT[activeContent.moduleId].type === 'quiz' && !quizSubmitted || <button onClick={() => setQuizSubmitted(true)} disabled={Object.keys(quizAnswers).length < (MODULE_CONTENT[activeContent.moduleId].questions?.length || 0)} className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                  Submit Quiz
                </button> : stryMutAct_9fa48("24756") ? false : stryMutAct_9fa48("24755") ? true : (stryCov_9fa48("24755", "24756", "24757"), (stryMutAct_9fa48("24759") ? MODULE_CONTENT[activeContent.moduleId].type === 'quiz' || !quizSubmitted : stryMutAct_9fa48("24758") ? true : (stryCov_9fa48("24758", "24759"), (stryMutAct_9fa48("24761") ? MODULE_CONTENT[activeContent.moduleId].type !== 'quiz' : stryMutAct_9fa48("24760") ? true : (stryCov_9fa48("24760", "24761"), MODULE_CONTENT[activeContent.moduleId].type === 'quiz')) && (stryMutAct_9fa48("24763") ? quizSubmitted : (stryCov_9fa48("24763"), !quizSubmitted)))) && <button onClick={stryMutAct_9fa48("24764") ? () => undefined : (stryCov_9fa48("24764"), () => setQuizSubmitted(stryMutAct_9fa48("24765") ? false : (stryCov_9fa48("24765"), true)))} disabled={stryMutAct_9fa48("24769") ? Object.keys(quizAnswers).length >= (MODULE_CONTENT[activeContent.moduleId].questions?.length || 0) : stryMutAct_9fa48("24768") ? Object.keys(quizAnswers).length <= (MODULE_CONTENT[activeContent.moduleId].questions?.length || 0) : stryMutAct_9fa48("24767") ? false : stryMutAct_9fa48("24766") ? true : (stryCov_9fa48("24766", "24767", "24768", "24769"), Object.keys(quizAnswers).length < (stryMutAct_9fa48("24772") ? MODULE_CONTENT[activeContent.moduleId].questions?.length && 0 : stryMutAct_9fa48("24771") ? false : stryMutAct_9fa48("24770") ? true : (stryCov_9fa48("24770", "24771", "24772"), (stryMutAct_9fa48("24773") ? MODULE_CONTENT[activeContent.moduleId].questions.length : (stryCov_9fa48("24773"), MODULE_CONTENT[activeContent.moduleId].questions?.length)) || 0)))} className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                  Submit Quiz
                </button>)}
              
              {/* Complete Button - Quiz (after submission) */}
              {stryMutAct_9fa48("24776") ? MODULE_CONTENT[activeContent.moduleId].type === 'quiz' && quizSubmitted || <button onClick={() => {
            setLearningPaths(paths => paths.map(p => p.id === activeContent.pathId ? {
              ...p,
              modules: p.modules.map(m => m.id === activeContent.moduleId ? {
                ...m,
                completed: true
              } : m),
              progress: Math.round(p.modules.filter(m => m.completed || m.id === activeContent.moduleId).length / p.modules.length * 100)
            } : p));
            setSelectedPath(prev => prev ? {
              ...prev,
              modules: prev.modules.map(m => m.id === activeContent.moduleId ? {
                ...m,
                completed: true
              } : m),
              progress: Math.round(prev.modules.filter(m => m.completed || m.id === activeContent.moduleId).length / prev.modules.length * 100)
            } : null);
            setActiveContent(null);
          }} className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Complete Module
                </button> : stryMutAct_9fa48("24775") ? false : stryMutAct_9fa48("24774") ? true : (stryCov_9fa48("24774", "24775", "24776"), (stryMutAct_9fa48("24778") ? MODULE_CONTENT[activeContent.moduleId].type === 'quiz' || quizSubmitted : stryMutAct_9fa48("24777") ? true : (stryCov_9fa48("24777", "24778"), (stryMutAct_9fa48("24780") ? MODULE_CONTENT[activeContent.moduleId].type !== 'quiz' : stryMutAct_9fa48("24779") ? true : (stryCov_9fa48("24779", "24780"), MODULE_CONTENT[activeContent.moduleId].type === 'quiz')) && quizSubmitted)) && <button onClick={() => {
            setLearningPaths(stryMutAct_9fa48("24783") ? () => undefined : (stryCov_9fa48("24783"), paths => paths.map(stryMutAct_9fa48("24784") ? () => undefined : (stryCov_9fa48("24784"), p => (stryMutAct_9fa48("24787") ? p.id !== activeContent.pathId : stryMutAct_9fa48("24786") ? false : stryMutAct_9fa48("24785") ? true : (stryCov_9fa48("24785", "24786", "24787"), p.id === activeContent.pathId)) ? stryMutAct_9fa48("24788") ? {} : (stryCov_9fa48("24788"), {
              ...p,
              modules: p.modules.map(stryMutAct_9fa48("24789") ? () => undefined : (stryCov_9fa48("24789"), m => (stryMutAct_9fa48("24792") ? m.id !== activeContent.moduleId : stryMutAct_9fa48("24791") ? false : stryMutAct_9fa48("24790") ? true : (stryCov_9fa48("24790", "24791", "24792"), m.id === activeContent.moduleId)) ? stryMutAct_9fa48("24793") ? {} : (stryCov_9fa48("24793"), {
                ...m,
                completed: stryMutAct_9fa48("24794") ? false : (stryCov_9fa48("24794"), true)
              }) : m)),
              progress: Math.round(stryMutAct_9fa48("24795") ? p.modules.filter(m => m.completed || m.id === activeContent.moduleId).length / p.modules.length / 100 : (stryCov_9fa48("24795"), (stryMutAct_9fa48("24796") ? p.modules.filter(m => m.completed || m.id === activeContent.moduleId).length * p.modules.length : (stryCov_9fa48("24796"), (stryMutAct_9fa48("24797") ? p.modules.length : (stryCov_9fa48("24797"), p.modules.filter(stryMutAct_9fa48("24798") ? () => undefined : (stryCov_9fa48("24798"), m => stryMutAct_9fa48("24801") ? m.completed && m.id === activeContent.moduleId : stryMutAct_9fa48("24800") ? false : stryMutAct_9fa48("24799") ? true : (stryCov_9fa48("24799", "24800", "24801"), m.completed || (stryMutAct_9fa48("24803") ? m.id !== activeContent.moduleId : stryMutAct_9fa48("24802") ? false : (stryCov_9fa48("24802", "24803"), m.id === activeContent.moduleId))))).length)) / p.modules.length)) * 100))
            }) : p))));
            setSelectedPath(stryMutAct_9fa48("24804") ? () => undefined : (stryCov_9fa48("24804"), prev => prev ? stryMutAct_9fa48("24805") ? {} : (stryCov_9fa48("24805"), {
              ...prev,
              modules: prev.modules.map(stryMutAct_9fa48("24806") ? () => undefined : (stryCov_9fa48("24806"), m => (stryMutAct_9fa48("24809") ? m.id !== activeContent.moduleId : stryMutAct_9fa48("24808") ? false : stryMutAct_9fa48("24807") ? true : (stryCov_9fa48("24807", "24808", "24809"), m.id === activeContent.moduleId)) ? stryMutAct_9fa48("24810") ? {} : (stryCov_9fa48("24810"), {
                ...m,
                completed: stryMutAct_9fa48("24811") ? false : (stryCov_9fa48("24811"), true)
              }) : m)),
              progress: Math.round(stryMutAct_9fa48("24812") ? prev.modules.filter(m => m.completed || m.id === activeContent.moduleId).length / prev.modules.length / 100 : (stryCov_9fa48("24812"), (stryMutAct_9fa48("24813") ? prev.modules.filter(m => m.completed || m.id === activeContent.moduleId).length * prev.modules.length : (stryCov_9fa48("24813"), (stryMutAct_9fa48("24814") ? prev.modules.length : (stryCov_9fa48("24814"), prev.modules.filter(stryMutAct_9fa48("24815") ? () => undefined : (stryCov_9fa48("24815"), m => stryMutAct_9fa48("24818") ? m.completed && m.id === activeContent.moduleId : stryMutAct_9fa48("24817") ? false : stryMutAct_9fa48("24816") ? true : (stryCov_9fa48("24816", "24817", "24818"), m.completed || (stryMutAct_9fa48("24820") ? m.id !== activeContent.moduleId : stryMutAct_9fa48("24819") ? false : (stryCov_9fa48("24819", "24820"), m.id === activeContent.moduleId))))).length)) / prev.modules.length)) * 100))
            }) : null));
            setActiveContent(null);
          }} className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Complete Module
                </button>)}
              
              {/* Complete Button - Exercise */}
              {stryMutAct_9fa48("24823") ? MODULE_CONTENT[activeContent.moduleId].type === 'exercise' && Object.values(exerciseSteps).filter(Boolean).length === (MODULE_CONTENT[activeContent.moduleId].steps?.length || 0) || <button onClick={() => {
            setLearningPaths(paths => paths.map(p => p.id === activeContent.pathId ? {
              ...p,
              modules: p.modules.map(m => m.id === activeContent.moduleId ? {
                ...m,
                completed: true
              } : m),
              progress: Math.round(p.modules.filter(m => m.completed || m.id === activeContent.moduleId).length / p.modules.length * 100)
            } : p));
            setSelectedPath(prev => prev ? {
              ...prev,
              modules: prev.modules.map(m => m.id === activeContent.moduleId ? {
                ...m,
                completed: true
              } : m),
              progress: Math.round(prev.modules.filter(m => m.completed || m.id === activeContent.moduleId).length / prev.modules.length * 100)
            } : null);
            setActiveContent(null);
          }} className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Complete Exercise
                </button> : stryMutAct_9fa48("24822") ? false : stryMutAct_9fa48("24821") ? true : (stryCov_9fa48("24821", "24822", "24823"), (stryMutAct_9fa48("24825") ? MODULE_CONTENT[activeContent.moduleId].type === 'exercise' || Object.values(exerciseSteps).filter(Boolean).length === (MODULE_CONTENT[activeContent.moduleId].steps?.length || 0) : stryMutAct_9fa48("24824") ? true : (stryCov_9fa48("24824", "24825"), (stryMutAct_9fa48("24827") ? MODULE_CONTENT[activeContent.moduleId].type !== 'exercise' : stryMutAct_9fa48("24826") ? true : (stryCov_9fa48("24826", "24827"), MODULE_CONTENT[activeContent.moduleId].type === 'exercise')) && (stryMutAct_9fa48("24830") ? Object.values(exerciseSteps).filter(Boolean).length !== (MODULE_CONTENT[activeContent.moduleId].steps?.length || 0) : stryMutAct_9fa48("24829") ? true : (stryCov_9fa48("24829", "24830"), (stryMutAct_9fa48("24831") ? Object.values(exerciseSteps).length : (stryCov_9fa48("24831"), Object.values(exerciseSteps).filter(Boolean).length)) === (stryMutAct_9fa48("24834") ? MODULE_CONTENT[activeContent.moduleId].steps?.length && 0 : stryMutAct_9fa48("24833") ? false : stryMutAct_9fa48("24832") ? true : (stryCov_9fa48("24832", "24833", "24834"), (stryMutAct_9fa48("24835") ? MODULE_CONTENT[activeContent.moduleId].steps.length : (stryCov_9fa48("24835"), MODULE_CONTENT[activeContent.moduleId].steps?.length)) || 0)))))) && <button onClick={() => {
            setLearningPaths(stryMutAct_9fa48("24837") ? () => undefined : (stryCov_9fa48("24837"), paths => paths.map(stryMutAct_9fa48("24838") ? () => undefined : (stryCov_9fa48("24838"), p => (stryMutAct_9fa48("24841") ? p.id !== activeContent.pathId : stryMutAct_9fa48("24840") ? false : stryMutAct_9fa48("24839") ? true : (stryCov_9fa48("24839", "24840", "24841"), p.id === activeContent.pathId)) ? stryMutAct_9fa48("24842") ? {} : (stryCov_9fa48("24842"), {
              ...p,
              modules: p.modules.map(stryMutAct_9fa48("24843") ? () => undefined : (stryCov_9fa48("24843"), m => (stryMutAct_9fa48("24846") ? m.id !== activeContent.moduleId : stryMutAct_9fa48("24845") ? false : stryMutAct_9fa48("24844") ? true : (stryCov_9fa48("24844", "24845", "24846"), m.id === activeContent.moduleId)) ? stryMutAct_9fa48("24847") ? {} : (stryCov_9fa48("24847"), {
                ...m,
                completed: stryMutAct_9fa48("24848") ? false : (stryCov_9fa48("24848"), true)
              }) : m)),
              progress: Math.round(stryMutAct_9fa48("24849") ? p.modules.filter(m => m.completed || m.id === activeContent.moduleId).length / p.modules.length / 100 : (stryCov_9fa48("24849"), (stryMutAct_9fa48("24850") ? p.modules.filter(m => m.completed || m.id === activeContent.moduleId).length * p.modules.length : (stryCov_9fa48("24850"), (stryMutAct_9fa48("24851") ? p.modules.length : (stryCov_9fa48("24851"), p.modules.filter(stryMutAct_9fa48("24852") ? () => undefined : (stryCov_9fa48("24852"), m => stryMutAct_9fa48("24855") ? m.completed && m.id === activeContent.moduleId : stryMutAct_9fa48("24854") ? false : stryMutAct_9fa48("24853") ? true : (stryCov_9fa48("24853", "24854", "24855"), m.completed || (stryMutAct_9fa48("24857") ? m.id !== activeContent.moduleId : stryMutAct_9fa48("24856") ? false : (stryCov_9fa48("24856", "24857"), m.id === activeContent.moduleId))))).length)) / p.modules.length)) * 100))
            }) : p))));
            setSelectedPath(stryMutAct_9fa48("24858") ? () => undefined : (stryCov_9fa48("24858"), prev => prev ? stryMutAct_9fa48("24859") ? {} : (stryCov_9fa48("24859"), {
              ...prev,
              modules: prev.modules.map(stryMutAct_9fa48("24860") ? () => undefined : (stryCov_9fa48("24860"), m => (stryMutAct_9fa48("24863") ? m.id !== activeContent.moduleId : stryMutAct_9fa48("24862") ? false : stryMutAct_9fa48("24861") ? true : (stryCov_9fa48("24861", "24862", "24863"), m.id === activeContent.moduleId)) ? stryMutAct_9fa48("24864") ? {} : (stryCov_9fa48("24864"), {
                ...m,
                completed: stryMutAct_9fa48("24865") ? false : (stryCov_9fa48("24865"), true)
              }) : m)),
              progress: Math.round(stryMutAct_9fa48("24866") ? prev.modules.filter(m => m.completed || m.id === activeContent.moduleId).length / prev.modules.length / 100 : (stryCov_9fa48("24866"), (stryMutAct_9fa48("24867") ? prev.modules.filter(m => m.completed || m.id === activeContent.moduleId).length * prev.modules.length : (stryCov_9fa48("24867"), (stryMutAct_9fa48("24868") ? prev.modules.length : (stryCov_9fa48("24868"), prev.modules.filter(stryMutAct_9fa48("24869") ? () => undefined : (stryCov_9fa48("24869"), m => stryMutAct_9fa48("24872") ? m.completed && m.id === activeContent.moduleId : stryMutAct_9fa48("24871") ? false : stryMutAct_9fa48("24870") ? true : (stryCov_9fa48("24870", "24871", "24872"), m.completed || (stryMutAct_9fa48("24874") ? m.id !== activeContent.moduleId : stryMutAct_9fa48("24873") ? false : (stryCov_9fa48("24873", "24874"), m.id === activeContent.moduleId))))).length)) / prev.modules.length)) * 100))
            }) : null));
            setActiveContent(null);
          }} className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Complete Exercise
                </button>)}
            </div>
          </div>
        </div>)}
    </div>;
};
export default GnosisPage;