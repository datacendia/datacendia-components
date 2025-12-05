/**
 * CendiaVox™ - Stakeholder Voice Assembly
 * "Who speaks for those not in the room?"
 */

import React, { useState, useEffect } from 'react';
import apiClient from '../../lib/api/client';
import { Users, MessageSquare, Vote, AlertTriangle, Scale, Heart, Leaf, Clock } from 'lucide-react';

interface Stakeholder {
  id: string;
  stakeholderType: string;
  name: string;
  description: string;
  voiceWeight: number;
  vetoRights: string[];
  isActive: boolean;
}

interface Dashboard {
  activeStakeholders: number;
  signalsLast7Days: number;
  sentimentBreakdown: Record<string, number>;
  vetoesLast30Days: number;
  totalAssemblies: number;
}

export const VoxPage: React.FC = () => {
  const [stakeholders, setStakeholders] = useState<Stakeholder[]>([]);
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitializing, setIsInitializing] = useState(false);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [stkRes, dashRes] = await Promise.all([
        apiClient.api.get<{ data: Stakeholder[] }>('/vox/stakeholders'),
        apiClient.api.get<{ data: Dashboard }>('/vox/dashboard'),
      ]);
      if (stkRes.success) setStakeholders((stkRes.data as any)?.data || stkRes.data || []);
      if (dashRes.success) setDashboard((dashRes.data as any)?.data || dashRes.data || null);
    } catch (error) {
      console.error('Failed to load Vox data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const initializeStakeholders = async () => {
    setIsInitializing(true);
    try {
      await apiClient.api.post('/vox/stakeholders/initialize');
      await loadData();
    } catch (error) {
      console.error('Initialize failed:', error);
    } finally {
      setIsInitializing(false);
    }
  };

  const getStakeholderIcon = (type: string) => {
    switch (type) {
      case 'EMPLOYEES': return <Users className="w-5 h-5 text-blue-400" />;
      case 'CUSTOMERS': return <Heart className="w-5 h-5 text-pink-400" />;
      case 'COMMUNITY': return <Users className="w-5 h-5 text-amber-400" />;
      case 'ENVIRONMENT': return <Leaf className="w-5 h-5 text-emerald-400" />;
      case 'FUTURE_GENERATIONS': return <Clock className="w-5 h-5 text-purple-400" />;
      case 'SHAREHOLDERS': return <Scale className="w-5 h-5 text-cyan-400" />;
      default: return <Users className="w-5 h-5 text-slate-400" />;
    }
  };

  const getStakeholderColor = (type: string) => {
    switch (type) {
      case 'EMPLOYEES': return 'border-blue-500/50 bg-blue-500/10';
      case 'CUSTOMERS': return 'border-pink-500/50 bg-pink-500/10';
      case 'COMMUNITY': return 'border-amber-500/50 bg-amber-500/10';
      case 'ENVIRONMENT': return 'border-emerald-500/50 bg-emerald-500/10';
      case 'FUTURE_GENERATIONS': return 'border-purple-500/50 bg-purple-500/10';
      case 'SHAREHOLDERS': return 'border-cyan-500/50 bg-cyan-500/10';
      default: return 'border-slate-500/50 bg-slate-500/10';
    }
  };

  if (isLoading) {
    return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Loading Vox...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <MessageSquare className="w-10 h-10 text-cyan-400" />
          <div>
            <h1 className="text-3xl font-bold">CendiaVox™</h1>
            <p className="text-slate-400">Stakeholder Voice Assembly - "Who speaks for those not in the room?"</p>
          </div>
        </div>
      </div>

      {/* Dashboard Stats */}
      {dashboard && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center gap-2 text-slate-400 text-sm"><Users className="w-4 h-4" /> Stakeholders</div>
            <div className="text-3xl font-bold">{dashboard.activeStakeholders}</div>
          </div>
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center gap-2 text-slate-400 text-sm"><MessageSquare className="w-4 h-4" /> Signals (7d)</div>
            <div className="text-3xl font-bold text-cyan-400">{dashboard.signalsLast7Days}</div>
          </div>
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center gap-2 text-slate-400 text-sm"><Vote className="w-4 h-4" /> Assemblies</div>
            <div className="text-3xl font-bold">{dashboard.totalAssemblies}</div>
          </div>
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center gap-2 text-slate-400 text-sm"><AlertTriangle className="w-4 h-4" /> Vetoes (30d)</div>
            <div className="text-3xl font-bold text-red-400">{dashboard.vetoesLast30Days}</div>
          </div>
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="text-slate-400 text-sm mb-1">Sentiment</div>
            <div className="flex gap-1">
              {Object.entries(dashboard.sentimentBreakdown || {}).slice(0, 3).map(([k, v]) => (
                <span key={k} className="text-xs px-1.5 py-0.5 bg-slate-700 rounded">{k.substring(0, 3)}: {v}</span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Initialize Button */}
      {stakeholders.length === 0 && (
        <div className="text-center py-12 bg-slate-800 rounded-lg border border-slate-700 mb-8">
          <MessageSquare className="w-16 h-16 mx-auto mb-4 text-cyan-400 opacity-50" />
          <h3 className="text-xl font-semibold mb-2">No Stakeholders Configured</h3>
          <p className="text-slate-400 mb-6">Initialize default stakeholder voices including employees, customers, community, environment, and future generations.</p>
          <button onClick={initializeStakeholders} disabled={isInitializing} className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 rounded-lg font-medium disabled:opacity-50">
            {isInitializing ? 'Initializing...' : 'Initialize Stakeholder Voices'}
          </button>
        </div>
      )}

      {/* Stakeholder Cards */}
      {stakeholders.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stakeholders.map(s => (
            <div key={s.id} className={`rounded-lg p-6 border ${getStakeholderColor(s.stakeholderType)}`}>
              <div className="flex items-center gap-3 mb-4">
                {getStakeholderIcon(s.stakeholderType)}
                <div>
                  <div className="font-semibold">{s.name}</div>
                  <div className="text-xs text-slate-400">{s.stakeholderType.replace(/_/g, ' ')}</div>
                </div>
              </div>
              <p className="text-sm text-slate-300 mb-4">{s.description}</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Voice Weight</span>
                  <span className="font-medium">{s.voiceWeight.toFixed(1)}x</span>
                </div>
                <div>
                  <span className="text-slate-400">Veto Rights:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {s.vetoRights.map((right, i) => (
                      <span key={i} className="text-xs px-2 py-0.5 bg-red-500/20 text-red-300 rounded">
                        {right.replace(/_/g, ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Philosophy Banner */}
      <div className="mt-8 bg-gradient-to-r from-cyan-900/50 to-purple-900/50 rounded-lg p-6 border border-cyan-500/30">
        <div className="flex items-center gap-3 mb-3">
          <Scale className="w-6 h-6 text-cyan-400" />
          <h3 className="text-lg font-semibold">Stakeholder Capitalism Philosophy</h3>
        </div>
        <p className="text-slate-300">
          CendiaVox™ enforces stakeholder capitalism in decision-making. Every major decision considers impacts on employees, 
          customers, communities, environment, and future generations - not just shareholders. AI proxies represent voices 
          that cannot speak for themselves.
        </p>
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
            <span>Environment has veto on irreversible harm</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-400"></div>
            <span>Future generations have veto on generational debt</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-400"></div>
            <span>Employees have veto on unsafe conditions</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoxPage;
