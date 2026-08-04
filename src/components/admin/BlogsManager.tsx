"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Post = {
  id: string; title: string; slug: string; category: string; author: string;
  status: "DRAFT" | "PUBLISHED"; isFeatured: boolean; featuredImage: string | null;
  readTime: number | null; createdAt: string;
};

const IcoEdit  = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>;
const IcoTrash = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>;
const IcoEye   = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>;

const STATUS: Record<string, string> = {
  PUBLISHED: "bg-emerald-500/15 text-emerald-400",
  DRAFT:     "bg-[#6b7280]/15 text-[#9ca3af]",
};

export default function BlogsManager() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = () => {
    setLoading(true);
    fetch("/api/admin/blogs")
      .then(r => r.json())
      .then(d => setPosts(d.blogs ?? []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const doDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    await fetch(`/api/admin/blogs/${deleteId}`, { method: "DELETE" });
    setPosts(p => p.filter(x => x.id !== deleteId));
    setDeleteId(null);
    setDeleting(false);
  };

  return (
    <>
      <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-7 h-7 border-2 border-[#1B6FEB] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-[#6b7280] text-sm mb-4">No blog posts yet.</p>
            <button onClick={() => router.push("/admin-dashboard/blogs/new")}
              className="bg-[#1B6FEB] text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-[#1557D0] transition-colors">
              Write your first post
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  {["Thumbnail", "Title", "Category", "Author", "Status", "Read", "Date", "Actions"].map(h => (
                    <th key={h} className="text-left px-5 py-4 text-xs font-semibold text-[#6b7280] uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {posts.map(p => (
                  <tr key={p.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-4">
                      <div className="w-20 h-14 rounded-lg overflow-hidden bg-[#2a2a2a] flex-shrink-0">
                        {p.featuredImage
                          ? <Image src={p.featuredImage} alt={p.title} width={80} height={56} className="w-full h-full object-cover" />
                          : <div className="w-full h-full flex items-center justify-center text-[#4b5563] text-xs">No img</div>}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-white text-sm font-medium max-w-[180px] line-clamp-2">{p.title}</p>
                      {p.isFeatured && <span className="text-[10px] font-black text-amber-400 uppercase tracking-wide">★ Featured</span>}
                    </td>
                    <td className="px-5 py-4">
                      <span className="bg-[#1B6FEB]/10 text-[#1B6FEB] text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap">{p.category}</span>
                    </td>
                    <td className="px-5 py-4 text-[#9ca3af] text-sm whitespace-nowrap">{p.author}</td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS[p.status]}`}>{p.status}</span>
                    </td>
                    <td className="px-5 py-4 text-[#6b7280] text-xs whitespace-nowrap">{p.readTime ? `${p.readTime} min` : "—"}</td>
                    <td className="px-5 py-4 text-[#6b7280] text-xs whitespace-nowrap">
                      {new Date(p.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5">
                        <Link href={`/admin-dashboard/blogs/${p.id}/edit`}
                          className="p-1.5 rounded-lg bg-[#1B6FEB]/10 text-[#1B6FEB] hover:bg-[#1B6FEB]/20 transition-colors">
                          <IcoEdit />
                        </Link>
                        {p.status === "PUBLISHED" && (
                          <Link href={`/blog/${p.slug}`} target="_blank"
                            className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors">
                            <IcoEye />
                          </Link>
                        )}
                        <button onClick={() => setDeleteId(p.id)}
                          className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors">
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

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-white font-semibold text-lg mb-2">Delete Post?</h3>
            <p className="text-[#9ca3af] text-sm mb-6">This blog post will be permanently deleted.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-[#9ca3af] text-sm hover:border-white/20 transition-colors">Cancel</button>
              <button onClick={doDelete} disabled={deleting}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-50">
                {deleting ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
