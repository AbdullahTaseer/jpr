"use client";

import { useEffect, useState } from "react";
import StatsCard from "@/components/dashboard/StatsCard";
import ReferralBarChart from "@/components/dashboard/ReferralBarChart";
import Link from "next/link";

const IcoVendors  = () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>;
const IcoProducts = () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 10V11"/></svg>;
const IcoClicks   = () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>;
const IcoPending  = () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>;

type Stats = {
    totalVendors: number; newVendorsThisMonth: number; vendorsPct: number;
    totalProducts: number; productsThisMonth: number; productsPct: number;
    totalClicks: number; clicksThisMonth: number; clicksPct: number;
    pendingVendors: number;
    monthlyClicks: { month: string; clicks: number; products?: { title: string; clicks: number }[] }[];
};

export default function AdminDashboardPage() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/admin/dashboard")
            .then(r => r.json())
            .then(setStats)
            .finally(() => setLoading(false));
    }, []);

    const pctLabel = (pct: number) => `${pct >= 0 ? "+" : ""}${pct}%`;

    return (
        <div className="p-6 lg:p-8 space-y-8">
            <div>
                <h1 className="text-white text-2xl font-bold">Admin Dashboard</h1>
                <p className="text-[#6b7280] text-sm mt-1">Platform-wide overview — all vendors &amp; products</p>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-16">
                    <div className="w-7 h-7 border-2 border-[#1B6FEB] border-t-transparent rounded-full animate-spin" />
                </div>
            ) : stats ? (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatsCard
                            label="Total Vendors"
                            value={stats.totalVendors.toLocaleString()}
                            change={`+${stats.newVendorsThisMonth} new`}
                            positive={stats.newVendorsThisMonth >= 0}
                            icon={<IcoVendors />}
                        />
                        <StatsCard
                            label="Total Products"
                            value={stats.totalProducts.toLocaleString()}
                            change={pctLabel(stats.productsPct)}
                            positive={stats.productsPct >= 0}
                            icon={<IcoProducts />}
                        />
                        <StatsCard
                            label="Total Clicks"
                            value={stats.totalClicks.toLocaleString()}
                            change={pctLabel(stats.clicksPct)}
                            positive={stats.clicksPct >= 0}
                            icon={<IcoClicks />}
                        />
                        <StatsCard
                            label="Pending Approvals"
                            value={stats.pendingVendors.toLocaleString()}
                            change={stats.pendingVendors > 0 ? `${stats.pendingVendors} need review` : "None pending"}
                            positive={stats.pendingVendors === 0}
                            icon={<IcoPending />}
                        />
                    </div>

                    <ReferralBarChart data={stats.monthlyClicks} loading={false} />

                    {stats.pendingVendors > 0 && (
                        <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-5 flex items-center justify-between gap-4">
                            <div>
                                <p className="text-amber-400 font-semibold text-sm">
                                    {stats.pendingVendors} vendor{stats.pendingVendors > 1 ? "s" : ""} waiting for approval
                                </p>
                                <p className="text-[#6b7280] text-xs mt-0.5">Review and approve vendor applications to let them start selling.</p>
                            </div>
                            <Link href="/admin-dashboard/vendors" className="shrink-0 px-4 py-2 bg-amber-500 text-black text-sm font-semibold rounded-xl hover:bg-amber-400 transition-colors">
                                Review Now
                            </Link>
                        </div>
                    )}
                </>
            ) : (
                <p className="text-[#6b7280] text-sm">Failed to load stats.</p>
            )}
        </div>
    );
}
