/**
 * Pillar Shared Components
 *
 * Shared UI components used across all pillar pages.
 *
 * @exports PillarHeader, MetricCard
 * @module pages/cortex/pillars/shared
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

import React from 'react';
import { cn } from '../../../../lib/utils';
import {
  TrendingUp,
  TrendingDown,
} from 'lucide-react';

// =============================================================================
// SHARED COMPONENTS
// =============================================================================

export const PillarHeader: React.FC<{
  icon: string;
  name: string;
  tagline: string;
  color: string;
}> = ({ icon, name, tagline, color }) => (
  <div className="mb-8">
    <div className="flex items-center gap-4 mb-4">
      <div
        className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl"
        style={{ backgroundColor: `${color}20` }}
      >
        {icon}
      </div>
      <div>
        <h1 className="text-2xl" style={{ fontFamily: 'Arial, Helvetica, sans-serif', fontWeight: 300, letterSpacing: '0.35em', color: '#e8e4e0' }}>{name.toUpperCase()}</h1>
        <p className="text-[11px] uppercase tracking-[0.25em] text-white/60 font-light">{tagline}</p>
      </div>
    </div>
  </div>
);

export const MetricCard: React.FC<{
  label: string;
  value: string | number;
  change?: number;
  trend?: 'up' | 'down' | 'stable';
  unit?: string;
}> = ({ label, value, change, trend, unit }) => (
  <div className="bg-white rounded-xl border border-neutral-200 p-4">
    <p className="text-sm text-neutral-500 mb-1">{label}</p>
    <div className="flex items-end gap-2">
      <span className="text-2xl font-bold text-neutral-900">
        {value}
        {unit && <span className="text-base font-normal text-neutral-500">{unit}</span>}
      </span>
      {change !== undefined && (
        <span
          className={cn(
            'text-sm font-medium',
            trend === 'up' && 'text-success-main',
            trend === 'down' && 'text-error-main',
            trend === 'stable' && 'text-neutral-500'
          )}
        >
          {trend === 'up' && '↑'}
          {trend === 'down' && '↓'}
          {Math.abs(change)}%
        </span>
      )}
    </div>
  </div>
);
