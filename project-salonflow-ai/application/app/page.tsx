import Link from "next/link";
import { getCatalog } from "@/lib/api";
import { formatDuration, formatPrice } from "@/lib/format";
import BackendDown from "@/components/BackendDown";

export const dynamic = "force-dynamic";

const DAYS = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

export default async function HomePage() {
  const catalog = await getCatalog();
  if (!catalog) return <BackendDown />;
  const { salon, services } = catalog;
  const categories = Array.from(new Set(services.map((s) => s.category)));

  return (
    <>
      {/* Accueil sombre quadrillé */}
      <section className="night-grid text-white">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 sm:py-24 lg:grid-cols-[1.15fr_1fr]">
          <div>
            <p className="eyebrow flex items-center gap-2 text-white/60">
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-lime" />
              {salon.address}
            </p>
            <h1 className="display mt-5 text-5xl sm:text-7xl">
              {salon.name}.
              <br />
              <span className="text-lime-gradient">Votre créneau en une minute.</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg text-white/70">{salon.tagline}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/reserver" className="rounded-2xl bg-lime px-6 py-3.5 font-bold text-ink hover:brightness-105">
                Réserver un rendez-vous →
              </Link>
              <Link href="/mes-rdv" className="rounded-2xl border border-white/20 px-6 py-3.5 font-bold text-white hover:bg-white/10">
                Voir mes rendez-vous
              </Link>
            </div>
            <p className="mt-4 text-sm text-white/50">Paiement au salon · annulation en ligne avec votre numéro</p>
          </div>

          <aside className="card-dark p-7" aria-labelledby="infos">
            <div className="flex items-center justify-between">
              <h2 id="infos" className="eyebrow text-white/60">Infos pratiques</h2>
              <span className="eyebrow text-white/40">Dakar · GMT</span>
            </div>
            <p className="mt-4 text-xl font-bold">{salon.address}</p>
            <p className="mt-1 font-mono text-sm text-white/60">{salon.phone}</p>
            <ul className="mt-6 space-y-2 border-t border-white/10 pt-5 font-mono text-sm">
              {[1, 2, 3, 4, 5, 6, 0].map((d) => {
                const h = salon.openingHours[String(d)];
                return (
                  <li key={d} className="flex justify-between gap-4">
                    <span className="text-white/70">{DAYS[d]}</span>
                    <span className={`tabular-nums ${h ? "text-white" : "text-white/35"}`}>{h ? `${h[0]} – ${h[1]}` : "Fermé"}</span>
                  </li>
                );
              })}
            </ul>
            <p className="mt-6 flex flex-wrap gap-x-4 gap-y-1 border-t border-white/10 pt-5 font-mono text-sm">
              <span><span className="font-semibold text-lime">{services.length}</span> <span className="text-white/60">prestations</span></span>
              <span><span className="font-semibold text-lime">{salon.seats}</span> <span className="text-white/60">postes</span></span>
              <span><span className="font-semibold text-lime">{salon.slotStepMinutes}</span> <span className="text-white/60">min par créneau</span></span>
            </p>
          </aside>
        </div>
      </section>

      {/* Bandeau citron */}
      <div className="bg-lime text-ink">
        <p className="eyebrow mx-auto flex max-w-6xl flex-wrap justify-center gap-x-5 gap-y-1 px-5 py-4 text-[13px]">
          {categories.map((cat) => (
            <span key={cat}>{cat} ·</span>
          ))}
          <span>Réservation en ligne</span>
        </p>
      </div>

      {/* Catalogue */}
      <section aria-labelledby="prestations" className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
        <p className="eyebrow text-muted">Catalogue</p>
        <h2 id="prestations" className="display mt-3 text-4xl sm:text-5xl">Nos prestations</h2>
        <p className="mt-3 max-w-xl text-muted">Prix fixes en FCFA, durée indiquée pour chaque soin. Choisissez, puis réservez votre créneau.</p>

        {categories.map((cat) => (
          <div key={cat} className="mt-12">
            <h3 className="eyebrow flex items-center gap-3 text-ink">
              {cat}
              <span aria-hidden className="h-px flex-1 bg-line" />
            </h3>
            <ul className="mt-5 grid gap-4 sm:grid-cols-2">
              {services.filter((s) => s.category === cat).map((s) => (
                <li key={s.id} className="flex flex-col rounded-[22px] border border-line bg-white p-6 transition hover:border-ink/30 hover:shadow-[0_20px_50px_-30px_rgba(0,0,0,0.35)]">
                  <p className="text-xl font-bold tracking-tight">{s.name}</p>
                  <p className="mt-1 flex-1 text-sm text-muted">{s.description}</p>
                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                    <p className="font-mono text-sm">
                      <span className="font-semibold tabular-nums">{formatPrice(s.priceFcfa)}</span>
                      <span className="ml-2 rounded-md bg-mist px-2 py-0.5 text-muted">{formatDuration(s.durationMinutes)}</span>
                    </p>
                    <Link
                      href={`/reserver?service=${s.id}`}
                      className="rounded-xl bg-ink px-4 py-2 text-sm font-bold text-white hover:text-lime"
                      aria-label={`Réserver : ${s.name}`}
                    >
                      Réserver →
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      {/* Appel final */}
      <section className="mx-auto max-w-6xl px-5">
        <div className="night-grid flex flex-col items-start justify-between gap-6 rounded-[28px] px-8 py-12 text-white sm:flex-row sm:items-center sm:px-12">
          <div>
            <h2 className="display text-3xl sm:text-4xl">
              Prête pour votre <span className="text-lime-gradient">prochain rendez-vous ?</span>
            </h2>
            <p className="mt-2 text-white/60">Choisissez une prestation, une date et un créneau libre.</p>
          </div>
          <Link href="/reserver" className="shrink-0 rounded-2xl bg-lime px-6 py-3.5 font-bold text-ink hover:brightness-105">
            Réserver maintenant →
          </Link>
        </div>
      </section>
    </>
  );
}
