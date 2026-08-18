import React from 'react';
import { BarChart3, TrendingUp, Cpu, DollarSign } from 'lucide-react';

export default function AnalyticsCharts() {
  const chargers = [
    { bay: 'Bay A1', type: '150 kW CCS2', sessions: 142, revenue: '₹42,150', utilization: '84%', status: 'Healthy' },
    { bay: 'Bay A2', type: '150 kW CCS2', sessions: 168, revenue: '₹51,200', utilization: '91%', status: 'Healthy' },
    { bay: 'Bay B1', type: '350 kW NACS', sessions: 194, revenue: '₹68,400', utilization: '88%', status: 'Healthy' },
    { bay: 'Bay B3', type: '150 kW CCS2', sessions: 48, revenue: '₹14,200', utilization: '34%', status: 'Maintenance' },
  ];

  return (
    <div className="space-y-6">
      {/* Charger Performance Ranking Table */}
      <div className="bg-[#1d1b20] border border-[#494551]/60 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-headline font-bold text-lg text-white">Charger Hardware Yield Ranking</h3>
          <span className="text-xs text-[#36D8FF]">Last 30 Days Telemetry</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#494551]/40 text-[#948e9c] uppercase font-semibold">
                <th className="pb-3">Bay ID</th>
                <th className="pb-3">Hardware Standard</th>
                <th className="pb-3">Sessions</th>
                <th className="pb-3">Total Revenue</th>
                <th className="pb-3">Avg Utilization</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#494551]/30">
              {chargers.map((c, i) => (
                <tr key={i} className="hover:bg-[#211f24] transition-colors">
                  <td className="py-3 font-bold text-white">{c.bay}</td>
                  <td className="py-3 text-[#cbc4d2]">{c.type}</td>
                  <td className="py-3 font-medium text-white">{c.sessions}</td>
                  <td className="py-3 font-bold text-[#22C55E]">{c.revenue}</td>
                  <td className="py-3 font-semibold text-[#36D8FF]">{c.utilization}</td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      c.status === 'Healthy' ? 'bg-[#22C55E]/20 text-[#22C55E]' : 'bg-[#ffb4ab]/20 text-[#ffb4ab]'
                    }`}>
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
