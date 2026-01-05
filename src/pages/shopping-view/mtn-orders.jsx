import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wifi, CheckCircle, XCircle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { fetchUserOrders } from "@/store/shop/order-slice";

function MTNOrders() {
  const { user } = useSelector((state) => state.auth);
  const { orderList, loading } = useSelector((state) => state.shoppingOrder);
  const dispatch = useDispatch();
  const [mtnOrders, setMtnOrders] = useState([]);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchUserOrders(user.id));
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (orderList && Array.isArray(orderList)) {
      // Filter only MTN orders and format them
      const filteredOrders = orderList
        .filter(order => order.network && order.network.toLowerCase() === 'mtn')
        .map(order => ({
          id: order._id || order.id,
          package: order.packageName || `${order.dataAmount}`,
          amount: order.amount || order.price,
          phone: order.phoneNumber,
          date: new Date(order.createdAt || order.orderDate).toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
          }),
          status: getOrderStatus(order.orderStatus),
          transactionId: order.transactionId || `MTN_${order._id}`,
        }));
      
      setMtnOrders(filteredOrders);
    }
  }, [orderList]);

  const getOrderStatus = (status) => {
    if (!status) return 'Pending';
    
    switch (status.toLowerCase()) {
      case 'completed':
      case 'success':
        return 'Completed';
      case 'failed':
      case 'error':
        return 'Failed';
      case 'pending':
      default:
        return 'Pending';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'Failed':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-600" />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'Failed':
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
    }
  };

  const totalSpent = mtnOrders.reduce((sum, order) => sum + order.amount, 0);
  const completedOrders = mtnOrders.filter(order => order.status === 'Completed').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading MTN orders...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
          <Wifi className="h-6 w-6 text-yellow-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">MTN Orders History</h1>
          <p className="text-gray-600">View your MTN data purchase history and transactions</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold">{mtnOrders.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Wifi className="w-6 h-6 text-blue-600" />
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
                <span className="text-lg font-bold">₵</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orders List */}
      <Card>
        <CardHeader>
          <CardTitle>MTN Order History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mtnOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                    {getStatusIcon(order.status)}
                  </div>
                  <div>
                    <p className="font-semibold">{order.package} MTN Data</p>
                    <p className="text-sm text-gray-600">Phone: {order.phone}</p>
                    <p className="text-xs text-gray-500">{order.date} • ID: {order.transactionId}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">GHS {order.amount.toFixed(2)}</p>
                  {getStatusBadge(order.status)}
                </div>
              </div>
            ))}
          </div>
          
          {mtnOrders.length === 0 && (
            <div className="text-center py-8">
              <Wifi className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No MTN orders yet</p>
              <p className="text-sm text-gray-500 mt-1">Your MTN data purchases will appear here</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default MTNOrders;