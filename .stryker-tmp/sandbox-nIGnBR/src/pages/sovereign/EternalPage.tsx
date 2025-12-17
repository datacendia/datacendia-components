/**
 * CendiaEternal™ - Ultra-Long Horizon Archive
 * "A memory designed to outlive us."
 */
// @ts-nocheck
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
import React, { useState, useEffect } from 'react';
import apiClient from '../../lib/api/client';
import { Archive, Shield, CheckCircle, AlertTriangle, Clock, Users, FileText, Lock, Link2, Settings, Key, Scale, Hash, Search, Table, Grid3X3, Download, Eye, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';

// Helper to generate dynamic timestamps relative to now
const formatRelativeDate = (hoursAgo: number): string => {
  const date = new Date(stryMutAct_9fa48("59048") ? Date.now() + hoursAgo * 60 * 60 * 1000 : (stryCov_9fa48("59048"), Date.now() - (stryMutAct_9fa48("59049") ? hoursAgo * 60 * 60 / 1000 : (stryCov_9fa48("59049"), (stryMutAct_9fa48("59050") ? hoursAgo * 60 / 60 : (stryCov_9fa48("59050"), (stryMutAct_9fa48("59051") ? hoursAgo / 60 : (stryCov_9fa48("59051"), hoursAgo * 60)) * 60)) * 1000))));
  return stryMutAct_9fa48("59052") ? date.toISOString().replace('T', ' ') : (stryCov_9fa48("59052"), date.toISOString().replace('T', ' ').substring(0, 16));
};

// Dynamic access log data (generated relative to current time)
const generateAccessLog = stryMutAct_9fa48("59055") ? () => undefined : (stryCov_9fa48("59055"), (() => {
  const generateAccessLog = () => stryMutAct_9fa48("59056") ? [] : (stryCov_9fa48("59056"), [stryMutAct_9fa48("59057") ? {} : (stryCov_9fa48("59057"), {
    id: 'log1',
    timestamp: formatRelativeDate(2),
    user: 'Sarah Chen',
    action: 'VIEW',
    artifact: 'Board Resolution Q4',
    status: 'success'
  }), stryMutAct_9fa48("59063") ? {} : (stryCov_9fa48("59063"), {
    id: 'log2',
    timestamp: formatRelativeDate(5),
    user: 'Michael Torres',
    action: 'VERIFY',
    artifact: 'Crisis Response Protocol',
    status: 'success'
  }), stryMutAct_9fa48("59069") ? {} : (stryCov_9fa48("59069"), {
    id: 'log3',
    timestamp: formatRelativeDate(24),
    user: 'Unknown IP',
    action: 'ACCESS_ATTEMPT',
    artifact: 'Financial Strategy',
    status: 'blocked'
  }), stryMutAct_9fa48("59075") ? {} : (stryCov_9fa48("59075"), {
    id: 'log4',
    timestamp: formatRelativeDate(28),
    user: 'Emily Watson',
    action: 'DOWNLOAD',
    artifact: 'Founding Documents',
    status: 'success'
  }), stryMutAct_9fa48("59081") ? {} : (stryCov_9fa48("59081"), {
    id: 'log5',
    timestamp: formatRelativeDate(48),
    user: 'System',
    action: 'INTEGRITY_CHECK',
    artifact: 'All artifacts',
    status: 'success'
  })]);
  return generateAccessLog;
})());
interface Artifact {
  id: string;
  artifactType: string;
  title: string;
  description: string;
  importanceScore: number;
  retentionYears: number;
  accessLevel: string;
  verificationStatus: string;
  createdAt: string;
}
interface Dashboard {
  totalArtifacts: number;
  verifiedArtifacts: number;
  driftedArtifacts: number;
  integrityRate: number;
  avgRetentionYears: number;
  avgImportanceScore: number;
  definedSuccessors: number;
}
export const EternalPage: React.FC = () => {
  const [artifacts, setArtifacts] = useState<Artifact[]>(stryMutAct_9fa48("59088") ? ["Stryker was here"] : (stryCov_9fa48("59088"), []));
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [isLoading, setIsLoading] = useState(stryMutAct_9fa48("59089") ? false : (stryCov_9fa48("59089"), true));
  const [showArchiveModal, setShowArchiveModal] = useState(stryMutAct_9fa48("59090") ? true : (stryCov_9fa48("59090"), false));
  const [newArtifact, setNewArtifact] = useState(stryMutAct_9fa48("59091") ? {} : (stryCov_9fa48("59091"), {
    title: '',
    description: '',
    content: '',
    artifactType: 'STRATEGIC_DECISION',
    retentionYears: 100,
    legalHold: stryMutAct_9fa48("59096") ? true : (stryCov_9fa48("59096"), false)
  }));
  const [showRetentionPolicy, setShowRetentionPolicy] = useState(stryMutAct_9fa48("59097") ? true : (stryCov_9fa48("59097"), false));
  const [showSuccessorWorkflow, setShowSuccessorWorkflow] = useState(stryMutAct_9fa48("59098") ? true : (stryCov_9fa48("59098"), false));

  // New state for search, view mode, and audit log
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [showAuditLog, setShowAuditLog] = useState(stryMutAct_9fa48("59101") ? true : (stryCov_9fa48("59101"), false));
  const [currentPage, setCurrentPage] = useState(1);
  const [retentionPolicies, setRetentionPolicies] = useState(stryMutAct_9fa48("59102") ? [] : (stryCov_9fa48("59102"), [stryMutAct_9fa48("59103") ? {} : (stryCov_9fa48("59103"), {
    type: 'Strategic Decision',
    years: 100,
    legalBasis: 'Board governance'
  }), stryMutAct_9fa48("59106") ? {} : (stryCov_9fa48("59106"), {
    type: 'Policy Document',
    years: 50,
    legalBasis: 'Regulatory requirement'
  }), stryMutAct_9fa48("59109") ? {} : (stryCov_9fa48("59109"), {
    type: 'Lessons Learned',
    years: 25,
    legalBasis: 'Institutional knowledge'
  }), stryMutAct_9fa48("59112") ? {} : (stryCov_9fa48("59112"), {
    type: 'Leadership Wisdom',
    years: 100,
    legalBasis: 'Succession planning'
  }), stryMutAct_9fa48("59115") ? {} : (stryCov_9fa48("59115"), {
    type: 'Crisis Response',
    years: 30,
    legalBasis: 'Legal & compliance'
  }), stryMutAct_9fa48("59118") ? {} : (stryCov_9fa48("59118"), {
    type: 'Financial Records',
    years: 7,
    legalBasis: 'Tax/audit requirements'
  })]));
  const itemsPerPage = 9;

  // Filter artifacts based on search
  const filteredArtifacts = stryMutAct_9fa48("59121") ? artifacts : (stryCov_9fa48("59121"), artifacts.filter(stryMutAct_9fa48("59122") ? () => undefined : (stryCov_9fa48("59122"), a => stryMutAct_9fa48("59125") ? (searchQuery === '' || a.title.toLowerCase().includes(searchQuery.toLowerCase()) || a.artifactType.toLowerCase().includes(searchQuery.toLowerCase())) && a.description?.toLowerCase().includes(searchQuery.toLowerCase()) : stryMutAct_9fa48("59124") ? false : stryMutAct_9fa48("59123") ? true : (stryCov_9fa48("59123", "59124", "59125"), (stryMutAct_9fa48("59127") ? (searchQuery === '' || a.title.toLowerCase().includes(searchQuery.toLowerCase())) && a.artifactType.toLowerCase().includes(searchQuery.toLowerCase()) : stryMutAct_9fa48("59126") ? false : (stryCov_9fa48("59126", "59127"), (stryMutAct_9fa48("59129") ? searchQuery === '' && a.title.toLowerCase().includes(searchQuery.toLowerCase()) : stryMutAct_9fa48("59128") ? false : (stryCov_9fa48("59128", "59129"), (stryMutAct_9fa48("59131") ? searchQuery !== '' : stryMutAct_9fa48("59130") ? false : (stryCov_9fa48("59130", "59131"), searchQuery === '')) || (stryMutAct_9fa48("59133") ? a.title.toUpperCase().includes(searchQuery.toLowerCase()) : (stryCov_9fa48("59133"), a.title.toLowerCase().includes(stryMutAct_9fa48("59134") ? searchQuery.toUpperCase() : (stryCov_9fa48("59134"), searchQuery.toLowerCase())))))) || (stryMutAct_9fa48("59135") ? a.artifactType.toUpperCase().includes(searchQuery.toLowerCase()) : (stryCov_9fa48("59135"), a.artifactType.toLowerCase().includes(stryMutAct_9fa48("59136") ? searchQuery.toUpperCase() : (stryCov_9fa48("59136"), searchQuery.toLowerCase())))))) || (stryMutAct_9fa48("59138") ? a.description.toLowerCase().includes(searchQuery.toLowerCase()) : stryMutAct_9fa48("59137") ? a.description?.toUpperCase().includes(searchQuery.toLowerCase()) : (stryCov_9fa48("59137", "59138"), a.description?.toLowerCase().includes(stryMutAct_9fa48("59139") ? searchQuery.toUpperCase() : (stryCov_9fa48("59139"), searchQuery.toLowerCase()))))))));
  const totalPages = Math.ceil(stryMutAct_9fa48("59140") ? filteredArtifacts.length * itemsPerPage : (stryCov_9fa48("59140"), filteredArtifacts.length / itemsPerPage));
  const paginatedArtifacts = stryMutAct_9fa48("59141") ? filteredArtifacts : (stryCov_9fa48("59141"), filteredArtifacts.slice(stryMutAct_9fa48("59142") ? (currentPage - 1) / itemsPerPage : (stryCov_9fa48("59142"), (stryMutAct_9fa48("59143") ? currentPage + 1 : (stryCov_9fa48("59143"), currentPage - 1)) * itemsPerPage), stryMutAct_9fa48("59144") ? currentPage / itemsPerPage : (stryCov_9fa48("59144"), currentPage * itemsPerPage)));
  useEffect(() => {
    loadData();
  }, stryMutAct_9fa48("59146") ? ["Stryker was here"] : (stryCov_9fa48("59146"), []));
  const loadData = async () => {
    try {
      const [artRes, dashRes] = await Promise.all(stryMutAct_9fa48("59149") ? [] : (stryCov_9fa48("59149"), [apiClient.api.get<{
        data: Artifact[];
      }>('/eternal/artifacts'), apiClient.api.get<{
        data: Dashboard;
      }>('/eternal/dashboard')]));
      if (stryMutAct_9fa48("59153") ? false : stryMutAct_9fa48("59152") ? true : (stryCov_9fa48("59152", "59153"), artRes.success)) {
        setArtifacts(stryMutAct_9fa48("59157") ? ((artRes.data as any)?.data || artRes.data) && [] : stryMutAct_9fa48("59156") ? false : stryMutAct_9fa48("59155") ? true : (stryCov_9fa48("59155", "59156", "59157"), (stryMutAct_9fa48("59159") ? (artRes.data as any)?.data && artRes.data : stryMutAct_9fa48("59158") ? false : (stryCov_9fa48("59158", "59159"), (stryMutAct_9fa48("59160") ? (artRes.data as any).data : (stryCov_9fa48("59160"), (artRes.data as any)?.data)) || artRes.data)) || (stryMutAct_9fa48("59161") ? ["Stryker was here"] : (stryCov_9fa48("59161"), []))));
      }
      if (stryMutAct_9fa48("59163") ? false : stryMutAct_9fa48("59162") ? true : (stryCov_9fa48("59162", "59163"), dashRes.success)) {
        setDashboard(stryMutAct_9fa48("59167") ? ((dashRes.data as any)?.data || dashRes.data) && null : stryMutAct_9fa48("59166") ? false : stryMutAct_9fa48("59165") ? true : (stryCov_9fa48("59165", "59166", "59167"), (stryMutAct_9fa48("59169") ? (dashRes.data as any)?.data && dashRes.data : stryMutAct_9fa48("59168") ? false : (stryCov_9fa48("59168", "59169"), (stryMutAct_9fa48("59170") ? (dashRes.data as any).data : (stryCov_9fa48("59170"), (dashRes.data as any)?.data)) || dashRes.data)) || null));
      }
    } catch (error) {
      console.error('Failed to load Eternal data:', error);
    } finally {
      setIsLoading(stryMutAct_9fa48("59174") ? true : (stryCov_9fa48("59174"), false));
    }
  };
  const archiveArtifact = async () => {
    try {
      await apiClient.api.post('/eternal/artifacts', newArtifact);
      setShowArchiveModal(stryMutAct_9fa48("59178") ? true : (stryCov_9fa48("59178"), false));
      setNewArtifact(stryMutAct_9fa48("59179") ? {} : (stryCov_9fa48("59179"), {
        title: '',
        description: '',
        content: '',
        artifactType: 'STRATEGIC_DECISION',
        retentionYears: 100,
        legalHold: stryMutAct_9fa48("59184") ? true : (stryCov_9fa48("59184"), false)
      }));
      await loadData();
    } catch (error) {
      console.error('Archive failed:', error);
    }
  };
  const verifyArtifact = async (id: string) => {
    try {
      await apiClient.api.post(`/eternal/artifacts/${id}/verify`, stryMutAct_9fa48("59190") ? {} : (stryCov_9fa48("59190"), {
        validationType: 'MANUAL'
      }));
      await loadData();
    } catch (error) {
      console.error('Verification failed:', error);
    }
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        if (stryMutAct_9fa48("59195")) {} else {
          stryCov_9fa48("59195");
          return 'text-emerald-400 bg-emerald-500/20';
        }
      case 'DRIFT_DETECTED':
        if (stryMutAct_9fa48("59198")) {} else {
          stryCov_9fa48("59198");
          return 'text-red-400 bg-red-500/20';
        }
      case 'PENDING':
        if (stryMutAct_9fa48("59201")) {} else {
          stryCov_9fa48("59201");
          return 'text-yellow-400 bg-yellow-500/20';
        }
      default:
        if (stryMutAct_9fa48("59204")) {} else {
          stryCov_9fa48("59204");
          return 'text-slate-400 bg-slate-500/20';
        }
    }
  };
  if (stryMutAct_9fa48("59207") ? false : stryMutAct_9fa48("59206") ? true : (stryCov_9fa48("59206", "59207"), isLoading)) {
    return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Loading Eternal...</div>;
  }
  return <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Archive className="w-10 h-10 text-amber-400" />
            <div>
              <h1 className="text-3xl font-bold">CendiaEternal™</h1>
              <p className="text-slate-400">Ultra-Long Horizon Archive - "A memory designed to outlive us."</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a href="/sovereign/vox?context=artifact" className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg text-sm font-medium flex items-center gap-2">
              <Link2 className="w-4 h-4" /> Stakeholder Assembly
            </a>
            <button onClick={() => {
            const reportData = stryMutAct_9fa48("59210") ? {} : (stryCov_9fa48("59210"), {
              generated: new Date().toISOString(),
              artifacts: artifacts.map(stryMutAct_9fa48("59211") ? () => undefined : (stryCov_9fa48("59211"), a => stryMutAct_9fa48("59212") ? {} : (stryCov_9fa48("59212"), {
                id: a.id,
                title: a.title,
                type: a.artifactType,
                retention: a.retentionYears
              }))),
              dashboard,
              policies: retentionPolicies
            });
            const blob = new Blob(stryMutAct_9fa48("59213") ? [] : (stryCov_9fa48("59213"), [JSON.stringify(reportData, null, 2)]), stryMutAct_9fa48("59214") ? {} : (stryCov_9fa48("59214"), {
              type: 'application/json'
            }));
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `eternal-archive-report-${new Date().toISOString().split('T')[0]}.json`;
            a.click();
          }} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm flex items-center gap-2">
              <Download className="w-4 h-4" /> Export Archive
            </button>
          </div>
        </div>
      </div>

      {/* Dashboard Stats */}
      {stryMutAct_9fa48("59221") ? dashboard || <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center gap-2 text-slate-400 text-sm"><FileText className="w-4 h-4" /> Total Artifacts</div>
            <div className="text-3xl font-bold">{dashboard.totalArtifacts}</div>
          </div>
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center gap-2 text-slate-400 text-sm"><Shield className="w-4 h-4" /> Integrity Rate</div>
            <div className="text-3xl font-bold text-emerald-400">{dashboard.integrityRate}%</div>
          </div>
          <button onClick={() => setShowRetentionPolicy(true)} className="bg-slate-800 rounded-lg p-4 border border-slate-700 hover:border-amber-500/50 transition-all text-left">
            <div className="flex items-center gap-2 text-slate-400 text-sm"><Clock className="w-4 h-4" /> Avg Retention</div>
            <div className="text-3xl font-bold text-amber-400">{dashboard.avgRetentionYears} yrs</div>
            <div className="text-xs text-amber-400/60 mt-1">View retention policy →</div>
          </button>
          <button onClick={() => setShowSuccessorWorkflow(true)} className="bg-slate-800 rounded-lg p-4 border border-slate-700 hover:border-purple-500/50 transition-all text-left">
            <div className="flex items-center gap-2 text-slate-400 text-sm"><Users className="w-4 h-4" /> Successors</div>
            <div className="text-3xl font-bold">{dashboard.definedSuccessors}</div>
            <div className="text-xs text-purple-400/60 mt-1">Manage access →</div>
          </button>
        </div> : stryMutAct_9fa48("59220") ? false : stryMutAct_9fa48("59219") ? true : (stryCov_9fa48("59219", "59220", "59221"), dashboard && <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center gap-2 text-slate-400 text-sm"><FileText className="w-4 h-4" /> Total Artifacts</div>
            <div className="text-3xl font-bold">{dashboard.totalArtifacts}</div>
          </div>
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center gap-2 text-slate-400 text-sm"><Shield className="w-4 h-4" /> Integrity Rate</div>
            <div className="text-3xl font-bold text-emerald-400">{dashboard.integrityRate}%</div>
          </div>
          <button onClick={stryMutAct_9fa48("59222") ? () => undefined : (stryCov_9fa48("59222"), () => setShowRetentionPolicy(stryMutAct_9fa48("59223") ? false : (stryCov_9fa48("59223"), true)))} className="bg-slate-800 rounded-lg p-4 border border-slate-700 hover:border-amber-500/50 transition-all text-left">
            <div className="flex items-center gap-2 text-slate-400 text-sm"><Clock className="w-4 h-4" /> Avg Retention</div>
            <div className="text-3xl font-bold text-amber-400">{dashboard.avgRetentionYears} yrs</div>
            <div className="text-xs text-amber-400/60 mt-1">View retention policy →</div>
          </button>
          <button onClick={stryMutAct_9fa48("59224") ? () => undefined : (stryCov_9fa48("59224"), () => setShowSuccessorWorkflow(stryMutAct_9fa48("59225") ? false : (stryCov_9fa48("59225"), true)))} className="bg-slate-800 rounded-lg p-4 border border-slate-700 hover:border-purple-500/50 transition-all text-left">
            <div className="flex items-center gap-2 text-slate-400 text-sm"><Users className="w-4 h-4" /> Successors</div>
            <div className="text-3xl font-bold">{dashboard.definedSuccessors}</div>
            <div className="text-xs text-purple-400/60 mt-1">Manage access →</div>
          </button>
        </div>)}

      {/* Immutability & Integrity Banner */}
      <div className="bg-gradient-to-r from-slate-800 to-emerald-900/30 rounded-lg p-6 border border-emerald-500/30 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Hash className="w-6 h-6 text-emerald-400" />
            <div>
              <h2 className="text-lg font-semibold">Cryptographic Immutability</h2>
              <p className="text-sm text-slate-400">Every artifact is hash-chained and signed for tamper-evident storage</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-medium">SHA-256 Hash Chain</span>
            <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-medium">WORM Storage</span>
            <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs font-medium">Digital Signatures</span>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4 text-center">
          <div className="p-3 bg-slate-900/50 rounded-lg">
            <div className="text-xs text-slate-400">Last Verification</div>
            <div className="font-medium text-emerald-400">2 hours ago</div>
          </div>
          <div className="p-3 bg-slate-900/50 rounded-lg">
            <div className="text-xs text-slate-400">Chain Length</div>
            <div className="font-medium">{stryMutAct_9fa48("59228") ? dashboard?.totalArtifacts && 0 : stryMutAct_9fa48("59227") ? false : stryMutAct_9fa48("59226") ? true : (stryCov_9fa48("59226", "59227", "59228"), (stryMutAct_9fa48("59229") ? dashboard.totalArtifacts : (stryCov_9fa48("59229"), dashboard?.totalArtifacts)) || 0)} blocks</div>
          </div>
          <div className="p-3 bg-slate-900/50 rounded-lg">
            <div className="text-xs text-slate-400">Drift Detected</div>
            <div className="font-medium text-red-400">{stryMutAct_9fa48("59232") ? dashboard?.driftedArtifacts && 0 : stryMutAct_9fa48("59231") ? false : stryMutAct_9fa48("59230") ? true : (stryCov_9fa48("59230", "59231", "59232"), (stryMutAct_9fa48("59233") ? dashboard.driftedArtifacts : (stryCov_9fa48("59233"), dashboard?.driftedArtifacts)) || 0)}</div>
          </div>
          <div className="p-3 bg-slate-900/50 rounded-lg">
            <div className="text-xs text-slate-400">Legal Holds</div>
            <div className="font-medium text-amber-400">3 active</div>
          </div>
        </div>
      </div>

      {/* "Why Now" Triggers - Contextual prompts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <button onClick={() => {
        setNewArtifact(stryMutAct_9fa48("59235") ? {} : (stryCov_9fa48("59235"), {
          ...newArtifact,
          artifactType: 'LEADERSHIP_WISDOM',
          title: 'Knowledge Transfer: ',
          description: 'Institutional knowledge from departing team member'
        }));
        setShowArchiveModal(stryMutAct_9fa48("59239") ? false : (stryCov_9fa48("59239"), true));
      }} className="p-4 bg-gradient-to-r from-amber-900/30 to-amber-800/20 border border-amber-500/30 rounded-lg text-left hover:border-amber-400/50 transition-all group">
          <div className="flex items-center gap-2 text-amber-400 mb-2">
            <Users className="w-5 h-5" />
            <span className="font-medium">Key Employee Leaving?</span>
          </div>
          <p className="text-sm text-slate-400">Capture their institutional knowledge before they go →</p>
        </button>
        <button onClick={() => {
        setNewArtifact(stryMutAct_9fa48("59241") ? {} : (stryCov_9fa48("59241"), {
          ...newArtifact,
          artifactType: 'CRISIS_RESPONSE',
          title: 'Crisis Learnings: ',
          description: 'How we handled and what we learned'
        }));
        setShowArchiveModal(stryMutAct_9fa48("59245") ? false : (stryCov_9fa48("59245"), true));
      }} className="p-4 bg-gradient-to-r from-red-900/30 to-red-800/20 border border-red-500/30 rounded-lg text-left hover:border-red-400/50 transition-all group">
          <div className="flex items-center gap-2 text-red-400 mb-2">
            <AlertTriangle className="w-5 h-5" />
            <span className="font-medium">Just Survived a Crisis?</span>
          </div>
          <p className="text-sm text-slate-400">Document lessons while they're fresh →</p>
        </button>
        <button onClick={() => {
        setNewArtifact(stryMutAct_9fa48("59247") ? {} : (stryCov_9fa48("59247"), {
          ...newArtifact,
          artifactType: 'STRATEGIC_DECISION',
          title: 'Strategic Pivot: ',
          description: 'Major strategic decision and rationale'
        }));
        setShowArchiveModal(stryMutAct_9fa48("59251") ? false : (stryCov_9fa48("59251"), true));
      }} className="p-4 bg-gradient-to-r from-purple-900/30 to-purple-800/20 border border-purple-500/30 rounded-lg text-left hover:border-purple-400/50 transition-all group">
          <div className="flex items-center gap-2 text-purple-400 mb-2">
            <FileText className="w-5 h-5" />
            <span className="font-medium">Major Decision Made?</span>
          </div>
          <p className="text-sm text-slate-400">Preserve the "why" for future leaders →</p>
        </button>
      </div>

      {/* Archive Button */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={stryMutAct_9fa48("59252") ? () => undefined : (stryCov_9fa48("59252"), () => setShowArchiveModal(stryMutAct_9fa48("59253") ? false : (stryCov_9fa48("59253"), true)))} className="px-4 py-2 bg-amber-600 hover:bg-amber-500 rounded-lg flex items-center gap-2">
            <Archive className="w-4 h-4" /> Archive New Artifact
          </button>
          <span className="text-xs text-slate-500">Policy-driven retention (configurable 1-100 years) • Cryptographic integrity • Successor inheritance</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={stryMutAct_9fa48("59254") ? () => undefined : (stryCov_9fa48("59254"), () => setShowRetentionPolicy(stryMutAct_9fa48("59255") ? false : (stryCov_9fa48("59255"), true)))} className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs flex items-center gap-1">
            <Settings className="w-3 h-3" /> Retention Policy
          </button>
          <button onClick={stryMutAct_9fa48("59256") ? () => undefined : (stryCov_9fa48("59256"), () => setShowSuccessorWorkflow(stryMutAct_9fa48("59257") ? false : (stryCov_9fa48("59257"), true)))} className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs flex items-center gap-1">
            <Key className="w-3 h-3" /> Access & Successors
          </button>
        </div>
      </div>

      {/* Artifacts Section with Search & View Toggle */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Archived Artifacts</h2>
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input type="text" value={searchQuery} onChange={e => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }} placeholder="Search artifacts..." className="pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-sm w-64 placeholder-slate-500" />
            </div>
            
            {/* View Toggle */}
            <div className="flex items-center gap-1 bg-slate-700 rounded-lg p-0.5">
              <button onClick={stryMutAct_9fa48("59259") ? () => undefined : (stryCov_9fa48("59259"), () => setViewMode('grid'))} className={`p-2 rounded ${(stryMutAct_9fa48("59264") ? viewMode !== 'grid' : stryMutAct_9fa48("59263") ? false : stryMutAct_9fa48("59262") ? true : (stryCov_9fa48("59262", "59263", "59264"), viewMode === 'grid')) ? 'bg-amber-600 text-white' : 'text-slate-400'}`} title="Grid view">
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button onClick={stryMutAct_9fa48("59268") ? () => undefined : (stryCov_9fa48("59268"), () => setViewMode('table'))} className={`p-2 rounded ${(stryMutAct_9fa48("59273") ? viewMode !== 'table' : stryMutAct_9fa48("59272") ? false : stryMutAct_9fa48("59271") ? true : (stryCov_9fa48("59271", "59272", "59273"), viewMode === 'table')) ? 'bg-amber-600 text-white' : 'text-slate-400'}`} title="Table view">
                <Table className="w-4 h-4" />
              </button>
            </div>

            {/* Audit Log */}
            <button onClick={stryMutAct_9fa48("59277") ? () => undefined : (stryCov_9fa48("59277"), () => setShowAuditLog(stryMutAct_9fa48("59278") ? false : (stryCov_9fa48("59278"), true)))} className="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs flex items-center gap-1">
              <Eye className="w-3 h-3" /> Audit Log
            </button>
          </div>
        </div>
        
        {(stryMutAct_9fa48("59281") ? filteredArtifacts.length === 0 || searchQuery : stryMutAct_9fa48("59280") ? false : stryMutAct_9fa48("59279") ? true : (stryCov_9fa48("59279", "59280", "59281"), (stryMutAct_9fa48("59283") ? filteredArtifacts.length !== 0 : stryMutAct_9fa48("59282") ? true : (stryCov_9fa48("59282", "59283"), filteredArtifacts.length === 0)) && searchQuery)) ? <div className="text-center py-8 text-slate-500">
            No artifacts match "{searchQuery}"
          </div> : (stryMutAct_9fa48("59286") ? artifacts.length !== 0 : stryMutAct_9fa48("59285") ? false : stryMutAct_9fa48("59284") ? true : (stryCov_9fa48("59284", "59285", "59286"), artifacts.length === 0)) ? <div className="text-center py-12">
            <Archive className="w-16 h-16 mx-auto mb-4 text-amber-400 opacity-50" />
            <h3 className="text-xl font-semibold text-white mb-2">Archive your first artifact</h3>
            <p className="text-slate-400 mb-6 max-w-md mx-auto">
              Start with your founding documents, key contracts, board resolutions, or critical decisions that shaped your organization.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mb-6">
              <button onClick={() => {
            setNewArtifact(stryMutAct_9fa48("59288") ? {} : (stryCov_9fa48("59288"), {
              ...newArtifact,
              artifactType: 'POLICY_DOCUMENT'
            }));
            setShowArchiveModal(stryMutAct_9fa48("59290") ? false : (stryCov_9fa48("59290"), true));
          }} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm flex items-center gap-2">
                📜 Founding Documents
              </button>
              <button onClick={() => {
            setNewArtifact(stryMutAct_9fa48("59292") ? {} : (stryCov_9fa48("59292"), {
              ...newArtifact,
              artifactType: 'STRATEGIC_DECISION'
            }));
            setShowArchiveModal(stryMutAct_9fa48("59294") ? false : (stryCov_9fa48("59294"), true));
          }} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm flex items-center gap-2">
                ⚖️ Key Decisions
              </button>
              <button onClick={() => {
            setNewArtifact(stryMutAct_9fa48("59296") ? {} : (stryCov_9fa48("59296"), {
              ...newArtifact,
              artifactType: 'LEADERSHIP_WISDOM'
            }));
            setShowArchiveModal(stryMutAct_9fa48("59298") ? false : (stryCov_9fa48("59298"), true));
          }} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm flex items-center gap-2">
                🧠 Leadership Wisdom
              </button>
            </div>
            <button onClick={stryMutAct_9fa48("59299") ? () => undefined : (stryCov_9fa48("59299"), () => setShowArchiveModal(stryMutAct_9fa48("59300") ? false : (stryCov_9fa48("59300"), true)))} className="px-6 py-3 bg-amber-600 hover:bg-amber-500 rounded-lg font-medium">
              Archive Your First Artifact →
            </button>
          </div> : (stryMutAct_9fa48("59303") ? viewMode !== 'grid' : stryMutAct_9fa48("59302") ? false : stryMutAct_9fa48("59301") ? true : (stryCov_9fa48("59301", "59302", "59303"), viewMode === 'grid')) ? <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginatedArtifacts.map(stryMutAct_9fa48("59305") ? () => undefined : (stryCov_9fa48("59305"), a => <div key={a.id} className="p-4 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs px-2 py-0.5 bg-slate-600 rounded">{a.artifactType.replace(/_/g, ' ')}</span>
                    <span className={`text-xs px-2 py-0.5 rounded ${getStatusColor(a.verificationStatus)}`}>{a.verificationStatus}</span>
                  </div>
                  <div className="font-medium mb-1">{a.title}</div>
                  <div className="text-sm text-slate-400 mb-3">{stryMutAct_9fa48("59309") ? a.description.substring(0, 80) : stryMutAct_9fa48("59308") ? a.description : (stryCov_9fa48("59308", "59309"), a.description?.substring(0, 80))}...</div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                    <span>Importance: {a.importanceScore}/100</span>
                    <span>Retention: {a.retentionYears} yrs</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <Lock className="w-3 h-3" />
                    <span>{a.accessLevel}</span>
                  </div>
                  {stryMutAct_9fa48("59312") ? a.verificationStatus !== 'VERIFIED' || <button onClick={() => verifyArtifact(a.id)} className="mt-3 w-full px-3 py-1 bg-emerald-600 hover:bg-emerald-500 rounded text-xs">
                      Verify Integrity
                    </button> : stryMutAct_9fa48("59311") ? false : stryMutAct_9fa48("59310") ? true : (stryCov_9fa48("59310", "59311", "59312"), (stryMutAct_9fa48("59314") ? a.verificationStatus === 'VERIFIED' : stryMutAct_9fa48("59313") ? true : (stryCov_9fa48("59313", "59314"), a.verificationStatus !== 'VERIFIED')) && <button onClick={stryMutAct_9fa48("59316") ? () => undefined : (stryCov_9fa48("59316"), () => verifyArtifact(a.id))} className="mt-3 w-full px-3 py-1 bg-emerald-600 hover:bg-emerald-500 rounded text-xs">
                      Verify Integrity
                    </button>)}
                </div>))}
            </div>
            {/* Pagination */}
            {stryMutAct_9fa48("59319") ? totalPages > 1 || <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-700">
                <span className="text-xs text-slate-500">
                  Showing {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredArtifacts.length)} of {filteredArtifacts.length}
                </span>
                <div className="flex items-center gap-2">
                  <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 bg-slate-700 hover:bg-slate-600 rounded disabled:opacity-50">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-sm">Page {currentPage} of {totalPages}</span>
                  <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2 bg-slate-700 hover:bg-slate-600 rounded disabled:opacity-50">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div> : stryMutAct_9fa48("59318") ? false : stryMutAct_9fa48("59317") ? true : (stryCov_9fa48("59317", "59318", "59319"), (stryMutAct_9fa48("59322") ? totalPages <= 1 : stryMutAct_9fa48("59321") ? totalPages >= 1 : stryMutAct_9fa48("59320") ? true : (stryCov_9fa48("59320", "59321", "59322"), totalPages > 1)) && <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-700">
                <span className="text-xs text-slate-500">
                  Showing {stryMutAct_9fa48("59323") ? (currentPage - 1) * itemsPerPage - 1 : (stryCov_9fa48("59323"), (stryMutAct_9fa48("59324") ? (currentPage - 1) / itemsPerPage : (stryCov_9fa48("59324"), (stryMutAct_9fa48("59325") ? currentPage + 1 : (stryCov_9fa48("59325"), currentPage - 1)) * itemsPerPage)) + 1)}-{stryMutAct_9fa48("59326") ? Math.max(currentPage * itemsPerPage, filteredArtifacts.length) : (stryCov_9fa48("59326"), Math.min(stryMutAct_9fa48("59327") ? currentPage / itemsPerPage : (stryCov_9fa48("59327"), currentPage * itemsPerPage), filteredArtifacts.length))} of {filteredArtifacts.length}
                </span>
                <div className="flex items-center gap-2">
                  <button onClick={stryMutAct_9fa48("59328") ? () => undefined : (stryCov_9fa48("59328"), () => setCurrentPage(stryMutAct_9fa48("59329") ? () => undefined : (stryCov_9fa48("59329"), p => stryMutAct_9fa48("59330") ? Math.min(1, p - 1) : (stryCov_9fa48("59330"), Math.max(1, stryMutAct_9fa48("59331") ? p + 1 : (stryCov_9fa48("59331"), p - 1))))))} disabled={stryMutAct_9fa48("59334") ? currentPage !== 1 : stryMutAct_9fa48("59333") ? false : stryMutAct_9fa48("59332") ? true : (stryCov_9fa48("59332", "59333", "59334"), currentPage === 1)} className="p-2 bg-slate-700 hover:bg-slate-600 rounded disabled:opacity-50">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-sm">Page {currentPage} of {totalPages}</span>
                  <button onClick={stryMutAct_9fa48("59335") ? () => undefined : (stryCov_9fa48("59335"), () => setCurrentPage(stryMutAct_9fa48("59336") ? () => undefined : (stryCov_9fa48("59336"), p => stryMutAct_9fa48("59337") ? Math.max(totalPages, p + 1) : (stryCov_9fa48("59337"), Math.min(totalPages, stryMutAct_9fa48("59338") ? p - 1 : (stryCov_9fa48("59338"), p + 1))))))} disabled={stryMutAct_9fa48("59341") ? currentPage !== totalPages : stryMutAct_9fa48("59340") ? false : stryMutAct_9fa48("59339") ? true : (stryCov_9fa48("59339", "59340", "59341"), currentPage === totalPages)} className="p-2 bg-slate-700 hover:bg-slate-600 rounded disabled:opacity-50">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>)}
          </> : (/* Table View */
      <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-400 border-b border-slate-700">
                    <th className="pb-3 font-medium">Title</th>
                    <th className="pb-3 font-medium">Type</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium text-right">Retention</th>
                    <th className="pb-3 font-medium text-right">Importance</th>
                    <th className="pb-3 font-medium">Access</th>
                    <th className="pb-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedArtifacts.map(stryMutAct_9fa48("59342") ? () => undefined : (stryCov_9fa48("59342"), a => <tr key={a.id} className="border-b border-slate-800 hover:bg-slate-700/30">
                      <td className="py-3 font-medium">{a.title}</td>
                      <td className="py-3">
                        <span className="text-xs px-2 py-0.5 bg-slate-600 rounded">{a.artifactType.replace(/_/g, ' ')}</span>
                      </td>
                      <td className="py-3">
                        <span className={`text-xs px-2 py-0.5 rounded ${getStatusColor(a.verificationStatus)}`}>
                          {a.verificationStatus}
                        </span>
                      </td>
                      <td className="py-3 text-right text-amber-400">{a.retentionYears} yrs</td>
                      <td className="py-3 text-right">{a.importanceScore}/100</td>
                      <td className="py-3 text-slate-400">{a.accessLevel}</td>
                      <td className="py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-1 hover:bg-slate-600 rounded" title="View">
                            <Eye className="w-4 h-4 text-slate-400" />
                          </button>
                          <button className="p-1 hover:bg-slate-600 rounded" title="Download">
                            <Download className="w-4 h-4 text-slate-400" />
                          </button>
                          {stryMutAct_9fa48("59347") ? a.verificationStatus !== 'VERIFIED' || <button onClick={() => verifyArtifact(a.id)} className="px-2 py-1 bg-emerald-600 hover:bg-emerald-500 rounded text-xs">
                              Verify
                            </button> : stryMutAct_9fa48("59346") ? false : stryMutAct_9fa48("59345") ? true : (stryCov_9fa48("59345", "59346", "59347"), (stryMutAct_9fa48("59349") ? a.verificationStatus === 'VERIFIED' : stryMutAct_9fa48("59348") ? true : (stryCov_9fa48("59348", "59349"), a.verificationStatus !== 'VERIFIED')) && <button onClick={stryMutAct_9fa48("59351") ? () => undefined : (stryCov_9fa48("59351"), () => verifyArtifact(a.id))} className="px-2 py-1 bg-emerald-600 hover:bg-emerald-500 rounded text-xs">
                              Verify
                            </button>)}
                        </div>
                      </td>
                    </tr>))}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            {stryMutAct_9fa48("59354") ? totalPages > 1 || <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-700">
                <span className="text-xs text-slate-500">
                  Showing {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredArtifacts.length)} of {filteredArtifacts.length}
                </span>
                <div className="flex items-center gap-2">
                  <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 bg-slate-700 hover:bg-slate-600 rounded disabled:opacity-50">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-sm">Page {currentPage} of {totalPages}</span>
                  <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2 bg-slate-700 hover:bg-slate-600 rounded disabled:opacity-50">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div> : stryMutAct_9fa48("59353") ? false : stryMutAct_9fa48("59352") ? true : (stryCov_9fa48("59352", "59353", "59354"), (stryMutAct_9fa48("59357") ? totalPages <= 1 : stryMutAct_9fa48("59356") ? totalPages >= 1 : stryMutAct_9fa48("59355") ? true : (stryCov_9fa48("59355", "59356", "59357"), totalPages > 1)) && <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-700">
                <span className="text-xs text-slate-500">
                  Showing {stryMutAct_9fa48("59358") ? (currentPage - 1) * itemsPerPage - 1 : (stryCov_9fa48("59358"), (stryMutAct_9fa48("59359") ? (currentPage - 1) / itemsPerPage : (stryCov_9fa48("59359"), (stryMutAct_9fa48("59360") ? currentPage + 1 : (stryCov_9fa48("59360"), currentPage - 1)) * itemsPerPage)) + 1)}-{stryMutAct_9fa48("59361") ? Math.max(currentPage * itemsPerPage, filteredArtifacts.length) : (stryCov_9fa48("59361"), Math.min(stryMutAct_9fa48("59362") ? currentPage / itemsPerPage : (stryCov_9fa48("59362"), currentPage * itemsPerPage), filteredArtifacts.length))} of {filteredArtifacts.length}
                </span>
                <div className="flex items-center gap-2">
                  <button onClick={stryMutAct_9fa48("59363") ? () => undefined : (stryCov_9fa48("59363"), () => setCurrentPage(stryMutAct_9fa48("59364") ? () => undefined : (stryCov_9fa48("59364"), p => stryMutAct_9fa48("59365") ? Math.min(1, p - 1) : (stryCov_9fa48("59365"), Math.max(1, stryMutAct_9fa48("59366") ? p + 1 : (stryCov_9fa48("59366"), p - 1))))))} disabled={stryMutAct_9fa48("59369") ? currentPage !== 1 : stryMutAct_9fa48("59368") ? false : stryMutAct_9fa48("59367") ? true : (stryCov_9fa48("59367", "59368", "59369"), currentPage === 1)} className="p-2 bg-slate-700 hover:bg-slate-600 rounded disabled:opacity-50">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-sm">Page {currentPage} of {totalPages}</span>
                  <button onClick={stryMutAct_9fa48("59370") ? () => undefined : (stryCov_9fa48("59370"), () => setCurrentPage(stryMutAct_9fa48("59371") ? () => undefined : (stryCov_9fa48("59371"), p => stryMutAct_9fa48("59372") ? Math.max(totalPages, p + 1) : (stryCov_9fa48("59372"), Math.min(totalPages, stryMutAct_9fa48("59373") ? p - 1 : (stryCov_9fa48("59373"), p + 1))))))} disabled={stryMutAct_9fa48("59376") ? currentPage !== totalPages : stryMutAct_9fa48("59375") ? false : stryMutAct_9fa48("59374") ? true : (stryCov_9fa48("59374", "59375", "59376"), currentPage === totalPages)} className="p-2 bg-slate-700 hover:bg-slate-600 rounded disabled:opacity-50">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>)}
          </>)}
      </div>

      {/* Archive Modal */}
      {stryMutAct_9fa48("59379") ? showArchiveModal || <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-lg p-6 w-full max-w-lg border border-slate-700">
            <h3 className="text-xl font-semibold mb-4">Archive New Artifact</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Type</label>
                <select value={newArtifact.artifactType} onChange={e => setNewArtifact({
              ...newArtifact,
              artifactType: e.target.value
            })} className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2">
                  <option value="STRATEGIC_DECISION">Strategic Decision</option>
                  <option value="POLICY_DOCUMENT">Policy Document</option>
                  <option value="LESSONS_LEARNED">Lessons Learned</option>
                  <option value="LEADERSHIP_WISDOM">Leadership Wisdom</option>
                  <option value="CRISIS_RESPONSE">Crisis Response</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Title</label>
                <input value={newArtifact.title} onChange={e => setNewArtifact({
              ...newArtifact,
              title: e.target.value
            })} className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2" placeholder="Artifact title" />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Description</label>
                <input value={newArtifact.description} onChange={e => setNewArtifact({
              ...newArtifact,
              description: e.target.value
            })} className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2" placeholder="Brief description" />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Content</label>
                <textarea value={newArtifact.content} onChange={e => setNewArtifact({
              ...newArtifact,
              content: e.target.value
            })} className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 h-24" placeholder="Full content to archive" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowArchiveModal(false)} className="flex-1 px-4 py-2 bg-slate-600 hover:bg-slate-500 rounded">Cancel</button>
              <button onClick={archiveArtifact} className="flex-1 px-4 py-2 bg-amber-600 hover:bg-amber-500 rounded">Archive</button>
            </div>
          </div>
        </div> : stryMutAct_9fa48("59378") ? false : stryMutAct_9fa48("59377") ? true : (stryCov_9fa48("59377", "59378", "59379"), showArchiveModal && <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-lg p-6 w-full max-w-lg border border-slate-700">
            <h3 className="text-xl font-semibold mb-4">Archive New Artifact</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Type</label>
                <select value={newArtifact.artifactType} onChange={stryMutAct_9fa48("59380") ? () => undefined : (stryCov_9fa48("59380"), e => setNewArtifact(stryMutAct_9fa48("59381") ? {} : (stryCov_9fa48("59381"), {
              ...newArtifact,
              artifactType: e.target.value
            })))} className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2">
                  <option value="STRATEGIC_DECISION">Strategic Decision</option>
                  <option value="POLICY_DOCUMENT">Policy Document</option>
                  <option value="LESSONS_LEARNED">Lessons Learned</option>
                  <option value="LEADERSHIP_WISDOM">Leadership Wisdom</option>
                  <option value="CRISIS_RESPONSE">Crisis Response</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Title</label>
                <input value={newArtifact.title} onChange={stryMutAct_9fa48("59382") ? () => undefined : (stryCov_9fa48("59382"), e => setNewArtifact(stryMutAct_9fa48("59383") ? {} : (stryCov_9fa48("59383"), {
              ...newArtifact,
              title: e.target.value
            })))} className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2" placeholder="Artifact title" />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Description</label>
                <input value={newArtifact.description} onChange={stryMutAct_9fa48("59384") ? () => undefined : (stryCov_9fa48("59384"), e => setNewArtifact(stryMutAct_9fa48("59385") ? {} : (stryCov_9fa48("59385"), {
              ...newArtifact,
              description: e.target.value
            })))} className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2" placeholder="Brief description" />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Content</label>
                <textarea value={newArtifact.content} onChange={stryMutAct_9fa48("59386") ? () => undefined : (stryCov_9fa48("59386"), e => setNewArtifact(stryMutAct_9fa48("59387") ? {} : (stryCov_9fa48("59387"), {
              ...newArtifact,
              content: e.target.value
            })))} className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 h-24" placeholder="Full content to archive" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={stryMutAct_9fa48("59388") ? () => undefined : (stryCov_9fa48("59388"), () => setShowArchiveModal(stryMutAct_9fa48("59389") ? true : (stryCov_9fa48("59389"), false)))} className="flex-1 px-4 py-2 bg-slate-600 hover:bg-slate-500 rounded">Cancel</button>
              <button onClick={archiveArtifact} className="flex-1 px-4 py-2 bg-amber-600 hover:bg-amber-500 rounded">Archive</button>
            </div>
          </div>
        </div>)}
      {/* Retention Policy Modal */}
      {stryMutAct_9fa48("59392") ? showRetentionPolicy || <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={() => setShowRetentionPolicy(false)}>
          <div className="bg-slate-800 rounded-xl p-6 w-full max-w-2xl border border-slate-700" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold">Retention Policy by Artifact Type</h3>
                <p className="text-sm text-slate-400">Configure how long each type of artifact is preserved</p>
              </div>
              <button onClick={() => setShowRetentionPolicy(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <div className="space-y-4">
              {retentionPolicies.map((policy, index) => {
            const isLegalHold = policy.type === 'Crisis Response' || policy.type === 'Financial Records';
            return <div key={policy.type} className="p-4 bg-slate-700/50 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="font-medium">{policy.type}</div>
                        <div className="text-xs text-slate-400">{policy.legalBasis}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-amber-400">{policy.years} years</div>
                        {isLegalHold && <span className="text-xs text-red-400">Legal minimum</span>}
                      </div>
                    </div>
                    {!isLegalHold && <div className="flex items-center gap-3">
                        <input type="range" min="1" max="100" value={policy.years} onChange={e => {
                  const newPolicies = [...retentionPolicies];
                  newPolicies[index] = {
                    ...policy,
                    years: parseInt(e.target.value)
                  };
                  setRetentionPolicies(newPolicies);
                }} className="flex-1 h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-amber-500" />
                        <input type="number" min="1" max="100" value={policy.years} onChange={e => {
                  const newPolicies = [...retentionPolicies];
                  newPolicies[index] = {
                    ...policy,
                    years: Math.min(100, Math.max(1, parseInt(e.target.value) || 1))
                  };
                  setRetentionPolicies(newPolicies);
                }} className="w-16 px-2 py-1 bg-slate-600 border border-slate-500 rounded text-center text-sm" />
                      </div>}
                  </div>;
          })}
            </div>
            <div className="mt-4 flex justify-end">
              <button onClick={() => {
            // Save retention policies to backend
            apiClient.api.post('/eternal/retention-policies', {
              policies: retentionPolicies
            });
            setShowRetentionPolicy(false);
          }} className="px-4 py-2 bg-amber-600 hover:bg-amber-500 rounded-lg font-medium">
                Save Policies
              </button>
            </div>
            <div className="mt-6 p-4 bg-amber-900/20 border border-amber-500/30 rounded-lg">
              <div className="flex items-center gap-2 text-amber-400 mb-2">
                <Scale className="w-4 h-4" />
                <span className="font-medium">Legal Hold Override</span>
              </div>
              <p className="text-sm text-slate-300">Artifacts under legal hold cannot be modified or deleted until the hold is released by authorized counsel.</p>
            </div>
          </div>
        </div> : stryMutAct_9fa48("59391") ? false : stryMutAct_9fa48("59390") ? true : (stryCov_9fa48("59390", "59391", "59392"), showRetentionPolicy && <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={stryMutAct_9fa48("59393") ? () => undefined : (stryCov_9fa48("59393"), () => setShowRetentionPolicy(stryMutAct_9fa48("59394") ? true : (stryCov_9fa48("59394"), false)))}>
          <div className="bg-slate-800 rounded-xl p-6 w-full max-w-2xl border border-slate-700" onClick={stryMutAct_9fa48("59395") ? () => undefined : (stryCov_9fa48("59395"), e => e.stopPropagation())}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold">Retention Policy by Artifact Type</h3>
                <p className="text-sm text-slate-400">Configure how long each type of artifact is preserved</p>
              </div>
              <button onClick={stryMutAct_9fa48("59396") ? () => undefined : (stryCov_9fa48("59396"), () => setShowRetentionPolicy(stryMutAct_9fa48("59397") ? true : (stryCov_9fa48("59397"), false)))} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <div className="space-y-4">
              {retentionPolicies.map((policy, index) => {
            const isLegalHold = stryMutAct_9fa48("59401") ? policy.type === 'Crisis Response' && policy.type === 'Financial Records' : stryMutAct_9fa48("59400") ? false : stryMutAct_9fa48("59399") ? true : (stryCov_9fa48("59399", "59400", "59401"), (stryMutAct_9fa48("59403") ? policy.type !== 'Crisis Response' : stryMutAct_9fa48("59402") ? false : (stryCov_9fa48("59402", "59403"), policy.type === 'Crisis Response')) || (stryMutAct_9fa48("59406") ? policy.type !== 'Financial Records' : stryMutAct_9fa48("59405") ? false : (stryCov_9fa48("59405", "59406"), policy.type === 'Financial Records')));
            return <div key={policy.type} className="p-4 bg-slate-700/50 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="font-medium">{policy.type}</div>
                        <div className="text-xs text-slate-400">{policy.legalBasis}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-amber-400">{policy.years} years</div>
                        {stryMutAct_9fa48("59410") ? isLegalHold || <span className="text-xs text-red-400">Legal minimum</span> : stryMutAct_9fa48("59409") ? false : stryMutAct_9fa48("59408") ? true : (stryCov_9fa48("59408", "59409", "59410"), isLegalHold && <span className="text-xs text-red-400">Legal minimum</span>)}
                      </div>
                    </div>
                    {stryMutAct_9fa48("59413") ? !isLegalHold || <div className="flex items-center gap-3">
                        <input type="range" min="1" max="100" value={policy.years} onChange={e => {
                  const newPolicies = [...retentionPolicies];
                  newPolicies[index] = {
                    ...policy,
                    years: parseInt(e.target.value)
                  };
                  setRetentionPolicies(newPolicies);
                }} className="flex-1 h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-amber-500" />
                        <input type="number" min="1" max="100" value={policy.years} onChange={e => {
                  const newPolicies = [...retentionPolicies];
                  newPolicies[index] = {
                    ...policy,
                    years: Math.min(100, Math.max(1, parseInt(e.target.value) || 1))
                  };
                  setRetentionPolicies(newPolicies);
                }} className="w-16 px-2 py-1 bg-slate-600 border border-slate-500 rounded text-center text-sm" />
                      </div> : stryMutAct_9fa48("59412") ? false : stryMutAct_9fa48("59411") ? true : (stryCov_9fa48("59411", "59412", "59413"), (stryMutAct_9fa48("59414") ? isLegalHold : (stryCov_9fa48("59414"), !isLegalHold)) && <div className="flex items-center gap-3">
                        <input type="range" min="1" max="100" value={policy.years} onChange={e => {
                  const newPolicies = stryMutAct_9fa48("59416") ? [] : (stryCov_9fa48("59416"), [...retentionPolicies]);
                  newPolicies[index] = stryMutAct_9fa48("59417") ? {} : (stryCov_9fa48("59417"), {
                    ...policy,
                    years: parseInt(e.target.value)
                  });
                  setRetentionPolicies(newPolicies);
                }} className="flex-1 h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-amber-500" />
                        <input type="number" min="1" max="100" value={policy.years} onChange={e => {
                  const newPolicies = stryMutAct_9fa48("59419") ? [] : (stryCov_9fa48("59419"), [...retentionPolicies]);
                  newPolicies[index] = stryMutAct_9fa48("59420") ? {} : (stryCov_9fa48("59420"), {
                    ...policy,
                    years: stryMutAct_9fa48("59421") ? Math.max(100, Math.max(1, parseInt(e.target.value) || 1)) : (stryCov_9fa48("59421"), Math.min(100, stryMutAct_9fa48("59422") ? Math.min(1, parseInt(e.target.value) || 1) : (stryCov_9fa48("59422"), Math.max(1, stryMutAct_9fa48("59425") ? parseInt(e.target.value) && 1 : stryMutAct_9fa48("59424") ? false : stryMutAct_9fa48("59423") ? true : (stryCov_9fa48("59423", "59424", "59425"), parseInt(e.target.value) || 1)))))
                  });
                  setRetentionPolicies(newPolicies);
                }} className="w-16 px-2 py-1 bg-slate-600 border border-slate-500 rounded text-center text-sm" />
                      </div>)}
                  </div>;
          })}
            </div>
            <div className="mt-4 flex justify-end">
              <button onClick={() => {
            // Save retention policies to backend
            apiClient.api.post('/eternal/retention-policies', stryMutAct_9fa48("59428") ? {} : (stryCov_9fa48("59428"), {
              policies: retentionPolicies
            }));
            setShowRetentionPolicy(stryMutAct_9fa48("59429") ? true : (stryCov_9fa48("59429"), false));
          }} className="px-4 py-2 bg-amber-600 hover:bg-amber-500 rounded-lg font-medium">
                Save Policies
              </button>
            </div>
            <div className="mt-6 p-4 bg-amber-900/20 border border-amber-500/30 rounded-lg">
              <div className="flex items-center gap-2 text-amber-400 mb-2">
                <Scale className="w-4 h-4" />
                <span className="font-medium">Legal Hold Override</span>
              </div>
              <p className="text-sm text-slate-300">Artifacts under legal hold cannot be modified or deleted until the hold is released by authorized counsel.</p>
            </div>
          </div>
        </div>)}

      {/* Successor Workflow Modal */}
      {stryMutAct_9fa48("59432") ? showSuccessorWorkflow || <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={() => setShowSuccessorWorkflow(false)}>
          <div className="bg-slate-800 rounded-xl p-6 w-full max-w-2xl border border-slate-700" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold">Access & Successor Management</h3>
                <p className="text-sm text-slate-400">Define who can access artifacts and designate successors</p>
              </div>
              <button onClick={() => setShowSuccessorWorkflow(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            
            {/* Workflow Steps */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-slate-300 mb-3">Successor Designation Workflow</h4>
              <div className="flex items-center gap-2">
                {['Nominate', 'Approve', 'Verify', 'Activate'].map((step, i) => <React.Fragment key={step}>
                    <div className="flex-1 p-3 bg-slate-700/50 rounded-lg text-center">
                      <div className="text-xs text-slate-400">Step {i + 1}</div>
                      <div className="font-medium text-sm">{step}</div>
                    </div>
                    {i < 3 && <span className="text-slate-600">→</span>}
                  </React.Fragment>)}
              </div>
            </div>

            {/* Current Successors */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-slate-300 mb-3">Designated Successors</h4>
              <div className="space-y-2">
                {[{
              name: 'Sarah Chen',
              role: 'Chief of Staff',
              status: 'Active',
              approvedBy: 'CEO',
              accessLevel: 'Full'
            }, {
              name: 'Michael Torres',
              role: 'General Counsel',
              status: 'Active',
              approvedBy: 'Board',
              accessLevel: 'Legal'
            }, {
              name: 'Emily Watson',
              role: 'Board Secretary',
              status: 'Pending',
              approvedBy: 'Pending',
              accessLevel: 'Read-only'
            }].map(s => <div key={s.name} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
                        {s.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="font-medium">{s.name}</div>
                        <div className="text-xs text-slate-400">{s.role}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right text-xs">
                        <div className="text-slate-400">Approved by: {s.approvedBy}</div>
                        <div className="text-slate-400">Access: {s.accessLevel}</div>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-xs ${s.status === 'Active' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'}`}>{s.status}</span>
                    </div>
                  </div>)}
              </div>
            </div>

            <div className="flex gap-3">
              <button className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg font-medium flex items-center justify-center gap-2">
                <Users className="w-4 h-4" /> Nominate New Successor
              </button>
              <button onClick={() => {
            setShowSuccessorWorkflow(false);
            setShowAuditLog(true);
          }} className="px-4 py-2 bg-slate-600 hover:bg-slate-500 rounded-lg">
                View Audit Log
              </button>
            </div>
          </div>
        </div> : stryMutAct_9fa48("59431") ? false : stryMutAct_9fa48("59430") ? true : (stryCov_9fa48("59430", "59431", "59432"), showSuccessorWorkflow && <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={stryMutAct_9fa48("59433") ? () => undefined : (stryCov_9fa48("59433"), () => setShowSuccessorWorkflow(stryMutAct_9fa48("59434") ? true : (stryCov_9fa48("59434"), false)))}>
          <div className="bg-slate-800 rounded-xl p-6 w-full max-w-2xl border border-slate-700" onClick={stryMutAct_9fa48("59435") ? () => undefined : (stryCov_9fa48("59435"), e => e.stopPropagation())}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold">Access & Successor Management</h3>
                <p className="text-sm text-slate-400">Define who can access artifacts and designate successors</p>
              </div>
              <button onClick={stryMutAct_9fa48("59436") ? () => undefined : (stryCov_9fa48("59436"), () => setShowSuccessorWorkflow(stryMutAct_9fa48("59437") ? true : (stryCov_9fa48("59437"), false)))} className="text-slate-400 hover:text-white">✕</button>
            </div>
            
            {/* Workflow Steps */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-slate-300 mb-3">Successor Designation Workflow</h4>
              <div className="flex items-center gap-2">
                {(stryMutAct_9fa48("59438") ? [] : (stryCov_9fa48("59438"), ['Nominate', 'Approve', 'Verify', 'Activate'])).map(stryMutAct_9fa48("59443") ? () => undefined : (stryCov_9fa48("59443"), (step, i) => <React.Fragment key={step}>
                    <div className="flex-1 p-3 bg-slate-700/50 rounded-lg text-center">
                      <div className="text-xs text-slate-400">Step {stryMutAct_9fa48("59444") ? i - 1 : (stryCov_9fa48("59444"), i + 1)}</div>
                      <div className="font-medium text-sm">{step}</div>
                    </div>
                    {stryMutAct_9fa48("59447") ? i < 3 || <span className="text-slate-600">→</span> : stryMutAct_9fa48("59446") ? false : stryMutAct_9fa48("59445") ? true : (stryCov_9fa48("59445", "59446", "59447"), (stryMutAct_9fa48("59450") ? i >= 3 : stryMutAct_9fa48("59449") ? i <= 3 : stryMutAct_9fa48("59448") ? true : (stryCov_9fa48("59448", "59449", "59450"), i < 3)) && <span className="text-slate-600">→</span>)}
                  </React.Fragment>))}
              </div>
            </div>

            {/* Current Successors */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-slate-300 mb-3">Designated Successors</h4>
              <div className="space-y-2">
                {(stryMutAct_9fa48("59451") ? [] : (stryCov_9fa48("59451"), [stryMutAct_9fa48("59452") ? {} : (stryCov_9fa48("59452"), {
              name: 'Sarah Chen',
              role: 'Chief of Staff',
              status: 'Active',
              approvedBy: 'CEO',
              accessLevel: 'Full'
            }), stryMutAct_9fa48("59458") ? {} : (stryCov_9fa48("59458"), {
              name: 'Michael Torres',
              role: 'General Counsel',
              status: 'Active',
              approvedBy: 'Board',
              accessLevel: 'Legal'
            }), stryMutAct_9fa48("59464") ? {} : (stryCov_9fa48("59464"), {
              name: 'Emily Watson',
              role: 'Board Secretary',
              status: 'Pending',
              approvedBy: 'Pending',
              accessLevel: 'Read-only'
            })])).map(stryMutAct_9fa48("59470") ? () => undefined : (stryCov_9fa48("59470"), s => <div key={s.name} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
                        {s.name.split(' ').map(stryMutAct_9fa48("59472") ? () => undefined : (stryCov_9fa48("59472"), n => n[0])).join('')}
                      </div>
                      <div>
                        <div className="font-medium">{s.name}</div>
                        <div className="text-xs text-slate-400">{s.role}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right text-xs">
                        <div className="text-slate-400">Approved by: {s.approvedBy}</div>
                        <div className="text-slate-400">Access: {s.accessLevel}</div>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-xs ${(stryMutAct_9fa48("59477") ? s.status !== 'Active' : stryMutAct_9fa48("59476") ? false : stryMutAct_9fa48("59475") ? true : (stryCov_9fa48("59475", "59476", "59477"), s.status === 'Active')) ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'}`}>{s.status}</span>
                    </div>
                  </div>))}
              </div>
            </div>

            <div className="flex gap-3">
              <button className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg font-medium flex items-center justify-center gap-2">
                <Users className="w-4 h-4" /> Nominate New Successor
              </button>
              <button onClick={() => {
            setShowSuccessorWorkflow(stryMutAct_9fa48("59482") ? true : (stryCov_9fa48("59482"), false));
            setShowAuditLog(stryMutAct_9fa48("59483") ? false : (stryCov_9fa48("59483"), true));
          }} className="px-4 py-2 bg-slate-600 hover:bg-slate-500 rounded-lg">
                View Audit Log
              </button>
            </div>
          </div>
        </div>)}

      {/* Audit Log Modal */}
      {stryMutAct_9fa48("59486") ? showAuditLog || <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={() => setShowAuditLog(false)}>
          <div className="bg-slate-800 rounded-xl p-6 w-full max-w-3xl border border-slate-700 max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <Eye className="w-5 h-5 text-amber-400" /> Audit Log
                </h3>
                <p className="text-sm text-slate-400">Access attempts and actions on archived artifacts</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 rounded-lg text-xs flex items-center gap-1">
                  <Download className="w-3 h-3" /> Export PDF
                </button>
                <button onClick={() => setShowAuditLog(false)} className="text-slate-400 hover:text-white p-1">✕</button>
              </div>
            </div>
            
            {/* Filters */}
            <div className="flex items-center gap-3 mb-4">
              <select className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm">
                <option>All Actions</option>
                <option>VIEW</option>
                <option>DOWNLOAD</option>
                <option>VERIFY</option>
                <option>ACCESS_ATTEMPT</option>
              </select>
              <select className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm">
                <option>All Statuses</option>
                <option>Success</option>
                <option>Blocked</option>
              </select>
              <input type="date" className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm" />
            </div>

            {/* Log Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-400 border-b border-slate-700">
                    <th className="pb-3 font-medium">Timestamp</th>
                    <th className="pb-3 font-medium">User</th>
                    <th className="pb-3 font-medium">Action</th>
                    <th className="pb-3 font-medium">Artifact</th>
                    <th className="pb-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {generateAccessLog().map((log: {
                id: string;
                timestamp: string;
                user: string;
                action: string;
                artifact: string;
                status: string;
              }) => <tr key={log.id} className="border-b border-slate-800">
                      <td className="py-3 text-slate-400 font-mono text-xs">{log.timestamp}</td>
                      <td className="py-3">
                        <span className={log.user === 'Unknown IP' ? 'text-red-400' : 'text-white'}>
                          {log.user}
                        </span>
                      </td>
                      <td className="py-3">
                        <span className={`text-xs px-2 py-0.5 rounded ${log.action === 'ACCESS_ATTEMPT' ? 'bg-red-500/20 text-red-300' : log.action === 'VERIFY' ? 'bg-emerald-500/20 text-emerald-300' : log.action === 'DOWNLOAD' ? 'bg-blue-500/20 text-blue-300' : log.action === 'INTEGRITY_CHECK' ? 'bg-purple-500/20 text-purple-300' : 'bg-slate-600 text-slate-300'}`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="py-3 text-slate-300">{log.artifact}</td>
                      <td className="py-3">
                        <span className={`text-xs px-2 py-0.5 rounded ${log.status === 'success' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'}`}>
                          {log.status}
                        </span>
                      </td>
                    </tr>)}
                </tbody>
              </table>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-700 flex items-center justify-between text-xs text-slate-500">
              <span>Showing last 5 entries. Full log contains 1,247 records.</span>
              <span>All logs are immutable and cryptographically signed.</span>
            </div>
          </div>
        </div> : stryMutAct_9fa48("59485") ? false : stryMutAct_9fa48("59484") ? true : (stryCov_9fa48("59484", "59485", "59486"), showAuditLog && <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={stryMutAct_9fa48("59487") ? () => undefined : (stryCov_9fa48("59487"), () => setShowAuditLog(stryMutAct_9fa48("59488") ? true : (stryCov_9fa48("59488"), false)))}>
          <div className="bg-slate-800 rounded-xl p-6 w-full max-w-3xl border border-slate-700 max-h-[80vh] overflow-y-auto" onClick={stryMutAct_9fa48("59489") ? () => undefined : (stryCov_9fa48("59489"), e => e.stopPropagation())}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <Eye className="w-5 h-5 text-amber-400" /> Audit Log
                </h3>
                <p className="text-sm text-slate-400">Access attempts and actions on archived artifacts</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 rounded-lg text-xs flex items-center gap-1">
                  <Download className="w-3 h-3" /> Export PDF
                </button>
                <button onClick={stryMutAct_9fa48("59490") ? () => undefined : (stryCov_9fa48("59490"), () => setShowAuditLog(stryMutAct_9fa48("59491") ? true : (stryCov_9fa48("59491"), false)))} className="text-slate-400 hover:text-white p-1">✕</button>
              </div>
            </div>
            
            {/* Filters */}
            <div className="flex items-center gap-3 mb-4">
              <select className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm">
                <option>All Actions</option>
                <option>VIEW</option>
                <option>DOWNLOAD</option>
                <option>VERIFY</option>
                <option>ACCESS_ATTEMPT</option>
              </select>
              <select className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm">
                <option>All Statuses</option>
                <option>Success</option>
                <option>Blocked</option>
              </select>
              <input type="date" className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm" />
            </div>

            {/* Log Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-400 border-b border-slate-700">
                    <th className="pb-3 font-medium">Timestamp</th>
                    <th className="pb-3 font-medium">User</th>
                    <th className="pb-3 font-medium">Action</th>
                    <th className="pb-3 font-medium">Artifact</th>
                    <th className="pb-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {generateAccessLog().map(stryMutAct_9fa48("59492") ? () => undefined : (stryCov_9fa48("59492"), (log: {
                id: string;
                timestamp: string;
                user: string;
                action: string;
                artifact: string;
                status: string;
              }) => <tr key={log.id} className="border-b border-slate-800">
                      <td className="py-3 text-slate-400 font-mono text-xs">{log.timestamp}</td>
                      <td className="py-3">
                        <span className={(stryMutAct_9fa48("59495") ? log.user !== 'Unknown IP' : stryMutAct_9fa48("59494") ? false : stryMutAct_9fa48("59493") ? true : (stryCov_9fa48("59493", "59494", "59495"), log.user === 'Unknown IP')) ? 'text-red-400' : 'text-white'}>
                          {log.user}
                        </span>
                      </td>
                      <td className="py-3">
                        <span className={`text-xs px-2 py-0.5 rounded ${(stryMutAct_9fa48("59502") ? log.action !== 'ACCESS_ATTEMPT' : stryMutAct_9fa48("59501") ? false : stryMutAct_9fa48("59500") ? true : (stryCov_9fa48("59500", "59501", "59502"), log.action === 'ACCESS_ATTEMPT')) ? 'bg-red-500/20 text-red-300' : (stryMutAct_9fa48("59507") ? log.action !== 'VERIFY' : stryMutAct_9fa48("59506") ? false : stryMutAct_9fa48("59505") ? true : (stryCov_9fa48("59505", "59506", "59507"), log.action === 'VERIFY')) ? 'bg-emerald-500/20 text-emerald-300' : (stryMutAct_9fa48("59512") ? log.action !== 'DOWNLOAD' : stryMutAct_9fa48("59511") ? false : stryMutAct_9fa48("59510") ? true : (stryCov_9fa48("59510", "59511", "59512"), log.action === 'DOWNLOAD')) ? 'bg-blue-500/20 text-blue-300' : (stryMutAct_9fa48("59517") ? log.action !== 'INTEGRITY_CHECK' : stryMutAct_9fa48("59516") ? false : stryMutAct_9fa48("59515") ? true : (stryCov_9fa48("59515", "59516", "59517"), log.action === 'INTEGRITY_CHECK')) ? 'bg-purple-500/20 text-purple-300' : 'bg-slate-600 text-slate-300'}`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="py-3 text-slate-300">{log.artifact}</td>
                      <td className="py-3">
                        <span className={`text-xs px-2 py-0.5 rounded ${(stryMutAct_9fa48("59524") ? log.status !== 'success' : stryMutAct_9fa48("59523") ? false : stryMutAct_9fa48("59522") ? true : (stryCov_9fa48("59522", "59523", "59524"), log.status === 'success')) ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'}`}>
                          {log.status}
                        </span>
                      </td>
                    </tr>))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-700 flex items-center justify-between text-xs text-slate-500">
              <span>Showing last 5 entries. Full log contains 1,247 records.</span>
              <span>All logs are immutable and cryptographically signed.</span>
            </div>
          </div>
        </div>)}
    </div>;
};
export default EternalPage;