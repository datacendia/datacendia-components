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
import { HelpCircle, Mail, MessageSquare, Book, Clock, Shield, Phone, ArrowRight } from 'lucide-react';
const ParticleField: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (stryMutAct_9fa48("56323") ? false : stryMutAct_9fa48("56322") ? true : stryMutAct_9fa48("56321") ? canvas : (stryCov_9fa48("56321", "56322", "56323"), !canvas)) return;
    const ctx = canvas.getContext('2d');
    if (stryMutAct_9fa48("56327") ? false : stryMutAct_9fa48("56326") ? true : stryMutAct_9fa48("56325") ? ctx : (stryCov_9fa48("56325", "56326", "56327"), !ctx)) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
    }[] = stryMutAct_9fa48("56328") ? ["Stryker was here"] : (stryCov_9fa48("56328"), []);
    for (let i = 0; stryMutAct_9fa48("56331") ? i >= 25 : stryMutAct_9fa48("56330") ? i <= 25 : stryMutAct_9fa48("56329") ? false : (stryCov_9fa48("56329", "56330", "56331"), i < 25); stryMutAct_9fa48("56332") ? i-- : (stryCov_9fa48("56332"), i++)) particles.push(stryMutAct_9fa48("56333") ? {} : (stryCov_9fa48("56333"), {
      x: stryMutAct_9fa48("56334") ? Math.random() / canvas.width : (stryCov_9fa48("56334"), Math.random() * canvas.width),
      y: stryMutAct_9fa48("56335") ? Math.random() / canvas.height : (stryCov_9fa48("56335"), Math.random() * canvas.height),
      vx: stryMutAct_9fa48("56336") ? (Math.random() - 0.5) / 0.15 : (stryCov_9fa48("56336"), (stryMutAct_9fa48("56337") ? Math.random() + 0.5 : (stryCov_9fa48("56337"), Math.random() - 0.5)) * 0.15),
      vy: stryMutAct_9fa48("56338") ? (Math.random() - 0.5) / 0.15 : (stryCov_9fa48("56338"), (stryMutAct_9fa48("56339") ? Math.random() + 0.5 : (stryCov_9fa48("56339"), Math.random() - 0.5)) * 0.15),
      size: stryMutAct_9fa48("56340") ? Math.random() * 1.5 - 0.5 : (stryCov_9fa48("56340"), (stryMutAct_9fa48("56341") ? Math.random() / 1.5 : (stryCov_9fa48("56341"), Math.random() * 1.5)) + 0.5),
      opacity: stryMutAct_9fa48("56342") ? Math.random() * 0.25 - 0.05 : (stryCov_9fa48("56342"), (stryMutAct_9fa48("56343") ? Math.random() / 0.25 : (stryCov_9fa48("56343"), Math.random() * 0.25)) + 0.05)
    }));
    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        stryMutAct_9fa48("56346") ? p.x -= p.vx : (stryCov_9fa48("56346"), p.x += p.vx);
        stryMutAct_9fa48("56347") ? p.y -= p.vy : (stryCov_9fa48("56347"), p.y += p.vy);
        if (stryMutAct_9fa48("56351") ? p.x >= 0 : stryMutAct_9fa48("56350") ? p.x <= 0 : stryMutAct_9fa48("56349") ? false : stryMutAct_9fa48("56348") ? true : (stryCov_9fa48("56348", "56349", "56350", "56351"), p.x < 0)) p.x = canvas.width;
        if (stryMutAct_9fa48("56355") ? p.x <= canvas.width : stryMutAct_9fa48("56354") ? p.x >= canvas.width : stryMutAct_9fa48("56353") ? false : stryMutAct_9fa48("56352") ? true : (stryCov_9fa48("56352", "56353", "56354", "56355"), p.x > canvas.width)) p.x = 0;
        if (stryMutAct_9fa48("56359") ? p.y >= 0 : stryMutAct_9fa48("56358") ? p.y <= 0 : stryMutAct_9fa48("56357") ? false : stryMutAct_9fa48("56356") ? true : (stryCov_9fa48("56356", "56357", "56358", "56359"), p.y < 0)) p.y = canvas.height;
        if (stryMutAct_9fa48("56363") ? p.y <= canvas.height : stryMutAct_9fa48("56362") ? p.y >= canvas.height : stryMutAct_9fa48("56361") ? false : stryMutAct_9fa48("56360") ? true : (stryCov_9fa48("56360", "56361", "56362", "56363"), p.y > canvas.height)) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, stryMutAct_9fa48("56364") ? Math.PI / 2 : (stryCov_9fa48("56364"), Math.PI * 2));
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
  }, stryMutAct_9fa48("56370") ? ["Stryker was here"] : (stryCov_9fa48("56370"), []));
  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
};
export const SupportPage: React.FC = () => {
  const supportChannels = stryMutAct_9fa48("56372") ? [] : (stryCov_9fa48("56372"), [stryMutAct_9fa48("56373") ? {} : (stryCov_9fa48("56373"), {
    icon: Mail,
    title: 'Email Support',
    description: 'Get help from our technical team',
    action: 'support@datacendia.com',
    href: 'mailto:support@datacendia.com',
    availability: 'Response within 24 hours'
  }), stryMutAct_9fa48("56379") ? {} : (stryCov_9fa48("56379"), {
    icon: Book,
    title: 'Documentation',
    description: 'Self-service guides and tutorials',
    action: 'Browse Docs',
    href: '/docs',
    availability: 'Available 24/7'
  }), stryMutAct_9fa48("56385") ? {} : (stryCov_9fa48("56385"), {
    icon: MessageSquare,
    title: 'Enterprise Support',
    description: 'Dedicated support for licensed customers',
    action: 'Contact Account Manager',
    href: '/contact',
    availability: 'SLA-based response times'
  })]);
  const supportTiers = stryMutAct_9fa48("56391") ? [] : (stryCov_9fa48("56391"), [stryMutAct_9fa48("56392") ? {} : (stryCov_9fa48("56392"), {
    name: 'Standard',
    responseTime: '24 hours',
    channels: stryMutAct_9fa48("56395") ? [] : (stryCov_9fa48("56395"), ['Email']),
    features: stryMutAct_9fa48("56397") ? [] : (stryCov_9fa48("56397"), ['Documentation access', 'Community forums', 'Email support'])
  }), stryMutAct_9fa48("56401") ? {} : (stryCov_9fa48("56401"), {
    name: 'Enterprise',
    responseTime: '4 hours',
    channels: stryMutAct_9fa48("56404") ? [] : (stryCov_9fa48("56404"), ['Email', 'Phone', 'Slack']),
    features: stryMutAct_9fa48("56408") ? [] : (stryCov_9fa48("56408"), ['Priority queue', 'Dedicated CSM', 'Quarterly reviews', 'Training sessions'])
  }), stryMutAct_9fa48("56413") ? {} : (stryCov_9fa48("56413"), {
    name: 'Sovereign',
    responseTime: '1 hour',
    channels: stryMutAct_9fa48("56416") ? [] : (stryCov_9fa48("56416"), ['Email', 'Phone', 'Slack', 'On-site']),
    features: stryMutAct_9fa48("56421") ? [] : (stryCov_9fa48("56421"), ['24/7 support', 'Dedicated team', 'On-site visits', 'Custom SLA'])
  })]);
  return <div className="min-h-screen bg-black text-white font-light antialiased selection:bg-red-900/30 relative overflow-hidden">
      <ParticleField />
      <div className="fixed inset-0 pointer-events-none z-10" style={stryMutAct_9fa48("56426") ? {} : (stryCov_9fa48("56426"), {
      background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.4) 100%)'
    })} />

      {/* Header */}
      <nav className="relative z-30 border-b border-gray-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between h-16">
          <Link to="/sovereign" className="text-xl font-extralight tracking-[0.2em] text-white hover:text-red-100 transition-colors">DATACENDIA</Link>
          <div className="flex items-center gap-8 text-xs tracking-[0.15em]">
            <Link to="/docs" className="text-gray-500 hover:text-white transition-colors">DOCS</Link>
            <Link to="/support" className="text-red-900">SUPPORT</Link>
            <Link to="/sovereign" className="text-gray-500 hover:text-white transition-colors">SOVEREIGN</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-20 py-24">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <HelpCircle className="w-10 h-10 mx-auto mb-4 text-red-900" />
          <p className="text-xs tracking-[0.4em] text-gray-600 uppercase mb-6">ASSISTANCE</p>
          <h1 className="text-3xl font-extralight tracking-wide mb-4">Support</h1>
          <p className="text-gray-500">We're here to help you succeed with Datacendia.</p>
        </div>
      </section>

      {/* Support Channels */}
      <section className="relative z-20 py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="text-lg font-light text-center mb-8 text-white">Get Help</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {supportChannels.map(stryMutAct_9fa48("56428") ? () => undefined : (stryCov_9fa48("56428"), (channel, index) => <div key={index} className="bg-black/50 backdrop-blur-sm border border-gray-800 hover:border-red-900/30 rounded p-6 text-center transition-colors">
                <channel.icon className="w-8 h-8 mx-auto mb-4 text-red-900" />
                <h3 className="text-lg font-medium text-white mb-2">{channel.title}</h3>
                <p className="text-gray-500 text-sm mb-4">{channel.description}</p>
                <a href={channel.href} className="inline-block px-4 py-2 border border-red-900/50 text-white text-sm hover:bg-red-900/10 transition-colors">
                  {channel.action}
                </a>
                <p className="text-xs text-gray-600 mt-3 flex items-center justify-center gap-1">
                  <Clock className="w-3 h-3" />
                  {channel.availability}
                </p>
              </div>))}
          </div>
        </div>
      </section>

      {/* Support Tiers */}
      <section className="relative z-20 py-12 border-t border-gray-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="text-lg font-light text-center mb-8 text-white">Support Tiers</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {supportTiers.map(stryMutAct_9fa48("56429") ? () => undefined : (stryCov_9fa48("56429"), (tier, index) => <div key={index} className={`rounded p-6 border ${(stryMutAct_9fa48("56433") ? tier.name !== 'Sovereign' : stryMutAct_9fa48("56432") ? false : stryMutAct_9fa48("56431") ? true : (stryCov_9fa48("56431", "56432", "56433"), tier.name === 'Sovereign')) ? 'bg-red-900/10 border-red-900/50' : 'bg-black/50 border-gray-800'}`}>
                <h3 className="text-lg font-medium text-white mb-2">{tier.name}</h3>
                <div className="flex items-center gap-2 mb-4">
                  <Clock className={`w-4 h-4 ${(stryMutAct_9fa48("56440") ? tier.name !== 'Sovereign' : stryMutAct_9fa48("56439") ? false : stryMutAct_9fa48("56438") ? true : (stryCov_9fa48("56438", "56439", "56440"), tier.name === 'Sovereign')) ? 'text-red-400' : 'text-gray-500'}`} />
                  <span className="text-sm text-gray-400">{tier.responseTime} response</span>
                </div>
                <ul className="space-y-2">
                  {tier.features.map(stryMutAct_9fa48("56444") ? () => undefined : (stryCov_9fa48("56444"), (feature, featureIndex) => <li key={featureIndex} className="text-sm flex items-center gap-2 text-gray-400">
                      <Shield className={`w-3 h-3 ${(stryMutAct_9fa48("56448") ? tier.name !== 'Sovereign' : stryMutAct_9fa48("56447") ? false : stryMutAct_9fa48("56446") ? true : (stryCov_9fa48("56446", "56447", "56448"), tier.name === 'Sovereign')) ? 'text-red-400' : 'text-gray-600'}`} />
                      {feature}
                    </li>))}
                </ul>
              </div>))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="relative z-20 py-16 border-t border-gray-900">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-xl font-light text-white mb-4">Still Need Help?</h2>
          <p className="text-gray-500 mb-8 text-sm">Our team is available to answer any questions.</p>
          <Link to="/sovereign" className="group inline-flex items-center gap-2 px-8 py-4 border-2 border-red-900 text-white text-sm tracking-wider hover:bg-red-900/10 transition-all">
            <Phone className="w-4 h-4 text-red-800" />
            <span>Contact Us</span>
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
export default SupportPage;