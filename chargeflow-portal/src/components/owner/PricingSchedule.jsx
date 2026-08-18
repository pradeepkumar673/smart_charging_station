import React, { useState } from 'react';
import { DollarSign, Clock, Zap } from 'lucide-react';

export default function PricingSchedule() {
  const hours = Array.from({ length: 24 }, (_, i) => i);

  // Default schedule: 0-6 Off-peak, 6-18 Normal, 18-22 Peak, 22-24 Off-peak
  const getBand = (hour) => {
    if (hour >= 18 && hour <= 21) return { label: 'Peak Rate (₹18)', color: 'bg-[#ffb4ab]/30 border-[#ffb4ab] text-[#ffb4ab]' };
    if (hour >= 0 && hour <= 5) return { label: 'Off-Peak (₹11)', color: 'bg-[#22C55E]/30 border-[#22C55E] text-[#22C55E]' };
    return { label: 'Normal (₹14)', color: 'bg-[#2D8CFF]/30 border-[#2D8CFF] text-[#36D8FF]' };
  };

  return (
    <div className="bg-[#1d1b20] border border-[#494551]/60 rounded-2xl p-4 sm:p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold text-[#36D8FF]">
          <Clock className="w-4 h-4" />
          <span>24-Hour Time-of-Use Pricing Bands</span>
        </div>
        <div className="flex items-center gap-3 text-[10px]">
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-[#22C55E]" /> Off-Peak ₹11</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-[#2D8CFF]" /> Normal ₹14</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-[#ffb4ab]" /> Peak ₹18</span>
        </div>
      </div>

      <div className="grid grid-cols-6 sm:grid-cols-12 gap-1.5 pt-2">
        {hours.map((h) => {
          const band = getBand(h);
          return (
            <div
              key={h}
              className={`p-2 rounded-xl border text-center transition-transform hover:scale-105 cursor-pointer ${band.color}`}
            >
              <span className="text-[10px] font-mono block">{h}:00</span>
              <span className="text-[9px] font-bold block mt-0.5">{h >= 18 && h <= 21 ? '₹18' : h < 6 ? '₹11' : '₹14'}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
