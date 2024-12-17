// src/redux/slices/authSlice.ts

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  signInWithCredentials,
  logOutUser,
  initializeAuthState,
} from "./authService";

interface AuthState {
  user: Record<string, any> | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

// Sign in action
export const signIn = createAsyncThunk(
  "auth/signIn",
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const userData = await signInWithCredentials(email, password);
      return userData;
    } catch (error: any) {
      return rejectWithValue(error.message || "An unknown error occurred.");
    }
  }
);

// Log out action
export const logOut = createAsyncThunk(
  "auth/logOut",
  async (_, { rejectWithValue }) => {
    try {
      await logOutUser();
    } catch (error: any) {
      return rejectWithValue(error.message || "An unknown error occurred.");
    }
  }
);

// Initialize auth state (Check persistence on reload)
export const initializeAuth = createAsyncThunk(
  "auth/initializeAuth",
  async (_, { dispatch }) => {
    const userData = await initializeAuthState();
    if (userData) {
      dispatch(setUser(userData));
    }
    return userData;
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.loading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    reset: (state) => {
      state.user = null;
    },
    updateUserData: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(initializeAuth.rejected, (state, action) => {
        state.error = action.payload as string;
        console.error("Error initializing user:", action.payload);
      })
      .addCase(signIn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(signIn.rejected, (state, action) => {
        console.error("Sign-in failed:", action);
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(logOut.fulfilled, (state) => {
        state.user = null;
      })
      .addCase(logOut.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { setUser, clearError, reset, updateUserData } = authSlice.actions;

export default authSlice.reducer;
