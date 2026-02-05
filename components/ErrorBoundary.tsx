import React from 'react';
import * as Sentry from '@sentry/react';
import { AlertTriangle, RefreshCw, MessageSquare } from 'lucide-react';
import { showReportDialog } from '@/services/sentry';

interface FallbackProps {
  error: Error;
  resetError: () => void;
}

const ErrorFallback: React.FC<FallbackProps> = ({ error, resetError }) => {
  const handleReport = () => {
    showReportDialog({
      title: 'Report an Issue',
      subtitle: 'Help us fix this problem by describing what happened.',
      subtitle2: 'Your feedback is valuable to us.',
    });
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-800 rounded-xl shadow-2xl p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-red-500/20 rounded-full">
            <AlertTriangle className="w-12 h-12 text-red-400" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-white mb-2">
          Something went wrong
        </h1>

        <p className="text-slate-400 mb-6">
          We apologize for the inconvenience. An unexpected error has occurred.
        </p>

        {import.meta.env.DEV && (
          <div className="mb-6 p-4 bg-slate-900 rounded-lg text-left">
            <p className="text-xs font-mono text-red-400 break-all">
              {error.message}
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={resetError}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-medium rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>

          <button
            onClick={handleReport}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            Report Issue
          </button>
        </div>
      </div>
    </div>
  );
};

export const ErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Sentry.ErrorBoundary
      fallback={({ error, resetError }) => (
        <ErrorFallback error={error} resetError={resetError} />
      )}
      onError={(error, componentStack) => {
        console.error('ErrorBoundary caught an error:', error, componentStack);
      }}
    >
      {children}
    </Sentry.ErrorBoundary>
  );
};

export default ErrorBoundary;
