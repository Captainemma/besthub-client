import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, CheckCircle, XCircle, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { API_BASE_URL } from '../../../config';

function ATOrders() {
  const [atOrders, setAtOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector((state) => state.auth);

  const fetchATOrders = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      console.log('🔄 Fetching AT orders for user:', user.id);
      
      const response = await fetch(`${API_BASE_URL}/shop/orders/user/${user.id}`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch orders`);
      }

      const result = await response.json();
      console.log('📡 AT Orders API Response:', result);
      
      if (result.success) {
        // Filter for AT orders only
        const atOrders = result.data.filter(order => 
          order.network?.toLowerCase() === 'at' || 
          order.network?.toLowerCase() === 'airteltigo' ||
          order.productName?.toLowerCase().includes('at') ||
          order.productName?.toLowerCase().includes('airtel')
        );
        console.log(`✅ Found ${atOrders.length} AT orders`);
        setAtOrders(atOrders);
      } else {
        console.error('❌ Failed to fetch orders:', result.message);
        setAtOrders([]);
      }
    } catch (error) {
      console.error('❌ Fetch AT orders error:', error);
      setAtOrders([]);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchATOrders();
  }, [fetchATOrders]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: { label: "Completed", color: "bg-green-100 text-green-800", icon: CheckCircle },
      processing: { label: "Processing", color: "bg-blue-100 text-blue-800", icon: Clock },
      pending: { label: "Pending", color: "bg-yellow-100 text-yellow-800", icon: Clock },
      failed: { label: "Failed", color: "bg-red-100 text-red-800", icon: XCircle }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    const IconComponent = config.icon;
    
    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <IconComponent className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    try {
      return new Date(dateString).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  const totalSpent = useMemo(() => {
    return atOrders
      .filter(order => order.status === 'completed')
      .reduce((sum, order) => sum + (parseFloat(order.amount) || 0), 0);
  }, [atOrders]);

  const completedOrders = useMemo(() => {
    return atOrders.filter(order => order.status === 'completed').length;
  }, [atOrders]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">AirtelTigo Orders History</h1>
              <p className="text-gray-600">Loading your AirtelTigo orders...</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="h-4 bg-gray-200 rounded w-20 mb-2 animate-pulse"></div>
                    <div className="h-6 bg-gray-200 rounded w-12 animate-pulse"></div>
                  </div>
                  <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <Clock className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">AirtelTigo Orders History</h1>
            <p className="text-gray-600">View your AirtelTigo data purchase history and transactions</p>
          </div>
        </div>
        <Button onClick={fetchATOrders} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold">{atOrders.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold">{completedOrders}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold">GHS {totalSpent.toFixed(2)}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-lg font-bold text-purple-600">₵</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orders List */}
      <Card>
        <CardHeader>
          <CardTitle>AirtelTigo Order History</CardTitle>
        </CardHeader>
        <CardContent>
          {atOrders.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg mb-2">No AirtelTigo orders yet</p>
              <p className="text-sm text-gray-500">Your AirtelTigo data purchases will appear here</p>
              <div className="mt-6 p-4 bg-blue-50 rounded-lg max-w-md mx-auto">
                <p className="text-sm text-blue-800">
                  <strong>Tip:</strong> Purchase AirtelTigo data bundles from the "Buy Data" page to see your orders here.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {atOrders.map((order) => (
                <div key={order._id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Clock className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold">{order.productName || 'AirtelTigo Data Bundle'}</p>
                      <p className="text-sm text-gray-600">Phone: {order.phoneNumber}</p>
                      <p className="text-xs text-gray-500">
                        {formatDate(order.createdAt)} • Ref: {order.reference || order._id}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">GHS {(order.amount || 0).toFixed(2)}</p>
                    {getStatusBadge(order.status || order.orderStatus)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default ATOrders;