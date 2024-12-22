import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchVouchers,
  addVoucher,
  updateVoucher,
  deleteVoucher,
} from "./voucherService";
import { Voucher } from "../../types/Shopping";

// Define the initial state using the Voucher type
interface VoucherState {
  vouchers: Voucher[];
  loading: boolean;
  error: string | null;
}

const initialState: VoucherState = {
  vouchers: [],
  loading: false,
  error: null,
};

// Fetch all vouchers
export const fetchAllVouchers = createAsyncThunk(
  "voucher/fetchAllVouchers",
  async (_, { rejectWithValue }) => {
    try {
      const vouchers = await fetchVouchers();
      return vouchers;
    } catch (error: any) {
      return rejectWithValue(
        error.message || "An error occurred while fetching vouchers."
      );
    }
  }
);

// Add a new voucher
export const createVoucher = createAsyncThunk(
  "voucher/createVoucher",
  async (voucher: Voucher, { rejectWithValue }) => {
    try {
      const newVoucher = await addVoucher(voucher);
      return newVoucher;
    } catch (error: any) {
      return rejectWithValue(
        error.message || "An error occurred while adding voucher."
      );
    }
  }
);

// Update a voucher
export const editVoucher = createAsyncThunk(
  "voucher/editVoucher",
  async (
    { id, updatedVoucher }: { id: string; updatedVoucher: Voucher },
    { rejectWithValue }
  ) => {
    try {
      const updated = await updateVoucher(id, updatedVoucher);
      return updated;
    } catch (error: any) {
      return rejectWithValue(
        error.message || "An error occurred while updating voucher."
      );
    }
  }
);

// Delete a voucher
export const removeVoucher = createAsyncThunk(
  "voucher/removeVoucher",
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteVoucher(id);
      return id; // Return voucher id on successful removal
    } catch (error: any) {
      return rejectWithValue(
        error.message || "An error occurred while deleting voucher."
      );
    }
  }
);

const voucherSlice = createSlice({
  name: "voucher",
  initialState,
  reducers: {
    resetState: (state) => {
      state.vouchers = [];
      state.loading = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllVouchers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllVouchers.fulfilled, (state, action) => {
        state.loading = false;
        state.vouchers = action.payload;
      })
      .addCase(fetchAllVouchers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createVoucher.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createVoucher.fulfilled, (state, action) => {
        state.loading = false;
        state.vouchers.push(action.payload);
      })
      .addCase(createVoucher.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(editVoucher.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editVoucher.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.vouchers.findIndex(
          (voucher) => voucher.id === (action.payload as Voucher).id
        );
        if (index !== -1) {
          state.vouchers[index] = action.payload as Voucher;
        }
      })
      .addCase(editVoucher.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(removeVoucher.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeVoucher.fulfilled, (state, action) => {
        state.loading = false;
        state.vouchers = state.vouchers.filter(
          (voucher) => voucher.id !== action.payload
        );
      })
      .addCase(removeVoucher.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetState, clearError } = voucherSlice.actions;

export default voucherSlice.reducer;
