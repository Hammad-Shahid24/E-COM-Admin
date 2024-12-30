import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { fetchOrders, updateOrder, deleteOrder, } from "./orderService";
import { Order } from "../../types/Shopping";

// Initial State
interface OrderState {
  orders: Order[];
  order: Order | null;
  loading: boolean;
  error: string | null;
  lastVisible: any | null;
  totalOrders: number;
}

const initialState: OrderState = {
  orders: [],
  order: null,
  loading: false,
  error: null,
  lastVisible: null,
  totalOrders: 0,
};



// Fetch Orders with Pagination and Filtering
export const fetchAllOrders = createAsyncThunk(
  "orders/fetchAllOrders",
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

      // Call fetchOrders with lastVisible and pageSize
      const {
        orders,
        lastVisible: updatedLastVisible,
        totalOrders,
      } = await fetchOrders(lastVisible, pageSize, sortField, sortOrder);

      // Return orders and the updated lastVisible value
      return {
        orders,
        lastVisible: updatedLastVisible,
        totalOrders,
      };
    } catch (error: any) {
      // Catch any error and provide a more informative message
      let errorMessage = "An error occurred while fetching orders.";
      if (error instanceof Error) {
        errorMessage = error.message; // If it's an instance of Error, use the message
      } else if (typeof error === "string") {
        errorMessage = error; // If it's a string, just use it directly
      }
      return rejectWithValue(errorMessage);
    }
  }
);

// Edit Order
export const editOrder = createAsyncThunk(
  "orders/editOrder",
  async ({ id, updatedOrder }: { id: string; updatedOrder: Order }, { rejectWithValue }) => {
    try {
      const result = await updateOrder(id, updatedOrder);
      return { id, updatedOrder: result };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : String(error));
    }
  }
);

// Delete Order
export const removeOrder = createAsyncThunk(
  "orders/removeOrder",
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteOrder(id);
      return id;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : String(error));
    }
  }

);


// Slice
const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    resetState: () => initialState,
    clearError(state) {
      state.error = null;
    },
    setOrderById(state, action: PayloadAction<string>) {
      const foundOrder = state.orders.find((order) => order.id === action.payload);
      if (foundOrder) state.order = foundOrder;
    },
    resetOrder(state) {
      state.order = null;
    },
    resetOrders(state) {
      state.orders = [];
      state.lastVisible = null;
      state.totalOrders = 0;
    },
    setOrders(state, action: PayloadAction<Order[]>) {
      // Filter out duplicate orders
      // const newOrders = action.payload.filter(
      //   (newOrder) => !state.orders.some((order) => order.id === newOrder.id)
      // );
    }
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

        // Filter out duplicate orders
        const newOrders = action.payload.orders.filter(
          (newOrder) => !state.orders.some((order) => order.id === newOrder.id)
        );

        //Concatenate the new orders with the existing orders
        state.orders = state.orders.concat(newOrders);
        state.lastVisible = action.payload.lastVisible;
        state.totalOrders = action.payload.totalOrders;



      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Edit Order
      .addCase(editOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editOrder.fulfilled, (state, action) => {
        const { id, updatedOrder } = action.payload;
        state.orders = state.orders.map((order) => (order.id === id ? updatedOrder : order));
        state.loading = false;
      })
      .addCase(editOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Remove Order
      .addCase(removeOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeOrder.fulfilled, (state, action) => {
        const id = action.payload;
        state.orders = state.orders.filter((order) => order.id !== id);
        state.loading = false;
      })
      .addCase(removeOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Exported Actions
export const { resetState, clearError, setOrderById, resetOrder, resetOrders, setOrders } = orderSlice.actions;

// Exported Reducer
export default orderSlice.reducer;


