import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Crown,
  Heart,
  Lock,
  Mail,
  Phone,
  Sparkles,
  User as UserIcon,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import { SiteLayout } from "@/components/site/SiteLayout";
import {
  getSafeRedirectUrl,
  sanitizeText,
  validatePasswordStrength,
  validatePhone,
} from "@/lib/security";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  validateSearch: (search: Record<string, unknown>): { redirect?: string; verified?: string } => {
    const rawRedirect = search["redirect"];
    const verified = search["verified"];
    return {
      ...(typeof rawRedirect === "string" ? { redirect: rawRedirect } : {}),
      ...(typeof verified === "string" ? { verified } : {}),
    };
  },
  head: () => ({
    meta: [
      { title: "Royal Account — Inventive Queen" },
      {
        name: "description",
        content: "Sign in or create your Inventive Queen account to place and track orders.",
      },
    ],
  }),
});

function LoginPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/login" });
  const redirectPath = getSafeRedirectUrl(search.redirect, "/checkout");
  const { user } = useAuth();

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // If already logged in, redirect
  if (user) {
    navigate({ href: redirectPath });
  }

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (search.verified === "true") {
      setSuccessMsg("Email successfully verified! You can now sign in to your royal account.");
    }

    const hash = window.location.hash || "";
    if (hash) {
      const hashParams = new URLSearchParams(hash.replace(/^#/, ""));
      const errorDesc = hashParams.get("error_description");
      if (errorDesc) {
        setErrorMsg(decodeURIComponent(errorDesc.replace(/\+/g, " ")));
      }
    }
  }, [search.verified]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;

        navigate({ href: redirectPath });
      } else {
        const cleanName = sanitizeText(fullName, 100);
        const cleanPhone = phone.replace(/[^\d]/g, "");

        if (!cleanName) {
          throw new Error("Please enter your full name.");
        }
        if (!validatePhone(cleanPhone)) {
          throw new Error("Please enter a valid 10-digit mobile number.");
        }

        const passwordCheck = validatePasswordStrength(password);
        if (!passwordCheck.isValid) {
          throw new Error(passwordCheck.message || "Password does not meet security requirements.");
        }

        const origin =
          typeof window !== "undefined" && window.location.origin
            ? window.location.origin
            : "https://inventivequeen.vercel.app";

        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              full_name: cleanName,
              phone: cleanPhone,
            },
            emailRedirectTo: `${origin}/login?verified=true`,
          },
        });
        if (error) throw error;

        // Upsert profile in Supabase profiles table if user is created
        if (data.user) {
          await supabase.from("profiles").upsert({
            id: data.user.id,
            email: email.trim(),
            full_name: cleanName,
            phone: cleanPhone,
          });
        }

        if (data.session) {
          navigate({ href: redirectPath });
        } else {
          setSuccessMsg("Royal account created! Please check your email to verify or sign in.");
          setMode("signin");
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to authenticate. Please try again.";
      setErrorMsg(msg);
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
              <Crown className="size-7 text-amber-700" />
            </div>
            <h1 className="sheen-text font-display text-2xl sm:text-3xl font-extrabold text-lilac-deep">
              {mode === "signin" ? "Royal Welcome Back" : "Create Royal Account"}
            </h1>
            <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground">
              {mode === "signin"
                ? "Sign in to track orders, manage deliveries & checkout"
                : "Join the Inventive Queen realm to begin custom ordering"}
            </p>
          </div>

          {/* Mode Tabs */}
          <div className="relative mt-6 flex rounded-full bg-white/50 p-1 border border-white/60 shadow-inner">
            <button
              type="button"
              onClick={() => {
                setMode("signin");
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`flex-1 rounded-full py-2 text-xs sm:text-sm font-bold transition-all ${
                mode === "signin"
                  ? "bg-white text-lilac-deep shadow-sm"
                  : "text-muted-foreground hover:text-lilac-deep"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("signup");
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`flex-1 rounded-full py-2 text-xs sm:text-sm font-bold transition-all ${
                mode === "signup"
                  ? "bg-white text-lilac-deep shadow-sm"
                  : "text-muted-foreground hover:text-lilac-deep"
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Alerts */}
          {errorMsg && (
            <div className="relative mt-4 rounded-xl bg-rose-50 border border-rose-200 p-3.5 text-xs text-rose-700 flex items-start gap-2.5">
              <AlertCircle className="size-4 shrink-0 mt-0.5 text-rose-600" />
              <span className="leading-relaxed">{errorMsg}</span>
            </div>
          )}
          {successMsg && (
            <div className="relative mt-4 rounded-xl bg-emerald-50 border border-emerald-200 p-3.5 text-xs text-emerald-800 flex items-start gap-2.5">
              <CheckCircle2 className="size-4 shrink-0 mt-0.5 text-emerald-600" />
              <span className="leading-relaxed font-medium">{successMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="relative mt-6 space-y-3.5">
            {mode === "signup" && (
              <>
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">
                    Your Full Name
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute left-3.5 top-3 size-4 text-muted-foreground" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Queen Alishba"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full rounded-xl border border-white/80 bg-white/70 pl-10 pr-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-lilac-deep focus:ring-2 focus:ring-lilac-deep/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">
                    Mobile Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-3 size-4 text-muted-foreground" />
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      placeholder="10-digit mobile number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/[^\d]/g, ""))}
                      className="w-full rounded-xl border border-white/80 bg-white/70 pl-10 pr-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-lilac-deep focus:ring-2 focus:ring-lilac-deep/20"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-bold text-foreground mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 size-4 text-muted-foreground" />
                <input
                  type="email"
                  required
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-white/80 bg-white/70 pl-10 pr-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-lilac-deep focus:ring-2 focus:ring-lilac-deep/20"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-foreground">Password</label>
                {mode === "signin" && (
                  <Link
                    to="/forgot-password"
                    className="text-xs font-semibold text-lilac-deep hover:underline transition-all"
                  >
                    Forgot password?
                  </Link>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 size-4 text-muted-foreground" />
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-white/80 bg-white/70 pl-10 pr-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-lilac-deep focus:ring-2 focus:ring-lilac-deep/20"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="clay-primary liquid-btn mt-6 w-full rounded-xl py-3 text-sm font-bold text-white shadow-lg transition-all hover:scale-102 active:scale-98 disabled:opacity-50"
            >
              {loading
                ? "Processing..."
                : mode === "signin"
                  ? "Sign In to Royal Account"
                  : "Create Royal Account"}
            </button>
          </form>

          {/* Notice */}
          <p className="relative mt-6 text-center text-xs text-muted-foreground flex items-center justify-center gap-1.5">
            <Crown className="size-3.5 text-amber-600 inline shrink-0" />
            <span>
              Safe &amp; verified checkout. Your custom crochet is hand-stitched with care.
            </span>
          </p>
        </div>
      </div>
    </SiteLayout>
  );
}
