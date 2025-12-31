import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { Sale } from '@/types';

const DATA_FILE = path.join(process.cwd(), 'data', 'sales.json');

async function getSalesData(): Promise<Sale[]> {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const sales = await getSalesData();
  const sale = sales.find((s) => s.id === id);

  if (!sale) {
    return NextResponse.json({ error: 'Sale not found' }, { status: 404 });
  }

  return NextResponse.json(sale);
}

