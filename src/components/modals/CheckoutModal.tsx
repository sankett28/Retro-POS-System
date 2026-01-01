'use client';

import React from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { Banknote, CreditCard, Smartphone } from 'lucide-react';
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
    <Modal isOpen={isOpen} onClose={onClose} title="Process Payment" maxWidth="max-w-lg">
      <div className="checkout-summary text-center">
        <div className="checkout-total">
          <span className="block text-base font-semibold mb-spacing-sm">Total Amount:</span>
          <span id="checkout-total" className="block text-4xl font-bold">{formatCurrency(total)}</span>
        </div>
        <div className="payment-methods grid grid-cols-1 md:grid-cols-3 gap-spacing-md">
          <Button variant="payment" onClick={() => onCompletePayment('cash')} Icon={Banknote} iconSize={48}>
            Cash
          </Button>
          <Button variant="payment" onClick={() => onCompletePayment('card')} Icon={CreditCard} iconSize={48}>
            Card
          </Button>
          <Button variant="payment" onClick={() => onCompletePayment('digital')} Icon={Smartphone} iconSize={48}>
            Digital
          </Button>
        </div>
      </div>
    </Modal>
  );
}

