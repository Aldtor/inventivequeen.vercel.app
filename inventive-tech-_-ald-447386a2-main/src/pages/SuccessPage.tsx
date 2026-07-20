import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle, Heart, Truck, Clock, Gift, Package } from "lucide-react";
import { motion } from "framer-motion";

const timelineSteps = [
  { icon: CheckCircle, label: "Order Placed", active: true },
  { icon: Clock, label: "Crafting", active: false },
  { icon: Package, label: "Shipped", active: false },
  { icon: Gift, label: "Delivered", active: false },
];

export default function SuccessPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const orderNumber = params.get("order_number");
  const paymentId = params.get("payment_id");

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        className="max-w-sm w-full text-center space-y-7"
      >
        {/* Success icon */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          className="mx-auto w-[72px] h-[72px] rounded-full bg-brand-blush flex items-center justify-center"
        >
          <CheckCircle className="w-9 h-9 text-primary" />
        </motion.div>

        <div className="space-y-3">
          <h1 className="font-display text-2xl md:text-3xl text-foreground leading-tight">
            Order Placed!
          </h1>
          <p className="font-body text-sm text-muted-foreground leading-relaxed text-pretty">
            Thank you for your order! Your handcrafted gift is being made with love
            and will be delivered in <span className="font-semibold text-foreground">3–7 days</span>.
          </p>
        </div>

        {(orderNumber || paymentId) && (
          <div className="bg-card rounded-2xl p-4 shadow-luxury-sm space-y-2">
            {orderNumber && (
              <p className="font-body text-sm text-primary font-semibold">
                Order {orderNumber}
              </p>
            )}
            {paymentId && (
              <p className="font-body text-[11px] text-muted-foreground break-all">
                Payment ID: {paymentId}
              </p>
            )}
          </div>
        )}

        {/* Delivery timeline */}
        <div className="bg-card rounded-2xl p-5 shadow-luxury-sm">
          <p className="font-body text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-4">
            What happens next
          </p>
          <div className="flex items-center justify-between px-1">
            {timelineSteps.map((step) => (
              <div key={step.label} className="flex flex-col items-center gap-1.5 flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step.active
                    ? "bg-primary text-primary-foreground"
                    : "bg-brand-blush/50 text-primary/40"
                }`}>
                  <step.icon size={14} />
                </div>
                <span className="text-[10px] font-body font-medium text-muted-foreground leading-tight text-center">
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Brand message */}
        <div className="bg-card rounded-2xl p-5 shadow-luxury-sm space-y-3">
          <div className="flex items-center justify-center gap-2">
            <Heart className="w-4 h-4 text-primary fill-primary" />
            <span className="font-body text-sm text-foreground font-medium">
              Made with love by Inventive Queen
            </span>
          </div>
          <p className="font-body text-xs text-muted-foreground">
            You'll receive order updates on WhatsApp
          </p>
          <p className="font-body text-xs text-primary font-medium">
            Handcrafted specially for you
          </p>
        </div>

        <div className="pt-2 space-y-3">
          <button
            onClick={() => navigate("/orders")}
            className="w-full py-3.5 rounded-xl bg-card border border-border text-foreground font-body font-semibold text-sm hover:border-primary/50 hover:bg-brand-blush/20 active:scale-[0.98] transition-all duration-200"
          >
            Track My Order
          </button>
          <button
            onClick={() => navigate("/")}
            className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-body font-semibold text-sm shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98] transition-all duration-200"
          >
            Continue Shopping
          </button>
        </div>
      </motion.div>
    </div>
  );
}
