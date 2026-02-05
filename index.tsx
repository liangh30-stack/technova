import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { initSentry } from './services/sentry';
import { ErrorBoundary } from './components/ErrorBoundary';

// Initialize i18n before rendering
import './i18n';

// Initialize Sentry before rendering
initSentry();

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
