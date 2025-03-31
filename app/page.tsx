import BgGradient from "@/components/common/bg-gradient";
import HeroSection from "@/components/home/hero-section";

export default function Home() {
  return (
    <div className="relative w-full">
      <BgGradient />
      <div className="flex flex-col ">
        <HeroSection />
      </div>
      {/* <DemoSection />
      <HowItWorksSection />
      <PricingSection />
      <CTASection /> */}
    </div>
  );
}
