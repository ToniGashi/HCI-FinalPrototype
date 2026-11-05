import type { Metadata } from "next";
import { RequirementsView } from "@/components/requirements-view";

export const metadata: Metadata = { title: "Degree requirements" };

export default function DegreeRequirementsPage() {
  return <RequirementsView />;
}
