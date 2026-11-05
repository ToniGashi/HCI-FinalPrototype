import { registration } from "@/lib/courses";
import { Pill } from "@/components/ui";

const rows = [
  { label: registration.timeTicketLabel, date: registration.timeTicket },
  { label: registration.registrationEndsLabel, date: registration.registrationEnds },
];

export function MilestonesCard() {
  return (
    <section className="rounded-2xl border border-line bg-white p-5 shadow-[0_8px_30px_rgba(16,40,64,0.04)]">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-navy">Upcoming milestones</h2>
        <Pill tone="gray">Sample Dates</Pill>
      </div>
      <ul className="mt-2">
        {rows.map((row) => (
          <li
            key={row.label}
            className="flex items-center justify-between gap-4 border-b border-line py-4 last:border-b-0"
          >
            <p className="text-sm font-medium text-navy">{row.label}</p>
            <Pill tone="sage">{row.date}</Pill>
          </li>
        ))}
      </ul>
    </section>
  );
}
