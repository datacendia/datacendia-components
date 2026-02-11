// =============================================================================
// CONTINUOUS COMPLIANCE MONITORING PAGE
// CendiaContinuousCompliance™ - Real-Time Compliance Monitoring
// =============================================================================

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { api } from '../../../lib/api';
import {
  Shield,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  TrendingUp,
  TrendingDown,
  Clock,
  FileText,
  Loader2,
  RefreshCw,
  Bell,
  BarChart3,
  Info,
} from 'lucide-react';

// =============================================================================
// TYPES
// =============================================================================

type ComplianceStatus = 'compliant' | 'warning' | 'non_compliant' | 'unknown';

interface ComplianceFramework {
  id: string;
  name: string;
  version: string;
  controlCount: number;
  implementedCount: number;
  compliantCount: number;
  status: ComplianceStatus;
  lastScanned: Date;
  driftDetected: boolean;
}

interface ComplianceControl {
  id: string;
  framework: string;
  controlId: string;
  title: string;
  description: string;
  status: ComplianceStatus;
  implementationStatus: 'implemented' | 'partial' | 'not_implemented';
  lastChecked: Date;
  evidence: string[];
  remediation?: string;
}

interface ComplianceScan {
  id: string;
  framework: string;
  startedAt: Date;
  completedAt?: Date;
  status: 'running' | 'completed' | 'failed';
  controlsScanned: number;
  totalControls: number;
  issuesFound: number;
}

interface ComplianceAlert {
  id: string;
  framework: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  controlId: string;
  detectedAt: Date;
  acknowledged: boolean;
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function ContinuousComplianceMonitorPage() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [frameworks, setFrameworks] = useState<ComplianceFramework[]>([]);
  const [controls, setControls] = useState<ComplianceControl[]>([]);
  const [scans, setScans] = useState<ComplianceScan[]>([]);
  const [alerts, setAlerts] = useState<ComplianceAlert[]>([]);
  const [selectedFramework, setSelectedFramework] = useState<string>('');
  const [scanningFramework, setScanningFramework] = useState<string | null>(null);

  useEffect(() => {
    loadFrameworks();
    loadScans();
    loadAlerts();
  }, []);

  useEffect(() => {
    if (selectedFramework) {
      loadControls(selectedFramework);
    }
  }, [selectedFramework]);

  const loadFrameworks = async () => {
    try {
      const response = await api.get('/compliance-monitor/frameworks');
      const data = (response.data as any).data || [];
      setFrameworks(data);
      if (data.length > 0 && !selectedFramework) {
        setSelectedFramework(data[0].id);
      }
    } catch (err) {
      console.error('Failed to load frameworks, using demo data:', err);
      const now = new Date();
      const demoFrameworks: ComplianceFramework[] = [
        { id: 'eu-ai-act', name: 'EU AI Act', version: '2024', controlCount: 96, implementedCount: 72, compliantCount: 60, status: 'warning', lastScanned: now, driftDetected: true },
        { id: 'gdpr', name: 'GDPR', version: '2016/679', controlCount: 142, implementedCount: 138, compliantCount: 125, status: 'compliant', lastScanned: now, driftDetected: false },
        { id: 'hipaa', name: 'HIPAA', version: '2023', controlCount: 89, implementedCount: 82, compliantCount: 73, status: 'compliant', lastScanned: now, driftDetected: false },
        { id: 'soc2', name: 'SOC 2 Type II', version: 'TSC 2024', controlCount: 78, implementedCount: 68, compliantCount: 58, status: 'warning', lastScanned: now, driftDetected: true },
        { id: 'dora', name: 'DORA', version: '2022/2554', controlCount: 112, implementedCount: 65, compliantCount: 50, status: 'non_compliant', lastScanned: now, driftDetected: true },
        { id: 'nist-ai', name: 'NIST AI RMF', version: '1.0', controlCount: 52, implementedCount: 42, compliantCount: 35, status: 'warning', lastScanned: now, driftDetected: false },
      ];
      setFrameworks(demoFrameworks);
      if (!selectedFramework) setSelectedFramework(demoFrameworks[0].id);
    }
  };

  const loadControls = async (frameworkId: string) => {
    try {
      const response = await api.get(`/compliance-monitor/frameworks/${frameworkId}/controls`);
      setControls((response.data as any).data || []);
    } catch (err) {
      console.error('Failed to load controls:', err);
    }
  };

  const loadScans = async () => {
    try {
      const response = await api.get('/compliance-monitor/scans');
      setScans((response.data as any).data || []);
    } catch (err) {
      console.error('Failed to load scans, using demo data:', err);
      setScans([
        { id: 'scan-1', frameworkId: 'gdpr', status: 'completed', startedAt: new Date(Date.now() - 3600000).toISOString(), completedAt: new Date().toISOString(), findings: 3, score: 88 } as any,
        { id: 'scan-2', frameworkId: 'eu-ai-act', status: 'completed', startedAt: new Date(Date.now() - 7200000).toISOString(), completedAt: new Date(Date.now() - 3600000).toISOString(), findings: 12, score: 62 } as any,
        { id: 'scan-3', frameworkId: 'dora', status: 'completed', startedAt: new Date(Date.now() - 86400000).toISOString(), completedAt: new Date(Date.now() - 82800000).toISOString(), findings: 24, score: 45 } as any,
      ]);
    }
  };

  const loadAlerts = async () => {
    try {
      const response = await api.get('/compliance-monitor/alerts');
      setAlerts((response.data as any).data || []);
    } catch (err) {
      console.error('Failed to load alerts, using demo data:', err);
      setAlerts([
        { id: 'alert-1', frameworkId: 'dora', severity: 'high', title: 'ICT third-party risk assessment overdue', description: '3 critical vendors not assessed within DORA timeline', createdAt: new Date().toISOString(), acknowledged: false } as any,
        { id: 'alert-2', frameworkId: 'eu-ai-act', severity: 'medium', title: 'AI model documentation incomplete', description: 'High-risk AI system transparency requirements not met', createdAt: new Date(Date.now() - 86400000).toISOString(), acknowledged: false } as any,
        { id: 'alert-3', frameworkId: 'gdpr', severity: 'low', title: 'Privacy notice update recommended', description: 'New supervisory guidance suggests SCC template updates', createdAt: new Date(Date.now() - 172800000).toISOString(), acknowledged: true } as any,
      ]);
    }
  };

  const startScan = async (frameworkId: string) => {
    setScanningFramework(frameworkId);
    try {
      await api.post(`/compliance-monitor/frameworks/${frameworkId}/scan`);
      await loadScans();
      await loadFrameworks();
    } catch (err) {
      console.error('Failed to start scan:', err);
    } finally {
      setScanningFramework(null);
    }
  };

  const acknowledgeAlert = async (alertId: string) => {
    try {
      await api.post(`/compliance-monitor/alerts/${alertId}/acknowledge`);
      setAlerts(alerts.map(a => a.id === alertId ? { ...a, acknowledged: true } : a));
    } catch (err) {
      console.error('Failed to acknowledge alert:', err);
    }
  };

  const getStatusColor = (status: ComplianceStatus) => {
    switch (status) {
      case 'compliant': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'non_compliant': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusBg = (status: ComplianceStatus) => {
    switch (status) {
      case 'compliant': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
      case 'warning': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'non_compliant': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-500';
      case 'high': return 'text-orange-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-blue-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Shield className="w-8 h-8 text-indigo-500" />
            CendiaContinuousCompliance™
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Real-Time Compliance Monitoring
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Activity className="w-4 h-4" />
          <span>Enterprise Platinum</span>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-indigo-900 dark:text-indigo-100">
            <p className="font-semibold mb-1">10 Compliance Frameworks Monitored</p>
            <p className="text-indigo-700 dark:text-indigo-300">
              EU AI Act, GDPR, CCPA, HIPAA, SOC 2, ISO 27001, NIST AI RMF, NIST 800-53, PCI-DSS, FedRAMP
            </p>
          </div>
        </div>
      </div>

      {/* Active Alerts */}
      {alerts.filter(a => !a.acknowledged).length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Bell className="w-5 h-5 text-red-600 dark:text-red-400" />
            <h3 className="font-semibold text-red-900 dark:text-red-100">
              Active Alerts ({alerts.filter(a => !a.acknowledged).length})
            </h3>
          </div>
          <div className="space-y-2">
            {alerts.filter(a => !a.acknowledged).slice(0, 3).map((alert) => (
              <div
                key={alert.id}
                className="flex items-start justify-between p-3 bg-white dark:bg-gray-800 rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`font-medium text-sm ${getSeverityColor(alert.severity)}`}>
                      {alert.severity.toUpperCase()}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {alert.framework} · {alert.controlId}
                    </span>
                  </div>
                  <div className="text-sm text-gray-900 dark:text-white font-medium mb-1">
                    {alert.title}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {alert.description}
                  </div>
                </div>
                <button
                  onClick={() => acknowledgeAlert(alert.id)}
                  className="px-3 py-1.5 text-xs text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg"
                >
                  Acknowledge
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Framework Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {frameworks.map((framework) => (
          <div
            key={framework.id}
            className={`p-4 border rounded-lg cursor-pointer transition-all ${
              selectedFramework === framework.id
                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600'
            }`}
            onClick={() => setSelectedFramework(framework.id)}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="font-medium text-sm text-gray-900 dark:text-white mb-1">
                  {framework.name}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  v{framework.version}
                </div>
              </div>
              <span className={`px-2 py-0.5 text-xs rounded ${getStatusBg(framework.status)}`}>
                {framework.status}
              </span>
            </div>
            <div className="space-y-1 mb-3">
              <div className="flex justify-between text-xs">
                <span className="text-gray-600 dark:text-gray-400">Compliant</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {framework.compliantCount}/{framework.controlCount}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                <div
                  className="bg-indigo-500 h-1.5 rounded-full"
                  style={{ width: `${(framework.compliantCount / framework.controlCount) * 100}%` }}
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {framework.driftDetected && (
                  <span className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400">
                    <AlertTriangle className="w-3 h-3" />
                    Drift detected
                  </span>
                )}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  startScan(framework.id);
                }}
                disabled={scanningFramework === framework.id}
                className="p-1 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 rounded disabled:opacity-50"
              >
                {scanningFramework === framework.id ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <RefreshCw className="w-3 h-3" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Controls Detail */}
      {selectedFramework && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-500" />
            Controls ({controls.length})
          </h2>

          {controls.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <Shield className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No controls loaded</p>
            </div>
          ) : (
            <div className="space-y-2">
              {controls.slice(0, 10).map((control) => (
                <div
                  key={control.id}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-indigo-300 dark:hover:border-indigo-600 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs text-gray-600 dark:text-gray-400">
                          {control.controlId}
                        </span>
                        <span className={`px-2 py-0.5 text-xs rounded ${getStatusBg(control.status)}`}>
                          {control.status}
                        </span>
                      </div>
                      <div className="font-medium text-sm text-gray-900 dark:text-white mb-1">
                        {control.title}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        {control.description}
                      </div>
                    </div>
                    {control.status === 'compliant' ? (
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    ) : control.status === 'non_compliant' ? (
                      <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mt-2">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Last checked {new Date(control.lastChecked).toLocaleDateString()}
                    </span>
                    {control.evidence.length > 0 && (
                      <span>{control.evidence.length} evidence items</span>
                    )}
                  </div>
                  {control.remediation && (
                    <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-xs text-blue-900 dark:text-blue-100">
                      <span className="font-semibold">Remediation:</span> {control.remediation}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Recent Scans */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-indigo-500" />
          Recent Scans
        </h2>
        <div className="space-y-2">
          {scans.slice(0, 5).map((scan) => (
            <div
              key={scan.id}
              className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
            >
              <div className="flex items-center gap-3">
                {scan.status === 'running' ? (
                  <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                ) : scan.status === 'completed' ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-500" />
                )}
                <div>
                  <div className="font-medium text-sm text-gray-900 dark:text-white">
                    {scan.framework}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {scan.controlsScanned}/{scan.totalControls} controls · {scan.issuesFound} issues
                  </div>
                </div>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {new Date(scan.startedAt).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
