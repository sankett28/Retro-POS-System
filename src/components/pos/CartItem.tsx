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
    <div className="cart-item bg-white border-border border-border-width rounded-md p-4 mb-2 flex justify-between items-center transition-all duration-300 ease-in-out hover:border-primary hover:shadow-sm">
      <div className="cart-item-info">
        <h4 className="font-semibold mb-1">{item.name}</h4>
        <p className="text-text-secondary text-sm">{formatCurrency(item.price)} each</p>
      </div>
      <div className="cart-item-actions flex items-center space-x-4">
        <div className="quantity-control flex items-center space-x-2 bg-bg-primary border-border border-border-width rounded-md p-1">
          <Button variant="icon" size="sm" onClick={() => onUpdateQuantity(item.barcode, -1)} Icon={Minus} iconSize={16} />
          <span className="min-w-[30px] text-center font-semibold">{item.quantity}</span>
          <Button variant="icon" size="sm" onClick={() => onUpdateQuantity(item.barcode, 1)} Icon={Plus} iconSize={16} />
        </div>
        <div className="cart-item-price font-bold text-lg">
          {formatCurrency(item.price * item.quantity)}
        </div>
        <Button variant="delete" size="sm" onClick={() => onRemove(item.barcode)} Icon={X} iconSize={16} />
      </div>
    </div>
  );
}

