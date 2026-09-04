import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AlertCircle, CheckCircle2, KeyRound, MailCheck, Sparkles, ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { FadeIn } from "@/components/motion/FadeIn";

function readAuthParams(search: string, hash: string) {
  const searchParams = new URLSearchParams(search);
  const hashParams = new URLSearchParams(hash.startsWith("#") ? hash.slice(1) : hash);
  return {
    error: hashParams.get("error") ?? searchParams.get("error"),
    errorCode: hashParams.get("error_code") ?? searchParams.get("error_code"),
    errorDescription: hashParams.get("error_description") ?? searchParams.get("error_description"),
  };
}

export default function AuthActionPage({ mode }: { mode: "verified" | "reset-password" }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const authParams = useMemo(() => readAuthParams(location.search, location.hash), [location.hash, location.search]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const hasError = Boolean(authParams.error || authParams.errorDescription);

  const handlePasswordUpdate = async (event: React.FormEvent) => {
    event.preventDefault();
    if (password.length < 6) {
      setMessage("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setLoading(true);
    setMessage("");
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("✨ Password updated successfully! Redirecting...");
    window.setTimeout(() => navigate("/orders"), 1200);
  };

  const title = hasError
    ? "Email link expired"
    : mode === "reset-password"
      ? "Choose New Password"
      : "Email Verified!";

  const description = hasError
    ? "This link is invalid or has already expired. Please request a fresh link from the login page."
    : mode === "reset-password"
      ? "Enter a fresh secure password for your Inventive Queen atelier account."
      : "Your email address has been verified. You can now access your account and track your handmade orders.";

  const Icon = hasError ? AlertCircle : mode === "reset-password" ? KeyRound : MailCheck;

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#461c48] font-sans selection:bg-purple-200 selection:text-purple-900">
      <SiteHeader />
      <main className="flex-1 py-28 md:py-36 flex items-center justify-center relative overflow-hidden">
        <div className="container max-w-md px-4 relative z-10">
          <FadeIn>
            <div className="glass-card rounded-3xl shadow-luxury-lg border border-border/60 p-6 sm:p-9 text-center backdrop-blur-xl">
              <div className={`mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${
                hasError ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"
              }`}>
                <Icon size={28} />
              </div>
              <h1 className="font-display text-2xl font-bold text-foreground">{title}</h1>
              <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">{description}</p>

              {hasError && (
                <p className="mt-4 text-xs text-muted-foreground bg-secondary/60 rounded-xl px-4 py-3">
                  {authParams.errorDescription?.replace(/\+/g, " ") || authParams.errorCode || authParams.error}
                </p>
              )}

              {!hasError && mode === "reset-password" && (
                <form onSubmit={handlePasswordUpdate} className="mt-6 space-y-4 text-left">
                  {!user && (
                    <p className="text-xs text-muted-foreground bg-secondary/60 rounded-xl px-4 py-3 text-center">
                      Waiting for secure session to initialize...
                    </p>
                  )}
                  <PasswordInput
                    label="New Password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                  <PasswordInput
                    label="Confirm New Password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                  />
                  {message && (
                    <p className="text-xs text-primary font-medium bg-primary/8 border border-primary/15 rounded-xl px-4 py-3">
                      {message}
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-2xl btn-gradient text-white text-xs font-bold shadow-royal-glow hover:shadow-luxury disabled:opacity-40 transition-all flex items-center justify-center gap-2"
                  >
                    <Sparkles size={14} className="text-amber-200" />
                    <span>{loading ? "Saving..." : "Save New Password"}</span>
                  </button>
                </form>
              )}

              {(hasError || mode === "verified") && (
                <div className="mt-6 flex flex-col gap-2.5">
                  <Link
                    to="/login"
                    className="w-full py-3 rounded-2xl btn-gradient text-white text-xs font-bold shadow-royal-glow hover:shadow-luxury transition-all flex items-center justify-center gap-2"
                  >
                    <span>Go to Sign In</span>
                    <ArrowRight size={14} />
                  </Link>
                  <Link
                    to="/"
                    className="w-full py-2.5 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Back to Atelier
                  </Link>
                </div>
              )}

              {!hasError && mode === "verified" && (
                <div className="mt-4 inline-flex items-center gap-1.5 text-xs text-emerald-600 font-semibold bg-emerald-500/10 px-3 py-1 rounded-full">
                  <CheckCircle2 size={13} />
                  Verified successfully
                </div>
              )}
            </div>
          </FadeIn>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function PasswordInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="space-y-1.5">
      <label className="font-body text-xs font-semibold text-foreground uppercase tracking-wider">{label}</label>
      <input
        type="password"
        value={value}
        onChange={onChange}
        minLength={6}
        required
        placeholder="At least 6 characters"
        className="w-full rounded-2xl border border-border/70 bg-card px-4 py-3 text-sm font-body text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
      />
    </div>
  );
}
