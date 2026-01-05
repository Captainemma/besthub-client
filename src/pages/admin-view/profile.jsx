import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Save, User, Mail, Phone, Shield, Key } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";

function AdminProfile() {
  const { user } = useSelector((state) => state.auth);
  const [profile, setProfile] = useState({
    firstName: "Admin",
    lastName: "User",
    email: user?.email || "admin@datasell.com",
    phone: "0541234567",
    username: "admin_user",
    role: "Super Administrator"
  });

  const [password, setPassword] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleInputChange = (field, value) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePasswordChange = (field, value) => {
    setPassword(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveProfile = () => {
    console.log('Saving profile:', profile);
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  const handleChangePassword = () => {
    if (password.newPassword !== password.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    console.log('Changing password');
    setIsChangingPassword(false);
    setPassword({ currentPassword: "", newPassword: "", confirmPassword: "" });
    alert('Password changed successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Profile</h1>
        <p className="text-gray-600">Manage your administrator account</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Overview */}
        <Card className="lg:col-span-1">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="relative inline-block mb-4">
                <Avatar className="w-24 h-24 mx-auto">
                  <AvatarImage src="/api/placeholder/96/96" />
                  <AvatarFallback className="text-2xl bg-gradient-to-r from-red-500 to-orange-600">
                    {user?.userName?.[0]?.toUpperCase() || "A"}
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
              <div className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm mt-2">
                <Shield className="w-3 h-3" />
                {profile.role}
              </div>
              
              <div className="mt-4 space-y-2 text-sm text-gray-600">
                <div className="flex items-center justify-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>{profile.email}</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>{profile.phone}</span>
                </div>
              </div>

              <Button 
                variant="outline" 
                className="w-full mt-6"
                onClick={() => setIsChangingPassword(true)}
              >
                <Key className="w-4 h-4 mr-2" />
                Change Password
              </Button>
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
              Update your administrator account details
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

            {isEditing && (
              <Button onClick={handleSaveProfile} className="bg-blue-600 hover:bg-blue-700">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Change Password Modal */}
      {isChangingPassword && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="w-5 h-5" />
              Change Password
            </CardTitle>
            <CardDescription>
              Update your administrator password
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                value={password.currentPassword}
                onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={password.newPassword}
                onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={password.confirmPassword}
                onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
              />
            </div>

            <div className="flex gap-4">
              <Button variant="outline" onClick={() => setIsChangingPassword(false)}>
                Cancel
              </Button>
              <Button onClick={handleChangePassword} className="bg-blue-600 hover:bg-blue-700">
                <Save className="w-4 h-4 mr-2" />
                Change Password
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Admin Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-blue-600">1,247</div>
            <p className="text-sm text-gray-600">Total Users</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-green-600">GHS 125,430</div>
            <p className="text-sm text-gray-600">Total Revenue</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-purple-600">8,943</div>
            <p className="text-sm text-gray-600">Total Transactions</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-orange-600">47</div>
            <p className="text-sm text-gray-600">Today's Orders</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default AdminProfile;