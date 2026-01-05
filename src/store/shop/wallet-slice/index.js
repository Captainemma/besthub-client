import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE_URL } from "@/config";

const initialState = {
  balance: 0,
  isLoading: false,
  transactions: [],
  error: null,
  topUpLoading: false,
};

// Fetch REAL wallet balance from backend
export const fetchWalletBalance = createAsyncThunk(
  "wallet/fetchBalance",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/shop/wallet/balance/${userId}`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        return { balance: 0, currency: "GHS" };
      }
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ADD THIS: Fetch transactions
export const fetchTransactions = createAsyncThunk(
  "wallet/fetchTransactions",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/shop/wallet/transactions/${userId}`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      // Return empty array if endpoint doesn't exist yet
      return [];
    }
  }
);

// Top up wallet
export const topUpWallet = createAsyncThunk(
  "wallet/topUp",
  async ({ amount, email }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/shop/wallet/topup`,
        { amount, email },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Top-up failed");
    }
  }
);

// Verify top-up and update balance
export const verifyTopUp = createAsyncThunk(
  "wallet/verifyTopUp",
  async ({ reference }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/shop/wallet/verify-topup`,
        { reference },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Verification failed");
    }
  }
);

const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    updateBalance: (state, action) => {
      state.balance = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch balance
      .addCase(fetchWalletBalance.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchWalletBalance.fulfilled, (state, action) => {
        state.isLoading = false;
        state.balance = action.payload.data?.balance || action.payload.balance || 0;
      })
      .addCase(fetchWalletBalance.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Failed to fetch balance";
        state.balance = 0;
      })
      // ADD THIS: Fetch transactions cases
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.transactions = action.payload.data || action.payload || [];
      })
      // Top up wallet
      .addCase(topUpWallet.pending, (state) => {
        state.topUpLoading = true;
        state.error = null;
      })
      .addCase(topUpWallet.fulfilled, (state, action) => {
        state.topUpLoading = false;
        if (action.payload.authorizationURL) {
          window.location.href = action.payload.authorizationURL;
        }
      })
      .addCase(topUpWallet.rejected, (state, action) => {
        state.topUpLoading = false;
        state.error = action.payload;
      })
      // Verify top-up
      .addCase(verifyTopUp.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.balance = action.payload.data.newBalance;
        }
      });
  },
});

export const { updateBalance, clearError } = walletSlice.actions;
export default walletSlice.reducer;