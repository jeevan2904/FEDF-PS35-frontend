import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";

export const fetchTasks = createAsyncThunk(
  "tasks/fetchAll",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams(filters);
      const res = await api.get(`/tasks?${params}`);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch tasks"
      );
    }
  }
);

export const fetchTaskById = createAsyncThunk(
  "tasks/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/tasks/${id}`);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch task"
      );
    }
  }
);

export const createTask = createAsyncThunk(
  "tasks/create",
  async (taskData, { rejectWithValue }) => {
    try {
      const res = await api.post("/tasks", taskData);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create task"
      );
    }
  }
);

export const updateTask = createAsyncThunk(
  "tasks/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/tasks/${id}`, data);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update task"
      );
    }
  }
);

export const updateTaskStatus = createAsyncThunk(
  "tasks/updateStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const res = await api.patch(`/tasks/${id}/status`, { status });
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update status"
      );
    }
  }
);

export const addTaskComment = createAsyncThunk(
  "tasks/addComment",
  async ({ id, text }, { rejectWithValue }) => {
    try {
      const res = await api.post(`/tasks/${id}/comments`, { text });
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add comment"
      );
    }
  }
);

export const deleteTask = createAsyncThunk(
  "tasks/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/tasks/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete task"
      );
    }
  }
);

const taskSlice = createSlice({
  name: "tasks",
  initialState: {
    tasks: [],
    currentTask: null,
    status: "idle",
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentTask: (state) => {
      state.currentTask = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.tasks = action.payload;
        state.error = null;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Fetch task by ID
      .addCase(fetchTaskById.fulfilled, (state, action) => {
        state.currentTask = action.payload;
      })
      // Create task
      .addCase(createTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload);
      })
      // Update task
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(
          (t) => t._id === action.payload._id
        );
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
        state.currentTask = action.payload;
      })
      // Update task status
      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(
          (t) => t._id === action.payload._id
        );
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      // Delete task
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((t) => t._id !== action.payload);
      });
  },
});

export const { clearError, clearCurrentTask } = taskSlice.actions;
export default taskSlice.reducer;
