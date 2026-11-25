import { Router, type NextFunction, type Request, type Response } from "express";
import { listBookings, salon, services, updateBookings } from "../lib/store.js";
import { isProRequest } from "../lib/pro-auth.js";
import { isValidDate } from "../lib/time.js";
import type { BookingStatus } from "../lib/types.js";
import { query } from "./query.js";

/** Vérifie le PIN (en-tête x-pro-pin) avant toute autre chose, y compris la lecture du corps. */
export function requirePin(req: Request, res: Response, next: NextFunction) {
  if (!isProRequest(req)) return void res.status(401).json({ error: "Code PIN incorrect." });
  next();
}

export const proRouter = Router();

// Le rétablissement d'un rendez-vous annulé n'est pas proposé : il pourrait créer un surbooking.
const ALLOWED: BookingStatus[] = ["annule", "honore"];

/** Agenda d'une journée pour l'espace professionnel. */
proRouter.get("/agenda", async (req, res) => {
  const date = query(req, "date");
  if (!isValidDate(date)) return void res.status(400).json({ error: "Date invalide." });

  const bookings = (await listBookings())
    .filter((b) => b.date === date)
    .sort((a, b) => a.start.localeCompare(b.start));

  const confirmed = bookings.filter((b) => b.status !== "annule");
  const revenueFcfa = confirmed.reduce((sum, b) => sum + (services.find((s) => s.id === b.serviceId)?.priceFcfa ?? 0), 0);

  res.json({ date, seats: salon.seats, bookings, stats: { count: confirmed.length, revenueFcfa } });
});

/** Le salon change le statut d'un rendez-vous (honoré ou annulé). */
proRouter.patch("/bookings/:id", async (req, res) => {
  const id = req.params.id;
  const body = req.body as { status?: unknown } | undefined;
  if (!body || typeof body !== "object") return void res.status(400).json({ error: "Requête illisible." });

  const status = body.status as BookingStatus;
  if (!ALLOWED.includes(status)) return void res.status(400).json({ error: "Statut inconnu." });

  const booking = await updateBookings((bookings) => {
    const b = bookings.find((x) => x.id === id);
    if (b) b.status = status;
    return b ?? null;
  });
  if (!booking) return void res.status(404).json({ error: "Rendez-vous introuvable." });
  res.json({ booking });
});
