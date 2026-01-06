'use client';

import React from 'react';
import { Scan, Plus, PackageCheck, AlertTriangle, PackageX, TrendingUp, Search, Edit, ShoppingCart } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function InventoryPage() {
  return (
    <div className="main-container">
      <div className="section-header">
        <div>
          <h1 className="section-title">Smart Inventory Management</h1>
          <p className="section-subtitle">AI-powered stock tracking & forecasting</p>
        </div>
        <div className="header-actions">
          <Button variant="secondary" Icon={Scan}>
            Scan Barcode
          </Button>
          <Button variant="primary" Icon={Plus}>
            Add Product
          </Button>
        </div>
      </div>

      <div className="inventory-stats">
        <div className="stat-card">
          <PackageCheck size={32} />
          <div>
            <div className="stat-value">236</div>
            <div className="stat-label">In Stock</div>
          </div>
        </div>
        <div className="stat-card alert">
          <AlertTriangle size={32} />
          <div>
            <div className="stat-value">12</div>
            <div className="stat-label">Low Stock</div>
          </div>
        </div>
        <div className="stat-card warning">
          <PackageX size={32} />
          <div>
            <div className="stat-value">8</div>
            <div className="stat-label">Expiring Soon</div>
          </div>
        </div>
        <div className="stat-card success">
          <TrendingUp size={32} />
          <div>
            <div className="stat-value">₹2.4L</div>
            <div className="stat-label">Stock Value</div>
          </div>
        </div>
      </div>

      <div className="table-card">
        <div className="table-header">
          <div className="search-box">
            <Search size={18} />
            <input type="text" placeholder="Search products..." id="inventorySearch" />
          </div>
          <div className="table-filters">
            <button className="filter-btn active">All</button>
            <button className="filter-btn">Low Stock</button>
            <button className="filter-btn">Expiring</button>
          </div>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Stock</th>
              <th>Min Level</th>
              <th>Status</th>
              <th>AI Forecast</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="inventoryTableBody">
            <tr>
              <td>
                <div className="product-cell">
                  <div className="product-img">M</div>
                  <div>
                    <div className="product-name">Maggi Noodles 2-Min</div>
                    <div className="product-sku">SKU: MAG001</div>
                  </div>
                </div>
              </td>
              <td>Instant Food</td>
              <td><span className="stock-qty">45</span></td>
              <td>20</td>
              <td><span className="badge badge-success">Good Stock</span></td>
              <td>
                <div className="forecast">
                  <TrendingUp size={14} />
                  High demand
                </div>
              </td>
              <td>
                <button className="btn-icon-sm">
                  <Edit size={18} />
                </button>
              </td>
            </tr>
            <tr>
              <td>
                <div className="product-cell">
                  <div className="product-img">P</div>
                  <div>
                    <div className="product-name">Parle-G Biscuits</div>
                    <div className="product-sku">SKU: PAR002</div>
                  </div>
                </div>
              </td>
              <td>Biscuits</td>
              <td><span className="stock-qty warning">8</span></td>
              <td>15</td>
              <td><span className="badge badge-warning">Low Stock</span></td>
              <td>
                <div className="forecast">
                  <AlertTriangle size={14} />
                  Reorder now
                </div>
              </td>
              <td>
                <button className="btn-icon-sm">
                  <ShoppingCart size={18} />
                </button>
              </td>
            </tr>
            <tr>
              <td>
                <div className="product-cell">
                  <div className="product-img">T</div>
                  <div>
                    <div className="product-name">Tata Tea Gold</div>
                    <div className="product-sku">SKU: TEA003</div>
                  </div>
                </div>
              </td>
              <td>Beverages</td>
              <td><span className="stock-qty">32</span></td>
              <td>25</td>
              <td><span className="badge badge-success">Good Stock</span></td>
              <td>
                <div className="forecast">
                  <TrendingUp size={14} />
                  Stable
                </div>
              </td>
              <td>
                <button className="btn-icon-sm">
                  <Edit size={18} />
                </button>
              </td>
            </tr>
            <tr>
              <td>
                <div className="product-cell">
                  <div className="product-img">A</div>
                  <div>
                    <div className="product-name">Amul Butter 500g</div>
                    <div className="product-sku">SKU: AMU004</div>
                  </div>
                </div>
              </td>
              <td>Dairy</td>
              <td><span className="stock-qty danger">3</span></td>
              <td>10</td>
              <td><span className="badge badge-danger">Critical</span></td>
              <td>
                <div className="forecast">
                  <AlertTriangle size={14} />
                  Urgent!
                </div>
              </td>
              <td>
                <button className="btn-icon-sm">
                  <ShoppingCart size={18} />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}