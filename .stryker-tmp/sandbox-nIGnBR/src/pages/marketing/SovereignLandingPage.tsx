/**
 * Sovereign Landing Page
 * 
 * "This Is Different" - Premium, classified-level positioning
 * No pricing. No feature list. No trial. Pure exclusivity.
 */
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
import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Shield } from 'lucide-react';

// Floating particles background
const ParticleField: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (stryMutAct_9fa48("50902") ? false : stryMutAct_9fa48("50901") ? true : stryMutAct_9fa48("50900") ? canvas : (stryCov_9fa48("50900", "50901", "50902"), !canvas)) return;
    const ctx = canvas.getContext('2d');
    if (stryMutAct_9fa48("50906") ? false : stryMutAct_9fa48("50905") ? true : stryMutAct_9fa48("50904") ? ctx : (stryCov_9fa48("50904", "50905", "50906"), !ctx)) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
    }[] = stryMutAct_9fa48("50907") ? ["Stryker was here"] : (stryCov_9fa48("50907"), []);
    const particleCount = 50;
    for (let i = 0; stryMutAct_9fa48("50910") ? i >= particleCount : stryMutAct_9fa48("50909") ? i <= particleCount : stryMutAct_9fa48("50908") ? false : (stryCov_9fa48("50908", "50909", "50910"), i < particleCount); stryMutAct_9fa48("50911") ? i-- : (stryCov_9fa48("50911"), i++)) {
      particles.push(stryMutAct_9fa48("50913") ? {} : (stryCov_9fa48("50913"), {
        x: stryMutAct_9fa48("50914") ? Math.random() / canvas.width : (stryCov_9fa48("50914"), Math.random() * canvas.width),
        y: stryMutAct_9fa48("50915") ? Math.random() / canvas.height : (stryCov_9fa48("50915"), Math.random() * canvas.height),
        vx: stryMutAct_9fa48("50916") ? (Math.random() - 0.5) / 0.3 : (stryCov_9fa48("50916"), (stryMutAct_9fa48("50917") ? Math.random() + 0.5 : (stryCov_9fa48("50917"), Math.random() - 0.5)) * 0.3),
        vy: stryMutAct_9fa48("50918") ? (Math.random() - 0.5) / 0.3 : (stryCov_9fa48("50918"), (stryMutAct_9fa48("50919") ? Math.random() + 0.5 : (stryCov_9fa48("50919"), Math.random() - 0.5)) * 0.3),
        size: stryMutAct_9fa48("50920") ? Math.random() * 2 - 0.5 : (stryCov_9fa48("50920"), (stryMutAct_9fa48("50921") ? Math.random() / 2 : (stryCov_9fa48("50921"), Math.random() * 2)) + 0.5),
        opacity: stryMutAct_9fa48("50922") ? Math.random() * 0.5 - 0.1 : (stryCov_9fa48("50922"), (stryMutAct_9fa48("50923") ? Math.random() / 0.5 : (stryCov_9fa48("50923"), Math.random() * 0.5)) + 0.1)
      }));
    }
    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        stryMutAct_9fa48("50926") ? p.x -= p.vx : (stryCov_9fa48("50926"), p.x += p.vx);
        stryMutAct_9fa48("50927") ? p.y -= p.vy : (stryCov_9fa48("50927"), p.y += p.vy);
        if (stryMutAct_9fa48("50931") ? p.x >= 0 : stryMutAct_9fa48("50930") ? p.x <= 0 : stryMutAct_9fa48("50929") ? false : stryMutAct_9fa48("50928") ? true : (stryCov_9fa48("50928", "50929", "50930", "50931"), p.x < 0)) p.x = canvas.width;
        if (stryMutAct_9fa48("50935") ? p.x <= canvas.width : stryMutAct_9fa48("50934") ? p.x >= canvas.width : stryMutAct_9fa48("50933") ? false : stryMutAct_9fa48("50932") ? true : (stryCov_9fa48("50932", "50933", "50934", "50935"), p.x > canvas.width)) p.x = 0;
        if (stryMutAct_9fa48("50939") ? p.y >= 0 : stryMutAct_9fa48("50938") ? p.y <= 0 : stryMutAct_9fa48("50937") ? false : stryMutAct_9fa48("50936") ? true : (stryCov_9fa48("50936", "50937", "50938", "50939"), p.y < 0)) p.y = canvas.height;
        if (stryMutAct_9fa48("50943") ? p.y <= canvas.height : stryMutAct_9fa48("50942") ? p.y >= canvas.height : stryMutAct_9fa48("50941") ? false : stryMutAct_9fa48("50940") ? true : (stryCov_9fa48("50940", "50941", "50942", "50943"), p.y > canvas.height)) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, stryMutAct_9fa48("50944") ? Math.PI / 2 : (stryCov_9fa48("50944"), Math.PI * 2));
        ctx.fillStyle = `rgba(127, 29, 29, ${p.opacity})`;
        ctx.fill();
      });

      // Draw connecting lines for nearby particles
      particles.forEach((p1, i) => {
        stryMutAct_9fa48("50947") ? particles.forEach(p2 => {
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(127, 29, 29, ${0.1 * (1 - dist / 150)})`;
            ctx.stroke();
          }
        }) : (stryCov_9fa48("50947"), particles.slice(stryMutAct_9fa48("50948") ? i - 1 : (stryCov_9fa48("50948"), i + 1)).forEach(p2 => {
          const dx = stryMutAct_9fa48("50950") ? p1.x + p2.x : (stryCov_9fa48("50950"), p1.x - p2.x);
          const dy = stryMutAct_9fa48("50951") ? p1.y + p2.y : (stryCov_9fa48("50951"), p1.y - p2.y);
          const dist = Math.sqrt(stryMutAct_9fa48("50952") ? dx * dx - dy * dy : (stryCov_9fa48("50952"), (stryMutAct_9fa48("50953") ? dx / dx : (stryCov_9fa48("50953"), dx * dx)) + (stryMutAct_9fa48("50954") ? dy / dy : (stryCov_9fa48("50954"), dy * dy))));
          if (stryMutAct_9fa48("50958") ? dist >= 150 : stryMutAct_9fa48("50957") ? dist <= 150 : stryMutAct_9fa48("50956") ? false : stryMutAct_9fa48("50955") ? true : (stryCov_9fa48("50955", "50956", "50957", "50958"), dist < 150)) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(127, 29, 29, ${stryMutAct_9fa48("50961") ? 0.1 / (1 - dist / 150) : (stryCov_9fa48("50961"), 0.1 * (stryMutAct_9fa48("50962") ? 1 + dist / 150 : (stryCov_9fa48("50962"), 1 - (stryMutAct_9fa48("50963") ? dist * 150 : (stryCov_9fa48("50963"), dist / 150)))))})`;
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
  }, stryMutAct_9fa48("50968") ? ["Stryker was here"] : (stryCov_9fa48("50968"), []));
  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
};

// Scan lines overlay for classified feel
const ScanLines: React.FC = stryMutAct_9fa48("50969") ? () => undefined : (stryCov_9fa48("50969"), (() => {
  const ScanLines: React.FC = () => <div className="fixed inset-0 pointer-events-none z-10 opacity-[0.03]" style={stryMutAct_9fa48("50970") ? {} : (stryCov_9fa48("50970"), {
    backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)'
  })} />;
  return ScanLines;
})());

// Glitch text effect
const GlitchText: React.FC<{
  children: string;
  className?: string;
}> = ({
  children,
  className
}) => {
  const [isGlitching, setIsGlitching] = useState(stryMutAct_9fa48("50973") ? true : (stryCov_9fa48("50973"), false));
  useEffect(() => {
    const interval = setInterval(() => {
      setIsGlitching(stryMutAct_9fa48("50976") ? false : (stryCov_9fa48("50976"), true));
      setTimeout(stryMutAct_9fa48("50977") ? () => undefined : (stryCov_9fa48("50977"), () => setIsGlitching(stryMutAct_9fa48("50978") ? true : (stryCov_9fa48("50978"), false))), 200);
    }, stryMutAct_9fa48("50979") ? 5000 - Math.random() * 3000 : (stryCov_9fa48("50979"), 5000 + (stryMutAct_9fa48("50980") ? Math.random() / 3000 : (stryCov_9fa48("50980"), Math.random() * 3000))));
    return stryMutAct_9fa48("50981") ? () => undefined : (stryCov_9fa48("50981"), () => clearInterval(interval));
  }, stryMutAct_9fa48("50982") ? ["Stryker was here"] : (stryCov_9fa48("50982"), []));
  return <span className={`relative inline-block ${className}`}>
      <span className={isGlitching ? 'opacity-0' : ''}>{children}</span>
      {stryMutAct_9fa48("50988") ? isGlitching || <>
          <span className="absolute inset-0 text-red-900/80" style={{
        transform: 'translate(-2px, 0)',
        clipPath: 'inset(20% 0 30% 0)'
      }}>{children}</span>
          <span className="absolute inset-0 text-cyan-900/80" style={{
        transform: 'translate(2px, 0)',
        clipPath: 'inset(50% 0 10% 0)'
      }}>{children}</span>
          <span className="absolute inset-0">{children}</span>
        </> : stryMutAct_9fa48("50987") ? false : stryMutAct_9fa48("50986") ? true : (stryCov_9fa48("50986", "50987", "50988"), isGlitching && <>
          <span className="absolute inset-0 text-red-900/80" style={stryMutAct_9fa48("50989") ? {} : (stryCov_9fa48("50989"), {
        transform: 'translate(-2px, 0)',
        clipPath: 'inset(20% 0 30% 0)'
      })}>{children}</span>
          <span className="absolute inset-0 text-cyan-900/80" style={stryMutAct_9fa48("50992") ? {} : (stryCov_9fa48("50992"), {
        transform: 'translate(2px, 0)',
        clipPath: 'inset(50% 0 10% 0)'
      })}>{children}</span>
          <span className="absolute inset-0">{children}</span>
        </>)}
    </span>;
};

// Live counter animation hook
const useAnimatedCounter = (target: number, duration: number = 2000) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let startTime: number;
    let animationFrame: number;
    const animate = (timestamp: number) => {
      if (stryMutAct_9fa48("51000") ? false : stryMutAct_9fa48("50999") ? true : stryMutAct_9fa48("50998") ? startTime : (stryCov_9fa48("50998", "50999", "51000"), !startTime)) startTime = timestamp;
      const progress = stryMutAct_9fa48("51001") ? Math.max((timestamp - startTime) / duration, 1) : (stryCov_9fa48("51001"), Math.min(stryMutAct_9fa48("51002") ? (timestamp - startTime) * duration : (stryCov_9fa48("51002"), (stryMutAct_9fa48("51003") ? timestamp + startTime : (stryCov_9fa48("51003"), timestamp - startTime)) / duration), 1));
      setCount(Math.floor(stryMutAct_9fa48("51004") ? progress / target : (stryCov_9fa48("51004"), progress * target)));
      if (stryMutAct_9fa48("51008") ? progress >= 1 : stryMutAct_9fa48("51007") ? progress <= 1 : stryMutAct_9fa48("51006") ? false : stryMutAct_9fa48("51005") ? true : (stryCov_9fa48("51005", "51006", "51007", "51008"), progress < 1)) {
        animationFrame = requestAnimationFrame(animate);
      }
    };
    animationFrame = requestAnimationFrame(animate);
    return stryMutAct_9fa48("51010") ? () => undefined : (stryCov_9fa48("51010"), () => cancelAnimationFrame(animationFrame));
  }, stryMutAct_9fa48("51011") ? [] : (stryCov_9fa48("51011"), [target, duration]));
  return count;
};

// Request Access Modal
const RequestAccessModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({
  isOpen,
  onClose
}) => {
  const [formData, setFormData] = useState(stryMutAct_9fa48("51013") ? {} : (stryCov_9fa48("51013"), {
    name: '',
    title: '',
    organization: '',
    concern: ''
  }));
  const [isSubmitting, setIsSubmitting] = useState(stryMutAct_9fa48("51018") ? true : (stryCov_9fa48("51018"), false));
  const [isSubmitted, setIsSubmitted] = useState(stryMutAct_9fa48("51019") ? true : (stryCov_9fa48("51019"), false));
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(stryMutAct_9fa48("51021") ? false : (stryCov_9fa48("51021"), true));

    // Simulate submission
    await new Promise(stryMutAct_9fa48("51022") ? () => undefined : (stryCov_9fa48("51022"), resolve => setTimeout(resolve, 1500)));
    setIsSubmitting(stryMutAct_9fa48("51023") ? true : (stryCov_9fa48("51023"), false));
    setIsSubmitted(stryMutAct_9fa48("51024") ? false : (stryCov_9fa48("51024"), true));
  };
  if (stryMutAct_9fa48("51027") ? false : stryMutAct_9fa48("51026") ? true : stryMutAct_9fa48("51025") ? isOpen : (stryCov_9fa48("51025", "51026", "51027"), !isOpen)) return null;
  return <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm">
      <div className="relative w-full max-w-lg">
        <button onClick={onClose} className="absolute -top-12 right-0 text-gray-500 hover:text-white text-sm tracking-widest">
          CLOSE
        </button>
        
        {isSubmitted ? <div className="text-center py-16">
            <div className="w-16 h-16 border border-red-900/50 rounded-full flex items-center justify-center mx-auto mb-8">
              <div className="w-3 h-3 bg-red-900 rounded-full" />
            </div>
            <h3 className="text-2xl font-light text-white mb-4 tracking-wide">Access Requested</h3>
            <p className="text-gray-500 text-sm leading-relaxed max-w-sm mx-auto">
              Your inquiry has been received. If approved, you will be contacted within 48 hours 
              to schedule a secure demonstration.
            </p>
          </div> : <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input type="text" placeholder="Full Name" required value={formData.name} onChange={stryMutAct_9fa48("51028") ? () => undefined : (stryCov_9fa48("51028"), e => setFormData(stryMutAct_9fa48("51029") ? {} : (stryCov_9fa48("51029"), {
            ...formData,
            name: e.target.value
          })))} className="w-full bg-transparent border-b border-gray-800 focus:border-red-900/50 text-white py-4 px-0 text-lg outline-none transition-colors placeholder:text-gray-600" />
            </div>
            <div>
              <input type="text" placeholder="Title" required value={formData.title} onChange={stryMutAct_9fa48("51030") ? () => undefined : (stryCov_9fa48("51030"), e => setFormData(stryMutAct_9fa48("51031") ? {} : (stryCov_9fa48("51031"), {
            ...formData,
            title: e.target.value
          })))} className="w-full bg-transparent border-b border-gray-800 focus:border-red-900/50 text-white py-4 px-0 text-lg outline-none transition-colors placeholder:text-gray-600" />
            </div>
            <div>
              <input type="text" placeholder="Organization" required value={formData.organization} onChange={stryMutAct_9fa48("51032") ? () => undefined : (stryCov_9fa48("51032"), e => setFormData(stryMutAct_9fa48("51033") ? {} : (stryCov_9fa48("51033"), {
            ...formData,
            organization: e.target.value
          })))} className="w-full bg-transparent border-b border-gray-800 focus:border-red-900/50 text-white py-4 px-0 text-lg outline-none transition-colors placeholder:text-gray-600" />
            </div>
            <div>
              <textarea placeholder="What keeps you up at night?" required rows={3} value={formData.concern} onChange={stryMutAct_9fa48("51034") ? () => undefined : (stryCov_9fa48("51034"), e => setFormData(stryMutAct_9fa48("51035") ? {} : (stryCov_9fa48("51035"), {
            ...formData,
            concern: e.target.value
          })))} className="w-full bg-transparent border-b border-gray-800 focus:border-red-900/50 text-white py-4 px-0 text-lg outline-none transition-colors placeholder:text-gray-600 resize-none" />
            </div>
            <div className="pt-8">
              <button type="submit" disabled={isSubmitting} className="w-full py-4 border border-red-900/50 text-white hover:bg-red-900/10 transition-colors text-sm tracking-widest disabled:opacity-50">
                {isSubmitting ? 'SUBMITTING...' : 'SUBMIT REQUEST'}
              </button>
            </div>
          </form>}
      </div>
    </div>;
};
const SovereignLandingPage: React.FC = () => {
  const [showModal, setShowModal] = useState(stryMutAct_9fa48("51039") ? true : (stryCov_9fa48("51039"), false));
  const [hasScrolled, setHasScrolled] = useState(stryMutAct_9fa48("51040") ? true : (stryCov_9fa48("51040"), false));
  const [activeTab, setActiveTab] = useState<'honesty' | 'manifesto'>('honesty');

  // Animated counters
  const deployments = useAnimatedCounter(11, 2500);
  const decisions = useAnimatedCounter(2847, 3000);
  const frameworks = useAnimatedCounter(31, 2000);
  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(stryMutAct_9fa48("51047") ? window.scrollY <= 50 : stryMutAct_9fa48("51046") ? window.scrollY >= 50 : stryMutAct_9fa48("51045") ? false : stryMutAct_9fa48("51044") ? true : (stryCov_9fa48("51044", "51045", "51046", "51047"), window.scrollY > 50));
    };
    window.addEventListener('scroll', handleScroll);
    return stryMutAct_9fa48("51049") ? () => undefined : (stryCov_9fa48("51049"), () => window.removeEventListener('scroll', handleScroll));
  }, stryMutAct_9fa48("51051") ? ["Stryker was here"] : (stryCov_9fa48("51051"), []));
  return <div className="min-h-screen bg-black text-white font-light antialiased selection:bg-red-900/30 relative overflow-hidden">
      {/* Background Effects */}
      <ParticleField />
      <ScanLines />
      
      {/* Vignette overlay */}
      <div className="fixed inset-0 pointer-events-none z-10" style={stryMutAct_9fa48("51052") ? {} : (stryCov_9fa48("51052"), {
      background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.4) 100%)'
    })} />
      
      {/* Hero Section - Full Screen */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 relative">
        
        {/* Logo / Brand */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-extralight tracking-[0.3em] text-white mb-4">
            <GlitchText>DATACENDIA</GlitchText>
          </h1>
          <p className="text-sm tracking-[0.4em] text-gray-500 uppercase">
            Sovereign Intelligence Platform
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center gap-1 mb-12">
          <button onClick={stryMutAct_9fa48("51054") ? () => undefined : (stryCov_9fa48("51054"), () => setActiveTab('honesty'))} className={`px-6 py-3 text-xs tracking-[0.2em] transition-all duration-300 border ${(stryMutAct_9fa48("51059") ? activeTab !== 'honesty' : stryMutAct_9fa48("51058") ? false : stryMutAct_9fa48("51057") ? true : (stryCov_9fa48("51057", "51058", "51059"), activeTab === 'honesty')) ? 'border-red-900/50 text-white bg-red-900/10' : 'border-gray-800 text-gray-500 hover:text-white hover:border-gray-700'}`}>
            HONESTY MATRICES
          </button>
          <button onClick={stryMutAct_9fa48("51063") ? () => undefined : (stryCov_9fa48("51063"), () => setActiveTab('manifesto'))} className={`px-6 py-3 text-xs tracking-[0.2em] transition-all duration-300 border ${(stryMutAct_9fa48("51068") ? activeTab !== 'manifesto' : stryMutAct_9fa48("51067") ? false : stryMutAct_9fa48("51066") ? true : (stryCov_9fa48("51066", "51067", "51068"), activeTab === 'manifesto')) ? 'border-red-900/50 text-white bg-red-900/10' : 'border-gray-800 text-gray-500 hover:text-white hover:border-gray-700'}`}>
            THE MANIFESTO
          </button>
        </div>

        {/* Honesty Matrices Tab */}
        {stryMutAct_9fa48("51074") ? activeTab === 'honesty' || <div className="w-full max-w-5xl mb-16">
            <div className="text-center mb-8">
              <p className="text-xs tracking-[0.4em] text-gray-500 uppercase mb-3">RADICAL TRANSPARENCY</p>
              <h2 className="text-xl md:text-2xl font-light text-white mb-2">Most vendors hide this. We lead with it.</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a href="/honesty" className="group p-6 border border-gray-800 hover:border-red-900/50 bg-black/50 transition-all duration-300 rounded">
                <div className="text-2xl mb-3">🏛️</div>
                <h3 className="text-sm font-medium text-white mb-1">Sovereignty Matrix</h3>
                <p className="text-xs text-gray-500 mb-3">How much control do you actually have?</p>
                <div className="flex gap-2">
                  <span className="px-2 py-0.5 text-[10px] bg-green-900/30 text-green-400 rounded">Air-Gapped</span>
                  <span className="px-2 py-0.5 text-[10px] bg-green-900/30 text-green-400 rounded">On-Prem</span>
                </div>
              </a>
              
              <a href="/honesty" className="group p-6 border border-gray-800 hover:border-red-900/50 bg-black/50 transition-all duration-300 rounded">
                <div className="text-2xl mb-3">🚫</div>
                <h3 className="text-sm font-medium text-white mb-1">What We Can't Do</h3>
                <p className="text-xs text-gray-500 mb-3">Our actual limitations, documented.</p>
                <div className="flex gap-2">
                  <span className="px-2 py-0.5 text-[10px] bg-red-900/30 text-red-400 rounded">Honest</span>
                  <span className="px-2 py-0.5 text-[10px] bg-gray-800 text-gray-400 rounded">No BS</span>
                </div>
              </a>
              
              <a href="/honesty" className="group p-6 border border-gray-800 hover:border-red-900/50 bg-black/50 transition-all duration-300 rounded">
                <div className="text-2xl mb-3">🚨</div>
                <h3 className="text-sm font-medium text-white mb-1">What Breaks at 3 AM</h3>
                <p className="text-xs text-gray-500 mb-3">When things go wrong, what happens?</p>
                <div className="flex gap-2">
                  <span className="px-2 py-0.5 text-[10px] bg-yellow-900/30 text-yellow-400 rounded">Recovery</span>
                  <span className="px-2 py-0.5 text-[10px] bg-yellow-900/30 text-yellow-400 rounded">Root Cause</span>
                </div>
              </a>
            </div>
            
            <div className="text-center mt-6">
              <a href="/honesty" className="text-xs tracking-[0.2em] text-gray-500 hover:text-red-900 transition-colors">
                VIEW ALL 6 HONESTY MATRICES →
              </a>
            </div>
          </div> : stryMutAct_9fa48("51073") ? false : stryMutAct_9fa48("51072") ? true : (stryCov_9fa48("51072", "51073", "51074"), (stryMutAct_9fa48("51076") ? activeTab !== 'honesty' : stryMutAct_9fa48("51075") ? true : (stryCov_9fa48("51075", "51076"), activeTab === 'honesty')) && <div className="w-full max-w-5xl mb-16">
            <div className="text-center mb-8">
              <p className="text-xs tracking-[0.4em] text-gray-500 uppercase mb-3">RADICAL TRANSPARENCY</p>
              <h2 className="text-xl md:text-2xl font-light text-white mb-2">Most vendors hide this. We lead with it.</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a href="/honesty" className="group p-6 border border-gray-800 hover:border-red-900/50 bg-black/50 transition-all duration-300 rounded">
                <div className="text-2xl mb-3">🏛️</div>
                <h3 className="text-sm font-medium text-white mb-1">Sovereignty Matrix</h3>
                <p className="text-xs text-gray-500 mb-3">How much control do you actually have?</p>
                <div className="flex gap-2">
                  <span className="px-2 py-0.5 text-[10px] bg-green-900/30 text-green-400 rounded">Air-Gapped</span>
                  <span className="px-2 py-0.5 text-[10px] bg-green-900/30 text-green-400 rounded">On-Prem</span>
                </div>
              </a>
              
              <a href="/honesty" className="group p-6 border border-gray-800 hover:border-red-900/50 bg-black/50 transition-all duration-300 rounded">
                <div className="text-2xl mb-3">🚫</div>
                <h3 className="text-sm font-medium text-white mb-1">What We Can't Do</h3>
                <p className="text-xs text-gray-500 mb-3">Our actual limitations, documented.</p>
                <div className="flex gap-2">
                  <span className="px-2 py-0.5 text-[10px] bg-red-900/30 text-red-400 rounded">Honest</span>
                  <span className="px-2 py-0.5 text-[10px] bg-gray-800 text-gray-400 rounded">No BS</span>
                </div>
              </a>
              
              <a href="/honesty" className="group p-6 border border-gray-800 hover:border-red-900/50 bg-black/50 transition-all duration-300 rounded">
                <div className="text-2xl mb-3">🚨</div>
                <h3 className="text-sm font-medium text-white mb-1">What Breaks at 3 AM</h3>
                <p className="text-xs text-gray-500 mb-3">When things go wrong, what happens?</p>
                <div className="flex gap-2">
                  <span className="px-2 py-0.5 text-[10px] bg-yellow-900/30 text-yellow-400 rounded">Recovery</span>
                  <span className="px-2 py-0.5 text-[10px] bg-yellow-900/30 text-yellow-400 rounded">Root Cause</span>
                </div>
              </a>
            </div>
            
            <div className="text-center mt-6">
              <a href="/honesty" className="text-xs tracking-[0.2em] text-gray-500 hover:text-red-900 transition-colors">
                VIEW ALL 6 HONESTY MATRICES →
              </a>
            </div>
          </div>)}

        {/* Manifesto Tab */}
        {stryMutAct_9fa48("51080") ? activeTab === 'manifesto' || <div className="w-full max-w-3xl mb-16">
            <div className="space-y-8 text-center">
              <p className="text-lg md:text-xl font-light text-gray-300 leading-relaxed">
                Modern enterprises have surrendered their minds.
              </p>
              
              <p className="text-base text-gray-400 leading-relaxed">
                They've traded ownership for convenience, and now they're tenants in their own house.
              </p>

              <div className="space-y-2 text-sm text-gray-500">
                <p>They have data. They don't have understanding.</p>
                <p>They have dashboards. They don't have direction.</p>
                <p>They have AI. They don't have agency.</p>
                <p>They have predictions. They don't have power.</p>
                <p>They have tools. They don't have truth.</p>
              </div>

              <p className="text-xl md:text-2xl font-light text-white leading-relaxed pt-4">
                Datacendia exists to return the mind to its rightful owner.
              </p>

              <div className="pt-8 border-t border-gray-900">
                <p className="text-xs tracking-[0.3em] text-gray-600 uppercase mb-6">We Believe</p>
                <ol className="space-y-3 text-sm text-gray-400 text-left max-w-xl mx-auto">
                  <li className="flex gap-4">
                    <span className="text-red-900 font-mono">1.</span>
                    <span>Your intelligence should live on your infrastructure, under your control.</span>
                  </li>
                  <li className="flex gap-4">
                    <span className="text-red-900 font-mono">2.</span>
                    <span>Decisions made by machines should be explainable to humans.</span>
                  </li>
                  <li className="flex gap-4">
                    <span className="text-red-900 font-mono">3.</span>
                    <span>Disagreement is not disloyalty — it is the immune system of good judgment.</span>
                  </li>
                  <li className="flex gap-4">
                    <span className="text-red-900 font-mono">4.</span>
                    <span>The past is not a black box — it is a teacher, if you can replay it.</span>
                  </li>
                  <li className="flex gap-4">
                    <span className="text-red-900 font-mono">5.</span>
                    <span>Transparency is not a feature. It is the foundation.</span>
                  </li>
                </ol>
              </div>

              <p className="text-base text-gray-400 pt-6 italic">
                The future belongs to those who can see it —
                <br />
                <span className="text-white not-italic">and refuse to rent it from someone else.</span>
              </p>
            </div>
          </div> : stryMutAct_9fa48("51079") ? false : stryMutAct_9fa48("51078") ? true : (stryCov_9fa48("51078", "51079", "51080"), (stryMutAct_9fa48("51082") ? activeTab !== 'manifesto' : stryMutAct_9fa48("51081") ? true : (stryCov_9fa48("51081", "51082"), activeTab === 'manifesto')) && <div className="w-full max-w-3xl mb-16">
            <div className="space-y-8 text-center">
              <p className="text-lg md:text-xl font-light text-gray-300 leading-relaxed">
                Modern enterprises have surrendered their minds.
              </p>
              
              <p className="text-base text-gray-400 leading-relaxed">
                They've traded ownership for convenience, and now they're tenants in their own house.
              </p>

              <div className="space-y-2 text-sm text-gray-500">
                <p>They have data. They don't have understanding.</p>
                <p>They have dashboards. They don't have direction.</p>
                <p>They have AI. They don't have agency.</p>
                <p>They have predictions. They don't have power.</p>
                <p>They have tools. They don't have truth.</p>
              </div>

              <p className="text-xl md:text-2xl font-light text-white leading-relaxed pt-4">
                Datacendia exists to return the mind to its rightful owner.
              </p>

              <div className="pt-8 border-t border-gray-900">
                <p className="text-xs tracking-[0.3em] text-gray-600 uppercase mb-6">We Believe</p>
                <ol className="space-y-3 text-sm text-gray-400 text-left max-w-xl mx-auto">
                  <li className="flex gap-4">
                    <span className="text-red-900 font-mono">1.</span>
                    <span>Your intelligence should live on your infrastructure, under your control.</span>
                  </li>
                  <li className="flex gap-4">
                    <span className="text-red-900 font-mono">2.</span>
                    <span>Decisions made by machines should be explainable to humans.</span>
                  </li>
                  <li className="flex gap-4">
                    <span className="text-red-900 font-mono">3.</span>
                    <span>Disagreement is not disloyalty — it is the immune system of good judgment.</span>
                  </li>
                  <li className="flex gap-4">
                    <span className="text-red-900 font-mono">4.</span>
                    <span>The past is not a black box — it is a teacher, if you can replay it.</span>
                  </li>
                  <li className="flex gap-4">
                    <span className="text-red-900 font-mono">5.</span>
                    <span>Transparency is not a feature. It is the foundation.</span>
                  </li>
                </ol>
              </div>

              <p className="text-base text-gray-400 pt-6 italic">
                The future belongs to those who can see it —
                <br />
                <span className="text-white not-italic">and refuse to rent it from someone else.</span>
              </p>
            </div>
          </div>)}

        {/* Value Proposition - Single memorable line */}
        <div className="text-center mb-16">
          <p className="text-xl md:text-2xl lg:text-3xl font-light leading-relaxed">
            <span className="text-gray-400">We do not host your data. We </span>
            <span className="relative text-white">
              return your mind
              <span className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-red-900/0 via-red-900 to-red-900/0" />
            </span>
            <span className="text-gray-400">.</span>
          </p>
        </div>

        {/* Request Access Button - CendiaVeto™ crimson */}
        <button onClick={stryMutAct_9fa48("51084") ? () => undefined : (stryCov_9fa48("51084"), () => setShowModal(stryMutAct_9fa48("51085") ? false : (stryCov_9fa48("51085"), true)))} className="group relative px-10 py-5 border-2 border-red-900 bg-black hover:bg-red-900/10 transition-all duration-300 flex items-center gap-3 overflow-hidden">
          {/* Pulse glow effect */}
          <span className="absolute inset-0 bg-red-900/20 animate-pulse" />
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-red-900/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          <Shield className="w-4 h-4 text-red-800 relative z-10" />
          <span className="text-sm tracking-[0.25em] text-white font-medium relative z-10">Request Access</span>
          <ArrowRight className="w-4 h-4 text-red-800 group-hover:translate-x-1 transition-transform relative z-10" />
        </button>

        {/* Scroll indicator */}
        <div className={`absolute bottom-12 left-1/2 -translate-x-1/2 transition-opacity duration-500 ${hasScrolled ? 'opacity-0' : 'opacity-100'}`}>
          <div className="w-px h-16 bg-gradient-to-b from-transparent to-gray-800" />
        </div>
      </section>

      {/* Below the Fold */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 py-24">
        
        {/* Tagline */}
        <p className="text-center text-gray-500 text-lg md:text-xl font-light mb-24 tracking-wide">
          For organizations that cannot afford to be tenants.
        </p>

        {/* Live Counters */}
        <div className="flex flex-wrap justify-center gap-12 md:gap-24 mb-24">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-light text-white tabular-nums">{deployments}</div>
            <div className="text-[10px] text-gray-600 tracking-[0.3em] mt-2">SOVEREIGN DEPLOYMENTS ACTIVE</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-light text-white tabular-nums">{decisions.toLocaleString()}</div>
            <div className="text-[10px] text-gray-600 tracking-[0.3em] mt-2">DECISIONS PROTECTED THIS QUARTER</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-light text-white tabular-nums">{frameworks}</div>
            <div className="text-[10px] text-gray-600 tracking-[0.3em] mt-2">REGULATORY FRAMEWORKS MAPPED</div>
          </div>
        </div>

        {/* Second CTA */}
        <button onClick={stryMutAct_9fa48("51089") ? () => undefined : (stryCov_9fa48("51089"), () => setShowModal(stryMutAct_9fa48("51090") ? false : (stryCov_9fa48("51090"), true)))} className="group px-8 py-4 border border-gray-800 hover:border-red-900/50 bg-black transition-all duration-300 flex items-center gap-3">
          <span className="text-sm tracking-[0.2em] text-gray-400 group-hover:text-white transition-colors">Request Access</span>
          <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-red-900 group-hover:translate-x-1 transition-all" />
        </button>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 border-t border-gray-900 relative z-20">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs text-gray-600 leading-relaxed max-w-2xl mx-auto mb-8">
            Datacendia runs entirely on your hardware, in your vault, under your control.
            <br />
            No cloud. No telemetry. No exceptions.
          </p>
          <div className="flex items-center justify-center gap-8 text-[10px] text-gray-700 tracking-widest">
            <span>© {new Date().getFullYear()} DATACENDIA</span>
            <span>•</span>
            <span>SOVEREIGN INTELLIGENCE</span>
          </div>
        </div>
      </footer>

      {/* Request Access Modal */}
      <RequestAccessModal isOpen={showModal} onClose={stryMutAct_9fa48("51091") ? () => undefined : (stryCov_9fa48("51091"), () => setShowModal(stryMutAct_9fa48("51092") ? true : (stryCov_9fa48("51092"), false)))} />
    </div>;
};
export default SovereignLandingPage;