import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  interactive?: boolean;
  onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', interactive = false, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`
        relative
        /* Use 95% opacity - looks like glass but guarantees readability */
        bg-white/95 dark:bg-slate-900/95
        /* Subtle border for definition */
        border border-slate-200/50 dark:border-slate-700/50
        /* Apple-style shadow */
        shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)]
        rounded-3xl p-6
        transition-all duration-200 ease-out
        ${interactive ? 'cursor-pointer hover:shadow-lg hover:-translate-y-0.5' : ''}
        ${className}
      `}
    >
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};