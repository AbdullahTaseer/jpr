"use client";

import RichTextEditor from "@/components/dashboard/RichTextEditor";

interface Props {
  title: string;
  description: string;
  extraFields?: React.ReactNode;
}

export default function ContentPageEditor({ title, description, extraFields }: Props) {
  return (
    <div className="space-y-6">
      <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-white font-semibold text-base">{title}</h2>
            <p className="text-[#6b7280] text-sm mt-0.5">{description}</p>
          </div>
          <button className="shrink-0 bg-[#1B6FEB] text-white text-sm font-semibold px-6 py-2.5 rounded-xl hover:bg-[#1557D0] transition-colors">
            Save Changes
          </button>
        </div>
        {extraFields}
        <div className="space-y-1.5">
          <label className="text-white text-sm font-semibold">Page Content</label>
          <RichTextEditor />
        </div>
      </div>
    </div>
  );
}
