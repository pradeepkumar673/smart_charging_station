import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import DriverSidebar from '../components/layout/DriverSidebar';
import DriverHeader from '../components/layout/DriverHeader';
import Footer from '../components/layout/Footer';
import StationTwin from '../components/driver/StationTwin';
import EnergyBadge from '../components/ui/EnergyBadge';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Skeleton from '../components/ui/Skeleton';
import { ArrowLeft, MapPin, ArrowRight, ShieldCheck, Sparkles, Heart } from 'lucide-react';
import api from '../services/api';
import useToast from '../hooks/useToast';

export default function StationDetails() {
  const { id } = useParams();
  const { showToast } = useToast();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const [stationData, setStationData] = useState(null);
  const [slotsData, setSlotsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedBay, setSelectedBay] = useState(null);

  useEffect(() => {
    async function loadStationDetails() {
      setLoading(true);
      try {
        const response = await api.get(`/stations/${id}`);
        const { station, slots } = response.data?.data || {};
        setStationData(station);
        setSlotsData(slots || []);
        if (slots && slots.length > 0) {
          setSelectedBay(slots[0]);
        }
      } catch (err) {
        console.error('Failed to load station details:', err);
        showToast({
          title: 'Station Error',
          message: 'Could not fetch station details from backend.',
          type: 'error',
        });
      } finally {
        setLoading(false);
      }
    }
    if (id) {
      loadStationDetails();
    }
  }, [id, showToast]);

  const toggleFavorite = async () => {
    try {
      if (isFavorite) {
        await api.delete(`/stations/${id}/favorite`);
        setIsFavorite(false);
        showToast({ title: 'Favorites', message: 'Removed from favorites', type: 'info' });
      } else {
        await api.post(`/stations/${id}/favorite`);
        setIsFavorite(true);
        showToast({ title: 'Favorites', message: 'Added to favorites!', type: 'success' });
      }
    } catch (err) {
      showToast({ title: 'Favorite Error', message: err.message || 'Could not update favorites', type: 'error' });
    }
  };

  const renewablePct =
    stationData?.renewableSharePct ||
    (stationData?.renewableMix?.solarPct || 0) + (stationData?.renewableMix?.windPct || 0) ||
    0;

  return (
    <div className="min-h-screen bg-[#141218] text-[#e6e0e9] flex">
      <DriverSidebar mobileOpen={mobileSidebarOpen} setMobileOpen={setMobileSidebarOpen} />

      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        <DriverHeader setMobileSidebarOpen={setMobileSidebarOpen} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto w-full">
          {loading ? (
            <div className="space-y-6">
              <Skeleton className="w-full h-24 rounded-2xl" />
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Skeleton className="lg:col-span-2 h-96 rounded-2xl" />
                <Skeleton className="h-96 rounded-2xl" />
              </div>
            </div>
          ) : !stationData ? (
            <div className="text-center py-20 text-[#cbc4d2]">
              <h2 className="text-2xl font-bold text-white mb-2">Station Not Found</h2>
              <Link to="/driver/explore">
                <Button variant="primary">Return to Explorer</Button>
              </Link>
            </div>
          ) : (
            <>
              {/* Header Action Bar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#494551]/40 pb-4">
                <div className="flex items-center gap-3">
                  <Link to="/driver/explore" className="p-2 rounded-xl bg-[#211f24] text-[#cbc4d2] hover:text-white border border-[#494551]/60">
                    <ArrowLeft className="w-5 h-5" />
                  </Link>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                        (stationData.availableSlotsCount || 0) > 0
                          ? 'bg-[#22C55E]/15 text-[#22C55E]'
                          : 'bg-[#FFB4AB]/15 text-[#FFB4AB]'
                      }`}>
                        {stationData.availableSlotsCount || 0} Bays Free Now
                      </span>
                    </div>
                    <h1 className="font-headline font-extrabold text-2xl sm:text-3xl text-white mt-1">
                      {stationData.name}
                    </h1>
                    <p className="text-xs text-[#948e9c] flex items-center gap-1.5 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-[#36D8FF]" />
                      <span>{stationData.address}, {stationData.city} • Bengaluru</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                  <button
                    onClick={toggleFavorite}
                    className={`p-2.5 rounded-xl border transition-colors ${
                      isFavorite ? 'bg-[#ffb4ab]/20 border-[#ffb4ab] text-[#ffb4ab]' : 'bg-[#211f24] border-[#494551] text-[#cbc4d2]'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                  </button>
                  <Link to={`/driver/station/${id}/book`}>
                    <Button variant="brand" size="md" icon={ArrowRight} iconPosition="right">
                      Book Slot
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Main Grid: Digital Twin & Station Specs */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left 2 Columns: Living Station Digital Twin */}
                <div className="lg:col-span-2 space-y-6">
                  <Card glow className="space-y-4">
                    <StationTwin
                      stationId={id}
                      selectedBayId={selectedBay?._id || selectedBay?.slotId}
                      onSelectBay={(bay) => setSelectedBay(bay)}
                    />
                  </Card>

                  {/* AI Smart Recommendation Card */}
                  <div className="bg-gradient-to-r from-[#6750a4]/30 via-[#211f24] to-[#22C55E]/15 border border-[#22C55E]/40 rounded-2xl p-5 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#22C55E]">
                      <Sparkles className="w-4 h-4 text-[#e7c365]" />
                      <span>Smart AI Recommendation</span>
                    </div>
                    <h4 className="font-headline font-bold text-lg text-white">
                      Selected Bay: <span className="text-[#22C55E]">{selectedBay?.slotId || 'Bay A1'}</span>
                    </h4>
                    <p className="text-xs text-[#cbc4d2] leading-relaxed">
                      Connector: {selectedBay?.connectorType || 'CCS2'} • Max Power: {selectedBay?.maxPowerKw || 150} kW • Tariff: ₹{stationData.basePricePerKWh}/kWh.
                    </p>
                    <Link to={`/driver/station/${id}/book`}>
                      <Button variant="primary" size="sm" icon={ArrowRight} iconPosition="right">
                        Reserve {selectedBay?.slotId || 'Bay A1'} Now
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Right Column: Hardware Details, Energy Mix, Amenities */}
                <div className="space-y-6">
                  <Card className="space-y-4">
                    <h3 className="font-headline font-bold text-lg text-white border-b border-[#494551]/40 pb-3">
                      Hardware Telemetry
                    </h3>

                    <div className="space-y-3 text-xs">
                      <div className="flex justify-between py-1.5 border-b border-[#494551]/30">
                        <span className="text-[#948e9c]">Charger Types</span>
                        <span className="font-bold text-[#36D8FF]">{(stationData.chargerTypes || ['DC']).join(', ')}</span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-[#494551]/30">
                        <span className="text-[#948e9c]">Base Rate</span>
                        <span className="font-bold text-[#22C55E]">₹{stationData.basePricePerKWh} / kWh</span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-[#494551]/30">
                        <span className="text-[#948e9c]">Operating Hours</span>
                        <span className="font-bold text-white">
                          {stationData.operatingHours?.is24Hours ? '24/7 Open' : `${stationData.operatingHours?.open} - ${stationData.operatingHours?.close}`}
                        </span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <span className="text-xs font-bold text-[#cbc4d2] block mb-2">Energy Source Breakdown</span>
                      <EnergyBadge renewablePercent={renewablePct} className="w-full justify-center" />
                      <div className="grid grid-cols-3 gap-2 mt-3 text-center text-[10px] text-[#948e9c]">
                        <div className="bg-[#1d1b20] p-2 rounded-lg border border-[#494551]/40">
                          <span className="block font-bold text-[#e7c365]">{stationData.renewableMix?.solarPct || 0}%</span> Solar
                        </div>
                        <div className="bg-[#1d1b20] p-2 rounded-lg border border-[#494551]/40">
                          <span className="block font-bold text-[#36D8FF]">{stationData.renewableMix?.windPct || 0}%</span> Wind
                        </div>
                        <div className="bg-[#1d1b20] p-2 rounded-lg border border-[#494551]/40">
                          <span className="block font-bold text-[#cbc4d2]">{stationData.renewableMix?.gridPct || 100}%</span> Grid
                        </div>
                      </div>
                    </div>

                    {stationData.amenities && stationData.amenities.length > 0 && (
                      <div className="pt-2 border-t border-[#494551]/40 space-y-2">
                        <span className="text-xs font-bold text-[#cbc4d2] block">Station Amenities</span>
                        <div className="flex flex-wrap gap-2 text-xs">
                          {stationData.amenities.map((amenity, idx) => (
                            <span key={idx} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#211f24] text-[#cbc4d2] border border-[#494551]">
                              <ShieldCheck className="w-3.5 h-3.5 text-[#22C55E]" /> {amenity}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </Card>
                </div>
              </div>
            </>
          )}
        </main>

        <Footer />
      </div>
    </div>
  );
}
