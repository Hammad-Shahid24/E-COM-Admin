import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../redux/auth/authSlice";
import categoryReducer from "../redux/categories/categorySlice";
import productReducer from "../redux/products/productSlice";
import tagReducer from "../redux/tags/tagSlice";
import voucherReducer from "../redux/vouchers/voucherSlice";
import orderReducer from "../redux/orders/orderSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    categories: categoryReducer,
    products: productReducer,
    tags: tagReducer,
    vouchers: voucherReducer,
    orders: orderReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "product/fetchAllProducts/fulfilled",
          "tags/fetchAllTags/fulfilled",
          "categories/fetchAllCategories/fulfilled",
          "vouchers/fetchAllVouchers/fulfilled",
          "orders/fetchAllOrders/fulfilled",
        ],
        ignoredPaths: [
          "products.lastVisible",
          "tags.lastVisible",
          "categories.lastVisible",
          "vouchers.lastVisible",
          "orders.lastVisible",
        ],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
