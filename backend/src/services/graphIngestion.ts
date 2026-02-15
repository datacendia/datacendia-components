// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

import { Client } from 'pg';
import { graph } from '../config/neo4j.js';
import { logger } from '../utils/logger.js';
import { getErrorMessage } from '../utils/errors.js';

interface PostgresConfig {
  host?: string;
  port?: number;
  database: string;
  schema?: string;
  ssl?: boolean | object;
}

interface PostgresCredentials {
  username?: string;
  password?: string;
}

interface IngestPostgresOptions {
  dataSourceId: string;
  organizationId: string;
  config: Record<string, unknown>;
  credentials: Record<string, unknown>;
}

type EntityRole = 'dataset' | 'metric' | 'workflow' | 'process';

function getStringArrayConfig(
  config: Record<string, unknown>,
  key: string
): string[] | undefined {
  const value = config[key];
  if (!value) return undefined;
  if (Array.isArray(value)) {
    return value.map(v => String(v));
  }
  return undefined;
}

function matchesPattern(name: string, pattern: string): boolean {
  const n = name.toLowerCase();
  const p = pattern.toLowerCase();
  if (p === '*') return true;
  if (!p.includes('*')) return n === p;
  const escaped = p
    .replace(/[.+?^${}()|[\]\\]/g, '\\$&')
    .replace(/\*/g, '.*');
  const re = new RegExp(`^${escaped}$`);
  return re.test(n);
}

function getTableRoleOverride(
  tableName: string,
  config: Record<string, unknown>
): EntityRole | undefined {
  const raw = config['ingestTableRoles'];
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return undefined;
  }
  const mapping = raw as Record<string, unknown>;
  const name = tableName.toLowerCase();

  for (const [pattern, roleVal] of Object.entries(mapping)) {
    if (!matchesPattern(name, pattern)) continue;
    const role = String(roleVal).toLowerCase();
    if (role === 'dataset' || role === 'metric' || role === 'workflow' || role === 'process') {
      return role as EntityRole;
    }
  }

  return undefined;
}

function classifyTable(
  tableName: string,
  config: Record<string, unknown>
): EntityRole | null {
  const name = tableName.toLowerCase();

  // Include / exclude lists from config
  const include = getStringArrayConfig(config, 'ingestIncludeTables');
  const exclude = getStringArrayConfig(config, 'ingestExcludeTables');

  if (include && !include.some(pattern => matchesPattern(name, pattern))) {
    return null;
  }

  if (exclude && exclude.some(pattern => matchesPattern(name, pattern))) {
    return null;
  }

  const override = getTableRoleOverride(tableName, config);
  if (override) {
    return override;
  }

  const systemTableNames = new Set<string>([
    '_prisma_migrations',
    'schema_migrations',
    'migrations',
    'flyway_schema_history',
    'knex_migrations',
    'knex_migrations_lock',
    'sequelizemeta',
    'alembic_version',
  ]);

  if (systemTableNames.has(name)) {
    return null;
  }

  // Heuristic classification
  if (/(^metric_|_metric$|_metrics$|^kpi_|_kpi$|_kpis$)/.test(name)) {
    return 'metric';
  }

  if (/(workflow|pipeline|job_run|jobrun|execution)/.test(name)) {
    return 'workflow';
  }

  return 'dataset';
}

export async function ingestPostgresDataSourceToGraph(options: IngestPostgresOptions): Promise<void> {
  const { dataSourceId, organizationId, config, credentials } = options;

  const pgConfig: PostgresConfig = {
    host: (config.host as string) || 'localhost',
    port: (config.port as number) || 5432,
    database: config.database as string,
    schema: (config.schema as string) || 'public',
    ssl: config.ssl as boolean | object | undefined,
  };

  const pgCreds: PostgresCredentials = {
    username: (credentials.username as string) || (credentials.user as string) || 'postgres',
    password: (credentials.password as string) || '',
  };

  if (!pgConfig.database) {
    logger.warn('[GraphIngestion] Skipping ingestion: missing database in config');
    return;
  }

  const client = new Client({
    host: pgConfig.host,
    port: pgConfig.port,
    database: pgConfig.database,
    user: pgCreds.username,
    password: pgCreds.password,
    ssl: pgConfig.ssl ? { rejectUnauthorized: false } : undefined,
    connectionTimeoutMillis: 15000,
  });

  const schema = pgConfig.schema || 'public';

  logger.info(
    `[GraphIngestion] Starting Postgres schema ingestion for dataSource=${dataSourceId}, org=${organizationId}, db=${pgConfig.database}, schema=${schema}`
  );

  try {
    await client.connect();

    const tablesResult = await client.query<{
      table_name: string;
    }>(
      `
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = $1
        AND table_type = 'BASE TABLE'
    `,
      [schema]
    );

    const columnsResult = await client.query<{
      table_name: string;
      column_name: string;
      data_type: string;
    }>(
      `
      SELECT table_name, column_name, data_type
      FROM information_schema.columns
      WHERE table_schema = $1
      ORDER BY table_name, ordinal_position
    `,
      [schema]
    );

    const fkResult = await client.query<{
      source_table: string;
      source_column: string;
      target_table: string;
      target_column: string;
      constraint_name: string;
    }>(
      `
      SELECT
        tc.table_name AS source_table,
        kcu.column_name AS source_column,
        ccu.table_name AS target_table,
        ccu.column_name AS target_column,
        tc.constraint_name
      FROM information_schema.table_constraints AS tc
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
        AND ccu.table_schema = tc.table_schema
      WHERE tc.constraint_type = 'FOREIGN KEY'
        AND tc.table_schema = $1
    `,
      [schema]
    );

    const columnsByTable = new Map<string, { column_name: string; data_type: string }[]>();
    for (const col of columnsResult.rows) {
      const list = columnsByTable.get(col.table_name) || [];
      list.push({ column_name: col.column_name, data_type: col.data_type });
      columnsByTable.set(col.table_name, list);
    }

    await graph.transaction(async tx => {
      // Clear existing nodes for this data source + org
      await tx.run(
        `
        MATCH (n {dataSourceId: $dataSourceId, organizationId: $organizationId})
        DETACH DELETE n
      `,
        { dataSourceId, organizationId }
      );

      // Create nodes per table with role-specific types
      for (const row of tablesResult.rows) {
        const tableName = row.table_name;
        const role = classifyTable(tableName, config);
        if (!role) {
          continue;
        }

        const nodeId = `pg:${pgConfig.database}:${schema}.${tableName}`;
        // Neo4j properties must be primitives or arrays of primitives.
        // Store column metadata as an array of strings instead of objects.
        const columns = (columnsByTable.get(tableName) || []).map(c =>
          `${c.column_name}:${c.data_type}`
        );

        let label = 'Dataset';
        if (role === 'metric') {
          label = 'Metric';
        } else if (role === 'workflow') {
          label = 'Workflow';
        } else if (role === 'process') {
          label = 'Process';
        }

        await tx.run(
          `
          MERGE (d:${label} {id: $id})
          SET d.name = $name,
              d.type = $type,
              d.table = $table,
              d.schema = $schema,
              d.database = $database,
              d.dataSourceId = $dataSourceId,
              d.organizationId = $organizationId,
              d.columns = $columns,
              d.updatedAt = datetime()
        `,
          {
            id: nodeId,
            name: `${schema}.${tableName}`,
            type: role,
            table: tableName,
            schema,
            database: pgConfig.database,
            dataSourceId,
            organizationId,
            columns,
          }
        );
      }

      // Create relationships based on foreign keys
      for (const fk of fkResult.rows) {
        const sourceId = `pg:${pgConfig.database}:${schema}.${fk.source_table}`;
        const targetId = `pg:${pgConfig.database}:${schema}.${fk.target_table}`;

        await tx.run(
          `
          MATCH (source {id: $sourceId, organizationId: $organizationId})
          MATCH (target {id: $targetId, organizationId: $organizationId})
          MERGE (source)-[r:DERIVES_FROM {
            constraint: $constraintName,
            sourceColumn: $sourceColumn,
            targetColumn: $targetColumn
          }]->(target)
          SET r.inferred = coalesce(r.inferred, false),
              r.confidence = coalesce(r.confidence, 1.0),
              r.updatedAt = datetime()
        `,
          {
            sourceId,
            targetId,
            organizationId,
            constraintName: fk.constraint_name,
            sourceColumn: fk.source_column,
            targetColumn: fk.target_column,
          }
        );
      }

      // If there are no explicit foreign keys, infer heuristic relationships
      if (fkResult.rowCount === 0) {
        const tableNames = tablesResult.rows.map(t => t.table_name);

        for (const sourceTable of tableNames) {
          const columns = columnsByTable.get(sourceTable) || [];
          for (const col of columns) {
            const colName = col.column_name.toLowerCase();

            if (!colName.endsWith('_id')) {
              continue;
            }

            const base = colName.slice(0, -3); // user_id -> user
            if (!base || base === 'id') continue;

            for (const targetTable of tableNames) {
              if (targetTable === sourceTable) continue;

              const targetLower = targetTable.toLowerCase();
              const candidates = [base, `${base}s`, `${base}es`];

              if (!candidates.includes(targetLower)) {
                continue;
              }

              const sourceId = `pg:${pgConfig.database}:${schema}.${sourceTable}`;
              const targetId = `pg:${pgConfig.database}:${schema}.${targetTable}`;

              await tx.run(
                `
                MATCH (source {id: $sourceId, organizationId: $organizationId})
                MATCH (target {id: $targetId, organizationId: $organizationId})
                MERGE (source)-[r:DERIVES_FROM {
                  sourceColumn: $sourceColumn,
                  targetColumn: $targetColumn,
                  heuristic: $heuristic
                }]->(target)
                ON CREATE SET r.inferred = true,
                                r.confidence = $confidence,
                                r.updatedAt = datetime()
                ON MATCH SET  r.inferred = coalesce(r.inferred, true),
                                r.confidence = coalesce(r.confidence, $confidence),
                                r.updatedAt = datetime()
              `,
                {
                  sourceId,
                  targetId,
                  organizationId,
                  sourceColumn: col.column_name,
                  targetColumn: 'id',
                  heuristic: 'column_name_matches_table',
                  confidence: 0.85,
                }
              );
            }
          }
        }
      }
    });

    logger.info(
      `[GraphIngestion] Completed Postgres schema ingestion for dataSource=${dataSourceId}, org=${organizationId}, tables=${tablesResult.rowCount}, fks=${fkResult.rowCount}`
    );
  } catch (error: unknown) {
    logger.error('[GraphIngestion] Postgres ingestion failed', {
      dataSourceId,
      organizationId,
      error: getErrorMessage(error) || String(error),
    });
    throw error;
  } finally {
    await client.end().catch(() => undefined);
  }
}
