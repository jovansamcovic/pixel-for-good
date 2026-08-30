"use client";

import {
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";

import {
  useTranslations,
} from "next-intl";

import {
  HEART_COLUMNS,
  HEART_RENDER_ROWS,
  PixelHeart,
} from "@/src/5-entities/heart-pixel/PixelHeart";

type PixelSelectorProps = {
  selectedPixel:
    | number
    | null;

  purchasedPixels: Record<
    number,
    string
  >;

  onSelect: (
    pixelId: number,
  ) => void;

  onRandomSelect:
    () => void;
};

type Point = {
  x: number;
  y: number;
};

type GestureState = {
  distance: number;

  scale: number;

  midpoint: Point;

  pan: Point;
};

const MIN_SCALE = 1;

const MAX_SCALE = 4;

const MIN_VIEWPORT_HEIGHT =
  420;

const HEART_VERTICAL_PADDING =
  42;

const MAX_HEART_WIDTH =
  720;

const SELECTION_BLOCK_DURATION =
  300;

const clampScale = (
  value: number,
) =>
  Math.min(
    Math.max(
      value,
      MIN_SCALE,
    ),
    MAX_SCALE,
  );

const getDistance = (
  first: Point,
  second: Point,
) =>
  Math.hypot(
    second.x -
      first.x,

    second.y -
      first.y,
  );

const getMidpoint = (
  first: Point,
  second: Point,
): Point => ({
  x:
    (first.x +
      second.x) /
    2,

  y:
    (first.y +
      second.y) /
    2,
});

export function PixelSelector({
  selectedPixel,

  purchasedPixels,

  onSelect,

  onRandomSelect,
}: PixelSelectorProps) {
  const t =
    useTranslations(
      "PixelSelector",
    );

  const [
    scale,
    setScale,
  ] = useState(
    MIN_SCALE,
  );

  const [pan, setPan] =
    useState<Point>({
      x: 0,
      y: 0,
    });

  const [
    baseWidth,
    setBaseWidth,
  ] = useState(320);

  const [
    isPinching,
    setIsPinching,
  ] = useState(false);

  const viewportRef =
    useRef<HTMLDivElement | null>(
      null,
    );

  const activePointers =
    useRef(
      new Map<
        number,
        Point
      >(),
    );

  const gesture =
    useRef<GestureState | null>(
      null,
    );

  const blockSelectionUntil =
    useRef(0);

  /*
   * Measure available viewport width.
   */
  useEffect(() => {
    const viewport =
      viewportRef.current;

    if (!viewport) {
      return;
    }

    const updateWidth =
      () => {
        const horizontalPadding =
          24;

        setBaseWidth(
          Math.min(
            Math.max(
              viewport.clientWidth -
                horizontalPadding,

              290,
            ),

            MAX_HEART_WIDTH,
          ),
        );
      };

    const initialFrame =
      window.requestAnimationFrame(
        updateWidth,
      );

    const observer =
      new ResizeObserver(
        updateWidth,
      );

    observer.observe(
      viewport,
    );

    return () => {
      window.cancelAnimationFrame(
        initialFrame,
      );

      observer.disconnect();
    };
  }, []);

  const resetZoom = () => {
    setScale(
      MIN_SCALE,
    );

    setPan({
      x: 0,
      y: 0,
    });

    setIsPinching(
      false,
    );

    activePointers.current.clear();

    gesture.current =
      null;
  };

  const startGesture = () => {
    const points =
      Array.from(
        activePointers.current.values(),
      );

    if (
      points.length !== 2
    ) {
      return;
    }

    setIsPinching(
      true,
    );

    blockSelectionUntil.current =
      performance.now() +
      SELECTION_BLOCK_DURATION;

    gesture.current = {
      distance:
        getDistance(
          points[0],
          points[1],
        ),

      midpoint:
        getMidpoint(
          points[0],
          points[1],
        ),

      scale,

      pan,
    };
  };

  const handlePointerDown = (
    event: ReactPointerEvent<HTMLDivElement>,
  ) => {
    if (
      event.pointerType !==
      "touch"
    ) {
      return;
    }

    event.currentTarget.setPointerCapture(
      event.pointerId,
    );

    activePointers.current.set(
      event.pointerId,
      {
        x: event.clientX,
        y: event.clientY,
      },
    );

    if (
      activePointers.current
        .size === 2
    ) {
      startGesture();
    }
  };

  const handlePointerMove = (
    event: ReactPointerEvent<HTMLDivElement>,
  ) => {
    if (
      event.pointerType !==
        "touch" ||
      !activePointers.current.has(
        event.pointerId,
      )
    ) {
      return;
    }

    activePointers.current.set(
      event.pointerId,
      {
        x: event.clientX,
        y: event.clientY,
      },
    );

    const points =
      Array.from(
        activePointers.current.values(),
      );

    if (
      points.length !== 2 ||
      !gesture.current
    ) {
      return;
    }

    event.preventDefault();

    blockSelectionUntil.current =
      performance.now() +
      SELECTION_BLOCK_DURATION;

    const currentDistance =
      getDistance(
        points[0],
        points[1],
      );

    const currentMidpoint =
      getMidpoint(
        points[0],
        points[1],
      );

    const nextScale =
      clampScale(
        gesture.current
          .scale *
          (currentDistance /
            gesture.current
              .distance),
      );

    setScale(
      nextScale,
    );

    setPan({
      x:
        gesture.current
          .pan.x +
        currentMidpoint.x -
        gesture.current
          .midpoint.x,

      y:
        gesture.current
          .pan.y +
        currentMidpoint.y -
        gesture.current
          .midpoint.y,
    });
  };

  const handlePointerEnd = (
    event: ReactPointerEvent<HTMLDivElement>,
  ) => {
    activePointers.current.delete(
      event.pointerId,
    );

    if (
      event.currentTarget.hasPointerCapture(
        event.pointerId,
      )
    ) {
      event.currentTarget.releasePointerCapture(
        event.pointerId,
      );
    }

    if (
      activePointers.current
        .size < 2 &&
      gesture.current
    ) {
      gesture.current =
        null;

      setIsPinching(
        false,
      );

      blockSelectionUntil.current =
        performance.now() +
        SELECTION_BLOCK_DURATION;
    }
  };

  const handlePixelSelect = (
    pixelId: number,
  ) => {
    const selectionBlocked =
      isPinching ||
      performance.now() <
        blockSelectionUntil.current;

    if (selectionBlocked) {
      return;
    }

    onSelect(
      pixelId,
    );
  };

  const renderedWidth =
    baseWidth *
    scale;

  const heartHeight =
    baseWidth *
    (HEART_RENDER_ROWS /
      HEART_COLUMNS);

  const viewportHeight =
    Math.max(
      heartHeight +
        HEART_VERTICAL_PADDING *
          2,

      MIN_VIEWPORT_HEIGHT,
    );

  return (
    <div className="flex w-full flex-col items-center">
      <div
        ref={
          viewportRef
        }
        onPointerDown={
          handlePointerDown
        }
        onPointerMove={
          handlePointerMove
        }
        onPointerUp={
          handlePointerEnd
        }
        onPointerCancel={
          handlePointerEnd
        }
        className={[
          "relative flex w-full",

          "items-center justify-center",

          "overflow-hidden",

          "touch-none",

          "rounded-[28px]",

          /*
           * Much calmer background so
           * the artwork becomes the focus.
           */
          "bg-[#FFF9F4]",

          /*
           * Tiny square background pattern
           * reinforces the pixel idea.
           */
          "bg-[linear-gradient(rgba(16,47,59,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(16,47,59,0.025)_1px,transparent_1px)]",

          "bg-[size:16px_16px]",
        ].join(" ")}
        style={{
          height: `${viewportHeight}px`,
        }}
      >
        {/*
         * Very subtle glow behind heart.
         */}
        <div
          aria-hidden="true"
          className={[
            "pointer-events-none",

            "absolute",

            "inset-x-[14%]",

            "bottom-[12%]",

            "h-16",

            "rounded-full",

            "bg-[#D6384B]/10",

            "blur-3xl",
          ].join(" ")}
        />

        <div
          className={[
            "relative flex shrink-0",

            "items-center justify-center",

            isPinching
              ? "transition-none"
              : [
                  "transition-transform",

                  "duration-150",
                ].join(
                  " ",
                ),
          ].join(" ")}
          style={{
            width: `${renderedWidth}px`,

            transform: `translate3d(
              ${pan.x}px,
              ${pan.y}px,
              0
            )`,

            willChange:
              "transform, width",
          }}
        >
          <PixelHeart
            interactive
            selectedPixel={
              selectedPixel
            }
            purchasedPixels={
              purchasedPixels
            }
            onSelect={
              handlePixelSelect
            }
            className={[
              "!max-w-none",

              "drop-shadow-[0_20px_34px_rgba(16,47,59,0.12)]",
            ].join(" ")}
          />
        </div>

        {scale >
          MIN_SCALE && (
          <button
            type="button"
            onClick={
              resetZoom
            }
            className={[
              "absolute",

              "right-4",
              "top-4",

              "rounded-full",

              "border",

              "border-[#0D2734]/10",

              "bg-white/95",

              "px-3",
              "py-2",

              "text-xs",

              "font-extrabold",

              "text-[#0D2734]",

              "shadow-sm",

              "backdrop-blur",
            ].join(" ")}
          >
            {Math.round(
              scale * 100,
            )}
            % ·{" "}
            {t(
              "controls.reset",
            )}
          </button>
        )}

        <div className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center">
          <span
            className={[
              "rounded-full",

              "border",

              "border-[#0D2734]/5",

              "bg-white/95",

              "px-3",

              "py-1.5",

              "text-[11px]",

              "font-bold",

              "text-[#6D7475]",

              "shadow-sm",

              "backdrop-blur",

              "md:hidden",
            ].join(" ")}
          >
            {t(
              "pinchHint",
            )}
          </span>
        </div>
      </div>

      <div className="mt-7 flex w-full max-w-sm flex-col items-center gap-1.5">
        <button
          type="button"
          onClick={
            onRandomSelect
          }
          className={[
            "inline-flex",

            "min-h-12",

            "w-full",

            "items-center",

            "justify-center",

            "gap-2",

            "rounded-full",

            "border",

            "border-[#0D2734]/15",

            "bg-white",

            "px-5",

            "text-sm",

            "font-extrabold",

            "text-[#0D2734]",

            "shadow-[0_8px_24px_rgba(13,39,52,0.06)]",

            "transition",

            "hover:-translate-y-0.5",

            "hover:border-[#D6384B]/35",

            "hover:text-[#D6384B]",

            "focus-visible:outline-none",

            "focus-visible:ring-2",

            "focus-visible:ring-[#F5A33B]",
          ].join(" ")}
        >
          <span
            aria-hidden="true"
          >
            ✨
          </span>

          {t(
            "randomSelect",
          )}
        </button>

        <p className="text-center text-xs leading-5 text-[#6D7475]">
          <span
            aria-hidden="true"
            className="mr-1 text-[#D6384B]"
          >
            ↗
          </span>

          {t("hint")}
        </p>
      </div>
    </div>
  );
}