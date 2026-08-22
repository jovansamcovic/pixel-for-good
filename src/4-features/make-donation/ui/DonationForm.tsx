"use client";

import {
  PIXEL_PALETTE,
  PIXEL_PRICE,
} from "@/src/5-entities/heart-pixel/PixelHeart";
import { type FormEvent, type RefObject, useState } from "react";

export type DonationDraft = {
  color: string;
  name: string;
  message: string;
};

type DonationFormProps = {
  selectedPixel: number | null;
  successPixel: number | null;
  containerRef: RefObject<HTMLElement | null>;
  onPurchase: (draft: DonationDraft) => void;
  onReset: () => void;
  onShareStory: () => void;
};

const formatRsd = (value: number) =>
  `${new Intl.NumberFormat("sr-RS").format(value)} RSD`;

const fieldLabelClass =
  "mb-2 block text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#0D2734]";

const fieldClass = [
  "w-full rounded-xl border border-[#D8D4CE] bg-[#FFFCF8]",
  "px-4 text-sm text-[#0D2734] outline-none transition",
  "placeholder:text-[#9DA4A5]",
  "hover:border-[#0D2734]/40",
  "focus:border-[#0D2734] focus:ring-2 focus:ring-[#F5A33B]/35",
  "disabled:cursor-not-allowed disabled:bg-[#F4F1EC]",
  "disabled:text-[#9DA4A5] disabled:opacity-70",
].join(" ");

export function DonationForm({
  selectedPixel,
  successPixel,
  containerRef,
  onPurchase,
  onReset,
  onShareStory,
}: DonationFormProps) {
  const [donorName, setDonorName] = useState("");
  const [message, setMessage] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [selectedColor, setSelectedColor] = useState(PIXEL_PALETTE[0]);

  const submitDonation = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (selectedPixel === null) {
      return;
    }

    onPurchase({
      color: selectedColor,
      name: anonymous
        ? "Anonimni donator"
        : donorName.trim() || "Donator dobrote",
      message: message.trim() || "Jedan piksel. Jedno dobro delo.",
    });
  };

  const resetDonation = () => {
    setDonorName("");
    setMessage("");
    setAnonymous(false);
    setSelectedColor(PIXEL_PALETTE[0]);
    onReset();
  };

  return (
    <aside
      ref={containerRef}
      aria-live="polite"
      className={[
        "w-full rounded-[24px] bg-white",
        "px-6 py-8 sm:px-8 sm:py-9",
        "shadow-[0_12px_35px_rgba(13,39,52,0.07)]",
      ].join(" ")}
    >
      {successPixel !== null ? (
        <div className="flex min-h-[500px] flex-col items-center justify-center text-center">
          <span
            aria-hidden="true"
            className={[
              "flex h-16 w-16 items-center justify-center",
              "rounded-full bg-[#FCE4E1]",
              "text-3xl text-[#D6384B]",
            ].join(" ")}
          >
            ♥
          </span>

          <p className="mt-6 text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#D6384B]">
            Hvala!
          </p>

          <h3 className="mt-3 max-w-sm font-serif text-3xl font-bold leading-tight tracking-[-0.03em] text-[#0D2734]">
            Tvoj piksel sada kuca sa svima.
          </h3>

          <p className="mt-4 max-w-sm text-sm leading-6 text-[#6D7475]">
            Piksel <strong className="text-[#0D2734]">#{successPixel}</strong>{" "}
            je dodat zajedničkom srcu. U pravoj verziji ovde bi usledila potvrda
            uplate i digitalna zahvalnica.
          </p>

          <div className="mt-8 flex w-full max-w-sm flex-col gap-3">
            <button
              type="button"
              onClick={onShareStory}
              className={[
                "inline-flex min-h-14 w-full items-center justify-center gap-3",
                "rounded-xl bg-[#D6384B] px-6",
                "text-sm font-extrabold text-white",
                "shadow-[0_10px_24px_rgba(214,56,75,0.2)]",
                "transition",
                "hover:-translate-y-0.5 hover:bg-[#BF2F41]",
                "focus-visible:outline-none focus-visible:ring-2",
                "focus-visible:ring-[#D6384B] focus-visible:ring-offset-2",
              ].join(" ")}
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                className="h-5 w-5"
                stroke="currentColor"
                strokeWidth={2}
              >
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle
                  cx="17.5"
                  cy="6.5"
                  r="1"
                  fill="currentColor"
                  stroke="none"
                />
              </svg>
              Podeli na Instagram
            </button>

            <button
              type="button"
              onClick={resetDonation}
              className={[
                "inline-flex min-h-14 w-full items-center justify-center",
                "rounded-xl border-2 border-[#0D2734] px-6",
                "text-sm font-extrabold text-[#0D2734]",
                "transition",
                "hover:bg-[#0D2734] hover:text-white",
                "focus-visible:outline-none focus-visible:ring-2",
                "focus-visible:ring-[#F5A33B] focus-visible:ring-offset-2",
              ].join(" ")}
            >
              Oboji još jedan piksel
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={submitDonation}>
          <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#D6384B]">
            Tvoj trag u srcu
          </p>

          <div className="mt-3 flex items-start justify-between gap-4">
            <h3 className="font-serif text-[28px] font-bold leading-tight tracking-[-0.03em] text-[#0D2734] sm:text-[32px]">
              {selectedPixel !== null
                ? `Piksel #${selectedPixel}`
                : "Izaberi piksel na srcu"}
            </h3>

            <strong className="mt-1 shrink-0 rounded-lg bg-[#D6384B] px-3 py-2 text-xs font-extrabold text-white">
              {formatRsd(PIXEL_PRICE)}
            </strong>
          </div>

          <p className="mt-3 text-sm leading-6 text-[#6D7475]">
            {selectedPixel !== null
              ? "Sjajan izbor. Sada mu dodaj boju, ime i kratku poruku."
              : "Klikni na slobodan kvadratić u srcu. Zatim možeš da ga personalizuješ."}
          </p>

          <fieldset
            disabled={selectedPixel === null}
            className="mt-7 disabled:opacity-55"
          >
            <legend className={fieldLabelClass}>Boja piksela</legend>

            <div className="flex flex-wrap gap-3">
              {PIXEL_PALETTE.map((color, index) => {
                const active = selectedColor === color;

                return (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    aria-label={`Izaberi boju ${index + 1}`}
                    aria-pressed={active}
                    className={[
                      "relative h-9 w-9 rounded-md border-[3px] border-white",
                      "outline outline-1 transition",
                      "hover:scale-105",
                      "focus-visible:outline-2 focus-visible:outline-offset-2",
                      active
                        ? "outline-2 outline-[#0D2734]"
                        : "outline-[#D8D4CE]",
                    ].join(" ")}
                    style={{
                      backgroundColor: color,
                    }}
                  >
                    {active && <span className="sr-only">Izabrana boja</span>}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <div className="mt-7">
            <label htmlFor="donor-name" className={fieldLabelClass}>
              Ime na zidu zahvalnosti
            </label>

            <input
              id="donor-name"
              type="text"
              value={donorName}
              onChange={(event) => setDonorName(event.target.value)}
              placeholder="Tvoje ime ili inicijali"
              maxLength={32}
              required={!anonymous}
              disabled={selectedPixel === null || anonymous}
              className={`${fieldClass} h-12`}
            />
          </div>

          <div className="mt-6">
            <label htmlFor="donation-message" className={fieldLabelClass}>
              Poruka{" "}
              <span className="font-semibold text-[#9DA4A5]">(opciono)</span>
            </label>

            <div className="relative">
              <textarea
                id="donation-message"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Napiši kratku poruku podrške…"
                maxLength={80}
                disabled={selectedPixel === null}
                rows={4}
                className={`${fieldClass} min-h-[108px] resize-none py-4 pr-14`}
              />

              <span className="pointer-events-none absolute bottom-3 right-3 text-[10px] text-[#6D7475]">
                {message.length}/80
              </span>
            </div>
          </div>

          <label className="mt-5 flex cursor-pointer items-center gap-3 text-sm text-[#6D7475]">
            <input
              type="checkbox"
              checked={anonymous}
              onChange={(event) => setAnonymous(event.target.checked)}
              disabled={selectedPixel === null}
              className={[
                "h-4 w-4 shrink-0 cursor-pointer",
                "accent-[#0D2734]",
                "disabled:cursor-not-allowed disabled:opacity-50",
                "focus-visible:outline-none focus-visible:ring-2",
                "focus-visible:ring-[#F5A33B] focus-visible:ring-offset-2",
              ].join(" ")}
            />

            <span>Želim da donacija bude anonimna</span>
          </label>

          <button
            type="submit"
            disabled={selectedPixel === null}
            className={[
              "mt-7 inline-flex min-h-14 w-full items-center justify-center gap-3",
              "rounded-xl bg-[#D6384B] px-6",
              "text-sm font-extrabold uppercase tracking-[0.02em] text-white",
              "shadow-[0_5px_0_#0D2734]",
              "transition",
              "hover:-translate-y-0.5 hover:bg-[#BF2F41]",
              "active:translate-y-1 active:shadow-none",
              "disabled:cursor-not-allowed disabled:bg-[#F4ACB4]",
              "disabled:shadow-none disabled:hover:translate-y-0",
              "focus-visible:outline-none focus-visible:ring-2",
              "focus-visible:ring-[#D6384B] focus-visible:ring-offset-2",
            ].join(" ")}
          >
            Potvrdi demo donaciju
            <span aria-hidden="true">→</span>
          </button>

          <p className="mt-4 text-center text-[10px] leading-4 text-[#6D7475]">
            <span aria-hidden="true" className="text-[#D6384B]">
              ◈
            </span>{" "}
            Ovo je demo — nema naplate niti čuvanja podataka.
          </p>
        </form>
      )}
    </aside>
  );
}
