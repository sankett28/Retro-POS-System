import { apiFetch } from './client';
import { StockAdjustmentType } from '@/types';

export async function adjustStock(barcode: string, type: StockAdjustmentType, quantity: number): Promise<void> {
  return apiFetch<void>('/api/inventory', { method: 'PUT', body: { barcode, type, quantity } });
}

export async function exportInventory(): Promise<Blob> {
  const response = await fetch('/api/inventory/export');
  if (!response.ok) {
    throw new Error('Failed to export inventory');
  }
  return response.blob();
}

