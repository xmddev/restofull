
export enum UserRole {
  ADMIN = 'ADMIN',
  CASHIER = 'CAJERO',
  WAITER = 'MESERO',
  KITCHEN = 'COCINA',
  INVENTORY = 'BODEGA'
}

export enum OrderStatus {
  PENDING = 'PENDIENTE',
  COOKING = 'EN_PREPARACION',
  READY = 'LISTO_PARA_SERVIR',
  DELIVERED = 'ENTREGADO_MESA'
}

export enum TableStatus {
  AVAILABLE = 'LIBRE',
  OCCUPIED = 'OCUPADA',
  RESERVED = 'RESERVADA',
  PAYMENT_PENDING = 'POR_COBRAR'
}

export enum Category {
  STARTER = 'Entrantes',
  MAIN = 'Fuertes',
  DESSERT = 'Postres',
  DRINK = 'Bebidas'
}

export enum TransactionType {
  PURCHASE = 'COMPRA',
  SALE = 'VENTA',
  WASTE = 'MERMA',
  ADJUSTMENT = 'AJUSTE',
  TRANSFER = 'TRASLADO'
}

// Finance & Admin
export type ExpenseCategory = 'SERVICES' | 'PAYROLL' | 'MAINTENANCE' | 'RENT' | 'MARKETING' | 'OTHER';

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: ExpenseCategory;
  date: Date;
  registeredBy: string;
  paymentMethod: 'CASH' | 'TRANSFER' | 'CARD';
}

export interface CashShift {
  id: string;
  openedAt: Date;
  closedAt?: Date;
  initialCash: number;
  systemSales: number;
  systemExpenses: number;
  realCashCounted?: number;
  difference?: number;
  status: 'OPEN' | 'CLOSED';
  openedBy: string;
}

// Enterprise Inventory
export interface Supplier {
  id: string;
  name: string;
  contactName: string;
  phone: string;
  email: string;
}

export interface InventoryTransaction {
  id: string;
  ingredientId: string;
  type: TransactionType;
  quantity: number;
  unitCost: number;
  totalValue: number;
  date: Date;
  performedBy: string;
  notes?: string;
}

export interface Ingredient {
  id: string;
  sku: string;
  name: string;
  category: string;
  unit: 'kg' | 'lt' | 'und' | 'gr' | 'ml';
  cost: number;
  currentStock: number;
  minStock: number;
  maxStock: number;
  supplierId?: string;
  lastUpdated: Date;
}

// Menu
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  taxRate: number;
  category: string;
  isAvailable: boolean;
  recipe?: { ingredientId: string; quantity: number }[];
}

// PROMOTIONS & MARKETING
export type PromoType = 'PERCENTAGE' | 'FIXED_AMOUNT' | '2x1';

export interface Promotion {
  id: string;
  name: string;
  description?: string;
  type: PromoType;
  value: number;
  activeDays: number[];
  targetCategory?: string;
  targetProductIds?: string[];
  isActive: boolean;
}

// Operations
export interface Reservation {
  id: string;
  customerName: string;
  customerPhone?: string;
  date: Date;
  time: string;
  pax: number;
  tableId?: string;
  status: 'CONFIRMED' | 'SEATED' | 'CANCELLED' | 'COMPLETED';
  notes?: string;
  preOrderDetails?: string;
}

export interface Table {
  id: string;
  label: string;
  capacity: number;
  status: TableStatus;
  currentOrderId?: string;
  reservationInfo?: {
    name: string;
    time: string;
    pax: number;
  };
}

export interface OrderItem {
  menuItemId: string;
  name: string;
  quantity: number;
  price: number;
  notes?: string;
}

export interface Order {
  id: string;
  tenantId: string;
  tableId: string;
  waiterId: string;
  items: OrderItem[];
  status: OrderStatus;
  createdAt: Date;
  subtotal: number;
  discount: number;
  appliedPromoId?: string;
  tax: number;
  tip: number;
  total: number;
}

export interface DailyStat {
  name: string;
  sales: number;
  orders: number;
}

// --- NEW: SETTINGS & PERMISSIONS ---

export type PermissionCode = 
  | 'VIEW_DASHBOARD' 
  | 'MANAGE_MENU' 
  | 'MANAGE_INVENTORY' 
  | 'VIEW_COSTS' 
  | 'TAKE_ORDERS' 
  | 'PROCESS_PAYMENTS' 
  | 'MANAGE_USERS' 
  | 'MANAGE_SETTINGS'
  | 'VOID_INVOICE';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  active: boolean;
  permissions: PermissionCode[];
  avatarUrl?: string;
}

export interface RestaurantSettings {
  name: string;
  nit: string;
  address: string;
  phone: string;
  currencySymbol: string;
  taxName: string;
  taxRate: number;
  tipRate: number;
  wifiSSID?: string;
  wifiPass?: string;
  printerIp?: string;
  invoiceResolution?: string;
  invoicePrefix?: string;
  currentInvoiceNumber: number;
}
