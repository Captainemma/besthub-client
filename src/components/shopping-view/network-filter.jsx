import { Card, CardContent } from "@/components/ui/card";
import { Wifi, Zap, Clock, History } from "lucide-react";
import { useNavigate } from "react-router-dom";

const networks = [
  { 
    id: "MTN", 
    label: "MTN", 
    icon: Wifi, 
    color: "bg-yellow-500",
    orderPath: "/shop/orders/mtn"
  },
  { 
    id: "Telecel", 
    label: "Telecel", 
    icon: Zap, 
    color: "bg-red-500",
    orderPath: "/shop/orders/telecel"
  },
  { 
    id: "AT", 
    label: "AirtelTigo", 
    icon: Clock, 
    color: "bg-blue-500",
    orderPath: "/shop/orders/at"
  },
];

const NetworkFilter = ({ selectedNetwork, onSelectNetwork, mode = "orders" }) => {
  const navigate = useNavigate();

  const handleNetworkClick = (network) => {
    if (mode === "orders") {
      // Navigate to order history page
      navigate(network.orderPath);
    } else {
      // For other modes (like filtering packages), use the callback
      onSelectNetwork(network.id);
    }
  };

  return (
    <div className="space-y-3">
      {networks.map((network) => (
        <Card
          key={network.id}
          onClick={() => handleNetworkClick(network)}
          className={`cursor-pointer hover:shadow-md transition-all ${
            selectedNetwork === network.id
              ? "ring-2 ring-primary border-primary"
              : ""
          }`}
        >
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full ${network.color} flex items-center justify-center mr-3`}>
                <network.icon className="w-4 h-4 text-white" />
              </div>
              <span className="font-medium">{network.label}</span>
            </div>
            {mode === "orders" && (
              <History className="w-4 h-4 text-gray-400" />
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default NetworkFilter;