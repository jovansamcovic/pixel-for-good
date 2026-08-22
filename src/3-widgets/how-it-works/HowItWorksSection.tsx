const steps = [
  {
    number: "01",
    title: "Izaberi piksel",
    description: "Pronađi slobodno mesto na slici.",
    badgeClassName: "bg-[#FCE4E1] text-[#D6384B]",
  },
  {
    number: "02",
    title: "Dodaj svoju poruku",
    description: "Upiši ime, inicijale ili kratku poruku koja ostaje uz tvoj piksel.",
    badgeClassName: "bg-[#FDEBCB] text-[#F5A33B]",
  },
  {
    number: "03",
    title: "Potvrdi donaciju",
    description: "Nakon uplate, piksel postaje deo zajedničke slike dobrote.",
    badgeClassName: "bg-[#DDE8E1] text-[#27533D]",
  },
];

export function HowItWorksSection() {
  return (
    <section
      id="kako-radi"
      className="scroll-mt-28 bg-[#FFF6EB] px-5 py-20 sm:px-8 sm:py-24 lg:px-12"
    >
      <div className="mx-auto max-w-7xl">
        <header className="text-center">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#D6384B]">
            Kako funkcioniše
          </p>

          <h2 className="mx-auto mt-4 max-w-4xl text-3xl font-extrabold leading-tight tracking-[-0.04em] text-[#0D2734] sm:text-4xl lg:text-5xl">
            Tri mala koraka do velike promene
          </h2>
        </header>

        <ol className="mt-12 grid gap-6 md:grid-cols-3 lg:gap-8">
          {steps.map((step) => (
            <li
              key={step.number}
              className="min-h-[220px] rounded-[26px] bg-white p-7 shadow-[0_14px_35px_rgba(13,39,52,0.07)] sm:p-8"
            >
              <span
                className={[
                  "inline-flex h-12 min-w-12 items-center justify-center rounded-2xl px-3",
                  "text-lg font-extrabold",
                  step.badgeClassName,
                ].join(" ")}
                aria-hidden="true"
              >
                {step.number}
              </span>

              <h3 className="mt-6 text-lg font-extrabold tracking-[-0.02em] text-[#0D2734] sm:text-xl">
                {step.title}
              </h3>

              <p className="mt-3 max-w-sm text-sm leading-6 text-[#6D7475]">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}