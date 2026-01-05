import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { ArrowUpDownIcon, Package } from "lucide-react";
import DataPackageCard from "@/components/shopping-view/data-package-card";
import NetworkFilter from "@/components/shopping-view/network-filter";

function ShoppingListing() {
  const dispatch = useDispatch();
  const { dataPackages, isLoading } = useSelector((state) => state.shopProducts);
  const { user } = useSelector((state) => state.auth);
  const [selectedNetwork, setSelectedNetwork] = useState("MTN");
  const [sort, setSort] = useState("price-lowtohigh");
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const networkParam = searchParams.get("network");

  // Handle network selection for package filtering
  function handleNetworkSelect(network) {
    setSelectedNetwork(network);
    setSearchParams({ network });
  }

  // Handle data package purchase - ENABLED REAL PURCHASE
 function handlePurchaseDataPackage(dataPackage) {
  if (!user) {
    toast({
      title: "Please login first",
      description: "You need to be logged in to purchase data",
      variant: "destructive",
    });
    navigate("/auth/login");
    return;
  }

  // Navigate to checkout with package details
  navigate(`/shop/checkout?package=${dataPackage._id}`);
}
  // Handle sort change
  function handleSort(value) {
    setSort(value);
  }

  // Apply network filter from URL params
  useEffect(() => {
    if (networkParam) {
      setSelectedNetwork(networkParam);
    }
  }, [networkParam]);

  // Sort options for data packages
  const sortOptions = [
    { id: "price-lowtohigh", label: "Price: Low to High" },
    { id: "price-hightolow", label: "Price: High to Low" },
    { id: "data-lowtohigh", label: "Data: Low to High" },
    { id: "data-hightolow", label: "Data: High to Low" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-6 p-4 md:p-6 min-h-screen">
      {/* Network Filter Sidebar */}
      <div className="bg-background rounded-lg shadow-sm p-4">
        <h3 className="font-semibold mb-4">Filter by Network</h3>
        <NetworkFilter 
          selectedNetwork={selectedNetwork} 
          onSelectNetwork={handleNetworkSelect}
          mode="packages"
        />
        
        {/* Quick access to order history */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-sm mb-2">Order History</h4>
          <p className="text-xs text-gray-600 mb-3">View your purchase history</p>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={() => navigate("/shop/orders/mtn")}
          >
            View All Orders
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-background w-full rounded-lg shadow-sm">
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Package className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-extrabold">
              {selectedNetwork} Data Packages
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground">
              {dataPackages?.length || 0} Packages
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <ArrowUpDownIcon className="h-4 w-4" />
                  <span>Sort by</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
                  {sortOptions.map((sortItem) => (
                    <DropdownMenuRadioItem
                      value={sortItem.id}
                      key={sortItem.id}
                    >
                      {sortItem.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          /* Data Packages Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {dataPackages && dataPackages.length > 0 ? (
              dataPackages.map((packageItem) => (
                <DataPackageCard
                  key={packageItem._id}
                  dataPackage={packageItem}
                  onSelect={handlePurchaseDataPackage}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg mb-2">
                  No data packages available for {selectedNetwork}
                </p>
                <p className="text-sm text-gray-400 mb-4">
                  Check back later for new packages
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedNetwork("MTN")}
                >
                  View MTN Packages
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ShoppingListing;