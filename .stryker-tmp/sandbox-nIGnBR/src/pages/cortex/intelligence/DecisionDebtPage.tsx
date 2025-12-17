// @ts-nocheck
// =============================================================================
// DATACENDIA - DECISION DEBT DASHBOARD PAGE
// Track stuck decisions and their organizational cost
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
import { cn } from '../../../../lib/utils';
import { decisionIntelligenceService, DecisionDebtDashboard, PendingDecision } from '../../../services/DecisionIntelligenceService';

// Types imported from DecisionIntelligenceService

export const DecisionDebtPage: React.FC = () => {
  const [dashboard, setDashboard] = useState<DecisionDebtDashboard | null>(null);
  const [isLoading, setIsLoading] = useState(stryMutAct_9fa48("44959") ? false : (stryCov_9fa48("44959"), true));
  const [selectedDecision, setSelectedDecision] = useState<PendingDecision | null>(null);
  const [showAddModal, setShowAddModal] = useState(stryMutAct_9fa48("44960") ? true : (stryCov_9fa48("44960"), false));
  const [newDecisionTitle, setNewDecisionTitle] = useState('');
  const [newDecisionDepartment, setNewDecisionDepartment] = useState('');
  const [newDecisionOwner, setNewDecisionOwner] = useState('');
  const [newDecisionCost, setNewDecisionCost] = useState('');
  useEffect(() => {
    loadDashboard();
  }, stryMutAct_9fa48("44966") ? ["Stryker was here"] : (stryCov_9fa48("44966"), []));
  const loadDashboard = () => {
    setIsLoading(stryMutAct_9fa48("44968") ? false : (stryCov_9fa48("44968"), true));
    try {
      // Use real Decision Intelligence Service
      const dashboardData = decisionIntelligenceService.getDecisionDebtDashboard();
      setDashboard(dashboardData);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setIsLoading(stryMutAct_9fa48("44973") ? true : (stryCov_9fa48("44973"), false));
    }
  };
  const handleAddDecision = () => {
    if (stryMutAct_9fa48("44977") ? false : stryMutAct_9fa48("44976") ? true : stryMutAct_9fa48("44975") ? newDecisionTitle.trim() : (stryCov_9fa48("44975", "44976", "44977"), !(stryMutAct_9fa48("44978") ? newDecisionTitle : (stryCov_9fa48("44978"), newDecisionTitle.trim())))) {
      return;
    }
    decisionIntelligenceService.createPendingDecision(stryMutAct_9fa48("44980") ? {} : (stryCov_9fa48("44980"), {
      title: newDecisionTitle,
      department: stryMutAct_9fa48("44983") ? newDecisionDepartment && 'General' : stryMutAct_9fa48("44982") ? false : stryMutAct_9fa48("44981") ? true : (stryCov_9fa48("44981", "44982", "44983"), newDecisionDepartment || 'General'),
      owner: stryMutAct_9fa48("44987") ? newDecisionOwner && 'Unassigned' : stryMutAct_9fa48("44986") ? false : stryMutAct_9fa48("44985") ? true : (stryCov_9fa48("44985", "44986", "44987"), newDecisionOwner || 'Unassigned'),
      estimatedDailyCost: stryMutAct_9fa48("44991") ? parseFloat(newDecisionCost) && 1000 : stryMutAct_9fa48("44990") ? false : stryMutAct_9fa48("44989") ? true : (stryCov_9fa48("44989", "44990", "44991"), parseFloat(newDecisionCost) || 1000),
      priority: 'medium'
    }));
    setNewDecisionTitle('');
    setNewDecisionDepartment('');
    setNewDecisionOwner('');
    setNewDecisionCost('');
    setShowAddModal(stryMutAct_9fa48("44997") ? true : (stryCov_9fa48("44997"), false));
    loadDashboard();
  };
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        if (stryMutAct_9fa48("44999")) {} else {
          stryCov_9fa48("44999");
          return 'bg-red-100 text-red-700 border-red-200';
        }
      case 'high':
        if (stryMutAct_9fa48("45002")) {} else {
          stryCov_9fa48("45002");
          return 'bg-orange-100 text-orange-700 border-orange-200';
        }
      case 'medium':
        if (stryMutAct_9fa48("45005")) {} else {
          stryCov_9fa48("45005");
          return 'bg-yellow-100 text-yellow-700 border-yellow-200';
        }
      case 'low':
        if (stryMutAct_9fa48("45008")) {} else {
          stryCov_9fa48("45008");
          return 'bg-green-100 text-green-700 border-green-200';
        }
      default:
        if (stryMutAct_9fa48("45011")) {} else {
          stryCov_9fa48("45011");
          return 'bg-gray-100 text-gray-700';
        }
    }
  };
  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A':
        if (stryMutAct_9fa48("45014")) {} else {
          stryCov_9fa48("45014");
          return 'text-green-600 bg-green-100';
        }
      case 'B':
        if (stryMutAct_9fa48("45017")) {} else {
          stryCov_9fa48("45017");
          return 'text-lime-600 bg-lime-100';
        }
      case 'C':
        if (stryMutAct_9fa48("45020")) {} else {
          stryCov_9fa48("45020");
          return 'text-yellow-600 bg-yellow-100';
        }
      case 'D':
        if (stryMutAct_9fa48("45023")) {} else {
          stryCov_9fa48("45023");
          return 'text-orange-600 bg-orange-100';
        }
      case 'F':
        if (stryMutAct_9fa48("45026")) {} else {
          stryCov_9fa48("45026");
          return 'text-red-600 bg-red-100';
        }
      default:
        if (stryMutAct_9fa48("45029")) {} else {
          stryCov_9fa48("45029");
          return 'text-gray-600 bg-gray-100';
        }
    }
  };
  if (stryMutAct_9fa48("45032") ? false : stryMutAct_9fa48("45031") ? true : (stryCov_9fa48("45031", "45032"), isLoading)) {
    return <div className="p-6 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-neutral-500">Loading Decision Debt Dashboard...</p>
        </div>
      </div>;
  }
  if (stryMutAct_9fa48("45036") ? false : stryMutAct_9fa48("45035") ? true : stryMutAct_9fa48("45034") ? dashboard : (stryCov_9fa48("45034", "45035", "45036"), !dashboard)) {
    return <div className="p-6 text-center">
        <p className="text-red-500">Failed to load dashboard</p>
      </div>;
  }
  return <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">📊</span>
          <h1 className="text-3xl font-bold text-neutral-900">Decision Debt Dashboard</h1>
        </div>
        <p className="text-neutral-600 text-lg">
          See every decision that's stuck, who's blocking it, and what it's costing you per day.
        </p>
      </div>

      {/* Score and Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        {/* Debt Score */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
          <div className="text-center">
            <div className={cn('w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-2', getGradeColor(dashboard.summary.debtScore.grade))}>
              <span className="text-4xl font-bold">{dashboard.summary.debtScore.grade}</span>
            </div>
            <div className="text-lg font-semibold text-neutral-900">
              {dashboard.summary.debtScore.label}
            </div>
            <div className="text-sm text-neutral-500">Decision Debt Score</div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
          <div className="text-sm text-neutral-500 mb-1">Decisions Stuck</div>
          <div className="text-3xl font-bold text-red-600">
            {dashboard.summary.totalPendingDecisions}
          </div>
          <div className="text-sm text-neutral-500 mt-2">
            {dashboard.summary.totalBlockedDecisions} actively blocked
          </div>
        </div>

        <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
          <div className="text-sm text-neutral-500 mb-1">Average Days Stuck</div>
          <div className="text-3xl font-bold text-orange-600">
            {dashboard.summary.averageDaysStuck.toFixed(1)}
          </div>
          <div className="text-sm text-neutral-500 mt-2">days per decision</div>
        </div>

        <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
          <div className="text-sm text-neutral-500 mb-1">Daily Cost</div>
          <div className="text-3xl font-bold text-red-600">
            ${dashboard.summary.dailyCost.toLocaleString()}
          </div>
          <div className="text-sm text-neutral-500 mt-2">
            ${(stryMutAct_9fa48("45039") ? dashboard.summary.annualProjectedLoss * 1000000 : (stryCov_9fa48("45039"), dashboard.summary.annualProjectedLoss / 1000000)).toFixed(1)}M/year projected
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Decisions List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">
              Pending Decisions ({dashboard.decisions.length})
            </h2>
            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {dashboard.decisions.map(stryMutAct_9fa48("45040") ? () => undefined : (stryCov_9fa48("45040"), decision => <div key={decision.id} className={cn('p-4 rounded-lg border cursor-pointer transition-all', (stryMutAct_9fa48("45044") ? selectedDecision?.id !== decision.id : stryMutAct_9fa48("45043") ? false : stryMutAct_9fa48("45042") ? true : (stryCov_9fa48("45042", "45043", "45044"), (stryMutAct_9fa48("45045") ? selectedDecision.id : (stryCov_9fa48("45045"), selectedDecision?.id)) === decision.id)) ? 'border-blue-500 bg-blue-50' : 'border-neutral-200 hover:border-neutral-300')} onClick={stryMutAct_9fa48("45048") ? () => undefined : (stryCov_9fa48("45048"), () => setSelectedDecision(decision))}>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-medium text-neutral-900">{decision.title}</h3>
                      <p className="text-sm text-neutral-500">{decision.department} • {decision.owner}</p>
                    </div>
                    <span className={cn('px-2 py-1 rounded text-xs font-medium border', getPriorityColor(decision.priority))}>
                      {decision.priority}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-orange-600 font-medium">
                      {decision.daysStuck} days stuck
                    </span>
                    <span className="text-red-600">
                      ${decision.totalCostAccrued.toLocaleString()} accrued
                    </span>
                    {stryMutAct_9fa48("45052") ? decision.blockedBy.length > 0 || <span className="text-neutral-500">
                        Blocked by: {decision.blockedBy[0].name}
                      </span> : stryMutAct_9fa48("45051") ? false : stryMutAct_9fa48("45050") ? true : (stryCov_9fa48("45050", "45051", "45052"), (stryMutAct_9fa48("45055") ? decision.blockedBy.length <= 0 : stryMutAct_9fa48("45054") ? decision.blockedBy.length >= 0 : stryMutAct_9fa48("45053") ? true : (stryCov_9fa48("45053", "45054", "45055"), decision.blockedBy.length > 0)) && <span className="text-neutral-500">
                        Blocked by: {decision.blockedBy[0].name}
                      </span>)}
                  </div>
                </div>))}
            </div>
          </div>

          {/* Critical Path */}
          <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">
              Critical Path
            </h2>
            <div className="flex items-center gap-2 flex-wrap">
              {dashboard.criticalPath.map((decId, idx) => {
              const dec = dashboard.decisions.find(stryMutAct_9fa48("45057") ? () => undefined : (stryCov_9fa48("45057"), d => stryMutAct_9fa48("45060") ? d.id !== decId : stryMutAct_9fa48("45059") ? false : stryMutAct_9fa48("45058") ? true : (stryCov_9fa48("45058", "45059", "45060"), d.id === decId)));
              return <React.Fragment key={decId}>
                    <div className="px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-sm">
                      {stryMutAct_9fa48("45063") ? dec?.title && decId : stryMutAct_9fa48("45062") ? false : stryMutAct_9fa48("45061") ? true : (stryCov_9fa48("45061", "45062", "45063"), (stryMutAct_9fa48("45064") ? dec.title : (stryCov_9fa48("45064"), dec?.title)) || decId)}
                    </div>
                    {stryMutAct_9fa48("45067") ? idx < dashboard.criticalPath.length - 1 || <span className="text-neutral-400">→</span> : stryMutAct_9fa48("45066") ? false : stryMutAct_9fa48("45065") ? true : (stryCov_9fa48("45065", "45066", "45067"), (stryMutAct_9fa48("45070") ? idx >= dashboard.criticalPath.length - 1 : stryMutAct_9fa48("45069") ? idx <= dashboard.criticalPath.length - 1 : stryMutAct_9fa48("45068") ? true : (stryCov_9fa48("45068", "45069", "45070"), idx < (stryMutAct_9fa48("45071") ? dashboard.criticalPath.length + 1 : (stryCov_9fa48("45071"), dashboard.criticalPath.length - 1)))) && <span className="text-neutral-400">→</span>)}
                  </React.Fragment>;
            })}
            </div>
            <p className="mt-3 text-sm text-neutral-500">
              These decisions form a chain of dependencies. Resolving the first unblocks the rest.
            </p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Top Blockers */}
          <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">
              Top Blockers
            </h2>
            <div className="space-y-3">
              {stryMutAct_9fa48("45072") ? dashboard.topBlockers.map((blocker, idx) => <div key={idx} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-neutral-900">{blocker.blockerName}</div>
                    <div className="text-sm text-neutral-500">
                      {blocker.decisionsBlocked} decisions blocked
                    </div>
                  </div>
                  <div className="text-red-600 font-medium">
                    ${(blocker.totalCostImpact / 1000).toFixed(0)}K
                  </div>
                </div>) : (stryCov_9fa48("45072"), dashboard.topBlockers.slice(0, 5).map(stryMutAct_9fa48("45073") ? () => undefined : (stryCov_9fa48("45073"), (blocker, idx) => <div key={idx} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-neutral-900">{blocker.blockerName}</div>
                    <div className="text-sm text-neutral-500">
                      {blocker.decisionsBlocked} decisions blocked
                    </div>
                  </div>
                  <div className="text-red-600 font-medium">
                    ${(stryMutAct_9fa48("45074") ? blocker.totalCostImpact * 1000 : (stryCov_9fa48("45074"), blocker.totalCostImpact / 1000)).toFixed(0)}K
                  </div>
                </div>)))}
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">
              Recommendations
            </h2>
            <div className="space-y-4">
              {dashboard.recommendations.map(stryMutAct_9fa48("45075") ? () => undefined : (stryCov_9fa48("45075"), (rec, idx) => <div key={idx} className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="font-medium text-green-800 text-sm">{rec.title}</div>
                  <div className="text-xs text-green-700 mt-1">{rec.description}</div>
                  <div className="text-xs text-green-600 mt-2 font-medium">
                    Potential savings: ${rec.estimatedSavings.toLocaleString()}
                  </div>
                </div>))}
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default DecisionDebtPage;