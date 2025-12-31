import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { Product } from '@/types';

const DATA_FILE = path.join(process.cwd(), 'data', 'products.json');

async function getProductsData(): Promise<Product[]> {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      // Return sample data if file doesn't exist
      return [
        { barcode: '1001', name: 'Organic Coffee Beans', category: 'Beverages', price: 12.99, cost: 7.50, stock: 45 },
        { barcode: '1002', name: 'Whole Wheat Bread', category: 'Food', price: 3.49, cost: 1.80, stock: 30 },
        { barcode: '1003', name: 'Fresh Orange Juice', category: 'Beverages', price: 5.99, cost: 3.20, stock: 25 },
        { barcode: '1004', name: 'Greek Yogurt', category: 'Food', price: 4.29, cost: 2.10, stock: 40 },
        { barcode: '1005', name: 'Organic Honey', category: 'Food', price: 8.99, cost: 5.00, stock: 20 },
        { barcode: '1006', name: 'Almond Milk', category: 'Beverages', price: 4.99, cost: 2.80, stock: 35 },
        { barcode: '1007', name: 'Dark Chocolate Bar', category: 'Food', price: 3.99, cost: 2.00, stock: 50 },
        { barcode: '1008', name: 'Green Tea', category: 'Beverages', price: 6.49, cost: 3.50, stock: 28 },
        { barcode: '1009', name: 'Granola Mix', category: 'Food', price: 7.99, cost: 4.20, stock: 22 },
        { barcode: '1010', name: 'Coconut Water', category: 'Beverages', price: 2.99, cost: 1.50, stock: 60 },
        { barcode: '1011', name: 'Protein Bar', category: 'Health', price: 2.49, cost: 1.20, stock: 75 },
        { barcode: '1012', name: 'Olive Oil', category: 'Food', price: 11.99, cost: 6.80, stock: 18 }
      ];
    }
    throw error;
  }
}

async function saveProductsData(products: Product[]): Promise<void> {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(products, null, 2));
}

export async function GET() {
  const products = await getProductsData();
  return NextResponse.json(products);
}

export async function POST(request: NextRequest) {
  const product: Product = await request.json();
  const products = await getProductsData();
  
  if (products.find((p) => p.barcode === product.barcode)) {
    return NextResponse.json(
      { error: 'Product with this barcode already exists' },
      { status: 400 }
    );
  }
  
  products.push(product);
  await saveProductsData(products);
  return NextResponse.json(product, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const updatedProduct: Product = await request.json();
  const products = await getProductsData();
  const index = products.findIndex((p) => p.barcode === updatedProduct.barcode);
  
  if (index === -1) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }
  
  products[index] = updatedProduct;
  await saveProductsData(products);
  return NextResponse.json(updatedProduct);
}

