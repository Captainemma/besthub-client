import { addDataPackageFormElements } from "@/config";

function AdminProducts() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Data Packages</h1>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <p className="text-gray-600">Data package management interface coming soon...</p>
        <div className="mt-4 p-4 bg-gray-50 rounded">
          <h3 className="font-semibold mb-2">Available Networks:</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>MTN Data Packages</li>
            <li>Telecel Data Packages</li>
            <li>AirtelTigo Data Packages</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default AdminProducts;