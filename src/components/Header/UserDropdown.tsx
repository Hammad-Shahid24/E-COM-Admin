import { FC, useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";

interface UserDropdownProps {
  handleLogout: () => Promise<void>;
}

const UserDropdown: FC<UserDropdownProps> = ({ handleLogout }) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="flex items-center text-sm  "
        id="options-menu"
        onClick={toggleDropdown}
      >
        <img
          className="h-9 w-9 rounded-full"
          src={user?.picUrl || "https://via.placeholder.com/150"}
          alt="User profile"
        />
        <div className="ml-3 font-poppins">
          <span className="block font-medium text-gray-800 dark:text-gray-200">
            {user?.firstName} {user?.lastName}
          </span>
          <span className="block text-gray-500 dark:text-gray-300 text-xs text-start">
            Admin
          </span>
        </div>
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-20">
          {/* <a
            href="#profile"
            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Profile
          </a>
          <a
            href="#settings"
            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Settings
          </a> */}
          <button
            onClick={handleLogout}
            className="block w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
