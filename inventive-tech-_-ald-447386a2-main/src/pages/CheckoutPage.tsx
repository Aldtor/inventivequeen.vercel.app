import { useState, useMemo, useRef } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useProducts } from "@/lib/cms-products";
import { clearCart, getCartItems, getCartTotal, parsePrice, type CartItem } from "@/lib/cart";
import { Heart, Package, Clock, Shield, Gift, Lock, Truck, ChevronLeft, Check, Sparkles, ArrowRight } from "lucide-react";
import { FadeIn } from "@/components/motion/FadeIn";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import logo from "@/assets/logo.png";

const RAZORPAY_SCRIPT_URL = "https://checkout.razorpay.com/v1/checkout.js";
const razorpayKeyId = import.meta.env.VITE_RAZORPAY_KEY_ID ?? "";

const steps = [
  { label: "Details", icon: Package },
  { label: "Review", icon: Check },
  { label: "Payment", icon: Lock },
];

const trustItems = [
  { icon: Heart, label: "100% Handcrafted" },
  { icon: Clock, label: "Made in 2–3 days" },
  { icon: Shield, label: "Razorpay SSL Secure" },
  { icon: Gift, label: "Aesthetic Gift Box" },
];

const timelineSteps = [
  { label: "Order Placed", icon: Check, active: true },
  { label: "Hand-Crafting", icon: Heart, active: false },
  { label: "Dispatched", icon: Truck, active: false },
  { label: "Delivered", icon: Gift, active: false },
];

interface RazorpayPaymentResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
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
  order_id: string;
  prefill: {
    name: string;
    contact: string;
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
  const { user, loading: authLoading } = useAuth();
  const { products } = useProducts();
  const productId = params.get("product");
  const selectedColor = params.get("color");
  const selectedFlowers = params.get("flowers");
  const customChanges = params.get("custom");
  const isCartCheckout = params.get("cart") === "1";

  const product = products.find((p) => p.id === productId);
  const cartItems = useMemo(() => (isCartCheckout ? getCartItems() : []), [isCartCheckout]);

  const checkoutItems = useMemo<CartItem[]>(() => {
    if (isCartCheckout) return cartItems;
    if (!product) return [];

    return [
      {
        id: `${product.id}|direct`,
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        quantity: 1,
        color: selectedColor ?? undefined,
        flowers: selectedFlowers ? selectedFlowers.split(",").filter(Boolean) : undefined,
        custom: customChanges ?? undefined,
      },
    ];
  }, [cartItems, customChanges, isCartCheckout, product, selectedColor, selectedFlowers]);

  const orderTotal = useMemo(() => getCartTotal(checkoutItems), [checkoutItems]);
  const payLabel = isCartCheckout ? `Rs. ${orderTotal}` : checkoutItems[0]?.price ?? "";

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    pincode: "",
    giftNote: "",
  });
  const [isPaying, setIsPaying] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [attempted, setAttempted] = useState(false);

  const formRef = useRef<HTMLElement>(null);

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

  const createPendingOrder = async () => {
    if (!user) throw new Error("Please sign in before placing your order.");

    await supabase.from("profiles").upsert({
      id: user.id,
      email: user.email ?? null,
      full_name: form.name.trim(),
      phone: form.phone.trim(),
    });

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        customer_name: form.name.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        pincode: form.pincode.trim(),
        gift_note: form.giftNote.trim() || null,
        payment_status: "pending",
        amount_total: orderTotal,
      })
      .select("id,order_number")
      .single();

    if (orderError || !order) {
      throw new Error(orderError?.message ?? "Could not create order.");
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
      throw new Error(itemsError.message);
    }

    return order;
  };

  const handlePayNow = async () => {
    if (checkoutItems.length === 0) return;

    if (!isFormValid) {
      setAttempted(true);
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    if (!isSupabaseConfigured) {
      setPaymentError("Supabase is not configured. Add the publishable key before taking orders.");
      return;
    }
    if (!razorpayKeyId) {
      setPaymentError("Razorpay key is not configured. Add VITE_RAZORPAY_KEY_ID before taking payments.");
      return;
    }
    if (!user) {
      navigate(`/login?redirect=${encodeURIComponent(`/checkout?${params.toString()}`)}`);
      return;
    }

    setIsPaying(true);
    setPaymentError("");

    let pendingOrder: { id: string; order_number: string };

    try {
      pendingOrder = await createPendingOrder();
    } catch (error) {
      setIsPaying(false);
      setPaymentError(error instanceof Error ? error.message : "Could not create order.");
      return;
    }

    const isLoaded = await loadRazorpayCheckout();

    if (!isLoaded || !window.Razorpay) {
      setIsPaying(false);
      setPaymentError("Razorpay could not load. Please check your internet connection and try again.");
      return;
    }

    const itemNames = checkoutItems.map((item) => `${item.name} x${item.quantity}`).join(", ");
    const amount = orderTotal * 100;
    let razorpayOrder: RazorpayCreateOrderResponse;

    try {
      razorpayOrder = await postJson<RazorpayCreateOrderResponse>("/api/create-order", {
        amount,
        currency: "INR",
        receipt: pendingOrder.order_number,
      });
    } catch (error) {
      await supabase.from("orders").update({ payment_status: "failed" }).eq("id", pendingOrder.id);
      setIsPaying(false);
      setPaymentError(error instanceof Error ? error.message : "Could not create Razorpay order.");
      return;
    }

    const checkout = new window.Razorpay({
      key: razorpayKeyId,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      name: "Inventive Queen",
      description: itemNames.length > 120 ? `${itemNames.slice(0, 117)}...` : itemNames,
      order_id: razorpayOrder.order_id,
      prefill: {
        name: form.name.trim(),
        contact: form.phone.trim(),
      },
      notes: {
        orderNumber: pendingOrder.order_number,
        address: form.address.trim(),
        pincode: form.pincode.trim(),
        giftNote: form.giftNote.trim(),
        items: itemNames,
      },
      image: "/logo.png",
      theme: {
        color: "#8c4fe6",
      },
      modal: {
        ondismiss: () => {
          setIsPaying(false);
          setPaymentError("Payment was cancelled before completion.");
        },
      },
      handler: async (response) => {
        if (response.razorpay_order_id !== razorpayOrder.order_id) {
          await supabase.from("orders").update({ payment_status: "failed" }).eq("id", pendingOrder.id);
          setIsPaying(false);
          setPaymentError("Payment order mismatch. Please try again.");
          return;
        }

        try {
          await postJson<{ success: true }>("/api/verify-payment", {
            razorpay_order_id: razorpayOrder.order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });
        } catch (error) {
          await supabase.from("orders").update({ payment_status: "failed" }).eq("id", pendingOrder.id);
          setIsPaying(false);
          setPaymentError(error instanceof Error ? error.message : "Payment verification failed.");
          return;
        }

        const { error: updateError } = await supabase
          .from("orders")
          .update({
            payment_status: "paid",
            status: "confirmed",
            payment_id: response.razorpay_payment_id,
          })
          .eq("id", pendingOrder.id);

        if (updateError) {
          setIsPaying(false);
          setPaymentError(`Payment captured, but order update failed: ${updateError.message}`);
          return;
        }

        if (isCartCheckout) clearCart();
        navigate(
          `/success?order_number=${encodeURIComponent(pendingOrder.order_number)}&payment_id=${encodeURIComponent(
            response.razorpay_payment_id
          )}`
        );
      },
    });

    checkout.on("payment.failed", async (response) => {
      await supabase.from("orders").update({ payment_status: "failed" }).eq("id", pendingOrder.id);
      setIsPaying(false);
      setPaymentError(
        response.error?.description || "Payment failed. Please try again or use another payment method."
      );
    });

    checkout.open();
  };

  if (checkoutItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="text-center space-y-4 max-w-sm glass-card p-8 rounded-3xl shadow-luxury">
          <Package className="w-12 h-12 text-muted-foreground mx-auto text-primary" />
          <p className="text-lg font-display font-bold text-foreground">No items in checkout</p>
          <p className="text-xs text-muted-foreground">Select a handcrafted piece or explore our gallery.</p>
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full btn-gradient text-white text-xs font-bold shadow-md"
          >
            <span>Back to Atelier</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background selection:bg-primary/15 selection:text-primary">
      {/* Sticky Header */}
      <div className="sticky top-0 z-30 bg-background/90 backdrop-blur-xl border-b border-border/50">
        <div className="container max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="text-muted-foreground hover:text-foreground transition-colors text-xs font-semibold flex items-center gap-1 py-1 px-2.5 rounded-lg hover:bg-secondary/60"
            aria-label="Go back"
          >
            <ChevronLeft size={16} /> Back
          </button>
          <div className="flex items-center gap-2">
            <span className="text-base select-none">👑</span>
            <span className="font-display text-sm font-bold text-foreground">Royal Checkout</span>
          </div>
          <div className="flex items-center gap-2">
            <img src={logo} alt="Inventive Queen" className="w-7 h-7 rounded-full object-cover ring-2 ring-primary/20" />
          </div>
        </div>
      </div>

      <div className="container max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* Auth prompt if guest */}
        {!authLoading && !user && (
          <FadeIn>
            <section className="glass-card rounded-3xl p-6 shadow-luxury border border-primary/20 text-center">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto text-primary mb-3">
                <Lock size={22} />
              </div>
              <h2 className="font-display text-xl font-bold text-foreground">
                Sign in to complete order
              </h2>
              <p className="mt-1.5 text-xs text-muted-foreground max-w-sm mx-auto">
                Sign in lets you view your order history, tracking updates & bespoke status.
              </p>
              <div className="mt-4">
                <Link
                  to={`/login?redirect=${encodeURIComponent(`/checkout?${params.toString()}`)}`}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full btn-gradient text-white text-xs font-bold shadow-royal-glow"
                >
                  <Sparkles size={14} className="text-amber-200" />
                  Sign In or Create Account
                </Link>
              </div>
            </section>
          </FadeIn>
        )}

        {/* Stepper */}
        <FadeIn>
          <div className="flex items-center justify-between px-4 py-3 glass-panel rounded-2xl">
            {steps.map((step, i) => (
              <div key={step.label} className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                  i === 0
                    ? "bg-primary text-white shadow-sm shadow-primary/30"
                    : "bg-secondary text-muted-foreground"
                }`}>
                  {i + 1}
                </div>
                <span className={`text-xs font-semibold hidden sm:inline ${
                  i === 0 ? "text-foreground" : "text-muted-foreground"
                }`}>
                  {step.label}
                </span>
                {i < steps.length - 1 && (
                  <div className="w-8 sm:w-16 h-px bg-border/60 mx-2" />
                )}
              </div>
            ))}
          </div>
        </FadeIn>

        {/* Order Summary */}
        <FadeIn delay={0.05}>
          <section className="glass-card rounded-3xl p-6 shadow-luxury-sm border border-border/50">
            <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-border/40">
              <h2 className="font-display text-base font-bold text-foreground flex items-center gap-2">
                <Package size={16} className="text-primary" />
                Order Summary
              </h2>
              {isCartCheckout && (
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary">
                  {checkoutItems.reduce((sum, item) => sum + item.quantity, 0)} items
                </span>
              )}
            </div>

            <div className="space-y-4">
              {checkoutItems.map((item) => (
                <div key={item.id} className="flex gap-4 items-center">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gradient-to-br from-purple-50 to-pink-50 p-1.5 flex items-center justify-center border border-border/40 shadow-sm flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-display text-sm font-bold text-foreground line-clamp-1">
                        {item.name}
                      </p>
                      {item.quantity > 1 && (
                        <span className="text-[10px] font-bold text-primary bg-primary/10 rounded-full px-2 py-0.5">
                          ×{item.quantity}
                        </span>
                      )}
                    </div>
                    <CheckoutItemDetails item={item} />
                    <p className="font-display text-sm font-bold text-primary mt-1">
                      {item.quantity > 1
                        ? `Rs. ${parsePrice(item.price) * item.quantity}`
                        : item.price}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {isCartCheckout && (
              <div className="mt-5 pt-4 border-t border-border/40 flex items-center justify-between">
                <span className="font-body text-xs uppercase tracking-wider text-muted-foreground font-semibold">Subtotal</span>
                <span className="font-display text-xl font-bold text-primary">
                  Rs. {orderTotal}
                </span>
              </div>
            )}
          </section>
        </FadeIn>

        {/* Customer Details Form */}
        <FadeIn delay={0.1}>
          <section ref={formRef} className="glass-card rounded-3xl p-6 shadow-luxury-sm border border-border/50 space-y-4">
            <h2 className="font-display text-base font-bold text-foreground pb-2 border-b border-border/40">
              Delivery Address & Contact
            </h2>

            <InputField
              label="Full Name"
              name="name"
              placeholder="e.g. Priyanshi Sharma"
              value={form.name}
              onChange={handleChange}
              error={attempted ? formErrors.name : undefined}
            />
            <InputField
              label="Phone Number"
              name="phone"
              type="tel"
              placeholder="10-digit mobile number"
              value={form.phone}
              onChange={handleChange}
              maxLength={10}
              error={attempted ? formErrors.phone : undefined}
            />
            <div className="space-y-1.5">
              <label className="font-body text-xs font-semibold text-foreground uppercase tracking-wider">
                Full Street Address
              </label>
              <textarea
                name="address"
                placeholder="House/flat no, building name, street, landmark, city, state"
                value={form.address}
                onChange={handleChange}
                rows={3}
                className={`w-full rounded-2xl border bg-card px-4 py-3 text-sm font-body text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all resize-none ${
                  attempted && formErrors.address ? "border-destructive ring-1 ring-destructive/20" : "border-border/60"
                }`}
              />
              {attempted && formErrors.address && (
                <p className="text-xs text-destructive font-body">{formErrors.address}</p>
              )}
            </div>
            <InputField
              label="Pincode"
              name="pincode"
              placeholder="6-digit postal code"
              value={form.pincode}
              onChange={handleChange}
              maxLength={6}
              error={attempted ? formErrors.pincode : undefined}
            />
          </section>
        </FadeIn>

        {/* Gift Note */}
        <FadeIn delay={0.15}>
          <section className="glass-card rounded-3xl p-6 shadow-luxury-sm border border-border/50 space-y-3">
            <div className="flex items-center gap-2">
              <Gift size={16} className="text-primary" />
              <h2 className="font-display text-base font-bold text-foreground">Gift Message & Note</h2>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold ml-auto bg-secondary px-2.5 py-0.5 rounded-full">
                Optional
              </span>
            </div>
            <textarea
              name="giftNote"
              placeholder="Personal message for the recipient (we hand-write this on aesthetic parchment)..."
              value={form.giftNote}
              onChange={handleChange}
              rows={2}
              className="w-full rounded-2xl border border-border/60 bg-card px-4 py-3 text-sm font-body text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all resize-none"
            />
          </section>
        </FadeIn>

        {/* Delivery timeline */}
        <FadeIn delay={0.2}>
          <section className="glass-card rounded-3xl p-6 shadow-luxury-sm border border-border/50">
            <h2 className="font-display text-sm font-bold text-foreground mb-4">Handcrafted Process Timeline</h2>
            <div className="grid grid-cols-4 gap-2 text-center">
              {timelineSteps.map((step) => (
                <div key={step.label} className="flex flex-col items-center gap-2">
                  <div className={`w-9 h-9 rounded-2xl flex items-center justify-center transition-all ${
                    step.active
                      ? "bg-primary text-white shadow-royal"
                      : "bg-secondary text-muted-foreground/60"
                  }`}>
                    <step.icon size={15} />
                  </div>
                  <span className="text-[10px] font-semibold text-foreground leading-tight">
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </FadeIn>

        {/* Trust Badges */}
        <FadeIn delay={0.25}>
          <section className="grid grid-cols-2 gap-3">
            {trustItems.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2.5 glass-panel rounded-2xl px-4 py-3 shadow-luxury-sm"
              >
                <Icon className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="font-body text-xs font-medium text-foreground">
                  {label}
                </span>
              </div>
            ))}
          </section>
        </FadeIn>

        {/* Pay Button */}
        <div className="space-y-3 pt-2 pb-8">
          <button
            onClick={handlePayNow}
            disabled={isPaying}
            className="w-full py-4 px-6 rounded-2xl font-body font-bold text-sm text-white btn-gradient shadow-royal-glow hover:shadow-luxury-lg active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            <Sparkles size={16} className="text-amber-200" />
            <span>{isPaying ? "Opening Razorpay Gateway..." : `Pay Now ${payLabel}`}</span>
          </button>
          {paymentError && (
            <p className="text-center font-body text-xs text-destructive bg-destructive/10 p-2.5 rounded-xl">
              {paymentError}
            </p>
          )}
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Lock size={12} className="text-emerald-600" />
            <span>Encrypted 256-bit SSL transaction via Razorpay</span>
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
        <p key={detail} className="font-body text-[11px] text-muted-foreground line-clamp-1">
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
      <label className="font-body text-xs font-semibold text-foreground uppercase tracking-wider">{label}</label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        maxLength={maxLength}
        className={`w-full rounded-2xl border bg-card px-4 py-3 text-sm font-body text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all ${
          error ? "border-destructive ring-1 ring-destructive/20" : "border-border/60"
        }`}
      />
      {error && (
        <p className="text-xs text-destructive font-body">{error}</p>
      )}
    </div>
  );
}
