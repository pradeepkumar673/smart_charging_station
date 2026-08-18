import React from 'react';
import Logo from '../ui/Logo';
import { Zap, Loader2 } from 'lucide-react';

export default function LoadingSpinner({ fullScreen = false, text = 'Powering up your experience...' }) {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 bg-[#141218] flex flex-col items-center justify-center space-y-6 text-center p-4">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#6750a4] via-[#2D8CFF] to-[#36D8FF] p-1 animate-spin">
            <div className="w-full h-full rounded-full bg-[#141218]" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center text-[#36D8FF]">
            <Zap className="w-8 h-8 fill-current animate-pulse" />
          </div>
        </div>

        <Logo size="lg" />
        <p className="text-xs font-semibold text-[#cfbcff] uppercase tracking-wider animate-pulse">{text}</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-2 p-4 text-[#36D8FF]">
      <Loader2 className="w-5 h-5 animate-spin" />
      <span className="text-xs font-medium text-[#cbc4d2]">{text}</span>
    </div>
  );
}
