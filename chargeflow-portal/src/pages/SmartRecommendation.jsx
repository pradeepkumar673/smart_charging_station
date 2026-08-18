import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import EnergyBadge from '../components/ui/EnergyBadge';
import { Sparkles, ArrowRight, CheckCircle2, MapPin, Zap, Clock, ShieldCheck } from 'lucide-react';

export default function SmartRecommendation() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#141218] text-[#e6e0e9] flex flex-col justify-between">
      <Navbar />

      <div className="flex-1 flex items-center justify-center p-4 py-12 relative">
        {/* Glow background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[#36D8FF]/15 rounded-full blur-[140px] pointer-events-none -z-10" />

        <div className="w-full max-w-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-2">
              <div className="p-3 rounded-2xl bg-[#36D8FF]/20 border border-[#36D8FF]/40 text-[#36D8FF]">
                <Sparkles className="w-8 h-8 animate-pulse" />
              </div>
            </div>
            <h2 className="font-headline text-3xl font-extrabold text-white">A Smarter Charging Option Nearby</h2>
            <p className="text-sm text-[#cbc4d2]">
              Your current destination is experiencing peak demand. We found a faster, greener alternative.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Current Choice */}
            <Card className="border-[#494551] opacity-80">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#ffb4ab] mb-2">
                Current Choice (Busy)
              </div>
              <h3 className="font-headline font-bold text-lg text-white">Indiranagar Hub</h3>
              <p className="text-xs text-[#948e9c]">100 Feet Road, Indiranagar</p>

              <div className="space-y-2 mt-4 pt-3 border-t border-[#494551]/40 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#948e9c]">Expected Wait</span>
                  <span className="font-bold text-[#ffb4ab]">~25 Minutes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#948e9c]">Energy Rate</span>
                  <span className="font-semibold text-white">₹16 / kWh</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#948e9c]">Renewable Mix</span>
                  <span className="text-[#cbc4d2]">72% Solar</span>
                </div>
              </div>
            </Card>

            {/* Recommended Choice */}
            <Card glow className="border-[#36D8FF] ring-2 ring-[#36D8FF]/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#22C55E] bg-[#22C55E]/15 px-2 py-0.5 rounded-full">
                  AI Recommended
                </span>
                <span className="text-xs font-extrabold text-[#e7c365]">+150 Points</span>
              </div>
              <h3 className="font-headline font-bold text-lg text-white">ChargeFlow Hub - MG Road</h3>
              <p className="text-xs text-[#948e9c]">2.4 km away (8 min drive)</p>

              <div className="space-y-2 mt-4 pt-3 border-t border-[#494551]/40 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#948e9c]">Available Bays</span>
                  <span className="font-bold text-[#22C55E]">4 Bays Free (0 Wait)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#948e9c]">Energy Rate</span>
                  <span className="font-bold text-[#22C55E]">₹14 / kWh (Cheaper)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#948e9c]">Renewable Mix</span>
                  <EnergyBadge renewablePercent={92} />
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-3 pt-2">
            <Button
              variant="brand"
              fullWidth
              size="lg"
              icon={ArrowRight}
              iconPosition="right"
              onClick={() => navigate('/driver/station/stn-01/book')}
            >
              Switch to MG Road Hub & Earn +150 Points
            </Button>
            <Button variant="ghost" fullWidth onClick={() => navigate('/driver/dashboard')}>
              Keep My Current Station
            </Button>
            <p className="text-center text-xs text-[#948e9c]">The choice is always yours. No cancellation penalty applies.</p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
