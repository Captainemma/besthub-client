import { Route, Routes } from "react-router-dom";
import AuthLayout from "./components/auth/layout";
import AuthLogin from "./pages/auth/login";
import AuthRegister from "./pages/auth/register";
import AdminLayout from "./components/admin-view/layout";

import AdminProducts from "./pages/admin-view/products";
import AdminOrders from "./pages/admin-view/orders";
import AdminFeatures from "./pages/admin-view/features";
import ShoppingLayout from "./components/shopping-view/layout";
import NotFound from "./pages/not-found";
import ShoppingHome from "./pages/shopping-view/home";
import ShoppingListing from "./pages/shopping-view/listing";
import DataCheckout from "./pages/shopping-view/data-checkout";
import ShoppingAccount from "./pages/shopping-view/account";
import ShoppingDashboard from "./pages/shopping-view/dashboard";
import MTNOrders from "./pages/shopping-view/mtn-orders";
import ATOrders from "./pages/shopping-view/at-orders";
import TelecelOrders from "./pages/shopping-view/telecel-orders";
import WalletPage from "./pages/shopping-view/wallet";
import TransactionsPage from "./pages/shopping-view/transactions";
// FIX: Use consistent naming - either ProfilePage or ShoppingProfile
import ShoppingProfile from "./pages/shopping-view/profile"; // lowercase p
import SettingsPage from "./pages/shopping-view/settings";
import CheckAuth from "./components/common/check-auth";
import UnauthPage from "./pages/unauth-page";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { checkAuth } from "./store/auth-slice";
import { Skeleton } from "@/components/ui/skeleton";
import PaystackReturnPage from "./pages/shopping-view/paystack-return";
import PaymentSuccessPage from "./pages/shopping-view/payment-success";
import SearchProducts from "./pages/shopping-view/search";
import WalletTopupSuccess from "./pages/shopping-view/wallet-topup-success";

// Admin Pages
import AdminDashboard from "./pages/admin-view/dashboard";
import AdminUsers from "./pages/admin-view/users";
import AdminTransactions from "./pages/admin-view/transactions";
import AdminWallet from "./pages/admin-view/wallet";
import AdminMTNOrders from "./pages/admin-view/mtn-orders";
import AdminTelecelOrders from "./pages/admin-view/telecel-orders";
import AdminATOrders from "./pages/admin-view/at-orders";
import AdminPrices from "./pages/admin-view/prices";
import AdminSettings from "./pages/admin-view/settings";
import AdminProfile from "./pages/admin-view/profile";

function App() {
  const { user, isAuthenticated, isLoading } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse"></div>
          <Skeleton className="h-4 w-[200px]" />
          <Skeleton className="h-4 w-[150px]" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Routes>
        {/* Root redirect - goes to dashboard */}
        <Route
          path="/"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <ShoppingLayout />
            </CheckAuth>
          }
        >
          <Route index element={<ShoppingDashboard />} />
        </Route>

        {/* Authentication routes */}
        <Route
          path="/auth"
          element={
            <CheckAuth 
              isAuthenticated={isAuthenticated} 
              user={user} 
              redirectIfAuthenticated
            >
              <AuthLayout />
            </CheckAuth>
          }
        >
          <Route path="login" element={<AuthLogin />} />
          <Route path="register" element={<AuthRegister />} />
        </Route>

        {/* Admin routes */}
        <Route
          path="/admin"
          element={
            <CheckAuth 
              isAuthenticated={isAuthenticated} 
              user={user} 
              requireAdmin
            >
              <AdminLayout />
            </CheckAuth>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="features" element={<AdminFeatures />} />
           <Route path="dashboard" element={<AdminDashboard />} />
  <Route path="users" element={<AdminUsers />} />
  <Route path="transactions" element={<AdminTransactions />} />
  <Route path="wallet" element={<AdminWallet />} />
  <Route path="orders/mtn" element={<AdminMTNOrders />} />
  <Route path="orders/telecel" element={<AdminTelecelOrders />} />
  <Route path="orders/at" element={<AdminATOrders />} />
  <Route path="prices" element={<AdminPrices />} />
  <Route path="settings" element={<AdminSettings />} />
  <Route path="profile" element={<AdminProfile />} />
        </Route>

        {/* Shopping routes with sidebar navigation */}
      <Route
        path="/shop"
        element={
          <CheckAuth isAuthenticated={isAuthenticated} user={user}>
            <ShoppingLayout />
          </CheckAuth>
        }
      >
        {/* Dashboard Routes (with sidebar) */}
        <Route path="dashboard" element={<ShoppingDashboard />} />
        <Route path="orders/mtn" element={<MTNOrders />} />
        <Route path="orders/at" element={<ATOrders />} />
        <Route path="orders/telecel" element={<TelecelOrders />} />
        <Route path="wallet" element={<WalletPage />} />
        <Route path="transactions" element={<TransactionsPage />} />
        <Route path="profile" element={<ShoppingProfile />} />
        <Route path="settings" element={<SettingsPage />} />
        
        {/* Regular Shopping Routes (without sidebar) */}
        <Route path="home" element={<ShoppingHome />} />
        <Route path="listing" element={<ShoppingListing />} />
        <Route path="checkout" element={<DataCheckout />} />
        <Route path="account" element={<ShoppingAccount />} />
        <Route path="paystack-return" element={<PaystackReturnPage />} />
        <Route path="payment-success" element={<PaymentSuccessPage />} />
        <Route path="search" element={<SearchProducts />} />
      
        <Route path="/shop/wallet/topup-success" element={<WalletTopupSuccess />} />
      </Route>

        {/* Utility routes */}
        <Route path="/unauth-page" element={<UnauthPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;