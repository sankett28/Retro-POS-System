import { CartItem, Sale, Product, DashboardStats } from '@/types';

const TAX_RATE = 0.08;

export function calculateSubtotal(cart: CartItem[]): number {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function calculateTax(subtotal: number): number {
  return subtotal * TAX_RATE;
}

export function calculateTotal(subtotal: number, tax: number): number {
  return subtotal + tax;
}

export function calculateProfit(sales: Sale[], products: Product[]): number {
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);
  const totalCost = sales.reduce((sum, sale) => {
    return (
      sum +
      sale.items.reduce((itemSum, item) => {
        const product = products.find((p) => p.barcode === item.barcode);
        const cost = product ? product.cost || 0 : 0;
        return itemSum + cost * item.quantity;
      }, 0)
    );
  }, 0);
  return totalRevenue - totalCost;
}

export function calculateDashboardStats(
  products: Product[],
  sales: Sale[]
): DashboardStats {
  const today = new Date().toISOString().split('T')[0];
  const todaySales = sales.filter((sale) => {
    const saleDate = new Date(sale.date).toISOString().split('T')[0];
    return saleDate === today;
  });

  const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);
  const totalProfit = calculateProfit(sales, products);
  const totalTaxes = sales.reduce((sum, sale) => sum + sale.tax, 0);
  const totalTransactions = todaySales.length;

  const totalProductsCount = products.length;
  const inventoryValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);
  const lowStockCount = products.filter((p) => p.stock < 10).length;
  const avgSale = sales.length > 0 ? totalRevenue / sales.length : 0;

  return {
    revenue: totalRevenue,
    profit: totalProfit,
    taxes: totalTaxes,
    transactions: totalTransactions,
    products: totalProductsCount,
    inventoryValue: inventoryValue,
    lowStock: lowStockCount,
    avgSale: avgSale,
  };
}

