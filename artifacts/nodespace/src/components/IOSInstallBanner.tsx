import { useState, useEffect } from "react";
import { X } from "lucide-react";

function isIOSSafari(): boolean {
  const ua = navigator.userAgent;
  const isIOS =
    /iPad|iPhone|iPod/.test(ua) ||
    // iPadOS 13+ reports as MacIntel with multi-touch
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  // Must be Safari (not Chrome/Firefox on iOS, which can't install PWAs)
  const isSafari = /^((?!CriOS|FxiOS|OPiOS|mercury).)*Safari/.test(ua);
  return isIOS && isSafari;
}

function isStandalone(): boolean {
  return Boolean((navigator as Navigator & { standalone?: boolean }).standalone);
}

const STORAGE_KEY = "nodespace_ios_install_dismissed";

export function IOSInstallBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isStandalone()) return;
    if (!isIOSSafari()) return;
    if (localStorage.getItem(STORAGE_KEY)) return;
    const t = setTimeout(() => setVisible(true), 2500);
    return () => clearTimeout(t);
  }, []);

  const dismiss = () => {
    setVisible(false);
    localStorage.setItem(STORAGE_KEY, "1");
  };

  if (!visible) return null;

  return (
    <div
      className="fixed left-4 right-4 z-[100] animate-in slide-in-from-bottom-4 duration-300"
      style={{ bottom: "calc(1.5rem + env(safe-area-inset-bottom, 0px))" }}
    >
      <div className="bg-card border border-border rounded-2xl shadow-2xl p-4 flex items-start gap-3">
        <img
          src="/apple-touch-icon.png"
          alt="NodeSpace icon"
          className="w-12 h-12 rounded-2xl shrink-0 shadow"
        />

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground">Install NodeSpace</p>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            Tap the{" "}
            <span className="inline-block font-bold text-foreground px-1 py-0.5 rounded border border-border bg-secondary text-[11px]">
              ↑ Share
            </span>{" "}
            button in Safari, then choose{" "}
            <strong className="text-foreground">Add to Home Screen</strong>.
          </p>
        </div>

        <button
          onClick={dismiss}
          aria-label="Dismiss"
          className="p-1 text-muted-foreground hover:text-foreground rounded-full hover:bg-secondary shrink-0 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Arrow pointing down toward Safari's bottom toolbar */}
      <div className="flex justify-center mt-1" aria-hidden="true">
        <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[10px] border-t-card" />
      </div>
    </div>
  );
}
