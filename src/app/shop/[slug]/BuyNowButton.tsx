"use client";

import { useState } from "react";

export default function BuyNowButton({
  productId,
  redirectUrl,
}: {
  productId: string;
  redirectUrl: string | null;
}) {
  const [loading, setLoading] = useState(false);

  if (!redirectUrl) {
    return (
      <button
        disabled
        className="w-full bg-gray-100 text-gray-400 font-black py-4 rounded-2xl text-sm cursor-not-allowed tracking-wide"
      >
        No Redirect Link Configured
      </button>
    );
  }

  const handleClick = async () => {
    setLoading(true);
    try {
      await fetch(`/api/products/${productId}/click`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source: "product_detail" }),
      });
    } catch {
      // silent — still redirect even if tracking fails
    }
    window.open(redirectUrl, "_blank", "noopener,noreferrer");
    setLoading(false);
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="w-full bg-[#1B6FEB] text-white font-black py-4 rounded-2xl text-sm hover:bg-[#1557D0] transition-all shadow-xl shadow-blue-200 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2.5 tracking-wide"
    >
      {loading ? (
        <>
          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          Redirecting…
        </>
      ) : (
        "BUY NOW →"
      )}
    </button>
  );
}
