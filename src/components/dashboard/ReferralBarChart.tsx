"use client";

type DataPoint = { month: string; clicks: number };
interface Props { data?: DataPoint[]; loading?: boolean }

function scaleMax(max: number): number {
  if (max <= 0) return 4;
  if (max <= 10) return Math.max(4, Math.ceil(max / 4) * 4);
  if (max <= 50) return Math.ceil(max / 10) * 10;
  if (max <= 100) return Math.ceil(max / 20) * 20;
  if (max <= 1000) return Math.ceil(max / 100) * 100;
  return Math.ceil(max / 1000) * 1000;
}

function formatTick(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k`;
  return Number.isInteger(n) ? String(n) : n.toFixed(1);
}

export default function ReferralBarChart({ data = [], loading }: Props) {
  const W = 700;
  const H = 220;
  const pad = { top: 20, right: 20, bottom: 44, left: 54 };
  const chartW = W - pad.left - pad.right;
  const chartH = H - pad.top - pad.bottom;

  const hasData = data.length > 0;
  const max = hasData ? Math.max(...data.map(d => d.clicks)) : 0;
  const ceil = scaleMax(max);
  const ticks = [0, ceil * 0.25, ceil * 0.5, ceil * 0.75, ceil];
  const barW = hasData ? (chartW / data.length) * 0.5 : 40;
  const barGap = hasData ? chartW / data.length : 80;

  return (
    <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6">
      <h3 className="text-white font-semibold text-base mb-6">Referral Clicks Over Time</h3>

      {loading ? (
        <div className="flex items-center justify-center h-[220px]">
          <div className="w-7 h-7 border-2 border-[#1B6FEB] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : !hasData ? (
        <div className="flex items-center justify-center h-[220px] text-[#6b7280] text-sm">
          No click data available yet.
        </div>
      ) : (
        <div className="w-full overflow-x-auto">
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto min-w-[360px]">
            {ticks.map((tick) => {
              const y = pad.top + chartH - (tick / ceil) * chartH;
              return (
                <g key={tick}>
                  <line x1={pad.left} y1={y} x2={W - pad.right} y2={y} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                  <text x={pad.left - 8} y={y + 4} textAnchor="end" fill="#6b7280" fontSize="11" fontFamily="Inter, sans-serif">
                    {formatTick(tick)}
                  </text>
                </g>
              );
            })}
            {data.map((d, i) => {
              const barH = ceil > 0 ? (d.clicks / ceil) * chartH : 0;
              const x = pad.left + i * barGap + barGap / 2 - barW / 2;
              const y = pad.top + chartH - barH;
              return (
                <g key={d.month}>
                  {d.clicks > 0 && (
                    <rect x={x} y={pad.top + chartH} width={barW} height={0} fill="#1B6FEB" rx="5" className="transition-all duration-700">
                      <animate attributeName="height" from="0" to={barH} dur="0.6s" begin={`${i * 0.08}s`} fill="freeze" />
                      <animate attributeName="y" from={pad.top + chartH} to={y} dur="0.6s" begin={`${i * 0.08}s`} fill="freeze" />
                    </rect>
                  )}
                  {d.clicks > 0 && (
                    <text x={x + barW / 2} y={Math.max(y - 6, 12)} textAnchor="middle" fill="#9ca3af" fontSize="10" fontFamily="Inter, sans-serif">
                      {d.clicks}
                    </text>
                  )}
                  <text x={x + barW / 2} y={H - 8} textAnchor="middle" fill="#6b7280" fontSize="11" fontFamily="Inter, sans-serif">
                    {d.month}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      )}
    </div>
  );
};