"use client";

import { useEffect, useRef } from "react";

type Props = {
  checked: boolean;
  onChange: () => void;
  indeterminate?: boolean;
  disabled?: boolean;
  label: string;
};

export default function Checkbox({ checked, onChange, indeterminate = false, disabled, label }: Props) {
  const ref = useRef<HTMLInputElement>(null);

  // `indeterminate` can only be set via the DOM property, not an attribute
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate;
  }, [indeterminate]);

  const showCheck = checked && !indeterminate;

  return (
    <label className="relative inline-flex items-center justify-center w-[18px] h-[18px] shrink-0 cursor-pointer has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-40">
      <input
        ref={ref}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        aria-label={label}
        className="peer absolute inset-0 m-0 appearance-none cursor-[inherit] rounded-[5px] border-[1.5px] border-white/20 bg-[#111111] transition-all duration-150 hover:border-[#1B6FEB]/70 hover:bg-[#1B6FEB]/10 checked:border-[#1B6FEB] checked:bg-[#1B6FEB] checked:hover:bg-[#1557D0] indeterminate:border-[#1B6FEB] indeterminate:bg-[#1B6FEB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B6FEB]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a1a1a] active:scale-90"
      />
      <svg
        viewBox="0 0 12 12"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`pointer-events-none relative w-3 h-3 text-white transition-all duration-150 ${showCheck ? "opacity-100 scale-100" : "opacity-0 scale-50"}`}
      >
        <path d="M2.5 6.2l2.3 2.3 4.7-4.9" />
      </svg>
      {indeterminate && (
        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="pointer-events-none absolute w-3 h-3 text-white">
          <path d="M2.5 6h7" />
        </svg>
      )}
    </label>
  );
}
