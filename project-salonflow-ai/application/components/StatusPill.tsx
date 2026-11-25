import type { BookingStatus } from "@/lib/types";
import { STATUS_LABEL } from "@/lib/format";

const STYLE: Record<BookingStatus, { pill: string; dot: string }> = {
  confirme: { pill: "bg-lime/50 text-ink", dot: "bg-ink" },
  honore: { pill: "bg-success/15 text-success", dot: "bg-success" },
  annule: { pill: "bg-mist text-muted line-through", dot: "bg-muted" },
};

/** Pastille de statut d'un rendez-vous. */
export default function StatusPill({ status }: { status: BookingStatus }) {
  const s = STYLE[status];
  return (
    <span className={`eyebrow inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] ${s.pill}`}>
      <span aria-hidden className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {STATUS_LABEL[status]}
    </span>
  );
}
