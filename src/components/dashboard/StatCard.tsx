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
  const variantStyles = {
    yellow: "bg-primary-light",
    green: "bg-[#E8F8EC]",
    blue: "bg-[#E3F2FD]",
    orange: "bg-[#FFF3E0]",
    default: "bg-bg-card",
  };

  const iconVariantStyles = {
    yellow: "text-primary-dark",
    green: "text-secondary",
    blue: "text-accent",
    orange: "text-accent-orange",
    default: "text-text-primary",
  };

  const trendStyles = {
    up: "text-secondary",
    down: "text-[#FF4444]",
    neutral: "text-text-secondary",
  };

  const TrendIcon = trendType === 'up' ? TrendingUp : trendType === 'down' ? TrendingDown : null;

  return (
    <div className={`stat-card ${variantStyles[variant]}`}>
      <div className="stat-icon bg-white border-border border-border-width rounded-[var(--radius-md)] flex items-center justify-center p-2">
        <Icon size={32} className={iconVariantStyles[variant]} />
      </div>
      <div className="stat-content">
        <h3 className="text-2xl font-bold mb-1">{value}</h3>
        <p className="text-text-secondary text-sm font-medium">{label}</p>
        {trend && (
          <div className={`flex items-center gap-1 text-xs mt-1 ${trendStyles[trendType]}`}>
            {TrendIcon && <TrendIcon size={16} />}
            <span>{trend}</span>
          </div>
        )}
      </div>
    </div>
  );
}

