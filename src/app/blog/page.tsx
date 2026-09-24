"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

type Post = {
  id: string; title: string; slug: string; excerpt: string | null; category: string;
  author: string; featuredImage: string | null; isFeatured: boolean; readTime: number | null; createdAt: string;
};

const CATS = ["All", "General", "Fashion", "Lifestyle", "Wellness", "Business", "Sustainability", "Tech", "Food"];

function timeAgo(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

function BlogInner() {
  const searchParams = useSearchParams();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCat, setActiveCat] = useState(() => searchParams.get("category") ?? "All");
  const [cms, setCms] = useState<Record<string, string>>({});
  const c = (section: string, key: string, def: string) => cms[`${section}.${key}`] ?? def;

  useEffect(() => {
    fetch("/api/blogs")
      .then(r => r.json())
      .then(d => setPosts(d.blogs ?? []))
      .finally(() => setLoading(false));
    fetch("/api/cms/blog").then(r => r.json()).then(d => setCms(d.content ?? {})).catch(() => {});
  }, []);

  const filtered = activeCat === "All" ? posts : posts.filter(p => p.category === activeCat);

  const visibleCats = CATS.filter(c => c === "All" || posts.some(p => p.category === c));

  return (
    <div className="bg-white">

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#070C1B] via-[#0A1E4A] to-[#1B3A8A] py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-[#60A5FA] text-xs font-black uppercase tracking-[0.25em]">{c("hero", "label", "Stories & Insights")}</span>
          <h1 className="font-display font-black text-white text-5xl lg:text-7xl mt-4 mb-5 leading-tight">
            {c("hero", "heading", "The LDS Blog")}
          </h1>
          <p className="text-white/55 text-lg max-w-md mx-auto">
            {c("hero", "subtext", "Insights, stories, and guides from our community of intentional shoppers and purpose-driven vendors.")}
          </p>
        </div>
      </section>

      {loading ? (
        <div className="flex items-center justify-center py-32">
          <div className="w-10 h-10 border-2 border-[#1B6FEB] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-32">
          <p className="text-6xl mb-4">📝</p>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No posts yet</h2>
          <p className="text-gray-400">Check back soon for stories and insights.</p>
        </div>
      ) : (
        <>
          {/* Category filter */}
          {visibleCats.length > 1 && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 mb-10">
              <div className="flex flex-wrap gap-2">
                {visibleCats.map(c => (
                  <button key={c} onClick={() => setActiveCat(c)}
                    className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-200
                      ${activeCat === c ? "bg-[#1B6FEB] text-white shadow-lg shadow-blue-200" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Posts grid */}
          <section className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 ${visibleCats.length > 1 ? "" : "pt-16"}`}>
            {filtered.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-5xl mb-4">📭</p>
                <p className="text-gray-400 font-semibold">No posts in this category yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
                {filtered.map(p => (
                  <Link href={`/blog/${p.slug}`} key={p.id}
                    className="group bg-white rounded-3xl overflow-hidden shadow-md border border-gray-100 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col">
                    <div className="relative h-52 overflow-hidden bg-gradient-to-br from-[#1B6FEB]/10 to-[#1B6FEB]/5">
                      {p.featuredImage ? (
                        <Image src={p.featuredImage} fill alt={p.title}
                          className="object-cover group-hover:scale-110 transition-transform duration-700"
                          sizes="(max-width:640px)100vw,(max-width:1024px)50vw,33vw" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-5xl opacity-20">📝</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                      <div className="absolute top-4 left-4">
                        <span className="bg-white/90 backdrop-blur-sm text-[#1B6FEB] text-[10px] font-black px-3 py-1 rounded-full">{p.category}</span>
                      </div>
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="font-display font-black text-gray-900 text-lg leading-snug mb-3 group-hover:text-[#1B6FEB] transition-colors line-clamp-2">{p.title}</h3>
                      {p.excerpt && <p className="text-gray-400 text-sm leading-relaxed mb-5 flex-1 line-clamp-3">{p.excerpt}</p>}
                      <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                        <div className="w-8 h-8 rounded-lg bg-[#1B6FEB]/10 text-[#1B6FEB] flex items-center justify-center font-black text-sm flex-shrink-0">
                          {p.author.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-gray-700 font-bold text-xs truncate">{p.author}</p>
                          <p className="text-gray-400 text-[10px]">{timeAgo(p.createdAt)}{p.readTime ? ` · ${p.readTime} min` : ""}</p>
                        </div>
                        <span className="text-[#1B6FEB] text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">Read →</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}

export default function BlogPage() {
  return (
    <Suspense>
      <BlogInner />
    </Suspense>
  );
}
