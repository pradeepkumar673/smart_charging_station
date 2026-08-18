import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DriverSidebar from '../components/layout/DriverSidebar';
import DriverHeader from '../components/layout/DriverHeader';
import Footer from '../components/layout/Footer';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { CalendarCheck, Clock, Zap, MapPin, QrCode, Navigation, ArrowRight, CheckCircle2, XCircle, RotateCcw, X } from 'lucide-react';

export default function MyBookings() {
  const navigate = useNavigate();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming', 'ongoing', 'completed', 'cancelled'
  const [qrModal, setQrModal] = useState(false);

  const bookings = {
    upcoming: [
      { id: 'BKG-8821', station: 'ChargeFlow Hub - MG Road', bay: 'Bay A2 (150kW CCS2)', time: 'Today • 7:30 PM - 8:15 PM', status: 'Confirmed', countdown: '14m 32s', cost: '₹760.00' },
    ],
    ongoing: [
      { id: 'SES-9042', station: 'Indiranagar Supercharge', bay: 'Bay B1 (350kW NACS)', time: 'Started 28 mins ago', status: 'Charging (64%)', energy: '24.8 kWh', cost: '₹347.20' },
    ],
    completed: [
      { id: 'BKG-7710', station: 'Koramangala Green Hub', bay: 'Bay A4 (60kW CCS2)', date: '15 Aug 2026', energy: '42.5 kWh', cost: '₹595.00', points: '+170 Points' },
      { id: 'BKG-6420', station: 'Whitefield Tech Bay', bay: 'Bay B2 (150kW DC)', date: '12 Aug 2026', energy: '38.0 kWh', cost: '₹608.00', points: '+150 Points' },
    ],
    cancelled: [
      { id: 'BKG-5100', station: 'HSR Sector 1 Hub', date: '08 Aug 2026', reason: 'Driver requested cancellation', refundStatus: 'Refunded ₹25.00' },
    ],
  };

  return (
    <div className="min-h-screen bg-[#141218] text-[#e6e0e9] flex">
      <DriverSidebar mobileOpen={mobileSidebarOpen} setMobileOpen={setMobileSidebarOpen} />

      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        <DriverHeader setMobileSidebarOpen={setMobileSidebarOpen} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto w-full">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#494551]/40 pb-4">
            <div>
              <h1 className="font-headline font-extrabold text-2xl sm:text-3xl text-white">My Charging Bookings</h1>
              <p className="text-xs text-[#948e9c]">Manage active reservations, live sessions, and receipt history.</p>
            </div>
            <Link to="/driver/explore">
              <Button variant="brand" size="sm" icon={Zap}>
                Book New Charger
              </Button>
            </Link>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto border-b border-[#494551]/40 pb-2">
            {[
              { id: 'upcoming', label: 'Upcoming', count: bookings.upcoming.length },
              { id: 'ongoing', label: 'Ongoing', count: bookings.ongoing.length, live: true },
              { id: 'completed', label: 'Completed', count: bookings.completed.length },
              { id: 'cancelled', label: 'Cancelled', count: bookings.cancelled.length },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-[#6750a4] text-white shadow-md shadow-[#6750a4]/30'
                    : 'bg-[#1d1b20] text-[#cbc4d2] hover:bg-[#211f24]'
                }`}
              >
                {tab.live && <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-ping" />}
                <span>{tab.label} ({tab.count})</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="space-y-4">
            {activeTab === 'upcoming' && bookings.upcoming.map((b) => (
              <Card key={b.id} glow className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#8B5CF6]/20 text-[#c084fc]">
                      {b.status}
                    </span>
                    <span className="text-xs text-[#948e9c]">ID #{b.id}</span>
                  </div>
                  <h3 className="font-headline font-bold text-xl text-white">{b.station}</h3>
                  <p className="text-xs text-[#cbc4d2]">{b.bay} • {b.time}</p>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-[#494551]/40 pt-3 md:pt-0">
                  <div className="text-left md:text-right">
                    <span className="text-[10px] text-[#948e9c] uppercase block">Check-in Window</span>
                    <span className="font-extrabold text-sm text-[#36D8FF] animate-pulse">{b.countdown}</span>
                  </div>
                  <Button variant="secondary" size="sm" icon={QrCode} onClick={() => setQrModal(true)}>
                    QR Check-in
                  </Button>
                  <Link to={`/driver/navigation/${b.id}`}>
                    <Button variant="brand" size="sm" icon={Navigation}>
                      Start Route
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}

            {activeTab === 'ongoing' && bookings.ongoing.map((b) => (
              <Card key={b.id} className="border-[#22C55E]/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-ping" />
                    <span className="text-xs font-bold text-[#22C55E] uppercase">{b.status}</span>
                  </div>
                  <h3 className="font-headline font-bold text-xl text-white">{b.station}</h3>
                  <p className="text-xs text-[#cbc4d2]">{b.bay} • {b.time}</p>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                  <div>
                    <span className="text-[10px] text-[#948e9c] uppercase block">Energy / Cost</span>
                    <span className="font-bold text-sm text-white">{b.energy} • {b.cost}</span>
                  </div>
                  <Link to="/driver/session/active">
                    <Button variant="primary" size="sm" icon={ArrowRight} iconPosition="right">
                      View Live Session
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}

            {activeTab === 'completed' && bookings.completed.map((b) => (
              <Card key={b.id} className="flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-headline font-bold text-base text-white">{b.station}</h4>
                  <p className="text-[#948e9c]">{b.bay} • {b.date}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="font-bold text-white block">{b.energy} ({b.cost})</span>
                    <span className="text-[#22C55E] font-semibold">{b.points}</span>
                  </div>
                  <Link to={`/driver/session/${b.id}/summary`}>
                    <Button variant="secondary" size="sm">
                      Receipt
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}

            {activeTab === 'cancelled' && bookings.cancelled.map((b) => (
              <Card key={b.id} className="opacity-70 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-headline font-bold text-base text-white">{b.station}</h4>
                  <p className="text-[#ffb4ab]">{b.reason} • {b.date}</p>
                </div>
                <span className="text-[#cbc4d2] font-medium">{b.refundStatus}</span>
              </Card>
            ))}
          </div>
        </main>

        {/* QR Code Modal */}
        {qrModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
            <div className="bg-[#1d1b20] border border-[#494551] rounded-3xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl">
              <div className="flex justify-between items-center border-b border-[#494551]/40 pb-3">
                <h3 className="font-headline font-bold text-lg text-white">Station QR Pass</h3>
                <button onClick={() => setQrModal(false)} className="p-1 text-[#948e9c] hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="bg-white p-4 rounded-2xl inline-block mx-auto">
                <QrCode className="w-36 h-36 text-slate-950" />
                <span className="block text-[10px] font-mono font-bold text-slate-800 mt-1">ID #BKG-8821</span>
              </div>
              <p className="text-xs text-[#cbc4d2]">Scan at Bay A2 dispenser to authorize charge session automatically.</p>
            </div>
          </div>
        )}

        <Footer />
      </div>
    </div>
  );
}
