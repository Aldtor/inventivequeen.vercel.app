import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Sparkles, ShieldCheck } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import { policies, type PolicySlug } from "@/lib/policies";
import NotFound from "./NotFound";
import { useEffect } from "react";
import { FadeIn } from "@/components/motion/FadeIn";

const PolicyPage = () => {
  const { slug } = useParams<{ slug: PolicySlug }>();
  const policy = slug ? policies[slug] : undefined;

  useEffect(() => {
    window.scrollTo(0, 0);
    if (policy) {
      document.title = `${policy.title} · Inventive Queen`;
    }
  }, [policy]);

  if (!policy) return <NotFound />;

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#461c48] font-sans selection:bg-purple-200 selection:text-purple-900">
      <SiteHeader />

      <main className="flex-1 pt-28 sm:pt-36">
        {/* Header */}
        <section className="bg-fairytale-mesh border-b border-border/40 py-12 md:py-16 relative overflow-hidden">
          <div className="container max-w-3xl relative z-10">
            <FadeIn>
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors mb-6"
              >
                <ArrowLeft size={14} /> Back to Atelier
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

        {/* Policy Body */}
        <div className="container max-w-3xl py-12 md:py-16">
          <FadeIn delay={0.1}>
            <article className="glass-card rounded-3xl p-7 sm:p-10 shadow-luxury-lg border border-border/60 space-y-10">
              {policy.sections.map((section, i) => (
                <section key={i} className="space-y-3 pb-8 border-b border-border/30 last:border-b-0 last:pb-0">
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
                        <p key={j} className="text-foreground/80 leading-relaxed [text-wrap:pretty]">
                          {block}
                        </p>
                      )
                    )}
                  </div>
                </section>
              ))}
            </article>
          </FadeIn>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PolicyPage;
