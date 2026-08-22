const steps = [
  {
    number: "01",
    title: "Izaberi piksel",
    description: (
      <>
        Pronađi slobodno mesto na slici.
        <br />
        Jedan ili više — izbor je tvoj.
      </>
    ),
    numberClassName: "bg-[#FCE4E1] text-[#D6384B]",
  },
  {
    number: "02",
    title: "Dodaj svoju poruku",
    description: (
      <>
        Upiši ime, inicijale ili kratku poruku
        <br />
        koja ostaje uz tvoj piksel.
      </>
    ),
    numberClassName: "bg-[#FDEBCB] text-[#F5A33B]",
  },
  {
    number: "03",
    title: "Potvrdi donaciju",
    description: (
      <>
        Nakon uplate, piksel postaje deo
        <br />
        zajedničke slike dobrote.
      </>
    ),
    numberClassName: "bg-[#DDE8E1] text-[#27533D]",
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
          <p className="text-xs font-extrabold uppercase tracking-[0.08em] text-[#D6384B]">
            Kako funkcioniše
          </p>

          <h2 className="mx-auto mt-4 max-w-4xl text-4xl font-extrabold leading-tight tracking-[-0.04em] text-[#0D2734] sm:text-5xl">
            Tri mala koraka do velike promene
          </h2>
        </header>

        <ol className="mt-12 grid gap-6 md:grid-cols-3 lg:gap-8">
          {steps.map((step) => (
            <li
              key={step.number}
              className="min-h-[240px] rounded-[28px] bg-white p-7 shadow-[0_14px_40px_rgba(13,39,52,0.04)] sm:p-8"
            >
              <span
                className={[
                  "inline-flex h-14 min-w-14 items-center justify-center rounded-2xl px-3",
                  "text-xl font-extrabold",
                  step.numberClassName,
                ].join(" ")}
                aria-hidden="true"
              >
                {step.number}
              </span>

              <h3 className="mt-6 text-xl font-extrabold tracking-[-0.02em] text-[#0D2734]">
                {step.title}
              </h3>

              <p className="mt-4 text-sm leading-7 text-[#6D7475]">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}