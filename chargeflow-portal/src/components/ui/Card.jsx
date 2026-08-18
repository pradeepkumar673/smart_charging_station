import React from 'react';

export default function Card({ children, className = '', glow = false, ...props }) {
  return (
    <div
      className={`rounded-2xl bg-[#211f24]/80 backdrop-blur-md border border-[#494551]/60 p-6 md:p-8 shadow-xl relative overflow-hidden ${
        glow ? 'shadow-[#6750a4]/15 border-[#6750a4]/30' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
