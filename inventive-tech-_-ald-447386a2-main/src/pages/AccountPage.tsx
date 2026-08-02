import { useState } from "react";
import { Link } from "react-router-dom";
import { KeyRound, Mail, Phone, ShoppingBag, UserRound, type LucideIcon } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { getAuthRedirectUrl } from "@/lib/auth-redirect";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

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
    setMessage(error ? error.message : "Password reset link sent to your email.");
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
    setMessage("Password changed successfully.");
  };

  const email = user?.email ?? profile?.email ?? "";

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        <section className="bg-secondary/30 border-b border-border/40">
          <div className="container py-12 md:py-16 text-center">
            <p className="text-xs uppercase tracking-[0.25em] text-primary font-body font-semibold">
              Your Inventive Queen Profile
            </p>
            <h1 className="mt-3 font-display text-3xl md:text-5xl font-bold text-foreground">
              My Account
            </h1>
            <p className="mt-4 text-muted-foreground max-w-lg mx-auto leading-relaxed">
              View your account details and manage your password.
            </p>
          </div>
        </section>

        <div className="container py-10 md:py-14 max-w-4xl">
          {!isSupabaseConfigured ? (
            <EmptyState
              title="Supabase is not configured"
              description="Add your Supabase publishable key to enable account login."
              actionLabel="Back to Shop"
              actionTo="/"
            />
          ) : loading ? (
            <div className="py-16 flex justify-center">
              <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            </div>
          ) : !user ? (
            <EmptyState
              title="Sign in to view your account"
              description="Log in to see your account details and password settings."
              actionLabel="Sign In"
              actionTo="/login?redirect=/account"
            />
          ) : (
            <section className="bg-card rounded-2xl shadow-luxury-sm border border-border/40 p-5 md:p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-brand-blush/60 flex items-center justify-center flex-shrink-0">
                  <UserRound className="w-6 h-6 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="font-display text-xl font-bold text-foreground">Account Details</p>
                  <p className="mt-1 text-sm text-muted-foreground">Signed in as {email}</p>
                </div>
              </div>

              <div className="mt-5 grid sm:grid-cols-3 gap-3">
                <AccountFact label="Email" value={email} icon={Mail} />
                <AccountFact label="Name" value={profile?.full_name || "Not added"} icon={UserRound} />
                <AccountFact label="Phone" value={profile?.phone || "Not added"} icon={Phone} />
              </div>

              <form onSubmit={handleChangePassword} className="mt-6 rounded-2xl bg-secondary/40 p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-primary" />
                  <p className="font-body text-sm font-semibold text-foreground">Change Password</p>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="New password"
                    minLength={6}
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm font-body text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    placeholder="Confirm new password"
                    minLength={6}
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm font-body text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                {message && (
                  <p className="text-sm text-muted-foreground bg-background rounded-xl px-4 py-3">
                    {message}
                  </p>
                )}
                <div className="grid sm:grid-cols-2 gap-3">
                  <Button disabled={saving} className="rounded-xl">
                    {saving ? "Please wait..." : "Save Password"}
                  </Button>
                  <Button type="button" variant="outline" disabled={saving} onClick={handleSendResetLink} className="rounded-xl">
                    Get Reset Link
                  </Button>
                </div>
              </form>
            </section>
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
    <div className="rounded-xl bg-secondary/40 px-4 py-3">
      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.12em] text-muted-foreground font-body font-semibold">
        <Icon size={13} className="text-primary" />
        {label}
      </div>
      <p className="mt-1 text-sm text-foreground font-body break-words">{value}</p>
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
    <div className="max-w-md mx-auto text-center py-14">
      <div className="mx-auto w-16 h-16 rounded-2xl bg-brand-blush/60 flex items-center justify-center">
        <ShoppingBag className="w-7 h-7 text-primary" />
      </div>
      <h2 className="mt-5 font-display text-2xl font-bold text-foreground">{title}</h2>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      <Button asChild className="mt-6 rounded-xl">
        <Link to={actionTo}>{actionLabel}</Link>
      </Button>
    </div>
  );
}

export default AccountPage;