"use client";

import { useFavorites } from "@/context/FavoritesContext";

export default function FavoriteButton({
  productId,
  size = "sm",
}: {
  productId: string;
  size?: "sm" | "md";
}) {
  const { isFavorited, toggle } = useFavorites();
  const fav = isFavorited(productId);

  const btnCls =
    size === "md"
      ? `w-12 h-12 rounded-2xl border-2 flex items-center justify-center transition-all duration-200 flex-shrink-0
         ${fav ? "bg-rose-500 border-rose-500 text-white" : "border-gray-200 text-gray-400 hover:border-rose-400 hover:text-rose-500"}`
      : `w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 shadow-md
         ${fav ? "bg-rose-500 text-white scale-105" : "bg-white/90 backdrop-blur-sm text-gray-400 hover:text-rose-500"}`;

  const iconCls = size === "md" ? "w-5 h-5" : "w-4 h-4";

  return (
    <button
      onClick={e => { e.preventDefault(); e.stopPropagation(); toggle(productId); }}
      title={fav ? "Remove from favourites" : "Add to favourites"}
      className={btnCls}
    >
      <svg
        className={iconCls}
        viewBox="0 0 24 24"
        fill={fav ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
      </svg>
    </button>
  );
}
