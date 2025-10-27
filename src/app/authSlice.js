import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";
import { jwtDecode } from "jwt-decode";

export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await api.post("/auth/login", credentials);

      // Backend returns 'accessToken', not 'token'
      const token = res.data.accessToken;

      // Store tokens immediately after successful login
      if (token) {
        localStorage.setItem("token", token);
      }
      if (res.data.refreshToken) {
        localStorage.setItem("refreshToken", res.data.refreshToken);
      }

      // Store user info separately
      if (res.data.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }

      // Normalize response to use 'token' key
      return {
        ...res.data,
        token: token,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post("/auth/register", data);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Registration failed"
      );
    }
  }
);

// --- Helper to check token validity ---
function getUserFromToken(token) {
  try {
    const decoded = jwtDecode(token);

    // Check expiration (exp is in seconds, convert to ms)
    if (decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return null;
    }

    return { id: decoded.id, role: decoded.role };
  } catch {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return null;
  }
}

// Get initial state from localStorage
const token = localStorage.getItem("token");
const storedUser = localStorage.getItem("user");

// Validate token and get user
let initialUser = null;
if (token && getUserFromToken(token)) {
  try {
    initialUser = storedUser ? JSON.parse(storedUser) : null;
  } catch {
    localStorage.removeItem("user");
  }
}

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: initialUser,
    token: initialUser ? token : null,
    refreshToken: localStorage.getItem("refreshToken") || null,
    status: "idle",
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.status = "idle";
      state.error = null;
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        // Store the full user object from backend response
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Login failed";
        state.user = null;
        state.token = null;
      })
      // Register cases
      .addCase(register.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Registration failed";
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
