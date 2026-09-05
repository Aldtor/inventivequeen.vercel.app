import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Crown,
  Eye,
  EyeOff,
  KeyRound,
  Lock,
  ShieldAlert,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { SiteLayout } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/reset-password")({
  component: ResetPasswordPage,
  head: () => ({
    meta: [
      { title: "Update Password — Inventive Queen" },
      {
        name: "description",
        content: "Set a new secure password for your Inventive Queen account.",
      },
    ],
  }),
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isRecoveryFlow, setIsRecoveryFlow] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Check if recovery event or recovery session is active
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setIsRecoveryFlow(true);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setIsRecoveryFlow(true);
      }
    });

    // Check hash for recovery tokens if redirected by Supabase
    if (typeof window !== "undefined" && window.location.hash.includes("type=recovery")) {
      setIsRecoveryFlow(true);
    }

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Simple password strength calculation
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: "Empty", color: "bg-slate-200" };
    if (pass.length < 6) return { score: 1, label: "Too Short", color: "bg-rose-400" };
    let score = 1;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score++;
    if (/\d/.test(pass) || /[^A-Za-z0-9]/.test(pass)) score++;

    if (score === 2) return { score: 2, label: "Fair", color: "bg-amber-400" };
    if (score === 3) return { score: 3, label: "Good", color: "bg-blue-400" };
    return { score: 4, label: "Royal & Strong", color: "bg-emerald-500" };
  };

  const strength = getPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match. Please ensure both fields are identical.");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) throw error;
      setSuccess(true);
    } catch (err: any) {
      setErrorMessage(
        err.message ||
          "Failed to update password. Your reset link may have expired. Please request a fresh one."
      );
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

          {/* Crown Header */}
          <div className="relative text-center">
            <div className="inline-flex size-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-200 to-amber-100 shadow-md mb-3">
              <KeyRound className="size-7 text-amber-700" />
            </div>
            <h1 className="sheen-text font-display text-2xl sm:text-3xl font-extrabold text-lilac-deep">
              Create New Password
            </h1>
            <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground">
              Safeguard your royal atelier account with a fresh, secure key.
            </p>
          </div>

          {/* Success State */}
          {success ? (
            <div className="relative mt-8 rounded-2xl bg-emerald-50/90 border border-emerald-200 p-6 text-center space-y-3">
              <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <CheckCircle2 className="size-7" />
              </div>
              <h2 className="font-display text-lg font-bold text-emerald-800">
                Password Successfully Updated!
              </h2>
              <p className="text-xs text-emerald-700 leading-relaxed">
                Your new credentials are saved. You can now use your new password to sign into your
                account.
              </p>
              <div className="pt-2">
                <Link
                  to="/login"
                  className="clay-primary liquid-btn inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-xs font-bold text-white shadow-md hover:scale-102 transition-transform"
                >
                  Proceed to Sign In <ArrowRight className="size-3.5" />
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="relative mt-8 space-y-4">
              {errorMessage && (
                <div className="rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700 flex items-start gap-2">
                  <ShieldAlert className="size-4 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* New Password */}
              <div>
                <label className="block text-xs font-bold text-foreground mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 size-4 text-muted-foreground" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    placeholder="Enter at least 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-white/80 bg-white/70 pl-10 pr-10 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-lilac-deep focus:ring-2 focus:ring-lilac-deep/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-lilac-deep"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>

                {/* Password strength bar */}
                {password && (
                  <div className="mt-2 space-y-1">
                    <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-slate-200/80">
                      <div
                        className={`h-full transition-all duration-300 ${strength.color}`}
                        style={{ width: `${(strength.score / 4) * 100}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[11px] text-muted-foreground">
                      <span>Strength:</span>
                      <span className="font-semibold text-lilac-deep">{strength.label}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-bold text-foreground mb-1.5">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 size-4 text-muted-foreground" />
                  <input
                    type={showConfirm ? "text" : "password"}
                    required
                    minLength={6}
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full rounded-xl border border-white/80 bg-white/70 pl-10 pr-10 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-lilac-deep focus:ring-2 focus:ring-lilac-deep/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-lilac-deep"
                    aria-label={showConfirm ? "Hide password" : "Show password"}
                  >
                    {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="clay-primary liquid-btn mt-2 w-full rounded-xl py-3 text-sm font-bold text-white shadow-lg transition-all hover:scale-102 active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? "Updating Credentials..." : "Confirm & Set New Password"}
              </button>

              <div className="pt-3 text-center">
                <Link
                  to="/login"
                  className="text-xs text-muted-foreground hover:text-lilac-deep font-semibold transition-colors"
                >
                  Remembered your password? Sign in instead
                </Link>
              </div>
            </form>
          )}

          <div className="relative mt-6 text-center">
            <span className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <Sparkles className="size-3 text-amber-500" /> Crown security protected by Supabase Auth
            </span>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
