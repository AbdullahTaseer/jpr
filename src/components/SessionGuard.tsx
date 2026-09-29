"use client";

import { useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";

const EVENT_THROTTLE_MS = 3000;

export default function SessionGuard() {
  const pathname = usePathname();
  const lastCheck = useRef(0);
  const loggingOut = useRef(false);

  const forceLogout = useCallback(async () => {
    if (loggingOut.current) return;
    loggingOut.current = true;
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
    window.location.replace("/login");
  }, []);

  const checkSession = useCallback(async (throttle = false) => {
    if (loggingOut.current) return;
    const now = Date.now();
    if (throttle && now - lastCheck.current < EVENT_THROTTLE_MS) return;
    lastCheck.current = now;
    try {
      const r = await fetch("/api/auth/me", { cache: "no-store" });
      if (r.status === 401) await forceLogout();
    } catch {
    }
  }, [forceLogout]);

  useEffect(() => {
    checkSession();
  }, [pathname, checkSession]);

  useEffect(() => {
    const onEvent = () => checkSession(true);
    const onVisible = () => {
      if (document.visibilityState === "visible") checkSession(true);
    };

    window.addEventListener("click", onEvent, true);
    window.addEventListener("submit", onEvent, true);
    window.addEventListener("focus", onEvent);
    document.addEventListener("visibilitychange", onVisible);

    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const res = await originalFetch(...args);
      if (res.status === 401) {
        const input = args[0];
        const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
        const path = new URL(url, window.location.origin).pathname;
        if (path.startsWith("/api/") && !path.startsWith("/api/auth/")) {
          checkSession();
        }
      }
      return res;
    };

    return () => {
      window.removeEventListener("click", onEvent, true);
      window.removeEventListener("submit", onEvent, true);
      window.removeEventListener("focus", onEvent);
      document.removeEventListener("visibilitychange", onVisible);
      window.fetch = originalFetch;
    };
  }, [checkSession]);

  return null;
}
