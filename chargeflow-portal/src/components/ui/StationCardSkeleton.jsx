// src/components/ui/StationCardSkeleton.jsx
import React from "react";
import { Skeleton } from "./Skeleton";

export function StationCardSkeleton() {
  return (
    <div className="rounded-2xl border border-[#494551]/40 bg-[#1d1b20] p-5 shadow-lg space-y-4">
      <div className="flex justify-between items-start">
        <Skeleton className="h-5 w-44 bg-slate-700/60" />
        <Skeleton className="h-6 w-16 rounded-full bg-slate-700/50" />
      </div>
      <Skeleton className="h-3 w-56 bg-slate-700/40" />
      <div className="flex gap-2">
        <Skeleton className="h-6 w-16 rounded-full bg-slate-700/40" />
        <Skeleton className="h-6 w-20 rounded-full bg-slate-700/40" />
      </div>
      <div className="flex justify-between items-center pt-2">
        <Skeleton className="h-4 w-20 bg-slate-700/50" />
        <Skeleton className="h-9 w-24 rounded-xl bg-slate-700/60" />
      </div>
    </div>
  );
}

export default StationCardSkeleton;
