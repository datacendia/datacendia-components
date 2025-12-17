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
import { History, Sparkles, Bug, Zap, Shield, ArrowRight } from 'lucide-react';
const ParticleField: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (stryMutAct_9fa48("52437") ? false : stryMutAct_9fa48("52436") ? true : stryMutAct_9fa48("52435") ? canvas : (stryCov_9fa48("52435", "52436", "52437"), !canvas)) return;
    const ctx = canvas.getContext('2d');
    if (stryMutAct_9fa48("52441") ? false : stryMutAct_9fa48("52440") ? true : stryMutAct_9fa48("52439") ? ctx : (stryCov_9fa48("52439", "52440", "52441"), !ctx)) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
    }[] = stryMutAct_9fa48("52442") ? ["Stryker was here"] : (stryCov_9fa48("52442"), []);
    for (let i = 0; stryMutAct_9fa48("52445") ? i >= 25 : stryMutAct_9fa48("52444") ? i <= 25 : stryMutAct_9fa48("52443") ? false : (stryCov_9fa48("52443", "52444", "52445"), i < 25); stryMutAct_9fa48("52446") ? i-- : (stryCov_9fa48("52446"), i++)) particles.push(stryMutAct_9fa48("52447") ? {} : (stryCov_9fa48("52447"), {
      x: stryMutAct_9fa48("52448") ? Math.random() / canvas.width : (stryCov_9fa48("52448"), Math.random() * canvas.width),
      y: stryMutAct_9fa48("52449") ? Math.random() / canvas.height : (stryCov_9fa48("52449"), Math.random() * canvas.height),
      vx: stryMutAct_9fa48("52450") ? (Math.random() - 0.5) / 0.15 : (stryCov_9fa48("52450"), (stryMutAct_9fa48("52451") ? Math.random() + 0.5 : (stryCov_9fa48("52451"), Math.random() - 0.5)) * 0.15),
      vy: stryMutAct_9fa48("52452") ? (Math.random() - 0.5) / 0.15 : (stryCov_9fa48("52452"), (stryMutAct_9fa48("52453") ? Math.random() + 0.5 : (stryCov_9fa48("52453"), Math.random() - 0.5)) * 0.15),
      size: stryMutAct_9fa48("52454") ? Math.random() * 1.5 - 0.5 : (stryCov_9fa48("52454"), (stryMutAct_9fa48("52455") ? Math.random() / 1.5 : (stryCov_9fa48("52455"), Math.random() * 1.5)) + 0.5),
      opacity: stryMutAct_9fa48("52456") ? Math.random() * 0.25 - 0.05 : (stryCov_9fa48("52456"), (stryMutAct_9fa48("52457") ? Math.random() / 0.25 : (stryCov_9fa48("52457"), Math.random() * 0.25)) + 0.05)
    }));
    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        stryMutAct_9fa48("52460") ? p.x -= p.vx : (stryCov_9fa48("52460"), p.x += p.vx);
        stryMutAct_9fa48("52461") ? p.y -= p.vy : (stryCov_9fa48("52461"), p.y += p.vy);
        if (stryMutAct_9fa48("52465") ? p.x >= 0 : stryMutAct_9fa48("52464") ? p.x <= 0 : stryMutAct_9fa48("52463") ? false : stryMutAct_9fa48("52462") ? true : (stryCov_9fa48("52462", "52463", "52464", "52465"), p.x < 0)) p.x = canvas.width;
        if (stryMutAct_9fa48("52469") ? p.x <= canvas.width : stryMutAct_9fa48("52468") ? p.x >= canvas.width : stryMutAct_9fa48("52467") ? false : stryMutAct_9fa48("52466") ? true : (stryCov_9fa48("52466", "52467", "52468", "52469"), p.x > canvas.width)) p.x = 0;
        if (stryMutAct_9fa48("52473") ? p.y >= 0 : stryMutAct_9fa48("52472") ? p.y <= 0 : stryMutAct_9fa48("52471") ? false : stryMutAct_9fa48("52470") ? true : (stryCov_9fa48("52470", "52471", "52472", "52473"), p.y < 0)) p.y = canvas.height;
        if (stryMutAct_9fa48("52477") ? p.y <= canvas.height : stryMutAct_9fa48("52476") ? p.y >= canvas.height : stryMutAct_9fa48("52475") ? false : stryMutAct_9fa48("52474") ? true : (stryCov_9fa48("52474", "52475", "52476", "52477"), p.y > canvas.height)) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, stryMutAct_9fa48("52478") ? Math.PI / 2 : (stryCov_9fa48("52478"), Math.PI * 2));
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
  }, stryMutAct_9fa48("52484") ? ["Stryker was here"] : (stryCov_9fa48("52484"), []));
  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
};
export const ChangelogPage: React.FC = () => {
  const releases = stryMutAct_9fa48("52486") ? [] : (stryCov_9fa48("52486"), [stryMutAct_9fa48("52487") ? {} : (stryCov_9fa48("52487"), {
    version: '2.4.0',
    date: 'December 2024',
    type: 'major',
    highlights: stryMutAct_9fa48("52491") ? [] : (stryCov_9fa48("52491"), [stryMutAct_9fa48("52492") ? {} : (stryCov_9fa48("52492"), {
      icon: Sparkles,
      text: 'Chronos temporal intelligence - navigate your org through time'
    }), stryMutAct_9fa48("52494") ? {} : (stryCov_9fa48("52494"), {
      icon: Sparkles,
      text: 'Department-level metrics with org comparison'
    }), stryMutAct_9fa48("52496") ? {} : (stryCov_9fa48("52496"), {
      icon: Zap,
      text: 'Performance improvements to Knowledge Graph rendering'
    }), stryMutAct_9fa48("52498") ? {} : (stryCov_9fa48("52498"), {
      icon: Shield,
      text: 'Enhanced SAML 2.0 and OIDC support'
    })])
  }), stryMutAct_9fa48("52500") ? {} : (stryCov_9fa48("52500"), {
    version: '2.3.0',
    date: 'November 2024',
    type: 'major',
    highlights: stryMutAct_9fa48("52504") ? [] : (stryCov_9fa48("52504"), [stryMutAct_9fa48("52505") ? {} : (stryCov_9fa48("52505"), {
      icon: Sparkles,
      text: 'Sovereign theme and branding overhaul'
    }), stryMutAct_9fa48("52507") ? {} : (stryCov_9fa48("52507"), {
      icon: Sparkles,
      text: 'Air-gapped deployment package builder'
    }), stryMutAct_9fa48("52509") ? {} : (stryCov_9fa48("52509"), {
      icon: Zap,
      text: 'Redis-backed rate limiting for enterprise scale'
    }), stryMutAct_9fa48("52511") ? {} : (stryCov_9fa48("52511"), {
      icon: Bug,
      text: 'Fixed 404 errors on footer navigation links'
    })])
  }), stryMutAct_9fa48("52513") ? {} : (stryCov_9fa48("52513"), {
    version: '2.2.0',
    date: 'October 2024',
    type: 'major',
    highlights: stryMutAct_9fa48("52517") ? [] : (stryCov_9fa48("52517"), [stryMutAct_9fa48("52518") ? {} : (stryCov_9fa48("52518"), {
      icon: Sparkles,
      text: 'Pre-Mortem analysis for proactive risk assessment'
    }), stryMutAct_9fa48("52520") ? {} : (stryCov_9fa48("52520"), {
      icon: Sparkles,
      text: 'Ghost Board for stakeholder simulation'
    }), stryMutAct_9fa48("52522") ? {} : (stryCov_9fa48("52522"), {
      icon: Zap,
      text: 'Command palette with keyboard shortcuts'
    }), stryMutAct_9fa48("52524") ? {} : (stryCov_9fa48("52524"), {
      icon: Shield,
      text: 'Defense in depth security architecture'
    })])
  }), stryMutAct_9fa48("52526") ? {} : (stryCov_9fa48("52526"), {
    version: '2.1.0',
    date: 'September 2024',
    type: 'minor',
    highlights: stryMutAct_9fa48("52530") ? [] : (stryCov_9fa48("52530"), [stryMutAct_9fa48("52531") ? {} : (stryCov_9fa48("52531"), {
      icon: Sparkles,
      text: 'Decision DNA pattern recognition'
    }), stryMutAct_9fa48("52533") ? {} : (stryCov_9fa48("52533"), {
      icon: Zap,
      text: 'Improved Council deliberation performance'
    }), stryMutAct_9fa48("52535") ? {} : (stryCov_9fa48("52535"), {
      icon: Bug,
      text: 'Fixed timezone issues in audit logs'
    })])
  }), stryMutAct_9fa48("52537") ? {} : (stryCov_9fa48("52537"), {
    version: '2.0.0',
    date: 'August 2024',
    type: 'major',
    highlights: stryMutAct_9fa48("52541") ? [] : (stryCov_9fa48("52541"), [stryMutAct_9fa48("52542") ? {} : (stryCov_9fa48("52542"), {
      icon: Sparkles,
      text: 'Complete platform redesign'
    }), stryMutAct_9fa48("52544") ? {} : (stryCov_9fa48("52544"), {
      icon: Sparkles,
      text: 'Multi-agent AI Council'
    }), stryMutAct_9fa48("52546") ? {} : (stryCov_9fa48("52546"), {
      icon: Sparkles,
      text: 'Knowledge Graph Explorer'
    }), stryMutAct_9fa48("52548") ? {} : (stryCov_9fa48("52548"), {
      icon: Shield,
      text: 'SOC 2 Type II compliance'
    })])
  })]);
  return <div className="min-h-screen bg-black text-white font-light antialiased selection:bg-red-900/30 relative overflow-hidden">
      <ParticleField />
      <div className="fixed inset-0 pointer-events-none z-10" style={stryMutAct_9fa48("52550") ? {} : (stryCov_9fa48("52550"), {
      background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.4) 100%)'
    })} />

      {/* Header */}
      <nav className="relative z-30 border-b border-gray-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between h-16">
          <Link to="/sovereign" className="text-xl font-extralight tracking-[0.2em] text-white hover:text-red-100 transition-colors">DATACENDIA</Link>
          <div className="flex items-center gap-8 text-xs tracking-[0.15em]">
            <Link to="/product" className="text-gray-500 hover:text-white transition-colors">PRODUCT</Link>
            <Link to="/changelog" className="text-red-900">CHANGELOG</Link>
            <Link to="/docs" className="text-gray-500 hover:text-white transition-colors">DOCS</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-20 py-24">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <History className="w-10 h-10 mx-auto mb-4 text-red-900" />
          <p className="text-xs tracking-[0.4em] text-gray-600 uppercase mb-6">RELEASES</p>
          <h1 className="text-3xl font-extralight tracking-wide mb-4">Changelog</h1>
          <p className="text-gray-500">What's new in Datacendia. All releases, updates, and improvements.</p>
        </div>
      </section>

      {/* Releases */}
      <section className="relative z-20 py-12">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="space-y-6">
            {releases.map(stryMutAct_9fa48("52552") ? () => undefined : (stryCov_9fa48("52552"), (release, index) => <div key={index} className="bg-black/50 backdrop-blur-sm border border-gray-800 hover:border-red-900/30 rounded p-6 transition-colors">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-xl font-medium text-white">v{release.version}</span>
                  <span className={`px-2 py-1 text-[10px] font-medium rounded border ${(stryMutAct_9fa48("52556") ? release.type !== 'major' : stryMutAct_9fa48("52555") ? false : stryMutAct_9fa48("52554") ? true : (stryCov_9fa48("52554", "52555", "52556"), release.type === 'major')) ? 'bg-red-900/20 text-red-400 border-red-900/30' : 'bg-gray-800 text-gray-400 border-gray-700'}`}>
                    {(stryMutAct_9fa48("52562") ? release.type !== 'major' : stryMutAct_9fa48("52561") ? false : stryMutAct_9fa48("52560") ? true : (stryCov_9fa48("52560", "52561", "52562"), release.type === 'major')) ? 'MAJOR' : 'MINOR'}
                  </span>
                  <span className="text-xs text-gray-600">{release.date}</span>
                </div>
                <ul className="space-y-3">
                  {release.highlights.map(stryMutAct_9fa48("52566") ? () => undefined : (stryCov_9fa48("52566"), (item, itemIndex) => <li key={itemIndex} className="flex items-start gap-3">
                      <item.icon className={`w-4 h-4 flex-shrink-0 mt-0.5 ${(stryMutAct_9fa48("52570") ? item.icon !== Sparkles : stryMutAct_9fa48("52569") ? false : stryMutAct_9fa48("52568") ? true : (stryCov_9fa48("52568", "52569", "52570"), item.icon === Sparkles)) ? 'text-cyan-500' : (stryMutAct_9fa48("52574") ? item.icon !== Zap : stryMutAct_9fa48("52573") ? false : stryMutAct_9fa48("52572") ? true : (stryCov_9fa48("52572", "52573", "52574"), item.icon === Zap)) ? 'text-amber-500' : (stryMutAct_9fa48("52578") ? item.icon !== Bug : stryMutAct_9fa48("52577") ? false : stryMutAct_9fa48("52576") ? true : (stryCov_9fa48("52576", "52577", "52578"), item.icon === Bug)) ? 'text-green-500' : 'text-violet-500'}`} />
                      <span className="text-gray-400 text-sm">{item.text}</span>
                    </li>))}
                </ul>
              </div>))}
          </div>
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
export default ChangelogPage;