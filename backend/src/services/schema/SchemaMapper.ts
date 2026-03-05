/**
 * Service — Schema Mapper
 *
 * Business logic service implementing platform capabilities.
 *
 * @exports SchemaMapperService, CANONICAL_ENTITIES, CANONICAL_FIELDS, schemaMapper, SourceColumn, SourceTable, ColumnMapping, ColumnTransformation
 * @module services/schema/SchemaMapper
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * =============================================================================
 * SCHEMA MAPPER SERVICE
 * Maps client database schemas to Datacendia's canonical data model
 * =============================================================================
 * 
 * Problem: Every client has different:
 * - Column names (customer_id vs cust_id vs client_id)
 * - Data types (varchar vs text, int vs bigint)
 * - Table structures (normalized vs denormalized)
 * - Naming conventions (snake_case vs camelCase vs PascalCase)
 * 
 * Solution: A mapping layer that:
 * 1. Auto-detects schema from client databases
 * 2. Uses AI/heuristics to suggest mappings
 * 3. Allows manual mapping configuration
 * 4. Normalizes data at query time
 */

import { prisma } from '../../lib/prisma';
import { logger } from '../../utils/logger';
// =============================================================================
// CANONICAL DATA MODEL
// =============================================================================

/**
 * Datacendia's canonical entity types that all client data maps to
 */
export const CANONICAL_ENTITIES = {
  // Core business entities
  ORGANIZATION: 'organization',
  PERSON: 'person',
  CUSTOMER: 'customer',
  EMPLOYEE: 'employee',
  PRODUCT: 'product',
  SERVICE: 'service',
  
  // Financial
  TRANSACTION: 'transaction',
  INVOICE: 'invoice',
  PAYMENT: 'payment',
  ACCOUNT: 'account',
  
  // Operations
  ORDER: 'order',
  SHIPMENT: 'shipment',
  INVENTORY: 'inventory',
  ASSET: 'asset',
  
  // Metrics & KPIs
  METRIC: 'metric',
  KPI: 'kpi',
  TARGET: 'target',
  
  // Time series
  EVENT: 'event',
  LOG: 'log',
  MEASUREMENT: 'measurement',
  
  // Relationships
  CONTRACT: 'contract',
  PROJECT: 'project',
  TASK: 'task',
} as const;

export type CanonicalEntity = typeof CANONICAL_ENTITIES[keyof typeof CANONICAL_ENTITIES];

/**
 * Canonical fields that exist across most entities
 */
export const CANONICAL_FIELDS = {
  // Identity
  id: { type: 'string', description: 'Unique identifier' },
  external_id: { type: 'string', description: 'External system identifier' },
  name: { type: 'string', description: 'Display name' },
  code: { type: 'string', description: 'Short code/SKU' },
  
  // Descriptive
  description: { type: 'text', description: 'Long description' },
  category: { type: 'string', description: 'Category/type classification' },
  tags: { type: 'array', description: 'Tags/labels' },
  status: { type: 'string', description: 'Current status' },
  
  // Temporal
  created_at: { type: 'datetime', description: 'Creation timestamp' },
  updated_at: { type: 'datetime', description: 'Last update timestamp' },
  deleted_at: { type: 'datetime', description: 'Soft delete timestamp' },
  effective_date: { type: 'date', description: 'When this becomes effective' },
  expiry_date: { type: 'date', description: 'When this expires' },
  
  // Financial
  amount: { type: 'decimal', description: 'Monetary amount' },
  currency: { type: 'string', description: 'Currency code (ISO 4217)' },
  quantity: { type: 'decimal', description: 'Quantity/count' },
  unit_price: { type: 'decimal', description: 'Price per unit' },
  
  // Contact
  email: { type: 'string', description: 'Email address' },
  phone: { type: 'string', description: 'Phone number' },
  address: { type: 'object', description: 'Physical address' },
  
  // Relationships
  parent_id: { type: 'string', description: 'Parent entity reference' },
  owner_id: { type: 'string', description: 'Owner/assignee reference' },
  organization_id: { type: 'string', description: 'Organization reference' },
  
  // Metrics
  value: { type: 'decimal', description: 'Numeric value' },
  target_value: { type: 'decimal', description: 'Target/goal value' },
  unit: { type: 'string', description: 'Unit of measurement' },
  period: { type: 'string', description: 'Time period' },
} as const;

export type CanonicalField = keyof typeof CANONICAL_FIELDS;

// =============================================================================
// SCHEMA MAPPING TYPES
// =============================================================================

export interface SourceColumn {
  name: string;
  type: string;
  nullable: boolean;
  sampleValues?: any[];
}

export interface SourceTable {
  name: string;
  schema: string;
  columns: SourceColumn[];
  rowCount?: number;
}

export interface ColumnMapping {
  sourceColumn: string;
  canonicalField: CanonicalField | string;
  transformation?: ColumnTransformation;
  confidence: number; // 0-1, how confident we are in this mapping
  isManual: boolean; // true if user confirmed/set this
}

export interface ColumnTransformation {
  type: 'cast' | 'rename' | 'split' | 'combine' | 'lookup' | 'formula' | 'default';
  config: Record<string, any>;
}

export interface TableMapping {
  id: string;
  dataSourceId: string;
  sourceTable: string;
  sourceSchema: string;
  canonicalEntity: CanonicalEntity | string;
  columnMappings: ColumnMapping[];
  filters?: string; // SQL WHERE clause to filter source data
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SchemaMapping {
  id: string;
  dataSourceId: string;
  organizationId: string;
  name: string;
  description?: string;
  tableMappings: TableMapping[];
  version: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// =============================================================================
// HEURISTIC MAPPING ENGINE
// =============================================================================

/**
 * Common column name patterns mapped to canonical fields
 */
const COLUMN_NAME_PATTERNS: Record<string, CanonicalField[]> = {
  // ID patterns
  'id': ['id'],
  'uuid': ['id'],
  'guid': ['id'],
  '_id$': ['id'],
  'pk': ['id'],
  'key': ['id'],
  'external_id': ['external_id'],
  'ext_id': ['external_id'],
  'ref': ['external_id'],
  
  // Name patterns
  'name': ['name'],
  'title': ['name'],
  'label': ['name'],
  'display_name': ['name'],
  'full_name': ['name'],
  
  // Code patterns
  'code': ['code'],
  'sku': ['code'],
  'part_number': ['code'],
  'item_code': ['code'],
  
  // Description
  'desc': ['description'],
  'description': ['description'],
  'notes': ['description'],
  'comment': ['description'],
  'remarks': ['description'],
  
  // Status
  'status': ['status'],
  'state': ['status'],
  'is_active': ['status'],
  'active': ['status'],
  
  // Dates
  'created': ['created_at'],
  'create_date': ['created_at'],
  'created_at': ['created_at'],
  'creation_date': ['created_at'],
  'insert_date': ['created_at'],
  'updated': ['updated_at'],
  'update_date': ['updated_at'],
  'updated_at': ['updated_at'],
  'modified': ['updated_at'],
  'modified_date': ['updated_at'],
  'last_modified': ['updated_at'],
  'deleted': ['deleted_at'],
  'deleted_at': ['deleted_at'],
  'delete_date': ['deleted_at'],
  
  // Financial
  'amount': ['amount'],
  'total': ['amount'],
  'sum': ['amount'],
  'value': ['value', 'amount'],
  'price': ['unit_price'],
  'unit_price': ['unit_price'],
  'cost': ['amount'],
  'currency': ['currency'],
  'currency_code': ['currency'],
  'qty': ['quantity'],
  'quantity': ['quantity'],
  'count': ['quantity'],
  
  // Contact
  'email': ['email'],
  'mail': ['email'],
  'email_address': ['email'],
  'phone': ['phone'],
  'telephone': ['phone'],
  'mobile': ['phone'],
  'cell': ['phone'],
  'address': ['address'],
  
  // Relationships
  'parent': ['parent_id'],
  'parent_id': ['parent_id'],
  'owner': ['owner_id'],
  'owner_id': ['owner_id'],
  'assigned_to': ['owner_id'],
  'assignee': ['owner_id'],
  'org_id': ['organization_id'],
  'organization_id': ['organization_id'],
  'company_id': ['organization_id'],
  'tenant_id': ['organization_id'],
  
  // Category
  'category': ['category'],
  'type': ['category'],
  'class': ['category'],
  'group': ['category'],
  'classification': ['category'],
};

/**
 * Common table name patterns mapped to canonical entities
 */
const TABLE_NAME_PATTERNS: Record<string, CanonicalEntity[]> = {
  'customer': ['customer'],
  'client': ['customer'],
  'buyer': ['customer'],
  'account': ['customer', 'account'],
  
  'employee': ['employee'],
  'staff': ['employee'],
  'worker': ['employee'],
  'user': ['person', 'employee'],
  
  'product': ['product'],
  'item': ['product'],
  'goods': ['product'],
  'merchandise': ['product'],
  
  'order': ['order'],
  'purchase': ['order'],
  'sale': ['order'],
  
  'invoice': ['invoice'],
  'bill': ['invoice'],
  
  'payment': ['payment'],
  'transaction': ['transaction', 'payment'],
  
  'project': ['project'],
  'campaign': ['project'],
  
  'task': ['task'],
  'ticket': ['task'],
  'issue': ['task'],
  
  'metric': ['metric'],
  'kpi': ['kpi'],
  'measure': ['measurement'],
  
  'event': ['event'],
  'log': ['log'],
  'audit': ['log'],
};

// =============================================================================
// SCHEMA MAPPER SERVICE
// =============================================================================

export class SchemaMapperService {
  private mappingCache: Map<string, SchemaMapping> = new Map();



  constructor() {


    this.loadFromDB().catch(() => {});


  }


  /**
   * Auto-detect and suggest mappings for a source schema
   */
  async suggestMappings(
    dataSourceId: string,
    sourceTables: SourceTable[]
  ): Promise<TableMapping[]> {
    const suggestions: TableMapping[] = [];

    for (const table of sourceTables) {
      const entitySuggestion = this.suggestCanonicalEntity(table.name);
      const columnMappings = this.suggestColumnMappings(table.columns);

      suggestions.push({
        id: `mapping-${dataSourceId}-${table.schema}-${table.name}`,
        dataSourceId,
        sourceTable: table.name,
        sourceSchema: table.schema,
        canonicalEntity: entitySuggestion.entity,
        columnMappings,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    return suggestions;
  }

  /**
   * Suggest a canonical entity type for a table
   */
  private suggestCanonicalEntity(tableName: string): { entity: CanonicalEntity; confidence: number } {
    const normalized = tableName.toLowerCase().replace(/[_-]/g, '');
    
    for (const [pattern, entities] of Object.entries(TABLE_NAME_PATTERNS)) {
      if (normalized.includes(pattern)) {
        return { entity: entities[0], confidence: 0.8 };
      }
    }

    // Default to generic entity
    return { entity: 'event' as CanonicalEntity, confidence: 0.3 };
  }

  /**
   * Suggest column mappings based on column names and types
   */
  private suggestColumnMappings(columns: SourceColumn[]): ColumnMapping[] {
    const mappings: ColumnMapping[] = [];

    for (const column of columns) {
      const suggestion = this.suggestCanonicalField(column);
      
      mappings.push({
        sourceColumn: column.name,
        canonicalField: suggestion.field,
        transformation: suggestion.transformation,
        confidence: suggestion.confidence,
        isManual: false,
      });
    }

    return mappings;
  }

  /**
   * Suggest a canonical field for a source column
   */
  private suggestCanonicalField(column: SourceColumn): {
    field: CanonicalField | string;
    confidence: number;
    transformation?: ColumnTransformation;
  } {
    const normalized = column.name.toLowerCase().replace(/[_-]/g, '');
    
    // Check name patterns
    for (const [pattern, fields] of Object.entries(COLUMN_NAME_PATTERNS)) {
      const regex = new RegExp(pattern, 'i');
      if (regex.test(column.name) || normalized.includes(pattern.replace(/[^a-z]/g, ''))) {
        const targetField = fields[0];
        if (!targetField) continue;
        const transformation = this.suggestTransformation(column, targetField);
        const result: { field: CanonicalField | string; confidence: number; transformation?: ColumnTransformation } = { 
          field: targetField, 
          confidence: 0.75,
        };
        if (transformation) {
          result.transformation = transformation;
        }
        return result;
      }
    }

    // Fallback: use original name (custom field)
    return { 
      field: column.name, 
      confidence: 0.3,
    };
  }

  /**
   * Suggest data transformation if types don't match
   */
  private suggestTransformation(
    source: SourceColumn, 
    targetField: CanonicalField
  ): ColumnTransformation | undefined {
    const targetType = CANONICAL_FIELDS[targetField]?.type;
    if (!targetType) return undefined;

    const sourceType = source.type.toLowerCase();

    // Type casting transformations
    if (targetType === 'datetime' && !sourceType.includes('timestamp') && !sourceType.includes('date')) {
      return { type: 'cast', config: { toType: 'datetime', format: 'auto' } };
    }

    if (targetType === 'decimal' && !sourceType.includes('numeric') && !sourceType.includes('decimal')) {
      return { type: 'cast', config: { toType: 'decimal' } };
    }

    return undefined;
  }

  // ===========================================================================
  // MAPPING STORAGE
  // ===========================================================================

  /**
   * Save a schema mapping to the database
   */
  async saveMapping(mapping: SchemaMapping): Promise<SchemaMapping> {
    const existing = await prisma?.schema_mappings.findFirst({
      where: { 
        data_source_id: mapping.dataSourceId,
        organization_id: mapping.organizationId,
      },
    });

    const data = {
      data_source_id: mapping.dataSourceId,
      organization_id: mapping.organizationId,
      name: mapping.name,
      description: mapping.description,
      table_mappings: JSON.stringify(mapping.tableMappings),
      version: existing ? (existing.version || 0) + 1 : 1,
      is_active: mapping.isActive,
      updated_at: new Date(),
    };

    let saved: any;
    if (existing) {
      saved = await prisma?.schema_mappings.update({
        where: { id: existing.id },
        data,
      });
    } else {
      saved = await prisma?.schema_mappings.create({
        data: {
          ...data,
          id: mapping.id || `sm-${Date.now()}`,
          created_at: new Date(),
        },
      });
    }

    // Update cache
    if (saved) {
      const result = this.dbToMapping(saved);
      this.mappingCache.set(mapping.dataSourceId, result);
      return result;
    }

    return mapping;
  }

  /**
   * Get mapping for a data source
   */
  async getMapping(dataSourceId: string): Promise<SchemaMapping | null> {
    // Check cache first
    if (this.mappingCache.has(dataSourceId)) {
      return this.mappingCache.get(dataSourceId)!;
    }

    const saved = await prisma?.schema_mappings.findFirst({
      where: { 
        data_source_id: dataSourceId,
        is_active: true,
      },
    });

    if (saved) {
      const mapping = this.dbToMapping(saved);
      this.mappingCache.set(dataSourceId, mapping);
      return mapping;
    }

    return null;
  }

  private dbToMapping(db: any): SchemaMapping {
    return {
      id: db.id,
      dataSourceId: db.data_source_id,
      organizationId: db.organization_id,
      name: db.name,
      description: db.description,
      tableMappings: JSON.parse(db.table_mappings || '[]'),
      version: db.version || 1,
      isActive: db.is_active,
      createdAt: db.created_at,
      updatedAt: db.updated_at,
    };
  }

  // ===========================================================================
  // QUERY TRANSFORMATION
  // ===========================================================================

  /**
   * Transform a canonical query to source-specific query
   */
  transformQuery(
    mapping: TableMapping,
    canonicalFields: string[],
    filters?: Record<string, any>
  ): { sql: string; params: any[] } {
    const sourceColumns: string[] = [];
    const selectAliases: string[] = [];

    for (const field of canonicalFields) {
      const colMapping = mapping.columnMappings.find(m => m.canonicalField === field);
      if (colMapping) {
        const sourceCol = `"${colMapping.sourceColumn}"`;
        
        if (colMapping.transformation) {
          const transformed = this.applyTransformation(sourceCol, colMapping.transformation);
          selectAliases.push(`${transformed} AS "${field}"`);
        } else {
          selectAliases.push(`${sourceCol} AS "${field}"`);
        }
        sourceColumns.push(colMapping.sourceColumn);
      }
    }

    const tableName = `"${mapping.sourceSchema}"."${mapping.sourceTable}"`;
    let sql = `SELECT ${selectAliases.join(', ')} FROM ${tableName}`;
    const params: any[] = [];

    // Add filters
    if (filters && Object.keys(filters).length > 0) {
      const whereClauses: string[] = [];
      let paramIndex = 1;

      for (const [field, value] of Object.entries(filters)) {
        const colMapping = mapping.columnMappings.find(m => m.canonicalField === field);
        if (colMapping) {
          whereClauses.push(`"${colMapping.sourceColumn}" = $${paramIndex}`);
          params.push(value);
          paramIndex++;
        }
      }

      if (whereClauses.length > 0) {
        sql += ` WHERE ${whereClauses.join(' AND ')}`;
      }
    }

    // Add mapping-level filters
    if (mapping.filters) {
      sql += (params.length > 0 ? ' AND ' : ' WHERE ') + mapping.filters;
    }

    return { sql, params };
  }

  /**
   * Apply a transformation to a column in SQL
   */
  private applyTransformation(column: string, transformation: ColumnTransformation): string {
    switch (transformation.type) {
      case 'cast':
        const toType = transformation.config.toType;
        if (toType === 'datetime') {
          return `${column}::timestamp`;
        }
        if (toType === 'decimal') {
          return `${column}::numeric`;
        }
        if (toType === 'string') {
          return `${column}::text`;
        }
        return column;

      case 'default':
        return `COALESCE(${column}, '${transformation.config.defaultValue}')`;

      case 'formula':
        return transformation.config.sql.replace('{column}', column);

      default:
        return column;
    }
  }

  // ===========================================================================
  // DATA NORMALIZATION
  // ===========================================================================

  /**
   * Normalize a row of data from source format to canonical format
   */
  normalizeRow(
    sourceRow: Record<string, any>,
    mapping: TableMapping
  ): Record<string, any> {
    const normalized: Record<string, any> = {};

    for (const colMapping of mapping.columnMappings) {
      const sourceValue = sourceRow[colMapping.sourceColumn];
      
      if (sourceValue !== undefined) {
        const normalizedValue = this.normalizeValue(
          sourceValue, 
          colMapping.canonicalField,
          colMapping.transformation
        );
        normalized[colMapping.canonicalField] = normalizedValue;
      }
    }

    // Add metadata
    normalized._source = {
      dataSourceId: mapping.dataSourceId,
      table: mapping.sourceTable,
      schema: mapping.sourceSchema,
    };
    normalized._entity = mapping.canonicalEntity;

    return normalized;
  }

  /**
   * Normalize a single value
   */
  private normalizeValue(
    value: any,
    targetField: string,
    transformation?: ColumnTransformation
  ): any {
    if (value === null || value === undefined) {
      return null;
    }

    // Apply transformation if present
    if (transformation) {
      switch (transformation.type) {
        case 'cast':
          return this.castValue(value, transformation.config.toType);
        case 'default':
          return value ?? transformation.config.defaultValue;
        // Add more transformation types as needed
      }
    }

    // Auto-normalize based on target field type
    const fieldDef = CANONICAL_FIELDS[targetField as CanonicalField];
    if (fieldDef) {
      return this.castValue(value, fieldDef.type);
    }

    return value;
  }

  /**
   * Cast a value to a target type
   */
  private castValue(value: any, targetType: string): any {
    switch (targetType) {
      case 'string':
      case 'text':
        return String(value);
      
      case 'decimal':
        const num = parseFloat(value);
        return isNaN(num) ? null : num;
      
      case 'datetime':
      case 'date':
        const date = new Date(value);
        return isNaN(date.getTime()) ? null : date;
      
      case 'array':
        if (Array.isArray(value)) return value;
        if (typeof value === 'string') {
          try { return JSON.parse(value); } catch { return [value]; }
        }
        return [value];
      
      case 'object':
        if (typeof value === 'object') return value;
        if (typeof value === 'string') {
          try { return JSON.parse(value); } catch { return { value }; }
        }
        return { value };
      
      default:
        return value;
    }
  }



  async loadFromDB(): Promise<void> {


    try {


      let restored = 0;


      const recs = await loadServiceRecords({ serviceName: 'SchemaMapper', recordType: 'record', limit: 1000 });


      for (const rec of recs) {


        const d = rec.data as any;


        if (d?.id && !this.mappingCache.has(d.id)) this.mappingCache.set(d.id, d);


      }


      restored += recs.length;


      if (restored > 0) logger.info(`[SchemaMapperService] Restored ${restored} records from database`);


    } catch (err) {


      logger.warn(`[SchemaMapperService] DB reload skipped: ${(err as Error).message}`);


    }


  }
}

// Export singleton instance
export const schemaMapper = new SchemaMapperService();
export default SchemaMapperService;
