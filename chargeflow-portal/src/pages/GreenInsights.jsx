import React, { useState } from 'react';
import DriverSidebar from '../components/layout/DriverSidebar';
import DriverHeader from '../components/layout/DriverHeader';
import Footer from '../components/layout/Footer';
import Card from '../components/ui/Card';
import EnergyBadge from '../components/ui/EnergyBadge';
import { Leaf, Sparkles, Trophy, Award, TrendingUp, Sun, Zap, ShieldCheck, Flame } from 'lucide-react';

export default function GreenInsights() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [timeframe, setTimeframe] = useState('month');

  const badges = [
    { name: 'Early Bird Charger', desc: 'Off-peak morning charging', unlocked: true, icon: Sun },
    { name: 'Clean Energy Champion', desc: '90%+ renewable sessions', unlocked: true, icon: Leaf },
    { name: 'Smart Scheduler', desc: 'Reserved 5 slots in advance', unlocked: true, icon: Trophy },
    { name: 'Grid Balancer', desc: 'Shifted demand off peak hours', unlocked: false, icon: Award },
  ];

  return (
    <div className="min-h-screen bg-[#141218] text-[#e6e0e9] flex">
      <DriverSidebar mobileOpen={mobileSidebarOpen} setMobileOpen={setMobileSidebarOpen} />

      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        <DriverHeader setMobileSidebarOpen={setMobileSidebarOpen} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 max-w-6xl mx-auto w-full">
          {/* Header & Timeframe Switcher */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#494551]/40 pb-4">
            <div>
              <h1 className="font-headline font-extrabold text-2xl sm:text-3xl text-white">Green Insights & Impact</h1>
              <p className="text-xs text-[#948e9c]">Track your carbon offsets, clean energy usage, and achievement badges.</p>
            </div>

            <div className="flex items-center bg-[#1d1b20] p-1 rounded-xl border border-[#494551]/60 text-xs font-semibold">
              {['week', 'month', 'year'].map((t) => (
                <button
                  key={t}
                  onClick={() => setTimeframe(t)}
                  className={`px-3 py-1.5 rounded-lg capitalize transition-all ${
                    timeframe === t ? 'bg-[#6750a4] text-white shadow' : 'text-[#cbc4d2] hover:text-white'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Hero Green Score Card */}
          <Card glow className="bg-gradient-to-r from-[#22C55E]/15 via-[#211f24] to-[#6750a4]/30 border-[#22C55E]/40 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#22C55E]/20 text-[#22C55E] text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Green Driver Level 4</span>
              </div>
              <h2 className="font-headline font-extrabold text-3xl text-white">
                Eco Score: <span className="text-[#22C55E]">842 / 1000</span>
              </h2>
              <p className="text-xs text-[#cbc4d2] max-w-md">
                Your charging choices have offset 342 kg CO₂ this month. You're in the top 5% cleanest drivers in Bengaluru!
              </p>
            </div>

            <div className="text-center bg-[#141218]/80 p-5 rounded-2xl border border-[#494551]/40 shrink-0">
              <div className="font-headline font-extrabold text-3xl text-[#e7c365]">1,480</div>
              <div className="text-xs text-[#948e9c] mt-0.5">Green Points Balance</div>
              <div className="text-[10px] text-[#22C55E] font-semibold mt-1">Redeemable for ₹150 off</div>
            </div>
          </Card>

          {/* Stat Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="text-center space-y-1">
              <span className="text-xs text-[#948e9c]">CO₂ Avoided</span>
              <div className="font-headline font-extrabold text-2xl text-[#22C55E]">342 kg</div>
              <span className="text-[10px] text-[#cbc4d2]">18 Trees Planted Equivalent</span>
            </Card>

            <Card className="text-center space-y-1">
              <span className="text-xs text-[#948e9c]">Clean Energy</span>
              <div className="font-headline font-extrabold text-2xl text-[#36D8FF]">840 kWh</div>
              <span className="text-[10px] text-[#cbc4d2]">88% Renewable Mix</span>
            </Card>

            <Card className="text-center space-y-1">
              <span className="text-xs text-[#948e9c]">Spend Savings</span>
              <div className="font-headline font-extrabold text-2xl text-[#e7c365]">₹2,150</div>
              <span className="text-[10px] text-[#cbc4d2]">Via Off-Peak Charging</span>
            </Card>

            <Card className="text-center space-y-1">
              <span className="text-xs text-[#948e9c]">Charging Streak</span>
              <div className="font-headline font-extrabold text-2xl text-[#ffb4ab]">8 Days</div>
              <span className="text-[10px] text-[#cbc4d2]">Clean Charging Streak</span>
            </Card>
          </div>

          {/* Achievement Badges */}
          <div className="space-y-4">
            <h3 className="font-headline font-bold text-xl text-white">Eco Achievement Badges</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {badges.map((b, i) => {
                const Icon = b.icon;
                return (
                  <Card key={i} className={`text-center space-y-2 ${!b.unlocked ? 'opacity-50' : 'border-[#22C55E]/30'}`}>
                    <div className="p-3 w-fit mx-auto rounded-2xl bg-[#22C55E]/15 text-[#22C55E]">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="font-headline font-bold text-sm text-white">{b.name}</div>
                    <div className="text-[10px] text-[#948e9c]">{b.desc}</div>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full inline-block ${
                      b.unlocked ? 'bg-[#22C55E]/20 text-[#22C55E]' : 'bg-[#494551] text-[#cbc4d2]'
                    }`}>
                      {b.unlocked ? 'Unlocked' : 'Locked'}
                    </span>
                  </Card>
                );
              })}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
