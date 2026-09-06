import { createFileRoute } from "@tanstack/react-router";
import { Instagram, Mail, MapPin, MessageCircle } from "lucide-react";
import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { INSTAGRAM_URL, PageHeader, SiteLayout } from "@/components/site/SiteLayout";

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

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();
    const subject = encodeURIComponent(`Inventive Queen inquiry from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
    window.location.href = `mailto:hello@inventivequeen.com?subject=${subject}&body=${body}`;
    setSent(true);
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
              <div className="relative z-10 mt-6 clay-soft p-6 text-center">
                <MessageCircle className="mx-auto size-8 text-lilac-deep" />
                <p className="mt-3 font-semibold text-lilac-deep">
                  Message opened in your email app
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Hit send in your email client to complete the inquiry.
                </p>
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
                  className="clay-primary liquid-btn w-full rounded-full py-6 text-base font-bold border-0"
                >
                  Send inquiry ✨
                </Button>
                <p className="text-center text-xs text-muted-foreground">
                  This opens your email app with the message pre-filled.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
