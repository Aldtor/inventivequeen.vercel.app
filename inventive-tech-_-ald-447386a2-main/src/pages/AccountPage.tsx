import { useState } from "react";
import { Link } from "react-router-dom";
import { KeyRound, Mail, Phone, ShoppingBag, UserRound, Sparkles, type LucideIcon } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import { useAuth } from "@/lib/auth";
import { getAuthRedirectUrl } from "@/lib/auth-redirect";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import { FadeIn } from "@/components/motion/FadeIn";

const AccountPage = () => {
  const { user, profile, loading } = useAuth();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSendResetLink = async () => {
    if (!user?.email) return;
    setSaving(true);
    setMessage("");
    const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
      redirectTo: getAuthRedirectUrl("/auth/reset-password"),
    });
    setSaving(false);
    setMessage(error ? error.message : "✨ Password reset link sent to your email!");
  };

  const handleChangePassword = async (event: React.FormEvent) => {
    event.preventDefault();
    if (password.length < 6) {
      setMessage("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setSaving(true);
    setMessage("");
    const { error } = await supabase.auth.updateUser({ password });
    setSaving(false);
    if (error) {
      setMessage(error.message);
      return;
    }
    setPassword("");
    setConfirmPassword("");
    setMessage("✨ Password changed successfully.");
  };

  const email = user?.email ?? profile?.email ?? "";

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#461c48] font-sans selection:bg-purple-200 selection:text-purple-900">
      <SiteHeader />

      <main className="flex-1 pt-28 sm:pt-36">
        <section className="bg-fairytale-mesh border-b border-border/40 py-12 md:py-16 text-center relative overflow-hidden">
          <div className="container relative z-10">
            <FadeIn>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card shadow-luxury-sm text-primary text-xs uppercase tracking-[0.22em] font-semibold mb-3">
                <span>👑</span> Royal Member Profile
              </div>
              <h1 className="font-display text-3xl md:text-5xl font-extrabold text-foreground tracking-tight">
                My Account
              </h1>
              <p className="mt-3 text-muted-foreground max-w-lg mx-auto text-sm md:text-base leading-relaxed">
                Manage your atelier profile, contact details, and secure credentials.
              </p>
            </FadeIn>
          </div>
        </section>

        <div className="container py-10 md:py-14 max-w-3xl">
          {!isSupabaseConfigured ? (
            <EmptyState
              title="Supabase is not configured"
              description="Add your Supabase publishable key to enable account login."
              actionLabel="Back to Shop"
              actionTo="/"
            />
          ) : loading ? (
            <div className="py-20 flex justify-center">
              <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            </div>
          ) : !user ? (
            <EmptyState
              title="Sign in to view your account"
              description="Log in to view your profile, past commissions, and password settings."
              actionLabel="Sign In to Atelier"
              actionTo="/login?redirect=/account"
            />
          ) : (
            <FadeIn>
              <section className="glass-card rounded-3xl shadow-luxury-lg border border-border/60 p-6 md:p-8 space-y-6">
                <div className="flex items-start gap-4 pb-5 border-b border-border/40">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
                    <UserRound size={28} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-display text-xl font-bold text-foreground">Royal Member</p>
                    <p className="mt-0.5 text-xs text-muted-foreground font-body break-all">{email}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <Link
                        to="/orders"
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20 transition-colors"
                      >
                        <ShoppingBag size={12} />
                        View Orders
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-3">
                  <AccountFact label="Email" value={email} icon={Mail} />
                  <AccountFact label="Full Name" value={profile?.full_name || "Not specified"} icon={UserRound} />
                  <AccountFact label="Phone" value={profile?.phone || "Not specified"} icon={Phone} />
                </div>

                <form onSubmit={handleChangePassword} className="rounded-2xl glass-panel p-5 space-y-4 border border-border/50">
                  <div className="flex items-center gap-2">
                    <KeyRound className="w-4 h-4 text-primary" />
                    <p className="font-body text-xs uppercase tracking-wider font-bold text-foreground">Update Password</p>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <input
                      type="password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="New password (min 6 chars)"
                      minLength={6}
                      className="w-full rounded-2xl border border-border/60 bg-card px-4 py-3 text-sm font-body text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(event) => setConfirmPassword(event.target.value)}
                      placeholder="Confirm new password"
                      minLength={6}
                      className="w-full rounded-2xl border border-border/60 bg-card px-4 py-3 text-sm font-body text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  {message && (
                    <p className="text-xs text-primary font-medium bg-primary/8 border border-primary/15 rounded-xl px-4 py-3">
                      {message}
                    </p>
                  )}
                  <div className="flex flex-col sm:flex-row gap-3 pt-1">
                    <button
                      type="submit"
                      disabled={saving}
                      className="flex-1 py-3 px-5 rounded-2xl btn-gradient text-white text-xs font-bold shadow-royal-glow hover:shadow-luxury disabled:opacity-40 transition-all flex items-center justify-center gap-2"
                    >
                      <Sparkles size={14} className="text-amber-200" />
                      <span>{saving ? "Updating..." : "Save Password"}</span>
                    </button>
                    <button
                      type="button"
                      disabled={saving}
                      onClick={handleSendResetLink}
                      className="py-3 px-5 rounded-2xl border border-border/60 hover:bg-secondary/60 text-xs font-semibold text-foreground transition-colors"
                    >
                      Send Password Reset Link
                    </button>
                  </div>
                </form>
              </section>
            </FadeIn>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

function AccountFact({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
}) {
  return (
    <div className="rounded-2xl glass-panel p-4 border border-border/40">
      <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.12em] text-muted-foreground font-body font-semibold">
        <Icon size={13} className="text-primary" />
        {label}
      </div>
      <p className="mt-1.5 text-xs sm:text-sm text-foreground font-semibold font-body break-words">{value}</p>
    </div>
  );
}

function EmptyState({
  title,
  description,
  actionLabel,
  actionTo,
}: {
  title: string;
  description: string;
  actionLabel: string;
  actionTo: string;
}) {
  return (
    <div className="max-w-md mx-auto text-center py-16 px-6 glass-card rounded-3xl shadow-luxury border border-border/50">
      <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4">
        <ShoppingBag size={28} />
      </div>
      <h2 className="font-display text-2xl font-bold text-foreground">{title}</h2>
      <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">{description}</p>
      <div className="mt-6">
        <Link
          to={actionTo}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full btn-gradient text-white text-xs font-bold shadow-royal-glow"
        >
          <span>{actionLabel}</span>
        </Link>
      </div>
    </div>
  );
}

export default AccountPage;