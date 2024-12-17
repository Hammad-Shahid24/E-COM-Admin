import { FC, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import Banner from "../components/CollectionPages/Banner";
import StickyFilter from "../components/CollectionPages/StickyFilter";
import { useTranslation } from "react-i18next";
import skincarebg from "../assets/Coll-Pgs/moisturizer.jpg";
import serumImg from "../assets/Coll-Pgs/serum.jpg";
import ProductCard from "../components/CollectionPages/ProductCard";
import Pagination from "../components/CollectionPages/Pagination";

const CollectionPages: FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const path = location.pathname.split("/")[1] as keyof typeof bannerData;

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;
  const totalProducts = 12; // Assuming there are 12 products
  const totalPages = Math.ceil(totalProducts / productsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Memoize bannerData to avoid unnecessary recalculations on every render
  const bannerData = useMemo(
    () => ({
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
    }),
    [t]
  );

  const bannerProps = bannerData[path];

  // Calculate the products to display on the current page
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = Array.from({ length: totalProducts }).slice(
    startIndex,
    endIndex
  );

  return (
    <div className="w-full mx-auto bg-[#fff5ee] dark:bg-gray-900">
      {bannerProps && <Banner {...bannerProps} />}
      <StickyFilter />
      <div className="max-w-screen-2xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-20">
          {/* Render ProductCard components dynamically */}
          {currentProducts.map((_, index) => (
            <ProductCard key={index} />
          ))}
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default CollectionPages;
