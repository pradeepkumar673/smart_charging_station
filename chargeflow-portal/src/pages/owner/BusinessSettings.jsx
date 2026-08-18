import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import OwnerSidebar from '../../components/layout/OwnerSidebar';
import OwnerHeader from '../../components/layout/OwnerHeader';
import Footer from '../../components/layout/Footer';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Building2, User, Users, Bell, Shield, LogOut, CheckCircle2 } from 'lucide-react';

export default function BusinessSettings() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [autoRecovery, setAutoRecovery] = useState(true);
  const [dynamicYield, setDynamicYield] = useState(true);

  return (
    <div className="min-h-screen bg-[#141218] text-[#e6e0e9] flex">
      <OwnerSidebar mobileOpen={mobileSidebarOpen} setMobileOpen={setMobileSidebarOpen} />

      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        <OwnerHeader setMobileSidebarOpen={setMobileSidebarOpen} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 max-w-4xl mx-auto w-full">
          {/* Header */}
          <div className="border-b border-[#494551]/40 pb-4">
            <h1 className="font-headline font-extrabold text-2xl sm:text-3xl text-white">Business Settings & Team</h1>
            <p className="text-xs text-[#948e9c]">Manage operator business entity, team roles, and automated grid policies.</p>
          </div>

          {/* Company Profile */}
          <Card glow className="space-y-4">
            <h3 className="font-headline font-bold text-lg text-white border-b border-[#494551]/40 pb-3">
              Entity Profile
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Company Legal Name" defaultValue="VoltCharge Networks LLC" />
              <Input label="Primary Operator Name" defaultValue="Arjun Patel" />
              <Input label="Business Email" defaultValue="arjun@voltchargenetworks.com" />
              <Input label="Tax / GST Registration ID" defaultValue="GSTIN29ABCDE1234F" />
            </div>
          </Card>

          {/* Automated Network Operations */}
          <Card className="space-y-4 text-xs">
            <h3 className="font-headline font-bold text-base text-white border-b border-[#494551]/40 pb-2">
              Automated Grid Policies
            </h3>

            <div className="flex items-center justify-between py-2 border-b border-[#494551]/30">
              <div>
                <span className="font-bold text-white block">Automated No-Show Recovery</span>
                <span className="text-[#948e9c]">Automatically re-list bays to nearby drivers if check-in is missed by 10 mins</span>
              </div>
              <input
                type="checkbox"
                checked={autoRecovery}
                onChange={(e) => setAutoRecovery(e.target.checked)}
                className="w-5 h-5 rounded bg-[#1d1b20] text-[#2D8CFF]"
              />
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <span className="font-bold text-white block">AI Dynamic Yield Engine</span>
                <span className="text-[#948e9c]">Allow AI to adjust peak tariffs based on real-time grid congestion</span>
              </div>
              <input
                type="checkbox"
                checked={dynamicYield}
                onChange={(e) => setDynamicYield(e.target.checked)}
                className="w-5 h-5 rounded bg-[#1d1b20] text-[#2D8CFF]"
              />
            </div>
          </Card>

          {/* Sign Out */}
          <div className="pt-4 text-center">
            <Link to="/owner/login">
              <Button variant="destructive" size="lg" icon={LogOut} fullWidth>
                Sign Out of Console
              </Button>
            </Link>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
