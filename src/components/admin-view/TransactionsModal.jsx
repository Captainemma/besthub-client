import { useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Minus, DollarSign, X } from "lucide-react";

const TransactionsModal = ({ isOpen, onClose, selectedUser, userTransactions }) => {
  const getTransactionTypeBadge = useCallback((type) => {
    const typeConfig = {
      topup: { label: "Top-up", color: "bg-green-100 text-green-800" },
      purchase: { label: "Purchase", color: "bg-blue-100 text-blue-800" },
      refund: { label: "Refund", color: "bg-orange-100 text-orange-800" },
      withdrawal: { label: "Withdrawal", color: "bg-red-100 text-red-800" }
    };
    return <Badge className={typeConfig[type]?.color || "bg-gray-100 text-gray-800"}>
      {typeConfig[type]?.label || type}
    </Badge>;
  }, []);

  const formatDateTime = useCallback((dateString) => {
    if (!dateString) return 'No date';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Transactions for {selectedUser?.userName}</span>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-3">
          {userTransactions.map((transaction) => (
            <div key={transaction._id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  transaction.type === 'topup' ? 'bg-green-100' : 
                  transaction.type === 'withdrawal' ? 'bg-red-100' : 'bg-blue-100'
                }`}>
                  {transaction.type === 'topup' ? (
                    <Plus className="w-5 h-5 text-green-600" />
                  ) : transaction.type === 'withdrawal' ? (
                    <Minus className="w-5 h-5 text-red-600" />
                  ) : (
                    <DollarSign className="w-5 h-5 text-blue-600" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">{transaction.description}</p>
                    {getTransactionTypeBadge(transaction.type)}
                    <Badge className={
                      transaction.status === 'completed' ? 'bg-green-100 text-green-800' :
                      transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }>
                      {transaction.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    {formatDateTime(transaction.createdAt)}
                  </p>
                  {transaction.reference && (
                    <p className="text-xs text-gray-500">Ref: {transaction.reference}</p>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className={`text-lg font-bold ${
                  transaction.type === 'topup' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'topup' ? '+' : '-'}GHS {transaction.amount.toFixed(2)}
                </p>
              </div>
            </div>
          ))}
          
          {userTransactions.length === 0 && (
            <div className="text-center py-8">
              <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No transactions found</p>
              <p className="text-sm text-gray-500 mt-1">
                This user hasn't made any transactions yet
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionsModal;