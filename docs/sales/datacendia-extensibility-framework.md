# 🧩 Datacendia Platform Extensibility Framework

**Add Pages. Build Components. Create Services. Ship Fast.**

The complete guide to extending the Datacendia platform.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    EXTENSIBILITY ARCHITECTURE                           │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                        APPLICATION LAYER                         │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐            │  │
│  │  │  Pages   │ │Components│ │ Layouts  │ │  Hooks   │            │  │
│  │  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘            │  │
│  └───────┼────────────┼────────────┼────────────┼───────────────────┘  │
│          │            │            │            │                       │
│          ▼            ▼            ▼            ▼                       │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                        FEATURE MODULES                           │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐            │  │
│  │  │ Council  │ │ Decision │ │Analytics │ │  Admin   │            │  │
│  │  │ Module   │ │  Module  │ │  Module  │ │  Module  │            │  │
│  │  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘            │  │
│  └───────┼────────────┼────────────┼────────────┼───────────────────┘  │
│          │            │            │            │                       │
│          ▼            ▼            ▼            ▼                       │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                        SERVICE LAYER                             │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐            │  │
│  │  │  Agent   │ │ Decision │ │   Auth   │ │   API    │            │  │
│  │  │ Service  │ │ Service  │ │ Service  │ │ Gateway  │            │  │
│  │  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘            │  │
│  └───────┼────────────┼────────────┼────────────┼───────────────────┘  │
│          │            │            │            │                       │
│          ▼            ▼            ▼            ▼                       │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                        CORE PLATFORM                             │  │
│  │        Plugin System │ Event Bus │ Config │ Registry             │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Project Structure

```
datacendia/
├── apps/
│   ├── web/                    # Main web application
│   │   ├── pages/              # Page components (auto-routed)
│   │   ├── components/         # Shared components
│   │   ├── layouts/            # Page layouts
│   │   ├── hooks/              # Custom React hooks
│   │   └── styles/             # Global styles
│   │
│   ├── api/                    # API server
│   │   ├── routes/             # API routes
│   │   ├── controllers/        # Route handlers
│   │   ├── middleware/         # Express middleware
│   │   └── services/           # Business logic
│   │
│   └── admin/                  # Admin dashboard
│
├── packages/                   # Shared packages
│   ├── core/                   # Core utilities
│   ├── agents/                 # Agent system
│   ├── connectors/             # Integration connectors
│   ├── ui/                     # UI component library
│   ├── analytics/              # Analytics package
│   └── types/                  # Shared TypeScript types
│
├── modules/                    # Feature modules
│   ├── council/                # Council deliberation
│   ├── decisions/              # Decision tracking
│   ├── analytics/              # Analytics & reporting
│   ├── integrations/           # Third-party integrations
│   └── admin/                  # Administration
│
├── plugins/                    # Plugin system
│   ├── official/               # Official plugins
│   └── community/              # Community plugins
│
└── config/                     # Configuration
    ├── features.yaml           # Feature flags
    ├── routes.yaml             # Route configuration
    └── services.yaml           # Service configuration
```

---

# Part 1: Adding New Pages

## File-Based Routing

Pages are automatically routed based on file structure:

```
apps/web/pages/
├── index.tsx                   → /
├── council/
│   ├── index.tsx              → /council
│   ├── new.tsx                → /council/new
│   └── [id].tsx               → /council/:id
├── decisions/
│   ├── index.tsx              → /decisions
│   └── [id]/
│       ├── index.tsx          → /decisions/:id
│       └── edit.tsx           → /decisions/:id/edit
├── analytics/
│   └── index.tsx              → /analytics
└── settings/
    ├── index.tsx              → /settings
    └── [...slug].tsx          → /settings/* (catch-all)
```

## Page Template

```typescript
// apps/web/pages/my-new-page/index.tsx

import { NextPage, GetServerSideProps } from 'next';
import { PageLayout } from '@/layouts/PageLayout';
import { PageHeader } from '@/components/PageHeader';
import { withAuth } from '@/middleware/withAuth';
import { useMyNewPageData } from './hooks/useMyNewPageData';

interface MyNewPageProps {
  initialData: any;
}

const MyNewPage: NextPage<MyNewPageProps> = ({ initialData }) => {
  const { data, loading, error, actions } = useMyNewPageData(initialData);

  return (
    <PageLayout
      title="My New Page"
      description="Description for SEO and accessibility"
    >
      <PageHeader
        title="My New Page"
        subtitle="Optional subtitle"
        actions={[
          { label: 'Primary Action', onClick: actions.primary, variant: 'primary' },
          { label: 'Secondary', onClick: actions.secondary }
        ]}
      />

      <main className="page-content">
        {loading && <LoadingState />}
        {error && <ErrorState error={error} onRetry={actions.retry} />}
        {data && <MyPageContent data={data} />}
      </main>
    </PageLayout>
  );
};

// Server-side data fetching
export const getServerSideProps: GetServerSideProps = withAuth(async (ctx) => {
  const { req, params, query } = ctx;
  
  // Fetch initial data
  const initialData = await fetchMyPageData({
    userId: req.user.id,
    // ...other params
  });

  return {
    props: {
      initialData
    }
  };
});

export default MyNewPage;
```

## Page Registration (Optional Advanced)

For programmatic page registration:

```typescript
// config/routes.yaml

routes:
  - path: /my-new-page
    component: pages/my-new-page
    name: My New Page
    icon: 📄
    
    # Access control
    auth: required
    permissions: ['view:my-page']
    
    # Navigation
    navigation:
      show: true
      section: main  # main, settings, admin
      order: 5
    
    # Page metadata
    meta:
      title: My New Page | Datacendia
      description: Page description for SEO
    
    # Feature flags
    features:
      - my-new-feature
```

## Page Generator CLI

```bash
# Generate a new page with boilerplate
npx datacendia generate page my-new-page

# With options
npx datacendia generate page my-new-page \
  --layout dashboard \
  --auth required \
  --with-api \
  --with-hooks

# Output:
# ✓ Created apps/web/pages/my-new-page/index.tsx
# ✓ Created apps/web/pages/my-new-page/hooks/useMyNewPageData.ts
# ✓ Created apps/web/pages/my-new-page/components/
# ✓ Created apps/api/routes/my-new-page.ts
# ✓ Updated config/routes.yaml
```

---

# Part 2: Adding New Components

## Component Structure

```
packages/ui/src/components/
├── Button/
│   ├── Button.tsx              # Main component
│   ├── Button.stories.tsx      # Storybook stories
│   ├── Button.test.tsx         # Unit tests
│   ├── Button.styles.ts        # Styled components / CSS
│   ├── Button.types.ts         # TypeScript types
│   └── index.ts                # Public exports
│
├── Card/
│   └── ...
│
└── index.ts                    # Package exports
```

## Component Template

```typescript
// packages/ui/src/components/MyComponent/MyComponent.tsx

import React, { forwardRef } from 'react';
import { cn } from '@/utils/cn';
import { MyComponentProps } from './MyComponent.types';
import { myComponentStyles } from './MyComponent.styles';

export const MyComponent = forwardRef<HTMLDivElement, MyComponentProps>(
  ({ 
    children, 
    variant = 'default',
    size = 'md',
    className,
    disabled = false,
    ...props 
  }, ref) => {
    const styles = myComponentStyles({ variant, size, disabled });
    
    return (
      <div
        ref={ref}
        className={cn(styles.root, className)}
        data-variant={variant}
        data-size={size}
        aria-disabled={disabled}
        {...props}
      >
        {children}
      </div>
    );
  }
);

MyComponent.displayName = 'MyComponent';
```

```typescript
// packages/ui/src/components/MyComponent/MyComponent.types.ts

export interface MyComponentProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Visual variant of the component */
  variant?: 'default' | 'primary' | 'secondary' | 'ghost';
  
  /** Size of the component */
  size?: 'sm' | 'md' | 'lg';
  
  /** Whether the component is disabled */
  disabled?: boolean;
  
  /** Content to render inside */
  children: React.ReactNode;
}
```

```typescript
// packages/ui/src/components/MyComponent/MyComponent.styles.ts

import { cva, type VariantProps } from 'class-variance-authority';

export const myComponentStyles = cva(
  // Base styles
  'rounded-lg transition-all duration-200',
  {
    variants: {
      variant: {
        default: 'bg-gray-100 text-gray-900',
        primary: 'bg-blue-500 text-white',
        secondary: 'bg-gray-200 text-gray-800',
        ghost: 'bg-transparent hover:bg-gray-100'
      },
      size: {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg'
      },
      disabled: {
        true: 'opacity-50 cursor-not-allowed',
        false: 'cursor-pointer'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      disabled: false
    }
  }
);

export type MyComponentStyleProps = VariantProps<typeof myComponentStyles>;
```

```typescript
// packages/ui/src/components/MyComponent/MyComponent.stories.tsx

import type { Meta, StoryObj } from '@storybook/react';
import { MyComponent } from './MyComponent';

const meta: Meta<typeof MyComponent> = {
  title: 'Components/MyComponent',
  component: MyComponent,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'primary', 'secondary', 'ghost']
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg']
    }
  }
};

export default meta;
type Story = StoryObj<typeof MyComponent>;

export const Default: Story = {
  args: {
    children: 'Default Component',
    variant: 'default'
  }
};

export const Primary: Story = {
  args: {
    children: 'Primary Component',
    variant: 'primary'
  }
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex gap-4">
      <MyComponent variant="default">Default</MyComponent>
      <MyComponent variant="primary">Primary</MyComponent>
      <MyComponent variant="secondary">Secondary</MyComponent>
      <MyComponent variant="ghost">Ghost</MyComponent>
    </div>
  )
};
```

```typescript
// packages/ui/src/components/MyComponent/index.ts

export { MyComponent } from './MyComponent';
export type { MyComponentProps } from './MyComponent.types';
```

## Component Generator CLI

```bash
# Generate a new component
npx datacendia generate component MyComponent

# With options
npx datacendia generate component MyComponent \
  --package ui \
  --with-stories \
  --with-tests \
  --with-styles

# Output:
# ✓ Created packages/ui/src/components/MyComponent/MyComponent.tsx
# ✓ Created packages/ui/src/components/MyComponent/MyComponent.types.ts
# ✓ Created packages/ui/src/components/MyComponent/MyComponent.styles.ts
# ✓ Created packages/ui/src/components/MyComponent/MyComponent.stories.tsx
# ✓ Created packages/ui/src/components/MyComponent/MyComponent.test.tsx
# ✓ Created packages/ui/src/components/MyComponent/index.ts
# ✓ Updated packages/ui/src/components/index.ts
```

---

# Part 3: Adding New Services

## Service Structure

```
packages/core/src/services/
├── base/
│   ├── BaseService.ts          # Abstract base class
│   ├── ServiceRegistry.ts      # Service registration
│   └── ServiceContainer.ts     # Dependency injection
│
├── my-service/
│   ├── MyService.ts            # Service implementation
│   ├── MyService.types.ts      # Types and interfaces
│   ├── MyService.test.ts       # Unit tests
│   └── index.ts                # Exports
│
└── index.ts                    # Package exports
```

## Base Service Interface

```typescript
// packages/core/src/services/base/BaseService.ts

export interface ServiceConfig {
  name: string;
  version: string;
  dependencies?: string[];
  config?: Record<string, any>;
}

export interface ServiceHealth {
  status: 'healthy' | 'degraded' | 'unhealthy';
  latency?: number;
  details?: Record<string, any>;
}

export abstract class BaseService {
  protected config: ServiceConfig;
  protected logger: Logger;
  protected metrics: MetricsClient;
  protected events: EventEmitter;
  
  constructor(config: ServiceConfig) {
    this.config = config;
    this.logger = new Logger(config.name);
    this.metrics = new MetricsClient(config.name);
    this.events = new EventEmitter();
  }
  
  // Lifecycle
  abstract initialize(): Promise<void>;
  abstract shutdown(): Promise<void>;
  
  // Health
  abstract healthCheck(): Promise<ServiceHealth>;
  
  // Events
  on(event: string, handler: Function): void {
    this.events.on(event, handler);
  }
  
  emit(event: string, data: any): void {
    this.events.emit(event, data);
  }
  
  // Metrics
  protected recordMetric(name: string, value: number, tags?: Record<string, string>): void {
    this.metrics.record(name, value, tags);
  }
}
```

## Service Template

```typescript
// packages/core/src/services/my-service/MyService.ts

import { BaseService, ServiceConfig, ServiceHealth } from '../base/BaseService';
import { MyServiceConfig, MyServiceInput, MyServiceOutput } from './MyService.types';

export class MyService extends BaseService {
  private client: SomeClient;
  private cache: CacheClient;
  
  constructor(config: MyServiceConfig) {
    super({
      name: 'my-service',
      version: '1.0.0',
      dependencies: ['database', 'cache']
    });
    
    this.config = { ...this.config, ...config };
  }
  
  async initialize(): Promise<void> {
    this.logger.info('Initializing MyService...');
    
    // Initialize dependencies
    this.client = await this.createClient();
    this.cache = await this.createCache();
    
    // Register event handlers
    this.setupEventHandlers();
    
    this.logger.info('MyService initialized');
    this.emit('initialized');
  }
  
  async shutdown(): Promise<void> {
    this.logger.info('Shutting down MyService...');
    
    await this.client?.close();
    await this.cache?.close();
    
    this.emit('shutdown');
  }
  
  async healthCheck(): Promise<ServiceHealth> {
    try {
      const start = Date.now();
      await this.client.ping();
      
      return {
        status: 'healthy',
        latency: Date.now() - start,
        details: {
          connections: this.client.connectionCount,
          cacheHitRate: await this.cache.getHitRate()
        }
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        details: { error: error.message }
      };
    }
  }
  
  // Public methods
  async process(input: MyServiceInput): Promise<MyServiceOutput> {
    const startTime = Date.now();
    
    try {
      // Check cache
      const cached = await this.cache.get(input.id);
      if (cached) {
        this.recordMetric('cache_hit', 1);
        return cached;
      }
      
      // Process
      const result = await this.processInternal(input);
      
      // Cache result
      await this.cache.set(input.id, result, { ttl: 3600 });
      
      // Record metrics
      this.recordMetric('process_duration', Date.now() - startTime);
      this.recordMetric('process_success', 1);
      
      return result;
    } catch (error) {
      this.recordMetric('process_error', 1);
      this.logger.error('Process failed', { error, input });
      throw error;
    }
  }
  
  // Private methods
  private async processInternal(input: MyServiceInput): Promise<MyServiceOutput> {
    // Implementation
    return { /* result */ };
  }
  
  private setupEventHandlers(): void {
    this.on('config_updated', this.handleConfigUpdate.bind(this));
  }
  
  private handleConfigUpdate(newConfig: any): void {
    // Handle config updates
  }
}
```

```typescript
// packages/core/src/services/my-service/MyService.types.ts

export interface MyServiceConfig {
  endpoint: string;
  apiKey: string;
  timeout?: number;
  retries?: number;
  cacheEnabled?: boolean;
}

export interface MyServiceInput {
  id: string;
  data: Record<string, any>;
  options?: {
    priority?: 'low' | 'normal' | 'high';
    skipCache?: boolean;
  };
}

export interface MyServiceOutput {
  id: string;
  result: any;
  metadata: {
    processedAt: Date;
    duration: number;
    cached: boolean;
  };
}
```

## Service Registration

```typescript
// packages/core/src/services/base/ServiceRegistry.ts

class ServiceRegistry {
  private static instance: ServiceRegistry;
  private services: Map<string, BaseService> = new Map();
  private initializing: Set<string> = new Set();
  
  static getInstance(): ServiceRegistry {
    if (!ServiceRegistry.instance) {
      ServiceRegistry.instance = new ServiceRegistry();
    }
    return ServiceRegistry.instance;
  }
  
  async register<T extends BaseService>(
    name: string, 
    ServiceClass: new (config: any) => T,
    config: any
  ): Promise<T> {
    if (this.services.has(name)) {
      return this.services.get(name) as T;
    }
    
    if (this.initializing.has(name)) {
      throw new Error(`Circular dependency detected: ${name}`);
    }
    
    this.initializing.add(name);
    
    const service = new ServiceClass(config);
    await service.initialize();
    
    this.services.set(name, service);
    this.initializing.delete(name);
    
    console.log(`Service registered: ${name}`);
    
    return service;
  }
  
  get<T extends BaseService>(name: string): T {
    const service = this.services.get(name);
    if (!service) {
      throw new Error(`Service not found: ${name}`);
    }
    return service as T;
  }
  
  async healthCheckAll(): Promise<Record<string, ServiceHealth>> {
    const results: Record<string, ServiceHealth> = {};
    
    for (const [name, service] of this.services) {
      results[name] = await service.healthCheck();
    }
    
    return results;
  }
  
  async shutdownAll(): Promise<void> {
    for (const [name, service] of this.services) {
      console.log(`Shutting down service: ${name}`);
      await service.shutdown();
    }
    this.services.clear();
  }
}

export const serviceRegistry = ServiceRegistry.getInstance();
```

## Service Generator CLI

```bash
# Generate a new service
npx datacendia generate service MyService

# With options
npx datacendia generate service MyService \
  --package core \
  --with-cache \
  --with-queue \
  --with-tests

# Output:
# ✓ Created packages/core/src/services/my-service/MyService.ts
# ✓ Created packages/core/src/services/my-service/MyService.types.ts
# ✓ Created packages/core/src/services/my-service/MyService.test.ts
# ✓ Created packages/core/src/services/my-service/index.ts
# ✓ Updated packages/core/src/services/index.ts
```

---

# Part 4: Adding New Packages

## Package Structure

```
packages/my-package/
├── src/
│   ├── index.ts                # Main exports
│   ├── types.ts                # TypeScript types
│   └── ...                     # Package code
├── tests/
│   └── ...                     # Test files
├── package.json                # Package manifest
├── tsconfig.json               # TypeScript config
├── README.md                   # Documentation
└── CHANGELOG.md                # Version history
```

## Package Template

```json
// packages/my-package/package.json

{
  "name": "@datacendia/my-package",
  "version": "1.0.0",
  "description": "Description of my package",
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.js",
      "types": "./dist/index.d.ts"
    },
    "./submodule": {
      "import": "./dist/submodule/index.mjs",
      "require": "./dist/submodule/index.js",
      "types": "./dist/submodule/index.d.ts"
    }
  },
  "files": [
    "dist"
  ],
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch",
    "test": "vitest",
    "test:coverage": "vitest --coverage",
    "lint": "eslint src/",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@datacendia/core": "workspace:*"
  },
  "devDependencies": {
    "@datacendia/tsconfig": "workspace:*",
    "tsup": "^8.0.0",
    "typescript": "^5.0.0",
    "vitest": "^1.0.0"
  },
  "peerDependencies": {
    "react": "^18.0.0"
  },
  "publishConfig": {
    "access": "public"
  }
}
```

```typescript
// packages/my-package/tsconfig.json

{
  "extends": "@datacendia/tsconfig/base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "tests"]
}
```

```typescript
// packages/my-package/tsup.config.ts

import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: true,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom']
});
```

```typescript
// packages/my-package/src/index.ts

// Types
export * from './types';

// Main exports
export { MyMainClass } from './MyMainClass';
export { myUtilityFunction } from './utils';

// Hooks (if React)
export { useMyHook } from './hooks/useMyHook';

// Components (if React)
export { MyComponent } from './components/MyComponent';
```

## Package Generator CLI

```bash
# Generate a new package
npx datacendia generate package my-package

# With options
npx datacendia generate package my-package \
  --type library \
  --with-react \
  --with-tests

# Or for different package types
npx datacendia generate package my-package --type service
npx datacendia generate package my-package --type ui
npx datacendia generate package my-package --type connector

# Output:
# ✓ Created packages/my-package/package.json
# ✓ Created packages/my-package/tsconfig.json
# ✓ Created packages/my-package/tsup.config.ts
# ✓ Created packages/my-package/src/index.ts
# ✓ Created packages/my-package/src/types.ts
# ✓ Created packages/my-package/tests/index.test.ts
# ✓ Created packages/my-package/README.md
# ✓ Updated pnpm-workspace.yaml
```

---

# Part 5: Module System

## Feature Module Structure

```
modules/my-module/
├── index.ts                    # Module registration
├── config.yaml                 # Module configuration
├── routes/                     # API routes
│   └── index.ts
├── services/                   # Module services
│   └── index.ts
├── components/                 # React components
│   └── index.ts
├── hooks/                      # React hooks
│   └── index.ts
├── stores/                     # State management
│   └── index.ts
├── types/                      # TypeScript types
│   └── index.ts
└── tests/                      # Module tests
    └── index.test.ts
```

## Module Registration

```typescript
// modules/my-module/index.ts

import { ModuleDefinition } from '@datacendia/core';

export const myModule: ModuleDefinition = {
  id: 'my-module',
  name: 'My Module',
  version: '1.0.0',
  description: 'Description of my module',
  
  // Dependencies on other modules
  dependencies: ['core', 'auth'],
  
  // Feature flags required
  features: ['my-feature'],
  
  // Routes this module provides
  routes: () => import('./routes'),
  
  // Services this module provides
  services: () => import('./services'),
  
  // Components this module exports
  components: () => import('./components'),
  
  // Hooks this module exports
  hooks: () => import('./hooks'),
  
  // Store slices
  stores: () => import('./stores'),
  
  // Lifecycle hooks
  async onLoad(context: ModuleContext): Promise<void> {
    console.log('My module loading...');
    // Initialize module
  },
  
  async onUnload(context: ModuleContext): Promise<void> {
    console.log('My module unloading...');
    // Cleanup
  }
};

export default myModule;
```

```yaml
# modules/my-module/config.yaml

id: my-module
name: My Module
version: 1.0.0
description: Description of my module

# Module settings
settings:
  enabled: true
  debug: false

# Permissions
permissions:
  - my-module:read
  - my-module:write
  - my-module:admin

# Navigation
navigation:
  - path: /my-module
    label: My Module
    icon: module-icon
    permissions: ['my-module:read']

# API routes
api:
  prefix: /api/my-module
  middleware:
    - auth
    - rateLimit

# Feature flags
features:
  - id: my-feature
    default: true
    description: Enable my feature
```

## Module Registry

```typescript
// packages/core/src/modules/ModuleRegistry.ts

import { ModuleDefinition, ModuleContext, ModuleState } from './types';

class ModuleRegistry {
  private modules: Map<string, ModuleDefinition> = new Map();
  private states: Map<string, ModuleState> = new Map();
  private context: ModuleContext;
  
  async register(module: ModuleDefinition): Promise<void> {
    // Check dependencies
    for (const dep of module.dependencies || []) {
      if (!this.modules.has(dep)) {
        throw new Error(`Missing dependency: ${dep} for module ${module.id}`);
      }
    }
    
    this.modules.set(module.id, module);
    this.states.set(module.id, { status: 'registered', loadedAt: null });
    
    console.log(`Module registered: ${module.id}`);
  }
  
  async load(moduleId: string): Promise<void> {
    const module = this.modules.get(moduleId);
    if (!module) {
      throw new Error(`Module not found: ${moduleId}`);
    }
    
    // Load dependencies first
    for (const dep of module.dependencies || []) {
      const depState = this.states.get(dep);
      if (depState?.status !== 'loaded') {
        await this.load(dep);
      }
    }
    
    // Load module parts
    if (module.routes) {
      const routes = await module.routes();
      this.context.router.use(routes);
    }
    
    if (module.services) {
      const services = await module.services();
      for (const [name, service] of Object.entries(services)) {
        this.context.services.register(name, service);
      }
    }
    
    // Call onLoad hook
    if (module.onLoad) {
      await module.onLoad(this.context);
    }
    
    this.states.set(moduleId, { status: 'loaded', loadedAt: new Date() });
    console.log(`Module loaded: ${moduleId}`);
  }
  
  async unload(moduleId: string): Promise<void> {
    const module = this.modules.get(moduleId);
    if (!module) return;
    
    if (module.onUnload) {
      await module.onUnload(this.context);
    }
    
    this.states.set(moduleId, { status: 'unloaded', loadedAt: null });
  }
  
  getLoadedModules(): ModuleDefinition[] {
    return Array.from(this.modules.values())
      .filter(m => this.states.get(m.id)?.status === 'loaded');
  }
}

export const moduleRegistry = new ModuleRegistry();
```

---

# Part 6: Plugin System

## Plugin Structure

```
plugins/my-plugin/
├── plugin.json                 # Plugin manifest
├── index.ts                    # Plugin entry point
├── src/
│   └── ...                     # Plugin code
└── README.md                   # Documentation
```

## Plugin Manifest

```json
// plugins/my-plugin/plugin.json

{
  "id": "my-plugin",
  "name": "My Plugin",
  "version": "1.0.0",
  "description": "Description of my plugin",
  "author": "Your Name",
  "license": "MIT",
  
  "main": "./dist/index.js",
  
  "datacendia": {
    "minVersion": "2.0.0",
    "maxVersion": "3.0.0"
  },
  
  "dependencies": {
    "@datacendia/core": "^2.0.0"
  },
  
  "permissions": [
    "agents:read",
    "decisions:write"
  ],
  
  "hooks": [
    "onDeliberationStart",
    "onDeliberationEnd",
    "onAgentResponse"
  ],
  
  "settings": {
    "apiKey": {
      "type": "string",
      "required": true,
      "description": "API key for external service"
    },
    "enabled": {
      "type": "boolean",
      "default": true,
      "description": "Enable the plugin"
    }
  }
}
```

## Plugin Implementation

```typescript
// plugins/my-plugin/index.ts

import { Plugin, PluginContext, PluginHooks } from '@datacendia/core';

export class MyPlugin implements Plugin {
  id = 'my-plugin';
  name = 'My Plugin';
  version = '1.0.0';
  
  private context: PluginContext;
  private settings: PluginSettings;
  
  async activate(context: PluginContext): Promise<void> {
    this.context = context;
    this.settings = context.settings;
    
    // Register hooks
    context.hooks.register('onDeliberationStart', this.onDeliberationStart.bind(this));
    context.hooks.register('onAgentResponse', this.onAgentResponse.bind(this));
    
    // Register API routes
    context.api.register('/my-plugin', this.router);
    
    // Register UI components
    context.ui.registerSidebarItem({
      id: 'my-plugin',
      label: 'My Plugin',
      icon: 'plugin-icon',
      component: () => import('./components/Sidebar')
    });
    
    console.log('My Plugin activated');
  }
  
  async deactivate(): Promise<void> {
    // Cleanup
    console.log('My Plugin deactivated');
  }
  
  // Hook implementations
  async onDeliberationStart(deliberation: Deliberation): Promise<void> {
    // Called when a deliberation starts
    console.log('Deliberation started:', deliberation.id);
  }
  
  async onAgentResponse(response: AgentResponse): Promise<AgentResponse> {
    // Called after each agent response - can modify
    return {
      ...response,
      metadata: {
        ...response.metadata,
        processedByPlugin: this.id
      }
    };
  }
  
  // API routes
  private router = {
    'GET /status': async (req, res) => {
      res.json({ status: 'active', version: this.version });
    },
    'POST /action': async (req, res) => {
      const result = await this.doAction(req.body);
      res.json(result);
    }
  };
  
  private async doAction(data: any): Promise<any> {
    // Plugin-specific action
    return { success: true };
  }
}

export default new MyPlugin();
```

---

# Part 7: CLI Reference

## All Generator Commands

```bash
# Pages
npx datacendia generate page <name> [options]
  --layout <name>       # Use specific layout
  --auth <mode>         # none, required, optional
  --with-api            # Generate API route
  --with-hooks          # Generate custom hooks
  --with-store          # Generate state store

# Components
npx datacendia generate component <name> [options]
  --package <name>      # Target package (default: ui)
  --with-stories        # Generate Storybook stories
  --with-tests          # Generate unit tests
  --with-styles         # Generate style file

# Services
npx datacendia generate service <name> [options]
  --package <name>      # Target package (default: core)
  --with-cache          # Include caching
  --with-queue          # Include queue processing
  --with-tests          # Generate unit tests

# Packages
npx datacendia generate package <name> [options]
  --type <type>         # library, service, ui, connector
  --with-react          # Include React setup
  --with-tests          # Include test setup

# Modules
npx datacendia generate module <name> [options]
  --with-routes         # Include API routes
  --with-components     # Include React components
  --with-store          # Include state store

# Agents
npx datacendia generate agent <name> [options]
  --template <name>     # Use template (standard, challenger, specialist)
  --industry <name>     # Target industry

# Connectors
npx datacendia generate connector <name> [options]
  --type <type>         # database, api, storage, auth
  --with-oauth          # Include OAuth support

# Plugins
npx datacendia generate plugin <name> [options]
  --hooks <list>        # Hooks to implement
  --with-ui             # Include UI components
```

---

## Quick Reference Card

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    EXTENSIBILITY QUICK REFERENCE                        │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ADD A PAGE                                                             │
│  1. Create file in apps/web/pages/<name>/index.tsx                     │
│  2. Use PageLayout component                                            │
│  3. Add to config/routes.yaml (optional)                               │
│                                                                         │
│  ADD A COMPONENT                                                        │
│  1. Create folder in packages/ui/src/components/<Name>/                │
│  2. Include: Component.tsx, types.ts, styles.ts, index.ts             │
│  3. Export from packages/ui/src/components/index.ts                    │
│                                                                         │
│  ADD A SERVICE                                                          │
│  1. Create folder in packages/core/src/services/<name>/                │
│  2. Extend BaseService class                                            │
│  3. Register with serviceRegistry.register()                           │
│                                                                         │
│  ADD A PACKAGE                                                          │
│  1. Create folder in packages/<name>/                                  │
│  2. Include: package.json, tsconfig.json, src/index.ts                 │
│  3. Add to pnpm-workspace.yaml                                         │
│                                                                         │
│  ADD A MODULE                                                           │
│  1. Create folder in modules/<name>/                                   │
│  2. Create index.ts with ModuleDefinition                              │
│  3. Register with moduleRegistry.register()                            │
│                                                                         │
│  ADD AN AGENT                                                           │
│  1. Create YAML config in agents/configs/<name>.yaml                   │
│  2. Define persona, capabilities, tools, behavior                      │
│  3. Register with agentRegistry.register()                             │
│                                                                         │
│  ADD A CONNECTOR                                                        │
│  1. Create in packages/connectors/src/<type>/<name>.connector.ts       │
│  2. Extend AbstractConnector                                            │
│  3. Register with connectorRegistry.register()                         │
│                                                                         │
│  ADD A PLUGIN                                                           │
│  1. Create folder in plugins/<name>/                                   │
│  2. Create plugin.json manifest                                         │
│  3. Implement Plugin interface                                          │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

**Document Version:** 1.0  
**Last Updated:** November 2025  
**Owner:** Platform Engineering
