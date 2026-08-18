import React from 'react';
import Card from '../ui/Card';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function KPIStatCard({ title, value, change, isPositive = true, subtitle, icon: Icon, color = '#2D8CFF' }) {
  return (
    <Card className="flex items-center justify-between">
      <div className="space-y-1">
        <span className="text-xs text-[#948e9c] uppercase font-semibold">{title}</span>
        <div className="font-headline font-extrabold text-2xl text-white">{value}</div>
        <div className="flex items-center gap-1 text-[11px]">
          <span className={`font-bold flex items-center gap-0.5 ${isPositive ? 'text-[#22C55E]' : 'text-[#ffb4ab]'}`}>
            {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            {change}
          </span>
          <span className="text-[#948e9c]">{subtitle || 'vs yesterday'}</span>
        </div>
      </div>

      {Icon && (
        <div className="p-3.5 rounded-2xl shrink-0" style={{ backgroundColor: `${color}20`, color }}>
          <Icon className="w-6 h-6" />
        </div>
      )}
    </Card>
  );
}
