'use client';

import React, { useState, useEffect } from 'react';
import { DollarSign, ShoppingBag, TrendingUp, Package, RefreshCw, Eye } from 'lucide-react';
import StatCard from '@/components/dashboard/StatCard';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useSales } from '@/hooks/useSales';
import { formatCurrency, formatDate, formatTime } from '@/lib/utils/formatters';
import ReceiptModal from '@/components/modals/ReceiptModal';
import { Sale } from '@/types';

export default function ReportsView() {
  const { filteredSales, startDate, setStartDate, endDate, setEndDate, reportStats, refreshData } = useSales();
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [currentSale, setCurrentSale] = useState<Sale | null>(null);

  const handleViewSaleDetails = (sale: Sale) => {
    setCurrentSale(sale);
    setIsReceiptModalOpen(true);
  };

  const handleGenerateReport = () => {
    refreshData(); // Triggers re-fetch and re-calculation based on new dates
  };

  return (
    <div className="view active">
      <div className="view-header">
        <h2>Sales Reports</h2>
        <div className="date-filter flex items-center space-x-4">
          <Input
            type="date"
            id="report-start-date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="date-input"
          />
          <span>to</span>
          <Input
            type="date"
            id="report-end-date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="date-input"
          />
          <Button onClick={handleGenerateReport} Icon={RefreshCw}>
            Generate
          </Button>
        </div>
      </div>

      <div className="dashboard-grid mb-8">
        <StatCard
          icon={DollarSign}
          value={formatCurrency(reportStats.revenue)}
          label="Total Sales"
          variant="yellow"
        />
        <StatCard
          icon={ShoppingBag}
          value={reportStats.transactions}
          label="Transactions"
          variant="blue"
        />
        <StatCard
          icon={TrendingUp}
          value={formatCurrency(reportStats.avgSale)}
          label="Avg Transaction"
          variant="green"
        />
        <StatCard
          icon={Package}
          value={reportStats.transactions}
          label="Transactions"
          variant="orange"
        />
      </div>

      <div className="card">
        <div className="card-header">
          <h3>Transaction History</h3>
        </div>
        <table className="data-table w-full bg-bg-card border-border border-border-width rounded-lg overflow-hidden shadow-sm">
          <thead>
            <tr className="bg-primary">
              <th className="p-4 text-left font-bold border-b-border border-b-border-width">Date & Time</th>
              <th className="p-4 text-left font-bold border-b-border border-b-border-width">Transaction ID</th>
              <th className="p-4 text-left font-bold border-b-border border-b-border-width">Items</th>
              <th className="p-4 text-left font-bold border-b-border border-b-border-width">Total</th>
              <th className="p-4 text-left font-bold border-b-border border-b-border-width">Actions</th>
            </tr>
          </thead>
          <tbody id="sales-table-body">
            {filteredSales.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center text-text-light py-4">
                  No sales in this period
                </td>
              </tr>
            ) : (
              filteredSales.map((sale) => (
                <tr key={sale.id} className="hover:bg-bg-primary">
                  <td className="p-4 border-b border-bg-primary">{`${formatDate(sale.date)} ${formatTime(sale.date)}`}</td>
                  <td className="p-4 border-b border-bg-primary">{sale.id}</td>
                  <td className="p-4 border-b border-bg-primary">{sale.items.reduce((sum, item) => sum + item.quantity, 0)}</td>
                  <td className="p-4 border-b border-bg-primary">{formatCurrency(sale.total)}</td>
                  <td className="p-4 border-b border-bg-primary">
                    <div className="table-actions flex space-x-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleViewSaleDetails(sale)}
                        Icon={Eye}
                      >
                        View
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ReceiptModal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        sale={currentSale}
      />
    </div>
  );
}

