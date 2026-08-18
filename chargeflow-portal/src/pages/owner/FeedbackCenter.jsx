import React, { useState } from 'react';
import OwnerSidebar from '../../components/layout/OwnerSidebar';
import OwnerHeader from '../../components/layout/OwnerHeader';
import Footer from '../../components/layout/Footer';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/states/EmptyState';
import { MessageSquare, Star, ThumbsUp, Wrench, Sparkles, MessageCircle, MessageSquareOff } from 'lucide-react';

export default function FeedbackCenter() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const reviews = [
    { name: 'Alex Morgan', date: 'Today', rating: 5, category: 'Plug & Charge', comment: 'Bay A2 fast charging was super smooth. ISO 15118 plug & charge authorized instantly!', bay: 'Bay A2' },
    { name: 'Priya Sharma', date: 'Yesterday', rating: 5, category: 'Amenities', comment: 'Very clean station and nice coffee lounge nearby while waiting for 80% SoC.', bay: 'Bay A4' },
    { name: 'Rahul K.', date: '15 Aug 2026', rating: 4, category: 'Cable Condition', comment: 'Bay B3 cable dispenser retraction was slightly stiff, but charging speed was excellent.', bay: 'Bay B3' },
  ];

  return (
    <div className="min-h-screen bg-[#141218] text-[#e6e0e9] flex">
      <OwnerSidebar mobileOpen={mobileSidebarOpen} setMobileOpen={setMobileSidebarOpen} />

      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        <OwnerHeader setMobileSidebarOpen={setMobileSidebarOpen} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto w-full">
          {/* Header */}
          <div className="border-b border-[#494551]/40 pb-4">
            <h1 className="font-headline font-extrabold text-2xl sm:text-3xl text-white">Driver Feedback Center</h1>
            <p className="text-xs text-[#948e9c]">Monitor driver satisfaction scores and station category ratings.</p>
          </div>

          {/* Overall Rating Hero Card */}
          <Card glow className="bg-gradient-to-r from-[#e7c365]/15 via-[#211f24] to-[#2D8CFF]/20 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-2xl bg-[#e7c365]/20 text-[#e7c365]">
                <Star className="w-10 h-10 fill-current" />
              </div>
              <div>
                <div className="font-headline font-extrabold text-4xl text-white">4.8 / 5.0</div>
                <div className="text-xs text-[#cbc4d2]">Based on 184 verified driver reviews this month</div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
              <div className="bg-[#141218]/80 p-2.5 rounded-xl border border-[#494551]/40">
                <span className="text-[#948e9c] block text-[10px]">Cleanliness</span>
                <span className="font-bold text-[#22C55E]">4.9 ★</span>
              </div>
              <div className="bg-[#141218]/80 p-2.5 rounded-xl border border-[#494551]/40">
                <span className="text-[#948e9c] block text-[10px]">Access</span>
                <span className="font-bold text-[#22C55E]">4.8 ★</span>
              </div>
              <div className="bg-[#141218]/80 p-2.5 rounded-xl border border-[#494551]/40">
                <span className="text-[#948e9c] block text-[10px]">Cable Quality</span>
                <span className="font-bold text-[#e7c365]">4.6 ★</span>
              </div>
              <div className="bg-[#141218]/80 p-2.5 rounded-xl border border-[#494551]/40">
                <span className="text-[#948e9c] block text-[10px]">Safety</span>
                <span className="font-bold text-[#22C55E]">4.9 ★</span>
              </div>
            </div>
          </Card>

          {/* Feedback Feed */}
          <div className="space-y-4">
            <h3 className="font-headline font-bold text-xl text-white">Recent Driver Reviews</h3>

            {reviews.length === 0 ? (
              <EmptyState
                icon={MessageSquareOff}
                title="No feedback yet"
                description="Once drivers rate their charging sessions here, their reviews will show up in this panel."
              />
            ) : (
              <div className="space-y-4">

              {reviews.map((r, i) => (
                <Card key={i} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{r.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#211f24] text-[#cfbcff] border border-[#494551]">
                        {r.bay}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-[#e7c365]">★ {r.rating}.0</span>
                  </div>

                  <p className="text-xs text-[#cbc4d2] leading-relaxed">"{r.comment}"</p>

                  <div className="flex items-center justify-between pt-2 border-t border-[#494551]/40 text-xs text-[#948e9c]">
                    <span>{r.date}</span>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" icon={MessageCircle}>
                        Reply
                      </Button>
                      <Button variant="secondary" size="sm" icon={Wrench}>
                        Create Maintenance Task
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            )}
          </div>
        </main>


        <Footer />
      </div>
    </div>
  );
}
