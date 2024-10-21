import { useState } from "react";

export const DropdownMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

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
          <ul>
            <li className="p-2 hover:bg-gray-200">Cuento 1</li>
            <li className="p-2 hover:bg-gray-200">Cuento 2</li>
            <li className="p-2 hover:bg-gray-200">Cuento 3</li>
          </ul>
        </div>
      )}
    </div>
  );
};
