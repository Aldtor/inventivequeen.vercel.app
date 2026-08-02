import { useState } from "react";
import { Instagram, Mail, Heart, Shield, Truck, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.jpg";
import { policyLinks } from "@/lib/policies";
import { useToast } from "@/hooks/use-toast";

const Footer = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    toast({
      title: "You're subscribed!",
      description: "You'll be the first to know about new creations.",
    });
    setEmail("");
  };

  return (
    <footer id="footer" className="border-t border-border/60 bg-card/50">
      {/* Newsletter section */}
      <div className="border-b border-border/60">
        <div className="container py-12 md:py-16">
          <div className="max-w-xl mx-auto text-center">
            <p className="text-xs uppercase tracking-[0.25em] text-primary font-body font-semibold">
              Stay Connected
            </p>
            <h3 className="mt-3 font-display text-2xl md:text-3xl font-bold text-foreground">
              Be the First to Know
            </h3>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              New creations, special launches, and behind-the-scenes stories — delivered to your inbox.
            </p>
            <form onSubmit={handleNewsletter} className="mt-6 flex gap-3 max-w-sm mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                required
                className="flex-1 h-11 px-4 rounded-full bg-background border border-border text-sm font-body placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-all"
                aria-label="Email address for newsletter"
              />
              <button
                type="submit"
                className="h-11 px-6 rounded-full bg-primary text-primary-foreground font-body font-semibold text-sm shadow-md shadow-primary/15 hover:shadow-lg hover:shadow-primary/20 hover:brightness-105 active:scale-[0.97] transition-all duration-200 flex items-center gap-2"
              >
                Subscribe
                <ArrowRight size={14} />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-1 flex flex-col items-center md:items-start gap-4">
            <div className="flex items-center gap-3">
              <img
                src={logo}
                alt="Inventive Queen"
                className="w-10 h-10 rounded-full object-cover ring-2 ring-brand-blush"
              />
              <span className="font-display text-lg font-semibold text-foreground">
                Inventive Queen
              </span>
            </div>
            <p className="text-sm text-muted-foreground text-center md:text-left max-w-xs leading-relaxed">
              Handmade crochet gifts crafted stitch by stitch for your most special moments.
              Each piece is a labor of love — unique, personal, and made to last.
            </p>
          </div>

          {/* Quick links */}
          <div className="flex flex-col items-center md:items-start gap-3">
            <h4 className="font-body text-xs font-semibold text-foreground uppercase tracking-[0.15em]">
              Shop
            </h4>
            <Link to="/category/bouquet" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200">
              Crochet Flowers
            </Link>
            <Link to="/category/doll" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200">
              Dolls
            </Link>
            <Link to="/category/keychain" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200">
              Keychains
            </Link>
            <Link to="/orders" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200">
              My Orders
            </Link>
          </div>

          {/* Policies */}
          <div className="flex flex-col items-center md:items-start gap-3">
            <h4 className="font-body text-xs font-semibold text-foreground uppercase tracking-[0.15em]">
              Policies
            </h4>
            {policyLinks.map((l) => (
              <Link
                key={l.slug}
                to={`/policy/${l.slug}`}
                className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Contact */}
          <div className="flex flex-col items-center md:items-start gap-3">
            <h4 className="font-body text-xs font-semibold text-foreground uppercase tracking-[0.15em]">
              Get in Touch
            </h4>
            <a
              href="mailto:inventivequeen.cs@gmail.com"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
            >
              <Mail size={15} /> inventivequeen.cs@gmail.com
            </a>
            <a
              href="https://www.instagram.com/inventivequeen"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
            >
              <Instagram size={15} /> @inventivequeen
            </a>
          </div>
        </div>

        {/* Trust + Payment row */}
        <div className="mt-10 pt-8 border-t border-border/60">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Trust badges */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-muted-foreground">
              <span className="inline-flex items-center gap-1.5 text-xs font-body font-medium">
                <Shield size={13} className="text-primary" /> Secure Payments
              </span>
              <span className="w-px h-3 bg-border hidden md:block" />
              <span className="inline-flex items-center gap-1.5 text-xs font-body font-medium">
                <Truck size={13} className="text-primary" /> Pan-India Delivery
              </span>
              <span className="w-px h-3 bg-border hidden md:block" />
              <span className="inline-flex items-center gap-1.5 text-xs font-body font-medium">
                <Heart size={13} className="text-primary" /> 100% Handmade
              </span>
            </div>

            {/* Payment methods */}
            <div className="flex items-center gap-3">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-body font-medium">
                We accept
              </span>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded bg-background border border-border text-[10px] font-body font-semibold text-foreground/70">
                  UPI
                </span>
                <span className="px-2.5 py-1 rounded bg-background border border-border text-[10px] font-body font-semibold text-foreground/70">
                  Razorpay
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground inline-flex items-center gap-1.5">
            Made with <Heart size={11} className="text-primary fill-primary" /> by Inventive Queen · © {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
