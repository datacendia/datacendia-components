/**
 * Integration tests for PromptVersioningService
 * 
 * Tests prompt template versioning, resolution with variable substitution,
 * and usage tracking for audit trail.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock Prisma client
vi.mock('../../config/database.js', () => ({
  prisma: {
    prompt_templates: {
      findFirst: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      updateMany: vi.fn(),
    },
    prompt_usages: {
      create: vi.fn(),
      findMany: vi.fn(),
    },
  },
}));

import { prisma } from '../../config/database.js';
import { PromptVersioningService } from '../../services/council/PromptVersioningService.js';

const mockedPrisma = vi.mocked(prisma);

describe('PromptVersioningService', () => {
  let service: PromptVersioningService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new PromptVersioningService();
  });

  describe('upsertTemplate', () => {
    it('should create a new template when none exists', async () => {
      mockedPrisma.prompt_templates.findFirst.mockResolvedValue(null);
      mockedPrisma.prompt_templates.create.mockResolvedValue({
        id: 'tmpl-1',
        name: 'ethics-check',
        category: 'system',
        template: 'You are an ethics reviewer. Analyze: {{question}}',
        version: 1,
        is_active: true,
        organization_id: null,
        variables: ['question'],
        model_config: {},
        created_by: null,
        created_at: new Date(),
        updated_at: new Date(),
        parent_id: null,
      } as any);

      const result = await service.upsertTemplate({
        name: 'ethics-check',
        category: 'system',
        template: 'You are an ethics reviewer. Analyze: {{question}}',
      });

      expect(result).toBeDefined();
      expect(result.name).toBe('ethics-check');
      expect(mockedPrisma.prompt_templates.create).toHaveBeenCalledTimes(1);
    });

    it('should create a new version when template already exists', async () => {
      const existingTemplate = {
        id: 'tmpl-1',
        name: 'ethics-check',
        category: 'system',
        template: 'Old template text',
        version: 1,
        is_active: true,
        organization_id: null,
        variables: [],
        model_config: {},
        created_by: null,
        created_at: new Date(),
        updated_at: new Date(),
        parent_id: null,
      };

      mockedPrisma.prompt_templates.findFirst.mockResolvedValue(existingTemplate as any);
      mockedPrisma.prompt_templates.updateMany.mockResolvedValue({ count: 1 });
      mockedPrisma.prompt_templates.create.mockResolvedValue({
        ...existingTemplate,
        id: 'tmpl-2',
        version: 2,
        template: 'New template text: {{question}}',
        parent_id: 'tmpl-1',
      } as any);

      const result = await service.upsertTemplate({
        name: 'ethics-check',
        category: 'system',
        template: 'New template text: {{question}}',
      });

      expect(result).toBeDefined();
      expect(result.version).toBe(2);
      expect(result.parent_id).toBe('tmpl-1');
      // Should deactivate previous version
      expect(mockedPrisma.prompt_templates.updateMany).toHaveBeenCalled();
    });
  });

  describe('resolve', () => {
    it('should resolve a template with variable substitution', async () => {
      mockedPrisma.prompt_templates.findFirst.mockResolvedValue({
        id: 'tmpl-1',
        name: 'agent-system',
        template: 'You are {{role}}. Your task: {{task}}',
        version: 1,
        is_active: true,
      } as any);

      mockedPrisma.prompt_usages.create.mockResolvedValue({ id: 'usage-1' } as any);

      const result = await service.resolve({
        templateName: 'agent-system',
        variables: { role: 'a legal analyst', task: 'review the contract' },
        deliberationId: 'delib-123',
      });

      expect(result).toBe('You are a legal analyst. Your task: review the contract');
      // Should record usage for audit trail
      expect(mockedPrisma.prompt_usages.create).toHaveBeenCalledTimes(1);
    });

    it('should return raw template when no variables provided', async () => {
      mockedPrisma.prompt_templates.findFirst.mockResolvedValue({
        id: 'tmpl-1',
        name: 'simple-prompt',
        template: 'Analyze the following decision carefully.',
        version: 1,
        is_active: true,
      } as any);

      mockedPrisma.prompt_usages.create.mockResolvedValue({ id: 'usage-2' } as any);

      const result = await service.resolve({
        templateName: 'simple-prompt',
      });

      expect(result).toBe('Analyze the following decision carefully.');
    });

    it('should throw when template not found', async () => {
      mockedPrisma.prompt_templates.findFirst.mockResolvedValue(null);

      await expect(
        service.resolve({ templateName: 'nonexistent' })
      ).rejects.toThrow();
    });
  });

  describe('variable extraction', () => {
    it('should extract variables from template text', () => {
      const vars = (service as any).extractVariables(
        'Hello {{name}}, your {{role}} at {{company}} is confirmed.'
      );
      expect(vars).toEqual(['name', 'role', 'company']);
    });

    it('should return empty array for templates without variables', () => {
      const vars = (service as any).extractVariables(
        'This is a plain template with no placeholders.'
      );
      expect(vars).toEqual([]);
    });

    it('should handle duplicate variables', () => {
      const vars = (service as any).extractVariables(
        '{{name}} said hello to {{name}} at {{place}}'
      );
      expect(vars).toEqual(['name', 'place']);
    });
  });
});
