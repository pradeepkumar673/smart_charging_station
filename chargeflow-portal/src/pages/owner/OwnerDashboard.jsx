import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import OwnerSidebar from '../../components/layout/OwnerSidebar';
import OwnerHeader from '../../components/layout/OwnerHeader';
import Footer from '../../components/layout/Footer';
import KPIStatCard from '../../components/owner/KPIStatCard';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import StationTwin from '../../components/driver/StationTwin';
import StatCardSkeleton from '../../components/ui/StatCardSkeleton';
import TwinSkeleton from '../../components/ui/TwinSkeleton';
import { DollarSign, Activity, Cpu, Zap, ArrowRight, ShieldCheck, Sparkles, Plus } from 'lucide-react';
import api from '../../services/api';
import useToast from '../../hooks/useToast';

export default function OwnerDashboard() {
  const { showToast } = useToast();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [ownerStations, setOwnerStations] = useState([]);
  const [kpiData, setKpiData] = useState(null);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const [stnRes, analyticsRes] = await Promise.all([
        api.get('/stations/my'),
        api.get('/analytics/dashboard'),
      ]);

      setOwnerStations(stnRes.data?.data?.stations || []);
      setKpiData(analyticsRes.data?.data || null);
    } catch (err) {
      console.error('Failed to load owner dashboard:', err);
      showToast({
        title: 'Console Error',
        message: 'Could not fetch station network telemetry.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const primaryStation = ownerStations.length > 0 ? ownerStations[0] : null;

  return (
    <div className="min-h-screen bg-[#141218] text-[#e6e0e9] flex">
      <OwnerSidebar mobileOpen={mobileSidebarOpen} setMobileOpen={setMobileSidebarOpen} />

      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        <OwnerHeader setMobileSidebarOpen={setMobileSidebarOpen} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto w-full">
          {/* Header Actions */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#494551]/40 pb-4">
            <div>
              <h1 className="font-headline font-extrabold text-2xl sm:text-3xl text-white">Network Overview</h1>
              <p className="text-xs text-[#948e9c]">Real-time operational yield, hardware health, and dynamic tariff telemetry.</p>
            </div>

            <div className="flex items-center gap-3">
              <Link to="/owner/pricing">
                <Button variant="secondary" size="sm" icon={DollarSign}>
                  Edit Tariff
                </Button>
              </Link>
              <Link to="/owner/stations">
                <Button variant="brand" size="sm" icon={Plus}>
                  Add Station
                </Button>
              </Link>
            </div>
          </div>

          {/* Top KPI Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => <StatCardSkeleton key={i} />)
            ) : (
              <>
                <KPIStatCard
                  title="Total Revenue"
                  value={`₹${kpiData?.totalRevenue || 18420}`}
                  change="+14.2%"
                  isPositive={true}
                  icon={DollarSign}
                  color="#22C55E"
                />
                <KPIStatCard
                  title="Utilization"
                  value={`${kpiData?.utilizationPct || 82}%`}
                  change="+6.8%"
                  isPositive={true}
                  icon={Activity}
                  color="#36D8FF"
                />
                <KPIStatCard
                  title="Active Sessions"
                  value={`${kpiData?.totalSessions || 6} Sessions`}
                  change="Live"
                  isPositive={true}
                  icon={Zap}
                  color="#6750a4"
                />
                <KPIStatCard
                  title="Energy Delivered"
                  value={`${kpiData?.totalEnergyDeliveredKWh || 1240} kWh`}
                  change="+180 kWh"
                  isPositive={true}
                  icon={Cpu}
                  color="#e7c365"
                />
                <KPIStatCard
                  title="Rating"
                  value={`${kpiData?.averageRating || 4.9} ★`}
                  change="Customer CSAT"
                  isPositive={true}
                  icon={ShieldCheck}
                  color="#22C55E"
                />
              </>
            )}
          </div>

          {/* Main Grid: Living Twin & Station Health */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {loading ? (
                <TwinSkeleton />
              ) : (
                <Card glow className="space-y-4">
                  <div className="flex items-center justify-between border-b border-[#494551]/40 pb-3">
                    <div>
                      <h3 className="font-headline font-bold text-lg text-white">
                        {primaryStation?.name || 'Primary Station'} (Live Grid)
                      </h3>
                      <p className="text-xs text-[#948e9c]">
                        {primaryStation?.address || 'Bengaluru'} • Rate: ₹{primaryStation?.basePricePerKWh || 14.5}/kWh
                      </p>
                    </div>
                    <Link to="/owner/twin">
                      <Button variant="brand" size="sm" icon={ArrowRight} iconPosition="right">
                        Full Digital Twin
                      </Button>
                    </Link>
                  </div>

                  <StationTwin stationId={primaryStation?._id} />
                </Card>
              )}
            </div>

            {/* Right Column: Operational Health */}
            <div className="space-y-6">
              <Card className="space-y-4">
                <h3 className="font-headline font-bold text-base text-white border-b border-[#494551]/40 pb-2">
                  Station Operational Health
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-[#494551]/30">
                    <span className="text-[#948e9c]">Managed Stations</span>
                    <span className="font-bold text-[#36D8FF]">{ownerStations.length} Stations</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#494551]/30">
                    <span className="text-[#948e9c]">Customer CSAT</span>
                    <span className="font-bold text-[#e7c365]">{kpiData?.averageRating || 4.9} / 5.0 ★</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#494551]/30">
                    <span className="text-[#948e9c]">Grid Status</span>
                    <span className="font-semibold text-[#22C55E]">Optimal Power Delivery</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#22C55E]/15 border border-[#22C55E]/30 text-xs text-[#22C55E]">
                  <div className="font-bold flex items-center gap-1">
                    <Sparkles className="w-4 h-4" /> Load Balancing Incentive Active
                  </div>
                  <p className="text-[11px] text-[#cbc4d2] mt-1">
                    Community load balancing is active across your network.
                  </p>
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
