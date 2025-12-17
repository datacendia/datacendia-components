// @ts-nocheck
// =============================================================================
// DATACENDIA MARKETING LAYOUT
// Premium dark theme layout for all marketing/public pages
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
import React, { useEffect, useRef, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { ArrowRight, Menu, X } from 'lucide-react';

// =============================================================================
// PREMIUM EFFECTS
// =============================================================================

const ParticleField: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (stryMutAct_9fa48("10501") ? false : stryMutAct_9fa48("10500") ? true : stryMutAct_9fa48("10499") ? canvas : (stryCov_9fa48("10499", "10500", "10501"), !canvas)) return;
    const ctx = canvas.getContext('2d');
    if (stryMutAct_9fa48("10505") ? false : stryMutAct_9fa48("10504") ? true : stryMutAct_9fa48("10503") ? ctx : (stryCov_9fa48("10503", "10504", "10505"), !ctx)) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
    }[] = stryMutAct_9fa48("10506") ? ["Stryker was here"] : (stryCov_9fa48("10506"), []);
    const particleCount = 35;
    for (let i = 0; stryMutAct_9fa48("10509") ? i >= particleCount : stryMutAct_9fa48("10508") ? i <= particleCount : stryMutAct_9fa48("10507") ? false : (stryCov_9fa48("10507", "10508", "10509"), i < particleCount); stryMutAct_9fa48("10510") ? i-- : (stryCov_9fa48("10510"), i++)) {
      particles.push(stryMutAct_9fa48("10512") ? {} : (stryCov_9fa48("10512"), {
        x: stryMutAct_9fa48("10513") ? Math.random() / canvas.width : (stryCov_9fa48("10513"), Math.random() * canvas.width),
        y: stryMutAct_9fa48("10514") ? Math.random() / canvas.height : (stryCov_9fa48("10514"), Math.random() * canvas.height),
        vx: stryMutAct_9fa48("10515") ? (Math.random() - 0.5) / 0.2 : (stryCov_9fa48("10515"), (stryMutAct_9fa48("10516") ? Math.random() + 0.5 : (stryCov_9fa48("10516"), Math.random() - 0.5)) * 0.2),
        vy: stryMutAct_9fa48("10517") ? (Math.random() - 0.5) / 0.2 : (stryCov_9fa48("10517"), (stryMutAct_9fa48("10518") ? Math.random() + 0.5 : (stryCov_9fa48("10518"), Math.random() - 0.5)) * 0.2),
        size: stryMutAct_9fa48("10519") ? Math.random() * 2 - 0.5 : (stryCov_9fa48("10519"), (stryMutAct_9fa48("10520") ? Math.random() / 2 : (stryCov_9fa48("10520"), Math.random() * 2)) + 0.5),
        opacity: stryMutAct_9fa48("10521") ? Math.random() * 0.3 - 0.1 : (stryCov_9fa48("10521"), (stryMutAct_9fa48("10522") ? Math.random() / 0.3 : (stryCov_9fa48("10522"), Math.random() * 0.3)) + 0.1)
      }));
    }
    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        stryMutAct_9fa48("10525") ? p.x -= p.vx : (stryCov_9fa48("10525"), p.x += p.vx);
        stryMutAct_9fa48("10526") ? p.y -= p.vy : (stryCov_9fa48("10526"), p.y += p.vy);
        if (stryMutAct_9fa48("10530") ? p.x >= 0 : stryMutAct_9fa48("10529") ? p.x <= 0 : stryMutAct_9fa48("10528") ? false : stryMutAct_9fa48("10527") ? true : (stryCov_9fa48("10527", "10528", "10529", "10530"), p.x < 0)) p.x = canvas.width;
        if (stryMutAct_9fa48("10534") ? p.x <= canvas.width : stryMutAct_9fa48("10533") ? p.x >= canvas.width : stryMutAct_9fa48("10532") ? false : stryMutAct_9fa48("10531") ? true : (stryCov_9fa48("10531", "10532", "10533", "10534"), p.x > canvas.width)) p.x = 0;
        if (stryMutAct_9fa48("10538") ? p.y >= 0 : stryMutAct_9fa48("10537") ? p.y <= 0 : stryMutAct_9fa48("10536") ? false : stryMutAct_9fa48("10535") ? true : (stryCov_9fa48("10535", "10536", "10537", "10538"), p.y < 0)) p.y = canvas.height;
        if (stryMutAct_9fa48("10542") ? p.y <= canvas.height : stryMutAct_9fa48("10541") ? p.y >= canvas.height : stryMutAct_9fa48("10540") ? false : stryMutAct_9fa48("10539") ? true : (stryCov_9fa48("10539", "10540", "10541", "10542"), p.y > canvas.height)) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, stryMutAct_9fa48("10543") ? Math.PI / 2 : (stryCov_9fa48("10543"), Math.PI * 2));
        ctx.fillStyle = `rgba(127, 29, 29, ${p.opacity})`;
        ctx.fill();
      });
      particles.forEach((p1, i) => {
        stryMutAct_9fa48("10546") ? particles.forEach(p2 => {
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(127, 29, 29, ${0.06 * (1 - dist / 100)})`;
            ctx.stroke();
          }
        }) : (stryCov_9fa48("10546"), particles.slice(stryMutAct_9fa48("10547") ? i - 1 : (stryCov_9fa48("10547"), i + 1)).forEach(p2 => {
          const dx = stryMutAct_9fa48("10549") ? p1.x + p2.x : (stryCov_9fa48("10549"), p1.x - p2.x);
          const dy = stryMutAct_9fa48("10550") ? p1.y + p2.y : (stryCov_9fa48("10550"), p1.y - p2.y);
          const dist = Math.sqrt(stryMutAct_9fa48("10551") ? dx * dx - dy * dy : (stryCov_9fa48("10551"), (stryMutAct_9fa48("10552") ? dx / dx : (stryCov_9fa48("10552"), dx * dx)) + (stryMutAct_9fa48("10553") ? dy / dy : (stryCov_9fa48("10553"), dy * dy))));
          if (stryMutAct_9fa48("10557") ? dist >= 100 : stryMutAct_9fa48("10556") ? dist <= 100 : stryMutAct_9fa48("10555") ? false : stryMutAct_9fa48("10554") ? true : (stryCov_9fa48("10554", "10555", "10556", "10557"), dist < 100)) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(127, 29, 29, ${stryMutAct_9fa48("10560") ? 0.06 / (1 - dist / 100) : (stryCov_9fa48("10560"), 0.06 * (stryMutAct_9fa48("10561") ? 1 + dist / 100 : (stryCov_9fa48("10561"), 1 - (stryMutAct_9fa48("10562") ? dist * 100 : (stryCov_9fa48("10562"), dist / 100)))))})`;
            ctx.stroke();
          }
        }));
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
  }, stryMutAct_9fa48("10567") ? ["Stryker was here"] : (stryCov_9fa48("10567"), []));
  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
};
const ScanLines: React.FC = stryMutAct_9fa48("10568") ? () => undefined : (stryCov_9fa48("10568"), (() => {
  const ScanLines: React.FC = () => <div className="fixed inset-0 pointer-events-none z-10 opacity-[0.015]" style={stryMutAct_9fa48("10569") ? {} : (stryCov_9fa48("10569"), {
    backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)'
  })} />;
  return ScanLines;
})());

// =============================================================================
// NAVIGATION
// =============================================================================

const navItems = stryMutAct_9fa48("10571") ? [] : (stryCov_9fa48("10571"), [stryMutAct_9fa48("10572") ? {} : (stryCov_9fa48("10572"), {
  label: 'SOVEREIGN',
  path: '/sovereign'
}), stryMutAct_9fa48("10575") ? {} : (stryCov_9fa48("10575"), {
  label: 'HONESTY',
  path: '/honesty'
}), stryMutAct_9fa48("10578") ? {} : (stryCov_9fa48("10578"), {
  label: 'PRODUCT',
  path: '/product'
}), stryMutAct_9fa48("10581") ? {} : (stryCov_9fa48("10581"), {
  label: 'PRICING',
  path: '/pricing'
}), stryMutAct_9fa48("10584") ? {} : (stryCov_9fa48("10584"), {
  label: 'DOCS',
  path: '/docs'
})]);

// =============================================================================
// LAYOUT COMPONENT
// =============================================================================

export const MarketingLayout: React.FC = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(stryMutAct_9fa48("10588") ? true : (stryCov_9fa48("10588"), false));
  return <div className="min-h-screen bg-black text-white font-light antialiased selection:bg-red-900/30 relative overflow-hidden">
      {/* Background Effects */}
      <ParticleField />
      <ScanLines />
      
      {/* Vignette overlay */}
      <div className="fixed inset-0 pointer-events-none z-10" style={stryMutAct_9fa48("10589") ? {} : (stryCov_9fa48("10589"), {
      background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.4) 100%)'
    })} />

      {/* Navigation */}
      <nav className="relative z-30 border-b border-gray-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/sovereign" className="text-xl font-extralight tracking-[0.2em] text-white hover:text-red-100 transition-colors">
              DATACENDIA
            </Link>
            
            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-8">
              {navItems.map(stryMutAct_9fa48("10591") ? () => undefined : (stryCov_9fa48("10591"), item => <Link key={item.path} to={item.path} className={`text-xs tracking-[0.15em] transition-colors ${(stryMutAct_9fa48("10595") ? location.pathname !== item.path : stryMutAct_9fa48("10594") ? false : stryMutAct_9fa48("10593") ? true : (stryCov_9fa48("10593", "10594", "10595"), location.pathname === item.path)) ? 'text-red-900' : 'text-gray-500 hover:text-white'}`}>
                  {item.label}
                </Link>))}
            </div>
            
            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-4">
              <Link to="/login" className="text-xs tracking-[0.15em] text-gray-500 hover:text-white transition-colors">
                SIGN IN
              </Link>
              <Link to="/sovereign" className="px-4 py-2 border border-red-900/50 text-xs tracking-[0.15em] text-white hover:bg-red-900/10 transition-all">
                REQUEST ACCESS
              </Link>
            </div>

            {/* Mobile menu button */}
            <button onClick={stryMutAct_9fa48("10598") ? () => undefined : (stryCov_9fa48("10598"), () => setMobileMenuOpen(stryMutAct_9fa48("10599") ? mobileMenuOpen : (stryCov_9fa48("10599"), !mobileMenuOpen)))} className="md:hidden p-2 text-gray-400 hover:text-white">
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {stryMutAct_9fa48("10602") ? mobileMenuOpen || <div className="md:hidden absolute top-16 left-0 right-0 bg-black/95 border-b border-gray-900 z-50">
            <div className="px-6 py-4 space-y-4">
              {navItems.map(item => <Link key={item.path} to={item.path} onClick={() => setMobileMenuOpen(false)} className={`block text-sm tracking-wider ${location.pathname === item.path ? 'text-red-900' : 'text-gray-400'}`}>
                  {item.label}
                </Link>)}
              <div className="pt-4 border-t border-gray-800 space-y-3">
                <Link to="/login" className="block text-sm text-gray-400">Sign In</Link>
                <Link to="/sovereign" className="block text-sm text-red-900">Request Access →</Link>
              </div>
            </div>
          </div> : stryMutAct_9fa48("10601") ? false : stryMutAct_9fa48("10600") ? true : (stryCov_9fa48("10600", "10601", "10602"), mobileMenuOpen && <div className="md:hidden absolute top-16 left-0 right-0 bg-black/95 border-b border-gray-900 z-50">
            <div className="px-6 py-4 space-y-4">
              {navItems.map(stryMutAct_9fa48("10603") ? () => undefined : (stryCov_9fa48("10603"), item => <Link key={item.path} to={item.path} onClick={stryMutAct_9fa48("10604") ? () => undefined : (stryCov_9fa48("10604"), () => setMobileMenuOpen(stryMutAct_9fa48("10605") ? true : (stryCov_9fa48("10605"), false)))} className={`block text-sm tracking-wider ${(stryMutAct_9fa48("10609") ? location.pathname !== item.path : stryMutAct_9fa48("10608") ? false : stryMutAct_9fa48("10607") ? true : (stryCov_9fa48("10607", "10608", "10609"), location.pathname === item.path)) ? 'text-red-900' : 'text-gray-400'}`}>
                  {item.label}
                </Link>))}
              <div className="pt-4 border-t border-gray-800 space-y-3">
                <Link to="/login" className="block text-sm text-gray-400">Sign In</Link>
                <Link to="/sovereign" className="block text-sm text-red-900">Request Access →</Link>
              </div>
            </div>
          </div>)}
      </nav>

      {/* Page Content */}
      <main className="relative z-20">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="relative z-20 py-16 px-6 border-t border-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h4 className="text-xs tracking-[0.2em] text-gray-500 mb-4">PLATFORM</h4>
              <div className="space-y-2">
                <Link to="/product" className="block text-sm text-gray-600 hover:text-white transition-colors">Product</Link>
                <Link to="/pricing" className="block text-sm text-gray-600 hover:text-white transition-colors">Pricing</Link>
                <Link to="/honesty" className="block text-sm text-gray-600 hover:text-white transition-colors">Honesty Matrices</Link>
              </div>
            </div>
            <div>
              <h4 className="text-xs tracking-[0.2em] text-gray-500 mb-4">RESOURCES</h4>
              <div className="space-y-2">
                <Link to="/docs" className="block text-sm text-gray-600 hover:text-white transition-colors">Documentation</Link>
                <Link to="/blog" className="block text-sm text-gray-600 hover:text-white transition-colors">Blog</Link>
                <Link to="/changelog" className="block text-sm text-gray-600 hover:text-white transition-colors">Changelog</Link>
              </div>
            </div>
            <div>
              <h4 className="text-xs tracking-[0.2em] text-gray-500 mb-4">COMPANY</h4>
              <div className="space-y-2">
                <Link to="/about" className="block text-sm text-gray-600 hover:text-white transition-colors">About</Link>
                <Link to="/security" className="block text-sm text-gray-600 hover:text-white transition-colors">Security</Link>
                <Link to="/support" className="block text-sm text-gray-600 hover:text-white transition-colors">Support</Link>
              </div>
            </div>
            <div>
              <h4 className="text-xs tracking-[0.2em] text-gray-500 mb-4">LEGAL</h4>
              <div className="space-y-2">
                <Link to="/privacy" className="block text-sm text-gray-600 hover:text-white transition-colors">Privacy</Link>
                <Link to="/terms" className="block text-sm text-gray-600 hover:text-white transition-colors">Terms</Link>
                <Link to="/cookies" className="block text-sm text-gray-600 hover:text-white transition-colors">Cookies</Link>
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-gray-900 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-8 text-[10px] text-gray-700 tracking-widest">
              <span>© {new Date().getFullYear()} DATACENDIA</span>
              <span>•</span>
              <span>SOVEREIGN INTELLIGENCE</span>
            </div>
            <p className="text-xs text-gray-600">
              No cloud. No telemetry. No exceptions.
            </p>
          </div>
        </div>
      </footer>
    </div>;
};
export default MarketingLayout;