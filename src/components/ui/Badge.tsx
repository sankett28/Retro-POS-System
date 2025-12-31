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
  const baseStyle = "inline-block px-3 py-1 text-sm font-semibold rounded-md border-2 border-border";
  
  const variants = {
    success: "bg-secondary text-white",
    warning: "bg-accent-orange text-white",
    danger: "bg-[#FF4444] text-white",
    info: "bg-accent text-white",
  };

  return (
    <span className={`${baseStyle} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}

