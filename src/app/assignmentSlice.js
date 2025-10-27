// app/assignmentSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";

// Assign project to student
export const assignProject = createAsyncThunk(
  "assignments/assign",
  async (assignmentData, { rejectWithValue }) => {
    try {
      const res = await api.post("/assignments/assign", assignmentData);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Assignment failed"
      );
    }
  }
);

// Get all assignments
export const fetchAssignments = createAsyncThunk(
  "assignments/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/assignments");
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch assignments"
      );
    }
  }
);

// Get assignments for specific project
export const fetchProjectAssignments = createAsyncThunk(
  "assignments/fetchByProject",
  async (projectId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/assignments/project/${projectId}`);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch assignments"
      );
    }
  }
);

// Update assignment status
export const updateAssignmentStatus = createAsyncThunk(
  "assignments/updateStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const res = await api.patch(`/assignments/${id}/status`, { status });
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update status"
      );
    }
  }
);

// Delete assignment
export const deleteAssignment = createAsyncThunk(
  "assignments/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/assignments/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete assignment"
      );
    }
  }
);

const assignmentSlice = createSlice({
  name: "assignments",
  initialState: {
    assignments: [],
    projectAssignments: [],
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
      // Assign project
      .addCase(assignProject.pending, (state) => {
        state.status = "loading";
      })
      .addCase(assignProject.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.assignments.push(action.payload);
        state.error = null;
      })
      .addCase(assignProject.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Fetch all assignments
      .addCase(fetchAssignments.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAssignments.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.assignments = action.payload;
        state.error = null;
      })
      .addCase(fetchAssignments.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Fetch project assignments
      .addCase(fetchProjectAssignments.fulfilled, (state, action) => {
        state.projectAssignments = action.payload;
      })
      // Update status
      .addCase(updateAssignmentStatus.fulfilled, (state, action) => {
        const index = state.assignments.findIndex(
          (a) => a._id === action.payload._id
        );
        if (index !== -1) {
          state.assignments[index] = action.payload;
        }
      })
      // Delete assignment
      .addCase(deleteAssignment.fulfilled, (state, action) => {
        state.assignments = state.assignments.filter(
          (a) => a._id !== action.payload
        );
      });
  },
});

export const { clearError } = assignmentSlice.actions;
export default assignmentSlice.reducer;
