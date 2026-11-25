import { BACKEND_DOWN_MESSAGE } from "@/lib/api";

/** Affiché quand le backend ne répond pas. */
export default function BackendDown() {
  return (
    <section className="night-grid text-white">
      <div className="mx-auto max-w-3xl px-5 py-20">
        <div className="card-dark p-8" role="alert">
          <p className="eyebrow flex items-center gap-2 text-white/60">
            <span aria-hidden className="h-2 w-2 rounded-full bg-[#e5484d]" />
            Serveur hors ligne
          </p>
          <p className="display mt-4 text-2xl sm:text-3xl">{BACKEND_DOWN_MESSAGE}</p>
          <p className="mt-4 font-mono text-sm text-white/60">Rechargez la page une fois le serveur démarré.</p>
        </div>
      </div>
    </section>
  );
}
