import { createFileRoute } from "@tanstack/react-router";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PageHeader, SiteLayout, OrderCta } from "@/components/site/SiteLayout";

/* Decorative images */
import bouquetRose from "@/assets/products/bouquets/product-bouquet-rose.png";
import bearKeychain from "@/assets/products/keychains/product-yellow-bear-keychain.png";

export const Route = createFileRoute("/faq")({
  component: FaqPage,
  head: () => ({
    meta: [
      { title: "FAQ — Inventive Queen" },
      {
        name: "description",
        content:
          "Answers to common questions about custom crochet orders, sizing, shipping, payment and turnaround time at Inventive Queen.",
      },
      { property: "og:title", content: "FAQ — Inventive Queen" },
      {
        property: "og:description",
        content: "Common questions about custom crochet dolls, plushies and flower orders.",
      },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "/faq" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/faq" }],
  }),
});

const FAQS = [
  {
    question: "How do I place a custom order?",
    answer:
      "Send me a message on Instagram or email with your reference photo and details. We'll confirm the design, size, colours and price before I start making it.",
  },
  {
    question: "How long does each order take?",
    answer:
      "Most custom pieces take 1–2 weeks depending on complexity and my current queue. Rush orders may be possible — just ask.",
  },
  {
    question: "What can you make?",
    answer:
      "I make custom crochet dolls, character plushies, animals and crochet flowers. If you can send a reference photo, I can usually recreate it in yarn.",
  },
  {
    question: "Do you ship nationwide?",
    answer:
      "Yes. Orders are packed securely and shipped across the country. Shipping cost depends on location and will be added to your total.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "I accept bank transfer and popular payment apps. Details are shared after your order is confirmed.",
  },
  {
    question: "Can I request changes after seeing progress photos?",
    answer:
      "Small adjustments are usually possible during the early stages. Major changes after work has begun may incur an extra fee.",
  },
  {
    question: "Are the flowers really everlasting?",
    answer:
      "Crochet flowers won't wilt or need water. Keep them dusted and out of direct sunlight and they'll stay beautiful for years.",
  },
  {
    question: "Do you offer bulk or event orders?",
    answer:
      "Yes — weddings, birthdays, giveaways and event bouquets are welcome. Bulk pricing is available for larger orders.",
  },
];

function FaqPage() {
  return (
    <SiteLayout>
      <PageHeader
        eyebrow="FAQ"
        title="Questions & answers"
        description="Everything you need to know before ordering your custom crochet piece."
      />

      <section className="mx-auto max-w-3xl px-4 py-16 relative">
        {/* Floating decorative images */}
        <img
          src={bouquetRose}
          alt=""
          aria-hidden
          className="pointer-events-none absolute -top-8 -right-12 size-24 rounded-2xl object-cover opacity-10 rotate-[12deg] blur-[1px] hidden lg:block"
        />
        <img
          src={bearKeychain}
          alt=""
          aria-hidden
          className="pointer-events-none absolute bottom-20 -left-16 size-20 rounded-2xl object-cover opacity-10 rotate-[-10deg] blur-[1px] hidden lg:block"
        />

        <div className="liquid-glass overflow-hidden rounded-3xl">
          <Accordion type="single" collapsible className="px-6 divide-y divide-white/30">
            {FAQS.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-b-0 py-1">
                <AccordionTrigger className="font-display text-lg font-bold text-lilac-deep hover:text-primary transition-colors">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-4">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <OrderCta
        title="Still have questions?"
        text="Send me a message and I'll get back to you as soon as I can."
      />
    </SiteLayout>
  );
}
