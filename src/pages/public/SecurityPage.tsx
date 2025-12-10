import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, Server, Eye, FileCheck, Users, AlertTriangle, CheckCircle } from 'lucide-react';

export const SecurityPage: React.FC = () => {
  const securityFeatures = [
    {
      icon: Lock,
      title: 'Encryption at Rest & Transit',
      description: 'AES-256-GCM encryption for all data at rest. TLS 1.3 for all data in transit.',
    },
    {
      icon: Server,
      title: 'Air-Gapped Deployment',
      description: 'Deploy entirely on your infrastructure with zero external dependencies or telemetry.',
    },
    {
      icon: Shield,
      title: 'Defense in Depth',
      description: 'Multi-layer security architecture with honeypots, rate limiting, and intrusion detection.',
    },
    {
      icon: Eye,
      title: 'Complete Audit Trail',
      description: 'Every action logged with user context, timestamps, and cryptographic integrity.',
    },
    {
      icon: Users,
      title: 'Enterprise Identity',
      description: 'Native support for Active Directory, SAML 2.0, OIDC, and PKI/Smart Card authentication.',
    },
    {
      icon: FileCheck,
      title: 'Compliance Ready',
      description: 'SOC 2 Type II, HIPAA, GDPR, and ISO 27001 controls built-in.',
    },
  ];

  const certifications = [
    { name: 'SOC 2 Type II', status: 'Ready' },
    { name: 'ISO 27001', status: 'Ready' },
    { name: 'HIPAA', status: 'Ready' },
    { name: 'GDPR', status: 'Compliant' },
    { name: 'FedRAMP', status: 'In Progress' },
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
            <Link to="/privacy" className="text-neutral-600 hover:text-neutral-900">Privacy</Link>
            <Link to="/terms" className="text-neutral-600 hover:text-neutral-900">Terms</Link>
            <Link to="/contact" className="text-neutral-600 hover:text-neutral-900">Contact</Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-neutral-900 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Shield className="w-16 h-16 mx-auto mb-6 text-cyan-400" />
          <h1 className="text-4xl font-bold mb-4">Security First</h1>
          <p className="text-xl text-neutral-400">
            Enterprise-grade security designed for sovereign deployments and regulated industries.
          </p>
        </div>
      </section>

      {/* Security Features */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center mb-12">Security Architecture</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {securityFeatures.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
                <feature.icon className="w-10 h-10 text-neutral-900 mb-4" />
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-neutral-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Compliance */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center mb-12">Compliance & Certifications</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {certifications.map((cert, index) => (
              <div key={index} className="text-center p-4 bg-neutral-50 rounded-lg">
                <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-600" />
                <div className="font-semibold text-sm">{cert.name}</div>
                <div className="text-xs text-neutral-500">{cert.status}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vulnerability Reporting */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-8">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-8 h-8 text-amber-600 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold mb-2">Security Vulnerability Reporting</h3>
                <p className="text-neutral-700 mb-4">
                  If you discover a security vulnerability, please report it responsibly. 
                  We take all reports seriously and will respond within 24 hours.
                </p>
                <a 
                  href="mailto:security@datacendia.com" 
                  className="inline-flex items-center gap-2 text-amber-700 font-medium hover:underline"
                >
                  security@datacendia.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-100 py-8 border-t border-neutral-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-neutral-500">
          <p>© {new Date().getFullYear()} Datacendia, Inc. All rights reserved.</p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <Link to="/privacy" className="hover:text-neutral-900">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-neutral-900">Terms of Service</Link>
            <Link to="/contact" className="hover:text-neutral-900">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SecurityPage;
