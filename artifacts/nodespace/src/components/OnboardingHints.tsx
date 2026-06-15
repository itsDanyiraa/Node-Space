import { useState, useEffect } from "react";
import { X } from "lucide-react";

export function OnboardingHints() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasSeen = localStorage.getItem("nodespace_onboarding");
    if (!hasSeen) {
      setIsVisible(true);
    }
  }, []);

  const dismiss = () => {
    setIsVisible(false);
    localStorage.setItem("nodespace_onboarding", "true");
  };

  useEffect(() => {
    if (!isVisible) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="absolute inset-0 z-50 pointer-events-none overflow-hidden">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />
      
      <div className="absolute inset-0 flex items-center justify-center pointer-events-auto" onClick={dismiss}>
        <div 
          className="bg-card border border-border shadow-2xl rounded-2xl p-6 max-w-md w-full animate-in fade-in zoom-in duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-foreground">Welcome to NodeSpace</h2>
            <button onClick={dismiss} className="p-2 -mr-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-secondary">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <ul className="space-y-4 text-sm text-muted-foreground">
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0 font-bold text-xs">1</div>
              <p>
                <strong className="text-foreground">Hold (long press)</strong> on the canvas to create a node on mobile.{" "}
                <strong className="text-foreground">Double-click</strong> on desktop. Or tap <strong className="text-foreground">+ Add Node</strong> in the toolbar.
              </p>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0 font-bold text-xs">2</div>
              <p><strong className="text-foreground">Drag from the circles</strong> on the sides of nodes to connect them together.</p>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0 font-bold text-xs">3</div>
              <p><strong className="text-foreground">Drag the background</strong> to pan. Pinch to zoom on mobile, scroll wheel on desktop.</p>
            </li>
          </ul>
          
          <button 
            onClick={dismiss}
            className="w-full mt-6 bg-primary text-primary-foreground font-semibold py-2.5 rounded-lg hover:brightness-110 transition-all active:scale-[0.98]"
          >
            Start Thinking
          </button>
        </div>
      </div>
    </div>
  );
}
