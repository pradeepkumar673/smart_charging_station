import React from 'react';
import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';

export default function Logo({ size = 'md', showText = true, className = '' }) {
  const iconSizes = {
    sm: 'w-5 h-5',
    md: 'w-7 h-7',
    lg: 'w-10 h-10',
  };

  const badgeSizes = {
    sm: 'p-1.5 rounded-lg',
    md: 'p-2 rounded-xl',
    lg: 'p-3 rounded-2xl',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-3xl',
  };

  return (
    <Link to="/" className={`inline-flex items-center gap-3 group transition-transform active:scale-95 ${className}`}>
      <div className={`bg-gradient-to-tr from-[#6750a4] via-[#2D8CFF] to-[#36D8FF] text-white ${badgeSizes[size]} shadow-lg shadow-[#6750a4]/30 group-hover:shadow-[#36D8FF]/40 transition-all duration-300 relative overflow-hidden`}>
        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
        <Zap className={`${iconSizes[size]} fill-current text-white animate-pulse`} />
      </div>
      {showText && (
        <span className={`font-headline font-extrabold tracking-tight text-white ${textSizes[size]}`}>
          Charge<span className="text-[#cfbcff] group-hover:text-[#36D8FF] transition-colors">Flow</span>
        </span>
      )}
    </Link>
  );
}
