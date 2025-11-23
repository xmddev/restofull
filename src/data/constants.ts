
import { Category, DailyStat, Ingredient, MenuItem, Order, OrderStatus, Supplier, Table, TableStatus, TransactionType, InventoryTransaction, Reservation, Expense, User, UserRole, RestaurantSettings, PermissionCode, Promotion } from "../types";

// --- 1. SUPPLIERS ---
export const INITIAL_SUPPLIERS: Supplier[] = [
  { id: 'sup-1', name: 'Distribuidora El Granero', contactName: 'Carlos Ruiz', phone: '3001234567', email: 'ventas@elgranero.com' },
  { id: 'sup-2', name: 'Carnes Premium SAS', contactName: 'Ana Torres', phone: '3109876543', email: 'ana@carnespremium.com' },
  { id: 'sup-3', name: 'Lácteos del Valle', contactName: 'Jorge Perez', phone: '3154567890', email: 'pedidos@lacteosvalle.com' }
];

// --- 2. INGREDIENTS ---
export const INITIAL_INGREDIENTS: Ingredient[] = [
  { id: 'ing-1', sku: 'PRD-CAR-01', name: 'Carne Burger (Pack 150g)', category: 'Producción', unit: 'und', cost: 5800, currentStock: 85, minStock: 20, maxStock: 200, supplierId: 'sup-2', lastUpdated: new Date() },
  { id: 'ing-2', sku: 'PRD-LAC-01', name: 'Queso Paipa (Lonja 30g)', category: 'Producción', unit: 'und', cost: 800, currentStock: 150, minStock: 40, maxStock: 500, supplierId: 'sup-3', lastUpdated: new Date() },
  { id: 'ing-3', sku: 'VER-TOM-01', name: 'Tomate (Rodaja)', category: 'Fruver', unit: 'und', cost: 150, currentStock: 200, minStock: 50, maxStock: 500, supplierId: 'sup-1', lastUpdated: new Date() },
  { id: 'ing-4', sku: 'PAN-001', name: 'Pan Brioche Artesanal', category: 'Panadería', unit: 'und', cost: 1200, currentStock: 45, minStock: 24, maxStock: 100, supplierId: 'sup-1', lastUpdated: new Date() },
  { id: 'ing-5', sku: 'LIC-001', name: 'Ron Añejo (Botella 750ml)', category: 'Licores', unit: 'und', cost: 65000, currentStock: 4, minStock: 2, maxStock: 12, supplierId: 'sup-1', lastUpdated: new Date() },
  { id: 'ing-6', sku: 'PRD-SAL-01', name: 'Salsa Casa (Bolsa 200g)', category: 'Salsas', unit: 'und', cost: 2500, currentStock: 30, minStock: 10, maxStock: 60, supplierId: 'sup-1', lastUpdated: new Date() },
  { id: 'ing-7', sku: 'PRD-POS-01', name: 'Base Volcán Chocolate', category: 'Producción', unit: 'und', cost: 4500, currentStock: 15, minStock: 5, maxStock: 40, supplierId: 'sup-1', lastUpdated: new Date() }
];

// --- 3. TRANSACTIONS ---
export const INITIAL_TRANSACTIONS: InventoryTransaction[] = [
  { id: 'tx-1', ingredientId: 'ing-1', type: TransactionType.PURCHASE, quantity: 100, unitCost: 5800, totalValue: 580000, date: new Date(Date.now() - 86400000 * 2), performedBy: 'Admin', notes: 'Producción Semanal' },
  { id: 'tx-2', ingredientId: 'ing-1', type: TransactionType.SALE, quantity: -2, unitCost: 5800, totalValue: 11600, date: new Date(Date.now() - 3600000), performedBy: 'System', notes: 'Venta Mesa 1' }
];

// --- 4. MENU ---
export const INITIAL_MENU: MenuItem[] = [
  { id: 'p-1', name: 'Hamburguesa Artesanal', description: '200g de carne angus, queso paipa, tocineta y vegetales frescos en pan brioche.', price: 32000, taxRate: 0.08, category: Category.MAIN, isAvailable: true, 
    recipe: [
      { ingredientId: 'ing-1', quantity: 1 }, 
      { ingredientId: 'ing-4', quantity: 1 }, 
      { ingredientId: 'ing-2', quantity: 2 }  
    ] 
  },
  { id: 'p-2', name: 'Pasta Carbonara', description: 'Auténtica receta italiana con guanciale, pecorino y yema de huevo.', price: 28000, taxRate: 0.08, category: Category.MAIN, isAvailable: true },
  { id: 'p-3', name: 'Carpaccio de Res', description: 'Finas láminas de lomo con alcaparras, parmesano y rúcula.', price: 24000, taxRate: 0.08, category: Category.STARTER, isAvailable: true },
  { id: 'p-4', name: 'Limonada de Coco', description: 'Bebida refrescante con leche de coco natural.', price: 12000, taxRate: 0.08, category: Category.DRINK, isAvailable: true },
  { id: 'p-5', name: 'Volcán de Chocolate', description: 'Bizcocho de chocolate caliente con centro líquido, acompañado de helado.', price: 18000, taxRate: 0.08, category: Category.DESSERT, isAvailable: true,
    recipe: [
      { ingredientId: 'ing-7', quantity: 1 } 
    ]
  },
  { id: 'p-6', name: 'Mojito Clásico', description: 'Ron blanco, hierbabuena fresca, limón y soda.', price: 22000, taxRate: 0.08, category: Category.DRINK, isAvailable: true },
  { id: 'p-7', name: 'Churrasco Argentino', description: '300g de corte mariposa a la parrilla con chimichurri.', price: 45000, taxRate: 0.08, category: Category.MAIN, isAvailable: true }
];

// --- 5. TABLES ---
export const INITIAL_TABLES: Table[] = [
  { id: 't1', label: 'Mesa 1', capacity: 4, status: TableStatus.OCCUPIED, currentOrderId: 'ord-1' },
  { id: 't2', label: 'Mesa 2', capacity: 2, status: TableStatus.AVAILABLE },
  { id: 't3', label: 'Mesa 3', capacity: 6, status: TableStatus.RESERVED, reservationInfo: { name: 'Fam. Rodriguez', time: '20:00', pax: 5 } },
  { id: 't4', label: 'Mesa 4', capacity: 4, status: TableStatus.PAYMENT_PENDING, currentOrderId: 'ord-2' },
  { id: 't5', label: 'Barra 1', capacity: 2, status: TableStatus.AVAILABLE },
  { id: 't6', label: 'Barra 2', capacity: 2, status: TableStatus.AVAILABLE },
];

// --- 6. ORDERS ---
export const INITIAL_ORDERS: Order[] = [
  { 
    id: 'ord-1', tenantId: 'rest-1', tableId: 't1', waiterId: 'usr-2', 
    items: [
      { menuItemId: 'p-1', name: 'Hamburguesa Artesanal', quantity: 2, price: 32000, notes: 'Sin cebolla una' },
      { menuItemId: 'p-4', name: 'Limonada de Coco', quantity: 2, price: 12000 }
    ],
    status: OrderStatus.COOKING, createdAt: new Date(Date.now() - 1800000), 
    subtotal: 88000, discount: 0, tax: 7040, tip: 8800, total: 103840 
  },
  { 
    id: 'ord-2', tenantId: 'rest-1', tableId: 't4', waiterId: 'usr-2', 
    items: [
      { menuItemId: 'p-2', name: 'Pasta Carbonara', quantity: 1, price: 28000 },
      { menuItemId: 'p-3', name: 'Carpaccio de Res', quantity: 1, price: 24000 }
    ],
    status: OrderStatus.DELIVERED, createdAt: new Date(Date.now() - 3600000), 
    subtotal: 52000, discount: 0, tax: 4160, tip: 5000, total: 61160
  }
];

// --- 7. RESERVATIONS ---
export const INITIAL_RESERVATIONS: Reservation[] = [
    { id: 'res-1', customerName: 'Juan Perez', customerPhone: '3001234567', date: new Date(), time: '19:30', pax: 4, status: 'CONFIRMED', notes: 'Aniversario' },
    { id: 'res-2', customerName: 'Maria Gomez', customerPhone: '3109876543', date: new Date(), time: '20:00', pax: 2, status: 'CONFIRMED', tableId: 't3', preOrderDetails: '1x Vino Tinto Reserva, Alergia al maní' }
];

// --- 8. EXPENSES ---
export const INITIAL_EXPENSES: Expense[] = [
    { id: 'exp-1', description: 'Pago Recibo Luz', amount: 450000, category: 'SERVICES', date: new Date(Date.now() - 86400000 * 5), registeredBy: 'Admin', paymentMethod: 'TRANSFER' },
    { id: 'exp-2', description: 'Compra Hielo Extra', amount: 25000, category: 'OTHER', date: new Date(Date.now() - 86400000), registeredBy: 'Cajero', paymentMethod: 'CASH' },
    { id: 'exp-3', description: 'Mantenimiento Nevera', amount: 120000, category: 'MAINTENANCE', date: new Date(Date.now() - 86400000 * 10), registeredBy: 'Admin', paymentMethod: 'TRANSFER' }
];

// --- 9. DASHBOARD STATS ---
export const MOCK_SALES_DATA: DailyStat[] = [
    { name: 'Lun', sales: 1200000, orders: 24 },
    { name: 'Mar', sales: 1450000, orders: 30 },
    { name: 'Mie', sales: 1100000, orders: 22 },
    { name: 'Jue', sales: 1800000, orders: 35 },
    { name: 'Vie', sales: 2500000, orders: 48 },
    { name: 'Sab', sales: 3200000, orders: 60 },
    { name: 'Dom', sales: 2900000, orders: 55 },
];

// --- 10. SETTINGS & USERS ---

export const INITIAL_SETTINGS: RestaurantSettings = {
    name: "La Parrilla de Don José",
    nit: "900.123.456-7",
    address: "Calle 93 # 11-20, Bogotá",
    phone: "(601) 234-5678",
    currencySymbol: "$",
    taxName: "Impoconsumo",
    taxRate: 8,
    tipRate: 10,
    wifiSSID: "Cliente_LaParrilla",
    wifiPass: "parrilla123",
    currentInvoiceNumber: 1045
};

export const AVAILABLE_PERMISSIONS: {code: PermissionCode, label: string, category: string}[] = [
    { code: 'VIEW_DASHBOARD', label: 'Ver Panel Principal', category: 'General' },
    { code: 'MANAGE_MENU', label: 'Editar Menú', category: 'Administración' },
    { code: 'MANAGE_INVENTORY', label: 'Gestionar Inventario', category: 'Inventario' },
    { code: 'VIEW_COSTS', label: 'Ver Costos y Gastos', category: 'Finanzas' },
    { code: 'TAKE_ORDERS', label: 'Tomar Pedidos (Mesas)', category: 'Operación' },
    { code: 'PROCESS_PAYMENTS', label: 'Cobrar / Facturar', category: 'Operación' },
    { code: 'MANAGE_USERS', label: 'Gestionar Usuarios', category: 'Seguridad' },
    { code: 'MANAGE_SETTINGS', label: 'Configuración Global', category: 'Seguridad' },
    { code: 'VOID_INVOICE', label: 'Anular Facturas', category: 'Finanzas' }
];

export const INITIAL_USERS: User[] = [
    { 
        id: 'usr-1', name: 'Carlos Dueño', email: 'admin@restoflow.com', role: UserRole.ADMIN, active: true, 
        permissions: ['VIEW_DASHBOARD', 'MANAGE_MENU', 'MANAGE_INVENTORY', 'VIEW_COSTS', 'TAKE_ORDERS', 'PROCESS_PAYMENTS', 'MANAGE_USERS', 'MANAGE_SETTINGS', 'VOID_INVOICE'] 
    },
    { 
        id: 'usr-2', name: 'Juan Mesero', email: 'juan@restoflow.com', role: UserRole.WAITER, active: true, 
        permissions: ['TAKE_ORDERS'] 
    },
    { 
        id: 'usr-3', name: 'Ana Cajera', email: 'ana@restoflow.com', role: UserRole.CASHIER, active: true, 
        permissions: ['PROCESS_PAYMENTS', 'VOID_INVOICE'] 
    },
    {
        id: 'usr-4', name: 'Pedro Chef', email: 'chef@restoflow.com', role: UserRole.KITCHEN, active: true,
        permissions: []
    }
];

// --- 11. PROMOTIONS ---
export const INITIAL_PROMOTIONS: Promotion[] = [
    {
        id: 'promo-1',
        name: 'Miércoles 2x1 Hamburguesas',
        description: 'Compra una hamburguesa y la segunda es gratis.',
        type: '2x1',
        value: 0, 
        activeDays: [3], 
        targetProductIds: ['p-1'], 
        isActive: true
    },
    {
        id: 'promo-2',
        name: 'Happy Hour Cocteles 20%',
        description: '20% de descuento en todas las bebidas.',
        type: 'PERCENTAGE',
        value: 20,
        activeDays: [4, 5, 6], 
        targetCategory: 'Bebidas',
        isActive: true
    }
];
