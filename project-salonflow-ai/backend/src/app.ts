import express, { type NextFunction, type Request, type Response } from "express";
import cors from "cors";
import { salonRouter } from "./routes/salon.js";
import { bookingsRouter } from "./routes/bookings.js";
import { proRouter, requirePin } from "./routes/pro.js";

class ForbiddenOriginError extends Error {}

/** Origines autorisées : CORS_ORIGIN (plusieurs possibles, séparées par des virgules). */
function allowedOrigins(): string[] {
  return (process.env.CORS_ORIGIN || "http://localhost:3000")
    .split(",")
    .map((o) => o.trim().replace(/\/$/, ""))
    .filter(Boolean);
}

export function createApp() {
  const origins = allowedOrigins();
  const app = express();
  app.disable("x-powered-by");

  // Sans en-tête Origin (curl, scripts, rendu serveur de Next.js), la requête passe.
  // Un navigateur sur une autre origine que le frontend reçoit un refus 403.
  app.use(
    cors({
      origin: (origin, callback) =>
        !origin || origins.includes(origin) ? callback(null, true) : callback(new ForbiddenOriginError(origin)),
      allowedHeaders: ["Content-Type", "x-pro-pin"],
    }),
  );

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  // Le PIN est contrôlé avant la lecture du corps, comme dans la version Next.js.
  app.use("/api/pro", requirePin);
  app.use(express.json({ limit: "10kb" }));

  app.use("/api", salonRouter);
  app.use("/api", bookingsRouter);
  app.use("/api/pro", proRouter);

  app.use((req, res) => {
    res.status(404).json({ error: `Route introuvable : ${req.method} ${req.path}` });
  });

  app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof ForbiddenOriginError) {
      return void res.status(403).json({ error: "Origine non autorisée." });
    }
    const type = (err as { type?: string } | null)?.type;
    if (type === "entity.too.large") {
      return void res.status(413).json({ error: "Requête trop volumineuse (10 Ko maximum)." });
    }
    if (type === "entity.parse.failed") {
      return void res.status(400).json({ error: "Requête illisible." });
    }
    console.error(err);
    res.status(500).json({ error: "Erreur interne du serveur. Réessayez dans un instant." });
  });

  return app;
}
