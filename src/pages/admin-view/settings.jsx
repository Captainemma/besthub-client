import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, Settings, Package, Shield, Bell, Globe, Wifi, Zap, Clock, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { API_BASE_URL } from '../../config'; 

// Custom Toggle Switch component
const ToggleSwitch = ({ id, checked, onCheckedChange, label, description, disabled = false }) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <Label htmlFor={id} className="font-medium">{label}</Label>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      <button
        id={id}
        type="button"
        disabled={disabled}
        onClick={() => onCheckedChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
          checked ? 'bg-blue-600' : 'bg-gray-200'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
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

function AdminSettings() {
  const [settings, setSettings] = useState({
    // Product Availability
    mtnAvailable: true,
    telecelAvailable: true,
    atAvailable: true,
    
    // System Settings
    maintenanceMode: false,
    newRegistrations: true,
    autoApproveAgents: false,
    
    // Notification Settings
    emailNotifications: true,
    lowBalanceAlerts: true,
    systemAlerts: true,
    
    // Commission Settings
    agentCommission: 10,
    wholesalerCommission: 15,
    
    // Limits
    minTopupAmount: 5,
    maxTopupAmount: 5000,
    dailyUserLimit: 1000
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  // Fetch current settings from API
  const fetchSettings = async () => {
    try {
      setLoading(true);
      console.log('🔄 Fetching system settings...');
      
      const response = await fetch(`${API_BASE_URL}/admin/settings`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch settings`);
      }

      const result = await response.json();
      console.log('📡 Settings API Response:', result);
      
      if (result.success && result.data) {
        console.log('✅ Settings loaded successfully');
        setSettings(prev => ({
          ...prev,
          ...result.data
        }));
      } else {
        throw new Error(result.message || 'Failed to fetch settings');
      }
    } catch (error) {
      console.error('❌ Fetch settings error:', error);
      toast({
        title: "Error",
        description: "Failed to load settings: " + error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Save settings to API
  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      console.log('💾 Saving system settings:', settings);
      
      const response = await fetch(`${API_BASE_URL}/admin/settings`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(settings)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to save settings`);
      }

      const result = await response.json();
      console.log('📡 Save Settings Response:', result);
      
      if (result.success) {
        toast({
          title: "Success",
          description: "System settings updated successfully!",
          variant: "default",
        });
        
        // Apply settings immediately
        if (settings.maintenanceMode) {
          toast({
            title: "Maintenance Mode Activated",
            description: "System is now in maintenance mode",
            variant: "default",
          });
        }
        
        // Handle product availability changes
        const disabledNetworks = [];
        if (!settings.mtnAvailable) disabledNetworks.push('MTN');
        if (!settings.telecelAvailable) disabledNetworks.push('Telecel');
        if (!settings.atAvailable) disabledNetworks.push('AirtelTigo');
        
        if (disabledNetworks.length > 0) {
          toast({
            title: "Product Availability Updated",
            description: `${disabledNetworks.join(', ')} data bundles are now ${disabledNetworks.length === 3 ? 'disabled' : 'unavailable'}`,
            variant: "default",
          });
        }
      } else {
        throw new Error(result.message || 'Failed to save settings');
      }
    } catch (error) {
      console.error('❌ Save settings error:', error);
      toast({
        title: "Error",
        description: "Failed to save settings: " + error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  // Apply product availability settings immediately
  const applyProductAvailability = async (network, available) => {
    try {
      console.log(`🔄 ${available ? 'Enabling' : 'Disabling'} ${network} data bundles`);
      
      // You can add API call here to immediately apply product availability
      // For now, we'll just show a toast notification
      toast({
        title: `${network} ${available ? 'Enabled' : 'Disabled'}`,
        description: `${network} data bundles are now ${available ? 'available' : 'unavailable'} for purchase`,
        variant: "default",
      });
    } catch (error) {
      console.error('❌ Apply product availability error:', error);
    }
  };

  const handleSettingChange = (key, value) => {
    const oldValue = settings[key];
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));

    // Apply product availability changes immediately
    if (key === 'mtnAvailable' && oldValue !== value) {
      applyProductAvailability('MTN', value);
    }
    if (key === 'telecelAvailable' && oldValue !== value) {
      applyProductAvailability('Telecel', value);
    }
    if (key === 'atAvailable' && oldValue !== value) {
      applyProductAvailability('AirtelTigo', value);
    }

    // Show maintenance mode notification
    if (key === 'maintenanceMode' && oldValue !== value) {
      if (value) {
        toast({
          title: "Maintenance Mode Enabled",
          description: "System is now in maintenance mode. Users will see a maintenance message.",
          variant: "default",
        });
      } else {
        toast({
          title: "Maintenance Mode Disabled",
          description: "System is now back online.",
          variant: "default",
        });
      }
    }
  };

  // Reset to default settings
  const handleResetToDefaults = async () => {
    const defaultSettings = {
      mtnAvailable: true,
      telecelAvailable: true,
      atAvailable: true,
      maintenanceMode: false,
      newRegistrations: true,
      autoApproveAgents: false,
      emailNotifications: true,
      lowBalanceAlerts: true,
      systemAlerts: true,
      agentCommission: 10,
      wholesalerCommission: 15,
      minTopupAmount: 5,
      maxTopupAmount: 5000,
      dailyUserLimit: 1000
    };

    setSettings(defaultSettings);
    
    toast({
      title: "Settings Reset",
      description: "All settings have been reset to default values",
      variant: "default",
    });
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
          <p className="text-gray-600">Loading system settings...</p>
        </div>
        <div className="grid grid-cols-1 gap-6">
          {[...Array(5)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-32 animate-pulse mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[...Array(3)].map((_, j) => (
                    <div key={j} className="flex items-center justify-between">
                      <div>
                        <div className="h-5 bg-gray-200 rounded w-40 animate-pulse mb-1"></div>
                        <div className="h-4 bg-gray-200 rounded w-60 animate-pulse"></div>
                      </div>
                      <div className="w-11 h-6 bg-gray-200 rounded-full animate-pulse"></div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
          <p className="text-gray-600">Configure system-wide settings and product availability</p>
        </div>
        <Button onClick={fetchSettings} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Product Availability */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Product Availability
          </CardTitle>
          <CardDescription>
            Control which data bundles are available for purchase
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <ToggleSwitch
            id="mtnAvailable"
            checked={settings.mtnAvailable}
            onCheckedChange={(checked) => handleSettingChange('mtnAvailable', checked)}
            label="MTN Data Bundles"
            description="Enable or disable MTN data bundle sales"
          />

          <ToggleSwitch
            id="telecelAvailable"
            checked={settings.telecelAvailable}
            onCheckedChange={(checked) => handleSettingChange('telecelAvailable', checked)}
            label="Telecel Data Bundles"
            description="Enable or disable Telecel data bundle sales"
          />

          <ToggleSwitch
            id="atAvailable"
            checked={settings.atAvailable}
            onCheckedChange={(checked) => handleSettingChange('atAvailable', checked)}
            label="AirtelTigo Data Bundles"
            description="Enable or disable AirtelTigo data bundle sales"
          />
        </CardContent>
      </Card>

      {/* System Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            System Configuration
          </CardTitle>
          <CardDescription>
            General system settings and preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <ToggleSwitch
            id="maintenanceMode"
            checked={settings.maintenanceMode}
            onCheckedChange={(checked) => handleSettingChange('maintenanceMode', checked)}
            label="Maintenance Mode"
            description="Put the system in maintenance mode"
          />

          <ToggleSwitch
            id="newRegistrations"
            checked={settings.newRegistrations}
            onCheckedChange={(checked) => handleSettingChange('newRegistrations', checked)}
            label="Allow New Registrations"
            description="Allow new users to register accounts"
          />

          <ToggleSwitch
            id="autoApproveAgents"
            checked={settings.autoApproveAgents}
            onCheckedChange={(checked) => handleSettingChange('autoApproveAgents', checked)}
            label="Auto-approve Agent Applications"
            description="Automatically approve new agent registrations"
          />
        </CardContent>
      </Card>

      {/* Commission Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>💰</span>
            Commission Settings
          </CardTitle>
          <CardDescription>
            Set commission rates for agents and wholesalers
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="agentCommission">Agent Commission (%)</Label>
              <Input
                id="agentCommission"
                type="number"
                min="0"
                max="50"
                value={settings.agentCommission}
                onChange={(e) => handleSettingChange('agentCommission', parseFloat(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="wholesalerCommission">Wholesaler Commission (%)</Label>
              <Input
                id="wholesalerCommission"
                type="number"
                min="0"
                max="50"
                value={settings.wholesalerCommission}
                onChange={(e) => handleSettingChange('wholesalerCommission', parseFloat(e.target.value))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transaction Limits */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Transaction Limits
          </CardTitle>
          <CardDescription>
            Set limits for wallet transactions and daily usage
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="minTopupAmount">Minimum Top-up (GHS)</Label>
              <Input
                id="minTopupAmount"
                type="number"
                min="1"
                value={settings.minTopupAmount}
                onChange={(e) => handleSettingChange('minTopupAmount', parseFloat(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="maxTopupAmount">Maximum Top-up (GHS)</Label>
              <Input
                id="maxTopupAmount"
                type="number"
                min="100"
                value={settings.maxTopupAmount}
                onChange={(e) => handleSettingChange('maxTopupAmount', parseFloat(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="dailyUserLimit">Daily User Limit (GHS)</Label>
              <Input
                id="dailyUserLimit"
                type="number"
                min="100"
                value={settings.dailyUserLimit}
                onChange={(e) => handleSettingChange('dailyUserLimit', parseFloat(e.target.value))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notification Settings
          </CardTitle>
          <CardDescription>
            Configure system notification preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <ToggleSwitch
            id="emailNotifications"
            checked={settings.emailNotifications}
            onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
            label="Email Notifications"
            description="Receive system notifications via email"
          />

          <ToggleSwitch
            id="lowBalanceAlerts"
            checked={settings.lowBalanceAlerts}
            onCheckedChange={(checked) => handleSettingChange('lowBalanceAlerts', checked)}
            label="Low Balance Alerts"
            description="Get alerts when system wallet balance is low"
          />

          <ToggleSwitch
            id="systemAlerts"
            checked={settings.systemAlerts}
            onCheckedChange={(checked) => handleSettingChange('systemAlerts', checked)}
            label="System Alerts"
            description="Receive critical system alerts"
          />
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={handleResetToDefaults}>
          Reset to Defaults
        </Button>
        <Button onClick={handleSaveSettings} className="bg-blue-600 hover:bg-blue-700" disabled={saving}>
          {saving ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save All Settings
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

export default AdminSettings;