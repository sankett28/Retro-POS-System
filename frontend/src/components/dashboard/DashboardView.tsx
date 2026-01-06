'use client';

import React from 'react';
import { DollarSign, TrendingUp, Receipt, ShoppingBag, Package, Layers, AlertTriangle, Download, Users } from 'lucide-react';
import StatCard from './StatCard';
import RecentTransactions from './RecentTransactions';
import Button from '@/components/ui/Button';
// import { useApp } from '@/context/AppContext'; // Keeping this commented out for now
// import { useSales } from '@/hooks/useSales'; // Keeping this commented out for now
import { formatCurrency } from '@/lib/utils/formatters';

export default function DashboardView() {
  // const { refreshData } = useApp(); // Keeping this commented out for now
  // const { dashboardStats } = useSales(); // Keeping this commented out for now

  // const profitMargin = dashboardStats.revenue > 0 ? ((dashboardStats.profit / dashboardStats.revenue) * 100).toFixed(1) : 0; // Keeping this commented out for now

  return (
    <div className="view active">
      <div className="view-header">
        <h2>Dashboard Overview</h2>
        <div className="flex items-center space-x-2">
          {/* Placeholder for "Today" dropdown */}
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
          value="₹45,280"
          label="Today's Sales"
          trend="+12.5%"
          trendType="up"
          variant="green"
        />
        <StatCard
          icon={Package}
          value="248"
          label="Total Products"
          trend="12 items need reorder"
          trendType="neutral"
          variant="yellow"
        />
        <StatCard
          icon={Users}
          value="1,247"
          label="Active Customers"
          trend="+8.2%"
          trendType="up"
          variant="green"
        />
        <StatCard
          icon={TrendingUp}
          value="₹8.2L"
          label="Monthly Revenue"
          trend="+15.3%"
          trendType="up"
          variant="green"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Sales Trend (Last 7 Days) Chart */}
        <div className="card p-4">
          <div className="card-header mb-4">
            <h3>Sales Trend (Last 7 Days)</h3>
            {/* Placeholder for chart options/dropdown */}
            <div className="dropdown-menu">
              <button className="btn btn-text">...</button>
            </div>
          </div>
          <div className="chart-placeholder h-64 bg-gray-100 rounded-md flex items-center justify-center text-gray-400">
            [Sales Trend Chart]
          </div>
        </div>

        {/* Top Selling Categories Chart */}
        <div className="card p-4">
          <div className="card-header mb-4">
            <h3>Top Selling Categories</h3>
            {/* Placeholder for chart options/dropdown */}
            <div className="dropdown-menu">
              <button className="btn btn-text">...</button>
            </div>
          </div>
          <div className="chart-placeholder h-64 bg-gray-100 rounded-md flex items-center justify-center text-gray-400">
            [Top Selling Categories Chart]
          </div>
        </div>
      </div>
      <h2 className="text-2xl font-semibold mb-4">AI-Powered Insights</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        {/* High Demand Alert */}
        <div className="card p-4 flex items-start space-x-4">
          <div className="icon-box bg-blue-100 p-3 rounded-full">
            <TrendingUp size={24} className="text-blue-600" />
          </div>
          <div>
            <h4 className="font-semibold">High Demand Alert</h4>
            <p className="text-sm text-gray-600 mb-2">Maggi noodles sales up 45% this week. Consider increasing stock by 30 units.</p>
            <Button variant="outline" size="sm">Act Now</Button>
          </div>
        </div>

        {/* Low Stock Warning */}
        <div className="card p-4 flex items-start space-x-4">
          <div className="icon-box bg-yellow-100 p-3 rounded-full">
            <AlertTriangle size={24} className="text-yellow-600" />
          </div>
          <div>
            <h4 className="font-semibold">Low Stock Warning</h4>
            <p className="text-sm text-gray-600 mb-2">12 products below minimum level. Estimated stockout in 2-3 days.</p>
            <Button variant="outline" size="sm">View Items</Button>
          </div>
        </div>

        {/* Festival Forecast */}
        <div className="card p-4 flex items-start space-x-4">
          <div className="icon-box bg-purple-100 p-3 rounded-full">
            <Package size={24} className="text-purple-600" />
          </div>
          <div>
            <h4 className="font-semibold">Festival Forecast</h4>
            <p className="text-sm text-gray-600 mb-2">Diwali in 15 days. AI predicts 60% increase in sweets & snacks demand.</p>
            <Button variant="outline" size="sm">Prepare</Button>
          </div>
        </div>
      </div>

      <RecentTransactions />
    </div>
  );
}