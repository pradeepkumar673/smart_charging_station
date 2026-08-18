import React, { useState, useEffect, useCallback } from 'react';
import OwnerSidebar from '../../components/layout/OwnerSidebar';
import OwnerHeader from '../../components/layout/OwnerHeader';
import Footer from '../../components/layout/Footer';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Skeleton from '../../components/ui/Skeleton';
import { Wrench } from 'lucide-react';
import api from '../../services/api';
import useToast from '../../hooks/useToast';

export default function SlotManagement() {
  const { showToast } = useToast();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const [stations, setStations] = useState([]);
  const [selectedStationId, setSelectedStationId] = useState('');
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingSlotId, setUpdatingSlotId] = useState(null);
  const [filter, setFilter] = useState('all');

  const loadOwnerStations = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/stations/my');
      const list = response.data?.data?.stations || [];
      setStations(list);
      if (list.length > 0) {
        setSelectedStationId(list[0]._id);
      }
    } catch (err) {
      console.error('Failed to load stations:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOwnerStations();
  }, [loadOwnerStations]);

  const loadSlotsForStation = useCallback(async (stnId) => {
    if (!stnId) return;
    setLoading(true);
    try {
      const response = await api.get(`/stations/${stnId}`);
      const slotList = response.data?.data?.slots || [];
      setSlots(slotList);
    } catch (err) {
      console.error('Failed to load slots:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedStationId) {
      loadSlotsForStation(selectedStationId);
    }
  }, [selectedStationId, loadSlotsForStation]);

  const handleToggleSlotStatus = async (slotId, currentStatus) => {
    setUpdatingSlotId(slotId);
    const newStatus = currentStatus === 'maintenance' ? 'available' : 'maintenance';
    try {
      await api.patch(`/slots/${slotId}`, { status: newStatus });
      showToast({
        title: 'Slot Updated',
        message: `Bay status set to ${newStatus}.`,
        type: 'success',
      });
      loadSlotsForStation(selectedStationId);
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || 'Could not update slot status.';
      showToast({ title: 'Update Error', message: errMsg, type: 'error' });
    } finally {
      setUpdatingSlotId(null);
    }
  };

  const filteredSlots = filter === 'all' ? slots : slots.filter((s) => s.status === filter);

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
              <p className="text-xs text-[#948e9c]">Real-time hardware bay status and maintenance control.</p>
            </div>

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
                {f} ({f === 'all' ? slots.length : slots.filter((b) => b.status === f).length})
              </button>
            ))}
          </div>

          {/* Slots Table */}
          {loading ? (
            <Skeleton className="w-full h-80 rounded-2xl" />
          ) : (
            <Card className="p-0 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#1d1b20] border-b border-[#494551]/40 text-[#948e9c] uppercase font-semibold">
                    <tr>
                      <th className="p-4">Bay ID</th>
                      <th className="p-4">Charger Type</th>
                      <th className="p-4">Connector</th>
                      <th className="p-4">Max Power</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#494551]/30">
                    {filteredSlots.map((b) => (
                      <tr key={b._id} className="hover:bg-[#211f24] transition-colors">
                        <td className="p-4 font-headline font-extrabold text-white text-sm">Bay {b.slotId}</td>
                        <td className="p-4 text-[#cbc4d2]">{b.chargerType}</td>
                        <td className="p-4 font-semibold text-[#36D8FF]">{b.connectorType}</td>
                        <td className="p-4 font-bold text-white">{b.maxPowerKw} kW</td>
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
                        <td className="p-4 text-right">
                          <Button
                            variant={b.status === 'maintenance' ? 'primary' : 'secondary'}
                            size="sm"
                            loading={updatingSlotId === b._id}
                            icon={Wrench}
                            onClick={() => handleToggleSlotStatus(b._id, b.status)}
                          >
                            {b.status === 'maintenance' ? 'Re-enable Bay' : 'Set Maintenance'}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </main>

        <Footer />
      </div>
    </div>
  );
}
