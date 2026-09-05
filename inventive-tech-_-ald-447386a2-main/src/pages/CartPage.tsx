import { useMemo, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, ShoppingBag, Trash2, Sparkles, ArrowRight, ShieldCheck, Truck, ArrowLeft, Gift, Heart, Lock } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import { FadeIn } from "@/components/motion/FadeIn";
import { StaggerChildren, StaggerItem } from "@/components/motion/StaggerChildren";
import {
  clearCart,
  getCartCount,
  getCartItems,
  getCartTotal,
  removeCartItem,
  updateCartItemQuantity,
  FREE_SHIPPING_THRESHOLD,
  CART_UPDATED_EVENT,
  getGiftWrapOption,
  setGiftWrapOption,
  GIFT_WRAP_PRICE,
  type CartItem,
  type GiftWrapOption,
} from "@/lib/cart";

export default function CartPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<CartItem[]>(getCartItems());
  const [giftWrap, setGiftWrap] = useState<GiftWrapOption>(getGiftWrapOption());

  const sync = () => {
    setItems(getCartItems());
    setGiftWrap(getGiftWrapOption());
  };

  useEffect(() => {
    sync();
    window.addEventListener(CART_UPDATED_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(CART_UPDATED_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const itemCount = useMemo(() => getCartCount(items), [items]);
  const subtotal = useMemo(() => getCartTotal(items), [items]);
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const shippingProgress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  const handleQuantity = (id: string, quantity: number) => {
    setItems(updateCartItemQuantity(id, quantity));
  };

  const handleRemove = (id: string) => {
    setItems(removeCartItem(id));
  };

  const handleClear = () => {
    clearCart();
    setItems([]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-[#461c48] font-sans">
      <SiteHeader />

      <main className="flex-1 pb-24 pt-32 sm:pt-36 relative">
        {/* Decorative Orbs */}
        <div className="decorative-orb w-64 h-64 bg-purple-400/15 -top-16 -right-20" style={{ animationDelay: "0s" }} />
        <div className="decorative-orb w-48 h-48 bg-pink-300/10 bottom-32 -left-16" style={{ animationDelay: "5s" }} />

        <div className="mx-auto max-w-6xl px-6 relative z-10">
          {/* Top Back Navigation */}
          <FadeIn>
            <div>
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-purple-700 font-semibold group"
              >
                <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" /> Continue browsing collection
              </Link>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="mt-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b border-purple-200/60 pb-6">
              <div>
                <p className="text-xs uppercase tracking-[0.42em] text-purple-700 font-bold">Shopping Basket</p>
                <h1 className="mt-2 font-display text-4xl text-plum sm:text-5xl font-medium">
                  Your <span className="italic text-gradient">Keepsakes</span>
                </h1>
              </div>
              {items.length > 0 && (
                <button
                  onClick={handleClear}
                  className="text-xs text-muted-foreground hover:text-rose-600 transition-colors uppercase tracking-wider font-semibold self-start md:self-auto hover:underline"
                >
                  Clear all items
                </button>
              )}
            </div>
          </FadeIn>

          {items.length === 0 ? (
            <FadeIn delay={0.2}>
              <div className="mt-16 rounded-[2.5rem] glass-card border border-purple-200/80 bg-white/70 p-16 text-center shadow-soft">
                <div className="h-16 w-16 mx-auto rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mb-4 shadow-inner">
                  <ShoppingBag className="h-8 w-8 text-purple-600/70" />
                </div>
                <h2 className="font-display text-2xl text-plum font-semibold">Your basket is currently empty</h2>
                <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                  Explore our handmade crochet bouquets, keepsake dolls, pocket charms, and bespoke commissions.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-4">
                  <Link
                    to="/shop"
                    className="rounded-full btn-royal px-8 py-3.5 text-xs font-semibold uppercase tracking-wider hover:-translate-y-0.5 transition-all hover:shadow-lg"
                  >
                    Explore The Collection
                  </Link>
                  <Link
                    to="/custom-orders"
                    className="rounded-full border border-purple-300 bg-white px-8 py-3.5 text-xs font-semibold text-plum hover:bg-purple-50 transition-all"
                  >
                    Custom Orders Studio
                  </Link>
                </div>
              </div>
            </FadeIn>
          ) : (
            <div className="mt-10 grid gap-12 lg:grid-cols-3 items-start">
              {/* Cart Items List */}
              <div className="lg:col-span-2 space-y-4">
                {/* Free Shipping Notification Card */}
                <FadeIn delay={0.15}>
                  <div className="rounded-2xl border border-purple-200/70 bg-purple-50/70 p-5 shadow-sm relative overflow-hidden">
                    <div className="flex items-center justify-between text-xs font-semibold text-plum relative z-10">
                      <span>
                        {remainingForFreeShipping === 0 ? (
                          <span className="text-emerald-700 flex items-center gap-1.5 font-bold">
                            <Sparkles className="h-4 w-4 text-amber-500 animate-sparkle" /> You unlocked FREE Atelier Courier Delivery!
                          </span>
                        ) : (
                          <>Add ₹{remainingForFreeShipping.toLocaleString("en-IN")} more to qualify for <strong>FREE shipping</strong></>
                        )}
                      </span>
                      <span className="text-purple-800">{Math.round(shippingProgress)}%</span>
                    </div>
                    <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-purple-200/70 relative z-10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 transition-all duration-700 ease-out relative"
                        style={{ width: `${shippingProgress}%` }}
                      >
                        {/* Sparkle at tip */}
                        {shippingProgress > 5 && (
                          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white/80 shadow-sm animate-pulse" />
                        )}
                      </div>
                    </div>
                  </div>
                </FadeIn>

                {/* Items — Staggered */}
                <StaggerChildren className="space-y-4" staggerDelay={0.08}>
                  {items.map((item) => (
                    <StaggerItem key={item.id}>
                      <article
                        className="flex flex-col sm:flex-row gap-5 rounded-3xl glass-card border border-purple-200/70 bg-white/80 p-5 shadow-sm card-hover-glow transition-all group"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-28 w-28 rounded-2xl object-cover border border-purple-100 shrink-0 self-center sm:self-start group-hover:shadow-md transition-shadow"
                        />

                        <div className="flex flex-1 flex-col justify-between">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h3 className="font-display text-lg text-plum font-semibold">
                                {item.name}
                              </h3>
                              {item.color && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  Custom Shade: <span className="font-semibold text-purple-900">{item.color}</span>
                                </p>
                              )}
                              {item.custom && (
                                <p className="text-xs text-purple-800/80 italic mt-1">
                                  Note: {item.custom}
                                </p>
                              )}
                            </div>

                            <button
                              onClick={() => handleRemove(item.id)}
                              aria-label={`Remove ${item.name}`}
                              className="rounded-full p-2 text-muted-foreground transition-all hover:bg-rose-50 hover:text-rose-600 hover:scale-110 active:scale-95"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>

                          <div className="mt-5 flex items-center justify-between border-t border-purple-100 pt-4">
                            {/* Quantity Counter */}
                            <div className="flex items-center rounded-full border border-purple-200 bg-white p-1 shadow-sm">
                              <button
                                onClick={() => handleQuantity(item.id, item.quantity - 1)}
                                aria-label="Decrease quantity"
                                className="rounded-full p-1.5 text-muted-foreground hover:bg-purple-100 hover:text-plum transition-all active:scale-90"
                              >
                                <Minus className="h-3.5 w-3.5" />
                              </button>
                              <span className="w-8 text-center text-xs font-bold text-plum">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => handleQuantity(item.id, item.quantity + 1)}
                                aria-label="Increase quantity"
                                className="rounded-full p-1.5 text-muted-foreground hover:bg-purple-100 hover:text-plum transition-all active:scale-90"
                              >
                                <Plus className="h-3.5 w-3.5" />
                              </button>
                            </div>

                            <div className="text-right">
                              <span className="font-display text-lg font-bold text-purple-950">
                                {item.price}
                              </span>
                            </div>
                          </div>
                        </div>
                      </article>
                    </StaggerItem>
                  ))}
                </StaggerChildren>
              </div>

              {/* Order Summary Sidebar */}
              <FadeIn delay={0.2} direction="right">
                <div className="rounded-[2.5rem] glass-card border border-purple-200/80 bg-white/90 p-8 shadow-lift sticky top-28">
                  <h2 className="font-display text-2xl text-plum font-semibold border-b border-purple-200/60 pb-4">
                    Order Summary
                  </h2>

                  <div className="mt-6 space-y-3.5 text-sm text-muted-foreground">
                    {/* Gift Wrap Toggle */}
                    <div className="rounded-2xl border border-purple-200/80 bg-purple-50/60 p-4 hover:bg-purple-50/80 transition-colors">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={giftWrap.enabled}
                          onChange={(e) => {
                            setGiftWrapOption(e.target.checked, giftWrap.note);
                            setGiftWrap({ enabled: e.target.checked, note: giftWrap.note });
                          }}
                          className="w-4 h-4 mt-0.5 rounded text-purple-600 focus:ring-purple-400 cursor-pointer"
                        />
                        <div className="flex-1 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-purple-950 flex items-center gap-1.5">
                              <Gift size={14} className="text-purple-600" />
                              Wax-Sealed Gift Packaging
                            </span>
                            <span className="font-black text-purple-700">+₹{GIFT_WRAP_PRICE}</span>
                          </div>
                          <p className="text-muted-foreground mt-0.5">
                            Rigid luxury box, satin ribbon & handwritten wax-sealed card
                          </p>
                          {giftWrap.enabled && (
                            <input
                              type="text"
                              value={giftWrap.note || ""}
                              onChange={(e) => {
                                setGiftWrapOption(true, e.target.value);
                                setGiftWrap({ enabled: true, note: e.target.value });
                              }}
                              placeholder="Personal message for calligraphy gift card..."
                              className="mt-2.5 w-full rounded-xl border border-purple-200 bg-white px-3 py-1.5 text-xs text-purple-950 placeholder:text-purple-400 focus:outline-none focus:ring-1 focus:ring-purple-400 transition-all"
                            />
                          )}
                        </div>
                      </label>
                    </div>

                    <div className="flex justify-between">
                      <span>Items Subtotal ({itemCount})</span>
                      <span className="font-semibold text-plum">₹{subtotal.toLocaleString("en-IN")}</span>
                    </div>
                    {giftWrap.enabled && (
                      <div className="flex justify-between">
                        <span>Wax-Sealed Gift Pack</span>
                        <span className="font-semibold text-purple-700">+₹{GIFT_WRAP_PRICE}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Atelier Shipping</span>
                      <span>
                        {remainingForFreeShipping === 0 ? (
                          <strong className="text-emerald-700 font-bold uppercase tracking-wider text-xs">Free</strong>
                        ) : (
                          "₹99 (Free over ₹999)"
                        )}
                      </span>
                    </div>

                    <div className="border-t border-purple-200/60 pt-4 flex justify-between items-baseline">
                      <span className="font-display text-lg font-bold text-plum">Total</span>
                      <span className="font-display text-2xl font-black text-purple-950">
                        ₹{(subtotal + (giftWrap.enabled ? GIFT_WRAP_PRICE : 0) + (remainingForFreeShipping === 0 ? 0 : 99)).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>

                  <div className="mt-8 space-y-3">
                    <button
                      onClick={() => navigate("/checkout")}
                      className="w-full rounded-full btn-royal py-4 text-xs font-semibold uppercase tracking-[0.16em] flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 active:scale-[0.98]"
                    >
                      <span>Proceed to Checkout</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>


                    <button
                      onClick={() => navigate("/shop")}
                      className="w-full rounded-full border border-purple-200 bg-white py-3 text-xs font-semibold text-plum hover:bg-purple-50 transition-colors"
                    >
                      Add more pieces
                    </button>
                  </div>

                  {/* Trust Badges */}
                  <div className="mt-6 border-t border-purple-100 pt-4 space-y-2.5">
                    <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
                      <ShieldCheck className="h-4 w-4 text-purple-700 shrink-0" />
                      <span>Secure SSL checkout with 100% handmade guarantee</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
                      <Heart className="h-3.5 w-3.5 text-pink-500 shrink-0" />
                      <span>Handcrafted with love in India</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
                      <Truck className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                      <span>Express insured delivery nationwide</span>
                    </div>
                  </div>
                </div>
              </FadeIn>
            </div>
          )}
        </div>
      </main>

      {/* Global Luxury Atelier Footer */}
      <Footer />
    </div>
  );
}
