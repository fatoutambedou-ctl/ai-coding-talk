import { Router } from "express";
import { getService, listBookings, salon, services } from "../lib/store.js";
import { computeSlots } from "../lib/slots.js";
import { isValidDate } from "../lib/time.js";
import { query } from "./query.js";

export const salonRouter = Router();

/** Salon et catalogue. */
salonRouter.get("/salon", (_req, res) => {
  res.json({ salon, services });
});

/** Créneaux d'un jour pour une prestation, libres ou non. */
salonRouter.get("/slots", async (req, res) => {
  const serviceId = query(req, "serviceId");
  const date = query(req, "date");

  const service = getService(serviceId);
  if (!service) return void res.status(400).json({ error: "Prestation inconnue." });
  if (!isValidDate(date)) return void res.status(400).json({ error: "Date invalide (format AAAA-MM-JJ)." });

  const slots = computeSlots(salon, service, date, await listBookings());
  res.json({ date, serviceId, slots });
});
