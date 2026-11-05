"use client";

import Link from "next/link";
import { SemesterRows } from "@/components/semester-rows";
import { PageIntro, Pill, buttonClass } from "@/components/ui";
import { degreeProgress, degreeTitle, loadFor } from "@/lib/courses";
import { usePlan } from "@/lib/plan-context";

export function RequirementsView() {
  const { semesters, specialization } = usePlan();
  const planned = loadFor(semesters.flatMap((semester) => semester.courseIds));

  return (
    <div>
      <PageIntro
        title="Degree requirements"
        lede="Illustrative progress for this prototype, shown next to the courses in your draft. It is not a Georgia Tech degree audit."
      />

      <section className="mt-6 rounded-2xl border border-line bg-white p-6 shadow-[0_8px_30px_rgba(16,40,64,0.04)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.16em] text-muted">DEGREE & SPECIALIZATION</p>
            <h2 className="mt-2 text-2xl font-semibold text-navy">{degreeTitle(specialization)}</h2>
          </div>
          <Pill tone="sage">{degreeProgress.status}</Pill>
        </div>
        <div className="mt-5 flex items-center justify-between text-sm text-muted">
          <span>Degree completed</span>
          <span className="font-semibold text-navy">{degreeProgress.percent}%</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#e6ebf0]">
          <div className="h-full rounded-full bg-gold" style={{ width: `${degreeProgress.percent}%` }} />
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <Stat label="Shown as completed" value={`${degreeProgress.percent}%`} detail="Illustrative" />
          <Stat label="In this draft" value={String(planned.count)} detail={planned.courseLabel} />
          <Stat
            label="Remaining courses"
            value={String(degreeProgress.remainingCourses)}
            detail="Illustrative"
          />
        </div>
        <p className="mt-5 text-sm leading-6 text-muted">
          Completed coursework and the courses still required would come from the official record. The draft
          below is the plan you are building, and it does not reserve seats.
        </p>
        <Link href="/plan-ahead" className={`${buttonClass.primary} mt-5`}>
          Edit in Plan Ahead
        </Link>
      </section>

      <section className="mt-5 rounded-2xl border border-line bg-white p-5 shadow-[0_8px_30px_rgba(16,40,64,0.04)]">
        <h2 className="text-lg font-semibold text-navy">Courses in this draft</h2>
        <div className="mt-2">
          <SemesterRows detailed />
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="rounded-xl bg-[#f6f8fb] px-4 py-4">
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-navy">{value}</p>
      <p className="text-xs text-muted">{detail}</p>
    </div>
  );
}
