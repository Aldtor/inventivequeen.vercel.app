import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Crown,
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  ShoppingBag,
  LogOut,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  KeyRound,
  ShieldCheck,
  Calendar,
  Save,
  Loader2,
  ExternalLink,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import { SiteLayout } from "@/components/site/SiteLayout";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { sanitizeText, validatePasswordStrength, validatePhone } from "@/lib/security";

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
  head: () => ({
    meta: [
      { title: "Royal Profile & Account — Inventive Queen" },
      {
        name: "description",
        content: "Manage your royal atelier account credentials, contact information, and security preferences.",
      },
    ],
  }),
});

function ProfilePage() {
  const navigate = useNavigate();
  const { user, profile, isAdmin, loading: authLoading, refreshUserData, signOut } = useAuth();

  const [activeTab, setActiveTab] = useState<"profile" | "security" | "activity">("profile");

  // Profile fields
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  // Password fields
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [sendingResetEmail, setSendingResetEmail] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);

  // Status feedback
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    if (user) {
      setFullName(profile?.full_name || (user.user_metadata?.full_name as string) || "");
      setPhone(profile?.phone || (user.user_metadata?.phone as string) || "");
    }
  }, [user, profile]);

  if (authLoading) {
    return (
      <SiteLayout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
          <div className="size-12 rounded-2xl bg-lilac-deep/10 text-lilac-deep flex items-center justify-center mb-3 animate-spin text-xl">
            👑
          </div>
          <p className="text-sm font-bold text-slate-600">Loading Royal Profile...</p>
        </div>
      </SiteLayout>
    );
  }

  if (!user) {
    return (
      <SiteLayout>
        <div className="min-h-[70vh] flex items-center justify-center p-4">
          <div className="max-w-md w-full rounded-3xl border border-lilac-deep/20 bg-white p-8 text-center shadow-xl">
            <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-lilac-deep/10 text-2xl text-lilac-deep">
              👑
            </div>
            <h2 className="font-display text-2xl font-black text-slate-800">Royal Account Access</h2>
            <p className="mt-2 text-sm text-slate-500 leading-relaxed">
              Please authenticate with your royal atelier credentials to view and manage your profile.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <Link
                to="/login"
                search={{ redirect: "/profile" }}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-lilac-deep py-3 text-sm font-bold text-white shadow-md hover:bg-lilac-deep/90 transition-all"
              >
                <User className="size-4" />
                Sign In to My Account
              </Link>
              <Link
                to="/"
                className="text-xs text-slate-500 hover:text-lilac-deep transition-colors py-1"
              >
                ← Return to Atelier Storefront
              </Link>
            </div>
          </div>
        </div>
      </SiteLayout>
    );
  }

  const userEmail = user.email || "patron@inventivequeen.com";
  const userInitials = (fullName || userEmail.split("@")[0] || "IQ").slice(0, 2).toUpperCase();

  const joinedDate = user.created_at
    ? new Date(user.created_at).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "September 2026";

  const isEmailVerified = Boolean(
    user.email_confirmed_at || user.confirmed_at || (user.identities && user.identities.length > 0)
  );

  // 1. Save Profile Details
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    const cleanName = sanitizeText(fullName, 100);
    const cleanPhone = phone.replace(/[^\d]/g, "");

    if (!cleanName) {
      setFeedback({ type: "error", message: "Please enter your full name." });
      return;
    }

    if (cleanPhone && !validatePhone(cleanPhone)) {
      setFeedback({
        type: "error",
        message: "Please enter a valid 10-digit mobile number.",
      });
      return;
    }

    setSavingProfile(true);

    try {
      const { error: profileError } = await supabase.from("profiles").upsert({
        id: user.id,
        email: userEmail,
        full_name: cleanName,
        phone: cleanPhone || null,
        updated_at: new Date().toISOString(),
      });

      if (profileError) throw profileError;

      await supabase.auth.updateUser({
        data: {
          full_name: cleanName,
          phone: cleanPhone || null,
        },
      });

      await refreshUserData();

      setFeedback({
        type: "success",
        message: "Royal profile details saved successfully!",
      });
      toast.success("Profile updated successfully!");
    } catch (err: any) {
      console.error("Profile save error:", err);
      setFeedback({
        type: "error",
        message: err.message || "Failed to update profile. Please try again.",
      });
      toast.error("Could not update profile details.");
    } finally {
      setSavingProfile(false);
    }
  };

  // 2. Direct Password Update
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (newPassword !== confirmPassword) {
      setFeedback({ type: "error", message: "Passwords do not match." });
      return;
    }

    const strength = validatePasswordStrength(newPassword);
    if (!strength.isValid) {
      setFeedback({
        type: "error",
        message: strength.message || "Password does not meet minimum safety requirements.",
      });
      return;
    }

    setSavingPassword(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      setNewPassword("");
      setConfirmPassword("");
      setFeedback({
        type: "success",
        message: "Your royal account password has been updated successfully!",
      });
      toast.success("Password updated successfully!");
    } catch (err: any) {
      console.error("Password update error:", err);
      setFeedback({
        type: "error",
        message: err.message || "Could not update password. Please try again.",
      });
      toast.error("Failed to update password.");
    } finally {
      setSavingPassword(false);
    }
  };

  // 3. Send Password Reset Email Link
  const handleSendResetEmail = async () => {
    setSendingResetEmail(true);
    setFeedback(null);

    try {
      const origin = typeof window !== "undefined" ? window.location.origin : "https://inventivequeen.com";
      const { error } = await supabase.auth.resetPasswordForEmail(userEmail, {
        redirectTo: `${origin}/reset-password`,
      });

      if (error) throw error;

      setResetEmailSent(true);
      setFeedback({
        type: "success",
        message: `A secure password recovery link has been dispatched to ${userEmail}. Please check your inbox.`,
      });
      toast.success("Password reset link sent to your email!");
    } catch (err: any) {
      console.error("Reset email error:", err);
      setFeedback({
        type: "error",
        message: err.message || "Unable to send reset email at this moment.",
      });
      toast.error("Could not send password reset link.");
    } finally {
      setSendingResetEmail(false);
    }
  };

  // 4. Sign Out
  const handleSignOut = async () => {
    try {
      await signOut();
      toast.info("Signed out of your royal account.");
      navigate({ to: "/" });
    } catch (err) {
      console.error("Sign out error:", err);
    }
  };

  return (
    <SiteLayout>
      <div className="min-h-screen bg-slate-50/70 py-10 px-4 sm:px-6">
        <div className="mx-auto max-w-3xl">
          {/* Header Card */}
          <div className="relative overflow-hidden rounded-3xl border border-white/60 bg-gradient-to-r from-lilac-deep via-lilac to-lilac-deep p-6 sm:p-8 text-white shadow-xl">
            <div className="absolute -top-16 -right-16 size-48 rounded-full bg-white/10 blur-2xl pointer-events-none" />
            <div className="absolute top-4 left-8 text-white/15 text-7xl font-black select-none pointer-events-none">
              👑
            </div>

            <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
              <div className="size-20 rounded-3xl bg-white/20 border border-white/40 shadow-inner flex items-center justify-center text-3xl font-black text-white shrink-0">
                {userInitials}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                  <h1 className="font-display text-2xl sm:text-3xl font-black text-white">
                    {fullName || userEmail.split("@")[0]}
                  </h1>
                  {isAdmin ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-300 text-amber-950 px-3 py-1 text-xs font-black shadow-sm">
                      👑 Atelier Admin
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-white/25 text-white px-3 py-1 text-xs font-bold">
                      👑 Royal Patron
                    </span>
                  )}
                </div>

                <p className="text-sm text-white/85 truncate mt-1 flex items-center justify-center sm:justify-start gap-1.5">
                  <Mail className="size-3.5 shrink-0" />
                  <span>{userEmail}</span>
                  {isEmailVerified && (
                    <span className="inline-flex items-center text-xs text-emerald-200 font-semibold gap-0.5 ml-1">
                      <CheckCircle2 className="size-3.5" /> Verified
                    </span>
                  )}
                </p>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-white/70 mt-2">
                  <span className="flex items-center gap-1">
                    <Calendar className="size-3.5" /> Member since {joinedDate}
                  </span>
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="size-3.5" /> Patron ID: IQ-{user.id.slice(0, 8).toUpperCase()}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSignOut}
                className="mt-2 sm:mt-0 inline-flex items-center gap-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white px-4 py-2 text-xs font-bold transition-all cursor-pointer shadow-xs"
              >
                <LogOut className="size-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {/* Main Card with Tabs */}
          <div className="mt-6 rounded-3xl border border-white/70 bg-white/90 shadow-xl overflow-hidden">
            {/* Tabs Bar */}
            <div className="flex border-b border-slate-100 bg-slate-50/60 px-4 sm:px-6 text-xs sm:text-sm font-bold">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("profile");
                  setFeedback(null);
                }}
                className={`flex items-center gap-2 border-b-2 px-4 py-3.5 transition-all cursor-pointer ${
                  activeTab === "profile"
                    ? "border-lilac-deep text-lilac-deep"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <User className="size-4" />
                Profile Details
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab("security");
                  setFeedback(null);
                }}
                className={`flex items-center gap-2 border-b-2 px-4 py-3.5 transition-all cursor-pointer ${
                  activeTab === "security"
                    ? "border-lilac-deep text-lilac-deep"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <KeyRound className="size-4" />
                Password & Security
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab("activity");
                  setFeedback(null);
                }}
                className={`flex items-center gap-2 border-b-2 px-4 py-3.5 transition-all cursor-pointer ${
                  activeTab === "activity"
                    ? "border-lilac-deep text-lilac-deep"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <ShoppingBag className="size-4" />
                Atelier Activity
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 sm:p-8">
              {/* Feedback alert */}
              {feedback && (
                <div
                  className={`mb-6 flex items-start gap-3 rounded-2xl p-4 text-sm leading-relaxed ${
                    feedback.type === "success"
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                      : "bg-rose-50 text-rose-800 border border-rose-200"
                  }`}
                >
                  {feedback.type === "success" ? (
                    <CheckCircle2 className="size-5 shrink-0 text-emerald-600 mt-0.5" />
                  ) : (
                    <AlertCircle className="size-5 shrink-0 text-rose-600 mt-0.5" />
                  )}
                  <span>{feedback.message}</span>
                </div>
              )}

              {/* TAB 1: PROFILE DETAILS */}
              {activeTab === "profile" && (
                <form onSubmit={handleSaveProfile} className="max-w-xl space-y-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Inventive Queen"
                        maxLength={100}
                        className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm font-medium text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-lilac-deep focus:ring-2 focus:ring-lilac-deep/20 shadow-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      Mobile Phone Number (India)
                    </label>
                    <div className="relative">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs font-bold text-slate-500">
                        <Phone className="size-3.5 text-slate-400" />
                        <span>+91</span>
                      </div>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/[^\d]/g, "").slice(0, 10))}
                        placeholder="9876543210"
                        maxLength={10}
                        className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-16 pr-4 text-sm font-medium text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-lilac-deep focus:ring-2 focus:ring-lilac-deep/20 shadow-xs"
                      />
                    </div>
                    <p className="mt-1 text-xs text-slate-400">
                      Used for delivery dispatch notices, courier tracking, and atelier custom crafting communication.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      Account Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                      <input
                        type="email"
                        value={userEmail}
                        disabled
                        className="w-full rounded-xl border border-slate-200 bg-slate-100 py-3 pl-10 pr-10 text-sm font-medium text-slate-500 cursor-not-allowed"
                      />
                      <Lock className="absolute right-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                    </div>
                    <p className="mt-1 text-xs text-slate-400">
                      Email address is tied to your royal atelier credentials and cannot be modified directly.
                    </p>
                  </div>

                  <div className="pt-3">
                    <button
                      type="submit"
                      disabled={savingProfile}
                      className="rounded-xl bg-lilac-deep py-3 px-6 text-sm font-bold text-white shadow-md hover:bg-lilac-deep/90 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60"
                    >
                      {savingProfile ? (
                        <>
                          <Loader2 className="size-4 animate-spin" />
                          <span>Saving Changes...</span>
                        </>
                      ) : (
                        <>
                          <Save className="size-4" />
                          <span>Save Profile Details</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 2: PASSWORD & SECURITY */}
              {activeTab === "security" && (
                <div className="max-w-xl space-y-8">
                  {/* Direct Password Change */}
                  <form onSubmit={handleUpdatePassword} className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Lock className="size-4 text-lilac-deep" />
                      <h3 className="text-base font-bold text-slate-800">Change Account Password</h3>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Minimum 6 characters"
                          className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-4 pr-10 text-sm font-medium text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-lilac-deep focus:ring-2 focus:ring-lilac-deep/20 shadow-xs"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          {showNewPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Re-type new password"
                          className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-4 pr-10 text-sm font-medium text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-lilac-deep focus:ring-2 focus:ring-lilac-deep/20 shadow-xs"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={savingPassword || !newPassword}
                      className="rounded-xl bg-lilac-deep py-2.5 px-6 text-sm font-bold text-white shadow-sm hover:bg-lilac-deep/90 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {savingPassword ? (
                        <>
                          <Loader2 className="size-4 animate-spin" />
                          <span>Updating Password...</span>
                        </>
                      ) : (
                        <>
                          <KeyRound className="size-4" />
                          <span>Update Password</span>
                        </>
                      )}
                    </button>
                  </form>

                  {/* Password Reset Email option */}
                  <div className="rounded-2xl border border-slate-200/90 bg-slate-50/80 p-5">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Mail className="size-4 text-lilac-deep" />
                      <h4 className="text-sm font-bold text-slate-800">Email Recovery Link</h4>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed mb-4">
                      Prefer to reset your password via email? We will dispatch a one-time cryptographic recovery link to <span className="font-semibold text-slate-700">{userEmail}</span>.
                    </p>

                    <button
                      type="button"
                      onClick={handleSendResetEmail}
                      disabled={sendingResetEmail || resetEmailSent}
                      className="rounded-xl border border-lilac-deep/30 bg-white py-2.5 px-5 text-xs font-bold text-lilac-deep shadow-xs hover:bg-lilac-50 transition-all inline-flex items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {sendingResetEmail ? (
                        <>
                          <Loader2 className="size-4 animate-spin" />
                          <span>Dispatching Recovery Link...</span>
                        </>
                      ) : resetEmailSent ? (
                        <>
                          <CheckCircle2 className="size-4 text-emerald-600" />
                          <span>Recovery Link Dispatched!</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="size-4" />
                          <span>Send Password Reset Link to Email</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 3: ATELIER ACTIVITY & ADMIN */}
              {activeTab === "activity" && (
                <div className="max-w-2xl space-y-5">
                  {/* Orders Card */}
                  <div className="rounded-2xl border border-lilac/30 bg-lilac/5 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="size-12 rounded-2xl bg-lilac-deep/10 text-lilac-deep flex items-center justify-center shrink-0">
                        <ShoppingBag className="size-6" />
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-slate-800">My Orders & Live Tracking</h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Track ongoing crochet pieces, view past receipts, and monitor courier delivery.
                        </p>
                      </div>
                    </div>

                    <Link
                      to="/orders"
                      className="rounded-xl bg-lilac-deep px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-lilac-deep/90 transition-all shrink-0 inline-flex items-center justify-center gap-1.5"
                    >
                      <span>View Orders</span>
                      <ArrowRight className="size-4" />
                    </Link>
                  </div>

                  {/* ADMIN PANEL ACCESS — STRICTLY CONDITIONAL ON isAdmin */}
                  {isAdmin ? (
                    <div className="rounded-2xl border border-amber-300 bg-gradient-to-br from-amber-50 to-orange-50/50 p-6 shadow-sm">
                      <div className="flex items-start gap-4">
                        <div className="size-12 rounded-2xl bg-amber-200 text-amber-900 flex items-center justify-center text-2xl shrink-0 shadow-inner">
                          👑
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="text-base font-black text-amber-950">Atelier Executive CMS</h4>
                            <span className="rounded-full bg-amber-200 px-2.5 py-0.5 text-[11px] font-black text-amber-900">
                              Verified Admin
                            </span>
                          </div>
                          <p className="text-xs text-amber-800/80 leading-relaxed mt-1.5">
                            You possess full executive store management access. Control orders Kanban pipeline, add or edit storefront products, moderate reviews, configure coupons, and adjust shop banners.
                          </p>

                          <div className="mt-4">
                            <Link
                              to="/admin"
                              className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-xs font-black text-white shadow-md hover:bg-amber-600 transition-all"
                            >
                              <span>Open Admin Panel & CMS Portal</span>
                              <ExternalLink className="size-4" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-5">
                      <div className="flex items-center gap-2 text-sm font-bold text-slate-800 mb-2">
                        <Sparkles className="size-4 text-lilac-deep" />
                        <span>Royal Patron Membership Privileges</span>
                      </div>
                      <ul className="text-xs text-slate-500 space-y-2 list-disc list-inside">
                        <li>Priority handmade crafting queue for bespoke plushies and flower bouquets</li>
                        <li>Hand-calligraphed luxury gift cards included with every parcel</li>
                        <li>Automated real-time SMS & courier dispatch tracking</li>
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
