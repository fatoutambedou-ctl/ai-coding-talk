import { promises as fs, readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import type { Booking, Salon, Service } from "./types.js";

/**
 * Persistance volontairement simple : un fichier JSON local.
 * Suffisant pour une démo ; à remplacer par Supabase/PostgreSQL en production.
 */
// backend/data/, que le code tourne depuis src/lib (tsx) ou dist/lib (build).
const DATA_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..", "data");
const DB_FILE = path.join(DATA_DIR, "bookings.json");

const seed = JSON.parse(readFileSync(path.join(DATA_DIR, "seed.json"), "utf8")) as { salon: Salon; services: Service[] };

export const salon = seed.salon;
export const services = seed.services;

export function getService(id: string): Service | undefined {
  return services.find((s) => s.id === id);
}

// File d'attente pour éviter que deux écritures simultanées s'écrasent.
let queue: Promise<unknown> = Promise.resolve();

async function readAll(): Promise<Booking[]> {
  try {
    const raw = await fs.readFile(DB_FILE, "utf8");
    return JSON.parse(raw) as Booking[];
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw err;
  }
}

async function writeAll(bookings: Booking[]): Promise<void> {
  await fs.mkdir(path.dirname(DB_FILE), { recursive: true });
  const tmp = `${DB_FILE}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(bookings, null, 2), "utf8");
  await fs.rename(tmp, DB_FILE);
}

export function listBookings(): Promise<Booking[]> {
  return queue.then(readAll);
}

/** Lit, modifie et réécrit le fichier de façon atomique (une opération à la fois). */
export function updateBookings<T>(fn: (bookings: Booking[]) => T | Promise<T>): Promise<T> {
  const run = queue.then(async () => {
    const bookings = await readAll();
    const result = await fn(bookings);
    await writeAll(bookings);
    return result;
  });
  queue = run.catch(() => undefined);
  return run;
}
