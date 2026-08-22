"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";

import type { DonationRecord } from "@/src/5-entities/donation/DonationBadge";
import {
  HEART_COLUMNS,
  HEART_PIXELS,
  HEART_ROWS,
  isInitiallySold,
  PIXEL_PALETTE,
  PixelHeart,
} from "@/src/5-entities/heart-pixel/PixelHeart";
import { Modal } from "@/src/6-shared/ui/modal/Modal";

type InstagramStoryDialogProps = {
  donation: DonationRecord;
  onClose: () => void;
};

type StoryCopy = {
  brandName: string;
  hashtag: string;
  titleFirst: string;
  titleHighlighted: string;
  titleLast: string;
  tagline: string;
  pixelLabel: string;
  anonymousDonor: string;
  defaultMessage: string;
  footerAction: string;
  footerDomain: string;
  joinButton: string;
  linkStickerLabel: string;
  fileName: string;
  canvasError: string;
  imageError: string;
};

const COLORS = {
  cream: "#FFF6EB",
  white: "#FFFFFF",
  navy: "#0D2734",
  red: "#D6384B",
  orange: "#F5A33B",
  muted: "#6D7475",
  freePixel: "#E7E0D7",
};

const roundedRect = (
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) => {
  context.beginPath();
  context.roundRect(x, y, width, height, radius);
  context.fill();
};

const drawWrappedText = (
  context: CanvasRenderingContext2D,
  value: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines = 2,
) => {
  const words = value.trim().split(/\s+/);
  const lines: string[] = [];
  let line = "";

  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;

    if (context.measureText(candidate).width > maxWidth && line) {
      lines.push(line);
      line = word;

      if (lines.length === maxLines - 1) {
        break;
      }
    } else {
      line = candidate;
    }
  }

  if (line && lines.length < maxLines) {
    lines.push(line);
  }

  lines.forEach((text, index) => {
    context.fillText(text, x, y + index * lineHeight);
  });
};

const drawPixelLogo = (
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
) => {
  const size = 18;
  const gap = 4;

  const pixels = [
    { col: 0, row: 0, color: COLORS.red },
    { col: 1, row: 0, color: COLORS.red },
    { col: 2, row: 0, color: COLORS.orange },
    { col: 0.5, row: 1, color: COLORS.red },
    { col: 1.5, row: 1, color: COLORS.red },
    { col: 1, row: 2, color: COLORS.navy },
  ];

  pixels.forEach((pixel) => {
    context.fillStyle = pixel.color;
    context.fillRect(
      x + pixel.col * (size + gap),
      y + pixel.row * (size + gap),
      size,
      size,
    );
  });
};

const drawLinkIcon = (
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
) => {
  const scale = size / 24;

  context.save();
  context.translate(x, y);
  context.scale(scale, scale);
  context.strokeStyle = "#287EB1";
  context.lineWidth = 2.4;
  context.lineCap = "round";
  context.lineJoin = "round";
  context.stroke(
    new Path2D(
      "M10.5 13.5a4 4 0 0 0 5.66.06l2.4-2.4a4 4 0 0 0-5.66-5.66l-1.38 1.38",
    ),
  );
  context.stroke(
    new Path2D(
      "M13.5 10.5a4 4 0 0 0-5.66-.06l-2.4 2.4a4 4 0 0 0 5.66 5.66l1.38-1.38",
    ),
  );
  context.restore();
};

const createInstagramStory = async (
  donation: DonationRecord,
  copy: StoryCopy,
): Promise<File> => {
  await document.fonts.ready;

  return new Promise<File>((resolve, reject) => {
    const canvas = document.createElement("canvas");

    canvas.width = 1080;
    canvas.height = 1920;

    const context = canvas.getContext("2d");

    if (!context) {
      reject(new Error(copy.canvasError));
      return;
    }

    context.fillStyle = COLORS.cream;
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = "rgba(214, 56, 75, 0.10)";

    for (let x = 24; x < canvas.width; x += 38) {
      for (let y = 24; y < canvas.height; y += 38) {
        context.fillRect(x, y, 2, 2);
      }
    }

    drawPixelLogo(context, 76, 72);

    context.textAlign = "center";
    context.fillStyle = COLORS.navy;
    context.font = '700 88px "Cormorant Garamond", Georgia, serif';
    context.fillText(copy.titleFirst, 540, 260);

    context.fillStyle = COLORS.red;
    context.fillText(copy.titleHighlighted, 540, 348);

    context.fillStyle = COLORS.navy;
    context.fillText(copy.titleLast, 540, 436);

    context.fillStyle = COLORS.muted;
    context.font = '400 28px "Geist", Arial, sans-serif';
    context.fillText(copy.tagline, 540, 492);

    context.shadowColor = "rgba(13, 39, 52, 0.14)";
    context.shadowBlur = 24;
    context.shadowOffsetY = 12;
    context.fillStyle = COLORS.white;
    roundedRect(context, 390, 560, 300, 72, 22);

    context.shadowColor = "transparent";
    context.shadowBlur = 0;
    context.shadowOffsetY = 0;
    context.fillStyle = "#287EB1";
    context.font = '700 25px "Geist", Arial, sans-serif';
    drawLinkIcon(context, 430, 579, 34);
    context.fillText(copy.linkStickerLabel, 558, 606);

    const cell = 16;
    const gap = 4;
    const heartWidth = HEART_COLUMNS * cell + (HEART_COLUMNS - 1) * gap;
    const heartX = (canvas.width - heartWidth) / 2;
    const heartY = 700;
    const selectedHeartPixel = HEART_PIXELS.find(
      (pixel) => pixel.id + 1 === donation.id,
    );
    const selectedPixelY = selectedHeartPixel
      ? heartY + selectedHeartPixel.row * (cell + gap) + cell
      : heartY + heartWidth;

    HEART_PIXELS.forEach((pixel) => {
      const x = heartX + pixel.col * (cell + gap);
      const y = heartY + pixel.row * (cell + gap);
      const isMine = pixel.id + 1 === donation.id;

      context.fillStyle = isMine
        ? donation.color
        : isInitiallySold(pixel.id)
          ? PIXEL_PALETTE[pixel.id % PIXEL_PALETTE.length]
          : COLORS.freePixel;

      context.fillRect(x, y, cell, cell);

      if (isMine) {
        context.strokeStyle = COLORS.navy;
        context.lineWidth = 7;
        context.strokeRect(x - 6, y - 6, cell + 12, cell + 12);

        context.strokeStyle = COLORS.orange;
        context.lineWidth = 3;
        context.strokeRect(x - 13, y - 13, cell + 26, cell + 26);
      }
    });

    const donorCardWidth = 650;
    const donorCardHeight = 205;
    const donorCardLeftPercent = selectedHeartPixel
      ? Math.min(
          Math.max(
            ((selectedHeartPixel.col + 0.5) / HEART_COLUMNS) * 100,
            28,
          ),
          72,
        )
      : 50;
    const donorCardX =
      heartX +
      (donorCardLeftPercent / 100) * heartWidth -
      donorCardWidth / 2;
    const donorCardY = selectedPixelY + 25;

    context.fillStyle = COLORS.white;
    context.shadowColor = "rgba(13, 39, 52, 0.13)";
    context.shadowBlur = 24;
    context.shadowOffsetY = 10;

    roundedRect(
      context,
      donorCardX,
      donorCardY,
      donorCardWidth,
      donorCardHeight,
      24,
    );

    context.shadowColor = "transparent";
    context.shadowBlur = 0;
    context.shadowOffsetY = 0;

    context.fillStyle = donation.color;
    roundedRect(context, donorCardX + 28, donorCardY + 28, 140, 149, 18);

    context.strokeStyle = COLORS.navy;
    context.lineWidth = 7;
    context.strokeRect(donorCardX + 38, donorCardY + 38, 120, 129);

    context.fillStyle = COLORS.white;
    context.textAlign = "center";
    context.font = '800 34px "Geist", Arial, sans-serif';
    context.fillText(`#${donation.id}`, donorCardX + 98, donorCardY + 116);

    context.textAlign = "left";
    context.fillStyle = COLORS.navy;
    context.font = '700 48px "Cormorant Garamond", Georgia, serif';

    drawWrappedText(
      context,
      donation.name || copy.anonymousDonor,
      donorCardX + 195,
      donorCardY + 88,
      415,
      48,
    );

    context.fillStyle = COLORS.muted;
    context.font = '400 24px "Geist", Arial, sans-serif';

    drawWrappedText(
      context,
      donation.message ? `„${donation.message}”` : copy.defaultMessage,
      donorCardX + 195,
      donorCardY + 142,
      415,
      31,
    );

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error(copy.imageError));
          return;
        }

        resolve(
          new File([blob], `${copy.fileName}-${donation.id}.png`, {
            type: "image/png",
          }),
        );
      },
      "image/png",
      1,
    );
  });
};

function InstagramStoryDialogContent({
  donation,
  onClose,
}: InstagramStoryDialogProps) {
  const t = useTranslations("InstagramStoryDialog");
  const locale = useLocale();
  const [storyFile, setStoryFile] = useState<File | null>(null);
  const [shareStatus, setShareStatus] = useState("");
  const [isPreparing, setIsPreparing] = useState(true);
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const copy: StoryCopy = {
      brandName: t("story.brandName"),
      hashtag: t("story.hashtag"),
      titleFirst: t("story.title.first"),
      titleHighlighted: t("story.title.highlighted"),
      titleLast: t("story.title.last"),
      tagline: t("story.tagline"),
      pixelLabel: t("story.pixelLabel"),
      anonymousDonor: t("story.anonymousDonor"),
      defaultMessage: t("story.defaultMessage"),
      footerAction: t("story.footerAction"),
      footerDomain: t("story.footerDomain"),
      joinButton: t("story.joinButton"),
      linkStickerLabel: t("story.linkStickerLabel"),
      fileName: t("story.fileName"),
      canvasError: t("errors.canvasUnsupported"),
      imageError: t("errors.imageGeneration"),
    };

    createInstagramStory(donation, copy)
      .then((file) => {
        if (!cancelled) {
          setStoryFile(file);
          setIsPreparing(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setIsPreparing(false);
          setShareStatus(t("status.preparationFailed"));
        }
      });

    return () => {
      cancelled = true;
    };
  }, [donation, locale, t]);

  const downloadStory = () => {
    if (!storyFile) {
      return;
    }

    const url = URL.createObjectURL(storyFile);
    const link = document.createElement("a");

    link.href = url;
    link.download = storyFile.name;
    link.click();

    window.setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 100);

    setShareStatus(t("status.downloaded"));
  };

  const shareToInstagram = async () => {
    if (!storyFile) return;

    try {
      const canShareFile =
        typeof navigator.share === "function" &&
        typeof navigator.canShare === "function" &&
        navigator.canShare({ files: [storyFile] });

      if (!canShareFile) {
        downloadStory();
        return;
      }

      await navigator.share({
        files: [storyFile],
        title: t("sharing.title"),
        text: t("sharing.text"),
      });

      setShareStatus(t("status.shared"));
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        setShareStatus(t("status.cancelled"));
        return;
      }

      downloadStory();
    }
  };

  const steps = [
    t("controls.steps.share"),
    t("controls.steps.instagram"),
    t("controls.steps.publish"),
  ];
  const selectedHeartPixel = HEART_PIXELS.find(
    (pixel) => pixel.id + 1 === donation.id,
  );
  const donorCardLeft = selectedHeartPixel
    ? Math.min(
        Math.max(((selectedHeartPixel.col + 0.5) / HEART_COLUMNS) * 100, 28),
        72,
      )
    : 50;
  const donorCardTop = selectedHeartPixel
    ? ((selectedHeartPixel.row + 1) / HEART_ROWS) * 100
    : 100;

  return (
    <Modal
      labelledBy="story-title"
      closeLabel={t("modal.closeLabel")}
      overlayClassName="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-[#0D2734]/75 p-4 backdrop-blur-sm sm:p-6"
      dialogClassName="relative w-full max-w-xl overflow-hidden rounded-[32px] bg-[#FFF6EB] shadow-[0_30px_100px_rgba(13,39,52,0.35)]"
      closeButtonClassName="absolute right-4 top-4 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-[#0D2734]/10 bg-white text-xl text-[#0D2734] shadow-sm transition hover:bg-[#D6384B] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D6384B]"
      onClose={onClose}
    >
      {previewOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="story-preview-title"
          className="fixed inset-0 z-[120] flex items-center justify-center overflow-y-auto bg-[#0D2734]/85 p-4 backdrop-blur-md sm:p-6"
        >
          <div className="relative flex w-full max-w-md items-center justify-center rounded-[32px] bg-[#F4E8DD] p-5 shadow-[0_30px_100px_rgba(13,39,52,0.45)] sm:p-8">
            <h2 id="story-preview-title" className="sr-only">
              {t("preview.modalTitle")}
            </h2>

            <button
              type="button"
              onClick={() => setPreviewOpen(false)}
              aria-label={t("preview.closeLabel")}
              className="absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-[#0D2734]/10 bg-white text-xl text-[#0D2734] shadow-sm transition hover:bg-[#D6384B] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D6384B]"
            >
              ×
            </button>

            <div
              aria-label={t("preview.ariaLabel")}
              className="relative aspect-[9/16] w-full max-w-[340px] overflow-hidden rounded-[28px] bg-[#FFF6EB] shadow-[0_24px_60px_rgba(13,39,52,0.18)]"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-30"
                style={{
                  backgroundImage:
                    "radial-gradient(#D6384B 1px, transparent 1px)",
                  backgroundSize: "18px 18px",
                }}
              />

              <div className="relative flex h-full flex-col p-6">
                <header className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span
                      aria-hidden="true"
                      className="grid grid-cols-3 gap-[2px]"
                    >
                      <span className="h-2 w-2 rounded-[1px] bg-[#D6384B]" />
                      <span className="h-2 w-2 rounded-[1px] bg-[#D6384B]" />
                      <span className="h-2 w-2 rounded-[1px] bg-[#F5A33B]" />

                      <span className="col-start-1 ml-[5px] h-2 w-2 rounded-[1px] bg-[#D6384B]" />
                      <span className="h-2 w-2 rounded-[1px] bg-[#D6384B]" />

                      <span className="col-start-2 h-2 w-2 rounded-[1px] bg-[#0D2734]" />
                    </span>
                  </div>
                </header>

                <div className="text-center">
                  <h3 className="mt-3 font-serif text-[28px] font-bold leading-[1.05] tracking-[-0.03em] text-[#0D2734]">
                    {t("story.title.first")}
                    <span className="block text-[#D6384B]">
                      {t("story.title.highlighted")}
                    </span>
                    {t("story.title.last")}
                  </h3>

                  <p className="mt-3 text-[10px] text-[#6D7475]">
                    {t("story.tagline")}
                  </p>
                </div>

                <div className="mt-auto flex justify-center pt-5">
                  <div
                    className={[
                      "inline-flex items-center justify-center gap-1",
                      "rounded-[16px] bg-white px-5 py-1.5",
                      "text-[12px] font-bold uppercase tracking-[0.04em]",
                      "text-[#287EB1]",
                      "shadow-[0_5px_0_rgba(13,39,52,0.12),0_10px_24px_rgba(13,39,52,0.18)]",
                    ].join(" ")}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.4}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                      className="h-5 w-5 shrink-0"
                    >
                      <path d="M10.5 13.5a4 4 0 0 0 5.66.06l2.4-2.4a4 4 0 0 0-5.66-5.66l-1.38 1.38" />
                      <path d="M13.5 10.5a4 4 0 0 0-5.66-.06l-2.4 2.4a4 4 0 0 0 5.66 5.66l1.38-1.38" />
                    </svg>

                    <span>{t("story.linkStickerLabel")}</span>
                  </div>
                </div>
                <div className="mt-5 flex flex-1 items-center justify-center">
                  <div className="relative w-full max-w-[260px] overflow-visible">
                    <PixelHeart
                      className="!max-w-none gap-px"
                      highlightedPixel={donation.id}
                      purchasedPixels={{
                        [donation.id]: donation.color,
                      }}
                    />

                    <div
                      className={[
                        "absolute z-20 w-[205px]",
                        "-translate-x-1/2",
                        "rounded-xl bg-white p-2.5",
                        "shadow-[0_10px_26px_rgba(13,39,52,0.16)]",
                      ].join(" ")}
                      style={{
                        left: `${donorCardLeft}%`,
                        top: `calc(${donorCardTop}% + 8px)`,
                      }}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border-2 border-[#0D2734] text-[10px] font-extrabold text-white"
                          style={{ backgroundColor: donation.color }}
                        >
                          #{donation.id}
                        </div>

                        <div className="min-w-0 text-left">
                          <strong className="mt-0.5 block truncate font-serif text-sm text-[#0D2734]">
                            {donation.name || t("story.anonymousDonor")}
                          </strong>
                          <p className="mt-0.5 line-clamp-1 text-[7px] text-[#6D7475]">
                            „{donation.message || t("story.defaultMessage")}”
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col justify-center px-6 py-10 sm:px-10 lg:px-12">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#D6384B]">
          {t("controls.eyebrow")}
        </p>

        <h2
          id="story-title"
          className="mt-4 text-4xl font-extrabold leading-tight tracking-[-0.04em] text-[#0D2734]"
        >
          {t("controls.title")}
        </h2>

        <p className="mt-4 max-w-lg text-sm leading-7 text-[#6D7475]">
          {t("controls.description")}
        </p>

        <ol className="mt-8 space-y-4">
          {steps.map((step, index) => (
            <li
              key={step}
              className="flex items-center gap-4 text-sm font-semibold text-[#0D2734]"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FCE4E1] text-xs font-extrabold text-[#D6384B]">
                {index + 1}
              </span>

              {step}
            </li>
          ))}
        </ol>

        <button
          type="button"
          onClick={() => setPreviewOpen(true)}
          className="mt-9 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl border-2 border-[#D6384B] bg-white px-6 text-sm font-extrabold text-[#D6384B] transition hover:bg-[#D6384B] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D6384B] focus-visible:ring-offset-2"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
            <circle cx="12" cy="12" r="2.5" />
          </svg>
          {t("controls.previewButton")}
        </button>

        <button
          type="button"
          onClick={shareToInstagram}
          disabled={!storyFile}
          className="mt-3 inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-2xl bg-[#D6384B] px-6 text-sm font-extrabold text-white shadow-[0_12px_30px_rgba(214,56,75,0.2)] transition hover:-translate-y-0.5 hover:bg-[#BF2F41] disabled:cursor-wait disabled:opacity-50"
        >
          {isPreparing ? (
            <>
              <span
                aria-hidden="true"
                className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white"
              />
              {t("controls.preparing")}
            </>
          ) : (
            <>
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
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
              {t("controls.shareButton")}
            </>
          )}
        </button>

        <button
          type="button"
          onClick={downloadStory}
          disabled={!storyFile}
          className="mt-3 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl border-2 border-[#0D2734] px-6 text-sm font-extrabold text-[#0D2734] transition hover:bg-[#0D2734] hover:text-white disabled:cursor-wait disabled:opacity-40"
        >
          {t("controls.downloadButton")}
          <span aria-hidden="true">↓</span>
        </button>

        <p className="mt-4 text-center text-xs leading-5 text-[#6D7475]">
          {t("controls.helper")}
        </p>

        {shareStatus && (
          <p
            role="status"
            className="mt-4 rounded-xl bg-white px-4 py-3 text-center text-xs font-semibold text-[#0D2734] shadow-sm"
          >
            {shareStatus}
          </p>
        )}
      </div>
    </Modal>
  );
}

export function InstagramStoryDialog(props: InstagramStoryDialogProps) {
  return <InstagramStoryDialogContent key={props.donation.id} {...props} />;
}
