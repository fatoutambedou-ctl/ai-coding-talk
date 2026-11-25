import { Suspense } from "react";
import SalonPage from "@/components/SalonPage";

// SalonPage lit la date du jour : on l'enveloppe dans <Suspense>
// pour qu'elle soit calculée à chaque visite (option cacheComponents de Next.js 16).
export default function Home() {
  return (
    <Suspense fallback={<p className="p-8 text-slate-500">Chargement…</p>}>
      <SalonPage />
    </Suspense>
  );
}
