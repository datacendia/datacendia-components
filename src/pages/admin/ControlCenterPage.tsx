// =============================================================================
// ADMIN CONTROL CENTER - Master Platform Configuration
// Toggle services, agents, suites, visibility, and pricing from one place
// =============================================================================

import React, { useState, useEffect } from 'react';
import { cn } from '../../../lib/utils';

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
  features: { total: number; enabled: number; disabled: number; byCategory: Record<string, number> };
  agents: { total: number; enabled: number; disabled: number };
  suites: { total: number; enabled: number };
  pricing: { total: number; active: number };
  routes: { total: number; public: number; authenticated: number; hidden: number };
}

// =============================================================================
// API CALLS
// =============================================================================

const API_BASE = '/api/v1/admin';

async function fetchControlDashboard(): Promise<ControlDashboard> {
  const res = await fetch(`${API_BASE}/control/dashboard`);
  if (!res.ok) throw new Error('Failed to fetch dashboard');
  return res.json();
}

async function fetchFeatures(): Promise<Feature[]> {
  const res = await fetch(`${API_BASE}/features`);
  if (!res.ok) throw new Error('Failed to fetch features');
  const data = await res.json();
  return data.features;
}

async function fetchAgents(): Promise<Agent[]> {
  const res = await fetch(`${API_BASE}/agents`);
  if (!res.ok) throw new Error('Failed to fetch agents');
  const data = await res.json();
  return data.agents;
}

async function fetchSuites(): Promise<Suite[]> {
  const res = await fetch(`${API_BASE}/suites`);
  if (!res.ok) throw new Error('Failed to fetch suites');
  const data = await res.json();
  return data.suites;
}

async function fetchPricing(): Promise<PricingTier[]> {
  const res = await fetch(`${API_BASE}/pricing?includeHidden=true`);
  if (!res.ok) throw new Error('Failed to fetch pricing');
  const data = await res.json();
  return data.pricing;
}

async function toggleFeature(id: string, enabled: boolean): Promise<Feature> {
  const res = await fetch(`${API_BASE}/features/${id}/toggle`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ enabled })
  });
  if (!res.ok) throw new Error('Failed to toggle feature');
  return res.json();
}

async function setVisibility(id: string, visibility: string): Promise<Feature> {
  const res = await fetch(`${API_BASE}/features/${id}/visibility`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ visibility })
  });
  if (!res.ok) throw new Error('Failed to set visibility');
  return res.json();
}

async function toggleAgent(id: string, enabled: boolean): Promise<Agent> {
  const res = await fetch(`${API_BASE}/agents/${id}/toggle`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ enabled })
  });
  if (!res.ok) throw new Error('Failed to toggle agent');
  return res.json();
}

async function toggleSuite(id: string, enabled: boolean): Promise<Suite> {
  const res = await fetch(`${API_BASE}/suites/${id}/toggle`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ enabled })
  });
  if (!res.ok) throw new Error('Failed to toggle suite');
  return res.json();
}

async function updatePricing(id: string, updates: Partial<PricingTier>): Promise<PricingTier> {
  const res = await fetch(`${API_BASE}/pricing/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  });
  if (!res.ok) throw new Error('Failed to update pricing');
  return res.json();
}

// =============================================================================
// COMPONENTS
// =============================================================================

const Toggle: React.FC<{ enabled: boolean; onChange: () => void; disabled?: boolean }> = ({ enabled, onChange, disabled }) => (
  <button
    onClick={onChange}
    disabled={disabled}
    className={cn(
      'relative w-12 h-6 rounded-full transition-colors',
      enabled ? 'bg-success-main' : 'bg-neutral-600',
      disabled && 'opacity-50 cursor-not-allowed'
    )}
  >
    <span className={cn(
      'absolute top-1 w-4 h-4 bg-white rounded-full transition-all',
      enabled ? 'left-7' : 'left-1'
    )} />
  </button>
);

const VisibilityBadge: React.FC<{ visibility: string; onClick?: () => void }> = ({ visibility, onClick }) => {
  const colors = {
    public: 'bg-green-500/20 text-green-400',
    authenticated: 'bg-blue-500/20 text-blue-400',
    admin: 'bg-purple-500/20 text-purple-400',
    hidden: 'bg-neutral-500/20 text-neutral-400'
  };
  const icons = {
    public: '🌐',
    authenticated: '🔒',
    admin: '👑',
    hidden: '👁️‍🗨️'
  };
  
  return (
    <button
      onClick={onClick}
      className={cn('px-2 py-1 rounded-full text-xs font-medium', colors[visibility as keyof typeof colors])}
    >
      {icons[visibility as keyof typeof icons]} {visibility}
    </button>
  );
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const ControlCenterPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'features' | 'agents' | 'suites' | 'pricing'>('overview');
  const [dashboard, setDashboard] = useState<ControlDashboard | null>(null);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [suites, setSuites] = useState<Suite[]>([]);
  const [pricing, setPricing] = useState<PricingTier[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPrice, setEditingPrice] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [dashboardData, featuresData, agentsData, suitesData, pricingData] = await Promise.all([
        fetchControlDashboard(),
        fetchFeatures(),
        fetchAgents(),
        fetchSuites(),
        fetchPricing()
      ]);
      setDashboard(dashboardData);
      setFeatures(featuresData);
      setAgents(agentsData);
      setSuites(suitesData);
      setPricing(pricingData);
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFeature = async (id: string, currentEnabled: boolean) => {
    try {
      await toggleFeature(id, !currentEnabled);
      setFeatures(features.map(f => f.id === id ? { ...f, enabled: !currentEnabled } : f));
      loadData(); // Refresh dashboard
    } catch (err) {
      console.error('Failed to toggle feature:', err);
    }
  };

  const handleSetVisibility = async (id: string, visibility: string) => {
    try {
      await setVisibility(id, visibility);
      setFeatures(features.map(f => f.id === id ? { ...f, visibility: visibility as any } : f));
    } catch (err) {
      console.error('Failed to set visibility:', err);
    }
  };

  const handleToggleAgent = async (id: string, currentEnabled: boolean) => {
    try {
      await toggleAgent(id, !currentEnabled);
      setAgents(agents.map(a => a.id === id ? { ...a, enabled: !currentEnabled } : a));
      loadData();
    } catch (err) {
      console.error('Failed to toggle agent:', err);
    }
  };

  const handleToggleSuite = async (id: string, currentEnabled: boolean) => {
    try {
      await toggleSuite(id, !currentEnabled);
      loadData(); // Full refresh since suite toggle affects features
    } catch (err) {
      console.error('Failed to toggle suite:', err);
    }
  };

  const handleUpdatePrice = async (id: string, monthlyPrice: number) => {
    try {
      await updatePricing(id, { monthlyPrice, annualPrice: monthlyPrice * 10 });
      setPricing(pricing.map(p => p.id === id ? { ...p, monthlyPrice, annualPrice: monthlyPrice * 10 } : p));
      setEditingPrice(null);
    } catch (err) {
      console.error('Failed to update price:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Control Center</h1>
        <p className="text-neutral-400">Manage all platform features, agents, suites, and pricing</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {(['overview', 'features', 'agents', 'suites', 'pricing'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'px-4 py-2 rounded-lg font-medium capitalize transition-colors',
              activeTab === tab 
                ? 'bg-primary-600 text-white' 
                : 'bg-neutral-800 text-neutral-400 hover:text-white'
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && dashboard && (
        <div className="space-y-6">
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
              <button 
                onClick={() => setActiveTab('features')}
                className="p-4 bg-neutral-700/50 rounded-lg hover:bg-neutral-700 transition-colors text-left"
              >
                <span className="text-2xl">⚡</span>
                <p className="font-medium text-white mt-2">Manage Features</p>
                <p className="text-sm text-neutral-400">Toggle services on/off</p>
              </button>
              <button 
                onClick={() => setActiveTab('agents')}
                className="p-4 bg-neutral-700/50 rounded-lg hover:bg-neutral-700 transition-colors text-left"
              >
                <span className="text-2xl">🤖</span>
                <p className="font-medium text-white mt-2">Configure Agents</p>
                <p className="text-sm text-neutral-400">Enable/disable AI agents</p>
              </button>
              <button 
                onClick={() => setActiveTab('pricing')}
                className="p-4 bg-neutral-700/50 rounded-lg hover:bg-neutral-700 transition-colors text-left"
              >
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
        </div>
      )}

      {/* Features Tab */}
      {activeTab === 'features' && (
        <div className="space-y-4">
          {Object.entries(
            features.reduce((acc, f) => {
              if (!acc[f.category]) acc[f.category] = [];
              acc[f.category].push(f);
              return acc;
            }, {} as Record<string, Feature[]>)
          ).map(([category, categoryFeatures]) => (
            <div key={category} className="bg-neutral-800 rounded-xl border border-neutral-700 overflow-hidden">
              <div className="px-4 py-3 bg-neutral-900/50 border-b border-neutral-700">
                <h3 className="font-semibold text-white capitalize">{category.replace('-', ' ')}</h3>
              </div>
              <div className="divide-y divide-neutral-700">
                {categoryFeatures.map(feature => (
                  <div key={feature.id} className="px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-2xl">{feature.icon || '📦'}</span>
                      <div>
                        <p className="font-medium text-white">{feature.name}</p>
                        <p className="text-sm text-neutral-400">{feature.description}</p>
                        <div className="flex gap-2 mt-1">
                          {feature.routes.map(route => (
                            <code key={route} className="text-xs bg-neutral-700 px-1.5 py-0.5 rounded text-neutral-300">{route}</code>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <select
                        value={feature.visibility}
                        onChange={(e) => handleSetVisibility(feature.id, e.target.value)}
                        className="bg-neutral-700 border border-neutral-600 rounded-lg px-3 py-1.5 text-sm text-white"
                      >
                        <option value="public">🌐 Public</option>
                        <option value="authenticated">🔒 Auth Only</option>
                        <option value="admin">👑 Admin</option>
                        <option value="hidden">👁️‍🗨️ Hidden</option>
                      </select>
                      <Toggle 
                        enabled={feature.enabled} 
                        onChange={() => handleToggleFeature(feature.id, feature.enabled)} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Agents Tab */}
      {activeTab === 'agents' && (
        <div className="bg-neutral-800 rounded-xl border border-neutral-700 overflow-hidden">
          <div className="divide-y divide-neutral-700">
            {agents.map(agent => (
              <div key={agent.id} className="px-4 py-4">
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
                  <Toggle 
                    enabled={agent.enabled} 
                    onChange={() => handleToggleAgent(agent.id, agent.enabled)} 
                  />
                </div>
                <div className="mt-3 pl-16">
                  <p className="text-xs text-neutral-500 mb-1">Capabilities:</p>
                  <div className="flex flex-wrap gap-1">
                    {agent.capabilities.map(cap => (
                      <span key={cap} className="text-xs bg-neutral-700 text-neutral-300 px-2 py-0.5 rounded">
                        {cap}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Suites Tab */}
      {activeTab === 'suites' && (
        <div className="space-y-4">
          {suites.map(suite => (
            <div key={suite.id} className="bg-neutral-800 rounded-xl border border-neutral-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <span className="text-3xl">{suite.icon || '📦'}</span>
                  <div>
                    <p className="font-semibold text-white text-lg">{suite.name}</p>
                    <p className="text-neutral-400">{suite.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={cn(
                    'px-3 py-1 rounded-full text-sm font-medium',
                    suite.enabled ? 'bg-success-main/20 text-success-main' : 'bg-neutral-600/20 text-neutral-400'
                  )}>
                    {suite.enabled ? 'Enabled' : 'Disabled'}
                  </span>
                  <Toggle 
                    enabled={suite.enabled} 
                    onChange={() => handleToggleSuite(suite.id, suite.enabled)} 
                  />
                </div>
              </div>
              <div className="border-t border-neutral-700 pt-4">
                <p className="text-sm text-neutral-500 mb-2">Included Features ({suite.features.length}):</p>
                <div className="flex flex-wrap gap-2">
                  {suite.features.map(featureId => {
                    const feature = features.find(f => f.id === featureId);
                    return (
                      <span 
                        key={featureId} 
                        className={cn(
                          'px-3 py-1 rounded-lg text-sm',
                          feature?.enabled 
                            ? 'bg-success-main/10 text-success-main border border-success-main/30' 
                            : 'bg-neutral-700 text-neutral-400'
                        )}
                      >
                        {feature?.icon} {feature?.name || featureId}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pricing Tab */}
      {activeTab === 'pricing' && (
        <div className="grid grid-cols-4 gap-4">
          {pricing.map(tier => (
            <div 
              key={tier.id} 
              className={cn(
                'bg-neutral-800 rounded-xl border p-6',
                tier.visible ? 'border-neutral-700' : 'border-neutral-700/50 opacity-60'
              )}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">{tier.name}</h3>
                <Toggle 
                  enabled={tier.visible} 
                  onChange={async () => {
                    await updatePricing(tier.id, { visible: !tier.visible });
                    setPricing(pricing.map(p => p.id === tier.id ? { ...p, visible: !tier.visible } : p));
                  }} 
                />
              </div>
              
              {editingPrice === tier.id ? (
                <div className="mb-4">
                  <input
                    type="number"
                    defaultValue={tier.monthlyPrice}
                    className="w-full bg-neutral-700 border border-neutral-600 rounded-lg px-3 py-2 text-white text-2xl font-bold"
                    onBlur={(e) => handleUpdatePrice(tier.id, parseInt(e.target.value))}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleUpdatePrice(tier.id, parseInt((e.target as HTMLInputElement).value));
                      }
                    }}
                    autoFocus
                  />
                </div>
              ) : (
                <div 
                  className="mb-4 cursor-pointer hover:bg-neutral-700/50 rounded-lg p-2 -ml-2"
                  onClick={() => setEditingPrice(tier.id)}
                >
                  <span className="text-3xl font-bold text-white">${tier.monthlyPrice}</span>
                  <span className="text-neutral-400">/mo</span>
                  <p className="text-sm text-neutral-500">${tier.annualPrice}/year</p>
                </div>
              )}
              
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ControlCenterPage;
