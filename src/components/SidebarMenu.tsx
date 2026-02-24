import { FC, useEffect, useState } from "react";
import { getAllStoryTitles } from "../services/StoryService";
import { StoryTitleDTO } from "../types";
import { useNavigate } from "react-router-dom";

export const SidebarMenu: FC = () => {
  const [storyNames, setStoryNames] = useState<StoryTitleDTO[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStoryNames = async () => {
      try {
        const names = await getAllStoryTitles();
        setStoryNames(Array.isArray(names) ? names : []);
      } catch (error) {
        console.error("Error fetching story titles");
        setStoryNames([]);
      }
    };
    fetchStoryNames();
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleStoryClick = (id: number) => {
    if (id == 0) navigate("/");
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
            {storyNames.length > 0 ? (
              storyNames.map((name) => (
                <li
                  key={name.id}
                  className="p-4 hover:bg-gray-200 bg-gray-400 rounded transition cursor-pointer"
                  onClick={() => handleStoryClick(name.id)}
                >
                  {name.title}
                </li>
              ))
            ) : (
              <div className="p-3 text-amber-400 text-center">
                No hay cuentos disponibles
              </div>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SidebarMenu;
