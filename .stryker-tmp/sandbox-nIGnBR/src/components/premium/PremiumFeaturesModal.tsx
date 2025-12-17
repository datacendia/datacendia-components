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
import React, { useState } from 'react';
import { cn } from '../../../lib/utils';
import { PREMIUM_FEATURES, PREMIUM_BUNDLES, PREMIUM_TIERS, PremiumFeature, PremiumBundle, PremiumTier, calculateAnnualPrice, getTotalFeaturesValue, getFeatureById } from '../../data/premiumFeatures';
interface PremiumFeaturesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPurchase?: (itemId: string, type: 'feature' | 'bundle') => void;
  currentFeatures?: string[]; // Already purchased feature IDs
}
type ViewMode = 'features' | 'bundles' | 'agents';
type BillingCycle = 'monthly' | 'annual';
const PremiumFeaturesModal: React.FC<PremiumFeaturesModalProps> = ({
  isOpen,
  onClose,
  onPurchase,
  currentFeatures = stryMutAct_9fa48("5646") ? ["Stryker was here"] : (stryCov_9fa48("5646"), [])
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('bundles');
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('annual');
  const [selectedTier, setSelectedTier] = useState<PremiumTier | 'all'>('all');
  const [expandedFeature, setExpandedFeature] = useState<string | null>(null);
  if (stryMutAct_9fa48("5653") ? false : stryMutAct_9fa48("5652") ? true : stryMutAct_9fa48("5651") ? isOpen : (stryCov_9fa48("5651", "5652", "5653"), !isOpen)) {
    return null;
  }
  const filteredFeatures = (stryMutAct_9fa48("5657") ? selectedTier !== 'all' : stryMutAct_9fa48("5656") ? false : stryMutAct_9fa48("5655") ? true : (stryCov_9fa48("5655", "5656", "5657"), selectedTier === 'all')) ? PREMIUM_FEATURES : stryMutAct_9fa48("5659") ? PREMIUM_FEATURES : (stryCov_9fa48("5659"), PREMIUM_FEATURES.filter(stryMutAct_9fa48("5660") ? () => undefined : (stryCov_9fa48("5660"), f => stryMutAct_9fa48("5663") ? f.tier !== selectedTier : stryMutAct_9fa48("5662") ? false : stryMutAct_9fa48("5661") ? true : (stryCov_9fa48("5661", "5662", "5663"), f.tier === selectedTier))));
  const getPrice = (price: number, discount: number) => {
    if (stryMutAct_9fa48("5667") ? billingCycle !== 'annual' : stryMutAct_9fa48("5666") ? false : stryMutAct_9fa48("5665") ? true : (stryCov_9fa48("5665", "5666", "5667"), billingCycle === 'annual')) {
      return Math.round(stryMutAct_9fa48("5670") ? price / (1 - discount / 100) : (stryCov_9fa48("5670"), price * (stryMutAct_9fa48("5671") ? 1 + discount / 100 : (stryCov_9fa48("5671"), 1 - (stryMutAct_9fa48("5672") ? discount * 100 : (stryCov_9fa48("5672"), discount / 100))))));
    }
    return price;
  };
  const renderFeatureCard = (feature: PremiumFeature) => {
    const tier = PREMIUM_TIERS[feature.tier];
    const isOwned = currentFeatures.includes(feature.id);
    const isExpanded = stryMutAct_9fa48("5676") ? expandedFeature !== feature.id : stryMutAct_9fa48("5675") ? false : stryMutAct_9fa48("5674") ? true : (stryCov_9fa48("5674", "5675", "5676"), expandedFeature === feature.id);
    const displayPrice = getPrice(feature.price, feature.annualDiscount);
    return <div key={feature.id} className={cn('relative bg-white rounded-xl border-2 overflow-hidden transition-all', isOwned ? 'border-green-300 bg-green-50' : 'border-neutral-200 hover:border-neutral-300 hover:shadow-lg')}>
        {/* Tier Badge */}
        <div className={cn('absolute top-3 right-3 text-white text-[10px] font-bold px-2 py-0.5 rounded-full', `bg-gradient-to-r ${tier.bgGradient}`)}>
          {tier.icon} {stryMutAct_9fa48("5682") ? tier.name.toLowerCase() : (stryCov_9fa48("5682"), tier.name.toUpperCase())}
        </div>

        {/* Owned Badge */}
        {stryMutAct_9fa48("5685") ? isOwned || <div className="absolute top-3 left-3 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            ✓ OWNED
          </div> : stryMutAct_9fa48("5684") ? false : stryMutAct_9fa48("5683") ? true : (stryCov_9fa48("5683", "5684", "5685"), isOwned && <div className="absolute top-3 left-3 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            ✓ OWNED
          </div>)}

        <div className="p-5">
          {/* Icon & Name */}
          <div className="flex items-start gap-3 mb-3 mt-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={stryMutAct_9fa48("5686") ? {} : (stryCov_9fa48("5686"), {
            backgroundColor: `${tier.color}20`
          })}>
              {feature.icon}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-neutral-900">{feature.name}</h3>
              <p className="text-sm text-neutral-500">{feature.description}</p>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-3xl font-bold text-neutral-900">${displayPrice}</span>
            <span className="text-neutral-500">/month</span>
            {stryMutAct_9fa48("5690") ? billingCycle === 'annual' || <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                Save {feature.annualDiscount}%
              </span> : stryMutAct_9fa48("5689") ? false : stryMutAct_9fa48("5688") ? true : (stryCov_9fa48("5688", "5689", "5690"), (stryMutAct_9fa48("5692") ? billingCycle !== 'annual' : stryMutAct_9fa48("5691") ? true : (stryCov_9fa48("5691", "5692"), billingCycle === 'annual')) && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                Save {feature.annualDiscount}%
              </span>)}
          </div>

          {/* Features List */}
          <ul className="space-y-2 mb-4">
            {stryMutAct_9fa48("5694") ? feature.features.map((f, i) => <li key={i} className="flex items-start gap-2 text-sm text-neutral-600">
                <span className="text-green-500 mt-0.5">✓</span>
                {f}
              </li>) : (stryCov_9fa48("5694"), feature.features.slice(0, isExpanded ? undefined : 4).map(stryMutAct_9fa48("5695") ? () => undefined : (stryCov_9fa48("5695"), (f, i) => <li key={i} className="flex items-start gap-2 text-sm text-neutral-600">
                <span className="text-green-500 mt-0.5">✓</span>
                {f}
              </li>)))}
          </ul>

          {stryMutAct_9fa48("5698") ? feature.features.length > 4 || <button onClick={() => setExpandedFeature(isExpanded ? null : feature.id)} className="text-sm text-primary-600 hover:text-primary-700 mb-4">
              {isExpanded ? '← Show less' : `+ ${feature.features.length - 4} more features`}
            </button> : stryMutAct_9fa48("5697") ? false : stryMutAct_9fa48("5696") ? true : (stryCov_9fa48("5696", "5697", "5698"), (stryMutAct_9fa48("5701") ? feature.features.length <= 4 : stryMutAct_9fa48("5700") ? feature.features.length >= 4 : stryMutAct_9fa48("5699") ? true : (stryCov_9fa48("5699", "5700", "5701"), feature.features.length > 4)) && <button onClick={stryMutAct_9fa48("5702") ? () => undefined : (stryCov_9fa48("5702"), () => setExpandedFeature(isExpanded ? null : feature.id))} className="text-sm text-primary-600 hover:text-primary-700 mb-4">
              {isExpanded ? '← Show less' : `+ ${stryMutAct_9fa48("5705") ? feature.features.length + 4 : (stryCov_9fa48("5705"), feature.features.length - 4)} more features`}
            </button>)}

          {/* Agent Integration */}
          <div className="p-3 bg-neutral-50 rounded-lg mb-4">
            <p className="text-xs font-semibold text-neutral-500 mb-1">🤖 AGENT INTEGRATION</p>
            <p className="text-sm text-neutral-600">{feature.agentIntegration}</p>
          </div>

          {/* CTA Button */}
          <button onClick={stryMutAct_9fa48("5706") ? () => undefined : (stryCov_9fa48("5706"), () => stryMutAct_9fa48("5707") ? onPurchase(feature.id, 'feature') : (stryCov_9fa48("5707"), onPurchase?.(feature.id, 'feature')))} disabled={isOwned} className={cn('w-full py-3 rounded-lg font-semibold transition-all', isOwned ? 'bg-green-100 text-green-700 cursor-default' : `bg-gradient-to-r ${tier.bgGradient} text-white hover:opacity-90 hover:shadow-md`)}>
            {isOwned ? '✓ Already Owned' : `Get ${feature.name}`}
          </button>
        </div>
      </div>;
  };
  const renderBundleCard = (bundle: PremiumBundle) => {
    const tier = PREMIUM_TIERS[bundle.tier];
    const includedFeatures = bundle.includedFeatures.map(id => getFeatureById(id)).filter(Boolean) as PremiumFeature[];
    const totalValue = getTotalFeaturesValue(bundle.includedFeatures);
    const displayPrice = getPrice(bundle.price, bundle.annualDiscount);
    const allOwned = stryMutAct_9fa48("5715") ? bundle.includedFeatures.some(id => currentFeatures.includes(id)) : (stryCov_9fa48("5715"), bundle.includedFeatures.every(stryMutAct_9fa48("5716") ? () => undefined : (stryCov_9fa48("5716"), id => currentFeatures.includes(id))));
    return <div key={bundle.id} className={cn('relative bg-white rounded-xl border-2 overflow-hidden transition-all', stryMutAct_9fa48("5720") ? bundle.popular || 'ring-2 ring-primary-500 ring-offset-2' : stryMutAct_9fa48("5719") ? false : stryMutAct_9fa48("5718") ? true : (stryCov_9fa48("5718", "5719", "5720"), bundle.popular && 'ring-2 ring-primary-500 ring-offset-2'), stryMutAct_9fa48("5724") ? bundle.enterprise || 'ring-2 ring-amber-500 ring-offset-2' : stryMutAct_9fa48("5723") ? false : stryMutAct_9fa48("5722") ? true : (stryCov_9fa48("5722", "5723", "5724"), bundle.enterprise && 'ring-2 ring-amber-500 ring-offset-2'), allOwned ? 'border-green-300 bg-green-50' : 'border-neutral-200 hover:shadow-xl')}>
        {/* Popular/Enterprise Badge */}
        {stryMutAct_9fa48("5730") ? bundle.popular || <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-500 text-white text-xs font-bold px-4 py-1 rounded-full">
            ⭐ MOST POPULAR
          </div> : stryMutAct_9fa48("5729") ? false : stryMutAct_9fa48("5728") ? true : (stryCov_9fa48("5728", "5729", "5730"), bundle.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-500 text-white text-xs font-bold px-4 py-1 rounded-full">
            ⭐ MOST POPULAR
          </div>)}
        {stryMutAct_9fa48("5733") ? bundle.enterprise || <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-4 py-1 rounded-full">
            👑 BEST VALUE
          </div> : stryMutAct_9fa48("5732") ? false : stryMutAct_9fa48("5731") ? true : (stryCov_9fa48("5731", "5732", "5733"), bundle.enterprise && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-4 py-1 rounded-full">
            👑 BEST VALUE
          </div>)}

        {/* Tier Badge */}
        <div className={cn('absolute top-3 right-3 text-white text-[10px] font-bold px-2 py-0.5 rounded-full', `bg-gradient-to-r ${tier.bgGradient}`)}>
          {tier.icon} {stryMutAct_9fa48("5736") ? tier.name.toLowerCase() : (stryCov_9fa48("5736"), tier.name.toUpperCase())}
        </div>

        <div className="p-6 pt-8">
          {/* Icon & Name */}
          <div className="text-center mb-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-3" style={stryMutAct_9fa48("5737") ? {} : (stryCov_9fa48("5737"), {
            backgroundColor: `${tier.color}20`
          })}>
              {bundle.icon}
            </div>
            <h3 className="text-xl font-bold text-neutral-900">{bundle.name}</h3>
            <p className="text-sm text-neutral-500 mt-1">{bundle.description}</p>
          </div>

          {/* Price */}
          <div className="text-center mb-4">
            <div className="flex items-baseline justify-center gap-2">
              <span className="text-4xl font-bold text-neutral-900">${displayPrice}</span>
              <span className="text-neutral-500">/month</span>
            </div>
            <div className="flex items-center justify-center gap-2 mt-2">
              <span className="text-sm text-neutral-400 line-through">${totalValue}/mo separately</span>
              <span className="text-sm bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">
                Save ${bundle.savings}/mo
              </span>
            </div>
            {stryMutAct_9fa48("5741") ? billingCycle === 'annual' || <p className="text-xs text-green-600 mt-1">
                + Additional {bundle.annualDiscount}% off with annual billing
              </p> : stryMutAct_9fa48("5740") ? false : stryMutAct_9fa48("5739") ? true : (stryCov_9fa48("5739", "5740", "5741"), (stryMutAct_9fa48("5743") ? billingCycle !== 'annual' : stryMutAct_9fa48("5742") ? true : (stryCov_9fa48("5742", "5743"), billingCycle === 'annual')) && <p className="text-xs text-green-600 mt-1">
                + Additional {bundle.annualDiscount}% off with annual billing
              </p>)}
          </div>

          {/* Included Features */}
          <div className="space-y-2 mb-6">
            <p className="text-xs font-semibold text-neutral-500">INCLUDES:</p>
            {includedFeatures.map(stryMutAct_9fa48("5745") ? () => undefined : (stryCov_9fa48("5745"), feature => <div key={feature.id} className="flex items-center gap-2 p-2 bg-neutral-50 rounded-lg">
                <span className="text-lg">{feature.icon}</span>
                <span className="text-sm font-medium text-neutral-700">{feature.name}</span>
                <span className="ml-auto text-xs text-neutral-400">${feature.price}/mo</span>
              </div>))}
          </div>

          {/* CTA Button */}
          <button onClick={stryMutAct_9fa48("5746") ? () => undefined : (stryCov_9fa48("5746"), () => stryMutAct_9fa48("5747") ? onPurchase(bundle.id, 'bundle') : (stryCov_9fa48("5747"), onPurchase?.(bundle.id, 'bundle')))} disabled={allOwned} className={cn('w-full py-3 rounded-lg font-semibold transition-all text-lg', allOwned ? 'bg-green-100 text-green-700 cursor-default' : bundle.enterprise ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:opacity-90 hover:shadow-lg' : `bg-gradient-to-r ${tier.bgGradient} text-white hover:opacity-90 hover:shadow-lg`)}>
            {allOwned ? '✓ All Features Owned' : `Get ${bundle.name}`}
          </button>
        </div>
      </div>;
  };
  return <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-neutral-50 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-primary-600 via-purple-600 to-indigo-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <span>✨</span> Premium Features
              </h2>
              <p className="text-white/80 mt-1">
                Supercharge your AI Council with powerful add-ons
              </p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
              ✕
            </button>
          </div>

          {/* View Mode & Billing Toggle */}
          <div className="flex items-center justify-between mt-6">
            {/* View Mode Toggle */}
            <div className="flex bg-white/20 rounded-lg p-1">
              <button onClick={stryMutAct_9fa48("5755") ? () => undefined : (stryCov_9fa48("5755"), () => setViewMode('bundles'))} className={cn('px-4 py-2 rounded-md text-sm font-medium transition-all', (stryMutAct_9fa48("5760") ? viewMode !== 'bundles' : stryMutAct_9fa48("5759") ? false : stryMutAct_9fa48("5758") ? true : (stryCov_9fa48("5758", "5759", "5760"), viewMode === 'bundles')) ? 'bg-white text-primary-600' : 'text-white hover:bg-white/10')}>
                💎 Bundles
              </button>
              <button onClick={stryMutAct_9fa48("5764") ? () => undefined : (stryCov_9fa48("5764"), () => setViewMode('features'))} className={cn('px-4 py-2 rounded-md text-sm font-medium transition-all', (stryMutAct_9fa48("5769") ? viewMode !== 'features' : stryMutAct_9fa48("5768") ? false : stryMutAct_9fa48("5767") ? true : (stryCov_9fa48("5767", "5768", "5769"), viewMode === 'features')) ? 'bg-white text-primary-600' : 'text-white hover:bg-white/10')}>
                📦 Individual Features
              </button>
              <button onClick={stryMutAct_9fa48("5773") ? () => undefined : (stryCov_9fa48("5773"), () => setViewMode('agents'))} className={cn('px-4 py-2 rounded-md text-sm font-medium transition-all', (stryMutAct_9fa48("5778") ? viewMode !== 'agents' : stryMutAct_9fa48("5777") ? false : stryMutAct_9fa48("5776") ? true : (stryCov_9fa48("5776", "5777", "5778"), viewMode === 'agents')) ? 'bg-white text-primary-600' : 'text-white hover:bg-white/10')}>
                🤖 Premium Agents
              </button>
            </div>

            {/* Billing Toggle */}
            <div className="flex items-center gap-3">
              <span className={cn('text-sm', (stryMutAct_9fa48("5785") ? billingCycle !== 'monthly' : stryMutAct_9fa48("5784") ? false : stryMutAct_9fa48("5783") ? true : (stryCov_9fa48("5783", "5784", "5785"), billingCycle === 'monthly')) ? 'text-white' : 'text-white/60')}>
                Monthly
              </span>
              <button onClick={stryMutAct_9fa48("5789") ? () => undefined : (stryCov_9fa48("5789"), () => setBillingCycle(stryMutAct_9fa48("5790") ? () => undefined : (stryCov_9fa48("5790"), prev => (stryMutAct_9fa48("5793") ? prev !== 'monthly' : stryMutAct_9fa48("5792") ? false : stryMutAct_9fa48("5791") ? true : (stryCov_9fa48("5791", "5792", "5793"), prev === 'monthly')) ? 'annual' : 'monthly')))} className={cn('relative w-14 h-7 rounded-full transition-colors', (stryMutAct_9fa48("5800") ? billingCycle !== 'annual' : stryMutAct_9fa48("5799") ? false : stryMutAct_9fa48("5798") ? true : (stryCov_9fa48("5798", "5799", "5800"), billingCycle === 'annual')) ? 'bg-green-500' : 'bg-white/30')}>
                <div className={cn('absolute top-1 w-5 h-5 bg-white rounded-full transition-transform', (stryMutAct_9fa48("5807") ? billingCycle !== 'annual' : stryMutAct_9fa48("5806") ? false : stryMutAct_9fa48("5805") ? true : (stryCov_9fa48("5805", "5806", "5807"), billingCycle === 'annual')) ? 'translate-x-8' : 'translate-x-1')} />
              </button>
              <span className={cn('text-sm', (stryMutAct_9fa48("5814") ? billingCycle !== 'annual' : stryMutAct_9fa48("5813") ? false : stryMutAct_9fa48("5812") ? true : (stryCov_9fa48("5812", "5813", "5814"), billingCycle === 'annual')) ? 'text-white' : 'text-white/60')}>
                Annual
                <span className="ml-1 text-green-300 text-xs">Save up to 40%</span>
              </span>
            </div>
          </div>
        </div>

        {/* Tier Filter (Features view only) */}
        {stryMutAct_9fa48("5820") ? viewMode === 'features' || <div className="px-6 py-4 bg-white border-b border-neutral-200">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-neutral-600">Filter by tier:</span>
              <div className="flex gap-2">
                <button onClick={() => setSelectedTier('all')} className={cn('px-3 py-1.5 rounded-lg text-sm font-medium transition-all', selectedTier === 'all' ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200')}>
                  All
                </button>
                {Object.entries(PREMIUM_TIERS).map(([key, tier]) => <button key={key} onClick={() => setSelectedTier(key as PremiumTier)} className={cn('px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1', selectedTier === key ? `bg-gradient-to-r ${tier.bgGradient} text-white` : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200')}>
                    {tier.icon} {tier.name}
                  </button>)}
              </div>
            </div>
          </div> : stryMutAct_9fa48("5819") ? false : stryMutAct_9fa48("5818") ? true : (stryCov_9fa48("5818", "5819", "5820"), (stryMutAct_9fa48("5822") ? viewMode !== 'features' : stryMutAct_9fa48("5821") ? true : (stryCov_9fa48("5821", "5822"), viewMode === 'features')) && <div className="px-6 py-4 bg-white border-b border-neutral-200">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-neutral-600">Filter by tier:</span>
              <div className="flex gap-2">
                <button onClick={stryMutAct_9fa48("5824") ? () => undefined : (stryCov_9fa48("5824"), () => setSelectedTier('all'))} className={cn('px-3 py-1.5 rounded-lg text-sm font-medium transition-all', (stryMutAct_9fa48("5829") ? selectedTier !== 'all' : stryMutAct_9fa48("5828") ? false : stryMutAct_9fa48("5827") ? true : (stryCov_9fa48("5827", "5828", "5829"), selectedTier === 'all')) ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200')}>
                  All
                </button>
                {Object.entries(PREMIUM_TIERS).map(stryMutAct_9fa48("5833") ? () => undefined : (stryCov_9fa48("5833"), ([key, tier]) => <button key={key} onClick={stryMutAct_9fa48("5834") ? () => undefined : (stryCov_9fa48("5834"), () => setSelectedTier(key as PremiumTier))} className={cn('px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1', (stryMutAct_9fa48("5838") ? selectedTier !== key : stryMutAct_9fa48("5837") ? false : stryMutAct_9fa48("5836") ? true : (stryCov_9fa48("5836", "5837", "5838"), selectedTier === key)) ? `bg-gradient-to-r ${tier.bgGradient} text-white` : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200')}>
                    {tier.icon} {tier.name}
                  </button>))}
              </div>
            </div>
          </div>)}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {(stryMutAct_9fa48("5843") ? viewMode !== 'bundles' : stryMutAct_9fa48("5842") ? false : stryMutAct_9fa48("5841") ? true : (stryCov_9fa48("5841", "5842", "5843"), viewMode === 'bundles')) ? <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {PREMIUM_BUNDLES.map(stryMutAct_9fa48("5845") ? () => undefined : (stryCov_9fa48("5845"), bundle => renderBundleCard(bundle)))}
            </div> : (stryMutAct_9fa48("5848") ? viewMode !== 'features' : stryMutAct_9fa48("5847") ? false : stryMutAct_9fa48("5846") ? true : (stryCov_9fa48("5846", "5847", "5848"), viewMode === 'features')) ? <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFeatures.map(stryMutAct_9fa48("5850") ? () => undefined : (stryCov_9fa48("5850"), feature => renderFeatureCard(feature)))}
            </div> : <div className="space-y-6">
              {/* Premium Agents Tab Content */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4 mb-4">
                <p className="text-sm text-amber-800">
                  <span className="font-semibold">🔓 Unlock Premium Agents</span> — Get access to specialized AI agents for compliance, healthcare, finance, and legal domains by purchasing the relevant feature packs above.
                </p>
              </div>
              
              {/* Audit & Compliance Agents */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm font-semibold text-neutral-700">External & Audit Agents</span>
                  <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">Audit Excellence Pack</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {(stryMutAct_9fa48("5851") ? [] : (stryCov_9fa48("5851"), [stryMutAct_9fa48("5852") ? {} : (stryCov_9fa48("5852"), {
                name: 'External Auditor',
                desc: 'Independent Third-Party Audit',
                icon: '🔍'
              }), stryMutAct_9fa48("5856") ? {} : (stryCov_9fa48("5856"), {
                name: 'Internal Auditor',
                desc: 'Internal Controls & Process Audit',
                icon: '📋'
              })])).map(stryMutAct_9fa48("5860") ? () => undefined : (stryCov_9fa48("5860"), (agent, i) => <div key={i} className="p-4 bg-white border border-neutral-200 rounded-xl hover:shadow-md transition-shadow">
                      <div className="text-2xl mb-2">{agent.icon}</div>
                      <p className="font-medium text-neutral-900 text-sm">{agent.name}</p>
                      <p className="text-xs text-neutral-500">{agent.desc}</p>
                      <button onClick={stryMutAct_9fa48("5861") ? () => undefined : (stryCov_9fa48("5861"), () => stryMutAct_9fa48("5862") ? onPurchase('audit-excellence', 'feature') : (stryCov_9fa48("5862"), onPurchase?.('audit-excellence', 'feature')))} className="mt-3 w-full text-xs py-1.5 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors">
                        Unlock with Audit Pack
                      </button>
                    </div>))}
                </div>
              </div>

              {/* Healthcare Agents */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm font-semibold text-neutral-700">Clinical / Healthcare Agents</span>
                  <span className="text-[10px] bg-cyan-100 text-cyan-700 px-2 py-0.5 rounded-full font-medium">Healthcare Industry Pack</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {(stryMutAct_9fa48("5865") ? [] : (stryCov_9fa48("5865"), [stryMutAct_9fa48("5866") ? {} : (stryCov_9fa48("5866"), {
                name: 'Chief Medical Information Officer',
                desc: 'Healthcare IT & Clinical Systems',
                icon: '🏥'
              }), stryMutAct_9fa48("5870") ? {} : (stryCov_9fa48("5870"), {
                name: 'Patient Safety Officer',
                desc: 'Clinical Safety & Quality',
                icon: '🛡️'
              }), stryMutAct_9fa48("5874") ? {} : (stryCov_9fa48("5874"), {
                name: 'Healthcare Compliance Officer',
                desc: 'HIPAA & Healthcare Regulations',
                icon: '⚖️'
              }), stryMutAct_9fa48("5878") ? {} : (stryCov_9fa48("5878"), {
                name: 'Clinical Operations Director',
                desc: 'Healthcare Operations & Efficiency',
                icon: '📊'
              })])).map(stryMutAct_9fa48("5882") ? () => undefined : (stryCov_9fa48("5882"), (agent, i) => <div key={i} className="p-4 bg-white border border-neutral-200 rounded-xl hover:shadow-md transition-shadow">
                      <div className="text-2xl mb-2">{agent.icon}</div>
                      <p className="font-medium text-neutral-900 text-sm">{agent.name}</p>
                      <p className="text-xs text-neutral-500">{agent.desc}</p>
                      <button onClick={stryMutAct_9fa48("5883") ? () => undefined : (stryCov_9fa48("5883"), () => stryMutAct_9fa48("5884") ? onPurchase('healthcare-industry', 'feature') : (stryCov_9fa48("5884"), onPurchase?.('healthcare-industry', 'feature')))} className="mt-3 w-full text-xs py-1.5 bg-cyan-100 text-cyan-700 rounded-lg hover:bg-cyan-200 transition-colors">
                        Unlock with Healthcare Pack
                      </button>
                    </div>))}
                </div>
              </div>

              {/* Finance Agents */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm font-semibold text-neutral-700">Finance & Investment Agents</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">Finance Industry Pack</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {(stryMutAct_9fa48("5887") ? [] : (stryCov_9fa48("5887"), [stryMutAct_9fa48("5888") ? {} : (stryCov_9fa48("5888"), {
                name: 'Quantitative Analyst',
                desc: 'Financial Modeling & Risk Analytics',
                icon: '📈'
              }), stryMutAct_9fa48("5892") ? {} : (stryCov_9fa48("5892"), {
                name: 'Portfolio Manager',
                desc: 'Investment Strategy & Asset Allocation',
                icon: '💼'
              }), stryMutAct_9fa48("5896") ? {} : (stryCov_9fa48("5896"), {
                name: 'Credit Risk Officer',
                desc: 'Credit Analysis & Risk Assessment',
                icon: '🏦'
              }), stryMutAct_9fa48("5900") ? {} : (stryCov_9fa48("5900"), {
                name: 'Treasury Analyst',
                desc: 'Cash Management & Liquidity',
                icon: '💰'
              })])).map(stryMutAct_9fa48("5904") ? () => undefined : (stryCov_9fa48("5904"), (agent, i) => <div key={i} className="p-4 bg-white border border-neutral-200 rounded-xl hover:shadow-md transition-shadow">
                      <div className="text-2xl mb-2">{agent.icon}</div>
                      <p className="font-medium text-neutral-900 text-sm">{agent.name}</p>
                      <p className="text-xs text-neutral-500">{agent.desc}</p>
                      <button onClick={stryMutAct_9fa48("5905") ? () => undefined : (stryCov_9fa48("5905"), () => stryMutAct_9fa48("5906") ? onPurchase('finance-industry', 'feature') : (stryCov_9fa48("5906"), onPurchase?.('finance-industry', 'feature')))} className="mt-3 w-full text-xs py-1.5 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors">
                        Unlock with Finance Pack
                      </button>
                    </div>))}
                </div>
              </div>

              {/* Legal Agents */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm font-semibold text-neutral-700">Legal & Compliance Agents</span>
                  <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">Legal Industry Pack</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {(stryMutAct_9fa48("5909") ? [] : (stryCov_9fa48("5909"), [stryMutAct_9fa48("5910") ? {} : (stryCov_9fa48("5910"), {
                name: 'Contract Specialist',
                desc: 'Contract Analysis & Negotiation',
                icon: '📝'
              }), stryMutAct_9fa48("5914") ? {} : (stryCov_9fa48("5914"), {
                name: 'Intellectual Property Counsel',
                desc: 'Patents, Trademarks & IP Strategy',
                icon: '💡'
              }), stryMutAct_9fa48("5918") ? {} : (stryCov_9fa48("5918"), {
                name: 'Litigation Expert',
                desc: 'Dispute Resolution & Trial Strategy',
                icon: '⚖️'
              }), stryMutAct_9fa48("5922") ? {} : (stryCov_9fa48("5922"), {
                name: 'Regulatory Affairs Counsel',
                desc: 'Government Relations & Compliance',
                icon: '🏛️'
              })])).map(stryMutAct_9fa48("5926") ? () => undefined : (stryCov_9fa48("5926"), (agent, i) => <div key={i} className="p-4 bg-white border border-neutral-200 rounded-xl hover:shadow-md transition-shadow">
                      <div className="text-2xl mb-2">{agent.icon}</div>
                      <p className="font-medium text-neutral-900 text-sm">{agent.name}</p>
                      <p className="text-xs text-neutral-500">{agent.desc}</p>
                      <button onClick={stryMutAct_9fa48("5927") ? () => undefined : (stryCov_9fa48("5927"), () => stryMutAct_9fa48("5928") ? onPurchase('legal-industry', 'feature') : (stryCov_9fa48("5928"), onPurchase?.('legal-industry', 'feature')))} className="mt-3 w-full text-xs py-1.5 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors">
                        Unlock with Legal Pack
                      </button>
                    </div>))}
                </div>
              </div>
            </div>}
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-neutral-200 text-center">
          <p className="text-sm text-neutral-500">
            💳 Secure payment via Stripe • 30-day money-back guarantee • Cancel anytime
          </p>
        </div>
      </div>
    </div>;
};
export default PremiumFeaturesModal;