import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { Product, StockAdjustmentType } from '@/types';
import { calculateDashboardStats } from '@/lib/utils/calculations';

const PRODUCTS_DATA_FILE = path.join(process.cwd(), 'data', 'products.json');
const SALES_DATA_FILE = path.join(process.cwd(), 'data', 'sales.json');

async function getProductsData(): Promise<Product[]> {
  try {
    const data = await fs.readFile(PRODUCTS_DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function saveProductsData(products: Product[]): Promise<void> {
  await fs.mkdir(path.dirname(PRODUCTS_DATA_FILE), { recursive: true });
  await fs.writeFile(PRODUCTS_DATA_FILE, JSON.stringify(products, null, 2));
}

async function getSalesData(): Promise<any[]> {
    try {
      const data = await fs.readFile(SALES_DATA_FILE, 'utf-8');
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

export async function GET() {
  const products = await getProductsData();
  const sales = await getSalesData();
  const stats = calculateDashboardStats(products, sales); // Reuse dashboard stats for overall inventory

  return NextResponse.json({
    totalProducts: stats.products,
    totalValue: stats.inventoryValue,
    lowStock: stats.lowStock,
    totalUnits: products.reduce((sum, p) => sum + p.stock, 0),
    products: products, // Also return full product list for inventory table
  });
}

export async function PUT(request: NextRequest) {
  const { barcode, type, quantity }: { barcode: string; type: StockAdjustmentType; quantity: number } = await request.json();
  const products = await getProductsData();
  const productIndex = products.findIndex((p) => p.barcode === barcode);

  if (productIndex === -1) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }

  const product = products[productIndex];
  let newStock = product.stock;

  if (type === 'add') {
    newStock += quantity;
  } else if (type === 'remove') {
    newStock = Math.max(0, newStock - quantity);
  } else if (type === 'set') {
    newStock = quantity;
  }

  products[productIndex] = { ...product, stock: newStock };
  await saveProductsData(products);

  return NextResponse.json(products[productIndex]);
}

