// src/components/ui/StatCardSkeleton.jsx
import React from "react";
import { Skeleton } from "./Skeleton";

export function StatCardSkeleton() {
  return (
    <div className="rounded-2xl border border-[#494551]/40 bg-[#1d1b20] p-4 sm:p-5 shadow-lg space-y-3">
      <Skeleton className="h-4 w-24 bg-slate-700/50" />
      <Skeleton className="h-7 w-20 bg-slate-700/60" />
      <Skeleton className="h-3 w-32 bg-slate-700/40" />
    </div>
  );
}

export default StatCardSkeleton;
