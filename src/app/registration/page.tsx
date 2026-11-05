import type { Metadata } from "next";
import { RegistrationView } from "@/components/registration-view";

export const metadata: Metadata = { title: "Registration" };

export default function RegistrationPage() {
  return <RegistrationView />;
}
