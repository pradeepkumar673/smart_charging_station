import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import DriverSidebar from '../components/layout/DriverSidebar';
import DriverHeader from '../components/layout/DriverHeader';
import Footer from '../components/layout/Footer';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import StationCard from '../components/driver/StationCard';
import StationCardSkeleton from '../components/ui/StationCardSkeleton';
import { Search, Zap, Leaf, CalendarCheck, MapPin, Navigation, ArrowRight, Sparkles, Flame } from 'lucide-react';
import api from '../services/api';
import useAuth from '../hooks/useAuth';
import useToast from '../hooks/useToast';

export default function DriverDashboard() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [nearbyStations, setNearbyStations] = useState([]);
  const [activeReservation, setActiveReservation] = useState(null);
  const [stats, setStats] = useState({
    greenPoints: 0,
    co2Avoided: 0,
    totalCharged: 0,
    streak: 0,
    sessionsCount: 0,
  });

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const [stnRes, bkgRes] = await Promise.all([
        api.get('/stations', { params: { limit: 3 } }),
        api.get('/bookings/my'),
      ]);

      const stns = stnRes.data?.data?.stations || [];
      setNearbyStations(stns);

      const bkgs = bkgRes.data?.data?.bookings || [];
      const upcoming = bkgs.find((b) => b.status === 'confirmed' && !b.isCheckedIn);
      setActiveReservation(upcoming || null);

      const completed = bkgs.filter((b) => b.status === 'completed');
      const totalEnergy = completed.reduce((acc, b) => acc + (b.actualEnergyKWh || b.estimatedEnergyKWh || 0), 0);
      const co2 = Math.round(totalEnergy * 0.82 * 10) / 10;
      const points = completed.length * 100;
      const streak = completed.length > 0 ? Math.min(completed.length * 3, 30) : 0;

      setStats({
        greenPoints: points,
        co2Avoided: co2,
        totalCharged: Math.round(totalEnergy * 10) / 10,
        streak,
        sessionsCount: completed.length,
      });
    } catch (err) {
      console.error('Failed to load driver dashboard:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const vehicleName = user?.vehicle?.model
    ? `${user.vehicle.brand || user.vehicle.make || ''} ${user.vehicle.model}`
    : 'Tata Nexon EV';

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
                Welcome back, {user?.name || 'EV Driver'}! Charging bays are ready for your {vehicleName} in Bengaluru.
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
                <div className="font-headline font-extrabold text-2xl text-white">{stats.greenPoints.toLocaleString()}</div>
                <div className="text-[10px] text-[#22C55E]">+{stats.greenPoints > 0 ? 100 : 0} this week</div>
              </div>
            </Card>

            <Card className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-[#22C55E]/15 text-[#22C55E] shrink-0">
                <Leaf className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs text-[#948e9c]">CO₂ Avoided</div>
                <div className="font-headline font-extrabold text-2xl text-white">{stats.co2Avoided} kg</div>
                <div className="text-[10px] text-[#22C55E]">Equivalent {Math.max(1, Math.round(stats.co2Avoided / 20))} trees</div>
              </div>
            </Card>

            <Card className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-[#2D8CFF]/15 text-[#36D8FF] shrink-0">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs text-[#948e9c]">Total Charged</div>
                <div className="font-headline font-extrabold text-2xl text-white">{stats.totalCharged} kWh</div>
                <div className="text-[10px] text-[#cbc4d2]">{stats.sessionsCount} sessions</div>
              </div>
            </Card>

            <Card className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-[#93000a]/30 text-[#ffb4ab] shrink-0">
                <Flame className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs text-[#948e9c]">Eco Streak</div>
                <div className="font-headline font-extrabold text-2xl text-white">{stats.streak} Days</div>
                <div className="text-[10px] text-[#cfbcff]">Top 5% Eco Driver</div>
              </div>
            </Card>
          </div>

          {/* Active Reservation Banner if available */}
          {activeReservation && (
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
                    <span className="text-xs text-[#948e9c]">ID #{activeReservation._id.slice(-6)}</span>
                  </div>
                  <h3 className="font-headline font-bold text-xl text-white mt-1">
                    {activeReservation.station?.name} (Bay {activeReservation.slot?.slotId})
                  </h3>
                  <p className="text-xs text-[#cbc4d2] mt-0.5">
                    Start Time: {new Date(activeReservation.startTime).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-[#494551]/40 pt-3 md:pt-0">
                <Link to={`/driver/navigation/${activeReservation._id}`}>
                  <Button variant="brand" size="md" icon={Navigation}>
                    Start Route
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {/* Nearby Stations Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-headline font-bold text-xl text-white">Recommended Nearby Stations</h3>
                <p className="text-xs text-[#948e9c]">Matched with your {vehicleName} battery connector & speed</p>
              </div>
              <Link to="/driver/explore" className="text-xs font-bold text-[#cfbcff] hover:text-white flex items-center gap-1">
                <span>View All Map</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {loading
                ? Array.from({ length: 3 }).map((_, i) => <StationCardSkeleton key={i} />)
                : nearbyStations.map((stn) => (
                    <StationCard key={stn._id || stn.id} station={stn} />
                  ))}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
