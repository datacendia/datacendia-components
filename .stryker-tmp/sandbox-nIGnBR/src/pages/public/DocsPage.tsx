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
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Book, Code, Server, Shield, Zap, Users, ArrowRight } from 'lucide-react';

// Particle field background
const ParticleField: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (stryMutAct_9fa48("52617") ? false : stryMutAct_9fa48("52616") ? true : stryMutAct_9fa48("52615") ? canvas : (stryCov_9fa48("52615", "52616", "52617"), !canvas)) return;
    const ctx = canvas.getContext('2d');
    if (stryMutAct_9fa48("52621") ? false : stryMutAct_9fa48("52620") ? true : stryMutAct_9fa48("52619") ? ctx : (stryCov_9fa48("52619", "52620", "52621"), !ctx)) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
    }[] = stryMutAct_9fa48("52622") ? ["Stryker was here"] : (stryCov_9fa48("52622"), []);
    for (let i = 0; stryMutAct_9fa48("52625") ? i >= 25 : stryMutAct_9fa48("52624") ? i <= 25 : stryMutAct_9fa48("52623") ? false : (stryCov_9fa48("52623", "52624", "52625"), i < 25); stryMutAct_9fa48("52626") ? i-- : (stryCov_9fa48("52626"), i++)) {
      particles.push(stryMutAct_9fa48("52628") ? {} : (stryCov_9fa48("52628"), {
        x: stryMutAct_9fa48("52629") ? Math.random() / canvas.width : (stryCov_9fa48("52629"), Math.random() * canvas.width),
        y: stryMutAct_9fa48("52630") ? Math.random() / canvas.height : (stryCov_9fa48("52630"), Math.random() * canvas.height),
        vx: stryMutAct_9fa48("52631") ? (Math.random() - 0.5) / 0.15 : (stryCov_9fa48("52631"), (stryMutAct_9fa48("52632") ? Math.random() + 0.5 : (stryCov_9fa48("52632"), Math.random() - 0.5)) * 0.15),
        vy: stryMutAct_9fa48("52633") ? (Math.random() - 0.5) / 0.15 : (stryCov_9fa48("52633"), (stryMutAct_9fa48("52634") ? Math.random() + 0.5 : (stryCov_9fa48("52634"), Math.random() - 0.5)) * 0.15),
        size: stryMutAct_9fa48("52635") ? Math.random() * 1.5 - 0.5 : (stryCov_9fa48("52635"), (stryMutAct_9fa48("52636") ? Math.random() / 1.5 : (stryCov_9fa48("52636"), Math.random() * 1.5)) + 0.5),
        opacity: stryMutAct_9fa48("52637") ? Math.random() * 0.25 - 0.05 : (stryCov_9fa48("52637"), (stryMutAct_9fa48("52638") ? Math.random() / 0.25 : (stryCov_9fa48("52638"), Math.random() * 0.25)) + 0.05)
      }));
    }
    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        stryMutAct_9fa48("52641") ? p.x -= p.vx : (stryCov_9fa48("52641"), p.x += p.vx);
        stryMutAct_9fa48("52642") ? p.y -= p.vy : (stryCov_9fa48("52642"), p.y += p.vy);
        if (stryMutAct_9fa48("52646") ? p.x >= 0 : stryMutAct_9fa48("52645") ? p.x <= 0 : stryMutAct_9fa48("52644") ? false : stryMutAct_9fa48("52643") ? true : (stryCov_9fa48("52643", "52644", "52645", "52646"), p.x < 0)) p.x = canvas.width;
        if (stryMutAct_9fa48("52650") ? p.x <= canvas.width : stryMutAct_9fa48("52649") ? p.x >= canvas.width : stryMutAct_9fa48("52648") ? false : stryMutAct_9fa48("52647") ? true : (stryCov_9fa48("52647", "52648", "52649", "52650"), p.x > canvas.width)) p.x = 0;
        if (stryMutAct_9fa48("52654") ? p.y >= 0 : stryMutAct_9fa48("52653") ? p.y <= 0 : stryMutAct_9fa48("52652") ? false : stryMutAct_9fa48("52651") ? true : (stryCov_9fa48("52651", "52652", "52653", "52654"), p.y < 0)) p.y = canvas.height;
        if (stryMutAct_9fa48("52658") ? p.y <= canvas.height : stryMutAct_9fa48("52657") ? p.y >= canvas.height : stryMutAct_9fa48("52656") ? false : stryMutAct_9fa48("52655") ? true : (stryCov_9fa48("52655", "52656", "52657", "52658"), p.y > canvas.height)) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, stryMutAct_9fa48("52659") ? Math.PI / 2 : (stryCov_9fa48("52659"), Math.PI * 2));
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
  }, stryMutAct_9fa48("52665") ? ["Stryker was here"] : (stryCov_9fa48("52665"), []));
  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
};
export const DocsPage: React.FC = () => {
  const docSections = stryMutAct_9fa48("52667") ? [] : (stryCov_9fa48("52667"), [stryMutAct_9fa48("52668") ? {} : (stryCov_9fa48("52668"), {
    icon: Zap,
    title: 'Getting Started',
    description: 'Quick start guide for new users',
    links: stryMutAct_9fa48("52671") ? [] : (stryCov_9fa48("52671"), [stryMutAct_9fa48("52672") ? {} : (stryCov_9fa48("52672"), {
      label: 'Platform Overview',
      href: '/cortex'
    }), stryMutAct_9fa48("52675") ? {} : (stryCov_9fa48("52675"), {
      label: 'First Login',
      href: '/login'
    }), stryMutAct_9fa48("52678") ? {} : (stryCov_9fa48("52678"), {
      label: 'Dashboard Tour',
      href: '/cortex/dashboard'
    })])
  }), stryMutAct_9fa48("52681") ? {} : (stryCov_9fa48("52681"), {
    icon: Book,
    title: 'Core Concepts',
    description: 'Understanding Decision Intelligence',
    links: stryMutAct_9fa48("52684") ? [] : (stryCov_9fa48("52684"), [stryMutAct_9fa48("52685") ? {} : (stryCov_9fa48("52685"), {
      label: 'Knowledge Graph',
      href: '/cortex/graph'
    }), stryMutAct_9fa48("52688") ? {} : (stryCov_9fa48("52688"), {
      label: 'AI Council',
      href: '/cortex/council'
    }), stryMutAct_9fa48("52691") ? {} : (stryCov_9fa48("52691"), {
      label: 'Chronos Timeline',
      href: '/cortex/intelligence/chronos'
    })])
  }), stryMutAct_9fa48("52694") ? {} : (stryCov_9fa48("52694"), {
    icon: Code,
    title: 'API Reference',
    description: 'REST API documentation',
    links: stryMutAct_9fa48("52697") ? [] : (stryCov_9fa48("52697"), [stryMutAct_9fa48("52698") ? {} : (stryCov_9fa48("52698"), {
      label: 'Authentication',
      href: '/cortex/security'
    }), stryMutAct_9fa48("52701") ? {} : (stryCov_9fa48("52701"), {
      label: 'Endpoints',
      href: '/cortex/data'
    }), stryMutAct_9fa48("52704") ? {} : (stryCov_9fa48("52704"), {
      label: 'Webhooks',
      href: '/cortex/bridge/integrations'
    })])
  }), stryMutAct_9fa48("52707") ? {} : (stryCov_9fa48("52707"), {
    icon: Server,
    title: 'Deployment',
    description: 'Installation and configuration',
    links: stryMutAct_9fa48("52710") ? [] : (stryCov_9fa48("52710"), [stryMutAct_9fa48("52711") ? {} : (stryCov_9fa48("52711"), {
      label: 'Docker Setup',
      href: '/contact'
    }), stryMutAct_9fa48("52714") ? {} : (stryCov_9fa48("52714"), {
      label: 'Air-Gapped Install',
      href: '/contact'
    }), stryMutAct_9fa48("52717") ? {} : (stryCov_9fa48("52717"), {
      label: 'Enterprise SSO',
      href: '/contact'
    })])
  }), stryMutAct_9fa48("52720") ? {} : (stryCov_9fa48("52720"), {
    icon: Shield,
    title: 'Security',
    description: 'Security architecture and compliance',
    links: stryMutAct_9fa48("52723") ? [] : (stryCov_9fa48("52723"), [stryMutAct_9fa48("52724") ? {} : (stryCov_9fa48("52724"), {
      label: 'Security Overview',
      href: '/security'
    }), stryMutAct_9fa48("52727") ? {} : (stryCov_9fa48("52727"), {
      label: 'Compliance',
      href: '/security'
    }), stryMutAct_9fa48("52730") ? {} : (stryCov_9fa48("52730"), {
      label: 'Audit Logs',
      href: '/cortex/security/audit'
    })])
  }), stryMutAct_9fa48("52733") ? {} : (stryCov_9fa48("52733"), {
    icon: Users,
    title: 'Administration',
    description: 'Managing users and settings',
    links: stryMutAct_9fa48("52736") ? [] : (stryCov_9fa48("52736"), [stryMutAct_9fa48("52737") ? {} : (stryCov_9fa48("52737"), {
      label: 'User Management',
      href: '/cortex/settings/users'
    }), stryMutAct_9fa48("52740") ? {} : (stryCov_9fa48("52740"), {
      label: 'Roles & Permissions',
      href: '/cortex/settings/roles'
    }), stryMutAct_9fa48("52743") ? {} : (stryCov_9fa48("52743"), {
      label: 'Organization Settings',
      href: '/cortex/settings/organization'
    })])
  })]);
  return <div className="min-h-screen bg-black text-white font-light antialiased selection:bg-red-900/30 relative overflow-hidden">
      <ParticleField />
      <div className="fixed inset-0 pointer-events-none z-10" style={stryMutAct_9fa48("52746") ? {} : (stryCov_9fa48("52746"), {
      background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.4) 100%)'
    })} />

      {/* Header */}
      <nav className="relative z-30 border-b border-gray-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between h-16">
          <Link to="/sovereign" className="text-xl font-extralight tracking-[0.2em] text-white hover:text-red-100 transition-colors">
            DATACENDIA
          </Link>
          <div className="flex items-center gap-8 text-xs tracking-[0.15em]">
            <Link to="/product" className="text-gray-500 hover:text-white transition-colors">PRODUCT</Link>
            <Link to="/pricing" className="text-gray-500 hover:text-white transition-colors">PRICING</Link>
            <Link to="/docs" className="text-red-900">DOCS</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-20 py-24">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <Book className="w-10 h-10 mx-auto mb-4 text-red-900" />
          <p className="text-xs tracking-[0.4em] text-gray-600 uppercase mb-6">KNOWLEDGE BASE</p>
          <h1 className="text-3xl font-extralight tracking-wide mb-4">Documentation</h1>
          <p className="text-gray-500">
            Everything you need to get started with the Datacendia platform.
          </p>
        </div>
      </section>

      {/* Doc Sections */}
      <section className="relative z-20 py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {docSections.map(stryMutAct_9fa48("52748") ? () => undefined : (stryCov_9fa48("52748"), (section, index) => <div key={index} className="bg-black/50 backdrop-blur-sm border border-gray-800 hover:border-red-900/30 rounded p-6 transition-colors">
                <section.icon className="w-6 h-6 text-red-900 mb-4" />
                <h2 className="text-lg font-medium text-white mb-2">{section.title}</h2>
                <p className="text-gray-500 text-sm mb-4">{section.description}</p>
                <ul className="space-y-2">
                  {section.links.map(stryMutAct_9fa48("52749") ? () => undefined : (stryCov_9fa48("52749"), (link, linkIndex) => <li key={linkIndex}>
                      <Link to={link.href} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
                        <ArrowRight className="w-3 h-3" />
                        {link.label}
                      </Link>
                    </li>))}
                </ul>
              </div>))}
          </div>
        </div>
      </section>

      {/* Contact for Full Docs */}
      <section className="relative z-20 py-16 border-t border-gray-900">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-xl font-light text-white mb-4">Need Full Documentation?</h2>
          <p className="text-gray-500 mb-8 text-sm">
            Complete API documentation and deployment guides are provided during onboarding for licensed customers.
          </p>
          <Link to="/sovereign" className="group inline-flex items-center gap-2 px-8 py-4 border-2 border-red-900 text-white text-sm tracking-wider hover:bg-red-900/10 transition-all">
            <span>Request Access</span>
            <ArrowRight className="w-4 h-4 text-red-800 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-20 py-12 border-t border-gray-900">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center text-[10px] text-gray-700 tracking-widest">
          <p>© {new Date().getFullYear()} DATACENDIA • SOVEREIGN INTELLIGENCE</p>
        </div>
      </footer>
    </div>;
};
export default DocsPage;