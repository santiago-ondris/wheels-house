import { useNavigate } from "react-router-dom";
import Modal from "../ui/Modal";
import LoginForm from "./LoginForm";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  message?: string;
}

export default function LoginModal({ isOpen, onClose, message }: LoginModalProps) {
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    onClose();
    const token = localStorage.getItem("auth_token");
    if (token) {
      const payload = token.split('.')[1];
      const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
      const decoded = JSON.parse(atob(base64));
      navigate(`/collection/${decoded.username}`);
    }
  };

  const handleGoToRegister = () => {
    onClose();
    navigate("/register");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Iniciar sesión">
      {message && (
        <div className="mb-6 px-4 py-3 bg-accent/10 border border-accent/20 rounded-xl">
          <p className="text-accent text-sm font-bold text-center">
            Inicia sesión {message}
          </p>
        </div>
      )}
      <LoginForm onSuccess={handleLoginSuccess} />

      <div className="mt-6 text-center">
        <p className="text-white/50 text-sm">
          ¿No tenés cuenta?{" "}
          <button
            onClick={handleGoToRegister}
            className="text-accent hover:text-accent/80 font-bold transition-colors"
          >
            Registrate
          </button>
        </p>
      </div>
    </Modal>
  );
}