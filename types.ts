export enum ViewState {
  HOME = 'HOME',
  REPAIR_LOOKUP = 'REPAIR_LOOKUP',
  EMPLOYEE_DASHBOARD = 'EMPLOYEE_DASHBOARD',
  CUSTOM_CASE = 'CUSTOM_CASE',
  ADMIN = 'ADMIN',
  CUSTOMER_ACCOUNT = 'CUSTOMER_ACCOUNT',
  LEGAL_PRIVACY = 'LEGAL_PRIVACY',
  LEGAL_TERMS = 'LEGAL_TERMS',
  LEGAL_NOTICE = 'LEGAL_NOTICE',
  LEGAL_COOKIES = 'LEGAL_COOKIES'
}

export type Language = 'EN' | 'CN' | 'ES' | 'FR' | 'DE';

export interface Product {
  id: number | string;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  image: string;
  description: string;
  isBundle?: boolean;
  compatibleModels?: string[];
  brand?: string;
  isCustom?: boolean;
  customImage?: string; // Original high-res upload
  selectedModel?: string;
}

export interface Order {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  items: Product[];
  total: number;
  status: 'Pending' | 'Paid' | 'Shipped' | 'Completed';
  paymentMethod: 'Stripe' | 'PayPal';
  date: string;
}

export type PartType = 'original' | 'compatible';

export interface RepairPart {
  name: string;
  type: PartType;
}

export interface RepairJob {
  id: string;
  customerName: string;
  device: string;
  issue: string;
  status: 'Received' | 'Diagnosing' | 'Waiting for Parts' | 'Repaired' | 'Ready for Pickup' | 'Picked Up' | 'Finished';
  progress: number;
  estimatedCompletion: string;
  price?: number;
  technician?: string;
  tiendaId?: string;
  publico?: boolean;
  telefono?: string;
  fechaEntrada?: string;
  brand?: string;
  model?: string;
  parts?: RepairPart[];
}

export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  stores: {
    [key: string]: number;
  };
}

export interface AttendanceRecord {
  date: string;
  clockIn: string;
  clockOut?: string;
  isLate?: boolean;
  latenessMinutes?: number;
  breaks?: { start: string; end?: string }[];
}

export interface Employee {
  id: string;
  name: string;
  role: 'Technician' | 'Manager' | 'Sales' | 'admin';
  pin?: string;
  store: string;
  attendanceHistory: AttendanceRecord[];
  schedule?: { start: string; end: string };
  permissions?: { canViewReports?: boolean };
}

export interface StockTransfer {
  id: string;
  itemId: string;
  itemName: string;
  fromStore: string;
  toStore: string;
  quantity: number;
  status: 'pending' | 'in_transit' | 'completed' | 'rejected';
  date: string;
  sentBy?: string;
  receivedBy?: string;
  receivedDate?: string;
  notes?: string;
}

export interface StoreConfig {
  id: string;
  name: string;
  address: string;
  isHQ: boolean;
  manager?: string;
}

export interface TransferNotification {
  id: string;
  transferId: string;
  toStore: string;
  message: string;
  read: boolean;
  timestamp: string;
}

// Customer profile stored in Firestore customers/{uid}
export interface Customer {
  uid: string;
  email: string;
  displayName: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

// Stored in Firestore customers/{uid}/addresses/{addressId}
export interface CustomerAddress {
  id: string;
  label: string;
  fullName: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

// Extends Order with customer linkage
export interface CustomerOrder extends Order {
  customerId: string;
  shippingAddressId?: string;
}

// Cart item for Firestore persistence
export interface FirestoreCartItem {
  productId: string | number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  selectedModel?: string;
  isCustom?: boolean;
  addedAt: string;
}

// Favorites
export interface CustomerFavorite {
  productId: string | number;
  addedAt: string;
}