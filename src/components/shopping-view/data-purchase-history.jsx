import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wifi, Zap, Clock, CheckCircle, Clock as ClockIcon } from "lucide-react";
import { fetchUserOrders } from "@/store/shop/order-slice";

function DataPurchaseHistory() {
  const { user } = useSelector((state) => state.auth);
  const { orderList, loading } = useSelector((state) => state.shoppingOrder);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchUserOrders(user.id));
    }
  }, [dispatch, user]);

  const getNetworkIcon = (network) => {
    switch (network?.toUpperCase()) {
      case 'MTN': return <Wifi className="w-5 h-5 text-yellow-600" />;
      case 'TELECEL': return <Zap className="w-5 h-5 text-red-600" />;
      case 'AT':
      case 'AIRTELTIGO': 
        return <Clock className="w-5 h-5 text-blue-600" />;
      default: return <Wifi className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusBadge = (status) => {
    if (!status) return null;
    
    switch (status.toLowerCase()) {
      case 'completed':
      case 'success':
        return <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
          <CheckCircle className="w-3 h-3" /> Completed
        </span>;
      case 'failed':
      case 'error':
        return <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
          Failed
        </span>;
      case 'pending':
      default:
        return <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
          <ClockIcon className="w-3 h-3" /> Pending
        </span>;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Purchase History</h2>
          <p className="text-gray-600">View your recent data package purchases</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Recent Purchases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Purchase History</h2>
        <p className="text-gray-600">View your recent data package purchases</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Purchases ({orderList?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {orderList && orderList.length > 0 ? (
              orderList.map((order) => (
                <div key={order._id || order.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                      {getNetworkIcon(order.network)}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">
                        {order.packageName || `${order.amount}GB`} {order.network} Data
                      </p>
                      <p className="text-sm text-gray-600">Phone: {order.phoneNumber}</p>
                      <p className="text-xs text-gray-500">
                        {formatDate(order.createdAt || order.orderDate)}
                      </p>
                      <p className="text-xs text-gray-500">
                        ID: {order.transactionId || order._id}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">GHS {order.amount?.toFixed(2)}</p>
                    {getStatusBadge(order.orderStatus)}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Wifi className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-600">No purchase history yet</p>
                <p className="text-sm text-gray-500 mt-1">
                  Your data purchases will appear here
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default DataPurchaseHistory;