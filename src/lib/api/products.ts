import { apiFetch } from './client';
import { Product } from '@/types';

export async function getProducts(): Promise<Product[]> {
  return apiFetch<Product[]>('/api/products');
}

export async function getProduct(barcode: string): Promise<Product> {
  return apiFetch<Product>(`/api/products/${barcode}`);
}

export async function createProduct(product: Product): Promise<Product> {
  return apiFetch<Product>('/api/products', { method: 'POST', body: product });
}

export async function updateProduct(product: Product): Promise<Product> {
  return apiFetch<Product>('/api/products', { method: 'PUT', body: product });
}

export async function deleteProduct(barcode: string): Promise<void> {
  return apiFetch<void>(`/api/products/${barcode}`, { method: 'DELETE' });
}

