import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import './index.css'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import App from './App.jsx'

// Masque les logs en production (sauf errors)
if (import.meta.env.PROD) {
  const noop = () => {}
  console.log = noop
  console.info = noop
  console.debug = noop
  console.warn = noop
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </HelmetProvider>
  </StrictMode>,
)
