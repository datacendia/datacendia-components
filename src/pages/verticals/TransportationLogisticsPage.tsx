// =============================================================================
// DATACENDIA TRANSPORTATION / LOGISTICS VERTICAL
// Fleet optimization, route intelligence, and supply chain decisions
// =============================================================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const agents = [
  { code: 'fleet', name: 'Fleet Director', purpose: 'Vehicle optimization, maintenance scheduling, asset utilization', model: 'qwq:32b' },
  { code: 'routing', name: 'Routing Manager', purpose: 'Route optimization, delivery scheduling, capacity planning', model: 'llama3.3:70b' },
  { code: 'logistics', name: 'Logistics Analyst', purpose: 'Warehouse operations, inventory positioning, 3PL management', model: 'qwq:32b' },
  { code: 'compliance-trans', name: 'Compliance Officer', purpose: 'DOT regulations, driver hours, safety compliance', model: 'llama3.3:70b' },
];

const compliance = ['DOT/FMCSA', 'Hours of Service', 'HAZMAT', 'Customs/CBP', 'EPA Emissions', 'OSHA', 'TSA Security'];

const pricing = [
  { package: 'Transport Starter', price: '$70,000', includes: '8 Pillars + 4 Transport Agents', roi: '6 months' },
  { package: 'Transport Professional', price: '$500,000', includes: '+ Predict, Mesh, Panopticon', roi: '4 months' },
  { package: 'Transport Enterprise', price: '$2,500,000', includes: '+ Full Guardian Suite', roi: '3 months' },
  { package: 'Transport Sovereign', price: '$6,000,000+', includes: '+ Multi-modal, custom', roi: '2 months' },
];

export const TransportationLogisticsPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'agents' | 'pricing'>('overview');

  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      <div className="relative overflow-hidden border-b border-neutral-800">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-900/20 via-neutral-900 to-neutral-900"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <button onClick={() => navigate('/verticals')} className="flex items-center gap-2 text-neutral-400 hover:text-white mb-6">← Back to Verticals</button>
          
          <div className="flex items-start gap-6">
            <span className="text-6xl">🚚</span>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">📈 Growth Vertical</span>
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">🔒 88% Sovereignty</span>
              </div>
              <h1 className="text-4xl font-bold mb-4">Transportation / Logistics</h1>
              <p className="text-xl text-neutral-300 max-w-3xl">
                Fleet optimization, route intelligence, and supply chain decision support. 
                From last-mile delivery to cross-border freight to warehouse operations.
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-neutral-400">Pilot Result</p>
              <p className="text-3xl font-bold text-green-400">18%</p>
              <p className="text-neutral-300">fuel cost reduction</p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-6 mt-12">
            {[
              { label: '18-Month ROI', value: '26%', subtext: 'cost reduction' },
              { label: 'Route Efficiency', value: '18%', subtext: 'improvement' },
              { label: 'On-Time Delivery', value: '94%', subtext: 'vs 82% baseline' },
              { label: 'Fleet Utilization', value: '+22%', subtext: 'improvement' },
            ].map(stat => (
              <div key={stat.label} className="bg-neutral-800/50 rounded-xl p-6 border border-neutral-700">
                <p className="text-3xl font-bold text-primary-400">{stat.value}</p>
                <p className="font-medium">{stat.label}</p>
                <p className="text-sm text-neutral-500">{stat.subtext}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1">
            {['overview', 'agents', 'pricing'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab as typeof activeTab)}
                className={`px-6 py-4 font-medium capitalize transition-all border-b-2 ${activeTab === tab ? 'border-primary-500 text-white' : 'border-transparent text-neutral-400 hover:text-white'}`}>
                {tab === 'agents' ? 'Agents & Analytics' : tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {activeTab === 'overview' && (
          <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-6">Why Datacendia for Transportation</h2>
              <div className="grid grid-cols-3 gap-6">
                {[
                  { title: 'Route Optimization', desc: 'AI-powered routing that considers traffic, weather, driver hours, and delivery windows in real-time', icon: '🗺️' },
                  { title: 'Fleet Intelligence', desc: 'Predictive maintenance, asset utilization optimization, and replacement timing recommendations', icon: '🚛' },
                  { title: 'Compliance Automation', desc: 'DOT hours tracking, safety compliance, and regulatory reporting with full audit trail', icon: '📋' },
                ].map(item => (
                  <div key={item.title} className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
                    <span className="text-3xl">{item.icon}</span>
                    <h3 className="text-lg font-semibold mt-4 mb-2">{item.title}</h3>
                    <p className="text-neutral-400">{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-6">Customer Results</h2>
              <div className="space-y-4">
                {[
                  { org: 'Regional Trucking Company', quote: 'Fuel costs reduced 18% through AI-optimized routing. The Council factors in 23 variables our dispatchers couldn\'t process manually.', metric: '18% fuel savings' },
                  { org: 'E-Commerce Fulfillment', quote: 'On-time delivery improved from 82% to 94%. Customer complaints dropped 60% in first quarter.', metric: '94% on-time' },
                  { org: '3PL Provider', quote: 'Warehouse labor optimization freed 22% capacity without adding headcount. We took on 3 new clients.', metric: '22% more capacity' },
                ].map((cs, idx) => (
                  <div key={idx} className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-neutral-300 text-lg italic">"{cs.quote}"</p>
                        <p className="text-neutral-500 mt-3">— {cs.org}</p>
                      </div>
                      <div className="ml-6 text-right">
                        <p className="text-2xl font-bold text-green-400">{cs.metric}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-6">Compliance Frameworks</h2>
              <div className="flex flex-wrap gap-2">
                {compliance.map(c => (
                  <span key={c} className="px-4 py-2 bg-sky-500/10 text-sky-400 rounded-lg border border-sky-500/30 font-medium">{c}</span>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'agents' && (
          <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-6">Transportation & Logistics Agents</h2>
              <div className="grid grid-cols-2 gap-6">
                {agents.map(agent => (
                  <div key={agent.code} className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-sky-500/20 rounded-full flex items-center justify-center"><span className="text-xl">🤖</span></div>
                      <div>
                        <h3 className="font-semibold text-lg">{agent.name}</h3>
                        <code className="text-xs text-neutral-500 bg-neutral-900 px-2 py-0.5 rounded">{agent.code}</code>
                      </div>
                    </div>
                    <p className="text-neutral-300 mb-3">{agent.purpose}</p>
                    <p className="text-sm text-neutral-500">Model: <code className="text-primary-400">{agent.model}</code></p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'pricing' && (
          <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-6">Transportation Pricing</h2>
              <div className="grid grid-cols-4 gap-6">
                {pricing.map((pkg, idx) => (
                  <div key={pkg.package} className={`rounded-xl p-6 border ${idx === 1 ? 'bg-primary-900/20 border-primary-500' : 'bg-neutral-800 border-neutral-700'}`}>
                    {idx === 1 && <span className="text-xs bg-primary-500 text-white px-2 py-1 rounded mb-3 inline-block">Most Popular</span>}
                    <h3 className="font-semibold text-lg mb-2">{pkg.package}</h3>
                    <p className="text-2xl font-bold text-primary-400 mb-4">{pkg.price}</p>
                    <p className="text-neutral-400 mb-4">{pkg.includes}</p>
                    <p className="text-sm text-green-400">ROI: {pkg.roi}</p>
                  </div>
                ))}
              </div>
            </section>
            <section className="text-center">
              <div className="flex justify-center gap-4">
                <button onClick={() => navigate('/demo')} className="px-8 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700">Request Transport Demo</button>
                <button onClick={() => navigate('/contact')} className="px-8 py-3 border border-neutral-600 text-white rounded-lg font-medium hover:bg-neutral-800">Talk to Sales</button>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransportationLogisticsPage;
