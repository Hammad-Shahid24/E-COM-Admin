import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../redux/auth/authSlice";
import categoryReducer from "../redux/categories/categorySlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    categories: categoryReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
