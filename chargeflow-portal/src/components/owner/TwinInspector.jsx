import React from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { X, Car, Zap, Clock, Wrench, AlertTriangle, ShieldCheck, Power } from 'lucide-react';

export default function TwinInspector({ bay, onClose, onToggleMaintenance }) {
  if (!bay) return null;

  return (
    <div className="bg-[#1d1b20] border border-[#2D8CFF]/50 rounded-2xl p-5 space-y-4 shadow-2xl animate-fadeIn">
      <div className="flex items-center justify-between border-b border-[#494551]/40 pb-3">
        <div>
          <span className="text-[10px] text-[#948e9c] uppercase font-bold">Bay Inspector</span>
          <h3 className="font-headline font-extrabold text-xl text-white">{bay.name}</h3>
        </div>
        <button onClick={onClose} className="p-1 rounded-lg text-[#948e9c] hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-3 text-xs">
        <div className="flex justify-between py-1.5 border-b border-[#494551]/30">
          <span className="text-[#948e9c]">Bay Hardware Spec</span>
          <span className="font-bold text-white">{bay.type}</span>
        </div>
        <div className="flex justify-between py-1.5 border-b border-[#494551]/30">
          <span className="text-[#948e9c]">Live Operational Status</span>
          <span className="font-extrabold text-[#36D8FF] uppercase">{bay.status}</span>
        </div>

        {bay.status === 'occupied' && (
          <>
            <div className="flex justify-between py-1.5 border-b border-[#494551]/30">
              <span className="text-[#948e9c]">Connected Vehicle</span>
              <span className="font-semibold text-white">{bay.vehicle}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[#494551]/30">
              <span className="text-[#948e9c]">State of Charge (SoC)</span>
              <span className="font-bold text-[#22C55E]">{bay.soc}%</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[#494551]/30">
              <span className="text-[#948e9c]">Power Delivery</span>
              <span className="font-bold text-[#36D8FF]">{bay.power}</span>
            </div>
          </>
        )}

        {bay.status === 'available' && (
          <div className="bg-[#22C55E]/15 border border-[#22C55E]/30 p-3 rounded-xl text-center text-[#22C55E]">
            Dispensers Online • Ready for Plug & Charge Handshake
          </div>
        )}
      </div>

      <div className="space-y-2 pt-2">
        <Button
          variant={bay.status === 'maintenance' ? 'primary' : 'destructive'}
          fullWidth
          size="sm"
          icon={Wrench}
          onClick={() => onToggleMaintenance && onToggleMaintenance(bay.id)}
        >
          {bay.status === 'maintenance' ? 'Re-enable Dispenser' : 'Set Maintenance Mode'}
        </Button>
      </div>
    </div>
  );
}
