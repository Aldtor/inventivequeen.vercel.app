import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, ShoppingBag, Trash2, X, Sparkles, ArrowRight, Gift, MessageCircle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import {
  getCartItems,
  getCartCount,
  getCartTotal,
  updateCartItemQuantity,
  removeCartItem,
  CART_UPDATED_EVENT,
  CART_DRAWER_OPEN_EVENT,
  FREE_SHIPPING_THRESHOLD,
  getGiftWrapOption,
  setGiftWrapOption,
  GIFT_WRAP_PRICE,
  type CartItem,
  type GiftWrapOption,
} from "@/lib/cart";

export function CartDrawer() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<CartItem[]>([]);
  const [count, setCount] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [giftWrap, setGiftWrap] = useState<GiftWrapOption>(getGiftWrapOption());
  const navigate = useNavigate();

  const syncCart = () => {
    const current = getCartItems();
    setItems(current);
    setCount(getCartCount(current));
    setSubtotal(getCartTotal(current));
    setGiftWrap(getGiftWrapOption());
  };

  useEffect(() => {
    syncCart();

    const handleCartUpdate = () => syncCart();
    const handleDrawerOpen = () => {
      syncCart();
      setOpen(true);
    };

    window.addEventListener(CART_UPDATED_EVENT, handleCartUpdate);
    window.addEventListener(CART_DRAWER_OPEN_EVENT, handleDrawerOpen);
    window.addEventListener("storage", handleCartUpdate);

    return () => {
      window.removeEventListener(CART_UPDATED_EVENT, handleCartUpdate);
      window.removeEventListener(CART_DRAWER_OPEN_EVENT, handleDrawerOpen);
      window.removeEventListener("storage", handleCartUpdate);
    };
  }, []);

  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const shippingProgress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[60] bg-[#461c48]/35 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />

          {/* Drawer Sidebar */}
          <motion.aside
            className="fixed inset-y-0 right-0 z-[61] flex w-full max-w-md flex-col border-l border-purple-200/80 bg-[#FAF8F5]/95 backdrop-blur-xl shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            aria-label="Shopping basket"
          >
            {/* Header */}
            <header className="flex items-center justify-between border-b border-purple-200/70 px-6 py-5 bg-white/70">
              <h2 className="flex items-center gap-2.5 font-display text-xl text-plum font-semibold">
                <ShoppingBag className="h-5 w-5 text-purple-700" />
                <span>Your Atelier Basket</span>
                {count > 0 && <span className="text-xs font-semibold text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full">({count})</span>}
              </h2>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close basket"
                className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-purple-100/60 hover:text-plum"
              >
                <X className="h-4 w-4" />
              </button>
            </header>

            {/* Free Delivery Bar */}
            <div className="border-b border-purple-200/50 bg-purple-50/60 px-6 py-3">
              <div className="flex items-center justify-between text-xs font-medium text-plum">
                <span>
                  {remainingForFreeShipping === 0 ? (
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <Sparkles className="h-3 w-3 text-amber-500" /> You unlocked FREE Atelier Shipping!
                    </span>
                  ) : (
                    <>Add ₹{remainingForFreeShipping} more for <strong>FREE shipping</strong></>
                  )}
                </span>
                <span className="font-semibold text-purple-700">{Math.round(shippingProgress)}%</span>
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-purple-200/60">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 transition-all duration-500"
                  style={{ width: `${shippingProgress}%` }}
                />
              </div>
            </div>

            {/* Content */}
            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
                <div className="h-16 w-16 rounded-full bg-purple-100/80 flex items-center justify-center text-purple-500 shadow-inner">
                  <ShoppingBag className="h-8 w-8 text-purple-600/70" />
                </div>
                <h3 className="font-display text-lg text-plum font-medium">Your basket is empty</h3>
                <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
                  Discover our handmade crochet bouquets, keepsake plushies, and custom commissions.
                </p>
                <button
                  onClick={() => {
                    setOpen(false);
                    navigate("/shop");
                  }}
                  className="mt-2 rounded-full btn-royal px-7 py-2.5 text-xs font-semibold uppercase tracking-[0.16em]"
                >
                  Browse the collection
                </button>
              </div>
            ) : (
              <>
                <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 rounded-2xl border border-purple-200/70 bg-white/80 p-3.5 shadow-sm hover:border-purple-300 transition-all"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-20 w-20 rounded-xl object-cover border border-purple-100 shrink-0"
                      />
                      <div className="flex flex-1 flex-col justify-between">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="text-sm font-semibold text-plum line-clamp-1">
                              {item.name}
                            </h4>
                            {item.color && (
                              <p className="text-[11px] text-muted-foreground mt-0.5">
                                Color: {item.color}
                              </p>
                            )}
                            {item.custom && (
                              <p className="text-[11px] text-purple-700 italic mt-0.5">
                                Note: {item.custom}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => removeCartItem(item.id)}
                            aria-label={`Remove ${item.name}`}
                            className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-rose-50 hover:text-rose-600"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        <div className="mt-3 flex items-center justify-between">
                          {/* Quantity Counter */}
                          <div className="flex items-center rounded-full border border-purple-200 bg-purple-50/50">
                            <button
                              onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)}
                              aria-label="Decrease quantity"
                              className="rounded-full p-1 text-muted-foreground hover:bg-white hover:text-plum transition-colors"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-7 text-center text-xs font-semibold text-plum">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                              aria-label="Increase quantity"
                              className="rounded-full p-1 text-muted-foreground hover:bg-white hover:text-plum transition-colors"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>

                          <span className="font-display text-sm font-bold text-plum">
                            {item.price}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer / Checkout */}
                <footer className="border-t border-purple-200/70 bg-white/95 p-5 backdrop-blur-md">
                  {/* Gift Wrap Toggle */}
                  <div className="mb-3.5 rounded-2xl border border-purple-200/80 bg-purple-50/60 p-3">
                    <label className="flex items-start gap-2.5 cursor-pointer">
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
                            <Gift size={13} className="text-purple-600" />
                            Wax-Sealed Gift Box
                          </span>
                          <span className="font-black text-purple-700">+₹{GIFT_WRAP_PRICE}</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          Rigid luxury box, satin ribbon & handwritten wax-sealed note
                        </p>
                        {giftWrap.enabled && (
                          <input
                            type="text"
                            value={giftWrap.note || ""}
                            onChange={(e) => {
                              setGiftWrapOption(true, e.target.value);
                              setGiftWrap({ enabled: true, note: e.target.value });
                            }}
                            placeholder="Recipient message (optional)..."
                            className="mt-2 w-full rounded-lg border border-purple-200 bg-white px-2.5 py-1 text-[11px] text-purple-950 placeholder:text-purple-400 focus:outline-none focus:ring-1 focus:ring-purple-400"
                          />
                        )}
                      </div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                    <span>Items Subtotal</span>
                    <span className="font-semibold text-plum">₹{subtotal.toLocaleString("en-IN")}</span>
                  </div>
                  {giftWrap.enabled && (
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                      <span>Wax-Sealed Packaging</span>
                      <span className="font-semibold text-purple-700">+₹{GIFT_WRAP_PRICE}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-2.5">
                    <span>Atelier Shipping</span>
                    <span>
                      {remainingForFreeShipping === 0 ? (
                        <strong className="text-emerald-700 font-bold uppercase tracking-wider text-[11px]">Free</strong>
                      ) : (
                        "₹99 (Free over ₹999)"
                      )}
                    </span>
                  </div>

                  <div className="border-t border-purple-100 pt-2 mb-3 flex items-baseline justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-purple-950">Estimated Total</span>
                    <span className="font-display text-lg font-black text-purple-950">
                      ₹{(subtotal + (giftWrap.enabled ? GIFT_WRAP_PRICE : 0) + (remainingForFreeShipping === 0 ? 0 : 99)).toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => {
                        setOpen(false);
                        navigate("/checkout");
                      }}
                      className="w-full rounded-full btn-royal py-3 text-xs font-semibold uppercase tracking-[0.16em] flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all"
                    >
                      <span>Proceed to Checkout</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => {
                          const itemsText = items.map((i) => `• ${i.name} (Qty: ${i.quantity}) - ${i.price}${i.color ? ` [${i.color}]` : ""}${i.custom ? ` [${i.custom}]` : ""}`).join("\n");
                          const finalTotal = subtotal + (giftWrap.enabled ? GIFT_WRAP_PRICE : 0) + (remainingForFreeShipping === 0 ? 0 : 99);
                          const text = encodeURIComponent(
                            `Hello Inventive Queen Atelier! 👑\n\nI would like to order my basket:\n${itemsText}\n\n• Subtotal: ₹${subtotal.toLocaleString("en-IN")}\n• Gift Pack: ${giftWrap.enabled ? `Yes (+₹${GIFT_WRAP_PRICE})` : "Standard"}\n• Total Amount: ₹${finalTotal.toLocaleString("en-IN")}\n\nPlease confirm availability and dispatch schedule!`
                          );
                          window.open(`https://wa.me/917892305330?text=${text}`, "_blank");
                        }}
                        className="w-full rounded-full border border-emerald-300 bg-emerald-50 py-2 text-[11px] font-bold text-emerald-900 hover:bg-emerald-100 transition-colors flex items-center justify-center gap-1.5"
                      >
                        <MessageCircle size={13} className="text-emerald-600" />
                        <span>WhatsApp Order</span>
                      </button>

                      <button
                        onClick={() => {
                          setOpen(false);
                          navigate("/cart");
                        }}
                        className="w-full rounded-full border border-purple-200 bg-purple-50/70 py-2 text-[11px] font-bold text-plum hover:bg-purple-100 transition-colors"
                      >
                        View Full Basket
                      </button>
                    </div>
                  </div>
                </footer>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
