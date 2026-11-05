"use client";

import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { IconClose } from "@/components/icons";
import { Pill, buttonClass } from "@/components/ui";
import { informationSource, type Course } from "@/lib/courses";
import { usePlan } from "@/lib/plan-context";

export function CourseModal({ course, onClose }: { course: Course | null; onClose: () => void }) {
  const { semesters } = usePlan();
  const inPlan = course
    ? semesters.some((semester) => semester.courseIds.includes(course.id))
    : false;

  useEffect(() => {
    if (!course) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [course, onClose]);

  if (!course) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
      <button
        type="button"
        aria-label="Close course details"
        className="absolute inset-0 bg-[#102840]/45"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="course-dialog-title"
        className="relative max-h-[90vh] w-full max-w-[560px] overflow-y-auto rounded-2xl bg-white p-6 shadow-[0_24px_80px_rgba(16,40,64,0.28)]"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-muted">{course.code}</p>
            <h2 id="course-dialog-title" className="mt-1 text-2xl font-semibold tracking-tight text-navy">
              {course.title}
            </h2>
          </div>
          <button
            type="button"
            className="grid size-9 place-items-center rounded-full text-muted hover:bg-paper"
            onClick={onClose}
            aria-label="Close"
          >
            <IconClose className="size-5" />
          </button>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <InfoTile label="Degree area" value={course.specialization} />
          <InfoTile
            label="Example availability"
            value={
              <Pill tone={course.openSeats ? "sage" : "gray"}>
                {course.openSeats ? "Open seats" : "No open seats"}
              </Pill>
            }
          />
          <InfoTile label="Credit hours" value={`${course.credits} credits`} />
          <InfoTile label="Added to plan" value={inPlan ? "Yes" : "No"} />
        </div>

        <Section title="Course overview">{course.overview}</Section>
        <Section title="Prerequisites and preparation">{course.prerequisites}</Section>
        <Section title="Information source">
          <span className="text-muted">{informationSource}</span>
        </Section>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <a
            className={buttonClass.secondary}
            href={`https://www.ratemyprofessors.com/search/professors?q=${encodeURIComponent(`${course.code} Georgia Tech`)}`}
            target="_blank"
            rel="noreferrer"
          >
            Rate My Professor
          </a>
          <a
            className={buttonClass.primary}
            href="https://omscs.gatech.edu/current-courses"
            target="_blank"
            rel="noreferrer"
          >
            Course Info
          </a>
        </div>
      </div>
    </div>,
    document.body,
  );
}

function InfoTile({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="rounded-xl border border-line px-4 py-3">
      <p className="text-xs text-muted">{label}</p>
      <div className="mt-1 text-sm font-semibold text-navy">{value}</div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-5 border-t border-line pt-4">
      <h3 className="text-sm font-semibold text-navy">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-ink">{children}</p>
    </section>
  );
}
