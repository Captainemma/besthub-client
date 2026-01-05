import { Outlet } from "react-router-dom";
import ShoppingHeader from "./header";
import ShoppingSidebar from "./sidebar";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

function ShoppingLayout() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Show sidebar on all shop routes (simplified logic)
  const currentPath = window.location.pathname;
  const showSidebar = currentPath.startsWith('/shop');

  if (!showSidebar) {
    return (
      <div className="flex flex-col min-h-screen">
        <ShoppingHeader />
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Desktop Sidebar - hidden on mobile */}
      <div className="hidden lg:block">
        <ShoppingSidebar />
      </div>
      
      {/* Mobile Sidebar Trigger */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="bg-white shadow-md">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <ShoppingSidebar />
          </SheetContent>
        </Sheet>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <ShoppingHeader />
        <main className="flex-1 overflow-auto p-4 lg:p-6 lg:ml-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default ShoppingLayout;