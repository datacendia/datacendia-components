/**
 * CendiaEternal™ - Ultra-Long Horizon Archive
 * "A memory designed to outlive us."
 */

import React, { useState, useEffect } from 'react';
import apiClient from '../../lib/api/client';
import { Archive, Shield, CheckCircle, AlertTriangle, Clock, Users, FileText, Lock } from 'lucide-react';

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
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [newArtifact, setNewArtifact] = useState({ title: '', description: '', content: '', artifactType: 'STRATEGIC_DECISION' });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [artRes, dashRes] = await Promise.all([
        apiClient.api.get<{ data: Artifact[] }>('/eternal/artifacts'),
        apiClient.api.get<{ data: Dashboard }>('/eternal/dashboard'),
      ]);
      if (artRes.success) {setArtifacts((artRes.data as any)?.data || artRes.data || []);}
      if (dashRes.success) {setDashboard((dashRes.data as any)?.data || dashRes.data || null);}
    } catch (error) {
      console.error('Failed to load Eternal data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const archiveArtifact = async () => {
    try {
      await apiClient.api.post('/eternal/artifacts', newArtifact);
      setShowArchiveModal(false);
      setNewArtifact({ title: '', description: '', content: '', artifactType: 'STRATEGIC_DECISION' });
      await loadData();
    } catch (error) {
      console.error('Archive failed:', error);
    }
  };

  const verifyArtifact = async (id: string) => {
    try {
      await apiClient.api.post(`/eternal/artifacts/${id}/verify`, { validationType: 'MANUAL' });
      await loadData();
    } catch (error) {
      console.error('Verification failed:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'VERIFIED': return 'text-emerald-400 bg-emerald-500/20';
      case 'DRIFT_DETECTED': return 'text-red-400 bg-red-500/20';
      case 'PENDING': return 'text-yellow-400 bg-yellow-500/20';
      default: return 'text-slate-400 bg-slate-500/20';
    }
  };

  if (isLoading) {
    return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Loading Eternal...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Archive className="w-10 h-10 text-amber-400" />
          <div>
            <h1 className="text-3xl font-bold">CendiaEternal™</h1>
            <p className="text-slate-400">Ultra-Long Horizon Archive - "A memory designed to outlive us."</p>
          </div>
        </div>
      </div>

      {/* Dashboard Stats */}
      {dashboard && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center gap-2 text-slate-400 text-sm"><FileText className="w-4 h-4" /> Total Artifacts</div>
            <div className="text-3xl font-bold">{dashboard.totalArtifacts}</div>
          </div>
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center gap-2 text-slate-400 text-sm"><Shield className="w-4 h-4" /> Integrity Rate</div>
            <div className="text-3xl font-bold text-emerald-400">{dashboard.integrityRate}%</div>
          </div>
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center gap-2 text-slate-400 text-sm"><Clock className="w-4 h-4" /> Avg Retention</div>
            <div className="text-3xl font-bold text-amber-400">{dashboard.avgRetentionYears} yrs</div>
          </div>
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center gap-2 text-slate-400 text-sm"><Users className="w-4 h-4" /> Successors</div>
            <div className="text-3xl font-bold">{dashboard.definedSuccessors}</div>
          </div>
        </div>
      )}

      {/* Archive Button */}
      <div className="mb-6">
        <button onClick={() => setShowArchiveModal(true)} className="px-4 py-2 bg-amber-600 hover:bg-amber-500 rounded-lg flex items-center gap-2">
          <Archive className="w-4 h-4" /> Archive New Artifact
        </button>
      </div>

      {/* Artifacts Grid */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h2 className="text-xl font-semibold mb-4">Archived Artifacts</h2>
        {artifacts.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <Archive className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>No artifacts archived yet.</p>
            <p className="text-sm">Archive important documents, decisions, and institutional knowledge.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {artifacts.map(a => (
              <div key={a.id} className="p-4 bg-slate-700/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs px-2 py-0.5 bg-slate-600 rounded">{a.artifactType.replace(/_/g, ' ')}</span>
                  <span className={`text-xs px-2 py-0.5 rounded ${getStatusColor(a.verificationStatus)}`}>{a.verificationStatus}</span>
                </div>
                <div className="font-medium mb-1">{a.title}</div>
                <div className="text-sm text-slate-400 mb-3">{a.description?.substring(0, 80)}...</div>
                <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                  <span>Importance: {a.importanceScore}/100</span>
                  <span>Retention: {a.retentionYears} yrs</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <Lock className="w-3 h-3" />
                  <span>{a.accessLevel}</span>
                </div>
                {a.verificationStatus !== 'VERIFIED' && (
                  <button onClick={() => verifyArtifact(a.id)} className="mt-3 w-full px-3 py-1 bg-emerald-600 hover:bg-emerald-500 rounded text-xs">
                    Verify Integrity
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Archive Modal */}
      {showArchiveModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-lg p-6 w-full max-w-lg border border-slate-700">
            <h3 className="text-xl font-semibold mb-4">Archive New Artifact</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Type</label>
                <select value={newArtifact.artifactType} onChange={e => setNewArtifact({...newArtifact, artifactType: e.target.value})} className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2">
                  <option value="STRATEGIC_DECISION">Strategic Decision</option>
                  <option value="POLICY_DOCUMENT">Policy Document</option>
                  <option value="LESSONS_LEARNED">Lessons Learned</option>
                  <option value="LEADERSHIP_WISDOM">Leadership Wisdom</option>
                  <option value="CRISIS_RESPONSE">Crisis Response</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Title</label>
                <input value={newArtifact.title} onChange={e => setNewArtifact({...newArtifact, title: e.target.value})} className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2" placeholder="Artifact title" />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Description</label>
                <input value={newArtifact.description} onChange={e => setNewArtifact({...newArtifact, description: e.target.value})} className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2" placeholder="Brief description" />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Content</label>
                <textarea value={newArtifact.content} onChange={e => setNewArtifact({...newArtifact, content: e.target.value})} className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 h-24" placeholder="Full content to archive" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowArchiveModal(false)} className="flex-1 px-4 py-2 bg-slate-600 hover:bg-slate-500 rounded">Cancel</button>
              <button onClick={archiveArtifact} className="flex-1 px-4 py-2 bg-amber-600 hover:bg-amber-500 rounded">Archive</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EternalPage;
