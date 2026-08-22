import { useTranslations } from "next-intl";

export function HowItWorksSection() {
  const t = useTranslations("HowItWorks");

  const steps = [
    {
      number: "01",
      title: t("steps.choosePixel.title"),
      description: t("steps.choosePixel.description"),
      badgeClassName: "bg-[#FCE4E1] text-[#D6384B]",
    },
    {
      number: "02",
      title: t("steps.addMessage.title"),
      description: t("steps.addMessage.description"),
      badgeClassName: "bg-[#FDEBCB] text-[#F5A33B]",
    },
    {
      number: "03",
      title: t("steps.confirmDonation.title"),
      description: t("steps.confirmDonation.description"),
      badgeClassName: "bg-[#DDE8E1] text-[#27533D]",
    },
  ];

  return (
    <section
      id="kako-radi"
      className="scroll-mt-28 bg-[#FFF6EB] px-5 py-20 sm:px-8 sm:py-24 lg:px-12"
    >
      <div className="mx-auto max-w-7xl">
        <header className="text-center">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#D6384B]">
            {t("eyebrow")}
          </p>

          <h2 className="mx-auto mt-4 max-w-4xl text-3xl font-extrabold leading-tight tracking-[-0.04em] text-[#0D2734] sm:text-4xl lg:text-5xl">
            {t("title")}
          </h2>
        </header>

        <ol className="mt-12 grid gap-6 md:grid-cols-3 lg:gap-8">
          {steps.map((step) => (
            <li
              key={step.number}
              className="min-h-[220px] rounded-[26px] bg-white p-7 shadow-[0_14px_35px_rgba(13,39,52,0.07)] sm:p-8"
            >
              <span
                aria-hidden="true"
                className={[
                  "inline-flex h-12 min-w-12 items-center justify-center",
                  "rounded-2xl px-3 text-lg font-extrabold",
                  step.badgeClassName,
                ].join(" ")}
              >
                {step.number}
              </span>

              <h3 className="mt-6 text-lg font-extrabold tracking-[-0.02em] text-[#0D2734] sm:text-xl">
                {step.title}
              </h3>

              <p className="mt-3 max-w-sm text-sm leading-6 text-[#6D7475]">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}