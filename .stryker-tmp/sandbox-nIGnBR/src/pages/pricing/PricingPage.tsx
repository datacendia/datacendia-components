// @ts-nocheck
// =============================================================================
// DATACENDIA PRICING PAGE - Enterprise Regional Pricing
// Matching DatacendiaPricing.jsx design
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
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
interface Region {
  id: string;
  name: string;
  flag: string;
  multiplier: number;
  currency: string;
  symbol: string;
  countries: string[];
  conversionRate?: number;
}
interface Tier {
  id: string;
  name: string;
  basePrice: number;
  description: string;
  features: string[];
  cta: string;
  popular: boolean;
}
interface CommitmentOption {
  id: string;
  label: string;
  discount: number;
  multiplier: number;
}
const regions: Region[] = stryMutAct_9fa48("51692") ? [] : (stryCov_9fa48("51692"), [stryMutAct_9fa48("51693") ? {} : (stryCov_9fa48("51693"), {
  id: 'north-america',
  name: 'North America',
  flag: '🇺🇸',
  multiplier: 1.0,
  currency: 'USD',
  symbol: '$',
  countries: stryMutAct_9fa48("51699") ? [] : (stryCov_9fa48("51699"), ['United States', 'Canada'])
}), stryMutAct_9fa48("51702") ? {} : (stryCov_9fa48("51702"), {
  id: 'western-europe',
  name: 'Western Europe',
  flag: '🇪🇺',
  multiplier: 1.0,
  currency: 'EUR',
  symbol: '€',
  countries: stryMutAct_9fa48("51708") ? [] : (stryCov_9fa48("51708"), ['UK', 'Germany', 'France', 'Netherlands', 'Switzerland'])
}), stryMutAct_9fa48("51714") ? {} : (stryCov_9fa48("51714"), {
  id: 'gulf-states',
  name: 'Gulf States',
  flag: '🇦🇪',
  multiplier: 1.0,
  currency: 'USD',
  symbol: '$',
  countries: stryMutAct_9fa48("51720") ? [] : (stryCov_9fa48("51720"), ['UAE', 'Saudi Arabia', 'Qatar', 'Kuwait'])
}), stryMutAct_9fa48("51725") ? {} : (stryCov_9fa48("51725"), {
  id: 'australia-japan',
  name: 'Australia & Japan',
  flag: '🇦🇺',
  multiplier: 0.95,
  currency: 'USD',
  symbol: '$',
  countries: stryMutAct_9fa48("51731") ? [] : (stryCov_9fa48("51731"), ['Australia', 'New Zealand', 'Japan'])
}), stryMutAct_9fa48("51735") ? {} : (stryCov_9fa48("51735"), {
  id: 'singapore-hk',
  name: 'Singapore & Hong Kong',
  flag: '🇸🇬',
  multiplier: 0.95,
  currency: 'USD',
  symbol: '$',
  countries: stryMutAct_9fa48("51741") ? [] : (stryCov_9fa48("51741"), ['Singapore', 'Hong Kong'])
}), stryMutAct_9fa48("51744") ? {} : (stryCov_9fa48("51744"), {
  id: 'china',
  name: 'Greater China',
  flag: '🇨🇳',
  multiplier: 0.70,
  currency: 'CNY',
  symbol: '¥',
  conversionRate: 7.1,
  countries: stryMutAct_9fa48("51750") ? [] : (stryCov_9fa48("51750"), ['China', 'Taiwan'])
}), stryMutAct_9fa48("51753") ? {} : (stryCov_9fa48("51753"), {
  id: 'eastern-europe',
  name: 'Eastern Europe',
  flag: '🇵🇱',
  multiplier: 0.65,
  currency: 'EUR',
  symbol: '€',
  countries: stryMutAct_9fa48("51759") ? [] : (stryCov_9fa48("51759"), ['Poland', 'Czech Republic', 'Romania', 'Hungary'])
}), stryMutAct_9fa48("51764") ? {} : (stryCov_9fa48("51764"), {
  id: 'middle-east',
  name: 'Middle East (Other)',
  flag: '🇹🇷',
  multiplier: 0.60,
  currency: 'USD',
  symbol: '$',
  countries: stryMutAct_9fa48("51770") ? [] : (stryCov_9fa48("51770"), ['Turkey', 'Israel', 'Egypt', 'Jordan'])
}), stryMutAct_9fa48("51775") ? {} : (stryCov_9fa48("51775"), {
  id: 'latin-america',
  name: 'Latin America',
  flag: '🇧🇷',
  multiplier: 0.55,
  currency: 'USD',
  symbol: '$',
  countries: stryMutAct_9fa48("51781") ? [] : (stryCov_9fa48("51781"), ['Brazil', 'Mexico', 'Argentina', 'Chile', 'Colombia'])
}), stryMutAct_9fa48("51787") ? {} : (stryCov_9fa48("51787"), {
  id: 'southeast-asia',
  name: 'Southeast Asia',
  flag: '🇹🇭',
  multiplier: 0.50,
  currency: 'USD',
  symbol: '$',
  countries: stryMutAct_9fa48("51793") ? [] : (stryCov_9fa48("51793"), ['Thailand', 'Vietnam', 'Indonesia', 'Philippines', 'Malaysia'])
}), stryMutAct_9fa48("51799") ? {} : (stryCov_9fa48("51799"), {
  id: 'india',
  name: 'India',
  flag: '🇮🇳',
  multiplier: 0.45,
  currency: 'USD',
  symbol: '$',
  countries: stryMutAct_9fa48("51805") ? [] : (stryCov_9fa48("51805"), ['India'])
}), stryMutAct_9fa48("51807") ? {} : (stryCov_9fa48("51807"), {
  id: 'africa',
  name: 'Africa',
  flag: '🌍',
  multiplier: 0.45,
  currency: 'USD',
  symbol: '$',
  countries: stryMutAct_9fa48("51813") ? [] : (stryCov_9fa48("51813"), ['South Africa', 'Kenya', 'Nigeria', 'Morocco', 'Egypt'])
})]);
const tiers: Tier[] = stryMutAct_9fa48("51819") ? [] : (stryCov_9fa48("51819"), [stryMutAct_9fa48("51820") ? {} : (stryCov_9fa48("51820"), {
  id: 'starter',
  name: 'Starter',
  basePrice: 36000,
  description: 'For teams beginning their decision intelligence journey',
  features: stryMutAct_9fa48("51824") ? [] : (stryCov_9fa48("51824"), ['Up to 5 users', '100 deliberations/month', '3 Council agents', 'Email support', 'Basic integrations', 'Standard reports']),
  cta: 'Start Free Trial',
  popular: stryMutAct_9fa48("51832") ? true : (stryCov_9fa48("51832"), false)
}), stryMutAct_9fa48("51833") ? {} : (stryCov_9fa48("51833"), {
  id: 'professional',
  name: 'Professional',
  basePrice: 120000,
  description: 'For organizations ready to transform decision-making',
  features: stryMutAct_9fa48("51837") ? [] : (stryCov_9fa48("51837"), ['Up to 25 users', 'Unlimited deliberations', 'All 8 Council agents', 'Priority support', 'All integrations', 'Custom reports', 'Decision Debt Dashboard', 'Pre-Mortem simulations']),
  cta: 'Get Started',
  popular: stryMutAct_9fa48("51847") ? false : (stryCov_9fa48("51847"), true)
}), stryMutAct_9fa48("51848") ? {} : (stryCov_9fa48("51848"), {
  id: 'enterprise',
  name: 'Enterprise',
  basePrice: 350000,
  description: 'For large organizations with complex decision needs',
  features: stryMutAct_9fa48("51852") ? [] : (stryCov_9fa48("51852"), ['Unlimited users', 'Unlimited deliberations', 'All Council features', 'Dedicated success manager', 'Custom integrations', 'Ghost Board access', 'Regulatory Instant-Absorb', 'Live Demo Mode', 'SSO & advanced security', 'Custom agent training']),
  cta: 'Contact Sales',
  popular: stryMutAct_9fa48("51864") ? true : (stryCov_9fa48("51864"), false)
})]);
const commitmentOptions: CommitmentOption[] = stryMutAct_9fa48("51865") ? [] : (stryCov_9fa48("51865"), [stryMutAct_9fa48("51866") ? {} : (stryCov_9fa48("51866"), {
  id: 'monthly',
  label: 'Monthly',
  discount: 0,
  multiplier: 1.0
}), stryMutAct_9fa48("51869") ? {} : (stryCov_9fa48("51869"), {
  id: 'annual',
  label: 'Annual',
  discount: 15,
  multiplier: 0.85
}), stryMutAct_9fa48("51872") ? {} : (stryCov_9fa48("51872"), {
  id: 'multi-year',
  label: '3-Year',
  discount: 30,
  multiplier: 0.70
})]);
const faqs = stryMutAct_9fa48("51875") ? [] : (stryCov_9fa48("51875"), [stryMutAct_9fa48("51876") ? {} : (stryCov_9fa48("51876"), {
  q: "How does regional pricing work?",
  a: "We adjust our prices based on local market conditions to make Datacendia accessible globally. Your region is determined by your billing address. All features are identical regardless of pricing tier."
}), stryMutAct_9fa48("51879") ? {} : (stryCov_9fa48("51879"), {
  q: "Can I change my plan later?",
  a: "Yes! You can upgrade at any time and we'll prorate the difference. Downgrades take effect at your next renewal date."
}), stryMutAct_9fa48("51882") ? {} : (stryCov_9fa48("51882"), {
  q: "What payment methods do you accept?",
  a: "We accept all major credit cards, wire transfers, and ACH. Enterprise customers can also pay via invoice with NET 30 terms."
}), stryMutAct_9fa48("51885") ? {} : (stryCov_9fa48("51885"), {
  q: "Is there a free trial?",
  a: "Yes! All plans include a 14-day free trial with full access to features. No credit card required to start."
}), stryMutAct_9fa48("51888") ? {} : (stryCov_9fa48("51888"), {
  q: "What's your refund policy?",
  a: "We offer a 30-day money-back guarantee on all annual plans. If you're not satisfied, we'll refund your payment in full."
}), stryMutAct_9fa48("51891") ? {} : (stryCov_9fa48("51891"), {
  q: "Do you offer discounts for non-profits or education?",
  a: "Yes! Non-profits receive 25% off, and educational institutions receive 40% off. Contact sales for details."
})]);
export default function PricingPage() {
  const [selectedRegion, setSelectedRegion] = useState<Region>(regions[0]);
  const [commitment, setCommitment] = useState<CommitmentOption>(commitmentOptions[1]);
  const [showRegionSelector, setShowRegionSelector] = useState(stryMutAct_9fa48("51895") ? true : (stryCov_9fa48("51895"), false));
  const formatPrice = (basePrice: number, region: Region, commit: CommitmentOption) => {
    let price = stryMutAct_9fa48("51897") ? basePrice * region.multiplier / commit.multiplier : (stryCov_9fa48("51897"), (stryMutAct_9fa48("51898") ? basePrice / region.multiplier : (stryCov_9fa48("51898"), basePrice * region.multiplier)) * commit.multiplier);
    if (stryMutAct_9fa48("51901") ? region.currency === 'CNY' || region.conversionRate : stryMutAct_9fa48("51900") ? false : stryMutAct_9fa48("51899") ? true : (stryCov_9fa48("51899", "51900", "51901"), (stryMutAct_9fa48("51903") ? region.currency !== 'CNY' : stryMutAct_9fa48("51902") ? true : (stryCov_9fa48("51902", "51903"), region.currency === 'CNY')) && region.conversionRate)) {
      price = stryMutAct_9fa48("51906") ? price / region.conversionRate : (stryCov_9fa48("51906"), price * region.conversionRate);
    }
    if (stryMutAct_9fa48("51909") ? region.currency !== 'EUR' : stryMutAct_9fa48("51908") ? false : stryMutAct_9fa48("51907") ? true : (stryCov_9fa48("51907", "51908", "51909"), region.currency === 'EUR')) {
      price = stryMutAct_9fa48("51912") ? price / 0.92 : (stryCov_9fa48("51912"), price * 0.92);
    }
    if (stryMutAct_9fa48("51916") ? price < 1000000 : stryMutAct_9fa48("51915") ? price > 1000000 : stryMutAct_9fa48("51914") ? false : stryMutAct_9fa48("51913") ? true : (stryCov_9fa48("51913", "51914", "51915", "51916"), price >= 1000000)) {
      return `${region.symbol}${(stryMutAct_9fa48("51919") ? price * 1000000 : (stryCov_9fa48("51919"), price / 1000000)).toFixed(1)}M`;
    }
    if (stryMutAct_9fa48("51923") ? price < 1000 : stryMutAct_9fa48("51922") ? price > 1000 : stryMutAct_9fa48("51921") ? false : stryMutAct_9fa48("51920") ? true : (stryCov_9fa48("51920", "51921", "51922", "51923"), price >= 1000)) {
      return `${region.symbol}${Math.round(stryMutAct_9fa48("51926") ? price * 1000 : (stryCov_9fa48("51926"), price / 1000))}K`;
    }
    return `${region.symbol}${Math.round(price).toLocaleString()}`;
  };
  const getMonthlyEquivalent = (basePrice: number, region: Region, commit: CommitmentOption) => {
    let price = stryMutAct_9fa48("51929") ? basePrice * region.multiplier * commit.multiplier * 12 : (stryCov_9fa48("51929"), (stryMutAct_9fa48("51930") ? basePrice * region.multiplier / commit.multiplier : (stryCov_9fa48("51930"), (stryMutAct_9fa48("51931") ? basePrice / region.multiplier : (stryCov_9fa48("51931"), basePrice * region.multiplier)) * commit.multiplier)) / 12);
    if (stryMutAct_9fa48("51934") ? region.currency === 'CNY' || region.conversionRate : stryMutAct_9fa48("51933") ? false : stryMutAct_9fa48("51932") ? true : (stryCov_9fa48("51932", "51933", "51934"), (stryMutAct_9fa48("51936") ? region.currency !== 'CNY' : stryMutAct_9fa48("51935") ? true : (stryCov_9fa48("51935", "51936"), region.currency === 'CNY')) && region.conversionRate)) {
      price = stryMutAct_9fa48("51939") ? price / region.conversionRate : (stryCov_9fa48("51939"), price * region.conversionRate);
    }
    if (stryMutAct_9fa48("51942") ? region.currency !== 'EUR' : stryMutAct_9fa48("51941") ? false : stryMutAct_9fa48("51940") ? true : (stryCov_9fa48("51940", "51941", "51942"), region.currency === 'EUR')) {
      price = stryMutAct_9fa48("51945") ? price / 0.92 : (stryCov_9fa48("51945"), price * 0.92);
    }
    return `${region.symbol}${Math.round(price).toLocaleString()}`;
  };
  return <div style={stryMutAct_9fa48("51947") ? {} : (stryCov_9fa48("51947"), {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #0a0a0f 100%)',
    fontFamily: "'Inter', 'SF Pro Display', -apple-system, sans-serif",
    color: '#fff'
  })}>
      {/* Background effects */}
      <div style={stryMutAct_9fa48("51952") ? {} : (stryCov_9fa48("51952"), {
      position: 'fixed',
      inset: 0,
      background: `radial-gradient(ellipse at 20% 20%, rgba(99, 102, 241, 0.1) 0%, transparent 50%),
                     radial-gradient(ellipse at 80% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)`,
      pointerEvents: 'none'
    })} />

      {/* Header */}
      <header style={stryMutAct_9fa48("51956") ? {} : (stryCov_9fa48("51956"), {
      position: 'relative',
      textAlign: 'center',
      padding: '80px 20px 60px'
    })}>
        <div style={stryMutAct_9fa48("51960") ? {} : (stryCov_9fa48("51960"), {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        background: 'rgba(99, 102, 241, 0.1)',
        border: '1px solid rgba(99, 102, 241, 0.3)',
        borderRadius: '100px',
        padding: '8px 16px',
        fontSize: '14px',
        color: '#a5b4fc',
        marginBottom: '24px'
      })}>
          <span>🌍</span>
          <span>Regional pricing available</span>
        </div>

        <h1 style={stryMutAct_9fa48("51971") ? {} : (stryCov_9fa48("51971"), {
        fontSize: 'clamp(36px, 6vw, 64px)',
        fontWeight: 800,
        margin: '0 0 16px 0',
        background: 'linear-gradient(135deg, #fff 0%, #a5b4fc 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        letterSpacing: '-2px'
      })}>
          Simple, Transparent Pricing
        </h1>

        <p style={stryMutAct_9fa48("51978") ? {} : (stryCov_9fa48("51978"), {
        fontSize: '20px',
        color: 'rgba(255,255,255,0.6)',
        maxWidth: '600px',
        margin: '0 auto 40px'
      })}>
          Invest in better decisions. See ROI within 90 days.
        </p>

        {/* Region Selector */}
        <div style={stryMutAct_9fa48("51983") ? {} : (stryCov_9fa48("51983"), {
        display: 'flex',
        justifyContent: 'center',
        gap: '16px',
        flexWrap: 'wrap',
        marginBottom: '32px'
      })}>
          <div style={stryMutAct_9fa48("51989") ? {} : (stryCov_9fa48("51989"), {
          position: 'relative'
        })}>
            <button onClick={stryMutAct_9fa48("51991") ? () => undefined : (stryCov_9fa48("51991"), () => setShowRegionSelector(stryMutAct_9fa48("51992") ? showRegionSelector : (stryCov_9fa48("51992"), !showRegionSelector)))} style={stryMutAct_9fa48("51993") ? {} : (stryCov_9fa48("51993"), {
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '14px 24px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            color: '#fff',
            fontSize: '16px',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          })}>
              <span style={stryMutAct_9fa48("52005") ? {} : (stryCov_9fa48("52005"), {
              fontSize: '24px'
            })}>{selectedRegion.flag}</span>
              <span>{selectedRegion.name}</span>
              <span style={stryMutAct_9fa48("52007") ? {} : (stryCov_9fa48("52007"), {
              opacity: 0.5,
              marginLeft: '8px',
              transform: showRegionSelector ? 'rotate(180deg)' : 'rotate(0)',
              transition: 'transform 0.2s ease'
            })}>▼</span>
            </button>

            {stryMutAct_9fa48("52014") ? showRegionSelector || <div style={{
            position: 'absolute',
            top: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            marginTop: '8px',
            background: '#1a1a2e',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '16px',
            padding: '8px',
            minWidth: '280px',
            maxHeight: '400px',
            overflowY: 'auto',
            zIndex: 100,
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
          }}>
                {regions.map(region => <button key={region.id} onClick={() => {
              setSelectedRegion(region);
              setShowRegionSelector(false);
            }} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              width: '100%',
              padding: '12px 16px',
              background: selectedRegion.id === region.id ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
              border: 'none',
              borderRadius: '10px',
              color: '#fff',
              fontSize: '15px',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'background 0.2s ease'
            }}>
                    <span style={{
                fontSize: '20px'
              }}>{region.flag}</span>
                    <div>
                      <div style={{
                  fontWeight: 500
                }}>{region.name}</div>
                      <div style={{
                  fontSize: '12px',
                  opacity: 0.5
                }}>
                        {region.multiplier < 1 ? `${Math.round((1 - region.multiplier) * 100)}% regional adjustment` : 'Base pricing'}
                      </div>
                    </div>
                    {selectedRegion.id === region.id && <span style={{
                marginLeft: 'auto',
                color: '#6366f1'
              }}>✓</span>}
                  </button>)}
              </div> : stryMutAct_9fa48("52013") ? false : stryMutAct_9fa48("52012") ? true : (stryCov_9fa48("52012", "52013", "52014"), showRegionSelector && <div style={stryMutAct_9fa48("52015") ? {} : (stryCov_9fa48("52015"), {
            position: 'absolute',
            top: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            marginTop: '8px',
            background: '#1a1a2e',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '16px',
            padding: '8px',
            minWidth: '280px',
            maxHeight: '400px',
            overflowY: 'auto',
            zIndex: 100,
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
          })}>
                {regions.map(stryMutAct_9fa48("52029") ? () => undefined : (stryCov_9fa48("52029"), region => <button key={region.id} onClick={() => {
              setSelectedRegion(region);
              setShowRegionSelector(stryMutAct_9fa48("52031") ? true : (stryCov_9fa48("52031"), false));
            }} style={stryMutAct_9fa48("52032") ? {} : (stryCov_9fa48("52032"), {
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              width: '100%',
              padding: '12px 16px',
              background: (stryMutAct_9fa48("52040") ? selectedRegion.id !== region.id : stryMutAct_9fa48("52039") ? false : stryMutAct_9fa48("52038") ? true : (stryCov_9fa48("52038", "52039", "52040"), selectedRegion.id === region.id)) ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
              border: 'none',
              borderRadius: '10px',
              color: '#fff',
              fontSize: '15px',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'background 0.2s ease'
            })}>
                    <span style={stryMutAct_9fa48("52050") ? {} : (stryCov_9fa48("52050"), {
                fontSize: '20px'
              })}>{region.flag}</span>
                    <div>
                      <div style={stryMutAct_9fa48("52052") ? {} : (stryCov_9fa48("52052"), {
                  fontWeight: 500
                })}>{region.name}</div>
                      <div style={stryMutAct_9fa48("52053") ? {} : (stryCov_9fa48("52053"), {
                  fontSize: '12px',
                  opacity: 0.5
                })}>
                        {(stryMutAct_9fa48("52058") ? region.multiplier >= 1 : stryMutAct_9fa48("52057") ? region.multiplier <= 1 : stryMutAct_9fa48("52056") ? false : stryMutAct_9fa48("52055") ? true : (stryCov_9fa48("52055", "52056", "52057", "52058"), region.multiplier < 1)) ? `${Math.round(stryMutAct_9fa48("52060") ? (1 - region.multiplier) / 100 : (stryCov_9fa48("52060"), (stryMutAct_9fa48("52061") ? 1 + region.multiplier : (stryCov_9fa48("52061"), 1 - region.multiplier)) * 100))}% regional adjustment` : 'Base pricing'}
                      </div>
                    </div>
                    {stryMutAct_9fa48("52065") ? selectedRegion.id === region.id || <span style={{
                marginLeft: 'auto',
                color: '#6366f1'
              }}>✓</span> : stryMutAct_9fa48("52064") ? false : stryMutAct_9fa48("52063") ? true : (stryCov_9fa48("52063", "52064", "52065"), (stryMutAct_9fa48("52067") ? selectedRegion.id !== region.id : stryMutAct_9fa48("52066") ? true : (stryCov_9fa48("52066", "52067"), selectedRegion.id === region.id)) && <span style={stryMutAct_9fa48("52068") ? {} : (stryCov_9fa48("52068"), {
                marginLeft: 'auto',
                color: '#6366f1'
              })}>✓</span>)}
                  </button>))}
              </div>)}
          </div>
        </div>

        {/* Commitment Toggle */}
        <div style={stryMutAct_9fa48("52071") ? {} : (stryCov_9fa48("52071"), {
        display: 'inline-flex',
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '12px',
        padding: '4px'
      })}>
          {commitmentOptions.map(stryMutAct_9fa48("52076") ? () => undefined : (stryCov_9fa48("52076"), option => <button key={option.id} onClick={stryMutAct_9fa48("52077") ? () => undefined : (stryCov_9fa48("52077"), () => setCommitment(option))} style={stryMutAct_9fa48("52078") ? {} : (stryCov_9fa48("52078"), {
          padding: '12px 24px',
          background: (stryMutAct_9fa48("52082") ? commitment.id !== option.id : stryMutAct_9fa48("52081") ? false : stryMutAct_9fa48("52080") ? true : (stryCov_9fa48("52080", "52081", "52082"), commitment.id === option.id)) ? 'rgba(99, 102, 241, 0.3)' : 'transparent',
          border: 'none',
          borderRadius: '10px',
          color: (stryMutAct_9fa48("52089") ? commitment.id !== option.id : stryMutAct_9fa48("52088") ? false : stryMutAct_9fa48("52087") ? true : (stryCov_9fa48("52087", "52088", "52089"), commitment.id === option.id)) ? '#fff' : 'rgba(255,255,255,0.5)',
          fontSize: '15px',
          fontWeight: 500,
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          position: 'relative'
        })}>
              {option.label}
              {stryMutAct_9fa48("52098") ? option.discount > 0 || <span style={{
            position: 'absolute',
            top: '-8px',
            right: '-8px',
            background: 'linear-gradient(135deg, #10b981, #059669)',
            color: '#fff',
            fontSize: '10px',
            fontWeight: 700,
            padding: '2px 6px',
            borderRadius: '100px'
          }}>
                  -{option.discount}%
                </span> : stryMutAct_9fa48("52097") ? false : stryMutAct_9fa48("52096") ? true : (stryCov_9fa48("52096", "52097", "52098"), (stryMutAct_9fa48("52101") ? option.discount <= 0 : stryMutAct_9fa48("52100") ? option.discount >= 0 : stryMutAct_9fa48("52099") ? true : (stryCov_9fa48("52099", "52100", "52101"), option.discount > 0)) && <span style={stryMutAct_9fa48("52102") ? {} : (stryCov_9fa48("52102"), {
            position: 'absolute',
            top: '-8px',
            right: '-8px',
            background: 'linear-gradient(135deg, #10b981, #059669)',
            color: '#fff',
            fontSize: '10px',
            fontWeight: 700,
            padding: '2px 6px',
            borderRadius: '100px'
          })}>
                  -{option.discount}%
                </span>)}
            </button>))}
        </div>
      </header>

      {/* Pricing Cards */}
      <section style={stryMutAct_9fa48("52111") ? {} : (stryCov_9fa48("52111"), {
      display: 'flex',
      justifyContent: 'center',
      gap: '24px',
      padding: '0 20px 80px',
      flexWrap: 'wrap',
      position: 'relative'
    })}>
        {tiers.map(stryMutAct_9fa48("52118") ? () => undefined : (stryCov_9fa48("52118"), tier => <div key={tier.id} style={stryMutAct_9fa48("52119") ? {} : (stryCov_9fa48("52119"), {
        width: '340px',
        background: tier.popular ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.1) 100%)' : 'rgba(255,255,255,0.03)',
        border: tier.popular ? '2px solid rgba(99, 102, 241, 0.5)' : '1px solid rgba(255,255,255,0.08)',
        borderRadius: '24px',
        padding: '40px 32px',
        position: 'relative',
        transform: tier.popular ? 'scale(1.05)' : 'scale(1)',
        zIndex: tier.popular ? 10 : 1
      })}>
            {stryMutAct_9fa48("52132") ? tier.popular || <div style={{
          position: 'absolute',
          top: '-12px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          padding: '6px 20px',
          borderRadius: '100px',
          fontSize: '12px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '1px'
        }}>
                Most Popular
              </div> : stryMutAct_9fa48("52131") ? false : stryMutAct_9fa48("52130") ? true : (stryCov_9fa48("52130", "52131", "52132"), tier.popular && <div style={stryMutAct_9fa48("52133") ? {} : (stryCov_9fa48("52133"), {
          position: 'absolute',
          top: '-12px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          padding: '6px 20px',
          borderRadius: '100px',
          fontSize: '12px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '1px'
        })}>
                Most Popular
              </div>)}

            <div style={stryMutAct_9fa48("52144") ? {} : (stryCov_9fa48("52144"), {
          fontSize: '14px',
          color: 'rgba(255,255,255,0.5)',
          textTransform: 'uppercase',
          letterSpacing: '2px',
          marginBottom: '8px'
        })}>
              {tier.name}
            </div>

            <div style={stryMutAct_9fa48("52150") ? {} : (stryCov_9fa48("52150"), {
          display: 'flex',
          alignItems: 'baseline',
          gap: '8px',
          marginBottom: '8px'
        })}>
              <span style={stryMutAct_9fa48("52155") ? {} : (stryCov_9fa48("52155"), {
            fontSize: '48px',
            fontWeight: 800,
            background: tier.popular ? 'linear-gradient(135deg, #fff, #a5b4fc)' : '#fff',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          })}>
                {formatPrice(tier.basePrice, selectedRegion, commitment)}
              </span>
              <span style={stryMutAct_9fa48("52161") ? {} : (stryCov_9fa48("52161"), {
            color: 'rgba(255,255,255,0.4)',
            fontSize: '16px'
          })}>
                /{(stryMutAct_9fa48("52166") ? commitment.id !== 'monthly' : stryMutAct_9fa48("52165") ? false : stryMutAct_9fa48("52164") ? true : (stryCov_9fa48("52164", "52165", "52166"), commitment.id === 'monthly')) ? 'mo' : 'yr'}
              </span>
            </div>

            {stryMutAct_9fa48("52172") ? commitment.id !== 'monthly' || <div style={{
          fontSize: '14px',
          color: 'rgba(255,255,255,0.4)',
          marginBottom: '16px'
        }}>
                {getMonthlyEquivalent(tier.basePrice, selectedRegion, commitment)}/month billed {commitment.id === 'annual' ? 'annually' : 'every 3 years'}
              </div> : stryMutAct_9fa48("52171") ? false : stryMutAct_9fa48("52170") ? true : (stryCov_9fa48("52170", "52171", "52172"), (stryMutAct_9fa48("52174") ? commitment.id === 'monthly' : stryMutAct_9fa48("52173") ? true : (stryCov_9fa48("52173", "52174"), commitment.id !== 'monthly')) && <div style={stryMutAct_9fa48("52176") ? {} : (stryCov_9fa48("52176"), {
          fontSize: '14px',
          color: 'rgba(255,255,255,0.4)',
          marginBottom: '16px'
        })}>
                {getMonthlyEquivalent(tier.basePrice, selectedRegion, commitment)}/month billed {(stryMutAct_9fa48("52182") ? commitment.id !== 'annual' : stryMutAct_9fa48("52181") ? false : stryMutAct_9fa48("52180") ? true : (stryCov_9fa48("52180", "52181", "52182"), commitment.id === 'annual')) ? 'annually' : 'every 3 years'}
              </div>)}

            <p style={stryMutAct_9fa48("52186") ? {} : (stryCov_9fa48("52186"), {
          color: 'rgba(255,255,255,0.6)',
          fontSize: '15px',
          lineHeight: 1.6,
          marginBottom: '32px'
        })}>
              {tier.description}
            </p>

            <button style={stryMutAct_9fa48("52190") ? {} : (stryCov_9fa48("52190"), {
          width: '100%',
          padding: '16px',
          background: tier.popular ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'rgba(255,255,255,0.1)',
          border: 'none',
          borderRadius: '12px',
          color: '#fff',
          fontSize: '16px',
          fontWeight: 600,
          cursor: 'pointer',
          marginBottom: '32px',
          transition: 'all 0.2s ease'
        })}>
              {tier.cta}
            </button>

            <div style={stryMutAct_9fa48("52202") ? {} : (stryCov_9fa48("52202"), {
          fontSize: '12px',
          textTransform: 'uppercase',
          letterSpacing: '2px',
          color: 'rgba(255,255,255,0.4)',
          marginBottom: '16px'
        })}>
              What's included
            </div>

            <ul style={stryMutAct_9fa48("52208") ? {} : (stryCov_9fa48("52208"), {
          listStyle: 'none',
          padding: 0,
          margin: 0
        })}>
              {tier.features.map(stryMutAct_9fa48("52210") ? () => undefined : (stryCov_9fa48("52210"), (feature, i) => <li key={i} style={stryMutAct_9fa48("52211") ? {} : (stryCov_9fa48("52211"), {
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            padding: '10px 0',
            borderBottom: (stryMutAct_9fa48("52219") ? i >= tier.features.length - 1 : stryMutAct_9fa48("52218") ? i <= tier.features.length - 1 : stryMutAct_9fa48("52217") ? false : stryMutAct_9fa48("52216") ? true : (stryCov_9fa48("52216", "52217", "52218", "52219"), i < (stryMutAct_9fa48("52220") ? tier.features.length + 1 : (stryCov_9fa48("52220"), tier.features.length - 1)))) ? '1px solid rgba(255,255,255,0.05)' : 'none'
          })}>
                  <span style={stryMutAct_9fa48("52223") ? {} : (stryCov_9fa48("52223"), {
              color: '#10b981',
              flexShrink: 0
            })}>✓</span>
                  <span style={stryMutAct_9fa48("52225") ? {} : (stryCov_9fa48("52225"), {
              color: 'rgba(255,255,255,0.8)',
              fontSize: '14px'
            })}>{feature}</span>
                </li>))}
            </ul>
          </div>))}
      </section>

      {/* Regional Pricing Explanation */}
      <section style={stryMutAct_9fa48("52228") ? {} : (stryCov_9fa48("52228"), {
      background: 'rgba(255,255,255,0.02)',
      borderTop: '1px solid rgba(255,255,255,0.05)',
      padding: '80px 20px'
    })}>
        <div style={stryMutAct_9fa48("52232") ? {} : (stryCov_9fa48("52232"), {
        maxWidth: '900px',
        margin: '0 auto',
        textAlign: 'center'
      })}>
          <h2 style={stryMutAct_9fa48("52236") ? {} : (stryCov_9fa48("52236"), {
          fontSize: '32px',
          fontWeight: 700,
          marginBottom: '16px'
        })}>Fair Pricing, Everywhere</h2>
          <p style={stryMutAct_9fa48("52239") ? {} : (stryCov_9fa48("52239"), {
          color: 'rgba(255,255,255,0.6)',
          fontSize: '18px',
          maxWidth: '600px',
          margin: '0 auto 48px'
        })}>
            We believe world-class decision intelligence should be accessible globally. Our regional pricing reflects local market conditions.
          </p>

          <div style={stryMutAct_9fa48("52244") ? {} : (stryCov_9fa48("52244"), {
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          textAlign: 'left'
        })}>
            {regions.map(stryMutAct_9fa48("52249") ? () => undefined : (stryCov_9fa48("52249"), region => <div key={region.id} onClick={stryMutAct_9fa48("52250") ? () => undefined : (stryCov_9fa48("52250"), () => setSelectedRegion(region))} style={stryMutAct_9fa48("52251") ? {} : (stryCov_9fa48("52251"), {
            padding: '20px',
            background: (stryMutAct_9fa48("52255") ? selectedRegion.id !== region.id : stryMutAct_9fa48("52254") ? false : stryMutAct_9fa48("52253") ? true : (stryCov_9fa48("52253", "52254", "52255"), selectedRegion.id === region.id)) ? 'rgba(99, 102, 241, 0.1)' : 'rgba(255,255,255,0.02)',
            border: (stryMutAct_9fa48("52260") ? selectedRegion.id !== region.id : stryMutAct_9fa48("52259") ? false : stryMutAct_9fa48("52258") ? true : (stryCov_9fa48("52258", "52259", "52260"), selectedRegion.id === region.id)) ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid rgba(255,255,255,0.05)',
            borderRadius: '12px',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          })}>
                <div style={stryMutAct_9fa48("52266") ? {} : (stryCov_9fa48("52266"), {
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '8px'
            })}>
                  <span style={stryMutAct_9fa48("52271") ? {} : (stryCov_9fa48("52271"), {
                fontSize: '20px'
              })}>{region.flag}</span>
                  <span style={stryMutAct_9fa48("52273") ? {} : (stryCov_9fa48("52273"), {
                fontWeight: 600
              })}>{region.name}</span>
                </div>
                <div style={stryMutAct_9fa48("52274") ? {} : (stryCov_9fa48("52274"), {
              fontSize: '14px',
              color: (stryMutAct_9fa48("52279") ? region.multiplier >= 1 : stryMutAct_9fa48("52278") ? region.multiplier <= 1 : stryMutAct_9fa48("52277") ? false : stryMutAct_9fa48("52276") ? true : (stryCov_9fa48("52276", "52277", "52278", "52279"), region.multiplier < 1)) ? '#10b981' : 'rgba(255,255,255,0.5)'
            })}>
                  {(stryMutAct_9fa48("52285") ? region.multiplier >= 1 : stryMutAct_9fa48("52284") ? region.multiplier <= 1 : stryMutAct_9fa48("52283") ? false : stryMutAct_9fa48("52282") ? true : (stryCov_9fa48("52282", "52283", "52284", "52285"), region.multiplier < 1)) ? `${Math.round(stryMutAct_9fa48("52287") ? (1 - region.multiplier) / 100 : (stryCov_9fa48("52287"), (stryMutAct_9fa48("52288") ? 1 + region.multiplier : (stryCov_9fa48("52288"), 1 - region.multiplier)) * 100))}% adjustment` : 'Base pricing'}
                </div>
              </div>))}
          </div>
        </div>
      </section>

      {/* Enterprise CTA */}
      <section style={stryMutAct_9fa48("52290") ? {} : (stryCov_9fa48("52290"), {
      padding: '80px 20px',
      textAlign: 'center'
    })}>
        <div style={stryMutAct_9fa48("52293") ? {} : (stryCov_9fa48("52293"), {
        maxWidth: '800px',
        margin: '0 auto',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.1))',
        border: '1px solid rgba(99, 102, 241, 0.3)',
        borderRadius: '24px',
        padding: '60px 40px'
      })}>
          <h2 style={stryMutAct_9fa48("52300") ? {} : (stryCov_9fa48("52300"), {
          fontSize: '36px',
          fontWeight: 700,
          marginBottom: '16px'
        })}>Need a Custom Solution?</h2>
          <p style={stryMutAct_9fa48("52303") ? {} : (stryCov_9fa48("52303"), {
          color: 'rgba(255,255,255,0.6)',
          fontSize: '18px',
          marginBottom: '32px'
        })}>
            Large organization? Complex requirements? Government or education pricing? Let's build a package that works for you.
          </p>
          <button style={stryMutAct_9fa48("52307") ? {} : (stryCov_9fa48("52307"), {
          padding: '18px 48px',
          background: '#fff',
          border: 'none',
          borderRadius: '12px',
          color: '#0a0a0f',
          fontSize: '18px',
          fontWeight: 600,
          cursor: 'pointer'
        })}>
            Talk to Sales
          </button>
        </div>
      </section>

      {/* FAQ */}
      <section style={stryMutAct_9fa48("52315") ? {} : (stryCov_9fa48("52315"), {
      background: 'rgba(255,255,255,0.02)',
      borderTop: '1px solid rgba(255,255,255,0.05)',
      padding: '80px 20px'
    })}>
        <div style={stryMutAct_9fa48("52319") ? {} : (stryCov_9fa48("52319"), {
        maxWidth: '700px',
        margin: '0 auto'
      })}>
          <h2 style={stryMutAct_9fa48("52322") ? {} : (stryCov_9fa48("52322"), {
          fontSize: '32px',
          fontWeight: 700,
          textAlign: 'center',
          marginBottom: '48px'
        })}>Frequently Asked Questions</h2>
          {faqs.map(stryMutAct_9fa48("52326") ? () => undefined : (stryCov_9fa48("52326"), (faq, i) => <div key={i} style={stryMutAct_9fa48("52327") ? {} : (stryCov_9fa48("52327"), {
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          padding: '24px 0'
        })}>
              <h3 style={stryMutAct_9fa48("52330") ? {} : (stryCov_9fa48("52330"), {
            fontSize: '18px',
            fontWeight: 600,
            marginBottom: '12px',
            color: '#fff'
          })}>{faq.q}</h3>
              <p style={stryMutAct_9fa48("52334") ? {} : (stryCov_9fa48("52334"), {
            color: 'rgba(255,255,255,0.6)',
            fontSize: '15px',
            lineHeight: 1.7,
            margin: 0
          })}>{faq.a}</p>
            </div>))}
        </div>
      </section>

      {/* Footer */}
      <footer style={stryMutAct_9fa48("52337") ? {} : (stryCov_9fa48("52337"), {
      padding: '40px 20px',
      textAlign: 'center',
      borderTop: '1px solid rgba(255,255,255,0.05)'
    })}>
        <div style={stryMutAct_9fa48("52341") ? {} : (stryCov_9fa48("52341"), {
        color: 'rgba(255,255,255,0.4)',
        fontSize: '14px'
      })}>
          <p style={stryMutAct_9fa48("52344") ? {} : (stryCov_9fa48("52344"), {
          margin: '0 0 8px'
        })}>Prices shown in {selectedRegion.currency}. Local taxes may apply.</p>
          <p style={stryMutAct_9fa48("52346") ? {} : (stryCov_9fa48("52346"), {
          margin: 0
        })}>Questions? Contact sales@datacendia.com</p>
        </div>
      </footer>
    </div>;
}