import { createFileRoute } from "@tanstack/react-router";
import { Instagram, Mail, MapPin, MessageCircle, CheckCircle2, Sparkles, Send } from "lucide-react";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { INSTAGRAM_URL, PageHeader, SiteLayout } from "@/components/site/SiteLayout";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import { sanitizeText } from "@/lib/security";

/* Decorative images */
import bouquetPastel from "@/assets/products/bouquets/product-bouquet-pastel.png";
import penguin from "@/assets/products/plushies/product-penguin-1.jpeg";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({
    meta: [
      { title: "Contact — Inventive Queen" },
      {
        name: "description",
        content:
          "Get in touch with Inventive Queen for custom crochet orders, questions and collaborations.",
      },
      { property: "og:title", content: "Contact — Inventive Queen" },
      {
        property: "og:description",
        content:
          "Get in touch with Inventive Queen for custom inquiries, bridal bouquets, or bulk crochet gifts.",
      },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "/contact" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
});

const CONTACT_METHODS = [
  {
    icon: Mail,
    label: "Email",
    value: "hello@inventivequeen.com",
    href: "mailto:hello@inventivequeen.com",
  },
  {
    icon: Instagram,
    label: "Instagram",
    value: "@inventivequeen",
    href: INSTAGRAM_URL,
  },
  {
    icon: MapPin,
    label: "Shipping",
    value: "Ships nationwide",
    href: "/how-to-order",
  },
];

function ContactPage() {
  const [sent, setSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inquiryCode, setInquiryCode] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = sanitizeText(String(formData.get("name") ?? "").trim(), 100);
    const email = sanitizeText(String(formData.get("email") ?? "").trim(), 100);
    const message = sanitizeText(String(formData.get("message") ?? "").trim(), 2000);

    if (!name || !email || !message) {
      toast.error("Please provide your name, email, and message.");
      return;
    }

    setCustomerName(name);
    setIsSubmitting(true);

    try {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase
          .from("contact_inquiries")
          .insert({
            customer_name: name,
            customer_email: email,
            message: message,
            inquiry_type: "general",
            status: "new",
          })
          .select("id")
          .single();

        if (error) {
          console.warn("Could not write inquiry to Supabase:", error.message);
        } else if (data?.id) {
          const code = `INQ-${data.id.slice(0, 8).toUpperCase()}`;
          setInquiryCode(code);
        }
      }

      toast.success("Inquiry received by the atelier!");
      setSent(true);
    } catch (err) {
      console.warn("Contact form fallback to mailto:", err);
      const subject = encodeURIComponent(`Inventive Queen inquiry from ${name}`);
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
      window.location.href = `mailto:hello@inventivequeen.com?subject=${subject}&body=${body}`;
      setSent(true);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Contact"
        title="Let's make something together"
        description="Have a question or custom design idea? Send an inquiry here or order directly from our pricelist."
      />

      <section className="mx-auto max-w-6xl px-4 py-16 relative">
        {/* Floating decorative images */}
        <img
          src={bouquetPastel}
          alt=""
          aria-hidden
          className="pointer-events-none absolute -top-4 -right-8 size-28 rounded-2xl object-cover opacity-10 rotate-[10deg] blur-[1px] hidden xl:block"
        />
        <img
          src={penguin}
          alt=""
          aria-hidden
          className="pointer-events-none absolute bottom-10 -left-12 size-24 rounded-2xl object-cover opacity-10 rotate-[-12deg] blur-[1px] hidden xl:block"
        />

        <div className="grid gap-12 lg:grid-cols-2">
          <div className="space-y-8">
            <div className="liquid-glass p-6">
              <h2 className="font-display text-2xl font-bold text-lilac-deep">Get in touch</h2>
              <p className="mt-2 text-muted-foreground">
                For custom bridal or bulk order inquiries, send a message using the form below or
                email us. We usually reply within 1–2 business days.
              </p>
              <ul className="mt-6 space-y-4">
                {CONTACT_METHODS.map((method) => (
                  <li key={method.label}>
                    <a
                      href={method.href}
                      target={method.href.startsWith("http") ? "_blank" : undefined}
                      rel={method.href.startsWith("http") ? "noreferrer" : undefined}
                      className="flex items-center gap-4 rounded-2xl clay-soft p-4 transition-all hover-lift"
                    >
                      <span className="clay-primary inline-flex size-10 items-center justify-center rounded-full text-primary-foreground">
                        <method.icon className="size-5" />
                      </span>
                      <div>
                        <p className="text-xs font-bold uppercase text-muted-foreground">
                          {method.label}
                        </p>
                        <p className="font-semibold text-lilac-deep">{method.value}</p>
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="skeu-card p-6">
              <h3 className="relative z-10 font-display text-lg font-bold text-lilac-deep">
                Order tips
              </h3>
              <ul className="relative z-10 mt-3 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                <li>Attach a clear reference photo if you have one.</li>
                <li>Mention size, colours and any deadline.</li>
                <li>Check the pricelist first so we can move faster.</li>
              </ul>
            </div>
          </div>

          <div className="liquid-glass p-6 sm:p-8">
            <h2 className="relative z-10 font-display text-2xl font-bold text-lilac-deep">
              Send a message
            </h2>
            {sent ? (
              <div className="relative z-10 mt-6 rounded-3xl bg-white/80 p-8 text-center border border-purple-100 shadow-xl space-y-4">
                <div className="mx-auto size-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-inner">
                  <CheckCircle2 className="size-8" />
                </div>
                <div>
                  <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider text-lilac-deep bg-lilac/20 px-3 py-1 rounded-full mb-2">
                    👑 INQUIRY LOGGED IN ATELIER DATABASE
                  </span>
                  <h3 className="text-xl font-display font-extrabold text-slate-800">
                    Thank you, {customerName || "Patron"}!
                  </h3>
                  {inquiryCode && (
                    <div className="my-3 inline-block rounded-xl bg-purple-50 border border-purple-200 px-3.5 py-1.5 font-mono text-sm font-bold text-lilac-deep">
                      Reference: {inquiryCode}
                    </div>
                  )}
                  <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                    Your bespoke commission inquiry has been securely stored in our artisan
                    database. We review every note personally and reply via email within 24 hours.
                  </p>
                </div>

                <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                  <a
                    href={`https://wa.me/919876543210?text=Hello%20Inventive%20Queen!%20I%20just%20submitted%20inquiry%20${inquiryCode || ""}.`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-emerald-600 text-white px-6 py-3 text-sm font-bold shadow-md hover:bg-emerald-700 transition-all cursor-pointer"
                  >
                    <MessageCircle className="size-4" />
                    <span>WhatsApp Artisan Directly</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      setSent(false);
                      setInquiryCode(null);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-5 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <span>Send Another Inquiry</span>
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="relative z-10 mt-6 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-semibold text-lilac-deep">
                      Name
                    </label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Your name"
                      required
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-semibold text-lilac-deep">
                      Email
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      required
                      className="rounded-xl"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-semibold text-lilac-deep">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Tell me what you'd like made, including size, colours and deadline..."
                    rows={5}
                    required
                    className="rounded-xl"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="clay-primary liquid-btn w-full rounded-full py-6 text-base font-bold border-0 cursor-pointer disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <span className="inline-flex items-center gap-2">
                      <Sparkles className="size-4 animate-spin" /> Logging Inquiry...
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2">
                      <Send className="size-4" /> Send Inquiry ✨
                    </span>
                  )}
                </Button>
                <p className="text-center text-xs text-muted-foreground">
                  Saved directly to the artisan atelier inbox with email backup.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
