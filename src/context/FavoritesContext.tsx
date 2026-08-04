"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

type FavoritesCtx = {
  isFavorited: (id: string) => boolean;
  toggle: (id: string) => void;
};

const FavCtx = createContext<FavoritesCtx>({ isFavorited: () => false, toggle: () => {} });

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch("/api/user/favorites/products")
      .then(r => (r.ok ? r.json() : null))
      .then(data => {
        if (data?.favorites) {
          setIds(new Set(data.favorites.map((f: { product: { id: string } }) => f.product.id)));
        }
      })
      .catch(() => {});
  }, []);

  const toggle = useCallback(async (id: string) => {
    let wasFav = false;
    setIds(prev => {
      wasFav = prev.has(id);
      const next = new Set(prev);
      if (wasFav) next.delete(id);
      else next.add(id);
      return next;
    });

    try {
      if (wasFav) {
        await fetch("/api/user/favorites/products", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: id }),
        });
      } else {
        const res = await fetch("/api/user/favorites/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: id }),
        });
        if (res.status === 401) {
          setIds(prev => { const next = new Set(prev); next.delete(id); return next; });
          window.location.href = "/login";
        }
      }
    } catch {
      setIds(prev => {
        const next = new Set(prev);
        if (wasFav) next.add(id);
        else next.delete(id);
        return next;
      });
    }
  }, []);

  const isFavorited = useCallback((id: string) => ids.has(id), [ids]);

  return <FavCtx.Provider value={{ isFavorited, toggle }}>{children}</FavCtx.Provider>;
}

export const useFavorites = () => useContext(FavCtx);
