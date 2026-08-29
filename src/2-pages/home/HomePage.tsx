import { CampaignWidget } from "@/src/3-widgets/campaign/CampaignWidget";
import { FaqSection } from "@/src/3-widgets/faq/FaqSection";
import { HeroSection } from "@/src/3-widgets/hero/HeroSection";
import { HowItWorksSection } from "@/src/3-widgets/how-it-works/HowItWorksSection";
import { CampaignTrustBar } from "@/src/4-features/campain-trust-bar/CampainTrustBar";
import Footer from "@/src/4-features/footer/Footer";
import Header from "@/src/4-features/header/Header";
import LoadingScreen from "@/src/4-features/LoadingScreen/LoadingScreen";
import { getDeviceDetector } from "@/src/6-shared/utils";

export async  function HomePage() {

const device = await getDeviceDetector();

  return (
    <main>
      <LoadingScreen/>
      <Header />
      <HeroSection />
      <CampaignTrustBar/>
      <HowItWorksSection/>
      <CampaignWidget isMobile={device?.isMobile}/>
      <FaqSection />
      <Footer />
    </main>
  );
}
