import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, CheckCircle2, Crown, Mail, Send, Sparkles } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { SiteLayout } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/forgot-password")({
  component: ForgotPasswordPage,
  head: () => ({
    meta: [
      { title: "Reset Royal Password — Inventive Queen" },
      {
        name: "description",
        content: "Request a password reset link for your Inventive Queen royal account.",
      },
    ],
  }),
});

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      const redirectUrl =
        typeof window !== "undefined"
          ? `${window.location.origin}/reset-password`
          : "https://inventivequeen.com/reset-password";

      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: redirectUrl,
      });

      if (error) throw error;
      setSubmitted(true);
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Unable to send password reset email. Please verify your address and try again.";
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SiteLayout>
      <div className="mx-auto max-w-md px-4 py-16 sm:py-24">
        <div className="liquid-glass relative overflow-hidden rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/60">
          <div className="blob absolute -top-12 -right-12 size-40 bg-lilac/50 pointer-events-none" />
          <div className="blob absolute -bottom-12 -left-12 size-40 bg-primary/40 pointer-events-none" />

          {/* Header */}
          <div className="relative text-center">
            <div className="inline-flex size-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-200 to-amber-100 shadow-md mb-3">
              <Crown className="size-7 text-amber-700" />
            </div>
            <h1 className="sheen-text font-display text-2xl sm:text-3xl font-extrabold text-lilac-deep">
              Recover Royal Access
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Enter the email address registered with your Inventive Queen account, and we'll
              dispatch a secure recovery link.
            </p>
          </div>

          {/* Success State */}
          {submitted ? (
            <div className="relative mt-8 rounded-2xl bg-emerald-50/90 border border-emerald-200 p-6 text-center space-y-3">
              <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <CheckCircle2 className="size-7" />
              </div>
              <h2 className="font-display text-lg font-bold text-emerald-800">
                Recovery Dispatch Sent!
              </h2>
              <p className="text-xs text-emerald-700 leading-relaxed">
                We have transmitted password reset instructions to{" "}
                <span className="font-semibold text-emerald-900">{email}</span>. Please review your
                inbox (and spam folder) within the next few minutes.
              </p>
              <div className="pt-2">
                <Link
                  to="/login"
                  className="clay-primary liquid-btn inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-xs font-bold text-white shadow-md hover:scale-102 transition-transform"
                >
                  <ArrowLeft className="size-3.5" /> Return to Sign In
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleResetRequest} className="relative mt-8 space-y-4">
              {errorMessage && (
                <div className="rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700 leading-relaxed">
                  {errorMessage}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-foreground mb-1.5">
                  Account Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 size-4 text-muted-foreground" />
                  <input
                    type="email"
                    required
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-white/80 bg-white/70 pl-10 pr-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-lilac-deep focus:ring-2 focus:ring-lilac-deep/20 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="clay-primary liquid-btn mt-2 w-full rounded-xl py-3 text-sm font-bold text-white shadow-lg transition-all hover:scale-102 active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  "Sending Dispatch..."
                ) : (
                  <>
                    <Send className="size-4" /> Send Reset Link
                  </>
                )}
              </button>

              <div className="pt-4 border-t border-white/40 flex items-center justify-between text-xs">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-lilac-deep font-semibold transition-colors"
                >
                  <ArrowLeft className="size-3.5" /> Back to Sign In
                </Link>
                <Link
                  to="/contact"
                  className="text-muted-foreground hover:text-lilac-deep font-semibold transition-colors"
                >
                  Need Support?
                </Link>
              </div>
            </form>
          )}

          <div className="relative mt-6 text-center">
            <span className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <Sparkles className="size-3 text-amber-500" /> Crown security protected by encrypted
              authentication
            </span>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
