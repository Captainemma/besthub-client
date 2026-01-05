import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";

function PurchaseConfirmationModal({ open, onClose, purchaseData, onConfirm }) {
  const { balance } = useSelector((state) => state.wallet);
  
  if (!purchaseData) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <div className="text-center space-y-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg">Purchase Successful!</h3>
            <p className="text-green-600 mt-1">
              {purchaseData.dataAmount || purchaseData.data} {purchaseData.network} data sent to {purchaseData.recipientNumber}
            </p>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Amount:</span>
              <span className="font-semibold">GHS {purchaseData.price || purchaseData.amount}</span>
            </div>
            <div className="flex justify-between">
              <span>New Balance:</span>
              <span className="font-semibold">GHS {balance?.toFixed(2) || '0.00'}</span>
            </div>
          </div>

          <Button onClick={onConfirm} className="w-full bg-green-600 hover:bg-green-700">
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default PurchaseConfirmationModal;