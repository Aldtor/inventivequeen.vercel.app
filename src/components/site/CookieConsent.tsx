import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { Cookie, ShieldCheck, Sparkles, X } from "lucide-react";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Check if consent has already been given
    try {
      const consent = localStorage.getItem("iq_cookie_consent");
      if (!consent) {
        // Small delay for smooth entry
        const timer = setTimeout(() => setVisible(true), 1500);
        return () => clearTimeout(timer);
      }
    } catch {
      // In case localStorage is blocked
    }
    return undefined;
  }, []);

  const handleAcceptAll = () => {
    try {
      localStorage.setItem(
        "iq_cookie_consent",
        JSON.stringify({
          essential: true,
          functional: true,
          analytics: true,
          timestamp: new Date().toISOString(),
        }),
      );
    } catch (e) {
      console.warn("Could not save cookie preference:", e);
    }
    setVisible(false);
  };

  const handleEssentialOnly = () => {
    try {
      localStorage.setItem(
        "iq_cookie_consent",
        JSON.stringify({
          essential: true,
          functional: false,
          analytics: false,
          timestamp: new Date().toISOString(),
        }),
      );
    } catch (e) {
      console.warn("Could not save cookie preference:", e);
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <aside
      aria-label="Cookie consent banner"
      className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-xl transition-all duration-500 animate-in fade-in slide-in-from-bottom-5"
    >
      <div className="liquid-glass relative overflow-hidden rounded-3xl p-5 sm:p-6 shadow-2xl border border-white/70 backdrop-blur-xl bg-white/85">
        <div className="blob absolute -top-10 -right-10 size-32 bg-lilac/30 pointer-events-none" />
        <div className="blob absolute -bottom-10 -left-10 size-32 bg-primary/20 pointer-events-none" />

        <div className="relative flex items-start gap-3.5">
          <div className="clay-soft flex size-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-100 to-purple-100 text-lilac-deep shadow-sm">
            <Cookie className="size-5 text-amber-700" />
          </div>

          <div className="flex-1 pr-6">
            <div className="flex items-center gap-2">
              <h3 className="font-display text-sm sm:text-base font-bold text-lilac-deep">
                Handcrafted with Cookies 🍪
              </h3>
              <span className="inline-flex items-center gap-1 rounded-full bg-lilac/20 px-2 py-0.5 text-[10px] font-bold text-lilac-deep">
                <Sparkles className="size-2.5" /> Privacy
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
              We use essential cookies to keep your shopping basket cozy, ensure secure payments,
              and remember your royal preferences. You can manage or read our full{" "}
              <Link
                to="/cookies"
                className="font-semibold text-lilac-deep underline hover:text-primary transition-colors"
                onClick={() => setVisible(false)}
              >
                Cookie Policy
              </Link>
              .
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={handleAcceptAll}
                className="clay-primary liquid-btn rounded-full px-4 py-2 text-xs font-bold text-white shadow-md hover:scale-102 transition-transform"
              >
                Accept All
              </button>
              <button
                type="button"
                onClick={handleEssentialOnly}
                className="clay rounded-full px-4 py-2 text-xs font-bold text-lilac-deep hover:bg-white/50 transition-colors"
              >
                Essential Only
              </button>
              <Link
                to="/cookies"
                onClick={() => setVisible(false)}
                className="rounded-full px-3 py-2 text-xs font-semibold text-muted-foreground hover:text-lilac-deep transition-colors"
              >
                Preferences
              </Link>
            </div>
          </div>

          <button
            type="button"
            onClick={handleEssentialOnly}
            className="absolute top-0 right-0 p-2 text-muted-foreground hover:text-lilac-deep transition-colors"
            aria-label="Dismiss cookie notice"
          >
            <X className="size-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
