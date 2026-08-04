"use client";

import { useState, useEffect, useCallback, useRef } from "react";

export type CmsContent = Record<string, string>;

export function useCmsPage(page: string) {
    const [content, setContent] = useState<CmsContent>({});
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

    // Track defaults registered by get() calls so saveSection can persist them too
    const defaults = useRef<CmsContent>({});

    useEffect(() => {
        fetch(`/api/cms/${page}`, { cache: "no-store" })
            .then(r => r.json())
            .then(d => setContent(d.content ?? {}))
            .catch(() => {});
    }, [page]);

    const get = useCallback((section: string, key: string, def = "") => {
        const compound = `${section}.${key}`;
        defaults.current[compound] = def;
        return content[compound] ?? def;
    }, [content]);

    const set = useCallback((section: string, key: string, value: string) =>
        setContent(prev => ({ ...prev, [`${section}.${key}`]: value })),
        []);

    const save = useCallback(async (subset?: CmsContent) => {
        setSaving(true);
        try {
            const body = subset ?? content;
            const res = await fetch(`/api/admin/cms/${page}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            if (!res.ok) throw new Error("Failed to save");
            setToast({ message: "Saved successfully", type: "success" });
        } catch {
            setToast({ message: "Failed to save changes", type: "error" });
        } finally {
            setSaving(false);
            setTimeout(() => setToast(null), 3000);
        }
    }, [content, page]);

    const saveSection = useCallback((section: string) => {
        const subset: CmsContent = {};
        // Include defaults for any key in this section that hasn't been explicitly set
        Object.entries(defaults.current).forEach(([k, def]) => {
            if (k.startsWith(`${section}.`)) {
                subset[k] = content[k] ?? def;
            }
        });
        // Also include any keys in content for this section (covers keys set before defaults were registered)
        Object.entries(content).forEach(([k, v]) => {
            if (k.startsWith(`${section}.`)) subset[k] = v;
        });
        return save(subset);
    }, [content, save]);

    return { get, set, save, saveSection, saving, toast };
}
