import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Skeleton from '../components/ui/Skeleton';
import EnergyBadge from '../components/ui/EnergyBadge';
import { Sparkles, ArrowRight } from 'lucide-react';
import api from '../services/api';
import useToast from '../hooks/useToast';

export default function SmartRecommendation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();

  const targetStationId = location.state?.stationId || '654321000000000000000001';

  const [loading, setLoading] = useState(true);
  const [targetStationInfo, setTargetStationInfo] = useState(null);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    async function loadLoadBalancing() {
      setLoading(true);
      try {
        // Fetch first station if target ID is default
        let actualId = targetStationId;
        if (actualId === '654321000000000000000001') {
          const listRes = await api.get('/stations');
          const stns = listRes.data?.data?.stations || [];
          if (stns.length > 0) actualId = stns[0]._id;
        }

        const response = await api.get('/smart/load-balancing', {
          params: { stationId: actualId },
        });

        const data = response.data?.data;
        setTargetStationInfo(data?.targetStation || null);
        setRecommendations(data?.recommendedStations || []);
      } catch (err) {
        console.error('Failed to load smart recommendation:', err);
        showToast({
          title: 'Smart Grid Error',
          message: 'Could not load station congestion telemetry.',
          type: 'error',
        });
      } finally {
        setLoading(false);
      }
    }

    loadLoadBalancing();
  }, [targetStationId, showToast]);

  const recommended = recommendations.length > 0 ? recommendations[0] : null;

  return (
    <div className="min-h-screen bg-[#141218] text-[#e6e0e9] flex flex-col justify-between">
      <Navbar />

      <div className="flex-1 flex items-center justify-center p-4 py-12 relative">
        {/* Glow background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[#36D8FF]/15 rounded-full blur-[140px] pointer-events-none -z-10" />

        <div className="w-full max-w-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-2">
              <div className="p-3 rounded-2xl bg-[#36D8FF]/20 border border-[#36D8FF]/40 text-[#36D8FF]">
                <Sparkles className="w-8 h-8 animate-pulse" />
              </div>
            </div>
            <h2 className="font-headline text-3xl font-extrabold text-white">Community Load Balancing</h2>
            <p className="text-sm text-[#cbc4d2]">
              Detecting grid congestion in real time. We recommend alternative stations with green bonuses.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Skeleton className="h-64 rounded-2xl" />
              <Skeleton className="h-64 rounded-2xl" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Current Choice */}
              <Card className="border-[#494551] opacity-80">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#ffb4ab] mb-2">
                  Target Station ({targetStationInfo?.currentUtilizationPct || 80}% Utilized)
                </div>
                <h3 className="font-headline font-bold text-lg text-white">
                  {targetStationInfo?.name || 'Indiranagar Hub'}
                </h3>
                <p className="text-xs text-[#948e9c]">Current Utilization: High Congestion</p>

                <div className="space-y-2 mt-4 pt-3 border-t border-[#494551]/40 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#948e9c]">Status</span>
                    <span className="font-bold text-[#ffb4ab]">High Demand</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#948e9c]">Energy Rate</span>
                    <span className="font-semibold text-white">Standard Peak</span>
                  </div>
                </div>
              </Card>

              {/* Recommended Choice */}
              {recommended ? (
                <Card glow className="border-[#36D8FF] ring-2 ring-[#36D8FF]/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#22C55E] bg-[#22C55E]/15 px-2 py-0.5 rounded-full">
                      AI Recommended
                    </span>
                    <span className="text-xs font-extrabold text-[#e7c365]">
                      +{recommended.incentive?.greenPointsBonus || 100} Green Points
                    </span>
                  </div>
                  <h3 className="font-headline font-bold text-lg text-white">{recommended.name}</h3>
                  <p className="text-xs text-[#948e9c]">{recommended.address}</p>

                  <div className="space-y-2 mt-4 pt-3 border-t border-[#494551]/40 text-xs">
                    <div className="flex justify-between">
                      <span className="text-[#948e9c]">Available Bays</span>
                      <span className="font-bold text-[#22C55E]">{recommended.availableSlotsCount} Bays Free</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#948e9c]">Tariff Rate</span>
                      <span className="font-bold text-[#22C55E]">₹{recommended.basePricePerKWh} / kWh</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#948e9c]">Renewable Share</span>
                      <EnergyBadge renewablePercent={recommended.renewableSharePct} />
                    </div>
                  </div>
                </Card>
              ) : (
                <Card glow className="border-[#22C55E]/40 text-center py-8">
                  <div className="text-sm font-bold text-[#22C55E] mb-1">Normal Grid Load</div>
                  <p className="text-xs text-[#cbc4d2]">Target station has ample slot availability right now.</p>
                </Card>
              )}
            </div>
          )}

          <div className="space-y-3 pt-2">
            {recommended && (
              <Button
                variant="brand"
                fullWidth
                size="lg"
                icon={ArrowRight}
                iconPosition="right"
                onClick={() => navigate(`/driver/station/${recommended.id}/book`)}
              >
                Switch to {recommended.name} & Earn +100 Green Points
              </Button>
            )}
            <Button variant="ghost" fullWidth onClick={() => navigate('/driver/dashboard')}>
              Return to Dashboard
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
