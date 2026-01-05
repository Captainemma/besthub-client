import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, DollarSign, ShoppingCart, TrendingUp, Wifi, Zap, Clock } from "lucide-react";

function AdminDashboard() {
  // Mock data for dashboard
  const stats = {
    totalUsers: 1247,
    totalTransactions: 8943,
    totalRevenue: 125430,
    todayOrders: 47,
    mtnOrders: 892,
    telecelOrders: 345,
    atOrders: 210
  };

  const recentActivities = [
    { user: "John Doe", action: "Purchased MTN 5GB", time: "2 mins ago" },
    { user: "Sarah Smith", action: "Registered new account", time: "5 mins ago" },
    { user: "Mike Johnson", action: "Wallet top-up GHS 100", time: "10 mins ago" },
    { user: "Emma Wilson", action: "Purchased Telecel 2GB", time: "15 mins ago" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's your system overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-gray-600">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">GHS {stats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-gray-600">+8% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayOrders}</div>
            <p className="text-xs text-gray-600">+5 from yesterday</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTransactions.toLocaleString()}</div>
            <p className="text-xs text-gray-600">+15% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Network Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">MTN Orders</CardTitle>
            <Wifi className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.mtnOrders}</div>
            <p className="text-xs text-gray-600">65% of total orders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Telecel Orders</CardTitle>
            <Zap className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.telecelOrders}</div>
            <p className="text-xs text-gray-600">25% of total orders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AT Orders</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.atOrders}</div>
            <p className="text-xs text-gray-600">10% of total orders</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-sm">👤</span>
                  </div>
                  <div>
                    <p className="font-medium">{activity.user}</p>
                    <p className="text-sm text-gray-600">{activity.action}</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="p-4 border rounded-lg hover:bg-gray-50 text-left">
              <Users className="h-6 w-6 text-blue-600 mb-2" />
              <h3 className="font-semibold">Manage Users</h3>
              <p className="text-sm text-gray-600">View and manage all users</p>
            </button>
            <button className="p-4 border rounded-lg hover:bg-gray-50 text-left">
              <DollarSign className="h-6 w-6 text-green-600 mb-2" />
              <h3 className="font-semibold">Set Prices</h3>
              <p className="text-sm text-gray-600">Update data bundle prices</p>
            </button>
            <button className="p-4 border rounded-lg hover:bg-gray-50 text-left">
              <ShoppingCart className="h-6 w-6 text-orange-600 mb-2" />
              <h3 className="font-semibold">View Orders</h3>
              <p className="text-sm text-gray-600">Check recent orders</p>
            </button>
            <button className="p-4 border rounded-lg hover:bg-gray-50 text-left">
              <TrendingUp className="h-6 w-6 text-purple-600 mb-2" />
              <h3 className="font-semibold">Reports</h3>
              <p className="text-sm text-gray-600">Generate sales reports</p>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default AdminDashboard;