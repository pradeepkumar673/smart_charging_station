import React from 'react';
import { Menu, Building2, Bell, ShieldCheck, ChevronDown } from 'lucide-react';

export default function OwnerHeader({ setMobileSidebarOpen }) {
  return (
    <header className="sticky top-0 z-30 w-full bg-[#141218]/90 backdrop-blur-md border-b border-[#494551]/40 px-4 sm:px-8 py-3.5 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileSidebarOpen(true)}
          className="lg:hidden p-2 rounded-lg bg-[#211f24] border border-[#494551]/60 text-[#cbc4d2] hover:text-white"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <h1 className="font-headline font-extrabold text-lg sm:text-xl text-white">
              Owner Console — <span className="text-[#36D8FF]">Arjun Patel</span>
            </h1>
          </div>

          {/* Station Selector Dropdown */}
          <div className="relative">
            <select className="bg-[#1d1b20] border border-[#494551] text-xs font-semibold text-[#e6e0e9] px-3 py-2 rounded-xl focus:outline-none focus:border-[#36D8FF]">
              <option value="all">All Stations (3)</option>
              <option value="stn-01">VoltHub Indiranagar</option>
              <option value="stn-02">VoltHub Whitefield</option>
              <option value="stn-03">VoltHub Electronic City</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Notification Bell */}
        <button className="relative p-2.5 rounded-xl bg-[#211f24] border border-[#494551]/60 text-[#cbc4d2] hover:text-white transition-all">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-[#22C55E] ring-2 ring-[#141218]" />
        </button>

        {/* Owner Profile Avatar */}
        <div className="flex items-center gap-3 pl-2 border-l border-[#494551]/40">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#2D8CFF] to-[#36D8FF] p-0.5 shadow-md shadow-[#2D8CFF]/30">
            <div className="w-full h-full rounded-full bg-[#211f24] flex items-center justify-center text-[#36D8FF] font-bold text-sm">
              AP
            </div>
          </div>
          <div className="hidden md:block text-left">
            <div className="text-xs font-bold text-white">Arjun Patel</div>
            <div className="text-[10px] text-[#36D8FF]">Network Operator</div>
          </div>
        </div>
      </div>
    </header>
  );
}
