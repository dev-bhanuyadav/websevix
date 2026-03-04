import Navbar      from "@/components/sections/Navbar";
import Hero        from "@/components/sections/Hero";
import HowItWorks  from "@/components/sections/HowItWorks";
import Categories  from "@/components/sections/Categories";
import WhyChooseUs from "@/components/sections/WhyChooseUs";
import Stats       from "@/components/sections/Stats";
import CTASection  from "@/components/sections/CTASection";
import Footer      from "@/components/sections/Footer";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-base">
      <Navbar />
      <Hero />
      <HowItWorks />
      <Categories />
      <WhyChooseUs />
      <Stats />
      <CTASection />
      <Footer />
    </main>
  );
}
