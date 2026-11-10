import React from 'react';
import { User, Clock, CheckCircle2 } from 'lucide-react';

export default function PreviewCard({ info }) {
  if (!info) return null;

  const { title, thumbnail, duration, uploader, platform } = info;

  return (
    <div className="w-full mt-6 rounded-2xl bg-surface border border-gray-800 p-4 sm:p-5 shadow-xl overflow-hidden backdrop-blur-md">
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 items-start">
        {/* Thumbnail with duration overlay */}
        <div className="relative w-full sm:w-56 h-40 sm:h-32 rounded-xl overflow-hidden bg-surface-elevated shrink-0 border border-gray-800">
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={title || 'Media thumbnail'}
              className="w-full h-full object-cover"
              loading="lazy"
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">
              No Thumbnail
            </div>
          )}
          {duration && (
            <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-sm text-[11px] font-mono font-medium text-white flex items-center gap-1 border border-white/10">
              <Clock className="w-3 h-3 text-emerald-400" />
              <span>{duration}</span>
            </div>
          )}
        </div>

        {/* Video metadata */}
        <div className="flex-1 min-w-0 space-y-2 text-left">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold tracking-wide uppercase bg-emerald-950/70 text-emerald-400 border border-emerald-500/30">
              {platform || 'Ready'}
            </span>
            <span className="flex items-center gap-1 text-[11px] text-gray-400">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Verified
            </span>
          </div>

          <h3 className="text-base sm:text-lg font-semibold text-gray-100 line-clamp-2 leading-snug font-display">
            {title}
          </h3>

          <div className="flex items-center gap-2 text-xs text-gray-400 pt-1">
            <User className="w-3.5 h-3.5 text-gray-500" />
            <span className="truncate max-w-[240px] font-medium text-gray-300">
              {uploader || 'Unknown creator'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
