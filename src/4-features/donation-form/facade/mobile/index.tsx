"use client";

import type { ReactNode } from "react";

import { BottomSheet } from "@/src/6-shared/ui/bottom-sheet/BottomSheet";

export type DonationDialogProps = {
  children: ReactNode;
  onClose: () => void;
};

export function MobileDonationDialog({
  children,
  onClose,
}: DonationDialogProps) {
  return (
    <BottomSheet
      onClose={onClose}
      labelledBy="donation-dialog-title"
      closeLabel="Close"
      showHandle
      showCloseButton
      sheetClassName="bg-white"
    >
      <div className="px-5 pb-[max(24px,env(safe-area-inset-bottom))]">
        {children}
      </div>
    </BottomSheet>
  );
}