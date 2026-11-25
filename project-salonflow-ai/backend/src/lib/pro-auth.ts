import type { Request } from "express";

/**
 * Protection minimale de l'espace pro par code PIN (démo).
 * Ce n'est PAS une authentification de production : voir docs/architecture.md.
 */
export function expectedPin(): string {
  return process.env.PRO_PIN && process.env.PRO_PIN.length > 0 ? process.env.PRO_PIN : "1234";
}

export function isProRequest(request: Request): boolean {
  return request.get("x-pro-pin") === expectedPin();
}
