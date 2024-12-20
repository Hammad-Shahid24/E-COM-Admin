import { FC, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NavDrawerContent from "./NavDrawerContent";

interface NavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  toggleAuthDrawer: () => void;
  toggleSearchDrawer: () => void;
}

const NavDrawer: FC<NavDrawerProps> = ({ isOpen, onClose }) => {
  const [expandedLabel, setExpandedLabel] = useState<string | null>("Home");
  const [activeLabel, setActiveLabel] = useState<string | null>(null);
  return (
    <>
      {/* Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{
              x: "-100%",
              transition: { type: "spring", stiffness: 300, damping: 30 },
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 left-0 w-[19rem] h-full bg-white dark:bg-gray-800  z-50"
          >
            <div className="relative h-full">
              <NavDrawerContent
                onClose={onClose}
                activeLabel={activeLabel}
                setActiveLabel={setActiveLabel}
                expandedLabel={expandedLabel}
                setExpandedLabel={setExpandedLabel}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default NavDrawer;
