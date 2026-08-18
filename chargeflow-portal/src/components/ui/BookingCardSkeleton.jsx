// src/components/ui/BookingCardSkeleton.jsx
import React from "react";
import { Skeleton } from "./Skeleton";

export function BookingCardSkeleton() {
  return (
    <div className="rounded-2xl border border-[#494551]/40 bg-[#1d1b20] p-5 shadow-lg flex justify-between items-center">
      <div className="space-y-2 flex-1">
        <Skeleton className="h-4 w-40 bg-slate-700/60" />
        <Skeleton className="h-3 w-28 bg-slate-700/40" />
        <Skeleton className="h-3 w-32 bg-slate-700/40" />
      </div>
      <Skeleton className="h-10 w-10 rounded-full bg-slate-700/50" />
    </div>
  );
}

export default BookingCardSkeleton;
