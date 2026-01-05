import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

function SearchProducts() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-4">Search Data Packages</h1>
        <p className="text-gray-600 mb-6">Search for MTN, Telecel, or AirtelTigo data packages</p>
        
        <div className="flex gap-2 mb-8">
          <Input
            type="text"
            placeholder="Search networks or data sizes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button>
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <p className="text-gray-600">Search functionality coming soon...</p>
        </div>
      </div>
    </div>
  );
}

export default SearchProducts;