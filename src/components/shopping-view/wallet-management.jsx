import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Wallet, Plus, Download, Upload, Loader } from "lucide-react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { fetchWalletBalance, topUpWallet, fetchTransactions } from "@/store/shop/wallet-slice";

function WalletManagement() {
  const [topUpAmount, setTopUpAmount] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useSelector((state) => state.auth);
  
  const { balance, isLoading, transactions, error, topUpLoading } = useSelector((state) => state.wallet);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchWalletBalance(user.id));
      dispatch(fetchTransactions(user.id));
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (error) {
      if (error.includes('token') || error.includes('expired') || error.includes('unauthorized')) {
        toast({
          title: "Session Expired",
          description: "Please log in again to continue",
          variant: "destructive",
        });
        // Optionally redirect to login page
        // navigate("/auth/login");
      } else {
        toast({
          title: "Error",
          description: error,
          variant: "destructive",
        });
      }
    }
  }, [error, toast, navigate]);

  const handleTopUp = () => {
    if (!topUpAmount || topUpAmount < 1) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount (minimum GHS 1)",
        variant: "destructive",
      });
      return;
    }

    if (!user?.email) {
      toast({
        title: "Email required",
        description: "Please make sure your account has an email address",
        variant: "destructive",
      });
      return;
    }

    dispatch(topUpWallet({
      amount: parseFloat(topUpAmount) * 100, // Convert to pesewas
      email: user.email
    }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Handle manual refresh
  const handleRefresh = () => {
    if (user?.id) {
      dispatch(fetchWalletBalance(user.id));
      dispatch(fetchTransactions(user.id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold mb-4">Wallet Management</h2>
          <p className="text-gray-600">Manage your account balance and transactions</p>
        </div>
        <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
          <Loader className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Current Balance */}
        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Current Balance</p>
                <p className="text-3xl font-bold">
                  {isLoading ? (
                    <Loader className="w-6 h-6 animate-spin" />
                  ) : (
                    `GHS ${(balance || 0).toFixed(2)}`
                  )}
                </p>
                <p className="text-sm opacity-90 mt-1">Available for purchases</p>
              </div>
              <Wallet className="h-12 w-12 opacity-90" />
            </div>
          </CardContent>
        </Card>

        {/* Top Up */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Plus className="w-4 h-4" />
              Top Up Wallet
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Input 
                placeholder="Enter amount (GHS)" 
                type="number" 
                min="1"
                step="0.01"
                value={topUpAmount}
                onChange={(e) => setTopUpAmount(e.target.value)}
                disabled={topUpLoading}
              />
              <Button 
                onClick={handleTopUp}
                disabled={topUpLoading || !topUpAmount}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                {topUpLoading ? (
                  <>
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  `Add GHS ${topUpAmount || '0'}`
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start" disabled>
              <Download className="w-4 h-4 mr-2" />
              Withdraw Funds
            </Button>
            <Button variant="outline" className="w-full justify-start" disabled>
              <Upload className="w-4 h-4 mr-2" />
              Transaction History
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {transactions && transactions.length > 0 ? (
              transactions.slice(0, 5).map((transaction) => (
                <div key={transaction.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium">{transaction.description}</p>
                    <p className="text-sm text-gray-600">
                      {transaction.recipientPhone ? `• ${transaction.recipientPhone} • ` : ''}
                      {formatDate(transaction.date)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${
                      transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.amount > 0 ? '+' : '-'} GHS {Math.abs(transaction.amount).toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-600 capitalize">{transaction.status}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500">
                No transactions yet
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default WalletManagement;