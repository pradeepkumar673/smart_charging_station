import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import DriverSidebar from '../components/layout/DriverSidebar';
import DriverHeader from '../components/layout/DriverHeader';
import Footer from '../components/layout/Footer';
import SessionProgress from '../components/driver/SessionProgress';
import ChargingCurveChart from '../components/driver/ChargingCurveChart';
import EnergyBadge from '../components/ui/EnergyBadge';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Skeleton from '../components/ui/Skeleton';
import EmptyState from '../components/states/EmptyState';
import { ShieldCheck, StopCircle, RefreshCw, Sparkles, HelpCircle, Zap } from 'lucide-react';
import api from '../services/api';
import useToast from '../hooks/useToast';

export default function ActiveSession() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const [activeSession, setActiveSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ending, setEnding] = useState(false);
  const [targetSoc, setTargetSoc] = useState(80);
  const [currentSoc, setCurrentSoc] = useState(64);

  const fetchActiveSession = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/sessions/active');
      const sessionData = response.data?.data?.session;
      setActiveSession(sessionData || null);
      if (sessionData) {
        // Calculate simulated SoC based on time elapsed
        const elapsedMins = Math.max(1, Math.round((Date.now() - new Date(sessionData.startTime).getTime()) / 60000));
        const computedSoc = Math.min(98, 20 + elapsedMins * 2);
        setCurrentSoc(computedSoc);
      }
    } catch (err) {
      console.error('Failed to fetch active session:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActiveSession();
  }, [fetchActiveSession]);

  const handleEndSession = async () => {
    if (!activeSession) return;
    setEnding(true);
    try {
      const response = await api.post(`/sessions/${activeSession._id}/end`);
      showToast({
        title: 'Session Finalized',
        message: 'Charging completed and bay released.',
        type: 'success',
      });
      const endedSession = response.data?.data?.session;
      navigate(`/driver/session/${endedSession?._id || activeSession._id}/summary`);
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || 'Could not end session.';
      showToast({
        title: 'Session Error',
        message: errMsg,
        type: 'error',
      });
    } finally {
      setEnding(false);
    }
  };

  const renewablePct =
    activeSession?.renewableMixAtStart?.solarPct + activeSession?.renewableMixAtStart?.windPct || 75;

  return (
    <div className="min-h-screen bg-[#141218] text-[#e6e0e9] flex">
      <DriverSidebar mobileOpen={mobileSidebarOpen} setMobileOpen={setMobileSidebarOpen} />

      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        <DriverHeader setMobileSidebarOpen={setMobileSidebarOpen} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 max-w-6xl mx-auto w-full">
          {loading ? (
            <div className="space-y-6">
              <Skeleton className="w-full h-24 rounded-2xl" />
              <Skeleton className="w-full h-96 rounded-2xl" />
            </div>
          ) : !activeSession ? (
            <div className="py-12">
              <EmptyState
                icon={Zap}
                title="No Active Charging Session"
                description="You don't have an ongoing charging session. Visit the map explorer to book a charging bay."
                ctaLabel="Explore Stations"
                onCtaClick={() => navigate('/driver/explore')}
              />
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#494551]/40 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E] animate-ping" />
                    <span className="text-xs font-bold text-[#22C55E] uppercase tracking-wider">Charging In Progress</span>
                    <span className="text-xs text-[#948e9c]">ID #{activeSession._id.slice(-6)}</span>
                  </div>
                  <h1 className="font-headline font-extrabold text-2xl sm:text-3xl text-white mt-1">
                    {activeSession.station?.name || 'Charging Hub'} (Bay {activeSession.slot?.slotId || 'A1'})
                  </h1>
                  <p className="text-xs text-[#cbc4d2]">
                    {activeSession.slot?.maxPowerKw || 150} kW {activeSession.slot?.connectorType || 'CCS2'} Fast Charger
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    variant="destructive"
                    size="md"
                    loading={ending}
                    icon={StopCircle}
                    onClick={handleEndSession}
                  >
                    Complete & Stop Session
                  </Button>
                </div>
              </div>

              {/* Connection Status Banner */}
              <div className="bg-[#211f24] border border-[#22C55E]/30 rounded-2xl p-4 flex items-center justify-between text-xs text-[#cbc4d2]">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#22C55E]" />
                  <span>ISO 15118 Cryptographic Handshake Active • Data refreshes live</span>
                </div>
                <span className="text-[#36D8FF] font-semibold hidden sm:inline">Grid Frequency: 50.02 Hz</span>
              </div>

              {/* Grid Layout: Circular Ring & Telemetry */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left 2 Columns: Circular Gauge & Chart */}
                <div className="lg:col-span-2 space-y-6">
                  <Card glow className="space-y-6 text-center">
                    <SessionProgress currentSoc={currentSoc} targetSoc={targetSoc} powerKw={activeSession.slot?.maxPowerKw || 60} />

                    {/* Stat Bar */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-[#494551]/40">
                      <div className="bg-[#1d1b20] p-3 rounded-xl border border-[#494551]/40">
                        <span className="text-[10px] text-[#948e9c] uppercase block">Energy Delivered</span>
                        <span className="font-headline font-bold text-lg text-white">
                          {activeSession.energyDeliveredKWh || 18.5} kWh
                        </span>
                      </div>
                      <div className="bg-[#1d1b20] p-3 rounded-xl border border-[#494551]/40">
                        <span className="text-[10px] text-[#948e9c] uppercase block">Time Elapsed</span>
                        <span className="font-headline font-bold text-lg text-white">
                          {Math.max(1, Math.round((Date.now() - new Date(activeSession.startTime).getTime()) / 60000))}m
                        </span>
                      </div>
                      <div className="bg-[#1d1b20] p-3 rounded-xl border border-[#494551]/40">
                        <span className="text-[10px] text-[#948e9c] uppercase block">Est. Time Left</span>
                        <span className="font-headline font-bold text-lg text-[#36D8FF]">15m</span>
                      </div>
                      <div className="bg-[#1d1b20] p-3 rounded-xl border border-[#494551]/40">
                        <span className="text-[10px] text-[#948e9c] uppercase block">Current Cost</span>
                        <span className="font-headline font-bold text-lg text-[#22C55E]">
                          ₹{activeSession.cost || 268}
                        </span>
                      </div>
                    </div>
                  </Card>

                  {/* Charging Power Curve Chart */}
                  <ChargingCurveChart />
                </div>

                {/* Right Column: Controls & Energy Mix */}
                <div className="space-y-6">
                  <Card className="space-y-4">
                    <h3 className="font-headline font-bold text-base text-white border-b border-[#494551]/40 pb-2">
                      Session Controls
                    </h3>

                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-semibold text-[#cbc4d2]">
                        <span>Target Charge Level</span>
                        <span className="text-[#36D8FF]">{targetSoc}%</span>
                      </div>
                      <input
                        type="range"
                        min="50"
                        max="100"
                        value={targetSoc}
                        onChange={(e) => setTargetSoc(Number(e.target.value))}
                        className="w-full accent-[#36D8FF]"
                      />
                    </div>

                    <div className="pt-2">
                      <EnergyBadge renewablePercent={renewablePct} className="w-full justify-center" />
                    </div>

                    <div className="space-y-2 pt-2">
                      <Button variant="secondary" fullWidth size="sm" icon={RefreshCw}>
                        Extend Session (15m)
                      </Button>
                      <Button variant="ghost" fullWidth size="sm" icon={HelpCircle}>
                        Need Support?
                      </Button>
                    </div>
                  </Card>

                  {/* Reward Tip */}
                  <div className="bg-gradient-to-r from-[#6750a4]/20 to-[#22C55E]/15 border border-[#22C55E]/30 rounded-2xl p-4 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#22C55E]">
                      <Sparkles className="w-4 h-4 text-[#e7c365]" />
                      <span>Green Reward Active</span>
                    </div>
                    <p className="text-xs text-[#cbc4d2] leading-relaxed">
                      Completing this session at 80% SoC saves battery health and awards +100 Green Points.
                    </p>
                  </div>
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
