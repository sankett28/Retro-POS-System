'use client';

import React from 'react';
import Modal from '@/components/ui/Modal';
import ProductForm from '@/components/products/ProductForm';
import { Product } from '@/types';
import { useApp } from '@/context/AppContext';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Product | null;
}

export default function ProductModal({
  isOpen,
  onClose,
  initialData,
}: ProductModalProps) {
  const { createProduct, updateProduct } = useApp();

  const handleSubmit = async (product: Product) => {
    if (initialData) {
      await updateProduct(product);
    } else {
      await createProduct(product);
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? 'Edit Product' : 'Add Product'}>
      <ProductForm
        initialData={initialData}
        onSubmit={handleSubmit}
        onCancel={onClose}
      />
    </Modal>
  );
}

