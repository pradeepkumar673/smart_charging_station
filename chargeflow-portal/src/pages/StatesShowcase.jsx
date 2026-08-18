import React, { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import EmptyState from '../components/states/EmptyState';
import LoadingSpinner from '../components/states/LoadingSpinner';
import { StatCardSkeleton, StationCardSkeleton, TwinSkeleton } from '../components/states/LoadingSkeleton';
import ErrorState from '../components/states/ErrorState';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Inbox, MapPin, Calendar, WifiOff, AlertTriangle, RefreshCw } from 'lucide-react';

export default function StatesShowcase() {
  const [showFullScreenLoading, setShowFullScreenLoading] = useState(false);

  if (showFullScreenLoading) {
    return (
      <div onClick={() => setShowFullScreenLoading(false)}>
        <LoadingSpinner fullScreen text="Simulating app boot sequence... (Click to close)" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#141218] text-[#e6e0e9] flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 p-4 sm:p-8 max-w-6xl mx-auto w-full space-y-12">
        <div className="border-b border-[#494551]/40 pb-4">
          <h1 className="font-headline font-extrabold text-3xl text-white">Phase 5: Utility & Shared States Showcase</h1>
          <p className="text-xs text-[#948e9c]">Reusable Empty, Loading, Skeleton, and Error components for capstone demo.</p>
        </div>

        {/* 1. Empty States */}
        <section className="space-y-4">
          <h2 className="font-headline font-bold text-xl text-white border-b border-[#494551]/40 pb-2">1. Empty State Component Variants</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <EmptyState
              icon={MapPin}
              title="No Nearby Stations Found"
              description="Try expanding your search radius or clearing active connector filters."
              ctaLabel="Reset Search Radius"
              size="sm"
            />
            <EmptyState
              icon={Calendar}
              title="No Upcoming Bookings"
              description="You have no active charger slot reservations scheduled for today."
              ctaLabel="Reserve a Slot"
              size="sm"
            />
            <EmptyState
              icon={Inbox}
              title="No Notifications Yet"
              description="Station alerts and booking confirmations will appear right here."
              size="sm"
            />
          </div>
        </section>

        {/* 2. Loading & Skeleton Loaders */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#494551]/40 pb-2">
            <h2 className="font-headline font-bold text-xl text-white">2. Loading & Skeleton Components</h2>
            <Button variant="secondary" size="sm" onClick={() => setShowFullScreenLoading(true)}>
              Demo Full-Screen Boot Spinner
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <span className="text-xs font-bold text-[#cbc4d2]">Stat Card Skeleton</span>
              <StatCardSkeleton />
            </div>

            <div className="space-y-3">
              <span className="text-xs font-bold text-[#cbc4d2]">Station Card Skeleton</span>
              <StationCardSkeleton />
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <span className="text-xs font-bold text-[#cbc4d2]">Digital Twin Grid Skeleton</span>
            <Card>
              <TwinSkeleton />
            </Card>
          </div>
        </section>

        {/* 3. Error States */}
        <section className="space-y-4">
          <h2 className="font-headline font-bold text-xl text-white border-b border-[#494551]/40 pb-2">3. Error State Component Variants</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ErrorState
              icon={WifiOff}
              title="Offline Telemetry Disconnected"
              description="Lost millisecond grid handshake with Station Hub #MG-01. Data will auto-sync when online."
              primaryActionLabel="Retry Telemetry Sync"
              onPrimaryAction={() => alert('Retrying connection...')}
            />
            <ErrorState
              icon={AlertTriangle}
              title="Slot Already Claimed"
              description="Another driver just reserved Bay A2. Would you like to select an alternative nearby bay?"
              primaryActionLabel="View Alternative Bays"
              onPrimaryAction={() => alert('Redirecting to alternatives...')}
            />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
