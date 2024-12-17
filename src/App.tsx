import { FC, useEffect } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import Layout from "./components/Layout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// pages
import AuthPage from "./pages/AuthPage";
import CollectionPage from "./pages/CollectionPages";
import { useDispatch } from "react-redux";
import { initializeAuth } from "./redux/auth/authSlice";
import { AppDispatch } from "./app/store";
import NewCategory from "./components/categories/NewCategory";
import CategoryList from "./components/categories/CategoryList";

const App: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route path="dashboard" element={<Layout />}>
            <Route
              path="testing"
              element={<div className="w-full h-screen ">hello</div>}
            />
            <Route path="collections/*" element={<CollectionPage />} />

            <Route path="*" element={<div>404</div>} />

            <Route path="categories" element={<CategoryList />} />
            <Route path="categories/*" element={<NewCategory />} />
          </Route>
        </Routes>
        <ToastContainer />
      </Router>
    </ErrorBoundary>
  );
};

export default App;
