import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Minus, Package, Plus, ShoppingBag, Trash2, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/motion/FadeIn";
import logo from "@/assets/logo.png";
import {
  clearCart,
  getCartCount,
  getCartItems,
  getCartTotal,
  removeCartItem,
  updateCartItemQuantity,
  type CartItem,
} from "@/lib/cart";

const CartPage = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<CartItem[]>(getCartItems);

  const itemCount = useMemo(() => getCartCount(items), [items]);
  const total = useMemo(() => getCartTotal(items), [items]);

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
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary/15 selection:text-primary">
      <Navbar />

      <main className="flex-1">
        {/* Header Banner */}
        <section className="bg-fairytale-mesh border-b border-border/40 relative overflow-hidden py-12 md:py-16">
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
          <div className="container text-center relative z-10">
            <FadeIn>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card shadow-luxury-sm text-primary text-xs uppercase tracking-[0.22em] font-semibold mb-4">
                <span>👑</span> Royal Cart & Bag
              </div>
              <h1 className="font-display text-3xl md:text-5xl font-extrabold text-foreground tracking-tight">
                Your Handcrafted Treasures
              </h1>
              <p className="mt-3 text-muted-foreground max-w-lg mx-auto text-sm md:text-base leading-relaxed">
                Every item is individually stitched with milk cotton yarn and royal attention to detail.
              </p>

              {/* Free Packaging Ribbon */}
              <div className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-700 text-xs font-semibold shadow-sm">
                <span>🎀</span> Complimentary Royal Gift Wrapping, Wax Seal & Ribbon Included!
              </div>
            </FadeIn>
          </div>
        </section>

        <div className="container py-10 md:py-14 max-w-6xl">
          {items.length === 0 ? (
            <FadeIn>
              <div className="max-w-md mx-auto text-center py-16 px-6 glass-card rounded-3xl shadow-luxury-lg border border-border/50">
                <div className="relative mx-auto w-24 h-24 rounded-full p-1.5 bg-gradient-to-tr from-primary via-pink-400 to-amber-300 shadow-royal mb-6 animate-glow-pulse">
                  <img src={logo} alt="Inventive Queen" className="w-full h-full rounded-full object-cover" />
                  <span className="absolute -bottom-1 -right-1 text-xl select-none">👑</span>
                </div>
                <h2 className="font-display text-2xl font-bold text-foreground">
                  Your Cart is Empty
                </h2>
                <p className="mt-2.5 text-sm text-muted-foreground leading-relaxed">
                  The Queen's atelier has delightful bespoke dolls, eternal floral bouquets & cute charms waiting for you!
                </p>
                <div className="mt-7">
                  <Link
                    to="/"
                    className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full btn-gradient text-white text-sm font-bold shadow-royal-glow hover:shadow-luxury-lg active:scale-95 transition-all"
                  >
                    <Sparkles size={16} className="text-amber-200" />
                    <span>Explore Collections ✨</span>
                  </Link>
                </div>
              </div>
            </FadeIn>
          ) : (
            <div className="grid lg:grid-cols-[1fr_380px] gap-8 items-start">
              <FadeIn>
                <div className="space-y-4">
                  {items.map((item) => (
                    <article
                      key={item.id}
                      className="glass-card rounded-3xl p-5 md:p-6 shadow-luxury-sm hover:shadow-luxury transition-all duration-300 border border-border/50 group"
                    >
                      <div className="flex gap-4 sm:gap-6">
                        <Link to={`/product/${item.productId}`} className="flex-shrink-0">
                          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-gradient-to-br from-purple-50 via-white to-pink-50 p-2 flex items-center justify-center border border-border/40 shadow-sm group-hover:border-primary/40 transition-colors">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                        </Link>

                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <Link
                                  to={`/product/${item.productId}`}
                                  className="font-display text-base sm:text-lg font-bold text-foreground hover:text-primary transition-colors line-clamp-1"
                                >
                                  {item.name}
                                </Link>
                                <p className="mt-1 font-display text-base font-bold text-primary">
                                  {item.price}
                                </p>
                              </div>
                              <button
                                onClick={() => handleRemove(item.id)}
                                className="w-8 h-8 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 flex items-center justify-center transition-colors"
                                aria-label={`Remove ${item.name}`}
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>

                            <ItemDetails item={item} />
                          </div>

                          <div className="mt-4 pt-3 border-t border-border/30 flex items-center justify-between gap-3">
                            <div className="inline-flex items-center rounded-full border border-border/60 bg-white dark:bg-card overflow-hidden shadow-sm">
                              <button
                                onClick={() => handleQuantity(item.id, item.quantity - 1)}
                                className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                                aria-label={`Decrease ${item.name} quantity`}
                              >
                                <Minus size={13} />
                              </button>
                              <span className="w-9 text-center text-xs font-body font-bold text-foreground">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => handleQuantity(item.id, item.quantity + 1)}
                                className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                                aria-label={`Increase ${item.name} quantity`}
                              >
                                <Plus size={13} />
                              </button>
                            </div>
                            <span className="text-[11px] text-primary/80 font-semibold flex items-center gap-1">
                              <Sparkles size={12} className="text-amber-500" />
                              Hand-stitched
                            </span>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </FadeIn>

              {/* Order Summary Sidebar */}
              <FadeIn delay={0.1}>
                <aside className="glass-card rounded-3xl p-6 shadow-luxury-lg border border-border/60 lg:sticky lg:top-24">
                  <div className="flex items-center gap-2 pb-4 border-b border-border/40">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <Package size={16} />
                    </div>
                    <div>
                      <h2 className="font-display text-lg font-bold text-foreground">
                        Order Summary
                      </h2>
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                        Bespoke Atelier Checkout
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 space-y-3.5 text-sm font-body">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Items</span>
                      <span className="font-semibold text-foreground">{itemCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-semibold text-foreground">Rs. {total}</span>
                    </div>
                    <div className="flex justify-between text-xs text-emerald-600 font-medium">
                      <span>Royal Gift Box Packaging</span>
                      <span className="font-bold uppercase tracking-wider bg-emerald-500/10 px-2 py-0.5 rounded-full">FREE 🎁</span>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Pan-India Shipping</span>
                      <span className="font-medium text-foreground">Calculated at checkout</span>
                    </div>
                  </div>

                  <div className="mt-6 border-t border-border/50 pt-4 flex justify-between items-baseline">
                    <div>
                      <span className="font-body text-xs uppercase tracking-wider text-muted-foreground font-semibold block">Total Amount</span>
                      <span className="text-[11px] text-muted-foreground">All taxes included</span>
                    </div>
                    <span className="font-display text-2xl font-extrabold text-gradient-royal">Rs. {total}</span>
                  </div>

                  <div className="mt-6 space-y-2.5">
                    <button
                      onClick={() => navigate("/checkout?cart=1")}
                      className="w-full py-3.5 px-6 rounded-2xl btn-gradient text-white text-sm font-bold shadow-royal-glow hover:shadow-luxury-lg active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                      <Sparkles size={16} className="text-amber-200" />
                      <span>Proceed to Royal Checkout</span>
                      <ArrowRight size={15} />
                    </button>
                    <button
                      onClick={handleClear}
                      className="w-full py-2.5 rounded-xl text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/5 font-medium transition-colors"
                    >
                      Clear Shopping Bag
                    </button>
                  </div>

                  <div className="mt-5 pt-4 border-t border-border/30 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                    <ShieldCheck size={14} className="text-emerald-500" />
                    <span>100% Secure Checkout & Payment</span>
                  </div>
                </aside>
              </FadeIn>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

function ItemDetails({ item }: { item: CartItem }) {
  const details = [
    item.color ? `Color: ${item.color}` : null,
    item.flowers?.length ? `Flowers: ${item.flowers.join(", ")}` : null,
    item.custom ? `Custom: ${item.custom}` : null,
  ].filter(Boolean);

  if (details.length === 0) return null;

  return (
    <div className="mt-2 space-y-1">
      {details.map((detail) => (
        <p key={detail} className="font-body text-xs text-muted-foreground/90 line-clamp-2 bg-secondary/40 px-2.5 py-1 rounded-lg border border-border/30 w-fit">
          {detail}
        </p>
      ))}
    </div>
  );
}

export default CartPage;
