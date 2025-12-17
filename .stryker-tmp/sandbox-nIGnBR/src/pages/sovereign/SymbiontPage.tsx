/**
 * CendiaSymbiont™ - Partnership & Ecosystem Engine
 * "The ecosystem strategist."
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
import { Network, Building2, Link2, TrendingUp, Target, Users, Zap, Info, Database, FileText, Play, Upload, Download, Search, Filter, Star, ArrowUpRight, RefreshCw } from 'lucide-react';

// Opportunity priority levels
const PRIORITY_LEVELS = stryMutAct_9fa48("60199") ? [] : (stryCov_9fa48("60199"), [stryMutAct_9fa48("60200") ? {} : (stryCov_9fa48("60200"), {
  value: 'HIGH',
  label: 'High Priority',
  color: 'text-red-400 bg-red-500/20'
}), stryMutAct_9fa48("60204") ? {} : (stryCov_9fa48("60204"), {
  value: 'MEDIUM',
  label: 'Medium',
  color: 'text-amber-400 bg-amber-500/20'
}), stryMutAct_9fa48("60208") ? {} : (stryCov_9fa48("60208"), {
  value: 'LOW',
  label: 'Low',
  color: 'text-blue-400 bg-blue-500/20'
})]);
interface Entity {
  id: string;
  entityType: string;
  name: string;
  description?: string;
  domain?: string;
  financialHealth?: number;
  reputationScore?: number;
}
interface Opportunity {
  id: string;
  entityId?: string;
  opportunityType: string;
  title: string;
  description: string;
  strategicFit: number;
  riskScore: number;
  status: string;
  estimatedValue?: number;
}
interface Dashboard {
  totalEntities: number;
  entitiesByType: Record<string, number>;
  activeOpportunities: number;
  healthyRelationships: number;
  avgRelationshipHealth: number;
}

// Starter library templates
const STARTER_TEMPLATES = stryMutAct_9fa48("60212") ? [] : (stryCov_9fa48("60212"), [stryMutAct_9fa48("60213") ? {} : (stryCov_9fa48("60213"), {
  id: 'vendors',
  name: 'Common Vendors',
  icon: '🏢',
  count: 15,
  description: 'Cloud, SaaS, infrastructure'
}), stryMutAct_9fa48("60218") ? {} : (stryCov_9fa48("60218"), {
  id: 'partners',
  name: 'Partnership Types',
  icon: '🤝',
  count: 8,
  description: 'Channel, tech, strategic'
}), stryMutAct_9fa48("60223") ? {} : (stryCov_9fa48("60223"), {
  id: 'competitors',
  name: 'Competitor Framework',
  icon: '🎯',
  count: 5,
  description: 'Direct, indirect, emerging'
}), stryMutAct_9fa48("60228") ? {} : (stryCov_9fa48("60228"), {
  id: 'investors',
  name: 'Investor Categories',
  icon: '💰',
  count: 6,
  description: 'VC, PE, strategic, angel'
})]);

// Opportunity detection signals explanation
const OPPORTUNITY_SIGNALS = stryMutAct_9fa48("60233") ? [] : (stryCov_9fa48("60233"), [stryMutAct_9fa48("60234") ? {} : (stryCov_9fa48("60234"), {
  source: 'Contracts',
  icon: '📝',
  description: 'Renewal dates, spend changes, term modifications'
}), stryMutAct_9fa48("60238") ? {} : (stryCov_9fa48("60238"), {
  source: 'CRM',
  icon: '📊',
  description: 'Deal pipeline, relationship health, engagement'
}), stryMutAct_9fa48("60242") ? {} : (stryCov_9fa48("60242"), {
  source: 'News & PR',
  icon: '📰',
  description: 'M&A activity, leadership changes, funding rounds'
}), stryMutAct_9fa48("60246") ? {} : (stryCov_9fa48("60246"), {
  source: 'Market Data',
  icon: '📈',
  description: 'Competitor moves, industry trends, market shifts'
}), stryMutAct_9fa48("60250") ? {} : (stryCov_9fa48("60250"), {
  source: 'Internal Signals',
  icon: '📡',
  description: 'Usage patterns, support tickets, NPS feedback'
})]);
export const SymbiontPage: React.FC = () => {
  const [entities, setEntities] = useState<Entity[]>(stryMutAct_9fa48("60255") ? ["Stryker was here"] : (stryCov_9fa48("60255"), []));
  const [opportunities, setOpportunities] = useState<Opportunity[]>(stryMutAct_9fa48("60256") ? ["Stryker was here"] : (stryCov_9fa48("60256"), []));
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [isLoading, setIsLoading] = useState(stryMutAct_9fa48("60257") ? false : (stryCov_9fa48("60257"), true));
  const [showAddEntity, setShowAddEntity] = useState(stryMutAct_9fa48("60258") ? true : (stryCov_9fa48("60258"), false));
  const [showOpportunityExplainer, setShowOpportunityExplainer] = useState(stryMutAct_9fa48("60259") ? true : (stryCov_9fa48("60259"), false));
  const [newEntity, setNewEntity] = useState(stryMutAct_9fa48("60260") ? {} : (stryCov_9fa48("60260"), {
    name: '',
    entityType: 'PARTNER',
    domain: '',
    description: ''
  }));

  // New state for filters and import/export
  const [entitySearch, setEntitySearch] = useState('');
  const [entityTypeFilter, setEntityTypeFilter] = useState('ALL');
  const [opportunityFilter, setOpportunityFilter] = useState('ALL');
  const [showImportModal, setShowImportModal] = useState(stryMutAct_9fa48("60268") ? true : (stryCov_9fa48("60268"), false));
  const [isScanning, setIsScanning] = useState(stryMutAct_9fa48("60269") ? true : (stryCov_9fa48("60269"), false));

  // Filtered entities
  const filteredEntities = stryMutAct_9fa48("60270") ? entities : (stryCov_9fa48("60270"), entities.filter(e => {
    const matchesSearch = stryMutAct_9fa48("60274") ? (entitySearch === '' || e.name.toLowerCase().includes(entitySearch.toLowerCase())) && e.domain?.toLowerCase().includes(entitySearch.toLowerCase()) : stryMutAct_9fa48("60273") ? false : stryMutAct_9fa48("60272") ? true : (stryCov_9fa48("60272", "60273", "60274"), (stryMutAct_9fa48("60276") ? entitySearch === '' && e.name.toLowerCase().includes(entitySearch.toLowerCase()) : stryMutAct_9fa48("60275") ? false : (stryCov_9fa48("60275", "60276"), (stryMutAct_9fa48("60278") ? entitySearch !== '' : stryMutAct_9fa48("60277") ? false : (stryCov_9fa48("60277", "60278"), entitySearch === '')) || (stryMutAct_9fa48("60280") ? e.name.toUpperCase().includes(entitySearch.toLowerCase()) : (stryCov_9fa48("60280"), e.name.toLowerCase().includes(stryMutAct_9fa48("60281") ? entitySearch.toUpperCase() : (stryCov_9fa48("60281"), entitySearch.toLowerCase())))))) || (stryMutAct_9fa48("60283") ? e.domain.toLowerCase().includes(entitySearch.toLowerCase()) : stryMutAct_9fa48("60282") ? e.domain?.toUpperCase().includes(entitySearch.toLowerCase()) : (stryCov_9fa48("60282", "60283"), e.domain?.toLowerCase().includes(stryMutAct_9fa48("60284") ? entitySearch.toUpperCase() : (stryCov_9fa48("60284"), entitySearch.toLowerCase())))));
    const matchesType = stryMutAct_9fa48("60287") ? entityTypeFilter === 'ALL' && e.entityType === entityTypeFilter : stryMutAct_9fa48("60286") ? false : stryMutAct_9fa48("60285") ? true : (stryCov_9fa48("60285", "60286", "60287"), (stryMutAct_9fa48("60289") ? entityTypeFilter !== 'ALL' : stryMutAct_9fa48("60288") ? false : (stryCov_9fa48("60288", "60289"), entityTypeFilter === 'ALL')) || (stryMutAct_9fa48("60292") ? e.entityType !== entityTypeFilter : stryMutAct_9fa48("60291") ? false : (stryCov_9fa48("60291", "60292"), e.entityType === entityTypeFilter)));
    return stryMutAct_9fa48("60295") ? matchesSearch || matchesType : stryMutAct_9fa48("60294") ? false : stryMutAct_9fa48("60293") ? true : (stryCov_9fa48("60293", "60294", "60295"), matchesSearch && matchesType);
  }));

  // Filtered opportunities with scoring
  const scoredOpportunities = stryMutAct_9fa48("60296") ? opportunities.map(o => ({
    ...o,
    priority: o.estimatedValue && o.estimatedValue > 500000 ? 'HIGH' : o.estimatedValue && o.estimatedValue > 100000 ? 'MEDIUM' : 'LOW'
  })) : (stryCov_9fa48("60296"), opportunities.map(stryMutAct_9fa48("60297") ? () => undefined : (stryCov_9fa48("60297"), o => stryMutAct_9fa48("60298") ? {} : (stryCov_9fa48("60298"), {
    ...o,
    priority: (stryMutAct_9fa48("60301") ? o.estimatedValue || o.estimatedValue > 500000 : stryMutAct_9fa48("60300") ? false : stryMutAct_9fa48("60299") ? true : (stryCov_9fa48("60299", "60300", "60301"), o.estimatedValue && (stryMutAct_9fa48("60304") ? o.estimatedValue <= 500000 : stryMutAct_9fa48("60303") ? o.estimatedValue >= 500000 : stryMutAct_9fa48("60302") ? true : (stryCov_9fa48("60302", "60303", "60304"), o.estimatedValue > 500000)))) ? 'HIGH' : (stryMutAct_9fa48("60308") ? o.estimatedValue || o.estimatedValue > 100000 : stryMutAct_9fa48("60307") ? false : stryMutAct_9fa48("60306") ? true : (stryCov_9fa48("60306", "60307", "60308"), o.estimatedValue && (stryMutAct_9fa48("60311") ? o.estimatedValue <= 100000 : stryMutAct_9fa48("60310") ? o.estimatedValue >= 100000 : stryMutAct_9fa48("60309") ? true : (stryCov_9fa48("60309", "60310", "60311"), o.estimatedValue > 100000)))) ? 'MEDIUM' : 'LOW'
  }))).filter(stryMutAct_9fa48("60314") ? () => undefined : (stryCov_9fa48("60314"), o => stryMutAct_9fa48("60317") ? opportunityFilter === 'ALL' && o.priority === opportunityFilter : stryMutAct_9fa48("60316") ? false : stryMutAct_9fa48("60315") ? true : (stryCov_9fa48("60315", "60316", "60317"), (stryMutAct_9fa48("60319") ? opportunityFilter !== 'ALL' : stryMutAct_9fa48("60318") ? false : (stryCov_9fa48("60318", "60319"), opportunityFilter === 'ALL')) || (stryMutAct_9fa48("60322") ? o.priority !== opportunityFilter : stryMutAct_9fa48("60321") ? false : (stryCov_9fa48("60321", "60322"), o.priority === opportunityFilter))))));

  // Auto-scan all entities
  const runAutoScan = async () => {
    setIsScanning(stryMutAct_9fa48("60324") ? false : (stryCov_9fa48("60324"), true));
    try {
      for (const entity of entities) {
        await detectOpportunities(entity.id);
      }
    } finally {
      setIsScanning(stryMutAct_9fa48("60328") ? true : (stryCov_9fa48("60328"), false));
    }
  };
  useEffect(() => {
    loadData();
  }, stryMutAct_9fa48("60330") ? ["Stryker was here"] : (stryCov_9fa48("60330"), []));
  const loadData = async () => {
    try {
      const [entRes, oppRes, dashRes] = await Promise.all(stryMutAct_9fa48("60333") ? [] : (stryCov_9fa48("60333"), [apiClient.api.get<{
        data: Entity[];
      }>('/symbiont/entities'), apiClient.api.get<{
        data: Opportunity[];
      }>('/symbiont/opportunities'), apiClient.api.get<{
        data: Dashboard;
      }>('/symbiont/dashboard')]));
      if (stryMutAct_9fa48("60338") ? false : stryMutAct_9fa48("60337") ? true : (stryCov_9fa48("60337", "60338"), entRes.success)) {
        setEntities(stryMutAct_9fa48("60342") ? ((entRes.data as any)?.data || entRes.data) && [] : stryMutAct_9fa48("60341") ? false : stryMutAct_9fa48("60340") ? true : (stryCov_9fa48("60340", "60341", "60342"), (stryMutAct_9fa48("60344") ? (entRes.data as any)?.data && entRes.data : stryMutAct_9fa48("60343") ? false : (stryCov_9fa48("60343", "60344"), (stryMutAct_9fa48("60345") ? (entRes.data as any).data : (stryCov_9fa48("60345"), (entRes.data as any)?.data)) || entRes.data)) || (stryMutAct_9fa48("60346") ? ["Stryker was here"] : (stryCov_9fa48("60346"), []))));
      }
      if (stryMutAct_9fa48("60348") ? false : stryMutAct_9fa48("60347") ? true : (stryCov_9fa48("60347", "60348"), oppRes.success)) {
        setOpportunities(stryMutAct_9fa48("60352") ? ((oppRes.data as any)?.data || oppRes.data) && [] : stryMutAct_9fa48("60351") ? false : stryMutAct_9fa48("60350") ? true : (stryCov_9fa48("60350", "60351", "60352"), (stryMutAct_9fa48("60354") ? (oppRes.data as any)?.data && oppRes.data : stryMutAct_9fa48("60353") ? false : (stryCov_9fa48("60353", "60354"), (stryMutAct_9fa48("60355") ? (oppRes.data as any).data : (stryCov_9fa48("60355"), (oppRes.data as any)?.data)) || oppRes.data)) || (stryMutAct_9fa48("60356") ? ["Stryker was here"] : (stryCov_9fa48("60356"), []))));
      }
      if (stryMutAct_9fa48("60358") ? false : stryMutAct_9fa48("60357") ? true : (stryCov_9fa48("60357", "60358"), dashRes.success)) {
        setDashboard(stryMutAct_9fa48("60362") ? ((dashRes.data as any)?.data || dashRes.data) && null : stryMutAct_9fa48("60361") ? false : stryMutAct_9fa48("60360") ? true : (stryCov_9fa48("60360", "60361", "60362"), (stryMutAct_9fa48("60364") ? (dashRes.data as any)?.data && dashRes.data : stryMutAct_9fa48("60363") ? false : (stryCov_9fa48("60363", "60364"), (stryMutAct_9fa48("60365") ? (dashRes.data as any).data : (stryCov_9fa48("60365"), (dashRes.data as any)?.data)) || dashRes.data)) || null));
      }
    } catch (error) {
      console.error('Failed to load Symbiont data:', error);
    } finally {
      setIsLoading(stryMutAct_9fa48("60369") ? true : (stryCov_9fa48("60369"), false));
    }
  };
  const addEntity = async () => {
    try {
      await apiClient.api.post('/symbiont/entities', newEntity);
      setShowAddEntity(stryMutAct_9fa48("60373") ? true : (stryCov_9fa48("60373"), false));
      setNewEntity(stryMutAct_9fa48("60374") ? {} : (stryCov_9fa48("60374"), {
        name: '',
        entityType: 'PARTNER',
        domain: '',
        description: ''
      }));
      await loadData();
    } catch (error) {
      console.error('Add entity failed:', error);
    }
  };
  const detectOpportunities = async (entityId: string) => {
    try {
      await apiClient.api.post(`/symbiont/entities/${entityId}/opportunities`);
      await loadData();
    } catch (error) {
      console.error('Opportunity detection failed:', error);
    }
  };
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'PARTNER':
        if (stryMutAct_9fa48("60387")) {} else {
          stryCov_9fa48("60387");
          return <Link2 className="w-4 h-4 text-emerald-400" />;
        }
      case 'VENDOR':
        if (stryMutAct_9fa48("60389")) {} else {
          stryCov_9fa48("60389");
          return <Building2 className="w-4 h-4 text-blue-400" />;
        }
      case 'COMPETITOR':
        if (stryMutAct_9fa48("60391")) {} else {
          stryCov_9fa48("60391");
          return <Target className="w-4 h-4 text-red-400" />;
        }
      case 'CUSTOMER':
        if (stryMutAct_9fa48("60393")) {} else {
          stryCov_9fa48("60393");
          return <Users className="w-4 h-4 text-purple-400" />;
        }
      default:
        if (stryMutAct_9fa48("60395")) {} else {
          stryCov_9fa48("60395");
          return <Network className="w-4 h-4 text-slate-400" />;
        }
    }
  };
  if (stryMutAct_9fa48("60397") ? false : stryMutAct_9fa48("60396") ? true : (stryCov_9fa48("60396", "60397"), isLoading)) {
    return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Loading Symbiont...</div>;
  }
  return <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Network className="w-10 h-10 text-purple-400" />
            <div>
              <h1 className="text-3xl font-bold">CendiaSymbiont™</h1>
              <p className="text-slate-400">Partnership & Ecosystem Engine - "The ecosystem strategist."</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a href="/cortex/intelligence/council?context=partnership" className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg text-sm font-medium flex items-center gap-2">
              <Play className="w-4 h-4" /> Deliberate in Council
            </a>
            <button onClick={() => {
            const reportData = stryMutAct_9fa48("60400") ? {} : (stryCov_9fa48("60400"), {
              generated: new Date().toISOString(),
              entities: entities,
              opportunities: scoredOpportunities,
              dashboard
            });
            const blob = new Blob(stryMutAct_9fa48("60401") ? [] : (stryCov_9fa48("60401"), [JSON.stringify(reportData, null, 2)]), stryMutAct_9fa48("60402") ? {} : (stryCov_9fa48("60402"), {
              type: 'application/json'
            }));
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `symbiont-ecosystem-report-${new Date().toISOString().split('T')[0]}.json`;
            a.click();
          }} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm flex items-center gap-2">
              <Download className="w-4 h-4" /> Export Ecosystem
            </button>
          </div>
        </div>
      </div>

      {/* Dashboard Stats */}
      {stryMutAct_9fa48("60409") ? dashboard || <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center gap-2 text-slate-400 text-sm"><Building2 className="w-4 h-4" /> Entities</div>
            <div className="text-3xl font-bold">{dashboard.totalEntities}</div>
          </div>
          <button onClick={() => setShowOpportunityExplainer(true)} className="bg-slate-800 rounded-lg p-4 border border-slate-700 hover:border-purple-500/50 transition-all text-left">
            <div className="flex items-center gap-2 text-slate-400 text-sm"><Zap className="w-4 h-4" /> Active Opportunities <Info className="w-3 h-3" /></div>
            <div className="text-3xl font-bold text-purple-400">{dashboard.activeOpportunities}</div>
            <div className="text-xs text-purple-400/60 mt-1">How we detect →</div>
          </button>
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center gap-2 text-slate-400 text-sm"><Link2 className="w-4 h-4" /> Healthy Relations</div>
            <div className="text-3xl font-bold text-emerald-400">{dashboard.healthyRelationships}</div>
          </div>
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center gap-2 text-slate-400 text-sm"><TrendingUp className="w-4 h-4" /> Avg Health</div>
            <div className="text-3xl font-bold">{dashboard.avgRelationshipHealth}%</div>
          </div>
        </div> : stryMutAct_9fa48("60408") ? false : stryMutAct_9fa48("60407") ? true : (stryCov_9fa48("60407", "60408", "60409"), dashboard && <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center gap-2 text-slate-400 text-sm"><Building2 className="w-4 h-4" /> Entities</div>
            <div className="text-3xl font-bold">{dashboard.totalEntities}</div>
          </div>
          <button onClick={stryMutAct_9fa48("60410") ? () => undefined : (stryCov_9fa48("60410"), () => setShowOpportunityExplainer(stryMutAct_9fa48("60411") ? false : (stryCov_9fa48("60411"), true)))} className="bg-slate-800 rounded-lg p-4 border border-slate-700 hover:border-purple-500/50 transition-all text-left">
            <div className="flex items-center gap-2 text-slate-400 text-sm"><Zap className="w-4 h-4" /> Active Opportunities <Info className="w-3 h-3" /></div>
            <div className="text-3xl font-bold text-purple-400">{dashboard.activeOpportunities}</div>
            <div className="text-xs text-purple-400/60 mt-1">How we detect →</div>
          </button>
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center gap-2 text-slate-400 text-sm"><Link2 className="w-4 h-4" /> Healthy Relations</div>
            <div className="text-3xl font-bold text-emerald-400">{dashboard.healthyRelationships}</div>
          </div>
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center gap-2 text-slate-400 text-sm"><TrendingUp className="w-4 h-4" /> Avg Health</div>
            <div className="text-3xl font-bold">{dashboard.avgRelationshipHealth}%</div>
          </div>
        </div>)}

      {/* Ecosystem Map Preview */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Network className="w-5 h-5 text-purple-400" /> Ecosystem Map
            </h2>
            <p className="text-sm text-slate-400">Visual representation of your ecosystem relationships</p>
          </div>
          <button className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-sm font-medium">
            Open Full Map
          </button>
        </div>
        {(stryMutAct_9fa48("60414") ? entities.length !== 0 : stryMutAct_9fa48("60413") ? false : stryMutAct_9fa48("60412") ? true : (stryCov_9fa48("60412", "60413", "60414"), entities.length === 0)) ? <div className="relative h-64 bg-slate-900/50 rounded-lg border border-dashed border-slate-600 flex items-center justify-center">
            <div className="text-center">
              <Network className="w-12 h-12 mx-auto mb-3 text-slate-600" />
              <p className="text-slate-500 mb-4">Add entities to see your ecosystem map</p>
              <div className="flex flex-wrap justify-center gap-2">
                {STARTER_TEMPLATES.map(stryMutAct_9fa48("60415") ? () => undefined : (stryCov_9fa48("60415"), t => <button key={t.id} className="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs flex items-center gap-2">
                    <span>{t.icon}</span>
                    <span>{t.name}</span>
                    <span className="text-slate-500">({t.count})</span>
                  </button>))}
              </div>
            </div>
          </div> : <div className="relative h-64 bg-slate-900/50 rounded-lg">
            {/* Simple ecosystem visualization */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                {/* Center node (Your Company) */}
                <div className="w-16 h-16 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold z-10 relative">
                  You
                </div>
                {/* Entity nodes around */}
                {stryMutAct_9fa48("60416") ? entities.map((e, i) => {
              const angle = i * 60 * (Math.PI / 180);
              const x = Math.cos(angle) * 100;
              const y = Math.sin(angle) * 80;
              return <div key={e.id} className="absolute w-12 h-12 rounded-full flex items-center justify-center text-xs font-medium border-2" style={{
                left: `calc(50% + ${x}px - 24px)`,
                top: `calc(50% + ${y}px - 24px)`,
                backgroundColor: e.entityType === 'PARTNER' ? 'rgba(16, 185, 129, 0.2)' : e.entityType === 'VENDOR' ? 'rgba(59, 130, 246, 0.2)' : e.entityType === 'COMPETITOR' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(168, 85, 247, 0.2)',
                borderColor: e.entityType === 'PARTNER' ? 'rgb(16, 185, 129)' : e.entityType === 'VENDOR' ? 'rgb(59, 130, 246)' : e.entityType === 'COMPETITOR' ? 'rgb(239, 68, 68)' : 'rgb(168, 85, 247)'
              }}>
                      {e.name.substring(0, 2).toUpperCase()}
                    </div>;
            }) : (stryCov_9fa48("60416"), entities.slice(0, 6).map((e, i) => {
              const angle = stryMutAct_9fa48("60418") ? i * 60 / (Math.PI / 180) : (stryCov_9fa48("60418"), (stryMutAct_9fa48("60419") ? i / 60 : (stryCov_9fa48("60419"), i * 60)) * (stryMutAct_9fa48("60420") ? Math.PI * 180 : (stryCov_9fa48("60420"), Math.PI / 180)));
              const x = stryMutAct_9fa48("60421") ? Math.cos(angle) / 100 : (stryCov_9fa48("60421"), Math.cos(angle) * 100);
              const y = stryMutAct_9fa48("60422") ? Math.sin(angle) / 80 : (stryCov_9fa48("60422"), Math.sin(angle) * 80);
              return <div key={e.id} className="absolute w-12 h-12 rounded-full flex items-center justify-center text-xs font-medium border-2" style={stryMutAct_9fa48("60423") ? {} : (stryCov_9fa48("60423"), {
                left: `calc(50% + ${x}px - 24px)`,
                top: `calc(50% + ${y}px - 24px)`,
                backgroundColor: (stryMutAct_9fa48("60428") ? e.entityType !== 'PARTNER' : stryMutAct_9fa48("60427") ? false : stryMutAct_9fa48("60426") ? true : (stryCov_9fa48("60426", "60427", "60428"), e.entityType === 'PARTNER')) ? 'rgba(16, 185, 129, 0.2)' : (stryMutAct_9fa48("60433") ? e.entityType !== 'VENDOR' : stryMutAct_9fa48("60432") ? false : stryMutAct_9fa48("60431") ? true : (stryCov_9fa48("60431", "60432", "60433"), e.entityType === 'VENDOR')) ? 'rgba(59, 130, 246, 0.2)' : (stryMutAct_9fa48("60438") ? e.entityType !== 'COMPETITOR' : stryMutAct_9fa48("60437") ? false : stryMutAct_9fa48("60436") ? true : (stryCov_9fa48("60436", "60437", "60438"), e.entityType === 'COMPETITOR')) ? 'rgba(239, 68, 68, 0.2)' : 'rgba(168, 85, 247, 0.2)',
                borderColor: (stryMutAct_9fa48("60444") ? e.entityType !== 'PARTNER' : stryMutAct_9fa48("60443") ? false : stryMutAct_9fa48("60442") ? true : (stryCov_9fa48("60442", "60443", "60444"), e.entityType === 'PARTNER')) ? 'rgb(16, 185, 129)' : (stryMutAct_9fa48("60449") ? e.entityType !== 'VENDOR' : stryMutAct_9fa48("60448") ? false : stryMutAct_9fa48("60447") ? true : (stryCov_9fa48("60447", "60448", "60449"), e.entityType === 'VENDOR')) ? 'rgb(59, 130, 246)' : (stryMutAct_9fa48("60454") ? e.entityType !== 'COMPETITOR' : stryMutAct_9fa48("60453") ? false : stryMutAct_9fa48("60452") ? true : (stryCov_9fa48("60452", "60453", "60454"), e.entityType === 'COMPETITOR')) ? 'rgb(239, 68, 68)' : 'rgb(168, 85, 247)'
              })}>
                      {stryMutAct_9fa48("60459") ? e.name.toUpperCase() : stryMutAct_9fa48("60458") ? e.name.substring(0, 2).toLowerCase() : (stryCov_9fa48("60458", "60459"), e.name.substring(0, 2).toUpperCase())}
                    </div>;
            }))}
              </div>
            </div>
            <div className="absolute bottom-3 right-3 flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Partners</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Vendors</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span> Competitors</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-500"></span> Others</span>
            </div>
          </div>}
      </div>

      {/* Import/Export Bar */}
      <div className="bg-slate-800 rounded-lg p-4 border border-slate-700 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={stryMutAct_9fa48("60460") ? () => undefined : (stryCov_9fa48("60460"), () => setShowImportModal(stryMutAct_9fa48("60461") ? false : (stryCov_9fa48("60461"), true)))} className="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm flex items-center gap-2">
              <Upload className="w-4 h-4" /> Import Entities
            </button>
            <button className="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm flex items-center gap-2">
              <Download className="w-4 h-4" /> Export CSV
            </button>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={runAutoScan} disabled={stryMutAct_9fa48("60464") ? isScanning && entities.length === 0 : stryMutAct_9fa48("60463") ? false : stryMutAct_9fa48("60462") ? true : (stryCov_9fa48("60462", "60463", "60464"), isScanning || (stryMutAct_9fa48("60466") ? entities.length !== 0 : stryMutAct_9fa48("60465") ? false : (stryCov_9fa48("60465", "60466"), entities.length === 0)))} className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-sm font-medium flex items-center gap-2 disabled:opacity-50">
              <RefreshCw className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
              {isScanning ? 'Scanning...' : 'Auto-Scan All'}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Entities */}
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Ecosystem Entities</h2>
            <button onClick={stryMutAct_9fa48("60472") ? () => undefined : (stryCov_9fa48("60472"), () => setShowAddEntity(stryMutAct_9fa48("60473") ? false : (stryCov_9fa48("60473"), true)))} className="px-3 py-1 bg-purple-600 hover:bg-purple-500 rounded text-sm">+ Add Entity</button>
          </div>
          
          {/* Search & Filter */}
          {stryMutAct_9fa48("60476") ? entities.length > 0 || <div className="flex items-center gap-2 mb-4">
              <div className="flex-1 relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input type="text" value={entitySearch} onChange={e => setEntitySearch(e.target.value)} placeholder="Search entities..." className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-sm placeholder-slate-500" />
              </div>
              <select value={entityTypeFilter} onChange={e => setEntityTypeFilter(e.target.value)} className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm">
                <option value="ALL">All Types</option>
                <option value="PARTNER">Partners</option>
                <option value="VENDOR">Vendors</option>
                <option value="COMPETITOR">Competitors</option>
                <option value="CUSTOMER">Customers</option>
              </select>
            </div> : stryMutAct_9fa48("60475") ? false : stryMutAct_9fa48("60474") ? true : (stryCov_9fa48("60474", "60475", "60476"), (stryMutAct_9fa48("60479") ? entities.length <= 0 : stryMutAct_9fa48("60478") ? entities.length >= 0 : stryMutAct_9fa48("60477") ? true : (stryCov_9fa48("60477", "60478", "60479"), entities.length > 0)) && <div className="flex items-center gap-2 mb-4">
              <div className="flex-1 relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input type="text" value={entitySearch} onChange={stryMutAct_9fa48("60480") ? () => undefined : (stryCov_9fa48("60480"), e => setEntitySearch(e.target.value))} placeholder="Search entities..." className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-sm placeholder-slate-500" />
              </div>
              <select value={entityTypeFilter} onChange={stryMutAct_9fa48("60481") ? () => undefined : (stryCov_9fa48("60481"), e => setEntityTypeFilter(e.target.value))} className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm">
                <option value="ALL">All Types</option>
                <option value="PARTNER">Partners</option>
                <option value="VENDOR">Vendors</option>
                <option value="COMPETITOR">Competitors</option>
                <option value="CUSTOMER">Customers</option>
              </select>
            </div>)}
          {(stryMutAct_9fa48("60484") ? entities.length !== 0 : stryMutAct_9fa48("60483") ? false : stryMutAct_9fa48("60482") ? true : (stryCov_9fa48("60482", "60483", "60484"), entities.length === 0)) ? <div className="text-center py-12">
              <Building2 className="w-12 h-12 mx-auto mb-3 text-purple-400 opacity-50" />
              <h3 className="text-lg font-semibold text-white mb-2">Build Your Ecosystem</h3>
              <p className="text-slate-400 mb-4 text-sm">Start with a template or add entities manually</p>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {STARTER_TEMPLATES.map(stryMutAct_9fa48("60485") ? () => undefined : (stryCov_9fa48("60485"), t => <button key={t.id} className="p-3 bg-slate-700/50 hover:bg-slate-700 rounded-lg text-left text-sm">
                    <div className="flex items-center gap-2 mb-1">
                      <span>{t.icon}</span>
                      <span className="font-medium">{t.name}</span>
                    </div>
                    <div className="text-xs text-slate-400">{t.description}</div>
                  </button>))}
              </div>
              <button onClick={stryMutAct_9fa48("60486") ? () => undefined : (stryCov_9fa48("60486"), () => setShowAddEntity(stryMutAct_9fa48("60487") ? false : (stryCov_9fa48("60487"), true)))} className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-sm">
                + Add Custom Entity
              </button>
            </div> : (stryMutAct_9fa48("60490") ? filteredEntities.length !== 0 : stryMutAct_9fa48("60489") ? false : stryMutAct_9fa48("60488") ? true : (stryCov_9fa48("60488", "60489", "60490"), filteredEntities.length === 0)) ? <div className="text-center py-8 text-slate-500">
              No entities match your search
            </div> : <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredEntities.map(stryMutAct_9fa48("60491") ? () => undefined : (stryCov_9fa48("60491"), e => <div key={e.id} className="p-4 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    {getTypeIcon(e.entityType)}
                    <span className="font-medium">{e.name}</span>
                    <span className="text-xs px-2 py-0.5 bg-slate-600 rounded">{e.entityType}</span>
                  </div>
                  {stryMutAct_9fa48("60494") ? e.domain || <div className="text-sm text-slate-400 mb-2">{e.domain}</div> : stryMutAct_9fa48("60493") ? false : stryMutAct_9fa48("60492") ? true : (stryCov_9fa48("60492", "60493", "60494"), e.domain && <div className="text-sm text-slate-400 mb-2">{e.domain}</div>)}
                  <div className="flex items-center gap-4 text-xs text-slate-500 mb-2">
                    <span>Health: {stryMutAct_9fa48("60497") ? e.financialHealth && 50 : stryMutAct_9fa48("60496") ? false : stryMutAct_9fa48("60495") ? true : (stryCov_9fa48("60495", "60496", "60497"), e.financialHealth || 50)}%</span>
                    <span>Reputation: {stryMutAct_9fa48("60500") ? e.reputationScore && 50 : stryMutAct_9fa48("60499") ? false : stryMutAct_9fa48("60498") ? true : (stryCov_9fa48("60498", "60499", "60500"), e.reputationScore || 50)}%</span>
                  </div>
                  <button onClick={stryMutAct_9fa48("60501") ? () => undefined : (stryCov_9fa48("60501"), () => detectOpportunities(e.id))} className="w-full px-3 py-1 bg-blue-600 hover:bg-blue-500 rounded text-xs">
                    Detect Opportunities
                  </button>
                </div>))}
            </div>}
        </div>

        {/* Opportunities */}
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Detected Opportunities</h2>
            <button onClick={stryMutAct_9fa48("60502") ? () => undefined : (stryCov_9fa48("60502"), () => setShowOpportunityExplainer(stryMutAct_9fa48("60503") ? false : (stryCov_9fa48("60503"), true)))} className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1">
              <Info className="w-3 h-3" /> How we detect
            </button>
          </div>
          
          {/* Priority Filter */}
          {stryMutAct_9fa48("60506") ? opportunities.length > 0 || <div className="flex items-center gap-2 mb-4">
              <Filter className="w-4 h-4 text-slate-500" />
              <div className="flex items-center gap-1 bg-slate-700 rounded-lg p-0.5">
                <button onClick={() => setOpportunityFilter('ALL')} className={`px-3 py-1 rounded text-xs ${opportunityFilter === 'ALL' ? 'bg-purple-600 text-white' : 'text-slate-400'}`}>
                  All
                </button>
                {PRIORITY_LEVELS.map(p => <button key={p.value} onClick={() => setOpportunityFilter(p.value)} className={`px-3 py-1 rounded text-xs flex items-center gap-1 ${opportunityFilter === p.value ? 'bg-purple-600 text-white' : 'text-slate-400'}`}>
                    <Star className="w-3 h-3" /> {p.label}
                  </button>)}
              </div>
            </div> : stryMutAct_9fa48("60505") ? false : stryMutAct_9fa48("60504") ? true : (stryCov_9fa48("60504", "60505", "60506"), (stryMutAct_9fa48("60509") ? opportunities.length <= 0 : stryMutAct_9fa48("60508") ? opportunities.length >= 0 : stryMutAct_9fa48("60507") ? true : (stryCov_9fa48("60507", "60508", "60509"), opportunities.length > 0)) && <div className="flex items-center gap-2 mb-4">
              <Filter className="w-4 h-4 text-slate-500" />
              <div className="flex items-center gap-1 bg-slate-700 rounded-lg p-0.5">
                <button onClick={stryMutAct_9fa48("60510") ? () => undefined : (stryCov_9fa48("60510"), () => setOpportunityFilter('ALL'))} className={`px-3 py-1 rounded text-xs ${(stryMutAct_9fa48("60515") ? opportunityFilter !== 'ALL' : stryMutAct_9fa48("60514") ? false : stryMutAct_9fa48("60513") ? true : (stryCov_9fa48("60513", "60514", "60515"), opportunityFilter === 'ALL')) ? 'bg-purple-600 text-white' : 'text-slate-400'}`}>
                  All
                </button>
                {PRIORITY_LEVELS.map(stryMutAct_9fa48("60519") ? () => undefined : (stryCov_9fa48("60519"), p => <button key={p.value} onClick={stryMutAct_9fa48("60520") ? () => undefined : (stryCov_9fa48("60520"), () => setOpportunityFilter(p.value))} className={`px-3 py-1 rounded text-xs flex items-center gap-1 ${(stryMutAct_9fa48("60524") ? opportunityFilter !== p.value : stryMutAct_9fa48("60523") ? false : stryMutAct_9fa48("60522") ? true : (stryCov_9fa48("60522", "60523", "60524"), opportunityFilter === p.value)) ? 'bg-purple-600 text-white' : 'text-slate-400'}`}>
                    <Star className="w-3 h-3" /> {p.label}
                  </button>))}
              </div>
            </div>)}
          
          {(stryMutAct_9fa48("60529") ? opportunities.length !== 0 : stryMutAct_9fa48("60528") ? false : stryMutAct_9fa48("60527") ? true : (stryCov_9fa48("60527", "60528", "60529"), opportunities.length === 0)) ? <div className="text-center py-12">
              <Zap className="w-12 h-12 mx-auto mb-3 text-purple-400 opacity-50" />
              <p className="text-slate-400 mb-4 text-sm">Add entities and connect data sources to detect opportunities</p>
              <button onClick={stryMutAct_9fa48("60530") ? () => undefined : (stryCov_9fa48("60530"), () => setShowOpportunityExplainer(stryMutAct_9fa48("60531") ? false : (stryCov_9fa48("60531"), true)))} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm">
                See What Signals We Track →
              </button>
            </div> : (stryMutAct_9fa48("60534") ? scoredOpportunities.length !== 0 : stryMutAct_9fa48("60533") ? false : stryMutAct_9fa48("60532") ? true : (stryCov_9fa48("60532", "60533", "60534"), scoredOpportunities.length === 0)) ? <div className="text-center py-8 text-slate-500">
              No opportunities match this priority filter
            </div> : <div className="space-y-3 max-h-96 overflow-y-auto">
              {scoredOpportunities.map(stryMutAct_9fa48("60535") ? () => undefined : (stryCov_9fa48("60535"), o => <div key={o.id} className="p-4 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-0.5 bg-purple-900/50 text-purple-300 rounded">{o.opportunityType.replace(/_/g, ' ')}</span>
                      <span className={`text-xs px-2 py-0.5 rounded flex items-center gap-1 ${(stryMutAct_9fa48("60540") ? o.priority !== 'HIGH' : stryMutAct_9fa48("60539") ? false : stryMutAct_9fa48("60538") ? true : (stryCov_9fa48("60538", "60539", "60540"), o.priority === 'HIGH')) ? 'bg-red-500/20 text-red-300' : (stryMutAct_9fa48("60545") ? o.priority !== 'MEDIUM' : stryMutAct_9fa48("60544") ? false : stryMutAct_9fa48("60543") ? true : (stryCov_9fa48("60543", "60544", "60545"), o.priority === 'MEDIUM')) ? 'bg-amber-500/20 text-amber-300' : 'bg-blue-500/20 text-blue-300'}`}>
                        <Star className="w-3 h-3" /> {o.priority}
                      </span>
                    </div>
                    <span className="text-xs px-2 py-0.5 bg-slate-600 rounded">{o.status}</span>
                  </div>
                  <div className="font-medium mb-1">{o.title}</div>
                  <div className="text-sm text-slate-400 mb-2">{stryMutAct_9fa48("60550") ? o.description.substring(0, 80) : stryMutAct_9fa48("60549") ? o.description : (stryCov_9fa48("60549", "60550"), o.description?.substring(0, 80))}...</div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs">
                      <span className="text-emerald-400">Fit: {o.strategicFit}%</span>
                      <span className="text-red-400">Risk: {o.riskScore}%</span>
                      {stryMutAct_9fa48("60553") ? o.estimatedValue || <span className="text-purple-400">${(o.estimatedValue / 1000).toFixed(0)}K</span> : stryMutAct_9fa48("60552") ? false : stryMutAct_9fa48("60551") ? true : (stryCov_9fa48("60551", "60552", "60553"), o.estimatedValue && <span className="text-purple-400">${(stryMutAct_9fa48("60554") ? o.estimatedValue * 1000 : (stryCov_9fa48("60554"), o.estimatedValue / 1000)).toFixed(0)}K</span>)}
                    </div>
                    <button className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1">
                      <ArrowUpRight className="w-3 h-3" /> Pursue
                    </button>
                  </div>
                </div>))}
            </div>}
        </div>
      </div>

      {/* Add Entity Modal */}
      {stryMutAct_9fa48("60557") ? showAddEntity || <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-lg p-6 w-full max-w-md border border-slate-700">
            <h3 className="text-xl font-semibold mb-4">Add Ecosystem Entity</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Type</label>
                <select value={newEntity.entityType} onChange={e => setNewEntity({
              ...newEntity,
              entityType: e.target.value
            })} className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2">
                  <option value="PARTNER">Partner</option>
                  <option value="VENDOR">Vendor</option>
                  <option value="COMPETITOR">Competitor</option>
                  <option value="CUSTOMER">Customer</option>
                  <option value="INVESTOR">Investor</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Name</label>
                <input value={newEntity.name} onChange={e => setNewEntity({
              ...newEntity,
              name: e.target.value
            })} className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2" placeholder="Organization name" />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Domain/Industry</label>
                <input value={newEntity.domain} onChange={e => setNewEntity({
              ...newEntity,
              domain: e.target.value
            })} className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2" placeholder="e.g., Technology, Finance" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowAddEntity(false)} className="flex-1 px-4 py-2 bg-slate-600 hover:bg-slate-500 rounded">Cancel</button>
              <button onClick={addEntity} className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded">Add Entity</button>
            </div>
          </div>
        </div> : stryMutAct_9fa48("60556") ? false : stryMutAct_9fa48("60555") ? true : (stryCov_9fa48("60555", "60556", "60557"), showAddEntity && <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-lg p-6 w-full max-w-md border border-slate-700">
            <h3 className="text-xl font-semibold mb-4">Add Ecosystem Entity</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Type</label>
                <select value={newEntity.entityType} onChange={stryMutAct_9fa48("60558") ? () => undefined : (stryCov_9fa48("60558"), e => setNewEntity(stryMutAct_9fa48("60559") ? {} : (stryCov_9fa48("60559"), {
              ...newEntity,
              entityType: e.target.value
            })))} className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2">
                  <option value="PARTNER">Partner</option>
                  <option value="VENDOR">Vendor</option>
                  <option value="COMPETITOR">Competitor</option>
                  <option value="CUSTOMER">Customer</option>
                  <option value="INVESTOR">Investor</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Name</label>
                <input value={newEntity.name} onChange={stryMutAct_9fa48("60560") ? () => undefined : (stryCov_9fa48("60560"), e => setNewEntity(stryMutAct_9fa48("60561") ? {} : (stryCov_9fa48("60561"), {
              ...newEntity,
              name: e.target.value
            })))} className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2" placeholder="Organization name" />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Domain/Industry</label>
                <input value={newEntity.domain} onChange={stryMutAct_9fa48("60562") ? () => undefined : (stryCov_9fa48("60562"), e => setNewEntity(stryMutAct_9fa48("60563") ? {} : (stryCov_9fa48("60563"), {
              ...newEntity,
              domain: e.target.value
            })))} className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2" placeholder="e.g., Technology, Finance" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={stryMutAct_9fa48("60564") ? () => undefined : (stryCov_9fa48("60564"), () => setShowAddEntity(stryMutAct_9fa48("60565") ? true : (stryCov_9fa48("60565"), false)))} className="flex-1 px-4 py-2 bg-slate-600 hover:bg-slate-500 rounded">Cancel</button>
              <button onClick={addEntity} className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded">Add Entity</button>
            </div>
          </div>
        </div>)}
      {/* Opportunity Detection Explainer Modal */}
      {stryMutAct_9fa48("60568") ? showOpportunityExplainer || <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={() => setShowOpportunityExplainer(false)}>
          <div className="bg-slate-800 rounded-xl p-6 w-full max-w-2xl border border-slate-700" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold">How Opportunity Detection Works</h3>
                <p className="text-sm text-slate-400">CendiaSymbiont™ monitors multiple signals to surface opportunities</p>
              </div>
              <button onClick={() => setShowOpportunityExplainer(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            
            <div className="space-y-3 mb-6">
              {OPPORTUNITY_SIGNALS.map(signal => <div key={signal.source} className="flex items-center gap-4 p-4 bg-slate-700/50 rounded-lg">
                  <span className="text-2xl">{signal.icon}</span>
                  <div className="flex-1">
                    <div className="font-medium">{signal.source}</div>
                    <div className="text-sm text-slate-400">{signal.description}</div>
                  </div>
                  <span className="px-2 py-0.5 bg-slate-600 rounded text-xs text-slate-300">Connected</span>
                </div>)}
            </div>

            <div className="p-4 bg-purple-900/20 border border-purple-500/30 rounded-lg">
              <h4 className="font-medium text-purple-300 mb-2">AI-Powered Analysis</h4>
              <p className="text-sm text-slate-300">Our AI cross-references these signals against your strategic goals, market conditions, and historical patterns to surface the highest-value opportunities.</p>
            </div>

            <div className="mt-6 flex gap-3">
              <button className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg font-medium flex items-center justify-center gap-2">
                <Database className="w-4 h-4" /> Connect Data Sources
              </button>
              <button onClick={() => setShowOpportunityExplainer(false)} className="px-4 py-2 bg-slate-600 hover:bg-slate-500 rounded-lg">Close</button>
            </div>
          </div>
        </div> : stryMutAct_9fa48("60567") ? false : stryMutAct_9fa48("60566") ? true : (stryCov_9fa48("60566", "60567", "60568"), showOpportunityExplainer && <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={stryMutAct_9fa48("60569") ? () => undefined : (stryCov_9fa48("60569"), () => setShowOpportunityExplainer(stryMutAct_9fa48("60570") ? true : (stryCov_9fa48("60570"), false)))}>
          <div className="bg-slate-800 rounded-xl p-6 w-full max-w-2xl border border-slate-700" onClick={stryMutAct_9fa48("60571") ? () => undefined : (stryCov_9fa48("60571"), e => e.stopPropagation())}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold">How Opportunity Detection Works</h3>
                <p className="text-sm text-slate-400">CendiaSymbiont™ monitors multiple signals to surface opportunities</p>
              </div>
              <button onClick={stryMutAct_9fa48("60572") ? () => undefined : (stryCov_9fa48("60572"), () => setShowOpportunityExplainer(stryMutAct_9fa48("60573") ? true : (stryCov_9fa48("60573"), false)))} className="text-slate-400 hover:text-white">✕</button>
            </div>
            
            <div className="space-y-3 mb-6">
              {OPPORTUNITY_SIGNALS.map(stryMutAct_9fa48("60574") ? () => undefined : (stryCov_9fa48("60574"), signal => <div key={signal.source} className="flex items-center gap-4 p-4 bg-slate-700/50 rounded-lg">
                  <span className="text-2xl">{signal.icon}</span>
                  <div className="flex-1">
                    <div className="font-medium">{signal.source}</div>
                    <div className="text-sm text-slate-400">{signal.description}</div>
                  </div>
                  <span className="px-2 py-0.5 bg-slate-600 rounded text-xs text-slate-300">Connected</span>
                </div>))}
            </div>

            <div className="p-4 bg-purple-900/20 border border-purple-500/30 rounded-lg">
              <h4 className="font-medium text-purple-300 mb-2">AI-Powered Analysis</h4>
              <p className="text-sm text-slate-300">Our AI cross-references these signals against your strategic goals, market conditions, and historical patterns to surface the highest-value opportunities.</p>
            </div>

            <div className="mt-6 flex gap-3">
              <button className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg font-medium flex items-center justify-center gap-2">
                <Database className="w-4 h-4" /> Connect Data Sources
              </button>
              <button onClick={stryMutAct_9fa48("60575") ? () => undefined : (stryCov_9fa48("60575"), () => setShowOpportunityExplainer(stryMutAct_9fa48("60576") ? true : (stryCov_9fa48("60576"), false)))} className="px-4 py-2 bg-slate-600 hover:bg-slate-500 rounded-lg">Close</button>
            </div>
          </div>
        </div>)}

      {/* Import Modal */}
      {stryMutAct_9fa48("60579") ? showImportModal || <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={() => setShowImportModal(false)}>
          <div className="bg-slate-800 rounded-xl p-6 w-full max-w-lg border border-slate-700" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <Upload className="w-5 h-5 text-purple-400" /> Import Entities
                </h3>
                <p className="text-sm text-slate-400">Bulk import ecosystem entities from file or CRM</p>
              </div>
              <button onClick={() => setShowImportModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            
            {/* Import Options */}
            <div className="space-y-3 mb-6">
              <button className="w-full p-4 bg-slate-700 hover:bg-slate-600 rounded-lg text-left transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">CSV File</div>
                    <div className="text-xs text-slate-400">Upload a CSV with Name, Type, Domain columns</div>
                  </div>
                </div>
              </button>
              <button className="w-full p-4 bg-slate-700 hover:bg-slate-600 rounded-lg text-left transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <Database className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">Salesforce CRM</div>
                    <div className="text-xs text-slate-400">Import accounts and partners from Salesforce</div>
                  </div>
                </div>
              </button>
              <button className="w-full p-4 bg-slate-700 hover:bg-slate-600 rounded-lg text-left transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                    <Database className="w-5 h-5 text-orange-400" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">HubSpot CRM</div>
                    <div className="text-xs text-slate-400">Import companies from HubSpot</div>
                  </div>
                </div>
              </button>
              <button className="w-full p-4 bg-slate-700 hover:bg-slate-600 rounded-lg text-left transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">JSON File</div>
                    <div className="text-xs text-slate-400">Import structured entity data from JSON</div>
                  </div>
                </div>
              </button>
            </div>

            {/* Drop Zone */}
            <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center mb-4">
              <Upload className="w-8 h-8 mx-auto mb-2 text-slate-500" />
              <p className="text-slate-400 text-sm">Drag and drop a file here, or click to browse</p>
              <p className="text-slate-500 text-xs mt-1">Supports CSV, JSON up to 10MB</p>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setShowImportModal(false)} className="flex-1 px-4 py-2 bg-slate-600 hover:bg-slate-500 rounded-lg">
                Cancel
              </button>
              <button className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg font-medium">
                Import
              </button>
            </div>
          </div>
        </div> : stryMutAct_9fa48("60578") ? false : stryMutAct_9fa48("60577") ? true : (stryCov_9fa48("60577", "60578", "60579"), showImportModal && <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={stryMutAct_9fa48("60580") ? () => undefined : (stryCov_9fa48("60580"), () => setShowImportModal(stryMutAct_9fa48("60581") ? true : (stryCov_9fa48("60581"), false)))}>
          <div className="bg-slate-800 rounded-xl p-6 w-full max-w-lg border border-slate-700" onClick={stryMutAct_9fa48("60582") ? () => undefined : (stryCov_9fa48("60582"), e => e.stopPropagation())}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <Upload className="w-5 h-5 text-purple-400" /> Import Entities
                </h3>
                <p className="text-sm text-slate-400">Bulk import ecosystem entities from file or CRM</p>
              </div>
              <button onClick={stryMutAct_9fa48("60583") ? () => undefined : (stryCov_9fa48("60583"), () => setShowImportModal(stryMutAct_9fa48("60584") ? true : (stryCov_9fa48("60584"), false)))} className="text-slate-400 hover:text-white">✕</button>
            </div>
            
            {/* Import Options */}
            <div className="space-y-3 mb-6">
              <button className="w-full p-4 bg-slate-700 hover:bg-slate-600 rounded-lg text-left transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">CSV File</div>
                    <div className="text-xs text-slate-400">Upload a CSV with Name, Type, Domain columns</div>
                  </div>
                </div>
              </button>
              <button className="w-full p-4 bg-slate-700 hover:bg-slate-600 rounded-lg text-left transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <Database className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">Salesforce CRM</div>
                    <div className="text-xs text-slate-400">Import accounts and partners from Salesforce</div>
                  </div>
                </div>
              </button>
              <button className="w-full p-4 bg-slate-700 hover:bg-slate-600 rounded-lg text-left transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                    <Database className="w-5 h-5 text-orange-400" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">HubSpot CRM</div>
                    <div className="text-xs text-slate-400">Import companies from HubSpot</div>
                  </div>
                </div>
              </button>
              <button className="w-full p-4 bg-slate-700 hover:bg-slate-600 rounded-lg text-left transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">JSON File</div>
                    <div className="text-xs text-slate-400">Import structured entity data from JSON</div>
                  </div>
                </div>
              </button>
            </div>

            {/* Drop Zone */}
            <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center mb-4">
              <Upload className="w-8 h-8 mx-auto mb-2 text-slate-500" />
              <p className="text-slate-400 text-sm">Drag and drop a file here, or click to browse</p>
              <p className="text-slate-500 text-xs mt-1">Supports CSV, JSON up to 10MB</p>
            </div>

            <div className="flex gap-3">
              <button onClick={stryMutAct_9fa48("60585") ? () => undefined : (stryCov_9fa48("60585"), () => setShowImportModal(stryMutAct_9fa48("60586") ? true : (stryCov_9fa48("60586"), false)))} className="flex-1 px-4 py-2 bg-slate-600 hover:bg-slate-500 rounded-lg">
                Cancel
              </button>
              <button className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg font-medium">
                Import
              </button>
            </div>
          </div>
        </div>)}
    </div>;
};
export default SymbiontPage;