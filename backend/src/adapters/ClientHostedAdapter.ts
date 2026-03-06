/**
 * Data Adapter — Client Hosted Adapter
 *
 * Data transformation adapter between internal and external formats.
 *
 * @exports ClientHostedAdapter
 * @module adapters/ClientHostedAdapter
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// CLIENT-HOSTED DATA ADAPTER
// Connects directly to client's database - no data stored on Datacendia
// Supports: PostgreSQL, MySQL, SQL Server, Oracle, MongoDB, IBM DB2
// =============================================================================

import { 
  DataAdapter, 
  ApotheosisDataAdapter, 
  DissentDataAdapter,
  OrganizationDataConfig,
  SchemaMapping 
} from './DataAdapter.js';
import { 
  ApotheosisRun, 
  ApotheosisConfig, 
  ApotheosisScore,
  Escalation,
  PatternBan,
  UpskillAssignment,
  WeaknessItem,
  AutoPatch
} from '../services/CendiaApotheosisService.js';
import {
  Dissent,
  DissentResponse,
  DissenterProfile,
  OrganizationDissentMetrics
} from '../services/CendiaDissentService.js';
import { logger } from '../utils/logger.js';

// =============================================================================
// MONGODB HELPER FUNCTIONS
// =============================================================================

/**
 * Parse SQL WHERE clause to MongoDB filter object
 * Supports: =, >, <, >=, <=, AND, OR, IN, LIKE
 */
function parseWhereToMongoFilter(whereClause: string, params: unknown[]): Record<string, unknown> {
  const filter: Record<string, unknown> = {};
  let paramIndex = 0;
  
  // Simple parser for common patterns
  // Handles: column = $1, column > $2, column IN ($3, $4)
  const conditions = whereClause.split(/\s+AND\s+/i);
  
  for (const condition of conditions) {
    const eqMatch = condition.match(/(\w+)\s*=\s*\$(\d+)/i);
    if (eqMatch) {
      const [, column] = eqMatch;
      filter[column] = params[paramIndex++];
      continue;
    }
    
    const gtMatch = condition.match(/(\w+)\s*>\s*\$(\d+)/i);
    if (gtMatch) {
      const [, column] = gtMatch;
      filter[column] = { $gt: params[paramIndex++] };
      continue;
    }
    
    const ltMatch = condition.match(/(\w+)\s*<\s*\$(\d+)/i);
    if (ltMatch) {
      const [, column] = ltMatch;
      filter[column] = { $lt: params[paramIndex++] };
      continue;
    }
    
    const inMatch = condition.match(/(\w+)\s+IN\s*\(([^)]+)\)/i);
    if (inMatch) {
      const [, column, valuesStr] = inMatch;
      const valueCount = valuesStr.split(',').length;
      const values = params.slice(paramIndex, paramIndex + valueCount);
      paramIndex += valueCount;
      filter[column] = { $in: values };
      continue;
    }
    
    const likeMatch = condition.match(/(\w+)\s+LIKE\s*\$(\d+)/i);
    if (likeMatch) {
      const [, column] = likeMatch;
      const pattern = String(params[paramIndex++]).replace(/%/g, '.*');
      filter[column] = { $regex: pattern, $options: 'i' };
      continue;
    }
  }
  
  return filter;
}

/**
 * Parse SQL SET clause to MongoDB update object
 * Supports: column = $1, column = $2
 */
function parseSetToMongoUpdate(setClause: string, params: unknown[]): Record<string, unknown> {
  const update: Record<string, unknown> = {};
  let paramIndex = 0;
  
  const assignments = setClause.split(/\s*,\s*/);
  
  for (const assignment of assignments) {
    const match = assignment.match(/(\w+)\s*=\s*\$(\d+)/i);
    if (match) {
      const [, column] = match;
      update[column] = params[paramIndex++];
    }
  }
  
  return update;
}

// =============================================================================
// GENERIC SQL CLIENT INTERFACE
// =============================================================================

interface SQLClient {
  query<T>(sql: string, params?: unknown[]): Promise<T[]>;
  execute(sql: string, params?: unknown[]): Promise<{ affectedRows: number }>;
  transaction<T>(fn: (client: SQLClient) => Promise<T>): Promise<T>;
  close(): Promise<void>;
}

// =============================================================================
// CLIENT-HOSTED ADAPTER
// =============================================================================

export class ClientHostedAdapter implements DataAdapter {
  readonly type = 'client-hosted' as const;
  readonly organizationId: string;
  
  private config: OrganizationDataConfig;
  private client: SQLClient | null = null;
  private schemaMapping: SchemaMapping;
  
  apotheosis: ApotheosisDataAdapter;
  dissent: DissentDataAdapter;

  constructor(config: OrganizationDataConfig) {
    this.config = config;
    this.organizationId = config.organizationId;
    this.schemaMapping = config.clientDatabase?.schemaMapping || this.defaultSchemaMapping();
    
    this.apotheosis = new ClientHostedApotheosisAdapter(this);
    this.dissent = new ClientHostedDissentAdapter(this);
  }

  async connect(): Promise<void> {
    const dbConfig = this.config.clientDatabase;
    if (!dbConfig) {
      throw new Error('Client database configuration is required');
    }

    switch (dbConfig.type) {
      case 'postgresql':
        this.client = await this.createPostgresClient(dbConfig);
        break;
      case 'mysql':
        this.client = await this.createMySQLClient(dbConfig);
        break;
      case 'sqlserver':
        this.client = await this.createSQLServerClient(dbConfig);
        break;
      case 'oracle':
        this.client = await this.createOracleClient(dbConfig);
        break;
      case 'mongodb':
        this.client = await this.createMongoClient(dbConfig);
        break;
      case 'db2':
        this.client = await this.createDB2Client(dbConfig);
        break;
      default:
        throw new Error(`Unsupported database type: ${dbConfig.type}`);
    }

    logger.info(`[ClientAdapter] Connected to ${dbConfig.type} for org ${this.organizationId}`);
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.close();
      this.client = null;
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      await this.rawQuery('SELECT 1');
      return true;
    } catch {
      return false;
    }
  }

  async rawQuery<T>(query: string, params?: unknown[]): Promise<T> {
    if (!this.client) {
      throw new Error('Database not connected');
    }
    const results = await this.client.query<T>(query, params);
    return results as T;
  }

  // ===========================================================================
  // INTERNAL HELPERS
  // ===========================================================================

  getClient(): SQLClient {
    if (!this.client) {
      throw new Error('Database not connected');
    }
    return this.client;
  }

  getTableName(datacendiaTable: string): string {
    return this.schemaMapping.tables[datacendiaTable as keyof typeof this.schemaMapping.tables] || datacendiaTable;
  }

  getColumnName(table: string, datacendiaColumn: string): string {
    const tableMapping = this.schemaMapping.columns[table];
    return tableMapping?.[datacendiaColumn] || datacendiaColumn;
  }

  transformToClient(table: string, column: string, value: unknown): unknown {
    const transform = this.schemaMapping.transforms?.[table]?.[column];
    return transform ? transform.toClient(value) : value;
  }

  transformFromClient(table: string, column: string, value: unknown): unknown {
    const transform = this.schemaMapping.transforms?.[table]?.[column];
    return transform ? transform.fromClient(value) : value;
  }

  // ===========================================================================
  // DATABASE CLIENT FACTORIES
  // ===========================================================================

  private async createPostgresClient(config: NonNullable<OrganizationDataConfig['clientDatabase']>): Promise<SQLClient> {
    // Dynamic import to avoid bundling unused drivers
    const { Pool } = await import('pg');
    const pool = new Pool({
      connectionString: config.connectionString,
      host: config.host,
      port: config.port || 5432,
      database: config.database,
      user: config.username,
      password: config.password,
      ssl: config.ssl ? { rejectUnauthorized: false } : false,
    });

    return {
      async query<T>(sql: string, params?: unknown[]): Promise<T[]> {
        const result = await pool.query(sql, params);
        return result.rows as T[];
      },
      async execute(sql: string, params?: unknown[]): Promise<{ affectedRows: number }> {
        const result = await pool.query(sql, params);
        return { affectedRows: result.rowCount || 0 };
      },
      async transaction<T>(fn: (client: SQLClient) => Promise<T>): Promise<T> {
        const client = await pool.connect();
        try {
          await client.query('BEGIN');
          const wrappedClient: SQLClient = {
            async query<T>(sql: string, params?: unknown[]): Promise<T[]> {
              const result = await client.query(sql, params);
              return result.rows as T[];
            },
            async execute(sql: string, params?: unknown[]): Promise<{ affectedRows: number }> {
              const result = await client.query(sql, params);
              return { affectedRows: result.rowCount || 0 };
            },
            transaction: () => { throw new Error('Nested transactions not supported'); },
            close: () => Promise.resolve(),
          };
          const result = await fn(wrappedClient);
          await client.query('COMMIT');
          return result;
        } catch (error) {
          await client.query('ROLLBACK');
          throw error;
        } finally {
          client.release();
        }
      },
      async close(): Promise<void> {
        await pool.end();
      },
    };
  }

  private async createMySQLClient(config: NonNullable<OrganizationDataConfig['clientDatabase']>): Promise<SQLClient> {
    const mysql = await import('mysql2/promise');
    const pool = mysql.createPool({
      host: config.host,
      port: config.port || 3306,
      database: config.database,
      user: config.username,
      password: config.password,
      ssl: config.ssl ? {} : undefined,
    });

    return {
      async query<T>(sql: string, params?: unknown[]): Promise<T[]> {
        const [rows] = await pool.execute(sql, params);
        return rows as T[];
      },
      async execute(sql: string, params?: unknown[]): Promise<{ affectedRows: number }> {
        const [result] = await pool.execute(sql, params) as unknown as [{ affectedRows: number }];
        return { affectedRows: result.affectedRows };
      },
      async transaction<T>(fn: (client: SQLClient) => Promise<T>): Promise<T> {
        const connection = await pool.getConnection();
        try {
          await connection.beginTransaction();
          const wrappedClient: SQLClient = {
            async query<T>(sql: string, params?: unknown[]): Promise<T[]> {
              const [rows] = await connection.execute(sql, params);
              return rows as T[];
            },
            async execute(sql: string, params?: unknown[]): Promise<{ affectedRows: number }> {
              const [result] = await connection.execute(sql, params) as unknown as [{ affectedRows: number }];
              return { affectedRows: result.affectedRows };
            },
            transaction: () => { throw new Error('Nested transactions not supported'); },
            close: () => Promise.resolve(),
          };
          const result = await fn(wrappedClient);
          await connection.commit();
          return result;
        } catch (error) {
          await connection.rollback();
          throw error;
        } finally {
          connection.release();
        }
      },
      async close(): Promise<void> {
        await pool.end();
      },
    };
  }

  private async createSQLServerClient(config: NonNullable<OrganizationDataConfig['clientDatabase']>): Promise<SQLClient> {
    // SQL Server support requires mssql package: npm install mssql
    // @ts-ignore - mssql is an optional dependency
    const sql = await import('mssql').catch(() => { throw new Error('mssql package not installed. Run: npm install mssql'); });
    const pool = await sql.connect({
      server: config.host || 'localhost',
      port: config.port || 1433,
      database: config.database,
      user: config.username,
      password: config.password,
      options: {
        encrypt: config.ssl ?? true,
        trustServerCertificate: true,
      },
    });

    return {
      async query<T>(sqlQuery: string, params?: unknown[]): Promise<T[]> {
        const request = pool.request();
        params?.forEach((p, i) => request.input(`p${i}`, p));
        const result = await request.query(sqlQuery);
        return result.recordset as T[];
      },
      async execute(sqlQuery: string, params?: unknown[]): Promise<{ affectedRows: number }> {
        const request = pool.request();
        params?.forEach((p, i) => request.input(`p${i}`, p));
        const result = await request.query(sqlQuery);
        return { affectedRows: result.rowsAffected[0] || 0 };
      },
      async transaction<T>(fn: (client: SQLClient) => Promise<T>): Promise<T> {
        const transaction = pool.transaction();
        await transaction.begin();
        try {
          const wrappedClient: SQLClient = {
            async query<T>(sqlQuery: string, params?: unknown[]): Promise<T[]> {
              const request = transaction.request();
              params?.forEach((p, i) => request.input(`p${i}`, p));
              const result = await request.query(sqlQuery);
              return result.recordset as T[];
            },
            async execute(sqlQuery: string, params?: unknown[]): Promise<{ affectedRows: number }> {
              const request = transaction.request();
              params?.forEach((p, i) => request.input(`p${i}`, p));
              const result = await request.query(sqlQuery);
              return { affectedRows: result.rowsAffected[0] || 0 };
            },
            transaction: () => { throw new Error('Nested transactions not supported'); },
            close: () => Promise.resolve(),
          };
          const result = await fn(wrappedClient);
          await transaction.commit();
          return result;
        } catch (error) {
          await transaction.rollback();
          throw error;
        }
      },
      async close(): Promise<void> {
        await pool.close();
      },
    };
  }

  private async createOracleClient(config: NonNullable<OrganizationDataConfig['clientDatabase']>): Promise<SQLClient> {
    // Oracle requires oracledb package: npm install oracledb
    const oracledb = await import('oracledb').catch(() => { 
      throw new Error('oracledb package not installed. Run: npm install oracledb'); 
    });
    
    // Configure Oracle client
    oracledb.default.outFormat = oracledb.default.OUT_FORMAT_OBJECT;
    oracledb.default.autoCommit = false;
    
    const pool = await oracledb.default.createPool({
      user: config.username,
      password: config.password,
      connectString: config.connectionString || `${config.host}:${config.port || 1521}/${config.database}`,
      poolMin: 2,
      poolMax: 10,
      poolIncrement: 1,
    });

    return {
      async query<T>(sql: string, params?: unknown[]): Promise<T[]> {
        const connection = await pool.getConnection();
        try {
          const result = await connection.execute(sql, params || [], { outFormat: oracledb.default.OUT_FORMAT_OBJECT });
          return (result.rows || []) as T[];
        } finally {
          await connection.close();
        }
      },
      async execute(sql: string, params?: unknown[]): Promise<{ affectedRows: number }> {
        const connection = await pool.getConnection();
        try {
          const result = await connection.execute(sql, params || []);
          await connection.commit();
          return { affectedRows: result.rowsAffected || 0 };
        } finally {
          await connection.close();
        }
      },
      async transaction<T>(fn: (client: SQLClient) => Promise<T>): Promise<T> {
        const connection = await pool.getConnection();
        try {
          const wrappedClient: SQLClient = {
            async query<T>(sql: string, params?: unknown[]): Promise<T[]> {
              const result = await connection.execute(sql, params || [], { outFormat: oracledb.default.OUT_FORMAT_OBJECT });
              return (result.rows || []) as T[];
            },
            async execute(sql: string, params?: unknown[]): Promise<{ affectedRows: number }> {
              const result = await connection.execute(sql, params || []);
              return { affectedRows: result.rowsAffected || 0 };
            },
            transaction: () => { throw new Error('Nested transactions not supported'); },
            close: () => Promise.resolve(),
          };
          const result = await fn(wrappedClient);
          await connection.commit();
          return result;
        } catch (error) {
          await connection.rollback();
          throw error;
        } finally {
          await connection.close();
        }
      },
      async close(): Promise<void> {
        await pool.close(0);
      },
    };
  }

  private async createMongoClient(config: NonNullable<OrganizationDataConfig['clientDatabase']>): Promise<SQLClient> {
    // MongoDB requires mongodb package: npm install mongodb
    const { MongoClient } = await import('mongodb').catch(() => { 
      throw new Error('mongodb package not installed. Run: npm install mongodb'); 
    });
    
    const connectionString = config.connectionString || 
      `mongodb://${config.username}:${config.password}@${config.host}:${config.port || 27017}/${config.database}`;
    
    const client = new MongoClient(connectionString, {
      maxPoolSize: 10,
      minPoolSize: 2,
    });
    
    await client.connect();
    const db = client.db(config.database);

    // MongoDB adapter - translates SQL-like operations to MongoDB queries
    // Note: This is a simplified adapter. Complex queries may need custom handling.
    const sqlClient: SQLClient = {
      async query<T>(sql: string, params?: unknown[]): Promise<T[]> {
        // Parse simple SELECT queries to MongoDB find operations
        const selectMatch = sql.match(/SELECT \* FROM (\w+)(?: WHERE (.+))?(?: ORDER BY (\w+) (ASC|DESC))?(?: LIMIT (\d+))?/i);
        if (selectMatch) {
          const [, collection, whereClause, orderField, orderDir, limit] = selectMatch;
          const filter = whereClause ? parseWhereToMongoFilter(whereClause, params || []) : {};
          let cursor = db.collection(collection).find(filter);
          
          if (orderField) {
            cursor = cursor.sort({ [orderField]: orderDir?.toUpperCase() === 'DESC' ? -1 : 1 });
          }
          if (limit) {
            cursor = cursor.limit(parseInt(limit));
          }
          
          return await cursor.toArray() as T[];
        }
        throw new Error(`Unsupported query for MongoDB: ${sql}`);
      },
      async execute(sql: string, params?: unknown[]): Promise<{ affectedRows: number }> {
        // Parse INSERT, UPDATE, DELETE to MongoDB operations
        const insertMatch = sql.match(/INSERT INTO (\w+) \(([^)]+)\) VALUES \(([^)]+)\)/i);
        if (insertMatch) {
          const [, collection, columns] = insertMatch;
          const columnList = columns.split(',').map(c => c.trim());
          const doc: Record<string, unknown> = {};
          columnList.forEach((col, i) => {
            doc[col] = params?.[i];
          });
          const result = await db.collection(collection).insertOne(doc);
          return { affectedRows: result.acknowledged ? 1 : 0 };
        }
        
        const updateMatch = sql.match(/UPDATE (\w+) SET (.+) WHERE (.+)/i);
        if (updateMatch) {
          const [, collection, setClause, whereClause] = updateMatch;
          const filter = parseWhereToMongoFilter(whereClause, params || []);
          const update = parseSetToMongoUpdate(setClause, params || []);
          const result = await db.collection(collection).updateMany(filter, { $set: update });
          return { affectedRows: result.modifiedCount };
        }
        
        throw new Error(`Unsupported execute for MongoDB: ${sql}`);
      },
      async transaction<T>(fn: (client: SQLClient) => Promise<T>): Promise<T> {
        const session = client.startSession();
        try {
          session.startTransaction();
          const result = await fn(sqlClient);
          await session.commitTransaction();
          return result;
        } catch (error) {
          await session.abortTransaction();
          throw error;
        } finally {
          await session.endSession();
        }
      },
      async close(): Promise<void> {
        await client.close();
      },
    };
    return sqlClient;
  }

  private async createDB2Client(config: NonNullable<OrganizationDataConfig['clientDatabase']>): Promise<SQLClient> {
    // IBM DB2 requires ibm_db package: npm install ibm_db
    // @ts-ignore - ibm_db is an optional dependency
    const ibmdb = await import('ibm_db').catch(() => { 
      throw new Error('ibm_db package not installed. Run: npm install ibm_db'); 
    });
    
    const connectionString = config.connectionString || 
      `DATABASE=${config.database};HOSTNAME=${config.host};PORT=${config.port || 50000};PROTOCOL=TCPIP;UID=${config.username};PWD=${config.password};`;
    
    const pool = new ibmdb.Pool();
    pool.setMaxPoolSize(10);

    return {
      async query<T>(sql: string, params?: unknown[]): Promise<T[]> {
        return new Promise((resolve, reject) => {
          pool.open(connectionString, (err: Error | null, conn: unknown) => {
            if (err) return reject(err);
            const connection = conn as { query: (sql: string, params: unknown[], cb: (err: Error | null, rows: T[]) => void) => void; close: (cb: () => void) => void };
            connection.query(sql, params || [], (err: Error | null, rows: T[]) => {
              connection.close(() => {});
              if (err) return reject(err);
              resolve(rows);
            });
          });
        });
      },
      async execute(sql: string, params?: unknown[]): Promise<{ affectedRows: number }> {
        return new Promise((resolve, reject) => {
          pool.open(connectionString, (err: Error | null, conn: unknown) => {
            if (err) return reject(err);
            const connection = conn as { query: (sql: string, params: unknown[], cb: (err: Error | null, result: { affectedRows?: number }) => void) => void; close: (cb: () => void) => void };
            connection.query(sql, params || [], (err: Error | null, result: { affectedRows?: number }) => {
              connection.close(() => {});
              if (err) return reject(err);
              resolve({ affectedRows: result?.affectedRows || 0 });
            });
          });
        });
      },
      async transaction<T>(fn: (client: SQLClient) => Promise<T>): Promise<T> {
        return new Promise((resolve, reject) => {
          pool.open(connectionString, async (err: Error | null, conn: unknown) => {
            if (err) return reject(err);
            const connection = conn as { 
              beginTransaction: (cb: (err: Error | null) => void) => void;
              commitTransaction: (cb: (err: Error | null) => void) => void;
              rollbackTransaction: (cb: (err: Error | null) => void) => void;
              query: (sql: string, params: unknown[], cb: (err: Error | null, rows: unknown[]) => void) => void;
              close: (cb: () => void) => void;
            };
            
            connection.beginTransaction(async (err: Error | null) => {
              if (err) {
                connection.close(() => {});
                return reject(err);
              }
              
              try {
                const wrappedClient: SQLClient = {
                  async query<T>(sql: string, params?: unknown[]): Promise<T[]> {
                    return new Promise((res, rej) => {
                      connection.query(sql, params || [], (err, rows) => {
                        if (err) return rej(err);
                        res(rows as T[]);
                      });
                    });
                  },
                  async execute(sql: string, params?: unknown[]): Promise<{ affectedRows: number }> {
                    return new Promise((res, rej) => {
                      connection.query(sql, params || [], (err) => {
                        if (err) return rej(err);
                        res({ affectedRows: 1 });
                      });
                    });
                  },
                  transaction: () => { throw new Error('Nested transactions not supported'); },
                  close: () => Promise.resolve(),
                };
                
                const result = await fn(wrappedClient);
                
                connection.commitTransaction((err: Error | null) => {
                  connection.close(() => {});
                  if (err) return reject(err);
                  resolve(result);
                });
              } catch (error) {
                connection.rollbackTransaction(() => {
                  connection.close(() => {});
                  reject(error);
                });
              }
            });
          });
        });
      },
      async close(): Promise<void> {
        pool.close(() => {});
      },
    };
  }

  private defaultSchemaMapping(): SchemaMapping {
    return {
      tables: {},
      columns: {},
    };
  }
}

// =============================================================================
// APOTHEOSIS ADAPTER IMPLEMENTATION
// =============================================================================

class ClientHostedApotheosisAdapter implements ApotheosisDataAdapter {
  constructor(private adapter: ClientHostedAdapter) {}

    // Extended methods extracted to client-hosted-methods.ts
}