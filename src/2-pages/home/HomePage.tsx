import { CampaignWidget } from "@/src/3-widgets/campaign/CampaignWidget";
import { FaqSection } from "@/src/3-widgets/faq/FaqSection";
import { HeroSection } from "@/src/3-widgets/hero/HeroSection";
import { HowItWorksSection } from "@/src/3-widgets/how-it-works/HowItWorksSection";
import { CampaignTrustBar } from "@/src/4-features/campain-trust-bar/CampainTrustBar";
import Footer from "@/src/4-features/footer/Footer";
import Header from "@/src/4-features/header/Header";

export function HomePage() {
  return (
    <main>
      <Header />
      <HeroSection />
      <CampaignTrustBar/>
      <HowItWorksSection/>
      <CampaignWidget />
      <FaqSection />
      <Footer />
    </main>
  );
}
