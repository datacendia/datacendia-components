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
import { Shield, Lock, Server, Eye, FileCheck, Users, AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react';
const ParticleField: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (stryMutAct_9fa48("55605") ? false : stryMutAct_9fa48("55604") ? true : stryMutAct_9fa48("55603") ? canvas : (stryCov_9fa48("55603", "55604", "55605"), !canvas)) return;
    const ctx = canvas.getContext('2d');
    if (stryMutAct_9fa48("55609") ? false : stryMutAct_9fa48("55608") ? true : stryMutAct_9fa48("55607") ? ctx : (stryCov_9fa48("55607", "55608", "55609"), !ctx)) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
    }[] = stryMutAct_9fa48("55610") ? ["Stryker was here"] : (stryCov_9fa48("55610"), []);
    for (let i = 0; stryMutAct_9fa48("55613") ? i >= 25 : stryMutAct_9fa48("55612") ? i <= 25 : stryMutAct_9fa48("55611") ? false : (stryCov_9fa48("55611", "55612", "55613"), i < 25); stryMutAct_9fa48("55614") ? i-- : (stryCov_9fa48("55614"), i++)) particles.push(stryMutAct_9fa48("55615") ? {} : (stryCov_9fa48("55615"), {
      x: stryMutAct_9fa48("55616") ? Math.random() / canvas.width : (stryCov_9fa48("55616"), Math.random() * canvas.width),
      y: stryMutAct_9fa48("55617") ? Math.random() / canvas.height : (stryCov_9fa48("55617"), Math.random() * canvas.height),
      vx: stryMutAct_9fa48("55618") ? (Math.random() - 0.5) / 0.15 : (stryCov_9fa48("55618"), (stryMutAct_9fa48("55619") ? Math.random() + 0.5 : (stryCov_9fa48("55619"), Math.random() - 0.5)) * 0.15),
      vy: stryMutAct_9fa48("55620") ? (Math.random() - 0.5) / 0.15 : (stryCov_9fa48("55620"), (stryMutAct_9fa48("55621") ? Math.random() + 0.5 : (stryCov_9fa48("55621"), Math.random() - 0.5)) * 0.15),
      size: stryMutAct_9fa48("55622") ? Math.random() * 1.5 - 0.5 : (stryCov_9fa48("55622"), (stryMutAct_9fa48("55623") ? Math.random() / 1.5 : (stryCov_9fa48("55623"), Math.random() * 1.5)) + 0.5),
      opacity: stryMutAct_9fa48("55624") ? Math.random() * 0.25 - 0.05 : (stryCov_9fa48("55624"), (stryMutAct_9fa48("55625") ? Math.random() / 0.25 : (stryCov_9fa48("55625"), Math.random() * 0.25)) + 0.05)
    }));
    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        stryMutAct_9fa48("55628") ? p.x -= p.vx : (stryCov_9fa48("55628"), p.x += p.vx);
        stryMutAct_9fa48("55629") ? p.y -= p.vy : (stryCov_9fa48("55629"), p.y += p.vy);
        if (stryMutAct_9fa48("55633") ? p.x >= 0 : stryMutAct_9fa48("55632") ? p.x <= 0 : stryMutAct_9fa48("55631") ? false : stryMutAct_9fa48("55630") ? true : (stryCov_9fa48("55630", "55631", "55632", "55633"), p.x < 0)) p.x = canvas.width;
        if (stryMutAct_9fa48("55637") ? p.x <= canvas.width : stryMutAct_9fa48("55636") ? p.x >= canvas.width : stryMutAct_9fa48("55635") ? false : stryMutAct_9fa48("55634") ? true : (stryCov_9fa48("55634", "55635", "55636", "55637"), p.x > canvas.width)) p.x = 0;
        if (stryMutAct_9fa48("55641") ? p.y >= 0 : stryMutAct_9fa48("55640") ? p.y <= 0 : stryMutAct_9fa48("55639") ? false : stryMutAct_9fa48("55638") ? true : (stryCov_9fa48("55638", "55639", "55640", "55641"), p.y < 0)) p.y = canvas.height;
        if (stryMutAct_9fa48("55645") ? p.y <= canvas.height : stryMutAct_9fa48("55644") ? p.y >= canvas.height : stryMutAct_9fa48("55643") ? false : stryMutAct_9fa48("55642") ? true : (stryCov_9fa48("55642", "55643", "55644", "55645"), p.y > canvas.height)) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, stryMutAct_9fa48("55646") ? Math.PI / 2 : (stryCov_9fa48("55646"), Math.PI * 2));
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
  }, stryMutAct_9fa48("55652") ? ["Stryker was here"] : (stryCov_9fa48("55652"), []));
  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
};
export const SecurityPage: React.FC = () => {
  const securityFeatures = stryMutAct_9fa48("55654") ? [] : (stryCov_9fa48("55654"), [stryMutAct_9fa48("55655") ? {} : (stryCov_9fa48("55655"), {
    icon: Lock,
    title: 'Encryption at Rest & Transit',
    description: 'AES-256-GCM encryption for all data at rest. TLS 1.3 for all data in transit.'
  }), stryMutAct_9fa48("55658") ? {} : (stryCov_9fa48("55658"), {
    icon: Server,
    title: 'Air-Gapped Deployment',
    description: 'Deploy entirely on your infrastructure with zero external dependencies or telemetry.'
  }), stryMutAct_9fa48("55661") ? {} : (stryCov_9fa48("55661"), {
    icon: Shield,
    title: 'Defense in Depth',
    description: 'Multi-layer security architecture with honeypots, rate limiting, and intrusion detection.'
  }), stryMutAct_9fa48("55664") ? {} : (stryCov_9fa48("55664"), {
    icon: Eye,
    title: 'Complete Audit Trail',
    description: 'Every action logged with user context, timestamps, and cryptographic integrity.'
  }), stryMutAct_9fa48("55667") ? {} : (stryCov_9fa48("55667"), {
    icon: Users,
    title: 'Enterprise Identity',
    description: 'Native support for Active Directory, SAML 2.0, OIDC, and PKI/Smart Card authentication.'
  }), stryMutAct_9fa48("55670") ? {} : (stryCov_9fa48("55670"), {
    icon: FileCheck,
    title: 'Compliance Ready',
    description: 'SOC 2 Type II, HIPAA, GDPR, and ISO 27001 controls built-in.'
  })]);
  const certifications = stryMutAct_9fa48("55673") ? [] : (stryCov_9fa48("55673"), [stryMutAct_9fa48("55674") ? {} : (stryCov_9fa48("55674"), {
    name: 'SOC 2 Type II',
    status: 'Ready'
  }), stryMutAct_9fa48("55677") ? {} : (stryCov_9fa48("55677"), {
    name: 'ISO 27001',
    status: 'Ready'
  }), stryMutAct_9fa48("55680") ? {} : (stryCov_9fa48("55680"), {
    name: 'HIPAA',
    status: 'Ready'
  }), stryMutAct_9fa48("55683") ? {} : (stryCov_9fa48("55683"), {
    name: 'GDPR',
    status: 'Compliant'
  }), stryMutAct_9fa48("55686") ? {} : (stryCov_9fa48("55686"), {
    name: 'FedRAMP',
    status: 'In Progress'
  })]);
  return <div className="min-h-screen bg-black text-white font-light antialiased selection:bg-red-900/30 relative overflow-hidden">
      <ParticleField />
      <div className="fixed inset-0 pointer-events-none z-10" style={stryMutAct_9fa48("55689") ? {} : (stryCov_9fa48("55689"), {
      background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.4) 100%)'
    })} />

      {/* Header */}
      <nav className="relative z-30 border-b border-gray-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between h-16">
          <Link to="/sovereign" className="text-xl font-extralight tracking-[0.2em] text-white hover:text-red-100 transition-colors">DATACENDIA</Link>
          <div className="flex items-center gap-8 text-xs tracking-[0.15em]">
            <Link to="/security" className="text-red-900">SECURITY</Link>
            <Link to="/privacy" className="text-gray-500 hover:text-white transition-colors">PRIVACY</Link>
            <Link to="/sovereign" className="text-gray-500 hover:text-white transition-colors">SOVEREIGN</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-20 py-24">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <Shield className="w-12 h-12 mx-auto mb-4 text-red-900" />
          <p className="text-xs tracking-[0.4em] text-gray-600 uppercase mb-6">ENTERPRISE SECURITY</p>
          <h1 className="text-3xl font-extralight tracking-wide mb-4">Security First</h1>
          <p className="text-gray-500">Enterprise-grade security designed for sovereign deployments and regulated industries.</p>
        </div>
      </section>

      {/* Security Features */}
      <section className="relative z-20 py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="text-xl font-light text-center mb-12 text-white">Security Architecture</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {securityFeatures.map(stryMutAct_9fa48("55691") ? () => undefined : (stryCov_9fa48("55691"), (feature, index) => <div key={index} className="bg-black/50 backdrop-blur-sm border border-gray-800 hover:border-red-900/30 rounded p-6 transition-colors">
                <feature.icon className="w-8 h-8 text-red-900 mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">{feature.title}</h3>
                <p className="text-gray-500 text-sm">{feature.description}</p>
              </div>))}
          </div>
        </div>
      </section>

      {/* Compliance */}
      <section className="relative z-20 py-16 border-t border-gray-900">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <h2 className="text-xl font-light text-center mb-12 text-white">Compliance & Certifications</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {certifications.map(stryMutAct_9fa48("55692") ? () => undefined : (stryCov_9fa48("55692"), (cert, index) => <div key={index} className="text-center p-4 bg-black/50 border border-gray-800 rounded">
                <CheckCircle className="w-6 h-6 mx-auto mb-2 text-green-500" />
                <div className="font-medium text-white text-sm">{cert.name}</div>
                <div className="text-xs text-gray-600">{cert.status}</div>
              </div>))}
          </div>
        </div>
      </section>

      {/* Vulnerability Reporting */}
      <section className="relative z-20 py-16 border-t border-gray-900">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="bg-amber-900/10 border border-amber-900/30 rounded p-8">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-6 h-6 text-amber-500 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-medium text-white mb-2">Security Vulnerability Reporting</h3>
                <p className="text-gray-400 text-sm mb-4">
                  If you discover a security vulnerability, please report it responsibly. 
                  We take all reports seriously and will respond within 24 hours.
                </p>
                <a href="mailto:security@datacendia.com" className="inline-flex items-center gap-2 text-amber-500 text-sm hover:text-amber-400 transition-colors">
                  security@datacendia.com <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-20 py-12 border-t border-gray-900">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-6 mb-4 text-xs tracking-wider">
            <Link to="/privacy" className="text-gray-600 hover:text-white transition-colors">PRIVACY</Link>
            <Link to="/terms" className="text-gray-600 hover:text-white transition-colors">TERMS</Link>
            <Link to="/sovereign" className="text-gray-600 hover:text-white transition-colors">CONTACT</Link>
          </div>
          <p className="text-[10px] text-gray-700 tracking-widest">© {new Date().getFullYear()} DATACENDIA • SOVEREIGN INTELLIGENCE</p>
        </div>
      </footer>
    </div>;
};
export default SecurityPage;