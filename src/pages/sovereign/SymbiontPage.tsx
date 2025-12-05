/**
 * CendiaSymbiont™ - Partnership & Ecosystem Engine
 * "The ecosystem strategist."
 */

import React, { useState, useEffect } from 'react';
import apiClient from '../../lib/api/client';
import { Network, Building2, Link2, TrendingUp, Target, Users, Zap } from 'lucide-react';

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
}

interface Dashboard {
  totalEntities: number;
  entitiesByType: Record<string, number>;
  activeOpportunities: number;
  healthyRelationships: number;
  avgRelationshipHealth: number;
}

export const SymbiontPage: React.FC = () => {
  const [entities, setEntities] = useState<Entity[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddEntity, setShowAddEntity] = useState(false);
  const [newEntity, setNewEntity] = useState({ name: '', entityType: 'PARTNER', domain: '', description: '' });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [entRes, oppRes, dashRes] = await Promise.all([
        apiClient.api.get<{ data: Entity[] }>('/symbiont/entities'),
        apiClient.api.get<{ data: Opportunity[] }>('/symbiont/opportunities'),
        apiClient.api.get<{ data: Dashboard }>('/symbiont/dashboard'),
      ]);
      if (entRes.success) setEntities((entRes.data as any)?.data || entRes.data || []);
      if (oppRes.success) setOpportunities((oppRes.data as any)?.data || oppRes.data || []);
      if (dashRes.success) setDashboard((dashRes.data as any)?.data || dashRes.data || null);
    } catch (error) {
      console.error('Failed to load Symbiont data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addEntity = async () => {
    try {
      await apiClient.api.post('/symbiont/entities', newEntity);
      setShowAddEntity(false);
      setNewEntity({ name: '', entityType: 'PARTNER', domain: '', description: '' });
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
      case 'PARTNER': return <Link2 className="w-4 h-4 text-emerald-400" />;
      case 'VENDOR': return <Building2 className="w-4 h-4 text-blue-400" />;
      case 'COMPETITOR': return <Target className="w-4 h-4 text-red-400" />;
      case 'CUSTOMER': return <Users className="w-4 h-4 text-purple-400" />;
      default: return <Network className="w-4 h-4 text-slate-400" />;
    }
  };

  if (isLoading) {
    return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Loading Symbiont...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Network className="w-10 h-10 text-purple-400" />
          <div>
            <h1 className="text-3xl font-bold">CendiaSymbiont™</h1>
            <p className="text-slate-400">Partnership & Ecosystem Engine - "The ecosystem strategist."</p>
          </div>
        </div>
      </div>

      {/* Dashboard Stats */}
      {dashboard && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center gap-2 text-slate-400 text-sm"><Building2 className="w-4 h-4" /> Entities</div>
            <div className="text-3xl font-bold">{dashboard.totalEntities}</div>
          </div>
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center gap-2 text-slate-400 text-sm"><Zap className="w-4 h-4" /> Active Opportunities</div>
            <div className="text-3xl font-bold text-purple-400">{dashboard.activeOpportunities}</div>
          </div>
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center gap-2 text-slate-400 text-sm"><Link2 className="w-4 h-4" /> Healthy Relations</div>
            <div className="text-3xl font-bold text-emerald-400">{dashboard.healthyRelationships}</div>
          </div>
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center gap-2 text-slate-400 text-sm"><TrendingUp className="w-4 h-4" /> Avg Health</div>
            <div className="text-3xl font-bold">{dashboard.avgRelationshipHealth}%</div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Entities */}
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Ecosystem Entities</h2>
            <button onClick={() => setShowAddEntity(true)} className="px-3 py-1 bg-purple-600 hover:bg-purple-500 rounded text-sm">+ Add Entity</button>
          </div>
          {entities.length === 0 ? (
            <div className="text-center py-8 text-slate-500">No entities mapped. Add partners, vendors, or competitors.</div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {entities.map(e => (
                <div key={e.id} className="p-4 bg-slate-700/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    {getTypeIcon(e.entityType)}
                    <span className="font-medium">{e.name}</span>
                    <span className="text-xs px-2 py-0.5 bg-slate-600 rounded">{e.entityType}</span>
                  </div>
                  {e.domain && <div className="text-sm text-slate-400 mb-2">{e.domain}</div>}
                  <div className="flex items-center gap-4 text-xs text-slate-500 mb-2">
                    <span>Health: {e.financialHealth || 50}%</span>
                    <span>Reputation: {e.reputationScore || 50}%</span>
                  </div>
                  <button onClick={() => detectOpportunities(e.id)} className="w-full px-3 py-1 bg-blue-600 hover:bg-blue-500 rounded text-xs">
                    Detect Opportunities
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Opportunities */}
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h2 className="text-xl font-semibold mb-4">Detected Opportunities</h2>
          {opportunities.length === 0 ? (
            <div className="text-center py-8 text-slate-500">No opportunities detected. Add entities and run detection.</div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {opportunities.map(o => (
                <div key={o.id} className="p-4 bg-slate-700/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs px-2 py-0.5 bg-purple-900/50 text-purple-300 rounded">{o.opportunityType.replace(/_/g, ' ')}</span>
                    <span className="text-xs px-2 py-0.5 bg-slate-600 rounded">{o.status}</span>
                  </div>
                  <div className="font-medium mb-1">{o.title}</div>
                  <div className="text-sm text-slate-400 mb-2">{o.description?.substring(0, 80)}...</div>
                  <div className="flex items-center gap-4 text-xs">
                    <span className="text-emerald-400">Fit: {o.strategicFit}%</span>
                    <span className="text-red-400">Risk: {o.riskScore}%</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Entity Modal */}
      {showAddEntity && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-lg p-6 w-full max-w-md border border-slate-700">
            <h3 className="text-xl font-semibold mb-4">Add Ecosystem Entity</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Type</label>
                <select value={newEntity.entityType} onChange={e => setNewEntity({...newEntity, entityType: e.target.value})} className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2">
                  <option value="PARTNER">Partner</option>
                  <option value="VENDOR">Vendor</option>
                  <option value="COMPETITOR">Competitor</option>
                  <option value="CUSTOMER">Customer</option>
                  <option value="INVESTOR">Investor</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Name</label>
                <input value={newEntity.name} onChange={e => setNewEntity({...newEntity, name: e.target.value})} className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2" placeholder="Organization name" />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Domain/Industry</label>
                <input value={newEntity.domain} onChange={e => setNewEntity({...newEntity, domain: e.target.value})} className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2" placeholder="e.g., Technology, Finance" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowAddEntity(false)} className="flex-1 px-4 py-2 bg-slate-600 hover:bg-slate-500 rounded">Cancel</button>
              <button onClick={addEntity} className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded">Add Entity</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SymbiontPage;
