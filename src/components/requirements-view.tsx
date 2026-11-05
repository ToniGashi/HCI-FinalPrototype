"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { IconChevron } from "@/components/icons";
import { PageIntro, Pill, buttonClass } from "@/components/ui";
import { courseById, degreeProgress, degreeTitle, semesterLabel, studentSpecialization } from "@/lib/courses";
import {
  completedCourses,
  coreAlternateNotOffered,
  coreStillRequired,
  designElectives,
  freeElectivesRemaining,
  hciSources,
  interactiveElectives,
  openOnlineElectives,
  programRules,
  type RequirementCourse,
} from "@/lib/hci-requirements";
import { usePlan } from "@/lib/plan-context";

const completedCodes = new Set(completedCourses.map((course) => course.code));

export function RequirementsView() {
  const { semesters } = usePlan();
  const drafted = semesters.flatMap((semester) =>
    semester.courseIds.flatMap((id) => {
      const course = courseById[id];
      if (!course) return [];
      return [{ code: course.code, title: course.title, when: semesterLabel(semester) }];
    }),
  );
  const chosenFreeElectives = drafted.slice(0, freeElectivesRemaining);
  const extraDraft = drafted.slice(freeElectivesRemaining);
  const openFreeSlots = freeElectivesRemaining - chosenFreeElectives.length;
  const completedFree = completedCourses.filter((course) => course.bucket === "Free elective");
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const sectionIds = ["core", "electives", "design", "interactive", "free"];

  function toggle(id: string) {
    setOpen((current) => ({ ...current, [id]: !current[id] }));
  }

  function setAll(value: boolean) {
    setOpen(Object.fromEntries(sectionIds.map((id) => [id, value])));
  }

  return (
    <div>
      <PageIntro
        title="Degree requirements"
        lede="This page tracks your degree progress and specialization. It shows what you have succeeded to complete, and what you have yet to do and choose from."
      />

      <section className="mt-6 rounded-2xl border border-line bg-white p-6 shadow-[0_8px_30px_rgba(16,40,64,0.04)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.16em] text-muted">DEGREE & SPECIALIZATION</p>
            <h2 className="mt-2 text-2xl font-semibold text-navy">{degreeTitle(studentSpecialization)}</h2>
            <p className="mt-1 text-sm text-muted">6 of 10 courses complete · 18 of 30 hours</p>
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
          <Stat label="Succeeded to complete" value="6" detail="Courses done" />
          <Stat label="Yet to do" value={String(degreeProgress.remainingCourses)} detail="Courses left" />
          <Stat label="Choose from" value={String(openOnlineElectives.length)} detail="HCI electives in OMSCS" />
        </div>
        <ul className="mt-5 list-disc space-y-2 pl-5 text-sm leading-6 text-muted">
          {programRules.map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ul>
        <Link href="/plan-ahead" className={`${buttonClass.primary} mt-5`}>
          Edit in Plan Ahead
        </Link>
      </section>

      <section className="mt-5 rounded-2xl border border-line bg-white p-5 shadow-[0_8px_30px_rgba(16,40,64,0.04)] sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-navy">Requirements</h2>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-muted">
              Finished courses, open requirements, and the courses you can still choose are listed together. Open a
              section to see it. A course in your draft is a choice, not a completed requirement.
            </p>
          </div>
          <div className="flex gap-3">
            <button type="button" className={buttonClass.text} onClick={() => setAll(true)}>
              Open all
            </button>
            <button type="button" className={buttonClass.text} onClick={() => setAll(false)}>
              Close all
            </button>
          </div>
        </div>

        <Group
          id="core"
          title="Core"
          meta="6 hours · 1 of 2 complete"
          note={`${coreStillRequired.code} ${coreStillRequired.title} is the core course offered in OMSCS. ${coreAlternateNotOffered.code} ${coreAlternateNotOffered.title} is also accepted and is not on the current OMSCS course list. A course used for the core cannot also count as an elective.`}
          open={Boolean(open.core)}
          onToggle={() => toggle("core")}
        >
          <ul className="mt-3 divide-y divide-line">
            <CourseRow
              code="CS 6750"
              title="Human-Computer Interaction"
              detail="3 credits"
              label="Completed"
              tone="sage"
            />
            <CourseRow
              code={coreStillRequired.code}
              title={coreStillRequired.title}
              detail="3 credits · still required"
              label="Yet to do"
              tone="sand"
            />
          </ul>
        </Group>

        <Group
          id="electives"
          title="Specialization electives"
          meta="9 hours · 2 of 3 complete"
          note="You already have one course from each sub-area, so the last elective can come from either list. Courses offered in OMSCS are the ones you can choose now."
          open={Boolean(open.electives)}
          onToggle={() => toggle("electives")}
        >
          <ElectiveList
            id="design"
            title="Design and evaluation concepts"
            courses={designElectives}
            completedCode="CS 6795"
            open={Boolean(open.design)}
            onToggle={() => toggle("design")}
          />
          <ElectiveList
            id="interactive"
            title="Interactive technology"
            courses={interactiveElectives.filter((course) => course.code !== coreStillRequired.code)}
            completedCode="CS 7632"
            open={Boolean(open.interactive)}
            onToggle={() => toggle("interactive")}
          />
        </Group>

        <Group
          id="free"
          title="Free electives"
          meta="15 hours · 3 of 5 complete"
          note="Any course on the current OMSCS course list can fill a free elective. Two of the remaining courses are already named in your draft."
          open={Boolean(open.free)}
          onToggle={() => toggle("free")}
        >
          <ul className="mt-3 divide-y divide-line">
            {completedFree.map((course) => (
              <CourseRow
                key={course.code}
                code={course.code}
                title={course.title}
                detail="3 credits"
                label="Completed"
                tone="sage"
              />
            ))}
            {chosenFreeElectives.map((course) => (
              <CourseRow
                key={course.code}
                code={course.code}
                title={course.title}
                detail={`${course.when} · 3 credits`}
                label="In your draft"
                tone="gold"
              />
            ))}
            {Array.from({ length: openFreeSlots }, (_, index) => (
              <CourseRow
                key={`open-free-${index}`}
                code="Open slot"
                title="Any current OMSCS course"
                detail="3 credits"
                label="Yet to do"
                tone="sand"
              />
            ))}
            {extraDraft.map((course) => (
              <CourseRow
                key={`extra-${course.code}`}
                code={course.code}
                title={course.title}
                detail={`${course.when} · beyond the two open free-elective slots`}
                label="Extra in the draft"
                tone="gray"
              />
            ))}
          </ul>
        </Group>

        <p className="mt-6 text-xs leading-5 text-muted">
          Lists follow the{" "}
          <a className="font-semibold text-navy underline" href={hciSources.specialization}>
            OMSCS Human-Computer Interaction specialization
          </a>
          , the{" "}
          <a className="font-semibold text-navy underline" href={hciSources.degree}>
            OMSCS degree requirements
          </a>
          , and the{" "}
          <a className="font-semibold text-navy underline" href={hciSources.courses}>
            current OMSCS courses
          </a>
          . Completed courses are this prototype student&apos;s record, not a live Georgia Tech audit. CS 6750 and
          CS 6795 are foundational courses, so the two-course foundational requirement is already met.
        </p>
      </section>
    </div>
  );
}

function Group({
  id,
  title,
  meta,
  note,
  open,
  onToggle,
  children,
}: {
  id: string;
  title: string;
  meta: string;
  note: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <div className="mt-3 border-t border-line">
      <h3>
        <SectionButton id={id} title={title} meta={meta} open={open} onToggle={onToggle} />
      </h3>
      {open ? (
        <div id={`${id}-panel`} role="region" aria-labelledby={`${id}-button`} className="px-2 pb-3">
          <p className="text-sm leading-6 text-muted">{note}</p>
          {children}
        </div>
      ) : null}
    </div>
  );
}

function ElectiveList({
  id,
  title,
  courses,
  completedCode,
  open,
  onToggle,
}: {
  id: string;
  title: string;
  courses: RequirementCourse[];
  completedCode: string;
  open: boolean;
  onToggle: () => void;
}) {
  const ordered = [...courses].sort((a, b) => statusRank(a, completedCode) - statusRank(b, completedCode));
  const completedCount = ordered.filter(
    (course) => course.code === completedCode || completedCodes.has(course.code),
  ).length;
  const choiceCount = ordered.filter((course) => course.offeredOnline && !completedCodes.has(course.code)).length;
  return (
    <div className="mt-2">
      <h4>
        <SectionButton
          id={id}
          title={title}
          meta={`${completedCount} completed · ${choiceCount} to choose from`}
          open={open}
          onToggle={onToggle}
          compact
        />
      </h4>
      {open ? (
        <ul id={`${id}-panel`} role="region" aria-labelledby={`${id}-button`} className="divide-y divide-line px-2">
          {ordered.map((course) => {
            const completed = course.code === completedCode || completedCodes.has(course.code);
            const label = completed ? "Completed" : course.offeredOnline ? "Choose from" : "Not offered online";
            const tone = completed ? "sage" : course.offeredOnline ? "outline" : "gray";
            return (
              <CourseRow key={course.code} code={course.code} title={course.title} label={label} tone={tone} />
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}

function SectionButton({
  id,
  title,
  meta,
  open,
  onToggle,
  compact = false,
}: {
  id: string;
  title: string;
  meta: string;
  open: boolean;
  onToggle: () => void;
  compact?: boolean;
}) {
  return (
    <button
      id={`${id}-button`}
      type="button"
      aria-expanded={open}
      aria-controls={`${id}-panel`}
      onClick={onToggle}
      className="flex w-full items-center gap-3 rounded-xl px-2 py-3 text-left hover:bg-[#f6f8fb] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
    >
      <IconChevron className={`size-4 shrink-0 text-navy transition ${open ? "" : "-rotate-90"}`} />
      <span className={compact ? "text-sm font-semibold text-navy" : "font-semibold text-navy"}>{title}</span>
      <span className="ml-auto text-right text-sm text-muted">{meta}</span>
    </button>
  );
}

function statusRank(course: RequirementCourse, completedCode: string) {
  if (course.code === completedCode || completedCodes.has(course.code)) return 0;
  if (course.offeredOnline) return 1;
  return 2;
}

function CourseRow({
  code,
  title,
  detail,
  label,
  tone,
}: {
  code: string;
  title: string;
  detail?: string;
  label: string;
  tone: "sage" | "sand" | "gold" | "gray" | "outline";
}) {
  return (
    <li className="flex items-start justify-between gap-3 py-2.5">
      <div className="min-w-0">
        <p className="text-sm text-navy">
          <span className="font-semibold">{code}</span> {title}
        </p>
        {detail ? <p className="text-xs text-muted">{detail}</p> : null}
      </div>
      <Pill tone={tone} className="shrink-0">
        {label}
      </Pill>
    </li>
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
