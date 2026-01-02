'use client';

import React from 'react';
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
    <div id="receipt-modal" className={`modal ${isOpen ? 'active' : ''}`}>
      <div className="modal-content receipt-content">
        <div className="receipt">
          <div className="receipt-header">
            <h2>RetroPos</h2>
            <p>Thank you for your purchase!</p>
          </div>
          <div className="receipt-info">
            <div>Transaction: {sale.id}</div>
            <div>Date: {formatDate(sale.date)}</div>
            <div>Time: {formatTime(sale.date)}</div>
            <div>Payment: {sale.paymentMethod.toUpperCase()}</div>
          </div>
          <div className="receipt-items">
            {sale.items.map((item) => (
              <div key={item.barcode} className="receipt-item">
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
          <div className="receipt-totals">
            <div className="receipt-total-row">
              <span>Subtotal:</span>
              <span>{formatCurrency(sale.subtotal)}</span>
            </div>
            <div className="receipt-total-row">
              <span>Tax (8%):</span>
              <span>{formatCurrency(sale.tax)}</span>
            </div>
            <div className="receipt-total-row final">
              <span>TOTAL:</span>
              <span>{formatCurrency(sale.total)}</span>
            </div>
          </div>
          <div className="receipt-footer">
            <p>Visit us again soon!</p>
            <p>RetroPos - Your Modern Shopping Experience</p>
          </div>
        </div>
        <div className="receipt-actions">
          <Button variant="secondary" onClick={handlePrint} Icon={Printer}>
            Print
          </Button>
          <Button variant="primary" onClick={onClose} Icon={Check}>
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}

