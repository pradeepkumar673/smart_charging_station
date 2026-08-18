import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DriverSidebar from '../components/layout/DriverSidebar';
import DriverHeader from '../components/layout/DriverHeader';
import Footer from '../components/layout/Footer';
import Card from '../ui/Card';
import Button from '../ui/Button';
import StationCard from '../components/driver/StationCard';
import { Search, Zap, Leaf, ShieldCheck, Flame, CalendarCheck, MapPin, Navigation, ArrowRight, Sparkles, AlertTriangle } from 'lucide-react';

export default function DriverDashboard() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const nearbyStations = [
    { id: 'stn-01', name: 'ChargeFlow Hub - MG Road', address: 'MG Road Metro Complex', rating: 4.9, reviewsCount: 184, distance: '2.4 km', eta: '8 min', slotsAvailable: 4, totalSlots: 8, price: '₹14/kWh', maxPower: '150 kW DC Fast', renewablePercent: 92 },
    { id: 'stn-02', name: 'Indiranagar Supercharge', address: 100 + ' Feet Rd, Indiranagar', rating: 4.8, reviewsCount: 96, distance: '1.1 km', eta: '4 min', slotsAvailable: 2, totalSlots: 6, price: '₹15/kWh', maxPower: '350 kW NACS', renewablePercent: 85 },
    { id: 'stn-03', name: 'Koramangala Green Hub', address: '5th Block Koramangala', rating: 4.7, reviewsCount: 210, distance: '4.8 km', eta: '14 min', slotsAvailable: 5, totalSlots: 10, price: '₹12/kWh', maxPower: '60 kW CCS2', renewablePercent: 100 },
  ];

  return (
    <div className="min-h-screen bg-[#141218] text-[#e6e0e9] flex">
      {/* Responsive Sidebar */}
      <DriverSidebar mobileOpen={mobileSidebarOpen} setMobileOpen={setMobileSidebarOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        <DriverHeader setMobileSidebarOpen={setMobileSidebarOpen} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto w-full">
          {/* Hero Prompt Card */}
          <div className="relative rounded-3xl bg-gradient-to-r from-[#6750a4]/40 via-[#211f24] to-[#2D8CFF]/20 border border-[#6750a4]/30 p-6 sm:p-8 overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#36D8FF]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#36D8FF]/15 text-[#36D8FF] text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Grid Orchestrator Active</span>
              </div>

              <h2 className="font-headline font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
                Ready for your next <span className="text-[#36D8FF]">autonomous charge?</span>
              </h2>

              <p className="text-sm text-[#cbc4d2] leading-relaxed">
                4 ultra-fast charging bays are reserved for Tata Nexon EVs within 3 km with 92% solar grid mix.
              </p>

              {/* Location Search Bar */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <div className="relative flex-1">
                  <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#948e9c]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search landmark, station name, or pincode..."
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#1d1b20] border border-[#494551] text-sm text-white placeholder-[#948e9c] focus:outline-none focus:border-[#36D8FF] focus:ring-2 focus:ring-[#36D8FF]/20"
                  />
                </div>
                <Link to="/driver/explore">
                  <Button variant="brand" size="lg" icon={MapPin} fullWidth>
                    Explore Map
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-[#e7c365]/15 text-[#e7c365] shrink-0">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs text-[#948e9c]">Green Points</div>
                <div className="font-headline font-extrabold text-2xl text-white">1,480</div>
                <div className="text-[10px] text-[#22C55E]">+120 this week</div>
              </div>
            </Card>

            <Card className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-[#22C55E]/15 text-[#22C55E] shrink-0">
                <Leaf className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs text-[#948e9c]">CO₂ Avoided</div>
                <div className="font-headline font-extrabold text-2xl text-white">342 kg</div>
                <div className="text-[10px] text-[#22C55E]">Equivalent 18 trees</div>
              </div>
            </Card>

            <Card className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-[#2D8CFF]/15 text-[#36D8FF] shrink-0">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs text-[#948e9c]">Total Charged</div>
                <div className="font-headline font-extrabold text-2xl text-white">840 kWh</div>
                <div className="text-[10px] text-[#cbc4d2]">24 sessions</div>
              </div>
            </Card>

            <Card className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-[#93000a]/30 text-[#ffb4ab] shrink-0">
                <Flame className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs text-[#948e9c]">Eco Streak</div>
                <div className="font-headline font-extrabold text-2xl text-white">8 Days</div>
                <div className="text-[10px] text-[#cfbcff]">Top 5% Eco Driver</div>
              </div>
            </Card>
          </div>

          {/* Active Booking Countdown Card */}
          <div className="bg-gradient-to-r from-[#211f24] to-[#1d1b20] border border-[#2D8CFF]/40 rounded-2xl p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
            <div className="flex items-start gap-4">
              <div className="p-3.5 rounded-2xl bg-[#2D8CFF]/20 text-[#36D8FF] shrink-0">
                <CalendarCheck className="w-8 h-8" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#8B5CF6]/20 text-[#c084fc]">
                    Active Reservation
                  </span>
                  <span className="text-xs text-[#948e9c]">ID #BKG-8821</span>
                </div>
                <h3 className="font-headline font-bold text-xl text-white mt-1">
                  ChargeFlow Hub - MG Road (Bay A2)
                </h3>
                <p className="text-xs text-[#cbc4d2] mt-0.5">
                  Today • 7:30 PM - 8:15 PM (CCS2 150kW)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-[#494551]/40 pt-3 md:pt-0">
              <div className="text-left md:text-right">
                <div className="text-[10px] text-[#948e9c] uppercase tracking-wider">Check-in Opens In</div>
                <div className="font-headline font-extrabold text-2xl text-[#36D8FF] animate-pulse">
                  14m 32s
                </div>
              </div>
              <Link to="/driver/navigation/bkg-8821">
                <Button variant="brand" size="md" icon={Navigation}>
                  Start Route
                </Button>
              </Link>
            </div>
          </div>

          {/* Nearby Stations Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-headline font-bold text-xl text-white">Recommended Nearby Stations</h3>
                <p className="text-xs text-[#948e9c]">Matched with your Tata Nexon EV battery connector & speed</p>
              </div>
              <Link to="/driver/explore" className="text-xs font-bold text-[#cfbcff] hover:text-white flex items-center gap-1">
                <span>View All Map</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {nearbyStations.map((stn) => (
                <StationCard key={stn.id} station={stn} />
              ))}
            </div>
          </div>

          {/* Community Suggestion Banner */}
          <div className="bg-[#211f24] border border-[#e7c365]/30 rounded-2xl p-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#e7c365]/20 text-[#e7c365]">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-headline font-bold text-sm text-white">Off-Peak Charging Reward Bonus</h4>
                <p className="text-xs text-[#cbc4d2]">Charge between 10:00 PM and 6:00 AM to earn 2x Green Points + ₹3/kWh discount.</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              View Schedule
            </Button>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
