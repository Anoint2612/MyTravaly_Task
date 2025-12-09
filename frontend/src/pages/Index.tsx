import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/home/HeroSection";
import FeaturedHotels from "@/components/home/FeaturedHotels";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import Footer from "@/components/home/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <HeroSection />
        <FeaturedHotels />
        <WhyChooseUs />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
