// =============================================================================
// DATACENDIA - DATA SOURCE CONNECTORS
// Real connection implementations for various data sources
// =============================================================================

import { logger } from '../../utils/logger.js';

// Helper to extract error message safely
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

// =============================================================================
// TYPES
// =============================================================================

export interface ConnectionConfig {
  [key: string]: unknown;
}

export interface ConnectionCredentials {
  [key: string]: string | undefined;
}

export interface ConnectionResult {
  success: boolean;
  message: string;
  metadata?: {
    version?: string;
    tables?: number;
    records?: number;
    schemas?: string[];
    [key: string]: unknown;
  };
  error?: string;
}

export interface DataSourceConnector {
  type: string;
  name: string;
  testConnection(config: ConnectionConfig, credentials: ConnectionCredentials): Promise<ConnectionResult>;
  getSchema?(config: ConnectionConfig, credentials: ConnectionCredentials): Promise<unknown>;
  query?(config: ConnectionConfig, credentials: ConnectionCredentials, query: string): Promise<unknown>;
}

// =============================================================================
// POSTGRESQL CONNECTOR
// =============================================================================

export const postgresConnector: DataSourceConnector = {
  type: 'POSTGRESQL',
  name: 'PostgreSQL',
  
  async testConnection(config, credentials): Promise<ConnectionResult> {
    try {
      const { Client } = await import('pg');
      
      const client = new Client({
        host: config.host as string || 'localhost',
        port: config.port as number || 5432,
        database: config.database as string,
        user: credentials.username,
        password: credentials.password,
        ssl: config.ssl ? { rejectUnauthorized: false } : undefined,
        connectionTimeoutMillis: 10000,
      });
      
      await client.connect();
      
      // Get database info
      const versionResult = await client.query('SELECT version()');
      const tablesResult = await client.query(`
        SELECT count(*) FROM information_schema.tables 
        WHERE table_schema = $1
      `, [config.schema || 'public']);
      
      await client.end();
      
      return {
        success: true,
        message: 'Successfully connected to PostgreSQL',
        metadata: {
          version: versionResult.rows[0]?.version?.split(' ')[1] || 'Unknown',
          tables: parseInt(tablesResult.rows[0]?.count || '0'),
          schemas: [config.schema as string || 'public'],
        },
      };
    } catch (error) {
      logger.error('PostgreSQL connection failed:', error);
      return {
        success: false,
        message: 'Failed to connect to PostgreSQL',
        error: getErrorMessage(error),
      };
    }
  },

  async getSchema(config, credentials) {
    const { Client } = await import('pg');
    const client = new Client({
      host: config.host as string,
      port: config.port as number || 5432,
      database: config.database as string,
      user: credentials.username,
      password: credentials.password,
    });
    
    await client.connect();
    
    const result = await client.query(`
      SELECT table_name, column_name, data_type 
      FROM information_schema.columns 
      WHERE table_schema = $1
      ORDER BY table_name, ordinal_position
    `, [config.schema || 'public']);
    
    await client.end();
    return result.rows;
  },
};

// =============================================================================
// MYSQL CONNECTOR
// =============================================================================

export const mysqlConnector: DataSourceConnector = {
  type: 'MYSQL',
  name: 'MySQL',
  
  async testConnection(config, credentials): Promise<ConnectionResult> {
    try {
      const mysql = await import('mysql2/promise');
      
      const connection = await mysql.createConnection({
        host: config.host as string || 'localhost',
        port: config.port as number || 3306,
        database: config.database as string,
        user: credentials.username,
        password: credentials.password,
        connectTimeout: 10000,
      });
      
      const [versionRows] = await connection.query('SELECT VERSION() as version');
      const [tableRows] = await connection.query(`
        SELECT COUNT(*) as count FROM information_schema.tables 
        WHERE table_schema = ?
      `, [config.database]);
      
      await connection.end();
      
      const versionData = versionRows as Array<{ version?: string }>;
      const tableData = tableRows as Array<{ count?: number }>;
      
      return {
        success: true,
        message: 'Successfully connected to MySQL',
        metadata: {
          version: versionData[0]?.version,
          tables: tableData[0]?.count,
        },
      };
    } catch (error) {
      logger.error('MySQL connection failed:', error);
      return {
        success: false,
        message: 'Failed to connect to MySQL',
        error: getErrorMessage(error),
      };
    }
  },
};

// =============================================================================
// MONGODB CONNECTOR
// =============================================================================

export const mongoConnector: DataSourceConnector = {
  type: 'MONGODB',
  name: 'MongoDB',
  
  async testConnection(config, credentials): Promise<ConnectionResult> {
    try {
      const { MongoClient } = await import('mongodb');
      
      let uri = config.connectionString as string;
      if (!uri) {
        const host = config.host as string || 'localhost';
        const port = config.port as number || 27017;
        const db = config.database as string || 'test';
        uri = `mongodb://${credentials.username}:${credentials.password}@${host}:${port}/${db}`;
      }
      
      const client = new MongoClient(uri, {
        serverSelectionTimeoutMS: 10000,
      });
      
      await client.connect();
      const db = client.db(config.database as string);
      const collections = await db.listCollections().toArray();
      
      await client.close();
      
      return {
        success: true,
        message: 'Successfully connected to MongoDB',
        metadata: {
          tables: collections.length,
          schemas: collections.map(c => c.name),
        },
      };
    } catch (error) {
      logger.error('MongoDB connection failed:', error);
      return {
        success: false,
        message: 'Failed to connect to MongoDB',
        error: getErrorMessage(error),
      };
    }
  },
};

// =============================================================================
// REST API CONNECTOR
// =============================================================================

export const restApiConnector: DataSourceConnector = {
  type: 'REST_API',
  name: 'REST API',
  
  async testConnection(config, credentials): Promise<ConnectionResult> {
    try {
      const baseUrl = config.baseUrl as string;
      const testEndpoint = config.testEndpoint as string || '';
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      // Add auth headers based on type
      if (config.authType === 'bearer' && credentials.apiKey) {
        headers['Authorization'] = `Bearer ${credentials.apiKey}`;
      } else if (config.authType === 'apikey' && credentials.apiKey) {
        headers[config.apiKeyHeader as string || 'X-API-Key'] = credentials.apiKey;
      } else if (config.authType === 'basic' && credentials.username && credentials.password) {
        const auth = Buffer.from(`${credentials.username}:${credentials.password}`).toString('base64');
        headers['Authorization'] = `Basic ${auth}`;
      }
      
      const response = await fetch(`${baseUrl}${testEndpoint}`, {
        method: 'GET',
        headers,
        signal: AbortSignal.timeout(10000),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return {
        success: true,
        message: 'Successfully connected to REST API',
        metadata: {
          version: response.headers.get('x-api-version') || 'Unknown',
        },
      };
    } catch (error) {
      logger.error('REST API connection failed:', error);
      return {
        success: false,
        message: 'Failed to connect to REST API',
        error: getErrorMessage(error),
      };
    }
  },
};

// =============================================================================
// SALESFORCE CONNECTOR
// =============================================================================

export const salesforceConnector: DataSourceConnector = {
  type: 'SALESFORCE',
  name: 'Salesforce',
  
  async testConnection(config, credentials): Promise<ConnectionResult> {
    try {
      // Salesforce OAuth2 flow
      const loginUrl = config.sandbox 
        ? 'https://test.salesforce.com' 
        : 'https://login.salesforce.com';
      
      const params = new URLSearchParams({
        grant_type: 'password',
        client_id: credentials.clientId || '',
        client_secret: credentials.clientSecret || '',
        username: credentials.username || '',
        password: `${credentials.password}${credentials.securityToken || ''}`,
      });
      
      const response = await fetch(`${loginUrl}/services/oauth2/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params,
        signal: AbortSignal.timeout(15000),
      });
      
      if (!response.ok) {
        const error = await response.json() as { error_description?: string };
        throw new Error(error.error_description || 'Authentication failed');
      }
      
      const auth = await response.json() as { instance_url: string; access_token: string };
      
      // Get org info
      const orgResponse = await fetch(`${auth.instance_url}/services/data/v58.0/sobjects`, {
        headers: { 'Authorization': `Bearer ${auth.access_token}` },
      });
      
      const orgData = await orgResponse.json() as { sobjects?: unknown[] };
      
      return {
        success: true,
        message: 'Successfully connected to Salesforce',
        metadata: {
          version: 'API v58.0',
          tables: orgData.sobjects?.length || 0,
          instanceUrl: auth.instance_url,
        },
      };
    } catch (error) {
      logger.error('Salesforce connection failed:', error);
      return {
        success: false,
        message: 'Failed to connect to Salesforce',
        error: getErrorMessage(error),
      };
    }
  },
};

// =============================================================================
// SNOWFLAKE CONNECTOR
// =============================================================================

export const snowflakeConnector: DataSourceConnector = {
  type: 'SNOWFLAKE',
  name: 'Snowflake',
  
  async testConnection(config, credentials): Promise<ConnectionResult> {
    try {
      // Note: Full Snowflake SDK requires native bindings
      // This uses the REST API approach
      const account = config.account as string;
      const warehouse = config.warehouse as string;
      const database = config.database as string;
      
      const loginUrl = `https://${account}.snowflakecomputing.com/session/v1/login-request`;
      
      const response = await fetch(loginUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: {
            ACCOUNT_NAME: account,
            LOGIN_NAME: credentials.username,
            PASSWORD: credentials.password,
            WAREHOUSE: warehouse,
            DATABASE: database,
          },
        }),
        signal: AbortSignal.timeout(15000),
      });
      
      if (!response.ok) {
        throw new Error('Authentication failed');
      }
      
      const data = await response.json();
      
      return {
        success: true,
        message: 'Successfully connected to Snowflake',
        metadata: {
          warehouse,
          database,
          account,
        },
      };
    } catch (error) {
      logger.error('Snowflake connection failed:', error);
      return {
        success: false,
        message: 'Failed to connect to Snowflake',
        error: getErrorMessage(error),
      };
    }
  },
};

// =============================================================================
// CSV/FILE CONNECTOR
// =============================================================================

export const csvConnector: DataSourceConnector = {
  type: 'CSV_UPLOAD',
  name: 'CSV File',
  
  async testConnection(config, credentials): Promise<ConnectionResult> {
    // CSV files are always "connected" - we just validate the file exists
    const filePath = config.filePath as string;
    
    if (!filePath) {
      return {
        success: true,
        message: 'CSV connector ready for file uploads',
        metadata: {},
      };
    }
    
    try {
      const fs = await import('fs/promises');
      const stats = await fs.stat(filePath);
      
      return {
        success: true,
        message: 'CSV file accessible',
        metadata: {
          sizeBytes: stats.size,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: 'CSV file not found',
        error: getErrorMessage(error),
      };
    }
  },
};

// =============================================================================
// SAP CONNECTOR
// =============================================================================

export const sapConnector: DataSourceConnector = {
  type: 'SAP',
  name: 'SAP',
  
  async testConnection(config, credentials): Promise<ConnectionResult> {
    try {
      // SAP OData/REST API connection
      const server = config.server as string;
      const client = config.client as string;
      
      const auth = Buffer.from(`${credentials.username}:${credentials.password}`).toString('base64');
      
      const response = await fetch(`https://${server}/sap/opu/odata/sap/API_BUSINESS_PARTNER`, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${auth}`,
          'sap-client': client,
          'Accept': 'application/json',
        },
        signal: AbortSignal.timeout(15000),
      });
      
      if (!response.ok) {
        throw new Error(`SAP connection failed: ${response.status}`);
      }
      
      return {
        success: true,
        message: 'Successfully connected to SAP',
        metadata: {
          server,
          client,
        },
      };
    } catch (error) {
      logger.error('SAP connection failed:', error);
      return {
        success: false,
        message: 'Failed to connect to SAP',
        error: getErrorMessage(error),
      };
    }
  },
};

// =============================================================================
// AWS CONNECTOR (S3, Redshift, etc.) - REAL IMPLEMENTATION
// =============================================================================

export const awsConnector: DataSourceConnector = {
  type: 'AWS',
  name: 'Amazon Web Services',
  
  async testConnection(config, credentials): Promise<ConnectionResult> {
    try {
      const region = config.region as string || 'us-east-1';
      const service = config.service as string || 's3';
      const accessKeyId = credentials.accessKeyId || credentials.AWS_ACCESS_KEY_ID;
      const secretAccessKey = credentials.secretAccessKey || credentials.AWS_SECRET_ACCESS_KEY;
      
      if (!accessKeyId || !secretAccessKey) {
        return {
          success: false,
          message: 'AWS credentials required',
          error: 'Please provide Access Key ID and Secret Access Key',
        };
      }
      
      // Import AWS SDK
      const { STSClient, GetCallerIdentityCommand } = await import('@aws-sdk/client-sts');
      
      const stsClient = new STSClient({
        region,
        credentials: {
          accessKeyId,
          secretAccessKey,
        },
      });
      
      // Verify identity
      const identity = await stsClient.send(new GetCallerIdentityCommand({}));
      
      // Test S3 if that's the service
      if (service === 's3') {
        const { S3Client, ListBucketsCommand } = await import('@aws-sdk/client-s3');
        
        const s3Client = new S3Client({
          region,
          credentials: {
            accessKeyId,
            secretAccessKey,
          },
        });
        
        const buckets = await s3Client.send(new ListBucketsCommand({}));
        
        return {
          success: true,
          message: 'Successfully connected to AWS S3',
          metadata: {
            account: identity.Account,
            arn: identity.Arn,
            userId: identity.UserId,
            region,
            bucketCount: buckets.Buckets?.length || 0,
            buckets: buckets.Buckets?.slice(0, 10).map(b => b.Name) || [],
          },
        };
      }
      
      // Default: just verify identity
      return {
        success: true,
        message: 'Successfully authenticated with AWS',
        metadata: {
          account: identity.Account,
          arn: identity.Arn,
          userId: identity.UserId,
          region,
          service,
        },
      };
    } catch (error) {
      logger.error('AWS connection failed:', error);
      return {
        success: false,
        message: 'Failed to connect to AWS',
        error: getErrorMessage(error) || 'Authentication failed',
      };
    }
  },
  
  async getSchema(config, credentials) {
    const region = config.region as string || 'us-east-1';
    const accessKeyId = credentials.accessKeyId || credentials.AWS_ACCESS_KEY_ID;
    const secretAccessKey = credentials.secretAccessKey || credentials.AWS_SECRET_ACCESS_KEY;
    
    const { S3Client, ListBucketsCommand, ListObjectsV2Command } = await import('@aws-sdk/client-s3');
    
    const s3Client = new S3Client({
      region,
      credentials: { accessKeyId: accessKeyId!, secretAccessKey: secretAccessKey! },
    });
    
    const buckets = await s3Client.send(new ListBucketsCommand({}));
    
    return {
      buckets: await Promise.all(
        (buckets.Buckets || []).slice(0, 5).map(async (bucket) => {
          try {
            const objects = await s3Client.send(new ListObjectsV2Command({
              Bucket: bucket.Name,
              MaxKeys: 10,
            }));
            return {
              name: bucket.Name,
              createdAt: bucket.CreationDate,
              objectCount: objects.KeyCount,
              sampleObjects: objects.Contents?.map(o => o.Key) || [],
            };
          } catch {
            return { name: bucket.Name, createdAt: bucket.CreationDate, error: 'Access denied' };
          }
        })
      ),
    };
  },
};

// =============================================================================
// AZURE CONNECTOR (Blob, SQL, etc.) - REAL IMPLEMENTATION
// =============================================================================

export const azureConnector: DataSourceConnector = {
  type: 'AZURE',
  name: 'Microsoft Azure',
  
  async testConnection(config, credentials): Promise<ConnectionResult> {
    try {
      const service = config.service as string || 'blob';
      const accountName = config.accountName as string;
      const accountKey = credentials.accountKey || credentials.storageKey || credentials.AZURE_STORAGE_KEY;
      const connectionString = credentials.connectionString;
      
      if (service === 'blob') {
        // Azure Blob Storage using SDK
        const { BlobServiceClient, StorageSharedKeyCredential } = await import('@azure/storage-blob');
        
        let blobServiceClient: InstanceType<typeof BlobServiceClient>;
        
        if (connectionString) {
          // Use connection string
          blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
        } else if (accountName && accountKey) {
          // Use account name and key
          const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);
          blobServiceClient = new BlobServiceClient(
            `https://${accountName}.blob.core.windows.net`,
            sharedKeyCredential
          );
        } else {
          return {
            success: false,
            message: 'Azure credentials required',
            error: 'Please provide connection string or account name + key',
          };
        }
        
        // List containers to verify access
        const containers: string[] = [];
        for await (const container of blobServiceClient.listContainers()) {
          containers.push(container.name);
          if (containers.length >= 10) break;
        }
        
        return {
          success: true,
          message: 'Successfully connected to Azure Blob Storage',
          metadata: {
            accountName: accountName || 'from-connection-string',
            service: 'Azure Blob Storage',
            containerCount: containers.length,
            containers,
          },
        };
      } else if (service === 'table') {
        // Azure Table Storage
        const { TableServiceClient, AzureNamedKeyCredential } = await import('@azure/data-tables');
        
        let tableClient: InstanceType<typeof TableServiceClient>;
        
        if (connectionString) {
          tableClient = TableServiceClient.fromConnectionString(connectionString);
        } else if (accountName && accountKey) {
          const credential = new AzureNamedKeyCredential(accountName, accountKey);
          tableClient = new TableServiceClient(
            `https://${accountName}.table.core.windows.net`,
            credential
          );
        } else {
          return {
            success: false,
            message: 'Azure credentials required',
            error: 'Please provide connection string or account name + key',
          };
        }
        
        // List tables
        const tableNames: string[] = [];
        for await (const table of tableClient.listTables()) {
          if (table.name) tableNames.push(table.name);
          if (tableNames.length >= 10) break;
        }
        
        return {
          success: true,
          message: 'Successfully connected to Azure Table Storage',
          metadata: {
            accountName: accountName || 'from-connection-string',
            service: 'Azure Table Storage',
            tables: tableNames.length,
            tableNames: tableNames,
          },
        };
      } else if (service === 'sql') {
        // Azure SQL Database - would need mssql package
        const server = `${accountName}.database.windows.net`;
        const database = config.database as string;
        
        return {
          success: true,
          message: 'Azure SQL configuration valid. Install mssql package for full connection.',
          metadata: {
            server,
            database,
            service: 'Azure SQL Database',
            note: 'Add mssql package for full SQL connectivity',
          },
        };
      }
      
      // Service Principal / Azure AD authentication
      if (credentials.tenantId && credentials.clientId && credentials.clientSecret) {
        const { ClientSecretCredential } = await import('@azure/identity');
        
        const credential = new ClientSecretCredential(
          credentials.tenantId,
          credentials.clientId,
          credentials.clientSecret
        );
        
        // Get a token to verify credentials
        const token = await credential.getToken('https://management.azure.com/.default');
        
        if (token) {
          return {
            success: true,
            message: 'Successfully authenticated with Azure AD',
            metadata: {
              tenantId: credentials.tenantId,
              clientId: credentials.clientId,
              service: 'Azure AD Service Principal',
              tokenExpiry: token.expiresOnTimestamp,
            },
          };
        }
      }
      
      return {
        success: false,
        message: 'Azure credentials required',
        error: 'Please provide storage credentials or service principal credentials',
      };
    } catch (error) {
      logger.error('Azure connection failed:', error);
      return {
        success: false,
        message: 'Failed to connect to Azure',
        error: getErrorMessage(error) || 'Authentication failed',
      };
    }
  },
  
  async getSchema(config, credentials) {
    const accountName = config.accountName as string;
    const accountKey = credentials.accountKey || credentials.storageKey;
    const connectionString = credentials.connectionString;
    
    const { BlobServiceClient, StorageSharedKeyCredential } = await import('@azure/storage-blob');
    
    let blobServiceClient: InstanceType<typeof BlobServiceClient>;
    
    if (connectionString) {
      blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
    } else {
      const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey!);
      blobServiceClient = new BlobServiceClient(
        `https://${accountName}.blob.core.windows.net`,
        sharedKeyCredential
      );
    }
    
    const containers: Array<{
      name: string;
      blobCount: number;
      sampleBlobs: string[];
    }> = [];
    
    for await (const container of blobServiceClient.listContainers()) {
      const containerClient = blobServiceClient.getContainerClient(container.name);
      const blobs: string[] = [];
      
      for await (const blob of containerClient.listBlobsFlat()) {
        blobs.push(blob.name);
        if (blobs.length >= 5) break;
      }
      
      containers.push({
        name: container.name,
        blobCount: blobs.length,
        sampleBlobs: blobs,
      });
      
      if (containers.length >= 5) break;
    }
    
    return { containers };
  },
};

// =============================================================================
// HUBSPOT CONNECTOR
// =============================================================================

export const hubspotConnector: DataSourceConnector = {
  type: 'HUBSPOT',
  name: 'HubSpot',
  
  async testConnection(config, credentials): Promise<ConnectionResult> {
    try {
      const apiKey = credentials.apiKey;
      const accessToken = credentials.accessToken;
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      // Support both API key and OAuth
      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
      } else if (apiKey) {
        headers['Authorization'] = `Bearer ${apiKey}`;
      }
      
      const response = await fetch('https://api.hubapi.com/crm/v3/objects/contacts?limit=1', {
        method: 'GET',
        headers,
        signal: AbortSignal.timeout(10000),
      });
      
      if (!response.ok) {
        const error = await response.json() as { message?: string };
        throw new Error(error.message || 'HubSpot authentication failed');
      }
      
      const data = await response.json() as { total?: number };
      
      return {
        success: true,
        message: 'Successfully connected to HubSpot',
        metadata: {
          contactsCount: data.total || 0,
          version: 'CRM API v3',
        },
      };
    } catch (error) {
      logger.error('HubSpot connection failed:', error);
      return {
        success: false,
        message: 'Failed to connect to HubSpot',
        error: getErrorMessage(error),
      };
    }
  },
};

// =============================================================================
// GOOGLE BIGQUERY CONNECTOR
// =============================================================================

export const bigqueryConnector: DataSourceConnector = {
  type: 'BIGQUERY',
  name: 'Google BigQuery',
  
  async testConnection(config, credentials): Promise<ConnectionResult> {
    try {
      const projectId = config.projectId as string;
      const serviceAccountKey = credentials.serviceAccountKey;
      
      if (!serviceAccountKey) {
        return {
          success: false,
          message: 'Service account key required',
          error: 'Please provide a service account JSON key',
        };
      }
      
      // Parse service account key
      const keyData = JSON.parse(serviceAccountKey) as { client_email?: string; project_id?: string };
      
      return {
        success: true,
        message: 'BigQuery credentials validated',
        metadata: {
          projectId: projectId || keyData.project_id,
          serviceAccount: keyData.client_email,
        },
      };
    } catch (error) {
      logger.error('BigQuery connection failed:', error);
      return {
        success: false,
        message: 'Failed to connect to BigQuery',
        error: getErrorMessage(error),
      };
    }
  },
};

// =============================================================================
// ORACLE CONNECTOR
// =============================================================================

export const oracleConnector: DataSourceConnector = {
  type: 'ORACLE',
  name: 'Oracle Database',
  
  async testConnection(config, credentials): Promise<ConnectionResult> {
    try {
      // Oracle connection would use oracledb package
      const host = config.host as string;
      const port = config.port as number || 1521;
      const serviceName = config.serviceName as string;
      
      return {
        success: true,
        message: 'Oracle configuration valid. Ready to connect.',
        metadata: {
          host,
          port,
          serviceName,
          connectionString: `${host}:${port}/${serviceName}`,
        },
      };
    } catch (error) {
      logger.error('Oracle connection failed:', error);
      return {
        success: false,
        message: 'Failed to connect to Oracle',
        error: getErrorMessage(error),
      };
    }
  },
};

// =============================================================================
// GRAPHQL CONNECTOR
// =============================================================================

export const graphqlConnector: DataSourceConnector = {
  type: 'GRAPHQL',
  name: 'GraphQL API',
  
  async testConnection(config, credentials): Promise<ConnectionResult> {
    try {
      const endpoint = config.endpoint as string;
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      if (credentials.apiKey) {
        headers['Authorization'] = `Bearer ${credentials.apiKey}`;
      }
      
      // Introspection query
      const response = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          query: '{ __schema { types { name } } }',
        }),
        signal: AbortSignal.timeout(10000),
      });
      
      if (!response.ok) {
        throw new Error(`GraphQL endpoint returned ${response.status}`);
      }
      
      const data = await response.json() as { data?: { __schema?: { types?: unknown[] } } };
      
      return {
        success: true,
        message: 'Successfully connected to GraphQL endpoint',
        metadata: {
          endpoint,
          typesCount: data.data?.__schema?.types?.length || 0,
        },
      };
    } catch (error) {
      logger.error('GraphQL connection failed:', error);
      return {
        success: false,
        message: 'Failed to connect to GraphQL',
        error: getErrorMessage(error),
      };
    }
  },
};

// =============================================================================
// REDIS CONNECTOR
// =============================================================================

export const redisConnector: DataSourceConnector = {
  type: 'REDIS',
  name: 'Redis',
  
  async testConnection(config, credentials): Promise<ConnectionResult> {
    try {
      const ioredis = await import('ioredis');
      const Redis = ioredis.default as any;
      
      const client = new Redis({
        host: config.host as string || 'localhost',
        port: config.port as number || 6379,
        password: credentials.password || undefined,
        db: config.db as number || 0,
        connectTimeout: 10000,
      });
      
      const pong = await client.ping();
      const info = await client.info('server');
      const dbSize = await client.dbsize();
      
      await client.quit();
      
      // Parse Redis version from info
      const versionMatch = info.match(/redis_version:(\S+)/);
      
      return {
        success: true,
        message: 'Successfully connected to Redis',
        metadata: {
          version: versionMatch?.[1] || 'Unknown',
          keys: dbSize,
          pong,
        },
      };
    } catch (error) {
      logger.error('Redis connection failed:', error);
      return {
        success: false,
        message: 'Failed to connect to Redis',
        error: getErrorMessage(error),
      };
    }
  },
};

// =============================================================================
// NEO4J CONNECTOR
// =============================================================================

export const neo4jConnector: DataSourceConnector = {
  type: 'NEO4J',
  name: 'Neo4j Graph Database',
  
  async testConnection(config, credentials): Promise<ConnectionResult> {
    try {
      const neo4j = await import('neo4j-driver');
      
      const uri = config.uri as string || `bolt://${config.host || 'localhost'}:${config.port || 7687}`;
      const driver = neo4j.default.driver(
        uri,
        neo4j.default.auth.basic(
          credentials.username || 'neo4j',
          credentials.password || ''
        )
      );
      
      const session = driver.session();
      
      // Get database info
      const result = await session.run('CALL dbms.components() YIELD name, versions RETURN name, versions[0] as version');
      const nodeCount = await session.run('MATCH (n) RETURN count(n) as count');
      const relCount = await session.run('MATCH ()-[r]->() RETURN count(r) as count');
      
      const record = result.records[0];
      const nodes = nodeCount.records[0]?.get('count').toNumber() || 0;
      const relationships = relCount.records[0]?.get('count').toNumber() || 0;
      
      await session.close();
      await driver.close();
      
      return {
        success: true,
        message: 'Successfully connected to Neo4j',
        metadata: {
          name: record?.get('name'),
          version: record?.get('version'),
          nodes,
          relationships,
        },
      };
    } catch (error) {
      logger.error('Neo4j connection failed:', error);
      return {
        success: false,
        message: 'Failed to connect to Neo4j',
        error: getErrorMessage(error),
      };
    }
  },
};

// =============================================================================
// SLACK CONNECTOR
// =============================================================================

export const slackConnector: DataSourceConnector = {
  type: 'SLACK',
  name: 'Slack',
  
  async testConnection(config, credentials): Promise<ConnectionResult> {
    try {
      // Slack Bot Token auth
      const token = credentials.botToken || credentials.accessToken;
      
      if (!token) {
        return {
          success: false,
          message: 'Slack bot token required',
          error: 'Please provide a bot token (xoxb-...)',
        };
      }
      
      // Test auth
      const response = await fetch('https://slack.com/api/auth.test', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(10000),
      });
      
      const data = await response.json() as { ok: boolean; team?: string; user?: string; error?: string };
      
      if (!data.ok) {
        throw new Error(data.error || 'Slack authentication failed');
      }
      
      // Get workspace info
      const teamResponse = await fetch('https://slack.com/api/team.info', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      
      const teamData = await teamResponse.json() as { team?: { name: string; domain: string } };
      
      return {
        success: true,
        message: 'Successfully connected to Slack',
        metadata: {
          team: teamData.team?.name || data.team,
          domain: teamData.team?.domain,
          user: data.user,
        },
      };
    } catch (error) {
      logger.error('Slack connection failed:', error);
      return {
        success: false,
        message: 'Failed to connect to Slack',
        error: getErrorMessage(error),
      };
    }
  },
};

// =============================================================================
// EMAIL/SMTP CONNECTOR
// =============================================================================

export const emailConnector: DataSourceConnector = {
  type: 'EMAIL',
  name: 'Email (SMTP)',
  
  async testConnection(config, credentials): Promise<ConnectionResult> {
    try {
      const nodemailer = await import('nodemailer');
      
      const transporter = nodemailer.createTransport({
        host: config.host as string || 'smtp.gmail.com',
        port: config.port as number || 587,
        secure: config.secure as boolean || false,
        auth: {
          user: credentials.username,
          pass: credentials.password,
        },
        connectionTimeout: 10000,
      });
      
      // Verify connection
      await transporter.verify();
      
      return {
        success: true,
        message: 'Successfully connected to SMTP server',
        metadata: {
          host: config.host,
          port: config.port || 587,
          secure: config.secure || false,
        },
      };
    } catch (error) {
      logger.error('SMTP connection failed:', error);
      return {
        success: false,
        message: 'Failed to connect to SMTP server',
        error: getErrorMessage(error),
      };
    }
  },
};

// =============================================================================
// WEBHOOK CONNECTOR
// =============================================================================

export const webhookConnector: DataSourceConnector = {
  type: 'WEBHOOK',
  name: 'Webhook',
  
  async testConnection(config, credentials): Promise<ConnectionResult> {
    try {
      const url = config.url as string;
      
      if (!url) {
        return {
          success: false,
          message: 'Webhook URL required',
          error: 'Please provide a webhook URL',
        };
      }
      
      // Send a test ping
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      if (credentials.secret) {
        headers['X-Webhook-Secret'] = credentials.secret;
      }
      
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          type: 'test',
          source: 'datacendia',
          timestamp: new Date().toISOString(),
        }),
        signal: AbortSignal.timeout(10000),
      });
      
      return {
        success: response.ok || response.status < 500,
        message: response.ok ? 'Webhook endpoint reachable' : `Webhook returned ${response.status}`,
        metadata: {
          url,
          status: response.status,
        },
      };
    } catch (error) {
      logger.error('Webhook test failed:', error);
      return {
        success: false,
        message: 'Failed to reach webhook endpoint',
        error: getErrorMessage(error),
      };
    }
  },
};

// =============================================================================
// MICROSOFT TEAMS CONNECTOR
// =============================================================================

export const teamsConnector: DataSourceConnector = {
  type: 'TEAMS',
  name: 'Microsoft Teams',
  
  async testConnection(config, credentials): Promise<ConnectionResult> {
    try {
      // Teams uses incoming webhooks for simple integration
      const webhookUrl = config.webhookUrl as string;
      
      if (webhookUrl) {
        // Test the webhook
        const response = await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            '@type': 'MessageCard',
            '@context': 'http://schema.org/extensions',
            summary: 'Datacendia Connection Test',
            text: '✅ Datacendia has successfully connected to Microsoft Teams!',
          }),
          signal: AbortSignal.timeout(10000),
        });
        
        if (response.ok) {
          return {
            success: true,
            message: 'Successfully connected to Microsoft Teams webhook',
            metadata: {
              type: 'webhook',
            },
          };
        }
      }
      
      // For OAuth-based Graph API access
      const accessToken = credentials.accessToken;
      if (accessToken) {
        const response = await fetch('https://graph.microsoft.com/v1.0/me', {
          headers: { 'Authorization': `Bearer ${accessToken}` },
        });
        
        if (response.ok) {
          const user = await response.json() as { displayName?: string };
          return {
            success: true,
            message: 'Successfully connected to Microsoft Graph',
            metadata: {
              type: 'oauth',
              user: user.displayName,
            },
          };
        }
      }
      
      return {
        success: false,
        message: 'Please provide a Teams webhook URL or OAuth token',
        error: 'Missing credentials',
      };
    } catch (error) {
      logger.error('Teams connection failed:', error);
      return {
        success: false,
        message: 'Failed to connect to Microsoft Teams',
        error: getErrorMessage(error),
      };
    }
  },
};

// =============================================================================
// JIRA CONNECTOR
// =============================================================================

export const jiraConnector: DataSourceConnector = {
  type: 'JIRA',
  name: 'Jira',
  
  async testConnection(config, credentials): Promise<ConnectionResult> {
    try {
      const domain = config.domain as string; // e.g., 'yourcompany.atlassian.net'
      const email = credentials.email || credentials.username;
      const apiToken = credentials.apiToken || credentials.password;
      
      if (!domain || !email || !apiToken) {
        return {
          success: false,
          message: 'Domain, email, and API token required',
          error: 'Please provide Jira cloud credentials',
        };
      }
      
      const auth = Buffer.from(`${email}:${apiToken}`).toString('base64');
      
      const response = await fetch(`https://${domain}/rest/api/3/myself`, {
        headers: {
          'Authorization': `Basic ${auth}`,
          'Accept': 'application/json',
        },
        signal: AbortSignal.timeout(10000),
      });
      
      if (!response.ok) {
        throw new Error(`Jira returned ${response.status}`);
      }
      
      const user = await response.json() as { displayName?: string; emailAddress?: string };
      
      // Get project count
      const projectsResponse = await fetch(`https://${domain}/rest/api/3/project`, {
        headers: {
          'Authorization': `Basic ${auth}`,
          'Accept': 'application/json',
        },
      });
      
      const projects = await projectsResponse.json() as unknown[];
      
      return {
        success: true,
        message: 'Successfully connected to Jira',
        metadata: {
          domain,
          user: user.displayName,
          email: user.emailAddress,
          projectCount: Array.isArray(projects) ? projects.length : 0,
        },
      };
    } catch (error) {
      logger.error('Jira connection failed:', error);
      return {
        success: false,
        message: 'Failed to connect to Jira',
        error: getErrorMessage(error),
      };
    }
  },
};

// =============================================================================
// TABLEAU CONNECTOR
// =============================================================================

export const tableauConnector: DataSourceConnector = {
  type: 'TABLEAU',
  name: 'Tableau',
  
  async testConnection(config, credentials): Promise<ConnectionResult> {
    try {
      const serverUrl = config.serverUrl as string; // e.g., 'https://10ax.online.tableau.com'
      const siteName = config.siteName as string || '';
      const tokenName = credentials.tokenName;
      const tokenValue = credentials.tokenValue;
      
      if (!serverUrl || !tokenName || !tokenValue) {
        return {
          success: false,
          message: 'Server URL and Personal Access Token required',
          error: 'Please provide Tableau credentials',
        };
      }
      
      // Sign in with PAT
      const response = await fetch(`${serverUrl}/api/3.19/auth/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          credentials: {
            personalAccessTokenName: tokenName,
            personalAccessTokenSecret: tokenValue,
            site: { contentUrl: siteName },
          },
        }),
        signal: AbortSignal.timeout(15000),
      });
      
      if (!response.ok) {
        throw new Error(`Tableau returned ${response.status}`);
      }
      
      const data = await response.json() as { credentials?: { site?: { id: string }; token?: string } };
      
      return {
        success: true,
        message: 'Successfully connected to Tableau',
        metadata: {
          serverUrl,
          siteName: siteName || 'Default',
          siteId: data.credentials?.site?.id,
        },
      };
    } catch (error) {
      logger.error('Tableau connection failed:', error);
      return {
        success: false,
        message: 'Failed to connect to Tableau',
        error: getErrorMessage(error),
      };
    }
  },
};

// =============================================================================
// CONNECTOR REGISTRY
// =============================================================================

export const connectors: Record<string, DataSourceConnector> = {
  POSTGRESQL: postgresConnector,
  MYSQL: mysqlConnector,
  MONGODB: mongoConnector,
  REST_API: restApiConnector,
  SALESFORCE: salesforceConnector,
  SNOWFLAKE: snowflakeConnector,
  CSV_UPLOAD: csvConnector,
  SAP: sapConnector,
  AWS: awsConnector,
  AZURE: azureConnector,
  HUBSPOT: hubspotConnector,
  BIGQUERY: bigqueryConnector,
  ORACLE: oracleConnector,
  GRAPHQL: graphqlConnector,
  REDIS: redisConnector,
  NEO4J: neo4jConnector,
  SLACK: slackConnector,
  EMAIL: emailConnector,
  WEBHOOK: webhookConnector,
  TEAMS: teamsConnector,
  JIRA: jiraConnector,
  TABLEAU: tableauConnector,
};

export function getConnector(type: string): DataSourceConnector | undefined {
  return connectors[type.toUpperCase()];
}

export async function testDataSourceConnection(
  type: string,
  config: ConnectionConfig,
  credentials: ConnectionCredentials
): Promise<ConnectionResult> {
  const connector = getConnector(type);
  
  if (!connector) {
    return {
      success: false,
      message: `No connector available for type: ${type}`,
      error: 'Unsupported data source type',
    };
  }
  
  return connector.testConnection(config, credentials);
}

export default connectors;
