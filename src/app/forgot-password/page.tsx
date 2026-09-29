"use client";

import { useState } from "react";
import AuthCard, { ErrorBox, Spinner, inputClass, primaryButtonClass, primaryButtonStyle } from "@/components/AuthCard";

const IcoKey = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
  </svg>
);
const IcoMail = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }
      setSent(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <AuthCard
        icon={<IcoMail />}
        title="Check your email"
        subtitle={<>If an account exists for <strong className="text-gray-900">{email}</strong>, we&apos;ve sent a link to reset your password. It expires in 1 hour.</>}
      >
        <p className="text-sm text-gray-500">
          Didn&apos;t get it? Check your spam folder or{" "}
          <button onClick={() => setSent(false)} className="font-semibold hover:underline" style={{ color: "#1B6FEB" }}>
            try again
          </button>
          .
        </p>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      icon={<IcoKey />}
      title="Forgot your password?"
      subtitle="Enter the email you use to sign in and we'll send you a link to reset it."
    >
      {error && <ErrorBox>{error}</ErrorBox>}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Email address <span className="text-red-500">*</span>
          </label>
          <input
            type="email" required autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className={inputClass}
          />
        </div>
        <button type="submit" disabled={loading} className={primaryButtonClass} style={primaryButtonStyle}>
          {loading ? <span className="flex items-center justify-center gap-2"><Spinner />Sending…</span> : "Send reset link"}
        </button>
      </form>
    </AuthCard>
  );
}
