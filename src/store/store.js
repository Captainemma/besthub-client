import { configureStore } from "@reduxjs/toolkit";

import authSlice from "./auth-slice";
import commonFeatureSlice from "./common-slice";

// Shop slices
import shopProductsSlice from "./shop/products-slice";
import shopPurchaseSlice from "./shop/purchase-slice";
import shopWalletSlice from "./shop/wallet-slice";
import shopSearchSlice from "./shop/search-slice";
import shopReviewSlice from "./shop/review-slice";
import shopOrderSlice from "./shop/order-slice";
import dashboardSlice from "./shop/dashboard-slice";

// Admin slices
import adminDashboardSlice from "./admin/dashboard-slice";
import adminUsersSlice from "./admin/users-slice";
import adminTransactionsSlice from "./admin/transactions-slice";
import adminWalletSlice from "./admin/wallet-slice";
import mtnOrdersSlice from "./admin/mtn-orders-slice";
import telecelOrdersSlice from "./admin/telecel-orders-slice";
import atOrdersSlice from "./admin/at-orders-slice";
import priceSlice from "./admin/price-slice";

const store = configureStore({
  reducer: {
    auth: authSlice,
    commonFeature: commonFeatureSlice,
    
    // Shop reducers
    shopProducts: shopProductsSlice,
    shopPurchase: shopPurchaseSlice,
    wallet: shopWalletSlice,
    shopSearch: shopSearchSlice,
    shopReview: shopReviewSlice,
    shoppingOrder: shopOrderSlice,
    dashboard: dashboardSlice,

    // Admin reducers
    adminDashboard: adminDashboardSlice,
    adminUsers: adminUsersSlice,
    adminTransactions: adminTransactionsSlice,
    adminWallet: adminWalletSlice,
    mtnOrders: mtnOrdersSlice,
    telecelOrders: telecelOrdersSlice,
    atOrders: atOrdersSlice,
    prices: priceSlice,
  },
});

export default store;