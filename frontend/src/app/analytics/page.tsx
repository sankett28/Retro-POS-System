'use client';

import React from 'react';
import { TrendingUp, Calendar, Sunrise, Sunset } from 'lucide-react';

export default function AnalyticsPage() {
  return (
    <div className="main-container">
      <div className="section-header">
        <div>
          <h1 className="section-title">AI-Powered Analytics</h1>
          <p className="section-subtitle">Demand forecasting & business insights</p>
        </div>
      </div>

      <div className="forecast-card">
        <div className="forecast-header">
          <div>
            <h3>7-Day Demand Forecast</h3>
            <p>AI predicts sales based on historical data & trends</p>
          </div>
          <div className="forecast-accuracy">
            <span className="accuracy-badge">92% Accurate</span>
          </div>
        </div>
        <div className="chart-container">
          {/* Placeholder for forecastChart */}
          <div className="chart-placeholder h-64 bg-gray-100 rounded-md flex items-center justify-center text-gray-400">
            [Forecast Chart]
          </div>
        </div>
        <div className="forecast-insights">
          <div className="forecast-insight">
            <TrendingUp size={18} />
            <span>Expected 18% increase on Saturday (weekend rush)</span>
          </div>
          <div className="forecast-insight">
            <Calendar size={18} />
            <span>Stock up 30% more for upcoming festival week</span>
          </div>
        </div>
      </div>

      <div className="analytics-grid">
        <div className="analytics-card">
          <h3 className="analytics-title">Top Customers</h3>
          <div className="customer-list">
            <div className="customer-item">
              <div className="customer-avatar">R</div>
              <div className="customer-info">
                <div className="customer-name">Ravi Kumar</div>
                <div className="customer-meta">42 purchases • ₹12,450</div>
              </div>
              <span className="badge badge-gold">VIP</span>
            </div>
            <div className="customer-item">
              <div className="customer-avatar">P</div>
              <div className="customer-info">
                <div className="customer-name">Priya Sharma</div>
                <div className="customer-meta">38 purchases • ₹10,200</div>
              </div>
              <span className="badge badge-silver">Regular</span>
            </div>
            <div className="customer-item">
              <div className="customer-avatar">A</div>
              <div className="customer-info">
                <div className="customer-name">Amit Patel</div>
                <div className="customer-meta">35 purchases • ₹9,800</div>
              </div>
              <span className="badge badge-silver">Regular</span>
            </div>
          </div>
        </div>

        <div className="analytics-card">
          <h3 className="analytics-title">Peak Hours</h3>
          <div className="chart-container">
            {/* Placeholder for peakHoursChart */}
            <div className="chart-placeholder h-64 bg-gray-100 rounded-md flex items-center justify-center text-gray-400">
              [Peak Hours Chart]
            </div>
          </div>
          <div className="peak-insights">
            <div className="peak-insight">
              <Sunrise size={18} />
              <span>Morning: 8-10 AM (₹8,500 avg)</span>
            </div>
            <div className="peak-insight">
              <Sunset size={18} />
              <span>Evening: 6-8 PM (₹15,200 avg)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}