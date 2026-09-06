import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useId, useState } from "react";
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
  MapPin,
  Building,
  Gift,
  Tag,
  Copy,
  Check,
  Truck,
  Package,
  Heart,
  HelpCircle,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import { SiteLayout } from "@/components/site/SiteLayout";
import { useAuth } from "@/lib/auth";
import { supabase, type DbOrder, type OrderStatus } from "@/lib/supabase";
import { sanitizeText, validatePasswordStrength, validatePhone } from "@/lib/security";
import { DEFAULT_COUPONS, type Coupon } from "@/lib/cms-coupons";

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
  head: () => ({
    meta: [
      { title: "Royal Patron Lounge & Account — Inventive Queen" },
      {
        name: "description",
        content:
          "Manage your royal atelier amigurumi orders, delivery address vault, coupon perks, and account security.",
      },
    ],
  }),
});

type TabType = "profile" | "orders" | "perks" | "security";

function getStepIndex(status: OrderStatus): number {
  switch (status) {
    case "pending":
      return 0;
    case "confirmed":
      return 1;
    case "crafting":
      return 2;
    case "shipped":
      return 3;
    case "delivered":
      return 4;
    default:
      return 1;
  }
}

function ProfilePage() {
  const navigate = useNavigate();
  const { user, profile, isAdmin, loading: authLoading, refreshUserData, signOut } = useAuth();

  const [activeTab, setActiveTab] = useState<TabType>("profile");

  // Patron Profile & Address fields
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [stateVal, setStateVal] = useState("");
  const [pincode, setPincode] = useState("");
  const [giftNotePref, setGiftNotePref] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  // Security & Password fields
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [sendingResetEmail, setSendingResetEmail] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);

  // Orders state
  const [orders, setOrders] = useState<DbOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // UI state
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [copiedPatronId, setCopiedPatronId] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(
    null,
  );

  // Accessible IDs
  const fullNameId = useId();
  const phoneId = useId();
  const emailId = useId();
  const streetId = useId();
  const cityId = useId();
  const stateId = useId();
  const pincodeId = useId();
  const giftNoteId = useId();
  const newPasswordId = useId();
  const confirmPasswordId = useId();

  // Load profile and user metadata
  useEffect(() => {
    if (user) {
      setFullName(profile?.full_name || (user.user_metadata?.["full_name"] as string) || "");
      setPhone(profile?.phone || (user.user_metadata?.["phone"] as string) || "");

      const meta = user.user_metadata || {};
      if (meta["street"]) setStreet(meta["street"] as string);
      if (meta["city"]) setCity(meta["city"] as string);
      if (meta["state"]) setStateVal(meta["state"] as string);
      if (meta["pincode"]) setPincode(meta["pincode"] as string);
      if (meta["gift_note_pref"]) setGiftNotePref(meta["gift_note_pref"] as string);
    }
  }, [user, profile]);

  // Fetch user orders
  const fetchUserOrders = useCallback(async () => {
    if (!user) return;
    setLoadingOrders(true);
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*, order_items(*)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (err: unknown) {
      console.error("Failed to load orders for profile:", err);
    } finally {
      setLoadingOrders(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchUserOrders();
    }
  }, [user, fetchUserOrders]);

  // Copy helper
  const copyToClipboard = (text: string, label: string) => {
    try {
      if (navigator?.clipboard?.writeText) {
        navigator.clipboard.writeText(text);
      }
      setCopiedCode(text);
      toast.success(`${label} copied to clipboard!`);
      setTimeout(() => setCopiedCode(null), 2500);
    } catch {
      toast.info(`Code: ${text}`);
    }
  };

  const copyPatronId = (patronId: string) => {
    try {
      if (navigator?.clipboard?.writeText) {
        navigator.clipboard.writeText(patronId);
      }
      setCopiedPatronId(true);
      toast.success("Patron ID copied!");
      setTimeout(() => setCopiedPatronId(false), 2500);
    } catch {
      toast.info(`Patron ID: ${patronId}`);
    }
  };

  // 1. Save Profile Details & Default Delivery Address
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setFeedback(null);

    const cleanName = sanitizeText(fullName, 100);
    const cleanPhone = phone.replace(/[^\d]/g, "").slice(0, 10);
    const cleanStreet = sanitizeText(street, 200);
    const cleanCity = sanitizeText(city, 80);
    const cleanState = sanitizeText(stateVal, 80);
    const cleanPincode = pincode.replace(/[^\d]/g, "").slice(0, 6);
    const cleanGiftNote = sanitizeText(giftNotePref, 300);

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

    if (cleanPincode && cleanPincode.length !== 6) {
      setFeedback({
        type: "error",
        message: "Please enter a valid 6-digit Indian PIN code.",
      });
      return;
    }

    setSavingProfile(true);

    try {
      // 1. Update public.profiles table
      const { error: profileError } = await supabase.from("profiles").upsert({
        id: user.id,
        email: user.email,
        full_name: cleanName,
        phone: cleanPhone || null,
        updated_at: new Date().toISOString(),
      });

      if (profileError) throw profileError;

      // 2. Update user metadata in Supabase Auth (includes shipping address vault)
      await supabase.auth.updateUser({
        data: {
          full_name: cleanName,
          phone: cleanPhone || null,
          street: cleanStreet || null,
          city: cleanCity || null,
          state: cleanState || null,
          pincode: cleanPincode || null,
          gift_note_pref: cleanGiftNote || null,
        },
      });

      await refreshUserData();

      setFeedback({
        type: "success",
        message: "Royal profile details & delivery address saved successfully!",
      });
      toast.success("Profile & Address Vault saved!");
    } catch (err: unknown) {
      console.error("Profile save error:", err);
      const msg =
        err instanceof Error ? err.message : "Failed to update profile. Please try again.";
      setFeedback({
        type: "error",
        message: msg,
      });
      toast.error("Could not save profile details.");
    } finally {
      setSavingProfile(false);
    }
  };

  // 2. Update Password
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
        message: "Your royal account password has been updated securely!",
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

  // 3. Dispatch Password Reset Link to Email
  const handleSendResetEmail = async () => {
    if (!user?.email) return;
    setSendingResetEmail(true);
    setFeedback(null);

    try {
      const origin =
        typeof window !== "undefined" ? window.location.origin : "https://inventivequeen.com";
      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: `${origin}/reset-password`,
      });

      if (error) throw error;

      setResetEmailSent(true);
      setFeedback({
        type: "success",
        message: `A secure one-click password recovery link has been dispatched to ${user.email}.`,
      });
      toast.success("Password recovery email dispatched!");
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

  if (authLoading) {
    return (
      <SiteLayout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
          <div className="size-14 rounded-3xl bg-lilac-deep/10 text-lilac-deep flex items-center justify-center mb-4 animate-spin text-2xl shadow-inner">
            👑
          </div>
          <h2 className="font-display text-xl font-bold text-slate-800">
            Opening Royal Patron Lounge...
          </h2>
          <p className="text-xs text-slate-500 mt-1">Connecting to secure atelier credentials</p>
        </div>
      </SiteLayout>
    );
  }

  if (!user) {
    return (
      <SiteLayout>
        <div className="min-h-[75vh] flex items-center justify-center p-4 bg-slate-50/50">
          <div className="max-w-md w-full rounded-3xl border border-lilac-deep/20 bg-white p-8 text-center shadow-xl">
            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl bg-lilac-deep/10 text-3xl text-lilac-deep">
              👑
            </div>
            <h2 className="font-display text-2xl font-black text-slate-800">
              Royal Patron Authentication
            </h2>
            <p className="mt-2 text-sm text-slate-500 leading-relaxed">
              Please sign in to your Inventive Queen account to access your personal amigurumi
              commissions, delivery address vault, and exclusive perks.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <Link
                to="/login"
                search={{ redirect: "/profile" }}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-lilac-deep py-3.5 text-sm font-bold text-white shadow-md hover:bg-lilac-deep/90 transition-all hover:scale-102"
              >
                <User className="size-4" />
                Sign In to Patron Lounge
              </Link>
              <Link
                to="/"
                className="text-xs font-semibold text-slate-500 hover:text-lilac-deep transition-colors py-1.5"
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
  const displayName =
    fullName || (user.user_metadata?.["full_name"] as string) || "Inventive Patron";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const joinedDate = user.created_at
    ? new Date(user.created_at).toLocaleDateString("en-IN", {
        month: "long",
        year: "numeric",
      })
    : "September 2026";

  const patronIdShort = `IQ-${user.id.slice(0, 8).toUpperCase()}`;

  const isEmailVerified = Boolean(
    user.email_confirmed_at || user.confirmed_at || (user.identities && user.identities.length > 0),
  );

  const activeOrdersCount = orders.filter(
    (o) => o.status !== "delivered" && o.status !== "cancelled",
  ).length;

  return (
    <SiteLayout>
      <div className="min-h-screen bg-gradient-to-b from-purple-50/50 via-white to-purple-50/30 py-8 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          {/* Breadcrumbs & Headline */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-lilac-deep/80 mb-1">
                <Link to="/" className="hover:underline">
                  Home
                </Link>
                <span>/</span>
                <span className="text-slate-500">Royal Patron Lounge</span>
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2.5">
                <span>👑 Royal Patron Atelier Lounge</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Welcome back, <span className="font-bold text-lilac-deep">{displayName}</span>.
                Manage your handcrafted amigurumi orders, address vault, and member privileges.
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <Link
                to="/checkout"
                className="clay inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold text-lilac-deep hover:bg-white/60 transition-all hover:scale-105"
              >
                <ShoppingBag className="size-3.5" />
                <span>My Basket</span>
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  search={{ tab: "overview" }}
                  className="bg-amber-100 text-amber-900 border border-amber-300 inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-black shadow-xs hover:bg-amber-200 transition-all"
                >
                  👑 CMS Portal
                </Link>
              )}
            </div>
          </div>

          {/* Feedback Alert */}
          {feedback && (
            <div
              className={`mb-6 flex items-start gap-3 rounded-2xl p-4 text-sm leading-relaxed shadow-xs transition-all ${
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
              <div className="flex-1 font-medium">{feedback.message}</div>
              <button
                type="button"
                onClick={() => setFeedback(null)}
                className="text-xs font-bold opacity-60 hover:opacity-100 cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Main 12-Column Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* LEFT COLUMN: Royal Patron Passport Card & Tabs (4 Cols) */}
            <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
              {/* Royal Passport Identity Card */}
              <div className="relative overflow-hidden rounded-3xl border border-lilac/30 bg-gradient-to-br from-white via-purple-50/40 to-lilac/10 p-6 shadow-xl">
                {/* Decorative Crown Ambient Background */}
                <div className="absolute -top-6 -right-6 size-28 rounded-full bg-lilac/20 blur-2xl pointer-events-none" />
                <div className="absolute top-3 right-4 text-lilac/15 text-5xl font-black select-none pointer-events-none">
                  👑
                </div>

                <div className="relative flex flex-col items-center text-center">
                  {/* Monogram Avatar with Royal Ring */}
                  <div className="relative mb-3.5">
                    <div className="size-20 rounded-3xl bg-gradient-to-br from-lilac-deep to-primary text-white shadow-lg flex items-center justify-center text-2xl font-black tracking-wider border-2 border-white">
                      {initials || "IQ"}
                    </div>
                    <span
                      className="absolute -bottom-1 -right-1 size-7 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center text-xs shadow-md border-2 border-white"
                      title="Royal Patron Tier"
                    >
                      👑
                    </span>
                  </div>

                  <h2 className="font-display text-xl font-black text-slate-900 line-clamp-1">
                    {displayName}
                  </h2>

                  {/* Badges row */}
                  <div className="mt-1.5 flex flex-wrap items-center justify-center gap-1.5">
                    {isAdmin ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-200 text-amber-950 px-2.5 py-0.5 text-[11px] font-black shadow-xs">
                        👑 Atelier Admin
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-lilac/20 text-lilac-deep px-2.5 py-0.5 text-[11px] font-bold">
                        👑 Royal Patron
                      </span>
                    )}

                    {isEmailVerified && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 px-2 py-0.5 text-[10px] font-bold">
                        <CheckCircle2 className="size-3" /> Verified
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-500 truncate max-w-full mt-2 flex items-center gap-1">
                    <Mail className="size-3 text-slate-400 shrink-0" />
                    <span className="truncate">{userEmail}</span>
                  </p>

                  {/* Patron ID with 1-click Copy */}
                  <div className="mt-3.5 w-full flex items-center justify-between gap-2 rounded-2xl bg-white/90 border border-slate-200/80 px-3 py-2 text-xs text-slate-600 shadow-2xs">
                    <div className="flex items-center gap-1.5 truncate">
                      <ShieldCheck className="size-3.5 text-lilac-deep shrink-0" />
                      <span className="font-bold text-slate-700">{patronIdShort}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyPatronId(patronIdShort)}
                      className="text-[11px] font-bold text-lilac-deep hover:text-lilac-deep/80 inline-flex items-center gap-1 cursor-pointer transition-colors"
                      title="Copy Patron ID"
                    >
                      {copiedPatronId ? (
                        <>
                          <Check className="size-3 text-emerald-600" />
                          <span className="text-emerald-600">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="size-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Member Since chip */}
                  <p className="mt-3 text-[11px] text-slate-400 flex items-center gap-1">
                    <Calendar className="size-3" />
                    <span>Member since {joinedDate}</span>
                  </p>
                </div>

                {/* Atelier Quick Stats row */}
                <div className="mt-5 grid grid-cols-3 gap-2 border-t border-slate-200/70 pt-4 text-center">
                  <div className="rounded-2xl bg-white/80 p-2.5 border border-slate-100 shadow-2xs">
                    <div className="text-base font-black text-slate-900">{orders.length}</div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Orders
                    </div>
                  </div>

                  <div className="rounded-2xl bg-white/80 p-2.5 border border-slate-100 shadow-2xs">
                    <div className="text-base font-black text-amber-600">{activeOrdersCount}</div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      In Craft
                    </div>
                  </div>

                  <div className="rounded-2xl bg-white/80 p-2.5 border border-slate-100 shadow-2xs">
                    <div className="text-base font-black text-lilac-deep">3</div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Vouchers
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation Menu Buttons */}
              <div className="rounded-3xl border border-white/70 bg-white/95 p-3 shadow-lg space-y-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("profile");
                    setFeedback(null);
                  }}
                  className={`w-full flex items-center justify-between rounded-2xl px-4 py-3 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    activeTab === "profile"
                      ? "bg-lilac-deep text-white shadow-md scale-101"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <User className="size-4 shrink-0" />
                    <div className="text-left">
                      <div>Profile & Address Vault</div>
                      <div
                        className={`text-[10px] font-normal ${activeTab === "profile" ? "text-white/80" : "text-slate-400"}`}
                      >
                        Personal info & delivery address
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="size-3.5 opacity-60" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("orders");
                    setFeedback(null);
                  }}
                  className={`w-full flex items-center justify-between rounded-2xl px-4 py-3 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    activeTab === "orders"
                      ? "bg-lilac-deep text-white shadow-md scale-101"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <ShoppingBag className="size-4 shrink-0" />
                    <div className="text-left">
                      <div>Atelier Orders & Tracking</div>
                      <div
                        className={`text-[10px] font-normal ${activeTab === "orders" ? "text-white/80" : "text-slate-400"}`}
                      >
                        Track amigurumi crafting status
                      </div>
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-black ${
                      activeTab === "orders"
                        ? "bg-white text-lilac-deep"
                        : "bg-lilac/20 text-lilac-deep"
                    }`}
                  >
                    {orders.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("perks");
                    setFeedback(null);
                  }}
                  className={`w-full flex items-center justify-between rounded-2xl px-4 py-3 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    activeTab === "perks"
                      ? "bg-lilac-deep text-white shadow-md scale-101"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Gift className="size-4 shrink-0" />
                    <div className="text-left">
                      <div>Royal Perks & Coupons</div>
                      <div
                        className={`text-[10px] font-normal ${activeTab === "perks" ? "text-white/80" : "text-slate-400"}`}
                      >
                        Active discount vouchers
                      </div>
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-black ${
                      activeTab === "perks"
                        ? "bg-white text-lilac-deep"
                        : "bg-amber-100 text-amber-900"
                    }`}
                  >
                    3 Active
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("security");
                    setFeedback(null);
                  }}
                  className={`w-full flex items-center justify-between rounded-2xl px-4 py-3 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    activeTab === "security"
                      ? "bg-lilac-deep text-white shadow-md scale-101"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <KeyRound className="size-4 shrink-0" />
                    <div className="text-left">
                      <div>Password & Credentials</div>
                      <div
                        className={`text-[10px] font-normal ${activeTab === "security" ? "text-white/80" : "text-slate-400"}`}
                      >
                        Password & recovery link
                      </div>
                    </div>
                  </div>
                  <Lock className="size-3.5 opacity-60" />
                </button>
              </div>

              {/* Sidebar Footer Actions */}
              <div className="rounded-3xl border border-slate-200/80 bg-white/80 p-4 shadow-xs space-y-2">
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  <LogOut className="size-3.5" />
                  <span>Sign Out of Royal Account</span>
                </button>

                <div className="text-center">
                  <Link
                    to="/contact"
                    className="text-[11px] text-slate-400 hover:text-lilac-deep transition-colors inline-flex items-center gap-1"
                  >
                    <HelpCircle className="size-3" />
                    <span>Need crafting assistance? Contact Us</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Active Tab Content Area (8 Cols) */}
            <div className="lg:col-span-8 space-y-6">
              {/* ============================================================ */}
              {/* TAB 1: PROFILE & DELIVERY ADDRESS VAULT                      */}
              {/* ============================================================ */}
              {activeTab === "profile" && (
                <form onSubmit={handleSaveProfile} className="space-y-6">
                  {/* Card 1: Patron Personal Details */}
                  <div className="rounded-3xl border border-white/70 bg-white/95 p-6 sm:p-8 shadow-xl">
                    <div className="flex items-center gap-3 mb-5 border-b border-slate-100 pb-4">
                      <div className="size-10 rounded-2xl bg-lilac/20 text-lilac-deep flex items-center justify-center shrink-0">
                        <User className="size-5" />
                      </div>
                      <div>
                        <h3 className="font-display text-lg font-bold text-slate-800">
                          Personal Information
                        </h3>
                        <p className="text-xs text-slate-500">
                          Your royal identity details used for order dispatches and packaging notes.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label
                          htmlFor={fullNameId}
                          className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5"
                        >
                          Full Name <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                          <input
                            id={fullNameId}
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="e.g. Ananya Sharma"
                            maxLength={100}
                            required
                            className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm font-medium text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-lilac-deep focus:ring-2 focus:ring-lilac-deep/20 shadow-2xs"
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor={phoneId}
                          className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5"
                        >
                          Mobile Phone (India)
                        </label>
                        <div className="relative">
                          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs font-bold text-slate-500">
                            <span className="text-sm">🇮🇳</span>
                            <span>+91</span>
                          </div>
                          <input
                            id={phoneId}
                            type="tel"
                            value={phone}
                            onChange={(e) =>
                              setPhone(e.target.value.replace(/[^\d]/g, "").slice(0, 10))
                            }
                            placeholder="9876543210"
                            maxLength={10}
                            className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-16 pr-4 text-sm font-medium text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-lilac-deep focus:ring-2 focus:ring-lilac-deep/20 shadow-2xs"
                          />
                        </div>
                        <p className="mt-1 text-[11px] text-slate-400">
                          For courier tracking SMS and delivery coordination.
                        </p>
                      </div>

                      <div className="sm:col-span-2">
                        <label
                          htmlFor={emailId}
                          className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5"
                        >
                          Account Email
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                          <input
                            id={emailId}
                            type="email"
                            value={userEmail}
                            disabled
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-10 text-sm font-medium text-slate-500 cursor-not-allowed shadow-2xs"
                          />
                          <Lock className="absolute right-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                        </div>
                        <p className="mt-1 text-[11px] text-slate-400 flex items-center gap-1">
                          <ShieldCheck className="size-3 text-emerald-600" />
                          <span>
                            Account email is protected by Supabase cryptographic auth credentials.
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Saved Delivery Address Vault */}
                  <div className="rounded-3xl border border-white/70 bg-white/95 p-6 sm:p-8 shadow-xl">
                    <div className="flex items-center gap-3 mb-5 border-b border-slate-100 pb-4">
                      <div className="size-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                        <MapPin className="size-5" />
                      </div>
                      <div>
                        <h3 className="font-display text-lg font-bold text-slate-800">
                          Default Atelier Delivery Address Vault
                        </h3>
                        <p className="text-xs text-slate-500">
                          Save your shipping address once to enjoy instant, 1-click checkout for all
                          handcrafted pieces.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="sm:col-span-2">
                        <label
                          htmlFor={streetId}
                          className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5"
                        >
                          Street Address / House No. / Apartment / Landmark
                        </label>
                        <div className="relative">
                          <MapPin className="absolute left-3.5 top-3.5 size-4 text-slate-400" />
                          <textarea
                            id={streetId}
                            value={street}
                            onChange={(e) => setStreet(e.target.value)}
                            placeholder="Flat 402, Lotus Palace, 14th Main Road, Indiranagar"
                            rows={2}
                            maxLength={200}
                            className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm font-medium text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-lilac-deep focus:ring-2 focus:ring-lilac-deep/20 shadow-2xs resize-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor={cityId}
                          className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5"
                        >
                          City / District
                        </label>
                        <div className="relative">
                          <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                          <input
                            id={cityId}
                            type="text"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            placeholder="e.g. Bengaluru, Mumbai, Delhi"
                            maxLength={80}
                            className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm font-medium text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-lilac-deep focus:ring-2 focus:ring-lilac-deep/20 shadow-2xs"
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor={stateId}
                          className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5"
                        >
                          State / Territory
                        </label>
                        <input
                          id={stateId}
                          type="text"
                          value={stateVal}
                          onChange={(e) => setStateVal(e.target.value)}
                          placeholder="e.g. Karnataka, Maharashtra"
                          maxLength={80}
                          className="w-full rounded-xl border border-slate-200 bg-white py-3 px-4 text-sm font-medium text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-lilac-deep focus:ring-2 focus:ring-lilac-deep/20 shadow-2xs"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor={pincodeId}
                          className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5"
                        >
                          Postal PIN Code (6 Digits)
                        </label>
                        <input
                          id={pincodeId}
                          type="text"
                          value={pincode}
                          onChange={(e) =>
                            setPincode(e.target.value.replace(/[^\d]/g, "").slice(0, 6))
                          }
                          placeholder="e.g. 560038"
                          maxLength={6}
                          className="w-full rounded-xl border border-slate-200 bg-white py-3 px-4 text-sm font-medium text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-lilac-deep focus:ring-2 focus:ring-lilac-deep/20 shadow-2xs"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Card 3: Bespoke Gifting Note Preference */}
                  <div className="rounded-3xl border border-white/70 bg-white/95 p-6 sm:p-8 shadow-xl">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="size-10 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                        <Gift className="size-5" />
                      </div>
                      <div>
                        <h3 className="font-display text-base font-bold text-slate-800">
                          Bespoke Gifting & Custom Notes Preference
                        </h3>
                        <p className="text-xs text-slate-500">
                          Default handwritten gift card message or crafting instructions for your
                          parcels.
                        </p>
                      </div>
                    </div>

                    <textarea
                      id={giftNoteId}
                      value={giftNotePref}
                      onChange={(e) => setGiftNotePref(e.target.value)}
                      placeholder="e.g. 'Crafted with royal love for my favorite person! Happy Birthday! ✨'"
                      rows={2}
                      maxLength={300}
                      className="w-full rounded-xl border border-slate-200 bg-white p-3.5 text-sm font-medium text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-lilac-deep focus:ring-2 focus:ring-lilac-deep/20 shadow-2xs resize-none"
                    />
                  </div>

                  {/* Save Button */}
                  <div className="flex items-center justify-end">
                    <button
                      type="submit"
                      disabled={savingProfile}
                      className="clay-primary liquid-btn inline-flex items-center gap-2 rounded-2xl px-8 py-3.5 text-sm font-bold shadow-lg hover:scale-102 transition-transform cursor-pointer disabled:opacity-60"
                    >
                      {savingProfile ? (
                        <>
                          <Loader2 className="size-4 animate-spin" />
                          <span>Saving Royal Profile...</span>
                        </>
                      ) : (
                        <>
                          <Save className="size-4" />
                          <span>Save Royal Profile & Address</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* ============================================================ */}
              {/* TAB 2: ATELIER ORDERS & TRACKING                             */}
              {/* ============================================================ */}
              {activeTab === "orders" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-display text-xl font-black text-slate-900">
                        My Atelier Commissions & Orders
                      </h3>
                      <p className="text-xs text-slate-500">
                        Live crafting progress and courier tracking for your handmade creations.
                      </p>
                    </div>

                    <Link
                      to="/orders"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-lilac-deep hover:underline"
                    >
                      <span>Full Tracking Screen</span>
                      <ArrowRight className="size-3.5" />
                    </Link>
                  </div>

                  {loadingOrders ? (
                    <div className="rounded-3xl border border-white/70 bg-white/95 p-12 text-center shadow-lg">
                      <div className="mx-auto size-12 rounded-2xl bg-lilac/20 text-lilac-deep flex items-center justify-center animate-spin mb-3 text-xl">
                        👑
                      </div>
                      <p className="text-sm font-bold text-slate-700">
                        Retrieving royal commissions...
                      </p>
                    </div>
                  ) : orders.length > 0 ? (
                    <div className="space-y-4">
                      {orders.map((order) => {
                        const stepIndex = getStepIndex(order.status);
                        const orderDate = new Date(order.created_at).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        });

                        return (
                          <div
                            key={order.id}
                            className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-md hover:shadow-lg transition-all"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4 mb-4">
                              <div>
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                  Order Number
                                </span>
                                <div className="font-display text-lg font-black text-slate-900">
                                  {order.order_number}
                                </div>
                                <div className="text-xs text-slate-500 mt-0.5">
                                  Placed on {orderDate}
                                </div>
                              </div>

                              <div className="text-right">
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                  Amount Total
                                </span>
                                <div className="text-lg font-black text-lilac-deep">
                                  ₹{order.amount_total?.toLocaleString("en-IN")}
                                </div>
                                <span
                                  className={`inline-block text-[11px] font-bold uppercase rounded-full px-2.5 py-0.5 mt-0.5 ${
                                    order.payment_status === "paid"
                                      ? "bg-emerald-100 text-emerald-800"
                                      : order.payment_status === "pending"
                                        ? "bg-amber-100 text-amber-800"
                                        : "bg-rose-100 text-rose-800"
                                  }`}
                                >
                                  {order.payment_status === "paid"
                                    ? "✓ Paid via Razorpay"
                                    : order.payment_status}
                                </span>
                              </div>
                            </div>

                            {/* Status Timeline Progress */}
                            <div className="mb-4 bg-slate-50 rounded-2xl p-4 border border-slate-100">
                              <div className="flex items-center justify-between text-xs font-bold text-slate-600 mb-2">
                                <span>Status: {order.status.toUpperCase()}</span>
                                <span className="text-lilac-deep">Step {stepIndex} of 4</span>
                              </div>

                              <div className="grid grid-cols-4 gap-1.5">
                                {["Placed", "Crafting", "Dispatched", "Delivered"].map(
                                  (lbl, idx) => (
                                    <div key={lbl} className="text-center">
                                      <div
                                        className={`h-2 rounded-full transition-all ${
                                          idx < stepIndex
                                            ? "bg-emerald-500"
                                            : idx === stepIndex
                                              ? "bg-lilac-deep animate-pulse"
                                              : "bg-slate-200"
                                        }`}
                                      />
                                      <span className="text-[10px] font-semibold text-slate-500 mt-1 block truncate">
                                        {lbl}
                                      </span>
                                    </div>
                                  ),
                                )}
                              </div>
                            </div>

                            {/* Items Preview */}
                            {order.order_items && order.order_items.length > 0 && (
                              <div className="space-y-2 mb-4">
                                {order.order_items.map((item) => (
                                  <div
                                    key={item.id}
                                    className="flex items-center justify-between text-xs text-slate-700 bg-slate-50/70 rounded-xl px-3 py-2"
                                  >
                                    <div className="flex items-center gap-2">
                                      <span className="font-bold text-lilac-deep">
                                        {item.quantity}x
                                      </span>
                                      <span className="font-medium">{item.product_name}</span>
                                    </div>
                                    <span className="font-bold">{item.price_text}</span>
                                  </div>
                                ))}
                              </div>
                            )}

                            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                              <span className="text-xs text-slate-400">
                                Shipped to: {order.customer_name} ({order.pincode})
                              </span>
                              <Link
                                to="/orders"
                                className="inline-flex items-center gap-1 text-xs font-bold text-lilac-deep hover:underline"
                              >
                                <span>Track Details</span>
                                <ArrowRight className="size-3.5" />
                              </Link>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="rounded-3xl border border-white/70 bg-white/95 p-10 text-center shadow-lg">
                      <div className="mx-auto size-16 rounded-3xl bg-lilac/15 text-3xl flex items-center justify-center mb-4">
                        👑
                      </div>
                      <h4 className="font-display text-lg font-bold text-slate-800">
                        No Royal Commissions Placed Yet
                      </h4>
                      <p className="mt-1.5 text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                        Every piece in our atelier is crocheted entirely by hand, stitch by stitch.
                        Discover custom keepsake dolls, eternal bouquets, and cute companions!
                      </p>
                      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                        <Link
                          to="/dolls"
                          className="clay-primary liquid-btn inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold shadow-md hover:scale-105 transition-transform"
                        >
                          <Sparkles className="size-3.5" />
                          <span>Explore Custom Dolls</span>
                        </Link>
                        <Link
                          to="/flowers"
                          className="clay inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold text-lilac-deep hover:bg-white/60 transition-colors"
                        >
                          <span>Browse Forever Flowers</span>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ============================================================ */}
              {/* TAB 3: ROYAL PERKS & ACTIVE COUPONS                          */}
              {/* ============================================================ */}
              {activeTab === "perks" && (
                <div className="space-y-6">
                  {/* Patron Privileges Banner */}
                  <div className="rounded-3xl border border-amber-200/80 bg-gradient-to-br from-amber-50 via-amber-100/40 to-orange-50 p-6 sm:p-8 shadow-lg">
                    <div className="flex items-start gap-4">
                      <div className="size-12 rounded-2xl bg-amber-300 text-amber-950 flex items-center justify-center text-2xl shadow-inner shrink-0">
                        👑
                      </div>
                      <div>
                        <span className="text-[11px] font-black uppercase tracking-wider text-amber-800">
                          Artisan VIP Privileges
                        </span>
                        <h3 className="font-display text-xl font-black text-amber-950 mt-0.5">
                          Royal Patron Benefits
                        </h3>
                        <p className="text-xs text-amber-900/80 leading-relaxed mt-1">
                          As an authenticated patron of Inventive Queen, you unlock exclusive
                          atelier services and hand-crafted assurances with every single commission.
                        </p>

                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="rounded-2xl bg-white/90 p-3 shadow-2xs border border-amber-200/60">
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                              <Sparkles className="size-4 text-amber-600" />
                              <span>100% Milk Cotton</span>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-1">
                              Ultra-soft, vibrant, durable yarn that never fades.
                            </p>
                          </div>

                          <div className="rounded-2xl bg-white/90 p-3 shadow-2xs border border-amber-200/60">
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                              <Heart className="size-4 text-rose-500" />
                              <span>Wax-Sealed Gift Card</span>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-1">
                              Complimentary hand-calligraphed note in every box.
                            </p>
                          </div>

                          <div className="rounded-2xl bg-white/90 p-3 shadow-2xs border border-amber-200/60">
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                              <Truck className="size-4 text-emerald-600" />
                              <span>Insured Shipping</span>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-1">
                              Free delivery on royal orders above ₹1,999.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Active Atelier Vouchers */}
                  <div className="rounded-3xl border border-white/70 bg-white/95 p-6 sm:p-8 shadow-xl">
                    <div className="flex items-center justify-between mb-5 border-b border-slate-100 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                          <Tag className="size-5" />
                        </div>
                        <div>
                          <h3 className="font-display text-lg font-bold text-slate-800">
                            Active Atelier Discount Vouchers
                          </h3>
                          <p className="text-xs text-slate-500">
                            Copy these codes with one click to redeem at checkout!
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {DEFAULT_COUPONS.map((coupon: Coupon) => {
                        const isCopied = copiedCode === coupon.code;

                        return (
                          <div
                            key={coupon.code}
                            className="relative overflow-hidden rounded-2xl border-2 border-dashed border-lilac/50 bg-gradient-to-br from-purple-50/40 via-white to-purple-50/20 p-4 shadow-xs flex flex-col justify-between"
                          >
                            <div className="mb-3">
                              <div className="flex items-center justify-between">
                                <span className="font-mono text-base font-black text-lilac-deep tracking-wider">
                                  {coupon.code}
                                </span>
                                <span className="rounded-full bg-lilac/20 text-lilac-deep px-2 py-0.5 text-[10px] font-black">
                                  {coupon.discountType === "percentage"
                                    ? `${coupon.discountValue}% OFF`
                                    : `₹${coupon.discountValue} OFF`}
                                </span>
                              </div>

                              <p className="text-xs text-slate-600 mt-2 line-clamp-2">
                                {coupon.description}
                              </p>

                              <div className="text-[10px] font-semibold text-slate-400 mt-2">
                                Min. order: ₹{coupon.minOrderValue.toLocaleString("en-IN")}
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => copyToClipboard(coupon.code, coupon.code)}
                              className={`w-full flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-bold transition-all cursor-pointer shadow-2xs ${
                                isCopied
                                  ? "bg-emerald-600 text-white"
                                  : "bg-lilac-deep text-white hover:bg-lilac-deep/90"
                              }`}
                            >
                              {isCopied ? (
                                <>
                                  <Check className="size-3.5" />
                                  <span>Code Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="size-3.5" />
                                  <span>Copy Voucher Code</span>
                                </>
                              )}
                            </button>
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-6 text-center">
                      <Link
                        to="/checkout"
                        className="clay-primary liquid-btn inline-flex items-center gap-2 rounded-xl px-6 py-3 text-xs font-bold shadow-md hover:scale-105 transition-transform"
                      >
                        <ShoppingBag className="size-4" />
                        <span>Proceed to Checkout & Redeem Code</span>
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* ============================================================ */}
              {/* TAB 4: PASSWORD & SECURITY CREDENTIALS                      */}
              {/* ============================================================ */}
              {activeTab === "security" && (
                <div className="space-y-6">
                  {/* Card 1: Change Password */}
                  <div className="rounded-3xl border border-white/70 bg-white/95 p-6 sm:p-8 shadow-xl">
                    <div className="flex items-center gap-3 mb-5 border-b border-slate-100 pb-4">
                      <div className="size-10 rounded-2xl bg-lilac/20 text-lilac-deep flex items-center justify-center shrink-0">
                        <Lock className="size-5" />
                      </div>
                      <div>
                        <h3 className="font-display text-lg font-bold text-slate-800">
                          Update Royal Account Password
                        </h3>
                        <p className="text-xs text-slate-500">
                          Keep your atelier commissions and personal delivery records secure.
                        </p>
                      </div>
                    </div>

                    <form onSubmit={handleUpdatePassword} className="max-w-xl space-y-4">
                      <div>
                        <label
                          htmlFor={newPasswordId}
                          className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5"
                        >
                          New Password
                        </label>
                        <div className="relative">
                          <input
                            id={newPasswordId}
                            type={showNewPassword ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Minimum 6 characters"
                            className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-4 pr-10 text-sm font-medium text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-lilac-deep focus:ring-2 focus:ring-lilac-deep/20 shadow-2xs"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                            aria-label={showNewPassword ? "Hide password" : "Show password"}
                          >
                            {showNewPassword ? (
                              <EyeOff className="size-4" />
                            ) : (
                              <Eye className="size-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor={confirmPasswordId}
                          className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5"
                        >
                          Confirm New Password
                        </label>
                        <div className="relative">
                          <input
                            id={confirmPasswordId}
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Re-type new password"
                            className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-4 pr-10 text-sm font-medium text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-lilac-deep focus:ring-2 focus:ring-lilac-deep/20 shadow-2xs"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
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
                        className="clay-primary liquid-btn inline-flex items-center gap-2 rounded-xl px-6 py-3 text-xs font-bold shadow-md hover:scale-102 transition-transform cursor-pointer disabled:opacity-50"
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
                  </div>

                  {/* Card 2: 1-Click Email Recovery Link */}
                  <div className="rounded-3xl border border-slate-200/90 bg-white/95 p-6 sm:p-8 shadow-md">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="size-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                        <Mail className="size-5" />
                      </div>
                      <div>
                        <h4 className="font-display text-base font-bold text-slate-800">
                          One-Click Password Recovery Email Link
                        </h4>
                        <p className="text-xs text-slate-500">
                          Prefer to reset your password via email? We will dispatch a secure
                          one-time cryptographic recovery link to{" "}
                          <span className="font-bold text-slate-700">{userEmail}</span>.
                        </p>
                      </div>
                    </div>

                    <div className="mt-4">
                      <button
                        type="button"
                        onClick={handleSendResetEmail}
                        disabled={sendingResetEmail || resetEmailSent}
                        className="rounded-xl border border-lilac-deep/30 bg-white py-2.5 px-5 text-xs font-bold text-lilac-deep shadow-2xs hover:bg-lilac-50 transition-all inline-flex items-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        {sendingResetEmail ? (
                          <>
                            <Loader2 className="size-4 animate-spin" />
                            <span>Dispatching Recovery Link...</span>
                          </>
                        ) : resetEmailSent ? (
                          <>
                            <CheckCircle2 className="size-4 text-emerald-600" />
                            <span>Recovery Link Dispatched to Inbox!</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="size-4" />
                            <span>Dispatch Reset Link to Email</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Card 3: Security & Session Guarantee */}
                  <div className="rounded-3xl border border-slate-200/80 bg-slate-50/80 p-6">
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-800 mb-2">
                      <ShieldCheck className="size-4 text-emerald-600" />
                      <span>Royal Account Cryptographic Security Architecture</span>
                    </div>
                    <ul className="text-xs text-slate-500 space-y-1.5 list-disc list-inside leading-relaxed">
                      <li>Protected with 256-bit encrypted authentication sessions.</li>
                      <li>
                        Row Level Security (RLS) restricts order details exclusively to your ID.
                      </li>
                      <li>
                        Razorpay payments are verified via server-side HMAC-SHA256 signatures.
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
