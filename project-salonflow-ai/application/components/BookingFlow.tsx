"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { Booking, Service } from "@/lib/types";
import { addDays, nowAtSalon, weekday } from "@/lib/time";
import { formatDateLong, formatDateShort, formatDuration, formatPrice } from "@/lib/format";
import { api } from "@/lib/api";

type Slot = { start: string; end: string; available: boolean };

export default function BookingFlow({
  services,
  openingHours,
}: {
  services: Service[];
  openingHours: Record<string, [string, string]>;
}) {
  const params = useSearchParams();
  const [serviceId, setServiceId] = useState<string>(() => params.get("service") ?? "");
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState<Slot[] | null>(null);
  const [start, setStart] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [confirmed, setConfirmed] = useState<Booking | null>(null);
  const [reload, setReload] = useState(0);

  const service = services.find((s) => s.id === serviceId);
  const days = useMemo(() => {
    const today = nowAtSalon().date;
    return Array.from({ length: 14 }, (_, i) => addDays(today, i));
  }, []);

  useEffect(() => {
    if (!serviceId || !date) return;
    let cancelled = false;
    setSlots(null);
    setStart("");
    api<{ slots?: Slot[] }>(`/api/slots?serviceId=${serviceId}&date=${date}`)
      .then(({ data }) => !cancelled && setSlots(data.slots ?? []))
      .catch((err: Error) => !cancelled && setError(err.message));
    return () => {
      cancelled = true;
    };
  }, [serviceId, date, reload]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSending(true);
    try {
      const res = await api<{ booking: Booking }>("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serviceId, date, start, clientName: name, clientPhone: phone }),
      });
      const data = res.data;
      if (!res.ok) {
        setError(data.error ?? "La réservation a échoué.");
        if (res.status === 409) setReload((n) => n + 1); // recharge les créneaux à jour
      } else {
        setConfirmed(data.booking);
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSending(false);
    }
  }

  if (confirmed && service) {
    return (
      <div className="card-dark p-8 text-white" role="status">
        <p className="eyebrow flex items-center gap-2 text-lime">
          <span aria-hidden className="grid h-5 w-5 place-items-center rounded-full bg-lime text-[11px] text-ink">✓</span>
          Réservation enregistrée
        </p>
        <h2 className="display mt-4 text-3xl sm:text-4xl">Rendez-vous confirmé</h2>
        <p className="mt-4 text-lg text-white/80">
          {service.name}, {formatDateLong(confirmed.date)} à {confirmed.start} (fin prévue {confirmed.end}).
        </p>
        <dl className="mt-6 grid gap-4 border-t border-white/10 pt-5 font-mono text-sm sm:grid-cols-2">
          <div>
            <dt className="eyebrow text-white/50">Référence</dt>
            <dd className="mt-1 text-lime">{confirmed.id}</dd>
          </div>
          <div>
            <dt className="eyebrow text-white/50">Numéro</dt>
            <dd className="mt-1">{confirmed.clientPhone}</dd>
          </div>
        </dl>
        <p className="mt-4 text-sm text-white/60">Retrouvez ou annulez ce rendez-vous avec ce numéro.</p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link href="/mes-rdv" className="rounded-2xl bg-lime px-5 py-3 font-bold text-ink hover:brightness-105">
            Voir mes rendez-vous →
          </Link>
          <button
            type="button"
            onClick={() => {
              setConfirmed(null);
              setDate("");
              setStart("");
            }}
            className="rounded-2xl border border-white/20 px-5 py-3 font-bold hover:bg-white/10"
          >
            Réserver une autre prestation
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-12">
      <fieldset className="min-w-0">
        <Step n={1}>Prestation</Step>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {services.map((s) => (
            <label
              key={s.id}
              className={`cursor-pointer rounded-2xl border p-5 transition ${
                s.id === serviceId ? "border-ink bg-ink text-white" : "border-line bg-white hover:border-ink/40"
              }`}
            >
              <input type="radio" name="service" value={s.id} checked={s.id === serviceId} onChange={() => setServiceId(s.id)} className="sr-only" />
              <span className="block text-lg font-bold tracking-tight">{s.name}</span>
              <span className={`mt-1 block font-mono text-sm ${s.id === serviceId ? "text-lime" : "text-muted"}`}>
                {formatDuration(s.durationMinutes)} · {formatPrice(s.priceFcfa)}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      {service && (
        <fieldset className="min-w-0">
          <Step n={2}>Date</Step>
          <div className="mt-5 flex gap-2 overflow-x-auto pb-2">
            {days.map((d) => {
              const closed = !openingHours[String(weekday(d))];
              const f = formatDateShort(d);
              return (
                <button
                  key={d}
                  type="button"
                  disabled={closed}
                  onClick={() => setDate(d)}
                  aria-pressed={d === date}
                  aria-label={closed ? `${formatDateLong(d)}, fermé` : formatDateLong(d)}
                  className={`flex w-[4.5rem] shrink-0 flex-col items-center rounded-2xl border py-3 transition ${
                    d === date
                      ? "border-ink bg-ink text-white"
                      : closed
                        ? "border-line bg-mist/60 text-muted/50 line-through"
                        : "border-line bg-white hover:border-ink/40"
                  }`}
                >
                  <span className="eyebrow text-[11px]">{f.weekday}</span>
                  <span className={`mt-1 text-2xl font-extrabold tracking-tight ${d === date ? "text-lime" : ""}`}>{f.day}</span>
                  <span className="text-xs">{f.month}</span>
                </button>
              );
            })}
          </div>
        </fieldset>
      )}

      {service && date && (
        <fieldset className="min-w-0">
          <Step n={3}>Créneau</Step>
          {slots === null ? (
            <p className="mt-5 text-muted">Recherche des créneaux…</p>
          ) : slots.filter((s) => s.available).length === 0 ? (
            <p className="mt-5 rounded-2xl border border-line bg-white p-5 text-muted">
              Plus aucun créneau ce jour-là pour cette prestation. Essayez une autre date.
            </p>
          ) : (
            <div className="mt-5 grid grid-cols-4 gap-2 sm:grid-cols-6">
              {slots.map((s) => (
                <button
                  key={s.start}
                  type="button"
                  disabled={!s.available}
                  onClick={() => setStart(s.start)}
                  aria-pressed={s.start === start}
                  className={`rounded-xl border py-2.5 font-mono text-sm tabular-nums transition ${
                    s.start === start
                      ? "border-lime bg-lime font-semibold text-ink"
                      : s.available
                        ? "border-line bg-white hover:border-ink/40"
                        : "border-transparent bg-mist text-muted/50 line-through"
                  }`}
                >
                  {s.start}
                </button>
              ))}
            </div>
          )}
        </fieldset>
      )}

      {service && date && start && (
        <fieldset className="min-w-0">
          <Step n={4}>Vos coordonnées</Step>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="eyebrow text-muted">Nom</span>
              <input value={name} onChange={(e) => setName(e.target.value)} required minLength={2} maxLength={60} autoComplete="name"
                className="mt-2 w-full rounded-xl border border-line bg-white px-4 py-3 outline-none focus:border-ink" />
            </label>
            <label className="block">
              <span className="eyebrow text-muted">Téléphone</span>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} required type="tel" inputMode="tel" autoComplete="tel" placeholder="77 123 45 67"
                className="mt-2 w-full rounded-xl border border-line bg-white px-4 py-3 outline-none focus:border-ink" />
            </label>
          </div>
          <div className="card-dark mt-6 p-6 text-white">
            <p className="eyebrow text-white/50">Récapitulatif</p>
            <p className="mt-2 text-lg font-bold">{service.name}</p>
            <p className="mt-1 font-mono text-sm text-white/70">
              {formatDateLong(date)} · {start} · <span className="text-lime">{formatPrice(service.priceFcfa)}</span>, à régler au salon
            </p>
          </div>
          {error && <p className="mt-4 text-sm font-semibold text-danger" role="alert">{error}</p>}
          <button type="submit" disabled={sending} className="mt-6 w-full rounded-2xl bg-lime py-4 text-lg font-bold text-ink hover:brightness-105 disabled:opacity-60">
            {sending ? "Réservation en cours…" : "Confirmer la réservation →"}
          </button>
        </fieldset>
      )}
      {error && !(service && date && start) && <p className="text-sm font-semibold text-danger" role="alert">{error}</p>}
    </form>
  );
}

/** Titre d'étape : numéro en police mono sur fond sombre. */
function Step({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <legend className="flex items-center gap-3">
      <span className="eyebrow rounded-lg bg-ink px-2.5 py-1 text-lime">0{n}</span>
      <span className="text-2xl font-extrabold tracking-tight">{children}</span>
    </legend>
  );
}
