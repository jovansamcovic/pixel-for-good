import type { CSSProperties } from "react";

import { useTranslations } from "next-intl";

export type HeartPixel = {
  id: number;
  row: number;
  col: number;
};

export const HEART_COLUMNS = 43;
export const HEART_ROWS = 40;

export const PIXEL_PRICE = 1_000;
export const STARTING_SOLD = 684;

export const PIXEL_PALETTE = [
  "#EB575B",
  "#F06A6D",
  "#E95358",
  "#F17D7B",
  "#D94750",
];

export const DONOR_NAMES = [
  "Mina P.",
  "Vuk i Tara",
  "Porodica Ilić",
  "Luka M.",
  "Ana i Ognjen",
  "Anonimno",
];

export const HEART_PIXELS: HeartPixel[] = (() => {
  const pixels: HeartPixel[] = [];

  let id = 0;

  for (
    let row = 0;
    row < HEART_ROWS;
    row += 1
  ) {
    for (
      let col = 0;
      col < HEART_COLUMNS;
      col += 1
    ) {
      const x =
        (col / (HEART_COLUMNS - 1)) * 2.5 -
        1.25;

      const y =
        1.2 -
        (row / (HEART_ROWS - 1)) * 2.464;

      const inside =
        Math.pow(
          x * x + y * y - 1,
          3,
        ) -
          x * x * Math.pow(y, 3) <=
        0;

      if (inside) {
        pixels.push({
          id: id++,
          row,
          col,
        });
      }
    }
  }

  return pixels;
})();

export const isInitiallySold = (
  id: number,
) =>
  (id * 37 + 13) % 1_000 <
  STARTING_SOLD;

type PixelHeartProps = {
  highlightedPixel?: number;
  purchasedPixels?: Record<
    number,
    string
  >;
  selectedPixel?: number | null;
  interactive?: boolean;
  onSelect?: (
    pixelId: number,
  ) => void;
  className?: string;
};

type PixelStyle = CSSProperties & {
  "--pixel-column": number;
  "--pixel-row": number;
  "--pixel-color": string;
};

export function PixelHeart({
  highlightedPixel,
  purchasedPixels = {},
  selectedPixel = null,
  interactive = false,
  onSelect,
  className = "",
}: PixelHeartProps) {
  const t =
    useTranslations("PixelHeart");

  const donorNames = [
    t("donors.mina"),
    t("donors.vukAndTara"),
    t("donors.ilicFamily"),
    t("donors.luka"),
    t("donors.anaAndOgnjen"),
    t("donors.anonymous"),
  ];

  return (
    <div
      role={
        interactive
          ? "group"
          : "img"
      }
      aria-label={t("ariaLabel")}
      className={[
        "grid",
        "aspect-[43/41]",
        "w-full",
        "max-w-[560px]",
        "grid-cols-[repeat(43,minmax(0,1fr))]",
        "grid-rows-[repeat(41,minmax(0,1fr))]",
        "gap-[2px] sm:gap-[3px]",
        className,
      ].join(" ")}
    >
      {HEART_PIXELS.map(
        (pixel) => {
          const pixelNumber =
            pixel.id + 1;

          const purchasedColor =
            purchasedPixels[
              pixelNumber
            ];

          const sold =
            isInitiallySold(
              pixel.id,
            ) ||
            Boolean(
              purchasedColor,
            );

          const selected =
            selectedPixel ===
            pixelNumber;

          const highlighted =
            highlightedPixel ===
            pixelNumber;

          const soldColor =
            purchasedColor ??
            PIXEL_PALETTE[
              pixel.id %
                PIXEL_PALETTE.length
            ];

          const pixelColor =
            sold
              ? soldColor
              : "#FBE7E3";

          const pixelStyle: PixelStyle = {
            "--pixel-column":
              pixel.col + 1,
            "--pixel-row":
              pixel.row + 1,
            "--pixel-color":
              pixelColor,
          };

          const positionClasses = [
            "[grid-column:var(--pixel-column)]",
            "[grid-row:var(--pixel-row)]",
          ].join(" ");

          if (!interactive) {
            return (
              <span
                key={pixel.id}
                style={pixelStyle}
                aria-hidden="true"
                className={[
                  positionClasses,
                  "relative",
                  "aspect-square",
                  "min-h-0",
                  "min-w-0",
                  "rounded-[2px]",
                  "bg-[var(--pixel-color)]",
                  highlighted
                    ? [
                        "z-20",
                        "!bg-[#FFD665]",
                        "ring-[2px]",
                        "ring-[#102F3B]",
                      ].join(" ")
                    : "",
                ].join(" ")}
              />
            );
          }

          const donor =
            donorNames[
              pixel.id %
                donorNames.length
            ];

          return (
            <button
              key={pixel.id}
              type="button"
              style={pixelStyle}
              disabled={sold}
              aria-pressed={
                selected
              }
              aria-label={
                sold
                  ? t(
                      "soldAriaLabel",
                      {
                        pixel:
                          pixelNumber,
                        donor,
                      },
                    )
                  : t(
                      "availableAriaLabel",
                      {
                        pixel:
                          pixelNumber,
                      },
                    )
              }
              title={
                sold
                  ? t(
                      "soldTitle",
                      {
                        donor,
                      },
                    )
                  : t(
                      "availableTitle",
                      {
                        pixel:
                          pixelNumber,
                      },
                    )
              }
              onClick={() => {
                if (!sold) {
                  onSelect?.(
                    pixelNumber,
                  );
                }
              }}
              className={[
                positionClasses,
                "relative",
                "aspect-square",
                "min-h-0",
                "min-w-0",
                "appearance-none",
                "rounded-[2px]",
                "p-0",
                "outline-none",
                "transition-[background-color,border-color,transform]",
                "duration-150",
                sold
                  ? [
                      "cursor-default",
                      "border-0",
                      "bg-[var(--pixel-color)]",
                    ].join(" ")
                  : [
                      "cursor-pointer",
                      "border",
                      "border-[#F4B7B2]",
                      "bg-[#FBE7E3]",
                      "hover:z-10",
                      "hover:border-[#E95A5E]",
                      "hover:bg-[#F8D2CD]",
                      "focus-visible:z-10",
                      "focus-visible:outline-none",
                    ].join(" "),
                selected
                  ? [
                      "z-30",
                      "!border-[2px]",
                      "!border-[#102F3B]",
                      "!bg-[#FFD665]",
                      "scale-[1.08]",
                    ].join(" ")
                  : "",
              ].join(" ")}
            />
          );
        },
      )}
    </div>
  );
}