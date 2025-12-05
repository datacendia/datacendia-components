/**
 * CendiaAegis™ - Strategic Defense Intelligence
 * "Real-time threat detection, containment, and resilience modeling."
 */

import React, { useState, useEffect } from 'react';
import apiClient from '../../lib/api/client';
import { Shield, AlertTriangle, Radio, Target, FileText, Zap, Activity } from 'lucide-react';

interface Threat {
  id: string;
  threatType: string;
  title: string;
  description: string;
  severity: string;
  probability: number;
  impactScore: number;
  status: string;
}

interface Signal {
  id: string;
  signalType: string;
  title: string;
  severity: string;
  confidence: number;
}

interface Dashboard {
  activeThreats: number;
  signalsLast24h: number;
  criticalThreats: number;
  pendingCountermeasures: number;
  topThreats: any[];
}

export const AegisPage: React.FC = () => {
  const [threats, setThreats] = useState<Threat[]>([]);
  const [signals, setSignals] = useState<Signal[]>([]);
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [threatRes, signalRes, dashRes] = await Promise.all([
        apiClient.api.get<{ data: Threat[] }>('/aegis/threats'),
        apiClient.api.get<{ data: Signal[] }>('/aegis/signals'),
        apiClient.api.get<{ data: Dashboard }>('/aegis/dashboard'),
      ]);
      if (threatRes.success) {setThreats((threatRes.data as any)?.data || threatRes.data || []);}
      if (signalRes.success) {setSignals((signalRes.data as any)?.data || signalRes.data || []);}
      if (dashRes.success) {setDashboard((dashRes.data as any)?.data || dashRes.data || null);}
    } catch (error) {
      console.error('Failed to load Aegis data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateScenarios = async (threatId: string) => {
    setIsGenerating(true);
    try {
      await apiClient.api.post(`/aegis/threats/${threatId}/scenarios`);
      await loadData();
    } finally {
      setIsGenerating(false);
    }
  };

  const createThreat = async () => {
    try {
      await apiClient.api.post('/aegis/threats', {
        threatType: 'CYBER_ATTACK',
        title: 'Sample Threat Assessment',
        description: 'Potential cyber threat detected for analysis',
        severity: 'MEDIUM',
        probability: 0.5,
        impactScore: 50,
      });
      await loadData();
    } catch (error) {
      console.error('Failed to create threat:', error);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'text-red-500 bg-red-500/20';
      case 'HIGH': return 'text-orange-500 bg-orange-500/20';
      case 'MEDIUM': return 'text-yellow-500 bg-yellow-500/20';
      default: return 'text-blue-500 bg-blue-500/20';
    }
  };

  if (isLoading) {
    return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Loading Aegis...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="w-10 h-10 text-red-400" />
          <div>
            <h1 className="text-3xl font-bold">CendiaAegis™</h1>
            <p className="text-slate-400">Strategic Defense Intelligence - "Real-time threat detection, containment, and resilience modeling."</p>
          </div>
        </div>
      </div>

      {/* Dashboard Stats */}
      {dashboard && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center gap-2 text-slate-400 text-sm"><Target className="w-4 h-4" /> Active Threats</div>
            <div className="text-3xl font-bold text-red-400">{dashboard.activeThreats}</div>
          </div>
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center gap-2 text-slate-400 text-sm"><Radio className="w-4 h-4" /> Signals (24h)</div>
            <div className="text-3xl font-bold">{dashboard.signalsLast24h}</div>
          </div>
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center gap-2 text-slate-400 text-sm"><AlertTriangle className="w-4 h-4" /> Critical</div>
            <div className="text-3xl font-bold text-red-500">{dashboard.criticalThreats}</div>
          </div>
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center gap-2 text-slate-400 text-sm"><Zap className="w-4 h-4" /> Pending Actions</div>
            <div className="text-3xl font-bold text-yellow-400">{dashboard.pendingCountermeasures}</div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Threats */}
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Target className="w-5 h-5 text-red-400" /> Active Threats
            </h2>
            <button onClick={createThreat} className="px-3 py-1 bg-red-600 hover:bg-red-500 rounded text-sm">
              + New Threat
            </button>
          </div>
          {threats.length === 0 ? (
            <div className="text-center py-8 text-slate-500">No active threats</div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {threats.map(t => (
                <div key={t.id} className="p-4 bg-slate-700/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2 py-0.5 rounded text-xs ${getSeverityColor(t.severity)}`}>{t.severity}</span>
                    <span className="text-xs text-slate-400">{t.threatType}</span>
                  </div>
                  <div className="font-medium mb-1">{t.title}</div>
                  <div className="text-sm text-slate-400 mb-2">{t.description?.substring(0, 100)}...</div>
                  <div className="flex items-center justify-between text-xs">
                    <span>Probability: {Math.round(t.probability * 100)}%</span>
                    <span>Impact: {t.impactScore}/100</span>
                  </div>
                  <button
                    onClick={() => generateScenarios(t.id)}
                    disabled={isGenerating}
                    className="mt-2 w-full px-3 py-1 bg-blue-600 hover:bg-blue-500 rounded text-xs"
                  >
                    {isGenerating ? 'Generating...' : 'Generate Scenarios'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Signals */}
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
            <Radio className="w-5 h-5 text-blue-400" /> Recent Signals
          </h2>
          {signals.length === 0 ? (
            <div className="text-center py-8 text-slate-500">No signals captured</div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {signals.map(s => (
                <div key={s.id} className="p-3 bg-slate-700/50 rounded-lg flex items-center gap-3">
                  <Activity className={`w-5 h-5 ${getSeverityColor(s.severity).split(' ')[0]}`} />
                  <div className="flex-1">
                    <div className="font-medium text-sm">{s.title}</div>
                    <div className="text-xs text-slate-400">{s.signalType} • Confidence: {Math.round(s.confidence * 100)}%</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AegisPage;
