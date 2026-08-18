import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DriverSidebar from '../components/layout/DriverSidebar';
import DriverHeader from '../components/layout/DriverHeader';
import Footer from '../components/layout/Footer';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import EmptyState from '../components/states/EmptyState';
import { BookingCardSkeleton } from '../components/ui/BookingCardSkeleton';
import { Zap, QrCode, Navigation, ArrowRight, CheckCircle2, XCircle, X, CalendarX2 } from 'lucide-react';
import api from '../services/api';
import useToast from '../hooks/useToast';

export default function MyBookings() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming', 'ongoing', 'completed', 'cancelled'
  const [qrModal, setQrModal] = useState(false);
  const [activeBookingForQr, setActiveBookingForQr] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingsData, setBookingsData] = useState([]);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const [rescheduleModal, setRescheduleModal] = useState(false);
  const [rescheduleBookingId, setRescheduleBookingId] = useState(null);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('');
  const [rescheduleDuration, setRescheduleDuration] = useState(45);
  const [rescheduleSubmitting, setRescheduleSubmitting] = useState(false);

  const handleRescheduleBooking = async (e) => {
    e.preventDefault();
    if (!rescheduleBookingId) return;
    setRescheduleSubmitting(true);
    try {
      const [hours, mins] = rescheduleTime.split(':');
      const startDateTime = new Date(rescheduleDate);
      startDateTime.setHours(Number(hours) || 12, Number(mins) || 0, 0, 0);

      await api.patch(`/bookings/${rescheduleBookingId}/reschedule`, {
        newStartTime: startDateTime.toISOString(),
        newDurationMinutes: Number(rescheduleDuration),
      });

      showToast({
        title: 'Booking Rescheduled',
        message: 'Your reservation has been rescheduled successfully.',
        type: 'success',
      });
      setRescheduleModal(false);
      fetchMyBookings();
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || 'Rescheduling failed.';
      showToast({
        title: 'Reschedule Error',
        message: errMsg,
        type: 'error',
      });
    } finally {
      setRescheduleSubmitting(false);
    }
  };

  const fetchMyBookings = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/bookings/my');
      const list = response.data?.data?.bookings || [];
      setBookingsData(list);
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
      showToast({
        title: 'Error',
        message: 'Could not load your charging bookings.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchMyBookings();
  }, [fetchMyBookings]);

  const handleCancelBooking = async (bookingId) => {
    setActionLoadingId(bookingId);
    try {
      await api.patch(`/bookings/${bookingId}/cancel`);
      showToast({
        title: 'Booking Cancelled',
        message: 'Your slot reservation has been cancelled and freed.',
        type: 'info',
      });
      fetchMyBookings();
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || 'Cancellation failed.';
      showToast({
        title: 'Error',
        message: errMsg,
        type: 'error',
      });
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleCheckInBooking = async (bookingId) => {
    setActionLoadingId(bookingId);
    try {
      await api.post(`/bookings/${bookingId}/checkin`);
      showToast({
        title: 'Checked In Successfully!',
        message: 'Charging session initiated.',
        type: 'success',
      });
      navigate('/driver/session/active');
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || 'Check-in failed.';
      showToast({
        title: 'Check-in Error',
        message: errMsg,
        type: 'error',
      });
    } finally {
      setActionLoadingId(null);
    }
  };

  const getFilteredBookings = (status) => {
    return bookingsData.filter((b) => b.status === status);
  };

  const upcomingList = getFilteredBookings('confirmed').filter(b => !b.isCheckedIn);
  const ongoingList = getFilteredBookings('confirmed').filter(b => b.isCheckedIn);
  const completedList = getFilteredBookings('completed');
  const cancelledList = getFilteredBookings('cancelled');

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
              { id: 'upcoming', label: 'Upcoming', count: upcomingList.length },
              { id: 'ongoing', label: 'Ongoing', count: ongoingList.length, live: true },
              { id: 'completed', label: 'Completed', count: completedList.length },
              { id: 'cancelled', label: 'Cancelled', count: cancelledList.length },
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
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => <BookingCardSkeleton key={i} />)
            ) : (
              <>
                {activeTab === 'upcoming' && (
                  upcomingList.length === 0 ? (
                    <EmptyState
                      icon={CalendarX2}
                      title="No upcoming bookings"
                      description="You haven't booked a charging slot yet. Find a station near you to get started."
                      ctaLabel="Find a station"
                      onCtaClick={() => navigate('/driver/explore')}
                    />
                  ) : (
                    upcomingList.map((b) => (
                      <Card key={b._id} glow className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#8B5CF6]/20 text-[#c084fc]">
                              Confirmed Reservation
                            </span>
                            <span className="text-xs text-[#948e9c]">ID #{b._id.slice(-6)}</span>
                          </div>
                          <h3 className="font-headline font-bold text-xl text-white">
                            {b.station?.name || 'Charging Station'}
                          </h3>
                          <p className="text-xs text-[#cbc4d2]">
                            Bay {b.slot?.slotId || 'A1'} ({b.slot?.connectorType || 'CCS2'}) • Start: {new Date(b.startTime).toLocaleString()}
                          </p>
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-[#494551]/40 pt-3 md:pt-0">
                          <div className="text-left md:text-right">
                            <span className="text-[10px] text-[#948e9c] uppercase block">Est. Cost</span>
                            <span className="font-extrabold text-sm text-[#36D8FF]">₹{b.estimatedCost}</span>
                          </div>

                           <Button
                            variant="secondary"
                            size="sm"
                            icon={QrCode}
                            onClick={() => {
                              setActiveBookingForQr(b);
                              setQrModal(true);
                            }}
                          >
                            QR Check-in
                          </Button>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setRescheduleBookingId(b._id);
                              setRescheduleDate(new Date(b.startTime).toISOString().split('T')[0]);
                              setRescheduleTime(new Date(b.startTime).toTimeString().slice(0, 5));
                              setRescheduleDuration(b.durationMinutes || 45);
                              setRescheduleModal(true);
                            }}
                          >
                            Reschedule
                          </Button>

                          <Button
                            variant="brand"
                            size="sm"
                            loading={actionLoadingId === b._id}
                            onClick={() => handleCheckInBooking(b._id)}
                          >
                            Check In
                          </Button>

                          <Button
                            variant="danger"
                            size="sm"
                            loading={actionLoadingId === b._id}
                            onClick={() => handleCancelBooking(b._id)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </Card>
                    ))
                  )
                )}

                {activeTab === 'ongoing' && (
                  ongoingList.length === 0 ? (
                    <EmptyState
                      icon={Zap}
                      title="No ongoing sessions"
                      description="You don't have an active charging session right now."
                      ctaLabel="Find a station"
                      onCtaClick={() => navigate('/driver/explore')}
                    />
                  ) : (
                    ongoingList.map((b) => (
                      <Card key={b._id} className="border-[#22C55E]/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-ping" />
                            <span className="text-xs font-bold text-[#22C55E] uppercase">Charging Active</span>
                          </div>
                          <h3 className="font-headline font-bold text-xl text-white">{b.station?.name}</h3>
                          <p className="text-xs text-[#cbc4d2]">Bay {b.slot?.slotId} • {b.durationMinutes} Mins Session</p>
                        </div>

                        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                          <div>
                            <span className="text-[10px] text-[#948e9c] uppercase block">Estimated Cost</span>
                            <span className="font-bold text-sm text-white">₹{b.estimatedCost}</span>
                          </div>
                          <Link to="/driver/session/active">
                            <Button variant="primary" size="sm" icon={ArrowRight} iconPosition="right">
                              View Live Session
                            </Button>
                          </Link>
                        </div>
                      </Card>
                    ))
                  )
                )}

                {activeTab === 'completed' && (
                  completedList.length === 0 ? (
                    <EmptyState
                      icon={CheckCircle2}
                      title="No completed sessions"
                      description="Past charging sessions and downloadable tax invoices will appear here."
                    />
                  ) : (
                    completedList.map((b) => (
                      <Card key={b._id} className="flex items-center justify-between text-xs">
                        <div>
                          <h4 className="font-headline font-bold text-base text-white">{b.station?.name}</h4>
                          <p className="text-[#948e9c]">
                            Bay {b.slot?.slotId} • Completed on {new Date(b.updatedAt || b.endTime).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <span className="font-bold text-white block">₹{b.actualCost || b.estimatedCost}</span>
                            <span className="text-[#22C55E] font-semibold">+100 Green Points</span>
                          </div>
                        </div>
                      </Card>
                    ))
                  )
                )}

                {activeTab === 'cancelled' && (
                  cancelledList.length === 0 ? (
                    <EmptyState
                      icon={XCircle}
                      title="No cancelled bookings"
                      description="No cancelled slots recorded."
                    />
                  ) : (
                    cancelledList.map((b) => (
                      <Card key={b._id} className="opacity-70 flex items-center justify-between text-xs">
                        <div>
                          <h4 className="font-headline font-bold text-base text-white">{b.station?.name}</h4>
                          <p className="text-[#ffb4ab]">Cancelled • Bay {b.slot?.slotId}</p>
                        </div>
                        <span className="text-[#cbc4d2] font-medium">Refunded ₹{b.estimatedCost}</span>
                      </Card>
                    ))
                  )
                )}
              </>
            )}
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
                <span className="block text-[10px] font-mono font-bold text-slate-800 mt-1">
                  ID: {activeBookingForQr?._id || 'BKG-8821'}
                </span>
              </div>
              <p className="text-xs text-[#cbc4d2]">
                Scan at Bay {activeBookingForQr?.slot?.slotId || 'A1'} dispenser to authorize charging session.
              </p>
            </div>
          </div>
        )}

        {/* Reschedule Modal */}
        {rescheduleModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
            <div className="bg-[#1d1b20] border border-[#494551] rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
              <div className="flex justify-between items-center border-b border-[#494551]/40 pb-3">
                <h3 className="font-headline font-bold text-lg text-white">Reschedule Reservation</h3>
                <button onClick={() => setRescheduleModal(false)} className="p-1 text-[#948e9c] hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleRescheduleBooking} className="space-y-4 text-left">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase text-[#cbc4d2]">New Date</label>
                  <input
                    type="date"
                    value={rescheduleDate}
                    onChange={(e) => setRescheduleDate(e.target.value)}
                    className="w-full rounded-xl bg-[#141218] border border-[#494551] text-white text-xs px-4 py-3 focus:outline-none focus:border-[#36D8FF]"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase text-[#cbc4d2]">New Start Time</label>
                  <input
                    type="time"
                    value={rescheduleTime}
                    onChange={(e) => setRescheduleTime(e.target.value)}
                    className="w-full rounded-xl bg-[#141218] border border-[#494551] text-white text-xs px-4 py-3 focus:outline-none focus:border-[#36D8FF]"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase text-[#cbc4d2]">Duration (Minutes)</label>
                  <select
                    value={rescheduleDuration}
                    onChange={(e) => setRescheduleDuration(Number(e.target.value))}
                    className="w-full rounded-xl bg-[#141218] border border-[#494551] text-white text-xs px-4 py-3 focus:outline-none focus:border-[#36D8FF]"
                  >
                    <option value={30}>30 Minutes</option>
                    <option value={45}>45 Minutes</option>
                    <option value={60}>60 Minutes</option>
                    <option value={90}>90 Minutes</option>
                  </select>
                </div>

                <Button type="submit" variant="brand" fullWidth loading={rescheduleSubmitting}>
                  Confirm Reschedule
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
