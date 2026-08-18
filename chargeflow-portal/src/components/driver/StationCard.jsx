import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../ui/Card';
import Button from '../ui/Button';
import EnergyBadge from '../ui/EnergyBadge';
import { Star, MapPin, Zap, Clock, ShieldCheck, ArrowRight } from 'lucide-react';

export default function StationCard({ station, onSelect }) {
  const {
    id = 'stn-01',
    name = 'ChargeFlow Hub - MG Road',
    address = 'MG Road Metro Station Complex, Bengaluru',
    rating = 4.8,
    reviewsCount = 124,
    distance = '2.4 km',
    eta = '8 min drive',
    slotsAvailable = 4,
    totalSlots = 8,
    price = '₹14/kWh',
    maxPower = '150 kW DC Fast',
    renewablePercent = 88,
    connectors = ['CCS2', 'NACS', 'Type 2'],
  } = station || {};

  return (
    <Card className="hover:border-[#cfbcff]/50 transition-all duration-300 group flex flex-col justify-between h-full">
      <div className="space-y-3">
        {/* Header bar */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-[#e7c365] bg-[#e7c365]/10 px-2 py-0.5 rounded-md mb-1">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{rating}</span>
              <span className="text-[#948e9c]">({reviewsCount})</span>
            </span>
            <h3 className="font-headline font-bold text-lg text-white group-hover:text-[#cfbcff] transition-colors leading-snug">
              {name}
            </h3>
            <div className="flex items-center gap-1.5 text-xs text-[#948e9c] mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-[#36D8FF] shrink-0" />
              <span className="truncate">{address}</span>
            </div>
          </div>

          <span className="text-xs font-extrabold text-[#22C55E] bg-[#22C55E]/15 border border-[#22C55E]/30 px-2.5 py-1 rounded-full whitespace-nowrap">
            {slotsAvailable}/{totalSlots} Free
          </span>
        </div>

        {/* Energy badge & power specs */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <EnergyBadge renewablePercent={renewablePercent} />
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[#211f24] text-[#cfbcff] border border-[#494551]/60">
            {maxPower}
          </span>
        </div>

        {/* Connectors & Pricing */}
        <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-[#494551]/40">
          <div>
            <span className="text-[#948e9c] block text-[10px] uppercase">Rate</span>
            <span className="font-bold text-white text-sm">{price}</span>
          </div>
          <div>
            <span className="text-[#948e9c] block text-[10px] uppercase">Distance & ETA</span>
            <span className="font-semibold text-[#cbc4d2]">{distance} • {eta}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 pt-4 mt-4 border-t border-[#494551]/40">
        <Link to={`/driver/station/${id}`} className="flex-1">
          <Button variant="secondary" fullWidth size="sm">
            Station Specs
          </Button>
        </Link>
        <Link to={`/driver/station/${id}/book`} className="flex-1">
          <Button variant="primary" fullWidth size="sm" icon={ArrowRight} iconPosition="right">
            Book Slot
          </Button>
        </Link>
      </div>
    </Card>
  );
}
