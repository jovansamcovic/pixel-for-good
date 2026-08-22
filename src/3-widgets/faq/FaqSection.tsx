const questions = [
  {
    question: "Da li kupujem pravi digitalni piksel?",
    answer:
      "Donacija rezerviše jedno konkretno mesto u srcu. Piksel dobija svoju boju, broj i opciono ime ili poruku donatora.",
  },
  {
    question: "Kako mogu da pratim utrošak sredstava?",
    answer:
      "Javni pregled prikazuje prikupljeni iznos, plan budžeta, mesečne račune i završni izveštaj partnerske organizacije.",
  },
  {
    question: "Mogu li da ostanem anoniman?",
    answer:
      "Da. Ime i poruka su opcioni, dok se iznos donacije uračunava u javni zbir bez objavljivanja ličnih podataka.",
  },
];

export function FaqSection() {
  return (
    <section
      id="faq"
      className="scroll-mt-28 bg-[#FFF6EB] px-5 py-20 sm:px-8 sm:py-24 lg:px-12"
    >
      <div className="mx-auto max-w-7xl">
        <header>
          <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#D6384B]">
            Česta pitanja
          </p>

          <h2 className="mt-4 text-4xl font-extrabold leading-tight tracking-[-0.04em] text-[#0D2734] sm:text-5xl">
            Sve što treba da znaš
          </h2>
        </header>

        <div className="mt-10 space-y-4">
          {questions.map((item, index) => (
            <details
              key={item.question}
              open={index === 0}
              className="group overflow-hidden rounded-2xl border border-transparent bg-white transition-colors open:border-[#D6384B]/10"
            >
              <summary className="flex min-h-20 cursor-pointer list-none items-center justify-between gap-6 px-5 py-5 text-left text-base font-extrabold text-[#0D2734] outline-none transition hover:text-[#D6384B] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#D6384B] sm:px-7 [&::-webkit-details-marker]:hidden">
                <span>{item.question}</span>

                <span
                  className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FFF6EB] text-xl text-[#0D2734] transition group-open:rotate-180 group-open:bg-[#D6384B] group-open:text-white"
                  aria-hidden="true"
                >
                  <span className="group-open:hidden">+</span>
                  <span className="hidden group-open:inline">−</span>
                </span>
              </summary>

              <div className="px-5 pb-6 sm:px-7 sm:pb-7">
                <div className="border-t border-[#0D2734]/10 pt-5">
                  <p className="max-w-4xl text-sm leading-7 text-[#6D7475] sm:text-base">
                    {item.answer}
                  </p>
                </div>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}