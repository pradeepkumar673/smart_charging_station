import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import useToast from '../hooks/useToast';
import DriverSidebar from '../components/layout/DriverSidebar';
import DriverHeader from '../components/layout/DriverHeader';
import Footer from '../components/layout/Footer';
import Stepper from '../components/ui/Stepper';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Skeleton from '../components/ui/Skeleton';
import { ArrowLeft, ArrowRight, CheckCircle2, QrCode } from 'lucide-react';
import api from '../services/api';

export default function BookSlot() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [confirmedModal, setConfirmedModal] = useState(false);
  const [createdBooking, setCreatedBooking] = useState(null);

  const [station, setStation] = useState(null);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [selectedSlotId, setSelectedSlotId] = useState('');
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState('19:30');
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [estimatedEnergyKWh, setEstimatedEnergyKWh] = useState(25);
  const [paymentMethod, setPaymentMethod] = useState('wallet');

  useEffect(() => {
    async function loadStationAndSlots() {
      setLoading(true);
      try {
        const response = await api.get(`/stations/${id}`);
        const { station: stn, slots: slotList } = response.data?.data || {};
        setStation(stn);
        setSlots(slotList || []);
        if (slotList && slotList.length > 0) {
          const avail = slotList.find((s) => s.status === 'available') || slotList[0];
          setSelectedSlotId(avail._id);
        }
      } catch (err) {
        console.error('Failed to load station for booking:', err);
        showToast({
          title: 'Error Loading Station',
          message: 'Could not load charger bays.',
          type: 'error',
        });
      } finally {
        setLoading(false);
      }
    }
    if (id) {
      loadStationAndSlots();
    }
  }, [id, showToast]);

  const steps = [
    { title: 'Select Charger', subtitle: 'Choose bay & power' },
    { title: 'Schedule', subtitle: 'Date & time slot' },
    { title: 'Cost & Energy', subtitle: 'Price breakdown' },
    { title: 'Confirmation', subtitle: 'Review & reserve' },
  ];

  const timeSlots = ['18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30'];

  const selectedSlot = slots.find((s) => s._id === selectedSlotId);
  const baseRate = station?.basePricePerKWh || 14.5;
  const estimatedCost = Math.round(estimatedEnergyKWh * baseRate * 100) / 100;

  const handleNext = async (e) => {
    e.preventDefault();
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
      return;
    }

    if (!selectedSlotId) {
      showToast({ title: 'Select Slot', message: 'Please choose a charging bay.', type: 'error' });
      return;
    }

    setSubmitting(true);

    try {
      const [hours, mins] = selectedTime.split(':');
      const startTimeObj = new Date(selectedDate);
      startTimeObj.setHours(Number(hours) || 19, Number(mins) || 30, 0, 0);

      const payload = {
        stationId: station._id,
        slotId: selectedSlotId,
        startTime: startTimeObj.toISOString(),
        durationMinutes: Number(durationMinutes) || 45,
        estimatedEnergyKWh: Number(estimatedEnergyKWh) || 25,
      };

      const response = await api.post('/bookings', payload);
      const bookingData = response.data?.data?.booking;
      setCreatedBooking(bookingData);
      setConfirmedModal(true);
      showToast({
        title: 'Booking Confirmed!',
        message: 'Your slot has been reserved.',
        type: 'success',
      });
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || 'Failed to create booking.';
      showToast({
        title: 'Booking Error',
        message: errMsg,
        type: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-[#141218] text-[#e6e0e9] flex">
      <DriverSidebar mobileOpen={mobileSidebarOpen} setMobileOpen={setMobileSidebarOpen} />

      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        <DriverHeader setMobileSidebarOpen={setMobileSidebarOpen} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 max-w-5xl mx-auto w-full">
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-[#494551]/40 pb-4">
            <Link to={`/driver/station/${id}`} className="p-2 rounded-xl bg-[#211f24] text-[#cbc4d2] hover:text-white border border-[#494551]/60">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="font-headline font-extrabold text-2xl text-white">Reserve Charging Bay</h1>
              <p className="text-xs text-[#948e9c]">
                {station ? `${station.name} • ${station.address}` : 'Loading station info...'}
              </p>
            </div>
          </div>

          {loading ? (
            <Skeleton className="w-full h-96 rounded-2xl" />
          ) : (
            <Card glow>
              <Stepper steps={steps} currentStep={currentStep} onStepClick={(s) => setCurrentStep(s)} />

              <form onSubmit={handleNext} className="space-y-6 pt-2">
                {/* STEP 1: Select Charger Bay */}
                {currentStep === 1 && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#cbc4d2] uppercase tracking-wider">Available Bays</span>
                      <span className="text-xs text-[#22C55E]">
                        {slots.filter((s) => s.status === 'available').length} Bays Free Now
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {slots.map((bay, idx) => (
                        <div
                          key={bay._id}
                          onClick={() => setSelectedSlotId(bay._id)}
                          className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 relative ${
                            selectedSlotId === bay._id
                              ? 'border-[#36D8FF] bg-[#36D8FF]/15 ring-2 ring-[#36D8FF]/30'
                              : 'border-[#494551] bg-[#1d1b20] hover:border-[#cfbcff]/50'
                          }`}
                        >
                          {idx === 0 && (
                            <span className="absolute top-2 right-2 bg-[#22C55E] text-slate-950 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                              AI Best Match
                            </span>
                          )}
                          <div className="font-headline font-extrabold text-white text-lg">Bay {bay.slotId}</div>
                          <div className="text-xs text-[#cbc4d2] mt-0.5">
                            {bay.maxPowerKw} kW {bay.chargerType} Fast Charger
                          </div>
                          <div className="flex items-center justify-between mt-3 text-xs">
                            <span className="text-[#36D8FF] font-semibold">{bay.connectorType}</span>
                            <span className="text-[#22C55E] font-bold">₹{baseRate}/kWh</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 2: Date & Time Schedule */}
                {currentStep === 2 && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="block text-xs font-semibold uppercase text-[#cbc4d2]">Reservation Date</label>
                        <input
                          type="date"
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          className="w-full rounded-xl bg-[#1d1b20] border border-[#494551] text-white text-sm px-4 py-3 focus:outline-none focus:border-[#36D8FF]"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-xs font-semibold uppercase text-[#cbc4d2]">Target Duration (Minutes)</label>
                        <select
                          value={durationMinutes}
                          onChange={(e) => setDurationMinutes(Number(e.target.value))}
                          className="w-full rounded-xl bg-[#1d1b20] border border-[#494551] text-white text-sm px-4 py-3 focus:outline-none focus:border-[#36D8FF]"
                        >
                          <option value={30}>30 Minutes (Rapid Charge)</option>
                          <option value={45}>45 Minutes (Full Charge ~80%)</option>
                          <option value={60}>60 Minutes (1 Hour Complete)</option>
                          <option value={90}>90 Minutes (1.5 Hours)</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs font-semibold uppercase text-[#cbc4d2]">Select Start Time Slot</label>
                      <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                        {timeSlots.map((time) => (
                          <button
                            key={time}
                            type="button"
                            onClick={() => setSelectedTime(time)}
                            className={`py-2.5 rounded-xl border text-xs font-bold transition-all ${
                              selectedTime === time
                                ? 'border-[#36D8FF] bg-[#36D8FF] text-slate-950 shadow-md'
                                : 'border-[#494551] bg-[#1d1b20] text-[#cbc4d2] hover:text-white'
                            }`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 3: Cost & Energy Preview */}
                {currentStep === 3 && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold uppercase text-[#cbc4d2]">
                        Estimated Energy Needed (kWh)
                      </label>
                      <input
                        type="number"
                        value={estimatedEnergyKWh}
                        onChange={(e) => setEstimatedEnergyKWh(Number(e.target.value))}
                        className="w-full rounded-xl bg-[#1d1b20] border border-[#494551] text-white text-sm px-4 py-3 focus:outline-none focus:border-[#36D8FF]"
                      />
                    </div>

                    <div className="bg-[#1d1b20] border border-[#494551]/60 rounded-2xl p-5 space-y-3">
                      <h3 className="font-headline font-bold text-base text-white border-b border-[#494551]/40 pb-2">
                        Estimated Energy & Cost Summary
                      </h3>

                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between text-[#cbc4d2]">
                          <span>Estimated Energy Delivered</span>
                          <span className="font-bold text-white">{estimatedEnergyKWh} kWh</span>
                        </div>
                        <div className="flex justify-between text-[#cbc4d2]">
                          <span>Base Rate (Bay {selectedSlot?.slotId || 'A1'} @ ₹{baseRate}/kWh)</span>
                          <span className="font-semibold text-white">₹{estimatedCost}</span>
                        </div>
                        <div className="flex justify-between text-[#22C55E]">
                          <span>Green Points Reward</span>
                          <span className="font-bold">+100 Points</span>
                        </div>
                        <div className="flex justify-between text-sm font-extrabold text-white pt-2 border-t border-[#494551]/40">
                          <span>Total Estimated Cost</span>
                          <span className="text-[#36D8FF] text-lg">₹{estimatedCost}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 4: Review & Payment Selection */}
                {currentStep === 4 && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="space-y-2">
                      <label className="block text-xs font-semibold uppercase text-[#cbc4d2]">Select Payment Method</label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {[
                          { id: 'wallet', name: 'ChargeFlow Wallet', desc: 'Auto Pay Active' },
                          { id: 'upi', name: 'Instant UPI', desc: 'GPay / PhonePe' },
                          { id: 'card', name: 'Saved Credit Card', desc: 'Visa / Mastercard' },
                        ].map((m) => (
                          <div
                            key={m.id}
                            onClick={() => setPaymentMethod(m.id)}
                            className={`p-3.5 rounded-xl border cursor-pointer ${
                              paymentMethod === m.id
                                ? 'border-[#36D8FF] bg-[#36D8FF]/15 text-white'
                                : 'border-[#494551] bg-[#1d1b20] text-[#cbc4d2]'
                            }`}
                          >
                            <div className="font-bold text-sm">{m.name}</div>
                            <div className="text-[10px] text-[#948e9c] mt-0.5">{m.desc}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between pt-4 gap-3">
                  {currentStep > 1 ? (
                    <Button type="button" variant="secondary" onClick={handleBack}>
                      Back
                    </Button>
                  ) : <div />}

                  <Button
                    type="submit"
                    variant="brand"
                    size="lg"
                    loading={submitting}
                    icon={ArrowRight}
                    iconPosition="right"
                  >
                    {currentStep === 4 ? 'Confirm & Reserve Slot' : 'Continue'}
                  </Button>
                </div>
              </form>
            </Card>
          )}
        </main>

        {/* Confirmation Modal */}
        {confirmedModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
            <div className="bg-[#1d1b20] border border-[#36D8FF]/60 rounded-3xl p-6 sm:p-8 max-w-md w-full text-center space-y-5 shadow-2xl">
              <div className="flex justify-center">
                <CheckCircle2 className="w-16 h-16 text-[#22C55E] animate-bounce" />
              </div>

              <h3 className="font-headline font-extrabold text-2xl text-white">
                Charging Bay Reserved!
              </h3>

              <p className="text-xs text-[#cbc4d2]">
                Your charger at <strong className="text-white">{station?.name} (Bay {selectedSlot?.slotId})</strong> is locked for <span className="text-[#36D8FF] font-semibold">{selectedTime}</span>.
              </p>

              {/* QR Code Preview */}
              <div className="bg-white p-4 rounded-2xl inline-block shadow-inner mx-auto">
                <QrCode className="w-32 h-32 text-slate-950" />
                <span className="block text-[10px] font-mono font-bold text-slate-700 mt-1">
                  ID: {createdBooking?._id || 'BKG-RESERVED'}
                </span>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <Button
                  variant="brand"
                  fullWidth
                  size="lg"
                  onClick={() => navigate(`/driver/navigation/${createdBooking?._id || ''}`)}
                >
                  Start Route Navigation
                </Button>
                <Button variant="secondary" fullWidth onClick={() => navigate('/driver/bookings')}>
                  View My Bookings
                </Button>
              </div>
            </div>
          </div>
        )}

        <Footer />
      </div>
    </div>
  );
}
