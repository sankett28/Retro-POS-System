'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { formatCurrency, formatTime } from '@/lib/utils/formatters';

export default function RecentTransactions() {
  const { sales } = useApp();

  const recentSales = sales.slice(-10).reverse(); // Get last 10 sales, most recent first

  return (
    <div className="card">
      <div className="card-header">
        <h3>Recent Transactions</h3>
      </div>
      <table className="data-table">
        <thead>
          <tr>
            <th>Time</th>
            <th>Transaction ID</th>
            <th>Items</th>
            <th>Total</th>
            <th>Payment</th>
          </tr>
        </thead>
        <tbody id="dash-recent-sales">
          {recentSales.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center text-text-light py-4">
                No recent transactions
              </td>
            </tr>
          ) : (
            recentSales.map((sale) => (
              <tr key={sale.id}>
                <td>{formatTime(sale.date)}</td>
                <td>{sale.id}</td>
                <td>{sale.items.reduce((sum, item) => sum + item.quantity, 0)}</td>
                <td>{formatCurrency(sale.total)}</td>
                <td>{sale.paymentMethod.toUpperCase()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

