const highlights = [
  {
    title: "Hvorfor dette prosjektet?",
    body: "Ryen Helsehus skal være et løft for hele bydelen. Vi bygger et varmt og inkluderende sted for omsorg, aktivitet og fellesskap, tett på byen og naturen.",
  },
  {
    title: "Hva kommer nå?",
    body: "Parallelt med byggearbeidet planlegger vi innholdet sammen med naboer, fagmiljø og frivillige. Vi samler idéer til møteplasser, hverdagskultur og helsetilbud som skaper verdi fra dag én.",
  },
  {
    title: "Hva kan du bidra med?",
    body: "Har du erfaring fra frivillighet, helse, kultur eller bare et ønske om å bidra? Vi vil høre fra deg. Deltakelse i verksteder, innspill til aktiviteter og partnerskap er åpent for alle.",
  },
  {
    title: "Når skjer det?",
    body: "Vi starter med idéverksteder denne våren, pilotaktiviteter gjennom sommeren og åpne nabokvelder til høsten. Planen oppdateres fortløpende.",
  },
];

export default function CommunityPage() {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.06),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(14,165,233,0.08),transparent_30%)]" />

      <div className="relative mx-auto max-w-6xl px-6 pb-20 pt-24 sm:px-10 sm:pt-28">
        <div className="mb-12 space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-300/80">
            Medvirkning
          </p>
          <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
            Bli med og forme Ryen Helsehus
          </h1>
          <p className="max-w-3xl text-lg text-slate-100/90 sm:text-xl">
            Del dine idéer, meld deg som bidragsyter eller følg fremdriften. Sammen lager vi et helsehus
            som kjennes relevant fra første dag.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {highlights.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-sky-900/30 backdrop-blur"
            >
              <h2 className="mb-3 text-2xl font-semibold text-white">{item.title}</h2>
              <p className="text-base text-slate-100/85">{item.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-sky-500/30 via-sky-400/10 to-transparent p-6 backdrop-blur">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-50/80">
              Meld interesse
            </p>
            <h3 className="mt-2 text-2xl font-semibold">Hold deg oppdatert</h3>
            <p className="mt-3 text-slate-100/80">
              Registrer deg for nyheter om verksteder, nabomøter og pilotaktiviteter utover året.
            </p>
            <button className="mt-4 w-full rounded-xl bg-white/90 px-4 py-2 text-center font-semibold text-slate-900 shadow-lg shadow-sky-900/20 transition hover:bg-white">
              Jeg vil bli kontaktet
            </button>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur lg:col-span-2">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-50/80">
              Neste steg
            </p>
            <ul className="mt-3 space-y-3 text-slate-100/85">
              <li>• Idéverksted med nabolaget – april</li>
              <li>• Samarbeid med frivillige og lag – løpende</li>
              <li>• Pilotaktiviteter i nærområdet – sommer</li>
              <li>• Åpne informasjonskvelder – høst</li>
            </ul>
            <p className="mt-4 text-slate-100/80">
              Vi deler løpende status, planer og muligheter for å bidra. Send oss dine tanker – små som
              store – og bli med på reisen.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
