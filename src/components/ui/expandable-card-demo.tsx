"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useOutsideClick } from "@/hooks/use-outside-click";

// Interactive SVG Component
function InteractiveSVG({
  src,
  onElementClick,
}: {
  src: string;
  onElementClick: (event: MouseEvent, element: SVGElement) => void;
}) {
  const svgRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string>("");

  useEffect(() => {
    fetch(src)
      .then((res) => res.text())
      .then((text) => {
        // Parse SVG and add click handlers to .cls-14 elements
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(text, "image/svg+xml");
        const svgElement = svgDoc.querySelector("svg");

        if (svgElement) {
          // Ensure SVG has proper attributes for display
          if (!svgElement.hasAttribute("preserveAspectRatio")) {
            svgElement.setAttribute("preserveAspectRatio", "xMidYMid meet");
          }
          // Keep viewBox but set height to 100% via style for responsive sizing
          const currentStyle = svgElement.getAttribute("style") || "";
          svgElement.setAttribute(
            "style",
            `${currentStyle} height: 100%; width: auto; display: block;`.trim()
          );

          // Find all elements with class cls-14 and add styling
          const clickableElements = svgElement.querySelectorAll(".cls-14");

          clickableElements.forEach((element) => {
            // Add cursor pointer style
            const currentStyle = element.getAttribute("style") || "";
            element.setAttribute(
              "style",
              `${currentStyle} cursor: pointer;`.trim()
            );
          });

          // Get the modified SVG as string
          const serializer = new XMLSerializer();
          setSvgContent(serializer.serializeToString(svgElement));
        }
      })
      .catch((err) => console.error("Error loading SVG:", err));
  }, [src]);

  // Attach event listeners after SVG is rendered in DOM
  useEffect(() => {
    if (!svgRef.current || !svgContent) return;

    const svgElement = svgRef.current.querySelector("svg");
    if (!svgElement) return;

    const clickableElements = svgElement.querySelectorAll(".cls-14");

    const handleMouseEnter = (e: Event) => {
      const element = e.target as SVGElement;
      const hoverStyle = element.getAttribute("style") || "";
      element.setAttribute(
        "style",
        `${hoverStyle.replace(
          /opacity:\s*[^;]+;?/g,
          ""
        )} cursor: pointer; opacity: 0.8;`.trim()
      );
    };

    const handleMouseLeave = (e: Event) => {
      const element = e.target as SVGElement;
      const leaveStyle = element.getAttribute("style") || "";
      element.setAttribute(
        "style",
        `${leaveStyle.replace(
          /opacity:\s*[^;]+;?/g,
          ""
        )} cursor: pointer; opacity: 1;`.trim()
      );
    };

    const handleClick = (e: Event) => {
      const mouseEvent = e as MouseEvent;
      mouseEvent.stopPropagation();
      mouseEvent.preventDefault();
      const element = e.target as SVGElement;
      console.log("Clicked .cls-14 element:", element); // Debug log
      onElementClick(mouseEvent, element);
    };

    clickableElements.forEach((element) => {
      element.addEventListener("mouseenter", handleMouseEnter);
      element.addEventListener("mouseleave", handleMouseLeave);
      element.addEventListener("click", handleClick);
    });

    return () => {
      clickableElements.forEach((element) => {
        element.removeEventListener("mouseenter", handleMouseEnter);
        element.removeEventListener("mouseleave", handleMouseLeave);
        element.removeEventListener("click", handleClick);
      });
    };
  }, [svgContent, onElementClick]);

  if (!svgContent) {
    return (
      <div className="h-full w-auto flex items-center justify-center text-neutral-400">
        Loading...
      </div>
    );
  }

  return (
    <div
      ref={svgRef}
      className="h-full w-auto flex items-center justify-center [&>svg]:h-full [&>svg]:w-auto [&>svg]:max-w-full"
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
}

export function ExpandableCardDemo() {
  const [active, setActive] = useState<(typeof cards)[number] | boolean | null>(
    null
  );
  const [clickedElement, setClickedElement] = useState<{
    element: SVGElement;
    position: { x: number; y: number };
  } | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const svgContainerRef = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActive(false);
      }
    }

    if (active && typeof active === "object") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref, () => setActive(null));

  const handleSVGElementClick = (event: MouseEvent, element: SVGElement) => {
    console.log("handleSVGElementClick called", {
      event,
      element,
      svgContainerRef: svgContainerRef.current,
    }); // Debug log
    if (svgContainerRef.current) {
      const containerRect = svgContainerRef.current.getBoundingClientRect();
      const position = {
        x: event.clientX - containerRect.left,
        y: event.clientY - containerRect.top,
      };
      console.log("Setting clicked element with position:", position); // Debug log
      setClickedElement({
        element,
        position,
      });
    } else {
      console.warn("svgContainerRef.current is null");
    }
  };

  // Close textbox when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        clickedElement &&
        svgContainerRef.current &&
        !svgContainerRef.current.contains(e.target as Node)
      ) {
        setClickedElement(null);
      }
    };

    if (clickedElement) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [clickedElement]);

  return (
    <div className="flex h-screen bg-white dark:bg-neutral-950 overflow-hidden">
      {/* Left Sidebar - Cards List */}
      <div className="w-80 border-r border-neutral-200 dark:border-neutral-800 overflow-y-auto dark:bg-neutral-900">
        <ul className="w-full gap-2 p-4">
          {cards.map((card) => {
            const isActive =
              active &&
              typeof active === "object" &&
              active.title === card.title;
            return (
              <motion.div
                layoutId={`card-${card.title}-${id}`}
                key={`card-${card.title}-${id}`}
                onClick={() => setActive(card)}
                className={`p-4 flex flex-col md:flex-row justify-between items-center rounded-xl cursor-pointer mb-2 transition-colors ${
                  isActive
                    ? "bg-green-50 dark:bg-green-900/20 border-2 border-green-500"
                    : "hover:bg-neutral-50 dark:hover:bg-neutral-800"
                }`}
              >
                <div className="flex gap-4 flex-col md:flex-row w-full">
                  <motion.div layoutId={`image-${card.title}-${id}`}>
                    <img
                      width={100}
                      height={100}
                      src={card.thumbnail || card.src}
                      alt={card.title}
                      className="h-40 w-40 md:h-14 md:w-14 rounded-lg object-cover object-top"
                      loading="lazy"
                      decoding="async"
                    />
                  </motion.div>
                  <div className="flex-1">
                    <motion.h3
                      layoutId={`title-${card.title}-${id}`}
                      className="font-medium text-neutral-800 dark:text-neutral-200 text-center md:text-left text-sm"
                    >
                      {card.title}
                    </motion.h3>
                    <motion.p
                      layoutId={`description-${card.description}-${id}`}
                      className="text-neutral-600 dark:text-neutral-400 text-center md:text-left text-xs"
                    >
                      {card.description}
                    </motion.p>
                  </div>
                </div>
                <motion.button
                  layoutId={`button-${card.title}-${id}`}
                  className={`px-4 py-2 text-sm rounded-full font-bold mt-4 md:mt-0 transition-colors ${
                    isActive
                      ? "bg-green-500 text-white"
                      : "bg-gray-100 hover:bg-green-500 hover:text-white text-black dark:bg-gray-700 dark:text-white"
                  }`}
                >
                  {card.ctaText}
                </motion.button>
              </motion.div>
            );
          })}
        </ul>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto dark:bg-neutral-950">
        <div className="h-full flex items-center justify-center p-8">
          <p className="text-neutral-400 dark:text-neutral-600">
            Click a card from the left to view details
          </p>
        </div>
      </div>

      {/* Expanded Card Modal - Centered Overlay */}
      <AnimatePresence>
        {active && typeof active === "object" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 h-full w-full z-10"
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {active && typeof active === "object" ? (
          <div className="fixed inset-0 grid place-items-end z-[100]">
            <motion.button
              key={`button-${active.title}-${id}`}
              layout
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
                transition: {
                  duration: 0.05,
                },
              }}
              className="flex absolute top-2 right-2 lg:hidden items-center justify-center  rounded-full h-6 w-6"
              onClick={() => setActive(null)}
            >
              <CloseIcon />
            </motion.button>
            <motion.div
              layoutId={`card-${active.title}-${id}`}
              ref={ref}
              className="w-full max-w-[80%] h-screen flex flex-row bg-white dark:bg-neutral-900 sm:rounded-3xl overflow-hidden"
            >
              <motion.div
                layoutId={`image-${active.title}-${id}`}
                className="flex h-full relative"
                ref={svgContainerRef}
              >
                {active.src.endsWith(".svg") ? (
                  <InteractiveSVG
                    src={active.src}
                    onElementClick={handleSVGElementClick}
                  />
                ) : (
                  <img
                    width={320}
                    height={640}
                    src={active.src}
                    alt={active.title}
                    className="h-full w-auto object-contain"
                    loading="lazy"
                    decoding="async"
                  />
                )}

                {/* Textbox overlay for clicked element */}
                <AnimatePresence>
                  {clickedElement && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8, y: 10 }}
                      className="absolute bg-white dark:bg-neutral-800 border-2 border-green-500 rounded-lg shadow-xl p-4 max-w-xs z-50 pointer-events-auto"
                      style={{
                        left: `${clickedElement.position.x}px`,
                        top: `${clickedElement.position.y}px`,
                        transform: "translate(-50%, calc(-100% - 10px))",
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => setClickedElement(null)}
                        className="absolute top-2 right-2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 text-xl leading-none w-5 h-5 flex items-center justify-center"
                      >
                        ×
                      </button>
                      <h4 className="font-bold text-neutral-700 dark:text-neutral-200 mb-2 pr-6">
                        Element Info
                      </h4>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        You clicked on a .cls-14 element. Add your custom
                        content here!
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              <div className="flex-1 flex flex-col p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <motion.h3
                      layoutId={`title-${active.title}-${id}`}
                      className="font-bold text-neutral-700 dark:text-neutral-200 text-2xl mb-2"
                    >
                      {active.title}
                    </motion.h3>
                    <motion.p
                      layoutId={`description-${active.description}-${id}`}
                      className="text-neutral-600 dark:text-neutral-400 text-lg"
                    >
                      {active.description}
                    </motion.p>
                  </div>

                  <motion.a
                    layoutId={`button-${active.title}-${id}`}
                    href={active.ctaLink}
                    target="_blank"
                    className="px-4 py-3 text-sm rounded-full font-bold bg-green-500 text-white hover:bg-green-600 transition-colors"
                  >
                    {active.ctaText}
                  </motion.a>
                </div>
                <motion.div
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-neutral-600 text-sm md:text-base flex-1 overflow-y-auto dark:text-neutral-400 pr-4"
                >
                  {typeof active.content === "function"
                    ? active.content()
                    : active.content}
                </motion.div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export const CloseIcon = () => {
  return (
    <motion.svg
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
        transition: {
          duration: 0.05,
        },
      }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-black"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </motion.svg>
  );
};

const cards = [
  {
    description: "Plan 01 - Kantine og handel",
    title: "Plan 01",
    src: "/plan_01.svg",
    thumbnail: "/plan_01.svg", // Smaller thumbnail for sidebar
    ctaText: "Se mer",
    ctaLink: "#",
    content: () => {
      return (
        <div>
          <p className="mb-4">
            Plan 01 viser første etasje med kantineområdet og handelsområder.
            Her finner du kantine på 270 m², matesenter for samhandling, og
            handelsområder med skosalg.
          </p>
          <p className="mb-4">
            Hovedinngangen og resepsjonen på 50 m² gir velkommen til besøkende,
            mens kaféen på 120 m² tilbyr et hyggelig møtested.
          </p>
          <p>
            Dette er etasjen som binder sammen byggets ulike funksjoner og
            skaper et levende og inkluderende miljø.
          </p>
        </div>
      );
    },
  },
  {
    description: "Plan 02 - Verksted og kontor",
    title: "Plan 02",
    src: "/plan-02.svg",
    thumbnail: "/plan-02-thumb.svg", // Smaller thumbnail for sidebar
    ctaText: "Se mer",
    ctaLink: "#",
    content: () => {
      return (
        <div>
          <p className="mb-4">
            Plan 02 fokuserer på verksteds- og kontorområder. Verkstedet på 150
            m² har plass til 16 teknikere med arbeidsplasser, mens sliperommet
            på 30 m² huser store hjelpemidler.
          </p>
          <p className="mb-4">
            Åpne landskap med 22 og 10 plasser gir fleksible arbeidsmiljøer, og
            stillerom gir mulighet for konsentrert arbeid. 10 prøverom og
            ventesone for pasienter på ca. 40 m² sikrer gode pasientforløp.
          </p>
          <p>
            Sosial sone på 60 m² og kontor med sentralbord skaper gode
            arbeidsforhold for ansatte.
          </p>
        </div>
      );
    },
  },
  {
    description: "Plan 03 - Produksjon og behandling",
    title: "Plan 03",
    src: "/plan-03.svg",
    thumbnail: "/plan-03-thumb.svg", // Smaller thumbnail for sidebar
    ctaText: "Se mer",
    ctaLink: "#",
    content: () => {
      return (
        <div>
          <p className="mb-4">
            Plan 03 inneholder produksjonsrommet på 150 m² med plastrom, samt
            sliperom for store hjelpemidler. Kontorområdet har 6 lederkontorer
            og åpne landskap med 10 plasser på 60 m².
          </p>
          <p className="mb-4">
            Behandlingsområdet inkluderer legerom på 15 m², fysiorom på 30 og 40
            m², samt 10 prøverom. Ventesone for pasienter på ca. 40 m² gir en
            rolig mottak.
          </p>
          <p>
            Atriet utendørs skaper et naturlig møtepunkt og gir lys og luft til
            bygget.
          </p>
        </div>
      );
    },
  },
];
