import { FC, useState } from "react";
import NavItem from "./NavItem";
import { RiMenuFoldFill } from "react-icons/ri";
import { Square3Stack3DIcon, CubeIcon } from "@heroicons/react/20/solid";
import { SiAftership } from "react-icons/si";
import Logo from "../../../assets/logo.png";
import { useNavigate } from "react-router-dom";

interface NavDrawerContentProps {
  onClose: () => void;
}

const NavDrawerContent: FC<NavDrawerContentProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const [expandedLabel, setExpandedLabel] = useState<string | null>(
    "Categories"
  );
  const [activeLabel, setActiveLabel] = useState<string | null>(null);

  return (
    <div className="flex flex-col items-center justify-center">
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
          expandedLabel={expandedLabel}
          setIsExpanded={setExpandedLabel}
          activeLabel={activeLabel}
          setIsActive={setActiveLabel}
          subNavItems={[
            { label: "Category List", onClick: () => navigate("categories") },
            {
              label: "New Category",
              onClick: () => navigate("categories/new"),
            },
          ]}
        />
        <NavItem
          icon={<CubeIcon />}
          label="Products"
          expandable
          expandedLabel={expandedLabel}
          setIsExpanded={setExpandedLabel}
          activeLabel={activeLabel}
          setIsActive={setActiveLabel}
          subNavItems={[
            { label: "Product List", onClick: () => navigate("products") },
            { label: "New Product", onClick: () => navigate("products/new") },
          ]}
        />
        <NavItem
          icon={<SiAftership />}
          label="Orders"
          expandable={false}
          setIsExpanded={setExpandedLabel}
          activeLabel={activeLabel}
          setIsActive={setActiveLabel}
          onClick={() => navigate("orders")}
        />
      </div>
    </div>
  );
};

export default NavDrawerContent;
