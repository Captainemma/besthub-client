import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_BASE_URL } from '../../../config';

// Async thunk to fetch all prices
export const fetchAllPrices = createAsyncThunk(
  'prices/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/prices`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch prices`);
      }

      const result = await response.json();
      
      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.message || 'Failed to fetch prices');
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to update prices for specific network and user role
export const updatePrices = createAsyncThunk(
  'prices/update',
  async ({ network, userRole, packages }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/prices/${network}/${userRole}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ packages })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to update prices`);
      }

      const result = await response.json();
      
      if (result.success) {
        return { network, userRole, packages: result.data };
      } else {
        throw new Error(result.message || 'Failed to update prices');
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to add new package to specific network and user role
export const addNewPackage = createAsyncThunk(
  'prices/addPackage',
  async ({ network, userRole, packageData }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/prices/${network}/${userRole}/packages`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(packageData)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to add package`);
      }

      const result = await response.json();
      
      if (result.success) {
        return { network, userRole, package: result.data };
      } else {
        throw new Error(result.message || 'Failed to add package');
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to delete package from specific network and user role
export const deletePackage = createAsyncThunk(
  'prices/deletePackage',
  async ({ network, userRole, packageId }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/prices/${network}/${userRole}/packages/${packageId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to delete package`);
      }

      const result = await response.json();
      
      if (result.success) {
        return { network, userRole, packageId };
      } else {
        throw new Error(result.message || 'Failed to delete package');
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const priceSlice = createSlice({
  name: 'prices',
  initialState: {
    prices: {
      MTN: {
        customer: [],
        agent: [],
        wholesaler: []
      },
      Telecel: {
        customer: [],
        agent: [],
        wholesaler: []
      },
      AT: {
        customer: [],
        agent: [],
        wholesaler: []
      }
    },
    loading: false,
    updating: false,
    error: null
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateLocalPrice: (state, action) => {
      const { network, userRole, packageId, field, value } = action.payload;
      
      if (state.prices[network] && state.prices[network][userRole]) {
        const packageIndex = state.prices[network][userRole].findIndex(pkg => pkg._id === packageId);
        if (packageIndex !== -1) {
          state.prices[network][userRole][packageIndex][field] = parseFloat(value) || 0;
        }
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all prices
      .addCase(fetchAllPrices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllPrices.fulfilled, (state, action) => {
        state.loading = false;
        state.prices = action.payload;
        state.error = null;
      })
      .addCase(fetchAllPrices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update prices
      .addCase(updatePrices.pending, (state) => {
        state.updating = true;
      })
      .addCase(updatePrices.fulfilled, (state, action) => {
        state.updating = false;
        const { network, userRole, packages } = action.payload;
        if (!state.prices[network]) state.prices[network] = {};
        state.prices[network][userRole] = packages;
      })
      .addCase(updatePrices.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload;
      })
      // Add new package
      .addCase(addNewPackage.fulfilled, (state, action) => {
        const { network, userRole, package: newPackage } = action.payload;
        
        if (!state.prices[network]) state.prices[network] = {};
        if (!state.prices[network][userRole]) state.prices[network][userRole] = [];
        
        state.prices[network][userRole].push(newPackage);
      })
      // Delete package
      .addCase(deletePackage.fulfilled, (state, action) => {
        const { network, userRole, packageId } = action.payload;
        
        if (state.prices[network] && state.prices[network][userRole]) {
          state.prices[network][userRole] = state.prices[network][userRole].filter(
            pkg => pkg._id !== packageId
          );
        }
      });
  }
});

export const { clearError, updateLocalPrice } = priceSlice.actions;
export default priceSlice.reducer;