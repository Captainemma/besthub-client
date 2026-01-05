import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { logoutUser } from "@/store/auth-slice";
import { User, LogOut, Wifi, Bell, HelpCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

function HeaderRightContent() {
  const { user } = useSelector((state) => state.auth);
  const { balance } = useSelector((state) => state.wallet); // Get real balance
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function handleLogout() {
    dispatch(logoutUser());
    navigate("/auth/login");
  }

  return (
    <div className="flex items-center gap-4">
      {/* Notification Bell */}
      <Button variant="ghost" size="icon" className="relative">
        <Bell className="h-5 w-5" />
        <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
          3
        </span>
      </Button>

      {/* Help Button */}
      <Button variant="ghost" size="icon">
        <HelpCircle className="h-5 w-5" />
      </Button>

      {/* User Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="bg-primary cursor-pointer h-8 w-8">
            <AvatarFallback className="bg-primary text-white text-sm font-extrabold">
              {user?.userName?.[0]?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="bottom" align="end" className="w-56">
          <DropdownMenuLabel>
            <div className="flex flex-col">
              <span className="font-semibold">{user?.userName}</span>
              <span className="text-sm text-gray-500">{user?.email}</span>
              <div className="flex items-center gap-1 mt-1 text-xs text-gray-600">
                <span>💰</span>
                <span>GHS {balance?.toFixed(2) || '0.00'}</span>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate("/shop/account")}>
            <User className="mr-2 h-4 w-4" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function ShoppingHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background shadow-sm">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo - Centered since no menu items */}
        <div className="flex-1 flex justify-center lg:justify-start">
          <Link to="/shop/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Wifi className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              BesthubGH
            </span>
          </Link>
        </div>

        {/* Right Content */}
        <div className="flex-1 flex justify-end">
          <HeaderRightContent />
        </div>
      </div>
    </header>
  );
}

export default ShoppingHeader;