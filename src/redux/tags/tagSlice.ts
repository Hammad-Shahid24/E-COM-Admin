import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchTags, addTag, updateTag, deleteTag } from "./tagService";
import { Tag } from "../../types/Shopping";

// Define the initial state using the TagsData type
interface TagsState {
  tags: Tag[]; // Default as an empty array
  tag: Tag | null;
  loading: boolean;
  error: string | null;
}

const initialState: TagsState = {
  tags: [], // Initialize as an empty array
  tag: null,
  loading: false,
  error: null,
};

// Fetch all tags
export const fetchAllTags = createAsyncThunk(
  "tags/fetchAllTags",
  async (_, { rejectWithValue }) => {
    try {
      const tags = await fetchTags();
      return tags;
    } catch (error: any) {
      return rejectWithValue(
        error.message || "An error occurred while fetching tags."
      );
    }
  }
);

// Add a new tag
export const createTag = createAsyncThunk(
  "tags/createTag",
  async (tag: Tag, { rejectWithValue }) => {
    try {
      const newTag = await addTag(tag);
      return newTag;
    } catch (error: any) {
      return rejectWithValue(
        error.message || "An error occurred while adding tag."
      );
    }
  }
);

// Update a tag
export const editTag = createAsyncThunk(
  "tags/editTag",
  async (
    { id, updatedTag }: { id: string; updatedTag: Tag },
    { rejectWithValue }
  ) => {
    try {
      const updated = await updateTag(id, updatedTag);
      return updated;
    } catch (error: any) {
      return rejectWithValue(
        error.message || "An error occurred while updating tag."
      );
    }
  }
);

// Delete a tag
export const removeTag = createAsyncThunk(
  "tags/removeTag",
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteTag(id);
      return id; // Return tag id on successful removal
    } catch (error: any) {
      return rejectWithValue(
        error.message || "An error occurred while deleting tag."
      );
    }
  }
);

const tagsSlice = createSlice({
  name: "tags",
  initialState,
  reducers: {
    resetState: (state) => {
      state.tags = [];
      state.loading = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setTagById: (state, action) => {
      state.tag =
        state.tags.find((tag) => tag.id === (action.payload as string)) ?? null;
    },
    resetTag: (state) => {
      state.tag = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllTags.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllTags.fulfilled, (state, action) => {
        state.loading = false;
        state.tags = action.payload as Tag[];
      })
      .addCase(fetchAllTags.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createTag.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTag.fulfilled, (state, action) => {
        state.loading = false;
        // Add the new tag to the array
        state.tags.push(action.payload as Tag);
      })
      .addCase(createTag.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(editTag.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editTag.fulfilled, (state, action) => {
        state.loading = false;
        // Update the tag in the array
        const index = state.tags.findIndex(
          (tag) => tag.id === (action.payload as Tag).id
        );
        if (index !== -1) {
          state.tags[index] = action.payload as Tag;
        }
      })
      .addCase(editTag.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(removeTag.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeTag.fulfilled, (state, action) => {
        state.loading = false;
        // Remove the tag based on id
        state.tags = state.tags.filter((tag) => tag.id !== action.payload);
      })
      .addCase(removeTag.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetState, clearError, setTagById, resetTag } =
  tagsSlice.actions;

export default tagsSlice.reducer;
