import React, { useState } from 'react';
import OwnerSidebar from '../../components/layout/OwnerSidebar';
import OwnerHeader from '../../components/layout/OwnerHeader';
import Footer from '../../components/layout/Footer';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Cpu, Plus, Wrench, ShieldCheck, Zap, Car, Clock, RefreshCw } from 'lucide-react';

export default function SlotManagement() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [filter, setFilter] = useState('all');

  const [bays, setBays] = useState([
    { id: 'A1', type: '150 kW CCS2', status: 'occupied', session: 'SES-9042 (Hyundai Ioniq 5)', health: '98%', power: '142 kW' },
    { id: 'A2', type: '150 kW CCS2', status: 'available', session: 'None (Ready)', health: '100%', power: '0 kW' },
    { id: 'A3', type: '22 kW AC Type 2', status: 'reserved', session: 'BKG-8821 (Reserved)', health: '96%', power: '0 kW' },
    { id: 'A4', type: '150 kW CCS2', status: 'available', session: 'None (Ready)', health: '99%', power: '0 kW' },
    { id: 'B1', type: '350 kW NACS', status: 'occupied', session: 'SES-8812 (Tesla Model Y)', health: '95%', power: '210 kW' },
    { id: 'B2', type: '350 kW NACS', status: 'available', session: 'None (Ready)', health: '100%', power: '0 kW' },
    { id: 'B3', type: '150 kW CCS2', status: 'maintenance', session: 'Calibration Required', health: '64%', power: '0 kW' },
    { id: 'B4', type: '22 kW AC Type 2', status: 'available', session: 'None (Ready)', health: '100%', power: '0 kW' },
  ]);

  const toggleMaintenance = (id) => {
    setBays(bays.map((b) => {
      if (b.id === id) {
        return {
          ...b,
          status: b.status === 'maintenance' ? 'available' : 'maintenance',
          session: b.status === 'maintenance' ? 'None (Ready)' : 'Calibration Required',
        };
      }
      return b;
    }));
  };

  const filteredBays = filter === 'all' ? bays : bays.filter((b) => b.status === filter);

  return (
    <div className="min-h-screen bg-[#141218] text-[#e6e0e9] flex">
      <OwnerSidebar mobileOpen={mobileSidebarOpen} setMobileOpen={setMobileSidebarOpen} />

      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        <OwnerHeader setMobileSidebarOpen={setMobileSidebarOpen} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#494551]/40 pb-4">
            <div>
              <h1 className="font-headline font-extrabold text-2xl sm:text-3xl text-white">Slot & Bay Management</h1>
              <p className="text-xs text-[#948e9c]">VoltHub Indiranagar • Real-time hardware status and maintenance control.</p>
            </div>

            <Button variant="brand" size="sm" icon={Plus}>
              + Add Charger Slot
            </Button>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto border-b border-[#494551]/40 pb-2 text-xs font-semibold">
            {['all', 'available', 'occupied', 'reserved', 'maintenance'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3.5 py-1.5 rounded-xl capitalize transition-all ${
                  filter === f ? 'bg-[#2D8CFF] text-slate-950 font-bold shadow' : 'bg-[#1d1b20] text-[#cbc4d2] hover:text-white'
                }`}
              >
                {f} ({f === 'all' ? bays.length : bays.filter((b) => b.status === f).length})
              </button>
            ))}
          </div>

          {/* Slots Table */}
          <Card className="p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#1d1b20] border-b border-[#494551]/40 text-[#948e9c] uppercase font-semibold">
                  <tr>
                    <th className="p-4">Bay ID</th>
                    <th className="p-4">Hardware Type</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Current Session / Info</th>
                    <th className="p-4">Health %</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#494551]/30">
                  {filteredBays.map((b) => (
                    <tr key={b.id} className="hover:bg-[#211f24] transition-colors">
                      <td className="p-4 font-headline font-extrabold text-white text-sm">{b.id}</td>
                      <td className="p-4 text-[#cbc4d2]">{b.type}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                          b.status === 'available' ? 'bg-[#22C55E]/20 text-[#22C55E]' :
                          b.status === 'occupied' ? 'bg-[#2D8CFF]/20 text-[#36D8FF]' :
                          b.status === 'reserved' ? 'bg-[#8B5CF6]/20 text-[#c084fc]' :
                          'bg-[#ffb4ab]/20 text-[#ffb4ab]'
                        }`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="p-4 text-[#cbc4d2] font-mono text-[11px]">{b.session}</td>
                      <td className="p-4 font-bold text-white">{b.health}</td>
                      <td className="p-4 text-right">
                        <Button
                          variant={b.status === 'maintenance' ? 'primary' : 'secondary'}
                          size="sm"
                          icon={Wrench}
                          onClick={() => toggleMaintenance(b.id)}
                        >
                          {b.status === 'maintenance' ? 'Re-enable' : 'Maintenance'}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </main>

        <Footer />
      </div>
    </div>
  );
}
