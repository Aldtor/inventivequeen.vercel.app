import { Play } from "lucide-react";
import { FadeIn } from "@/components/motion/FadeIn";
import videoTeddy1 from "@/assets/video-teddy-1.mp4";
import videoTeddy2 from "@/assets/video-teddy-2.mp4";
import videoBookmark from "@/assets/video-bookmark.mp4";

const videos = [
  { src: videoTeddy1, label: "Teddy Bear Crafting", caption: "Stitch by stitch — bringing a plush to life" },
  { src: videoTeddy2, label: "Custom Doll Detail", caption: "The making of a bespoke amigurumi" },
  { src: videoBookmark, label: "Peacock Bookmark", caption: "Intricate lacework in vibrant threads" },
];

const VideoSection = () => {
  return (
    <section className="py-20 md:py-28 border-t border-purple-200/50 relative">
      <div className="container max-w-5xl relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <FadeIn>
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary/8 border border-primary/15 text-primary text-xs uppercase tracking-[0.22em] font-semibold mb-4">
              <span>🎬</span> Behind the Stitches
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground text-balance">
              Watch the Magic Unfold
            </h2>
          </FadeIn>
          <FadeIn delay={0.15}>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Peek behind the scenes — see how each handmade creation comes to life, one stitch at a time.
            </p>
          </FadeIn>
        </div>

        <FadeIn delay={0.2}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {videos.map((v) => (
              <div key={v.label} className="group relative rounded-2xl overflow-hidden bg-card border border-border/40 shadow-luxury-sm hover:shadow-luxury-lg transition-all duration-500">
                <div className="aspect-[9/16] md:aspect-[3/4] relative">
                  <video
                    src={v.src}
                    className="w-full h-full object-cover"
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    onMouseEnter={(e) => (e.target as HTMLVideoElement).play()}
                    onMouseLeave={(e) => { const vid = e.target as HTMLVideoElement; vid.pause(); vid.currentTime = 0; }}
                  />

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                  {/* Play indicator */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-60 group-hover:opacity-0 transition-opacity duration-300 pointer-events-none">
                    <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                      <Play size={22} className="text-white ml-1" fill="white" />
                    </div>
                  </div>

                  {/* Caption */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-white text-sm font-bold font-display">{v.label}</p>
                    <p className="text-white/60 text-xs mt-0.5">{v.caption}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

export default VideoSection;
