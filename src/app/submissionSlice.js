// app/submissionSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";

export const fetchSubmissions = createAsyncThunk(
  "submissions/fetchAll",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams(filters);
      const res = await api.get(`/submissions?${params}`);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch submissions"
      );
    }
  }
);

export const fetchSubmissionById = createAsyncThunk(
  "submissions/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/submissions/${id}`);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch submission"
      );
    }
  }
);

export const createSubmission = createAsyncThunk(
  "submissions/create",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await api.post("/submissions", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create submission"
      );
    }
  }
);

export const gradeSubmission = createAsyncThunk(
  "submissions/grade",
  async ({ id, gradeData }, { rejectWithValue }) => {
    try {
      const res = await api.post(`/submissions/${id}/grade`, gradeData);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to grade submission"
      );
    }
  }
);

export const updateSubmissionStatus = createAsyncThunk(
  "submissions/updateStatus",
  async ({ id, status, feedback }, { rejectWithValue }) => {
    try {
      const res = await api.patch(`/submissions/${id}/status`, {
        status,
        feedback,
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update status"
      );
    }
  }
);

export const deleteSubmission = createAsyncThunk(
  "submissions/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/submissions/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete submission"
      );
    }
  }
);

const submissionSlice = createSlice({
  name: "submissions",
  initialState: {
    submissions: [],
    currentSubmission: null,
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
      .addCase(fetchSubmissions.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchSubmissions.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.submissions = action.payload;
        state.error = null;
      })
      .addCase(fetchSubmissions.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchSubmissionById.fulfilled, (state, action) => {
        state.currentSubmission = action.payload;
      })
      .addCase(createSubmission.fulfilled, (state, action) => {
        state.submissions.push(action.payload);
      })
      .addCase(gradeSubmission.fulfilled, (state, action) => {
        const index = state.submissions.findIndex(
          (s) => s._id === action.payload._id
        );
        if (index !== -1) {
          state.submissions[index] = action.payload;
        }
        state.currentSubmission = action.payload;
      })
      .addCase(deleteSubmission.fulfilled, (state, action) => {
        state.submissions = state.submissions.filter(
          (s) => s._id !== action.payload
        );
      });
  },
});

export const { clearError } = submissionSlice.actions;
export default submissionSlice.reducer;
