export type Prestation = { id: string; nom: string; prixFcfa: number; dureeMinutes: number };

export const salon = {
  nom: "Salon Aminata",
  adresse: "Sacré-Cœur 3, Dakar",
  ouverture: "09:00",
  fermeture: "19:00",
};

export const prestations: Prestation[] = [
  { id: "tresses", nom: "Tresses (box braids)", prixFcfa: 25000, dureeMinutes: 240 },
  { id: "nattes", nom: "Nattes collées", prixFcfa: 8000, dureeMinutes: 90 },
  { id: "vanilles", nom: "Vanilles", prixFcfa: 15000, dureeMinutes: 150 },
  { id: "soin", nom: "Soin profond", prixFcfa: 7000, dureeMinutes: 60 },
  { id: "brushing", nom: "Brushing", prixFcfa: 5000, dureeMinutes: 45 },
  { id: "coupe-homme", nom: "Coupe homme", prixFcfa: 3000, dureeMinutes: 30 },
];

export function prix(fcfa: number) {
  return `${fcfa.toLocaleString("fr-FR").replace(/\u202f|\u00a0/g, " ")} FCFA`;
}

export function duree(min: number) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return h === 0 ? `${m} min` : m === 0 ? `${h} h` : `${h} h ${m}`;
}

/** Les 7 prochains jours (AAAA-MM-JJ), dimanche marqué comme fermé. */
export function prochainsJours() {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    return {
      iso,
      label: d.toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" }),
      ferme: d.getDay() === 0,
    };
  });
}

/** Créneaux de 30 min entre l'ouverture et la fermeture, compte tenu de la durée. */
export function creneaux(dureeMinutes: number) {
  const debut = 9 * 60;
  const fin = 19 * 60;
  const liste: string[] = [];
  for (let t = debut; t + dureeMinutes <= fin; t += 30) {
    liste.push(`${String(Math.floor(t / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`);
  }
  return liste;
}
