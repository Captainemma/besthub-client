import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Download, Calendar, Zap, CheckCircle, XCircle, Clock, CheckSquare, Square, X, RefreshCw, AlertCircle } from "lucide-react";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { 
  fetchAllATOrders, 
  fetchAllOrders,
  updateOrderStatus, 
  bulkUpdateOrderStatus,
  clearError 
} from "@/store/admin/at-orders-slice";

function ATOrders() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [isSelectAll, setIsSelectAll] = useState(false);
  
  const atOrdersState = useSelector((state) => state.atOrders);
  const { 
    orders = [], 
    loading, 
    updating, 
    bulkUpdating,
    error
  } = atOrdersState || {};

  const dispatch = useDispatch();

  // Fetch orders immediately when component mounts using the alternative API
  useEffect(() => {
    console.log('🔄 Loading AirtelTigo orders immediately...');
    dispatch(fetchAllOrders()); // Use alternative API from the start
  }, [dispatch]);

  // Optimized handlers
  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  const handleStatusFilterChange = useCallback((e) => {
    setStatusFilter(e.target.value);
  }, []);

  // Memoized filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const searchLower = searchTerm.toLowerCase();
      return (
        order.user?.toLowerCase().includes(searchLower) ||
        order.phone?.includes(searchTerm) ||
        order.reference?.toLowerCase().includes(searchLower) ||
        order.email?.toLowerCase().includes(searchLower) ||
        order.package?.toLowerCase().includes(searchLower)
      );
    }).filter(order => 
      statusFilter === "all" || order.status === statusFilter
    );
  }, [orders, searchTerm, statusFilter]);

  const getStatusBadge = useCallback((status) => {
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
  }, []);

  // Handle individual order selection
  const toggleOrderSelection = useCallback((orderId) => {
    setSelectedOrders(prev =>
      prev.includes(orderId)
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  }, []);

  // Handle select all/none
  const toggleSelectAll = useCallback(() => {
    if (isSelectAll) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(filteredOrders.map(order => order._id));
    }
    setIsSelectAll(!isSelectAll);
  }, [isSelectAll, filteredOrders]);

  // Handle bulk status change
  const handleBulkStatusChange = useCallback((newStatus) => {
    if (selectedOrders.length === 0) {
      alert('Please select at least one order to update');
      return;
    }

    dispatch(bulkUpdateOrderStatus({ orderIds: selectedOrders, status: newStatus }))
      .unwrap()
      .then(() => {
        setSelectedOrders([]);
        setIsSelectAll(false);
      })
      .catch(error => {
        console.error('Bulk update failed:', error);
      });
  }, [selectedOrders, dispatch]);

  // Handle individual order status change
  const handleSingleStatusChange = useCallback((orderId, newStatus) => {
    dispatch(updateOrderStatus({ orderId, status: newStatus }))
      .unwrap()
      .then(() => {
        console.log(`✅ AirtelTigo order ${orderId} status updated to ${newStatus}`);
      })
      .catch(error => {
        console.error('Status update failed:', error);
      });
  }, [dispatch]);

  const handleRefresh = useCallback(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  const handleTryMainAPI = useCallback(() => {
    dispatch(fetchAllATOrders());
  }, [dispatch]);

  const handleClearError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleClearSelection = useCallback(() => {
    setSelectedOrders([]);
    setIsSelectAll(false);
  }, []);

  // Calculate statistics
  const totalRevenue = useMemo(() => {
    return orders.filter(o => o.status === 'completed').reduce((sum, o) => sum + (o.amount || 0), 0);
  }, [orders]);

  const completedOrders = useMemo(() => {
    return orders.filter(o => o.status === 'completed').length;
  }, [orders]);

  const pendingOrders = useMemo(() => {
    return orders.filter(o => o.status === 'pending').length;
  }, [orders]);

  const successRate = useMemo(() => {
    if (orders.length === 0) return 0;
    return (completedOrders / orders.length) * 100;
  }, [orders.length, completedOrders]);

  const formatDate = useCallback((dateString) => {
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
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-900">AirtelTigo Orders Management</h1>
          <p className="text-gray-600">Loading AirtelTigo orders data...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
          <Zap className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AirtelTigo Orders Management</h1>
          <p className="text-gray-600">View and manage all AirtelTigo data bundle orders</p>
          <div className="text-xs text-gray-500 mt-1">
            Loaded {orders.length} orders from database • Showing {filteredOrders.length} filtered
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex items-center justify-between">
            <p className="text-red-800">{error}</p>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={handleClearError}>
                <X className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleRefresh}>
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Actions Bar - Only show when orders are selected */}
      {selectedOrders.length > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <p className="font-medium text-blue-800">
                  {selectedOrders.length} order(s) selected
                </p>
                <p className="text-sm text-blue-600">
                  Choose action for selected orders
                </p>
              </div>
              
              <div className="flex flex-wrap gap-2 justify-center">
                <Button 
                  size="sm" 
                  onClick={() => handleBulkStatusChange('processing')}
                  disabled={bulkUpdating}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {bulkUpdating ? 'Updating...' : 'Mark as Processing'}
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => handleBulkStatusChange('completed')}
                  disabled={bulkUpdating}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {bulkUpdating ? 'Updating...' : 'Mark as Completed'}
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => handleBulkStatusChange('pending')}
                  disabled={bulkUpdating}
                  variant="outline"
                >
                  {bulkUpdating ? 'Updating...' : 'Mark as Pending'}
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => handleBulkStatusChange('failed')}
                  disabled={bulkUpdating}
                  variant="outline"
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  {bulkUpdating ? 'Updating...' : 'Mark as Failed'}
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={handleClearSelection}
                >
                  Clear Selection
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold">{orders.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Zap className="w-6 h-6 text-blue-600" />
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
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold">GHS {totalRevenue.toFixed(2)}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-lg font-bold text-purple-600">₵</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold">{successRate.toFixed(1)}%</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-lg font-bold text-green-600">📈</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orders List */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>AirtelTigo Orders</CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">
              {filteredOrders.length} orders
            </span>
            <Button onClick={handleRefresh} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button onClick={handleTryMainAPI} variant="outline" size="sm">
              <AlertCircle className="w-4 h-4 mr-2" />
              Try Main API
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search orders by user, phone, email, or reference..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="pl-10"
              />
            </div>
            <select 
              value={statusFilter}
              onChange={handleStatusFilterChange}
              className="px-3 py-2 border rounded-md bg-white"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>
            <Button variant="outline">
              <Calendar className="w-4 h-4 mr-2" />
              Date Range
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>

          {/* Select All Header */}
          {filteredOrders.length > 0 && (
            <div className="flex items-center gap-3 p-3 border rounded-lg bg-gray-50 mb-4">
              <button
                onClick={toggleSelectAll}
                className="flex items-center gap-2 p-1 rounded hover:bg-gray-200 transition-colors"
              >
                {isSelectAll ? (
                  <CheckSquare className="w-5 h-5 text-blue-600" />
                ) : (
                  <Square className="w-5 h-5 text-gray-400" />
                )}
                <span className="font-medium text-sm">
                  {isSelectAll ? 'Deselect All' : 'Select All'}
                </span>
              </button>
              <span className="text-sm text-gray-600">
                ({selectedOrders.length} of {filteredOrders.length} selected)
              </span>
            </div>
          )}

          {/* Orders List */}
          <div className="space-y-3">
            {filteredOrders.map((order) => (
              <div key={order._id} className="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50 group transition-colors">
                {/* Checkbox */}
                <button
                  onClick={() => toggleOrderSelection(order._id)}
                  className="mt-1 flex-shrink-0"
                >
                  {selectedOrders.includes(order._id) ? (
                    <CheckSquare className="w-5 h-5 text-blue-600" />
                  ) : (
                    <Square className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                  )}
                </button>

                {/* Order Content */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Order Details */}
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Zap className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 truncate">{order.package || 'AirtelTigo Data Bundle'}</p>
                      <p className="text-sm text-gray-600 truncate">{order.user || 'Unknown User'} • {order.phone || 'No Phone'}</p>
                      <p className="text-xs text-gray-500">
                        {formatDate(order.date)} • Ref: {order.reference || 'N/A'}
                      </p>
                      {order.email && (
                        <p className="text-xs text-gray-500 truncate">Email: {order.email}</p>
                      )}
                    </div>
                  </div>

                  {/* Status and Amount */}
                  <div className="flex flex-col gap-2 justify-center">
                    <div className="text-right">
                      <p className="font-bold text-lg text-gray-900">GHS {order.amount?.toFixed(2) || '0.00'}</p>
                      {getStatusBadge(order.status)}
                    </div>
                  </div>

                  {/* Status Actions */}
                  <div className="flex items-center gap-2 justify-end">
                    <select 
                      value={order.status}
                      onChange={(e) => handleSingleStatusChange(order._id, e.target.value)}
                      className="text-sm border rounded-md p-2 bg-white min-w-[120px]"
                      disabled={updating}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="completed">Completed</option>
                      <option value="failed">Failed</option>
                    </select>
                    <Button 
                      size="sm" 
                      onClick={() => handleSingleStatusChange(order._id, order.status)}
                      disabled={updating}
                      className="text-xs h-8 bg-blue-600 hover:bg-blue-700 text-white whitespace-nowrap"
                    >
                      {updating ? 'Updating...' : 'Update'}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredOrders.length === 0 && !loading && (
            <div className="text-center py-12">
              <Zap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg font-medium">No AirtelTigo orders found</p>
              <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search terms or filters' 
                  : 'There are no AirtelTigo orders in the system yet'
                }
              </p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center mt-4">
                <Button 
                  onClick={handleRefresh}
                  variant="outline"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
                <Button 
                  onClick={handleTryMainAPI}
                  variant="outline"
                >
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Try Main API
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default ATOrders;