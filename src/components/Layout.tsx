import { FC, useState, useLayoutEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";
import { useNavigate, Outlet } from "react-router-dom";
import Header from "./Header/Header";
import NavDrawer from "../components/Drawers/NavDrawer/NavDrawer";
import Footer from "./Footer/Footer";

const Layout: FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const [isNavDrawerOpen, setIsNavDrawerOpen] = useState(true);

  useLayoutEffect(() => {
    if (!user) {
      navigate("/"); // Redirect if no user is found
    }
  }, [user, navigate]);

  const toggleNavDrawer = () => {
    setIsNavDrawerOpen(!isNavDrawerOpen);
  };

  return (
    <div className="w-full max-h-screen bg-[#f2f7fb]">
      <div
        className={`max-w-full mx-auto transition-all duration-300 ${
          isNavDrawerOpen ? "ml-[19rem]" : "ml-0"
        }`}
      >
        {/* Fixed Header */}
        <Header isDrawerOpen={isNavDrawerOpen} toggleDrawer={toggleNavDrawer} />

        {/* Navigation Drawer */}
        <NavDrawer
          isOpen={isNavDrawerOpen}
          onClose={toggleNavDrawer}
          toggleAuthDrawer={() => {}}
          toggleSearchDrawer={() => {}}
        />

        {/* Main Content Area */}
        <div className="mt-[68px] p-4 bg-transparent overflow-y-auto ">
          <Outlet />
          {/* <div className="h-80 w-full bg-red-200"></div> */}
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
