import { Link, createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, ClipboardList, Crown } from "lucide-react";

import { PageHeader, SiteLayout } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/how-to-order")({
  component: HowToOrderPage,
  head: () => ({
    meta: [
      { title: "How to Order — Inventive Queen" },
      {
        name: "description",
        content:
          "The full ordering process at Inventive Queen: pick a design from the pricelist, send a reference photo, then confirm details and shipping.",
      },
      { property: "og:title", content: "How to Order — Inventive Queen" },
      {
        property: "og:description",
        content: "Three simple steps from picking a design to getting your parcel on its way.",
      },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "/how-to-order" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/how-to-order" }],
  }),
});

const STEPS = [
  {
    title: "Pick Your Crochet Creations",
    text: "Browse through our Dolls, Characters, and Everlasting Flower pricelists. Click 'Buy Now' or '+ Basket' on any piece to add it to your order with real-time price calculation.",
    icon: ClipboardList,
  },
  {
    title: "Sign In & Enter Delivery Details",
    text: "Before checking out, log in with your existing account or create a new Royal Account. Then enter your recipient name, 10-digit phone number, street address, and optional gift note.",
    icon: Crown,
  },
  {
    title: "Pay via Razorpay & Track Live",
    text: "Click 'Pay with Razorpay' for instant 100% secure payment (UPI, Cards, NetBanking). As soon as your order is confirmed, follow its progress live on your 'My Orders' page!",
    icon: CheckCircle2,
  },
];

function HowToOrderPage() {
  return (
    <SiteLayout>
      <PageHeader
        eyebrow="How to order"
        title="Direct Online Ordering"
        description="Place your order online in 3 simple steps, pay securely with Razorpay, and track your parcel live."
      />

      <div className="mx-auto max-w-3xl px-4 py-16">
        {/* Status badge */}
        <div className="liquid-glass p-6 text-center pulse-soft">
          <h2 className="font-display text-lg font-bold text-lilac-deep flex items-center justify-center gap-2">
            <span className="size-2.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
            <span>Online Orders &amp; Razorpay Checkout are LIVE!</span>
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Handcrafted amigurumi dolls, plushies and crochet bouquet orders shipped nationwide.
          </p>
        </div>

        {/* Steps */}
        <ol className="mt-12 space-y-6">
          {STEPS.map((step, i) => {
            const StepIcon = step.icon;
            return (
              <li key={step.title} className="skeu-card p-6">
                <div className="relative z-10 flex items-start gap-5">
                  <div className="hidden sm:flex size-16 flex-shrink-0 items-center justify-center rounded-2xl bg-lilac/30 border border-lilac/50 text-lilac-deep shadow-sm">
                    <StepIcon className="size-7" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="skeu-step">{i + 1}</span>
                      <h3 className="font-display text-2xl font-bold text-lilac-deep flex items-center gap-2">
                        <StepIcon className="size-5 text-lilac-deep/80 sm:hidden" />
                        <span>{step.title}</span>
                      </h3>
                    </div>
                    <p className="text-muted-foreground">{step.text}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>

        {/* CTA */}
        <div className="mt-14 text-center">
          <h2 className="sheen-text text-3xl font-extrabold">Ready to Order?</h2>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              to="/checkout"
              className="clay-primary liquid-btn inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-bold shadow-lg"
            >
              Go to Checkout
            </Link>
            <Link
              to="/dolls"
              className="clay inline-flex items-center rounded-full px-6 py-3.5 font-bold text-lilac-deep hover:bg-white/40"
            >
              Doll pricelist
            </Link>
            <Link
              to="/flowers"
              className="clay inline-flex items-center rounded-full px-6 py-3.5 font-bold text-lilac-deep hover:bg-white/40"
            >
              Flower pricelist
            </Link>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
