// Remet l'agenda à zéro (utile avant une démo).
import { rm } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const file = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "data", "bookings.json");
await rm(file, { force: true });
await rm(`${file}.tmp`, { force: true });
console.log("Agenda vidé :", file);
