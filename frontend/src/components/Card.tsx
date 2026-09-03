import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
  variant?: 'light' | 'dark' | 'glass';
}

export const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  action,
  className = '',
  headerClassName = '',
  bodyClassName = '',
  variant = 'light',
}) => {
  const variantStyles = {
    light: 'bg-white text-deepAtmosphere border border-slateInk/15 shadow-xs',
    dark: 'bg-deepAtmosphere text-mistWhite border border-slateInk/20 shadow-md',
    glass: 'bg-white/80 backdrop-blur-md text-deepAtmosphere border border-slateInk/15 shadow-xs',
  };

  return (
    <div className={`rounded-2xl transition-all duration-200 overflow-hidden ${variantStyles[variant]} ${className}`}>
      {(title || subtitle || action) && (
        <div className={`px-5 py-4 border-b border-slateInk/10 flex items-center justify-between ${headerClassName}`}>
          <div>
            {title && typeof title === 'string' ? (
              <h3 className="font-display font-semibold text-lg tracking-tight">{title}</h3>
            ) : (
              title
            )}
            {subtitle && <p className="text-xs text-slateInk mt-0.5 font-normal font-sans">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className={`p-5 ${bodyClassName}`}>{children}</div>
    </div>
  );
};
