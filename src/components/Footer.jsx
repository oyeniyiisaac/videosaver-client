import React from 'react';
import { ShieldCheck, HardDriveDownload } from 'lucide-react';

export default function Footer({ totalDownloads = 0 }) {
  return (
    <footer className="w-full mt-auto pt-12 pb-8 border-t border-gray-900 text-center text-xs text-gray-500">
      <div className="max-w-4xl mx-auto px-4 flex flex-col items-center gap-4">
        {/* Saved count badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface border border-gray-800 shadow-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <HardDriveDownload className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-gray-300 font-medium font-mono">
            {totalDownloads.toLocaleString()}
          </span>
          <span className="text-gray-400">videos saved</span>
        </div>

        {/* Legal notice */}
        <p className="flex items-center justify-center gap-1.5 text-gray-400 text-xs sm:text-sm">
          <ShieldCheck className="w-4 h-4 text-emerald-400/80 shrink-0" />
          <span>Only download content you own or have permission to save.</span>
        </p>

        <p className="text-[11px] text-gray-600">
          Video Saver &copy; {new Date().getFullYear()} &bull; Fast, private, open-source video & audio archiving.
        </p>
      </div>
    </footer>
  );
}
