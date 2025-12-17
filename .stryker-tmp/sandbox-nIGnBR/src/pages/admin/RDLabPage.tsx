// @ts-nocheck
// =============================================================================
// CENDIA R&D LAB — HORIZON 3+ RESEARCH & DEVELOPMENT
// Future Technologies, Speculative Projects, and Long-Term Vision
// "Where today's impossible becomes tomorrow's infrastructure"
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
import { useNavigate } from 'react-router-dom';

// =============================================================================
// TYPES
// =============================================================================

type ResearchStatus = 'conceptual' | 'theoretical' | 'prototyping' | 'testing' | 'paused';
type ResearchHorizon = '2025-2027' | '2028-2030' | '2030-2035' | '2035+' | 'indefinite';
type ResearchCategory = 'neurotech' | 'space' | 'quantum' | 'biotech' | 'governance' | 'infrastructure' | 'economics';
interface ResearchProject {
  id: string;
  name: string;
  codename: string;
  description: string;
  status: ResearchStatus;
  horizon: ResearchHorizon;
  category: ResearchCategory;
  potentialValue: string;
  technicalChallenges: string[];
  dependencies: string[];
  riskLevel: 'low' | 'medium' | 'high' | 'extreme';
  estimatedInvestment: string;
  principalInvestigator?: string;
  notes: string;
}

// =============================================================================
// R&D PROJECT DATA
// =============================================================================

const RD_PROJECTS: ResearchProject[] = stryMutAct_9fa48("18265") ? [] : (stryCov_9fa48("18265"), [// NEUROTECH
stryMutAct_9fa48("18266") ? {} : (stryCov_9fa48("18266"), {
  id: 'rd-neurolink',
  name: 'CendiaNeuro-Link™',
  codename: 'Project Synapse',
  description: 'Direct Brain-Computer Interface (BCI) integration for "thought-speed" deliberation. Instant simulation of executive intent without verbal or typed input.',
  status: 'conceptual',
  horizon: '2030-2035',
  category: 'neurotech',
  potentialValue: 'Eliminates communication latency in critical decisions. Ultimate human-AI fusion.',
  technicalChallenges: stryMutAct_9fa48("18275") ? [] : (stryCov_9fa48("18275"), ['BCI hardware not mature (Neuralink, Synchron still in trials)', 'FDA/regulatory approval pathway unclear', 'Signal-to-noise ratio insufficient for complex thought', 'Ethical concerns around thought privacy']),
  dependencies: stryMutAct_9fa48("18280") ? [] : (stryCov_9fa48("18280"), ['Mature BCI hardware ecosystem', 'Regulatory framework for neural interfaces']),
  riskLevel: 'extreme',
  estimatedInvestment: '$50M-$200M (10+ years)',
  notes: 'Monitor Neuralink N1 trials. Revisit when consumer BCI reaches 10M users.'
}), stryMutAct_9fa48("18286") ? {} : (stryCov_9fa48("18286"), {
  id: 'rd-neurosovereign',
  name: 'CendiaNeuroSovereign™',
  codename: 'Project Psyche',
  description: 'Model population-level psychological health, resilience, and unrest risk. National-scale mental health infrastructure.',
  status: 'theoretical',
  horizon: '2028-2030',
  category: 'neurotech',
  potentialValue: '$20M-$45M/year. Stabilizes societies; prevents unrest and burnout at national scale.',
  technicalChallenges: stryMutAct_9fa48("18295") ? [] : (stryCov_9fa48("18295"), ['Privacy concerns with population-level mental health data', 'Model accuracy for predicting social unrest', 'Government trust in AI-driven psychology', 'Cultural variations in mental health indicators']),
  dependencies: stryMutAct_9fa48("18300") ? [] : (stryCov_9fa48("18300"), ['CendiaBio™ biometric platform', 'Government data partnerships']),
  riskLevel: 'high',
  estimatedInvestment: '$15M-$40M',
  principalInvestigator: 'TBD - Requires behavioral science lead',
  notes: 'Could spin out CendiaBio as prerequisite. WHO partnership potential.'
}), // SPACE & COSMIC
stryMutAct_9fa48("18307") ? {} : (stryCov_9fa48("18307"), {
  id: 'rd-interstellar',
  name: 'CendiaInterstellar Logistics™',
  codename: 'Project Horizon',
  description: 'High-latency decision support for Mars/Space colonies. Governs off-world colonies where light-lag (4-24 min to Mars) prevents real-time Earth control.',
  status: 'conceptual',
  horizon: '2035+',
  category: 'space',
  potentialValue: 'Monopoly on off-world governance infrastructure. $100M+/year when colonies exist.',
  technicalChallenges: stryMutAct_9fa48("18316") ? [] : (stryCov_9fa48("18316"), ['No current market (SpaceX Mars colony 2030+ optimistically)', 'Latency-tolerant consensus algorithms needed', 'Radiation-hardened hardware requirements', 'Legal jurisdiction in space unclear']),
  dependencies: stryMutAct_9fa48("18321") ? [] : (stryCov_9fa48("18321"), ['Viable Mars colony', 'Space law framework']),
  riskLevel: 'extreme',
  estimatedInvestment: '$30M-$100M (15+ years)',
  notes: 'Pure long-term bet. Keep minimal team monitoring space colonization progress.'
}), stryMutAct_9fa48("18327") ? {} : (stryCov_9fa48("18327"), {
  id: 'rd-terraform',
  name: 'CendiaTerraform Command™',
  codename: 'Project Genesis',
  description: 'Off-World Resource Manager. Manages mining, water, energy, and habitat expansion for lunar and Martian colonies.',
  status: 'conceptual',
  horizon: '2035+',
  category: 'space',
  potentialValue: '$50M-$100M/year. Essential infrastructure for space economy.',
  technicalChallenges: stryMutAct_9fa48("18336") ? [] : (stryCov_9fa48("18336"), ['No extraterrestrial mining operations exist yet', 'Extreme environment simulation accuracy', 'Communication latency for real-time management', 'Unknown unknowns of off-world operations']),
  dependencies: stryMutAct_9fa48("18341") ? [] : (stryCov_9fa48("18341"), ['Lunar Gateway operational', 'Artemis program success', 'SpaceX Starship reliability']),
  riskLevel: 'extreme',
  estimatedInvestment: '$40M-$150M',
  notes: 'Partner with NASA/ESA for early lunar applications. Could be 5-year runway before relevance.'
}), stryMutAct_9fa48("18348") ? {} : (stryCov_9fa48("18348"), {
  id: 'rd-astral',
  name: 'CendiaAstral Defense Grid™',
  codename: 'Project Sentinel',
  description: 'Detect cosmic threats (asteroids, solar flares, orbital cascades) before they hit Earth. Planetary protection infrastructure.',
  status: 'theoretical',
  horizon: '2028-2030',
  category: 'space',
  potentialValue: '$50M-$100M/year. Planetary protection against extinction-level events.',
  technicalChallenges: stryMutAct_9fa48("18357") ? [] : (stryCov_9fa48("18357"), ['Requires integration with global telescope networks', 'False positive management for world-ending alerts', 'Political coordination for response actions', 'Liability for missed detections']),
  dependencies: stryMutAct_9fa48("18362") ? [] : (stryCov_9fa48("18362"), ['NASA NEO Surveyor data access', 'ESA Hera mission results']),
  riskLevel: 'high',
  estimatedInvestment: '$25M-$60M',
  notes: 'Most viable space project. Real market exists (planetary defense agencies). Pursue actively.'
}), stryMutAct_9fa48("18368") ? {} : (stryCov_9fa48("18368"), {
  id: 'rd-exosphere',
  name: 'CendiaExosphere Command™',
  codename: 'Project Orbit',
  description: 'Govern global airspace/drone/satellite traffic using autonomous AI. Coordinates 50,000+ satellites and millions of drones.',
  status: 'prototyping',
  horizon: '2025-2027',
  category: 'space',
  potentialValue: '$50M-$100M/year. Makes global air & satellite traffic safer & more efficient.',
  technicalChallenges: stryMutAct_9fa48("18377") ? [] : (stryCov_9fa48("18377"), ['Regulatory fragmentation (FAA, EASA, CAAC all different)', 'Real-time tracking of all orbital objects', 'Collision avoidance at scale', 'Liability for autonomous decisions']),
  dependencies: stryMutAct_9fa48("18382") ? [] : (stryCov_9fa48("18382"), ['SpaceX Starlink constellation stability', 'Global UTM standards']),
  riskLevel: 'medium',
  estimatedInvestment: '$20M-$50M',
  principalInvestigator: 'Aerospace team lead',
  notes: 'NEAREST-TERM SPACE PRODUCT. FAA contract opportunities exist. Prioritize.'
}), // QUANTUM
stryMutAct_9fa48("18389") ? {} : (stryCov_9fa48("18389"), {
  id: 'rd-quantumnet',
  name: 'CendiaQuantumNet™',
  codename: 'Project Entangle',
  description: 'Quantum-Secure Communication. Establishes an unhackable, quantum-state deliberation layer for cross-border intelligence sharing.',
  status: 'theoretical',
  horizon: '2028-2030',
  category: 'quantum',
  potentialValue: 'Intelligence agencies pay premium for unhackable comms. $30M-$80M/year.',
  technicalChallenges: stryMutAct_9fa48("18398") ? [] : (stryCov_9fa48("18398"), ['Quantum key distribution limited to ~100km without repeaters', 'Quantum repeaters not commercially available', 'Integration with existing secure infrastructure', 'Nation-state level security certification']),
  dependencies: stryMutAct_9fa48("18403") ? [] : (stryCov_9fa48("18403"), ['Quantum repeater technology', 'Quantum computing threat timeline']),
  riskLevel: 'high',
  estimatedInvestment: '$30M-$70M',
  notes: 'Monitor China\'s quantum satellite progress. Partner with IBM/Google quantum teams.'
}), // BIOTECH
stryMutAct_9fa48("18409") ? {} : (stryCov_9fa48("18409"), {
  id: 'rd-genome',
  name: 'CendiaGenome Governance™',
  codename: 'Project Helix',
  description: 'Population Bio-Risk Modeling. Analyzes health data to predict genetic risks, pathogen evolution, and emerging bio-threats to prevent pandemics.',
  status: 'theoretical',
  horizon: '2028-2030',
  category: 'biotech',
  potentialValue: 'CDC, WHO, national health ministries. $25M-$60M/year.',
  technicalChallenges: stryMutAct_9fa48("18418") ? [] : (stryCov_9fa48("18418"), ['Genomic data privacy regulations (GINA, GDPR)', 'Pathogen evolution prediction accuracy', 'International data sharing agreements', 'Ethical concerns around genetic surveillance']),
  dependencies: stryMutAct_9fa48("18423") ? [] : (stryCov_9fa48("18423"), ['CendiaBio™ health platform', 'WHO data partnerships']),
  riskLevel: 'high',
  estimatedInvestment: '$20M-$50M',
  notes: 'Post-COVID appetite exists. Partner with genomics companies (Illumina, 23andMe).'
}), stryMutAct_9fa48("18429") ? {} : (stryCov_9fa48("18429"), {
  id: 'rd-bio',
  name: 'CendiaBio™',
  codename: 'Project Pulse',
  description: 'Biometric wearables integration for workforce stress/health monitoring. "The Corporate Nervous System" - prevents burnout by measuring biological load.',
  status: 'prototyping',
  horizon: '2025-2027',
  category: 'biotech',
  potentialValue: 'Enterprise wellness market. $10M-$30M/year initially.',
  technicalChallenges: stryMutAct_9fa48("18438") ? [] : (stryCov_9fa48("18438"), ['Employee consent and privacy concerns', 'Integration with diverse wearable ecosystems', 'Correlation between biometrics and performance', 'Union/labor law implications']),
  dependencies: stryMutAct_9fa48("18443") ? [] : (stryCov_9fa48("18443"), ['Apple Health, Fitbit, Garmin API access', 'HIPAA compliance framework']),
  riskLevel: 'medium',
  estimatedInvestment: '$5M-$15M',
  principalInvestigator: 'Health tech team',
  notes: 'VIABLE NEAR-TERM. Pairs with CendiaUnion™. Start with opt-in executive wellness.'
}), // GOVERNANCE (EXTREME)
stryMutAct_9fa48("18450") ? {} : (stryCov_9fa48("18450"), {
  id: 'rd-nation',
  name: 'CendiaNation™',
  codename: 'Project Polity',
  description: 'OS for Special Economic Zones (SEZ) and charter cities. Replaces bureaucracy with code. Manages taxes, permits, and property rights algorithmically.',
  status: 'conceptual',
  horizon: '2030-2035',
  category: 'governance',
  potentialValue: 'Charter city market growing. $20M-$50M per deployment.',
  technicalChallenges: stryMutAct_9fa48("18459") ? [] : (stryCov_9fa48("18459"), ['Political resistance to "code as law"', 'Edge cases requiring human judgment', 'Democratic legitimacy concerns', 'Legal framework for algorithmic governance']),
  dependencies: stryMutAct_9fa48("18464") ? [] : (stryCov_9fa48("18464"), ['Successful charter city examples', 'Regulatory sandbox agreements']),
  riskLevel: 'extreme',
  estimatedInvestment: '$30M-$80M',
  notes: 'Watch Próspera (Honduras), NEOM (Saudi). High risk but transformative if successful.'
}), stryMutAct_9fa48("18470") ? {} : (stryCov_9fa48("18470"), {
  id: 'rd-echelons',
  name: 'CendiaEchelons™',
  codename: 'Project Dynasty',
  description: 'Dynastic Governance. Long-term simulation for royal houses and family empires to ensure cultural and economic survival for 100+ years.',
  status: 'theoretical',
  horizon: '2028-2030',
  category: 'governance',
  potentialValue: 'Royal families, multi-generational family offices. $5M-$20M per engagement.',
  technicalChallenges: stryMutAct_9fa48("18479") ? [] : (stryCov_9fa48("18479"), ['Extreme confidentiality requirements', 'Succession planning across generations', 'Cultural preservation vs adaptation', 'Limited market size (few hundred families globally)']),
  dependencies: stryMutAct_9fa48("18484") ? [] : (stryCov_9fa48("18484"), ['CendiaLegacy™ executive digital twin technology']),
  riskLevel: 'medium',
  estimatedInvestment: '$10M-$25M',
  notes: 'Niche but high-margin. Gulf royal families, European houses, Asian conglomerates.'
}), stryMutAct_9fa48("18489") ? {} : (stryCov_9fa48("18489"), {
  id: 'rd-100year',
  name: 'Cendia100-Year Strategy Engine™',
  codename: 'Project Epoch',
  description: 'Multi-generational planning for Sovereign Wealth Funds. Optimizes assets for the next century, not the next quarter.',
  status: 'theoretical',
  horizon: '2028-2030',
  category: 'governance',
  potentialValue: 'Sovereign wealth funds control $10T+. $30M-$80M/year potential.',
  technicalChallenges: stryMutAct_9fa48("18498") ? [] : (stryCov_9fa48("18498"), ['Prediction accuracy over 100-year horizons', 'Black swan event modeling', 'Generational preference shifts', 'Climate change impact on long-term assets']),
  dependencies: stryMutAct_9fa48("18503") ? [] : (stryCov_9fa48("18503"), ['CendiaChronos™ time-travel simulation', 'Climate modeling integration']),
  riskLevel: 'high',
  estimatedInvestment: '$20M-$50M',
  notes: 'Norway GPFG, Singapore GIC, Abu Dhabi ADIA are targets. Start with 25-year models.'
}), // INFRASTRUCTURE (EXTREME)
stryMutAct_9fa48("18509") ? {} : (stryCov_9fa48("18509"), {
  id: 'rd-stratos',
  name: 'CendiaStratos™',
  codename: 'Project Cloudmaker',
  description: 'Geoengineering Oversight. Models planetary impacts of climate interventions (cloud seeding, stratospheric aerosol injection) to ensure safety.',
  status: 'conceptual',
  horizon: '2030-2035',
  category: 'infrastructure',
  potentialValue: 'Climate alliances, UN Environment Programme. $40M-$100M/year if geoengineering proceeds.',
  technicalChallenges: stryMutAct_9fa48("18518") ? [] : (stryCov_9fa48("18518"), ['Geoengineering itself controversial and unproven', 'Global coordination requirements', 'Unintended consequence modeling', 'Liability for climate interventions']),
  dependencies: stryMutAct_9fa48("18523") ? [] : (stryCov_9fa48("18523"), ['International geoengineering treaties', 'Climate model accuracy improvements']),
  riskLevel: 'extreme',
  estimatedInvestment: '$25M-$60M',
  notes: 'Highly speculative. Only relevant if world pursues geoengineering (likely by 2035).'
}), stryMutAct_9fa48("18529") ? {} : (stryCov_9fa48("18529"), {
  id: 'rd-planetary',
  name: 'CendiaPlanetary Resource Balancer™',
  codename: 'Project Cycle',
  description: 'Global supply chain connection to optimize waste/energy (Circular Economy). Waste from Company A becomes fuel for Company B automatically.',
  status: 'theoretical',
  horizon: '2028-2030',
  category: 'infrastructure',
  potentialValue: 'Circular economy market $500B+. $30M-$80M/year platform fees.',
  technicalChallenges: stryMutAct_9fa48("18538") ? [] : (stryCov_9fa48("18538"), ['Cross-industry data sharing reluctance', 'Logistics of waste-to-resource matching', 'Quality/contamination standards', 'Pricing mechanisms for waste streams']),
  dependencies: stryMutAct_9fa48("18543") ? [] : (stryCov_9fa48("18543"), ['CendiaMesh™ integration platform', 'Industry consortium buy-in']),
  riskLevel: 'medium',
  estimatedInvestment: '$15M-$40M',
  notes: 'EU Circular Economy regulations driving demand. Partner with waste management giants.'
}), stryMutAct_9fa48("18549") ? {} : (stryCov_9fa48("18549"), {
  id: 'rd-helios',
  name: 'CendiaHelios Framework™',
  codename: 'Project Sunbridge',
  description: 'Planetary Energy OS. Optimizes global energy grids, balancing fusion, renewables, and consumption to prevent blackouts and climate impact.',
  status: 'theoretical',
  horizon: '2030-2035',
  category: 'infrastructure',
  potentialValue: 'Global energy consortiums, supergrid operators. $60M-$120M/year.',
  technicalChallenges: stryMutAct_9fa48("18558") ? [] : (stryCov_9fa48("18558"), ['Fusion power not yet commercially viable', 'Grid interconnection politics', 'Real-time global optimization complexity', 'Energy sovereignty concerns']),
  dependencies: stryMutAct_9fa48("18563") ? [] : (stryCov_9fa48("18563"), ['Commercial fusion reactors', 'Supergrid infrastructure']),
  riskLevel: 'high',
  estimatedInvestment: '$40M-$100M',
  notes: 'Watch ITER, Commonwealth Fusion. Grid optimization (non-fusion) viable sooner.'
}), // ECONOMICS
stryMutAct_9fa48("18569") ? {} : (stryCov_9fa48("18569"), {
  id: 'rd-market',
  name: 'CendiaMarket™',
  codename: 'Project Agora',
  description: 'Marketplace for selling anonymized Council insights (ZK-proofs). Monetizes aggregate data without breaking privacy. "What does the manufacturing sector think?"',
  status: 'paused',
  horizon: '2028-2030',
  category: 'economics',
  potentialValue: 'Hedge funds, consultancies pay premium for aggregate signals. $20M-$50M/year.',
  technicalChallenges: stryMutAct_9fa48("18578") ? [] : (stryCov_9fa48("18578"), ['Customer trust concerns ("are you selling my data?")', 'ZK-proof implementation complexity', 'Sufficient customer base for meaningful aggregates', 'Competitive intelligence leakage fears']),
  dependencies: stryMutAct_9fa48("18583") ? [] : (stryCov_9fa48("18583"), ['100+ enterprise customers', 'ZK-proof infrastructure']),
  riskLevel: 'high',
  estimatedInvestment: '$10M-$25M',
  notes: 'PAUSED - Customer acquisition must come first. Revisit at 100 enterprise customers.'
}), stryMutAct_9fa48("18589") ? {} : (stryCov_9fa48("18589"), {
  id: 'rd-arbitration',
  name: 'CendiaArbitration Core™',
  codename: 'Project Themis',
  description: 'AI Judge for settling B2B contract disputes instantly. Privatized, unbiased justice system. Replaces slow legal courts for contract breaches.',
  status: 'theoretical',
  horizon: '2028-2030',
  category: 'economics',
  potentialValue: 'B2B arbitration market $14B. $30M-$80M/year potential.',
  technicalChallenges: stryMutAct_9fa48("18598") ? [] : (stryCov_9fa48("18598"), ['Legal enforceability of AI decisions', 'Appeals process design', 'Bias in training data', 'Resistance from legal profession']),
  dependencies: stryMutAct_9fa48("18603") ? [] : (stryCov_9fa48("18603"), ['CendiaLedger™ decision provenance', 'Legal precedent for AI arbitration']),
  riskLevel: 'high',
  estimatedInvestment: '$15M-$40M',
  notes: 'Kleros, Aragon doing blockchain arbitration. Our advantage: enterprise trust + audit trail.'
}), stryMutAct_9fa48("18609") ? {} : (stryCov_9fa48("18609"), {
  id: 'rd-synthetic',
  name: 'CendiaSynthetic User Groups™',
  codename: 'Project Mirror Market',
  description: 'Simulation of 1M "Synthetic Customers" to test marketing/products. Replaces focus groups. Predicts market reaction with 99% accuracy before launch.',
  status: 'prototyping',
  horizon: '2025-2027',
  category: 'economics',
  potentialValue: 'Market research industry $80B. $20M-$50M/year.',
  technicalChallenges: stryMutAct_9fa48("18618") ? [] : (stryCov_9fa48("18618"), ['Synthetic-real accuracy validation', 'Demographic representation accuracy', 'Novel product prediction (no historical data)', 'Client trust in synthetic results']),
  dependencies: stryMutAct_9fa48("18623") ? [] : (stryCov_9fa48("18623"), ['Large consumer behavior datasets', 'Validated prediction accuracy']),
  riskLevel: 'medium',
  estimatedInvestment: '$10M-$25M',
  principalInvestigator: 'Consumer insights team',
  notes: 'VIABLE NEAR-TERM. Synth users from Ollama agents. Start with A/B test prediction.'
}), stryMutAct_9fa48("18630") ? {} : (stryCov_9fa48("18630"), {
  id: 'rd-diplomat',
  name: 'CendiaDiplomat Protocol™',
  codename: 'Project Handshake',
  description: 'Standard for two Datacendia instances to negotiate contracts autonomously. "My AI talks to your AI and signs the deal."',
  status: 'theoretical',
  horizon: '2028-2030',
  category: 'economics',
  potentialValue: 'B2B automation. $50M-$150M/year in transaction fees.',
  technicalChallenges: stryMutAct_9fa48("18639") ? [] : (stryCov_9fa48("18639"), ['Legal validity of AI-signed contracts', 'Negotiation strategy confidentiality', 'Deadlock resolution mechanisms', 'Trust between competing companies\' AIs']),
  dependencies: stryMutAct_9fa48("18644") ? [] : (stryCov_9fa48("18644"), ['CendiaSenate™ federation protocol', '10+ mutual customers']),
  riskLevel: 'medium',
  estimatedInvestment: '$15M-$35M',
  notes: 'Killer feature once customer density allows. Natural extension of Senate federation.'
})]);

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

const getStatusColor = (status: ResearchStatus): string => {
  const colors: Record<ResearchStatus, string> = stryMutAct_9fa48("18651") ? {} : (stryCov_9fa48("18651"), {
    conceptual: 'bg-slate-600',
    theoretical: 'bg-blue-600',
    prototyping: 'bg-amber-600',
    testing: 'bg-green-600',
    paused: 'bg-red-600'
  });
  return colors[status];
};
const getHorizonColor = (horizon: ResearchHorizon): string => {
  const colors: Record<ResearchHorizon, string> = stryMutAct_9fa48("18658") ? {} : (stryCov_9fa48("18658"), {
    '2025-2027': 'text-green-400',
    '2028-2030': 'text-cyan-400',
    '2030-2035': 'text-amber-400',
    '2035+': 'text-red-400',
    'indefinite': 'text-slate-400'
  });
  return colors[horizon];
};
const getCategoryIcon = (category: ResearchCategory): string => {
  const icons: Record<ResearchCategory, string> = stryMutAct_9fa48("18665") ? {} : (stryCov_9fa48("18665"), {
    neurotech: '🧠',
    space: '🚀',
    quantum: '⚛️',
    biotech: '🧬',
    governance: '🏛️',
    infrastructure: '🌍',
    economics: '💹'
  });
  return icons[category];
};
const getRiskColor = (risk: ResearchProject['riskLevel']): string => {
  const colors = stryMutAct_9fa48("18674") ? {} : (stryCov_9fa48("18674"), {
    low: 'text-green-400',
    medium: 'text-amber-400',
    high: 'text-orange-400',
    extreme: 'text-red-400'
  });
  return colors[risk];
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const RDLabPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedProject, setSelectedProject] = useState<ResearchProject | null>(null);
  const [filterCategory, setFilterCategory] = useState<ResearchCategory | 'all'>('all');
  const [filterHorizon, setFilterHorizon] = useState<ResearchHorizon | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<ResearchStatus | 'all'>('all');
  const categories: ResearchCategory[] = stryMutAct_9fa48("18683") ? [] : (stryCov_9fa48("18683"), ['neurotech', 'space', 'quantum', 'biotech', 'governance', 'infrastructure', 'economics']);
  const horizons: ResearchHorizon[] = stryMutAct_9fa48("18691") ? [] : (stryCov_9fa48("18691"), ['2025-2027', '2028-2030', '2030-2035', '2035+', 'indefinite']);
  const statuses: ResearchStatus[] = stryMutAct_9fa48("18697") ? [] : (stryCov_9fa48("18697"), ['conceptual', 'theoretical', 'prototyping', 'testing', 'paused']);
  const filteredProjects = stryMutAct_9fa48("18703") ? RD_PROJECTS : (stryCov_9fa48("18703"), RD_PROJECTS.filter(p => {
    if (stryMutAct_9fa48("18707") ? filterCategory !== 'all' || p.category !== filterCategory : stryMutAct_9fa48("18706") ? false : stryMutAct_9fa48("18705") ? true : (stryCov_9fa48("18705", "18706", "18707"), (stryMutAct_9fa48("18709") ? filterCategory === 'all' : stryMutAct_9fa48("18708") ? true : (stryCov_9fa48("18708", "18709"), filterCategory !== 'all')) && (stryMutAct_9fa48("18712") ? p.category === filterCategory : stryMutAct_9fa48("18711") ? true : (stryCov_9fa48("18711", "18712"), p.category !== filterCategory)))) {
      return stryMutAct_9fa48("18714") ? true : (stryCov_9fa48("18714"), false);
    }
    if (stryMutAct_9fa48("18717") ? filterHorizon !== 'all' || p.horizon !== filterHorizon : stryMutAct_9fa48("18716") ? false : stryMutAct_9fa48("18715") ? true : (stryCov_9fa48("18715", "18716", "18717"), (stryMutAct_9fa48("18719") ? filterHorizon === 'all' : stryMutAct_9fa48("18718") ? true : (stryCov_9fa48("18718", "18719"), filterHorizon !== 'all')) && (stryMutAct_9fa48("18722") ? p.horizon === filterHorizon : stryMutAct_9fa48("18721") ? true : (stryCov_9fa48("18721", "18722"), p.horizon !== filterHorizon)))) {
      return stryMutAct_9fa48("18724") ? true : (stryCov_9fa48("18724"), false);
    }
    if (stryMutAct_9fa48("18727") ? filterStatus !== 'all' || p.status !== filterStatus : stryMutAct_9fa48("18726") ? false : stryMutAct_9fa48("18725") ? true : (stryCov_9fa48("18725", "18726", "18727"), (stryMutAct_9fa48("18729") ? filterStatus === 'all' : stryMutAct_9fa48("18728") ? true : (stryCov_9fa48("18728", "18729"), filterStatus !== 'all')) && (stryMutAct_9fa48("18732") ? p.status === filterStatus : stryMutAct_9fa48("18731") ? true : (stryCov_9fa48("18731", "18732"), p.status !== filterStatus)))) {
      return stryMutAct_9fa48("18734") ? true : (stryCov_9fa48("18734"), false);
    }
    return stryMutAct_9fa48("18735") ? false : (stryCov_9fa48("18735"), true);
  }));
  const projectsByCategory = categories.reduce((acc, cat) => {
    acc[cat] = stryMutAct_9fa48("18737") ? filteredProjects : (stryCov_9fa48("18737"), filteredProjects.filter(stryMutAct_9fa48("18738") ? () => undefined : (stryCov_9fa48("18738"), p => stryMutAct_9fa48("18741") ? p.category !== cat : stryMutAct_9fa48("18740") ? false : stryMutAct_9fa48("18739") ? true : (stryCov_9fa48("18739", "18740", "18741"), p.category === cat))));
    return acc;
  }, {} as Record<ResearchCategory, ResearchProject[]>);
  return <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-purple-800/50 bg-black/20 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={stryMutAct_9fa48("18742") ? () => undefined : (stryCov_9fa48("18742"), () => navigate('/admin'))} className="text-white/60 hover:text-white transition-colors">
                ← Admin
              </button>
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-3">
                  <span className="text-3xl">🔬</span>
                  Cendia R&D Lab
                  <span className="text-xs bg-gradient-to-r from-purple-500 to-pink-500 px-2 py-0.5 rounded-full font-medium">
                    HORIZON 3+
                  </span>
                </h1>
                <p className="text-purple-300 text-sm">Future Technologies • Speculative Projects • Long-Term Vision</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-sm text-white/60">
                {filteredProjects.length} projects
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="bg-black/20 border-b border-purple-800/30">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex flex-wrap items-center gap-4">
            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-white/50 uppercase">Category:</span>
              <select value={filterCategory} onChange={stryMutAct_9fa48("18744") ? () => undefined : (stryCov_9fa48("18744"), e => setFilterCategory(e.target.value as ResearchCategory | 'all'))} className="bg-black/30 border border-purple-700/50 rounded-lg px-3 py-1.5 text-sm">
                <option value="all">All Categories</option>
                {categories.map(stryMutAct_9fa48("18745") ? () => undefined : (stryCov_9fa48("18745"), cat => <option key={cat} value={cat}>{getCategoryIcon(cat)} {stryMutAct_9fa48("18746") ? cat.charAt(0).toUpperCase() - cat.slice(1) : (stryCov_9fa48("18746"), (stryMutAct_9fa48("18748") ? cat.toUpperCase() : stryMutAct_9fa48("18747") ? cat.charAt(0).toLowerCase() : (stryCov_9fa48("18747", "18748"), cat.charAt(0).toUpperCase())) + (stryMutAct_9fa48("18749") ? cat : (stryCov_9fa48("18749"), cat.slice(1))))}</option>))}
              </select>
            </div>

            {/* Horizon Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-white/50 uppercase">Horizon:</span>
              <select value={filterHorizon} onChange={stryMutAct_9fa48("18750") ? () => undefined : (stryCov_9fa48("18750"), e => setFilterHorizon(e.target.value as ResearchHorizon | 'all'))} className="bg-black/30 border border-purple-700/50 rounded-lg px-3 py-1.5 text-sm">
                <option value="all">All Horizons</option>
                {horizons.map(stryMutAct_9fa48("18751") ? () => undefined : (stryCov_9fa48("18751"), h => <option key={h} value={h}>{h}</option>))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-white/50 uppercase">Status:</span>
              <select value={filterStatus} onChange={stryMutAct_9fa48("18752") ? () => undefined : (stryCov_9fa48("18752"), e => setFilterStatus(e.target.value as ResearchStatus | 'all'))} className="bg-black/30 border border-purple-700/50 rounded-lg px-3 py-1.5 text-sm">
                <option value="all">All Statuses</option>
                {statuses.map(stryMutAct_9fa48("18753") ? () => undefined : (stryCov_9fa48("18753"), s => <option key={s} value={s}>{stryMutAct_9fa48("18754") ? s.charAt(0).toUpperCase() - s.slice(1) : (stryCov_9fa48("18754"), (stryMutAct_9fa48("18756") ? s.toUpperCase() : stryMutAct_9fa48("18755") ? s.charAt(0).toLowerCase() : (stryCov_9fa48("18755", "18756"), s.charAt(0).toUpperCase())) + (stryMutAct_9fa48("18757") ? s : (stryCov_9fa48("18757"), s.slice(1))))}</option>))}
              </select>
            </div>

            {/* Reset */}
            <button onClick={() => {
            setFilterCategory('all');
            setFilterHorizon('all');
            setFilterStatus('all');
          }} className="text-xs text-purple-400 hover:text-white transition-colors">
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-3 gap-6">
          {/* Project List */}
          <div className="col-span-2 space-y-6">
            {categories.map(category => {
            const projects = projectsByCategory[category];
            if (stryMutAct_9fa48("18765") ? projects.length !== 0 : stryMutAct_9fa48("18764") ? false : stryMutAct_9fa48("18763") ? true : (stryCov_9fa48("18763", "18764", "18765"), projects.length === 0)) {
              return null;
            }
            return <div key={category} className="bg-black/30 rounded-2xl p-6 border border-purple-800/50">
                  <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <span className="text-2xl">{getCategoryIcon(category)}</span>
                    {stryMutAct_9fa48("18767") ? category.charAt(0).toUpperCase() - category.slice(1) : (stryCov_9fa48("18767"), (stryMutAct_9fa48("18769") ? category.toUpperCase() : stryMutAct_9fa48("18768") ? category.charAt(0).toLowerCase() : (stryCov_9fa48("18768", "18769"), category.charAt(0).toUpperCase())) + (stryMutAct_9fa48("18770") ? category : (stryCov_9fa48("18770"), category.slice(1))))}
                    <span className="text-sm font-normal text-white/50">({projects.length})</span>
                  </h2>
                  
                  <div className="space-y-3">
                    {projects.map(stryMutAct_9fa48("18771") ? () => undefined : (stryCov_9fa48("18771"), project => <div key={project.id} onClick={stryMutAct_9fa48("18772") ? () => undefined : (stryCov_9fa48("18772"), () => setSelectedProject(project))} className={`p-4 rounded-xl cursor-pointer transition-all ${(stryMutAct_9fa48("18776") ? selectedProject?.id !== project.id : stryMutAct_9fa48("18775") ? false : stryMutAct_9fa48("18774") ? true : (stryCov_9fa48("18774", "18775", "18776"), (stryMutAct_9fa48("18777") ? selectedProject.id : (stryCov_9fa48("18777"), selectedProject?.id)) === project.id)) ? 'bg-purple-900/50 border border-purple-500' : 'bg-black/20 border border-transparent hover:border-purple-700/50'}`}>
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold">{project.name}</h3>
                            <p className="text-xs text-white/50">Codename: {project.codename}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(project.status)}`}>
                              {project.status}
                            </span>
                            <span className={`text-xs ${getHorizonColor(project.horizon)}`}>
                              {project.horizon}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-white/70 line-clamp-2">{project.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-white/50">
                          <span className={getRiskColor(project.riskLevel)}>
                            {stryMutAct_9fa48("18782") ? project.riskLevel.toLowerCase() : (stryCov_9fa48("18782"), project.riskLevel.toUpperCase())} RISK
                          </span>
                          <span>{project.estimatedInvestment}</span>
                        </div>
                      </div>))}
                  </div>
                </div>;
          })}
          </div>

          {/* Project Details */}
          <div className="col-span-1">
            {selectedProject ? <div className="bg-black/30 rounded-2xl p-6 border border-purple-800/50 sticky top-32">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold">{selectedProject.name}</h2>
                    <p className="text-sm text-purple-400">{selectedProject.codename}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(selectedProject.status)}`}>
                    {selectedProject.status}
                  </span>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-semibold text-white/50 uppercase mb-1">Description</h4>
                    <p className="text-sm text-white/80">{selectedProject.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-xs font-semibold text-white/50 uppercase mb-1">Horizon</h4>
                      <p className={`text-sm ${getHorizonColor(selectedProject.horizon)}`}>{selectedProject.horizon}</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-white/50 uppercase mb-1">Risk Level</h4>
                      <p className={`text-sm ${getRiskColor(selectedProject.riskLevel)}`}>{stryMutAct_9fa48("18786") ? selectedProject.riskLevel.toLowerCase() : (stryCov_9fa48("18786"), selectedProject.riskLevel.toUpperCase())}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold text-white/50 uppercase mb-1">Investment</h4>
                    <p className="text-sm text-amber-400">{selectedProject.estimatedInvestment}</p>
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold text-white/50 uppercase mb-1">Potential Value</h4>
                    <p className="text-sm text-green-400">{selectedProject.potentialValue}</p>
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold text-white/50 uppercase mb-2">Technical Challenges</h4>
                    <ul className="space-y-1">
                      {selectedProject.technicalChallenges.map(stryMutAct_9fa48("18787") ? () => undefined : (stryCov_9fa48("18787"), (challenge, i) => <li key={i} className="text-xs text-white/60 flex items-start gap-2">
                          <span className="text-red-400">•</span>
                          {challenge}
                        </li>))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold text-white/50 uppercase mb-2">Dependencies</h4>
                    <ul className="space-y-1">
                      {selectedProject.dependencies.map(stryMutAct_9fa48("18788") ? () => undefined : (stryCov_9fa48("18788"), (dep, i) => <li key={i} className="text-xs text-white/60 flex items-start gap-2">
                          <span className="text-cyan-400">→</span>
                          {dep}
                        </li>))}
                    </ul>
                  </div>

                  {stryMutAct_9fa48("18791") ? selectedProject.principalInvestigator || <div>
                      <h4 className="text-xs font-semibold text-white/50 uppercase mb-1">Principal Investigator</h4>
                      <p className="text-sm">{selectedProject.principalInvestigator}</p>
                    </div> : stryMutAct_9fa48("18790") ? false : stryMutAct_9fa48("18789") ? true : (stryCov_9fa48("18789", "18790", "18791"), selectedProject.principalInvestigator && <div>
                      <h4 className="text-xs font-semibold text-white/50 uppercase mb-1">Principal Investigator</h4>
                      <p className="text-sm">{selectedProject.principalInvestigator}</p>
                    </div>)}

                  <div className="pt-4 border-t border-purple-800/30">
                    <h4 className="text-xs font-semibold text-white/50 uppercase mb-1">Notes</h4>
                    <p className="text-sm text-white/70 italic">{selectedProject.notes}</p>
                  </div>
                </div>
              </div> : <div className="bg-black/30 rounded-2xl p-6 border border-purple-800/50 text-center">
                <div className="text-4xl mb-4">🔬</div>
                <p className="text-white/50">Select a project to view details</p>
              </div>}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="mt-8 grid grid-cols-5 gap-4">
          <div className="bg-black/30 rounded-xl p-4 border border-purple-800/50 text-center">
            <div className="text-2xl font-bold text-purple-400">{RD_PROJECTS.length}</div>
            <div className="text-xs text-white/50">Total Projects</div>
          </div>
          <div className="bg-black/30 rounded-xl p-4 border border-purple-800/50 text-center">
            <div className="text-2xl font-bold text-amber-400">{stryMutAct_9fa48("18792") ? RD_PROJECTS.length : (stryCov_9fa48("18792"), RD_PROJECTS.filter(stryMutAct_9fa48("18793") ? () => undefined : (stryCov_9fa48("18793"), p => stryMutAct_9fa48("18796") ? p.status !== 'prototyping' : stryMutAct_9fa48("18795") ? false : stryMutAct_9fa48("18794") ? true : (stryCov_9fa48("18794", "18795", "18796"), p.status === 'prototyping'))).length)}</div>
            <div className="text-xs text-white/50">In Prototyping</div>
          </div>
          <div className="bg-black/30 rounded-xl p-4 border border-purple-800/50 text-center">
            <div className="text-2xl font-bold text-green-400">{stryMutAct_9fa48("18798") ? RD_PROJECTS.length : (stryCov_9fa48("18798"), RD_PROJECTS.filter(stryMutAct_9fa48("18799") ? () => undefined : (stryCov_9fa48("18799"), p => stryMutAct_9fa48("18802") ? p.horizon !== '2025-2027' : stryMutAct_9fa48("18801") ? false : stryMutAct_9fa48("18800") ? true : (stryCov_9fa48("18800", "18801", "18802"), p.horizon === '2025-2027'))).length)}</div>
            <div className="text-xs text-white/50">Near-Term (2025-27)</div>
          </div>
          <div className="bg-black/30 rounded-xl p-4 border border-purple-800/50 text-center">
            <div className="text-2xl font-bold text-red-400">{stryMutAct_9fa48("18804") ? RD_PROJECTS.length : (stryCov_9fa48("18804"), RD_PROJECTS.filter(stryMutAct_9fa48("18805") ? () => undefined : (stryCov_9fa48("18805"), p => stryMutAct_9fa48("18808") ? p.riskLevel !== 'extreme' : stryMutAct_9fa48("18807") ? false : stryMutAct_9fa48("18806") ? true : (stryCov_9fa48("18806", "18807", "18808"), p.riskLevel === 'extreme'))).length)}</div>
            <div className="text-xs text-white/50">Extreme Risk</div>
          </div>
          <div className="bg-black/30 rounded-xl p-4 border border-purple-800/50 text-center">
            <div className="text-2xl font-bold text-cyan-400">$500M+</div>
            <div className="text-xs text-white/50">Est. Total Investment</div>
          </div>
        </div>
      </div>
    </div>;
};
export default RDLabPage;