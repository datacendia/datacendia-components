// @ts-nocheck
// =============================================================================
// CENDIA GENOMICS™ - HEALTHCARE & LIFE SCIENCES PACK
// AI-Powered Healthcare Decision Intelligence
// "The Highest AI-Paying Sector Meets Enterprise Decision Intelligence"
// 
// CAPABILITIES:
// - Patient flow processing & optimization
// - Adverse outcome prediction
// - FDA submission automation
// - Clinical pathway optimization
// - Drug R&D simulation
// - Genetic risk modeling
// - Clinical trials scenario planning
// - HIPAA-compliant data handling
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
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { decisionIntelApi } from '../../../lib/api';

// =============================================================================
// TYPES
// =============================================================================

type ClinicalDomain = 'cardiology' | 'oncology' | 'neurology' | 'immunology' | 'endocrinology' | 'genomics' | 'pharmacology';
type RiskLevel = 'critical' | 'high' | 'moderate' | 'low' | 'minimal';
type TrialPhase = 'preclinical' | 'phase1' | 'phase2' | 'phase3' | 'phase4' | 'approved';
type RegulatoryBody = 'fda' | 'ema' | 'pmda' | 'nmpa' | 'hc';
interface PatientCohort {
  id: string;
  name: string;
  size: number;
  avgAge: number;
  riskProfile: RiskLevel;
  primaryCondition: string;
  comorbidities: string[];
  avgLOS: number; // Length of stay
  readmissionRate: number;
  predictedOutcome: number;
}
interface ClinicalPathway {
  id: string;
  name: string;
  domain: ClinicalDomain;
  stages: {
    name: string;
    avgDuration: number;
    successRate: number;
    cost: number;
  }[];
  totalPatients: number;
  avgOutcomeScore: number;
  complianceRate: number;
  lastOptimized: Date;
}
interface AdverseEventPrediction {
  id: string;
  patientId: string;
  eventType: string;
  probability: number;
  timeframe: string;
  riskFactors: string[];
  recommendedActions: string[];
  confidence: number;
  modelVersion: string;
}
interface DrugCandidate {
  id: string;
  name: string;
  targetIndication: string;
  mechanism: string;
  phase: TrialPhase;
  efficacyScore: number;
  safetyScore: number;
  marketPotential: number;
  developmentCost: number;
  timeToMarket: number;
  competitorCount: number;
  patentExpiry: Date;
}
interface ClinicalTrial {
  id: string;
  name: string;
  drug: string;
  phase: TrialPhase;
  indication: string;
  enrollmentTarget: number;
  enrollmentActual: number;
  sites: number;
  countries: string[];
  primaryEndpoint: string;
  status: 'recruiting' | 'active' | 'completed' | 'suspended' | 'terminated';
  estimatedCompletion: Date;
  budget: number;
  spent: number;
}
interface FDASubmission {
  id: string;
  type: 'NDA' | 'BLA' | 'ANDA' | '510k' | 'PMA' | 'IND';
  productName: string;
  status: 'preparation' | 'submitted' | 'under-review' | 'approved' | 'crl' | 'withdrawn';
  submissionDate?: Date;
  pdufa?: Date;
  completeness: number;
  sections: {
    name: string;
    status: 'complete' | 'in-progress' | 'not-started' | 'needs-revision';
    lastUpdated: Date;
  }[];
  reviewerQuestions: number;
  openIssues: number;
}
interface GeneticRiskModel {
  id: string;
  name: string;
  condition: string;
  genes: string[];
  populationRisk: number;
  modelAccuracy: number;
  sampleSize: number;
  lastValidated: Date;
  publications: number;
}
interface HealthcareMetrics {
  totalPatients: number;
  avgOutcomeScore: number;
  readmissionRate: number;
  adverseEventRate: number;
  avgLOS: number;
  patientSatisfaction: number;
  clinicalTrialsActive: number;
  fdaSubmissionsPending: number;
  drugCandidatesPipeline: number;
  researchSpend: number;
}

// =============================================================================
// MOCK DATA
// =============================================================================

const DOMAIN_CONFIG: Record<ClinicalDomain, {
  icon: string;
  color: string;
  name: string;
}> = stryMutAct_9fa48("29682") ? {} : (stryCov_9fa48("29682"), {
  cardiology: stryMutAct_9fa48("29683") ? {} : (stryCov_9fa48("29683"), {
    icon: '❤️',
    color: 'from-red-600 to-rose-600',
    name: 'Cardiology'
  }),
  oncology: stryMutAct_9fa48("29687") ? {} : (stryCov_9fa48("29687"), {
    icon: '🎗️',
    color: 'from-purple-600 to-pink-600',
    name: 'Oncology'
  }),
  neurology: stryMutAct_9fa48("29691") ? {} : (stryCov_9fa48("29691"), {
    icon: '🧠',
    color: 'from-blue-600 to-indigo-600',
    name: 'Neurology'
  }),
  immunology: stryMutAct_9fa48("29695") ? {} : (stryCov_9fa48("29695"), {
    icon: '🛡️',
    color: 'from-green-600 to-emerald-600',
    name: 'Immunology'
  }),
  endocrinology: stryMutAct_9fa48("29699") ? {} : (stryCov_9fa48("29699"), {
    icon: '⚗️',
    color: 'from-amber-600 to-orange-600',
    name: 'Endocrinology'
  }),
  genomics: stryMutAct_9fa48("29703") ? {} : (stryCov_9fa48("29703"), {
    icon: '🧬',
    color: 'from-cyan-600 to-blue-600',
    name: 'Genomics'
  }),
  pharmacology: stryMutAct_9fa48("29707") ? {} : (stryCov_9fa48("29707"), {
    icon: '💊',
    color: 'from-teal-600 to-cyan-600',
    name: 'Pharmacology'
  })
});
const generatePatientCohorts = stryMutAct_9fa48("29711") ? () => undefined : (stryCov_9fa48("29711"), (() => {
  const generatePatientCohorts = (): PatientCohort[] => stryMutAct_9fa48("29712") ? [] : (stryCov_9fa48("29712"), [stryMutAct_9fa48("29713") ? {} : (stryCov_9fa48("29713"), {
    id: 'cohort-001',
    name: 'High-Risk Cardiac',
    size: 2847,
    avgAge: 68.5,
    riskProfile: 'high',
    primaryCondition: 'Heart Failure',
    comorbidities: stryMutAct_9fa48("29718") ? [] : (stryCov_9fa48("29718"), ['Diabetes', 'Hypertension', 'CKD']),
    avgLOS: 5.2,
    readmissionRate: 18.5,
    predictedOutcome: 72
  }), stryMutAct_9fa48("29722") ? {} : (stryCov_9fa48("29722"), {
    id: 'cohort-002',
    name: 'Oncology - Breast Cancer',
    size: 1923,
    avgAge: 55.2,
    riskProfile: 'moderate',
    primaryCondition: 'Breast Cancer Stage II-III',
    comorbidities: stryMutAct_9fa48("29727") ? [] : (stryCov_9fa48("29727"), ['Anxiety', 'Osteoporosis']),
    avgLOS: 3.8,
    readmissionRate: 8.2,
    predictedOutcome: 85
  }), stryMutAct_9fa48("29730") ? {} : (stryCov_9fa48("29730"), {
    id: 'cohort-003',
    name: 'Neurodegenerative',
    size: 892,
    avgAge: 72.1,
    riskProfile: 'critical',
    primaryCondition: "Alzheimer's Disease",
    comorbidities: stryMutAct_9fa48("29735") ? [] : (stryCov_9fa48("29735"), ['Depression', 'Falls Risk', 'Malnutrition']),
    avgLOS: 12.4,
    readmissionRate: 32.1,
    predictedOutcome: 45
  }), stryMutAct_9fa48("29739") ? {} : (stryCov_9fa48("29739"), {
    id: 'cohort-004',
    name: 'Diabetes Management',
    size: 5623,
    avgAge: 52.8,
    riskProfile: 'moderate',
    primaryCondition: 'Type 2 Diabetes',
    comorbidities: stryMutAct_9fa48("29744") ? [] : (stryCov_9fa48("29744"), ['Obesity', 'Hypertension', 'Dyslipidemia']),
    avgLOS: 2.1,
    readmissionRate: 12.3,
    predictedOutcome: 78
  })]);
  return generatePatientCohorts;
})());
const generateClinicalTrials = stryMutAct_9fa48("29748") ? () => undefined : (stryCov_9fa48("29748"), (() => {
  const generateClinicalTrials = (): ClinicalTrial[] => stryMutAct_9fa48("29749") ? [] : (stryCov_9fa48("29749"), [stryMutAct_9fa48("29750") ? {} : (stryCov_9fa48("29750"), {
    id: 'trial-001',
    name: 'CARDIAC-REGEN Phase III',
    drug: 'CDX-4521',
    phase: 'phase3',
    indication: 'Chronic Heart Failure',
    enrollmentTarget: 3200,
    enrollmentActual: 2847,
    sites: 145,
    countries: stryMutAct_9fa48("29756") ? [] : (stryCov_9fa48("29756"), ['USA', 'Germany', 'UK', 'Japan', 'Canada']),
    primaryEndpoint: 'Reduction in cardiovascular death or HF hospitalization',
    status: 'active',
    estimatedCompletion: new Date('2025-12-31'),
    budget: 285000000,
    spent: 198000000
  }), stryMutAct_9fa48("29765") ? {} : (stryCov_9fa48("29765"), {
    id: 'trial-002',
    name: 'NEURO-PROTECT Phase II',
    drug: 'CDX-7892',
    phase: 'phase2',
    indication: "Alzheimer's Disease",
    enrollmentTarget: 800,
    enrollmentActual: 623,
    sites: 48,
    countries: stryMutAct_9fa48("29771") ? [] : (stryCov_9fa48("29771"), ['USA', 'Netherlands', 'Australia']),
    primaryEndpoint: 'Change in ADAS-Cog score at 18 months',
    status: 'recruiting',
    estimatedCompletion: new Date('2026-06-30'),
    budget: 156000000,
    spent: 67000000
  }), stryMutAct_9fa48("29778") ? {} : (stryCov_9fa48("29778"), {
    id: 'trial-003',
    name: 'ONCO-TARGET Phase I',
    drug: 'CDX-1234',
    phase: 'phase1',
    indication: 'Non-Small Cell Lung Cancer',
    enrollmentTarget: 120,
    enrollmentActual: 89,
    sites: 12,
    countries: stryMutAct_9fa48("29784") ? [] : (stryCov_9fa48("29784"), ['USA']),
    primaryEndpoint: 'Maximum tolerated dose, safety profile',
    status: 'active',
    estimatedCompletion: new Date('2025-03-31'),
    budget: 42000000,
    spent: 28000000
  })]);
  return generateClinicalTrials;
})());
const generateDrugCandidates = stryMutAct_9fa48("29789") ? () => undefined : (stryCov_9fa48("29789"), (() => {
  const generateDrugCandidates = (): DrugCandidate[] => stryMutAct_9fa48("29790") ? [] : (stryCov_9fa48("29790"), [stryMutAct_9fa48("29791") ? {} : (stryCov_9fa48("29791"), {
    id: 'drug-001',
    name: 'CDX-4521',
    targetIndication: 'Chronic Heart Failure',
    mechanism: 'Myocardial regeneration via stem cell activation',
    phase: 'phase3',
    efficacyScore: 78,
    safetyScore: 85,
    marketPotential: 4500000000,
    developmentCost: 890000000,
    timeToMarket: 2.5,
    competitorCount: 3,
    patentExpiry: new Date('2038-06-15')
  }), stryMutAct_9fa48("29798") ? {} : (stryCov_9fa48("29798"), {
    id: 'drug-002',
    name: 'CDX-7892',
    targetIndication: "Alzheimer's Disease",
    mechanism: 'Tau protein aggregation inhibitor',
    phase: 'phase2',
    efficacyScore: 65,
    safetyScore: 92,
    marketPotential: 12000000000,
    developmentCost: 1200000000,
    timeToMarket: 5.5,
    competitorCount: 8,
    patentExpiry: new Date('2041-03-22')
  }), stryMutAct_9fa48("29805") ? {} : (stryCov_9fa48("29805"), {
    id: 'drug-003',
    name: 'CDX-1234',
    targetIndication: 'Non-Small Cell Lung Cancer',
    mechanism: 'Bispecific T-cell engager',
    phase: 'phase1',
    efficacyScore: 72,
    safetyScore: 68,
    marketPotential: 8500000000,
    developmentCost: 950000000,
    timeToMarket: 6.0,
    competitorCount: 12,
    patentExpiry: new Date('2042-09-08')
  })]);
  return generateDrugCandidates;
})());
const generateFDASubmissions = stryMutAct_9fa48("29812") ? () => undefined : (stryCov_9fa48("29812"), (() => {
  const generateFDASubmissions = (): FDASubmission[] => stryMutAct_9fa48("29813") ? [] : (stryCov_9fa48("29813"), [stryMutAct_9fa48("29814") ? {} : (stryCov_9fa48("29814"), {
    id: 'fda-001',
    type: 'NDA',
    productName: 'CDX-4521 (Cardiogenix)',
    status: 'preparation',
    completeness: 78,
    sections: stryMutAct_9fa48("29819") ? [] : (stryCov_9fa48("29819"), [stryMutAct_9fa48("29820") ? {} : (stryCov_9fa48("29820"), {
      name: 'Module 1: Administrative',
      status: 'complete',
      lastUpdated: new Date()
    }), stryMutAct_9fa48("29823") ? {} : (stryCov_9fa48("29823"), {
      name: 'Module 2: Summaries',
      status: 'in-progress',
      lastUpdated: new Date()
    }), stryMutAct_9fa48("29826") ? {} : (stryCov_9fa48("29826"), {
      name: 'Module 3: Quality',
      status: 'complete',
      lastUpdated: new Date()
    }), stryMutAct_9fa48("29829") ? {} : (stryCov_9fa48("29829"), {
      name: 'Module 4: Nonclinical',
      status: 'complete',
      lastUpdated: new Date()
    }), stryMutAct_9fa48("29832") ? {} : (stryCov_9fa48("29832"), {
      name: 'Module 5: Clinical',
      status: 'in-progress',
      lastUpdated: new Date()
    })]),
    reviewerQuestions: 0,
    openIssues: 12
  }), stryMutAct_9fa48("29835") ? {} : (stryCov_9fa48("29835"), {
    id: 'fda-002',
    type: '510k',
    productName: 'CardioMonitor AI v3.0',
    status: 'under-review',
    submissionDate: new Date(stryMutAct_9fa48("29840") ? Date.now() + 45 * 24 * 60 * 60 * 1000 : (stryCov_9fa48("29840"), Date.now() - (stryMutAct_9fa48("29841") ? 45 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("29841"), (stryMutAct_9fa48("29842") ? 45 * 24 * 60 / 60 : (stryCov_9fa48("29842"), (stryMutAct_9fa48("29843") ? 45 * 24 / 60 : (stryCov_9fa48("29843"), (stryMutAct_9fa48("29844") ? 45 / 24 : (stryCov_9fa48("29844"), 45 * 24)) * 60)) * 60)) * 1000)))),
    completeness: 100,
    sections: stryMutAct_9fa48("29845") ? [] : (stryCov_9fa48("29845"), [stryMutAct_9fa48("29846") ? {} : (stryCov_9fa48("29846"), {
      name: 'Device Description',
      status: 'complete',
      lastUpdated: new Date()
    }), stryMutAct_9fa48("29849") ? {} : (stryCov_9fa48("29849"), {
      name: 'Substantial Equivalence',
      status: 'complete',
      lastUpdated: new Date()
    }), stryMutAct_9fa48("29852") ? {} : (stryCov_9fa48("29852"), {
      name: 'Performance Testing',
      status: 'complete',
      lastUpdated: new Date()
    }), stryMutAct_9fa48("29855") ? {} : (stryCov_9fa48("29855"), {
      name: 'Software Documentation',
      status: 'complete',
      lastUpdated: new Date()
    })]),
    reviewerQuestions: 3,
    openIssues: 1
  })]);
  return generateFDASubmissions;
})());
const generateAdverseEventPredictions = stryMutAct_9fa48("29858") ? () => undefined : (stryCov_9fa48("29858"), (() => {
  const generateAdverseEventPredictions = (): AdverseEventPrediction[] => stryMutAct_9fa48("29859") ? [] : (stryCov_9fa48("29859"), [stryMutAct_9fa48("29860") ? {} : (stryCov_9fa48("29860"), {
    id: 'ae-001',
    patientId: 'PT-28471',
    eventType: 'Cardiac Arrest',
    probability: 0.23,
    timeframe: '72 hours',
    riskFactors: stryMutAct_9fa48("29865") ? [] : (stryCov_9fa48("29865"), ['Elevated troponin', 'Arrhythmia history', 'Low EF']),
    recommendedActions: stryMutAct_9fa48("29869") ? [] : (stryCov_9fa48("29869"), ['ICU transfer', 'Continuous monitoring', 'Cardiology consult']),
    confidence: 0.89,
    modelVersion: 'CardioPredict v4.2'
  }), stryMutAct_9fa48("29874") ? {} : (stryCov_9fa48("29874"), {
    id: 'ae-002',
    patientId: 'PT-19283',
    eventType: 'Sepsis',
    probability: 0.18,
    timeframe: '48 hours',
    riskFactors: stryMutAct_9fa48("29879") ? [] : (stryCov_9fa48("29879"), ['Post-surgical', 'Elevated WBC', 'Fever trend']),
    recommendedActions: stryMutAct_9fa48("29883") ? [] : (stryCov_9fa48("29883"), ['Blood cultures', 'Broad-spectrum antibiotics', 'Fluid resuscitation']),
    confidence: 0.92,
    modelVersion: 'SepsisAlert v2.8'
  }), stryMutAct_9fa48("29888") ? {} : (stryCov_9fa48("29888"), {
    id: 'ae-003',
    patientId: 'PT-34521',
    eventType: 'Fall',
    probability: 0.45,
    timeframe: '24 hours',
    riskFactors: stryMutAct_9fa48("29893") ? [] : (stryCov_9fa48("29893"), ['Age >75', 'Sedative medication', 'Cognitive impairment', 'History of falls']),
    recommendedActions: stryMutAct_9fa48("29898") ? [] : (stryCov_9fa48("29898"), ['Bed alarm', 'Fall precautions', 'PT evaluation', 'Medication review']),
    confidence: 0.85,
    modelVersion: 'FallRisk v3.1'
  })]);
  return generateAdverseEventPredictions;
})());
const generateGeneticModels = stryMutAct_9fa48("29904") ? () => undefined : (stryCov_9fa48("29904"), (() => {
  const generateGeneticModels = (): GeneticRiskModel[] => stryMutAct_9fa48("29905") ? [] : (stryCov_9fa48("29905"), [stryMutAct_9fa48("29906") ? {} : (stryCov_9fa48("29906"), {
    id: 'gen-001',
    name: 'BRCA Comprehensive',
    condition: 'Breast/Ovarian Cancer',
    genes: stryMutAct_9fa48("29910") ? [] : (stryCov_9fa48("29910"), ['BRCA1', 'BRCA2', 'PALB2', 'CHEK2', 'ATM']),
    populationRisk: 12.5,
    modelAccuracy: 94.2,
    sampleSize: 287000,
    lastValidated: new Date(stryMutAct_9fa48("29916") ? Date.now() + 30 * 24 * 60 * 60 * 1000 : (stryCov_9fa48("29916"), Date.now() - (stryMutAct_9fa48("29917") ? 30 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("29917"), (stryMutAct_9fa48("29918") ? 30 * 24 * 60 / 60 : (stryCov_9fa48("29918"), (stryMutAct_9fa48("29919") ? 30 * 24 / 60 : (stryCov_9fa48("29919"), (stryMutAct_9fa48("29920") ? 30 / 24 : (stryCov_9fa48("29920"), 30 * 24)) * 60)) * 60)) * 1000)))),
    publications: 847
  }), stryMutAct_9fa48("29921") ? {} : (stryCov_9fa48("29921"), {
    id: 'gen-002',
    name: 'Cardiovascular PRS',
    condition: 'Coronary Artery Disease',
    genes: stryMutAct_9fa48("29925") ? [] : (stryCov_9fa48("29925"), ['PCSK9', 'LDLR', 'APOB', 'LPA', '9p21']),
    populationRisk: 8.2,
    modelAccuracy: 87.5,
    sampleSize: 1200000,
    lastValidated: new Date(stryMutAct_9fa48("29931") ? Date.now() + 60 * 24 * 60 * 60 * 1000 : (stryCov_9fa48("29931"), Date.now() - (stryMutAct_9fa48("29932") ? 60 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("29932"), (stryMutAct_9fa48("29933") ? 60 * 24 * 60 / 60 : (stryCov_9fa48("29933"), (stryMutAct_9fa48("29934") ? 60 * 24 / 60 : (stryCov_9fa48("29934"), (stryMutAct_9fa48("29935") ? 60 / 24 : (stryCov_9fa48("29935"), 60 * 24)) * 60)) * 60)) * 1000)))),
    publications: 1234
  }), stryMutAct_9fa48("29936") ? {} : (stryCov_9fa48("29936"), {
    id: 'gen-003',
    name: "Alzheimer's Risk Panel",
    condition: "Alzheimer's Disease",
    genes: stryMutAct_9fa48("29940") ? [] : (stryCov_9fa48("29940"), ['APOE', 'TREM2', 'CLU', 'PICALM', 'CR1']),
    populationRisk: 10.7,
    modelAccuracy: 82.1,
    sampleSize: 456000,
    lastValidated: new Date(stryMutAct_9fa48("29946") ? Date.now() + 45 * 24 * 60 * 60 * 1000 : (stryCov_9fa48("29946"), Date.now() - (stryMutAct_9fa48("29947") ? 45 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("29947"), (stryMutAct_9fa48("29948") ? 45 * 24 * 60 / 60 : (stryCov_9fa48("29948"), (stryMutAct_9fa48("29949") ? 45 * 24 / 60 : (stryCov_9fa48("29949"), (stryMutAct_9fa48("29950") ? 45 / 24 : (stryCov_9fa48("29950"), 45 * 24)) * 60)) * 60)) * 1000)))),
    publications: 2341
  })]);
  return generateGeneticModels;
})());
const calculateMetrics = stryMutAct_9fa48("29951") ? () => undefined : (stryCov_9fa48("29951"), (() => {
  const calculateMetrics = (): HealthcareMetrics => stryMutAct_9fa48("29952") ? {} : (stryCov_9fa48("29952"), {
    totalPatients: 11285,
    avgOutcomeScore: 76.5,
    readmissionRate: 14.2,
    adverseEventRate: 3.8,
    avgLOS: 4.8,
    patientSatisfaction: 87.3,
    clinicalTrialsActive: 12,
    fdaSubmissionsPending: 3,
    drugCandidatesPipeline: 8,
    researchSpend: 890000000
  });
  return calculateMetrics;
})());

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const GenomicsPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'patients' | 'trials' | 'pipeline' | 'regulatory' | 'genomics'>('overview');
  const [patientCohorts] = useState<PatientCohort[]>(generatePatientCohorts);
  const [clinicalTrials] = useState<ClinicalTrial[]>(generateClinicalTrials);
  const [drugCandidates] = useState<DrugCandidate[]>(generateDrugCandidates);
  const [fdaSubmissions] = useState<FDASubmission[]>(generateFDASubmissions);
  const [adverseEvents] = useState<AdverseEventPrediction[]>(generateAdverseEventPredictions);
  const [geneticModels] = useState<GeneticRiskModel[]>(generateGeneticModels);
  const [isLoading, setIsLoading] = useState(stryMutAct_9fa48("29955") ? false : (stryCov_9fa48("29955"), true));

  // Fetch real data from API
  useEffect(() => {
    const fetchGenomicsData = async () => {
      try {
        const [regulatoryRes, preMortemRes] = await Promise.all(stryMutAct_9fa48("29959") ? [] : (stryCov_9fa48("29959"), [decisionIntelApi.getRegulatoryItems(), decisionIntelApi.getPreMortemAnalyses()]));
        if (stryMutAct_9fa48("29962") ? regulatoryRes.success || regulatoryRes.data : stryMutAct_9fa48("29961") ? false : stryMutAct_9fa48("29960") ? true : (stryCov_9fa48("29960", "29961", "29962"), regulatoryRes.success && regulatoryRes.data)) {
          console.log('[Genomics] Loaded', regulatoryRes.data.length, 'regulatory items');
        }
        if (stryMutAct_9fa48("29968") ? preMortemRes.success || preMortemRes.data : stryMutAct_9fa48("29967") ? false : stryMutAct_9fa48("29966") ? true : (stryCov_9fa48("29966", "29967", "29968"), preMortemRes.success && preMortemRes.data)) {
          console.log('[Genomics] Loaded', preMortemRes.data.length, 'risk analyses');
        }
      } catch (error) {
        console.log('[Genomics] Using local generators (API unavailable)');
      } finally {
        setIsLoading(stryMutAct_9fa48("29975") ? true : (stryCov_9fa48("29975"), false));
      }
    };
    fetchGenomicsData();
  }, stryMutAct_9fa48("29976") ? ["Stryker was here"] : (stryCov_9fa48("29976"), []));
  const metrics = useMemo(stryMutAct_9fa48("29977") ? () => undefined : (stryCov_9fa48("29977"), () => calculateMetrics()), stryMutAct_9fa48("29978") ? ["Stryker was here"] : (stryCov_9fa48("29978"), []));
  return <div className="min-h-screen bg-gradient-to-br from-teal-950 via-cyan-950 to-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-teal-800/50 bg-black/20 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={stryMutAct_9fa48("29979") ? () => undefined : (stryCov_9fa48("29979"), () => navigate('/cortex/dashboard'))} className="text-white/60 hover:text-white transition-colors">
                ← Back
              </button>
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-3">
                  <span className="text-3xl">🧬</span>
                  CendiaGenomics™
                  <span className="text-xs bg-gradient-to-r from-teal-500 to-cyan-500 px-2 py-0.5 rounded-full font-medium">
                    HEALTHCARE
                  </span>
                </h1>
                <p className="text-teal-300 text-sm">Healthcare & Life Sciences Pack • HIPAA Compliant</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="px-3 py-1.5 bg-green-600/20 border border-green-500/30 rounded-lg">
                <span className="text-green-400 text-sm font-medium">🔒 HIPAA Compliant</span>
              </div>
              <div className="text-right">
                <div className="text-sm text-white/60">Pipeline Value</div>
                <div className="text-xl font-bold text-teal-400">${(stryMutAct_9fa48("29981") ? drugCandidates.reduce((s, d) => s + d.marketPotential, 0) * 1e9 : (stryCov_9fa48("29981"), drugCandidates.reduce(stryMutAct_9fa48("29982") ? () => undefined : (stryCov_9fa48("29982"), (s, d) => stryMutAct_9fa48("29983") ? s - d.marketPotential : (stryCov_9fa48("29983"), s + d.marketPotential)), 0) / 1e9)).toFixed(1)}B</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Metrics Bar */}
      <div className="bg-gradient-to-r from-teal-900/30 to-cyan-900/30 border-b border-teal-800/30">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="grid grid-cols-8 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-white">{metrics.totalPatients.toLocaleString()}</div>
              <div className="text-xs text-teal-300">Total Patients</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-400">{metrics.avgOutcomeScore}%</div>
              <div className="text-xs text-teal-300">Outcome Score</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-amber-400">{metrics.readmissionRate}%</div>
              <div className="text-xs text-teal-300">Readmission</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-400">{metrics.adverseEventRate}%</div>
              <div className="text-xs text-teal-300">Adverse Events</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-cyan-400">{metrics.clinicalTrialsActive}</div>
              <div className="text-xs text-teal-300">Active Trials</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-400">{metrics.drugCandidatesPipeline}</div>
              <div className="text-xs text-teal-300">Pipeline Drugs</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-400">{metrics.fdaSubmissionsPending}</div>
              <div className="text-xs text-teal-300">FDA Pending</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-400">${(stryMutAct_9fa48("29984") ? metrics.researchSpend * 1e6 : (stryCov_9fa48("29984"), metrics.researchSpend / 1e6)).toFixed(0)}M</div>
              <div className="text-xs text-teal-300">R&D Spend</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-teal-800/30 bg-black/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1">
            {(stryMutAct_9fa48("29985") ? [] : (stryCov_9fa48("29985"), [stryMutAct_9fa48("29986") ? {} : (stryCov_9fa48("29986"), {
            id: 'overview',
            label: 'Overview',
            icon: '📊'
          }), stryMutAct_9fa48("29990") ? {} : (stryCov_9fa48("29990"), {
            id: 'patients',
            label: 'Patient Intelligence',
            icon: '👥'
          }), stryMutAct_9fa48("29994") ? {} : (stryCov_9fa48("29994"), {
            id: 'trials',
            label: 'Clinical Trials',
            icon: '🔬'
          }), stryMutAct_9fa48("29998") ? {} : (stryCov_9fa48("29998"), {
            id: 'pipeline',
            label: 'Drug Pipeline',
            icon: '💊'
          }), stryMutAct_9fa48("30002") ? {} : (stryCov_9fa48("30002"), {
            id: 'regulatory',
            label: 'FDA Submissions',
            icon: '📋'
          }), stryMutAct_9fa48("30006") ? {} : (stryCov_9fa48("30006"), {
            id: 'genomics',
            label: 'Genetic Models',
            icon: '🧬'
          })])).map(stryMutAct_9fa48("30010") ? () => undefined : (stryCov_9fa48("30010"), tab => <button key={tab.id} onClick={stryMutAct_9fa48("30011") ? () => undefined : (stryCov_9fa48("30011"), () => setActiveTab(tab.id as any))} className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 ${(stryMutAct_9fa48("30015") ? activeTab !== tab.id : stryMutAct_9fa48("30014") ? false : stryMutAct_9fa48("30013") ? true : (stryCov_9fa48("30013", "30014", "30015"), activeTab === tab.id)) ? 'border-teal-400 text-white bg-teal-900/20' : 'border-transparent text-white/60 hover:text-white hover:bg-white/5'}`}>
                {tab.icon} {tab.label}
              </button>))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-6">
        {stryMutAct_9fa48("30020") ? activeTab === 'overview' || <div className="space-y-6">
            {/* Adverse Event Alerts */}
            <div className="bg-black/30 rounded-2xl p-6 border border-red-800/50">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span className="text-red-400">🚨</span> AI-Predicted Adverse Events
              </h2>
              <div className="grid grid-cols-3 gap-4">
                {adverseEvents.map(ae => <div key={ae.id} className={`p-4 rounded-xl border ${ae.probability > 0.3 ? 'bg-red-900/20 border-red-700/50' : ae.probability > 0.15 ? 'bg-amber-900/20 border-amber-700/50' : 'bg-yellow-900/20 border-yellow-700/50'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-sm text-white/60">{ae.patientId}</span>
                      <span className={`text-xl font-bold ${ae.probability > 0.3 ? 'text-red-400' : ae.probability > 0.15 ? 'text-amber-400' : 'text-yellow-400'}`}>{(ae.probability * 100).toFixed(0)}%</span>
                    </div>
                    <h4 className="font-semibold mb-1">{ae.eventType}</h4>
                    <div className="text-xs text-white/50 mb-2">Within {ae.timeframe}</div>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {ae.riskFactors.slice(0, 2).map(rf => <span key={rf} className="text-xs px-2 py-0.5 bg-black/30 rounded">{rf}</span>)}
                    </div>
                    <div className="text-xs text-white/40">
                      Model: {ae.modelVersion} • {(ae.confidence * 100).toFixed(0)}% conf.
                    </div>
                  </div>)}
              </div>
            </div>

            {/* Clinical Domains */}
            <div className="bg-black/30 rounded-2xl p-6 border border-teal-800/50">
              <h2 className="text-lg font-semibold mb-4">Clinical Domains</h2>
              <div className="grid grid-cols-7 gap-4">
                {(Object.entries(DOMAIN_CONFIG) as [ClinicalDomain, typeof DOMAIN_CONFIG[ClinicalDomain]][]).map(([key, config]) => <div key={key} className="text-center p-4 bg-black/20 rounded-xl hover:bg-black/30 transition-colors cursor-pointer">
                    <div className={`w-14 h-14 mx-auto rounded-xl bg-gradient-to-br ${config.color} flex items-center justify-center text-2xl mb-2`}>
                      {config.icon}
                    </div>
                    <div className="font-medium text-sm">{config.name}</div>
                  </div>)}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-6">
              {/* Active Trials */}
              <div className="bg-black/30 rounded-2xl p-6 border border-teal-800/50">
                <h3 className="text-lg font-semibold mb-4">Active Clinical Trials</h3>
                <div className="space-y-3">
                  {clinicalTrials.slice(0, 3).map(trial => <div key={trial.id} className="p-4 bg-black/20 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold">{trial.name}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${trial.phase === 'phase3' ? 'bg-green-600' : trial.phase === 'phase2' ? 'bg-blue-600' : 'bg-purple-600'}`}>{trial.phase.toUpperCase()}</span>
                      </div>
                      <div className="text-sm text-white/60 mb-2">{trial.indication}</div>
                      <div className="flex justify-between text-xs">
                        <span>Enrollment: {trial.enrollmentActual}/{trial.enrollmentTarget}</span>
                        <span>{trial.sites} sites • {trial.countries.length} countries</span>
                      </div>
                      <div className="mt-2 h-2 bg-black/30 rounded-full overflow-hidden">
                        <div className="h-full bg-teal-500" style={{
                    width: `${trial.enrollmentActual / trial.enrollmentTarget * 100}%`
                  }} />
                      </div>
                    </div>)}
                </div>
              </div>

              {/* FDA Submissions */}
              <div className="bg-black/30 rounded-2xl p-6 border border-teal-800/50">
                <h3 className="text-lg font-semibold mb-4">FDA Submissions</h3>
                <div className="space-y-3">
                  {fdaSubmissions.map(sub => <div key={sub.id} className="p-4 bg-black/20 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <span className="font-semibold">{sub.productName}</span>
                          <span className="ml-2 text-xs px-2 py-0.5 bg-teal-900 rounded">{sub.type}</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-xs ${sub.status === 'approved' ? 'bg-green-600' : sub.status === 'under-review' ? 'bg-blue-600' : sub.status === 'preparation' ? 'bg-amber-600' : 'bg-neutral-600'}`}>{sub.status}</span>
                      </div>
                      <div className="flex justify-between text-sm text-white/60 mb-2">
                        <span>Completeness: {sub.completeness}%</span>
                        <span>{sub.openIssues} open issues</span>
                      </div>
                      <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-teal-500 to-cyan-500" style={{
                    width: `${sub.completeness}%`
                  }} />
                      </div>
                    </div>)}
                </div>
              </div>
            </div>
          </div> : stryMutAct_9fa48("30019") ? false : stryMutAct_9fa48("30018") ? true : (stryCov_9fa48("30018", "30019", "30020"), (stryMutAct_9fa48("30022") ? activeTab !== 'overview' : stryMutAct_9fa48("30021") ? true : (stryCov_9fa48("30021", "30022"), activeTab === 'overview')) && <div className="space-y-6">
            {/* Adverse Event Alerts */}
            <div className="bg-black/30 rounded-2xl p-6 border border-red-800/50">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span className="text-red-400">🚨</span> AI-Predicted Adverse Events
              </h2>
              <div className="grid grid-cols-3 gap-4">
                {adverseEvents.map(stryMutAct_9fa48("30024") ? () => undefined : (stryCov_9fa48("30024"), ae => <div key={ae.id} className={`p-4 rounded-xl border ${(stryMutAct_9fa48("30029") ? ae.probability <= 0.3 : stryMutAct_9fa48("30028") ? ae.probability >= 0.3 : stryMutAct_9fa48("30027") ? false : stryMutAct_9fa48("30026") ? true : (stryCov_9fa48("30026", "30027", "30028", "30029"), ae.probability > 0.3)) ? 'bg-red-900/20 border-red-700/50' : (stryMutAct_9fa48("30034") ? ae.probability <= 0.15 : stryMutAct_9fa48("30033") ? ae.probability >= 0.15 : stryMutAct_9fa48("30032") ? false : stryMutAct_9fa48("30031") ? true : (stryCov_9fa48("30031", "30032", "30033", "30034"), ae.probability > 0.15)) ? 'bg-amber-900/20 border-amber-700/50' : 'bg-yellow-900/20 border-yellow-700/50'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-sm text-white/60">{ae.patientId}</span>
                      <span className={`text-xl font-bold ${(stryMutAct_9fa48("30041") ? ae.probability <= 0.3 : stryMutAct_9fa48("30040") ? ae.probability >= 0.3 : stryMutAct_9fa48("30039") ? false : stryMutAct_9fa48("30038") ? true : (stryCov_9fa48("30038", "30039", "30040", "30041"), ae.probability > 0.3)) ? 'text-red-400' : (stryMutAct_9fa48("30046") ? ae.probability <= 0.15 : stryMutAct_9fa48("30045") ? ae.probability >= 0.15 : stryMutAct_9fa48("30044") ? false : stryMutAct_9fa48("30043") ? true : (stryCov_9fa48("30043", "30044", "30045", "30046"), ae.probability > 0.15)) ? 'text-amber-400' : 'text-yellow-400'}`}>{(stryMutAct_9fa48("30049") ? ae.probability / 100 : (stryCov_9fa48("30049"), ae.probability * 100)).toFixed(0)}%</span>
                    </div>
                    <h4 className="font-semibold mb-1">{ae.eventType}</h4>
                    <div className="text-xs text-white/50 mb-2">Within {ae.timeframe}</div>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {stryMutAct_9fa48("30050") ? ae.riskFactors.map(rf => <span key={rf} className="text-xs px-2 py-0.5 bg-black/30 rounded">{rf}</span>) : (stryCov_9fa48("30050"), ae.riskFactors.slice(0, 2).map(stryMutAct_9fa48("30051") ? () => undefined : (stryCov_9fa48("30051"), rf => <span key={rf} className="text-xs px-2 py-0.5 bg-black/30 rounded">{rf}</span>)))}
                    </div>
                    <div className="text-xs text-white/40">
                      Model: {ae.modelVersion} • {(stryMutAct_9fa48("30052") ? ae.confidence / 100 : (stryCov_9fa48("30052"), ae.confidence * 100)).toFixed(0)}% conf.
                    </div>
                  </div>))}
              </div>
            </div>

            {/* Clinical Domains */}
            <div className="bg-black/30 rounded-2xl p-6 border border-teal-800/50">
              <h2 className="text-lg font-semibold mb-4">Clinical Domains</h2>
              <div className="grid grid-cols-7 gap-4">
                {(Object.entries(DOMAIN_CONFIG) as [ClinicalDomain, typeof DOMAIN_CONFIG[ClinicalDomain]][]).map(stryMutAct_9fa48("30053") ? () => undefined : (stryCov_9fa48("30053"), ([key, config]) => <div key={key} className="text-center p-4 bg-black/20 rounded-xl hover:bg-black/30 transition-colors cursor-pointer">
                    <div className={`w-14 h-14 mx-auto rounded-xl bg-gradient-to-br ${config.color} flex items-center justify-center text-2xl mb-2`}>
                      {config.icon}
                    </div>
                    <div className="font-medium text-sm">{config.name}</div>
                  </div>))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-6">
              {/* Active Trials */}
              <div className="bg-black/30 rounded-2xl p-6 border border-teal-800/50">
                <h3 className="text-lg font-semibold mb-4">Active Clinical Trials</h3>
                <div className="space-y-3">
                  {stryMutAct_9fa48("30055") ? clinicalTrials.map(trial => <div key={trial.id} className="p-4 bg-black/20 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold">{trial.name}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${trial.phase === 'phase3' ? 'bg-green-600' : trial.phase === 'phase2' ? 'bg-blue-600' : 'bg-purple-600'}`}>{trial.phase.toUpperCase()}</span>
                      </div>
                      <div className="text-sm text-white/60 mb-2">{trial.indication}</div>
                      <div className="flex justify-between text-xs">
                        <span>Enrollment: {trial.enrollmentActual}/{trial.enrollmentTarget}</span>
                        <span>{trial.sites} sites • {trial.countries.length} countries</span>
                      </div>
                      <div className="mt-2 h-2 bg-black/30 rounded-full overflow-hidden">
                        <div className="h-full bg-teal-500" style={{
                    width: `${trial.enrollmentActual / trial.enrollmentTarget * 100}%`
                  }} />
                      </div>
                    </div>) : (stryCov_9fa48("30055"), clinicalTrials.slice(0, 3).map(stryMutAct_9fa48("30056") ? () => undefined : (stryCov_9fa48("30056"), trial => <div key={trial.id} className="p-4 bg-black/20 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold">{trial.name}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${(stryMutAct_9fa48("30060") ? trial.phase !== 'phase3' : stryMutAct_9fa48("30059") ? false : stryMutAct_9fa48("30058") ? true : (stryCov_9fa48("30058", "30059", "30060"), trial.phase === 'phase3')) ? 'bg-green-600' : (stryMutAct_9fa48("30065") ? trial.phase !== 'phase2' : stryMutAct_9fa48("30064") ? false : stryMutAct_9fa48("30063") ? true : (stryCov_9fa48("30063", "30064", "30065"), trial.phase === 'phase2')) ? 'bg-blue-600' : 'bg-purple-600'}`}>{stryMutAct_9fa48("30069") ? trial.phase.toLowerCase() : (stryCov_9fa48("30069"), trial.phase.toUpperCase())}</span>
                      </div>
                      <div className="text-sm text-white/60 mb-2">{trial.indication}</div>
                      <div className="flex justify-between text-xs">
                        <span>Enrollment: {trial.enrollmentActual}/{trial.enrollmentTarget}</span>
                        <span>{trial.sites} sites • {trial.countries.length} countries</span>
                      </div>
                      <div className="mt-2 h-2 bg-black/30 rounded-full overflow-hidden">
                        <div className="h-full bg-teal-500" style={stryMutAct_9fa48("30070") ? {} : (stryCov_9fa48("30070"), {
                    width: `${stryMutAct_9fa48("30072") ? trial.enrollmentActual / trial.enrollmentTarget / 100 : (stryCov_9fa48("30072"), (stryMutAct_9fa48("30073") ? trial.enrollmentActual * trial.enrollmentTarget : (stryCov_9fa48("30073"), trial.enrollmentActual / trial.enrollmentTarget)) * 100)}%`
                  })} />
                      </div>
                    </div>)))}
                </div>
              </div>

              {/* FDA Submissions */}
              <div className="bg-black/30 rounded-2xl p-6 border border-teal-800/50">
                <h3 className="text-lg font-semibold mb-4">FDA Submissions</h3>
                <div className="space-y-3">
                  {fdaSubmissions.map(stryMutAct_9fa48("30074") ? () => undefined : (stryCov_9fa48("30074"), sub => <div key={sub.id} className="p-4 bg-black/20 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <span className="font-semibold">{sub.productName}</span>
                          <span className="ml-2 text-xs px-2 py-0.5 bg-teal-900 rounded">{sub.type}</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-xs ${(stryMutAct_9fa48("30078") ? sub.status !== 'approved' : stryMutAct_9fa48("30077") ? false : stryMutAct_9fa48("30076") ? true : (stryCov_9fa48("30076", "30077", "30078"), sub.status === 'approved')) ? 'bg-green-600' : (stryMutAct_9fa48("30083") ? sub.status !== 'under-review' : stryMutAct_9fa48("30082") ? false : stryMutAct_9fa48("30081") ? true : (stryCov_9fa48("30081", "30082", "30083"), sub.status === 'under-review')) ? 'bg-blue-600' : (stryMutAct_9fa48("30088") ? sub.status !== 'preparation' : stryMutAct_9fa48("30087") ? false : stryMutAct_9fa48("30086") ? true : (stryCov_9fa48("30086", "30087", "30088"), sub.status === 'preparation')) ? 'bg-amber-600' : 'bg-neutral-600'}`}>{sub.status}</span>
                      </div>
                      <div className="flex justify-between text-sm text-white/60 mb-2">
                        <span>Completeness: {sub.completeness}%</span>
                        <span>{sub.openIssues} open issues</span>
                      </div>
                      <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-teal-500 to-cyan-500" style={stryMutAct_9fa48("30092") ? {} : (stryCov_9fa48("30092"), {
                    width: `${sub.completeness}%`
                  })} />
                      </div>
                    </div>))}
                </div>
              </div>
            </div>
          </div>)}

        {stryMutAct_9fa48("30096") ? activeTab === 'patients' || <div className="space-y-6">
            <div className="bg-gradient-to-r from-teal-900/30 to-cyan-900/30 rounded-2xl p-6 border border-teal-700/50">
              <h2 className="text-lg font-semibold mb-2">🏥 Patient Intelligence Platform</h2>
              <p className="text-white/60">
                AI-powered patient flow optimization, outcome prediction, and risk stratification.
                All data is HIPAA-compliant and de-identified for analytics.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {patientCohorts.map(cohort => <div key={cohort.id} className="bg-black/30 rounded-2xl p-6 border border-teal-800/50">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">{cohort.name}</h3>
                    <span className={`px-3 py-1 rounded-lg text-sm ${cohort.riskProfile === 'critical' ? 'bg-red-600' : cohort.riskProfile === 'high' ? 'bg-amber-600' : cohort.riskProfile === 'moderate' ? 'bg-yellow-600' : 'bg-green-600'}`}>{cohort.riskProfile} risk</span>
                  </div>

                  <div className="mb-4">
                    <div className="text-sm text-white/60">{cohort.primaryCondition}</div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {cohort.comorbidities.map(c => <span key={c} className="text-xs px-2 py-0.5 bg-teal-900/50 rounded">{c}</span>)}
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-3">
                    <div className="text-center p-3 bg-black/20 rounded-xl">
                      <div className="text-xl font-bold text-cyan-400">{cohort.size.toLocaleString()}</div>
                      <div className="text-xs text-white/50">Patients</div>
                    </div>
                    <div className="text-center p-3 bg-black/20 rounded-xl">
                      <div className="text-xl font-bold">{cohort.avgAge}</div>
                      <div className="text-xs text-white/50">Avg Age</div>
                    </div>
                    <div className="text-center p-3 bg-black/20 rounded-xl">
                      <div className="text-xl font-bold text-amber-400">{cohort.avgLOS}</div>
                      <div className="text-xs text-white/50">Avg LOS (days)</div>
                    </div>
                    <div className="text-center p-3 bg-black/20 rounded-xl">
                      <div className={`text-xl font-bold ${cohort.predictedOutcome >= 70 ? 'text-green-400' : 'text-red-400'}`}>
                        {cohort.predictedOutcome}%
                      </div>
                      <div className="text-xs text-white/50">Predicted Outcome</div>
                    </div>
                  </div>
                </div>)}
            </div>
          </div> : stryMutAct_9fa48("30095") ? false : stryMutAct_9fa48("30094") ? true : (stryCov_9fa48("30094", "30095", "30096"), (stryMutAct_9fa48("30098") ? activeTab !== 'patients' : stryMutAct_9fa48("30097") ? true : (stryCov_9fa48("30097", "30098"), activeTab === 'patients')) && <div className="space-y-6">
            <div className="bg-gradient-to-r from-teal-900/30 to-cyan-900/30 rounded-2xl p-6 border border-teal-700/50">
              <h2 className="text-lg font-semibold mb-2">🏥 Patient Intelligence Platform</h2>
              <p className="text-white/60">
                AI-powered patient flow optimization, outcome prediction, and risk stratification.
                All data is HIPAA-compliant and de-identified for analytics.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {patientCohorts.map(stryMutAct_9fa48("30100") ? () => undefined : (stryCov_9fa48("30100"), cohort => <div key={cohort.id} className="bg-black/30 rounded-2xl p-6 border border-teal-800/50">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">{cohort.name}</h3>
                    <span className={`px-3 py-1 rounded-lg text-sm ${(stryMutAct_9fa48("30104") ? cohort.riskProfile !== 'critical' : stryMutAct_9fa48("30103") ? false : stryMutAct_9fa48("30102") ? true : (stryCov_9fa48("30102", "30103", "30104"), cohort.riskProfile === 'critical')) ? 'bg-red-600' : (stryMutAct_9fa48("30109") ? cohort.riskProfile !== 'high' : stryMutAct_9fa48("30108") ? false : stryMutAct_9fa48("30107") ? true : (stryCov_9fa48("30107", "30108", "30109"), cohort.riskProfile === 'high')) ? 'bg-amber-600' : (stryMutAct_9fa48("30114") ? cohort.riskProfile !== 'moderate' : stryMutAct_9fa48("30113") ? false : stryMutAct_9fa48("30112") ? true : (stryCov_9fa48("30112", "30113", "30114"), cohort.riskProfile === 'moderate')) ? 'bg-yellow-600' : 'bg-green-600'}`}>{cohort.riskProfile} risk</span>
                  </div>

                  <div className="mb-4">
                    <div className="text-sm text-white/60">{cohort.primaryCondition}</div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {cohort.comorbidities.map(stryMutAct_9fa48("30118") ? () => undefined : (stryCov_9fa48("30118"), c => <span key={c} className="text-xs px-2 py-0.5 bg-teal-900/50 rounded">{c}</span>))}
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-3">
                    <div className="text-center p-3 bg-black/20 rounded-xl">
                      <div className="text-xl font-bold text-cyan-400">{cohort.size.toLocaleString()}</div>
                      <div className="text-xs text-white/50">Patients</div>
                    </div>
                    <div className="text-center p-3 bg-black/20 rounded-xl">
                      <div className="text-xl font-bold">{cohort.avgAge}</div>
                      <div className="text-xs text-white/50">Avg Age</div>
                    </div>
                    <div className="text-center p-3 bg-black/20 rounded-xl">
                      <div className="text-xl font-bold text-amber-400">{cohort.avgLOS}</div>
                      <div className="text-xs text-white/50">Avg LOS (days)</div>
                    </div>
                    <div className="text-center p-3 bg-black/20 rounded-xl">
                      <div className={`text-xl font-bold ${(stryMutAct_9fa48("30123") ? cohort.predictedOutcome < 70 : stryMutAct_9fa48("30122") ? cohort.predictedOutcome > 70 : stryMutAct_9fa48("30121") ? false : stryMutAct_9fa48("30120") ? true : (stryCov_9fa48("30120", "30121", "30122", "30123"), cohort.predictedOutcome >= 70)) ? 'text-green-400' : 'text-red-400'}`}>
                        {cohort.predictedOutcome}%
                      </div>
                      <div className="text-xs text-white/50">Predicted Outcome</div>
                    </div>
                  </div>
                </div>))}
            </div>
          </div>)}

        {stryMutAct_9fa48("30128") ? activeTab === 'genomics' || <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-2xl p-6 border border-purple-700/50">
              <h2 className="text-lg font-semibold mb-2">🧬 Genetic Risk Models</h2>
              <p className="text-white/60">
                Population-scale genetic risk prediction models for major disease categories.
                Validated against large cohorts with peer-reviewed accuracy.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-6">
              {geneticModels.map(model => <div key={model.id} className="bg-black/30 rounded-2xl p-6 border border-teal-800/50">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-2xl">
                      🧬
                    </div>
                    <div>
                      <h3 className="font-semibold">{model.name}</h3>
                      <div className="text-sm text-white/50">{model.condition}</div>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between">
                      <span className="text-white/60">Model Accuracy</span>
                      <span className="font-bold text-green-400">{model.modelAccuracy}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Population Risk</span>
                      <span className="font-bold">{model.populationRisk}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Sample Size</span>
                      <span className="font-bold">{(model.sampleSize / 1000).toFixed(0)}K</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Publications</span>
                      <span className="font-bold text-cyan-400">{model.publications}</span>
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-white/50 mb-2">Target Genes</div>
                    <div className="flex flex-wrap gap-1">
                      {model.genes.map(gene => <span key={gene} className="text-xs px-2 py-1 bg-purple-900/50 rounded font-mono">{gene}</span>)}
                    </div>
                  </div>
                </div>)}
            </div>
          </div> : stryMutAct_9fa48("30127") ? false : stryMutAct_9fa48("30126") ? true : (stryCov_9fa48("30126", "30127", "30128"), (stryMutAct_9fa48("30130") ? activeTab !== 'genomics' : stryMutAct_9fa48("30129") ? true : (stryCov_9fa48("30129", "30130"), activeTab === 'genomics')) && <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-2xl p-6 border border-purple-700/50">
              <h2 className="text-lg font-semibold mb-2">🧬 Genetic Risk Models</h2>
              <p className="text-white/60">
                Population-scale genetic risk prediction models for major disease categories.
                Validated against large cohorts with peer-reviewed accuracy.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-6">
              {geneticModels.map(stryMutAct_9fa48("30132") ? () => undefined : (stryCov_9fa48("30132"), model => <div key={model.id} className="bg-black/30 rounded-2xl p-6 border border-teal-800/50">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-2xl">
                      🧬
                    </div>
                    <div>
                      <h3 className="font-semibold">{model.name}</h3>
                      <div className="text-sm text-white/50">{model.condition}</div>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between">
                      <span className="text-white/60">Model Accuracy</span>
                      <span className="font-bold text-green-400">{model.modelAccuracy}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Population Risk</span>
                      <span className="font-bold">{model.populationRisk}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Sample Size</span>
                      <span className="font-bold">{(stryMutAct_9fa48("30133") ? model.sampleSize * 1000 : (stryCov_9fa48("30133"), model.sampleSize / 1000)).toFixed(0)}K</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Publications</span>
                      <span className="font-bold text-cyan-400">{model.publications}</span>
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-white/50 mb-2">Target Genes</div>
                    <div className="flex flex-wrap gap-1">
                      {model.genes.map(stryMutAct_9fa48("30134") ? () => undefined : (stryCov_9fa48("30134"), gene => <span key={gene} className="text-xs px-2 py-1 bg-purple-900/50 rounded font-mono">{gene}</span>))}
                    </div>
                  </div>
                </div>))}
            </div>
          </div>)}

        {stryMutAct_9fa48("30137") ? activeTab === 'trials' || <div className="space-y-4">
            {clinicalTrials.map(trial => <div key={trial.id} className="bg-black/30 rounded-2xl p-6 border border-teal-800/50">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{trial.name}</h3>
                    <div className="text-sm text-white/50">{trial.drug} • {trial.indication}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-lg text-sm ${trial.status === 'active' ? 'bg-green-600' : trial.status === 'recruiting' ? 'bg-blue-600' : trial.status === 'completed' ? 'bg-purple-600' : 'bg-neutral-600'}`}>{trial.status}</span>
                    <span className={`px-3 py-1 rounded-lg text-sm bg-teal-900`}>{trial.phase.toUpperCase()}</span>
                  </div>
                </div>

                <div className="grid grid-cols-5 gap-4 mb-4">
                  <div className="text-center p-3 bg-black/20 rounded-xl">
                    <div className="text-xl font-bold text-cyan-400">{trial.enrollmentActual}/{trial.enrollmentTarget}</div>
                    <div className="text-xs text-white/50">Enrollment</div>
                  </div>
                  <div className="text-center p-3 bg-black/20 rounded-xl">
                    <div className="text-xl font-bold">{trial.sites}</div>
                    <div className="text-xs text-white/50">Sites</div>
                  </div>
                  <div className="text-center p-3 bg-black/20 rounded-xl">
                    <div className="text-xl font-bold">{trial.countries.length}</div>
                    <div className="text-xs text-white/50">Countries</div>
                  </div>
                  <div className="text-center p-3 bg-black/20 rounded-xl">
                    <div className="text-xl font-bold text-green-400">${(trial.spent / 1e6).toFixed(0)}M</div>
                    <div className="text-xs text-white/50">Spent</div>
                  </div>
                  <div className="text-center p-3 bg-black/20 rounded-xl">
                    <div className="text-xl font-bold">${(trial.budget / 1e6).toFixed(0)}M</div>
                    <div className="text-xs text-white/50">Budget</div>
                  </div>
                </div>

                <div className="p-3 bg-black/20 rounded-xl">
                  <div className="text-xs text-white/50 mb-1">Primary Endpoint</div>
                  <div className="text-sm">{trial.primaryEndpoint}</div>
                </div>
              </div>)}
          </div> : stryMutAct_9fa48("30136") ? false : stryMutAct_9fa48("30135") ? true : (stryCov_9fa48("30135", "30136", "30137"), (stryMutAct_9fa48("30139") ? activeTab !== 'trials' : stryMutAct_9fa48("30138") ? true : (stryCov_9fa48("30138", "30139"), activeTab === 'trials')) && <div className="space-y-4">
            {clinicalTrials.map(stryMutAct_9fa48("30141") ? () => undefined : (stryCov_9fa48("30141"), trial => <div key={trial.id} className="bg-black/30 rounded-2xl p-6 border border-teal-800/50">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{trial.name}</h3>
                    <div className="text-sm text-white/50">{trial.drug} • {trial.indication}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-lg text-sm ${(stryMutAct_9fa48("30145") ? trial.status !== 'active' : stryMutAct_9fa48("30144") ? false : stryMutAct_9fa48("30143") ? true : (stryCov_9fa48("30143", "30144", "30145"), trial.status === 'active')) ? 'bg-green-600' : (stryMutAct_9fa48("30150") ? trial.status !== 'recruiting' : stryMutAct_9fa48("30149") ? false : stryMutAct_9fa48("30148") ? true : (stryCov_9fa48("30148", "30149", "30150"), trial.status === 'recruiting')) ? 'bg-blue-600' : (stryMutAct_9fa48("30155") ? trial.status !== 'completed' : stryMutAct_9fa48("30154") ? false : stryMutAct_9fa48("30153") ? true : (stryCov_9fa48("30153", "30154", "30155"), trial.status === 'completed')) ? 'bg-purple-600' : 'bg-neutral-600'}`}>{trial.status}</span>
                    <span className={`px-3 py-1 rounded-lg text-sm bg-teal-900`}>{stryMutAct_9fa48("30160") ? trial.phase.toLowerCase() : (stryCov_9fa48("30160"), trial.phase.toUpperCase())}</span>
                  </div>
                </div>

                <div className="grid grid-cols-5 gap-4 mb-4">
                  <div className="text-center p-3 bg-black/20 rounded-xl">
                    <div className="text-xl font-bold text-cyan-400">{trial.enrollmentActual}/{trial.enrollmentTarget}</div>
                    <div className="text-xs text-white/50">Enrollment</div>
                  </div>
                  <div className="text-center p-3 bg-black/20 rounded-xl">
                    <div className="text-xl font-bold">{trial.sites}</div>
                    <div className="text-xs text-white/50">Sites</div>
                  </div>
                  <div className="text-center p-3 bg-black/20 rounded-xl">
                    <div className="text-xl font-bold">{trial.countries.length}</div>
                    <div className="text-xs text-white/50">Countries</div>
                  </div>
                  <div className="text-center p-3 bg-black/20 rounded-xl">
                    <div className="text-xl font-bold text-green-400">${(stryMutAct_9fa48("30161") ? trial.spent * 1e6 : (stryCov_9fa48("30161"), trial.spent / 1e6)).toFixed(0)}M</div>
                    <div className="text-xs text-white/50">Spent</div>
                  </div>
                  <div className="text-center p-3 bg-black/20 rounded-xl">
                    <div className="text-xl font-bold">${(stryMutAct_9fa48("30162") ? trial.budget * 1e6 : (stryCov_9fa48("30162"), trial.budget / 1e6)).toFixed(0)}M</div>
                    <div className="text-xs text-white/50">Budget</div>
                  </div>
                </div>

                <div className="p-3 bg-black/20 rounded-xl">
                  <div className="text-xs text-white/50 mb-1">Primary Endpoint</div>
                  <div className="text-sm">{trial.primaryEndpoint}</div>
                </div>
              </div>))}
          </div>)}

        {stryMutAct_9fa48("30165") ? activeTab === 'pipeline' || <div className="space-y-4">
            {drugCandidates.map(drug => <div key={drug.id} className="bg-black/30 rounded-2xl p-6 border border-teal-800/50">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold">{drug.name}</h3>
                    <div className="text-sm text-white/50">{drug.targetIndication}</div>
                  </div>
                  <span className={`px-4 py-2 rounded-lg text-sm font-medium ${drug.phase === 'phase3' ? 'bg-green-600' : drug.phase === 'phase2' ? 'bg-blue-600' : drug.phase === 'phase1' ? 'bg-purple-600' : 'bg-neutral-600'}`}>{drug.phase.toUpperCase()}</span>
                </div>

                <div className="mb-4">
                  <div className="text-xs text-white/50 mb-1">Mechanism of Action</div>
                  <div className="text-sm">{drug.mechanism}</div>
                </div>

                <div className="grid grid-cols-6 gap-4">
                  <div className="text-center p-3 bg-black/20 rounded-xl">
                    <div className="text-xl font-bold text-green-400">{drug.efficacyScore}%</div>
                    <div className="text-xs text-white/50">Efficacy</div>
                  </div>
                  <div className="text-center p-3 bg-black/20 rounded-xl">
                    <div className="text-xl font-bold text-cyan-400">{drug.safetyScore}%</div>
                    <div className="text-xs text-white/50">Safety</div>
                  </div>
                  <div className="text-center p-3 bg-black/20 rounded-xl">
                    <div className="text-xl font-bold text-purple-400">${(drug.marketPotential / 1e9).toFixed(1)}B</div>
                    <div className="text-xs text-white/50">Market Potential</div>
                  </div>
                  <div className="text-center p-3 bg-black/20 rounded-xl">
                    <div className="text-xl font-bold">${(drug.developmentCost / 1e6).toFixed(0)}M</div>
                    <div className="text-xs text-white/50">Dev Cost</div>
                  </div>
                  <div className="text-center p-3 bg-black/20 rounded-xl">
                    <div className="text-xl font-bold text-amber-400">{drug.timeToMarket}y</div>
                    <div className="text-xs text-white/50">Time to Market</div>
                  </div>
                  <div className="text-center p-3 bg-black/20 rounded-xl">
                    <div className="text-xl font-bold">{drug.competitorCount}</div>
                    <div className="text-xs text-white/50">Competitors</div>
                  </div>
                </div>
              </div>)}
          </div> : stryMutAct_9fa48("30164") ? false : stryMutAct_9fa48("30163") ? true : (stryCov_9fa48("30163", "30164", "30165"), (stryMutAct_9fa48("30167") ? activeTab !== 'pipeline' : stryMutAct_9fa48("30166") ? true : (stryCov_9fa48("30166", "30167"), activeTab === 'pipeline')) && <div className="space-y-4">
            {drugCandidates.map(stryMutAct_9fa48("30169") ? () => undefined : (stryCov_9fa48("30169"), drug => <div key={drug.id} className="bg-black/30 rounded-2xl p-6 border border-teal-800/50">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold">{drug.name}</h3>
                    <div className="text-sm text-white/50">{drug.targetIndication}</div>
                  </div>
                  <span className={`px-4 py-2 rounded-lg text-sm font-medium ${(stryMutAct_9fa48("30173") ? drug.phase !== 'phase3' : stryMutAct_9fa48("30172") ? false : stryMutAct_9fa48("30171") ? true : (stryCov_9fa48("30171", "30172", "30173"), drug.phase === 'phase3')) ? 'bg-green-600' : (stryMutAct_9fa48("30178") ? drug.phase !== 'phase2' : stryMutAct_9fa48("30177") ? false : stryMutAct_9fa48("30176") ? true : (stryCov_9fa48("30176", "30177", "30178"), drug.phase === 'phase2')) ? 'bg-blue-600' : (stryMutAct_9fa48("30183") ? drug.phase !== 'phase1' : stryMutAct_9fa48("30182") ? false : stryMutAct_9fa48("30181") ? true : (stryCov_9fa48("30181", "30182", "30183"), drug.phase === 'phase1')) ? 'bg-purple-600' : 'bg-neutral-600'}`}>{stryMutAct_9fa48("30187") ? drug.phase.toLowerCase() : (stryCov_9fa48("30187"), drug.phase.toUpperCase())}</span>
                </div>

                <div className="mb-4">
                  <div className="text-xs text-white/50 mb-1">Mechanism of Action</div>
                  <div className="text-sm">{drug.mechanism}</div>
                </div>

                <div className="grid grid-cols-6 gap-4">
                  <div className="text-center p-3 bg-black/20 rounded-xl">
                    <div className="text-xl font-bold text-green-400">{drug.efficacyScore}%</div>
                    <div className="text-xs text-white/50">Efficacy</div>
                  </div>
                  <div className="text-center p-3 bg-black/20 rounded-xl">
                    <div className="text-xl font-bold text-cyan-400">{drug.safetyScore}%</div>
                    <div className="text-xs text-white/50">Safety</div>
                  </div>
                  <div className="text-center p-3 bg-black/20 rounded-xl">
                    <div className="text-xl font-bold text-purple-400">${(stryMutAct_9fa48("30188") ? drug.marketPotential * 1e9 : (stryCov_9fa48("30188"), drug.marketPotential / 1e9)).toFixed(1)}B</div>
                    <div className="text-xs text-white/50">Market Potential</div>
                  </div>
                  <div className="text-center p-3 bg-black/20 rounded-xl">
                    <div className="text-xl font-bold">${(stryMutAct_9fa48("30189") ? drug.developmentCost * 1e6 : (stryCov_9fa48("30189"), drug.developmentCost / 1e6)).toFixed(0)}M</div>
                    <div className="text-xs text-white/50">Dev Cost</div>
                  </div>
                  <div className="text-center p-3 bg-black/20 rounded-xl">
                    <div className="text-xl font-bold text-amber-400">{drug.timeToMarket}y</div>
                    <div className="text-xs text-white/50">Time to Market</div>
                  </div>
                  <div className="text-center p-3 bg-black/20 rounded-xl">
                    <div className="text-xl font-bold">{drug.competitorCount}</div>
                    <div className="text-xs text-white/50">Competitors</div>
                  </div>
                </div>
              </div>))}
          </div>)}

        {stryMutAct_9fa48("30192") ? activeTab === 'regulatory' || <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-900/30 to-indigo-900/30 rounded-2xl p-6 border border-blue-700/50">
              <h2 className="text-lg font-semibold mb-2">📋 FDA Submission Automation</h2>
              <p className="text-white/60">
                AI-assisted regulatory submission preparation with automated document generation,
                completeness checking, and reviewer question prediction.
              </p>
            </div>

            {fdaSubmissions.map(sub => <div key={sub.id} className="bg-black/30 rounded-2xl p-6 border border-teal-800/50">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold">{sub.productName}</h3>
                      <span className="px-2 py-0.5 bg-blue-900 rounded text-sm">{sub.type}</span>
                    </div>
                    {sub.submissionDate && <div className="text-sm text-white/50">
                        Submitted: {sub.submissionDate.toLocaleDateString()}
                      </div>}
                  </div>
                  <span className={`px-4 py-2 rounded-lg text-sm font-medium ${sub.status === 'approved' ? 'bg-green-600' : sub.status === 'under-review' ? 'bg-blue-600' : sub.status === 'preparation' ? 'bg-amber-600' : 'bg-neutral-600'}`}>{sub.status.toUpperCase()}</span>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-3">Sections</h4>
                    <div className="space-y-2">
                      {sub.sections.map(section => <div key={section.name} className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                          <span className="text-sm">{section.name}</span>
                          <span className={`px-2 py-0.5 rounded text-xs ${section.status === 'complete' ? 'bg-green-900 text-green-300' : section.status === 'in-progress' ? 'bg-amber-900 text-amber-300' : section.status === 'needs-revision' ? 'bg-red-900 text-red-300' : 'bg-neutral-800 text-neutral-300'}`}>{section.status}</span>
                        </div>)}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-3">Status</h4>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Completeness</span>
                          <span className="font-bold">{sub.completeness}%</span>
                        </div>
                        <div className="h-3 bg-black/30 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-teal-500 to-cyan-500" style={{
                      width: `${sub.completeness}%`
                    }} />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-black/20 rounded-xl text-center">
                          <div className="text-xl font-bold text-amber-400">{sub.reviewerQuestions}</div>
                          <div className="text-xs text-white/50">Reviewer Questions</div>
                        </div>
                        <div className="p-3 bg-black/20 rounded-xl text-center">
                          <div className="text-xl font-bold text-red-400">{sub.openIssues}</div>
                          <div className="text-xs text-white/50">Open Issues</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>)}
          </div> : stryMutAct_9fa48("30191") ? false : stryMutAct_9fa48("30190") ? true : (stryCov_9fa48("30190", "30191", "30192"), (stryMutAct_9fa48("30194") ? activeTab !== 'regulatory' : stryMutAct_9fa48("30193") ? true : (stryCov_9fa48("30193", "30194"), activeTab === 'regulatory')) && <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-900/30 to-indigo-900/30 rounded-2xl p-6 border border-blue-700/50">
              <h2 className="text-lg font-semibold mb-2">📋 FDA Submission Automation</h2>
              <p className="text-white/60">
                AI-assisted regulatory submission preparation with automated document generation,
                completeness checking, and reviewer question prediction.
              </p>
            </div>

            {fdaSubmissions.map(stryMutAct_9fa48("30196") ? () => undefined : (stryCov_9fa48("30196"), sub => <div key={sub.id} className="bg-black/30 rounded-2xl p-6 border border-teal-800/50">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold">{sub.productName}</h3>
                      <span className="px-2 py-0.5 bg-blue-900 rounded text-sm">{sub.type}</span>
                    </div>
                    {stryMutAct_9fa48("30199") ? sub.submissionDate || <div className="text-sm text-white/50">
                        Submitted: {sub.submissionDate.toLocaleDateString()}
                      </div> : stryMutAct_9fa48("30198") ? false : stryMutAct_9fa48("30197") ? true : (stryCov_9fa48("30197", "30198", "30199"), sub.submissionDate && <div className="text-sm text-white/50">
                        Submitted: {sub.submissionDate.toLocaleDateString()}
                      </div>)}
                  </div>
                  <span className={`px-4 py-2 rounded-lg text-sm font-medium ${(stryMutAct_9fa48("30203") ? sub.status !== 'approved' : stryMutAct_9fa48("30202") ? false : stryMutAct_9fa48("30201") ? true : (stryCov_9fa48("30201", "30202", "30203"), sub.status === 'approved')) ? 'bg-green-600' : (stryMutAct_9fa48("30208") ? sub.status !== 'under-review' : stryMutAct_9fa48("30207") ? false : stryMutAct_9fa48("30206") ? true : (stryCov_9fa48("30206", "30207", "30208"), sub.status === 'under-review')) ? 'bg-blue-600' : (stryMutAct_9fa48("30213") ? sub.status !== 'preparation' : stryMutAct_9fa48("30212") ? false : stryMutAct_9fa48("30211") ? true : (stryCov_9fa48("30211", "30212", "30213"), sub.status === 'preparation')) ? 'bg-amber-600' : 'bg-neutral-600'}`}>{stryMutAct_9fa48("30217") ? sub.status.toLowerCase() : (stryCov_9fa48("30217"), sub.status.toUpperCase())}</span>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-3">Sections</h4>
                    <div className="space-y-2">
                      {sub.sections.map(stryMutAct_9fa48("30218") ? () => undefined : (stryCov_9fa48("30218"), section => <div key={section.name} className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                          <span className="text-sm">{section.name}</span>
                          <span className={`px-2 py-0.5 rounded text-xs ${(stryMutAct_9fa48("30222") ? section.status !== 'complete' : stryMutAct_9fa48("30221") ? false : stryMutAct_9fa48("30220") ? true : (stryCov_9fa48("30220", "30221", "30222"), section.status === 'complete')) ? 'bg-green-900 text-green-300' : (stryMutAct_9fa48("30227") ? section.status !== 'in-progress' : stryMutAct_9fa48("30226") ? false : stryMutAct_9fa48("30225") ? true : (stryCov_9fa48("30225", "30226", "30227"), section.status === 'in-progress')) ? 'bg-amber-900 text-amber-300' : (stryMutAct_9fa48("30232") ? section.status !== 'needs-revision' : stryMutAct_9fa48("30231") ? false : stryMutAct_9fa48("30230") ? true : (stryCov_9fa48("30230", "30231", "30232"), section.status === 'needs-revision')) ? 'bg-red-900 text-red-300' : 'bg-neutral-800 text-neutral-300'}`}>{section.status}</span>
                        </div>))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-3">Status</h4>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Completeness</span>
                          <span className="font-bold">{sub.completeness}%</span>
                        </div>
                        <div className="h-3 bg-black/30 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-teal-500 to-cyan-500" style={stryMutAct_9fa48("30236") ? {} : (stryCov_9fa48("30236"), {
                      width: `${sub.completeness}%`
                    })} />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-black/20 rounded-xl text-center">
                          <div className="text-xl font-bold text-amber-400">{sub.reviewerQuestions}</div>
                          <div className="text-xs text-white/50">Reviewer Questions</div>
                        </div>
                        <div className="p-3 bg-black/20 rounded-xl text-center">
                          <div className="text-xl font-bold text-red-400">{sub.openIssues}</div>
                          <div className="text-xs text-white/50">Open Issues</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>))}
          </div>)}
      </main>
    </div>;
};
export default GenomicsPage;