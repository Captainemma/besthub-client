import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Save, User, Mail, Phone, MapPin } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";

function ShoppingProfile() {
  const { user } = useSelector((state) => state.auth);
  const [profile, setProfile] = useState({
    firstName: "Emmanuel",
    lastName: "Amokwandoh",
    email: user?.email || "emmanuel@example.com",
    phone: "0548858216",
    username: "HH_Emmanuel",
    address: "Accra, Ghana",
    bio: "Data bundle enthusiast and regular customer"
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (field, value) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveProfile = () => {
    // Here you would typically send the profile data to your backend
    console.log('Saving profile:', profile);
    setIsEditing(false);
    // Add your save logic here
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        <p className="text-gray-600">Manage your personal information and account details</p>
      </div>

      {/* Profile Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Overview */}
        <Card className="lg:col-span-1">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="relative inline-block mb-4">
                <Avatar className="w-24 h-24 mx-auto">
                  <AvatarImage src="/api/placeholder/96/96" />
                  <AvatarFallback className="text-2xl bg-gradient-to-r from-blue-500 to-purple-600">
                    {user?.userName?.[0]?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <Button 
                  size="icon" 
                  className="absolute bottom-0 right-0 w-8 h-8 rounded-full"
                  variant="secondary"
                >
                  <Camera className="w-4 h-4" />
                </Button>
              </div>
              
              <h2 className="text-xl font-semibold">{profile.firstName} {profile.lastName}</h2>
              <p className="text-gray-600">@{profile.username}</p>
              <p className="text-sm text-gray-500 mt-2">{profile.bio}</p>
              
              <div className="mt-4 space-y-2 text-sm text-gray-600">
                <div className="flex items-center justify-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>{profile.email}</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>{profile.phone}</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{profile.address}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Edit Profile Form */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Personal Information
              </span>
              <Button
                variant={isEditing ? "outline" : "default"}
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? "Cancel" : "Edit Profile"}
              </Button>
            </CardTitle>
            <CardDescription>
              Update your personal details and contact information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={profile.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={profile.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={profile.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={profile.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={profile.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <textarea
                id="bio"
                value={profile.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                disabled={!isEditing}
                className="w-full px-3 py-2 border rounded-md min-h-[80px]"
                placeholder="Tell us a bit about yourself..."
              />
            </div>

            {isEditing && (
              <Button onClick={handleSaveProfile} className="bg-blue-600 hover:bg-blue-700">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Account Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-blue-600">15</div>
            <p className="text-sm text-gray-600">Total Transactions</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-green-600">GHS 265</div>
            <p className="text-sm text-gray-600">Total Spent</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-purple-600">3</div>
            <p className="text-sm text-gray-600">Active Networks</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default ShoppingProfile;