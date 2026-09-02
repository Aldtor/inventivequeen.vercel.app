import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { CheckCircle, Heart, Truck, Clock, Gift, Package, Sparkles, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import logo from "@/assets/logo.png";

const timelineSteps = [
  { icon: CheckCircle, label: "Order Placed", active: true },
  { icon: Clock, label: "Hand-Crafting", active: false },
  { icon: Package, label: "Packed & Sealed", active: false },
  { icon: Gift, label: "Royal Delivery", active: false },
];

export default function SuccessPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const orderNumber = params.get("order_number");
  const paymentId = params.get("payment_id");

  return (
    <div className="min-h-screen bg-fairytale-mesh flex items-center justify-center px-4 py-12 relative overflow-hidden selection:bg-primary/15 selection:text-primary">
      {/* Decorative ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-md w-full text-center space-y-6 relative z-10"
      >
        {/* Success Mascot Emblem */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
          className="mx-auto relative w-24 h-24 rounded-full p-1.5 bg-gradient-to-tr from-primary via-pink-400 to-amber-300 shadow-royal flex items-center justify-center animate-glow-pulse"
        >
          <img src={logo} alt="Inventive Queen" className="w-full h-full rounded-full object-cover" />
          <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg border-2 border-white">
            <CheckCircle size={16} />
          </div>
        </motion.div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs font-bold">
            <span>✨</span> Payment Confirmed
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
            Order Successfully Placed!
          </h1>
          <p className="font-body text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
            Thank you for supporting our craft! Your bespoke creation will be made with love and dispatched in <span className="font-bold text-foreground">3–7 days</span>.
          </p>
        </div>

        {/* Order Details Card */}
        {(orderNumber || paymentId) && (
          <div className="glass-card rounded-3xl p-5 shadow-luxury-sm border border-border/60 space-y-2 text-left">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Order Number</span>
              <span className="font-display text-base font-bold text-primary">{orderNumber}</span>
            </div>
            {paymentId && (
              <div className="flex items-center justify-between pt-2 border-t border-border/30">
                <span className="text-xs text-muted-foreground">Payment ID</span>
                <span className="text-xs font-mono text-muted-foreground/80 truncate max-w-[180px]">{paymentId}</span>
              </div>
            )}
          </div>
        )}

        {/* What Happens Next Card */}
        <div className="glass-card rounded-3xl p-6 shadow-luxury-sm border border-border/60">
          <p className="font-body text-xs uppercase tracking-[0.15em] text-primary font-bold mb-4">
            Crafting & Delivery Journey
          </p>
          <div className="grid grid-cols-4 gap-2">
            {timelineSteps.map((step) => (
              <div key={step.label} className="flex flex-col items-center gap-1.5">
                <div className={`w-8 h-8 rounded-2xl flex items-center justify-center transition-all ${
                  step.active
                    ? "bg-primary text-white shadow-royal"
                    : "bg-secondary text-muted-foreground/60"
                }`}>
                  <step.icon size={14} />
                </div>
                <span className="text-[10px] font-semibold text-foreground leading-tight">
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Brand Note */}
        <div className="glass-panel rounded-2xl p-4 text-xs text-muted-foreground space-y-1">
          <p className="flex items-center justify-center gap-1.5 font-semibold text-foreground">
            <Heart size={13} className="text-pink-500 fill-pink-500" /> Handcrafted with royal care in India
          </p>
          <p>We will keep you updated via WhatsApp on each crafting milestone.</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link
            to="/orders"
            className="flex-1 py-3 px-6 rounded-2xl btn-gradient text-white text-xs font-bold shadow-royal-glow hover:shadow-luxury transition-all flex items-center justify-center gap-2"
          >
            <Package size={14} />
            <span>Track My Order</span>
          </Link>
          <Link
            to="/"
            className="py-3 px-6 rounded-2xl glass-card hover:bg-white text-xs font-semibold text-foreground transition-all flex items-center justify-center gap-1.5 shadow-sm"
          >
            <span>Back to Atelier</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
