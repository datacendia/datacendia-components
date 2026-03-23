/**
 * Component — Cookie Consent Banner
 *
 * GDPR/ePrivacy compliant cookie consent banner. Persists user choice
 * to localStorage. Renders nothing after consent is given.
 *
 * @exports CookieConsent
 * @module components/common/CookieConsent
 */

// Copyright (c) 2024-2026 Datacendia, Inc. All Rights Reserved.
// See LICENSE file for details.

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, Cookie } from 'lucide-react';

const CONSENT_KEY = 'dc_cookie_consent';

type ConsentValue = 'all' | 'essential' | null;

export const CookieConsent: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (stored) return;
    // Small delay so it doesn't flash on page load
    const timer = setTimeout(() => setVisible(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleConsent = (value: ConsentValue) => {
    if (value) {
      localStorage.setItem(CONSENT_KEY, value);
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 pointer-events-none">
      <div className="max-w-2xl mx-auto pointer-events-auto">
        <div className="bg-gray-900 border border-gray-700 rounded-xl shadow-2xl p-5">
          <div className="flex items-start gap-3">
            <Cookie className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-300 leading-relaxed">
                We use essential cookies to keep the platform running and optional analytics
                cookies (self-hosted, no third-party tracking) to improve the experience.{' '}
                <Link to="/cookies" className="text-blue-400 hover:underline">
                  Learn more
                </Link>
              </p>

              <div className="flex flex-wrap items-center gap-3 mt-4">
                <button
                  onClick={() => handleConsent('all')}
                  className="px-4 py-2 bg-white text-gray-900 text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Accept All
                </button>
                <button
                  onClick={() => handleConsent('essential')}
                  className="px-4 py-2 bg-gray-800 text-gray-300 text-sm font-medium rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors"
                >
                  Essential Only
                </button>
              </div>
            </div>

            <button
              onClick={() => handleConsent('essential')}
              className="text-gray-500 hover:text-gray-300 transition-colors shrink-0"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
