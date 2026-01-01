import { useState, useEffect, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { Sale, DashboardStats } from '@/types';
import { calculateDashboardStats } from '@/lib/utils/calculations';
import * as salesApi from '@/lib/api/sales';

export function useSales() {
  const { sales, products, refreshData } = useApp();
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [filteredSales, setFilteredSales] = useState<Sale[]>([]);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    setStartDate(thirtyDaysAgo);
    setEndDate(today);
  }, []);

  useEffect(() => {
    const filterSales = async () => {
      if (startDate && endDate) {
        const fetchedSales = await salesApi.getSales(startDate, endDate);
        setFilteredSales(fetchedSales);
      } else {
        setFilteredSales(sales);
      }
    };
    filterSales();
  }, [sales, startDate, endDate]);

  const dashboardStats: DashboardStats = useMemo(() => {
    return calculateDashboardStats(products, sales);
  }, [products, sales]);

  const reportStats = useMemo(() => {
    return calculateDashboardStats(products, filteredSales);
  }, [products, filteredSales]);

  const processPayment = async (paymentMethod: 'cash' | 'card' | 'digital', total: number, subtotal: number, tax: number) => {
    const newSale = await useApp().processSale(paymentMethod, total, subtotal, tax);
    if (newSale) {
        await refreshData(); // Refresh data after a sale
        return newSale;
    }
    return undefined;
  };

  return {
    sales,
    filteredSales,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    dashboardStats,
    reportStats,
    processPayment,
    refreshData
  };
}

