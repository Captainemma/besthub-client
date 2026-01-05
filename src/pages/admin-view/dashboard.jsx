import { useSelector, useDispatch } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, DollarSign, ShoppingCart, TrendingUp, Wifi, Zap, Clock, Wallet, RefreshCw } from "lucide-react";
import { useEffect } from "react";
import { fetchAdminDashboardData } from "@/store/admin/dashboard-slice";

function AdminDashboard() {
  const { user } = useSelector((state) => state.auth);
  const { data, loading, error } = useSelector((state) => state.adminDashboard);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAdminDashboardData());
  }, [dispatch]);

  const handleRetry = () => {
    dispatch(fetchAdminDashboardData());
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Loading dashboard data...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-red-600 mt-1 font-semibold">Error: {error}</p>
          <button 
            onClick={handleRetry}
            className="mt-4 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <RefreshCw className="h-4 w-4" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.userName || 'Admin'}! Here's your system overview.</p>
      </div>

      {/* Stats Grid - REAL DATA FROM REDUX */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-gray-600">Active registered users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">GHS {data.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-gray-600">Lifetime revenue</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.todayOrders}</div>
            <p className="text-xs text-gray-600">Completed today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customer Wallet Balance</CardTitle>
            <Wallet className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">GHS {data.totalCustomerBalance.toFixed(2)}</div>
            <p className="text-xs text-gray-600">Across all customers</p>
          </CardContent>
        </Card>
      </div>

      {/* Network Stats - REAL DATA FROM REDUX */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">MTN Sales</CardTitle>
            <Wifi className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">GHS {data.mtnSales.toFixed(2)}</div>
            <p className="text-xs text-gray-600">Today's sales</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Telecel Sales</CardTitle>
            <Zap className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">GHS {data.telecelSales.toFixed(2)}</div>
            <p className="text-xs text-gray-600">Today's sales</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AT Sales</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">GHS {data.atSales.toFixed(2)}</div>
            <p className="text-xs text-gray-600">Today's sales</p>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats - REAL DATA FROM REDUX */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
            <Users className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.activeCustomers}</div>
            <p className="text-xs text-gray-600">Purchased this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weekly Transactions</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalTransactions}</div>
            <p className="text-xs text-gray-600">Completed this week</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default AdminDashboard;