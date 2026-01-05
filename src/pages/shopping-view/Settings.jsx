import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, Bell, Shield, Globe, User, Check, X } from "lucide-react";
import { useState } from "react";

// Custom Toggle Switch component since Switch doesn't exist
const ToggleSwitch = ({ id, checked, onCheckedChange, label, description }) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <Label htmlFor={id} className="font-medium">{label}</Label>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      <button
        id={id}
        type="button"
        onClick={() => onCheckedChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
          checked ? 'bg-blue-600' : 'bg-gray-200'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
};

function SettingsPage() {
  const [settings, setSettings] = useState({
    // Notification settings
    emailNotifications: true,
    smsNotifications: false,
    promotionEmails: true,
    lowBalanceAlerts: true,
    
    // Security settings
    twoFactorAuth: false,
    loginAlerts: true,
    
    // Preference settings
    language: "en",
    timezone: "Africa/Accra",
    currency: "GHS"
  });

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveSettings = () => {
    // Here you would typically send the settings to your backend
    console.log('Saving settings:', settings);
    // Add your save logic here
    alert('Settings saved successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your account preferences and security settings</p>
      </div>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notification Settings
          </CardTitle>
          <CardDescription>
            Control how and when you receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <ToggleSwitch
            id="emailNotifications"
            checked={settings.emailNotifications}
            onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
            label="Email Notifications"
            description="Receive important updates via email"
          />

          <ToggleSwitch
            id="smsNotifications"
            checked={settings.smsNotifications}
            onCheckedChange={(checked) => handleSettingChange('smsNotifications', checked)}
            label="SMS Notifications"
            description="Receive transaction alerts via SMS"
          />

          <ToggleSwitch
            id="promotionEmails"
            checked={settings.promotionEmails}
            onCheckedChange={(checked) => handleSettingChange('promotionEmails', checked)}
            label="Promotional Emails"
            description="Receive special offers and promotions"
          />

          <ToggleSwitch
            id="lowBalanceAlerts"
            checked={settings.lowBalanceAlerts}
            onCheckedChange={(checked) => handleSettingChange('lowBalanceAlerts', checked)}
            label="Low Balance Alerts"
            description="Get notified when your wallet balance is low"
          />
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Security Settings
          </CardTitle>
          <CardDescription>
            Enhance your account security
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <ToggleSwitch
            id="twoFactorAuth"
            checked={settings.twoFactorAuth}
            onCheckedChange={(checked) => handleSettingChange('twoFactorAuth', checked)}
            label="Two-Factor Authentication"
            description="Add an extra layer of security to your account"
          />

          <ToggleSwitch
            id="loginAlerts"
            checked={settings.loginAlerts}
            onCheckedChange={(checked) => handleSettingChange('loginAlerts', checked)}
            label="Login Alerts"
            description="Get notified of new sign-ins to your account"
          />

          {/* Password Change Section */}
          <div className="pt-4 border-t">
            <h4 className="font-medium mb-3">Password Management</h4>
            <Button variant="outline" className="w-full">
              Change Password
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Preference Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Preference Settings
          </CardTitle>
          <CardDescription>
            Customize your application experience
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="language">Language</Label>
            <Select value={settings.language} onValueChange={(value) => handleSettingChange('language', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="fr">French</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="timezone">Timezone</Label>
            <Select value={settings.timezone} onValueChange={(value) => handleSettingChange('timezone', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Africa/Accra">Accra (GMT)</SelectItem>
                <SelectItem value="Africa/Lagos">Lagos (WAT)</SelectItem>
                <SelectItem value="Europe/London">London (GMT)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <Select value={settings.currency} onValueChange={(value) => handleSettingChange('currency', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GHS">Ghana Cedi (GHS)</SelectItem>
                <SelectItem value="USD">US Dollar (USD)</SelectItem>
                <SelectItem value="EUR">Euro (EUR)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* App Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            App Settings
          </CardTitle>
          <CardDescription>
            Additional application preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <Label className="font-medium">Theme</Label>
              <p className="text-sm text-gray-600">Choose your preferred theme</p>
            </div>
            <Select defaultValue="light">
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <Label className="font-medium">Data Saving Mode</Label>
              <p className="text-sm text-gray-600">Reduce data usage</p>
            </div>
            <ToggleSwitch
              id="dataSaving"
              checked={false}
              onCheckedChange={() => {}}
              label=""
              description=""
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={() => setSettings({
          emailNotifications: true,
          smsNotifications: false,
          promotionEmails: true,
          lowBalanceAlerts: true,
          twoFactorAuth: false,
          loginAlerts: true,
          language: "en",
          timezone: "Africa/Accra",
          currency: "GHS"
        })}>
          Reset to Defaults
        </Button>
        <Button onClick={handleSaveSettings} className="bg-blue-600 hover:bg-blue-700">
          <Save className="w-4 h-4 mr-2" />
          Save Settings
        </Button>
      </div>
    </div>
  );
}

export default SettingsPage;