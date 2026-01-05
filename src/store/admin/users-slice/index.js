import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_BASE_URL } from '../../../config';

// Async thunk to fetch all users
export const fetchAllUsers = createAsyncThunk(
  'adminUsers/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch users`);
      }

      const result = await response.json();
      
      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.message || 'Failed to fetch users');
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to update user role
export const updateUserRole = createAsyncThunk(
  'adminUsers/updateRole',
  async ({ userId, role }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/role`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ role })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to update user role`);
      }

      const result = await response.json();
      
      if (result.success) {
        return { userId, role, user: result.data };
      } else {
        throw new Error(result.message || 'Failed to update user role');
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to update user status
export const updateUserStatus = createAsyncThunk(
  'adminUsers/updateStatus',
  async ({ userId, status }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/status`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to update user status`);
      }

      const result = await response.json();
      
      if (result.success) {
        return { userId, status, user: result.data };
      } else {
        throw new Error(result.message || 'Failed to update user status');
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to delete user
export const deleteUser = createAsyncThunk(
  'adminUsers/deleteUser',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to delete user`);
      }

      const result = await response.json();
      
      if (result.success) {
        return userId;
      } else {
        throw new Error(result.message || 'Failed to delete user');
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const adminUsersSlice = createSlice({
  name: 'adminUsers',
  initialState: {
    users: [],
    loading: false,
    error: null,
    updatingUser: null
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all users
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
        state.error = null;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update user role
      .addCase(updateUserRole.pending, (state) => {
        state.updatingUser = true;
      })
      .addCase(updateUserRole.fulfilled, (state, action) => {
        state.updatingUser = false;
        const { userId, role, user } = action.payload;
        const userIndex = state.users.findIndex(u => u._id === userId);
        if (userIndex !== -1) {
          state.users[userIndex] = { ...state.users[userIndex], role };
        }
      })
      .addCase(updateUserRole.rejected, (state, action) => {
        state.updatingUser = false;
        state.error = action.payload;
      })
      // Update user status
      .addCase(updateUserStatus.pending, (state) => {
        state.updatingUser = true;
      })
      .addCase(updateUserStatus.fulfilled, (state, action) => {
        state.updatingUser = false;
        const { userId, status, user } = action.payload;
        const userIndex = state.users.findIndex(u => u._id === userId);
        if (userIndex !== -1) {
          state.users[userIndex] = { ...state.users[userIndex], status };
        }
      })
      .addCase(updateUserStatus.rejected, (state, action) => {
        state.updatingUser = false;
        state.error = action.payload;
      })
      // Delete user
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter(user => user._id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.error = action.payload;
      });
  }
});

export const { clearError } = adminUsersSlice.actions;
export default adminUsersSlice.reducer;