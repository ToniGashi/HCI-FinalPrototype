"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";

export function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

const focus =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold";

export const buttonClass = {
  primary: cx(
    "inline-flex items-center justify-center gap-2 rounded-lg bg-navy px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-navy-2 disabled:cursor-not-allowed disabled:opacity-40",
    focus,
  ),
  secondary: cx(
    "inline-flex items-center justify-center gap-2 rounded-lg border border-line bg-white px-3.5 py-2 text-sm font-semibold text-navy transition hover:bg-paper disabled:cursor-not-allowed disabled:opacity-40",
    focus,
  ),
  gold: cx(
    "inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#e0d2a8] bg-white px-3 py-1.5 text-sm font-semibold text-gold-deep transition hover:bg-[#fbf8f1]",
    focus,
  ),
  text: cx("inline-flex items-center gap-1 text-sm font-semibold text-navy hover:underline", focus),
};

const pillTones = {
  sage: "bg-sage-soft text-sage",
  sand: "bg-sand text-sand-ink",
  gold: "bg-gold text-navy",
  gray: "bg-[#e7edf2] text-[#607184]",
  outline: "border border-[#e0d2a8] bg-white text-gold-deep",
};

export function Pill({
  tone,
  children,
  className,
}: {
  tone: keyof typeof pillTones;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cx(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
        pillTones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function PageIntro({
  title,
  lede,
  badge,
  actions,
}: {
  title: string;
  lede: string;
  badge?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-6">
      <div className="min-w-0 max-w-3xl">
        <p className="text-[11px] font-semibold tracking-[0.22em] text-gold-deep">
          EXPLORE. PLAN. PREPARE.
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <h1 className="font-serif text-4xl leading-none tracking-tight text-navy sm:text-[40px]">
            {title}
          </h1>
          {badge}
        </div>
        <p className="mt-3 max-w-[640px] text-[15px] leading-6 text-muted">{lede}</p>
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-3 pt-1 sm:pt-8">{actions}</div> : null}
    </div>
  );
}

export function Menu({
  label,
  children,
  align = "right",
  triggerClassName,
  ariaLabel,
}: {
  label: ReactNode;
  children: ReactNode;
  align?: "left" | "right";
  triggerClassName: string;
  ariaLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: MouseEvent) {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        className={triggerClassName}
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={ariaLabel}
        onClick={() => setOpen((value) => !value)}
        onPointerDown={(event) => event.stopPropagation()}
      >
        {label}
      </button>
      {open ? (
        <div
          id={menuId}
          className={cx(
            "absolute z-30 mt-2 min-w-52 rounded-xl border border-line bg-white p-1 text-ink shadow-[0_12px_40px_rgba(16,40,64,0.12)]",
            align === "right" ? "right-0" : "left-0",
          )}
          onClick={() => setOpen(false)}
        >
          {children}
        </div>
      ) : null}
    </div>
  );
}

export function MenuItem({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      className="block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-paper"
      onClick={onClick}
    >
      {children}
    </button>
  );
}
