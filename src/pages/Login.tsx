import { Link, useNavigate } from "react-router-dom";
import AuthForm from "../components/auth/AuthForm";
import { loginUser } from "../services/AuthService";
import { useSeo } from "../hooks/useSeo";
import useAuthStore from "../store/useAuthStore";

const Login = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  useSeo({
    title: "Iniciar Sesión",
    description: "Entrá a Ecos de Halloween para leer y subir tus propios cuentos.",
    noindex: true,
  });

  return (
    <AuthForm
      title="Iniciar Sesión"
      submitLabel="Iniciar Sesión"
      onSubmit={async ({ email, password }) => {
        const { token } = await loginUser({ email, password });
        login(email, token);
        navigate("/");
      }}
      errorMessage="Error al iniciar sesión. Verifica tus credenciales."
      footer={
        <>
          ¿No tienes una cuenta?{" "}
          <Link to="/register" className="text-amber-400 hover:text-amber-300">
            Regístrate aquí
          </Link>
        </>
      }
    />
  );
};

export default Login;