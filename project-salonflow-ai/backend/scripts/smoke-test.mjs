// Test de bout en bout de l'API SalonFlow AI.
// Usage : lancer le backend (npm run dev ou npm start), puis `npm test` dans backend/.
// Attention : crée de vraies réservations de test dans data/bookings.json (npm run reset-data pour vider).
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Même PIN et même origine que le serveur : on lit backend/.env s'il existe.
dotenv.config({ quiet: true, path: path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", ".env") });

const BASE = process.env.BASE_URL ?? "http://localhost:4000";
const PIN = process.env.PRO_PIN || "1234";
const FRONTEND_ORIGIN = (process.env.CORS_ORIGIN || "http://localhost:3000").split(",")[0].trim();
let failures = 0;

function check(label, condition, detail = "") {
  console.log(`${condition ? "OK  " : "FAIL"} ${label}${detail ? ` — ${detail}` : ""}`);
  if (!condition) failures++;
}
async function call(path, init) {
  const res = await fetch(BASE + path, init);
  return { status: res.status, body: await res.json(), headers: res.headers };
}

try {
  await fetch(`${BASE}/api/health`);
} catch {
  console.error(`Le backend ne répond pas sur ${BASE}. Lancez-le d'abord : npm run dev (dans backend/).`);
  process.exit(1);
}

const health = await call("/api/health");
check("GET /api/health répond { status: \"ok\" }", health.status === 200 && health.body.status === "ok");

// Le frontend est autorisé ; un site d'une autre origine est refusé (403, sans en-tête CORS).
const allowed = await call("/api/salon", { headers: { Origin: FRONTEND_ORIGIN } });
const foreign = await call("/api/salon", { headers: { Origin: "http://site-inconnu.example" } });
check(
  "CORS : autre origine refusée, frontend autorisé",
  foreign.status === 403 &&
    !foreign.headers.get("access-control-allow-origin") &&
    allowed.headers.get("access-control-allow-origin") === FRONTEND_ORIGIN,
  `${foreign.status} ${foreign.body.error ?? ""}`,
);

// Trouve le prochain jour ouvert qui a encore un créneau pour « coupe-homme ».
const { body: info } = await call("/api/salon");
check("GET /api/salon renvoie le catalogue", info.services?.length > 0, `${info.services?.length} prestations`);

let date, slot;
for (let i = 1; i <= 14 && !slot; i++) {
  const d = new Date(Date.now() + i * 86400000).toISOString().slice(0, 10);
  const { body } = await call(`/api/slots?serviceId=coupe-homme&date=${d}`);
  const free = body.slots?.find((s) => s.available);
  if (free) { date = d; slot = free; }
}
check("Un créneau libre existe dans les 14 prochains jours", Boolean(slot), `${date} ${slot?.start}`);

const phone = "770000" + String(Math.floor(Math.random() * 1000)).padStart(3, "0");
const create = await call("/api/bookings", {
  method: "POST", headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ serviceId: "coupe-homme", date, start: slot.start, clientName: "Test Démo", clientPhone: phone }),
});
check("POST /api/bookings crée la réservation", create.status === 201, `réf. ${create.body.booking?.id}`);
const id = create.body.booking?.id;

// Le salon a 2 postes : une 2e réservation passe, la 3e doit être refusée.
const again = (n) => call("/api/bookings", {
  method: "POST", headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ serviceId: "coupe-homme", date, start: slot.start, clientName: `Test ${n}`, clientPhone: phone }),
});
const second = await again(2);
const third = await again(3);
check("2e réservation sur le même créneau acceptée (2 postes)", second.status === 201);
check("3e réservation refusée (créneau complet)", third.status === 409, third.body.error);

const invalid = await call("/api/bookings", {
  method: "POST", headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ serviceId: "coupe-homme", date, start: slot.start, clientName: "X", clientPhone: "12" }),
});
check("Données invalides refusées", invalid.status === 400, invalid.body.error);

const mine = await call(`/api/bookings?phone=${phone}`);
check("GET /api/bookings?phone retrouve les rendez-vous", mine.body.bookings?.length === 2);

const wrongPhone = await call(`/api/bookings/${id}?phone=771111111`, { method: "DELETE" });
check("Annulation refusée avec un autre numéro", wrongPhone.status === 404);
const cancel = await call(`/api/bookings/${id}?phone=${phone}`, { method: "DELETE" });
check("Annulation par la cliente", cancel.status === 200 && cancel.body.booking.status === "annule");

const noPin = await call(`/api/pro/agenda?date=${date}`);
check("Agenda pro refusé sans PIN", noPin.status === 401);
const agenda = await call(`/api/pro/agenda?date=${date}`, { headers: { "x-pro-pin": PIN } });
check("Agenda pro accessible avec PIN", agenda.status === 200, `${agenda.body.stats?.count} RDV actif(s)`);

const honore = await call(`/api/pro/bookings/${second.body.booking?.id}`, {
  method: "PATCH", headers: { "Content-Type": "application/json", "x-pro-pin": PIN },
  body: JSON.stringify({ status: "honore" }),
});
check("Le salon marque un RDV comme honoré", honore.body.booking?.status === "honore");

console.log(failures ? `\n${failures} test(s) en échec.` : "\nTous les tests passent.");
process.exit(failures ? 1 : 0);
