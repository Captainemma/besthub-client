import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

function DataPackageDetails({ open, onClose, packageData }) {
  if (!packageData) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{packageData.network} Data Package</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p><strong>Data:</strong> {packageData.data}</p>
          <p><strong>Price:</strong> GHS {packageData.price}</p>
          <Button className="w-full">Buy Now</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default DataPackageDetails;