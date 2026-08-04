"use client";
import { useState } from "react";
import TeamsManager from "@/components/admin/TeamsManager";
const IcoPlus = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>;
export default function TeamsPage() {
  const [openAdd, setOpenAdd] = useState(false);
  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div><h1 className="text-white text-2xl font-bold">Teams</h1><p className="text-[#6b7280] text-sm mt-1">Manage the public-facing team members</p></div>
        <button onClick={() => setOpenAdd(true)} className="flex items-center gap-2 bg-[#1B6FEB] text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-[#1557D0] transition-colors shadow-lg shadow-blue-900/30"><IcoPlus/>Add Member</button>
      </div>
      <TeamsManager externalOpenAdd={openAdd} onExternalAddClose={() => setOpenAdd(false)} />
    </div>
  );
}
