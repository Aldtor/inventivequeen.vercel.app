import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Check,
  CheckCircle2,
  Cookie,
  Info,
  Lock,
  Save,
  Shield,
  Sliders,
  Sparkles,
} from "lucide-react";
import { PageHeader, SiteLayout } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/cookies")({
  component: CookiesPage,
  head: () => ({
    meta: [
      { title: "Cookie Policy & Preferences — Inventive Queen" },
      {
        name: "description",
        content:
          "Learn how Inventive Queen uses cookies for shopping basket persistence, secure payments, and royal preferences.",
      },
    ],
  }),
});

interface CookieSettings {
  essential: boolean;
  functional: boolean;
  analytics: boolean;
}

function CookiesPage() {
  const [settings, setSettings] = useState<CookieSettings>({
    essential: true,
    functional: true,
    analytics: true,
  });
  const [savedMessage, setSavedMessage] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("iq_cookie_consent");
      if (stored) {
        const parsed = JSON.parse(stored);
        setSettings({
          essential: true,
          functional: parsed.functional ?? true,
          analytics: parsed.analytics ?? true,
        });
      }
    } catch {
      // ignore
    }
  }, []);

  const handleSave = () => {
    try {
      localStorage.setItem(
        "iq_cookie_consent",
        JSON.stringify({
          ...settings,
          essential: true,
          timestamp: new Date().toISOString(),
        }),
      );
      setSavedMessage(true);
      setTimeout(() => setSavedMessage(false), 3000);
    } catch (err) {
      console.warn("Unable to save preferences to localStorage:", err);
    }
  };

  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Privacy & Trust"
        title="Cookie Policy"
        description="Transparent information on how cookies help deliver a secure, seamless handcrafted shopping experience."
      />

      <article className="mx-auto max-w-4xl px-4 py-16">
        {/* Interactive Preferences Panel */}
        <section className="liquid-glass relative overflow-hidden rounded-3xl p-6 sm:p-8 border border-white/60 shadow-xl mb-12">
          <div className="blob absolute -top-10 -right-10 size-40 bg-lilac/30 pointer-events-none" />

          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/60">
            <div className="flex items-center gap-3">
              <div className="clay-soft flex size-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-100 to-purple-100 text-amber-700 shadow-sm">
                <Sliders className="size-6" />
              </div>
              <div>
                <h2 className="font-display text-xl font-bold text-lilac-deep">
                  Interactive Cookie Preferences
                </h2>
                <p className="text-xs text-muted-foreground">
                  Personalize which cookie categories you permit during your visit
                </p>
              </div>
            </div>

            <button
              onClick={handleSave}
              className="clay-primary liquid-btn inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md hover:scale-102 transition-transform"
            >
              {savedMessage ? (
                <>
                  <CheckCircle2 className="size-4" /> Preferences Saved!
                </>
              ) : (
                <>
                  <Save className="size-4" /> Save Preferences
                </>
              )}
            </button>
          </div>

          <div className="mt-6 space-y-4">
            {/* Essential Cookies */}
            <div className="clay-soft rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1 max-w-xl">
                <div className="flex items-center gap-2">
                  <span className="font-display text-base font-bold text-lilac-deep">
                    1. Essential Royal Cookies
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                    <Lock className="size-2.5" /> Required
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Crucial for our website to operate safely. They preserve your shopping basket,
                  maintain encrypted login sessions via Supabase, and support secure checkout
                  through Razorpay.
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200 shrink-0">
                Always Active
              </span>
            </div>

            {/* Functional & Preference Cookies */}
            <div className="clay-soft rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1 max-w-xl">
                <div className="flex items-center gap-2">
                  <span className="font-display text-base font-bold text-lilac-deep">
                    2. Functional &amp; Preference Cookies
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Enables enhanced features such as remembering your delivery details for future
                  visits, saving notification dismissal states, and personalizing greeting messages.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSettings((prev) => ({ ...prev, functional: !prev.functional }))}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  settings.functional ? "bg-lilac-deep" : "bg-slate-300"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    settings.functional ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Analytics Cookies */}
            <div className="clay-soft rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1 max-w-xl">
                <div className="flex items-center gap-2">
                  <span className="font-display text-base font-bold text-lilac-deep">
                    3. Performance &amp; Analytics Cookies
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Helps us understand which crochet creations are most adored and identify any
                  slow-loading pages so we can make your browsing experience silk-smooth. Data is
                  anonymized.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSettings((prev) => ({ ...prev, analytics: !prev.analytics }))}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  settings.analytics ? "bg-lilac-deep" : "bg-slate-300"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    settings.analytics ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>
        </section>

        {/* Policy Document Sections */}
        <div className="space-y-6">
          <div className="liquid-glass p-6 sm:p-8 hover-lift">
            <h2 className="relative z-10 font-display text-2xl font-bold text-lilac-deep">
              What are Cookies?
            </h2>
            <p className="relative z-10 mt-3 text-sm text-muted-foreground leading-relaxed">
              Cookies are miniature text files placed on your browser or device when you visit
              Inventive Queen. They allow our website to remember your actions and preferences (such
              as shopping cart items, authentication states, and display settings) over a period of
              time, so you don’t have to re-enter them every time you return.
            </p>
          </div>

          <div className="liquid-glass p-6 sm:p-8 hover-lift">
            <h2 className="relative z-10 font-display text-2xl font-bold text-lilac-deep">
              How Inventive Queen Uses Cookies
            </h2>
            <div className="relative z-10 mt-3 space-y-3 text-sm text-muted-foreground leading-relaxed">
              <p>
                <strong>Basket &amp; Checkout Continuity:</strong> We store a lightweight item list
                in your local storage so that items you select in our Dolls, Characters, or Flowers
                galleries remain safely in your basket as you navigate.
              </p>
              <p>
                <strong>Secure Authentication:</strong> If you sign in to manage orders or track
                your crafting status, Supabase Auth utilizes secure session cookies to verify your
                identity without transmitting credentials repeatedly.
              </p>
              <p>
                <strong>Payment Verification:</strong> When checking out via Razorpay, necessary
                security tokens and anti-fraud cookies are verified to shield your bank account and
                card details.
              </p>
            </div>
          </div>

          <div className="liquid-glass p-6 sm:p-8 hover-lift">
            <h2 className="relative z-10 font-display text-2xl font-bold text-lilac-deep">
              How to Control Cookies Through Your Browser
            </h2>
            <p className="relative z-10 mt-3 text-sm text-muted-foreground leading-relaxed">
              In addition to the interactive preference toggle above, most web browsers allow you to
              control cookies through their system settings. You can choose to block or delete
              cookies in Chrome, Safari, Firefox, Edge, or mobile browsers. Please note that
              disabling essential cookies will prevent you from placing orders or signing into your
              account.
            </p>
          </div>

          <div className="liquid-glass p-6 sm:p-8 hover-lift">
            <h2 className="relative z-10 font-display text-2xl font-bold text-lilac-deep">
              Questions &amp; Contact
            </h2>
            <p className="relative z-10 mt-3 text-sm text-muted-foreground leading-relaxed">
              If you have any inquiries regarding our cookie practices or data privacy, please reach
              out to our royal support team via{" "}
              <Link
                to="/contact"
                className="font-semibold text-primary underline hover:text-lilac-deep transition-colors"
              >
                our contact page
              </Link>{" "}
              or email{" "}
              <a
                href="mailto:hello@inventivequeen.com"
                className="font-semibold text-primary underline hover:text-lilac-deep transition-colors"
              >
                hello@inventivequeen.com
              </a>
              .
            </p>
          </div>
        </div>
      </article>
    </SiteLayout>
  );
}
