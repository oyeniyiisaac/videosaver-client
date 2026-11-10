import React from 'react';
import { Video, Music, Download, Loader2, Info } from 'lucide-react';

export default function FormatPicker({
  format,
  setFormat,
  quality,
  setQuality,
  heights = [],
  durationSeconds = 0,
  onDownload,
  isDownloading,
  downloadStatus,
  downloadPercent = null
}) {
  const isLongVideo = durationSeconds > 3600; // Longer than 1 hour

  return (
    <div className="w-full mt-6 p-5 rounded-2xl bg-surface/90 border border-gray-800 shadow-xl space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-gray-800/80">
        <span className="text-sm font-medium text-gray-300">Choose Format</span>
        <div className="flex bg-surface-elevated p-1 rounded-xl border border-gray-800">
          <button
            type="button"
            disabled={isDownloading}
            onClick={() => setFormat('video')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              format === 'video'
                ? 'bg-emerald-500 text-black shadow-md font-semibold'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Video className="w-4 h-4" />
            Video (MP4)
          </button>
          <button
            type="button"
            disabled={isDownloading}
            onClick={() => setFormat('audio')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              format === 'audio'
                ? 'bg-emerald-500 text-black shadow-md font-semibold'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Music className="w-4 h-4" />
            Audio (MP3)
          </button>
        </div>
      </div>

      {/* Long video guide tip */}
      {isLongVideo && (
        <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-200 flex items-start gap-2.5 text-left animate-fadeIn">
          <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-semibold text-emerald-300">
              Long Video ({Math.floor(durationSeconds / 3600)}h {Math.round((durationSeconds % 3600) / 60)}m):
            </span>{' '}
            {format === 'video'
              ? 'Full HD (1080p/720p) for 2-hour videos usually exceeds 2GB. Select 360p or 480p to fit under the 500MB web limit, or switch to Audio (MP3).'
              : 'Audio (MP3) for a 2-hour video is only ~115 MB and downloads quickly!'}
          </div>
        </div>
      )}

      {format === 'video' ? (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <label htmlFor="quality-select" className="text-xs sm:text-sm text-gray-400">
            Select Resolution:
          </label>
          <div className="w-full sm:w-auto relative">
            <select
              id="quality-select"
              value={quality}
              onChange={(e) => setQuality(e.target.value)}
              disabled={isDownloading}
              className="w-full sm:w-48 appearance-none bg-surface-elevated border border-gray-700/80 hover:border-emerald-500/50 text-gray-200 text-sm rounded-xl px-4 py-2.5 pr-8 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-colors cursor-pointer disabled:opacity-50"
            >
              <option value="best">Best Available (Auto)</option>
              {heights && heights.length > 0 ? (
                heights.map((h) => (
                  <option key={h} value={h}>
                    {h}p {h >= 1080 ? '(Full HD/4K)' : h >= 720 ? '(HD)' : '(SD)'}
                  </option>
                ))
              ) : (
                <>
                  <option value="1080">1080p (Full HD)</option>
                  <option value="720">720p (HD)</option>
                  <option value="480">480p</option>
                  <option value="360">360p</option>
                </>
              )}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-3 rounded-xl bg-surface-elevated/60 border border-gray-800/80 text-xs sm:text-sm text-gray-300 flex items-center justify-between">
          <span className="flex items-center gap-2 text-gray-300">
            <Music className="w-4 h-4 text-emerald-400" />
            Fast MP3 Audio Extraction (High Quality)
          </span>
          <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded">
            Audio Stream Only
          </span>
        </div>
      )}

      {/* Progress Bar (when downloading) */}
      {isDownloading && typeof downloadPercent === 'number' && downloadPercent >= 0 && (
        <div className="w-full space-y-1.5 pt-1">
          <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-emerald-500 h-2 rounded-full transition-all duration-200"
              style={{ width: `${Math.min(100, Math.max(5, downloadPercent))}%` }}
            />
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={onDownload}
        disabled={isDownloading}
        className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-black font-semibold text-base transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg hover:shadow-emerald-500/25 font-display mt-2"
      >
        {isDownloading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin text-black" />
            <span className="truncate">{downloadStatus || 'Preparing file...'}</span>
          </>
        ) : (
          <>
            <Download className="w-5 h-5" />
            <span>Download {format === 'audio' ? 'Audio (MP3)' : 'Video (MP4)'}</span>
          </>
        )}
      </button>
    </div>
  );
}
