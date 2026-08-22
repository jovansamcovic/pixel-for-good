"use client";

import {
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";

import { PixelHeart } from "@/src/5-entities/heart-pixel/PixelHeart";

type PixelSelectorProps = {
  selectedPixel: number | null;
  purchasedPixels: Record<number, string>;
  onSelect: (pixelId: number) => void;
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
const MAX_SCALE = 3;
const SCALE_STEP = 0.25;

const clampScale = (value: number) =>
  Math.min(Math.max(value, MIN_SCALE), MAX_SCALE);

const getDistance = (first: Point, second: Point) =>
  Math.hypot(second.x - first.x, second.y - first.y);

const getMidpoint = (first: Point, second: Point): Point => ({
  x: (first.x + second.x) / 2,
  y: (first.y + second.y) / 2,
});

export function PixelSelector({
  selectedPixel,
  purchasedPixels,
  onSelect,
}: PixelSelectorProps) {
  const [scale, setScale] = useState(MIN_SCALE);
  const [pan, setPan] = useState<Point>({ x: 0, y: 0 });
  const [baseWidth, setBaseWidth] = useState(320);

  const viewportRef = useRef<HTMLDivElement | null>(null);
  const activePointers = useRef(new Map<number, Point>());
  const gesture = useRef<GestureState | null>(null);

  useEffect(() => {
    const viewport = viewportRef.current;

    if (!viewport) {
      return;
    }

    const updateWidth = () => {
      setBaseWidth(Math.min(Math.max(viewport.clientWidth - 24, 280), 560));
    };

    updateWidth();

    const observer = new ResizeObserver(updateWidth);
    observer.observe(viewport);

    return () => observer.disconnect();
  }, []);

  const updateScale = (nextScale: number) => {
    const normalizedScale = clampScale(nextScale);

    setScale(normalizedScale);

    if (normalizedScale === MIN_SCALE) {
      setPan({ x: 0, y: 0 });
    }
  };

  const resetZoom = () => {
    setScale(MIN_SCALE);
    setPan({ x: 0, y: 0 });

    activePointers.current.clear();
    gesture.current = null;
  };

  const startGesture = () => {
    const points = Array.from(activePointers.current.values());

    if (points.length !== 2) {
      return;
    }

    gesture.current = {
      distance: getDistance(points[0], points[1]),
      midpoint: getMidpoint(points[0], points[1]),
      scale,
      pan,
    };
  };

  const handlePointerDown = (
    event: ReactPointerEvent<HTMLDivElement>,
  ) => {
    if (event.pointerType !== "touch") {
      return;
    }

    event.currentTarget.setPointerCapture(event.pointerId);

    activePointers.current.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY,
    });

    if (activePointers.current.size === 2) {
      startGesture();
    }
  };

  const handlePointerMove = (
    event: ReactPointerEvent<HTMLDivElement>,
  ) => {
    if (
      event.pointerType !== "touch" ||
      !activePointers.current.has(event.pointerId)
    ) {
      return;
    }

    activePointers.current.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY,
    });

    const points = Array.from(activePointers.current.values());

    if (points.length !== 2 || !gesture.current) {
      return;
    }

    event.preventDefault();

    const currentDistance = getDistance(points[0], points[1]);
    const currentMidpoint = getMidpoint(points[0], points[1]);

    const nextScale = clampScale(
      gesture.current.scale *
        (currentDistance / gesture.current.distance),
    );

    setScale(nextScale);

    setPan({
      x: Math.round(
        gesture.current.pan.x +
          currentMidpoint.x -
          gesture.current.midpoint.x,
      ),
      y: Math.round(
        gesture.current.pan.y +
          currentMidpoint.y -
          gesture.current.midpoint.y,
      ),
    });
  };

  const handlePointerEnd = (
    event: ReactPointerEvent<HTMLDivElement>,
  ) => {
    activePointers.current.delete(event.pointerId);

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    if (activePointers.current.size < 2) {
      gesture.current = null;
    }
  };

  const renderedWidth = baseWidth * scale;

  return (
    <div className="relative flex min-h-[430px] w-full flex-1 flex-col items-center sm:min-h-[540px]">
      <div className="absolute right-0 top-0 z-30 hidden items-center gap-1 rounded-xl border border-[#0D2734]/10 bg-white p-1 shadow-sm md:flex">
        <button
          type="button"
          onClick={() => updateScale(scale - SCALE_STEP)}
          disabled={scale <= MIN_SCALE}
          aria-label="Umanji prikaz srca"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-[#0D2734] transition hover:bg-[#FFF6EB] disabled:cursor-not-allowed disabled:opacity-30"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m16 16 4 4M8 11h6" />
          </svg>
        </button>

        <button
          type="button"
          onClick={resetZoom}
          aria-label="Vrati originalnu veličinu"
          className="min-w-14 rounded-lg px-2 py-2 text-xs font-bold text-[#0D2734] transition hover:bg-[#FFF6EB]"
        >
          {Math.round(scale * 100)}%
        </button>

        <button
          type="button"
          onClick={() => updateScale(scale + SCALE_STEP)}
          disabled={scale >= MAX_SCALE}
          aria-label="Uvećaj prikaz srca"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-[#0D2734] transition hover:bg-[#FFF6EB] disabled:cursor-not-allowed disabled:opacity-30"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m16 16 4 4M8 11h6M11 8v6" />
          </svg>
        </button>
      </div>

      <div
        ref={viewportRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
        className="relative flex w-full flex-1 touch-none items-center justify-center overflow-hidden px-3 py-12"
      >
        <div
          className="flex shrink-0 items-center justify-center"
          style={{
            width: `${renderedWidth}px`,
            transform: `translate3d(${Math.round(pan.x)}px, ${Math.round(
              pan.y,
            )}px, 0)`,
          }}
        >
          <PixelHeart
            interactive
            selectedPixel={selectedPixel}
            purchasedPixels={purchasedPixels}
            onSelect={onSelect}
            className="!max-w-none"
          />
        </div>
      </div>

      <div className="mt-3 flex flex-col items-center gap-1.5 text-center text-xs text-[#6D7475]">
        <p>
          <span className="mr-1 text-[#D6384B]" aria-hidden="true">
            ↗
          </span>
          Klikni na svetli kvadratić da ga izabereš
        </p>

        <p className="md:hidden">
          Raširi dva prsta preko srca da ga uvećaš
        </p>

        {scale > MIN_SCALE && (
          <button
            type="button"
            onClick={resetZoom}
            className="mt-1 font-bold text-[#D6384B] underline-offset-4 hover:underline md:hidden"
          >
            Vrati originalnu veličinu
          </button>
        )}
      </div>

      <span className="sr-only" aria-live="polite">
        Uvećanje prikaza je {Math.round(scale * 100)} procenata.
      </span>
    </div>
  );
}