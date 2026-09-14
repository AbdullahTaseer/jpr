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

function initials(title: string) {
  const words = title.trim().split(/\s+/).filter(Boolean);
  if (!words.length) return "?";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
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

  const tooltipLeftPct = active !== null
    ? ((pad.left + active * barGap + barGap / 2) / W) * 100
    : 50;

  return (
    <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6">
      <div className="mb-6">
        <h3 className="text-white font-semibold text-base">Referral Clicks Over Time</h3>
        <p className="text-[#6b7280] text-xs mt-1">Hover a month bar to see products</p>
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
        <div
          className="relative w-full"
          onMouseLeave={() => setActive(null)}
        >
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
                    onMouseEnter={() => setActive(i)}
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
              className="absolute z-20 w-[300px] max-w-[calc(100%-1rem)] -translate-x-1/2 pointer-events-none"
              style={{
                left: `min(max(${tooltipLeftPct}%, 150px), calc(100% - 150px))`,
                top: 4,
              }}
            >
              <div className="bg-[#0b0b0b]/95 backdrop-blur-md border border-white/15 rounded-2xl shadow-2xl shadow-black/60 p-3.5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-white text-sm font-semibold">{selected.month}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-[#1B6FEB]/20 text-[#60A5FA] px-2 py-1 rounded-full">
                    {selected.clicks} clicks
                  </span>
                </div>

                {products.length === 0 ? (
                  <p className="text-[#6b7280] text-xs py-2">No product clicks this month.</p>
                ) : (
                  <div className="flex flex-wrap gap-2 max-h-[150px] overflow-y-auto">
                    {products.map((p, idx) => (
                      <div
                        key={`${p.title}-${idx}`}
                        className="inline-flex items-center gap-2 max-w-full rounded-full border border-white/10 bg-white/[0.04] pl-1.5 pr-2.5 py-1"
                      >
                        <span className="w-6 h-6 rounded-full bg-[#1B6FEB]/25 text-[#60A5FA] text-[9px] font-black flex items-center justify-center shrink-0">
                          {initials(p.title)}
                        </span>
                        <span className="text-[#e5e7eb] text-[11px] font-medium truncate max-w-[150px]">
                          {p.title}
                        </span>
                        <span className="text-[#1B6FEB] text-[10px] font-black tabular-nums shrink-0">
                          {p.clicks}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
