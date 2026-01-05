import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { useState } from "react";
import PackageSelectionModal from "./package-selection-modal";
import { useDispatch, useSelector } from "react-redux";
import { fetchBundlesByNetwork, clearNetworkError } from "@/store/shop/products-slice";

function DataPackageCard({ network, onPackageSelect }) {
  const [showPackageModal, setShowPackageModal] = useState(false);
  const dispatch = useDispatch();
  const { dataPackages, isLoading, networkError } = useSelector((state) => state.shopProducts);

  const getNetworkIcon = (network) => {
    switch (network.toLowerCase()) {
      case 'mtn': return '📱';
      case 'telecel': return '⚡';
      case 'airteltigo': return '⏰';
      default: return '📱';
    }
  };

  const handleBuyClick = () => {
    console.log(`🔄 Fetching packages for network: "${network}"`);
    // Clear any previous errors
    dispatch(clearNetworkError());
    // Fetch packages for this network when modal opens
    dispatch(fetchBundlesByNetwork(network.toLowerCase()));
    setShowPackageModal(true);
  };

  const handlePackageSelect = (selectedPackage) => {
    setShowPackageModal(false);
    onPackageSelect(selectedPackage);
  };

  const handleCloseModal = () => {
    setShowPackageModal(false);
    dispatch(clearNetworkError());
  };

  // Get packages for this specific network
  const networkPackages = dataPackages.filter(pkg => {
    const networkMap = {
      'mtn': ['MTN'],
      'telecel': ['Telecel', 'TELECEL'],
      'airteltigo': ['AT', 'AIRTELTIGO']
    };
    
    const validNetworks = networkMap[network.toLowerCase()] || [network];
    return pkg.network && validNetworks.includes(pkg.network);
  });

  return (
    <>
      <Card className="w-full max-w-sm mx-auto hover:shadow-lg transition-shadow border">
        <CardContent className="p-6">
          {/* Network Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
              network.toLowerCase() === 'mtn' ? 'bg-yellow-500' :
              network.toLowerCase() === 'telecel' ? 'bg-red-500' : 'bg-blue-500'
            }`}>
              {getNetworkIcon(network)}
            </div>
            <div>
              <h2 className="text-xl font-bold">{network} Data</h2>
              <p className="text-sm text-gray-600">
                Click to view packages
              </p>
            </div>
          </div>

          {/* Buy Button */}
          <Button 
            onClick={handleBuyClick}
            className="w-full bg-purple-600 hover:bg-purple-700"
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Buy Now'}
          </Button>
        </CardContent>
      </Card>

      {/* Package Selection Modal */}
      <PackageSelectionModal
        open={showPackageModal}
        onClose={handleCloseModal}
        network={network}
        packages={networkPackages}
        onPackageSelect={handlePackageSelect}
        isLoading={isLoading}
        error={networkError}
      />
    </>
  );
}

export default DataPackageCard;