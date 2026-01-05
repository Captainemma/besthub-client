import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk to fetch admin dashboard data
export const fetchAdminDashboardData = createAsyncThunk(
  'adminDashboard/fetchData',
  async (_, { rejectWithValue }) => {
    try {
      console.log('🔄 Fetching dashboard data with cookies...');
      
      const response = await fetch(`${API_BASE_URL}/admin/dashboard`, {
        credentials: 'include', // This sends cookies automatically
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('📊 Response status:', response.status);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch dashboard data`);
      }

      const result = await response.json();
      console.log('✅ API result:', result);
      
      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.message || 'Failed to fetch dashboard data');
      }
    } catch (error) {
      console.error('💥 Fetch error:', error);
      return rejectWithValue(error.message);
    }
  }
);

const adminDashboardSlice = createSlice({
  name: 'adminDashboard',
  initialState: {
    data: {
      totalCustomerBalance: 0,
      todaySales: 0,
      totalRevenue: 0,
      totalTransactions: 0,
      todayOrders: 0,
      activeCustomers: 0,
      totalCustomers: 0,
      totalUsers: 0,
      mtnSales: 0,
      telecelSales: 0,
      atSales: 0
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
      .addCase(fetchAdminDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(fetchAdminDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearError } = adminDashboardSlice.actions;
export default adminDashboardSlice.reducer;