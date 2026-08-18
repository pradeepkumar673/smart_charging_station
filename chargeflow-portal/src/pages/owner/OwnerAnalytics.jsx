import React, { useState, useEffect, useCallback } from 'react';
import OwnerSidebar from '../../components/layout/OwnerSidebar';
import OwnerHeader from '../../components/layout/OwnerHeader';
import Footer from '../../components/layout/Footer';
import AnalyticsCharts from '../../components/owner/AnalyticsCharts';
import KPIStatCard from '../../components/owner/KPIStatCard';
import Button from '../../components/ui/Button';
import Skeleton from '../../components/ui/Skeleton';
import { Download, DollarSign, Activity, Cpu, ShieldCheck } from 'lucide-react';
import api from '../../services/api';
import useToast from '../../hooks/useToast';

export default function OwnerAnalytics() {
  const { showToast } = useToast();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [range, setRange] = useState('30d');
  const [loading, setLoading] = useState(true);
  const [kpiData, setKpiData] = useState(null);

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/analytics/dashboard');
      setKpiData(response.data?.data || null);
    } catch (err) {
      console.error('Failed to load analytics:', err);
      showToast({ title: 'Error', message: 'Could not load analytics metrics.', type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return (
    <div className="min-h-screen bg-[#141218] text-[#e6e0e9] flex">
      <OwnerSidebar mobileOpen={mobileSidebarOpen} setMobileOpen={setMobileSidebarOpen} />

      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        <OwnerHeader setMobileSidebarOpen={setMobileSidebarOpen} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#494551]/40 pb-4">
            <div>
              <h1 className="font-headline font-extrabold text-2xl sm:text-3xl text-white">Network Analytics & Revenue Yield</h1>
              <p className="text-xs text-[#948e9c]">Deep analytics on revenue, charging volume, peak utilization, and no-shows.</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center bg-[#1d1b20] p-1 rounded-xl border border-[#494551]/60 text-xs font-semibold">
                {['7d', '30d', 'quarter'].map((r) => (
                  <button
                    key={r}
                    onClick={() => setRange(r)}
                    className={`px-3 py-1.5 rounded-lg uppercase transition-all ${
                      range === r ? 'bg-[#6750a4] text-white shadow' : 'text-[#cbc4d2] hover:text-white'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>

              <Button variant="brand" size="sm" icon={Download} onClick={() => window.print()}>
                Export Report
              </Button>
            </div>
          </div>

          {/* KPI Stat Cards */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Skeleton className="h-28 rounded-2xl" />
              <Skeleton className="h-28 rounded-2xl" />
              <Skeleton className="h-28 rounded-2xl" />
              <Skeleton className="h-28 rounded-2xl" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <KPIStatCard
                title="Period Revenue"
                value={`₹${kpiData?.totalRevenue || 184200}`}
                change="+18.4%"
                isPositive={true}
                icon={DollarSign}
                color="#22C55E"
              />
              <KPIStatCard
                title="Total Sessions"
                value={`${kpiData?.totalSessions || 1240} Sessions`}
                change="+110"
                isPositive={true}
                icon={Activity}
                color="#36D8FF"
              />
              <KPIStatCard
                title="Energy Delivered"
                value={`${kpiData?.totalEnergyDeliveredKWh || 18400} kWh`}
                change="+2.4 MWh"
                isPositive={true}
                icon={Cpu}
                color="#e7c365"
              />
              <KPIStatCard
                title="No-Show Rate"
                value={`${kpiData?.noShowRate || 2.1}%`}
                change="-0.8%"
                isPositive={true}
                icon={ShieldCheck}
                color="#22C55E"
              />
            </div>
          )}

          {/* Hardware Ranking & Analytics Component */}
          <AnalyticsCharts />
        </main>

        <Footer />
      </div>
    </div>
  );
}
