"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Stats = { favoriteProducts: number; reviews: number };
type Review = { id: string; rating: number; title: string | null; body: string; status: string; createdAt: string };

const IcoHeart  = () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>;
const IcoStar   = () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/></svg>;

const STATUS_STYLE: Record<string, string> = {
  PENDING:  "bg-amber-500/15 text-amber-400",
  APPROVED: "bg-emerald-500/15 text-emerald-400",
  REJECTED: "bg-red-500/15 text-red-400",
};

export default function UserDashboardPage() {
  const [name, setName] = useState("");
  const [stats, setStats] = useState<Stats>({ favoriteProducts: 0, reviews: 0 });
  const [recentReviews, setRecentReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/auth/me").then(r => r.json()),
      fetch("/api/user/favorites/products").then(r => r.json()),
      fetch("/api/user/reviews").then(r => r.json()),
    ]).then(([me, fp, rv]) => {
      setName(me?.user?.name ?? "");
      setStats({
        favoriteProducts: fp?.favorites?.length ?? 0,
        reviews:          rv?.reviews?.length ?? 0,
      });
      setRecentReviews((rv?.reviews ?? []).slice(0, 3));
    }).finally(() => setLoading(false));
  }, []);

  const statCards = [
    { label: "Favourite Products", value: stats.favoriteProducts, icon: IcoHeart, href: "/user-dashboard/favorites", color: "from-pink-600 to-rose-500" },
    { label: "My Reviews",         value: stats.reviews,          icon: IcoStar,  href: "/user-dashboard/reviews",   color: "from-amber-500 to-yellow-400" },
  ];

  if (loading) return (
    <div className="flex items-center justify-center flex-1">
      <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="p-6 lg:p-8 space-y-8">
      <div>
        <h1 className="text-white text-2xl font-bold">Welcome back{name ? `, ${name.split(" ")[0]}` : ""}! 👋</h1>
        <p className="text-[#6b7280] text-sm mt-1">Here&apos;s a summary of your activity.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {statCards.map(({ label, value, icon: Icon, href, color }) => (
          <Link key={label} href={href}
            className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all group">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white mb-4 group-hover:scale-105 transition-transform`}>
              <Icon />
            </div>
            <p className="text-3xl font-bold text-white">{value}</p>
            <p className="text-[#6b7280] text-sm mt-1">{label}</p>
          </Link>
        ))}
      </div>

      <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white font-semibold">Recent Reviews</h2>
          <Link href="/user-dashboard/reviews" className="text-[#1B6FEB] text-sm hover:underline">View all</Link>
        </div>
        {recentReviews.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-[#6b7280] text-sm mb-3">You haven&apos;t submitted any reviews yet.</p>
            <Link href="/user-dashboard/reviews"
              className="inline-block bg-[#1B6FEB] text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-[#1557D0] transition-colors">
              Write Your First Review
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recentReviews.map(r => (
              <div key={r.id} className="flex items-start justify-between gap-4 p-4 bg-[#242424] rounded-xl">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg key={i} className={`w-3.5 h-3.5 ${i < r.rating ? "text-amber-400" : "text-white/10"}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                      </svg>
                    ))}
                  </div>
                  {r.title && <p className="text-white text-sm font-medium truncate">{r.title}</p>}
                  <p className="text-[#9ca3af] text-xs line-clamp-2 mt-0.5">{r.body}</p>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${STATUS_STYLE[r.status] ?? ""}`}>{r.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Link href="/user-dashboard/favorites"
          className="bg-gradient-to-br from-pink-600/20 to-rose-500/10 border border-pink-500/20 rounded-2xl p-6 hover:border-pink-500/40 transition-all group">
          <p className="text-white font-semibold mb-1">Browse Favourites</p>
          <p className="text-[#9ca3af] text-sm">View your saved favourite products in one place.</p>
        </Link>
        <Link href="/user-dashboard/reviews"
          className="bg-gradient-to-br from-[#1B6FEB]/20 to-indigo-500/10 border border-[#1B6FEB]/20 rounded-2xl p-6 hover:border-[#1B6FEB]/40 transition-all group">
          <p className="text-white font-semibold mb-1">Share Your Experience</p>
          <p className="text-[#9ca3af] text-sm">Write a review and help others discover great products.</p>
        </Link>
      </div>
    </div>
  );
}
