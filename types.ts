
export enum UserRole {
  ADMIN = 'ADMIN',
  CASHIER = 'CAJERO',
  WAITER = 'MESERO',
  KITCHEN = 'COCINA',
  INVENTORY = 'BODEGA' // New Role
}

export enum OrderStatus {
  PENDING = 'PENDIENTE', // Enviado a cocina
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
  PURCHASE = 'COMPRA',      // Entrada por proveedor
  SALE = 'VENTA',           // Salida por receta (automático)
  WASTE = 'MERMA',          // Salida por desperdicio/daño
  ADJUSTMENT = 'AJUSTE',    // Ajuste de inventario físico
  TRANSFER = 'TRASLADO'     // Movimiento entre bodegas
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
  systemSales: number; // Sales reported by system
  systemExpenses: number; // Expenses paid from cash drawer
  realCashCounted?: number; // What user counted
  difference?: number; // real - (initial + sales - expenses)
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
  quantity: number; // Positivo (entrada) o Negativo (salida)
  unitCost: number; // Costo en el momento de la transacción
  totalValue: number;
  date: Date;
  performedBy: string; // Usuario
  notes?: string; // "Factura #123" o "Se cayó al piso"
}

export interface Ingredient {
  id: string;
  sku: string; // Stock Keeping Unit
  name: string;
  category: string; // "Cárnicos", "Lácteos", "Secos"
  unit: 'kg' | 'lt' | 'und' | 'gr' | 'ml';
  cost: number; // Costo Promedio Ponderado
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
  taxRate: number; // 0, 0.08 (Impoconsumo), 0.19 (IVA)
  category: string; // Changed from enum to string to allow custom categories
  isAvailable: boolean;
  recipe?: { ingredientId: string; quantity: number }[]; // Link to inventory
}

// PROMOTIONS & MARKETING
export type PromoType = 'PERCENTAGE' | 'FIXED_AMOUNT' | '2x1';

export interface Promotion {
  id: string;
  name: string;
  description?: string;
  type: PromoType;
  value: number; // % for Percentage, Amount for Fixed, 0 for 2x1 (calculated logic)
  activeDays: number[]; // 0=Sun, 1=Mon, ..., 3=Wed
  targetCategory?: string; // If null, applies to all or check specific items logic
  targetProductIds?: string[]; // Specific items (e.g., only Burgers)
  isActive: boolean;
}

// Operations
export interface Reservation {
  id: string;
  customerName: string;
  customerPhone?: string;
  date: Date;
  time: string; // "20:00"
  pax: number;
  tableId?: string; // Optional assignment
  status: 'CONFIRMED' | 'SEATED' | 'CANCELLED' | 'COMPLETED';
  notes?: string;
  preOrderDetails?: string; // Platos pre-ordenados o requerimientos especiales
}

export interface Table {
  id: string;
  label: string; // "Mesa 1", "Barra 2"
  capacity: number;
  status: TableStatus;
  currentOrderId?: string;
  reservationInfo?: { // For display on the map
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
  notes?: string; // "Sin cebolla", "Término medio"
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
  discount: number; // Total discount applied
  appliedPromoId?: string; // Track which promo was used
  tax: number;
  tip: number; // Propina voluntaria
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
  permissions: PermissionCode[]; // Granular permissions
  avatarUrl?: string;
}

export interface RestaurantSettings {
  name: string;
  nit: string;
  address: string;
  phone: string;
  currencySymbol: string;
  taxName: string; // "Impoconsumo" or "IVA"
  taxRate: number; // 0.08
  tipRate: number; // 0.10
  wifiSSID?: string;
  wifiPass?: string;
  printerIp?: string;
  invoiceResolution?: string;
  invoicePrefix?: string;
  currentInvoiceNumber: number;
}
