import { useState, useMemo, useRef, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useProducts } from "@/lib/cms-products";
import { clearCart, getCartItems, getCartTotal, parsePrice, type CartItem, getGiftWrapOption, GIFT_WRAP_PRICE } from "@/lib/cart";
import { Heart, Package, Clock, Shield, Gift, Lock, Truck, ChevronLeft, Check, Sparkles, Crown, ShieldCheck, UserCheck, Eye, EyeOff, KeyRound, Mail, Phone, MapPin } from "lucide-react";
import { FadeIn } from "@/components/motion/FadeIn";
import { useAuth } from "@/lib/auth";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import { toast } from "sonner";
import logo from "@/assets/logo.png";

const RAZORPAY_SCRIPT_URL = "https://checkout.razorpay.com/v1/checkout.js";
const razorpayKeyId = import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_live_TYUEKLyErpyGRl";

const steps = [
  { label: "Royal Account", icon: Lock },
  { label: "Delivery Details", icon: Package },
  { label: "Razorpay Checkout", icon: Sparkles },
];

const trustItems = [
  { icon: Heart, label: "100% Handcrafted" },
  { icon: Clock, label: "Turnaround: 3–5 Days" },
  { icon: Shield, label: "Razorpay SSL Protected" },
  { icon: Gift, label: "Wax-Sealed Gift Box" },
];

const timelineSteps = [
  { label: "Order Placed", icon: Check, active: true },
  { label: "Atelier Stitching", icon: Heart, active: false },
  { label: "Wax Seal Packed", icon: Gift, active: false },
  { label: "Express Dispatch", icon: Truck, active: false },
];

interface RazorpayPaymentResponse {
  razorpay_payment_id: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
}

interface RazorpayCreateOrderResponse {
  order_id: string;
  amount: number;
  currency: string;
}

interface RazorpayCheckoutOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  image?: string;
  order_id?: string;
  prefill: {
    name: string;
    contact: string;
    email?: string;
  };
  notes: Record<string, string>;
  theme: {
    color: string;
  };
  modal: {
    ondismiss: () => void;
  };
  handler: (response: RazorpayPaymentResponse) => void;
}

interface RazorpayFailureResponse {
  error?: {
    code?: string;
    description?: string;
    reason?: string;
  };
}

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayCheckoutOptions) => {
      open: () => void;
      on: (eventName: "payment.failed", callback: (response: RazorpayFailureResponse) => void) => void;
    };
  }
}

function loadRazorpayCheckout() {
  return new Promise<boolean>((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const existingScript = document.querySelector<HTMLScriptElement>(
      `script[src="${RAZORPAY_SCRIPT_URL}"]`
    );

    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(true), { once: true });
      existingScript.addEventListener("error", () => resolve(false), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = RAZORPAY_SCRIPT_URL;
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

async function postJson<T>(url: string, body: unknown): Promise<T> {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error ?? "Request failed. Please try again.");
  }

  return data as T;
}

export default function CheckoutPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { user, profile, loading: authLoading, refreshUserData } = useAuth();
  const { products } = useProducts();
  const productId = params.get("product");
  const selectedColor = params.get("color");
  const selectedFlowers = params.get("flowers");
  const customChanges = params.get("custom");
  const customPrice = params.get("price");
  const isCartCheckout = params.get("cart") === "1" || !productId;

  const product = products.find((p) => p.id === productId);
  const cartItems = useMemo(() => (isCartCheckout ? getCartItems() : []), [isCartCheckout]);
  const giftWrap = useMemo(() => getGiftWrapOption(), []);

  const checkoutItems = useMemo<CartItem[]>(() => {
    if (isCartCheckout) return cartItems;
    if (!product) return [];

    const displayPrice = customPrice ? `₹${Number(customPrice).toLocaleString("en-IN")}` : product.price;

    return [
      {
        id: `${product.id}|direct`,
        productId: product.id,
        name: product.name,
        price: displayPrice,
        image: product.images[0],
        quantity: 1,
        color: selectedColor ?? undefined,
        flowers: selectedFlowers ? selectedFlowers.split(",").filter(Boolean) : undefined,
        custom: customChanges ?? undefined,
      },
    ];
  }, [cartItems, customChanges, isCartCheckout, product, selectedColor, selectedFlowers, customPrice]);

  const rawItemsTotal = useMemo(() => getCartTotal(checkoutItems), [checkoutItems]);
  const giftWrapTotal = (giftWrap.enabled && isCartCheckout) ? GIFT_WRAP_PRICE : 0;
  const shippingFee = rawItemsTotal >= 999 || rawItemsTotal === 0 ? 0 : 99;
  const orderTotal = rawItemsTotal + giftWrapTotal + shippingFee;
  const payLabel = `₹${orderTotal.toLocaleString("en-IN")}`;

  // Customer Delivery Details Form
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    pincode: "",
    giftNote: giftWrap.note || "",
  });

  // Pre-fill user profile data if available
  useEffect(() => {
    if (profile) {
      setForm((prev) => ({
        ...prev,
        name: prev.name || profile.full_name || "",
        phone: prev.phone || profile.phone || "",
      }));
    } else if (user?.user_metadata) {
      setForm((prev) => ({
        ...prev,
        name: prev.name || user.user_metadata.full_name || "",
        phone: prev.phone || user.user_metadata.phone || "",
      }));
    }
  }, [profile, user]);

  // Inline Authentication State for guests
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [authForm, setAuthForm] = useState({
    email: "",
    password: "",
    fullName: "",
    phoneNumber: "",
  });
  const [authShowPassword, setAuthShowPassword] = useState(false);
  const [authLoadingState, setAuthLoadingState] = useState(false);
  const [authError, setAuthError] = useState("");

  const [isPaying, setIsPaying] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [attempted, setAttempted] = useState(false);

  const formRef = useRef<HTMLElement>(null);
  const authSectionRef = useRef<HTMLElement>(null);

  const formErrors = useMemo(() => {
    const errors: Record<string, string> = {};
    if (form.name.trim().length < 2) errors.name = "Please enter your full name.";
    if (!/^[6-9]\d{9}$/.test(form.phone.trim())) errors.phone = "Enter a valid 10-digit mobile number.";
    if (form.address.trim().length < 10) errors.address = "Please enter your complete street address.";
    if (!/^\d{6}$/.test(form.pincode.trim())) errors.pincode = "Enter a valid 6-digit pincode.";
    return errors;
  }, [form]);

  const isFormValid = Object.keys(formErrors).length === 0;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAuthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAuthForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleInlineAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthLoadingState(true);

    try {
      if (!isSupabaseConfigured) {
        throw new Error("Supabase is not configured in this environment.");
      }

      if (authMode === "signin") {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: authForm.email.trim(),
          password: authForm.password,
        });

        if (error) throw error;

        if (data.user) {
          await refreshUserData();
          toast.success("Welcome back! You are now logged in.");
        }
      } else {
        // Sign Up
        if (!authForm.fullName.trim() || authForm.fullName.trim().length < 2) {
          throw new Error("Please enter your full name.");
        }
        if (!/^[6-9]\d{9}$/.test(authForm.phoneNumber.trim())) {
          throw new Error("Please enter a valid 10-digit mobile number.");
        }

        const { data, error } = await supabase.auth.signUp({
          email: authForm.email.trim(),
          password: authForm.password,
          options: {
            data: {
              full_name: authForm.fullName.trim(),
              phone: authForm.phoneNumber.trim(),
            },
          },
        });

        if (error) throw error;

        if (data.user) {
          await supabase.from("profiles").upsert({
            id: data.user.id,
            email: authForm.email.trim(),
            full_name: authForm.fullName.trim(),
            phone: authForm.phoneNumber.trim(),
          });
          await refreshUserData();
          setForm((prev) => ({
            ...prev,
            name: authForm.fullName.trim(),
            phone: authForm.phoneNumber.trim(),
          }));
          toast.success("✨ Royal Account created! Welcome to the atelier.");
        }
      }
    } catch (err: unknown) {
      setAuthError(err instanceof Error ? err.message : "Authentication failed.");
    } finally {
      setAuthLoadingState(false);
    }
  };

  const createPendingOrder = async () => {
    if (!user) throw new Error("Please sign in or create an account before placing your order.");

    try {
      await supabase.from("profiles").upsert({
        id: user.id,
        email: user.email ?? null,
        full_name: form.name.trim(),
        phone: form.phone.trim(),
      });
    } catch {
      // Non-critical profile update
    }

    const generatedOrderNumber = `IQ-ORD-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        order_number: generatedOrderNumber,
        user_id: user.id,
        customer_name: form.name.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        pincode: form.pincode.trim(),
        gift_note: form.giftNote.trim() || null,
        payment_status: "pending",
        status: "pending",
        amount_total: orderTotal,
      })
      .select("id,order_number")
      .single();

    if (orderError || !order) {
      throw new Error(orderError?.message ?? "Could not record pending order.");
    }

    const { error: itemsError } = await supabase.from("order_items").insert(
      checkoutItems.map((item) => ({
        order_id: order.id,
        product_id: item.productId,
        product_name: item.name,
        price_text: item.price,
        unit_price: parsePrice(item.price),
        quantity: item.quantity,
        image_url: item.image,
        color: item.color ?? null,
        flowers: item.flowers ?? null,
        custom: item.custom ?? null,
      }))
    );

    if (itemsError) {
      console.warn("Order items table notice:", itemsError.message);
    }

    return order;
  };

  const markOrderPaid = async (
    orderId: string,
    razorpayOrderId: string,
    razorpayPaymentId: string
  ) => {
    const { error } = await supabase
      .from("orders")
      .update({
        payment_status: "paid",
        status: "confirmed",
        payment_id: razorpayPaymentId || null,
      })
      .eq("id", orderId);

    if (error) {
      console.warn("Order payment status update notice:", error.message);
    }
  };

  const finalizeSuccessfulOrder = (orderNumber: string, paymentId?: string) => {
    if (isCartCheckout) clearCart();
    navigate(`/success?order_number=${encodeURIComponent(orderNumber)}${paymentId ? `&payment_id=${encodeURIComponent(paymentId)}` : ""}`);
  };

  const handlePayNow = async () => {
    setAttempted(true);
    setPaymentError("");

    if (!user) {
      toast.error("Please sign in or create an account to place your commission.");
      authSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    if (!isFormValid) {
      toast.error("Please fill in all delivery details.");
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    setIsPaying(true);

    try {
      const order = await createPendingOrder();
      const amountInPaise = Math.round(orderTotal * 100);

      const scriptLoaded = await loadRazorpayCheckout();
      if (!scriptLoaded || !window.Razorpay) {
        throw new Error("Could not initialize Razorpay SDK. Please check your internet connection.");
      }

      let razorpayOrderId = "";

      try {
        const createOrderResponse = await postJson<RazorpayCreateOrderResponse>(
          "/api/create-order",
          {
            amount: amountInPaise,
            currency: "INR",
            receipt: order.id,
            notes: {
              appOrderId: order.id,
              orderNumber: order.order_number,
            },
          }
        );
        if (createOrderResponse?.order_id) {
          razorpayOrderId = createOrderResponse.order_id;
        }
      } catch (backendError) {
        console.warn("Backend order creation skipped or unavailable:", backendError);
      }

      const rzp = new window.Razorpay({
        key: razorpayKeyId || "rzp_live_TYUEKLyErpyGRl",
        amount: amountInPaise,
        currency: "INR",
        name: "Inventive Queen Atelier",
        description: `Royal Order ${order.order_number}`,
        image: logo,
        order_id: razorpayOrderId || (undefined as unknown as string),
        prefill: {
          name: form.name.trim(),
          contact: form.phone.trim(),
          email: user.email ?? "",
        },
        notes: {
          appOrderId: order.id,
          orderNumber: order.order_number,
        },
        theme: {
          color: "#702283",
        },
        modal: {
          ondismiss: () => {
            setIsPaying(false);
          },
        },
        handler: async (response) => {
          try {
            if (response.razorpay_signature) {
              try {
                await postJson("/api/verify-payment", {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                });
              } catch (verifyErr) {
                console.warn("Signature verification notice:", verifyErr);
              }
            }

            await markOrderPaid(
              order.id,
              response.razorpay_order_id || "",
              response.razorpay_payment_id || ""
            );
            finalizeSuccessfulOrder(order.order_number, response.razorpay_payment_id);
          } catch (verificationError) {
            setPaymentError(
              verificationError instanceof Error
                ? verificationError.message
                : "Payment verification failed. Your order has been recorded."
            );
            setIsPaying(false);
          }
        },
      });

      rzp.on("payment.failed", (response) => {
        setPaymentError(response.error?.description ?? "Payment failed or was cancelled. Please try again.");
        setIsPaying(false);
      });

      rzp.open();
    } catch (err) {
      setPaymentError(err instanceof Error ? err.message : "Payment initialization failed.");
      setIsPaying(false);
    }
  };

  if (checkoutItems.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full text-center glass-card-luxury rounded-3xl p-8 shadow-luxury-md border border-purple-200">
          <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto text-purple-700 mb-4 shadow-sm">
            <Package size={28} />
          </div>
          <h1 className="font-display text-2xl font-bold text-purple-950">
            No items in checkout
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-purple-900/70 font-normal">
            Choose a creation from our atelier catalogue or commission a bespoke piece.
          </p>
          <button
            onClick={() => navigate("/")}
            className="mt-6 px-6 py-3 rounded-full btn-gradient text-white text-xs font-bold uppercase tracking-wider shadow-sm"
          >
            Explore Collections
          </button>
        </div>
      </div>
    );
  }

  const currentStep = !user ? 0 : 1;

  return (
    <div className="min-h-screen bg-background selection:bg-primary/20 selection:text-primary">
      {/* Sticky Header */}
      <header className="sticky top-0 z-30 glass-navbar py-3 shadow-xs">
        <div className="container max-w-2xl mx-auto px-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="text-purple-900/70 hover:text-purple-950 transition-colors text-xs font-bold flex items-center gap-1 py-1 px-3 rounded-full hover:bg-purple-100/60"
            aria-label="Go back"
          >
            <ChevronLeft size={16} /> Back
          </button>
          <div className="flex items-center gap-2">
            <Crown size={15} className="text-amber-500" />
            <span className="font-display text-sm font-bold text-purple-950">Royal Atelier Checkout</span>
          </div>
          <div className="flex items-center gap-2">
            <img src={logo} alt="Inventive Queen" className="w-8 h-8 rounded-full object-cover ring-2 ring-purple-300" />
          </div>
        </div>
      </header>

      <div className="container max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* Stepper Progress */}
        <FadeIn>
          <div className="flex items-center justify-between px-5 py-3.5 bg-white rounded-2xl border border-purple-100 shadow-xs">
            {steps.map((step, i) => {
              const isDone = i < currentStep;
              const isCurrent = i === currentStep;
              return (
                <div key={step.label} className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                      isDone
                        ? "bg-emerald-600 text-white shadow-xs"
                        : isCurrent
                        ? "bg-purple-700 text-white shadow-xs ring-2 ring-purple-300"
                        : "bg-purple-100 text-purple-700"
                    }`}
                  >
                    {isDone ? <Check size={13} /> : i + 1}
                  </div>
                  <span
                    className={`text-xs font-bold hidden sm:inline ${
                      isCurrent
                        ? "text-purple-950"
                        : isDone
                        ? "text-emerald-700"
                        : "text-purple-900/60"
                    }`}
                  >
                    {step.label}
                  </span>
                  {i < steps.length - 1 && (
                    <div className="w-8 sm:w-16 h-px bg-purple-100 mx-2" />
                  )}
                </div>
              );
            })}
          </div>
        </FadeIn>

        {/* Step 1: Royal Account Gate */}
        <FadeIn delay={0.03}>
          <section
            ref={authSectionRef}
            className={`glass-card-luxury rounded-3xl p-6 shadow-sm border transition-all ${
              !user ? "border-purple-400/80 ring-2 ring-purple-300/40" : "border-emerald-200 bg-emerald-50/20"
            }`}
          >
            {user ? (
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                    <UserCheck size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-display text-sm sm:text-base font-bold text-purple-950">
                        {profile?.full_name || user.user_metadata?.full_name || "Royal Customer"}
                      </h2>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                        Signed In
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <Link
                  to={`/login?redirect=${encodeURIComponent(`/checkout?${params.toString()}`)}`}
                  className="text-xs font-bold text-purple-700 hover:text-purple-950 underline decoration-purple-300"
                >
                  Switch
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b border-purple-100">
                  <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center flex-shrink-0">
                    <Lock size={18} />
                  </div>
                  <div>
                    <h2 className="font-display text-base font-bold text-purple-950">
                      Step 1: Sign In to Complete Your Order
                    </h2>
                    <p className="text-xs text-purple-900/70">
                      Please log in or create an account to link your commission for live crafting & tracking.
                    </p>
                  </div>
                </div>

                {/* Auth Mode Tabs */}
                <div className="grid grid-cols-2 gap-2 bg-purple-100/60 p-1 rounded-2xl">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode("signin");
                      setAuthError("");
                    }}
                    className={`py-2 rounded-xl text-xs font-bold transition-all ${
                      authMode === "signin"
                        ? "bg-white text-purple-950 shadow-xs"
                        : "text-purple-900/70 hover:text-purple-950"
                    }`}
                  >
                    Existing Customer (Sign In)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode("signup");
                      setAuthError("");
                    }}
                    className={`py-2 rounded-xl text-xs font-bold transition-all ${
                      authMode === "signup"
                        ? "bg-white text-purple-950 shadow-xs"
                        : "text-purple-900/70 hover:text-purple-950"
                    }`}
                  >
                    New to Atelier (Create Account)
                  </button>
                </div>

                {authError && (
                  <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
                    {authError}
                  </div>
                )}

                <form onSubmit={handleInlineAuthSubmit} className="space-y-3 pt-1">
                  {authMode === "signup" && (
                    <>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-purple-950 uppercase tracking-wider">
                          Full Name *
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            name="fullName"
                            required
                            placeholder="e.g. Priyanshi Sharma"
                            value={authForm.fullName}
                            onChange={handleAuthChange}
                            className="w-full rounded-2xl border border-purple-200 bg-white px-4 py-2.5 text-sm font-body text-purple-950 placeholder:text-purple-900/40 focus:outline-none focus:ring-2 focus:ring-purple-400/30"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-purple-950 uppercase tracking-wider">
                          10-Digit Mobile Number *
                        </label>
                        <div className="relative">
                          <input
                            type="tel"
                            name="phoneNumber"
                            required
                            maxLength={10}
                            placeholder="e.g. 9876543210"
                            value={authForm.phoneNumber}
                            onChange={handleAuthChange}
                            className="w-full rounded-2xl border border-purple-200 bg-white px-4 py-2.5 text-sm font-body text-purple-950 placeholder:text-purple-900/40 focus:outline-none focus:ring-2 focus:ring-purple-400/30"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-purple-950 uppercase tracking-wider flex items-center gap-1">
                      <Mail size={12} className="text-purple-600" />
                      <span>Email Address *</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="your.email@example.com"
                      value={authForm.email}
                      onChange={handleAuthChange}
                      className="w-full rounded-2xl border border-purple-200 bg-white px-4 py-2.5 text-sm font-body text-purple-950 placeholder:text-purple-900/40 focus:outline-none focus:ring-2 focus:ring-purple-400/30"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-purple-950 uppercase tracking-wider flex items-center gap-1">
                      <KeyRound size={12} className="text-purple-600" />
                      <span>Password *</span>
                    </label>
                    <div className="relative">
                      <input
                        type={authShowPassword ? "text" : "password"}
                        name="password"
                        required
                        minLength={6}
                        placeholder="At least 6 characters"
                        value={authForm.password}
                        onChange={handleAuthChange}
                        className="w-full rounded-2xl border border-purple-200 bg-white px-4 py-2.5 text-sm font-body text-purple-950 placeholder:text-purple-900/40 focus:outline-none focus:ring-2 focus:ring-purple-400/30 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setAuthShowPassword(!authShowPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 hover:text-purple-700"
                        aria-label="Toggle password visibility"
                      >
                        {authShowPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={authLoadingState || authLoading}
                    className="w-full mt-2 py-3 px-6 rounded-2xl btn-gradient text-white text-xs font-bold uppercase tracking-wider shadow-sm hover:shadow-md active:scale-[0.99] transition-all flex items-center justify-center gap-2"
                  >
                    <Sparkles size={14} className="text-amber-200" />
                    <span>
                      {authLoadingState
                        ? "Connecting to Atelier..."
                        : authMode === "signin"
                        ? "Sign In & Continue Order"
                        : "Create Royal Account & Continue Order"}
                    </span>
                  </button>
                </form>
              </div>
            )}
          </section>
        </FadeIn>

        {/* Order Summary Card */}
        <FadeIn delay={0.06}>
          <section className="glass-card-luxury rounded-3xl p-6 shadow-sm border border-purple-200">
            <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-purple-100">
              <h2 className="font-display text-base font-bold text-purple-950 flex items-center gap-2">
                <Package size={16} className="text-purple-600" />
                <span>Atelier Order Pieces</span>
              </h2>
              {isCartCheckout && (
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800">
                  {checkoutItems.reduce((sum, item) => sum + item.quantity, 0)} pieces
                </span>
              )}
            </div>

            <div className="space-y-4">
              {checkoutItems.map((item) => (
                <div key={item.id} className="flex gap-4 items-center">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden bg-purple-50 p-1.5 flex items-center justify-center border border-purple-100 flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-display text-sm font-bold text-purple-950 line-clamp-1">
                        {item.name}
                      </p>
                      {item.quantity > 1 && (
                        <span className="text-[10px] font-bold text-purple-800 bg-purple-100 rounded-full px-2 py-0.5">
                          ×{item.quantity}
                        </span>
                      )}
                    </div>
                    <CheckoutItemDetails item={item} />
                    <p className="font-display text-sm font-black text-purple-700 mt-1">
                      {item.quantity > 1
                        ? `Rs. ${parsePrice(item.price) * item.quantity}`
                        : item.price}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 pt-4 border-t border-purple-100 space-y-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Items Subtotal</span>
                <span className="font-semibold text-plum">₹{rawItemsTotal.toLocaleString("en-IN")}</span>
              </div>
              {giftWrapTotal > 0 && (
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Wax-Sealed Gift Box</span>
                  <span className="font-semibold text-purple-700">+₹{giftWrapTotal}</span>
                </div>
              )}
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Courier Delivery</span>
                <span>
                  {shippingFee === 0 ? (
                    <strong className="text-emerald-700 font-bold uppercase tracking-wider text-[11px]">Free</strong>
                  ) : (
                    `₹${shippingFee}`
                  )}
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-purple-100 pt-2">
                <span className="font-body text-xs uppercase tracking-wider text-purple-950 font-bold">Total Payable</span>
                <span className="font-display text-xl font-black text-purple-950">
                  ₹{orderTotal.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </section>
        </FadeIn>

        {/* Step 2: Customer Delivery Details Form */}
        <FadeIn delay={0.1}>
          <section
            ref={formRef}
            className={`glass-card-luxury rounded-3xl p-6 shadow-sm border border-purple-200 space-y-4 relative ${
              !user ? "opacity-60 pointer-events-none filter blur-[0.5px]" : ""
            }`}
          >
            <div className="flex items-center justify-between pb-2 border-b border-purple-100">
              <h2 className="font-display text-base font-bold text-purple-950 flex items-center gap-2">
                <MapPin size={16} className="text-purple-600" />
                <span>Step 2: Delivery Address & Contact</span>
              </h2>
              {!user && (
                <span className="text-[11px] font-bold text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-full">
                  Sign in above to unlock
                </span>
              )}
            </div>

            <InputField
              label="Recipient Full Name"
              name="name"
              placeholder="e.g. Priyanshi Sharma"
              value={form.name}
              onChange={handleChange}
              error={attempted ? formErrors.name : undefined}
            />
            <InputField
              label="10-Digit Mobile Number"
              name="phone"
              type="tel"
              placeholder="10-digit mobile number for dispatch updates"
              value={form.phone}
              onChange={handleChange}
              maxLength={10}
              error={attempted ? formErrors.phone : undefined}
            />
            <div className="space-y-1.5">
              <label className="font-body text-xs font-bold text-purple-950 uppercase tracking-wider">
                Complete Street Address
              </label>
              <textarea
                name="address"
                placeholder="House/flat number, apartment/society, street, landmark, city, state"
                value={form.address}
                onChange={handleChange}
                rows={3}
                className={`w-full rounded-2xl border bg-white px-4 py-3 text-sm font-body text-purple-950 placeholder:text-purple-900/40 focus:outline-none focus:ring-2 focus:ring-purple-400/30 transition-all resize-none ${
                  attempted && formErrors.address ? "border-rose-500 ring-1 ring-rose-500/20" : "border-purple-200"
                }`}
              />
              {attempted && formErrors.address && (
                <p className="text-xs text-rose-600 font-medium">{formErrors.address}</p>
              )}
            </div>
            <InputField
              label="Postal Pincode"
              name="pincode"
              placeholder="6-digit postal code"
              value={form.pincode}
              onChange={handleChange}
              maxLength={6}
              error={attempted ? formErrors.pincode : undefined}
            />
          </section>
        </FadeIn>

        {/* Gift Note Section */}
        <FadeIn delay={0.14}>
          <section className="glass-card-luxury rounded-3xl p-6 shadow-sm border border-purple-200 space-y-3">
            <div className="flex items-center gap-2">
              <Gift size={16} className="text-purple-600" />
              <h2 className="font-display text-base font-bold text-purple-950">Wax-Sealed Gift Note</h2>
              <span className="text-[10px] uppercase tracking-wider text-purple-600 font-bold ml-auto bg-purple-100 px-2.5 py-0.5 rounded-full">
                Complimentary
              </span>
            </div>
            <textarea
              name="giftNote"
              placeholder="Personal message for recipient (handwritten on parchment with royal wax seal)..."
              value={form.giftNote}
              onChange={handleChange}
              rows={2}
              className="w-full rounded-2xl border border-purple-200 bg-white px-4 py-3 text-sm font-body text-purple-950 placeholder:text-purple-900/40 focus:outline-none focus:ring-2 focus:ring-purple-400/30 transition-all resize-none"
            />
          </section>
        </FadeIn>

        {/* Timeline Journey */}
        <FadeIn delay={0.18}>
          <section className="glass-card-luxury rounded-3xl p-6 shadow-sm border border-purple-200">
            <h2 className="font-display text-sm font-bold text-purple-950 mb-4">Handcrafted Process & Dispatch</h2>
            <div className="grid grid-cols-4 gap-2 text-center">
              {timelineSteps.map((step) => (
                <div key={step.label} className="flex flex-col items-center gap-2">
                  <div
                    className={`w-9 h-9 rounded-2xl flex items-center justify-center transition-all ${
                      step.active
                        ? "bg-purple-700 text-white shadow-sm"
                        : "bg-purple-100 text-purple-500"
                    }`}
                  >
                    <step.icon size={15} />
                  </div>
                  <span className="text-[10px] font-bold text-purple-950 leading-tight">
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </FadeIn>

        {/* Trust Badges */}
        <FadeIn delay={0.22}>
          <section className="grid grid-cols-2 gap-3">
            {trustItems.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2.5 bg-white rounded-2xl px-4 py-3 shadow-xs border border-purple-100"
              >
                <Icon className="w-4 h-4 text-purple-600 flex-shrink-0" />
                <span className="font-body text-xs font-bold text-purple-950">
                  {label}
                </span>
              </div>
            ))}
          </section>
        </FadeIn>

        {/* Pay Online Button */}
        <div className="space-y-3 pt-2 pb-8">
          <button
            onClick={handlePayNow}
            disabled={isPaying}
            className="w-full py-4 px-6 rounded-2xl font-body font-bold text-xs uppercase tracking-wider text-white btn-gradient shadow-luxury hover:shadow-luxury-lg active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            <Sparkles size={16} className="text-amber-200" />
            <span>
              {isPaying
                ? "Opening Razorpay Gateway..."
                : !user
                ? `Sign In to Pay · ${payLabel}`
                : `Pay Online via Razorpay · ${payLabel}`}
            </span>
          </button>

          {paymentError && (
            <p className="text-center font-body text-xs text-rose-600 bg-rose-50 border border-rose-200 p-3 rounded-2xl font-semibold">
              {paymentError}
            </p>
          )}

          <div className="flex items-center justify-center gap-2 text-xs text-purple-900/60 font-semibold text-center">
            <Lock size={13} className="text-emerald-600 shrink-0" />
            <span>Encrypted 256-bit SSL transaction protected by Razorpay & Atelier Guarantee</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function CheckoutItemDetails({ item }: { item: CartItem }) {
  const details = [
    item.color ? `Color: ${item.color}` : null,
    item.flowers?.length ? `Flowers: ${item.flowers.join(", ")}` : null,
    item.custom ? `Custom: ${item.custom}` : null,
  ].filter(Boolean);

  if (details.length === 0) return null;

  return (
    <div className="space-y-0.5 mt-1">
      {details.map((detail) => (
        <p key={detail} className="font-body text-[11px] text-purple-900/70 line-clamp-1">
          {detail}
        </p>
      ))}
    </div>
  );
}

function InputField({
  label,
  name,
  placeholder,
  value,
  onChange,
  type = "text",
  maxLength,
  error,
}: {
  label: string;
  name: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  maxLength?: number;
  error?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="font-body text-xs font-bold text-purple-950 uppercase tracking-wider">{label}</label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        maxLength={maxLength}
        className={`w-full rounded-2xl border bg-white px-4 py-3 text-sm font-body text-purple-950 placeholder:text-purple-900/40 focus:outline-none focus:ring-2 focus:ring-purple-400/30 transition-all ${
          error ? "border-rose-500 ring-1 ring-rose-500/20" : "border-purple-200"
        }`}
      />
      {error && (
        <p className="text-xs text-rose-600 font-medium">{error}</p>
      )}
    </div>
  );
}
