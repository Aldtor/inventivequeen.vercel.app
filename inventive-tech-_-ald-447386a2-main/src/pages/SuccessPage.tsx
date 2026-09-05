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

const confettiColors = [
  "hsl(270 78% 56%)", "hsl(295 68% 62%)", "hsl(42 85% 58%)",
  "hsl(315 70% 68%)", "hsl(142 76% 46%)", "hsl(200 80% 60%)",
];

export default function SuccessPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const orderNumber = params.get("order_number") || params.get("order");
  const paymentId = params.get("payment_id");

  return (
    <div className="min-h-screen bg-fairytale-mesh flex items-center justify-center px-4 py-12 relative overflow-hidden selection:bg-primary/15 selection:text-primary">
      {/* Decorative ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      {/* Confetti Particles */}
      {confettiColors.map((color, i) => (
        <div
          key={i}
          className="confetti-piece"
          style={{
            background: color,
            left: `${15 + i * 13}%`,
            top: `${5 + (i % 3) * 8}%`,
            animationDelay: `${i * 0.3}s`,
            animationDuration: `${2 + (i % 3) * 0.5}s`,
            transform: `rotate(${i * 60}deg)`,
            borderRadius: i % 2 === 0 ? '50%' : '2px',
            width: `${6 + (i % 3) * 3}px`,
            height: `${6 + (i % 3) * 3}px`,
          }}
        />
      ))}
      {/* Second wave of confetti */}
      {confettiColors.map((color, i) => (
        <div
          key={`c2-${i}`}
          className="confetti-piece"
          style={{
            background: color,
            left: `${50 + i * 8}%`,
            top: `${2 + (i % 2) * 12}%`,
            animationDelay: `${0.5 + i * 0.25}s`,
            animationDuration: `${2.5 + (i % 2) * 0.4}s`,
            borderRadius: i % 2 === 0 ? '2px' : '50%',
            width: `${5 + (i % 3) * 2}px`,
            height: `${5 + (i % 3) * 2}px`,
          }}
        />
      ))}

      {/* Sparkle particles */}
      <div className="sparkle-particle top-20 left-1/4" style={{ animationDelay: "0s" }} />
      <div className="sparkle-particle top-32 right-1/4" style={{ animationDelay: "1s" }} />
      <div className="sparkle-particle bottom-20 left-1/3" style={{ animationDelay: "2s" }} />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-md w-full text-center space-y-6 relative z-10"
      >
        {/* Success Mascot Emblem — with animated ring */}
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
          className="mx-auto relative w-24 h-24 rounded-full p-1.5 bg-gradient-to-tr from-primary via-pink-400 to-amber-300 shadow-royal flex items-center justify-center animate-success-ring"
        >
          <img src={logo} alt="Inventive Queen" className="w-full h-full rounded-full object-cover" />
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.6, duration: 0.4, ease: "backOut" }}
            className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg border-2 border-white"
          >
            <CheckCircle size={16} />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="space-y-2"
        >
          <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs font-bold">
            <span>✨</span> Payment Confirmed
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
            Order Successfully Placed!
          </h1>
          <p className="font-body text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
            Thank you for supporting our craft! Your bespoke creation will be made with love and dispatched in <span className="font-bold text-foreground">3–7 days</span>.
          </p>
        </motion.div>

        {/* Order Details Card */}
        {(orderNumber || paymentId) && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.5 }}
            className="glass-card rounded-3xl p-5 shadow-luxury-sm border border-border/60 space-y-2 text-left"
          >
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
          </motion.div>
        )}

        {/* What Happens Next Card — Animated Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.5 }}
          className="glass-card rounded-3xl p-6 shadow-luxury-sm border border-border/60"
        >
          <p className="font-body text-xs uppercase tracking-[0.15em] text-primary font-bold mb-4">
            Crafting & Delivery Journey
          </p>
          <div className="grid grid-cols-4 gap-2">
            {timelineSteps.map((step, i) => (
              <motion.div
                key={step.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + i * 0.12, duration: 0.4 }}
                className="flex flex-col items-center gap-1.5"
              >
                <div className={`w-8 h-8 rounded-2xl flex items-center justify-center transition-all ${
                  step.active
                    ? "bg-primary text-white shadow-royal pulse-dot"
                    : "bg-secondary text-muted-foreground/60"
                }`}>
                  <step.icon size={14} />
                </div>
                <span className="text-[10px] font-semibold text-foreground leading-tight">
                  {step.label}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Brand Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="glass-panel rounded-2xl p-4 text-xs text-muted-foreground space-y-1"
        >
          <p className="flex items-center justify-center gap-1.5 font-semibold text-foreground">
            <Heart size={13} className="text-pink-500 fill-pink-500" /> Handcrafted with royal care in India
          </p>
          <p>We will keep your Royal Orders dashboard updated on each crafting milestone.</p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-3 pt-2"
        >
          <Link
            to="/orders"
            className="flex-1 py-3 px-6 rounded-2xl btn-gradient text-white text-xs font-bold shadow-royal-glow hover:shadow-luxury transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5"
          >
            <Package size={14} />
            <span>Track My Order</span>
          </Link>
          <Link
            to="/"
            className="py-3 px-6 rounded-2xl glass-card hover:bg-white text-xs font-semibold text-foreground transition-all flex items-center justify-center gap-1.5 shadow-sm hover:-translate-y-0.5"
          >
            <span>Back to Atelier</span>
            <ArrowRight size={13} />
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
