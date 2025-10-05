import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Metrics from "@/components/Metrics";
import ValueProps from "@/components/ValueProps";
import FeatureGrid from "@/components/FeatureGrid";
import HowItWorks from "@/components/HowItWorks";
import SocialProof from "@/components/SocialProof";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import GradientOrb from "@/components/GradientOrb";
import TestimonialMarquee from "@/components/TestimonialMarquee";

export default function Page() {
  return (
    <main>
      <Navbar />
      <GradientOrb />
      <Hero />
      <Metrics />
      <TestimonialMarquee className="my-12" rows={1} />
      <ValueProps />
      <FeatureGrid />
      <HowItWorks />
      <SocialProof />
      <div className="px-6">
        <CTA />
      </div>
      <Footer />
    </main>
  );
}
