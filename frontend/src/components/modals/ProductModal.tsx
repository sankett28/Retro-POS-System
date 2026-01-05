'use client';

import React, { useState, useEffect } from 'react';
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
  const [externalError, setExternalError] = useState<string>('');

  useEffect(() => {
    // Clear external error when modal opens/closes or initialData changes
    setExternalError('');
  }, [isOpen, initialData]);

  const handleSubmit = async (product: Product) => {
    try {
      setExternalError(''); // Clear any previous errors
      if (initialData) {
        await updateProduct(product);
      } else {
        await createProduct(product);
      }
      onClose();
    } catch (error: any) {
      setExternalError(error.message);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? 'Edit Product' : 'Add Product'}>
      <ProductForm
        initialData={initialData}
        onSubmit={handleSubmit}
        onCancel={onClose}
        externalError={externalError}
      />
    </Modal>
  );
}

