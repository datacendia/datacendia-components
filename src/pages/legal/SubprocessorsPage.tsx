/**
 * Page — Subprocessors Page
 *
 * Lists all third-party subprocessors used by Datacendia Cloud-Hosted Services.
 *
 * @exports SubprocessorsPage
 * @module pages/legal/SubprocessorsPage
 */

// Copyright (c) 2024-2026 Datacendia, Inc. All Rights Reserved.
// See LICENSE file for details.

import React from 'react';
import { Link } from 'react-router-dom';
import { Server, CreditCard, Brain, Activity, Plug, ArrowLeft } from 'lucide-react';

interface Subprocessor {
  name: string;
  purpose: string;
  dataProcessed: string;
  location: string;
}

const Section: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  processors: Subprocessor[];
}> = ({ icon, title, description, processors }) => (
  <div className="mb-10">
    <div className="flex items-center gap-3 mb-2">
      {icon}
      <h2 className="text-xl font-semibold text-gray-100">{title}</h2>
    </div>
    <p className="text-sm text-gray-400 mb-4">{description}</p>
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-800">
            <th className="text-left py-3 px-4 text-gray-400 font-medium">Provider</th>
            <th className="text-left py-3 px-4 text-gray-400 font-medium">Purpose</th>
            <th className="text-left py-3 px-4 text-gray-400 font-medium">Data Processed</th>
            <th className="text-left py-3 px-4 text-gray-400 font-medium">Location</th>
          </tr>
        </thead>
        <tbody>
          {processors.map((p) => (
            <tr key={p.name} className="border-b border-gray-800/50 hover:bg-gray-800/30">
              <td className="py-3 px-4 text-gray-200 font-medium">{p.name}</td>
              <td className="py-3 px-4 text-gray-400">{p.purpose}</td>
              <td className="py-3 px-4 text-gray-400">{p.dataProcessed}</td>
              <td className="py-3 px-4 text-gray-400">{p.location}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export const SubprocessorsPage: React.FC = () => {
  const infrastructure: Subprocessor[] = [
    { name: 'Vercel', purpose: 'Frontend hosting, CDN', dataProcessed: 'Request metadata, static assets', location: 'US, EU (edge)' },
    { name: 'Railway / Render', purpose: 'Backend application hosting', dataProcessed: 'Application data, API requests', location: 'US' },
    { name: 'Neon / Supabase', purpose: 'PostgreSQL database', dataProcessed: 'All persistent Customer Data', location: 'US (configurable)' },
    { name: 'Upstash', purpose: 'Redis caching & rate limiting', dataProcessed: 'Session tokens, cached queries', location: 'US (configurable)' },
  ];

  const ai: Subprocessor[] = [
    { name: 'OpenAI', purpose: 'AI model inference (GPT-4)', dataProcessed: 'Deliberation prompts (not stored by provider)', location: 'US' },
    { name: 'Anthropic', purpose: 'AI model inference (Claude)', dataProcessed: 'Deliberation prompts (not stored by provider)', location: 'US' },
    { name: 'Google Cloud AI', purpose: 'AI model inference (Gemini)', dataProcessed: 'Deliberation prompts (not stored by provider)', location: 'US' },
    { name: 'Mistral AI', purpose: 'AI model inference (Mistral)', dataProcessed: 'Deliberation prompts (not stored by provider)', location: 'EU' },
  ];

  const payment: Subprocessor[] = [
    { name: 'Stripe', purpose: 'Payment processing', dataProcessed: 'Billing contact, payment tokens, invoices', location: 'US, EU' },
  ];

  const monitoring: Subprocessor[] = [
    { name: 'Sentry', purpose: 'Error tracking', dataProcessed: 'Error stack traces, request metadata (no Customer Data)', location: 'US' },
    { name: 'Resend', purpose: 'Transactional email', dataProcessed: 'Email addresses, notification content', location: 'US' },
  ];

  const connectors = [
    { name: 'Salesforce', type: 'CRM data sync' },
    { name: 'ServiceNow', type: 'IT service management' },
    { name: 'Jira', type: 'Issue tracking' },
    { name: 'Slack', type: 'Notifications & alerts' },
    { name: 'Microsoft Teams', type: 'Notifications & alerts' },
    { name: 'SAP', type: 'ERP data access' },
    { name: 'Oracle', type: 'Database/ERP integration' },
    { name: 'Workday', type: 'HR data access' },
    { name: 'HubSpot', type: 'Marketing/CRM sync' },
    { name: 'GitHub', type: 'Code governance' },
  ];

  return (
    <div className="min-h-screen bg-black text-gray-100">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Datacendia
        </Link>

        <h1 className="text-3xl font-bold mb-2">Subprocessor List</h1>
        <p className="text-gray-400 mb-2">
          Last updated: March 2026 &middot; Version 1.0
        </p>
        <p className="text-sm text-gray-500 mb-10">
          Datacendia provides at least 30 days' notice before adding a new subprocessor.
          To object, contact{' '}
          <a href="mailto:legal@datacendia.com" className="text-blue-400 hover:underline">
            legal@datacendia.com
          </a>{' '}
          within 15 days.
        </p>

        <div className="bg-blue-950/30 border border-blue-900/50 rounded-lg p-4 mb-10 text-sm text-blue-300">
          <strong>Self-Hosted &amp; Sovereign deployments:</strong> No subprocessors are used
          unless you explicitly enable third-party integrations. All processing occurs on your
          infrastructure.
        </div>

        <Section
          icon={<Server className="w-5 h-5 text-purple-400" />}
          title="Infrastructure"
          description="Underlying infrastructure for Cloud-Hosted Services."
          processors={infrastructure}
        />

        <Section
          icon={<Brain className="w-5 h-5 text-cyan-400" />}
          title="AI Model Providers (Cloud-Hosted Only)"
          description="CendiaGateway routes requests with PII detection and data minimization. Providers are contractually prohibited from training on your data."
          processors={ai}
        />

        <Section
          icon={<CreditCard className="w-5 h-5 text-green-400" />}
          title="Payment & Communication"
          description="Payment processing and transactional messaging."
          processors={[...payment, ...monitoring]}
        />

        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <Plug className="w-5 h-5 text-orange-400" />
            <h2 className="text-xl font-semibold text-gray-100">Customer-Enabled Integrations</h2>
          </div>
          <p className="text-sm text-gray-400 mb-4">
            These are <strong>not</strong> Datacendia subprocessors. Data flows directly between the
            Services and these systems using your credentials.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {connectors.map((c) => (
              <div key={c.name} className="bg-gray-900/50 border border-gray-800 rounded-lg p-3">
                <div className="text-sm font-medium text-gray-200">{c.name}</div>
                <div className="text-xs text-gray-500">{c.type}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 mt-8 text-sm text-gray-500">
          <p>
            Questions? Contact{' '}
            <a href="mailto:legal@datacendia.com" className="text-blue-400 hover:underline">
              legal@datacendia.com
            </a>
          </p>
          <div className="flex gap-4 mt-4">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link to="/security" className="hover:text-white transition-colors">Security</Link>
          </div>
        </div>
      </div>
    </div>
  );
};
