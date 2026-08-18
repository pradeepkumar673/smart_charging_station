import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import DriverSidebar from '../components/layout/DriverSidebar';
import DriverHeader from '../components/layout/DriverHeader';
import MapPanel from '../components/driver/MapPanel';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { ArrowLeft, Navigation, MapPin, BatteryCharging, ExternalLink, CornerUpRight, MoveRight, CheckCircle2 } from 'lucide-react';
import api from '../services/api';
import useToast from '../hooks/useToast';

export default function RouteNavigation() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [submittingCheckIn, setSubmittingCheckIn] = useState(false);
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    async function loadBooking() {
      if (!bookingId) return;
      try {
        const response = await api.get('/bookings/my');
        const list = response.data?.data?.bookings || [];
        const found = list.find((b) => b._id === bookingId);
        if (found) {
          setBooking(found);
        }
      } catch (err) {
        console.error('Failed to load booking for navigation:', err);
      }
    }
    loadBooking();
  }, [bookingId]);

  const handleCheckInNow = async () => {
    setSubmittingCheckIn(true);
    try {
      if (bookingId) {
        await api.post(`/bookings/${bookingId}/checkin`);
      }
      showToast({
        title: 'Checked In Successfully!',
        message: 'Charging session initialized. Connecting vehicle telemetry...',
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
      setSubmittingCheckIn(false);
    }
  };

  const directions = [
    { text: 'Head north on 100 Feet Road toward Indiranagar Metro', dist: '400 m', icon: MoveRight },
    { text: 'Turn right onto MG Road Flyover', dist: '1.2 km', icon: CornerUpRight },
    { text: 'Keep left at the fork toward Metro Station Complex', dist: '600 m', icon: MoveRight },
    { text: 'Turn left into ChargeFlow Autonomous Station Hub', dist: '200 m', icon: MapPin },
  ];

  return (
    <div className="min-h-screen bg-[#141218] text-[#e6e0e9] flex">
      <DriverSidebar mobileOpen={mobileSidebarOpen} setMobileOpen={setMobileSidebarOpen} />

      <div className="flex-1 flex flex-col lg:pl-64 min-w-0 h-screen overflow-hidden">
        <DriverHeader setMobileSidebarOpen={setMobileSidebarOpen} />

        <div className="flex-1 relative overflow-hidden flex flex-col lg:flex-row p-4 gap-4">
          {/* Map Overlay Panel */}
          <div className="flex-1 relative rounded-2xl overflow-hidden min-h-[350px]">
            <MapPanel
              showRoute={true}
              origin="Indiranagar, Bengaluru"
              destination={booking?.station?.name || 'ChargeFlow Station Hub'}
            />

            {/* Top Floating Origin & Destination bar */}
            <div className="absolute top-4 left-4 right-4 max-w-md mx-auto bg-[#141218]/90 backdrop-blur-md border border-[#494551]/60 px-4 py-3 rounded-2xl flex items-center justify-between text-xs shadow-xl z-20">
              <div className="flex items-center gap-2">
                <Link to="/driver/bookings" className="p-1.5 rounded-lg bg-[#211f24] text-[#cbc4d2]">
                  <ArrowLeft className="w-4 h-4" />
                </Link>
                <div>
                  <div className="font-bold text-white">Route to Bay {booking?.slot?.slotId || 'A1'}</div>
                  <div className="text-[10px] text-[#948e9c]">
                    {booking?.station?.name || ''} • ID #{bookingId ? bookingId.slice(-6) : ''}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-[#22C55E] bg-[#22C55E]/15 px-2.5 py-1 rounded-full font-semibold">
                <BatteryCharging className="w-3.5 h-3.5" />
                <span>78% SoC</span>
              </div>
            </div>
          </div>

          {/* Right Floating Details & Directions Panel */}
          <div className="w-full lg:w-96 space-y-4 overflow-y-auto shrink-0">
            {/* Navigation Status Card */}
            <Card glow className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#948e9c] uppercase tracking-wider font-semibold">Estimated Arrival</span>
                  <div className="font-headline font-extrabold text-3xl text-[#36D8FF]">8 mins</div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-[#948e9c] uppercase tracking-wider font-semibold">Distance</span>
                  <div className="font-headline font-bold text-xl text-white">2.4 km</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#211f24] border border-[#494551]/60 flex items-center justify-between text-xs">
                <span className="text-[#cbc4d2]">Check-in Window</span>
                <span className="font-bold text-[#22C55E]">Open Now (10m grace)</span>
              </div>

              {/* Launcher Buttons */}
              <div className="space-y-2 pt-2">
                <Button
                  variant="brand"
                  fullWidth
                  size="lg"
                  loading={submittingCheckIn}
                  icon={CheckCircle2}
                  onClick={handleCheckInNow}
                >
                  Arrived & Check In Now
                </Button>

                <Button
                  variant="secondary"
                  fullWidth
                  size="md"
                  icon={Navigation}
                  onClick={() => setIsNavigating(!isNavigating)}
                >
                  {isNavigating ? 'Guidance Active...' : 'Start Navigation'}
                </Button>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <a
                    href="https://maps.google.com"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-[#211f24] border border-[#494551] text-xs font-semibold text-[#cbc4d2] hover:text-white"
                  >
                    <span>Google Maps</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href="https://maps.apple.com"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-[#211f24] border border-[#494551] text-xs font-semibold text-[#cbc4d2] hover:text-white"
                  >
                    <span>Apple Maps</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </Card>

            {/* Directions Preview List */}
            <Card className="space-y-3">
              <h3 className="font-headline font-bold text-sm text-white border-b border-[#494551]/40 pb-2">
                Turn-by-Turn Directions
              </h3>

              <div className="space-y-3 text-xs">
                {directions.map((step, idx) => {
                  const Icon = step.icon;
                  return (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-[#211f24] border border-[#494551] text-[#36D8FF] shrink-0 mt-0.5">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <div className="text-white font-medium">{step.text}</div>
                        <div className="text-[10px] text-[#948e9c]">{step.dist}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
