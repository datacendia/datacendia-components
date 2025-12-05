import React, { useState, useMemo } from 'react';

/**
 * Datacendia ROI Calculator
 * Interactive calculator for enterprise sales conversations
 */

// Industry benchmarks for ROI calculations
const BENCHMARKS = {
  decision_meeting_hours_per_week: 12,
  average_hourly_cost_executive: 250,
  compliance_audit_hours_per_year: 800,
  compliance_hourly_cost: 150,
  shadow_ai_incidents_per_year: 24,
  shadow_ai_cost_per_incident: 15000,
  data_quality_issues_per_month: 35,
  data_quality_cost_per_issue: 2500,
  strategic_delays_per_year: 6,
  strategic_delay_opportunity_cost: 100000,
};

// Datacendia improvement factors
const IMPROVEMENTS = {
  decision_time_reduction: 0.73, // 73% faster decisions
  compliance_time_reduction: 0.60, // 60% less audit prep
  shadow_ai_elimination: 0.90, // 90% reduction in shadow AI
  data_quality_improvement: 0.65, // 65% fewer data issues
  strategic_delay_reduction: 0.70, // 70% fewer delays
};

export default function ROICalculator() {
  // Inputs
  const [employees, setEmployees] = useState(500);
  const [executives, setExecutives] = useState(25);
  const [industry, setIndustry] = useState('financial_services');
  const [currentAISpend, setCurrentAISpend] = useState(200000);
  const [complianceHeavy, setComplianceHeavy] = useState(true);

  // Calculate ROI
  const roi = useMemo(() => {
    // Decision time savings
    const weeklyMeetingHours = BENCHMARKS.decision_meeting_hours_per_week * executives;
    const annualMeetingHours = weeklyMeetingHours * 48; // 48 working weeks
    const meetingCostBefore = annualMeetingHours * BENCHMARKS.average_hourly_cost_executive;
    const meetingCostAfter = meetingCostBefore * (1 - IMPROVEMENTS.decision_time_reduction);
    const decisionSavings = meetingCostBefore - meetingCostAfter;

    // Compliance savings
    const complianceMultiplier = complianceHeavy ? 1.5 : 1.0;
    const complianceHours = BENCHMARKS.compliance_audit_hours_per_year * complianceMultiplier;
    const complianceCostBefore = complianceHours * BENCHMARKS.compliance_hourly_cost;
    const complianceCostAfter = complianceCostBefore * (1 - IMPROVEMENTS.compliance_time_reduction);
    const complianceSavings = complianceCostBefore - complianceCostAfter;

    // Shadow AI risk reduction
    const shadowAICostBefore = BENCHMARKS.shadow_ai_incidents_per_year * BENCHMARKS.shadow_ai_cost_per_incident;
    const shadowAICostAfter = shadowAICostBefore * (1 - IMPROVEMENTS.shadow_ai_elimination);
    const shadowAISavings = shadowAICostBefore - shadowAICostAfter;

    // Data quality improvement
    const dataIssuesPerYear = BENCHMARKS.data_quality_issues_per_month * 12;
    const dataQualityCostBefore = dataIssuesPerYear * BENCHMARKS.data_quality_cost_per_issue;
    const dataQualityCostAfter = dataQualityCostBefore * (1 - IMPROVEMENTS.data_quality_improvement);
    const dataQualitySavings = dataQualityCostBefore - dataQualityCostAfter;

    // Strategic delay opportunity cost recovery
    const delaysCostBefore = BENCHMARKS.strategic_delays_per_year * BENCHMARKS.strategic_delay_opportunity_cost;
    const delaysCostAfter = delaysCostBefore * (1 - IMPROVEMENTS.strategic_delay_reduction);
    const delaySavings = delaysCostBefore - delaysCostAfter;

    // Total benefits
    const totalAnnualBenefit = decisionSavings + complianceSavings + shadowAISavings + dataQualitySavings + delaySavings;

    // Estimated Datacendia cost based on company size
    let datacendiaCost;
    if (employees < 200) {
      datacendiaCost = 50000;
    } else if (employees < 1000) {
      datacendiaCost = 150000;
    } else if (employees < 5000) {
      datacendiaCost = 400000;
    } else {
      datacendiaCost = 750000;
    }

    // ROI calculation
    const netBenefit = totalAnnualBenefit - datacendiaCost;
    const roiPercent = ((totalAnnualBenefit - datacendiaCost) / datacendiaCost) * 100;
    const paybackMonths = (datacendiaCost / totalAnnualBenefit) * 12;

    return {
      decisionSavings: Math.round(decisionSavings),
      complianceSavings: Math.round(complianceSavings),
      shadowAISavings: Math.round(shadowAISavings),
      dataQualitySavings: Math.round(dataQualitySavings),
      delaySavings: Math.round(delaySavings),
      totalAnnualBenefit: Math.round(totalAnnualBenefit),
      datacendiaCost,
      netBenefit: Math.round(netBenefit),
      roiPercent: Math.round(roiPercent),
      paybackMonths: Math.round(paybackMonths * 10) / 10,
      threeYearValue: Math.round(totalAnnualBenefit * 3 - datacendiaCost),
    };
  }, [employees, executives, industry, currentAISpend, complianceHeavy]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-2">Datacendia ROI Calculator</h1>
          <p className="text-slate-400">Estimate your return on investment in 60 seconds</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Inputs */}
          <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
            <h2 className="text-xl font-semibold mb-6">Your Organization</h2>
            
            <div className="space-y-6">
              {/* Employees */}
              <div>
                <label className="block text-sm text-slate-400 mb-2">
                  Total Employees
                </label>
                <input
                  type="range"
                  min="50"
                  max="10000"
                  step="50"
                  value={employees}
                  onChange={(e) => setEmployees(Number(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <div className="text-2xl font-bold text-blue-400 mt-2">{employees.toLocaleString()}</div>
              </div>

              {/* Executives */}
              <div>
                <label className="block text-sm text-slate-400 mb-2">
                  Executives / Senior Leaders
                </label>
                <input
                  type="range"
                  min="5"
                  max="100"
                  step="5"
                  value={executives}
                  onChange={(e) => setExecutives(Number(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <div className="text-2xl font-bold text-blue-400 mt-2">{executives}</div>
              </div>

              {/* Industry */}
              <div>
                <label className="block text-sm text-slate-400 mb-2">
                  Industry
                </label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white"
                >
                  <option value="financial_services">Financial Services</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="manufacturing">Manufacturing</option>
                  <option value="technology">Technology</option>
                  <option value="energy">Energy & Utilities</option>
                  <option value="retail">Retail</option>
                  <option value="government">Government / Public Sector</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Compliance Toggle */}
              <div className="flex items-center justify-between p-4 bg-slate-800 rounded-lg">
                <div>
                  <div className="font-medium">Heavy Compliance Requirements</div>
                  <div className="text-sm text-slate-400">GDPR, HIPAA, SOX, PCI-DSS, etc.</div>
                </div>
                <button
                  onClick={() => setComplianceHeavy(!complianceHeavy)}
                  className={`relative w-14 h-7 rounded-full transition-colors ${
                    complianceHeavy ? 'bg-blue-600' : 'bg-slate-600'
                  }`}
                >
                  <span
                    className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                      complianceHeavy ? 'translate-x-8' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Current AI Spend */}
              <div>
                <label className="block text-sm text-slate-400 mb-2">
                  Current Annual AI/Analytics Spend
                </label>
                <input
                  type="range"
                  min="0"
                  max="2000000"
                  step="50000"
                  value={currentAISpend}
                  onChange={(e) => setCurrentAISpend(Number(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <div className="text-2xl font-bold text-blue-400 mt-2">{formatCurrency(currentAISpend)}</div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-6">
            {/* Big Numbers */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-6">
              <div className="text-center">
                <div className="text-sm text-blue-200 mb-1">Estimated Annual ROI</div>
                <div className="text-5xl font-bold">{roi.roiPercent}%</div>
                <div className="text-sm text-blue-200 mt-2">
                  Payback in {roi.paybackMonths} months
                </div>
              </div>
            </div>

            {/* Benefit Breakdown */}
            <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
              <h3 className="text-lg font-semibold mb-4">Annual Benefits Breakdown</h3>
              
              <div className="space-y-4">
                <BenefitRow 
                  label="Decision Time Savings" 
                  value={roi.decisionSavings} 
                  description="73% faster strategic decisions"
                />
                <BenefitRow 
                  label="Compliance Efficiency" 
                  value={roi.complianceSavings} 
                  description="60% less audit prep time"
                />
                <BenefitRow 
                  label="Shadow AI Risk Reduction" 
                  value={roi.shadowAISavings} 
                  description="90% fewer ungoverned AI incidents"
                />
                <BenefitRow 
                  label="Data Quality Improvement" 
                  value={roi.dataQualitySavings} 
                  description="65% fewer data issues"
                />
                <BenefitRow 
                  label="Strategic Opportunity Recovery" 
                  value={roi.delaySavings} 
                  description="70% fewer delayed decisions"
                />

                <div className="border-t border-slate-700 pt-4 mt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total Annual Benefit</span>
                    <span className="text-2xl font-bold text-green-400">
                      {formatCurrency(roi.totalAnnualBenefit)}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-slate-400">
                  <span>Datacendia Investment</span>
                  <span>{formatCurrency(roi.datacendiaCost)}/year</span>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-slate-700">
                  <span className="text-lg font-semibold">Net Annual Value</span>
                  <span className="text-2xl font-bold text-green-400">
                    {formatCurrency(roi.netBenefit)}
                  </span>
                </div>
              </div>
            </div>

            {/* 3-Year Projection */}
            <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
              <h3 className="text-lg font-semibold mb-2">3-Year Total Value</h3>
              <div className="text-4xl font-bold text-green-400">
                {formatCurrency(roi.threeYearValue)}
              </div>
              <p className="text-sm text-slate-400 mt-2">
                Cumulative benefit over 3 years after investment
              </p>
            </div>

            {/* CTA */}
            <div className="bg-slate-800 rounded-xl p-6 text-center">
              <p className="text-slate-300 mb-4">
                Want to see these numbers in a custom proposal?
              </p>
              <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors">
                Request Detailed Analysis →
              </button>
            </div>
          </div>
        </div>

        {/* Methodology Note */}
        <div className="mt-8 text-center text-sm text-slate-500">
          <p>
            Calculations based on industry benchmarks and Datacendia customer data.
            Actual results may vary based on implementation and usage.
          </p>
        </div>
      </div>
    </div>
  );
}

// Helper component for benefit rows
function BenefitRow({ label, value, description }) {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="flex justify-between items-start">
      <div>
        <div className="font-medium">{label}</div>
        <div className="text-xs text-slate-500">{description}</div>
      </div>
      <span className="text-green-400 font-semibold">{formatCurrency(value)}</span>
    </div>
  );
}

// Export for use
export { ROICalculator };
