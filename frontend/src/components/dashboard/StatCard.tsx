import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  value: string | number;
  label: string;
  trend?: string;
  trendType?: 'up' | 'down' | 'neutral';
  variant: 'yellow' | 'green' | 'blue' | 'orange' | 'default';
}

export default function StatCard({
  icon: Icon,
  value,
  label,
  trend,
  trendType = 'neutral',
  variant = 'default',
}: StatCardProps) {
  const trendStyles = {
    up: "text-[#16a34a] bg-[#dcfce7]",
    down: "text-[#dc2626] bg-[#fee2e2]",
    neutral: "text-gray-600 bg-gray-100",
  };

  const TrendIcon = trendType === 'up' ? TrendingUp : trendType === 'down' ? TrendingDown : null;

  return (
    <div className="stat-card">
      <div className="stat-icon">
        <Icon size={24} />
      </div>
      <div className="stat-content">
        <h3>{value}</h3>
        <p>{label}</p>
        {trend && (
          <div className={`trend ${trendType} ${trendStyles[trendType]}`}>
            {TrendIcon && <TrendIcon size={14} />}
            <span>{trend}</span>
          </div>
        )}
      </div>
    </div>
  );
}

