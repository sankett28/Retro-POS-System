'use client';

import { ShoppingBag, LayoutDashboard, ShoppingCart, Package, Warehouse, BarChart3 } from 'lucide-react';
import { ViewType } from '@/types';
import Button from '@/components/ui/Button';
import React, { useEffect } from 'react';

interface HeaderProps {
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
}

export default function Header({ activeView, setActiveView }: HeaderProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.altKey) {
        switch (event.key) {
          case 'd':
            event.preventDefault();
            setActiveView('dashboard');
            break;
          case 'p':
            event.preventDefault();
            setActiveView('pos');
            break;
          case 'i':
            event.preventDefault();
            setActiveView('inventory');
            break;
          case 'r':
            event.preventDefault();
            setActiveView('reports');
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [setActiveView]);

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <ShoppingBag size={36} strokeWidth={2.5} />
          <h1>RetroPos</h1>
        </div>
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
      </div>
    </header>
  );
}

