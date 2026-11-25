import type { Request } from "express";

/** Lit un paramètre d'URL comme une chaîne (chaîne vide s'il est absent ou répété). */
export function query(req: Request, name: string): string {
  const value = req.query[name];
  return typeof value === "string" ? value : "";
}
