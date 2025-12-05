import React, { useState, useMemo } from 'react';

/**
 * Datacendia Regional Pricing Calculator
 * Input region + tier = instant pricing
 */

const REGIONS = {
  'north_america': { name: 'North America', flag: '🇺🇸', countries: 'USA, Canada', currency: 'USD', multiplier: 1.00 },
  'uk_western_europe': { name: 'UK & Western Europe', flag: '🇬🇧', countries: 'UK, Germany, France, Nordics, etc.', currency: 'EUR', multiplier: 1.00, symbol: '€', rate: 0.92 },
  'australia_japan': { name: 'Australia/NZ & Japan', flag: '🇦🇺', countries: 'Australia, New Zealand, Japan', currency: 'USD', multiplier: 0.95 },
  'gulf_states': { name: 'Gulf States', flag: '🇦🇪', countries: 'UAE, Saudi Arabia, Qatar, Kuwait', currency: 'USD', multiplier: 1.00 },
  'singapore_hongkong': { name: 'Singapore & Hong Kong', flag: '🇸🇬', countries: 'Singapore, Hong Kong', currency: 'USD', multiplier: 0.95 },
  'eastern_europe': { name: 'Eastern Europe', flag: '🇵🇱', countries: 'Poland, Czech Republic, Romania, etc.', currency: 'EUR', multiplier: 0.65, symbol: '€', rate: 0.92 },
  'latin_america': { name: 'Latin America', flag: '🇧🇷', countries: 'Brazil, Mexico, Argentina, etc.', currency: 'USD', multiplier: 0.55 },
  'southeast_asia': { name: 'Southeast Asia', flag: '🇹🇭', countries: 'Thailand, Vietnam, Indonesia, etc.', currency: 'USD', multiplier: 0.50 },
  'india': { name: 'India', flag: '🇮🇳', countries: 'India', currency: 'USD', multiplier: 0.45 },
  'middle_east_other': { name: 'Middle East (Non-Gulf)', flag: '🇪🇬', countries: 'Egypt, Jordan, Morocco, etc.', currency: 'USD', multiplier: 0.60 },
  'africa': { name: 'Africa', flag: '🇿🇦', countries: 'South Africa, Nigeria, Kenya, etc.', currency: 'USD', multiplier: 0.45 },
  'china': { name: 'China', flag: '🇨🇳', countries: 'China (PRC)', currency: 'RMB', multiplier: 0.70, symbol: '¥', rate: 7.2 }
};

const BASE_PRICING = {
  starter: { annual: 36000, name: 'Starter', users: '25 users', sources: '2 sources' },
  professional: { annual: 120000, name: 'Professional', users: 'Unlimited', sources: '5 sources' },
  enterprise: { annual: 300000, name: 'Enterprise', users: 'Unlimited', sources: 'Unlimited' },
  sovereign: { annual: 500000, name: 'Sovereign', users: 'Unlimited', sources: 'Unlimited' }
};

const DISCOUNTS = { 1: 0, 2: 0.10, 3: 0.20 };

export default function RegionalPricingCalculator() {
  const [region, setRegion] = useState('north_america');
  const [tier, setTier] = useState('professional');
  const [years, setYears] = useState(1);

  const pricing = useMemo(() => {
    const r = REGIONS[region];
    const t = BASE_PRICING[tier];
    const base = t.annual * r.multiplier;
    const discount = DISCOUNTS[years];
    const annual = base * (1 - discount);
    const total = annual * years;
    const local = r.rate ? annual * r.rate : annual;
    
    return { base, discount, annual, total, local, symbol: r.symbol || '$', currency: r.currency };
  }, [region, tier, years]);

  const fmt = (v, s = '$') => `${s}${new Intl.NumberFormat('en-US').format(Math.round(v))}`;

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Regional Pricing Calculator</h1>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Inputs */}
          <div className="space-y-4">
            <div className="bg-slate-900 rounded-xl p-5 border border-slate-700">
              <label className="block text-sm text-slate-400 mb-2">Region</label>
              <select value={region} onChange={e => setRegion(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg">
                {Object.entries(REGIONS).map(([k, v]) => (
                  <option key={k} value={k}>{v.flag} {v.name}</option>
                ))}
              </select>
              <p className="text-xs text-slate-500 mt-2">{REGIONS[region].countries}</p>
            </div>

            <div className="bg-slate-900 rounded-xl p-5 border border-slate-700">
              <label className="block text-sm text-slate-400 mb-2">Tier</label>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(BASE_PRICING).map(([k, v]) => (
                  <button key={k} onClick={() => setTier(k)}
                    className={`p-3 rounded-lg border-2 text-left ${tier === k ? 'border-blue-500 bg-blue-500/20' : 'border-slate-700'}`}>
                    <div className="font-semibold">{v.name}</div>
                    <div className="text-xs text-slate-400">{v.users}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-slate-900 rounded-xl p-5 border border-slate-700">
              <label className="block text-sm text-slate-400 mb-2">Contract Length</label>
              <div className="flex gap-2">
                {[1, 2, 3].map(y => (
                  <button key={y} onClick={() => setYears(y)}
                    className={`flex-1 py-3 rounded-lg border-2 ${years === y ? 'border-blue-500 bg-blue-500/20' : 'border-slate-700'}`}>
                    {y}yr {DISCOUNTS[y] > 0 && <span className="text-green-400 text-sm">-{DISCOUNTS[y]*100}%</span>}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-blue-900/50 to-purple-900/50 rounded-xl p-6 border border-blue-500/30">
              <div className="text-sm text-blue-300">Annual Price</div>
              <div className="text-5xl font-bold">{fmt(pricing.annual)}</div>
              {pricing.symbol !== '$' && (
                <div className="text-xl text-slate-400">≈ {fmt(pricing.local, pricing.symbol)} {pricing.currency}</div>
              )}
              <div className="text-sm text-slate-400 mt-2">{BASE_PRICING[tier].name} • {REGIONS[region].name}</div>
            </div>

            <div className="bg-slate-900 rounded-xl p-5 border border-slate-700">
              <h3 className="font-semibold mb-3">Breakdown</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-slate-400">Base (USA)</span><span>{fmt(BASE_PRICING[tier].annual)}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Regional ({Math.round(REGIONS[region].multiplier*100)}%)</span><span>{fmt(pricing.base)}</span></div>
                {pricing.discount > 0 && <div className="flex justify-between text-green-400"><span>Multi-year discount</span><span>-{pricing.discount*100}%</span></div>}
                <div className="border-t border-slate-700 pt-2 flex justify-between font-semibold">
                  <span>Annual</span><span>{fmt(pricing.annual)}</span>
                </div>
                {years > 1 && (
                  <div className="flex justify-between text-blue-400">
                    <span>{years}-Year Total</span><span>{fmt(pricing.total)}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-slate-800 rounded-lg p-4 text-sm">
              <span className="text-slate-400">Copy: </span>
              <code className="text-green-400">{BASE_PRICING[tier].name} ({REGIONS[region].name}): {fmt(pricing.annual)}/yr</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
