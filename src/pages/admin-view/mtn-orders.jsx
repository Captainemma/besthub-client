import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Download, Calendar, Wifi, CheckCircle, XCircle, Clock, CheckSquare, Square, X, RefreshCw, AlertCircle } from "lucide-react";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { 
  fetchAllMTNOrders, 
  fetchAllOrders,
  updateOrderStatus, 
  bulkUpdateOrderStatus,
  clearError 
} from "@/store/admin/mtn-orders-slice";
import { API_BASE_URL } from '../../config'; 

function MTNOrders() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [isSelectAll, setIsSelectAll] = useState(false);
  const [useAlternativeAPI, setUseAlternativeAPI] = useState(false);
  
  const mtnOrdersState = useSelector((state) => state.mtnOrders);
  const { 
    orders = [], 
    loading, 
    updating, 
    bulkUpdating,
    error,
    lastFetch
  } = mtnOrdersState || {};

  const dispatch = useDispatch();

  // Enhanced debugging
  useEffect(() => {
    console.log('🔍 MTN Orders State:', {
      loading,
      ordersCount: orders.length,
      error,
      lastFetch
    });
    
    if (orders.length > 0) {
      console.log('📝 First order sample:', orders[0]);
    }
  }, [mtnOrdersState, orders, loading, error, lastFetch]);

  // Fetch orders on component mount
  useEffect(() => {
    console.log('🔄 Component: Fetching MTN orders...');
    if (useAlternativeAPI) {
      dispatch(fetchAllOrders());
    } else {
      dispatch(fetchAllMTNOrders());
    }
  }, [dispatch, useAlternativeAPI]);

  // Test APIs directly for debugging
  useEffect(() => {
    const testAPIs = async () => {
      try {
        console.log('🔍 Testing MTN orders APIs directly...');
        
        // Test main API
        const mainResponse = await fetch(`${API_BASE_URL}/admin/orders/mtn`);
        const mainData = await mainResponse.json();
        console.log('📡 Main MTN Orders API Response:', {
          success: mainData.success,
          dataLength: mainData.data?.length,
          total: mainData.total,
          message: mainData.message
        });

        // Test alternative API
        const altResponse = await fetch(`${API_BASE_URL}/admin/orders/mtn/all`);
        const altData = await altResponse.json();
        console.log('📡 Alternative Orders API Response:', {
          success: altData.success,
          dataLength: altData.data?.length,
          allOrdersCount: altData.allOrdersCount,
          message: altData.message
        });

      } catch (error) {
        console.error('❌ API tests failed:', error);
      }
    };
    
    testAPIs();
  }, []);

  // Optimized handlers
  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  const handleStatusFilterChange = useCallback((e) => {
    setStatusFilter(e.target.value);
  }, []);

  const handleToggleAPI = useCallback(() => {
    setUseAlternativeAPI(prev => !prev);
    setSelectedOrders([]);
    setIsSelectAll(false);
  }, []);

  // Memoized filtered orders
  const filteredOrders = useMemo(() => {
    if (!orders || !Array.isArray(orders)) return [];

    return orders.filter(order => {
      if (!order) return false;
      
      const searchLower = searchTerm.toLowerCase();
      const user = order.user || '';
      const phone = order.phone || '';
      const reference = order.reference || '';
      const email = order.email || '';
      const packageName = order.package || '';

      return (
        user.toLowerCase().includes(searchLower) ||
        phone.includes(searchTerm) ||
        reference.toLowerCase().includes(searchLower) ||
        email.toLowerCase().includes(searchLower) ||
        packageName.toLowerCase().includes(searchLower)
      );
    }).filter(order => 
      statusFilter === "all" || (order.status === statusFilter)
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
      setSelectedOrders(filteredOrders.map(order => order._id).filter(Boolean));
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
    if (!orderId) {
      console.error('No order ID provided for status update');
      return;
    }

    dispatch(updateOrderStatus({ orderId, status: newStatus }))
      .unwrap()
      .then(() => {
        console.log(`✅ Order ${orderId} status updated to ${newStatus}`);
      })
      .catch(error => {
        console.error('Status update failed:', error);
      });
  }, [dispatch]);

  const handleRefresh = useCallback(() => {
    console.log('🔄 Manual refresh triggered');
    if (useAlternativeAPI) {
      dispatch(fetchAllOrders());
    } else {
      dispatch(fetchAllMTNOrders());
    }
  }, [dispatch, useAlternativeAPI]);

  const handleClearError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleClearSelection = useCallback(() => {
    setSelectedOrders([]);
    setIsSelectAll(false);
  }, []);

  // Calculate statistics
  const stats = useMemo(() => {
    if (!orders || !Array.isArray(orders)) {
      return { totalRevenue: 0, completedOrders: 0, pendingOrders: 0, processingOrders: 0 };
    }

    const completedOrders = orders.filter(o => o.status === 'completed').length;
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const processingOrders = orders.filter(o => o.status === 'processing').length;
    const totalRevenue = orders
      .filter(o => o.status === 'completed')
      .reduce((sum, o) => sum + (parseFloat(o.amount) || 0), 0);

    return {
      totalRevenue,
      completedOrders,
      pendingOrders,
      processingOrders
    };
  }, [orders]);

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
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <Wifi className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">MTN Orders Management</h1>
              <p className="text-gray-600">Loading MTN orders data...</p>
            </div>
          </div>
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
            <Wifi className="h-6 w-6 text-yellow-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">MTN Orders Management</h1>
            <p className="text-gray-600">View and manage all MTN data bundle orders</p>
            <div className="text-xs text-gray-500 mt-1">
              Loaded {orders.length} orders from database • Showing {filteredOrders.length} filtered
              {lastFetch && ` • Last updated: ${new Date(lastFetch).toLocaleTimeString()}`}
            </div>
          </div>
        </div>
        
        <Button 
          onClick={handleToggleAPI}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <AlertCircle className="w-4 h-4" />
          {useAlternativeAPI ? 'Using Alternative API' : 'Using Main API'}
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-red-800">{error}</p>
            </div>
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

      {/* API Debug Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
        <div className="flex items-center justify-between">
          <div className="text-sm text-blue-800">
            <strong>API Mode:</strong> {useAlternativeAPI ? 'Alternative (All Orders)' : 'Main (MTN Only)'}
          </div>
          <Button 
            onClick={handleRefresh}
            size="sm" 
            variant="outline"
            className="text-blue-700 border-blue-300"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Data
          </Button>
        </div>
      </div>

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
                <p className="text-2xl font-bold">{stats.completedOrders}</p>
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
                <p className="text-2xl font-bold">GHS {stats.totalRevenue.toFixed(2)}</p>
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
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold">{stats.pendingOrders}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orders List */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>MTN Orders</CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">
              {filteredOrders.length} orders
            </span>
            <Button onClick={handleRefresh} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
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
                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Wifi className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 truncate">{order.package || 'MTN Data Bundle'}</p>
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
                      <p className="font-bold text-lg text-gray-900">GHS {(order.amount || 0).toFixed(2)}</p>
                      {getStatusBadge(order.status)}
                    </div>
                  </div>

                  {/* Status Actions */}
                  <div className="flex items-center gap-2 justify-end">
                    <select 
                      value={order.status || 'pending'}
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
              <Wifi className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg font-medium">No MTN orders found</p>
              <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search terms or filters' 
                  : 'There are no MTN orders in the system yet'
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
                  onClick={handleToggleAPI}
                  variant="outline"
                >
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Try Alternative API
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default MTNOrders;