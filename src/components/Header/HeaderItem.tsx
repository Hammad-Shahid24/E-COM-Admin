import { FC } from "react";
import { Link } from "react-router-dom";

interface HeaderItemProps {
  toPath: string;
  label: string;
  badge?: string;
  badgeColor?: string;
}

const HeaderItem: FC<HeaderItemProps> = ({
  toPath = "/",
  label,
  badge = null,
  badgeColor = null,
}) => {
  return (
    <Link
      to={toPath}
      className="text-sm font-poppins text-gray-800 dark:text-white hover:text-teal-600 dark:hover:text-teal-400 transition-colors duration-300 px-3 cursor-pointer"
    >
      {label}
      {badge && (
        <span
          className={`inline-block rounded-full ${badgeColor}   px-1.5 text-[0.6rem] text-white transform -translate-y-3 `}
        >
          {badge}
        </span>
      )}
    </Link>
  );
};

export default HeaderItem;
