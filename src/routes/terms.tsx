import { createFileRoute, Link } from "@tanstack/react-router";

import { PageHeader, SiteLayout } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/terms")({
  component: TermsPage,
  head: () => ({
    meta: [
      { title: "Terms & Conditions — Inventive Queen" },
      {
        name: "description",
        content:
          "Terms and conditions for ordering handmade crochet dolls, plushies and flowers from Inventive Queen.",
      },
      { property: "og:title", content: "Terms & Conditions — Inventive Queen" },
      {
        property: "og:description",
        content: "Ordering terms, payment, shipping and cancellation policy for Inventive Queen.",
      },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "/terms" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/terms" }],
  }),
});

const SECTIONS = [
  {
    title: "1. Orders",
    text: "All orders are custom-made by hand after details and pricing are confirmed. A slot is reserved once payment or deposit is received, not when the inquiry is sent.",
  },
  {
    title: "2. Pricing",
    text: "Prices are listed on each pricelist page and may change based on complexity, size, accessories or rush requests. Final quotes are sent before work begins.",
  },
  {
    title: "3. Payment",
    text: "Payment details are shared after your order is confirmed. Full payment or an agreed deposit is required before crafting starts. Orders are non-refundable once materials have been purchased or work has begun.",
  },
  {
    title: "4. Shipping",
    text: "Items are packed carefully and shipped nationwide. Shipping fees and delivery times depend on your location and courier availability. Inventive Queen is not responsible for delays caused by the courier.",
  },
  {
    title: "5. Cancellations",
    text: "Cancellations made before work begins may receive a partial or full refund depending on materials purchased. Once crafting has started, orders cannot be cancelled.",
  },
  {
    title: "6. Custom designs",
    text: "All custom pieces are handmade interpretations of the reference provided. Exact replication of licensed characters, logos or branded designs may not always be possible. I reserve the right to decline orders that infringe copyright or trademark.",
  },
];

function TermsPage() {
  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Legal"
        title="Terms & Conditions"
        description="Please read these terms before placing an order. By ordering, you agree to the policies below."
      />

      <article className="mx-auto max-w-3xl px-4 py-16">
        <div className="space-y-6">
          {SECTIONS.map((section) => (
            <div key={section.title} className="liquid-glass p-6 hover-lift">
              <h2 className="relative z-10 font-display text-2xl font-bold text-lilac-deep">{section.title}</h2>
              <p className="relative z-10 mt-3 text-muted-foreground">{section.text}</p>
            </div>
          ))}

          <div className="liquid-glass p-6 hover-lift">
            <h2 className="relative z-10 font-display text-2xl font-bold text-lilac-deep">7. Contact</h2>
            <p className="relative z-10 mt-3 text-muted-foreground">
              For questions about these terms or your order, please{" "}
              <Link to="/contact" className="font-semibold text-primary underline hover:text-lilac-deep transition-colors">
                contact me
              </Link>
              .
            </p>
          </div>
        </div>
      </article>
    </SiteLayout>
  );
}
