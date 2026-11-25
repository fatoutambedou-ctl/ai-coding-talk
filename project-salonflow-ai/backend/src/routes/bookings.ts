import { Router } from "express";
import { randomUUID } from "crypto";
import { getService, listBookings, salon, updateBookings } from "../lib/store.js";
import { computeSlots } from "../lib/slots.js";
import { isValidDate, nowAtSalon, toMinutes } from "../lib/time.js";
import { isValidName, isValidPhone, normalizePhone } from "../lib/validation.js";
import type { Booking } from "../lib/types.js";
import { query } from "./query.js";

export const bookingsRouter = Router();

/** Liste les rendez-vous d'une cliente, retrouvés par numéro de téléphone. */
bookingsRouter.get("/bookings", async (req, res) => {
  const phone = normalizePhone(query(req, "phone"));
  if (!isValidPhone(phone)) return void res.status(400).json({ error: "Numéro de téléphone invalide." });

  const bookings = (await listBookings())
    .filter((b) => b.clientPhone === phone)
    .sort((a, b) => `${a.date} ${a.start}`.localeCompare(`${b.date} ${b.start}`));
  res.json({ bookings });
});

/** Crée une réservation après revérification du créneau. */
bookingsRouter.post("/bookings", async (req, res) => {
  const body = req.body as Record<string, unknown> | undefined;
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return void res.status(400).json({ error: "Requête illisible." });
  }

  const serviceId = String(body.serviceId ?? "");
  const date = String(body.date ?? "");
  const start = String(body.start ?? "");
  const clientName = String(body.clientName ?? "").trim();
  const clientPhone = normalizePhone(String(body.clientPhone ?? ""));

  const service = getService(serviceId);
  if (!service) return void res.status(400).json({ error: "Prestation inconnue." });
  if (!isValidDate(date)) return void res.status(400).json({ error: "Date invalide." });
  if (!isValidName(clientName)) return void res.status(400).json({ error: "Indiquez un nom de 2 à 60 caractères." });
  if (!isValidPhone(clientPhone)) return void res.status(400).json({ error: "Indiquez un numéro de téléphone valide." });

  // Le créneau est recalculé dans la même opération d'écriture : pas de surbooking possible.
  const result = await updateBookings((bookings) => {
    const slot = computeSlots(salon, service, date, bookings).find((s) => s.start === start);
    if (!slot || !slot.available) return null;
    const booking: Booking = {
      id: randomUUID().slice(0, 8),
      serviceId,
      date,
      start: slot.start,
      end: slot.end,
      clientName,
      clientPhone,
      status: "confirme",
      createdAt: new Date().toISOString(),
    };
    bookings.push(booking);
    return booking;
  });

  if (!result) {
    return void res.status(409).json({ error: "Ce créneau n'est plus disponible. Choisissez-en un autre." });
  }
  res.status(201).json({ booking: result });
});

/** Annulation par la cliente : le numéro doit correspondre et le rendez-vous être à venir. */
bookingsRouter.delete("/bookings/:id", async (req, res) => {
  const id = req.params.id;
  const phone = normalizePhone(query(req, "phone"));

  const outcome = await updateBookings((bookings) => {
    const booking = bookings.find((b) => b.id === id);
    if (!booking || booking.clientPhone !== phone) return "introuvable" as const;
    if (booking.status !== "confirme") return "deja" as const;
    const now = nowAtSalon();
    if (booking.date < now.date || (booking.date === now.date && toMinutes(booking.start) <= now.minutes)) {
      return "passe" as const;
    }
    booking.status = "annule";
    return booking;
  });

  if (outcome === "introuvable") return void res.status(404).json({ error: "Rendez-vous introuvable pour ce numéro." });
  if (outcome === "deja") return void res.status(409).json({ error: "Ce rendez-vous n'est plus actif." });
  if (outcome === "passe") return void res.status(409).json({ error: "Un rendez-vous passé ne peut plus être annulé." });
  res.json({ booking: outcome });
});
