import { Product, StockAdjustmentType } from '@/types';

export function validateBarcode(barcode: string): boolean {
  return /^[0-9A-Z]{4,}$/.test(barcode); // Example: at least 4 alphanumeric chars
}

export function validateProduct(product: Product): boolean {
  return (
    product.barcode !== '' &&
    product.name !== '' &&
    product.category !== '' &&
    product.price >= 0 &&
    product.cost >= 0 &&
    product.stock >= 0
  );
}

export function validateStockAdjustment(quantity: number, type: StockAdjustmentType, currentStock: number): boolean {
    if (quantity < 0) return false;
    if (type === 'remove' && quantity > currentStock) return false;
    return true;
}

