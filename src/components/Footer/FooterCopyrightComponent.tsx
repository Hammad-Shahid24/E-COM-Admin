import { FC } from "react";
import { useTranslation } from "react-i18next";

const FooterCopyrightComponent: FC = () => {
  const { t } = useTranslation();

  return (
    <div className="mt-16 flex flex-col gap-y-4 xl:gap-y-0 xl:flex-row xl:justify-between items-center text-sm font-poppins text-teal-900 dark:text-gray-400">
      <div>
        {t("footer.copyright.copyright")} © {new Date().getFullYear()}{" "}
        <span className="text-teal-700">Psytech</span>.{" "}
        {t("footer.copyright.rights")}.
      </div>
      <div className="flex gap-x-2">
        {[
          {
            src: "//zenithcarts.com/cdn/shopifycloud/shopify/assets/payment_icons/american_express-12858714bc10cdf384b62b8f41d20f56d8c32c1b8fed98b662f2bfc158dcbcf0.svg",
            alt: "American Express",
          },
          {
            src: "//zenithcarts.com/cdn/shopifycloud/shopify/assets/payment_icons/master-173035bc8124581983d4efa50cf8626e8553c2b311353fbf67485f9c1a2b88d1.svg",
            alt: "Mastercard",
          },
          {
            src: "//zenithcarts.com/cdn/shopifycloud/shopify/assets/payment_icons/shopify_pay-957a48d1202dc65a7890b292de764ee886f7e64cea486ae82e291e9dc824c914.svg",
            alt: "Shopify Pay",
          },
          {
            src: "//zenithcarts.com/cdn/shopifycloud/shopify/assets/payment_icons/visa-319d545c6fd255c9aad5eeaad21fd6f7f7b4fdbdb1a35ce83b89cca12a187f00.svg",
            alt: "Visa",
          },
          {
            src: "//zenithcarts.com/cdn/shopifycloud/shopify/assets/payment_icons/apple_pay-f6db0077dc7c325b436ecbdcf254239100b35b70b1663bc7523d7c424901fa09.svg",
            alt: "Apple Pay",
          },
          {
            src: "//zenithcarts.com/cdn/shopifycloud/shopify/assets/payment_icons/google_pay-c66a29c63facf2053bf69352982c958e9675cabea4f2f7ccec08d169d1856b31.svg",
            alt: "Google Pay",
          },
        ].map(({ src, alt }, index) => (
          <img
            key={index}
            src={src}
            alt={alt}
            className="h-5 xl:h-6" // Smaller size for flex-col, larger for flex-row
          />
        ))}
      </div>
    </div>
  );
};

export default FooterCopyrightComponent;
