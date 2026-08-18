import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import OwnerSidebar from '../../components/layout/OwnerSidebar';
import OwnerHeader from '../../components/layout/OwnerHeader';
import Footer from '../../components/layout/Footer';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Skeleton from '../../components/ui/Skeleton';
import EmptyState from '../../components/states/EmptyState';
import { Plus, MapPin, Activity, ArrowRight, X, PlusCircle } from 'lucide-react';
import api from '../../services/api';
import useToast from '../../hooks/useToast';

export default function MyStations() {
  const { showToast } = useToast();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [stations, setStations] = useState([]);

  const [form, setForm] = useState({
    name: '',
    address: '',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560001',
    latitude: 12.9716,
    longitude: 77.6412,
    totalSlots: 6,
    basePricePerKWh: 14.5,
  });

  const fetchMyStations = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/stations/my');
      const list = response.data?.data?.stations || [];
      setStations(list);
    } catch (err) {
      console.error('Failed to load owner stations:', err);
      showToast({ title: 'Error', message: 'Could not load your stations list.', type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchMyStations();
  }, [fetchMyStations]);

  const handleCreateStation = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        name: form.name,
        address: form.address,
        city: form.city,
        state: form.state,
        pincode: form.pincode,
        location: {
          type: 'Point',
          coordinates: [Number(form.longitude) || 77.6412, Number(form.latitude) || 12.9716],
        },
        totalSlots: Number(form.totalSlots) || 6,
        basePricePerKWh: Number(form.basePricePerKWh) || 14.5,
        chargerTypes: ['DC', 'AC'],
      };

      await api.post('/stations', payload);
      showToast({
        title: 'Station Registered!',
        message: 'Station and charging slots provisioned successfully.',
        type: 'success',
      });
      setAddModal(false);
      fetchMyStations();
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || 'Failed to create station.';
      showToast({ title: 'Registration Error', message: errMsg, type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

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
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Skeleton className="h-64 rounded-2xl" />
              <Skeleton className="h-64 rounded-2xl" />
              <Skeleton className="h-64 rounded-2xl" />
            </div>
          ) : stations.length === 0 ? (
            <EmptyState
              icon={PlusCircle}
              title="No stations added"
              description="Add your first charging station to start managing bays, pricing, and bookings."
              ctaLabel="Add your first station"
              onCtaClick={() => setAddModal(true)}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {stations.map((s) => (
                <Card key={s._id} glow className="flex flex-col justify-between h-full space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-[#22C55E]/20 text-[#22C55E]">
                          {s.isOperational ? 'Operational' : 'Maintenance'}
                        </span>
                        <h3 className="font-headline font-bold text-xl text-white mt-1">{s.name}</h3>
                        <p className="text-xs text-[#948e9c] flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-[#36D8FF]" /> {s.address}, {s.city}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#494551]/40 text-center text-xs">
                      <div className="bg-[#1d1b20] p-2 rounded-xl border border-[#494551]/40">
                        <span className="text-[9px] text-[#948e9c] uppercase block">Bays</span>
                        <span className="font-bold text-white">{s.totalSlots || 6}</span>
                      </div>
                      <div className="bg-[#1d1b20] p-2 rounded-xl border border-[#494551]/40">
                        <span className="text-[9px] text-[#948e9c] uppercase block">Tariff Rate</span>
                        <span className="font-bold text-[#22C55E]">₹{s.basePricePerKWh}/kWh</span>
                      </div>
                      <div className="bg-[#1d1b20] p-2 rounded-xl border border-[#494551]/40">
                        <span className="text-[9px] text-[#948e9c] uppercase block">Available</span>
                        <span className="font-bold text-[#22C55E]">{s.availableSlotsCount ?? '—'}</span>
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
          )}
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

              <form onSubmit={handleCreateStation} className="space-y-3">
                <Input
                  label="Station Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="VoltHub Koramangala"
                  required
                />
                <Input
                  label="Address"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  placeholder="8th Block Koramangala"
                  required
                />
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Total Bays"
                    type="number"
                    value={form.totalSlots}
                    onChange={(e) => setForm({ ...form, totalSlots: e.target.value })}
                    required
                  />
                  <Input
                    label="Base Rate (₹/kWh)"
                    type="number"
                    value={form.basePricePerKWh}
                    onChange={(e) => setForm({ ...form, basePricePerKWh: e.target.value })}
                    required
                  />
                </div>

                <Button type="submit" variant="brand" fullWidth loading={submitting}>
                  Register & Auto-Provision Bays
                </Button>
              </form>
            </div>
          </div>
        )}

        <Footer />
      </div>
    </div>
  );
}
