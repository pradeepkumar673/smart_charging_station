import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import DriverSidebar from '../components/layout/DriverSidebar';
import DriverHeader from '../components/layout/DriverHeader';
import Footer from '../components/layout/Footer';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Skeleton from '../components/ui/Skeleton';
import { Bell, CalendarCheck, Zap, DollarSign, AlertCircle, ArrowRight } from 'lucide-react';
import api from '../services/api';
import useToast from '../hooks/useToast';

export default function Notifications() {
  const { showToast } = useToast();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/notifications');
      const list = response.data?.data?.notifications || [];
      setNotifications(list);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAllRead = async () => {
    try {
      await api.patch('/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      showToast({ title: 'Notifications', message: 'All notifications marked as read', type: 'info' });
    } catch (err) {
      showToast({ title: 'Error', message: 'Could not mark notifications as read', type: 'error' });
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'booking':
        return { icon: CalendarCheck, color: '#8B5CF6' };
      case 'charging':
      case 'session':
        return { icon: Zap, color: '#22C55E' };
      case 'savings':
        return { icon: DollarSign, color: '#e7c365' };
      default:
        return { icon: AlertCircle, color: '#36D8FF' };
    }
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
              { id: 'booking', label: 'Bookings' },
              { id: 'charging', label: 'Charging' },
              { id: 'station', label: 'Station Alerts' },
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
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="w-full h-20 rounded-2xl" />)
            ) : filtered.length > 0 ? (
              filtered.map((n) => {
                const { icon: Icon, color } = getIcon(n.type);
                return (
                  <Card
                    key={n._id || n.id}
                    className={`flex items-start justify-between gap-4 transition-all hover:border-[#cfbcff]/50 ${
                      !n.isRead ? 'border-[#6750a4]/50 bg-[#211f24]' : 'opacity-80'
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      <div
                        className="p-2.5 rounded-xl shrink-0 mt-0.5"
                        style={{ backgroundColor: `${color}20`, color }}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-headline font-bold text-base text-white">{n.title}</h4>
                          {!n.isRead && <span className="w-2 h-2 rounded-full bg-[#36D8FF]" />}
                        </div>
                        <p className="text-xs text-[#cbc4d2] leading-relaxed">{n.message || n.body}</p>
                        <span className="text-[10px] text-[#948e9c] block pt-1">
                          {new Date(n.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <Link to="/driver/bookings" className="shrink-0 pt-1">
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
