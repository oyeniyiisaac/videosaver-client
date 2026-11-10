import React from 'react';
import { AlertCircle, X } from 'lucide-react';

export default function ErrorMessage({ message, onDismiss }) {
  if (!message) return null;

  return (
    <div
      role="alert"
      className="w-full mt-4 p-3.5 rounded-xl bg-red-950/40 border border-red-500/30 text-red-200 flex items-start gap-3 shadow-lg animate-fadeIn text-sm backdrop-blur-sm"
    >
      <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
      <div className="flex-1 text-left leading-relaxed">
        {message}
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-red-400 hover:text-red-200 transition-colors p-0.5 rounded"
          aria-label="Dismiss error"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
