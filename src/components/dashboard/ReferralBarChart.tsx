"use client";

import { useState } from "react";

type ProductClick = { title: string; clicks: number };
type DataPoint = { month: string; clicks: number; products?: ProductClick[] };
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
  const [active, setActive] = useState<number | null>(null);

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

  const selected = active !== null ? data[active] : null;
  const products = selected?.products ?? [];

  // Position tooltip near the selected bar (SVG coords → % of chart)
  const tooltipLeftPct = active !== null
    ? ((pad.left + active * barGap + barGap / 2) / W) * 100
    : 50;

  return (
    <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6">
      <div className="mb-6">
        <h3 className="text-white font-semibold text-base">Referral Clicks Over Time</h3>
        <p className="text-[#6b7280] text-xs mt-1">Click a month bar to see product names</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-[220px]">
          <div className="w-7 h-7 border-2 border-[#1B6FEB] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : !hasData ? (
        <div className="flex items-center justify-center h-[220px] text-[#6b7280] text-sm">
          No click data available yet.
        </div>
      ) : (
        <div className="relative w-full overflow-visible">
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
                const y = pad.top + chartH - Math.max(barH, d.clicks > 0 ? 4 : 0);
                const isActive = active === i;
                return (
                  <g
                    key={`${d.month}-${i}`}
                    className="cursor-pointer"
                    onClick={() => setActive(prev => (prev === i ? null : i))}
                  >
                    <rect
                      x={pad.left + i * barGap}
                      y={pad.top}
                      width={barGap}
                      height={chartH}
                      fill="transparent"
                    />
                    <rect
                      x={x}
                      y={d.clicks > 0 ? y : pad.top + chartH - 3}
                      width={barW}
                      height={d.clicks > 0 ? Math.max(barH, 4) : 3}
                      fill={isActive ? "#60A5FA" : "#1B6FEB"}
                      opacity={d.clicks > 0 ? 1 : 0.25}
                      rx="5"
                    />
                    {d.clicks > 0 && (
                      <text
                        x={x + barW / 2}
                        y={Math.max(y - 6, 12)}
                        textAnchor="middle"
                        fill={isActive ? "#ffffff" : "#9ca3af"}
                        fontSize="10"
                        fontFamily="Inter, sans-serif"
                      >
                        {d.clicks}
                      </text>
                    )}
                    <text
                      x={x + barW / 2}
                      y={H - 8}
                      textAnchor="middle"
                      fill={isActive ? "#ffffff" : "#6b7280"}
                      fontSize="11"
                      fontFamily="Inter, sans-serif"
                      fontWeight={isActive ? 700 : 400}
                    >
                      {d.month}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {selected && (
            <div
              className="absolute z-20 w-[260px] max-w-[calc(100%-1rem)] -translate-x-1/2 pointer-events-auto"
              style={{
                left: `min(max(${tooltipLeftPct}%, 130px), calc(100% - 130px))`,
                top: 8,
              }}
            >
              <div className="bg-[#0d0d0d] border border-[#1B6FEB]/40 rounded-xl shadow-2xl shadow-black/50 p-3.5">
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <div>
                    <p className="text-white text-sm font-semibold">{selected.month}</p>
                    <p className="text-[#6b7280] text-[11px]">
                      {selected.clicks} click{selected.clicks === 1 ? "" : "s"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActive(null)}
                    className="text-[#6b7280] hover:text-white text-lg leading-none px-1"
                    aria-label="Close"
                  >
                    ×
                  </button>
                </div>
                {products.length === 0 ? (
                  <p className="text-[#6b7280] text-xs">No product clicks this month.</p>
                ) : (
                  <ul className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                    {products.map((p, idx) => (
                      <li key={`${p.title}-${idx}`} className="flex items-start justify-between gap-3">
                        <span className="text-[#e5e7eb] text-xs leading-snug line-clamp-2">{p.title}</span>
                        <span className="shrink-0 text-[#60A5FA] text-xs font-bold tabular-nums">{p.clicks}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
