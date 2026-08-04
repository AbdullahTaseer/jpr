"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

type Post = {
  id: string; title: string; slug: string; excerpt: string | null; category: string;
  author: string; featuredImage: string | null; isFeatured: boolean; readTime: number | null; createdAt: string;
};

const CATS = ["All", "General", "Fashion", "Lifestyle", "Wellness", "Business", "Sustainability", "Tech", "Food"];

function timeAgo(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCat, setActiveCat] = useState("All");
  const [cms, setCms] = useState<Record<string, string>>({});
  const c = (section: string, key: string, def: string) => cms[`${section}.${key}`] ?? def;

  useEffect(() => {
    fetch("/api/blogs")
      .then(r => r.json())
      .then(d => setPosts(d.blogs ?? []))
      .finally(() => setLoading(false));
    fetch("/api/cms/blog").then(r => r.json()).then(d => setCms(d.content ?? {})).catch(() => {});
  }, []);

  const featured = posts.find(p => p.isFeatured) ?? posts[0] ?? null;
  const rest = posts.filter(p => p !== featured);
  const filtered = activeCat === "All" ? rest : rest.filter(p => p.category === activeCat);

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
          {/* Featured post */}
          {featured && (
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
              <Link href={`/blog/${featured.slug}`}
                className="group relative rounded-[2rem] overflow-hidden shadow-2xl flex cursor-pointer hover:shadow-[0_30px_80px_rgba(27,111,235,0.2)] transition-shadow duration-500 block">
                <div className="grid grid-cols-1 lg:grid-cols-2 w-full min-h-[420px]">
                  <div className="relative min-h-[280px]">
                    {featured.featuredImage ? (
                      <Image src={featured.featuredImage} fill alt={featured.title}
                        className="object-cover object-top group-hover:scale-105 transition-transform duration-700" sizes="50vw" />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-[#1B6FEB] to-[#0A1E4A]" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#070C1B]/60" />
                    <div className="absolute top-6 left-6">
                      <span className="bg-[#1B6FEB] text-white text-xs font-black px-3 py-1.5 rounded-full">{featured.category}</span>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-[#060B17] to-[#0D2A5E] p-10 lg:p-14 flex flex-col justify-center">
                    <div className="inline-flex w-fit bg-white/10 border border-white/15 text-white/70 text-[11px] font-black tracking-widest uppercase px-4 py-1.5 rounded-full mb-5">
                      ⭐ Featured Post
                    </div>
                    <h2 className="font-display font-black text-white text-3xl lg:text-4xl leading-tight mb-4">
                      {featured.title}
                    </h2>
                    {featured.excerpt && <p className="text-white/55 text-sm leading-relaxed mb-8">{featured.excerpt}</p>}
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white font-black">
                        {featured.author.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-white font-bold text-sm">{featured.author}</p>
                        <p className="text-white/40 text-xs">{timeAgo(featured.createdAt)}{featured.readTime ? ` · ${featured.readTime} min read` : ""}</p>
                      </div>
                    </div>
                    <span className="inline-flex w-fit items-center gap-2 bg-white text-[#1B6FEB] font-black px-6 py-3 rounded-full group-hover:bg-blue-50 transition-all group-hover:-translate-y-0.5 shadow-lg text-sm">
                      Read Article →
                    </span>
                  </div>
                </div>
              </Link>
            </section>
          )}

          {/* Category filter */}
          {visibleCats.length > 1 && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
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
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
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
