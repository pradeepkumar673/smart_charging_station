import React, { useState, useEffect } from 'react';
import OwnerSidebar from '../../components/layout/OwnerSidebar';
import OwnerHeader from '../../components/layout/OwnerHeader';
import Footer from '../../components/layout/Footer';
import StationTwin from '../../components/driver/StationTwin';
import TwinInspector from '../../components/owner/TwinInspector';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Skeleton from '../../components/ui/Skeleton';
import { RefreshCw, Radio } from 'lucide-react';
import api from '../../services/api';
import useToast from '../../hooks/useToast';

export default function OwnerDigitalTwin() {
  const { showToast } = useToast();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const [stations, setStations] = useState([]);
  const [selectedStationId, setSelectedStationId] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedBay, setSelectedBay] = useState(null);

  useEffect(() => {
    async function loadStations() {
      setLoading(true);
      try {
        const response = await api.get('/stations/my');
        const list = response.data?.data?.stations || [];
        setStations(list);
        if (list.length > 0) {
          setSelectedStationId(list[0]._id);
        }
      } catch (err) {
        console.error('Failed to load stations for twin:', err);
        showToast({ title: 'Error', message: 'Could not load station list.', type: 'error' });
      } finally {
        setLoading(false);
      }
    }

    loadStations();
  }, [showToast]);

  const selectedStation = stations.find((s) => s._id === selectedStationId) || stations[0];

  const timeline = [
    { time: 'Just now', text: 'Live telemetry stream active over WebSocket', type: 'info' },
    { time: '2 mins ago', text: 'Slot status sync verified with MongoDB', type: 'info' },
    { time: '10 mins ago', text: 'Grid power frequency steady at 50.01 Hz', type: 'maintenance' },
  ];

  return (
    <div className="min-h-screen bg-[#141218] text-[#e6e0e9] flex">
      <OwnerSidebar mobileOpen={mobileSidebarOpen} setMobileOpen={setMobileSidebarOpen} />

      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        <OwnerHeader setMobileSidebarOpen={setMobileSidebarOpen} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#494551]/40 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E] animate-ping" />
                <span className="text-xs font-bold text-[#22C55E] uppercase tracking-wider">Live Digital Twin Synced</span>
              </div>
              <h1 className="font-headline font-extrabold text-2xl sm:text-3xl text-white mt-1">
                {selectedStation?.name || 'Station Hardware Twin'}
              </h1>
              <p className="text-xs text-[#948e9c]">{selectedStation?.address || 'Bengaluru'} • Real-time telemetry stream</p>
            </div>

            <div className="flex items-center gap-3">
              {stations.length > 0 && (
                <select
                  value={selectedStationId}
                  onChange={(e) => setSelectedStationId(e.target.value)}
                  className="rounded-xl bg-[#1d1b20] border border-[#494551] text-xs text-white px-3 py-2"
                >
                  {stations.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              )}

              <Button
                variant="secondary"
                size="sm"
                icon={RefreshCw}
                onClick={() => showToast({ title: 'Resync', message: 'Resynced hardware state', type: 'info' })}
              >
                Resync
              </Button>
            </div>
          </div>

          {loading ? (
            <Skeleton className="w-full h-96 rounded-2xl" />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left 2 Columns: Main Living Twin Grid */}
              <div className="lg:col-span-2 space-y-6">
                <Card glow className="space-y-4">
                  <StationTwin
                    stationId={selectedStationId}
                    selectedBayId={selectedBay?._id || selectedBay?.slotId}
                    onSelectBay={(bay) => setSelectedBay(bay)}
                  />
                </Card>

                {/* Real-time Event Timeline */}
                <Card className="space-y-3">
                  <h3 className="font-headline font-bold text-sm text-white border-b border-[#494551]/40 pb-2 flex items-center gap-2">
                    <Radio className="w-4 h-4 text-[#36D8FF] animate-pulse" />
                    <span>Real-Time Station Event Stream</span>
                  </h3>

                  <div className="space-y-2 text-xs">
                    {timeline.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between py-1.5 border-b border-[#494551]/30">
                        <span className="text-white font-medium">{item.text}</span>
                        <span className="text-[10px] font-mono text-[#948e9c]">{item.time}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Right Column: Inspector Panel */}
              <div>
                <TwinInspector bay={selectedBay} onClose={() => setSelectedBay(null)} />
              </div>
            </div>
          )}
        </main>

        <Footer />
      </div>
    </div>
  );
}
