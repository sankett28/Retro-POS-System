'use client';

import { Store, LayoutDashboard, Receipt, Package, TrendingUp, Bell, UserCircle } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

export default function Header() {
  const pathname = usePathname();

  const navLinks = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/inventory', icon: Package, label: 'Inventory' },
    { href: '/billing', icon: Receipt, label: 'Billing' },
    { href: '/products', icon: Package, label: 'Products' },
    { href: '/analytics', icon: TrendingUp, label: 'Analytics' },
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
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link ${isActive ? 'active' : ''}`}
              >
                <Icon size={18} />
                {link.label}
              </Link>
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
