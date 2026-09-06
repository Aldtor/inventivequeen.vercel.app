import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, SiteLayout } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/privacy")({
  component: PrivacyPage,
  head: () => ({
    meta: [
      { title: "Privacy Policy — Inventive Queen" },
      {
        name: "description",
        content:
          "Privacy policy for Inventive Queen. Learn how we safeguard your personal data, addresses, and payment privacy.",
      },
      { property: "og:title", content: "Privacy Policy — Inventive Queen" },
      {
        property: "og:description",
        content: "How Inventive Queen protects your privacy and personal data.",
      },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "/privacy" },
    ],
    links: [{ rel: "canonical", href: "/privacy" }],
  }),
});

const PRIVACY_SECTIONS = [
  {
    title: "1. Information We Collect",
    text: "When you place an order or create a royal account with Inventive Queen, we collect necessary contact information including your full name, shipping address, 10-digit mobile number, and email address. This information is strictly used to handcraft, pack, ship, and deliver your customized crochet pieces.",
  },
  {
    title: "2. Secure Payment Processing",
    text: "All online financial transactions are processed through Razorpay, a PCI-DSS Level 1 compliant payment gateway. Inventive Queen never stores, views, or retains your credit card numbers, CVVs, netbanking credentials, or UPI PINs. All financial communications occur over encrypted TLS/SSL channels.",
  },
  {
    title: "3. Account Security with Supabase",
    text: "User accounts, order tracking records, and shipping addresses are stored on Supabase using industry-standard AES encryption at rest and role-based row-level security (RLS). Only authenticated customers and verified atelier administrators can access relevant order histories.",
  },
  {
    title: "4. No Selling of Personal Data",
    text: "We consider your trust sacred. Inventive Queen will NEVER sell, rent, trade, or distribute your personal data, email, or telephone number to external advertisers, marketers, or data brokers.",
  },
  {
    title: "5. Courier & Delivery Partners",
    text: "To deliver your parcels safely, we provide your name, shipping address, and phone number to trusted nationwide courier partners (e.g. India Post, BlueDart, Delhivery) exclusively for shipping label creation and delivery coordination.",
  },
  {
    title: "6. Your Rights & Data Requests",
    text: "You hold the right to inspect, correct, or request the erasure of your personal account information and order history at any time. Simply send an email to privacy@inventivequeen.com or contact us directly.",
  },
];

function PrivacyPage() {
  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Trust & Security"
        title="Privacy Policy"
        description="Your trust is as sacred as our craftsmanship. Learn how we protect your personal information."
      />

      <article className="mx-auto max-w-3xl px-4 py-16">
        <div className="space-y-6">
          {PRIVACY_SECTIONS.map((section) => (
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
              7. Contact Our Privacy Officer
            </h2>
            <p className="relative z-10 mt-3 text-muted-foreground leading-relaxed">
              If you have any questions or requests regarding our privacy policy, please reach out
              via{" "}
              <Link
                to="/contact"
                className="font-semibold text-primary underline hover:text-lilac-deep transition-colors"
              >
                our contact page
              </Link>{" "}
              or email{" "}
              <a
                href="mailto:privacy@inventivequeen.com"
                className="font-semibold text-primary underline hover:text-lilac-deep transition-colors"
              >
                privacy@inventivequeen.com
              </a>
              .
            </p>
          </div>
        </div>
      </article>
    </SiteLayout>
  );
}
