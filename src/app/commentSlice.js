import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";

export const fetchComments = createAsyncThunk(
  "comments/fetchAll",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams(filters);
      const res = await api.get(`/comments?${params}`);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch comments"
      );
    }
  }
);

export const createComment = createAsyncThunk(
  "comments/create",
  async (commentData, { rejectWithValue }) => {
    try {
      const res = await api.post("/comments", commentData);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create comment"
      );
    }
  }
);

export const updateComment = createAsyncThunk(
  "comments/update",
  async ({ id, content }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/comments/${id}`, { content });
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update comment"
      );
    }
  }
);

export const deleteComment = createAsyncThunk(
  "comments/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/comments/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete comment"
      );
    }
  }
);

const commentSlice = createSlice({
  name: "comments",
  initialState: {
    comments: [],
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
      .addCase(fetchComments.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.comments = action.payload;
        state.error = null;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.comments.push(action.payload);
      })
      .addCase(updateComment.fulfilled, (state, action) => {
        const index = state.comments.findIndex(
          (c) => c._id === action.payload._id
        );
        if (index !== -1) {
          state.comments[index] = action.payload;
        }
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.comments = state.comments.filter((c) => c._id !== action.payload);
      });
  },
});

export const { clearError } = commentSlice.actions;
export default commentSlice.reducer;
