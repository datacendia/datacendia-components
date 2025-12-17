// @ts-nocheck
// =============================================================================
// CENDIA TRAINING™ - LEARNING MANAGEMENT SYSTEM
// Onboarding verification, role-based training, and certification tracking
// "From Day 1 to Mastery • Complete Learning Journey"
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
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// =============================================================================
// TYPES
// =============================================================================

type CourseStatus = 'not-started' | 'in-progress' | 'completed' | 'expired';
type CourseCategory = 'onboarding' | 'security' | 'compliance' | 'product' | 'role-specific' | 'leadership';
type CertificationStatus = 'valid' | 'expiring-soon' | 'expired' | 'not-certified';
interface Course {
  id: string;
  title: string;
  description: string;
  category: CourseCategory;
  duration: string;
  modules: number;
  completedModules: number;
  status: CourseStatus;
  required: boolean;
  dueDate?: Date;
  completedDate?: Date;
  score?: number;
  passingScore: number;
}
interface Certification {
  id: string;
  name: string;
  issuer: string;
  earnedDate?: Date;
  expiryDate?: Date;
  status: CertificationStatus;
  courses: string[];
}
interface LearningPath {
  id: string;
  name: string;
  description: string;
  role: string;
  courses: string[];
  progress: number;
  totalHours: number;
  completedHours: number;
}
interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: string;
  completedCourses: number;
  totalRequired: number;
  overdueCourses: number;
  lastActivity: Date;
}

// =============================================================================
// MOCK DATA
// =============================================================================

const mockCourses: Course[] = stryMutAct_9fa48("34166") ? [] : (stryCov_9fa48("34166"), [// Onboarding
stryMutAct_9fa48("34167") ? {} : (stryCov_9fa48("34167"), {
  id: 'C001',
  title: 'Datacendia Platform Fundamentals',
  description: 'Core platform concepts and navigation',
  category: 'onboarding',
  duration: '45 min',
  modules: 5,
  completedModules: 5,
  status: 'completed',
  required: stryMutAct_9fa48("34174") ? false : (stryCov_9fa48("34174"), true),
  completedDate: new Date(stryMutAct_9fa48("34175") ? Date.now() + 7 * 24 * 60 * 60 * 1000 : (stryCov_9fa48("34175"), Date.now() - (stryMutAct_9fa48("34176") ? 7 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("34176"), (stryMutAct_9fa48("34177") ? 7 * 24 * 60 / 60 : (stryCov_9fa48("34177"), (stryMutAct_9fa48("34178") ? 7 * 24 / 60 : (stryCov_9fa48("34178"), (stryMutAct_9fa48("34179") ? 7 / 24 : (stryCov_9fa48("34179"), 7 * 24)) * 60)) * 60)) * 1000)))),
  score: 92,
  passingScore: 80
}), stryMutAct_9fa48("34180") ? {} : (stryCov_9fa48("34180"), {
  id: 'C002',
  title: 'Council of Agents Overview',
  description: 'How AI deliberation works',
  category: 'onboarding',
  duration: '30 min',
  modules: 4,
  completedModules: 4,
  status: 'completed',
  required: stryMutAct_9fa48("34187") ? false : (stryCov_9fa48("34187"), true),
  completedDate: new Date(stryMutAct_9fa48("34188") ? Date.now() + 6 * 24 * 60 * 60 * 1000 : (stryCov_9fa48("34188"), Date.now() - (stryMutAct_9fa48("34189") ? 6 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("34189"), (stryMutAct_9fa48("34190") ? 6 * 24 * 60 / 60 : (stryCov_9fa48("34190"), (stryMutAct_9fa48("34191") ? 6 * 24 / 60 : (stryCov_9fa48("34191"), (stryMutAct_9fa48("34192") ? 6 / 24 : (stryCov_9fa48("34192"), 6 * 24)) * 60)) * 60)) * 1000)))),
  score: 88,
  passingScore: 80
}), stryMutAct_9fa48("34193") ? {} : (stryCov_9fa48("34193"), {
  id: 'C003',
  title: 'Data Integration Basics',
  description: 'Connecting data sources',
  category: 'onboarding',
  duration: '60 min',
  modules: 6,
  completedModules: 3,
  status: 'in-progress',
  required: stryMutAct_9fa48("34200") ? false : (stryCov_9fa48("34200"), true),
  dueDate: new Date(stryMutAct_9fa48("34201") ? Date.now() - 3 * 24 * 60 * 60 * 1000 : (stryCov_9fa48("34201"), Date.now() + (stryMutAct_9fa48("34202") ? 3 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("34202"), (stryMutAct_9fa48("34203") ? 3 * 24 * 60 / 60 : (stryCov_9fa48("34203"), (stryMutAct_9fa48("34204") ? 3 * 24 / 60 : (stryCov_9fa48("34204"), (stryMutAct_9fa48("34205") ? 3 / 24 : (stryCov_9fa48("34205"), 3 * 24)) * 60)) * 60)) * 1000)))),
  passingScore: 80
}), // Security
stryMutAct_9fa48("34206") ? {} : (stryCov_9fa48("34206"), {
  id: 'C004',
  title: 'Security Awareness Training',
  description: 'Annual security best practices',
  category: 'security',
  duration: '45 min',
  modules: 5,
  completedModules: 5,
  status: 'completed',
  required: stryMutAct_9fa48("34213") ? false : (stryCov_9fa48("34213"), true),
  completedDate: new Date(stryMutAct_9fa48("34214") ? Date.now() + 30 * 24 * 60 * 60 * 1000 : (stryCov_9fa48("34214"), Date.now() - (stryMutAct_9fa48("34215") ? 30 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("34215"), (stryMutAct_9fa48("34216") ? 30 * 24 * 60 / 60 : (stryCov_9fa48("34216"), (stryMutAct_9fa48("34217") ? 30 * 24 / 60 : (stryCov_9fa48("34217"), (stryMutAct_9fa48("34218") ? 30 / 24 : (stryCov_9fa48("34218"), 30 * 24)) * 60)) * 60)) * 1000)))),
  score: 95,
  passingScore: 85
}), stryMutAct_9fa48("34219") ? {} : (stryCov_9fa48("34219"), {
  id: 'C005',
  title: 'Phishing Prevention',
  description: 'Identify and report phishing attempts',
  category: 'security',
  duration: '20 min',
  modules: 3,
  completedModules: 0,
  status: 'not-started',
  required: stryMutAct_9fa48("34226") ? false : (stryCov_9fa48("34226"), true),
  dueDate: new Date(stryMutAct_9fa48("34227") ? Date.now() - 14 * 24 * 60 * 60 * 1000 : (stryCov_9fa48("34227"), Date.now() + (stryMutAct_9fa48("34228") ? 14 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("34228"), (stryMutAct_9fa48("34229") ? 14 * 24 * 60 / 60 : (stryCov_9fa48("34229"), (stryMutAct_9fa48("34230") ? 14 * 24 / 60 : (stryCov_9fa48("34230"), (stryMutAct_9fa48("34231") ? 14 / 24 : (stryCov_9fa48("34231"), 14 * 24)) * 60)) * 60)) * 1000)))),
  passingScore: 90
}), // Compliance
stryMutAct_9fa48("34232") ? {} : (stryCov_9fa48("34232"), {
  id: 'C006',
  title: 'GDPR Fundamentals',
  description: 'Data privacy requirements',
  category: 'compliance',
  duration: '60 min',
  modules: 8,
  completedModules: 8,
  status: 'completed',
  required: stryMutAct_9fa48("34239") ? false : (stryCov_9fa48("34239"), true),
  completedDate: new Date(stryMutAct_9fa48("34240") ? Date.now() + 60 * 24 * 60 * 60 * 1000 : (stryCov_9fa48("34240"), Date.now() - (stryMutAct_9fa48("34241") ? 60 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("34241"), (stryMutAct_9fa48("34242") ? 60 * 24 * 60 / 60 : (stryCov_9fa48("34242"), (stryMutAct_9fa48("34243") ? 60 * 24 / 60 : (stryCov_9fa48("34243"), (stryMutAct_9fa48("34244") ? 60 / 24 : (stryCov_9fa48("34244"), 60 * 24)) * 60)) * 60)) * 1000)))),
  score: 90,
  passingScore: 85
}), stryMutAct_9fa48("34245") ? {} : (stryCov_9fa48("34245"), {
  id: 'C007',
  title: 'SOC 2 Controls Overview',
  description: 'Understanding TSC requirements',
  category: 'compliance',
  duration: '90 min',
  modules: 10,
  completedModules: 0,
  status: 'not-started',
  required: stryMutAct_9fa48("34252") ? true : (stryCov_9fa48("34252"), false),
  passingScore: 80
}), // Product
stryMutAct_9fa48("34253") ? {} : (stryCov_9fa48("34253"), {
  id: 'C008',
  title: 'Advanced Deliberation Techniques',
  description: 'Power user features',
  category: 'product',
  duration: '45 min',
  modules: 5,
  completedModules: 2,
  status: 'in-progress',
  required: stryMutAct_9fa48("34260") ? true : (stryCov_9fa48("34260"), false),
  passingScore: 75
}), stryMutAct_9fa48("34261") ? {} : (stryCov_9fa48("34261"), {
  id: 'C009',
  title: 'Chronos Time Machine Deep Dive',
  description: 'Historical analysis and simulation',
  category: 'product',
  duration: '60 min',
  modules: 6,
  completedModules: 0,
  status: 'not-started',
  required: stryMutAct_9fa48("34268") ? true : (stryCov_9fa48("34268"), false),
  passingScore: 75
}), // Role-specific
stryMutAct_9fa48("34269") ? {} : (stryCov_9fa48("34269"), {
  id: 'C010',
  title: 'Analyst Certification Program',
  description: 'Advanced analytics and reporting',
  category: 'role-specific',
  duration: '3 hr',
  modules: 12,
  completedModules: 0,
  status: 'not-started',
  required: stryMutAct_9fa48("34276") ? true : (stryCov_9fa48("34276"), false),
  passingScore: 85
}), stryMutAct_9fa48("34277") ? {} : (stryCov_9fa48("34277"), {
  id: 'C011',
  title: 'Admin Console Mastery',
  description: 'Platform administration',
  category: 'role-specific',
  duration: '2 hr',
  modules: 8,
  completedModules: 4,
  status: 'in-progress',
  required: stryMutAct_9fa48("34284") ? false : (stryCov_9fa48("34284"), true),
  dueDate: new Date(stryMutAct_9fa48("34285") ? Date.now() - 7 * 24 * 60 * 60 * 1000 : (stryCov_9fa48("34285"), Date.now() + (stryMutAct_9fa48("34286") ? 7 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("34286"), (stryMutAct_9fa48("34287") ? 7 * 24 * 60 / 60 : (stryCov_9fa48("34287"), (stryMutAct_9fa48("34288") ? 7 * 24 / 60 : (stryCov_9fa48("34288"), (stryMutAct_9fa48("34289") ? 7 / 24 : (stryCov_9fa48("34289"), 7 * 24)) * 60)) * 60)) * 1000)))),
  passingScore: 85
})]);
const mockCertifications: Certification[] = stryMutAct_9fa48("34290") ? [] : (stryCov_9fa48("34290"), [stryMutAct_9fa48("34291") ? {} : (stryCov_9fa48("34291"), {
  id: 'CERT001',
  name: 'Datacendia Certified User',
  issuer: 'Datacendia',
  earnedDate: new Date(stryMutAct_9fa48("34295") ? Date.now() + 7 * 24 * 60 * 60 * 1000 : (stryCov_9fa48("34295"), Date.now() - (stryMutAct_9fa48("34296") ? 7 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("34296"), (stryMutAct_9fa48("34297") ? 7 * 24 * 60 / 60 : (stryCov_9fa48("34297"), (stryMutAct_9fa48("34298") ? 7 * 24 / 60 : (stryCov_9fa48("34298"), (stryMutAct_9fa48("34299") ? 7 / 24 : (stryCov_9fa48("34299"), 7 * 24)) * 60)) * 60)) * 1000)))),
  expiryDate: new Date(stryMutAct_9fa48("34300") ? Date.now() - 358 * 24 * 60 * 60 * 1000 : (stryCov_9fa48("34300"), Date.now() + (stryMutAct_9fa48("34301") ? 358 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("34301"), (stryMutAct_9fa48("34302") ? 358 * 24 * 60 / 60 : (stryCov_9fa48("34302"), (stryMutAct_9fa48("34303") ? 358 * 24 / 60 : (stryCov_9fa48("34303"), (stryMutAct_9fa48("34304") ? 358 / 24 : (stryCov_9fa48("34304"), 358 * 24)) * 60)) * 60)) * 1000)))),
  status: 'valid',
  courses: stryMutAct_9fa48("34306") ? [] : (stryCov_9fa48("34306"), ['C001', 'C002'])
}), stryMutAct_9fa48("34309") ? {} : (stryCov_9fa48("34309"), {
  id: 'CERT002',
  name: 'Security Awareness Certified',
  issuer: 'Datacendia',
  earnedDate: new Date(stryMutAct_9fa48("34313") ? Date.now() + 30 * 24 * 60 * 60 * 1000 : (stryCov_9fa48("34313"), Date.now() - (stryMutAct_9fa48("34314") ? 30 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("34314"), (stryMutAct_9fa48("34315") ? 30 * 24 * 60 / 60 : (stryCov_9fa48("34315"), (stryMutAct_9fa48("34316") ? 30 * 24 / 60 : (stryCov_9fa48("34316"), (stryMutAct_9fa48("34317") ? 30 / 24 : (stryCov_9fa48("34317"), 30 * 24)) * 60)) * 60)) * 1000)))),
  expiryDate: new Date(stryMutAct_9fa48("34318") ? Date.now() - 335 * 24 * 60 * 60 * 1000 : (stryCov_9fa48("34318"), Date.now() + (stryMutAct_9fa48("34319") ? 335 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("34319"), (stryMutAct_9fa48("34320") ? 335 * 24 * 60 / 60 : (stryCov_9fa48("34320"), (stryMutAct_9fa48("34321") ? 335 * 24 / 60 : (stryCov_9fa48("34321"), (stryMutAct_9fa48("34322") ? 335 / 24 : (stryCov_9fa48("34322"), 335 * 24)) * 60)) * 60)) * 1000)))),
  status: 'valid',
  courses: stryMutAct_9fa48("34324") ? [] : (stryCov_9fa48("34324"), ['C004'])
}), stryMutAct_9fa48("34326") ? {} : (stryCov_9fa48("34326"), {
  id: 'CERT003',
  name: 'GDPR Compliance Certified',
  issuer: 'Datacendia',
  earnedDate: new Date(stryMutAct_9fa48("34330") ? Date.now() + 60 * 24 * 60 * 60 * 1000 : (stryCov_9fa48("34330"), Date.now() - (stryMutAct_9fa48("34331") ? 60 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("34331"), (stryMutAct_9fa48("34332") ? 60 * 24 * 60 / 60 : (stryCov_9fa48("34332"), (stryMutAct_9fa48("34333") ? 60 * 24 / 60 : (stryCov_9fa48("34333"), (stryMutAct_9fa48("34334") ? 60 / 24 : (stryCov_9fa48("34334"), 60 * 24)) * 60)) * 60)) * 1000)))),
  expiryDate: new Date(stryMutAct_9fa48("34335") ? Date.now() - 25 * 24 * 60 * 60 * 1000 : (stryCov_9fa48("34335"), Date.now() + (stryMutAct_9fa48("34336") ? 25 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("34336"), (stryMutAct_9fa48("34337") ? 25 * 24 * 60 / 60 : (stryCov_9fa48("34337"), (stryMutAct_9fa48("34338") ? 25 * 24 / 60 : (stryCov_9fa48("34338"), (stryMutAct_9fa48("34339") ? 25 / 24 : (stryCov_9fa48("34339"), 25 * 24)) * 60)) * 60)) * 1000)))),
  status: 'expiring-soon',
  courses: stryMutAct_9fa48("34341") ? [] : (stryCov_9fa48("34341"), ['C006'])
}), stryMutAct_9fa48("34343") ? {} : (stryCov_9fa48("34343"), {
  id: 'CERT004',
  name: 'Datacendia Admin Certified',
  issuer: 'Datacendia',
  status: 'not-certified',
  courses: stryMutAct_9fa48("34348") ? [] : (stryCov_9fa48("34348"), ['C011'])
})]);
const mockLearningPaths: LearningPath[] = stryMutAct_9fa48("34350") ? [] : (stryCov_9fa48("34350"), [stryMutAct_9fa48("34351") ? {} : (stryCov_9fa48("34351"), {
  id: 'LP001',
  name: 'New Employee Onboarding',
  description: 'Essential training for all new hires',
  role: 'All',
  courses: stryMutAct_9fa48("34356") ? [] : (stryCov_9fa48("34356"), ['C001', 'C002', 'C003', 'C004']),
  progress: 75,
  totalHours: 3,
  completedHours: 2.25
}), stryMutAct_9fa48("34361") ? {} : (stryCov_9fa48("34361"), {
  id: 'LP002',
  name: 'Security & Compliance Track',
  description: 'Required security and compliance training',
  role: 'All',
  courses: stryMutAct_9fa48("34366") ? [] : (stryCov_9fa48("34366"), ['C004', 'C005', 'C006']),
  progress: 66,
  totalHours: 2,
  completedHours: 1.75
}), stryMutAct_9fa48("34370") ? {} : (stryCov_9fa48("34370"), {
  id: 'LP003',
  name: 'Platform Admin Path',
  description: 'For administrators and power users',
  role: 'Admin',
  courses: stryMutAct_9fa48("34375") ? [] : (stryCov_9fa48("34375"), ['C001', 'C002', 'C008', 'C011']),
  progress: 50,
  totalHours: 4,
  completedHours: 2
}), stryMutAct_9fa48("34380") ? {} : (stryCov_9fa48("34380"), {
  id: 'LP004',
  name: 'Analyst Certification Path',
  description: 'Advanced analytics training',
  role: 'Analyst',
  courses: stryMutAct_9fa48("34385") ? [] : (stryCov_9fa48("34385"), ['C001', 'C002', 'C008', 'C009', 'C010']),
  progress: 25,
  totalHours: 6,
  completedHours: 1.5
})]);
const mockTeamMembers: TeamMember[] = stryMutAct_9fa48("34391") ? [] : (stryCov_9fa48("34391"), [stryMutAct_9fa48("34392") ? {} : (stryCov_9fa48("34392"), {
  id: 'U001',
  name: 'Alex Johnson',
  role: 'Analyst',
  department: 'Finance',
  completedCourses: 8,
  totalRequired: 10,
  overdueCourses: 0,
  lastActivity: new Date(stryMutAct_9fa48("34397") ? Date.now() + 1 * 24 * 60 * 60 * 1000 : (stryCov_9fa48("34397"), Date.now() - (stryMutAct_9fa48("34398") ? 1 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("34398"), (stryMutAct_9fa48("34399") ? 1 * 24 * 60 / 60 : (stryCov_9fa48("34399"), (stryMutAct_9fa48("34400") ? 1 * 24 / 60 : (stryCov_9fa48("34400"), (stryMutAct_9fa48("34401") ? 1 / 24 : (stryCov_9fa48("34401"), 1 * 24)) * 60)) * 60)) * 1000))))
}), stryMutAct_9fa48("34402") ? {} : (stryCov_9fa48("34402"), {
  id: 'U002',
  name: 'Sarah Williams',
  role: 'Manager',
  department: 'Operations',
  completedCourses: 12,
  totalRequired: 12,
  overdueCourses: 0,
  lastActivity: new Date(stryMutAct_9fa48("34407") ? Date.now() + 2 * 24 * 60 * 60 * 1000 : (stryCov_9fa48("34407"), Date.now() - (stryMutAct_9fa48("34408") ? 2 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("34408"), (stryMutAct_9fa48("34409") ? 2 * 24 * 60 / 60 : (stryCov_9fa48("34409"), (stryMutAct_9fa48("34410") ? 2 * 24 / 60 : (stryCov_9fa48("34410"), (stryMutAct_9fa48("34411") ? 2 / 24 : (stryCov_9fa48("34411"), 2 * 24)) * 60)) * 60)) * 1000))))
}), stryMutAct_9fa48("34412") ? {} : (stryCov_9fa48("34412"), {
  id: 'U003',
  name: 'Mike Chen',
  role: 'Analyst',
  department: 'Finance',
  completedCourses: 5,
  totalRequired: 10,
  overdueCourses: 2,
  lastActivity: new Date(stryMutAct_9fa48("34417") ? Date.now() + 7 * 24 * 60 * 60 * 1000 : (stryCov_9fa48("34417"), Date.now() - (stryMutAct_9fa48("34418") ? 7 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("34418"), (stryMutAct_9fa48("34419") ? 7 * 24 * 60 / 60 : (stryCov_9fa48("34419"), (stryMutAct_9fa48("34420") ? 7 * 24 / 60 : (stryCov_9fa48("34420"), (stryMutAct_9fa48("34421") ? 7 / 24 : (stryCov_9fa48("34421"), 7 * 24)) * 60)) * 60)) * 1000))))
}), stryMutAct_9fa48("34422") ? {} : (stryCov_9fa48("34422"), {
  id: 'U004',
  name: 'Emily Davis',
  role: 'Admin',
  department: 'IT',
  completedCourses: 15,
  totalRequired: 15,
  overdueCourses: 0,
  lastActivity: new Date(stryMutAct_9fa48("34427") ? Date.now() + 0.5 * 24 * 60 * 60 * 1000 : (stryCov_9fa48("34427"), Date.now() - (stryMutAct_9fa48("34428") ? 0.5 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("34428"), (stryMutAct_9fa48("34429") ? 0.5 * 24 * 60 / 60 : (stryCov_9fa48("34429"), (stryMutAct_9fa48("34430") ? 0.5 * 24 / 60 : (stryCov_9fa48("34430"), (stryMutAct_9fa48("34431") ? 0.5 / 24 : (stryCov_9fa48("34431"), 0.5 * 24)) * 60)) * 60)) * 1000))))
}), stryMutAct_9fa48("34432") ? {} : (stryCov_9fa48("34432"), {
  id: 'U005',
  name: 'James Wilson',
  role: 'Analyst',
  department: 'Security',
  completedCourses: 9,
  totalRequired: 12,
  overdueCourses: 1,
  lastActivity: new Date(stryMutAct_9fa48("34437") ? Date.now() + 3 * 24 * 60 * 60 * 1000 : (stryCov_9fa48("34437"), Date.now() - (stryMutAct_9fa48("34438") ? 3 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("34438"), (stryMutAct_9fa48("34439") ? 3 * 24 * 60 / 60 : (stryCov_9fa48("34439"), (stryMutAct_9fa48("34440") ? 3 * 24 / 60 : (stryCov_9fa48("34440"), (stryMutAct_9fa48("34441") ? 3 / 24 : (stryCov_9fa48("34441"), 3 * 24)) * 60)) * 60)) * 1000))))
})]);

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

const getCategoryColor = (category: CourseCategory) => {
  switch (category) {
    case 'onboarding':
      if (stryMutAct_9fa48("34443")) {} else {
        stryCov_9fa48("34443");
        return 'bg-blue-500/20 text-blue-400';
      }
    case 'security':
      if (stryMutAct_9fa48("34446")) {} else {
        stryCov_9fa48("34446");
        return 'bg-red-500/20 text-red-400';
      }
    case 'compliance':
      if (stryMutAct_9fa48("34449")) {} else {
        stryCov_9fa48("34449");
        return 'bg-purple-500/20 text-purple-400';
      }
    case 'product':
      if (stryMutAct_9fa48("34452")) {} else {
        stryCov_9fa48("34452");
        return 'bg-green-500/20 text-green-400';
      }
    case 'role-specific':
      if (stryMutAct_9fa48("34455")) {} else {
        stryCov_9fa48("34455");
        return 'bg-orange-500/20 text-orange-400';
      }
    case 'leadership':
      if (stryMutAct_9fa48("34458")) {} else {
        stryCov_9fa48("34458");
        return 'bg-cyan-500/20 text-cyan-400';
      }
  }
};
const getStatusColor = (status: CourseStatus) => {
  switch (status) {
    case 'completed':
      if (stryMutAct_9fa48("34462")) {} else {
        stryCov_9fa48("34462");
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      }
    case 'in-progress':
      if (stryMutAct_9fa48("34465")) {} else {
        stryCov_9fa48("34465");
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      }
    case 'not-started':
      if (stryMutAct_9fa48("34468")) {} else {
        stryCov_9fa48("34468");
        return 'bg-neutral-500/20 text-neutral-400 border-neutral-500/30';
      }
    case 'expired':
      if (stryMutAct_9fa48("34471")) {} else {
        stryCov_9fa48("34471");
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      }
  }
};
const getCertStatusColor = (status: CertificationStatus) => {
  switch (status) {
    case 'valid':
      if (stryMutAct_9fa48("34475")) {} else {
        stryCov_9fa48("34475");
        return 'bg-green-500/20 text-green-400 border-green-500';
      }
    case 'expiring-soon':
      if (stryMutAct_9fa48("34478")) {} else {
        stryCov_9fa48("34478");
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500';
      }
    case 'expired':
      if (stryMutAct_9fa48("34481")) {} else {
        stryCov_9fa48("34481");
        return 'bg-red-500/20 text-red-400 border-red-500';
      }
    case 'not-certified':
      if (stryMutAct_9fa48("34484")) {} else {
        stryCov_9fa48("34484");
        return 'bg-neutral-500/20 text-neutral-400 border-neutral-600';
      }
  }
};
const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-US', stryMutAct_9fa48("34489") ? {} : (stryCov_9fa48("34489"), {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }));
};
const getDaysUntil = (date: Date) => {
  const days = Math.ceil(stryMutAct_9fa48("34494") ? (date.getTime() - Date.now()) * (1000 * 60 * 60 * 24) : (stryCov_9fa48("34494"), (stryMutAct_9fa48("34495") ? date.getTime() + Date.now() : (stryCov_9fa48("34495"), date.getTime() - Date.now())) / (stryMutAct_9fa48("34496") ? 1000 * 60 * 60 / 24 : (stryCov_9fa48("34496"), (stryMutAct_9fa48("34497") ? 1000 * 60 / 60 : (stryCov_9fa48("34497"), (stryMutAct_9fa48("34498") ? 1000 / 60 : (stryCov_9fa48("34498"), 1000 * 60)) * 60)) * 24))));
  if (stryMutAct_9fa48("34502") ? days >= 0 : stryMutAct_9fa48("34501") ? days <= 0 : stryMutAct_9fa48("34500") ? false : stryMutAct_9fa48("34499") ? true : (stryCov_9fa48("34499", "34500", "34501", "34502"), days < 0)) return `${Math.abs(days)}d overdue`;
  if (stryMutAct_9fa48("34506") ? days !== 0 : stryMutAct_9fa48("34505") ? false : stryMutAct_9fa48("34504") ? true : (stryCov_9fa48("34504", "34505", "34506"), days === 0)) return 'Today';
  if (stryMutAct_9fa48("34510") ? days !== 1 : stryMutAct_9fa48("34509") ? false : stryMutAct_9fa48("34508") ? true : (stryCov_9fa48("34508", "34509", "34510"), days === 1)) return 'Tomorrow';
  return `${days} days`;
};

// =============================================================================
// COMPONENT
// =============================================================================

export const TrainingPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'my-learning' | 'courses' | 'certifications' | 'team' | 'reports'>('my-learning');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [filterCategory, setFilterCategory] = useState<CourseCategory | 'all'>('all');
  const requiredCourses = stryMutAct_9fa48("34516") ? mockCourses : (stryCov_9fa48("34516"), mockCourses.filter(stryMutAct_9fa48("34517") ? () => undefined : (stryCov_9fa48("34517"), c => c.required)));
  const completedRequired = stryMutAct_9fa48("34518") ? requiredCourses.length : (stryCov_9fa48("34518"), requiredCourses.filter(stryMutAct_9fa48("34519") ? () => undefined : (stryCov_9fa48("34519"), c => stryMutAct_9fa48("34522") ? c.status !== 'completed' : stryMutAct_9fa48("34521") ? false : stryMutAct_9fa48("34520") ? true : (stryCov_9fa48("34520", "34521", "34522"), c.status === 'completed'))).length);
  const overdueCourses = stryMutAct_9fa48("34524") ? mockCourses : (stryCov_9fa48("34524"), mockCourses.filter(stryMutAct_9fa48("34525") ? () => undefined : (stryCov_9fa48("34525"), c => stryMutAct_9fa48("34528") ? c.required && c.dueDate && c.dueDate < new Date() || c.status !== 'completed' : stryMutAct_9fa48("34527") ? false : stryMutAct_9fa48("34526") ? true : (stryCov_9fa48("34526", "34527", "34528"), (stryMutAct_9fa48("34530") ? c.required && c.dueDate || c.dueDate < new Date() : stryMutAct_9fa48("34529") ? true : (stryCov_9fa48("34529", "34530"), (stryMutAct_9fa48("34532") ? c.required || c.dueDate : stryMutAct_9fa48("34531") ? true : (stryCov_9fa48("34531", "34532"), c.required && c.dueDate)) && (stryMutAct_9fa48("34535") ? c.dueDate >= new Date() : stryMutAct_9fa48("34534") ? c.dueDate <= new Date() : stryMutAct_9fa48("34533") ? true : (stryCov_9fa48("34533", "34534", "34535"), c.dueDate < new Date())))) && (stryMutAct_9fa48("34537") ? c.status === 'completed' : stryMutAct_9fa48("34536") ? true : (stryCov_9fa48("34536", "34537"), c.status !== 'completed'))))));
  const filteredCourses = (stryMutAct_9fa48("34541") ? filterCategory !== 'all' : stryMutAct_9fa48("34540") ? false : stryMutAct_9fa48("34539") ? true : (stryCov_9fa48("34539", "34540", "34541"), filterCategory === 'all')) ? mockCourses : stryMutAct_9fa48("34543") ? mockCourses : (stryCov_9fa48("34543"), mockCourses.filter(stryMutAct_9fa48("34544") ? () => undefined : (stryCov_9fa48("34544"), c => stryMutAct_9fa48("34547") ? c.category !== filterCategory : stryMutAct_9fa48("34546") ? false : stryMutAct_9fa48("34545") ? true : (stryCov_9fa48("34545", "34546", "34547"), c.category === filterCategory))));
  return <div className="min-h-screen bg-neutral-900 text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">🎓</span>
          <h1 className="text-3xl font-bold">Training & Certification</h1>
        </div>
        <p className="text-neutral-400">
          Learning management • Onboarding verification • Certification tracking
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-neutral-700 pb-2">
        {(stryMutAct_9fa48("34548") ? [] : (stryCov_9fa48("34548"), [stryMutAct_9fa48("34549") ? {} : (stryCov_9fa48("34549"), {
        id: 'my-learning',
        label: 'My Learning',
        icon: '📚'
      }), stryMutAct_9fa48("34553") ? {} : (stryCov_9fa48("34553"), {
        id: 'courses',
        label: 'All Courses',
        icon: '📖'
      }), stryMutAct_9fa48("34557") ? {} : (stryCov_9fa48("34557"), {
        id: 'certifications',
        label: 'Certifications',
        icon: '🏆'
      }), stryMutAct_9fa48("34561") ? {} : (stryCov_9fa48("34561"), {
        id: 'team',
        label: 'Team Progress',
        icon: '👥'
      }), stryMutAct_9fa48("34565") ? {} : (stryCov_9fa48("34565"), {
        id: 'reports',
        label: 'Reports',
        icon: '📊'
      })])).map(stryMutAct_9fa48("34569") ? () => undefined : (stryCov_9fa48("34569"), tab => <button key={tab.id} onClick={stryMutAct_9fa48("34570") ? () => undefined : (stryCov_9fa48("34570"), () => setActiveTab(tab.id as typeof activeTab))} className={`px-4 py-2 rounded-lg font-medium transition-all ${(stryMutAct_9fa48("34574") ? activeTab !== tab.id : stryMutAct_9fa48("34573") ? false : stryMutAct_9fa48("34572") ? true : (stryCov_9fa48("34572", "34573", "34574"), activeTab === tab.id)) ? 'bg-primary-600 text-white' : 'text-neutral-400 hover:text-white hover:bg-neutral-800'}`}>
            {tab.icon} {tab.label}
          </button>))}
      </div>

      {/* My Learning Tab */}
      {stryMutAct_9fa48("34579") ? activeTab === 'my-learning' || <div className="space-y-6">
          {/* Stats Row */}
          <div className="grid grid-cols-4 gap-4">
            {[{
          label: 'Completed Courses',
          value: mockCourses.filter(c => c.status === 'completed').length,
          total: mockCourses.length,
          color: 'text-green-400',
          icon: '✅'
        }, {
          label: 'Required Complete',
          value: completedRequired,
          total: requiredCourses.length,
          color: 'text-blue-400',
          icon: '📋'
        }, {
          label: 'In Progress',
          value: mockCourses.filter(c => c.status === 'in-progress').length,
          color: 'text-yellow-400',
          icon: '📖'
        }, {
          label: 'Overdue',
          value: overdueCourses.length,
          color: overdueCourses.length > 0 ? 'text-red-400' : 'text-green-400',
          icon: '⚠️'
        }].map(stat => <div key={stat.label} className="bg-neutral-800 rounded-xl border border-neutral-700 p-6">
                <span className="text-2xl">{stat.icon}</span>
                <p className={`text-3xl font-bold ${stat.color} mt-2`}>
                  {stat.value}{stat.total ? `/${stat.total}` : ''}
                </p>
                <p className="text-sm text-neutral-400">{stat.label}</p>
              </div>)}
          </div>

          {/* Learning Paths */}
          <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6">
            <h2 className="text-xl font-semibold mb-4">Your Learning Paths</h2>
            <div className="grid grid-cols-2 gap-4">
              {mockLearningPaths.map(path => <div key={path.id} className="p-4 bg-neutral-900 rounded-lg border border-neutral-700">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">{path.name}</h3>
                      <p className="text-sm text-neutral-400">{path.description}</p>
                    </div>
                    <span className="px-2 py-1 bg-primary-500/20 text-primary-400 rounded text-xs">{path.role}</span>
                  </div>
                  <div className="mb-2">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-neutral-400">{path.completedHours}h / {path.totalHours}h</span>
                      <span className="font-medium">{path.progress}%</span>
                    </div>
                    <div className="h-2 bg-neutral-700 rounded-full overflow-hidden">
                      <div className="h-full bg-primary-500 rounded-full transition-all duration-500" style={{
                  width: `${path.progress}%`
                }} />
                    </div>
                  </div>
                  <button className="w-full mt-3 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
                    Continue Learning
                  </button>
                </div>)}
            </div>
          </div>

          {/* In Progress Courses */}
          <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6">
            <h2 className="text-xl font-semibold mb-4">Continue Where You Left Off</h2>
            <div className="space-y-3">
              {mockCourses.filter(c => c.status === 'in-progress').map(course => <div key={course.id} onClick={() => setSelectedCourse(course)} className="p-4 bg-neutral-900 rounded-lg border border-neutral-700 hover:border-primary-500 cursor-pointer transition-all">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${getCategoryColor(course.category)}`}>
                          {course.category}
                        </span>
                        {course.required && <span className="px-2 py-0.5 bg-red-500/20 text-red-400 rounded text-xs">Required</span>}
                      </div>
                      <h3 className="font-semibold">{course.title}</h3>
                      <p className="text-sm text-neutral-400 mt-1">{course.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-neutral-500">
                        <span>⏱ {course.duration}</span>
                        <span>📖 {course.completedModules}/{course.modules} modules</span>
                        {course.dueDate && <span className={course.dueDate < new Date() ? 'text-red-400' : ''}>
                            📅 Due: {getDaysUntil(course.dueDate)}
                          </span>}
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="w-16 h-16 rounded-full border-4 border-primary-500 flex items-center justify-center">
                        <span className="text-lg font-bold">{Math.round(course.completedModules / course.modules * 100)}%</span>
                      </div>
                    </div>
                  </div>
                </div>)}
            </div>
          </div>

          {/* Upcoming Due */}
          {mockCourses.filter(c => c.dueDate && c.status !== 'completed').length > 0 && <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6">
              <h2 className="text-xl font-semibold mb-4">Upcoming Deadlines</h2>
              <div className="space-y-2">
                {mockCourses.filter(c => c.dueDate && c.status !== 'completed').sort((a, b) => (a.dueDate?.getTime() || 0) - (b.dueDate?.getTime() || 0)).map(course => <div key={course.id} className="flex items-center justify-between p-3 bg-neutral-900 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className={`w-2 h-2 rounded-full ${course.dueDate && course.dueDate < new Date() ? 'bg-red-500' : course.dueDate && course.dueDate < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) ? 'bg-yellow-500' : 'bg-green-500'}`}></span>
                        <span>{course.title}</span>
                      </div>
                      <span className={`text-sm ${course.dueDate && course.dueDate < new Date() ? 'text-red-400 font-medium' : 'text-neutral-400'}`}>
                        {course.dueDate && getDaysUntil(course.dueDate)}
                      </span>
                    </div>)}
              </div>
            </div>}
        </div> : stryMutAct_9fa48("34578") ? false : stryMutAct_9fa48("34577") ? true : (stryCov_9fa48("34577", "34578", "34579"), (stryMutAct_9fa48("34581") ? activeTab !== 'my-learning' : stryMutAct_9fa48("34580") ? true : (stryCov_9fa48("34580", "34581"), activeTab === 'my-learning')) && <div className="space-y-6">
          {/* Stats Row */}
          <div className="grid grid-cols-4 gap-4">
            {(stryMutAct_9fa48("34583") ? [] : (stryCov_9fa48("34583"), [stryMutAct_9fa48("34584") ? {} : (stryCov_9fa48("34584"), {
          label: 'Completed Courses',
          value: stryMutAct_9fa48("34586") ? mockCourses.length : (stryCov_9fa48("34586"), mockCourses.filter(stryMutAct_9fa48("34587") ? () => undefined : (stryCov_9fa48("34587"), c => stryMutAct_9fa48("34590") ? c.status !== 'completed' : stryMutAct_9fa48("34589") ? false : stryMutAct_9fa48("34588") ? true : (stryCov_9fa48("34588", "34589", "34590"), c.status === 'completed'))).length),
          total: mockCourses.length,
          color: 'text-green-400',
          icon: '✅'
        }), stryMutAct_9fa48("34594") ? {} : (stryCov_9fa48("34594"), {
          label: 'Required Complete',
          value: completedRequired,
          total: requiredCourses.length,
          color: 'text-blue-400',
          icon: '📋'
        }), stryMutAct_9fa48("34598") ? {} : (stryCov_9fa48("34598"), {
          label: 'In Progress',
          value: stryMutAct_9fa48("34600") ? mockCourses.length : (stryCov_9fa48("34600"), mockCourses.filter(stryMutAct_9fa48("34601") ? () => undefined : (stryCov_9fa48("34601"), c => stryMutAct_9fa48("34604") ? c.status !== 'in-progress' : stryMutAct_9fa48("34603") ? false : stryMutAct_9fa48("34602") ? true : (stryCov_9fa48("34602", "34603", "34604"), c.status === 'in-progress'))).length),
          color: 'text-yellow-400',
          icon: '📖'
        }), stryMutAct_9fa48("34608") ? {} : (stryCov_9fa48("34608"), {
          label: 'Overdue',
          value: overdueCourses.length,
          color: (stryMutAct_9fa48("34613") ? overdueCourses.length <= 0 : stryMutAct_9fa48("34612") ? overdueCourses.length >= 0 : stryMutAct_9fa48("34611") ? false : stryMutAct_9fa48("34610") ? true : (stryCov_9fa48("34610", "34611", "34612", "34613"), overdueCourses.length > 0)) ? 'text-red-400' : 'text-green-400',
          icon: '⚠️'
        })])).map(stryMutAct_9fa48("34617") ? () => undefined : (stryCov_9fa48("34617"), stat => <div key={stat.label} className="bg-neutral-800 rounded-xl border border-neutral-700 p-6">
                <span className="text-2xl">{stat.icon}</span>
                <p className={`text-3xl font-bold ${stat.color} mt-2`}>
                  {stat.value}{stat.total ? `/${stat.total}` : ''}
                </p>
                <p className="text-sm text-neutral-400">{stat.label}</p>
              </div>))}
          </div>

          {/* Learning Paths */}
          <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6">
            <h2 className="text-xl font-semibold mb-4">Your Learning Paths</h2>
            <div className="grid grid-cols-2 gap-4">
              {mockLearningPaths.map(stryMutAct_9fa48("34621") ? () => undefined : (stryCov_9fa48("34621"), path => <div key={path.id} className="p-4 bg-neutral-900 rounded-lg border border-neutral-700">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">{path.name}</h3>
                      <p className="text-sm text-neutral-400">{path.description}</p>
                    </div>
                    <span className="px-2 py-1 bg-primary-500/20 text-primary-400 rounded text-xs">{path.role}</span>
                  </div>
                  <div className="mb-2">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-neutral-400">{path.completedHours}h / {path.totalHours}h</span>
                      <span className="font-medium">{path.progress}%</span>
                    </div>
                    <div className="h-2 bg-neutral-700 rounded-full overflow-hidden">
                      <div className="h-full bg-primary-500 rounded-full transition-all duration-500" style={stryMutAct_9fa48("34622") ? {} : (stryCov_9fa48("34622"), {
                  width: `${path.progress}%`
                })} />
                    </div>
                  </div>
                  <button className="w-full mt-3 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
                    Continue Learning
                  </button>
                </div>))}
            </div>
          </div>

          {/* In Progress Courses */}
          <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6">
            <h2 className="text-xl font-semibold mb-4">Continue Where You Left Off</h2>
            <div className="space-y-3">
              {stryMutAct_9fa48("34624") ? mockCourses.map(course => <div key={course.id} onClick={() => setSelectedCourse(course)} className="p-4 bg-neutral-900 rounded-lg border border-neutral-700 hover:border-primary-500 cursor-pointer transition-all">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${getCategoryColor(course.category)}`}>
                          {course.category}
                        </span>
                        {course.required && <span className="px-2 py-0.5 bg-red-500/20 text-red-400 rounded text-xs">Required</span>}
                      </div>
                      <h3 className="font-semibold">{course.title}</h3>
                      <p className="text-sm text-neutral-400 mt-1">{course.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-neutral-500">
                        <span>⏱ {course.duration}</span>
                        <span>📖 {course.completedModules}/{course.modules} modules</span>
                        {course.dueDate && <span className={course.dueDate < new Date() ? 'text-red-400' : ''}>
                            📅 Due: {getDaysUntil(course.dueDate)}
                          </span>}
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="w-16 h-16 rounded-full border-4 border-primary-500 flex items-center justify-center">
                        <span className="text-lg font-bold">{Math.round(course.completedModules / course.modules * 100)}%</span>
                      </div>
                    </div>
                  </div>
                </div>) : (stryCov_9fa48("34624"), mockCourses.filter(stryMutAct_9fa48("34625") ? () => undefined : (stryCov_9fa48("34625"), c => stryMutAct_9fa48("34628") ? c.status !== 'in-progress' : stryMutAct_9fa48("34627") ? false : stryMutAct_9fa48("34626") ? true : (stryCov_9fa48("34626", "34627", "34628"), c.status === 'in-progress'))).map(stryMutAct_9fa48("34630") ? () => undefined : (stryCov_9fa48("34630"), course => <div key={course.id} onClick={stryMutAct_9fa48("34631") ? () => undefined : (stryCov_9fa48("34631"), () => setSelectedCourse(course))} className="p-4 bg-neutral-900 rounded-lg border border-neutral-700 hover:border-primary-500 cursor-pointer transition-all">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${getCategoryColor(course.category)}`}>
                          {course.category}
                        </span>
                        {stryMutAct_9fa48("34635") ? course.required || <span className="px-2 py-0.5 bg-red-500/20 text-red-400 rounded text-xs">Required</span> : stryMutAct_9fa48("34634") ? false : stryMutAct_9fa48("34633") ? true : (stryCov_9fa48("34633", "34634", "34635"), course.required && <span className="px-2 py-0.5 bg-red-500/20 text-red-400 rounded text-xs">Required</span>)}
                      </div>
                      <h3 className="font-semibold">{course.title}</h3>
                      <p className="text-sm text-neutral-400 mt-1">{course.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-neutral-500">
                        <span>⏱ {course.duration}</span>
                        <span>📖 {course.completedModules}/{course.modules} modules</span>
                        {stryMutAct_9fa48("34638") ? course.dueDate || <span className={course.dueDate < new Date() ? 'text-red-400' : ''}>
                            📅 Due: {getDaysUntil(course.dueDate)}
                          </span> : stryMutAct_9fa48("34637") ? false : stryMutAct_9fa48("34636") ? true : (stryCov_9fa48("34636", "34637", "34638"), course.dueDate && <span className={(stryMutAct_9fa48("34642") ? course.dueDate >= new Date() : stryMutAct_9fa48("34641") ? course.dueDate <= new Date() : stryMutAct_9fa48("34640") ? false : stryMutAct_9fa48("34639") ? true : (stryCov_9fa48("34639", "34640", "34641", "34642"), course.dueDate < new Date())) ? 'text-red-400' : ''}>
                            📅 Due: {getDaysUntil(course.dueDate)}
                          </span>)}
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="w-16 h-16 rounded-full border-4 border-primary-500 flex items-center justify-center">
                        <span className="text-lg font-bold">{Math.round(stryMutAct_9fa48("34645") ? course.completedModules / course.modules / 100 : (stryCov_9fa48("34645"), (stryMutAct_9fa48("34646") ? course.completedModules * course.modules : (stryCov_9fa48("34646"), course.completedModules / course.modules)) * 100))}%</span>
                      </div>
                    </div>
                  </div>
                </div>)))}
            </div>
          </div>

          {/* Upcoming Due */}
          {stryMutAct_9fa48("34649") ? mockCourses.filter(c => c.dueDate && c.status !== 'completed').length > 0 || <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6">
              <h2 className="text-xl font-semibold mb-4">Upcoming Deadlines</h2>
              <div className="space-y-2">
                {mockCourses.filter(c => c.dueDate && c.status !== 'completed').sort((a, b) => (a.dueDate?.getTime() || 0) - (b.dueDate?.getTime() || 0)).map(course => <div key={course.id} className="flex items-center justify-between p-3 bg-neutral-900 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className={`w-2 h-2 rounded-full ${course.dueDate && course.dueDate < new Date() ? 'bg-red-500' : course.dueDate && course.dueDate < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) ? 'bg-yellow-500' : 'bg-green-500'}`}></span>
                        <span>{course.title}</span>
                      </div>
                      <span className={`text-sm ${course.dueDate && course.dueDate < new Date() ? 'text-red-400 font-medium' : 'text-neutral-400'}`}>
                        {course.dueDate && getDaysUntil(course.dueDate)}
                      </span>
                    </div>)}
              </div>
            </div> : stryMutAct_9fa48("34648") ? false : stryMutAct_9fa48("34647") ? true : (stryCov_9fa48("34647", "34648", "34649"), (stryMutAct_9fa48("34652") ? mockCourses.filter(c => c.dueDate && c.status !== 'completed').length <= 0 : stryMutAct_9fa48("34651") ? mockCourses.filter(c => c.dueDate && c.status !== 'completed').length >= 0 : stryMutAct_9fa48("34650") ? true : (stryCov_9fa48("34650", "34651", "34652"), (stryMutAct_9fa48("34653") ? mockCourses.length : (stryCov_9fa48("34653"), mockCourses.filter(stryMutAct_9fa48("34654") ? () => undefined : (stryCov_9fa48("34654"), c => stryMutAct_9fa48("34657") ? c.dueDate || c.status !== 'completed' : stryMutAct_9fa48("34656") ? false : stryMutAct_9fa48("34655") ? true : (stryCov_9fa48("34655", "34656", "34657"), c.dueDate && (stryMutAct_9fa48("34659") ? c.status === 'completed' : stryMutAct_9fa48("34658") ? true : (stryCov_9fa48("34658", "34659"), c.status !== 'completed'))))).length)) > 0)) && <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6">
              <h2 className="text-xl font-semibold mb-4">Upcoming Deadlines</h2>
              <div className="space-y-2">
                {stryMutAct_9fa48("34662") ? mockCourses.sort((a, b) => (a.dueDate?.getTime() || 0) - (b.dueDate?.getTime() || 0)).map(course => <div key={course.id} className="flex items-center justify-between p-3 bg-neutral-900 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className={`w-2 h-2 rounded-full ${course.dueDate && course.dueDate < new Date() ? 'bg-red-500' : course.dueDate && course.dueDate < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) ? 'bg-yellow-500' : 'bg-green-500'}`}></span>
                        <span>{course.title}</span>
                      </div>
                      <span className={`text-sm ${course.dueDate && course.dueDate < new Date() ? 'text-red-400 font-medium' : 'text-neutral-400'}`}>
                        {course.dueDate && getDaysUntil(course.dueDate)}
                      </span>
                    </div>) : stryMutAct_9fa48("34661") ? mockCourses.filter(c => c.dueDate && c.status !== 'completed').map(course => <div key={course.id} className="flex items-center justify-between p-3 bg-neutral-900 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className={`w-2 h-2 rounded-full ${course.dueDate && course.dueDate < new Date() ? 'bg-red-500' : course.dueDate && course.dueDate < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) ? 'bg-yellow-500' : 'bg-green-500'}`}></span>
                        <span>{course.title}</span>
                      </div>
                      <span className={`text-sm ${course.dueDate && course.dueDate < new Date() ? 'text-red-400 font-medium' : 'text-neutral-400'}`}>
                        {course.dueDate && getDaysUntil(course.dueDate)}
                      </span>
                    </div>) : (stryCov_9fa48("34661", "34662"), mockCourses.filter(stryMutAct_9fa48("34663") ? () => undefined : (stryCov_9fa48("34663"), c => stryMutAct_9fa48("34666") ? c.dueDate || c.status !== 'completed' : stryMutAct_9fa48("34665") ? false : stryMutAct_9fa48("34664") ? true : (stryCov_9fa48("34664", "34665", "34666"), c.dueDate && (stryMutAct_9fa48("34668") ? c.status === 'completed' : stryMutAct_9fa48("34667") ? true : (stryCov_9fa48("34667", "34668"), c.status !== 'completed'))))).sort(stryMutAct_9fa48("34670") ? () => undefined : (stryCov_9fa48("34670"), (a, b) => stryMutAct_9fa48("34671") ? (a.dueDate?.getTime() || 0) + (b.dueDate?.getTime() || 0) : (stryCov_9fa48("34671"), (stryMutAct_9fa48("34674") ? a.dueDate?.getTime() && 0 : stryMutAct_9fa48("34673") ? false : stryMutAct_9fa48("34672") ? true : (stryCov_9fa48("34672", "34673", "34674"), (stryMutAct_9fa48("34675") ? a.dueDate.getTime() : (stryCov_9fa48("34675"), a.dueDate?.getTime())) || 0)) - (stryMutAct_9fa48("34678") ? b.dueDate?.getTime() && 0 : stryMutAct_9fa48("34677") ? false : stryMutAct_9fa48("34676") ? true : (stryCov_9fa48("34676", "34677", "34678"), (stryMutAct_9fa48("34679") ? b.dueDate.getTime() : (stryCov_9fa48("34679"), b.dueDate?.getTime())) || 0))))).map(stryMutAct_9fa48("34680") ? () => undefined : (stryCov_9fa48("34680"), course => <div key={course.id} className="flex items-center justify-between p-3 bg-neutral-900 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className={`w-2 h-2 rounded-full ${(stryMutAct_9fa48("34684") ? course.dueDate || course.dueDate < new Date() : stryMutAct_9fa48("34683") ? false : stryMutAct_9fa48("34682") ? true : (stryCov_9fa48("34682", "34683", "34684"), course.dueDate && (stryMutAct_9fa48("34687") ? course.dueDate >= new Date() : stryMutAct_9fa48("34686") ? course.dueDate <= new Date() : stryMutAct_9fa48("34685") ? true : (stryCov_9fa48("34685", "34686", "34687"), course.dueDate < new Date())))) ? 'bg-red-500' : (stryMutAct_9fa48("34691") ? course.dueDate || course.dueDate < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) : stryMutAct_9fa48("34690") ? false : stryMutAct_9fa48("34689") ? true : (stryCov_9fa48("34689", "34690", "34691"), course.dueDate && (stryMutAct_9fa48("34694") ? course.dueDate >= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) : stryMutAct_9fa48("34693") ? course.dueDate <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) : stryMutAct_9fa48("34692") ? true : (stryCov_9fa48("34692", "34693", "34694"), course.dueDate < new Date(stryMutAct_9fa48("34695") ? Date.now() - 7 * 24 * 60 * 60 * 1000 : (stryCov_9fa48("34695"), Date.now() + (stryMutAct_9fa48("34696") ? 7 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("34696"), (stryMutAct_9fa48("34697") ? 7 * 24 * 60 / 60 : (stryCov_9fa48("34697"), (stryMutAct_9fa48("34698") ? 7 * 24 / 60 : (stryCov_9fa48("34698"), (stryMutAct_9fa48("34699") ? 7 / 24 : (stryCov_9fa48("34699"), 7 * 24)) * 60)) * 60)) * 1000)))))))) ? 'bg-yellow-500' : 'bg-green-500'}`}></span>
                        <span>{course.title}</span>
                      </div>
                      <span className={`text-sm ${(stryMutAct_9fa48("34705") ? course.dueDate || course.dueDate < new Date() : stryMutAct_9fa48("34704") ? false : stryMutAct_9fa48("34703") ? true : (stryCov_9fa48("34703", "34704", "34705"), course.dueDate && (stryMutAct_9fa48("34708") ? course.dueDate >= new Date() : stryMutAct_9fa48("34707") ? course.dueDate <= new Date() : stryMutAct_9fa48("34706") ? true : (stryCov_9fa48("34706", "34707", "34708"), course.dueDate < new Date())))) ? 'text-red-400 font-medium' : 'text-neutral-400'}`}>
                        {stryMutAct_9fa48("34713") ? course.dueDate || getDaysUntil(course.dueDate) : stryMutAct_9fa48("34712") ? false : stryMutAct_9fa48("34711") ? true : (stryCov_9fa48("34711", "34712", "34713"), course.dueDate && getDaysUntil(course.dueDate))}
                      </span>
                    </div>)))}
              </div>
            </div>)}
        </div>)}

      {/* Courses Tab */}
      {stryMutAct_9fa48("34716") ? activeTab === 'courses' || <div className="space-y-4">
          <div className="flex items-center gap-4 mb-4">
            <select value={filterCategory} onChange={e => setFilterCategory(e.target.value as CourseCategory | 'all')} className="bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm">
              <option value="all">All Categories</option>
              <option value="onboarding">Onboarding</option>
              <option value="security">Security</option>
              <option value="compliance">Compliance</option>
              <option value="product">Product</option>
              <option value="role-specific">Role-Specific</option>
            </select>
            <div className="flex gap-2">
              <button className="px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-sm hover:bg-neutral-700 transition-colors">
                Required Only
              </button>
              <button className="px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-sm hover:bg-neutral-700 transition-colors">
                Not Started
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {filteredCourses.map(course => <div key={course.id} onClick={() => setSelectedCourse(course)} className="bg-neutral-800 rounded-xl border border-neutral-700 p-6 hover:border-primary-500 cursor-pointer transition-all">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${getCategoryColor(course.category)}`}>
                    {course.category}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium border ${getStatusColor(course.status)}`}>
                    {course.status.replace('-', ' ')}
                  </span>
                </div>
                <h3 className="font-semibold mb-2">{course.title}</h3>
                <p className="text-sm text-neutral-400 mb-4">{course.description}</p>
                <div className="flex items-center justify-between text-sm text-neutral-500">
                  <span>⏱ {course.duration}</span>
                  <span>📖 {course.modules} modules</span>
                </div>
                {course.required && <div className="mt-3 pt-3 border-t border-neutral-700">
                    <span className="text-xs text-red-400">⚠️ Required Training</span>
                  </div>}
                {course.status === 'completed' && course.score && <div className="mt-3 pt-3 border-t border-neutral-700 flex items-center justify-between">
                    <span className="text-xs text-neutral-400">Score</span>
                    <span className={`font-medium ${course.score >= course.passingScore ? 'text-green-400' : 'text-red-400'}`}>
                      {course.score}%
                    </span>
                  </div>}
              </div>)}
          </div>
        </div> : stryMutAct_9fa48("34715") ? false : stryMutAct_9fa48("34714") ? true : (stryCov_9fa48("34714", "34715", "34716"), (stryMutAct_9fa48("34718") ? activeTab !== 'courses' : stryMutAct_9fa48("34717") ? true : (stryCov_9fa48("34717", "34718"), activeTab === 'courses')) && <div className="space-y-4">
          <div className="flex items-center gap-4 mb-4">
            <select value={filterCategory} onChange={stryMutAct_9fa48("34720") ? () => undefined : (stryCov_9fa48("34720"), e => setFilterCategory(e.target.value as CourseCategory | 'all'))} className="bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm">
              <option value="all">All Categories</option>
              <option value="onboarding">Onboarding</option>
              <option value="security">Security</option>
              <option value="compliance">Compliance</option>
              <option value="product">Product</option>
              <option value="role-specific">Role-Specific</option>
            </select>
            <div className="flex gap-2">
              <button className="px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-sm hover:bg-neutral-700 transition-colors">
                Required Only
              </button>
              <button className="px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-sm hover:bg-neutral-700 transition-colors">
                Not Started
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {filteredCourses.map(stryMutAct_9fa48("34721") ? () => undefined : (stryCov_9fa48("34721"), course => <div key={course.id} onClick={stryMutAct_9fa48("34722") ? () => undefined : (stryCov_9fa48("34722"), () => setSelectedCourse(course))} className="bg-neutral-800 rounded-xl border border-neutral-700 p-6 hover:border-primary-500 cursor-pointer transition-all">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${getCategoryColor(course.category)}`}>
                    {course.category}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium border ${getStatusColor(course.status)}`}>
                    {course.status.replace('-', ' ')}
                  </span>
                </div>
                <h3 className="font-semibold mb-2">{course.title}</h3>
                <p className="text-sm text-neutral-400 mb-4">{course.description}</p>
                <div className="flex items-center justify-between text-sm text-neutral-500">
                  <span>⏱ {course.duration}</span>
                  <span>📖 {course.modules} modules</span>
                </div>
                {stryMutAct_9fa48("34729") ? course.required || <div className="mt-3 pt-3 border-t border-neutral-700">
                    <span className="text-xs text-red-400">⚠️ Required Training</span>
                  </div> : stryMutAct_9fa48("34728") ? false : stryMutAct_9fa48("34727") ? true : (stryCov_9fa48("34727", "34728", "34729"), course.required && <div className="mt-3 pt-3 border-t border-neutral-700">
                    <span className="text-xs text-red-400">⚠️ Required Training</span>
                  </div>)}
                {stryMutAct_9fa48("34732") ? course.status === 'completed' && course.score || <div className="mt-3 pt-3 border-t border-neutral-700 flex items-center justify-between">
                    <span className="text-xs text-neutral-400">Score</span>
                    <span className={`font-medium ${course.score >= course.passingScore ? 'text-green-400' : 'text-red-400'}`}>
                      {course.score}%
                    </span>
                  </div> : stryMutAct_9fa48("34731") ? false : stryMutAct_9fa48("34730") ? true : (stryCov_9fa48("34730", "34731", "34732"), (stryMutAct_9fa48("34734") ? course.status === 'completed' || course.score : stryMutAct_9fa48("34733") ? true : (stryCov_9fa48("34733", "34734"), (stryMutAct_9fa48("34736") ? course.status !== 'completed' : stryMutAct_9fa48("34735") ? true : (stryCov_9fa48("34735", "34736"), course.status === 'completed')) && course.score)) && <div className="mt-3 pt-3 border-t border-neutral-700 flex items-center justify-between">
                    <span className="text-xs text-neutral-400">Score</span>
                    <span className={`font-medium ${(stryMutAct_9fa48("34742") ? course.score < course.passingScore : stryMutAct_9fa48("34741") ? course.score > course.passingScore : stryMutAct_9fa48("34740") ? false : stryMutAct_9fa48("34739") ? true : (stryCov_9fa48("34739", "34740", "34741", "34742"), course.score >= course.passingScore)) ? 'text-green-400' : 'text-red-400'}`}>
                      {course.score}%
                    </span>
                  </div>)}
              </div>))}
          </div>
        </div>)}

      {/* Certifications Tab */}
      {stryMutAct_9fa48("34747") ? activeTab === 'certifications' || <div className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            {mockCertifications.map(cert => <div key={cert.id} className={`rounded-xl border-2 p-6 ${getCertStatusColor(cert.status)}`}>
                <div className="text-center mb-4">
                  <span className="text-4xl">{cert.status === 'valid' ? '🏆' : cert.status === 'expiring-soon' ? '⚠️' : cert.status === 'expired' ? '❌' : '🔒'}</span>
                </div>
                <h3 className="font-semibold text-center mb-2">{cert.name}</h3>
                <p className="text-sm text-neutral-400 text-center mb-4">{cert.issuer}</p>
                {cert.status === 'valid' && cert.expiryDate && <p className="text-xs text-center text-neutral-500">
                    Expires: {formatDate(cert.expiryDate)}
                  </p>}
                {cert.status === 'expiring-soon' && cert.expiryDate && <p className="text-xs text-center text-yellow-400 font-medium">
                    Expires in {getDaysUntil(cert.expiryDate)}
                  </p>}
                {cert.status === 'not-certified' && <button className="w-full mt-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
                    Start Certification
                  </button>}
                {cert.status === 'expiring-soon' && <button className="w-full mt-2 px-4 py-2 bg-yellow-600 text-white rounded-lg text-sm font-medium hover:bg-yellow-700 transition-colors">
                    Renew Now
                  </button>}
              </div>)}
          </div>

          <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6">
            <h2 className="text-xl font-semibold mb-4">Certification Requirements</h2>
            <div className="space-y-4">
              {mockCertifications.map(cert => <div key={cert.id} className="p-4 bg-neutral-900 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">{cert.name}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium border ${getCertStatusColor(cert.status)}`}>
                      {cert.status.replace('-', ' ')}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {cert.courses.map(courseId => {
                const course = mockCourses.find(c => c.id === courseId);
                if (!course) return null;
                return <div key={courseId} className="flex items-center justify-between p-2 bg-neutral-800 rounded">
                          <div className="flex items-center gap-2">
                            {course.status === 'completed' ? <span className="text-green-500">✓</span> : <span className="text-neutral-500">○</span>}
                            <span className={course.status === 'completed' ? 'text-neutral-400' : ''}>{course.title}</span>
                          </div>
                          {course.score && <span className="text-sm text-green-400">{course.score}%</span>}
                        </div>;
              })}
                  </div>
                </div>)}
            </div>
          </div>
        </div> : stryMutAct_9fa48("34746") ? false : stryMutAct_9fa48("34745") ? true : (stryCov_9fa48("34745", "34746", "34747"), (stryMutAct_9fa48("34749") ? activeTab !== 'certifications' : stryMutAct_9fa48("34748") ? true : (stryCov_9fa48("34748", "34749"), activeTab === 'certifications')) && <div className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            {mockCertifications.map(stryMutAct_9fa48("34751") ? () => undefined : (stryCov_9fa48("34751"), cert => <div key={cert.id} className={`rounded-xl border-2 p-6 ${getCertStatusColor(cert.status)}`}>
                <div className="text-center mb-4">
                  <span className="text-4xl">{(stryMutAct_9fa48("34755") ? cert.status !== 'valid' : stryMutAct_9fa48("34754") ? false : stryMutAct_9fa48("34753") ? true : (stryCov_9fa48("34753", "34754", "34755"), cert.status === 'valid')) ? '🏆' : (stryMutAct_9fa48("34760") ? cert.status !== 'expiring-soon' : stryMutAct_9fa48("34759") ? false : stryMutAct_9fa48("34758") ? true : (stryCov_9fa48("34758", "34759", "34760"), cert.status === 'expiring-soon')) ? '⚠️' : (stryMutAct_9fa48("34765") ? cert.status !== 'expired' : stryMutAct_9fa48("34764") ? false : stryMutAct_9fa48("34763") ? true : (stryCov_9fa48("34763", "34764", "34765"), cert.status === 'expired')) ? '❌' : '🔒'}</span>
                </div>
                <h3 className="font-semibold text-center mb-2">{cert.name}</h3>
                <p className="text-sm text-neutral-400 text-center mb-4">{cert.issuer}</p>
                {stryMutAct_9fa48("34771") ? cert.status === 'valid' && cert.expiryDate || <p className="text-xs text-center text-neutral-500">
                    Expires: {formatDate(cert.expiryDate)}
                  </p> : stryMutAct_9fa48("34770") ? false : stryMutAct_9fa48("34769") ? true : (stryCov_9fa48("34769", "34770", "34771"), (stryMutAct_9fa48("34773") ? cert.status === 'valid' || cert.expiryDate : stryMutAct_9fa48("34772") ? true : (stryCov_9fa48("34772", "34773"), (stryMutAct_9fa48("34775") ? cert.status !== 'valid' : stryMutAct_9fa48("34774") ? true : (stryCov_9fa48("34774", "34775"), cert.status === 'valid')) && cert.expiryDate)) && <p className="text-xs text-center text-neutral-500">
                    Expires: {formatDate(cert.expiryDate)}
                  </p>)}
                {stryMutAct_9fa48("34779") ? cert.status === 'expiring-soon' && cert.expiryDate || <p className="text-xs text-center text-yellow-400 font-medium">
                    Expires in {getDaysUntil(cert.expiryDate)}
                  </p> : stryMutAct_9fa48("34778") ? false : stryMutAct_9fa48("34777") ? true : (stryCov_9fa48("34777", "34778", "34779"), (stryMutAct_9fa48("34781") ? cert.status === 'expiring-soon' || cert.expiryDate : stryMutAct_9fa48("34780") ? true : (stryCov_9fa48("34780", "34781"), (stryMutAct_9fa48("34783") ? cert.status !== 'expiring-soon' : stryMutAct_9fa48("34782") ? true : (stryCov_9fa48("34782", "34783"), cert.status === 'expiring-soon')) && cert.expiryDate)) && <p className="text-xs text-center text-yellow-400 font-medium">
                    Expires in {getDaysUntil(cert.expiryDate)}
                  </p>)}
                {stryMutAct_9fa48("34787") ? cert.status === 'not-certified' || <button className="w-full mt-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
                    Start Certification
                  </button> : stryMutAct_9fa48("34786") ? false : stryMutAct_9fa48("34785") ? true : (stryCov_9fa48("34785", "34786", "34787"), (stryMutAct_9fa48("34789") ? cert.status !== 'not-certified' : stryMutAct_9fa48("34788") ? true : (stryCov_9fa48("34788", "34789"), cert.status === 'not-certified')) && <button className="w-full mt-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
                    Start Certification
                  </button>)}
                {stryMutAct_9fa48("34793") ? cert.status === 'expiring-soon' || <button className="w-full mt-2 px-4 py-2 bg-yellow-600 text-white rounded-lg text-sm font-medium hover:bg-yellow-700 transition-colors">
                    Renew Now
                  </button> : stryMutAct_9fa48("34792") ? false : stryMutAct_9fa48("34791") ? true : (stryCov_9fa48("34791", "34792", "34793"), (stryMutAct_9fa48("34795") ? cert.status !== 'expiring-soon' : stryMutAct_9fa48("34794") ? true : (stryCov_9fa48("34794", "34795"), cert.status === 'expiring-soon')) && <button className="w-full mt-2 px-4 py-2 bg-yellow-600 text-white rounded-lg text-sm font-medium hover:bg-yellow-700 transition-colors">
                    Renew Now
                  </button>)}
              </div>))}
          </div>

          <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6">
            <h2 className="text-xl font-semibold mb-4">Certification Requirements</h2>
            <div className="space-y-4">
              {mockCertifications.map(stryMutAct_9fa48("34797") ? () => undefined : (stryCov_9fa48("34797"), cert => <div key={cert.id} className="p-4 bg-neutral-900 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">{cert.name}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium border ${getCertStatusColor(cert.status)}`}>
                      {cert.status.replace('-', ' ')}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {cert.courses.map(courseId => {
                const course = mockCourses.find(stryMutAct_9fa48("34802") ? () => undefined : (stryCov_9fa48("34802"), c => stryMutAct_9fa48("34805") ? c.id !== courseId : stryMutAct_9fa48("34804") ? false : stryMutAct_9fa48("34803") ? true : (stryCov_9fa48("34803", "34804", "34805"), c.id === courseId)));
                if (stryMutAct_9fa48("34808") ? false : stryMutAct_9fa48("34807") ? true : stryMutAct_9fa48("34806") ? course : (stryCov_9fa48("34806", "34807", "34808"), !course)) return null;
                return <div key={courseId} className="flex items-center justify-between p-2 bg-neutral-800 rounded">
                          <div className="flex items-center gap-2">
                            {(stryMutAct_9fa48("34811") ? course.status !== 'completed' : stryMutAct_9fa48("34810") ? false : stryMutAct_9fa48("34809") ? true : (stryCov_9fa48("34809", "34810", "34811"), course.status === 'completed')) ? <span className="text-green-500">✓</span> : <span className="text-neutral-500">○</span>}
                            <span className={(stryMutAct_9fa48("34815") ? course.status !== 'completed' : stryMutAct_9fa48("34814") ? false : stryMutAct_9fa48("34813") ? true : (stryCov_9fa48("34813", "34814", "34815"), course.status === 'completed')) ? 'text-neutral-400' : ''}>{course.title}</span>
                          </div>
                          {stryMutAct_9fa48("34821") ? course.score || <span className="text-sm text-green-400">{course.score}%</span> : stryMutAct_9fa48("34820") ? false : stryMutAct_9fa48("34819") ? true : (stryCov_9fa48("34819", "34820", "34821"), course.score && <span className="text-sm text-green-400">{course.score}%</span>)}
                        </div>;
              })}
                  </div>
                </div>))}
            </div>
          </div>
        </div>)}

      {/* Team Tab */}
      {stryMutAct_9fa48("34824") ? activeTab === 'team' || <div className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            {[{
          label: 'Team Members',
          value: mockTeamMembers.length,
          icon: '👥'
        }, {
          label: 'Fully Compliant',
          value: mockTeamMembers.filter(m => m.completedCourses >= m.totalRequired).length,
          icon: '✅'
        }, {
          label: 'With Overdue',
          value: mockTeamMembers.filter(m => m.overdueCourses > 0).length,
          color: 'text-red-400',
          icon: '⚠️'
        }, {
          label: 'Avg Completion',
          value: `${Math.round(mockTeamMembers.reduce((acc, m) => acc + m.completedCourses / m.totalRequired, 0) / mockTeamMembers.length * 100)}%`,
          icon: '📊'
        }].map(stat => <div key={stat.label} className="bg-neutral-800 rounded-xl border border-neutral-700 p-6">
                <span className="text-2xl">{stat.icon}</span>
                <p className={`text-3xl font-bold ${stat.color || 'text-white'} mt-2`}>{stat.value}</p>
                <p className="text-sm text-neutral-400">{stat.label}</p>
              </div>)}
          </div>

          <div className="bg-neutral-800 rounded-xl border border-neutral-700 overflow-hidden">
            <table className="w-full">
              <thead className="bg-neutral-900">
                <tr>
                  <th className="text-left p-4 text-sm font-medium text-neutral-400">Name</th>
                  <th className="text-left p-4 text-sm font-medium text-neutral-400">Role</th>
                  <th className="text-left p-4 text-sm font-medium text-neutral-400">Department</th>
                  <th className="text-left p-4 text-sm font-medium text-neutral-400">Progress</th>
                  <th className="text-left p-4 text-sm font-medium text-neutral-400">Overdue</th>
                  <th className="text-left p-4 text-sm font-medium text-neutral-400">Last Activity</th>
                </tr>
              </thead>
              <tbody>
                {mockTeamMembers.map(member => <tr key={member.id} className="border-t border-neutral-700 hover:bg-neutral-700/50 cursor-pointer transition-colors">
                    <td className="p-4 font-medium">{member.name}</td>
                    <td className="p-4 text-neutral-400">{member.role}</td>
                    <td className="p-4 text-neutral-400">{member.department}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-neutral-700 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${member.completedCourses >= member.totalRequired ? 'bg-green-500' : 'bg-primary-500'}`} style={{
                      width: `${member.completedCourses / member.totalRequired * 100}%`
                    }} />
                        </div>
                        <span className="text-sm text-neutral-400">{member.completedCourses}/{member.totalRequired}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      {member.overdueCourses > 0 ? <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs font-medium">
                          {member.overdueCourses} overdue
                        </span> : <span className="text-green-400">✓</span>}
                    </td>
                    <td className="p-4 text-neutral-400 text-sm">
                      {formatDate(member.lastActivity)}
                    </td>
                  </tr>)}
              </tbody>
            </table>
          </div>
        </div> : stryMutAct_9fa48("34823") ? false : stryMutAct_9fa48("34822") ? true : (stryCov_9fa48("34822", "34823", "34824"), (stryMutAct_9fa48("34826") ? activeTab !== 'team' : stryMutAct_9fa48("34825") ? true : (stryCov_9fa48("34825", "34826"), activeTab === 'team')) && <div className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            {(stryMutAct_9fa48("34828") ? [] : (stryCov_9fa48("34828"), [stryMutAct_9fa48("34829") ? {} : (stryCov_9fa48("34829"), {
          label: 'Team Members',
          value: mockTeamMembers.length,
          icon: '👥'
        }), stryMutAct_9fa48("34832") ? {} : (stryCov_9fa48("34832"), {
          label: 'Fully Compliant',
          value: stryMutAct_9fa48("34834") ? mockTeamMembers.length : (stryCov_9fa48("34834"), mockTeamMembers.filter(stryMutAct_9fa48("34835") ? () => undefined : (stryCov_9fa48("34835"), m => stryMutAct_9fa48("34839") ? m.completedCourses < m.totalRequired : stryMutAct_9fa48("34838") ? m.completedCourses > m.totalRequired : stryMutAct_9fa48("34837") ? false : stryMutAct_9fa48("34836") ? true : (stryCov_9fa48("34836", "34837", "34838", "34839"), m.completedCourses >= m.totalRequired))).length),
          icon: '✅'
        }), stryMutAct_9fa48("34841") ? {} : (stryCov_9fa48("34841"), {
          label: 'With Overdue',
          value: stryMutAct_9fa48("34843") ? mockTeamMembers.length : (stryCov_9fa48("34843"), mockTeamMembers.filter(stryMutAct_9fa48("34844") ? () => undefined : (stryCov_9fa48("34844"), m => stryMutAct_9fa48("34848") ? m.overdueCourses <= 0 : stryMutAct_9fa48("34847") ? m.overdueCourses >= 0 : stryMutAct_9fa48("34846") ? false : stryMutAct_9fa48("34845") ? true : (stryCov_9fa48("34845", "34846", "34847", "34848"), m.overdueCourses > 0))).length),
          color: 'text-red-400',
          icon: '⚠️'
        }), stryMutAct_9fa48("34851") ? {} : (stryCov_9fa48("34851"), {
          label: 'Avg Completion',
          value: `${Math.round(stryMutAct_9fa48("34854") ? mockTeamMembers.reduce((acc, m) => acc + m.completedCourses / m.totalRequired, 0) / mockTeamMembers.length / 100 : (stryCov_9fa48("34854"), (stryMutAct_9fa48("34855") ? mockTeamMembers.reduce((acc, m) => acc + m.completedCourses / m.totalRequired, 0) * mockTeamMembers.length : (stryCov_9fa48("34855"), mockTeamMembers.reduce(stryMutAct_9fa48("34856") ? () => undefined : (stryCov_9fa48("34856"), (acc, m) => stryMutAct_9fa48("34857") ? acc - m.completedCourses / m.totalRequired : (stryCov_9fa48("34857"), acc + (stryMutAct_9fa48("34858") ? m.completedCourses * m.totalRequired : (stryCov_9fa48("34858"), m.completedCourses / m.totalRequired)))), 0) / mockTeamMembers.length)) * 100))}%`,
          icon: '📊'
        })])).map(stryMutAct_9fa48("34860") ? () => undefined : (stryCov_9fa48("34860"), stat => <div key={stat.label} className="bg-neutral-800 rounded-xl border border-neutral-700 p-6">
                <span className="text-2xl">{stat.icon}</span>
                <p className={`text-3xl font-bold ${stryMutAct_9fa48("34864") ? stat.color && 'text-white' : stryMutAct_9fa48("34863") ? false : stryMutAct_9fa48("34862") ? true : (stryCov_9fa48("34862", "34863", "34864"), stat.color || 'text-white')} mt-2`}>{stat.value}</p>
                <p className="text-sm text-neutral-400">{stat.label}</p>
              </div>))}
          </div>

          <div className="bg-neutral-800 rounded-xl border border-neutral-700 overflow-hidden">
            <table className="w-full">
              <thead className="bg-neutral-900">
                <tr>
                  <th className="text-left p-4 text-sm font-medium text-neutral-400">Name</th>
                  <th className="text-left p-4 text-sm font-medium text-neutral-400">Role</th>
                  <th className="text-left p-4 text-sm font-medium text-neutral-400">Department</th>
                  <th className="text-left p-4 text-sm font-medium text-neutral-400">Progress</th>
                  <th className="text-left p-4 text-sm font-medium text-neutral-400">Overdue</th>
                  <th className="text-left p-4 text-sm font-medium text-neutral-400">Last Activity</th>
                </tr>
              </thead>
              <tbody>
                {mockTeamMembers.map(stryMutAct_9fa48("34866") ? () => undefined : (stryCov_9fa48("34866"), member => <tr key={member.id} className="border-t border-neutral-700 hover:bg-neutral-700/50 cursor-pointer transition-colors">
                    <td className="p-4 font-medium">{member.name}</td>
                    <td className="p-4 text-neutral-400">{member.role}</td>
                    <td className="p-4 text-neutral-400">{member.department}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-neutral-700 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${(stryMutAct_9fa48("34871") ? member.completedCourses < member.totalRequired : stryMutAct_9fa48("34870") ? member.completedCourses > member.totalRequired : stryMutAct_9fa48("34869") ? false : stryMutAct_9fa48("34868") ? true : (stryCov_9fa48("34868", "34869", "34870", "34871"), member.completedCourses >= member.totalRequired)) ? 'bg-green-500' : 'bg-primary-500'}`} style={stryMutAct_9fa48("34874") ? {} : (stryCov_9fa48("34874"), {
                      width: `${stryMutAct_9fa48("34876") ? member.completedCourses / member.totalRequired / 100 : (stryCov_9fa48("34876"), (stryMutAct_9fa48("34877") ? member.completedCourses * member.totalRequired : (stryCov_9fa48("34877"), member.completedCourses / member.totalRequired)) * 100)}%`
                    })} />
                        </div>
                        <span className="text-sm text-neutral-400">{member.completedCourses}/{member.totalRequired}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      {(stryMutAct_9fa48("34881") ? member.overdueCourses <= 0 : stryMutAct_9fa48("34880") ? member.overdueCourses >= 0 : stryMutAct_9fa48("34879") ? false : stryMutAct_9fa48("34878") ? true : (stryCov_9fa48("34878", "34879", "34880", "34881"), member.overdueCourses > 0)) ? <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs font-medium">
                          {member.overdueCourses} overdue
                        </span> : <span className="text-green-400">✓</span>}
                    </td>
                    <td className="p-4 text-neutral-400 text-sm">
                      {formatDate(member.lastActivity)}
                    </td>
                  </tr>))}
              </tbody>
            </table>
          </div>
        </div>)}

      {/* Reports Tab */}
      {stryMutAct_9fa48("34884") ? activeTab === 'reports' || <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6">
              <h3 className="text-lg font-semibold mb-4">Compliance Summary</h3>
              <div className="space-y-4">
                {['onboarding', 'security', 'compliance'].map(category => {
              const courses = mockCourses.filter(c => c.category === category && c.required);
              const completed = courses.filter(c => c.status === 'completed').length;
              return <div key={category}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="capitalize">{category}</span>
                        <span className="text-sm">{completed}/{courses.length}</span>
                      </div>
                      <div className="h-2 bg-neutral-700 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${completed === courses.length ? 'bg-green-500' : 'bg-primary-500'}`} style={{
                    width: courses.length > 0 ? `${completed / courses.length * 100}%` : '0%'
                  }} />
                      </div>
                    </div>;
            })}
              </div>
            </div>

            <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                {[{
              label: 'Export Compliance Report',
              icon: '📄',
              action: 'PDF report of all training status'
            }, {
              label: 'Send Reminders',
              icon: '📧',
              action: 'Notify users with overdue training'
            }, {
              label: 'Schedule Training',
              icon: '📅',
              action: 'Bulk assign courses to team'
            }, {
              label: 'Audit Trail Export',
              icon: '📋',
              action: 'Download completion certificates'
            }].map(action => <button key={action.label} className="w-full p-3 bg-neutral-900 rounded-lg border border-neutral-700 text-left hover:border-primary-500 transition-all">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{action.icon}</span>
                      <div>
                        <p className="font-medium">{action.label}</p>
                        <p className="text-sm text-neutral-400">{action.action}</p>
                      </div>
                    </div>
                  </button>)}
              </div>
            </div>
          </div>

          <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6">
            <h3 className="text-lg font-semibold mb-4">Training Metrics</h3>
            <div className="grid grid-cols-4 gap-6">
              {[{
            label: 'Total Training Hours',
            value: '156h',
            subtext: 'This quarter'
          }, {
            label: 'Average Score',
            value: '89%',
            subtext: 'Across all courses'
          }, {
            label: 'Completion Rate',
            value: '94%',
            subtext: 'Required training'
          }, {
            label: 'Certifications Earned',
            value: '23',
            subtext: 'This year'
          }].map(metric => <div key={metric.label} className="text-center">
                  <p className="text-3xl font-bold text-primary-400">{metric.value}</p>
                  <p className="font-medium mt-1">{metric.label}</p>
                  <p className="text-sm text-neutral-500">{metric.subtext}</p>
                </div>)}
            </div>
          </div>
        </div> : stryMutAct_9fa48("34883") ? false : stryMutAct_9fa48("34882") ? true : (stryCov_9fa48("34882", "34883", "34884"), (stryMutAct_9fa48("34886") ? activeTab !== 'reports' : stryMutAct_9fa48("34885") ? true : (stryCov_9fa48("34885", "34886"), activeTab === 'reports')) && <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6">
              <h3 className="text-lg font-semibold mb-4">Compliance Summary</h3>
              <div className="space-y-4">
                {(stryMutAct_9fa48("34888") ? [] : (stryCov_9fa48("34888"), ['onboarding', 'security', 'compliance'])).map(category => {
              const courses = stryMutAct_9fa48("34893") ? mockCourses : (stryCov_9fa48("34893"), mockCourses.filter(stryMutAct_9fa48("34894") ? () => undefined : (stryCov_9fa48("34894"), c => stryMutAct_9fa48("34897") ? c.category === category || c.required : stryMutAct_9fa48("34896") ? false : stryMutAct_9fa48("34895") ? true : (stryCov_9fa48("34895", "34896", "34897"), (stryMutAct_9fa48("34899") ? c.category !== category : stryMutAct_9fa48("34898") ? true : (stryCov_9fa48("34898", "34899"), c.category === category)) && c.required))));
              const completed = stryMutAct_9fa48("34900") ? courses.length : (stryCov_9fa48("34900"), courses.filter(stryMutAct_9fa48("34901") ? () => undefined : (stryCov_9fa48("34901"), c => stryMutAct_9fa48("34904") ? c.status !== 'completed' : stryMutAct_9fa48("34903") ? false : stryMutAct_9fa48("34902") ? true : (stryCov_9fa48("34902", "34903", "34904"), c.status === 'completed'))).length);
              return <div key={category}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="capitalize">{category}</span>
                        <span className="text-sm">{completed}/{courses.length}</span>
                      </div>
                      <div className="h-2 bg-neutral-700 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${(stryMutAct_9fa48("34909") ? completed !== courses.length : stryMutAct_9fa48("34908") ? false : stryMutAct_9fa48("34907") ? true : (stryCov_9fa48("34907", "34908", "34909"), completed === courses.length)) ? 'bg-green-500' : 'bg-primary-500'}`} style={stryMutAct_9fa48("34912") ? {} : (stryCov_9fa48("34912"), {
                    width: (stryMutAct_9fa48("34916") ? courses.length <= 0 : stryMutAct_9fa48("34915") ? courses.length >= 0 : stryMutAct_9fa48("34914") ? false : stryMutAct_9fa48("34913") ? true : (stryCov_9fa48("34913", "34914", "34915", "34916"), courses.length > 0)) ? `${stryMutAct_9fa48("34918") ? completed / courses.length / 100 : (stryCov_9fa48("34918"), (stryMutAct_9fa48("34919") ? completed * courses.length : (stryCov_9fa48("34919"), completed / courses.length)) * 100)}%` : '0%'
                  })} />
                      </div>
                    </div>;
            })}
              </div>
            </div>

            <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                {(stryMutAct_9fa48("34921") ? [] : (stryCov_9fa48("34921"), [stryMutAct_9fa48("34922") ? {} : (stryCov_9fa48("34922"), {
              label: 'Export Compliance Report',
              icon: '📄',
              action: 'PDF report of all training status'
            }), stryMutAct_9fa48("34926") ? {} : (stryCov_9fa48("34926"), {
              label: 'Send Reminders',
              icon: '📧',
              action: 'Notify users with overdue training'
            }), stryMutAct_9fa48("34930") ? {} : (stryCov_9fa48("34930"), {
              label: 'Schedule Training',
              icon: '📅',
              action: 'Bulk assign courses to team'
            }), stryMutAct_9fa48("34934") ? {} : (stryCov_9fa48("34934"), {
              label: 'Audit Trail Export',
              icon: '📋',
              action: 'Download completion certificates'
            })])).map(stryMutAct_9fa48("34938") ? () => undefined : (stryCov_9fa48("34938"), action => <button key={action.label} className="w-full p-3 bg-neutral-900 rounded-lg border border-neutral-700 text-left hover:border-primary-500 transition-all">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{action.icon}</span>
                      <div>
                        <p className="font-medium">{action.label}</p>
                        <p className="text-sm text-neutral-400">{action.action}</p>
                      </div>
                    </div>
                  </button>))}
              </div>
            </div>
          </div>

          <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6">
            <h3 className="text-lg font-semibold mb-4">Training Metrics</h3>
            <div className="grid grid-cols-4 gap-6">
              {(stryMutAct_9fa48("34939") ? [] : (stryCov_9fa48("34939"), [stryMutAct_9fa48("34940") ? {} : (stryCov_9fa48("34940"), {
            label: 'Total Training Hours',
            value: '156h',
            subtext: 'This quarter'
          }), stryMutAct_9fa48("34944") ? {} : (stryCov_9fa48("34944"), {
            label: 'Average Score',
            value: '89%',
            subtext: 'Across all courses'
          }), stryMutAct_9fa48("34948") ? {} : (stryCov_9fa48("34948"), {
            label: 'Completion Rate',
            value: '94%',
            subtext: 'Required training'
          }), stryMutAct_9fa48("34952") ? {} : (stryCov_9fa48("34952"), {
            label: 'Certifications Earned',
            value: '23',
            subtext: 'This year'
          })])).map(stryMutAct_9fa48("34956") ? () => undefined : (stryCov_9fa48("34956"), metric => <div key={metric.label} className="text-center">
                  <p className="text-3xl font-bold text-primary-400">{metric.value}</p>
                  <p className="font-medium mt-1">{metric.label}</p>
                  <p className="text-sm text-neutral-500">{metric.subtext}</p>
                </div>))}
            </div>
          </div>
        </div>)}

      {/* Course Detail Modal */}
      {stryMutAct_9fa48("34959") ? selectedCourse || <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-8">
          <div className="bg-neutral-800 rounded-2xl border border-neutral-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-neutral-700">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${getCategoryColor(selectedCourse.category)}`}>
                      {selectedCourse.category}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium border ${getStatusColor(selectedCourse.status)}`}>
                      {selectedCourse.status.replace('-', ' ')}
                    </span>
                    {selectedCourse.required && <span className="px-2 py-0.5 bg-red-500/20 text-red-400 rounded text-xs">Required</span>}
                  </div>
                  <h2 className="text-2xl font-bold">{selectedCourse.title}</h2>
                </div>
                <button onClick={() => setSelectedCourse(null)} className="p-2 hover:bg-neutral-700 rounded-lg transition-colors">
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-neutral-300">{selectedCourse.description}</p>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 bg-neutral-900 rounded-lg">
                  <p className="text-sm text-neutral-400">Duration</p>
                  <p className="font-semibold">{selectedCourse.duration}</p>
                </div>
                <div className="p-3 bg-neutral-900 rounded-lg">
                  <p className="text-sm text-neutral-400">Modules</p>
                  <p className="font-semibold">{selectedCourse.modules}</p>
                </div>
                <div className="p-3 bg-neutral-900 rounded-lg">
                  <p className="text-sm text-neutral-400">Passing Score</p>
                  <p className="font-semibold">{selectedCourse.passingScore}%</p>
                </div>
              </div>

              {selectedCourse.status === 'in-progress' && <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-neutral-400">Progress</span>
                    <span>{selectedCourse.completedModules}/{selectedCourse.modules} modules</span>
                  </div>
                  <div className="h-3 bg-neutral-700 rounded-full overflow-hidden">
                    <div className="h-full bg-primary-500 rounded-full" style={{
                width: `${selectedCourse.completedModules / selectedCourse.modules * 100}%`
              }} />
                  </div>
                </div>}

              {selectedCourse.status === 'completed' && <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-400 font-medium">✓ Completed</p>
                      <p className="text-sm text-neutral-400">
                        {selectedCourse.completedDate && formatDate(selectedCourse.completedDate)}
                      </p>
                    </div>
                    {selectedCourse.score && <div className="text-right">
                        <p className="text-sm text-neutral-400">Final Score</p>
                        <p className="text-2xl font-bold text-green-400">{selectedCourse.score}%</p>
                      </div>}
                  </div>
                </div>}

              {selectedCourse.dueDate && selectedCourse.status !== 'completed' && <div className={`p-4 rounded-lg border ${selectedCourse.dueDate < new Date() ? 'bg-red-500/10 border-red-500/30' : 'bg-yellow-500/10 border-yellow-500/30'}`}>
                  <p className={selectedCourse.dueDate < new Date() ? 'text-red-400' : 'text-yellow-400'}>
                    ⚠️ Due: {formatDate(selectedCourse.dueDate)} ({getDaysUntil(selectedCourse.dueDate)})
                  </p>
                </div>}
            </div>
            <div className="p-6 border-t border-neutral-700 flex justify-end gap-3">
              {selectedCourse.status === 'completed' && <button className="px-4 py-2 border border-neutral-600 text-neutral-300 rounded-lg hover:bg-neutral-700 transition-colors">
                  Download Certificate
                </button>}
              <button className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors">
                {selectedCourse.status === 'not-started' ? 'Start Course' : selectedCourse.status === 'in-progress' ? 'Continue Learning' : 'Retake Course'}
              </button>
            </div>
          </div>
        </div> : stryMutAct_9fa48("34958") ? false : stryMutAct_9fa48("34957") ? true : (stryCov_9fa48("34957", "34958", "34959"), selectedCourse && <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-8">
          <div className="bg-neutral-800 rounded-2xl border border-neutral-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-neutral-700">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${getCategoryColor(selectedCourse.category)}`}>
                      {selectedCourse.category}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium border ${getStatusColor(selectedCourse.status)}`}>
                      {selectedCourse.status.replace('-', ' ')}
                    </span>
                    {stryMutAct_9fa48("34966") ? selectedCourse.required || <span className="px-2 py-0.5 bg-red-500/20 text-red-400 rounded text-xs">Required</span> : stryMutAct_9fa48("34965") ? false : stryMutAct_9fa48("34964") ? true : (stryCov_9fa48("34964", "34965", "34966"), selectedCourse.required && <span className="px-2 py-0.5 bg-red-500/20 text-red-400 rounded text-xs">Required</span>)}
                  </div>
                  <h2 className="text-2xl font-bold">{selectedCourse.title}</h2>
                </div>
                <button onClick={stryMutAct_9fa48("34967") ? () => undefined : (stryCov_9fa48("34967"), () => setSelectedCourse(null))} className="p-2 hover:bg-neutral-700 rounded-lg transition-colors">
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-neutral-300">{selectedCourse.description}</p>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 bg-neutral-900 rounded-lg">
                  <p className="text-sm text-neutral-400">Duration</p>
                  <p className="font-semibold">{selectedCourse.duration}</p>
                </div>
                <div className="p-3 bg-neutral-900 rounded-lg">
                  <p className="text-sm text-neutral-400">Modules</p>
                  <p className="font-semibold">{selectedCourse.modules}</p>
                </div>
                <div className="p-3 bg-neutral-900 rounded-lg">
                  <p className="text-sm text-neutral-400">Passing Score</p>
                  <p className="font-semibold">{selectedCourse.passingScore}%</p>
                </div>
              </div>

              {stryMutAct_9fa48("34970") ? selectedCourse.status === 'in-progress' || <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-neutral-400">Progress</span>
                    <span>{selectedCourse.completedModules}/{selectedCourse.modules} modules</span>
                  </div>
                  <div className="h-3 bg-neutral-700 rounded-full overflow-hidden">
                    <div className="h-full bg-primary-500 rounded-full" style={{
                width: `${selectedCourse.completedModules / selectedCourse.modules * 100}%`
              }} />
                  </div>
                </div> : stryMutAct_9fa48("34969") ? false : stryMutAct_9fa48("34968") ? true : (stryCov_9fa48("34968", "34969", "34970"), (stryMutAct_9fa48("34972") ? selectedCourse.status !== 'in-progress' : stryMutAct_9fa48("34971") ? true : (stryCov_9fa48("34971", "34972"), selectedCourse.status === 'in-progress')) && <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-neutral-400">Progress</span>
                    <span>{selectedCourse.completedModules}/{selectedCourse.modules} modules</span>
                  </div>
                  <div className="h-3 bg-neutral-700 rounded-full overflow-hidden">
                    <div className="h-full bg-primary-500 rounded-full" style={stryMutAct_9fa48("34974") ? {} : (stryCov_9fa48("34974"), {
                width: `${stryMutAct_9fa48("34976") ? selectedCourse.completedModules / selectedCourse.modules / 100 : (stryCov_9fa48("34976"), (stryMutAct_9fa48("34977") ? selectedCourse.completedModules * selectedCourse.modules : (stryCov_9fa48("34977"), selectedCourse.completedModules / selectedCourse.modules)) * 100)}%`
              })} />
                  </div>
                </div>)}

              {stryMutAct_9fa48("34980") ? selectedCourse.status === 'completed' || <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-400 font-medium">✓ Completed</p>
                      <p className="text-sm text-neutral-400">
                        {selectedCourse.completedDate && formatDate(selectedCourse.completedDate)}
                      </p>
                    </div>
                    {selectedCourse.score && <div className="text-right">
                        <p className="text-sm text-neutral-400">Final Score</p>
                        <p className="text-2xl font-bold text-green-400">{selectedCourse.score}%</p>
                      </div>}
                  </div>
                </div> : stryMutAct_9fa48("34979") ? false : stryMutAct_9fa48("34978") ? true : (stryCov_9fa48("34978", "34979", "34980"), (stryMutAct_9fa48("34982") ? selectedCourse.status !== 'completed' : stryMutAct_9fa48("34981") ? true : (stryCov_9fa48("34981", "34982"), selectedCourse.status === 'completed')) && <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-400 font-medium">✓ Completed</p>
                      <p className="text-sm text-neutral-400">
                        {stryMutAct_9fa48("34986") ? selectedCourse.completedDate || formatDate(selectedCourse.completedDate) : stryMutAct_9fa48("34985") ? false : stryMutAct_9fa48("34984") ? true : (stryCov_9fa48("34984", "34985", "34986"), selectedCourse.completedDate && formatDate(selectedCourse.completedDate))}
                      </p>
                    </div>
                    {stryMutAct_9fa48("34989") ? selectedCourse.score || <div className="text-right">
                        <p className="text-sm text-neutral-400">Final Score</p>
                        <p className="text-2xl font-bold text-green-400">{selectedCourse.score}%</p>
                      </div> : stryMutAct_9fa48("34988") ? false : stryMutAct_9fa48("34987") ? true : (stryCov_9fa48("34987", "34988", "34989"), selectedCourse.score && <div className="text-right">
                        <p className="text-sm text-neutral-400">Final Score</p>
                        <p className="text-2xl font-bold text-green-400">{selectedCourse.score}%</p>
                      </div>)}
                  </div>
                </div>)}

              {stryMutAct_9fa48("34992") ? selectedCourse.dueDate && selectedCourse.status !== 'completed' || <div className={`p-4 rounded-lg border ${selectedCourse.dueDate < new Date() ? 'bg-red-500/10 border-red-500/30' : 'bg-yellow-500/10 border-yellow-500/30'}`}>
                  <p className={selectedCourse.dueDate < new Date() ? 'text-red-400' : 'text-yellow-400'}>
                    ⚠️ Due: {formatDate(selectedCourse.dueDate)} ({getDaysUntil(selectedCourse.dueDate)})
                  </p>
                </div> : stryMutAct_9fa48("34991") ? false : stryMutAct_9fa48("34990") ? true : (stryCov_9fa48("34990", "34991", "34992"), (stryMutAct_9fa48("34994") ? selectedCourse.dueDate || selectedCourse.status !== 'completed' : stryMutAct_9fa48("34993") ? true : (stryCov_9fa48("34993", "34994"), selectedCourse.dueDate && (stryMutAct_9fa48("34996") ? selectedCourse.status === 'completed' : stryMutAct_9fa48("34995") ? true : (stryCov_9fa48("34995", "34996"), selectedCourse.status !== 'completed')))) && <div className={`p-4 rounded-lg border ${(stryMutAct_9fa48("35002") ? selectedCourse.dueDate >= new Date() : stryMutAct_9fa48("35001") ? selectedCourse.dueDate <= new Date() : stryMutAct_9fa48("35000") ? false : stryMutAct_9fa48("34999") ? true : (stryCov_9fa48("34999", "35000", "35001", "35002"), selectedCourse.dueDate < new Date())) ? 'bg-red-500/10 border-red-500/30' : 'bg-yellow-500/10 border-yellow-500/30'}`}>
                  <p className={(stryMutAct_9fa48("35008") ? selectedCourse.dueDate >= new Date() : stryMutAct_9fa48("35007") ? selectedCourse.dueDate <= new Date() : stryMutAct_9fa48("35006") ? false : stryMutAct_9fa48("35005") ? true : (stryCov_9fa48("35005", "35006", "35007", "35008"), selectedCourse.dueDate < new Date())) ? 'text-red-400' : 'text-yellow-400'}>
                    ⚠️ Due: {formatDate(selectedCourse.dueDate)} ({getDaysUntil(selectedCourse.dueDate)})
                  </p>
                </div>)}
            </div>
            <div className="p-6 border-t border-neutral-700 flex justify-end gap-3">
              {stryMutAct_9fa48("35013") ? selectedCourse.status === 'completed' || <button className="px-4 py-2 border border-neutral-600 text-neutral-300 rounded-lg hover:bg-neutral-700 transition-colors">
                  Download Certificate
                </button> : stryMutAct_9fa48("35012") ? false : stryMutAct_9fa48("35011") ? true : (stryCov_9fa48("35011", "35012", "35013"), (stryMutAct_9fa48("35015") ? selectedCourse.status !== 'completed' : stryMutAct_9fa48("35014") ? true : (stryCov_9fa48("35014", "35015"), selectedCourse.status === 'completed')) && <button className="px-4 py-2 border border-neutral-600 text-neutral-300 rounded-lg hover:bg-neutral-700 transition-colors">
                  Download Certificate
                </button>)}
              <button className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors">
                {(stryMutAct_9fa48("35019") ? selectedCourse.status !== 'not-started' : stryMutAct_9fa48("35018") ? false : stryMutAct_9fa48("35017") ? true : (stryCov_9fa48("35017", "35018", "35019"), selectedCourse.status === 'not-started')) ? 'Start Course' : (stryMutAct_9fa48("35024") ? selectedCourse.status !== 'in-progress' : stryMutAct_9fa48("35023") ? false : stryMutAct_9fa48("35022") ? true : (stryCov_9fa48("35022", "35023", "35024"), selectedCourse.status === 'in-progress')) ? 'Continue Learning' : 'Retake Course'}
              </button>
            </div>
          </div>
        </div>)}
    </div>;
};
export default TrainingPage;