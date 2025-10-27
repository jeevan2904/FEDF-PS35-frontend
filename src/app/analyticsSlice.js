import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";

export const fetchAdminDashboard = createAsyncThunk(
  "analytics/adminDashboard",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/analytics/admin/dashboard");
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch dashboard"
      );
    }
  }
);

export const fetchStudentDashboard = createAsyncThunk(
  "analytics/studentDashboard",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/analytics/student/dashboard");
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch dashboard"
      );
    }
  }
);

export const fetchProjectAnalytics = createAsyncThunk(
  "analytics/project",
  async (projectId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/analytics/project/${projectId}`);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch analytics"
      );
    }
  }
);

export const fetchGroupAnalytics = createAsyncThunk(
  "analytics/group",
  async (groupId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/analytics/group/${groupId}`);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch analytics"
      );
    }
  }
);

const analyticsSlice = createSlice({
  name: "analytics",
  initialState: {
    dashboardData: null,
    projectAnalytics: null,
    groupAnalytics: null,
    status: "idle",
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminDashboard.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAdminDashboard.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.dashboardData = action.payload;
        state.error = null;
      })
      .addCase(fetchAdminDashboard.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchStudentDashboard.fulfilled, (state, action) => {
        state.dashboardData = action.payload;
      })
      .addCase(fetchProjectAnalytics.fulfilled, (state, action) => {
        state.projectAnalytics = action.payload;
      })
      .addCase(fetchGroupAnalytics.fulfilled, (state, action) => {
        state.groupAnalytics = action.payload;
      });
  },
});

export const { clearError } = analyticsSlice.actions;
export default analyticsSlice.reducer;
