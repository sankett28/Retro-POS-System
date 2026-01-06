'use client';

import React from 'react';
import { DollarSign, TrendingUp, Receipt, ShoppingBag, Package, Layers, AlertTriangle, Download, Users } from 'lucide-react';
import StatCard from '@/components/dashboard/StatCard';
import RecentTransactions from '@/components/dashboard/RecentTransactions';
import Button from '@/components/ui/Button';
import { useApp } from '@/context/AppContext';
import { useSales } from '@/hooks/useSales';
import { formatCurrency } from '@/lib/utils/formatters';
import { ViewType } from '@/types';

export default function DashboardPage() {
  const { refreshData } = useApp();
  const { dashboardStats } = useSales();

  const profitMargin = dashboardStats.revenue > 0 ? ((dashboardStats.profit / dashboardStats.revenue) * 100).toFixed(1) : 0;

  return (
    <div className="main-container">
      <div className="view-header">
        <h2>Dashboard Overview</h2>
        <div className="flex items-center space-x-2">
          <select className="p-2 border rounded-md">
            <option>Today</option>
          </select>
          <Button Icon={Download} variant="secondary">
            Export Report
          </Button>
        </div>
      </div>

      <div className="dashboard-grid mb-8">
        <StatCard
          icon={DollarSign}
          value={formatCurrency(dashboardStats.revenue)}
          label="Today's Sales"
          trend="+12.5%"
          trendType="up"
          variant="green"
        />
        <StatCard
          icon={Package}
          value={dashboardStats.products}
          label="Total Products"
          trend={`${dashboardStats.lowStock} Low`}
          trendType="neutral"
          variant="yellow"
        />
        <StatCard
          icon={Users}
          value={dashboardStats.customers}
          label="Active Customers"
          trend="+8.2%"
          trendType="up"
          variant="green"
        />
        <StatCard
          icon={TrendingUp}
          value={formatCurrency(dashboardStats.revenue)}
          label="Monthly Revenue"
          trend={`${profitMargin}% margin`}
          trendType="up"
          variant="green"
        />
      </div>


      <RecentTransactions />
    </div>
  );
}