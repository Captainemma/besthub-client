// /src/pages/shopping-view/checkout.jsx - SIMPLIFIED VERSION
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { purchaseDataPackage } from "@/store/shop/products-slice";

function DataCheckout() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const { currentPackage, isLoading } = useSelector((state) => state.shopProducts);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { toast } = useToast();

  // This would be set when user selects a package
  const selectedPackage = useSelector((state) => state.shopProducts.currentPackage);

  const handlePurchase = () => {
    if (!phoneNumber) {
      toast({
        title: "Phone number required",
        description: "Please enter your phone number",
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

    dispatch(purchaseDataPackage({
      packageId: selectedPackage._id,
      phoneNumber: phoneNumber,
      userId: user?.id
    })).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: "Data purchase successful!",
          description: `Your ${selectedPackage.dataAmount} package has been activated`,
        });
      } else {
        toast({
          title: "Purchase failed",
          description: data?.payload?.message || "Please try again",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      
      {selectedPackage && (
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h2 className="font-semibold mb-2">Package Details</h2>
          <p><strong>Network:</strong> {selectedPackage.network}</p>
          <p><strong>Data:</strong> {selectedPackage.dataAmount}</p>
          <p><strong>Validity:</strong> {selectedPackage.validity}</p>
          <p><strong>Price:</strong> GH¢{selectedPackage.price}</p>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="Enter your phone number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>

        <Button 
          onClick={handlePurchase} 
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : `Pay GH¢${selectedPackage?.price || 0}`}
        </Button>
      </div>
    </div>
  );
}

export default DataCheckout;