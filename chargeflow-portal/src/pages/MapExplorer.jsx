import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import DriverSidebar from '../components/layout/DriverSidebar';
import DriverHeader from '../components/layout/DriverHeader';
import MapPanel from '../components/driver/MapPanel';
import FilterChips from '../components/driver/FilterChips';
import StationCard from '../components/driver/StationCard';
import StationCardSkeleton from '../components/ui/StationCardSkeleton';
import EnergyBadge from '../components/ui/EnergyBadge';
import Button from '../components/ui/Button';
import EmptyState from '../components/states/EmptyState';
import { Search, MapPin, List, Map as MapIcon, SlidersHorizontal, Star, ArrowRight, X } from 'lucide-react';
import api from '../services/api';
import useToast from '../hooks/useToast';

export default function MapExplorer() {
  const { showToast } = useToast();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState('map'); // 'map' or 'list'
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [selectedStation, setSelectedStation] = useState(null);

  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChargerType, setSelectedChargerType] = useState('');
  const [availableNowOnly, setAvailableNowOnly] = useState(false);
  const [renewableMin, setRenewableMin] = useState(0);

  const fetchStations = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (searchQuery.trim()) params.name = searchQuery.trim();
      if (selectedChargerType) params.chargerType = selectedChargerType;
      if (availableNowOnly) params.availableNow = true;
      if (renewableMin > 0) params.renewableMin = renewableMin;

      const response = await api.get('/stations', { params });
      const stationList = response.data?.data?.stations || [];
      setStations(stationList);
    } catch (err) {
      console.error('Failed to fetch stations:', err);
      showToast({
        title: 'Network Error',
        message: 'Could not load charging stations. Please check backend connection.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedChargerType, availableNowOnly, renewableMin, showToast]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchStations();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchStations]);

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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search station name or location in Bengaluru..."
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
          <FilterChips
            onSelectChargerType={(type) => setSelectedChargerType(type)}
            onToggleAvailableNow={(val) => setAvailableNowOnly(val)}
          />
        </div>

        {/* Main Explorer Body */}
        <div className="flex-1 relative overflow-hidden flex">
          {loading ? (
            <div className="w-full h-full p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto">
              <StationCardSkeleton />
              <StationCardSkeleton />
              <StationCardSkeleton />
              <StationCardSkeleton />
              <StationCardSkeleton />
              <StationCardSkeleton />
            </div>
          ) : stations.length === 0 ? (
            <div className="w-full h-full flex items-center justify-center p-6">
              <EmptyState
                type="stations"
                title="No Charging Stations Found"
                description="We couldn't find any operational EV stations matching your active filter criteria."
                actionLabel="Clear Filters"
                onAction={() => {
                  setSearchQuery('');
                  setSelectedChargerType('');
                  setAvailableNowOnly(false);
                  setRenewableMin(0);
                }}
              />
            </div>
          ) : viewMode === 'map' ? (
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
                          <Star className="w-3.5 h-3.5 fill-current" /> 4.9
                        </span>
                        <EnergyBadge renewablePercent={selectedStation.renewableSharePct || 75} />
                      </div>
                      <h3 className="font-headline font-bold text-xl text-white mt-1">
                        {selectedStation.name}
                      </h3>
                      <p className="text-xs text-[#948e9c]">{selectedStation.address}, {selectedStation.city}</p>
                    </div>

                    <button
                      onClick={() => setSelectedStation(null)}
                      className="p-1.5 rounded-lg bg-[#211f24] text-[#948e9c] hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-[#494551]/40">
                    <span className="text-[#22C55E] font-bold">
                      {selectedStation.availableSlotsCount || 0} Slots Available
                    </span>
                    <span className="text-white font-semibold">₹{selectedStation.basePricePerKWh}/kWh</span>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <Link to={`/driver/station/${selectedStation._id || selectedStation.id}`} className="flex-1">
                      <Button variant="secondary" fullWidth size="sm">
                        View Details
                      </Button>
                    </Link>
                    <Link to={`/driver/station/${selectedStation._id || selectedStation.id}/book`} className="flex-1">
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
                <StationCard key={stn._id || stn.id} station={stn} />
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

              {/* Min Renewable % Filter */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold text-[#cbc4d2]">
                  <span>Minimum Solar/Wind Ratio</span>
                  <span className="text-[#36D8FF]">{renewableMin}% Renewable</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="10"
                  value={renewableMin}
                  onChange={(e) => setRenewableMin(Number(e.target.value))}
                  className="w-full accent-[#36D8FF]"
                />
              </div>

              {/* Charger Type */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase text-[#cbc4d2]">Charger Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {['DC', 'AC', 'Fast', 'Rapid'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setSelectedChargerType(selectedChargerType === type ? '' : type)}
                      className={`p-2.5 rounded-xl border text-xs font-medium text-left ${
                        selectedChargerType === type
                          ? 'border-[#36D8FF] bg-[#36D8FF]/15 text-white'
                          : 'border-[#494551] text-[#cbc4d2]'
                      }`}
                    >
                      {type} Charger
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-[#494551]/40">
              <Button
                variant="secondary"
                fullWidth
                onClick={() => {
                  setSearchQuery('');
                  setSelectedChargerType('');
                  setAvailableNowOnly(false);
                  setRenewableMin(0);
                  setFilterDrawerOpen(false);
                }}
              >
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
