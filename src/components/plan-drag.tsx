"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type DragEvent as ReactDragEvent,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
} from "react";
import type { Course } from "@/lib/courses";

type Active = { id: string; width: number };

const interactiveSelector = "button, a, select, input, textarea, label";

export function useCourseDrag(onDrop: (courseId: string, zone: string | null) => void) {
  const [active, setActive] = useState<Active | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const point = useRef({ x: 0, y: 0, ox: 0, oy: 0 });
  const skipClick = useRef(false);
  const blockNative = useRef(false);
  const draggingRef = useRef(false);
  const onDropRef = useRef(onDrop);
  const cleanupRef = useRef<(() => void) | null>(null);
  onDropRef.current = onDrop;

  const placeOverlay = () => {
    const element = overlayRef.current;
    if (!element) return;
    const { x, y, ox, oy } = point.current;
    element.style.transform = `translate3d(${x - ox}px, ${y - oy}px, 0)`;
  };

  useLayoutEffect(() => {
    const element = overlayRef.current;
    if (!element || !active) return;
    element.style.width = `${active.width}px`;
    placeOverlay();
  }, [active]);

  useEffect(() => () => cleanupRef.current?.(), []);

  useEffect(() => {
    document.body.style.cursor = active ? "grabbing" : "";
    return () => {
      document.body.style.cursor = "";
    };
  }, [active]);

  function markClickSkipped() {
    skipClick.current = true;
    window.setTimeout(() => {
      skipClick.current = false;
    }, 80);
  }

  function bind(courseId: string) {
    return {
      draggable: true,
      onPointerDown(event: ReactPointerEvent<HTMLElement>) {
        const target = event.target as HTMLElement;
        const interactive = Boolean(target.closest(interactiveSelector));
        blockNative.current = interactive;
        if (interactive || event.button !== 0 || event.pointerType !== "touch") return;

        const rect = event.currentTarget.getBoundingClientRect();
        const startX = event.clientX;
        const startY = event.clientY;
        point.current = {
          x: startX,
          y: startY,
          ox: startX - rect.left,
          oy: startY - rect.top,
        };

        let started = false;
        let zone: string | null = null;

        const detach = () => {
          window.removeEventListener("pointermove", move);
          window.removeEventListener("pointerup", finish);
          window.removeEventListener("pointercancel", finish);
          cleanupRef.current = null;
        };

        const move = (ev: PointerEvent) => {
          point.current.x = ev.clientX;
          point.current.y = ev.clientY;
          if (!started) {
            if (Math.hypot(ev.clientX - startX, ev.clientY - startY) < 8) return;
            started = true;
            setActive({ id: courseId, width: Math.min(rect.width, 360) });
          }
          placeOverlay();
          const next = dropZoneAt(ev.clientX, ev.clientY);
          if (next !== zone) {
            zone = next;
            setOverId(next);
          }
        };

        const finish = (ev: PointerEvent) => {
          detach();
          if (!started) return;
          started = false;
          const destination = dropZoneAt(ev.clientX, ev.clientY);
          markClickSkipped();
          setActive(null);
          setOverId(null);
          onDropRef.current(courseId, destination);
        };

        cleanupRef.current = detach;
        window.addEventListener("pointermove", move);
        window.addEventListener("pointerup", finish);
        window.addEventListener("pointercancel", finish);
      },
      onDragStart(event: ReactDragEvent<HTMLElement>) {
        if (blockNative.current) {
          event.preventDefault();
          return;
        }
        draggingRef.current = true;
        event.dataTransfer.setData("text/plain", courseId);
        event.dataTransfer.effectAllowed = "move";
        const rect = event.currentTarget.getBoundingClientRect();
        setActive({ id: courseId, width: Math.min(rect.width, 360) });
      },
      onDragEnd() {
        draggingRef.current = false;
        if (!blockNative.current) markClickSkipped();
        setActive(null);
        setOverId(null);
      },
    };
  }

  function zone(zoneId: string) {
    return {
      "data-dropzone": zoneId,
      onDragOver(event: ReactDragEvent<HTMLElement>) {
        event.preventDefault();
        if (!draggingRef.current) return;
        event.dataTransfer.dropEffect = "move";
        setOverId((current) => (current === zoneId ? current : zoneId));
      },
      onDrop(event: ReactDragEvent<HTMLElement>) {
        event.preventDefault();
        draggingRef.current = false;
        const courseId = event.dataTransfer.getData("text/plain");
        setActive(null);
        setOverId(null);
        if (courseId) onDropRef.current(courseId, zoneId);
      },
    };
  }

  function consumeClick() {
    if (!skipClick.current) return false;
    skipClick.current = false;
    return true;
  }

  return { active, overId, overlayRef, bind, zone, consumeClick };
}

function dropZoneAt(x: number, y: number) {
  const element = document.elementFromPoint(x, y);
  return element?.closest("[data-dropzone]")?.getAttribute("data-dropzone") ?? null;
}

export function DragPreview({
  course,
  overlayRef,
}: {
  course: Course | null;
  overlayRef: RefObject<HTMLDivElement | null>;
}) {
  if (!course) return null;
  return (
    <div
      ref={overlayRef}
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-[70] cursor-grabbing rounded-xl border border-gold bg-white p-3 shadow-[0_18px_40px_rgba(16,40,64,0.2)]"
      style={{ transform: "translate3d(-9999px, -9999px, 0)" }}
    >
      <p className="text-sm font-semibold text-navy">{course.code}</p>
      <p className="mt-0.5 text-sm text-ink">{course.title}</p>
      <p className="mt-2 text-xs font-medium text-gold-deep">Drop onto a semester</p>
    </div>
  );
}
