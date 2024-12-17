import { FC } from "react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { IoFunnelOutline } from "react-icons/io5";
import { useTranslation } from "react-i18next";

const StickyFilter: FC = () => {
  const { t } = useTranslation();

  return (
    <div className="flex justify-between mx-auto max-w-screen-2xl border border-gray-300 dark:bg-gray-800 dark:border-gray-600">
      <button className="flex items-center space-x-2 px-4 py-5 text-gray-800 hover:bg-teal-700 dark:text-gray-200 dark:hover:bg-teal-600 transition-colors duration-300 border-r border-gray-300 dark:border-gray-600">
        <IoFunnelOutline className="w-4 h-4 text-gray-600 dark:text-gray-300" />
        <span className="text-[0.8rem] tracking-widest">
          {t("collectionspage.stickyfilter.filters")}
        </span>
      </button>
      <button className="flex items-center space-x-2 px-4 py-2 text-gray-800 hover:bg-teal-700 dark:text-gray-200 dark:hover:bg-teal-600 transition-colors duration-300 border-l border-gray-300 dark:border-gray-600">
        <span className="text-[0.8rem] tracking-widest">
          {t("collectionspage.stickyfilter.sortby")}
        </span>
        <ChevronDownIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
      </button>
    </div>
  );
};

export default StickyFilter;
