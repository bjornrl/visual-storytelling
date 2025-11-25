import { useEffect, useRef, useState } from "react";

interface ClassicStickyScrollProps {
  items: {
    title: string;
    description: string;
    image: string;
  }[];
}

export function ClassicStickyScroll({ items }: ClassicStickyScrollProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-40% 0px -40% 0px",
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = sectionRefs.current.indexOf(entry.target as HTMLDivElement);
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
    <div className="relative scroll-smooth">
      <div className="fixed inset-0 h-screen w-full overflow-hidden">
        {items.map((item, index) => (
          <div
            key={`image-${index}`}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              activeIndex === index ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
            <div className="absolute inset-0" />
          </div>
        ))}
      </div>

      <div className="relative z-20">
        <div className="mx-auto max-w-5xl px-6 sm:px-8 lg:px-12">
          {items.map((item, index) => (
            <div
              key={`content-${index}`}
              ref={(el) => {
                sectionRefs.current[index] = el;
              }}
              className="flex h-screen snap-start flex-col justify-center py-20 sm:py-32"
            >
              <div className="rounded-2xl border border-white/20 p-8 shadow-2xl backdrop-blur-md sm:p-12 lg:p-16">
                <div className="mb-6 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-2xl font-bold text-white backdrop-blur-sm">
                    {index + 1}
                  </div>
                  <div className="h-px flex-1 bg-gradient-to-r from-white/40 to-transparent" />
                </div>

                <h2 className="mb-6 text-4xl font-extrabold leading-tight text-white drop-shadow-2xl sm:text-5xl lg:text-6xl">
                  {item.title}
                </h2>

                <p className="max-w-3xl text-lg leading-relaxed text-white/95 drop-shadow-lg sm:text-xl lg:text-2xl">
                  {item.description}
                </p>

                <div className="mt-8 h-1 w-24 rounded-full bg-gradient-to-r from-white/60 to-transparent" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
