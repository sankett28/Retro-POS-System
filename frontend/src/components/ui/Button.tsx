import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'icon' | 'checkout' | 'delete' | 'edit' | 'stock' | 'payment';
  size?: 'sm' | 'md' | 'lg';
  Icon?: LucideIcon;
  iconSize?: number;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  Icon,
  iconSize = 16,
  children,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyle = "flex items-center justify-center gap-2 font-semibold transition-all duration-300 ease-in-out";
  
  const variants = {
    primary: "bg-primary text-text-primary border-border border-border-width shadow-md hover:bg-primary-dark hover:translate-y-[-2px] hover:shadow-lg",
    secondary: "bg-bg-card text-text-primary border-border border-border-width hover:bg-bg-primary hover:translate-y-[-2px]",
    icon: "bg-bg-card text-text-primary border-border border-border-width hover:bg-primary active:bg-primary-dark",
    checkout: "w-full bg-secondary text-white border-border border-border-width shadow-secondary-soft hover:bg-secondary-dark hover:translate-y-[-2px] hover:shadow-secondary-strong",
    delete: "bg-[#FF4444] text-white border-border border-border-width hover:bg-[#CC0000]",
    edit: "bg-accent text-white border-border border-border-width hover:bg-[#3A7BC8]",
    stock: "bg-accent-orange text-white border-border border-border-width hover:bg-[#E67A2E]",
    payment: "bg-white text-text-primary border-border border-border-width hover:border-primary hover:bg-primary-light hover:translate-y-[-4px] hover:shadow-md",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm rounded-md",
    md: "px-4 py-2 text-base rounded-md",
    lg: "px-6 py-3 text-lg rounded-lg",
  };

  const iconSizes = {
    sm: 16,
    md: 18,
    lg: 20,
  };

  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {Icon && <Icon size={iconSize || iconSizes[size]} />}
      {children}
    </button>
  );
}

