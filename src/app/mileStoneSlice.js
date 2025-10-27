import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";

export const fetchMilestones = createAsyncThunk(
  "milestones/fetchAll",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams(filters);
      const res = await api.get(`/milestones?${params}`);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch milestones"
      );
    }
  }
);

export const fetchMilestoneById = createAsyncThunk(
  "milestones/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/milestones/${id}`);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch milestone"
      );
    }
  }
);

export const createMilestone = createAsyncThunk(
  "milestones/create",
  async (milestoneData, { rejectWithValue }) => {
    try {
      const res = await api.post("/milestones", milestoneData);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create milestone"
      );
    }
  }
);

export const updateMilestone = createAsyncThunk(
  "milestones/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/milestones/${id}`, data);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update milestone"
      );
    }
  }
);

export const updateMilestoneStatus = createAsyncThunk(
  "milestones/updateStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const res = await api.patch(`/milestones/${id}/status`, { status });
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update status"
      );
    }
  }
);

export const deleteMilestone = createAsyncThunk(
  "milestones/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/milestones/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete milestone"
      );
    }
  }
);

const milestoneSlice = createSlice({
  name: "milestones",
  initialState: {
    milestones: [],
    currentMilestone: null,
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
      .addCase(fetchMilestones.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMilestones.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.milestones = action.payload;
        state.error = null;
      })
      .addCase(fetchMilestones.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchMilestoneById.fulfilled, (state, action) => {
        state.currentMilestone = action.payload;
      })
      .addCase(createMilestone.fulfilled, (state, action) => {
        state.milestones.push(action.payload);
      })
      .addCase(updateMilestone.fulfilled, (state, action) => {
        const index = state.milestones.findIndex(
          (m) => m._id === action.payload._id
        );
        if (index !== -1) {
          state.milestones[index] = action.payload;
        }
      })
      .addCase(deleteMilestone.fulfilled, (state, action) => {
        state.milestones = state.milestones.filter(
          (m) => m._id !== action.payload
        );
      });
  },
});

export const { clearError } = milestoneSlice.actions;
export default milestoneSlice.reducer;
