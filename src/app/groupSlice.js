import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";

export const fetchGroups = createAsyncThunk(
  "groups/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/groups");
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch groups"
      );
    }
  }
);

export const fetchGroupById = createAsyncThunk(
  "groups/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/groups/${id}`);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch group"
      );
    }
  }
);

export const createGroup = createAsyncThunk(
  "groups/create",
  async (groupData, { rejectWithValue }) => {
    try {
      const res = await api.post("/groups", groupData);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create group"
      );
    }
  }
);

export const updateGroup = createAsyncThunk(
  "groups/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/groups/${id}`, data);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update group"
      );
    }
  }
);

export const addGroupMember = createAsyncThunk(
  "groups/addMember",
  async ({ id, userId, role }, { rejectWithValue }) => {
    try {
      const res = await api.post(`/groups/${id}/members`, { userId, role });
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add member"
      );
    }
  }
);

export const removeGroupMember = createAsyncThunk(
  "groups/removeMember",
  async ({ groupId, userId }, { rejectWithValue }) => {
    try {
      const res = await api.delete(`/groups/${groupId}/members/${userId}`);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to remove member"
      );
    }
  }
);

export const deleteGroup = createAsyncThunk(
  "groups/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/groups/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete group"
      );
    }
  }
);

const groupSlice = createSlice({
  name: "groups",
  initialState: {
    groups: [],
    currentGroup: null,
    status: "idle",
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentGroup: (state) => {
      state.currentGroup = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all groups
      .addCase(fetchGroups.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchGroups.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.groups = action.payload;
        state.error = null;
      })
      .addCase(fetchGroups.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Fetch group by ID
      .addCase(fetchGroupById.fulfilled, (state, action) => {
        state.currentGroup = action.payload;
      })
      // Create group
      .addCase(createGroup.fulfilled, (state, action) => {
        state.groups.push(action.payload);
      })
      // Update group
      .addCase(updateGroup.fulfilled, (state, action) => {
        const index = state.groups.findIndex(
          (g) => g._id === action.payload._id
        );
        if (index !== -1) {
          state.groups[index] = action.payload;
        }
        state.currentGroup = action.payload;
      })
      // Delete group
      .addCase(deleteGroup.fulfilled, (state, action) => {
        state.groups = state.groups.filter((g) => g._id !== action.payload);
      });
  },
});

export const { clearError, clearCurrentGroup } = groupSlice.actions;
export default groupSlice.reducer;
