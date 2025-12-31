'use client';

import React, { useState } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useApp } from '@/context/AppContext';
import ProductModal from '@/components/modals/ProductModal';
import { Product } from '@/types';
import { formatCurrency } from '@/lib/utils/formatters';

export default function ProductTable() {
  const { products, deleteProduct } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);

  const handleEditProduct = (product: Product) => {
    setCurrentProduct(product);
    setIsModalOpen(true);
  };

  const handleAddProduct = () => {
    setCurrentProduct(null);
    setIsModalOpen(true);
  };

  return (
    <div className="card">
      <div className="card-header flex justify-between items-center mb-4 pb-2 border-b-2 border-bg-primary">
        <h3>Product List</h3>
        <Button onClick={handleAddProduct} variant="primary" Icon={Edit}>
            Add Product
        </Button>
      </div>
      <table className="data-table w-full bg-bg-card border-border border-border-width rounded-lg overflow-hidden shadow-sm">
        <thead>
          <tr className="bg-primary">
            <th className="p-4 text-left font-bold border-b-border border-b-border-width">Barcode</th>
            <th className="p-4 text-left font-bold border-b-border border-b-border-width">Name</th>
            <th className="p-4 text-left font-bold border-b-border border-b-border-width">Category</th>
            <th className="p-4 text-left font-bold border-b-border border-b-border-width">Price</th>
            <th className="p-4 text-left font-bold border-b-border border-b-border-width">Stock</th>
            <th className="p-4 text-left font-bold border-b-border border-b-border-width">Actions</th>
          </tr>
        </thead>
        <tbody id="products-table-body">
          {products.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center text-text-light py-4">
                No products available
              </td>
            </tr>
          ) : (
            products.map((product) => (
              <tr key={product.barcode} className="hover:bg-bg-primary">
                <td className="p-4 border-b border-bg-primary">{product.barcode}</td>
                <td className="p-4 border-b border-bg-primary">{product.name}</td>
                <td className="p-4 border-b border-bg-primary">{product.category}</td>
                <td className="p-4 border-b border-bg-primary">{formatCurrency(product.price)}</td>
                <td className="p-4 border-b border-bg-primary">{product.stock}</td>
                <td className="p-4 border-b border-bg-primary">
                  <div className="table-actions flex space-x-2">
                    <Button variant="edit" size="sm" onClick={() => handleEditProduct(product)} Icon={Edit}>
                      Edit
                    </Button>
                    <Button variant="delete" size="sm" onClick={() => deleteProduct(product.barcode)} Icon={Trash2}>
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={currentProduct}
      />
    </div>
  );
}

