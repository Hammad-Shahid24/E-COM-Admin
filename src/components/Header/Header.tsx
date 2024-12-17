import { FC } from "react";
import UserDropdown from "./UserDropdown";
import { RiMenuUnfoldFill } from "react-icons/ri";
import { HiOutlineBell } from "react-icons/hi2";
import { motion } from "framer-motion";

interface HeaderProps {
  toggleDrawer: () => void;
  isDrawerOpen: boolean;
}

const Header: FC<HeaderProps> = ({ toggleDrawer, isDrawerOpen }) => {
  return (
    <header className="w-full bg-[#fbfbfc] dark:bg-gray-800 ">
      <div className="w-full mx-auto max-w-screen-2xl">
        <div className="flex justify-between items-center py-4  border-b border-gray-300 ">
          <div className="flex items-center gap-2 pl-5">
            <RiMenuUnfoldFill
              onClick={toggleDrawer}
              className={`${
                isDrawerOpen && "hidden"
              } w-6 h-6 text-blue-600 cursor-pointer`}
            />
          </div>
          <div className="flex items-center pr-5 gap-5">
            <motion.div
              whileHover={{ rotate: [0, 10, -10, 10, -10, 0] }}
              transition={{ duration: 0.5 }}
              className=" cursor-pointer "
            >
              <HiOutlineBell className="w-7 h-7 text-gray-500" />
            </motion.div>{" "}
            <UserDropdown />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;