export enum ViewState {
  HOME = 'HOME',
  SHOP = 'SHOP',
  REPAIR_LOOKUP = 'REPAIR_LOOKUP',
  EMPLOYEE_LOGIN = 'EMPLOYEE_LOGIN',
  EMPLOYEE_DASHBOARD = 'EMPLOYEE_DASHBOARD',
  CUSTOM_CASE = 'CUSTOM_CASE'
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
  status: 'pending' | 'completed';
  date: string;
}