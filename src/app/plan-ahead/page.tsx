import type { Metadata } from "next";
import { Suspense } from "react";
import { PlanBoard } from "@/components/plan-board";

export const metadata: Metadata = { title: "Plan Ahead" };

export default function PlanAheadPage() {
  return (
    <Suspense fallback={<p className="text-sm text-muted">Loading your plan…</p>}>
      <PlanBoard />
    </Suspense>
  );
}
