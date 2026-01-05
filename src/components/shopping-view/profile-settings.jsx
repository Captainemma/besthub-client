import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function ProfileSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
        <p className="text-gray-600">Update your personal information</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Personal Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" defaultValue="HH Emmanuel" />
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" defaultValue="emmanuel@example.com" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" defaultValue="0548858216" />
            </div>
            <div>
              <Label htmlFor="username">Username</Label>
              <Input id="username" defaultValue="HH_Emmanuel" />
            </div>
          </div>

          <Button className="bg-blue-600 hover:bg-blue-700">
            Update Profile
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default ProfileSettings;