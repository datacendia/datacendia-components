import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { initErrorTracking } from './lib/errorTracking'

// Initialize error tracking for production-grade error monitoring
initErrorTracking();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
