import React from 'react';
import { Link } from 'react-router-dom';
import { History, Sparkles, Bug, Zap, Shield } from 'lucide-react';

export const ChangelogPage: React.FC = () => {
  const releases = [
    {
      version: '2.4.0',
      date: 'December 2024',
      type: 'major',
      highlights: [
        { icon: Sparkles, text: 'Chronos temporal intelligence - navigate your org through time' },
        { icon: Sparkles, text: 'Department-level metrics with org comparison' },
        { icon: Zap, text: 'Performance improvements to Knowledge Graph rendering' },
        { icon: Shield, text: 'Enhanced SAML 2.0 and OIDC support' },
      ],
    },
    {
      version: '2.3.0',
      date: 'November 2024',
      type: 'major',
      highlights: [
        { icon: Sparkles, text: 'Sovereign theme and branding overhaul' },
        { icon: Sparkles, text: 'Air-gapped deployment package builder' },
        { icon: Zap, text: 'Redis-backed rate limiting for enterprise scale' },
        { icon: Bug, text: 'Fixed 404 errors on footer navigation links' },
      ],
    },
    {
      version: '2.2.0',
      date: 'October 2024',
      type: 'major',
      highlights: [
        { icon: Sparkles, text: 'Pre-Mortem analysis for proactive risk assessment' },
        { icon: Sparkles, text: 'Ghost Board for stakeholder simulation' },
        { icon: Zap, text: 'Command palette with keyboard shortcuts' },
        { icon: Shield, text: 'Defense in depth security architecture' },
      ],
    },
    {
      version: '2.1.0',
      date: 'September 2024',
      type: 'minor',
      highlights: [
        { icon: Sparkles, text: 'Decision DNA pattern recognition' },
        { icon: Zap, text: 'Improved Council deliberation performance' },
        { icon: Bug, text: 'Fixed timezone issues in audit logs' },
      ],
    },
    {
      version: '2.0.0',
      date: 'August 2024',
      type: 'major',
      highlights: [
        { icon: Sparkles, text: 'Complete platform redesign' },
        { icon: Sparkles, text: 'Multi-agent AI Council' },
        { icon: Sparkles, text: 'Knowledge Graph Explorer' },
        { icon: Shield, text: 'SOC 2 Type II compliance' },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-neutral-900 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">D</span>
            </div>
            <span className="text-xl font-bold text-neutral-900">Datacendia</span>
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link to="/product" className="text-neutral-600 hover:text-neutral-900">Product</Link>
            <Link to="/docs" className="text-neutral-600 hover:text-neutral-900">Docs</Link>
            <Link to="/contact" className="text-neutral-600 hover:text-neutral-900">Contact</Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-neutral-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <History className="w-12 h-12 mx-auto mb-4 text-cyan-400" />
          <h1 className="text-3xl font-bold mb-4">Changelog</h1>
          <p className="text-neutral-400">
            What's new in Datacendia. All releases, updates, and improvements.
          </p>
        </div>
      </section>

      {/* Releases */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {releases.map((release, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-2xl font-bold">v{release.version}</span>
                  <span className={`px-2 py-1 text-xs font-medium rounded ${
                    release.type === 'major' 
                      ? 'bg-cyan-100 text-cyan-700' 
                      : 'bg-neutral-100 text-neutral-600'
                  }`}>
                    {release.type === 'major' ? 'Major Release' : 'Minor Release'}
                  </span>
                  <span className="text-sm text-neutral-500">{release.date}</span>
                </div>
                <ul className="space-y-3">
                  {release.highlights.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start gap-3">
                      <item.icon className={`w-5 h-5 flex-shrink-0 ${
                        item.icon === Sparkles ? 'text-cyan-500' :
                        item.icon === Zap ? 'text-amber-500' :
                        item.icon === Bug ? 'text-green-500' :
                        'text-violet-500'
                      }`} />
                      <span className="text-neutral-700">{item.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-100 py-8 border-t border-neutral-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-neutral-500">
          <p>© {new Date().getFullYear()} Datacendia, Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default ChangelogPage;
