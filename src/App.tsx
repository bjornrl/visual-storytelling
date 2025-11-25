import { useState } from "react";
import StoryPage from "./components/story-page";
import CommunityPage from "./components/community-page";

type PageKey = "fortelling" | "medvirkning";

function App() {
  const [page, setPage] = useState<PageKey>("fortelling");

  return (
    <div className="min-h-screen text-white">
      <header className="fixed inset-x-0 top-0 z-30 border-b border-white/10 bg-slate-950/60 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3 sm:px-10">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-400/20 text-sky-200 font-semibold">
              RH
            </div>
            <div className="leading-tight">
              <p className="text-sm font-semibold tracking-wide text-slate-100/80">
                Ryen Helsehus
              </p>
              <p className="text-xs text-slate-100/60">Visuell fortelling</p>
            </div>
          </div>

          <nav className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage("fortelling")}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                page === "fortelling"
                  ? "bg-white text-slate-900 shadow-lg shadow-sky-900/30"
                  : "text-white/80 hover:bg-white/10"
              }`}
            >
              Fortelling
            </button>
            <button
              type="button"
              onClick={() => setPage("medvirkning")}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                page === "medvirkning"
                  ? "bg-white text-slate-900 shadow-lg shadow-sky-900/30"
                  : "text-white/80 hover:bg-white/10"
              }`}
            >
              Medvirkning
            </button>
          </nav>
        </div>
      </header>

      <main className="pt-16">
        {page === "fortelling" ? <StoryPage /> : <CommunityPage />}
      </main>
    </div>
  );
}

export default App;
