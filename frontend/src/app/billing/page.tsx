'use client';

import React from 'react';
import { Search, Scan, ShoppingBag, Wallet, Smartphone, CreditCard, CheckCircle } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function BillingPage() {
  return (
    <div className="main-container">
      <div className="section-header">
        <div>
          <h1 className="section-title">Quick Billing</h1>
          <p className="section-subtitle">GST-compliant instant invoicing</p>
        </div>
      </div>

      <div className="billing-container">
        <div className="billing-left">
          <div className="search-product">
            <Search size={20} />
            <input type="text" placeholder="Search or scan product..." id="productSearch" />
            <Button Icon={Scan} variant="icon" />
          </div>

          <div className="product-grid">
            <div className="product-card" onClick={() => alert('Add Maggi Noodles to bill')}> {/* Placeholder onClick */} 
              <div className="product-card-img">M</div>
              <div className="product-card-name">Maggi Noodles</div>
              <div className="product-card-price">₹12</div>
            </div>
            <div className="product-card" onClick={() => alert('Add Parle-G to bill')}> {/* Placeholder onClick */} 
              <div className="product-card-img">P</div>
              <div className="product-card-name">Parle-G</div>
              <div className="product-card-price">₹10</div>
            </div>
            <div className="product-card" onClick={() => alert('Add Tata Tea to bill')}> {/* Placeholder onClick */} 
              <div className="product-card-img">T</div>
              <div className="product-card-name">Tata Tea</div>
              <div className="product-card-price">₹250</div>
            </div>
            <div className="product-card" onClick={() => alert('Add Amul Butter to bill')}> {/* Placeholder onClick */} 
              <div className="product-card-img">A</div>
              <div className="product-card-name">Amul Butter</div>
              <div className="product-card-price">₹55</div>
            </div>
          </div>
        </div>

        <div className="billing-right">
          <div className="bill-card">
            <div className="bill-header">
              <h3>Current Bill</h3>
              <button className="btn-text" onClick={() => alert('Clear All')}>Clear All</button> {/* Placeholder onClick */} 
            </div>

            <div className="bill-items" id="billItems">
              <div className="empty-state">
                <ShoppingBag size={48} />
                <p>Add products to start billing</p>
              </div>
            </div>

            <div className="bill-summary">
              <div className="summary-row">
                <span>Subtotal</span>
                <span id="subtotal">₹0</span>
              </div>
              <div className="summary-row">
                <span>GST (5%)</span>
                <span id="gst">₹0</span>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span id="total">₹0</span>
              </div>
            </div>

            <div className="payment-methods">
              <button className="payment-btn active">
                <Wallet size={20} />
                Cash
              </button>
              <button className="payment-btn">
                <Smartphone size={20} />
                UPI
              </button>
              <button className="payment-btn">
                <CreditCard size={20} />
                Card
              </button>
            </div>

            <Button className="btn-block" Icon={CheckCircle} variant="primary" onClick={() => alert('Complete & Print')}> {/* Placeholder onClick */} 
              Complete & Print
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}