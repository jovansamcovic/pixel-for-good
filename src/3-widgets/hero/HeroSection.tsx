import { useTranslations } from "next-intl";

const PROGRESS = 58;

export function HeroSection() {
  const t = useTranslations("Hero");

  return (
    <section
      id="top"
      className="relative overflow-hidden bg-gradient-to-br from-[#FFF6EB] to-[#FCE6D7]"
    >
      <div
        aria-hidden="true"
        className="absolute -left-12 bottom-10 h-44 w-44 rounded-full bg-[#F5A33B]/15"
      />

      <div
        aria-hidden="true"
        className="absolute left-1/2 top-8 h-20 w-20 rounded-full bg-[#D6384B]/10"
      />

      <div className="relative mx-auto grid max-w-7xl gap-14 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1fr_0.9fr] lg:items-center lg:px-12 lg:py-24">
        <div>
          <p className="mb-6 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#D6384B] shadow-sm sm:text-xs">
            <span
              aria-hidden="true"
              className="h-2 w-2 rounded-full bg-[#D6384B]"
            />

            {t("eyebrow")}
          </p>

          <h1 className="max-w-2xl text-5xl font-extrabold leading-[0.98] tracking-[-0.05em] text-[#0D2734] sm:text-6xl lg:text-7xl">
            {t("title.first")}

            <span className="mt-2 block font-serif font-bold tracking-[-0.04em] text-[#D6384B]">
              {t("title.highlighted")}
            </span>

            <span className="mt-2 block">
              {t("title.last")}
            </span>
          </h1>

          <p className="mt-7 max-w-xl text-base leading-7 text-[#6D7475] sm:text-lg">
            {t("description")}
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a
              href="#srce"
              className={[
                "inline-flex min-h-14 items-center justify-center gap-3",
                "rounded-2xl bg-[#D6384B] px-7",
                "text-sm font-bold text-white",
                "shadow-[0_12px_30px_rgba(214,56,75,0.22)]",
                "transition hover:-translate-y-0.5 hover:bg-[#BF2F41]",
                "focus-visible:outline-none focus-visible:ring-2",
                "focus-visible:ring-[#D6384B] focus-visible:ring-offset-2",
              ].join(" ")}
            >
              {t("primaryAction")}
              <span aria-hidden="true">↘</span>
            </a>

            <a
              href="#kako-radi"
              className={[
                "inline-flex min-h-14 items-center justify-center gap-3",
                "rounded-2xl border-2 border-[#0D2734] px-7",
                "text-sm font-bold text-[#0D2734]",
                "transition hover:bg-[#0D2734] hover:text-white",
                "focus-visible:outline-none focus-visible:ring-2",
                "focus-visible:ring-[#0D2734] focus-visible:ring-offset-2",
              ].join(" ")}
            >
              {t("secondaryAction")}
              <span aria-hidden="true">→</span>
            </a>
          </div>

          <dl className="mt-12 grid max-w-lg grid-cols-2 divide-x divide-[#0D2734]/15">
            <div className="pr-6">
              <dt className="text-xs text-[#6D7475]">
                {t("statistics.raisedLabel")}
              </dt>

              <dd className="mt-1 text-xl font-extrabold tracking-tight text-[#0D2734] sm:text-2xl">
                {t("statistics.raisedValue")}
              </dd>
            </div>

            <div className="pl-6">
              <dt className="text-xs text-[#6D7475]">
                {t("statistics.pixelsLabel")}
              </dt>

              <dd className="mt-1 text-xl font-extrabold tracking-tight text-[#0D2734] sm:text-2xl">
                {t("statistics.pixelsValue")}
              </dd>
            </div>
          </dl>
        </div>

        <div className="mx-auto w-full max-w-xl rounded-[2rem] bg-white p-5 shadow-[0_24px_70px_rgba(13,39,52,0.14)] sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-base font-bold text-[#0D2734] sm:text-xl">
              {t("heartCard.title")}
            </h2>

            <span className="shrink-0 text-xs font-bold text-[#D6384B]">
              {t("heartCard.progress", {
                progress: PROGRESS,
              })}
            </span>
          </div>

          <div
            role="progressbar"
            aria-label={t("heartCard.progressAriaLabel")}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={PROGRESS}
            className="mt-4 h-3 overflow-hidden rounded-full bg-[#F3E4DB]"
          >
            <div
              className="h-full rounded-full bg-[#D6384B]"
              style={{
                width: `${PROGRESS}%`,
              }}
            />
          </div>

          <div className="relative mx-auto mt-6 flex aspect-square max-w-[430px] items-center justify-center">
            <span
              aria-hidden="true"
              className="select-none text-[17rem] leading-none text-[#D6384B] sm:text-[22rem]"
            >
              ♥
            </span>

            <span
              aria-hidden="true"
              className="absolute left-[28%] top-[28%] h-5 w-5 rounded-sm bg-[#F5A33B] sm:h-6 sm:w-6"
            />

            <span
              aria-hidden="true"
              className="absolute left-[45%] top-[34%] h-5 w-5 rounded-sm bg-[#F6C2A5] sm:h-6 sm:w-6"
            />

            <span
              aria-hidden="true"
              className="absolute right-[27%] top-[39%] h-5 w-5 rounded-sm bg-[#0D2734] sm:h-6 sm:w-6"
            />

            <span
              aria-hidden="true"
              className="absolute left-[40%] top-[51%] h-5 w-5 rounded-sm bg-[#FFF6EB] sm:h-6 sm:w-6"
            />

            <span
              aria-hidden="true"
              className="absolute right-[35%] top-[59%] h-4 w-4 rounded-sm bg-white sm:h-5 sm:w-5"
            />

            <span
              aria-hidden="true"
              className="absolute bottom-[23%] left-[48%] h-4 w-4 rounded-sm bg-[#F6C2A5] sm:h-5 sm:w-5"
            />
          </div>

          <div className="mt-2 flex flex-wrap items-center justify-between gap-4 text-xs text-[#6D7475]">
            <div className="flex items-center gap-4">
              <span className="inline-flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="h-3 w-3 rounded-sm bg-[#D6384B]"
                />

                {t("heartCard.legend.occupied")}
              </span>

              <span className="inline-flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="h-3 w-3 rounded-sm bg-[#F3E4DB]"
                />

                {t("heartCard.legend.available")}
              </span>
            </div>

            <a
              href="#srce"
              className="font-bold text-[#0D2734] transition hover:text-[#D6384B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D6384B]"
            >
              {t("heartCard.action")}{" "}
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}