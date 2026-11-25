import { getCatalog } from "@/lib/api";
import ProAgenda from "@/components/ProAgenda";
import BackendDown from "@/components/BackendDown";
import PageHeader from "@/components/PageHeader";

export const dynamic = "force-dynamic";

export default async function ProPage() {
  const catalog = await getCatalog();
  if (!catalog) return <BackendDown />;
  const { services } = catalog;
  return (
    <>
      <PageHeader eyebrow="Accès salon · PIN" title="Espace professionnel" intro="L'agenda du jour, le chiffre prévu et le suivi de chaque rendez-vous." />
      <div className="mx-auto max-w-5xl px-5 py-12">
        <ProAgenda services={services} />
      </div>
    </>
  );
}
