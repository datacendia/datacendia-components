#!/usr/bin/env tsx
// =============================================================================
// DATACENDIA BACKEND SETUP SCRIPT
// Automated setup for database, migrations, and seeding
// =============================================================================

/// <reference types="node" />

import { execSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import path from 'path';

const BACKEND_DIR = path.resolve(__dirname, '..');

console.log('🚀 Datacendia Backend Setup');
console.log('='.repeat(50));
console.log('');

// Utility to run commands
function run(cmd: string, options?: { cwd?: string; ignoreError?: boolean }) {
  console.log(`  ▶ ${cmd}`);
  try {
    execSync(cmd, {
      cwd: options?.cwd || BACKEND_DIR,
      stdio: 'inherit',
    });
    return true;
  } catch (error) {
    if (!options?.ignoreError) {
      console.error(`  ✗ Command failed: ${cmd}`);
      throw error;
    }
    return false;
  }
}

async function checkDependencies() {
  console.log('📦 Step 1: Checking dependencies...');
  
  // Check if node_modules exists
  const nodeModulesPath = path.join(BACKEND_DIR, 'node_modules');
  if (!existsSync(nodeModulesPath)) {
    console.log('  Installing npm dependencies...');
    run('npm install');
  } else {
    console.log('  ✓ Dependencies already installed');
  }
  console.log('');
}

async function checkEnvFile() {
  console.log('🔧 Step 2: Checking environment configuration...');
  
  const envPath = path.join(BACKEND_DIR, '.env');
  const envExamplePath = path.join(BACKEND_DIR, '.env.example');
  
  if (!existsSync(envPath)) {
    if (existsSync(envExamplePath)) {
      console.log('  Creating .env from .env.example...');
      const envContent = readFileSync(envExamplePath, 'utf-8');
      require('fs').writeFileSync(envPath, envContent);
      console.log('  ✓ .env file created');
      console.log('  ⚠ Please update .env with your actual configuration');
    } else {
      console.error('  ✗ No .env or .env.example found');
      process.exit(1);
    }
  } else {
    console.log('  ✓ .env file exists');
  }
  console.log('');
}

async function generatePrismaClient() {
  console.log('🔄 Step 3: Generating Prisma client...');
  run('npx prisma generate');
  console.log('  ✓ Prisma client generated');
  console.log('');
}

async function runMigrations() {
  console.log('📊 Step 4: Running database migrations...');
  
  try {
    // Try to run migrations
    run('npx prisma migrate deploy');
    console.log('  ✓ Migrations applied');
  } catch {
    console.log('  Database not initialized, running first migration...');
    try {
      run('npx prisma migrate dev --name init');
      console.log('  ✓ Initial migration created and applied');
    } catch (error) {
      console.error('  ✗ Migration failed. Check your DATABASE_URL in .env');
      console.error('  Make sure PostgreSQL is running and the database exists.');
      throw error;
    }
  }
  console.log('');
}

async function seedDatabase() {
  console.log('🌱 Step 5: Seeding database...');
  
  try {
    run('npx tsx prisma/seed.ts');
    console.log('  ✓ Database seeded successfully');
  } catch (error) {
    console.error('  ✗ Seeding failed');
    throw error;
  }
  console.log('');
}

async function checkServices() {
  console.log('🔍 Step 6: Checking required services...');
  
  const services = [
    { name: 'PostgreSQL', port: 5433, required: true },
    { name: 'Redis', port: 6379, required: true },
    { name: 'Neo4j', port: 7687, required: false },
    { name: 'Ollama', port: 11434, required: false },
  ];
  
  for (const service of services) {
    try {
      const net = require('net');
      await new Promise<void>((resolve, reject) => {
        const socket = new net.Socket();
        socket.setTimeout(1000);
        socket.on('connect', () => {
          socket.destroy();
          console.log(`  ✓ ${service.name} is running on port ${service.port}`);
          resolve();
        });
        socket.on('timeout', () => {
          socket.destroy();
          if (service.required) {
            console.error(`  ✗ ${service.name} is not running (port ${service.port})`);
            reject(new Error(`${service.name} not running`));
          } else {
            console.log(`  ⚠ ${service.name} is not running (optional)`);
            resolve();
          }
        });
        socket.on('error', () => {
          socket.destroy();
          if (service.required) {
            console.error(`  ✗ ${service.name} is not running (port ${service.port})`);
            reject(new Error(`${service.name} not running`));
          } else {
            console.log(`  ⚠ ${service.name} is not running (optional)`);
            resolve();
          }
        });
        socket.connect(service.port, 'localhost');
      });
    } catch {
      if (service.required) {
        console.error(`\n❌ Required service ${service.name} is not running.`);
        console.error(`   Please start ${service.name} and try again.`);
        process.exit(1);
      }
    }
  }
  console.log('');
}

async function main() {
  try {
    await checkDependencies();
    await checkEnvFile();
    await checkServices();
    await generatePrismaClient();
    await runMigrations();
    await seedDatabase();
    
    console.log('='.repeat(50));
    console.log('✅ Setup completed successfully!');
    console.log('');
    console.log('📋 Next steps:');
    console.log('   1. Start the backend: npm run dev');
    console.log('   2. Start the frontend: cd .. && npm run dev');
    console.log('   3. Open http://localhost:5173');
    console.log('');
    console.log('📋 Default Admin Credentials:');
    console.log('   Email: admin@datacendia.com');
    console.log('   Password: DatacendiaAdmin2024!');
    console.log('');
  } catch (error) {
    console.error('\n❌ Setup failed:');
    console.error(error);
    process.exit(1);
  }
}

main();
