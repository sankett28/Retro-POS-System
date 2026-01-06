'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Product, Sale, CartItem, StockAdjustmentType } from '@/types';
import * as productsApi from '@/lib/api/products';
import * as salesApi from '@/lib/api/sales';
import * as inventoryApi from '@/lib/api/inventory';

interface AppContextType {
  products: Product[];
  sales: Sale[];
  cart: CartItem[];
  addToCart: (product: Product) => void;
  updateCartQuantity: (barcode: string, change: number) => void;
  removeFromCart: (barcode: string) => void;
  clearCart: () => void;
  refreshData: () => Promise<void>;
  createProduct: (product: Omit<Product, 'barcode' | 'stock'> & { barcode: string; stock: number }) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (barcode: string) => Promise<void>;
  processSale: (paymentMethod: 'cash' | 'card' | 'digital', total: number, subtotal: number, tax: number) => Promise<Sale | undefined>;
  adjustProductStock: (barcode: string, type: StockAdjustmentType, quantity: number) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);

  const refreshData = async () => {
    try {
      const [productsData, salesData] = await Promise.all([
        productsApi.getProducts(),
        salesApi.getSales(),
      ]);
      setProducts(productsData);
      setSales(salesData);
      console.log("Sales data fetched in AppContext:", JSON.stringify(salesData, null, 2)); // MODIFIED
    } catch (error) {
      console.error('Failed to refresh data:', error);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.barcode === product.barcode);
      if (existing) {
        if (existing.quantity < product.stock) {
          return prev.map((item) =>
            item.barcode === product.barcode
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }
        alert('Not enough stock available!');
        return prev;
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateCartQuantity = (barcode: string, change: number) => {
    setCart((prev) => {
      const item = prev.find((i) => i.barcode === barcode);
      if (!item) return prev;
      const newQuantity = item.quantity + change;

      if (newQuantity <= 0) {
        return prev.filter((i) => i.barcode !== barcode);
      }
      const product = products.find((p) => p.barcode === barcode);
      if (product && newQuantity <= product.stock) {
        return prev.map((i) =>
          i.barcode === barcode ? { ...i, quantity: newQuantity } : i
        );
      }
      alert('Not enough stock available!');
      return prev;
    });
  };

  const removeFromCart = (barcode: string) => {
    setCart((prev) => prev.filter((item) => item.barcode !== barcode));
  };

  const clearCart = () => {
    if (cart.length > 0) {
        if (confirm('Are you sure you want to clear the cart?')) {
            setCart([]);
        }
    }
  };

  const createProduct = async (product: Product) => {
    await productsApi.createProduct(product);
    await refreshData();
  };

  const updateProduct = async (product: Product) => {
    try {
      await productsApi.updateProduct(product);
      await refreshData();
    } catch (error: any) {
      alert(error.message);
    }
  };

  const deleteProduct = async (barcode: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await productsApi.deleteProduct(barcode);
        await refreshData();
      } catch (error: any) {
        alert(error.message);
      }
    }
  };

  const processSale = async (paymentMethod: 'cash' | 'card' | 'digital', total: number, subtotal: number, tax: number) => {
    if (cart.length === 0) {
        alert('Cart is empty!');
        return;
    }
    const sale: Sale = {
        id: 'TXN' + Date.now(),
        date: new Date().toISOString(),
        items: [...cart],
        subtotal,
        tax,
        total,
        paymentMethod,
    };

    try {
        const newSale = await salesApi.createSale(sale);
        setCart([]);
        // Refresh products and sales data after a successful sale
        await refreshData();
        return newSale;
    } catch (error: any) {
        alert(error.message);
    }
  };

  const adjustProductStock = async (barcode: string, type: StockAdjustmentType, quantity: number) => {
    try {
        await inventoryApi.adjustStock(barcode, type, quantity);
        await refreshData();
    } catch (error: any) {
        alert(error.message);
    }
  };

  return (
    <AppContext.Provider
      value={{
        products,
        sales,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        refreshData,
        createProduct,
        updateProduct,
        deleteProduct,
        processSale,
        adjustProductStock,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}

