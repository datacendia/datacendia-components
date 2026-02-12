// =============================================================================
// DCII DASHBOARD™ — DECISION CRISIS IMMUNIZATION INFRASTRUCTURE
// The command center for institutional crisis resilience.
// Visualizes IISS scores, 9 primitives, and all gap-closing modules.
// =============================================================================

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  Activity,
  Globe,
  Clock,
  Search,
  FileCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  TrendingUp,
  TrendingDown,
  Minus,
  Lock,
  Fingerprint,
  Eye,
  Brain,
  Scale,
  Building2,
  BarChart3,
  RefreshCw,
  ChevronRight,
  ChevronDown,
  Award,
  Zap,
  Database,
  FileText,
  Camera,
  Link2,
  Timer,
  GitBranch,
  Layers,
  Target,
  ArrowUpRight,
  Info,
} from 'lucide-react';
import { cn } from '../../../../lib/utils';

// =============================================================================
// API
// =============================================================================

const API_BASE = '/api/v1/dcii';

async function dciiApi(path: string, options?: RequestInit) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error?.message || 'API error');
  return data.data;
}

// =============================================================================
// TYPES
// =============================================================================

type TabId = 'overview' | 'iiss' | 'media' | 'jurisdiction' | 'timestamps' | 'similarity';

interface IISSScore {
  id: string;
  organizationId: string;
  organizationName: string;
  overallScore: number;
  band: string;
  certificationLevel: string;
  dimensions: any[];
  calculatedAt: string;
  trend: string;
  changeFromPrevious: number;
  percentile: number;
  recommendations: any[];
  insuranceImpact: any;
  regulatoryReadiness: any;
}

// =============================================================================
// CONSTANTS
// =============================================================================

const BAND_COLORS: Record<string, { bg: string; text: string; border: string; glow: string }> = {
  critical: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30', glow: 'shadow-red-500/20' },
  vulnerable: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30', glow: 'shadow-amber-500/20' },
  developing: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30', glow: 'shadow-blue-500/20' },
  resilient: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30', glow: 'shadow-emerald-500/20' },
  exceptional: { bg: 'bg-violet-500/10', text: 'text-violet-400', border: 'border-violet-500/30', glow: 'shadow-violet-500/20' },
};

const TABS: { id: TabId; label: string; icon: React.ReactNode; description: string }[] = [
  { id: 'overview', label: 'Overview', icon: <Shield className="w-4 h-4" />, description: 'DCII status & primitives' },
  { id: 'iiss', label: 'IISS Score', icon: <Award className="w-4 h-4" />, description: 'Institutional Immune System Score' },
  { id: 'media', label: 'Media Auth', icon: <Camera className="w-4 h-4" />, description: 'Synthetic media authentication' },
  { id: 'jurisdiction', label: 'Jurisdictions', icon: <Globe className="w-4 h-4" />, description: 'Cross-jurisdiction conflicts' },
  { id: 'timestamps', label: 'Timestamps', icon: <Timer className="w-4 h-4" />, description: 'RFC 3161 timestamp authority' },
  { id: 'similarity', label: 'Similarity', icon: <GitBranch className="w-4 h-4" />, description: 'Decision similarity engine' },
];

const PRIMITIVES = [
  { name: 'Discovery-Time Proof', icon: Clock, status: 'implemented', score: 75, description: 'Cryptographic timestamps proving when knowledge became actionable' },
  { name: 'Deliberation Capture', icon: Brain, status: 'implemented', score: 90, description: 'Multi-agent, multi-perspective decision process recording' },
  { name: 'Override Accountability', icon: ShieldAlert, status: 'implemented', score: 80, description: 'Non-suppressible tracking of recommendation overrides' },
  { name: 'Continuity Memory', icon: Database, status: 'implemented', score: 70, description: 'Personnel-independent institutional knowledge preservation' },
  { name: 'Drift Detection', icon: Activity, status: 'implemented', score: 70, description: 'Continuous compliance degradation monitoring' },
  { name: 'Cognitive Bias Mitigation', icon: Brain, status: 'implemented', score: 75, description: 'Adversarial challenge of assumptions and rubber-stamp detection' },
  { name: 'Quantum-Resistant Integrity', icon: Lock, status: 'partial', score: 40, description: 'Post-quantum cryptographic protection of evidence' },
  { name: 'Synthetic Media Auth', icon: Camera, status: 'implemented', score: 65, description: 'Content provenance signing and deepfake detection' },
  { name: 'Cross-Jurisdiction Compliance', icon: Globe, status: 'implemented', score: 60, description: 'Multi-jurisdiction conflict detection and resolution' },
];

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function DCIIDashboardPage() {
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [loading, setLoading] = useState(true);
  const [iissScores, setIissScores] = useState<IISSScore[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<string>('org-datacendia');
  const [mediaAssets, setMediaAssets] = useState<any[]>([]);
  const [conflicts, setConflicts] = useState<any[]>([]);
  const [timestamps, setTimestamps] = useState<any[]>([]);
  const [decisions, setDecisions] = useState<any[]>([]);
  const [tsaStats, setTsaStats] = useState<any>(null);
  const [benchmarks, setBenchmarks] = useState<any[]>([]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [scoresData, mediaData, conflictsData, tsData, decisionsData, statsData, benchData] = await Promise.all([
        dciiApi('/iiss/scores').catch(() => []),
        dciiApi('/media/assets').catch(() => []),
        dciiApi('/jurisdiction/conflicts').catch(() => []),
        dciiApi('/timestamp/tokens').catch(() => []),
        dciiApi('/similarity/decisions').catch(() => []),
        dciiApi('/timestamp/stats').catch(() => null),
        dciiApi('/iiss/benchmarks').catch(() => []),
      ]);
      setIissScores(scoresData);
      setMediaAssets(mediaData);
      setConflicts(conflictsData);
      setTimestamps(tsData);
      setDecisions(decisionsData);
      setTsaStats(statsData);
      setBenchmarks(benchData);
    } catch (err) {
      console.error('DCII data fetch failed:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const currentScore = iissScores.find(s => s.organizationId === selectedOrg);
  const bandStyle = currentScore ? BAND_COLORS[currentScore.band] || BAND_COLORS.developing : BAND_COLORS.developing;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="max-w-[1800px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Decision Crisis Immunization Infrastructure™</h1>
                <p className="text-sm text-slate-400">9 primitives · IISS scoring · category-defining governance infrastructure</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {currentScore && (
                <div className={cn('px-4 py-2 rounded-lg border flex items-center gap-2', bandStyle.bg, bandStyle.border)}>
                  <Award className={cn('w-5 h-5', bandStyle.text)} />
                  <span className={cn('text-lg font-bold', bandStyle.text)}>{currentScore.overallScore}</span>
                  <span className="text-xs text-slate-400">IISS</span>
                </div>
              )}
              <button onClick={fetchData} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                <RefreshCw className={cn('w-4 h-4', loading && 'animate-spin')} />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-4 overflow-x-auto pb-1">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap',
                  activeTab === tab.id
                    ? 'bg-white/10 text-white shadow-lg'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                )}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1800px] mx-auto px-6 py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'overview' && <OverviewTab primitives={PRIMITIVES} currentScore={currentScore} bandStyle={bandStyle} conflicts={conflicts} timestamps={timestamps} mediaAssets={mediaAssets} decisions={decisions} />}
            {activeTab === 'iiss' && <IISSTab scores={iissScores} currentScore={currentScore} benchmarks={benchmarks} bandStyle={bandStyle} selectedOrg={selectedOrg} setSelectedOrg={setSelectedOrg} />}
            {activeTab === 'media' && <MediaAuthTab assets={mediaAssets} />}
            {activeTab === 'jurisdiction' && <JurisdictionTab conflicts={conflicts} />}
            {activeTab === 'timestamps' && <TimestampTab tokens={timestamps} stats={tsaStats} />}
            {activeTab === 'similarity' && <SimilarityTab decisions={decisions} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// =============================================================================
// OVERVIEW TAB
// =============================================================================

function OverviewTab({ primitives, currentScore, bandStyle, conflicts, timestamps, mediaAssets, decisions }: any) {
  return (
    <div className="space-y-6">
      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard icon={<Award className="w-5 h-5 text-violet-400" />} label="IISS Score" value={currentScore?.overallScore || '—'} sub={currentScore?.band || 'No data'} color="violet" />
        <StatCard icon={<Globe className="w-5 h-5 text-amber-400" />} label="Regulatory Conflicts" value={conflicts.length} sub="Active conflicts" color="amber" />
        <StatCard icon={<Timer className="w-5 h-5 text-blue-400" />} label="Timestamp Tokens" value={timestamps.length} sub="RFC 3161 issued" color="blue" />
        <StatCard icon={<Camera className="w-5 h-5 text-emerald-400" />} label="Media Assets" value={mediaAssets.length} sub="Authenticated" color="emerald" />
        <StatCard icon={<GitBranch className="w-5 h-5 text-pink-400" />} label="Decision Records" value={decisions.length} sub="Similarity indexed" color="pink" />
      </div>

      {/* Primitives Grid */}
      <div>
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Layers className="w-5 h-5 text-violet-400" />
          9 DCII Primitives
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {primitives.map((p: any, i: number) => (
            <PrimitiveCard key={i} primitive={p} index={i} />
          ))}
        </div>
      </div>

      {/* IISS Score Visual */}
      {currentScore && (
        <div className={cn('rounded-xl border p-6', bandStyle.bg, bandStyle.border)}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold">Institutional Immune System Score™</h3>
              <p className="text-sm text-slate-400">{currentScore.organizationName}</p>
            </div>
            <div className="text-right">
              <div className={cn('text-4xl font-black', bandStyle.text)}>{currentScore.overallScore}</div>
              <div className="text-xs text-slate-400">/ 1000</div>
            </div>
          </div>
          <div className="w-full bg-black/30 rounded-full h-3 mb-3">
            <div
              className={cn('h-3 rounded-full transition-all duration-1000', {
                'bg-red-500': currentScore.band === 'critical',
                'bg-amber-500': currentScore.band === 'vulnerable',
                'bg-blue-500': currentScore.band === 'developing',
                'bg-emerald-500': currentScore.band === 'resilient',
                'bg-violet-500': currentScore.band === 'exceptional',
              })}
              style={{ width: `${(currentScore.overallScore / 1000) * 100}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-slate-500">
            <span>0 Critical</span>
            <span>200</span>
            <span>400</span>
            <span>600</span>
            <span>800</span>
            <span>1000 Exceptional</span>
          </div>

          {/* Dimensions */}
          {currentScore.dimensions && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-5 gap-3">
              {currentScore.dimensions.map((dim: any) => (
                <div key={dim.id} className="bg-black/20 rounded-lg p-3">
                  <div className="text-xs text-slate-400 mb-1">{dim.name}</div>
                  <div className="text-lg font-bold">{dim.normalizedScore}</div>
                  <div className="w-full bg-black/30 rounded-full h-1.5 mt-1">
                    <div className="h-1.5 rounded-full bg-violet-500" style={{ width: `${(dim.normalizedScore / 1000) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Quick Insights */}
      {currentScore?.recommendations && currentScore.recommendations.length > 0 && (
        <div className="rounded-xl border border-white/10 bg-white/5 p-5">
          <h3 className="text-md font-semibold mb-3 flex items-center gap-2">
            <Target className="w-4 h-4 text-amber-400" />
            Top Recommendations
          </h3>
          <div className="space-y-2">
            {currentScore.recommendations.slice(0, 5).map((rec: any) => (
              <div key={rec.id} className="flex items-start gap-3 text-sm">
                <span className={cn('px-1.5 py-0.5 rounded text-xs font-medium', {
                  'bg-red-500/20 text-red-400': rec.priority === 'critical',
                  'bg-amber-500/20 text-amber-400': rec.priority === 'high',
                  'bg-blue-500/20 text-blue-400': rec.priority === 'medium',
                  'bg-slate-500/20 text-slate-400': rec.priority === 'low',
                })}>{rec.priority}</span>
                <div>
                  <span className="font-medium">{rec.title}</span>
                  <span className="text-slate-400 ml-2">+{rec.estimatedImpact} pts</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// =============================================================================
// IISS TAB
// =============================================================================

function IISSTab({ scores, currentScore, benchmarks, bandStyle, selectedOrg, setSelectedOrg }: any) {
  const [expandedDim, setExpandedDim] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* Org Selector */}
      <div className="flex items-center gap-4">
        <select
          value={selectedOrg}
          onChange={e => setSelectedOrg(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm"
        >
          {scores.map((s: any) => (
            <option key={s.organizationId} value={s.organizationId}>{s.organizationName}</option>
          ))}
        </select>
        <span className="text-sm text-slate-400">
          {currentScore && `Last assessed: ${new Date(currentScore.calculatedAt).toLocaleString()}`}
        </span>
      </div>

      {/* Score Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {scores.map((score: any) => (
          <div
            key={score.id}
            onClick={() => setSelectedOrg(score.organizationId)}
            className={cn(
              'rounded-xl border p-5 cursor-pointer transition-all',
              score.organizationId === selectedOrg ? 'border-violet-500/50 bg-violet-500/5 ring-1 ring-violet-500/20' : 'border-white/10 bg-white/5 hover:bg-white/8'
            )}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="font-semibold">{score.organizationName}</div>
              <span className={cn('px-2 py-0.5 rounded text-xs font-bold uppercase', BAND_COLORS[score.band]?.bg, BAND_COLORS[score.band]?.text)}>
                {score.band}
              </span>
            </div>
            <div className="text-3xl font-black mb-2">{score.overallScore}</div>
            <div className="flex items-center gap-2 text-sm">
              {score.trend === 'improving' && <TrendingUp className="w-4 h-4 text-emerald-400" />}
              {score.trend === 'declining' && <TrendingDown className="w-4 h-4 text-red-400" />}
              {score.trend === 'stable' && <Minus className="w-4 h-4 text-slate-400" />}
              <span className={cn({
                'text-emerald-400': score.changeFromPrevious > 0,
                'text-red-400': score.changeFromPrevious < 0,
                'text-slate-400': score.changeFromPrevious === 0,
              })}>
                {score.changeFromPrevious > 0 ? '+' : ''}{score.changeFromPrevious}
              </span>
              <span className="text-slate-500">· Percentile: {score.percentile}th</span>
            </div>
            <div className="text-xs text-slate-500 mt-1">Certification: {score.certificationLevel}</div>
          </div>
        ))}
      </div>

      {/* Dimension Detail */}
      {currentScore?.dimensions && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-violet-400" />
            Dimension Breakdown
          </h3>
          {currentScore.dimensions.map((dim: any) => (
            <div key={dim.id} className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
              <button
                onClick={() => setExpandedDim(expandedDim === dim.id ? null : dim.id)}
                className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center">
                    <span className="text-lg font-bold text-violet-400">{dim.normalizedScore}</span>
                  </div>
                  <div className="text-left">
                    <div className="font-medium">{dim.name}</div>
                    <div className="text-xs text-slate-400">{dim.description}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-black/30 rounded-full h-2">
                    <div className="h-2 rounded-full bg-violet-500" style={{ width: `${(dim.normalizedScore / 1000) * 100}%` }} />
                  </div>
                  <span className="text-sm text-slate-400">{dim.controls.length} controls</span>
                  <ChevronDown className={cn('w-4 h-4 transition-transform', expandedDim === dim.id && 'rotate-180')} />
                </div>
              </button>
              <AnimatePresence>
                {expandedDim === dim.id && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 space-y-2">
                      {dim.controls.map((ctrl: any) => (
                        <div key={ctrl.id} className="flex items-center justify-between p-2 rounded-lg bg-black/20">
                          <div className="flex items-center gap-2">
                            {ctrl.status === 'implemented' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                            {ctrl.status === 'partial' && <AlertTriangle className="w-4 h-4 text-amber-400" />}
                            {ctrl.status === 'not_implemented' && <XCircle className="w-4 h-4 text-red-400" />}
                            <span className="text-sm">{ctrl.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-mono">{ctrl.score}/{ctrl.maxScore}</span>
                            <div className="w-16 bg-black/30 rounded-full h-1.5">
                              <div className={cn('h-1.5 rounded-full', {
                                'bg-emerald-500': ctrl.status === 'implemented',
                                'bg-amber-500': ctrl.status === 'partial',
                                'bg-red-500': ctrl.status === 'not_implemented',
                              })} style={{ width: `${(ctrl.score / ctrl.maxScore) * 100}%` }} />
                            </div>
                          </div>
                        </div>
                      ))}
                      {dim.findings.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-white/5">
                          <div className="text-xs font-medium text-amber-400 mb-1">Findings ({dim.findings.length})</div>
                          {dim.findings.slice(0, 3).map((f: any) => (
                            <div key={f.id} className="text-xs text-slate-400 flex items-start gap-1 mb-1">
                              <AlertTriangle className="w-3 h-3 text-amber-400 mt-0.5 shrink-0" />
                              {f.title}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      )}

      {/* Insurance Impact */}
      {currentScore?.insuranceImpact && (
        <div className="rounded-xl border border-white/10 bg-white/5 p-5">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            Insurance Impact
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-xs text-slate-400">Discount Tier</div>
              <div className="text-lg font-bold text-emerald-400">{currentScore.insuranceImpact.discountTier}</div>
            </div>
            <div>
              <div className="text-xs text-slate-400">Projected Savings</div>
              <div className="text-lg font-bold">${(currentScore.insuranceImpact.projectedSavings || 0).toLocaleString()}</div>
            </div>
            <div>
              <div className="text-xs text-slate-400">Savings %</div>
              <div className="text-lg font-bold">{currentScore.insuranceImpact.savingsPercentage}%</div>
            </div>
            <div>
              <div className="text-xs text-slate-400">Qualifies</div>
              <div className="text-lg font-bold">{currentScore.insuranceImpact.qualifiesForDiscount ? '✓ Yes' : '✗ No'}</div>
            </div>
          </div>
        </div>
      )}

      {/* Industry Benchmarks */}
      {benchmarks.length > 0 && (
        <div className="rounded-xl border border-white/10 bg-white/5 p-5">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-400" />
            Industry Benchmarks
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {benchmarks.map((b: any) => (
              <div key={b.industry} className="bg-black/20 rounded-lg p-3">
                <div className="text-xs text-slate-400 mb-1">{b.industry}</div>
                <div className="text-lg font-bold">{b.averageScore}</div>
                <div className="text-xs text-slate-500">Top quartile: {b.topQuartile}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Regulatory Readiness */}
      {currentScore?.regulatoryReadiness && (
        <div className="rounded-xl border border-white/10 bg-white/5 p-5">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Scale className="w-5 h-5 text-amber-400" />
            Regulatory Readiness
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(currentScore.regulatoryReadiness)
              .filter(([k]) => k !== 'overallReadiness')
              .map(([key, val]: [string, any]) => (
                <div key={key} className="bg-black/20 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-slate-400 uppercase">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                    {val.ready ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-red-400" />}
                  </div>
                  <div className="text-lg font-bold">{val.score}</div>
                  {val.gaps.length > 0 && (
                    <div className="text-xs text-amber-400 mt-1">{val.gaps.length} gap{val.gaps.length > 1 ? 's' : ''}</div>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

// =============================================================================
// MEDIA AUTH TAB
// =============================================================================

function MediaAuthTab({ assets }: { assets: any[] }) {
  const [analyzing, setAnalyzing] = useState<string | null>(null);

  const handleAnalyze = async (assetId: string) => {
    setAnalyzing(assetId);
    try {
      await dciiApi(`/media/analyze/${assetId}`, { method: 'POST' });
    } catch (err) {
      console.error('Analysis failed:', err);
    } finally {
      setAnalyzing(null);
    }
  };

  const verdictColors: Record<string, string> = {
    authentic: 'text-emerald-400 bg-emerald-500/10',
    likely_authentic: 'text-emerald-300 bg-emerald-500/10',
    inconclusive: 'text-amber-400 bg-amber-500/10',
    likely_synthetic: 'text-orange-400 bg-orange-500/10',
    synthetic: 'text-red-400 bg-red-500/10',
    tampered: 'text-red-400 bg-red-500/10',
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Camera className="w-5 h-5 text-emerald-400" />
          Synthetic Media Authentication
        </h2>
        <span className="text-sm text-slate-400">{assets.length} assets tracked</span>
      </div>

      <div className="grid gap-3">
        {assets.map((asset: any) => (
          <div key={asset.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center">
                  {asset.mediaType === 'video' && <Camera className="w-5 h-5 text-blue-400" />}
                  {asset.mediaType === 'audio' && <Activity className="w-5 h-5 text-purple-400" />}
                  {asset.mediaType === 'image' && <Eye className="w-5 h-5 text-emerald-400" />}
                  {asset.mediaType === 'document' && <FileText className="w-5 h-5 text-amber-400" />}
                  {asset.mediaType === 'screenshot' && <Eye className="w-5 h-5 text-cyan-400" />}
                </div>
                <div>
                  <div className="font-medium">{asset.fileName}</div>
                  <div className="text-xs text-slate-400">
                    {asset.mediaType} · {asset.hashAlgorithm} · {asset.chainOfCustody?.length || 0} custody entries
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {asset.authenticity ? (
                  <span className={cn('px-2 py-1 rounded text-xs font-medium', verdictColors[asset.authenticity.verdict] || '')}>
                    {asset.authenticity.verdict.replace(/_/g, ' ')} ({asset.authenticity.confidenceScore}%)
                  </span>
                ) : (
                  <span className="text-xs text-slate-500">Not analyzed</span>
                )}
                <div className="flex items-center gap-1">
                  {asset.provenance?.c2paManifest && <span title="C2PA Signed"><Fingerprint className="w-4 h-4 text-violet-400" /></span>}
                  <span title="Chain of custody"><Link2 className="w-4 h-4 text-blue-400" /></span>
                </div>
              </div>
            </div>
            {asset.authenticity?.analyses && (
              <div className="mt-3 grid grid-cols-3 md:grid-cols-7 gap-2">
                {asset.authenticity.analyses.map((a: any, i: number) => (
                  <div key={i} className="bg-black/20 rounded p-2 text-center">
                    <div className="text-xs text-slate-400">{a.name.split(' ')[0]}</div>
                    <div className="text-sm font-bold">{a.score}/{a.maxScore}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// =============================================================================
// JURISDICTION TAB
// =============================================================================

function JurisdictionTab({ conflicts }: { conflicts: any[] }) {
  const severityColors: Record<string, string> = {
    irreconcilable: 'text-red-400 bg-red-500/10 border-red-500/30',
    significant: 'text-orange-400 bg-orange-500/10 border-orange-500/30',
    moderate: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    minor: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
    theoretical: 'text-slate-400 bg-slate-500/10 border-slate-500/30',
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Globe className="w-5 h-5 text-amber-400" />
          Cross-Jurisdiction Regulatory Conflicts
        </h2>
        <span className="text-sm text-slate-400">{conflicts.length} conflicts detected</span>
      </div>

      <div className="grid gap-3">
        {conflicts.map((conflict: any) => (
          <div key={conflict.id} className={cn('rounded-xl border p-4', severityColors[conflict.severity])}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-xs font-bold uppercase bg-black/20">
                  {conflict.severity}
                </span>
                <span className="text-sm font-medium">{conflict.conflictType.replace(/_/g, ' ')}</span>
              </div>
              <span className={cn('px-2 py-0.5 rounded text-xs', {
                'bg-yellow-500/20 text-yellow-400': conflict.status === 'detected',
                'bg-blue-500/20 text-blue-400': conflict.status === 'analyzing',
                'bg-emerald-500/20 text-emerald-400': conflict.status === 'resolved',
              })}>
                {conflict.status}
              </span>
            </div>
            <div className="grid md:grid-cols-2 gap-4 mb-3">
              <div className="bg-black/20 rounded-lg p-3">
                <div className="text-xs text-slate-400 mb-1">{conflict.jurisdictionA} · {conflict.frameworkA}</div>
                <div className="text-sm">{conflict.requirementA}</div>
                <div className="text-xs text-slate-500 mt-1">{conflict.articleA}</div>
              </div>
              <div className="bg-black/20 rounded-lg p-3">
                <div className="text-xs text-slate-400 mb-1">{conflict.jurisdictionB} · {conflict.frameworkB}</div>
                <div className="text-sm">{conflict.requirementB}</div>
                <div className="text-xs text-slate-500 mt-1">{conflict.articleB}</div>
              </div>
            </div>
            <p className="text-sm text-slate-300 mb-2">{conflict.description}</p>
            {conflict.resolutionStrategies && (
              <div className="flex flex-wrap gap-2">
                {conflict.resolutionStrategies.map((r: any) => (
                  <span key={r.id} className="px-2 py-0.5 rounded text-xs bg-white/5 text-slate-400">
                    {r.strategy.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// =============================================================================
// TIMESTAMP TAB
// =============================================================================

function TimestampTab({ tokens, stats }: { tokens: any[]; stats: any }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Timer className="w-5 h-5 text-blue-400" />
          RFC 3161 Timestamp Authority
        </h2>
        <span className="text-sm text-slate-400">{tokens.length} tokens issued</span>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard icon={<Timer className="w-5 h-5 text-blue-400" />} label="Total Tokens" value={stats.totalTokens} sub="" color="blue" />
          <StatCard icon={<Link2 className="w-5 h-5 text-violet-400" />} label="Blockchain Anchored" value={stats.blockchainAnchored} sub="" color="violet" />
          <StatCard icon={<Zap className="w-5 h-5 text-emerald-400" />} label="Avg Verification" value={`${stats.averageVerificationTimeMs}ms`} sub="" color="emerald" />
          <StatCard icon={<Clock className="w-5 h-5 text-amber-400" />} label="Last Issued" value={stats.lastIssuedAt ? new Date(stats.lastIssuedAt).toLocaleDateString() : '—'} sub="" color="amber" />
        </div>
      )}

      {/* Token List */}
      <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-slate-400">
              <th className="text-left p-3 font-medium">Description</th>
              <th className="text-left p-3 font-medium">Type</th>
              <th className="text-left p-3 font-medium">Provider</th>
              <th className="text-left p-3 font-medium">Status</th>
              <th className="text-left p-3 font-medium">Blockchain</th>
              <th className="text-left p-3 font-medium">Issued</th>
            </tr>
          </thead>
          <tbody>
            {tokens.slice(0, 20).map((token: any) => (
              <tr key={token.id} className="border-b border-white/5 hover:bg-white/5">
                <td className="p-3 font-medium">{token.dataDescription}</td>
                <td className="p-3">
                  <span className="px-2 py-0.5 rounded text-xs bg-slate-800">{token.dataType}</span>
                </td>
                <td className="p-3 text-slate-400">{token.externalTimestamp?.provider || 'internal'}</td>
                <td className="p-3">
                  <span className={cn('px-2 py-0.5 rounded text-xs', {
                    'bg-emerald-500/20 text-emerald-400': token.status === 'issued' || token.status === 'verified',
                    'bg-amber-500/20 text-amber-400': token.status === 'pending',
                    'bg-red-500/20 text-red-400': token.status === 'failed',
                  })}>
                    {token.status}
                  </span>
                </td>
                <td className="p-3">
                  {token.blockchainAnchor ? (
                    <span className="text-violet-400 text-xs">⛓ {token.blockchainAnchor.network.split('_')[0]}</span>
                  ) : (
                    <span className="text-slate-500 text-xs">—</span>
                  )}
                </td>
                <td className="p-3 text-slate-400">{new Date(token.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// =============================================================================
// SIMILARITY TAB
// =============================================================================

function SimilarityTab({ decisions }: { decisions: any[] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any>(null);
  const [searching, setSearching] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setSearching(true);
    try {
      const result = await dciiApi('/similarity/search', {
        method: 'POST',
        body: JSON.stringify({
          organizationId: 'org-datacendia',
          title: searchQuery,
          question: searchQuery,
          context: '',
          maxResults: 5,
          minSimilarity: 0.1,
          includeCrossDepartment: true,
        }),
      });
      setSearchResults(result);
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setSearching(false);
    }
  };

  const outcomeColors: Record<string, string> = {
    successful: 'text-emerald-400',
    partially_successful: 'text-blue-400',
    failed: 'text-red-400',
    too_early: 'text-slate-400',
    unknown: 'text-slate-500',
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <GitBranch className="w-5 h-5 text-pink-400" />
          Decision Similarity Engine
        </h2>
        <span className="text-sm text-slate-400">{decisions.length} decisions indexed</span>
      </div>

      {/* Search */}
      <div className="flex gap-2">
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
          placeholder="Describe a proposed decision to find similar precedents..."
          className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-violet-500"
        />
        <button
          onClick={handleSearch}
          disabled={searching}
          className="px-4 py-2 bg-violet-600 hover:bg-violet-500 rounded-lg text-sm font-medium flex items-center gap-2 disabled:opacity-50"
        >
          <Search className="w-4 h-4" />
          {searching ? 'Searching...' : 'Find Similar'}
        </button>
      </div>

      {/* Search Results */}
      {searchResults && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <span>{searchResults.matches.length} matches found</span>
            <span>·</span>
            <span>{searchResults.searchDurationMs}ms</span>
          </div>

          {/* Risk Assessment */}
          {searchResults.riskAssessment && (
            <div className={cn('rounded-lg p-3 border', {
              'bg-red-500/10 border-red-500/30': searchResults.riskAssessment.overallRisk === 'critical',
              'bg-amber-500/10 border-amber-500/30': searchResults.riskAssessment.overallRisk === 'high',
              'bg-blue-500/10 border-blue-500/30': searchResults.riskAssessment.overallRisk === 'medium',
              'bg-emerald-500/10 border-emerald-500/30': searchResults.riskAssessment.overallRisk === 'low',
              'bg-slate-500/10 border-slate-500/30': searchResults.riskAssessment.overallRisk === 'unknown',
            })}>
              <div className="text-xs font-medium mb-1">Risk Assessment: {searchResults.riskAssessment.overallRisk.toUpperCase()}</div>
              <div className="text-xs text-slate-400">
                Success rate: {(searchResults.riskAssessment.historicalSuccessRate * 100).toFixed(0)}% ·
                Dissenter accuracy: {(searchResults.riskAssessment.dissenterAccuracyRate * 100).toFixed(0)}%
              </div>
            </div>
          )}

          {/* Matches */}
          {searchResults.matches.map((match: any) => (
            <div key={match.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="font-medium">{match.matchedDecision.title}</div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono text-violet-400">{(match.overallSimilarity * 100).toFixed(0)}%</span>
                  <span className={cn('px-2 py-0.5 rounded text-xs', {
                    'bg-emerald-500/20 text-emerald-400': match.matchStrength === 'exact' || match.matchStrength === 'strong',
                    'bg-blue-500/20 text-blue-400': match.matchStrength === 'moderate',
                    'bg-slate-500/20 text-slate-400': match.matchStrength === 'weak' || match.matchStrength === 'tangential',
                  })}>
                    {match.matchStrength}
                  </span>
                </div>
              </div>
              <p className="text-sm text-slate-400 mb-2">{match.matchedDecision.question}</p>
              <div className="flex items-center gap-4 text-xs text-slate-500 mb-2">
                <span>{match.matchedDecision.department}</span>
                <span>{new Date(match.matchedDecision.decidedAt).toLocaleDateString()}</span>
                {match.matchedDecision.outcome && (
                  <span className={cn('font-medium', outcomeColors[match.matchedDecision.outcome])}>
                    {match.matchedDecision.outcome.replace(/_/g, ' ')}
                  </span>
                )}
              </div>
              {match.warnings.length > 0 && (
                <div className="space-y-1 mb-2">
                  {match.warnings.map((w: any, i: number) => (
                    <div key={i} className={cn('text-xs flex items-start gap-1 p-1.5 rounded', {
                      'bg-red-500/10 text-red-400': w.severity === 'critical',
                      'bg-amber-500/10 text-amber-400': w.severity === 'high',
                    })}>
                      <AlertTriangle className="w-3 h-3 mt-0.5 shrink-0" />
                      {w.description}
                    </div>
                  ))}
                </div>
              )}
              {match.matchedDecision.lessonsLearned && match.matchedDecision.lessonsLearned.length > 0 && (
                <div className="text-xs text-slate-400">
                  <span className="font-medium text-blue-400">Lessons: </span>
                  {match.matchedDecision.lessonsLearned[0]}
                </div>
              )}
            </div>
          ))}

          {/* Aggregate Insights */}
          {searchResults.aggregateInsights?.length > 0 && (
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-400" />
                Aggregate Insights
              </h4>
              {searchResults.aggregateInsights.map((insight: any, i: number) => (
                <div key={i} className="text-sm text-slate-300 mb-1">• {insight.description}</div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Decision Records */}
      <div>
        <h3 className="text-md font-semibold mb-3">Indexed Decision Records</h3>
        <div className="grid gap-2">
          {decisions.slice(0, 10).map((dec: any) => (
            <div key={dec.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
              <div>
                <div className="font-medium text-sm">{dec.title}</div>
                <div className="text-xs text-slate-400">{dec.department} · {dec.decisionType} · {new Date(dec.decidedAt).toLocaleDateString()}</div>
              </div>
              <div className="flex items-center gap-2">
                {dec.outcome && (
                  <span className={cn('text-xs font-medium', outcomeColors[dec.outcome] || 'text-slate-400')}>
                    {dec.outcome.replace(/_/g, ' ')}
                  </span>
                )}
                {dec.overrideOccurred && <span title="Override occurred"><ShieldAlert className="w-4 h-4 text-amber-400" /></span>}
                {dec.dissenterWasCorrect && <span title="Dissenter was correct"><AlertTriangle className="w-4 h-4 text-red-400" /></span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// SHARED COMPONENTS
// =============================================================================

function StatCard({ icon, label, value, sub, color }: { icon: React.ReactNode; label: string; value: any; sub: string; color: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-center gap-2 mb-2">{icon}<span className="text-xs text-slate-400">{label}</span></div>
      <div className="text-2xl font-bold">{value}</div>
      {sub && <div className="text-xs text-slate-500">{sub}</div>}
    </div>
  );
}

function PrimitiveCard({ primitive, index }: { primitive: any; index: number }) {
  const Icon = primitive.icon;
  const isFoundational = index < 5;
  return (
    <div className={cn('rounded-xl border p-4 transition-all hover:bg-white/8', {
      'border-emerald-500/20 bg-emerald-500/5': primitive.status === 'implemented',
      'border-amber-500/20 bg-amber-500/5': primitive.status === 'partial',
      'border-red-500/20 bg-red-500/5': primitive.status === 'not_implemented',
    })}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon className={cn('w-5 h-5', {
            'text-emerald-400': primitive.status === 'implemented',
            'text-amber-400': primitive.status === 'partial',
          })} />
          <span className="font-medium text-sm">{primitive.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={cn('px-1.5 py-0.5 rounded text-[10px] font-medium', isFoundational ? 'bg-violet-500/20 text-violet-400' : 'bg-blue-500/20 text-blue-400')}>
            {isFoundational ? 'Foundational' : 'Advanced'}
          </span>
          <span className="text-sm font-bold">{primitive.score}%</span>
        </div>
      </div>
      <div className="w-full bg-black/30 rounded-full h-1.5 mb-2">
        <div className={cn('h-1.5 rounded-full', {
          'bg-emerald-500': primitive.score >= 70,
          'bg-amber-500': primitive.score >= 40 && primitive.score < 70,
          'bg-red-500': primitive.score < 40,
        })} style={{ width: `${primitive.score}%` }} />
      </div>
      <p className="text-xs text-slate-400">{primitive.description}</p>
    </div>
  );
}
