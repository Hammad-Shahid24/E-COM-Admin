import { FC, } from "react";
import NavItem from "./NavItem";
import { MdDashboard } from "react-icons/md";
// import { TbRosetteDiscountFilled } from "react-icons/tb";
// import { PiListHeartFill } from "react-icons/pi";

// import { FaPeopleGroup } from "react-icons/fa6";
// import { AiFillSetting } from "react-icons/ai";
// import { IoDocumentsSharp } from "react-icons/io5";
import { RiMenuFoldFill } from "react-icons/ri";
import { Square3Stack3DIcon, CubeIcon } from "@heroicons/react/20/solid";
import { SiAftership } from "react-icons/si";
import { IoPricetags } from "react-icons/io5";
import Logo from "../../../assets/logo.png";
import Bot from "../../../assets/img-bot.png";
import { useNavigate } from "react-router-dom";

interface NavDrawerContentProps {
  expandedLabel: string | null;
  setExpandedLabel: (label: string | null) => void;
  activeLabel: string | null;
  setActiveLabel: (label: string | null) => void;
  onClose: () => void;
}

const NavDrawerContent: FC<NavDrawerContentProps> = ({
  onClose,
  expandedLabel,
  setExpandedLabel,
  activeLabel,
  setActiveLabel,
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="flex justify-between items-center bg-white w-full py-5 px-5 border-b-2 border-gray-50 dark:border-gray-700 relative">
        <img
          onClick={() => navigate("/dashboard")}
          src={Logo}
          alt="logo"
          className="w-36 h-15 cursor-pointer"
        />
        <RiMenuFoldFill
          onClick={onClose}
          className="w-6 h-6 text-gray-500 hover:text-blue-600 transition-all duration-300 cursor-pointer"
        />
      </div>

      <div className="flex flex-col w-full items-center overflow-y-auto scrollbar-hidden">
        <NavItem
          family="MAIN HOME"
          icon={<MdDashboard />}
          label="Dashboard"
          expandable={false}
          setIsExpanded={setExpandedLabel}
          activeLabel={activeLabel}
          setIsActive={setActiveLabel}
          onClick={() => navigate("/dashboard")}
        />

        <NavItem
          family="ALL PAGES"
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
          icon={<SiAftership />}
          label="Orders"
          expandable={false}
          setIsExpanded={setExpandedLabel}
          activeLabel={activeLabel}
          setIsActive={setActiveLabel}
          onClick={() => navigate("orders")}
        />
        <NavItem
          icon={<IoPricetags />}
          label="Tags"
          expandable
          expandedLabel={expandedLabel}
          setIsExpanded={setExpandedLabel}
          activeLabel={activeLabel}
          setIsActive={setActiveLabel}
          subNavItems={[
            { label: "Tag List", onClick: () => navigate("tags") },
            { label: "New Tag", onClick: () => navigate("tags/new") },
          ]}
          onClick={() => navigate("tags")}
        />
        {/* <NavItem
          icon={<TbRosetteDiscountFilled />}
          label="Vouchers"
          expandable
          expandedLabel={expandedLabel}
          setIsExpanded={setExpandedLabel}
          activeLabel={activeLabel}
          setIsActive={setActiveLabel}
          subNavItems={[
            { label: "Voucher List", onClick: () => navigate("vouchers") },
            { label: "New Voucher", onClick: () => navigate("vouchers/new") },
          ]}
          onClick={() => navigate("vouchers")}
        /> */}
        {/* <NavItem
          icon={<PiListHeartFill />}
          label="Deals"
          expandable
          expandedLabel={expandedLabel}
          setIsExpanded={setExpandedLabel}
          activeLabel={activeLabel}
          setIsActive={setActiveLabel}
          subNavItems={[
            { label: "Deal List", onClick: () => navigate("deals") },
            { label: "New Deal", onClick: () => navigate("deals/new") },
          ]}
          onClick={() => navigate("deals")}
        /> */}
        {/* <NavItem
          family="CUSTOMERS"
          icon={<FaPeopleGroup />}
          label="Customers"
          expandable
          expandedLabel={expandedLabel}
          setIsExpanded={setExpandedLabel}
          activeLabel={activeLabel}
          setIsActive={setActiveLabel}
          subNavItems={[
            { label: "Customer List", onClick: () => navigate("customers") },
            { label: "New Customer", onClick: () => navigate("customers/new") },
          ]}
          onClick={() => navigate("customers")}
        /> */}
        {/* <NavItem
          family="SETTINGS"
          icon={<AiFillSetting />}
          label="Settings"
          expandable
          expandedLabel={expandedLabel}
          setIsExpanded={setExpandedLabel}
          activeLabel={activeLabel}
          setIsActive={setActiveLabel}
          subNavItems={[
            { label: "Profile", onClick: () => navigate("profile") },
            {
              label: "Change Password",
              onClick: () => navigate("change-password"),
            },
          ]}
          onClick={() => navigate("settings")}
        /> */}
        {/* <NavItem
          family="PAGES"
          icon={<IoDocumentsSharp />}
          label="Pages"
          expandable
          expandedLabel={expandedLabel}
          setIsExpanded={setExpandedLabel}
          activeLabel={activeLabel}
          setIsActive={setActiveLabel}
          subNavItems={[
            { label: "Home", onClick: () => navigate("home") },
            { label: "About", onClick: () => navigate("about") },
          ]}
          onClick={() => navigate("pages")}
        /> */}
        <div className=" bg-white w-full py-16 ">
          <div className="flex flex-col items-center  text-center mx-14">
            <img src={Bot} alt="Bot" className="w-24 h-24 mb-4" />
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              Hi, how can we help?
            </h3>
            <p className="text-center text-sm text-gray-600 mb-4">
              Contact us if you need any assistance. We will get back to you as
              soon as possible.
            </p>
            <button className="bg-blue-600 text-white py-2 w-full font-semibold rounded-lg hover:bg-blue-600 transition duration-300">
              Contact
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavDrawerContent;
