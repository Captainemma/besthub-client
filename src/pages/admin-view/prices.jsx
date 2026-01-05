import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, DollarSign, Users, Wifi, Zap, Clock, Plus, Trash2, X, RefreshCw } from "lucide-react";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { 
  fetchAllPrices, 
  updatePrices, 
  addNewPackage,
  deletePackage,
  updateLocalPrice,
  clearError 
} from "@/store/admin/price-slice";

function AdminPrices() {
  const [activeNetwork, setActiveNetwork] = useState("MTN");
  const [activeUserType, setActiveUserType] = useState("customer");
  const [newPackage, setNewPackage] = useState({ packageName: "", originalPrice: "", sellingPrice: "" });
  
  const priceState = useSelector((state) => state.prices);
  const { 
    prices, 
    loading, 
    updating, 
    error 
  } = priceState || {};

  const dispatch = useDispatch();

  // Debug: Check what's in the state
  useEffect(() => {
    console.log('🔍 Price State:', priceState);
    console.log('🔍 Prices data:', prices);
  }, [priceState, prices]);

  // Fetch prices on component mount
  useEffect(() => {
    console.log('🔄 Fetching prices...');
    dispatch(fetchAllPrices());
  }, [dispatch]);

  // Get current packages for active network and user type
  const currentPackages = useMemo(() => {
    return prices?.[activeNetwork]?.[activeUserType] || [];
  }, [prices, activeNetwork, activeUserType]);

  const handlePriceChange = useCallback((packageId, field, value) => {
    dispatch(updateLocalPrice({
      network: activeNetwork,
      userRole: activeUserType,
      packageId,
      field,
      value
    }));
  }, [dispatch, activeNetwork, activeUserType]);

  const handleAddPackage = useCallback(() => {
    if (!newPackage.packageName || !newPackage.originalPrice) {
      alert('Please fill in package name and original price');
      return;
    }

    const packageData = {
      packageName: newPackage.packageName,
      originalPrice: parseFloat(newPackage.originalPrice) || 0,
      sellingPrice: parseFloat(newPackage.sellingPrice) || parseFloat(newPackage.originalPrice) || 0
    };

    dispatch(addNewPackage({ 
      network: activeNetwork, 
      userRole: activeUserType, 
      packageData 
    }))
      .unwrap()
      .then(() => {
        setNewPackage({ packageName: "", originalPrice: "", sellingPrice: "" });
      })
      .catch(error => {
        console.error('Failed to add package:', error);
      });
  }, [newPackage, activeNetwork, activeUserType, dispatch]);

  const handleDeletePackage = useCallback((packageId) => {
    if (currentPackages.length <= 1) {
      alert('You must have at least one package');
      return;
    }

    if (window.confirm('Are you sure you want to delete this package?')) {
      dispatch(deletePackage({
        network: activeNetwork,
        userRole: activeUserType,
        packageId
      }))
        .unwrap()
        .then(() => {
          console.log('✅ Package deleted successfully');
        })
        .catch(error => {
          console.error('Failed to delete package:', error);
        });
    }
  }, [dispatch, activeNetwork, activeUserType, currentPackages.length]);

  const handleSavePrices = useCallback(() => {
    if (currentPackages.length === 0) {
      alert('No packages to save');
      return;
    }

    dispatch(updatePrices({
      network: activeNetwork,
      userRole: activeUserType,
      packages: currentPackages
    }))
      .unwrap()
      .then(() => {
        console.log('✅ Prices saved successfully');
      })
      .catch(error => {
        console.error('Failed to save prices:', error);
      });
  }, [dispatch, activeNetwork, activeUserType, currentPackages]);

  const handleRefresh = useCallback(() => {
    dispatch(fetchAllPrices());
  }, [dispatch]);

  const handleClearError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const getNetworkIcon = (network) => {
    switch (network) {
      case 'MTN': return <Wifi className="w-5 h-5 text-yellow-600" />;
      case 'Telecel': return <Zap className="w-5 h-5 text-red-600" />;
      case 'AT': return <Clock className="w-5 h-5 text-blue-600" />;
      default: return <Wifi className="w-5 h-5" />;
    }
  };

  const getUserTypeLabel = (userType) => {
    switch (userType) {
      case 'customer': return 'Customers';
      case 'agent': return 'Agents';
      case 'wholesaler': return 'Wholesalers';
      default: return userType;
    }
  };

  // Auto-fill selling price when original price changes
  useEffect(() => {
    if (newPackage.originalPrice && !newPackage.sellingPrice) {
      setNewPackage(prev => ({
        ...prev,
        sellingPrice: prev.originalPrice
      }));
    }
  }, [newPackage.originalPrice, newPackage.sellingPrice]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-900">Price Management</h1>
          <p className="text-gray-600">Loading price data...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Price Management</h1>
          <p className="text-gray-600">Set independent data bundle prices for different networks and user roles</p>
        </div>
        <Button onClick={handleRefresh} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex items-center justify-between">
            <p className="text-red-800">{error}</p>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={handleClearError}>
                <X className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleRefresh}>
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Network Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Network</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            {["MTN", "Telecel", "AT"].map((network) => (
              <button
                key={network}
                onClick={() => setActiveNetwork(network)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                  activeNetwork === network
                    ? 'bg-blue-100 border-blue-500 text-blue-700'
                    : 'bg-gray-100 border-gray-300 hover:bg-gray-200'
                }`}
              >
                {getNetworkIcon(network)}
                {network}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* User Type Selection */}
      <Card>
        <CardHeader>
          <CardTitle>User Role</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            {["customer", "agent", "wholesaler"].map((userType) => (
              <button
                key={userType}
                onClick={() => setActiveUserType(userType)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                  activeUserType === userType
                    ? 'bg-green-100 border-green-500 text-green-700'
                    : 'bg-gray-100 border-gray-300 hover:bg-gray-200'
                }`}
              >
                <Users className="w-4 h-4" />
                {getUserTypeLabel(userType)}
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Each user role has completely independent pricing
          </p>
        </CardContent>
      </Card>

      {/* Add New Package */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add New Package to {activeNetwork} - {getUserTypeLabel(activeUserType)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="packageName">Package Name (GB)</Label>
              <Input
                id="packageName"
                placeholder="e.g., 1GB, 500MB, 2.5GB"
                value={newPackage.packageName}
                onChange={(e) => setNewPackage(prev => ({ ...prev, packageName: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="originalPrice">Original Price (GHS)</Label>
              <Input
                id="originalPrice"
                type="number"
                step="0.01"
                placeholder="e.g., 5.00"
                value={newPackage.originalPrice}
                onChange={(e) => setNewPackage(prev => ({ ...prev, originalPrice: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="sellingPrice">Selling Price (GHS)</Label>
              <Input
                id="sellingPrice"
                type="number"
                step="0.01"
                placeholder="e.g., 6.00"
                value={newPackage.sellingPrice}
                onChange={(e) => setNewPackage(prev => ({ ...prev, sellingPrice: e.target.value }))}
              />
            </div>
            <div className="flex items-end">
              <Button 
                onClick={handleAddPackage} 
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={!newPackage.packageName || !newPackage.originalPrice}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Package
              </Button>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Note: Package will be added only to {activeNetwork} - {getUserTypeLabel(activeUserType)}
          </p>
        </CardContent>
      </Card>

      {/* Price Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            {activeNetwork} Packages for {getUserTypeLabel(activeUserType)}
            <span className="text-sm font-normal text-gray-500 ml-2">
              ({currentPackages.length} packages)
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {currentPackages.length > 0 ? (
            <div className="space-y-4">
              {currentPackages.map((pkg) => (
                <div key={pkg._id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center p-4 border rounded-lg">
                  {/* Package Info */}
                  <div className="md:col-span-2">
                    <div className="font-semibold text-lg">{pkg.packageName}</div>
                    <div className="text-sm text-gray-600">Package Size</div>
                  </div>

                  {/* Prices */}
                  <div className="md:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Original Price (Supplier)</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-2 text-gray-500">GHS</span>
                        <Input
                          type="number"
                          step="0.01"
                          value={pkg.originalPrice}
                          onChange={(e) => handlePriceChange(pkg._id, 'originalPrice', e.target.value)}
                          className="pl-12 bg-gray-50"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Price from your supplier</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Selling Price ({getUserTypeLabel(activeUserType)})</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-2 text-gray-500">GHS</span>
                        <Input
                          type="number"
                          step="0.01"
                          value={pkg.sellingPrice}
                          onChange={(e) => handlePriceChange(pkg._id, 'sellingPrice', e.target.value)}
                          className="pl-12 bg-green-50 border-green-200"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Price for {getUserTypeLabel(activeUserType).toLowerCase()}</p>
                    </div>
                  </div>

                  {/* Profit Margin */}
                  <div className="md:col-span-1 text-center">
                    <div className="text-sm font-medium text-gray-600">Margin</div>
                    <div className={`text-lg font-bold ${
                      (pkg.sellingPrice - pkg.originalPrice) >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      GHS {(pkg.sellingPrice - pkg.originalPrice).toFixed(2)}
                    </div>
                  </div>

                  {/* Delete Button */}
                  <div className="md:col-span-1 flex justify-center">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDeletePackage(pkg._id)}
                      className="text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}

              <div className="mt-6 flex justify-end">
                <Button 
                  onClick={handleSavePrices} 
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={updating}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {updating ? 'Saving...' : 'Save Prices'}
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No packages found for {activeNetwork} - {getUserTypeLabel(activeUserType)}</p>
              <p className="text-sm text-gray-500 mt-1">
                Add a new package above to get started
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Price Comparison Table */}
      <Card>
        <CardHeader>
          <CardTitle>Price Comparison Across User Roles - {activeNetwork}</CardTitle>
        </CardHeader>
        <CardContent>
          {currentPackages.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left p-3 font-semibold">Package</th>
                    <th className="text-right p-3 font-semibold">Customer Price</th>
                    <th className="text-right p-3 font-semibold">Agent Price</th>
                    <th className="text-right p-3 font-semibold">Wholesaler Price</th>
                  </tr>
                </thead>
                <tbody>
                  {currentPackages.map((pkg) => {
                    const customerPrice = prices?.[activeNetwork]?.customer?.find(cp => cp.packageName === pkg.packageName)?.sellingPrice || 'N/A';
                    const agentPrice = prices?.[activeNetwork]?.agent?.find(ap => ap.packageName === pkg.packageName)?.sellingPrice || 'N/A';
                    const wholesalerPrice = prices?.[activeNetwork]?.wholesaler?.find(wp => wp.packageName === pkg.packageName)?.sellingPrice || 'N/A';
                    
                    return (
                      <tr key={pkg._id} className="border-b hover:bg-gray-50">
                        <td className="p-3 font-medium">{pkg.packageName}</td>
                        <td className="p-3 text-right font-semibold">
                          {typeof customerPrice === 'number' ? `GHS ${customerPrice.toFixed(2)}` : customerPrice}
                        </td>
                        <td className="p-3 text-right">
                          {typeof agentPrice === 'number' ? `GHS ${agentPrice.toFixed(2)}` : agentPrice}
                        </td>
                        <td className="p-3 text-right">
                          {typeof wholesalerPrice === 'number' ? `GHS ${wholesalerPrice.toFixed(2)}` : wholesalerPrice}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              No packages available for comparison
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default AdminPrices;