import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} from "./categoryService";
import { Category } from "../../types/Shopping";
import { reset } from "../auth/authSlice";

// Define the initial state using the CategoryData type
interface CategoryState {
  categories: Category[]; // Default as an empty array
  category: Category | null;
  loading: boolean;
  error: string | null;
}

const initialState: CategoryState = {
  categories: [], // Initialize as an empty array
  category: null,
  loading: false,
  error: null,
};

// Fetch categories
export const fetchAllCategories = createAsyncThunk(
  "category/fetchAllCategories",
  async (_, { rejectWithValue }) => {
    try {
      const categories = await fetchCategories();
      return categories;
    } catch (error: any) {
      return rejectWithValue(
        error.message || "An error occurred while fetching categories."
      );
    }
  }
);

// Add a new category
export const createCategory = createAsyncThunk(
  "category/createCategory",
  async (category: Category, { rejectWithValue }) => {
    console.log("category", category);
    try {
      const newCategory = await addCategory(category);
      return newCategory;
    } catch (error: any) {
      return rejectWithValue(
        error.message || "An error occurred while adding category."
      );
    }
  }
);

// Update a category
export const editCategory = createAsyncThunk(
  "category/editCategory",
  async (
    { id, updatedCategory }: { id: string; updatedCategory: Category },
    { rejectWithValue }
  ) => {
    try {
      const updated = await updateCategory(id, updatedCategory);
      return updated;
    } catch (error: any) {
      return rejectWithValue(
        error.message || "An error occurred while updating category."
      );
    }
  }
);

// Delete a category
export const removeCategory = createAsyncThunk(
  "category/removeCategory",
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteCategory(id);
      return id; // Return category id on successful removal
    } catch (error: any) {
      return rejectWithValue(
        error.message || "An error occurred while deleting category."
      );
    }
  }
);

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    resetState: (state) => {
      state.categories = [];
      state.loading = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setCategoryById: (state, action) => {
      state.category =
        state.categories.find(
          (category) => category.id === (action.payload as string)
        ) ?? null;
    },
    resetCategory: (state) => {
      state.category = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload as Category[];
      })
      .addCase(fetchAllCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.loading = false;
        // Add the new category to the array
        state.categories.push(action.payload as Category);
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(editCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editCategory.fulfilled, (state, action) => {
        state.loading = false;
        // Update the category in the array
        const index = state.categories.findIndex(
          (category) => category.id === (action.payload as Category).id
        );
        if (index !== -1) {
          state.categories[index] = action.payload as Category;
        }
      })
      .addCase(editCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(removeCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeCategory.fulfilled, (state, action) => {
        state.loading = false;
        // Remove the category based on id
        state.categories = state.categories.filter(
          (category) => category.id !== action.payload
        );
      })
      .addCase(removeCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetState, clearError, setCategoryById, resetCategory } =
  categorySlice.actions;

export default categorySlice.reducer;
