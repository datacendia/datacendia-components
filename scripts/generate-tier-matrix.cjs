/**
 * generate-tier-matrix.cjs
 * Reads SubscriptionTiers.ts and generates a human-readable tier-to-feature matrix.
 * Ensures pricing pages and marketing materials can reference verified feature availability.
 *
 * Run: node scripts/generate-tier-matrix.cjs
 * Output: docs/TIER-FEATURE-MATRIX.md
 */
const fs = require('fs');
const path = require('path');

const SOURCE = path.resolve(__dirname, '..', 'backend', 'src', 'core', 'subscriptions', 'SubscriptionTiers.ts');
const OUTPUT = path.resolve(__dirname, '..', 'docs', 'TIER-FEATURE-MATRIX.md');

// ── Parse tier configs from TypeScript source ────────────────────────────────

const content = fs.readFileSync(SOURCE, 'utf8');

// Extract tier names and their feature booleans
const tiers = ['pilot', 'foundation', 'enterprise', 'strategic'];

function extractFeatures(tierName) {
  // Find the tier config block
  const tierRegex = new RegExp(`${tierName}:\\s*\\{[\\s\\S]*?features:\\s*\\{([\\s\\S]*?)\\}\\s*,\\s*\\n\\s*limits:`, 'i');
  const match = content.match(tierRegex);
  if (!match) return {};

  const featuresBlock = match[1];
  const features = {};

  // Extract simple boolean features
  const boolRegex = /(\w+):\s*(true|false)/g;
  let m;
  while ((m = boolRegex.exec(featuresBlock)) !== null) {
    features[m[1]] = m[2] === 'true';
  }

  return features;
}

function extractLimits(tierName) {
  const limitsRegex = new RegExp(`${tierName}:[\\s\\S]*?limits:\\s*\\{([^}]+)\\}`, 'i');
  const match = content.match(limitsRegex);
  if (!match) return {};

  const limitsBlock = match[1];
  const limits = {};
  const numRegex = /(\w+):\s*(-?\d+)/g;
  let m;
  while ((m = numRegex.exec(limitsBlock)) !== null) {
    limits[m[1]] = parseInt(m[2]);
  }
  return limits;
}

function extractPricing(tierName) {
  const pricingRegex = new RegExp(`${tierName}:[\\s\\S]*?pricing:\\s*\\{([^}]+)\\}`, 'i');
  const match = content.match(pricingRegex);
  if (!match) return {};

  const block = match[1];
  const labelMatch = block.match(/label:\s*['"](.+?)['"]/);
  return {
    label: labelMatch ? labelMatch[1] : 'N/A',
  };
}

// ── Build matrix ─────────────────────────────────────────────────────────────

const tierData = {};
for (const tier of tiers) {
  tierData[tier] = {
    features: extractFeatures(tier),
    limits: extractLimits(tier),
    pricing: extractPricing(tier),
  };
}

// Categorize features
const featureCategories = {
  'Foundation Pillars': ['theCouncil', 'decide', 'dcii'],
  'Foundation Services': ['preMortem', 'ghostBoard', 'decisionDebt', 'chronos', 'ninePrivimitives', 'evidenceVault', 'regulatorsReceipt', 'iissScoring', 'biasMitigation'],
  'Enterprise Pillars': ['stressTest', 'comply', 'govern', 'sovereign', 'operate'],
  'Enterprise Services': ['crucible', 'redTeam', 'warGames', 'complianceMonitor', 'regulatoryAbsorb', 'complianceGuard', 'policyEngine', 'dissent', 'autopilot', 'sovereignDeploy', 'postQuantumKMS', 'departmentCopilots', 'omniTranslate', 'apotheosis'],
  'Strategic Pillars': ['collapse', 'sgas', 'verticals', 'frontier'],
  'Strategic Services': ['collapseAgents', 'sgasSimulation', 'deepVerticals', 'nationScale'],
  'Integration': ['customConnectors', 'apiAccess', 'webhooks', 'ssoIntegration', 'auditLogs', 'customBranding', 'whiteLabeling', 'airGapDeploy'],
};

// ── Generate Markdown ────────────────────────────────────────────────────────

const lines = [
  '# Tier-to-Feature Matrix',
  '',
  `> **Auto-generated** on ${new Date().toISOString().split('T')[0]} from \`backend/src/core/subscriptions/SubscriptionTiers.ts\``,
  '> Do not edit manually — regenerate with `node scripts/generate-tier-matrix.cjs`',
  '',
  '## Pricing',
  '',
  '| Tier | Pricing |',
  '|------|---------|',
  ...tiers.map(t => `| **${t.charAt(0).toUpperCase() + t.slice(1)}** | ${tierData[t].pricing.label} |`),
  '',
];

// Feature matrix by category
for (const [category, features] of Object.entries(featureCategories)) {
  lines.push(`## ${category}`, '');
  lines.push(`| Feature | ${tiers.map(t => `**${t.charAt(0).toUpperCase() + t.slice(1)}**`).join(' | ')} |`);
  lines.push(`|---------|${tiers.map(() => '---').join(' | ')} |`);

  for (const feat of features) {
    const cells = tiers.map(t => {
      const val = tierData[t].features[feat];
      return val === true ? '✓' : val === false ? '—' : '?';
    });
    lines.push(`| \`${feat}\` | ${cells.join(' | ')} |`);
  }
  lines.push('');
}

// Limits table
lines.push('## Usage Limits', '');
lines.push(`| Limit | ${tiers.map(t => `**${t.charAt(0).toUpperCase() + t.slice(1)}**`).join(' | ')} |`);
lines.push(`|-------|${tiers.map(() => '---').join(' | ')} |`);

const limitKeys = Object.keys(tierData.pilot.limits);
for (const key of limitKeys) {
  const cells = tiers.map(t => {
    const val = tierData[t].limits[key];
    return val === -1 ? 'Unlimited' : val?.toLocaleString() ?? '?';
  });
  lines.push(`| \`${key}\` | ${cells.join(' | ')} |`);
}

lines.push('');
lines.push('---');
lines.push('');
lines.push('*This matrix is the source of truth for pricing pages and marketing materials. If a feature is listed as `—` for a tier, it must not be marketed as available at that tier.*');
lines.push('');

const md = lines.join('\n');
fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
fs.writeFileSync(OUTPUT, md, 'utf8');

// Stats
const totalFeatures = Object.values(featureCategories).flat().length;
const pilotEnabled = Object.values(tierData.pilot.features).filter(v => v === true).length;
const foundationEnabled = Object.values(tierData.foundation.features).filter(v => v === true).length;
const enterpriseEnabled = Object.values(tierData.enterprise.features).filter(v => v === true).length;
const strategicEnabled = Object.values(tierData.strategic.features).filter(v => v === true).length;

console.log('Tier-feature matrix generated:');
console.log(`  Source: ${path.relative(process.cwd(), SOURCE)}`);
console.log(`  Output: docs/TIER-FEATURE-MATRIX.md`);
console.log(`  Total features tracked: ${totalFeatures}`);
console.log(`  Pilot: ${pilotEnabled} enabled`);
console.log(`  Foundation: ${foundationEnabled} enabled`);
console.log(`  Enterprise: ${enterpriseEnabled} enabled`);
console.log(`  Strategic: ${strategicEnabled} enabled`);
