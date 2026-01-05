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
          <button
            className={`btn-icon ${activeView === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveView('dashboard')}
            title="Dashboard"
          >
            <LayoutDashboard size={20} />
          </button>
          <button
            className={`btn-icon ${activeView === 'pos' ? 'active' : ''}`}
            onClick={() => setActiveView('pos')}
            title="Point of Sale"
          >
            <ShoppingCart size={20} />
          </button>
          <button
            className={`btn-icon ${activeView === 'products' ? 'active' : ''}`}
            onClick={() => setActiveView('products')}
            title="Products"
          >
            <Package size={20} />
          </button>
          <button
            className={`btn-icon ${activeView === 'inventory' ? 'active' : ''}`}
            onClick={() => setActiveView('inventory')}
            title="Inventory"
          >
            <Warehouse size={20} />
          </button>
          <button
            className={`btn-icon ${activeView === 'reports' ? 'active' : ''}`}
            onClick={() => setActiveView('reports')}
            title="Reports"
          >
            <BarChart3 size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}

