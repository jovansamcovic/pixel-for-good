import { useTranslations } from "next-intl";

export default function Header() {
  const t = useTranslations("Header");

  return (
    <>
      <div className="flex h-8 items-center justify-center gap-2 bg-[#0D2734] px-4 text-center text-[10px] font-semibold uppercase tracking-[0.14em] text-white sm:text-xs">
        <span>{t("demoConcept")}</span>

        <span
          aria-hidden="true"
          className="h-1 w-1 shrink-0 rounded-full bg-[#F5A33B]"
        />

        <span>{t("paymentsDisabled")}</span>
      </div>

      <header className="sticky top-0 z-50 border-b border-[#0D2734]/10 bg-[#FFF6EB]/95 backdrop-blur-md">
        <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12">
          <a
            href="#top"
            aria-label={t("homeAriaLabel")}
            className="flex items-center"
          >
            <img src="/logo.svg" alt={t("brandName")} className="h-12 w-auto" />
          </a>

          <a
            href="#srce"
            className={[
              "inline-flex min-h-11 items-center justify-center",
              "rounded-xl bg-[#D6384B] px-4",
              "text-sm font-bold text-white",
              "shadow-[0_8px_20px_rgba(214,56,75,0.18)]",
              "transition hover:-translate-y-0.5 hover:bg-[#BF2F41]",
              "focus-visible:outline-none focus-visible:ring-2",
              "focus-visible:ring-[#D6384B] focus-visible:ring-offset-2",
              "focus-visible:ring-offset-[#FFF6EB]",
              "sm:px-5",
            ].join(" ")}
          >
            {t("cta")}
          </a>
        </div>
      </header>
    </>
  );
}
