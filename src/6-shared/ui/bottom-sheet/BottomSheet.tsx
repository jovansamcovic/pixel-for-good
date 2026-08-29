"use client";

import {
  type MouseEvent,
  type ReactNode,
  useEffect,
  useRef,
} from "react";

type BottomSheetProps = {
  children: ReactNode;
  onClose: () => void;

  labelledBy?: string;
  describedBy?: string;
  closeLabel?: string;

  overlayClassName?: string;
  sheetClassName?: string;
  closeButtonClassName?: string;

  showCloseButton?: boolean;
  showHandle?: boolean;

  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
};

export function BottomSheet({
  children,
  onClose,

  labelledBy,
  describedBy,
  closeLabel = "Close",

  overlayClassName = "",
  sheetClassName = "",
  closeButtonClassName = "",

  showCloseButton = true,
  showHandle = true,

  closeOnBackdropClick = true,
  closeOnEscape = true,
}: BottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!closeOnEscape) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeOnEscape, onClose]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    sheetRef.current?.focus();
  }, []);

  const handleBackdropClick = (
    event: MouseEvent<HTMLDivElement>,
  ) => {
    if (!closeOnBackdropClick) {
      return;
    }

    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className={[
        "fixed inset-0 z-[100]",
        "flex items-end justify-center",
        "bg-[#0D2734]/75",
        "backdrop-blur-sm",
        overlayClassName,
      ].join(" ")}
      onMouseDown={handleBackdropClick}
    >
      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        aria-describedby={describedBy}
        tabIndex={-1}
        className={[
          "relative",
          "w-full",
          "max-h-[92dvh]",
          "overflow-y-auto",
          "overscroll-contain",
          "rounded-t-[32px]",
          "bg-[#FFF6EB]",
          "shadow-[0_-20px_60px_rgba(13,39,52,0.22)]",
          "outline-none",
          sheetClassName,
        ].join(" ")}
        onMouseDown={(event) => {
          event.stopPropagation();
        }}
      >
        {showHandle && (
          <div
            aria-hidden="true"
            className="sticky top-0 z-40 flex justify-center bg-[#FFF6EB] pb-2 pt-3"
          >
            <span className="h-1.5 w-12 rounded-full bg-[#0D2734]/15" />
          </div>
        )}

        {showCloseButton && (
          <button
            type="button"
            aria-label={closeLabel}
            onClick={onClose}
            className={[
              "absolute right-4 top-4 z-50",
              "flex h-11 w-11 items-center justify-center",
              "rounded-full",
              "border border-[#0D2734]/10",
              "bg-white",
              "text-xl text-[#0D2734]",
              "shadow-sm",
              "transition",
              "hover:bg-[#D6384B]",
              "hover:text-white",
              "focus-visible:outline-none",
              "focus-visible:ring-2",
              "focus-visible:ring-[#D6384B]",
              "focus-visible:ring-offset-2",
              closeButtonClassName,
            ].join(" ")}
          >
            <span aria-hidden="true">×</span>
          </button>
        )}

        {children}
      </div>
    </div>
  );
}