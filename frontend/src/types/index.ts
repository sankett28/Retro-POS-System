export interface Product {
  barcode: string;
  name: string;
  category: string;
  price: number;
  cost: number;
  stock: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Sale {
  id: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: 'cash' | 'card' | 'digital';
}

export interface DashboardStats {
  revenue: number;
  profit: number;
  taxes: number;
  transactions: number;
  products: number;
  inventoryValue: number;
  lowStock: number;
  avgSale: number;
  customers: number;
}

export type ViewType = 'dashboard' | 'pos' | 'products' | 'inventory' | 'reports';
export type PaymentMethod = 'cash' | 'card' | 'digital';
export type StockAdjustmentType = 'add' | 'remove' | 'set';

