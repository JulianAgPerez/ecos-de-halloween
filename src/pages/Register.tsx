import { Link, useNavigate } from "react-router-dom";
import AuthForm from "../components/auth/AuthForm";
import { registerUser } from "../services/AuthService";
import useAuthStore from "../store/useAuthStore";

const Register = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  return (
    <AuthForm
      title="Registrarse"
      submitLabel="Registrarse"
      showUsername
      onSubmit={async ({ email, username, password }) => {
        const { token } = await registerUser({
          email,
          username: username ?? email,
          password,
        });
        login(username ?? email, token);
        navigate("/");
      }}
      errorMessage="Error al registrarse. Verifica tus credenciales."
      footer={
        <>
          ¿Ya tienes una cuenta?{" "}
          <Link to="/login" className="text-amber-400 hover:text-amber-300">
            Inicia sesión aquí
          </Link>
        </>
      }
    />
  );
};

export default Register;