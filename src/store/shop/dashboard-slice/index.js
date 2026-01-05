import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchWalletBalance } from '../wallet-slice';
import { fetchUserOrders } from '../order-slice';

export const fetchDashboardData = createAsyncThunk(
  'dashboard/fetchDashboardData',
  async (userId, { dispatch }) => {
    await Promise.all([
      dispatch(fetchWalletBalance(userId)),
      dispatch(fetchUserOrders(userId))
    ]);
    return userId;
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    loading: false,
    error: null
  },
  reducers: {
    clearDashboardError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export const { clearDashboardError } = dashboardSlice.actions;
export default dashboardSlice.reducer;