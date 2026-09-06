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
  MessageCircle,
  Palette,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { SiteLayout } from "@/components/site/SiteLayout";
import { useAuth } from "@/lib/auth";
import { supabase, type DbOrder, type OrderStatus } from "@/lib/supabase";
import { sanitizeText, validatePasswordStrength, validatePhone } from "@/lib/security";
import { DEFAULT_COUPONS, type Coupon } from "@/lib/cms-coupons";

import logo from "@/assets/logo.png";
import bouquetRose from "@/assets/products/bouquets/product-bouquet-rose.png";
import bearKeychain from "@/assets/products/keychains/product-yellow-bear-keychain.png";
import bunnyKeychain from "@/assets/products/keychains/product-bunny-heart-keychain.png";
import whiteBear from "@/assets/products/plushies/product-white-bear-pink-overalls.png";
import bookmark from "@/assets/products/misc/product-peacock-bookmark-real.png";

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

interface AvatarPreset {
  id: string;
  label: string;
  image: string;
  tag: string;
}

const AVATAR_PRESETS: AvatarPreset[] = [
  { id: "queen", label: "Inventive Queen", image: logo, tag: "Official Mascot" },
  { id: "bear", label: "Velvet Cuddle Bear", image: whiteBear, tag: "Plushie" },
  { id: "rose", label: "Pastel Rose Bouquet", image: bouquetRose, tag: "Bouquet" },
  { id: "bunny", label: "Bunny Heart Charm", image: bunnyKeychain, tag: "Keychain" },
  { id: "yellow-bear", label: "Pocket Bear Buddy", image: bearKeychain, tag: "Pocket Charm" },
  { id: "peacock", label: "Artisan Feather", image: bookmark, tag: "Keepsake" },
];

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

function getStatusBadge(status: OrderStatus) {
  switch (status) {
    case "pending":
      return {
        label: "⏳ Pending Confirmation",
        color: "bg-amber-100 text-amber-900 border-amber-300",
        stepColor: "bg-amber-500",
      };
    case "confirmed":
      return {
        label: "✓ Confirmed by Atelier",
        color: "bg-purple-100 text-purple-900 border-purple-300",
        stepColor: "bg-purple-600",
      };
    case "crafting":
      return {
        label: "🧶 Hand-Crafting in Progress",
        color: "bg-indigo-100 text-indigo-900 border-indigo-300",
        stepColor: "bg-indigo-600",
      };
    case "shipped":
      return {
        label: "🚚 Dispatched with Courier",
        color: "bg-blue-100 text-blue-900 border-blue-300",
        stepColor: "bg-blue-600",
      };
    case "delivered":
      return {
        label: "🎉 Delivered with Royal Love",
        color: "bg-emerald-100 text-emerald-900 border-emerald-300",
        stepColor: "bg-emerald-600",
      };
    case "cancelled":
      return {
        label: "✕ Cancelled",
        color: "bg-rose-100 text-rose-900 border-rose-300",
        stepColor: "bg-rose-500",
      };
    default:
      return {
        label: status,
        color: "bg-slate-100 text-slate-800 border-slate-300",
        stepColor: "bg-slate-500",
      };
  }
}

function ProfilePage() {
  const navigate = useNavigate();
  const { user, profile, isAdmin, loading: authLoading, refreshUserData, signOut } = useAuth();

  const [activeTab, setActiveTab] = useState<TabType>("profile");

  // Avatar state
  const [avatarId, setAvatarId] = useState<string>("queen");
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

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
  const [copiedOrderNum, setCopiedOrderNum] = useState<string | null>(null);
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
      if (meta["avatar_id"]) setAvatarId(meta["avatar_id"] as string);
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
      toast.success("Patron ID copied to clipboard!");
      setTimeout(() => setCopiedPatronId(false), 2500);
    } catch {
      toast.info(`Patron ID: ${patronId}`);
    }
  };

  const copyOrderNumber = (orderNum: string) => {
    try {
      if (navigator?.clipboard?.writeText) {
        navigator.clipboard.writeText(orderNum);
      }
      setCopiedOrderNum(orderNum);
      toast.success(`Order #${orderNum} copied!`);
      setTimeout(() => setCopiedOrderNum(null), 2500);
    } catch {
      toast.info(`Order #${orderNum}`);
    }
  };

  // Avatar selector handler
  const handleSelectAvatar = async (presetId: string) => {
    setAvatarId(presetId);
    setShowAvatarPicker(false);
    if (!user) return;

    try {
      await supabase.auth.updateUser({
        data: { avatar_id: presetId },
      });
      await refreshUserData();
      toast.success("Royal atelier avatar updated!");
    } catch (err: unknown) {
      console.error("Failed to update avatar:", err);
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
        message: "Please enter a valid 10-digit Indian mobile phone number.",
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

      // 2. Update user metadata in Supabase Auth (includes shipping address vault & avatar)
      await supabase.auth.updateUser({
        data: {
          full_name: cleanName,
          phone: cleanPhone || null,
          avatar_id: avatarId,
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
        message: "Royal profile details & delivery address vault saved successfully!",
      });
      toast.success("Profile & Delivery Address saved!");
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

  // 3. Dispatch Password Recovery Link to Email
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
          <div className="size-16 rounded-3xl bg-lilac/20 text-lilac-deep flex items-center justify-center mb-4 animate-spin text-3xl shadow-inner">
            👑
          </div>
          <h2 className="font-display text-xl font-bold text-slate-800">
            Opening Royal Patron Lounge...
          </h2>
          <p className="text-xs text-slate-500 mt-1">Connecting to your secure atelier account</p>
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

  const defaultAvatar: AvatarPreset = AVATAR_PRESETS[0] ?? {
    id: "queen",
    label: "Inventive Queen",
    image: logo,
    tag: "Official Mascot",
  };
  const activeAvatar: AvatarPreset =
    AVATAR_PRESETS.find((a) => a.id === avatarId) ?? defaultAvatar;

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

  // Password strength calculation
  const passLength = newPassword.length >= 6;
  const passHasNumber = /\d/.test(newPassword);
  const passHasLetter = /[a-zA-Z]/.test(newPassword);
  const passStrengthScore = [passLength, passHasNumber, passHasLetter].filter(Boolean).length;

  return (
    <SiteLayout>
      <div className="min-h-screen bg-gradient-to-b from-purple-50/60 via-white to-purple-50/40 py-8 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          {/* Top Royal Welcome Banner */}
          <div className="mb-6 overflow-hidden rounded-3xl border border-white/60 bg-gradient-to-r from-lilac-deep via-purple-700 to-primary p-6 text-white shadow-xl relative">
            <div className="absolute -top-12 -right-12 size-40 rounded-full bg-white/10 blur-2xl pointer-events-none" />
            <div className="absolute top-2 right-4 text-white/10 text-7xl font-black select-none pointer-events-none">
              👑
            </div>

            <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-200 mb-1">
                  <span>✨ ROYAL ATELIER PATRON PORTAL</span>
                  <span>·</span>
                  <span className="text-white/80">MEMBER ID: {patronIdShort}</span>
                </div>
                <h1 className="font-display text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5">
                  <span>Welcome, {displayName}! 👑</span>
                </h1>
                <p className="text-xs sm:text-sm text-white/85 mt-1 max-w-2xl leading-relaxed">
                  Manage your bespoke amigurumi crafting pipeline, 1-click delivery address vault,
                  exclusive discount coupons, and royal credentials.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Link
                  to="/checkout"
                  className="rounded-full bg-white/20 hover:bg-white/30 text-white border border-white/40 px-4 py-2 text-xs font-bold transition-all shadow-xs inline-flex items-center gap-1.5"
                >
                  <ShoppingBag className="size-3.5" />
                  <span>My Basket</span>
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    search={{ tab: "overview" }}
                    className="rounded-full bg-amber-400 text-amber-950 px-4 py-2 text-xs font-black shadow-md hover:bg-amber-300 transition-all inline-flex items-center gap-1.5"
                  >
                    👑 CMS Portal
                  </Link>
                )}
              </div>
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
            {/* ============================================================ */}
            {/* LEFT COLUMN: Unified Sticky Royal Patron Passport (4 Cols)   */}
            {/* ============================================================ */}
            <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-4">
              <div className="overflow-hidden rounded-3xl border border-lilac/30 bg-white shadow-xl">
                {/* Passport Card Top Banner */}
                <div className="bg-gradient-to-br from-purple-100/70 via-lilac/20 to-pink-50 p-6 border-b border-slate-100 text-center relative">
                  {/* Decorative corner tag */}
                  <div className="inline-flex items-center gap-1 rounded-full bg-amber-200 text-amber-950 px-3 py-0.5 text-[10px] font-black uppercase tracking-wider mb-3 shadow-2xs">
                    👑 ROYAL PATRON TIER
                  </div>

                  {/* Avatar Circle with Illustrated Amigurumi Mascot */}
                  <div className="relative mx-auto mb-3 size-24">
                    <div className="size-24 rounded-3xl bg-white p-1.5 shadow-md border-2 border-amber-300/80 transition-transform hover:scale-105">
                      <img
                        src={activeAvatar.image}
                        alt={activeAvatar.label}
                        className="size-full rounded-2xl object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                      className="absolute -bottom-1 -right-1 size-8 rounded-full bg-lilac-deep text-white flex items-center justify-center text-xs shadow-md border-2 border-white hover:bg-lilac-deep/90 transition-all cursor-pointer"
                      title="Change Royal Avatar"
                    >
                      <Palette className="size-3.5" />
                    </button>
                  </div>

                  {/* Avatar Picker Modal / Dropdown */}
                  {showAvatarPicker && (
                    <div className="mb-4 rounded-2xl bg-white p-3 shadow-lg border border-lilac/40 animate-in fade-in zoom-in-95 duration-200">
                      <div className="text-xs font-bold text-slate-700 mb-2">
                        Choose Your Royal Atelier Avatar
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {AVATAR_PRESETS.map((preset) => (
                          <button
                            key={preset.id}
                            type="button"
                            onClick={() => handleSelectAvatar(preset.id)}
                            className={`flex flex-col items-center p-1.5 rounded-xl border transition-all cursor-pointer ${
                              avatarId === preset.id
                                ? "border-lilac-deep bg-lilac/15 ring-2 ring-lilac-deep/30"
                                : "border-slate-200 hover:bg-slate-50"
                            }`}
                          >
                            <img
                              src={preset.image}
                              alt={preset.label}
                              className="size-10 rounded-lg object-cover"
                            />
                            <span className="text-[9px] font-bold text-slate-600 truncate mt-1 max-w-[60px]">
                              {preset.label}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <h2 className="font-display text-xl font-black text-slate-900 line-clamp-1">
                    {displayName}
                  </h2>

                  <div className="mt-1 flex flex-wrap items-center justify-center gap-1.5">
                    {isAdmin ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-300 text-amber-950 px-2.5 py-0.5 text-[11px] font-black">
                        👑 Verified Admin
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-lilac/20 text-lilac-deep px-2.5 py-0.5 text-[11px] font-bold">
                        👑 Atelier VIP
                      </span>
                    )}

                    {isEmailVerified && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 px-2 py-0.5 text-[10px] font-bold">
                        <CheckCircle2 className="size-3" /> Verified
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-500 truncate mt-2 flex items-center justify-center gap-1">
                    <Mail className="size-3 text-slate-400 shrink-0" />
                    <span className="truncate">{userEmail}</span>
                  </p>

                  {/* Patron ID with 1-click Copy */}
                  <div className="mt-3 flex items-center justify-between gap-2 rounded-2xl bg-white border border-slate-200/80 px-3 py-2 text-xs text-slate-600 shadow-2xs">
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

                  <p className="mt-2 text-[11px] text-slate-400 flex items-center justify-center gap-1">
                    <Calendar className="size-3" />
                    <span>Member since {joinedDate}</span>
                  </p>
                </div>

                {/* Atelier Quick Stats Strip */}
                <div className="grid grid-cols-3 gap-2 p-4 bg-slate-50/70 border-b border-slate-100 text-center">
                  <div className="rounded-2xl bg-white p-2.5 border border-slate-200/60 shadow-2xs">
                    <div className="text-base font-black text-slate-900">{orders.length}</div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Orders
                    </div>
                  </div>

                  <div className="rounded-2xl bg-white p-2.5 border border-slate-200/60 shadow-2xs">
                    <div className="text-base font-black text-amber-600">{activeOrdersCount}</div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      In Craft
                    </div>
                  </div>

                  <div className="rounded-2xl bg-white p-2.5 border border-slate-200/60 shadow-2xs">
                    <div className="text-base font-black text-lilac-deep">3</div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Vouchers
                    </div>
                  </div>
                </div>

                {/* Navigation Menu Buttons */}
                <div className="p-3 space-y-1.5">
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
                          Personal details & shipping address
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="size-4 opacity-60" />
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
                          Real-time crafting pipeline
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
                          Discount vouchers & privileges
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
                        <div>Password & Security</div>
                        <div
                          className={`text-[10px] font-normal ${activeTab === "security" ? "text-white/80" : "text-slate-400"}`}
                        >
                          Password change & recovery
                        </div>
                      </div>
                    </div>
                    <Lock className="size-3.5 opacity-60" />
                  </button>
                </div>

                {/* Sidebar Footer Actions */}
                <div className="p-3 border-t border-slate-100 bg-slate-50/50 space-y-2">
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
                      <span>Custom crafting inquiry? Contact Us</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* ============================================================ */}
            {/* RIGHT COLUMN: Active Tab Content Area (8 Cols)               */}
            {/* ============================================================ */}
            <div className="lg:col-span-8">
              {/* ============================================================ */}
              {/* TAB 1: PROFILE & DELIVERY ADDRESS VAULT                      */}
              {/* ============================================================ */}
              {activeTab === "profile" && (
                <form onSubmit={handleSaveProfile} className="space-y-6">
                  <div className="overflow-hidden rounded-3xl border border-white/80 bg-white/95 shadow-xl">
                    {/* Section 1: Personal Details */}
                    <div className="p-6 sm:p-8 border-b border-slate-100">
                      <div className="flex items-center gap-3 mb-5">
                        <div className="size-10 rounded-2xl bg-lilac/20 text-lilac-deep flex items-center justify-center shrink-0">
                          <User className="size-5" />
                        </div>
                        <div>
                          <h3 className="font-display text-lg font-bold text-slate-800">
                            Patron Identity Details
                          </h3>
                          <p className="text-xs text-slate-500">
                            Your royal name and phone number for parcel dispatches and order
                            coordination.
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
                              className="w-full rounded-2xl border border-slate-200 bg-slate-50/60 py-3 pl-10 pr-4 text-sm font-medium text-slate-800 placeholder-slate-400 outline-none transition-all focus:bg-white focus:border-lilac-deep focus:ring-4 focus:ring-lilac-deep/15 shadow-2xs"
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
                              className="w-full rounded-2xl border border-slate-200 bg-slate-50/60 py-3 pl-16 pr-4 text-sm font-medium text-slate-800 placeholder-slate-400 outline-none transition-all focus:bg-white focus:border-lilac-deep focus:ring-4 focus:ring-lilac-deep/15 shadow-2xs"
                            />
                          </div>
                          <p className="mt-1 text-[11px] text-slate-400">
                            Required for WhatsApp dispatch notifications and courier tracking.
                          </p>
                        </div>

                        <div className="sm:col-span-2">
                          <label
                            htmlFor={emailId}
                            className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5"
                          >
                            Account Email Address
                          </label>
                          <div className="relative">
                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                            <input
                              id={emailId}
                              type="email"
                              value={userEmail}
                              disabled
                              className="w-full rounded-2xl border border-slate-200 bg-slate-100/80 py-3 pl-10 pr-10 text-sm font-medium text-slate-500 cursor-not-allowed shadow-2xs"
                            />
                            <Lock className="absolute right-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                          </div>
                          <p className="mt-1 text-[11px] text-slate-400 flex items-center gap-1">
                            <ShieldCheck className="size-3 text-emerald-600" />
                            <span>
                              Protected by Supabase cryptographic authentication. Cannot be modified
                              directly.
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Section 2: Saved Delivery Address Vault */}
                    <div className="p-6 sm:p-8 border-b border-slate-100 bg-purple-50/20">
                      <div className="flex items-center gap-3 mb-5">
                        <div className="size-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                          <MapPin className="size-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-display text-lg font-bold text-slate-800">
                              Default Atelier Delivery Address Vault
                            </h3>
                            <span className="rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5">
                              1-Click Checkout
                            </span>
                          </div>
                          <p className="text-xs text-slate-500">
                            Save your shipping address once to auto-populate the checkout form
                            instantly.
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="sm:col-span-2">
                          <label
                            htmlFor={streetId}
                            className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5"
                          >
                            Street Address / House No. / Flat / Apartment / Landmark
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
                              className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm font-medium text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-lilac-deep focus:ring-4 focus:ring-lilac-deep/15 shadow-2xs resize-none"
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
                              placeholder="e.g. Bengaluru, Mumbai, New Delhi"
                              maxLength={80}
                              className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm font-medium text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-lilac-deep focus:ring-4 focus:ring-lilac-deep/15 shadow-2xs"
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
                            className="w-full rounded-2xl border border-slate-200 bg-white py-3 px-4 text-sm font-medium text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-lilac-deep focus:ring-4 focus:ring-lilac-deep/15 shadow-2xs"
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
                            className="w-full rounded-2xl border border-slate-200 bg-white py-3 px-4 text-sm font-medium text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-lilac-deep focus:ring-4 focus:ring-lilac-deep/15 shadow-2xs"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Section 3: Bespoke Custom Gift Note Preference */}
                    <div className="p-6 sm:p-8">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="size-10 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                          <Gift className="size-5" />
                        </div>
                        <div>
                          <h3 className="font-display text-base font-bold text-slate-800">
                            Bespoke Gift Note & Packaging Preference
                          </h3>
                          <p className="text-xs text-slate-500">
                            Default calligraphy message or crafting preferences included in your
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
                        className="w-full rounded-2xl border border-slate-200 bg-white p-3.5 text-sm font-medium text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-lilac-deep focus:ring-4 focus:ring-lilac-deep/15 shadow-2xs resize-none"
                      />
                    </div>

                    {/* Save Footer Bar */}
                    <div className="p-6 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                      <span className="text-xs text-slate-400 flex items-center gap-1.5">
                        <Sparkles className="size-3.5 text-amber-500" />
                        <span>Address vault auto-syncs with your checkout basket</span>
                      </span>

                      <button
                        type="submit"
                        disabled={savingProfile}
                        className="clay-primary liquid-btn inline-flex items-center gap-2 rounded-2xl px-8 py-3.5 text-sm font-bold shadow-lg hover:scale-102 transition-transform cursor-pointer disabled:opacity-60 w-full sm:w-auto justify-center"
                      >
                        {savingProfile ? (
                          <>
                            <Loader2 className="size-4 animate-spin" />
                            <span>Saving Changes...</span>
                          </>
                        ) : (
                          <>
                            <Save className="size-4" />
                            <span>Save Royal Profile & Address</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {/* ============================================================ */}
              {/* TAB 2: ATELIER ORDERS & TRACKING                             */}
              {/* ============================================================ */}
              {activeTab === "orders" && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h3 className="font-display text-xl font-black text-slate-900 flex items-center gap-2">
                        <span>📦 Atelier Commissions & Orders</span>
                        <span className="rounded-full bg-lilac/20 text-lilac-deep text-xs font-black px-2.5 py-0.5">
                          {orders.length} Total
                        </span>
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Live crafting progression, artisan verification, and door-to-door tracking.
                      </p>
                    </div>

                    <Link
                      to="/orders"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-lilac-deep hover:underline self-start sm:self-auto"
                    >
                      <span>Open Full Tracking Screen</span>
                      <ArrowRight className="size-3.5" />
                    </Link>
                  </div>

                  {loadingOrders ? (
                    <div className="rounded-3xl border border-white/80 bg-white/95 p-12 text-center shadow-lg">
                      <div className="mx-auto size-14 rounded-2xl bg-lilac/20 text-lilac-deep flex items-center justify-center animate-spin mb-3 text-2xl">
                        👑
                      </div>
                      <p className="text-sm font-bold text-slate-700">
                        Retrieving royal amigurumi commissions...
                      </p>
                    </div>
                  ) : orders.length > 0 ? (
                    <div className="space-y-4">
                      {orders.map((order) => {
                        const stepIndex = getStepIndex(order.status);
                        const statusConfig = getStatusBadge(order.status);
                        const orderDate = new Date(order.created_at).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        });

                        const isOrderCopied = copiedOrderNum === order.order_number;

                        return (
                          <div
                            key={order.id}
                            className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-md hover:shadow-lg transition-all"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4 mb-4">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-base font-black text-slate-900">
                                    {order.order_number}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => copyOrderNumber(order.order_number)}
                                    className="text-xs text-slate-400 hover:text-lilac-deep transition-colors cursor-pointer"
                                    title="Copy order number"
                                  >
                                    {isOrderCopied ? (
                                      <Check className="size-3.5 text-emerald-600" />
                                    ) : (
                                      <Copy className="size-3.5" />
                                    )}
                                  </button>
                                </div>
                                <div className="text-xs text-slate-400 mt-0.5">
                                  Placed on {orderDate}
                                </div>
                              </div>

                              <div className="text-right">
                                <div className="text-lg font-black text-lilac-deep">
                                  ₹{order.amount_total?.toLocaleString("en-IN")}
                                </div>
                                <span
                                  className={`inline-block text-[11px] font-bold rounded-full px-2.5 py-0.5 border ${
                                    order.payment_status === "paid"
                                      ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                      : order.payment_status === "pending"
                                        ? "bg-amber-50 text-amber-800 border-amber-200"
                                        : "bg-rose-50 text-rose-800 border-rose-200"
                                  }`}
                                >
                                  {order.payment_status === "paid"
                                    ? "✓ Paid via Razorpay"
                                    : `Payment: ${order.payment_status.toUpperCase()}`}
                                </span>
                              </div>
                            </div>

                            {/* Status Timeline Bar */}
                            <div className="mb-4 bg-slate-50/80 rounded-2xl p-4 border border-slate-100">
                              <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
                                <span
                                  className={`px-2.5 py-0.5 rounded-full border text-[11px] font-black ${statusConfig.color}`}
                                >
                                  {statusConfig.label}
                                </span>
                                <span className="text-slate-400">Step {stepIndex} of 4</span>
                              </div>

                              <div className="grid grid-cols-4 gap-2 mt-2">
                                {["Placed", "Crafting", "Dispatched", "Delivered"].map(
                                  (lbl, idx) => (
                                    <div key={lbl} className="text-center">
                                      <div
                                        className={`h-2.5 rounded-full transition-all ${
                                          idx < stepIndex
                                            ? "bg-emerald-500"
                                            : idx === stepIndex
                                              ? `${statusConfig.stepColor} animate-pulse`
                                              : "bg-slate-200"
                                        }`}
                                      />
                                      <span className="text-[10px] font-bold text-slate-500 mt-1 block truncate">
                                        {lbl}
                                      </span>
                                    </div>
                                  ),
                                )}
                              </div>
                            </div>

                            {/* Items List */}
                            {order.order_items && order.order_items.length > 0 && (
                              <div className="space-y-2 mb-4">
                                {order.order_items.map((item) => (
                                  <div
                                    key={item.id}
                                    className="flex items-center justify-between text-xs text-slate-700 bg-purple-50/30 border border-purple-100/60 rounded-2xl p-2.5"
                                  >
                                    <div className="flex items-center gap-2.5">
                                      <div className="size-8 rounded-xl bg-lilac/20 text-lilac-deep flex items-center justify-center font-black text-xs shrink-0">
                                        🧶
                                      </div>
                                      <div>
                                        <div className="font-bold text-slate-800">
                                          {item.product_name}
                                        </div>
                                        <div className="text-[11px] text-slate-400">
                                          Quantity: {item.quantity}
                                        </div>
                                      </div>
                                    </div>
                                    <span className="font-bold text-lilac-deep">
                                      {item.price_text}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Order Footer with Quick Actions */}
                            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
                              <span className="text-slate-500">
                                Delivery: {order.customer_name} ({order.pincode})
                              </span>

                              <div className="flex items-center gap-2">
                                <a
                                  href={`https://wa.me/919876543210?text=Hello%20Inventive%20Queen!%20I%20am%20inquiring%20about%20my%20order%20${order.order_number}.`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 text-xs font-bold hover:bg-emerald-100 transition-colors"
                                >
                                  <MessageCircle className="size-3.5" />
                                  <span>WhatsApp Artisan</span>
                                </a>

                                <Link
                                  to="/orders"
                                  className="inline-flex items-center gap-1 rounded-xl bg-lilac-deep text-white px-3 py-1.5 text-xs font-bold hover:bg-lilac-deep/90 transition-all shadow-xs"
                                >
                                  <span>View Receipt</span>
                                  <ArrowRight className="size-3.5" />
                                </Link>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="rounded-3xl border border-white/80 bg-white/95 p-10 text-center shadow-lg">
                      <div className="mx-auto size-16 rounded-3xl bg-lilac/15 text-3xl flex items-center justify-center mb-4 shadow-inner">
                        👑
                      </div>
                      <h4 className="font-display text-lg font-bold text-slate-800">
                        No Royal Commissions Placed Yet
                      </h4>
                      <p className="mt-1.5 text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                        Every amigurumi doll, bouquet, and plushie is handcrafted to order in pure
                        milk cotton yarn. Explore our royal catalog to begin your custom amigurumi
                        collection!
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
                  {/* Patron Privileges Hero Card */}
                  <div className="rounded-3xl border border-amber-200/80 bg-gradient-to-br from-amber-50 via-amber-100/40 to-orange-50 p-6 sm:p-8 shadow-lg">
                    <div className="flex items-start gap-4">
                      <div className="size-14 rounded-2xl bg-amber-300 text-amber-950 flex items-center justify-center text-3xl shadow-inner shrink-0">
                        👑
                      </div>
                      <div>
                        <span className="text-[11px] font-black uppercase tracking-wider text-amber-800">
                          Atelier Member Privileges
                        </span>
                        <h3 className="font-display text-xl font-black text-amber-950 mt-0.5">
                          Royal Patron Advantages
                        </h3>
                        <p className="text-xs text-amber-900/80 leading-relaxed mt-1">
                          Every authenticated patron of Inventive Queen enjoys handcrafted priority,
                          bespoke packaging, and doorstep delivery protection.
                        </p>

                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="rounded-2xl bg-white/90 p-3.5 shadow-2xs border border-amber-200/60">
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                              <Sparkles className="size-4 text-amber-600" />
                              <span>100% Milk Cotton</span>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-1">
                              Velvety soft, durable, hypoallergenic yarn that stays vibrant forever.
                            </p>
                          </div>

                          <div className="rounded-2xl bg-white/90 p-3.5 shadow-2xs border border-amber-200/60">
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                              <Heart className="size-4 text-rose-500" />
                              <span>Wax-Sealed Card</span>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-1">
                              Complimentary hand-calligraphed keepsake gift card in every parcel.
                            </p>
                          </div>

                          <div className="rounded-2xl bg-white/90 p-3.5 shadow-2xs border border-amber-200/60">
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                              <Truck className="size-4 text-emerald-600" />
                              <span>Insured Courier</span>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-1">
                              Free insured shipping nationwide on orders above ₹1,999.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Active Atelier Vouchers */}
                  <div className="rounded-3xl border border-white/80 bg-white/95 p-6 sm:p-8 shadow-xl">
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
                            Copy these codes with one click to redeem instantly at checkout!
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
                            className="relative overflow-hidden rounded-2xl border-2 border-dashed border-lilac-deep/40 bg-gradient-to-br from-purple-50/50 via-white to-purple-50/30 p-4 shadow-xs flex flex-col justify-between"
                          >
                            <div className="mb-3">
                              <div className="flex items-center justify-between">
                                <span className="font-mono text-base font-black text-lilac-deep tracking-wider">
                                  {coupon.code}
                                </span>
                                <span className="rounded-full bg-lilac/25 text-lilac-deep px-2.5 py-0.5 text-[10px] font-black">
                                  {coupon.discountType === "percentage"
                                    ? `${coupon.discountValue}% OFF`
                                    : `₹${coupon.discountValue} OFF`}
                                </span>
                              </div>

                              <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                                {coupon.description}
                              </p>

                              <div className="text-[10px] font-bold text-slate-400 mt-2">
                                Min. order: ₹{coupon.minOrderValue.toLocaleString("en-IN")}
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => copyToClipboard(coupon.code, coupon.code)}
                              className={`w-full flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-bold transition-all cursor-pointer shadow-2xs ${
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
                        className="clay-primary liquid-btn inline-flex items-center gap-2 rounded-2xl px-8 py-3.5 text-xs font-bold shadow-md hover:scale-105 transition-transform"
                      >
                        <ShoppingBag className="size-4" />
                        <span>Proceed to Checkout with Copied Code →</span>
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
                  <div className="rounded-3xl border border-white/80 bg-white/95 p-6 sm:p-8 shadow-xl">
                    <div className="flex items-center gap-3 mb-5 border-b border-slate-100 pb-4">
                      <div className="size-10 rounded-2xl bg-lilac/20 text-lilac-deep flex items-center justify-center shrink-0">
                        <Lock className="size-5" />
                      </div>
                      <div>
                        <h3 className="font-display text-lg font-bold text-slate-800">
                          Update Royal Account Password
                        </h3>
                        <p className="text-xs text-slate-500">
                          Secure your personal atelier credentials and saved delivery address vault.
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
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50/60 py-3 pl-4 pr-10 text-sm font-medium text-slate-800 placeholder-slate-400 outline-none transition-all focus:bg-white focus:border-lilac-deep focus:ring-4 focus:ring-lilac-deep/15 shadow-2xs"
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

                        {/* Real-time Password Strength Meter */}
                        {newPassword.length > 0 && (
                          <div className="mt-2.5 bg-slate-50 p-3 rounded-xl border border-slate-100">
                            <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                              <span className="text-slate-500">Password Strength:</span>
                              <span
                                className={
                                  passStrengthScore === 3
                                    ? "text-emerald-600"
                                    : passStrengthScore === 2
                                      ? "text-amber-600"
                                      : "text-rose-600"
                                }
                              >
                                {passStrengthScore === 3
                                  ? "Strong Royal Password"
                                  : passStrengthScore === 2
                                    ? "Moderate"
                                    : "Too Weak"}
                              </span>
                            </div>

                            <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                              <div
                                className={`h-full transition-all duration-300 ${
                                  passStrengthScore === 3
                                    ? "w-full bg-emerald-500"
                                    : passStrengthScore === 2
                                      ? "w-2/3 bg-amber-500"
                                      : "w-1/3 bg-rose-500"
                                }`}
                              />
                            </div>

                            <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
                              <span
                                className={`inline-flex items-center gap-1 ${
                                  passLength ? "text-emerald-600 font-bold" : "text-slate-400"
                                }`}
                              >
                                {passLength ? "✓" : "○"} 6+ characters
                              </span>
                              <span
                                className={`inline-flex items-center gap-1 ${
                                  passHasLetter ? "text-emerald-600 font-bold" : "text-slate-400"
                                }`}
                              >
                                {passHasLetter ? "✓" : "○"} Letters
                              </span>
                              <span
                                className={`inline-flex items-center gap-1 ${
                                  passHasNumber ? "text-emerald-600 font-bold" : "text-slate-400"
                                }`}
                              >
                                {passHasNumber ? "✓" : "○"} Numbers
                              </span>
                            </div>
                          </div>
                        )}
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
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50/60 py-3 pl-4 pr-10 text-sm font-medium text-slate-800 placeholder-slate-400 outline-none transition-all focus:bg-white focus:border-lilac-deep focus:ring-4 focus:ring-lilac-deep/15 shadow-2xs"
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
                        className="clay-primary liquid-btn inline-flex items-center gap-2 rounded-2xl px-7 py-3 text-xs font-bold shadow-md hover:scale-102 transition-transform cursor-pointer disabled:opacity-50"
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
                        className="rounded-2xl border border-lilac-deep/30 bg-white py-3 px-6 text-xs font-bold text-lilac-deep shadow-2xs hover:bg-lilac-50 transition-all inline-flex items-center gap-2 cursor-pointer disabled:opacity-50"
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
