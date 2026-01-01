'use client';

import React from 'react';
import { Package, TrendingUp, AlertTriangle, Layers, Download } from 'lucide-react';
import StatCard from '@/components/dashboard/StatCard';
import InventoryTable from './InventoryTable';
import Button from '@/components/ui/Button';
import { useApp } from '@/context/AppContext';
import { formatCurrency } from '@/lib/utils/formatters';
import * as inventoryApi from '@/lib/api/inventory';

export default function InventoryView() {
  const { products } = useApp();

  const totalProducts = products.length;
  const totalValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);
  const lowStock = products.filter((p) => p.stock < 10).length;
  const totalUnits = products.reduce((sum, p) => sum + p.stock, 0);

  const handleExportInventory = async () => {
    try {
      const blob = await inventoryApi.exportInventory();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `inventory_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div className="view active">
      <div className="view-header">
        <h2>Inventory Overview</h2>
        <Button onClick={handleExportInventory} Icon={Download}>
          Export
        </Button>
      </div>

      <div className="dashboard-grid mb-8">
        <StatCard
          icon={Package}
          value={totalProducts}
          label="Total Products"
          variant="blue"
        />
        <StatCard
          icon={TrendingUp}
          value={formatCurrency(totalValue)}
          label="Inventory Value"
          variant="green"
        />
        <StatCard
          icon={AlertTriangle}
          value={lowStock}
          label="Low Stock Items"
          variant="orange"
        />
        <StatCard
          icon={Layers}
          value={totalUnits}
          label="Total Units"
          variant="yellow"
        />
      </div>

      <InventoryTable />
    </div>
  );
}

