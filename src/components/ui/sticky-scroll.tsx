import { useEffect, useMemo, useRef, useState } from "react";

interface StickyScrollProps {
  items: {
    title: string;
    description: string;
    image: string;
  }[];
}

function LayerStack({
  items,
  activeIndex,
}: {
  items: StickyScrollProps["items"];
  activeIndex: number;
}) {
  const layers = useMemo(
    () =>
      items.map((item, index) => {
        const isActive = index === activeIndex;
        const isPast = index < activeIndex;

        const collapsedSize = 110;
        const activeHeight = "65vh";
        const activeWidth = "min(82vw, 980px)";
        const collapsedTransform = `translate(${index * 18}px, ${
          index * 16
        }px)`;
        const activeTransform = "translate(-4px, -12px)";

        return {
          item,
          index,
          isActive,
          isPast,
          style: {
            width: isActive ? activeWidth : `${collapsedSize}px`,
            height: isActive ? activeHeight : `${collapsedSize}px`,
            transform: isActive ? activeTransform : collapsedTransform,
            zIndex: isActive ? 40 : 30 - index,
          },
        };
      }),
    [activeIndex, items]
  );

  return (
    <div className="relative h-[70vh] w-full overflow-visible rounded-3xl bg-slate-900/60 p-6 shadow-2xl shadow-black/40 ring-1 ring-white/10 backdrop-blur">
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-sky-500/20 via-slate-900/60 to-slate-950" />
      <div className="relative h-full w-full">
        {layers.map(({ item, index, isActive, isPast, style }) => (
          <div
            key={item.title}
            className={`absolute origin-top-left rounded-2xl border border-white/15 bg-white/10 p-4 text-white shadow-2xl backdrop-blur transition-all duration-700 ease-[cubic-bezier(0.33,1,0.68,1)] ${
              isActive ? "bg-white/10 ring-1 ring-white/20" : "bg-white/5"
            }`}
            style={style}
          >
            <div className="flex h-full w-full flex-col justify-between overflow-hidden">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.18em] text-white/60">
                <span>Lag {index + 1}</span>
                <span className={`${isActive ? "opacity-100" : "opacity-60"}`}>
                  {isPast ? "Fullført" : isActive ? "Aktiv" : "Klar"}
                </span>
              </div>

              {isActive ? (
                <div className="mt-4 space-y-3 text-left">
                  <h3 className="text-3xl font-semibold text-white drop-shadow-lg">
                    {item.title}
                  </h3>
                  <p className="text-base leading-relaxed text-white/80 drop-shadow">
                    {item.description}
                  </p>
                </div>
              ) : (
                <div className="flex h-full items-center justify-center text-sm font-semibold text-white/70">
                  Lag {index + 1}
                </div>
              )}

              <div
                className={`mt-4 h-1 w-14 rounded-full bg-gradient-to-r from-white/70 to-transparent transition-opacity ${
                  isActive ? "opacity-100" : "opacity-40"
                }`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function StickyScroll({ items }: StickyScrollProps) {
  const [activeIndex, setActiveIndex] = useState(-1);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-35% 0px -35% 0px",
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = sectionRefs.current.indexOf(
            entry.target as HTMLDivElement
          );
          if (index !== -1) {
            setActiveIndex(index);
          }
        }
      });
    }, observerOptions);

    sectionRefs.current.forEach((section) => {
      if (section) {
        observer.observe(section);
      }
    });

    return () => {
      sectionRefs.current.forEach((section) => {
        if (section) {
          observer.unobserve(section);
        }
      });
    };
  }, [items.length]);

  return (
    <div className="relative scroll-smooth bg-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(56,189,248,0.12),transparent_30%),radial-gradient(circle_at_85%_10%,rgba(255,255,255,0.06),transparent_28%)]" />
      <div className="relative mx-auto max-w-6xl px-6 pb-24 sm:px-10 lg:px-12">
        <div className="lg:grid lg:grid-cols-[360px_1fr] lg:items-start lg:gap-12">
          <div className="sticky top-24 hidden lg:block">
            <LayerStack items={items} activeIndex={activeIndex} />
          </div>

          <div className="space-y-20">
            <section className="min-h-screen snap-start pt-16 lg:pt-28">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/40 backdrop-blur">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-300/80">
                  Tre lag som åpner seg
                </p>
                <h1 className="mt-4 text-4xl font-extrabold leading-tight sm:text-5xl">
                  Bla nedover og se hvert lag utfolde seg
                </h1>
                <p className="mt-4 text-lg text-white/80 sm:text-xl">
                  Til venstre ser du tre kvadratiske lag stablet oppå hverandre.
                  Når du scroller ned ekspanderer først det øverste laget til
                  nesten full skjerm for å vise innholdet sitt, før det trekker
                  seg sammen og gir plass til neste. Slik visualiserer vi lagene
                  i Ryen Helsehus.
                </p>
                <p className="mt-4 text-sm text-white/60">
                  Start å scrolle for å aktivere det første laget.
                </p>
                <div className="mt-6 flex items-center gap-3 text-white/80">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-sky-500/30 text-lg font-semibold">
                    ↓
                  </span>
                  <span className="text-base">Scroll for å åpne lagene</span>
                </div>
              </div>
            </section>

            <div className="block lg:hidden">
              <LayerStack items={items} activeIndex={activeIndex} />
            </div>

            {items.map((item, index) => (
              <section
                key={`content-${index}`}
                ref={(el) => {
                  sectionRefs.current[index] = el;
                }}
                className="min-h-screen snap-start"
              >
                <div className="grid gap-10 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/40 backdrop-blur lg:grid-cols-1">
                  <div className="flex items-center gap-4 text-sm font-semibold uppercase tracking-[0.18em] text-white/70">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-lg">
                      {index + 1}
                    </span>
                    <span>Lag {index + 1}</span>
                  </div>
                  <div className="space-y-4">
                    <h2 className="text-4xl font-bold leading-tight text-white sm:text-5xl">
                      {item.title}
                    </h2>
                    <p className="text-lg leading-relaxed text-white/80 sm:text-xl">
                      {item.description}
                    </p>
                  </div>
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
