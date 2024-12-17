import { FC } from "react";
import { RiMapPinLine } from "react-icons/ri";
import { BsEnvelope } from "react-icons/bs";
import { HiOutlinePhone } from "react-icons/hi2";
import FooterCopyrightComponent from "./FooterCopyrightComponent";
import { useTranslation } from "react-i18next";

const Footer: FC = () => {
  const { t } = useTranslation();

  const getInTouch = {
    title: t("footer.getintouch.getintouch"),
    links: [
      {
        icon: <RiMapPinLine className="h-5 w-5 xl:h-8 xl:w-8" />,
        name: t("footer.getintouch.address"),
      },
      {
        icon: <BsEnvelope className="h-5 w-5" />,
        link: "info@tech.com",
      },
      {
        icon: <HiOutlinePhone className="h-5 w-5" />,
        name: "+447877381196",
      },
    ],
  };

  const footerLinks = [
    {
      title: t("footer.categories.categories"),
      links: [
        t("footer.categories.newarrivals"),
        t("footer.categories.bestsellers"),
        t("footer.categories.beauty"),
        t("footer.categories.haircare"),
      ],
    },
    {
      title: t("footer.information.information"),
      links: [
        t("footer.information.privacypolicy"),
        t("footer.information.refundpolicy"),
        t("footer.information.termsofservice"),
      ],
    },
    {
      title: t("footer.quicklinks.quicklinks"),
      links: [
        t("footer.quicklinks.aboutus"),
        t("footer.quicklinks.contactus"),
        t("footer.quicklinks.faqs"),
      ],
    },
  ];

  const newsletter = {
    title: t("footer.newsletter.newsletter"),
    subtitle: t("footer.newsletter.description"),
  };

  return (
    <footer className="w-full bg-blue-50 dark:bg-gray-900 py-8">
      <div className="max-w-screen-xl mx-auto px-4 font-poppins ">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-8">
          {/* Contact Section */}
          <div>
            <h2 className="text-base font-medium  text-teal-950 dark:text-white mb-4">
              {getInTouch.title}
            </h2>
            <address className="not-italic space-y-4">
              {getInTouch.links.map((link, index) => (
                <div
                  key={index}
                  className="flex items-center text-sm text-teal-900 dark:text-gray-300"
                >
                  {link.icon}
                  {link.name && <span className="ml-2">{link.name}</span>}
                  {link.link && (
                    <a
                      href={`mailto:${link.link}`}
                      className="ml-2 text-teal-900 dark:text-white hover:text-teal-600 dark:hover:text-teal-400 transition-colors duration-300"
                      aria-label={`Email ${link.link}`}
                    >
                      {link.link}
                    </a>
                  )}
                </div>
              ))}
            </address>
          </div>

          {/* Footer Links */}
          {footerLinks.map((section, index) => (
            <div key={index}>
              <h2 className="text-base font-medium  text-teal-950 dark:text-white mb-4">
                {section.title}
              </h2>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href="#"
                      className="text-sm text-teal-900 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors duration-300"
                      aria-label={`Go to ${link}`}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter Section */}
          <div className="max-w-sm ">
            <h2 className="text-base font-medium  text-teal-950 dark:text-white mb-4 ">
              {newsletter.title}
            </h2>
            <p className="text-sm text-teal-900 dark:text-gray-300 mb-4">
              {newsletter.subtitle}
            </p>
            <div className="flex  justify-between items-center rounded-full border border-teal-700 dark:border-gray-700 w-full mx-auto bg-white dark:bg-gray-800">
              <input
                type="email"
                placeholder={t("homepage.discount.email")}
                className=" w-full pl-4 md:pl-2 py-2.5 rounded-l-full bg-transparent focus:outline-none text-xs font-poppins text-teal-950 dark:text-white placeholder:text-teal-950 dark:placeholder:text-gray-400 placeholder:font-light"
              />
              <button className=" mr-0.5 sm:mt-0 min-w-20 text-center py-2  rounded-full bg-teal-700 text-xs text-white hover:bg-teal-600 transition-colors duration-300 bg-r">
                {t("homepage.discount.subscribe")}
              </button>
            </div>
          </div>
        </div>

        <FooterCopyrightComponent />
      </div>
    </footer>
  );
};

export default Footer;
