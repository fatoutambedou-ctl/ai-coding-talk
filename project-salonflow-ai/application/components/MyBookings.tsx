"use client";

import { useState } from "react";
import type { Booking, Service } from "@/lib/types";
import { nowAtSalon, toMinutes } from "@/lib/time";
import { formatDateLong, formatPrice } from "@/lib/format";
import StatusPill from "@/components/StatusPill";
import { api } from "@/lib/api";

export default function MyBookings({ services }: { services: Service[] }) {
  const [phone, setPhone] = useState("");
  const [bookings, setBookings] = useState<Booking[] | null>(null);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState("");

  async function load(e?: React.FormEvent) {
    e?.preventDefault();
    setError("");
    try {
      const { ok, data } = await api<{ bookings: Booking[] }>(`/api/bookings?phone=${encodeURIComponent(phone)}`);
      if (!ok) {
        setError(data.error ?? "");
        setBookings(null);
      } else setBookings(data.bookings);
    } catch (err) {
      setError((err as Error).message);
      setBookings(null);
    }
  }

  async function cancel(b: Booking) {
    if (!window.confirm(`Annuler le rendez-vous du ${formatDateLong(b.date)} à ${b.start} ?`)) return;
    setBusyId(b.id);
    try {
      const { ok, data } = await api(`/api/bookings/${b.id}?phone=${encodeURIComponent(phone)}`, { method: "DELETE" });
      if (!ok) setError(data.error ?? "");
      else await load();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusyId("");
    }
  }

  const now = nowAtSalon();
  const isUpcoming = (b: Booking) => b.date > now.date || (b.date === now.date && toMinutes(b.start) > now.minutes);

  return (
    <div>
      <form onSubmit={load} className="flex flex-col gap-3 rounded-[22px] border border-line bg-white p-3 sm:flex-row">
        <label className="sr-only" htmlFor="phone">Téléphone</label>
        <input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" inputMode="tel" required
          placeholder="77 123 45 67" className="min-w-0 flex-1 rounded-xl px-4 py-3 font-mono text-lg outline-none" />
        <button className="rounded-xl bg-ink px-6 py-3 font-bold text-white hover:text-lime">Rechercher →</button>
      </form>
      {error && <p className="mt-4 text-sm font-semibold text-danger" role="alert">{error}</p>}

      {bookings && bookings.length === 0 && (
        <p className="mt-8 rounded-2xl border border-dashed border-line p-6 text-muted">
          Aucun rendez-vous pour ce numéro. Vérifiez le numéro ou réservez depuis la page « Réserver ».
        </p>
      )}

      {bookings && bookings.length > 0 && (
        <>
          <p className="eyebrow mt-10 text-muted">{bookings.length} rendez-vous</p>
          <ul className="mt-4 space-y-3">
            {bookings.map((b) => {
              const s = services.find((x) => x.id === b.serviceId);
              const canCancel = b.status === "confirme" && isUpcoming(b);
              return (
                <li key={b.id} className={`rounded-[22px] border border-line bg-white p-5 sm:p-6 ${b.status === "annule" ? "opacity-70" : ""}`}>
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex gap-4">
                      <div className="rounded-xl bg-ink px-3 py-2 text-center font-mono text-white">
                        <p className="text-lg font-semibold tabular-nums text-lime">{b.start}</p>
                        <p className="text-[11px] text-white/60">{b.end}</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold tracking-tight">{s?.name ?? b.serviceId}</p>
                        <p className="text-sm text-muted first-letter:uppercase">{formatDateLong(b.date)}</p>
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <StatusPill status={b.status} />
                          {s && <span className="font-mono text-sm">{formatPrice(s.priceFcfa)}</span>}
                        </div>
                      </div>
                    </div>
                    {canCancel && (
                      <button onClick={() => cancel(b)} disabled={busyId === b.id}
                        className="rounded-xl border border-danger/40 px-4 py-2 text-sm font-bold text-danger hover:bg-danger/5 disabled:opacity-50">
                        {busyId === b.id ? "Annulation…" : "Annuler"}
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}
