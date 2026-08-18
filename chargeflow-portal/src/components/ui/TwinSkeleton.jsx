// src/components/ui/TwinSkeleton.jsx
import React from "react";
import { Skeleton } from "./Skeleton";

export function TwinSkeleton() {
  return (
    <div className="rounded-2xl border border-[#494551]/40 bg-[#1d1b20] p-6 shadow-lg">
      <Skeleton className="h-5 w-40 mb-6 bg-slate-700/60" />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-2xl bg-slate-700/50" />
        ))}
      </div>
    </div>
  );
}

export default TwinSkeleton;
