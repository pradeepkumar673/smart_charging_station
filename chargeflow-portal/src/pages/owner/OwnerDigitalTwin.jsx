import React, { useState } from 'react';
import OwnerSidebar from '../../components/layout/OwnerSidebar';
import OwnerHeader from '../../components/layout/OwnerHeader';
import Footer from '../../components/layout/Footer';
import StationTwin from '../../components/driver/StationTwin';
import TwinInspector from '../../components/owner/TwinInspector';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Activity, Zap, Cpu, RefreshCw, AlertTriangle, ShieldCheck, Clock, Radio } from 'lucide-react';

export default function OwnerDigitalTwin() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [selectedBay, setSelectedBay] = useState({
    id: 'A1',
    name: 'Bay A1',
    type: '150 kW DC Ultra-Fast',
    status: 'occupied',
    vehicle: 'Hyundai Ioniq 5',
    soc: 64,
    power: '142 kW',
  });

  const timeline = [
    { time: '7:28 PM', text: 'Bay A1 session power peak 142 kW reached', type: 'info' },
    { time: '7:20 PM', text: 'Bay A3 slot reserved via ChargeFlow App (BKG-8821)', type: 'reservation' },
    { time: '7:14 PM', text: 'Bay B3 automated sensor self-test completed', type: 'maintenance' },
    { time: '7:02 PM', text: 'Bay B1 Tesla Model Y connected • ISO 15118 Verified', type: 'info' },
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
                VoltHub Indiranagar — Hardware Twin
              </h1>
              <p className="text-xs text-[#948e9c]">100 Feet Road, Indiranagar • Millisecond telemetry stream</p>
            </div>

            <Button variant="secondary" size="sm" icon={RefreshCw}>
              Force Hardware Resync
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left 2 Columns: Main Living Twin Grid */}
            <div className="lg:col-span-2 space-y-6">
              <Card glow className="space-y-4">
                <StationTwin
                  selectedBayId={selectedBay?.id}
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
              <TwinInspector
                bay={selectedBay}
                onClose={() => setSelectedBay(null)}
              />
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
