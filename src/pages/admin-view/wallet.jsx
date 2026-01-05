import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, User, Wallet, TrendingUp, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllUsersWithWallets, adjustWalletBalance, clearError } from "@/store/admin/wallet-slice"; // FIXED: Use correct export names

function AdminWallet() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [adjustmentAmount, setAdjustmentAmount] = useState("");
  const [adjustmentDescription, setAdjustmentDescription] = useState("");
  const [showAdjustmentModal, setShowAdjustmentModal] = useState(false);
  
  const { users, loading, error } = useSelector((state) => state.adminWallet);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllUsersWithWallets()); // FIXED: Use correct action name
  }, [dispatch]);

  const filteredUsers = Array.isArray(users) ? users.filter(user =>
    user.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.userPhone?.includes(searchTerm)
  ) : [];

  const totalBalance = Array.isArray(users) ? users.reduce((sum, user) => sum + (user.balance || 0), 0) : 0;
  const totalUsers = Array.isArray(users) ? users.length : 0;

  const handleAdjustBalance = () => {
    if (!selectedUser || !adjustmentAmount || !adjustmentDescription) {
      alert("Please fill all fields");
      return;
    }

    dispatch(adjustWalletBalance({
      userId: selectedUser.userId,
      amount: parseFloat(adjustmentAmount),
      description: adjustmentDescription
    })).then(() => {
      setShowAdjustmentModal(false);
      setAdjustmentAmount("");
      setAdjustmentDescription("");
      setSelectedUser(null);
      dispatch(fetchAllUsersWithWallets()); // Refresh the list
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS'
    }).format(amount || 0);
  };

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Wallet Management</h1>
          <p className="text-gray-600">Loading wallet data...</p>
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4 flex-1">
                <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
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
        <h1 className="text-2xl font-bold text-gray-900">Wallet Management</h1>
        <p className="text-gray-600">Manage user wallets and balances</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-red-800 font-medium">Error loading wallets</p>
              <p className="text-red-700 text-sm mt-1">{error}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => dispatch(clearError())}>
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users with Wallets</p>
                <p className="text-2xl font-bold">{totalUsers}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total System Balance</p>
                <p className="text-2xl font-bold">{formatCurrency(totalBalance)}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Wallet className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Balance</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(totalUsers > 0 ? totalBalance / totalUsers : 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Users List */}
      <Card>
        <CardHeader>
          <CardTitle>User Wallets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search users by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button onClick={() => dispatch(fetchAllUsersWithWallets())} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>

          {/* Users List */}
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-semibold">{user.userName || 'Unknown User'}</p>
                    <p className="text-sm text-gray-600">
                      {user.userEmail} {user.userPhone && `• ${user.userPhone}`}
                    </p>
                    <p className="text-xs text-gray-500">
                      Joined: {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown date'}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(user.balance)}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        setSelectedUser(user);
                        setShowAdjustmentModal(true);
                      }}
                    >
                      Adjust Balance
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredUsers.length === 0 && !loading && (
            <div className="text-center py-12">
              <Wallet className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">
                {users.length === 0 ? 'No wallets found in the system' : 'No wallets match your search'}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                {searchTerm ? 'Try adjusting your search terms' : 'User wallets will appear here'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Adjustment Modal */}
      {showAdjustmentModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              Adjust Balance for {selectedUser.userName || 'Unknown User'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Balance
                </label>
                <p className="text-xl font-bold text-green-600">
                  {formatCurrency(selectedUser.balance)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Adjustment Amount
                </label>
                <Input
                  type="number"
                  placeholder="Enter amount (positive to add, negative to deduct)"
                  value={adjustmentAmount}
                  onChange={(e) => setAdjustmentAmount(e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Use positive numbers to add funds, negative to deduct
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <Input
                  placeholder="Reason for adjustment"
                  value={adjustmentDescription}
                  onChange={(e) => setAdjustmentDescription(e.target.value)}
                />
              </div>

              {adjustmentAmount && (
                <div className="p-3 bg-gray-50 rounded-md">
                  <p className="text-sm font-medium">New Balance:</p>
                  <p className="text-lg font-bold text-green-600">
                    {formatCurrency((selectedUser.balance || 0) + parseFloat(adjustmentAmount || 0))}
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setShowAdjustmentModal(false);
                  setSelectedUser(null);
                  setAdjustmentAmount("");
                  setAdjustmentDescription("");
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAdjustBalance}
                disabled={!adjustmentAmount || !adjustmentDescription}
                className="flex-1"
              >
                Apply Adjustment
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminWallet;