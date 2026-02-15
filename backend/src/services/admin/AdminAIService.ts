// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// ADMIN AI SERVICE - AI-Powered Administrative Assistant
// Helps configure, manage, and carry out administrative tasks
// =============================================================================

import { config } from '../../config/index.js';
import { featureControlService } from './FeatureControlService.js';
import { tenantService } from './TenantService.js';
import { licenseService } from './LicenseService.js';
import { systemHealthService } from './SystemHealthService.js';

// =============================================================================
// TYPES
// =============================================================================

export interface AdminCommand {
  action: string;
  target?: string;
  params?: Record<string, unknown>;
  confirmation?: boolean;
}

export interface AdminAIResponse {
  message: string;
  command?: AdminCommand;
  executed?: boolean;
  result?: unknown;
  suggestions?: string[];
  context?: Record<string, unknown>;
}

export interface ConversationMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  command?: AdminCommand;
  result?: unknown;
}

// =============================================================================
// ADMIN AI SERVICE
// =============================================================================

class AdminAIService {
  private conversations: Map<string, ConversationMessage[]> = new Map();

  // System prompt for the Admin AI
  private systemPrompt = `You are CendiaAdmin™, the AI-powered administrative assistant for the Cendia platform.

Your capabilities include:
1. **Feature Management**: Enable/disable services, agents, suites, and tools
2. **Visibility Control**: Set features to public, authenticated, admin-only, or hidden
3. **Pricing Management**: Update pricing tiers, limits, and features
4. **Agent Configuration**: Modify AI agent settings, prompts, and models
5. **System Monitoring**: Check health status, metrics, and alerts
6. **Tenant Management**: View and manage tenant information
7. **License Management**: Issue, extend, and manage licenses

When the user asks you to do something, respond with:
1. A clear explanation of what you're about to do
2. The command in a structured format
3. Any warnings or considerations

For dangerous operations (deleting, disabling critical services), always ask for confirmation.

Available commands:
- toggle_feature: Enable/disable a feature (params: id, enabled)
- set_visibility: Change visibility level (params: id, visibility: public|authenticated|admin|hidden)
- toggle_agent: Enable/disable an AI agent (params: id, enabled)
- update_agent_model: Change agent's model (params: id, model, temperature)
- update_pricing: Modify a pricing tier (params: id, updates)
- toggle_suite: Enable/disable an entire suite (params: id, enabled)
- get_status: Get system status overview
- list_features: List all features with their status
- list_agents: List all agents with their status
- check_health: Get system health report

Always be helpful, concise, and action-oriented. If unsure, ask clarifying questions.`;

  constructor() {
    // Initialize
  }

  // ===========================================================================
  // CONVERSATION MANAGEMENT
  // ===========================================================================

  async startConversation(sessionId: string): Promise<string> {
    this.conversations.set(sessionId, [
      {
        role: 'system',
        content: this.systemPrompt,
        timestamp: new Date().toISOString()
      },
      {
        role: 'assistant',
        content: `Hello! I'm CendiaAdmin™, your AI administrative assistant. I can help you:

• **Toggle features on/off** - Enable or disable any service, agent, or tool
• **Manage visibility** - Control what's public, authenticated-only, or hidden
• **Update pricing** - Modify pricing tiers and included features
• **Configure agents** - Change AI agent models, prompts, and settings
• **Monitor system health** - Check service status and alerts
• **Manage tenants & licenses** - View and update tenant information

What would you like to do?`,
        timestamp: new Date().toISOString()
      }
    ]);

    return sessionId;
  }

  async processMessage(sessionId: string, userMessage: string): Promise<AdminAIResponse> {
    let conversation = this.conversations.get(sessionId);
    if (!conversation) {
      await this.startConversation(sessionId);
      conversation = this.conversations.get(sessionId)!;
    }

    // Add user message
    conversation.push({
      role: 'user',
      content: userMessage,
      timestamp: new Date().toISOString()
    });

    // Parse intent and generate response
    const response = await this.generateResponse(userMessage, conversation);

    // Add assistant response
    conversation.push({
      role: 'assistant',
      content: response.message,
      timestamp: new Date().toISOString(),
      command: response.command,
      result: response.result
    });

    return response;
  }

  // ===========================================================================
  // INTENT PARSING & RESPONSE GENERATION
  // ===========================================================================

  private async generateResponse(message: string, conversation: ConversationMessage[]): Promise<AdminAIResponse> {
    const lowerMessage = message.toLowerCase();

    // Parse common intents
    if (this.matchesIntent(lowerMessage, ['status', 'overview', 'dashboard', 'how are things', 'what\'s happening'])) {
      return this.handleStatusRequest();
    }

    if (this.matchesIntent(lowerMessage, ['list features', 'show features', 'all features', 'what features'])) {
      return this.handleListFeatures();
    }

    if (this.matchesIntent(lowerMessage, ['list agents', 'show agents', 'all agents', 'what agents'])) {
      return this.handleListAgents();
    }

    if (this.matchesIntent(lowerMessage, ['health', 'system health', 'service status', 'check health'])) {
      return this.handleHealthCheck();
    }

    // Toggle feature
    const toggleMatch = lowerMessage.match(/(enable|disable|turn on|turn off|activate|deactivate)\s+(.+)/);
    if (toggleMatch) {
      const enable = ['enable', 'turn on', 'activate'].includes(toggleMatch[1]);
      const target = toggleMatch[2].trim();
      return this.handleToggle(target, enable);
    }

    // Set visibility
    const visibilityMatch = lowerMessage.match(/(hide|make public|make private|set visibility)\s+(.+)/);
    if (visibilityMatch) {
      const target = visibilityMatch[2].trim();
      const visibility = lowerMessage.includes('hide') ? 'hidden' : 
                        lowerMessage.includes('public') ? 'public' : 'authenticated';
      return this.handleSetVisibility(target, visibility);
    }

    // Pricing
    if (this.matchesIntent(lowerMessage, ['pricing', 'plans', 'tiers', 'update price', 'change price'])) {
      return this.handlePricingRequest(message);
    }

    // Help
    if (this.matchesIntent(lowerMessage, ['help', 'what can you do', 'commands', 'how to'])) {
      return this.handleHelp();
    }

    // Confirmation responses
    if (this.matchesIntent(lowerMessage, ['yes', 'confirm', 'do it', 'proceed', 'go ahead'])) {
      return this.handleConfirmation(conversation);
    }

    if (this.matchesIntent(lowerMessage, ['no', 'cancel', 'nevermind', 'stop'])) {
      return {
        message: "Understood, I've cancelled the operation. Is there anything else I can help you with?",
        suggestions: ['Show features', 'Check system status', 'List agents']
      };
    }

    // Default response
    return {
      message: `I understand you want to: "${message}"\n\nCould you be more specific? You can:\n• **Enable/disable** a feature: "disable CendiaPredict"\n• **Change visibility**: "hide the R&D page"\n• **Update pricing**: "update Foundation tier price to $599"\n• **Configure agents**: "change Chief agent model to qwen2.5:7b"`,
      suggestions: ['Show all features', 'Check system health', 'List pricing tiers', 'Help']
    };
  }

  private matchesIntent(message: string, patterns: string[]): boolean {
    return patterns.some(p => message.includes(p));
  }

  // ===========================================================================
  // COMMAND HANDLERS
  // ===========================================================================

  private async handleStatusRequest(): Promise<AdminAIResponse> {
    const dashboard = await featureControlService.getControlDashboard();
    const health = await systemHealthService.getDashboard();

    const message = `## 📊 Platform Status Overview

### Features & Services
- **Total Features**: ${dashboard.features.total}
- **Enabled**: ${dashboard.features.enabled} ✅
- **Disabled**: ${dashboard.features.disabled} ❌

### AI Agents
- **Total Agents**: ${dashboard.agents.total}
- **Active**: ${dashboard.agents.enabled}
- **Inactive**: ${dashboard.agents.disabled}

### Suites
- **Decision Intelligence**: ${dashboard.suites.enabled > 0 ? '✅ Active' : '❌ Disabled'}
- **Enterprise Suite**: ${dashboard.suites.enabled > 1 ? '✅ Active' : '❌ Disabled'}

### System Health
- **Overall Status**: ${health.overallStatus === 'healthy' ? '🟢 Healthy' : health.overallStatus === 'degraded' ? '🟡 Degraded' : '🔴 Critical'}
- **Active Alerts**: ${health.alerts.length}

### Routes
- **Public**: ${dashboard.routes.public}
- **Authenticated**: ${dashboard.routes.authenticated}
- **Hidden**: ${dashboard.routes.hidden}`;

    return {
      message,
      context: { dashboard, health },
      suggestions: ['List all features', 'Show agents', 'View pricing', 'Check alerts']
    };
  }

  private async handleListFeatures(): Promise<AdminAIResponse> {
    const features = await featureControlService.listFeatures();
    
    const groupedFeatures = features.reduce((acc, f) => {
      if (!acc[f.category]) acc[f.category] = [];
      acc[f.category].push(f);
      return acc;
    }, {} as Record<string, typeof features>);

    let message = '## 📦 All Features\n\n';
    
    for (const [category, categoryFeatures] of Object.entries(groupedFeatures)) {
      message += `### ${category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}\n`;
      for (const f of categoryFeatures) {
        const status = f.enabled ? '✅' : '❌';
        const visibility = f.visibility === 'public' ? '🌐' : f.visibility === 'hidden' ? '👁️‍🗨️' : '🔒';
        message += `${status} **${f.name}** ${visibility} - ${f.description}\n`;
      }
      message += '\n';
    }

    return {
      message,
      context: { features },
      suggestions: ['Enable a feature', 'Disable a feature', 'Change visibility']
    };
  }

  private async handleListAgents(): Promise<AdminAIResponse> {
    const agents = await featureControlService.listAgents();
    
    let message = '## 🤖 AI Agents\n\n';
    
    for (const agent of agents) {
      const status = agent.enabled ? '✅' : '❌';
      message += `${status} **${agent.name}** - ${agent.description}\n`;
      message += `   Model: \`${agent.model}\` | Temp: ${agent.temperature}\n\n`;
    }

    return {
      message,
      context: { agents },
      suggestions: ['Enable an agent', 'Disable an agent', 'Change agent model']
    };
  }

  private async handleHealthCheck(): Promise<AdminAIResponse> {
    const health = await systemHealthService.getDashboard();
    
    let message = `## 🏥 System Health\n\n`;
    message += `**Overall Status**: ${health.overallStatus === 'healthy' ? '🟢 Healthy' : health.overallStatus === 'degraded' ? '🟡 Degraded' : '🔴 Critical'}\n\n`;
    
    message += '### Services\n';
    for (const service of health.services) {
      const icon = service.status === 'healthy' ? '🟢' : service.status === 'degraded' ? '🟡' : '🔴';
      message += `${icon} **${service.name}** - ${service.latency}ms | ${service.uptime}% uptime\n`;
    }
    
    if (health.alerts.length > 0) {
      message += '\n### ⚠️ Active Alerts\n';
      for (const alert of health.alerts) {
        message += `- **${alert.service}**: ${alert.message}\n`;
      }
    }

    return {
      message,
      context: { health },
      suggestions: ['View more details', 'Acknowledge alerts', 'Check specific service']
    };
  }

  private async handleToggle(target: string, enable: boolean): Promise<AdminAIResponse> {
    // Try to find the feature/agent/suite
    const features = await featureControlService.listFeatures();
    const agents = await featureControlService.listAgents();
    const suites = await featureControlService.listSuites();

    const targetLower = target.toLowerCase();
    
    // Find matching item
    const feature = features.find(f => 
      f.name.toLowerCase().includes(targetLower) || 
      f.id.toLowerCase().includes(targetLower)
    );
    const agent = agents.find(a => 
      a.name.toLowerCase().includes(targetLower) || 
      a.id.toLowerCase().includes(targetLower)
    );
    const suite = suites.find(s => 
      s.name.toLowerCase().includes(targetLower) || 
      s.id.toLowerCase().includes(targetLower)
    );

    if (feature) {
      const action = enable ? 'enable' : 'disable';
      const result = await featureControlService.toggleFeature(feature.id, enable);
      
      return {
        message: `✅ Done! I've **${action}d** the feature **${feature.name}**.${
          !enable ? '\n\n⚠️ This feature is now disabled. Routes like ' + feature.routes.join(', ') + ' will no longer be accessible.' : ''
        }`,
        command: { action: 'toggle_feature', target: feature.id, params: { enabled: enable } },
        executed: true,
        result,
        suggestions: enable ? ['Check system status'] : ['Re-enable this feature', 'Check affected routes']
      };
    }

    if (agent) {
      const action = enable ? 'enable' : 'disable';
      const result = await featureControlService.toggleAgent(agent.id, enable);
      
      return {
        message: `✅ Done! I've **${action}d** the agent **${agent.name}**.${
          !enable ? '\n\n⚠️ This agent will no longer participate in council deliberations.' : ''
        }`,
        command: { action: 'toggle_agent', target: agent.id, params: { enabled: enable } },
        executed: true,
        result,
        suggestions: ['List all agents', 'Check deliberation settings']
      };
    }

    if (suite) {
      const action = enable ? 'enable' : 'disable';
      
      return {
        message: `⚠️ You're about to **${action}** the entire **${suite.name}**.\n\nThis will ${action} all ${suite.features.length} features in the suite:\n${suite.features.map(f => `• ${f}`).join('\n')}\n\n**Are you sure you want to proceed?**`,
        command: { action: 'toggle_suite', target: suite.id, params: { enabled: enable }, confirmation: true },
        executed: false,
        suggestions: ['Yes, proceed', 'No, cancel']
      };
    }

    return {
      message: `I couldn't find a feature, agent, or suite matching "${target}".\n\nWould you like me to list all available items?`,
      suggestions: ['List features', 'List agents', 'List suites']
    };
  }

  private async handleSetVisibility(target: string, visibility: string): Promise<AdminAIResponse> {
    const features = await featureControlService.listFeatures();
    const targetLower = target.toLowerCase();
    
    const feature = features.find(f => 
      f.name.toLowerCase().includes(targetLower) || 
      f.id.toLowerCase().includes(targetLower)
    );

    if (feature) {
      const result = await featureControlService.setVisibility(feature.id, visibility as any);
      
      const visibilityDesc = {
        public: 'visible to everyone (including search engines)',
        authenticated: 'only visible to logged-in users',
        admin: 'only visible to administrators',
        hidden: 'completely hidden from navigation and sitemap'
      }[visibility];
      
      return {
        message: `✅ Done! **${feature.name}** is now **${visibility}** - ${visibilityDesc}.`,
        command: { action: 'set_visibility', target: feature.id, params: { visibility } },
        executed: true,
        result,
        suggestions: ['Check sitemap', 'List public routes', 'Undo this change']
      };
    }

    return {
      message: `I couldn't find a feature matching "${target}". Would you like me to list all features?`,
      suggestions: ['List features', 'Show hidden features']
    };
  }

  private async handlePricingRequest(message: string): Promise<AdminAIResponse> {
    const pricing = await featureControlService.listPricing(true);
    
    // Check if updating price
    const priceMatch = message.match(/(\w+)\s+(?:tier\s+)?(?:to\s+)?\$?(\d+)/i);
    if (priceMatch) {
      const tierName = priceMatch[1].toLowerCase();
      const newPrice = parseInt(priceMatch[2]);
      
      const tier = pricing.find(p => p.slug.toLowerCase() === tierName || p.name.toLowerCase() === tierName);
      if (tier) {
        const result = await featureControlService.updatePricing(tier.id, { monthlyPrice: newPrice });
        return {
          message: `✅ Done! Updated **${tier.name}** monthly price from $${tier.monthlyPrice} to **$${newPrice}**.`,
          command: { action: 'update_pricing', target: tier.id, params: { monthlyPrice: newPrice } },
          executed: true,
          result,
          suggestions: ['Update annual price', 'View all pricing', 'Undo']
        };
      }
    }

    // Show pricing overview
    let msg = '## 💰 Pricing Tiers\n\n';
    for (const tier of pricing) {
      const status = tier.active ? '✅' : '❌';
      const visible = tier.visible ? '👁️' : '🙈';
      msg += `${status} **${tier.name}** ${visible}\n`;
      msg += `   Monthly: $${tier.monthlyPrice} | Annual: $${tier.annualPrice}\n`;
      msg += `   Users: ${tier.userLimit === -1 ? 'Unlimited' : tier.userLimit} | Agents: ${tier.agentLimit === -1 ? 'Unlimited' : tier.agentLimit}\n\n`;
    }

    return {
      message: msg,
      context: { pricing },
      suggestions: ['Update Foundation price', 'Hide a tier', 'Add new tier']
    };
  }

  private handleHelp(): AdminAIResponse {
    return {
      message: `## 🤖 CendiaAdmin™ Help

I can help you manage the Cendia platform. Here's what I can do:

### Feature Management
- "**Enable** CendiaPredict" - Turn on a feature
- "**Disable** the Ethics service" - Turn off a feature
- "**Hide** the R&D Lab" - Remove from public view
- "**Make public** the Canvas tool" - Make visible to everyone

### AI Agents
- "**List agents**" - Show all AI agents
- "**Disable** the CFO agent" - Turn off an agent
- "**Change Chief model** to qwen2.5:7b" - Update model

### Pricing
- "**Show pricing**" - View all pricing tiers
- "**Update Foundation price to $599**" - Change a price
- "**Hide** the Sovereign tier" - Remove from public

### System
- "**Status**" - Get platform overview
- "**Health**" - Check system health
- "**List features**" - Show all features

Just tell me what you need in natural language!`,
      suggestions: ['Show status', 'List features', 'Show pricing', 'List agents']
    };
  }

  private async handleConfirmation(conversation: ConversationMessage[]): Promise<AdminAIResponse> {
    // Find the last pending command
    for (let i = conversation.length - 1; i >= 0; i--) {
      const msg = conversation[i];
      if (msg.command && msg.command.confirmation && !msg.result) {
        // Execute the pending command
        switch (msg.command.action) {
          case 'toggle_suite': {
            const result = await featureControlService.toggleSuite(
              msg.command.target!,
              msg.command.params?.enabled as boolean
            );
            const action = msg.command.params?.enabled ? 'enabled' : 'disabled';
            return {
              message: `✅ Done! I've **${action}** the entire suite and all its features.`,
              command: msg.command,
              executed: true,
              result,
              suggestions: ['Check status', 'View suite', 'Undo']
            };
          }
          default:
            break;
        }
      }
    }

    return {
      message: "I don't have any pending commands to confirm. What would you like to do?",
      suggestions: ['Show status', 'List features', 'Help']
    };
  }

  // ===========================================================================
  // UTILITIES
  // ===========================================================================

  getConversation(sessionId: string): ConversationMessage[] | null {
    return this.conversations.get(sessionId) || null;
  }

  clearConversation(sessionId: string): void {
    this.conversations.delete(sessionId);
  }
}

export const adminAIService = new AdminAIService();
