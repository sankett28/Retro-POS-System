'use client';

import React, { useState, useEffect } from 'react';
import { DollarSign, ShoppingBag, TrendingUp, Package, RefreshCw, Eye } from 'lucide-react';
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
        <div className="date-filter">
          <input
            type="date"
            id="report-start-date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="date-input"
          />
          <span>to</span>
          <input
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
        <div className="stat-card yellow">
          <div className="stat-icon yellow">
            <DollarSign size={32} />
          </div>
          <div className="stat-content">
            <h3>{formatCurrency(reportStats.revenue)}</h3>
            <p>Total Sales</p>
          </div>
        </div>
        <div className="stat-card blue">
          <div className="stat-icon blue">
            <ShoppingBag size={32} />
          </div>
          <div className="stat-content">
            <h3>{reportStats.transactions}</h3>
            <p>Transactions</p>
          </div>
        </div>
        <div className="stat-card green">
          <div className="stat-icon green">
            <TrendingUp size={32} />
          </div>
          <div className="stat-content">
            <h3>{formatCurrency(reportStats.avgSale)}</h3>
            <p>Avg Transaction</p>
          </div>
        </div>
        <div className="stat-card orange">
          <div className="stat-icon orange">
            <Package size={32} />
          </div>
          <div className="stat-content">
            <h3>{reportStats.itemsSold}</h3>
            <p>Items Sold</p>
          </div>
        </div>
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

