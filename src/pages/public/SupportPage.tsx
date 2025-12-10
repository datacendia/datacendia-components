import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, Mail, MessageSquare, Book, Clock, Shield, Phone } from 'lucide-react';

export const SupportPage: React.FC = () => {
  const supportChannels = [
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Get help from our technical team',
      action: 'support@datacendia.com',
      href: 'mailto:support@datacendia.com',
      availability: 'Response within 24 hours',
    },
    {
      icon: Book,
      title: 'Documentation',
      description: 'Self-service guides and tutorials',
      action: 'Browse Docs',
      href: '/docs',
      availability: 'Available 24/7',
    },
    {
      icon: MessageSquare,
      title: 'Enterprise Support',
      description: 'Dedicated support for licensed customers',
      action: 'Contact Account Manager',
      href: '/contact',
      availability: 'SLA-based response times',
    },
  ];

  const supportTiers = [
    {
      name: 'Standard',
      responseTime: '24 hours',
      channels: ['Email'],
      features: ['Documentation access', 'Community forums', 'Email support'],
    },
    {
      name: 'Enterprise',
      responseTime: '4 hours',
      channels: ['Email', 'Phone', 'Slack'],
      features: ['Priority queue', 'Dedicated CSM', 'Quarterly reviews', 'Training sessions'],
    },
    {
      name: 'Sovereign',
      responseTime: '1 hour',
      channels: ['Email', 'Phone', 'Slack', 'On-site'],
      features: ['24/7 support', 'Dedicated team', 'On-site visits', 'Custom SLA'],
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
            <Link to="/docs" className="text-neutral-600 hover:text-neutral-900">Docs</Link>
            <Link to="/contact" className="text-neutral-600 hover:text-neutral-900">Contact</Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-neutral-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <HelpCircle className="w-12 h-12 mx-auto mb-4 text-cyan-400" />
          <h1 className="text-3xl font-bold mb-4">Support</h1>
          <p className="text-neutral-400">
            We're here to help you succeed with Datacendia.
          </p>
        </div>
      </section>

      {/* Support Channels */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-semibold text-center mb-8">Get Help</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {supportChannels.map((channel, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200 text-center">
                <channel.icon className="w-10 h-10 mx-auto mb-4 text-neutral-700" />
                <h3 className="text-lg font-semibold mb-2">{channel.title}</h3>
                <p className="text-neutral-500 text-sm mb-4">{channel.description}</p>
                <a 
                  href={channel.href}
                  className="inline-block px-4 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 text-sm"
                >
                  {channel.action}
                </a>
                <p className="text-xs text-neutral-400 mt-3 flex items-center justify-center gap-1">
                  <Clock className="w-3 h-3" />
                  {channel.availability}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Support Tiers */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-semibold text-center mb-8">Support Tiers</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {supportTiers.map((tier, index) => (
              <div key={index} className={`rounded-xl p-6 border ${
                tier.name === 'Sovereign' 
                  ? 'bg-neutral-900 text-white border-neutral-700' 
                  : 'bg-neutral-50 border-neutral-200'
              }`}>
                <h3 className="text-lg font-semibold mb-2">{tier.name}</h3>
                <div className="flex items-center gap-2 mb-4">
                  <Clock className={`w-4 h-4 ${tier.name === 'Sovereign' ? 'text-cyan-400' : 'text-neutral-500'}`} />
                  <span className={`text-sm ${tier.name === 'Sovereign' ? 'text-neutral-300' : 'text-neutral-500'}`}>
                    {tier.responseTime} response
                  </span>
                </div>
                <ul className="space-y-2">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className={`text-sm flex items-center gap-2 ${
                      tier.name === 'Sovereign' ? 'text-neutral-300' : 'text-neutral-600'
                    }`}>
                      <Shield className={`w-3 h-3 ${tier.name === 'Sovereign' ? 'text-cyan-400' : 'text-neutral-400'}`} />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-xl font-semibold mb-4">Still Need Help?</h2>
          <p className="text-neutral-600 mb-6">
            Our team is available to answer any questions.
          </p>
          <Link 
            to="/contact" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800"
          >
            <Phone className="w-4 h-4" />
            Contact Us
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

export default SupportPage;
