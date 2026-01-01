'use client';

import React from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { Printer, Check } from 'lucide-react';
import { Sale } from '@/types';
import { formatCurrency, formatDate, formatTime } from '@/lib/utils/formatters';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  sale: Sale | null;
}

export default function ReceiptModal({
  isOpen,
  onClose,
  sale,
}: ReceiptModalProps) {
  if (!sale) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Receipt" maxWidth="max-w-md">
      <div className="receipt-content">
        <div className="receipt bg-white border-dashed border-2 border-border p-spacing-xl mb-spacing-lg">
          <div className="receipt-header text-center border-b-dashed border-b-2 border-border pb-spacing-md mb-spacing-md">
            <h2 className="text-xl font-bold mb-spacing-sm">RetroPos</h2>
            <p>Thank you for your purchase!</p>
          </div>
          <div className="receipt-info text-sm text-text-secondary mb-spacing-md">
            <div>Transaction: {sale.id}</div>
            <div>Date: {formatDate(sale.date)}</div>
            <div>Time: {formatTime(sale.date)}</div>
            <div>Payment: {sale.paymentMethod.toUpperCase()}</div>
          </div>
          <div className="receipt-items mb-spacing-md">
            {sale.items.map((item) => (
              <div key={item.barcode} className="flex justify-between py-spacing-sm border-b border-bg-primary">
                <div>
                  <div>{item.name}</div>
                  <div className="text-sm text-text-secondary">
                    {item.quantity} x {formatCurrency(item.price)}
                  </div>
                </div>
                <div>{formatCurrency(item.price * item.quantity)}</div>
              </div>
            ))}
          </div>
          <div className="receipt-totals border-t-dashed border-t-2 border-border pt-spacing-md">
            <div className="flex justify-between py-spacing-xs">
              <span>Subtotal:</span>
              <span>{formatCurrency(sale.subtotal)}</span>
            </div>
            <div className="flex justify-between py-spacing-xs">
              <span>Tax (8%):</span>
              <span>{formatCurrency(sale.tax)}</span>
            </div>
            <div className="flex justify-between pt-spacing-sm mt-spacing-sm border-t-2 border-border text-lg font-bold">
              <span>TOTAL:</span>
              <span>{formatCurrency(sale.total)}</span>
            </div>
          </div>
          <div className="receipt-footer text-center mt-spacing-lg pt-spacing-md border-t-dashed border-t-2 border-border text-sm text-text-secondary">
            <p>Visit us again soon!</p>
            <p>RetroPos - Your Modern Shopping Experience</p>
          </div>
        </div>
        <div className="receipt-actions flex space-x-spacing-md">
          <Button variant="secondary" onClick={handlePrint} Icon={Printer} className="flex-1">
            Print
          </Button>
          <Button variant="primary" onClick={onClose} Icon={Check} className="flex-1">
            Done
          </Button>
        </div>
      </div>
    </Modal>
  );
}

