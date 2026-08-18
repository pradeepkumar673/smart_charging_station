import React, { useState } from 'react';
import { Zap, MapPin, Gauge, DollarSign, Star, Sun, Filter } from 'lucide-react';

export default function FilterChips({ onFilterChange, activeFilters = [] }) {
  const [selected, setSelected] = useState(activeFilters.length > 0 ? activeFilters : ['available']);

  const chips = [
    { id: 'available', label: 'Available Now', icon: Zap },
    { id: 'near', label: 'Within 5 km', icon: MapPin },
    { id: 'fast', label: 'Fast Charging (150kW+)', icon: Gauge },
    { id: 'cheap', label: 'Under ₹15/kWh', icon: DollarSign },
    { id: 'top_rated', label: '4.5+ Rating', icon: Star },
    { id: 'green', label: '100% Renewable', icon: Sun },
  ];

  const toggleFilter = (id) => {
    let next;
    if (selected.includes(id)) {
      next = selected.filter((item) => item !== id);
    } else {
      next = [...selected, id];
    }
    setSelected(next);
    if (onFilterChange) onFilterChange(next);
  };

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#211f24] border border-[#494551]/60 text-xs font-semibold text-[#cbc4d2] shrink-0">
        <Filter className="w-3.5 h-3.5 text-[#cfbcff]" />
        <span>Filters ({selected.length})</span>
      </div>

      {chips.map((chip) => {
        const Icon = chip.icon;
        const isActive = selected.includes(chip.id);
        return (
          <button
            key={chip.id}
            type="button"
            onClick={() => toggleFilter(chip.id)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 shrink-0 ${
              isActive
                ? 'bg-gradient-to-r from-[#6750a4] to-[#2D8CFF] text-white shadow-md shadow-[#6750a4]/30'
                : 'bg-[#1d1b20] border border-[#494551]/60 text-[#cbc4d2] hover:border-[#cfbcff]/50 hover:text-white'
            }`}
          >
            <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-[#948e9c]'}`} />
            <span>{chip.label}</span>
          </button>
        );
      })}
    </div>
  );
}
