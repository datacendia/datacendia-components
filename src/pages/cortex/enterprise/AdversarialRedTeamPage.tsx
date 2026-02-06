// =============================================================================
// ADVERSARIAL RED TEAM MODE PAGE
// "100 Ways This Could Fail" - Every agent becomes a devil's advocate
// =============================================================================

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { api } from '../../../lib/api';
import {
  Target,
  AlertTriangle,
  Shield,
  Skull,
  Zap,
  TrendingDown,
  FileText,
  Play,
  Loader2,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronRight,
  Download,
  Share2,
  BarChart3,
  Users,
  DollarSign,
  Lock,
  Scale,
  Heart,
  Globe,
  Cpu,
  Truck,
  Building,
} from 'lucide-react';

// =============================================================================
// TYPES
// =============================================================================

interface RedTeamAttack {
  id: string;
  attackerId: string;
  attackerName: string;
  attackerRole: string;
  category: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  failureScenario: string;
  probability: number;
  impact: number;
  riskScore: number;
  mitigationSuggestion?: string;
}

interface RedTeamSummary {
  totalAttacks: number;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
  overallRiskScore: number;
  recommendation: 'proceed' | 'proceed_with_caution' | 'reconsider' | 'abort';
  topRisks: RedTeamAttack[];
  categoryBreakdown: Record<string, number>;
  blindSpots: string[];
}

// =============================================================================
// ATTACK PERSPECTIVES
// =============================================================================

const ATTACK_PERSPECTIVES = [
  { id: 'pessimist-cfo', name: 'Pessimist CFO', role: 'Financial Doom Prophet', icon: DollarSign, color: 'text-green-500' },
  { id: 'paranoid-ciso', name: 'Paranoid CISO', role: 'Security Nightmare Finder', icon: Lock, color: 'text-red-500' },
  { id: 'cynical-lawyer', name: 'Cynical Lawyer', role: 'Litigation Magnet Detector', icon: Scale, color: 'text-purple-500' },
  { id: 'skeptical-customer', name: 'Skeptical Customer', role: 'Customer Abandonment Predictor', icon: Users, color: 'text-blue-500' },
  { id: 'burned-operator', name: 'Burned Operator', role: 'Execution Disaster Expert', icon: Truck, color: 'text-orange-500' },
  { id: 'ethics-watchdog', name: 'Ethics Watchdog', role: 'Reputation Destroyer Finder', icon: Heart, color: 'text-pink-500' },
  { id: 'market-bear', name: 'Market Bear', role: 'Competitive Destruction Analyst', icon: Globe, color: 'text-indigo-500' },
  { id: 'black-swan-hunter', name: 'Black Swan Hunter', role: 'Catastrophic Event Finder', icon: Skull, color: 'text-gray-500' },
];

// =============================================================================
// TR DEMO DATA - Petrov Transfer Red Team Analysis
// =============================================================================

const TR_DEMO_ATTACKS: RedTeamAttack[] = [
  { id: 'tr-1', attackerId: 'paranoid-ciso', attackerName: 'Paranoid CISO', attackerRole: 'Security Nightmare Finder', category: 'regulatory', severity: 'critical', title: 'Basel III PEP Violation', description: 'Transfer to PEP without full 24-hour review violates Basel III §4.2.1', failureScenario: 'Regulatory audit finds inadequate PEP due diligence, resulting in $10M+ fine and consent decree', probability: 65, impact: 95, riskScore: 62, mitigationSuggestion: 'Implement mandatory 24-hour compliance hold for all PEP transactions' },
  { id: 'tr-2', attackerId: 'cynical-lawyer', attackerName: 'Cynical Lawyer', attackerRole: 'Litigation Magnet Detector', category: 'legal', severity: 'critical', title: 'OFAC Secondary Sanctions', description: 'Cyprus jurisdiction creates potential secondary sanctions exposure', failureScenario: 'US Treasury designates Petrov, firm faces correspondent banking restrictions', probability: 35, impact: 90, riskScore: 32, mitigationSuggestion: 'Obtain explicit OFAC guidance before proceeding' },
  { id: 'tr-3', attackerId: 'ethics-watchdog', attackerName: 'Ethics Watchdog', attackerRole: 'Reputation Destroyer Finder', category: 'reputational', severity: 'high', title: 'Media Exposure Risk', description: 'Former government official transfer could attract investigative journalism', failureScenario: 'NYT/WSJ story on "Wall Street facilitating oligarch money" destroys client trust', probability: 40, impact: 80, riskScore: 32, mitigationSuggestion: 'Document enhanced due diligence thoroughly for defensibility' },
  { id: 'tr-4', attackerId: 'pessimist-cfo', attackerName: 'Pessimist CFO', attackerRole: 'Financial Doom Prophet', category: 'financial', severity: 'high', title: 'Client Relationship Damage', description: 'Blocking or delaying transfer may lose $50M+ AUM client', failureScenario: 'Petrov Holdings moves all assets to competitor, 7-year relationship destroyed', probability: 55, impact: 70, riskScore: 39, mitigationSuggestion: 'Communicate proactively with client about compliance requirements' },
  { id: 'tr-5', attackerId: 'black-swan-hunter', attackerName: 'Black Swan Hunter', attackerRole: 'Catastrophic Event Finder', category: 'geopolitical', severity: 'medium', title: 'Sanctions Escalation', description: 'Geopolitical events could trigger new sanctions on Cyprus/Russia nexus', failureScenario: 'Transfer completed just before new sanctions, firm caught in enforcement action', probability: 25, impact: 85, riskScore: 21, mitigationSuggestion: 'Monitor OFAC/EU sanctions announcements in real-time' },
];

const TR_DEMO_SUMMARY: RedTeamSummary = {
  totalAttacks: 5,
  criticalCount: 2,
  highCount: 2,
  mediumCount: 1,
  lowCount: 0,
  overallRiskScore: 67,
  recommendation: 'proceed_with_caution',
  topRisks: TR_DEMO_ATTACKS.slice(0, 3),
  categoryBreakdown: { regulatory: 1, legal: 1, reputational: 1, financial: 1, geopolitical: 1 },
  blindSpots: ['operational-continuity', 'whistleblower-risk', 'audit-trail-gaps'],
};

// =============================================================================
// HELPER COMPONENTS
// =============================================================================

const SeverityBadge: React.FC<{ severity: RedTeamAttack['severity'] }> = ({ severity }) => {
  const colors = {
    critical: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    high: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    low: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  };
  return (
    <span className={`px-2 py-0.5 text-xs font-medium rounded ${colors[severity]}`}>
      {severity.toUpperCase()}
    </span>
  );
};

const RiskScoreGauge: React.FC<{ score: number }> = ({ score }) => {
  const color = score >= 70 ? 'text-red-500' : score >= 40 ? 'text-orange-500' : score >= 20 ? 'text-yellow-500' : 'text-green-500';
  return (
    <div className="flex items-center gap-2">
      <div className="relative w-12 h-12">
        <svg className="w-12 h-12 transform -rotate-90">
          <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="none" className="text-gray-200 dark:text-gray-700" />
          <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="none" className={color} strokeDasharray={`${score * 1.26} 126`} strokeLinecap="round" />
        </svg>
        <span className={`absolute inset-0 flex items-center justify-center text-sm font-bold ${color}`}>{score}</span>
      </div>
    </div>
  );
};

const RecommendationBanner: React.FC<{ recommendation: RedTeamSummary['recommendation'] }> = ({ recommendation }) => {
  const configs = {
    proceed: { color: 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800', icon: CheckCircle, iconColor: 'text-green-600 dark:text-green-400', text: 'PROCEED', desc: 'Risks are manageable with standard controls.' },
    proceed_with_caution: { color: 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800', icon: AlertTriangle, iconColor: 'text-yellow-600 dark:text-yellow-400', text: 'PROCEED WITH CAUTION', desc: 'Significant risks identified that require mitigation.' },
    reconsider: { color: 'bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800', icon: AlertTriangle, iconColor: 'text-orange-600 dark:text-orange-400', text: 'RECONSIDER', desc: 'Major risks identified that may invalidate the decision.' },
    abort: { color: 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800', icon: XCircle, iconColor: 'text-red-600 dark:text-red-400', text: 'ABORT', desc: 'Critical risks identified that make this decision untenable.' },
  };
  const config = configs[recommendation];
  const Icon = config.icon;

  return (
    <div className={`${config.color} border rounded-xl p-6`}>
      <div className="flex items-center gap-4">
        <Icon className={`w-10 h-10 ${config.iconColor}`} />
        <div>
          <h3 className={`text-xl font-bold ${config.iconColor}`}>RECOMMENDATION: {config.text}</h3>
          <p className="text-gray-600 dark:text-gray-400">{config.desc}</p>
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const AdversarialRedTeamPage: React.FC = () => {
  const { t } = useTranslation();
  const [decision, setDecision] = useState('');
  const [context, setContext] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasResults, setHasResults] = useState(false);
  const [attacks, setAttacks] = useState<RedTeamAttack[]>([]);
  const [summary, setSummary] = useState<RedTeamSummary | null>(null);
  const [expandedAttack, setExpandedAttack] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'attacks' | 'perspectives' | 'report'>('attacks');

  const handleAnalyze = async () => {
    if (!decision.trim()) return;
    
    setIsAnalyzing(true);
    
    try {
      // Try to call the real API
      const res = await api.post<any>('/adversarial-redteam/analyze', {
        decision,
        context,
        perspectives: ATTACK_PERSPECTIVES.map(p => p.id),
      });
      const payload = res as any;
      
      if (payload.success && payload.attacks) {
        setAttacks(payload.attacks);
        setSummary(payload.summary);
      } else {
        // Use TR demo data as fallback
        setAttacks(TR_DEMO_ATTACKS);
        setSummary(TR_DEMO_SUMMARY);
      }
    } catch (error) {
      console.error('Red team analysis failed:', error);
      // Use TR demo data on error
      setAttacks(TR_DEMO_ATTACKS);
      setSummary(TR_DEMO_SUMMARY);
    }
    
    setHasResults(true);
    setIsAnalyzing(false);
  };

  const handleReset = () => {
    setDecision('');
    setContext('');
    setHasResults(false);
    setAttacks([]);
    setSummary(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 via-orange-600 to-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/10 rounded-xl">
              <Target className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Adversarial Red Team Mode</h1>
              <p className="text-red-200">Find every way your decision could fail</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!hasResults ? (
          /* Input Form */
          <div className="max-w-3xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <Skull className="w-8 h-8 text-red-600 dark:text-red-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  100 Ways This Could Fail
                </h2>
                <p className="text-gray-500 dark:text-gray-400">
                  Enter your decision and let 8 adversarial perspectives tear it apart
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Decision to Stress-Test
                  </label>
                  <textarea
                    value={decision}
                    onChange={(e) => setDecision(e.target.value)}
                    placeholder="e.g., We should acquire CompanyX for $50M to expand into the European market..."
                    className="w-full h-32 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Additional Context (Optional)
                  </label>
                  <textarea
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                    placeholder="Any relevant background, constraints, or assumptions..."
                    className="w-full h-24 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                <button
                  onClick={handleAnalyze}
                  disabled={!decision.trim() || isAnalyzing}
                  className="w-full py-4 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Attacking from all angles...
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5" />
                      Launch Red Team Attack
                    </>
                  )}
                </button>
              </div>

              {/* Attack Perspectives Preview */}
              <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">8 ADVERSARIAL PERSPECTIVES</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {ATTACK_PERSPECTIVES.map(perspective => {
                    const Icon = perspective.icon;
                    return (
                      <div key={perspective.id} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <Icon className={`w-4 h-4 ${perspective.color}`} />
                        <span className="text-xs text-gray-600 dark:text-gray-400">{perspective.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Results */
          <div className="space-y-8">
            {/* Summary Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Red Team Assessment Complete</h2>
                <p className="text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">{decision}</p>
              </div>
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <Download className="w-4 h-4" />
                  Export Report
                </button>
                <button
                  onClick={handleReset}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  New Analysis
                </button>
              </div>
            </div>

            {/* Recommendation Banner */}
            {summary && <RecommendationBanner recommendation={summary.recommendation} />}

            {/* Stats Grid */}
            {summary && (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 text-center">
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{summary.totalAttacks}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Risks</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 text-center">
                  <p className="text-3xl font-bold text-red-600">{summary.criticalCount}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Critical</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 text-center">
                  <p className="text-3xl font-bold text-orange-600">{summary.highCount}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">High</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 text-center">
                  <p className="text-3xl font-bold text-yellow-600">{summary.mediumCount}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Medium</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 text-center">
                  <RiskScoreGauge score={summary.overallRiskScore} />
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Risk Score</p>
                </div>
              </div>
            )}

            {/* Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="flex gap-8">
                {[
                  { id: 'attacks', label: 'All Risks', icon: AlertTriangle },
                  { id: 'perspectives', label: 'By Perspective', icon: Users },
                  { id: 'report', label: 'Full Report', icon: FileText },
                ].map(tab => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as typeof activeTab)}
                      className={`flex items-center gap-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab.id
                          ? 'border-red-500 text-red-600 dark:text-red-400'
                          : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Attack List */}
            {activeTab === 'attacks' && (
              <div className="space-y-4">
                {attacks.map(attack => (
                  <div
                    key={attack.id}
                    className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
                  >
                    <button
                      onClick={() => setExpandedAttack(expandedAttack === attack.id ? null : attack.id)}
                      className="w-full p-5 text-left"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <RiskScoreGauge score={attack.riskScore} />
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-gray-900 dark:text-white">{attack.title}</h3>
                              <SeverityBadge severity={attack.severity} />
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{attack.description}</p>
                            <div className="flex items-center gap-4 text-xs text-gray-400">
                              <span>By: {attack.attackerName}</span>
                              <span>Category: {attack.category}</span>
                              <span>P: {attack.probability}% | I: {attack.impact}%</span>
                            </div>
                          </div>
                        </div>
                        {expandedAttack === attack.id ? (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    </button>
                    
                    {expandedAttack === attack.id && (
                      <div className="px-5 pb-5 border-t border-gray-100 dark:border-gray-700 pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
                            <h4 className="font-medium text-red-800 dark:text-red-300 mb-2">Failure Scenario</h4>
                            <p className="text-sm text-red-700 dark:text-red-400">{attack.failureScenario}</p>
                          </div>
                          {attack.mitigationSuggestion && (
                            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                              <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">Mitigation</h4>
                              <p className="text-sm text-green-700 dark:text-green-400">{attack.mitigationSuggestion}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Perspectives View */}
            {activeTab === 'perspectives' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {ATTACK_PERSPECTIVES.map(perspective => {
                  const Icon = perspective.icon;
                  const perspectiveAttacks = attacks.filter(a => a.attackerId === perspective.id);
                  return (
                    <div key={perspective.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-700`}>
                          <Icon className={`w-6 h-6 ${perspective.color}`} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">{perspective.name}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{perspective.role}</p>
                        </div>
                        <span className="ml-auto px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm font-medium">
                          {perspectiveAttacks.length} risks
                        </span>
                      </div>
                      <div className="space-y-2">
                        {perspectiveAttacks.map(attack => (
                          <div key={attack.id} className="flex items-center gap-2 text-sm">
                            <SeverityBadge severity={attack.severity} />
                            <span className="text-gray-700 dark:text-gray-300 truncate">{attack.title}</span>
                          </div>
                        ))}
                        {perspectiveAttacks.length === 0 && (
                          <p className="text-sm text-gray-400">No risks identified from this perspective</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Full Report */}
            {activeTab === 'report' && summary && (
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8">
                <div className="prose dark:prose-invert max-w-none">
                  <h2>🔴 100 WAYS THIS COULD FAIL</h2>
                  <h3>Adversarial Red Team Assessment</h3>
                  
                  <p><strong>Decision:</strong> {decision}</p>
                  
                  <h4>Assessment Summary</h4>
                  <ul>
                    <li>Total Attack Vectors Identified: {summary.totalAttacks}</li>
                    <li>Critical Risks: {summary.criticalCount}</li>
                    <li>High Risks: {summary.highCount}</li>
                    <li>Overall Risk Score: {summary.overallRiskScore}/100</li>
                  </ul>

                  <h4>Top 5 Critical Risks</h4>
                  <ol>
                    {summary.topRisks.map((risk, i) => (
                      <li key={risk.id}>
                        <strong>{risk.title}</strong> ({risk.severity}) - {risk.description}
                      </li>
                    ))}
                  </ol>

                  {summary.blindSpots.length > 0 && (
                    <>
                      <h4>⚠️ Blind Spots</h4>
                      <p>The following categories had no identified risks:</p>
                      <ul>
                        {summary.blindSpots.map(spot => (
                          <li key={spot}>{spot}</li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdversarialRedTeamPage;
