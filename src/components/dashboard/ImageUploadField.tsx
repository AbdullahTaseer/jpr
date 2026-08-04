"use client";

import { useRef, useState } from "react";

interface Props {
    value: string;
    onChange: (url: string) => void;
    label?: string;
    placeholder?: string;
}

export default function ImageUploadField({ value, onChange, label = "Image URL", placeholder = "https://example.com/image.jpg" }: Props) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");

    const handleFile = async (file: File | null) => {
        if (!file) return;
        setError("");
        setUploading(true);
        try {
            const form = new FormData();
            form.append("file", file);
            const res = await fetch("/api/upload", { method: "POST", body: form });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(data.error ?? `Upload failed (${res.status})`);
            onChange(data.url);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Upload failed");
        } finally {
            setUploading(false);
            if (inputRef.current) inputRef.current.value = "";
        }
    };

    return (
        <div className="space-y-2">
            <label className="text-white text-sm font-semibold">{label}</label>

            {/* Preview + upload trigger */}
            <div
                className="relative w-full h-32 rounded-xl overflow-hidden bg-[#242424] border border-white/10 cursor-pointer group hover:border-[#1B6FEB]/60 transition-colors"
                onClick={() => !uploading && inputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => { e.preventDefault(); handleFile(e.dataTransfer.files[0] ?? null); }}
            >
                {value ? (
                    <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={value} alt="preview" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.opacity = "0.15"; }} />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1">
                            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01"/></svg>
                            <span className="text-white text-xs font-medium">Change image</span>
                        </div>
                    </>
                ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-[#4b5563] group-hover:text-[#1B6FEB] transition-colors">
                        {uploading ? (
                            <div className="w-6 h-6 border-2 border-[#1B6FEB] border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <>
                                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"/></svg>
                                <span className="text-xs font-medium">Click or drop to upload</span>
                                <span className="text-xs text-[#4b5563]">PNG, JPG, WEBP</span>
                            </>
                        )}
                    </div>
                )}
                <input
                    ref={inputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    className="hidden"
                    onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
                />
            </div>

            {/* URL input fallback */}
            <div className="flex gap-2 items-center">
                <input
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="flex-1 bg-[#242424] border border-white/10 rounded-xl px-3 py-2 text-white text-xs placeholder-[#4b5563] focus:outline-none focus:border-[#1B6FEB]/60 transition-colors"
                />
                {value && (
                    <button type="button" onClick={() => onChange("")}
                        className="shrink-0 text-[#6b7280] hover:text-red-400 transition-colors text-xs px-2 py-2">
                        Clear
                    </button>
                )}
            </div>

            {error && <p className="text-red-400 text-xs">{error}</p>}
        </div>
    );
}
