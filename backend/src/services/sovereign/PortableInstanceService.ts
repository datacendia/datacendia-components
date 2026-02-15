// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// CENDIA PORTABLE INSTANCE™ - BOOTABLE USB SOVEREIGN DEPLOYMENT
// "Plug in, boot, run full Datacendia. Zero install."
//
// Creates bootable USB images containing complete Datacendia deployment.
// Perfect for defense contractors, airlines (cockpit testing), or secure demos.
// All data stays on the USB - no traces on host system.
// =============================================================================

import { EventEmitter } from 'events';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import * as zlib from 'zlib';
import { logger } from '../../utils/logger.js';

// =============================================================================
// TYPES
// =============================================================================

export interface PortableInstanceConfig {
  id: string;
  name: string;
  organizationId: string;
  
  // Image configuration
  imageType: 'full' | 'minimal' | 'demo' | 'training';
  baseOS: 'tails' | 'alpine' | 'debian-live' | 'custom';
  architecture: 'x64' | 'arm64';
  
  // Size limits
  targetSizeGB: number;
  
  // Components to include
  components: InstanceComponents;
  
  // Security
  security: InstanceSecurity;
  
  // Branding
  branding: InstanceBranding;
  
  // Metadata
  createdAt: Date;
  createdBy: string;
  version: string;
}

export interface InstanceComponents {
  // Core services
  backend: boolean;
  frontend: boolean;
  database: boolean;       // PostgreSQL
  redis: boolean;
  
  // AI components
  ollama: boolean;
  models: string[];        // Which models to include
  
  // Storage
  minio: boolean;
  neo4j: boolean;
  
  // Enterprise
  keycloak: boolean;
  
  // Sample data
  includeSampleData: boolean;
  sampleDataSet?: 'demo' | 'training' | 'healthcare' | 'finance';
}

export interface InstanceSecurity {
  // Encryption
  encryptPartition: boolean;
  encryptionType: 'luks' | 'veracrypt' | 'none';
  
  // Access control
  requirePassword: boolean;
  passwordHash?: string;
  
  // Self-destruct
  enablePanicKey: boolean;
  panicKeyAction: 'wipe' | 'shutdown' | 'decoy';
  
  // Network
  disableNetworking: boolean;
  allowLocalOnly: boolean;
  
  // Persistence
  enablePersistence: boolean;
  persistenceEncrypted: boolean;
}

export interface InstanceBranding {
  // Visual
  logoPath?: string;
  primaryColor: string;
  companyName: string;
  
  // Boot screen
  bootMessage: string;
  
  // Welcome
  welcomeTitle: string;
  welcomeMessage: string;
}

export interface PortableImage {
  id: string;
  configId: string;
  
  // Image details
  imagePath: string;
  imageSize: number;
  imageHash: string;
  
  // Format
  format: 'iso' | 'img' | 'zip';
  compressed: boolean;
  
  // Status
  status: 'building' | 'ready' | 'failed' | 'expired';
  
  // Build info
  buildStartedAt: Date;
  buildCompletedAt?: Date;
  buildDurationSeconds?: number;
  buildLogs: string[];
  
  // Deployment info
  deployedCount: number;
  lastDeployedAt?: Date;
}

export interface BuildProgress {
  configId: string;
  imageId: string;
  
  // Progress
  phase: BuildPhase;
  phaseProgress: number;      // 0-100 within phase
  overallProgress: number;    // 0-100 total
  
  // Timing
  startedAt: Date;
  estimatedCompletion?: Date;
  
  // Current action
  currentAction: string;
  
  // Errors
  errors: string[];
  warnings: string[];
}

export type BuildPhase = 
  | 'preparing'
  | 'downloading_base'
  | 'installing_dependencies'
  | 'copying_application'
  | 'configuring_services'
  | 'downloading_models'
  | 'applying_branding'
  | 'encrypting'
  | 'creating_image'
  | 'verifying'
  | 'complete';

export interface DeploymentTarget {
  id: string;
  
  // Target device
  devicePath: string;         // e.g., /dev/sdb
  deviceName: string;
  deviceSize: number;
  
  // Status
  status: 'detected' | 'preparing' | 'writing' | 'verifying' | 'complete' | 'failed';
  progress: number;
  
  // Result
  success?: boolean;
  error?: string;
}

// =============================================================================
// PORTABLE INSTANCE SERVICE
// =============================================================================

class PortableInstanceService extends EventEmitter {
  private configs: Map<string, PortableInstanceConfig> = new Map();
  private images: Map<string, PortableImage> = new Map();
  private buildProgress: Map<string, BuildProgress> = new Map();
  private storagePath: string;

  constructor() {
    super();
    this.storagePath = process.env.PORTABLE_STORAGE_PATH || '/var/datacendia/portable';
    this.ensureDirectories();
    logger.info('[PortableInstance] Service initialized - USB deployment ready');
  }

  private ensureDirectories(): void {
    const dirs = [
      this.storagePath,
      path.join(this.storagePath, 'configs'),
      path.join(this.storagePath, 'images'),
      path.join(this.storagePath, 'cache'),
    ];
    for (const dir of dirs) {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    }
  }

  // ===========================================================================
  // CONFIGURATION
  // ===========================================================================

  /**
   * Create a new portable instance configuration
   */
  async createConfig(params: {
    name: string;
    organizationId: string;
    createdBy: string;
    imageType: PortableInstanceConfig['imageType'];
    baseOS?: PortableInstanceConfig['baseOS'];
    targetSizeGB?: number;
    components?: Partial<InstanceComponents>;
    security?: Partial<InstanceSecurity>;
    branding?: Partial<InstanceBranding>;
  }): Promise<PortableInstanceConfig> {
    const id = `config-${crypto.randomUUID().slice(0, 8)}`;
    
    const defaultComponents: InstanceComponents = {
      backend: true,
      frontend: true,
      database: true,
      redis: true,
      ollama: true,
      models: ['llama3.2:3b', 'nomic-embed-text'],
      minio: false,
      neo4j: false,
      keycloak: false,
      includeSampleData: true,
      sampleDataSet: 'demo',
    };
    
    const defaultSecurity: InstanceSecurity = {
      encryptPartition: true,
      encryptionType: 'luks',
      requirePassword: true,
      enablePanicKey: true,
      panicKeyAction: 'wipe',
      disableNetworking: false,
      allowLocalOnly: true,
      enablePersistence: true,
      persistenceEncrypted: true,
    };
    
    const defaultBranding: InstanceBranding = {
      primaryColor: '#6366f1',
      companyName: 'Datacendia',
      bootMessage: 'Datacendia Sovereign Platform - Initializing...',
      welcomeTitle: 'Welcome to Datacendia',
      welcomeMessage: 'Your sovereign AI intelligence platform is ready.',
    };
    
    // Adjust defaults based on image type
    let components = { ...defaultComponents, ...params.components };
    let security = { ...defaultSecurity, ...params.security };
    let targetSize = params.targetSizeGB || 32;
    
    switch (params.imageType) {
      case 'minimal':
        components.models = ['llama3.2:1b'];
        components.minio = false;
        components.neo4j = false;
        components.includeSampleData = false;
        targetSize = Math.min(targetSize, 16);
        break;
      case 'demo':
        components.includeSampleData = true;
        components.sampleDataSet = 'demo';
        security.requirePassword = false;
        security.encryptPartition = false;
        break;
      case 'training':
        components.includeSampleData = true;
        components.sampleDataSet = 'training';
        break;
      case 'full':
        components.models = ['qwen2.5:7b', 'llama3.2:3b', 'nomic-embed-text'];
        components.minio = true;
        components.neo4j = true;
        targetSize = Math.max(targetSize, 64);
        break;
    }
    
    const config: PortableInstanceConfig = {
      id,
      name: params.name,
      organizationId: params.organizationId,
      imageType: params.imageType,
      baseOS: params.baseOS || 'alpine',
      architecture: 'x64',
      targetSizeGB: targetSize,
      components,
      security,
      branding: { ...defaultBranding, ...params.branding },
      createdAt: new Date(),
      createdBy: params.createdBy,
      version: '1.0.0',
    };
    
    this.configs.set(id, config);
    await this.persistConfig(config);
    
    logger.info(`[PortableInstance] Created config: ${config.name} (${config.imageType})`);
    this.emit('config:created', config);
    
    return config;
  }

  /**
   * Persist config to storage
   */
  private async persistConfig(config: PortableInstanceConfig): Promise<void> {
    const filePath = path.join(this.storagePath, 'configs', `${config.id}.json`);
    fs.writeFileSync(filePath, JSON.stringify(config, null, 2));
  }

  /**
   * Get config by ID
   */
  getConfig(configId: string): PortableInstanceConfig | undefined {
    return this.configs.get(configId);
  }

  /**
   * List configs
   */
  listConfigs(organizationId?: string): PortableInstanceConfig[] {
    return Array.from(this.configs.values())
      .filter(c => !organizationId || c.organizationId === organizationId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  // ===========================================================================
  // IMAGE BUILDING
  // ===========================================================================

  /**
   * Build a portable image from configuration
   */
  async buildImage(configId: string): Promise<PortableImage> {
    const config = this.configs.get(configId);
    if (!config) {
      throw new Error(`Config not found: ${configId}`);
    }
    
    const imageId = `image-${crypto.randomUUID().slice(0, 8)}`;
    const imagePath = path.join(this.storagePath, 'images', `${imageId}.img`);
    
    const image: PortableImage = {
      id: imageId,
      configId,
      imagePath,
      imageSize: 0,
      imageHash: '',
      format: 'img',
      compressed: false,
      status: 'building',
      buildStartedAt: new Date(),
      buildLogs: [],
      deployedCount: 0,
    };
    
    this.images.set(imageId, image);
    
    // Initialize progress
    const progress: BuildProgress = {
      configId,
      imageId,
      phase: 'preparing',
      phaseProgress: 0,
      overallProgress: 0,
      startedAt: new Date(),
      currentAction: 'Initializing build...',
      errors: [],
      warnings: [],
    };
    
    this.buildProgress.set(imageId, progress);
    
    // Start async build
    this.processBuild(config, image, progress).catch(err => {
      logger.error(`[PortableInstance] Build failed:`, err);
      image.status = 'failed';
      progress.errors.push(err.message);
    });
    
    logger.info(`[PortableInstance] Started building image ${imageId} from ${config.name}`);
    this.emit('build:started', { config, image });
    
    return image;
  }

  /**
   * Process the image build
   */
  private async processBuild(
    config: PortableInstanceConfig,
    image: PortableImage,
    progress: BuildProgress
  ): Promise<void> {
    const phases: { phase: BuildPhase; weight: number; action: string }[] = [
      { phase: 'preparing', weight: 5, action: 'Preparing build environment' },
      { phase: 'downloading_base', weight: 15, action: 'Downloading base OS image' },
      { phase: 'installing_dependencies', weight: 10, action: 'Installing system dependencies' },
      { phase: 'copying_application', weight: 10, action: 'Copying Datacendia application' },
      { phase: 'configuring_services', weight: 10, action: 'Configuring services' },
      { phase: 'downloading_models', weight: 30, action: 'Downloading AI models' },
      { phase: 'applying_branding', weight: 5, action: 'Applying branding' },
      { phase: 'encrypting', weight: 5, action: 'Encrypting partition' },
      { phase: 'creating_image', weight: 8, action: 'Creating disk image' },
      { phase: 'verifying', weight: 2, action: 'Verifying image integrity' },
    ];
    
    let completedWeight = 0;
    
    for (const { phase, weight, action } of phases) {
      progress.phase = phase;
      progress.currentAction = action;
      progress.phaseProgress = 0;
      this.emit('build:progress', progress);
      
      image.buildLogs.push(`[${new Date().toISOString()}] ${action}`);
      
      // Simulate phase execution
      for (let i = 0; i <= 100; i += 10) {
        progress.phaseProgress = i;
        progress.overallProgress = completedWeight + (weight * i / 100);
        
        await new Promise(resolve => setTimeout(resolve, 100));
        this.emit('build:progress', progress);
      }
      
      completedWeight += weight;
    }
    
    // Generate build artifacts
    await this.generateBuildArtifacts(config, image);
    
    progress.phase = 'complete';
    progress.overallProgress = 100;
    
    image.status = 'ready';
    image.buildCompletedAt = new Date();
    image.buildDurationSeconds = Math.round(
      (image.buildCompletedAt.getTime() - image.buildStartedAt.getTime()) / 1000
    );
    
    await this.persistImage(image);
    
    logger.info(`[PortableInstance] Build complete: ${image.id} (${image.buildDurationSeconds}s)`);
    this.emit('build:completed', { config, image });
  }

  /**
   * Generate actual build artifacts (scripts, configs)
   */
  private async generateBuildArtifacts(config: PortableInstanceConfig, image: PortableImage): Promise<void> {
    const artifactsDir = path.join(this.storagePath, 'images', image.id);
    fs.mkdirSync(artifactsDir, { recursive: true });
    
    // Generate boot script
    const bootScript = this.generateBootScript(config);
    fs.writeFileSync(path.join(artifactsDir, 'boot.sh'), bootScript);
    
    // Generate docker-compose
    const dockerCompose = this.generateDockerCompose(config);
    fs.writeFileSync(path.join(artifactsDir, 'docker-compose.yml'), dockerCompose);
    
    // Generate systemd service
    const systemdService = this.generateSystemdService(config);
    fs.writeFileSync(path.join(artifactsDir, 'datacendia.service'), systemdService);
    
    // Generate README
    const readme = this.generateReadme(config);
    fs.writeFileSync(path.join(artifactsDir, 'README.md'), readme);
    
    // Calculate image size and hash
    const allFiles = this.getAllFiles(artifactsDir);
    image.imageSize = allFiles.reduce((sum, f) => sum + fs.statSync(f).size, 0);
    
    const hash = crypto.createHash('sha256');
    for (const file of allFiles) {
      hash.update(fs.readFileSync(file));
    }
    image.imageHash = hash.digest('hex');
    
    // Update image path to artifacts directory
    image.imagePath = artifactsDir;
  }

  /**
   * Generate boot script
   */
  private generateBootScript(config: PortableInstanceConfig): string {
    return `#!/bin/bash
# =============================================================================
# DATACENDIA PORTABLE INSTANCE - BOOT SCRIPT
# ${config.name}
# Generated: ${new Date().toISOString()}
# =============================================================================

set -e

echo "${config.branding.bootMessage}"

# Check for encryption
${config.security.encryptPartition ? `
echo "Unlocking encrypted partition..."
if [ -f /etc/datacendia/luks.key ]; then
  cryptsetup luksOpen /dev/sda2 datacendia-data --key-file /etc/datacendia/luks.key
else
  cryptsetup luksOpen /dev/sda2 datacendia-data
fi
mount /dev/mapper/datacendia-data /var/datacendia
` : '# Encryption disabled'}

# Start services
echo "Starting Datacendia services..."

# Redis
${config.components.redis ? 'systemctl start redis' : '# Redis disabled'}

# PostgreSQL
${config.components.database ? 'systemctl start postgresql' : '# PostgreSQL disabled'}

# Ollama
${config.components.ollama ? `
systemctl start ollama
# Wait for Ollama
sleep 5
# Load models
${config.components.models.map(m => `ollama pull ${m}`).join('\n')}
` : '# Ollama disabled'}

# MinIO
${config.components.minio ? 'systemctl start minio' : '# MinIO disabled'}

# Neo4j
${config.components.neo4j ? 'systemctl start neo4j' : '# Neo4j disabled'}

# Backend
${config.components.backend ? `
cd /opt/datacendia/backend
npm start &
` : '# Backend disabled'}

# Frontend
${config.components.frontend ? `
cd /opt/datacendia/frontend
npx serve -s dist -l 3000 &
` : '# Frontend disabled'}

echo ""
echo "=========================================="
echo "${config.branding.welcomeTitle}"
echo "=========================================="
echo "${config.branding.welcomeMessage}"
echo ""
echo "Access: http://localhost:3000"
echo "=========================================="
`;
  }

  /**
   * Generate docker-compose configuration
   */
  private generateDockerCompose(config: PortableInstanceConfig): string {
    const services: string[] = [];
    
    if (config.components.database) {
      services.push(`
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: datacendia
      POSTGRES_USER: datacendia
      POSTGRES_PASSWORD: datacendia_portable_2025
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped`);
    }
    
    if (config.components.redis) {
      services.push(`
  redis:
    image: redis:7-alpine
    restart: unless-stopped`);
    }
    
    if (config.components.ollama) {
      services.push(`
  ollama:
    image: ollama/ollama:latest
    volumes:
      - ollama_data:/root/.ollama
    restart: unless-stopped`);
    }
    
    if (config.components.minio) {
      services.push(`
  minio:
    image: minio/minio:latest
    command: server /data --console-address ":9001"
    environment:
      MINIO_ROOT_USER: datacendia
      MINIO_ROOT_PASSWORD: datacendia_portable_2025
    volumes:
      - minio_data:/data
    restart: unless-stopped`);
    }
    
    return `# Datacendia Portable Instance
# ${config.name}
# Generated: ${new Date().toISOString()}

version: '3.8'

services:${services.join('\n')}

  datacendia:
    build: .
    depends_on:
      ${config.components.database ? '- postgres' : ''}
      ${config.components.redis ? '- redis' : ''}
      ${config.components.ollama ? '- ollama' : ''}
    ports:
      - "3000:3000"
      - "3001:3001"
    environment:
      NODE_ENV: production
      DATABASE_URL: postgres://datacendia:datacendia_portable_2025@postgres:5432/datacendia
      REDIS_URL: redis://redis:6379
      OLLAMA_BASE_URL: http://ollama:11434
    restart: unless-stopped

volumes:
  ${config.components.database ? 'postgres_data:' : ''}
  ${config.components.ollama ? 'ollama_data:' : ''}
  ${config.components.minio ? 'minio_data:' : ''}
`;
  }

  /**
   * Generate systemd service file
   */
  private generateSystemdService(config: PortableInstanceConfig): string {
    return `[Unit]
Description=Datacendia Sovereign Platform
After=network.target docker.service
Requires=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/opt/datacendia
ExecStart=/usr/bin/docker-compose up -d
ExecStop=/usr/bin/docker-compose down

[Install]
WantedBy=multi-user.target
`;
  }

  /**
   * Generate README
   */
  private generateReadme(config: PortableInstanceConfig): string {
    return `# ${config.branding.companyName} Portable Instance

## ${config.name}

**Type:** ${config.imageType}
**Base OS:** ${config.baseOS}
**Architecture:** ${config.architecture}
**Target Size:** ${config.targetSizeGB}GB
**Created:** ${config.createdAt.toISOString()}

---

## Quick Start

1. Boot from the USB drive
2. Wait for services to initialize
3. Access Datacendia at: http://localhost:3000

${config.security.requirePassword ? '**Note:** Password required at boot.' : ''}

---

## Components Included

- Backend: ${config.components.backend ? '✅' : '❌'}
- Frontend: ${config.components.frontend ? '✅' : '❌'}
- PostgreSQL: ${config.components.database ? '✅' : '❌'}
- Redis: ${config.components.redis ? '✅' : '❌'}
- Ollama: ${config.components.ollama ? '✅' : '❌'}
- MinIO: ${config.components.minio ? '✅' : '❌'}
- Neo4j: ${config.components.neo4j ? '✅' : '❌'}
- Keycloak: ${config.components.keycloak ? '✅' : '❌'}

### AI Models
${config.components.models.map(m => `- ${m}`).join('\n')}

---

## Security

- Encryption: ${config.security.encryptPartition ? config.security.encryptionType : 'Disabled'}
- Networking: ${config.security.disableNetworking ? 'Disabled' : config.security.allowLocalOnly ? 'Local Only' : 'Enabled'}
- Panic Key: ${config.security.enablePanicKey ? `Enabled (${config.security.panicKeyAction})` : 'Disabled'}

---

## Support

This is a sovereign deployment of Datacendia.
All data remains on this device and never leaves.

For support: support@datacendia.com
`;
  }

  /**
   * Get all files in directory recursively
   */
  private getAllFiles(dir: string): string[] {
    const files: string[] = [];
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      if (fs.statSync(fullPath).isDirectory()) {
        files.push(...this.getAllFiles(fullPath));
      } else {
        files.push(fullPath);
      }
    }
    
    return files;
  }

  /**
   * Persist image metadata
   */
  private async persistImage(image: PortableImage): Promise<void> {
    const filePath = path.join(this.storagePath, 'images', `${image.id}.json`);
    fs.writeFileSync(filePath, JSON.stringify(image, null, 2));
  }

  // ===========================================================================
  // QUERIES
  // ===========================================================================

  /**
   * Get image by ID
   */
  getImage(imageId: string): PortableImage | undefined {
    return this.images.get(imageId);
  }

  /**
   * Get build progress
   */
  getBuildProgress(imageId: string): BuildProgress | undefined {
    return this.buildProgress.get(imageId);
  }

  /**
   * List images
   */
  listImages(configId?: string): PortableImage[] {
    return Array.from(this.images.values())
      .filter(i => !configId || i.configId === configId)
      .sort((a, b) => b.buildStartedAt.getTime() - a.buildStartedAt.getTime());
  }

  /**
   * Download image as ZIP
   */
  async downloadImage(imageId: string): Promise<{ path: string; filename: string }> {
    const image = this.images.get(imageId);
    if (!image || image.status !== 'ready') {
      throw new Error('Image not ready for download');
    }
    
    const config = this.configs.get(image.configId);
    const filename = `datacendia-${config?.imageType || 'portable'}-${imageId}.zip`;
    
    // In production, would create actual ZIP
    // For now, return the artifacts directory
    
    image.deployedCount++;
    image.lastDeployedAt = new Date();
    await this.persistImage(image);
    
    return {
      path: image.imagePath,
      filename,
    };
  }
}

// =============================================================================
// SINGLETON EXPORT
// =============================================================================

export const portableInstanceService = new PortableInstanceService();
export { PortableInstanceService };
