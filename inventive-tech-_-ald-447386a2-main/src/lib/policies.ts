export type PolicySlug = "privacy" | "terms" | "refund" | "shipping";

type Block = string | string[];
type Section = { heading: string; body: Block[] };
type Policy = { title: string; updated: string; sections: Section[] };

export const policies: Record<PolicySlug, Policy> = {
  privacy: {
    title: "Privacy Policy",
    updated: "March 2026",
    sections: [
      {
        heading: "1. Information We Collect",
        body: [
          "When you place an order or contact us, we may collect your name, phone number, email address, delivery address, and order details. We only collect information that is necessary to fulfil your order and communicate with you.",
        ],
      },
      {
        heading: "2. How We Use Your Information",
        body: [
          [
            "To process and deliver your orders",
            "To communicate about your order status or custom requests",
            "To respond to your queries via WhatsApp, email, or Instagram",
            "To improve our products and services",
          ],
        ],
      },
      {
        heading: "3. Information Sharing",
        body: [
          "We do not sell, trade, or share your personal information with third parties. Your data may only be shared with delivery partners to fulfil your order.",
        ],
      },
      {
        heading: "4. Data Security",
        body: [
          "We take reasonable steps to protect your personal information. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.",
        ],
      },
      {
        heading: "5. Cookies",
        body: [
          "Our website may use basic cookies for functionality purposes. We do not use tracking or advertising cookies.",
        ],
      },
      {
        heading: "6. Contact Us",
        body: [
          "If you have any questions about this Privacy Policy, please reach out to us at inventivequeen.cs@gmail.com.",
        ],
      },
    ],
  },
  terms: {
    title: "Terms & Conditions",
    updated: "March 2026",
    sections: [
      {
        heading: "1. General",
        body: [
          "By placing an order with Inventive Queen, you agree to these Terms & Conditions. All products are handmade, and slight variations in colour, size, and texture are natural and add to the uniqueness of each piece.",
        ],
      },
      {
        heading: "2. Orders",
        body: [
          [
            "Orders are placed securely through our website with instant Razorpay online payment.",
            "Custom orders require confirmation of design details before production begins.",
            "Once a custom order is confirmed and production has started, it cannot be cancelled.",
          ],
        ],
      },
      {
        heading: "3. Pricing",
        body: [
          "All prices are listed in Indian Rupees (₹) and are inclusive of GST where applicable. Shipping charges, if any, will be communicated before order confirmation.",
        ],
      },
      {
        heading: "4. Product Descriptions",
        body: [
          "We strive to display colours and details as accurately as possible. However, actual products may vary slightly from photos due to the handmade nature and screen display differences.",
        ],
      },
      {
        heading: "5. Intellectual Property",
        body: [
          "All designs, images, and content on this website are the property of Inventive Queen and may not be reproduced without permission.",
        ],
      },
      {
        heading: "6. Contact",
        body: ["For any questions, reach us at inventivequeen.cs@gmail.com."],
      },
    ],
  },
  refund: {
    title: "Refund Policy",
    updated: "March 2026",
    sections: [
      {
        heading: "1. Handmade Products",
        body: [
          "Since all our products are handmade and crafted to order, we generally do not accept returns or offer refunds. Each piece is made with care specifically for you.",
        ],
      },
      {
        heading: "2. Damaged or Defective Items",
        body: [
          "If you receive a damaged or defective product, please contact us within 48 hours of delivery with clear photos of the issue. We will assess the situation and offer a replacement or a suitable resolution.",
        ],
      },
      {
        heading: "3. Custom Orders",
        body: [
          "Custom orders are non-refundable once production has begun. Please review all details carefully before confirming your custom order.",
        ],
      },
      {
        heading: "4. Wrong Item Received",
        body: [
          "In the rare case that you receive the wrong item, please reach out to us immediately. We will arrange for the correct product to be sent to you at no additional cost.",
        ],
      },
      {
        heading: "5. How to Reach Us",
        body: [
          "For any refund-related queries, contact us at inventivequeen.cs@gmail.com or message us on Instagram.",
        ],
      },
    ],
  },
  shipping: {
    title: "Shipping Policy",
    updated: "March 2026",
    sections: [
      {
        heading: "1. Processing Time",
        body: [
          "All products are handmade to order. Please allow 3–7 business days for your item to be crafted. Custom orders may take longer depending on complexity — we will inform you of the estimated timeline at the time of confirmation.",
        ],
      },
      {
        heading: "2. Shipping Within India",
        body: [
          [
            "We ship across India via trusted courier partners.",
            "Delivery typically takes 5–10 business days after dispatch, depending on your location.",
            "You will receive a tracking link once your order is shipped.",
          ],
        ],
      },
      {
        heading: "3. Shipping Charges",
        body: [
          "Shipping charges, if applicable, will be communicated before order confirmation. Free shipping may be available on select orders or during promotions.",
        ],
      },
      {
        heading: "4. Packaging",
        body: [
          "All items are carefully packaged to ensure they reach you in perfect condition. Gift packaging is available on request for a nominal extra charge.",
        ],
      },
      {
        heading: "5. Delivery Issues",
        body: [
          "If your order is delayed, lost, or arrives damaged during transit, please contact us within 48 hours at inventivequeen.cs@gmail.com. We will work with the courier partner to resolve the issue promptly.",
        ],
      },
      {
        heading: "6. International Shipping",
        body: [
          "We currently ship only within India. For international enquiries, please reach out to us directly and we'll try our best to accommodate your request.",
        ],
      },
    ],
  },
};

export const policyLinks: { label: string; slug: PolicySlug }[] = [
  { label: "Privacy Policy", slug: "privacy" },
  { label: "Terms & Conditions", slug: "terms" },
  { label: "Refund Policy", slug: "refund" },
  { label: "Shipping Policy", slug: "shipping" },
];
