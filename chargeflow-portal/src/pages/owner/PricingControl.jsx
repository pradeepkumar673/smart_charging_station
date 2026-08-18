import React, { useState } from 'react';
import OwnerSidebar from '../../components/layout/OwnerSidebar';
import OwnerHeader from '../../components/layout/OwnerHeader';
import Footer from '../../components/layout/Footer';
import PricingSchedule from '../../components/owner/PricingSchedule';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { DollarSign, Zap, Sparkles, Clock, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function PricingControl() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [pricingMode, setPricingMode] = useState('dynamic'); // 'fixed' or 'dynamic'
  const [basePrice, setBasePrice] = useState('14.00');
  const [peakPrice, setPeakPrice] = useState('18.00');
  const [savedModal, setSavedModal] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSavedModal(true);
  };

  return (
    <div className="min-h-screen bg-[#141218] text-[#e6e0e9] flex">
      <OwnerSidebar mobileOpen={mobileSidebarOpen} setMobileOpen={setMobileSidebarOpen} />

      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        <OwnerHeader setMobileSidebarOpen={setMobileSidebarOpen} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto w-full">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#494551]/40 pb-4">
            <div>
              <h1 className="font-headline font-extrabold text-2xl sm:text-3xl text-white">Dynamic Pricing & Tariff Control</h1>
              <p className="text-xs text-[#948e9c]">VoltHub Indiranagar • Configure time-of-use rates and peak demand surcharges.</p>
            </div>

            {/* Mode Switcher */}
            <div className="flex items-center bg-[#1d1b20] p-1 rounded-xl border border-[#494551]/60 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setPricingMode('fixed')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  pricingMode === 'fixed' ? 'bg-[#6750a4] text-white shadow' : 'text-[#cbc4d2] hover:text-white'
                }`}
              >
                Fixed Tariff
              </button>
              <button
                type="button"
                onClick={() => setPricingMode('dynamic')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  pricingMode === 'dynamic' ? 'bg-[#2D8CFF] text-slate-950 font-bold shadow' : 'text-[#cbc4d2] hover:text-white'
                }`}
              >
                AI Dynamic Yield
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left 2 Columns: Rate Form & Schedule */}
              <div className="lg:col-span-2 space-y-6">
                <Card glow className="space-y-4">
                  <h3 className="font-headline font-bold text-lg text-white border-b border-[#494551]/40 pb-3">
                    Base Energy Tariff Settings
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Standard Energy Rate (₹/kWh)"
                      type="number"
                      value={basePrice}
                      onChange={(e) => setBasePrice(e.target.value)}
                      required
                    />
                    <Input
                      label="Peak Hour Rate (₹/kWh)"
                      type="number"
                      value={peakPrice}
                      onChange={(e) => setPeakPrice(e.target.value)}
                      required
                    />
                    <Input label="Reservation Deposit (₹)" type="number" defaultValue="25.00" />
                    <Input label="Idle Overstay Fee (₹/min)" type="number" defaultValue="5.00" />
                  </div>
                </Card>

                {/* Schedule Visualizer */}
                <PricingSchedule />
              </div>

              {/* Right Column: AI Yield Tip & Driver Preview */}
              <div className="space-y-6">
                {/* AI Recommendation */}
                <div className="bg-gradient-to-r from-[#2D8CFF]/20 to-[#22C55E]/15 border border-[#36D8FF]/40 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#36D8FF]">
                    <Sparkles className="w-4 h-4 text-[#e7c365]" />
                    <span>AI Yield Optimization Engine</span>
                  </div>
                  <p className="text-xs text-[#cbc4d2] leading-relaxed">
                    Demand forecast predicts peak evening volume between 6 PM and 9 PM today. Raising peak tariff to ₹18/kWh increases daily revenue by +12.4%.
                  </p>
                </div>

                {/* Driver App Preview Panel */}
                <Card className="space-y-3 text-xs">
                  <h4 className="font-headline font-bold text-white border-b border-[#494551]/40 pb-2">
                    Customer App Preview
                  </h4>
                  <div className="bg-[#141218] p-3 rounded-xl border border-[#494551]/60 space-y-1.5">
                    <span className="text-[10px] text-[#948e9c]">Driver Sees Rate</span>
                    <div className="font-extrabold text-lg text-[#22C55E]">₹{basePrice} / kWh</div>
                    <span className="text-[10px] text-[#36D8FF] block">Includes ISO 15118 automated Plug & Charge</span>
                  </div>
                </Card>

                <Button type="submit" variant="brand" fullWidth size="lg">
                  Publish New Tariff Schedule
                </Button>
              </div>
            </div>
          </form>
        </main>

        {/* Confirmation Modal */}
        {savedModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
            <div className="bg-[#1d1b20] border border-[#36D8FF]/60 rounded-3xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl">
              <div className="flex justify-center">
                <CheckCircle2 className="w-14 h-14 text-[#22C55E] animate-bounce" />
              </div>
              <h3 className="font-headline font-extrabold text-2xl text-white">Tariff Published!</h3>
              <p className="text-xs text-[#cbc4d2]">
                New rates are live across VoltHub Indiranagar and synced with ChargeFlow Driver Navigation.
              </p>
              <Button variant="brand" fullWidth onClick={() => setSavedModal(false)}>
                Close
              </Button>
            </div>
          </div>
        )}

        <Footer />
      </div>
    </div>
  );
}
