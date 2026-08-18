import React, { useState } from 'react';
import { Car, Zap, Clock, Wrench, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function StationTwin({ selectedBayId, onSelectBay }) {
  const [activeBay, setActiveBay] = useState(selectedBayId || 'A2');

  const bays = [
    { id: 'A1', name: 'Bay A1', type: '150 kW DC Fast', status: 'occupied', vehicle: 'Hyundai Ioniq 5', soc: 64, power: '142 kW' },
    { id: 'A2', name: 'Bay A2', type: '150 kW DC Fast', status: 'available', price: '₹14/kWh', recommended: true },
    { id: 'A3', name: 'Bay A3', type: '22 kW AC Type 2', status: 'reserved', durationLeft: '12 min left' },
    { id: 'A4', name: 'Bay A4', type: '150 kW DC Fast', status: 'available', price: '₹14/kWh' },
    { id: 'B1', name: 'Bay B1', type: '350 kW NACS', status: 'occupied', vehicle: 'Tesla Model Y', soc: 88, power: '210 kW' },
    { id: 'B2', name: 'Bay B2', type: '350 kW NACS', status: 'available', price: '₹16/kWh' },
    { id: 'B3', name: 'Bay B3', type: '150 kW DC Fast', status: 'maintenance', issue: 'Sensor Calibration' },
    { id: 'B4', name: 'Bay B4', type: '22 kW AC Type 2', status: 'available', price: '₹12/kWh' },
  ];

  const handleSelect = (bay) => {
    setActiveBay(bay.id);
    if (onSelectBay) onSelectBay(bay);
  };

  const getStatusStyles = (status, isSelected) => {
    switch (status) {
      case 'available':
        return {
          bg: 'bg-[#22C55E]/10 hover:bg-[#22C55E]/20',
          border: isSelected ? 'border-[#22C55E] ring-2 ring-[#22C55E]/30' : 'border-[#22C55E]/40',
          badge: 'bg-[#22C55E]/20 text-[#22C55E]',
          icon: Zap,
          text: 'Available',
        };
      case 'occupied':
        return {
          bg: 'bg-[#2D8CFF]/10',
          border: 'border-[#2D8CFF]/30 opacity-90',
          badge: 'bg-[#2D8CFF]/20 text-[#36D8FF]',
          icon: Car,
          text: 'Charging',
        };
      case 'reserved':
        return {
          bg: 'bg-[#8B5CF6]/10',
          border: 'border-[#8B5CF6]/30',
          badge: 'bg-[#8B5CF6]/20 text-[#c084fc]',
          icon: Clock,
          text: 'Reserved',
        };
      case 'maintenance':
        return {
          bg: 'bg-[#F59E0B]/10',
          border: 'border-[#F59E0B]/30 opacity-70',
          badge: 'bg-[#F59E0B]/20 text-[#fbbf24]',
          icon: Wrench,
          text: 'Offline',
        };
      default:
        return {};
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Header telemetry info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-[#36D8FF]">
          <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-ping" />
          <span className="font-semibold uppercase tracking-wider">Station Digital Twin (Live Hardware Telemetry)</span>
        </div>
        <span className="text-[11px] text-[#948e9c]">Updated live 0.4s ago</span>
      </div>

      {/* Grid of 8 Bays */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {bays.map((bay) => {
          const isSelected = activeBay === bay.id;
          const style = getStatusStyles(bay.status, isSelected);
          const Icon = style.icon;

          return (
            <button
              key={bay.id}
              type="button"
              onClick={() => handleSelect(bay)}
              className={`p-3.5 rounded-2xl border text-left transition-all duration-200 relative overflow-hidden group ${style.bg} ${style.border}`}
            >
              {bay.recommended && (
                <div className="absolute top-0 right-0 bg-[#22C55E] text-slate-950 text-[9px] font-bold px-2 py-0.5 rounded-bl-lg uppercase tracking-wider">
                  AI Recommended
                </div>
              )}

              <div className="flex items-center justify-between mb-2">
                <span className="font-headline font-extrabold text-white text-base">{bay.name}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${style.badge}`}>
                  {style.text}
                </span>
              </div>

              <div className="text-[11px] text-[#cbc4d2] font-medium mb-2">{bay.type}</div>

              {bay.status === 'available' && (
                <div className="text-xs font-bold text-[#22C55E] flex items-center justify-between">
                  <span>{bay.price}</span>
                  <span className="text-[10px] text-[#948e9c]">Tap to book</span>
                </div>
              )}

              {bay.status === 'occupied' && (
                <div className="text-[11px] text-[#36D8FF] space-y-0.5">
                  <div>{bay.vehicle}</div>
                  <div className="flex items-center justify-between text-[10px] text-[#948e9c]">
                    <span>SoC: {bay.soc}%</span>
                    <span>{bay.power}</span>
                  </div>
                </div>
              )}

              {bay.status === 'reserved' && (
                <div className="text-[10px] text-[#c084fc] flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{bay.durationLeft}</span>
                </div>
              )}

              {bay.status === 'maintenance' && (
                <div className="text-[10px] text-[#fbbf24] flex items-center gap-1">
                  <Wrench className="w-3 h-3" />
                  <span>{bay.issue}</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Legend Bar */}
      <div className="bg-[#1d1b20] border border-[#494551]/40 rounded-xl p-3 flex flex-wrap items-center justify-around gap-3 text-xs text-[#cbc4d2]">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#22C55E] shadow-sm shadow-[#22C55E]/50" />
          <span>Available (4)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#2D8CFF] shadow-sm shadow-[#2D8CFF]/50" />
          <span>Occupied (2)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#8B5CF6] shadow-sm shadow-[#8B5CF6]/50" />
          <span>Reserved (1)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#F59E0B] shadow-sm shadow-[#F59E0B]/50" />
          <span>Maintenance (1)</span>
        </div>
      </div>
    </div>
  );
}
