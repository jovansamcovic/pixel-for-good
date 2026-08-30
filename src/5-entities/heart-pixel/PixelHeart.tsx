import type { CSSProperties } from "react";

import { useTranslations } from "next-intl";

export type HeartPixel = {
  id: number;
  row: number;
  col: number;
  targetColor: string;
};

export const HEART_COLUMNS = 60;
export const HEART_ROWS = 56;

export const HEART_RENDER_ROWS =
  HEART_ROWS;

export const PIXEL_PRICE = 1_000;

const LOGO_SRC =
  "/images/srce-kragujevca-pixel.png";

const COLORS = {
  navy: "#123247",
  red: "#D73547",
  coral: "#EF4F4F",
  orange: "#F59A3D",
  yellow: "#FFBC4C",
  cream: "#FFF8EE",
} as const;

export const PIXEL_PALETTE = [
  COLORS.red,
  COLORS.coral,
  COLORS.orange,
  COLORS.yellow,
  COLORS.navy,
];

export const DONOR_NAMES = [
  "Mina P.",
  "Vuk i Tara",
  "Porodica Ilić",
  "Luka M.",
  "Ana i Ognjen",
  "Anonimno",
];

/**
 * 1 = this cell belongs to the artwork
 * 0 = transparent area around the artwork
 *
 * Only cells marked with 1 become purchasable pixels.
 */
const LOGO_MASK = [
  "000000000001111111100000000000000000000111111111000000000000",
  "000000000111111111111100000000000000111111111111100000000000",
  "000000001111111111111111000000000001111111111111110000000000",
  "000000011111111111111111100000000011111111111111111100000000",
  "000000111111111111111111110000000111111111111111111110000000",
  "000001111111111111111111111000001111111111111111111111000000",
  "000011111111111111111111111100011111111111111111111111100000",
  "000111111111111111111111111110011111111111111111111111110000",
  "000111111111111111111111111110111111111111111111111111111000",
  "001111111111111111111111111111111111111111111111111111111000",
  "011111111111111111111111111111111111111111111111111111111100",
  "011111111111111111111111111111111111111111111111111111111100",
  "111111111111111111111111111111111111111111111111111111111110",
  "111111111111111111111111111111111111111111111111111111111110",
  "111111111111111111111111111111111111111111111111111111111111",
  "111111111111111111111111111111111111111111111111111111111111",
  "111111111111111111111111111111111111111111111111111111111111",
  "111111111111111111111111111111111111111111111111111111111111",
  "111111111111111111111111111111111111111111111111111111111111",
  "111111111111111111111111111111111111111111111111111111111111",
  "111111111111111111111111111111111111111111111111111111111111",
  "111111111111111111111111111111111111111111111111111111111111",
  "111111111111111111111111111111111111111111111111111111111111",
  "111111111111111111111111111111111111111111111111111111111111",
  "111111111111111111111111111111111111111111111111111111111111",
  "111111111111111111111111111111111111111111111111111111111111",
  "111111111111111111111111111111111111111111111111111111111111",
  "111111111111111111111111111111111111111111111111111111111110",
  "011111111111111111111111111111111111111111111111111111111110",
  "011111111111111111111111111111111111111111111111111111111110",
  "001111111111111111111111111111111111111111111111111111111100",
  "001111111111111111111111111111111111111111111111111111111000",
  "000111111111111111111111111111111111111111111111111111111000",
  "000111111111111111111111111111111111111111111111111111110000",
  "000011111111111111111111111111111111111111111111111111110000",
  "000001111111111111111111111111111111111111111111111111100000",
  "000000111111111111111111111111111111111111111111111111110000",
  "000001111111111111111111111111111111111111111111111111110000",
  "000011111111111111111111111111111111111111111111111111110000",
  "000011111111111111111111111111111111111111111111111111110000",
  "000011111111111111111111111111111111111111111111111111110000",
  "000011111111111111111111111111111111111111111111111111110000",
  "000001111111111111111111111111111111111111111111111111100000",
  "000001111111111111111111111111111111111111110001110000000000",
  "000011111111111111111111111111111111111110000000000000000000",
  "000011111111111111111111111111111111111100000000000000000000",
  "000011111111111111011111111111111111111000000000000000000000",
  "000001111100111000000011111111111111110000000000000000000000",
  "000001111000000000000001111111111111100000000000000000000000",
  "000000000000000000000001111111111111000000000000000000000000",
  "000000000000000000000000111111111110000000000000000000000000",
  "000000000000000000000000011111111100000000000000000000000000",
  "000000000000000000000000001111111000000000000000000000000000",
  "000000000000000000000000000111110000000000000000000000000000",
  "000000000000000000000000000011100000000000000000000000000000",
  "000000000000000000000000000001000000000000000000000000000000",
] as const;

/**
 * Generate only real artwork pixels.
 *
 * No DOM node is created for 0 cells,
 * therefore background can never be purchased.
 */
export const HEART_PIXELS: HeartPixel[] =
  (() => {
    const pixels: HeartPixel[] =
      [];

    let id = 0;

    LOGO_MASK.forEach(
      (rowValue, row) => {
        [...rowValue].forEach(
          (value, col) => {
            if (value !== "1") {
              return;
            }

            pixels.push({
              id,
              row,
              col,
              targetColor:
                COLORS.red,
            });

            id += 1;
          },
        );
      },
    );

    return pixels;
  })();

/**
 * 60% starts already revealed.
 */
export const STARTING_SOLD =
  Math.round(
    HEART_PIXELS.length *
      0.6,
  );

/**
 * Stable pseudo-random ordering.
 *
 * Important:
 * server and client always get
 * the exact same initially sold pixels.
 */
const hashPixel = (
  id: number,
) => {
  let value =
    id + 1;

  value = Math.imul(
    value ^
      (value >>> 16),
    0x45d9f3b,
  );

  value = Math.imul(
    value ^
      (value >>> 16),
    0x45d9f3b,
  );

  value =
    value ^
    (value >>> 16);

  return value >>> 0;
};

const INITIAL_SOLD_IDS =
  new Set(
    HEART_PIXELS.map(
      (pixel) =>
        pixel.id,
    )
      .sort(
        (first, second) =>
          hashPixel(first) -
            hashPixel(
              second,
            ) ||
          first - second,
      )
      .slice(
        0,
        STARTING_SOLD,
      ),
  );

export const isInitiallySold = (
  id: number,
) =>
  INITIAL_SOLD_IDS.has(
    id,
  );

/**
 * Kept for CampaignWidget compatibility.
 *
 * Visual color now comes from the
 * original artwork underneath.
 */
export const getPixelTargetColor = (
  _pixelNumber: number,
) => COLORS.red;

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

type PixelStyle =
  CSSProperties & {
    "--pixel-column":
      number;

    "--pixel-row":
      number;
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
    useTranslations(
      "PixelHeart",
    );

  const donorNames = [
    t("donors.mina"),

    t(
      "donors.vukAndTara",
    ),

    t(
      "donors.ilicFamily",
    ),

    t("donors.luka"),

    t(
      "donors.anaAndOgnjen",
    ),

    t(
      "donors.anonymous",
    ),
  ];

  return (
    <div
      role={
        interactive
          ? "group"
          : "img"
      }
      aria-label={t(
        "ariaLabel",
      )}
      className={[
        "relative",
        "w-full",
        "max-w-[680px]",
        className,
      ].join(" ")}
      style={{
        aspectRatio: `${HEART_COLUMNS} / ${HEART_ROWS}`,
      }}
    >
      {/*
       * =================================
       * ORIGINAL LOGO
       * =================================
       *
       * One single image.
       *
       * This preserves every detail:
       * skyline, typography, instruments,
       * colors, small hearts, etc.
       */}
      <img
        src={LOGO_SRC}
        alt=""
        aria-hidden="true"
        draggable={false}
        className={[
          "pointer-events-none",

          "absolute",

          "inset-0",

          "h-full",

          "w-full",

          "object-fill",

          "select-none",
        ].join(" ")}
        style={{
          imageRendering:
            "pixelated",
        }}
      />

      {/*
       * =================================
       * PIXEL OVERLAY
       * =================================
       */}
      <div
        className={[
          "absolute",

          "inset-0",

          "grid",
        ].join(" ")}
        style={{
          gridTemplateColumns:
            `repeat(${HEART_COLUMNS}, minmax(0, 1fr))`,

          gridTemplateRows:
            `repeat(${HEART_ROWS}, minmax(0, 1fr))`,
        }}
      >
        {HEART_PIXELS.map(
          (pixel) => {
            const pixelNumber =
              pixel.id + 1;

            const purchased =
              purchasedPixels[
                pixelNumber
              ] !== undefined;

            const initiallySold =
              isInitiallySold(
                pixel.id,
              );

            const sold =
              initiallySold ||
              purchased;

            const selected =
              selectedPixel ===
              pixelNumber;

            const highlighted =
              highlightedPixel ===
              pixelNumber;

            const pixelStyle: PixelStyle =
              {
                "--pixel-column":
                  pixel.col + 1,

                "--pixel-row":
                  pixel.row + 1,

                gridColumn:
                  pixel.col + 1,

                gridRow:
                  pixel.row + 1,
              };

            /**
             * Story / preview mode.
             */
            if (!interactive) {
              return (
                <span
                  key={
                    pixel.id
                  }
                  style={
                    pixelStyle
                  }
                  aria-hidden="true"
                  className={[
                    "relative",

                    "min-h-0",
                    "min-w-0",

                    "rounded-none",

                    /**
                     * SOLD
                     *
                     * No overlay.
                     * The original logo underneath
                     * is shown at full strength.
                     */
                    sold
                      ? [
                          "bg-transparent",

                          "border",

                          "border-transparent",
                        ].join(
                          " ",
                        )

                      /**
                       * AVAILABLE
                       *
                       * Same logo remains visible,
                       * but this square receives
                       * a cream veil.
                       */
                      : [
                          "bg-[#FFF9F4]/72",

                          "border",

                          "border-white/30",
                        ].join(
                          " ",
                        ),

                    highlighted
                      ? [
                          "z-20",

                          "!bg-transparent",

                          "!border-[#102F3B]",

                          "ring-2",

                          "ring-inset",

                          "ring-[#102F3B]",
                        ].join(
                          " ",
                        )
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
                key={
                  pixel.id
                }
                type="button"
                style={
                  pixelStyle
                }
                disabled={
                  sold
                }
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
                  "relative",

                  "min-h-0",
                  "min-w-0",

                  "appearance-none",

                  "rounded-none",

                  "p-0",

                  "outline-none",

                  "transition-[background-color,border-color,box-shadow]",

                  "duration-150",

                  /**
                   * SOLD
                   *
                   * Completely transparent.
                   *
                   * User sees the exact logo
                   * underneath.
                   */
                  sold
                    ? [
                        "cursor-default",

                        "bg-transparent",

                        "border",

                        "border-transparent",
                      ].join(
                        " ",
                      )

                    /**
                     * AVAILABLE
                     *
                     * Fade only this real
                     * artwork pixel.
                     */
                    : [
                        "cursor-pointer",

                        "bg-[#FFF9F4]/72",

                        "border",

                        "border-white/30",

                        /**
                         * Preview this pixel
                         * on hover.
                         */
                        "hover:z-20",

                        "hover:bg-[#FFF9F4]/20",

                        "hover:border-[#D6384B]",

                        /**
                         * Accessible keyboard state.
                         */
                        "focus-visible:z-20",

                        "focus-visible:bg-[#FFF9F4]/20",

                        "focus-visible:outline-none",

                        "focus-visible:ring-2",

                        "focus-visible:ring-[#D6384B]",
                      ].join(
                        " ",
                      ),

                  /**
                   * Selected pixel shows
                   * its final full-strength
                   * artwork immediately.
                   */
                  selected
                    ? [
                        "z-30",

                        "!bg-transparent",

                        "!border-[#102F3B]",

                        "ring-2",

                        "ring-[#102F3B]",

                        "shadow-[0_0_0_2px_white]",
                      ].join(
                        " ",
                      )
                    : "",
                ].join(" ")}
              />
            );
          },
        )}
      </div>
    </div>
  );
}