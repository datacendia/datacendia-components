// =============================================================================
// DATACENDIA - APPLICATION ROOT
// =============================================================================

import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { ToastProvider } from '../components/feedback';
import { I18nProvider } from './lib/i18n';
import { AuthProvider } from './contexts/AuthContext';
import { router } from './routes';
import ErrorBoundary from './components/ErrorBoundary';

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <I18nProvider>
        <AuthProvider>
          <ToastProvider>
            <RouterProvider router={router} />
          </ToastProvider>
        </AuthProvider>
      </I18nProvider>
    </ErrorBoundary>
  );
};

export default App;
