import { createFileRoute } from "@tanstack/react-router";

import { OrderCta, PageHeader, PriceCard, SiteLayout } from "@/components/site/SiteLayout";

/* Real flower/bouquet images */
import bouquetRose from "@/assets/products/bouquets/product-bouquet-rose.png";
import bouquetSunflower from "@/assets/products/bouquets/product-bouquet-sunflower.jpg";
import bouquetTulip from "@/assets/products/bouquets/product-bouquet-tulip.jpg";
import bouquetPastel from "@/assets/products/bouquets/product-bouquet-pastel.png";
import bouquetPastel2 from "@/assets/products/bouquets/product-bouquet-pastel-2.png";
import bouquetMixed1 from "@/assets/products/bouquets/product-bouquet-mixed-1.png";
import bouquetMixed2 from "@/assets/products/bouquets/product-bouquet-mixed-2.png";
import bouquetMixed3 from "@/assets/products/bouquets/product-bouquet-mixed-3.png";
import bouquetMixed4 from "@/assets/products/bouquets/product-bouquet-mixed-4.png";
import bouquetMixed5 from "@/assets/products/bouquets/product-bouquet-mixed-5.png";
import bouquetGrand from "@/assets/products/bouquets/product-bouquet-grand.png";
import bouquetLily from "@/assets/products/bouquets/product-bouquet-lily-2.png";
import bouquetLily3 from "@/assets/products/bouquets/product-bouquet-lily-3.png";
import bouquetLily4 from "@/assets/products/bouquets/product-bouquet-lily-4.png";
import bouquetLily5 from "@/assets/products/bouquets/product-bouquet-lily-5.png";
import bouquetLily6 from "@/assets/products/bouquets/product-bouquet-lily-6.png";
import bouquetLilyVase from "@/assets/products/bouquets/product-bouquet-lily-vase.png";
import bouquetRose2 from "@/assets/products/bouquets/product-bouquet-rose-2.png";
import bouquetRose3 from "@/assets/products/bouquets/product-bouquet-rose-3.png";
import roseHandheld from "@/assets/products/bouquets/product-rose-bouquet-handheld.png";
import roseRibbon from "@/assets/products/bouquets/product-rose-bouquet-ribbon.png";
import roseTagged from "@/assets/products/bouquets/product-rose-bouquet-tagged.png";
import catForeverFlowers from "@/assets/products/categories/cat-forever-flowers.jpg";

export const Route = createFileRoute("/flowers")({
  component: FlowersPage,
  head: () => ({
    meta: [
      { title: "Crochet Flower Pricelist — Inventive Queen" },
      {
        name: "description",
        content:
          "Handmade crochet flowers and bouquets by Inventive Queen — tulips, roses, daisies and lavender that never wilt, wrapped with ribbon.",
      },
      { property: "og:title", content: "Crochet Flowers — Inventive Queen" },
      {
        property: "og:description",
        content: "Everlasting crochet bouquets: tulips, roses, daisies and lavender.",
      },
      { property: "og:type", content: "product" },
      { property: "og:url", content: "/flowers" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/flowers" }],
  }),
});

const FLOWERS = [
  { name: "Sunflower", size: "4×4 in · 6×6 in", price: "₹500 – ₹700", image: bouquetSunflower },
  { name: "Tulip", size: "Single stem", price: "₹260 per piece", image: bouquetTulip },
  { name: "Rose", size: "Single stem", price: "₹300 per piece", image: bouquetRose, badge: "💐 Popular" },
  { name: "Gradient Rose", size: "Single stem", price: "₹200 per piece", image: bouquetRose2 },
  { name: "Daisy", size: "Single stem", price: "₹200 per piece", image: bouquetPastel },
  { name: "Lavender", size: "Single stem", price: "₹100 per piece", image: catForeverFlowers },
];

/* Bouquet Gallery */
const GALLERY = [
  { src: bouquetGrand, alt: "Grand bouquet" },
  { src: bouquetMixed1, alt: "Mixed bouquet 1" },
  { src: bouquetMixed2, alt: "Mixed bouquet 2" },
  { src: bouquetMixed3, alt: "Mixed bouquet 3" },
  { src: bouquetMixed4, alt: "Mixed arrangement" },
  { src: bouquetMixed5, alt: "Mixed bouquet 5" },
  { src: bouquetPastel2, alt: "Pastel bouquet" },
  { src: bouquetLily, alt: "Lily bouquet" },
  { src: bouquetLily3, alt: "Lily arrangement" },
  { src: bouquetLily4, alt: "Lily stems" },
  { src: bouquetLily5, alt: "Lily bouquet large" },
  { src: bouquetLily6, alt: "Lily collection" },
  { src: bouquetLilyVase, alt: "Lily vase" },
  { src: bouquetRose3, alt: "Rose bouquet" },
  { src: roseHandheld, alt: "Rose bouquet handheld" },
  { src: roseRibbon, alt: "Rose with ribbon" },
  { src: roseTagged, alt: "Rose bouquet tagged" },
];

import { useProducts } from "@/lib/cms-products";

function FlowersPage() {
  const { products } = useProducts();
  const cmsFlowers = products.filter((p) => p.type === "bouquet");
  const displayFlowers =
    cmsFlowers.length > 0
      ? cmsFlowers.map((p) => ({
          name: p.name,
          size: p.size || "Hand-tied stem / wrap",
          price: p.sellingPrice || p.price,
          note: p.tagline || p.description,
          image: p.images[0] || bouquetRose,
          badge: p.badge,
        }))
      : FLOWERS;

  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Pricelist"
        title="Crochet flowers"
        description="All prices include basic wrapping and ribbon. Want a flower that isn't listed? Send a photo and I'll see if I can make it."
      />
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-16 sm:grid-cols-2 lg:grid-cols-3">
        {displayFlowers.map((flower) => (
          <PriceCard key={flower.name} {...flower} />
        ))}
      </div>

      {/* Bouquet Gallery */}
      <section className="aurora-rich border-y border-white/50 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center text-2xl font-extrabold text-lilac-deep mb-2">
            Bouquet gallery
          </h2>
          <p className="text-center text-sm text-muted-foreground mb-8">
            Past bouquet orders — pick your favourite flowers and I'll wrap them up for you.
          </p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {GALLERY.map((item) => (
              <div key={item.alt} className="liquid-glass img-hover-zoom overflow-hidden p-1.5 hover-lift">
                <img
                  src={item.src}
                  alt={item.alt}
                  width={300}
                  height={300}
                  loading="lazy"
                  className="aspect-square w-full rounded-[1.2rem] object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <OrderCta
        title="Build your own bouquet"
        text="Tell me the flowers and colours you want and I'll wrap them up for you."
      />
    </SiteLayout>
  );
}
