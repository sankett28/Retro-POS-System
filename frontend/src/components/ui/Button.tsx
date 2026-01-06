import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'icon' | 'checkout' | 'delete' | 'edit' | 'stock' | 'payment' | 'sm' | 'outline';
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
  const baseStyle = "flex items-center justify-center gap-2 font-semibold transition-all duration-300 ease-in-out relative overflow-hidden";
  
  const variants = {
    primary: "bg-black text-white border-none shadow-sm hover:bg-[#1a1a1a] hover:translate-y-[-2px] hover:scale-[1.02] hover:shadow-lg",
    secondary: "bg-white text-black border border-gray-300 hover:bg-gray-100 hover:border-black hover:scale-[1.02]",
    icon: "bg-gray-100 text-black border-none hover:bg-gray-200 hover:scale-105",
    checkout: "w-full bg-black text-white border-none shadow-sm hover:bg-[#1a1a1a] hover:translate-y-[-2px] hover:shadow-lg",
    delete: "bg-[#ef4444] text-white border-none hover:bg-[#dc2626]",
    edit: "bg-[#3b82f6] text-white border-none hover:bg-[#2563eb]",
    stock: "bg-[#f59e0b] text-white border-none hover:bg-[#d97706]",
    payment: "bg-white text-black border border-gray-300 hover:border-black",
    sm: "bg-white text-black border border-gray-300 hover:bg-black hover:text-white hover:border-black hover:scale-105",
    outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm rounded-md",
    md: "px-6 py-3 text-base rounded-md",
    lg: "px-6 py-3 text-lg rounded-md",
  };

  const iconSizes = {
    sm: 16,
    md: 18,
    lg: 20,
  };

  // Add ripple effect for primary buttons
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (variant === 'primary' || variant === 'checkout') {
      const button = e.currentTarget;
      const ripple = document.createElement('span');
      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      ripple.classList.add('ripple');
      
      button.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    }
    
    props.onClick?.(e);
  };

  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={handleClick}
      {...props}
    >
      {Icon && <Icon size={iconSize || iconSizes[size]} />}
      {children}
    </button>
  );
}

