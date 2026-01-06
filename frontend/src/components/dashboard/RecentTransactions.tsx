'use client';

import React, { useState } from 'react';
import { Eye } from 'lucide-react'; // Import Eye icon
import Button from '@/components/ui/Button'; // Import Button component
import ReceiptModal from '@/components/modals/ReceiptModal'; // Import ReceiptModal
import { ViewType, Sale } from '@/types'; // Import ViewType for navigation
import { useApp } from '@/context/AppContext';
import { formatCurrency, formatTime } from '@/lib/utils/formatters';

interface RecentTransactionsProps {
  // setActiveView: (view: ViewType) => void; // Prop for navigation
}

export default function RecentTransactions() {
  const { sales } = useApp();
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);

  const recentSales = sales.slice(-5).reverse(); // Get last 5 sales, most recent first

  const handleViewReceipt = (sale: Sale) => {
    setSelectedSale(sale);
    setIsReceiptModalOpen(true);
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3>Recent Transactions</h3>
        <Button
          variant="secondary" // Use a secondary button style
          size="sm"
          onClick={() => {}}
        >
          View All
        </Button>
      </div>
      <table className="data-table">
        <thead>
          <tr>
            <th>Time</th><th>Transaction ID</th><th>Items</th><th>Total</th><th>Payment</th><th>Actions</th>
          </tr>
        </thead>
        <tbody id="dash-recent-sales">
          {recentSales.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center text-gray-500 py-4"> {/* Adjusted colspan */}
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
                <td>
                  <Button
                    variant="icon" // Use an icon button style
                    size="sm"
                    Icon={Eye}
                    onClick={() => handleViewReceipt(sale)}
                    title="View Receipt"
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <ReceiptModal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        sale={selectedSale}
      />
    </div>
  );
}

