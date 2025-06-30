import React from 'react';
import * as Sentry from '@sentry/react';

// Test component to verify Sentry integration
// This should only be used in development
const ErrorTestButton: React.FC = () => {
  const throwError = () => {
    try {
      throw new Error('Test error for Sentry integration');
    } catch (error) {
      Sentry.captureException(error);
      alert('Error thrown and captured by Sentry!');
    }
  };

  const captureException = () => {
    try {
      throw new Error('Test captured exception');
    } catch (error) {
      Sentry.captureException(error);
      alert('Exception captured and sent to Sentry!');
    }
  };

  const captureMessage = () => {
    Sentry.captureMessage('Test message from REBORN app', 'info');
    alert('Message sent to Sentry!');
  };

  // Only render in development
  if (import.meta.env.MODE !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-red-100 border border-red-300 rounded-lg p-4 shadow-lg">
      <h3 className="text-sm font-medium text-red-800 mb-2">Sentry Test (Dev Only)</h3>
      <div className="space-y-2">
        <button
          onClick={throwError}
          className="w-full text-xs bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition-colors"
        >
          Throw Error
        </button>
        <button
          onClick={captureException}
          className="w-full text-xs bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded transition-colors"
        >
          Capture Exception
        </button>
        <button
          onClick={captureMessage}
          className="w-full text-xs bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded transition-colors"
        >
          Send Message
        </button>
      </div>
    </div>
  );
};

export default ErrorTestButton;