import { FC, useState, useLayoutEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import Header from "./Header/Header";
import NavDrawer from "../components/Drawers/NavDrawer/NavDrawer";
import Footer from "./Footer/Footer";

const Layout: FC = () => {
  const { user } = useSelector((state: RootState) => state.auth); // Get user from Redux state
  const navigate = useNavigate();
  const [isNavDrawerOpen, setIsNavDrawerOpen] = useState(true); // State to manage nav drawer visibility
  const location = useLocation(); // Get current location (route)

  useLayoutEffect(() => {
    if (!user) {
      navigate("/"); // Redirect to login if no user is found
    }
  }, [user, navigate]);

  const toggleNavDrawer = () => {
    setIsNavDrawerOpen(!isNavDrawerOpen);
  };

  // Check if the current route is "/dashboard" and whether the outlet is empty
  const isDashboardRoute = location.pathname === "/dashboard";
  const isOutletEmpty = location.pathname === "/dashboard" && !location.hash; // Check if no child route (Outlet is empty)

  return (
    <div className="w-full max-h-screen bg-[#f2f7fb]">
      <div
        className={`max-w-full mx-auto transition-all duration-300 ${isNavDrawerOpen ? "ml-[19rem]" : "ml-0"
          }`}
      >
        {/* Fixed Header */}
        <Header isDrawerOpen={isNavDrawerOpen} toggleDrawer={toggleNavDrawer} />

        {/* Navigation Drawer */}
        <NavDrawer
          isOpen={isNavDrawerOpen}
          onClose={toggleNavDrawer}
          toggleAuthDrawer={() => { }}
          toggleSearchDrawer={() => { }}
        />

        {/* Main Content Area */}
        <div className="mt-[68px] p-4 bg-transparent overflow-y-auto ">
          {isDashboardRoute && isOutletEmpty ? (
            // This content will be displayed when "/dashboard" route is active with no child route
            <div>
              <h2>Welcome to the Dashboard!</h2>
              <p>Select a section from the sidebar to get started.</p>
            </div>
          ) : (
            // The Outlet will render the child component if it's available
            <Outlet />
          )}
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default Layout;
