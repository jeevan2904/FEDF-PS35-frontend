import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";

// Fetch all projects
export const fetchProjects = createAsyncThunk(
  "projects/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/projects");
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch projects"
      );
    }
  }
);

// Create project
export const createProject = createAsyncThunk(
  "projects/create",
  async (projectData, { rejectWithValue }) => {
    try {
      const res = await api.post("/projects", projectData);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create project"
      );
    }
  }
);

// Fetch single project
export const fetchProjectById = createAsyncThunk(
  "projects/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/projects/${id}`);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch project"
      );
    }
  }
);

// Update project
export const updateProject = createAsyncThunk(
  "projects/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/projects/${id}`, data);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update project"
      );
    }
  }
);

// Delete project
export const deleteProject = createAsyncThunk(
  "projects/delete",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.delete(`/projects/${id}`);
      return id; // Return the ID for removal from state
    } catch (error) {
      console.error("Frontend delete error:", error.response?.data);
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete project"
      );
    }
  }
);

const projectSlice = createSlice({
  name: "projects",
  initialState: {
    projects: [],
    currentProject: null,
    status: "idle",
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentProject: (state) => {
      state.currentProject = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all projects
      .addCase(fetchProjects.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.projects = action.payload;
        state.error = null;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Create project
      .addCase(createProject.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.projects.push(action.payload);
        state.error = null;
      })
      .addCase(createProject.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Fetch project by ID
      .addCase(fetchProjectById.fulfilled, (state, action) => {
        state.currentProject = action.payload;
      })
      // Update project
      .addCase(updateProject.fulfilled, (state, action) => {
        const index = state.projects.findIndex(
          (p) => p._id === action.payload._id
        );
        if (index !== -1) {
          state.projects[index] = action.payload;
        }
        state.currentProject = action.payload;
      })
      // Delete project
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.projects = state.projects.filter((p) => p._id !== action.payload);
      });
  },
});

export const { clearError, clearCurrentProject } = projectSlice.actions;
export default projectSlice.reducer;
