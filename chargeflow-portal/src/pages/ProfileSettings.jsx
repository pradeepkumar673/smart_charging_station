import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DriverSidebar from '../components/layout/DriverSidebar';
import DriverHeader from '../components/layout/DriverHeader';
import Footer from '../components/layout/Footer';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { User, Car, Zap, Bell, Shield, Moon, Sun, Lock, LogOut, CheckCircle2, ChevronRight } from 'lucide-react';

export default function ProfileSettings() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [preferRenewable, setPreferRenewable] = useState(true);
  const [notifyBookings, setNotifyBookings] = useState(true);

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
                  AN
                </div>
              </div>
              <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-[#22C55E] ring-2 ring-[#141218]" />
            </div>

            <div className="space-y-1 text-center sm:text-left flex-1">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h2 className="font-headline font-extrabold text-2xl text-white">Anaya Sharma</h2>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#22C55E]/15 text-[#22C55E]">
                  Pro Eco Driver
                </span>
              </div>
              <p className="text-xs text-[#948e9c]">anaya.sharma@example.com • +1 (555) 234-5678</p>
              <div className="text-xs text-[#36D8FF] font-semibold pt-1">
                Green Member Score: <strong className="text-white">842 / 1000</strong> (Top 5% Grid Driver)
              </div>
            </div>

            <Button variant="secondary" size="sm">
              Edit Profile
            </Button>
          </Card>

          {/* Connected Vehicles */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-headline font-bold text-lg text-white">Connected Vehicles</h3>
              <Button variant="outline" size="sm" icon={Car}>
                + Add EV
              </Button>
            </div>

            <Card className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-[#6750a4]/20 text-[#cfbcff]">
                  <Car className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-headline font-bold text-white text-base">Tata Nexon EV Max</h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#36D8FF]/20 text-[#36D8FF]">
                      Primary EV
                    </span>
                  </div>
                  <p className="text-xs text-[#948e9c]">77.4 kWh Battery • CCS2 Fast Charging • VIN #8XYZ901</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-[#948e9c]" />
            </Card>
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
            <Link to="/">
              <Button variant="destructive" size="lg" icon={LogOut} fullWidth>
                Sign Out of ChargeFlow Account
              </Button>
            </Link>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
