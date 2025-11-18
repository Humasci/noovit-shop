import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  icon,
  fullWidth = false,
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)] hover:shadow-lg hover:-translate-y-0.5',
    secondary: 'bg-transparent text-[var(--color-charcoal)] border-2 border-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white',
    outline: 'bg-white text-[var(--color-charcoal)] border border-[var(--color-stone)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${
        fullWidth ? 'w-full' : ''
      } ${className}`}
      {...props}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};
