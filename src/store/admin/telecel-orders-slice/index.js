import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk to fetch all Telecel orders
export const fetchAllTelecelOrders = createAsyncThunk(
  'telecelOrders/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      console.log('🔄 Redux: Fetching Telecel orders from API...');
      
      const response = await fetch('http://localhost:4400/api/admin/orders/telecel', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API response not OK:', response.status, errorText);
        throw new Error(`HTTP ${response.status}: Failed to fetch Telecel orders`);
      }

      const result = await response.json();
      
      console.log('📡 Redux: API response received:', {
        success: result.success,
        dataLength: result.data?.length,
        total: result.total,
        message: result.message
      });

      if (result.success) {
        console.log(`✅ Redux: Successfully loaded ${result.data.length} Telecel orders`);
        return result.data;
      } else {
        console.error('❌ Redux: API returned failure:', result.message);
        throw new Error(result.message || 'Failed to fetch Telecel orders');
      }
    } catch (error) {
      console.error('❌ Redux: Fetch Telecel orders error:', error);
      return rejectWithValue(error.message);
    }
  }
);

// Alternative: Fetch all orders and filter on frontend
export const fetchAllOrders = createAsyncThunk(
  'telecelOrders/fetchAllOrders',
  async (_, { rejectWithValue }) => {
    try {
      console.log('🔄 Redux: Fetching ALL orders from API...');
      
      const response = await fetch('http://localhost:4400/api/admin/orders/telecel/all', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch all orders`);
      }

      const result = await response.json();
      
      console.log('📡 Redux: All orders API response:', {
        success: result.success,
        telecelOrdersLength: result.data?.length,
        allOrdersCount: result.allOrdersCount,
        message: result.message
      });

      if (result.success) {
        console.log(`✅ Redux: Successfully loaded ${result.data.length} Telecel orders from ${result.allOrdersCount} total orders`);
        return result.data;
      } else {
        throw new Error(result.message || 'Failed to fetch all orders');
      }
    } catch (error) {
      console.error('❌ Redux: Fetch all orders error:', error);
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to update order status
export const updateOrderStatus = createAsyncThunk(
  'telecelOrders/updateStatus',
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      console.log(`🔄 Redux: Updating Telecel order ${orderId} status to ${status}`);
      
      const response = await fetch(`http://localhost:4400/api/admin/orders/telecel/${orderId}/status`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to update order status`);
      }

      const result = await response.json();
      
      if (result.success) {
        console.log(`✅ Redux: Telecel order ${orderId} status updated to ${status}`);
        return { orderId, status, order: result.data };
      } else {
        throw new Error(result.message || 'Failed to update order status');
      }
    } catch (error) {
      console.error('❌ Redux: Update Telecel order status error:', error);
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for bulk status update
export const bulkUpdateOrderStatus = createAsyncThunk(
  'telecelOrders/bulkUpdateStatus',
  async ({ orderIds, status }, { rejectWithValue }) => {
    try {
      console.log(`🔄 Redux: Bulk updating ${orderIds.length} Telecel orders status to ${status}`);
      
      const response = await fetch('http://localhost:4400/api/admin/orders/telecel/bulk-status', {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ orderIds, status })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to update orders status`);
      }

      const result = await response.json();
      
      if (result.success) {
        console.log(`✅ Redux: Bulk updated ${result.data.updatedCount} Telecel orders`);
        return { orderIds, status, updatedCount: result.data.updatedCount };
      } else {
        throw new Error(result.message || 'Failed to update orders status');
      }
    } catch (error) {
      console.error('❌ Redux: Bulk update Telecel order status error:', error);
      return rejectWithValue(error.message);
    }
  }
);

const telecelOrdersSlice = createSlice({
  name: 'telecelOrders',
  initialState: {
    orders: [],
    loading: false,
    updating: false,
    bulkUpdating: false,
    error: null,
    lastFetch: null
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setOrders: (state, action) => {
      state.orders = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all Telecel orders
      .addCase(fetchAllTelecelOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllTelecelOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
        state.error = null;
        state.lastFetch = new Date().toISOString();
      })
      .addCase(fetchAllTelecelOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.orders = [];
      })
      // Fetch all orders
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
        state.error = null;
        state.lastFetch = new Date().toISOString();
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.orders = [];
      })
      // Update single order status
      .addCase(updateOrderStatus.pending, (state) => {
        state.updating = true;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.updating = false;
        const { orderId, status } = action.payload;
        
        // Update the order in the list
        const orderIndex = state.orders.findIndex(order => order._id === orderId);
        if (orderIndex !== -1) {
          state.orders[orderIndex].status = status;
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload;
      })
      // Bulk update order status
      .addCase(bulkUpdateOrderStatus.pending, (state) => {
        state.bulkUpdating = true;
      })
      .addCase(bulkUpdateOrderStatus.fulfilled, (state, action) => {
        state.bulkUpdating = false;
        const { orderIds, status } = action.payload;
        
        // Update all selected orders in the list
        state.orders = state.orders.map(order => 
          orderIds.includes(order._id) ? { ...order, status } : order
        );
      })
      .addCase(bulkUpdateOrderStatus.rejected, (state, action) => {
        state.bulkUpdating = false;
        state.error = action.payload;
      });
  }
});

export const { clearError, setOrders } = telecelOrdersSlice.actions;
export default telecelOrdersSlice.reducer;