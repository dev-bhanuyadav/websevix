import Navbar from "@/components/sections/Navbar";
import Hero from "@/components/sections/Hero";
import HowItWorks from "@/components/sections/HowItWorks";
import Categories from "@/components/sections/Categories";
import WhyChooseUs from "@/components/sections/WhyChooseUs";
import Stats from "@/components/sections/Stats";
import Testimonials from "@/components/sections/Testimonials";
import CTASection from "@/components/sections/CTASection";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <Categories />
        <WhyChooseUs />
        <Stats />
        <Testimonials />
        <CTASection />
        <Footer />
      </main>
    </>
  );
}
