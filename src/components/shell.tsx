"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import {
  IconChevron,
  IconHelp,
  IconLock,
  IconMenu,
  IconSearch,
  IconUser,
} from "@/components/icons";
import { Menu, cx } from "@/components/ui";

const links = [
  { href: "/", label: "Dashboard", locked: false },
  { href: "/plan-ahead", label: "Plan Ahead", locked: false },
  { href: "/registration", label: "Registration", locked: true },
  { href: "/degree-requirements", label: "Degree requirements", locked: false },
];

const iconButton =
  "grid size-9 place-items-center rounded-full text-white/90 transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold";

export function Shell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <header className="sticky top-0 z-40 bg-navy text-white">
        <div className="mx-auto flex h-[68px] max-w-[1240px] items-center gap-4 px-5 lg:gap-8">
          <Link href="/" className="flex shrink-0 items-center gap-3">
            <span className="grid size-9 place-items-center rounded-md bg-gold text-[13px] font-extrabold tracking-tight text-navy">
              GT
            </span>
            <span className="leading-tight">
              <span className="block text-[15px] font-bold tracking-[0.16em]">OSCAR</span>
              <span className="block text-[9px] font-semibold tracking-[0.16em] text-white/70">
                GEORGIA TECH · OMSCS
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-6 text-sm font-medium lg:flex">
            {links.map((link) => {
              const active = pathname === link.href;
              if (link.locked) {
                return (
                  <span
                    key={link.href}
                    className="inline-flex items-center gap-1.5 text-white/50"
                    title="Registration is locked until your time ticket"
                  >
                    <IconLock className="size-3.5" />
                    {link.label}
                  </span>
                );
              }
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={active ? "text-white" : "text-white/75 transition hover:text-white"}
                  aria-current={active ? "page" : undefined}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            <Menu
              ariaLabel="About this prototype"
              triggerClassName={iconButton}
              label={<IconHelp className="size-[18px]" />}
            >
              <div
                className="w-72 px-3 py-2 text-sm leading-5 text-muted"
                onClick={(event) => event.stopPropagation()}
              >
                <p className="font-semibold text-navy">About this prototype</p>
                <p className="mt-1">
                  Plan Ahead is a class prototype for building a semester-by-semester course plan.
                  It does not register you for classes or reserve seats.
                </p>
              </div>
            </Menu>

            <button
              type="button"
              className={cx(iconButton, "cursor-not-allowed text-white/35 hover:bg-transparent")}
              aria-label="Search is unavailable"
              title="Search is unavailable"
              disabled
            >
              <IconSearch className="size-[18px]" />
            </button>

            <Menu
              ariaLabel="My account"
              triggerClassName="inline-flex items-center gap-2 rounded-full py-1 pr-1 pl-1 text-sm font-medium text-white transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
              label={
                <>
                  <span className="grid size-8 place-items-center rounded-full bg-white/10">
                    <IconUser className="size-4" />
                  </span>
                  <span className="hidden lg:inline">My account</span>
                  <IconChevron className="hidden size-4 opacity-80 lg:block" />
                </>
              }
            >
              <div className="px-3 py-2 text-sm leading-5" onClick={(event) => event.stopPropagation()}>
                <p className="font-semibold text-navy">My account</p>
                <p className="mt-1 text-muted">
                  OMSCS student in the Human-Computer Interaction specialization. Drafts stay in this
                  browser. This prototype is not connected to Georgia Tech.
                </p>
              </div>
            </Menu>

            <button
              type="button"
              className={cx(iconButton, "lg:hidden")}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((value) => !value)}
            >
              <IconMenu className="size-[18px]" />
            </button>
          </div>
        </div>

        {mobileOpen ? (
          <nav className="flex flex-col gap-1 border-t border-white/10 px-5 py-3 lg:hidden">
            {links.map((link) => {
              const active = pathname === link.href;
              if (link.locked) {
                return (
                  <span
                    key={link.href}
                    className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-white/50"
                    title="Registration is locked until your time ticket"
                  >
                    <IconLock className="size-3.5" />
                    {link.label}
                  </span>
                );
              }
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cx(
                    "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium",
                    active ? "bg-white/10 text-white" : "text-white/80",
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        ) : null}
        <div className="h-[3px] bg-gold" />
      </header>
      <main className="mx-auto w-full max-w-[1240px] px-5 pt-8 pb-16">{children}</main>
    </>
  );
}
