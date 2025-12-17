// @ts-nocheck
// =============================================================================
// ADMIN CONTROL CENTER - Master Platform Configuration
// Toggle services, agents, suites, visibility, and pricing from one place
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
import React, { useState, useEffect } from 'react';
import { cn } from '../../../lib/utils';
import { api } from '../../lib/api';

// =============================================================================
// TYPES
// =============================================================================

interface Feature {
  id: string;
  name: string;
  type: 'service' | 'agent' | 'suite' | 'pillar' | 'tool' | 'page';
  description: string;
  icon?: string;
  status: 'active' | 'disabled' | 'maintenance' | 'beta' | 'deprecated';
  visibility: 'public' | 'authenticated' | 'admin' | 'hidden';
  enabled: boolean;
  routes: string[];
  showInSitemap: boolean;
  showInNavigation: boolean;
  category: string;
  requiredPlan: string;
  config?: {
    permissions?: Record<string, string[]>;
    [key: string]: any;
  };
}
interface Agent {
  id: string;
  name: string;
  description: string;
  icon?: string;
  enabled: boolean;
  model: string;
  temperature: number;
  systemPrompt: string;
  capabilities: string[];
}
interface Suite {
  id: string;
  name: string;
  description: string;
  icon?: string;
  enabled: boolean;
  features: string[];
}
interface PricingTier {
  id: string;
  name: string;
  monthlyPrice: number;
  annualPrice: number;
  userLimit: number;
  agentLimit: number;
  active: boolean;
  visible: boolean;
}
interface ControlDashboard {
  features: {
    total: number;
    enabled: number;
    disabled: number;
    byCategory: Record<string, number>;
  };
  agents: {
    total: number;
    enabled: number;
    disabled: number;
  };
  suites: {
    total: number;
    enabled: number;
  };
  pricing: {
    total: number;
    active: number;
  };
  routes: {
    total: number;
    public: number;
    authenticated: number;
    hidden: number;
  };
}

// =============================================================================
// API CALLS
// =============================================================================

const API_BASE = '/admin';
async function fetchControlDashboard(): Promise<ControlDashboard> {
  const res = await api.get<any>(`${API_BASE}/control/dashboard`);
  const payload = res as any;
  if (stryMutAct_9fa48("15946") ? payload.success === false || payload.error : stryMutAct_9fa48("15945") ? false : stryMutAct_9fa48("15944") ? true : (stryCov_9fa48("15944", "15945", "15946"), (stryMutAct_9fa48("15948") ? payload.success !== false : stryMutAct_9fa48("15947") ? true : (stryCov_9fa48("15947", "15948"), payload.success === (stryMutAct_9fa48("15949") ? true : (stryCov_9fa48("15949"), false)))) && payload.error)) {
    throw new Error(stryMutAct_9fa48("15953") ? payload.error.message && 'Failed to fetch dashboard' : stryMutAct_9fa48("15952") ? false : stryMutAct_9fa48("15951") ? true : (stryCov_9fa48("15951", "15952", "15953"), payload.error.message || 'Failed to fetch dashboard'));
  }
  if (stryMutAct_9fa48("15956") ? false : stryMutAct_9fa48("15955") ? true : (stryCov_9fa48("15955", "15956"), payload.data)) {
    return payload.data as ControlDashboard;
  }
  return payload as ControlDashboard;
}
async function fetchFeatures(): Promise<Feature[]> {
  const res = await api.get<any>(`${API_BASE}/features`);
  const payload = res as any;
  if (stryMutAct_9fa48("15962") ? payload.success === false || payload.error : stryMutAct_9fa48("15961") ? false : stryMutAct_9fa48("15960") ? true : (stryCov_9fa48("15960", "15961", "15962"), (stryMutAct_9fa48("15964") ? payload.success !== false : stryMutAct_9fa48("15963") ? true : (stryCov_9fa48("15963", "15964"), payload.success === (stryMutAct_9fa48("15965") ? true : (stryCov_9fa48("15965"), false)))) && payload.error)) {
    throw new Error(stryMutAct_9fa48("15969") ? payload.error.message && 'Failed to fetch features' : stryMutAct_9fa48("15968") ? false : stryMutAct_9fa48("15967") ? true : (stryCov_9fa48("15967", "15968", "15969"), payload.error.message || 'Failed to fetch features'));
  }
  if (stryMutAct_9fa48("15972") ? false : stryMutAct_9fa48("15971") ? true : (stryCov_9fa48("15971", "15972"), payload.features)) {
    return payload.features as Feature[];
  }
  if (stryMutAct_9fa48("15976") ? payload.data.features : stryMutAct_9fa48("15975") ? false : stryMutAct_9fa48("15974") ? true : (stryCov_9fa48("15974", "15975", "15976"), payload.data?.features)) {
    return payload.data.features as Feature[];
  }
  if (stryMutAct_9fa48("15979") ? false : stryMutAct_9fa48("15978") ? true : (stryCov_9fa48("15978", "15979"), Array.isArray(payload.data))) {
    return payload.data as Feature[];
  }
  if (stryMutAct_9fa48("15982") ? false : stryMutAct_9fa48("15981") ? true : (stryCov_9fa48("15981", "15982"), Array.isArray(payload))) {
    return payload as Feature[];
  }
  throw new Error('Failed to fetch features');
}
async function fetchAgents(): Promise<Agent[]> {
  const res = await api.get<any>(`${API_BASE}/agents`);
  const payload = res as any;
  if (stryMutAct_9fa48("15989") ? payload.success === false || payload.error : stryMutAct_9fa48("15988") ? false : stryMutAct_9fa48("15987") ? true : (stryCov_9fa48("15987", "15988", "15989"), (stryMutAct_9fa48("15991") ? payload.success !== false : stryMutAct_9fa48("15990") ? true : (stryCov_9fa48("15990", "15991"), payload.success === (stryMutAct_9fa48("15992") ? true : (stryCov_9fa48("15992"), false)))) && payload.error)) {
    throw new Error(stryMutAct_9fa48("15996") ? payload.error.message && 'Failed to fetch agents' : stryMutAct_9fa48("15995") ? false : stryMutAct_9fa48("15994") ? true : (stryCov_9fa48("15994", "15995", "15996"), payload.error.message || 'Failed to fetch agents'));
  }
  if (stryMutAct_9fa48("15999") ? false : stryMutAct_9fa48("15998") ? true : (stryCov_9fa48("15998", "15999"), payload.agents)) {
    return payload.agents as Agent[];
  }
  if (stryMutAct_9fa48("16003") ? payload.data.agents : stryMutAct_9fa48("16002") ? false : stryMutAct_9fa48("16001") ? true : (stryCov_9fa48("16001", "16002", "16003"), payload.data?.agents)) {
    return payload.data.agents as Agent[];
  }
  if (stryMutAct_9fa48("16006") ? false : stryMutAct_9fa48("16005") ? true : (stryCov_9fa48("16005", "16006"), Array.isArray(payload.data))) {
    return payload.data as Agent[];
  }
  if (stryMutAct_9fa48("16009") ? false : stryMutAct_9fa48("16008") ? true : (stryCov_9fa48("16008", "16009"), Array.isArray(payload))) {
    return payload as Agent[];
  }
  throw new Error('Failed to fetch agents');
}
async function fetchSuites(): Promise<Suite[]> {
  const res = await api.get<any>(`${API_BASE}/suites`);
  const payload = res as any;
  if (stryMutAct_9fa48("16016") ? payload.success === false || payload.error : stryMutAct_9fa48("16015") ? false : stryMutAct_9fa48("16014") ? true : (stryCov_9fa48("16014", "16015", "16016"), (stryMutAct_9fa48("16018") ? payload.success !== false : stryMutAct_9fa48("16017") ? true : (stryCov_9fa48("16017", "16018"), payload.success === (stryMutAct_9fa48("16019") ? true : (stryCov_9fa48("16019"), false)))) && payload.error)) {
    throw new Error(stryMutAct_9fa48("16023") ? payload.error.message && 'Failed to fetch suites' : stryMutAct_9fa48("16022") ? false : stryMutAct_9fa48("16021") ? true : (stryCov_9fa48("16021", "16022", "16023"), payload.error.message || 'Failed to fetch suites'));
  }
  if (stryMutAct_9fa48("16026") ? false : stryMutAct_9fa48("16025") ? true : (stryCov_9fa48("16025", "16026"), payload.suites)) {
    return payload.suites as Suite[];
  }
  if (stryMutAct_9fa48("16030") ? payload.data.suites : stryMutAct_9fa48("16029") ? false : stryMutAct_9fa48("16028") ? true : (stryCov_9fa48("16028", "16029", "16030"), payload.data?.suites)) {
    return payload.data.suites as Suite[];
  }
  if (stryMutAct_9fa48("16033") ? false : stryMutAct_9fa48("16032") ? true : (stryCov_9fa48("16032", "16033"), Array.isArray(payload.data))) {
    return payload.data as Suite[];
  }
  if (stryMutAct_9fa48("16036") ? false : stryMutAct_9fa48("16035") ? true : (stryCov_9fa48("16035", "16036"), Array.isArray(payload))) {
    return payload as Suite[];
  }
  throw new Error('Failed to fetch suites');
}
async function fetchPricing(): Promise<PricingTier[]> {
  const res = await api.get<any>(`${API_BASE}/pricing`, stryMutAct_9fa48("16041") ? {} : (stryCov_9fa48("16041"), {
    includeHidden: stryMutAct_9fa48("16042") ? false : (stryCov_9fa48("16042"), true)
  }));
  const payload = res as any;
  if (stryMutAct_9fa48("16045") ? payload.success === false || payload.error : stryMutAct_9fa48("16044") ? false : stryMutAct_9fa48("16043") ? true : (stryCov_9fa48("16043", "16044", "16045"), (stryMutAct_9fa48("16047") ? payload.success !== false : stryMutAct_9fa48("16046") ? true : (stryCov_9fa48("16046", "16047"), payload.success === (stryMutAct_9fa48("16048") ? true : (stryCov_9fa48("16048"), false)))) && payload.error)) {
    throw new Error(stryMutAct_9fa48("16052") ? payload.error.message && 'Failed to fetch pricing' : stryMutAct_9fa48("16051") ? false : stryMutAct_9fa48("16050") ? true : (stryCov_9fa48("16050", "16051", "16052"), payload.error.message || 'Failed to fetch pricing'));
  }
  if (stryMutAct_9fa48("16055") ? false : stryMutAct_9fa48("16054") ? true : (stryCov_9fa48("16054", "16055"), payload.pricing)) {
    return payload.pricing as PricingTier[];
  }
  if (stryMutAct_9fa48("16059") ? payload.data.pricing : stryMutAct_9fa48("16058") ? false : stryMutAct_9fa48("16057") ? true : (stryCov_9fa48("16057", "16058", "16059"), payload.data?.pricing)) {
    return payload.data.pricing as PricingTier[];
  }
  if (stryMutAct_9fa48("16062") ? false : stryMutAct_9fa48("16061") ? true : (stryCov_9fa48("16061", "16062"), Array.isArray(payload.data))) {
    return payload.data as PricingTier[];
  }
  if (stryMutAct_9fa48("16065") ? false : stryMutAct_9fa48("16064") ? true : (stryCov_9fa48("16064", "16065"), Array.isArray(payload))) {
    return payload as PricingTier[];
  }
  throw new Error('Failed to fetch pricing');
}
async function toggleFeature(id: string, enabled: boolean): Promise<Feature> {
  const res = await api.post<any>(`${API_BASE}/features/${id}/toggle`, stryMutAct_9fa48("16070") ? {} : (stryCov_9fa48("16070"), {
    enabled
  }));
  const payload = res as any;
  if (stryMutAct_9fa48("16073") ? payload.success === false || payload.error : stryMutAct_9fa48("16072") ? false : stryMutAct_9fa48("16071") ? true : (stryCov_9fa48("16071", "16072", "16073"), (stryMutAct_9fa48("16075") ? payload.success !== false : stryMutAct_9fa48("16074") ? true : (stryCov_9fa48("16074", "16075"), payload.success === (stryMutAct_9fa48("16076") ? true : (stryCov_9fa48("16076"), false)))) && payload.error)) {
    throw new Error(stryMutAct_9fa48("16080") ? payload.error.message && 'Failed to toggle feature' : stryMutAct_9fa48("16079") ? false : stryMutAct_9fa48("16078") ? true : (stryCov_9fa48("16078", "16079", "16080"), payload.error.message || 'Failed to toggle feature'));
  }
  if (stryMutAct_9fa48("16083") ? false : stryMutAct_9fa48("16082") ? true : (stryCov_9fa48("16082", "16083"), payload.feature)) {
    return payload.feature as Feature;
  }
  if (stryMutAct_9fa48("16086") ? false : stryMutAct_9fa48("16085") ? true : (stryCov_9fa48("16085", "16086"), payload.data)) {
    return payload.data as Feature;
  }
  return payload as Feature;
}
async function setVisibility(id: string, visibility: string): Promise<Feature> {
  const res = await api.post<any>(`${API_BASE}/features/${id}/visibility`, stryMutAct_9fa48("16090") ? {} : (stryCov_9fa48("16090"), {
    visibility
  }));
  const payload = res as any;
  if (stryMutAct_9fa48("16093") ? payload.success === false || payload.error : stryMutAct_9fa48("16092") ? false : stryMutAct_9fa48("16091") ? true : (stryCov_9fa48("16091", "16092", "16093"), (stryMutAct_9fa48("16095") ? payload.success !== false : stryMutAct_9fa48("16094") ? true : (stryCov_9fa48("16094", "16095"), payload.success === (stryMutAct_9fa48("16096") ? true : (stryCov_9fa48("16096"), false)))) && payload.error)) {
    throw new Error(stryMutAct_9fa48("16100") ? payload.error.message && 'Failed to set visibility' : stryMutAct_9fa48("16099") ? false : stryMutAct_9fa48("16098") ? true : (stryCov_9fa48("16098", "16099", "16100"), payload.error.message || 'Failed to set visibility'));
  }
  if (stryMutAct_9fa48("16103") ? false : stryMutAct_9fa48("16102") ? true : (stryCov_9fa48("16102", "16103"), payload.feature)) {
    return payload.feature as Feature;
  }
  if (stryMutAct_9fa48("16106") ? false : stryMutAct_9fa48("16105") ? true : (stryCov_9fa48("16105", "16106"), payload.data)) {
    return payload.data as Feature;
  }
  return payload as Feature;
}
async function updateFeatureConfig(id: string, config: any): Promise<Feature> {
  const res = await api.patch<any>(`${API_BASE}/features/${id}`, stryMutAct_9fa48("16110") ? {} : (stryCov_9fa48("16110"), {
    config
  }));
  const payload = res as any;
  if (stryMutAct_9fa48("16113") ? payload.success === false || payload.error : stryMutAct_9fa48("16112") ? false : stryMutAct_9fa48("16111") ? true : (stryCov_9fa48("16111", "16112", "16113"), (stryMutAct_9fa48("16115") ? payload.success !== false : stryMutAct_9fa48("16114") ? true : (stryCov_9fa48("16114", "16115"), payload.success === (stryMutAct_9fa48("16116") ? true : (stryCov_9fa48("16116"), false)))) && payload.error)) {
    throw new Error(stryMutAct_9fa48("16120") ? payload.error.message && 'Failed to update feature' : stryMutAct_9fa48("16119") ? false : stryMutAct_9fa48("16118") ? true : (stryCov_9fa48("16118", "16119", "16120"), payload.error.message || 'Failed to update feature'));
  }
  if (stryMutAct_9fa48("16123") ? false : stryMutAct_9fa48("16122") ? true : (stryCov_9fa48("16122", "16123"), payload.feature)) {
    return payload.feature as Feature;
  }
  if (stryMutAct_9fa48("16126") ? false : stryMutAct_9fa48("16125") ? true : (stryCov_9fa48("16125", "16126"), payload.data)) {
    return payload.data as Feature;
  }
  return payload as Feature;
}
async function toggleAgent(id: string, enabled: boolean): Promise<Agent> {
  const res = await api.post<any>(`${API_BASE}/agents/${id}/toggle`, stryMutAct_9fa48("16130") ? {} : (stryCov_9fa48("16130"), {
    enabled
  }));
  const payload = res as any;
  if (stryMutAct_9fa48("16133") ? payload.success === false || payload.error : stryMutAct_9fa48("16132") ? false : stryMutAct_9fa48("16131") ? true : (stryCov_9fa48("16131", "16132", "16133"), (stryMutAct_9fa48("16135") ? payload.success !== false : stryMutAct_9fa48("16134") ? true : (stryCov_9fa48("16134", "16135"), payload.success === (stryMutAct_9fa48("16136") ? true : (stryCov_9fa48("16136"), false)))) && payload.error)) {
    throw new Error(stryMutAct_9fa48("16140") ? payload.error.message && 'Failed to toggle agent' : stryMutAct_9fa48("16139") ? false : stryMutAct_9fa48("16138") ? true : (stryCov_9fa48("16138", "16139", "16140"), payload.error.message || 'Failed to toggle agent'));
  }
  if (stryMutAct_9fa48("16143") ? false : stryMutAct_9fa48("16142") ? true : (stryCov_9fa48("16142", "16143"), payload.agent)) {
    return payload.agent as Agent;
  }
  if (stryMutAct_9fa48("16146") ? false : stryMutAct_9fa48("16145") ? true : (stryCov_9fa48("16145", "16146"), payload.data)) {
    return payload.data as Agent;
  }
  return payload as Agent;
}
async function toggleSuite(id: string, enabled: boolean): Promise<Suite> {
  const res = await api.post<any>(`${API_BASE}/suites/${id}/toggle`, stryMutAct_9fa48("16150") ? {} : (stryCov_9fa48("16150"), {
    enabled
  }));
  const payload = res as any;
  if (stryMutAct_9fa48("16153") ? payload.success === false || payload.error : stryMutAct_9fa48("16152") ? false : stryMutAct_9fa48("16151") ? true : (stryCov_9fa48("16151", "16152", "16153"), (stryMutAct_9fa48("16155") ? payload.success !== false : stryMutAct_9fa48("16154") ? true : (stryCov_9fa48("16154", "16155"), payload.success === (stryMutAct_9fa48("16156") ? true : (stryCov_9fa48("16156"), false)))) && payload.error)) {
    throw new Error(stryMutAct_9fa48("16160") ? payload.error.message && 'Failed to toggle suite' : stryMutAct_9fa48("16159") ? false : stryMutAct_9fa48("16158") ? true : (stryCov_9fa48("16158", "16159", "16160"), payload.error.message || 'Failed to toggle suite'));
  }
  if (stryMutAct_9fa48("16163") ? false : stryMutAct_9fa48("16162") ? true : (stryCov_9fa48("16162", "16163"), payload.suite)) {
    return payload.suite as Suite;
  }
  if (stryMutAct_9fa48("16166") ? false : stryMutAct_9fa48("16165") ? true : (stryCov_9fa48("16165", "16166"), payload.data)) {
    return payload.data as Suite;
  }
  return payload as Suite;
}
async function updatePricing(id: string, updates: Partial<PricingTier>): Promise<PricingTier> {
  const res = await api.patch<any>(`${API_BASE}/pricing/${id}`, updates);
  const payload = res as any;
  if (stryMutAct_9fa48("16172") ? payload.success === false || payload.error : stryMutAct_9fa48("16171") ? false : stryMutAct_9fa48("16170") ? true : (stryCov_9fa48("16170", "16171", "16172"), (stryMutAct_9fa48("16174") ? payload.success !== false : stryMutAct_9fa48("16173") ? true : (stryCov_9fa48("16173", "16174"), payload.success === (stryMutAct_9fa48("16175") ? true : (stryCov_9fa48("16175"), false)))) && payload.error)) {
    throw new Error(stryMutAct_9fa48("16179") ? payload.error.message && 'Failed to update pricing' : stryMutAct_9fa48("16178") ? false : stryMutAct_9fa48("16177") ? true : (stryCov_9fa48("16177", "16178", "16179"), payload.error.message || 'Failed to update pricing'));
  }
  if (stryMutAct_9fa48("16182") ? false : stryMutAct_9fa48("16181") ? true : (stryCov_9fa48("16181", "16182"), payload.tier)) {
    return payload.tier as PricingTier;
  }
  if (stryMutAct_9fa48("16185") ? false : stryMutAct_9fa48("16184") ? true : (stryCov_9fa48("16184", "16185"), payload.data)) {
    return payload.data as PricingTier;
  }
  return payload as PricingTier;
}

// =============================================================================
// COMPONENTS
// =============================================================================

const Toggle: React.FC<{
  enabled: boolean;
  onChange: () => void;
  disabled?: boolean;
}> = stryMutAct_9fa48("16187") ? () => undefined : (stryCov_9fa48("16187"), (() => {
  const Toggle: React.FC<{
    enabled: boolean;
    onChange: () => void;
    disabled?: boolean;
  }> = ({
    enabled,
    onChange,
    disabled
  }) => <button onClick={onChange} disabled={disabled} className={cn('relative w-12 h-6 rounded-full transition-colors', enabled ? 'bg-success-main' : 'bg-neutral-600', stryMutAct_9fa48("16193") ? disabled || 'opacity-50 cursor-not-allowed' : stryMutAct_9fa48("16192") ? false : stryMutAct_9fa48("16191") ? true : (stryCov_9fa48("16191", "16192", "16193"), disabled && 'opacity-50 cursor-not-allowed'))}>
    <span className={cn('absolute top-1 w-4 h-4 bg-white rounded-full transition-all', enabled ? 'left-7' : 'left-1')} />
  </button>;
  return Toggle;
})());
const VisibilityBadge: React.FC<{
  visibility: string;
  onClick?: () => void;
}> = ({
  visibility,
  onClick
}) => {
  const colors = stryMutAct_9fa48("16199") ? {} : (stryCov_9fa48("16199"), {
    public: 'bg-green-500/20 text-green-400',
    authenticated: 'bg-blue-500/20 text-blue-400',
    admin: 'bg-purple-500/20 text-purple-400',
    hidden: 'bg-neutral-500/20 text-neutral-400'
  });
  const icons = stryMutAct_9fa48("16204") ? {} : (stryCov_9fa48("16204"), {
    public: '🌐',
    authenticated: '🔒',
    admin: '👑',
    hidden: '👁️‍🗨️'
  });
  return <button onClick={onClick} className={cn('px-2 py-1 rounded-full text-xs font-medium', colors[visibility as keyof typeof colors])}>
      {icons[visibility as keyof typeof icons]} {visibility}
    </button>;
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const ControlCenterPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'features' | 'agents' | 'suites' | 'pricing'>('overview');
  const [dashboard, setDashboard] = useState<ControlDashboard | null>(null);
  const [features, setFeatures] = useState<Feature[]>(stryMutAct_9fa48("16212") ? ["Stryker was here"] : (stryCov_9fa48("16212"), []));
  const [agents, setAgents] = useState<Agent[]>(stryMutAct_9fa48("16213") ? ["Stryker was here"] : (stryCov_9fa48("16213"), []));
  const [suites, setSuites] = useState<Suite[]>(stryMutAct_9fa48("16214") ? ["Stryker was here"] : (stryCov_9fa48("16214"), []));
  const [pricing, setPricing] = useState<PricingTier[]>(stryMutAct_9fa48("16215") ? ["Stryker was here"] : (stryCov_9fa48("16215"), []));
  const [loading, setLoading] = useState(stryMutAct_9fa48("16216") ? false : (stryCov_9fa48("16216"), true));
  const [editingPrice, setEditingPrice] = useState<string | null>(null);
  useEffect(() => {
    loadData();
  }, stryMutAct_9fa48("16218") ? ["Stryker was here"] : (stryCov_9fa48("16218"), []));
  const loadData = async () => {
    try {
      setLoading(stryMutAct_9fa48("16221") ? false : (stryCov_9fa48("16221"), true));
      const [dashboardData, featuresData, agentsData, suitesData, pricingData] = await Promise.all(stryMutAct_9fa48("16222") ? [] : (stryCov_9fa48("16222"), [fetchControlDashboard(), fetchFeatures(), fetchAgents(), fetchSuites(), fetchPricing()]));
      setDashboard(dashboardData);
      setFeatures(featuresData);
      setAgents(agentsData);
      setSuites(suitesData);
      setPricing(pricingData);
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setLoading(stryMutAct_9fa48("16226") ? true : (stryCov_9fa48("16226"), false));
    }
  };
  const handleToggleFeature = async (id: string, currentEnabled: boolean) => {
    try {
      await toggleFeature(id, stryMutAct_9fa48("16229") ? currentEnabled : (stryCov_9fa48("16229"), !currentEnabled));
      setFeatures(features.map(stryMutAct_9fa48("16230") ? () => undefined : (stryCov_9fa48("16230"), f => (stryMutAct_9fa48("16233") ? f.id !== id : stryMutAct_9fa48("16232") ? false : stryMutAct_9fa48("16231") ? true : (stryCov_9fa48("16231", "16232", "16233"), f.id === id)) ? stryMutAct_9fa48("16234") ? {} : (stryCov_9fa48("16234"), {
        ...f,
        enabled: stryMutAct_9fa48("16235") ? currentEnabled : (stryCov_9fa48("16235"), !currentEnabled)
      }) : f)));
      loadData(); // Refresh dashboard
    } catch (err) {
      console.error('Failed to toggle feature:', err);
    }
  };
  const handleSetVisibility = async (id: string, visibility: string) => {
    try {
      await setVisibility(id, visibility);
      setFeatures(features.map(stryMutAct_9fa48("16240") ? () => undefined : (stryCov_9fa48("16240"), f => (stryMutAct_9fa48("16243") ? f.id !== id : stryMutAct_9fa48("16242") ? false : stryMutAct_9fa48("16241") ? true : (stryCov_9fa48("16241", "16242", "16243"), f.id === id)) ? stryMutAct_9fa48("16244") ? {} : (stryCov_9fa48("16244"), {
        ...f,
        visibility: visibility as any
      }) : f)));
    } catch (err) {
      console.error('Failed to set visibility:', err);
    }
  };
  const handleToggleAgent = async (id: string, currentEnabled: boolean) => {
    try {
      await toggleAgent(id, stryMutAct_9fa48("16249") ? currentEnabled : (stryCov_9fa48("16249"), !currentEnabled));
      setAgents(agents.map(stryMutAct_9fa48("16250") ? () => undefined : (stryCov_9fa48("16250"), a => (stryMutAct_9fa48("16253") ? a.id !== id : stryMutAct_9fa48("16252") ? false : stryMutAct_9fa48("16251") ? true : (stryCov_9fa48("16251", "16252", "16253"), a.id === id)) ? stryMutAct_9fa48("16254") ? {} : (stryCov_9fa48("16254"), {
        ...a,
        enabled: stryMutAct_9fa48("16255") ? currentEnabled : (stryCov_9fa48("16255"), !currentEnabled)
      }) : a)));
      loadData();
    } catch (err) {
      console.error('Failed to toggle agent:', err);
    }
  };
  const handleToggleSuite = async (id: string, currentEnabled: boolean) => {
    try {
      await toggleSuite(id, stryMutAct_9fa48("16260") ? currentEnabled : (stryCov_9fa48("16260"), !currentEnabled));
      loadData(); // Full refresh since suite toggle affects features
    } catch (err) {
      console.error('Failed to toggle suite:', err);
    }
  };
  const handleToggleCapabilityRole = async (featureId: string, capability: string, role: string) => {
    try {
      const feature = features.find(stryMutAct_9fa48("16265") ? () => undefined : (stryCov_9fa48("16265"), f => stryMutAct_9fa48("16268") ? f.id !== featureId : stryMutAct_9fa48("16267") ? false : stryMutAct_9fa48("16266") ? true : (stryCov_9fa48("16266", "16267", "16268"), f.id === featureId)));
      if (stryMutAct_9fa48("16271") ? false : stryMutAct_9fa48("16270") ? true : stryMutAct_9fa48("16269") ? feature : (stryCov_9fa48("16269", "16270", "16271"), !feature)) return;
      const featureConfig: any = stryMutAct_9fa48("16274") ? feature.config && {} : stryMutAct_9fa48("16273") ? false : stryMutAct_9fa48("16272") ? true : (stryCov_9fa48("16272", "16273", "16274"), feature.config || {});
      const existingPermissions: Record<string, string[]> = stryMutAct_9fa48("16277") ? featureConfig.permissions && {} : stryMutAct_9fa48("16276") ? false : stryMutAct_9fa48("16275") ? true : (stryCov_9fa48("16275", "16276", "16277"), featureConfig.permissions || {});
      const currentRoles: string[] = stryMutAct_9fa48("16280") ? existingPermissions[capability] && ['ADMIN'] : stryMutAct_9fa48("16279") ? false : stryMutAct_9fa48("16278") ? true : (stryCov_9fa48("16278", "16279", "16280"), existingPermissions[capability] || (stryMutAct_9fa48("16281") ? [] : (stryCov_9fa48("16281"), ['ADMIN'])));
      const nextRoles = currentRoles.includes(role) ? stryMutAct_9fa48("16283") ? currentRoles : (stryCov_9fa48("16283"), currentRoles.filter(stryMutAct_9fa48("16284") ? () => undefined : (stryCov_9fa48("16284"), r => stryMutAct_9fa48("16287") ? r === role : stryMutAct_9fa48("16286") ? false : stryMutAct_9fa48("16285") ? true : (stryCov_9fa48("16285", "16286", "16287"), r !== role)))) : stryMutAct_9fa48("16288") ? [] : (stryCov_9fa48("16288"), [...currentRoles, role]);
      const newPermissions = stryMutAct_9fa48("16289") ? {} : (stryCov_9fa48("16289"), {
        ...existingPermissions,
        [capability]: nextRoles
      });
      const newConfig = stryMutAct_9fa48("16290") ? {} : (stryCov_9fa48("16290"), {
        ...featureConfig,
        permissions: newPermissions
      });
      const updated = await updateFeatureConfig(featureId, newConfig);
      setFeatures(features.map(stryMutAct_9fa48("16291") ? () => undefined : (stryCov_9fa48("16291"), f => (stryMutAct_9fa48("16294") ? f.id !== featureId : stryMutAct_9fa48("16293") ? false : stryMutAct_9fa48("16292") ? true : (stryCov_9fa48("16292", "16293", "16294"), f.id === featureId)) ? stryMutAct_9fa48("16295") ? {} : (stryCov_9fa48("16295"), {
        ...f,
        config: (updated as any).config
      }) : f)));
    } catch (err) {
      console.error('Failed to update feature permissions:', err);
    }
  };
  const handleUpdatePrice = async (id: string, monthlyPrice: number) => {
    try {
      await updatePricing(id, stryMutAct_9fa48("16300") ? {} : (stryCov_9fa48("16300"), {
        monthlyPrice,
        annualPrice: stryMutAct_9fa48("16301") ? monthlyPrice / 10 : (stryCov_9fa48("16301"), monthlyPrice * 10)
      }));
      setPricing(pricing.map(stryMutAct_9fa48("16302") ? () => undefined : (stryCov_9fa48("16302"), p => (stryMutAct_9fa48("16305") ? p.id !== id : stryMutAct_9fa48("16304") ? false : stryMutAct_9fa48("16303") ? true : (stryCov_9fa48("16303", "16304", "16305"), p.id === id)) ? stryMutAct_9fa48("16306") ? {} : (stryCov_9fa48("16306"), {
        ...p,
        monthlyPrice,
        annualPrice: stryMutAct_9fa48("16307") ? monthlyPrice / 10 : (stryCov_9fa48("16307"), monthlyPrice * 10)
      }) : p)));
      setEditingPrice(null);
    } catch (err) {
      console.error('Failed to update price:', err);
    }
  };
  if (stryMutAct_9fa48("16311") ? false : stryMutAct_9fa48("16310") ? true : (stryCov_9fa48("16310", "16311"), loading)) {
    return <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>;
  }
  return <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Control Center</h1>
        <p className="text-neutral-400">Manage all platform features, agents, suites, and pricing</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {(['overview', 'features', 'agents', 'suites', 'pricing'] as const).map(stryMutAct_9fa48("16313") ? () => undefined : (stryCov_9fa48("16313"), tab => <button key={tab} onClick={stryMutAct_9fa48("16314") ? () => undefined : (stryCov_9fa48("16314"), () => setActiveTab(tab))} className={cn('px-4 py-2 rounded-lg font-medium capitalize transition-colors', (stryMutAct_9fa48("16318") ? activeTab !== tab : stryMutAct_9fa48("16317") ? false : stryMutAct_9fa48("16316") ? true : (stryCov_9fa48("16316", "16317", "16318"), activeTab === tab)) ? 'bg-primary-600 text-white' : 'bg-neutral-800 text-neutral-400 hover:text-white')}>
            {tab}
          </button>))}
      </div>

      {/* Overview Tab */}
      {stryMutAct_9fa48("16323") ? activeTab === 'overview' && dashboard || <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-5 gap-4">
            <div className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
              <p className="text-neutral-400 text-sm mb-1">Features</p>
              <p className="text-3xl font-bold text-white">{dashboard.features.enabled}/{dashboard.features.total}</p>
              <p className="text-xs text-success-main mt-1">enabled</p>
            </div>
            <div className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
              <p className="text-neutral-400 text-sm mb-1">AI Agents</p>
              <p className="text-3xl font-bold text-white">{dashboard.agents.enabled}/{dashboard.agents.total}</p>
              <p className="text-xs text-success-main mt-1">active</p>
            </div>
            <div className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
              <p className="text-neutral-400 text-sm mb-1">Suites</p>
              <p className="text-3xl font-bold text-white">{dashboard.suites.enabled}/{dashboard.suites.total}</p>
              <p className="text-xs text-success-main mt-1">enabled</p>
            </div>
            <div className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
              <p className="text-neutral-400 text-sm mb-1">Pricing Tiers</p>
              <p className="text-3xl font-bold text-white">{dashboard.pricing.active}/{dashboard.pricing.total}</p>
              <p className="text-xs text-success-main mt-1">active</p>
            </div>
            <div className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
              <p className="text-neutral-400 text-sm mb-1">Routes</p>
              <p className="text-3xl font-bold text-white">{dashboard.routes.total}</p>
              <p className="text-xs text-neutral-400 mt-1">{dashboard.routes.public} public</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
            <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
            <div className="grid grid-cols-3 gap-4">
              <button onClick={() => setActiveTab('features')} className="p-4 bg-neutral-700/50 rounded-lg hover:bg-neutral-700 transition-colors text-left">
                <span className="text-2xl">⚡</span>
                <p className="font-medium text-white mt-2">Manage Features</p>
                <p className="text-sm text-neutral-400">Toggle services on/off</p>
              </button>
              <button onClick={() => setActiveTab('agents')} className="p-4 bg-neutral-700/50 rounded-lg hover:bg-neutral-700 transition-colors text-left">
                <span className="text-2xl">🤖</span>
                <p className="font-medium text-white mt-2">Configure Agents</p>
                <p className="text-sm text-neutral-400">Enable/disable AI agents</p>
              </button>
              <button onClick={() => setActiveTab('pricing')} className="p-4 bg-neutral-700/50 rounded-lg hover:bg-neutral-700 transition-colors text-left">
                <span className="text-2xl">💰</span>
                <p className="font-medium text-white mt-2">Update Pricing</p>
                <p className="text-sm text-neutral-400">Modify plan prices</p>
              </button>
            </div>
          </div>

          {/* Route Visibility */}
          <div className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
            <h2 className="text-lg font-semibold text-white mb-4">Route Visibility</h2>
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-400">{dashboard.routes.public}</p>
                <p className="text-sm text-neutral-400">🌐 Public</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-400">{dashboard.routes.authenticated}</p>
                <p className="text-sm text-neutral-400">🔒 Authenticated</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-neutral-400">{dashboard.routes.hidden}</p>
                <p className="text-sm text-neutral-400">👁️‍🗨️ Hidden</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-400">{dashboard.routes.total - dashboard.routes.public - dashboard.routes.authenticated - dashboard.routes.hidden}</p>
                <p className="text-sm text-neutral-400">👑 Admin Only</p>
              </div>
            </div>
          </div>
        </div> : stryMutAct_9fa48("16322") ? false : stryMutAct_9fa48("16321") ? true : (stryCov_9fa48("16321", "16322", "16323"), (stryMutAct_9fa48("16325") ? activeTab === 'overview' || dashboard : stryMutAct_9fa48("16324") ? true : (stryCov_9fa48("16324", "16325"), (stryMutAct_9fa48("16327") ? activeTab !== 'overview' : stryMutAct_9fa48("16326") ? true : (stryCov_9fa48("16326", "16327"), activeTab === 'overview')) && dashboard)) && <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-5 gap-4">
            <div className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
              <p className="text-neutral-400 text-sm mb-1">Features</p>
              <p className="text-3xl font-bold text-white">{dashboard.features.enabled}/{dashboard.features.total}</p>
              <p className="text-xs text-success-main mt-1">enabled</p>
            </div>
            <div className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
              <p className="text-neutral-400 text-sm mb-1">AI Agents</p>
              <p className="text-3xl font-bold text-white">{dashboard.agents.enabled}/{dashboard.agents.total}</p>
              <p className="text-xs text-success-main mt-1">active</p>
            </div>
            <div className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
              <p className="text-neutral-400 text-sm mb-1">Suites</p>
              <p className="text-3xl font-bold text-white">{dashboard.suites.enabled}/{dashboard.suites.total}</p>
              <p className="text-xs text-success-main mt-1">enabled</p>
            </div>
            <div className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
              <p className="text-neutral-400 text-sm mb-1">Pricing Tiers</p>
              <p className="text-3xl font-bold text-white">{dashboard.pricing.active}/{dashboard.pricing.total}</p>
              <p className="text-xs text-success-main mt-1">active</p>
            </div>
            <div className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
              <p className="text-neutral-400 text-sm mb-1">Routes</p>
              <p className="text-3xl font-bold text-white">{dashboard.routes.total}</p>
              <p className="text-xs text-neutral-400 mt-1">{dashboard.routes.public} public</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
            <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
            <div className="grid grid-cols-3 gap-4">
              <button onClick={stryMutAct_9fa48("16329") ? () => undefined : (stryCov_9fa48("16329"), () => setActiveTab('features'))} className="p-4 bg-neutral-700/50 rounded-lg hover:bg-neutral-700 transition-colors text-left">
                <span className="text-2xl">⚡</span>
                <p className="font-medium text-white mt-2">Manage Features</p>
                <p className="text-sm text-neutral-400">Toggle services on/off</p>
              </button>
              <button onClick={stryMutAct_9fa48("16331") ? () => undefined : (stryCov_9fa48("16331"), () => setActiveTab('agents'))} className="p-4 bg-neutral-700/50 rounded-lg hover:bg-neutral-700 transition-colors text-left">
                <span className="text-2xl">🤖</span>
                <p className="font-medium text-white mt-2">Configure Agents</p>
                <p className="text-sm text-neutral-400">Enable/disable AI agents</p>
              </button>
              <button onClick={stryMutAct_9fa48("16333") ? () => undefined : (stryCov_9fa48("16333"), () => setActiveTab('pricing'))} className="p-4 bg-neutral-700/50 rounded-lg hover:bg-neutral-700 transition-colors text-left">
                <span className="text-2xl">💰</span>
                <p className="font-medium text-white mt-2">Update Pricing</p>
                <p className="text-sm text-neutral-400">Modify plan prices</p>
              </button>
            </div>
          </div>

          {/* Route Visibility */}
          <div className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
            <h2 className="text-lg font-semibold text-white mb-4">Route Visibility</h2>
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-400">{dashboard.routes.public}</p>
                <p className="text-sm text-neutral-400">🌐 Public</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-400">{dashboard.routes.authenticated}</p>
                <p className="text-sm text-neutral-400">🔒 Authenticated</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-neutral-400">{dashboard.routes.hidden}</p>
                <p className="text-sm text-neutral-400">👁️‍🗨️ Hidden</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-400">{stryMutAct_9fa48("16335") ? dashboard.routes.total - dashboard.routes.public - dashboard.routes.authenticated + dashboard.routes.hidden : (stryCov_9fa48("16335"), (stryMutAct_9fa48("16336") ? dashboard.routes.total - dashboard.routes.public + dashboard.routes.authenticated : (stryCov_9fa48("16336"), (stryMutAct_9fa48("16337") ? dashboard.routes.total + dashboard.routes.public : (stryCov_9fa48("16337"), dashboard.routes.total - dashboard.routes.public)) - dashboard.routes.authenticated)) - dashboard.routes.hidden)}</p>
                <p className="text-sm text-neutral-400">👑 Admin Only</p>
              </div>
            </div>
          </div>
        </div>)}

      {/* Features Tab */}
      {stryMutAct_9fa48("16340") ? activeTab === 'features' || <div className="space-y-4">
          {Object.entries(features.reduce((acc, f) => {
        if (!acc[f.category]) {
          acc[f.category] = [];
        }
        acc[f.category].push(f);
        return acc;
      }, {} as Record<string, Feature[]>)).map(([category, categoryFeatures]) => <div key={category} className="bg-neutral-800 rounded-xl border border-neutral-700 overflow-hidden">
              <div className="px-4 py-3 bg-neutral-900/50 border-b border-neutral-700">
                <h3 className="font-semibold text-white capitalize">{category.replace('-', ' ')}</h3>
              </div>
              <div className="divide-y divide-neutral-700">
                {categoryFeatures.map(feature => <div key={feature.id} className="px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-2xl">{feature.icon || '📦'}</span>
                      <div>
                        <p className="font-medium text-white">{feature.name}</p>
                        <p className="text-sm text-neutral-400">{feature.description}</p>
                        <div className="flex gap-2 mt-1">
                          {feature.routes.map(route => <code key={route} className="text-xs bg-neutral-700 px-1.5 py-0.5 rounded text-neutral-300">{route}</code>)}
                        </div>
                        {(feature.id === 'cendia-persona' || feature.id === 'cendia-autopilot') && <div className="mt-2">
                            <p className="text-xs text-neutral-500 mb-1">
                              {feature.id === 'cendia-persona' ? 'Who can create Persona twins?' : 'Who can manage Autopilot rules?'}
                            </p>
                            <div className="flex gap-2">
                              {['ADMIN', 'ANALYST', 'VIEWER'].map(role => {
                      const capability = feature.id === 'cendia-persona' ? 'persona.createTwin' : 'autopilot.manageRules';
                      const featureConfig: any = feature.config || {};
                      const permissions: Record<string, string[]> = featureConfig.permissions || {};
                      const allowedRoles: string[] = permissions[capability] || ['ADMIN'];
                      const isActive = allowedRoles.includes(role);
                      return <button key={role} onClick={() => handleToggleCapabilityRole(feature.id, capability, role)} className={cn('px-2 py-0.5 rounded-full text-xs border', isActive ? 'bg-primary-600 text-white border-primary-500' : 'bg-neutral-800 text-neutral-400 border-neutral-600')}>
                                    {role === 'ADMIN' ? 'Org Admin' : role === 'ANALYST' ? 'Analyst' : 'Viewer'}
                                  </button>;
                    })}
                            </div>
                          </div>}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <select value={feature.visibility} onChange={e => handleSetVisibility(feature.id, e.target.value)} className="bg-neutral-700 border border-neutral-600 rounded-lg px-3 py-1.5 text-sm text-white">
                        <option value="public">🌐 Public</option>
                        <option value="authenticated">🔒 Auth Only</option>
                        <option value="admin">👑 Admin</option>
                        <option value="hidden">👁️‍🗨️ Hidden</option>
                      </select>
                      <Toggle enabled={feature.enabled} onChange={() => handleToggleFeature(feature.id, feature.enabled)} />
                    </div>
                  </div>)}
              </div>
            </div>)}
        </div> : stryMutAct_9fa48("16339") ? false : stryMutAct_9fa48("16338") ? true : (stryCov_9fa48("16338", "16339", "16340"), (stryMutAct_9fa48("16342") ? activeTab !== 'features' : stryMutAct_9fa48("16341") ? true : (stryCov_9fa48("16341", "16342"), activeTab === 'features')) && <div className="space-y-4">
          {Object.entries(features.reduce((acc, f) => {
        if (stryMutAct_9fa48("16347") ? false : stryMutAct_9fa48("16346") ? true : stryMutAct_9fa48("16345") ? acc[f.category] : (stryCov_9fa48("16345", "16346", "16347"), !acc[f.category])) {
          acc[f.category] = stryMutAct_9fa48("16349") ? ["Stryker was here"] : (stryCov_9fa48("16349"), []);
        }
        acc[f.category].push(f);
        return acc;
      }, {} as Record<string, Feature[]>)).map(stryMutAct_9fa48("16350") ? () => undefined : (stryCov_9fa48("16350"), ([category, categoryFeatures]) => <div key={category} className="bg-neutral-800 rounded-xl border border-neutral-700 overflow-hidden">
              <div className="px-4 py-3 bg-neutral-900/50 border-b border-neutral-700">
                <h3 className="font-semibold text-white capitalize">{category.replace('-', ' ')}</h3>
              </div>
              <div className="divide-y divide-neutral-700">
                {categoryFeatures.map(stryMutAct_9fa48("16353") ? () => undefined : (stryCov_9fa48("16353"), feature => <div key={feature.id} className="px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-2xl">{stryMutAct_9fa48("16356") ? feature.icon && '📦' : stryMutAct_9fa48("16355") ? false : stryMutAct_9fa48("16354") ? true : (stryCov_9fa48("16354", "16355", "16356"), feature.icon || '📦')}</span>
                      <div>
                        <p className="font-medium text-white">{feature.name}</p>
                        <p className="text-sm text-neutral-400">{feature.description}</p>
                        <div className="flex gap-2 mt-1">
                          {feature.routes.map(stryMutAct_9fa48("16358") ? () => undefined : (stryCov_9fa48("16358"), route => <code key={route} className="text-xs bg-neutral-700 px-1.5 py-0.5 rounded text-neutral-300">{route}</code>))}
                        </div>
                        {stryMutAct_9fa48("16361") ? feature.id === 'cendia-persona' || feature.id === 'cendia-autopilot' || <div className="mt-2">
                            <p className="text-xs text-neutral-500 mb-1">
                              {feature.id === 'cendia-persona' ? 'Who can create Persona twins?' : 'Who can manage Autopilot rules?'}
                            </p>
                            <div className="flex gap-2">
                              {['ADMIN', 'ANALYST', 'VIEWER'].map(role => {
                      const capability = feature.id === 'cendia-persona' ? 'persona.createTwin' : 'autopilot.manageRules';
                      const featureConfig: any = feature.config || {};
                      const permissions: Record<string, string[]> = featureConfig.permissions || {};
                      const allowedRoles: string[] = permissions[capability] || ['ADMIN'];
                      const isActive = allowedRoles.includes(role);
                      return <button key={role} onClick={() => handleToggleCapabilityRole(feature.id, capability, role)} className={cn('px-2 py-0.5 rounded-full text-xs border', isActive ? 'bg-primary-600 text-white border-primary-500' : 'bg-neutral-800 text-neutral-400 border-neutral-600')}>
                                    {role === 'ADMIN' ? 'Org Admin' : role === 'ANALYST' ? 'Analyst' : 'Viewer'}
                                  </button>;
                    })}
                            </div>
                          </div> : stryMutAct_9fa48("16360") ? false : stryMutAct_9fa48("16359") ? true : (stryCov_9fa48("16359", "16360", "16361"), (stryMutAct_9fa48("16363") ? feature.id === 'cendia-persona' && feature.id === 'cendia-autopilot' : stryMutAct_9fa48("16362") ? true : (stryCov_9fa48("16362", "16363"), (stryMutAct_9fa48("16365") ? feature.id !== 'cendia-persona' : stryMutAct_9fa48("16364") ? false : (stryCov_9fa48("16364", "16365"), feature.id === 'cendia-persona')) || (stryMutAct_9fa48("16368") ? feature.id !== 'cendia-autopilot' : stryMutAct_9fa48("16367") ? false : (stryCov_9fa48("16367", "16368"), feature.id === 'cendia-autopilot')))) && <div className="mt-2">
                            <p className="text-xs text-neutral-500 mb-1">
                              {(stryMutAct_9fa48("16372") ? feature.id !== 'cendia-persona' : stryMutAct_9fa48("16371") ? false : stryMutAct_9fa48("16370") ? true : (stryCov_9fa48("16370", "16371", "16372"), feature.id === 'cendia-persona')) ? 'Who can create Persona twins?' : 'Who can manage Autopilot rules?'}
                            </p>
                            <div className="flex gap-2">
                              {(stryMutAct_9fa48("16376") ? [] : (stryCov_9fa48("16376"), ['ADMIN', 'ANALYST', 'VIEWER'])).map(role => {
                      const capability = (stryMutAct_9fa48("16383") ? feature.id !== 'cendia-persona' : stryMutAct_9fa48("16382") ? false : stryMutAct_9fa48("16381") ? true : (stryCov_9fa48("16381", "16382", "16383"), feature.id === 'cendia-persona')) ? 'persona.createTwin' : 'autopilot.manageRules';
                      const featureConfig: any = stryMutAct_9fa48("16389") ? feature.config && {} : stryMutAct_9fa48("16388") ? false : stryMutAct_9fa48("16387") ? true : (stryCov_9fa48("16387", "16388", "16389"), feature.config || {});
                      const permissions: Record<string, string[]> = stryMutAct_9fa48("16392") ? featureConfig.permissions && {} : stryMutAct_9fa48("16391") ? false : stryMutAct_9fa48("16390") ? true : (stryCov_9fa48("16390", "16391", "16392"), featureConfig.permissions || {});
                      const allowedRoles: string[] = stryMutAct_9fa48("16395") ? permissions[capability] && ['ADMIN'] : stryMutAct_9fa48("16394") ? false : stryMutAct_9fa48("16393") ? true : (stryCov_9fa48("16393", "16394", "16395"), permissions[capability] || (stryMutAct_9fa48("16396") ? [] : (stryCov_9fa48("16396"), ['ADMIN'])));
                      const isActive = allowedRoles.includes(role);
                      return <button key={role} onClick={stryMutAct_9fa48("16398") ? () => undefined : (stryCov_9fa48("16398"), () => handleToggleCapabilityRole(feature.id, capability, role))} className={cn('px-2 py-0.5 rounded-full text-xs border', isActive ? 'bg-primary-600 text-white border-primary-500' : 'bg-neutral-800 text-neutral-400 border-neutral-600')}>
                                    {(stryMutAct_9fa48("16404") ? role !== 'ADMIN' : stryMutAct_9fa48("16403") ? false : stryMutAct_9fa48("16402") ? true : (stryCov_9fa48("16402", "16403", "16404"), role === 'ADMIN')) ? 'Org Admin' : (stryMutAct_9fa48("16409") ? role !== 'ANALYST' : stryMutAct_9fa48("16408") ? false : stryMutAct_9fa48("16407") ? true : (stryCov_9fa48("16407", "16408", "16409"), role === 'ANALYST')) ? 'Analyst' : 'Viewer'}
                                  </button>;
                    })}
                            </div>
                          </div>)}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <select value={feature.visibility} onChange={stryMutAct_9fa48("16413") ? () => undefined : (stryCov_9fa48("16413"), e => handleSetVisibility(feature.id, e.target.value))} className="bg-neutral-700 border border-neutral-600 rounded-lg px-3 py-1.5 text-sm text-white">
                        <option value="public">🌐 Public</option>
                        <option value="authenticated">🔒 Auth Only</option>
                        <option value="admin">👑 Admin</option>
                        <option value="hidden">👁️‍🗨️ Hidden</option>
                      </select>
                      <Toggle enabled={feature.enabled} onChange={stryMutAct_9fa48("16414") ? () => undefined : (stryCov_9fa48("16414"), () => handleToggleFeature(feature.id, feature.enabled))} />
                    </div>
                  </div>))}
              </div>
            </div>))}
        </div>)}

      {/* Agents Tab */}
      {stryMutAct_9fa48("16417") ? activeTab === 'agents' || <div className="bg-neutral-800 rounded-xl border border-neutral-700 overflow-hidden">
          <div className="divide-y divide-neutral-700">
            {agents.map(agent => <div key={agent.id} className="px-4 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">{agent.icon || '🤖'}</span>
                    <div>
                      <p className="font-medium text-white">{agent.name}</p>
                      <p className="text-sm text-neutral-400">{agent.description}</p>
                      <div className="flex gap-2 mt-2">
                        <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">
                          {agent.model}
                        </span>
                        <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full">
                          Temp: {agent.temperature}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Toggle enabled={agent.enabled} onChange={() => handleToggleAgent(agent.id, agent.enabled)} />
                </div>
                <div className="mt-3 pl-16">
                  <p className="text-xs text-neutral-500 mb-1">Capabilities:</p>
                  <div className="flex flex-wrap gap-1">
                    {agent.capabilities.map(cap => <span key={cap} className="text-xs bg-neutral-700 text-neutral-300 px-2 py-0.5 rounded">
                        {cap}
                      </span>)}
                  </div>
                </div>
              </div>)}
          </div>
        </div> : stryMutAct_9fa48("16416") ? false : stryMutAct_9fa48("16415") ? true : (stryCov_9fa48("16415", "16416", "16417"), (stryMutAct_9fa48("16419") ? activeTab !== 'agents' : stryMutAct_9fa48("16418") ? true : (stryCov_9fa48("16418", "16419"), activeTab === 'agents')) && <div className="bg-neutral-800 rounded-xl border border-neutral-700 overflow-hidden">
          <div className="divide-y divide-neutral-700">
            {agents.map(stryMutAct_9fa48("16421") ? () => undefined : (stryCov_9fa48("16421"), agent => <div key={agent.id} className="px-4 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">{stryMutAct_9fa48("16424") ? agent.icon && '🤖' : stryMutAct_9fa48("16423") ? false : stryMutAct_9fa48("16422") ? true : (stryCov_9fa48("16422", "16423", "16424"), agent.icon || '🤖')}</span>
                    <div>
                      <p className="font-medium text-white">{agent.name}</p>
                      <p className="text-sm text-neutral-400">{agent.description}</p>
                      <div className="flex gap-2 mt-2">
                        <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">
                          {agent.model}
                        </span>
                        <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full">
                          Temp: {agent.temperature}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Toggle enabled={agent.enabled} onChange={stryMutAct_9fa48("16426") ? () => undefined : (stryCov_9fa48("16426"), () => handleToggleAgent(agent.id, agent.enabled))} />
                </div>
                <div className="mt-3 pl-16">
                  <p className="text-xs text-neutral-500 mb-1">Capabilities:</p>
                  <div className="flex flex-wrap gap-1">
                    {agent.capabilities.map(stryMutAct_9fa48("16427") ? () => undefined : (stryCov_9fa48("16427"), cap => <span key={cap} className="text-xs bg-neutral-700 text-neutral-300 px-2 py-0.5 rounded">
                        {cap}
                      </span>))}
                  </div>
                </div>
              </div>))}
          </div>
        </div>)}

      {/* Suites Tab */}
      {stryMutAct_9fa48("16430") ? activeTab === 'suites' || <div className="space-y-4">
          {suites.map(suite => <div key={suite.id} className="bg-neutral-800 rounded-xl border border-neutral-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <span className="text-3xl">{suite.icon || '📦'}</span>
                  <div>
                    <p className="font-semibold text-white text-lg">{suite.name}</p>
                    <p className="text-neutral-400">{suite.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={cn('px-3 py-1 rounded-full text-sm font-medium', suite.enabled ? 'bg-success-main/20 text-success-main' : 'bg-neutral-600/20 text-neutral-400')}>
                    {suite.enabled ? 'Enabled' : 'Disabled'}
                  </span>
                  <Toggle enabled={suite.enabled} onChange={() => handleToggleSuite(suite.id, suite.enabled)} />
                </div>
              </div>
              <div className="border-t border-neutral-700 pt-4">
                <p className="text-sm text-neutral-500 mb-2">Included Features ({suite.features.length}):</p>
                <div className="flex flex-wrap gap-2">
                  {suite.features.map(featureId => {
              const feature = features.find(f => f.id === featureId);
              return <span key={featureId} className={cn('px-3 py-1 rounded-lg text-sm', feature?.enabled ? 'bg-success-main/10 text-success-main border border-success-main/30' : 'bg-neutral-700 text-neutral-400')}>
                        {feature?.icon} {feature?.name || featureId}
                      </span>;
            })}
                </div>
              </div>
            </div>)}
        </div> : stryMutAct_9fa48("16429") ? false : stryMutAct_9fa48("16428") ? true : (stryCov_9fa48("16428", "16429", "16430"), (stryMutAct_9fa48("16432") ? activeTab !== 'suites' : stryMutAct_9fa48("16431") ? true : (stryCov_9fa48("16431", "16432"), activeTab === 'suites')) && <div className="space-y-4">
          {suites.map(stryMutAct_9fa48("16434") ? () => undefined : (stryCov_9fa48("16434"), suite => <div key={suite.id} className="bg-neutral-800 rounded-xl border border-neutral-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <span className="text-3xl">{stryMutAct_9fa48("16437") ? suite.icon && '📦' : stryMutAct_9fa48("16436") ? false : stryMutAct_9fa48("16435") ? true : (stryCov_9fa48("16435", "16436", "16437"), suite.icon || '📦')}</span>
                  <div>
                    <p className="font-semibold text-white text-lg">{suite.name}</p>
                    <p className="text-neutral-400">{suite.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={cn('px-3 py-1 rounded-full text-sm font-medium', suite.enabled ? 'bg-success-main/20 text-success-main' : 'bg-neutral-600/20 text-neutral-400')}>
                    {suite.enabled ? 'Enabled' : 'Disabled'}
                  </span>
                  <Toggle enabled={suite.enabled} onChange={stryMutAct_9fa48("16444") ? () => undefined : (stryCov_9fa48("16444"), () => handleToggleSuite(suite.id, suite.enabled))} />
                </div>
              </div>
              <div className="border-t border-neutral-700 pt-4">
                <p className="text-sm text-neutral-500 mb-2">Included Features ({suite.features.length}):</p>
                <div className="flex flex-wrap gap-2">
                  {suite.features.map(featureId => {
              const feature = features.find(stryMutAct_9fa48("16446") ? () => undefined : (stryCov_9fa48("16446"), f => stryMutAct_9fa48("16449") ? f.id !== featureId : stryMutAct_9fa48("16448") ? false : stryMutAct_9fa48("16447") ? true : (stryCov_9fa48("16447", "16448", "16449"), f.id === featureId)));
              return <span key={featureId} className={cn('px-3 py-1 rounded-lg text-sm', (stryMutAct_9fa48("16451") ? feature.enabled : (stryCov_9fa48("16451"), feature?.enabled)) ? 'bg-success-main/10 text-success-main border border-success-main/30' : 'bg-neutral-700 text-neutral-400')}>
                        {stryMutAct_9fa48("16454") ? feature.icon : (stryCov_9fa48("16454"), feature?.icon)} {stryMutAct_9fa48("16457") ? feature?.name && featureId : stryMutAct_9fa48("16456") ? false : stryMutAct_9fa48("16455") ? true : (stryCov_9fa48("16455", "16456", "16457"), (stryMutAct_9fa48("16458") ? feature.name : (stryCov_9fa48("16458"), feature?.name)) || featureId)}
                      </span>;
            })}
                </div>
              </div>
            </div>))}
        </div>)}

      {/* Pricing Tab */}
      {stryMutAct_9fa48("16461") ? activeTab === 'pricing' || <div className="grid grid-cols-4 gap-4">
          {pricing.map(tier => <div key={tier.id} className={cn('bg-neutral-800 rounded-xl border p-6', tier.visible ? 'border-neutral-700' : 'border-neutral-700/50 opacity-60')}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">{tier.name}</h3>
                <Toggle enabled={tier.visible} onChange={async () => {
            await updatePricing(tier.id, {
              visible: !tier.visible
            });
            setPricing(pricing.map(p => p.id === tier.id ? {
              ...p,
              visible: !tier.visible
            } : p));
          }} />
              </div>
              
              {editingPrice === tier.id ? <div className="mb-4">
                  <input type="number" defaultValue={tier.monthlyPrice} className="w-full bg-neutral-700 border border-neutral-600 rounded-lg px-3 py-2 text-white text-2xl font-bold" onBlur={e => handleUpdatePrice(tier.id, parseInt(e.target.value))} onKeyDown={e => {
            if (e.key === 'Enter') {
              handleUpdatePrice(tier.id, parseInt((e.target as HTMLInputElement).value));
            }
          }} autoFocus />
                </div> : <div className="mb-4 cursor-pointer hover:bg-neutral-700/50 rounded-lg p-2 -ml-2" onClick={() => setEditingPrice(tier.id)}>
                  <span className="text-3xl font-bold text-white">${tier.monthlyPrice}</span>
                  <span className="text-neutral-400">/mo</span>
                  <p className="text-sm text-neutral-500">${tier.annualPrice}/year</p>
                </div>}
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-neutral-400">
                  <span>Users</span>
                  <span className="text-white">{tier.userLimit === -1 ? 'Unlimited' : tier.userLimit}</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Agents</span>
                  <span className="text-white">{tier.agentLimit === -1 ? 'Unlimited' : tier.agentLimit}</span>
                </div>
              </div>
            </div>)}
        </div> : stryMutAct_9fa48("16460") ? false : stryMutAct_9fa48("16459") ? true : (stryCov_9fa48("16459", "16460", "16461"), (stryMutAct_9fa48("16463") ? activeTab !== 'pricing' : stryMutAct_9fa48("16462") ? true : (stryCov_9fa48("16462", "16463"), activeTab === 'pricing')) && <div className="grid grid-cols-4 gap-4">
          {pricing.map(stryMutAct_9fa48("16465") ? () => undefined : (stryCov_9fa48("16465"), tier => <div key={tier.id} className={cn('bg-neutral-800 rounded-xl border p-6', tier.visible ? 'border-neutral-700' : 'border-neutral-700/50 opacity-60')}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">{tier.name}</h3>
                <Toggle enabled={tier.visible} onChange={async () => {
            await updatePricing(tier.id, stryMutAct_9fa48("16470") ? {} : (stryCov_9fa48("16470"), {
              visible: stryMutAct_9fa48("16471") ? tier.visible : (stryCov_9fa48("16471"), !tier.visible)
            }));
            setPricing(pricing.map(stryMutAct_9fa48("16472") ? () => undefined : (stryCov_9fa48("16472"), p => (stryMutAct_9fa48("16475") ? p.id !== tier.id : stryMutAct_9fa48("16474") ? false : stryMutAct_9fa48("16473") ? true : (stryCov_9fa48("16473", "16474", "16475"), p.id === tier.id)) ? stryMutAct_9fa48("16476") ? {} : (stryCov_9fa48("16476"), {
              ...p,
              visible: stryMutAct_9fa48("16477") ? tier.visible : (stryCov_9fa48("16477"), !tier.visible)
            }) : p)));
          }} />
              </div>
              
              {(stryMutAct_9fa48("16480") ? editingPrice !== tier.id : stryMutAct_9fa48("16479") ? false : stryMutAct_9fa48("16478") ? true : (stryCov_9fa48("16478", "16479", "16480"), editingPrice === tier.id)) ? <div className="mb-4">
                  <input type="number" defaultValue={tier.monthlyPrice} className="w-full bg-neutral-700 border border-neutral-600 rounded-lg px-3 py-2 text-white text-2xl font-bold" onBlur={stryMutAct_9fa48("16481") ? () => undefined : (stryCov_9fa48("16481"), e => handleUpdatePrice(tier.id, parseInt(e.target.value)))} onKeyDown={e => {
            if (stryMutAct_9fa48("16485") ? e.key !== 'Enter' : stryMutAct_9fa48("16484") ? false : stryMutAct_9fa48("16483") ? true : (stryCov_9fa48("16483", "16484", "16485"), e.key === 'Enter')) {
              handleUpdatePrice(tier.id, parseInt((e.target as HTMLInputElement).value));
            }
          }} autoFocus />
                </div> : <div className="mb-4 cursor-pointer hover:bg-neutral-700/50 rounded-lg p-2 -ml-2" onClick={stryMutAct_9fa48("16488") ? () => undefined : (stryCov_9fa48("16488"), () => setEditingPrice(tier.id))}>
                  <span className="text-3xl font-bold text-white">${tier.monthlyPrice}</span>
                  <span className="text-neutral-400">/mo</span>
                  <p className="text-sm text-neutral-500">${tier.annualPrice}/year</p>
                </div>}
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-neutral-400">
                  <span>Users</span>
                  <span className="text-white">{(stryMutAct_9fa48("16491") ? tier.userLimit !== -1 : stryMutAct_9fa48("16490") ? false : stryMutAct_9fa48("16489") ? true : (stryCov_9fa48("16489", "16490", "16491"), tier.userLimit === (stryMutAct_9fa48("16492") ? +1 : (stryCov_9fa48("16492"), -1)))) ? 'Unlimited' : tier.userLimit}</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Agents</span>
                  <span className="text-white">{(stryMutAct_9fa48("16496") ? tier.agentLimit !== -1 : stryMutAct_9fa48("16495") ? false : stryMutAct_9fa48("16494") ? true : (stryCov_9fa48("16494", "16495", "16496"), tier.agentLimit === (stryMutAct_9fa48("16497") ? +1 : (stryCov_9fa48("16497"), -1)))) ? 'Unlimited' : tier.agentLimit}</span>
                </div>
              </div>
            </div>))}
        </div>)}
    </div>;
};
export default ControlCenterPage;