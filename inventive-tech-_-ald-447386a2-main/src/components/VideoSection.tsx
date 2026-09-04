import { Play, Sparkles, Crown } from "lucide-react";
import { FadeIn } from "@/components/motion/FadeIn";
import videoTeddy1 from "@/assets/video-teddy-1.mp4";
import videoTeddy2 from "@/assets/video-teddy-2.mp4";
import videoBookmark from "@/assets/video-bookmark.mp4";

const videos = [
  { src: videoTeddy1, label: "Velvet Teddy Crafting", caption: "Stitch by stitch — bringing a cuddle bear to life" },
  { src: videoTeddy2, label: "Bespoke Doll Detail", caption: "Hand-sculpting expressions in pure milk cotton yarn" },
  { src: videoBookmark, label: "Peacock Lace Bookmark", caption: "Intricate lacework in jewel-toned artisan threads" },
];

const VideoSection = () => {
  return (
    <section className="py-20 md:py-28 relative overflow-hidden bg-purple-50/50 border-t border-purple-200/60">
      <div className="container max-w-6xl relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-purple-200 shadow-sm text-purple-900 text-xs uppercase tracking-[0.2em] font-bold mb-4">
              <Crown size={13} className="text-amber-500" />
              <span>Behind The Magic</span>
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 className="font-display text-3xl md:text-5xl font-black text-purple-950 text-balance">
              Watch The Magic Unfold
            </h2>
          </FadeIn>
          <FadeIn delay={0.15}>
            <p className="mt-4 text-base text-purple-900/75 leading-relaxed font-normal">
              A glimpse into the atelier process — hover over each video to watch loops of our handmade creations taking shape.
            </p>
          </FadeIn>
        </div>

        <FadeIn delay={0.2}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {videos.map((v) => (
              <div
                key={v.label}
                className="group relative rounded-[2rem] overflow-hidden bg-white border border-purple-200/80 shadow-md hover:shadow-luxury-lg hover:-translate-y-1.5 transition-all duration-400"
              >
                <div className="aspect-[4/5] relative overflow-hidden bg-black/5">
                  <video
                    src={v.src}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    onMouseEnter={(e) => (e.target as HTMLVideoElement).play()}
                    onMouseLeave={(e) => {
                      const vid = e.target as HTMLVideoElement;
                      vid.pause();
                      vid.currentTime = 0;
                    }}
                  />

                  {/* Soft bottom vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-950/80 via-transparent to-transparent pointer-events-none" />

                  {/* Floating Play Indicator */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-70 group-hover:opacity-0 transition-opacity duration-300 pointer-events-none">
                    <div className="w-14 h-14 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center border border-white/50 shadow-lg">
                      <Play size={20} className="text-white ml-0.5" fill="white" />
                    </div>
                  </div>

                  {/* Caption */}
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <p className="text-white text-base font-bold font-display">{v.label}</p>
                    <p className="text-purple-200 text-xs mt-1 leading-normal font-normal">{v.caption}</p>
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
