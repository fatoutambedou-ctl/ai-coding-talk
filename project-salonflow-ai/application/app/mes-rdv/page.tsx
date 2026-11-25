import { getCatalog } from "@/lib/api";
import MyBookings from "@/components/MyBookings";
import BackendDown from "@/components/BackendDown";
import PageHeader from "@/components/PageHeader";

export const dynamic = "force-dynamic";

export default async function MesRdvPage() {
  const catalog = await getCatalog();
  if (!catalog) return <BackendDown />;
  const { services } = catalog;
  return (
    <>
      <PageHeader eyebrow="Espace cliente" title="Mes rendez-vous" intro="Saisissez le numéro utilisé lors de la réservation." />
      <div className="mx-auto max-w-3xl px-5 py-12">
        <MyBookings services={services} />
      </div>
    </>
  );
}
