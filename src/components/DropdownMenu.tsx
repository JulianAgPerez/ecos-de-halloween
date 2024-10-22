import { useEffect, useState } from "react";
import { getAllStoryTitles } from "../services/StoryService";
import { StoryTitleDTO } from "../types";

export const DropdownMenu = () => {
  const [storyNames, setStoryNames] = useState<StoryTitleDTO[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchStoryNames = async () => {
      try {
        const names = await getAllStoryTitles();
        setStoryNames(names);
      } catch (error) {
        console.error("Error fetching story Titles");
        setStoryNames([]);
      }
    };
    fetchStoryNames();
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed top-5 left-5 p-0.5 z-30">
      <button
        onClick={toggleMenu}
        className=" bg-gradient-to-br from-purple-600 to-purple-900 text-amber-400 text-xl p-2 rounded-full hover:from-purple-700 hover:to-purple-800 active:from-purple-900 active:to-purple-950 transition duration-1000 "
      >
        Cuentos
      </button>
      {isOpen && (
        <div className="absolute bg-white text-black shadow-md rounded mt-2">
          {storyNames.length > 0 ? (
            <ul>
              {storyNames.map((name, index) => (
                <li key={index} className="p-2 hover:bg-gray-200 bg-gray-50">
                  {name.title}
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-2">No hay cuentos disponibles</div>
          )}
        </div>
      )}
    </div>
  );
};
