// =============================================================================
// SAMPLE DATA SERVICE - Auto-populate demo data for data sources
// =============================================================================

import { v4 as uuidv4 } from 'uuid';

// =============================================================================
// TYPES
// =============================================================================

export interface SampleDataset {
  id: string;
  name: string;
  description: string;
  category: 'enterprise' | 'financial' | 'healthcare' | 'retail' | 'manufacturing';
  recordCount: number;
  tables: string[];
  sizeEstimate: string;
}

export interface GeneratedData {
  tableName: string;
  records: Record<string, unknown>[];
  schema: Record<string, string>;
}

// =============================================================================
// SAMPLE DATASETS CATALOG
// =============================================================================

export const SAMPLE_DATASETS: SampleDataset[] = [
  {
    id: 'enterprise-erp',
    name: 'Enterprise ERP Data',
    description: 'Complete ERP dataset with customers, orders, products, employees, and financials',
    category: 'enterprise',
    recordCount: 50000,
    tables: ['customers', 'orders', 'order_items', 'products', 'employees', 'departments', 'invoices', 'payments'],
    sizeEstimate: '~25MB',
  },
  {
    id: 'financial-trading',
    name: 'Financial Trading Data',
    description: 'Stock trades, portfolios, market data, and risk metrics',
    category: 'financial',
    recordCount: 100000,
    tables: ['trades', 'portfolios', 'positions', 'market_data', 'risk_metrics', 'accounts', 'transactions'],
    sizeEstimate: '~50MB',
  },
  {
    id: 'healthcare-ehr',
    name: 'Healthcare EHR Data',
    description: 'Patient records, encounters, diagnoses, medications, and lab results (HIPAA-safe synthetic)',
    category: 'healthcare',
    recordCount: 25000,
    tables: ['patients', 'encounters', 'diagnoses', 'medications', 'lab_results', 'providers', 'appointments'],
    sizeEstimate: '~15MB',
  },
  {
    id: 'retail-ecommerce',
    name: 'Retail E-Commerce Data',
    description: 'Products, customers, orders, reviews, inventory, and marketing campaigns',
    category: 'retail',
    recordCount: 75000,
    tables: ['products', 'customers', 'orders', 'order_items', 'reviews', 'inventory', 'campaigns', 'categories'],
    sizeEstimate: '~35MB',
  },
  {
    id: 'manufacturing-ops',
    name: 'Manufacturing Operations Data',
    description: 'Production lines, equipment, quality metrics, supply chain, and maintenance records',
    category: 'manufacturing',
    recordCount: 40000,
    tables: ['production_runs', 'equipment', 'quality_checks', 'suppliers', 'materials', 'maintenance', 'defects'],
    sizeEstimate: '~20MB',
  },
];

// =============================================================================
// DATA GENERATORS
// =============================================================================

const FIRST_NAMES = ['James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth', 'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica', 'Thomas', 'Sarah', 'Charles', 'Karen', 'Wei', 'Yuki', 'Mohammed', 'Fatima', 'Carlos', 'Maria', 'Hans', 'Anna', 'Pierre', 'Sophie'];
const LAST_NAMES = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Chen', 'Wang', 'Kim', 'Patel', 'Singh', 'Müller', 'Schmidt', 'Tanaka', 'Yamamoto', 'Ali'];
const COMPANIES = ['Acme Corp', 'Global Industries', 'Tech Solutions', 'Prime Manufacturing', 'Atlas Holdings', 'Nexus Systems', 'Vertex Partners', 'Omega Enterprises', 'Delta Group', 'Sigma Corp'];
const DEPARTMENTS = ['Engineering', 'Sales', 'Marketing', 'Finance', 'HR', 'Operations', 'Legal', 'IT', 'R&D', 'Customer Success'];
const PRODUCT_ADJECTIVES = ['Premium', 'Professional', 'Enterprise', 'Advanced', 'Ultra', 'Pro', 'Elite', 'Essential', 'Standard', 'Basic'];
const PRODUCT_NOUNS = ['Widget', 'Module', 'System', 'Platform', 'Solution', 'Suite', 'Package', 'Kit', 'Tool', 'Device'];
const CITIES = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'London', 'Tokyo', 'Paris', 'Berlin', 'Sydney', 'Toronto', 'Singapore', 'Dubai', 'Mumbai', 'São Paulo'];
const COUNTRIES = ['USA', 'UK', 'Japan', 'Germany', 'Australia', 'Canada', 'Singapore', 'UAE', 'India', 'Brazil'];

function randomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min: number, max: number, decimals: number = 2): number {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

function randomDate(startYear: number = 2020, endYear: number = 2024): Date {
  const start = new Date(startYear, 0, 1);
  const end = new Date(endYear, 11, 31);
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function randomEmail(firstName: string, lastName: string): string {
  const domains = ['gmail.com', 'outlook.com', 'company.com', 'enterprise.io', 'corp.net'];
  return `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${randomElement(domains)}`;
}

function randomPhone(): string {
  return `+1-${randomInt(200, 999)}-${randomInt(100, 999)}-${randomInt(1000, 9999)}`;
}

// =============================================================================
// TABLE GENERATORS
// =============================================================================

function generateCustomers(count: number): GeneratedData {
  const records: Record<string, unknown>[] = [];
  
  for (let i = 0; i < count; i++) {
    const firstName = randomElement(FIRST_NAMES);
    const lastName = randomElement(LAST_NAMES);
    records.push({
      id: uuidv4(),
      first_name: firstName,
      last_name: lastName,
      email: randomEmail(firstName, lastName),
      phone: randomPhone(),
      company: randomElement(COMPANIES),
      city: randomElement(CITIES),
      country: randomElement(COUNTRIES),
      created_at: randomDate().toISOString(),
      lifetime_value: randomFloat(100, 50000),
      segment: randomElement(['Enterprise', 'SMB', 'Startup', 'Government', 'Education']),
      status: randomElement(['active', 'active', 'active', 'inactive', 'churned']),
    });
  }
  
  return {
    tableName: 'customers',
    records,
    schema: {
      id: 'uuid',
      first_name: 'varchar(100)',
      last_name: 'varchar(100)',
      email: 'varchar(255)',
      phone: 'varchar(50)',
      company: 'varchar(255)',
      city: 'varchar(100)',
      country: 'varchar(100)',
      created_at: 'timestamp',
      lifetime_value: 'decimal(12,2)',
      segment: 'varchar(50)',
      status: 'varchar(20)',
    },
  };
}

function generateProducts(count: number): GeneratedData {
  const records: Record<string, unknown>[] = [];
  const categories = ['Software', 'Hardware', 'Services', 'Consulting', 'Training', 'Support'];
  
  for (let i = 0; i < count; i++) {
    records.push({
      id: uuidv4(),
      sku: `SKU-${randomInt(10000, 99999)}`,
      name: `${randomElement(PRODUCT_ADJECTIVES)} ${randomElement(PRODUCT_NOUNS)} ${randomInt(100, 999)}`,
      category: randomElement(categories),
      price: randomFloat(9.99, 9999.99),
      cost: randomFloat(5, 5000),
      stock_quantity: randomInt(0, 1000),
      reorder_point: randomInt(10, 100),
      supplier_id: uuidv4(),
      created_at: randomDate(2018, 2023).toISOString(),
      is_active: Math.random() > 0.1,
      rating: randomFloat(3.0, 5.0, 1),
      review_count: randomInt(0, 500),
    });
  }
  
  return {
    tableName: 'products',
    records,
    schema: {
      id: 'uuid',
      sku: 'varchar(50)',
      name: 'varchar(255)',
      category: 'varchar(100)',
      price: 'decimal(10,2)',
      cost: 'decimal(10,2)',
      stock_quantity: 'integer',
      reorder_point: 'integer',
      supplier_id: 'uuid',
      created_at: 'timestamp',
      is_active: 'boolean',
      rating: 'decimal(2,1)',
      review_count: 'integer',
    },
  };
}

function generateOrders(count: number, customerIds: string[]): GeneratedData {
  const records: Record<string, unknown>[] = [];
  const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
  
  for (let i = 0; i < count; i++) {
    const orderDate = randomDate();
    records.push({
      id: uuidv4(),
      order_number: `ORD-${randomInt(100000, 999999)}`,
      customer_id: randomElement(customerIds),
      order_date: orderDate.toISOString(),
      status: randomElement(statuses),
      subtotal: randomFloat(50, 10000),
      tax: randomFloat(5, 1000),
      shipping: randomFloat(0, 100),
      total: randomFloat(55, 11000),
      shipping_address: `${randomInt(100, 9999)} ${randomElement(['Main St', 'Oak Ave', 'Park Blvd', 'First St', 'Commerce Dr'])}`,
      shipping_city: randomElement(CITIES),
      shipping_country: randomElement(COUNTRIES),
      payment_method: randomElement(['credit_card', 'debit_card', 'paypal', 'wire_transfer', 'invoice']),
      notes: Math.random() > 0.8 ? 'Rush order - priority shipping requested' : null,
    });
  }
  
  return {
    tableName: 'orders',
    records,
    schema: {
      id: 'uuid',
      order_number: 'varchar(50)',
      customer_id: 'uuid',
      order_date: 'timestamp',
      status: 'varchar(20)',
      subtotal: 'decimal(12,2)',
      tax: 'decimal(10,2)',
      shipping: 'decimal(10,2)',
      total: 'decimal(12,2)',
      shipping_address: 'varchar(255)',
      shipping_city: 'varchar(100)',
      shipping_country: 'varchar(100)',
      payment_method: 'varchar(50)',
      notes: 'text',
    },
  };
}

function generateEmployees(count: number): GeneratedData {
  const records: Record<string, unknown>[] = [];
  const titles = ['Manager', 'Senior Engineer', 'Analyst', 'Director', 'VP', 'Associate', 'Lead', 'Specialist', 'Coordinator', 'Executive'];
  
  for (let i = 0; i < count; i++) {
    const firstName = randomElement(FIRST_NAMES);
    const lastName = randomElement(LAST_NAMES);
    const hireDate = randomDate(2015, 2024);
    records.push({
      id: uuidv4(),
      employee_number: `EMP-${randomInt(10000, 99999)}`,
      first_name: firstName,
      last_name: lastName,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@datacendia.com`,
      department: randomElement(DEPARTMENTS),
      title: `${randomElement(DEPARTMENTS)} ${randomElement(titles)}`,
      hire_date: hireDate.toISOString().split('T')[0],
      salary: randomInt(50000, 250000),
      manager_id: Math.random() > 0.2 ? uuidv4() : null,
      location: randomElement(CITIES),
      is_active: Math.random() > 0.05,
      performance_rating: randomFloat(2.5, 5.0, 1),
    });
  }
  
  return {
    tableName: 'employees',
    records,
    schema: {
      id: 'uuid',
      employee_number: 'varchar(50)',
      first_name: 'varchar(100)',
      last_name: 'varchar(100)',
      email: 'varchar(255)',
      department: 'varchar(100)',
      title: 'varchar(255)',
      hire_date: 'date',
      salary: 'integer',
      manager_id: 'uuid',
      location: 'varchar(100)',
      is_active: 'boolean',
      performance_rating: 'decimal(2,1)',
    },
  };
}

function generateTrades(count: number): GeneratedData {
  const records: Record<string, unknown>[] = [];
  const symbols = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'META', 'NVDA', 'TSLA', 'JPM', 'V', 'JNJ', 'WMT', 'PG', 'UNH', 'HD', 'BAC'];
  const sides = ['buy', 'sell'];
  const orderTypes = ['market', 'limit', 'stop', 'stop_limit'];
  
  for (let i = 0; i < count; i++) {
    const quantity = randomInt(1, 1000);
    const price = randomFloat(10, 500);
    records.push({
      id: uuidv4(),
      trade_id: `TRD-${randomInt(1000000, 9999999)}`,
      symbol: randomElement(symbols),
      side: randomElement(sides),
      quantity,
      price,
      total_value: quantity * price,
      order_type: randomElement(orderTypes),
      account_id: uuidv4(),
      executed_at: randomDate().toISOString(),
      settlement_date: randomDate().toISOString().split('T')[0],
      commission: randomFloat(0, 10),
      exchange: randomElement(['NYSE', 'NASDAQ', 'LSE', 'TSE', 'HKEX']),
      status: randomElement(['executed', 'executed', 'executed', 'pending', 'cancelled']),
    });
  }
  
  return {
    tableName: 'trades',
    records,
    schema: {
      id: 'uuid',
      trade_id: 'varchar(50)',
      symbol: 'varchar(10)',
      side: 'varchar(10)',
      quantity: 'integer',
      price: 'decimal(10,2)',
      total_value: 'decimal(14,2)',
      order_type: 'varchar(20)',
      account_id: 'uuid',
      executed_at: 'timestamp',
      settlement_date: 'date',
      commission: 'decimal(8,2)',
      exchange: 'varchar(20)',
      status: 'varchar(20)',
    },
  };
}

function generatePatients(count: number): GeneratedData {
  const records: Record<string, unknown>[] = [];
  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  
  for (let i = 0; i < count; i++) {
    const firstName = randomElement(FIRST_NAMES);
    const lastName = randomElement(LAST_NAMES);
    const birthYear = randomInt(1940, 2020);
    records.push({
      id: uuidv4(),
      mrn: `MRN-${randomInt(100000, 999999)}`,
      first_name: firstName,
      last_name: lastName,
      date_of_birth: `${birthYear}-${String(randomInt(1, 12)).padStart(2, '0')}-${String(randomInt(1, 28)).padStart(2, '0')}`,
      gender: randomElement(['M', 'F', 'O']),
      blood_type: randomElement(bloodTypes),
      phone: randomPhone(),
      email: randomEmail(firstName, lastName),
      address: `${randomInt(100, 9999)} ${randomElement(['Health St', 'Medical Ave', 'Care Blvd'])}`,
      city: randomElement(CITIES),
      insurance_provider: randomElement(['BlueCross', 'Aetna', 'UnitedHealth', 'Cigna', 'Kaiser', 'Medicare', 'Medicaid']),
      insurance_id: `INS-${randomInt(100000000, 999999999)}`,
      primary_physician_id: uuidv4(),
      created_at: randomDate(2015, 2024).toISOString(),
      is_active: Math.random() > 0.1,
    });
  }
  
  return {
    tableName: 'patients',
    records,
    schema: {
      id: 'uuid',
      mrn: 'varchar(50)',
      first_name: 'varchar(100)',
      last_name: 'varchar(100)',
      date_of_birth: 'date',
      gender: 'char(1)',
      blood_type: 'varchar(5)',
      phone: 'varchar(50)',
      email: 'varchar(255)',
      address: 'varchar(255)',
      city: 'varchar(100)',
      insurance_provider: 'varchar(100)',
      insurance_id: 'varchar(50)',
      primary_physician_id: 'uuid',
      created_at: 'timestamp',
      is_active: 'boolean',
    },
  };
}

// =============================================================================
// SAMPLE DATA SERVICE
// =============================================================================

class SampleDataService {
  /**
   * Get available sample datasets
   */
  getAvailableDatasets(): SampleDataset[] {
    return SAMPLE_DATASETS;
  }

  /**
   * Get dataset by ID
   */
  getDataset(datasetId: string): SampleDataset | undefined {
    return SAMPLE_DATASETS.find(d => d.id === datasetId);
  }

  /**
   * Generate sample data for a specific dataset
   */
  generateDataset(datasetId: string, scale: number = 1): GeneratedData[] {
    const dataset = this.getDataset(datasetId);
    if (!dataset) {
      throw new Error(`Dataset not found: ${datasetId}`);
    }

    const baseCount = Math.floor(dataset.recordCount * scale);
    const results: GeneratedData[] = [];

    switch (datasetId) {
      case 'enterprise-erp': {
        const customers = generateCustomers(Math.floor(baseCount * 0.2));
        const products = generateProducts(Math.floor(baseCount * 0.1));
        const employees = generateEmployees(Math.floor(baseCount * 0.05));
        const customerIds = customers.records.map(c => c.id as string);
        const orders = generateOrders(Math.floor(baseCount * 0.4), customerIds);
        
        results.push(customers, products, employees, orders);
        break;
      }
      
      case 'financial-trading': {
        const trades = generateTrades(baseCount);
        results.push(trades);
        break;
      }
      
      case 'healthcare-ehr': {
        const patients = generatePatients(baseCount);
        results.push(patients);
        break;
      }
      
      case 'retail-ecommerce': {
        const customers = generateCustomers(Math.floor(baseCount * 0.3));
        const products = generateProducts(Math.floor(baseCount * 0.15));
        const customerIds = customers.records.map(c => c.id as string);
        const orders = generateOrders(Math.floor(baseCount * 0.5), customerIds);
        
        results.push(customers, products, orders);
        break;
      }
      
      case 'manufacturing-ops': {
        const employees = generateEmployees(Math.floor(baseCount * 0.1));
        const products = generateProducts(Math.floor(baseCount * 0.2));
        
        results.push(employees, products);
        break;
      }
      
      default:
        throw new Error(`Unknown dataset: ${datasetId}`);
    }

    return results;
  }

  /**
   * Generate SQL INSERT statements for a dataset
   */
  generateSQL(datasetId: string, scale: number = 1): string {
    const data = this.generateDataset(datasetId, scale);
    const statements: string[] = [];

    for (const table of data) {
      // Create table statement
      const columns = Object.entries(table.schema)
        .map(([name, type]) => `  ${name} ${type}`)
        .join(',\n');
      
      statements.push(`-- Table: ${table.tableName}`);
      statements.push(`CREATE TABLE IF NOT EXISTS ${table.tableName} (\n${columns}\n);\n`);

      // Insert statements (batch of 100)
      for (let i = 0; i < table.records.length; i += 100) {
        const batch = table.records.slice(i, i + 100);
        const columnNames = Object.keys(table.schema).join(', ');
        const values = batch.map(record => {
          const vals = Object.keys(table.schema).map(col => {
            const val = record[col];
            if (val === null || val === undefined) return 'NULL';
            if (typeof val === 'string') return `'${val.replace(/'/g, "''")}'`;
            if (typeof val === 'boolean') return val ? 'TRUE' : 'FALSE';
            return val;
          });
          return `(${vals.join(', ')})`;
        }).join(',\n  ');
        
        statements.push(`INSERT INTO ${table.tableName} (${columnNames}) VALUES\n  ${values};\n`);
      }
    }

    return statements.join('\n');
  }

  /**
   * Get statistics about generated data
   */
  getDatasetStats(datasetId: string, scale: number = 1): {
    dataset: SampleDataset;
    tables: { name: string; recordCount: number }[];
    totalRecords: number;
    estimatedSize: string;
  } {
    const dataset = this.getDataset(datasetId);
    if (!dataset) {
      throw new Error(`Dataset not found: ${datasetId}`);
    }

    const data = this.generateDataset(datasetId, scale);
    const tables = data.map(t => ({ name: t.tableName, recordCount: t.records.length }));
    const totalRecords = tables.reduce((sum, t) => sum + t.recordCount, 0);

    return {
      dataset,
      tables,
      totalRecords,
      estimatedSize: `~${Math.round(totalRecords * 0.5 / 1000)}KB`,
    };
  }
}

export const sampleDataService = new SampleDataService();
export default sampleDataService;
