import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader } from "lucide-react";
import { useDispatch, useSelector } from "react-redux"; // ← Add useSelector
import { verifyTopUp, fetchWalletBalance } from "@/store/shop/wallet-slice"; // ← Add fetchWalletBalance
import { useToast } from "@/components/ui/use-toast";

function WalletTopupSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();
  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("");
  
  // ADD THIS - Get user from Redux
  const { user } = useSelector((state) => state.auth);

  const reference = searchParams.get("reference");

  useEffect(() => {
    if (reference) {
      verifyPayment();
    } else {
      setStatus("failed");
      setMessage("No payment reference found");
    }
  }, [reference]);

  const verifyPayment = async () => {
    try {
      const result = await dispatch(verifyTopUp({ reference })).unwrap();
      
      if (result.success) {
        setStatus("success");
        setMessage(`Top-up successful! New balance: GHS ${result.data.newBalance.toFixed(2)}`);
        
        // REFRESH BALANCE FOR ALL COMPONENTS
        if (user?.id) {
          dispatch(fetchWalletBalance(user.id));
        }
        
        toast({
          title: "Top-up Successful!",
          description: `Your wallet has been credited with GHS ${result.data.transaction.amount.toFixed(2)}`,
        });
      } else {
        setStatus("failed");
        setMessage(result.message || "Payment verification failed");
      }
    } catch (error) {
      setStatus("failed");
      setMessage(error || "Error verifying payment");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-6 text-center">
          {status === "verifying" && (
            <>
              <Loader className="h-16 w-16 text-blue-600 animate-spin mx-auto mb-4" />
              <CardTitle className="mb-2">Verifying Payment</CardTitle>
              <p className="text-gray-600">Please wait while we verify your payment...</p>
            </>
          )}

          {status === "success" && (
            <>
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <CardTitle className="mb-2 text-green-600">Payment Successful!</CardTitle>
              <p className="text-gray-600 mb-4">{message}</p>
              <div className="space-y-3">
                <Button 
                  onClick={() => navigate("/shop/wallet")}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  View Wallet
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => navigate("/shop/home")}
                  className="w-full"
                >
                  Continue Shopping
                </Button>
              </div>
            </>
          )}

          {status === "failed" && (
            <>
              <XCircle className="h-16 w-16 text-red-600 mx-auto mb-4" />
              <CardTitle className="mb-2 text-red-600">Payment Failed</CardTitle>
              <p className="text-gray-600 mb-4">{message}</p>
              <div className="space-y-3">
                <Button 
                  onClick={() => navigate("/shop/wallet")}
                  variant="outline"
                  className="w-full"
                >
                  Back to Wallet
                </Button>
                <Button 
                  onClick={() => window.location.reload()}
                  className="w-full"
                >
                  Try Again
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default WalletTopupSuccess;