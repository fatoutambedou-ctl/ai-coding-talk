import { Suspense } from "react";
import { getCatalog } from "@/lib/api";
import BookingFlow from "@/components/BookingFlow";
import BackendDown from "@/components/BackendDown";
import PageHeader from "@/components/PageHeader";

export const dynamic = "force-dynamic";

export default async function ReserverPage() {
  const catalog = await getCatalog();
  if (!catalog) return <BackendDown />;
  const { salon, services } = catalog;
  return (
    <>
      <PageHeader eyebrow="Réservation · 4 étapes" title="Réserver un rendez-vous" intro="Prestation, date, créneau, coordonnées : c'est tout." />
      <div className="mx-auto max-w-3xl px-5 py-12">
        <Suspense fallback={<p className="text-muted">Chargement…</p>}>
          <BookingFlow services={services} openingHours={salon.openingHours} />
        </Suspense>
      </div>
    </>
  );
}
