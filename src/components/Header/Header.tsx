import { FC, useEffect, useState } from "react";
import UserDropdown from "./UserDropdown";
import { RiMenuUnfoldFill } from "react-icons/ri";
import { HiOutlineBell } from "react-icons/hi2";
import { motion } from "framer-motion";
import { toast } from "react-toastify"; // Assuming you are using react-toastify for notifications
import { listenToOrdersCollection } from "../../redux/orders/orderService"; // Import listener
import { useDispatch } from "react-redux";
import { setOrders } from "../../redux/orders/orderSlice"; // Assuming you have this action to update orders in redux

interface HeaderProps {
  toggleDrawer: () => void;
  isDrawerOpen: boolean;
}

const Header: FC<HeaderProps> = ({ toggleDrawer, isDrawerOpen }) => {
  const [newOrderCount, setNewOrderCount] = useState(0); // State for counting new orders
  const dispatch = useDispatch();

  // Effect to listen for new orders in real-time
  useEffect(() => {
    const unsubscribe = listenToOrdersCollection((orders) => {
      // Update orders in the Redux store
      dispatch(setOrders(orders));

      // Check if new orders exist and display notification
      if (orders && orders.length > 0) {
        setNewOrderCount((prevCount) => prevCount + 1); // Increment the new order count
        const latestOrder = orders[0]; // Latest order might be the first (depends on ordering)
        toast.success(`New order placed: #${latestOrder.id}`, {
          position: "top-right",
        });
      }
    });

    // Cleanup listener when component unmounts
    return () => {
      unsubscribe();
    };
  }, [dispatch]);

  return (
    <header className={`w-full bg-[#fbfbfc] fixed top-0 left-0 right-0 z-50`}>
      <div className="w-full mx-auto">
        <div className="flex justify-between items-center py-4 border-b border-gray-300">
          <div className="flex items-center gap-2 pl-5 animate-all duration-300">
            <RiMenuUnfoldFill
              onClick={toggleDrawer}
              className={`${
                isDrawerOpen && " hidden "
              } w-6 h-6 text-blue-600 hover:text-blue-800 cursor-pointer animate-all duration-300`}
            />
          </div>
          <div className="flex items-center pr-5 gap-5">
            <motion.div
              whileHover={{ rotate: [0, 10, -10, 10, -10, 0] }}
              transition={{ duration: 0.5 }}
              className="cursor-pointer relative" // Use relative to position the count
            >
              <HiOutlineBell className="w-7 h-7 text-gray-500" />
              {newOrderCount > 0 && (
                <span className="absolute top-0 right-0 text-xs text-white bg-red-500 rounded-full w-4 h-4 flex items-center justify-center">
                  {newOrderCount}
                </span>
              )}
            </motion.div>
            <UserDropdown />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
