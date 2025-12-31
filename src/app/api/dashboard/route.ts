import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { Product, Sale, DashboardStats } from '@/types';
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

async function getSalesData(): Promise<Sale[]> {
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

  const stats: DashboardStats = calculateDashboardStats(products, sales);

  return NextResponse.json(stats);
}

