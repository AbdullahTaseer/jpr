"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import AuthCard, { ErrorBox, Spinner, inputClass, primaryButtonClass, primaryButtonStyle } from "@/components/AuthCard";

const IcoLock = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);
const IcoCheck = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);
const IcoAlert = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
  </svg>
);

const EyeToggle = ({ show, onClick }: { show: boolean; onClick: () => void }) => (
  <button type="button" onClick={onClick} aria-label={show ? "Hide password" : "Show password"}
    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition">
    {show
      ? <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
      : <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>}
  </button>
);

type Status = "checking" | "ready" | "invalid" | "done";

export default function ResetPasswordPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token = "" } = use(searchParams);

  const [status, setStatus] = useState<Status>(token ? "checking" : "invalid");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) return;
    fetch(`/api/auth/reset-password?token=${encodeURIComponent(token)}`)
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) { setStatus("invalid"); return; }
        setEmail(data.email ?? "");
        setStatus("ready");
      })
      .catch(() => setStatus("invalid"));
  }, [token]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (password !== confirm) { setError("Passwords don't match."); return; }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) { setError(data.error || "Something went wrong. Please try again."); return; }
      setStatus("done");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (status === "checking") {
    return (
      <AuthCard icon={<IcoLock />} title="Reset your password" subtitle="Checking your reset link…">
        <div className="flex justify-center py-4 text-[#1B6FEB]"><Spinner /></div>
      </AuthCard>
    );
  }

  if (status === "invalid") {
    return (
      <AuthCard icon={<IcoAlert />} title="Link expired" subtitle="This reset link is invalid, has expired, or has already been used. Reset links are valid for 1 hour.">
        <Link href="/forgot-password" className={`${primaryButtonClass} block text-center`} style={primaryButtonStyle}>
          Request a new link
        </Link>
      </AuthCard>
    );
  }

  if (status === "done") {
    return (
      <AuthCard icon={<IcoCheck />} title="Password updated" subtitle="Your password has been changed. You can now sign in with your new password.">
        <Link href="/login" className={`${primaryButtonClass} block text-center`} style={primaryButtonStyle}>
          Sign in
        </Link>
      </AuthCard>
    );
  }

  const mismatch = confirm.length > 0 && password !== confirm;

  return (
    <AuthCard
      icon={<IcoLock />}
      title="Choose a new password"
      subtitle={email ? <>Setting a new password for <strong className="text-gray-900">{email}</strong>.</> : "Enter your new password below."}
    >
      {error && <ErrorBox>{error}</ErrorBox>}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            New password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showPw ? "text" : "password"} required autoFocus minLength={8}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              className={`${inputClass} pr-11`}
            />
            <EyeToggle show={showPw} onClick={() => setShowPw((v) => !v)} />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Confirm new password <span className="text-red-500">*</span>
          </label>
          <input
            type={showPw ? "text" : "password"} required
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Re-enter your password"
            className={`${inputClass} ${mismatch ? "border-red-300 focus:border-red-400 focus:ring-red-100" : ""}`}
          />
          {mismatch && <p className="text-red-500 text-xs mt-1.5">Passwords don&apos;t match</p>}
        </div>
        <button type="submit" disabled={loading} className={primaryButtonClass} style={primaryButtonStyle}>
          {loading ? <span className="flex items-center justify-center gap-2"><Spinner />Updating…</span> : "Update password"}
        </button>
      </form>
    </AuthCard>
  );
}
