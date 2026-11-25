"use client";

import { useState } from "react";
import { creneaux, duree, prestations, prix, prochainsJours, salon } from "@/lib/salon-data";

type Reservation = { prestationId: string; date: string; heure: string; nom: string; telephone: string };

export default function SalonPage() {
  const [prestationId, setPrestationId] = useState("");
  const [date, setDate] = useState("");
  const [heure, setHeure] = useState("");
  const [nom, setNom] = useState("");
  const [telephone, setTelephone] = useState("");
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [confirmation, setConfirmation] = useState<Reservation | null>(null);

  const prestation = prestations.find((p) => p.id === prestationId);
  const jours = prochainsJours();
  const pris = new Set(reservations.filter((r) => r.date === date).map((r) => r.heure));

  function reserver(e: React.FormEvent) {
    e.preventDefault();
    const r = { prestationId, date, heure, nom, telephone };
    setReservations([...reservations, r]);
    setConfirmation(r);
    setHeure("");
    setNom("");
    setTelephone("");
  }

  return (
    <main className="mx-auto min-h-screen max-w-2xl bg-white px-5 pb-16 text-slate-900">
      <header className="-mx-5 bg-indigo-700 px-5 py-10 text-white">
        <h1 className="text-4xl font-bold">{salon.nom}</h1>
        <p className="mt-2 text-indigo-100">{salon.adresse} · {salon.ouverture} – {salon.fermeture}, fermé le dimanche</p>
        <a href="#reserver" className="mt-6 inline-block rounded-full bg-white px-5 py-2.5 font-semibold text-indigo-700">Réserver</a>
      </header>

      <section className="mt-10">
        <h2 className="text-2xl font-bold">Nos prestations</h2>
        <ul className="mt-4 divide-y divide-slate-200">
          {prestations.map((p) => (
            <li key={p.id} className="flex justify-between py-3">
              <span className="font-medium">{p.nom}</span>
              <span className="text-right text-slate-600">{prix(p.prixFcfa)} · {duree(p.dureeMinutes)}</span>
            </li>
          ))}
        </ul>
      </section>

      <section id="reserver" className="mt-12">
        <h2 className="text-2xl font-bold">Réserver</h2>
        {confirmation ? (
          <div className="mt-4 rounded-xl bg-indigo-50 p-5" role="status">
            <p className="font-semibold">Réservation confirmée, {confirmation.nom} !</p>
            <p className="mt-1">
              {prestations.find((p) => p.id === confirmation.prestationId)?.nom}, le {confirmation.date} à {confirmation.heure}.
            </p>
            <button onClick={() => setConfirmation(null)} className="mt-4 font-semibold text-indigo-700 underline">Nouvelle réservation</button>
          </div>
        ) : (
          <form onSubmit={reserver} className="mt-4 space-y-6">
            <label className="block">
              <span className="text-sm font-medium">Prestation</span>
              <select value={prestationId} onChange={(e) => { setPrestationId(e.target.value); setHeure(""); }} required
                className="mt-1 w-full rounded-lg border border-slate-300 p-2.5">
                <option value="">Choisir…</option>
                {prestations.map((p) => <option key={p.id} value={p.id}>{p.nom} — {prix(p.prixFcfa)}</option>)}
              </select>
            </label>

            <div>
              <span className="text-sm font-medium">Date</span>
              <div className="mt-1 flex flex-wrap gap-2">
                {jours.map((j) => (
                  <button key={j.iso} type="button" disabled={j.ferme} onClick={() => { setDate(j.iso); setHeure(""); }}
                    className={`rounded-lg border px-3 py-2 text-sm ${date === j.iso ? "border-indigo-700 bg-indigo-700 text-white" : "border-slate-300"} disabled:opacity-40 disabled:line-through`}>
                    {j.label}
                  </button>
                ))}
              </div>
            </div>

            {prestation && date && (
              <div>
                <span className="text-sm font-medium">Créneau</span>
                <div className="mt-1 grid grid-cols-4 gap-2">
                  {creneaux(prestation.dureeMinutes).map((h) => (
                    <button key={h} type="button" disabled={pris.has(h)} onClick={() => setHeure(h)}
                      className={`rounded-lg border py-2 text-sm ${heure === h ? "border-indigo-700 bg-indigo-700 text-white" : "border-slate-300"} disabled:opacity-40`}>
                      {h}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {heure && (
              <div className="space-y-3">
                <input value={nom} onChange={(e) => setNom(e.target.value)} required placeholder="Votre nom" className="w-full rounded-lg border border-slate-300 p-2.5" />
                <input value={telephone} onChange={(e) => setTelephone(e.target.value)} required type="tel" placeholder="Téléphone" className="w-full rounded-lg border border-slate-300 p-2.5" />
                <button className="w-full rounded-full bg-indigo-700 py-3 font-semibold text-white">Confirmer la réservation</button>
              </div>
            )}
          </form>
        )}
      </section>
    </main>
  );
}
