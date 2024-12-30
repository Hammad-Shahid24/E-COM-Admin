import { FC, useEffect, useState } from "react";
import UserDropdown from "./UserDropdown";
import { RiMenuUnfoldFill } from "react-icons/ri";
import { HiOutlineBell } from "react-icons/hi2";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { listenToOrdersCollection } from "../../redux/orders/orderService";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import { logOut } from "../../redux/auth/authSlice";

interface HeaderProps {
  toggleDrawer: () => void;
  isDrawerOpen: boolean;
}

const Header: FC<HeaderProps> = ({ toggleDrawer, isDrawerOpen }) => {
  const [newOrderCount, setNewOrderCount] = useState(0);
  const [lastOrderId, setLastOrderId] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<string[]>([]); // Store notification messages
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State for dropdown visibility
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = listenToOrdersCollection((orders) => {
      if (orders && orders.length > 0) {
        const latestOrder = orders[0];
        if (latestOrder.id !== lastOrderId) {
          setNewOrderCount((prevCount) => prevCount + 1);
          if (latestOrder.id) {
            setLastOrderId(latestOrder.id);
            setNotifications((prev) => [
              ...prev,
              `New order placed: #${latestOrder.id}`,
            ]);
          }
          toast.success(`New order placed: #${latestOrder.id}`, {
            position: "top-right",
          });
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, [dispatch, lastOrderId]);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
    if (isDropdownOpen) setNewOrderCount(0); // Reset the notification count when dropdown closes
  };

  const handleLogout = async (): Promise<void> => {
    await dispatch(logOut());
  };

  return (
    <header className="w-full bg-[#fbfbfc] fixed top-0 left-0 right-0 z-50">
      <div className="w-full mx-auto">
        <div className="flex justify-between items-center py-4 border-b border-gray-300">
          <div className="flex items-center gap-2 pl-5 animate-all duration-300">
            <RiMenuUnfoldFill
              onClick={toggleDrawer}
              className={`${isDrawerOpen ? "hidden" : ""
                } w-6 h-6 text-blue-600 hover:text-blue-800 cursor-pointer animate-all duration-300`}
            />
          </div>
          <div className="flex items-center pr-5 gap-5">
            <motion.div
              transition={{ duration: 0.5 }}
              className="cursor-pointer relative"
              onClick={toggleDropdown}
            >
              <HiOutlineBell className="w-7 h-7 text-gray-500" />
              {newOrderCount > 0 && (
                <span className="absolute top-0 right-0 text-xs text-white bg-red-500 rounded-full w-4 h-4 flex items-center justify-center">
                  {newOrderCount}
                </span>
              )}
              {isDropdownOpen && (
                <div className="absolute right-0 top-10 bg-white dark:bg-gray-800 shadow-lg rounded-lg w-64 z-50 p-4">
                  <h3 className="text-gray-700 dark:text-gray-200 font-semibold mb-2">
                    Notifications
                  </h3>
                  <ul className="max-h-40 overflow-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-700">
                    {notifications.length > 0 ? (
                      notifications.map((note, idx) => (
                        <li
                          key={idx}
                          className="text-sm text-gray-600 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 py-2"
                        >
                          {note}
                        </li>
                      ))
                    ) : (
                      <li className="text-sm text-gray-500 dark:text-gray-400">
                        No notifications.
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </motion.div>
            <UserDropdown handleLogout={handleLogout} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
