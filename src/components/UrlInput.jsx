import React, { useRef } from 'react';
import { Link2, Loader2, ArrowRight, Clipboard } from 'lucide-react';

export default function UrlInput({ url, setUrl, onSubmit, isLoading, disabled }) {
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (url.trim() && !isLoading && !disabled) {
      onSubmit();
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrl(text.trim());
        inputRef.current?.focus();
      }
    } catch (err) {
      // Clipboard permissions denied, fallback to standard paste
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full relative">
      <div className="relative flex items-center w-full rounded-2xl bg-surface border border-gray-800 focus-within:border-emerald-500/80 focus-within:ring-2 focus-within:ring-emerald-500/20 shadow-2xl transition-all duration-300 p-2 glow-emerald">
        <div className="pl-3.5 pr-2 text-gray-400">
          <Link2 className="w-5 h-5 text-emerald-400/80" />
        </div>

        <input
          ref={inputRef}
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste video or audio link here (YouTube, TikTok, Instagram...)"
          disabled={isLoading || disabled}
          className="w-full bg-transparent text-gray-100 placeholder-gray-500 text-sm sm:text-base focus:outline-none py-2 px-1 disabled:opacity-60"
        />

        {!url && (
          <button
            type="button"
            onClick={handlePaste}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 mr-2 text-xs font-medium text-gray-400 hover:text-emerald-300 hover:bg-surface-elevated rounded-lg transition-colors border border-gray-800"
            title="Paste from clipboard"
          >
            <Clipboard className="w-3.5 h-3.5" />
            Paste
          </button>
        )}

        <button
          type="submit"
          disabled={!url.trim() || isLoading || disabled}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-black font-semibold text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-emerald-500/20 shrink-0 font-display"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Fetching...</span>
            </>
          ) : (
            <>
              <span>Fetch</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
