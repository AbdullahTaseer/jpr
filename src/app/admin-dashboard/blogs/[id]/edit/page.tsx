"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import BlogEditor from "@/components/admin/BlogEditor";
import type { BlogData } from "@/components/admin/BlogEditor";

export default function EditBlogPage() {
  const { id } = useParams<{ id: string }>();
  const [blog, setBlog] = useState<BlogData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/blogs/${id}`)
      .then(r => r.json())
      .then(d => setBlog(d.blog ?? null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-2 border-[#1B6FEB] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!blog) {
    return <div className="flex items-center justify-center h-full text-[#6b7280]">Post not found.</div>;
  }

  return <BlogEditor initial={blog} />;
}
