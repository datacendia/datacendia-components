/**
 * Page — AI Use Disclosure Page
 *
 * Describes how Datacendia uses AI, what models power the platform,
 * data minimization practices, and customer controls.
 *
 * @exports AIDisclosurePage
 * @module pages/legal/AIDisclosurePage
 */

// Copyright (c) 2024-2026 Datacendia, Inc. All Rights Reserved.
// See LICENSE file for details.

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Brain, Shield, Eye, Settings, AlertTriangle, Scale } from 'lucide-react';

export const AIDisclosurePage: React.FC = () => {
  const models = [
    { provider: 'OpenAI', models: 'GPT-4, GPT-4o, GPT-4o-mini', region: 'US', training: false },
    { provider: 'Anthropic', models: 'Claude 3.5 Sonnet, Claude 3 Opus', region: 'US', training: false },
    { provider: 'Google', models: 'Gemini 1.5 Pro, Gemini 1.5 Flash', region: 'US', training: false },
    { provider: 'Mistral AI', models: 'Mistral Large, Mixtral 8x22B', region: 'EU', training: false },
  ];

  const selfHostedBackends = [
    { name: 'Ollama', desc: 'Llama 3, Mistral, Phi-3, CodeLlama, any GGUF model' },
    { name: 'vLLM', desc: 'Any HuggingFace-compatible model' },
    { name: 'NVIDIA NIM', desc: 'Optimized inference on NVIDIA GPUs (A100, H100, H200)' },
    { name: 'NVIDIA Triton', desc: 'Multi-model serving with batching' },
  ];

  const guardrails = [
    'Jailbreak detection',
    'Harmful intent blocking',
    'Topic boundary enforcement',
    'Hallucination detection',
    'PII leakage prevention',
    'Bias and fairness checks',
    'Financial disclaimer enforcement',
    'Medical safety guardrails',
    'Response grounding verification',
  ];

  return (
    <div className="min-h-screen bg-black text-gray-100">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Datacendia
        </Link>

        <h1 className="text-3xl font-bold mb-2">AI Use Disclosure</h1>
        <p className="text-gray-400 mb-10">
          Last updated: March 2026 &middot; How Datacendia uses artificial intelligence,
          what controls you have, and how your data is protected.
        </p>

        {/* Council Overview */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <Brain className="w-5 h-5 text-purple-400" />
            <h2 className="text-xl font-semibold">How AI Is Used</h2>
          </div>
          <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-5 text-sm text-gray-400 space-y-3">
            <p>
              The core feature of Datacendia is the <strong className="text-gray-200">AI Council</strong> —
              multiple AI agents that analyze a decision from different perspectives (legal, financial,
              ethical, operational, strategic, regulatory).
            </p>
            <p>
              <strong className="text-gray-200">Input:</strong> A decision prompt provided by the user, plus relevant context.
            </p>
            <p>
              <strong className="text-gray-200">Output:</strong> Individual agent analyses, a synthesized recommendation,
              confidence scores, and dissenting opinions.
            </p>
            <p>
              <strong className="text-gray-200">Audit:</strong> Every deliberation produces a cryptographically signed
              Regulator's Receipt with a Merkle tree evidence chain.
            </p>
            <p>
              Datacendia does <strong className="text-gray-200">not</strong> make automated decisions that produce
              legal effects without human review. The Council provides recommendations — humans make the final decision.
            </p>
          </div>
        </section>

        {/* Cloud Models */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <Eye className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-semibold">AI Models — Cloud-Hosted</h2>
          </div>
          <p className="text-sm text-gray-400 mb-4">
            All providers are contractually prohibited from using Customer Data for model training.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Provider</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Models</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Region</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Trains on Data?</th>
                </tr>
              </thead>
              <tbody>
                {models.map((m) => (
                  <tr key={m.provider} className="border-b border-gray-800/50">
                    <td className="py-3 px-4 text-gray-200 font-medium">{m.provider}</td>
                    <td className="py-3 px-4 text-gray-400">{m.models}</td>
                    <td className="py-3 px-4 text-gray-400">{m.region}</td>
                    <td className="py-3 px-4 text-red-400 font-medium">No</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Self-Hosted */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <Settings className="w-5 h-5 text-green-400" />
            <h2 className="text-xl font-semibold">AI Models — Self-Hosted &amp; Sovereign</h2>
          </div>
          <div className="bg-blue-950/30 border border-blue-900/50 rounded-lg p-4 mb-4 text-sm text-blue-300">
            In Self-Hosted and Sovereign modes, <strong>no Customer Data leaves your network</strong>.
            You provide your own model servers.
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {selfHostedBackends.map((b) => (
              <div key={b.name} className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
                <div className="text-sm font-medium text-gray-200">{b.name}</div>
                <div className="text-xs text-gray-500 mt-1">{b.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Data Minimization */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <Shield className="w-5 h-5 text-yellow-400" />
            <h2 className="text-xl font-semibold">Data Minimization &amp; CendiaGateway</h2>
          </div>
          <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-5 text-sm text-gray-400 space-y-3">
            <p>All AI requests in Cloud-Hosted mode pass through <strong className="text-gray-200">CendiaGateway</strong>, which:</p>
            <ul className="space-y-2 ml-4">
              <li className="flex gap-2"><span className="text-yellow-400">&#8226;</span> Scans for 10 PII types before data reaches any model provider</li>
              <li className="flex gap-2"><span className="text-yellow-400">&#8226;</span> Enforces configurable policies for data classification and permitted topics</li>
              <li className="flex gap-2"><span className="text-yellow-400">&#8226;</span> Logs every AI request/response with latency, token counts, and policy decisions</li>
              <li className="flex gap-2"><span className="text-yellow-400">&#8226;</span> Generates tamper-evident AI Manifest for compliance audits</li>
              <li className="flex gap-2"><span className="text-yellow-400">&#8226;</span> Only sends the minimum context required for inference — never full databases or user profiles</li>
            </ul>
          </div>
        </section>

        {/* Guardrails */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <AlertTriangle className="w-5 h-5 text-orange-400" />
            <h2 className="text-xl font-semibold">Safety Guardrails (NVIDIA NeMo)</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {guardrails.map((g, i) => (
              <div key={i} className="bg-gray-900/50 border border-gray-800 rounded-lg px-4 py-3 text-sm text-gray-300">
                {g}
              </div>
            ))}
          </div>
        </section>

        {/* Customer Controls */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <Settings className="w-5 h-5 text-blue-400" />
            <h2 className="text-xl font-semibold">Your Controls</h2>
          </div>
          <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-5 text-sm text-gray-400 space-y-3">
            <p><strong className="text-gray-200">Model selection:</strong> Choose which providers are used, or bring your own models.</p>
            <p><strong className="text-gray-200">Gateway policies:</strong> Block data classifications, require PII redaction, restrict providers, set rate limits.</p>
            <p><strong className="text-gray-200">Opt-out:</strong> Disable AI features entirely and use Datacendia as a decision documentation platform only.</p>
            <p><strong className="text-gray-200">Full audit trail:</strong> Export complete AI interaction logs at any time.</p>
          </div>
        </section>

        {/* EU AI Act */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <Scale className="w-5 h-5 text-indigo-400" />
            <h2 className="text-xl font-semibold">EU AI Act Classification</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Component</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Risk Level</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Rationale</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-800/50">
                  <td className="py-3 px-4 text-gray-200">Council Deliberation</td>
                  <td className="py-3 px-4 text-yellow-400">Varies by use case</td>
                  <td className="py-3 px-4 text-gray-400">Depends on decision domain (e.g., HR = high-risk under Annex III)</td>
                </tr>
                <tr className="border-b border-gray-800/50">
                  <td className="py-3 px-4 text-gray-200">CendiaGateway</td>
                  <td className="py-3 px-4 text-green-400">Minimal risk</td>
                  <td className="py-3 px-4 text-gray-400">Infrastructure/governance layer</td>
                </tr>
                <tr className="border-b border-gray-800/50">
                  <td className="py-3 px-4 text-gray-200">NeMo Guardrails</td>
                  <td className="py-3 px-4 text-green-400">Minimal risk</td>
                  <td className="py-3 px-4 text-gray-400">Safety and compliance checking</td>
                </tr>
                <tr className="border-b border-gray-800/50">
                  <td className="py-3 px-4 text-gray-200">DCII (Audit/Evidence)</td>
                  <td className="py-3 px-4 text-green-400">Minimal risk</td>
                  <td className="py-3 px-4 text-gray-400">Documentation and transparency tooling</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Disclaimers */}
        <section className="mb-10">
          <div className="bg-yellow-950/30 border border-yellow-900/50 rounded-lg p-4 text-sm text-yellow-300">
            <strong>AI Limitations:</strong> AI models may produce inaccurate, incomplete, or biased outputs.
            Datacendia's multi-agent Council is designed to surface conflicting perspectives, but AI outputs
            are recommendations, not decisions. All outputs should be reviewed by qualified humans.
          </div>
        </section>

        <div className="border-t border-gray-800 pt-8 mt-8 text-sm text-gray-500">
          <p>
            Questions? Contact{' '}
            <a href="mailto:legal@datacendia.com" className="text-blue-400 hover:underline">
              legal@datacendia.com
            </a>
          </p>
          <div className="flex flex-wrap gap-4 mt-4">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link to="/security" className="hover:text-white transition-colors">Security</Link>
            <Link to="/subprocessors" className="hover:text-white transition-colors">Subprocessors</Link>
          </div>
        </div>
      </div>
    </div>
  );
};
