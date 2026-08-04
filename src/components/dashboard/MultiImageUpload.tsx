"use client";

import { useState, useRef } from "react";

interface Props {
    value: string[];
    onChange: (urls: string[]) => void;
}

const IcoX = () => (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);
const IcoPlus = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
);
const IcoStar = () => (
    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.163c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.05 9.384c-.783-.57-.38-1.81.588-1.81h4.163a1 1 0 00.951-.69l1.287-3.957z" />
    </svg>
);

export default function MultiImageUpload({ value, onChange }: Props) {
    const [uploading, setUploading] = useState(false);
    const [urlInput, setUrlInput] = useState("");
    const [dragOver, setDragOver] = useState(false);
    const [error, setError] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    const uploadFile = async (file: File): Promise<string | null> => {
        const form = new FormData();
        form.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: form });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error ?? `Upload failed (${res.status})`);
        return data.url ?? null;
    };

    const handleFiles = async (files: FileList | null) => {
        if (!files || files.length === 0) return;
        setError("");
        setUploading(true);
        try {
            const uploads = await Promise.all(Array.from(files).map(uploadFile));
            const urls = uploads.filter((u): u is string => u !== null);
            onChange([...value, ...urls]);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Upload failed");
        } finally {
            setUploading(false);
            if (inputRef.current) inputRef.current.value = "";
        }
    };

    const addUrl = () => {
        const trimmed = urlInput.trim();
        if (!trimmed || value.includes(trimmed)) return;
        onChange([...value, trimmed]);
        setUrlInput("");
    };

    const remove = (idx: number) => onChange(value.filter((_, i) => i !== idx));

    const setMain = (idx: number) => {
        if (idx === 0) return;
        const next = [...value];
        const [item] = next.splice(idx, 1);
        next.unshift(item);
        onChange(next);
    };

    return (
        <div className="space-y-4">
            {error && <p className="text-red-400 text-xs">{error}</p>}
            {/* Drop zone */}
            <div
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${dragOver ? "border-[#1B6FEB] bg-[#1B6FEB]/5" : "border-white/15 hover:border-[#1B6FEB]/50"}`}
                onClick={() => inputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
            >
                <div className="w-12 h-12 rounded-xl bg-[#1B6FEB]/10 flex items-center justify-center mx-auto mb-3">
                    {uploading ? (
                        <div className="w-6 h-6 border-2 border-[#1B6FEB] border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <svg className="w-6 h-6 text-[#1B6FEB]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    )}
                </div>
                <p className="text-white text-sm font-medium">
                    {uploading ? "Uploading..." : <>Drop images here or <span className="text-[#1B6FEB]">click to upload</span></>}
                </p>
                <p className="text-[#6b7280] text-xs mt-1">PNG, JPG, WEBP · First image is the thumbnail</p>
                <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple className="hidden"
                    onChange={(e) => handleFiles(e.target.files)} />
            </div>

            {/* URL input */}
            <div className="flex gap-2">
                <input
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addUrl())}
                    placeholder="Or paste an image URL..."
                    className="flex-1 bg-[#242424] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-[#4b5563] focus:outline-none focus:border-[#1B6FEB]/60 transition-colors"
                />
                <button type="button" onClick={addUrl}
                    className="px-4 py-2.5 bg-[#1B6FEB]/10 text-[#1B6FEB] text-sm font-semibold rounded-xl hover:bg-[#1B6FEB]/20 transition-colors whitespace-nowrap">
                    Add URL
                </button>
            </div>

            {/* Thumbnails */}
            {value.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                    {value.map((url, i) => (
                        <div key={url + i} className="relative group rounded-xl overflow-hidden bg-[#2a2a2a] aspect-square">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={url} alt={`Image ${i + 1}`} className="w-full h-full object-cover"
                                onError={(e) => { (e.target as HTMLImageElement).style.opacity = "0.2"; }} />

                            {/* Remove button */}
                            <button type="button" onClick={() => remove(i)}
                                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow">
                                <IcoX />
                            </button>

                            {/* Thumbnail badge */}
                            {i === 0 ? (
                                <span className="absolute bottom-1 left-1 flex items-center gap-0.5 bg-[#1B6FEB] text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                                    <IcoStar /> Main
                                </span>
                            ) : (
                                <button type="button" onClick={() => setMain(i)}
                                    className="absolute bottom-1 left-1 opacity-0 group-hover:opacity-100 flex items-center gap-0.5 bg-black/60 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded transition-opacity hover:bg-[#1B6FEB]">
                                    Set main
                                </button>
                            )}
                        </div>
                    ))}

                    {/* Add more */}
                    <button type="button" onClick={() => inputRef.current?.click()}
                        className="aspect-square rounded-xl border-2 border-dashed border-white/15 flex flex-col items-center justify-center gap-1.5 text-[#6b7280] hover:border-[#1B6FEB]/50 hover:text-[#1B6FEB] transition-colors">
                        <IcoPlus />
                        <span className="text-xs">Add more</span>
                    </button>
                </div>
            )}
        </div>
    );
}
