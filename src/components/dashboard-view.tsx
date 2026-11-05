"use client";

import Link from "next/link";
import { IconArrow, IconInfo } from "@/components/icons";
import { MilestonesCard } from "@/components/milestones";
import { SemesterRows } from "@/components/semester-rows";
import { PageIntro, Pill, buttonClass } from "@/components/ui";
import { degreeProgress, loadFor, pageLede, registration } from "@/lib/courses";
import { usePlan } from "@/lib/plan-context";

export function DashboardView() {
  const { semesters } = usePlan();
  const planned = loadFor(semesters.flatMap((semester) => semester.courseIds));

  return (
    <div>
      <PageIntro title="Dashboard" lede={pageLede} />

      <div className="mt-6 grid items-stretch gap-5 lg:grid-cols-[1.35fr_1fr]">
        <section className="flex flex-col rounded-2xl bg-navy p-6 text-white shadow-[0_8px_30px_rgba(16,40,64,0.08)] sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <p className="inline-flex items-center gap-2 text-sm text-white/80">
              <IconInfo className="size-4" />
              Your registration status
            </p>
            <Pill tone="gold">{registration.ticketLabel}</Pill>
          </div>
          <h2 className="mt-4 max-w-xl text-[26px] leading-snug font-semibold tracking-tight">
            {registration.headline}
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-white/75">{registration.note}</p>
          <div className="mt-auto flex flex-wrap items-end justify-between gap-4 pt-8">
            <Link href="/plan-ahead" className={`${buttonClass.secondary} bg-white`}>
              <IconArrow className="size-4" />
              View plans
            </Link>
            <p className="text-sm text-white/70">Plan now. Register when it&apos;s time.</p>
          </div>
        </section>

        <section className="rounded-2xl border border-line bg-white p-6 shadow-[0_8px_30px_rgba(16,40,64,0.04)]">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-navy">Your degree progress</h2>
            <Link href="/degree-requirements" className="text-sm font-semibold text-navy hover:underline">
              View requirements →
            </Link>
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <p className="text-4xl font-semibold tracking-tight text-navy">{degreeProgress.percent}%</p>
            <p className="text-sm text-muted">Degree completed</p>
            <Pill tone="sage">{degreeProgress.status}</Pill>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#e6ebf0]">
            <div className="h-full rounded-full bg-gold" style={{ width: `${degreeProgress.percent}%` }} />
          </div>
          <div className="mt-5 grid grid-cols-2 overflow-hidden rounded-xl bg-[#f6f8fb]">
            <div className="px-4 py-4">
              <p className="text-xs text-muted">Planned credits</p>
              <p className="mt-1 text-2xl font-semibold text-navy">
                {planned.count}/{Math.max(planned.count, 2)}
              </p>
              <p className="text-xs text-muted">Courses</p>
            </div>
            <div className="border-l border-white px-4 py-4">
              <p className="text-xs text-muted">Remaining courses</p>
              <p className="mt-1 text-2xl font-semibold text-navy">{degreeProgress.remainingCourses}</p>
              <p className="text-xs text-muted">Courses</p>
            </div>
          </div>
        </section>
      </div>

      <div className="mt-5 grid items-start gap-5 lg:grid-cols-[1.35fr_1fr]">
        <MilestonesCard />
        <section className="rounded-2xl border border-line bg-white p-5 shadow-[0_8px_30px_rgba(16,40,64,0.04)]">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-navy">Your upcoming semester plans</h2>
            <Link href="/plan-ahead" className="shrink-0 text-sm font-semibold text-navy hover:underline">
              View Plan Ahead →
            </Link>
          </div>
          <div className="mt-2">
            <SemesterRows />
          </div>
        </section>
      </div>
    </div>
  );
}
