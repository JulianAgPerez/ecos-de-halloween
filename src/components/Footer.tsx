import { Link } from "react-router-dom";
import { FaInstagram, FaLinkedin } from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-4 mt-auto">
      <nav aria-label="Navegación del sitio">
        <ul className="flex justify-center items-center gap-6 mb-4">
          <li>
            <Link
              to="/"
              className="text-amber-400 hover:text-amber-300 transition"
            >
              Inicio
            </Link>
          </li>
          <li>
            <Link
              to="/upload-story"
              className="text-amber-400 hover:text-amber-300 transition"
            >
              Enviar tu cuento
            </Link>
          </li>
        </ul>
      </nav>
      <div className="flex justify-center items-center space-x-6">
        <a
          href="https://www.instagram.com/juli_pereh/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram de Ecos de Halloween"
        >
          <FaInstagram className="text-amber-400 hover:text-amber-500" />
        </a>
        <a
          href="https://www.linkedin.com/in/julian-perez-12b368247/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn de Ecos de Halloween"
        >
          <FaLinkedin className="text-amber-400 hover:text-amber-500" />
        </a>
      </div>
    </footer>
  );
}

export default Footer;
