import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Skeleton from '../components/ui/Skeleton';
import EmptyState from '../components/states/EmptyState';
import MapPanel from '../components/driver/MapPanel';
import { Zap, Clock, ArrowRight, CheckCircle2 } from 'lucide-react';
import api from '../services/api';
import useToast from '../hooks/useToast';

export default function ClaimSlot() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [claimableSlots, setClaimableSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [claimingSlotId, setClaimingSlotId] = useState(null);
  const [claimedBooking, setClaimedBooking] = useState(null);
  const [claimedModal, setClaimedModal] = useState(false);

  useEffect(() => {
    async function loadClaimableSlots() {
      setLoading(true);
      try {
        const response = await api.get('/smart/claimable-slots');
        const list = response.data?.data?.claimableSlots || [];
        setClaimableSlots(list);
      } catch (err) {
        console.error('Failed to fetch claimable slots:', err);
        showToast({
          title: 'Error',
          message: 'Could not load no-show claimable slots.',
          type: 'error',
        });
      } finally {
        setLoading(false);
      }
    }
    loadClaimableSlots();
  }, [showToast]);

  const handleClaim = async (slotId) => {
    setClaimingSlotId(slotId);
    try {
      const response = await api.post('/smart/claim-slot', {
        slotId,
        durationMinutes: 45,
        estimatedEnergyKWh: 20,
      });

      const booking = response.data?.data?.booking;
      setClaimedBooking(booking);
      setClaimedModal(true);
      showToast({
        title: 'No-Show Slot Claimed!',
        message: 'Slot reserved for your check-in.',
        type: 'success',
      });
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || 'Could not claim slot.';
      showToast({
        title: 'Claim Error',
        message: errMsg,
        type: 'error',
      });
    } finally {
      setClaimingSlotId(null);
    }
  };

  const primaryClaimable = claimableSlots.length > 0 ? claimableSlots[0] : null;

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
            <h2 className="font-headline text-3xl font-extrabold text-white">Smart No-Show Recovery</h2>
            <p className="text-sm text-[#cbc4d2]">
              Claim unclaimed charger bays past the 10-minute check-in grace period.
            </p>
          </div>

          {loading ? (
            <Skeleton className="w-full h-80 rounded-2xl" />
          ) : !primaryClaimable ? (
            <Card className="text-center py-8">
              <EmptyState
                icon={Zap}
                title="No Claimable Slots Right Now"
                description="All drivers checked in on time! Check back shortly for newly released no-show slots."
                ctaLabel="Return to Explorer"
                onCtaClick={() => navigate('/driver/explore')}
              />
            </Card>
          ) : (
            <Card glow className="border-[#e7c365]/40 text-center space-y-4">
              {/* Countdown Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#e7c365]/15 border border-[#e7c365]/30 text-[#e7c365] text-xs font-extrabold">
                <Clock className="w-4 h-4 animate-spin-slow" />
                <span>Claim Window: {primaryClaimable.claimWindowMinutesRemaining || 0} mins remaining</span>
              </div>

              <div className="space-y-1 text-left pt-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-headline font-bold text-xl text-white">
                    {primaryClaimable.station?.name || 'ChargeFlow Station'}
                  </h3>
                  <span className="text-xs font-bold text-[#22C55E]">
                    Bay {primaryClaimable.slot?.slotId || 'A1'} ({primaryClaimable.slot?.maxPowerKw || 150}kW)
                  </span>
                </div>
                <p className="text-xs text-[#948e9c]">
                  {primaryClaimable.station?.address || 'Bengaluru'}
                </p>
              </div>

              {/* Mini Map Snippet */}
              <div className="h-36 rounded-xl overflow-hidden border border-[#494551]/60 relative">
                <MapPanel />
              </div>

              <div className="flex items-center justify-between text-xs pt-2 border-t border-[#494551]/40 text-[#cbc4d2]">
                <span>Rate</span>
                <span className="font-bold text-[#22C55E]">
                  ₹{primaryClaimable.station?.basePricePerKWh || 0}/kWh (+100 Green Points)
                </span>
              </div>

              <div className="space-y-2 pt-2">
                <Button
                  variant="brand"
                  fullWidth
                  size="lg"
                  loading={claimingSlotId === primaryClaimable.slot?.id}
                  icon={ArrowRight}
                  iconPosition="right"
                  onClick={() => handleClaim(primaryClaimable.slot?.id)}
                >
                  Claim Bay {primaryClaimable.slot?.slotId} Now
                </Button>

                <Button variant="ghost" fullWidth onClick={() => navigate('/driver/dashboard')}>
                  Pass on Slot
                </Button>
              </div>
            </Card>
          )}

          {/* Claim Confirmation Modal */}
          {claimedModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
              <div className="bg-[#1d1b20] border border-[#22C55E]/60 rounded-3xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl">
                <div className="flex justify-center">
                  <CheckCircle2 className="w-14 h-14 text-[#22C55E] animate-bounce" />
                </div>
                <h3 className="font-headline font-extrabold text-2xl text-white">Slot Claimed!</h3>
                <p className="text-xs text-[#cbc4d2]">
                  Bay {claimedBooking?.slot?.slotId || 'A1'} is locked for your vehicle check-in window.
                </p>
                <Button
                  variant="brand"
                  fullWidth
                  onClick={() => navigate(`/driver/navigation/${claimedBooking?._id || ''}`)}
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
