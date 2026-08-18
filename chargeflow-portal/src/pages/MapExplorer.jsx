import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DriverSidebar from '../components/layout/DriverSidebar';
import DriverHeader from '../components/layout/DriverHeader';
import MapPanel from '../components/driver/MapPanel';
import FilterChips from '../components/driver/FilterChips';
import StationCard from '../components/driver/StationCard';
import EnergyBadge from '../components/ui/EnergyBadge';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { Search, MapPin, List, Map as MapIcon, SlidersHorizontal, Star, Zap, Navigation, ArrowRight, X } from 'lucide-react';

export default function MapExplorer() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState('map'); // 'map' or 'list'
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [selectedStation, setSelectedStation] = useState(null);

  const stations = [
    { id: 'stn-01', name: 'ChargeFlow Hub - MG Road', address: 'MG Road Metro Complex', rating: 4.9, reviewsCount: 184, distance: '2.4 km', eta: '8 min', slotsAvailable: 4, totalSlots: 8, price: '₹14/kWh', maxPower: '150 kW DC Fast', pinColor: '#22C55E', lat: 38, lng: 48, renewablePercent: 92 },
    { id: 'stn-02', name: 'Indiranagar Supercharge', address: '100 Feet Rd, Indiranagar', rating: 4.8, reviewsCount: 96, distance: '1.1 km', eta: '4 min', slotsAvailable: 2, totalSlots: 6, price: '₹15/kWh', maxPower: '350 kW NACS', pinColor: '#2D8CFF', lat: 55, lng: 32, renewablePercent: 85 },
    { id: 'stn-03', name: 'Koramangala Green Hub', address: '5th Block Koramangala', rating: 4.7, reviewsCount: 210, distance: '4.8 km', eta: '14 min', slotsAvailable: 5, totalSlots: 10, price: '₹12/kWh', maxPower: '60 kW CCS2', pinColor: '#22C55E', lat: 72, lng: 68, renewablePercent: 100 },
    { id: 'stn-04', name: 'Whitefield Tech Bay', address: 'ITPL Main Road, Whitefield', rating: 4.6, reviewsCount: 78, distance: '8.2 km', eta: '22 min', slotsAvailable: 1, totalSlots: 8, price: '₹16/kWh', maxPower: '150 kW DC Fast', pinColor: '#F59E0B', lat: 25, lng: 80, renewablePercent: 78 },
  ];

  return (
    <div className="min-h-screen bg-[#141218] text-[#e6e0e9] flex">
      <DriverSidebar mobileOpen={mobileSidebarOpen} setMobileOpen={setMobileSidebarOpen} />

      <div className="flex-1 flex flex-col lg:pl-64 min-w-0 h-screen overflow-hidden">
        <DriverHeader setMobileSidebarOpen={setMobileSidebarOpen} />

        {/* Top Control Bar */}
        <div className="bg-[#1d1b20] border-b border-[#494551]/40 px-4 sm:px-6 py-3 space-y-3 shrink-0">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Search Bar */}
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#948e9c]" />
              <input
                type="text"
                placeholder="Search Bengaluru, station name, or landmark..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#141218] border border-[#494551] text-xs text-white placeholder-[#948e9c] focus:outline-none focus:border-[#36D8FF]"
              />
            </div>

            {/* View Switcher & Filter Trigger */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
              <div className="flex items-center bg-[#141218] p-1 rounded-xl border border-[#494551]/60">
                <button
                  type="button"
                  onClick={() => setViewMode('map')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    viewMode === 'map' ? 'bg-[#6750a4] text-white shadow' : 'text-[#cbc4d2] hover:text-white'
                  }`}
                >
                  <MapIcon className="w-3.5 h-3.5" />
                  <span>Map</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    viewMode === 'list' ? 'bg-[#6750a4] text-white shadow' : 'text-[#cbc4d2] hover:text-white'
                  }`}
                >
                  <List className="w-3.5 h-3.5" />
                  <span>List ({stations.length})</span>
                </button>
              </div>

              <Button
                variant="secondary"
                size="sm"
                icon={SlidersHorizontal}
                onClick={() => setFilterDrawerOpen(true)}
              >
                Filters
              </Button>
            </div>
          </div>

          {/* Quick Filter Chips */}
          <FilterChips />
        </div>

        {/* Main Explorer Body */}
        <div className="flex-1 relative overflow-hidden flex">
          {viewMode === 'map' ? (
            <div className="w-full h-full relative p-4">
              <MapPanel
                stations={stations}
                selectedStation={selectedStation}
                onSelectStation={(stn) => setSelectedStation(stn)}
              />

              {/* Selected Station Bottom Drawer Preview */}
              {selectedStation && (
                <div className="absolute bottom-6 left-6 right-6 max-w-lg mx-auto bg-[#1d1b20]/95 backdrop-blur-xl border border-[#36D8FF]/50 p-5 rounded-2xl shadow-2xl space-y-3 z-30 animate-fadeIn">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#e7c365] flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-current" /> {selectedStation.rating}
                        </span>
                        <EnergyBadge renewablePercent={selectedStation.renewablePercent} />
                      </div>
                      <h3 className="font-headline font-bold text-xl text-white mt-1">
                        {selectedStation.name}
                      </h3>
                      <p className="text-xs text-[#948e9c]">{selectedStation.address}</p>
                    </div>

                    <button
                      onClick={() => setSelectedStation(null)}
                      className="p-1.5 rounded-lg bg-[#211f24] text-[#948e9c] hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-[#494551]/40">
                    <span className="text-[#22C55E] font-bold">{selectedStation.slotsAvailable} Slots Available</span>
                    <span className="text-white font-semibold">{selectedStation.price}</span>
                    <span className="text-[#948e9c]">{selectedStation.distance} • {selectedStation.eta}</span>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <Link to={`/driver/station/${selectedStation.id}`} className="flex-1">
                      <Button variant="secondary" fullWidth size="sm">
                        View Details
                      </Button>
                    </Link>
                    <Link to={`/driver/station/${selectedStation.id}/book`} className="flex-1">
                      <Button variant="brand" fullWidth size="sm" icon={ArrowRight} iconPosition="right">
                        Book Slot
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="w-full h-full overflow-y-auto p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stations.map((stn) => (
                <StationCard key={stn.id} station={stn} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Filter Side Drawer Modal */}
      {filterDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-[#1d1b20] border-l border-[#494551] p-6 space-y-6 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-[#494551]/40 pb-4">
                <h3 className="font-headline font-bold text-xl text-white">Filter Charging Stations</h3>
                <button
                  onClick={() => setFilterDrawerOpen(false)}
                  className="p-2 rounded-lg bg-[#211f24] text-[#cbc4d2] hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Distance Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold text-[#cbc4d2]">
                  <span>Max Radius</span>
                  <span className="text-[#36D8FF]">10 km</span>
                </div>
                <input type="range" min="1" max="25" defaultValue="10" className="w-full accent-[#36D8FF]" />
              </div>

              {/* Connector Type */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase text-[#cbc4d2]">Connector Standard</label>
                <div className="grid grid-cols-2 gap-2">
                  {['CCS2 (Combo)', 'NACS (Tesla)', 'Type 2 AC', 'CHAdeMO'].map((type, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className={`p-2.5 rounded-xl border text-xs font-medium text-left ${
                        idx === 0 ? 'border-[#36D8FF] bg-[#36D8FF]/15 text-white' : 'border-[#494551] text-[#cbc4d2]'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Minimum Rating */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase text-[#cbc4d2]">Minimum Rating</label>
                <div className="flex items-center gap-2">
                  {['3.5+', '4.0+', '4.5+', '4.8+'].map((r, i) => (
                    <button
                      key={i}
                      type="button"
                      className={`flex-1 py-2 rounded-xl border text-xs font-bold ${
                        i === 2 ? 'border-[#e7c365] bg-[#e7c365]/20 text-[#e7c365]' : 'border-[#494551] text-[#948e9c]'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-[#494551]/40">
              <Button variant="secondary" fullWidth onClick={() => setFilterDrawerOpen(false)}>
                Reset
              </Button>
              <Button variant="brand" fullWidth onClick={() => setFilterDrawerOpen(false)}>
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
