import React from 'react';

const PLATFORMS = [
  'YouTube',
  'TikTok',
  'Instagram',
  'Facebook',
  'X/Twitter',
  'Twitch',
  'Kick',
  'Vimeo',
  'Reddit',
  'SoundCloud'
];

export default function PlatformChips() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mt-4 text-xs text-gray-400">
      <span className="text-gray-500 font-medium mr-1 hidden sm:inline">Supported:</span>
      {PLATFORMS.map((platform) => (
        <span
          key={platform}
          className="px-2.5 py-1 rounded-full bg-surface-elevated/70 border border-gray-800 text-gray-300 hover:text-emerald-400 hover:border-emerald-500/40 transition-colors duration-200 select-none shadow-sm text-[11px] sm:text-xs"
        >
          {platform}
        </span>
      ))}
    </div>
  );
}
