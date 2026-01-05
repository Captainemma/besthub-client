import { Link, useLocation } from "react-router-dom";
import { 
  Home, 
  User, 
  LayoutDashboard, 
  Wifi, 
  Zap, 
  Clock, 
  Wallet, 
  History, 
  Settings, 
  LogOut,
  BarChart3
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useDispatch } from "react-redux";
import { logoutUser } from "@/store/auth-slice";
import { useNavigate } from "react-router-dom";

const sidebarItems = [
  {
    name: "Dashboard",
    href: "/shop/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Home",
    href: "/shop/home",
    icon: Home,
  },
  {
    name: "MTN Orders",
    href: "/shop/orders/mtn",
    icon: Wifi,
  },
  {
    name: "AT Orders",
    href: "/shop/orders/at",
    icon: Clock,
  },
  {
    name: "Telecel Orders",
    href: "/shop/orders/telecel",
    icon: Zap,
  },
  {
    name: "Wallet",
    href: "/shop/wallet",
    icon: Wallet,
  },
  {
    name: "Transactions",
    href: "/shop/transactions",
    icon: History,
  },
  {
    name: "Profile",
    href: "/shop/profile",
    icon: User,
  },
  {
    name: "Settings",
    href: "/shop/settings",
    icon: Settings,
  },
];

function ShoppingSidebar() {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/auth/login");
  };

  return (
    <div className="flex h-full flex-col bg-gray-900 text-white w-64">
      {/* Logo Section */}
      <div className="flex items-center justify-center p-6 border-b border-gray-700">
       
        <Link to="/shop/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Wifi className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-xl">Besthub Ghana</span>
        </Link>
       
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 space-y-2 p-4">
        {sidebarItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-all hover:bg-gray-800",
                isActive ? "bg-blue-600 text-white" : "text-gray-300 hover:text-white"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-gray-300 transition-all hover:bg-gray-800 hover:text-white"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700 text-center">
        <p className="text-xs text-gray-400">
          Besthub Ghana © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}

export default ShoppingSidebar;