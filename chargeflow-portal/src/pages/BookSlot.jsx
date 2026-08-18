import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import DriverSidebar from '../components/layout/DriverSidebar';
import DriverHeader from '../components/layout/DriverHeader';
import Footer from '../components/layout/Footer';
import Stepper from '../components/ui/Stepper';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import EnergyBadge from '../components/ui/EnergyBadge';
import { ArrowLeft, ArrowRight, Zap, Clock, Calendar, ShieldCheck, CheckCircle2, QrCode, CreditCard, Sparkles } from 'lucide-react';

export default function BookSlot() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [confirmedModal, setConfirmedModal] = useState(false);

  // Form State
  const [selectedBay, setSelectedBay] = useState('A2');
  const [selectedDate, setSelectedDate] = useState('2026-08-18');
  const [selectedTime, setSelectedTime] = useState('19:30');
  const [duration, setDuration] = useState('45 min');
  const [paymentMethod, setPaymentMethod] = useState('wallet');

  const steps = [
    { title: 'Select Charger', subtitle: 'Choose bay & power' },
    { title: 'Schedule', subtitle: 'Date & time slot' },
    { title: 'Cost & Energy', subtitle: 'Price breakdown' },
    { title: 'Confirmation', subtitle: 'Review & reserve' },
  ];

  const timeSlots = ['18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30'];

  const handleNext = (e) => {
    e.preventDefault();
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      setConfirmedModal(true);
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
            <Link to={`/driver/station/${id || 'stn-01'}`} className="p-2 rounded-xl bg-[#211f24] text-[#cbc4d2] hover:text-white border border-[#494551]/60">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="font-headline font-extrabold text-2xl text-white">Reserve Charging Bay</h1>
              <p className="text-xs text-[#948e9c]">ChargeFlow Hub - MG Road • ISO 15118 Plug & Charge</p>
            </div>
          </div>

          <Card glow>
            <Stepper steps={steps} currentStep={currentStep} onStepClick={(s) => setCurrentStep(s)} />

            <form onSubmit={handleNext} className="space-y-6 pt-2">
              {/* STEP 1: Select Charger Bay */}
              {currentStep === 1 && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#cbc4d2] uppercase tracking-wider">Available Bays</span>
                    <span className="text-xs text-[#22C55E]">4 Bays Free Now</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { id: 'A2', name: 'Bay A2', type: '150 kW DC Ultra-Fast', connector: 'CCS2', price: '₹14/kWh', recommended: true },
                      { id: 'A4', name: 'Bay A4', type: '150 kW DC Ultra-Fast', connector: 'CCS2', price: '₹14/kWh' },
                      { id: 'B2', name: 'Bay B2', type: '350 kW NACS Fast', connector: 'NACS', price: '₹16/kWh' },
                      { id: 'B4', name: 'Bay B4', type: '22 kW AC Type 2', connector: 'Type 2', price: '₹12/kWh' },
                    ].map((bay) => (
                      <div
                        key={bay.id}
                        onClick={() => setSelectedBay(bay.id)}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 relative ${
                          selectedBay === bay.id
                            ? 'border-[#36D8FF] bg-[#36D8FF]/15 ring-2 ring-[#36D8FF]/30'
                            : 'border-[#494551] bg-[#1d1b20] hover:border-[#cfbcff]/50'
                        }`}
                      >
                        {bay.recommended && (
                          <span className="absolute top-2 right-2 bg-[#22C55E] text-slate-950 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                            AI Best Match
                          </span>
                        )}
                        <div className="font-headline font-extrabold text-white text-lg">{bay.name}</div>
                        <div className="text-xs text-[#cbc4d2] mt-0.5">{bay.type}</div>
                        <div className="flex items-center justify-between mt-3 text-xs">
                          <span className="text-[#36D8FF] font-semibold">{bay.connector}</span>
                          <span className="text-[#22C55E] font-bold">{bay.price}</span>
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
                      <label className="block text-xs font-semibold uppercase text-[#cbc4d2]">Target Duration</label>
                      <select
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        className="w-full rounded-xl bg-[#1d1b20] border border-[#494551] text-white text-sm px-4 py-3 focus:outline-none focus:border-[#36D8FF]"
                      >
                        <option value="30 min">30 Minutes (Rapid 50% SoC)</option>
                        <option value="45 min">45 Minutes (Full Charge ~80%)</option>
                        <option value="60 min">1 Hour (Complete 100%)</option>
                        <option value="90 min">1.5 Hours</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-semibold uppercase text-[#cbc4d2]">Select Time Slot (Today)</label>
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
                  <div className="bg-[#1d1b20] border border-[#494551]/60 rounded-2xl p-5 space-y-3">
                    <h3 className="font-headline font-bold text-base text-white border-b border-[#494551]/40 pb-2">
                      Estimated Energy & Cost Summary
                    </h3>

                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between text-[#cbc4d2]">
                        <span>Estimated Energy Delivered (45 min @ 70kW avg)</span>
                        <span className="font-bold text-white">52.5 kWh</span>
                      </div>
                      <div className="flex justify-between text-[#cbc4d2]">
                        <span>Base Rate (Bay {selectedBay} @ ₹14/kWh)</span>
                        <span className="font-semibold text-white">₹735.00</span>
                      </div>
                      <div className="flex justify-between text-[#cbc4d2]">
                        <span>Autonomous Reservation Deposit</span>
                        <span className="font-semibold text-white">₹25.00</span>
                      </div>
                      <div className="flex justify-between text-[#22C55E]">
                        <span>Green Points Reward</span>
                        <span className="font-bold">+140 Points</span>
                      </div>
                      <div className="flex justify-between text-sm font-extrabold text-white pt-2 border-t border-[#494551]/40">
                        <span>Total Estimated Cost</span>
                        <span className="text-[#36D8FF] text-lg">₹760.00</span>
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
                        { id: 'wallet', name: 'ChargeFlow Wallet', desc: 'Balance: ₹2,450.00' },
                        { id: 'upi', name: 'Instant UPI', desc: 'GPay / PhonePe / Paytm' },
                        { id: 'card', name: 'Saved Card', desc: 'Visa ending 4821' },
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

                <Button type="submit" variant="brand" size="lg" icon={ArrowRight} iconPosition="right">
                  {currentStep === 4 ? 'Confirm & Reserve Slot' : 'Continue'}
                </Button>
              </div>
            </form>
          </Card>
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
                Your charger at <strong className="text-white">ChargeFlow Hub - MG Road (Bay {selectedBay})</strong> is locked for <span className="text-[#36D8FF] font-semibold">{selectedTime}</span>.
              </p>

              {/* QR Code Preview */}
              <div className="bg-white p-4 rounded-2xl inline-block shadow-inner mx-auto">
                <QrCode className="w-32 h-32 text-slate-950" />
                <span className="block text-[10px] font-mono font-bold text-slate-700 mt-1">BKG-8821-AUTONOMOUS</span>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <Button
                  variant="brand"
                  fullWidth
                  size="lg"
                  onClick={() => navigate('/driver/navigation/bkg-8821')}
                >
                  Start Route Navigation
                </Button>
                <Button variant="secondary" fullWidth onClick={() => navigate('/driver/dashboard')}>
                  Return to Dashboard
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
