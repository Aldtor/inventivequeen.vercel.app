import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { policies, type PolicySlug } from "@/lib/policies";
import NotFound from "./NotFound";
import { useEffect } from "react";

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
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 pt-28 pb-20">
        <article className="container max-w-3xl">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft size={16} /> Back to home
          </Link>

          <header className="mb-10 pb-8 border-b border-border/60">
            <h1 className="font-display text-4xl md:text-5xl font-semibold text-foreground tracking-tight text-balance">
              {policy.title}
            </h1>
            <p className="mt-3 text-sm text-muted-foreground uppercase tracking-[0.15em]">
              Last updated: {policy.updated}
            </p>
          </header>

          <div className="space-y-10">
            {policy.sections.map((section, i) => (
              <section key={i}>
                <h2 className="font-display text-xl md:text-2xl font-semibold text-foreground mb-3">
                  {section.heading}
                </h2>
                {section.body.map((block, j) =>
                  Array.isArray(block) ? (
                    <ul key={j} className="list-disc pl-5 space-y-2 text-foreground/85 leading-relaxed">
                      {block.map((item, k) => (
                        <li key={k}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p key={j} className="text-foreground/85 leading-relaxed [text-wrap:pretty] mb-3 last:mb-0">
                      {block}
                    </p>
                  )
                )}
              </section>
            ))}
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default PolicyPage;
