/**
 * Service — Admin Settings Service
 *
 * Business logic service implementing platform capabilities.
 *
 * @exports AdminSettingsService, adminSettingsService
 * @module services/admin/AdminSettingsService
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// ADMIN SETTINGS SERVICE
// Persistent storage for admin configuration
// =============================================================================

import crypto from 'crypto';
import { logger } from '../../utils/logger.js';

import { prisma } from '../../config/database.js';
interface SettingValue {
  key: string;
  value: string;
  encrypted: boolean;
  category: string;
  updatedAt: Date;
  updatedBy: string | null;
}

export class AdminSettingsService {
  private encryptionKey: Buffer;

  constructor() {
    const key = process.env['SETTINGS_ENCRYPTION_KEY'] || process.env['JWT_SECRET'];
    if (!key && process.env.NODE_ENV === 'production') {
      throw new Error('SETTINGS_ENCRYPTION_KEY or JWT_SECRET must be set in production');
    }
    this.encryptionKey = crypto.createHash('sha256').update(key || 'dev-only-settings-key').digest();
  }

  /**
   * Get a setting value
   */
  async get(key: string, organizationId?: string): Promise<string | null> {
    try {
      const result = await prisma.$queryRaw<Array<{ value: string; encrypted: boolean }>>`
        SELECT value, encrypted FROM admin_settings 
        WHERE key = ${key} 
        AND (organization_id = ${organizationId} OR organization_id IS NULL)
        ORDER BY organization_id DESC NULLS LAST
        LIMIT 1
      `;

      if (result.length === 0) return null;

      const setting = result[0];
      if (!setting) return null;
      if (setting.encrypted) {
        return this.decrypt(setting.value);
      }
      return setting.value;
    } catch (error) {
      logger.error(`Failed to get setting ${key}`, error);
      return null;
    }
  }

  /**
   * Set a setting value
   */
  async set(
    key: string,
    value: string,
    options: {
      organizationId?: string;
      category?: string;
      encrypted?: boolean;
      updatedBy?: string;
    } = {}
  ): Promise<boolean> {
    try {
      const { organizationId = null, category = 'general', encrypted = false, updatedBy = null } = options;
      const storedValue = encrypted ? this.encrypt(value) : value;

      // Upsert using raw SQL for compatibility
      await prisma.$executeRaw`
        INSERT INTO admin_settings (id, organization_id, key, value, encrypted, category, updated_by, created_at, updated_at)
        VALUES (${crypto.randomUUID()}, ${organizationId}, ${key}, ${storedValue}, ${encrypted}, ${category}, ${updatedBy}, NOW(), NOW())
        ON CONFLICT (organization_id, key) 
        DO UPDATE SET value = ${storedValue}, encrypted = ${encrypted}, category = ${category}, updated_by = ${updatedBy}, updated_at = NOW()
      `;

      return true;
    } catch (error) {
      logger.error(`Failed to set setting ${key}`, error);
      return false;
    }
  }

  /**
   * Delete a setting
   */
  async delete(key: string, organizationId?: string): Promise<boolean> {
    try {
      if (organizationId) {
        await prisma.$executeRaw`
          DELETE FROM admin_settings WHERE key = ${key} AND organization_id = ${organizationId}
        `;
      } else {
        await prisma.$executeRaw`
          DELETE FROM admin_settings WHERE key = ${key} AND organization_id IS NULL
        `;
      }
      return true;
    } catch (error) {
      logger.error(`Failed to delete setting ${key}`, error);
      return false;
    }
  }

  /**
   * Get all settings for an organization
   */
  async getAll(organizationId?: string): Promise<SettingValue[]> {
    try {
      const results = await prisma.$queryRaw<Array<{
        key: string;
        value: string;
        encrypted: boolean;
        category: string;
        updated_at: Date;
        updated_by: string | null;
      }>>`
        SELECT key, value, encrypted, category, updated_at, updated_by 
        FROM admin_settings 
        WHERE organization_id = ${organizationId} OR organization_id IS NULL
        ORDER BY category, key
      `;

      return results.map(r => ({
        key: r.key,
        value: r.encrypted ? '********' : r.value, // Don't expose encrypted values
        encrypted: r.encrypted,
        category: r.category,
        updatedAt: r.updated_at,
        updatedBy: r.updated_by,
      }));
    } catch (error) {
      logger.error('Failed to get all settings', error);
      return [];
    }
  }

  /**
   * Get settings by category
   */
  async getByCategory(category: string, organizationId?: string): Promise<SettingValue[]> {
    try {
      const results = await prisma.$queryRaw<Array<{
        key: string;
        value: string;
        encrypted: boolean;
        category: string;
        updated_at: Date;
        updated_by: string | null;
      }>>`
        SELECT key, value, encrypted, category, updated_at, updated_by 
        FROM admin_settings 
        WHERE category = ${category}
        AND (organization_id = ${organizationId} OR organization_id IS NULL)
        ORDER BY key
      `;

      return results.map(r => ({
        key: r.key,
        value: r.encrypted ? '********' : r.value,
        encrypted: r.encrypted,
        category: r.category,
        updatedAt: r.updated_at,
        updatedBy: r.updated_by,
      }));
    } catch (error) {
      logger.error(`Failed to get settings for category ${category}`, error);
      return [];
    }
  }

  /**
   * Bulk set settings
   */
  async bulkSet(
    settings: Array<{ key: string; value: string; encrypted?: boolean; category?: string }>,
    options: { organizationId?: string; updatedBy?: string } = {}
  ): Promise<{ success: number; failed: number }> {
    let success = 0;
    let failed = 0;

    for (const setting of settings) {
      const setOptions: Parameters<typeof this.set>[2] = {};
      if (options.organizationId) setOptions.organizationId = options.organizationId;
      if (setting.category) setOptions.category = setting.category;
      if (setting.encrypted !== undefined) setOptions.encrypted = setting.encrypted;
      if (options.updatedBy) setOptions.updatedBy = options.updatedBy;
      
      const result = await this.set(setting.key, setting.value, setOptions);

      if (result) {
        success++;
      } else {
        failed++;
      }
    }

    return { success, failed };
  }

  /**
   * Export settings (for backup)
   */
  async export(organizationId?: string): Promise<Record<string, unknown>> {
    const settings = await this.getAll(organizationId);
    const exported: Record<string, unknown> = {};

    for (const setting of settings) {
      if (!setting.encrypted) {
        if (!exported[setting.category]) {
          exported[setting.category] = {};
        }
        (exported[setting.category] as Record<string, string>)[setting.key] = setting.value;
      }
    }

    return exported;
  }

  /**
   * Import settings (from backup)
   */
  async import(
    data: Record<string, Record<string, string>>,
    options: { organizationId?: string; updatedBy?: string } = {}
  ): Promise<{ success: number; failed: number }> {
    const settings: Array<{ key: string; value: string; category: string }> = [];

    for (const [category, values] of Object.entries(data)) {
      for (const [key, value] of Object.entries(values)) {
        settings.push({ key, value, category });
      }
    }

    return this.bulkSet(settings, options);
  }

  // =============================================================================
  // ENCRYPTION HELPERS
  // =============================================================================

  private encrypt(text: string): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', this.encryptionKey, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
  }

  private decrypt(encryptedText: string): string {
    const [ivHex, encrypted] = encryptedText.split(':');
    if (!ivHex || !encrypted) {
      throw new Error('Invalid encrypted format');
    }
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', this.encryptionKey, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }
}

// Singleton instance
export const adminSettingsService = new AdminSettingsService();
