import React, { useState, useEffect } from 'react';
import { Download, Smartphone, X, CheckCircle2 } from 'lucide-react';

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [installedSuccess, setInstalledSuccess] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSHint, setShowIOSHint] = useState(false);

  useEffect(() => {
    // Check if app is already running in standalone PWA mode
    const checkStandalone = () => {
      const isStandaloneMode =
        window.matchMedia('(display-mode: standalone)').matches ||
        window.navigator.standalone === true;
      setIsStandalone(isStandaloneMode);
    };

    checkStandalone();

    // Detect iOS devices
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent) && !window.MSStream;
    setIsIOS(isIOSDevice);

    // Capture standard PWA install prompt
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    // Detect when installed successfully
    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setInstalledSuccess(true);
      setTimeout(() => setInstalledSuccess(false), 4000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } else if (isIOS) {
      setShowIOSHint(true);
    }
  };

  if (isStandalone || isDismissed) {
    return null;
  }

  // Success indicator
  if (installedSuccess) {
    return (
      <div className="w-full max-w-md mx-auto mb-6 p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 flex items-center justify-center gap-2 text-xs sm:text-sm shadow-lg animate-fadeIn">
        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
        <span>Video Saver is now installed on your device!</span>
      </div>
    );
  }

  // Show if browser fired beforeinstallprompt or on iOS browser
  const canInstall = Boolean(deferredPrompt) || (isIOS && !isStandalone);

  if (!canInstall) {
    return null;
  }

  return (
    <div className="w-full max-w-md mx-auto mb-6 px-4">
      <div className="p-3 sm:p-3.5 rounded-2xl bg-surface-elevated/90 border border-emerald-500/30 backdrop-blur-md shadow-2xl flex items-center justify-between gap-3 animate-fadeIn">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
            <Smartphone className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-left min-w-0">
            <p className="text-xs sm:text-sm font-semibold text-gray-100 font-display truncate">
              Install Video Saver App
            </p>
            <p className="text-[11px] text-gray-400 truncate">
              Instant access right from your home screen
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={handleInstallClick}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-black font-semibold text-xs transition-colors shadow-sm font-display"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Install</span>
          </button>
          <button
            type="button"
            onClick={() => setIsDismissed(true)}
            className="p-1.5 text-gray-400 hover:text-gray-200 rounded-lg hover:bg-surface transition-colors"
            aria-label="Dismiss banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {showIOSHint && (
        <div className="mt-2 p-3 rounded-xl bg-surface border border-gray-800 text-[11px] text-gray-300 text-left shadow-lg">
          To install on iOS: tap the <strong>Share</strong> icon (box with upward arrow) in Safari, then select <strong>'Add to Home Screen'</strong>.
        </div>
      )}
    </div>
  );
}
