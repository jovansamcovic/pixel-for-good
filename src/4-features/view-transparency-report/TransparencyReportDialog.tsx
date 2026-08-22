"use client";

import { Modal } from "@/src/6-shared/ui/modal/Modal";

// import { Modal } from "@/6-shared/ui/modal/Modal";

type TransparencyReportDialogProps = {
  onClose: () => void;
};

export function TransparencyReportDialog({ onClose }: TransparencyReportDialogProps) {
  return (
    <Modal
      labelledBy="report-title"
      closeLabel="Zatvori izveštaj"
      overlayClassName="report-overlay"
      dialogClassName="report-modal"
      onClose={onClose}
    >
      <p className="section-kicker">Primer transparentnog izveštaja</p>
      <h2 id="report-title">Jul 2026.</h2>
      <p className="report-intro">
        U produkcijskoj verziji svaki mesec bi imao pregled priliva, realizovanih troškova i prateće dokumentacije.
      </p>
      <div className="report-numbers">
        <div><span>Prikupljeno</span><strong>684.000 RSD</strong></div>
        <div><span>Usmereno na pomoć</span><strong>478.800 RSD</strong></div>
      </div>
      <ul>
        <li><span>Paketi direktne pomoći</span><strong>478.800 RSD</strong></li>
        <li><span>Dostava i distribucija</span><strong>136.800 RSD</strong></li>
        <li><span>Obrada uplata i kampanja</span><strong>68.400 RSD</strong></li>
      </ul>
      <p className="demo-document">Demo dokument • bez stvarnih finansijskih podataka</p>
    </Modal>
  );
}
