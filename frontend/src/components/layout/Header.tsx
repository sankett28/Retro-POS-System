'use client';

import { Store, LayoutDashboard, Receipt, Package, Warehouse, TrendingUp, Bell, UserCircle } from 'lucide-react';
import { ViewType } from '@/types';
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

  const navLinks = [
    { id: 'dashboard' as ViewType, icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'inventory' as ViewType, icon: Package, label: 'Inventory' },
    { id: 'pos' as ViewType, icon: Receipt, label: 'Billing' },
    { id: 'products' as ViewType, icon: Package, label: 'Products' },
    { id: 'reports' as ViewType, icon: TrendingUp, label: 'Analytics' },
  ];

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-brand">
          <Store className="brand-icon" size={28} />
          <span className="brand-name">Retail Boss</span>
          <span className="beta-badge">AI-Powered</span>
        </div>
        <div className="nav-menu">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.id}
                href={`#${link.id}`}
                className={`nav-link ${activeView === link.id ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveView(link.id);
                }}
              >
                <Icon size={18} />
                {link.label}
              </a>
            );
          })}
        </div>
        <div className="nav-actions">
          <button className="btn-icon" title="Notifications">
            <Bell size={18} />
            <span className="notification-badge">3</span>
          </button>
          <button className="btn-icon" title="Profile">
            <UserCircle size={18} />
          </button>
        </div>
      </div>
    </nav>
  );
}

