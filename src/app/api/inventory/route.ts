import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { StockAdjustmentType } from '@/types';

export async function GET() {
  try {
    // Get all products
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .order('name');

    if (productsError) {
      console.error('Error fetching products:', productsError);
      return NextResponse.json(
        { error: 'Failed to fetch products' },
        { status: 500 }
      );
    }

    // Calculate inventory stats
    const totalProducts = products?.length || 0;
    const totalValue = products?.reduce((sum, p) => sum + (p.stock * p.cost), 0) || 0;
    const lowStock = products?.filter((p) => p.stock < 20).length || 0;
    const totalUnits = products?.reduce((sum, p) => sum + p.stock, 0) || 0;

    return NextResponse.json({
      totalProducts,
      totalValue,
      lowStock,
      totalUnits,
      products: products || [],
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { barcode, type, quantity }: { barcode: string; type: StockAdjustmentType; quantity: number } = await request.json();

    // Get current product
    const { data: product, error: fetchError } = await supabase
      .from('products')
      .select('*')
      .eq('barcode', barcode)
      .single();

    if (fetchError || !product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Calculate new stock
    let newStock = product.stock;
    if (type === 'add') {
      newStock += quantity;
    } else if (type === 'remove') {
      newStock = Math.max(0, newStock - quantity);
    } else if (type === 'set') {
      newStock = quantity;
    }

    // Update product stock
    const { data: updatedProduct, error: updateError } = await supabase
      .from('products')
      .update({ stock: newStock })
      .eq('barcode', barcode)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating stock:', updateError);
      return NextResponse.json(
        { error: 'Failed to update stock' },
        { status: 500 }
      );
    }

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

