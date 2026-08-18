import React from 'react';
import Logo from '../ui/Logo';
import { ShieldCheck, Zap, Globe, Cpu } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#0f0d13] border-t border-[#494551]/30 pt-12 pb-8 text-[#948e9c] text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-[#494551]/30">
          <div className="space-y-4 md:col-span-1">
            <Logo size="md" />
            <p className="text-xs text-[#cbc4d2] leading-relaxed">
              Next-generation autonomous EV charging ecosystem. Real-time digital twin telemetry, smart route planning, and automated station revenue management.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#36D8FF]">
              <Cpu className="w-4 h-4 animate-pulse" />
              <span>Autonomous Network v2.4 Online</span>
            </div>
          </div>

          <div>
            <h4 className="font-headline font-bold text-[#e6e0e9] text-xs uppercase tracking-wider mb-4">Drivers</h4>
            <ul className="space-y-2.5 text-xs">
              <li><a href="/driver/signup" className="hover:text-[#cfbcff] transition-colors">Register EV</a></li>
              <li><a href="/driver/login" className="hover:text-[#cfbcff] transition-colors">Driver Login</a></li>
              <li><a href="/#features" className="hover:text-[#cfbcff] transition-colors">Charging Network Map</a></li>
              <li><a href="/#features" className="hover:text-[#cfbcff] transition-colors">Dynamic Tariff Rates</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-headline font-bold text-[#e6e0e9] text-xs uppercase tracking-wider mb-4">Station Owners</h4>
            <ul className="space-y-2.5 text-xs">
              <li><a href="/owner/signup" className="hover:text-[#36D8FF] transition-colors">Partner Station Onboarding</a></li>
              <li><a href="/owner/login" className="hover:text-[#36D8FF] transition-colors">Owner Console</a></li>
              <li><a href="/#owners" className="hover:text-[#36D8FF] transition-colors">Slot Telemetry & Pricing</a></li>
              <li><a href="/#owners" className="hover:text-[#36D8FF] transition-colors">Digital Twin Hardware Spec</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-headline font-bold text-[#e6e0e9] text-xs uppercase tracking-wider mb-4">Security & Compliance</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-2 text-xs">
                <ShieldCheck className="w-4 h-4 text-[#22C55E] shrink-0 mt-0.5" />
                <span>ISO 15118 Plug & Charge Standard Compliant</span>
              </div>
              <div className="flex items-start gap-2 text-xs">
                <Globe className="w-4 h-4 text-[#2D8CFF] shrink-0 mt-0.5" />
                <span>Global Autonomous Charging Grid Protocol</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} ChargeFlow Autonomous Systems Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-[#e6e0e9] transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-[#e6e0e9] transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-[#e6e0e9] transition-colors">API Docs</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
