'use client';

import React, { useEffect, useRef } from 'react';
import { Package } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { useCart } from '@/hooks/useCart';
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
    <div className="product-grid-panel">
      <div className="panel-header">
        <h2>Quick Select</h2>
        <input
          type="text"
          className="search-input"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          ref={searchInputRef}
        />
      </div>
      <div className="product-grid" id="product-grid">
        {filteredProducts.length === 0 ? (
          <p className="empty-message">No products found</p>
        ) : (
          filteredProducts.map((product) => (
            <div
              key={product.barcode}
              className="product-card"
              onClick={() => addToCart(product)}
            >
              <Package size={48} />
              <h4>{product.name}</h4>
              <div className="price">{formatCurrency(product.price)}</div>
              <div className="stock">Stock: {product.stock}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

