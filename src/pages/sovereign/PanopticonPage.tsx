/**
 * CendiaPanopticon™ - Global Regulation Engine
 * "Every new regulation, absorbed and enforced."
 */

import React, { useState, useEffect } from 'react';
import apiClient from '../../lib/api/client';
import { Shield, AlertTriangle, FileText, TrendingUp, Globe, CheckCircle, XCircle, Clock } from 'lucide-react';

interface Framework {
  code: string;
  name: string;
  jurisdiction: string;
  category: string;
  description: string;
  requirements: number;
}

interface Regulation {
  id: string;
  framework_code: string;
  framework_name: string;
  jurisdiction: string;
  status: string;
  obligations: any[];
  violations: any[];
}

interface Violation {
  id: string;
  title: string;
  severity: string;
  status: string;
  regulation: { framework_code: string };
}

interface Dashboard {
  totalFrameworks: number;
  overallComplianceScore: number;
  openViolations: { critical: number; high: number; medium: number; low: number; total: number };
  upcomingRegulations: number;
  jurisdictions: number;
}

export const PanopticonPage: React.FC = () => {
  const [frameworks, setFrameworks] = useState<Framework[]>([]);
  const [regulations, setRegulations] = useState<Regulation[]>([]);
  const [violations, setViolations] = useState<Violation[]>([]);
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isIngesting, setIsIngesting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [fwRes, regRes, violRes, dashRes] = await Promise.all([
        apiClient.api.get<{ data: Framework[] }>('/panopticon/frameworks'),
        apiClient.api.get<{ data: Regulation[] }>('/panopticon/regulations'),
        apiClient.api.get<{ data: Violation[] }>('/panopticon/violations'),
        apiClient.api.get<{ data: Dashboard }>('/panopticon/dashboard'),
      ]);

      if (fwRes.success) {setFrameworks((fwRes.data as any)?.data || fwRes.data || []);}
      if (regRes.success) {setRegulations((regRes.data as any)?.data || regRes.data || []);}
      if (violRes.success) {setViolations((violRes.data as any)?.data || violRes.data || []);}
      if (dashRes.success) {setDashboard((dashRes.data as any)?.data || dashRes.data || null);}
    } catch (error) {
      console.error('Failed to load Panopticon data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const ingestRegulation = async (code: string) => {
    setIsIngesting(true);
    try {
      await apiClient.api.post('/panopticon/regulations/ingest', { frameworkCode: code });
      await loadData();
    } catch (error) {
      console.error('Ingest failed:', error);
    } finally {
      setIsIngesting(false);
    }
  };

  const categories = [...new Set(frameworks.map(f => f.category))];
  const filteredFrameworks = selectedCategory === 'all' 
    ? frameworks 
    : frameworks.filter(f => f.category === selectedCategory);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'bg-red-500';
      case 'HIGH': return 'bg-orange-500';
      case 'MEDIUM': return 'bg-yellow-500';
      default: return 'bg-blue-500';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading Panopticon...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="w-10 h-10 text-emerald-400" />
          <div>
            <h1 className="text-3xl font-bold">CendiaPanopticon™</h1>
            <p className="text-slate-400">Global Regulation Engine - "Every new regulation, absorbed and enforced."</p>
          </div>
        </div>
      </div>

      {/* Dashboard Stats */}
      {dashboard && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="text-slate-400 text-sm">Compliance Score</div>
            <div className="text-3xl font-bold text-emerald-400">{dashboard.overallComplianceScore}%</div>
          </div>
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="text-slate-400 text-sm">Active Frameworks</div>
            <div className="text-3xl font-bold">{regulations.length}</div>
          </div>
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="text-slate-400 text-sm">Open Violations</div>
            <div className="text-3xl font-bold text-red-400">{dashboard.openViolations.total}</div>
          </div>
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="text-slate-400 text-sm">Critical</div>
            <div className="text-3xl font-bold text-red-500">{dashboard.openViolations.critical}</div>
          </div>
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="text-slate-400 text-sm">Jurisdictions</div>
            <div className="text-3xl font-bold text-blue-400">{dashboard.jurisdictions}</div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Framework Library */}
        <div className="lg:col-span-2 bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-400" />
              Regulatory Frameworks ({frameworks.length})
            </h2>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-700 border border-slate-600 rounded px-3 py-1 text-sm"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredFrameworks.map(fw => {
              const isActive = regulations.some(r => r.framework_code === fw.code);
              return (
                <div key={fw.code} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{fw.code}</span>
                      <span className="text-xs px-2 py-0.5 bg-slate-600 rounded">{fw.jurisdiction}</span>
                      <span className="text-xs px-2 py-0.5 bg-blue-900/50 text-blue-300 rounded">{fw.category}</span>
                    </div>
                    <div className="text-sm text-slate-400">{fw.name}</div>
                    <div className="text-xs text-slate-500">{fw.requirements} requirements</div>
                  </div>
                  {isActive ? (
                    <span className="flex items-center gap-1 text-emerald-400 text-sm">
                      <CheckCircle className="w-4 h-4" /> Active
                    </span>
                  ) : (
                    <button
                      onClick={() => ingestRegulation(fw.code)}
                      disabled={isIngesting}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 rounded text-sm disabled:opacity-50"
                    >
                      {isIngesting ? 'Ingesting...' : 'Ingest'}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Violations Panel */}
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            Open Violations
          </h2>
          {violations.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <CheckCircle className="w-12 h-12 mx-auto mb-2 text-emerald-500" />
              No open violations
            </div>
          ) : (
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {violations.map(v => (
                <div key={v.id} className="p-3 bg-slate-700/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`w-2 h-2 rounded-full ${getSeverityColor(v.severity)}`} />
                    <span className="text-sm font-medium">{v.title}</span>
                  </div>
                  <div className="text-xs text-slate-400">
                    {v.regulation?.framework_code} • {v.status}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Active Regulations */}
      <div className="mt-6 bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-emerald-400" />
          Active Regulations
        </h2>
        {regulations.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            No regulations ingested yet. Select frameworks above to ingest.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {regulations.map(reg => (
              <div key={reg.id} className="p-4 bg-slate-700/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-emerald-400">{reg.framework_code}</span>
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    reg.status === 'ACTIVE' ? 'bg-emerald-900/50 text-emerald-300' : 'bg-slate-600'
                  }`}>
                    {reg.status}
                  </span>
                </div>
                <div className="text-sm text-slate-300">{reg.framework_name}</div>
                <div className="text-xs text-slate-500 mt-1">{reg.jurisdiction}</div>
                <div className="flex gap-4 mt-3 text-xs text-slate-400">
                  <span>{reg.obligations?.length || 0} obligations</span>
                  <span className={reg.violations?.length > 0 ? 'text-red-400' : ''}>
                    {reg.violations?.length || 0} violations
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PanopticonPage;
