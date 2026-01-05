import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSelector } from "react-redux";
import { User, Wallet, History } from "lucide-react";
import DataPurchaseHistory from "@/components/shopping-view/data-purchase-history";

function ShoppingAccount() {
  const { user } = useSelector((state) => state.auth);
  const { balance } = useSelector((state) => state.wallet); // Get real balance

  // Calculate member since year
  const memberSince = user?.createdAt 
    ? new Date(user.createdAt).getFullYear() 
    : 2024;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* User Profile Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
              <User className="w-10 h-10" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Welcome, {user?.userName || 'User'}</h1>
              <p className="text-blue-100">{user?.email}</p>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-2">
                  <Wallet className="w-4 h-4" />
                  <span className="font-semibold">GHS {balance?.toFixed(2) || '0.00'}</span>
                </div>
                <span className="text-blue-200">•</span>
                <span className="text-blue-200">Member since {memberSince}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 -mt-8">
        <div className="bg-white rounded-lg shadow-sm border">
          <Tabs defaultValue="purchases" className="w-full">
            <TabsList className="w-full justify-start border-b rounded-none rounded-t-lg">
              <TabsTrigger value="purchases" className="flex items-center gap-2">
                <History className="w-4 h-4" />
                Purchase History
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="purchases" className="p-6">
              <DataPurchaseHistory />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default ShoppingAccount;