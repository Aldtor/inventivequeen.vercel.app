import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CategoriesSection from "@/components/CategoriesSection";
import FeaturedProducts from "@/components/FeaturedProducts";
import WhyChooseUs from "@/components/WhyChooseUs";
import SocialProof from "@/components/SocialProof";
import VideoSection from "@/components/VideoSection";
import Footer from "@/components/Footer";

const Index = () => (
  <div className="min-h-screen">
    <Navbar />
    <HeroSection />
    <CategoriesSection />
    <FeaturedProducts />
    <WhyChooseUs />
    <SocialProof />
    <VideoSection />
    <Footer />
  </div>
);

export default Index;
