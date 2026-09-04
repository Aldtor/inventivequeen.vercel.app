import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ShieldCheck, ChevronRight } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import { policies, type PolicySlug } from "@/lib/policies";
import NotFound from "./NotFound";
import { useEffect, useState, useRef, useCallback } from "react";
import { FadeIn } from "@/components/motion/FadeIn";

const PolicyPage = () => {
  const { slug } = useParams<{ slug: PolicySlug }>();
  const policy = slug ? policies[slug] : undefined;
  const [readingProgress, setReadingProgress] = useState(0);
  const articleRef = useRef<HTMLElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (policy) {
      document.title = `${policy.title} · Inventive Queen`;
    }
  }, [policy]);

  // Reading progress bar
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        setReadingProgress(Math.min(100, (scrollTop / docHeight) * 100));
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!policy) return <NotFound />;

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-[#461c48] font-sans selection:bg-purple-200 selection:text-purple-900">
      {/* Reading Progress Bar */}
      <div
        className="reading-progress"
        style={{ width: `${readingProgress}%` }}
        aria-hidden="true"
      />

      <SiteHeader />

      <main className="flex-1 pt-28 sm:pt-36 relative">
        {/* Decorative Orbs */}
        <div className="decorative-orb w-64 h-64 bg-purple-400/10 -top-20 -right-24" style={{ animationDelay: "0s" }} />
        <div className="decorative-orb w-48 h-48 bg-pink-300/10 bottom-40 -left-16" style={{ animationDelay: "5s" }} />

        {/* Header */}
        <section className="bg-fairytale-mesh border-b border-border/40 py-12 md:py-16 relative overflow-hidden">
          <div className="container max-w-3xl relative z-10">
            <FadeIn>
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors mb-6 group"
              >
                <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" /> Back to Atelier
              </Link>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass-card shadow-luxury-sm text-primary text-xs font-bold uppercase tracking-wider mb-3 block w-fit">
                <ShieldCheck size={13} className="text-emerald-500" />
                Atelier Policy
              </div>
              <h1 className="font-display text-3xl md:text-5xl font-extrabold text-foreground tracking-tight text-balance">
                {policy.title}
              </h1>
              <p className="mt-3 text-xs text-muted-foreground uppercase tracking-widest font-semibold">
                Last updated: {policy.updated}
              </p>
            </FadeIn>
          </div>
        </section>

        <div className="container max-w-3xl py-12 md:py-16 relative z-10">
          <div className="grid lg:grid-cols-[1fr_200px] gap-8 items-start">
            {/* Policy Body */}
            <FadeIn delay={0.1}>
              <article ref={articleRef} className="glass-card rounded-3xl p-7 sm:p-10 shadow-luxury-lg border border-border/60 space-y-10">
                {policy.sections.map((section, i) => (
                  <section key={i} id={`section-${i}`} className="space-y-3 pb-8 border-b border-border/30 last:border-b-0 last:pb-0 scroll-mt-32">
                    <h2 className="font-display text-xl md:text-2xl font-bold text-foreground">
                      {section.heading}
                    </h2>
                    <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                      {section.body.map((block, j) =>
                        Array.isArray(block) ? (
                          <ul key={j} className="list-disc pl-5 space-y-2 text-foreground/85">
                            {block.map((item, k) => (
                              <li key={k}>{item}</li>
                            ))}
                          </ul>
                        ) : (
                          <p key={j} className={`text-foreground/80 leading-relaxed [text-wrap:pretty] ${j === 0 && i === 0 ? "drop-cap" : ""}`}>
                            {block}
                          </p>
                        )
                      )}
                    </div>
                  </section>
                ))}
              </article>
            </FadeIn>

            {/* Table of Contents Sidebar */}
            <FadeIn delay={0.2} direction="right">
              <aside className="hidden lg:block sticky top-32">
                <div className="glass-panel rounded-2xl p-4 border border-border/40 space-y-1">
                  <p className="text-[10px] uppercase tracking-wider font-bold text-primary mb-3">
                    Table of Contents
                  </p>
                  {policy.sections.map((section, i) => (
                    <a
                      key={i}
                      href={`#section-${i}`}
                      className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors py-1.5 px-2 rounded-lg hover:bg-primary/5 group"
                    >
                      <ChevronRight size={11} className="text-primary/40 group-hover:text-primary shrink-0 transition-colors" />
                      <span className="line-clamp-1">{section.heading}</span>
                    </a>
                  ))}
                </div>
              </aside>
            </FadeIn>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PolicyPage;
