import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'amber';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-mistWhite disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';

  const variants = {
    primary:
      'bg-clearSky text-deepAtmosphere font-semibold hover:brightness-105 active:scale-[0.98] shadow-xs focus:ring-clearSky',
    secondary:
      'bg-white text-deepAtmosphere border border-slateInk/20 hover:bg-mistWhite hover:border-slateInk/40 active:scale-[0.98] focus:ring-slateInk',
    danger:
      'bg-alertRust text-white font-semibold hover:brightness-105 active:scale-[0.98] shadow-xs focus:ring-alertRust',
    amber:
      'bg-hazyAmber text-deepAtmosphere font-semibold hover:brightness-105 active:scale-[0.98] focus:ring-hazyAmber',
    ghost:
      'text-deepAtmosphere hover:bg-slateInk/10 focus:ring-slateInk/30',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2.5',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : leftIcon ? (
        <span className="shrink-0">{leftIcon}</span>
      ) : null}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
};
