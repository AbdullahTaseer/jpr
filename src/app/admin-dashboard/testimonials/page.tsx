"use client";

import { useState, useEffect } from "react";

const IcoCheck = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>;
const IcoX     = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>;
const IcoTrash = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>;

type Review = {
  id: string;
  rating: number;
  title: string | null;
  body: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  user: { name: string; email: string };
};

const STATUS_STYLE: Record<string, string> = {
  PENDING:  "bg-amber-500/15 text-amber-400",
  APPROVED: "bg-emerald-500/15 text-emerald-400",
  REJECTED: "bg-red-500/15 text-red-400",
};

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [filter, setFilter] = useState<"ALL" | "PENDING" | "APPROVED" | "REJECTED">("ALL");

  useEffect(() => {
    fetch("/api/admin/reviews")
      .then(r => r.json())
      .then(d => setReviews(d.reviews ?? []))
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id: string, status: string) => {
    setUpdating(id);
    const res = await fetch(`/api/admin/reviews/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) setReviews(prev => prev.map(r => r.id === id ? { ...r, status: status as Review["status"] } : r));
    setUpdating(null);
  };

  const deleteReview = async (id: string) => {
    setUpdating(id);
    const res = await fetch(`/api/admin/reviews/${id}`, { method: "DELETE" });
    if (res.ok) setReviews(prev => prev.filter(r => r.id !== id));
    setUpdating(null);
  };

  const filtered = filter === "ALL" ? reviews : reviews.filter(r => r.status === filter);
  const counts = {
    ALL: reviews.length,
    PENDING: reviews.filter(r => r.status === "PENDING").length,
    APPROVED: reviews.filter(r => r.status === "APPROVED").length,
    REJECTED: reviews.filter(r => r.status === "REJECTED").length,
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-white text-2xl font-bold">Reviews</h1>
        <p className="text-[#6b7280] text-sm mt-1">Moderate user-submitted reviews</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 bg-[#1a1a1a] border border-white/10 p-1 rounded-xl w-fit">
        {(["ALL", "PENDING", "APPROVED", "REJECTED"] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${filter === f ? "bg-[#1B6FEB] text-white" : "text-[#6b7280] hover:text-white"}`}>
            {f === "ALL" ? "All" : f.charAt(0) + f.slice(1).toLowerCase()} ({counts[f]})
          </button>
        ))}
      </div>

      <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-6 h-6 border-2 border-[#1B6FEB] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  {["User", "Rating", "Review", "Status", "Date", "Actions"].map(h => (
                    <th key={h} className="text-left px-5 py-4 text-xs font-semibold text-[#6b7280] uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={6} className="px-5 py-12 text-center text-[#6b7280] text-sm">No reviews found.</td></tr>
                ) : filtered.map(r => (
                  <tr key={r.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-4">
                      <p className="text-white text-sm font-medium whitespace-nowrap">{r.user.name}</p>
                      <p className="text-[#6b7280] text-xs">{r.user.email}</p>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-0.5">
                        {[1,2,3,4,5].map(n => (
                          <svg key={n} className={`w-3.5 h-3.5 ${n <= r.rating ? "text-amber-400" : "text-[#3a3a3a]"}`} viewBox="0 0 24 24" fill="currentColor">
                            <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
                          </svg>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-4 max-w-[260px]">
                      {r.title && <p className="text-white text-xs font-semibold mb-0.5 line-clamp-1">{r.title}</p>}
                      <p className="text-[#9ca3af] text-xs line-clamp-2">{r.body}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_STYLE[r.status]}`}>{r.status}</span>
                    </td>
                    <td className="px-5 py-4 text-[#6b7280] text-xs whitespace-nowrap">
                      {new Date(r.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5">
                        {r.status !== "APPROVED" && (
                          <button onClick={() => updateStatus(r.id, "APPROVED")} disabled={updating === r.id}
                            title="Approve"
                            className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors disabled:opacity-40">
                            <IcoCheck />
                          </button>
                        )}
                        {r.status !== "REJECTED" && (
                          <button onClick={() => updateStatus(r.id, "REJECTED")} disabled={updating === r.id}
                            title="Reject"
                            className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 transition-colors disabled:opacity-40">
                            <IcoX />
                          </button>
                        )}
                        <button onClick={() => deleteReview(r.id)} disabled={updating === r.id}
                          title="Delete"
                          className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-40">
                          <IcoTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
