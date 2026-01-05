import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { WifiOff, RefreshCw } from "lucide-react";

function PackageSelectionModal({ open, onClose, network, packages, onPackageSelect, isLoading, error }) {
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [recipientNumber, setRecipientNumber] = useState("");
  const [confirmRecipientNumber, setConfirmRecipientNumber] = useState("");
  const [step, setStep] = useState(1);

  const numbersMatch = recipientNumber === confirmRecipientNumber && recipientNumber.length >= 10;

  const handlePackageSelect = (pkg) => {
    setSelectedPackage(pkg);
    setStep(2);
  };

  const handleProceedToConfirm = () => {
    if (numbersMatch) {
      setStep(3);
    }
  };

  const handleConfirmPurchase = () => {
    onPackageSelect({
      ...selectedPackage,
      recipientNumber,
      network: network.toLowerCase()
    });
    onClose();
    // Reset form
    setSelectedPackage(null);
    setRecipientNumber("");
    setConfirmRecipientNumber("");
    setStep(1);
  };

  const handleBack = () => {
    if (step === 2) setStep(1);
    else if (step === 3) setStep(2);
  };

  const handleClose = () => {
    onClose();
    // Reset form
    setSelectedPackage(null);
    setRecipientNumber("");
    setConfirmRecipientNumber("");
    setStep(1);
  };

  const getDialogDescription = () => {
    switch (step) {
      case 1:
        return `Select a ${network} data package to purchase`;
      case 2:
        return `Enter recipient phone number for ${network} data bundle`;
      case 3:
        return `Confirm your ${network} data bundle purchase details`;
      default:
        return `${network} data package selection`;
    }
  };

  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{network} Data Purchase</DialogTitle>
          <DialogDescription>
            {getDialogDescription()}
          </DialogDescription>
        </DialogHeader>

        {error ? (
          <div className="space-y-4">
            {/* Error display using existing components */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-red-800">
                <WifiOff className="h-4 w-4" />
                <span className="font-medium">Connection Error</span>
              </div>
              <p className="text-red-700 text-sm mt-1">
                {error}
              </p>
            </div>
            <Button 
              onClick={handleRetry}
              className="w-full"
              variant="outline"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </div>
        ) : isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <>
            {/* Step 1: Package Selection */}
            {step === 1 && (
              <div className="space-y-4">
                <p className="text-sm text-gray-600">Select a data package</p>
                <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto">
                  {packages.map((pkg, index) => (
                    <Card 
                      key={pkg._id || index}
                      className={`cursor-pointer hover:border-blue-500 transition-colors ${
                        selectedPackage?._id === pkg._id ? 'border-blue-500 bg-blue-50' : ''
                      }`}
                      onClick={() => handlePackageSelect(pkg)}
                    >
                      <CardContent className="p-3 text-center">
                        <div className="font-semibold">{pkg.dataAmount || pkg.packageName}</div>
                        <div className="text-sm text-green-600">GHS {pkg.price}</div>
                        {pkg.validity && (
                          <div className="text-xs text-gray-500">{pkg.validity}</div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                {packages.length === 0 && (
                  <div className="text-center py-4 text-gray-500">
                    No packages available for {network}
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Recipient Details */}
            {step === 2 && selectedPackage && (
              <div className="space-y-4">
                <div className="bg-gray-50 p-3 rounded">
                  <div className="text-sm font-semibold">Selected: {selectedPackage.dataAmount || selectedPackage.packageName}</div>
                  <div className="text-lg font-bold text-green-600">GHS {selectedPackage.price}</div>
                </div>

                <div className="space-y-3">
                  <div>
                    <Label htmlFor="recipient">Recipient number</Label>
                    <Input
                      id="recipient"
                      type="tel"
                      placeholder="0548858216"
                      value={recipientNumber}
                      onChange={(e) => setRecipientNumber(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="confirm-recipient">Repeat Recipient number</Label>
                    <Input
                      id="confirm-recipient"
                      type="tel"
                      placeholder="0548858216"
                      value={confirmRecipientNumber}
                      onChange={(e) => setConfirmRecipientNumber(e.target.value)}
                    />
                  </div>

                  {recipientNumber && confirmRecipientNumber && (
                    <div className={`text-sm ${
                      numbersMatch ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {numbersMatch ? '✓ Recipient numbers match' : '✗ Recipient numbers do not match'}
                    </div>
                  )}
                </div>

                <Button 
                  onClick={handleProceedToConfirm}
                  disabled={!numbersMatch}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  Pay With Wallet
                </Button>

                <Button variant="outline" onClick={handleBack} className="w-full">
                  Back
                </Button>
              </div>
            )}

            {/* Step 3: Confirmation */}
            {step === 3 && selectedPackage && (
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded">
                  <div className="font-semibold">{network} Data Purchase</div>
                  <div className="text-2xl font-bold text-green-600">GHS {selectedPackage.price}</div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Network</span>
                    <span className="font-semibold">{network}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Package</span>
                    <span className="font-semibold">{selectedPackage.dataAmount || selectedPackage.packageName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Price</span>
                    <span className="font-semibold">GHS {selectedPackage.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Recipient Number</span>
                    <span className="font-semibold">{recipientNumber}</span>
                  </div>
                </div>

                <Button 
                  onClick={handleConfirmPurchase}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  Confirm and Send
                </Button>

                <Button variant="outline" onClick={handleBack} className="w-full">
                  Back
                </Button>
              </div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default PackageSelectionModal;