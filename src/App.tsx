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
import TagList from "./components/tags/TagList";
import TagForm from "./components/tags/TagForm";
import VoucherList from "./components/vouchers/VoucherList";
import VoucherForm from "./components/vouchers/VoucherForm"
import OrderList from "./components/orders/OrderList";
import OrderDetails from "./components/orders/OrderDetails";
import RequireAuth from "./utils/RequireAuth";

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
          <Route
            path="dashboard"
            element={
              <RequireAuth>
                <Layout />
              </RequireAuth>
            }
          >
            <Route path="*" element={<div>404 - Not Found</div>} />
            <Route path="tags" element={<TagList />} />
            <Route path="tags/*" element={<TagForm />} />
            <Route path="categories" element={<CategoryList />} />
            <Route path="categories/*" element={<CategoryForm />} />
            <Route path="products" element={<ProductList />} />
            <Route path="products/*" element={<ProductForm />} />
            <Route path="orders" element={<OrderList />} />
            <Route path="orders/*" element={<OrderDetails />} />
            <Route path="collections/*" element={<CollectionPage />} />
            <Route path="vouchers" element={<VoucherList />} />
            <Route path="vouchers/*" element={<VoucherForm />} />
          </Route>
          <Route path="*" element={<div>404 - Page Not Found</div>} />
        </Routes>
        <ToastContainer />
      </Router>
    </ErrorBoundary>
  );
};

export default App;
