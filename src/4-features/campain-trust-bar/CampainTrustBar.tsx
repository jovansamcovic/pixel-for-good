export function CampaignTrustBar() {
  return (
    <section
      aria-label="Pouzdanost i transparentnost kampanje"
      className="bg-[#FFF6EB] px-5 py-8 sm:px-8 lg:px-12"
    >
      <div className="mx-auto grid max-w-7xl gap-7 rounded-[1.75rem] bg-[#0D2734] px-6 py-7 text-white sm:px-8 lg:grid-cols-[1.5fr_1fr_1fr] lg:items-center lg:gap-10">
        <div>
          <h2 className="text-xs font-extrabold uppercase tracking-[0.08em]">
            Svaka uplata je javno evidentirana
          </h2>

          <p className="mt-2 text-sm leading-6 text-white/70">
            Jasan cilj, redovni izveštaji i direktna uplata.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <span
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#D6384B]"
            aria-hidden="true"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m6 12 4 4 8-9" />
            </svg>
          </span>

          <div>
            <h3 className="text-sm font-bold">Sigurna uplata</h3>
            <p className="mt-1 text-xs text-white/60">
              Bez skrivenih troškova
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#F5A33B]"
            aria-hidden="true"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="8" />
              <circle cx="12" cy="12" r="3" />
              <path d="M12 2v2M12 20v2M2 12h2M20 12h2" />
            </svg>
          </span>

          <div>
            <h3 className="text-sm font-bold">Javan napredak</h3>
            <p className="mt-1 text-xs text-white/60">
              Ažurirano svakog dana
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}