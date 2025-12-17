// @ts-nocheck
// =============================================================================
// CENDIA LEDGER™ — IMMUTABLE DECISION BLOCKCHAIN
// First AI decision provenance for regulatory audit
// Every deliberation, vote, veto, and confidence score recorded on chain
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
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { governApi, councilApi } from '../../../lib/api';
import { ledgerService, LedgerEntry, DecisionRecord, LedgerMetrics, ChainVerificationResult, ComplianceFramework, LedgerEventType } from '../../../services/LedgerService';

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const LedgerPage: React.FC = () => {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<LedgerEntry[]>(stryMutAct_9fa48("31153") ? ["Stryker was here"] : (stryCov_9fa48("31153"), []));
  const [decisions, setDecisions] = useState<DecisionRecord[]>(stryMutAct_9fa48("31154") ? ["Stryker was here"] : (stryCov_9fa48("31154"), []));
  const [metrics, setMetrics] = useState<LedgerMetrics | null>(null);
  const [chainStatus, setChainStatus] = useState<ChainVerificationResult | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<LedgerEntry | null>(null);
  const [selectedDecision, setSelectedDecision] = useState<DecisionRecord | null>(null);
  const [activeTab, setActiveTab] = useState<'chain' | 'decisions' | 'audit' | 'export'>('chain');
  const [showNewDecision, setShowNewDecision] = useState(stryMutAct_9fa48("31156") ? true : (stryCov_9fa48("31156"), false));
  const [filterFramework, setFilterFramework] = useState<ComplianceFramework | 'all'>('all');
  const [isLoading, setIsLoading] = useState(stryMutAct_9fa48("31158") ? false : (stryCov_9fa48("31158"), true));

  // Fetch real data from APIs
  const loadData = useCallback(async () => {
    setIsLoading(stryMutAct_9fa48("31160") ? false : (stryCov_9fa48("31160"), true));
    try {
      // Fetch real audit data from API
      const [auditsRes, decisionsRes] = await Promise.all(stryMutAct_9fa48("31162") ? [] : (stryCov_9fa48("31162"), [governApi.getAudits(), councilApi.getRecentDecisions(50)]));

      // Map audit entries to ledger entries
      if (stryMutAct_9fa48("31165") ? auditsRes.success && auditsRes.data || Array.isArray(auditsRes.data) : stryMutAct_9fa48("31164") ? false : stryMutAct_9fa48("31163") ? true : (stryCov_9fa48("31163", "31164", "31165"), (stryMutAct_9fa48("31167") ? auditsRes.success || auditsRes.data : stryMutAct_9fa48("31166") ? true : (stryCov_9fa48("31166", "31167"), auditsRes.success && auditsRes.data)) && Array.isArray(auditsRes.data))) {
        const realEntries: LedgerEntry[] = (auditsRes.data as any[]).map(stryMutAct_9fa48("31169") ? () => undefined : (stryCov_9fa48("31169"), (audit, idx) => stryMutAct_9fa48("31170") ? {} : (stryCov_9fa48("31170"), {
          id: audit.id,
          sequence: stryMutAct_9fa48("31171") ? idx - 1 : (stryCov_9fa48("31171"), idx + 1),
          timestamp: new Date(audit.created_at),
          eventType: 'audit.completed' as LedgerEventType,
          decisionId: stryMutAct_9fa48("31174") ? audit.policy_id && 'N/A' : stryMutAct_9fa48("31173") ? false : stryMutAct_9fa48("31172") ? true : (stryCov_9fa48("31172", "31173", "31174"), audit.policy_id || 'N/A'),
          organizationId: audit.organization_id,
          title: `Audit: ${stryMutAct_9fa48("31179") ? audit.audit_type && 'Compliance Check' : stryMutAct_9fa48("31178") ? false : stryMutAct_9fa48("31177") ? true : (stryCov_9fa48("31177", "31178", "31179"), audit.audit_type || 'Compliance Check')}`,
          description: (stryMutAct_9fa48("31181") ? audit.findings.length : (stryCov_9fa48("31181"), audit.findings?.length)) ? `${audit.findings.length} findings` : 'No findings',
          data: audit,
          confidenceScore: stryMutAct_9fa48("31184") ? 100 + (audit.risk_score || 0) : (stryCov_9fa48("31184"), 100 - (stryMutAct_9fa48("31187") ? audit.risk_score && 0 : stryMutAct_9fa48("31186") ? false : stryMutAct_9fa48("31185") ? true : (stryCov_9fa48("31185", "31186", "31187"), audit.risk_score || 0))),
          previousHash: (stryMutAct_9fa48("31191") ? idx <= 0 : stryMutAct_9fa48("31190") ? idx >= 0 : stryMutAct_9fa48("31189") ? false : stryMutAct_9fa48("31188") ? true : (stryCov_9fa48("31188", "31189", "31190", "31191"), idx > 0)) ? `hash-${stryMutAct_9fa48("31193") ? idx + 1 : (stryCov_9fa48("31193"), idx - 1)}` : 'genesis',
          hash: `hash-${idx}`,
          complianceFrameworks: ['SOC2', 'SOX'] as ComplianceFramework[],
          retentionPeriodDays: 2555,
          sensitivityLevel: 'confidential' as const,
          piiInvolved: stryMutAct_9fa48("31196") ? true : (stryCov_9fa48("31196"), false),
          verified: stryMutAct_9fa48("31199") ? audit.status !== 'completed' : stryMutAct_9fa48("31198") ? false : stryMutAct_9fa48("31197") ? true : (stryCov_9fa48("31197", "31198", "31199"), audit.status === 'completed')
        })));
        if (stryMutAct_9fa48("31204") ? realEntries.length <= 0 : stryMutAct_9fa48("31203") ? realEntries.length >= 0 : stryMutAct_9fa48("31202") ? false : stryMutAct_9fa48("31201") ? true : (stryCov_9fa48("31201", "31202", "31203", "31204"), realEntries.length > 0)) {
          setEntries(realEntries);
          console.log('[Ledger] Loaded', realEntries.length, 'audit entries from API');
        } else {
          setEntries(ledgerService.getAllEntries());
        }
      } else {
        setEntries(ledgerService.getAllEntries());
      }

      // Map decisions from council
      if (stryMutAct_9fa48("31212") ? decisionsRes.success && decisionsRes.data || Array.isArray(decisionsRes.data) : stryMutAct_9fa48("31211") ? false : stryMutAct_9fa48("31210") ? true : (stryCov_9fa48("31210", "31211", "31212"), (stryMutAct_9fa48("31214") ? decisionsRes.success || decisionsRes.data : stryMutAct_9fa48("31213") ? true : (stryCov_9fa48("31213", "31214"), decisionsRes.success && decisionsRes.data)) && Array.isArray(decisionsRes.data))) {
        const realDecisions: DecisionRecord[] = (decisionsRes.data as any[]).map(stryMutAct_9fa48("31216") ? () => undefined : (stryCov_9fa48("31216"), d => stryMutAct_9fa48("31217") ? {} : (stryCov_9fa48("31217"), {
          id: d.id,
          title: stryMutAct_9fa48("31220") ? (d.query || d.title) && 'Council Decision' : stryMutAct_9fa48("31219") ? false : stryMutAct_9fa48("31218") ? true : (stryCov_9fa48("31218", "31219", "31220"), (stryMutAct_9fa48("31222") ? d.query && d.title : stryMutAct_9fa48("31221") ? false : (stryCov_9fa48("31221", "31222"), d.query || d.title)) || 'Council Decision'),
          description: stryMutAct_9fa48("31226") ? d.response && 'Decision made by AI Council' : stryMutAct_9fa48("31225") ? false : stryMutAct_9fa48("31224") ? true : (stryCov_9fa48("31224", "31225", "31226"), d.response || 'Decision made by AI Council'),
          proposedBy: 'AI Council',
          proposedAt: new Date(stryMutAct_9fa48("31231") ? d.created_at && d.timestamp : stryMutAct_9fa48("31230") ? false : stryMutAct_9fa48("31229") ? true : (stryCov_9fa48("31229", "31230", "31231"), d.created_at || d.timestamp)),
          status: 'approved' as const,
          agents: stryMutAct_9fa48("31234") ? d.agents?.map((a: any) => a.id || a) && [] : stryMutAct_9fa48("31233") ? false : stryMutAct_9fa48("31232") ? true : (stryCov_9fa48("31232", "31233", "31234"), (stryMutAct_9fa48("31235") ? d.agents.map((a: any) => a.id || a) : (stryCov_9fa48("31235"), d.agents?.map(stryMutAct_9fa48("31236") ? () => undefined : (stryCov_9fa48("31236"), (a: any) => stryMutAct_9fa48("31239") ? a.id && a : stryMutAct_9fa48("31238") ? false : stryMutAct_9fa48("31237") ? true : (stryCov_9fa48("31237", "31238", "31239"), a.id || a))))) || (stryMutAct_9fa48("31240") ? ["Stryker was here"] : (stryCov_9fa48("31240"), []))),
          voters: stryMutAct_9fa48("31241") ? ["Stryker was here"] : (stryCov_9fa48("31241"), []),
          finalConfidence: stryMutAct_9fa48("31244") ? d.confidence && 85 : stryMutAct_9fa48("31243") ? false : stryMutAct_9fa48("31242") ? true : (stryCov_9fa48("31242", "31243", "31244"), d.confidence || 85),
          ledgerEntries: stryMutAct_9fa48("31245") ? ["Stryker was here"] : (stryCov_9fa48("31245"), []),
          firstEntryHash: 'genesis',
          latestEntryHash: `hash-${d.id}`,
          complianceStatus: 'compliant' as const,
          auditHistory: stryMutAct_9fa48("31248") ? ["Stryker was here"] : (stryCov_9fa48("31248"), [])
        })));
        if (stryMutAct_9fa48("31252") ? realDecisions.length <= 0 : stryMutAct_9fa48("31251") ? realDecisions.length >= 0 : stryMutAct_9fa48("31250") ? false : stryMutAct_9fa48("31249") ? true : (stryCov_9fa48("31249", "31250", "31251", "31252"), realDecisions.length > 0)) {
          setDecisions(realDecisions);
          console.log('[Ledger] Loaded', realDecisions.length, 'decisions from API');
        } else {
          setDecisions(ledgerService.getAllDecisions());
        }
      } else {
        setDecisions(ledgerService.getAllDecisions());
      }

      // Calculate metrics from real data
      setMetrics(ledgerService.getMetrics());
      setChainStatus(ledgerService.verifyChain());
    } catch (error) {
      console.error('[Ledger] Failed to load data, using fallback:', error);
      setEntries(ledgerService.getAllEntries());
      setDecisions(ledgerService.getAllDecisions());
      setMetrics(ledgerService.getMetrics());
      setChainStatus(ledgerService.verifyChain());
    } finally {
      setIsLoading(stryMutAct_9fa48("31261") ? true : (stryCov_9fa48("31261"), false));
    }
  }, stryMutAct_9fa48("31262") ? ["Stryker was here"] : (stryCov_9fa48("31262"), []));
  useEffect(() => {
    loadData();
  }, stryMutAct_9fa48("31264") ? [] : (stryCov_9fa48("31264"), [loadData]));
  const getEventIcon = (type: LedgerEventType) => {
    const icons: Record<string, string> = stryMutAct_9fa48("31266") ? {} : (stryCov_9fa48("31266"), {
      'decision.proposed': '📋',
      'decision.deliberated': '💭',
      'decision.voted': '🗳️',
      'decision.vetoed': '⛔',
      'decision.approved': '✅',
      'decision.executed': '🚀',
      'decision.outcome_recorded': '📊',
      'agent.joined': '🤖',
      'agent.contributed': '💬',
      'agent.voted': '✋',
      'agent.vetoed': '🛑',
      'confidence.updated': '📈',
      'evidence.attached': '📎',
      'audit.requested': '🔍',
      'audit.completed': '✔️',
      'compliance.check': '📋',
      'override.requested': '⚠️',
      'override.approved': '✅',
      'override.denied': '❌'
    });
    return stryMutAct_9fa48("31288") ? icons[type] && '📝' : stryMutAct_9fa48("31287") ? false : stryMutAct_9fa48("31286") ? true : (stryCov_9fa48("31286", "31287", "31288"), icons[type] || '📝');
  };
  const getEventColor = (type: LedgerEventType) => {
    if (stryMutAct_9fa48("31293") ? type.includes('vetoed') && type.includes('denied') : stryMutAct_9fa48("31292") ? false : stryMutAct_9fa48("31291") ? true : (stryCov_9fa48("31291", "31292", "31293"), type.includes('vetoed') || type.includes('denied'))) {
      return 'border-red-600/50 bg-red-900/20';
    }
    if (stryMutAct_9fa48("31300") ? type.includes('approved') && type.includes('completed') : stryMutAct_9fa48("31299") ? false : stryMutAct_9fa48("31298") ? true : (stryCov_9fa48("31298", "31299", "31300"), type.includes('approved') || type.includes('completed'))) {
      return 'border-green-600/50 bg-green-900/20';
    }
    if (stryMutAct_9fa48("31307") ? type.includes('voted') && type.includes('contributed') : stryMutAct_9fa48("31306") ? false : stryMutAct_9fa48("31305") ? true : (stryCov_9fa48("31305", "31306", "31307"), type.includes('voted') || type.includes('contributed'))) {
      return 'border-blue-600/50 bg-blue-900/20';
    }
    if (stryMutAct_9fa48("31314") ? type.includes('audit') && type.includes('compliance') : stryMutAct_9fa48("31313") ? false : stryMutAct_9fa48("31312") ? true : (stryCov_9fa48("31312", "31313", "31314"), type.includes('audit') || type.includes('compliance'))) {
      return 'border-purple-600/50 bg-purple-900/20';
    }
    return 'border-amber-600/50 bg-amber-900/20';
  };
  const filteredEntries = (stryMutAct_9fa48("31322") ? filterFramework !== 'all' : stryMutAct_9fa48("31321") ? false : stryMutAct_9fa48("31320") ? true : (stryCov_9fa48("31320", "31321", "31322"), filterFramework === 'all')) ? entries : stryMutAct_9fa48("31324") ? entries : (stryCov_9fa48("31324"), entries.filter(stryMutAct_9fa48("31325") ? () => undefined : (stryCov_9fa48("31325"), e => e.complianceFrameworks.includes(filterFramework))));
  const handleExport = (decisionId: string) => {
    const json = ledgerService.exportForAudit(decisionId);
    const blob = new Blob(stryMutAct_9fa48("31327") ? [] : (stryCov_9fa48("31327"), [json]), stryMutAct_9fa48("31328") ? {} : (stryCov_9fa48("31328"), {
      type: 'application/json'
    }));
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-export-${decisionId}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };
  return <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-emerald-800/50 bg-black/20 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={stryMutAct_9fa48("31332") ? () => undefined : (stryCov_9fa48("31332"), () => navigate('/cortex/dashboard'))} className="text-white/60 hover:text-white transition-colors">
                ← Back
              </button>
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-3">
                  <span className="text-3xl">⛓️</span>
                  CendiaLedger™
                  <span className="text-xs bg-gradient-to-r from-emerald-500 to-cyan-500 px-2 py-0.5 rounded-full font-medium">
                    BLOCKCHAIN
                  </span>
                </h1>
                <p className="text-emerald-300 text-sm">Immutable Decision Blockchain • Regulatory Audit Trail</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {stryMutAct_9fa48("31336") ? chainStatus || <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${chainStatus.valid ? 'bg-green-900/50' : 'bg-red-900/50'}`}>
                  <div className={`w-2 h-2 rounded-full ${chainStatus.valid ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
                  <span className="text-xs">{chainStatus.valid ? 'Chain Valid' : 'Chain Broken!'}</span>
                </div> : stryMutAct_9fa48("31335") ? false : stryMutAct_9fa48("31334") ? true : (stryCov_9fa48("31334", "31335", "31336"), chainStatus && <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${chainStatus.valid ? 'bg-green-900/50' : 'bg-red-900/50'}`}>
                  <div className={`w-2 h-2 rounded-full ${chainStatus.valid ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
                  <span className="text-xs">{chainStatus.valid ? 'Chain Valid' : 'Chain Broken!'}</span>
                </div>)}
              <button onClick={stryMutAct_9fa48("31345") ? () => undefined : (stryCov_9fa48("31345"), () => setShowNewDecision(stryMutAct_9fa48("31346") ? false : (stryCov_9fa48("31346"), true)))} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg font-medium transition-colors">
                + New Decision
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Metrics Bar */}
      {stryMutAct_9fa48("31349") ? metrics || <div className="bg-gradient-to-r from-emerald-900/30 to-cyan-900/30 border-b border-emerald-800/30">
          <div className="max-w-7xl mx-auto px-6 py-3">
            <div className="grid grid-cols-7 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-white">{metrics.totalEntries}</div>
                <div className="text-xs text-emerald-300">Total Entries</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-cyan-400">{metrics.totalDecisions}</div>
                <div className="text-xs text-emerald-300">Decisions</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-400">{metrics.approvalRate}%</div>
                <div className="text-xs text-emerald-300">Approval Rate</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-400">{metrics.vetoRate}%</div>
                <div className="text-xs text-emerald-300">Veto Rate</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-400">{metrics.averageConfidence}%</div>
                <div className="text-xs text-emerald-300">Avg Confidence</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-amber-400">{metrics.piiEntriesCount}</div>
                <div className="text-xs text-emerald-300">PII Entries</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-400">{metrics.pendingAudits}</div>
                <div className="text-xs text-emerald-300">Pending Audits</div>
              </div>
            </div>
          </div>
        </div> : stryMutAct_9fa48("31348") ? false : stryMutAct_9fa48("31347") ? true : (stryCov_9fa48("31347", "31348", "31349"), metrics && <div className="bg-gradient-to-r from-emerald-900/30 to-cyan-900/30 border-b border-emerald-800/30">
          <div className="max-w-7xl mx-auto px-6 py-3">
            <div className="grid grid-cols-7 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-white">{metrics.totalEntries}</div>
                <div className="text-xs text-emerald-300">Total Entries</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-cyan-400">{metrics.totalDecisions}</div>
                <div className="text-xs text-emerald-300">Decisions</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-400">{metrics.approvalRate}%</div>
                <div className="text-xs text-emerald-300">Approval Rate</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-400">{metrics.vetoRate}%</div>
                <div className="text-xs text-emerald-300">Veto Rate</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-400">{metrics.averageConfidence}%</div>
                <div className="text-xs text-emerald-300">Avg Confidence</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-amber-400">{metrics.piiEntriesCount}</div>
                <div className="text-xs text-emerald-300">PII Entries</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-400">{metrics.pendingAudits}</div>
                <div className="text-xs text-emerald-300">Pending Audits</div>
              </div>
            </div>
          </div>
        </div>)}

      {/* Tabs */}
      <div className="border-b border-emerald-800/30 bg-black/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1">
            {(['chain', 'decisions', 'audit', 'export'] as const).map(stryMutAct_9fa48("31350") ? () => undefined : (stryCov_9fa48("31350"), tab => <button key={tab} onClick={stryMutAct_9fa48("31351") ? () => undefined : (stryCov_9fa48("31351"), () => setActiveTab(tab))} className={`px-4 py-3 text-sm font-medium transition-colors ${(stryMutAct_9fa48("31355") ? activeTab !== tab : stryMutAct_9fa48("31354") ? false : stryMutAct_9fa48("31353") ? true : (stryCov_9fa48("31353", "31354", "31355"), activeTab === tab)) ? 'text-white border-b-2 border-emerald-500' : 'text-white/60 hover:text-white'}`}>
                {stryMutAct_9fa48("31358") ? tab.charAt(0).toUpperCase() - tab.slice(1) : (stryCov_9fa48("31358"), (stryMutAct_9fa48("31360") ? tab.toUpperCase() : stryMutAct_9fa48("31359") ? tab.charAt(0).toLowerCase() : (stryCov_9fa48("31359", "31360"), tab.charAt(0).toUpperCase())) + (stryMutAct_9fa48("31361") ? tab : (stryCov_9fa48("31361"), tab.slice(1))))}
              </button>))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {stryMutAct_9fa48("31364") ? activeTab === 'chain' || <div className="grid grid-cols-3 gap-6">
            {/* Chain Visualization */}
            <div className="col-span-2 bg-black/30 rounded-2xl p-6 border border-emerald-800/50">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold">Blockchain Entries</h2>
                <select value={filterFramework} onChange={e => setFilterFramework(e.target.value as ComplianceFramework | 'all')} className="px-3 py-1.5 bg-black/30 border border-emerald-700/50 rounded-lg text-sm">
                  <option value="all">All Frameworks</option>
                  <option value="GDPR">GDPR</option>
                  <option value="SOX">SOX</option>
                  <option value="HIPAA">HIPAA</option>
                  <option value="SOC2">SOC2</option>
                  <option value="ISO27001">ISO27001</option>
                </select>
              </div>

              <div className="relative">
                {/* Chain line */}
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-emerald-700/50" />
                
                <div className="space-y-4">
                  {filteredEntries.slice(0, 20).map((entry, i) => <div key={entry.id} onClick={() => setSelectedEntry(entry)} className={`relative pl-14 cursor-pointer group`}>
                      {/* Chain node */}
                      <div className={`absolute left-4 w-5 h-5 rounded-full border-2 ${entry.verified ? 'border-green-500 bg-green-900' : 'border-emerald-500 bg-emerald-900'} flex items-center justify-center text-xs`}>
                        {i + 1}
                      </div>
                      
                      <div className={`p-4 rounded-xl border ${getEventColor(entry.eventType)} group-hover:border-emerald-400 transition-colors`}>
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{getEventIcon(entry.eventType)}</span>
                            <div>
                              <h3 className="font-semibold text-sm">{entry.title}</h3>
                              <p className="text-xs text-white/50">{entry.eventType}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-white/40">{entry.timestamp.toLocaleString()}</div>
                            {entry.confidenceScore !== undefined && <div className="text-xs text-emerald-400">{entry.confidenceScore}% confidence</div>}
                          </div>
                        </div>
                        <p className="text-sm text-white/70 line-clamp-2">{entry.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <code className="text-xs text-emerald-400 font-mono bg-black/30 px-2 py-0.5 rounded">
                            {entry.hash.substring(0, 12)}...
                          </code>
                          {entry.verified && <span className="text-xs text-green-400">✓ Verified</span>}
                          {entry.complianceFrameworks.map(f => <span key={f} className="text-xs bg-purple-900/50 px-1.5 py-0.5 rounded">{f}</span>)}
                        </div>
                      </div>
                    </div>)}
                  
                  {entries.length === 0 && <div className="text-center py-12 text-white/40">
                      No entries yet. Create a decision to start the chain.
                    </div>}
                </div>
              </div>
            </div>

            {/* Chain Stats */}
            <div className="space-y-6">
              <div className="bg-black/30 rounded-2xl p-6 border border-emerald-800/50">
                <h2 className="text-lg font-bold mb-4">Chain Integrity</h2>
                {chainStatus && <div className={`p-4 rounded-xl ${chainStatus.valid ? 'bg-green-900/30 border border-green-600/50' : 'bg-red-900/30 border border-red-600/50'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{chainStatus.valid ? '✅' : '❌'}</span>
                      <span className="font-bold">{chainStatus.valid ? 'Chain Valid' : 'Chain Broken'}</span>
                    </div>
                    <p className="text-sm text-white/70">{chainStatus.message}</p>
                    <div className="mt-2 text-xs text-white/50">
                      Entries checked: {chainStatus.entriesChecked}
                    </div>
                  </div>}
                <button onClick={() => setChainStatus(ledgerService.verifyChain())} className="mt-4 w-full py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-sm">
                  🔄 Verify Chain
                </button>
              </div>

              <div className="bg-black/30 rounded-2xl p-6 border border-emerald-800/50">
                <h2 className="text-lg font-bold mb-4">Compliance Coverage</h2>
                {metrics && <div className="space-y-2">
                    {Object.entries(metrics.entriesByFramework).map(([framework, count]) => <div key={framework} className="flex items-center justify-between">
                        <span className="text-sm">{framework}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-black/30 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500" style={{
                      width: `${Math.min(100, count / Math.max(1, metrics.totalEntries) * 100)}%`
                    }} />
                          </div>
                          <span className="text-xs text-white/50 w-8">{count}</span>
                        </div>
                      </div>)}
                  </div>}
              </div>

              <div className="bg-black/30 rounded-2xl p-6 border border-emerald-800/50">
                <h2 className="text-lg font-bold mb-4">Recent Activity</h2>
                <div className="space-y-2">
                  {entries.slice(0, 5).map(e => <div key={e.id} className="flex items-center gap-2 text-sm">
                      <span>{getEventIcon(e.eventType)}</span>
                      <span className="flex-1 truncate">{e.title}</span>
                      <span className="text-xs text-white/40">{e.timestamp.toLocaleTimeString()}</span>
                    </div>)}
                </div>
              </div>
            </div>
          </div> : stryMutAct_9fa48("31363") ? false : stryMutAct_9fa48("31362") ? true : (stryCov_9fa48("31362", "31363", "31364"), (stryMutAct_9fa48("31366") ? activeTab !== 'chain' : stryMutAct_9fa48("31365") ? true : (stryCov_9fa48("31365", "31366"), activeTab === 'chain')) && <div className="grid grid-cols-3 gap-6">
            {/* Chain Visualization */}
            <div className="col-span-2 bg-black/30 rounded-2xl p-6 border border-emerald-800/50">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold">Blockchain Entries</h2>
                <select value={filterFramework} onChange={stryMutAct_9fa48("31368") ? () => undefined : (stryCov_9fa48("31368"), e => setFilterFramework(e.target.value as ComplianceFramework | 'all'))} className="px-3 py-1.5 bg-black/30 border border-emerald-700/50 rounded-lg text-sm">
                  <option value="all">All Frameworks</option>
                  <option value="GDPR">GDPR</option>
                  <option value="SOX">SOX</option>
                  <option value="HIPAA">HIPAA</option>
                  <option value="SOC2">SOC2</option>
                  <option value="ISO27001">ISO27001</option>
                </select>
              </div>

              <div className="relative">
                {/* Chain line */}
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-emerald-700/50" />
                
                <div className="space-y-4">
                  {stryMutAct_9fa48("31369") ? filteredEntries.map((entry, i) => <div key={entry.id} onClick={() => setSelectedEntry(entry)} className={`relative pl-14 cursor-pointer group`}>
                      {/* Chain node */}
                      <div className={`absolute left-4 w-5 h-5 rounded-full border-2 ${entry.verified ? 'border-green-500 bg-green-900' : 'border-emerald-500 bg-emerald-900'} flex items-center justify-center text-xs`}>
                        {i + 1}
                      </div>
                      
                      <div className={`p-4 rounded-xl border ${getEventColor(entry.eventType)} group-hover:border-emerald-400 transition-colors`}>
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{getEventIcon(entry.eventType)}</span>
                            <div>
                              <h3 className="font-semibold text-sm">{entry.title}</h3>
                              <p className="text-xs text-white/50">{entry.eventType}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-white/40">{entry.timestamp.toLocaleString()}</div>
                            {entry.confidenceScore !== undefined && <div className="text-xs text-emerald-400">{entry.confidenceScore}% confidence</div>}
                          </div>
                        </div>
                        <p className="text-sm text-white/70 line-clamp-2">{entry.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <code className="text-xs text-emerald-400 font-mono bg-black/30 px-2 py-0.5 rounded">
                            {entry.hash.substring(0, 12)}...
                          </code>
                          {entry.verified && <span className="text-xs text-green-400">✓ Verified</span>}
                          {entry.complianceFrameworks.map(f => <span key={f} className="text-xs bg-purple-900/50 px-1.5 py-0.5 rounded">{f}</span>)}
                        </div>
                      </div>
                    </div>) : (stryCov_9fa48("31369"), filteredEntries.slice(0, 20).map(stryMutAct_9fa48("31370") ? () => undefined : (stryCov_9fa48("31370"), (entry, i) => <div key={entry.id} onClick={stryMutAct_9fa48("31371") ? () => undefined : (stryCov_9fa48("31371"), () => setSelectedEntry(entry))} className={`relative pl-14 cursor-pointer group`}>
                      {/* Chain node */}
                      <div className={`absolute left-4 w-5 h-5 rounded-full border-2 ${entry.verified ? 'border-green-500 bg-green-900' : 'border-emerald-500 bg-emerald-900'} flex items-center justify-center text-xs`}>
                        {stryMutAct_9fa48("31376") ? i - 1 : (stryCov_9fa48("31376"), i + 1)}
                      </div>
                      
                      <div className={`p-4 rounded-xl border ${getEventColor(entry.eventType)} group-hover:border-emerald-400 transition-colors`}>
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{getEventIcon(entry.eventType)}</span>
                            <div>
                              <h3 className="font-semibold text-sm">{entry.title}</h3>
                              <p className="text-xs text-white/50">{entry.eventType}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-white/40">{entry.timestamp.toLocaleString()}</div>
                            {stryMutAct_9fa48("31380") ? entry.confidenceScore !== undefined || <div className="text-xs text-emerald-400">{entry.confidenceScore}% confidence</div> : stryMutAct_9fa48("31379") ? false : stryMutAct_9fa48("31378") ? true : (stryCov_9fa48("31378", "31379", "31380"), (stryMutAct_9fa48("31382") ? entry.confidenceScore === undefined : stryMutAct_9fa48("31381") ? true : (stryCov_9fa48("31381", "31382"), entry.confidenceScore !== undefined)) && <div className="text-xs text-emerald-400">{entry.confidenceScore}% confidence</div>)}
                          </div>
                        </div>
                        <p className="text-sm text-white/70 line-clamp-2">{entry.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <code className="text-xs text-emerald-400 font-mono bg-black/30 px-2 py-0.5 rounded">
                            {stryMutAct_9fa48("31383") ? entry.hash : (stryCov_9fa48("31383"), entry.hash.substring(0, 12))}...
                          </code>
                          {stryMutAct_9fa48("31386") ? entry.verified || <span className="text-xs text-green-400">✓ Verified</span> : stryMutAct_9fa48("31385") ? false : stryMutAct_9fa48("31384") ? true : (stryCov_9fa48("31384", "31385", "31386"), entry.verified && <span className="text-xs text-green-400">✓ Verified</span>)}
                          {entry.complianceFrameworks.map(stryMutAct_9fa48("31387") ? () => undefined : (stryCov_9fa48("31387"), f => <span key={f} className="text-xs bg-purple-900/50 px-1.5 py-0.5 rounded">{f}</span>))}
                        </div>
                      </div>
                    </div>)))}
                  
                  {stryMutAct_9fa48("31390") ? entries.length === 0 || <div className="text-center py-12 text-white/40">
                      No entries yet. Create a decision to start the chain.
                    </div> : stryMutAct_9fa48("31389") ? false : stryMutAct_9fa48("31388") ? true : (stryCov_9fa48("31388", "31389", "31390"), (stryMutAct_9fa48("31392") ? entries.length !== 0 : stryMutAct_9fa48("31391") ? true : (stryCov_9fa48("31391", "31392"), entries.length === 0)) && <div className="text-center py-12 text-white/40">
                      No entries yet. Create a decision to start the chain.
                    </div>)}
                </div>
              </div>
            </div>

            {/* Chain Stats */}
            <div className="space-y-6">
              <div className="bg-black/30 rounded-2xl p-6 border border-emerald-800/50">
                <h2 className="text-lg font-bold mb-4">Chain Integrity</h2>
                {stryMutAct_9fa48("31395") ? chainStatus || <div className={`p-4 rounded-xl ${chainStatus.valid ? 'bg-green-900/30 border border-green-600/50' : 'bg-red-900/30 border border-red-600/50'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{chainStatus.valid ? '✅' : '❌'}</span>
                      <span className="font-bold">{chainStatus.valid ? 'Chain Valid' : 'Chain Broken'}</span>
                    </div>
                    <p className="text-sm text-white/70">{chainStatus.message}</p>
                    <div className="mt-2 text-xs text-white/50">
                      Entries checked: {chainStatus.entriesChecked}
                    </div>
                  </div> : stryMutAct_9fa48("31394") ? false : stryMutAct_9fa48("31393") ? true : (stryCov_9fa48("31393", "31394", "31395"), chainStatus && <div className={`p-4 rounded-xl ${chainStatus.valid ? 'bg-green-900/30 border border-green-600/50' : 'bg-red-900/30 border border-red-600/50'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{chainStatus.valid ? '✅' : '❌'}</span>
                      <span className="font-bold">{chainStatus.valid ? 'Chain Valid' : 'Chain Broken'}</span>
                    </div>
                    <p className="text-sm text-white/70">{chainStatus.message}</p>
                    <div className="mt-2 text-xs text-white/50">
                      Entries checked: {chainStatus.entriesChecked}
                    </div>
                  </div>)}
                <button onClick={stryMutAct_9fa48("31403") ? () => undefined : (stryCov_9fa48("31403"), () => setChainStatus(ledgerService.verifyChain()))} className="mt-4 w-full py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-sm">
                  🔄 Verify Chain
                </button>
              </div>

              <div className="bg-black/30 rounded-2xl p-6 border border-emerald-800/50">
                <h2 className="text-lg font-bold mb-4">Compliance Coverage</h2>
                {stryMutAct_9fa48("31406") ? metrics || <div className="space-y-2">
                    {Object.entries(metrics.entriesByFramework).map(([framework, count]) => <div key={framework} className="flex items-center justify-between">
                        <span className="text-sm">{framework}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-black/30 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500" style={{
                      width: `${Math.min(100, count / Math.max(1, metrics.totalEntries) * 100)}%`
                    }} />
                          </div>
                          <span className="text-xs text-white/50 w-8">{count}</span>
                        </div>
                      </div>)}
                  </div> : stryMutAct_9fa48("31405") ? false : stryMutAct_9fa48("31404") ? true : (stryCov_9fa48("31404", "31405", "31406"), metrics && <div className="space-y-2">
                    {Object.entries(metrics.entriesByFramework).map(stryMutAct_9fa48("31407") ? () => undefined : (stryCov_9fa48("31407"), ([framework, count]) => <div key={framework} className="flex items-center justify-between">
                        <span className="text-sm">{framework}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-black/30 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500" style={stryMutAct_9fa48("31408") ? {} : (stryCov_9fa48("31408"), {
                      width: `${stryMutAct_9fa48("31410") ? Math.max(100, count / Math.max(1, metrics.totalEntries) * 100) : (stryCov_9fa48("31410"), Math.min(100, stryMutAct_9fa48("31411") ? count / Math.max(1, metrics.totalEntries) / 100 : (stryCov_9fa48("31411"), (stryMutAct_9fa48("31412") ? count * Math.max(1, metrics.totalEntries) : (stryCov_9fa48("31412"), count / (stryMutAct_9fa48("31413") ? Math.min(1, metrics.totalEntries) : (stryCov_9fa48("31413"), Math.max(1, metrics.totalEntries))))) * 100)))}%`
                    })} />
                          </div>
                          <span className="text-xs text-white/50 w-8">{count}</span>
                        </div>
                      </div>))}
                  </div>)}
              </div>

              <div className="bg-black/30 rounded-2xl p-6 border border-emerald-800/50">
                <h2 className="text-lg font-bold mb-4">Recent Activity</h2>
                <div className="space-y-2">
                  {stryMutAct_9fa48("31414") ? entries.map(e => <div key={e.id} className="flex items-center gap-2 text-sm">
                      <span>{getEventIcon(e.eventType)}</span>
                      <span className="flex-1 truncate">{e.title}</span>
                      <span className="text-xs text-white/40">{e.timestamp.toLocaleTimeString()}</span>
                    </div>) : (stryCov_9fa48("31414"), entries.slice(0, 5).map(stryMutAct_9fa48("31415") ? () => undefined : (stryCov_9fa48("31415"), e => <div key={e.id} className="flex items-center gap-2 text-sm">
                      <span>{getEventIcon(e.eventType)}</span>
                      <span className="flex-1 truncate">{e.title}</span>
                      <span className="text-xs text-white/40">{e.timestamp.toLocaleTimeString()}</span>
                    </div>)))}
                </div>
              </div>
            </div>
          </div>)}

        {stryMutAct_9fa48("31418") ? activeTab === 'decisions' || <div className="space-y-4">
            {decisions.map(decision => <div key={decision.id} className="bg-black/30 rounded-2xl p-6 border border-emerald-800/50 cursor-pointer hover:border-emerald-500 transition-colors" onClick={() => setSelectedDecision(decision)}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-bold">{decision.title}</h3>
                    <p className="text-sm text-white/60">{decision.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm ${decision.status === 'approved' ? 'bg-green-600' : decision.status === 'vetoed' || decision.status === 'rejected' ? 'bg-red-600' : 'bg-amber-600'}`}>
                      {decision.status.toUpperCase()}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-6 text-sm text-white/50">
                  <span>Proposed: {decision.proposedAt.toLocaleDateString()}</span>
                  <span>{decision.ledgerEntries.length} chain entries</span>
                  <span>{decision.voters.length} votes</span>
                  {decision.finalConfidence !== undefined && <span className="text-emerald-400">{decision.finalConfidence}% confidence</span>}
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <code className="text-xs font-mono bg-black/30 px-2 py-1 rounded text-emerald-400">
                    First: {decision.firstEntryHash.substring(0, 12)}...
                  </code>
                  <span className="text-white/30">→</span>
                  <code className="text-xs font-mono bg-black/30 px-2 py-1 rounded text-emerald-400">
                    Latest: {decision.latestEntryHash.substring(0, 12)}...
                  </code>
                </div>
              </div>)}
            {decisions.length === 0 && <div className="text-center py-12 text-white/40">
                No decisions recorded yet. Create one to begin tracking.
              </div>}
          </div> : stryMutAct_9fa48("31417") ? false : stryMutAct_9fa48("31416") ? true : (stryCov_9fa48("31416", "31417", "31418"), (stryMutAct_9fa48("31420") ? activeTab !== 'decisions' : stryMutAct_9fa48("31419") ? true : (stryCov_9fa48("31419", "31420"), activeTab === 'decisions')) && <div className="space-y-4">
            {decisions.map(stryMutAct_9fa48("31422") ? () => undefined : (stryCov_9fa48("31422"), decision => <div key={decision.id} className="bg-black/30 rounded-2xl p-6 border border-emerald-800/50 cursor-pointer hover:border-emerald-500 transition-colors" onClick={stryMutAct_9fa48("31423") ? () => undefined : (stryCov_9fa48("31423"), () => setSelectedDecision(decision))}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-bold">{decision.title}</h3>
                    <p className="text-sm text-white/60">{decision.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm ${(stryMutAct_9fa48("31427") ? decision.status !== 'approved' : stryMutAct_9fa48("31426") ? false : stryMutAct_9fa48("31425") ? true : (stryCov_9fa48("31425", "31426", "31427"), decision.status === 'approved')) ? 'bg-green-600' : (stryMutAct_9fa48("31432") ? decision.status === 'vetoed' && decision.status === 'rejected' : stryMutAct_9fa48("31431") ? false : stryMutAct_9fa48("31430") ? true : (stryCov_9fa48("31430", "31431", "31432"), (stryMutAct_9fa48("31434") ? decision.status !== 'vetoed' : stryMutAct_9fa48("31433") ? false : (stryCov_9fa48("31433", "31434"), decision.status === 'vetoed')) || (stryMutAct_9fa48("31437") ? decision.status !== 'rejected' : stryMutAct_9fa48("31436") ? false : (stryCov_9fa48("31436", "31437"), decision.status === 'rejected')))) ? 'bg-red-600' : 'bg-amber-600'}`}>
                      {stryMutAct_9fa48("31441") ? decision.status.toLowerCase() : (stryCov_9fa48("31441"), decision.status.toUpperCase())}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-6 text-sm text-white/50">
                  <span>Proposed: {decision.proposedAt.toLocaleDateString()}</span>
                  <span>{decision.ledgerEntries.length} chain entries</span>
                  <span>{decision.voters.length} votes</span>
                  {stryMutAct_9fa48("31444") ? decision.finalConfidence !== undefined || <span className="text-emerald-400">{decision.finalConfidence}% confidence</span> : stryMutAct_9fa48("31443") ? false : stryMutAct_9fa48("31442") ? true : (stryCov_9fa48("31442", "31443", "31444"), (stryMutAct_9fa48("31446") ? decision.finalConfidence === undefined : stryMutAct_9fa48("31445") ? true : (stryCov_9fa48("31445", "31446"), decision.finalConfidence !== undefined)) && <span className="text-emerald-400">{decision.finalConfidence}% confidence</span>)}
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <code className="text-xs font-mono bg-black/30 px-2 py-1 rounded text-emerald-400">
                    First: {stryMutAct_9fa48("31447") ? decision.firstEntryHash : (stryCov_9fa48("31447"), decision.firstEntryHash.substring(0, 12))}...
                  </code>
                  <span className="text-white/30">→</span>
                  <code className="text-xs font-mono bg-black/30 px-2 py-1 rounded text-emerald-400">
                    Latest: {stryMutAct_9fa48("31448") ? decision.latestEntryHash : (stryCov_9fa48("31448"), decision.latestEntryHash.substring(0, 12))}...
                  </code>
                </div>
              </div>))}
            {stryMutAct_9fa48("31451") ? decisions.length === 0 || <div className="text-center py-12 text-white/40">
                No decisions recorded yet. Create one to begin tracking.
              </div> : stryMutAct_9fa48("31450") ? false : stryMutAct_9fa48("31449") ? true : (stryCov_9fa48("31449", "31450", "31451"), (stryMutAct_9fa48("31453") ? decisions.length !== 0 : stryMutAct_9fa48("31452") ? true : (stryCov_9fa48("31452", "31453"), decisions.length === 0)) && <div className="text-center py-12 text-white/40">
                No decisions recorded yet. Create one to begin tracking.
              </div>)}
          </div>)}

        {stryMutAct_9fa48("31456") ? activeTab === 'audit' || <div className="grid grid-cols-2 gap-6">
            <div className="bg-black/30 rounded-2xl p-6 border border-emerald-800/50">
              <h2 className="text-lg font-bold mb-4">Request Audit</h2>
              <form onSubmit={e => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;
            const formData = new FormData(form);
            const decisionId = formData.get('decisionId') as string;
            const framework = formData.get('framework') as ComplianceFramework;
            const reason = formData.get('reason') as string;
            if (decisionId && framework && reason) {
              ledgerService.requestAudit(decisionId, 'current-user', reason, framework);
              loadData();
              form.reset();
            }
          }} className="space-y-4">
                <div>
                  <label className="block text-sm text-white/60 mb-1">Decision</label>
                  <select name="decisionId" required className="w-full px-4 py-2 bg-black/30 border border-emerald-700/50 rounded-lg">
                    <option value="">Select decision</option>
                    {decisions.map(d => <option key={d.id} value={d.id}>{d.title}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-1">Compliance Framework</label>
                  <select name="framework" required className="w-full px-4 py-2 bg-black/30 border border-emerald-700/50 rounded-lg">
                    <option value="">Select framework</option>
                    <option value="GDPR">GDPR</option>
                    <option value="SOX">SOX</option>
                    <option value="HIPAA">HIPAA</option>
                    <option value="SOC2">SOC2</option>
                    <option value="ISO27001">ISO 27001</option>
                    <option value="PCI-DSS">PCI-DSS</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-1">Reason for Audit</label>
                  <textarea name="reason" required className="w-full px-4 py-2 bg-black/30 border border-emerald-700/50 rounded-lg h-24" placeholder="Describe the reason for this audit request..." />
                </div>
                <button type="submit" className="w-full py-2 bg-purple-600 hover:bg-purple-500 rounded-lg">
                  Request Audit
                </button>
              </form>
            </div>

            <div className="bg-black/30 rounded-2xl p-6 border border-emerald-800/50">
              <h2 className="text-lg font-bold mb-4">Audit History</h2>
              <div className="space-y-3">
                {decisions.flatMap(d => d.auditHistory.map(a => ({
              ...a,
              decision: d
            }))).slice(0, 10).map(audit => <div key={audit.id} className="p-4 bg-black/20 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">{audit.decision.title}</span>
                      <span className={`px-2 py-0.5 rounded text-xs ${audit.status === 'completed' ? 'bg-green-600' : audit.status === 'failed' ? 'bg-red-600' : 'bg-amber-600'}`}>
                        {audit.status}
                      </span>
                    </div>
                    <div className="text-sm text-white/60">{audit.reason}</div>
                    <div className="flex items-center gap-4 mt-2 text-xs text-white/40">
                      <span>{audit.framework}</span>
                      <span>{audit.requestedAt.toLocaleDateString()}</span>
                      {audit.findings.length > 0 && <span className="text-amber-400">{audit.findings.length} findings</span>}
                    </div>
                  </div>)}
                {decisions.flatMap(d => d.auditHistory).length === 0 && <div className="text-center py-8 text-white/40">
                    No audits requested yet
                  </div>}
              </div>
            </div>
          </div> : stryMutAct_9fa48("31455") ? false : stryMutAct_9fa48("31454") ? true : (stryCov_9fa48("31454", "31455", "31456"), (stryMutAct_9fa48("31458") ? activeTab !== 'audit' : stryMutAct_9fa48("31457") ? true : (stryCov_9fa48("31457", "31458"), activeTab === 'audit')) && <div className="grid grid-cols-2 gap-6">
            <div className="bg-black/30 rounded-2xl p-6 border border-emerald-800/50">
              <h2 className="text-lg font-bold mb-4">Request Audit</h2>
              <form onSubmit={e => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;
            const formData = new FormData(form);
            const decisionId = formData.get('decisionId') as string;
            const framework = formData.get('framework') as ComplianceFramework;
            const reason = formData.get('reason') as string;
            if (stryMutAct_9fa48("31463") ? decisionId && framework || reason : stryMutAct_9fa48("31462") ? false : stryMutAct_9fa48("31461") ? true : (stryCov_9fa48("31461", "31462", "31463"), (stryMutAct_9fa48("31465") ? decisionId || framework : stryMutAct_9fa48("31464") ? true : (stryCov_9fa48("31464", "31465"), decisionId && framework)) && reason)) {
              ledgerService.requestAudit(decisionId, 'current-user', reason, framework);
              loadData();
              form.reset();
            }
          }} className="space-y-4">
                <div>
                  <label className="block text-sm text-white/60 mb-1">Decision</label>
                  <select name="decisionId" required className="w-full px-4 py-2 bg-black/30 border border-emerald-700/50 rounded-lg">
                    <option value="">Select decision</option>
                    {decisions.map(stryMutAct_9fa48("31468") ? () => undefined : (stryCov_9fa48("31468"), d => <option key={d.id} value={d.id}>{d.title}</option>))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-1">Compliance Framework</label>
                  <select name="framework" required className="w-full px-4 py-2 bg-black/30 border border-emerald-700/50 rounded-lg">
                    <option value="">Select framework</option>
                    <option value="GDPR">GDPR</option>
                    <option value="SOX">SOX</option>
                    <option value="HIPAA">HIPAA</option>
                    <option value="SOC2">SOC2</option>
                    <option value="ISO27001">ISO 27001</option>
                    <option value="PCI-DSS">PCI-DSS</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-1">Reason for Audit</label>
                  <textarea name="reason" required className="w-full px-4 py-2 bg-black/30 border border-emerald-700/50 rounded-lg h-24" placeholder="Describe the reason for this audit request..." />
                </div>
                <button type="submit" className="w-full py-2 bg-purple-600 hover:bg-purple-500 rounded-lg">
                  Request Audit
                </button>
              </form>
            </div>

            <div className="bg-black/30 rounded-2xl p-6 border border-emerald-800/50">
              <h2 className="text-lg font-bold mb-4">Audit History</h2>
              <div className="space-y-3">
                {stryMutAct_9fa48("31469") ? decisions.flatMap(d => d.auditHistory.map(a => ({
              ...a,
              decision: d
            }))).map(audit => <div key={audit.id} className="p-4 bg-black/20 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">{audit.decision.title}</span>
                      <span className={`px-2 py-0.5 rounded text-xs ${audit.status === 'completed' ? 'bg-green-600' : audit.status === 'failed' ? 'bg-red-600' : 'bg-amber-600'}`}>
                        {audit.status}
                      </span>
                    </div>
                    <div className="text-sm text-white/60">{audit.reason}</div>
                    <div className="flex items-center gap-4 mt-2 text-xs text-white/40">
                      <span>{audit.framework}</span>
                      <span>{audit.requestedAt.toLocaleDateString()}</span>
                      {audit.findings.length > 0 && <span className="text-amber-400">{audit.findings.length} findings</span>}
                    </div>
                  </div>) : (stryCov_9fa48("31469"), decisions.flatMap(stryMutAct_9fa48("31470") ? () => undefined : (stryCov_9fa48("31470"), d => d.auditHistory.map(stryMutAct_9fa48("31471") ? () => undefined : (stryCov_9fa48("31471"), a => stryMutAct_9fa48("31472") ? {} : (stryCov_9fa48("31472"), {
              ...a,
              decision: d
            }))))).slice(0, 10).map(stryMutAct_9fa48("31473") ? () => undefined : (stryCov_9fa48("31473"), audit => <div key={audit.id} className="p-4 bg-black/20 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">{audit.decision.title}</span>
                      <span className={`px-2 py-0.5 rounded text-xs ${(stryMutAct_9fa48("31477") ? audit.status !== 'completed' : stryMutAct_9fa48("31476") ? false : stryMutAct_9fa48("31475") ? true : (stryCov_9fa48("31475", "31476", "31477"), audit.status === 'completed')) ? 'bg-green-600' : (stryMutAct_9fa48("31482") ? audit.status !== 'failed' : stryMutAct_9fa48("31481") ? false : stryMutAct_9fa48("31480") ? true : (stryCov_9fa48("31480", "31481", "31482"), audit.status === 'failed')) ? 'bg-red-600' : 'bg-amber-600'}`}>
                        {audit.status}
                      </span>
                    </div>
                    <div className="text-sm text-white/60">{audit.reason}</div>
                    <div className="flex items-center gap-4 mt-2 text-xs text-white/40">
                      <span>{audit.framework}</span>
                      <span>{audit.requestedAt.toLocaleDateString()}</span>
                      {stryMutAct_9fa48("31488") ? audit.findings.length > 0 || <span className="text-amber-400">{audit.findings.length} findings</span> : stryMutAct_9fa48("31487") ? false : stryMutAct_9fa48("31486") ? true : (stryCov_9fa48("31486", "31487", "31488"), (stryMutAct_9fa48("31491") ? audit.findings.length <= 0 : stryMutAct_9fa48("31490") ? audit.findings.length >= 0 : stryMutAct_9fa48("31489") ? true : (stryCov_9fa48("31489", "31490", "31491"), audit.findings.length > 0)) && <span className="text-amber-400">{audit.findings.length} findings</span>)}
                    </div>
                  </div>)))}
                {stryMutAct_9fa48("31494") ? decisions.flatMap(d => d.auditHistory).length === 0 || <div className="text-center py-8 text-white/40">
                    No audits requested yet
                  </div> : stryMutAct_9fa48("31493") ? false : stryMutAct_9fa48("31492") ? true : (stryCov_9fa48("31492", "31493", "31494"), (stryMutAct_9fa48("31496") ? decisions.flatMap(d => d.auditHistory).length !== 0 : stryMutAct_9fa48("31495") ? true : (stryCov_9fa48("31495", "31496"), decisions.flatMap(stryMutAct_9fa48("31497") ? () => undefined : (stryCov_9fa48("31497"), d => d.auditHistory)).length === 0)) && <div className="text-center py-8 text-white/40">
                    No audits requested yet
                  </div>)}
              </div>
            </div>
          </div>)}

        {stryMutAct_9fa48("31500") ? activeTab === 'export' || <div className="grid grid-cols-2 gap-6">
            <div className="bg-black/30 rounded-2xl p-6 border border-emerald-800/50">
              <h2 className="text-lg font-bold mb-4">Export for Regulatory Audit</h2>
              <p className="text-sm text-white/60 mb-4">
                Export complete decision records with full chain of custody for regulatory submission.
              </p>
              <div className="space-y-3">
                {decisions.map(d => <div key={d.id} className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                    <div>
                      <div className="font-medium">{d.title}</div>
                      <div className="text-xs text-white/50">{d.ledgerEntries.length} entries</div>
                    </div>
                    <button onClick={() => handleExport(d.id)} className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-sm">
                      📥 Export JSON
                    </button>
                  </div>)}
              </div>
            </div>

            <div className="bg-black/30 rounded-2xl p-6 border border-emerald-800/50">
              <h2 className="text-lg font-bold mb-4">Export Format</h2>
              <div className="p-4 bg-black/20 rounded-lg font-mono text-xs text-emerald-400 overflow-x-auto">
                <pre>{`{
  "exportedAt": "ISO timestamp",
  "chainIntegrity": {
    "valid": true,
    "entriesChecked": 42,
    "message": "All entries verified"
  },
  "decision": {
    "id": "decision-xxx",
    "title": "...",
    "status": "approved",
    "finalConfidence": 87
  },
  "entries": [
    {
      "sequence": 1,
      "hash": "0000abcd...",
      "previousHash": "00000000...",
      "eventType": "decision.proposed",
      "timestamp": "ISO timestamp",
      "verified": true
    }
  ],
  "hashChain": [...]
}`}</pre>
              </div>
              <p className="text-xs text-white/50 mt-4">
                Exports include cryptographic hash chain for tamper detection and full audit trail.
              </p>
            </div>
          </div> : stryMutAct_9fa48("31499") ? false : stryMutAct_9fa48("31498") ? true : (stryCov_9fa48("31498", "31499", "31500"), (stryMutAct_9fa48("31502") ? activeTab !== 'export' : stryMutAct_9fa48("31501") ? true : (stryCov_9fa48("31501", "31502"), activeTab === 'export')) && <div className="grid grid-cols-2 gap-6">
            <div className="bg-black/30 rounded-2xl p-6 border border-emerald-800/50">
              <h2 className="text-lg font-bold mb-4">Export for Regulatory Audit</h2>
              <p className="text-sm text-white/60 mb-4">
                Export complete decision records with full chain of custody for regulatory submission.
              </p>
              <div className="space-y-3">
                {decisions.map(stryMutAct_9fa48("31504") ? () => undefined : (stryCov_9fa48("31504"), d => <div key={d.id} className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                    <div>
                      <div className="font-medium">{d.title}</div>
                      <div className="text-xs text-white/50">{d.ledgerEntries.length} entries</div>
                    </div>
                    <button onClick={stryMutAct_9fa48("31505") ? () => undefined : (stryCov_9fa48("31505"), () => handleExport(d.id))} className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-sm">
                      📥 Export JSON
                    </button>
                  </div>))}
              </div>
            </div>

            <div className="bg-black/30 rounded-2xl p-6 border border-emerald-800/50">
              <h2 className="text-lg font-bold mb-4">Export Format</h2>
              <div className="p-4 bg-black/20 rounded-lg font-mono text-xs text-emerald-400 overflow-x-auto">
                <pre>{`{
  "exportedAt": "ISO timestamp",
  "chainIntegrity": {
    "valid": true,
    "entriesChecked": 42,
    "message": "All entries verified"
  },
  "decision": {
    "id": "decision-xxx",
    "title": "...",
    "status": "approved",
    "finalConfidence": 87
  },
  "entries": [
    {
      "sequence": 1,
      "hash": "0000abcd...",
      "previousHash": "00000000...",
      "eventType": "decision.proposed",
      "timestamp": "ISO timestamp",
      "verified": true
    }
  ],
  "hashChain": [...]
}`}</pre>
              </div>
              <p className="text-xs text-white/50 mt-4">
                Exports include cryptographic hash chain for tamper detection and full audit trail.
              </p>
            </div>
          </div>)}
      </div>

      {/* New Decision Modal */}
      {stryMutAct_9fa48("31509") ? showNewDecision || <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-slate-900 rounded-2xl p-6 w-full max-w-lg border border-emerald-800/50">
            <h2 className="text-xl font-bold mb-4">Create Decision Record</h2>
            <form onSubmit={e => {
          e.preventDefault();
          const form = e.target as HTMLFormElement;
          const formData = new FormData(form);
          ledgerService.createDecision(formData.get('title') as string, formData.get('description') as string, 'current-user', ['strategic-agent', 'financial-agent', 'risk-agent']);
          loadData();
          setShowNewDecision(false);
        }} className="space-y-4">
              <div>
                <label className="block text-sm text-white/60 mb-1">Decision Title</label>
                <input name="title" required className="w-full px-4 py-2 bg-black/30 border border-emerald-700/50 rounded-lg" placeholder="e.g., Q4 Budget Allocation" />
              </div>
              <div>
                <label className="block text-sm text-white/60 mb-1">Description</label>
                <textarea name="description" required className="w-full px-4 py-2 bg-black/30 border border-emerald-700/50 rounded-lg h-32" placeholder="Describe the decision to be recorded..." />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowNewDecision(false)} className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg">Create & Record</button>
              </div>
            </form>
          </div>
        </div> : stryMutAct_9fa48("31508") ? false : stryMutAct_9fa48("31507") ? true : (stryCov_9fa48("31507", "31508", "31509"), showNewDecision && <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-slate-900 rounded-2xl p-6 w-full max-w-lg border border-emerald-800/50">
            <h2 className="text-xl font-bold mb-4">Create Decision Record</h2>
            <form onSubmit={e => {
          e.preventDefault();
          const form = e.target as HTMLFormElement;
          const formData = new FormData(form);
          ledgerService.createDecision(formData.get('title') as string, formData.get('description') as string, 'current-user', stryMutAct_9fa48("31512") ? [] : (stryCov_9fa48("31512"), ['strategic-agent', 'financial-agent', 'risk-agent']));
          loadData();
          setShowNewDecision(stryMutAct_9fa48("31516") ? true : (stryCov_9fa48("31516"), false));
        }} className="space-y-4">
              <div>
                <label className="block text-sm text-white/60 mb-1">Decision Title</label>
                <input name="title" required className="w-full px-4 py-2 bg-black/30 border border-emerald-700/50 rounded-lg" placeholder="e.g., Q4 Budget Allocation" />
              </div>
              <div>
                <label className="block text-sm text-white/60 mb-1">Description</label>
                <textarea name="description" required className="w-full px-4 py-2 bg-black/30 border border-emerald-700/50 rounded-lg h-32" placeholder="Describe the decision to be recorded..." />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={stryMutAct_9fa48("31517") ? () => undefined : (stryCov_9fa48("31517"), () => setShowNewDecision(stryMutAct_9fa48("31518") ? true : (stryCov_9fa48("31518"), false)))} className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg">Create & Record</button>
              </div>
            </form>
          </div>
        </div>)}

      {/* Entry Detail Modal */}
      {stryMutAct_9fa48("31521") ? selectedEntry || <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" onClick={() => setSelectedEntry(null)}>
          <div className="bg-slate-900 rounded-2xl p-6 w-full max-w-2xl border border-emerald-800/50 max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">{getEventIcon(selectedEntry.eventType)}</span>
              <div>
                <h2 className="text-xl font-bold">{selectedEntry.title}</h2>
                <p className="text-sm text-white/60">{selectedEntry.eventType}</p>
              </div>
            </div>

            <p className="text-white/80 mb-6">{selectedEntry.description}</p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-3 bg-black/30 rounded-lg">
                <div className="text-xs text-white/50">Sequence</div>
                <div className="font-mono">{selectedEntry.sequence}</div>
              </div>
              <div className="p-3 bg-black/30 rounded-lg">
                <div className="text-xs text-white/50">Timestamp</div>
                <div>{selectedEntry.timestamp.toLocaleString()}</div>
              </div>
              <div className="p-3 bg-black/30 rounded-lg">
                <div className="text-xs text-white/50">Sensitivity</div>
                <div className="capitalize">{selectedEntry.sensitivityLevel}</div>
              </div>
              <div className="p-3 bg-black/30 rounded-lg">
                <div className="text-xs text-white/50">PII Involved</div>
                <div>{selectedEntry.piiInvolved ? 'Yes' : 'No'}</div>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="p-3 bg-black/30 rounded-lg">
                <div className="text-xs text-white/50 mb-1">Hash</div>
                <code className="text-sm font-mono text-emerald-400 break-all">{selectedEntry.hash}</code>
              </div>
              <div className="p-3 bg-black/30 rounded-lg">
                <div className="text-xs text-white/50 mb-1">Previous Hash</div>
                <code className="text-sm font-mono text-emerald-400 break-all">{selectedEntry.previousHash}</code>
              </div>
            </div>

            {selectedEntry.complianceFrameworks.length > 0 && <div className="mb-6">
                <div className="text-xs text-white/50 mb-2">Compliance Frameworks</div>
                <div className="flex gap-2">
                  {selectedEntry.complianceFrameworks.map(f => <span key={f} className="px-3 py-1 bg-purple-900/50 rounded-lg">{f}</span>)}
                </div>
              </div>}

            <div className="flex gap-3">
              <button onClick={() => {
            ledgerService.verifyEntry(selectedEntry.id);
            loadData();
            setSelectedEntry(ledgerService.getEntry(selectedEntry.id) || null);
          }} className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg">
                ✓ Verify Entry
              </button>
              <button onClick={() => setSelectedEntry(null)} className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg">
                Close
              </button>
            </div>
          </div>
        </div> : stryMutAct_9fa48("31520") ? false : stryMutAct_9fa48("31519") ? true : (stryCov_9fa48("31519", "31520", "31521"), selectedEntry && <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" onClick={stryMutAct_9fa48("31522") ? () => undefined : (stryCov_9fa48("31522"), () => setSelectedEntry(null))}>
          <div className="bg-slate-900 rounded-2xl p-6 w-full max-w-2xl border border-emerald-800/50 max-h-[80vh] overflow-y-auto" onClick={stryMutAct_9fa48("31523") ? () => undefined : (stryCov_9fa48("31523"), e => e.stopPropagation())}>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">{getEventIcon(selectedEntry.eventType)}</span>
              <div>
                <h2 className="text-xl font-bold">{selectedEntry.title}</h2>
                <p className="text-sm text-white/60">{selectedEntry.eventType}</p>
              </div>
            </div>

            <p className="text-white/80 mb-6">{selectedEntry.description}</p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-3 bg-black/30 rounded-lg">
                <div className="text-xs text-white/50">Sequence</div>
                <div className="font-mono">{selectedEntry.sequence}</div>
              </div>
              <div className="p-3 bg-black/30 rounded-lg">
                <div className="text-xs text-white/50">Timestamp</div>
                <div>{selectedEntry.timestamp.toLocaleString()}</div>
              </div>
              <div className="p-3 bg-black/30 rounded-lg">
                <div className="text-xs text-white/50">Sensitivity</div>
                <div className="capitalize">{selectedEntry.sensitivityLevel}</div>
              </div>
              <div className="p-3 bg-black/30 rounded-lg">
                <div className="text-xs text-white/50">PII Involved</div>
                <div>{selectedEntry.piiInvolved ? 'Yes' : 'No'}</div>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="p-3 bg-black/30 rounded-lg">
                <div className="text-xs text-white/50 mb-1">Hash</div>
                <code className="text-sm font-mono text-emerald-400 break-all">{selectedEntry.hash}</code>
              </div>
              <div className="p-3 bg-black/30 rounded-lg">
                <div className="text-xs text-white/50 mb-1">Previous Hash</div>
                <code className="text-sm font-mono text-emerald-400 break-all">{selectedEntry.previousHash}</code>
              </div>
            </div>

            {stryMutAct_9fa48("31528") ? selectedEntry.complianceFrameworks.length > 0 || <div className="mb-6">
                <div className="text-xs text-white/50 mb-2">Compliance Frameworks</div>
                <div className="flex gap-2">
                  {selectedEntry.complianceFrameworks.map(f => <span key={f} className="px-3 py-1 bg-purple-900/50 rounded-lg">{f}</span>)}
                </div>
              </div> : stryMutAct_9fa48("31527") ? false : stryMutAct_9fa48("31526") ? true : (stryCov_9fa48("31526", "31527", "31528"), (stryMutAct_9fa48("31531") ? selectedEntry.complianceFrameworks.length <= 0 : stryMutAct_9fa48("31530") ? selectedEntry.complianceFrameworks.length >= 0 : stryMutAct_9fa48("31529") ? true : (stryCov_9fa48("31529", "31530", "31531"), selectedEntry.complianceFrameworks.length > 0)) && <div className="mb-6">
                <div className="text-xs text-white/50 mb-2">Compliance Frameworks</div>
                <div className="flex gap-2">
                  {selectedEntry.complianceFrameworks.map(stryMutAct_9fa48("31532") ? () => undefined : (stryCov_9fa48("31532"), f => <span key={f} className="px-3 py-1 bg-purple-900/50 rounded-lg">{f}</span>))}
                </div>
              </div>)}

            <div className="flex gap-3">
              <button onClick={() => {
            ledgerService.verifyEntry(selectedEntry.id);
            loadData();
            setSelectedEntry(stryMutAct_9fa48("31536") ? ledgerService.getEntry(selectedEntry.id) && null : stryMutAct_9fa48("31535") ? false : stryMutAct_9fa48("31534") ? true : (stryCov_9fa48("31534", "31535", "31536"), ledgerService.getEntry(selectedEntry.id) || null));
          }} className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg">
                ✓ Verify Entry
              </button>
              <button onClick={stryMutAct_9fa48("31537") ? () => undefined : (stryCov_9fa48("31537"), () => setSelectedEntry(null))} className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg">
                Close
              </button>
            </div>
          </div>
        </div>)}

      {/* Decision Detail Modal */}
      {stryMutAct_9fa48("31540") ? selectedDecision || <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" onClick={() => setSelectedDecision(null)}>
          <div className="bg-slate-900 rounded-2xl p-6 w-full max-w-3xl border border-emerald-800/50 max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold">{selectedDecision.title}</h2>
                <p className="text-sm text-white/60">{selectedDecision.description}</p>
              </div>
              <span className={`px-3 py-1 rounded-full ${selectedDecision.status === 'approved' ? 'bg-green-600' : selectedDecision.status === 'vetoed' ? 'bg-red-600' : 'bg-amber-600'}`}>
                {selectedDecision.status.toUpperCase()}
              </span>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="p-3 bg-black/30 rounded-lg text-center">
                <div className="text-xl font-bold">{selectedDecision.ledgerEntries.length}</div>
                <div className="text-xs text-white/50">Chain Entries</div>
              </div>
              <div className="p-3 bg-black/30 rounded-lg text-center">
                <div className="text-xl font-bold">{selectedDecision.voters.length}</div>
                <div className="text-xs text-white/50">Votes</div>
              </div>
              <div className="p-3 bg-black/30 rounded-lg text-center">
                <div className="text-xl font-bold text-emerald-400">{selectedDecision.finalConfidence || '-'}%</div>
                <div className="text-xs text-white/50">Confidence</div>
              </div>
              <div className="p-3 bg-black/30 rounded-lg text-center">
                <div className="text-xl font-bold">{selectedDecision.auditHistory.length}</div>
                <div className="text-xs text-white/50">Audits</div>
              </div>
            </div>

            <h3 className="font-semibold mb-3">Chain Entries</h3>
            <div className="space-y-2 mb-6 max-h-60 overflow-y-auto">
              {ledgerService.getEntriesForDecision(selectedDecision.id).map(entry => <div key={entry.id} className="flex items-center gap-3 p-2 bg-black/20 rounded-lg text-sm">
                  <span>{getEventIcon(entry.eventType)}</span>
                  <span className="flex-1">{entry.title}</span>
                  <code className="text-xs text-emerald-400 font-mono">{entry.hash.substring(0, 8)}...</code>
                  <span className="text-xs text-white/40">{entry.timestamp.toLocaleTimeString()}</span>
                </div>)}
            </div>

            <div className="flex gap-3">
              <button onClick={() => handleExport(selectedDecision.id)} className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg">
                📥 Export for Audit
              </button>
              <button onClick={() => setSelectedDecision(null)} className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg">
                Close
              </button>
            </div>
          </div>
        </div> : stryMutAct_9fa48("31539") ? false : stryMutAct_9fa48("31538") ? true : (stryCov_9fa48("31538", "31539", "31540"), selectedDecision && <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" onClick={stryMutAct_9fa48("31541") ? () => undefined : (stryCov_9fa48("31541"), () => setSelectedDecision(null))}>
          <div className="bg-slate-900 rounded-2xl p-6 w-full max-w-3xl border border-emerald-800/50 max-h-[85vh] overflow-y-auto" onClick={stryMutAct_9fa48("31542") ? () => undefined : (stryCov_9fa48("31542"), e => e.stopPropagation())}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold">{selectedDecision.title}</h2>
                <p className="text-sm text-white/60">{selectedDecision.description}</p>
              </div>
              <span className={`px-3 py-1 rounded-full ${(stryMutAct_9fa48("31546") ? selectedDecision.status !== 'approved' : stryMutAct_9fa48("31545") ? false : stryMutAct_9fa48("31544") ? true : (stryCov_9fa48("31544", "31545", "31546"), selectedDecision.status === 'approved')) ? 'bg-green-600' : (stryMutAct_9fa48("31551") ? selectedDecision.status !== 'vetoed' : stryMutAct_9fa48("31550") ? false : stryMutAct_9fa48("31549") ? true : (stryCov_9fa48("31549", "31550", "31551"), selectedDecision.status === 'vetoed')) ? 'bg-red-600' : 'bg-amber-600'}`}>
                {stryMutAct_9fa48("31555") ? selectedDecision.status.toLowerCase() : (stryCov_9fa48("31555"), selectedDecision.status.toUpperCase())}
              </span>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="p-3 bg-black/30 rounded-lg text-center">
                <div className="text-xl font-bold">{selectedDecision.ledgerEntries.length}</div>
                <div className="text-xs text-white/50">Chain Entries</div>
              </div>
              <div className="p-3 bg-black/30 rounded-lg text-center">
                <div className="text-xl font-bold">{selectedDecision.voters.length}</div>
                <div className="text-xs text-white/50">Votes</div>
              </div>
              <div className="p-3 bg-black/30 rounded-lg text-center">
                <div className="text-xl font-bold text-emerald-400">{stryMutAct_9fa48("31558") ? selectedDecision.finalConfidence && '-' : stryMutAct_9fa48("31557") ? false : stryMutAct_9fa48("31556") ? true : (stryCov_9fa48("31556", "31557", "31558"), selectedDecision.finalConfidence || '-')}%</div>
                <div className="text-xs text-white/50">Confidence</div>
              </div>
              <div className="p-3 bg-black/30 rounded-lg text-center">
                <div className="text-xl font-bold">{selectedDecision.auditHistory.length}</div>
                <div className="text-xs text-white/50">Audits</div>
              </div>
            </div>

            <h3 className="font-semibold mb-3">Chain Entries</h3>
            <div className="space-y-2 mb-6 max-h-60 overflow-y-auto">
              {ledgerService.getEntriesForDecision(selectedDecision.id).map(stryMutAct_9fa48("31560") ? () => undefined : (stryCov_9fa48("31560"), entry => <div key={entry.id} className="flex items-center gap-3 p-2 bg-black/20 rounded-lg text-sm">
                  <span>{getEventIcon(entry.eventType)}</span>
                  <span className="flex-1">{entry.title}</span>
                  <code className="text-xs text-emerald-400 font-mono">{stryMutAct_9fa48("31561") ? entry.hash : (stryCov_9fa48("31561"), entry.hash.substring(0, 8))}...</code>
                  <span className="text-xs text-white/40">{entry.timestamp.toLocaleTimeString()}</span>
                </div>))}
            </div>

            <div className="flex gap-3">
              <button onClick={stryMutAct_9fa48("31562") ? () => undefined : (stryCov_9fa48("31562"), () => handleExport(selectedDecision.id))} className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg">
                📥 Export for Audit
              </button>
              <button onClick={stryMutAct_9fa48("31563") ? () => undefined : (stryCov_9fa48("31563"), () => setSelectedDecision(null))} className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg">
                Close
              </button>
            </div>
          </div>
        </div>)}
    </div>;
};
export default LedgerPage;