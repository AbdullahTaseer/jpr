"use client";

import { useEffect, useState } from "react";

type Review = { id: string; rating: number; title: string | null; body: string; status: string; createdAt: string };

const STATUS_STYLE: Record<string, string> = {
  PENDING:  "bg-amber-500/15 text-amber-400",
  APPROVED: "bg-emerald-500/15 text-emerald-400",
  REJECTED: "bg-red-500/15 text-red-400",
};
const STATUS_LABEL: Record<string, string> = { PENDING: "Under Review", APPROVED: "Published", REJECTED: "Not Approved" };

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <button key={i} type="button"
          onClick={() => onChange(i + 1)}
          onMouseEnter={() => setHover(i + 1)}
          onMouseLeave={() => setHover(0)}
          className="transition-transform hover:scale-110">
          <svg className={`w-8 h-8 ${i < (hover || value) ? "text-amber-400" : "text-white/15"}`} fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
          </svg>
        </button>
      ))}
    </div>
  );
}

const inp = "w-full bg-[#242424] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-[#4b5563] focus:outline-none focus:border-[#1B6FEB]/60 focus:ring-1 focus:ring-[#1B6FEB]/30 transition-colors";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ rating: 5, title: "", body: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const load = () => {
    fetch("/api/user/reviews").then(r => r.json()).then(d => setReviews(d.reviews ?? [])).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/user/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit");
      setReviews(prev => [data.review, ...prev]);
      setForm({ rating: 5, title: "", body: "" });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-white text-2xl font-bold">My Reviews</h1>
        <p className="text-[#6b7280] text-sm mt-1">Share your experience with the platform.</p>
      </div>

      {/* Submit form */}
      <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6">
        <h2 className="text-white font-semibold mb-5">Write a Review</h2>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-white text-sm font-semibold">Your Rating</label>
            <StarPicker value={form.rating} onChange={v => setForm(p => ({ ...p, rating: v }))} />
          </div>
          <div className="space-y-1.5">
            <label className="text-white text-sm font-semibold">Title <span className="text-[#6b7280] font-normal">(optional)</span></label>
            <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Summarise your experience..." className={inp} />
          </div>
          <div className="space-y-1.5">
            <label className="text-white text-sm font-semibold">Your Review <span className="text-red-400">*</span></label>
            <textarea value={form.body} onChange={e => setForm(p => ({ ...p, body: e.target.value }))} required rows={4}
              placeholder="Tell us what you think about Latter Day Shopping..."
              className={inp + " resize-none"} />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          {success && <p className="text-emerald-400 text-sm">✓ Review submitted! It will appear once approved.</p>}
          <div className="flex justify-end">
            <button type="submit" disabled={submitting || !form.body.trim()}
              className="bg-[#1B6FEB] text-white font-semibold px-8 py-2.5 rounded-xl hover:bg-[#1557D0] transition-colors disabled:opacity-50 flex items-center gap-2">
              {submitting && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              {submitting ? "Submitting…" : "Submit Review"}
            </button>
          </div>
        </form>
      </div>

      {/* Reviews list */}
      <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6">
        <h2 className="text-white font-semibold mb-5">Submitted Reviews</h2>
        {loading ? (
          <div className="flex justify-center py-10"><div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" /></div>
        ) : reviews.length === 0 ? (
          <p className="text-[#6b7280] text-sm text-center py-10">No reviews yet. Be the first to share your experience!</p>
        ) : (
          <div className="space-y-4">
            {reviews.map(r => (
              <div key={r.id} className="bg-[#242424] rounded-xl p-5 space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex gap-0.5 mb-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg key={i} className={`w-4 h-4 ${i < r.rating ? "text-amber-400" : "text-white/15"}`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                        </svg>
                      ))}
                    </div>
                    {r.title && <p className="text-white font-semibold text-sm">{r.title}</p>}
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${STATUS_STYLE[r.status]}`}>
                    {STATUS_LABEL[r.status] ?? r.status}
                  </span>
                </div>
                <p className="text-[#9ca3af] text-sm leading-relaxed">{r.body}</p>
                <p className="text-[#4b5563] text-xs">{new Date(r.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
