import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function GET() {
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching products:', error);
      return NextResponse.json(
        { error: 'Failed to fetch products' },
        { status: 500 }
      );
    }

    const csvHeader = ['Barcode', 'Name', 'Category', 'Price', 'Cost', 'Stock', 'Value'];
    const csvRows = (products || []).map(p => [
      p.barcode,
      p.name,
      p.category,
      parseFloat(p.price).toFixed(2),
      (parseFloat(p.cost) || 0).toFixed(2),
      p.stock,
      (parseFloat(p.price) * p.stock).toFixed(2)
    ].join(','));

    const csv = [csvHeader.join(','), ...csvRows].join('\n');

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="inventory_${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

