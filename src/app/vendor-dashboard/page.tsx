"use client";

import { useState, useEffect } from "react";
import StatsCard from "@/components/dashboard/StatsCard";
import ReferralBarChart from "@/components/dashboard/ReferralBarChart";
import ClickAnalyticsTable from "@/components/dashboard/ClickAnalyticsTable";

const IcoClick = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
  </svg>
);
const IcoBox = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 10V11" />
  </svg>
);
const IcoTrend = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

type DashboardStats = {
  totalClicks: number;
  clicksThisMonth: number;
  clicksLastMonth: number;
  clicksPct: number;
  totalProducts: number;
  productsThisMonth: number;
  productsLastMonth: number;
  productsPct: number;
  avgClickRate: string;
  monthlyClicks: { month: string; clicks: number; products?: { title: string; clicks: number }[] }[];
  topProducts: { id: string; title: string; categoryName: string; clicks: number; ctr: string }[];
};

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/vendor/dashboard")
      .then((r) => r.json())
      .then((data) => setStats(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 lg:p-8 space-y-8">
      <div>
        <h1 className="text-white text-2xl font-bold">Dashboard</h1>
        <p className="text-[#6b7280] text-sm mt-1">Welcome back. Here&apos;s what&apos;s happening with your store.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard
          label="Total Clicks"
          value={loading ? "—" : (stats?.totalClicks ?? 0).toLocaleString()}
          change={loading ? "—" : `${(stats?.clicksPct ?? 0) > 0 ? "+" : ""}${(stats?.clicksPct ?? 0).toFixed(1)}%`}
          positive={(stats?.clicksPct ?? 0) >= 0}
          icon={<IcoClick />}
        />
        <StatsCard
          label="Products This Month"
          value={loading ? "—" : (stats?.productsThisMonth ?? 0).toString()}
          change={loading ? "—" : `${(stats?.productsPct ?? 0) > 0 ? "+" : ""}${(stats?.productsPct ?? 0).toFixed(1)}%`}
          positive={(stats?.productsPct ?? 0) >= 0}
          icon={<IcoBox />}
        />
        <StatsCard
          label="Avg Click Rate"
          value={loading ? "—" : `${stats?.avgClickRate ?? "0.0"}`}
          change={loading ? "—" : `${stats?.clicksThisMonth ?? 0} this month`}
          positive={true}
          icon={<IcoTrend />}
        />
      </div>

      <ReferralBarChart data={stats?.monthlyClicks ?? []} loading={loading} />
      <ClickAnalyticsTable rows={stats?.topProducts ?? []} loading={loading} />
    </div>
  );
}
