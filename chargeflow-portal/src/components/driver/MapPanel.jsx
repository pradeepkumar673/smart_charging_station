import React, { useState } from 'react';
import { MapPin, Navigation, Zap, Layers, Compass, Plus, Minus } from 'lucide-react';

export default function MapPanel({
  stations = [],
  selectedStation,
  onSelectStation,
  showRoute = false,
  origin = 'Indiranagar, Bengaluru',
  destination = 'ChargeFlow Hub - MG Road',
}) {
  const [zoom, setZoom] = useState(14);

  const defaultStations = [
    { id: 'stn-01', name: 'ChargeFlow Hub - MG Road', status: 'available', slotsAvailable: 4, distance: '2.4 km', pinColor: '#22C55E', lat: 35, lng: 45, price: '₹14/kWh', fast: '150 kW' },
    { id: 'stn-02', name: 'Indiranagar Supercharge', status: 'available', slotsAvailable: 2, distance: '1.1 km', pinColor: '#2D8CFF', lat: 55, lng: 30, price: '₹15/kWh', fast: '350 kW' },
    { id: 'stn-03', name: 'Koramangala Green Hub', status: 'reserved', slotsAvailable: 0, distance: '4.8 km', pinColor: '#8B5CF6', lat: 70, lng: 65, price: '₹12/kWh', fast: '60 kW' },
    { id: 'stn-04', name: 'Whitefield Tech Bay', status: 'limited', slotsAvailable: 1, distance: '8.2 km', pinColor: '#F59E0B', lat: 25, lng: 75, price: '₹16/kWh', fast: '150 kW' },
  ];

  const mapStations = stations.length > 0 ? stations : defaultStations;

  return (
    <div className="relative w-full h-full min-h-[420px] rounded-2xl bg-[#0f0d13] border border-[#494551]/60 overflow-hidden shadow-2xl flex items-center justify-center">
      {/* Dark Map Canvas Background */}
      <svg className="absolute inset-0 w-full h-full text-[#211f24]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(73, 69, 81, 0.25)" strokeWidth="1" />
          </pattern>
          <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#36D8FF" />
            <stop offset="100%" stopColor="#22C55E" />
          </linearGradient>
        </defs>
        
        {/* Map Grid */}
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* Decorative Roads / Rivers */}
        <path d="M -50 150 Q 200 80 400 250 T 900 200" fill="none" stroke="rgba(103, 80, 164, 0.15)" strokeWidth="24" />
        <path d="M 200 -50 Q 300 300 250 600" fill="none" stroke="rgba(54, 216, 255, 0.15)" strokeWidth="16" />
        <path d="M 100 400 L 700 100" fill="none" stroke="rgba(148, 142, 156, 0.2)" strokeWidth="8" strokeDasharray="6,6" />

        {/* Route overlay when navigating */}
        {showRoute && (
          <g>
            <path
              d="M 180 320 C 240 220, 320 180, 450 140"
              fill="none"
              stroke="url(#routeGrad)"
              strokeWidth="6"
              strokeLinecap="round"
              className="animate-pulse"
            />
            {/* Origin Marker */}
            <circle cx="180" cy="320" r="10" fill="#36D8FF" className="animate-ping opacity-40" />
            <circle cx="180" cy="320" r="6" fill="#36D8FF" stroke="#ffffff" strokeWidth="2" />
          </g>
        )}
      </svg>

      {/* Interactive Pins */}
      <div className="absolute inset-0 pointer-events-none">
        {mapStations.map((stn) => {
          const isSelected = selectedStation?.id === stn.id;
          return (
            <div
              key={stn.id}
              style={{ left: `${stn.lng}%`, top: `${stn.lat}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer group"
              onClick={() => onSelectStation && onSelectStation(stn)}
            >
              {/* Pulsing ring */}
              <div
                className="w-10 h-10 rounded-full absolute -inset-1 opacity-40 animate-ping"
                style={{ backgroundColor: stn.pinColor }}
              />

              {/* Pin badge */}
              <div
                className={`relative px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-bold text-slate-950 shadow-lg transition-transform duration-200 ${
                  isSelected ? 'scale-125 ring-4 ring-white' : 'group-hover:scale-110'
                }`}
                style={{ backgroundColor: stn.pinColor }}
              >
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>{stn.slotsAvailable} Bays</span>
              </div>

              {/* Tooltip on hover */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-[#1d1b20] border border-[#494551] text-white text-xs px-2.5 py-1 rounded-lg whitespace-nowrap shadow-xl z-20">
                <div className="font-bold">{stn.name}</div>
                <div className="text-[10px] text-[#948e9c]">{stn.distance} • {stn.price}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Map Overlay Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
        <button
          onClick={() => setZoom((z) => Math.min(z + 1, 18))}
          className="p-2.5 rounded-xl bg-[#211f24]/90 border border-[#494551]/60 text-white hover:bg-[#36343a] shadow-lg"
        >
          <Plus className="w-4 h-4" />
        </button>
        <button
          onClick={() => setZoom((z) => Math.max(z - 1, 10))}
          className="p-2.5 rounded-xl bg-[#211f24]/90 border border-[#494551]/60 text-white hover:bg-[#36343a] shadow-lg"
        >
          <Minus className="w-4 h-4" />
        </button>
        <button className="p-2.5 rounded-xl bg-[#211f24]/90 border border-[#494551]/60 text-[#36D8FF] hover:bg-[#36343a] shadow-lg">
          <Compass className="w-4 h-4 animate-spin-slow" />
        </button>
      </div>

      {/* Bottom map location tag */}
      <div className="absolute bottom-4 left-4 bg-[#141218]/90 backdrop-blur-md border border-[#494551]/60 px-3.5 py-2 rounded-xl text-xs font-semibold text-white flex items-center gap-2 z-10 shadow-lg">
        <Navigation className="w-4 h-4 text-[#36D8FF]" />
        <span>{origin}</span>
      </div>
    </div>
  );
}
