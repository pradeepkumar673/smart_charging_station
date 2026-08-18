// src/components/ui/Skeleton.jsx
import React from "react";

// Base shimmer block reused by all skeleton components below.
export function Skeleton({ className = "", style = {} }) {
  return (
    <div
      style={style}
      className={`animate-pulse rounded-xl bg-slate-800/60 border border-slate-700/30 ${className}`}
    />
  );
}

export default Skeleton;
