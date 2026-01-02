import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { Sale } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    let query = supabase
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

    if (startDate) {
      query = query.gte('date', startDate);
    }
    if (endDate) {
      query = query.lte('date', endDate);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching sales:', error);
      return NextResponse.json(
        { error: 'Failed to fetch sales' },
        { status: 500 }
      );
    }

    // Transform data to match Sale interface format
    const sales: Sale[] = (data || []).map((sale: any) => ({
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

    return NextResponse.json(sales);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const sale: Sale = await request.json();

    // Start a transaction-like operation
    // First, create the sale record
    const { data: saleData, error: saleError } = await supabase
      .from('sales')
      .insert([
        {
          id: sale.id,
          date: sale.date,
          subtotal: sale.subtotal,
          tax: sale.tax,
          total: sale.total,
          payment_method: sale.paymentMethod,
        },
      ])
      .select()
      .single();

    if (saleError) {
      console.error('Error creating sale:', saleError);
      return NextResponse.json(
        { error: 'Failed to create sale' },
        { status: 500 }
      );
    }

    // Create sale_items records
    const saleItems = sale.items.map((item) => ({
      sale_id: sale.id,
      barcode: item.barcode,
      quantity: item.quantity,
      price: item.price,
      cost: item.cost,
    }));

    const { error: itemsError } = await supabase
      .from('sale_items')
      .insert(saleItems);

    if (itemsError) {
      console.error('Error creating sale items:', itemsError);
      // Try to clean up the sale record
      await supabase.from('sales').delete().eq('id', sale.id);
      return NextResponse.json(
        { error: 'Failed to create sale items' },
        { status: 500 }
      );
    }

    // Update product stock levels
    for (const item of sale.items) {
      // Get current stock
      const { data: product, error: fetchError } = await supabase
        .from('products')
        .select('stock')
        .eq('barcode', item.barcode)
        .single();

      if (fetchError || !product) {
        console.error(`Error fetching product ${item.barcode} for stock update:`, fetchError);
        continue; // Skip this product but continue with others
      }

      const newStock = Math.max(0, product.stock - item.quantity);
      const { error: updateError } = await supabase
        .from('products')
        .update({ stock: newStock })
        .eq('barcode', item.barcode);

      if (updateError) {
        console.error(`Error updating stock for product ${item.barcode}:`, updateError);
        // Continue with other products even if one fails
      }
    }

    return NextResponse.json(sale, { status: 201 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

