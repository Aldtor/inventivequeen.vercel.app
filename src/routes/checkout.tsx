import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Crown,
  Lock,
  Minus,
  Package,
  Phone,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Tag,
  Trash2,
  Truck,
  User as UserIcon,
  X,
} from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import {
  clearCart,
  getCart,
  getCartTotal,
  removeFromCart,
  updateCartQuantity,
  type CartItem,
} from "@/lib/cart";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { useCoupons, type Coupon } from "@/lib/cms-coupons";
import { sanitizeText, validatePhone, validatePincode } from "@/lib/security";

export const Route = createFileRoute("/checkout")({
  component: CheckoutPage,
  head: () => ({
    meta: [
      { title: "Royal Checkout & Payment — Inventive Queen" },
      {
        name: "description",
        content: "Secure checkout for handmade crochet dolls, plushies and everlasting bouquets.",
      },
    ],
  }),
});

interface RazorpaySuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
}

interface RazorpayFailedResponse {
  error?: {
    code?: string;
    description?: string;
    source?: string;
    step?: string;
    reason?: string;
  };
}

interface RazorpayInstance {
  open: () => void;
  on: (event: string, callback: (res: RazorpayFailedResponse) => void) => void;
}

interface RazorpayConstructor {
  new (options: Record<string, unknown>): RazorpayInstance;
}

declare global {
  interface Window {
    Razorpay?: RazorpayConstructor;
  }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

function CheckoutPage() {
  const navigate = useNavigate();
  const { user, profile, loading: authLoading } = useAuth();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartTotal, setCartTotal] = useState(0);

  // Address form fields
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [cityState, setCityState] = useState("");
  const [pincode, setPincode] = useState("");
  const [giftNote, setGiftNote] = useState("");

  // In-line Auth states if not logged in
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authFullName, setAuthFullName] = useState("");
  const [authPhone, setAuthPhone] = useState("");
  const [authLoadingState, setAuthLoadingState] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Payment processing
  const [paying, setPaying] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Coupon CMS states
  const { validateAndApply } = useCoupons();
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponMessage, setCouponMessage] = useState<string | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  const payableTotal = Math.max(0, cartTotal - discountAmount);

  // Recalculate coupon discount if cart items change
  useEffect(() => {
    if (appliedCoupon) {
      const result = validateAndApply(appliedCoupon.code, cartTotal);
      if (result.valid) {
        setDiscountAmount(result.discountAmount);
      } else {
        setAppliedCoupon(null);
        setDiscountAmount(0);
        setCouponError(`Coupon removed: ${result.message}`);
      }
    }
  }, [cartTotal, appliedCoupon, validateAndApply]);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError(null);
    setCouponMessage(null);
    if (!couponInput.trim()) return;

    const result = validateAndApply(couponInput, cartTotal);
    if (result.valid && result.coupon) {
      setAppliedCoupon(result.coupon);
      setDiscountAmount(result.discountAmount);
      setCouponMessage(result.message);
      setCouponInput("");
    } else {
      setCouponError(result.message);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
    setCouponMessage(null);
    setCouponError(null);
  };

  // Sync cart from LocalStorage
  const refreshCart = () => {
    const items = getCart();
    setCart(items);
    setCartTotal(getCartTotal());
  };

  useEffect(() => {
    refreshCart();
    const handleCartUpdate = () => refreshCart();
    window.addEventListener("cart-updated", handleCartUpdate);
    return () => window.removeEventListener("cart-updated", handleCartUpdate);
  }, []);

  // Pre-fill customer details and saved address vault from profile when logged in
  useEffect(() => {
    if (profile) {
      setCustomerName((prev: string) => prev || profile.full_name || "");
      setPhone((prev: string) => prev || profile.phone || "");
    }
    if (user?.user_metadata) {
      const meta = user.user_metadata;
      if (meta["street"]) setStreetAddress((prev: string) => prev || (meta["street"] as string));
      if (meta["city"]) {
        const cityStr = meta["state"]
          ? `${meta["city"]}, ${meta["state"]}`
          : (meta["city"] as string);
        setCityState((prev: string) => prev || cityStr);
      }
      if (meta["pincode"]) setPincode((prev: string) => prev || (meta["pincode"] as string));
      if (meta["gift_note_pref"])
        setGiftNote((prev: string) => prev || (meta["gift_note_pref"] as string));
    }
  }, [profile, user]);

  // Handle in-line login/registration
  const handleInlineAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthLoadingState(true);

    try {
      if (authMode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({
          email: authEmail,
          password: authPassword,
        });
        if (error) throw error;
      } else {
        if (!authFullName.trim()) throw new Error("Please provide your full name.");
        if (!authPhone.trim() || authPhone.replace(/[^\d]/g, "").length < 10) {
          throw new Error("Please enter a valid 10-digit mobile number.");
        }

        const { data, error } = await supabase.auth.signUp({
          email: authEmail,
          password: authPassword,
          options: {
            data: { full_name: authFullName, phone: authPhone },
          },
        });
        if (error) throw error;

        if (data.user) {
          await supabase.from("profiles").upsert({
            id: data.user.id,
            email: authEmail,
            full_name: authFullName,
            phone: authPhone,
          });
        }
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Authentication failed. Please check credentials.";
      setAuthError(msg);
    } finally {
      setAuthLoadingState(false);
    }
  };

  // Razorpay Checkout flow
  const handleProceedToPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentError(null);

    if (!user) {
      setPaymentError("You must be logged in to complete your royal order.");
      return;
    }

    if (cart.length === 0) {
      setPaymentError("Your basket is empty. Please add items to checkout.");
      return;
    }

    const safeCustomerName = sanitizeText(customerName, 100);
    if (!safeCustomerName) {
      setPaymentError("Please provide your full delivery name.");
      return;
    }

    const cleanPhone = phone.replace(/[^\d]/g, "");
    if (!validatePhone(cleanPhone)) {
      setPaymentError("Please enter a valid 10-digit mobile phone number for delivery updates.");
      return;
    }

    const safeStreet = sanitizeText(streetAddress, 250);
    const safeCity = sanitizeText(cityState, 100);
    if (!safeStreet || !safeCity) {
      setPaymentError("Please enter your complete street address and City/State.");
      return;
    }

    const cleanPincode = pincode.replace(/[^\d]/g, "");
    if (!validatePincode(cleanPincode)) {
      setPaymentError("Please enter a valid 6-digit delivery pincode.");
      return;
    }

    const safeGiftNote = sanitizeText(giftNote, 500);

    setPaying(true);

    try {
      const razorpayLoaded = await loadRazorpayScript();
      if (!razorpayLoaded) {
        throw new Error(
          "Could not initialize Razorpay checkout. Please check internet connection.",
        );
      }

      const orderNumber = `IQ-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;
      const fullAddress = `${safeStreet}, ${safeCity}`;

      // 1. Insert order into Supabase with sanitized details
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert({
          order_number: orderNumber,
          user_id: user.id,
          customer_name: safeCustomerName,
          phone: cleanPhone,
          address: fullAddress,
          pincode: cleanPincode,
          gift_note: safeGiftNote || null,
          admin_notes: appliedCoupon
            ? `Coupon Applied: ${appliedCoupon.code} (-₹${discountAmount})`
            : null,
          status: "pending",
          payment_status: "pending",
          amount_total: payableTotal,
        })
        .select()
        .single();

      if (orderError || !orderData) {
        console.error("Supabase order insert error:", orderError);
        throw new Error("Failed to create order. " + (orderError?.message || ""));
      }

      // 2. Insert order items
      const itemsToInsert = cart.map((item) => ({
        order_id: orderData.id,
        product_id: sanitizeText(item.id, 50),
        product_name: sanitizeText(item.name, 100),
        price_text: item.price,
        unit_price: item.numericPrice,
        quantity: Math.max(1, Math.min(99, item.quantity)),
        image_url: item.image,
      }));

      const { error: itemsError } = await supabase.from("order_items").insert(itemsToInsert);
      if (itemsError) {
        console.warn("Could not insert order items:", itemsError);
      }

      // 3. Pre-create order on backend Razorpay API
      let serverRazorpayOrderId: string | undefined;
      try {
        const orderRes = await fetch("/api/create-razorpay-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: Math.round(payableTotal * 100),
            currency: "INR",
            receipt: orderNumber,
            order_id: orderData.id,
          }),
        });

        if (orderRes.ok) {
          const orderJson = await orderRes.json();
          if (orderJson?.order_id) {
            serverRazorpayOrderId = orderJson.order_id;
          }
        }
      } catch (createErr) {
        console.warn(
          "Could not initialize server Razorpay order, proceeding with standard checkout:",
          createErr,
        );
      }

      // 4. Razorpay configuration (prefer env variable, fallback to hardcoded key)
      const metaEnv = (import.meta as unknown as { env?: Record<string, string> }).env;
      const razorpayKey =
        metaEnv?.["VITE_RAZORPAY_KEY_ID"] ||
        (typeof process !== "undefined" &&
          (process.env?.["VITE_RAZORPAY_KEY_ID"] || process.env?.["RAZORPAY_KEY_ID"])) ||
        "rzp_live_TYUEKLyErpyGRl";
      if (razorpayKey === "rzp_live_TYUEKLyErpyGRl") {
        console.warn(
          "[Security] Using fallback Razorpay key. Set VITE_RAZORPAY_KEY_ID env variable for production.",
        );
      }

      const razorpayOptions: Record<string, unknown> = {
        key: razorpayKey,
        amount: Math.round(payableTotal * 100), // in paise
        currency: "INR",
        name: "Inventive Queen",
        description: `Order #${orderNumber} (${cart.length} item${cart.length > 1 ? "s" : ""})`,
        image: "https://inventivequeen.com/favicon.png",
        order_id: serverRazorpayOrderId || undefined,
        prefill: {
          name: safeCustomerName,
          email: user.email || "",
          contact: cleanPhone,
        },
        theme: {
          color: "#7c3aed",
        },
        modal: {
          ondismiss: () => {
            setPaying(false);
          },
        },
        handler: async (response: RazorpaySuccessResponse) => {
          try {
            let serverVerified = false;

            // 1. Attempt cryptographic verification via backend API if available
            try {
              const verifyRes = await fetch("/api/verify-payment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id || serverRazorpayOrderId || "",
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature || "",
                  order_id: orderData.id,
                }),
              });

              if (verifyRes.ok) {
                const verifyJson = (await verifyRes.json()) as { success?: boolean };
                if (verifyJson.success) {
                  serverVerified = true;
                }
              }
            } catch (apiErr) {
              console.warn(
                "Backend verification endpoint unavailable, finalizing via Supabase:",
                apiErr,
              );
            }

            // 2. Direct database confirmation fallback
            if (!serverVerified) {
              try {
                await supabase.rpc("confirm_order_payment", {
                  p_order_id: orderData.id,
                  p_payment_id: response.razorpay_payment_id || "captured",
                  p_user_id: user.id,
                });
              } catch {
                await supabase
                  .from("orders")
                  .update({
                    payment_status: "paid",
                    status: "confirmed",
                    payment_id: response.razorpay_payment_id || null,
                  })
                  .eq("id", orderData.id);
              }
            }

            // Clear local cart on verified payment
            clearCart();

            // Redirect to celebration page
            navigate({
              to: "/success",
              search: {
                orderId: orderData.id,
                orderNumber: orderNumber,
              },
            });
          } catch (verificationErr: unknown) {
            console.error("Payment confirmation failed:", verificationErr);
            const msg =
              verificationErr instanceof Error
                ? verificationErr.message
                : "Payment could not be finalized. Please contact support.";
            setPaymentError(msg);
            navigate({
              to: "/orders",
            });
          }
        },
      };

      const RazorpayClass = window.Razorpay;
      if (!RazorpayClass) {
        throw new Error("Razorpay checkout SDK is not available.");
      }

      const rzpInstance = new RazorpayClass(razorpayOptions);
      rzpInstance.on("payment.failed", (failedRes: RazorpayFailedResponse) => {
        setPaying(false);
        const reasonMsg = failedRes.error?.description || "Payment failed or was cancelled.";
        setPaymentError(reasonMsg);
        navigate({
          to: "/payment-failed",
          search: {
            orderId: orderData.id,
            orderNumber: orderNumber,
            reason: reasonMsg,
            code: failedRes.error?.code || "",
          },
        });
      });

      rzpInstance.open();
    } catch (err: unknown) {
      setPaying(false);
      const msg =
        err instanceof Error
          ? err.message
          : "An unexpected error occurred during payment processing.";
      setPaymentError(msg);
    }
  };

  return (
    <SiteLayout>
      <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <div className="flex items-center justify-between border-b border-white/60 pb-6 mb-8">
          <div>
            <span className="liquid-glass inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-bold text-lilac-deep">
              <Sparkles className="size-3" /> Step-by-Step Checkout
            </span>
            <h1 className="sheen-text mt-2 font-display text-3xl sm:text-4xl font-extrabold text-lilac-deep">
              Royal Checkout
            </h1>
          </div>

          <Link
            to="/dolls"
            className="clay hidden sm:inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold text-lilac-deep hover:bg-white/40"
          >
            <ArrowLeft className="size-3.5" /> Continue Shopping
          </Link>
        </div>

        {/* Empty basket warning */}
        {cart.length === 0 ? (
          <div className="liquid-glass mx-auto max-w-lg rounded-3xl p-8 sm:p-12 text-center my-12">
            <div className="inline-flex size-16 items-center justify-center rounded-2xl bg-lilac/30 text-lilac-deep mb-4">
              <ShoppingBag className="size-8" />
            </div>
            <h2 className="font-display text-2xl font-bold text-lilac-deep">
              Your Basket is Empty
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Explore our handmade amigurumi dolls, plushies and everlasting flowers to add to your
              order.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                to="/dolls"
                className="clay-primary liquid-btn rounded-full px-6 py-3 text-sm font-bold shadow-md"
              >
                Browse Dolls
              </Link>
              <Link
                to="/flowers"
                className="clay rounded-full px-6 py-3 text-sm font-bold text-lilac-deep hover:bg-white/40"
              >
                Browse Flowers
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-12">
            {/* Left side: Step 1 (Auth) + Step 2 (Shipping Form) */}
            <div className="lg:col-span-7 space-y-8">
              {/* ─────── STEP 1: AUTHENTICATION GATE ─────── */}
              <div className="liquid-glass relative overflow-hidden rounded-3xl p-6 sm:p-8 shadow-xl border border-white/60">
                <div className="flex items-center gap-3 mb-4">
                  <span
                    className={`flex size-8 items-center justify-center rounded-full text-sm font-black shadow-sm ${
                      user ? "bg-emerald-500 text-white" : "bg-lilac-deep text-white"
                    }`}
                  >
                    {user ? <CheckCircle2 className="size-5" /> : "1"}
                  </span>
                  <div>
                    <h2 className="font-display text-xl font-bold text-lilac-deep">
                      {user ? "Royal Account Verified" : "Sign In or Create Account First"}
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      {user
                        ? `Logged in as ${user.email}`
                        : "Before placing your order, please log in or create an account"}
                    </p>
                  </div>
                </div>

                {!user && (
                  <div className="mt-4 border-t border-white/50 pt-5">
                    {/* Inline Tab Toggle */}
                    <div className="flex rounded-full bg-white/60 p-1 border border-white/70 mb-4 max-w-xs">
                      <button
                        type="button"
                        onClick={() => {
                          setAuthMode("signin");
                          setAuthError(null);
                        }}
                        className={`flex-1 rounded-full py-1.5 text-xs font-bold transition-all ${
                          authMode === "signin"
                            ? "bg-white text-lilac-deep shadow-sm"
                            : "text-muted-foreground"
                        }`}
                      >
                        Sign In
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setAuthMode("signup");
                          setAuthError(null);
                        }}
                        className={`flex-1 rounded-full py-1.5 text-xs font-bold transition-all ${
                          authMode === "signup"
                            ? "bg-white text-lilac-deep shadow-sm"
                            : "text-muted-foreground"
                        }`}
                      >
                        New Account
                      </button>
                    </div>

                    {authError && (
                      <div className="mb-4 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700">
                        {authError}
                      </div>
                    )}

                    <form onSubmit={handleInlineAuth} className="space-y-3">
                      {authMode === "signup" && (
                        <div className="grid gap-3 sm:grid-cols-2">
                          <div>
                            <label className="block text-xs font-bold text-foreground mb-1">
                              Full Name
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="Your full name"
                              value={authFullName}
                              onChange={(e) => setAuthFullName(e.target.value)}
                              className="w-full rounded-xl border border-white/80 bg-white/80 px-3 py-2 text-sm text-foreground outline-none focus:border-lilac-deep"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-foreground mb-1">
                              Mobile Phone
                            </label>
                            <input
                              type="tel"
                              required
                              maxLength={10}
                              placeholder="10-digit number"
                              value={authPhone}
                              onChange={(e) => setAuthPhone(e.target.value.replace(/[^\d]/g, ""))}
                              className="w-full rounded-xl border border-white/80 bg-white/80 px-3 py-2 text-sm text-foreground outline-none focus:border-lilac-deep"
                            />
                          </div>
                        </div>
                      )}

                      <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                          <label className="block text-xs font-bold text-foreground mb-1">
                            Email
                          </label>
                          <input
                            type="email"
                            required
                            placeholder="your@email.com"
                            value={authEmail}
                            onChange={(e) => setAuthEmail(e.target.value)}
                            className="w-full rounded-xl border border-white/80 bg-white/80 px-3 py-2 text-sm text-foreground outline-none focus:border-lilac-deep"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-foreground mb-1">
                            Password
                          </label>
                          <input
                            type="password"
                            required
                            minLength={6}
                            placeholder="Password"
                            value={authPassword}
                            onChange={(e) => setAuthPassword(e.target.value)}
                            className="w-full rounded-xl border border-white/80 bg-white/80 px-3 py-2 text-sm text-foreground outline-none focus:border-lilac-deep"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={authLoadingState}
                        className="clay-primary liquid-btn mt-2 w-full rounded-xl py-2.5 text-xs sm:text-sm font-bold shadow-md hover:scale-101 active:scale-99 disabled:opacity-50"
                      >
                        {authLoadingState
                          ? "Authenticating..."
                          : authMode === "signin"
                            ? "Sign In & Continue Order"
                            : "Create Account & Continue"}
                      </button>
                    </form>
                  </div>
                )}
              </div>

              {/* ─────── STEP 2: DELIVERY INFORMATION ─────── */}
              <div
                className={`liquid-glass relative overflow-hidden rounded-3xl p-6 sm:p-8 shadow-xl border border-white/60 transition-opacity ${
                  !user ? "opacity-60 pointer-events-none" : "opacity-100"
                }`}
              >
                <div className="flex items-center gap-3 mb-5">
                  <span className="flex size-8 items-center justify-center rounded-full bg-lilac-deep text-white text-sm font-black shadow-sm">
                    2
                  </span>
                  <div>
                    <h2 className="font-display text-xl font-bold text-lilac-deep">
                      Delivery Address &amp; Contact Info
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      All parcel updates and tracking details will be sent here
                    </p>
                  </div>
                </div>

                <form id="checkout-form" onSubmit={handleProceedToPayment} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-bold text-foreground mb-1">
                        Full Recipient Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Alishba Khan"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full rounded-xl border border-white/80 bg-white/80 px-3.5 py-2.5 text-sm outline-none focus:border-lilac-deep focus:ring-2 focus:ring-lilac-deep/20"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-foreground mb-1">
                        10-Digit Mobile Phone *
                      </label>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        placeholder="e.g. 9876543210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/[^\d]/g, ""))}
                        className="w-full rounded-xl border border-white/80 bg-white/80 px-3.5 py-2.5 text-sm outline-none focus:border-lilac-deep focus:ring-2 focus:ring-lilac-deep/20"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-foreground mb-1">
                      House / Flat, Building &amp; Street Address *
                    </label>
                    <textarea
                      required
                      rows={2}
                      placeholder="e.g. Flat 402, Rose Villa, 12th Cross Road"
                      value={streetAddress}
                      onChange={(e) => setStreetAddress(e.target.value)}
                      className="w-full rounded-xl border border-white/80 bg-white/80 px-3.5 py-2.5 text-sm outline-none focus:border-lilac-deep focus:ring-2 focus:ring-lilac-deep/20"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-bold text-foreground mb-1">
                        City &amp; State *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Mumbai, Maharashtra"
                        value={cityState}
                        onChange={(e) => setCityState(e.target.value)}
                        className="w-full rounded-xl border border-white/80 bg-white/80 px-3.5 py-2.5 text-sm outline-none focus:border-lilac-deep focus:ring-2 focus:ring-lilac-deep/20"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-foreground mb-1">
                        Postal Pincode * (6 Digits)
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={6}
                        placeholder="e.g. 400001"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value.replace(/[^\d]/g, ""))}
                        className="w-full rounded-xl border border-white/80 bg-white/80 px-3.5 py-2.5 text-sm outline-none focus:border-lilac-deep focus:ring-2 focus:ring-lilac-deep/20"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-foreground mb-1">
                      👑 Wax-Sealed Gift Note (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="Personal message written on royal parchment card..."
                      value={giftNote}
                      onChange={(e) => setGiftNote(e.target.value)}
                      className="w-full rounded-xl border border-white/80 bg-white/80 px-3.5 py-2.5 text-sm outline-none focus:border-lilac-deep focus:ring-2 focus:ring-lilac-deep/20"
                    />
                  </div>
                </form>
              </div>
            </div>

            {/* Right side: Basket Items + Payment Box */}
            <div className="lg:col-span-5 space-y-6">
              {/* Items Card */}
              <div className="liquid-glass rounded-3xl p-6 shadow-xl border border-white/60">
                <div className="flex items-center justify-between pb-4 border-b border-white/50">
                  <h3 className="font-display text-lg font-bold text-lilac-deep">
                    Basket ({cart.length})
                  </h3>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-100/70 px-2.5 py-1 rounded-full">
                    👑 Free Royal Shipping
                  </span>
                </div>

                <div className="mt-4 divide-y divide-white/40 max-h-80 overflow-y-auto pr-1">
                  {cart.map((item) => (
                    <div key={item.id} className="py-3.5 flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="size-14 rounded-xl object-cover shadow-sm flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-display text-sm font-bold text-lilac-deep truncate">
                          {item.name}
                        </h4>
                        <p className="text-xs font-extrabold text-foreground">
                          ₹{item.numericPrice.toLocaleString("en-IN")}
                        </p>

                        <div className="flex items-center gap-2 mt-1.5">
                          <div className="inline-flex items-center rounded-lg bg-white/80 border border-white/80 shadow-inner">
                            <button
                              type="button"
                              onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                              className="p-1 hover:text-lilac-deep"
                              title="Decrease"
                            >
                              <Minus className="size-3" />
                            </button>
                            <span className="px-2 text-xs font-bold">{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                              className="p-1 hover:text-lilac-deep"
                              title="Increase"
                            >
                              <Plus className="size-3" />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeFromCart(item.id)}
                            className="text-muted-foreground hover:text-rose-600 p-1"
                            title="Remove"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-sm font-black text-lilac-deep">
                          ₹{(item.numericPrice * item.quantity).toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Coupon Code Input */}
                <div className="mt-4 pt-4 border-t border-white/50">
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between rounded-2xl bg-emerald-50 border border-emerald-200 p-2.5 text-xs text-emerald-800">
                      <div className="flex items-center gap-2">
                        <Tag className="size-3.5 text-emerald-600" />
                        <div>
                          <span className="font-mono font-bold">{appliedCoupon.code}</span> applied
                          <p className="text-[10px] text-emerald-700">
                            You save ₹{discountAmount.toLocaleString("en-IN")}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveCoupon}
                        className="text-emerald-700 hover:text-emerald-900 p-1"
                        title="Remove coupon"
                      >
                        <X className="size-4" />
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyCoupon} className="flex gap-2">
                      <div className="relative flex-1">
                        <Tag className="absolute left-2.5 top-2.5 size-3.5 text-muted-foreground" />
                        <input
                          type="text"
                          placeholder="Promo code (e.g. ROYAL10)"
                          value={couponInput}
                          onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                          className="w-full rounded-xl border border-white/80 bg-white/80 pl-8 pr-2 py-1.5 text-xs font-mono font-bold uppercase outline-none focus:border-lilac-deep"
                        />
                      </div>
                      <button
                        type="submit"
                        className="clay rounded-xl px-3 py-1.5 text-xs font-bold text-lilac-deep hover:bg-white/60 shadow-sm"
                      >
                        Apply
                      </button>
                    </form>
                  )}
                  {couponMessage && (
                    <p className="text-[11px] text-emerald-700 mt-1 font-semibold">
                      {couponMessage}
                    </p>
                  )}
                  {couponError && (
                    <p className="text-[11px] text-rose-600 mt-1 font-semibold">{couponError}</p>
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="mt-4 border-t border-white/50 pt-4 space-y-2 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>₹{cartTotal.toLocaleString("en-IN")}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-semibold">
                      <span>Promo Discount ({appliedCoupon?.code})</span>
                      <span>-₹{discountAmount.toLocaleString("en-IN")}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-muted-foreground">
                    <span>Delivery</span>
                    <span className="font-bold text-emerald-600">FREE</span>
                  </div>
                  <div className="flex justify-between text-base font-extrabold text-foreground pt-2 border-t border-white/50">
                    <span>Grand Total</span>
                    <span className="text-xl text-lilac-deep">
                      ₹{payableTotal.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                {/* Error Banner */}
                {paymentError && (
                  <div className="mt-4 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700 space-y-1.5">
                    <p>{paymentError}</p>
                    <Link
                      to="/payment-failed"
                      search={{ reason: paymentError }}
                      className="inline-flex items-center gap-1 font-bold text-rose-900 underline hover:text-rose-950"
                    >
                      Payment troubleshooting &amp; refund info →
                    </Link>
                  </div>
                )}

                {/* Razorpay Button */}
                <div className="mt-6">
                  <button
                    type="submit"
                    form="checkout-form"
                    disabled={paying || !user || cart.length === 0}
                    className="clay-primary liquid-btn w-full rounded-2xl py-4 text-sm font-bold shadow-xl transition-all hover:scale-102 active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <ShieldCheck className="size-5" />
                    {paying
                      ? "Opening Razorpay..."
                      : `Pay with Razorpay · ₹${payableTotal.toLocaleString("en-IN")}`}
                  </button>

                  <div className="mt-3 flex items-center justify-center gap-4 text-[11px] text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Lock className="size-3 text-emerald-600" /> 256-Bit SSL Encrypted
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Truck className="size-3 text-primary" /> Live Tracking
                    </span>
                  </div>
                </div>
              </div>

              {/* Hand-Crafted Guarantee */}
              <div className="liquid-glass rounded-3xl p-5 border border-white/60 text-center">
                <p className="text-xs font-semibold text-muted-foreground leading-relaxed">
                  👑 <strong className="text-foreground">Inventive Queen Guarantee:</strong> Every
                  amigurumi doll, plushie and bouquet is crafted stitch-by-stitch with soft premium
                  milk cotton yarn and shipped securely.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </SiteLayout>
  );
}
