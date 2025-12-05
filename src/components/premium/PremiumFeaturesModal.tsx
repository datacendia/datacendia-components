import React, { useState } from 'react';
import { cn } from '../../../lib/utils';
import {
  PREMIUM_FEATURES,
  PREMIUM_BUNDLES,
  PREMIUM_TIERS,
  PremiumFeature,
  PremiumBundle,
  PremiumTier,
  calculateAnnualPrice,
  getTotalFeaturesValue,
  getFeatureById,
} from '../../data/premiumFeatures';

interface PremiumFeaturesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPurchase?: (itemId: string, type: 'feature' | 'bundle') => void;
  currentFeatures?: string[]; // Already purchased feature IDs
}

type ViewMode = 'features' | 'bundles';
type BillingCycle = 'monthly' | 'annual';

const PremiumFeaturesModal: React.FC<PremiumFeaturesModalProps> = ({
  isOpen,
  onClose,
  onPurchase,
  currentFeatures = [],
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('bundles');
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('annual');
  const [selectedTier, setSelectedTier] = useState<PremiumTier | 'all'>('all');
  const [expandedFeature, setExpandedFeature] = useState<string | null>(null);

  if (!isOpen) {return null;}

  const filteredFeatures = selectedTier === 'all' 
    ? PREMIUM_FEATURES 
    : PREMIUM_FEATURES.filter(f => f.tier === selectedTier);

  const getPrice = (price: number, discount: number) => {
    if (billingCycle === 'annual') {
      return Math.round(price * (1 - discount / 100));
    }
    return price;
  };

  const renderFeatureCard = (feature: PremiumFeature) => {
    const tier = PREMIUM_TIERS[feature.tier];
    const isOwned = currentFeatures.includes(feature.id);
    const isExpanded = expandedFeature === feature.id;
    const displayPrice = getPrice(feature.price, feature.annualDiscount);

    return (
      <div
        key={feature.id}
        className={cn(
          'relative bg-white rounded-xl border-2 overflow-hidden transition-all',
          isOwned ? 'border-green-300 bg-green-50' : 'border-neutral-200 hover:border-neutral-300 hover:shadow-lg'
        )}
      >
        {/* Tier Badge */}
        <div className={cn(
          'absolute top-3 right-3 text-white text-[10px] font-bold px-2 py-0.5 rounded-full',
          `bg-gradient-to-r ${tier.bgGradient}`
        )}>
          {tier.icon} {tier.name.toUpperCase()}
        </div>

        {/* Owned Badge */}
        {isOwned && (
          <div className="absolute top-3 left-3 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            ✓ OWNED
          </div>
        )}

        <div className="p-5">
          {/* Icon & Name */}
          <div className="flex items-start gap-3 mb-3 mt-4">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
              style={{ backgroundColor: `${tier.color}20` }}
            >
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
            {billingCycle === 'annual' && (
              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                Save {feature.annualDiscount}%
              </span>
            )}
          </div>

          {/* Features List */}
          <ul className="space-y-2 mb-4">
            {feature.features.slice(0, isExpanded ? undefined : 4).map((f, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-neutral-600">
                <span className="text-green-500 mt-0.5">✓</span>
                {f}
              </li>
            ))}
          </ul>

          {feature.features.length > 4 && (
            <button
              onClick={() => setExpandedFeature(isExpanded ? null : feature.id)}
              className="text-sm text-primary-600 hover:text-primary-700 mb-4"
            >
              {isExpanded ? '← Show less' : `+ ${feature.features.length - 4} more features`}
            </button>
          )}

          {/* Agent Integration */}
          <div className="p-3 bg-neutral-50 rounded-lg mb-4">
            <p className="text-xs font-semibold text-neutral-500 mb-1">🤖 AGENT INTEGRATION</p>
            <p className="text-sm text-neutral-600">{feature.agentIntegration}</p>
          </div>

          {/* CTA Button */}
          <button
            onClick={() => onPurchase?.(feature.id, 'feature')}
            disabled={isOwned}
            className={cn(
              'w-full py-3 rounded-lg font-semibold transition-all',
              isOwned
                ? 'bg-green-100 text-green-700 cursor-default'
                : `bg-gradient-to-r ${tier.bgGradient} text-white hover:opacity-90 hover:shadow-md`
            )}
          >
            {isOwned ? '✓ Already Owned' : `Get ${feature.name}`}
          </button>
        </div>
      </div>
    );
  };

  const renderBundleCard = (bundle: PremiumBundle) => {
    const tier = PREMIUM_TIERS[bundle.tier];
    const includedFeatures = bundle.includedFeatures.map(id => getFeatureById(id)).filter(Boolean) as PremiumFeature[];
    const totalValue = getTotalFeaturesValue(bundle.includedFeatures);
    const displayPrice = getPrice(bundle.price, bundle.annualDiscount);
    const allOwned = bundle.includedFeatures.every(id => currentFeatures.includes(id));

    return (
      <div
        key={bundle.id}
        className={cn(
          'relative bg-white rounded-xl border-2 overflow-hidden transition-all',
          bundle.popular && 'ring-2 ring-primary-500 ring-offset-2',
          bundle.enterprise && 'ring-2 ring-amber-500 ring-offset-2',
          allOwned ? 'border-green-300 bg-green-50' : 'border-neutral-200 hover:shadow-xl'
        )}
      >
        {/* Popular/Enterprise Badge */}
        {bundle.popular && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-500 text-white text-xs font-bold px-4 py-1 rounded-full">
            ⭐ MOST POPULAR
          </div>
        )}
        {bundle.enterprise && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-4 py-1 rounded-full">
            👑 BEST VALUE
          </div>
        )}

        {/* Tier Badge */}
        <div className={cn(
          'absolute top-3 right-3 text-white text-[10px] font-bold px-2 py-0.5 rounded-full',
          `bg-gradient-to-r ${tier.bgGradient}`
        )}>
          {tier.icon} {tier.name.toUpperCase()}
        </div>

        <div className="p-6 pt-8">
          {/* Icon & Name */}
          <div className="text-center mb-4">
            <div 
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-3"
              style={{ backgroundColor: `${tier.color}20` }}
            >
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
            {billingCycle === 'annual' && (
              <p className="text-xs text-green-600 mt-1">
                + Additional {bundle.annualDiscount}% off with annual billing
              </p>
            )}
          </div>

          {/* Included Features */}
          <div className="space-y-2 mb-6">
            <p className="text-xs font-semibold text-neutral-500">INCLUDES:</p>
            {includedFeatures.map(feature => (
              <div 
                key={feature.id}
                className="flex items-center gap-2 p-2 bg-neutral-50 rounded-lg"
              >
                <span className="text-lg">{feature.icon}</span>
                <span className="text-sm font-medium text-neutral-700">{feature.name}</span>
                <span className="ml-auto text-xs text-neutral-400">${feature.price}/mo</span>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <button
            onClick={() => onPurchase?.(bundle.id, 'bundle')}
            disabled={allOwned}
            className={cn(
              'w-full py-3 rounded-lg font-semibold transition-all text-lg',
              allOwned
                ? 'bg-green-100 text-green-700 cursor-default'
                : bundle.enterprise
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:opacity-90 hover:shadow-lg'
                  : `bg-gradient-to-r ${tier.bgGradient} text-white hover:opacity-90 hover:shadow-lg`
            )}
          >
            {allOwned ? '✓ All Features Owned' : `Get ${bundle.name}`}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-y-auto">
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
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              ✕
            </button>
          </div>

          {/* View Mode & Billing Toggle */}
          <div className="flex items-center justify-between mt-6">
            {/* View Mode Toggle */}
            <div className="flex bg-white/20 rounded-lg p-1">
              <button
                onClick={() => setViewMode('bundles')}
                className={cn(
                  'px-4 py-2 rounded-md text-sm font-medium transition-all',
                  viewMode === 'bundles' ? 'bg-white text-primary-600' : 'text-white hover:bg-white/10'
                )}
              >
                💎 Bundles
              </button>
              <button
                onClick={() => setViewMode('features')}
                className={cn(
                  'px-4 py-2 rounded-md text-sm font-medium transition-all',
                  viewMode === 'features' ? 'bg-white text-primary-600' : 'text-white hover:bg-white/10'
                )}
              >
                📦 Individual Features
              </button>
            </div>

            {/* Billing Toggle */}
            <div className="flex items-center gap-3">
              <span className={cn('text-sm', billingCycle === 'monthly' ? 'text-white' : 'text-white/60')}>
                Monthly
              </span>
              <button
                onClick={() => setBillingCycle(prev => prev === 'monthly' ? 'annual' : 'monthly')}
                className={cn(
                  'relative w-14 h-7 rounded-full transition-colors',
                  billingCycle === 'annual' ? 'bg-green-500' : 'bg-white/30'
                )}
              >
                <div className={cn(
                  'absolute top-1 w-5 h-5 bg-white rounded-full transition-transform',
                  billingCycle === 'annual' ? 'translate-x-8' : 'translate-x-1'
                )} />
              </button>
              <span className={cn('text-sm', billingCycle === 'annual' ? 'text-white' : 'text-white/60')}>
                Annual
                <span className="ml-1 text-green-300 text-xs">Save up to 40%</span>
              </span>
            </div>
          </div>
        </div>

        {/* Tier Filter (Features view only) */}
        {viewMode === 'features' && (
          <div className="px-6 py-4 bg-white border-b border-neutral-200">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-neutral-600">Filter by tier:</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedTier('all')}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                    selectedTier === 'all' 
                      ? 'bg-neutral-900 text-white' 
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  )}
                >
                  All
                </button>
                {Object.entries(PREMIUM_TIERS).map(([key, tier]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedTier(key as PremiumTier)}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1',
                      selectedTier === key 
                        ? `bg-gradient-to-r ${tier.bgGradient} text-white` 
                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                    )}
                  >
                    {tier.icon} {tier.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {viewMode === 'bundles' ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {PREMIUM_BUNDLES.map(bundle => renderBundleCard(bundle))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFeatures.map(feature => renderFeatureCard(feature))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-neutral-200 text-center">
          <p className="text-sm text-neutral-500">
            💳 Secure payment via Stripe • 30-day money-back guarantee • Cancel anytime
          </p>
        </div>
      </div>
    </div>
  );
};

export default PremiumFeaturesModal;
