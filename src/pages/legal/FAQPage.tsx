/**
 * Page — Customer FAQ Page
 *
 * Enterprise customer frequently asked questions.
 *
 * @exports FAQPage
 * @module pages/legal/FAQPage
 */

// Copyright (c) 2024-2026 Datacendia, Inc. All Rights Reserved.
// See LICENSE file for details.

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ChevronDown, ChevronRight } from 'lucide-react';

interface FAQItem {
  q: string;
  a: string;
}

interface FAQSection {
  title: string;
  items: FAQItem[];
}

const Accordion: React.FC<{ item: FAQItem }> = ({ item }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-800/50">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start justify-between py-4 text-left group"
      >
        <span className="text-gray-200 font-medium pr-4 group-hover:text-white transition-colors">
          {item.q}
        </span>
        {open ? (
          <ChevronDown className="w-4 h-4 text-gray-500 mt-1 shrink-0" />
        ) : (
          <ChevronRight className="w-4 h-4 text-gray-500 mt-1 shrink-0" />
        )}
      </button>
      {open && (
        <div className="pb-4 text-sm text-gray-400 leading-relaxed whitespace-pre-line">
          {item.a}
        </div>
      )}
    </div>
  );
};

export const FAQPage: React.FC = () => {
  const sections: FAQSection[] = [
    {
      title: 'General',
      items: [
        {
          q: 'What is Datacendia?',
          a: 'Datacendia is an AI governance and decision intelligence platform. It provides a multi-agent Council that analyzes business decisions from multiple perspectives — legal, financial, ethical, operational, and strategic — then produces auditable, cryptographically signed decision records.',
        },
        {
          q: 'How is Datacendia different from ChatGPT or other AI tools?',
          a: 'Datacendia uses a multi-agent Council (14 agents, 5 frameworks) instead of a single model. Every decision produces a cryptographically signed Regulator\'s Receipt with a Merkle tree evidence chain. CendiaGateway provides PII detection, policy enforcement, and AI Manifest generation. It supports Cloud, Self-Hosted, and Sovereign (Air-Gapped) deployments.',
        },
      ],
    },
    {
      title: 'Pricing & Licensing',
      items: [
        {
          q: 'What are the pricing tiers?',
          a: 'Foundation ($50K/year), Intelligence ($150K/year), Governance ($500K/year), and Sovereign ($1.5M/year). Contact sales@datacendia.com for details.',
        },
        {
          q: 'How is licensing enforced?',
          a: 'Cloud-Hosted: Server-side middleware with Redis cache + database validation.\nSelf-Hosted / Sovereign: Cryptographically signed offline license file (.dcl format) using Ed25519 signatures — no internet required.',
        },
        {
          q: 'What happens if my license expires?',
          a: 'Cloud-Hosted: Access is suspended. Your data is retained for 90 days and can be exported.\nSelf-Hosted / Sovereign: The platform enters read-only mode. Existing data remains accessible. New deliberations require a renewed license file.',
        },
      ],
    },
    {
      title: 'Deployment',
      items: [
        {
          q: 'What deployment options are available?',
          a: '1. Cloud-Hosted (SaaS) — Datacendia manages everything at app.datacendia.com\n2. Self-Hosted (On-Premise) — You deploy using our Docker images and Helm charts\n3. Sovereign (Air-Gapped) — Fully isolated, zero outbound network, local AI models only',
        },
        {
          q: 'What infrastructure do I need for self-hosted?',
          a: 'Minimum: 4 CPU cores, 16GB RAM, 100GB storage, PostgreSQL 15+, Redis 7+\nRecommended: 8+ cores, 32GB RAM, 500GB SSD, GPU for local AI inference\nKubernetes: Helm chart provided. NVIDIA-optimized profiles available for DGX/A100/H100.',
        },
        {
          q: 'Does the sovereign deployment really have zero network requirements?',
          a: 'Yes. It uses locally hosted AI models (Ollama, vLLM, NVIDIA NIM), validates licensing via offline .dcl files, stores all data on your infrastructure, and makes no outbound network calls whatsoever.',
        },
      ],
    },
    {
      title: 'Security & Compliance',
      items: [
        {
          q: 'Does Datacendia train AI models on my data?',
          a: 'No. Datacendia never uses Customer Data to train, fine-tune, or improve AI models. All AI providers are contractually prohibited from doing so as well.',
        },
        {
          q: 'Where is my data stored?',
          a: 'Cloud-Hosted: In the region specified in your Order Form (US or EU).\nSelf-Hosted / Sovereign: Entirely on your infrastructure. Datacendia has zero access.',
        },
        {
          q: 'What security certifications does Datacendia have?',
          a: 'SOC 2 Type II: Architecture aligned, formal audit planned.\nISO 27001: Architecture aligned, certification on contract (Enterprise tier).\nGDPR: Design-compliant, DPA available.\nISO 42001 (AI Management): Self-assessment completed.',
        },
        {
          q: 'How do you handle PII?',
          a: 'CendiaGateway includes a PII detector scanning for 10 types (SSN, credit card, email, phone, IP, DOB, medical records, bank accounts, passport numbers, driver\'s licenses) before any data reaches AI model providers. PII can be automatically redacted, flagged, or blocked based on your gateway policies.',
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          q: 'What support channels are available?',
          a: 'Foundation: Email\nIntelligence: Email + Chat\nGovernance: Email + Chat + Phone + Dedicated CSM + Slack\nSovereign: Same as Governance with 24/7 coverage',
        },
        {
          q: 'What are the response times?',
          a: 'Critical (service down): 1 hour (Governance/Sovereign), 4 hours (Intelligence), 24 hours (Foundation)\nHigh (major feature impaired): 4 hours / 8 hours / 48 hours\nMedium: 8 hours / 24 hours / 72 hours\nLow: 24 hours / 48 hours / 5 days',
        },
        {
          q: 'Where can I check service status?',
          a: 'Visit app.datacendia.com/status for real-time platform health, component status, and active incidents.',
        },
      ],
    },
    {
      title: 'Data & Privacy',
      items: [
        {
          q: 'Can I export my data?',
          a: 'Yes. Go to Settings > Data Export to download your data at any time in standard JSON format.',
        },
        {
          q: 'What happens to my data if I cancel?',
          a: 'You may export all data before cancellation. Customer Data is deleted within 30 days. Backups are purged within 90 days. Billing records are retained for 7 years per tax/legal requirements.',
        },
        {
          q: 'Do you sell my data?',
          a: 'No. Datacendia does not sell, share, or monetize Customer Data in any way.',
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-black text-gray-100">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Datacendia
        </Link>

        <h1 className="text-3xl font-bold mb-2">Frequently Asked Questions</h1>
        <p className="text-gray-400 mb-10">
          Everything you need to know about Datacendia. Can't find what you're looking for?{' '}
          <a href="mailto:support@datacendia.com" className="text-blue-400 hover:underline">
            Contact support
          </a>
          .
        </p>

        {sections.map((section) => (
          <div key={section.title} className="mb-8">
            <h2 className="text-lg font-semibold text-gray-300 mb-2">{section.title}</h2>
            <div className="bg-gray-900/30 border border-gray-800 rounded-lg px-5">
              {section.items.map((item) => (
                <Accordion key={item.q} item={item} />
              ))}
            </div>
          </div>
        ))}

        <div className="border-t border-gray-800 pt-8 mt-8 text-sm text-gray-500">
          <p className="mb-2">
            In case of conflict between this FAQ and the{' '}
            <Link to="/terms" className="text-blue-400 hover:underline">Master SaaS Agreement</Link>,
            the MSA governs.
          </p>
          <div className="flex flex-wrap gap-4 mt-4">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link to="/security" className="hover:text-white transition-colors">Security</Link>
            <Link to="/subprocessors" className="hover:text-white transition-colors">Subprocessors</Link>
            <Link to="/status" className="hover:text-white transition-colors">Status</Link>
          </div>
        </div>
      </div>
    </div>
  );
};
