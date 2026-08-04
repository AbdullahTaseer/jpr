"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

// ─── Icons ────────────────────────────────────────────────────────────────────
const I = (path: string, vb = "0 0 24 24") => () => (
  <svg className="w-4 h-4" viewBox={vb} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d={path} />
  </svg>
);
const IcoBold        = I("M6 4h8a4 4 0 010 8H6zm0 8h9a4 4 0 010 8H6z");
const IcoItalic      = I("M19 4h-9M14 20H5M15 4L9 20");
const IcoUnderline   = I("M6 3v7a6 6 0 0012 0V3M4 21h16");
const IcoStrike      = I("M17.3 12H6.7M10 8.5C10 7.1 11.1 6 12.5 6S15 7.1 15 8.5c0 2-2.5 3.5-2.5 3.5M10 15.5C10 16.9 11.1 18 12.5 18S15 16.9 15 15.5");
const IcoH1          = () => <span className="text-xs font-black leading-none">H1</span>;
const IcoH2          = () => <span className="text-xs font-black leading-none">H2</span>;
const IcoH3          = () => <span className="text-xs font-black leading-none">H3</span>;
const IcoP           = () => <span className="text-xs font-black leading-none">¶</span>;
const IcoQuote       = I("M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1zm12 0c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z");
const IcoUL          = I("M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01");
const IcoOL          = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 6h11M10 12h11M10 18h11M4 6h.01M4 12h.01M4 18h.01" />
  </svg>
);
const IcoAlignL      = I("M3 6h18M3 11h12M3 16h18");
const IcoAlignC      = I("M3 6h18M6 11h12M3 16h18");
const IcoAlignR      = I("M3 6h18M9 11h12M3 16h18");
const IcoLink        = I("M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71");
const IcoUnlink      = I("M18.84 12.25l1.72-1.71h-.02a5.004 5.004 0 00-.12-7.07 5.006 5.006 0 00-6.95 0l-1.72 1.71M5.17 11.75l-1.71 1.71a5.004 5.004 0 00.12 7.07 5.006 5.006 0 006.95 0l1.72-1.71M8 8l8 8");
const IcoImg         = I("M21 19V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2zM8.5 10a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm-3 8l4.5-6 3.5 4.67 2.5-3.34L21 18");
const IcoTable       = I("M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18");
const IcoHR          = I("M3 12h18");
const IcoUndo        = I("M3 7v6h6M3 13c1.5-5 7-8 12-8 4.4 0 7.9 2.4 10 6");
const IcoRedo        = I("M21 7v6h-6M21 13c-1.5-5-7-8-12-8-4.4 0-7.9 2.4-10 6");
const IcoUpload      = I("M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12");
const IcoBack        = I("M19 12H5M12 19l-7-7 7-7");
const IcoSave        = I("M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2zM17 21v-8H7v8M7 3v5h8");
const IcoGlobe       = I("M12 2a10 10 0 100 20 10 10 0 000-20zM2 12h20M12 2c-2.76 3.62-4 7.53-4 10S9.24 18.38 12 22c2.76-3.62 4-7.53 4-10S14.76 5.62 12 2z");

const CATS = ["General", "Fashion", "Lifestyle", "Wellness", "Business", "Sustainability", "Tech", "Food"];

function slugify(t: string) {
  return t.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim();
}

function estimateReadTime(html: string) {
  const text = html.replace(/<[^>]*>/g, " ");
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export type BlogData = {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  featuredImage: string | null;
  status: "DRAFT" | "PUBLISHED";
  isFeatured: boolean;
  readTime: number | null;
};

interface Props { initial?: BlogData }

// ─── Toolbar button ────────────────────────────────────────────────────────────
function TB({ onClick, title, active, children }: { onClick: () => void; title: string; active?: boolean; children: React.ReactNode }) {
  return (
    <button type="button" onMouseDown={e => { e.preventDefault(); onClick(); }} title={title}
      className={`flex items-center justify-center w-8 h-8 rounded-lg transition-colors text-sm
        ${active ? "bg-[#1B6FEB] text-white" : "text-[#9ca3af] hover:bg-white/10 hover:text-white"}`}>
      {children}
    </button>
  );
}

function Divider() { return <div className="w-px h-6 bg-white/10 mx-1 self-center" />; }

export default function BlogEditor({ initial }: Props) {
  const router = useRouter();
  const editorRef = useRef<HTMLDivElement>(null);
  const imgUploadRef = useRef<HTMLInputElement>(null);
  const featImgRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "");
  const [category, setCategory] = useState(initial?.category ?? "General");
  const [author, setAuthor] = useState(initial?.author ?? "Admin");
  const [featuredImage, setFeaturedImage] = useState<string | null>(initial?.featuredImage ?? null);
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED">(initial?.status ?? "DRAFT");
  const [isFeatured, setIsFeatured] = useState(initial?.isFeatured ?? false);
  const [readTime, setReadTime] = useState<number>(initial?.readTime ?? 1);

  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");
  const [imgUploading, setImgUploading] = useState(false);
  const [featImgUploading, setFeatImgUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  // Set initial content once (avoid React controlling contenteditable)
  useEffect(() => {
    if (editorRef.current && initial?.content) {
      editorRef.current.innerHTML = initial.content;
    }
  }, []);

  // Auto-slug from title (only when not editing an existing post)
  useEffect(() => {
    if (!initial?.id) setSlug(slugify(title));
  }, [title, initial?.id]);

  const exec = useCallback((cmd: string, value?: string) => {
    editorRef.current?.focus();
    document.execCommand(cmd, false, value);
  }, []);

  const insertHTML = useCallback((html: string) => {
    editorRef.current?.focus();
    document.execCommand("insertHTML", false, html);
  }, []);

  const handleLink = useCallback(() => {
    const sel = window.getSelection();
    const text = sel?.toString() || "";
    const url = prompt("Enter URL:", "https://");
    if (url) exec("createLink", url);
    else if (!text) return;
  }, [exec]);

  const handleInlineImg = useCallback(async (files: FileList | null) => {
    if (!files?.[0]) return;
    setImgUploading(true);
    setUploadError("");
    try {
      const fd = new FormData();
      fd.append("file", files[0]);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? `Upload failed (${res.status})`);
      insertHTML(`<img src="${data.url}" alt="" style="max-width:100%;border-radius:12px;margin:16px 0;" />`);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setImgUploading(false);
      if (imgUploadRef.current) imgUploadRef.current.value = "";
    }
  }, [insertHTML]);

  const handleFeatImg = useCallback(async (files: FileList | null) => {
    if (!files?.[0]) return;
    setFeatImgUploading(true);
    setUploadError("");
    try {
      const fd = new FormData();
      fd.append("file", files[0]);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? `Upload failed (${res.status})`);
      setFeaturedImage(data.url);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setFeatImgUploading(false);
      if (featImgRef.current) featImgRef.current.value = "";
    }
  }, []);

  const insertTable = useCallback(() => {
    insertHTML(`
      <table style="border-collapse:collapse;width:100%;margin:16px 0;">
        <thead>
          <tr>
            <th style="border:1px solid #e5e7eb;padding:10px 16px;background:#f9fafb;font-weight:700;text-align:left;">Column 1</th>
            <th style="border:1px solid #e5e7eb;padding:10px 16px;background:#f9fafb;font-weight:700;text-align:left;">Column 2</th>
            <th style="border:1px solid #e5e7eb;padding:10px 16px;background:#f9fafb;font-weight:700;text-align:left;">Column 3</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="border:1px solid #e5e7eb;padding:10px 16px;">Cell</td>
            <td style="border:1px solid #e5e7eb;padding:10px 16px;">Cell</td>
            <td style="border:1px solid #e5e7eb;padding:10px 16px;">Cell</td>
          </tr>
          <tr>
            <td style="border:1px solid #e5e7eb;padding:10px 16px;">Cell</td>
            <td style="border:1px solid #e5e7eb;padding:10px 16px;">Cell</td>
            <td style="border:1px solid #e5e7eb;padding:10px 16px;">Cell</td>
          </tr>
        </tbody>
      </table><p><br></p>
    `);
  }, [insertHTML]);

  const save = useCallback(async (publishStatus?: "DRAFT" | "PUBLISHED") => {
    const content = editorRef.current?.innerHTML ?? "";
    const finalStatus = publishStatus ?? status;
    const rt = estimateReadTime(content);
    setReadTime(rt);
    setSaving(true);
    setSavedMsg("");

    const payload = { title, slug, excerpt, content, category, author, featuredImage, status: finalStatus, isFeatured, readTime: rt };
    const url = initial?.id ? `/api/admin/blogs/${initial.id}` : "/api/admin/blogs";
    const method = initial?.id ? "PUT" : "POST";

    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    if (res.ok) {
      const { blog } = await res.json();
      setSavedMsg(finalStatus === "PUBLISHED" ? "Published!" : "Saved as draft");
      if (!initial?.id) router.push(`/admin-dashboard/blogs/${blog.id}/edit`);
      else setStatus(finalStatus);
      setTimeout(() => setSavedMsg(""), 3000);
    }
    setSaving(false);
  }, [title, slug, excerpt, category, author, featuredImage, status, isFeatured, initial, router]);

  const inp = "w-full bg-[#242424] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-[#4b5563] focus:outline-none focus:border-[#1B6FEB]/60 transition-colors";
  const label = "text-[#9ca3af] text-xs font-semibold uppercase tracking-wide mb-1.5 block";

  return (
    <div className="flex flex-col h-full">
      {/* ── Top bar ── */}
      <div className="flex items-center gap-4 px-6 py-4 border-b border-white/10 bg-[#111] flex-shrink-0">
        <button onClick={() => router.push("/admin-dashboard/blogs")}
          className="flex items-center gap-2 text-[#9ca3af] hover:text-white transition-colors text-sm font-medium flex-shrink-0">
          <IcoBack /> Blogs
        </button>
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Post title…"
          className="flex-1 bg-transparent text-white text-xl font-bold placeholder-[#4b5563] focus:outline-none"
        />
        {savedMsg && <span className="text-emerald-400 text-sm font-semibold flex-shrink-0">{savedMsg}</span>}
        {uploadError && <span className="text-red-400 text-sm font-semibold flex-shrink-0">{uploadError}</span>}
        <button onClick={() => save("DRAFT")} disabled={saving || !title.trim()}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/15 text-[#9ca3af] hover:text-white hover:border-white/30 text-sm font-semibold transition-colors flex-shrink-0 disabled:opacity-40">
          <IcoSave /> Draft
        </button>
        <button onClick={() => save("PUBLISHED")} disabled={saving || !title.trim()}
          className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#1B6FEB] text-white text-sm font-semibold hover:bg-[#1557D0] transition-colors flex-shrink-0 disabled:opacity-40">
          <IcoGlobe /> Publish
        </button>
      </div>

      {/* ── Main area ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── Editor pane ── */}
        <div className="flex-1 flex flex-col overflow-hidden border-r border-white/10">

          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-0.5 px-4 py-2.5 border-b border-white/10 bg-[#141414] flex-shrink-0">
            <TB onClick={() => exec("undo")} title="Undo"><IcoUndo /></TB>
            <TB onClick={() => exec("redo")} title="Redo"><IcoRedo /></TB>
            <Divider />
            <TB onClick={() => exec("formatBlock", "H1")} title="Heading 1"><IcoH1 /></TB>
            <TB onClick={() => exec("formatBlock", "H2")} title="Heading 2"><IcoH2 /></TB>
            <TB onClick={() => exec("formatBlock", "H3")} title="Heading 3"><IcoH3 /></TB>
            <TB onClick={() => exec("formatBlock", "P")} title="Paragraph"><IcoP /></TB>
            <TB onClick={() => exec("formatBlock", "BLOCKQUOTE")} title="Blockquote"><IcoQuote /></TB>
            <Divider />
            <TB onClick={() => exec("bold")} title="Bold"><IcoBold /></TB>
            <TB onClick={() => exec("italic")} title="Italic"><IcoItalic /></TB>
            <TB onClick={() => exec("underline")} title="Underline"><IcoUnderline /></TB>
            <TB onClick={() => exec("strikeThrough")} title="Strikethrough"><IcoStrike /></TB>
            <Divider />
            <TB onClick={() => exec("justifyLeft")} title="Align left"><IcoAlignL /></TB>
            <TB onClick={() => exec("justifyCenter")} title="Align center"><IcoAlignC /></TB>
            <TB onClick={() => exec("justifyRight")} title="Align right"><IcoAlignR /></TB>
            <Divider />
            <TB onClick={() => exec("insertUnorderedList")} title="Bullet list"><IcoUL /></TB>
            <TB onClick={() => exec("insertOrderedList")} title="Numbered list"><IcoOL /></TB>
            <Divider />
            <TB onClick={handleLink} title="Insert link"><IcoLink /></TB>
            <TB onClick={() => exec("unlink")} title="Remove link"><IcoUnlink /></TB>
            <Divider />
            <TB onClick={() => imgUploadRef.current?.click()} title={imgUploading ? "Uploading…" : "Insert image"}>
              {imgUploading ? <span className="w-4 h-4 border-2 border-[#1B6FEB] border-t-transparent rounded-full animate-spin" /> : <IcoImg />}
            </TB>
            <TB onClick={insertTable} title="Insert table"><IcoTable /></TB>
            <TB onClick={() => insertHTML("<hr style='border:none;border-top:2px solid #e5e7eb;margin:24px 0;' /><p><br></p>")} title="Horizontal rule"><IcoHR /></TB>
            <input ref={imgUploadRef} type="file" accept="image/*" className="hidden" onChange={e => handleInlineImg(e.target.files)} />
          </div>

          {/* Editor area */}
          <div className="flex-1 overflow-y-auto bg-white">
            <div
              ref={editorRef}
              contentEditable
              suppressContentEditableWarning
              className="min-h-full outline-none px-12 py-10 text-gray-800 text-base leading-relaxed blog-content"
              style={{ fontFamily: "Georgia, serif", fontSize: "17px" }}
              onInput={() => {
                const html = editorRef.current?.innerHTML ?? "";
                setReadTime(estimateReadTime(html));
              }}
            />
          </div>
        </div>

        {/* ── Meta sidebar ── */}
        <div className="w-72 flex-shrink-0 overflow-y-auto bg-[#111] p-5 space-y-5">

          {/* Status */}
          <div>
            <span className={label}>Status</span>
            <div className="flex gap-2">
              {(["DRAFT", "PUBLISHED"] as const).map(s => (
                <button key={s} type="button" onClick={() => setStatus(s)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-colors
                    ${status === s ? "bg-[#1B6FEB] text-white" : "border border-white/10 text-[#9ca3af] hover:border-white/20"}`}>
                  {s === "DRAFT" ? "Draft" : "Published"}
                </button>
              ))}
            </div>
          </div>

          {/* Featured toggle */}
          <div className="flex items-center justify-between">
            <span className={label + " mb-0"}>Featured Post</span>
            <button type="button" onClick={() => setIsFeatured(v => !v)}
              className={`w-10 h-6 rounded-full transition-colors relative ${isFeatured ? "bg-[#1B6FEB]" : "bg-[#2a2a2a]"}`}>
              <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isFeatured ? "left-5" : "left-1"}`} />
            </button>
          </div>

          {/* Category */}
          <div>
            <span className={label}>Category</span>
            <select value={category} onChange={e => setCategory(e.target.value)} className={inp}>
              {CATS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Author */}
          <div>
            <span className={label}>Author</span>
            <input value={author} onChange={e => setAuthor(e.target.value)} placeholder="Author name" className={inp} />
          </div>

          {/* Read time */}
          <div>
            <span className={label}>Est. Read Time</span>
            <div className="bg-[#242424] border border-white/10 rounded-xl px-4 py-2.5 text-[#9ca3af] text-sm">
              {readTime} min read
            </div>
          </div>

          {/* Slug */}
          <div>
            <span className={label}>Slug</span>
            <input value={slug} onChange={e => setSlug(slugify(e.target.value))} placeholder="post-slug" className={inp} />
          </div>

          {/* Excerpt */}
          <div>
            <span className={label}>Excerpt</span>
            <textarea value={excerpt} onChange={e => setExcerpt(e.target.value)} placeholder="Short description shown in listings…" rows={3}
              className={inp + " resize-none"} />
          </div>

          {/* Featured image */}
          <div>
            <span className={label}>Featured Image</span>
            <div
              className="border-2 border-dashed border-white/15 rounded-xl overflow-hidden cursor-pointer hover:border-[#1B6FEB]/50 transition-colors"
              onClick={() => featImgRef.current?.click()}>
              {featuredImage ? (
                <div className="relative aspect-video">
                  <Image src={featuredImage} alt="Featured" fill className="object-cover" sizes="288px" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity">
                    <span className="text-white text-xs font-bold">Change Image</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-2 py-8 text-[#6b7280]">
                  {featImgUploading ? (
                    <div className="w-6 h-6 border-2 border-[#1B6FEB] border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <><IcoUpload /><span className="text-xs">Upload image</span></>
                  )}
                </div>
              )}
            </div>
            {featuredImage && (
              <button type="button" onClick={() => setFeaturedImage(null)}
                className="mt-2 text-red-400 text-xs hover:text-red-300 transition-colors">
                Remove image
              </button>
            )}
            <input ref={featImgRef} type="file" accept="image/*" className="hidden" onChange={e => handleFeatImg(e.target.files)} />
          </div>
        </div>
      </div>
    </div>
  );
}
