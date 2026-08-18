import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import MapPanel from '../components/driver/MapPanel';
import { Zap, Clock, MapPin, ArrowRight, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ClaimSlot() {
  const navigate = useNavigate();
  const [claimedModal, setClaimedModal] = useState(false);

  return (
    <div className="min-h-screen bg-[#141218] text-[#e6e0e9] flex flex-col justify-between">
      <Navbar />

      <div className="flex-1 flex items-center justify-center p-4 py-12 relative">
        {/* Amber Glow background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#e7c365]/15 rounded-full blur-[110px] pointer-events-none -z-10" />

        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-2">
              <div className="p-3 rounded-2xl bg-[#e7c365]/20 border border-[#e7c365]/40 text-[#e7c365]">
                <Zap className="w-8 h-8 animate-bounce" />
              </div>
            </div>
            <h2 className="font-headline text-3xl font-extrabold text-white">No-Show Slot Recovery</h2>
            <p className="text-sm text-[#cbc4d2]">
              A reserved 150 kW DC Fast charger just opened up due to a driver cancellation.
            </p>
          </div>

          <Card glow className="border-[#e7c365]/40 text-center space-y-4">
            {/* Countdown Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#e7c365]/15 border border-[#e7c365]/30 text-[#e7c365] text-xs font-extrabold">
              <Clock className="w-4 h-4 animate-spin-slow" />
              <span>Claim within 07m 42s</span>
            </div>

            <div className="space-y-1 text-left pt-2">
              <div className="flex items-center justify-between">
                <h3 className="font-headline font-bold text-xl text-white">ChargeFlow Hub - MG Road</h3>
                <span className="text-xs font-bold text-[#22C55E]">Bay A2 (150kW)</span>
              </div>
              <p className="text-xs text-[#948e9c]">MG Road Metro Complex • 2.4 km away (8 min drive)</p>
            </div>

            {/* Mini Map Snippet */}
            <div className="h-36 rounded-xl overflow-hidden border border-[#494551]/60 relative">
              <MapPanel />
            </div>

            <div className="flex items-center justify-between text-xs pt-2 border-t border-[#494551]/40">
              <span className="text-[#cbc4d2]">Standard Rate</span>
              <span className="font-bold text-[#22C55E]">₹14 / kWh (+100 Green Points)</span>
            </div>

            <div className="space-y-2 pt-2">
              <Button
                variant="brand"
                fullWidth
                size="lg"
                icon={ArrowRight}
                iconPosition="right"
                onClick={() => setClaimedModal(true)}
              >
                Claim Bay A2 Now
              </Button>
              <Button variant="ghost" fullWidth onClick={() => navigate('/driver/dashboard')}>
                Pass on Slot
              </Button>
            </div>
          </Card>

          {/* Claim Confirmation Modal */}
          {claimedModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
              <div className="bg-[#1d1b20] border border-[#22C55E]/60 rounded-3xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl">
                <div className="flex justify-center">
                  <CheckCircle2 className="w-14 h-14 text-[#22C55E] animate-bounce" />
                </div>
                <h3 className="font-headline font-extrabold text-2xl text-white">Slot Claimed!</h3>
                <p className="text-xs text-[#cbc4d2]">
                  Bay A2 at MG Road Hub is locked for your vehicle for 15 minutes check-in window.
                </p>
                <Button
                  variant="brand"
                  fullWidth
                  onClick={() => navigate('/driver/navigation/bkg-claim-99')}
                >
                  Start Route Navigation
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
