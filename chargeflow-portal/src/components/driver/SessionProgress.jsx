import React from 'react';
import { Zap } from 'lucide-react';

export default function SessionProgress({ currentSoc = 64, targetSoc = 80, powerKw = 54 }) {
  const radius = 90;
  const stroke = 12;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (currentSoc / 100) * circumference;

  return (
    <div className="relative w-64 h-64 flex items-center justify-center mx-auto">
      <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
        {/* Background Track */}
        <circle
          stroke="rgba(73, 69, 81, 0.3)"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        {/* Animated Active Progress Fill */}
        <circle
          stroke="url(#progressGlow)"
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset }}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className="transition-all duration-1000 ease-out"
        />
        <defs>
          <linearGradient id="progressGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#36D8FF" />
            <stop offset="100%" stopColor="#22C55E" />
          </linearGradient>
        </defs>
      </svg>

      {/* Central Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center space-y-1">
        <div className="flex items-center gap-1 text-xs font-bold text-[#22C55E] bg-[#22C55E]/15 px-2.5 py-0.5 rounded-full">
          <Zap className="w-3.5 h-3.5 fill-current animate-pulse" />
          <span>{powerKw} kW Live</span>
        </div>
        <div className="font-headline font-extrabold text-5xl text-white tracking-tight">
          {currentSoc}<span className="text-2xl text-[#36D8FF]">%</span>
        </div>
        <div className="text-xs text-[#948e9c]">Target: {targetSoc}%</div>
      </div>
    </div>
  );
}
