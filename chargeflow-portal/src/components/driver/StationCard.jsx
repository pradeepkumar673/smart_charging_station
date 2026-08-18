import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../ui/Card';
import Button from '../ui/Button';
import EnergyBadge from '../ui/EnergyBadge';
import { MapPin, Zap, ArrowRight } from 'lucide-react';

export default function StationCard({ station, onSelect }) {
  const {
    _id,
    id = _id,
    name = 'Charging Hub',
    address = 'Bengaluru',
    city = 'Bengaluru',
    basePricePerKWh = 14.5,
    availableSlotsCount = 0,
    totalSlotsCount = 0,
    totalSlots = totalSlotsCount || 6,
    renewableSharePct = 75,
    renewableMix,
    chargerTypes = ['DC', 'AC'],
  } = station || {};

  const stationId = _id || id;
  const freeSlots = availableSlotsCount !== undefined ? availableSlotsCount : 0;
  const totalBays = totalSlots || 0;
  const renewablePct = renewableSharePct || (renewableMix?.solarPct || 0) + (renewableMix?.windPct || 0) || 0;
  const priceDisplay = `₹${basePricePerKWh}/kWh`;
  const primaryPower = chargerTypes.includes('Rapid') ? '150 kW DC Rapid' : chargerTypes.includes('DC') ? '60 kW DC Fast' : '22 kW AC';

  return (
    <Card className="hover:border-[#cfbcff]/50 transition-all duration-300 group flex flex-col justify-between h-full">
      <div className="space-y-3">
        {/* Header bar */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-md mb-1 ${
              freeSlots > 0 ? 'text-[#22C55E] bg-[#22C55E]/10' : 'text-[#FFB4AB] bg-[#FFB4AB]/10'
            }`}>
              <Zap className="w-3.5 h-3.5" />
              <span>{freeSlots} Bays Free</span>
            </span>
            <h3 className="font-headline font-bold text-lg text-white group-hover:text-[#cfbcff] transition-colors leading-snug">
              {name}
            </h3>
            <div className="flex items-center gap-1.5 text-xs text-[#948e9c] mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-[#36D8FF] shrink-0" />
              <span className="truncate">{address}, {city}</span>
            </div>
          </div>

          <span className="text-xs text-[#948e9c] font-semibold">{totalBays} Total Bays</span>
        </div>

        {/* Energy badge & power specs */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <EnergyBadge renewablePercent={renewablePct} />
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[#211f24] text-[#cfbcff] border border-[#494551]/60">
            {primaryPower}
          </span>
        </div>

        {/* Connectors & Pricing */}
        <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-[#494551]/40">
          <div>
            <span className="text-[#948e9c] block text-[10px] uppercase font-semibold">Tariff Rate</span>
            <span className="font-bold text-white text-sm">{priceDisplay}</span>
          </div>
          <div>
            <span className="text-[#948e9c] block text-[10px] uppercase font-semibold">Charger Types</span>
            <span className="font-semibold text-[#cbc4d2]">{chargerTypes.join(', ')}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 pt-4 mt-4 border-t border-[#494551]/40">
        <Link to={`/driver/station/${stationId}`} className="flex-1">
          <Button variant="secondary" fullWidth size="sm">
            Station Specs
          </Button>
        </Link>
        <Link to={`/driver/station/${stationId}/book`} className="flex-1">
          <Button variant="primary" fullWidth size="sm" icon={ArrowRight} iconPosition="right">
            Book Slot
          </Button>
        </Link>
      </div>
    </Card>
  );
}
