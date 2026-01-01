'use client';

import React from 'react';
import { Minus, Plus, X } from 'lucide-react';
import { CartItem } from '@/types';
import Button from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils/formatters';

interface CartItemProps {
  item: CartItem;
  onUpdateQuantity: (barcode: string, change: number) => void;
  onRemove: (barcode: string) => void;
}

export default function CartItemComponent({
  item,
  onUpdateQuantity,
  onRemove,
}: CartItemProps) {
  return (
    <div className="cart-item">
      <div className="cart-item-info">
        <h4>{item.name}</h4>
        <p>{formatCurrency(item.price)} each</p>
      </div>
      <div className="cart-item-actions">
        <div className="quantity-control">
          <button onClick={() => onUpdateQuantity(item.barcode, -1)}>
            <Minus size={16} />
          </button>
          <span>{item.quantity}</span>
          <button onClick={() => onUpdateQuantity(item.barcode, 1)}>
            <Plus size={16} />
          </button>
        </div>
        <div className="cart-item-price">
          {formatCurrency(item.price * item.quantity)}
        </div>
        <button className="remove-item" onClick={() => onRemove(item.barcode)}>
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

