"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

type Blog = {
  id: string; title: string; slug: string; excerpt: string | null; content: string;
  category: string; author: string; featuredImage: string | null; readTime: number | null; createdAt: string;
};

type RelatedPost = {
  id: string; title: string; slug: string; category: string; featuredImage: string | null;
  author: string; readTime: number | null; createdAt: string;
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export default function BlogDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [related, setRelated] = useState<RelatedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`/api/blogs/${slug}`)
      .then(r => { if (!r.ok) { setNotFound(true); setLoading(false); return null; } return r.json(); })
      .then(d => {
        if (!d) return;
        setBlog(d.blog);
        setLoading(false);
        // Load related posts
        fetch("/api/blogs")
          .then(r => r.json())
          .then(({ blogs }) => {
            const others = (blogs as RelatedPost[]).filter(b => b.slug !== slug).slice(0, 3);
            setRelated(others);
          });
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-[#1B6FEB] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (notFound || !blog) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <p className="text-6xl">📭</p>
        <h1 className="text-2xl font-bold text-gray-800">Post not found</h1>
        <Link href="/blog" className="text-[#1B6FEB] font-semibold hover:underline">← Back to Blog</Link>
      </div>
    );
  }

  return (
    <div className="bg-white">

      {/* ── Hero ── */}
      <div className="relative min-h-[60vh] flex items-end overflow-hidden">
        {blog.featuredImage ? (
          <Image src={blog.featuredImage} fill alt={blog.title}
            className="object-cover object-center" sizes="100vw" priority />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#070C1B] via-[#0A1E4A] to-[#1B3A8A]" />
        )}
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10" />

        <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 pt-32">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-white/50 text-xs font-semibold mb-6">
            <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
            <span>/</span>
            <span className="text-white/80">{blog.category}</span>
          </div>

          {/* Category badge */}
          <span className="inline-block bg-[#1B6FEB] text-white text-xs font-black px-3 py-1.5 rounded-full mb-5">
            {blog.category}
          </span>

          {/* Title */}
          <h1 className="font-display font-black text-white text-4xl lg:text-6xl leading-tight mb-6 max-w-3xl">
            {blog.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-5">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-black text-lg">
                {blog.author.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-white font-bold text-sm">{blog.author}</p>
                <p className="text-white/50 text-xs">{formatDate(blog.createdAt)}</p>
              </div>
            </div>
            {blog.readTime && (
              <div className="flex items-center gap-1.5 text-white/50 text-sm">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                </svg>
                {blog.readTime} min read
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Content area ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-16">

          {/* Article */}
          <article>
            {blog.excerpt && (
              <p className="text-xl text-gray-500 leading-relaxed mb-10 font-medium border-l-4 border-[#1B6FEB] pl-6">
                {blog.excerpt}
              </p>
            )}
            <div
              className="blog-content"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />

            {/* Author card */}
            <div className="mt-16 p-8 rounded-3xl bg-gradient-to-br from-[#EBF3FF] to-white border border-[#1B6FEB]/15 flex items-start gap-6">
              <div className="w-16 h-16 rounded-2xl bg-[#1B6FEB] flex items-center justify-center text-white font-black text-2xl flex-shrink-0">
                {blog.author.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-xs font-black text-[#1B6FEB] uppercase tracking-widest mb-1">Written by</p>
                <p className="font-display font-black text-gray-900 text-xl">{blog.author}</p>
                <p className="text-gray-500 text-sm mt-1">Published on {formatDate(blog.createdAt)}</p>
              </div>
            </div>

            {/* Back link */}
            <div className="mt-10">
              <Link href="/blog"
                className="inline-flex items-center gap-2 text-[#1B6FEB] font-bold hover:gap-3 transition-all">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                Back to Blog
              </Link>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="space-y-8">

            {/* Share */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <p className="font-bold text-gray-900 text-sm mb-4">Share this post</p>
              <div className="flex gap-2">
                {[
                  { label: "X", href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(blog.title)}&url=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`, bg: "bg-black", text: "text-white" },
                  { label: "FB", href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`, bg: "bg-[#1877F2]", text: "text-white" },
                  { label: "LI", href: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}&title=${encodeURIComponent(blog.title)}`, bg: "bg-[#0A66C2]", text: "text-white" },
                ].map(s => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                    className={`flex-1 ${s.bg} ${s.text} text-xs font-black py-2.5 rounded-xl text-center hover:opacity-90 transition-opacity`}>
                    {s.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Blog info */}
            <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
              <p className="font-bold text-gray-900 text-sm">Post Details</p>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Category</span>
                  <Link href={`/blog?category=${encodeURIComponent(blog.category)}`} className="font-semibold text-[#1B6FEB] hover:underline">{blog.category}</Link>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Author</span>
                  <span className="font-semibold text-gray-900">{blog.author}</span>
                </div>
                {blog.readTime && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Read Time</span>
                    <span className="font-semibold text-gray-900">{blog.readTime} min</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500">Published</span>
                  <span className="font-semibold text-gray-900">{formatDate(blog.createdAt)}</span>
                </div>
              </div>
            </div>

            {/* Related */}
            {related.length > 0 && (
              <div>
                <p className="font-bold text-gray-900 text-sm mb-4">More Articles</p>
                <div className="space-y-4">
                  {related.map(r => (
                    <Link href={`/blog/${r.slug}`} key={r.id}
                      className="group flex gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                      <div className="w-16 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-gradient-to-br from-[#1B6FEB]/10 to-[#1B6FEB]/5">
                        {r.featuredImage ? (
                          <Image src={r.featuredImage} alt={r.title} width={64} height={56} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-2xl opacity-20">📝</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-900 font-bold text-xs line-clamp-2 group-hover:text-[#1B6FEB] transition-colors">{r.title}</p>
                        <p className="text-gray-400 text-[10px] mt-1">{r.readTime ? `${r.readTime} min read` : formatDate(r.createdAt)}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>

      {/* ── More posts CTA ── */}
      <div className="bg-gradient-to-br from-[#070C1B] to-[#0D2A5E] py-20">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <p className="text-white/50 text-xs font-black uppercase tracking-widest mb-4">Keep reading</p>
          <h2 className="font-display font-black text-white text-4xl mb-6">Explore More Stories</h2>
          <Link href="/blog"
            className="inline-flex items-center gap-2 bg-[#1B6FEB] text-white font-black px-8 py-4 rounded-full hover:bg-[#1557D0] transition-all hover:-translate-y-0.5 shadow-2xl shadow-blue-900/50">
            Browse All Posts →
          </Link>
        </div>
      </div>
    </div>
  );
}
