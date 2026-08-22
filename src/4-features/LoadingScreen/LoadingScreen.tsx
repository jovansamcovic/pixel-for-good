"use client";

import { useEffect, useState } from "react";
import {
  useLocale,
  useTranslations,
} from "next-intl";

import {
  usePathname,
  useRouter,
} from "@/src/i18n/navigation";

type LoadingScreenProps = {
  onEnter?: () => void;
};

type Countdown = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  completed: boolean;
};

type SupportedLocale = "sr" | "en";

const TARGET_DATE = new Date(
  "2026-12-01T00:00:00+01:00",
).getTime();

const getCountdown = (): Countdown => {
  const difference = Math.max(
    TARGET_DATE - Date.now(),
    0,
  );

  return {
    days: Math.floor(difference / 86_400_000),
    hours: Math.floor(
      (difference % 86_400_000) / 3_600_000,
    ),
    minutes: Math.floor(
      (difference % 3_600_000) / 60_000,
    ),
    seconds: Math.floor(
      (difference % 60_000) / 1_000,
    ),
    completed: difference === 0,
  };
};

const formatNumber = (value: number) =>
  value.toString().padStart(2, "0");

export default function LoadingScreen({
  onEnter,
}: LoadingScreenProps) {
  const t = useTranslations("LoadingScreen");
  const currentLocale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const locale: SupportedLocale =
    currentLocale === "en" ? "en" : "sr";

  const [countdown, setCountdown] =
    useState<Countdown | null>(null);

  const [visible, setVisible] = useState(true);

  useEffect(() => {
    document.body.classList.add("loader-active");

    const updateCountdown = () => {
      setCountdown(getCountdown());
    };

    const initialTimeout = window.setTimeout(
      updateCountdown,
      0,
    );

    const interval = window.setInterval(
      updateCountdown,
      1_000,
    );

    return () => {
      window.clearTimeout(initialTimeout);
      window.clearInterval(interval);

      document.body.classList.remove(
        "loader-active",
      );
    };
  }, []);

  const changeLocale = (
    nextLocale: SupportedLocale,
  ) => {
    if (nextLocale === locale) {
      return;
    }

    router.replace(pathname, {
      locale: nextLocale,
    });
  };

  const enterWebsite = () => {
    document.body.classList.remove("loader-active");
    setVisible(false);
    onEnter?.();

    window.requestAnimationFrame(() => {
      document
        .getElementById("top")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    });
  };

  if (!visible) {
    return null;
  }

  const countdownItems = [
    {
      key: "days",
      value: countdown?.days,
      label: t("countdown.days"),
    },
    {
      key: "hours",
      value: countdown?.hours,
      label: t("countdown.hours"),
    },
    {
      key: "minutes",
      value: countdown?.minutes,
      label: t("countdown.minutes"),
    },
    {
      key: "seconds",
      value: countdown?.seconds,
      label: t("countdown.seconds"),
    },
  ];

  return (
    <div
      aria-label={t("ariaLabel")}
      className={[
        "fixed inset-0 z-[200]",
        "flex min-h-dvh items-center justify-center",
        "overflow-y-auto bg-[#FFF6EB]",
        "px-5 py-10 text-[#0D2734]",
      ].join(" ")}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#D6384B]/10 blur-2xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-[#F5A33B]/15 blur-2xl"
      />

      <main className="relative mx-auto flex w-full max-w-4xl flex-col items-center text-center">
        <span
          aria-hidden="true"
          className="grid grid-cols-3 gap-[4px]"
        >
          <span className="h-5 w-5 rounded-[3px] bg-[#D6384B]" />
          <span className="h-5 w-5 rounded-[3px] bg-[#D6384B]" />
          <span className="h-5 w-5 rounded-[3px] bg-[#F5A33B]" />

          <span className="col-start-1 ml-3 h-5 w-5 rounded-[3px] bg-[#D6384B]" />
          <span className="h-5 w-5 rounded-[3px] bg-[#D6384B]" />

          <span className="col-start-2 h-5 w-5 rounded-[3px] bg-[#0D2734]" />
        </span>

        <p className="mt-7 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#D6384B]">
          {t("eyebrow")}
        </p>

        <h1 className="mt-4 max-w-3xl text-4xl font-extrabold leading-[1.05] tracking-[-0.05em] sm:text-6xl lg:text-7xl">
          {t("title.first")}

          <span className="mt-2 block font-serif text-[#D6384B]">
            {t("title.highlighted")}
          </span>
        </h1>

        <p className="mt-6 max-w-xl text-sm leading-7 text-[#6D7475] sm:text-base">
          {t("description")}
        </p>

        <div
          role="group"
          aria-label={t("language.ariaLabel")}
          className="mt-5 flex rounded-xl border border-[#0D2734]/10 bg-white p-1 shadow-sm"
        >
          {(["sr", "en"] as const).map(
            (language) => {
              const active = locale === language;

              return (
                <button
                  key={language}
                  type="button"
                  onClick={() =>
                    changeLocale(language)
                  }
                  aria-pressed={active}
                  className={[
                    "flex h-9 min-w-12 items-center justify-center",
                    "rounded-lg px-3 text-xs font-extrabold",
                    "uppercase tracking-[0.08em] transition",
                    "focus-visible:outline-none focus-visible:ring-2",
                    "focus-visible:ring-[#F5A33B]",
                    active
                      ? "bg-[#0D2734] text-white"
                      : [
                          "text-[#6D7475]",
                          "hover:bg-[#FFF6EB]",
                          "hover:text-[#0D2734]",
                        ].join(" "),
                  ].join(" ")}
                >
                  {language}
                </button>
              );
            },
          )}
        </div>

        <section
          aria-label={t("countdown.ariaLabel")}
          className="mt-7 w-full"
        >
          <p className="text-[10px] font-extrabold uppercase tracking-[0.1em] text-[#0D2734]">
            {countdown?.completed
              ? t("countdown.completed")
              : t("countdown.title")}
          </p>

          <div className="mx-auto mt-3 grid w-full max-w-[420px] grid-cols-4 gap-2">
            {countdownItems.map((item) => (
              <div
                key={item.key}
                className={[
                  "flex min-w-0 flex-col items-center justify-center",
                  "rounded-xl border border-[#E8D8CC] bg-white",
                  "px-1.5 py-2.5",
                  "shadow-[0_6px_18px_rgba(13,39,52,0.05)]",
                ].join(" ")}
              >
                <strong className="block text-lg font-extrabold leading-none tabular-nums tracking-[-0.03em] text-[#0D2734] sm:text-xl">
                  {item.value === undefined
                    ? "--"
                    : formatNumber(item.value)}
                </strong>

                <span className="mt-1.5 block w-full truncate text-[7px] font-bold uppercase tracking-[0.06em] text-[#6D7475] sm:text-[8px]">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </section>

        <button
          type="button"
          onClick={enterWebsite}
          className={[
            "mt-8 inline-flex min-h-14 items-center justify-center gap-3",
            "rounded-2xl bg-[#D6384B] px-8",
            "text-sm font-extrabold text-white",
            "shadow-[0_12px_30px_rgba(214,56,75,0.22)]",
            "transition",
            "hover:-translate-y-0.5 hover:bg-[#BF2F41]",
            "focus-visible:outline-none focus-visible:ring-2",
            "focus-visible:ring-[#D6384B] focus-visible:ring-offset-2",
            "focus-visible:ring-offset-[#FFF6EB]",
          ].join(" ")}
        >
          {t("enterButton")}
          <span aria-hidden="true">→</span>
        </button>

        <span
          role="status"
          aria-live="polite"
          className="sr-only"
        >
          {t("screenReaderLoading")}
        </span>
      </main>
    </div>
  );
}