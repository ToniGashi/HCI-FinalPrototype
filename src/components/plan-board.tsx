"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { CourseModal } from "@/components/course-modal";
import {
  IconCalendar,
  IconCheck,
  IconChevron,
  IconClose,
  IconInfo,
  IconLock,
  IconMore,
  IconPlus,
  IconSearch,
  IconSort,
} from "@/components/icons";
import { DragPreview, useCourseDrag } from "@/components/plan-drag";
import { Menu, MenuItem, PageIntro, Pill, buttonClass, cx } from "@/components/ui";
import {
  catalogSpecializations,
  courseById,
  courses,
  degreeProgress,
  degreeTitle,
  loadFor,
  registration,
  semesterLabel,
  specializationOptions,
  type Course,
  type Semester,
} from "@/lib/courses";
import { usePlan } from "@/lib/plan-context";

export function PlanBoard() {
  const {
    semesters,
    specialization,
    dirty,
    hasSaved,
    canUndo,
    saveError,
    placeCourse,
    removeCourse,
    clearSemester,
    addYear,
    removeYear,
    setSpecialization,
    undo,
    save,
  } = usePlan();

  const [specializationFilter, setSpecializationFilter] = useState("All specializations");
  const [openOnly, setOpenOnly] = useState(true);
  const [ascending, setAscending] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [explicitTarget, setExplicitTarget] = useState<string | null>(null);
  const [selected, setSelected] = useState<Course | null>(null);
  const [message, setMessage] = useState("");
  const catalogRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (explicitTarget && !semesters.some((semester) => semester.id === explicitTarget)) {
      setExplicitTarget(null);
    }
  }, [explicitTarget, semesters]);

  const plannedIds = useMemo(
    () => new Set(semesters.flatMap((semester) => semester.courseIds)),
    [semesters],
  );

  const filtered = useMemo(() => {
    const list = courses.filter((course) => {
      if (plannedIds.has(course.id)) return false;
      if (openOnly && !course.openSeats) return false;
      if (specializationFilter !== "All specializations" && course.specialization !== specializationFilter) {
        return false;
      }
      return true;
    });
    list.sort((a, b) => a.code.localeCompare(b.code, undefined, { numeric: true }) * (ascending ? 1 : -1));
    return list;
  }, [ascending, openOnly, plannedIds, specializationFilter]);

  const visible = expanded ? filtered : filtered.slice(0, 3);
  const totalLoad = loadFor(semesters.flatMap((semester) => semester.courseIds));
  const years = Array.from(new Set(semesters.map((semester) => semester.year)));

  function destinationId() {
    if (explicitTarget && semesters.some((semester) => semester.id === explicitTarget)) return explicitTarget;
    return semesters.find((semester) => semester.courseIds.length === 0)?.id ?? semesters[0]?.id ?? null;
  }

  function focusCatalog(semesterId: string) {
    setExplicitTarget(semesterId);
    setExpanded(true);
    catalogRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  const drag = useCourseDrag((courseId, zone) => {
    const course = courseById[courseId];
    if (!course || !zone) return;
    if (zone === "catalog") {
      if (removeCourse(courseId)) setMessage(`Removed ${course.code} from the plan.`);
      return;
    }
    if (zone.startsWith("sem:")) {
      const semesterId = zone.slice(4);
      const semester = semesters.find((item) => item.id === semesterId);
      if (placeCourse(courseId, semesterId) && semester) {
        setMessage(`Moved ${course.code} to ${semesterLabel(semester)}.`);
      }
    }
  });

  const activeCourse = drag.active ? courseById[drag.active.id] : null;
  const activeIsPlanned = drag.active ? plannedIds.has(drag.active.id) : false;
  const targetSemester = semesters.find((semester) => semester.id === explicitTarget);

  return (
    <div>
      <p className="sr-only" aria-live="polite">
        {message}
      </p>
      <PageIntro
        title="Plan Ahead"
        lede="Explore OMSCS courses and build your semester-by-semester path. This will make your registration much easier and quicker when your registration time comes."
        badge={<Pill tone="outline">Draft plan</Pill>}
        actions={
          <>
            {dirty ? (
              <span className="inline-flex items-center gap-2 text-sm font-medium text-sand-ink">
                <span className="size-2 rounded-full bg-[#d2b36a]" />
                Unsaved changes
              </span>
            ) : hasSaved ? (
              <span className="inline-flex items-center gap-2 text-sm font-medium text-sage">
                <IconCheck className="size-4" />
                Draft saved
              </span>
            ) : null}
            <button type="button" className={buttonClass.secondary} onClick={undo} disabled={!canUndo}>
              Undo
            </button>
            <button type="button" className={buttonClass.primary} onClick={save}>
              Save draft
            </button>
          </>
        }
      />

      <section className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-sea px-4 py-4 sm:px-5">
        <div className="flex min-w-0 items-start gap-3">
          <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full bg-white text-navy">
            <IconInfo className="size-4" />
          </span>
          <div>
            <p className="text-sm font-semibold text-navy">
              Your registration status · {registration.term}
            </p>
            <p className="mt-1 max-w-3xl text-sm leading-5 text-muted">{registration.note}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Pill tone="sand">{registration.status}</Pill>
          <Link href="/registration" className={buttonClass.secondary}>
            <IconLock className="size-3.5" />
            Registration locked
          </Link>
        </div>
      </section>

      {saveError ? <p className="mt-3 text-sm text-sand-ink">{saveError}</p> : null}

      <div className="mt-5 grid items-start gap-5 lg:grid-cols-[360px_minmax(0,1fr)]">
        <section
          ref={catalogRef}
          {...drag.zone("catalog")}
          className={cx(
            "rounded-2xl border border-line bg-white p-5 shadow-[0_8px_30px_rgba(16,40,64,0.04)]",
            drag.overId === "catalog" && activeIsPlanned && "ring-2 ring-gold",
          )}
        >
          <h2 className="text-lg font-semibold text-navy">Find a course</h2>
          <p className="mt-1 text-sm text-muted">Discover your next OMSCS courses.</p>
          {targetSemester ? (
            <p className="mt-3 rounded-lg bg-sand px-3 py-2 text-sm text-sand-ink">
              Adding courses to {semesterLabel(targetSemester)}.{" "}
              <button type="button" className="font-semibold underline" onClick={() => setExplicitTarget(null)}>
                Cancel
              </button>
            </p>
          ) : null}
          {drag.overId === "catalog" && activeIsPlanned ? (
            <p className="mt-3 rounded-lg border border-dashed border-gold px-3 py-2 text-sm font-medium text-gold-deep">
              Drop here to take it out of the plan
            </p>
          ) : null}

          <div className="relative mt-4">
            <IconSearch className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted/60" />
            <input
              disabled
              value=""
              placeholder="Search by course or title..."
              aria-label="Search by course or title"
              className="w-full cursor-not-allowed rounded-xl border border-line bg-[#f4f7fa] py-2.5 pr-4 pl-10 text-sm text-muted outline-none placeholder:text-muted/60"
            />
          </div>

          <label className="relative mt-3 block">
            <span className="sr-only">Filter by specialization</span>
            <select
              value={specializationFilter}
              onChange={(event) => setSpecializationFilter(event.target.value)}
              className="w-full appearance-none rounded-xl border border-line bg-white py-2.5 pr-10 pl-3 text-sm text-navy outline-none focus:border-gold"
            >
              {catalogSpecializations.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
            <IconChevron className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted" />
          </label>

          <label className="mt-3 flex items-center gap-2 text-sm text-ink">
            <input
              type="checkbox"
              checked={openOnly}
              onChange={(event) => setOpenOnly(event.target.checked)}
              className="size-4 accent-navy"
            />
            Only show courses with open seats
          </label>

          <div className="mt-4 flex items-center justify-between text-sm">
            <p className="text-muted">
              {filtered.length} {filtered.length === 1 ? "course" : "courses"} found
            </p>
            <button
              type="button"
              className="inline-flex items-center gap-1 font-medium text-navy"
              onClick={() => setAscending((value) => !value)}
            >
              Course number
              <IconSort className="size-4" />
            </button>
          </div>

          <ul className="mt-3 space-y-3">
            {visible.map((course) => (
              <CatalogCard
                key={course.id}
                course={course}
                addLabel={targetSemester ? `Add to ${semesterLabel(targetSemester)}` : "Add to plan"}
                dragging={drag.active?.id === course.id}
                onOpen={() => {
                  if (drag.consumeClick()) return;
                  setSelected(course);
                }}
                onAdd={() => {
                  const semesterId = destinationId();
                  const semester = semesters.find((item) => item.id === semesterId);
                  if (!semesterId || !semester) return;
                  if (placeCourse(course.id, semesterId)) {
                    setMessage(`Added ${course.code} to ${semesterLabel(semester)}.`);
                  }
                }}
                bind={drag.bind(course.id)}
              />
            ))}
          </ul>
          {filtered.length === 0 ? (
            <p className="mt-4 rounded-xl border border-dashed border-line px-4 py-6 text-center text-sm text-muted">
              No courses match. Clear a filter, or drop a planned course here to return it to the catalog.
            </p>
          ) : null}

          <div className="mt-4 flex items-center justify-between gap-3 border-t border-line pt-4 text-sm">
            <p className="text-muted">
              Showing {visible.length} of {filtered.length} courses
            </p>
            {filtered.length > 3 ? (
              <button type="button" className={buttonClass.text} onClick={() => setExpanded((value) => !value)}>
                {expanded ? "Show fewer" : "View all courses →"}
              </button>
            ) : null}
          </div>
        </section>

        <section className="rounded-2xl border border-line bg-white p-5 shadow-[0_8px_30px_rgba(16,40,64,0.04)]">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-navy">My semester plan</h2>
              <p className="mt-1 text-sm text-muted">
                Drag and drop to move courses. Build a plan that works for you.
              </p>
            </div>
            <Link href="/degree-requirements" className={buttonClass.secondary}>
              Degree requirements
            </Link>
          </div>

          <div className="mt-5 rounded-2xl bg-navy p-5 text-white">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold tracking-[0.16em] text-white/60">
                  DEGREE & SPECIALIZATION
                </p>
                <p className="mt-2 text-lg font-semibold">{degreeTitle(specialization)}</p>
              </div>
              <Menu
                ariaLabel="Change specialization"
                triggerClassName="inline-flex items-center gap-1 rounded-lg border border-white/20 px-3 py-1.5 text-sm font-semibold text-white hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                label={
                  <>
                    Change
                    <IconChevron className="size-4" />
                  </>
                }
              >
                {specializationOptions.map((option) => (
                  <MenuItem key={option} onClick={() => setSpecialization(option)}>
                    <span className="flex items-center justify-between gap-3">
                      {option}
                      {option === specialization ? <IconCheck className="size-4 text-sage" /> : null}
                    </span>
                  </MenuItem>
                ))}
              </Menu>
            </div>
            <div className="mt-5 flex items-center justify-between text-sm text-white/80">
              <span>Degree completed</span>
              <span className="font-semibold text-white">{degreeProgress.percent}%</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/25">
              <div className="h-full rounded-full bg-gold" style={{ width: `${degreeProgress.percent}%` }} />
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-white/8 px-4 py-3 ring-1 ring-white/10">
                <p className="text-xs text-white/70">Planned credits</p>
                <p className="mt-1 text-3xl font-semibold">{totalLoad.credits}</p>
                <p className="text-xs text-white/70">across {totalLoad.count} {totalLoad.count === 1 ? "course" : "courses"}</p>
              </div>
              <div className="rounded-xl bg-white/8 px-4 py-3 ring-1 ring-white/10">
                <p className="text-xs text-white/70">Registered courses</p>
                <p className="mt-1 text-3xl font-semibold">0</p>
                <p className="text-xs text-white/70">Draft only</p>
              </div>
            </div>
          </div>

          {years.map((year) => {
            const yearSemesters = semesters.filter((semester) => semester.year === year);
            const yearEmpty = yearSemesters.every((semester) => semester.courseIds.length === 0);
            return (
              <div key={year} className="mt-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="inline-flex items-center gap-2 text-sm font-semibold text-navy">
                    <IconCalendar className="size-4 text-muted" />
                    {year} academic year
                  </p>
                  {year === years[0] ? (
                    <button type="button" className={buttonClass.text} onClick={addYear}>
                      <IconPlus className="size-4" />
                      Add the next academic year
                    </button>
                  ) : (
                    <button
                      type="button"
                      className={buttonClass.text}
                      onClick={() => removeYear(year)}
                      disabled={!yearEmpty}
                    >
                      Remove {year}
                    </button>
                  )}
                </div>
                <div className="mt-3 grid gap-3 md:grid-cols-3">
                  {yearSemesters.map((semester) => (
                    <SemesterColumn
                      key={semester.id}
                      semester={semester}
                      semesters={semesters}
                      over={drag.overId === `sem:${semester.id}`}
                      activeId={drag.active?.id ?? null}
                      onOpen={(course) => {
                        if (drag.consumeClick()) return;
                        setSelected(course);
                      }}
                      onRemove={(course) => {
                        if (removeCourse(course.id)) setMessage(`Removed ${course.code} from the plan.`);
                      }}
                      onMove={(course, semesterId) => {
                        const next = semesters.find((item) => item.id === semesterId);
                        if (next && placeCourse(course.id, semesterId)) {
                          setMessage(`Moved ${course.code} to ${semesterLabel(next)}.`);
                        }
                      }}
                      onClear={() => clearSemester(semester.id)}
                      onBrowse={() => focusCatalog(semester.id)}
                      bind={drag.bind}
                      zoneProps={drag.zone(`sem:${semester.id}`)}
                    />
                  ))}
                </div>
              </div>
            );
          })}

          <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-4">
            <p className="max-w-xl text-sm leading-5 text-muted">
              <span className="font-semibold text-navy">Your plan is a draft, not a registration.</span>{" "}
              Saving keeps your plan for later. Seats are not reserved, and availability may change.
            </p>
            <button type="button" className={buttonClass.primary} onClick={save}>
              Save draft
            </button>
          </div>
        </section>
      </div>

      <DragPreview course={activeCourse ?? null} overlayRef={drag.overlayRef} />
      <CourseModal course={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

function CatalogCard({
  course,
  addLabel,
  dragging,
  onOpen,
  onAdd,
  bind,
}: {
  course: Course;
  addLabel: string;
  dragging: boolean;
  onOpen: () => void;
  onAdd: () => void;
  bind: ReturnType<ReturnType<typeof useCourseDrag>["bind"]>;
}) {
  return (
    <li
      data-course-id={course.id}
      className={cx(
        "cursor-grab rounded-xl border border-line bg-white p-3.5 select-none active:cursor-grabbing",
        dragging && "opacity-40",
      )}
      style={{ touchAction: "none" }}
      {...bind}
      onClick={(event) => {
        if ((event.target as HTMLElement).closest("button, a, select, label")) return;
        onOpen();
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-semibold text-navy">{course.code}</p>
        <Pill tone={course.openSeats ? "sage" : "gray"}>
          {course.openSeats ? "Open seats" : "No open seats"}
        </Pill>
      </div>
      <p className="mt-1 text-[15px] font-medium text-ink">{course.title}</p>
      <p className="mt-1 text-sm text-muted">
        {course.specialization} · {course.credits} credits
      </p>
      <div className="mt-3 flex items-center justify-between gap-3">
        <button type="button" className={buttonClass.text} onClick={onOpen}>
          Details
          <IconChevron className="size-4 -rotate-90" />
        </button>
        <button type="button" className={buttonClass.gold} onClick={onAdd}>
          <IconPlus className="size-3.5" />
          {addLabel}
        </button>
      </div>
    </li>
  );
}

function SemesterColumn({
  semester,
  semesters,
  over,
  activeId,
  onOpen,
  onRemove,
  onMove,
  onClear,
  onBrowse,
  bind,
  zoneProps,
}: {
  semester: Semester;
  semesters: Semester[];
  over: boolean;
  activeId: string | null;
  onOpen: (course: Course) => void;
  onRemove: (course: Course) => void;
  onMove: (course: Course, semesterId: string) => void;
  onClear: () => void;
  onBrowse: () => void;
  bind: (courseId: string) => ReturnType<ReturnType<typeof useCourseDrag>["bind"]>;
  zoneProps: ReturnType<ReturnType<typeof useCourseDrag>["zone"]>;
}) {
  const load = loadFor(semester.courseIds);
  const planned = semester.courseIds
    .map((id) => courseById[id])
    .filter((course): course is Course => Boolean(course));

  return (
    <div
      {...zoneProps}
      className={cx(
        "flex min-h-[280px] flex-col rounded-2xl bg-[#f6f8fb] p-3 transition",
        over && "bg-[#fbf6ea] ring-2 ring-gold",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold text-navy">{semesterLabel(semester)}</h3>
          <p className="mt-0.5 text-xs text-muted">{load.label}</p>
        </div>
        <Menu
          ariaLabel={`${semesterLabel(semester)} actions`}
          triggerClassName="grid size-8 place-items-center rounded-lg text-muted hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
          label={<IconMore className="size-4" />}
        >
          <MenuItem onClick={onClear}>Clear semester</MenuItem>
        </Menu>
      </div>

      <div className="mt-3 flex flex-1 flex-col gap-3">
        {planned.map((course) => (
          <article
            key={course.id}
            data-course-id={course.id}
            className={cx(
              "cursor-grab rounded-xl border border-line bg-white p-3 select-none active:cursor-grabbing",
              activeId === course.id && "opacity-40",
            )}
            style={{ touchAction: "none" }}
            {...bind(course.id)}
            onClick={(event) => {
              if ((event.target as HTMLElement).closest("button, a, select, label")) return;
              onOpen(course);
            }}
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-semibold text-navy">{course.code}</p>
              <button
                type="button"
                aria-label={`Remove ${course.code}`}
                className="grid size-6 place-items-center rounded-md text-muted hover:bg-paper"
                onClick={() => onRemove(course)}
              >
                <IconClose className="size-3.5" />
              </button>
            </div>
            <p className="mt-1 text-sm font-medium text-ink">{course.title}</p>
            <div className="mt-2 flex items-center justify-between gap-2">
              <Pill tone={course.openSeats ? "sage" : "gray"}>
                {course.openSeats ? "Open seats" : "No open seats"}
              </Pill>
              <span className="text-xs text-muted">{course.credits} credits</span>
            </div>
            <label className="relative mt-3 block">
              <span className="sr-only">Move {course.code} to another semester</span>
              <select
                value=""
                onChange={(event) => {
                  if (event.target.value) onMove(course, event.target.value);
                }}
                className="w-full appearance-none rounded-lg border border-line bg-white py-2 pr-8 pl-3 text-sm text-navy outline-none focus:border-gold"
              >
                <option value="">Move to semester</option>
                {semesters
                  .filter((item) => item.id !== semester.id)
                  .map((item) => (
                    <option key={item.id} value={item.id}>
                      {semesterLabel(item)}
                    </option>
                  ))}
              </select>
              <IconChevron className="pointer-events-none absolute top-1/2 right-2 size-4 -translate-y-1/2 text-muted" />
            </label>
          </article>
        ))}

        {planned.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-[#d5dde6] px-4 py-8 text-center">
            <span className="grid size-9 place-items-center rounded-full bg-white text-muted">
              <IconPlus className="size-4" />
            </span>
            <p className="mt-3 text-sm font-semibold text-navy">
              {over ? "Drop to add this course" : "A semester of possibilities"}
            </p>
            <p className="mt-1 text-xs leading-5 text-muted">
              Drag a course here or add one from the catalog.
            </p>
            <button type="button" className={cx(buttonClass.text, "mt-3")} onClick={onBrowse}>
              Browse courses →
            </button>
          </div>
        ) : (
          <button type="button" className={cx(buttonClass.text, "justify-center py-1")} onClick={onBrowse}>
            <IconPlus className="size-4" />
            Add a course
          </button>
        )}
        {over && planned.length > 0 ? (
          <p className="rounded-lg border border-dashed border-gold bg-white/80 px-3 py-2 text-center text-xs font-semibold text-gold-deep">
            Drop to place here
          </p>
        ) : null}
      </div>
    </div>
  );
}
