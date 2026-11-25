import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Racine explicite : évite que Next.js choisisse un package-lock.json situé plus haut sur le disque.
  turbopack: { root: path.resolve(__dirname) },
  // Pas de fichier AGENTS.md généré automatiquement par next dev.
  agentRules: false,
  // Pas de bulle « N » de développement à l'écran (démo, captures).
  devIndicators: false,
};

export default nextConfig;
