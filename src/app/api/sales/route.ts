import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { Sale, Product } from '@/types';

const SALES_DATA_FILE = path.join(process.cwd(), 'data', 'sales.json');
const PRODUCTS_DATA_FILE = path.join(process.cwd(), 'data', 'products.json');

async function getSalesData(): Promise<Sale[]> {
  try {
    const data = await fs.readFile(SALES_DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function saveSalesData(sales: Sale[]): Promise<void> {
  await fs.mkdir(path.dirname(SALES_DATA_FILE), { recursive: true });
  await fs.writeFile(SALES_DATA_FILE, JSON.stringify(sales, null, 2));
}

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

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');
  
  let sales = await getSalesData();
  
  if (startDate && endDate) {
    sales = sales.filter((sale) => {
      const saleDate = new Date(sale.date).toISOString().split('T')[0];
      return saleDate >= startDate && saleDate <= endDate;
    });
  }
  
  return NextResponse.json(sales);
}

export async function POST(request: NextRequest) {
  const sale: Sale = await request.json();
  const sales = await getSalesData();
  sales.push(sale);
  await saveSalesData(sales);
  
  // Update product stock
  const products = await getProductsData();
  
  sale.items.forEach((item) => {
    const product = products.find((p: Product) => p.barcode === item.barcode);
    if (product) {
      product.stock -= item.quantity;
    }
  });
  
  await saveProductsData(products);
  
  return NextResponse.json(sale, { status: 201 });
}

