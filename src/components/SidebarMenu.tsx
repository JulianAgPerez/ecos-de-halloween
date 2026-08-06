import {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  FaBookDead,
  FaBookOpen,
  FaChevronDown,
  FaGhost,
  FaHome,
  FaSearch,
  FaTimes,
} from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import useTitlesStore from "../store/useTitlesStore";
import { getLastRead } from "../utils/lastRead";

const StorySkeleton: FC = () => (
  <li className="animate-pulse flex items-center gap-3 p-3">
    <div className="w-5 h-5 rounded-full bg-gray-700" />
    <div className="flex-1 h-4 rounded bg-gray-700" />
  </li>
);

const Highlight: FC<{ text: string; query: string }> = ({ text, query }) => {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return <>{text}</>;
  const index = text.toLowerCase().indexOf(normalizedQuery);
  if (index === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, index)}
      <mark className="bg-amber-400/30 text-amber-200 rounded px-0.5">
        {text.slice(index, index + normalizedQuery.length)}
      </mark>
      {text.slice(index + normalizedQuery.length)}
    </>
  );
};

export const SidebarMenu: FC = () => {
  const storyNames = useTitlesStore((s) => s.storyTitles);
  const classicNames = useTitlesStore((s) => s.classicTitles);
  const isStoriesLoading = useTitlesStore((s) => s.isStoriesLoading);
  const isClassicsLoading = useTitlesStore((s) => s.isClassicsLoading);
  const isFallback = useTitlesStore((s) => s.isStoriesFallback);
  const isClassicFallback = useTitlesStore((s) => s.isClassicsFallback);
  const fetchStoryTitles = useTitlesStore((s) => s.fetchStoryTitles);
  const fetchClassicTitles = useTitlesStore((s) => s.fetchClassicTitles);
  const refreshStoryTitles = useTitlesStore((s) => s.refreshStoryTitles);
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [lastRead, setLastRead] = useState(() => getLastRead());
  const [openSections, setOpenSections] = useState<{
    stories: boolean;
    classics: boolean;
  }>({ stories: true, classics: true });
  const navigate = useNavigate();
  const location = useLocation();
  const panelRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const toggleButtonRef = useRef<HTMLButtonElement | null>(null);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
    setQuery("");
  }, []);
  const toggleMenu = () => setIsOpen((prev) => !prev);

  const toggleSection = (key: "stories" | "classics") =>
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));

  useEffect(() => {
    const handleStoriesUpdated = () => {
      refreshStoryTitles();
    };

    window.addEventListener("stories-updated", handleStoriesUpdated);

    fetchStoryTitles();

    return () => {
      window.removeEventListener("stories-updated", handleStoriesUpdated);
    };
  }, [fetchStoryTitles, refreshStoryTitles]);

  useEffect(() => {
    fetchClassicTitles();
  }, [fetchClassicTitles]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeMenu]);

  useEffect(() => {
    const handleShortcut = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }
      if (e.key.toLowerCase() === "m") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const panel = panelRef.current;
    if (!panel) return;
    const focusables = panel.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    if (focusables.length === 0) return;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
        return;
      }
      if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
      const items = Array.from(
        panel.querySelectorAll<HTMLButtonElement>("[data-nav-item]"),
      );
      if (items.length === 0) return;
      const currentIndex = items.indexOf(
        document.activeElement as HTMLButtonElement,
      );
      if (currentIndex === -1) return;
      e.preventDefault();
      const delta = e.key === "ArrowDown" ? 1 : -1;
      const nextIndex = (currentIndex + delta + items.length) % items.length;
      items[nextIndex].focus();
    };

    panel.addEventListener("keydown", handleKeyDown);
    return () => panel.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      closeButtonRef.current?.focus();
    } else {
      toggleButtonRef.current?.focus();
    }
  }, [isOpen]);

  const handleStoryClick = (id: number) => {
    if (id === 0) {
      navigate("/");
    } else {
      navigate(`/story/${id}`);
    }
    closeMenu();
  };

  const handleClassicClick = (slug: string) => {
    navigate(`/classic/${slug}`);
    closeMenu();
  };

  const handleLastReadClick = () => {
    if (!lastRead) return;
    if (lastRead.type === "classic" && lastRead.slug) {
      navigate(`/classic/${lastRead.slug}`);
    } else if (lastRead.type === "story" && lastRead.id !== undefined) {
      navigate(`/story/${lastRead.id}`);
    }
    closeMenu();
  };

  useEffect(() => {
    if (isOpen) {
      setLastRead(getLastRead());
    }
  }, [isOpen]);

  const isStoryActive = (id: number) => location.pathname === `/story/${id}`;
  const isClassicActive = (slug: string) =>
    location.pathname === `/classic/${slug}`;

  const normalizedQuery = query.trim().toLowerCase();

  const filteredStories = useMemo(() => {
    const sorted = [...storyNames].sort((a, b) =>
      a.title.localeCompare(b.title, "es"),
    );
    if (!normalizedQuery) return sorted;
    return sorted.filter((story) =>
      story.title.toLowerCase().includes(normalizedQuery),
    );
  }, [storyNames, normalizedQuery]);

  const filteredClassics = useMemo(() => {
    const sorted = [...classicNames].sort((a, b) =>
      a.title.localeCompare(b.title, "es"),
    );
    if (!normalizedQuery) return sorted;
    return sorted.filter(
      (classic) =>
        classic.title.toLowerCase().includes(normalizedQuery) ||
        classic.author.toLowerCase().includes(normalizedQuery),
    );
  }, [classicNames, normalizedQuery]);

  const hasQuery = normalizedQuery.length > 0;

  const storiesOpen = hasQuery || openSections.stories;
  const classicsOpen = hasQuery || openSections.classics;

  return (
    <div>
      <button
        ref={toggleButtonRef}
        onClick={toggleMenu}
        title="Abrir menú (M)"
        aria-label={isOpen ? "Cerrar menú de historias" : "Abrir menú de historias"}
        aria-expanded={isOpen}
        aria-controls="sidebar-panel"
        className="fixed top-5 left-5 bg-gradient-to-br from-purple-600 to-purple-900 text-amber-400 text-2xl p-3 rounded-full hover:from-purple-700 hover:to-purple-800 active:from-purple-900 active:to-purple-950 transition duration-500 ease-in-out shadow-lg z-50"
      >
        ☰
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={closeMenu}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              aria-hidden="true"
            />
            <motion.div
              id="sidebar-panel"
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-label="Menú de historias"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-gray-900 border-r border-purple-800/50 shadow-lg z-50 flex flex-col"
            >
              <div className="flex items-start justify-between px-5 pt-6 pb-4 border-b border-gray-700/60">
                <h1 className="text-3xl text-amber-400 font-creepster">
                  Cuentos de Terror
                </h1>
                <button
                  ref={closeButtonRef}
                  onClick={closeMenu}
                  aria-label="Cerrar menú"
                  className="p-2 -m-1 text-amber-400 hover:text-white hover:bg-purple-800/40 rounded-full transition"
                >
                  <FaTimes size={20} />
                </button>
              </div>

              <div className="shrink-0 px-4 pt-4 pb-3 border-b border-gray-700/60">
                <label className="relative block mb-3">
                  <FaSearch
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                  />
                  <input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Buscar historias o autores..."
                    aria-label="Buscar historias"
                    className="w-full bg-custom-purple border border-purple-700 rounded-lg pl-9 pr-3 py-2 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/40"
                  />
                </label>

                <button
                  onClick={() => handleStoryClick(0)}
                  aria-current={location.pathname === "/" ? "page" : undefined}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-lg transition border ${
                    location.pathname === "/"
                      ? "text-amber-300 bg-custom-purple border-purple-400/60"
                      : "text-amber-400 hover:bg-custom-purple hover:text-amber-300 border-purple-800/40"
                  }`}
                >
                  <FaHome size={18} className="text-purple-400" />
                  Home
                </button>

                {lastRead && (
                  <button
                    data-nav-item
                    onClick={handleLastReadClick}
                    aria-label={`Continuar leyendo ${lastRead.title}`}
                    className="w-full mt-2 flex items-center gap-3 px-3 py-2.5 rounded-lg text-lg transition border border-purple-800/40 text-amber-300 hover:bg-custom-purple hover:text-amber-200"
                  >
                    <FaBookOpen size={18} className="text-purple-400" />
                    <span className="min-w-0 text-left">
                      <span className="block text-sm">
                        Continuar leyendo
                      </span>
                      <span className="block text-xs text-gray-400 italic truncate">
                        {lastRead.title}
                      </span>
                    </span>
                  </button>
                )}
              </div>

              <div className="flex-1 overflow-y-auto px-4 pb-10 pt-3">
                <section aria-labelledby="my-stories-heading" className="mb-6">
                  <h2 id="my-stories-heading" className="sr-only">
                    Mis Historias
                  </h2>
                  <button
                    type="button"
                    onClick={() => toggleSection("stories")}
                    aria-expanded={storiesOpen}
                    aria-controls="stories-list"
                    className="sticky top-0 bg-gray-900 z-10 w-full flex items-center justify-between gap-2 py-2 text-left"
                  >
                    <span className="flex items-center gap-2 text-amber-400 font-creepster text-xl">
                      <FaGhost size={16} className="text-purple-400" />
                      Mis Historias
                    </span>
                    <span className="flex items-center gap-2 text-xs text-gray-400">
                      {filteredStories.length}
                      <motion.span
                        animate={{ rotate: storiesOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <FaChevronDown size={14} className="text-amber-400" />
                      </motion.span>
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {storiesOpen && (
                      <motion.div
                        id="stories-list"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        {isFallback && (
                          <p className="text-yellow-500 text-xs text-center mb-3">
                            ⚠️ Modo sin conexión
                          </p>
                        )}

                        {isStoriesLoading ? (
                          <ul className="space-y-1">
                            {[0, 1, 2].map((i) => (
                              <StorySkeleton key={i} />
                            ))}
                          </ul>
                        ) : filteredStories.length === 0 ? (
                          <p className="text-gray-500 text-sm text-center py-4">
                            {hasQuery
                              ? `Sin resultados para "${query}"`
                              : "Aún no hay historias"}
                          </p>
                        ) : (
                          <ul className="divide-y divide-gray-700/60">
                            {filteredStories.map((name) => (
                              <li key={name.id}>
                                <button
                                  data-nav-item
                                  onClick={() => handleStoryClick(name.id)}
                                  aria-current={
                                    isStoryActive(name.id) ? "page" : undefined
                                  }
                                  className={`w-full flex items-center gap-3 px-3 py-2.5 text-left rounded-lg text-base transition ${
                                    isStoryActive(name.id)
                                      ? "bg-custom-purple text-amber-300"
                                      : "text-gray-200 hover:bg-custom-purple hover:text-amber-300"
                                  }`}
                                >
                                  <FaGhost
                                    size={14}
                                    className="text-purple-400 shrink-0"
                                  />
                                  <span className="truncate">
                                    <Highlight
                                      text={name.title}
                                      query={query}
                                    />
                                  </span>
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </section>

                <section aria-labelledby="classics-heading">
                  <h2 id="classics-heading" className="sr-only">
                    Clásicos del Terror
                  </h2>
                  <button
                    type="button"
                    onClick={() => toggleSection("classics")}
                    aria-expanded={classicsOpen}
                    aria-controls="classics-list"
                    className="sticky top-0 bg-gray-900 z-10 w-full flex items-center justify-between gap-2 py-2 text-left"
                  >
                    <span className="flex items-center gap-2 text-amber-400 font-creepster text-xl">
                      <FaBookDead size={16} className="text-purple-400" />
                      Clásicos del Terror
                    </span>
                    <span className="flex items-center gap-2 text-xs text-gray-400">
                      {filteredClassics.length}
                      <motion.span
                        animate={{ rotate: classicsOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <FaChevronDown size={14} className="text-amber-400" />
                      </motion.span>
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {classicsOpen && (
                      <motion.div
                        id="classics-list"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        {isClassicFallback && (
                          <p className="text-yellow-500 text-xs text-center mb-3">
                            ⚠️ Clásicos sin conexión
                          </p>
                        )}

                        {isClassicsLoading ? (
                          <ul className="space-y-1">
                            {[0, 1, 2].map((i) => (
                              <StorySkeleton key={i} />
                            ))}
                          </ul>
                        ) : filteredClassics.length === 0 ? (
                          <p className="text-gray-500 text-sm text-center py-4">
                            {hasQuery
                              ? `Sin resultados para "${query}"`
                              : "Aún no hay clásicos"}
                          </p>
                        ) : (
                          <ul className="divide-y divide-gray-700/60">
                            {filteredClassics.map((name) => (
                              <li key={name.slug}>
                                <button
                                  data-nav-item
                                  onClick={() => handleClassicClick(name.slug)}
                                  aria-current={
                                    isClassicActive(name.slug)
                                      ? "page"
                                      : undefined
                                  }
                                  className={`w-full flex items-center gap-3 px-3 py-2.5 text-left rounded-lg text-base transition ${
                                    isClassicActive(name.slug)
                                      ? "bg-custom-purple text-amber-300"
                                      : "text-gray-200 hover:bg-custom-purple hover:text-amber-300"
                                  }`}
                                >
                                  <FaBookDead
                                    size={14}
                                    className="text-purple-400 shrink-0"
                                  />
                                  <span className="min-w-0">
                                    <span className="block truncate">
                                      <Highlight
                                        text={name.title}
                                        query={query}
                                      />
                                    </span>
                                    <span className="block text-xs text-gray-400 italic truncate">
                                      <Highlight
                                        text={name.author}
                                        query={query}
                                      />
                                    </span>
                                  </span>
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </section>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SidebarMenu;
