import { FC } from "react";
import Carousel from "../components/HomePage/Carousel";
import FeaturedCollections from "../components/HomePage/FeaturedCollections";
import Services from "../components/HomePage/Services";
import Discount from "../components/HomePage/Discount";
import BestSellers from "../components/HomePage/BestSellers";
import Marquee from "react-fast-marquee";
import AnimatedSection from "../components/AnimatedSection";
import { useTranslation } from "react-i18next";

const Home: FC = () => {
  const { t } = useTranslation();
  return (
    <div className="w-full mx-auto">
      <Carousel />
      <AnimatedSection delay={0.4}>
        <FeaturedCollections />
      </AnimatedSection>
      <AnimatedSection delay={0.4}>
        <BestSellers />
      </AnimatedSection>
      <Marquee
        gradient={false}
        speed={50}
        autoFill={true}
        pauseOnHover={true}
        pauseOnClick={false}
        className="bg-zenithHeader text-white py-2 font-poppins"
      >
        <span className="mx-16">{t("homepage.marquee.1")}</span>
        <span className="mx-16">{t("homepage.marquee.2")}</span>
        <span className="mx-16">{t("homepage.marquee.3")}</span>
        <span className="mx-16">{t("homepage.marquee.4")}</span>
        <span className="mx-16">{t("homepage.marquee.5")}</span>
      </Marquee>
      <AnimatedSection delay={0.4}>
        <Services />
      </AnimatedSection>
      <AnimatedSection delay={0.4}>
        <Discount />
      </AnimatedSection>
    </div>
  );
};

export default Home;
