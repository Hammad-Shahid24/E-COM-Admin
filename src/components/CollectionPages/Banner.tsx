import { FC } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

interface BannerProps {
  heading: string;
  description?: string;
  bgImage?: string; // Background image is optional
}

const Banner: FC<BannerProps> = ({ heading, description, bgImage }) => {
  console.log(heading, description, bgImage);

  return (
    <div className="relative w-full mx-auto">
      {/* Lazy-loaded background image with responsive height */}
      <LazyLoadImage
        src={bgImage}
        alt={heading || "Banner Background"}
        effect="blur"
        wrapperProps={{
          style: { transitionDelay: "0.5s" }, // Smooth transition for image loading
        }}
        className="w-full h-[40vh] sm:h-[60vh] md:h-[72vh] object-cover"
      />
      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 dark:bg-opacity-70">
        <div className="text-center max-w-screen-xl mx-auto px-4 sm:px-6 md:px-12 py-12">
          <h3 className="mb-5 text-2xl sm:text-3xl md:text-4xl font-bold text-white dark:text-gray-200">
            {heading}
          </h3>
          {description && (
            <p className="text-sm sm:text-base md:text-lg text-gray-100 dark:text-gray-300">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Banner;
