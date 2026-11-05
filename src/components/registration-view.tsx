"use client";

import Link from "next/link";
import { IconLock } from "@/components/icons";
import { MilestonesCard } from "@/components/milestones";
import { SemesterRows } from "@/components/semester-rows";
import { PageIntro, Pill, buttonClass } from "@/components/ui";
import { loadFor, registration } from "@/lib/courses";
import { usePlan } from "@/lib/plan-context";

export function RegistrationView() {
  const { semesters } = usePlan();
  const planned = loadFor(semesters.flatMap((semester) => semester.courseIds));

  return (
    <div>
      <PageIntro
        title="Registration"
        badge={
          <Pill tone="sand" className="gap-1">
            <IconLock className="size-3" />
            Locked
          </Pill>
        }
        lede="Registration is locked until your Spring 2027 time ticket opens. You can keep planning. This page cannot submit a registration or hold a seat."
      />

      <section className="mt-6 rounded-2xl bg-navy p-6 text-white sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <p className="inline-flex items-center gap-2 text-sm text-white/75">
            <IconLock className="size-4" />
            Your registration status · {registration.term}
          </p>
          <Pill tone="gold">{registration.ticketLabel}</Pill>
        </div>
        <h2 className="mt-4 max-w-2xl text-[26px] leading-snug font-semibold">
          Registration opens with your time ticket on {registration.timeTicket}
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-white/75">{registration.note}</p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Pill tone="gold">{registration.status}</Pill>
          <button
            type="button"
            className="inline-flex cursor-not-allowed items-center gap-2 rounded-lg bg-white/15 px-3.5 py-2 text-sm font-semibold text-white/70"
            disabled
          >
            <IconLock className="size-3.5" />
            Register
          </button>
          <Link href="/plan-ahead" className={`${buttonClass.secondary} bg-white`}>
            Back to Plan Ahead
          </Link>
        </div>
      </section>

      <div className="mt-5 grid items-start gap-5 lg:grid-cols-2">
        <MilestonesCard />
        <section className="rounded-2xl border border-line bg-white p-5 shadow-[0_8px_30px_rgba(16,40,64,0.04)]">
          <h2 className="text-lg font-semibold text-navy">Your draft</h2>
          <p className="mt-1 text-sm text-muted">
            {planned.courseLabel} in this plan, {planned.credits} credits. The draft stays available. Registration
            stays locked until {registration.timeTicket}.
          </p>
          <div className="mt-2">
            <SemesterRows />
          </div>
        </section>
      </div>
    </div>
  );
}
