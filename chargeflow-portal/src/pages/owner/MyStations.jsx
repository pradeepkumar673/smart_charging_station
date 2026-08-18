import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import OwnerSidebar from '../../components/layout/OwnerSidebar';
import OwnerHeader from '../../components/layout/OwnerHeader';
import Footer from '../../components/layout/Footer';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Building2, Plus, Search, Star, MapPin, Zap, Activity, ArrowRight, X } from 'lucide-react';

export default function MyStations() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [addModal, setAddModal] = useState(false);

  const stations = [
    { id: 'stn-01', name: 'VoltHub Indiranagar', address: '100 Feet Road, Indiranagar, Bengaluru', bays: 8, revenue: '₹18,420', util: '82%', rating: 4.9, status: 'Operational', color: '#22C55E' },
    { id: 'stn-02', name: 'VoltHub Whitefield', address: 'ITPL Main Road, Whitefield, Bengaluru', bays: 6, revenue: '₹14,800', util: '74%', rating: 4.8, status: 'Operational', color: '#22C55E' },
    { id: 'stn-03', name: 'VoltHub Electronic City', address: 'Phase 1, Hosur Main Road, Bengaluru', bays: 4, revenue: '₹8,200', util: '48%', rating: 4.6, status: 'Attention Needed', color: '#ffb4ab' },
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
              <h1 className="font-headline font-extrabold text-2xl sm:text-3xl text-white">My Charging Stations</h1>
              <p className="text-xs text-[#948e9c]">Manage your station locations, slots, and hardware telemetry.</p>
            </div>

            <Button variant="brand" size="md" icon={Plus} onClick={() => setAddModal(true)}>
              Add New Station
            </Button>
          </div>

          {/* Station Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stations.map((s) => (
              <Card key={s.id} glow className="flex flex-col justify-between h-full space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full" style={{ backgroundColor: `${s.color}20`, color: s.color }}>
                        {s.status}
                      </span>
                      <h3 className="font-headline font-bold text-xl text-white mt-1">{s.name}</h3>
                      <p className="text-xs text-[#948e9c] flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-[#36D8FF]" /> {s.address}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#494551]/40 text-center text-xs">
                    <div className="bg-[#1d1b20] p-2 rounded-xl border border-[#494551]/40">
                      <span className="text-[9px] text-[#948e9c] uppercase block">Bays</span>
                      <span className="font-bold text-white">{s.bays}</span>
                    </div>
                    <div className="bg-[#1d1b20] p-2 rounded-xl border border-[#494551]/40">
                      <span className="text-[9px] text-[#948e9c] uppercase block">Revenue</span>
                      <span className="font-bold text-[#22C55E]">{s.revenue}</span>
                    </div>
                    <div className="bg-[#1d1b20] p-2 rounded-xl border border-[#494551]/40">
                      <span className="text-[9px] text-[#948e9c] uppercase block">Rating</span>
                      <span className="font-bold text-[#e7c365]">★ {s.rating}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <Link to="/owner/twin" className="flex-1">
                    <Button variant="secondary" fullWidth size="sm" icon={Activity}>
                      View Twin
                    </Button>
                  </Link>
                  <Link to="/owner/slots" className="flex-1">
                    <Button variant="brand" fullWidth size="sm" icon={ArrowRight} iconPosition="right">
                      Manage Bays
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </main>

        {/* Add Station Modal */}
        {addModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
            <div className="bg-[#1d1b20] border border-[#36D8FF]/60 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
              <div className="flex justify-between items-center border-b border-[#494551]/40 pb-3">
                <h3 className="font-headline font-bold text-xl text-white">Onboard New Charging Station</h3>
                <button onClick={() => setAddModal(false)} className="p-1 text-[#948e9c] hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                <Input label="Station Name" placeholder="VoltHub Koramangala" required />
                <Input label="Address" placeholder="8th Block Koramangala" required />
                <Input label="Number of Bays" type="number" placeholder="6" required />
                <Input label="Base Pricing (₹/kWh)" type="number" placeholder="14" required />
              </div>

              <Button variant="brand" fullWidth onClick={() => setAddModal(false)}>
                Register & Initialize Hardware
              </Button>
            </div>
          </div>
        )}

        <Footer />
      </div>
    </div>
  );
}
