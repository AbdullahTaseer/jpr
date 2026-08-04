"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect, useCallback } from "react";

// ─── Icons ────────────────────────────────────────────────────────────────────
const IcoBold        = () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M6 4h8a4 4 0 010 8H6zM6 12h9a4 4 0 010 8H6z"/></svg>;
const IcoItalic      = () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M10 4h4l-4 16H6l4-16z"/></svg>;
const IcoUnderline   = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 4v7a5 5 0 0010 0V4M5 20h14"/></svg>;
const IcoStrike      = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><line x1="5" y1="12" x2="19" y2="12"/><path strokeLinecap="round" d="M7 6a5 5 0 0110 0M7 18a5 5 0 0010 0"/></svg>;
const IcoUL          = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><line x1="9" y1="6" x2="21" y2="6"/><line x1="9" y1="12" x2="21" y2="12"/><line x1="9" y1="18" x2="21" y2="18"/><circle cx="4" cy="6" r="1.5" fill="currentColor" stroke="none"/><circle cx="4" cy="12" r="1.5" fill="currentColor" stroke="none"/><circle cx="4" cy="18" r="1.5" fill="currentColor" stroke="none"/></svg>;
const IcoOL          = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/><text x="2" y="8" fontSize="7" fill="currentColor" stroke="none" fontFamily="mono">1.</text><text x="2" y="14" fontSize="7" fill="currentColor" stroke="none" fontFamily="mono">2.</text><text x="2" y="20" fontSize="7" fill="currentColor" stroke="none" fontFamily="mono">3.</text></svg>;
const IcoQuote       = () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M14 17h3l2-4V7h-6v6h3zM6 17h3l2-4V7H5v6h3z" opacity=".6"/></svg>;
const IcoCode        = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>;
const IcoCodeBlock   = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><rect x="3" y="3" width="18" height="18" rx="2"/><polyline points="9 9 7 12 9 15"/><polyline points="15 9 17 12 15 15"/></svg>;
const IcoHR          = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const IcoUndo        = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a4 4 0 014 4v1m-14-5l4-4m-4 4l4 4"/></svg>;
const IcoRedo        = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 10H11a4 4 0 00-4 4v1m14-5l-4-4m4 4l-4 4"/></svg>;
const IcoAlignLeft   = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="18" y2="18"/></svg>;
const IcoAlignCenter = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><line x1="3" y1="6" x2="21" y2="6"/><line x1="6" y1="12" x2="18" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/></svg>;
const IcoAlignRight  = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><line x1="3" y1="6" x2="21" y2="6"/><line x1="9" y1="12" x2="21" y2="12"/><line x1="6" y1="18" x2="21" y2="18"/></svg>;
const IcoLink        = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>;

function Divider() {
  return <span className="w-px h-5 bg-white/10 mx-0.5 flex-shrink-0" />;
}

function Btn({ onClick, active, title, children, disabled }: {
  onClick: () => void; active?: boolean; title: string;
  children: React.ReactNode; disabled?: boolean;
}) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      className={`p-1.5 rounded transition-colors flex-shrink-0 ${
        active
          ? "text-[#1B6FEB] bg-[#1B6FEB]/15"
          : "text-[#9ca3af] hover:text-white hover:bg-white/10"
      } disabled:opacity-30`}
    >
      {children}
    </button>
  );
}

interface RichTextEditorProps {
  value?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
  minHeight?: number;
}

export default function RichTextEditor({
  value = "",
  onChange,
  placeholder = "Write your content here…",
  minHeight = 280,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Underline,
      TextStyle,
      Color,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Link.configure({ openOnClick: false, HTMLAttributes: { class: "text-[#1B6FEB] underline" } }),
      Placeholder.configure({ placeholder }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class: "focus:outline-none text-white text-sm leading-relaxed",
        style: `min-height:${minHeight}px;padding:1rem`,
      },
    },
    onUpdate({ editor }) {
      onChange?.(editor.getHTML());
    },
    immediatelyRender: false,
  });

  // Sync external value into editor (e.g. after async fetch)
  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (value !== current && value !== undefined) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  const setLink = useCallback(() => {
    if (!editor) return;
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Enter URL:", prev ?? "https://");
    if (url === null) return;
    if (url === "") { editor.chain().focus().extendMarkRange("link").unsetLink().run(); return; }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  if (!editor) return null;

  const headingValue = editor.isActive("heading", { level: 1 }) ? "h1"
    : editor.isActive("heading", { level: 2 }) ? "h2"
    : editor.isActive("heading", { level: 3 }) ? "h3"
    : "p";

  return (
    <div className="border border-white/10 rounded-xl overflow-hidden bg-[#111111] focus-within:border-[#1B6FEB]/50 transition-colors">
      {/* Toolbar */}
      <div className="flex items-center gap-0.5 px-3 py-2 border-b border-white/10 flex-wrap">

        {/* History */}
        <Btn title="Undo" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}><IcoUndo /></Btn>
        <Btn title="Redo" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}><IcoRedo /></Btn>
        <Divider />

        {/* Block type */}
        <select
          value={headingValue}
          onChange={(e) => {
            const v = e.target.value;
            if (v === "p") editor.chain().focus().setParagraph().run();
            else editor.chain().focus().toggleHeading({ level: parseInt(v.replace("h","")) as 1|2|3 }).run();
          }}
          className="bg-[#1a1a1a] text-[#9ca3af] text-xs px-2 py-1 rounded border border-white/10 hover:border-white/20 transition-colors focus:outline-none cursor-pointer"
        >
          <option value="p">Paragraph</option>
          <option value="h1">Heading 1</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
        </select>
        <Divider />

        {/* Inline marks */}
        <Btn title="Bold (⌘B)"      onClick={() => editor.chain().focus().toggleBold().run()}      active={editor.isActive("bold")}><IcoBold /></Btn>
        <Btn title="Italic (⌘I)"    onClick={() => editor.chain().focus().toggleItalic().run()}    active={editor.isActive("italic")}><IcoItalic /></Btn>
        <Btn title="Underline (⌘U)" onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")}><IcoUnderline /></Btn>
        <Btn title="Strikethrough"  onClick={() => editor.chain().focus().toggleStrike().run()}    active={editor.isActive("strike")}><IcoStrike /></Btn>
        <Btn title="Inline code"    onClick={() => editor.chain().focus().toggleCode().run()}      active={editor.isActive("code")}><IcoCode /></Btn>
        <Divider />

        {/* Alignment */}
        <Btn title="Align left"   onClick={() => editor.chain().focus().setTextAlign("left").run()}   active={editor.isActive({ textAlign: "left" })}><IcoAlignLeft /></Btn>
        <Btn title="Align center" onClick={() => editor.chain().focus().setTextAlign("center").run()} active={editor.isActive({ textAlign: "center" })}><IcoAlignCenter /></Btn>
        <Btn title="Align right"  onClick={() => editor.chain().focus().setTextAlign("right").run()}  active={editor.isActive({ textAlign: "right" })}><IcoAlignRight /></Btn>
        <Divider />

        {/* Lists & blocks */}
        <Btn title="Bullet list"    onClick={() => editor.chain().focus().toggleBulletList().run()}    active={editor.isActive("bulletList")}><IcoUL /></Btn>
        <Btn title="Numbered list"  onClick={() => editor.chain().focus().toggleOrderedList().run()}   active={editor.isActive("orderedList")}><IcoOL /></Btn>
        <Btn title="Blockquote"     onClick={() => editor.chain().focus().toggleBlockquote().run()}    active={editor.isActive("blockquote")}><IcoQuote /></Btn>
        <Btn title="Code block"     onClick={() => editor.chain().focus().toggleCodeBlock().run()}     active={editor.isActive("codeBlock")}><IcoCodeBlock /></Btn>
        <Btn title="Horizontal rule" onClick={() => editor.chain().focus().setHorizontalRule().run()}><IcoHR /></Btn>
        <Divider />

        {/* Link */}
        <Btn title="Insert / edit link" onClick={setLink} active={editor.isActive("link")}><IcoLink /></Btn>

        {/* Text colour */}
        <label title="Text colour" className="p-1.5 rounded text-[#9ca3af] hover:text-white hover:bg-white/10 transition-colors cursor-pointer flex-shrink-0">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M11 3L5.5 17h2.25l1.12-3h6.25l1.12 3H18.5L13 3h-2zm-1.38 9L11 7.67 12.38 12H9.62z"/><rect x="3" y="20" width="18" height="2" rx="1" fill="#1B6FEB"/></svg>
          <input
            type="color"
            className="sr-only"
            onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
          />
        </label>
      </div>

      {/* Editor area */}
      <EditorContent editor={editor} />

      {/* Prose styles scoped to this editor */}
      <style>{`
        .tiptap h1 { font-size:1.6rem; font-weight:700; margin:0.5em 0 0.25em; }
        .tiptap h2 { font-size:1.3rem; font-weight:700; margin:0.5em 0 0.25em; }
        .tiptap h3 { font-size:1.1rem; font-weight:600; margin:0.4em 0 0.2em; }
        .tiptap p  { margin:0.3em 0; }
        .tiptap ul { list-style:disc;    padding-left:1.4em; margin:0.4em 0; }
        .tiptap ol { list-style:decimal; padding-left:1.4em; margin:0.4em 0; }
        .tiptap blockquote { border-left:3px solid #1B6FEB; padding-left:0.75em; color:#9ca3af; margin:0.5em 0; }
        .tiptap code { background:#1e293b; color:#e2e8f0; padding:0.1em 0.35em; border-radius:4px; font-size:0.85em; }
        .tiptap pre  { background:#0f172a; color:#e2e8f0; padding:0.75em 1em; border-radius:8px; margin:0.5em 0; overflow-x:auto; }
        .tiptap pre code { background:transparent; padding:0; }
        .tiptap hr  { border:none; border-top:1px solid rgba(255,255,255,0.1); margin:0.75em 0; }
        .tiptap a   { color:#1B6FEB; text-decoration:underline; }
        .tiptap p.is-editor-empty:first-child::before { content:attr(data-placeholder); color:#4b5563; pointer-events:none; float:left; height:0; }
      `}</style>
    </div>
  );
}
