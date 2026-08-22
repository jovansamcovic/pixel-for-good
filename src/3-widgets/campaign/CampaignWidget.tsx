"use client";

import { useRef, useState } from "react";

import {
  DonationDraft,
  DonationForm,
} from "@/src/4-features/make-donation/ui/DonationForm";
import { PixelSelector } from "@/src/4-features/select-pixel/PixelSelector";
import { InstagramStoryDialog } from "@/src/4-features/share-instagram-story/InstagramStoryDialog";
import { DonationRecord } from "@/src/5-entities/donation/DonationBadge";
import {
  HEART_PIXELS,
  STARTING_SOLD,
} from "@/src/5-entities/heart-pixel/PixelHeart";

export function CampaignWidget() {
  const [selectedPixel, setSelectedPixel] = useState<number | null>(null);
  const [purchasedPixels, setPurchasedPixels] = useState<
    Record<number, string>
  >({});
  const [successPixel, setSuccessPixel] = useState<number | null>(null);
  const [lastPurchase, setLastPurchase] =
    useState<DonationRecord | null>(null);
  const [storyOpen, setStoryOpen] = useState(false);

  const donationRef = useRef<HTMLElement | null>(null);

  const soldCount = STARTING_SOLD + Object.keys(purchasedPixels).length;
  const availablePixels = Math.max(HEART_PIXELS.length - soldCount, 0);

  const choosePixel = (pixelId: number) => {
    setSelectedPixel(pixelId);
    setSuccessPixel(null);

    window.setTimeout(() => {
      donationRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 80);
  };

  const completeDonation = (draft: DonationDraft) => {
    if (selectedPixel === null) return;

    setPurchasedPixels((current) => ({
      ...current,
      [selectedPixel]: draft.color,
    }));

    setLastPurchase({
      id: selectedPixel,
      ...draft,
    });

    setSuccessPixel(selectedPixel);
    setSelectedPixel(null);
  };

  const resetDonation = () => {
    setSuccessPixel(null);
    setStoryOpen(false);
  };

  return (
    <section
      id="srce"
      className="scroll-mt-28 bg-[#FFF6EB] px-5 py-16 sm:px-8 sm:py-20 lg:px-12"
    >
      <div className="mx-auto max-w-[1280px]">
        <header>
          <p className="text-xs font-extrabold uppercase tracking-[0.08em] text-[#D6384B]">
            Glavni korak
          </p>

          <h2 className="mt-4 text-4xl font-extrabold leading-tight tracking-[-0.04em] text-[#0D2734] sm:text-5xl">
            Izaberi piksel i ostavi svoj trag
          </h2>

          <p className="mt-2 text-base leading-7 text-[#6D7475]">
            Klikni na slobodan piksel, odaberi boju i dodaj poruku podrške.
          </p>
        </header>

        <div className="mt-8 grid items-stretch gap-8 lg:grid-cols-[minmax(0,1.7fr)_minmax(340px,1fr)]">
          <div className="flex min-h-[620px] min-w-0 flex-col rounded-[28px] border border-[#E8D8CC] bg-white p-5 sm:p-7">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div
                className="flex flex-wrap items-center gap-x-5 gap-y-3"
                aria-label="Legenda piksela"
              >
                <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.04em] text-[#6D7475]">
                  <span
                    className="h-3 w-3 rounded-[2px] bg-[#F06B68]"
                    aria-hidden="true"
                  />
                  Donirano
                </span>

                <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.04em] text-[#6D7475]">
                  <span
                    className="h-3 w-3 rounded-[2px] border border-[#C9D0D1] bg-[#FFF6EB]"
                    aria-hidden="true"
                  />
                  Slobodno
                </span>

                <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.04em] text-[#6D7475]">
                  <span
                    className="h-4 w-4 rounded-[2px] border-2 border-[#0D2734] bg-[#F5A33B]"
                    aria-hidden="true"
                  />
                  Tvoj izbor
                </span>
              </div>

              <span className="shrink-0 text-xs font-extrabold uppercase tracking-[0.03em] text-[#D6384B]">
                Još {availablePixels} slobodnih
              </span>
            </div>

            <div className="flex flex-1 items-center justify-center py-8 sm:py-10">
              <PixelSelector
                selectedPixel={selectedPixel}
                purchasedPixels={purchasedPixels}
                onSelect={choosePixel}
              />
            </div>
          </div>

          <div className="min-w-0">
            <DonationForm
              selectedPixel={selectedPixel}
              successPixel={successPixel}
              containerRef={donationRef}
              onPurchase={completeDonation}
              onReset={resetDonation}
              onShareStory={() => setStoryOpen(true)}
            />
          </div>
        </div>
      </div>

      {storyOpen && lastPurchase && (
        <InstagramStoryDialog
          donation={lastPurchase}
          onClose={() => setStoryOpen(false)}
        />
      )}
    </section>
  );
}