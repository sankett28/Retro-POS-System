"use client";

import { useState } from 'react';
import Header from '@/components/layout/Header';
import DashboardView from '@/components/dashboard/DashboardView';
import POSView from '@/components/pos/POSView';
import ProductsView from '@/components/products/ProductsView';
import InventoryView from '@/components/inventory/InventoryView';
import ReportsView from '@/components/reports/ReportsView';
import { ViewType } from '@/types';

export default function Home() {
  const [activeView, setActiveView] = useState<ViewType>('dashboard');

  return (
    <>
      <Header activeView={activeView} setActiveView={setActiveView} />
      <main className="main-container">
        <div id="dashboard-view" className={`view ${activeView === 'dashboard' ? 'active' : ''}`}>
          {activeView === 'dashboard' && <DashboardView setActiveView={setActiveView} />} {/* Pass setActiveView */}
        </div>
        <div id="pos-view" className={`view ${activeView === 'pos' ? 'active' : ''}`}>
          {activeView === 'pos' && <POSView />}
        </div>
        <div id="products-view" className={`view ${activeView === 'products' ? 'active' : ''}`}>
          {activeView === 'products' && <ProductsView />}
        </div>
        <div id="inventory-view" className={`view ${activeView === 'inventory' ? 'active' : ''}`}>
          {activeView === 'inventory' && <InventoryView />}
        </div>
        <div id="reports-view" className={`view ${activeView === 'reports' ? 'active' : ''}`}>
          {activeView === 'reports' && <ReportsView />}
        </div>
      </main>
    </>
  );
}

