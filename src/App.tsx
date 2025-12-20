// =============================================================================
// DATACENDIA - APPLICATION ROOT
// =============================================================================

import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { ToastProvider } from '../components/feedback';
import { I18nProvider } from './lib/i18n';
import { AuthProvider } from './contexts/AuthContext';
import { VerticalConfigProvider } from './contexts/VerticalConfigContext';
// Use lazy-loaded routes for better performance (code splitting)
import { router } from './routes.lazy';
import ErrorBoundary from './components/ErrorBoundary';
import { TechTeamPanel } from './components/dev/TechTeamPanel';

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <I18nProvider>
        <AuthProvider>
          <VerticalConfigProvider>
            <ToastProvider>
              <RouterProvider router={router} />
              {/* AI Tech Team - Auto-Heal Panel */}
              <TechTeamPanel />
            </ToastProvider>
          </VerticalConfigProvider>
        </AuthProvider>
      </I18nProvider>
    </ErrorBoundary>
  );
};

export default App;
