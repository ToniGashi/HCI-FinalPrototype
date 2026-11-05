"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  initialSemesters,
  type Semester,
  type Season,
} from "@/lib/courses";

const STORAGE_KEY = "omscs-oscar-draft-v1";

type Snapshot = {
  semesters: Semester[];
  specialization: string;
};

type PlanContextValue = {
  semesters: Semester[];
  specialization: string;
  dirty: boolean;
  hasSaved: boolean;
  canUndo: boolean;
  saveError: string | null;
  placeCourse: (courseId: string, semesterId: string) => boolean;
  removeCourse: (courseId: string) => boolean;
  clearSemester: (semesterId: string) => void;
  addYear: () => void;
  removeYear: (year: number) => void;
  setSpecialization: (value: string) => void;
  undo: () => void;
  save: () => void;
};

const PlanContext = createContext<PlanContextValue | null>(null);

function isSeason(value: unknown): value is Season {
  return value === "Spring" || value === "Summer" || value === "Fall";
}

function readSnapshot(): Snapshot | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<Snapshot>;
    if (!Array.isArray(parsed.semesters) || typeof parsed.specialization !== "string") {
      return null;
    }
    const semesters = parsed.semesters.flatMap((semester) => {
      if (!semester || typeof semester !== "object") return [];
      const candidate = semester as Semester;
      if (
        typeof candidate.id !== "string" ||
        typeof candidate.year !== "number" ||
        !isSeason(candidate.season) ||
        !Array.isArray(candidate.courseIds)
      ) {
        return [];
      }
      return [
        {
          id: candidate.id,
          year: candidate.year,
          season: candidate.season,
          courseIds: candidate.courseIds.filter((id) => typeof id === "string"),
        },
      ];
    });
    if (semesters.length === 0) return null;
    return { semesters, specialization: parsed.specialization };
  } catch {
    return null;
  }
}

function sameSnapshot(a: Snapshot, b: Snapshot) {
  return JSON.stringify(a) === JSON.stringify(b);
}

export function PlanProvider({ children }: { children: ReactNode }) {
  const [semesters, setSemesters] = useState<Semester[]>(initialSemesters);
  const [specialization, setSpecializationState] = useState("OMSCS");
  const [saved, setSaved] = useState<Snapshot | null>(null);
  const [history, setHistory] = useState<Snapshot[]>([]);
  const [saveError, setSaveError] = useState<string | null>(null);

  const semestersRef = useRef(semesters);
  const specializationRef = useRef(specialization);
  const historyRef = useRef(history);
  semestersRef.current = semesters;
  specializationRef.current = specialization;
  historyRef.current = history;

  useEffect(() => {
    const snapshot = readSnapshot();
    if (!snapshot) return;
    setSemesters(snapshot.semesters);
    setSpecializationState(snapshot.specialization);
    setSaved(snapshot);
    setHistory([]);
  }, []);

  const current = useMemo(
    () => ({ semesters, specialization }),
    [semesters, specialization],
  );
  const dirty = saved === null || !sameSnapshot(saved, current);

  function remember() {
    const snapshot = structuredClone({
      semesters: semestersRef.current,
      specialization: specializationRef.current,
    });
    setHistory((previous) => [...previous, snapshot].slice(-40));
  }

  function placeCourse(courseId: string, semesterId: string) {
    const previous = semestersRef.current;
    const owner = previous.find((semester) => semester.courseIds.includes(courseId));
    if (owner?.id === semesterId) return false;
    if (!previous.some((semester) => semester.id === semesterId)) return false;
    remember();
    setSemesters(
      previous.map((semester) => {
        if (semester.id === semesterId) {
          return { ...semester, courseIds: [...semester.courseIds, courseId] };
        }
        return {
          ...semester,
          courseIds: semester.courseIds.filter((id) => id !== courseId),
        };
      }),
    );
    return true;
  }

  function removeCourse(courseId: string) {
    const previous = semestersRef.current;
    if (!previous.some((semester) => semester.courseIds.includes(courseId))) return false;
    remember();
    setSemesters(
      previous.map((semester) => ({
        ...semester,
        courseIds: semester.courseIds.filter((id) => id !== courseId),
      })),
    );
    return true;
  }

  function clearSemester(semesterId: string) {
    const previous = semestersRef.current;
    const semester = previous.find((item) => item.id === semesterId);
    if (!semester || semester.courseIds.length === 0) return;
    remember();
    setSemesters(
      previous.map((item) => (item.id === semesterId ? { ...item, courseIds: [] } : item)),
    );
  }

  function addYear() {
    const previous = semestersRef.current;
    const year = Math.max(...previous.map((semester) => semester.year)) + 1;
    remember();
    setSemesters([
      ...previous,
      { id: `${year}-spring`, year, season: "Spring", courseIds: [] },
      { id: `${year}-summer`, year, season: "Summer", courseIds: [] },
      { id: `${year}-fall`, year, season: "Fall", courseIds: [] },
    ]);
  }

  function removeYear(year: number) {
    if (year <= 2027) return;
    remember();
    setSemesters(semestersRef.current.filter((semester) => semester.year !== year));
  }

  function setSpecialization(value: string) {
    if (value === specializationRef.current) return;
    remember();
    setSpecializationState(value);
  }

  function undo() {
    const previous = historyRef.current;
    if (previous.length === 0) return;
    const snapshot = previous[previous.length - 1];
    setHistory(previous.slice(0, -1));
    setSemesters(snapshot.semesters);
    setSpecializationState(snapshot.specialization);
  }

  function save() {
    const snapshot = {
      semesters: semestersRef.current,
      specialization: specializationRef.current,
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
      setSaved(snapshot);
      setSaveError(null);
    } catch {
      setSaveError("This browser blocked saving the draft. Your changes are still on this page.");
    }
  }

  const value: PlanContextValue = {
    semesters,
    specialization,
    dirty,
    hasSaved: saved !== null,
    canUndo: history.length > 0,
    saveError,
    placeCourse,
    removeCourse,
    clearSemester,
    addYear,
    removeYear,
    setSpecialization,
    undo,
    save,
  };

  return <PlanContext.Provider value={value}>{children}</PlanContext.Provider>;
}

export function usePlan() {
  const value = useContext(PlanContext);
  if (!value) throw new Error("usePlan must be used within PlanProvider");
  return value;
}
