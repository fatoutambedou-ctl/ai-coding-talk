import dotenv from "dotenv";
import { createApp } from "./app.js";

dotenv.config({ quiet: true });

const port = Number(process.env.PORT) || 4000;

createApp().listen(port, () => {
  console.log(`API SalonFlow AI : http://localhost:${port}/api/health`);
  console.log(`Origine autorisée (CORS) : ${process.env.CORS_ORIGIN || "http://localhost:3000"}`);
});
