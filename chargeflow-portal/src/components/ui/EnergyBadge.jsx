import React from 'react';
import { Sun, Wind, Zap } from 'lucide-react';

export default function EnergyBadge({ renewablePercent = 85, className = '' }) {
  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#22C55E]/15 border border-[#22C55E]/30 text-[#22C55E] text-xs font-semibold ${className}`}>
      <Sun className="w-3.5 h-3.5 text-[#e7c365] animate-spin-slow" />
      <span>{renewablePercent}% Green Energy</span>
    </div>
  );
}
