"use client";

import { useState, useEffect } from "react";
import { Star } from "lucide-react";

type Review = {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: { name: string; email: string };
};

type Dist = { star: number; count: number };

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i <= rating ? "fill-amber-400 text-amber-400" : "fill-white/10 text-white/10"}`}
        />
      ))}
    </div>
  );
}

function Initials({ name }: { name: string }) {
  const letters = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  return (
    <div className="w-9 h-9 rounded-full bg-[#1B6FEB]/20 flex items-center justify-center text-[#1B6FEB] text-xs font-black flex-shrink-0">
      {letters}
    </div>
  );
}

export default function VendorReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [avg, setAvg] = useState<number | null>(null);
  const [total, setTotal] = useState(0);
  const [dist, setDist] = useState<Dist[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/vendor/reviews")
      .then((r) => r.json())
      .then((d) => {
        setReviews(d.reviews ?? []);
        setAvg(d.avg ?? null);
        setTotal(d.total ?? 0);
        setDist(d.dist ?? []);
      })
      .finally(() => setLoading(false));
  }, []);

  const displayed = filter ? reviews.filter((r) => r.rating === filter) : reviews;

  return (
    <div className="p-6 lg:p-8 space-y-6 w-full">
      <div>
        <h1 className="text-white text-2xl font-bold">Reviews</h1>
        <p className="text-[#6b7280] text-sm mt-1">Customer feedback about your shop</p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-5 animate-pulse">
              <div className="flex gap-3">
                <div className="w-9 h-9 rounded-full bg-white/5" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-white/5 rounded w-32" />
                  <div className="h-3 bg-white/5 rounded w-24" />
                  <div className="h-3 bg-white/5 rounded w-full mt-2" />
                  <div className="h-3 bg-white/5 rounded w-3/4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : total === 0 ? (
        <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-12 text-center">
          <Star className="w-10 h-10 text-white/20 mx-auto mb-3" />
          <p className="text-white font-semibold text-lg mb-1">No reviews yet</p>
          <p className="text-[#6b7280] text-sm">Your customers&apos; reviews will appear here once they start reviewing your shop.</p>
        </div>
      ) : (
        <>
          {/* Summary card */}
          <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 flex flex-col sm:flex-row gap-6 max-w-2xl">
            <div className="flex flex-col items-center justify-center min-w-[110px]">
              <span className="text-5xl font-black text-white">{avg!.toFixed(1)}</span>
              <div className="mt-2">
                <Stars rating={Math.round(avg!)} />
              </div>
              <span className="text-[#6b7280] text-xs mt-1.5">{total} {total === 1 ? "review" : "reviews"}</span>
            </div>
            <div className="flex-1 space-y-2">
              {dist.map(({ star, count }) => {
                const pct = total ? Math.round((count / total) * 100) : 0;
                return (
                  <button
                    key={star}
                    onClick={() => setFilter(filter === star ? null : star)}
                    className={`w-full flex items-center gap-3 group transition-opacity ${filter && filter !== star ? "opacity-40" : ""}`}
                  >
                    <span className="text-xs text-[#9ca3af] w-4 text-right">{star}</span>
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 flex-shrink-0" />
                    <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-400 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-xs text-[#6b7280] w-8 text-right">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Filter label */}
          {filter && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-[#9ca3af]">Showing {filter}-star reviews</span>
              <button onClick={() => setFilter(null)} className="text-[#1B6FEB] hover:underline text-xs font-semibold">
                Clear filter
              </button>
            </div>
          )}

          {/* Review list */}
          <div className="space-y-3 max-w-3xl">
            {displayed.length === 0 ? (
              <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-8 text-center text-[#6b7280] text-sm">
                No {filter}-star reviews.
              </div>
            ) : (
              displayed.map((r) => (
                <div key={r.id} className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-5">
                  <div className="flex items-start gap-3">
                    <Initials name={r.user.name} />
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-white text-sm font-semibold">{r.user.name}</span>
                        <Stars rating={r.rating} />
                        <span className="text-[#6b7280] text-xs ml-auto">
                          {new Date(r.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                        </span>
                      </div>
                      <p className="text-[#d1d5db] text-sm leading-relaxed">{r.comment}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}
