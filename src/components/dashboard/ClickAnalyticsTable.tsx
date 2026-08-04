type Row = { id: string; title: string; categoryName: string; clicks: number; ctr: string };
interface Props { rows: Row[]; loading?: boolean }

export default function ClickAnalyticsTable({ rows, loading }: Props) {
  return (
    <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl overflow-hidden">
      <div className="px-6 py-5 border-b border-white/10">
        <h3 className="text-white font-semibold text-base">Product Click Analytics</h3>
        <p className="text-[#6b7280] text-sm mt-0.5">Click performance per product this month</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-7 h-7 border-2 border-[#1B6FEB] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : rows.length === 0 ? (
        <div className="px-6 py-12 text-center text-[#6b7280] text-sm">No click data yet this month.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-[#6b7280] uppercase tracking-wide">Product</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-[#6b7280] uppercase tracking-wide">Category</th>
                <th className="text-right px-6 py-3.5 text-xs font-semibold text-[#6b7280] uppercase tracking-wide">Clicks</th>
                <th className="text-right px-6 py-3.5 text-xs font-semibold text-[#6b7280] uppercase tracking-wide">CTR</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                  <td className="px-6 py-4 text-white text-sm font-medium">{row.title}</td>
                  <td className="px-6 py-4">
                    <span className="bg-[#1B6FEB]/10 text-[#1B6FEB] text-xs font-semibold px-2.5 py-1 rounded-full">{row.categoryName}</span>
                  </td>
                  <td className="px-6 py-4 text-right text-white text-sm font-medium">{row.clicks.toLocaleString()}</td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-emerald-400 text-sm font-semibold">{row.ctr}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
