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
    primary: "btn-primary",
    secondary: "btn-secondary",

    icon: "btn-icon",

    checkout: "btn-checkout",

    delete: "btn-delete",

    edit: "btn-edit",

    stock: "btn-stock",

    payment: "payment-btn",

  };

  const sizes = {
    sm: "btn-sm",
    md: "",
    lg: "",
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

