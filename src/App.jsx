import React, { useState, useEffect } from 'react';
import { DownloadCloud, Sparkles } from 'lucide-react';
import UrlInput from './components/UrlInput.jsx';
import PreviewCard from './components/PreviewCard.jsx';
import FormatPicker from './components/FormatPicker.jsx';
import ErrorMessage from './components/ErrorMessage.jsx';
import PlatformChips from './components/PlatformChips.jsx';
import InstallPrompt from './components/InstallPrompt.jsx';
import Footer from './components/Footer.jsx';

const API_BASE = import.meta.env.VITE_API_URL || '';

export default function App() {
  const [url, setUrl] = useState('');
  const [isLoadingInfo, setIsLoadingInfo] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState('');
  const [downloadPercent, setDownloadPercent] = useState(null);
  const [error, setError] = useState('');
  const [mediaInfo, setMediaInfo] = useState(null);
  const [format, setFormat] = useState('video'); // 'video' | 'audio'
  const [quality, setQuality] = useState('best');
  const [stats, setStats] = useState({ totalDownloads: 0 });

  // Load download statistics on mount
  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/stats`);
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (e) {
      // ignore network errors for stats
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // Fetch video information
  const handleFetchInfo = async () => {
    if (!url.trim()) return;

    setError('');
    setIsLoadingInfo(true);
    setMediaInfo(null);

    try {
      const res = await fetch(`${API_BASE}/api/info`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to retrieve media information.');
      }

      setMediaInfo(data);
      // Default to best quality or first available height
      if (data.heights && data.heights.length > 0) {
        setQuality(data.heights[0].toString());
      } else {
        setQuality('best');
      }
    } catch (err) {
      console.error('Fetch info error:', err);
      setError(err.message || 'Could not fetch media info. Please verify the URL.');
    } finally {
      setIsLoadingInfo(false);
    }
  };

  // Download media
  const handleDownload = async () => {
    if (!url.trim() || isDownloading) return;

    setError('');
    setIsDownloading(true);
    setDownloadPercent(null);
    setDownloadStatus('Connecting to media source...');

    // Live preparation timer
    let seconds = 0;
    const prepTimer = setInterval(() => {
      seconds += 1;
      setDownloadStatus(`Processing on server (${seconds}s)...`);
    }, 1000);

    try {
      const params = new URLSearchParams({
        url: url.trim(),
        type: format,
        quality: quality || 'best'
      });

      const res = await fetch(`${API_BASE}/api/download?${params.toString()}`);

      clearInterval(prepTimer);

      const contentType = res.headers.get('content-type') || '';
      if (!res.ok || contentType.includes('application/json')) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Download failed with HTTP ${res.status}`);
      }

      // Stream the response with live progress tracking
      const reader = res.body.getReader();
      const contentLength = res.headers.get('content-length');
      const totalBytes = contentLength ? parseInt(contentLength, 10) : 0;
      let receivedBytes = 0;
      const chunks = [];

      setDownloadStatus('Starting stream to device...');

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        chunks.push(value);
        receivedBytes += value.length;

        if (totalBytes > 0) {
          const pct = Math.round((receivedBytes / totalBytes) * 100);
          setDownloadPercent(pct);
          const curMB = (receivedBytes / (1024 * 1024)).toFixed(1);
          const maxMB = (totalBytes / (1024 * 1024)).toFixed(1);
          setDownloadStatus(`Streaming: ${pct}% (${curMB} / ${maxMB} MB)`);
        } else {
          const curMB = (receivedBytes / (1024 * 1024)).toFixed(1);
          setDownloadStatus(`Streaming: ${curMB} MB received...`);
        }
      }

      setDownloadStatus('Saving file...');
      const blob = new Blob(chunks, { type: contentType || 'application/octet-stream' });

      // Extract filename from Content-Disposition header if available
      let filename = format === 'audio' ? 'audio.mp3' : 'video.mp4';
      const disposition = res.headers.get('content-disposition');
      if (disposition) {
        const matchUtf8 = disposition.match(/filename\*=UTF-8''([^;]+)/i);
        const matchStandard = disposition.match(/filename="?([^";]+)"?/i);
        if (matchUtf8 && matchUtf8[1]) {
          filename = decodeURIComponent(matchUtf8[1]);
        } else if (matchStandard && matchStandard[1]) {
          filename = matchStandard[1];
        }
      }

      // Trigger browser download via temporary anchor
      const blobUrl = window.URL.createObjectURL(blob);
      const tempAnchor = document.createElement('a');
      tempAnchor.style.display = 'none';
      tempAnchor.href = blobUrl;
      tempAnchor.download = filename;
      document.body.appendChild(tempAnchor);
      tempAnchor.click();

      setTimeout(() => {
        document.body.removeChild(tempAnchor);
        window.URL.revokeObjectURL(blobUrl);
      }, 500);

      // Refresh saved video counter
      fetchStats();
    } catch (err) {
      clearInterval(prepTimer);
      console.error('Download error:', err);
      setError(err.message || 'Failed to download the media file. Please try again.');
    } finally {
      clearInterval(prepTimer);
      setIsDownloading(false);
      setDownloadStatus('');
      setDownloadPercent(null);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0B0F17] text-gray-100 selection:bg-emerald-500/30 selection:text-emerald-300">
      {/* Background ambient gradient glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[50%] -translate-x-1/2 w-[600px] h-[350px] bg-emerald-500/10 blur-[130px] rounded-full" />
      </div>

      <main className="flex-1 flex flex-col items-center justify-center max-w-3xl w-full mx-auto px-4 py-12 sm:py-20 text-center">
        {/* PWA Install Banner */}
        <InstallPrompt />

        {/* Brand Header */}
        <div className="mb-8 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs font-medium tracking-wide uppercase shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Universal Media Downloader</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white font-display">
            Video <span className="text-emerald-400">Saver</span>
          </h1>

          <p className="text-gray-400 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
            Download high-quality videos and MP3 audio from any link in seconds. Fast, free, and unrestricted.
          </p>
        </div>

        {/* Center Input Form */}
        <div className="w-full">
          <UrlInput
            url={url}
            setUrl={setUrl}
            onSubmit={handleFetchInfo}
            isLoading={isLoadingInfo}
            disabled={isDownloading}
          />

          {/* Supported platform chips */}
          <PlatformChips />

          {/* Inline Error Message */}
          <ErrorMessage
            message={error}
            onDismiss={() => setError('')}
          />
        </div>

        {/* Media Preview Card */}
        {mediaInfo && (
          <div className="w-full animate-fadeIn">
            <PreviewCard info={mediaInfo} />

            {/* Format & Quality Picker */}
            <FormatPicker
              format={format}
              setFormat={setFormat}
              quality={quality}
              setQuality={setQuality}
              heights={mediaInfo.heights}
              durationSeconds={mediaInfo.durationSeconds || 0}
              onDownload={handleDownload}
              isDownloading={isDownloading}
              downloadStatus={downloadStatus}
              downloadPercent={downloadPercent}
            />
          </div>
        )}
      </main>

      {/* Global Footer */}
      <Footer totalDownloads={stats.totalDownloads || 0} />
    </div>
  );
}
