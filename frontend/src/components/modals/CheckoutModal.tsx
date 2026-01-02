'use client';

import React from 'react';
import Button from '@/components/ui/Button';
import { Banknote, CreditCard, Smartphone, X } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/formatters';
import { PaymentMethod } from '@/types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  total: number;
  onCompletePayment: (method: PaymentMethod) => void;
}

export default function CheckoutModal({
  isOpen,
  onClose,
  total,
  onCompletePayment,
}: CheckoutModalProps) {
  return (
    <div id="checkout-modal" className={`modal ${isOpen ? 'active' : ''}`}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>Process Payment</h2>
          <Button variant="icon" onClick={onClose} Icon={X} />
        </div>
        <div className="checkout-summary">
          <div className="checkout-total">
            <span>Total Amount:</span>
            <span id="checkout-total">{formatCurrency(total)}</span>
          </div>
          <div className="payment-methods">
            <Button variant="payment" onClick={() => onCompletePayment('cash')} Icon={Banknote} />
            <Button variant="payment" onClick={() => onCompletePayment('card')} Icon={CreditCard} />
            <Button variant="payment" onClick={() => onCompletePayment('digital')} Icon={Smartphone} />
          </div>
        </div>
      </div>
    </div>
  );
}

