// Authentication forms
export const registerFormControls = [
  {
    name: "userName",
    label: "User Name",
    placeholder: "Enter your user name",
    componentType: "input",
    type: "text",
    required: true,
  },
  {
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
    componentType: "input",
    type: "email",
    required: true,
  },
  {
    name: "phone",
    label: "Phone Number",
    placeholder: "Enter your phone number",
    componentType: "input",
    type: "tel",
    required: true,
  },
  {
    name: "role",
    label: "Account Type",
    componentType: "select",
    options: [
      { id: "customer", label: "Customer" },
      { id: "agent", label: "Agent (Requires Approval)" },
      { id: "wholesaler", label: "Wholesaler (Requires Approval)" },
    ],
    required: true,
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    componentType: "input",
    type: "password",
    required: true,
  },
];

export const loginFormControls = [
  {
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
    componentType: "input",
    type: "email",
    required: true,
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    componentType: "input",
    type: "password",
    required: true,
  },
];

// Data Package Form Elements for Admin
export const addDataPackageFormElements = [
  {
    label: "Network",
    name: "network",
    componentType: "select",
    options: [
      { id: "mtn", label: "MTN" },
      { id: "telecel", label: "Telecel" },
      { id: "airteltigo", label: "AirtelTigo" },
    ],
    required: true,
  },
  {
    label: "Package Name",
    name: "packageName",
    componentType: "input",
    type: "text",
    placeholder: "e.g., 1GB Data Bundle",
    required: true,
  },
  {
    label: "Data Amount",
    name: "dataAmount",
    componentType: "input",
    type: "text",
    placeholder: "e.g., 1GB, 500MB, 2.5GB",
    required: true,
  },
  {
    label: "Price (GHS)",
    name: "price",
    componentType: "input",
    type: "number",
    placeholder: "Enter package price",
    required: true,
  },
  {
    label: "Description",
    name: "description",
    componentType: "textarea",
    placeholder: "Enter package description",
  },
  {
    label: "Category",
    name: "category",
    componentType: "select",
    options: [
      { id: "regular", label: "Regular" },
      { id: "sme", label: "SME" },
      { id: "corporate", label: "Corporate" },
      { id: "social", label: "Social" },
    ],
  },
];

// Header Menu for Data Selling
export const shoppingViewHeaderMenuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/shop/dashboard",
  },
  {
    id: "home",
    label: "Shop",
    path: "/shop/home",
  },
  {
    id: "mtn",
    label: "MTN Data",
    path: "/shop/listing?network=mtn",
  },
  {
    id: "telecel",
    label: "Telecel Data",
    path: "/shop/listing?network=telecel",
  },
  {
    id: "at",
    label: "AirtelTigo Data",
    path: "/shop/listing?network=airteltigo",
  },
];

// Admin sidebar menu items
export const adminSidebarMenuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: "📊",
  },
  {
    id: "users",
    label: "Users",
    path: "/admin/users",
    icon: "👥",
  },
  {
    id: "orders",
    label: "All Orders",
    path: "/admin/orders",
    icon: "📦",
  },
  {
    id: "mtn-orders",
    label: "MTN Orders",
    path: "/admin/mtn-orders",
    icon: "📱",
  },
  {
    id: "telecel-orders",
    label: "Telecel Orders",
    path: "/admin/telecel-orders",
    icon: "⚡",
  },
  {
    id: "at-orders",
    label: "AirtelTigo Orders",
    path: "/admin/at-orders",
    icon: "⏰",
  },
  {
    id: "products",
    label: "Data Packages",
    path: "/admin/products",
    icon: "📦",
  },
  {
    id: "transactions",
    label: "Transactions",
    path: "/admin/transactions",
    icon: "💳",
  },
];

// Network options mapping
export const networkOptionsMap = {
  mtn: "MTN",
  telecel: "Telecel",
  airteltigo: "AirtelTigo",
};

// Filter options for data packages
export const filterOptions = {
  network: [
    { id: "mtn", label: "MTN" },
    { id: "telecel", label: "Telecel" },
    { id: "airteltigo", label: "AirtelTigo" },
  ],
  category: [
    { id: "regular", label: "Regular" },
    { id: "sme", label: "SME" },
    { id: "corporate", label: "Corporate" },
    { id: "social", label: "Social" },
  ],
};

// Sort options for data packages
export const sortOptions = [
  { id: "price-lowtohigh", label: "Price: Low to High" },
  { id: "price-hightolow", label: "Price: High to Low" },
  { id: "data-lowtohigh", label: "Data: Low to High" },
  { id: "data-hightolow", label: "Data: High to Low" },
];

// Order status options
export const orderStatusOptions = [
  { id: "pending", label: "Pending", color: "yellow" },
  { id: "processing", label: "Processing", color: "blue" },
  { id: "completed", label: "Completed", color: "green" },
  { id: "failed", label: "Failed", color: "red" },
];

// User role options
export const userRoleOptions = [
  { id: "customer", label: "Customer" },
  { id: "agent", label: "Agent" },
  { id: "wholesaler", label: "Wholesaler" },
  { id: "admin", label: "Admin" },
];

// User status options
export const userStatusOptions = [
  { id: "active", label: "Active", color: "green" },
  { id: "pending", label: "Pending", color: "yellow" },
  { id: "suspended", label: "Suspended", color: "red" },
];

// Data package prices (for reference - users only see these)
export const dataPackagePrices = {
  mtn: [
    { dataAmount: "1GB", price: 6, packageName: "1GB Data" },
    { dataAmount: "2GB", price: 12, packageName: "2GB Data" },
    { dataAmount: "3GB", price: 17, packageName: "3GB Data" },
    { dataAmount: "5GB", price: 28, packageName: "5GB Data" },
    { dataAmount: "10GB", price: 48, packageName: "10GB Data" },
    { dataAmount: "20GB", price: 90, packageName: "20GB Data" },
  ],
  telecel: [
    { dataAmount: "1GB", price: 6, packageName: "1GB Data" },
    { dataAmount: "2GB", price: 12, packageName: "2GB Data" },
    { dataAmount: "5GB", price: 28, packageName: "5GB Data" },
    { dataAmount: "10GB", price: 48, packageName: "10GB Data" },
  ],
  airteltigo: [
    { dataAmount: "1GB", price: 6, packageName: "1GB Data" },
    { dataAmount: "3GB", price: 17, packageName: "3GB Data" },
    { dataAmount: "5GB", price: 28, packageName: "5GB Data" },
  ],
};

// ✅ This is CORRECT - has /api at the end
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4400";
export const API_BASE_URL = `${BASE_URL}/api`;

// API Endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    REGISTER: "/auth/register",
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    CHECK_AUTH: "/auth/check-auth",
  },
  // Shop endpoints
  SHOP: {
    BUNDLES: "/shop/products/bundles",
    BUNDLES_BY_NETWORK: "/shop/products/bundles/network",
    BUNDLE_DETAILS: "/shop/products/bundle",
    ORDERS: "/shop/orders",
    CREATE_ORDER: "/shop/orders/create",
    CAPTURE_PAYMENT: "/shop/orders/capture",
    USER_ORDERS: "/shop/orders/user",
  },
  // Admin endpoints
  ADMIN: {
    USERS: "/admin/users",
    USER_STATS: "/admin/users/stats",
    ORDERS: "/admin/orders",
    ORDER_STATS: "/admin/orders/stats",
    BUNDLES: "/admin/products/bundles",
    ADD_BUNDLE: "/admin/products/bundles",
    UPDATE_BUNDLE: "/admin/products/bundles",
    DELETE_BUNDLE: "/admin/products/bundles",
    TOGGLE_BUNDLE_STATUS: "/admin/products/bundles",
  },
};

// User roles constants
export const USER_ROLES = {
  ADMIN: "admin",
  CUSTOMER: "customer",
  AGENT: "agent",
  WHOLESALER: "wholesaler",
};

// Payment configuration - FIXED: Remove process.env reference
export const PAYMENT_CONFIG = {
  CURRENCY: "GHS",
  PAYSTACK_PUBLIC_KEY: "pk_test_3b5396b80e355f6bd8dbc03ee969283ad8dbf249", // You'll add your actual key here
};

// App configuration
export const APP_CONFIG = {
  APP_NAME: "Besthub Ghana",
  APP_DESCRIPTION: "Buy MTN, Telecel, and AirtelTigo data bundles instantly",
  SUPPORT_EMAIL: "support@besthubg.com",
  SUPPORT_PHONE: "+233 54 000 0000",
};

// Local storage keys
export const STORAGE_KEYS = {
  USER_DATA: "userData",
  AUTH_TOKEN: "authToken",
  CART_ITEMS: "cartItems",
  RECENT_NETWORK: "recentNetwork",
};

// Default values
export const DEFAULTS = {
  NETWORK: "mtn",
  CATEGORY: "regular",
  ROLE: "customer",
  STATUS: "active",
  PAGE_SIZE: 20,
};

export default {
  registerFormControls,
  loginFormControls,
  addDataPackageFormElements,
  shoppingViewHeaderMenuItems,
  adminSidebarMenuItems,
  networkOptionsMap,
  filterOptions,
  sortOptions,
  orderStatusOptions,
  userRoleOptions,
  userStatusOptions,
  dataPackagePrices,
  API_BASE_URL,
  API_ENDPOINTS,
  USER_ROLES,
  PAYMENT_CONFIG,
  APP_CONFIG,
  STORAGE_KEYS,
  DEFAULTS,
};