"use client";

import { PIXEL_PALETTE, PIXEL_PRICE } from "@/src/5-entities/heart-pixel/PixelHeart";
import { type FormEvent, type RefObject, useState } from "react";



export type DonationDraft = {
  color: string;
  name: string;
  message: string;
};

type DonationFormProps = {
  selectedPixel: number | null;
  successPixel: number | null;
  containerRef: RefObject<HTMLElement | null>;
  onPurchase: (draft: DonationDraft) => void;
  onReset: () => void;
  onShareStory: () => void;
};

const formatRsd = (value: number) => `${new Intl.NumberFormat("sr-RS").format(value)} RSD`;

export function DonationForm({
  selectedPixel,
  successPixel,
  containerRef,
  onPurchase,
  onReset,
  onShareStory,
}: DonationFormProps) {
  const [donorName, setDonorName] = useState("");
  const [message, setMessage] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [selectedColor, setSelectedColor] = useState(PIXEL_PALETTE[0]);

  const submitDonation = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (selectedPixel === null) return;

    onPurchase({
      color: selectedColor,
      name: anonymous ? "Anonimni donator" : donorName.trim() || "Donator dobrote",
      message: message.trim() || "Jedan piksel. Jedno dobro delo.",
    });
  };

  const resetDonation = () => {
    setDonorName("");
    setMessage("");
    setAnonymous(false);
    setSelectedColor(PIXEL_PALETTE[0]);
    onReset();
  };

  return (
    <aside className="donation-card" ref={containerRef} aria-live="polite">
      {successPixel !== null ? (
        <div className="success-state">
          <span className="success-mark" aria-hidden="true">♥</span>
          <p className="section-kicker">Hvala!</p>
          <h3>Tvoj piksel sada kuca sa svima.</h3>
          <p>
            Piksel <strong>#{successPixel}</strong> je dodat zajedničkom srcu. U pravoj verziji ovde bi usledila
            potvrda uplate i digitalna zahvalnica.
          </p>
          <div className="success-actions">
            <button type="button" className="button instagram-button button-full" onClick={onShareStory}>
              <span className="instagram-glyph" aria-hidden="true">◎</span> Podeli na Instagram
            </button>
            <button type="button" className="button button-secondary button-full" onClick={resetDonation}>
              Oboji još jedan piksel
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={submitDonation}>
          <p className="section-kicker">Tvoj trag u srcu</p>
          <div className="selection-title">
            <h3>{selectedPixel ? `Piksel #${selectedPixel}` : "Izaberi piksel na srcu"}</h3>
            <strong>{formatRsd(PIXEL_PRICE)}</strong>
          </div>
          <p className="form-intro">
            {selectedPixel
              ? "Sjajan izbor. Sada mu dodaj boju, ime i kratku poruku."
              : "Klikni na slobodan kvadratić u srcu. Zatim možeš da ga personalizuješ."}
          </p>

          <fieldset disabled={selectedPixel === null}>
            <legend>Boja piksela</legend>
            <div className="color-picker">
              {PIXEL_PALETTE.map((color, index) => (
                <button
                  key={color}
                  type="button"
                  className={selectedColor === color ? "active" : ""}
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(color)}
                  aria-label={`Izaberi boju ${index + 1}`}
                  aria-pressed={selectedColor === color}
                />
              ))}
            </div>
          </fieldset>

          <label>
            Ime na zidu zahvalnosti
            <input
              type="text"
              value={donorName}
              onChange={(event) => setDonorName(event.target.value)}
              placeholder="Tvoje ime ili inicijali"
              maxLength={32}
              required={!anonymous}
              disabled={selectedPixel === null || anonymous}
            />
          </label>

          <label>
            Poruka <span>(opciono)</span>
            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Napiši kratku poruku podrške…"
              maxLength={80}
              disabled={selectedPixel === null}
            />
            <small>{message.length}/80</small>
          </label>

          <label className="check-row">
            <input
              type="checkbox"
              checked={anonymous}
              onChange={(event) => setAnonymous(event.target.checked)}
              disabled={selectedPixel === null}
            />
            <span>Želim da donacija bude anonimna</span>
          </label>

          <button className="button button-primary button-full" type="submit" disabled={selectedPixel === null}>
            Potvrdi demo donaciju <span>→</span>
          </button>
          <p className="secure-note"><span>◈</span> Ovo je demo — nema naplate niti čuvanja podataka.</p>
        </form>
      )}
    </aside>
  );
}
