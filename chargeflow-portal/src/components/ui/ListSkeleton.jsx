// src/components/ui/ListSkeleton.jsx
import React from "react";
import { Skeleton } from "./Skeleton";

export function ListSkeleton({ rows = 4 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 rounded-2xl border border-[#494551]/40 bg-[#1d1b20] p-4 shadow-md">
          <Skeleton className="h-10 w-10 rounded-full shrink-0 bg-slate-700/60" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3.5 w-3/4 bg-slate-700/60" />
            <Skeleton className="h-3 w-1/2 bg-slate-700/40" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default ListSkeleton;
