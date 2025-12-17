// @ts-nocheck
// =============================================================================
// DATACENDIA ROI CALCULATOR - Enterprise Sales Tool
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
import React, { useState, useMemo } from 'react';
import { Calculator, TrendingUp, DollarSign, Clock, Shield, Users, AlertTriangle, Download, Share2, ChevronRight } from 'lucide-react';
import { cn } from '../../../lib/utils';

// Industry benchmarks for ROI calculations
const BENCHMARKS = stryMutAct_9fa48("61252") ? {} : (stryCov_9fa48("61252"), {
  decision_meeting_hours_per_week: 12,
  average_hourly_cost_executive: 250,
  compliance_audit_hours_per_year: 800,
  compliance_hourly_cost: 150,
  shadow_ai_incidents_per_year: 24,
  shadow_ai_cost_per_incident: 15000,
  data_quality_issues_per_month: 35,
  data_quality_cost_per_issue: 2500,
  strategic_delays_per_year: 6,
  strategic_delay_opportunity_cost: 100000
});

// Datacendia improvement factors
const IMPROVEMENTS = stryMutAct_9fa48("61253") ? {} : (stryCov_9fa48("61253"), {
  decision_time_reduction: 0.73,
  compliance_time_reduction: 0.60,
  shadow_ai_elimination: 0.90,
  data_quality_improvement: 0.65,
  strategic_delay_reduction: 0.70
});
const INDUSTRIES = stryMutAct_9fa48("61254") ? [] : (stryCov_9fa48("61254"), [stryMutAct_9fa48("61255") ? {} : (stryCov_9fa48("61255"), {
  id: 'financial_services',
  name: 'Financial Services',
  complianceMultiplier: 1.8
}), stryMutAct_9fa48("61258") ? {} : (stryCov_9fa48("61258"), {
  id: 'healthcare',
  name: 'Healthcare',
  complianceMultiplier: 1.6
}), stryMutAct_9fa48("61261") ? {} : (stryCov_9fa48("61261"), {
  id: 'technology',
  name: 'Technology',
  complianceMultiplier: 1.2
}), stryMutAct_9fa48("61264") ? {} : (stryCov_9fa48("61264"), {
  id: 'manufacturing',
  name: 'Manufacturing',
  complianceMultiplier: 1.3
}), stryMutAct_9fa48("61267") ? {} : (stryCov_9fa48("61267"), {
  id: 'retail',
  name: 'Retail',
  complianceMultiplier: 1.1
}), stryMutAct_9fa48("61270") ? {} : (stryCov_9fa48("61270"), {
  id: 'professional_services',
  name: 'Professional Services',
  complianceMultiplier: 1.4
}), stryMutAct_9fa48("61273") ? {} : (stryCov_9fa48("61273"), {
  id: 'energy',
  name: 'Energy & Utilities',
  complianceMultiplier: 1.5
}), stryMutAct_9fa48("61276") ? {} : (stryCov_9fa48("61276"), {
  id: 'government',
  name: 'Government',
  complianceMultiplier: 1.7
})]);
interface ROIBreakdown {
  decisionSavings: number;
  complianceSavings: number;
  shadowAISavings: number;
  dataQualitySavings: number;
  delaySavings: number;
  totalBenefit: number;
  datacendiaCost: number;
  netBenefit: number;
  roiPercentage: number;
  paybackMonths: number;
}
function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', stryMutAct_9fa48("61281") ? {} : (stryCov_9fa48("61281"), {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  })).format(value);
}
export default function ROICalculator() {
  const [employees, setEmployees] = useState(500);
  const [executives, setExecutives] = useState(25);
  const [industry, setIndustry] = useState('financial_services');
  const [currentAISpend, setCurrentAISpend] = useState(200000);
  const [complianceHeavy, setComplianceHeavy] = useState(stryMutAct_9fa48("61286") ? false : (stryCov_9fa48("61286"), true));
  const roi = useMemo<ROIBreakdown>(() => {
    const industryData = stryMutAct_9fa48("61290") ? INDUSTRIES.find(i => i.id === industry) && INDUSTRIES[0] : stryMutAct_9fa48("61289") ? false : stryMutAct_9fa48("61288") ? true : (stryCov_9fa48("61288", "61289", "61290"), INDUSTRIES.find(stryMutAct_9fa48("61291") ? () => undefined : (stryCov_9fa48("61291"), i => stryMutAct_9fa48("61294") ? i.id !== industry : stryMutAct_9fa48("61293") ? false : stryMutAct_9fa48("61292") ? true : (stryCov_9fa48("61292", "61293", "61294"), i.id === industry))) || INDUSTRIES[0]);

    // Decision time savings
    const weeklyMeetingHours = stryMutAct_9fa48("61295") ? BENCHMARKS.decision_meeting_hours_per_week / executives : (stryCov_9fa48("61295"), BENCHMARKS.decision_meeting_hours_per_week * executives);
    const annualMeetingHours = stryMutAct_9fa48("61296") ? weeklyMeetingHours / 48 : (stryCov_9fa48("61296"), weeklyMeetingHours * 48);
    const meetingCostBefore = stryMutAct_9fa48("61297") ? annualMeetingHours / BENCHMARKS.average_hourly_cost_executive : (stryCov_9fa48("61297"), annualMeetingHours * BENCHMARKS.average_hourly_cost_executive);
    const meetingCostAfter = stryMutAct_9fa48("61298") ? meetingCostBefore / (1 - IMPROVEMENTS.decision_time_reduction) : (stryCov_9fa48("61298"), meetingCostBefore * (stryMutAct_9fa48("61299") ? 1 + IMPROVEMENTS.decision_time_reduction : (stryCov_9fa48("61299"), 1 - IMPROVEMENTS.decision_time_reduction)));
    const decisionSavings = stryMutAct_9fa48("61300") ? meetingCostBefore + meetingCostAfter : (stryCov_9fa48("61300"), meetingCostBefore - meetingCostAfter);

    // Compliance savings
    const complianceMultiplier = complianceHeavy ? industryData.complianceMultiplier : 1.0;
    const complianceHours = stryMutAct_9fa48("61301") ? BENCHMARKS.compliance_audit_hours_per_year / complianceMultiplier : (stryCov_9fa48("61301"), BENCHMARKS.compliance_audit_hours_per_year * complianceMultiplier);
    const complianceCostBefore = stryMutAct_9fa48("61302") ? complianceHours / BENCHMARKS.compliance_hourly_cost : (stryCov_9fa48("61302"), complianceHours * BENCHMARKS.compliance_hourly_cost);
    const complianceCostAfter = stryMutAct_9fa48("61303") ? complianceCostBefore / (1 - IMPROVEMENTS.compliance_time_reduction) : (stryCov_9fa48("61303"), complianceCostBefore * (stryMutAct_9fa48("61304") ? 1 + IMPROVEMENTS.compliance_time_reduction : (stryCov_9fa48("61304"), 1 - IMPROVEMENTS.compliance_time_reduction)));
    const complianceSavings = stryMutAct_9fa48("61305") ? complianceCostBefore + complianceCostAfter : (stryCov_9fa48("61305"), complianceCostBefore - complianceCostAfter);

    // Shadow AI risk reduction
    const shadowAICostBefore = stryMutAct_9fa48("61306") ? BENCHMARKS.shadow_ai_incidents_per_year / BENCHMARKS.shadow_ai_cost_per_incident : (stryCov_9fa48("61306"), BENCHMARKS.shadow_ai_incidents_per_year * BENCHMARKS.shadow_ai_cost_per_incident);
    const shadowAICostAfter = stryMutAct_9fa48("61307") ? shadowAICostBefore / (1 - IMPROVEMENTS.shadow_ai_elimination) : (stryCov_9fa48("61307"), shadowAICostBefore * (stryMutAct_9fa48("61308") ? 1 + IMPROVEMENTS.shadow_ai_elimination : (stryCov_9fa48("61308"), 1 - IMPROVEMENTS.shadow_ai_elimination)));
    const shadowAISavings = stryMutAct_9fa48("61309") ? shadowAICostBefore + shadowAICostAfter : (stryCov_9fa48("61309"), shadowAICostBefore - shadowAICostAfter);

    // Data quality improvement
    const dataIssuesPerYear = stryMutAct_9fa48("61310") ? BENCHMARKS.data_quality_issues_per_month / 12 : (stryCov_9fa48("61310"), BENCHMARKS.data_quality_issues_per_month * 12);
    const dataQualityCostBefore = stryMutAct_9fa48("61311") ? dataIssuesPerYear / BENCHMARKS.data_quality_cost_per_issue : (stryCov_9fa48("61311"), dataIssuesPerYear * BENCHMARKS.data_quality_cost_per_issue);
    const dataQualityCostAfter = stryMutAct_9fa48("61312") ? dataQualityCostBefore / (1 - IMPROVEMENTS.data_quality_improvement) : (stryCov_9fa48("61312"), dataQualityCostBefore * (stryMutAct_9fa48("61313") ? 1 + IMPROVEMENTS.data_quality_improvement : (stryCov_9fa48("61313"), 1 - IMPROVEMENTS.data_quality_improvement)));
    const dataQualitySavings = stryMutAct_9fa48("61314") ? dataQualityCostBefore + dataQualityCostAfter : (stryCov_9fa48("61314"), dataQualityCostBefore - dataQualityCostAfter);

    // Strategic delay reduction
    const delaysCostBefore = stryMutAct_9fa48("61315") ? BENCHMARKS.strategic_delays_per_year / BENCHMARKS.strategic_delay_opportunity_cost : (stryCov_9fa48("61315"), BENCHMARKS.strategic_delays_per_year * BENCHMARKS.strategic_delay_opportunity_cost);
    const delaysCostAfter = stryMutAct_9fa48("61316") ? delaysCostBefore / (1 - IMPROVEMENTS.strategic_delay_reduction) : (stryCov_9fa48("61316"), delaysCostBefore * (stryMutAct_9fa48("61317") ? 1 + IMPROVEMENTS.strategic_delay_reduction : (stryCov_9fa48("61317"), 1 - IMPROVEMENTS.strategic_delay_reduction)));
    const delaySavings = stryMutAct_9fa48("61318") ? delaysCostBefore + delaysCostAfter : (stryCov_9fa48("61318"), delaysCostBefore - delaysCostAfter);

    // Total benefits
    const totalBenefit = stryMutAct_9fa48("61319") ? decisionSavings + complianceSavings + shadowAISavings + dataQualitySavings - delaySavings : (stryCov_9fa48("61319"), (stryMutAct_9fa48("61320") ? decisionSavings + complianceSavings + shadowAISavings - dataQualitySavings : (stryCov_9fa48("61320"), (stryMutAct_9fa48("61321") ? decisionSavings + complianceSavings - shadowAISavings : (stryCov_9fa48("61321"), (stryMutAct_9fa48("61322") ? decisionSavings - complianceSavings : (stryCov_9fa48("61322"), decisionSavings + complianceSavings)) + shadowAISavings)) + dataQualitySavings)) + delaySavings);

    // Datacendia cost based on company size
    let datacendiaCost: number;
    if (stryMutAct_9fa48("61326") ? employees >= 200 : stryMutAct_9fa48("61325") ? employees <= 200 : stryMutAct_9fa48("61324") ? false : stryMutAct_9fa48("61323") ? true : (stryCov_9fa48("61323", "61324", "61325", "61326"), employees < 200)) {
      datacendiaCost = 50000;
    } else if (stryMutAct_9fa48("61331") ? employees >= 1000 : stryMutAct_9fa48("61330") ? employees <= 1000 : stryMutAct_9fa48("61329") ? false : stryMutAct_9fa48("61328") ? true : (stryCov_9fa48("61328", "61329", "61330", "61331"), employees < 1000)) {
      datacendiaCost = 150000;
    } else if (stryMutAct_9fa48("61336") ? employees >= 5000 : stryMutAct_9fa48("61335") ? employees <= 5000 : stryMutAct_9fa48("61334") ? false : stryMutAct_9fa48("61333") ? true : (stryCov_9fa48("61333", "61334", "61335", "61336"), employees < 5000)) {
      datacendiaCost = 350000;
    } else {
      datacendiaCost = 500000;
    }
    const netBenefit = stryMutAct_9fa48("61339") ? totalBenefit + datacendiaCost : (stryCov_9fa48("61339"), totalBenefit - datacendiaCost);
    const roiPercentage = stryMutAct_9fa48("61340") ? (totalBenefit - datacendiaCost) / datacendiaCost / 100 : (stryCov_9fa48("61340"), (stryMutAct_9fa48("61341") ? (totalBenefit - datacendiaCost) * datacendiaCost : (stryCov_9fa48("61341"), (stryMutAct_9fa48("61342") ? totalBenefit + datacendiaCost : (stryCov_9fa48("61342"), totalBenefit - datacendiaCost)) / datacendiaCost)) * 100);
    const paybackMonths = stryMutAct_9fa48("61343") ? datacendiaCost / totalBenefit / 12 : (stryCov_9fa48("61343"), (stryMutAct_9fa48("61344") ? datacendiaCost * totalBenefit : (stryCov_9fa48("61344"), datacendiaCost / totalBenefit)) * 12);
    return stryMutAct_9fa48("61345") ? {} : (stryCov_9fa48("61345"), {
      decisionSavings,
      complianceSavings,
      shadowAISavings,
      dataQualitySavings,
      delaySavings,
      totalBenefit,
      datacendiaCost,
      netBenefit,
      roiPercentage,
      paybackMonths
    });
  }, stryMutAct_9fa48("61346") ? [] : (stryCov_9fa48("61346"), [employees, executives, industry, currentAISpend, complianceHeavy]));
  const savingsBreakdown = stryMutAct_9fa48("61347") ? [] : (stryCov_9fa48("61347"), [stryMutAct_9fa48("61348") ? {} : (stryCov_9fa48("61348"), {
    label: 'Decision Acceleration',
    value: roi.decisionSavings,
    icon: Clock,
    color: 'text-blue-400'
  }), stryMutAct_9fa48("61351") ? {} : (stryCov_9fa48("61351"), {
    label: 'Compliance Efficiency',
    value: roi.complianceSavings,
    icon: Shield,
    color: 'text-amber-400'
  }), stryMutAct_9fa48("61354") ? {} : (stryCov_9fa48("61354"), {
    label: 'Shadow AI Elimination',
    value: roi.shadowAISavings,
    icon: AlertTriangle,
    color: 'text-red-400'
  }), stryMutAct_9fa48("61357") ? {} : (stryCov_9fa48("61357"), {
    label: 'Data Quality Improvement',
    value: roi.dataQualitySavings,
    icon: TrendingUp,
    color: 'text-green-400'
  }), stryMutAct_9fa48("61360") ? {} : (stryCov_9fa48("61360"), {
    label: 'Strategic Speed',
    value: roi.delaySavings,
    icon: ChevronRight,
    color: 'text-purple-400'
  })]);
  return <div className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-500/20 rounded-lg">
              <Calculator className="w-6 h-6 text-emerald-400" />
            </div>
            <h1 className="text-2xl font-bold text-white">ROI Calculator</h1>
          </div>
          <p className="text-gray-400">Calculate the return on investment for Datacendia implementation</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Inputs */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
            <h2 className="text-lg font-semibold text-white mb-6">Organization Profile</h2>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Total Employees
                </label>
                <input type="range" min="50" max="10000" step="50" value={employees} onChange={stryMutAct_9fa48("61363") ? () => undefined : (stryCov_9fa48("61363"), e => setEmployees(Number(e.target.value)))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer" />
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-gray-500">50</span>
                  <span className="text-white font-medium">{employees.toLocaleString()}</span>
                  <span className="text-gray-500">10,000</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Executives & Senior Leaders
                </label>
                <input type="range" min="5" max="100" value={executives} onChange={stryMutAct_9fa48("61364") ? () => undefined : (stryCov_9fa48("61364"), e => setExecutives(Number(e.target.value)))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer" />
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-gray-500">5</span>
                  <span className="text-white font-medium">{executives}</span>
                  <span className="text-gray-500">100</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Industry
                </label>
                <select value={industry} onChange={stryMutAct_9fa48("61365") ? () => undefined : (stryCov_9fa48("61365"), e => setIndustry(e.target.value))} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white">
                  {INDUSTRIES.map(stryMutAct_9fa48("61366") ? () => undefined : (stryCov_9fa48("61366"), ind => <option key={ind.id} value={ind.id}>{ind.name}</option>))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Current AI/Analytics Spend
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input type="number" value={currentAISpend} onChange={stryMutAct_9fa48("61367") ? () => undefined : (stryCov_9fa48("61367"), e => setCurrentAISpend(Number(e.target.value)))} className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-9 pr-4 py-2.5 text-white" />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-400">
                  Heavy Compliance Requirements
                </label>
                <button onClick={stryMutAct_9fa48("61368") ? () => undefined : (stryCov_9fa48("61368"), () => setComplianceHeavy(stryMutAct_9fa48("61369") ? complianceHeavy : (stryCov_9fa48("61369"), !complianceHeavy)))} className={cn("w-12 h-6 rounded-full transition-colors", complianceHeavy ? "bg-emerald-500" : "bg-gray-700")}>
                  <div className={cn("w-5 h-5 bg-white rounded-full transition-transform", complianceHeavy ? "translate-x-6" : "translate-x-0.5")} />
                </button>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-2 space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border border-emerald-500/30 rounded-xl p-5">
                <div className="text-sm text-emerald-400 mb-1">Annual Savings</div>
                <div className="text-2xl font-bold text-white">{formatCurrency(roi.totalBenefit)}</div>
              </div>
              <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/30 rounded-xl p-5">
                <div className="text-sm text-blue-400 mb-1">ROI</div>
                <div className="text-2xl font-bold text-white">{roi.roiPercentage.toFixed(0)}%</div>
              </div>
              <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 border border-purple-500/30 rounded-xl p-5">
                <div className="text-sm text-purple-400 mb-1">Payback Period</div>
                <div className="text-2xl font-bold text-white">{roi.paybackMonths.toFixed(1)} mo</div>
              </div>
            </div>

            {/* Breakdown */}
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Savings Breakdown</h3>
              <div className="space-y-4">
                {savingsBreakdown.map(stryMutAct_9fa48("61376") ? () => undefined : (stryCov_9fa48("61376"), (item, i) => <div key={i} className="flex items-center gap-4">
                    <div className={cn("p-2 rounded-lg bg-gray-800", item.color)}>
                      <item.icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-300">{item.label}</span>
                        <span className="text-sm font-medium text-white">{formatCurrency(item.value)}</span>
                      </div>
                      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full" style={stryMutAct_9fa48("61378") ? {} : (stryCov_9fa48("61378"), {
                      width: `${stryMutAct_9fa48("61380") ? item.value / roi.totalBenefit / 100 : (stryCov_9fa48("61380"), (stryMutAct_9fa48("61381") ? item.value * roi.totalBenefit : (stryCov_9fa48("61381"), item.value / roi.totalBenefit)) * 100)}%`
                    })} />
                      </div>
                    </div>
                  </div>))}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-800">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm text-gray-400">Datacendia Investment</div>
                    <div className="text-lg font-semibold text-white">{formatCurrency(roi.datacendiaCost)}/year</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-400">Net Annual Benefit</div>
                    <div className="text-lg font-semibold text-emerald-400">{formatCurrency(roi.netBenefit)}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors">
                <Download className="w-4 h-4" />
                Export PDF Report
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors">
                <Share2 className="w-4 h-4" />
                Share Analysis
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>;
}