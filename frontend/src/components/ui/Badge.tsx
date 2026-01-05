import React from 'react';

interface BadgeProps {
  variant: 'success' | 'warning' | 'danger' | 'info';
  children: React.ReactNode;
  className?: string;
}

export default function Badge({
  variant,
  children,
  className = '',
}: BadgeProps) {
  const baseStyle = "inline-block px-3 py-1 text-xs font-semibold rounded-full";
  
  const variants = {
    success: "bg-[#dcfce7] text-[#16a34a]",
    warning: "bg-[#fef3c7] text-[#d97706]",
    danger: "bg-[#fee2e2] text-[#dc2626]",
    info: "bg-[#dbeafe] text-[#2563eb]",
  };

  return (
    <span className={`${baseStyle} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}

