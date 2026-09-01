import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("Footer");
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0D2734] px-5 py-10 text-white sm:px-8 lg:px-12">
      <div className="mx-auto max-w-[1440px]">
        <div className="flex flex-col gap-10 border-b border-white/15 pb-10 md:flex-row md:items-start md:justify-between">
           <img src="/logo.svg" alt={'Srce Kragujevca'} className="h-16 w-auto" />
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