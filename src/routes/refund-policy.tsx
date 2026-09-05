import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, SiteLayout } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/refund-policy")({
  component: RefundPolicyPage,
  head: () => ({
    meta: [
      { title: "Refund & Cancellation Policy — Inventive Queen" },
      {
        name: "description",
        content:
          "Refund, cancellation, and exchange policy for custom handmade crochet dolls, flowers, and plushies from Inventive Queen.",
      },
      { property: "og:title", content: "Refund & Cancellation Policy — Inventive Queen" },
      {
        property: "og:description",
        content: "Transparent refund, return, and cancellation policies for Inventive Queen handmade products.",
      },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "/refund-policy" },
    ],
    links: [{ rel: "canonical", href: "/refund-policy" }],
  }),
});

const REFUND_SECTIONS = [
  {
    title: "1. The Handmade Craft Nature",
    text: "Every doll, everlasting flower bouquet, and plushie at Inventive Queen is uniquely handcrafted stitch by stitch to order. Because of the individualized labor and custom materials committed to each piece, standard off-the-shelf return policies do not apply.",
  },
  {
    title: "2. Order Cancellation Window",
    text: "You may request an order cancellation within 24 hours of placing your order or before handcrafting has started. In this event, a 100% full refund will be processed back to your original payment method. Once yarn has been cut and crafting has commenced, orders cannot be cancelled.",
  },
  {
    title: "3. Damaged in Transit Guarantee",
    text: "We package every parcel with extreme care and protective padding. If your item unfortunately arrives damaged due to postal handling, please notify us within 48 hours of delivery with a clear unboxing video or photo. We will immediately arrange a complimentary remake or a full refund.",
  },
  {
    title: "4. Quality & Craftsmanship Discrepancies",
    text: "If there is an error made by our atelier (such as wrong yarn colors compared to your approved reference, or incorrect accessory), we will gladly repair or replace the piece at our expense.",
  },
  {
    title: "5. Refund Processing Timelines",
    text: "Approved refunds are credited directly back to your original payment source (credit/debit card, UPI account, or NetBanking) through Razorpay. Funds typically appear in your account statement within 3–5 business days.",
  },
  {
    title: "6. Non-Refundable Situations",
    text: "Refunds cannot be issued for parcels returned due to incomplete/wrong customer addresses, failure to answer courier delivery calls, or minor subjective handmade variations inherent to amigurumi craft.",
  },
];

function RefundPolicyPage() {
  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Customer Care"
        title="Refund & Cancellation"
        description="Clear, fair policies for our handmade custom creations. Your satisfaction is our royal priority."
      />

      <article className="mx-auto max-w-3xl px-4 py-16">
        <div className="space-y-6">
          {REFUND_SECTIONS.map((section) => (
            <div key={section.title} className="liquid-glass p-6 hover-lift">
              <h2 className="relative z-10 font-display text-2xl font-bold text-lilac-deep">
                {section.title}
              </h2>
              <p className="relative z-10 mt-3 text-muted-foreground leading-relaxed">
                {section.text}
              </p>
            </div>
          ))}

          <div className="liquid-glass p-6 hover-lift">
            <h2 className="relative z-10 font-display text-2xl font-bold text-lilac-deep">
              7. Need to Request a Cancellation or Refund?
            </h2>
            <p className="relative z-10 mt-3 text-muted-foreground leading-relaxed">
              To request a cancellation or report an issue with your received parcel, please reach out
              promptly via{" "}
              <Link
                to="/contact"
                className="font-semibold text-primary underline hover:text-lilac-deep transition-colors"
              >
                our contact page
              </Link>
              , or email us directly at{" "}
              <a
                href="mailto:support@inventivequeen.com"
                className="font-semibold text-primary underline hover:text-lilac-deep transition-colors"
              >
                support@inventivequeen.com
              </a>{" "}
              quoting your Order Number.
            </p>
          </div>
        </div>
      </article>
    </SiteLayout>
  );
}
