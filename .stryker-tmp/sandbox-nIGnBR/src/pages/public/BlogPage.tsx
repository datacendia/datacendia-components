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
import { FileText, Calendar, ArrowRight, User } from 'lucide-react';
const ParticleField: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (stryMutAct_9fa48("52351") ? false : stryMutAct_9fa48("52350") ? true : stryMutAct_9fa48("52349") ? canvas : (stryCov_9fa48("52349", "52350", "52351"), !canvas)) return;
    const ctx = canvas.getContext('2d');
    if (stryMutAct_9fa48("52355") ? false : stryMutAct_9fa48("52354") ? true : stryMutAct_9fa48("52353") ? ctx : (stryCov_9fa48("52353", "52354", "52355"), !ctx)) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
    }[] = stryMutAct_9fa48("52356") ? ["Stryker was here"] : (stryCov_9fa48("52356"), []);
    for (let i = 0; stryMutAct_9fa48("52359") ? i >= 25 : stryMutAct_9fa48("52358") ? i <= 25 : stryMutAct_9fa48("52357") ? false : (stryCov_9fa48("52357", "52358", "52359"), i < 25); stryMutAct_9fa48("52360") ? i-- : (stryCov_9fa48("52360"), i++)) {
      particles.push(stryMutAct_9fa48("52362") ? {} : (stryCov_9fa48("52362"), {
        x: stryMutAct_9fa48("52363") ? Math.random() / canvas.width : (stryCov_9fa48("52363"), Math.random() * canvas.width),
        y: stryMutAct_9fa48("52364") ? Math.random() / canvas.height : (stryCov_9fa48("52364"), Math.random() * canvas.height),
        vx: stryMutAct_9fa48("52365") ? (Math.random() - 0.5) / 0.15 : (stryCov_9fa48("52365"), (stryMutAct_9fa48("52366") ? Math.random() + 0.5 : (stryCov_9fa48("52366"), Math.random() - 0.5)) * 0.15),
        vy: stryMutAct_9fa48("52367") ? (Math.random() - 0.5) / 0.15 : (stryCov_9fa48("52367"), (stryMutAct_9fa48("52368") ? Math.random() + 0.5 : (stryCov_9fa48("52368"), Math.random() - 0.5)) * 0.15),
        size: stryMutAct_9fa48("52369") ? Math.random() * 1.5 - 0.5 : (stryCov_9fa48("52369"), (stryMutAct_9fa48("52370") ? Math.random() / 1.5 : (stryCov_9fa48("52370"), Math.random() * 1.5)) + 0.5),
        opacity: stryMutAct_9fa48("52371") ? Math.random() * 0.25 - 0.05 : (stryCov_9fa48("52371"), (stryMutAct_9fa48("52372") ? Math.random() / 0.25 : (stryCov_9fa48("52372"), Math.random() * 0.25)) + 0.05)
      }));
    }
    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        stryMutAct_9fa48("52375") ? p.x -= p.vx : (stryCov_9fa48("52375"), p.x += p.vx);
        stryMutAct_9fa48("52376") ? p.y -= p.vy : (stryCov_9fa48("52376"), p.y += p.vy);
        if (stryMutAct_9fa48("52380") ? p.x >= 0 : stryMutAct_9fa48("52379") ? p.x <= 0 : stryMutAct_9fa48("52378") ? false : stryMutAct_9fa48("52377") ? true : (stryCov_9fa48("52377", "52378", "52379", "52380"), p.x < 0)) p.x = canvas.width;
        if (stryMutAct_9fa48("52384") ? p.x <= canvas.width : stryMutAct_9fa48("52383") ? p.x >= canvas.width : stryMutAct_9fa48("52382") ? false : stryMutAct_9fa48("52381") ? true : (stryCov_9fa48("52381", "52382", "52383", "52384"), p.x > canvas.width)) p.x = 0;
        if (stryMutAct_9fa48("52388") ? p.y >= 0 : stryMutAct_9fa48("52387") ? p.y <= 0 : stryMutAct_9fa48("52386") ? false : stryMutAct_9fa48("52385") ? true : (stryCov_9fa48("52385", "52386", "52387", "52388"), p.y < 0)) p.y = canvas.height;
        if (stryMutAct_9fa48("52392") ? p.y <= canvas.height : stryMutAct_9fa48("52391") ? p.y >= canvas.height : stryMutAct_9fa48("52390") ? false : stryMutAct_9fa48("52389") ? true : (stryCov_9fa48("52389", "52390", "52391", "52392"), p.y > canvas.height)) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, stryMutAct_9fa48("52393") ? Math.PI / 2 : (stryCov_9fa48("52393"), Math.PI * 2));
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
  }, stryMutAct_9fa48("52399") ? ["Stryker was here"] : (stryCov_9fa48("52399"), []));
  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
};
export const BlogPage: React.FC = () => {
  const posts = stryMutAct_9fa48("52401") ? [] : (stryCov_9fa48("52401"), [stryMutAct_9fa48("52402") ? {} : (stryCov_9fa48("52402"), {
    title: 'Introducing Chronos: See Your Organization Through Time',
    excerpt: 'Navigate your company\'s past, present, and future with our new temporal intelligence feature.',
    date: 'December 2024',
    author: 'Datacendia Team',
    category: 'Product',
    href: '/cortex/intelligence/chronos'
  }), stryMutAct_9fa48("52409") ? {} : (stryCov_9fa48("52409"), {
    title: 'The Case for Sovereign AI Deployment',
    excerpt: 'Why enterprises need complete control over their AI infrastructure and decision systems.',
    date: 'November 2024',
    author: 'Datacendia Team',
    category: 'Insights',
    href: '/manifesto'
  }), stryMutAct_9fa48("52416") ? {} : (stryCov_9fa48("52416"), {
    title: 'Decision Intelligence: Beyond Business Intelligence',
    excerpt: 'How AI-powered decision councils are transforming enterprise strategy.',
    date: 'October 2024',
    author: 'Datacendia Team',
    category: 'Insights',
    href: '/product'
  }), stryMutAct_9fa48("52423") ? {} : (stryCov_9fa48("52423"), {
    title: 'Air-Gapped Deployment Guide',
    excerpt: 'Complete walkthrough for deploying Datacendia on isolated, secure networks.',
    date: 'September 2024',
    author: 'Datacendia Team',
    category: 'Technical',
    href: '/docs'
  })]);
  return <div className="min-h-screen bg-black text-white font-light antialiased selection:bg-red-900/30 relative overflow-hidden">
      <ParticleField />
      <div className="fixed inset-0 pointer-events-none z-10" style={stryMutAct_9fa48("52430") ? {} : (stryCov_9fa48("52430"), {
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
            <Link to="/blog" className="text-red-900">BLOG</Link>
            <Link to="/docs" className="text-gray-500 hover:text-white transition-colors">DOCS</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-20 py-24">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <FileText className="w-10 h-10 mx-auto mb-4 text-red-900" />
          <p className="text-xs tracking-[0.4em] text-gray-600 uppercase mb-6">INSIGHTS</p>
          <h1 className="text-3xl font-extralight tracking-wide mb-4">Blog & Insights</h1>
          <p className="text-gray-500">
            Thoughts on decision intelligence, sovereign AI, and enterprise technology.
          </p>
        </div>
      </section>

      {/* Posts */}
      <section className="relative z-20 py-12">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="space-y-6">
            {posts.map(stryMutAct_9fa48("52432") ? () => undefined : (stryCov_9fa48("52432"), (post, index) => <article key={index} className="bg-black/50 backdrop-blur-sm border border-gray-800 hover:border-red-900/30 rounded p-6 transition-colors">
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                  <span className="px-2 py-1 bg-red-900/20 text-red-400 rounded border border-red-900/30">
                    {post.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {post.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {post.author}
                  </span>
                </div>
                <h2 className="text-lg font-medium text-white mb-2">{post.title}</h2>
                <p className="text-gray-500 text-sm mb-4">{post.excerpt}</p>
                <Link to={post.href} className="inline-flex items-center gap-2 text-red-900 text-sm hover:text-red-700 transition-colors">
                  Read more <ArrowRight className="w-3 h-3" />
                </Link>
              </article>))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="relative z-20 py-16 border-t border-gray-900">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-xl font-light text-white mb-4">Stay Updated</h2>
          <p className="text-gray-500 mb-8 text-sm">
            Get notified about new features and insights.
          </p>
          <Link to="/sovereign" className="group inline-flex items-center gap-2 px-8 py-4 border-2 border-red-900 text-white text-sm tracking-wider hover:bg-red-900/10 transition-all">
            <span>Subscribe</span>
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
export default BlogPage;