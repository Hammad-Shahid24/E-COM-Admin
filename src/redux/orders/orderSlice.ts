import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchOrders,
  addOrder,
  updateOrder,
  deleteOrder,
} from "./orderService";
import { Order } from "../../types/Shopping";
import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";

// Define the initial state using the Order type
interface OrderState {
  orders: Order[];
  order: Order | null;
  loading: boolean;
  error: string | null;
  lastVisible: null | QueryDocumentSnapshot<Order, DocumentData>; // Last visible document
  totalOrders: number | null;
}

const initialState: OrderState = {
  orders: [],
  order: null,
  loading: false,
  error: null,
  lastVisible: null,
  totalOrders: null,
};

// Fetch orders
export const fetchAllOrders = createAsyncThunk(
  "order/fetchAllOrders",
  async (
    {
      pageSize,
      sortField = "createdAt",
      sortOrder = "desc",
    }: { pageSize: number; sortField?: string; sortOrder?: "asc" | "desc" },
    { rejectWithValue, getState }
  ) => {
    try {
      const state = getState() as { orders: OrderState };
      const lastVisible = state.orders.lastVisible;

      // Call fetchOrders from orderService
      const {
        orders,
        lastVisible: updatedLastVisible,
        totalOrders,
      } = await fetchOrders(lastVisible, pageSize, sortField, sortOrder);

      return {
        orders,
        lastVisible: updatedLastVisible,
        totalOrders,
      };
    } catch (error: any) {
      return rejectWithValue(
        error.message || "An error occurred while fetching orders."
      );
    }
  }
);

// Add a new order
export const createOrder = createAsyncThunk(
  "order/createOrder",
  async (order: Order, { rejectWithValue }) => {
    try {
      const newOrder = await addOrder(order);
      return newOrder;
    } catch (error: any) {
      return rejectWithValue(
        error.message || "An error occurred while adding the order."
      );
    }
  }
);

// Update an order
export const editOrder = createAsyncThunk(
  "order/editOrder",
  async (
    { id, updatedOrder }: { id: string; updatedOrder: Order },
    { rejectWithValue }
  ) => {
    try {
      const updated = await updateOrder(id, updatedOrder);
      return updated;
    } catch (error: any) {
      return rejectWithValue(
        error.message || "An error occurred while updating the order."
      );
    }
  }
);

// Delete an order
export const removeOrder = createAsyncThunk(
  "order/removeOrder",
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteOrder(id);
      return id; // Return the order ID upon successful deletion
    } catch (error: any) {
      return rejectWithValue(
        error.message || "An error occurred while deleting the order."
      );
    }
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    resetState: (state) => {
      state.orders = [];
      state.loading = false;
      state.error = null;
      state.lastVisible = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setOrderById: (state, action) => {
      state.order =
        state.orders.find((order) => order.id === action.payload) ?? null;
    },
    resetOrder: (state) => {
      state.order = null;
    },
    resetOrders: (state) => {
      state.orders = [];
      state.lastVisible = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Orders
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;

        // Filter out orders already in the state
        const newOrders = action.payload.orders.filter(
          (newOrder) => !state.orders.some((order) => order.id === newOrder.id)
        );

        state.orders = state.orders.concat(newOrders);
        state.lastVisible = action.payload.lastVisible as QueryDocumentSnapshot<
          Order,
          DocumentData
        > | null;
        state.totalOrders = action.payload.totalOrders;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Create Order
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders.push(action.payload as Order);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update Order
      .addCase(editOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editOrder.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.orders.findIndex(
          (order) => order.id === (action.payload as Order).id
        );
        if (index !== -1) {
          state.orders[index] = action.payload as Order;
        }
      })
      .addCase(editOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete Order
      .addCase(removeOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = state.orders.filter(
          (order) => order.id !== action.payload
        );
      })
      .addCase(removeOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetState, clearError, setOrderById, resetOrder, resetOrders } =
  orderSlice.actions;

export default orderSlice.reducer;
