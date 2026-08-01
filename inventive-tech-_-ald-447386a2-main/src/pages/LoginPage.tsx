import { useState } from "react";
import type { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { KeyRound, Lock, Mail, UserRound } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { getAuthRedirectUrl } from "@/lib/auth-redirect";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

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

      setMessage("Account created. Please check your email to confirm your login.");
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
      setMessage("Enter your email address first.");
      return;
    }

    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.resetPasswordForEmail(form.email.trim(), {
      redirectTo: getAuthRedirectUrl("/auth/reset-password"),
    });

    setLoading(false);
    setMessage(error ? error.message : "Password reset link sent. Please check your email.");
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 bg-secondary/20">
        <div className="container py-12 md:py-16">
          <div className="max-w-md mx-auto bg-card rounded-2xl shadow-luxury-sm border border-border/50 p-6 md:p-8">
            {user ? (
              <div className="text-center space-y-4">
                <div className="mx-auto w-14 h-14 rounded-2xl bg-brand-blush/60 flex items-center justify-center">
                  <UserRound className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h1 className="font-display text-2xl font-bold text-foreground">
                    You are signed in
                  </h1>
                  <p className="mt-2 text-sm text-muted-foreground">{user.email}</p>
                </div>
                <Button asChild className="w-full rounded-xl">
                  <Link to="/orders">View My Orders</Link>
                </Button>
                <Button variant="outline" onClick={handleSignOut} className="w-full rounded-xl">
                  Sign Out
                </Button>
              </div>
            ) : (
              <>
                <div className="text-center">
                  <div className="mx-auto w-14 h-14 rounded-2xl bg-brand-blush/60 flex items-center justify-center">
                    <Lock className="w-6 h-6 text-primary" />
                  </div>
                  <h1 className="mt-4 font-display text-2xl font-bold text-foreground">
                    {mode === "signin" ? "Sign In" : mode === "signup" ? "Create Account" : "Reset Password"}
                  </h1>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {mode === "forgot"
                      ? "Enter your email and we'll send a secure reset link."
                      : "Login to place orders and track handmade pieces."}
                  </p>
                </div>

                <div className="mt-6 grid grid-cols-2 rounded-xl bg-secondary p-1">
                  <button
                    type="button"
                    onClick={() => {
                      setMode("signin");
                      setMessage("");
                    }}
                    className={`py-2 rounded-lg text-sm font-body font-medium transition-all ${
                      mode === "signin" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
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
                    className={`py-2 rounded-lg text-sm font-body font-medium transition-all ${
                      mode === "signup" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
                    }`}
                  >
                    Sign Up
                  </button>
                </div>

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
                      <p className="text-sm text-muted-foreground bg-secondary/70 rounded-xl px-4 py-3">
                        {message}
                      </p>
                    )}

                    <Button disabled={loading} className="w-full rounded-xl h-11">
                      {loading ? "Sending..." : "Send Reset Link"}
                    </Button>
                    <button
                      type="button"
                      onClick={() => {
                        setMode("signin");
                        setMessage("");
                      }}
                      className="w-full text-sm font-body font-medium text-primary hover:text-primary/80"
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
                        placeholder="Your name"
                      />
                      <InputField
                        label="Phone"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="10-digit mobile number"
                        maxLength={10}
                      />
                    </>
                  )}
                  <InputField
                    label="Email"
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
                  />

                  {message && (
                    <p className="text-sm text-muted-foreground bg-secondary/70 rounded-xl px-4 py-3">
                      {message}
                    </p>
                  )}

                  <Button disabled={loading} className="w-full rounded-xl h-11">
                    {loading ? "Please wait..." : mode === "signin" ? "Sign In" : "Create Account"}
                  </Button>
                  {mode === "signin" && (
                    <button
                      type="button"
                      onClick={() => {
                        setMode("forgot");
                        setMessage("");
                      }}
                      className="w-full text-sm font-body font-medium text-primary hover:text-primary/80"
                    >
                      Forgot password?
                    </button>
                  )}
                </form>
                )}
              </>
            )}
          </div>
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
    <div className="space-y-2">
      <label className="font-body text-sm font-medium text-foreground">{label}</label>
      <div className="relative">
        {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{icon}</span>}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          maxLength={maxLength}
          minLength={minLength}
          required
          className={`w-full rounded-xl border border-border bg-background px-4 py-3 text-sm font-body text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-all ${
            icon ? "pl-9" : ""
          }`}
        />
      </div>
    </div>
  );
}

export default LoginPage;
