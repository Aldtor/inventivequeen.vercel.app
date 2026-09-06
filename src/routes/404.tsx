import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Compass,
  Crown,
  Flower2,
  Heart,
  Home,
  Package,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/404")({
  component: NotFoundPage,
  head: () => ({
    meta: [
      { title: "Page Not Found — Inventive Queen" },
      {
        name: "description",
        content:
          "Oops! This royal crochet page has unravelled. Explore our handmade collections instead.",
      },
    ],
  }),
});

const DISCOVERY_LINKS = [
  {
    to: "/dolls",
    title: "Crochet Dolls",
    desc: "Custom portraits & plushies",
    icon: Heart,
    color: "from-rose-200 to-pink-100 text-rose-700",
  },
  {
    to: "/flowers",
    title: "Everlasting Flowers",
    desc: "Never-fading crochet bouquets",
    icon: Flower2,
    color: "from-amber-200 to-yellow-100 text-amber-700",
  },
  {
    to: "/characters",
    title: "Character Atelier",
    desc: "Anime & gaming favorites",
    icon: Crown,
    color: "from-purple-200 to-indigo-100 text-purple-700",
  },
  {
    to: "/orders",
    title: "Track Orders",
    desc: "Review your crafting progress",
    icon: Package,
    color: "from-teal-200 to-emerald-100 text-emerald-700",
  },
];

export function RoyalNotFoundContent() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:py-24 text-center">
      <div className="liquid-glass relative overflow-hidden rounded-4xl p-8 sm:p-14 shadow-2xl border border-white/60">
        <div className="blob absolute -top-16 -right-16 size-56 bg-lilac/40 pointer-events-none" />
        <div className="blob absolute -bottom-16 -left-16 size-56 bg-primary/30 pointer-events-none" />

        {/* Big 404 Badge */}
        <div className="relative inline-flex flex-col items-center">
          <span className="liquid-glass inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold text-lilac-deep mb-4">
            <Sparkles className="size-3 text-amber-500" /> Lost in the Yarn Stash
          </span>
          <div className="flex items-center justify-center font-display text-7xl sm:text-9xl font-black text-lilac-deep tracking-tight select-none">
            4
            <span className="inline-flex items-center justify-center size-16 sm:size-24 rounded-3xl bg-gradient-to-tr from-amber-200 to-purple-200 text-amber-800 mx-2 shadow-inner animate-bounce">
              <Sparkles className="size-10 sm:size-14 text-amber-700" />
            </span>
            4
          </div>
        </div>

        <h1 className="sheen-text relative mt-4 font-display text-3xl sm:text-4xl font-extrabold text-lilac-deep">
          Oops! Tangled in Yarn!
        </h1>
        <p className="relative mt-3 text-sm sm:text-base text-muted-foreground max-w-md mx-auto leading-relaxed">
          The royal page you're searching for seems to have unravelled or rolled under the velvet
          couch. Let's guide you back to our handmade realm.
        </p>

        {/* Primary Action Buttons */}
        <div className="relative mt-8 flex flex-wrap justify-center gap-3">
          <Link
            to="/"
            className="clay-primary liquid-btn inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-white shadow-xl hover:scale-105 transition-transform"
          >
            <Home className="size-4" /> Return to Palace Home
          </Link>
          <Link
            to="/checkout"
            className="clay inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-lilac-deep hover:bg-white/50 transition-colors"
          >
            <ShoppingBag className="size-4" /> View Basket
          </Link>
        </div>

        {/* Quick Discovery Grid */}
        <div className="relative mt-12 pt-10 border-t border-white/50 text-left">
          <p className="text-xs font-bold tracking-wider text-muted-foreground uppercase text-center mb-6 flex items-center justify-center gap-1.5">
            <Sparkles className="size-3 text-amber-500 inline" />
            <span>Or explore our popular royal collections</span>
          </p>

          <div className="grid gap-3.5 sm:grid-cols-2">
            {DISCOVERY_LINKS.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className="clay-soft group flex items-center gap-3.5 rounded-2xl p-3.5 transition-all hover:scale-102 hover:bg-white/60"
                >
                  <div
                    className={`flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr ${link.color} shadow-sm transition-transform group-hover:scale-110`}
                  >
                    <Icon className="size-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-sm font-bold text-lilac-deep group-hover:text-primary transition-colors">
                      {link.title}
                    </h3>
                    <p className="text-xs text-muted-foreground truncate">{link.desc}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function NotFoundPage() {
  return (
    <SiteLayout>
      <RoyalNotFoundContent />
    </SiteLayout>
  );
}
