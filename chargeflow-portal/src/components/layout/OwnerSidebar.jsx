import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from '../ui/Logo';
import { LayoutDashboard, Building2, Cpu, DollarSign, Activity, BarChart3, MessageSquare, Settings, LogOut, ShieldCheck } from 'lucide-react';

export default function OwnerSidebar({ mobileOpen, setMobileOpen }) {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { label: 'Dashboard', path: '/owner/dashboard', icon: LayoutDashboard },
    { label: 'My Stations', path: '/owner/stations', icon: Building2 },
    { label: 'Slot Management', path: '/owner/slots', icon: Cpu },
    { label: 'Pricing Control', path: '/owner/pricing', icon: DollarSign },
    { label: 'Owner Digital Twin', path: '/owner/twin', icon: Activity, badge: 'Live' },
    { label: 'Analytics', path: '/owner/analytics', icon: BarChart3 },
    { label: 'Feedback Center', path: '/owner/feedback', icon: MessageSquare },
    { label: 'Business Settings', path: '/owner/settings', icon: Settings },
  ];

  return (
    <>
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
          <div className="px-2 pt-2 flex items-center justify-between">
            <Logo size="md" />
            <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#2D8CFF]/20 text-[#36D8FF]">
              Console
            </span>
          </div>

          <nav className="space-y-1">
            <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-[#948e9c] mb-2">
              Operator Console
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
                      ? 'bg-gradient-to-r from-[#2D8CFF] to-[#1b79ee] text-slate-950 font-bold shadow-md shadow-[#2D8CFF]/30'
                      : 'text-[#cbc4d2] hover:bg-[#211f24] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${active ? 'text-slate-950' : 'text-[#948e9c]'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#22C55E]/20 text-[#22C55E]">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Network Status & Logout */}
        <div className="space-y-4 pt-4 border-t border-[#494551]/40">
          <div className="bg-[#211f24] border border-[#2D8CFF]/30 rounded-xl p-3 space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white">VoltCharge Networks</span>
              <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-ping" />
            </div>
            <p className="text-[10px] text-[#948e9c]">3 Active Stations • 24 Bays Online</p>
          </div>

          <Link
            to="/owner/login"
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-[#ffb4ab] hover:bg-[#93000a]/20 transition-colors w-full"
          >
            <LogOut className="w-4 h-4" />
            <span>Console Sign Out</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
