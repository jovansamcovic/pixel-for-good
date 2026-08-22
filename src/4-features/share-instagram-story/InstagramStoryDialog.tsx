"use client";

import { useEffect, useState } from "react";

import type { DonationRecord } from "@/src/5-entities/donation/DonationBadge";
import {
  HEART_COLUMNS,
  HEART_PIXELS,
  isInitiallySold,
  PIXEL_PALETTE,
  PixelHeart,
} from "@/src/5-entities/heart-pixel/PixelHeart";
import { Modal } from "@/src/6-shared/ui/modal/Modal";

type InstagramStoryDialogProps = {
  donation: DonationRecord;
  onClose: () => void;
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

const createInstagramStory = async (
  donation: DonationRecord,
): Promise<File> => {
  await document.fonts.ready;

  return new Promise<File>((resolve, reject) => {
    const canvas = document.createElement("canvas");

    canvas.width = 1080;
    canvas.height = 1920;

    const context = canvas.getContext("2d");

    if (!context) {
      reject(new Error("Canvas nije podržan."));
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

    drawPixelLogo(context, 72, 64);

    context.textAlign = "left";
    context.fillStyle = COLORS.navy;
    context.font = '800 29px "Sora", Arial, sans-serif';
    context.fillText("izaberi pixel", 160, 108);

    context.textAlign = "right";
    context.fillStyle = COLORS.red;
    context.font = '800 21px "Sora", Arial, sans-serif';
    context.fillText("#PIXELPOPIXEL", 1004, 108);

    context.textAlign = "center";
    context.fillStyle = COLORS.navy;
    context.font = '800 88px "Sora", Arial, sans-serif';
    context.fillText("Jedan piksel.", 540, 240);

    context.fillStyle = COLORS.red;
    context.font = '700 88px "Fraunces", Georgia, serif';
    context.fillText("Jedan korak", 540, 330);

    context.fillStyle = COLORS.navy;
    context.font = '800 88px "Sora", Arial, sans-serif';
    context.fillText("bliže cilju.", 540, 420);

    context.fillStyle = COLORS.muted;
    context.font = '400 28px "Sora", Arial, sans-serif';
    context.fillText("Postani i ti deo zajedničke slike dobrote.", 540, 474);

    const cell = 15;
    const gap = 3;
    const heartWidth = HEART_COLUMNS * cell + (HEART_COLUMNS - 1) * gap;
    const heartX = (canvas.width - heartWidth) / 2;
    const heartY = 540;

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

    context.fillStyle = COLORS.white;
    context.shadowColor = "rgba(13, 39, 52, 0.13)";
    context.shadowBlur = 34;
    context.shadowOffsetY = 14;

    roundedRect(context, 76, 1280, 928, 390, 28);

    context.shadowColor = "transparent";
    context.shadowBlur = 0;
    context.shadowOffsetY = 0;

    context.fillStyle = donation.color;
    roundedRect(context, 128, 1350, 222, 222, 20);

    context.strokeStyle = COLORS.navy;
    context.lineWidth = 7;
    context.strokeRect(141, 1363, 196, 196);

    context.fillStyle = COLORS.white;
    context.textAlign = "center";
    context.font = '800 44px "Sora", Arial, sans-serif';
    context.fillText(`#${donation.id}`, 239, 1481);

    context.textAlign = "left";
    context.fillStyle = COLORS.red;
    context.font = '800 21px "Sora", Arial, sans-serif';
    context.fillText("MOJ PIKSEL DOBROTE", 404, 1368);

    context.fillStyle = COLORS.navy;
    context.font = '700 48px "Fraunces", Georgia, serif';

    drawWrappedText(
      context,
      donation.name || "Anonimni donator",
      404,
      1432,
      500,
      55,
    );

    context.fillStyle = COLORS.muted;
    context.font = '400 27px "Sora", Arial, sans-serif';

    drawWrappedText(
      context,
      donation.message
        ? `„${donation.message}”`
        : "Hvala što zajedno stvaramo promenu.",
      404,
      1542,
      500,
      39,
    );

    context.fillStyle = COLORS.navy;
    context.fillRect(0, 1765, 1080, 155);

    context.textAlign = "left";
    context.fillStyle = COLORS.white;
    context.font = '800 30px "Sora", Arial, sans-serif';
    context.fillText("Izaberi svoj piksel", 76, 1842);

    context.fillStyle = "rgba(255, 255, 255, 0.55)";
    context.font = '400 20px "Sora", Arial, sans-serif';
    context.fillText("srce-kragujevca.rs", 76, 1880);

    context.fillStyle = COLORS.red;
    roundedRect(context, 814, 1805, 190, 64, 12);

    context.textAlign = "center";
    context.fillStyle = COLORS.white;
    context.font = '800 22px "Sora", Arial, sans-serif';
    context.fillText("PRIDRUŽI SE →", 909, 1846);

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Slika nije mogla da se generiše."));
          return;
        }

        resolve(
          new File([blob], `moj-piksel-${donation.id}.png`, {
            type: "image/png",
          }),
        );
      },
      "image/png",
      1,
    );
  });
};

export function InstagramStoryDialog({
  donation,
  onClose,
}: InstagramStoryDialogProps) {
  const [storyFile, setStoryFile] = useState<File | null>(null);
  const [shareStatus, setShareStatus] = useState("");
  const [isPreparing, setIsPreparing] = useState(true);

  useEffect(() => {
    let cancelled = false;

    setStoryFile(null);
    setShareStatus("");
    setIsPreparing(true);

    createInstagramStory(donation)
      .then((file) => {
        if (!cancelled) {
          setStoryFile(file);
          setIsPreparing(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setIsPreparing(false);
          setShareStatus("Template trenutno nije mogao da se pripremi.");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [donation]);

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

    setShareStatus("Story je preuzet. Sada ga možeš dodati u Instagram Story.");
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
        title: "Moj piksel dobrote",
        text: "Postani i ti deo našeg srca. #PixelPoPixel",
      });

      setShareStatus(
        "Template je prosleđen. Izaberi Instagram Story u meniju za deljenje.",
      );
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        setShareStatus("Deljenje je otkazano.");
        return;
      }

      downloadStory();
    }
  };

  return (
    <Modal
      labelledBy="story-title"
      closeLabel="Zatvori Instagram Story"
      overlayClassName="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-[#0D2734]/75 p-4 backdrop-blur-sm sm:p-6"
      dialogClassName="relative grid w-full max-w-5xl overflow-hidden rounded-[32px] bg-[#FFF6EB] shadow-[0_30px_100px_rgba(13,39,52,0.35)] lg:grid-cols-[minmax(320px,0.8fr)_minmax(0,1.2fr)]"
      closeButtonClassName="absolute right-4 top-4 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-[#0D2734]/10 bg-white text-xl text-[#0D2734] shadow-sm transition hover:bg-[#D6384B] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D6384B]"
      onClose={onClose}
    >
      <div className="flex items-center justify-center bg-[#F4E8DD] p-5 sm:p-8">
        <div
          aria-label="Pregled Instagram Story objave"
          className="relative aspect-[9/16] w-full max-w-[340px] overflow-hidden rounded-[28px] bg-[#FFF6EB] shadow-[0_24px_60px_rgba(13,39,52,0.18)]"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-30"
            style={{
              backgroundImage: "radial-gradient(#D6384B 1px, transparent 1px)",
              backgroundSize: "18px 18px",
            }}
          />

          <div className="relative flex h-full flex-col p-6">
            <header className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span aria-hidden="true" className="grid grid-cols-3 gap-[2px]">
                  <span className="h-2 w-2 rounded-[1px] bg-[#D6384B]" />
                  <span className="h-2 w-2 rounded-[1px] bg-[#D6384B]" />
                  <span className="h-2 w-2 rounded-[1px] bg-[#F5A33B]" />

                  <span className="col-start-1 ml-[5px] h-2 w-2 rounded-[1px] bg-[#D6384B]" />
                  <span className="h-2 w-2 rounded-[1px] bg-[#D6384B]" />

                  <span className="col-start-2 h-2 w-2 rounded-[1px] bg-[#0D2734]" />
                </span>

                <strong className="text-xs font-extrabold text-[#0D2734]">
                  izaberi pixel
                </strong>
              </div>

              <small className="text-[8px] font-extrabold uppercase tracking-[0.1em] text-[#D6384B]">
                #PixelPoPixel
              </small>
            </header>

            <div className="mt-7 text-center">
              <p className="text-[9px] font-extrabold uppercase tracking-[0.12em] text-[#D6384B]">
                Moj trag u srcu
              </p>

              <h3 className="mt-3 font-serif text-[28px] font-bold leading-[1.05] tracking-[-0.03em] text-[#0D2734]">
                Jedan piksel.
                <span className="block text-[#D6384B]">Jedan korak</span>
                bliže cilju.
              </h3>

              <p className="mt-3 text-[10px] text-[#6D7475]">
                Postani i ti deo zajedničke slike dobrote.
              </p>
            </div>

            <div className="mt-5 flex flex-1 items-center justify-center">
              <PixelHeart
                className="!max-w-[260px] gap-px"
                highlightedPixel={donation.id}
                purchasedPixels={{
                  [donation.id]: donation.color,
                }}
              />
            </div>

            <div className="rounded-2xl bg-white p-4 shadow-[0_12px_30px_rgba(13,39,52,0.1)]">
              <div className="flex items-center gap-4">
                <div
                  className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border-[3px] border-[#0D2734] text-sm font-extrabold text-white"
                  style={{
                    backgroundColor: donation.color,
                  }}
                >
                  #{donation.id}
                </div>

                <div className="min-w-0">
                  <p className="text-[8px] font-extrabold uppercase tracking-[0.1em] text-[#D6384B]">
                    Moj piksel dobrote
                  </p>

                  <strong className="mt-1 block truncate font-serif text-lg text-[#0D2734]">
                    {donation.name || "Anonimni donator"}
                  </strong>

                  {donation.message && (
                    <p className="mt-1 line-clamp-2 text-[9px] leading-4 text-[#6D7475]">
                      „{donation.message}”
                    </p>
                  )}
                </div>
              </div>
            </div>

            <footer className="-mx-6 -mb-6 mt-5 flex items-center justify-between gap-3 bg-[#0D2734] px-6 py-4 text-white">
              <div>
                <strong className="block text-[10px]">
                  Izaberi svoj piksel
                </strong>

                <span className="mt-1 block text-[8px] text-white/55">
                  srce-kragujevca.rs
                </span>
              </div>

              <span className="rounded-lg bg-[#D6384B] px-3 py-2 text-[8px] font-extrabold uppercase tracking-wide">
                Pridruži se →
              </span>
            </footer>
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-center px-6 py-10 sm:px-10 lg:px-12">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#D6384B]">
          Tvoj personalizovani Story
        </p>

        <h2
          id="story-title"
          className="mt-4 text-4xl font-extrabold leading-tight tracking-[-0.04em] text-[#0D2734]"
        >
          Spreman za Instagram.
        </h2>

        <p className="mt-4 max-w-lg text-sm leading-7 text-[#6D7475]">
          Story je pripremljen u formatu 1080 × 1920 px. Sadrži označen kupljeni
          piksel, tvoje ime i poruku podrške.
        </p>

        <ol className="mt-8 space-y-4">
          {[
            "Pritisni dugme za deljenje.",
            "Na telefonu izaberi Instagram.",
            "Odaberi Story i objavi.",
          ].map((step, index) => (
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
          onClick={shareToInstagram}
          disabled={!storyFile}
          className="mt-9 inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-2xl bg-[#D6384B] px-6 text-sm font-extrabold text-white shadow-[0_12px_30px_rgba(214,56,75,0.2)] transition hover:-translate-y-0.5 hover:bg-[#BF2F41] disabled:cursor-wait disabled:opacity-50"
        >
          {isPreparing ? (
            <>
              <span
                aria-hidden="true"
                className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white"
              />
              Pripremamo Story…
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
              Podeli na Instagram
            </>
          )}
        </button>

        <button
          type="button"
          onClick={downloadStory}
          disabled={!storyFile}
          className="mt-3 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl border-2 border-[#0D2734] px-6 text-sm font-extrabold text-[#0D2734] transition hover:bg-[#0D2734] hover:text-white disabled:cursor-wait disabled:opacity-40"
        >
          Preuzmi Story kao PNG
          <span aria-hidden="true">↓</span>
        </button>

        <p className="mt-4 text-center text-xs leading-5 text-[#6D7475]">
          Na računaru ili nepodržanom telefonu Story će se automatski preuzeti.
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
