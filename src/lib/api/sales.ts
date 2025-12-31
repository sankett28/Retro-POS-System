import { apiFetch } from './client';
import { Sale } from '@/types';

export async function getSales(startDate?: string, endDate?: string): Promise<Sale[]> {
  const params = new URLSearchParams();
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);
  return apiFetch<Sale[]>(`/api/sales?${params.toString()}`);
}

export async function getSale(id: string): Promise<Sale> {
  return apiFetch<Sale>(`/api/sales/${id}`);
}

export async function createSale(sale: Sale): Promise<Sale> {
  return apiFetch<Sale>('/api/sales', { method: 'POST', body: sale });
}

