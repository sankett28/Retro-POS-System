'use client';

import React from 'react';
import CartPanel from './CartPanel';
import ProductGrid from './ProductGrid';

export default function POSView() {
  return (
    <div className="pos-layout">
      <CartPanel />
      <ProductGrid />
    </div>
  );
}

