import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Skeleton from '../components/ui/Skeleton';
import FeedbackGrid from '../components/driver/FeedbackGrid';
import { CheckCircle2, Leaf, Download, Home } from 'lucide-react';
import api from '../services/api';
import useToast from '../hooks/useToast';

export default function SessionSummary() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSessionSummary() {
      if (!id) return;
      setLoading(true);
      try {
        const response = await api.get(`/sessions/${id}`);
        setSession(response.data?.data?.session || null);
      } catch (err) {
        console.error('Failed to load session summary:', err);
        showToast({
          title: 'Summary Error',
          message: 'Could not load session tax invoice details.',
          type: 'error',
        });
      } finally {
        setLoading(false);
      }
    }
    loadSessionSummary();
  }, [id, showToast]);

  const energyKWh = session?.energyDeliveredKWh || 0;
  const cost = session?.cost || 0;
  const co2AvoidedKg = Math.round(energyKWh * 0.82 * 10) / 10;

  return (
    <div className="min-h-screen bg-[#141218] text-[#e6e0e9] flex flex-col justify-between">
      <Navbar />

      <div className="flex-1 flex items-center justify-center p-4 py-12 relative">
        {/* Green Glow background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#22C55E]/15 rounded-full blur-[140px] pointer-events-none -z-10" />

        <div className="w-full max-w-2xl space-y-6">
          {/* Celebration Header */}
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-2">
              <div className="p-3.5 rounded-full bg-[#22C55E]/20 border border-[#22C55E]/40 text-[#22C55E] animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
            </div>
            <h2 className="font-headline font-extrabold text-3xl sm:text-4xl text-white">
              Charge Complete. Great Drive Ahead!
            </h2>
            <p className="text-sm text-[#cbc4d2]">
              Session ID #{id ? id.slice(-6) : 'SES-9042'} • {session?.station?.name || 'ChargeFlow Station'}
            </p>
          </div>

          {/* Main Summary Card */}
          {loading ? (
            <Skeleton className="w-full h-96 rounded-2xl" />
          ) : (
            <Card glow className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div className="bg-[#1d1b20] p-3.5 rounded-2xl border border-[#494551]/40">
                  <span className="text-[10px] text-[#948e9c] uppercase block">Energy Delivered</span>
                  <span className="font-headline font-extrabold text-2xl text-white">{energyKWh} kWh</span>
                </div>
                <div className="bg-[#1d1b20] p-3.5 rounded-2xl border border-[#494551]/40">
                  <span className="text-[10px] text-[#948e9c] uppercase block">Status</span>
                  <span className="font-headline font-extrabold text-2xl text-[#22C55E]">Completed</span>
                </div>
                <div className="bg-[#1d1b20] p-3.5 rounded-2xl border border-[#494551]/40">
                  <span className="text-[10px] text-[#948e9c] uppercase block">Final Cost</span>
                  <span className="font-headline font-extrabold text-2xl text-[#22C55E]">₹{cost}</span>
                </div>
                <div className="bg-[#1d1b20] p-3.5 rounded-2xl border border-[#494551]/40">
                  <span className="text-[10px] text-[#948e9c] uppercase block">Connector</span>
                  <span className="font-headline font-extrabold text-2xl text-[#36D8FF]">
                    {session?.slot?.connectorType || 'CCS2'}
                  </span>
                </div>
              </div>

              {/* Eco Impact Story */}
              <div className="bg-gradient-to-r from-[#22C55E]/15 via-[#211f24] to-[#6750a4]/20 border border-[#22C55E]/30 rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-[#22C55E]/20 text-[#22C55E] shrink-0">
                    <Leaf className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-headline font-bold text-white text-base">{co2AvoidedKg} kg CO₂ Avoided</h4>
                    <p className="text-xs text-[#cbc4d2]">Equivalent impact of supporting a young tree for 3 days.</p>
                  </div>
                </div>
                <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-[#e7c365]/20 text-[#e7c365] whitespace-nowrap">
                  +100 Green Points
                </span>
              </div>

              {/* Feedback Grid */}
              <FeedbackGrid sessionId={id} />

              {/* Footer Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button variant="secondary" fullWidth icon={Download} onClick={() => window.print()}>
                  Download PDF Receipt
                </Button>
                <Button variant="brand" fullWidth icon={Home} onClick={() => navigate('/driver/dashboard')}>
                  Return to Dashboard
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
