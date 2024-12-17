import { FC } from "react";
import NavItem from "./NavItem";
import { RiMenuFoldFill } from "react-icons/ri";
import { Square3Stack3DIcon } from "@heroicons/react/20/solid";
import Logo from "../../../assets/logo.png";
import { useNavigate } from "react-router-dom";

interface NavDrawerContentProps {
  onClose: () => void;
}

const NavDrawerContent: FC<NavDrawerContentProps> = ({ onClose }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col  items-center justify-center">
      {/* Menu Text and Close Button */}
      <div className="flex justify-between items-center bg-white w-full py-5 px-5 border-b-2 border-gray-50 dark:border-gray-700 relative">
        <img src={Logo} alt="logo" className="w-36 h-15" />
        <RiMenuFoldFill
          onClick={onClose}
          className="w-6 h-6 text-gray-500 hover:text-blue-600 transition-all duration-300 cursor-pointer"
        />
      </div>

      <div className="flex flex-col w-full">
        <NavItem
          family="ALL PAGES"
          icon={<Square3Stack3DIcon />}
          label="Categories"
          expandable
          subNavItems={[
            {
              label: "Category List",
              onClick: () => navigate("categories"),
            },
            {
              label: "New Category",
              onClick: () => navigate("categories/new"),
            },
          ]}
        />
      </div>
    </div>
  );
};

export default NavDrawerContent;