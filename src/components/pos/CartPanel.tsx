'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Trash2, Scan, CreditCard, ShoppingCart } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import CartItemComponent from './CartItem';
import CheckoutModal from '@/components/modals/CheckoutModal';
import ReceiptModal from '@/components/modals/ReceiptModal';
import { useCart } from '@/hooks/useCart';
import { useApp } from '@/context/AppContext';
import { formatCurrency } from '@/lib/utils/formatters';
import { Sale } from '@/types';

export default function CartPanel() {
  const { cart, subtotal, tax, total, addToCart, updateCartQuantity, removeFromCart, clearCart } = useCart();
  const { products, processSale } = useApp();
  const [barcodeInput, setBarcodeInput] = useState('');
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [currentSale, setCurrentSale] = useState<Sale | null>(null);
  const barcodeRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (barcodeRef.current) {
      barcodeRef.current.focus();
    }
  }, [isCheckoutModalOpen, isReceiptModalOpen]); // Refocus on barcode input when modals close

  const handleBarcodeInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleScanBarcode();
    }
  };

  const handleScanBarcode = () => {
    const barcode = barcodeInput.trim();
    if (!barcode) return;

    const product = products.find((p) => p.barcode === barcode);

    if (product) {
      if (product.stock > 0) {
        addToCart(product);
        setBarcodeInput('');
        barcodeRef.current?.focus();
      } else {
        alert('Product is out of stock!');
      }
    } else {
      alert('Product not found!');
    }
  };

  const handleProcessCheckout = () => {
    if (cart.length === 0) {
      alert('Cart is empty!');
      return;
    }
    setIsCheckoutModalOpen(true);
  };

  const handleCompletePayment = async (method: 'cash' | 'card' | 'digital') => {
    const sale = await processSale(method, total, subtotal, tax);
    if (sale) {
      setCurrentSale(sale);
      setIsCheckoutModalOpen(false);
      setIsReceiptModalOpen(true);
    }
  };

  return (
    <> 
      <div className="cart-panel bg-bg-card border-border border-border-width rounded-lg p-spacing-lg flex flex-col shadow-md">
        <div className="panel-header flex justify-between items-center mb-spacing-lg pb-spacing-md border-b-2 border-bg-primary">
          <h2 className="text-lg font-bold">Current Sale</h2>
          <Button variant="secondary" size="sm" onClick={clearCart} Icon={Trash2}>
            Clear
          </Button>
        </div>

        <div className="barcode-scanner flex space-x-2 mb-spacing-lg">
          <Input
            type="text"
            id="barcode-input"
            placeholder="Scan or enter barcode..."
            value={barcodeInput}
            onChange={(e) => setBarcodeInput(e.target.value)}
            onKeyPress={handleBarcodeInput}
            ref={barcodeRef}
          />
          <Button variant="primary" onClick={handleScanBarcode} Icon={Scan}>
            Scan
          </Button>
        </div>

        <div className="cart-items flex-1 overflow-y-auto mb-spacing-lg pr-2">
          {cart.length === 0 ? (
            <div className="empty-cart text-center p-spacing-2xl text-text-light">
              <ShoppingCart size={64} className="mb-spacing-md opacity-50 mx-auto" />
              <p>Cart is empty</p>
              <small>Scan items to begin</small>
            </div>
          ) : (
            cart.map((item) => (
              <CartItemComponent
                key={item.barcode}
                item={item}
                onUpdateQuantity={updateCartQuantity}
                onRemove={removeFromCart}
              />
            ))
          )}
        </div>

        <div className="cart-summary bg-primary-light border-border border-border-width rounded-md p-spacing-lg mb-spacing-lg">
          <div className="flex justify-between py-1.5 text-text-secondary font-medium">
            <span>Subtotal:</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between py-1.5 text-text-secondary font-medium">
            <span>Tax (8%):</span>
            <span>{formatCurrency(tax)}</span>
          </div>
          <div className="flex justify-between pt-spacing-md mt-spacing-sm border-t-2 border-border text-lg font-bold text-text-primary">
            <span>Total:</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>

        <Button variant="checkout" onClick={handleProcessCheckout} Icon={CreditCard} iconSize={20}>
          Process Payment
        </Button>
      </div>

      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        total={total}
        onCompletePayment={handleCompletePayment}
      />

      <ReceiptModal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        sale={currentSale}
      />
    </>
  );
}

