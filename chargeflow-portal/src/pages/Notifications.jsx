import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DriverSidebar from '../components/layout/DriverSidebar';
import DriverHeader from '../components/layout/DriverHeader';
import Footer from '../components/layout/Footer';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Bell, CalendarCheck, Zap, DollarSign, AlertCircle, CheckCircle2, ArrowRight, Trash2 } from 'lucide-react';

export default function Notifications() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const [notifications, setNotifications] = useState([
    { id: 1, type: 'bookings', title: 'Booking Confirmed — ChargeFlow Hub MG Road', body: 'Bay A2 is reserved for your Tata Nexon EV today at 7:30 PM.', time: '10 min ago', unread: true, link: '/driver/bookings', icon: CalendarCheck, color: '#8B5CF6' },
    { id: 2, type: 'charging', title: 'Charging Session Complete', body: 'Session #SES-9042 ended. 42.5 kWh delivered. Tell us how the station was!', time: '1 hour ago', unread: true, link: '/driver/session/ses-9042/summary', icon: Zap, color: '#22C55E' },
    { id: 3, type: 'savings', title: 'Off-Peak Tariff Alert', body: 'Save ₹28 by booking EcoCharge HSR Hub after 9:30 PM tonight.', time: '3 hours ago', unread: true, link: '/driver/explore', icon: DollarSign, color: '#e7c365' },
    { id: 4, type: 'alerts', title: 'No-Show Slot Available', body: 'A 150 kW DC Fast bay opened up at Koramangala Hub. Claim it within 8 minutes.', time: '5 hours ago', unread: true, link: '/driver/claim-slot', icon: AlertCircle, color: '#36D8FF' },
    { id: 5, type: 'savings', title: '+170 Green Points Credited', body: 'Your 92% solar charging session earned +170 Green Points.', time: 'Yesterday', unread: false, link: '/driver/insights', icon: CheckCircle2, color: '#22C55E' },
  ]);

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, unread: false })));
  };

  const filtered = activeTab === 'all' ? notifications : notifications.filter((n) => n.type === activeTab);

  return (
    <div className="min-h-screen bg-[#141218] text-[#e6e0e9] flex">
      <DriverSidebar mobileOpen={mobileSidebarOpen} setMobileOpen={setMobileSidebarOpen} />

      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        <DriverHeader setMobileSidebarOpen={setMobileSidebarOpen} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-4xl mx-auto w-full">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#494551]/40 pb-4">
            <div>
              <h1 className="font-headline font-extrabold text-2xl sm:text-3xl text-white">Notifications</h1>
              <p className="text-xs text-[#948e9c]">Real-time station updates, booking alerts, and reward notifications.</p>
            </div>
            <Button variant="ghost" size="sm" onClick={markAllRead}>
              Mark all as read
            </Button>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto border-b border-[#494551]/40 pb-2">
            {[
              { id: 'all', label: 'All' },
              { id: 'bookings', label: 'Bookings' },
              { id: 'charging', label: 'Charging' },
              { id: 'savings', label: 'Savings' },
              { id: 'alerts', label: 'Station Alerts' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-[#6750a4] text-white shadow'
                    : 'bg-[#1d1b20] text-[#cbc4d2] hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Notifications Feed */}
          <div className="space-y-3">
            {filtered.length > 0 ? (
              filtered.map((n) => {
                const Icon = n.icon;
                return (
                  <Card
                    key={n.id}
                    className={`flex items-start justify-between gap-4 transition-all hover:border-[#cfbcff]/50 ${
                      n.unread ? 'border-[#6750a4]/50 bg-[#211f24]' : 'opacity-80'
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      <div
                        className="p-2.5 rounded-xl shrink-0 mt-0.5"
                        style={{ backgroundColor: `${n.color}20`, color: n.color }}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-headline font-bold text-base text-white">{n.title}</h4>
                          {n.unread && <span className="w-2 h-2 rounded-full bg-[#36D8FF]" />}
                        </div>
                        <p className="text-xs text-[#cbc4d2] leading-relaxed">{n.body}</p>
                        <span className="text-[10px] text-[#948e9c] block pt-1">{n.time}</span>
                      </div>
                    </div>

                    <Link to={n.link} className="shrink-0 pt-1">
                      <Button variant="secondary" size="sm" icon={ArrowRight} />
                    </Link>
                  </Card>
                );
              })
            ) : (
              <div className="text-center py-12 space-y-3">
                <Bell className="w-12 h-12 text-[#494551] mx-auto" />
                <h3 className="font-headline font-bold text-lg text-white">You're All Caught Up</h3>
                <p className="text-xs text-[#948e9c]">No notifications found for this category.</p>
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
