// src/components/ui/ChartSkeleton.jsx
import React from "react";
import { Skeleton } from "./Skeleton";

export function ChartSkeleton({ height = "h-48" }) {
  return (
    <div className={`rounded-2xl border border-[#494551]/40 bg-[#1d1b20] p-5 shadow-lg ${height}`}>
      <Skeleton className="h-4 w-32 mb-6 bg-slate-700/60" />
      <div className="flex items-end gap-2.5 h-[65%]">
        {[40, 70, 55, 90, 60, 75, 45].map((h, i) => (
          <Skeleton key={i} className="flex-1 bg-slate-700/50" style={{ height: `${h}%` }} />
        ))}
      </div>
    </div>
  );
}

export default ChartSkeleton;
