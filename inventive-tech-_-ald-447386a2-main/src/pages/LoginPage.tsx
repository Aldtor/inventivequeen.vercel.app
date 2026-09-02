import { useState } from "react";
import type { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { KeyRound, Lock, Mail, UserRound, Sparkles, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/lib/auth";
import { getAuthRedirectUrl } from "@/lib/auth-redirect";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import logo from "@/assets/logo.png";
import { FadeIn } from "@/components/motion/FadeIn";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, refreshUserData } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup" | "forgot">("signin");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const redirectTo = new URLSearchParams(location.search).get("redirect") ?? "/orders";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const saveProfile = async (userId: string, email: string | null) => {
    await supabase.from("profiles").upsert({
      id: userId,
      email,
      full_name: form.name.trim() || null,
      phone: form.phone.trim() || null,
    });
    await refreshUserData();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSupabaseConfigured) {
      setMessage("Supabase key is missing. Add VITE_SUPABASE_PUBLISHABLE_KEY to your environment.");
      return;
    }

    setLoading(true);
    setMessage("");

    if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({
        email: form.email.trim(),
        password: form.password,
        options: {
          data: {
            full_name: form.name.trim(),
            phone: form.phone.trim(),
          },
          emailRedirectTo: getAuthRedirectUrl("/auth/verified"),
        },
      });

      if (error) {
        setMessage(error.message);
        setLoading(false);
        return;
      }

      if (data.user && data.session) {
        await saveProfile(data.user.id, data.user.email ?? form.email.trim());
        navigate(redirectTo);
        return;
      }

      setMessage("✨ Account created! Please check your inbox to confirm your royal login.");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: form.email.trim(),
      password: form.password,
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      await saveProfile(data.user.id, data.user.email ?? form.email.trim());
    }

    navigate(redirectTo);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSupabaseConfigured) {
      setMessage("Supabase key is missing. Add VITE_SUPABASE_PUBLISHABLE_KEY to your environment.");
      return;
    }
    if (!form.email.trim()) {
      setMessage("Please enter your email address first.");
      return;
    }

    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.resetPasswordForEmail(form.email.trim(), {
      redirectTo: getAuthRedirectUrl("/auth/reset-password"),
    });

    setLoading(false);
    setMessage(error ? error.message : "✨ Password reset link sent! Check your inbox.");
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary/15 selection:text-primary">
      <Navbar />

      <main className="flex-1 bg-fairytale-mesh py-12 md:py-20 flex items-center justify-center relative overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="container max-w-md px-4 relative z-10">
          <FadeIn>
            <div className="glass-card rounded-3xl shadow-luxury-lg border border-border/60 p-6 sm:p-9 backdrop-blur-xl">
              {user ? (
                <div className="text-center space-y-5">
                  <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 text-primary">
                    <UserRound size={28} />
                  </div>
                  <div>
                    <h1 className="font-display text-2xl font-bold text-foreground">
                      Welcome Back!
                    </h1>
                    <p className="mt-1 text-xs sm:text-sm text-muted-foreground">{user.email}</p>
                  </div>
                  <div className="space-y-2.5 pt-2">
                    <Link
                      to="/orders"
                      className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-2xl btn-gradient text-white text-sm font-bold shadow-royal-glow hover:shadow-luxury transition-all"
                    >
                      <Sparkles size={15} className="text-amber-200" />
                      View My Royal Orders 👑
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="w-full py-2.5 rounded-xl border border-border/60 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="text-center">
                    <div className="relative mx-auto w-18 h-18 w-20 h-20 rounded-full p-1.5 bg-gradient-to-tr from-primary via-pink-400 to-amber-300 shadow-royal flex items-center justify-center mb-4 animate-glow-pulse">
                      <img src={logo} alt="Inventive Queen" className="w-full h-full rounded-full object-cover" />
                      <span className="absolute -bottom-1 -right-1 text-base select-none">👑</span>
                    </div>
                    <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                      {mode === "signin" ? "Royal Atelier Sign In" : mode === "signup" ? "Join the Royal Club" : "Reset Password"}
                    </h1>
                    <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                      {mode === "forgot"
                        ? "Enter your email and we'll send a secure reset link."
                        : "Track bespoke creations, view order status & exclusive drops."}
                    </p>
                  </div>

                  {mode !== "forgot" && (
                    <div className="mt-6 grid grid-cols-2 rounded-2xl bg-secondary/70 p-1 border border-border/40">
                      <button
                        type="button"
                        onClick={() => {
                          setMode("signin");
                          setMessage("");
                        }}
                        className={`py-2 rounded-xl text-xs font-bold transition-all ${
                          mode === "signin" ? "bg-card text-foreground shadow-sm shadow-black/5" : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        Sign In
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setMode("signup");
                          setMessage("");
                        }}
                        className={`py-2 rounded-xl text-xs font-bold transition-all ${
                          mode === "signup" ? "bg-card text-foreground shadow-sm shadow-black/5" : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        Create Account
                      </button>
                    </div>
                  )}

                  {mode === "forgot" ? (
                    <form onSubmit={handleResetPassword} className="mt-6 space-y-4">
                      <InputField
                        label="Email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        icon={<Mail size={15} />}
                      />

                      {message && (
                        <p className="text-xs text-primary font-medium bg-primary/8 border border-primary/15 rounded-xl px-4 py-3">
                          {message}
                        </p>
                      )}

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 rounded-2xl btn-gradient text-white text-xs font-bold shadow-royal-glow hover:shadow-luxury active:scale-95 disabled:opacity-40 transition-all flex items-center justify-center gap-2"
                      >
                        <Sparkles size={14} className="text-amber-200" />
                        <span>{loading ? "Sending link..." : "Send Reset Link"}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setMode("signin");
                          setMessage("");
                        }}
                        className="w-full text-xs font-semibold text-primary hover:underline"
                      >
                        Back to sign in
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                      {mode === "signup" && (
                        <>
                          <InputField
                            label="Full Name"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Your full name"
                          />
                          <InputField
                            label="Phone Number"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            placeholder="10-digit mobile number"
                            maxLength={10}
                          />
                        </>
                      )}
                      <InputField
                        label="Email Address"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        icon={<Mail size={15} />}
                      />
                      <InputField
                        label="Password"
                        name="password"
                        type="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="At least 6 characters"
                        minLength={6}
                        icon={<Lock size={15} />}
                      />

                      {message && (
                        <p className="text-xs text-primary font-medium bg-primary/8 border border-primary/15 rounded-xl px-4 py-3">
                          {message}
                        </p>
                      )}

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 rounded-2xl btn-gradient text-white text-xs font-bold shadow-royal-glow hover:shadow-luxury active:scale-95 disabled:opacity-40 transition-all flex items-center justify-center gap-2"
                      >
                        <Sparkles size={14} className="text-amber-200" />
                        <span>{loading ? "Processing..." : mode === "signin" ? "Sign In to Atelier" : "Create Royal Account ✨"}</span>
                      </button>

                      {mode === "signin" && (
                        <div className="text-center pt-1">
                          <button
                            type="button"
                            onClick={() => {
                              setMode("forgot");
                              setMessage("");
                            }}
                            className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
                          >
                            Forgot your password?
                          </button>
                        </div>
                      )}
                    </form>
                  )}
                </>
              )}
            </div>
          </FadeIn>
        </div>
      </main>

      <Footer />
    </div>
  );
};

function InputField({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  maxLength,
  minLength,
  icon,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  type?: string;
  maxLength?: number;
  minLength?: number;
  icon?: ReactNode;
}) {
  return (
    <div className="space-y-1.5 text-left">
      <label className="font-body text-xs font-semibold text-foreground uppercase tracking-wider">{label}</label>
      <div className="relative">
        {icon && <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">{icon}</span>}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          maxLength={maxLength}
          minLength={minLength}
          required
          className={`w-full rounded-2xl border border-border/70 bg-card px-4 py-3 text-sm font-body text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all ${
            icon ? "pl-10" : ""
          }`}
        />
      </div>
    </div>
  );
}

export default LoginPage;
