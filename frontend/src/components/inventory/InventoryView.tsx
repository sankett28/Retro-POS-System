'use client';

import React from 'react';
import { Package, TrendingUp, AlertTriangle, Layers, Download } from 'lucide-react';
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
        <div className="stat-card blue">
          <div className="stat-icon blue">
            <Package size={32} />
          </div>
          <div className="stat-content">
            <h3>{totalProducts}</h3>
            <p>Total Products</p>
          </div>
        </div>
        <div className="stat-card green">
          <div className="stat-icon green">
            <TrendingUp size={32} />
          </div>
          <div className="stat-content">
            <h3>{formatCurrency(totalValue)}</h3>
            <p>Inventory Value</p>
          </div>
        </div>
        <div className="stat-card orange">
          <div className="stat-icon orange">
            <AlertTriangle size={32} />
          </div>
          <div className="stat-content">
            <h3>{lowStock}</h3>
            <p>Low Stock Items</p>
          </div>
        </div>
        <div className="stat-card yellow">
          <div className="stat-icon yellow">
            <Layers size={32} />
          </div>
          <div className="stat-content">
            <h3>{totalUnits}</h3>
            <p>Total Units</p>
          </div>
        </div>
      </div>

      <div className="card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Barcode</th>
              <th>Current Stock</th>
              <th>Status</th>
              <th>Value</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="inventory-table-body">
            {/* Inventory will be loaded here */}
          </tbody>
        </table>
      </div>
    </div>
  );
}

