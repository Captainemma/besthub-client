import { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Minus, Wallet, ArrowUpDown, X } from "lucide-react";
import { updateUserWalletBalance, fetchAllUsersWithWallets } from "@/store/admin/wallet-slice";

const WalletModal = ({ isOpen, onClose, selectedUser, updating }) => {
  const [amount, setAmount] = useState("");
  const [transactionType, setTransactionType] = useState("credit");
  const [description, setDescription] = useState("");
  
  const dispatch = useDispatch();

  const handleAmountChange = useCallback((e) => {
    setAmount(e.target.value);
  }, []);

  const handleDescriptionChange = useCallback((e) => {
    setDescription(e.target.value);
  }, []);

  const handleTransactionTypeChange = useCallback((type) => {
    setTransactionType(type);
  }, []);

  const handleWalletAction = useCallback(() => {
    if (!selectedUser || !amount) return;
    
    dispatch(updateUserWalletBalance({
      userId: selectedUser._id,
      amount,
      type: transactionType,
      description
    }))
      .unwrap()
      .then(() => {
        setAmount("");
        setDescription("");
        onClose();
        dispatch(fetchAllUsersWithWallets());
      })
      .catch(error => {
        console.error('Failed to update wallet:', error);
      });
  }, [selectedUser, amount, transactionType, description, dispatch, onClose]);

  const handleClose = useCallback(() => {
    setAmount("");
    setDescription("");
    onClose();
  }, [onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Wallet Action for {selectedUser?.userName}</span>
            <Button variant="ghost" size="icon" onClick={handleClose}>
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-green-600" />
                <span className="font-semibold">Current Balance:</span>
              </div>
              <span className="text-xl font-bold text-green-600">
                GHS {selectedUser?.balance?.toFixed(2)}
              </span>
            </div>
            <div className="text-sm text-gray-600 mt-1">
              {selectedUser?.email} • {selectedUser?.role}
            </div>
          </div>

          <div>
            <Label htmlFor="transactionType">Transaction Type</Label>
            <div className="flex gap-2 mt-1">
              <button
                type="button"
                onClick={() => handleTransactionTypeChange('credit')}
                className={`flex-1 py-3 px-4 rounded border ${
                  transactionType === 'credit'
                    ? 'bg-green-100 border-green-500 text-green-700'
                    : 'bg-gray-100 border-gray-300'
                }`}
              >
                <Plus className="w-4 h-4 inline mr-2" />
                Credit
              </button>
              <button
                type="button"
                onClick={() => handleTransactionTypeChange('debit')}
                className={`flex-1 py-3 px-4 rounded border ${
                  transactionType === 'debit'
                    ? 'bg-red-100 border-red-500 text-red-700'
                    : 'bg-gray-100 border-gray-300'
                }`}
              >
                <Minus className="w-4 h-4 inline mr-2" />
                Debit
              </button>
            </div>
          </div>

          <div>
            <Label htmlFor="amount">Amount (GHS)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={handleAmountChange}
              min="0.01"
              step="0.01"
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="Transaction description"
              value={description}
              onChange={handleDescriptionChange}
            />
          </div>

          <Button
            onClick={handleWalletAction}
            disabled={!amount || updating}
            className={`w-full ${
              transactionType === 'credit' 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            <ArrowUpDown className="w-4 h-4 mr-2" />
            {updating ? 'Processing...' : `${transactionType === 'credit' ? 'Credit' : 'Debit'} Wallet`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WalletModal;