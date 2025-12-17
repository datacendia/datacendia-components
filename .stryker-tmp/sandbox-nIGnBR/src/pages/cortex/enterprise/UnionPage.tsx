// @ts-nocheck
// =============================================================================
// CENDIA UNION™ — EMPLOYEE RIGHTS & ADVOCACY MODULE
// First AI product marketed as union-grade protection
// Digital labor rights with burnout scoring and negotiation prep
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
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { unionService, Employee, WorkforceMetrics, BurnoutLevel, EmployeeRequest, NegotiationBrief } from '../../../services/UnionService';

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const UnionPage: React.FC = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<Employee[]>(stryMutAct_9fa48("35029") ? ["Stryker was here"] : (stryCov_9fa48("35029"), []));
  const [metrics, setMetrics] = useState<WorkforceMetrics | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'burnout' | 'rights' | 'negotiate'>('dashboard');
  const [showAddEmployee, setShowAddEmployee] = useState(stryMutAct_9fa48("35031") ? true : (stryCov_9fa48("35031"), false));
  const [showNegotiationBrief, setShowNegotiationBrief] = useState<NegotiationBrief | null>(null);
  const [isLoading, setIsLoading] = useState(stryMutAct_9fa48("35032") ? true : (stryCov_9fa48("35032"), false));
  const [ollamaStatus, setOllamaStatus] = useState(stryMutAct_9fa48("35033") ? true : (stryCov_9fa48("35033"), false));
  const loadData = useCallback(() => {
    setEmployees(unionService.getAllEmployees());
    setMetrics(unionService.getWorkforceMetrics());
    setOllamaStatus(unionService.isOllamaAvailable());
  }, stryMutAct_9fa48("35035") ? ["Stryker was here"] : (stryCov_9fa48("35035"), []));
  useEffect(() => {
    loadData();
    unionService.refreshOllamaStatus().then(stryMutAct_9fa48("35037") ? () => undefined : (stryCov_9fa48("35037"), () => setOllamaStatus(unionService.isOllamaAvailable())));
  }, stryMutAct_9fa48("35038") ? [] : (stryCov_9fa48("35038"), [loadData]));
  const getBurnoutColor = (level: BurnoutLevel) => {
    const colors = stryMutAct_9fa48("35040") ? {} : (stryCov_9fa48("35040"), {
      healthy: 'bg-green-600',
      caution: 'bg-yellow-600',
      warning: 'bg-orange-600',
      critical: 'bg-red-600',
      emergency: 'bg-red-800'
    });
    return colors[level];
  };
  const getBurnoutTextColor = (level: BurnoutLevel) => {
    const colors = stryMutAct_9fa48("35047") ? {} : (stryCov_9fa48("35047"), {
      healthy: 'text-green-400',
      caution: 'text-yellow-400',
      warning: 'text-orange-400',
      critical: 'text-red-400',
      emergency: 'text-red-300'
    });
    return colors[level];
  };
  const handlePrepareNegotiation = async (employeeId: string, requestId: string) => {
    setIsLoading(stryMutAct_9fa48("35054") ? false : (stryCov_9fa48("35054"), true));
    try {
      const brief = await unionService.prepareNegotiation(employeeId, requestId);
      setShowNegotiationBrief(brief);
      loadData();
    } finally {
      setIsLoading(stryMutAct_9fa48("35057") ? true : (stryCov_9fa48("35057"), false));
    }
  };
  const atRiskEmployees = stryMutAct_9fa48("35058") ? employees : (stryCov_9fa48("35058"), employees.filter(stryMutAct_9fa48("35059") ? () => undefined : (stryCov_9fa48("35059"), e => stryMutAct_9fa48("35062") ? (e.burnoutLevel === 'warning' || e.burnoutLevel === 'critical') && e.burnoutLevel === 'emergency' : stryMutAct_9fa48("35061") ? false : stryMutAct_9fa48("35060") ? true : (stryCov_9fa48("35060", "35061", "35062"), (stryMutAct_9fa48("35064") ? e.burnoutLevel === 'warning' && e.burnoutLevel === 'critical' : stryMutAct_9fa48("35063") ? false : (stryCov_9fa48("35063", "35064"), (stryMutAct_9fa48("35066") ? e.burnoutLevel !== 'warning' : stryMutAct_9fa48("35065") ? false : (stryCov_9fa48("35065", "35066"), e.burnoutLevel === 'warning')) || (stryMutAct_9fa48("35069") ? e.burnoutLevel !== 'critical' : stryMutAct_9fa48("35068") ? false : (stryCov_9fa48("35068", "35069"), e.burnoutLevel === 'critical')))) || (stryMutAct_9fa48("35072") ? e.burnoutLevel !== 'emergency' : stryMutAct_9fa48("35071") ? false : (stryCov_9fa48("35071", "35072"), e.burnoutLevel === 'emergency'))))));
  return <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-blue-800/50 bg-black/20 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={stryMutAct_9fa48("35074") ? () => undefined : (stryCov_9fa48("35074"), () => navigate('/cortex/dashboard'))} className="text-white/60 hover:text-white transition-colors">
                ← Back
              </button>
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-3">
                  <span className="text-3xl">✊</span>
                  CendiaUnion™
                  <span className="text-xs bg-gradient-to-r from-blue-500 to-cyan-500 px-2 py-0.5 rounded-full font-medium">
                    EMPLOYEE RIGHTS
                  </span>
                </h1>
                <p className="text-blue-300 text-sm">Digital Labor Rights • Burnout Protection • Negotiation Prep</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${ollamaStatus ? 'bg-green-900/50' : 'bg-red-900/50'}`}>
                <div className={`w-2 h-2 rounded-full ${ollamaStatus ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
                <span className="text-xs">{ollamaStatus ? 'AI Coach Active' : 'AI Offline'}</span>
              </div>
              <button onClick={stryMutAct_9fa48("35084") ? () => undefined : (stryCov_9fa48("35084"), () => setShowAddEmployee(stryMutAct_9fa48("35085") ? false : (stryCov_9fa48("35085"), true)))} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg font-medium transition-colors">
                + Add Employee
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Metrics Bar */}
      {stryMutAct_9fa48("35088") ? metrics || <div className="bg-gradient-to-r from-blue-900/30 to-cyan-900/30 border-b border-blue-800/30">
          <div className="max-w-7xl mx-auto px-6 py-3">
            <div className="grid grid-cols-7 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-white">{metrics.totalEmployees}</div>
                <div className="text-xs text-blue-300">Employees</div>
              </div>
              <div>
                <div className={`text-2xl font-bold ${metrics.avgBurnoutScore > 60 ? 'text-red-400' : metrics.avgBurnoutScore > 40 ? 'text-amber-400' : 'text-green-400'}`}>
                  {metrics.avgBurnoutScore}%
                </div>
                <div className="text-xs text-blue-300">Avg Burnout</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-400">{metrics.burnoutDistribution.critical + metrics.burnoutDistribution.emergency}</div>
                <div className="text-xs text-blue-300">At Risk</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-amber-400">{metrics.openViolations}</div>
                <div className="text-xs text-blue-300">Open Violations</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-cyan-400">{metrics.pendingRequests}</div>
                <div className="text-xs text-blue-300">Pending Requests</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-400">{metrics.overtimeAverage}h</div>
                <div className="text-xs text-blue-300">Avg Overtime</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-400">{metrics.avgTenure}y</div>
                <div className="text-xs text-blue-300">Avg Tenure</div>
              </div>
            </div>
          </div>
        </div> : stryMutAct_9fa48("35087") ? false : stryMutAct_9fa48("35086") ? true : (stryCov_9fa48("35086", "35087", "35088"), metrics && <div className="bg-gradient-to-r from-blue-900/30 to-cyan-900/30 border-b border-blue-800/30">
          <div className="max-w-7xl mx-auto px-6 py-3">
            <div className="grid grid-cols-7 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-white">{metrics.totalEmployees}</div>
                <div className="text-xs text-blue-300">Employees</div>
              </div>
              <div>
                <div className={`text-2xl font-bold ${(stryMutAct_9fa48("35093") ? metrics.avgBurnoutScore <= 60 : stryMutAct_9fa48("35092") ? metrics.avgBurnoutScore >= 60 : stryMutAct_9fa48("35091") ? false : stryMutAct_9fa48("35090") ? true : (stryCov_9fa48("35090", "35091", "35092", "35093"), metrics.avgBurnoutScore > 60)) ? 'text-red-400' : (stryMutAct_9fa48("35098") ? metrics.avgBurnoutScore <= 40 : stryMutAct_9fa48("35097") ? metrics.avgBurnoutScore >= 40 : stryMutAct_9fa48("35096") ? false : stryMutAct_9fa48("35095") ? true : (stryCov_9fa48("35095", "35096", "35097", "35098"), metrics.avgBurnoutScore > 40)) ? 'text-amber-400' : 'text-green-400'}`}>
                  {metrics.avgBurnoutScore}%
                </div>
                <div className="text-xs text-blue-300">Avg Burnout</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-400">{stryMutAct_9fa48("35101") ? metrics.burnoutDistribution.critical - metrics.burnoutDistribution.emergency : (stryCov_9fa48("35101"), metrics.burnoutDistribution.critical + metrics.burnoutDistribution.emergency)}</div>
                <div className="text-xs text-blue-300">At Risk</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-amber-400">{metrics.openViolations}</div>
                <div className="text-xs text-blue-300">Open Violations</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-cyan-400">{metrics.pendingRequests}</div>
                <div className="text-xs text-blue-300">Pending Requests</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-400">{metrics.overtimeAverage}h</div>
                <div className="text-xs text-blue-300">Avg Overtime</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-400">{metrics.avgTenure}y</div>
                <div className="text-xs text-blue-300">Avg Tenure</div>
              </div>
            </div>
          </div>
        </div>)}

      {/* Tabs */}
      <div className="border-b border-blue-800/30 bg-black/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1">
            {(['dashboard', 'burnout', 'rights', 'negotiate'] as const).map(stryMutAct_9fa48("35102") ? () => undefined : (stryCov_9fa48("35102"), tab => <button key={tab} onClick={stryMutAct_9fa48("35103") ? () => undefined : (stryCov_9fa48("35103"), () => setActiveTab(tab))} className={`px-4 py-3 text-sm font-medium transition-colors ${(stryMutAct_9fa48("35107") ? activeTab !== tab : stryMutAct_9fa48("35106") ? false : stryMutAct_9fa48("35105") ? true : (stryCov_9fa48("35105", "35106", "35107"), activeTab === tab)) ? 'text-white border-b-2 border-blue-500' : 'text-white/60 hover:text-white'}`}>
                {(stryMutAct_9fa48("35112") ? tab !== 'negotiate' : stryMutAct_9fa48("35111") ? false : stryMutAct_9fa48("35110") ? true : (stryCov_9fa48("35110", "35111", "35112"), tab === 'negotiate')) ? 'Negotiation Prep' : stryMutAct_9fa48("35115") ? tab.charAt(0).toUpperCase() - tab.slice(1) : (stryCov_9fa48("35115"), (stryMutAct_9fa48("35117") ? tab.toUpperCase() : stryMutAct_9fa48("35116") ? tab.charAt(0).toLowerCase() : (stryCov_9fa48("35116", "35117"), tab.charAt(0).toUpperCase())) + (stryMutAct_9fa48("35118") ? tab : (stryCov_9fa48("35118"), tab.slice(1))))}
              </button>))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {stryMutAct_9fa48("35121") ? activeTab === 'dashboard' || <div className="grid grid-cols-3 gap-6">
            {/* At Risk Employees */}
            <div className="col-span-2 bg-black/30 rounded-2xl p-6 border border-blue-800/50">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span className="text-red-400">⚠️</span> At-Risk Employees
              </h2>
              {atRiskEmployees.length > 0 ? <div className="space-y-3">
                  {atRiskEmployees.map(emp => <div key={emp.id} onClick={() => setSelectedEmployee(emp)} className="p-4 bg-black/20 rounded-xl cursor-pointer hover:bg-black/30 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="font-semibold">{emp.name}</h3>
                          <p className="text-sm text-white/60">{emp.role} • {emp.department}</p>
                        </div>
                        <div className="text-right">
                          <span className={`px-2 py-0.5 rounded text-xs ${getBurnoutColor(emp.burnoutLevel)}`}>
                            {emp.burnoutLevel.toUpperCase()}
                          </span>
                          <div className={`text-lg font-bold mt-1 ${getBurnoutTextColor(emp.burnoutLevel)}`}>
                            {emp.burnoutScore}%
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {emp.burnoutFactors.slice(0, 3).map(f => <span key={f.id} className="px-2 py-0.5 bg-red-900/30 rounded text-xs text-red-300">
                            {f.name}
                          </span>)}
                      </div>
                    </div>)}
                </div> : <div className="text-center py-8 text-white/40">
                  No at-risk employees detected. Workforce is healthy! 🎉
                </div>}
            </div>

            {/* Burnout Distribution */}
            <div className="bg-black/30 rounded-2xl p-6 border border-blue-800/50">
              <h2 className="text-lg font-bold mb-4">Burnout Distribution</h2>
              {metrics && <div className="space-y-3">
                  {(['healthy', 'caution', 'warning', 'critical', 'emergency'] as BurnoutLevel[]).map(level => <div key={level} className="flex items-center gap-3">
                      <span className={`w-3 h-3 rounded-full ${getBurnoutColor(level)}`} />
                      <span className="flex-1 text-sm capitalize">{level}</span>
                      <span className="font-bold">{metrics.burnoutDistribution[level]}</span>
                    </div>)}
                </div>}
              
              <div className="mt-6 pt-6 border-t border-blue-800/30">
                <h3 className="text-sm font-semibold text-white/60 mb-3">Rights Violations</h3>
                {metrics && Object.entries(metrics.rightsByType).filter(([_, v]) => v.violations > 0).length > 0 ? <div className="space-y-2">
                    {Object.entries(metrics.rightsByType).filter(([_, v]) => v.violations > 0).map(([type, data]) => <div key={type} className="flex items-center justify-between text-sm">
                          <span className="capitalize">{type.replace(/_/g, ' ')}</span>
                          <span className="text-red-400">{data.violations} open</span>
                        </div>)}
                  </div> : <div className="text-center text-white/40 text-sm">No violations reported</div>}
              </div>
            </div>
          </div> : stryMutAct_9fa48("35120") ? false : stryMutAct_9fa48("35119") ? true : (stryCov_9fa48("35119", "35120", "35121"), (stryMutAct_9fa48("35123") ? activeTab !== 'dashboard' : stryMutAct_9fa48("35122") ? true : (stryCov_9fa48("35122", "35123"), activeTab === 'dashboard')) && <div className="grid grid-cols-3 gap-6">
            {/* At Risk Employees */}
            <div className="col-span-2 bg-black/30 rounded-2xl p-6 border border-blue-800/50">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span className="text-red-400">⚠️</span> At-Risk Employees
              </h2>
              {(stryMutAct_9fa48("35128") ? atRiskEmployees.length <= 0 : stryMutAct_9fa48("35127") ? atRiskEmployees.length >= 0 : stryMutAct_9fa48("35126") ? false : stryMutAct_9fa48("35125") ? true : (stryCov_9fa48("35125", "35126", "35127", "35128"), atRiskEmployees.length > 0)) ? <div className="space-y-3">
                  {atRiskEmployees.map(stryMutAct_9fa48("35129") ? () => undefined : (stryCov_9fa48("35129"), emp => <div key={emp.id} onClick={stryMutAct_9fa48("35130") ? () => undefined : (stryCov_9fa48("35130"), () => setSelectedEmployee(emp))} className="p-4 bg-black/20 rounded-xl cursor-pointer hover:bg-black/30 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="font-semibold">{emp.name}</h3>
                          <p className="text-sm text-white/60">{emp.role} • {emp.department}</p>
                        </div>
                        <div className="text-right">
                          <span className={`px-2 py-0.5 rounded text-xs ${getBurnoutColor(emp.burnoutLevel)}`}>
                            {stryMutAct_9fa48("35132") ? emp.burnoutLevel.toLowerCase() : (stryCov_9fa48("35132"), emp.burnoutLevel.toUpperCase())}
                          </span>
                          <div className={`text-lg font-bold mt-1 ${getBurnoutTextColor(emp.burnoutLevel)}`}>
                            {emp.burnoutScore}%
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {stryMutAct_9fa48("35134") ? emp.burnoutFactors.map(f => <span key={f.id} className="px-2 py-0.5 bg-red-900/30 rounded text-xs text-red-300">
                            {f.name}
                          </span>) : (stryCov_9fa48("35134"), emp.burnoutFactors.slice(0, 3).map(stryMutAct_9fa48("35135") ? () => undefined : (stryCov_9fa48("35135"), f => <span key={f.id} className="px-2 py-0.5 bg-red-900/30 rounded text-xs text-red-300">
                            {f.name}
                          </span>)))}
                      </div>
                    </div>))}
                </div> : <div className="text-center py-8 text-white/40">
                  No at-risk employees detected. Workforce is healthy! 🎉
                </div>}
            </div>

            {/* Burnout Distribution */}
            <div className="bg-black/30 rounded-2xl p-6 border border-blue-800/50">
              <h2 className="text-lg font-bold mb-4">Burnout Distribution</h2>
              {stryMutAct_9fa48("35138") ? metrics || <div className="space-y-3">
                  {(['healthy', 'caution', 'warning', 'critical', 'emergency'] as BurnoutLevel[]).map(level => <div key={level} className="flex items-center gap-3">
                      <span className={`w-3 h-3 rounded-full ${getBurnoutColor(level)}`} />
                      <span className="flex-1 text-sm capitalize">{level}</span>
                      <span className="font-bold">{metrics.burnoutDistribution[level]}</span>
                    </div>)}
                </div> : stryMutAct_9fa48("35137") ? false : stryMutAct_9fa48("35136") ? true : (stryCov_9fa48("35136", "35137", "35138"), metrics && <div className="space-y-3">
                  {(['healthy', 'caution', 'warning', 'critical', 'emergency'] as BurnoutLevel[]).map(stryMutAct_9fa48("35139") ? () => undefined : (stryCov_9fa48("35139"), level => <div key={level} className="flex items-center gap-3">
                      <span className={`w-3 h-3 rounded-full ${getBurnoutColor(level)}`} />
                      <span className="flex-1 text-sm capitalize">{level}</span>
                      <span className="font-bold">{metrics.burnoutDistribution[level]}</span>
                    </div>))}
                </div>)}
              
              <div className="mt-6 pt-6 border-t border-blue-800/30">
                <h3 className="text-sm font-semibold text-white/60 mb-3">Rights Violations</h3>
                {(stryMutAct_9fa48("35143") ? metrics || Object.entries(metrics.rightsByType).filter(([_, v]) => v.violations > 0).length > 0 : stryMutAct_9fa48("35142") ? false : stryMutAct_9fa48("35141") ? true : (stryCov_9fa48("35141", "35142", "35143"), metrics && (stryMutAct_9fa48("35146") ? Object.entries(metrics.rightsByType).filter(([_, v]) => v.violations > 0).length <= 0 : stryMutAct_9fa48("35145") ? Object.entries(metrics.rightsByType).filter(([_, v]) => v.violations > 0).length >= 0 : stryMutAct_9fa48("35144") ? true : (stryCov_9fa48("35144", "35145", "35146"), (stryMutAct_9fa48("35147") ? Object.entries(metrics.rightsByType).length : (stryCov_9fa48("35147"), Object.entries(metrics.rightsByType).filter(stryMutAct_9fa48("35148") ? () => undefined : (stryCov_9fa48("35148"), ([_, v]) => stryMutAct_9fa48("35152") ? v.violations <= 0 : stryMutAct_9fa48("35151") ? v.violations >= 0 : stryMutAct_9fa48("35150") ? false : stryMutAct_9fa48("35149") ? true : (stryCov_9fa48("35149", "35150", "35151", "35152"), v.violations > 0))).length)) > 0)))) ? <div className="space-y-2">
                    {stryMutAct_9fa48("35153") ? Object.entries(metrics.rightsByType).map(([type, data]) => <div key={type} className="flex items-center justify-between text-sm">
                          <span className="capitalize">{type.replace(/_/g, ' ')}</span>
                          <span className="text-red-400">{data.violations} open</span>
                        </div>) : (stryCov_9fa48("35153"), Object.entries(metrics.rightsByType).filter(stryMutAct_9fa48("35154") ? () => undefined : (stryCov_9fa48("35154"), ([_, v]) => stryMutAct_9fa48("35158") ? v.violations <= 0 : stryMutAct_9fa48("35157") ? v.violations >= 0 : stryMutAct_9fa48("35156") ? false : stryMutAct_9fa48("35155") ? true : (stryCov_9fa48("35155", "35156", "35157", "35158"), v.violations > 0))).map(stryMutAct_9fa48("35159") ? () => undefined : (stryCov_9fa48("35159"), ([type, data]) => <div key={type} className="flex items-center justify-between text-sm">
                          <span className="capitalize">{type.replace(/_/g, ' ')}</span>
                          <span className="text-red-400">{data.violations} open</span>
                        </div>)))}
                  </div> : <div className="text-center text-white/40 text-sm">No violations reported</div>}
              </div>
            </div>
          </div>)}

        {stryMutAct_9fa48("35163") ? activeTab === 'burnout' || <div className="grid grid-cols-4 gap-4">
            {employees.map(emp => <div key={emp.id} onClick={() => setSelectedEmployee(emp)} className="bg-black/30 rounded-xl p-4 border border-blue-800/50 cursor-pointer hover:border-blue-500 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-sm">{emp.name}</h3>
                    <p className="text-xs text-white/50">{emp.role}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-xs ${getBurnoutColor(emp.burnoutLevel)}`}>
                    {emp.burnoutScore}%
                  </span>
                </div>
                
                {/* Burnout meter */}
                <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                  <div className={`h-full transition-all ${emp.burnoutScore >= 65 ? 'bg-red-500' : emp.burnoutScore >= 50 ? 'bg-orange-500' : emp.burnoutScore >= 30 ? 'bg-yellow-500' : 'bg-green-500'}`} style={{
              width: `${emp.burnoutScore}%`
            }} />
                </div>
                
                <div className="mt-3 text-xs text-white/50">
                  {emp.avgHoursPerWeek}h/week • {emp.overtimeHoursThisMonth}h OT
                </div>
              </div>)}
            {employees.length === 0 && <div className="col-span-4 text-center py-12 text-white/40">
                No employees added yet. Click "Add Employee" to get started.
              </div>}
          </div> : stryMutAct_9fa48("35162") ? false : stryMutAct_9fa48("35161") ? true : (stryCov_9fa48("35161", "35162", "35163"), (stryMutAct_9fa48("35165") ? activeTab !== 'burnout' : stryMutAct_9fa48("35164") ? true : (stryCov_9fa48("35164", "35165"), activeTab === 'burnout')) && <div className="grid grid-cols-4 gap-4">
            {employees.map(stryMutAct_9fa48("35167") ? () => undefined : (stryCov_9fa48("35167"), emp => <div key={emp.id} onClick={stryMutAct_9fa48("35168") ? () => undefined : (stryCov_9fa48("35168"), () => setSelectedEmployee(emp))} className="bg-black/30 rounded-xl p-4 border border-blue-800/50 cursor-pointer hover:border-blue-500 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-sm">{emp.name}</h3>
                    <p className="text-xs text-white/50">{emp.role}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-xs ${getBurnoutColor(emp.burnoutLevel)}`}>
                    {emp.burnoutScore}%
                  </span>
                </div>
                
                {/* Burnout meter */}
                <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                  <div className={`h-full transition-all ${(stryMutAct_9fa48("35174") ? emp.burnoutScore < 65 : stryMutAct_9fa48("35173") ? emp.burnoutScore > 65 : stryMutAct_9fa48("35172") ? false : stryMutAct_9fa48("35171") ? true : (stryCov_9fa48("35171", "35172", "35173", "35174"), emp.burnoutScore >= 65)) ? 'bg-red-500' : (stryMutAct_9fa48("35179") ? emp.burnoutScore < 50 : stryMutAct_9fa48("35178") ? emp.burnoutScore > 50 : stryMutAct_9fa48("35177") ? false : stryMutAct_9fa48("35176") ? true : (stryCov_9fa48("35176", "35177", "35178", "35179"), emp.burnoutScore >= 50)) ? 'bg-orange-500' : (stryMutAct_9fa48("35184") ? emp.burnoutScore < 30 : stryMutAct_9fa48("35183") ? emp.burnoutScore > 30 : stryMutAct_9fa48("35182") ? false : stryMutAct_9fa48("35181") ? true : (stryCov_9fa48("35181", "35182", "35183", "35184"), emp.burnoutScore >= 30)) ? 'bg-yellow-500' : 'bg-green-500'}`} style={stryMutAct_9fa48("35187") ? {} : (stryCov_9fa48("35187"), {
              width: `${emp.burnoutScore}%`
            })} />
                </div>
                
                <div className="mt-3 text-xs text-white/50">
                  {emp.avgHoursPerWeek}h/week • {emp.overtimeHoursThisMonth}h OT
                </div>
              </div>))}
            {stryMutAct_9fa48("35191") ? employees.length === 0 || <div className="col-span-4 text-center py-12 text-white/40">
                No employees added yet. Click "Add Employee" to get started.
              </div> : stryMutAct_9fa48("35190") ? false : stryMutAct_9fa48("35189") ? true : (stryCov_9fa48("35189", "35190", "35191"), (stryMutAct_9fa48("35193") ? employees.length !== 0 : stryMutAct_9fa48("35192") ? true : (stryCov_9fa48("35192", "35193"), employees.length === 0)) && <div className="col-span-4 text-center py-12 text-white/40">
                No employees added yet. Click "Add Employee" to get started.
              </div>)}
          </div>)}

        {stryMutAct_9fa48("35196") ? activeTab === 'rights' || <div className="space-y-4">
            <div className="grid grid-cols-4 gap-4 mb-6">
              {(['compensation', 'time_off', 'workload', 'safety', 'privacy', 'dignity', 'growth', 'voice'] as const).map(right => <div key={right} className="bg-black/30 rounded-xl p-4 border border-blue-800/50 text-center">
                  <div className="text-2xl mb-2">
                    {right === 'compensation' ? '💰' : right === 'time_off' ? '🏖️' : right === 'workload' ? '⚖️' : right === 'safety' ? '🛡️' : right === 'privacy' ? '🔒' : right === 'dignity' ? '🤝' : right === 'growth' ? '📈' : '📢'}
                  </div>
                  <div className="font-semibold text-sm capitalize">{right.replace(/_/g, ' ')}</div>
                  <div className="text-xs text-white/50 mt-1">
                    {metrics?.rightsByType[right]?.violations || 0} violations
                  </div>
                </div>)}
            </div>
            
            <div className="bg-black/30 rounded-2xl p-6 border border-blue-800/50">
              <h2 className="text-lg font-bold mb-4">Recent Violations</h2>
              {employees.flatMap(e => e.rightsViolations.map(v => ({
            ...v,
            employee: e
          }))).length > 0 ? <div className="space-y-3">
                  {employees.flatMap(e => e.rightsViolations.map(v => ({
              ...v,
              employee: e
            }))).slice(0, 10).map(v => <div key={v.id} className="p-4 bg-black/20 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <span className="font-semibold">{v.employee.name}</span>
                          <span className="text-white/50"> • </span>
                          <span className="capitalize">{v.type.replace(/_/g, ' ')}</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-xs ${v.severity === 'critical' ? 'bg-red-600' : v.severity === 'severe' ? 'bg-orange-600' : v.severity === 'moderate' ? 'bg-amber-600' : 'bg-gray-600'}`}>
                          {v.severity}
                        </span>
                      </div>
                      <p className="text-sm text-white/70">{v.description}</p>
                      <div className="flex items-center justify-between mt-2 text-xs text-white/40">
                        <span>{v.occurredAt.toLocaleDateString()}</span>
                        <span className={v.status === 'resolved' ? 'text-green-400' : 'text-amber-400'}>
                          {v.status}
                        </span>
                      </div>
                    </div>)}
                </div> : <div className="text-center py-8 text-white/40">
                  No violations reported. Employee rights are being respected! ✅
                </div>}
            </div>
          </div> : stryMutAct_9fa48("35195") ? false : stryMutAct_9fa48("35194") ? true : (stryCov_9fa48("35194", "35195", "35196"), (stryMutAct_9fa48("35198") ? activeTab !== 'rights' : stryMutAct_9fa48("35197") ? true : (stryCov_9fa48("35197", "35198"), activeTab === 'rights')) && <div className="space-y-4">
            <div className="grid grid-cols-4 gap-4 mb-6">
              {(['compensation', 'time_off', 'workload', 'safety', 'privacy', 'dignity', 'growth', 'voice'] as const).map(stryMutAct_9fa48("35200") ? () => undefined : (stryCov_9fa48("35200"), right => <div key={right} className="bg-black/30 rounded-xl p-4 border border-blue-800/50 text-center">
                  <div className="text-2xl mb-2">
                    {(stryMutAct_9fa48("35203") ? right !== 'compensation' : stryMutAct_9fa48("35202") ? false : stryMutAct_9fa48("35201") ? true : (stryCov_9fa48("35201", "35202", "35203"), right === 'compensation')) ? '💰' : (stryMutAct_9fa48("35208") ? right !== 'time_off' : stryMutAct_9fa48("35207") ? false : stryMutAct_9fa48("35206") ? true : (stryCov_9fa48("35206", "35207", "35208"), right === 'time_off')) ? '🏖️' : (stryMutAct_9fa48("35213") ? right !== 'workload' : stryMutAct_9fa48("35212") ? false : stryMutAct_9fa48("35211") ? true : (stryCov_9fa48("35211", "35212", "35213"), right === 'workload')) ? '⚖️' : (stryMutAct_9fa48("35218") ? right !== 'safety' : stryMutAct_9fa48("35217") ? false : stryMutAct_9fa48("35216") ? true : (stryCov_9fa48("35216", "35217", "35218"), right === 'safety')) ? '🛡️' : (stryMutAct_9fa48("35223") ? right !== 'privacy' : stryMutAct_9fa48("35222") ? false : stryMutAct_9fa48("35221") ? true : (stryCov_9fa48("35221", "35222", "35223"), right === 'privacy')) ? '🔒' : (stryMutAct_9fa48("35228") ? right !== 'dignity' : stryMutAct_9fa48("35227") ? false : stryMutAct_9fa48("35226") ? true : (stryCov_9fa48("35226", "35227", "35228"), right === 'dignity')) ? '🤝' : (stryMutAct_9fa48("35233") ? right !== 'growth' : stryMutAct_9fa48("35232") ? false : stryMutAct_9fa48("35231") ? true : (stryCov_9fa48("35231", "35232", "35233"), right === 'growth')) ? '📈' : '📢'}
                  </div>
                  <div className="font-semibold text-sm capitalize">{right.replace(/_/g, ' ')}</div>
                  <div className="text-xs text-white/50 mt-1">
                    {stryMutAct_9fa48("35240") ? metrics?.rightsByType[right]?.violations && 0 : stryMutAct_9fa48("35239") ? false : stryMutAct_9fa48("35238") ? true : (stryCov_9fa48("35238", "35239", "35240"), (stryMutAct_9fa48("35242") ? metrics.rightsByType[right]?.violations : stryMutAct_9fa48("35241") ? metrics?.rightsByType[right].violations : (stryCov_9fa48("35241", "35242"), metrics?.rightsByType[right]?.violations)) || 0)} violations
                  </div>
                </div>))}
            </div>
            
            <div className="bg-black/30 rounded-2xl p-6 border border-blue-800/50">
              <h2 className="text-lg font-bold mb-4">Recent Violations</h2>
              {(stryMutAct_9fa48("35246") ? employees.flatMap(e => e.rightsViolations.map(v => ({
            ...v,
            employee: e
          }))).length <= 0 : stryMutAct_9fa48("35245") ? employees.flatMap(e => e.rightsViolations.map(v => ({
            ...v,
            employee: e
          }))).length >= 0 : stryMutAct_9fa48("35244") ? false : stryMutAct_9fa48("35243") ? true : (stryCov_9fa48("35243", "35244", "35245", "35246"), employees.flatMap(stryMutAct_9fa48("35247") ? () => undefined : (stryCov_9fa48("35247"), e => e.rightsViolations.map(stryMutAct_9fa48("35248") ? () => undefined : (stryCov_9fa48("35248"), v => stryMutAct_9fa48("35249") ? {} : (stryCov_9fa48("35249"), {
            ...v,
            employee: e
          }))))).length > 0)) ? <div className="space-y-3">
                  {stryMutAct_9fa48("35250") ? employees.flatMap(e => e.rightsViolations.map(v => ({
              ...v,
              employee: e
            }))).map(v => <div key={v.id} className="p-4 bg-black/20 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <span className="font-semibold">{v.employee.name}</span>
                          <span className="text-white/50"> • </span>
                          <span className="capitalize">{v.type.replace(/_/g, ' ')}</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-xs ${v.severity === 'critical' ? 'bg-red-600' : v.severity === 'severe' ? 'bg-orange-600' : v.severity === 'moderate' ? 'bg-amber-600' : 'bg-gray-600'}`}>
                          {v.severity}
                        </span>
                      </div>
                      <p className="text-sm text-white/70">{v.description}</p>
                      <div className="flex items-center justify-between mt-2 text-xs text-white/40">
                        <span>{v.occurredAt.toLocaleDateString()}</span>
                        <span className={v.status === 'resolved' ? 'text-green-400' : 'text-amber-400'}>
                          {v.status}
                        </span>
                      </div>
                    </div>) : (stryCov_9fa48("35250"), employees.flatMap(stryMutAct_9fa48("35251") ? () => undefined : (stryCov_9fa48("35251"), e => e.rightsViolations.map(stryMutAct_9fa48("35252") ? () => undefined : (stryCov_9fa48("35252"), v => stryMutAct_9fa48("35253") ? {} : (stryCov_9fa48("35253"), {
              ...v,
              employee: e
            }))))).slice(0, 10).map(stryMutAct_9fa48("35254") ? () => undefined : (stryCov_9fa48("35254"), v => <div key={v.id} className="p-4 bg-black/20 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <span className="font-semibold">{v.employee.name}</span>
                          <span className="text-white/50"> • </span>
                          <span className="capitalize">{v.type.replace(/_/g, ' ')}</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-xs ${(stryMutAct_9fa48("35259") ? v.severity !== 'critical' : stryMutAct_9fa48("35258") ? false : stryMutAct_9fa48("35257") ? true : (stryCov_9fa48("35257", "35258", "35259"), v.severity === 'critical')) ? 'bg-red-600' : (stryMutAct_9fa48("35264") ? v.severity !== 'severe' : stryMutAct_9fa48("35263") ? false : stryMutAct_9fa48("35262") ? true : (stryCov_9fa48("35262", "35263", "35264"), v.severity === 'severe')) ? 'bg-orange-600' : (stryMutAct_9fa48("35269") ? v.severity !== 'moderate' : stryMutAct_9fa48("35268") ? false : stryMutAct_9fa48("35267") ? true : (stryCov_9fa48("35267", "35268", "35269"), v.severity === 'moderate')) ? 'bg-amber-600' : 'bg-gray-600'}`}>
                          {v.severity}
                        </span>
                      </div>
                      <p className="text-sm text-white/70">{v.description}</p>
                      <div className="flex items-center justify-between mt-2 text-xs text-white/40">
                        <span>{v.occurredAt.toLocaleDateString()}</span>
                        <span className={(stryMutAct_9fa48("35275") ? v.status !== 'resolved' : stryMutAct_9fa48("35274") ? false : stryMutAct_9fa48("35273") ? true : (stryCov_9fa48("35273", "35274", "35275"), v.status === 'resolved')) ? 'text-green-400' : 'text-amber-400'}>
                          {v.status}
                        </span>
                      </div>
                    </div>)))}
                </div> : <div className="text-center py-8 text-white/40">
                  No violations reported. Employee rights are being respected! ✅
                </div>}
            </div>
          </div>)}

        {stryMutAct_9fa48("35281") ? activeTab === 'negotiate' || <div className="grid grid-cols-2 gap-6">
            <div className="bg-black/30 rounded-2xl p-6 border border-blue-800/50">
              <h2 className="text-lg font-bold mb-4">Pending Requests</h2>
              <div className="space-y-3">
                {employees.flatMap(e => e.pendingRequests.filter(r => r.status !== 'approved' && r.status !== 'denied').map(r => ({
              ...r,
              employee: e
            }))).map(req => <div key={req.id} className="p-4 bg-black/20 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="font-semibold">{req.title}</h3>
                        <p className="text-xs text-white/50">{req.employee.name} • {req.type}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-xs ${req.priority === 'urgent' ? 'bg-red-600' : req.priority === 'high' ? 'bg-orange-600' : 'bg-blue-600'}`}>
                        {req.priority}
                      </span>
                    </div>
                    <p className="text-sm text-white/60 mb-3">{req.description}</p>
                    <div className="flex gap-2">
                      {!req.aiPrepared ? <button onClick={() => handlePrepareNegotiation(req.employee.id, req.id)} disabled={isLoading} className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm disabled:opacity-50">
                          {isLoading ? 'Preparing...' : '🤖 AI Prep Negotiation'}
                        </button> : <button onClick={() => setShowNegotiationBrief(req.negotiationBrief!)} className="px-3 py-1.5 bg-green-600 hover:bg-green-500 rounded-lg text-sm">
                          📋 View Brief
                        </button>}
                    </div>
                  </div>)}
                {employees.flatMap(e => e.pendingRequests).length === 0 && <div className="text-center py-8 text-white/40">
                    No pending requests
                  </div>}
              </div>
            </div>

            <div className="bg-black/30 rounded-2xl p-6 border border-blue-800/50">
              <h2 className="text-lg font-bold mb-4">Negotiation Tips</h2>
              <div className="space-y-4">
                <div className="p-4 bg-blue-900/30 rounded-xl">
                  <h3 className="font-semibold text-blue-300 mb-2">📊 Know Your Worth</h3>
                  <p className="text-sm text-white/70">Research market rates for your role. Our AI analyzes industry data to give you accurate salary ranges.</p>
                </div>
                <div className="p-4 bg-blue-900/30 rounded-xl">
                  <h3 className="font-semibold text-blue-300 mb-2">📝 Document Everything</h3>
                  <p className="text-sm text-white/70">Keep records of achievements, overtime, and any rights concerns. The Union module tracks this automatically.</p>
                </div>
                <div className="p-4 bg-blue-900/30 rounded-xl">
                  <h3 className="font-semibold text-blue-300 mb-2">⏰ Timing Matters</h3>
                  <p className="text-sm text-white/70">Ask after successful projects or during budget planning. Our AI identifies optimal timing.</p>
                </div>
                <div className="p-4 bg-blue-900/30 rounded-xl">
                  <h3 className="font-semibold text-blue-300 mb-2">🎯 Be Specific</h3>
                  <p className="text-sm text-white/70">Have a clear ask range. Our negotiation briefs provide minimum, target, and stretch numbers.</p>
                </div>
              </div>
            </div>
          </div> : stryMutAct_9fa48("35280") ? false : stryMutAct_9fa48("35279") ? true : (stryCov_9fa48("35279", "35280", "35281"), (stryMutAct_9fa48("35283") ? activeTab !== 'negotiate' : stryMutAct_9fa48("35282") ? true : (stryCov_9fa48("35282", "35283"), activeTab === 'negotiate')) && <div className="grid grid-cols-2 gap-6">
            <div className="bg-black/30 rounded-2xl p-6 border border-blue-800/50">
              <h2 className="text-lg font-bold mb-4">Pending Requests</h2>
              <div className="space-y-3">
                {employees.flatMap(stryMutAct_9fa48("35285") ? () => undefined : (stryCov_9fa48("35285"), e => stryMutAct_9fa48("35286") ? e.pendingRequests.map(r => ({
              ...r,
              employee: e
            })) : (stryCov_9fa48("35286"), e.pendingRequests.filter(stryMutAct_9fa48("35287") ? () => undefined : (stryCov_9fa48("35287"), r => stryMutAct_9fa48("35290") ? r.status !== 'approved' || r.status !== 'denied' : stryMutAct_9fa48("35289") ? false : stryMutAct_9fa48("35288") ? true : (stryCov_9fa48("35288", "35289", "35290"), (stryMutAct_9fa48("35292") ? r.status === 'approved' : stryMutAct_9fa48("35291") ? true : (stryCov_9fa48("35291", "35292"), r.status !== 'approved')) && (stryMutAct_9fa48("35295") ? r.status === 'denied' : stryMutAct_9fa48("35294") ? true : (stryCov_9fa48("35294", "35295"), r.status !== 'denied'))))).map(stryMutAct_9fa48("35297") ? () => undefined : (stryCov_9fa48("35297"), r => stryMutAct_9fa48("35298") ? {} : (stryCov_9fa48("35298"), {
              ...r,
              employee: e
            })))))).map(stryMutAct_9fa48("35299") ? () => undefined : (stryCov_9fa48("35299"), req => <div key={req.id} className="p-4 bg-black/20 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="font-semibold">{req.title}</h3>
                        <p className="text-xs text-white/50">{req.employee.name} • {req.type}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-xs ${(stryMutAct_9fa48("35303") ? req.priority !== 'urgent' : stryMutAct_9fa48("35302") ? false : stryMutAct_9fa48("35301") ? true : (stryCov_9fa48("35301", "35302", "35303"), req.priority === 'urgent')) ? 'bg-red-600' : (stryMutAct_9fa48("35308") ? req.priority !== 'high' : stryMutAct_9fa48("35307") ? false : stryMutAct_9fa48("35306") ? true : (stryCov_9fa48("35306", "35307", "35308"), req.priority === 'high')) ? 'bg-orange-600' : 'bg-blue-600'}`}>
                        {req.priority}
                      </span>
                    </div>
                    <p className="text-sm text-white/60 mb-3">{req.description}</p>
                    <div className="flex gap-2">
                      {(stryMutAct_9fa48("35312") ? req.aiPrepared : (stryCov_9fa48("35312"), !req.aiPrepared)) ? <button onClick={stryMutAct_9fa48("35313") ? () => undefined : (stryCov_9fa48("35313"), () => handlePrepareNegotiation(req.employee.id, req.id))} disabled={isLoading} className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm disabled:opacity-50">
                          {isLoading ? 'Preparing...' : '🤖 AI Prep Negotiation'}
                        </button> : <button onClick={stryMutAct_9fa48("35316") ? () => undefined : (stryCov_9fa48("35316"), () => setShowNegotiationBrief(req.negotiationBrief!))} className="px-3 py-1.5 bg-green-600 hover:bg-green-500 rounded-lg text-sm">
                          📋 View Brief
                        </button>}
                    </div>
                  </div>))}
                {stryMutAct_9fa48("35319") ? employees.flatMap(e => e.pendingRequests).length === 0 || <div className="text-center py-8 text-white/40">
                    No pending requests
                  </div> : stryMutAct_9fa48("35318") ? false : stryMutAct_9fa48("35317") ? true : (stryCov_9fa48("35317", "35318", "35319"), (stryMutAct_9fa48("35321") ? employees.flatMap(e => e.pendingRequests).length !== 0 : stryMutAct_9fa48("35320") ? true : (stryCov_9fa48("35320", "35321"), employees.flatMap(stryMutAct_9fa48("35322") ? () => undefined : (stryCov_9fa48("35322"), e => e.pendingRequests)).length === 0)) && <div className="text-center py-8 text-white/40">
                    No pending requests
                  </div>)}
              </div>
            </div>

            <div className="bg-black/30 rounded-2xl p-6 border border-blue-800/50">
              <h2 className="text-lg font-bold mb-4">Negotiation Tips</h2>
              <div className="space-y-4">
                <div className="p-4 bg-blue-900/30 rounded-xl">
                  <h3 className="font-semibold text-blue-300 mb-2">📊 Know Your Worth</h3>
                  <p className="text-sm text-white/70">Research market rates for your role. Our AI analyzes industry data to give you accurate salary ranges.</p>
                </div>
                <div className="p-4 bg-blue-900/30 rounded-xl">
                  <h3 className="font-semibold text-blue-300 mb-2">📝 Document Everything</h3>
                  <p className="text-sm text-white/70">Keep records of achievements, overtime, and any rights concerns. The Union module tracks this automatically.</p>
                </div>
                <div className="p-4 bg-blue-900/30 rounded-xl">
                  <h3 className="font-semibold text-blue-300 mb-2">⏰ Timing Matters</h3>
                  <p className="text-sm text-white/70">Ask after successful projects or during budget planning. Our AI identifies optimal timing.</p>
                </div>
                <div className="p-4 bg-blue-900/30 rounded-xl">
                  <h3 className="font-semibold text-blue-300 mb-2">🎯 Be Specific</h3>
                  <p className="text-sm text-white/70">Have a clear ask range. Our negotiation briefs provide minimum, target, and stretch numbers.</p>
                </div>
              </div>
            </div>
          </div>)}
      </div>

      {/* Add Employee Modal */}
      {stryMutAct_9fa48("35325") ? showAddEmployee || <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-slate-900 rounded-2xl p-6 w-full max-w-lg border border-blue-800/50">
            <h2 className="text-xl font-bold mb-4">Add Employee</h2>
            <form onSubmit={e => {
          e.preventDefault();
          const form = e.target as HTMLFormElement;
          const formData = new FormData(form);
          unionService.addEmployee({
            name: formData.get('name') as string,
            email: formData.get('email') as string,
            department: formData.get('department') as string,
            role: formData.get('role') as string,
            level: formData.get('level') as string,
            startDate: new Date(formData.get('startDate') as string),
            status: 'active',
            salary: parseInt(formData.get('salary') as string),
            avgHoursPerWeek: 40,
            overtimeHoursThisMonth: 0,
            ptoDaysRemaining: 20,
            ptoUsedThisYear: 0
          });
          loadData();
          setShowAddEmployee(false);
        }} className="space-y-4">
              <input name="name" required placeholder="Full Name" className="w-full px-4 py-2 bg-black/30 border border-blue-700/50 rounded-lg" />
              <input name="email" type="email" required placeholder="Email" className="w-full px-4 py-2 bg-black/30 border border-blue-700/50 rounded-lg" />
              <input name="department" required placeholder="Department" className="w-full px-4 py-2 bg-black/30 border border-blue-700/50 rounded-lg" />
              <input name="role" required placeholder="Role/Title" className="w-full px-4 py-2 bg-black/30 border border-blue-700/50 rounded-lg" />
              <input name="level" required placeholder="Level (e.g., Senior, Lead)" className="w-full px-4 py-2 bg-black/30 border border-blue-700/50 rounded-lg" />
              <input name="startDate" type="date" required className="w-full px-4 py-2 bg-black/30 border border-blue-700/50 rounded-lg" />
              <input name="salary" type="number" required placeholder="Annual Salary" className="w-full px-4 py-2 bg-black/30 border border-blue-700/50 rounded-lg" />
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowAddEmployee(false)} className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg">Add Employee</button>
              </div>
            </form>
          </div>
        </div> : stryMutAct_9fa48("35324") ? false : stryMutAct_9fa48("35323") ? true : (stryCov_9fa48("35323", "35324", "35325"), showAddEmployee && <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-slate-900 rounded-2xl p-6 w-full max-w-lg border border-blue-800/50">
            <h2 className="text-xl font-bold mb-4">Add Employee</h2>
            <form onSubmit={e => {
          e.preventDefault();
          const form = e.target as HTMLFormElement;
          const formData = new FormData(form);
          unionService.addEmployee(stryMutAct_9fa48("35327") ? {} : (stryCov_9fa48("35327"), {
            name: formData.get('name') as string,
            email: formData.get('email') as string,
            department: formData.get('department') as string,
            role: formData.get('role') as string,
            level: formData.get('level') as string,
            startDate: new Date(formData.get('startDate') as string),
            status: 'active',
            salary: parseInt(formData.get('salary') as string),
            avgHoursPerWeek: 40,
            overtimeHoursThisMonth: 0,
            ptoDaysRemaining: 20,
            ptoUsedThisYear: 0
          }));
          loadData();
          setShowAddEmployee(stryMutAct_9fa48("35329") ? true : (stryCov_9fa48("35329"), false));
        }} className="space-y-4">
              <input name="name" required placeholder="Full Name" className="w-full px-4 py-2 bg-black/30 border border-blue-700/50 rounded-lg" />
              <input name="email" type="email" required placeholder="Email" className="w-full px-4 py-2 bg-black/30 border border-blue-700/50 rounded-lg" />
              <input name="department" required placeholder="Department" className="w-full px-4 py-2 bg-black/30 border border-blue-700/50 rounded-lg" />
              <input name="role" required placeholder="Role/Title" className="w-full px-4 py-2 bg-black/30 border border-blue-700/50 rounded-lg" />
              <input name="level" required placeholder="Level (e.g., Senior, Lead)" className="w-full px-4 py-2 bg-black/30 border border-blue-700/50 rounded-lg" />
              <input name="startDate" type="date" required className="w-full px-4 py-2 bg-black/30 border border-blue-700/50 rounded-lg" />
              <input name="salary" type="number" required placeholder="Annual Salary" className="w-full px-4 py-2 bg-black/30 border border-blue-700/50 rounded-lg" />
              <div className="flex gap-3">
                <button type="button" onClick={stryMutAct_9fa48("35330") ? () => undefined : (stryCov_9fa48("35330"), () => setShowAddEmployee(stryMutAct_9fa48("35331") ? true : (stryCov_9fa48("35331"), false)))} className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg">Add Employee</button>
              </div>
            </form>
          </div>
        </div>)}

      {/* Negotiation Brief Modal */}
      {stryMutAct_9fa48("35334") ? showNegotiationBrief || <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" onClick={() => setShowNegotiationBrief(null)}>
          <div className="bg-slate-900 rounded-2xl p-6 w-full max-w-3xl border border-blue-800/50 max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-4">🎯 Negotiation Brief</h2>
            
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-black/30 rounded-xl text-center">
                <div className="text-sm text-white/50">Minimum</div>
                <div className="text-2xl font-bold text-amber-400">${showNegotiationBrief.askRange.minimum.toLocaleString()}</div>
              </div>
              <div className="p-4 bg-blue-900/50 rounded-xl text-center border border-blue-500">
                <div className="text-sm text-white/50">Target</div>
                <div className="text-2xl font-bold text-green-400">${showNegotiationBrief.askRange.target.toLocaleString()}</div>
              </div>
              <div className="p-4 bg-black/30 rounded-xl text-center">
                <div className="text-sm text-white/50">Stretch</div>
                <div className="text-2xl font-bold text-purple-400">${showNegotiationBrief.askRange.stretch.toLocaleString()}</div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">📊 Market Position</h3>
                <div className="p-3 bg-black/30 rounded-lg">
                  <p className="text-sm">You are <span className={showNegotiationBrief.marketPosition === 'below' ? 'text-red-400 font-bold' : 'text-green-400'}>{showNegotiationBrief.marketPosition}</span> market rate ({showNegotiationBrief.marketPercentile}th percentile)</p>
                  <p className="text-xs text-white/50 mt-1">Range: ${showNegotiationBrief.marketSalaryRange.min.toLocaleString()} - ${showNegotiationBrief.marketSalaryRange.max.toLocaleString()}</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">💪 Leverage Points</h3>
                <div className="space-y-2">
                  {showNegotiationBrief.leveragePoints.map((lp, i) => <div key={i} className="flex items-center gap-2 p-2 bg-black/30 rounded-lg text-sm">
                      <span className={`px-2 py-0.5 rounded text-xs ${lp.strength === 'strong' ? 'bg-green-600' : lp.strength === 'moderate' ? 'bg-amber-600' : 'bg-gray-600'}`}>
                        {lp.strength}
                      </span>
                      {lp.point}
                    </div>)}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">💬 Talking Points</h3>
                <ul className="space-y-2">
                  {showNegotiationBrief.talkingPoints.map((tp, i) => <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-blue-400">•</span>
                      {tp}
                    </li>)}
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">🛡️ Objection Handlers</h3>
                <div className="space-y-2">
                  {showNegotiationBrief.objectionHandlers.map((oh, i) => <div key={i} className="p-3 bg-black/30 rounded-lg">
                      <p className="text-sm text-red-300 italic">"{oh.objection}"</p>
                      <p className="text-sm text-green-300 mt-1">→ {oh.response}</p>
                    </div>)}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">⏰ Best Timing</h3>
                <p className="text-sm text-white/70">{showNegotiationBrief.bestTimeToAsk}</p>
                <p className="text-xs text-white/50 mt-1">{showNegotiationBrief.budgetCycleContext}</p>
              </div>
            </div>

            <button onClick={() => setShowNegotiationBrief(null)} className="mt-6 w-full py-2 bg-gray-700 hover:bg-gray-600 rounded-lg">
              Close
            </button>
          </div>
        </div> : stryMutAct_9fa48("35333") ? false : stryMutAct_9fa48("35332") ? true : (stryCov_9fa48("35332", "35333", "35334"), showNegotiationBrief && <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" onClick={stryMutAct_9fa48("35335") ? () => undefined : (stryCov_9fa48("35335"), () => setShowNegotiationBrief(null))}>
          <div className="bg-slate-900 rounded-2xl p-6 w-full max-w-3xl border border-blue-800/50 max-h-[85vh] overflow-y-auto" onClick={stryMutAct_9fa48("35336") ? () => undefined : (stryCov_9fa48("35336"), e => e.stopPropagation())}>
            <h2 className="text-xl font-bold mb-4">🎯 Negotiation Brief</h2>
            
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-black/30 rounded-xl text-center">
                <div className="text-sm text-white/50">Minimum</div>
                <div className="text-2xl font-bold text-amber-400">${showNegotiationBrief.askRange.minimum.toLocaleString()}</div>
              </div>
              <div className="p-4 bg-blue-900/50 rounded-xl text-center border border-blue-500">
                <div className="text-sm text-white/50">Target</div>
                <div className="text-2xl font-bold text-green-400">${showNegotiationBrief.askRange.target.toLocaleString()}</div>
              </div>
              <div className="p-4 bg-black/30 rounded-xl text-center">
                <div className="text-sm text-white/50">Stretch</div>
                <div className="text-2xl font-bold text-purple-400">${showNegotiationBrief.askRange.stretch.toLocaleString()}</div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">📊 Market Position</h3>
                <div className="p-3 bg-black/30 rounded-lg">
                  <p className="text-sm">You are <span className={(stryMutAct_9fa48("35339") ? showNegotiationBrief.marketPosition !== 'below' : stryMutAct_9fa48("35338") ? false : stryMutAct_9fa48("35337") ? true : (stryCov_9fa48("35337", "35338", "35339"), showNegotiationBrief.marketPosition === 'below')) ? 'text-red-400 font-bold' : 'text-green-400'}>{showNegotiationBrief.marketPosition}</span> market rate ({showNegotiationBrief.marketPercentile}th percentile)</p>
                  <p className="text-xs text-white/50 mt-1">Range: ${showNegotiationBrief.marketSalaryRange.min.toLocaleString()} - ${showNegotiationBrief.marketSalaryRange.max.toLocaleString()}</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">💪 Leverage Points</h3>
                <div className="space-y-2">
                  {showNegotiationBrief.leveragePoints.map(stryMutAct_9fa48("35343") ? () => undefined : (stryCov_9fa48("35343"), (lp, i) => <div key={i} className="flex items-center gap-2 p-2 bg-black/30 rounded-lg text-sm">
                      <span className={`px-2 py-0.5 rounded text-xs ${(stryMutAct_9fa48("35347") ? lp.strength !== 'strong' : stryMutAct_9fa48("35346") ? false : stryMutAct_9fa48("35345") ? true : (stryCov_9fa48("35345", "35346", "35347"), lp.strength === 'strong')) ? 'bg-green-600' : (stryMutAct_9fa48("35352") ? lp.strength !== 'moderate' : stryMutAct_9fa48("35351") ? false : stryMutAct_9fa48("35350") ? true : (stryCov_9fa48("35350", "35351", "35352"), lp.strength === 'moderate')) ? 'bg-amber-600' : 'bg-gray-600'}`}>
                        {lp.strength}
                      </span>
                      {lp.point}
                    </div>))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">💬 Talking Points</h3>
                <ul className="space-y-2">
                  {showNegotiationBrief.talkingPoints.map(stryMutAct_9fa48("35356") ? () => undefined : (stryCov_9fa48("35356"), (tp, i) => <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-blue-400">•</span>
                      {tp}
                    </li>))}
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">🛡️ Objection Handlers</h3>
                <div className="space-y-2">
                  {showNegotiationBrief.objectionHandlers.map(stryMutAct_9fa48("35357") ? () => undefined : (stryCov_9fa48("35357"), (oh, i) => <div key={i} className="p-3 bg-black/30 rounded-lg">
                      <p className="text-sm text-red-300 italic">"{oh.objection}"</p>
                      <p className="text-sm text-green-300 mt-1">→ {oh.response}</p>
                    </div>))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">⏰ Best Timing</h3>
                <p className="text-sm text-white/70">{showNegotiationBrief.bestTimeToAsk}</p>
                <p className="text-xs text-white/50 mt-1">{showNegotiationBrief.budgetCycleContext}</p>
              </div>
            </div>

            <button onClick={stryMutAct_9fa48("35358") ? () => undefined : (stryCov_9fa48("35358"), () => setShowNegotiationBrief(null))} className="mt-6 w-full py-2 bg-gray-700 hover:bg-gray-600 rounded-lg">
              Close
            </button>
          </div>
        </div>)}

      {/* Employee Detail Modal */}
      {stryMutAct_9fa48("35361") ? selectedEmployee || <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" onClick={() => setSelectedEmployee(null)}>
          <div className="bg-slate-900 rounded-2xl p-6 w-full max-w-2xl border border-blue-800/50" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold">{selectedEmployee.name}</h2>
                <p className="text-sm text-white/60">{selectedEmployee.role} • {selectedEmployee.department}</p>
              </div>
              <div className="text-right">
                <span className={`px-3 py-1 rounded-full ${getBurnoutColor(selectedEmployee.burnoutLevel)}`}>
                  {selectedEmployee.burnoutLevel.toUpperCase()}
                </span>
                <div className="text-2xl font-bold mt-1">{selectedEmployee.burnoutScore}%</div>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="p-3 bg-black/30 rounded-lg text-center">
                <div className="text-lg font-bold">{selectedEmployee.avgHoursPerWeek}h</div>
                <div className="text-xs text-white/50">Avg Hours/Week</div>
              </div>
              <div className="p-3 bg-black/30 rounded-lg text-center">
                <div className="text-lg font-bold">{selectedEmployee.overtimeHoursThisMonth}h</div>
                <div className="text-xs text-white/50">Overtime</div>
              </div>
              <div className="p-3 bg-black/30 rounded-lg text-center">
                <div className="text-lg font-bold">{selectedEmployee.ptoDaysRemaining}</div>
                <div className="text-xs text-white/50">PTO Remaining</div>
              </div>
              <div className="p-3 bg-black/30 rounded-lg text-center">
                <div className="text-lg font-bold">${(selectedEmployee.salary / 1000).toFixed(0)}k</div>
                <div className="text-xs text-white/50">Salary</div>
              </div>
            </div>

            {selectedEmployee.burnoutFactors.length > 0 && <div className="mb-6">
                <h3 className="font-semibold mb-2">Burnout Factors</h3>
                <div className="space-y-2">
                  {selectedEmployee.burnoutFactors.map(f => <div key={f.id} className="p-3 bg-red-900/20 rounded-lg border border-red-700/30">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">{f.name}</span>
                        <span className="text-red-400">{f.score}%</span>
                      </div>
                      <ul className="text-xs text-white/50">
                        {f.indicators.map((ind, i) => <li key={i}>• {ind}</li>)}
                      </ul>
                    </div>)}
                </div>
              </div>}

            <div className="flex gap-3">
              <button onClick={async () => {
            await unionService.analyzeBurnout(selectedEmployee.id);
            loadData();
            setSelectedEmployee(unionService.getEmployee(selectedEmployee.id) || null);
          }} className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg">
                🔄 Refresh Analysis
              </button>
              <button onClick={() => setSelectedEmployee(null)} className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg">
                Close
              </button>
            </div>
          </div>
        </div> : stryMutAct_9fa48("35360") ? false : stryMutAct_9fa48("35359") ? true : (stryCov_9fa48("35359", "35360", "35361"), selectedEmployee && <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" onClick={stryMutAct_9fa48("35362") ? () => undefined : (stryCov_9fa48("35362"), () => setSelectedEmployee(null))}>
          <div className="bg-slate-900 rounded-2xl p-6 w-full max-w-2xl border border-blue-800/50" onClick={stryMutAct_9fa48("35363") ? () => undefined : (stryCov_9fa48("35363"), e => e.stopPropagation())}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold">{selectedEmployee.name}</h2>
                <p className="text-sm text-white/60">{selectedEmployee.role} • {selectedEmployee.department}</p>
              </div>
              <div className="text-right">
                <span className={`px-3 py-1 rounded-full ${getBurnoutColor(selectedEmployee.burnoutLevel)}`}>
                  {stryMutAct_9fa48("35365") ? selectedEmployee.burnoutLevel.toLowerCase() : (stryCov_9fa48("35365"), selectedEmployee.burnoutLevel.toUpperCase())}
                </span>
                <div className="text-2xl font-bold mt-1">{selectedEmployee.burnoutScore}%</div>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="p-3 bg-black/30 rounded-lg text-center">
                <div className="text-lg font-bold">{selectedEmployee.avgHoursPerWeek}h</div>
                <div className="text-xs text-white/50">Avg Hours/Week</div>
              </div>
              <div className="p-3 bg-black/30 rounded-lg text-center">
                <div className="text-lg font-bold">{selectedEmployee.overtimeHoursThisMonth}h</div>
                <div className="text-xs text-white/50">Overtime</div>
              </div>
              <div className="p-3 bg-black/30 rounded-lg text-center">
                <div className="text-lg font-bold">{selectedEmployee.ptoDaysRemaining}</div>
                <div className="text-xs text-white/50">PTO Remaining</div>
              </div>
              <div className="p-3 bg-black/30 rounded-lg text-center">
                <div className="text-lg font-bold">${(stryMutAct_9fa48("35366") ? selectedEmployee.salary * 1000 : (stryCov_9fa48("35366"), selectedEmployee.salary / 1000)).toFixed(0)}k</div>
                <div className="text-xs text-white/50">Salary</div>
              </div>
            </div>

            {stryMutAct_9fa48("35369") ? selectedEmployee.burnoutFactors.length > 0 || <div className="mb-6">
                <h3 className="font-semibold mb-2">Burnout Factors</h3>
                <div className="space-y-2">
                  {selectedEmployee.burnoutFactors.map(f => <div key={f.id} className="p-3 bg-red-900/20 rounded-lg border border-red-700/30">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">{f.name}</span>
                        <span className="text-red-400">{f.score}%</span>
                      </div>
                      <ul className="text-xs text-white/50">
                        {f.indicators.map((ind, i) => <li key={i}>• {ind}</li>)}
                      </ul>
                    </div>)}
                </div>
              </div> : stryMutAct_9fa48("35368") ? false : stryMutAct_9fa48("35367") ? true : (stryCov_9fa48("35367", "35368", "35369"), (stryMutAct_9fa48("35372") ? selectedEmployee.burnoutFactors.length <= 0 : stryMutAct_9fa48("35371") ? selectedEmployee.burnoutFactors.length >= 0 : stryMutAct_9fa48("35370") ? true : (stryCov_9fa48("35370", "35371", "35372"), selectedEmployee.burnoutFactors.length > 0)) && <div className="mb-6">
                <h3 className="font-semibold mb-2">Burnout Factors</h3>
                <div className="space-y-2">
                  {selectedEmployee.burnoutFactors.map(stryMutAct_9fa48("35373") ? () => undefined : (stryCov_9fa48("35373"), f => <div key={f.id} className="p-3 bg-red-900/20 rounded-lg border border-red-700/30">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">{f.name}</span>
                        <span className="text-red-400">{f.score}%</span>
                      </div>
                      <ul className="text-xs text-white/50">
                        {f.indicators.map(stryMutAct_9fa48("35374") ? () => undefined : (stryCov_9fa48("35374"), (ind, i) => <li key={i}>• {ind}</li>))}
                      </ul>
                    </div>))}
                </div>
              </div>)}

            <div className="flex gap-3">
              <button onClick={async () => {
            await unionService.analyzeBurnout(selectedEmployee.id);
            loadData();
            setSelectedEmployee(stryMutAct_9fa48("35378") ? unionService.getEmployee(selectedEmployee.id) && null : stryMutAct_9fa48("35377") ? false : stryMutAct_9fa48("35376") ? true : (stryCov_9fa48("35376", "35377", "35378"), unionService.getEmployee(selectedEmployee.id) || null));
          }} className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg">
                🔄 Refresh Analysis
              </button>
              <button onClick={stryMutAct_9fa48("35379") ? () => undefined : (stryCov_9fa48("35379"), () => setSelectedEmployee(null))} className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg">
                Close
              </button>
            </div>
          </div>
        </div>)}
    </div>;
};
export default UnionPage;