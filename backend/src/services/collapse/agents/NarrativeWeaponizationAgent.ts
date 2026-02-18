// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * Narrative Weaponization Agent
 * 
 * Purpose: This is the killer agent.
 * Key Question: "How would this be framed to destroy public trust?"
 */

import {
  CollapseAgentType,
  FailureCategory,
  Reversibility,
  VisibilityType,
  NarrativeWeaponizationOutput,
  NarrativeAttack,
} from '../types.js';
import { BaseCollapseAgent, AgentAnalysisParams } from './BaseCollapseAgent.js';
import { deterministicFloat, deterministicInt, deterministicPercentage, deterministicPick } from '../../../utils/deterministic.js';

const HEADLINE_TEMPLATES = [
  '"{domain}" Policy Leaves {group} Behind',
  'Critics Slam "{domain}" Plan as {adjective}',
  'Hidden Costs of "{domain}" Reform Revealed',
  'Whistleblower: "{domain}" Policy Benefits Insiders',
  '"{domain}" Disaster: What They Didn\'t Tell You',
  'Expert Warning: "{domain}" Plan Will Backfire',
  'Leaked Documents Show "{domain}" Concerns Ignored',
  '"{domain}" Policy: A Gift to {beneficiary}?',
];

const SOUNDBITES = [
  'This is government overreach, plain and simple',
  'The little guy loses while the connected win',
  'They knew this would fail and did it anyway',
  'Follow the money and you\'ll find the real motive',
  'This is what happens when bureaucrats ignore real people',
  'Another broken promise from out-of-touch leaders',
  'History will judge this decision harshly',
  'The people who made this won\'t suffer the consequences',
];

const EMOTIONAL_TRIGGERS = [
  'FEAR', 'ANGER', 'BETRAYAL', 'INJUSTICE', 'LOSS', 'HELPLESSNESS', 'OUTRAGE', 'DISTRUST',
];

const TARGET_AUDIENCES = [
  'Working families', 'Small business owners', 'Retirees', 'Young professionals',
  'Rural communities', 'Urban residents', 'Taxpayers', 'Concerned citizens',
];

export class NarrativeWeaponizationAgent extends BaseCollapseAgent {
  constructor() {
    super(CollapseAgentType.NARRATIVE_WEAPONIZATION);
  }

  getDescription(): string {
    return 'Analyzes how decisions can be framed to destroy public trust through narrative attacks.';
  }

  getFailureQuestions(): string[] {
    return [
      'How would this be framed to destroy trust?',
      'What soundbites emerge from this policy?',
      'What headlines write themselves?',
      'How does this go viral negatively?',
    ];
  }

  async analyze(params: AgentAnalysisParams): Promise<NarrativeWeaponizationOutput> {
    const { context, seed, stressMultiplier } = params;
    this.initRng(seed);

    const failureConditions = [];
    const narrativeAttacks: NarrativeAttack[] = [];
    const soundbiteVulnerabilities: string[] = [];
    const socialMediaSlogans: string[] = [];
    const defenseNarratives: string[] = [];

    // Generate narrative attacks
    const numAttacks = Math.floor(this.rng() * 4) + 3;
    const adjectives = ['Disastrous', 'Tone-Deaf', 'Elitist', 'Reckless', 'Corrupt', 'Failed'];
    const beneficiaries = ['Special Interests', 'Big Business', 'Political Insiders', 'The Wealthy'];

    for (let i = 0; i < numAttacks; i++) {
      const template = this.randomPick(HEADLINE_TEMPLATES);
      const headline = template
        .replace('{domain}', context.policyDomain)
        .replace('{group}', this.randomPick(TARGET_AUDIENCES))
        .replace('{adjective}', this.randomPick(adjectives))
        .replace('{beneficiary}', this.randomPick(beneficiaries));

      const soundbite = this.randomPick(SOUNDBITES);
      const emotionalTrigger = this.randomPick(EMOTIONAL_TRIGGERS);
      const targetAudience = this.randomPick(TARGET_AUDIENCES);
      const virality = this.randomInRange(0.4, 0.9) * stressMultiplier;

      const attack: NarrativeAttack = {
        id: `NA-${Date.now().toString(36)}-${deterministicFloat('narrativeweaponizationagent-1').toString(36).substring(2, 6)}`,
        headline,
        soundbite,
        targetAudience,
        emotionalTrigger,
        virality,
        defenseStrategy: this.generateDefenseStrategy(emotionalTrigger),
      };

      narrativeAttacks.push(attack);
      soundbiteVulnerabilities.push(soundbite);

      // Generate social media slogan
      const slogan = `#${context.policyDomain.replace(/\s+/g, '')}Fail - ${soundbite.split(',')[0]}`;
      socialMediaSlogans.push(slogan);

      const fc = this.createFailureCondition(
        FailureCategory.NARRATIVE_CAPTURE,
        {
          metric: 'negative_narrative_penetration',
          operator: '>',
          value: 0.3,
        },
        virality,
        'NarrativeWeaponization',
        `"${headline}" narrative gains traction, triggering ${emotionalTrigger.toLowerCase()} response in ${targetAudience.toLowerCase()}`,
        virality,
        this.randomInRange(0.5, 0.8),
        Reversibility.PARTIALLY_REVERSIBLE,
        `${Math.floor(this.rng() * 4) + 1} weeks`,
        VisibilityType.IMMEDIATE,
        this.selectAffectedGroups(2, false),
        true,
        virality > 0.7 ? 'HIGH' : 'MEDIUM',
        [
          'Media narrative analysis',
          'Social media sentiment modeling',
          'Viral spread pattern analysis',
        ],
        `The "${headline}" framing exploits ${emotionalTrigger.toLowerCase()} triggers with ${(virality * 100).toFixed(0)}% virality potential among ${targetAudience.toLowerCase()}.`
      );

      failureConditions.push(fc);
    }

    // Generate defense narratives
    defenseNarratives.push(
      `Transparent communication of ${context.policyDomain} benefits and trade-offs`,
      'Proactive stakeholder engagement before opposition can frame',
      'Pre-emptive acknowledgment of concerns with mitigation plans',
      'Third-party validation from trusted community voices',
    );

    const riskScore = this.calculateRiskScore(failureConditions);

    return this.finalizeOutput({
      agentType: this.agentType,
      agentId: this.agentId,
      timestamp: new Date().toISOString(),
      seed,
      failureConditions,
      riskScore,
      reasoning: `Narrative weaponization analysis identifies ${narrativeAttacks.length} high-virality attack vectors. ${soundbiteVulnerabilities.length} soundbite vulnerabilities detected. Average virality: ${(narrativeAttacks.reduce((s, a) => s + a.virality, 0) / narrativeAttacks.length * 100).toFixed(0)}%.`,
      evidence: [
        'Narrative framing analysis',
        'Social media virality modeling',
        'Emotional trigger mapping',
        'Opposition research patterns',
      ],
      narrativeAttacks,
      soundbiteVulnerabilities,
      socialMediaSlogans,
      defenseNarratives,
    } as any) as NarrativeWeaponizationOutput;
  }

  private generateDefenseStrategy(trigger: string): string {
    const strategies: Record<string, string> = {
      FEAR: 'Provide concrete evidence of safeguards and success metrics',
      ANGER: 'Acknowledge frustration, demonstrate listening, show action',
      BETRAYAL: 'Transparent disclosure of decision process and trade-offs',
      INJUSTICE: 'Highlight equity measures and support for affected groups',
      LOSS: 'Emphasize transition support and long-term benefits',
      HELPLESSNESS: 'Create accessible feedback channels and participation opportunities',
      OUTRAGE: 'Rapid response with facts and third-party validation',
      DISTRUST: 'Independent oversight and public accountability measures',
    };
    return strategies[trigger] || 'Proactive, transparent communication';
  }
}
