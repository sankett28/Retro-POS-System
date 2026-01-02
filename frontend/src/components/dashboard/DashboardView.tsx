'use client';

import React from 'react';
import { DollarSign, TrendingUp, Receipt, ShoppingBag, Package, Layers, AlertTriangle, RefreshCw } from 'lucide-react';
import RecentTransactions from './RecentTransactions';
import Button from '@/components/ui/Button';
import { useApp } from '@/context/AppContext';
import { useSales } from '@/hooks/useSales';
import { formatCurrency } from '@/lib/utils/formatters';

export default function DashboardView() {
  const { refreshData } = useApp();
  const { dashboardStats } = useSales();

  const profitMargin = dashboardStats.revenue > 0 ? ((dashboardStats.profit / dashboardStats.revenue) * 100).toFixed(1) : 0;

  return (
    <div className="view active">
      <div className="view-header">
        <h2>Admin Dashboard</h2>
        <Button onClick={refreshData} Icon={RefreshCw} variant="primary">
          Refresh
        </Button>
      </div>

      <div className="dashboard-grid mb-8">
        <div className="stat-card yellow">
          <div className="stat-icon yellow">
            <DollarSign size={32} />
          </div>
          <div className="stat-content">
            <h3>{formatCurrency(dashboardStats.revenue)}</h3>
            <p>Total Revenue</p>
            <div className="trend up">
              <TrendingUp size={16} />
              <span>+{0}%</span>
            </div>
          </div>
        </div>
        <div className="stat-card green">
          <div className="stat-icon green">
            <TrendingUp size={32} />
          </div>
          <div className="stat-content">
            <h3>{formatCurrency(dashboardStats.profit)}</h3>
            <p>Net Profit</p>
            <div className="trend up">
              <TrendingUp size={16} />
              <span>{`${profitMargin}% margin`}</span>
            </div>
          </div>
        </div>
        <div className="stat-card blue">
          <div className="stat-icon blue">
            <Receipt size={32} />
          </div>
          <div className="stat-content">
            <h3>{formatCurrency(dashboardStats.taxes)}</h3>
            <p>Taxes Collected</p>
            <div className="trend">
              <span>8% rate</span>
            </div>
          </div>
        </div>
        <div className="stat-card orange">
          <div className="stat-icon orange">
            <ShoppingBag size={32} />
          </div>
          <div className="stat-content">
            <h3>{dashboardStats.transactions}</h3>
            <p>Transactions</p>
            <div className="trend">
              <span>Today</span>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-grid mb-8">
        <div className="stat-card">
          <div className="stat-icon blue">
            <Package size={32} />
          </div>
          <div className="stat-content">
            <h3>{dashboardStats.products}</h3>
            <p>Total Products</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">
            <Layers size={32} />
          </div>
          <div className="stat-content">
            <h3>{formatCurrency(dashboardStats.inventoryValue)}</h3>
            <p>Inventory Value</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon orange">
            <AlertTriangle size={32} />
          </div>
          <div className="stat-content">
            <h3>{dashboardStats.lowStock}</h3>
            <p>Low Stock Alerts</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon yellow">
            <TrendingUp size={32} />
          </div>
          <div className="stat-content">
            <h3>{formatCurrency(dashboardStats.avgSale)}</h3>
            <p>Avg Transaction</p>
          </div>
        </div>
      </div>

      <RecentTransactions />
    </div>
  );
}

