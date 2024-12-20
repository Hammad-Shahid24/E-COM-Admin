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
import CategoryForm from "./components/categories/CategoryForm";
import CategoryList from "./components/categories/CategoryList";
import ProductList from "./components/products/ProductList";
import ProductForm from "./components/products/ProductForm";

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
            <Route path="*" element={<div>404</div>} />
            <Route path="collections/*" element={<CollectionPage />} />
            <Route path="categories" element={<CategoryList />} />
            <Route path="categories/*" element={<CategoryForm />} />
            <Route path="products" element={<ProductList />} />
            <Route path="products/*" element={<ProductForm />} />
          </Route>
        </Routes>
        <ToastContainer />
      </Router>
    </ErrorBoundary>
  );
};

export default App;
