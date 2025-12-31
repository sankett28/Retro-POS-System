'use client';

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
        {activeView === 'dashboard' && <DashboardView />}
        {activeView === 'pos' && <POSView />}
        {activeView === 'products' && <ProductsView />}
        {activeView === 'inventory' && <InventoryView />}
        {activeView === 'reports' && <ReportsView />}
      </main>
    </>
  );
}

