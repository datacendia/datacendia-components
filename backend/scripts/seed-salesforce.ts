/**
 * Salesforce Demo Data Seeder
 * Populates your Salesforce org with realistic demo data for Datacendia integration
 * 
 * Usage:
 *   1. Set environment variables (SALESFORCE_USERNAME, SALESFORCE_PASSWORD, SALESFORCE_SECURITY_TOKEN)
 *   2. Run: npx ts-node scripts/seed-salesforce.ts
 */

import 'dotenv/config';
import jsforce from 'jsforce';

// Configuration - Update these or use environment variables
const config = {
  loginUrl: process.env.SALESFORCE_LOGIN_URL || 'https://login.salesforce.com',
  username: process.env.SALESFORCE_USERNAME || '',
  password: process.env.SALESFORCE_PASSWORD || '',
  securityToken: process.env.SALESFORCE_SECURITY_TOKEN || '',
};

// Demo Data
const ACCOUNTS = [
  { Name: 'Acme Corporation', Industry: 'Technology', Type: 'Customer', AnnualRevenue: 5000000, NumberOfEmployees: 250, Website: 'https://acme.example.com', BillingCity: 'San Francisco', BillingState: 'CA' },
  { Name: 'Global Industries Inc', Industry: 'Manufacturing', Type: 'Customer', AnnualRevenue: 12000000, NumberOfEmployees: 800, Website: 'https://globalind.example.com', BillingCity: 'Chicago', BillingState: 'IL' },
  { Name: 'TechStart Solutions', Industry: 'Technology', Type: 'Prospect', AnnualRevenue: 2000000, NumberOfEmployees: 50, Website: 'https://techstart.example.com', BillingCity: 'Austin', BillingState: 'TX' },
  { Name: 'HealthFirst Medical', Industry: 'Healthcare', Type: 'Customer', AnnualRevenue: 8000000, NumberOfEmployees: 400, Website: 'https://healthfirst.example.com', BillingCity: 'Boston', BillingState: 'MA' },
  { Name: 'Retail Giants LLC', Industry: 'Retail', Type: 'Partner', AnnualRevenue: 25000000, NumberOfEmployees: 1500, Website: 'https://retailgiants.example.com', BillingCity: 'New York', BillingState: 'NY' },
  { Name: 'Financial Services Corp', Industry: 'Finance', Type: 'Customer', AnnualRevenue: 50000000, NumberOfEmployees: 2000, Website: 'https://finserv.example.com', BillingCity: 'Charlotte', BillingState: 'NC' },
  { Name: 'Green Energy Partners', Industry: 'Energy', Type: 'Prospect', AnnualRevenue: 15000000, NumberOfEmployees: 300, Website: 'https://greenenergy.example.com', BillingCity: 'Denver', BillingState: 'CO' },
  { Name: 'Education First Institute', Industry: 'Education', Type: 'Customer', AnnualRevenue: 3000000, NumberOfEmployees: 150, Website: 'https://edufirst.example.com', BillingCity: 'Seattle', BillingState: 'WA' },
];

const CONTACTS = [
  { FirstName: 'John', LastName: 'Smith', Title: 'CEO', Email: 'john.smith@acme.example.com', Phone: '415-555-0101', Department: 'Executive' },
  { FirstName: 'Sarah', LastName: 'Johnson', Title: 'CFO', Email: 'sarah.johnson@acme.example.com', Phone: '415-555-0102', Department: 'Finance' },
  { FirstName: 'Michael', LastName: 'Chen', Title: 'CTO', Email: 'michael.chen@globalind.example.com', Phone: '312-555-0201', Department: 'Technology' },
  { FirstName: 'Emily', LastName: 'Davis', Title: 'VP Sales', Email: 'emily.davis@globalind.example.com', Phone: '312-555-0202', Department: 'Sales' },
  { FirstName: 'Robert', LastName: 'Wilson', Title: 'Founder', Email: 'robert.wilson@techstart.example.com', Phone: '512-555-0301', Department: 'Executive' },
  { FirstName: 'Jennifer', LastName: 'Martinez', Title: 'CMO', Email: 'jennifer.martinez@healthfirst.example.com', Phone: '617-555-0401', Department: 'Marketing' },
  { FirstName: 'David', LastName: 'Brown', Title: 'Director of Operations', Email: 'david.brown@retailgiants.example.com', Phone: '212-555-0501', Department: 'Operations' },
  { FirstName: 'Lisa', LastName: 'Taylor', Title: 'VP Engineering', Email: 'lisa.taylor@finserv.example.com', Phone: '704-555-0601', Department: 'Engineering' },
  { FirstName: 'James', LastName: 'Anderson', Title: 'COO', Email: 'james.anderson@greenenergy.example.com', Phone: '303-555-0701', Department: 'Operations' },
  { FirstName: 'Amanda', LastName: 'Thomas', Title: 'Director of IT', Email: 'amanda.thomas@edufirst.example.com', Phone: '206-555-0801', Department: 'IT' },
];

const LEADS = [
  { FirstName: 'Alex', LastName: 'Morgan', Company: 'Startup Labs', Title: 'Founder', Email: 'alex@startuplabs.io', Phone: '650-555-1001', Status: 'Open - Not Contacted', Industry: 'Technology', LeadSource: 'Web' },
  { FirstName: 'Chris', LastName: 'Lee', Company: 'DataFlow Inc', Title: 'VP Product', Email: 'chris.lee@dataflow.io', Phone: '408-555-1002', Status: 'Working - Contacted', Industry: 'Technology', LeadSource: 'Partner Referral' },
  { FirstName: 'Taylor', LastName: 'Wright', Company: 'HealthTech Solutions', Title: 'CEO', Email: 'taylor@healthtech.com', Phone: '858-555-1003', Status: 'Open - Not Contacted', Industry: 'Healthcare', LeadSource: 'Trade Show' },
  { FirstName: 'Jordan', LastName: 'Patel', Company: 'Quantum Finance', Title: 'CIO', Email: 'jpatel@quantumfin.com', Phone: '646-555-1004', Status: 'Working - Contacted', Industry: 'Finance', LeadSource: 'Advertisement' },
  { FirstName: 'Morgan', LastName: 'Kim', Company: 'EcoSmart Systems', Title: 'Director', Email: 'morgan.kim@ecosmart.co', Phone: '503-555-1005', Status: 'Open - Not Contacted', Industry: 'Energy', LeadSource: 'Web' },
];

const OPPORTUNITIES = [
  { Name: 'Acme Corp - Enterprise License', StageName: 'Prospecting', Amount: 150000, CloseDate: '2025-03-15', Probability: 20 },
  { Name: 'Global Industries - Platform Upgrade', StageName: 'Qualification', Amount: 250000, CloseDate: '2025-02-28', Probability: 40 },
  { Name: 'TechStart - Initial Deployment', StageName: 'Needs Analysis', Amount: 75000, CloseDate: '2025-01-31', Probability: 50 },
  { Name: 'HealthFirst - Data Analytics Suite', StageName: 'Proposal/Price Quote', Amount: 180000, CloseDate: '2025-02-15', Probability: 70 },
  { Name: 'Retail Giants - Multi-Region Rollout', StageName: 'Negotiation/Review', Amount: 500000, CloseDate: '2025-01-20', Probability: 80 },
  { Name: 'Financial Services - AI Integration', StageName: 'Closed Won', Amount: 320000, CloseDate: '2024-12-15', Probability: 100 },
  { Name: 'Green Energy - Pilot Program', StageName: 'Qualification', Amount: 45000, CloseDate: '2025-04-01', Probability: 30 },
  { Name: 'Education First - Campus License', StageName: 'Prospecting', Amount: 85000, CloseDate: '2025-05-01', Probability: 15 },
];

async function seedSalesforce() {
  console.log('🚀 Salesforce Demo Data Seeder\n');

  // Validate configuration
  if (!config.username || !config.password) {
    console.log('❌ Missing Salesforce credentials!\n');
    console.log('Please set the following environment variables:');
    console.log('  SALESFORCE_USERNAME=your-email@example.com');
    console.log('  SALESFORCE_PASSWORD=your-password');
    console.log('  SALESFORCE_SECURITY_TOKEN=your-security-token');
    console.log('\nOr update the config object in this script.\n');
    console.log('To get your security token:');
    console.log('  1. Go to Salesforce Setup');
    console.log('  2. Search for "Reset My Security Token"');
    console.log('  3. Click "Reset Security Token"');
    console.log('  4. Check your email for the new token\n');
    return;
  }

  try {
    // Connect to Salesforce
    console.log('📡 Connecting to Salesforce...');
    const conn = new jsforce.Connection({ loginUrl: config.loginUrl });
    
    await conn.login(config.username, config.password + config.securityToken);
    console.log('✅ Connected successfully!\n');

    // Seed Accounts
    console.log('🏢 Creating Accounts...');
    const accountResults = await conn.sobject('Account').create(ACCOUNTS);
    const accountIds = (accountResults as any[]).map((r: any, i: number) => {
      if (r.success) {
        console.log(`  ✓ ${ACCOUNTS[i].Name}`);
        return r.id;
      } else {
        console.log(`  ✗ ${ACCOUNTS[i].Name}: ${r.errors?.[0]?.message}`);
        return null;
      }
    });
    console.log('');

    // Seed Contacts (linked to accounts)
    console.log('👤 Creating Contacts...');
    const contactsWithAccounts = CONTACTS.map((contact, i) => ({
      ...contact,
      AccountId: accountIds[i % accountIds.length], // Distribute contacts across accounts
    }));
    const contactResults = await conn.sobject('Contact').create(contactsWithAccounts);
    (contactResults as any[]).forEach((r: any, i: number) => {
      if (r.success) {
        console.log(`  ✓ ${CONTACTS[i].FirstName} ${CONTACTS[i].LastName}`);
      } else {
        console.log(`  ✗ ${CONTACTS[i].FirstName} ${CONTACTS[i].LastName}: ${r.errors?.[0]?.message}`);
      }
    });
    console.log('');

    // Seed Leads
    console.log('🎯 Creating Leads...');
    const leadResults = await conn.sobject('Lead').create(LEADS);
    (leadResults as any[]).forEach((r: any, i: number) => {
      if (r.success) {
        console.log(`  ✓ ${LEADS[i].FirstName} ${LEADS[i].LastName} (${LEADS[i].Company})`);
      } else {
        console.log(`  ✗ ${LEADS[i].FirstName} ${LEADS[i].LastName}: ${r.errors?.[0]?.message}`);
      }
    });
    console.log('');

    // Seed Opportunities (linked to accounts)
    console.log('💰 Creating Opportunities...');
    const oppsWithAccounts = OPPORTUNITIES.map((opp, i) => ({
      ...opp,
      AccountId: accountIds[i % accountIds.length],
    }));
    const oppResults = await conn.sobject('Opportunity').create(oppsWithAccounts);
    (oppResults as any[]).forEach((r: any, i: number) => {
      if (r.success) {
        console.log(`  ✓ ${OPPORTUNITIES[i].Name} ($${OPPORTUNITIES[i].Amount.toLocaleString()})`);
      } else {
        console.log(`  ✗ ${OPPORTUNITIES[i].Name}: ${r.errors?.[0]?.message}`);
      }
    });
    console.log('');

    // Summary
    console.log('═══════════════════════════════════════════');
    console.log('✅ Salesforce seeding complete!\n');
    console.log('Summary:');
    console.log(`  📊 Accounts: ${accountIds.filter(Boolean).length}`);
    console.log(`  👤 Contacts: ${(contactResults as any[]).filter((r: any) => r.success).length}`);
    console.log(`  🎯 Leads: ${(leadResults as any[]).filter((r: any) => r.success).length}`);
    console.log(`  💰 Opportunities: ${(oppResults as any[]).filter((r: any) => r.success).length}`);
    console.log('\nYou can now connect Datacendia to this Salesforce org!');

  } catch (error: any) {
    console.error('❌ Error:', error.message);
    if (error.message.includes('INVALID_LOGIN')) {
      console.log('\nTip: Make sure to append your security token to your password.');
      console.log('Password format: yourpassword + securitytoken');
    }
  }
}

// Run if called directly
seedSalesforce();
