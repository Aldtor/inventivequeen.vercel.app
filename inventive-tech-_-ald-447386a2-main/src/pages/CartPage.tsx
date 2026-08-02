import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Minus, Package, Plus, ShoppingBag, Trash2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/motion/FadeIn";
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
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        <section className="bg-secondary/30 border-b border-border/40">
          <div className="container py-12 md:py-16 text-center">
            <FadeIn>
              <p className="text-xs uppercase tracking-[0.25em] text-primary font-body font-semibold">
                Review Your Picks
              </p>
              <h1 className="mt-3 font-display text-3xl md:text-5xl font-bold text-foreground">
                Your Cart
              </h1>
              <p className="mt-4 text-muted-foreground max-w-lg mx-auto leading-relaxed">
                Add multiple handmade pieces and place one order when everything looks right.
              </p>
            </FadeIn>
          </div>
        </section>

        <div className="container py-10 md:py-14">
          {items.length === 0 ? (
            <FadeIn>
              <div className="max-w-md mx-auto text-center py-14">
                <div className="mx-auto w-16 h-16 rounded-2xl bg-brand-blush/60 flex items-center justify-center">
                  <ShoppingBag className="w-7 h-7 text-primary" />
                </div>
                <h2 className="mt-5 font-display text-2xl font-bold text-foreground">
                  Your cart is empty
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Browse the shop and add your favorite crochet creations.
                </p>
                <Button asChild className="mt-6 rounded-xl">
                  <Link to="/">Continue Shopping</Link>
                </Button>
              </div>
            </FadeIn>
          ) : (
            <div className="grid lg:grid-cols-[1fr_360px] gap-8 items-start">
              <FadeIn>
                <div className="space-y-4">
                  {items.map((item) => (
                    <article
                      key={item.id}
                      className="bg-card rounded-2xl p-4 md:p-5 shadow-luxury-sm border border-border/40"
                    >
                      <div className="flex gap-4">
                        <Link to={`/product/${item.productId}`} className="flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-24 h-24 md:w-28 md:h-28 rounded-xl object-contain bg-white shadow-sm"
                          />
                        </Link>

                        <div className="flex-1 min-w-0">
                          <div className="flex gap-3 justify-between">
                            <div className="min-w-0">
                              <Link
                                to={`/product/${item.productId}`}
                                className="font-body text-sm md:text-base font-semibold text-foreground hover:text-primary transition-colors line-clamp-1"
                              >
                                {item.name}
                              </Link>
                              <p className="mt-1 font-display text-base font-bold text-primary">
                                {item.price}
                              </p>
                            </div>
                            <button
                              onClick={() => handleRemove(item.id)}
                              className="w-9 h-9 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 flex items-center justify-center transition-colors"
                              aria-label={`Remove ${item.name}`}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>

                          <ItemDetails item={item} />

                          <div className="mt-4 flex items-center justify-between gap-3">
                            <div className="inline-flex items-center rounded-full border border-border bg-background overflow-hidden">
                              <button
                                onClick={() => handleQuantity(item.id, item.quantity - 1)}
                                className="w-9 h-9 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-brand-blush/30 transition-colors"
                                aria-label={`Decrease ${item.name} quantity`}
                              >
                                <Minus size={14} />
                              </button>
                              <span className="w-10 text-center text-sm font-body font-semibold text-foreground">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => handleQuantity(item.id, item.quantity + 1)}
                                className="w-9 h-9 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-brand-blush/30 transition-colors"
                                aria-label={`Increase ${item.name} quantity`}
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                            <p className="text-xs text-muted-foreground font-body">
                              Handmade to order
                            </p>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </FadeIn>

              <FadeIn delay={0.1}>
                <aside className="bg-card rounded-2xl p-5 shadow-luxury-sm border border-border/40 lg:sticky lg:top-24">
                  <div className="flex items-center gap-2">
                    <Package size={17} className="text-primary" />
                    <h2 className="font-display text-xl font-bold text-foreground">
                      Order Summary
                    </h2>
                  </div>

                  <div className="mt-5 space-y-3 border-t border-border/60 pt-4">
                    <div className="flex justify-between text-sm font-body">
                      <span className="text-muted-foreground">Items</span>
                      <span className="font-medium text-foreground">{itemCount}</span>
                    </div>
                    <div className="flex justify-between text-sm font-body">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium text-foreground">Rs. {total}</span>
                    </div>
                    <div className="flex justify-between text-xs font-body text-muted-foreground">
                      <span>Shipping</span>
                      <span>Calculated after confirmation</span>
                    </div>
                  </div>

                  <div className="mt-5 border-t border-border/60 pt-4 flex justify-between items-center">
                    <span className="font-body text-sm font-semibold text-foreground">Total</span>
                    <span className="font-display text-2xl font-bold text-primary">Rs. {total}</span>
                  </div>

                  <Button
                    size="lg"
                    onClick={() => navigate("/checkout?cart=1")}
                    className="mt-5 w-full rounded-xl text-base"
                  >
                    Checkout All Items
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleClear}
                    className="mt-3 w-full rounded-xl"
                  >
                    Clear Cart
                  </Button>
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
        <p key={detail} className="font-body text-xs text-muted-foreground line-clamp-2">
          {detail}
        </p>
      ))}
    </div>
  );
}

export default CartPage;

