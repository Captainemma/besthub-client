import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE_URL, API_ENDPOINTS } from "@/config";

const initialState = {
  approvalURL: null,
  isLoading: false,
  orderId: null,
  orderList: [],
  orderDetails: null,
};

export const createNewOrder = createAsyncThunk(
  "orders/createNewOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}${API_ENDPOINTS.SHOP.CREATE_ORDER}`,
        orderData,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const capturePayment = createAsyncThunk(
  "orders/capturePayment",
  async ({ reference, orderId }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}${API_ENDPOINTS.SHOP.CAPTURE_PAYMENT}`,
        { reference, orderId },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getAllOrdersByUserId = createAsyncThunk(
  "orders/getAllOrdersByUserId",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}${API_ENDPOINTS.SHOP.USER_ORDERS}/${userId}`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getOrderDetails = createAsyncThunk(
  "orders/getOrderDetails",
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}${API_ENDPOINTS.SHOP.ORDERS}/${orderId}`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Add this async thunk
export const fetchUserOrders = createAsyncThunk(
  "orders/fetchUserOrders",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/shop/orders/user/${userId}`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const shoppingOrderSlice = createSlice({
  name: "shoppingOrderSlice",
  initialState,
  reducers: {
    resetOrderDetails: (state) => {
      state.orderDetails = null;
    },
    clearApprovalURL: (state) => {
      state.approvalURL = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createNewOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createNewOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.approvalURL = action.payload.authorizationURL;
        state.orderId = action.payload.orderId;
        if (action.payload.orderId) {
          sessionStorage.setItem("currentOrderId", action.payload.orderId);
        }
      })
      .addCase(createNewOrder.rejected, (state) => {
        state.isLoading = false;
        state.approvalURL = null;
        state.orderId = null;
      })
      .addCase(getAllOrdersByUserId.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllOrdersByUserId.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderList = action.payload.data || [];
      })
      .addCase(getAllOrdersByUserId.rejected, (state) => {
        state.isLoading = false;
        state.orderList = [];
      })
      .addCase(getOrderDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrderDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderDetails = action.payload.data;
      })

      // Add this case to extraReducers
.addCase(fetchUserOrders.pending, (state) => {
  state.isLoading = true;
})
.addCase(fetchUserOrders.fulfilled, (state, action) => {
  state.isLoading = false;
  state.orderList = action.payload.data || [];
})
.addCase(fetchUserOrders.rejected, (state) => {
  state.isLoading = false;
  state.orderList = [];
})
      .addCase(getOrderDetails.rejected, (state) => {
        state.isLoading = false;
        state.orderDetails = null;
      });
  },
});

export const { resetOrderDetails, clearApprovalURL } = shoppingOrderSlice.actions;
export default shoppingOrderSlice.reducer;