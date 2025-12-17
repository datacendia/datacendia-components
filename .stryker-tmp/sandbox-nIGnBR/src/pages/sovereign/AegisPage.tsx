/**
 * CendiaAegis™ - Strategic Defense Intelligence
 * "Real-time threat detection, containment, and resilience modeling."
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
import { Shield, AlertTriangle, Radio, Target, FileText, Zap, Activity, Link2, Server, Cloud, FlaskConical, Play, Database, Lock, Eye, Search, Filter, TrendingUp, TrendingDown, BarChart2, RefreshCw, Bell } from 'lucide-react';

// Generate dynamic signal timeline data based on current time
const generateSignalTimeline = () => {
  const now = new Date();
  const currentHour = now.getHours();
  const timeline = stryMutAct_9fa48("57533") ? ["Stryker was here"] : (stryCov_9fa48("57533"), []);

  // Generate data points for last 24 hours in 4-hour intervals
  for (let i = 6; stryMutAct_9fa48("57536") ? i < 0 : stryMutAct_9fa48("57535") ? i > 0 : stryMutAct_9fa48("57534") ? false : (stryCov_9fa48("57534", "57535", "57536"), i >= 0); stryMutAct_9fa48("57537") ? i++ : (stryCov_9fa48("57537"), i--)) {
    const hourOffset = stryMutAct_9fa48("57539") ? i / 4 : (stryCov_9fa48("57539"), i * 4);
    const hour = stryMutAct_9fa48("57540") ? (currentHour - hourOffset + 24) * 24 : (stryCov_9fa48("57540"), (stryMutAct_9fa48("57541") ? currentHour - hourOffset - 24 : (stryCov_9fa48("57541"), (stryMutAct_9fa48("57542") ? currentHour + hourOffset : (stryCov_9fa48("57542"), currentHour - hourOffset)) + 24)) % 24);
    const hourStr = (stryMutAct_9fa48("57545") ? i !== 0 : stryMutAct_9fa48("57544") ? false : stryMutAct_9fa48("57543") ? true : (stryCov_9fa48("57543", "57544", "57545"), i === 0)) ? 'Now' : `${hour.toString().padStart(2, '0')}:00`;
    // Generate semi-random but consistent data based on hour
    const baseCount = Math.floor(stryMutAct_9fa48("57549") ? Math.sin(hour / 3) * 5 - 8 : (stryCov_9fa48("57549"), (stryMutAct_9fa48("57550") ? Math.sin(hour / 3) / 5 : (stryCov_9fa48("57550"), Math.sin(stryMutAct_9fa48("57551") ? hour * 3 : (stryCov_9fa48("57551"), hour / 3)) * 5)) + 8));
    const criticalCount = stryMutAct_9fa48("57552") ? Math.min(0, Math.floor(baseCount * 0.2)) : (stryCov_9fa48("57552"), Math.max(0, Math.floor(stryMutAct_9fa48("57553") ? baseCount / 0.2 : (stryCov_9fa48("57553"), baseCount * 0.2))));
    timeline.push(stryMutAct_9fa48("57554") ? {} : (stryCov_9fa48("57554"), {
      hour: hourStr,
      count: baseCount,
      critical: criticalCount
    }));
  }
  return timeline;
};
const SIGNAL_TIMELINE = generateSignalTimeline();
const THREAT_TYPES = stryMutAct_9fa48("57555") ? [] : (stryCov_9fa48("57555"), ['All Types', 'Malware', 'Phishing', 'Ransomware', 'DDoS', 'Insider', 'APT', 'Supply Chain']);
const SEVERITY_LEVELS = stryMutAct_9fa48("57564") ? [] : (stryCov_9fa48("57564"), ['All Severities', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW']);
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

// MITRE-style threat categories
const THREAT_POSTURE = stryMutAct_9fa48("57570") ? [] : (stryCov_9fa48("57570"), [stryMutAct_9fa48("57571") ? {} : (stryCov_9fa48("57571"), {
  category: 'Initial Access',
  controls: 12,
  atRisk: 2,
  color: 'red'
}), stryMutAct_9fa48("57574") ? {} : (stryCov_9fa48("57574"), {
  category: 'Execution',
  controls: 8,
  atRisk: 0,
  color: 'emerald'
}), stryMutAct_9fa48("57577") ? {} : (stryCov_9fa48("57577"), {
  category: 'Persistence',
  controls: 10,
  atRisk: 1,
  color: 'amber'
}), stryMutAct_9fa48("57580") ? {} : (stryCov_9fa48("57580"), {
  category: 'Privilege Escalation',
  controls: 9,
  atRisk: 0,
  color: 'emerald'
}), stryMutAct_9fa48("57583") ? {} : (stryCov_9fa48("57583"), {
  category: 'Defense Evasion',
  controls: 14,
  atRisk: 3,
  color: 'red'
}), stryMutAct_9fa48("57586") ? {} : (stryCov_9fa48("57586"), {
  category: 'Credential Access',
  controls: 7,
  atRisk: 1,
  color: 'amber'
}), stryMutAct_9fa48("57589") ? {} : (stryCov_9fa48("57589"), {
  category: 'Lateral Movement',
  controls: 6,
  atRisk: 0,
  color: 'emerald'
}), stryMutAct_9fa48("57592") ? {} : (stryCov_9fa48("57592"), {
  category: 'Collection',
  controls: 5,
  atRisk: 0,
  color: 'emerald'
}), stryMutAct_9fa48("57595") ? {} : (stryCov_9fa48("57595"), {
  category: 'Exfiltration',
  controls: 8,
  atRisk: 1,
  color: 'amber'
}), stryMutAct_9fa48("57598") ? {} : (stryCov_9fa48("57598"), {
  category: 'Impact',
  controls: 6,
  atRisk: 0,
  color: 'emerald'
})]);
const INTEGRATIONS = stryMutAct_9fa48("57601") ? [] : (stryCov_9fa48("57601"), [stryMutAct_9fa48("57602") ? {} : (stryCov_9fa48("57602"), {
  id: 'siem',
  name: 'SIEM',
  icon: '📊',
  examples: 'Splunk, QRadar, Sentinel',
  connected: stryMutAct_9fa48("57607") ? true : (stryCov_9fa48("57607"), false)
}), stryMutAct_9fa48("57608") ? {} : (stryCov_9fa48("57608"), {
  id: 'edr',
  name: 'EDR/XDR',
  icon: '🛡️',
  examples: 'CrowdStrike, SentinelOne, Defender',
  connected: stryMutAct_9fa48("57613") ? true : (stryCov_9fa48("57613"), false)
}), stryMutAct_9fa48("57614") ? {} : (stryCov_9fa48("57614"), {
  id: 'cloud',
  name: 'Cloud Logs',
  icon: '☁️',
  examples: 'AWS CloudTrail, Azure Monitor, GCP Logs',
  connected: stryMutAct_9fa48("57619") ? true : (stryCov_9fa48("57619"), false)
}), stryMutAct_9fa48("57620") ? {} : (stryCov_9fa48("57620"), {
  id: 'vuln',
  name: 'Vulnerability',
  icon: '🔍',
  examples: 'Qualys, Tenable, Rapid7',
  connected: stryMutAct_9fa48("57625") ? true : (stryCov_9fa48("57625"), false)
}), stryMutAct_9fa48("57626") ? {} : (stryCov_9fa48("57626"), {
  id: 'ti',
  name: 'Threat Intel',
  icon: '🎯',
  examples: 'MISP, OTX, VirusTotal',
  connected: stryMutAct_9fa48("57631") ? true : (stryCov_9fa48("57631"), false)
})]);
export const AegisPage: React.FC = () => {
  const [threats, setThreats] = useState<Threat[]>(stryMutAct_9fa48("57633") ? ["Stryker was here"] : (stryCov_9fa48("57633"), []));
  const [signals, setSignals] = useState<Signal[]>(stryMutAct_9fa48("57634") ? ["Stryker was here"] : (stryCov_9fa48("57634"), []));
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [isLoading, setIsLoading] = useState(stryMutAct_9fa48("57635") ? false : (stryCov_9fa48("57635"), true));
  const [isGenerating, setIsGenerating] = useState(stryMutAct_9fa48("57636") ? true : (stryCov_9fa48("57636"), false));
  const [showIntegrations, setShowIntegrations] = useState(stryMutAct_9fa48("57637") ? true : (stryCov_9fa48("57637"), false));

  // Filter and search state
  const [searchQuery, setSearchQuery] = useState('');
  const [threatTypeFilter, setThreatTypeFilter] = useState('All Types');
  const [severityFilter, setSeverityFilter] = useState('All Severities');
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('24h');
  const [autoRefresh, setAutoRefresh] = useState(stryMutAct_9fa48("57642") ? true : (stryCov_9fa48("57642"), false));

  // Filtered threats based on search and filters
  const filteredThreats = stryMutAct_9fa48("57643") ? threats : (stryCov_9fa48("57643"), threats.filter(threat => {
    const matchesSearch = stryMutAct_9fa48("57647") ? (searchQuery === '' || threat.title.toLowerCase().includes(searchQuery.toLowerCase())) && threat.description.toLowerCase().includes(searchQuery.toLowerCase()) : stryMutAct_9fa48("57646") ? false : stryMutAct_9fa48("57645") ? true : (stryCov_9fa48("57645", "57646", "57647"), (stryMutAct_9fa48("57649") ? searchQuery === '' && threat.title.toLowerCase().includes(searchQuery.toLowerCase()) : stryMutAct_9fa48("57648") ? false : (stryCov_9fa48("57648", "57649"), (stryMutAct_9fa48("57651") ? searchQuery !== '' : stryMutAct_9fa48("57650") ? false : (stryCov_9fa48("57650", "57651"), searchQuery === '')) || (stryMutAct_9fa48("57653") ? threat.title.toUpperCase().includes(searchQuery.toLowerCase()) : (stryCov_9fa48("57653"), threat.title.toLowerCase().includes(stryMutAct_9fa48("57654") ? searchQuery.toUpperCase() : (stryCov_9fa48("57654"), searchQuery.toLowerCase())))))) || (stryMutAct_9fa48("57655") ? threat.description.toUpperCase().includes(searchQuery.toLowerCase()) : (stryCov_9fa48("57655"), threat.description.toLowerCase().includes(stryMutAct_9fa48("57656") ? searchQuery.toUpperCase() : (stryCov_9fa48("57656"), searchQuery.toLowerCase())))));
    const matchesType = stryMutAct_9fa48("57659") ? threatTypeFilter === 'All Types' && threat.threatType.toLowerCase().includes(threatTypeFilter.toLowerCase()) : stryMutAct_9fa48("57658") ? false : stryMutAct_9fa48("57657") ? true : (stryCov_9fa48("57657", "57658", "57659"), (stryMutAct_9fa48("57661") ? threatTypeFilter !== 'All Types' : stryMutAct_9fa48("57660") ? false : (stryCov_9fa48("57660", "57661"), threatTypeFilter === 'All Types')) || (stryMutAct_9fa48("57663") ? threat.threatType.toUpperCase().includes(threatTypeFilter.toLowerCase()) : (stryCov_9fa48("57663"), threat.threatType.toLowerCase().includes(stryMutAct_9fa48("57664") ? threatTypeFilter.toUpperCase() : (stryCov_9fa48("57664"), threatTypeFilter.toLowerCase())))));
    const matchesSeverity = stryMutAct_9fa48("57667") ? severityFilter === 'All Severities' && threat.severity === severityFilter : stryMutAct_9fa48("57666") ? false : stryMutAct_9fa48("57665") ? true : (stryCov_9fa48("57665", "57666", "57667"), (stryMutAct_9fa48("57669") ? severityFilter !== 'All Severities' : stryMutAct_9fa48("57668") ? false : (stryCov_9fa48("57668", "57669"), severityFilter === 'All Severities')) || (stryMutAct_9fa48("57672") ? threat.severity !== severityFilter : stryMutAct_9fa48("57671") ? false : (stryCov_9fa48("57671", "57672"), threat.severity === severityFilter)));
    return stryMutAct_9fa48("57675") ? matchesSearch && matchesType || matchesSeverity : stryMutAct_9fa48("57674") ? false : stryMutAct_9fa48("57673") ? true : (stryCov_9fa48("57673", "57674", "57675"), (stryMutAct_9fa48("57677") ? matchesSearch || matchesType : stryMutAct_9fa48("57676") ? true : (stryCov_9fa48("57676", "57677"), matchesSearch && matchesType)) && matchesSeverity);
  }));

  // Filtered signals based on search and severity
  const filteredSignals = stryMutAct_9fa48("57678") ? signals : (stryCov_9fa48("57678"), signals.filter(signal => {
    const matchesSearch = stryMutAct_9fa48("57682") ? searchQuery === '' && signal.title.toLowerCase().includes(searchQuery.toLowerCase()) : stryMutAct_9fa48("57681") ? false : stryMutAct_9fa48("57680") ? true : (stryCov_9fa48("57680", "57681", "57682"), (stryMutAct_9fa48("57684") ? searchQuery !== '' : stryMutAct_9fa48("57683") ? false : (stryCov_9fa48("57683", "57684"), searchQuery === '')) || (stryMutAct_9fa48("57686") ? signal.title.toUpperCase().includes(searchQuery.toLowerCase()) : (stryCov_9fa48("57686"), signal.title.toLowerCase().includes(stryMutAct_9fa48("57687") ? searchQuery.toUpperCase() : (stryCov_9fa48("57687"), searchQuery.toLowerCase())))));
    const matchesSeverity = stryMutAct_9fa48("57690") ? severityFilter === 'All Severities' && signal.severity === severityFilter : stryMutAct_9fa48("57689") ? false : stryMutAct_9fa48("57688") ? true : (stryCov_9fa48("57688", "57689", "57690"), (stryMutAct_9fa48("57692") ? severityFilter !== 'All Severities' : stryMutAct_9fa48("57691") ? false : (stryCov_9fa48("57691", "57692"), severityFilter === 'All Severities')) || (stryMutAct_9fa48("57695") ? signal.severity !== severityFilter : stryMutAct_9fa48("57694") ? false : (stryCov_9fa48("57694", "57695"), signal.severity === severityFilter)));
    return stryMutAct_9fa48("57698") ? matchesSearch || matchesSeverity : stryMutAct_9fa48("57697") ? false : stryMutAct_9fa48("57696") ? true : (stryCov_9fa48("57696", "57697", "57698"), matchesSearch && matchesSeverity);
  }));
  useEffect(() => {
    loadData();
  }, stryMutAct_9fa48("57700") ? ["Stryker was here"] : (stryCov_9fa48("57700"), []));

  // Auto-refresh effect
  useEffect(() => {
    if (stryMutAct_9fa48("57704") ? false : stryMutAct_9fa48("57703") ? true : stryMutAct_9fa48("57702") ? autoRefresh : (stryCov_9fa48("57702", "57703", "57704"), !autoRefresh)) return;
    const interval = setInterval(() => {
      loadData();
    }, 30000); // Refresh every 30 seconds
    return stryMutAct_9fa48("57706") ? () => undefined : (stryCov_9fa48("57706"), () => clearInterval(interval));
  }, stryMutAct_9fa48("57707") ? [] : (stryCov_9fa48("57707"), [autoRefresh]));
  const loadData = async () => {
    try {
      const [threatRes, signalRes, dashRes] = await Promise.all(stryMutAct_9fa48("57710") ? [] : (stryCov_9fa48("57710"), [apiClient.api.get<{
        data: Threat[];
      }>('/aegis/threats'), apiClient.api.get<{
        data: Signal[];
      }>('/aegis/signals'), apiClient.api.get<{
        data: Dashboard;
      }>('/aegis/dashboard')]));
      if (stryMutAct_9fa48("57715") ? false : stryMutAct_9fa48("57714") ? true : (stryCov_9fa48("57714", "57715"), threatRes.success)) {
        setThreats(stryMutAct_9fa48("57719") ? ((threatRes.data as any)?.data || threatRes.data) && [] : stryMutAct_9fa48("57718") ? false : stryMutAct_9fa48("57717") ? true : (stryCov_9fa48("57717", "57718", "57719"), (stryMutAct_9fa48("57721") ? (threatRes.data as any)?.data && threatRes.data : stryMutAct_9fa48("57720") ? false : (stryCov_9fa48("57720", "57721"), (stryMutAct_9fa48("57722") ? (threatRes.data as any).data : (stryCov_9fa48("57722"), (threatRes.data as any)?.data)) || threatRes.data)) || (stryMutAct_9fa48("57723") ? ["Stryker was here"] : (stryCov_9fa48("57723"), []))));
      }
      if (stryMutAct_9fa48("57725") ? false : stryMutAct_9fa48("57724") ? true : (stryCov_9fa48("57724", "57725"), signalRes.success)) {
        setSignals(stryMutAct_9fa48("57729") ? ((signalRes.data as any)?.data || signalRes.data) && [] : stryMutAct_9fa48("57728") ? false : stryMutAct_9fa48("57727") ? true : (stryCov_9fa48("57727", "57728", "57729"), (stryMutAct_9fa48("57731") ? (signalRes.data as any)?.data && signalRes.data : stryMutAct_9fa48("57730") ? false : (stryCov_9fa48("57730", "57731"), (stryMutAct_9fa48("57732") ? (signalRes.data as any).data : (stryCov_9fa48("57732"), (signalRes.data as any)?.data)) || signalRes.data)) || (stryMutAct_9fa48("57733") ? ["Stryker was here"] : (stryCov_9fa48("57733"), []))));
      }
      if (stryMutAct_9fa48("57735") ? false : stryMutAct_9fa48("57734") ? true : (stryCov_9fa48("57734", "57735"), dashRes.success)) {
        setDashboard(stryMutAct_9fa48("57739") ? ((dashRes.data as any)?.data || dashRes.data) && null : stryMutAct_9fa48("57738") ? false : stryMutAct_9fa48("57737") ? true : (stryCov_9fa48("57737", "57738", "57739"), (stryMutAct_9fa48("57741") ? (dashRes.data as any)?.data && dashRes.data : stryMutAct_9fa48("57740") ? false : (stryCov_9fa48("57740", "57741"), (stryMutAct_9fa48("57742") ? (dashRes.data as any).data : (stryCov_9fa48("57742"), (dashRes.data as any)?.data)) || dashRes.data)) || null));
      }
    } catch (error) {
      console.error('Failed to load Aegis data:', error);
    } finally {
      setIsLoading(stryMutAct_9fa48("57746") ? true : (stryCov_9fa48("57746"), false));
    }
  };
  const generateScenarios = async (threatId: string) => {
    setIsGenerating(stryMutAct_9fa48("57748") ? false : (stryCov_9fa48("57748"), true));
    try {
      await apiClient.api.post(`/aegis/threats/${threatId}/scenarios`);
      await loadData();
    } finally {
      setIsGenerating(stryMutAct_9fa48("57752") ? true : (stryCov_9fa48("57752"), false));
    }
  };
  const createThreat = async () => {
    try {
      await apiClient.api.post('/aegis/threats', stryMutAct_9fa48("57756") ? {} : (stryCov_9fa48("57756"), {
        threatType: 'CYBER_ATTACK',
        title: 'Sample Threat Assessment',
        description: 'Potential cyber threat detected for analysis',
        severity: 'MEDIUM',
        probability: 0.5,
        impactScore: 50
      }));
      await loadData();
    } catch (error) {
      console.error('Failed to create threat:', error);
    }
  };
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        if (stryMutAct_9fa48("57764")) {} else {
          stryCov_9fa48("57764");
          return 'text-red-500 bg-red-500/20';
        }
      case 'HIGH':
        if (stryMutAct_9fa48("57767")) {} else {
          stryCov_9fa48("57767");
          return 'text-orange-500 bg-orange-500/20';
        }
      case 'MEDIUM':
        if (stryMutAct_9fa48("57770")) {} else {
          stryCov_9fa48("57770");
          return 'text-yellow-500 bg-yellow-500/20';
        }
      default:
        if (stryMutAct_9fa48("57773")) {} else {
          stryCov_9fa48("57773");
          return 'text-blue-500 bg-blue-500/20';
        }
    }
  };
  if (stryMutAct_9fa48("57776") ? false : stryMutAct_9fa48("57775") ? true : (stryCov_9fa48("57775", "57776"), isLoading)) {
    return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Loading Aegis...</div>;
  }
  return <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-10 h-10 text-red-400" />
            <div>
              <h1 className="text-3xl font-bold">CendiaAegis™</h1>
              <p className="text-slate-400">Strategic Defense Intelligence - "Real-time threat detection, containment, and resilience modeling."</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={stryMutAct_9fa48("57778") ? () => undefined : (stryCov_9fa48("57778"), () => window.open('/sovereign/crucible?preset=cyber-attack', '_blank'))} className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-sm font-medium flex items-center gap-2">
              <FlaskConical className="w-4 h-4" /> Stress Test in Crucible
            </button>
            <button onClick={() => {
            // Export threat report functionality
            const reportData = stryMutAct_9fa48("57782") ? {} : (stryCov_9fa48("57782"), {
              generated: new Date().toISOString(),
              threats: filteredThreats,
              signals: filteredSignals,
              dashboard
            });
            const blob = new Blob(stryMutAct_9fa48("57783") ? [] : (stryCov_9fa48("57783"), [JSON.stringify(reportData, null, 2)]), stryMutAct_9fa48("57784") ? {} : (stryCov_9fa48("57784"), {
              type: 'application/json'
            }));
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `aegis-threat-report-${new Date().toISOString().split('T')[0]}.json`;
            a.click();
          }} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm flex items-center gap-2">
              <FileText className="w-4 h-4" /> Export Report
            </button>
          </div>
        </div>
      </div>

      {/* Dashboard Stats */}
      {stryMutAct_9fa48("57791") ? dashboard || <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
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
        </div> : stryMutAct_9fa48("57790") ? false : stryMutAct_9fa48("57789") ? true : (stryCov_9fa48("57789", "57790", "57791"), dashboard && <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
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
        </div>)}

      {/* Signal Timeline Chart */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-blue-400" /> Signal Timeline
            </h2>
            <div className="flex items-center gap-1 bg-slate-700 rounded-lg p-0.5">
              {(['24h', '7d', '30d'] as const).map(stryMutAct_9fa48("57792") ? () => undefined : (stryCov_9fa48("57792"), range => <button key={range} onClick={stryMutAct_9fa48("57793") ? () => undefined : (stryCov_9fa48("57793"), () => setTimeRange(range))} className={`px-3 py-1 rounded text-xs font-medium transition-colors ${(stryMutAct_9fa48("57797") ? timeRange !== range : stryMutAct_9fa48("57796") ? false : stryMutAct_9fa48("57795") ? true : (stryCov_9fa48("57795", "57796", "57797"), timeRange === range)) ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}>
                  {range}
                </button>))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={stryMutAct_9fa48("57800") ? () => undefined : (stryCov_9fa48("57800"), () => setAutoRefresh(stryMutAct_9fa48("57801") ? autoRefresh : (stryCov_9fa48("57801"), !autoRefresh)))} className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs ${autoRefresh ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-300'}`}>
              <RefreshCw className={`w-3 h-3 ${autoRefresh ? 'animate-spin' : ''}`} />
              Auto-refresh
            </button>
            <button className="flex items-center gap-1 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs text-slate-300">
              <Bell className="w-3 h-3" /> Alerts
            </button>
          </div>
        </div>
        
        {/* Simple bar chart visualization */}
        <div className="flex items-end gap-2 h-32 mb-2">
          {SIGNAL_TIMELINE.map((point, i) => {
          const maxCount = stryMutAct_9fa48("57809") ? Math.min(...SIGNAL_TIMELINE.map(p => p.count)) : (stryCov_9fa48("57809"), Math.max(...SIGNAL_TIMELINE.map(stryMutAct_9fa48("57810") ? () => undefined : (stryCov_9fa48("57810"), p => p.count))));
          const height = stryMutAct_9fa48("57811") ? point.count / maxCount / 100 : (stryCov_9fa48("57811"), (stryMutAct_9fa48("57812") ? point.count * maxCount : (stryCov_9fa48("57812"), point.count / maxCount)) * 100);
          const criticalHeight = stryMutAct_9fa48("57813") ? point.critical / maxCount / 100 : (stryCov_9fa48("57813"), (stryMutAct_9fa48("57814") ? point.critical * maxCount : (stryCov_9fa48("57814"), point.critical / maxCount)) * 100);
          return <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full relative" style={stryMutAct_9fa48("57815") ? {} : (stryCov_9fa48("57815"), {
              height: '100%'
            })}>
                  <div className="absolute bottom-0 w-full bg-blue-500/30 rounded-t transition-all" style={stryMutAct_9fa48("57817") ? {} : (stryCov_9fa48("57817"), {
                height: `${height}%`
              })}>
                    {stryMutAct_9fa48("57821") ? point.critical > 0 || <div className="absolute bottom-0 w-full bg-red-500 rounded-t" style={{
                  height: `${criticalHeight / height * 100}%`
                }} /> : stryMutAct_9fa48("57820") ? false : stryMutAct_9fa48("57819") ? true : (stryCov_9fa48("57819", "57820", "57821"), (stryMutAct_9fa48("57824") ? point.critical <= 0 : stryMutAct_9fa48("57823") ? point.critical >= 0 : stryMutAct_9fa48("57822") ? true : (stryCov_9fa48("57822", "57823", "57824"), point.critical > 0)) && <div className="absolute bottom-0 w-full bg-red-500 rounded-t" style={stryMutAct_9fa48("57825") ? {} : (stryCov_9fa48("57825"), {
                  height: `${stryMutAct_9fa48("57827") ? criticalHeight / height / 100 : (stryCov_9fa48("57827"), (stryMutAct_9fa48("57828") ? criticalHeight * height : (stryCov_9fa48("57828"), criticalHeight / height)) * 100)}%`
                })} />)}
                  </div>
                </div>
              </div>;
        })}
        </div>
        <div className="flex gap-2">
          {SIGNAL_TIMELINE.map(stryMutAct_9fa48("57829") ? () => undefined : (stryCov_9fa48("57829"), (point, i) => <div key={i} className="flex-1 text-center">
              <div className="text-[10px] text-slate-500">{point.hour}</div>
              <div className="text-xs text-slate-400">{point.count}</div>
            </div>))}
        </div>
        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-slate-700 text-xs">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-blue-500/50"></span> Total signals</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-red-500"></span> Critical</span>
          <span className="flex-1"></span>
          <span className="text-slate-500">
            {(stryMutAct_9fa48("57832") ? timeRange !== '24h' : stryMutAct_9fa48("57831") ? false : stryMutAct_9fa48("57830") ? true : (stryCov_9fa48("57830", "57831", "57832"), timeRange === '24h')) ? 'Last 24 hours' : (stryMutAct_9fa48("57837") ? timeRange !== '7d' : stryMutAct_9fa48("57836") ? false : stryMutAct_9fa48("57835") ? true : (stryCov_9fa48("57835", "57836", "57837"), timeRange === '7d')) ? 'Last 7 days' : 'Last 30 days'}
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-800 rounded-lg p-4 border border-slate-700 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="flex-1 min-w-[200px] relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input type="text" value={searchQuery} onChange={stryMutAct_9fa48("57841") ? () => undefined : (stryCov_9fa48("57841"), e => setSearchQuery(e.target.value))} placeholder="Search threats, signals, sources..." className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500" />
          </div>
          
          {/* Threat Type Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-500" />
            <select value={threatTypeFilter} onChange={stryMutAct_9fa48("57842") ? () => undefined : (stryCov_9fa48("57842"), e => setThreatTypeFilter(e.target.value))} className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm">
              {THREAT_TYPES.map(stryMutAct_9fa48("57843") ? () => undefined : (stryCov_9fa48("57843"), t => <option key={t} value={t}>{t}</option>))}
            </select>
          </div>
          
          {/* Severity Filter */}
          <select value={severityFilter} onChange={stryMutAct_9fa48("57844") ? () => undefined : (stryCov_9fa48("57844"), e => setSeverityFilter(e.target.value))} className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm">
            {SEVERITY_LEVELS.map(stryMutAct_9fa48("57845") ? () => undefined : (stryCov_9fa48("57845"), s => <option key={s} value={s} className={(stryMutAct_9fa48("57848") ? s !== 'CRITICAL' : stryMutAct_9fa48("57847") ? false : stryMutAct_9fa48("57846") ? true : (stryCov_9fa48("57846", "57847", "57848"), s === 'CRITICAL')) ? 'text-red-400' : (stryMutAct_9fa48("57853") ? s !== 'HIGH' : stryMutAct_9fa48("57852") ? false : stryMutAct_9fa48("57851") ? true : (stryCov_9fa48("57851", "57852", "57853"), s === 'HIGH')) ? 'text-orange-400' : (stryMutAct_9fa48("57858") ? s !== 'MEDIUM' : stryMutAct_9fa48("57857") ? false : stryMutAct_9fa48("57856") ? true : (stryCov_9fa48("57856", "57857", "57858"), s === 'MEDIUM')) ? 'text-yellow-400' : (stryMutAct_9fa48("57863") ? s !== 'LOW' : stryMutAct_9fa48("57862") ? false : stryMutAct_9fa48("57861") ? true : (stryCov_9fa48("57861", "57862", "57863"), s === 'LOW')) ? 'text-blue-400' : ''}>{s}</option>))}
          </select>

          {/* Clear Filters */}
          {stryMutAct_9fa48("57869") ? searchQuery || threatTypeFilter !== 'All Types' || severityFilter !== 'All Severities' || <button onClick={() => {
          setSearchQuery('');
          setThreatTypeFilter('All Types');
          setSeverityFilter('All Severities');
        }} className="px-3 py-2 text-xs text-slate-400 hover:text-white">
              Clear filters
            </button> : stryMutAct_9fa48("57868") ? false : stryMutAct_9fa48("57867") ? true : (stryCov_9fa48("57867", "57868", "57869"), (stryMutAct_9fa48("57871") ? (searchQuery || threatTypeFilter !== 'All Types') && severityFilter !== 'All Severities' : stryMutAct_9fa48("57870") ? true : (stryCov_9fa48("57870", "57871"), (stryMutAct_9fa48("57873") ? searchQuery && threatTypeFilter !== 'All Types' : stryMutAct_9fa48("57872") ? false : (stryCov_9fa48("57872", "57873"), searchQuery || (stryMutAct_9fa48("57875") ? threatTypeFilter === 'All Types' : stryMutAct_9fa48("57874") ? false : (stryCov_9fa48("57874", "57875"), threatTypeFilter !== 'All Types')))) || (stryMutAct_9fa48("57878") ? severityFilter === 'All Severities' : stryMutAct_9fa48("57877") ? false : (stryCov_9fa48("57877", "57878"), severityFilter !== 'All Severities')))) && <button onClick={() => {
          setSearchQuery('');
          setThreatTypeFilter('All Types');
          setSeverityFilter('All Severities');
        }} className="px-3 py-2 text-xs text-slate-400 hover:text-white">
              Clear filters
            </button>)}
        </div>
      </div>

      {/* Threat Posture Summary - MITRE-style */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Eye className="w-5 h-5 text-red-400" /> Threat Posture (MITRE ATT&CK)
          </h2>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Covered</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Partial</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span> At Risk</span>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {THREAT_POSTURE.map(stryMutAct_9fa48("57884") ? () => undefined : (stryCov_9fa48("57884"), cat => <div key={cat.category} className={`p-3 rounded-lg border ${(stryMutAct_9fa48("57888") ? cat.color !== 'red' : stryMutAct_9fa48("57887") ? false : stryMutAct_9fa48("57886") ? true : (stryCov_9fa48("57886", "57887", "57888"), cat.color === 'red')) ? 'bg-red-500/10 border-red-500/30' : (stryMutAct_9fa48("57893") ? cat.color !== 'amber' : stryMutAct_9fa48("57892") ? false : stryMutAct_9fa48("57891") ? true : (stryCov_9fa48("57891", "57892", "57893"), cat.color === 'amber')) ? 'bg-amber-500/10 border-amber-500/30' : 'bg-emerald-500/10 border-emerald-500/30'}`}>
              <div className="text-xs text-slate-400 mb-1">{cat.category}</div>
              <div className="flex items-center justify-between">
                <span className={`text-lg font-bold ${(stryMutAct_9fa48("57900") ? cat.color !== 'red' : stryMutAct_9fa48("57899") ? false : stryMutAct_9fa48("57898") ? true : (stryCov_9fa48("57898", "57899", "57900"), cat.color === 'red')) ? 'text-red-400' : (stryMutAct_9fa48("57905") ? cat.color !== 'amber' : stryMutAct_9fa48("57904") ? false : stryMutAct_9fa48("57903") ? true : (stryCov_9fa48("57903", "57904", "57905"), cat.color === 'amber')) ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {stryMutAct_9fa48("57909") ? cat.controls + cat.atRisk : (stryCov_9fa48("57909"), cat.controls - cat.atRisk)}/{cat.controls}
                </span>
                {stryMutAct_9fa48("57912") ? cat.atRisk > 0 || <span className="text-xs text-red-400">{cat.atRisk} gaps</span> : stryMutAct_9fa48("57911") ? false : stryMutAct_9fa48("57910") ? true : (stryCov_9fa48("57910", "57911", "57912"), (stryMutAct_9fa48("57915") ? cat.atRisk <= 0 : stryMutAct_9fa48("57914") ? cat.atRisk >= 0 : stryMutAct_9fa48("57913") ? true : (stryCov_9fa48("57913", "57914", "57915"), cat.atRisk > 0)) && <span className="text-xs text-red-400">{cat.atRisk} gaps</span>)}
              </div>
            </div>))}
        </div>
        <div className="mt-4 pt-4 border-t border-slate-700 flex items-center justify-between">
          <span className="text-sm text-slate-400">Overall coverage: <strong className="text-white">87%</strong> across 85 controls</span>
          <button className="text-xs text-red-400 hover:text-red-300">View full MITRE matrix →</button>
        </div>
      </div>

      {/* Integrations Callout */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-800/50 rounded-lg p-6 border border-slate-700 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Link2 className="w-5 h-5 text-blue-400" /> Security Integrations
            </h2>
            <p className="text-sm text-slate-400">Connect your security stack for real-time threat intelligence</p>
          </div>
          <button onClick={stryMutAct_9fa48("57916") ? () => undefined : (stryCov_9fa48("57916"), () => setShowIntegrations(stryMutAct_9fa48("57917") ? false : (stryCov_9fa48("57917"), true)))} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-medium">
            Configure Integrations
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {INTEGRATIONS.map(stryMutAct_9fa48("57918") ? () => undefined : (stryCov_9fa48("57918"), int => <div key={int.id} className="p-3 bg-slate-900/50 rounded-lg border border-slate-600 text-center">
              <div className="text-2xl mb-1">{int.icon}</div>
              <div className="text-sm font-medium">{int.name}</div>
              <div className="text-xs text-slate-500">{int.connected ? '✓ Connected' : 'Not connected'}</div>
            </div>))}
        </div>
      </div>

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
          {(stryMutAct_9fa48("57923") ? threats.length !== 0 : stryMutAct_9fa48("57922") ? false : stryMutAct_9fa48("57921") ? true : (stryCov_9fa48("57921", "57922", "57923"), threats.length === 0)) ? <div className="text-center py-12">
              <Shield className="w-16 h-16 mx-auto mb-4 text-emerald-400 opacity-50" />
              <h3 className="text-xl font-semibold text-white mb-2">No Active Threats</h3>
              <p className="text-slate-400 mb-6 max-w-sm mx-auto">
                Your environment is clear. Import signals or simulate an incident to test your response.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <button onClick={stryMutAct_9fa48("57924") ? () => undefined : (stryCov_9fa48("57924"), () => setShowIntegrations(stryMutAct_9fa48("57925") ? false : (stryCov_9fa48("57925"), true)))} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-medium flex items-center gap-2">
                  <Database className="w-4 h-4" /> Import Signals
                </button>
                <button onClick={stryMutAct_9fa48("57926") ? () => undefined : (stryCov_9fa48("57926"), () => window.open('/sovereign/crucible?preset=cyber-attack', '_blank'))} className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-sm font-medium flex items-center gap-2">
                  <FlaskConical className="w-4 h-4" /> Simulate Incident
                </button>
              </div>
            </div> : <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredThreats.map(stryMutAct_9fa48("57929") ? () => undefined : (stryCov_9fa48("57929"), t => <div key={t.id} className="p-4 bg-slate-700/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2 py-0.5 rounded text-xs ${getSeverityColor(t.severity)}`}>{t.severity}</span>
                    <span className="text-xs text-slate-400">{t.threatType}</span>
                  </div>
                  <div className="font-medium mb-1">{t.title}</div>
                  <div className="text-sm text-slate-400 mb-2">{stryMutAct_9fa48("57932") ? t.description.substring(0, 100) : stryMutAct_9fa48("57931") ? t.description : (stryCov_9fa48("57931", "57932"), t.description?.substring(0, 100))}...</div>
                  <div className="flex items-center justify-between text-xs">
                    <span>Probability: {Math.round(stryMutAct_9fa48("57933") ? t.probability / 100 : (stryCov_9fa48("57933"), t.probability * 100))}%</span>
                    <span>Impact: {t.impactScore}/100</span>
                  </div>
                  <button onClick={stryMutAct_9fa48("57934") ? () => undefined : (stryCov_9fa48("57934"), () => generateScenarios(t.id))} disabled={isGenerating} className="mt-2 w-full px-3 py-1 bg-blue-600 hover:bg-blue-500 rounded text-xs">
                    {isGenerating ? 'Generating...' : 'Generate Scenarios'}
                  </button>
                </div>))}
            </div>}
        </div>

        {/* Signals */}
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
            <Radio className="w-5 h-5 text-blue-400" /> Recent Signals
          </h2>
          {(stryMutAct_9fa48("57939") ? signals.length !== 0 : stryMutAct_9fa48("57938") ? false : stryMutAct_9fa48("57937") ? true : (stryCov_9fa48("57937", "57938", "57939"), signals.length === 0)) ? <div className="text-center py-12">
              <Radio className="w-12 h-12 mx-auto mb-3 text-blue-400 opacity-50" />
              <p className="text-slate-400 mb-4">No signals captured yet</p>
              <button onClick={stryMutAct_9fa48("57940") ? () => undefined : (stryCov_9fa48("57940"), () => setShowIntegrations(stryMutAct_9fa48("57941") ? false : (stryCov_9fa48("57941"), true)))} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm">
                Connect Security Tools →
              </button>
            </div> : <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredSignals.map(stryMutAct_9fa48("57942") ? () => undefined : (stryCov_9fa48("57942"), s => <div key={s.id} className="p-3 bg-slate-700/50 rounded-lg flex items-center gap-3">
                  <Activity className={`w-5 h-5 ${getSeverityColor(s.severity).split(' ')[0]}`} />
                  <div className="flex-1">
                    <div className="font-medium text-sm">{s.title}</div>
                    <div className="text-xs text-slate-400">{s.signalType} • Confidence: {Math.round(stryMutAct_9fa48("57945") ? s.confidence / 100 : (stryCov_9fa48("57945"), s.confidence * 100))}%</div>
                  </div>
                </div>))}
            </div>}
        </div>
      </div>
      {/* Integrations Modal */}
      {stryMutAct_9fa48("57948") ? showIntegrations || <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={() => setShowIntegrations(false)}>
          <div className="bg-slate-800 rounded-xl p-6 w-full max-w-2xl border border-slate-700" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold">Security Integrations</h3>
                <p className="text-sm text-slate-400">Connect your security tools to enable real-time threat detection</p>
              </div>
              <button onClick={() => setShowIntegrations(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <div className="space-y-3">
              {INTEGRATIONS.map(int => <div key={int.id} className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{int.icon}</span>
                    <div>
                      <div className="font-medium">{int.name}</div>
                      <div className="text-xs text-slate-400">{int.examples}</div>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm">
                    Connect
                  </button>
                </div>)}
            </div>
            <div className="mt-6 pt-4 border-t border-slate-700 text-center">
              <p className="text-xs text-slate-500">All integrations use encrypted connections. API keys are stored in your secure vault.</p>
            </div>
          </div>
        </div> : stryMutAct_9fa48("57947") ? false : stryMutAct_9fa48("57946") ? true : (stryCov_9fa48("57946", "57947", "57948"), showIntegrations && <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={stryMutAct_9fa48("57949") ? () => undefined : (stryCov_9fa48("57949"), () => setShowIntegrations(stryMutAct_9fa48("57950") ? true : (stryCov_9fa48("57950"), false)))}>
          <div className="bg-slate-800 rounded-xl p-6 w-full max-w-2xl border border-slate-700" onClick={stryMutAct_9fa48("57951") ? () => undefined : (stryCov_9fa48("57951"), e => e.stopPropagation())}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold">Security Integrations</h3>
                <p className="text-sm text-slate-400">Connect your security tools to enable real-time threat detection</p>
              </div>
              <button onClick={stryMutAct_9fa48("57952") ? () => undefined : (stryCov_9fa48("57952"), () => setShowIntegrations(stryMutAct_9fa48("57953") ? true : (stryCov_9fa48("57953"), false)))} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <div className="space-y-3">
              {INTEGRATIONS.map(stryMutAct_9fa48("57954") ? () => undefined : (stryCov_9fa48("57954"), int => <div key={int.id} className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{int.icon}</span>
                    <div>
                      <div className="font-medium">{int.name}</div>
                      <div className="text-xs text-slate-400">{int.examples}</div>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm">
                    Connect
                  </button>
                </div>))}
            </div>
            <div className="mt-6 pt-4 border-t border-slate-700 text-center">
              <p className="text-xs text-slate-500">All integrations use encrypted connections. API keys are stored in your secure vault.</p>
            </div>
          </div>
        </div>)}
    </div>;
};
export default AegisPage;