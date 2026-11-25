/** En-tête sombre et quadrillé des pages intérieures. */
export default function PageHeader({ eyebrow, title, intro }: { eyebrow: string; title: string; intro?: string }) {
  return (
    <section className="night-grid text-white">
      <div className="mx-auto max-w-6xl px-5 pb-12 pt-12 sm:pb-16 sm:pt-16">
        <p className="eyebrow flex items-center gap-2 text-white/60">
          <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-lime" />
          {eyebrow}
        </p>
        <h1 className="display mt-4 text-4xl sm:text-6xl">{title}</h1>
        {intro && <p className="mt-4 max-w-xl text-lg text-white/70">{intro}</p>}
      </div>
    </section>
  );
}
