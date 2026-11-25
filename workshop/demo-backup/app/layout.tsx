import type { Metadata } from "next";
import "./globals.css";

// Version « hors ligne » du layout : pas de next/font/google,
// pour que la démo démarre même si le Wi-Fi de la salle est coupé.
export const metadata: Metadata = {
  title: "Salon Aminata",
  description: "Réservation en ligne — démo du talk « De l'idée à l'application »",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
