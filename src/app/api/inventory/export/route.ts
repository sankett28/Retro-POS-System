import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { Product } from '@/types';

const PRODUCTS_DATA_FILE = path.join(process.cwd(), 'data', 'products.json');

async function getProductsData(): Promise<Product[]> {
  try {
    const data = await fs.readFile(PRODUCTS_DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export async function GET() {
  const products = await getProductsData();

  const csvHeader = ['Barcode', 'Name', 'Category', 'Price', 'Cost', 'Stock', 'Value'];
  const csvRows = products.map(p => [
    p.barcode,
    p.name,
    p.category,
    p.price.toFixed(2),
    (p.cost || 0).toFixed(2),
    p.stock,
    (p.price * p.stock).toFixed(2)
  ].join(','));

  const csv = [csvHeader.join(','), ...csvRows].join('\n');

  return new NextResponse(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="inventory_${new Date().toISOString().split('T')[0]}.csv"`,
    },
  });
}

