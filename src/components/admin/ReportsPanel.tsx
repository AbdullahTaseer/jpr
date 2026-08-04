"use client";

const MONTHLY = [
  { month:"Jan", revenue:18200, orders:312 },
  { month:"Feb", revenue:22400, orders:401 },
  { month:"Mar", revenue:19800, orders:367 },
  { month:"Apr", revenue:28600, orders:512 },
  { month:"May", revenue:31200, orders:548 },
  { month:"Jun", revenue:38900, orders:694 },
  { month:"Jul", revenue:42100, orders:751 },
  { month:"Aug", revenue:36700, orders:632 },
];

const TOP_VENDORS = [
  { name:"TechVibe",        revenue:"$42,180", orders:312, growth:"+24%" },
  { name:"EcoStyle Co.",    revenue:"$31,420", orders:287, growth:"+18%" },
  { name:"PureGlow Beauty", revenue:"$28,650", orders:241, growth:"+31%" },
  { name:"CraftCo Leather", revenue:"$24,900", orders:198, growth:"+12%" },
  { name:"ZenLife Store",   revenue:"$18,340", orders:164, growth:"+9%"  },
];

const TOP_CATS = [
  { name:"Electronics",   pct:28, color:"#1B6FEB" },
  { name:"Women Fashion", pct:22, color:"#8B5CF6" },
  { name:"Beauty",        pct:16, color:"#EC4899" },
  { name:"Home & Garden", pct:12, color:"#10B981" },
  { name:"Sports",        pct:10, color:"#F59E0B" },
  { name:"Other",         pct:12, color:"#6b7280"  },
];

const IcoDownload = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>;

export default function ReportsPanel() {
  const W = 700, H = 220;
  const pad = { top: 20, right: 20, bottom: 44, left: 60 };
  const cW = W - pad.left - pad.right;
  const cH = H - pad.top - pad.bottom;
  const maxRev = Math.max(...MONTHLY.map(d => d.revenue));
  const ceil = Math.ceil(maxRev / 10000) * 10000;
  const ticks = [0, ceil * 0.25, ceil * 0.5, ceil * 0.75, ceil];
  const barW = (cW / MONTHLY.length) * 0.5;
  const barGap = cW / MONTHLY.length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3 justify-end">
        {["This Month","Last 3 Months","Last 6 Months","This Year"].map(p => (
          <button key={p} className="px-4 py-2 text-sm font-medium text-[#9ca3af] border border-white/10 rounded-xl hover:border-white/20 hover:text-white transition-colors first:bg-[#1B6FEB]/15 first:text-[#1B6FEB] first:border-[#1B6FEB]/30">
            {p}
          </button>
        ))}
        <button className="flex items-center gap-2 bg-[#1B6FEB]/15 text-[#1B6FEB] text-sm font-semibold px-4 py-2 rounded-xl hover:bg-[#1B6FEB]/25 transition-colors">
          <IcoDownload /> Export
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label:"Total Revenue",   value:"$257,840", change:"+18.2%" },
          { label:"Total Orders",    value:"4,227",    change:"+9.4%"  },
          { label:"Avg Order Value", value:"$60.98",   change:"+8.1%"  },
          { label:"Refund Rate",     value:"2.3%",     change:"-0.4%"  },
        ].map(s => (
          <div key={s.label} className="bg-[#1a1a1a] border border-white/10 rounded-xl p-4">
            <p className="text-[#6b7280] text-xs font-medium uppercase tracking-wide mb-1">{s.label}</p>
            <p className="text-white text-xl font-bold">{s.value}</p>
            <p className="text-emerald-400 text-xs font-medium mt-0.5">{s.change} vs prev period</p>
          </div>
        ))}
      </div>

      <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6">
        <h3 className="text-white font-semibold mb-5">Monthly Revenue</h3>
        <div className="w-full overflow-x-auto">
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto min-w-[360px]">
            {ticks.map(tick => {
              const y = pad.top + cH - (tick / ceil) * cH;
              return (
                <g key={tick}>
                  <line x1={pad.left} y1={y} x2={W - pad.right} y2={y} stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
                  <text x={pad.left - 8} y={y + 4} textAnchor="end" fill="#6b7280" fontSize="11" fontFamily="Inter,sans-serif">
                    {tick >= 1000 ? `$${(tick/1000).toFixed(0)}k` : tick}
                  </text>
                </g>
              );
            })}
            {MONTHLY.map((d, i) => {
              const barH = (d.revenue / ceil) * cH;
              const x = pad.left + i * barGap + barGap / 2 - barW / 2;
              const y = pad.top + cH - barH;
              return (
                <g key={d.month}>
                  <rect x={x} y={pad.top + cH} width={barW} height={0} fill="#1B6FEB" rx="4">
                    <animate attributeName="height" from="0" to={barH} dur="0.6s" begin={`${i*0.07}s`} fill="freeze"/>
                    <animate attributeName="y" from={pad.top + cH} to={y} dur="0.6s" begin={`${i*0.07}s`} fill="freeze"/>
                  </rect>
                  <text x={x + barW / 2} y={H - 8} textAnchor="middle" fill="#6b7280" fontSize="11" fontFamily="Inter,sans-serif">{d.month}</text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-white/10">
            <h3 className="text-white font-semibold">Top Vendors</h3>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                {["Vendor","Revenue","Orders","Growth"].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-[#6b7280] uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TOP_VENDORS.map(v => (
                <tr key={v.name} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                  <td className="px-5 py-3 text-white text-sm font-medium">{v.name}</td>
                  <td className="px-5 py-3 text-white text-sm font-semibold">{v.revenue}</td>
                  <td className="px-5 py-3 text-[#9ca3af] text-sm">{v.orders}</td>
                  <td className="px-5 py-3 text-emerald-400 text-sm font-semibold">{v.growth}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-5">
          <h3 className="text-white font-semibold mb-5">Revenue by Category</h3>
          <div className="space-y-3">
            {TOP_CATS.map(c => (
              <div key={c.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[#9ca3af] text-sm">{c.name}</span>
                  <span className="text-white text-sm font-semibold">{c.pct}%</span>
                </div>
                <div className="h-2 bg-[#2a2a2a] rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${c.pct}%`, backgroundColor: c.color }}/>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
