import type { Salon, Service } from "./types";

/**
 * Point d'accès unique au backend SalonFlow AI (API Express).
 * L'adresse vient de NEXT_PUBLIC_API_URL (voir .env.example).
 */
export const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000").replace(/\/$/, "");

export const BACKEND_DOWN_MESSAGE =
  "Le serveur de réservation ne répond pas. Lancez le backend (npm run dev dans backend/).";

export type ApiResult<T> = { ok: boolean; status: number; data: T & { error?: string } };

/**
 * Appelle l'API et renvoie le statut et le JSON.
 * Si le backend est injoignable, lève une erreur dont le message est BACKEND_DOWN_MESSAGE.
 */
export async function api<T = Record<string, unknown>>(path: string, init?: RequestInit): Promise<ApiResult<T>> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, { cache: "no-store", ...init });
  } catch {
    throw new Error(BACKEND_DOWN_MESSAGE);
  }
  let data: T & { error?: string };
  try {
    data = await res.json();
  } catch {
    data = { error: `Réponse inattendue du serveur (${res.status}).` } as T & { error?: string };
  }
  return { ok: res.ok, status: res.status, data };
}

export type Catalog = { salon: Salon; services: Service[] };

/** Salon et catalogue, lus à chaque requête (pas de mise en cache). */
export async function getCatalog(): Promise<Catalog | null> {
  try {
    const { ok, data } = await api<Catalog>("/api/salon");
    return ok ? data : null;
  } catch {
    return null;
  }
}
