'use client';

import React, { useState, useEffect } from 'react';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Product, StockAdjustmentType } from '@/types';
import { useApp } from '@/context/AppContext';
import { validateStockAdjustment } from '@/lib/utils/validators';

interface StockModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

export default function StockModal({
  isOpen,
  onClose,
  product,
}: StockModalProps) {
  const { adjustProductStock } = useApp();
  const [adjustmentType, setAdjustmentType] = useState<StockAdjustmentType>('add');
  const [quantity, setQuantity] = useState<number>(0);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setAdjustmentType('add');
      setQuantity(0);
      setError('');
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    if (!validateStockAdjustment(quantity, adjustmentType, product.stock)) {
        if (quantity < 0) {
            setError("Quantity cannot be negative.");
        } else if (adjustmentType === 'remove' && quantity > product.stock) {
            setError("Cannot remove more stock than available.");
        } else {
            setError("Invalid stock adjustment.");
        }
        return;
    }

    try {
      await adjustProductStock(product.barcode, adjustmentType, quantity);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to adjust stock');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Adjust Stock" maxWidth="max-w-md">
      {product ? (
        <form onSubmit={handleSubmit} className="form-container">
          <div className="form-group mb-4">
            <label className="block mb-1 font-semibold">Product: <span className="font-normal" id="stock-product-name">{product.name}</span></label>
            <label className="block font-semibold">Current Stock: <span className="font-normal" id="stock-current">{product.stock}</span></label>
          </div>

          <div className="form-group mb-4">
            <label htmlFor="stock-adjustment-type" className="block mb-2 font-semibold">Adjustment Type</label>
            <select
              id="stock-adjustment-type"
              value={adjustmentType}
              onChange={(e) => setAdjustmentType(e.target.value as StockAdjustmentType)}
              className="w-full px-4 py-2 border-border border-border-width rounded-md text-base bg-white font-medium focus:outline-none focus:border-primary focus:shadow-primary-glow"
            >
              <option value="add">Add Stock</option>
              <option value="remove">Remove Stock</option>
              <option value="set">Set Stock</option>
            </select>
          </div>

          <Input
            label={adjustmentType === 'add' ? 'Quantity to Add' : adjustmentType === 'remove' ? 'Quantity to Remove' : 'New Stock Level'}
            id="stock-quantity"
            type="number"
            min="0"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
            required
          />
          
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

          <div className="form-actions flex justify-end space-x-4 mt-8">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Update Stock
            </Button>
          </div>
        </form>
      ) : (
        <p className="text-center text-text-light">No product selected for stock adjustment.</p>
      )}
    </Modal>
  );
}

