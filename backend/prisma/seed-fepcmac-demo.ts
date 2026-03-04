// =============================================================================
// FEPCMAC DEMO SEED SCRIPT
// Creates a Peruvian microfinance institution demo for FEPCMAC / Sarmiento call
// Run with: npx ts-node prisma/seed-fepcmac-demo.ts
// =============================================================================

import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';
import * as crypto from 'crypto';

const prisma = new PrismaClient();

// FEPCMAC Demo IDs
const DEMO_ORG_ID = 'demo-fepcmac';
const USER_IDS = {
  gerente: 'user-gerente-carlos',
  riesgos: 'user-riesgos-maria',
  cumplimiento: 'user-cumplimiento-jorge',
  creditos: 'user-creditos-rosa',
  tecnologia: 'user-tecnologia-luis',
  analista: 'user-analista-patricia',
};

function randomDate(daysAgo: number): Date {
  return new Date(Date.now() - Math.random() * daysAgo * 24 * 60 * 60 * 1000);
}

function hash(data: string): string {
  return crypto.createHash('sha256').update(data).digest('hex');
}

function solAmount(min: number, max: number): number {
  return Math.round((min + Math.random() * (max - min)) * 100) / 100;
}

// =============================================================================
// CORE ENTITIES
// =============================================================================

async function seedOrganization() {
  console.log('Creando organización...');

  const existing = await prisma.organizations.findUnique({
    where: { id: DEMO_ORG_ID },
  });

  if (existing) {
    console.log('  ↳ Organización existe');
    return;
  }

  await prisma.organizations.create({
    data: {
      id: DEMO_ORG_ID,
      name: 'CMAC Cusco S.A.',
      slug: 'cmac-cusco',
      industry: 'Microfinanzas',
      company_size: '501-1000',
      settings: {
        timezone: 'America/Lima',
        currency: 'PEN',
        fiscalYearStart: 'January',
        language: 'es',
        country: 'PE',
        regulator: 'SBS',
        regulatorName: 'Superintendencia de Banca, Seguros y AFP',
      },
      updated_at: new Date(),
    },
  });

  console.log('  ✓ Organización creada: CMAC Cusco S.A.');
}

async function seedUsers() {
  console.log('Creando usuarios...');

  const users = [
    { id: USER_IDS.gerente, email: 'carlos.quispe@cmac-cusco.demo', name: 'Carlos Quispe Huamán', role: 'ADMIN' as const },
    { id: USER_IDS.riesgos, email: 'maria.flores@cmac-cusco.demo', name: 'María Flores Chávez', role: 'ADMIN' as const },
    { id: USER_IDS.cumplimiento, email: 'jorge.mendoza@cmac-cusco.demo', name: 'Jorge Mendoza Vargas', role: 'ADMIN' as const },
    { id: USER_IDS.creditos, email: 'rosa.huaman@cmac-cusco.demo', name: 'Rosa Huamán Paredes', role: 'ANALYST' as const },
    { id: USER_IDS.tecnologia, email: 'luis.chavez@cmac-cusco.demo', name: 'Luis Chávez Rojas', role: 'ADMIN' as const },
    { id: USER_IDS.analista, email: 'patricia.ramos@cmac-cusco.demo', name: 'Patricia Ramos Condori', role: 'ANALYST' as const },
  ];

  for (const u of users) {
    const existing = await prisma.users.findUnique({ where: { email: u.email } });
    if (!existing) {
      await prisma.users.create({
        data: {
          id: u.id,
          organization_id: DEMO_ORG_ID,
          email: u.email,
          name: u.name,
          password_hash: hash('demo-password-2024'),
          role: u.role,
          status: 'ACTIVE',
          email_verified: true,
          email_verified_at: new Date(),
          preferences: { theme: 'dark', notifications: true, language: 'es' },
          updated_at: new Date(),
        },
      });
    }
  }

  console.log('  ✓ 6 usuarios creados');
}

async function seedAgents() {
  console.log('Creando agentes del Consejo...');

  const agents = [
    {
      code: 'CREDIT_RISK',
      name: 'Analista de Riesgo Crediticio',
      role: 'risk',
      desc: 'Evalúa el riesgo crediticio de solicitudes de microcrédito usando historial de pagos, capacidad de endeudamiento y condiciones del mercado local.',
    },
    {
      code: 'COMPLIANCE_SBS',
      name: 'Oficial de Cumplimiento SBS',
      role: 'compliance',
      desc: 'Verifica cumplimiento con regulaciones de la Superintendencia de Banca, Seguros y AFP, incluyendo normas de lavado de activos y límites operativos.',
    },
    {
      code: 'FINANCIAL_ANALYST',
      name: 'Analista Financiero',
      role: 'analyst',
      desc: 'Analiza indicadores financieros: ratio de morosidad, provisiones, ROE, ROA, spread financiero y suficiencia de capital.',
    },
    {
      code: 'MICROFINANCE_ADVISOR',
      name: 'Asesor de Microfinanzas',
      role: 'strategist',
      desc: 'Evalúa impacto social y viabilidad de productos microfinancieros para poblaciones rurales y urbano-marginales del Perú.',
    },
    {
      code: 'LEGAL_ADVISOR',
      name: 'Asesor Legal',
      role: 'legal',
      desc: 'Revisa aspectos legales de operaciones crediticias, contratos de garantía y cumplimiento con el Código Civil peruano.',
    },
    {
      code: 'ETHICS_GUARDIAN',
      name: 'Guardián de Ética',
      role: 'ethics',
      desc: 'Asegura que las decisiones sean justas, no discriminatorias y alineadas con la misión de inclusión financiera de las CMACs.',
    },
  ];

  for (const a of agents) {
    const existing = await prisma.agents.findUnique({ where: { code: a.code } });
    if (!existing) {
      await prisma.agents.create({
        data: {
          id: `agent-${a.code.toLowerCase().replace(/_/g, '-')}`,
          code: a.code,
          name: a.name,
          role: a.role,
          description: a.desc,
          system_prompt: `Eres ${a.name}, un asesor de IA especializado en ${a.role} para instituciones de microfinanzas peruanas reguladas por la SBS. ${a.desc} Siempre responde en español y cita normativas SBS aplicables.`,
          capabilities: ['analysis', 'recommendation', 'critique', 'regulatory_check'],
          constraints: [
            'Debe citar normativas SBS aplicables',
            'Debe considerar el impacto en inclusión financiera',
            'Debe ser objetivo y basarse en datos',
          ],
          model_config: { model: 'llama3.3:70b', temperature: 0.7 },
          is_active: true,
          updated_at: new Date(),
        },
      });
    }
  }

  console.log('  ✓ 6 agentes creados');
}

// =============================================================================
// TEAMS
// =============================================================================

async function seedTeams() {
  console.log('Creando equipos...');

  const count = await prisma.teams.count({ where: { organization_id: DEMO_ORG_ID } });
  if (count > 0) {
    console.log('  ↳ Equipos existen');
    return;
  }

  const teams = [
    { name: 'Gerencia General', desc: 'Alta dirección y gerencia general' },
    { name: 'Gestión de Riesgos', desc: 'Unidad de riesgos crediticio, operacional y de mercado' },
    { name: 'Cumplimiento Normativo', desc: 'Oficial de cumplimiento SBS y prevención LAFT' },
    { name: 'Créditos y Cobranzas', desc: 'Evaluación, otorgamiento y recuperación de créditos' },
    { name: 'Tecnología e Innovación', desc: 'Sistemas, infraestructura y transformación digital' },
    { name: 'Auditoría Interna', desc: 'Control interno y auditoría de procesos' },
  ];

  for (const t of teams) {
    await prisma.teams.create({
      data: {
        id: randomUUID(),
        organization_id: DEMO_ORG_ID,
        name: t.name,
        description: t.desc,
        updated_at: new Date(),
      },
    });
  }

  console.log('  ✓ 6 equipos creados');
}

// =============================================================================
// ALERTS — Microfinance-relevant
// =============================================================================

async function seedAlerts() {
  console.log('Creando alertas...');

  const count = await prisma.alerts.count({ where: { organization_id: DEMO_ORG_ID } });
  if (count > 0) {
    console.log('  ↳ Alertas existen');
    return;
  }

  const alerts = [
    { severity: 'CRITICAL' as const, title: 'Ratio de morosidad supera umbral SBS (5.2%)', source: 'Riesgos', status: 'ACTIVE' as const },
    { severity: 'WARNING' as const, title: 'Concentración crediticia en sector agrícola > 25%', source: 'Riesgos', status: 'ACTIVE' as const },
    { severity: 'CRITICAL' as const, title: 'Reporte SBS R04 vencimiento en 48 horas', source: 'Cumplimiento', status: 'ACTIVE' as const },
    { severity: 'WARNING' as const, title: 'Operación sospechosa detectada — cliente #4521', source: 'LAFT', status: 'ACKNOWLEDGED' as const },
    { severity: 'INFO' as const, title: 'Ratio de capital regulatorio: 14.8% (mínimo 10%)', source: 'Finanzas', status: 'RESOLVED' as const },
    { severity: 'WARNING' as const, title: 'Provisiones genéricas por debajo del mínimo requerido', source: 'Contabilidad', status: 'ACTIVE' as const },
    { severity: 'INFO' as const, title: 'Nuevo producto de ahorro aprobado por directorio', source: 'Productos', status: 'RESOLVED' as const },
    { severity: 'CRITICAL' as const, title: 'Brecha de liquidez a 30 días supera límite interno', source: 'Tesorería', status: 'ACTIVE' as const },
    { severity: 'WARNING' as const, title: '12 créditos con atraso > 60 días sin gestión de cobranza', source: 'Cobranzas', status: 'ACTIVE' as const },
    { severity: 'INFO' as const, title: 'Capacitación LAFT completada — 98% del personal', source: 'RRHH', status: 'RESOLVED' as const },
  ];

  for (const a of alerts) {
    await prisma.alerts.create({
      data: {
        id: randomUUID(),
        organization_id: DEMO_ORG_ID,
        severity: a.severity,
        status: a.status,
        title: a.title,
        message: `${a.title} — requiere atención inmediata`,
        source: a.source,
        metadata: { triggered_by: 'sistema', regulatory_framework: 'SBS' },
        created_at: randomDate(7),
      },
    });
  }

  console.log('  ✓ 10 alertas creadas');
}

// =============================================================================
// DECISIONS — Credit decisions and strategic decisions
// =============================================================================

async function seedDecisions() {
  console.log('Creando decisiones...');

  const count = await prisma.decisions.count({ where: { organization_id: DEMO_ORG_ID } });
  if (count > 0) {
    console.log('  ↳ Decisiones existen');
    return;
  }

  const decisions = [
    {
      title: 'Crédito Agropecuario — Cooperativa Agraria Valle Sagrado',
      desc: 'Solicitud de crédito por S/ 180,000 para financiamiento de campaña agrícola de quinua orgánica en el Valle Sagrado. Garantía: terreno de 5 hectáreas.',
      status: 'APPROVED' as const, priority: 'HIGH' as const, category: 'Créditos', dept: 'Créditos Agropecuarios',
      budget: 180000,
    },
    {
      title: 'Microcrédito PYME — Textiles Cusqueños SRL',
      desc: 'Solicitud de microcrédito por S/ 35,000 para capital de trabajo en taller textil artesanal. 15 empleados. Historial de 3 créditos anteriores pagados puntualmente.',
      status: 'APPROVED' as const, priority: 'MEDIUM' as const, category: 'Créditos', dept: 'Créditos PYME',
      budget: 35000,
    },
    {
      title: 'Crédito Hipotecario — María Quispe Condori',
      desc: 'Solicitud de crédito hipotecario por S/ 120,000 para adquisición de vivienda en San Jerónimo. Ingreso familiar: S/ 4,500/mes. Sin historial crediticio formal.',
      status: 'PENDING' as const, priority: 'HIGH' as const, category: 'Créditos', dept: 'Créditos Hipotecarios',
      budget: 120000,
    },
    {
      title: 'Apertura de Agencia — Distrito de Sicuani',
      desc: 'Evaluación de viabilidad para abrir nueva agencia en Sicuani, provincia de Canchis. Población objetivo: 60,000 habitantes, 70% sin acceso a servicios financieros formales.',
      status: 'PENDING' as const, priority: 'CRITICAL' as const, category: 'Estrategia', dept: 'Gerencia General',
      budget: 850000,
    },
    {
      title: 'Implementación de Banca Móvil',
      desc: 'Proyecto de transformación digital para lanzar aplicación de banca móvil dirigida a clientes rurales. Integración con YAPE y Plin.',
      status: 'APPROVED' as const, priority: 'HIGH' as const, category: 'Tecnología', dept: 'Tecnología e Innovación',
      budget: 420000,
    },
    {
      title: 'Crédito Grupal Solidario — Asociación de Artesanas de Chinchero',
      desc: 'Solicitud de crédito grupal solidario por S/ 50,000 (10 integrantes, S/ 5,000 c/u) para compra de materiales textiles. Metodología de grupo solidario.',
      status: 'APPROVED' as const, priority: 'MEDIUM' as const, category: 'Créditos', dept: 'Créditos Grupales',
      budget: 50000,
    },
    {
      title: 'Reestructuración de Cartera Morosa — Sector Turismo',
      desc: 'Plan de reestructuración para 45 créditos en mora del sector turismo post-pandemia. Monto total: S/ 2.1M. Propuesta de refinanciamiento a 36 meses.',
      status: 'IMPLEMENTED' as const, priority: 'CRITICAL' as const, category: 'Recuperaciones', dept: 'Cobranzas',
      budget: 2100000,
    },
    {
      title: 'Actualización de Política de Riesgo Crediticio',
      desc: 'Revisión y actualización de la política de riesgo crediticio conforme a Resolución SBS N° 11356-2008 y sus modificatorias. Incluye nuevos scoring para microcréditos.',
      status: 'PENDING' as const, priority: 'HIGH' as const, category: 'Cumplimiento', dept: 'Gestión de Riesgos',
      budget: 0,
    },
    {
      title: 'Crédito Educativo — Universidad Nacional San Antonio Abad',
      desc: 'Nuevo producto de crédito educativo para estudiantes universitarios en alianza con UNSAAC. Monto máximo S/ 15,000 por estudiante. Periodo de gracia hasta graduación.',
      status: 'DEFERRED' as const, priority: 'LOW' as const, category: 'Productos', dept: 'Desarrollo de Productos',
      budget: 500000,
    },
    {
      title: 'Emisión de Certificados de Depósito',
      desc: 'Propuesta de emisión de certificados de depósito negociables por S/ 10M para mejorar fondeo institucional. Requiere autorización SBS.',
      status: 'BLOCKED' as const, priority: 'HIGH' as const, category: 'Finanzas', dept: 'Tesorería',
      budget: 10000000,
    },
  ];

  const ownerMap: Record<string, { name: string; email: string; userId: string }> = {
    'Créditos': { name: 'Rosa Huamán Paredes', email: 'rosa.huaman@cmac-cusco.demo', userId: USER_IDS.creditos },
    'Estrategia': { name: 'Carlos Quispe Huamán', email: 'carlos.quispe@cmac-cusco.demo', userId: USER_IDS.gerente },
    'Tecnología': { name: 'Luis Chávez Rojas', email: 'luis.chavez@cmac-cusco.demo', userId: USER_IDS.tecnologia },
    'Recuperaciones': { name: 'Rosa Huamán Paredes', email: 'rosa.huaman@cmac-cusco.demo', userId: USER_IDS.creditos },
    'Cumplimiento': { name: 'Jorge Mendoza Vargas', email: 'jorge.mendoza@cmac-cusco.demo', userId: USER_IDS.cumplimiento },
    'Productos': { name: 'Carlos Quispe Huamán', email: 'carlos.quispe@cmac-cusco.demo', userId: USER_IDS.gerente },
    'Finanzas': { name: 'María Flores Chávez', email: 'maria.flores@cmac-cusco.demo', userId: USER_IDS.riesgos },
  };

  for (const d of decisions) {
    const owner = ownerMap[d.category] || ownerMap['Estrategia'];
    const decisionId = randomUUID();

    await prisma.decisions.create({
      data: {
        id: decisionId,
        organization_id: DEMO_ORG_ID,
        user_id: owner.userId,
        title: d.title,
        description: d.desc,
        category: d.category,
        priority: d.priority,
        status: d.status,
        department: d.dept,
        owner_name: owner.name,
        owner_email: owner.email,
        budget: d.budget,
        timeframe: 'T1 2026',
        stakeholders: ['Directorio', 'Gerencia General', d.dept],
        created_at: randomDate(90),
        updated_at: new Date(),
      },
    });

    await prisma.decision_activities.create({
      data: {
        id: randomUUID(),
        decision_id: decisionId,
        actor: owner.name,
        action: 'created',
        details: { note: 'Decisión registrada en el sistema' },
        timestamp: randomDate(90),
      },
    });
  }

  console.log('  ✓ 10 decisiones creadas');
}

// =============================================================================
// DELIBERATIONS — Microfinance-specific council questions
// =============================================================================

async function seedDeliberations() {
  console.log('Creando deliberaciones...');

  const count = await prisma.deliberations.count({ where: { organization_id: DEMO_ORG_ID } });
  if (count > 0) {
    console.log('  ↳ Deliberaciones existen');
    return;
  }

  const deliberations = [
    {
      question: '¿Deberíamos aprobar el crédito agropecuario de S/ 180,000 a la Cooperativa Valle Sagrado considerando la volatilidad del precio de la quinua?',
      status: 'COMPLETED' as const,
      confidence: 0.84,
      agents: ['CREDIT_RISK', 'FINANCIAL_ANALYST', 'MICROFINANCE_ADVISOR'],
    },
    {
      question: '¿Cuál es la estrategia óptima para reducir el ratio de morosidad del 5.2% al objetivo del 3.5% sin afectar la inclusión financiera?',
      status: 'COMPLETED' as const,
      confidence: 0.79,
      agents: ['CREDIT_RISK', 'FINANCIAL_ANALYST', 'ETHICS_GUARDIAN'],
    },
    {
      question: '¿Es viable abrir una nueva agencia en Sicuani considerando la competencia de otras CMACs y la densidad poblacional?',
      status: 'IN_PROGRESS' as const,
      confidence: 0.52,
      agents: ['FINANCIAL_ANALYST', 'MICROFINANCE_ADVISOR', 'LEGAL_ADVISOR'],
    },
    {
      question: '¿Cómo debemos reestructurar los créditos del sector turismo en mora post-pandemia cumpliendo con la normativa SBS de reestructuración?',
      status: 'COMPLETED' as const,
      confidence: 0.88,
      agents: ['COMPLIANCE_SBS', 'CREDIT_RISK', 'LEGAL_ADVISOR'],
    },
    {
      question: '¿Deberíamos implementar un modelo de scoring crediticio basado en datos alternativos (pagos de servicios, uso de celular) para clientes sin historial bancario?',
      status: 'PENDING' as const,
      confidence: null,
      agents: ['CREDIT_RISK', 'ETHICS_GUARDIAN', 'MICROFINANCE_ADVISOR'],
    },
    {
      question: '¿Cuál es el impacto regulatorio de la operación sospechosa detectada en el cliente #4521 y qué acciones debemos tomar ante la UIF?',
      status: 'COMPLETED' as const,
      confidence: 0.92,
      agents: ['COMPLIANCE_SBS', 'LEGAL_ADVISOR', 'ETHICS_GUARDIAN'],
    },
    {
      question: '¿Es conveniente lanzar el producto de crédito educativo en alianza con UNSAAC dado el perfil de riesgo de estudiantes universitarios?',
      status: 'PENDING' as const,
      confidence: null,
      agents: ['FINANCIAL_ANALYST', 'MICROFINANCE_ADVISOR', 'CREDIT_RISK'],
    },
  ];

  for (const d of deliberations) {
    await prisma.deliberations.create({
      data: {
        id: randomUUID(),
        organization_id: DEMO_ORG_ID,
        question: d.question,
        config: { agents: d.agents, language: 'es' },
        status: d.status,
        current_phase: d.status === 'IN_PROGRESS' ? 'cross_examination' : null,
        progress: d.status === 'COMPLETED' ? 100 : d.status === 'IN_PROGRESS' ? 65 : 0,
        decision: d.status === 'COMPLETED'
          ? { recommendation: 'Proceder con enfoque por fases', regulatory_notes: 'Conforme a normativa SBS vigente' }
          : undefined,
        confidence: d.confidence,
        started_at: d.status !== 'PENDING' ? randomDate(30) : null,
        completed_at: d.status === 'COMPLETED' ? randomDate(7) : null,
        created_at: randomDate(60),
      },
    });
  }

  console.log('  ✓ 7 deliberaciones creadas');
}

// =============================================================================
// DATA SOURCES — Peruvian financial systems
// =============================================================================

async function seedDataSources() {
  console.log('Creando fuentes de datos...');

  const count = await prisma.data_sources.count({ where: { organization_id: DEMO_ORG_ID } });
  if (count > 0) {
    console.log('  ↳ Fuentes de datos existen');
    return;
  }

  const sources = [
    { name: 'Core Bancario (BANTOTAL)', type: 'POSTGRESQL' as const, status: 'CONNECTED' as const },
    { name: 'Central de Riesgos SBS', type: 'REST_API' as const, status: 'CONNECTED' as const },
    { name: 'RENIEC (Identidad)', type: 'REST_API' as const, status: 'CONNECTED' as const },
    { name: 'SUNAT (Tributario)', type: 'REST_API' as const, status: 'CONNECTED' as const },
    { name: 'Data Warehouse Interno', type: 'POSTGRESQL' as const, status: 'CONNECTED' as const },
    { name: 'Sistema de Cobranzas', type: 'REST_API' as const, status: 'SYNCING' as const },
    { name: 'BCRP — Datos Macroeconómicos', type: 'REST_API' as const, status: 'CONNECTED' as const },
    { name: 'Sentinel / Experian Perú', type: 'REST_API' as const, status: 'PENDING' as const },
  ];

  for (const s of sources) {
    await prisma.data_sources.create({
      data: {
        id: randomUUID(),
        organization_id: DEMO_ORG_ID,
        name: s.name,
        type: s.type,
        config: { autoSync: true, syncInterval: '1h' },
        credentials: {},
        status: s.status,
        last_sync_at: s.status === 'CONNECTED' ? randomDate(1) : null,
        last_sync_status: s.status === 'CONNECTED' ? 'success' : null,
        sync_schedule: '0 * * * *',
        metadata: { recordCount: Math.floor(Math.random() * 500000) },
        updated_at: new Date(),
      },
    });
  }

  console.log('  ✓ 8 fuentes de datos creadas');
}

// =============================================================================
// METRICS — Microfinance KPIs
// =============================================================================

async function seedMetrics() {
  console.log('Creando métricas...');

  const count = await prisma.metric_definitions.count({ where: { organization_id: DEMO_ORG_ID } });
  if (count > 0) {
    console.log('  ↳ Métricas existen');
    return;
  }

  const metrics = [
    { code: 'MOROSIDAD', name: 'Ratio de Morosidad', category: 'Calidad de Cartera', unit: '%', format: 'percentage' },
    { code: 'CARTERA_TOTAL', name: 'Cartera de Créditos Total', category: 'Cartera', unit: 'PEN', format: 'currency' },
    { code: 'ROE', name: 'Rentabilidad sobre Patrimonio (ROE)', category: 'Rentabilidad', unit: '%', format: 'percentage' },
    { code: 'ROA', name: 'Rentabilidad sobre Activos (ROA)', category: 'Rentabilidad', unit: '%', format: 'percentage' },
    { code: 'RATIO_CAPITAL', name: 'Ratio de Capital Regulatorio', category: 'Solvencia', unit: '%', format: 'percentage' },
    { code: 'SPREAD', name: 'Spread Financiero', category: 'Rentabilidad', unit: '%', format: 'percentage' },
    { code: 'CLIENTES', name: 'Número de Clientes Activos', category: 'Crecimiento', unit: '', format: 'number' },
    { code: 'DEPOSITOS', name: 'Depósitos Totales', category: 'Pasivos', unit: 'PEN', format: 'currency' },
    { code: 'PROVISION', name: 'Cobertura de Provisiones', category: 'Calidad de Cartera', unit: '%', format: 'percentage' },
    { code: 'EFICIENCIA', name: 'Ratio de Eficiencia Operativa', category: 'Operaciones', unit: '%', format: 'percentage' },
  ];

  for (const m of metrics) {
    const metricId = randomUUID();
    await prisma.metric_definitions.create({
      data: {
        id: metricId,
        organization_id: DEMO_ORG_ID,
        owner_id: USER_IDS.analista,
        code: m.code,
        name: m.name,
        description: `${m.name} — indicador clave de desempeño`,
        category: m.category,
        unit: m.unit,
        formula: { type: 'direct', source: 'core_bancario' },
        thresholds: { warning: 80, critical: 95 },
        updated_at: new Date(),
      },
    });

    // 12 months of history
    for (let month = 0; month < 12; month++) {
      const date = new Date();
      date.setMonth(date.getMonth() - month);

      let value = 0;
      switch (m.code) {
        case 'MOROSIDAD': value = 3.8 + Math.random() * 1.8 + (month > 6 ? 0.5 : 0); break;
        case 'CARTERA_TOTAL': value = 285000000 + (11 - month) * 5000000 + Math.random() * 2000000; break;
        case 'ROE': value = 12.5 + Math.random() * 3 - (month > 8 ? 1.5 : 0); break;
        case 'ROA': value = 2.1 + Math.random() * 0.6; break;
        case 'RATIO_CAPITAL': value = 14.2 + Math.random() * 1.5; break;
        case 'SPREAD': value = 18.5 + Math.random() * 2; break;
        case 'CLIENTES': value = 42000 + (11 - month) * 800 + Math.random() * 200; break;
        case 'DEPOSITOS': value = 195000000 + (11 - month) * 3000000 + Math.random() * 1500000; break;
        case 'PROVISION': value = 125 + Math.random() * 15; break;
        case 'EFICIENCIA': value = 52 + Math.random() * 5; break;
      }

      await prisma.metric_values.create({
        data: {
          id: randomUUID(),
          metric_id: metricId,
          value: value,
          timestamp: date,
        },
      });
    }
  }

  console.log('  ✓ 10 métricas con 12 meses de historial');
}

// =============================================================================
// AUDIT LOGS — SBS-relevant regulatory events
// =============================================================================

async function seedAuditLogs() {
  console.log('Creando registros de auditoría...');

  const count = await prisma.audit_logs.count({ where: { organization_id: DEMO_ORG_ID } });
  if (count > 0) {
    console.log('  ↳ Registros de auditoría existen');
    return;
  }

  const events = [
    { action: 'credito.evaluado', resource: 'creditos', actor: 'Rosa Huamán Paredes' },
    { action: 'credito.aprobado', resource: 'creditos', actor: 'Carlos Quispe Huamán' },
    { action: 'credito.desembolsado', resource: 'creditos', actor: 'Rosa Huamán Paredes' },
    { action: 'deliberacion.iniciada', resource: 'deliberaciones', actor: 'Sistema Consejo' },
    { action: 'deliberacion.completada', resource: 'deliberaciones', actor: 'Sistema Consejo' },
    { action: 'reporte_sbs.generado', resource: 'cumplimiento', actor: 'Jorge Mendoza Vargas' },
    { action: 'reporte_sbs.enviado', resource: 'cumplimiento', actor: 'Jorge Mendoza Vargas' },
    { action: 'alerta_laft.creada', resource: 'laft', actor: 'Sistema LAFT' },
    { action: 'alerta_laft.resuelta', resource: 'laft', actor: 'Jorge Mendoza Vargas' },
    { action: 'usuario.login', resource: 'autenticacion', actor: 'Carlos Quispe Huamán' },
    { action: 'politica.actualizada', resource: 'gobernanza', actor: 'María Flores Chávez' },
    { action: 'provision.calculada', resource: 'contabilidad', actor: 'Sistema Contable' },
    { action: 'scoring.ejecutado', resource: 'riesgos', actor: 'Sistema de Scoring' },
    { action: 'garantia.registrada', resource: 'creditos', actor: 'Rosa Huamán Paredes' },
    { action: 'cobranza.gestionada', resource: 'cobranzas', actor: 'Patricia Ramos Condori' },
  ];

  for (let i = 0; i < 75; i++) {
    const event = events[i % events.length];
    await prisma.audit_logs.create({
      data: {
        id: randomUUID(),
        organization_id: DEMO_ORG_ID,
        user_id: USER_IDS.gerente,
        action: event.action,
        resource_type: event.resource,
        resource_id: randomUUID(),
        details: {
          triggered_by: event.actor,
          regulatory_framework: 'SBS',
          country: 'PE',
        },
        ip_address: '10.0.0.' + Math.floor(Math.random() * 255),
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        created_at: randomDate(30),
      },
    });
  }

  console.log('  ✓ 75 registros de auditoría creados');
}

// =============================================================================
// WORKFLOWS — Microfinance operational workflows
// =============================================================================

async function seedWorkflows() {
  console.log('Creando flujos de trabajo...');

  const count = await prisma.workflows.count({ where: { organization_id: DEMO_ORG_ID } });
  if (count > 0) {
    console.log('  ↳ Flujos de trabajo existen');
    return;
  }

  const workflows = [
    {
      name: 'Evaluación de Crédito Microempresa',
      desc: 'Flujo completo de evaluación: verificación RENIEC → consulta Central de Riesgos → scoring → visita de campo → comité de créditos → desembolso',
      trigger: 'credito.solicitado',
      status: 'ACTIVE' as const,
    },
    {
      name: 'Reporte Regulatorio SBS Mensual',
      desc: 'Generación automática de reportes R01, R02, R04, R05, R12 para la Superintendencia de Banca y Seguros',
      trigger: 'schedule.monthly',
      status: 'ACTIVE' as const,
    },
    {
      name: 'Detección de Operaciones Sospechosas (LAFT)',
      desc: 'Monitoreo continuo de transacciones para detección de lavado de activos y financiamiento del terrorismo conforme a Resolución SBS N° 2660-2015',
      trigger: 'transaccion.registrada',
      status: 'ACTIVE' as const,
    },
    {
      name: 'Gestión de Cobranza Preventiva',
      desc: 'Alertas automáticas de créditos con atraso de 1-30 días: SMS, llamada, visita de campo, escalamiento a supervisor',
      trigger: 'credito.atraso_detectado',
      status: 'ACTIVE' as const,
    },
    {
      name: 'Cálculo de Provisiones',
      desc: 'Cálculo mensual de provisiones genéricas y específicas según clasificación de deudor SBS (Normal, CPP, Deficiente, Dudoso, Pérdida)',
      trigger: 'schedule.monthly',
      status: 'ACTIVE' as const,
    },
    {
      name: 'Onboarding de Nuevo Cliente',
      desc: 'Verificación de identidad RENIEC, consulta lista negra UIF, apertura de cuenta de ahorros, asignación de asesor de crédito',
      trigger: 'cliente.registrado',
      status: 'ACTIVE' as const,
    },
    {
      name: 'Aprobación de Apertura de Agencia',
      desc: 'Estudio de mercado → análisis financiero → aprobación directorio → solicitud SBS → implementación',
      trigger: 'agencia.propuesta',
      status: 'DRAFT' as const,
    },
  ];

  for (const w of workflows) {
    await prisma.workflows.create({
      data: {
        id: randomUUID(),
        organization_id: DEMO_ORG_ID,
        name: w.name,
        description: w.desc,
        category: 'microfinanzas',
        trigger: { type: w.trigger, enabled: true },
        definition: {
          nodes: [
            { id: 'start', type: 'trigger', next: 'evaluate' },
            { id: 'evaluate', type: 'action', config: { type: 'ai_evaluate' }, next: 'approve' },
            { id: 'approve', type: 'approval', config: { approvers: ['gerente', 'riesgos'] }, next: 'execute' },
            { id: 'execute', type: 'action', config: { type: 'execute_action' }, next: 'audit' },
            { id: 'audit', type: 'action', config: { type: 'create_audit_log' }, next: 'end' },
            { id: 'end', type: 'end' },
          ],
        },
        status: w.status,
        updated_at: new Date(),
      },
    });
  }

  console.log('  ✓ 7 flujos de trabajo creados');
}

// =============================================================================
// MAIN
// =============================================================================

async function main() {
  console.log('\n╔════════════════════════════════════════════════════════════════════╗');
  console.log('║         DATACENDIA — FEPCMAC DEMO SEED                            ║');
  console.log('║         CMAC Cusco S.A. — Microfinanzas Perú                      ║');
  console.log('╚════════════════════════════════════════════════════════════════════╝\n');

  try {
    // Core entities
    await seedOrganization();
    await seedUsers();
    await seedAgents();
    await seedTeams();

    // Operational data
    await seedAlerts();
    await seedDecisions();
    await seedDeliberations();
    await seedDataSources();
    await seedMetrics();
    await seedAuditLogs();
    await seedWorkflows();

    console.log('\n╔════════════════════════════════════════════════════════════════════╗');
    console.log('║  ✅ FEPCMAC DEMO CREADO CON ÉXITO                                 ║');
    console.log('║                                                                    ║');
    console.log('║  Organización: CMAC Cusco S.A.                                    ║');
    console.log('║  Usuarios: 6 (Gerente, Riesgos, Cumplimiento, Créditos, TI, Anal) ║');
    console.log('║  Agentes: 6 (Riesgo Crediticio, SBS, Financiero, Microfinanzas,   ║');
    console.log('║              Legal, Ética)                                         ║');
    console.log('║  Datos: 10 decisiones, 7 deliberaciones, 10 alertas,              ║');
    console.log('║         10 métricas (12 meses), 75 logs de auditoría,             ║');
    console.log('║         8 fuentes de datos, 7 flujos de trabajo                   ║');
    console.log('║                                                                    ║');
    console.log('║  Credenciales:                                                     ║');
    console.log('║    carlos.quispe@cmac-cusco.demo  (Gerente General)               ║');
    console.log('║    maria.flores@cmac-cusco.demo   (Jefa de Riesgos)               ║');
    console.log('║    jorge.mendoza@cmac-cusco.demo  (Oficial Cumplimiento)          ║');
    console.log('║    rosa.huaman@cmac-cusco.demo    (Jefa de Créditos)              ║');
    console.log('║    luis.chavez@cmac-cusco.demo     (Jefe de Tecnología)           ║');
    console.log('║    patricia.ramos@cmac-cusco.demo (Analista)                      ║');
    console.log('║  Password: demo-password-2024 (SHA-256 hash)                      ║');
    console.log('╚════════════════════════════════════════════════════════════════════╝\n');

  } catch (error) {
    console.error('\n❌ Seed falló:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();
