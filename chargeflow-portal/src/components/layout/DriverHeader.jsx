import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, MapPin, Bell } from 'lucide-react';
import useAuth from '../../hooks/useAuth';

export default function DriverHeader({ setMobileSidebarOpen }) {
  const { user } = useAuth();
  const userName = user?.name ? user.name.split(' ')[0] : 'Driver';

  return (
    <header className="sticky top-0 z-30 w-full bg-[#141218]/90 backdrop-blur-md border-b border-[#494551]/40 px-4 sm:px-8 py-3.5 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileSidebarOpen(true)}
          className="lg:hidden p-2 rounded-lg bg-[#211f24] border border-[#494551]/60 text-[#cbc4d2] hover:text-white"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="font-headline font-extrabold text-lg sm:text-xl text-white">
            Welcome back, <span className="text-[#cfbcff]">{userName}</span>
          </h1>
          <div className="flex items-center gap-1.5 text-xs text-[#948e9c]">
            <MapPin className="w-3.5 h-3.5 text-[#36D8FF]" />
            <span>Bengaluru, Karnataka</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Backend Status Badge */}
        <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-bold text-[#22C55E] bg-[#22C55E]/15 border border-[#22C55E]/30 px-2.5 py-1 rounded-full">
          <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-ping" />
          <span>Grid Connected (v1.0)</span>
        </div>

        {/* Notification Bell */}
        <Link to="/driver/notifications" className="relative p-2.5 rounded-xl bg-[#211f24] border border-[#494551]/60 text-[#cbc4d2] hover:text-white hover:border-[#cfbcff]/50 transition-all">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-[#36D8FF] ring-2 ring-[#141218]" />
        </Link>

        {/* User Profile Avatar */}
        <Link to="/driver/profile" className="flex items-center gap-3 pl-2 border-l border-[#494551]/40">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#6750a4] to-[#36D8FF] p-0.5 shadow-md shadow-[#6750a4]/30">
              <div className="w-full h-full rounded-full bg-[#211f24] flex items-center justify-center text-[#cfbcff] font-bold text-sm">
                {userName[0] || 'D'}
              </div>
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#22C55E] ring-2 ring-[#141218]" />
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-xs font-bold text-white">{user?.name || 'EV Driver'}</div>
            <div className="text-[10px] text-[#22C55E]">Pro Driver</div>
          </div>
        </Link>
      </div>
    </header>
  );
}
