import React from 'react';
import { Link } from 'react-router-dom';
import { Book, Code, Server, Shield, Zap, Users, ExternalLink } from 'lucide-react';

export const DocsPage: React.FC = () => {
  const docSections = [
    {
      icon: Zap,
      title: 'Getting Started',
      description: 'Quick start guide for new users',
      links: [
        { label: 'Platform Overview', href: '/cortex' },
        { label: 'First Login', href: '/login' },
        { label: 'Dashboard Tour', href: '/cortex/dashboard' },
      ],
    },
    {
      icon: Book,
      title: 'Core Concepts',
      description: 'Understanding Decision Intelligence',
      links: [
        { label: 'Knowledge Graph', href: '/cortex/graph' },
        { label: 'AI Council', href: '/cortex/council' },
        { label: 'Chronos Timeline', href: '/cortex/intelligence/chronos' },
      ],
    },
    {
      icon: Code,
      title: 'API Reference',
      description: 'REST API documentation',
      links: [
        { label: 'Authentication', href: '/cortex/security' },
        { label: 'Endpoints', href: '/cortex/data' },
        { label: 'Webhooks', href: '/cortex/bridge/integrations' },
      ],
    },
    {
      icon: Server,
      title: 'Deployment',
      description: 'Installation and configuration',
      links: [
        { label: 'Docker Setup', href: '/contact' },
        { label: 'Air-Gapped Install', href: '/contact' },
        { label: 'Enterprise SSO', href: '/contact' },
      ],
    },
    {
      icon: Shield,
      title: 'Security',
      description: 'Security architecture and compliance',
      links: [
        { label: 'Security Overview', href: '/security' },
        { label: 'Compliance', href: '/security' },
        { label: 'Audit Logs', href: '/cortex/security/audit' },
      ],
    },
    {
      icon: Users,
      title: 'Administration',
      description: 'Managing users and settings',
      links: [
        { label: 'User Management', href: '/cortex/settings/users' },
        { label: 'Roles & Permissions', href: '/cortex/settings/roles' },
        { label: 'Organization Settings', href: '/cortex/settings/organization' },
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
            <Link to="/pricing" className="text-neutral-600 hover:text-neutral-900">Pricing</Link>
            <Link to="/contact" className="text-neutral-600 hover:text-neutral-900">Contact</Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-neutral-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Book className="w-12 h-12 mx-auto mb-4 text-cyan-400" />
          <h1 className="text-3xl font-bold mb-4">Documentation</h1>
          <p className="text-neutral-400">
            Everything you need to get started with the Datacendia platform.
          </p>
        </div>
      </section>

      {/* Doc Sections */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {docSections.map((section, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
                <section.icon className="w-8 h-8 text-neutral-700 mb-4" />
                <h2 className="text-lg font-semibold mb-2">{section.title}</h2>
                <p className="text-neutral-500 text-sm mb-4">{section.description}</p>
                <ul className="space-y-2">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link 
                        to={link.href} 
                        className="flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900"
                      >
                        <ExternalLink className="w-3 h-3" />
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact for Full Docs */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-xl font-semibold mb-4">Need Full Documentation?</h2>
          <p className="text-neutral-600 mb-6">
            Complete API documentation and deployment guides are provided during onboarding 
            for licensed customers.
          </p>
          <Link 
            to="/contact" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800"
          >
            Request Access
          </Link>
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

export default DocsPage;
