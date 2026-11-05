"use client";

import { Pill } from "@/components/ui";
import { courseById, loadFor, semesterLabel } from "@/lib/courses";
import { usePlan } from "@/lib/plan-context";

export function SemesterRows({ detailed = false }: { detailed?: boolean }) {
  const { semesters } = usePlan();

  return (
    <ul>
      {semesters.map((semester) => {
        const load = loadFor(semester.courseIds);
        return (
          <li
            key={semester.id}
            className="flex items-start justify-between gap-4 border-b border-line py-3.5 last:border-b-0"
          >
            <div className="min-w-0">
              <p className="font-medium text-navy">{semesterLabel(semester)}</p>
              {detailed ? (
                semester.courseIds.length === 0 ? (
                  <p className="mt-1 text-sm text-muted">Nothing planned yet</p>
                ) : (
                  <ul className="mt-1 space-y-0.5">
                    {semester.courseIds.map((id) => {
                      const course = courseById[id];
                      if (!course) return null;
                      return (
                        <li key={id} className="text-sm text-muted">
                          {course.code} {course.title}
                        </li>
                      );
                    })}
                  </ul>
                )
              ) : null}
            </div>
            <Pill tone={load.count > 0 ? "sage" : "gray"}>{load.courseLabel}</Pill>
          </li>
        );
      })}
    </ul>
  );
}
