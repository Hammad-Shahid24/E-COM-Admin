import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "./productService";
import { Product } from "../../types/Shopping";
import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";

// Define the initial state using the Product type
interface ProductState {
  products: Product[];
  product: Product | null;
  loading: boolean;
  error: string | null;
  lastVisible: null | QueryDocumentSnapshot<Product, DocumentData>; // Store only the last visible document ID
  totalProducts: number | null;
  // totalPages?: number | null;
}

const initialState: ProductState = {
  products: [],
  product: null,
  loading: false,
  error: null,
  lastVisible: null, // Store the last visible ID, not the full document
  totalProducts: null,
  // totalPages: null,
};

// Fetch products
export const fetchAllProducts = createAsyncThunk(
  "product/fetchAllProducts",
  async (
    {
      pageSize,
      sortField = "createdAt",
      sortOrder = "desc",
    }: { pageSize: number; sortField?: string; sortOrder?: "asc" | "desc" },

    { rejectWithValue, getState }
  ) => {
    try {
      const state = getState() as { products: ProductState };
      const lastVisible = state.products.lastVisible;

      // Call fetchProducts with lastVisible and pageSize
      const {
        products,
        lastVisible: updatedLastVisible,
        totalProducts,
      } = await fetchProducts(lastVisible, pageSize, sortField, sortOrder);

      // Return products and the updated lastVisible value
      return {
        products,
        lastVisible: updatedLastVisible,
        totalProducts,
      };
    } catch (error: any) {
      // Catch any error and provide a more informative message
      let errorMessage = "An error occurred while fetching products.";
      if (error instanceof Error) {
        errorMessage = error.message; // If it's an instance of Error, use the message
      } else if (typeof error === "string") {
        errorMessage = error; // If it's a string, just use it directly
      }
      return rejectWithValue(errorMessage);
    }
  }
);

// Add a new product
export const createProduct = createAsyncThunk(
  "product/createProduct",
  async (product: Product, { rejectWithValue }) => {
    try {
      const newProduct = await addProduct(product);
      return newProduct;
    } catch (error: any) {
      return rejectWithValue(
        error.message || "An error occurred while adding product."
      );
    }
  }
);

// Update a product
export const editProduct = createAsyncThunk(
  "product/editProduct",
  async (
    { id, updatedProduct }: { id: string; updatedProduct: Product },
    { rejectWithValue }
  ) => {
    try {
      const updated = await updateProduct(id, updatedProduct);
      return updated;
    } catch (error: any) {
      return rejectWithValue(
        error.message || "An error occurred while updating product."
      );
    }
  }
);

// Delete a product
export const removeProduct = createAsyncThunk(
  "product/removeProduct",
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteProduct(id);
      return id; // Return product id on successful removal
    } catch (error: any) {
      return rejectWithValue(
        error.message || "An error occurred while deleting product."
      );
    }
  }
);

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    resetState: (state) => {
      state.products = [];
      state.loading = false;
      state.error = null;
      state.lastVisible = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setProductById: (state, action) => {
      state.product =
        state.products.find((product) => product.id === action.payload) ?? null;
    },
    resetProduct: (state) => {
      state.product = null;
    },
    resetProducts: (state) => {
      state.products = [];
      state.lastVisible = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.loading = false;

        // Filter out products that are already in the state
        const newProducts = action.payload.products.filter(
          (newProduct) =>
            !state.products.some((product) => product.id === newProduct.id)
        );

        // Concatenate only unique products
        state.products = state.products.concat(newProducts);
        state.lastVisible = action.payload.lastVisible as QueryDocumentSnapshot<
          Product,
          DocumentData
        > | null;
        state.totalProducts = action.payload.totalProducts;
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.push(action.payload as Product);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(editProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editProduct.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.products.findIndex(
          (product) => product.id === (action.payload as Product).id
        );
        if (index !== -1) {
          state.products[index] = action.payload as Product;
        }
      })
      .addCase(editProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(removeProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.filter(
          (product) => product.id !== action.payload
        );
      })
      .addCase(removeProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  resetState,
  clearError,
  setProductById,
  resetProduct,
  resetProducts,
} = productSlice.actions;

export default productSlice.reducer;
