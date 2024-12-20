import { FC, ReactNode, useState, ReactElement } from "react";
import { motion } from "framer-motion";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { GoDiamond } from "react-icons/go";

import React from "react";

interface SubNavItem {
  label: string;
  onClick?: () => void;
}

interface NavItemProps {
  family?: string;
  icon?: ReactElement | null;
  label: string;
  saleBadge?: string;
  expandable?: boolean;
  expandedLabel?: string | null;
  setIsExpanded?: (label: string | null) => void;
  activeLabel?: string | null;
  setIsActive?: (label: string | null) => void;
  subNavItems?: SubNavItem[];
  onClick?: () => void;
}

const NavItem: FC<NavItemProps> = ({
  family,
  icon,
  label,
  saleBadge,
  expandable,
  expandedLabel,
  setIsExpanded,
  activeLabel,
  setIsActive,
  subNavItems,
  onClick,
}) => {
  const handleMainClick = () => {
    if (onClick) onClick();
    if (expandable && setIsExpanded) {
      setIsExpanded(expandedLabel === label ? null : label);
      if (setIsActive) setIsActive(null);
    } else if (!expandable && setIsExpanded) {
      setIsExpanded(null);
      if (setIsActive) setIsActive(label);
    }
  };

  const handleSubClick = (subNav: SubNavItem) => {
    if (subNav.onClick) subNav.onClick();
    if (setIsActive) setIsActive(subNav.label);
  };

  return (
    <div className="flex flex-col w-full transition-all duration-300">
      {family && (
        <h1 className="text-sm font-poppins text-gray-400 mt-2 pl-6">
          {family}
        </h1>
      )}
      <div
        className={`flex justify-between items-center pb-3 pt-4 border-l-4 group w-full px-5 cursor-pointer transition-all duration-300 hover:bg-blue-50 ${
          expandedLabel === label || activeLabel === label
            ? "bg-blue-50 border-blue-500"
            : "border-transparent"
        }`}
        onClick={handleMainClick}
      >
        <div className="flex items-center">
          {icon && (
            <span className="pr-3">
              {React.cloneElement(icon, {
                className: `w-5 h-5 group-hover:text-blue-500 dark:text-white transition-all duration-300 ${
                  expandedLabel === label || activeLabel === label
                    ? "text-blue-500"
                    : "text-gray-500"
                }`,
              })}
            </span>
          )}
          <h1
            className={`text-md group-hover:text-blue-500 font-medium font-poppins transition-all duration-300 ${
              expandedLabel === label || activeLabel === label
                ? "font-medium text-blue-500"
                : "text-gray-700"
            }`}
          >
            {label}
          </h1>
          {saleBadge && (
            <span className="bg-cyan-500 rounded-full font-poppins text-[0.65rem] px-2 mb-0.5 mt-0.5 md:pt-0.5 text-white ml-2">
              {saleBadge}
            </span>
          )}
        </div>
        {expandable && (
          <ChevronDownIcon
            className={`w-5 h-5 transition-all duration-300 ${
              expandedLabel === label
                ? "transform rotate-180 text-blue-500"
                : "text-gray-500"
            }`}
          />
        )}
      </div>

      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={
          expandedLabel === label
            ? { height: "auto", opacity: 1 }
            : { height: 0, opacity: 0 }
        }
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        {subNavItems?.map((subNav, index) => (
          <div
            key={index}
            className={`flex items-center py-3 border-b w-full border-gray-200 pl-12 cursor-pointer transition-all duration-300 hover:opacity-80 active:bg-gray-300 ${
              activeLabel === subNav.label
                ? "bg-sky-800 text-white font-bold"
                : ""
            }`}
            onClick={() => handleSubClick(subNav)}
          >
            <GoDiamond className="w-2 h-2 text-inherit" />
            <h1 className="pl-2 text-sm font-normal font-poppins text-inherit">
              {subNav.label}
            </h1>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default React.memo(NavItem);
