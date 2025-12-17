// @ts-nocheck
// =============================================================================
// DATACENDIA - PRODUCT PAGE
// Premium dark theme
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
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../../lib/utils';
import { ArrowRight } from 'lucide-react';

// Particle field background
const ParticleField: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (stryMutAct_9fa48("55274") ? false : stryMutAct_9fa48("55273") ? true : stryMutAct_9fa48("55272") ? canvas : (stryCov_9fa48("55272", "55273", "55274"), !canvas)) return;
    const ctx = canvas.getContext('2d');
    if (stryMutAct_9fa48("55278") ? false : stryMutAct_9fa48("55277") ? true : stryMutAct_9fa48("55276") ? ctx : (stryCov_9fa48("55276", "55277", "55278"), !ctx)) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
    }[] = stryMutAct_9fa48("55279") ? ["Stryker was here"] : (stryCov_9fa48("55279"), []);
    for (let i = 0; stryMutAct_9fa48("55282") ? i >= 30 : stryMutAct_9fa48("55281") ? i <= 30 : stryMutAct_9fa48("55280") ? false : (stryCov_9fa48("55280", "55281", "55282"), i < 30); stryMutAct_9fa48("55283") ? i-- : (stryCov_9fa48("55283"), i++)) {
      particles.push(stryMutAct_9fa48("55285") ? {} : (stryCov_9fa48("55285"), {
        x: stryMutAct_9fa48("55286") ? Math.random() / canvas.width : (stryCov_9fa48("55286"), Math.random() * canvas.width),
        y: stryMutAct_9fa48("55287") ? Math.random() / canvas.height : (stryCov_9fa48("55287"), Math.random() * canvas.height),
        vx: stryMutAct_9fa48("55288") ? (Math.random() - 0.5) / 0.2 : (stryCov_9fa48("55288"), (stryMutAct_9fa48("55289") ? Math.random() + 0.5 : (stryCov_9fa48("55289"), Math.random() - 0.5)) * 0.2),
        vy: stryMutAct_9fa48("55290") ? (Math.random() - 0.5) / 0.2 : (stryCov_9fa48("55290"), (stryMutAct_9fa48("55291") ? Math.random() + 0.5 : (stryCov_9fa48("55291"), Math.random() - 0.5)) * 0.2),
        size: stryMutAct_9fa48("55292") ? Math.random() * 2 - 0.5 : (stryCov_9fa48("55292"), (stryMutAct_9fa48("55293") ? Math.random() / 2 : (stryCov_9fa48("55293"), Math.random() * 2)) + 0.5),
        opacity: stryMutAct_9fa48("55294") ? Math.random() * 0.3 - 0.1 : (stryCov_9fa48("55294"), (stryMutAct_9fa48("55295") ? Math.random() / 0.3 : (stryCov_9fa48("55295"), Math.random() * 0.3)) + 0.1)
      }));
    }
    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        stryMutAct_9fa48("55298") ? p.x -= p.vx : (stryCov_9fa48("55298"), p.x += p.vx);
        stryMutAct_9fa48("55299") ? p.y -= p.vy : (stryCov_9fa48("55299"), p.y += p.vy);
        if (stryMutAct_9fa48("55303") ? p.x >= 0 : stryMutAct_9fa48("55302") ? p.x <= 0 : stryMutAct_9fa48("55301") ? false : stryMutAct_9fa48("55300") ? true : (stryCov_9fa48("55300", "55301", "55302", "55303"), p.x < 0)) p.x = canvas.width;
        if (stryMutAct_9fa48("55307") ? p.x <= canvas.width : stryMutAct_9fa48("55306") ? p.x >= canvas.width : stryMutAct_9fa48("55305") ? false : stryMutAct_9fa48("55304") ? true : (stryCov_9fa48("55304", "55305", "55306", "55307"), p.x > canvas.width)) p.x = 0;
        if (stryMutAct_9fa48("55311") ? p.y >= 0 : stryMutAct_9fa48("55310") ? p.y <= 0 : stryMutAct_9fa48("55309") ? false : stryMutAct_9fa48("55308") ? true : (stryCov_9fa48("55308", "55309", "55310", "55311"), p.y < 0)) p.y = canvas.height;
        if (stryMutAct_9fa48("55315") ? p.y <= canvas.height : stryMutAct_9fa48("55314") ? p.y >= canvas.height : stryMutAct_9fa48("55313") ? false : stryMutAct_9fa48("55312") ? true : (stryCov_9fa48("55312", "55313", "55314", "55315"), p.y > canvas.height)) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, stryMutAct_9fa48("55316") ? Math.PI / 2 : (stryCov_9fa48("55316"), Math.PI * 2));
        ctx.fillStyle = `rgba(127, 29, 29, ${p.opacity})`;
        ctx.fill();
      });
      animationId = requestAnimationFrame(animate);
    };
    animate();
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, stryMutAct_9fa48("55322") ? ["Stryker was here"] : (stryCov_9fa48("55322"), []));
  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
};

// =============================================================================
// PRODUCT FEATURES DATA
// =============================================================================

const products = stryMutAct_9fa48("55323") ? [] : (stryCov_9fa48("55323"), [stryMutAct_9fa48("55324") ? {} : (stryCov_9fa48("55324"), {
  id: 'council',
  name: 'The Council™',
  tagline: 'AI-Powered Strategic Advisory',
  description: 'Consult with a pantheon of specialized AI agents who reason across your entire organization. Get strategic insights from CendiaChief™, CendiaCFO™, CendiaCOO™, and more.',
  icon: '🧠',
  color: '#6366F1',
  features: stryMutAct_9fa48("55331") ? [] : (stryCov_9fa48("55331"), ['Multi-agent deliberation with consensus building', 'Domain-specific AI experts (Finance, Operations, Security, etc.)', 'Real-time streaming responses with citations', 'Confidence scoring and dissent tracking', 'Full audit trail of all decisions']),
  useCases: stryMutAct_9fa48("55337") ? [] : (stryCov_9fa48("55337"), ['Strategic planning and scenario analysis', 'Cross-functional decision support', 'Risk assessment and mitigation', 'Resource allocation optimization']),
  screenshot: '/screenshots/council.png'
}), stryMutAct_9fa48("55343") ? {} : (stryCov_9fa48("55343"), {
  id: 'apotheosis',
  name: 'CendiaApotheosis™',
  tagline: 'Organizational Superintelligence',
  description: 'Nightly red-teaming that attacks your AI systems, auto-patches vulnerabilities, and upskills your team. Achieve an Apotheosis Score™ above 95 for enterprise-grade AI resilience.',
  icon: '⚡',
  color: '#F59E0B',
  features: stryMutAct_9fa48("55350") ? [] : (stryCov_9fa48("55350"), ['Automated red-team attacks on your AI systems', 'Self-healing with reversible auto-patches', 'Human escalation for critical decisions', 'Pattern banning to prevent repeat failures', 'Upskill assignments for team development']),
  useCases: stryMutAct_9fa48("55356") ? [] : (stryCov_9fa48("55356"), ['AI security hardening', 'Continuous improvement of decision quality', 'Compliance with AI governance frameworks', 'Enterprise superintelligence certification']),
  screenshot: '/screenshots/apotheosis.png'
}), stryMutAct_9fa48("55362") ? {} : (stryCov_9fa48("55362"), {
  id: 'dissent',
  name: 'CendiaDissent™',
  tagline: 'Protected Disagreement',
  description: 'File formal dissent against AI recommendations with full retaliation protection. Track outcomes to prove when dissenters were right.',
  icon: '⚖️',
  color: '#DC2626',
  features: stryMutAct_9fa48("55369") ? [] : (stryCov_9fa48("55369"), ['Formal dissent filing with evidence upload', 'Anonymous and protected channels', 'Outcome verification and accuracy tracking', 'High-accuracy dissenter recognition', 'Retaliation monitoring and protection']),
  useCases: stryMutAct_9fa48("55375") ? [] : (stryCov_9fa48("55375"), ['Ensuring human oversight of AI decisions', 'Building organizational learning culture', 'Regulatory compliance for AI governance', 'Identifying high-value contrarian thinkers']),
  screenshot: '/screenshots/dissent.png'
}), stryMutAct_9fa48("55381") ? {} : (stryCov_9fa48("55381"), {
  id: 'omnitranslate',
  name: 'CendiaOmniTranslate™',
  tagline: '100+ Languages, Zero Friction',
  description: 'Enterprise-grade AI translation supporting 100+ languages with context-aware business terminology, glossary management, and translation memory.',
  icon: '🌐',
  color: '#0EA5E9',
  features: stryMutAct_9fa48("55388") ? [] : (stryCov_9fa48("55388"), ['100+ languages including low-resource languages', 'RTL language support (Arabic, Hebrew, Urdu)', 'Enterprise glossary management', 'Translation memory for consistency', 'Document and decision translation']),
  useCases: stryMutAct_9fa48("55394") ? [] : (stryCov_9fa48("55394"), ['Global team collaboration', 'Multilingual customer support', 'Cross-border compliance documentation', 'International executive summaries']),
  screenshot: '/screenshots/omnitranslate.png'
}), stryMutAct_9fa48("55400") ? {} : (stryCov_9fa48("55400"), {
  id: 'pulse',
  name: 'CendiaPulse™',
  tagline: 'Organization Health at a Glance',
  description: 'Real-time visibility into your organization\'s vital signs. Monitor data health, operations, security, and people metrics with instant alerts.',
  icon: '💓',
  color: '#EF4444',
  features: stryMutAct_9fa48("55407") ? [] : (stryCov_9fa48("55407"), ['Unified health score across 4 dimensions', 'Real-time alert management and escalation', 'Trend analysis and anomaly detection', 'System status monitoring', 'Custom threshold configuration']),
  useCases: stryMutAct_9fa48("55413") ? [] : (stryCov_9fa48("55413"), ['Executive dashboards and reporting', 'Operational monitoring', 'Compliance tracking', 'Incident response coordination']),
  screenshot: '/screenshots/pulse.png'
}), stryMutAct_9fa48("55419") ? {} : (stryCov_9fa48("55419"), {
  id: 'lens',
  name: 'CendiaLens™',
  tagline: 'See Possible Futures',
  description: 'AI-powered forecasting and what-if analysis. Model different scenarios and understand the impact of decisions before you make them.',
  icon: '🔮',
  color: '#8B5CF6',
  features: stryMutAct_9fa48("55426") ? [] : (stryCov_9fa48("55426"), ['ML-powered forecasting with confidence intervals', 'What-if scenario modeling', 'Sensitivity analysis', 'Automated forecast accuracy tracking', 'Multi-variable projections']),
  useCases: stryMutAct_9fa48("55432") ? [] : (stryCov_9fa48("55432"), ['Revenue and cash flow forecasting', 'Demand planning', 'Budget scenario modeling', 'Risk quantification']),
  screenshot: '/screenshots/lens.png'
}), stryMutAct_9fa48("55438") ? {} : (stryCov_9fa48("55438"), {
  id: 'bridge',
  name: 'CendiaBridge™',
  tagline: 'Automate Everything',
  description: 'Visual workflow builder that connects your systems, automates processes, and ensures nothing falls through the cracks.',
  icon: '🌉',
  color: '#10B981',
  features: stryMutAct_9fa48("55445") ? [] : (stryCov_9fa48("55445"), ['Drag-and-drop workflow builder', 'Pre-built integration connectors', 'Human-in-the-loop approvals', 'Real-time execution monitoring', 'Error handling and retry logic']),
  useCases: stryMutAct_9fa48("55451") ? [] : (stryCov_9fa48("55451"), ['Month-end close automation', 'Vendor onboarding workflows', 'Approval routing', 'Data pipeline orchestration']),
  screenshot: '/screenshots/bridge.png'
}), stryMutAct_9fa48("55457") ? {} : (stryCov_9fa48("55457"), {
  id: 'graph',
  name: 'CendiaGraph™',
  tagline: 'Your Data Universe, Visualized',
  description: 'Interactive knowledge graph that maps every entity, relationship, and data flow in your organization. Understand lineage, impact, and dependencies instantly.',
  icon: '🕸️',
  color: '#06B6D4',
  features: stryMutAct_9fa48("55464") ? [] : (stryCov_9fa48("55464"), ['Interactive graph visualization', 'Data lineage tracking', 'Impact analysis', 'Entity relationship mapping', 'Search and filter capabilities']),
  useCases: stryMutAct_9fa48("55470") ? [] : (stryCov_9fa48("55470"), ['Data governance and cataloging', 'Change impact assessment', 'Compliance documentation', 'Data discovery']),
  screenshot: '/screenshots/graph.png'
})]);
const integrations = stryMutAct_9fa48("55476") ? [] : (stryCov_9fa48("55476"), [stryMutAct_9fa48("55477") ? {} : (stryCov_9fa48("55477"), {
  name: 'PostgreSQL',
  icon: '🐘',
  category: 'Database'
}), stryMutAct_9fa48("55481") ? {} : (stryCov_9fa48("55481"), {
  name: 'MySQL',
  icon: '🐬',
  category: 'Database'
}), stryMutAct_9fa48("55485") ? {} : (stryCov_9fa48("55485"), {
  name: 'MongoDB',
  icon: '🍃',
  category: 'Database'
}), stryMutAct_9fa48("55489") ? {} : (stryCov_9fa48("55489"), {
  name: 'Oracle',
  icon: '🔴',
  category: 'Database'
}), stryMutAct_9fa48("55493") ? {} : (stryCov_9fa48("55493"), {
  name: 'SQL Server',
  icon: '🔷',
  category: 'Database'
}), stryMutAct_9fa48("55497") ? {} : (stryCov_9fa48("55497"), {
  name: 'IBM DB2',
  icon: '🔵',
  category: 'Database'
}), stryMutAct_9fa48("55501") ? {} : (stryCov_9fa48("55501"), {
  name: 'Snowflake',
  icon: '❄️',
  category: 'Data Warehouse'
}), stryMutAct_9fa48("55505") ? {} : (stryCov_9fa48("55505"), {
  name: 'Salesforce',
  icon: '☁️',
  category: 'CRM'
}), stryMutAct_9fa48("55509") ? {} : (stryCov_9fa48("55509"), {
  name: 'SAP',
  icon: '📊',
  category: 'ERP'
}), stryMutAct_9fa48("55513") ? {} : (stryCov_9fa48("55513"), {
  name: 'Slack',
  icon: '💬',
  category: 'Communication'
}), stryMutAct_9fa48("55517") ? {} : (stryCov_9fa48("55517"), {
  name: 'AWS',
  icon: '☁️',
  category: 'Cloud'
}), stryMutAct_9fa48("55521") ? {} : (stryCov_9fa48("55521"), {
  name: 'Azure',
  icon: '🔷',
  category: 'Cloud'
})]);

// =============================================================================
// COMPONENTS
// =============================================================================

const ProductCard: React.FC<{
  product: typeof products[0];
  isExpanded: boolean;
  onToggle: () => void;
}> = ({
  product,
  isExpanded,
  onToggle
}) => {
  return <div className={cn('bg-black/50 backdrop-blur-sm border transition-all duration-300 rounded', isExpanded ? 'border-red-900/50' : 'border-gray-800 hover:border-gray-700')}>
      {/* Header */}
      <div className="p-6 cursor-pointer" onClick={onToggle}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded flex items-center justify-center text-2xl border border-gray-800" style={stryMutAct_9fa48("55529") ? {} : (stryCov_9fa48("55529"), {
            backgroundColor: `${product.color}10`
          })}>
              {product.icon}
            </div>
            <div>
              <h3 className="text-lg font-medium text-white">{product.name}</h3>
              <p className="text-xs text-gray-500">{product.tagline}</p>
            </div>
          </div>
          <button className={cn('w-6 h-6 rounded flex items-center justify-center transition-transform text-xs', stryMutAct_9fa48("55534") ? isExpanded || 'rotate-180' : stryMutAct_9fa48("55533") ? false : stryMutAct_9fa48("55532") ? true : (stryCov_9fa48("55532", "55533", "55534"), isExpanded && 'rotate-180'))} style={stryMutAct_9fa48("55536") ? {} : (stryCov_9fa48("55536"), {
          color: product.color
        })}>
            ▼
          </button>
        </div>
        <p className="mt-4 text-gray-500 text-sm">{product.description}</p>
      </div>

      {/* Expanded Content */}
      {stryMutAct_9fa48("55539") ? isExpanded || <div className="px-6 pb-6 border-t border-gray-800">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
            {/* Features */}
            <div>
              <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-4">
                Key Features
              </h4>
              <ul className="space-y-3">
                {product.features.map((feature, idx) => <li key={idx} className="flex items-start gap-3">
                    <span className="mt-0.5 w-4 h-4 rounded flex items-center justify-center text-[10px] text-white flex-shrink-0" style={{
                backgroundColor: product.color
              }}>
                      ✓
                    </span>
                    <span className="text-gray-400 text-sm">{feature}</span>
                  </li>)}
              </ul>
            </div>

            {/* Use Cases */}
            <div>
              <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-4">
                Use Cases
              </h4>
              <ul className="space-y-3">
                {product.useCases.map((useCase, idx) => <li key={idx} className="flex items-start gap-3">
                    <span className="text-gray-600">→</span>
                    <span className="text-gray-400 text-sm">{useCase}</span>
                  </li>)}
              </ul>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-6 pt-6 border-t border-gray-800 flex items-center justify-between">
            <Link to="/sovereign" className="text-sm hover:underline" style={{
          color: product.color
        }}>
              See {product.name} in action →
            </Link>
            <Link to={`/cortex/${product.id === 'graph' ? 'graph' : product.id === 'council' ? 'council' : product.id === 'pulse' ? 'pulse' : product.id === 'lens' ? 'lens' : 'bridge'}`} className="px-4 py-2 rounded text-sm text-white transition-colors border" style={{
          borderColor: `${product.color}50`,
          backgroundColor: `${product.color}20`
        }}>
              Try It Now
            </Link>
          </div>
        </div> : stryMutAct_9fa48("55538") ? false : stryMutAct_9fa48("55537") ? true : (stryCov_9fa48("55537", "55538", "55539"), isExpanded && <div className="px-6 pb-6 border-t border-gray-800">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
            {/* Features */}
            <div>
              <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-4">
                Key Features
              </h4>
              <ul className="space-y-3">
                {product.features.map(stryMutAct_9fa48("55540") ? () => undefined : (stryCov_9fa48("55540"), (feature, idx) => <li key={idx} className="flex items-start gap-3">
                    <span className="mt-0.5 w-4 h-4 rounded flex items-center justify-center text-[10px] text-white flex-shrink-0" style={stryMutAct_9fa48("55541") ? {} : (stryCov_9fa48("55541"), {
                backgroundColor: product.color
              })}>
                      ✓
                    </span>
                    <span className="text-gray-400 text-sm">{feature}</span>
                  </li>))}
              </ul>
            </div>

            {/* Use Cases */}
            <div>
              <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-4">
                Use Cases
              </h4>
              <ul className="space-y-3">
                {product.useCases.map(stryMutAct_9fa48("55542") ? () => undefined : (stryCov_9fa48("55542"), (useCase, idx) => <li key={idx} className="flex items-start gap-3">
                    <span className="text-gray-600">→</span>
                    <span className="text-gray-400 text-sm">{useCase}</span>
                  </li>))}
              </ul>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-6 pt-6 border-t border-gray-800 flex items-center justify-between">
            <Link to="/sovereign" className="text-sm hover:underline" style={stryMutAct_9fa48("55543") ? {} : (stryCov_9fa48("55543"), {
          color: product.color
        })}>
              See {product.name} in action →
            </Link>
            <Link to={`/cortex/${(stryMutAct_9fa48("55547") ? product.id !== 'graph' : stryMutAct_9fa48("55546") ? false : stryMutAct_9fa48("55545") ? true : (stryCov_9fa48("55545", "55546", "55547"), product.id === 'graph')) ? 'graph' : (stryMutAct_9fa48("55552") ? product.id !== 'council' : stryMutAct_9fa48("55551") ? false : stryMutAct_9fa48("55550") ? true : (stryCov_9fa48("55550", "55551", "55552"), product.id === 'council')) ? 'council' : (stryMutAct_9fa48("55557") ? product.id !== 'pulse' : stryMutAct_9fa48("55556") ? false : stryMutAct_9fa48("55555") ? true : (stryCov_9fa48("55555", "55556", "55557"), product.id === 'pulse')) ? 'pulse' : (stryMutAct_9fa48("55562") ? product.id !== 'lens' : stryMutAct_9fa48("55561") ? false : stryMutAct_9fa48("55560") ? true : (stryCov_9fa48("55560", "55561", "55562"), product.id === 'lens')) ? 'lens' : 'bridge'}`} className="px-4 py-2 rounded text-sm text-white transition-colors border" style={stryMutAct_9fa48("55566") ? {} : (stryCov_9fa48("55566"), {
          borderColor: `${product.color}50`,
          backgroundColor: `${product.color}20`
        })}>
              Try It Now
            </Link>
          </div>
        </div>)}
    </div>;
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const ProductPage: React.FC = () => {
  const [expandedProduct, setExpandedProduct] = useState<string | null>('council');
  return <div className="min-h-screen bg-black text-white font-light antialiased selection:bg-red-900/30 relative overflow-hidden">
      <ParticleField />
      <div className="fixed inset-0 pointer-events-none z-10 opacity-[0.02]" style={stryMutAct_9fa48("55571") ? {} : (stryCov_9fa48("55571"), {
      backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)'
    })} />
      <div className="fixed inset-0 pointer-events-none z-10" style={stryMutAct_9fa48("55573") ? {} : (stryCov_9fa48("55573"), {
      background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.4) 100%)'
    })} />

      {/* Navigation */}
      <nav className="relative z-30 border-b border-gray-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/sovereign" className="text-xl font-extralight tracking-[0.2em] text-white hover:text-red-100 transition-colors">
              DATACENDIA
            </Link>
            
            <div className="hidden md:flex items-center gap-8">
              <Link to="/sovereign" className="text-xs tracking-[0.15em] text-gray-500 hover:text-white transition-colors">SOVEREIGN</Link>
              <Link to="/honesty" className="text-xs tracking-[0.15em] text-gray-500 hover:text-white transition-colors">HONESTY</Link>
              <Link to="/product" className="text-xs tracking-[0.15em] text-red-900">PRODUCT</Link>
              <Link to="/pricing" className="text-xs tracking-[0.15em] text-gray-500 hover:text-white transition-colors">PRICING</Link>
            </div>
            
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-xs tracking-[0.15em] text-gray-500 hover:text-white transition-colors">SIGN IN</Link>
              <Link to="/sovereign" className="px-4 py-2 border border-red-900/50 text-xs tracking-[0.15em] text-white hover:bg-red-900/10 transition-all">REQUEST ACCESS</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-20 py-24">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <p className="text-xs tracking-[0.4em] text-gray-600 uppercase mb-6">SOVEREIGN INTELLIGENCE PLATFORM</p>
          <h1 className="text-4xl md:text-5xl font-extralight tracking-[0.05em] mb-6">
            Enterprise Modules.<br /><span className="text-gray-400">One Unified Platform.</span>
          </h1>
          <p className="text-lg text-gray-400 font-light max-w-2xl mx-auto mb-8">
            Datacendia™ unifies your data, empowers your teams with AI advisors, and automates 
            your workflows—all while keeping your intelligence sovereign and secure.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link to="/sovereign" className="group px-8 py-4 border-2 border-red-900 bg-black hover:bg-red-900/10 transition-all flex items-center gap-3">
              <span className="text-sm tracking-[0.2em] text-white">Request Access</span>
              <ArrowRight className="w-4 h-4 text-red-800 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/login" className="px-8 py-4 border border-gray-800 text-sm tracking-[0.2em] text-gray-400 hover:text-white hover:border-gray-700 transition-all">Start Free Trial</Link>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="relative z-20 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-light text-white mb-4">
              Explore the Platform
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Each module is powerful on its own. Together, they create an intelligence 
              system that transforms how your organization operates.
            </p>
          </div>

          <div className="space-y-4">
            {products.map(stryMutAct_9fa48("55575") ? () => undefined : (stryCov_9fa48("55575"), product => <ProductCard key={product.id} product={product} isExpanded={stryMutAct_9fa48("55578") ? expandedProduct !== product.id : stryMutAct_9fa48("55577") ? false : stryMutAct_9fa48("55576") ? true : (stryCov_9fa48("55576", "55577", "55578"), expandedProduct === product.id)} onToggle={stryMutAct_9fa48("55579") ? () => undefined : (stryCov_9fa48("55579"), () => setExpandedProduct((stryMutAct_9fa48("55582") ? expandedProduct !== product.id : stryMutAct_9fa48("55581") ? false : stryMutAct_9fa48("55580") ? true : (stryCov_9fa48("55580", "55581", "55582"), expandedProduct === product.id)) ? null : product.id))} />))}
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section className="relative z-20 py-20 border-t border-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs tracking-[0.3em] text-gray-600 uppercase mb-4">ZERO-COPY ARCHITECTURE</p>
            <h2 className="text-2xl font-light text-white mb-4">
              Connect to Any Database
            </h2>
            <p className="text-gray-500">
              Data never has to leave your infrastructure.
            </p>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {integrations.map(stryMutAct_9fa48("55583") ? () => undefined : (stryCov_9fa48("55583"), (integration, idx) => <div key={idx} className="p-4 bg-gray-900/50 border border-gray-800 rounded text-center hover:border-red-900/30 transition-colors">
                <span className="text-2xl mb-2 block">{integration.icon}</span>
                <p className="font-medium text-white text-sm">{integration.name}</p>
                <p className="text-xs text-gray-600">{integration.category}</p>
              </div>))}
          </div>

          <p className="text-center text-gray-600 mt-8 text-sm">
            + Client-hosted, hybrid sync, and zero-copy modes available
          </p>
        </div>
      </section>

      {/* Security */}
      <section className="relative z-20 py-20 border-t border-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs tracking-[0.3em] text-gray-600 uppercase mb-4">ENTERPRISE SECURITY</p>
              <h2 className="text-2xl font-light text-white mb-6">
                Your Data Never Leaves Your Control
              </h2>
              <p className="text-gray-500 mb-8">
                Datacendia is built with security and compliance at its core.
              </p>
              <ul className="space-y-4">
                {(stryMutAct_9fa48("55584") ? [] : (stryCov_9fa48("55584"), [stryMutAct_9fa48("55585") ? {} : (stryCov_9fa48("55585"), {
                icon: '🔒',
                text: 'SOC 2 Type II Certified'
              }), stryMutAct_9fa48("55588") ? {} : (stryCov_9fa48("55588"), {
                icon: '🏠',
                text: 'Self-hosted or private cloud deployment'
              }), stryMutAct_9fa48("55591") ? {} : (stryCov_9fa48("55591"), {
                icon: '🔐',
                text: 'End-to-end encryption at rest and in transit'
              }), stryMutAct_9fa48("55594") ? {} : (stryCov_9fa48("55594"), {
                icon: '📋',
                text: 'GDPR, HIPAA, and CCPA compliant'
              }), stryMutAct_9fa48("55597") ? {} : (stryCov_9fa48("55597"), {
                icon: '🕵️',
                text: 'Complete audit logging'
              })])).map(stryMutAct_9fa48("55600") ? () => undefined : (stryCov_9fa48("55600"), (item, idx) => <li key={idx} className="flex items-center gap-3 text-gray-400">
                    <span className="text-lg">{item.icon}</span>
                    <span className="text-sm">{item.text}</span>
                  </li>))}
              </ul>
            </div>
            <div className="bg-gray-900/50 border border-gray-800 rounded p-8 text-center">
              <div className="text-5xl mb-4">🛡️</div>
              <p className="text-lg font-light text-white mb-2">Data Sovereignty</p>
              <p className="text-gray-500 text-sm">
                Your AI models run locally. Your data stays in your infrastructure. 
                No data is ever shared with third parties.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-20 py-24 border-t border-gray-900">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-light text-white mb-4">
            Ready to Return Your Mind?
          </h2>
          <p className="text-gray-500 mb-8">
            Join the organizations that refuse to be tenants in their own house.
          </p>
          <Link to="/sovereign" className="group inline-flex px-10 py-5 border-2 border-red-900 bg-black hover:bg-red-900/10 transition-all items-center gap-3">
            <span className="text-sm tracking-[0.25em] text-white font-medium">Request Access</span>
            <ArrowRight className="w-4 h-4 text-red-800 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-20 py-16 px-6 border-t border-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h4 className="text-xs tracking-[0.2em] text-gray-500 mb-4">PLATFORM</h4>
              <ul className="space-y-2">
                <li><Link to="/product" className="text-sm text-gray-600 hover:text-white transition-colors">Product</Link></li>
                <li><Link to="/pricing" className="text-sm text-gray-600 hover:text-white transition-colors">Pricing</Link></li>
                <li><Link to="/honesty" className="text-sm text-gray-600 hover:text-white transition-colors">Honesty Matrices</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs tracking-[0.2em] text-gray-500 mb-4">RESOURCES</h4>
              <ul className="space-y-2">
                <li><Link to="/docs" className="text-sm text-gray-600 hover:text-white transition-colors">Documentation</Link></li>
                <li><Link to="/blog" className="text-sm text-gray-600 hover:text-white transition-colors">Blog</Link></li>
                <li><Link to="/changelog" className="text-sm text-gray-600 hover:text-white transition-colors">Changelog</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs tracking-[0.2em] text-gray-500 mb-4">COMPANY</h4>
              <ul className="space-y-2">
                <li><Link to="/about" className="text-sm text-gray-600 hover:text-white transition-colors">About</Link></li>
                <li><Link to="/security" className="text-sm text-gray-600 hover:text-white transition-colors">Security</Link></li>
                <li><Link to="/support" className="text-sm text-gray-600 hover:text-white transition-colors">Support</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs tracking-[0.2em] text-gray-500 mb-4">LEGAL</h4>
              <ul className="space-y-2">
                <li><Link to="/privacy" className="text-sm text-gray-600 hover:text-white transition-colors">Privacy</Link></li>
                <li><Link to="/terms" className="text-sm text-gray-600 hover:text-white transition-colors">Terms</Link></li>
                <li><Link to="/cookies" className="text-sm text-gray-600 hover:text-white transition-colors">Cookies</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-900 flex items-center justify-between text-[10px] text-gray-700 tracking-widest">
            <span>© {new Date().getFullYear()} DATACENDIA</span>
            <span>SOVEREIGN INTELLIGENCE</span>
          </div>
        </div>
      </footer>
    </div>;
};
export default ProductPage;