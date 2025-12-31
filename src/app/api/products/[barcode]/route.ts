import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { Product } from '@/types';

const DATA_FILE = path.join(process.cwd(), 'data', 'products.json');

async function getProductsData(): Promise<Product[]> {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function saveProductsData(products: Product[]): Promise<void> {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(products, null, 2));
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ barcode: string }> }
) {
  const { barcode } = await params;
  const products = await getProductsData();
  const product = products.find((p) => p.barcode === barcode);

  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }

  return NextResponse.json(product);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ barcode: string }> }
) {
  const { barcode } = await params;

  const products = await getProductsData();
  const initialLength = products.length;
  const filteredProducts = products.filter((p) => p.barcode !== barcode);

  if (filteredProducts.length === initialLength) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }

  await saveProductsData(filteredProducts);
  return NextResponse.json({ success: true });
}

