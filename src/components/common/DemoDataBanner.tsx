/**
 * Component — Demo Data Banner
 *
 * Amber banner shown on pages that display illustrative/demo data instead
 * of live backend data. Prevents buyers and pilot users from confusing
 * showcase screens with production dashboards.
 *
 * @exports DemoDataBanner
 * @module components/common/DemoDataBanner
 */

// Copyright (c) 2024-2026 Datacendia, Inc. All Rights Reserved.
// See LICENSE file for details.

import React from 'react';
import { AlertTriangle, Info } from 'lucide-react';

type BannerVariant = 'mock' | 'walkthrough';

interface DemoDataBannerProps {
  /**
   * `mock` (default) — amber/warning style: "data shown is illustrative".
   * `walkthrough` — blue/info style: "this page is a guided tour".
   */
  variant?: BannerVariant;
  /** Optional override for the headline text. */
  title?: string;
  /** Optional override for the supporting sentence. */
  message?: string;
  /** Optional CTA — e.g. "Connect a data source" link. */
  action?: React.ReactNode;
}

const VARIANTS: Record<BannerVariant, { bg: string; border: string; icon: React.ComponentType<{ className?: string }>; iconColor: string; title: string; message: string }> = {
  mock: {
    bg: 'bg-amber-50 dark:bg-amber-950/30',
    border: 'border-amber-300 dark:border-amber-800',
    icon: AlertTriangle,
    iconColor: 'text-amber-600 dark:text-amber-400',
    title: 'Illustrative data',
    message: 'Figures on this page are sample values for demonstration. Live numbers appear once the relevant data source is connected.',
  },
  walkthrough: {
    bg: 'bg-blue-50 dark:bg-blue-950/30',
    border: 'border-blue-300 dark:border-blue-800',
    icon: Info,
    iconColor: 'text-blue-600 dark:text-blue-400',
    title: 'Guided walkthrough',
    message: 'This page is a scripted tour of the feature. Inputs and outputs are pre-filled for illustration.',
  },
};

export const DemoDataBanner: React.FC<DemoDataBannerProps> = ({ variant = 'mock', title, message, action }) => {
  const v = VARIANTS[variant];
  const Icon = v.icon;

  return (
    <div
      role="status"
      className={`flex items-start gap-3 rounded-lg border ${v.border} ${v.bg} px-4 py-3 mb-4 text-sm`}
      data-testid={`demo-data-banner-${variant}`}
    >
      <Icon className={`h-5 w-5 flex-shrink-0 mt-0.5 ${v.iconColor}`} aria-hidden="true" />
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 dark:text-gray-100">{title ?? v.title}</p>
        <p className="text-gray-700 dark:text-gray-300 mt-0.5">{message ?? v.message}</p>
        {action ? <div className="mt-2">{action}</div> : null}
      </div>
    </div>
  );
};

export default DemoDataBanner;
