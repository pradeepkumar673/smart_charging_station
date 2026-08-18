import React, { useState, useEffect } from 'react';
import { Car, Zap, Clock, Wrench } from 'lucide-react';
import api from '../../services/api';
import TwinSkeleton from '../ui/TwinSkeleton';

export default function StationTwin({ stationId, selectedBayId, onSelectBay }) {
  const [bays, setBays] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeBay, setActiveBay] = useState(selectedBayId || '');
  const [liveCounts, setLiveCounts] = useState({ available: 0, occupied: 0, reserved: 0, maintenance: 0 });

  useEffect(() => {
    async function fetchTwinData() {
      if (!stationId) return;
      setLoading(true);
      try {
        const response = await api.get(`/stations/${stationId}/twin`);
        const { slots, summary: counts } = response.data?.data || {};
        if (slots) {
          const mappedSlots = slots.map((s, idx) => ({
            id: s._id || s.slotId,
            slotId: s.slotId,
            name: `Bay ${s.slotId}`,
            type: `${s.maxPowerKw || 60} kW ${s.chargerType || 'DC'} (${s.connectorType || 'CCS2'})`,
            status: s.status || 'available',
            recommended: idx === 0,
            raw: s,
          }));
          setBays(mappedSlots);
          if (mappedSlots.length > 0 && !activeBay) {
            setActiveBay(mappedSlots[0].id);
          }
        }
        if (counts) {
          setLiveCounts(counts);
        }
      } catch (err) {
        console.error('Failed to load twin data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchTwinData();
  }, [stationId]);

  const handleSelect = (bay) => {
    setActiveBay(bay.id || bay.slotId);
    if (onSelectBay) onSelectBay(bay.raw || bay);
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
      case 'offline':
        return {
          bg: 'bg-[#F59E0B]/10',
          border: 'border-[#F59E0B]/30 opacity-70',
          badge: 'bg-[#F59E0B]/20 text-[#fbbf24]',
          icon: Wrench,
          text: 'Offline',
        };
      default:
        return {
          bg: 'bg-[#22C55E]/10',
          border: 'border-[#22C55E]/40',
          badge: 'bg-[#22C55E]/20 text-[#22C55E]',
          icon: Zap,
          text: 'Available',
        };
    }
  };

  if (loading) {
    return <TwinSkeleton />;
  }

  const displayBays = bays;

  return (
    <div className="w-full space-y-4">
      {/* Header telemetry info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-[#36D8FF]">
          <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-ping" />
          <span className="font-semibold uppercase tracking-wider">Station Digital Twin (Live Hardware Telemetry)</span>
        </div>
        <span className="text-[11px] text-[#948e9c]">Updated live via WebSocket</span>
      </div>

      {/* Grid of Bays */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {displayBays.map((bay) => {
          const isSelected = activeBay === (bay.id || bay.slotId) || selectedBayId === (bay.id || bay.slotId);
          const style = getStatusStyles(bay.status, isSelected);

          return (
            <button
              key={bay.id || bay.slotId}
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
                  <span>Tap to select</span>
                </div>
              )}

              {bay.status === 'occupied' && (
                <div className="text-[11px] text-[#36D8FF]">
                  <span>Charging Active</span>
                </div>
              )}

              {bay.status === 'reserved' && (
                <div className="text-[10px] text-[#c084fc] flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>Reserved</span>
                </div>
              )}

              {(bay.status === 'maintenance' || bay.status === 'offline') && (
                <div className="text-[10px] text-[#fbbf24] flex items-center gap-1">
                  <Wrench className="w-3 h-3" />
                  <span>Maintenance</span>
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
          <span>Available ({liveCounts.available || displayBays.filter(b => b.status === 'available').length})</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#2D8CFF] shadow-sm shadow-[#2D8CFF]/50" />
          <span>Occupied ({liveCounts.occupied || displayBays.filter(b => b.status === 'occupied').length})</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#8B5CF6] shadow-sm shadow-[#8B5CF6]/50" />
          <span>Reserved ({liveCounts.reserved || displayBays.filter(b => b.status === 'reserved').length})</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#F59E0B] shadow-sm shadow-[#F59E0B]/50" />
          <span>Maintenance ({liveCounts.maintenance || displayBays.filter(b => b.status === 'maintenance' || b.status === 'offline').length})</span>
        </div>
      </div>
    </div>
  );
}
