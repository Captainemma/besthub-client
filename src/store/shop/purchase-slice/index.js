// /src/store/shop/purchase-slice/index.js (NEW FILE)
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  purchaseHistory: [],
  currentPurchase: null,
  error: null,
};

export const purchaseDataPackage = createAsyncThunk(
  "purchase/purchaseDataPackage",
  async (purchaseData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:4400/api/shop/data/purchase",
        purchaseData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchPurchaseHistory = createAsyncThunk(
  "purchase/fetchPurchaseHistory",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:4400/api/shop/purchase/history/${userId}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const purchaseSlice = createSlice({
  name: "purchase",
  initialState,
  reducers: {
    clearPurchaseError: (state) => {
      state.error = null;
    },
    clearCurrentPurchase: (state) => {
      state.currentPurchase = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(purchaseDataPackage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(purchaseDataPackage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentPurchase = action.payload.data;
        state.purchaseHistory.unshift(action.payload.data);
      })
      .addCase(purchaseDataPackage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Purchase failed";
      })
      .addCase(fetchPurchaseHistory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchPurchaseHistory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.purchaseHistory = action.payload.data;
      })
      .addCase(fetchPurchaseHistory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Failed to fetch purchase history";
      });
  },
});

export const { clearPurchaseError, clearCurrentPurchase } = purchaseSlice.actions;
export default purchaseSlice.reducer;