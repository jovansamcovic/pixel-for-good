"use client";

import type { FormEvent } from "react";
import { useTranslations } from "next-intl";

type DonationFormContentProps = {
  selectedPixel: number;
  selectedColor: string;
  donorName: string;
  message: string;
  showMessage: boolean;
  formattedPrice: string;
  onDonorNameChange: (value: string) => void;
  onMessageChange: (value: string) => void;
  onShowMessage: () => void;
  onHideMessage: () => void;
  onSubmit: (
    event: FormEvent<HTMLFormElement>,
  ) => void;
};

const fieldClass = [
  "w-full rounded-2xl border border-[#D8D4CE] bg-[#FAF7F3]",
  "px-4 text-base text-[#0D2734] outline-none transition",
  "placeholder:text-[#9DA4A5]",
  "focus:border-[#0D2734] focus:ring-2 focus:ring-[#F5A33B]/35",
].join(" ");

export function DonationFormContent({
  selectedPixel,
  selectedColor,
  donorName,
  message,
  showMessage,
  formattedPrice,
  onDonorNameChange,
  onMessageChange,
  onShowMessage,
  onHideMessage,
  onSubmit,
}: DonationFormContentProps) {
  const t = useTranslations("DonationForm");

  return (
    <form
      onSubmit={onSubmit}
      className="px-1 pb-1 pt-5"
    >
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className={[
            "flex h-12 w-12 shrink-0",
            "items-center justify-center",
            "rounded-xl",
            "border-2 border-[#0D2734]",
            "bg-[#FFDF78]",
          ].join(" ")}
        >
          <span
            className="h-5 w-5 rounded-[4px]"
            style={{
              backgroundColor: selectedColor,
            }}
          />
        </span>

        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#D6384B]">
            {t("form.eyebrow")}
          </p>

          <h3
            id="donation-dialog-title"
            className="mt-0.5 truncate text-xl font-extrabold tracking-[-0.03em] text-[#0D2734]"
          >
            {t("form.selectedPixel", {
              pixel: selectedPixel,
            })}
          </h3>
        </div>

        <strong className="shrink-0 text-sm font-extrabold text-[#0D2734]">
          {formattedPrice}
        </strong>
      </div>

      <div className="mt-6">
        <label
          htmlFor="donor-name"
          className="mb-2 block text-sm font-bold text-[#0D2734]"
        >
          Kako želiš da ostaviš svoj trag?
        </label>

        <input
          id="donor-name"
          type="text"
          value={donorName}
          onChange={(event) =>
            onDonorNameChange(event.target.value)
          }
          placeholder={t("form.name.placeholder")}
          maxLength={32}
          autoComplete="name"
          className={`${fieldClass} min-h-[52px]`}
        />
      </div>

      {!showMessage ? (
        <button
          type="button"
          onClick={onShowMessage}
          className={[
            "mt-4 flex w-full",
            "items-center justify-between",
            "py-2 text-left",
            "text-sm font-extrabold",
            "text-[#D6384B]",
          ].join(" ")}
        >
          <span>
            + {t("form.message.label")}
          </span>

          <span className="text-xs font-semibold text-[#9DA4A5]">
            {t("form.message.optional")}
          </span>
        </button>
      ) : (
        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between">
            <label
              htmlFor="donation-message"
              className="text-sm font-bold text-[#0D2734]"
            >
              {t("form.message.label")}
            </label>

            <button
              type="button"
              onClick={onHideMessage}
              aria-label="Remove message"
              className="text-xs font-bold text-[#9DA4A5] hover:text-[#0D2734]"
            >
              ×
            </button>
          </div>

          <textarea
            id="donation-message"
            value={message}
            onChange={(event) =>
              onMessageChange(event.target.value)
            }
            placeholder={t(
              "form.message.placeholder",
            )}
            maxLength={80}
            rows={3}
            className={[
              fieldClass,
              "min-h-[88px]",
              "resize-none py-3",
            ].join(" ")}
          />
        </div>
      )}

      <button
        type="submit"
        className={[
          "mt-5 inline-flex min-h-[58px] w-full",
          "items-center justify-center gap-3",
          "rounded-[18px]",
          "bg-[#0D2734] px-6",
          "text-base font-extrabold text-white",
          "shadow-[0_8px_24px_rgba(13,39,52,0.18)]",
          "transition",
          "hover:-translate-y-0.5",
          "hover:bg-[#173947]",
          "active:translate-y-0",
        ].join(" ")}
      >
        Doniraj i oboji srce

        <span aria-hidden="true">
          →
        </span>
      </button>

      <p className="mt-3 text-center text-[10px] leading-4 text-[#6D7475]">
        {t("form.demoNotice")}
      </p>
    </form>
  );
}