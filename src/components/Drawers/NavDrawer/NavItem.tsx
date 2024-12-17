import { FC, ReactNode, useState, ReactElement } from "react";
import { motion } from "framer-motion";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { GoDot } from "react-icons/go";
import React from "react";

// Types for sub-navigation items
interface SubNavItem {
  label: string;
  onClick?: () => void;
}

interface NavItemProps {
  family?: string;
  icon?: ReactNode;
  label: string;
  saleBadge?: string;
  expandable?: boolean;
  subNavItems?: SubNavItem[];
  onClick?: () => void;
}

const NavItem: FC<NavItemProps> = ({
  family,
  icon,
  label,
  saleBadge,
  expandable,
  subNavItems,
  onClick,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Toggle the expansion state of the nav item
  const handleMainClick = () => {
    if (onClick) onClick();
    if (expandable) setIsExpanded((prev) => !prev);
  };

  return (
    <div className="flex flex-col w-full transition-all duration-300">
      {/* Display family label if provided */}
      {family && (
        <h1 className="text-sm font-poppins text-gray-400 mt-2 pl-6">
          {family}
        </h1>
      )}

      {/* Main navigation item */}
      <div
        className={`flex justify-between items-center pb-3 pt-4 border-l-4 group   w-full px-5 cursor-pointer transition-all duration-300 hover:bg-blue-50 ${
          isExpanded ? "bg-blue-50 border-blue-500" : "border-transparent"
        }`}
        onClick={handleMainClick}
        aria-expanded={isExpanded}
        aria-controls={expandable ? `${label}-subnav` : undefined}
      >
        <div className="flex items-center">
          {/* Icon */}
          {icon && (
            <span className="pr-3">
              {React.cloneElement(icon as ReactElement, {
                className: `w-5 h-5 group-hover:text-blue-500  dark:text-white transition-all duration-300 ${
                  isExpanded ? "text-blue-500" : "text-gray-500"
                }`,
              })}
            </span>
          )}

          {/* Label */}
          <h1
            className={`text-md group-hover:text-blue-500 font-medium font-poppins transition-all duration-300 ${
              isExpanded ? "font-medium text-blue-500" : "text-gray-700"
            }`}
          >
            {label}
          </h1>

          {/* Sale Badge */}
          {saleBadge && (
            <span className="bg-cyan-500 rounded-full font-poppins text-[0.65rem] px-2 mb-0.5 mt-0.5 md:pt-0.5 text-white ml-2">
              {saleBadge}
            </span>
          )}
        </div>

        {/* Expandable Icon */}
        {expandable && (
          <ChevronDownIcon
            className={`w-5 h-5  transition-all duration-300 ${
              isExpanded
                ? "transform rotate-180 text-blue-500"
                : "text-gray-500"
            }`}
          />
        )}
      </div>

      {/* Sub-navigation items */}
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={
          isExpanded
            ? { height: "auto", opacity: 1 }
            : { height: 0, opacity: 0 }
        }
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.3 }}
        id={expandable ? `${label}-subnav` : undefined}
        className="overflow-hidden"
      >
        {subNavItems?.map((subNav, index) => (
          <div
            key={index}
            className="flex items-center py-3 border-b w-full border-gray-200 pl-12 cursor-pointer hover:bg-gray-100 active:bg-gray-300"
            onClick={subNav.onClick}
          >
            <GoDot className="w-3 h-3 text-gray-400" />
            <h1 className="pl-2 text-sm font-normal font-poppins text-gray-500">
              {subNav.label}
            </h1>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default React.memo(NavItem);
