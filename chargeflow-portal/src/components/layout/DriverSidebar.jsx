import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from '../ui/Logo';
import { LayoutDashboard, MapPin, CalendarCheck, Leaf, Bell, Settings, LogOut, Car, BatteryCharging, Zap, ShieldCheck } from 'lucide-react';
import useAuth from '../../hooks/useAuth';

export default function DriverSidebar({ mobileOpen, setMobileOpen }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { label: 'Dashboard', path: '/driver/dashboard', icon: LayoutDashboard },
    { label: 'Map Explorer', path: '/driver/explore', icon: MapPin },
    { label: 'Active Session', path: '/driver/session/active', icon: Zap, badge: 'Live' },
    { label: 'My Bookings', path: '/driver/bookings', icon: CalendarCheck },
    { label: 'Green Insights', path: '/driver/insights', icon: Leaf },
    { label: 'Notifications', path: '/driver/notifications', icon: Bell, unread: true },
    { label: 'Profile & Settings', path: '/driver/profile', icon: Settings },
  ];

  const vehicleName = user?.vehicle?.model
    ? `${user.vehicle.brand || user.vehicle.make || ''} ${user.vehicle.model}`
    : 'Tata Nexon EV';
  const rangeKm = Math.round((user?.vehicle?.batteryCapacityKWh || 40.5) * 6 * 0.64);

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 bottom-0 w-64 bg-[#141218] border-r border-[#494551]/40 z-50 flex flex-col justify-between p-4 transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="space-y-6">
          <div className="px-2 pt-2">
            <Logo size="md" />
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-[#948e9c] mb-2">
              Driver Portal
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = currentPath === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen && setMobileOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    active
                      ? 'bg-gradient-to-r from-[#6750a4] to-[#4f378a] text-white shadow-md shadow-[#6750a4]/30'
                      : 'text-[#cbc4d2] hover:bg-[#211f24] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-[#948e9c]'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#22C55E]/20 text-[#22C55E] animate-pulse">
                      {item.badge}
                    </span>
                  )}
                  {item.unread && (
                    <span className="w-2 h-2 rounded-full bg-[#36D8FF]" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* EV Telemetry & Account Widget */}
        <div className="space-y-4 pt-4 border-t border-[#494551]/40">
          <div className="bg-[#211f24] border border-[#494551]/60 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Car className="w-4 h-4 text-[#cfbcff]" />
                <span className="text-xs font-bold text-white max-w-[120px] truncate">{vehicleName}</span>
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#22C55E]/15 text-[#22C55E]">
                Connected
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-[#948e9c]">
              <span className="flex items-center gap-1">
                <BatteryCharging className="w-3.5 h-3.5 text-[#22C55E]" /> 64% SoC
              </span>
              <span>{rangeKm} km Range</span>
            </div>
            <div className="w-full h-1.5 bg-[#1d1b20] rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#2D8CFF] to-[#22C55E] rounded-full" style={{ width: '64%' }} />
            </div>
          </div>

          <button
            onClick={() => {
              logout();
              window.location.href = '/driver/login';
            }}
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-[#ffb4ab] hover:bg-[#93000a]/20 transition-colors w-full text-left"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
