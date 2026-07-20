import videoBookmark from "@/assets/video-bookmark.mp4";
import videoTeddy1 from "@/assets/video-teddy-1.mp4";
import videoTeddy2 from "@/assets/video-teddy-2.mp4";
import { FadeIn } from "@/components/motion/FadeIn";
import { StaggerChildren, StaggerItem } from "@/components/motion/StaggerChildren";

const videos = [
  { src: videoTeddy1, title: "Mini Bear Teddy" },
  { src: videoBookmark, title: "Peacock Feather Bookmark" },
  { src: videoTeddy2, title: "Crafted with Love" },
];

const VideoSection = () => {
  return (
    <section className="py-20 md:py-28 lg:py-32">
      <div className="container">
        <div className="max-w-2xl mx-auto text-center">
          <FadeIn>
            <p className="text-xs uppercase tracking-[0.25em] text-primary font-body font-semibold">
              Behind the Scenes
            </p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 className="mt-3 font-display text-3xl md:text-4xl lg:text-[2.75rem] font-bold text-foreground text-balance">
              Watch How It's Made
            </h2>
          </FadeIn>
          <FadeIn delay={0.15}>
            <p className="mt-4 text-muted-foreground text-pretty leading-relaxed">
              A peek into the creative process behind every handmade piece.
            </p>
          </FadeIn>
        </div>

        <StaggerChildren className="mt-12 md:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {videos.map((v) => (
            <StaggerItem key={v.src}>
              <div className="group rounded-2xl overflow-hidden bg-card shadow-luxury-sm hover:shadow-luxury transition-shadow duration-300">
                <div className="relative aspect-[9/16] bg-muted overflow-hidden">
                  <video
                    src={v.src}
                    className="w-full h-full object-cover"
                    muted
                    loop
                    playsInline
                    controls
                    preload="metadata"
                  />
                </div>
                <div className="p-4 md:p-5">
                  <p className="font-body text-sm font-semibold text-foreground">
                    {v.title}
                  </p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
};

export default VideoSection;
