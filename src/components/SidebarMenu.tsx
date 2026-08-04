import { FC, useCallback, useEffect, useRef, useState } from "react";
import { getAllStoryTitles } from "../services/StoryService";
import { getAllClassicTitles } from "../services/ClassicStoryService";
import { StoryTitleDTO, ClassicStoryTitleDTO } from "../types";
import { useNavigate } from "react-router-dom";
import { fallbackTitles } from "../data/fallbackData";
import { classicFallbackTitles } from "../data/classicFallback";

export const SidebarMenu: FC = () => {
  const [storyNames, setStoryNames] = useState<StoryTitleDTO[]>([]);
  const [isFallback, setIsFallback] = useState(false);
  const [classicNames, setClassicNames] = useState<ClassicStoryTitleDTO[]>([]);
  const [isClassicFallback, setIsClassicFallback] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const timeoutRef = useRef<number | null>(null);

  const fetchStoryNames = useCallback(async () => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    try {
      const names = await getAllStoryTitles();
      if (Array.isArray(names) && names.length > 0) {
        setStoryNames(names);
        setIsFallback(false);
      } else {
        setStoryNames(fallbackTitles);
        setIsFallback(true);
      }
    } catch {
      setStoryNames(fallbackTitles);
      setIsFallback(true);
    }
  }, []);

  useEffect(() => {
    const handleStoriesUpdated = () => {
      fetchStoryNames();
    };

    window.addEventListener("stories-updated", handleStoriesUpdated);

    fetchStoryNames();
    timeoutRef.current = window.setTimeout(() => {
      setStoryNames((prev) => {
        if (prev.length === 0) {
          setIsFallback(true);
          return fallbackTitles;
        }
        return prev;
      });
    }, 5000);

    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
      window.removeEventListener("stories-updated", handleStoriesUpdated);
    };
  }, [fetchStoryNames]);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleStoryClick = (id: number) => {
    if (id === 0) navigate("/");
    else {
      navigate(`/story/${id}`);
      toggleMenu();
    }
  };

  return (
    <div>
      <button
        onClick={toggleMenu}
        className="fixed top-5 left-5 bg-gradient-to-br from-purple-600 to-purple-900 text-amber-400 text-2xl p-3 rounded-full hover:from-purple-700 hover:to-purple-800 active:from-purple-900 active:to-purple-950 transition duration-500 ease-in-out shadow-lg z-50"
      >
        ☰
      </button>
      <div
        className={`fixed top-0 left-0 h-full bg-gray-900 shadow-lg z-40 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out`}
      >
        <div className="pt-20 px-4">
          <h1 className="text-4xl text-amber-400 font-creepster mb-6 text-center">
            Cuentos de Terror
          </h1>
          {isFallback && (
            <p className="text-yellow-500 text-xs text-center mb-3">
              ⚠️ Modo sin conexión
            </p>
          )}
          <ul className="divide-y divide-gray-700 text-center text-2xl">
            <li
              className="p-4 hover:bg-gray-200 bg-gray-400 rounded transition cursor-pointer"
              onClick={() => {
                handleStoryClick(0);
                toggleMenu();
              }}
            >
              Home
            </li>
            {storyNames.map((name) => (
              <li
                key={name.id}
                className="p-4 hover:bg-gray-200 bg-gray-400 rounded transition cursor-pointer"
                onClick={() => handleStoryClick(name.id)}
              >
                {name.title}
              </li>
            ))}
          </ul>
          <h2 className="text-2xl text-amber-400 font-creepster mt-8 mb-3 text-center">
            Clásicos del Terror
          </h2>
          {isClassicFallback && (
            <p className="text-yellow-500 text-xs text-center mb-3">
              ⚠️ Clásicos sin conexión
            </p>
          )}
          <ul className="divide-y divide-gray-700 text-center text-xl">
            {classicNames.map((name) => (
              <li
                key={name.slug}
                className="p-3 hover:bg-gray-200 bg-gray-400 rounded transition cursor-pointer"
                onClick={() => {
                  navigate(`/classic/${name.slug}`);
                  toggleMenu();
                }}
              >
                {name.title}
                <span className="block text-xs text-gray-600 italic">
                  {name.author}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SidebarMenu;
