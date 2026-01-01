'use client';

import React from 'react';
import { DollarSign, TrendingUp, Receipt, ShoppingBag, Package, Layers, AlertTriangle, RefreshCw } from 'lucide-react';
import StatCard from './StatCard';
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
        <StatCard
          icon={DollarSign}
          value={formatCurrency(dashboardStats.revenue)}
          label="Total Revenue"
          trend={`+${0}%`}
          trendType="up"
          variant="yellow"
        />
        <StatCard
          icon={TrendingUp}
          value={formatCurrency(dashboardStats.profit)}
          label="Net Profit"
          trend={`${profitMargin}% margin`}
          trendType="up"
          variant="green"
        />
        <StatCard
          icon={Receipt}
          value={formatCurrency(dashboardStats.taxes)}
          label="Taxes Collected"
          trend="8% rate"
          variant="blue"
        />
        <StatCard
          icon={ShoppingBag}
          value={dashboardStats.transactions}
          label="Transactions"
          trend="Today"
          variant="orange"
        />
      </div>

      <div className="dashboard-grid mb-8">
        <StatCard
          icon={Package}
          value={dashboardStats.products}
          label="Total Products"
          variant="default"
        />
        <StatCard
          icon={Layers}
          value={formatCurrency(dashboardStats.inventoryValue)}
          label="Inventory Value"
          variant="default"
        />
        <StatCard
          icon={AlertTriangle}
          value={dashboardStats.lowStock}
          label="Low Stock Alerts"
          variant="default"
        />
        <StatCard
          icon={TrendingUp}
          value={formatCurrency(dashboardStats.avgSale)}
          label="Avg Transaction"
          variant="default"
        />
      </div>

      <RecentTransactions />
    </div>
  );
}

