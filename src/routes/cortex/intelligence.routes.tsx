// =============================================================================
// CORTEX INTELLIGENCE ROUTES - Decision Intelligence Pages
// =============================================================================

import React, { lazy } from 'react';
import { RouteObject, Navigate } from 'react-router-dom';
import { SuspenseWrapper, RedirectToCouncilWithQuery } from '../utils';

const PreMortemPage = lazy(() =>
  import('../../pages/cortex/intelligence').then((m) => ({ default: m.PreMortemPage }))
);
const GhostBoardPage = lazy(() =>
  import('../../pages/cortex/intelligence').then((m) => ({ default: m.GhostBoardPage }))
);
const DecisionDebtPage = lazy(() =>
  import('../../pages/cortex/intelligence').then((m) => ({ default: m.DecisionDebtPage }))
);
const LiveDemoPage = lazy(() =>
  import('../../pages/cortex/intelligence').then((m) => ({ default: m.LiveDemoPage }))
);
const RegulatoryAbsorbPage = lazy(() =>
  import('../../pages/cortex/intelligence').then((m) => ({ default: m.RegulatoryAbsorbPage }))
);
const DecisionDNAPage = lazy(() =>
  import('../../pages/cortex/intelligence').then((m) => ({ default: m.DecisionDNAPage }))
);
const ChronosPage = lazy(() =>
  import('../../pages/cortex/intelligence').then((m) => ({ default: m.ChronosPage }))
);

const w = (Component: React.ComponentType) => (
  <SuspenseWrapper><Component /></SuspenseWrapper>
);

export const cortexIntelligenceRoutes: RouteObject[] = [
  { path: 'intelligence', element: <Navigate to="/cortex/intelligence/pre-mortem" replace /> },
  { path: 'intelligence/council', element: <RedirectToCouncilWithQuery /> },
  { path: 'intelligence/pre-mortem', element: w(PreMortemPage) },
  { path: 'intelligence/ghost-board', element: w(GhostBoardPage) },
  { path: 'intelligence/decision-debt', element: w(DecisionDebtPage) },
  { path: 'intelligence/live-demo', element: w(LiveDemoPage) },
  { path: 'intelligence/regulatory', element: w(RegulatoryAbsorbPage) },
  { path: 'intelligence/decision-dna', element: w(DecisionDNAPage) },
  { path: 'intelligence/chronos', element: w(ChronosPage) },
];
