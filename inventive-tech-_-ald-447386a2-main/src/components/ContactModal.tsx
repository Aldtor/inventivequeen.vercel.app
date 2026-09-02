import { X, Mail, Instagram, MessageCircle, Crown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface ContactModalProps {
  open: boolean;
  onClose: () => void;
}

const ContactModal = ({ open, onClose }: ContactModalProps) => {
  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-md bg-card/95 backdrop-blur-2xl rounded-3xl border border-border/60 shadow-luxury-lg p-8 z-10"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-secondary/60 hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-all"
              aria-label="Close"
            >
              <X size={16} />
            </button>

            <div className="text-center mb-7">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-3">
                <Crown size={20} className="text-primary" />
              </div>
              <h3 className="font-display text-xl font-bold text-foreground">
                Get in Touch
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Reach out for commissions, inquiries, or collaborations.
              </p>
            </div>

            <div className="space-y-3">
              <a
                href="https://instagram.com/inventivequeen"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-2xl bg-secondary/40 hover:bg-secondary/60 border border-border/50 hover:border-primary/30 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white shadow-sm">
                  <Instagram size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">Instagram DM</p>
                  <p className="text-xs text-muted-foreground">@inventivequeen</p>
                </div>
              </a>

              <a
                href="mailto:hello@inventivequeen.com"
                className="flex items-center gap-4 p-4 rounded-2xl bg-secondary/40 hover:bg-secondary/60 border border-border/50 hover:border-primary/30 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-sm">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">Email</p>
                  <p className="text-xs text-muted-foreground">hello@inventivequeen.com</p>
                </div>
              </a>

              <a
                href="https://wa.me/919999999999"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-2xl bg-secondary/40 hover:bg-secondary/60 border border-border/50 hover:border-primary/30 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-white shadow-sm">
                  <MessageCircle size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">WhatsApp</p>
                  <p className="text-xs text-muted-foreground">Quick response</p>
                </div>
              </a>
            </div>

            <p className="text-center text-xs text-muted-foreground/60 mt-6">
              Usually responds within 24 hours ✨
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ContactModal;
