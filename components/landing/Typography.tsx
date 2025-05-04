import React from 'react';

interface HeadingProps {
  children: React.ReactNode;
  className?: string;
}

export function H1({ children, className = '' }: HeadingProps) {
  return (
    <h1 className={`text-4xl md:text-6xl font-bold ${className}`}>
      {children}
    </h1>
  );
}

export function H2({ children, className = '' }: HeadingProps) {
  return (
    <h2 className={`text-3xl font-bold ${className}`}>
      {children}
    </h2>
  );
}

export function H3({ children, className = '' }: HeadingProps) {
  return (
    <h3 className={`text-xl font-semibold ${className}`}>
      {children}
    </h3>
  );
}

interface TextProps {
  children: React.ReactNode;
  className?: string;
}

export function Text({ children, className = '' }: TextProps) {
  return (
    <p className={`text-base ${className}`}>
      {children}
    </p>
  );
}

export function LargeText({ children, className = '' }: TextProps) {
  return (
    <p className={`text-xl ${className}`}>
      {children}
    </p>
  );
}

export function HighlightText({ children, className = '' }: TextProps) {
  return (
    <span className={`text-indigo-300 ${className}`}>
      {children}
    </span>
  );
}

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Button({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'md',
  className = '' 
}: ButtonProps) {
  const baseClasses = 'font-bold rounded-lg transition-all';
  
  const variantClasses = {
    primary: 'bg-indigo-500 hover:bg-indigo-600 text-white',
    secondary: 'bg-white text-indigo-900 hover:bg-indigo-100',
    outline: 'bg-transparent hover:bg-indigo-800 border-2 border-indigo-400 text-white',
  };
  
  const sizeClasses = {
    sm: 'py-2 px-4 text-sm',
    md: 'py-3 px-6',
    lg: 'py-3 px-8 text-lg',
  };
  
  return (
    <button 
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
} 