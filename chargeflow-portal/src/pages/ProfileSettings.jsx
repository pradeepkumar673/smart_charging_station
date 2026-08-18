import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DriverSidebar from '../components/layout/DriverSidebar';
import DriverHeader from '../components/layout/DriverHeader';
import Footer from '../components/layout/Footer';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { User, Car, Zap, LogOut, ChevronRight } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import useToast from '../hooks/useToast';
import api from '../services/api';

export default function ProfileSettings() {
  const navigate = useNavigate();
  const { user, logout, loadUser } = useAuth();
  const { showToast } = useToast();

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [preferRenewable, setPreferRenewable] = useState(true);
  const [editingVehicle, setEditingVehicle] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const vehicle = user?.vehicle || {};

  const [vehicleForm, setVehicleForm] = useState({
    brand: vehicle.brand || vehicle.make || 'Tata',
    model: vehicle.model || 'Nexon EV Max',
    regNumber: vehicle.regNumber || vehicle.registrationNumber || 'KA01EV1234',
    connectorType: vehicle.connectorType || 'CCS2',
    batteryCapacityKWh: vehicle.batteryCapacityKWh || 40.5,
  });

  const handleUpdateVehicle = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.patch('/users/profile', {
        vehicle: {
          make: vehicleForm.brand,
          model: vehicleForm.model,
          regNumber: vehicleForm.regNumber,
          connectorType: vehicleForm.connectorType,
          batteryCapacityKWh: Number(vehicleForm.batteryCapacityKWh) || 40,
        },
      });

      await loadUser();
      setEditingVehicle(false);
      showToast({
        title: 'Vehicle Updated',
        message: 'Your EV specifications have been saved.',
        type: 'success',
      });
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || 'Could not update vehicle profile.';
      showToast({ title: 'Update Error', message: errMsg, type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    logout();
    showToast({ title: 'Signed Out', message: 'You have signed out of ChargeFlow.', type: 'info' });
    navigate('/');
  };

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : 'CF';

  return (
    <div className="min-h-screen bg-[#141218] text-[#e6e0e9] flex">
      <DriverSidebar mobileOpen={mobileSidebarOpen} setMobileOpen={setMobileSidebarOpen} />

      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        <DriverHeader setMobileSidebarOpen={setMobileSidebarOpen} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 max-w-4xl mx-auto w-full">
          {/* Profile Header Card */}
          <Card glow className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#6750a4] via-[#2D8CFF] to-[#36D8FF] p-1 shadow-lg shadow-[#6750a4]/40">
                <div className="w-full h-full rounded-full bg-[#211f24] flex items-center justify-center text-white font-headline font-extrabold text-2xl">
                  {initials}
                </div>
              </div>
              <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-[#22C55E] ring-2 ring-[#141218]" />
            </div>

            <div className="space-y-1 text-center sm:text-left flex-1">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h2 className="font-headline font-extrabold text-2xl text-white">{user?.name || 'EV Driver'}</h2>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#22C55E]/15 text-[#22C55E]">
                  {user?.role === 'owner' ? 'Station Owner' : 'Pro Eco Driver'}
                </span>
              </div>
              <p className="text-xs text-[#948e9c]">{user?.email} • {user?.phone || '+91 9876543210'}</p>
              <div className="text-xs text-[#36D8FF] font-semibold pt-1">
                Green Member Score: <strong className="text-white">842 / 1000</strong> (Top 5% Grid Driver)
              </div>
            </div>
          </Card>

          {/* Connected Vehicles */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-headline font-bold text-lg text-white">Connected Vehicle Specs</h3>
              <Button
                variant="outline"
                size="sm"
                icon={Car}
                onClick={() => setEditingVehicle(!editingVehicle)}
              >
                {editingVehicle ? 'Cancel' : 'Edit Specs'}
              </Button>
            </div>

            {editingVehicle ? (
              <Card className="space-y-4">
                <form onSubmit={handleUpdateVehicle} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Make / Brand"
                      value={vehicleForm.brand}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, brand: e.target.value })}
                      required
                    />
                    <Input
                      label="Model"
                      value={vehicleForm.model}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, model: e.target.value })}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Input
                      label="Registration Number"
                      value={vehicleForm.regNumber}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, regNumber: e.target.value })}
                      required
                    />
                    <Input
                      label="Battery (kWh)"
                      type="number"
                      value={vehicleForm.batteryCapacityKWh}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, batteryCapacityKWh: e.target.value })}
                      required
                    />
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold uppercase text-[#cbc4d2]">Connector</label>
                      <select
                        value={vehicleForm.connectorType}
                        onChange={(e) => setVehicleForm({ ...vehicleForm, connectorType: e.target.value })}
                        className="w-full rounded-xl bg-[#1d1b20] border border-[#494551] text-white text-xs px-3 py-2.5"
                      >
                        <option value="CCS2">CCS2</option>
                        <option value="Type2">Type 2</option>
                        <option value="NACS">NACS</option>
                        <option value="CHAdeMO">CHAdeMO</option>
                      </select>
                    </div>
                  </div>

                  <Button type="submit" variant="brand" size="sm" loading={submitting}>
                    Save Vehicle Specifications
                  </Button>
                </form>
              </Card>
            ) : (
              <Card className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-2xl bg-[#6750a4]/20 text-[#cfbcff]">
                    <Car className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-headline font-bold text-white text-base">
                        {vehicleForm.brand} {vehicleForm.model}
                      </h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#36D8FF]/20 text-[#36D8FF]">
                        Primary EV
                      </span>
                    </div>
                    <p className="text-xs text-[#948e9c]">
                      {vehicleForm.batteryCapacityKWh} kWh Battery • {vehicleForm.connectorType} Fast Charging • Reg #{vehicleForm.regNumber}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-[#948e9c]" />
              </Card>
            )}
          </div>

          {/* Preferences */}
          <div className="space-y-4">
            <h3 className="font-headline font-bold text-lg text-white">Charging Preferences</h3>
            <Card className="space-y-4 text-xs">
              <div className="flex items-center justify-between py-2 border-b border-[#494551]/40">
                <div>
                  <span className="font-bold text-white block">Prefer 100% Renewable Stations</span>
                  <span className="text-[#948e9c]">Prioritize stations powered by solar and wind micro-grids</span>
                </div>
                <input
                  type="checkbox"
                  checked={preferRenewable}
                  onChange={(e) => setPreferRenewable(e.target.checked)}
                  className="w-5 h-5 rounded bg-[#1d1b20] text-[#6750a4]"
                />
              </div>

              <div className="flex items-center justify-between py-2">
                <div>
                  <span className="font-bold text-white block">Auto Plug & Charge (ISO 15118)</span>
                  <span className="text-[#948e9c]">Authenticate immediately upon connecting dispenser cable</span>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5 rounded bg-[#1d1b20] text-[#6750a4]" />
              </div>
            </Card>
          </div>

          {/* Sign out button */}
          <div className="pt-4 text-center">
            <Button variant="destructive" size="lg" icon={LogOut} fullWidth onClick={handleLogout}>
              Sign Out of ChargeFlow Account
            </Button>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
