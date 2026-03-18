import { logger } from '../../../lib/logger';
/**
 * Page — A I Insurance Page
 *
 * React page component rendered by the router.
 *
 * @exports AIInsurancePage
 * @module pages/cortex/enterprise/AIInsurancePage
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * CendiaInsure™ Page
 * 
 * AI Insurance Integration
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, FileText, DollarSign, AlertTriangle, CheckCircle, Clock, Building2 } from 'lucide-react';
import { AIInsuranceService, InsurancePolicy, CoverageTypeInfo } from '@/services/AIInsuranceService';

const statusColors: Record<string, string> = {
  quoted: 'bg-gray-700 text-gray-300',
  bound: 'bg-blue-900/40 text-blue-300',
  active: 'bg-green-900/40 text-green-300',
  expired: 'bg-yellow-900/40 text-yellow-300',
  cancelled: 'bg-red-900/40 text-red-300',
  claimed: 'bg-purple-900/40 text-purple-300',
};

const riskTierColors: Record<string, string> = {
  low: 'bg-green-900/40 text-green-300',
  medium: 'bg-yellow-900/40 text-yellow-300',
  high: 'bg-orange-900/40 text-orange-300',
  critical: 'bg-red-900/40 text-red-300',
};

export default function AIInsurancePage() {
  const [coverageTypes, setCoverageTypes] = useState<CoverageTypeInfo[]>([]);
  const [policies, setPolicies] = useState<InsurancePolicy[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('policies');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const types = await AIInsuranceService.getCoverageTypes();
      setCoverageTypes(types);
    } catch (error) {
      logger.error('Failed to load data, using demo data:', error);
      setCoverageTypes([
        { type: 'errors_omissions' as any, name: 'AI Errors & Omissions', description: 'Coverage for AI system failures, incorrect outputs, and decision errors', basePremium: 25000 },
        { type: 'cyber_liability' as any, name: 'AI Cyber Liability', description: 'Coverage for AI-related data breaches, adversarial attacks, and model theft', basePremium: 35000 },
        { type: 'product_liability' as any, name: 'AI Product Liability', description: 'Coverage for harm caused by AI-powered products or services', basePremium: 45000 },
        { type: 'professional' as any, name: 'AI Professional Liability', description: 'Coverage for professional negligence in AI system design and deployment', basePremium: 30000 },
        { type: 'directors_officers' as any, name: 'AI D&O Insurance', description: 'Coverage for directors and officers for AI governance decisions', basePremium: 50000 },
      ]);
      setPolicies([
        { id: 'pol-1', policyNumber: 'CIN-2025-00142', coverageType: 'errors_omissions', status: 'active', riskTier: 'medium', coverageLimit: 5000000, deductible: 50000, premium: 42000, effectiveDate: '2025-01-15', expirationDate: '2026-01-15' } as any,
        { id: 'pol-2', policyNumber: 'CIN-2025-00289', coverageType: 'cyber_liability', status: 'active', riskTier: 'high', coverageLimit: 10000000, deductible: 100000, premium: 87500, effectiveDate: '2025-03-01', expirationDate: '2026-03-01' } as any,
        { id: 'pol-3', policyNumber: 'CIN-2025-00315', coverageType: 'directors_officers', status: 'bound', riskTier: 'low', coverageLimit: 25000000, deductible: 250000, premium: 125000, effectiveDate: '2025-06-01', expirationDate: '2026-06-01' } as any,
      ]);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6 min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="h-8 w-8 text-blue-400" />
          <div>
            <h1 className="text-2xl" style={{ fontFamily: 'Arial, Helvetica, sans-serif', fontWeight: 300, letterSpacing: '0.35em', color: '#e8e4e0' }}>
              CENDIAINSURE<span style={{ fontWeight: 200, fontSize: '0.7em', opacity: 0.5, marginLeft: '2px' }}>™</span>
            </h1>
            <p className="text-[11px] uppercase tracking-[0.25em] text-white/60 font-light">Direct liability coverage per AI decision</p>
          </div>
        </div>
        <Button>
          <FileText className="h-4 w-4 mr-2" />
          Request Quote
        </Button>
      </div>

      {/* Value Proposition */}
      <Card className="bg-gradient-to-r from-blue-900/30 to-indigo-900/30 border-blue-700">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-800/50 rounded-lg">
              <Shield className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-300">AI-Specific Liability Protection</h3>
              <p className="text-sm text-blue-400/80 mt-1">
                Protect your organization from AI-related losses with specialized coverage for errors & omissions, 
                cyber liability, and professional indemnity. Per-decision coverage with real-time risk scoring.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="policies">Active Policies</TabsTrigger>
          <TabsTrigger value="coverage">Coverage Types</TabsTrigger>
          <TabsTrigger value="claims">Claims</TabsTrigger>
        </TabsList>

        <TabsContent value="policies" className="space-y-4">
          {policies.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold">No Active Policies</h3>
                <p className="text-muted-foreground">Request a quote to get AI liability coverage for your organization.</p>
                <Button className="mt-4">
                  <FileText className="h-4 w-4 mr-2" />
                  Get Started
                </Button>
              </CardContent>
            </Card>
          ) : (
            policies.map((policy) => (
              <Card key={policy.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        Policy #{policy.policyNumber}
                        <Badge className={statusColors[policy.status]}>{policy.status}</Badge>
                      </CardTitle>
                      <CardDescription>
                        {policy.coverageType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </CardDescription>
                    </div>
                    <Badge className={riskTierColors[policy.riskTier]}>
                      {policy.riskTier.toUpperCase()} Risk
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Coverage Limit</p>
                      <p className="font-medium text-lg">{formatCurrency(policy.coverageLimit)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Deductible</p>
                      <p className="font-medium text-lg">{formatCurrency(policy.deductible)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Annual Premium</p>
                      <p className="font-medium text-lg">{formatCurrency(policy.premium)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Expires</p>
                      <p className="font-medium text-lg">{formatDate(policy.expirationDate)}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button variant="outline" size="sm">View Certificate</Button>
                    <Button variant="outline" size="sm">Coverage Details</Button>
                    <Button variant="outline" size="sm">File Claim</Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="coverage" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {coverageTypes.map((type) => (
              <Card key={type.type}>
                <CardHeader>
                  <CardTitle className="text-lg">{type.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{type.description}</p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-muted-foreground">Base Premium</span>
                    <span className="font-semibold">{formatCurrency(type.basePremium)}/year</span>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    Get Quote
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="claims">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Claims Management
              </CardTitle>
              <CardDescription>File and track insurance claims</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No claims filed.</p>
                <p className="text-sm mt-2">When incidents occur, you can file claims here for covered AI decisions.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
