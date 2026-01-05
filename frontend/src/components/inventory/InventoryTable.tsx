'use client';

import React, { useState } from 'react';
import { PackagePlus } from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import StockModal from '@/components/modals/StockModal';
import { useApp } from '@/context/AppContext';
import { Product } from '@/types';
import { formatCurrency } from '@/lib/utils/formatters';

export default function InventoryTable() {
  const { products } = useApp();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  return (
    <div className="card">
      <div className="card-header">
        <h3>All Products Inventory</h3>
      </div>
      <table className="data-table w-full bg-bg-card border-border border-border-width rounded-lg overflow-hidden shadow-sm">
        <thead>
          <tr className="bg-primary">
            <th className="p-4 text-left font-bold border-b-border border-b-border-width">Product</th>
            <th className="p-4 text-left font-bold border-b-border border-b-border-width">Barcode</th>
            <th className="p-4 text-left font-bold border-b-border border-b-border-width">Current Stock</th>
            <th className="p-4 text-left font-bold border-b-border border-b-border-width">Status</th>
            <th className="p-4 text-left font-bold border-b-border border-b-border-width">Value</th>
            <th className="p-4 text-left font-bold border-b-border border-b-border-width">Actions</th>
          </tr>
        </thead>
        <tbody id="inventory-table-body">
          {products.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center text-text-light py-4">
                No products in inventory
              </td>
            </tr>
          ) : (
            products.map((product) => {
              let statusVariant: 'success' | 'warning' | 'danger' = 'success';
              let statusText = 'In Stock';

              if (product.stock === 0) {
                statusVariant = 'danger';
                statusText = 'Out of Stock';
              } else if (product.stock < 10) {
                statusVariant = 'warning';
                statusText = 'Low Stock';
              }

              return (
                <tr key={product.barcode} className="hover:bg-bg-primary">
                  <td className="p-4 border-b border-bg-primary">{product.name}</td>
                  <td className="p-4 border-b border-bg-primary">{product.barcode}</td>
                  <td className="p-4 border-b border-bg-primary">{product.stock}</td>
                  <td className="p-4 border-b border-bg-primary">
                    <Badge variant={statusVariant}>{statusText}</Badge>
                  </td>
                  <td className="p-4 border-b border-bg-primary">{formatCurrency(product.price * product.stock)}</td>
                  <td className="p-4 border-b border-bg-primary">
                    <div className="table-actions flex space-x-2">
                      <Button
                        variant="stock"
                        size="sm"
                        onClick={() => setSelectedProduct(product)}
                        Icon={PackagePlus}
                      >
                        Adjust
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      {selectedProduct && (
        <StockModal
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          product={selectedProduct}
        />
      )}
    </div>
  );
}

