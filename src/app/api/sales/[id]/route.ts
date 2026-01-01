import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { Sale } from '@/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { data, error } = await supabase
      .from('sales')
      .select(`
        *,
        sale_items (
          id,
          barcode,
          quantity,
          price,
          cost,
          products (
            barcode,
            name,
            category,
            price,
            cost,
            stock
          )
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Sale not found' }, { status: 404 });
      }
      console.error('Error fetching sale:', error);
      return NextResponse.json(
        { error: 'Failed to fetch sale' },
        { status: 500 }
      );
    }

    // Transform data to match Sale interface format
    const sale: Sale = {
      id: data.id,
      date: data.date,
      subtotal: parseFloat(data.subtotal),
      tax: parseFloat(data.tax),
      total: parseFloat(data.total),
      paymentMethod: data.payment_method,
      items: (data.sale_items || []).map((item: any) => ({
        barcode: item.barcode,
        name: item.products?.name || '',
        category: item.products?.category || '',
        price: parseFloat(item.price),
        cost: parseFloat(item.cost),
        stock: item.products?.stock || 0,
        quantity: item.quantity,
      })),
    };

    return NextResponse.json(sale);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

