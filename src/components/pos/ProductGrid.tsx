'use client';

import React, { useEffect, useRef } from 'react';
import { Package } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { useCart } from '@/hooks/useCart';
import Input from '@/components/ui/Input';
import { formatCurrency } from '@/lib/utils/formatters';

export default function ProductGrid() {
  const { filteredProducts, searchTerm, setSearchTerm } = useProducts();
  const { addToCart } = useCart();
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus on search input when POS view is active
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  return (
    <div className="product-grid-panel bg-bg-card border-border border-border-width rounded-lg p-spacing-lg overflow-hidden flex flex-col shadow-md">
      <div className="panel-header flex justify-between items-center mb-spacing-lg pb-spacing-md border-b-2 border-bg-primary">
        <h2 className="text-lg font-bold">Quick Select</h2>
      </div>
      <Input
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
        ref={searchInputRef}
      />
      <div className="product-grid grid grid-cols-auto-fill-160 gap-4 overflow-y-auto pr-2">
        {filteredProducts.length === 0 ? (
          <p className="text-center text-text-light col-span-full py-4">No products found</p>
        ) : (
          filteredProducts.map((product) => (
            <div
              key={product.barcode}
              className="product-card bg-white border-border border-border-width rounded-md p-4 cursor-pointer transition-all duration-300 ease-in-out text-center hover:border-primary hover:translate-y-[-4px] hover:shadow-md"
              onClick={() => addToCart(product)}
            >
              <Package size={48} className="mb-2 text-accent mx-auto" />
              <h4 className="font-semibold mb-1 text-sm">{product.name}</h4>
              <div className="price text-secondary font-bold text-lg">{formatCurrency(product.price)}</div>
              <div className="stock text-text-light text-xs mt-1">Stock: {product.stock}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

