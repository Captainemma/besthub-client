// pages/admin-view/transactions.jsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Download, Calendar, User, RefreshCw, DollarSign, TrendingUp, ShoppingCart, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllTransactions, fetchTransactionStats, clearError } from "@/store/admin/transactions-slice";

function AdminTransactions() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  
  const { transactions, stats, loading, error } = useSelector((state) => state.adminTransactions);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllTransactions());
    dispatch(fetchTransactionStats());
  }, [dispatch]);

  // Process transactions to match user-side format
  const processedTransactions = transactions.map(transaction => {
    // Determine type and description like user side
    let type = transaction.type || 'purchase';
    let description = transaction.description || '';
    
    if (type === 'data_purchase') {
      description = transaction.packageName || `${transaction.dataAmount || transaction.amount}GB Data`;
    } else if (type === 'wallet_topup' || type === 'topup') {
      description = 'Wallet Top-up';
    }

    return {
      id: transaction._id || transaction.id,
      type,
      network: transaction.network || 'System',
      amount: transaction.amount || 0,
      description,
      phone: transaction.phoneNumber || transaction.recipientPhone || 'N/A',
      date: transaction.date || transaction.createdAt || new Date(),
      status: transaction.status || 'completed',
      reference: transaction.reference || transaction.transactionId || 'N/A',
      userName: transaction.userName || 'Unknown User',
      userEmail: transaction.userEmail || '',
      timestamp: new Date(transaction.date || transaction.createdAt || new Date()).getTime()
    };
  });

  // Sort by timestamp (newest first) - MIXED chronological order
  const sortedTransactions = [...processedTransactions].sort((a, b) => b.timestamp - a.timestamp);

  const filteredTransactions = sortedTransactions.filter(transaction => {
    const matchesSearch = 
      transaction.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.phone?.includes(searchTerm);
    
    const matchesType = typeFilter === "all" || transaction.type === typeFilter;
    const matchesStatus = statusFilter === "all" || transaction.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusBadge = (status) => {
    if (!status) return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
    
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case 'completed':
      case 'success':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'failed':
      case 'error':
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'processing':
        return <Badge className="bg-blue-100 text-blue-800">Processing</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'data_purchase':
        return <span className="text-blue-600">📱</span>;
      case 'wallet_topup':
      case 'topup':
        return <span className="text-green-600">💳</span>;
      default:
        return <span className="text-gray-600">🔗</span>;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Unknown date';
      
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Unknown date';
    }
  };

  const getTransactionDescription = (transaction) => {
    if (transaction.type === 'data_purchase') {
      return transaction.description || `${transaction.amount}GB Data Purchase`;
    } else if (transaction.type === 'wallet_topup' || transaction.type === 'topup') {
      return 'Wallet Top-up';
    }
    return transaction.description || 'Transaction';
  };

  const getAmountDisplay = (transaction) => {
    const amount = transaction.amount || 0;
    if (transaction.type === 'wallet_topup' || transaction.type === 'topup') {
      return `+ GHS ${amount.toFixed(2)}`;
    } else {
      return `- GHS ${amount.toFixed(2)}`;
    }
  };

  const getAmountColor = (transaction) => {
    if (transaction.type === 'wallet_topup' || transaction.type === 'topup') {
      return 'text-green-600';
    } else {
      return 'text-gray-900';
    }
  };

  const handleRetry = () => {
    dispatch(fetchAllTransactions());
    dispatch(fetchTransactionStats());
  };

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transactions Management</h1>
          <p className="text-gray-600">Loading transactions data...</p>
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4 flex-1">
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
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Transactions Management</h1>
        <p className="text-gray-600">View and manage all system transactions across all users</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-red-800 font-medium">Error loading transactions</p>
              <p className="text-red-700 text-sm mt-1">{error}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => dispatch(clearError())}>
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Transactions</p>
                <p className="text-2xl font-bold">{stats.totalTransactions || sortedTransactions.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold">GHS {(stats.totalRevenue || 0).toFixed(2)}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today's Transactions</p>
                <p className="text-2xl font-bold">{stats.todayTransactions || 0}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today's Revenue</p>
                <p className="text-2xl font-bold">GHS {(stats.todayRevenue || 0).toFixed(2)}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>All System Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search transactions by user, description, reference, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <select 
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border rounded-md text-sm"
            >
              <option value="all">All Types</option>
              <option value="data_purchase">Data Purchases</option>
              <option value="wallet_topup">Wallet Top-ups</option>
              <option value="topup">Top-ups</option>
              <option value="refund">Refunds</option>
              <option value="withdrawal">Withdrawals</option>
            </select>
            
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border rounded-md text-sm"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="success">Success</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="processing">Processing</option>
            </select>
            
            <Button variant="outline" className="text-sm">
              <Calendar className="w-4 h-4 mr-2" />
              Date Range
            </Button>
            
            <Button variant="outline" className="text-sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            
            <Button onClick={handleRetry} variant="outline" className="text-sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
          
          {/* Transactions List - EXACT SAME LAYOUT AS USER SIDE */}
          <div className="space-y-4">
            {filteredTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    {getTypeIcon(transaction.type)}
                  </div>
                  <div>
                    <p className="font-semibold">{getTransactionDescription(transaction)}</p>
                    <p className="text-sm text-gray-600">
                      {transaction.network} 
                      {transaction.phone && transaction.phone !== 'N/A' ? ` • ${transaction.phone}` : ''}
                      {transaction.userName && ` • By: ${transaction.userName}`}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(transaction.date)} • Ref: {transaction.reference}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold text-lg ${getAmountColor(transaction)}`}>
                    {getAmountDisplay(transaction)}
                  </p>
                  {getStatusBadge(transaction.status)}
                </div>
              </div>
            ))}
          </div>

          {filteredTransactions.length === 0 && !loading && (
            <div className="text-center py-12">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">
                {sortedTransactions.length === 0 ? 'No transactions found in the system' : 'No transactions match your filters'}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                {searchTerm || typeFilter !== 'all' || statusFilter !== 'all' ? 
                 'Try adjusting your search terms or filters' : 
                 'Transactions will appear here as users make purchases and top-ups'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default AdminTransactions;