import { FC, useCallback, useEffect, useRef, useState } from "react";
import {
  FaBookDead,
  FaBookOpen,
  FaGhost,
  FaHome,
  FaSearch,
  FaTimes,
  FaUsers,
} from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { useClassicTitles, useStoryTitles } from "../hooks/useTitles";
import { useFocusTrap } from "../hooks/useFocusTrap";
import { useSearchTitles } from "../hooks/useSearchTitles";
import { getLastRead } from "../utils/lastRead";
import { lastReadRoute } from "../utils/lastReadRoute";
import SectionHeader from "./SidebarMenu/SectionHeader";
import StoryListItem from "./SidebarMenu/StoryListItem";
import ClassicListItem from "./SidebarMenu/ClassicListItem";
import SubmitStoryCta from "./SubmitStoryCta";

const StorySkeleton: FC = () => (
  <li className="animate-pulse flex items-center gap-3 p-3">
    <div className="w-5 h-5 rounded-full bg-gray-700" />
    <div className="flex-1 h-4 rounded bg-gray-700" />
  </li>
);

export const APP_CONTENT_ID = "app-content";

export const SidebarMenu: FC = () => {
  const {
    titles: storyNames,
    isLoading: isStoriesLoading,
    isFallback,
    refresh: refreshStoryTitles,
  } = useStoryTitles();
  const {
    titles: classicNames,
    isLoading: isClassicsLoading,
    isFallback: isClassicFallback,
  } = useClassicTitles();

  const [isOpen, setIsOpen] = useState(false);
  // Montaje único: la transición de salida necesita el panel en el DOM.
  const [hasOpened, setHasOpened] = useState(false);
  const [lastRead, setLastRead] = useState(() => getLastRead());
  const {
    query,
    setQuery,
    filteredStories,
    filteredCommunity,
    filteredClassics,
    hasQuery,
  } = useSearchTitles(storyNames, classicNames);
  const [openSections, setOpenSections] = useState<{
    stories: boolean;
    community: boolean;
    classics: boolean;
  }>({ stories: true, community: true, classics: true });
  const location = useLocation();
  const panelRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const toggleButtonRef = useRef<HTMLButtonElement | null>(null);
  const isPanelMounted = isOpen || hasOpened;

  useFocusTrap(panelRef, isOpen);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
    setQuery("");
  }, [setQuery]);
  const toggleMenu = useCallback(() => {
    setHasOpened(true);
    setIsOpen((prev) => !prev);
    setQuery("");
  }, [setQuery]);

  const toggleSection = (key: "stories" | "community" | "classics") =>
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));

  useEffect(() => {
    const handleStoriesUpdated = () => {
      refreshStoryTitles();
    };

    window.addEventListener("stories-updated", handleStoriesUpdated);
    return () => {
      window.removeEventListener("stories-updated", handleStoriesUpdated);
    };
  }, [refreshStoryTitles]);

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
      // Atajo de un solo carácter: WCAG 2.1.4 exige modificador. Se ignora
      // escribiendo o con el foco en un control, o la "m" de un botón lo dispara.
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.isContentEditable
      ) {
        return;
      }
      if (!(e.ctrlKey || e.metaKey) || e.altKey) return;
      if (e.key.toLowerCase() === "m") {
        e.preventDefault();
        toggleMenu();
      }
    };
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, [toggleMenu]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Antes del efecto de foco: al cerrar hay que quitar `inert` del toggle antes
  // de moverle el foco.
  useEffect(() => {
    const appContent = document.getElementById(APP_CONTENT_ID);
    const toggle = toggleButtonRef.current;
    appContent?.toggleAttribute("inert", isOpen);
    toggle?.toggleAttribute("inert", isOpen);
    return () => {
      appContent?.removeAttribute("inert");
      toggle?.removeAttribute("inert");
    };
  }, [isOpen]);

  const prevIsOpenRef = useRef(isOpen);
  useEffect(() => {
    const wasOpen = prevIsOpenRef.current;
    prevIsOpenRef.current = isOpen;
    if (wasOpen === isOpen) return;
    if (isOpen) {
      closeButtonRef.current?.focus();
    } else {
      toggleButtonRef.current?.focus();
    }
  }, [isOpen]);

  const storyHref = (id: number) => (id === 0 ? "/" : `/story/${id}`);

  const lastReadHref = lastRead ? lastReadRoute(lastRead) : null;

  useEffect(() => {
    if (isOpen) {
      setLastRead(getLastRead());
    }
  }, [isOpen]);

  const isStoryActive = (id: number) => location.pathname === `/story/${id}`;
  const isClassicActive = (slug: string) =>
    location.pathname === `/classic/${slug}`;

  const storiesOpen = hasQuery || openSections.stories;
  const communityOpen = hasQuery || openSections.community;
  const classicsOpen = hasQuery || openSections.classics;

  return (
    <div>
      <button
        ref={toggleButtonRef}
        onClick={toggleMenu}
        title="Abrir menú (Ctrl+M / Cmd+M)"
        aria-label={
          isOpen ? "Cerrar menú de historias" : "Abrir menú de historias"
        }
        aria-expanded={isOpen}
        aria-controls="sidebar-panel"
        className="fixed top-5 left-5 bg-gradient-to-br from-purple-600 to-purple-900 text-amber-400 text-2xl p-3 rounded-full hover:from-purple-700 hover:to-purple-800 active:from-purple-900 active:to-purple-950 transition duration-500 ease-in-out shadow-lg z-50"
      >
        ☰
      </button>

      {/* Los refs se adjuntan en commit, antes que los efectos: useFocusTrap los ve. */}
      {isPanelMounted && (
        <>
          <div
            onClick={closeMenu}
            data-state={isOpen ? "open" : "closed"}
            className="sidebar-overlay fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            aria-hidden="true"
          />
          <div
            id="sidebar-panel"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Menú de historias"
            data-state={isOpen ? "open" : "closed"}
            className="sidebar-panel fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-gray-900 border-r border-purple-800/50 shadow-lg z-50 flex flex-col"
          >
            <div className="flex items-start justify-between px-5 pt-6 pb-4 border-b border-gray-700/60">
              <h2 className="text-3xl text-amber-400 font-creepster">
                Cuentos de Terror
              </h2>
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

              <Link
                to="/"
                onClick={closeMenu}
                aria-current={location.pathname === "/" ? "page" : undefined}
                className={`w-full flex cursor-pointer items-center gap-3 px-3 py-2.5 rounded-lg text-lg transition border ${
                  location.pathname === "/"
                    ? "text-amber-300 bg-custom-purple border-purple-400/60"
                    : "text-amber-400 hover:bg-custom-purple hover:text-amber-300 border-purple-800/40"
                }`}
              >
                <FaHome size={18} className="text-purple-400" />
                Home
              </Link>

              {/* Sin `data-nav-item`: es un destino fijo, no parte de la lista
                  de cuentos que se recorre con las flechas. */}
              <SubmitStoryCta
                variant="menu"
                onClick={closeMenu}
                className={`mt-2 border ${
                  location.pathname === "/upload-story"
                    ? "border-purple-400/60 bg-custom-purple"
                    : "border-purple-800/40 hover:bg-custom-purple"
                }`}
              />

              {lastReadHref && (
                <Link
                  to={lastReadHref}
                  data-nav-item
                  onClick={closeMenu}
                  aria-label={`Continuar leyendo ${lastRead?.title}`}
                  className="w-full mt-2 flex cursor-pointer items-center gap-3 px-3 py-2.5 rounded-lg text-lg transition border border-purple-800/40 text-amber-300 hover:bg-custom-purple hover:text-amber-200"
                >
                  <FaBookOpen size={18} className="text-purple-400" />
                  <span className="min-w-0 text-left">
                    <span className="block text-sm">Continuar leyendo</span>
                    <span className="block text-xs text-gray-400 italic truncate">
                      {lastRead?.title}
                    </span>
                  </span>
                </Link>
              )}
            </div>

            <div className="flex-1 overflow-y-auto px-4 pb-10 pt-3">
              <section aria-labelledby="my-stories-heading" className="mb-6">
                <SectionHeader
                  headingId="my-stories-heading"
                  listId="stories-list"
                  label="Mis Historias"
                  icon={FaGhost}
                  count={filteredStories.length}
                  open={storiesOpen}
                  onToggle={() => toggleSection("stories")}
                />

                <div
                  id="stories-list"
                  data-state={storiesOpen ? "open" : "closed"}
                  className="sidebar-section"
                >
                  <div>
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
                      <p className="text-gray-300 text-sm text-center py-4">
                        {hasQuery
                          ? `Sin resultados para "${query}"`
                          : "Aún no hay historias"}
                      </p>
                    ) : (
                      <ul className="divide-y divide-gray-700/60">
                        {filteredStories.map((name) => (
                          <StoryListItem
                            key={name.id}
                            title={name.title}
                            to={storyHref(name.id)}
                            active={isStoryActive(name.id)}
                            onClick={closeMenu}
                            query={query}
                          />
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </section>

              <section aria-labelledby="community-heading" className="mb-6">
                <SectionHeader
                  headingId="community-heading"
                  listId="community-list"
                  label="Comunidad"
                  icon={FaUsers}
                  count={filteredCommunity.length}
                  open={communityOpen}
                  onToggle={() => toggleSection("community")}
                />

                <div
                  id="community-list"
                  data-state={communityOpen ? "open" : "closed"}
                  className="sidebar-section"
                >
                  <div>
                    {isStoriesLoading ? (
                      <ul className="space-y-1">
                        {[0, 1, 2].map((i) => (
                          <StorySkeleton key={i} />
                        ))}
                      </ul>
                    ) : filteredCommunity.length === 0 ? (
                      <p className="text-gray-300 text-sm text-center py-4">
                        {hasQuery
                          ? `Sin resultados para "${query}"`
                          : "Todavía no hay cuentos de la comunidad"}
                      </p>
                    ) : (
                      <ul className="divide-y divide-gray-700/60">
                        {filteredCommunity.map((name) => (
                          <StoryListItem
                            key={name.id}
                            title={name.title}
                            to={storyHref(name.id)}
                            active={isStoryActive(name.id)}
                            onClick={closeMenu}
                            query={query}
                          />
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </section>

              <section aria-labelledby="classics-heading">
                <SectionHeader
                  headingId="classics-heading"
                  listId="classics-list"
                  label="Clásicos del Terror"
                  icon={FaBookDead}
                  count={filteredClassics.length}
                  open={classicsOpen}
                  onToggle={() => toggleSection("classics")}
                />

                <div
                  id="classics-list"
                  data-state={classicsOpen ? "open" : "closed"}
                  className="sidebar-section"
                >
                  <div>
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
                      <p className="text-gray-300 text-sm text-center py-4">
                        {hasQuery
                          ? `Sin resultados para "${query}"`
                          : "Aún no hay clásicos"}
                      </p>
                    ) : (
                      <ul className="divide-y divide-gray-700/60">
                        {filteredClassics.map((name) => (
                          <ClassicListItem
                            key={name.slug}
                            title={name.title}
                            author={name.author}
                            to={`/classic/${name.slug}`}
                            active={isClassicActive(name.slug)}
                            onClick={closeMenu}
                            query={query}
                          />
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </section>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SidebarMenu;
