import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_BASE_URL } from '../../../config';

// Async thunk to fetch all users with wallet balances
export const fetchAllUsersWithWallets = createAsyncThunk(
  'adminWallet/fetchAllUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/wallets`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch users with wallets`);
      }

      const result = await response.json();
      
      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.message || 'Failed to fetch users with wallets');
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to adjust wallet balance
export const adjustWalletBalance = createAsyncThunk(
  'adminWallet/adjustBalance',
  async ({ userId, amount, description }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/wallets/adjust-balance`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId,
          amount: parseFloat(amount),
          description: description || 'Admin adjustment'
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to adjust wallet balance`);
      }

      const result = await response.json();
      
      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.message || 'Failed to adjust wallet balance');
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to get wallet transactions
export const fetchWalletTransactions = createAsyncThunk(
  'adminWallet/fetchTransactions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/wallets/transactions`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch wallet transactions`);
      }

      const result = await response.json();
      
      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.message || 'Failed to fetch wallet transactions');
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const adminWalletSlice = createSlice({
  name: 'adminWallet',
  initialState: {
    users: [],
    selectedUser: null,
    userTransactions: [],
    loading: false,
    updating: false,
    error: null
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    clearSelectedUser: (state) => {
      state.selectedUser = null;
      state.userTransactions = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all users with wallets
      .addCase(fetchAllUsersWithWallets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsersWithWallets.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
        state.error = null;
      })
      .addCase(fetchAllUsersWithWallets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Adjust wallet balance
      .addCase(adjustWalletBalance.pending, (state) => {
        state.updating = true;
      })
      .addCase(adjustWalletBalance.fulfilled, (state, action) => {
        state.updating = false;
        const updatedWallet = action.payload.wallet;
        
        // Update user balance in the list
        const userIndex = state.users.findIndex(u => u.userId === updatedWallet.userId);
        if (userIndex !== -1) {
          state.users[userIndex].balance = updatedWallet.balance;
        }
        
        // Update selected user balance if it's the same user
        if (state.selectedUser && state.selectedUser.userId === updatedWallet.userId) {
          state.selectedUser.balance = updatedWallet.balance;
        }
      })
      .addCase(adjustWalletBalance.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload;
      })
      // Fetch wallet transactions
      .addCase(fetchWalletTransactions.fulfilled, (state, action) => {
        state.userTransactions = action.payload;
      })
      .addCase(fetchWalletTransactions.rejected, (state, action) => {
        state.error = action.payload;
      });
  }
});

export const { clearError, setSelectedUser, clearSelectedUser } = adminWalletSlice.actions;
export default adminWalletSlice.reducer;