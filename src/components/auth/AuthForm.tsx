import { FC, FormEvent, ReactNode, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import GhostLoader from "../GhostLoader";
import AnimatedBackground from "../AnimatedBackground";

export interface AuthCredentials {
  email: string;
  password: string;
  username?: string;
}

interface AuthFormProps {
  title: string;
  submitLabel: string;
  showUsername?: boolean;
  onSubmit: (credentials: AuthCredentials) => Promise<void>;
  errorMessage: string;
  footer: ReactNode;
}

const inputClass =
  "w-full p-2 bg-gray-900 border border-purple-800 rounded text-gray-100 placeholder-gray-500 focus:outline-none focus:border-amber-400";
const submitClass =
  "w-full bg-gradient-to-br from-purple-600 to-purple-900 text-amber-400 py-2 rounded hover:from-purple-700 hover:to-purple-800 transition duration-300";

const AuthForm: FC<AuthFormProps> = ({
  title,
  submitLabel,
  showUsername = false,
  onSubmit,
  errorMessage,
  footer,
}) => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await onSubmit({
        email,
        password,
        username: showUsername ? username : undefined,
      });
    } catch {
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <GhostLoader />;

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4">
      <AnimatedBackground />
      <div className="relative z-10 w-full max-w-md bg-custom-purple/95 border border-purple-700 shadow-2xl rounded-lg p-8">
        <h2 className="font-creepster text-4xl text-amber-400 text-center mb-6">
          {title}
        </h2>
        {error && <p className="text-red-400 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          {showUsername && (
            <div className="mb-4">
              <label className="block text-gray-300 mb-2" htmlFor="username">
                Nombre de Usuario
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className={inputClass}
                placeholder="Introduce tu nombre de usuario"
              />
            </div>
          )}
          <div className="mb-4">
            <label className="block text-gray-300 mb-2" htmlFor="email">
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={inputClass}
              placeholder="Introduce tu correo"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-300 mb-2" htmlFor="password">
              Contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={`${inputClass} pr-10`}
                placeholder="Introduce tu contraseña"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={
                  showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                }
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-amber-400"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          <button type="submit" className={submitClass}>
            {submitLabel}
          </button>
        </form>
        <p className="text-center text-gray-400 mt-4">{footer}</p>
      </div>
    </div>
  );
};

export default AuthForm;