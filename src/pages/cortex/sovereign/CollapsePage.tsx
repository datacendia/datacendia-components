import { logger } from '../../../lib/logger';
/**
 * Page — Collapse Page
 *
 * React page component rendered by the router.
 * @module pages/cortex/sovereign/CollapsePage
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * Policy Collapse Mode - Adversarial Policy Stress-Testing
 * 
 * "Under what conditions would this decision fail, harm people, or collapse legitimacy?"
 * 
 * Features:
 * - Dual-track deliberation (Consensus vs Collapse)
 * - Trust Delta calculation and visualization
 * - Failure envelope display
 * - Minority harm heatmap
 * - Narrative attack simulator
 * - Legitimacy erosion timeline
 * - Replay and verification
 * - IMPOSSIBLE_DEMO: Full audit bundle export, in-browser verification, human override
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  AlertTriangle,
  Shield,
  Users,
  TrendingDown,
  FileWarning,
  Download,
  Play,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertOctagon,
  Zap,
  Clock,
  MessageSquare,
  Eye,
  Target,
  Scale,
  FileCheck,
  Fingerprint,
  Package,
  Rocket,
  ShieldAlert,
  UserCheck,
  FileSignature,
  Loader2,
} from 'lucide-react';
import { ReportSection, StatusBadge } from '../../../components/reports/DrillDownReportKit';
import { MetricWithSparkline } from '../../../components/reports/TrendSparklineKit';
import { HeatmapCalendar, AuditTimeline } from '../../../components/reports/HeatmapTimelineKit';
import { ExportToolbar, ComparisonPanel, PDFExportButton } from '../../../components/reports/ExportCompareKit';
import { SavedViewManager } from '../../../components/reports/InteractionKit';

const API_BASE = '/api/v1/collapse';

interface TrustDelta {
  consensusConfidence: number;
  collapseRisk: number;
  trustDelta: number;
  deploymentRecommendation: string;
  riskFactors: string[];
  mitigationSuggestions: string[];
}

interface FailureCondition {
  id: string;
  agent: string;
  category: string;
  severity: number;
  probability: number;
  failureEvent: { type: string; description: string };
  affectedGroups: { name: string; vulnerabilityScore: number }[];
  timeToManifestation: string;
}

interface FailureEnvelope {
  id: string;
  decisionId: string;
  generatedAt: string;
  seed: number;
  summary: {
    totalFailureConditions: number;
    criticalCount: number;
    highCount: number;
    mediumCount: number;
    lowCount: number;
    affectedGroupsCount: number;
    ethicalViolationsCount: number;
  };
  failureConditions: FailureCondition[];
  trustDelta: TrustDelta;
  legitimacyCurve: { time: number; legitimacy: number }[];
  minorityHarmMatrix: { group: string; severity: number; visibility: string }[];
  narrativeAttacks: { headline: string; virality: number; emotionalTrigger: string }[];
  merkleRoot: string;
  replayCommand: string;
}

interface Deliberation {
  id: string;
  decisionId: string;
  decisionText: string;
  consensusTrack: { confidence: number };
  collapseTrack: { totalRisk: number; criticalFindings: string[]; failureEnvelope: FailureEnvelope };
  trustDelta: TrustDelta;
  seed: number;
  merkleRoot: string;
  completedAt: string;
}

interface AgentDescription {
  type: string;
  description: string;
  questions: string[];
}

// Override modal types
interface HumanAuthority {
  name: string;
  title: string;
  email: string;
  department: string;
}

interface OverrideRecord {
  id: string;
  deliberationId: string;
  decisionId: string;
  timestamp: string;
  humanAuthority: HumanAuthority;
  aiRecommendation: string;
  trustDeltaAtOverride: number;
  actionTaken: string;
  justification: string;
  acceptedRisks: string[];
  riskAcknowledgment: string;
  signature: string;
  signedAt: string;
}

interface VerificationResult {
  bundleFormat: boolean;
  metaValid: boolean;
  packetValid: boolean;
  envelopePresent: boolean;
  checksumValid: boolean;
  merkleValid: boolean;
  integrityScore: number;
  details: string[];
}

const CollapsePage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [agents, setAgents] = useState<AgentDescription[]>([]);
  const [deliberation, setDeliberation] = useState<Deliberation | null>(null);
  const [history, setHistory] = useState<Deliberation[]>([]);
  const [activeTab, setActiveTab] = useState<'analysis' | 'timeline' | 'heatmap' | 'narrative' | 'agents'>('analysis');
  
  // Form state
  const [decisionId, setDecisionId] = useState('');
  const [decisionText, setDecisionText] = useState('');
  const [policyDomain, setPolicyDomain] = useState('Housing');
  const [targetPopulation, setTargetPopulation] = useState(100000);
  const [consensusConfidence, setConsensusConfidence] = useState(0.85);
  const [seed, setSeed] = useState<number | undefined>(undefined);

  // IMPOSSIBLE_DEMO state
  const [showOverrideModal, setShowOverrideModal] = useState(false);
  const [showVerificationPanel, setShowVerificationPanel] = useState(false);
  const [overrideRecord, setOverrideRecord] = useState<OverrideRecord | null>(null);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [_verifyingBundle, setVerifyingBundle] = useState(false);
  const [uploadedBundle, setUploadedBundle] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Override form state
  const [overrideAuthority, setOverrideAuthority] = useState<HumanAuthority>({
    name: '',
    title: '',
    email: '',
    department: '',
  });
  const [overrideJustification, setOverrideJustification] = useState('');
  const [acceptedRisks, setAcceptedRisks] = useState<string[]>([]);
  const [riskAcknowledgment, setRiskAcknowledgment] = useState(false);

  // Fallback demo deliberation for when backend is unavailable
  const loadFallbackData = () => {
    const demoDeliberation: Deliberation = {
      id: 'demo-collapse-001',
      decisionId: 'DEC-2026-PREDICTIVE-POLICING',
      decisionText: 'Deploy predictive policing algorithm to allocate patrol resources based on historical crime data, demographic patterns, and socioeconomic indicators across 12 municipal districts.',
      consensusTrack: { confidence: 0.82 },
      collapseTrack: {
        totalRisk: 0.74,
        criticalFindings: [
          'Historical crime data encodes systemic racial bias — algorithm amplifies over-policing in minority neighborhoods',
          'Feedback loop: more patrols → more arrests → higher "crime" scores → more patrols (compounding bias)',
          'No sunset clause or independent review mechanism — once deployed, political inertia prevents rollback',
          'Disproportionate impact on Black and Latino communities (3.2x arrest rate differential predicted)',
        ],
        failureEnvelope: {
          id: 'env-demo-001',
          decisionId: 'DEC-2026-PREDICTIVE-POLICING',
          generatedAt: new Date().toISOString(),
          seed: 42,
          summary: {
            totalFailureConditions: 8,
            criticalCount: 3,
            highCount: 3,
            mediumCount: 2,
            lowCount: 0,
            affectedGroupsCount: 5,
            ethicalViolationsCount: 4,
          },
          failureConditions: [
            { id: 'fc-1', agent: 'RACIAL_BIAS_DETECTOR', category: 'civil_liberties', severity: 0.92, probability: 0.87, failureEvent: { type: 'systematic_bias', description: 'Algorithm perpetuates and amplifies historical racial profiling patterns, leading to 3.2x disproportionate surveillance of minority neighborhoods' }, affectedGroups: [{ name: 'Black Communities', vulnerabilityScore: 0.95 }, { name: 'Latino Communities', vulnerabilityScore: 0.88 }], timeToManifestation: '0-3 months' },
            { id: 'fc-2', agent: 'FEEDBACK_LOOP_ANALYST', category: 'systemic_risk', severity: 0.88, probability: 0.91, failureEvent: { type: 'compounding_bias', description: 'Self-reinforcing feedback loop: increased patrols generate more arrests, which feed back as higher crime scores, justifying even more patrols' }, affectedGroups: [{ name: 'Over-policed Districts', vulnerabilityScore: 0.90 }], timeToManifestation: '3-6 months' },
            { id: 'fc-3', agent: 'LEGITIMACY_EROSION', category: 'public_trust', severity: 0.85, probability: 0.78, failureEvent: { type: 'trust_collapse', description: 'Community discovers algorithmic bias through investigative journalism, triggering protests and complete loss of police-community trust' }, affectedGroups: [{ name: 'General Public', vulnerabilityScore: 0.65 }, { name: 'Civil Rights Organizations', vulnerabilityScore: 0.72 }], timeToManifestation: '6-12 months' },
            { id: 'fc-4', agent: 'LEGAL_CHALLENGE', category: 'regulatory', severity: 0.78, probability: 0.72, failureEvent: { type: 'constitutional_violation', description: 'ACLU files class-action lawsuit alleging Fourth Amendment violations and Equal Protection Clause breach' }, affectedGroups: [{ name: 'Municipal Government', vulnerabilityScore: 0.80 }], timeToManifestation: '6-18 months' },
            { id: 'fc-5', agent: 'NARRATIVE_ATTACKER', category: 'political', severity: 0.82, probability: 0.85, failureEvent: { type: 'media_crisis', description: '"AI-Powered Racial Profiling" headline goes viral after wrongful arrest of community leader, triggering national media coverage' }, affectedGroups: [{ name: 'Elected Officials', vulnerabilityScore: 0.75 }], timeToManifestation: '3-9 months' },
            { id: 'fc-6', agent: 'ECONOMIC_IMPACT', category: 'economic', severity: 0.65, probability: 0.60, failureEvent: { type: 'economic_harm', description: 'Property values decline 8-12% in over-policed neighborhoods; businesses relocate due to perceived crime stigma' }, affectedGroups: [{ name: 'Small Business Owners', vulnerabilityScore: 0.70 }], timeToManifestation: '12-24 months' },
            { id: 'fc-7', agent: 'MINORITY_HARM_DETECTOR', category: 'civil_liberties', severity: 0.90, probability: 0.82, failureEvent: { type: 'disproportionate_harm', description: 'Youth in targeted neighborhoods face 4.1x higher stop-and-frisk rates, creating lasting psychological harm and criminal records that affect employment' }, affectedGroups: [{ name: 'Youth (14-24)', vulnerabilityScore: 0.93 }], timeToManifestation: '0-6 months' },
            { id: 'fc-8', agent: 'ROLLBACK_ANALYST', category: 'systemic_risk', severity: 0.70, probability: 0.65, failureEvent: { type: 'irreversibility', description: 'Political lock-in: officials who championed the system resist admitting failure, extending harmful deployment by 2-3 years' }, affectedGroups: [{ name: 'All Stakeholders', vulnerabilityScore: 0.55 }], timeToManifestation: '12-36 months' },
          ],
          trustDelta: {
            consensusConfidence: 0.82,
            collapseRisk: 0.74,
            trustDelta: -0.22,
            deploymentRecommendation: 'DO_NOT_DEPLOY',
            riskFactors: ['Systemic racial bias amplification', 'Self-reinforcing feedback loops', 'Constitutional vulnerability', 'Irreversible community harm'],
            mitigationSuggestions: ['Independent bias audit before deployment', 'Community oversight board with veto power', 'Mandatory sunset clause (6 months)', 'Real-time disparity monitoring with auto-shutoff'],
          },
          legitimacyCurve: [
            { time: 0, legitimacy: 0.82 }, { time: 1, legitimacy: 0.78 }, { time: 2, legitimacy: 0.71 },
            { time: 3, legitimacy: 0.62 }, { time: 4, legitimacy: 0.55 }, { time: 5, legitimacy: 0.48 },
            { time: 6, legitimacy: 0.38 }, { time: 7, legitimacy: 0.31 }, { time: 8, legitimacy: 0.25 },
            { time: 9, legitimacy: 0.22 }, { time: 10, legitimacy: 0.18 }, { time: 11, legitimacy: 0.15 },
            { time: 12, legitimacy: 0.12 },
          ],
          minorityHarmMatrix: [
            { group: 'Black Communities', severity: 0.95, visibility: 'High' },
            { group: 'Latino Communities', severity: 0.88, visibility: 'High' },
            { group: 'Youth (14-24)', severity: 0.93, visibility: 'Medium' },
            { group: 'Low-Income Households', severity: 0.72, visibility: 'Low' },
            { group: 'Immigrant Communities', severity: 0.68, visibility: 'Low' },
          ],
          narrativeAttacks: [
            { headline: 'City Deploys AI Racial Profiling System — Targets Minority Neighborhoods', virality: 0.94, emotionalTrigger: 'Injustice/Anger' },
            { headline: 'Wrongfully Arrested by Algorithm: Local Teacher\'s Nightmare Exposes Biased AI', virality: 0.89, emotionalTrigger: 'Empathy/Outrage' },
            { headline: 'Tax Dollars Fund Digital Redlining: How AI Policing Recreates Jim Crow', virality: 0.86, emotionalTrigger: 'Historical Injustice' },
            { headline: 'Children Targeted: Predictive Policing AI Flags Teens Based on ZIP Code', virality: 0.91, emotionalTrigger: 'Child Safety/Outrage' },
          ],
          merkleRoot: 'sha256-7f3a8b2c4d5e6f1a9b0c3d4e5f6a7b8c',
          replayCommand: 'collapse replay --id demo-collapse-001 --seed 42',
        },
      },
      trustDelta: {
        consensusConfidence: 0.82,
        collapseRisk: 0.74,
        trustDelta: -0.22,
        deploymentRecommendation: 'DO_NOT_DEPLOY',
        riskFactors: ['Systemic racial bias amplification', 'Self-reinforcing feedback loops', 'Constitutional vulnerability', 'Irreversible community harm'],
        mitigationSuggestions: ['Independent bias audit before deployment', 'Community oversight board with veto power', 'Mandatory sunset clause (6 months)', 'Real-time disparity monitoring with auto-shutoff'],
      },
      seed: 42,
      merkleRoot: 'sha256-7f3a8b2c4d5e6f1a9b0c3d4e5f6a7b8c',
      completedAt: new Date().toISOString(),
    };

    setDeliberation(demoDeliberation);
    setDecisionId('DEC-2026-PREDICTIVE-POLICING');
    setDecisionText(demoDeliberation.decisionText);
    setPolicyDomain('Public Safety');
    setTargetPopulation(450000);
    setConsensusConfidence(0.82);
    setSeed(42);

    setAgents([
      { type: 'RACIAL_BIAS_DETECTOR', description: 'Detects systematic racial and ethnic bias in policy outcomes', questions: ['Does this policy disproportionately affect racial minorities?'] },
      { type: 'FEEDBACK_LOOP_ANALYST', description: 'Identifies self-reinforcing feedback loops that amplify harm', questions: ['Will outcomes of this policy feed back into its own inputs?'] },
      { type: 'LEGITIMACY_EROSION', description: 'Measures erosion of public trust and institutional legitimacy', questions: ['How would public trust change if the policy\'s mechanisms were exposed?'] },
      { type: 'FREE_SPEECH_GUARDIAN', description: 'Protects First Amendment and expression rights (NON-OVERRIDABLE)', questions: ['Does this policy chill protected speech or expression?'] },
      { type: 'MINORITY_HARM_DETECTOR', description: 'Identifies disproportionate harm to vulnerable populations (NON-OVERRIDABLE)', questions: ['Which minority groups bear the greatest burden?'] },
      { type: 'NARRATIVE_ATTACKER', description: 'Simulates how adversaries would frame this policy to destroy trust', questions: ['What headline would go viral if this policy failed?'] },
      { type: 'LEGAL_CHALLENGE', description: 'Assesses constitutional and regulatory vulnerabilities', questions: ['What legal challenges could be brought against this policy?'] },
      { type: 'ECONOMIC_IMPACT', description: 'Evaluates downstream economic consequences on affected communities', questions: ['How will property values, businesses, and employment be affected?'] },
      { type: 'ROLLBACK_ANALYST', description: 'Assesses whether the policy can be reversed if it fails', questions: ['If we discover harm in 6 months, can we actually undo the damage?'] },
    ]);

    setHistory([demoDeliberation]);
  };

  useEffect(() => {
    fetchAgents();
    fetchHistory();
  }, []);

  const fetchAgents = async () => {
    try {
      const res = await fetch(`${API_BASE}/agents`);
      if (!res.ok) {throw new Error('Not OK');}
      const text = await res.text();
      if (!text) {throw new Error('Empty');}
      const data = JSON.parse(text);
      if (data.success) {
        setAgents(data.agents);
        return;
      }
    } catch (error) {
      logger.error('Failed to fetch agents:', error);
    }
    // Fallback: if no agents loaded after a short delay, load demo data
    setTimeout(() => {
      setAgents((prev) => {
        if (prev.length === 0) {loadFallbackData();}
        return prev;
      });
    }, 500);
  };

  const fetchHistory = async () => {
    try {
      const res = await fetch(`${API_BASE}/deliberations`);
      if (!res.ok) {throw new Error('Not OK');}
      const text = await res.text();
      if (!text) {throw new Error('Empty');}
      const data = JSON.parse(text);
      if (data.success) {
        setHistory(data.deliberations);
      }
    } catch (error) {
      logger.error('Failed to fetch history:', error);
    }
  };

  const runDeliberation = async () => {
    if (!decisionText.trim()) {return;}

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/deliberation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          decisionId: decisionId || `DEC-${Date.now()}`,
          decisionText,
          context: {
            policyDomain,
            targetPopulation,
            geographicScope: 'Municipal',
            budgetImpact: 1000000,
            timelineMonths: 24,
            stakeholders: ['Citizens', 'Business', 'Government'],
          },
          consensusConfidence,
          seed,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setDeliberation(data.deliberation);
        fetchHistory();
      }
    } catch (error) {
      logger.error('Deliberation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadEnvelope = async () => {
    if (!deliberation) {return;}
    const envelopeId = deliberation.collapseTrack.failureEnvelope.id;
    window.open(`${API_BASE}/envelope/${envelopeId}/export`, '_blank');
  };

  const replayDeliberation = async (id: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/deliberation/${id}/replay`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        alert(data.message);
      }
    } catch (error) {
      logger.error('Replay failed:', error);
    } finally {
      setLoading(false);
    }
  };

  // DEMO SCENARIO FUNCTIONS
  const loadImpossibleDemo = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/demo/impossible`);
      const data = await res.json();
      if (data.success) {
        const scenario = data.scenario;
        setDecisionId('IMPOSSIBLE-DEMO-001');
        setDecisionText(scenario.decisionText);
        setPolicyDomain(scenario.context.policyDomain);
        setTargetPopulation(scenario.context.targetPopulation);
        setConsensusConfidence(0.85);
      }
    } catch (error) {
      logger.error('Failed to load demo scenario:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCloudAIDemo = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/demo/cloud-ai-disruption`);
      const data = await res.json();
      if (data.success) {
        const scenario = data.scenario;
        setDecisionId('CLOUD-AI-DISRUPTION-001');
        setDecisionText(scenario.decisionText);
        setPolicyDomain(scenario.context.policyDomain);
        setTargetPopulation(scenario.context.targetPopulation);
        setConsensusConfidence(0.78);
      }
    } catch (error) {
      logger.error('Failed to load Cloud AI demo scenario:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadAuditBundle = async () => {
    if (!deliberation) {return;}
    window.open(`${API_BASE}/deliberation/${deliberation.id}/audit-bundle`, '_blank');
  };

  const handleBundleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {return;}

    try {
      const text = await file.text();
      const bundle = JSON.parse(text);
      setUploadedBundle(bundle);
      await verifyBundle(bundle);
    } catch (error) {
      logger.error('Failed to parse bundle:', error);
      alert('Invalid bundle file format');
    }
  };

  const verifyBundle = async (bundle: any) => {
    setVerifyingBundle(true);
    try {
      const res = await fetch(`${API_BASE}/verify-bundle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bundle),
      });
      const data = await res.json();
      if (data.success) {
        setVerificationResult(data.verification);
        setShowVerificationPanel(true);
      }
    } catch (error) {
      logger.error('Verification failed:', error);
    } finally {
      setVerifyingBundle(false);
    }
  };

  const submitOverride = async () => {
    if (!deliberation) {return;}
    if (!overrideAuthority.name || !overrideJustification || acceptedRisks.length === 0 || !riskAcknowledgment) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/deliberation/${deliberation.id}/override`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          humanAuthority: overrideAuthority,
          justification: overrideJustification,
          acceptedRisks,
          riskAcknowledgment: 'I understand and accept institutional responsibility for the accepted risks.',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setOverrideRecord(data.overrideRecord);
        setShowOverrideModal(false);
        alert('Override recorded with cryptographic signature. The human authority has accepted institutional responsibility.');
      } else {
        alert(`Override failed: ${data.error}\n\nViolations: ${data.violations?.join(', ')}`);
      }
    } catch (error) {
      logger.error('Override failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAvailableRisks = (): string[] => {
    if (!deliberation) {return [];}
    const risks: string[] = [];
    deliberation.collapseTrack.failureEnvelope.failureConditions.forEach((fc) => {
      if (!risks.includes(fc.category)) {
        risks.push(fc.category);
      }
    });
    return risks;
  };

  const toggleRisk = (risk: string) => {
    if (acceptedRisks.includes(risk)) {
      setAcceptedRisks(acceptedRisks.filter(r => r !== risk));
    } else {
      setAcceptedRisks([...acceptedRisks, risk]);
    }
  };

  const getTrustDeltaColor = (delta: number) => {
    if (delta > 0.3) {return 'text-green-500';}
    if (delta > 0.1) {return 'text-yellow-500';}
    if (delta > 0) {return 'text-orange-500';}
    return 'text-red-500';
  };

  const getRecommendationBadge = (rec: string) => {
    const badges: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
      SAFE_TO_DEPLOY: { bg: 'bg-green-500/20', text: 'text-green-400', icon: <CheckCircle className="w-4 h-4" /> },
      DEPLOY_WITH_GUARDRAILS: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', icon: <AlertTriangle className="w-4 h-4" /> },
      HIGH_RISK: { bg: 'bg-orange-500/20', text: 'text-orange-400', icon: <AlertOctagon className="w-4 h-4" /> },
      DO_NOT_DEPLOY: { bg: 'bg-red-500/20', text: 'text-red-400', icon: <XCircle className="w-4 h-4" /> },
    };
    const badge = badges[rec] || badges.HIGH_RISK;
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full ${badge.bg} ${badge.text} text-sm font-medium`}>
        {badge.icon}
        {rec.replace(/_/g, ' ')}
      </span>
    );
  };

  const getSeverityColor = (severity: number) => {
    if (severity >= 0.8) {return 'bg-red-500';}
    if (severity >= 0.6) {return 'bg-orange-500';}
    if (severity >= 0.4) {return 'bg-yellow-500';}
    return 'bg-green-500';
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-5 mb-2">
            <div className="w-12 h-12 rounded-xl bg-black/30 backdrop-blur-sm border border-white/10 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <h1 className="text-2xl" style={{ fontFamily: 'Arial, Helvetica, sans-serif', fontWeight: 300, letterSpacing: '0.35em', color: '#e8e4e0' }}>
                CENDIACOLLAPSE<span style={{ fontWeight: 200, fontSize: '0.7em', opacity: 0.5, marginLeft: '2px' }}>™</span>
              </h1>
              <p className="text-[11px] uppercase tracking-[0.25em] text-white/60 font-light">Adversarial Policy Stress-Testing</p>
            </div>
          </div>
          <p className="text-gray-500 italic mt-2">
            "Under what conditions would this decision fail, harm people, or collapse legitimacy?"
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Configuration */}
          <div className="lg:col-span-1 space-y-6">
            {/* Input Form */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-400" />
                Policy Configuration
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Decision ID</label>
                  <input
                    type="text"
                    value={decisionId}
                    onChange={(e) => setDecisionId(e.target.value)}
                    placeholder="DEC-2026-001"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Policy Decision Text</label>
                  <textarea
                    value={decisionText}
                    onChange={(e) => setDecisionText(e.target.value)}
                    placeholder="Describe the policy decision to analyze..."
                    rows={4}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Domain</label>
                    <select
                      value={policyDomain}
                      onChange={(e) => setPolicyDomain(e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    >
                      <option>Housing</option>
                      <option>Healthcare</option>
                      <option>Education</option>
                      <option>Transportation</option>
                      <option>Environment</option>
                      <option>Finance</option>
                      <option>Public Safety</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Population</label>
                    <input
                      type="number"
                      value={targetPopulation}
                      onChange={(e) => setTargetPopulation(parseInt(e.target.value) || 0)}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Consensus Confidence: {(consensusConfidence * 100).toFixed(0)}%
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="0.99"
                    step="0.01"
                    value={consensusConfidence}
                    onChange={(e) => setConsensusConfidence(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Seed (optional)</label>
                  <input
                    type="number"
                    value={seed || ''}
                    onChange={(e) => setSeed(e.target.value ? parseInt(e.target.value) : undefined)}
                    placeholder="Random"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                  />
                </div>

                <button
                  onClick={runDeliberation}
                  disabled={loading || !decisionText.trim()}
                  className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  {loading ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                    <Zap className="w-5 h-5" />
                  )}
                  Run Collapse Analysis
                </button>

                {/* Demo Scenario Buttons */}
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <p className="text-xs text-gray-500 mb-2 text-center font-medium">PRE-LOADED SCENARIOS</p>
                  
                  <button
                    onClick={loadImpossibleDemo}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-medium py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all text-sm"
                  >
                    <Rocket className="w-4 h-4" />
                    IMPOSSIBLE DEMO
                  </button>
                  <p className="text-[10px] text-gray-500 mt-1 text-center mb-3">
                    Predictive policing policy analysis
                  </p>

                  <button
                    onClick={loadCloudAIDemo}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-medium py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all text-sm"
                  >
                    <Zap className="w-4 h-4" />
                    CLOUD AI DISRUPTION
                  </button>
                  <p className="text-[10px] text-gray-500 mt-1 text-center">
                    SaaS vs. AI platform competition
                  </p>
                </div>
              </div>
            </div>

            {/* History */}
            {history.length > 0 && (
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-purple-400" />
                  Recent Analyses
                </h2>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {(history || []).slice(0, 5).map((d) => (
                    <div
                      key={d.id}
                      onClick={() => setDeliberation(d)}
                      className="p-3 bg-gray-700/50 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors"
                    >
                      <div className="text-sm font-medium truncate">{(d.decisionText || '').slice(0, 50)}...</div>
                      <div className="text-xs text-gray-400 mt-1 flex items-center justify-between">
                        <span>Trust Δ: {d.trustDelta.trustDelta.toFixed(2)}</span>
                        <span>{new Date(d.completedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Panel - Results */}
          <div className="lg:col-span-2 space-y-6">
            {deliberation ? (
              <>
                {/* Trust Delta Banner */}
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                      <Scale className="w-5 h-5 text-blue-400" />
                      Trust Delta Analysis
                    </h2>
                    <div className="flex gap-2">
                      <button
                        onClick={downloadEnvelope}
                        className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                        title="Download Failure Envelope"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={downloadAuditBundle}
                        className="p-2 bg-purple-700 hover:bg-purple-600 rounded-lg transition-colors"
                        title="Download Full Audit Bundle"
                      >
                        <Package className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="p-2 bg-cyan-700 hover:bg-cyan-600 rounded-lg transition-colors"
                        title="Verify Audit Bundle"
                      >
                        <FileCheck className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => replayDeliberation(deliberation.id)}
                        className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                        title="Replay Deliberation"
                      >
                        <Play className="w-4 h-4" />
                      </button>
                      {deliberation.trustDelta.trustDelta < 0 && (
                        <button
                          onClick={() => setShowOverrideModal(true)}
                          className="p-2 bg-red-700 hover:bg-red-600 rounded-lg transition-colors"
                          title="Human Override"
                        >
                          <UserCheck className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".json"
                      onChange={handleBundleUpload}
                      className="hidden"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center p-4 bg-green-500/10 rounded-lg">
                      <div className="text-3xl font-bold text-green-400">
                        {(deliberation.trustDelta.consensusConfidence * 100).toFixed(0)}%
                      </div>
                      <div className="text-sm text-gray-400">Consensus</div>
                    </div>
                    <div className="text-center p-4 bg-red-500/10 rounded-lg">
                      <div className="text-3xl font-bold text-red-400">
                        {(deliberation.trustDelta.collapseRisk * 100).toFixed(0)}%
                      </div>
                      <div className="text-sm text-gray-400">Collapse Risk</div>
                    </div>
                    <div className={`text-center p-4 rounded-lg ${deliberation.trustDelta.trustDelta > 0 ? 'bg-blue-500/10' : 'bg-red-500/10'}`}>
                      <div className={`text-3xl font-bold ${getTrustDeltaColor(deliberation.trustDelta.trustDelta)}`}>
                        {deliberation.trustDelta.trustDelta > 0 ? '+' : ''}{(deliberation.trustDelta.trustDelta * 100).toFixed(0)}%
                      </div>
                      <div className="text-sm text-gray-400">Trust Delta</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    {getRecommendationBadge(deliberation.trustDelta.deploymentRecommendation)}
                    <div className="text-xs text-gray-500">
                      Seed: {deliberation.seed} | Merkle: {(deliberation.merkleRoot || '').slice(0, 12)}...
                    </div>
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 border-b border-gray-700 pb-2">
                  {[
                    { id: 'analysis', label: 'Failure Analysis', icon: FileWarning },
                    { id: 'timeline', label: 'Legitimacy Timeline', icon: TrendingDown },
                    { id: 'heatmap', label: 'Harm Heatmap', icon: Users },
                    { id: 'narrative', label: 'Narrative Attacks', icon: MessageSquare },
                    { id: 'agents', label: 'Agents', icon: Eye },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as typeof activeTab)}
                      className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                        activeTab === tab.id
                          ? 'bg-gray-700 text-white'
                          : 'text-gray-400 hover:text-white hover:bg-gray-800'
                      }`}
                    >
                      <tab.icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                  {activeTab === 'analysis' && (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Failure Conditions</h3>
                        <div className="flex gap-2 text-sm">
                          <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded">
                            Critical: {deliberation.collapseTrack.failureEnvelope.summary.criticalCount}
                          </span>
                          <span className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded">
                            High: {deliberation.collapseTrack.failureEnvelope.summary.highCount}
                          </span>
                          <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded">
                            Medium: {deliberation.collapseTrack.failureEnvelope.summary.mediumCount}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {deliberation.collapseTrack.failureEnvelope.failureConditions.map((fc) => (
                          <div key={fc.id} className="p-4 bg-gray-700/50 rounded-lg">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className={`w-2 h-2 rounded-full ${getSeverityColor(fc.severity)}`} />
                                  <span className="text-sm font-medium">{fc.agent.replace(/_/g, ' ')}</span>
                                  <span className="text-xs text-gray-500">• {fc.category.replace(/_/g, ' ')}</span>
                                </div>
                                <p className="text-sm text-gray-300">{fc.failureEvent.description}</p>
                                <div className="mt-2 flex flex-wrap gap-1">
                                  {fc.affectedGroups.map((g) => (
                                    <span key={g.name} className="text-xs px-2 py-0.5 bg-gray-600 rounded-full">
                                      {g.name}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <div className="text-right ml-4">
                                <div className="text-lg font-bold text-red-400">{(fc.severity * 100).toFixed(0)}%</div>
                                <div className="text-xs text-gray-500">Severity</div>
                                <div className="text-xs text-gray-400 mt-1">{fc.timeToManifestation}</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'timeline' && (
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Legitimacy Erosion Curve</h3>
                      <div className="h-64 flex items-end gap-1">
                        {deliberation.collapseTrack.failureEnvelope.legitimacyCurve.map((point, i) => (
                          <div key={i} className="flex-1 flex flex-col items-center">
                            <div
                              className={`w-full rounded-t ${point.legitimacy > 0.5 ? 'bg-green-500' : point.legitimacy > 0.3 ? 'bg-yellow-500' : 'bg-red-500'}`}
                              style={{ height: `${point.legitimacy * 100}%` }}
                            />
                            <div className="text-xs text-gray-500 mt-1">M{point.time}</div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 text-sm text-gray-400">
                        Initial legitimacy erodes over time as trigger events accumulate. Below 30% = recovery unlikely.
                      </div>
                    </div>
                  )}

                  {activeTab === 'heatmap' && (
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Minority Harm Matrix</h3>
                      <div className="space-y-2">
                        {deliberation.collapseTrack.failureEnvelope.minorityHarmMatrix.map((item, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <div className="w-40 text-sm truncate">{item.group}</div>
                            <div className="flex-1 bg-gray-700 rounded-full h-4 overflow-hidden">
                              <div
                                className={`h-full ${getSeverityColor(item.severity)}`}
                                style={{ width: `${item.severity * 100}%` }}
                              />
                            </div>
                            <div className="w-16 text-sm text-right">{(item.severity * 100).toFixed(0)}%</div>
                            <div className="w-20 text-xs text-gray-500">{item.visibility}</div>
                          </div>
                        ))}
                      </div>
                      {deliberation.collapseTrack.failureEnvelope.minorityHarmMatrix.length === 0 && (
                        <div className="text-center text-gray-500 py-8">
                          No disproportionate minority harm detected
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'narrative' && (
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Narrative Attack Simulator</h3>
                      <p className="text-sm text-gray-400 mb-4">
                        How would this policy be framed to destroy public trust?
                      </p>
                      <div className="space-y-3">
                        {deliberation.collapseTrack.failureEnvelope.narrativeAttacks.map((attack, i) => (
                          <div key={i} className="p-4 bg-gray-700/50 rounded-lg border-l-4 border-red-500">
                            <div className="font-medium text-lg">"{attack.headline}"</div>
                            <div className="mt-2 flex items-center gap-4 text-sm text-gray-400">
                              <span>Trigger: {attack.emotionalTrigger}</span>
                              <span>Virality: {(attack.virality * 100).toFixed(0)}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'agents' && (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Collapse Agents</h3>
                        <span className="text-sm text-gray-400">{agents.length} agents across 7 failure domains</span>
                      </div>
                      
                      {/* Agent Domain Categories */}
                      <div className="mb-4 flex flex-wrap gap-2">
                        <span className="px-2 py-1 text-xs bg-purple-500/20 text-purple-400 rounded">Legitimacy & Trust</span>
                        <span className="px-2 py-1 text-xs bg-red-500/20 text-red-400 rounded">Civil Liberties ⚠️</span>
                        <span className="px-2 py-1 text-xs bg-blue-500/20 text-blue-400 rounded">Equity & Protection</span>
                        <span className="px-2 py-1 text-xs bg-orange-500/20 text-orange-400 rounded">Political & Narrative</span>
                        <span className="px-2 py-1 text-xs bg-yellow-500/20 text-yellow-400 rounded">Economic & Systemic</span>
                        <span className="px-2 py-1 text-xs bg-green-500/20 text-green-400 rounded">Temporal & Environmental</span>
                        <span className="px-2 py-1 text-xs bg-gray-500/20 text-gray-400 rounded">Abuse & Misuse</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
                        {agents.map((agent) => {
                          const isNonOverridable = agent.type.includes('FREE_SPEECH') || agent.type.includes('MINORITY_HARM');
                          return (
                            <div key={agent.type} className={`p-3 rounded-lg ${isNonOverridable ? 'bg-red-900/30 border border-red-500/30' : 'bg-gray-700/50'}`}>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-sm">{agent.type.replace(/_/g, ' ')}</span>
                                {isNonOverridable && <span className="text-xs px-1 py-0.5 bg-red-500/30 text-red-300 rounded">NON-OVERRIDABLE</span>}
                              </div>
                              <p className="text-xs text-gray-400 line-clamp-2">{agent.description}</p>
                              <div className="mt-2">
                                {(agent.questions || []).slice(0, 1).map((q, i) => (
                                  <div key={i} className="text-xs text-gray-500 italic">"{q}"</div>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Critical Findings */}
                {deliberation.collapseTrack.criticalFindings.length > 0 && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-red-400 flex items-center gap-2 mb-3">
                      <AlertOctagon className="w-5 h-5" />
                      Critical Findings
                    </h3>
                    <ul className="space-y-2">
                      {deliberation.collapseTrack.criticalFindings.map((finding, i) => (
                        <li key={i} className="text-sm text-red-300 flex items-start gap-2">
                          <span className="text-red-500 mt-1">•</span>
                          {finding}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-gray-800 rounded-xl p-12 border border-gray-700 text-center">
                <div className="inline-flex p-4 bg-gray-700 rounded-full mb-4">
                  <Shield className="w-12 h-12 text-gray-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No Analysis Yet</h3>
                <p className="text-gray-400 max-w-md mx-auto">
                  Configure a policy decision and run the collapse analysis to discover failure modes,
                  minority harm risks, and legitimacy collapse scenarios.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* IMPOSSIBLE_DEMO Modals */}
        {/* COLLAPSE Analytics Drill-Down */}
        <ReportSection
          title="Policy Collapse Analytics"
          subtitle="Failure envelope analysis, trust delta trends, and legitimacy insights"
          icon={<AlertTriangle className="w-4 h-4 text-red-400" />}
          tableColumns={[
            { key: 'dimension', label: 'Collapse Dimension', sortable: true },
            { key: 'trustDelta', label: 'Trust Delta', sortable: true, align: 'right' as const, render: (v: number) => <span className={v < 0 ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'}>{v > 0 ? '+' : ''}{v}%</span> },
            { key: 'failureProb', label: 'Failure Prob', align: 'right' as const, render: (v: number) => <StatusBadge status={v >= 60 ? 'error' : v >= 30 ? 'warning' : 'success'} label={`${v}%`} /> },
            { key: 'minorityImpact', label: 'Minority Impact', render: (v: string) => <StatusBadge status={v === 'high' ? 'error' : v === 'medium' ? 'warning' : 'success'} label={v} /> },
            { key: 'reversible', label: 'Reversible', render: (v: boolean) => v ? <span className="text-emerald-400">Yes</span> : <span className="text-red-400">No</span> },
          ]}
          tableData={[
            { id: '1', dimension: 'Public Trust Erosion', trustDelta: -18, failureProb: 45, minorityImpact: 'high', reversible: false },
            { id: '2', dimension: 'Regulatory Backlash', trustDelta: -12, failureProb: 35, minorityImpact: 'medium', reversible: true },
            { id: '3', dimension: 'Media Narrative Attack', trustDelta: -25, failureProb: 62, minorityImpact: 'high', reversible: false },
            { id: '4', dimension: 'Internal Legitimacy Crisis', trustDelta: -8, failureProb: 22, minorityImpact: 'low', reversible: true },
            { id: '5', dimension: 'Stakeholder Revolt', trustDelta: -15, failureProb: 38, minorityImpact: 'medium', reversible: true },
            { id: '6', dimension: 'Competitive Exploit', trustDelta: -5, failureProb: 18, minorityImpact: 'low', reversible: true },
          ]}
          chartData={[
            { label: 'Public Trust', value: 45, color: 'bg-red-500' },
            { label: 'Regulatory', value: 35, color: 'bg-amber-500' },
            { label: 'Narrative Attack', value: 62, color: 'bg-red-500' },
            { label: 'Internal Legitimacy', value: 22, color: 'bg-blue-500' },
            { label: 'Stakeholder Revolt', value: 38, color: 'bg-amber-500' },
            { label: 'Competitive Exploit', value: 18, color: 'bg-emerald-500' },
          ]}
          chartTitle="Failure Probability by Dimension"
          poiItems={[
            { id: 'c1', title: 'Narrative attack is highest-risk vector', description: 'Media narrative attacks have 62% failure probability and -25% trust delta. Pre-emptive communication strategy recommended.', severity: 'critical' as const, metric: '62%', metricLabel: 'failure prob', action: 'Deploy narrative defense' },
            { id: 'c2', title: '2 irreversible collapse vectors detected', description: 'Public Trust Erosion and Narrative Attack are flagged as non-reversible. These require prevention rather than recovery strategies.', severity: 'high' as const, metric: '2', metricLabel: 'irreversible' },
            { id: 'c3', title: 'Competitive exploit is contained', description: 'Low failure probability (18%) and minor trust impact. Current competitive intelligence posture is adequate.', severity: 'positive' as const, metric: '18%', metricLabel: 'failure prob' },
          ]}
          defaultView="table"
        />

        <OverrideModal
          isOpen={showOverrideModal}
          onClose={() => setShowOverrideModal(false)}
          onSubmit={submitOverride}
          loading={loading}
          deliberation={deliberation}
          authority={overrideAuthority}
          setAuthority={setOverrideAuthority}
          justification={overrideJustification}
          setJustification={setOverrideJustification}
          acceptedRisks={acceptedRisks}
          toggleRisk={toggleRisk}
          availableRisks={getAvailableRisks()}
          acknowledged={riskAcknowledgment}
          setAcknowledged={setRiskAcknowledgment}
        />

        <VerificationPanel
          isOpen={showVerificationPanel}
          onClose={() => setShowVerificationPanel(false)}
          result={verificationResult}
          bundle={uploadedBundle}
        />

        {/* Override Record Display */}
        {overrideRecord && (
          <div className="fixed bottom-4 right-4 max-w-md bg-gray-900 border border-green-500/50 rounded-xl p-4 shadow-xl z-40">
            <div className="flex items-center gap-2 mb-2">
              <FileSignature className="w-5 h-5 text-green-400" />
              <span className="font-semibold text-green-400">Override Recorded</span>
              <button
                onClick={() => setOverrideRecord(null)}
                className="ml-auto text-gray-400 hover:text-white"
              >
                ×
              </button>
            </div>
            <div className="text-xs space-y-1 text-gray-300">
              <div>ID: <span className="font-mono">{overrideRecord.id}</span></div>
              <div>Authority: {overrideRecord.humanAuthority.name}</div>
              <div>Signed: {new Date(overrideRecord.signedAt).toLocaleString()}</div>
              <div className="font-mono text-[10px] text-gray-500 break-all">
                Signature: {overrideRecord.signature}
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Analytics */}
        <div className="space-y-6 mt-8 border-t border-cyan-900/30 pt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2"><ShieldAlert className="w-5 h-5 text-cyan-400" /> Enhanced Analytics</h2>
            <div className="flex items-center gap-2">
              <SavedViewManager pageId="collapse" currentFilters={{}} onLoadView={() => {}} />
              <ExportToolbar data={[]} columns={[{ key: 'dimension', label: 'Dimension' }, { key: 'probability', label: 'Failure Prob' }, { key: 'trustDelta', label: 'Trust Delta' }]} filename="collapse-analysis" />
              <PDFExportButton title="COLLAPSE Analysis Report" subtitle="Institutional Failure Envelope & Trust Delta Assessment" sections={[{ heading: 'Collapse Risk Overview', content: 'COLLAPSE engine analyzes institutional failure modes across regulatory, operational, reputational, and competitive dimensions.', metrics: [{ label: 'Trust Delta', value: deliberation ? '+0.8' : 'N/A' }, { label: 'Collapse Risk', value: deliberation ? '22%' : 'N/A' }, { label: 'Consensus', value: `${(consensusConfidence * 100).toFixed(0)}%` }] }]} />
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricWithSparkline title="Trust Delta" value={deliberation ? '+0.8' : '—'} trend={[-3.2, -2.8, -2.1, -1.5, -0.8, -0.3, 0.2, 0.8]} change={12.5} color="#22d3ee" />
            <MetricWithSparkline title="Collapse Risk" value={deliberation ? '22%' : '—'} trend={[45, 42, 38, 35, 32, 28, 25, 22]} change={-12} color="#f87171" inverted />
            <MetricWithSparkline title="Consensus" value={`${(consensusConfidence * 100).toFixed(0)}%`} trend={[72, 74, 76, 78, 80, 82, 84, 86]} change={5.6} color="#34d399" />
            <MetricWithSparkline title="Simulations" value="24" trend={[8, 10, 12, 14, 16, 18, 21, 24]} change={14.3} color="#a78bfa" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <HeatmapCalendar title="Collapse Simulation Activity" subtitle="Daily failure envelope simulation runs" valueLabel="simulations" data={Array.from({ length: 180 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() - (180 - i)); return { date: d.toISOString().split('T')[0], value: Math.floor(Math.random() * 5) }; })} weeks={26} />
            <ComparisonPanel title="Trust Trajectory" labelA="60 Days Ago" labelB="Current" items={[{ label: 'Trust Delta', valueA: -2.1, valueB: 0.8, format: 'number', higherIsBetter: true }, { label: 'Collapse Risk', valueA: 38, valueB: 22, format: 'percent', higherIsBetter: false }, { label: 'Failure Vectors', valueA: 8, valueB: 6, format: 'number', higherIsBetter: false }, { label: 'Mitigation Coverage', valueA: 65, valueB: 82, format: 'percent', higherIsBetter: true }]} />
          </div>
          <AuditTimeline title="COLLAPSE Audit Trail" events={[{ id: 'cl1', timestamp: new Date(Date.now() - 600000), type: 'system', title: 'Trust delta recalculated', description: 'Automated trust delta computation completed. Overall trajectory: improving.', actor: 'COLLAPSE Engine' }, { id: 'cl2', timestamp: new Date(Date.now() - 3600000), type: 'alert', title: 'Irreversible vector flagged', description: 'Public Trust Erosion pathway flagged as non-reversible. Prevention strategy required.', severity: 'critical' }, { id: 'cl3', timestamp: new Date(Date.now() - 7200000), type: 'override', title: 'Human override on regulatory risk', description: 'GC accepted elevated regulatory risk for EU expansion with documented justification', actor: 'M. Santos (GC)', severity: 'medium' }]} maxVisible={3} />
        </div>
      </div>
    </div>
  );
};

// Human Override Modal
const OverrideModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  loading: boolean;
  deliberation: Deliberation | null;
  authority: HumanAuthority;
  setAuthority: (a: HumanAuthority) => void;
  justification: string;
  setJustification: (j: string) => void;
  acceptedRisks: string[];
  toggleRisk: (r: string) => void;
  availableRisks: string[];
  acknowledged: boolean;
  setAcknowledged: (a: boolean) => void;
}> = ({
  isOpen,
  onClose,
  onSubmit,
  loading,
  deliberation,
  authority,
  setAuthority,
  justification,
  setJustification,
  acceptedRisks,
  toggleRisk,
  availableRisks,
  acknowledged,
  setAcknowledged,
}) => {
  if (!isOpen || !deliberation) {return null;}

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl border border-red-500/50 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-red-500/30">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500/20 rounded-lg">
              <ShieldAlert className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-red-400">Human Override Required</h2>
              <p className="text-sm text-gray-400">Trust Delta is NEGATIVE. Deployment not recommended.</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Warning Banner */}
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
            <p className="text-sm text-red-300">
              <strong>Warning:</strong> The AI system recommends <strong>DO NOT DEPLOY</strong>.
              By proceeding, you accept institutional responsibility for the risks identified.
            </p>
          </div>

          {/* Authority Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Fingerprint className="w-5 h-5 text-cyan-400" />
              Human Authority
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Full Name *"
                value={authority.name}
                onChange={(e) => setAuthority({ ...authority, name: e.target.value })}
                className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
              />
              <input
                type="text"
                placeholder="Title *"
                value={authority.title}
                onChange={(e) => setAuthority({ ...authority, title: e.target.value })}
                className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
              />
              <input
                type="email"
                placeholder="Email *"
                value={authority.email}
                onChange={(e) => setAuthority({ ...authority, email: e.target.value })}
                className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
              />
              <input
                type="text"
                placeholder="Department *"
                value={authority.department}
                onChange={(e) => setAuthority({ ...authority, department: e.target.value })}
                className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
              />
            </div>
          </div>

          {/* Justification */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Override Justification *</h3>
            <textarea
              placeholder="Explain why you are overriding the AI recommendation..."
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              rows={4}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white resize-none"
            />
          </div>

          {/* Risk Acceptance */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Risks Being Accepted *</h3>
            <div className="space-y-2">
              {availableRisks.map((risk) => (
                <label key={risk} className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700">
                  <input
                    type="checkbox"
                    checked={acceptedRisks.includes(risk)}
                    onChange={() => toggleRisk(risk)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">{risk.replace(/_/g, ' ')}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Final Acknowledgment */}
          <div className="bg-gray-800 rounded-lg p-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={acknowledged}
                onChange={(e) => setAcknowledged(e.target.checked)}
                className="w-5 h-5 mt-0.5"
              />
              <span className="text-sm text-gray-300">
                <strong className="text-red-400">I understand and accept institutional responsibility</strong> for the 
                risks identified by the Collapse Mode analysis. This decision will be cryptographically signed 
                and recorded as part of the permanent audit trail.
              </span>
            </label>
          </div>
        </div>

        <div className="p-6 border-t border-gray-700 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            disabled={loading || !authority.name || !justification || acceptedRisks.length === 0 || !acknowledged}
            className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <FileSignature className="w-5 h-5" />}
            Sign Override
          </button>
        </div>
      </div>
    </div>
  );
};

// Verification Panel Component
const VerificationPanel: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  result: VerificationResult | null;
  bundle: any;
}> = ({ isOpen, onClose, result, bundle }) => {
  if (!isOpen || !result) {return null;}

  const getScoreColor = (score: number) => {
    if (score === 100) {return 'text-green-400';}
    if (score >= 80) {return 'text-yellow-400';}
    return 'text-red-400';
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl border border-cyan-500/50 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-cyan-500/30">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-500/20 rounded-lg">
              <FileCheck className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-cyan-400">Audit Bundle Verification</h2>
              <p className="text-sm text-gray-400">Independent integrity verification results</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Score */}
          <div className="text-center p-6 bg-gray-800 rounded-xl">
            <div className={`text-6xl font-bold ${getScoreColor(result.integrityScore)}`}>
              {result.integrityScore}/100
            </div>
            <div className="text-gray-400 mt-2">Integrity Score</div>
            <div className={`mt-2 text-lg font-medium ${getScoreColor(result.integrityScore)}`}>
              {result.integrityScore === 100 ? '✓ VERIFIED - Authentic & Untampered' :
               result.integrityScore >= 80 ? '⚠ PARTIAL - Some checks failed' :
               '✗ FAILED - Integrity compromised'}
            </div>
          </div>

          {/* Checks */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold mb-3">Verification Checks</h3>
            {[
              { label: 'Bundle Format', value: result.bundleFormat },
              { label: 'Metadata Valid', value: result.metaValid },
              { label: 'Packet Valid', value: result.packetValid },
              { label: 'Envelope Present', value: result.envelopePresent },
              { label: 'Checksum Valid', value: result.checksumValid },
              { label: 'Merkle Root Valid', value: result.merkleValid },
            ].map((check) => (
              <div key={check.label} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                <span>{check.label}</span>
                {check.value ? (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-400" />
                )}
              </div>
            ))}
          </div>

          {/* Details */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-sm font-semibold mb-2 text-gray-400">Verification Log</h3>
            <div className="font-mono text-xs space-y-1">
              {result.details.map((detail, i) => (
                <div key={i} className={detail.startsWith('✓') ? 'text-green-400' : detail.startsWith('✗') ? 'text-red-400' : 'text-gray-300'}>
                  {detail}
                </div>
              ))}
            </div>
          </div>

          {/* Bundle Info */}
          {bundle && (
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-sm font-semibold mb-2 text-gray-400">Bundle Information</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-gray-500">Bundle ID:</span>
                <span className="font-mono text-xs">{bundle.meta?.bundleId || 'N/A'}</span>
                <span className="text-gray-500">Generated:</span>
                <span>{bundle.meta?.generatedAt ? new Date(bundle.meta.generatedAt).toLocaleString() : 'N/A'}</span>
                <span className="text-gray-500">Decision ID:</span>
                <span className="font-mono text-xs">{bundle.packet?.decisionId || 'N/A'}</span>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-700">
          <button
            onClick={onClose}
            className="w-full px-4 py-3 bg-cyan-600 hover:bg-cyan-700 rounded-lg font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CollapsePage;
