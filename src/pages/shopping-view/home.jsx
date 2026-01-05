import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import DataPackageCard from "@/components/shopping-view/data-package-card";
import PurchaseConfirmationModal from "@/components/shopping-view/purchase-confirmation-modal";
import { fetchWalletBalance } from "@/store/shop/wallet-slice";

function ShoppingHome() {
  const { user } = useSelector((state) => state.auth);
  const { balance, loading: balanceLoading } = useSelector((state) => state.wallet);
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handlePackageSelect = (purchaseData) => {
    setSelectedPurchase(purchaseData);
    setShowConfirmation(true);
  };

  const handleConfirmPurchase = async () => {
    if (!selectedPurchase || !user) return;

    try {
      console.log('🔄 Making purchase...', selectedPurchase);
      
      const response = await fetch('http://localhost:4400/api/shop/orders', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          packageId: selectedPurchase._id,
          phoneNumber: selectedPurchase.recipientNumber,
          userId: user.id,
          network: selectedPurchase.network,
          amount: selectedPurchase.price,
          packageName: selectedPurchase.dataAmount || selectedPurchase.packageName
        })
      });

      const result = await response.json();
      console.log('📦 Purchase result:', result);
      
      if (result.success) {
        // Refresh wallet balance
        dispatch(fetchWalletBalance(user.id));
        
        toast({
          title: "Purchase Successful!",
          description: `Your ${selectedPurchase.dataAmount} ${selectedPurchase.network} data has been sent to ${selectedPurchase.recipientNumber}`,
        });
        
        // Navigate to account page after successful purchase
        navigate("/shop/account");
        
        setShowConfirmation(false);
        setSelectedPurchase(null);
      } else {
        toast({
          title: "Purchase Failed",
          description: result.message || "Please try again",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('❌ Purchase error:', error);
      toast({
        title: "Purchase Failed",
        description: "Network error. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchWalletBalance(user.id));
    }
  }, [dispatch, user]);

  // If no user, show loading
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with User Info */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Hello {user?.userName || 'User'}</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-gray-600">
                  {balanceLoading ? (
                    <span className="inline-block h-4 w-20 bg-gray-200 rounded animate-pulse">Loading...</span>
                  ) : (
                    `GHS ${balance?.toFixed(2) || '0.00'}`
                  )}
                </span>
                <button className="text-sm text-blue-600 hover:text-blue-800">
                  Top up
                </button>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              {new Date().toLocaleString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Data Packages Grid */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <DataPackageCard 
            network="MTN" 
            onPackageSelect={handlePackageSelect}
          />
          <DataPackageCard 
            network="Telecel" 
            onPackageSelect={handlePackageSelect}
          />
          <DataPackageCard 
            network="AirtelTigo" 
            onPackageSelect={handlePackageSelect}
          />
        </div>
      </div>

      {/* Purchase Confirmation Modal */}
      <PurchaseConfirmationModal
        open={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        purchaseData={selectedPurchase}
        onConfirm={handleConfirmPurchase}
      />
    </div>
  );
}

export default ShoppingHome;