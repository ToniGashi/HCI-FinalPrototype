import type { Metadata } from "next";
import { Source_Sans_3, Source_Serif_4 } from "next/font/google";
import { Shell } from "@/components/shell";
import { PlanProvider } from "@/lib/plan-context";
import "./globals.css";

const sans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source-sans",
  display: "swap",
});

const serif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-source-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "OSCAR · Georgia Tech OMSCS",
    template: "%s · OSCAR",
  },
  description:
    "Plan OMSCS courses semester by semester. A class prototype. Planning does not register you or reserve seats.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${sans.variable} ${serif.variable} min-h-screen bg-paper font-sans text-ink antialiased`}>
        <PlanProvider>
          <Shell>{children}</Shell>
        </PlanProvider>
      </body>
    </html>
  );
}
