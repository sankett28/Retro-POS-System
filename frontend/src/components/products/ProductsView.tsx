'use client';

import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import ProductTable from './ProductTable';
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
      <ProductTable onEditProduct={(product) => {
        setCurrentProduct(product);
        setIsModalOpen(true);
      }} />
      <ProductModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        initialData={currentProduct}
      />
    </div>
  );
}

