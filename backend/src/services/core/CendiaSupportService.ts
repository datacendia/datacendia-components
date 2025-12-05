// =============================================================================
// CENDIASUPPORT™ - THE CARETAKER
// Automated Customer Success
// Ticket triage, churn prediction, proactive outreach
// =============================================================================

import { logger } from '../../utils/logger.js';
import ollama from '../ollama.js';
import { aiModelSelector } from '../../config/aiModels.js';

// =============================================================================
// TYPES
// =============================================================================

export interface SupportTicket {
  id: string;
  customerId: string;
  customerEmail: string;
  subject: string;
  content: string;
  category: 'bug' | 'question' | 'feature_request' | 'complaint' | 'billing' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  sentiment: 'positive' | 'neutral' | 'negative' | 'angry';
  status: 'new' | 'triaged' | 'in_progress' | 'waiting' | 'resolved' | 'closed';
  assignedTo?: string;
  draftResponse?: string;
  githubIssue?: string;
  createdAt: Date;
  resolvedAt?: Date;
  firstResponseAt?: Date;
  tags: string[];
}

export interface CustomerHealth {
  customerId: string;
  email: string;
  healthScore: number; // 0-100
  riskLevel: 'healthy' | 'at_risk' | 'critical';
  signals: {
    lastLogin: Date | null;
    loginFrequency: number; // per week
    featureUsage: number; // % of features used
    supportTickets: number;
    ticketSentiment: string;
    paymentHistory: 'good' | 'issues' | 'past_due';
  };
  recommendations: string[];
  predictedChurnDate?: Date;
}

export interface TriageResult {
  ticket: SupportTicket;
  autoActions: {
    createGithubIssue: boolean;
    draftResponse: boolean;
    escalate: boolean;
    notifyFounder: boolean;
  };
  suggestedResponse: string;
}

export interface ChurnPrediction {
  customerId: string;
  probability: number; // 0-1
  daysUntilChurn: number;
  reasons: string[];
  interventions: string[];
}

// =============================================================================
// CENDIASUPPORT SERVICE
// =============================================================================

class CendiaSupportService {
  private tickets: Map<string, SupportTicket> = new Map();
  private customerActivity: Map<string, { lastLogin: Date; logins: Date[]; features: Set<string> }> = new Map();
  private responseTemplates: Map<string, string> = new Map([
    ['greeting', 'Thank you for reaching out to Datacendia Support.'],
    ['bug_ack', 'We have identified this as a bug and created an internal tracking issue.'],
    ['feature_ack', 'Thank you for the feature suggestion. We have added it to our roadmap consideration.'],
    ['resolution', 'This issue has been resolved. Please let us know if you have any other questions.'],
  ]);

  // ---------------------------------------------------------------------------
  // TICKET TRIAGE
  // ---------------------------------------------------------------------------

  async triageTicket(email: Omit<SupportTicket, 'id' | 'category' | 'priority' | 'sentiment' | 'status' | 'createdAt' | 'tags'>): Promise<TriageResult> {
    const prompt = `Analyze this support email for Datacendia (AI Executive Council platform):

From: ${email.customerEmail}
Subject: ${email.subject}
Content: ${email.content}

Classify:
1. Category: bug, question, feature_request, complaint, billing, other
2. Priority: low, medium, high, urgent
3. Sentiment: positive, neutral, negative, angry
4. Tags: relevant keywords
5. Is this a technical bug that needs a GitHub issue?
6. Draft a helpful response

Output JSON:
{
  "category": "...",
  "priority": "...",
  "sentiment": "...",
  "tags": ["..."],
  "isGithubBug": true/false,
  "suggestedResponse": "..."
}`;

    try {
      const response = await ollama.generate(prompt, { model: 'llama3.3:70b' });
      const analysis = JSON.parse(response.match(/\{[\s\S]*\}/)?.[0] || '{}');

      const ticket: SupportTicket = {
        id: `ticket-${Date.now()}`,
        customerId: email.customerId,
        customerEmail: email.customerEmail,
        subject: email.subject,
        content: email.content,
        category: analysis.category || 'other',
        priority: analysis.priority || 'medium',
        sentiment: analysis.sentiment || 'neutral',
        status: 'triaged',
        draftResponse: analysis.suggestedResponse,
        createdAt: new Date(),
        tags: analysis.tags || [],
      };

      this.tickets.set(ticket.id, ticket);

      const autoActions = {
        createGithubIssue: analysis.isGithubBug && analysis.category === 'bug',
        draftResponse: true,
        escalate: analysis.sentiment === 'angry' || analysis.priority === 'urgent',
        notifyFounder: analysis.sentiment === 'angry' || analysis.category === 'complaint',
      };

      logger.info(`CendiaSupport: Triaged ticket ${ticket.id} as ${ticket.category}/${ticket.priority}`);

      return {
        ticket,
        autoActions,
        suggestedResponse: analysis.suggestedResponse || this.generateFallbackResponse(ticket),
      };
    } catch (error) {
      logger.error('Ticket triage failed:', error);
      
      // Fallback triage
      const ticket: SupportTicket = {
        id: `ticket-${Date.now()}`,
        customerId: email.customerId,
        customerEmail: email.customerEmail,
        subject: email.subject,
        content: email.content,
        category: 'other',
        priority: 'medium',
        sentiment: 'neutral',
        status: 'new',
        createdAt: new Date(),
        tags: [],
      };

      this.tickets.set(ticket.id, ticket);

      return {
        ticket,
        autoActions: { createGithubIssue: false, draftResponse: false, escalate: false, notifyFounder: false },
        suggestedResponse: this.generateFallbackResponse(ticket),
      };
    }
  }

  private generateFallbackResponse(ticket: SupportTicket): string {
    const greeting = this.responseTemplates.get('greeting')!;
    
    switch (ticket.category) {
      case 'bug':
        return `${greeting}\n\n${this.responseTemplates.get('bug_ack')}\n\nWe are investigating and will update you shortly.`;
      case 'feature_request':
        return `${greeting}\n\n${this.responseTemplates.get('feature_ack')}\n\nWe appreciate your input!`;
      case 'billing':
        return `${greeting}\n\nFor billing inquiries, I am reviewing your account now and will respond within 24 hours.`;
      default:
        return `${greeting}\n\nI am reviewing your message and will respond shortly.`;
    }
  }

  // ---------------------------------------------------------------------------
  // CHURN PREDICTION
  // ---------------------------------------------------------------------------

  async predictChurn(customerId: string): Promise<ChurnPrediction> {
    const activity = this.customerActivity.get(customerId);
    const recentTickets = Array.from(this.tickets.values())
      .filter(t => t.customerId === customerId);

    // Calculate signals
    const daysSinceLogin = activity?.lastLogin 
      ? Math.floor((Date.now() - activity.lastLogin.getTime()) / (24 * 60 * 60 * 1000))
      : 30;

    const negativeTickets = recentTickets.filter(t => t.sentiment === 'negative' || t.sentiment === 'angry').length;
    const recentLogins = activity?.logins.filter(l => l > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length || 0;

    // Calculate churn probability
    let probability = 0;
    const reasons: string[] = [];

    if (daysSinceLogin > 7) {
      probability += 0.3;
      reasons.push(`No login for ${daysSinceLogin} days`);
    }
    if (daysSinceLogin > 14) {
      probability += 0.2;
    }
    if (negativeTickets > 0) {
      probability += 0.2 * negativeTickets;
      reasons.push(`${negativeTickets} negative support interactions`);
    }
    if (recentLogins < 2) {
      probability += 0.1;
      reasons.push('Low engagement this week');
    }

    probability = Math.min(probability, 1);

    // Generate interventions
    const interventions: string[] = [];
    if (daysSinceLogin > 3) {
      interventions.push('Send "We miss you" email with new feature highlights');
    }
    if (negativeTickets > 0) {
      interventions.push('Schedule CEO check-in call');
    }
    if (probability > 0.5) {
      interventions.push('Offer discount or extended trial');
      interventions.push('Assign dedicated success manager');
    }

    return {
      customerId,
      probability,
      daysUntilChurn: probability > 0 ? Math.round(30 * (1 - probability)) : 180,
      reasons,
      interventions,
    };
  }

  async getAtRiskCustomers(): Promise<ChurnPrediction[]> {
    const customers = Array.from(this.customerActivity.keys());
    const predictions: ChurnPrediction[] = [];

    for (const customerId of customers) {
      const prediction = await this.predictChurn(customerId);
      if (prediction.probability > 0.3) {
        predictions.push(prediction);
      }
    }

    return predictions.sort((a, b) => b.probability - a.probability);
  }

  // ---------------------------------------------------------------------------
  // CUSTOMER HEALTH
  // ---------------------------------------------------------------------------

  async getCustomerHealth(customerId: string): Promise<CustomerHealth> {
    const activity = this.customerActivity.get(customerId);
    const tickets = Array.from(this.tickets.values())
      .filter(t => t.customerId === customerId);

    const recentLogins = activity?.logins
      .filter(l => l > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length || 0;

    const avgSentiment = tickets.length > 0
      ? tickets.filter(t => t.sentiment === 'positive').length / tickets.length
      : 0.5;

    // Calculate health score
    let healthScore = 70; // Base score
    
    if (recentLogins >= 5) healthScore += 15;
    else if (recentLogins === 0) healthScore -= 20;
    
    if (avgSentiment > 0.6) healthScore += 10;
    else if (avgSentiment < 0.3) healthScore -= 15;

    healthScore = Math.max(0, Math.min(100, healthScore));

    let riskLevel: CustomerHealth['riskLevel'] = 'healthy';
    if (healthScore < 40) riskLevel = 'critical';
    else if (healthScore < 60) riskLevel = 'at_risk';

    const recommendations: string[] = [];
    if (healthScore < 60) {
      recommendations.push('Schedule check-in call');
    }
    if (recentLogins < 2) {
      recommendations.push('Send engagement email with tips');
    }

    return {
      customerId,
      email: tickets[0]?.customerEmail || 'unknown',
      healthScore,
      riskLevel,
      signals: {
        lastLogin: activity?.lastLogin || null,
        loginFrequency: recentLogins,
        featureUsage: (activity?.features.size || 0) / 20 * 100, // Assume 20 features
        supportTickets: tickets.length,
        ticketSentiment: avgSentiment > 0.5 ? 'positive' : 'negative',
        paymentHistory: 'good',
      },
      recommendations,
    };
  }

  // ---------------------------------------------------------------------------
  // ACTIVITY TRACKING
  // ---------------------------------------------------------------------------

  recordLogin(customerId: string): void {
    const existing = this.customerActivity.get(customerId) || {
      lastLogin: new Date(),
      logins: [],
      features: new Set(),
    };

    existing.lastLogin = new Date();
    existing.logins.push(new Date());
    
    // Keep only last 30 days of logins
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    existing.logins = existing.logins.filter(l => l > thirtyDaysAgo);

    this.customerActivity.set(customerId, existing);
  }

  recordFeatureUsage(customerId: string, featureId: string): void {
    const existing = this.customerActivity.get(customerId);
    if (existing) {
      existing.features.add(featureId);
    }
  }

  // ---------------------------------------------------------------------------
  // TICKET MANAGEMENT
  // ---------------------------------------------------------------------------

  getTickets(filters?: { status?: string; priority?: string; customerId?: string }): SupportTicket[] {
    let tickets = Array.from(this.tickets.values());

    if (filters?.status) {
      tickets = tickets.filter(t => t.status === filters.status);
    }
    if (filters?.priority) {
      tickets = tickets.filter(t => t.priority === filters.priority);
    }
    if (filters?.customerId) {
      tickets = tickets.filter(t => t.customerId === filters.customerId);
    }

    return tickets.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  resolveTicket(ticketId: string, resolution: string): void {
    const ticket = this.tickets.get(ticketId);
    if (ticket) {
      ticket.status = 'resolved';
      ticket.resolvedAt = new Date();
      logger.info(`CendiaSupport: Resolved ticket ${ticketId}`);
    }
  }

  // ---------------------------------------------------------------------------
  // METRICS
  // ---------------------------------------------------------------------------

  getMetrics(): {
    openTickets: number;
    avgResolutionTime: number;
    avgFirstResponseTime: number;
    satisfactionScore: number;
    ticketsByCategory: Record<string, number>;
  } {
    const tickets = Array.from(this.tickets.values());
    const resolved = tickets.filter(t => t.status === 'resolved' || t.status === 'closed');

    const avgResolutionTime = resolved.length > 0
      ? resolved.reduce((sum, t) => {
          const time = t.resolvedAt ? t.resolvedAt.getTime() - t.createdAt.getTime() : 0;
          return sum + time;
        }, 0) / resolved.length / (60 * 60 * 1000) // Convert to hours
      : 0;

    const ticketsByCategory = tickets.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      openTickets: tickets.filter(t => t.status !== 'resolved' && t.status !== 'closed').length,
      avgResolutionTime,
      avgFirstResponseTime: 2, // Hours - would calculate from actual data
      satisfactionScore: 85, // Would integrate with CSAT surveys
      ticketsByCategory,
    };
  }
}

export const cendiaSupportService = new CendiaSupportService();
export default cendiaSupportService;
