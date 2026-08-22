import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("Footer");
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0D2734] px-5 py-10 text-white sm:px-8 lg:px-12">
      <div className="mx-auto max-w-[1440px]">
        <div className="flex flex-col gap-10 border-b border-white/15 pb-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-md">
            <a
              href="#top"
              aria-label={t("homeAriaLabel")}
              className="inline-flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5A33B]"
            >
              <span
                aria-hidden="true"
                className="grid grid-cols-3 gap-[3px]"
              >
                <span className="h-2.5 w-2.5 rounded-[1px] bg-[#D6384B]" />
                <span className="h-2.5 w-2.5 rounded-[1px] bg-[#D6384B]" />
                <span className="h-2.5 w-2.5 rounded-[1px] bg-[#F5A33B]" />

                <span className="col-start-1 ml-[7px] h-2.5 w-2.5 rounded-[1px] bg-[#D6384B]" />
                <span className="h-2.5 w-2.5 rounded-[1px] bg-[#D6384B]" />

                <span className="col-start-2 h-2.5 w-2.5 rounded-[1px] bg-white" />
              </span>

              <span className="text-lg font-extrabold tracking-[-0.03em]">
                {t("brandName")}
              </span>
            </a>

            <p className="mt-5 max-w-sm text-sm leading-6 text-white/60">
              {t("tagline")}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-5 pt-7 text-xs leading-5 text-white/45 sm:flex-row sm:items-end sm:justify-between">
          <p className="max-w-2xl">
            {t("disclaimer")}
          </p>

          <p className="shrink-0">
            {t("copyright", {
              year: currentYear,
            })}
          </p>
        </div>
      </div>
    </footer>
  );
}