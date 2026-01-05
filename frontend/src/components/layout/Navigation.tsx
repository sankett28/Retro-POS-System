'use client';

import React from 'react';
import { ViewType } from '@/types';
import Button from '@/components/ui/Button';
import { LayoutDashboard, ShoppingCart, Package, Warehouse, BarChart3 } from 'lucide-react';

interface NavigationProps {
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
}

export default function Navigation({ activeView, setActiveView }: NavigationProps) {
  return (
    <div className="header-actions">
      <Button
        variant="icon"
        className={activeView === 'dashboard' ? 'active' : ''}
        onClick={() => setActiveView('dashboard')}
        title="Dashboard"
        Icon={LayoutDashboard}
        iconSize={20}
      />
      <Button
        variant="icon"
        className={activeView === 'pos' ? 'active' : ''}
        onClick={() => setActiveView('pos')}
        title="Point of Sale"
        Icon={ShoppingCart}
        iconSize={20}
      />
      <Button
        variant="icon"
        className={activeView === 'products' ? 'active' : ''}
        onClick={() => setActiveView('products')}
        title="Products"
        Icon={Package}
        iconSize={20}
      />
      <Button
        variant="icon"
        className={activeView === 'inventory' ? 'active' : ''}
        onClick={() => setActiveView('inventory')}
        title="Inventory"
        Icon={Warehouse}
        iconSize={20}
      />
      <Button
        variant="icon"
        className={activeView === 'reports' ? 'active' : ''}
        onClick={() => setActiveView('reports')}
        title="Reports"
        Icon={BarChart3}
        iconSize={20}
      />
    </div>
  );
}

