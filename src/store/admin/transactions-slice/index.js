import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk to fetch all transactions
export const fetchAllTransactions = createAsyncThunk(
  'adminTransactions/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:4400/api/admin/transactions', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch transactions`);
      }

      const result = await response.json();
      
      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.message || 'Failed to fetch transactions');
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to fetch transaction stats
export const fetchTransactionStats = createAsyncThunk(
  'adminTransactions/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:4400/api/admin/transactions/stats', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch transaction stats`);
      }

      const result = await response.json();
      
      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.message || 'Failed to fetch transaction stats');
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const adminTransactionsSlice = createSlice({
  name: 'adminTransactions',
  initialState: {
    transactions: [],
    stats: {
      totalTransactions: 0,
      totalRevenue: 0,
      todayTransactions: 0,
      todayRevenue: 0
    },
    loading: false,
    error: null
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all transactions
      .addCase(fetchAllTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload;
        state.error = null;
      })
      .addCase(fetchAllTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch transaction stats
      .addCase(fetchTransactionStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      })
      .addCase(fetchTransactionStats.rejected, (state, action) => {
        state.error = action.payload;
      });
  }
});

export const { clearError } = adminTransactionsSlice.actions;
export default adminTransactionsSlice.reducer;