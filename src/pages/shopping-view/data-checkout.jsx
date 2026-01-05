import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { fetchWalletBalance } from "@/store/shop/wallet-slice";
import { Wifi, Zap, Clock, ArrowLeft } from "lucide-react";

function DataCheckout() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const { dataPackages } = useSelector((state) => state.shopProducts);
  const { user } = useSelector((state) => state.auth);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();

  const packageId = searchParams.get('package');

  useEffect(() => {
    if (packageId && dataPackages.length > 0) {
      const pkg = dataPackages.find(p => p._id === packageId);
      setSelectedPackage(pkg);
    }
  }, [packageId, dataPackages]);

  const handlePurchase = async () => {
    if (!phoneNumber) {
      toast({
        title: "Phone number required",
        description: "Please enter your phone number to receive the data",
        variant: "destructive",
      });
      return;
    }

    if (!selectedPackage) {
      toast({
        title: "No package selected",
        description: "Please select a data package first",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Please login first",
        description: "You need to be logged in to purchase data",
        variant: "destructive",
      });
      navigate("/auth/login");
      return;
    }

    setIsPurchasing(true);

    try {
      const response = await fetch(`${API_BASE_URL}/shop/orders`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          packageId: selectedPackage._id,
          phoneNumber: phoneNumber,
          userId: user.id,
          network: selectedPackage.network,
          amount: selectedPackage.price,
          packageName: selectedPackage.dataAmount || selectedPackage.packageName
        })
      });

      const result = await response.json();
      
      if (result.success) {
        toast({
          title: "Data purchase successful!",
          description: `Your ${selectedPackage.dataAmount} ${selectedPackage.network} package has been sent to ${phoneNumber}`,
        });
        
        // Refresh wallet balance
        dispatch(fetchWalletBalance(user.id));
        
        // Navigate to account page instead of payment-success
        navigate("/shop/account");
      } else {
        toast({
          title: "Purchase failed",
          description: result.message || "Please try again",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Purchase error:', error);
      toast({
        title: "Purchase failed",
        description: "Network error. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsPurchasing(false);
    }
  };

  const getNetworkIcon = (network) => {
    switch (network) {
      case 'MTN': return <Wifi className="w-5 h-5" />;
      case 'Telecel': return <Zap className="w-5 h-5" />;
      case 'AT': return <Clock className="w-5 h-5" />;
      default: return <Wifi className="w-5 h-5" />;
    }
  };

  if (!selectedPackage) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-md text-center">
        <Button onClick={() => navigate(-1)} variant="outline" className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Packages
        </Button>
        <p>No package selected. Please choose a package first.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <Button onClick={() => navigate(-1)} variant="outline" className="mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Packages
      </Button>

      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      
      {/* Package Summary */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              selectedPackage.network === 'MTN' ? 'bg-yellow-100' :
              selectedPackage.network === 'Telecel' ? 'bg-red-100' : 'bg-blue-100'
            }`}>
              {getNetworkIcon(selectedPackage.network)}
            </div>
            <div>
              <h3 className="font-semibold">{selectedPackage.network}</h3>
              <p className="text-sm text-gray-600">{selectedPackage.dataAmount}</p>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <p className="text-lg font-bold text-primary">GH¢{selectedPackage.price}</p>
          </div>
        </CardContent>
      </Card>

      {/* Phone Number Input */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="e.g., 0241234567"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="mt-1"
          />
          <p className="text-xs text-gray-500 mt-1">
            Enter the phone number you want to credit with data
          </p>
        </div>

        {/* Purchase Button */}
        <Button 
          onClick={handlePurchase} 
          className="w-full"
          disabled={isPurchasing}
          size="lg"
        >
          {isPurchasing ? "Processing..." : `Pay GH¢${selectedPackage.price} - Buy Now`}
        </Button>
      </div>
    </div>
  );
}

export default DataCheckout;