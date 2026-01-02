'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
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

    const { isValid, errors } = validateStockAdjustment(adjustmentType, quantity, product.stock);
    if (!isValid) {
        setError(errors.join(', '));
        return;
    }

    try {
      await adjustProductStock(product.barcode, adjustmentType, quantity);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to adjust stock');
    }
  };

  const updateStockLabel = () => {
    if (adjustmentType === 'add') return 'Quantity to Add';
    if (adjustmentType === 'remove') return 'Quantity to Remove';
    return 'New Stock Level';
  };

  return (
    <div id="stock-modal" className={`modal ${isOpen ? 'active' : ''}`}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>Adjust Stock</h2>
          <Button variant="icon" onClick={onClose} Icon={X} />
        </div>
        {product ? (
          <form onSubmit={handleSubmit} id="stock-form">
            <div className="form-group">
              <label>Product: <span id="stock-product-name">{product.name}</span></label>
              <label>Current Stock: <span id="stock-current">{product.stock}</span></label>
            </div>
            <div className="form-group">
              <label htmlFor="stock-adjustment-type">Adjustment Type</label>
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
            <div className="form-group">
              <label htmlFor="stock-quantity" id="stock-quantity-label">{updateStockLabel()}</label>
              <input
                type="number"
                id="stock-quantity"
                min="0"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                required
              />
            </div>
            
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

            <div className="form-actions">
              <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
              <Button type="submit" variant="primary">Update Stock</Button>
            </div>
          </form>
        ) : (
          <p className="text-center text-text-light">No product selected for stock adjustment.</p>
        )}
      </div>
    </div>
  );
}