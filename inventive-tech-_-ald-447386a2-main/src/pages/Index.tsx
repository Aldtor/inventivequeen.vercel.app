import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import MarqueeTicker from "@/components/MarqueeTicker";
import StatsHighlights from "@/components/StatsHighlights";
import CategoriesSection from "@/components/CategoriesSection";
import FeaturedProducts from "@/components/FeaturedProducts";
import DesignsGallery from "@/components/DesignsGallery";
import HowToOrderSection from "@/components/HowToOrderSection";
import PricelistSection from "@/components/PricelistSection";
import WhyChooseUs from "@/components/WhyChooseUs";
import TermsSection from "@/components/TermsSection";
import SocialProof from "@/components/SocialProof";
import VideoSection from "@/components/VideoSection";
import Footer from "@/components/Footer";

const Index = () => (
  <div className="min-h-screen bg-[#f2eaf9] bg-craft-dots text-foreground font-body selection:bg-primary/15 selection:text-primary">
    <Navbar />
    <HeroSection />
    <MarqueeTicker />
    <StatsHighlights />
    <CategoriesSection />
    <FeaturedProducts />
    <DesignsGallery />
    <HowToOrderSection />
    <PricelistSection />
    <WhyChooseUs />
    <SocialProof />
    <VideoSection />
    <TermsSection />
    <Footer />
  </div>
);

export default Index;
