import React from 'react';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  disabled = false,
  type = 'button',
  onClick,
  icon: Icon,
  iconPosition = 'left',
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#141218] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-gradient-to-r from-[#6750a4] to-[#4f378a] hover:from-[#7c63be] hover:to-[#5c429f] text-white shadow-lg shadow-[#6750a4]/25 focus:ring-[#cfbcff]',
    secondary: 'bg-[#2b292f] hover:bg-[#36343a] text-[#e6e0e9] border border-[#494551] focus:ring-[#948e9c]',
    brand: 'bg-gradient-to-r from-[#2D8CFF] to-[#36D8FF] hover:from-[#1b79ee] hover:to-[#22c5ee] text-slate-950 font-bold shadow-lg shadow-[#2D8CFF]/25 focus:ring-[#36D8FF]',
    outline: 'border-1.5 border-[#6750a4] text-[#cfbcff] hover:bg-[#6750a4]/15 focus:ring-[#cfbcff]',
    ghost: 'text-[#cbc4d2] hover:bg-[#2b292f] hover:text-white focus:ring-[#494551]',
    destructive: 'bg-[#93000a] hover:bg-[#b3141f] text-[#ffdad6] focus:ring-[#ffb4ab]',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-5 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3.5 text-base gap-2.5 font-semibold',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
      {...props}
    >
      {Icon && iconPosition === 'left' && <Icon className="w-4 h-4 shrink-0" />}
      <span>{children}</span>
      {Icon && iconPosition === 'right' && <Icon className="w-4 h-4 shrink-0" />}
    </button>
  );
}
