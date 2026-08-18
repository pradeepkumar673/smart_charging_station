import React from 'react';
import { Activity } from 'lucide-react';

export default function ChargingCurveChart() {
  const points = [
    { min: '0m', kw: 20 },
    { min: '5m', kw: 110 },
    { min: '10m', kw: 142 },
    { min: '15m', kw: 138 },
    { min: '20m', kw: 95 },
    { min: '25m', kw: 54 },
    { min: '28m', kw: 54 },
  ];

  return (
    <div className="w-full bg-[#1d1b20] border border-[#494551]/60 rounded-2xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold text-[#36D8FF]">
          <Activity className="w-4 h-4" />
          <span>Charging Power Curve (kW vs Time)</span>
        </div>
        <span className="text-[10px] text-[#948e9c]">Peak 142 kW @ 10m</span>
      </div>

      <div className="h-32 w-full relative flex items-end justify-between pt-4 pb-2 px-2 border-b border-[#494551]/40">
        {/* Simple SVG Chart Line */}
        <svg className="absolute inset-0 w-full h-full p-2 overflow-visible" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M 10 90 Q 60 10, 120 15 T 240 60 T 360 60"
            fill="none"
            stroke="#36D8FF"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>

        {points.map((p, i) => (
          <div key={i} className="flex flex-col items-center gap-1 z-10">
            <span className="text-[9px] font-bold text-[#36D8FF] bg-[#141218] px-1 rounded">{p.kw}kW</span>
            <span className="text-[9px] text-[#948e9c]">{p.min}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
