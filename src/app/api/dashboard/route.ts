import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { DashboardStats } from '@/types';
import { calculateDashboardStats } from '@/lib/utils/calculations';

export async function GET() {
  try {
    // Get all products
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*');

    if (productsError) {
      console.error('Error fetching products:', productsError);
      return NextResponse.json(
        { error: 'Failed to fetch products' },
        { status: 500 }
      );
    }

    // Get all sales with items
    const { data: salesData, error: salesError } = await supabase
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
      .order('date', { ascending: false });

    if (salesError) {
      console.error('Error fetching sales:', salesError);
      return NextResponse.json(
        { error: 'Failed to fetch sales' },
        { status: 500 }
      );
    }

    // Transform sales data to match Sale interface format
    const sales = (salesData || []).map((sale: any) => ({
      id: sale.id,
      date: sale.date,
      subtotal: parseFloat(sale.subtotal),
      tax: parseFloat(sale.tax),
      total: parseFloat(sale.total),
      paymentMethod: sale.payment_method,
      items: (sale.sale_items || []).map((item: any) => ({
        barcode: item.barcode,
        name: item.products?.name || '',
        category: item.products?.category || '',
        price: parseFloat(item.price),
        cost: parseFloat(item.cost),
        stock: item.products?.stock || 0,
        quantity: item.quantity,
      })),
    }));

    const stats: DashboardStats = calculateDashboardStats(products || [], sales);

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

