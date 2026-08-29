"use client";

import {
  type FormEvent,
  useEffect,
  useState,
} from "react";

import {
  useLocale,
  useTranslations,
} from "next-intl";

import {
  DonationDialog,
  DonationFormContent,
  DonationSuccess,
  type DonationDraft,
} from "@/src/4-features/donation-form";

import { PixelSelector } from "@/src/4-features/select-pixel/PixelSelector";

import { InstagramStoryDialog } from "@/src/4-features/share-instagram-story/InstagramStoryDialog";

import type { DonationRecord } from "@/src/5-entities/donation/DonationBadge";

import {
  HEART_PIXELS,
  PIXEL_PALETTE,
  PIXEL_PRICE,
  STARTING_SOLD,
  isInitiallySold,
} from "@/src/5-entities/heart-pixel/PixelHeart";

type CampaignWidgetProps = {
  isMobile: boolean;
};

export function CampaignWidget({
  isMobile,
}: CampaignWidgetProps) {
  const t = useTranslations("CampaignWidget");
  const donationT =
    useTranslations("DonationForm");

  const locale = useLocale();

  const [selectedPixel, setSelectedPixel] =
    useState<number | null>(null);

  const [
    purchasedPixels,
    setPurchasedPixels,
  ] = useState<Record<number, string>>(
    {},
  );

  const [successPixel, setSuccessPixel] =
    useState<number | null>(null);

  const [lastPurchase, setLastPurchase] =
    useState<DonationRecord | null>(
      null,
    );

  const [storyOpen, setStoryOpen] =
    useState(false);

  const [donorName, setDonorName] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [showMessage, setShowMessage] =
    useState(false);

  const [
    selectedColor,
    setSelectedColor,
  ] = useState(PIXEL_PALETTE[0]);

  useEffect(() => {
    if (selectedPixel === null) {
      return;
    }

    setSelectedColor(
      PIXEL_PALETTE[
        selectedPixel %
          PIXEL_PALETTE.length
      ],
    );
  }, [selectedPixel]);

  const soldCount =
    STARTING_SOLD +
    Object.keys(
      purchasedPixels,
    ).length;

  const availablePixels = Math.max(
    HEART_PIXELS.length - soldCount,
    0,
  );

  const progress = Math.min(
    (soldCount /
      HEART_PIXELS.length) *
      100,
    100,
  );

  const numberLocale =
    locale === "sr"
      ? "sr-RS"
      : "en-US";

  const formattedPrice =
    new Intl.NumberFormat(
      numberLocale,
      {
        style: "currency",
        currency: "RSD",
        maximumFractionDigits: 0,
      },
    ).format(PIXEL_PRICE);

  const formattedSoldCount =
    soldCount.toLocaleString(
      numberLocale,
    );

  const formattedAvailablePixels =
    availablePixels.toLocaleString(
      numberLocale,
    );

  const isDonationDialogOpen =
    selectedPixel !== null ||
    successPixel !== null;

  const choosePixel = (
    pixelId: number,
  ) => {
    setSelectedPixel(pixelId);
    setSuccessPixel(null);
  };

  const chooseRandomPixel = () => {
    const available =
      HEART_PIXELS.filter(
        (pixel) => {
          const pixelNumber =
            pixel.id + 1;

          return (
            !isInitiallySold(
              pixel.id,
            ) &&
            purchasedPixels[
              pixelNumber
            ] === undefined
          );
        },
      );

    if (available.length === 0) {
      return;
    }

    const randomPixel =
      available[
        Math.floor(
          Math.random() *
            available.length,
        )
      ];

    choosePixel(
      randomPixel.id + 1,
    );
  };

  const completeDonation = (
    draft: DonationDraft,
  ) => {
    if (selectedPixel === null) {
      return;
    }

    setPurchasedPixels(
      (current) => ({
        ...current,
        [selectedPixel]:
          draft.color,
      }),
    );

    setLastPurchase({
      id: selectedPixel,
      ...draft,
    });

    setSuccessPixel(
      selectedPixel,
    );

    setSelectedPixel(null);
  };

  const submitDonation = (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (selectedPixel === null) {
      return;
    }

    completeDonation({
      color: selectedColor,
      name:
        donorName.trim() ||
        donationT(
          "defaults.anonymousDonor",
        ),
      message:
        message.trim() ||
        donationT(
          "defaults.message",
        ),
    });
  };

  const closeDonation = () => {
    setSelectedPixel(null);
  };

  const resetDonation = () => {
    setSelectedPixel(null);
    setSuccessPixel(null);

    setDonorName("");
    setMessage("");
    setShowMessage(false);

    setSelectedColor(
      PIXEL_PALETTE[0],
    );

    setStoryOpen(false);
  };

  const handleDonationClose =
    () => {
      if (
        successPixel !== null
      ) {
        resetDonation();
        return;
      }

      closeDonation();
    };

  const hideMessage = () => {
    setMessage("");
    setShowMessage(false);
  };

  return (
    <section
      id="srce"
      className="scroll-mt-28 bg-[#FFF9F4] px-5 py-14 sm:px-8 sm:py-20"
    >
      <div className="mx-auto max-w-[900px]">
        <header className="text-center">
          <p className="text-xs font-extrabold uppercase tracking-[0.08em] text-[#D6384B]">
            {t("eyebrow")}
          </p>

          <h2 className="mt-3 text-4xl font-extrabold leading-tight tracking-[-0.045em] text-[#0D2734] sm:text-5xl">
            {t("title")}
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-base leading-7 text-[#6D7475]">
            {t("description")}
          </p>
        </header>

        <div className="mt-7 rounded-[32px] border border-[#E8D8CC] bg-white p-4 shadow-[0_20px_60px_rgba(13,39,52,0.06)] sm:p-7">
          <div className="mb-5">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#D6384B]">
                  {t(
                    "progress.eyebrow",
                  )}
                </p>

                <p className="mt-1 text-sm font-bold text-[#0D2734]">
                  {t(
                    "progress.sold",
                    {
                      count:
                        formattedSoldCount,
                    },
                  )}
                </p>
              </div>

              <p className="text-right text-xs font-bold text-[#6D7475]">
                <strong className="block text-base text-[#0D2734]">
                  {
                    formattedAvailablePixels
                  }
                </strong>

                {t(
                  "progress.available",
                )}
              </p>
            </div>

            <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#EFE8E1]">
              <div
                className="h-full rounded-full bg-[#D6384B] transition-[width] duration-500"
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>
          </div>

          <PixelSelector
            selectedPixel={
              selectedPixel
            }
            purchasedPixels={
              purchasedPixels
            }
            onSelect={
              choosePixel
            }
            onRandomSelect={
              chooseRandomPixel
            }
          />

          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 border-t border-[#EFE8E1] pt-5">
            <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.04em] text-[#6D7475]">
              <span className="h-3 w-3 rounded-[3px] bg-[#F06B68]" />

              {t(
                "legend.donated",
              )}
            </span>

            <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.04em] text-[#6D7475]">
              <span className="h-3 w-3 rounded-[3px] border border-[#D8D4CE] bg-[#FFF6EB]" />

              {t(
                "legend.available",
              )}
            </span>

            <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.04em] text-[#6D7475]">
              <span className="h-3.5 w-3.5 rounded-[3px] border-2 border-[#0D2734] bg-[#FFDF78]" />

              {t(
                "legend.selected",
              )}
            </span>
          </div>
        </div>
      </div>

      {isDonationDialogOpen && (
        <DonationDialog
          isMobile={isMobile}
          onClose={
            handleDonationClose
          }
        >
          {successPixel !==
          null ? (
            <DonationSuccess
              successPixel={
                successPixel
              }
              onShareStory={() =>
                setStoryOpen(
                  true,
                )
              }
              onReset={
                resetDonation
              }
            />
          ) : (
            selectedPixel !==
              null && (
              <DonationFormContent
                selectedPixel={
                  selectedPixel
                }
                selectedColor={
                  selectedColor
                }
                donorName={
                  donorName
                }
                message={
                  message
                }
                showMessage={
                  showMessage
                }
                formattedPrice={
                  formattedPrice
                }
                onDonorNameChange={
                  setDonorName
                }
                onMessageChange={
                  setMessage
                }
                onShowMessage={() =>
                  setShowMessage(
                    true,
                  )
                }
                onHideMessage={
                  hideMessage
                }
                onSubmit={
                  submitDonation
                }
              />
            )
          )}
        </DonationDialog>
      )}

      {storyOpen &&
        lastPurchase && (
          <InstagramStoryDialog
            isMobile={
              isMobile
            }
            donation={
              lastPurchase
            }
            onClose={() =>
              setStoryOpen(
                false,
              )
            }
          />
        )}
    </section>
  );
}