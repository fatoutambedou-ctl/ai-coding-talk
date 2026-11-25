import type { Metadata } from "next";
import Link from "next/link";
import "@fontsource/schibsted-grotesk/400.css";
import "@fontsource/schibsted-grotesk/600.css";
import "@fontsource/schibsted-grotesk/700.css";
import "@fontsource/schibsted-grotesk/800.css";
import "@fontsource/ibm-plex-mono/500.css";
import "@fontsource/ibm-plex-mono/600.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "SalonFlow AI — Salon Aminata",
  description: "Réservez votre prestation au Salon Aminata, à Dakar.",
};

const NAV = [
  { href: "/", label: "Le salon" },
  { href: "/mes-rdv", label: "Mes rendez-vous" },
  { href: "/pro", label: "Espace pro" },
];

function Logo() {
  return (
    <span aria-hidden className="grid h-8 w-8 place-items-center rounded-lg bg-lime font-display text-lg font-extrabold text-ink">
      A
    </span>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="min-h-screen">
        <header className="sticky top-0 z-20 border-b border-white/10 bg-night/95 text-white backdrop-blur">
          <div className="mx-auto grid max-w-6xl grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 px-5 py-3 sm:grid-cols-[auto_1fr_auto]">
            <Link href="/" className="col-start-1 row-start-1 flex items-center gap-2.5 text-lg font-bold tracking-tight">
              <Logo />
              Salon Aminata
            </Link>
            <nav
              aria-label="Navigation principale"
              className="col-span-2 col-start-1 row-start-2 -mx-2 flex items-center gap-1 overflow-x-auto text-sm font-semibold sm:col-span-1 sm:col-start-2 sm:row-start-1 sm:mx-0 sm:justify-end sm:text-[15px]"
            >
              {NAV.map((item) => (
                <Link key={item.href} href={item.href} className="shrink-0 rounded-lg px-2.5 py-1.5 text-white/80 hover:bg-white/10 hover:text-white sm:px-3">
                  {item.label}
                </Link>
              ))}
            </nav>
            <Link href="/reserver" className="col-start-2 row-start-1 rounded-xl bg-lime px-4 py-2 text-sm font-bold text-ink hover:brightness-105 sm:col-start-3">
              Réserver
            </Link>
          </div>
        </header>
        <main>{children}</main>
        <footer className="mt-20 bg-night text-white/60">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-8 text-sm">
            <span className="flex items-center gap-2.5 font-semibold text-white">
              <Logo />
              Salon Aminata
            </span>
            <span className="eyebrow text-white/50">
              SalonFlow AI · démo du talk « De l&apos;idée à l&apos;application »
            </span>
          </div>
        </footer>
      </body>
    </html>
  );
}
