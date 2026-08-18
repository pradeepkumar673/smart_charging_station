import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { Car, Building2, Zap, ShieldCheck, Activity, Gauge, MapPin, ArrowRight, Sparkles, Radio } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#141218] text-[#e6e0e9] flex flex-col selection:bg-[#6750a4] selection:text-white">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden">
          {/* Ambient Glow background elements */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-[#6750a4]/20 via-[#2D8CFF]/20 to-[#36D8FF]/10 rounded-full blur-[120px] pointer-events-none -z-10" />
          <div className="absolute top-10 right-10 w-72 h-72 bg-[#2D8CFF]/15 rounded-full blur-[100px] pointer-events-none -z-10" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
            {/* Status Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#211f24] border border-[#494551]/60 text-xs font-semibold text-[#cfbcff] shadow-inner">
              <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-ping" />
              <span>Next-Gen Autonomous EV Grid Live</span>
              <Sparkles className="w-3.5 h-3.5 text-[#e7c365]" />
            </div>

            {/* Main Headline */}
            <h1 className="font-headline font-extrabold text-4xl sm:text-6xl lg:text-7xl tracking-tight leading-[1.1] max-w-4xl mx-auto text-white">
              Autonomous Electric Vehicle <span className="bg-gradient-to-r from-[#cfbcff] via-[#2D8CFF] to-[#36D8FF] bg-clip-text text-transparent">Charging Portal</span>
            </h1>

            <p className="font-body text-base sm:text-xl text-[#cbc4d2] max-w-2xl mx-auto leading-relaxed">
              Seamless ISO 15118 Plug & Charge automation, real-time Digital Twin station telemetry, and smart AI energy orchestration.
            </p>

            {/* Metric Banner */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-4">
              <div className="bg-[#1d1b20]/80 border border-[#494551]/40 rounded-xl p-3.5 text-center">
                <div className="font-headline font-extrabold text-2xl text-[#36D8FF]">14,280+</div>
                <div className="text-xs text-[#948e9c] mt-0.5">Active Chargers</div>
              </div>
              <div className="bg-[#1d1b20]/80 border border-[#494551]/40 rounded-xl p-3.5 text-center">
                <div className="font-headline font-extrabold text-2xl text-[#22C55E]">99.94%</div>
                <div className="text-xs text-[#948e9c] mt-0.5">Grid Uptime</div>
              </div>
              <div className="bg-[#1d1b20]/80 border border-[#494551]/40 rounded-xl p-3.5 text-center">
                <div className="font-headline font-extrabold text-2xl text-[#cfbcff]">3.2M kWh</div>
                <div className="text-xs text-[#948e9c] mt-0.5">Green Energy</div>
              </div>
              <div className="bg-[#1d1b20]/80 border border-[#494551]/40 rounded-xl p-3.5 text-center">
                <div className="font-headline font-extrabold text-2xl text-[#e7c365]">0.4s</div>
                <div className="text-xs text-[#948e9c] mt-0.5">Auth Response</div>
              </div>
            </div>

            {/* Role Selection Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto pt-8 text-left">
              {/* Card 1: Driver */}
              <Card className="hover:border-[#6750a4] transition-all duration-300 group hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-2xl bg-[#6750a4]/20 border border-[#6750a4]/40 text-[#cfbcff]">
                    <Car className="w-8 h-8" />
                  </div>
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30">
                    EV Drivers
                  </span>
                </div>

                <h3 className="font-headline text-2xl font-bold text-white mb-2 group-hover:text-[#cfbcff] transition-colors">
                  I'm a Driver
                </h3>
                <p className="text-sm text-[#cbc4d2] mb-6 leading-relaxed">
                  Locate ultra-fast charging hubs, reserve autonomous slots in advance, track live battery telemetry, and enjoy frictionless automatic billing.
                </p>

                <div className="space-y-2 mb-6 text-xs text-[#948e9c]">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-[#2D8CFF]" />
                    <span>Instant slot reservation & auto-navigation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#22C55E]" />
                    <span>Plug & Charge automated authentication</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Link to="/driver/signup" className="flex-1">
                    <Button variant="primary" fullWidth icon={ArrowRight} iconPosition="right">
                      Create Driver Account
                    </Button>
                  </Link>
                  <Link to="/driver/login">
                    <Button variant="secondary" fullWidth>
                      Sign In
                    </Button>
                  </Link>
                </div>
              </Card>

              {/* Card 2: Station Owner */}
              <Card className="hover:border-[#2D8CFF] transition-all duration-300 group hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-2xl bg-[#2D8CFF]/20 border border-[#2D8CFF]/40 text-[#36D8FF]">
                    <Building2 className="w-8 h-8" />
                  </div>
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#2D8CFF]/15 text-[#36D8FF] border border-[#2D8CFF]/30">
                    Station Operators
                  </span>
                </div>

                <h3 className="font-headline text-2xl font-bold text-white mb-2 group-hover:text-[#36D8FF] transition-colors">
                  I'm a Station Owner
                </h3>
                <p className="text-sm text-[#cbc4d2] mb-6 leading-relaxed">
                  Monetize your charging infrastructure, configure dynamic time-of-use tariffs, monitor Digital Twin hardware telemetry, and track station analytics.
                </p>

                <div className="space-y-2 mb-6 text-xs text-[#948e9c]">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-[#36D8FF]" />
                    <span>Real-time Digital Twin slot state control</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Gauge className="w-4 h-4 text-[#e7c365]" />
                    <span>Dynamic price yield management engine</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Link to="/owner/signup" className="flex-1">
                    <Button variant="brand" fullWidth icon={ArrowRight} iconPosition="right">
                      Register Station
                    </Button>
                  </Link>
                  <Link to="/owner/login">
                    <Button variant="secondary" fullWidth>
                      Owner Console
                    </Button>
                  </Link>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Feature Overview */}
        <section id="features" className="py-16 bg-[#1d1b20]/60 border-t border-[#494551]/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-3 mb-12">
              <h2 className="font-headline text-3xl sm:text-4xl font-extrabold text-white">
                Engineered for Autonomous Energy Excellence
              </h2>
              <p className="text-[#cbc4d2] text-sm max-w-xl mx-auto">
                Discover the capabilities driving the next era of electric mobility.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#211f24] border border-[#494551]/50 p-6 rounded-2xl space-y-3">
                <div className="p-3 w-fit rounded-xl bg-[#6750a4]/20 text-[#cfbcff]">
                  <Radio className="w-6 h-6" />
                </div>
                <h3 className="font-headline font-bold text-lg text-white">Digital Twin Telemetry</h3>
                <p className="text-xs text-[#948e9c] leading-relaxed">
                  Millisecond live status updates from CCS2, NACS, and DC Fast Charger hardware with health diagnostics and predictive maintenance.
                </p>
              </div>

              <div className="bg-[#211f24] border border-[#494551]/50 p-6 rounded-2xl space-y-3">
                <div className="p-3 w-fit rounded-xl bg-[#2D8CFF]/20 text-[#36D8FF]">
                  <MapPin className="w-6 h-6" />
                </div>
                <h3 className="font-headline font-bold text-lg text-white">Autonomous Slot Booking</h3>
                <p className="text-xs text-[#948e9c] leading-relaxed">
                  Smart queue allocation and vehicle-to-grid routing that guarantees your charger slot is reserved when your EV arrives.
                </p>
              </div>

              <div className="bg-[#211f24] border border-[#494551]/50 p-6 rounded-2xl space-y-3">
                <div className="p-3 w-fit rounded-xl bg-[#e7c365]/20 text-[#e7c365]">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="font-headline font-bold text-lg text-white">Frictionless Security</h3>
                <p className="text-xs text-[#948e9c] leading-relaxed">
                  Multi-factor authentication, cryptographic vehicle handshakes, and automated wallet billing with instant receipts.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
