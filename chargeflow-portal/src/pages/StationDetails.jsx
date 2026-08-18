import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import DriverSidebar from '../components/layout/DriverSidebar';
import DriverHeader from '../components/layout/DriverHeader';
import Footer from '../components/layout/Footer';
import StationTwin from '../components/driver/StationTwin';
import EnergyBadge from '../components/ui/EnergyBadge';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { ArrowLeft, Star, MapPin, Navigation, ArrowRight, ShieldCheck, Zap, Coffee, Wifi, Sparkles, Heart, Share2, ThumbsUp } from 'lucide-react';

export default function StationDetails() {
  const { id } = useParams();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [selectedBay, setSelectedBay] = useState({ id: 'A2', name: 'Bay A2', price: '₹14/kWh' });
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <div className="min-h-screen bg-[#141218] text-[#e6e0e9] flex">
      <DriverSidebar mobileOpen={mobileSidebarOpen} setMobileOpen={setMobileSidebarOpen} />

      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        <DriverHeader setMobileSidebarOpen={setMobileSidebarOpen} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto w-full">
          {/* Header Action Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#494551]/40 pb-4">
            <div className="flex items-center gap-3">
              <Link to="/driver/explore" className="p-2 rounded-xl bg-[#211f24] text-[#cbc4d2] hover:text-white border border-[#494551]/60">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#e7c365] bg-[#e7c365]/10 px-2 py-0.5 rounded-md flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-current" /> 4.9 (184 Reviews)
                  </span>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#22C55E]/15 text-[#22C55E]">
                    4 Bays Free Now
                  </span>
                </div>
                <h1 className="font-headline font-extrabold text-2xl sm:text-3xl text-white mt-1">
                  ChargeFlow Hub - MG Road
                </h1>
                <p className="text-xs text-[#948e9c] flex items-center gap-1.5 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-[#36D8FF]" />
                  <span>MG Road Metro Station Complex, Exit 2, Bengaluru • 2.4 km away (8 min drive)</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className={`p-2.5 rounded-xl border transition-colors ${
                  isFavorite ? 'bg-[#ffb4ab]/20 border-[#ffb4ab] text-[#ffb4ab]' : 'bg-[#211f24] border-[#494551] text-[#cbc4d2]'
                }`}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
              <Link to={`/driver/navigation/bkg-8821`}>
                <Button variant="secondary" size="md" icon={Navigation}>
                  Navigate
                </Button>
              </Link>
              <Link to={`/driver/station/${id || 'stn-01'}/book`}>
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
                  selectedBayId={selectedBay.id}
                  onSelectBay={(bay) => setSelectedBay(bay)}
                />
              </Card>

              {/* AI Smart Recommendation Card */}
              <div className="bg-gradient-to-r from-[#6750a4]/30 via-[#211f24] to-[#22C55E]/15 border border-[#22C55E]/40 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-[#22C55E]">
                  <Sparkles className="w-4 h-4 text-[#e7c365]" />
                  <span>Smart AI Recommendation for Tata Nexon EV</span>
                </div>
                <h4 className="font-headline font-bold text-lg text-white">
                  Recommended Bay: <span className="text-[#22C55E]">{selectedBay.name || 'Bay A2'}</span>
                </h4>
                <p className="text-xs text-[#cbc4d2] leading-relaxed">
                  Delivers up to 142 kW continuous DC fast charging with lowest thermal throttling and 92% solar grid mix. Rate: {selectedBay.price || '₹14/kWh'}.
                </p>
                <Link to={`/driver/station/${id || 'stn-01'}/book`}>
                  <Button variant="primary" size="sm" icon={ArrowRight} iconPosition="right">
                    Reserve Recommended {selectedBay.name || 'Bay A2'}
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
                    <span className="text-[#948e9c]">Max Charging Power</span>
                    <span className="font-bold text-[#36D8FF]">150 kW DC Ultra-Fast</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#494551]/30">
                    <span className="text-[#948e9c]">Connector Standards</span>
                    <span className="font-bold text-white">CCS2, NACS, Type 2</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#494551]/30">
                    <span className="text-[#948e9c]">Base Rate</span>
                    <span className="font-bold text-[#22C55E]">₹14 / kWh</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#494551]/30">
                    <span className="text-[#948e9c]">ISO 15118 Standard</span>
                    <span className="font-semibold text-[#cfbcff]">Plug & Charge Enabled</span>
                  </div>
                </div>

                <div className="pt-2">
                  <span className="text-xs font-bold text-[#cbc4d2] block mb-2">Energy Source Breakdown</span>
                  <EnergyBadge renewablePercent={92} className="w-full justify-center" />
                  <div className="grid grid-cols-3 gap-2 mt-3 text-center text-[10px] text-[#948e9c]">
                    <div className="bg-[#1d1b20] p-2 rounded-lg border border-[#494551]/40">
                      <span className="block font-bold text-[#e7c365]">84%</span> Solar
                    </div>
                    <div className="bg-[#1d1b20] p-2 rounded-lg border border-[#494551]/40">
                      <span className="block font-bold text-[#36D8FF]">8%</span> Wind
                    </div>
                    <div className="bg-[#1d1b20] p-2 rounded-lg border border-[#494551]/40">
                      <span className="block font-bold text-[#cbc4d2]">8%</span> Grid
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#494551]/40 space-y-2">
                  <span className="text-xs font-bold text-[#cbc4d2] block">Station Amenities</span>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#211f24] text-[#cbc4d2] border border-[#494551]">
                      <Wifi className="w-3.5 h-3.5 text-[#36D8FF]" /> Free Wi-Fi
                    </span>
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#211f24] text-[#cbc4d2] border border-[#494551]">
                      <Coffee className="w-3.5 h-3.5 text-[#e7c365]" /> Cafe Lounge
                    </span>
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#211f24] text-[#cbc4d2] border border-[#494551]">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#22C55E]" /> 24/7 Security
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
