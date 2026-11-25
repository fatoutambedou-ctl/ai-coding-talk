"use client";

import { useCallback, useEffect, useState } from "react";
import type { Booking, BookingStatus, Service } from "@/lib/types";
import { addDays, nowAtSalon } from "@/lib/time";
import { formatDateLong, formatDuration, formatPrice } from "@/lib/format";
import { api } from "@/lib/api";
import StatusPill from "@/components/StatusPill";

type Agenda = { date: string; seats: number; bookings: Booking[]; stats: { count: number; revenueFcfa: number } };

export default function ProAgenda({ services }: { services: Service[] }) {
  const [pin, setPin] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [date, setDate] = useState(() => nowAtSalon().date);
  const [agenda, setAgenda] = useState<Agenda | null>(null);
  const [error, setError] = useState("");

  const load = useCallback(async (d: string, p: string) => {
    try {
      const { ok, data } = await api<Agenda>(`/api/pro/agenda?date=${d}`, { headers: { "x-pro-pin": p } });
      if (!ok) {
        setError(data.error ?? "");
        return false;
      }
      setError("");
      setAgenda(data);
      return true;
    } catch (err) {
      setError((err as Error).message);
      return false;
    }
  }, []);

  useEffect(() => {
    if (unlocked) load(date, pin);
  }, [unlocked, date, pin, load]);

  async function unlock(e: React.FormEvent) {
    e.preventDefault();
    if (await load(date, pin)) setUnlocked(true);
  }

  async function setStatus(b: Booking, status: BookingStatus) {
    if (status === "annule" && !window.confirm(`Annuler le rendez-vous de ${b.clientName} à ${b.start} ?`)) return;
    try {
      const { ok, data } = await api(`/api/pro/bookings/${b.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "x-pro-pin": pin },
        body: JSON.stringify({ status }),
      });
      if (!ok) setError(data.error ?? "");
    } catch (err) {
      setError((err as Error).message);
      return;
    }
    await load(date, pin);
  }

  if (!unlocked) {
    return (
      <form onSubmit={unlock} className="card-dark max-w-md space-y-5 p-7 text-white">
        <p className="eyebrow flex items-center gap-2 text-white/60">
          <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-lime" />
          Accès réservé au salon
        </p>
        <label className="block">
          <span className="text-lg font-bold">Code PIN du salon</span>
          <input value={pin} onChange={(e) => setPin(e.target.value)} type="password" inputMode="numeric" required
            className="mt-3 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 font-mono text-xl tracking-[0.4em] text-white outline-none focus:border-lime" />
        </label>
        {error && <p className="text-sm font-semibold text-[#ff8a8f]" role="alert">{error}</p>}
        <button className="w-full rounded-2xl bg-lime py-3.5 font-bold text-ink hover:brightness-105">Ouvrir l&apos;agenda →</button>
        <p className="font-mono text-xs text-white/50">Démo : PIN défini par PRO_PIN dans backend/.env (1234 si absent).</p>
      </form>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <button onClick={() => setDate(addDays(date, -1))} className="grid h-10 w-10 place-items-center rounded-xl border border-line bg-white text-lg font-bold hover:border-ink/40" aria-label="Jour précédent">‹</button>
        <h2 className="min-w-56 text-center text-2xl font-extrabold tracking-tight first-letter:uppercase">{formatDateLong(date)}</h2>
        <button onClick={() => setDate(addDays(date, 1))} className="grid h-10 w-10 place-items-center rounded-xl border border-line bg-white text-lg font-bold hover:border-ink/40" aria-label="Jour suivant">›</button>
        <button onClick={() => setDate(nowAtSalon().date)} className="eyebrow rounded-lg bg-ink px-3 py-2 text-lime">Aujourd&apos;hui</button>
      </div>

      {agenda && (
        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          <Stat label="Rendez-vous actifs" value={String(agenda.stats.count)} />
          <Stat label="Chiffre prévu" value={formatPrice(agenda.stats.revenueFcfa)} accent />
          <Stat label="Postes" value={String(agenda.seats)} />
        </div>
      )}
      {error && <p className="mt-4 text-sm font-semibold text-danger" role="alert">{error}</p>}

      {agenda && agenda.bookings.length === 0 && (
        <p className="mt-8 rounded-2xl border border-dashed border-line p-6 text-muted">Aucun rendez-vous ce jour-là.</p>
      )}
      {agenda && agenda.bookings.length > 0 && (
        <ol className="mt-8 space-y-3">
          {agenda.bookings.map((b) => {
            const s = services.find((x) => x.id === b.serviceId);
            return (
              <li key={b.id} className="grid grid-cols-[76px_1fr] gap-4 rounded-[22px] border border-line bg-white p-5 sm:grid-cols-[76px_1fr_auto] sm:items-center">
                <div className="rounded-xl bg-ink px-2 py-2 text-center font-mono tabular-nums text-white">
                  <p className="text-lg font-semibold text-lime">{b.start}</p>
                  <p className="text-[11px] text-white/60">{b.end}</p>
                </div>
                <div>
                  <p className="text-lg font-bold tracking-tight">{b.clientName}</p>
                  <p className="font-mono text-sm text-muted">{s?.name} · {s ? formatDuration(s.durationMinutes) : ""} · {b.clientPhone}</p>
                  <div className="mt-2"><StatusPill status={b.status} /></div>
                </div>
                {b.status === "confirme" && (
                  <div className="col-span-2 flex gap-2 sm:col-span-1 sm:flex-col">
                    <button onClick={() => setStatus(b, "honore")} className="rounded-xl bg-ink px-4 py-2 text-sm font-bold text-white hover:text-lime">Marquer honoré</button>
                    <button onClick={() => setStatus(b, "annule")} className="rounded-xl border border-danger/40 px-4 py-2 text-sm font-bold text-danger hover:bg-danger/5">Annuler</button>
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}

/** Indicateur chiffré sur carte sombre. */
function Stat({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="card-dark p-5 text-white">
      <p className="eyebrow text-white/50">{label}</p>
      <p className={`mt-2 text-3xl font-extrabold tabular-nums tracking-tight ${accent ? "text-lime" : ""}`}>{value}</p>
    </div>
  );
}
