import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Button from '../components/ui/Button';
import { MapPin, Navigation, Home, Zap, Compass, ArrowRight } from 'lucide-react';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#141218] text-[#e6e0e9] flex flex-col justify-between selection:bg-[#6750a4]">
      <Navbar />

      <div className="flex-1 flex items-center justify-center p-4 py-16 relative overflow-hidden">
        {/* Ambient Dark Grid Map Canvas background */}
        <svg className="absolute inset-0 w-full h-full text-[#211f24] opacity-40 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <pattern id="notFoundGrid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(73, 69, 81, 0.25)" strokeWidth="1" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#notFoundGrid)" />
          <path d="M -50 200 L 900 100" fill="none" stroke="rgba(103, 80, 164, 0.3)" strokeWidth="12" strokeDasharray="12,12" />
        </svg>

        {/* Glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[#6750a4]/15 rounded-full blur-[140px] pointer-events-none -z-10" />

        <div className="relative z-10 max-w-lg mx-auto text-center space-y-6">
          {/* 404 Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#6750a4]/20 border border-[#6750a4]/40 text-[#cfbcff] text-xs font-extrabold shadow-inner">
            <Compass className="w-4 h-4 text-[#36D8FF] animate-spin-slow" />
            <span>Route Navigation Error 404</span>
          </div>

          {/* 404 Large Display */}
          <div className="font-headline font-extrabold text-7xl sm:text-9xl text-transparent bg-clip-text bg-gradient-to-r from-[#cfbcff] via-[#2D8CFF] to-[#36D8FF] tracking-tighter">
            404
          </div>

          <div className="space-y-2">
            <h2 className="font-headline font-bold text-2xl sm:text-3xl text-white">
              Looks like this route doesn't exist.
            </h2>
            <p className="text-sm text-[#cbc4d2] max-w-md mx-auto leading-relaxed">
              The page you're looking for may have moved—or it was never on the ChargeFlow autonomous map.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button
              variant="brand"
              size="lg"
              icon={Home}
              onClick={() => navigate('/')}
            >
              Take Me Home
            </Button>
            <Link to="/driver/explore">
              <Button variant="secondary" size="lg" icon={MapPin}>
                Explore Stations
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
