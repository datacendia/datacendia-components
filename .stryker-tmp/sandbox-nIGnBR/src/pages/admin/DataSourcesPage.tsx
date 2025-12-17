// @ts-nocheck
// =============================================================================
// DATACENDIA - ADMIN DATA SOURCES PAGE
// Configure and manage data source connections
// =============================================================================
function stryNS_9fa48() {
  var g = typeof globalThis === 'object' && globalThis && globalThis.Math === Math && globalThis || new Function("return this")();
  var ns = g.__stryker__ || (g.__stryker__ = {});
  if (ns.activeMutant === undefined && g.process && g.process.env && g.process.env.__STRYKER_ACTIVE_MUTANT__) {
    ns.activeMutant = g.process.env.__STRYKER_ACTIVE_MUTANT__;
  }
  function retrieveNS() {
    return ns;
  }
  stryNS_9fa48 = retrieveNS;
  return retrieveNS();
}
stryNS_9fa48();
function stryCov_9fa48() {
  var ns = stryNS_9fa48();
  var cov = ns.mutantCoverage || (ns.mutantCoverage = {
    static: {},
    perTest: {}
  });
  function cover() {
    var c = cov.static;
    if (ns.currentTestId) {
      c = cov.perTest[ns.currentTestId] = cov.perTest[ns.currentTestId] || {};
    }
    var a = arguments;
    for (var i = 0; i < a.length; i++) {
      c[a[i]] = (c[a[i]] || 0) + 1;
    }
  }
  stryCov_9fa48 = cover;
  cover.apply(null, arguments);
}
function stryMutAct_9fa48(id) {
  var ns = stryNS_9fa48();
  function isActive(id) {
    if (ns.activeMutant === id) {
      if (ns.hitCount !== void 0 && ++ns.hitCount > ns.hitLimit) {
        throw new Error('Stryker: Hit count limit reached (' + ns.hitCount + ')');
      }
      return true;
    }
    return false;
  }
  stryMutAct_9fa48 = isActive;
  return isActive(id);
}
import React, { useState, useEffect } from 'react';
import { Database, Plus, RefreshCw, Check, X, AlertCircle, ChevronRight, Eye, EyeOff, Trash2, TestTube, Settings, Cloud, Server, FileSpreadsheet, Link2 } from 'lucide-react';
import { api } from '../../lib/api';

// =============================================================================
// TYPES
// =============================================================================

interface DataSource {
  id: string;
  name: string;
  type: string;
  status: 'PENDING' | 'CONNECTED' | 'SYNCING' | 'ERROR' | 'DISABLED';
  config: Record<string, unknown>;
  lastSyncAt?: string;
  metadata?: Record<string, unknown>;
}
interface ConnectionTestResult {
  success: boolean;
  message: string;
  metadata?: Record<string, unknown>;
  error?: string;
}

// Connector configurations
const CONNECTOR_CONFIGS: Record<string, {
  name: string;
  icon: string;
  category: string;
  fields: Array<{
    key: string;
    label: string;
    type: 'text' | 'password' | 'number' | 'select' | 'textarea';
    placeholder?: string;
    required?: boolean;
    isCredential?: boolean;
    options?: Array<{
      value: string;
      label: string;
    }>;
  }>;
}> = stryMutAct_9fa48("16845") ? {} : (stryCov_9fa48("16845"), {
  POSTGRESQL: stryMutAct_9fa48("16846") ? {} : (stryCov_9fa48("16846"), {
    name: 'PostgreSQL',
    icon: '🗄️',
    category: 'Database',
    fields: stryMutAct_9fa48("16850") ? [] : (stryCov_9fa48("16850"), [stryMutAct_9fa48("16851") ? {} : (stryCov_9fa48("16851"), {
      key: 'host',
      label: 'Host',
      type: 'text',
      placeholder: 'localhost',
      required: stryMutAct_9fa48("16856") ? false : (stryCov_9fa48("16856"), true)
    }), stryMutAct_9fa48("16857") ? {} : (stryCov_9fa48("16857"), {
      key: 'port',
      label: 'Port',
      type: 'number',
      placeholder: '5432',
      required: stryMutAct_9fa48("16862") ? false : (stryCov_9fa48("16862"), true)
    }), stryMutAct_9fa48("16863") ? {} : (stryCov_9fa48("16863"), {
      key: 'database',
      label: 'Database',
      type: 'text',
      placeholder: 'mydb',
      required: stryMutAct_9fa48("16868") ? false : (stryCov_9fa48("16868"), true)
    }), stryMutAct_9fa48("16869") ? {} : (stryCov_9fa48("16869"), {
      key: 'schema',
      label: 'Schema',
      type: 'text',
      placeholder: 'public'
    }), stryMutAct_9fa48("16874") ? {} : (stryCov_9fa48("16874"), {
      key: 'username',
      label: 'Username',
      type: 'text',
      required: stryMutAct_9fa48("16878") ? false : (stryCov_9fa48("16878"), true),
      isCredential: stryMutAct_9fa48("16879") ? false : (stryCov_9fa48("16879"), true)
    }), stryMutAct_9fa48("16880") ? {} : (stryCov_9fa48("16880"), {
      key: 'password',
      label: 'Password',
      type: 'password',
      required: stryMutAct_9fa48("16884") ? false : (stryCov_9fa48("16884"), true),
      isCredential: stryMutAct_9fa48("16885") ? false : (stryCov_9fa48("16885"), true)
    })])
  }),
  MYSQL: stryMutAct_9fa48("16886") ? {} : (stryCov_9fa48("16886"), {
    name: 'MySQL',
    icon: '🗄️',
    category: 'Database',
    fields: stryMutAct_9fa48("16890") ? [] : (stryCov_9fa48("16890"), [stryMutAct_9fa48("16891") ? {} : (stryCov_9fa48("16891"), {
      key: 'host',
      label: 'Host',
      type: 'text',
      placeholder: 'localhost',
      required: stryMutAct_9fa48("16896") ? false : (stryCov_9fa48("16896"), true)
    }), stryMutAct_9fa48("16897") ? {} : (stryCov_9fa48("16897"), {
      key: 'port',
      label: 'Port',
      type: 'number',
      placeholder: '3306',
      required: stryMutAct_9fa48("16902") ? false : (stryCov_9fa48("16902"), true)
    }), stryMutAct_9fa48("16903") ? {} : (stryCov_9fa48("16903"), {
      key: 'database',
      label: 'Database',
      type: 'text',
      required: stryMutAct_9fa48("16907") ? false : (stryCov_9fa48("16907"), true)
    }), stryMutAct_9fa48("16908") ? {} : (stryCov_9fa48("16908"), {
      key: 'username',
      label: 'Username',
      type: 'text',
      required: stryMutAct_9fa48("16912") ? false : (stryCov_9fa48("16912"), true),
      isCredential: stryMutAct_9fa48("16913") ? false : (stryCov_9fa48("16913"), true)
    }), stryMutAct_9fa48("16914") ? {} : (stryCov_9fa48("16914"), {
      key: 'password',
      label: 'Password',
      type: 'password',
      required: stryMutAct_9fa48("16918") ? false : (stryCov_9fa48("16918"), true),
      isCredential: stryMutAct_9fa48("16919") ? false : (stryCov_9fa48("16919"), true)
    })])
  }),
  MONGODB: stryMutAct_9fa48("16920") ? {} : (stryCov_9fa48("16920"), {
    name: 'MongoDB',
    icon: '🍃',
    category: 'Database',
    fields: stryMutAct_9fa48("16924") ? [] : (stryCov_9fa48("16924"), [stryMutAct_9fa48("16925") ? {} : (stryCov_9fa48("16925"), {
      key: 'connectionString',
      label: 'Connection String',
      type: 'text',
      placeholder: 'mongodb://...',
      required: stryMutAct_9fa48("16930") ? false : (stryCov_9fa48("16930"), true)
    }), stryMutAct_9fa48("16931") ? {} : (stryCov_9fa48("16931"), {
      key: 'database',
      label: 'Database',
      type: 'text',
      required: stryMutAct_9fa48("16935") ? false : (stryCov_9fa48("16935"), true)
    })])
  }),
  REDIS: stryMutAct_9fa48("16936") ? {} : (stryCov_9fa48("16936"), {
    name: 'Redis',
    icon: '🔴',
    category: 'Database',
    fields: stryMutAct_9fa48("16940") ? [] : (stryCov_9fa48("16940"), [stryMutAct_9fa48("16941") ? {} : (stryCov_9fa48("16941"), {
      key: 'host',
      label: 'Host',
      type: 'text',
      placeholder: 'localhost',
      required: stryMutAct_9fa48("16946") ? false : (stryCov_9fa48("16946"), true)
    }), stryMutAct_9fa48("16947") ? {} : (stryCov_9fa48("16947"), {
      key: 'port',
      label: 'Port',
      type: 'number',
      placeholder: '6379',
      required: stryMutAct_9fa48("16952") ? false : (stryCov_9fa48("16952"), true)
    }), stryMutAct_9fa48("16953") ? {} : (stryCov_9fa48("16953"), {
      key: 'db',
      label: 'Database Number',
      type: 'number',
      placeholder: '0'
    }), stryMutAct_9fa48("16958") ? {} : (stryCov_9fa48("16958"), {
      key: 'password',
      label: 'Password',
      type: 'password',
      isCredential: stryMutAct_9fa48("16962") ? false : (stryCov_9fa48("16962"), true)
    })])
  }),
  NEO4J: stryMutAct_9fa48("16963") ? {} : (stryCov_9fa48("16963"), {
    name: 'Neo4j',
    icon: '🔵',
    category: 'Database',
    fields: stryMutAct_9fa48("16967") ? [] : (stryCov_9fa48("16967"), [stryMutAct_9fa48("16968") ? {} : (stryCov_9fa48("16968"), {
      key: 'host',
      label: 'Host',
      type: 'text',
      placeholder: 'localhost',
      required: stryMutAct_9fa48("16973") ? false : (stryCov_9fa48("16973"), true)
    }), stryMutAct_9fa48("16974") ? {} : (stryCov_9fa48("16974"), {
      key: 'port',
      label: 'Bolt Port',
      type: 'number',
      placeholder: '7687',
      required: stryMutAct_9fa48("16979") ? false : (stryCov_9fa48("16979"), true)
    }), stryMutAct_9fa48("16980") ? {} : (stryCov_9fa48("16980"), {
      key: 'uri',
      label: 'Connection URI',
      type: 'text',
      placeholder: 'bolt://localhost:7687'
    }), stryMutAct_9fa48("16985") ? {} : (stryCov_9fa48("16985"), {
      key: 'username',
      label: 'Username',
      type: 'text',
      placeholder: 'neo4j',
      required: stryMutAct_9fa48("16990") ? false : (stryCov_9fa48("16990"), true),
      isCredential: stryMutAct_9fa48("16991") ? false : (stryCov_9fa48("16991"), true)
    }), stryMutAct_9fa48("16992") ? {} : (stryCov_9fa48("16992"), {
      key: 'password',
      label: 'Password',
      type: 'password',
      required: stryMutAct_9fa48("16996") ? false : (stryCov_9fa48("16996"), true),
      isCredential: stryMutAct_9fa48("16997") ? false : (stryCov_9fa48("16997"), true)
    })])
  }),
  SNOWFLAKE: stryMutAct_9fa48("16998") ? {} : (stryCov_9fa48("16998"), {
    name: 'Snowflake',
    icon: '❄️',
    category: 'Data Warehouse',
    fields: stryMutAct_9fa48("17002") ? [] : (stryCov_9fa48("17002"), [stryMutAct_9fa48("17003") ? {} : (stryCov_9fa48("17003"), {
      key: 'account',
      label: 'Account',
      type: 'text',
      placeholder: 'xyz12345.us-east-1',
      required: stryMutAct_9fa48("17008") ? false : (stryCov_9fa48("17008"), true)
    }), stryMutAct_9fa48("17009") ? {} : (stryCov_9fa48("17009"), {
      key: 'warehouse',
      label: 'Warehouse',
      type: 'text',
      required: stryMutAct_9fa48("17013") ? false : (stryCov_9fa48("17013"), true)
    }), stryMutAct_9fa48("17014") ? {} : (stryCov_9fa48("17014"), {
      key: 'database',
      label: 'Database',
      type: 'text',
      required: stryMutAct_9fa48("17018") ? false : (stryCov_9fa48("17018"), true)
    }), stryMutAct_9fa48("17019") ? {} : (stryCov_9fa48("17019"), {
      key: 'schema',
      label: 'Schema',
      type: 'text',
      placeholder: 'PUBLIC'
    }), stryMutAct_9fa48("17024") ? {} : (stryCov_9fa48("17024"), {
      key: 'username',
      label: 'Username',
      type: 'text',
      required: stryMutAct_9fa48("17028") ? false : (stryCov_9fa48("17028"), true),
      isCredential: stryMutAct_9fa48("17029") ? false : (stryCov_9fa48("17029"), true)
    }), stryMutAct_9fa48("17030") ? {} : (stryCov_9fa48("17030"), {
      key: 'password',
      label: 'Password',
      type: 'password',
      required: stryMutAct_9fa48("17034") ? false : (stryCov_9fa48("17034"), true),
      isCredential: stryMutAct_9fa48("17035") ? false : (stryCov_9fa48("17035"), true)
    })])
  }),
  BIGQUERY: stryMutAct_9fa48("17036") ? {} : (stryCov_9fa48("17036"), {
    name: 'Google BigQuery',
    icon: '📊',
    category: 'Data Warehouse',
    fields: stryMutAct_9fa48("17040") ? [] : (stryCov_9fa48("17040"), [stryMutAct_9fa48("17041") ? {} : (stryCov_9fa48("17041"), {
      key: 'projectId',
      label: 'Project ID',
      type: 'text',
      required: stryMutAct_9fa48("17045") ? false : (stryCov_9fa48("17045"), true)
    }), stryMutAct_9fa48("17046") ? {} : (stryCov_9fa48("17046"), {
      key: 'serviceAccountKey',
      label: 'Service Account JSON',
      type: 'textarea',
      required: stryMutAct_9fa48("17050") ? false : (stryCov_9fa48("17050"), true),
      isCredential: stryMutAct_9fa48("17051") ? false : (stryCov_9fa48("17051"), true)
    })])
  }),
  SALESFORCE: stryMutAct_9fa48("17052") ? {} : (stryCov_9fa48("17052"), {
    name: 'Salesforce',
    icon: '☁️',
    category: 'CRM',
    fields: stryMutAct_9fa48("17056") ? [] : (stryCov_9fa48("17056"), [stryMutAct_9fa48("17057") ? {} : (stryCov_9fa48("17057"), {
      key: 'sandbox',
      label: 'Environment',
      type: 'select',
      options: stryMutAct_9fa48("17061") ? [] : (stryCov_9fa48("17061"), [stryMutAct_9fa48("17062") ? {} : (stryCov_9fa48("17062"), {
        value: 'false',
        label: 'Production'
      }), stryMutAct_9fa48("17065") ? {} : (stryCov_9fa48("17065"), {
        value: 'true',
        label: 'Sandbox'
      })])
    }), stryMutAct_9fa48("17068") ? {} : (stryCov_9fa48("17068"), {
      key: 'clientId',
      label: 'Client ID',
      type: 'text',
      required: stryMutAct_9fa48("17072") ? false : (stryCov_9fa48("17072"), true),
      isCredential: stryMutAct_9fa48("17073") ? false : (stryCov_9fa48("17073"), true)
    }), stryMutAct_9fa48("17074") ? {} : (stryCov_9fa48("17074"), {
      key: 'clientSecret',
      label: 'Client Secret',
      type: 'password',
      required: stryMutAct_9fa48("17078") ? false : (stryCov_9fa48("17078"), true),
      isCredential: stryMutAct_9fa48("17079") ? false : (stryCov_9fa48("17079"), true)
    }), stryMutAct_9fa48("17080") ? {} : (stryCov_9fa48("17080"), {
      key: 'username',
      label: 'Username',
      type: 'text',
      required: stryMutAct_9fa48("17084") ? false : (stryCov_9fa48("17084"), true),
      isCredential: stryMutAct_9fa48("17085") ? false : (stryCov_9fa48("17085"), true)
    }), stryMutAct_9fa48("17086") ? {} : (stryCov_9fa48("17086"), {
      key: 'password',
      label: 'Password',
      type: 'password',
      required: stryMutAct_9fa48("17090") ? false : (stryCov_9fa48("17090"), true),
      isCredential: stryMutAct_9fa48("17091") ? false : (stryCov_9fa48("17091"), true)
    }), stryMutAct_9fa48("17092") ? {} : (stryCov_9fa48("17092"), {
      key: 'securityToken',
      label: 'Security Token',
      type: 'password',
      isCredential: stryMutAct_9fa48("17096") ? false : (stryCov_9fa48("17096"), true)
    })])
  }),
  HUBSPOT: stryMutAct_9fa48("17097") ? {} : (stryCov_9fa48("17097"), {
    name: 'HubSpot',
    icon: '🟠',
    category: 'CRM',
    fields: stryMutAct_9fa48("17101") ? [] : (stryCov_9fa48("17101"), [stryMutAct_9fa48("17102") ? {} : (stryCov_9fa48("17102"), {
      key: 'apiKey',
      label: 'Private App Access Token',
      type: 'password',
      required: stryMutAct_9fa48("17106") ? false : (stryCov_9fa48("17106"), true),
      isCredential: stryMutAct_9fa48("17107") ? false : (stryCov_9fa48("17107"), true)
    })])
  }),
  SAP: stryMutAct_9fa48("17108") ? {} : (stryCov_9fa48("17108"), {
    name: 'SAP',
    icon: '🏢',
    category: 'ERP',
    fields: stryMutAct_9fa48("17112") ? [] : (stryCov_9fa48("17112"), [stryMutAct_9fa48("17113") ? {} : (stryCov_9fa48("17113"), {
      key: 'server',
      label: 'Server',
      type: 'text',
      required: stryMutAct_9fa48("17117") ? false : (stryCov_9fa48("17117"), true)
    }), stryMutAct_9fa48("17118") ? {} : (stryCov_9fa48("17118"), {
      key: 'client',
      label: 'Client',
      type: 'text',
      placeholder: '100',
      required: stryMutAct_9fa48("17123") ? false : (stryCov_9fa48("17123"), true)
    }), stryMutAct_9fa48("17124") ? {} : (stryCov_9fa48("17124"), {
      key: 'systemId',
      label: 'System ID',
      type: 'text'
    }), stryMutAct_9fa48("17128") ? {} : (stryCov_9fa48("17128"), {
      key: 'username',
      label: 'Username',
      type: 'text',
      required: stryMutAct_9fa48("17132") ? false : (stryCov_9fa48("17132"), true),
      isCredential: stryMutAct_9fa48("17133") ? false : (stryCov_9fa48("17133"), true)
    }), stryMutAct_9fa48("17134") ? {} : (stryCov_9fa48("17134"), {
      key: 'password',
      label: 'Password',
      type: 'password',
      required: stryMutAct_9fa48("17138") ? false : (stryCov_9fa48("17138"), true),
      isCredential: stryMutAct_9fa48("17139") ? false : (stryCov_9fa48("17139"), true)
    })])
  }),
  AWS: stryMutAct_9fa48("17140") ? {} : (stryCov_9fa48("17140"), {
    name: 'Amazon Web Services',
    icon: '🔶',
    category: 'Cloud',
    fields: stryMutAct_9fa48("17144") ? [] : (stryCov_9fa48("17144"), [stryMutAct_9fa48("17145") ? {} : (stryCov_9fa48("17145"), {
      key: 'region',
      label: 'Region',
      type: 'text',
      placeholder: 'us-east-1',
      required: stryMutAct_9fa48("17150") ? false : (stryCov_9fa48("17150"), true)
    }), stryMutAct_9fa48("17151") ? {} : (stryCov_9fa48("17151"), {
      key: 'service',
      label: 'Service',
      type: 'select',
      options: stryMutAct_9fa48("17155") ? [] : (stryCov_9fa48("17155"), [stryMutAct_9fa48("17156") ? {} : (stryCov_9fa48("17156"), {
        value: 's3',
        label: 'S3 (Storage)'
      }), stryMutAct_9fa48("17159") ? {} : (stryCov_9fa48("17159"), {
        value: 'redshift',
        label: 'Redshift (Data Warehouse)'
      }), stryMutAct_9fa48("17162") ? {} : (stryCov_9fa48("17162"), {
        value: 'rds',
        label: 'RDS (Database)'
      }), stryMutAct_9fa48("17165") ? {} : (stryCov_9fa48("17165"), {
        value: 'dynamodb',
        label: 'DynamoDB'
      })])
    }), stryMutAct_9fa48("17168") ? {} : (stryCov_9fa48("17168"), {
      key: 'accessKeyId',
      label: 'Access Key ID',
      type: 'text',
      required: stryMutAct_9fa48("17172") ? false : (stryCov_9fa48("17172"), true),
      isCredential: stryMutAct_9fa48("17173") ? false : (stryCov_9fa48("17173"), true)
    }), stryMutAct_9fa48("17174") ? {} : (stryCov_9fa48("17174"), {
      key: 'secretAccessKey',
      label: 'Secret Access Key',
      type: 'password',
      required: stryMutAct_9fa48("17178") ? false : (stryCov_9fa48("17178"), true),
      isCredential: stryMutAct_9fa48("17179") ? false : (stryCov_9fa48("17179"), true)
    })])
  }),
  AZURE: stryMutAct_9fa48("17180") ? {} : (stryCov_9fa48("17180"), {
    name: 'Microsoft Azure',
    icon: '🔷',
    category: 'Cloud',
    fields: stryMutAct_9fa48("17184") ? [] : (stryCov_9fa48("17184"), [stryMutAct_9fa48("17185") ? {} : (stryCov_9fa48("17185"), {
      key: 'service',
      label: 'Service',
      type: 'select',
      options: stryMutAct_9fa48("17189") ? [] : (stryCov_9fa48("17189"), [stryMutAct_9fa48("17190") ? {} : (stryCov_9fa48("17190"), {
        value: 'blob',
        label: 'Blob Storage'
      }), stryMutAct_9fa48("17193") ? {} : (stryCov_9fa48("17193"), {
        value: 'sql',
        label: 'SQL Database'
      }), stryMutAct_9fa48("17196") ? {} : (stryCov_9fa48("17196"), {
        value: 'synapse',
        label: 'Synapse Analytics'
      })])
    }), stryMutAct_9fa48("17199") ? {} : (stryCov_9fa48("17199"), {
      key: 'accountName',
      label: 'Account/Server Name',
      type: 'text',
      required: stryMutAct_9fa48("17203") ? false : (stryCov_9fa48("17203"), true)
    }), stryMutAct_9fa48("17204") ? {} : (stryCov_9fa48("17204"), {
      key: 'database',
      label: 'Database',
      type: 'text'
    }), stryMutAct_9fa48("17208") ? {} : (stryCov_9fa48("17208"), {
      key: 'accessKey',
      label: 'Access Key / Password',
      type: 'password',
      required: stryMutAct_9fa48("17212") ? false : (stryCov_9fa48("17212"), true),
      isCredential: stryMutAct_9fa48("17213") ? false : (stryCov_9fa48("17213"), true)
    })])
  }),
  REST_API: stryMutAct_9fa48("17214") ? {} : (stryCov_9fa48("17214"), {
    name: 'REST API',
    icon: '🔌',
    category: 'API',
    fields: stryMutAct_9fa48("17218") ? [] : (stryCov_9fa48("17218"), [stryMutAct_9fa48("17219") ? {} : (stryCov_9fa48("17219"), {
      key: 'baseUrl',
      label: 'Base URL',
      type: 'text',
      placeholder: 'https://api.example.com',
      required: stryMutAct_9fa48("17224") ? false : (stryCov_9fa48("17224"), true)
    }), stryMutAct_9fa48("17225") ? {} : (stryCov_9fa48("17225"), {
      key: 'authType',
      label: 'Auth Type',
      type: 'select',
      options: stryMutAct_9fa48("17229") ? [] : (stryCov_9fa48("17229"), [stryMutAct_9fa48("17230") ? {} : (stryCov_9fa48("17230"), {
        value: 'none',
        label: 'None'
      }), stryMutAct_9fa48("17233") ? {} : (stryCov_9fa48("17233"), {
        value: 'bearer',
        label: 'Bearer Token'
      }), stryMutAct_9fa48("17236") ? {} : (stryCov_9fa48("17236"), {
        value: 'apikey',
        label: 'API Key'
      }), stryMutAct_9fa48("17239") ? {} : (stryCov_9fa48("17239"), {
        value: 'basic',
        label: 'Basic Auth'
      })])
    }), stryMutAct_9fa48("17242") ? {} : (stryCov_9fa48("17242"), {
      key: 'apiKey',
      label: 'API Key / Token',
      type: 'password',
      isCredential: stryMutAct_9fa48("17246") ? false : (stryCov_9fa48("17246"), true)
    }), stryMutAct_9fa48("17247") ? {} : (stryCov_9fa48("17247"), {
      key: 'username',
      label: 'Username (Basic Auth)',
      type: 'text',
      isCredential: stryMutAct_9fa48("17251") ? false : (stryCov_9fa48("17251"), true)
    }), stryMutAct_9fa48("17252") ? {} : (stryCov_9fa48("17252"), {
      key: 'password',
      label: 'Password (Basic Auth)',
      type: 'password',
      isCredential: stryMutAct_9fa48("17256") ? false : (stryCov_9fa48("17256"), true)
    })])
  }),
  GRAPHQL: stryMutAct_9fa48("17257") ? {} : (stryCov_9fa48("17257"), {
    name: 'GraphQL API',
    icon: '🔗',
    category: 'API',
    fields: stryMutAct_9fa48("17261") ? [] : (stryCov_9fa48("17261"), [stryMutAct_9fa48("17262") ? {} : (stryCov_9fa48("17262"), {
      key: 'endpoint',
      label: 'Endpoint URL',
      type: 'text',
      placeholder: 'https://api.example.com/graphql',
      required: stryMutAct_9fa48("17267") ? false : (stryCov_9fa48("17267"), true)
    }), stryMutAct_9fa48("17268") ? {} : (stryCov_9fa48("17268"), {
      key: 'apiKey',
      label: 'Authorization Token',
      type: 'password',
      isCredential: stryMutAct_9fa48("17272") ? false : (stryCov_9fa48("17272"), true)
    })])
  })
});

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const DataSourcesPage: React.FC = () => {
  const [dataSources, setDataSources] = useState<DataSource[]>(stryMutAct_9fa48("17274") ? ["Stryker was here"] : (stryCov_9fa48("17274"), []));
  const [isLoading, setIsLoading] = useState(stryMutAct_9fa48("17275") ? false : (stryCov_9fa48("17275"), true));
  const [selectedSource, setSelectedSource] = useState<DataSource | null>(null);
  const [isEditing, setIsEditing] = useState(stryMutAct_9fa48("17276") ? true : (stryCov_9fa48("17276"), false));
  const [isAddingNew, setIsAddingNew] = useState(stryMutAct_9fa48("17277") ? true : (stryCov_9fa48("17277"), false));
  const [newSourceType, setNewSourceType] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [testResult, setTestResult] = useState<ConnectionTestResult | null>(null);
  const [isTesting, setIsTesting] = useState(stryMutAct_9fa48("17278") ? true : (stryCov_9fa48("17278"), false));
  const [isSaving, setIsSaving] = useState(stryMutAct_9fa48("17279") ? true : (stryCov_9fa48("17279"), false));

  // Load data sources
  useEffect(() => {
    loadDataSources();
  }, stryMutAct_9fa48("17281") ? ["Stryker was here"] : (stryCov_9fa48("17281"), []));
  const loadDataSources = async () => {
    setIsLoading(stryMutAct_9fa48("17283") ? false : (stryCov_9fa48("17283"), true));
    try {
      const res = await api.get<DataSource[]>('/data-sources');
      if (stryMutAct_9fa48("17288") ? res.success || res.data : stryMutAct_9fa48("17287") ? false : stryMutAct_9fa48("17286") ? true : (stryCov_9fa48("17286", "17287", "17288"), res.success && res.data)) {
        setDataSources(res.data);
      }
    } catch (error) {
      console.error('Failed to load data sources:', error);
    } finally {
      setIsLoading(stryMutAct_9fa48("17293") ? true : (stryCov_9fa48("17293"), false));
    }
  };
  const handleSelectSource = (source: DataSource) => {
    setSelectedSource(source);
    setIsEditing(stryMutAct_9fa48("17295") ? true : (stryCov_9fa48("17295"), false));
    setTestResult(null);

    // Populate form with existing config
    const config = source.config as Record<string, string>;
    setFormData(config);
  };
  const handleStartEdit = () => {
    setIsEditing(stryMutAct_9fa48("17297") ? false : (stryCov_9fa48("17297"), true));
  };
  const handleStartAdd = (type: string) => {
    setNewSourceType(type);
    setIsAddingNew(stryMutAct_9fa48("17299") ? false : (stryCov_9fa48("17299"), true));
    setSelectedSource(null);
    setFormData({});
    setTestResult(null);
  };
  const handleTestConnection = async () => {
    setIsTesting(stryMutAct_9fa48("17301") ? false : (stryCov_9fa48("17301"), true));
    setTestResult(null);
    try {
      const sourceId = stryMutAct_9fa48("17303") ? selectedSource.id : (stryCov_9fa48("17303"), selectedSource?.id);
      const type = stryMutAct_9fa48("17306") ? selectedSource?.type && newSourceType : stryMutAct_9fa48("17305") ? false : stryMutAct_9fa48("17304") ? true : (stryCov_9fa48("17304", "17305", "17306"), (stryMutAct_9fa48("17307") ? selectedSource.type : (stryCov_9fa48("17307"), selectedSource?.type)) || newSourceType);
      if (stryMutAct_9fa48("17309") ? false : stryMutAct_9fa48("17308") ? true : (stryCov_9fa48("17308", "17309"), sourceId)) {
        // Test existing source
        const res = await api.post<ConnectionTestResult>(`/data-sources/${sourceId}/test`);
        if (stryMutAct_9fa48("17314") ? res.success || res.data : stryMutAct_9fa48("17313") ? false : stryMutAct_9fa48("17312") ? true : (stryCov_9fa48("17312", "17313", "17314"), res.success && res.data)) {
          setTestResult(res.data);
        } else {
          setTestResult(stryMutAct_9fa48("17319") ? res.data && {
            success: false,
            message: res.error?.message || 'Test failed'
          } : stryMutAct_9fa48("17318") ? false : stryMutAct_9fa48("17317") ? true : (stryCov_9fa48("17317", "17318", "17319"), res.data || (stryMutAct_9fa48("17320") ? {} : (stryCov_9fa48("17320"), {
            success: stryMutAct_9fa48("17321") ? true : (stryCov_9fa48("17321"), false),
            message: stryMutAct_9fa48("17324") ? res.error?.message && 'Test failed' : stryMutAct_9fa48("17323") ? false : stryMutAct_9fa48("17322") ? true : (stryCov_9fa48("17322", "17323", "17324"), (stryMutAct_9fa48("17325") ? res.error.message : (stryCov_9fa48("17325"), res.error?.message)) || 'Test failed')
          }))));
        }
      } else {
        // Test new configuration
        const res = await api.post<ConnectionTestResult>('/data-sources/test', stryMutAct_9fa48("17329") ? {} : (stryCov_9fa48("17329"), {
          type,
          config: formData,
          credentials: formData
        }));
        if (stryMutAct_9fa48("17332") ? res.success || res.data : stryMutAct_9fa48("17331") ? false : stryMutAct_9fa48("17330") ? true : (stryCov_9fa48("17330", "17331", "17332"), res.success && res.data)) {
          setTestResult(res.data);
        } else {
          setTestResult(stryMutAct_9fa48("17337") ? res.data && {
            success: false,
            message: res.error?.message || 'Test failed'
          } : stryMutAct_9fa48("17336") ? false : stryMutAct_9fa48("17335") ? true : (stryCov_9fa48("17335", "17336", "17337"), res.data || (stryMutAct_9fa48("17338") ? {} : (stryCov_9fa48("17338"), {
            success: stryMutAct_9fa48("17339") ? true : (stryCov_9fa48("17339"), false),
            message: stryMutAct_9fa48("17342") ? res.error?.message && 'Test failed' : stryMutAct_9fa48("17341") ? false : stryMutAct_9fa48("17340") ? true : (stryCov_9fa48("17340", "17341", "17342"), (stryMutAct_9fa48("17343") ? res.error.message : (stryCov_9fa48("17343"), res.error?.message)) || 'Test failed')
          }))));
        }
      }
    } catch (error) {
      setTestResult(stryMutAct_9fa48("17346") ? {} : (stryCov_9fa48("17346"), {
        success: stryMutAct_9fa48("17347") ? true : (stryCov_9fa48("17347"), false),
        message: 'Connection test failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      }));
    } finally {
      setIsTesting(stryMutAct_9fa48("17351") ? true : (stryCov_9fa48("17351"), false));
    }
  };
  const handleSave = async () => {
    setIsSaving(stryMutAct_9fa48("17353") ? false : (stryCov_9fa48("17353"), true));
    try {
      const type = stryMutAct_9fa48("17357") ? selectedSource?.type && newSourceType : stryMutAct_9fa48("17356") ? false : stryMutAct_9fa48("17355") ? true : (stryCov_9fa48("17355", "17356", "17357"), (stryMutAct_9fa48("17358") ? selectedSource.type : (stryCov_9fa48("17358"), selectedSource?.type)) || newSourceType);
      const connectorConfig = CONNECTOR_CONFIGS[stryMutAct_9fa48("17361") ? type && '' : stryMutAct_9fa48("17360") ? false : stryMutAct_9fa48("17359") ? true : (stryCov_9fa48("17359", "17360", "17361"), type || '')];

      // Separate config and credentials
      const config: Record<string, unknown> = {};
      const credentials: Record<string, unknown> = {};
      stryMutAct_9fa48("17363") ? connectorConfig.fields.forEach(field => {
        if (formData[field.key]) {
          if (field.isCredential) {
            credentials[field.key] = formData[field.key];
          } else {
            config[field.key] = field.type === 'number' ? parseInt(formData[field.key]) : formData[field.key];
          }
        }
      }) : (stryCov_9fa48("17363"), connectorConfig?.fields.forEach(field => {
        if (stryMutAct_9fa48("17366") ? false : stryMutAct_9fa48("17365") ? true : (stryCov_9fa48("17365", "17366"), formData[field.key])) {
          if (stryMutAct_9fa48("17369") ? false : stryMutAct_9fa48("17368") ? true : (stryCov_9fa48("17368", "17369"), field.isCredential)) {
            credentials[field.key] = formData[field.key];
          } else {
            config[field.key] = (stryMutAct_9fa48("17374") ? field.type !== 'number' : stryMutAct_9fa48("17373") ? false : stryMutAct_9fa48("17372") ? true : (stryCov_9fa48("17372", "17373", "17374"), field.type === 'number')) ? parseInt(formData[field.key]) : formData[field.key];
          }
        }
      }));
      if (stryMutAct_9fa48("17377") ? false : stryMutAct_9fa48("17376") ? true : (stryCov_9fa48("17376", "17377"), selectedSource)) {
        // Update existing
        const res = await api.put<unknown>(`/data-sources/${selectedSource.id}`, stryMutAct_9fa48("17380") ? {} : (stryCov_9fa48("17380"), {
          config,
          credentials
        }));
        if (stryMutAct_9fa48("17382") ? false : stryMutAct_9fa48("17381") ? true : (stryCov_9fa48("17381", "17382"), res.success)) {
          await loadDataSources();
          setIsEditing(stryMutAct_9fa48("17384") ? true : (stryCov_9fa48("17384"), false));
        }
      } else if (stryMutAct_9fa48("17386") ? false : stryMutAct_9fa48("17385") ? true : (stryCov_9fa48("17385", "17386"), newSourceType)) {
        // Create new
        const res = await api.post<unknown>('/data-sources', stryMutAct_9fa48("17389") ? {} : (stryCov_9fa48("17389"), {
          name: stryMutAct_9fa48("17392") ? formData.name && connectorConfig?.name : stryMutAct_9fa48("17391") ? false : stryMutAct_9fa48("17390") ? true : (stryCov_9fa48("17390", "17391", "17392"), formData.name || (stryMutAct_9fa48("17393") ? connectorConfig.name : (stryCov_9fa48("17393"), connectorConfig?.name))),
          type: newSourceType,
          config,
          credentials
        }));
        if (stryMutAct_9fa48("17395") ? false : stryMutAct_9fa48("17394") ? true : (stryCov_9fa48("17394", "17395"), res.success)) {
          await loadDataSources();
          setIsAddingNew(stryMutAct_9fa48("17397") ? true : (stryCov_9fa48("17397"), false));
          setNewSourceType(null);
        }
      }
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setIsSaving(stryMutAct_9fa48("17401") ? true : (stryCov_9fa48("17401"), false));
    }
  };
  const handleSync = async (id: string) => {
    try {
      const res = await api.post<unknown>(`/data-sources/${id}/sync`);
      if (stryMutAct_9fa48("17406") ? false : stryMutAct_9fa48("17405") ? true : (stryCov_9fa48("17405", "17406"), res.success)) {
        setDataSources(stryMutAct_9fa48("17408") ? () => undefined : (stryCov_9fa48("17408"), prev => prev.map(stryMutAct_9fa48("17409") ? () => undefined : (stryCov_9fa48("17409"), ds => (stryMutAct_9fa48("17412") ? ds.id !== id : stryMutAct_9fa48("17411") ? false : stryMutAct_9fa48("17410") ? true : (stryCov_9fa48("17410", "17411", "17412"), ds.id === id)) ? stryMutAct_9fa48("17413") ? {} : (stryCov_9fa48("17413"), {
          ...ds,
          status: 'SYNCING' as DataSource['status']
        }) : ds))));
        setSelectedSource(stryMutAct_9fa48("17414") ? () => undefined : (stryCov_9fa48("17414"), prev => (stryMutAct_9fa48("17417") ? prev || prev.id === id : stryMutAct_9fa48("17416") ? false : stryMutAct_9fa48("17415") ? true : (stryCov_9fa48("17415", "17416", "17417"), prev && (stryMutAct_9fa48("17419") ? prev.id !== id : stryMutAct_9fa48("17418") ? true : (stryCov_9fa48("17418", "17419"), prev.id === id)))) ? stryMutAct_9fa48("17420") ? {} : (stryCov_9fa48("17420"), {
          ...prev,
          status: 'SYNCING' as DataSource['status']
        }) : prev));
      }
    } catch (error) {
      console.error('Failed to start sync:', error);
    }
  };
  const handleDelete = async (id: string) => {
    if (stryMutAct_9fa48("17426") ? false : stryMutAct_9fa48("17425") ? true : stryMutAct_9fa48("17424") ? confirm('Are you sure you want to delete this data source?') : (stryCov_9fa48("17424", "17425", "17426"), !confirm('Are you sure you want to delete this data source?'))) {
      return;
    }
    try {
      const res = await api.delete<unknown>(`/data-sources/${id}`);
      if (stryMutAct_9fa48("17432") ? false : stryMutAct_9fa48("17431") ? true : (stryCov_9fa48("17431", "17432"), res.success)) {
        await loadDataSources();
        setSelectedSource(null);
      }
    } catch (error) {
      console.error('Failed to delete:', error);
    }
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONNECTED':
        if (stryMutAct_9fa48("17437")) {} else {
          stryCov_9fa48("17437");
          return 'bg-green-500';
        }
      case 'SYNCING':
        if (stryMutAct_9fa48("17440")) {} else {
          stryCov_9fa48("17440");
          return 'bg-yellow-500 animate-pulse';
        }
      case 'ERROR':
        if (stryMutAct_9fa48("17443")) {} else {
          stryCov_9fa48("17443");
          return 'bg-red-500';
        }
      case 'PENDING':
        if (stryMutAct_9fa48("17446")) {} else {
          stryCov_9fa48("17446");
          return 'bg-gray-500';
        }
      default:
        if (stryMutAct_9fa48("17449")) {} else {
          stryCov_9fa48("17449");
          return 'bg-gray-500';
        }
    }
  };
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'CONNECTED':
        if (stryMutAct_9fa48("17452")) {} else {
          stryCov_9fa48("17452");
          return 'Connected';
        }
      case 'SYNCING':
        if (stryMutAct_9fa48("17455")) {} else {
          stryCov_9fa48("17455");
          return 'Syncing...';
        }
      case 'ERROR':
        if (stryMutAct_9fa48("17458")) {} else {
          stryCov_9fa48("17458");
          return 'Error';
        }
      case 'PENDING':
        if (stryMutAct_9fa48("17461")) {} else {
          stryCov_9fa48("17461");
          return 'Not Configured';
        }
      default:
        if (stryMutAct_9fa48("17464")) {} else {
          stryCov_9fa48("17464");
          return status;
        }
    }
  };

  // Group connectors by category
  const connectorsByCategory = Object.entries(CONNECTOR_CONFIGS).reduce((acc, [key, config]) => {
    if (stryMutAct_9fa48("17468") ? false : stryMutAct_9fa48("17467") ? true : stryMutAct_9fa48("17466") ? acc[config.category] : (stryCov_9fa48("17466", "17467", "17468"), !acc[config.category])) {
      acc[config.category] = stryMutAct_9fa48("17470") ? ["Stryker was here"] : (stryCov_9fa48("17470"), []);
    }
    acc[config.category].push(stryMutAct_9fa48("17471") ? {} : (stryCov_9fa48("17471"), {
      key,
      ...config
    }));
    return acc;
  }, {} as Record<string, Array<{
    key: string;
    name: string;
    icon: string;
    category: string;
  }>>);
  return <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <Database className="w-7 h-7 text-indigo-400" />
              Data Sources
            </h1>
            <p className="text-gray-400 mt-1">
              Configure and manage your data source connections
            </p>
          </div>
          <button onClick={stryMutAct_9fa48("17472") ? () => undefined : (stryCov_9fa48("17472"), () => setIsAddingNew(stryMutAct_9fa48("17473") ? false : (stryCov_9fa48("17473"), true)))} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors">
            <Plus className="w-4 h-4" />
            Add Data Source
          </button>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Left Panel - Data Sources List */}
          <div className="col-span-4 bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
            <div className="p-4 border-b border-gray-700">
              <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
                Configured Sources ({dataSources.length})
              </h2>
            </div>
            
            <div className="divide-y divide-gray-700 max-h-[600px] overflow-y-auto">
              {isLoading ? <div className="p-8 text-center">
                  <RefreshCw className="w-6 h-6 text-gray-500 animate-spin mx-auto" />
                  <p className="text-gray-500 mt-2">Loading...</p>
                </div> : (stryMutAct_9fa48("17476") ? dataSources.length !== 0 : stryMutAct_9fa48("17475") ? false : stryMutAct_9fa48("17474") ? true : (stryCov_9fa48("17474", "17475", "17476"), dataSources.length === 0)) ? <div className="p-8 text-center">
                  <Database className="w-10 h-10 text-gray-600 mx-auto" />
                  <p className="text-gray-500 mt-2">No data sources configured</p>
                  <button onClick={stryMutAct_9fa48("17477") ? () => undefined : (stryCov_9fa48("17477"), () => setIsAddingNew(stryMutAct_9fa48("17478") ? false : (stryCov_9fa48("17478"), true)))} className="mt-4 text-indigo-400 hover:text-indigo-300 text-sm">
                    Add your first data source →
                  </button>
                </div> : dataSources.map(source => {
              const config = CONNECTOR_CONFIGS[source.type];
              return <button key={source.id} onClick={stryMutAct_9fa48("17480") ? () => undefined : (stryCov_9fa48("17480"), () => handleSelectSource(source))} className={`w-full p-4 text-left hover:bg-gray-700/50 transition-colors ${(stryMutAct_9fa48("17484") ? selectedSource?.id !== source.id : stryMutAct_9fa48("17483") ? false : stryMutAct_9fa48("17482") ? true : (stryCov_9fa48("17482", "17483", "17484"), (stryMutAct_9fa48("17485") ? selectedSource.id : (stryCov_9fa48("17485"), selectedSource?.id)) === source.id)) ? 'bg-gray-700/50 border-l-2 border-indigo-500' : ''}`}>
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{stryMutAct_9fa48("17490") ? config?.icon && '📊' : stryMutAct_9fa48("17489") ? false : stryMutAct_9fa48("17488") ? true : (stryCov_9fa48("17488", "17489", "17490"), (stryMutAct_9fa48("17491") ? config.icon : (stryCov_9fa48("17491"), config?.icon)) || '📊')}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-medium truncate">{source.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`w-2 h-2 rounded-full ${getStatusColor(source.status)}`} />
                            <span className="text-xs text-gray-400">{getStatusLabel(source.status)}</span>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-500" />
                      </div>
                    </button>;
            })}
            </div>
          </div>

          {/* Right Panel - Configuration */}
          <div className="col-span-8">
            {(stryMutAct_9fa48("17496") ? isAddingNew || !newSourceType : stryMutAct_9fa48("17495") ? false : stryMutAct_9fa48("17494") ? true : (stryCov_9fa48("17494", "17495", "17496"), isAddingNew && (stryMutAct_9fa48("17497") ? newSourceType : (stryCov_9fa48("17497"), !newSourceType)))) ?
          // Select connector type
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
                <h2 className="text-lg font-semibold text-white mb-6">Select Data Source Type</h2>
                
                {Object.entries(connectorsByCategory).map(stryMutAct_9fa48("17498") ? () => undefined : (stryCov_9fa48("17498"), ([category, connectors]) => <div key={category} className="mb-6">
                    <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3">
                      {category}
                    </h3>
                    <div className="grid grid-cols-3 gap-3">
                      {connectors.map(stryMutAct_9fa48("17499") ? () => undefined : (stryCov_9fa48("17499"), connector => <button key={connector.key} onClick={stryMutAct_9fa48("17500") ? () => undefined : (stryCov_9fa48("17500"), () => handleStartAdd(connector.key))} className="flex items-center gap-3 p-4 bg-gray-700/50 hover:bg-gray-700 rounded-lg border border-gray-600 hover:border-indigo-500 transition-all">
                          <span className="text-2xl">{connector.icon}</span>
                          <span className="text-white font-medium">{connector.name}</span>
                        </button>))}
                    </div>
                  </div>))}
                
                <button onClick={stryMutAct_9fa48("17501") ? () => undefined : (stryCov_9fa48("17501"), () => setIsAddingNew(stryMutAct_9fa48("17502") ? true : (stryCov_9fa48("17502"), false)))} className="mt-4 text-gray-400 hover:text-white text-sm">
                  ← Cancel
                </button>
              </div> : (stryMutAct_9fa48("17505") ? selectedSource && newSourceType : stryMutAct_9fa48("17504") ? false : stryMutAct_9fa48("17503") ? true : (stryCov_9fa48("17503", "17504", "17505"), selectedSource || newSourceType)) ?
          // Configuration form
          <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">
                        {stryMutAct_9fa48("17508") ? CONNECTOR_CONFIGS[selectedSource?.type || newSourceType || '']?.icon && '📊' : stryMutAct_9fa48("17507") ? false : stryMutAct_9fa48("17506") ? true : (stryCov_9fa48("17506", "17507", "17508"), (stryMutAct_9fa48("17509") ? CONNECTOR_CONFIGS[selectedSource?.type || newSourceType || ''].icon : (stryCov_9fa48("17509"), CONNECTOR_CONFIGS[stryMutAct_9fa48("17512") ? (selectedSource?.type || newSourceType) && '' : stryMutAct_9fa48("17511") ? false : stryMutAct_9fa48("17510") ? true : (stryCov_9fa48("17510", "17511", "17512"), (stryMutAct_9fa48("17514") ? selectedSource?.type && newSourceType : stryMutAct_9fa48("17513") ? false : (stryCov_9fa48("17513", "17514"), (stryMutAct_9fa48("17515") ? selectedSource.type : (stryCov_9fa48("17515"), selectedSource?.type)) || newSourceType)) || '')]?.icon)) || '📊')}
                      </span>
                      <div>
                        <h2 className="text-xl font-semibold text-white">
                          {stryMutAct_9fa48("17520") ? selectedSource?.name && CONNECTOR_CONFIGS[newSourceType || '']?.name : stryMutAct_9fa48("17519") ? false : stryMutAct_9fa48("17518") ? true : (stryCov_9fa48("17518", "17519", "17520"), (stryMutAct_9fa48("17521") ? selectedSource.name : (stryCov_9fa48("17521"), selectedSource?.name)) || (stryMutAct_9fa48("17522") ? CONNECTOR_CONFIGS[newSourceType || ''].name : (stryCov_9fa48("17522"), CONNECTOR_CONFIGS[stryMutAct_9fa48("17525") ? newSourceType && '' : stryMutAct_9fa48("17524") ? false : stryMutAct_9fa48("17523") ? true : (stryCov_9fa48("17523", "17524", "17525"), newSourceType || '')]?.name)))}
                        </h2>
                        <p className="text-sm text-gray-400">
                          {stryMutAct_9fa48("17527") ? CONNECTOR_CONFIGS[selectedSource?.type || newSourceType || ''].category : (stryCov_9fa48("17527"), CONNECTOR_CONFIGS[stryMutAct_9fa48("17530") ? (selectedSource?.type || newSourceType) && '' : stryMutAct_9fa48("17529") ? false : stryMutAct_9fa48("17528") ? true : (stryCov_9fa48("17528", "17529", "17530"), (stryMutAct_9fa48("17532") ? selectedSource?.type && newSourceType : stryMutAct_9fa48("17531") ? false : (stryCov_9fa48("17531", "17532"), (stryMutAct_9fa48("17533") ? selectedSource.type : (stryCov_9fa48("17533"), selectedSource?.type)) || newSourceType)) || '')]?.category)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {stryMutAct_9fa48("17537") ? selectedSource || <>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${selectedSource.status === 'CONNECTED' ? 'bg-green-900/50 text-green-400' : selectedSource.status === 'ERROR' ? 'bg-red-900/50 text-red-400' : 'bg-gray-700 text-gray-400'}`}>
                            {getStatusLabel(selectedSource.status)}
                          </span>
                          <button onClick={() => handleSync(selectedSource.id)} className="p-2 text-gray-400 hover:text-indigo-400 hover:bg-indigo-900/20 rounded-lg transition-colors">
                            <RefreshCw className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(selectedSource.id)} className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </> : stryMutAct_9fa48("17536") ? false : stryMutAct_9fa48("17535") ? true : (stryCov_9fa48("17535", "17536", "17537"), selectedSource && <>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${(stryMutAct_9fa48("17541") ? selectedSource.status !== 'CONNECTED' : stryMutAct_9fa48("17540") ? false : stryMutAct_9fa48("17539") ? true : (stryCov_9fa48("17539", "17540", "17541"), selectedSource.status === 'CONNECTED')) ? 'bg-green-900/50 text-green-400' : (stryMutAct_9fa48("17546") ? selectedSource.status !== 'ERROR' : stryMutAct_9fa48("17545") ? false : stryMutAct_9fa48("17544") ? true : (stryCov_9fa48("17544", "17545", "17546"), selectedSource.status === 'ERROR')) ? 'bg-red-900/50 text-red-400' : 'bg-gray-700 text-gray-400'}`}>
                            {getStatusLabel(selectedSource.status)}
                          </span>
                          <button onClick={stryMutAct_9fa48("17550") ? () => undefined : (stryCov_9fa48("17550"), () => handleSync(selectedSource.id))} className="p-2 text-gray-400 hover:text-indigo-400 hover:bg-indigo-900/20 rounded-lg transition-colors">
                            <RefreshCw className="w-4 h-4" />
                          </button>
                          <button onClick={stryMutAct_9fa48("17551") ? () => undefined : (stryCov_9fa48("17551"), () => handleDelete(selectedSource.id))} className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>)}
                    </div>
                  </div>
                </div>

                {/* Form */}
                <div className="p-6">
                  {(stryMutAct_9fa48("17554") ? isEditing && isAddingNew : stryMutAct_9fa48("17553") ? false : stryMutAct_9fa48("17552") ? true : (stryCov_9fa48("17552", "17553", "17554"), isEditing || isAddingNew)) ? <div className="space-y-4">
                      {/* Name field for new sources */}
                      {stryMutAct_9fa48("17557") ? isAddingNew || <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Display Name
                          </label>
                          <input type="text" value={formData.name || ''} onChange={e => setFormData({
                    ...formData,
                    name: e.target.value
                  })} placeholder={CONNECTOR_CONFIGS[newSourceType || '']?.name} className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        </div> : stryMutAct_9fa48("17556") ? false : stryMutAct_9fa48("17555") ? true : (stryCov_9fa48("17555", "17556", "17557"), isAddingNew && <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Display Name
                          </label>
                          <input type="text" value={stryMutAct_9fa48("17560") ? formData.name && '' : stryMutAct_9fa48("17559") ? false : stryMutAct_9fa48("17558") ? true : (stryCov_9fa48("17558", "17559", "17560"), formData.name || '')} onChange={stryMutAct_9fa48("17562") ? () => undefined : (stryCov_9fa48("17562"), e => setFormData(stryMutAct_9fa48("17563") ? {} : (stryCov_9fa48("17563"), {
                    ...formData,
                    name: e.target.value
                  })))} placeholder={stryMutAct_9fa48("17564") ? CONNECTOR_CONFIGS[newSourceType || ''].name : (stryCov_9fa48("17564"), CONNECTOR_CONFIGS[stryMutAct_9fa48("17567") ? newSourceType && '' : stryMutAct_9fa48("17566") ? false : stryMutAct_9fa48("17565") ? true : (stryCov_9fa48("17565", "17566", "17567"), newSourceType || '')]?.name)} className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        </div>)}
                      
                      {/* Dynamic fields */}
                      {stryMutAct_9fa48("17569") ? CONNECTOR_CONFIGS[selectedSource?.type || newSourceType || ''].fields.map(field => <div key={field.key}>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            {field.label}
                            {field.required && <span className="text-red-400 ml-1">*</span>}
                          </label>
                          
                          {field.type === 'select' ? <select value={formData[field.key] || ''} onChange={e => setFormData({
                    ...formData,
                    [field.key]: e.target.value
                  })} className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                              <option value="">Select...</option>
                              {field.options?.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                            </select> : field.type === 'textarea' ? <textarea value={formData[field.key] || ''} onChange={e => setFormData({
                    ...formData,
                    [field.key]: e.target.value
                  })} placeholder={field.placeholder} rows={4} className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm" /> : <div className="relative">
                              <input type={field.type === 'password' && !showPasswords[field.key] ? 'password' : 'text'} value={formData[field.key] || ''} onChange={e => setFormData({
                      ...formData,
                      [field.key]: e.target.value
                    })} placeholder={field.placeholder} className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-10" />
                              {field.type === 'password' && <button type="button" onClick={() => setShowPasswords({
                      ...showPasswords,
                      [field.key]: !showPasswords[field.key]
                    })} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                                  {showPasswords[field.key] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>}
                            </div>}
                        </div>) : (stryCov_9fa48("17569"), CONNECTOR_CONFIGS[stryMutAct_9fa48("17572") ? (selectedSource?.type || newSourceType) && '' : stryMutAct_9fa48("17571") ? false : stryMutAct_9fa48("17570") ? true : (stryCov_9fa48("17570", "17571", "17572"), (stryMutAct_9fa48("17574") ? selectedSource?.type && newSourceType : stryMutAct_9fa48("17573") ? false : (stryCov_9fa48("17573", "17574"), (stryMutAct_9fa48("17575") ? selectedSource.type : (stryCov_9fa48("17575"), selectedSource?.type)) || newSourceType)) || '')]?.fields.map(stryMutAct_9fa48("17577") ? () => undefined : (stryCov_9fa48("17577"), field => <div key={field.key}>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            {field.label}
                            {stryMutAct_9fa48("17580") ? field.required || <span className="text-red-400 ml-1">*</span> : stryMutAct_9fa48("17579") ? false : stryMutAct_9fa48("17578") ? true : (stryCov_9fa48("17578", "17579", "17580"), field.required && <span className="text-red-400 ml-1">*</span>)}
                          </label>
                          
                          {(stryMutAct_9fa48("17583") ? field.type !== 'select' : stryMutAct_9fa48("17582") ? false : stryMutAct_9fa48("17581") ? true : (stryCov_9fa48("17581", "17582", "17583"), field.type === 'select')) ? <select value={stryMutAct_9fa48("17587") ? formData[field.key] && '' : stryMutAct_9fa48("17586") ? false : stryMutAct_9fa48("17585") ? true : (stryCov_9fa48("17585", "17586", "17587"), formData[field.key] || '')} onChange={stryMutAct_9fa48("17589") ? () => undefined : (stryCov_9fa48("17589"), e => setFormData(stryMutAct_9fa48("17590") ? {} : (stryCov_9fa48("17590"), {
                    ...formData,
                    [field.key]: e.target.value
                  })))} className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                              <option value="">Select...</option>
                              {stryMutAct_9fa48("17591") ? field.options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>) : (stryCov_9fa48("17591"), field.options?.map(stryMutAct_9fa48("17592") ? () => undefined : (stryCov_9fa48("17592"), opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)))}
                            </select> : (stryMutAct_9fa48("17595") ? field.type !== 'textarea' : stryMutAct_9fa48("17594") ? false : stryMutAct_9fa48("17593") ? true : (stryCov_9fa48("17593", "17594", "17595"), field.type === 'textarea')) ? <textarea value={stryMutAct_9fa48("17599") ? formData[field.key] && '' : stryMutAct_9fa48("17598") ? false : stryMutAct_9fa48("17597") ? true : (stryCov_9fa48("17597", "17598", "17599"), formData[field.key] || '')} onChange={stryMutAct_9fa48("17601") ? () => undefined : (stryCov_9fa48("17601"), e => setFormData(stryMutAct_9fa48("17602") ? {} : (stryCov_9fa48("17602"), {
                    ...formData,
                    [field.key]: e.target.value
                  })))} placeholder={field.placeholder} rows={4} className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm" /> : <div className="relative">
                              <input type={(stryMutAct_9fa48("17605") ? field.type === 'password' || !showPasswords[field.key] : stryMutAct_9fa48("17604") ? false : stryMutAct_9fa48("17603") ? true : (stryCov_9fa48("17603", "17604", "17605"), (stryMutAct_9fa48("17607") ? field.type !== 'password' : stryMutAct_9fa48("17606") ? true : (stryCov_9fa48("17606", "17607"), field.type === 'password')) && (stryMutAct_9fa48("17609") ? showPasswords[field.key] : (stryCov_9fa48("17609"), !showPasswords[field.key])))) ? 'password' : 'text'} value={stryMutAct_9fa48("17614") ? formData[field.key] && '' : stryMutAct_9fa48("17613") ? false : stryMutAct_9fa48("17612") ? true : (stryCov_9fa48("17612", "17613", "17614"), formData[field.key] || '')} onChange={stryMutAct_9fa48("17616") ? () => undefined : (stryCov_9fa48("17616"), e => setFormData(stryMutAct_9fa48("17617") ? {} : (stryCov_9fa48("17617"), {
                      ...formData,
                      [field.key]: e.target.value
                    })))} placeholder={field.placeholder} className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-10" />
                              {stryMutAct_9fa48("17620") ? field.type === 'password' || <button type="button" onClick={() => setShowPasswords({
                      ...showPasswords,
                      [field.key]: !showPasswords[field.key]
                    })} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                                  {showPasswords[field.key] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button> : stryMutAct_9fa48("17619") ? false : stryMutAct_9fa48("17618") ? true : (stryCov_9fa48("17618", "17619", "17620"), (stryMutAct_9fa48("17622") ? field.type !== 'password' : stryMutAct_9fa48("17621") ? true : (stryCov_9fa48("17621", "17622"), field.type === 'password')) && <button type="button" onClick={stryMutAct_9fa48("17624") ? () => undefined : (stryCov_9fa48("17624"), () => setShowPasswords(stryMutAct_9fa48("17625") ? {} : (stryCov_9fa48("17625"), {
                      ...showPasswords,
                      [field.key]: stryMutAct_9fa48("17626") ? showPasswords[field.key] : (stryCov_9fa48("17626"), !showPasswords[field.key])
                    })))} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                                  {showPasswords[field.key] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>)}
                            </div>}
                        </div>)))}

                      {/* Test Result */}
                      {stryMutAct_9fa48("17629") ? testResult || <div className={`p-4 rounded-lg ${testResult.success ? 'bg-green-900/30 border border-green-800' : 'bg-red-900/30 border border-red-800'}`}>
                          <div className="flex items-center gap-2">
                            {testResult.success ? <Check className="w-5 h-5 text-green-400" /> : <X className="w-5 h-5 text-red-400" />}
                            <span className={testResult.success ? 'text-green-400' : 'text-red-400'}>
                              {testResult.message}
                            </span>
                          </div>
                          {testResult.error && <p className="text-sm text-red-300 mt-2">{testResult.error}</p>}
                          {testResult.metadata && <pre className="text-xs text-gray-400 mt-2 overflow-auto">
                              {JSON.stringify(testResult.metadata, null, 2)}
                            </pre>}
                        </div> : stryMutAct_9fa48("17628") ? false : stryMutAct_9fa48("17627") ? true : (stryCov_9fa48("17627", "17628", "17629"), testResult && <div className={`p-4 rounded-lg ${testResult.success ? 'bg-green-900/30 border border-green-800' : 'bg-red-900/30 border border-red-800'}`}>
                          <div className="flex items-center gap-2">
                            {testResult.success ? <Check className="w-5 h-5 text-green-400" /> : <X className="w-5 h-5 text-red-400" />}
                            <span className={testResult.success ? 'text-green-400' : 'text-red-400'}>
                              {testResult.message}
                            </span>
                          </div>
                          {stryMutAct_9fa48("17637") ? testResult.error || <p className="text-sm text-red-300 mt-2">{testResult.error}</p> : stryMutAct_9fa48("17636") ? false : stryMutAct_9fa48("17635") ? true : (stryCov_9fa48("17635", "17636", "17637"), testResult.error && <p className="text-sm text-red-300 mt-2">{testResult.error}</p>)}
                          {stryMutAct_9fa48("17640") ? testResult.metadata || <pre className="text-xs text-gray-400 mt-2 overflow-auto">
                              {JSON.stringify(testResult.metadata, null, 2)}
                            </pre> : stryMutAct_9fa48("17639") ? false : stryMutAct_9fa48("17638") ? true : (stryCov_9fa48("17638", "17639", "17640"), testResult.metadata && <pre className="text-xs text-gray-400 mt-2 overflow-auto">
                              {JSON.stringify(testResult.metadata, null, 2)}
                            </pre>)}
                        </div>)}

                      {/* Actions */}
                      <div className="flex items-center gap-3 pt-4">
                        <button onClick={handleTestConnection} disabled={isTesting} className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors disabled:opacity-50">
                          {isTesting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <TestTube className="w-4 h-4" />}
                          Test Connection
                        </button>
                        <button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:opacity-50">
                          {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                          Save Configuration
                        </button>
                        <button onClick={() => {
                    setIsEditing(stryMutAct_9fa48("17642") ? true : (stryCov_9fa48("17642"), false));
                    setIsAddingNew(stryMutAct_9fa48("17643") ? true : (stryCov_9fa48("17643"), false));
                    setNewSourceType(null);
                  }} className="px-4 py-2 text-gray-400 hover:text-white transition-colors">
                          Cancel
                        </button>
                      </div>
                    </div> :
              // View mode
              <div>
                      <div className="space-y-4">
                        {stryMutAct_9fa48("17644") ? CONNECTOR_CONFIGS[selectedSource?.type || ''].fields.map(field => {
                    const value = (selectedSource?.config as Record<string, unknown>)?.[field.key];
                    if (!value && !field.isCredential) {
                      return null;
                    }
                    return <div key={field.key} className="flex items-center justify-between py-2 border-b border-gray-700">
                              <span className="text-gray-400">{field.label}</span>
                              <span className="text-white font-mono">
                                {field.isCredential ? '••••••••' : String(value)}
                              </span>
                            </div>;
                  }) : (stryCov_9fa48("17644"), CONNECTOR_CONFIGS[stryMutAct_9fa48("17647") ? selectedSource?.type && '' : stryMutAct_9fa48("17646") ? false : stryMutAct_9fa48("17645") ? true : (stryCov_9fa48("17645", "17646", "17647"), (stryMutAct_9fa48("17648") ? selectedSource.type : (stryCov_9fa48("17648"), selectedSource?.type)) || '')]?.fields.map(field => {
                    const value = stryMutAct_9fa48("17651") ? (selectedSource?.config as Record<string, unknown>)[field.key] : (stryCov_9fa48("17651"), (selectedSource?.config as Record<string, unknown>)?.[field.key]);
                    if (stryMutAct_9fa48("17654") ? !value || !field.isCredential : stryMutAct_9fa48("17653") ? false : stryMutAct_9fa48("17652") ? true : (stryCov_9fa48("17652", "17653", "17654"), (stryMutAct_9fa48("17655") ? value : (stryCov_9fa48("17655"), !value)) && (stryMutAct_9fa48("17656") ? field.isCredential : (stryCov_9fa48("17656"), !field.isCredential)))) {
                      return null;
                    }
                    return <div key={field.key} className="flex items-center justify-between py-2 border-b border-gray-700">
                              <span className="text-gray-400">{field.label}</span>
                              <span className="text-white font-mono">
                                {field.isCredential ? '••••••••' : String(value)}
                              </span>
                            </div>;
                  }))}
                      </div>
                      
                      <div className="flex items-center gap-3 mt-6">
                        <button onClick={handleStartEdit} className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
                          <Settings className="w-4 h-4" />
                          Edit Configuration
                        </button>
                        <button onClick={handleTestConnection} disabled={isTesting} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:opacity-50">
                          {isTesting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <TestTube className="w-4 h-4" />}
                          Test Connection
                        </button>
                      </div>

                      {/* Test Result */}
                      {stryMutAct_9fa48("17661") ? testResult || <div className={`mt-4 p-4 rounded-lg ${testResult.success ? 'bg-green-900/30 border border-green-800' : 'bg-red-900/30 border border-red-800'}`}>
                          <div className="flex items-center gap-2">
                            {testResult.success ? <Check className="w-5 h-5 text-green-400" /> : <X className="w-5 h-5 text-red-400" />}
                            <span className={testResult.success ? 'text-green-400' : 'text-red-400'}>
                              {testResult.message}
                            </span>
                          </div>
                        </div> : stryMutAct_9fa48("17660") ? false : stryMutAct_9fa48("17659") ? true : (stryCov_9fa48("17659", "17660", "17661"), testResult && <div className={`mt-4 p-4 rounded-lg ${testResult.success ? 'bg-green-900/30 border border-green-800' : 'bg-red-900/30 border border-red-800'}`}>
                          <div className="flex items-center gap-2">
                            {testResult.success ? <Check className="w-5 h-5 text-green-400" /> : <X className="w-5 h-5 text-red-400" />}
                            <span className={testResult.success ? 'text-green-400' : 'text-red-400'}>
                              {testResult.message}
                            </span>
                          </div>
                        </div>)}
                    </div>}
                </div>
              </div> :
          // Empty state
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-12 text-center">
                <Database className="w-16 h-16 text-gray-600 mx-auto" />
                <h3 className="text-xl font-semibold text-white mt-4">Select a Data Source</h3>
                <p className="text-gray-400 mt-2">
                  Choose a data source from the list to view or edit its configuration
                </p>
              </div>}
          </div>
        </div>
      </div>
    </div>;
};
export default DataSourcesPage;