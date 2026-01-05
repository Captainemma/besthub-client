import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_BASE_URL } from '../../../config';  

const initialState = {
  isLoading: false,
  dataPackages: [],
  productDetails: null,
  purchaseLoading: false,
  purchaseError: null,
  networkError: null,
};

// Fetch bundles by network
export const fetchBundlesByNetwork = createAsyncThunk(
  'products/fetchBundlesByNetwork',
  async (network, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/shop/products/bundles/network/${network}`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch ${network} bundles`);
      }

      const result = await response.json();
      
      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.message || `Failed to fetch ${network} bundles`);
      }
    } catch (error) {
      return rejectWithValue(`Failed to load packages: ${error.message}`);
    }
  }
);

// Purchase data package - MAKE SURE THIS IS EXPORTED
export const purchaseDataPackage = createAsyncThunk(
  'products/purchaseDataPackage',
  async (purchaseData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/shop/orders`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(purchaseData)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Purchase failed`);
      }

      const result = await response.json();
      
      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.message || 'Purchase failed');
      }
    } catch (error) {
      return rejectWithValue(`Purchase failed: ${error.message}`);
    }
  }
);

const shoppingProductSlice = createSlice({
  name: "shoppingProducts",
  initialState,
  reducers: {
    clearPurchaseError: (state) => {
      state.purchaseError = null;
    },
    clearDataPackages: (state) => {
      state.dataPackages = [];
    },
    clearNetworkError: (state) => {
      state.networkError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBundlesByNetwork.pending, (state) => {
        state.isLoading = true;
        state.networkError = null;
        state.purchaseError = null;
      })
      .addCase(fetchBundlesByNetwork.fulfilled, (state, action) => {
        state.isLoading = false;
        state.dataPackages = action.payload || [];
        state.networkError = null;
      })
      .addCase(fetchBundlesByNetwork.rejected, (state, action) => {
        state.isLoading = false;
        state.dataPackages = [];
        state.networkError = action.payload;
      })
      .addCase(purchaseDataPackage.pending, (state) => {
        state.purchaseLoading = true;
        state.purchaseError = null;
      })
      .addCase(purchaseDataPackage.fulfilled, (state, action) => {
        state.purchaseLoading = false;
        state.purchaseError = null;
      })
      .addCase(purchaseDataPackage.rejected, (state, action) => {
        state.purchaseLoading = false;
        state.purchaseError = action.payload;
      });
  },
});

export const { clearPurchaseError, clearDataPackages, clearNetworkError } = shoppingProductSlice.actions;
export default shoppingProductSlice.reducer;