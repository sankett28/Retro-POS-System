'use client';

import React from 'react';
import CartPanel from './CartPanel';
import ProductGrid from './ProductGrid';

export default function POSView() {
  return (
    <div className="pos-layout grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[400px_1fr] gap-spacing-xl min-h-[calc(100vh-200px)]">
      <CartPanel />
      <ProductGrid />
    </div>
  );
}

