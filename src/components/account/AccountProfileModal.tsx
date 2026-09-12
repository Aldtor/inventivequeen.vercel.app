import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
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
  X,
  ArrowRight,
  ExternalLink,
  Save,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { sanitizeText, validatePasswordStrength, validatePhone } from "@/lib/security";

interface AccountProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AccountProfileModal({ isOpen, onClose }: AccountProfileModalProps) {
  const navigate = useNavigate();
  const { user, profile, isAdmin, refreshUserData, signOut } = useAuth();

  const [activeTab, setActiveTab] = useState<"profile" | "security" | "activity">("profile");

  // Profile fields
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  // Security / Password fields
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [sendingResetEmail, setSendingResetEmail] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [resendingVerification, setResendingVerification] = useState(false);

  // Feedback status
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(
    null,
  );

  // Sync inputs when user/profile changes or modal opens
  useEffect(() => {
    if (isOpen && user) {
      setFullName(profile?.full_name || (user.user_metadata?.["full_name"] as string) || "");
      setPhone(profile?.phone || (user.user_metadata?.["phone"] as string) || "");
      setNewPassword("");
      setConfirmPassword("");
      setFeedback(null);
      setResetEmailSent(false);
    }
  }, [isOpen, user, profile]);

  if (!isOpen || !user) return null;

  const userEmail = user.email || "patron@inventivequeen.com";
  const userInitials = (fullName || userEmail.split("@")[0] || "IQ").slice(0, 2).toUpperCase();

  const joinedDate = user.created_at
    ? new Date(user.created_at).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "September 2026";

  const isEmailVerified = Boolean(
    user.email_confirmed_at || user.confirmed_at || (user.identities && user.identities.length > 0),
  );

  // 1. Save Profile Details (Name & Phone)
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
      // 1. Update profiles table
      const { error: profileError } = await supabase.from("profiles").upsert({
        id: user.id,
        email: userEmail,
        full_name: cleanName,
        phone: cleanPhone || null,
        updated_at: new Date().toISOString(),
      });

      if (profileError) {
        throw profileError;
      }

      // 2. Update user metadata in Supabase Auth
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
    } catch (err: unknown) {
      console.error("Failed to update profile:", err);
      const msg =
        err instanceof Error ? err.message : "Failed to update profile. Please try again.";
      setFeedback({
        type: "error",
        message: msg,
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
    } catch (err: unknown) {
      console.error("Password update error:", err);
      const msg =
        err instanceof Error ? err.message : "Could not update password. Please try again.";
      setFeedback({
        type: "error",
        message: msg,
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
      const origin =
        typeof window !== "undefined" && window.location.origin
          ? window.location.origin
          : "https://inventivequeen.vercel.app";
      const { error } = await supabase.auth.resetPasswordForEmail(userEmail, {
        redirectTo: `${origin}/reset-password`,
      });

      if (error) throw error;

      setResetEmailSent(true);
      setFeedback({
        type: "success",
        message: `A secure password reset link has been dispatched to ${userEmail}. Please check your inbox.`,
      });
      toast.success("Password reset link sent to your email!");
    } catch (err: unknown) {
      console.error("Reset email error:", err);
      const msg = err instanceof Error ? err.message : "Unable to send reset email at this moment.";
      setFeedback({
        type: "error",
        message: msg,
      });
      toast.error("Could not send password reset link.");
    } finally {
      setSendingResetEmail(false);
    }
  };

  const handleResendVerification = async () => {
    if (!userEmail) return;
    setResendingVerification(true);
    setFeedback(null);
    try {
      const origin =
        typeof window !== "undefined" && window.location.origin
          ? window.location.origin
          : "https://inventivequeen.vercel.app";
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: userEmail,
        options: {
          emailRedirectTo: `${origin}/login?verified=true`,
        },
      });
      if (error) throw error;
      setFeedback({
        type: "success",
        message: `Verification link dispatched to ${userEmail}. Please check your inbox.`,
      });
      toast.success("Verification link sent!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to send verification email.";
      setFeedback({ type: "error", message: msg });
      toast.error(msg);
    } finally {
      setResendingVerification(false);
    }
  };

  // 4. Sign Out
  const handleSignOut = async () => {
    try {
      await signOut();
      onClose();
      toast.info("Signed out of your royal account.");
      navigate({ to: "/" });
    } catch (err) {
      console.error("Sign out error:", err);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in-0 duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/60 bg-white/95 shadow-2xl backdrop-blur-xl transition-all duration-300">
        {/* Top Decorative Banner */}
        <div className="relative bg-gradient-to-r from-lilac-deep via-lilac to-lilac-deep px-6 pt-6 pb-5 text-white">
          <div className="absolute -top-12 -right-12 size-36 rounded-full bg-white/10 blur-xl pointer-events-none" />
          <div className="absolute top-2 left-6 text-white/15 select-none pointer-events-none">
            <Crown className="size-16" />
          </div>

          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 rounded-full p-1.5 text-white/80 hover:bg-white/20 hover:text-white transition-all cursor-pointer"
            aria-label="Close modal"
          >
            <X className="size-5" />
          </button>

          <div className="relative flex items-center gap-4">
            <div className="size-16 rounded-2xl bg-white/20 border border-white/40 shadow-inner flex items-center justify-center text-2xl font-black text-white shrink-0">
              {userInitials}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-display text-xl font-black text-white truncate">
                  {fullName || userEmail.split("@")[0]}
                </h3>
                {isAdmin ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-300 text-amber-950 px-2.5 py-0.5 text-[11px] font-black shadow-sm">
                    <Crown className="size-3 text-amber-900" /> Atelier Admin
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/25 text-white px-2.5 py-0.5 text-[11px] font-bold">
                    <Crown className="size-3 text-amber-300" /> Royal Patron
                  </span>
                )}
              </div>

              <p className="text-xs text-white/80 truncate mt-0.5 flex items-center gap-1.5">
                <Mail className="size-3 shrink-0" />
                <span className="truncate">{userEmail}</span>
                {isEmailVerified && (
                  <span className="inline-flex items-center text-[10px] text-emerald-200 font-semibold gap-0.5">
                    <CheckCircle2 className="size-3" /> Verified
                  </span>
                )}
              </p>

              <div className="flex items-center gap-3 text-[11px] text-white/70 mt-1.5">
                <span className="flex items-center gap-1">
                  <Calendar className="size-3" /> Member since {joinedDate}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-100 bg-slate-50/80 px-4 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setActiveTab("profile");
              setFeedback(null);
            }}
            className={`flex items-center gap-1.5 border-b-2 px-4 py-3 transition-all cursor-pointer ${
              activeTab === "profile"
                ? "border-lilac-deep text-lilac-deep"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <User className="size-3.5" />
            Profile Details
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("security");
              setFeedback(null);
            }}
            className={`flex items-center gap-1.5 border-b-2 px-4 py-3 transition-all cursor-pointer ${
              activeTab === "security"
                ? "border-lilac-deep text-lilac-deep"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <KeyRound className="size-3.5" />
            Password & Security
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("activity");
              setFeedback(null);
            }}
            className={`flex items-center gap-1.5 border-b-2 px-4 py-3 transition-all cursor-pointer ${
              activeTab === "activity"
                ? "border-lilac-deep text-lilac-deep"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <ShoppingBag className="size-3.5" />
            Atelier Activity
          </button>
        </div>

        {/* Modal Body */}
        <div className="max-h-[70vh] overflow-y-auto p-5 sm:p-6">
          {/* Feedback message */}
          {feedback && (
            <div
              className={`mb-4 flex items-start gap-2.5 rounded-2xl p-3 text-xs leading-relaxed ${
                feedback.type === "success"
                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                  : "bg-rose-50 text-rose-800 border border-rose-200"
              }`}
            >
              {feedback.type === "success" ? (
                <CheckCircle2 className="size-4 shrink-0 text-emerald-600 mt-0.5" />
              ) : (
                <AlertCircle className="size-4 shrink-0 text-rose-600 mt-0.5" />
              )}
              <span>{feedback.message}</span>
            </div>
          )}

          {/* TAB 1: PROFILE DETAILS */}
          {activeTab === "profile" && (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
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
                    className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm font-medium text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-lilac-deep focus:ring-2 focus:ring-lilac-deep/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Mobile Phone Number (India)
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs font-bold text-slate-500">
                    <Phone className="size-3.5 text-slate-400" />
                    <span>+91</span>
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/[^\d]/g, "").slice(0, 10))}
                    placeholder="9876543210"
                    maxLength={10}
                    className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-16 pr-4 text-sm font-medium text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-lilac-deep focus:ring-2 focus:ring-lilac-deep/20"
                  />
                </div>
                <p className="mt-1 text-[11px] text-slate-400">
                  Used for order dispatch updates, courier tracking, and atelier custom requests.
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Email Address
                  </label>
                  {isEmailVerified ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                      <CheckCircle2 className="size-3 text-emerald-600" /> Verified
                    </span>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                        <AlertCircle className="size-3 text-amber-600" /> Unverified
                      </span>
                      <button
                        type="button"
                        onClick={handleResendVerification}
                        disabled={resendingVerification}
                        className="text-[10px] font-bold text-lilac-deep underline hover:text-lilac-deep/80 cursor-pointer disabled:opacity-50"
                      >
                        {resendingVerification ? "Sending..." : "Resend Link"}
                      </button>
                    </div>
                  )}
                </div>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                  <input
                    type="email"
                    value={userEmail}
                    disabled
                    className="w-full rounded-xl border border-slate-200 bg-slate-100 py-2.5 pl-10 pr-10 text-sm font-medium text-slate-500 cursor-not-allowed"
                  />
                  <Lock className="absolute right-3.5 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
                </div>
                <p className="mt-1 text-[11px] text-slate-400">
                  Account identity email is fixed for order security and payment confirmation.
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="w-full rounded-xl bg-lilac-deep py-2.5 text-sm font-bold text-white shadow-md hover:bg-lilac-deep/90 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {savingProfile ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      <span>Saving Details...</span>
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
            <div className="space-y-6">
              {/* Direct Password Change */}
              <form onSubmit={handleUpdatePassword} className="space-y-3.5">
                <div className="flex items-center gap-2">
                  <Lock className="size-4 text-lilac-deep" />
                  <h4 className="text-sm font-bold text-slate-800">Change Royal Password</h4>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-3.5 pr-10 text-sm font-medium text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-lilac-deep focus:ring-2 focus:ring-lilac-deep/20"
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
                  <label className="block text-xs font-semibold text-slate-500 mb-1">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-type new password"
                      className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-3.5 pr-10 text-sm font-medium text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-lilac-deep focus:ring-2 focus:ring-lilac-deep/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={savingPassword || !newPassword}
                  className="w-full rounded-xl bg-lilac-deep py-2.5 text-xs font-bold text-white shadow-sm hover:bg-lilac-deep/90 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {savingPassword ? (
                    <>
                      <Loader2 className="size-3.5 animate-spin" />
                      <span>Updating Password...</span>
                    </>
                  ) : (
                    <>
                      <KeyRound className="size-3.5" />
                      <span>Update Password</span>
                    </>
                  )}
                </button>
              </form>

              {/* Password Reset Email option */}
              <div className="rounded-2xl border border-slate-200/80 bg-slate-50 p-4">
                <div className="flex items-center gap-2 mb-1.5">
                  <Mail className="size-4 text-lilac-deep" />
                  <h4 className="text-xs font-bold text-slate-800">Email Recovery Link</h4>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed mb-3">
                  Prefer to reset your password via your email inbox? We can dispatch a one-time
                  cryptographic recovery link to{" "}
                  <span className="font-semibold text-slate-700">{userEmail}</span>.
                </p>

                <button
                  type="button"
                  onClick={handleSendResetEmail}
                  disabled={sendingResetEmail || resetEmailSent}
                  className="w-full rounded-xl border border-lilac-deep/30 bg-white py-2 px-3 text-xs font-bold text-lilac-deep shadow-xs hover:bg-lilac-50 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {sendingResetEmail ? (
                    <>
                      <Loader2 className="size-3.5 animate-spin" />
                      <span>Dispatching Link...</span>
                    </>
                  ) : resetEmailSent ? (
                    <>
                      <CheckCircle2 className="size-3.5 text-emerald-600" />
                      <span>Reset Link Dispatched!</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="size-3.5" />
                      <span>Send Password Reset Link to Email</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: ATELIER ACTIVITY & ADMIN */}
          {activeTab === "activity" && (
            <div className="space-y-4">
              {/* My Orders Card */}
              <div className="rounded-2xl border border-lilac/30 bg-lilac/5 p-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-lilac-deep/10 text-lilac-deep flex items-center justify-center shrink-0">
                    <ShoppingBag className="size-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">My Orders & Tracking</h4>
                    <p className="text-xs text-slate-500">
                      View past crochet orders, invoice status & live delivery tracking
                    </p>
                  </div>
                </div>

                <Link
                  to="/orders"
                  onClick={onClose}
                  className="rounded-xl bg-lilac-deep px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-lilac-deep/90 transition-all shrink-0 inline-flex items-center gap-1.5"
                >
                  <span>View</span>
                  <ArrowRight className="size-3.5" />
                </Link>
              </div>

              {/* ADMIN PANEL ACCESS — STRICTLY CONDITIONAL ON isAdmin */}
              {isAdmin ? (
                <div className="rounded-2xl border border-amber-300 bg-gradient-to-br from-amber-50 to-orange-50/50 p-4 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="size-10 rounded-xl bg-amber-200 text-amber-900 flex items-center justify-center shrink-0 shadow-inner">
                      <Crown className="size-5 text-amber-900" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-black text-amber-950">Atelier Executive CMS</h4>
                        <span className="rounded-full bg-amber-200 px-2 py-0.5 text-[10px] font-black text-amber-900">
                          Active Admin
                        </span>
                      </div>
                      <p className="text-xs text-amber-800/80 leading-relaxed mt-1">
                        You have verified administrative privileges. Manage orders Kanban board,
                        product catalog, customer reviews, discount coupons, and store settings.
                      </p>

                      <div className="mt-3">
                        <Link
                          to="/admin"
                          search={{ tab: "overview" }}
                          onClick={onClose}
                          className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-xs font-black text-white shadow-md hover:bg-amber-600 transition-all"
                        >
                          <span>Open Admin Panel & CMS</span>
                          <ExternalLink className="size-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-slate-200/80 bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700 mb-1">
                    <Sparkles className="size-3.5 text-lilac-deep" />
                    <span>Royal Patron Privileges</span>
                  </div>
                  <ul className="text-xs text-slate-500 space-y-1.5 list-disc list-inside">
                    <li>Priority handcrafted crafting queue for custom requests</li>
                    <li>Complimentary hand-calligraphed luxury gift cards</li>
                    <li>Real-time SMS & courier dispatch notifications</li>
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="border-t border-slate-100 bg-slate-50/90 px-5 py-3.5 flex items-center justify-between">
          <button
            type="button"
            onClick={handleSignOut}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 py-1.5 px-2.5 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
          >
            <LogOut className="size-3.5" />
            <span>Sign Out</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-4 py-1.5 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-100 transition-all cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
