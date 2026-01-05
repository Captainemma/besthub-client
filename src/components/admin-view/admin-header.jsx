import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { logoutUser } from "@/store/auth-slice";
import { UserCog, LogOut, Shield, Bell, HelpCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

function AdminHeader() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function handleLogout() {
    dispatch(logoutUser());
    navigate("/auth/login");
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background shadow-sm">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <div className="flex-1 flex justify-center lg:justify-start">
          <Link to="/admin/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-orange-600 rounded-lg flex items-center justify-center">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
              Admin Panel
            </span>
          </Link>
        </div>

        {/* Right Content */}
        <div className="flex-1 flex justify-end items-center gap-4">
          {/* Notification Bell */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
              5
            </span>
          </Button>

          {/* Help Button */}
          <Button variant="ghost" size="icon">
            <HelpCircle className="h-5 w-5" />
          </Button>

          {/* User Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="bg-red-500 cursor-pointer h-8 w-8">
                <AvatarFallback className="bg-red-500 text-white text-sm font-extrabold">
                  {user?.userName?.[0]?.toUpperCase() || "A"}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="bottom" align="end" className="w-56">
              <DropdownMenuLabel>Admin: {user?.userName}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/admin/profile")}>
                <UserCog className="mr-2 h-4 w-4" />
                Admin Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/admin/settings")}>
                <Shield className="mr-2 h-4 w-4" />
                System Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/shop/dashboard")}>
                <span className="mr-2">👤</span>
                Switch to User View
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

export default AdminHeader;