import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AlertCircle, CheckCircle2, KeyRound, MailCheck } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

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

    setMessage("Password changed successfully. You can now continue shopping.");
    window.setTimeout(() => navigate("/orders"), 1000);
  };

  const title = hasError
    ? "Email link expired"
    : mode === "reset-password"
      ? "Choose a New Password"
      : "Email Verified";

  const description = hasError
    ? "This link is invalid or has already expired. Please request a fresh link from the login page."
    : mode === "reset-password"
      ? "Enter a new password for your Inventive Queen account."
      : "Your email address has been verified. You can sign in and track your handmade orders.";

  const Icon = hasError ? AlertCircle : mode === "reset-password" ? KeyRound : MailCheck;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-secondary/20">
        <div className="container py-12 md:py-16">
          <div className="max-w-md mx-auto bg-card rounded-2xl shadow-luxury-sm border border-border/50 p-6 md:p-8 text-center">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-brand-blush/60 flex items-center justify-center">
              <Icon className="w-7 h-7 text-primary" />
            </div>
            <h1 className="mt-5 font-display text-2xl font-bold text-foreground">{title}</h1>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{description}</p>

            {hasError && (
              <p className="mt-4 text-xs text-muted-foreground bg-secondary/70 rounded-xl px-4 py-3">
                {authParams.errorDescription?.replace(/\+/g, " ") || authParams.errorCode || authParams.error}
              </p>
            )}

            {!hasError && mode === "reset-password" && (
              <form onSubmit={handlePasswordUpdate} className="mt-6 space-y-4 text-left">
                {!user && (
                  <p className="text-xs text-muted-foreground bg-secondary/70 rounded-xl px-4 py-3">
                    If this page just opened from your email, wait a second for the secure session to load before saving.
                  </p>
                )}
                <PasswordInput
                  label="New Password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
                <PasswordInput
                  label="Confirm Password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                />
                {message && (
                  <p className="text-sm text-muted-foreground bg-secondary/70 rounded-xl px-4 py-3">
                    {message}
                  </p>
                )}
                <Button disabled={loading} className="w-full rounded-xl h-11">
                  {loading ? "Saving..." : "Save New Password"}
                </Button>
              </form>
            )}

            {(hasError || mode === "verified") && (
              <div className="mt-6 grid gap-3">
                <Button asChild className="rounded-xl">
                  <Link to="/login">Go to Login</Link>
                </Button>
                <Button asChild variant="outline" className="rounded-xl">
                  <Link to="/">Back to Shop</Link>
                </Button>
              </div>
            )}

            {!hasError && mode === "verified" && (
              <div className="mt-4 inline-flex items-center gap-2 text-xs text-primary font-body font-semibold">
                <CheckCircle2 size={14} />
                Verified successfully
              </div>
            )}
          </div>
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
    <div className="space-y-2">
      <label className="font-body text-sm font-medium text-foreground">{label}</label>
      <input
        type="password"
        value={value}
        onChange={onChange}
        minLength={6}
        required
        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm font-body text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-all"
      />
    </div>
  );
}
