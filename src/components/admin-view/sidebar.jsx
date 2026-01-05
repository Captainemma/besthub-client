import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  History, 
  Wallet, 
  Wifi, 
  Zap, 
  Clock, 
  DollarSign, 
  Settings, 
  LogOut,
  User,
  Shield
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useDispatch } from "react-redux";
import { logoutUser } from "@/store/auth-slice";
import { useNavigate } from "react-router-dom";

const adminSidebarItems = [
  {
    name: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Users Management",
    href: "/admin/users",
    icon: Users,
  },
  {
    name: "Transactions",
    href: "/admin/transactions",
    icon: History,
  },
  {
    name: "Wallet Management",
    href: "/admin/wallet",
    icon: Wallet,
  },
  {
    name: "MTN Orders",
    href: "/admin/orders/mtn",
    icon: Wifi,
  },
  {
    name: "Telecel Orders",
    href: "/admin/orders/telecel",
    icon: Zap,
  },
  {
    name: "AT Orders",
    href: "/admin/orders/at",
    icon: Clock,
  },
  {
    name: "Price Management",
    href: "/admin/prices",
    icon: DollarSign,
  },
  {
    name: "System Settings",
    href: "/admin/settings",
    icon: Settings,
  },
  {
    name: "Admin Profile",
    href: "/admin/profile",
    icon: User,
  },
];

function AdminSidebar() {
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
        <Link to="/admin/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-xl">BesthubGH</span>
        </Link>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 space-y-2 p-4">
        {adminSidebarItems.map((item) => {
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
          BesthubGH © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}

export default AdminSidebar;