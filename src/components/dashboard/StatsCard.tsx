interface StatsCardProps {
  label: string;
  value: string;
  change: string;
  positive: boolean;
  icon: React.ReactNode;
}

export default function StatsCard({ label, value, change, positive, icon }: StatsCardProps) {
  return (
    <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 flex items-start gap-4">
      <div className="w-12 h-12 rounded-xl bg-[#1B6FEB]/15 flex items-center justify-center text-[#1B6FEB] shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[#6b7280] text-xs font-medium uppercase tracking-wide mb-1">{label}</p>
        <p className="text-white text-2xl font-bold leading-none mb-2">{value}</p>
        <p className={`text-xs font-medium ${positive ? "text-emerald-400" : "text-red-400"}`}>
          {change} <span className="text-[#6b7280] font-normal">vs last month</span>
        </p>
      </div>
    </div>
  );
}
