'use client';

import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import ProductModal from '@/components/modals/ProductModal';
import Button from '@/components/ui/Button';
import { Product } from '@/types';

export default function ProductsView() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);

  const handleAddProduct = () => {
    setCurrentProduct(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentProduct(null);
  };

  return (
    <div className="view active">
      <div className="view-header">
        <h2>Product Management</h2>
        <Button onClick={handleAddProduct} variant="primary" Icon={Plus}>
          Add Product
        </Button>
      </div>
      <div className="card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Barcode</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="products-table-body">
            {/* Products will be loaded here */}
          </tbody>
        </table>
      </div>
      <ProductModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        initialData={currentProduct}
      />
    </div>
  );
}

