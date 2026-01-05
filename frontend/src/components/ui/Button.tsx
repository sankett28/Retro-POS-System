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
    primary: "bg-[var(--primary)] text-[var(--text-primary)] border-[var(--border-width)] border-[var(--border)] hover:bg-[var(--primary-dark)] hover:translate-y-[-2px]",
    secondary: "bg-bg-card text-text-primary border-[var(--border-width)] border-[var(--border)] hover:bg-bg-primary hover:translate-y-[-2px]",
    icon: "bg-bg-card text-text-primary border-[var(--border-width)] border-[var(--border)] hover:bg-primary active:bg-primary-dark",
    checkout: "w-full bg-secondary text-white border-[var(--border-width)] border-[var(--border)] shadow-secondary-soft hover:bg-secondary-dark hover:translate-y-[-2px] hover:shadow-secondary-strong",
    delete: "bg-[#FF4444] text-white border-[var(--border-width)] border-[var(--border)] hover:bg-[#CC0000]",
    edit: "bg-accent text-white border-[var(--border-width)] border-[var(--border)] hover:bg-[#3A7BC8]",
    stock: "bg-accent-orange text-white border-[var(--border-width)] border-[var(--border)] hover:bg-[#E67A2E]",
    payment: "bg-white text-text-primary border-[var(--border-width)] border-[var(--border)] hover:border-primary hover:bg-primary-light hover:translate-y-[-4px] hover:shadow-md",
  };

  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2.5 text-base",
    lg: "px-6 py-3 text-lg",
  };

  const iconSizes = {
    sm: 16,
    md: 18,
    lg: 20,
  };

  return (
    <button
      className={`${baseStyle} ${variant === 'primary' ? 'btn-primary' : variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {Icon && <Icon size={iconSize || iconSizes[size]} />}
      {children}
    </button>
  );
}

