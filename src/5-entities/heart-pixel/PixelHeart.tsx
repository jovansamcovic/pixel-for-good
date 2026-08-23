import type { CSSProperties } from "react";
import { useTranslations } from "next-intl";

export type HeartPixel = {
  id: number;
  row: number;
  col: number;
};

export const HEART_COLUMNS = 42;
export const HEART_ROWS = 41;
export const PIXEL_PRICE = 1_000;
export const STARTING_SOLD = 684;

export const PIXEL_PALETTE = [
  "#ef5b57",
  "#f17872",
  "#dc454d",
  "#f59b83",
  "#b72e43",
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

  for (let row = 0; row < HEART_ROWS; row += 1) {
    for (let col = 0; col < HEART_COLUMNS; col += 1) {
      const x = (col / (HEART_COLUMNS - 1)) * 2.5 - 1.25;

      const y = 1.2 - (row / (HEART_ROWS - 1)) * 2.4;

      const inside =
        Math.pow(x * x + y * y - 1, 3) - x * x * Math.pow(y, 3) <= 0;

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

export const isInitiallySold = (id: number) =>
  (id * 37 + 13) % 1_000 < STARTING_SOLD;

type PixelHeartProps = {
  highlightedPixel?: number;
  purchasedPixels?: Record<number, string>;
  selectedPixel?: number | null;
  interactive?: boolean;
  onSelect?: (pixelId: number) => void;
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
  const t = useTranslations("PixelHeart");

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
      role={interactive ? "group" : "img"}
      aria-label={t("ariaLabel")}
      className={[
        "grid aspect-[42/41] w-full max-w-[560px]",
        "grid-cols-[repeat(42,minmax(0,1fr))]",
        "grid-rows-[repeat(41,minmax(0,1fr))]",
        "gap-[1px] sm:gap-[2px]",
        className,
      ].join(" ")}
    >
      {HEART_PIXELS.map((pixel) => {
        const pixelNumber = pixel.id + 1;

        const purchasedColor = purchasedPixels[pixelNumber];

        const sold = isInitiallySold(pixel.id) || Boolean(purchasedColor);

        const selected = selectedPixel === pixelNumber;

        const highlighted = highlightedPixel === pixelNumber;

        const color =
          purchasedColor ?? PIXEL_PALETTE[pixel.id % PIXEL_PALETTE.length];

        const pixelStyle: PixelStyle = {
          "--pixel-column": pixel.col + 1,
          "--pixel-row": pixel.row + 1,
          "--pixel-color": highlighted
            ? (purchasedColor ?? color)
            : sold
              ? color
              : "#fbf8f3",
        };

        const positionClasses = [
          "[grid-column:var(--pixel-column)]",
          "[grid-row:var(--pixel-row)]",
          "bg-[var(--pixel-color)]",
        ].join(" ");

        if (!interactive) {
          return (
            <span
              key={pixel.id}
              style={pixelStyle}
              aria-hidden="true"
              className={[
                positionClasses,
                "aspect-square min-h-0 min-w-0 rounded-[1px]",
                highlighted
                  ? [
                      "relative z-20",
                      "after:pointer-events-none after:absolute",
                      "after:-inset-[4px] after:content-['']",
                      "after:border-4 after:border-black",
                    ].join(" ")
                  : "",
              ].join(" ")}
            />
          );
        }

        const donor = donorNames[pixel.id % donorNames.length];

        return (
          <button
            key={pixel.id}
            type="button"
            style={pixelStyle}
            disabled={sold}
            aria-pressed={selected}
            aria-label={
              sold
                ? t("soldAriaLabel", {
                    pixel: pixelNumber,
                    donor,
                  })
                : t("availableAriaLabel", {
                    pixel: pixelNumber,
                  })
            }
            title={
              sold
                ? t("soldTitle", {
                    donor,
                  })
                : t("availableTitle", {
                    pixel: pixelNumber,
                  })
            }
            onClick={() => {
              if (!sold) {
                onSelect?.(pixelNumber);
              }
            }}
            className={[
              positionClasses,
              "aspect-square min-h-0 min-w-0 appearance-none rounded-[1px]",
              "border p-0 outline-none transition-colors duration-150",
              sold
                ? "cursor-not-allowed border-white/60"
                : [
                    "cursor-pointer border-[#D8D4CE]",
                    "hover:z-10 hover:border-[#0D2734]",
                    "hover:bg-[#FDE6B9]",
                    "focus-visible:z-10",
                    "focus-visible:border-[#0D2734]",
                    "focus-visible:ring-2",
                    "focus-visible:ring-[#F5A33B]",
                  ].join(" "),
              selected
                ? [
                    "z-20",
                    "!border-[#0D2734]",
                    "!bg-[#F5A33B]",
                    "ring-2 ring-[#0D2734]",
                    "ring-offset-1 ring-offset-white",
                  ].join(" ")
                : "",
            ].join(" ")}
          />
        );
      })}
    </div>
  );
}
