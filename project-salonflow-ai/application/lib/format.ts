export function formatPrice(fcfa: number): string {
  return `${fcfa.toLocaleString("fr-FR").replace(/\u202f|\u00a0/g, " ")} FCFA`;
}

export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} min`;
  return m === 0 ? `${h} h` : `${h} h ${String(m).padStart(2, "0")}`;
}

export function formatDateLong(date: string): string {
  return new Intl.DateTimeFormat("fr-FR", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" }).format(
    new Date(`${date}T00:00:00Z`),
  );
}

export function formatDateShort(date: string): { weekday: string; day: string; month: string } {
  const d = new Date(`${date}T00:00:00Z`);
  const f = (o: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat("fr-FR", { ...o, timeZone: "UTC" }).format(d);
  return { weekday: f({ weekday: "short" }).replace(".", ""), day: f({ day: "numeric" }), month: f({ month: "short" }).replace(".", "") };
}

export const STATUS_LABEL = { confirme: "Confirmé", annule: "Annulé", honore: "Honoré" } as const;
