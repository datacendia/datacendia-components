// =============================================================================
// CENDIA LEGACY™ - Knowledge Archive Service
// "The eternal memory of your enterprise."
// Sovereign Organ Layer - Knowledge & Continuity
// =============================================================================

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// =============================================================================
// TYPES
// =============================================================================

export interface KnowledgeArticle {
  id: string;
  organizationId: string;
  title: string;
  content: string;
  category: 'policy' | 'procedure' | 'best_practice' | 'lesson_learned' | 'historical' | 'technical';
  tags: string[];
  author: string;
  contributors: string[];
  version: number;
  status: 'draft' | 'published' | 'archived' | 'deprecated';
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date | null;
  archivedAt: Date | null;
  views: number;
  usefulness: number; // aggregated rating
  metadata: Record<string, unknown>;
}

export interface ArticleVersion {
  id: string;
  articleId: string;
  version: number;
  content: string;
  changes: string;
  changedBy: string;
  changedAt: Date;
}

export interface InstitutionalMemory {
  id: string;
  organizationId: string;
  type: 'success' | 'failure' | 'pivot' | 'crisis' | 'innovation' | 'milestone' | 'lesson_learned';
  title: string;
  description: string;
  dateOccurred: Date;
  participants: string[];
  lessons: string[];
  recommendations: string[];
  relatedArticles: string[];
  confidentiality: 'public' | 'internal' | 'restricted' | 'confidential';
  createdAt: Date;
}

export interface ExpertiseProfile {
  id: string;
  organizationId: string;
  userId: string;
  name: string;
  role: string;
  expertiseAreas: Array<{
    area: string;
    level: 'novice' | 'intermediate' | 'advanced' | 'expert';
    endorsements: number;
  }>;
  contributions: number;
  mentorAvailable: boolean;
  lastActive: Date;
}

export interface KnowledgeTransfer {
  id: string;
  organizationId: string;
  fromUserId: string;
  toUserId: string;
  topic: string;
  type: 'offboarding' | 'onboarding' | 'role_change' | 'project_handoff';
  status: 'pending' | 'in_progress' | 'completed';
  progress: number;
  checklist: Array<{
    item: string;
    completed: boolean;
    completedAt: Date | null;
  }>;
  createdAt: Date;
  completedAt: Date | null;
}

export interface SearchResult {
  type: 'article' | 'memory' | 'expert';
  id: string;
  title: string;
  snippet: string;
  relevance: number;
  metadata: Record<string, unknown>;
}

// =============================================================================
// CENDIA LEGACY SERVICE
// =============================================================================

export class CendiaLegacyService {
  private articles: Map<string, KnowledgeArticle> = new Map();
  private versions: Map<string, ArticleVersion[]> = new Map();
  private memories: Map<string, InstitutionalMemory> = new Map();
  private experts: Map<string, ExpertiseProfile> = new Map();
  private transfers: Map<string, KnowledgeTransfer> = new Map();

  constructor() {
    console.log('[CendiaLegacy] Knowledge Archive service initialized');
  }

  // ===========================================================================
  // KNOWLEDGE ARTICLES
  // ===========================================================================

  async createArticle(data: Omit<KnowledgeArticle, 'id' | 'version' | 'createdAt' | 'updatedAt' | 'publishedAt' | 'archivedAt' | 'views' | 'usefulness'>): Promise<KnowledgeArticle> {
    const article: KnowledgeArticle = {
      ...data,
      id: `article-${Date.now()}-${Math.random().toString(36).substr(2, 8)}`,
      version: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      publishedAt: data.status === 'published' ? new Date() : null,
      archivedAt: null,
      views: 0,
      usefulness: 0,
    };
    
    this.articles.set(article.id, article);
    
    // Save initial version
    await this.saveVersion(article.id, article.content, 'Initial creation', data.author);
    
    return article;
  }

  async getArticle(articleId: string): Promise<KnowledgeArticle | null> {
    const article = this.articles.get(articleId);
    if (article) {
      article.views++;
      this.articles.set(articleId, article);
    }
    return article || null;
  }

  async getArticlesForOrg(organizationId: string, filters?: {
    category?: string;
    status?: string;
    tags?: string[];
  }): Promise<KnowledgeArticle[]> {
    let articles = Array.from(this.articles.values())
      .filter(a => a.organizationId === organizationId);
    
    if (filters?.category) {
      articles = articles.filter(a => a.category === filters.category);
    }
    if (filters?.status) {
      articles = articles.filter(a => a.status === filters.status);
    }
    if (filters?.tags && filters.tags.length > 0) {
      articles = articles.filter(a => 
        filters.tags!.some(tag => a.tags.includes(tag))
      );
    }
    
    return articles.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }

  async updateArticle(articleId: string, updates: Partial<KnowledgeArticle>, changedBy: string): Promise<KnowledgeArticle | null> {
    const article = this.articles.get(articleId);
    if (!article) return null;
    
    const oldContent = article.content;
    Object.assign(article, updates);
    article.version++;
    article.updatedAt = new Date();
    
    if (updates.status === 'published' && !article.publishedAt) {
      article.publishedAt = new Date();
    }
    if (updates.status === 'archived') {
      article.archivedAt = new Date();
    }
    
    this.articles.set(articleId, article);
    
    // Save version if content changed
    if (updates.content && updates.content !== oldContent) {
      await this.saveVersion(articleId, updates.content, 'Content update', changedBy);
    }
    
    return article;
  }

  async rateArticle(articleId: string, rating: number): Promise<KnowledgeArticle | null> {
    const article = this.articles.get(articleId);
    if (!article) return null;
    
    // Simple moving average
    article.usefulness = (article.usefulness * 0.8) + (rating * 0.2);
    this.articles.set(articleId, article);
    
    return article;
  }

  // ===========================================================================
  // VERSION HISTORY
  // ===========================================================================

  private async saveVersion(articleId: string, content: string, changes: string, changedBy: string): Promise<ArticleVersion> {
    const versions = this.versions.get(articleId) || [];
    
    const version: ArticleVersion = {
      id: `version-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      articleId,
      version: versions.length + 1,
      content,
      changes,
      changedBy,
      changedAt: new Date(),
    };
    
    versions.push(version);
    this.versions.set(articleId, versions);
    
    return version;
  }

  async getVersionHistory(articleId: string): Promise<ArticleVersion[]> {
    return this.versions.get(articleId) || [];
  }

  async getVersion(articleId: string, version: number): Promise<ArticleVersion | null> {
    const versions = this.versions.get(articleId) || [];
    return versions.find(v => v.version === version) || null;
  }

  async restoreVersion(articleId: string, version: number, restoredBy: string): Promise<KnowledgeArticle | null> {
    const oldVersion = await this.getVersion(articleId, version);
    if (!oldVersion) return null;
    
    return await this.updateArticle(articleId, { content: oldVersion.content }, restoredBy);
  }

  // ===========================================================================
  // INSTITUTIONAL MEMORY
  // ===========================================================================

  async createMemory(data: Omit<InstitutionalMemory, 'id' | 'createdAt'>): Promise<InstitutionalMemory> {
    const memory: InstitutionalMemory = {
      ...data,
      id: `memory-${Date.now()}-${Math.random().toString(36).substr(2, 8)}`,
      createdAt: new Date(),
    };
    
    this.memories.set(memory.id, memory);
    return memory;
  }

  async getMemory(memoryId: string): Promise<InstitutionalMemory | null> {
    return this.memories.get(memoryId) || null;
  }

  async getMemoriesForOrg(organizationId: string, type?: string): Promise<InstitutionalMemory[]> {
    let memories = Array.from(this.memories.values())
      .filter(m => m.organizationId === organizationId);
    
    if (type) {
      memories = memories.filter(m => m.type === type);
    }
    
    return memories.sort((a, b) => b.dateOccurred.getTime() - a.dateOccurred.getTime());
  }

  // ===========================================================================
  // EXPERTISE DIRECTORY
  // ===========================================================================

  async createExpertProfile(data: Omit<ExpertiseProfile, 'id' | 'contributions' | 'lastActive'>): Promise<ExpertiseProfile> {
    const profile: ExpertiseProfile = {
      ...data,
      id: `expert-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      contributions: 0,
      lastActive: new Date(),
    };
    
    this.experts.set(profile.id, profile);
    return profile;
  }

  async getExpertProfile(profileId: string): Promise<ExpertiseProfile | null> {
    return this.experts.get(profileId) || null;
  }

  async findExperts(organizationId: string, area?: string): Promise<ExpertiseProfile[]> {
    let experts = Array.from(this.experts.values())
      .filter(e => e.organizationId === organizationId);
    
    if (area) {
      experts = experts.filter(e => 
        e.expertiseAreas.some(a => a.area.toLowerCase().includes(area.toLowerCase()))
      );
    }
    
    return experts.sort((a, b) => {
      const aMax = Math.max(...a.expertiseAreas.map(e => e.endorsements));
      const bMax = Math.max(...b.expertiseAreas.map(e => e.endorsements));
      return bMax - aMax;
    });
  }

  async endorseExpertise(profileId: string, area: string): Promise<ExpertiseProfile | null> {
    const profile = this.experts.get(profileId);
    if (!profile) return null;
    
    const expertise = profile.expertiseAreas.find(e => e.area === area);
    if (expertise) {
      expertise.endorsements++;
    }
    
    this.experts.set(profileId, profile);
    return profile;
  }

  // ===========================================================================
  // KNOWLEDGE TRANSFER
  // ===========================================================================

  async createTransfer(data: Omit<KnowledgeTransfer, 'id' | 'status' | 'progress' | 'createdAt' | 'completedAt'>): Promise<KnowledgeTransfer> {
    const transfer: KnowledgeTransfer = {
      ...data,
      id: `transfer-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      status: 'pending',
      progress: 0,
      createdAt: new Date(),
      completedAt: null,
    };
    
    this.transfers.set(transfer.id, transfer);
    return transfer;
  }

  async updateTransferProgress(transferId: string, itemIndex: number): Promise<KnowledgeTransfer | null> {
    const transfer = this.transfers.get(transferId);
    if (!transfer) return null;
    
    if (itemIndex >= 0 && itemIndex < transfer.checklist.length) {
      transfer.checklist[itemIndex].completed = true;
      transfer.checklist[itemIndex].completedAt = new Date();
    }
    
    // Calculate progress
    const completedItems = transfer.checklist.filter(i => i.completed).length;
    transfer.progress = Math.round((completedItems / transfer.checklist.length) * 100);
    
    if (transfer.progress === 100) {
      transfer.status = 'completed';
      transfer.completedAt = new Date();
    } else if (transfer.status === 'pending') {
      transfer.status = 'in_progress';
    }
    
    this.transfers.set(transferId, transfer);
    return transfer;
  }

  async getTransfersForOrg(organizationId: string): Promise<KnowledgeTransfer[]> {
    return Array.from(this.transfers.values())
      .filter(t => t.organizationId === organizationId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  // ===========================================================================
  // SEARCH
  // ===========================================================================

  async search(organizationId: string, query: string): Promise<SearchResult[]> {
    const results: SearchResult[] = [];
    const queryLower = query.toLowerCase();
    
    // Search articles
    const articles = await this.getArticlesForOrg(organizationId);
    for (const article of articles) {
      if (article.status !== 'published') continue;
      
      let relevance = 0;
      if (article.title.toLowerCase().includes(queryLower)) relevance += 50;
      if (article.content.toLowerCase().includes(queryLower)) relevance += 30;
      if (article.tags.some(t => t.toLowerCase().includes(queryLower))) relevance += 20;
      
      if (relevance > 0) {
        results.push({
          type: 'article',
          id: article.id,
          title: article.title,
          snippet: article.content.substring(0, 200) + '...',
          relevance,
          metadata: { category: article.category, views: article.views },
        });
      }
    }
    
    // Search memories
    const memories = await this.getMemoriesForOrg(organizationId);
    for (const memory of memories) {
      let relevance = 0;
      if (memory.title.toLowerCase().includes(queryLower)) relevance += 50;
      if (memory.description.toLowerCase().includes(queryLower)) relevance += 30;
      if (memory.lessons.some(l => l.toLowerCase().includes(queryLower))) relevance += 20;
      
      if (relevance > 0) {
        results.push({
          type: 'memory',
          id: memory.id,
          title: memory.title,
          snippet: memory.description.substring(0, 200) + '...',
          relevance,
          metadata: { type: memory.type, date: memory.dateOccurred },
        });
      }
    }
    
    // Search experts
    const experts = await this.findExperts(organizationId);
    for (const expert of experts) {
      let relevance = 0;
      if (expert.name.toLowerCase().includes(queryLower)) relevance += 40;
      if (expert.expertiseAreas.some(a => a.area.toLowerCase().includes(queryLower))) relevance += 60;
      
      if (relevance > 0) {
        results.push({
          type: 'expert',
          id: expert.id,
          title: expert.name,
          snippet: `${expert.role} - Expert in ${expert.expertiseAreas.map(a => a.area).join(', ')}`,
          relevance,
          metadata: { role: expert.role, areas: expert.expertiseAreas.length },
        });
      }
    }
    
    return results.sort((a, b) => b.relevance - a.relevance);
  }

  // ===========================================================================
  // DASHBOARD
  // ===========================================================================

  async getDashboard(organizationId: string): Promise<{
    totalArticles: number;
    publishedArticles: number;
    totalMemories: number;
    totalExperts: number;
    activeTransfers: number;
    topArticles: KnowledgeArticle[];
    recentMemories: InstitutionalMemory[];
    articlesByCategory: Record<string, number>;
  }> {
    const articles = await this.getArticlesForOrg(organizationId);
    const memories = await this.getMemoriesForOrg(organizationId);
    const experts = await this.findExperts(organizationId);
    const transfers = await this.getTransfersForOrg(organizationId);
    
    const articlesByCategory: Record<string, number> = {};
    for (const a of articles) {
      articlesByCategory[a.category] = (articlesByCategory[a.category] || 0) + 1;
    }
    
    return {
      totalArticles: articles.length,
      publishedArticles: articles.filter(a => a.status === 'published').length,
      totalMemories: memories.length,
      totalExperts: experts.length,
      activeTransfers: transfers.filter(t => t.status !== 'completed').length,
      topArticles: articles.sort((a, b) => b.views - a.views).slice(0, 5),
      recentMemories: memories.slice(0, 5),
      articlesByCategory,
    };
  }

  // No seed method - Enterprise Platinum standard
}

export const cendiaLegacyService = new CendiaLegacyService();
