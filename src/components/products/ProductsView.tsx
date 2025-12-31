'use client';

import React from 'react';
import ProductTable from './ProductTable';

export default function ProductsView() {
  return (
    <div className="view active">
      <div className="view-header">
        <h2>Product Management</h2>
        {/* Add Product button is now inside ProductTable for better state management */}
      </div>
      <ProductTable />
    </div>
  );
}

