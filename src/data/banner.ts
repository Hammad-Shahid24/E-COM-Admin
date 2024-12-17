import skincarebg from "../assets/Coll-Pgs/moisturizer.jpg";
import serumImg from "../assets/Coll-Pgs/serum.jpg";
import { useTranslation } from "react-i18next";

const { t } = useTranslation();

export const bannerData = {
  "best-sellers": {
    heading: t("header.bestsellers"),
  },
  "new-arrivals": {
    heading: t("header.newarrivals"),
  },
  "skin-care": {
    heading: t("collectionspage.banners.skincareheading"),
    description: t("collectionspage.banners.skincaredetail"),
    bgImage: skincarebg,
  },
  "face-mask": {
    heading: t("collectionspage.banners.facemaskheading"),
    description: t("collectionspage.banners.facemaskdetail"),
    bgImage: serumImg,
  },
  "texture-and-makeup": {
    heading: t("collectionspage.banners.textureandmakeupheading"),
    description: t("collectionspage.banners.textureandmakeupdetail"),
    bgImage: skincarebg,
  },
};
