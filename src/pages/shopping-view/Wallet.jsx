import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, Plus, History, Loader } from "lucide-react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "@/components/ui/use-toast";
import { fetchWalletBalance, topUpWallet } from "@/store/shop/wallet-slice";

function WalletPage() {
  const [topUpAmount, setTopUpAmount] = useState("");
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { user } = useSelector((state) => state.auth);
  
  // ADD THIS SECTION - Get wallet state
  const { balance, isLoading, error, topUpLoading } = useSelector((state) => state.wallet);

  // ADD THIS useEffect - This goes right after the useSelector lines
  useEffect(() => {
    if (user?.id) {
      dispatch(fetchWalletBalance(user.id));
    }
  }, [dispatch, user]); // ← This dependency array is important

  // Keep your existing useEffect for error handling
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
    }
  }, [error, toast]);
  

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
      amount: parseFloat(topUpAmount) * 100,
      email: user.email
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Wallet className="h-8 w-8 text-green-600" />
        <div>
          <h1 className="text-2xl font-bold">Wallet</h1>
          <p className="text-gray-600">Manage your account balance</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Current Balance</p>
                <p className="text-3xl font-bold">
                  {isLoading ? (
                    <Loader className="w-6 h-6 animate-spin" />
                  ) : (
                    `GHS ${balance.toFixed(2)}`
                  )}
                </p>
              </div>
              <Wallet className="h-12 w-12 opacity-90" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Plus className="h-12 w-12 text-green-600 mx-auto mb-3" />
            <div className="space-y-3">
              <input
                type="number"
                placeholder="Amount (GHS)"
                min="1"
                step="0.01"
                value={topUpAmount}
                onChange={(e) => setTopUpAmount(e.target.value)}
                className="w-full p-2 border rounded text-center"
                disabled={topUpLoading}
              />
              <Button 
                onClick={handleTopUp}
                disabled={topUpLoading || !topUpAmount}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                {topUpLoading ? "Processing..." : `Top Up GHS ${topUpAmount || '0'}`}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <History className="h-12 w-12 text-blue-600 mx-auto mb-3" />
            <Button variant="outline" className="w-full" disabled>
              Transaction History
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default WalletPage;