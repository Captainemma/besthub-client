import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wifi, Zap, Clock, Wallet, BarChart3, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { API_BASE_URL } from '../../../config';

function ShoppingDashboard() {
  const { user } = useSelector((state) => state.auth);
  const { balance, loading: balanceLoading } = useSelector((state) => state.wallet);
  const dispatch = useDispatch();
  
  const [dashboardData, setDashboardData] = useState({
    mtnSales: 0,
    telecelSales: 0,
    airteltigoSales: 0,
    totalOrders: 0,
    loading: true,
    error: null
  });

  const fetchDashboardData = async () => {
    if (!user?.id) return;
    
    try {
      setDashboardData(prev => ({ ...prev, loading: true, error: null }));
      console.log('🔄 Fetching dashboard data for user:', user.id);
      
      // Fetch user orders
      const ordersResponse = await fetch(`${API_BASE_URL}/shop/orders/user/${user.id}`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!ordersResponse.ok) {
        throw new Error(`HTTP ${ordersResponse.status}: Failed to fetch orders`);
      }

      const ordersResult = await ordersResponse.json();
      console.log('📡 Orders API Response:', ordersResult);
      
      if (ordersResult.success) {
        const orders = ordersResult.data || [];
        console.log('📦 All user orders:', orders);
        
        // Calculate today's sales - FIXED: Include all statuses for today's orders
        const today = new Date().toDateString();
        const todayOrders = orders.filter(order => {
          if (!order || !order.createdAt) return false;
          const orderDate = new Date(order.createdAt).toDateString();
          return orderDate === today;
          // REMOVED status filter to count all today's orders
        });

        console.log(`📊 Today's orders (all statuses):`, todayOrders);

        // FIXED: Better network detection for AT orders
        const mtnSales = todayOrders
          .filter(order => {
            const network = (order.network || '').toLowerCase();
            const productName = (order.productName || '').toLowerCase();
            return network === 'mtn' || network.includes('mtn') || productName.includes('mtn');
          })
          .reduce((sum, order) => sum + (parseFloat(order.amount) || 0), 0);

        const telecelSales = todayOrders
          .filter(order => {
            const network = (order.network || '').toLowerCase();
            const productName = (order.productName || '').toLowerCase();
            return network === 'telecel' || 
                   network === 'vodafone' ||
                   network.includes('telecel') ||
                   productName.includes('telecel') ||
                   productName.includes('vodafone');
          })
          .reduce((sum, order) => sum + (parseFloat(order.amount) || 0), 0);

        const airteltigoSales = todayOrders
          .filter(order => {
            const network = (order.network || '').toLowerCase();
            const productName = (order.productName || '').toLowerCase();
            return network === 'at' || 
                   network === 'airteltigo' ||
                   network.includes('at') ||
                   network.includes('airtel') ||
                   network.includes('tigo') ||
                   productName.includes('at') ||
                   productName.includes('airtel') ||
                   productName.includes('tigo');
          })
          .reduce((sum, order) => sum + (parseFloat(order.amount) || 0), 0);

        console.log('💰 Sales calculated:', { 
          mtnSales, 
          telecelSales, 
          airteltigoSales,
          todayOrdersCount: todayOrders.length,
          todayOrders: todayOrders.map(o => ({
            network: o.network,
            productName: o.productName,
            amount: o.amount,
            status: o.status,
            createdAt: o.createdAt
          }))
        });

        setDashboardData({
          mtnSales,
          telecelSales,
          airteltigoSales,
          totalOrders: orders.length,
          loading: false,
          error: null
        });
      } else {
        throw new Error(ordersResult.message || 'Failed to fetch orders');
      }
    } catch (error) {
      console.error('❌ Fetch dashboard data error:', error);
      setDashboardData(prev => ({
        ...prev,
        loading: false,
        error: error.message
      }));
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user?.id]);

  const handleRefresh = () => {
    fetchDashboardData();
  };

  if (dashboardData.loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {user?.userName || 'User'}!
              </h1>
              <p className="text-gray-600 mt-1">Loading your dashboard data...</p>
            </div>
            <Button variant="outline" size="sm" disabled>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Loading...
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
              </CardHeader>
              <CardContent>
                <div className="h-6 bg-gray-200 rounded w-16 animate-pulse mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (dashboardData.error) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {user?.userName || 'User'}!
              </h1>
              <p className="text-red-500 mt-1">Error loading dashboard data</p>
            </div>
            <Button onClick={handleRefresh} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </div>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-800 font-medium">Failed to load dashboard data</p>
          <p className="text-red-600 text-sm mt-1">{dashboardData.error}</p>
          <Button onClick={handleRefresh} variant="outline" className="mt-4">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {user?.userName || 'User'}!
            </h1>
            <p className="text-gray-600 mt-1">
              Your snapshot for {new Date().toLocaleString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
          <Button onClick={handleRefresh} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Wallet Balance</CardTitle>
            <Wallet className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {balanceLoading ? (
                <div className="h-6 bg-gray-200 rounded w-16 animate-pulse"></div>
              ) : (
                `GHS ${(balance || 0).toFixed(2)}`
              )}
            </div>
            <p className="text-xs text-gray-600">Available for purchases</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">MTN Sales</CardTitle>
            <Wifi className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">GHS {dashboardData.mtnSales.toFixed(2)}</div>
            <p className="text-xs text-gray-600">Today's orders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AirtelTigo Sales</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">GHS {dashboardData.airteltigoSales.toFixed(2)}</div>
            <p className="text-xs text-gray-600">Today's orders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Telecel Sales</CardTitle>
            <Zap className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">GHS {dashboardData.telecelSales.toFixed(2)}</div>
            <p className="text-xs text-gray-600">Today's orders</p>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <BarChart3 className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.totalOrders}</div>
            <p className="text-xs text-gray-600">All-time purchases</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Total Sales</CardTitle>
            <Wallet className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              GHS {(dashboardData.mtnSales + dashboardData.telecelSales + dashboardData.airteltigoSales).toFixed(2)}
            </div>
            <p className="text-xs text-gray-600">Combined sales across all networks</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default ShoppingDashboard;